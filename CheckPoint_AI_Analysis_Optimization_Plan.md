# Check Point AI 分析系統優化計畫

> 版本：v2.0  
> 建立日期：2025-12-04  
> 狀態：待執行

---

## 一、專案背景

### 1.1 問題描述
目前 Check Point AI 分析結果資料較少，主要原因：
- 大部分日誌為 `action=Accept` 的正常流量
- 缺少 `threat_severity`、`app_risk`、`url_category` 等進階欄位
- 分析粒度為單筆日誌，缺乏聚合分析

### 1.2 優化目標
- 建立三大類事件分類系統（正常流量/掃描可疑/已知攻擊）
- 實作按來源 IP 聚合分析
- 輸出 TOP 5 攻擊者 IP 的詳細分析報告
- 提供更豐富、更有價值的安全分析結果

---

## 二、設計決策確認

| 項目 | 決策 |
|------|------|
| 時間窗口 | ✅ 維持現狀，用戶自選（1天/7天/30天等） |
| 風險閾值 | ✅ 不用閾值，依現有版面設計歸類到合適風險等級 |
| 正常流量 | ✅ 不分析，視為沒有攻擊 |
| 輸出內容 | ✅ TOP 5 攻擊者 IP，詳細分析格式 |
| 正常流量顯示 | ✅ 不顯示，只顯示攻擊相關 |

---

## 三、修改檔案清單

| 檔案路徑 | 修改類型 | 說明 |
|----------|----------|------|
| `backend/config/products/checkpoint/checkpointStandards.js` | 新增 | 攻擊規則、事件分類邏輯、風險評估因素 |
| `backend/services/products/CheckpointRiskServices.js` | 修改 | AI Prompt、分析流程、輸出格式 |

### 不修改的檔案
- `checkpointELKConfig.js` - ELK 配置維持現狀
- `chcekpointFieldMapping.js` - 欄位映射維持現狀
- `checkpoint.routes.js` - API 路由維持現狀

---

## 四、`checkpointStandards.js` 修改內容

### 4.1 新增：事件分類常數

```javascript
// ==================== 第七部分：事件分類系統（三大類）====================

/**
 * 事件分類系統
 * - KNOWN_ATTACK: 已知攻擊（IPS 觸發、威脅防護檢測）
 * - SCAN_SUSPICIOUS: 掃描/可疑流量（Cleanup rule、端口掃描、非標準埠）
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
      'action=Drop + rule_name=Cleanup rule',
      'security_inzone=L3_untrust + 外部 IP',
      '同一 IP 連線多個不同端口',
      '非標準埠連線'
    ],
    aiAnalysis: true
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
```

### 4.2 新增：端口掃描偵測規則

```javascript
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
```

### 4.3 新增：非標準服務埠判斷

```javascript
/**
 * 非標準服務埠判斷規則
 * 當服務類型與端口不匹配時視為可疑
 */
const SUSPICIOUS_SERVICE_PORTS = {
  'FTP': {
    standardPorts: [20, 21],
    passiveRange: { start: 1024, end: 65535 },
    description: 'FTP 標準埠為 20/21，被動模式使用動態高埠'
  },
  'FTP_Passive': {
    standardPorts: [],
    passiveRange: { start: 1024, end: 65535 },
    suspiciousFixed: true,  // 固定埠視為可疑
    description: 'FTP 被動模式通常使用動態埠，固定埠可疑'
  },
  'SSH': {
    standardPorts: [22],
    description: 'SSH 標準埠為 22'
  },
  'HTTP': {
    standardPorts: [80, 8080],
    description: 'HTTP 標準埠為 80/8080'
  },
  'HTTPS': {
    standardPorts: [443, 8443],
    description: 'HTTPS 標準埠為 443/8443'
  },
  'RDP': {
    standardPorts: [3389],
    description: 'RDP 標準埠為 3389'
  },
  'SMB': {
    standardPorts: [445, 139],
    description: 'SMB 標準埠為 445/139'
  }
};
```

### 4.4 新增：風險評估因素

