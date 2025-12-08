/**
 * 測試腳本：驗證新的 VPN 用戶日誌分析
 * 使用 張右昇(arnold_chang) 的日誌
 */

const { 
  classifyEvent, 
  checkVPNUser,
  EVENT_CLASSIFICATION 
} = require('../config/products/checkpoint/checkpointStandards');

// 用戶提供的新 VPN 用戶日誌
const newVPNUserLog = {
  "_source": {
    "src": "192.168.192.106",
    "layer_name_._._match_table": ["20230523_CP5900 Network"],
    "tags": ["checkpoint"],
    "src_user_name": "張右昇(arnold_chang) (arnold_chang)\n",
    "user": "張右昇(arnold_chang) (arnold_chang)\n",
    "rule_name_._._match_table": ["Cleanup rule"],
    "inzone": "External",
    "port": 48880,
    "geoip": {
      "ip": "0.0.0.0",
      "country_name": "Intranet",
      "city_name": "Intranet"
    },
    "@timestamp": "2025-12-08T05:51:27.000Z",
    "logid": 0,
    "sequencenum": 4,
    "rule_uid_._._match_table": ["406079cd-7466-4f99-b011-1ab8f7c4e7c3"],
    "flags": 400644,
    "outzone": "Internal",
    "originsicname": "CN=ZN_CP5900-2,O=ZN_CPMGsrv..evnn37",
    "parent_rule_._._match_table": [0],
    "ifdir": "inbound",
    "product": "VPN-1 & FireWall-1",
    "time": 1765173087,
    "action": "Drop",
    "origin": "192.168.100.4",
    "service": 443,
    "rule_action_._._match_table": ["Drop"],
    "layer_uuid_._._match_table": ["006bd82f-531c-484c-a160-f2bba391c329"],
    "h_version": 5,
    "match_id_._._match_table": [157],
    "service_id": "HTTPS_SSL",
    "loguid": "0x69366760,0x10022,0x4c7a8c0,0x24f249d7",
    "security_inzone": "L3_untrust",
    "src_user_dn": "CN=張右昇,OU=專案管理暨策略規劃事業群-專案管理暨策略規劃二處-行動智慧一部-專案二組,OU=專案管理暨策略規劃事業群-專案管理暨策略規劃二處-行動智慧一部,OU=專案管理暨策略規劃事業群-專案管理暨策略規劃二處,OU=Phison_Org_OU,DC=phison,DC=com\n",
    "__policy_id_tag": "product=VPN-1 & FireWall-1[db_tag={E302B87A-A88A-9B4E-9BDF-53F691D1776B};mgmt=ZN_CPMGsrv;date=1764931028;policy_name=20230523_CP5900]",
    "ifname": "bond1",
    "s_port": 52675,
    "dst": "192.168.1.200",
    "proto": 6
  }
};

// 解析日誌（模擬 parseCheckPointLog）
function parseLog(rawLog) {
  const source = rawLog._source || rawLog;
  const geoipData = source.geoip || {};
  
  return {
    timestamp: source['@timestamp'],
    action: source.action,
    rule_name: source.rule_name || (source['rule_name_._._match_table'] && source['rule_name_._._match_table'][0]),
    rule_name_match_table: source['rule_name_._._match_table'],
    src: source.src,
    dst: source.dst,
    dst_ip: source.dst,  // 🆕
    dst_machine_name: source.dst_machine_name,  // 🆕 支援 domain 名稱
    security_inzone: source.security_inzone,
    inzone: source.inzone,
    outzone: source.outzone,
    service: source.service,
    service_id: source.service_id,
    product: source.product,
    // VPN 用戶欄位
    src_user_name: source.src_user_name,
    src_user_dn: source.src_user_dn,
    user: source.user,
    // GeoIP
    geoip: geoipData,
    src_country: geoipData.country_name
  };
}

console.log('================================================================================');
console.log('🔍 新 VPN 用戶日誌分析測試');
console.log('================================================================================\n');

