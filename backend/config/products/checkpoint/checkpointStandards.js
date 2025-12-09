// backend/config/products/checkpoint/checkpointStandards.js
// Check Point 防火牆安全標準配置（重構版 - 基於新的攻擊判斷流程）
// 基於 Check Point Firewall + Application Control + URL Filtering + Threat Prevention
// 參考文件: https://sc1.checkpoint.com/documents/R80.40/WebAdminGuides/EN/CP_R80.40_SecurityManagement_AdminGuide/

/**
 * ═══════════════════════════════════════════════════════════
 * 設計理念：Check Point 五層判斷模型（擴展版）
 * ═══════════════════════════════════════════════════════════
 * 
 * Layer 1: Action 分類 (Drop/Reject/Accept/Alert) - 防火牆動作
 * Layer 2: Threat Prevention (threat_severity/threat_name) - 威脅防護
 * Layer 3: 應用程式風險評估 (app_risk 0-5) - 技術風險評估
 * Layer 4: URI/UA 分析 (OWASP TOP 10) - 攻擊模式匹配
 * Layer 5: URL Filtering (url_category) - 政策合規性
 * 
 * 威脅判斷優先級：
 * 1. action = Drop/Reject → 已阻擋威脅
 * 2. threat_severity = High/Medium → Threat Prevention 檢測
 * 3. app_risk = 4/5 → 高風險應用
 * 4. URI/UA 符合 OWASP 攻擊模式 → 攻擊行為
 * 5. url_category 違規 → 政策違規
 */

// ==================== 第一部分：Action 分類標準 ====================

/**
 * Check Point Firewall Action 對應表（擴展版）
 * 支援：Drop, Reject, Accept, Alert, Info, Allow, Encrypt
 */
const CHECKPOINT_ACTION_MAPPING = {
  'Drop': {
    isBlocked: true,
    isThreat: true,
    isAttack: true,
    severity: 'critical',
    displayName: '已封鎖（Drop）',
    color: 'red',
    priority: 1,
    description: '流量被防火牆靜默丟棄，不回應來源端（Silently Drop）',
    aiContext: '此流量已被確認為威脅並封鎖，表示觸發了 IPS、反惡意軟體或安全規則',
    aiAnalysisType: 'summary_only',
    reason_categories: [
      '觸發 IPS 入侵防禦簽章',
      '來自惡意 IP 地址（Threat Intelligence）',
      '違反嚴格安全政策',
      '高風險應用程式（app_risk >= 4）',
      '已知惡意軟體通訊',
      'DDoS 攻擊流量'
    ]
  },
  
  'Reject': {
    isBlocked: true,
    isThreat: true,
    isAttack: false,
    severity: 'high',
    displayName: '已拒絕（Reject）',
    color: 'orange',
    priority: 2,
    description: '流量被防火牆拒絕，並回應 RST 或 ICMP 拒絕訊息給來源端',
    aiContext: '此流量違反規則但不一定是攻擊，可能是政策限制、未授權應用或時間限制',
    aiAnalysisType: 'summary_only',
    reason_categories: [
      '違反公司應用程式使用政策',
      '未授權的應用程式（如個人 VPN）',
      '時間限制規則（非上班時間）',
      '頻寬限制超標',
      '未通過身份驗證'
    ]
  },
  
  'Accept': {
    isBlocked: false,
    isThreat: false,
    isAttack: false,
    severity: 'info',
    displayName: '已允許（Accept）',
    color: 'green',
    priority: 5,
    description: '流量被允許通過防火牆，符合安全規則',
    aiContext: '此流量符合安全規則並被允許，但仍需根據 threat_severity, app_risk 和 url_category 評估潛在風險',
    aiAnalysisType: 'deep_analysis',
    reason_categories: [
      '符合安全規則',
      '已授權的應用程式',
      '正常業務流量',
      '信任的來源 IP'
    ]
  },
  
  'Allow': {
    isBlocked: false,
    isThreat: false,
    isAttack: false,
    severity: 'info',
    displayName: '明確允許（Allow）',
    color: 'green',
    priority: 5,
    description: '明確允許的流量',
    aiContext: '流量被明確允許，但仍需檢查威脅指標',
    aiAnalysisType: 'deep_analysis',
    reason_categories: ['明確允許規則']
  },
  
  'Alert': {
    isBlocked: false,
    isThreat: true,
    isAttack: false,
    severity: 'medium',
    displayName: '告警（Alert）',
    color: 'yellow',
    priority: 3,
    description: '告警類事件，多為偵測或狀態記錄，需要進一步分析威脅相關欄位',
    aiContext: '此事件觸發了告警，需要檢查 threat_severity, threat_name 等欄位進一步判斷',
    aiAnalysisType: 'monitoring',
    reason_categories: [
      'IPS 檢測到可疑行為',
      '威脅防護偵測模式',
      '異常流量模式'
    ]
  },
  
  'Info': {
    isBlocked: false,
    isThreat: false,
    isAttack: false,
    severity: 'info',
    displayName: '資訊（Info）',
    color: 'gray',
    priority: 6,
    description: '資訊類記錄，通常為正常事件或狀態更新',
    aiContext: '資訊類事件，通常為正常流量記錄',
    aiAnalysisType: 'none',
    reason_categories: ['狀態記錄', '正常事件']
  },
  
  'Encrypt': {
    isBlocked: false,
    isThreat: false,
    isAttack: false,
    severity: 'info',
    displayName: '已加密（Encrypt）',
    color: 'blue',
    priority: 4,
    description: '流量通過 VPN 加密通道（Site-to-Site 或 Remote Access VPN）',
    aiContext: 'VPN 流量，需要額外檢查加密通道內的實際流量內容',
    aiAnalysisType: 'none',
    reason_categories: [
      'Site-to-Site VPN',
      'Remote Access VPN',
      'IPsec 隧道'
    ]
  }
};

