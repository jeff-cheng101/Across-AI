/**
 * 測試腳本：驗證 VPN 用戶識別功能
 * 用於測試已認證的 VPN 用戶不會被誤判為攻擊者
 */

const { 
  classifyEvent, 
  checkVPNUser,
  EVENT_CLASSIFICATION 
} = require('../config/products/checkpoint/checkpointStandards');

// 用戶提供的 VPN 用戶日誌（應該被識別為 VPN 策略問題，而非攻擊）
const vpnUserLog = {
  "_source": {
    "layer_name_._._match_table": ["20230523_CP5900 Network"],
    "src_user_name": "Tinsley Kuo (tinsley_kuo)\n",
    "rule_name_._._match_table": ["Cleanup rule"],
    "sequencenum": 12,
    "rule_uid_._._match_table": ["406079cd-7466-4f99-b011-1ab8f7c4e7c3"],
    "outzone": "Internal",
    "originsicname": "CN=ZN_CP5900-2,O=ZN_CPMGsrv..evnn37",
    "rule_action_._._match_table": ["Drop"],
    "origin": "192.168.100.4",
    "h_version": 5,
    "match_id_._._match_table": [157],
    "service_id": "V9de1d1c6-60e4-42f8-85bb-41856f87357e",
    "security_inzone": "L3_untrust",
    "src_user_dn": "CN=郭渟家,OU=行銷業務六處-大陸行銷業務一部,OU=行銷業務六處,OU=Phison_Org_OU,DC=phison,DC=com\n",
    "__policy_id_tag": "product=VPN-1 & FireWall-1[db_tag={E302B87A-A88A-9B4E-9BDF-53F691D1776B};mgmt=ZN_CPMGsrv;date=1764931028;policy_name=20230523_CP5900]",
    "s_port": 56984,
    "src": "192.168.192.91",
    "dst_user_name": "help (help)\n",
    "tags": ["checkpoint"],
    "user": "Tinsley Kuo (tinsley_kuo)\n",
    "geoip": {
      "ip": "0.0.0.0",
      "country_name": "Intranet",
      "city_name": "Intranet"
    },
    "inzone": "External",
    "port": 48880,
    "@timestamp": "2025-12-08T05:51:27.000Z",
    "logid": 0,
    "flags": 400644,
    "dst_user_dn": "CN=help,CN=Users,DC=phison,DC=com\n",
    "parent_rule_._._match_table": [0],
    "ifdir": "inbound",
    "product": "VPN-1 & FireWall-1",
    "time": 1765173087,
    "action": "Drop",
    "service": 443,
    "layer_uuid_._._match_table": ["006bd82f-531c-484c-a160-f2bba391c329"],
    "loguid": "0x69366760,0x10024,0x4c7a8c0,0x24f249d7",
    "dst_machine_name": "safeq-non-rd@phison.com",
    "ifname": "bond1",
    "dst": "192.168.0.64",
    "proto": 17
  }
};