```javascript
/**
 * 風險評估因素（用於 AI 分析參考）
 */
const RISK_ASSESSMENT_FACTORS = {
  // 策略阻擋
  POLICY_BLOCK: {
    id: 'POLICY_BLOCK',
    displayName: '策略阻擋',
    description: '被防火牆策略阻擋的次數',
    indicators: ['action=Drop', 'action=Reject'],
    weight: 'high'
  },
  
  // IPS 告警
  IPS_ALERT: {
    id: 'IPS_ALERT',
    displayName: 'IPS 告警',
    description: 'IPS 簽章觸發次數',
    indicators: ['sig_id 有值', 'threat_severity 有值'],
    weight: 'critical'
  },
  
  // 頻率異常
  FREQUENCY_ANOMALY: {
    id: 'FREQUENCY_ANOMALY',
    displayName: '頻率異常',
    description: '連線頻率異常高',
    indicators: ['同一 IP 短時間內多次連線', '超過頻率閾值'],
    weight: 'high'
  },
  
  // 端口掃描
  PORT_SCAN: {
    id: 'PORT_SCAN',
    displayName: '端口掃描',
    description: '端口掃描行為',
    indicators: ['連線多個不同端口', '連線高危端口'],
    weight: 'high'
  },
  
  // 來源區域
  SOURCE_ZONE: {
    id: 'SOURCE_ZONE',
    displayName: '來源區域',
    description: '來自不信任區域',
    indicators: ['security_inzone=L3_untrust', 'inzone=External'],
    weight: 'medium'
  },
  
  // 非標準埠
  NON_STANDARD_PORT: {
    id: 'NON_STANDARD_PORT',
    displayName: '非標準埠',
    description: '使用非標準服務埠',
    indicators: ['服務類型與端口不匹配', '使用固定高埠'],
    weight: 'medium'
  }
};
```

### 4.5 新增：Cleanup Rule 特殊處理

```javascript
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
```

### 4.6 新增：分類判斷函數

```javascript
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
  
  // 2. 檢查是否為掃描/可疑流量
  const action = (log.action || '').toLowerCase();
  const ruleName = log.rule_name || (log.rule_name_match_table && log.rule_name_match_table[0]) || '';
  const securityInzone = log.security_inzone || '';
  
  // 2.1 被 Drop 且命中 Cleanup rule
  if ((action === 'drop' || action === 'reject') && 
      ruleName.toLowerCase().includes('cleanup')) {
    return {
      classification: 'SCAN_SUSPICIOUS',
      ...EVENT_CLASSIFICATION.SCAN_SUSPICIOUS,
      reason: `被 ${ruleName} 規則阻擋，表示未匹配任何允許規則`
    };
  }
  
  // 2.2 來自不信任區域且被阻擋
  if ((action === 'drop' || action === 'reject') && 
      (securityInzone === 'L3_untrust' || log.inzone === 'External')) {
    return {
      classification: 'SCAN_SUSPICIOUS',
      ...EVENT_CLASSIFICATION.SCAN_SUSPICIOUS,
      reason: `來自不信任區域 (${securityInzone || log.inzone}) 的連線被阻擋`
    };
  }
  
  // 2.3 被阻擋的連線（一般性）
  if (action === 'drop' || action === 'reject') {
    return {
      classification: 'SCAN_SUSPICIOUS',
      ...EVENT_CLASSIFICATION.SCAN_SUSPICIOUS,
      reason: `連線被防火牆阻擋 (${log.action})`
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
      targetPorts.add(port);
      if (PORT_SCAN_DETECTION.highRiskPorts.includes(port)) {
        highRiskPortsHit.push(port);
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

/**
 * 分析服務埠是否異常
 * @param {number} port - 端口號
 * @param {string} serviceId - 服務識別
 * @returns {object} 分析結果
 */
function analyzeServicePort(port, serviceId) {
  if (!port || !serviceId) {
    return { isSuspicious: false };
  }
  
  const serviceConfig = SUSPICIOUS_SERVICE_PORTS[serviceId];
  if (!serviceConfig) {
    return { isSuspicious: false, reason: '未定義的服務類型' };
  }
  
  // 檢查是否為標準埠
  if (serviceConfig.standardPorts && serviceConfig.standardPorts.includes(port)) {
    return { isSuspicious: false, reason: '使用標準埠' };
  }
  
  // 檢查 FTP 被動模式的固定埠
  if (serviceId === 'FTP_Passive' && serviceConfig.suspiciousFixed) {
    return {
      isSuspicious: true,
      reason: `非標準 ${serviceId} 埠（正常應使用動態埠，這裡固定使用 ${port} 很可疑）`,
      description: serviceConfig.description
    };
  }
  
  // 檢查是否在合法範圍內
  if (serviceConfig.passiveRange) {
    const inRange = port >= serviceConfig.passiveRange.start && port <= serviceConfig.passiveRange.end;
    if (!inRange) {
      return {
        isSuspicious: true,
        reason: `端口 ${port} 不在 ${serviceId} 的合法範圍內`,
        description: serviceConfig.description
      };
    }
  }
  
  return { isSuspicious: false };
}
```

