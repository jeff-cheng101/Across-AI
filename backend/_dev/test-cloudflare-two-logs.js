// 測試修復後的 Cloudflare WAF 分析
// 使用兩筆 ELK raw data

const { analyzeThreatLevel } = require('../config/products/cloudflare/cloudflareStandards');
const { CLOUDFLARE_FIELD_MAPPING } = require('../config/products/cloudflare/cloudflareFieldMapping');

// 兩筆 ELK Raw Data
const rawLogs = [
  // Log 1
  {
    "WAFSQLiAttackScore": 97,
    "ClientCountry": "tw",
    "WAFXSSAttackScore": 96,
    "SecurityRuleIDs": ["afce0103f8b747a896dc36d0a0774c86"],
    "SecurityRuleDescription": "log",
    "SecuritySources": ["firewallCustom"],
    "WAFAttackScore": 84,
    "ClientRequestURI": "/worklog/WorkList",
    "SecurityAction": "log",
    "ZoneName": "phison.com",
    "ClientCity": "Taipei",
    "EdgeResponseStatus": 200,
    "ClientIP": "2402:7500:4e9:4be6:19d6:cb2d:ce46:b0dd",
    "ClientRequestMethod": "GET",
    "ClientRequestUserAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 26_0_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/142.0.7444.148 Mobile/15E148 Safari/604.1",
    "ThreatLevel": "Info",
    "WAFRCEAttackScore": 88,
    "EdgeStartTimestamp": "2025-11-25T23:59:13Z",
    "SecurityRuleID": "afce0103f8b747a896dc36d0a0774c86"
  },
  // Log 2
  {
    "WAFSQLiAttackScore": 96,
    "ClientCountry": "tw",
    "WAFXSSAttackScore": 96,
    "SecurityRuleIDs": ["afce0103f8b747a896dc36d0a0774c86"],
    "SecurityRuleDescription": "log",
    "SecuritySources": ["firewallCustom"],
    "WAFAttackScore": 85,
    "ClientRequestURI": "/wl-api/member/auth",
    "SecurityAction": "log",
    "ZoneName": "phison.com",
    "ClientCity": "Taichung",
    "EdgeResponseStatus": 200,
    "ClientIP": "2402:7500:917:7084:6498:cb9c:983:9d48",
    "ClientRequestMethod": "POST",
    "ClientRequestUserAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6.1 Safari/605.1.15",
    "ThreatLevel": "Info",
    "WAFRCEAttackScore": 89,
    "EdgeStartTimestamp": "2025-11-25T23:57:55Z",
    "SecurityRuleID": "afce0103f8b747a896dc36d0a0774c86"
  }
];

console.log('\n🔍 ===== Cloudflare WAF 日誌分析（修復後版本）=====\n');