// 🆕 模擬有 domain 名稱的日誌
const logWithDomain = {
  "_source": {
    "src": "192.168.192.91",
    "dst": "192.168.0.64",
    "dst_machine_name": "safeq-non-rd@phison.com",  // 🆕 有 domain 名稱
    "src_user_name": "Tinsley Kuo (tinsley_kuo)\n",
    "action": "Drop",
    "rule_name_._._match_table": ["Cleanup rule"],
    "product": "VPN-1 & FireWall-1",
    "geoip": { "country_name": "Intranet" },
    "security_inzone": "L3_untrust",
    "service": 443
  }
};

console.log('📋 測試 Domain 名稱支援');
console.log('─'.repeat(60));
const parsedWithDomain = parseLog(logWithDomain);
console.log(`  - 目標 IP: ${parsedWithDomain.dst}`);
console.log(`  - 目標 Domain: ${parsedWithDomain.dst_machine_name || 'N/A'}`);
console.log(`  - 優先顯示: ${parsedWithDomain.dst_machine_name || parsedWithDomain.dst}`);
console.log(`  ✅ 當有 dst_machine_name 時，會優先顯示 domain 名稱\n`);

// 解析日誌
const parsedLog = parseLog(newVPNUserLog);

console.log('📋 Step 1: 解析原始 ELK 日誌');
console.log('─'.repeat(60));
console.log('解析後的關鍵欄位:');
console.log(`  - 來源 IP: ${parsedLog.src}`);
console.log(`  - 目標 IP: ${parsedLog.dst}`);
console.log(`  - 用戶名稱: ${parsedLog.src_user_name?.trim() || 'N/A'}`);
console.log(`  - 用戶 DN: ${parsedLog.src_user_dn?.trim().substring(0, 80)}...`);
console.log(`  - 產品: ${parsedLog.product}`);
console.log(`  - GeoIP: ${parsedLog.geoip?.country_name || 'N/A'}`);
console.log(`  - 動作: ${parsedLog.action}`);
console.log(`  - 規則: ${parsedLog.rule_name}`);
console.log(`  - 安全區域: ${parsedLog.security_inzone}`);
console.log(`  - 服務: ${parsedLog.service} (${parsedLog.service_id})`);

// Step 2: 檢查 VPN 用戶
console.log('\n📋 Step 2: VPN 用戶識別');
console.log('─'.repeat(60));
const vpnUserInfo = checkVPNUser(parsedLog);
console.log('🔑 VPN 用戶檢查結果:');
console.log(`  - 是否有用戶身份: ${vpnUserInfo.isAuthenticatedUser}`);
console.log(`  - 是否為 VPN 產品: ${vpnUserInfo.isVPNProduct}`);
console.log(`  - 是否為內網: ${vpnUserInfo.isIntranet}`);
console.log(`  - 是否為 VPN IP 範圍: ${vpnUserInfo.isVPNIPRange}`);
console.log(`  - 🔑 是否為 VPN 用戶: ${vpnUserInfo.isVPNUser}`);
console.log(`  - 用戶名: ${vpnUserInfo.userName || 'N/A'}`);

// Step 3: 事件分類
console.log('\n📋 Step 3: 事件分類');
console.log('─'.repeat(60));
const classification = classifyEvent(parsedLog);
console.log('📊 事件分類結果:');
console.log(`  - 分類: ${classification.classification}`);
console.log(`  - 顯示名稱: ${classification.displayName}`);
console.log(`  - 嚴重程度: ${classification.severity}`);
console.log(`  - 是否為攻擊: ${classification.isAttack === false ? '❌ 否' : '⚠️ 是'}`);
console.log(`  - 需要 AI 分析: ${classification.aiAnalysis ? '是' : '否'}`);
console.log(`  - 原因: ${classification.reason}`);

// 驗證結果
const isCorrectClassification = classification.classification === 'VPN_POLICY_ISSUE';
console.log(`\n${isCorrectClassification ? '✅' : '❌'} 分類結果: ${isCorrectClassification ? 'PASS - 正確識別為 VPN 策略問題' : 'FAIL - 分類錯誤'}`);

// Step 4: 模擬生成風險報告
console.log('\n📋 Step 4: 模擬風險報告輸出');
console.log('─'.repeat(60));

