// Cloudflare 官方標準配置（重構版 - 基於新的攻擊判斷流程）
// 基於 Cloudflare 官方文件 (cloudflare-docs/stages/stage-4-security-products/)
// 參考: traffic-detections.md, waf.md, reference.md
// 新增: OWASP TOP 10 2021 + SecurityAction 多層判斷

/**
 * WAF Attack Score 官方定義
 * 來源: https://developers.cloudflare.com/waf/detections/attack-score/
 * 
 * 分數範圍: 1-99
 * - 1 = 幾乎確定是惡意的 (almost certainly malicious)
 * - 99 = 很可能是乾淨的 (likely clean)
 * - 100 = Cloudflare WAF 沒有評分 (did not score)
 * - 0 或 undefined = 未評分
 */

// WAF Attack Score 分類標準（官方定義）
const WAF_SCORE_CLASSIFICATION = {
  ATTACK: {
    range: [1, 20],
    label: 'attack',
    displayName: '攻擊',
    severity: 'critical',
    color: 'red',
    description: '幾乎確定是惡意攻擊'
  },
  LIKELY_ATTACK: {
    range: [21, 50],
    label: 'likely_attack',
    displayName: '可能攻擊',
    severity: 'high',
    color: 'orange',
    description: '可能是攻擊（注意：此範圍容易有誤報）'
  },
  LIKELY_CLEAN: {
    range: [51, 80],
    label: 'likely_clean',
    displayName: '可能正常',
    severity: 'medium',
    color: 'yellow',
    description: '可能是正常流量'
  },
  CLEAN: {
    range: [81, 99],
    label: 'clean',
    displayName: '正常',
    severity: 'low',
    color: 'green',
    description: '很可能是正常流量'
  },
  UNSCORED: {
    range: [0, 0, 100],  // 0, 100, undefined
    label: 'unscored',
    displayName: '未評分',
    severity: 'info',
    color: 'gray',
    description: 'Cloudflare WAF 沒有評分此請求'
  }
};

/**
 * SecurityAction 分類標準（基於新的判斷流程）
 */
const SECURITY_ACTION_CLASSIFICATION = {
  // 阻擋 / 終止類（已阻擋 = 低風險）
  BLOCKED: {
    actions: ['block', 'connectionClose', 'connection_close'],
    severity: 'low',
    description: '攻擊已被 Cloudflare 成功阻擋',
    requiresAction: false,
    aiAnalysisType: 'summary_only'
  },
  
  // 互動式挑戰類（中風險，需監控）
  CHALLENGE: {
    actions: [
      'challenge', 
      'jschallenge', 
      'js_challenge',
      'managedChallenge', 
      'managed_challenge'
    ],
    severity: 'medium',
    description: 'Cloudflare 已對請求發出挑戰',
    requiresAction: false,
    aiAnalysisType: 'monitoring'
  },
  
  // 挑戰已通過 / 放行類（需要檢查 WAF Score）
  CHALLENGE_PASSED: {
    actions: [
      'challengeSolved',
      'challengeBypassed',
      'jschallengeSolved',
      'jschallengeBypassed',
      'managedChallengeNonInteractiveSolved',
      'managedChallengeInteractiveSolved',
      'managedChallengeBypassed'
    ],
    severity: 'low',
    description: '挑戰已通過',
    requiresAction: false,
    aiAnalysisType: 'none'
  },
  
  // 限制 / 緩解類（DDoS / Rate Limiting）
  RATE_LIMIT: {
    actions: ['rateLimit', 'rate_limit', 'l7ddos', 'botFight', 'bot_fight'],
    severity: 'medium',
    description: '觸發流量限制或 DDoS 緩解',
    requiresAction: false,
    aiAnalysisType: 'summary_only'
  },
  
  // 純紀錄類（需要進一步判斷）
  LOG: {
    actions: ['log'],
    severity: 'unknown',  // 需要進一步判斷
    description: '僅記錄，未採取阻擋動作',
    requiresAction: true,  // 需要進一步分析
    aiAnalysisType: 'deep_analysis'
  },
  
  // 允許 / 放行類（需要檢查 WAF Score）
  ALLOW: {
    actions: ['allow', 'bypass', 'unknown', 'skip'],
    severity: 'info',
    description: '請求被允許通過',
    requiresAction: false,
    aiAnalysisType: 'none'
  }
};