rawLogs.forEach((rawLog, index) => {
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📋 分析 Log ${index + 1}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
  
  // 解析日誌
  const log = {
    timestamp: rawLog.EdgeStartTimestamp,
    clientIP: rawLog.ClientIP,
    clientCountry: rawLog.ClientCountry,
    clientCity: rawLog.ClientCity,
    requestURI: rawLog.ClientRequestURI,
    requestMethod: rawLog.ClientRequestMethod,
    userAgent: rawLog.ClientRequestUserAgent,
    securityAction: rawLog.SecurityAction,
    securityRule: rawLog.SecurityRuleID,
    securityRuleDescription: rawLog.SecurityRuleDescription,
    securitySources: rawLog.SecuritySources,
    wafAttackScore: rawLog.WAFAttackScore,
    wafSQLiScore: rawLog.WAFSQLiAttackScore,
    wafXSSScore: rawLog.WAFXSSAttackScore,
    wafRCEScore: rawLog.WAFRCEAttackScore,
    edgeResponseStatus: rawLog.EdgeResponseStatus,
    zoneName: rawLog.ZoneName,
    threatLevel: rawLog.ThreatLevel
  };
  
  console.log('📊 原始日誌資訊:');
  console.log(`   時間: ${log.timestamp}`);
  console.log(`   來源: ${log.clientIP} (${log.clientCity}, ${log.clientCountry?.toUpperCase()})`);
  console.log(`   請求: ${log.requestMethod} ${log.requestURI}`);
  console.log(`   域名: ${log.zoneName}`);
  console.log(`   User-Agent: ${log.userAgent.substring(0, 80)}...`);
  console.log(`   SecurityAction: ${log.securityAction}`);
  console.log(`   SecurityRule: ${log.securityRule}`);
  console.log(`   EdgeResponseStatus: ${log.edgeResponseStatus}`);
  
  console.log('\n📈 WAF 分數:');
  console.log(`   總體 WAF Score: ${log.wafAttackScore}`);
  console.log(`   SQL 注入 Score: ${log.wafSQLiScore}`);
  console.log(`   XSS Score: ${log.wafXSSScore}`);
  console.log(`   RCE Score: ${log.wafRCEScore}`);
  
  // 使用修復後的 analyzeThreatLevel 分析
  console.log('\n🔍 使用修復後的 analyzeThreatLevel() 分析:\n');
  const analysis = analyzeThreatLevel(log);
  
  console.log('✅ 分析結果:');
  console.log(`   ➤ isThreat: ${analysis.isThreat ? '✅ 是威脅' : '❌ 不是威脅'}`);
  console.log(`   ➤ isBlocked: ${analysis.isBlocked ? '✅ 已阻擋' : '❌ 未阻擋'}`);
  console.log(`   ➤ category: ${analysis.category}`);
  console.log(`   ➤ layer: ${analysis.layer}`);
  console.log(`   ➤ reason: ${analysis.reason}`);
  console.log(`   ➤ attackType: ${analysis.attackType || '無'}`);
  console.log(`   ➤ severity: ${analysis.severity}`);
  console.log(`   ➤ actionClassification: ${analysis.actionClassification}`);
  
  if (analysis.wafScoreAnalysis) {
    console.log('\n📊 WAF 分數分析:');
    console.log(`   ➤ 總體分類: ${analysis.wafScoreAnalysis.overall.classification} (分數: ${analysis.wafScoreAnalysis.overall.score})`);
    console.log(`   ➤ SQL 注入分類: ${analysis.wafScoreAnalysis.sqli.classification} (分數: ${analysis.wafScoreAnalysis.sqli.score})`);
    console.log(`   ➤ XSS 分類: ${analysis.wafScoreAnalysis.xss.classification} (分數: ${analysis.wafScoreAnalysis.xss.score})`);
    console.log(`   ➤ RCE 分類: ${analysis.wafScoreAnalysis.rce.classification} (分數: ${analysis.wafScoreAnalysis.rce.score})`);
  }
  
  if (analysis.uriAnalysis) {
    console.log('\n🔍 URI 分析:');
    console.log(`   ➤ 攻擊類型: ${analysis.uriAnalysis.attackType || '無'}`);
    console.log(`   ➤ 風險: ${analysis.uriAnalysis.risk}`);
    console.log(`   ➤ 匹配模式: ${analysis.uriAnalysis.patterns?.join(', ') || '無'}`);
  }
  
  if (analysis.uaAnalysis) {
    console.log('\n🤖 User-Agent 分析:');
    console.log(`   ➤ 是否惡意: ${analysis.uaAnalysis.isMalicious ? '✅ 是' : '❌ 否'}`);
    console.log(`   ➤ 類型: ${analysis.uaAnalysis.type}`);
    console.log(`   ➤ 風險: ${analysis.uaAnalysis.risk}`);
  }
  
  // 根據修復後的邏輯，判斷應該如何處理
  console.log('\n💡 建議處理方式:');
  if (!analysis.isThreat) {
    console.log('   ✅ 正常流量，無需處理');
  } else if (analysis.isBlocked) {
    console.log('   ✅ 威脅已被阻擋，建議：');
    console.log('      - 持續監控攻擊趨勢');
    console.log('      - 觀察阻擋量是否上升');
    console.log('      - 分析攻擊模式');
  } else {
    console.log('   ⚠️ 威脅未被阻擋，建議：');
    console.log('      - 立即檢查 WAF 規則配置');
    console.log('      - 考慮啟用或強化 WAF 規則');
    console.log('      - 封鎖攻擊來源 IP');
    console.log('      - 建立 Custom Rules 使用 Attack Score');
  }
  
  // 根據動態建議生成器的邏輯
  if (analysis.isThreat && analysis.actionClassification === 'LOGGED_ONLY') {
    console.log('\n⚠️ 注意：此請求僅被記錄（log），未採取阻擋行動');
    console.log('   建議調整 SecurityAction 為 "block" 或 "challenge"');
  }
});