### 4.7 更新：模組匯出

```javascript
// ==================== 匯出 ====================

module.exports = {
  // 現有匯出（保留）
  CHECKPOINT_ACTION_MAPPING,
  THREAT_PREVENTION_MAPPING,
  OWASP_TOP10_PATTERNS,
  MALICIOUS_USER_AGENT_PATTERNS,
  URL_CATEGORY_MAPPING,
  CHECKPOINT_APP_RISK_MAPPING,
  analyzeThreatLevel,
  classifyAction,
  analyzeURIPattern,
  analyzeUserAgent,
  calculateThreatScore,
  classifyByThreatScore,
  isHighRiskThreat,
  analyzeLogEntry,
  isRealSecurityThreat,
  
  // 新增匯出
  EVENT_CLASSIFICATION,
  PORT_SCAN_DETECTION,
  SUSPICIOUS_SERVICE_PORTS,
  RISK_ASSESSMENT_FACTORS,
  SPECIAL_RULE_TYPES,
  classifyEvent,
  detectPortScan,
  analyzeServicePort
};
```

---

## 五、`CheckpointRiskServices.js` 修改內容

### 5.1 新增：引入新模組

```javascript
const {
  // 現有引入
  CHECKPOINT_APP_RISK_MAPPING,
  CHECKPOINT_ACTION_MAPPING,
  THREAT_PREVENTION_MAPPING,
  URL_CATEGORY_MAPPING,
  OWASP_TOP10_PATTERNS,
  MALICIOUS_USER_AGENT_PATTERNS,
  analyzeThreatLevel,
  classifyAction,
  analyzeURIPattern,
  analyzeUserAgent,
  calculateThreatScore,
  classifyByThreatScore,
  isHighRiskThreat,
  analyzeLogEntry,
  
  // 新增引入
  EVENT_CLASSIFICATION,
  PORT_SCAN_DETECTION,
  SUSPICIOUS_SERVICE_PORTS,
  RISK_ASSESSMENT_FACTORS,
  SPECIAL_RULE_TYPES,
  classifyEvent,
  detectPortScan,
  analyzeServicePort
} = require('../../config/products/checkpoint/checkpointStandards');
```

### 5.2 新增：按來源 IP 聚合方法