/**
 * OWASP TOP 10 2021 攻擊模式庫
 */
const OWASP_TOP10_PATTERNS = {
  // A01:2021 - Broken Access Control（存取控制失效）
  BROKEN_ACCESS_CONTROL: {
    category: 'A01:2021',
    name: 'Broken Access Control',
    patterns: [
      '/admin', '/administrator', '/wp-admin', '/phpmyadmin', 
      '/cpanel', '/manager/html', '/console', '/dashboard',
      '/.git', '/.svn', '/.env', '/.aws',
      '/config', '/backup', '/old', '/test'
    ]
  },
  
  // A03:2021 - Injection（注入攻擊）
  SQL_INJECTION: {
    category: 'A03:2021',
    name: 'SQL Injection',
    patterns: [
      'union select', 'union+select', 'union%20select',
      'or 1=1', 'or 1=2', 'or+1=1',
      '\' or \'', '\" or \"', '\' or 1=1', '\" or 1=1',
      '; drop table', '; drop database',
      'exec(', 'execute(', 'xp_cmdshell', 'sp_executesql',
      '--', '#', '/*', '*/',
      'information_schema', 'sysobjects', 'syscolumns'
    ]
  },
  
  XSS: {
    category: 'A03:2021',
    name: 'Cross-Site Scripting (XSS)',
    patterns: [
      '<script', '</script>', '<script>', '</script>',
      'javascript:', 'onerror=', 'onload=', 'onclick=',
      '<iframe', '</iframe>', '<embed', '<object',
      'alert(', 'prompt(', 'confirm(',
      'document.cookie', 'document.write', 'document.domain',
      'eval(', 'expression(', 'vbscript:',
      '<img src=x onerror=', '<body onload='
    ]
  },
  
  COMMAND_INJECTION: {
    category: 'A03:2021',
    name: 'Command Injection',
    patterns: [
      '|cat', '|ls', '|pwd', '|id', '|whoami',
      ';cat', ';ls', ';pwd', ';id', ';whoami',
      '&cat', '&ls', '&&', '||',
      '`cat', '`ls', '$(cat', '$(ls',
      '/bin/bash', '/bin/sh', 'cmd.exe', 'powershell'
    ]
  },
  
  // A01:2021 - Path Traversal（路徑遍歷）
  PATH_TRAVERSAL: {
    category: 'A01:2021',
    name: 'Path Traversal',
    patterns: [
      '../', '..\\', '..%2f', '..%5c',
      '%2e%2e/', '%2e%2e%5c', '..../', '....',
      '/etc/passwd', '/etc/shadow', '/windows/system32',
      'c:\\windows', 'c:\\winnt',
      '.htaccess', '.htpasswd', 'web.config', 'wp-config.php'
    ]
  },
  
  // A07:2021 - Authentication Failures（認證失效）
  AUTH_BYPASS: {
    category: 'A07:2021',
    name: 'Authentication Bypass',
    patterns: [
      '/login', '/signin', '/auth', '/authenticate',
      'admin=true', 'role=admin', 'user=admin',
      'authenticated=true', 'isadmin=1'
    ]
  },
  
  // A10:2021 - Server-Side Request Forgery (SSRF)
  SSRF: {
    category: 'A10:2021',
    name: 'Server-Side Request Forgery',
    patterns: [
      'file://', 'gopher://', 'dict://', 'ftp://', 'sftp://',
      'localhost', '127.0.0.1', '0.0.0.0',
      '169.254.169.254',  // AWS metadata
      'metadata.google.internal'  // GCP metadata
    ]
  }
};

/**
 * 惡意 User-Agent 特徵庫
 */