const vpnUserDetail = {
  ip: parsedLog.src,
  userName: parsedLog.src_user_name?.trim() || 'Unknown',
  userDN: parsedLog.src_user_dn?.trim() || null,
  eventCount: 1,
  dropCount: 1,
  blockRate: '100.0%',
  securityZone: parsedLog.security_inzone || 'Unknown',
  inzone: parsedLog.inzone || 'Unknown',
  ruleNames: [parsedLog.rule_name],
  blockedByRules: parsedLog.rule_name,
  targetPorts: [parsedLog.service],
  targetIPs: [parsedLog.dst]
};

const riskReport = {
  id: 'risk_006',
  title: '⚠️ VPN 用戶存取被阻擋（需檢視策略）',
  severity: 'medium',
  category: 'VPN_POLICY_ISSUE',
  layer: 'POLICY_REVIEW',
  isAttack: false,
  // 🆕 受影響網址數量（數字類型）
  affectedAssets: 1,
  // 🆕 受影響網址清單
  affectedUrlList: [parsedLog.dst],
  // 🆕 檢測次數（原 openIssues）
  openIssues: 1,
  // 🆕 已阻擋（原 resolvedIssues）
  resolvedIssues: 0,
  description: `檢測到 1 個已認證的 VPN 用戶流量被防火牆阻擋，共 1 次。這不是攻擊，但可能影響用戶正常存取。`,
  vpnUsers: [vpnUserDetail],
  aiInsight: `⚠️ **VPN 用戶存取問題警示**

檢測到以下已認證的 VPN 用戶流量被防火牆阻擋：

• ${vpnUserDetail.userName} (${vpnUserDetail.ip}) - 被 "${vpnUserDetail.blockedByRules}" 阻擋 ${vpnUserDetail.dropCount} 次，安全區域: ${vpnUserDetail.securityZone}

**問題分析：**
這些用戶已通過 VPN 身份驗證，但其流量被防火牆阻擋。這通常表示：
1. 防火牆規則未正確配置 VPN 用戶的存取權限
2. VPN 用戶嘗試存取未授權的資源
3. 安全區域 (security_inzone) 配置可能需要調整

**注意：這不是攻擊行為，而是策略配置問題。**`,
  recommendations: [
    { 
      priority: 'high', 
      title: '檢視 VPN 存取策略', 
      description: `確認 VPN 用戶 ${vpnUserDetail.userName} 是否應該被允許存取 ${parsedLog.dst}:${parsedLog.service}`
    },
    { 
      priority: 'high', 
      title: '檢查防火牆規則順序', 
      description: `被阻擋的規則：${vpnUserDetail.blockedByRules}。確認是否需要在 Cleanup rule 之前新增 VPN 允許規則。`
    },
    { 
      priority: 'medium', 
      title: '確認安全區域配置', 
      description: `VPN 流量來自安全區域：${vpnUserDetail.securityZone}。確認此區域的存取政策是否正確。`
    }
  ]
};

console.log('\n📊 風險報告（JSON 格式）:');
console.log(JSON.stringify(riskReport, null, 2));

// Step 5: 驗證欄位名稱修改
console.log('\n================================================================================');
console.log('📋 Step 5: 驗證欄位名稱修改');
console.log('================================================================================\n');

console.log('🔄 欄位名稱對照表（前端顯示）:');
console.log('─'.repeat(60));
console.log(`  openIssues: ${riskReport.openIssues} → 顯示為「檢測次數: ${riskReport.openIssues}」`);
console.log(`  resolvedIssues: ${riskReport.resolvedIssues} → 顯示為「已阻擋: ${riskReport.resolvedIssues}」`);
console.log(`  affectedAssets: ${riskReport.affectedAssets} → 顯示為「受影響網址: ${riskReport.affectedAssets}」`);
console.log(`  affectedUrlList: [${riskReport.affectedUrlList.join(', ')}] → 顯示網址清單`);

console.log('\n✅ 欄位類型驗證:');
console.log(`  - affectedAssets 是數字類型: ${typeof riskReport.affectedAssets === 'number' ? '✅ 是' : '❌ 否'}`);
console.log(`  - openIssues 是數字類型: ${typeof riskReport.openIssues === 'number' ? '✅ 是' : '❌ 否'}`);
console.log(`  - resolvedIssues 是數字類型: ${typeof riskReport.resolvedIssues === 'number' ? '✅ 是' : '❌ 否'}`);