```javascript
/**
 * 按來源 IP 聚合日誌統計
 * @param {array} logEntries - 解析後的日誌陣列
 * @returns {object} 聚合統計結果
 */
aggregateBySourceIP(logEntries) {
  const stats = {};
  
  logEntries.forEach(log => {
    const srcIP = log.src_ip || log.src || 'Unknown';
    
    if (!stats[srcIP]) {
      stats[srcIP] = {
        ip: srcIP,
        totalEvents: 0,
        dropCount: 0,
        rejectCount: 0,
        acceptCount: 0,
        alertCount: 0,
        targetIPs: new Set(),
        targetPorts: new Set(),
        ruleNames: new Set(),
        geoInfo: {
          country: log.src_country || log.geoip?.country_name || 'Unknown',
          city: log.geoip?.city_name || 'Unknown',
          region: log.geoip?.region_name || 'Unknown'
        },
        securityZone: log.security_inzone || 'Unknown',
        inzone: log.inzone || 'Unknown',
        classifications: { KNOWN_ATTACK: 0, SCAN_SUSPICIOUS: 0, NORMAL_TRAFFIC: 0 },
        sigIds: new Set(),
        threatSeverities: new Set(),
        services: new Set(),
        timestamps: [],
        logs: []  // 保留原始日誌供後續分析
      };
    }
    
    const ipStats = stats[srcIP];
    ipStats.totalEvents++;
    ipStats.logs.push(log);
    
    // 統計 Action
    const action = (log.action || '').toLowerCase();
    if (action === 'drop') ipStats.dropCount++;
    else if (action === 'reject') ipStats.rejectCount++;
    else if (action === 'accept') ipStats.acceptCount++;
    else if (action === 'alert') ipStats.alertCount++;
    
    // 收集目標資訊
    if (log.dst_ip || log.dst) ipStats.targetIPs.add(log.dst_ip || log.dst);
    if (log.service || log.dst_port) ipStats.targetPorts.add(log.service || log.dst_port);
    
    // 收集規則名稱
    const ruleName = log.rule_name || (log.rule_name_match_table && log.rule_name_match_table[0]);
    if (ruleName) ipStats.ruleNames.add(ruleName);
    
    // 收集 IPS 資訊
    if (log.sig_id) ipStats.sigIds.add(log.sig_id);
    if (log.threat_severity) ipStats.threatSeverities.add(log.threat_severity);
    
    // 收集服務資訊
    if (log.service_id) ipStats.services.add(log.service_id);
    
    // 收集時間戳
    if (log.timestamp) ipStats.timestamps.push(new Date(log.timestamp).getTime());
    
    // 分類統計
    const classification = classifyEvent(log);
    ipStats.classifications[classification.classification]++;
  });
  
  // 轉換 Set 為陣列，並計算衍生指標
  Object.values(stats).forEach(ipStats => {
    ipStats.targetIPs = Array.from(ipStats.targetIPs);
    ipStats.targetPorts = Array.from(ipStats.targetPorts);
    ipStats.ruleNames = Array.from(ipStats.ruleNames);
    ipStats.sigIds = Array.from(ipStats.sigIds);
    ipStats.threatSeverities = Array.from(ipStats.threatSeverities);
    ipStats.services = Array.from(ipStats.services);
    
    // 計算端口掃描偵測
    ipStats.portScanAnalysis = detectPortScan(ipStats.logs);
    
    // 判斷主要分類
    if (ipStats.classifications.KNOWN_ATTACK > 0) {
      ipStats.primaryClassification = 'KNOWN_ATTACK';
    } else if (ipStats.classifications.SCAN_SUSPICIOUS > 0) {
      ipStats.primaryClassification = 'SCAN_SUSPICIOUS';
    } else {
      ipStats.primaryClassification = 'NORMAL_TRAFFIC';
    }
    
    // 計算被阻擋比例
    ipStats.blockRate = ipStats.totalEvents > 0 
      ? ((ipStats.dropCount + ipStats.rejectCount) / ipStats.totalEvents * 100).toFixed(1)
      : 0;
    
    // 移除原始日誌以節省記憶體（保留在需要時）
    delete ipStats.logs;
  });
  
  return stats;
}
```

### 5.3 新增：取得 TOP 5 攻擊者 IP

```javascript
/**
 * 取得 TOP 5 攻擊者 IP
 * @param {object} aggregatedStats - 聚合統計結果
 * @param {number} limit - 返回數量限制
 * @returns {array} TOP 攻擊者清單
 */
getTopAttackerIPs(aggregatedStats, limit = 5) {
  // 過濾出非正常流量的 IP
  const attackerIPs = Object.values(aggregatedStats)
    .filter(stats => stats.primaryClassification !== 'NORMAL_TRAFFIC')
    .map(stats => {
      // 計算風險分數（用於排序）
      let riskScore = 0;
      
      // 因素 1：被阻擋次數
      riskScore += (stats.dropCount + stats.rejectCount) * 2;
      
      // 因素 2：IPS 告警
      riskScore += stats.sigIds.length * 10;
      riskScore += stats.threatSeverities.includes('High') ? 20 : 0;
      riskScore += stats.threatSeverities.includes('Medium') ? 10 : 0;
      
      // 因素 3：端口掃描
      if (stats.portScanAnalysis.isPortScan) {
        riskScore += 15;
        riskScore += stats.portScanAnalysis.highRiskPortsHit.length * 5;
      }
      
      // 因素 4：來源區域
      if (stats.securityZone === 'L3_untrust' || stats.inzone === 'External') {
        riskScore += 10;
      }
      
      // 因素 5：已知攻擊分類
      if (stats.primaryClassification === 'KNOWN_ATTACK') {
        riskScore += 25;
      }
      
      return {
        ...stats,
        riskScore
      };
    })
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, limit);
  
  return attackerIPs;
}
```

### 5.4 新增：過濾正常流量