const MALICIOUS_USER_AGENT_PATTERNS = {
  // 掃描工具
  SCANNERS: {
    patterns: ['sqlmap', 'nikto', 'nmap', 'masscan', 'zap', 'burp', 'metasploit', 
               'acunetix', 'nessus', 'openvas', 'w3af', 'dirbuster', 'gobuster',
               'wfuzz', 'ffuf', 'nuclei', 'wpscan'],
    severity: 'critical',
    description: '已知的網路安全掃描工具'
  },
  
  // 漏洞利用工具
  EXPLOIT_TOOLS: {
    patterns: ['exploit', 'payload', 'shellshock', 'struts'],
    severity: 'critical',
    description: '漏洞利用工具'
  },
  
  // 自動化腳本（需要結合其他條件判斷）
  AUTOMATED_SCRIPTS: {
    patterns: ['python-requests', 'go-http-client', 'java/', 'perl', 'ruby'],
    severity: 'medium',
    description: '自動化腳本（需要結合其他條件判斷）'
  },
  
  // 合法但需要監控的工具
  LEGITIMATE_TOOLS: {
    patterns: ['curl', 'wget', 'postman', 'insomnia'],
    severity: 'low',
    description: '合法工具但可能被濫用'
  }
};

/**
 * Cloudflare 內部端點列表
 */
const CLOUDFLARE_INTERNAL_PATHS = [
  '/cdn-cgi/',
  '/__cf_',
  '/cdn-cgi/access/',
  '/cdn-cgi/scripts/',
  '/cdn-cgi/rum',
  '/cdn-cgi/beacon/',
  '/cdn-cgi/trace',
  '/cdn-cgi/challenge-platform/',
];

/**
 * 官方建議的高風險閾值
 */
const RECOMMENDED_THRESHOLDS = {
  CRITICAL: 10,
  HIGH: 20,
  MEDIUM: 50,
  STRICT: 15
};

// ==================== 核心判斷函數 ====================

/**
 * 分類 SecurityAction
 * @param {string|array} action - SecurityAction 或 SecurityActions[]
 * @returns {object} 分類結果
 */
function classifySecurityAction(action) {
  // 處理陣列情況（SecurityActions[]）
  const actions = Array.isArray(action) ? action : [action];
  
  // 優先級判斷（按照嚴重程度）
  for (const [type, config] of Object.entries(SECURITY_ACTION_CLASSIFICATION)) {
    for (const act of actions) {
      if (config.actions.includes((act || '').toLowerCase())) {
        return {
          type: type,
          action: act,
          ...config
        };
      }
    }
  }
  
  // 未知類型，歸類為 ALLOW
  return {
    type: 'ALLOW',
    action: action,
    ...SECURITY_ACTION_CLASSIFICATION.ALLOW
  };
}

/**
 * 分析 URI 模式（基於 OWASP TOP 10 2021）
 * @param {string} uri - 請求 URI
 * @returns {object} 分析結果
 */
function analyzeURIPattern(uri) {
  if (!uri || typeof uri !== 'string') {
    return { isSuspicious: false };
  }
  
  const lowerURI = uri.toLowerCase();
  
  // 檢查各種 OWASP 攻擊模式
  for (const [attackType, config] of Object.entries(OWASP_TOP10_PATTERNS)) {
    for (const pattern of config.patterns) {
      if (lowerURI.includes(pattern.toLowerCase())) {
        return {
          isSuspicious: true,
          attackType: attackType,
          owaspCategory: config.category,
          owaspName: config.name,
          matchedPattern: pattern,
          severity: attackType.includes('SQL') || attackType.includes('COMMAND') ? 'critical' : 'high'
        };
      }
    }
  }
  
  return { isSuspicious: false };
}

/**
 * 分析 User-Agent（基於攻擊工具特徵）
 * @param {string} userAgent - User-Agent 字串
 * @returns {object} 分析結果
 */
function analyzeUserAgent(userAgent) {
  if (!userAgent) {
    return { 
      isSuspicious: true, 
      reason: 'Empty User-Agent',
      severity: 'medium',
      category: 'SUSPICIOUS'
    };
  }
  
  const lowerUA = userAgent.toLowerCase();
  
  // 檢查惡意工具特徵
  for (const [category, config] of Object.entries(MALICIOUS_USER_AGENT_PATTERNS)) {
    for (const pattern of config.patterns) {
      if (lowerUA.includes(pattern)) {
        // 合法工具不直接判定為可疑
        if (category === 'LEGITIMATE_TOOLS') {
          return {
            isSuspicious: false,
            isAutomatedTool: true,
            toolName: pattern,
            category: category,
            severity: config.severity,
            note: '合法自動化工具，需要結合其他條件判斷'
          };
        }
        
        return {
          isSuspicious: true,
          attackType: category,
          matchedTool: pattern,
          severity: config.severity,
          reason: config.description
        };
      }
    }
  }
  
  // 異常長度檢查
  if (userAgent.length < 10) {
    return {
      isSuspicious: true,
      reason: 'User-Agent 過短（可能是偽造）',
      severity: 'medium',
      category: 'SUSPICIOUS'
    };
  }
  
  if (userAgent.length > 500) {
    return {
      isSuspicious: true,
      reason: 'User-Agent 過長（可能是攻擊 payload）',
      severity: 'high',
      category: 'SUSPICIOUS'
    };
  }
  
  return { isSuspicious: false };
}

