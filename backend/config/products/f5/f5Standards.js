// backend/config/products/f5/f5Standards.js
// F5 Advanced WAF 安全標準配置
// 參考 F5 BIG-IP ASM/Advanced WAF 安全策略

/**
 * F5 嚴重程度分類（基於 F5 原生分類）
 * F5 使用不同的嚴重程度評級系統
 */
const F5_SEVERITY_CLASSIFICATION = {
  CRITICAL: {
    value: 5,
    label: 'critical',
    displayName: '嚴重',
    severity: 'critical',
    color: 'red',
    description: 'F5 判定為嚴重威脅，需立即處理'
  },
  HIGH: {
    value: 4,
    label: 'high',
    displayName: '高',
    severity: 'high',
    color: 'orange',
    description: 'F5 判定為高風險攻擊'
  },
  MEDIUM: {
    value: 3,
    label: 'medium',
    displayName: '中',
    severity: 'medium',
    color: 'yellow',
    description: 'F5 判定為中等風險'
  },
  LOW: {
    value: 2,
    label: 'low',
    displayName: '低',
    severity: 'low',
    color: 'blue',
    description: 'F5 判定為低風險'
  },
  INFORMATIONAL: {
    value: 1,
    label: 'info',
    displayName: '資訊',
    severity: 'info',
    color: 'gray',
    description: 'F5 資訊性事件'
  }
};

/**
 * F5 攻擊類型分類（基於 F5 AWAF 攻擊簽名）
 */
const F5_ATTACK_TYPES = {
  SQL_INJECTION: {
    name: 'SQL Injection',
    displayName: 'SQL 注入',
    owaspCategory: 'A03:2021 - Injection',
    description: 'SQL 注入攻擊嘗試'
  },
  XSS: {
    name: 'Cross Site Scripting (XSS)',
    displayName: '跨站腳本攻擊 (XSS)',
    owaspCategory: 'A03:2021 - Injection',
    description: 'XSS 攻擊嘗試'
  },
  COMMAND_EXECUTION: {
    name: 'Command Execution',
    displayName: '命令執行',
    owaspCategory: 'A03:2021 - Injection',
    description: '遠程命令執行攻擊'
  },
  PATH_TRAVERSAL: {
    name: 'Path Traversal',
    displayName: '路徑遍歷',
    owaspCategory: 'A01:2021 - Broken Access Control',
    description: '路徑遍歷攻擊'
  },
  INFORMATION_LEAKAGE: {
    name: 'Information Leakage',
    displayName: '資訊洩漏',
    owaspCategory: 'A01:2021 - Broken Access Control',
    description: '敏感資訊洩漏'
  },
  SESSION_HIJACKING: {
    name: 'Session Hijacking',
    displayName: '會話劫持',
    owaspCategory: 'A07:2021 - Authentication Failures',
    description: '會話劫持攻擊'
  },
  BUFFER_OVERFLOW: {
    name: 'Buffer Overflow',
    displayName: '緩衝區溢位',
    owaspCategory: 'A03:2021 - Injection',
    description: '緩衝區溢位攻擊'
  },
  DENIAL_OF_SERVICE: {
    name: 'Denial of Service',
    displayName: '拒絕服務',
    owaspCategory: 'Application DDoS',
    description: '拒絕服務攻擊'
  },
  MALICIOUS_BOT: {
    name: 'Malicious Bot',
    displayName: '惡意機器人',
    owaspCategory: 'Bot Attack',
    description: '惡意機器人流量'
  }
};

/**
 * F5 內部路徑（不應被視為攻擊）
 */
const F5_INTERNAL_PATHS = [
  '/tmui/',           // F5 管理介面
  '/f5/',             // F5 內部路徑
  '/sam/',            // F5 SAM 模組
  '/xui/',            // F5 新版管理介面
];

/**
 * F5 違規評分閾值
 */
const F5_VIOLATION_THRESHOLDS = {
  CRITICAL: 90,    // >= 90 為嚴重
  HIGH: 70,        // >= 70 為高風險
  MEDIUM: 50,      // >= 50 為中風險
  LOW: 30          // >= 30 為低風險
};

/**
 * 根據 F5 嚴重程度值分類
 * @param {number} severityValue - F5 嚴重程度值 (1-5)
 * @returns {object} 分類資訊
 */
function classifyF5Severity(severityValue) {
  if (severityValue === 5) return F5_SEVERITY_CLASSIFICATION.CRITICAL;
  if (severityValue === 4) return F5_SEVERITY_CLASSIFICATION.HIGH;
  if (severityValue === 3) return F5_SEVERITY_CLASSIFICATION.MEDIUM;
  if (severityValue === 2) return F5_SEVERITY_CLASSIFICATION.LOW;
  if (severityValue === 1) return F5_SEVERITY_CLASSIFICATION.INFORMATIONAL;
  
  return F5_SEVERITY_CLASSIFICATION.INFORMATIONAL;
}

/**
 * 根據違規評分分類
 * @param {number} violationRating - F5 違規評分
 * @returns {string} 嚴重程度
 */
function getSeverityByViolationRating(violationRating) {
  if (violationRating >= F5_VIOLATION_THRESHOLDS.CRITICAL) return 'critical';
  if (violationRating >= F5_VIOLATION_THRESHOLDS.HIGH) return 'high';
  if (violationRating >= F5_VIOLATION_THRESHOLDS.MEDIUM) return 'medium';
  if (violationRating >= F5_VIOLATION_THRESHOLDS.LOW) return 'low';
  return 'info';
}

/**
 * 檢查 URI 是否為 F5 內部路徑
 * @param {string} uri - 請求 URI
 * @returns {boolean} 是否為內部路徑
 */
function isF5InternalPath(uri) {
  if (!uri || typeof uri !== 'string') {
    return false;
  }
  
  return F5_INTERNAL_PATHS.some(path => uri.startsWith(path));
}

/**
 * 檢查是否為真實安全威脅
 * @param {object} log - F5 日誌條目
 * @returns {boolean} 是否為威脅
 */
function isRealSecurityThreat(log) {
  // 條件 1：不是 F5 內部路徑
  if (isF5InternalPath(log.uri)) {
    return false;
  }
  
  // 條件 2：有攻擊類型標記
  if (log.attack_type && log.attack_type !== 'N/A' && log.attack_type !== '') {
    return true;
  }
  
  // 條件 3：嚴重程度達到一定級別
  if (log.severity >= 3) {  // medium 以上
    return true;
  }
  
  // 條件 4：違規評分達到閾值
  if (log.violation_rating >= F5_VIOLATION_THRESHOLDS.MEDIUM) {
    return true;
  }
  
  return false;
}

module.exports = {
  F5_SEVERITY_CLASSIFICATION,
  F5_ATTACK_TYPES,
  F5_INTERNAL_PATHS,
  F5_VIOLATION_THRESHOLDS,
  classifyF5Severity,
  getSeverityByViolationRating,
  isF5InternalPath,
  isRealSecurityThreat
};