```javascript
/**
 * 過濾正常流量，只保留需要分析的事件
 * @param {array} logEntries - 解析後的日誌陣列
 * @returns {object} 過濾結果
 */
filterNormalTraffic(logEntries) {
  const suspicious = [];
  const normal = [];
  
  logEntries.forEach(log => {
    const classification = classifyEvent(log);
    if (classification.classification === 'NORMAL_TRAFFIC') {
      normal.push(log);
    } else {
      suspicious.push({ ...log, classification });
    }
  });
  
  return {
    suspicious,
    normal,
    suspiciousCount: suspicious.length,
    normalCount: normal.length,
    totalCount: logEntries.length
  };
}
```

### 5.5 修改：`generateAIPrompt` 方法

```javascript
/**
 * 產生 AI 分析提示詞（新版 - 聚合分析）
 * @param {object} analysisData - 分析資料
 * @param {array} topAttackers - TOP 5 攻擊者清單
 */
generateAIPrompt(analysisData, topAttackers) {
  const { timeRange, totalEvents, filteredStats } = analysisData;
  
  // 格式化 TOP 5 攻擊者資料
  const topAttackersDetail = topAttackers.map((attacker, index) => {
    return `
### 可疑來源 ${index + 1}：${attacker.ip}

**基本資訊：**
- 來源 IP：${attacker.ip}
- 地理位置：${attacker.geoInfo.country}${attacker.geoInfo.city !== 'Unknown' ? ` - ${attacker.geoInfo.city}` : ''}${attacker.geoInfo.region !== 'Unknown' ? `（${attacker.geoInfo.region}）` : ''}
- 安全區域：security_inzone=${attacker.securityZone}，inzone=${attacker.inzone}
- 分類：${EVENT_CLASSIFICATION[attacker.primaryClassification]?.displayName || attacker.primaryClassification}

**事件統計：**
- 總事件數：${attacker.totalEvents}
- Drop：${attacker.dropCount}
- Reject：${attacker.rejectCount}
- Accept：${attacker.acceptCount}
- 阻擋率：${attacker.blockRate}%

**目標資訊：**
- 目標 IP：${attacker.targetIPs.slice(0, 5).join(', ')}${attacker.targetIPs.length > 5 ? ` 等 ${attacker.targetIPs.length} 個` : ''}
- 目標端口：${attacker.targetPorts.slice(0, 10).join(', ')}${attacker.targetPorts.length > 10 ? ` 等 ${attacker.targetPorts.length} 個` : ''}
- 服務類型：${attacker.services.join(', ') || 'N/A'}

**規則命中：**
- 命中規則：${attacker.ruleNames.join(', ') || 'N/A'}

**威脅指標：**
- IPS 簽章：${attacker.sigIds.length > 0 ? attacker.sigIds.join(', ') : '無'}
- 威脅嚴重度：${attacker.threatSeverities.length > 0 ? attacker.threatSeverities.join(', ') : '無'}
- 端口掃描：${attacker.portScanAnalysis.isPortScan ? `是（掃描 ${attacker.portScanAnalysis.uniquePortCount} 個端口）` : '否'}
${attacker.portScanAnalysis.highRiskPortsHit.length > 0 ? `- 命中高危端口：${attacker.portScanAnalysis.highRiskPortsHit.join(', ')}` : ''}
`;
  }).join('\n');
  
  const promptTemplate = `
你是一位資深的 Check Point 防火牆資安專家，專精於分析防火牆日誌並識別安全威脅。

⚠️ **重要要求**：
1. **語言要求**：請務必使用「繁體中文」回應所有內容。
2. **產品識別**：這是 **Check Point 防火牆** 的安全分析。
3. **分析深度**：請提供詳細的攻擊分析，包含連線情況、防火牆決策、攻擊評估。

---

## 【分析時間範圍】

- 開始時間（台灣時間）：${this.formatTimeTaipei(timeRange.start)}
- 結束時間（台灣時間）：${this.formatTimeTaipei(timeRange.end)}
- 分析時間：${this.formatTimeTaipei(new Date().toISOString())}

---

## 【事件統計摘要】

- 總日誌數：${totalEvents.toLocaleString()} 筆
- 需分析事件：${filteredStats.suspiciousCount.toLocaleString()} 筆
- 正常流量：${filteredStats.normalCount.toLocaleString()} 筆（已過濾，不分析）
- TOP 可疑來源：${topAttackers.length} 個

---

## 【TOP ${topAttackers.length} 可疑來源 IP 詳細資料】

${topAttackersDetail}