/**
 * 檢查 WAF 分數是否低於閾值（< 20 = 確定攻擊）
 * @param {object} log - 日誌條目
 * @returns {boolean} 是否有低分數
 */
function hasLowWAFScore(log) {
  return (
    (isValidWAFScore(log.wafSQLiScore) && log.wafSQLiScore < 20) ||
    (isValidWAFScore(log.wafXSSScore) && log.wafXSSScore < 20) ||
    (isValidWAFScore(log.wafRCEScore) && log.wafRCEScore < 20) ||
    (isValidWAFScore(log.wafAttackScore) && log.wafAttackScore < 20)
  );
}

/**
 * 識別攻擊類型（基於 WAF Score）
 * @param {object} log - 日誌條目
 * @returns {string} 攻擊類型
 */
function identifyAttackType(log) {
  const types = [];
  
  if (isValidWAFScore(log.wafSQLiScore) && log.wafSQLiScore < 20) {
    types.push('SQL_INJECTION');
  }
  
  if (isValidWAFScore(log.wafXSSScore) && log.wafXSSScore < 20) {
    types.push('XSS');
  }
  
  if (isValidWAFScore(log.wafRCEScore) && log.wafRCEScore < 20) {
    types.push('RCE');
  }
  
  if (types.length === 0 && isValidWAFScore(log.wafAttackScore) && log.wafAttackScore < 20) {
    types.push('GENERAL_ATTACK');
  }
  
  return types.length > 0 ? types.join(' + ') : 'UNKNOWN';
}

/**
 * 多層威脅判斷系統（基於新的判斷流程）
 * @param {object} log - 日誌條目
 * @returns {object} 威脅判定結果
 */