// ==================== 第二部分：Threat Prevention 威脅防護 ====================

/**
 * Threat Prevention 威脅嚴重程度對應表
 */
const THREAT_PREVENTION_MAPPING = {
  SEVERITY: {
    'High': {
      severity: 'critical',
      score: 90,
      displayName: '高嚴重度威脅',
      description: '高嚴重度威脅，需要立即處理',
      color: 'red',
      aiContext: 'Threat Prevention 檢測到高嚴重度威脅，建議立即調查並採取行動'
    },
    'Medium': {
      severity: 'high',
      score: 60,
      displayName: '中嚴重度威脅',
      description: '中嚴重度威脅，需要關注',
      color: 'orange',
      aiContext: 'Threat Prevention 檢測到中嚴重度威脅，建議進行調查'
    },
    'Low': {
      severity: 'medium',
      score: 30,
      displayName: '低嚴重度威脅',
      description: '低嚴重度威脅，需要監控',
      color: 'yellow',
      aiContext: 'Threat Prevention 檢測到低嚴重度威脅，建議持續監控'
    }
  },
  
  CATEGORY: {
    'Exploit': {
      type: 'ATTACK',
      severity: 'critical',
      owaspCategory: 'A06:2021 - Vulnerable and Outdated Components',
      description: '漏洞利用攻擊'
    },
    'Botnet': {
      type: 'MALWARE',
      severity: 'critical',
      owaspCategory: 'Botnet Communication',
      description: '殭屍網路通訊'
    },
    'DDoS': {
      type: 'ATTACK',
      severity: 'critical',
      owaspCategory: 'DDoS Attack',
      description: '分散式阻斷服務攻擊'
    },
    'SQL Injection': {
      type: 'INJECTION',
      severity: 'critical',
      owaspCategory: 'A03:2021 - Injection',
      description: 'SQL 注入攻擊'
    },
    'XSS': {
      type: 'INJECTION',
      severity: 'high',
      owaspCategory: 'A03:2021 - Injection',
      description: '跨站腳本攻擊'
    },
    'Command Injection': {
      type: 'INJECTION',
      severity: 'critical',
      owaspCategory: 'A03:2021 - Injection',
      description: '命令注入攻擊'
    },
    'Malware': {
      type: 'MALWARE',
      severity: 'critical',
      owaspCategory: 'Malware',
      description: '惡意軟體'
    }
  }
};

// ==================== 第三部分：OWASP TOP 10 2021 攻擊模式庫 ====================

/**
 * OWASP TOP 10 2021 攻擊模式庫（與 Cloudflare 共用）
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
 * 惡意 User-Agent 特徵庫（與 Cloudflare 共用）
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

// ==================== 第四部分：URL Filtering 分類 ====================

/**
 * URL Filtering 類別對應表
 */
