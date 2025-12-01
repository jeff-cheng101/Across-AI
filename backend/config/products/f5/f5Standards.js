// backend/config/products/f5/f5Standards.js
// F5 Advanced WAF 安全標準配置（重構版 - 基於 ELK Raw Data 判斷流程）
// 參考文件：https://clouddocs.f5.com/products/waf-declarative-policy/
// 基於 F5 WAF HTTP Log 攻擊判斷流程（ELK Raw Data）

/**
 * ═══════════════════════════════════════════════════════════
 * 設計理念：F5 WAF 多層判斷模型
 * ═══════════════════════════════════════════════════════════
 * 
 * Layer 1: request_status 狀態判斷 (blocked/passed/alerted)
 * Layer 2: violation_rating 違規評分判斷 (0-100)
 * Layer 3: attack_type 攻擊類型匹配 (OWASP Top 10)
 * Layer 4: severity / ThreatLevel 嚴重度評估
 * Layer 5: URI / User-Agent 攻擊模式分析 (OWASP patterns)
 * 
 * 判斷優先級：
 * 1. request_status = blocked → 已阻擋攻擊
 * 2. violation_rating > 0 + passed → 潛在攻擊（需加強防護）
 * 3. attack_type 屬於 OWASP Top 10 → 攻擊行為
 * 4. URI/UA 符合攻擊特徵 → 可疑流量
 * 5. violation_rating = 0 且 severity = Informational → 正常流量
 */

// ==================== 第一部分：request_status 狀態映射 ====================

/**
 * F5 request_status 處理狀態對應表（擴展版）
 * 基於 F5 WAF 請求處理結果
 */
const F5_REQUEST_STATUS_MAPPING = {
  'blocked': {
    isBlocked: true,
    isThreat: true,
    isAttack: true,
    severity: 'critical',
    displayName: '已阻擋（Blocked）',
    color: 'red',
    priority: 1,
    description: '請求已被 F5 WAF 阻擋，確認為攻擊',
    aiContext: '此請求已被 F5 WAF 確認為攻擊並成功阻擋，無需額外防護',
    aiAnalysisType: 'summary_only',
    reason_categories: [
      '觸發 F5 攻擊簽章',
      '違規評分超過阻擋閾值',
      '觸發 IP 黑名單',
      '觸發 Bot 防護規則',
      '違反 WAF 安全政策'
    ]
  },
  
  'passed': {
    isBlocked: false,
    isThreat: false,
    isAttack: false,
    severity: 'info',
    displayName: '已通過（Passed）',
    color: 'green',
    priority: 5,
    description: '請求通過 F5 WAF，但需根據其他指標判斷',
    aiContext: '此請求通過了 WAF，但仍需根據 violation_rating、attack_type、簽章規則進一步判斷是否為攻擊',
    aiAnalysisType: 'deep_analysis',
    reason_categories: [
      '符合安全規則',
      '低風險評分',
      '學習模式',
      '白名單 IP',
      '信任的來源'
    ]
  },
  
  'alerted': {
    isBlocked: false,
    isThreat: true,
    isAttack: false,
    severity: 'medium',
    displayName: '已告警（Alerted）',
    color: 'orange',
    priority: 3,
    description: '請求觸發告警但未阻擋，需要進一步調查',
    aiContext: '此請求觸發了 F5 WAF 告警，建議檢查 violation_rating 和 attack_type',
    aiAnalysisType: 'full_analysis',
    reason_categories: [
      '檢測模式（Detection Mode）',
      '違規評分達到告警閾值',
      '可疑但未確認的行為'
    ]
  },
  
  'not_checked': {
    isBlocked: false,
    isThreat: false,
    isAttack: false,
    severity: 'info',
    displayName: '未檢查（Not Checked）',
    color: 'gray',
    priority: 6,
    description: '請求未經 WAF 檢查，可能是內部流量或白名單',
    aiContext: '此請求未經過 WAF 檢查，視為無法判定',
    aiAnalysisType: 'none',
    reason_categories: ['內部流量', '白名單路徑', 'WAF Bypass']
  },
  
  'N/A': {
    isBlocked: false,
    isThreat: false,
    isAttack: false,
    severity: 'info',
    displayName: '狀態不明（N/A）',
    color: 'gray',
    priority: 6,
    description: '請求狀態不明或不完整',
    aiContext: '請求狀態不明，建議持續監控',
    aiAnalysisType: 'none',
    reason_categories: ['日誌不完整', '狀態未知']
  }
};