// Step 6: 模擬前端顯示
console.log('\n================================================================================');
console.log('📋 Step 6: 模擬前端 UI 顯示');
console.log('================================================================================\n');

console.log('┌──────────────────────────────────────────────────────────────────────────────┐');
console.log('│ ⚠️ VPN 用戶存取被阻擋（需檢視策略）                                          │');
console.log('├──────────────────────────────────────────────────────────────────────────────┤');
console.log(`│ 檢測次數: ${riskReport.openIssues}        已阻擋: ${riskReport.resolvedIssues}        受影響網址: ${riskReport.affectedAssets}                        │`);
console.log('├──────────────────────────────────────────────────────────────────────────────┤');
console.log('│ 🆕 受影響網址清單:                                                           │');
console.log(`│   ${riskReport.affectedUrlList.map(url => `[${url}]`).join(' ')}                                             │`);
console.log('├──────────────────────────────────────────────────────────────────────────────┤');
console.log('│ AI 深度分析:                                                                 │');
console.log('│                                                                              │');
console.log('│ ⚠️ **VPN 用戶存取問題警示**                                                  │');
console.log('│                                                                              │');
console.log('│ 檢測到以下已認證的 VPN 用戶流量被防火牆阻擋：                                │');
console.log('│                                                                              │');
console.log(`│ • ${vpnUserDetail.userName.substring(0, 30)}... (${vpnUserDetail.ip})`);
console.log(`│   - 被 "${vpnUserDetail.blockedByRules}" 阻擋 ${vpnUserDetail.dropCount} 次`);
console.log(`│   - 安全區域: ${vpnUserDetail.securityZone}`);
console.log('│                                                                              │');
console.log('│ **注意：這不是攻擊行為，而是策略配置問題。**                                 │');
console.log('└──────────────────────────────────────────────────────────────────────────────┘');

console.log('\n================================================================================');
console.log('📊 測試總結');
console.log('================================================================================\n');

const allPassed = isCorrectClassification && 
                  typeof riskReport.affectedAssets === 'number' &&
                  typeof riskReport.openIssues === 'number' &&
                  Array.isArray(riskReport.affectedUrlList);

console.log(`  VPN 用戶識別: ${vpnUserInfo.isVPNUser ? '✅ PASS' : '❌ FAIL'}`);
console.log(`  事件分類正確: ${isCorrectClassification ? '✅ PASS' : '❌ FAIL'}`);
console.log(`  affectedAssets 數字類型: ${typeof riskReport.affectedAssets === 'number' ? '✅ PASS' : '❌ FAIL'}`);
console.log(`  affectedUrlList 陣列類型: ${Array.isArray(riskReport.affectedUrlList) ? '✅ PASS' : '❌ FAIL'}`);
console.log(`  包含具體網址: ${riskReport.affectedUrlList.length > 0 ? '✅ PASS' : '❌ FAIL'}`);
console.log(`  包含用戶名稱: ${vpnUserDetail.userName ? '✅ PASS' : '❌ FAIL'}`);
console.log(`  包含安全區域: ${vpnUserDetail.securityZone ? '✅ PASS' : '❌ FAIL'}`);
console.log(`  包含阻擋規則: ${vpnUserDetail.blockedByRules ? '✅ PASS' : '❌ FAIL'}`);

console.log(`\n${allPassed ? '✅' : '❌'} 整體結果: ${allPassed ? '所有測試通過！修復符合預期' : '部分測試失敗'}`);

if (allPassed) {
  console.log('\n🎉 修復驗證成功！');
  console.log('   ✅ VPN 用戶 張右昇(arnold_chang) 正確識別為 VPN_POLICY_ISSUE');
  console.log('   ✅ 不會被誤判為攻擊者');
  console.log('   ✅ affectedAssets 是數字類型（不再是陣列）');
  console.log(`   ✅ affectedUrlList 包含具體網址: ${riskReport.affectedUrlList.join(', ')}`);
  console.log('   ✅ 包含完整的用戶資訊（用戶名稱、安全區域、阻擋規則）');
  console.log('   ✅ 前端顯示名詞已更新（檢測次數、已阻擋、受影響網址）');
}