const URL_CATEGORY_MAPPING = {
  'Malicious Sites': {
    severity: 'critical',
    violation_type: 'SECURITY_THREAT',
    displayName: '惡意網站',
    description: '已知的惡意網站、釣魚網站或惡意軟體散佈站點',
    action_recommendation: 'Block',
    owaspCategory: 'A03:2021 - Injection'
  },
  'Phishing': {
    severity: 'critical',
    violation_type: 'SECURITY_THREAT',
    displayName: '釣魚網站',
    description: '釣魚攻擊網站，用於竊取憑證',
    action_recommendation: 'Block',
    owaspCategory: 'A07:2021 - Authentication Failures'
  },
  'Pornography': {
    severity: 'high',
    violation_type: 'CONTENT_VIOLATION',
    displayName: '色情內容',
    description: '色情網站或成人內容',
    action_recommendation: 'Block',
    legal_risk: '可能涉及性騷擾法律責任'
  },
  'Gambling': {
    severity: 'high',
    violation_type: 'CONTENT_VIOLATION',
    displayName: '賭博網站',
    description: '線上賭博、博弈或彩券網站',
    action_recommendation: 'Block',
    legal_risk: '可能違反賭博相關法規'
  },
  'Social Media': {
    severity: 'medium',
    violation_type: 'PRODUCTIVITY_IMPACT',
    displayName: '社交媒體',
    description: '社交媒體平台（Facebook, Instagram, Twitter, LinkedIn）',
    action_recommendation: 'Time-Based Control'
  },
  'Streaming Media': {
    severity: 'medium',
    violation_type: 'BANDWIDTH_CONSUMPTION',
    displayName: '串流媒體',
    description: '影音串流服務（YouTube, Netflix, Spotify）',
    action_recommendation: 'Bandwidth Limit'
  },
  'Cloud Storage': {
    severity: 'medium',
    violation_type: 'DATA_LEAKAGE',
    displayName: '雲端儲存',
    description: '雲端儲存服務（Dropbox, Google Drive, OneDrive）',
    action_recommendation: 'Monitor + DLP'
  },
  'Business': {
    severity: 'low',
    violation_type: 'NONE',
    displayName: '業務應用',
    description: '正常業務相關網站',
    action_recommendation: 'Allow with Logging'
  }
};

// ==================== 第五部分：應用程式風險等級（保留現有）====================

/**
 * Check Point Application Risk Level 對應表
 */
const CHECKPOINT_APP_RISK_MAPPING = {
  5: {
    value: 5,
    label: 'critical',
    displayName: '嚴重風險',
    severity: 'critical',
    color: 'red',
    priority: 1,
    description: '應用程式具有嚴重安全風險',
    action_recommendation: 'Block'
  },
  4: {
    value: 4,
    label: 'high',
    displayName: '高風險',
    severity: 'high',
    color: 'orange',
    priority: 2,
    description: '應用程式具有明顯安全風險',
    action_recommendation: 'Monitor or Challenge'
  },
  3: {
    value: 3,
    label: 'medium',
    displayName: '中風險',
    severity: 'medium',
    color: 'yellow',
    priority: 3,
    description: '應用程式具有中等風險',
    action_recommendation: 'Policy-Based Control'
  },
  2: {
    value: 2,
    label: 'low',
    displayName: '低風險',
    severity: 'low',
    color: 'blue',
    priority: 4,
    description: '應用程式風險較低',
    action_recommendation: 'Allow with Logging'
  },
  1: {
    value: 1,
    label: 'very_low',
    displayName: '極低風險',
    severity: 'info',
    color: 'green',
    priority: 5,
    description: '應用程式風險極低',
    action_recommendation: 'Allow'
  },
  0: {
    value: 0,
    label: 'unknown',
    displayName: '未知風險',
    severity: 'info',
    color: 'gray',
    priority: 6,
    description: 'Check Point 無法識別此應用程式的風險等級',
    action_recommendation: 'Review Required'
  }
};

// ==================== 第六部分：核心判斷函數（五層判斷模型）====================

/**
 * 分類 Action
 * @param {string|array} action - Action 或 Actions[]
 * @returns {object} 分類結果
 */