// ==================== 第二部分：violation_rating 違規評分閾值 ====================

/**
 * F5 violation_rating 違規評分閾值
 * 基於實際 F5 日誌分析，violation_rating 範圍為 0-5
 * 數值越大表示威脅越高
 */
const F5_VIOLATION_RATING_THRESHOLDS = {
  CRITICAL: 5,   // 5: 嚴重威脅，必須阻擋
  HIGH: 4,       // 4: 高風險攻擊
  MEDIUM: 3,     // 3: 中風險
  LOW: 2,        // 2: 低風險
  SAFE: 0        // 0-1: 安全範圍或低違規
};

/**
 * 根據 violation_rating 分類威脅等級
 * F5 violation_rating 範圍: 0-5
 */
function classifyViolationRating(rating) {
  const score = parseFloat(rating);
  
  if (isNaN(score) || score === 0) {
    return {
      severity: 'info',
      displayName: '無違規',
      isThreat: false,
      reason: 'violation_rating = 0，無違規'
    };
  }
  
  if (score >= F5_VIOLATION_RATING_THRESHOLDS.CRITICAL) {
    return {
      severity: 'critical',
      displayName: '嚴重威脅',
      isThreat: true,
      reason: `violation_rating = ${score} (= 5)，嚴重威脅`
    };
  }
  
  if (score >= F5_VIOLATION_RATING_THRESHOLDS.HIGH) {
    return {
      severity: 'high',
      displayName: '高風險',
      isThreat: true,
      reason: `violation_rating = ${score} (= 4)，高風險攻擊`
    };
  }
  
  if (score >= F5_VIOLATION_RATING_THRESHOLDS.MEDIUM) {
    return {
      severity: 'medium',
      displayName: '中風險',
      isThreat: true,
      reason: `violation_rating = ${score} (= 3)，中風險`
    };
  }
  
  if (score >= F5_VIOLATION_RATING_THRESHOLDS.LOW) {
    return {
      severity: 'low',
      displayName: '低風險',
      isThreat: true,
      reason: `violation_rating = ${score} (= 2)，低風險`
    };
  }
  
  return {
    severity: 'info',
    displayName: '安全範圍',
    isThreat: false,
    reason: `violation_rating = ${score} (= 1 或 0)，安全範圍`
  };
}

// ==================== 第三部分：OWASP TOP 10 攻擊類型映射 ====================

/**
 * F5 attack_type 攻擊類型對應 OWASP Top 10 2021
 */