console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📊 總體統計');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const allAnalyses = rawLogs.map(rawLog => {
  const log = {
    timestamp: rawLog.EdgeStartTimestamp,
    clientIP: rawLog.ClientIP,
    clientCountry: rawLog.ClientCountry,
    requestURI: rawLog.ClientRequestURI,
    requestMethod: rawLog.ClientRequestMethod,
    userAgent: rawLog.ClientRequestUserAgent,
    securityAction: rawLog.SecurityAction,
    securityRule: rawLog.SecurityRuleID,
    securityRuleDescription: rawLog.SecurityRuleDescription,
    wafAttackScore: rawLog.WAFAttackScore,
    wafSQLiScore: rawLog.WAFSQLiAttackScore,
    wafXSSScore: rawLog.WAFXSSAttackScore,
    wafRCEScore: rawLog.WAFRCEAttackScore,
    edgeResponseStatus: rawLog.EdgeResponseStatus
  };
  return analyzeThreatLevel(log);
});

const threatCount = allAnalyses.filter(a => a.isThreat).length;
const blockedCount = allAnalyses.filter(a => a.isBlocked).length;
const unblockedCount = allAnalyses.filter(a => a.isThreat && !a.isBlocked).length;

console.log(`總日誌數: ${rawLogs.length} 筆`);
console.log(`威脅數量: ${threatCount} 筆`);
console.log(`已阻擋: ${blockedCount} 筆`);
console.log(`未阻擋: ${unblockedCount} 筆`);

if (threatCount > 0) {
  const blockedRate = (blockedCount / threatCount * 100).toFixed(1);
  console.log(`\n阻擋率: ${blockedRate}%`);
  
  console.log('\n💡 根據修復後的動態建議生成器邏輯:');
  if (blockedRate == 100) {
    console.log('   ✅ 情境 1: 全部被阻擋');
    console.log('   ➤ 建議: 防護規則已生效 - 持續監控');
    console.log('   ➤ 優先級: medium/low');
  } else if (blockedRate >= 80) {
    console.log('   ⚠️ 情境 2: 大部分被阻擋 (80%-99%)');
    console.log('   ➤ 建議: 強化防護規則 - 減少通過率');
    console.log('   ➤ 優先級: high/medium');
  } else if (blockedRate < 80 && blockedRate > 0) {
    console.log('   🚨 情境 4: 大部分未被阻擋 (< 80%)');
    console.log('   ➤ 建議: 立即啟用防護規則');
    console.log('   ➤ 優先級: high/critical');
  } else {
    console.log('   🚨 情境 4: 完全未阻擋 (0%)');
    console.log('   ➤ 建議: ⚠️ 緊急！立即啟用防護規則');
    console.log('   ➤ 優先級: critical');
  }
} else {
  console.log('\n✅ 所有日誌均為正常流量，無威脅');
}

console.log('\n\n✅ ===== 分析完成 =====\n');