---

## 【分析任務】

請依據以下欄位分析每個可疑來源 IP：
- action (Drop/Accept/Reject)
- rule_name（特別注意 Cleanup rule）
- service / service_id
- security_inzone / inzone / outzone
- ifdir（流量方向）
- sig_id（IPS 簽章，若有）
- 來源 IP 和目的 IP
- 端口掃描行為

---

## 【輸出格式要求】

對每個可疑 IP，請按以下格式輸出分析（JSON 格式）：

\`\`\`json
{
  "risks": [
    {
      "id": "risk_001",
      "sourceIP": "來源 IP",
      "severity": "critical/high/medium/low",
      "category": "KNOWN_ATTACK/SCAN_SUSPICIOUS",
      
      "connectionInfo": {
        "source": {
          "ip": "來源 IP",
          "geoip": "地理位置描述（國家、城市、區域）",
          "securityZone": "安全區域",
          "assessment": "來源可信度評估（如：明確是外部不可信來源）"
        },
        "destination": {
          "ip": "目標 IP",
          "zone": "目標區域",
          "assessment": "目標描述（如：內網伺服器或裝置）"
        },
        "service": {
          "port": 端口號,
          "serviceId": "服務識別",
          "assessment": "服務異常分析（如：非標準 FTP 被動模式埠，固定 18888 很可疑）"
        },
        "direction": {
          "ifdir": "流量方向",
          "flow": "區域流向（如：External → Local）",
          "assessment": "方向風險評估（如：外部往內網的連線企圖）"
        }
      },
      
      "firewallDecision": {
        "action": "防火牆動作",
        "ruleName": "命中規則名稱",
        "explanation": "動作說明",
        "implications": [
          "含義 1（如：沒有任何規則允許外部 IP 連到此目標）",
          "含義 2（如：這是預期且正確的阻擋行為）",
          "含義 3（如：防火牆防護功能正常運作）"
        ]
      },
      
      "attackAssessment": {
        "riskLevel": "高度可疑/中度可疑/低度可疑",
        "possibleAttacks": [
          {
            "type": "攻擊類型（如：Port Scanning）",
            "description": "攻擊描述"
          }
        ],
        "conclusion": "結論"
      },
      
      "statistics": {
        "totalEvents": 事件總數,
        "dropCount": Drop 次數,
        "targetPorts": [目標端口清單],
        "blockRate": "阻擋率"
      },
      
      "recommendations": [
        {
          "priority": "critical/high/medium/low",
          "action": "建議操作",
          "reason": "原因說明"
        }
      ]
    }
  ],
  
  "summary": {
    "totalAnalyzed": 分析的 IP 數,
    "criticalCount": 嚴重風險數,
    "highCount": 高風險數,
    "mediumCount": 中風險數,
    "lowCount": 低風險數,
    "overallAssessment": "整體評估說明"
  }
}
\`\`\`

---

## 【分析重點】

1. **連線基本情況**：詳細描述來源、目的、服務、方向
2. **防火牆決策與阻擋原因**：解釋規則意義，特別是 Cleanup rule
3. **攻擊可能性評估**：列出 2-4 種可能的攻擊類型
4. **安全建議**：提供具體、可操作的建議

請開始分析。
  `.trim();
  
  return promptTemplate;
}
```

### 5.6 修改：`analyzeCheckPoint` 方法流程

```javascript
/**
 * ⭐ 主要方法：分析 Check Point 防火牆風險（新版）
 */