const F5_ATTACK_TYPE_MAPPING = {
  // A03:2021 - Injection（注入攻擊）
  'SQL Injection': {
    category: 'A03:2021',
    name: 'SQL Injection',
    type: 'INJECTION',
    severity: 'critical',
    description: 'SQL 注入攻擊'
  },
  'Command Execution': {
    category: 'A03:2021',
    name: 'Command Execution',
    type: 'INJECTION',
    severity: 'critical',
    description: '命令執行攻擊'
  },
  'XSS': {
    category: 'A03:2021',
    name: 'Cross-Site Scripting',
    type: 'INJECTION',
    severity: 'high',
    description: '跨站腳本攻擊'
  },
  'LDAP Injection': {
    category: 'A03:2021',
    name: 'LDAP Injection',
    type: 'INJECTION',
    severity: 'high',
    description: 'LDAP 注入攻擊'
  },
  'XML Injection': {
    category: 'A03:2021',
    name: 'XML Injection',
    type: 'INJECTION',
    severity: 'high',
    description: 'XML 注入攻擊'
  },
  
  // A01:2021 - Broken Access Control（存取控制失效）
  'Path Traversal': {
    category: 'A01:2021',
    name: 'Path Traversal',
    type: 'ACCESS_CONTROL',
    severity: 'high',
    description: '路徑遍歷攻擊'
  },
  'Directory Indexing': {
    category: 'A01:2021',
    name: 'Directory Indexing',
    type: 'ACCESS_CONTROL',
    severity: 'medium',
    description: '目錄索引攻擊'
  },
  'Forceful Browsing': {
    category: 'A01:2021',
    name: 'Forceful Browsing',
    type: 'ACCESS_CONTROL',
    severity: 'medium',
    description: '強制瀏覽攻擊'
  },
  
  // A05:2021 - Security Misconfiguration（安全配置錯誤）
  'Information Leakage': {
    category: 'A05:2021',
    name: 'Information Leakage',
    type: 'MISCONFIGURATION',
    severity: 'medium',
    description: '資訊洩漏'
  },
  'Abuse of Functionality': {
    category: 'A05:2021',
    name: 'Abuse of Functionality',
    type: 'MISCONFIGURATION',
    severity: 'medium',
    description: '功能濫用'
  },
  
  // A07:2021 - Authentication Failures（認證失效）
  'Brute Force': {
    category: 'A07:2021',
    name: 'Brute Force Attack',
    type: 'AUTHENTICATION',
    severity: 'high',
    description: '暴力破解攻擊'
  },
  'Session Hijacking': {
    category: 'A07:2021',
    name: 'Session Hijacking',
    type: 'AUTHENTICATION',
    severity: 'high',
    description: '會話劫持'
  },
  'Credential Stuffing': {
    category: 'A07:2021',
    name: 'Credential Stuffing',
    type: 'AUTHENTICATION',
    severity: 'high',
    description: '憑證填充攻擊'
  },
  
  // A04:2021 - Insecure Design（不安全設計）
  'HTTP Protocol Attack': {
    category: 'A04:2021',
    name: 'HTTP Protocol Attack',
    type: 'PROTOCOL_VIOLATION',
    severity: 'medium',
    description: 'HTTP 協定攻擊'
  },
  'HTTP Response Splitting': {
    category: 'A04:2021',
    name: 'HTTP Response Splitting',
    type: 'PROTOCOL_VIOLATION',
    severity: 'high',
    description: 'HTTP 回應分割攻擊'
  },
  
  // Bot 攻擊
  'Bot': {
    category: 'Bot Attack',
    name: 'Malicious Bot',
    type: 'BOT',
    severity: 'medium',
    description: '惡意機器人'
  },
  'Web Scraping': {
    category: 'Bot Attack',
    name: 'Web Scraping',
    type: 'BOT',
    severity: 'low',
    description: '網頁爬蟲'
  },
  
  // A06:2021 - Vulnerable and Outdated Components
  'Vulnerability Scan': {
    category: 'A06:2021',
    name: 'Vulnerability Scan',
    type: 'SCANNING',
    severity: 'medium',
    description: '漏洞掃描'
  },
  'Server Side Code Injection': {
    category: 'A03:2021',
    name: 'Server Side Code Injection',
    type: 'INJECTION',
    severity: 'critical',
    description: '伺服器端代碼注入'
  }
};

// ==================== 第四部分：severity / ThreatLevel 嚴重度映射 ====================

/**
 * F5 Severity 嚴重程度對應表
 */
