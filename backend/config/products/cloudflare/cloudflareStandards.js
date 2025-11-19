// Cloudflare 官方標準配置
// 基於 Cloudflare 官方文件 (cloudflare-docs/stages/stage-4-security-products/)
// 參考: traffic-detections.md, waf.md, reference.md

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
 * Cloudflare 內部端點列表
 * 來源: cloudflare-docs/stages/stage-3-zero-trust/access.md
 * 
 * 這些端點是 Cloudflare 的內部服務，不應被視為攻擊
 */
const CLOUDFLARE_INTERNAL_PATHS = [
  '/cdn-cgi/',              // 所有 cdn-cgi 路徑
  '/__cf_',                 // Cloudflare 內部前綴
  '/cdn-cgi/access/',       // Zero Trust Access
  '/cdn-cgi/scripts/',      // Cloudflare 腳本服務
  '/cdn-cgi/rum',           // Real User Monitoring (RUM)
  '/cdn-cgi/beacon/',       // 分析和監控
  '/cdn-cgi/trace',         // 診斷工具
  '/cdn-cgi/challenge-platform/',  // Challenge 平台
];

/**
 * 官方建議的高風險閾值
 * 來源: traffic-detections.md
 * 
 * Cloudflare 建議：
 * - 不要僅根據 < 50 阻擋流量（容易誤報）
 * - 建議使用 <= 20 作為初始閾值
 * - 可根據實際情況調整到 <= 15
 */
const RECOMMENDED_THRESHOLDS = {
  CRITICAL: 10,      // <= 10 為嚴重威脅
  HIGH: 20,          // <= 20 為高風險（官方建議初始值）
  MEDIUM: 50,        // <= 50 為中風險（但容易誤報）
  STRICT: 15         // <= 15 為嚴格模式
};

/**
 * 分類 WAF Attack Score
 * @param {number} score - WAF 分數 (0-100 或 undefined)
 * @returns {object} 分類資訊
 */
function classifyWAFScore(score) {
  // 未評分情況
  if (score === undefined || score === null) {
    return WAF_SCORE_CLASSIFICATION.UNSCORED;
  }
  
  if (score === 0 || score === 100) {
    return WAF_SCORE_CLASSIFICATION.UNSCORED;
  }
  
  // 攻擊 (1-20)
  if (score >= 1 && score <= 20) {
    return WAF_SCORE_CLASSIFICATION.ATTACK;
  }
  
  // 可能攻擊 (21-50)
  if (score >= 21 && score <= 50) {
    return WAF_SCORE_CLASSIFICATION.LIKELY_ATTACK;
  }
  
  // 可能正常 (51-80)
  if (score >= 51 && score <= 80) {
    return WAF_SCORE_CLASSIFICATION.LIKELY_CLEAN;
  }
  
  // 正常 (81-99)
  if (score >= 81 && score <= 99) {
    return WAF_SCORE_CLASSIFICATION.CLEAN;
  }
  
  // 其他情況（不應該發生）
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
 * 檢查是否為真實的安全威脅
 * 結合多個條件判斷（基於官方最佳實踐）
 * @param {object} log - 日誌條目
 * @param {number} threshold - 分數閾值（預設 20）
 * @returns {boolean} 是否為真實威脅
 */
function isRealSecurityThreat(log, threshold = RECOMMENDED_THRESHOLDS.HIGH) {
  // 條件 1：不是 Cloudflare 內部端點
  if (isCloudflareInternalEndpoint(log.requestURI)) {
    return false;
  }
  
  // 條件 2：有有效的 WAF 分數
  const hasValidScore = isValidWAFScore(log.wafSQLiScore) || 
                        isValidWAFScore(log.wafXSSScore) || 
                        isValidWAFScore(log.wafRCEScore);
  
  // 條件 3：分數低於閾值
  const belowThreshold = (log.wafSQLiScore >= 1 && log.wafSQLiScore <= threshold) ||
                         (log.wafXSSScore >= 1 && log.wafXSSScore <= threshold) ||
                         (log.wafRCEScore >= 1 && log.wafRCEScore <= threshold);
  
  // 條件 4：有實際的安全動作（可選）
  const hasSecurityAction = log.securityAction && 
                           log.securityAction !== 'N/A' &&
                           log.securityAction !== '' &&
                           ['block', 'challenge', 'managed_challenge', 'js_challenge', 'log'].includes(log.securityAction.toLowerCase());
  
  // 判定：有有效分數且低於閾值，或有安全動作
  return (hasValidScore && belowThreshold) || hasSecurityAction;
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
  // 範例 1：阻擋高風險 SQL 注入（官方建議）
  blockHighRiskSQLi: {
    name: 'Block High Risk SQL Injection',
    expression: 'cf.waf.score.sqli le 20',
    action: 'block',
    description: '阻擋 WAF SQLi 分數 <= 20 的請求（官方建議閾值）'
  },
  
  // 範例 2：挑戰可能的攻擊（結合多個條件）
  challengeLikelyAttack: {
    name: 'Challenge Likely Attack',
    expression: 'cf.waf.score le 30 and not http.request.uri.path starts_with "/cdn-cgi/"',
    action: 'managed_challenge',
    description: '對可能的攻擊發起挑戰，但排除內部端點'
  },
  
  // 範例 3：記錄中風險請求（用於分析）
  logMediumRisk: {
    name: 'Log Medium Risk Requests',
    expression: 'cf.waf.score le 50 and cf.waf.score gt 20',
    action: 'log',
    description: '記錄中風險請求供後續分析'
  }
};

module.exports = {
  WAF_SCORE_CLASSIFICATION,
  CLOUDFLARE_INTERNAL_PATHS,
  RECOMMENDED_THRESHOLDS,
  classifyWAFScore,
  isCloudflareInternalEndpoint,
  isValidWAFScore,
  isRealSecurityThreat,
  getSeverityByScore,
  calculateValidAvgScore,
  RULE_EXAMPLES
};