async analyzeCheckPoint(timeRange = '24h') {
  console.log(`\n🔍 ===== 開始 Check Point 防火牆風險分析（新版）=====`);
  console.log(`📅 時間範圍: ${timeRange}`);
  
  try {
    // Step 1: 透過 ELK MCP 查詢 Check Point 日誌
    console.log('\n⭐ Step 1: 查詢 Check Point 日誌...');
    const elkData = await this.elkClient.queryElasticsearch(
      timeRange,
      { indexPattern: this.elkConfig.index }
    );
    
    if (!elkData.hits || elkData.hits.length === 0) {
      console.log('⚠️ 未找到日誌資料');
      return this.getEmptyAnalysisResult();
    }
    
    // Step 2: 解析日誌
    console.log(`\n⭐ Step 2: 解析 ${elkData.hits.length} 筆日誌...`);
    const logEntries = elkData.hits.map(hit => this.parseCheckPointLog(hit.source));
    
    // 計算時間範圍
    const actualTimeRange = this.calculateActualTimeRange(logEntries);
    
    // Step 3: 過濾正常流量
    console.log('\n⭐ Step 3: 過濾正常流量...');
    const filteredStats = this.filterNormalTraffic(logEntries);
    console.log(`   總事件: ${filteredStats.totalCount}`);
    console.log(`   需分析: ${filteredStats.suspiciousCount}`);
    console.log(`   正常流量: ${filteredStats.normalCount}（已過濾）`);
    
    // Step 4: 按來源 IP 聚合
    console.log('\n⭐ Step 4: 按來源 IP 聚合統計...');
    const aggregatedStats = this.aggregateBySourceIP(filteredStats.suspicious);
    const uniqueSourceIPs = Object.keys(aggregatedStats).length;
    console.log(`   唯一來源 IP: ${uniqueSourceIPs} 個`);
    
    // Step 5: 取得 TOP 5 攻擊者
    console.log('\n⭐ Step 5: 識別 TOP 5 攻擊者 IP...');
    const topAttackers = this.getTopAttackerIPs(aggregatedStats, 5);
    console.log(`   TOP 攻擊者: ${topAttackers.length} 個`);
    topAttackers.forEach((attacker, i) => {
      console.log(`   ${i + 1}. ${attacker.ip} (${attacker.geoInfo.country}) - ${attacker.primaryClassification} - 風險分數: ${attacker.riskScore}`);
    });
    
    // 準備分析資料
    const analysisData = {
      timeRange: actualTimeRange,
      totalEvents: logEntries.length,
      filteredStats,
      aggregatedStats,
      topAttackers
    };
    
    console.log('\n✅ 資料準備完成，準備進行 AI 分析...');
    
    return analysisData;
    
  } catch (error) {
    console.error('❌ Check Point 分析過程發生錯誤:', error);
    throw error;
  }
}
```

### 5.7 修改：`generateFallbackRisks` 方法

```javascript
/**
 * 產生備用風險報告（當 AI 無法使用時）- 新版
 */