const F5_SEVERITY_MAPPING = {
  'Critical': { value: 5, label: 'critical', displayName: '嚴重', color: 'red', priority: 1 },
  'Alert': { value: 5, label: 'critical', displayName: '警報', color: 'red', priority: 1 },
  'Error': { value: 4, label: 'high', displayName: '錯誤', color: 'orange', priority: 2 },
  'Warning': { value: 3, label: 'medium', displayName: '警告', color: 'yellow', priority: 3 },
  'Notice': { value: 2, label: 'low', displayName: '通知', color: 'blue', priority: 4 },
  'Informational': { value: 1, label: 'info', displayName: '資訊', color: 'gray', priority: 5 },
  'Info': { value: 1, label: 'info', displayName: '資訊', color: 'gray', priority: 5 },
  'Debug': { value: 1, label: 'info', displayName: '除錯', color: 'gray', priority: 5 }
};

/**
 * F5 ThreatLevel 威脅等級對應表
 */
const F5_THREAT_LEVEL_MAPPING = {
  'Critical': { score: 95, label: 'critical', displayName: '嚴重威脅', color: 'red' },
  'High': { score: 80, label: 'high', displayName: '高威脅', color: 'orange' },
  'Medium': { score: 60, label: 'medium', displayName: '中威脅', color: 'yellow' },
  'Low': { score: 40, label: 'low', displayName: '低威脅', color: 'blue' },
  'Informational': { score: 10, label: 'info', displayName: '資訊', color: 'gray' }
};

// ==================== 第五部分：OWASP TOP 10 攻擊模式庫（與 Cloudflare/Check Point 共用）====================

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
 * 惡意 User-Agent 特徵庫（與 Cloudflare/Check Point 共用）
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

// ==================== 第六部分：F5 簽章資料庫（部分常見簽章）====================

/**
 * F5 常見攻擊簽章資料庫（示例）
 */
const F5_SIGNATURE_DATABASE = {
  '200000001': { name: 'SQL-INJ union select', severity: 'critical', category: 'SQL Injection' },
  '200000002': { name: 'SQL-INJ or 1=1', severity: 'critical', category: 'SQL Injection' },
  '200000098': { name: 'XSS <script> tag', severity: 'high', category: 'XSS' },
  '200000099': { name: 'XSS javascript:', severity: 'high', category: 'XSS' },
  '200010001': { name: 'Command Execution', severity: 'critical', category: 'Command Injection' },
  '200020001': { name: 'Path Traversal ../', severity: 'high', category: 'Path Traversal' },
  '200030001': { name: 'Bot Malicious', severity: 'medium', category: 'Bot' }
};

// ==================== 第七部分：核心判斷函數（多層判斷模型）====================

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
 * 分類 request_status
 * @param {string} status - request_status
 * @returns {object} 分類結果
 */
function classifyRequestStatus(status) {
  const normalizedStatus = (status || '').toLowerCase();
  
  for (const [statusName, config] of Object.entries(F5_REQUEST_STATUS_MAPPING)) {
    if (normalizedStatus === statusName.toLowerCase()) {
    return {
        type: statusName.toUpperCase(),
        status: status,
        ...config
      };
    }
  }
  
  // 預設為 passed（如果狀態不明）
    return {
    type: 'PASSED',
    status: status,
    ...F5_REQUEST_STATUS_MAPPING['passed']
  };
}

/**
 * 【核心函數】多層威脅判斷系統（F5 WAF 五層判斷模型）
 * 
 * @param {object} log - F5 日誌條目
 * @returns {object} 威脅判定結果
 */