// 外部攻擊者日誌（應該被識別為攻擊）
const externalAttackerLog = {
  "_source": {
    "rule_name_._._match_table": ["Cleanup rule"],
    "rule_action_._._match_table": ["Drop"],
    "security_inzone": "L3_untrust",
    "s_port": 12345,
    "src": "80.82.77.144",
    "geoip": {
      "ip": "80.82.77.144",
      "country_name": "The Netherlands",
      "city_name": "Amsterdam"
    },
    "inzone": "External",
    "outzone": "Local",
    "@timestamp": "2025-12-08T02:33:07.000Z",
    "ifdir": "inbound",
    "product": "VPN-1 & FireWall-1",
    "action": "Drop",
    "service": 18888,
    "dst": "192.168.102.2",
    "proto": 6
    // 注意：沒有 src_user_name 或 src_user_dn（無用戶身份）
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
    security_inzone: source.security_inzone,
    inzone: source.inzone,
    outzone: source.outzone,
    service: source.service,
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
console.log('🔍 VPN 用戶識別測試');
console.log('================================================================================\n');

// 測試 1: VPN 用戶日誌
console.log('📋 測試 1: VPN 用戶日誌（應該被識別為 VPN_POLICY_ISSUE）');
console.log('─'.repeat(60));

const parsedVPNLog = parseLog(vpnUserLog);
console.log('解析後的關鍵欄位:');
console.log(`  - 來源 IP: ${parsedVPNLog.src}`);
console.log(`  - 用戶名稱: ${parsedVPNLog.src_user_name?.trim() || 'N/A'}`);
console.log(`  - 用戶 DN: ${parsedVPNLog.src_user_dn?.trim() || 'N/A'}`);
console.log(`  - 產品: ${parsedVPNLog.product}`);
console.log(`  - GeoIP: ${parsedVPNLog.geoip?.country_name || 'N/A'}`);
console.log(`  - 動作: ${parsedVPNLog.action}`);
console.log(`  - 規則: ${parsedVPNLog.rule_name}`);

// 檢查 VPN 用戶
const vpnUserInfo = checkVPNUser(parsedVPNLog);
console.log('\n🔑 VPN 用戶檢查結果:');
console.log(`  - 是否有用戶身份: ${vpnUserInfo.isAuthenticatedUser}`);
console.log(`  - 是否為 VPN 產品: ${vpnUserInfo.isVPNProduct}`);
console.log(`  - 是否為內網: ${vpnUserInfo.isIntranet}`);
console.log(`  - 是否為 VPN IP 範圍: ${vpnUserInfo.isVPNIPRange}`);
console.log(`  - 🔑 是否為 VPN 用戶: ${vpnUserInfo.isVPNUser}`);
console.log(`  - 用戶名: ${vpnUserInfo.userName || 'N/A'}`);

// 分類事件
const vpnClassification = classifyEvent(parsedVPNLog);
console.log('\n📊 事件分類結果:');
console.log(`  - 分類: ${vpnClassification.classification}`);
console.log(`  - 顯示名稱: ${vpnClassification.displayName}`);
console.log(`  - 嚴重程度: ${vpnClassification.severity}`);
console.log(`  - 是否為攻擊: ${vpnClassification.isAttack === false ? '❌ 否' : '⚠️ 是'}`);
console.log(`  - 原因: ${vpnClassification.reason}`);

// 驗證結果
const vpnTestPass = vpnClassification.classification === 'VPN_POLICY_ISSUE';
console.log(`\n${vpnTestPass ? '✅' : '❌'} 測試結果: ${vpnTestPass ? 'PASS - 正確識別為 VPN 策略問題' : 'FAIL - 未正確識別'}`);

console.log('\n');

// 測試 2: 外部攻擊者日誌
console.log('📋 測試 2: 外部攻擊者日誌（應該被識別為 SCAN_SUSPICIOUS）');
console.log('─'.repeat(60));

const parsedAttackerLog = parseLog(externalAttackerLog);
console.log('解析後的關鍵欄位:');
console.log(`  - 來源 IP: ${parsedAttackerLog.src}`);
console.log(`  - 用戶名稱: ${parsedAttackerLog.src_user_name?.trim() || 'N/A'}`);
console.log(`  - 用戶 DN: ${parsedAttackerLog.src_user_dn?.trim() || 'N/A'}`);
console.log(`  - 產品: ${parsedAttackerLog.product}`);
console.log(`  - GeoIP: ${parsedAttackerLog.geoip?.country_name || 'N/A'}`);
console.log(`  - 動作: ${parsedAttackerLog.action}`);
console.log(`  - 規則: ${parsedAttackerLog.rule_name}`);

// 檢查 VPN 用戶
const attackerVPNInfo = checkVPNUser(parsedAttackerLog);
console.log('\n🔑 VPN 用戶檢查結果:');
console.log(`  - 是否有用戶身份: ${attackerVPNInfo.isAuthenticatedUser}`);
console.log(`  - 是否為 VPN 產品: ${attackerVPNInfo.isVPNProduct}`);
console.log(`  - 是否為內網: ${attackerVPNInfo.isIntranet}`);
console.log(`  - 是否為 VPN IP 範圍: ${attackerVPNInfo.isVPNIPRange}`);
console.log(`  - 🔑 是否為 VPN 用戶: ${attackerVPNInfo.isVPNUser}`);

// 分類事件
const attackerClassification = classifyEvent(parsedAttackerLog);
console.log('\n📊 事件分類結果:');
console.log(`  - 分類: ${attackerClassification.classification}`);
console.log(`  - 顯示名稱: ${attackerClassification.displayName}`);
console.log(`  - 嚴重程度: ${attackerClassification.severity}`);
console.log(`  - 原因: ${attackerClassification.reason}`);

// 驗證結果
const attackerTestPass = attackerClassification.classification === 'SCAN_SUSPICIOUS';
console.log(`\n${attackerTestPass ? '✅' : '❌'} 測試結果: ${attackerTestPass ? 'PASS - 正確識別為可疑掃描' : 'FAIL - 未正確識別'}`);

console.log('\n');

// 測試總結
console.log('================================================================================');
console.log('📊 測試總結');
console.log('================================================================================\n');

console.log(`  VPN 用戶識別: ${vpnTestPass ? '✅ PASS' : '❌ FAIL'}`);
console.log(`  外部攻擊者識別: ${attackerTestPass ? '✅ PASS' : '❌ FAIL'}`);

const allTestsPass = vpnTestPass && attackerTestPass;
console.log(`\n${allTestsPass ? '✅' : '❌'} 整體結果: ${allTestsPass ? '所有測試通過' : '部分測試失敗'}`);

if (allTestsPass) {
  console.log('\n🎉 VPN 用戶識別功能正常運作！');
  console.log('   - VPN 用戶的被阻擋流量會被標記為「VPN 策略問題」');
  console.log('   - 不會被誤判為攻擊者');
  console.log('   - 前端會顯示為中等嚴重度，並提供策略檢視建議');
}

// 🆕 測試 3: 模擬完整的風險報告輸出
console.log('\n');
console.log('================================================================================');
console.log('📋 測試 3: 模擬 VPN 策略問題風險報告輸出');
console.log('================================================================================\n');

// 模擬聚合統計結果
const mockAggregatedStats = {
  '192.168.192.91': {
    ip: '192.168.192.91',
    totalEvents: 20,
    dropCount: 20,
    rejectCount: 0,
    acceptCount: 0,
    isVPNUser: true,
    userName: 'Tinsley Kuo (tinsley_kuo)',
    userDN: 'CN=郭渟家,OU=行銷業務六處-大陸行銷業務一部,OU=行銷業務六處,OU=Phison_Org_OU,DC=phison,DC=com',
    securityZone: 'L3_untrust',
    inzone: 'External',
    blockRate: '100.0',
    ruleNames: ['Cleanup rule'],
    targetPorts: [443, 445, 137, 135],
    targetIPs: ['192.168.0.64', '192.168.0.100'],
    geoInfo: { country: 'Intranet', city: 'Intranet' }
  },
  '192.168.192.105': {
    ip: '192.168.192.105',
    totalEvents: 15,
    dropCount: 15,
    rejectCount: 0,
    acceptCount: 0,
    isVPNUser: true,
    userName: 'John Doe (john_doe)',
    userDN: 'CN=John Doe,OU=IT,DC=phison,DC=com',
    securityZone: 'L3_untrust',
    inzone: 'External',
    blockRate: '100.0',
    ruleNames: ['Cleanup rule'],
    targetPorts: [443, 80],
    targetIPs: ['192.168.0.50'],
    geoInfo: { country: 'Intranet', city: 'Intranet' }
  }
};

// 模擬 VPN 策略問題清單
const vpnPolicyIssues = Object.values(mockAggregatedStats)
  .filter(stats => stats.isVPNUser && stats.dropCount > 0)
  .map(stats => ({
    ip: stats.ip,
    userName: stats.userName,
    userDN: stats.userDN,
    eventCount: stats.totalEvents,
    dropCount: stats.dropCount,
    blockRate: `${stats.blockRate}%`,
    securityZone: stats.securityZone,
    inzone: stats.inzone,
    ruleNames: stats.ruleNames,
    blockedByRules: stats.ruleNames.join(', '),
    targetPorts: stats.targetPorts,
    targetIPs: stats.targetIPs
  }));

console.log('📊 VPN 策略問題報告預覽：\n');

const riskReport = {
  id: 'risk_006',
  title: '⚠️ VPN 用戶存取被阻擋（需檢視策略）',
  severity: 'medium',
  category: 'VPN_POLICY_ISSUE',
  layer: 'POLICY_REVIEW',
  isAttack: false,
  description: `檢測到 ${vpnPolicyIssues.length} 個已認證的 VPN 用戶流量被防火牆阻擋`,
  vpnUsers: vpnPolicyIssues,
  aiInsight: `⚠️ **VPN 用戶存取問題警示**

檢測到以下已認證的 VPN 用戶流量被防火牆阻擋：

${vpnPolicyIssues.map(u => `• ${u.userName} (${u.ip}) - 被 "${u.blockedByRules}" 阻擋 ${u.dropCount} 次，安全區域: ${u.securityZone}`).join('\n')}

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
      description: `受影響用戶：${vpnPolicyIssues.map(u => u.userName).join(', ')}`
    },
    { 
      priority: 'high', 
      title: '檢查防火牆規則順序', 
      description: `被阻擋的規則：${[...new Set(vpnPolicyIssues.flatMap(u => u.ruleNames))].join(', ')}`
    }
  ]
};

console.log(JSON.stringify(riskReport, null, 2));

console.log('\n');
console.log('================================================================================');
console.log('✅ 報告包含以下資訊：');
console.log('================================================================================');
console.log('  ✅ 用戶帳戶名稱 (userName)');
console.log('  ✅ 用戶 DN (userDN)');
console.log('  ✅ 安全區域 (securityZone / security_inzone)');
console.log('  ✅ 阻擋規則 (blockedByRules / rule_name)');
console.log('  ✅ 被阻擋次數 (dropCount)');
console.log('  ✅ 明確標示非攻擊 (isAttack: false)');
console.log('  ✅ 嚴重程度為中等 (severity: medium)');
console.log('  ✅ 策略檢視建議 (recommendations)');