function classifyAction(action) {
  const actions = Array.isArray(action) ? action : [action];
  
  for (const [actionName, config] of Object.entries(CHECKPOINT_ACTION_MAPPING)) {
    for (const act of actions) {
      if ((act || '').toLowerCase() === actionName.toLowerCase()) {
        return {
          type: actionName.toUpperCase(),
          action: act,
          ...config
        };
      }
    }
  }
  
  return {
    type: 'UNKNOWN',
    action: action,
    ...CHECKPOINT_ACTION_MAPPING['Info']
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
  
  for (const [category, config] of Object.entries(MALICIOUS_USER_AGENT_PATTERNS)) {
    for (const pattern of config.patterns) {
      if (lowerUA.includes(pattern)) {
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
      severity: 'medium'
    };
  }
  
  if (userAgent.length > 500) {
    return {
      isSuspicious: true,
      reason: 'User-Agent 過長（可能是攻擊 payload）',
      severity: 'high'
    };
  }
  
  return { isSuspicious: false };
}

/**
 * 【核心函數】多層威脅判斷系統（五層判斷模型）
 * 
 * @param {object} log - Check Point 日誌條目
 * @returns {object} 威脅判定結果
 */
function analyzeThreatLevel(log) {
  // ========== Layer 1: Action 分類 ==========
  const actionClass = classifyAction(log.action);
  
  // 1. Drop / Reject → 已阻擋威脅
  if (actionClass.type === 'DROP' || actionClass.type === 'REJECT') {
    return {
      isThreat: true,
      isBlocked: true,
      severity: actionClass.severity,
      category: 'BLOCKED_ATTACK',
      reason: `流量已被防火牆封鎖 (${actionClass.action})`,
      requiresAction: false,
      aiAnalysisType: actionClass.aiAnalysisType,
      layer: 'FIREWALL_ACTION',
      level: 1,
      actionInfo: actionClass
    };
  }
  
  // 2. Alert → 告警類（需要進一步判斷）
  if (actionClass.type === 'ALERT') {
    // 檢查 threat_severity
    if (log.threat_severity) {
      const threatSeverity = THREAT_PREVENTION_MAPPING.SEVERITY[log.threat_severity];
      if (threatSeverity) {
        return {
          isThreat: true,
          isBlocked: false,
          severity: threatSeverity.severity,
          category: 'THREAT_DETECTED',
          reason: `Threat Prevention 檢測到 ${threatSeverity.displayName}`,
          requiresAction: true,
          aiAnalysisType: 'full_analysis',
          layer: 'THREAT_PREVENTION',
          level: 2,
          threatInfo: {
            severity: log.threat_severity,
            name: log.threat_name,
            category: log.threat_category
          }
        };
      }
    }
    
    return {
      isThreat: true,
      isBlocked: false,
      severity: 'medium',
      category: 'ALERT_EVENT',
      reason: '告警事件，需要進一步調查',
      requiresAction: false,
      aiAnalysisType: 'monitoring',
      layer: 'FIREWALL_ACTION',
      level: 1
    };
  }
  
  // ========== Layer 2: Threat Prevention 判斷 ==========
  
  // 2.1 threat_severity = High/Medium
  if (log.threat_severity) {
    const threatSeverity = THREAT_PREVENTION_MAPPING.SEVERITY[log.threat_severity];
    if (threatSeverity && (log.threat_severity === 'High' || log.threat_severity === 'Medium')) {
      return {
        isThreat: true,
        isBlocked: actionClass.isBlocked,
        severity: threatSeverity.severity,
        category: 'THREAT_PREVENTION_DETECTED',
        reason: `Threat Prevention 檢測到 ${threatSeverity.displayName}: ${log.threat_name || '未知威脅'}`,
        requiresAction: !actionClass.isBlocked,
        aiAnalysisType: 'full_analysis',
        layer: 'THREAT_PREVENTION',
        level: 2,
        threatInfo: {
          severity: log.threat_severity,
          name: log.threat_name,
          category: log.threat_category
        }
      };
    }
  }
  
  // 2.2 threat_name 或 threat_category 包含已知攻擊向量
  if (log.threat_name || log.threat_category) {
    const threatCategory = THREAT_PREVENTION_MAPPING.CATEGORY[log.threat_category];
    if (threatCategory) {
      return {
        isThreat: true,
        isBlocked: actionClass.isBlocked,
        severity: threatCategory.severity,
        category: 'THREAT_CATEGORY_DETECTED',
        reason: `檢測到威脅類別: ${threatCategory.description}`,
        requiresAction: !actionClass.isBlocked,
        aiAnalysisType: 'full_analysis',
        layer: 'THREAT_PREVENTION',
        level: 2,
        threatInfo: {
          name: log.threat_name,
          category: log.threat_category,
          owaspCategory: threatCategory.owaspCategory
        }
      };
    }
  }
  
  // 2.3 burst_count 高 → 連線爆發
  if (log.burst_count && log.burst_count > 100) {
    return {
      isThreat: true,
      isBlocked: actionClass.isBlocked,
      severity: 'high',
      category: 'BURST_TRAFFIC',
      reason: `檢測到連線快速爆發 (${log.burst_count} 次)`,
      requiresAction: !actionClass.isBlocked,
      aiAnalysisType: 'full_analysis',
      layer: 'THREAT_PREVENTION',
      level: 2,
      burstCount: log.burst_count
    };
  }
  
  // ========== Layer 3: 應用程式風險評估 ==========
  
  const appRisk = parseInt(log.app_risk);
  const appInfo = CHECKPOINT_APP_RISK_MAPPING[appRisk];
  
  if (appRisk >= 4) {
    return {
      isThreat: true,
      isBlocked: actionClass.isBlocked,
      severity: appInfo.severity,
      category: 'HIGH_RISK_APPLICATION',
      reason: `應用程式風險等級為 ${appInfo.displayName} (app_risk=${appRisk}): ${log.appi_name || '未知應用'}`,
      requiresAction: !actionClass.isBlocked,
      aiAnalysisType: 'full_analysis',
      layer: 'APP_RISK_ASSESSMENT',
      level: 3,
      appRiskInfo: appInfo
    };
  }
  
  // ========== Layer 4: URI/UA 分析（OWASP TOP 10）==========
  
  // 4.1 分析 URI
  const uriAnalysis = analyzeURIPattern(log.http_url || log.dst_domain_name);
  if (uriAnalysis.isSuspicious) {
    return {
      isThreat: true,
      isBlocked: actionClass.isBlocked,
      severity: uriAnalysis.severity,
      category: 'URI_ATTACK_PATTERN',
      reason: `URI 符合攻擊模式: ${uriAnalysis.owaspName} (${uriAnalysis.matchedPattern})`,
      requiresAction: !actionClass.isBlocked,
      aiAnalysisType: 'full_analysis',
      layer: 'URI_UA_ANALYSIS',
      level: 4,
      uriAnalysis: uriAnalysis
    };
  }
  
  // 4.2 分析 User-Agent
  const uaAnalysis = analyzeUserAgent(log.http_user_agent);
  if (uaAnalysis.isSuspicious) {
    return {
      isThreat: true,
      isBlocked: actionClass.isBlocked,
      severity: uaAnalysis.severity,
      category: 'MALICIOUS_USER_AGENT',
      reason: `User-Agent 符合惡意特徵: ${uaAnalysis.reason}`,
      requiresAction: !actionClass.isBlocked,
      aiAnalysisType: 'full_analysis',
      layer: 'URI_UA_ANALYSIS',
      level: 4,
      uaAnalysis: uaAnalysis
    };
  }
  
  // ========== Layer 5: URL Filtering（政策違規）==========
  
  const urlCategory = URL_CATEGORY_MAPPING[log.url_category];
  if (urlCategory && (urlCategory.severity === 'critical' || urlCategory.severity === 'high')) {
    return {
      isThreat: true,
      isBlocked: actionClass.isBlocked,
      severity: urlCategory.severity,
      category: 'URL_FILTERING_VIOLATION',
      reason: `URL Filtering 檢測到 ${urlCategory.displayName}: ${urlCategory.description}`,
      requiresAction: !actionClass.isBlocked,
      aiAnalysisType: 'full_analysis',
      layer: 'URL_FILTERING',
      level: 5,
      urlCategoryInfo: urlCategory
    };
  }
  
  // ========== 正常流量 ==========
  return {
    isThreat: false,
    isBlocked: false,
    severity: 'info',
    category: 'NORMAL_TRAFFIC',
    reason: '未符合任何威脅條件 - 正常業務流量',
    requiresAction: false,
    aiAnalysisType: 'none',
    layer: 'NORMAL_TRAFFIC',
    level: 0
  };
}

/**
 * 計算威脅分數（向後兼容）
 * @param {object} log - Check Point 日誌條目
 * @returns {number} 威脅分數 (0-100)
 */
function calculateThreatScore(log) {
  const analysis = analyzeThreatLevel(log);
  
  if (analysis.severity === 'critical') return 10;
  if (analysis.severity === 'high') return 40;
  if (analysis.severity === 'medium') return 60;
  if (analysis.severity === 'low') return 80;
  return 95;
}

// ==================== 輔助函數 ====================

/**
 * 根據威脅分數分類（向後兼容）
 */
function classifyByThreatScore(score) {
  if (score <= 30) {
    return { label: 'critical_threat', displayName: '嚴重威脅', severity: 'critical' };
  }
  if (score <= 50) {
    return { label: 'high_risk', displayName: '高風險', severity: 'high' };
  }
  if (score <= 70) {
    return { label: 'medium_risk', displayName: '中風險', severity: 'medium' };
  }
  return { label: 'clean', displayName: '正常流量', severity: 'info' };
}

/**
 * 檢查是否為高風險威脅
 */
function isHighRiskThreat(log) {
  const analysis = analyzeThreatLevel(log);
  return analysis.isThreat && (analysis.severity === 'critical' || analysis.severity === 'high');
}

/**
 * 綜合分析單個日誌條目
 */
function analyzeLogEntry(log) {
  const analysis = analyzeThreatLevel(log);
  const threatScore = calculateThreatScore(log);
  
  return {
    ...analysis,
    threatScore: threatScore,
    originalData: {
      action: log.action,
      threat_severity: log.threat_severity,
      threat_name: log.threat_name,
      threat_category: log.threat_category,
      app_risk: log.app_risk,
      appi_name: log.appi_name,
      url_category: log.url_category,
      http_user_agent: log.http_user_agent,
      burst_count: log.burst_count
    }
  };
}

/**
 * 舊函數名稱（向後兼容）
 */
function isRealSecurityThreat(log) {
  const analysis = analyzeThreatLevel(log);
  return {
    isAttack: analysis.category === 'BLOCKED_ATTACK',
    isThreat: analysis.isThreat,
    confidence: analysis.severity === 'critical' ? 'certain' : 'high',
    reason: analysis.reason,
    layer: analysis.layer,
    level: analysis.level,
    severity: analysis.severity,
    category: analysis.category
  };
}

// ==================== 第七部分：事件分類系統（優化版 - 三大類）====================

/**
 * 事件分類系統
 * - KNOWN_ATTACK: 已知攻擊（IPS 觸發、威脅防護檢測）
 * - SCAN_SUSPICIOUS: 掃描/可疑流量（Cleanup rule、端口掃描、非標準埠）
 * - VPN_POLICY_ISSUE: VPN 策略問題（已認證用戶被阻擋）🆕
 * - NORMAL_TRAFFIC: 正常流量（不分析）
 */
const EVENT_CLASSIFICATION = {
  KNOWN_ATTACK: {
    id: 'KNOWN_ATTACK',
    displayName: '已知攻擊',
    severity: 'critical',
    description: 'IPS 簽章觸發或威脅防護檢測到的已知攻擊',
    conditions: [
      'sig_id 有值（IPS 簽章觸發）',
      'threat_severity = High/Medium',
      'threat_name 或 threat_category 有值'
    ],
    aiAnalysis: true
  },
  
  SCAN_SUSPICIOUS: {
    id: 'SCAN_SUSPICIOUS',
    displayName: '掃描/可疑流量',
    severity: 'high',
    description: '端口掃描、探測行為或可疑連線',
    conditions: [
      'action=Drop + rule_name=Cleanup rule + 無用戶身份',
      'security_inzone=L3_untrust + 外部 IP + 無用戶身份',
      '同一 IP 連線多個不同端口',
      '非標準埠連線'
    ],
    aiAnalysis: true
  },
  
  // 🆕 VPN 策略問題（已認證用戶被阻擋，非攻擊）
  VPN_POLICY_ISSUE: {
    id: 'VPN_POLICY_ISSUE',
    displayName: 'VPN 策略問題',
    severity: 'low',
    description: '已認證的 VPN 用戶流量被阻擋，可能是策略配置問題',
    conditions: [
      'src_user_name 或 src_user_dn 有值（已認證用戶）',
      'action=Drop + rule_name=Cleanup rule',
      'product 包含 VPN',
      'geoip.country_name = Intranet'
    ],
    aiAnalysis: false,  // 不視為攻擊，不需要 AI 分析
    isAttack: false,
    actionRequired: 'POLICY_REVIEW'  // 需要檢視防火牆策略
  },
  
  NORMAL_TRAFFIC: {
    id: 'NORMAL_TRAFFIC',
    displayName: '正常流量',
    severity: 'info',
    description: '正常業務流量，不進行攻擊分析',
    conditions: [
      'action=Accept',
      'security_inzone=L3_trust',
      '符合業務規則（Windows update 等）'
    ],
    aiAnalysis: false  // 不分析
  }
};

/**
 * 端口掃描偵測規則
 */
const PORT_SCAN_DETECTION = {
  // 同一 IP 連線 >= 5 個不同端口視為掃描
  uniquePortThreshold: 5,
  
  // 短時間內連線次數閾值（每小時）
  frequencyThreshold: 50,
  
  // 高危端口清單
  highRiskPorts: [
    22,    // SSH
    23,    // Telnet
    25,    // SMTP
    53,    // DNS
    110,   // POP3
    135,   // RPC
    139,   // NetBIOS
    143,   // IMAP
    445,   // SMB
    1433,  // MSSQL
    1521,  // Oracle
    3306,  // MySQL
    3389,  // RDP
    5432,  // PostgreSQL
    5900,  // VNC
    6379,  // Redis
    8080,  // HTTP-Alt
    8443,  // HTTPS-Alt
    27017  // MongoDB
  ],
  
  // 掃描工具常用端口範圍
  scannerPortRanges: [
    { start: 1, end: 1024, name: '特權端口掃描' },
    { start: 1024, end: 65535, name: '高端口掃描' }
  ]
};

/**
 * 特殊規則類型定義
 */
const SPECIAL_RULE_TYPES = {
  'Cleanup rule': {
    type: 'CLEANUP',
    displayName: '清理規則',
    description: '防火牆策略的最後一條清理規則，任何前面所有規則都沒匹配到的流量都會被這條規則處理',
    implication: '表示沒有任何規則允許此連線，通常代表未授權的存取嘗試',
    classification: 'SCAN_SUSPICIOUS'
  },
  'Stealth': {
    type: 'STEALTH',
    displayName: '隱身規則',
    description: '隱藏防火牆本身的規則',
    implication: '保護防火牆不被探測',
    classification: 'NORMAL_TRAFFIC'
  }
};

/**
 * 🆕 檢查是否為已認證的 VPN 用戶
 * @param {object} log - 日誌條目
 * @returns {object} VPN 用戶資訊
 */
function checkVPNUser(log) {
  // 檢查用戶身份欄位
  const srcUserName = log.src_user_name || log.user || '';
  const srcUserDN = log.src_user_dn || '';
  const product = log.product || '';
  const geoCountry = log.geoip?.country_name || log.src_country || '';
  
  // 是否有用戶身份（已認證）
  const hasUserIdentity = !!(srcUserName.trim() || srcUserDN.trim());
  
  // 是否為 VPN 產品
  const isVPNProduct = product.toLowerCase().includes('vpn');
  
  // 是否為內網流量
  const isIntranet = geoCountry.toLowerCase() === 'intranet';
  
  // 是否為 VPN 分配的 IP 範圍（常見 VPN IP 範圍）
  const srcIP = log.src || log.src_ip || '';
  const isVPNIPRange = srcIP.startsWith('192.168.192.') || 
                       srcIP.startsWith('192.168.193.') ||
                       srcIP.startsWith('10.8.') ||
                       srcIP.startsWith('10.9.');
  
  return {
    isAuthenticatedUser: hasUserIdentity,
    isVPNProduct: isVPNProduct,
    isIntranet: isIntranet,
    isVPNIPRange: isVPNIPRange,
    userName: srcUserName.trim(),
    userDN: srcUserDN.trim(),
    // 🔑 核心判斷：是否為 VPN 用戶
    isVPNUser: hasUserIdentity && (isVPNProduct || isIntranet || isVPNIPRange)
  };
}

/**
 * 事件分類判斷函數
 * @param {object} log - 解析後的日誌條目
 * @returns {object} 分類結果
 */
function classifyEvent(log) {
  // 1. 檢查是否為已知攻擊（IPS 觸發）
  if (log.sig_id || log.threat_severity === 'High' || log.threat_severity === 'Medium' ||
      log.threat_name || log.threat_category) {
    return {
      classification: 'KNOWN_ATTACK',
      ...EVENT_CLASSIFICATION.KNOWN_ATTACK,
      reason: getAttackReason(log)
    };
  }
  
  // 🆕 1.5 檢查是否為已認證的 VPN 用戶
  const vpnUserInfo = checkVPNUser(log);
  const action = (log.action || '').toLowerCase();
  const ruleName = log.rule_name || (log.rule_name_match_table && log.rule_name_match_table[0]) || '';
  const securityInzone = log.security_inzone || '';
  
  // 🆕 如果是已認證的 VPN 用戶且被阻擋 → VPN 策略問題（非攻擊）
  if (vpnUserInfo.isVPNUser && (action === 'drop' || action === 'reject')) {
    return {
      classification: 'VPN_POLICY_ISSUE',
      ...EVENT_CLASSIFICATION.VPN_POLICY_ISSUE,
      reason: `已認證用戶 "${vpnUserInfo.userName}" 的連線被 ${ruleName || '防火牆規則'} 阻擋，可能是策略配置問題`,
      vpnUserInfo: vpnUserInfo,
      isAttack: false  // 明確標記非攻擊
    };
  }
  
  // 2. 檢查是否為掃描/可疑流量（無用戶身份的情況）
  
  // 2.1 被 Drop 且命中 Cleanup rule（無用戶身份）
  if ((action === 'drop' || action === 'reject') && 
      ruleName.toLowerCase().includes('cleanup') &&
      !vpnUserInfo.isAuthenticatedUser) {
    return {
      classification: 'SCAN_SUSPICIOUS',
      ...EVENT_CLASSIFICATION.SCAN_SUSPICIOUS,
      reason: `被 ${ruleName} 規則阻擋，表示未匹配任何允許規則（無用戶身份）`
    };
  }
  
  // 2.2 來自不信任區域且被阻擋（無用戶身份）
  if ((action === 'drop' || action === 'reject') && 
      (securityInzone === 'L3_untrust' || log.inzone === 'External') &&
      !vpnUserInfo.isAuthenticatedUser) {
    return {
      classification: 'SCAN_SUSPICIOUS',
      ...EVENT_CLASSIFICATION.SCAN_SUSPICIOUS,
      reason: `來自不信任區域 (${securityInzone || log.inzone}) 的連線被阻擋（無用戶身份）`
    };
  }
  
  // 2.3 被阻擋的連線（一般性，無用戶身份）
  if ((action === 'drop' || action === 'reject') && !vpnUserInfo.isAuthenticatedUser) {
    return {
      classification: 'SCAN_SUSPICIOUS',
      ...EVENT_CLASSIFICATION.SCAN_SUSPICIOUS,
      reason: `連線被防火牆阻擋 (${log.action})（無用戶身份）`
    };
  }
  
  // 3. 其他視為正常流量
  return {
    classification: 'NORMAL_TRAFFIC',
    ...EVENT_CLASSIFICATION.NORMAL_TRAFFIC,
    reason: '符合安全規則的正常流量'
  };
}

/**
 * 獲取攻擊原因描述
 * @param {object} log - 日誌條目
 * @returns {string} 攻擊原因描述
 */
function getAttackReason(log) {
  const reasons = [];
  if (log.sig_id) reasons.push(`IPS 簽章觸發 (sig_id: ${log.sig_id})`);
  if (log.threat_severity) reasons.push(`威脅嚴重度: ${log.threat_severity}`);
  if (log.threat_name) reasons.push(`威脅名稱: ${log.threat_name}`);
  if (log.threat_category) reasons.push(`威脅類別: ${log.threat_category}`);
  return reasons.join('；') || '檢測到已知攻擊特徵';
}

/**
 * 檢測是否為端口掃描
 * @param {array} logs - 同一來源 IP 的所有日誌
 * @returns {object} 掃描偵測結果
 */
function detectPortScan(logs) {
  if (!logs || logs.length === 0) {
    return { isPortScan: false };
  }
  
  // 提取所有目標端口
  const targetPorts = new Set();
  const highRiskPortsHit = [];
  
  logs.forEach(log => {
    const port = log.service || log.dst_port;
    if (port) {
      const portNum = parseInt(port);
      if (!isNaN(portNum)) {
        targetPorts.add(portNum);
        if (PORT_SCAN_DETECTION.highRiskPorts.includes(portNum)) {
          highRiskPortsHit.push(portNum);
        }
      }
    }
  });
  
  const uniquePortCount = targetPorts.size;
  const isPortScan = uniquePortCount >= PORT_SCAN_DETECTION.uniquePortThreshold;
  
  return {
    isPortScan,
    uniquePortCount,
    targetPorts: Array.from(targetPorts),
    highRiskPortsHit: [...new Set(highRiskPortsHit)],
    reason: isPortScan 
      ? `掃描了 ${uniquePortCount} 個不同端口（閾值: ${PORT_SCAN_DETECTION.uniquePortThreshold}）`
      : null
  };
}

// ==================== 匯出 ====================

module.exports = {
  // 常量
  CHECKPOINT_ACTION_MAPPING,
  THREAT_PREVENTION_MAPPING,
  OWASP_TOP10_PATTERNS,
  MALICIOUS_USER_AGENT_PATTERNS,
  URL_CATEGORY_MAPPING,
  CHECKPOINT_APP_RISK_MAPPING,
  
  // 核心判斷函數
  analyzeThreatLevel,
  classifyAction,
  analyzeURIPattern,
  analyzeUserAgent,
  
  // 分析函數
  calculateThreatScore,
  classifyByThreatScore,
  isHighRiskThreat,
  analyzeLogEntry,
  
  // 向後兼容
  isRealSecurityThreat,
  
  // 新增：事件分類系統（優化版）
  EVENT_CLASSIFICATION,
  PORT_SCAN_DETECTION,
  SPECIAL_RULE_TYPES,
  classifyEvent,
  getAttackReason,
  detectPortScan,
  
  // 🆕 VPN 用戶識別
  checkVPNUser
};