function analyzeThreatLevel(log) {
  // ========== Layer 1: request_status 狀態判斷 ==========
  const statusClass = classifyRequestStatus(log.request_status);
  
  // 1. blocked → 已阻擋攻擊
  if (statusClass.type === 'BLOCKED') {
    return {
      isThreat: true,
      isBlocked: true,
      isAttack: true,
      severity: statusClass.severity,
      category: 'BLOCKED_ATTACK',
      reason: `請求已被 F5 WAF 阻擋 (${log.request_status})`,
      requiresAction: false,
      aiAnalysisType: statusClass.aiAnalysisType,
      layer: 'REQUEST_STATUS',
      level: 1,
      statusInfo: statusClass
    };
  }
  
  // 2. alerted → 已告警
  if (statusClass.type === 'ALERTED') {
      return {
      isThreat: true,
      isBlocked: false,
      isAttack: false,
      severity: statusClass.severity,
      category: 'ALERTED_EVENT',
      reason: '請求觸發告警，需要進一步調查',
      requiresAction: true,
      aiAnalysisType: statusClass.aiAnalysisType,
      layer: 'REQUEST_STATUS',
        level: 1,
      statusInfo: statusClass
      };
  }

  // ========== Layer 2: violation_rating 違規評分判斷 ==========
  
  const violationRating = parseFloat(log.violation_rating);
  
  if (!isNaN(violationRating) && violationRating > 0) {
    const ratingClass = classifyViolationRating(violationRating);
    
    // 2.1 passed + violation_rating > 0 → 潛在攻擊
    if (statusClass.type === 'PASSED' && ratingClass.isThreat) {
    return {
        isThreat: true,
        isBlocked: false,
      isAttack: true,
        severity: ratingClass.severity,
        category: 'POTENTIAL_ATTACK_PASSED',
        reason: `請求通過但 ${ratingClass.reason}，建議加強防護`,
        requiresAction: true,
        aiAnalysisType: 'full_analysis',
        layer: 'VIOLATION_RATING',
      level: 2,
        violationRating: violationRating,
        ratingInfo: ratingClass
    };
  }

    // 2.2 其他狀態 + 高違規評分
    if (violationRating >= F5_VIOLATION_RATING_THRESHOLDS.HIGH) {
    return {
        isThreat: true,
        isBlocked: statusClass.isBlocked,
      isAttack: true,
        severity: ratingClass.severity,
        category: 'HIGH_VIOLATION_RATING',
        reason: ratingClass.reason,
        requiresAction: !statusClass.isBlocked,
        aiAnalysisType: 'full_analysis',
        layer: 'VIOLATION_RATING',
      level: 2,
      violationRating: violationRating
    };
    }
  }

  // ========== Layer 3: attack_type 攻擊類型匹配 ==========
  
  if (log.attack_type && log.attack_type !== 'N/A' && log.attack_type !== '') {
    // 排除 OWASP 分類標籤格式（如 "A05:2025 Security Misconfiguration"）
    const isOwaspLabel = /^A\d+:\d{4}\s+/.test(log.attack_type);
    
    if (!isOwaspLabel) {
      const attackInfo = F5_ATTACK_TYPE_MAPPING[log.attack_type];
      
      if (attackInfo) {
        return {
          isThreat: true,
          isBlocked: statusClass.isBlocked,
          isAttack: true,
          severity: attackInfo.severity,
          category: 'ATTACK_TYPE_DETECTED',
          reason: `檢測到 ${attackInfo.description} (${log.attack_type})`,
          requiresAction: !statusClass.isBlocked,
          aiAnalysisType: 'full_analysis',
          layer: 'ATTACK_TYPE',
          level: 3,
          attackType: log.attack_type,
          attackInfo: attackInfo
        };
      }
      
      // 即使不在映射表中，有 attack_type 也視為攻擊
      return {
        isThreat: true,
        isBlocked: statusClass.isBlocked,
        isAttack: true,
        severity: 'medium',
        category: 'ATTACK_TYPE_UNCLASSIFIED',
        reason: `檢測到攻擊類型（未分類）: ${log.attack_type}`,
        requiresAction: !statusClass.isBlocked,
        aiAnalysisType: 'full_analysis',
        layer: 'ATTACK_TYPE',
        level: 3,
        attackType: log.attack_type
      };
    }
  }

  // ========== Layer 4: severity / ThreatLevel 嚴重度評估 ==========
  
  // 4.1 ThreatLevel = High/Critical
  if (log.ThreatLevel) {
    const threatLevel = F5_THREAT_LEVEL_MAPPING[log.ThreatLevel];
    if (threatLevel && (log.ThreatLevel === 'High' || log.ThreatLevel === 'Critical')) {
      return {
        isThreat: true,
        isBlocked: statusClass.isBlocked,
        isAttack: true,
        severity: threatLevel.label,
        category: 'HIGH_THREAT_LEVEL',
        reason: `F5 威脅等級評估為 ${threatLevel.displayName}`,
        requiresAction: !statusClass.isBlocked,
        aiAnalysisType: 'full_analysis',
        layer: 'THREAT_LEVEL',
        level: 4,
        threatLevel: log.ThreatLevel
      };
    }
  }
  
  // 4.2 severity = Critical/Alert/Error
  if (log.severity) {
    const severityInfo = F5_SEVERITY_MAPPING[log.severity];
    if (severityInfo && severityInfo.value >= 4) { // Error 或更嚴重
      // 需要配合 violations 才判定為攻擊
    if (log.violations && log.violations !== 'N/A' && log.violations !== '') {
      return {
          isThreat: true,
          isBlocked: statusClass.isBlocked,
        isAttack: true,
          severity: severityInfo.label,
          category: 'HIGH_SEVERITY_WITH_VIOLATIONS',
          reason: `高嚴重程度 (${log.severity}) + 違規組合 (${log.violations})`,
          requiresAction: !statusClass.isBlocked,
          aiAnalysisType: 'full_analysis',
          layer: 'SEVERITY',
        level: 4,
          severityInfo: severityInfo
        };
      }
    }
  }
  
  // 4.3 觸發簽章 (sig_ids)
  if (log.sig_ids && log.sig_ids !== 'N/A' && log.sig_ids !== '' && log.sig_ids !== '0') {
    const sigInfo = F5_SIGNATURE_DATABASE[log.sig_ids];
    return {
      isThreat: true,
      isBlocked: statusClass.isBlocked,
      isAttack: true,
      severity: sigInfo?.severity || 'high',
      category: 'SIGNATURE_TRIGGERED',
      reason: `觸發 F5 攻擊簽章: ${log.sig_names || log.sig_ids}`,
      requiresAction: !statusClass.isBlocked,
      aiAnalysisType: 'full_analysis',
      layer: 'SIGNATURE',
      level: 4,
      signatureId: log.sig_ids,
      signatureName: log.sig_names,
      signatureInfo: sigInfo
    };
  }
  
  // ========== Layer 5: URI / User-Agent 攻擊模式分析 ==========
  
  // 5.1 分析 URI
  const uriAnalysis = analyzeURIPattern(log.uri);
  if (uriAnalysis.isSuspicious) {
    return {
      isThreat: true,
      isBlocked: statusClass.isBlocked,
      isAttack: true,
      severity: uriAnalysis.severity,
      category: 'URI_ATTACK_PATTERN',
      reason: `URI 符合攻擊模式: ${uriAnalysis.owaspName} (${uriAnalysis.matchedPattern})`,
      requiresAction: !statusClass.isBlocked,
      aiAnalysisType: 'full_analysis',
      layer: 'URI_PATTERN',
      level: 5,
      uriAnalysis: uriAnalysis
    };
  }
  
  // 5.2 分析 User-Agent
  const uaAnalysis = analyzeUserAgent(log.userAgent);
  if (uaAnalysis.isSuspicious) {
    return {
      isThreat: true,
      isBlocked: statusClass.isBlocked,
      isAttack: true,
      severity: uaAnalysis.severity,
      category: 'MALICIOUS_USER_AGENT',
      reason: `User-Agent 符合惡意特徵: ${uaAnalysis.reason}`,
      requiresAction: !statusClass.isBlocked,
      aiAnalysisType: 'full_analysis',
      layer: 'USER_AGENT',
      level: 5,
      uaAnalysis: uaAnalysis
    };
  }
  
  // ========== 正常流量 ==========
  
  // 符合正常流量條件：violation_rating = 0 且 severity = Informational
  if ((violationRating === 0 || isNaN(violationRating)) && 
      (log.severity === 'Informational' || log.severity === 'Info')) {
      return {
      isThreat: false,
      isBlocked: false,
        isAttack: false,
      severity: 'info',
      category: 'NORMAL_TRAFFIC',
      reason: 'violation_rating = 0 且 severity = Informational - 正常流量',
      requiresAction: false,
      aiAnalysisType: 'none',
      layer: 'NORMAL_TRAFFIC',
        level: 0
      };
  }

  // 預設為正常流量（所有檢查均未觸發）
  return {
    isThreat: false,
    isBlocked: false,
    isAttack: false,
    severity: 'info',
    category: 'NORMAL_TRAFFIC',
    reason: '未符合任何威脅條件 - 正常業務流量',
    requiresAction: false,
    aiAnalysisType: 'none',
    layer: 'NORMAL_TRAFFIC',
    level: 0
  };
}