function analyzeThreatLevel(log) {
  // 第一層：SecurityAction 分類
  const actionClass = classifySecurityAction(log.securityAction || log.securityActions);
  
  // 1. block / connectionClose → 低風險（已阻擋）
  if (actionClass.type === 'BLOCKED') {
    return {
      isThreat: true,
      isBlocked: true,
      severity: 'low',
      category: 'BLOCKED_ATTACK',
      reason: '攻擊已被成功封鎖',
      requiresAction: false,
      aiAnalysisType: 'summary_only',
      securitySources: log.securitySources || [],
      securityAction: actionClass.action
    };
  }
  
  // 2. challenge → 中風險（挑戰中）
  if (actionClass.type === 'CHALLENGE') {
    return {
      isThreat: true,
      isBlocked: false,
      severity: 'medium',
      category: 'CHALLENGED',
      reason: 'Cloudflare 已發出挑戰',
      requiresAction: false,
      aiAnalysisType: 'monitoring',
      securitySources: log.securitySources || [],
      securityAction: actionClass.action
    };
  }
  
  // 3. rateLimit / l7ddos → 限制類
  if (actionClass.type === 'RATE_LIMIT') {
    return {
      isThreat: true,
      isBlocked: true,
      severity: 'medium',
      category: 'RATE_LIMITED',
      reason: '觸發流量限制規則',
      requiresAction: false,
      aiAnalysisType: 'summary_only',
      securitySources: log.securitySources || [],
      securityAction: actionClass.action
    };
  }
  
  // 4. log → 需要進一步判斷
  if (actionClass.type === 'LOG') {
    // 第二層：WAF Score < 20 = 確定攻擊
    if (hasLowWAFScore(log)) {
      return {
        isThreat: true,
        isBlocked: false,
        severity: 'critical',
        category: 'CONFIRMED_ATTACK',
        reason: 'WAF Score < 20，幾乎確定是攻擊',
        requiresAction: true,
        aiAnalysisType: 'full_analysis',
        attackType: identifyAttackType(log),
        securitySources: log.securitySources || [],
        securityAction: actionClass.action
      };
    }
    
    // 第三層：URI / UA 判斷（WAF Score >= 20）
    const uriAnalysis = analyzeURIPattern(log.requestURI);
    const uaAnalysis = analyzeUserAgent(log.userAgent);
    
    if (uriAnalysis.isSuspicious || uaAnalysis.isSuspicious) {
      // 檢查 SecurityRuleDescription 是否有 "log" 字眼
      const ruleDesc = (log.securityRuleDescription || '').toLowerCase();
      const isLogRule = ruleDesc.includes('log');
      
      if (isLogRule) {
        // 3a. 有 "log" 字眼 = 安全連線（持續監控）
        return {
          isThreat: false,
          isBlocked: false,
          severity: 'medium',
          category: 'SAFE_CONNECTION',
          reason: 'SecurityRuleDescription 包含 "log"，判定為安全連線',
          requiresAction: false,
          aiAnalysisType: 'monitoring',
          securityRuleDescription: log.securityRuleDescription,
          uriAnalysis: uriAnalysis,
          uaAnalysis: uaAnalysis
        };
      } else {
        // 3b. 無 "log" 字眼 = 確認攻擊
        return {
          isThreat: true,
          isBlocked: false,
          severity: 'high',
          category: 'CONFIRMED_ATTACK',
          reason: `URI 或 User-Agent 符合攻擊特徵`,
          requiresAction: true,
          aiAnalysisType: 'full_analysis',
          attackType: uriAnalysis.attackType || uaAnalysis.attackType || 'UNKNOWN',
          uriAnalysis: uriAnalysis,
          uaAnalysis: uaAnalysis,
          securityRuleDescription: log.securityRuleDescription
        };
      }
    }
    
    // WAF Score >= 20 且 URI/UA 正常 = 正常流量
    return {
      isThreat: false,
      isBlocked: false,
      severity: 'info',
      category: 'NORMAL_TRAFFIC',
      reason: 'WAF Score >= 20 且無攻擊特徵',
      requiresAction: false,
      aiAnalysisType: 'none'
    };
  }
  
  // 5. allow / bypass / challenge passed → 需要檢查 WAF Score
  if (actionClass.type === 'ALLOW' || actionClass.type === 'CHALLENGE_PASSED') {
    // 只在 WAF Score < 30 時納入分析
    if (hasLowWAFScore(log)) {
      return {
        isThreat: true,
        isBlocked: false,
        severity: 'high',
        category: 'BYPASSED_ATTACK',
        reason: 'WAF Score < 20 但請求被放行',
        requiresAction: true,
        aiAnalysisType: 'full_analysis',
        attackType: identifyAttackType(log),
        securityAction: actionClass.action
      };
    }
    
    // 正常流量
    return {
      isThreat: false,
      isBlocked: false,
      severity: 'info',
      category: 'NORMAL_TRAFFIC',
      reason: '請求被允許通過且 WAF Score 正常',
      requiresAction: false,
      aiAnalysisType: 'none'
    };
  }
  
  // 預設：正常流量
  return {
    isThreat: false,
    isBlocked: false,
    severity: 'info',
    category: 'NORMAL_TRAFFIC',
    reason: '所有檢查均通過',
    requiresAction: false,
    aiAnalysisType: 'none'
  };
}

// ==================== 輔助函數 ====================

/**
 * 分類 WAF Attack Score
 * @param {number} score - WAF 分數 (0-100 或 undefined)
 * @returns {object} 分類資訊
 */
function classifyWAFScore(score) {
  if (score === undefined || score === null) {
    return WAF_SCORE_CLASSIFICATION.UNSCORED;
  }
  
  if (score === 0 || score === 100) {
    return WAF_SCORE_CLASSIFICATION.UNSCORED;
  }
  
  if (score >= 1 && score <= 20) {
    return WAF_SCORE_CLASSIFICATION.ATTACK;
  }
  
  if (score >= 21 && score <= 50) {
    return WAF_SCORE_CLASSIFICATION.LIKELY_ATTACK;
  }
  
  if (score >= 51 && score <= 80) {
    return WAF_SCORE_CLASSIFICATION.LIKELY_CLEAN;
  }
  
  if (score >= 81 && score <= 99) {
    return WAF_SCORE_CLASSIFICATION.CLEAN;
  }
  
  return WAF_SCORE_CLASSIFICATION.UNSCORED;
}