generateFallbackRisks(analysisData) {
  const { topAttackers, timeRange } = analysisData;
  
  const risks = topAttackers.map((attacker, index) => {
    // 判斷嚴重程度
    let severity = 'medium';
    if (attacker.primaryClassification === 'KNOWN_ATTACK' || attacker.sigIds.length > 0) {
      severity = 'critical';
    } else if (attacker.portScanAnalysis.isPortScan || attacker.dropCount > 50) {
      severity = 'high';
    }
    
    // 判斷風險等級描述
    let riskLevel = '中度可疑';
    if (severity === 'critical') riskLevel = '高度可疑';
    else if (severity === 'high') riskLevel = '高度可疑';
    
    // 判斷可能的攻擊類型
    const possibleAttacks = [];
    if (attacker.portScanAnalysis.isPortScan) {
      possibleAttacks.push({
        type: 'Port Scanning',
        description: `攻擊者掃描目標伺服器，測試 ${attacker.portScanAnalysis.uniquePortCount} 個端口是否開放`
      });
    }
    if (attacker.sigIds.length > 0) {
      possibleAttacks.push({
        type: 'IPS 檢測到的攻擊',
        description: `觸發 IPS 簽章 ${attacker.sigIds.join(', ')}`
      });
    }
    if (attacker.ruleNames.some(r => r.toLowerCase().includes('cleanup'))) {
      possibleAttacks.push({
        type: '未授權存取嘗試',
        description: '連線被 Cleanup rule 阻擋，表示未匹配任何允許規則'
      });
    }
    if (possibleAttacks.length === 0) {
      possibleAttacks.push({
        type: '可疑連線',
        description: '來自外部的可疑連線嘗試'
      });
    }
    
    return {
      id: `risk_${String(index + 1).padStart(3, '0')}`,
      sourceIP: attacker.ip,
      severity,
      category: attacker.primaryClassification,
      
      connectionInfo: {
        source: {
          ip: attacker.ip,
          geoip: `${attacker.geoInfo.country}${attacker.geoInfo.city !== 'Unknown' ? ` - ${attacker.geoInfo.city}` : ''}`,
          securityZone: attacker.securityZone,
          assessment: attacker.securityZone === 'L3_untrust' || attacker.inzone === 'External' 
            ? '外部不可信來源' 
            : '來源區域需確認'
        },
        destination: {
          ip: attacker.targetIPs.slice(0, 3).join(', '),
          zone: 'Internal/Local',
          assessment: '內網伺服器或裝置'
        },
        service: {
          port: attacker.targetPorts.slice(0, 5).join(', '),
          serviceId: attacker.services.join(', ') || 'N/A',
          assessment: attacker.portScanAnalysis.isPortScan ? '多端口掃描行為' : '單一或少數端口連線'
        },
        direction: {
          ifdir: 'inbound',
          flow: `${attacker.inzone} → Internal`,
          assessment: attacker.inzone === 'External' ? '外部往內網的連線企圖' : '連線方向需確認'
        }
      },
      
      firewallDecision: {
        action: attacker.dropCount > 0 ? 'Drop' : (attacker.rejectCount > 0 ? 'Reject' : 'Mixed'),
        ruleName: attacker.ruleNames.join(', ') || 'N/A',
        explanation: `防火牆阻擋了 ${attacker.dropCount + attacker.rejectCount} 筆連線`,
        implications: [
          attacker.ruleNames.some(r => r.toLowerCase().includes('cleanup')) 
            ? '連線被 Cleanup rule 阻擋，表示未匹配任何允許規則'
            : '連線被安全規則阻擋',
          '防火牆防護功能正常運作'
        ]
      },
      
      attackAssessment: {
        riskLevel,
        possibleAttacks,
        conclusion: `此來源 IP 的連線已被成功阻擋（阻擋率 ${attacker.blockRate}%），建議持續監控`
      },
      
      statistics: {
        totalEvents: attacker.totalEvents,
        dropCount: attacker.dropCount,
        targetPorts: attacker.targetPorts.slice(0, 10),
        blockRate: `${attacker.blockRate}%`
      },
      
      recommendations: [
        {
          priority: severity === 'critical' ? 'critical' : 'high',
          action: `監控來源 IP ${attacker.ip} 的後續活動`,
          reason: '確認是否有持續攻擊行為'
        },
        ...(attacker.portScanAnalysis.highRiskPortsHit.length > 0 ? [{
          priority: 'high',
          action: `檢查高危端口 ${attacker.portScanAnalysis.highRiskPortsHit.join(', ')} 的服務狀態`,
          reason: '確認服務是否安全配置'
        }] : [])
      ]
    };
  });
  
  const summary = {
    totalAnalyzed: topAttackers.length,
    criticalCount: risks.filter(r => r.severity === 'critical').length,
    highCount: risks.filter(r => r.severity === 'high').length,
    mediumCount: risks.filter(r => r.severity === 'medium').length,
    lowCount: risks.filter(r => r.severity === 'low').length,
    overallAssessment: risks.length > 0 
      ? `分析了 ${topAttackers.length} 個可疑來源 IP，其中 ${risks.filter(r => r.severity === 'critical' || r.severity === 'high').length} 個為高風險`
      : '未發現明顯威脅'
  };
  
  return { risks, summary };
}
```

---

## 六、測試驗證

### 6.1 測試案例

1. **正常流量過濾測試**
   - 輸入：包含 Accept 和 Drop 的混合日誌
   - 預期：正常流量被過濾，不納入分析

2. **TOP 5 排序測試**
   - 輸入：多個來源 IP 的日誌
   - 預期：按風險分數正確排序

3. **端口掃描偵測測試**
   - 輸入：同一 IP 連線多個不同端口
   - 預期：正確識別為端口掃描

4. **AI Prompt 格式測試**
   - 輸入：聚合後的統計資料
   - 預期：產生格式正確的 Prompt

### 6.2 驗證指令

```bash
# 執行測試腳本
cd backend
node _dev/test-checkpoint-analysis.js
```

---

## 七、回滾方案

如需回滾，保留原始檔案備份：
- `checkpointStandards.js.backup-YYYYMMDD`
- `CheckpointRiskServices.js.backup-YYYYMMDD`

---

## 八、後續優化建議

1. **增加更多攻擊模式識別**
   - 暴力破解偵測
   - DDoS 偵測
   - 特定漏洞利用偵測

2. **增加威脅情報整合**
   - 已知惡意 IP 清單
   - 威脅情報 API 整合

3. **增加視覺化報告**
   - 攻擊來源地圖
   - 時間軸分析圖

---

**文件結束**