// ==================== 輔助函數 ====================

/**
 * 計算威脅分數（向後兼容）
 * @param {object} log - F5 日誌條目
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
 * 檢查是否為高風險攻擊
 */
function isHighRiskAttack(log) {
  const analysis = analyzeThreatLevel(log);
  return analysis.isAttack && (analysis.severity === 'critical' || analysis.severity === 'high');
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
      request_status: log.request_status,
      violation_rating: log.violation_rating,
      attack_type: log.attack_type,
      severity: log.severity,
      ThreatLevel: log.ThreatLevel,
      violations: log.violations,
      sig_ids: log.sig_ids,
      sig_names: log.sig_names,
      uri: log.uri,
      userAgent: log.userAgent,
      client_ip: log.clientIP
    }
  };
}

/**
 * 舊函數名稱（向後兼容）
 */
function isRealSecurityThreat(log) {
  const analysis = analyzeThreatLevel(log);
  return {
    isAttack: analysis.isAttack,
    isThreat: analysis.isThreat,
    confidence: analysis.severity === 'critical' ? 'certain' : 'high',
    reason: analysis.reason,
    layer: analysis.layer,
    level: analysis.level,
    severity: analysis.severity,
    category: analysis.category
  };
}

/**
 * F5 內部路徑白名單（向後兼容）
 */