/**
 * 檢查 URI 是否為 Cloudflare 內部端點
 * @param {string} uri - 請求 URI
 * @returns {boolean} 是否為內部端點
 */
function isCloudflareInternalEndpoint(uri) {
  if (!uri || typeof uri !== 'string') {
    return false;
  }
  
  return CLOUDFLARE_INTERNAL_PATHS.some(path => uri.startsWith(path));
}

/**
 * 檢查 WAF 分數是否有效（已評分）
 * @param {number} score - WAF 分數
 * @returns {boolean} 是否有效
 */
function isValidWAFScore(score) {
  return score !== undefined && 
         score !== null && 
         score >= 1 && 
         score <= 99;
}

/**
 * 檢查是否為真實的安全威脅（舊函數，保留向後兼容）
 * @deprecated 請使用 analyzeThreatLevel() 代替
 * @param {object} log - 日誌條目
 * @param {number} threshold - 分數閾值（預設 20）
 * @returns {boolean} 是否為真實威脅
 */
function isRealSecurityThreat(log, threshold = RECOMMENDED_THRESHOLDS.HIGH) {
  const analysis = analyzeThreatLevel(log);
  return analysis.isThreat;
}

/**
 * 獲取嚴重程度（基於 WAF 分數）
 * @param {number} score - WAF 分數
 * @returns {string} 嚴重程度 (critical, high, medium, low)
 */
function getSeverityByScore(score) {
  const classification = classifyWAFScore(score);
  return classification.severity;
}

/**
 * 計算平均有效分數（排除未評分的）
 * @param {array} logs - 日誌陣列
 * @param {string} scoreField - 分數欄位名稱
 * @returns {number} 平均分數
 */
function calculateValidAvgScore(logs, scoreField) {
  const validScores = logs
    .map(log => log[scoreField])
    .filter(score => isValidWAFScore(score));
  
  if (validScores.length === 0) return 0;
  
  const sum = validScores.reduce((a, b) => a + b, 0);
  return Math.round(sum / validScores.length);
}

/**
 * 官方建議的規則配置範例
 */
const RULE_EXAMPLES = {
  blockHighRiskSQLi: {
    name: 'Block High Risk SQL Injection',
    expression: 'cf.waf.score.sqli le 20',
    action: 'block',
    description: '阻擋 WAF SQLi 分數 <= 20 的請求（官方建議閾值）'
  },
  
  challengeLikelyAttack: {
    name: 'Challenge Likely Attack',
    expression: 'cf.waf.score le 30 and not http.request.uri.path starts_with "/cdn-cgi/"',
    action: 'managed_challenge',
    description: '對可能的攻擊發起挑戰，但排除內部端點'
  },
  
  logMediumRisk: {
    name: 'Log Medium Risk Requests',
    expression: 'cf.waf.score le 50 and cf.waf.score gt 20',
    action: 'log',
    description: '記錄中風險請求供後續分析'
  }
};

module.exports = {
  // 常量
  WAF_SCORE_CLASSIFICATION,
  SECURITY_ACTION_CLASSIFICATION,
  OWASP_TOP10_PATTERNS,
  MALICIOUS_USER_AGENT_PATTERNS,
  CLOUDFLARE_INTERNAL_PATHS,
  RECOMMENDED_THRESHOLDS,
  RULE_EXAMPLES,
  
  // 核心判斷函數
  analyzeThreatLevel,
  classifySecurityAction,
  analyzeURIPattern,
  analyzeUserAgent,
  identifyAttackType,
  hasLowWAFScore,
  
  // 輔助函數
  classifyWAFScore,
  isCloudflareInternalEndpoint,
  isValidWAFScore,
  isRealSecurityThreat,  // 保留向後兼容
  getSeverityByScore,
  calculateValidAvgScore
};