const F5_INTERNAL_PATHS = [
  '/tmui/', '/mgmt/', '/api/tm/', '/iControl/',
  '/Common/', '/_admin/', '/internal/'
];

function isF5InternalPath(uri) {
  if (!uri) return false;
  return F5_INTERNAL_PATHS.some(path => uri.startsWith(path));
}

// ==================== 匯出 ====================

module.exports = {
  // 常量
  F5_REQUEST_STATUS_MAPPING,
  F5_VIOLATION_RATING_THRESHOLDS,
  F5_ATTACK_TYPE_MAPPING,
  F5_SEVERITY_MAPPING,
  F5_THREAT_LEVEL_MAPPING,
  OWASP_TOP10_PATTERNS,
  MALICIOUS_USER_AGENT_PATTERNS,
  F5_SIGNATURE_DATABASE,
  F5_INTERNAL_PATHS,
  
  // 核心判斷函數
  analyzeThreatLevel,
  classifyRequestStatus,
  classifyViolationRating,
  analyzeURIPattern,
  analyzeUserAgent,
  
  // 分析函數
  calculateThreatScore,
  classifyByThreatScore,
  isHighRiskAttack,
  analyzeLogEntry,
  isF5InternalPath,
  
  // 向後兼容
  isRealSecurityThreat,
  
  // 舊版常量（保留以維持向後兼容）
  F5_VIOLATION_CLASSIFICATION: {
    CRITICAL_ATTACKS: { severity: 'critical' },
    INJECTION_ATTACKS: { severity: 'high' }
  }
};
