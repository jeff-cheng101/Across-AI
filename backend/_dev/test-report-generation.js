// test-report-generation.js
// 模擬 AI 分析流程並生成報告

const WordReportService = require('../services/reports/wordReportService');
const fs = require('fs');
const path = require('path');

// 模擬的 ELK 日誌資料（來自用戶提供的兩筆資料）
const elkLogs = [
  {
    "_id": "3LL64ZoBUk01Id2xXB-g",
    "ClientIP": "220.228.194.155",
    "ClientCountry": "tw",
    "ClientCity": "Taichung",
    "ClientRequestPath": "/cdn-cgi/rum",
    "ClientRequestURI": "/cdn-cgi/rum?",
    "ClientRequestHost": "sstportal.phison.com",
    "ClientRequestMethod": "POST",
    "WAFAttackScore": 89,
    "WAFRCEAttackScore": 92,
    "WAFSQLiAttackScore": 97,
    "WAFXSSAttackScore": 97,
    "SecurityAction": "",
    "ThreatLevel": "Info",
    "EdgeResponseStatus": 204,
    "ClientRequestUserAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "@timestamp": "2025-12-03T02:08:50.000Z"
  },
  {
    "_id": "CKb34ZoBUk01Id2xWXa-",
    "ClientIP": "2408:8719:40f:10:30::",
    "ClientCountry": "cn",
    "ClientCity": "Jinan",
    "ClientRequestPath": "/media/vendor/awesomplete/css/awesomplete.css",
    "ClientRequestURI": "/media/vendor/awesomplete/css/awesomplete.css?1.1.5",
    "ClientRequestHost": "www.phison.com",
    "ClientRequestMethod": "GET",
    "WAFAttackScore": 83,
    "WAFRCEAttackScore": 87,
    "WAFSQLiAttackScore": 97,
    "WAFXSSAttackScore": 96,
    "SecurityAction": "log",
    "SecurityRuleID": "afce0103f8b747a896dc36d0a0774c86",
    "SecurityRuleDescription": "log",
    "ThreatLevel": "Info",
    "EdgeResponseStatus": 200,
    "ClientRequestUserAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36",
    "@timestamp": "2025-12-03T02:05:37.000Z"
  }
];

// ===== 第一階段 AI：模擬 WAF 風險分析結果 =====
console.log('\n🔍 ===== 第一階段 AI：WAF 風險分析 =====\n');

// 分析日誌並生成風險評估
function analyzeWAFLogs(logs) {
  const risks = [];
  const ipStats = new Map();
  const pathStats = new Map();
  
  logs.forEach(log => {
    // 統計 IP
    const ip = log.ClientIP;
    if (!ipStats.has(ip)) {
      ipStats.set(ip, { count: 0, paths: new Set(), countries: new Set() });
    }
    ipStats.get(ip).count++;
    ipStats.get(ip).paths.add(log.ClientRequestPath);
    ipStats.get(ip).countries.add(log.ClientCountry);
    
    // 統計路徑
    const pathKey = log.ClientRequestPath;
    if (!pathStats.has(pathKey)) {
      pathStats.set(pathKey, { count: 0, ips: new Set(), avgScore: 0, scores: [] });
    }
    pathStats.get(pathKey).count++;
    pathStats.get(pathKey).ips.add(ip);
    pathStats.get(pathKey).scores.push(log.WAFAttackScore);
  });
  
  // 計算平均分數
  pathStats.forEach((stats, path) => {
    stats.avgScore = stats.scores.reduce((a, b) => a + b, 0) / stats.scores.length;
  });
  
  // 根據日誌生成風險項目
  
  // 風險 1: WAF 攻擊分數異常
  const highScoreLogs = logs.filter(l => l.WAFAttackScore < 90);
  if (highScoreLogs.length > 0) {
    risks.push({
      id: 'risk-waf-score-1',
      title: 'WAF 攻擊評分異常檢測',
      severity: 'medium',
      description: `偵測到 ${highScoreLogs.length} 筆請求的 WAF 攻擊評分低於安全閾值（< 90）。WAF Attack Score 為 Cloudflare 的機器學習模型評估結果，分數越低表示越可能為惡意請求。最低分數為 ${Math.min(...highScoreLogs.map(l => l.WAFAttackScore))}，來源 IP 包含：${[...new Set(highScoreLogs.map(l => l.ClientIP))].join(', ')}`,
      openIssues: highScoreLogs.length,
      resolvedIssues: 0,
      affectedAssets: new Set(highScoreLogs.map(l => l.ClientRequestHost)).size,
      tags: ['WAF Score', 'Anomaly Detection', 'Machine Learning'],
      cveId: null,
      aiInsight: `AI 分析發現這些請求的 WAF 攻擊評分（${highScoreLogs.map(l => l.WAFAttackScore).join(', ')}）顯示潛在威脅。雖然 Cloudflare 未採取阻擋行動，但建議持續監控這些來源 IP 的行為模式。特別注意來自中國 IP (2408:8719:40f:10:30::) 的請求已觸發自定義防火牆規則。`,
      recommendations: [
        {
          title: '檢視 WAF 規則敏感度設定',
          description: '建議調整 WAF 攻擊評分閾值，考慮對低於 85 分的請求採取挑戰或阻擋動作',
          priority: 'high'
        },
        {
          title: '建立自定義 WAF 規則',
          description: '針對偵測到的異常 IP 和路徑模式建立額外的防護規則',
          priority: 'medium'
        }
      ],
      createdDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0],
      exploitInWild: false,
      internetExposed: true
    });
  }
  
  // 風險 2: 來自中國的可疑請求
  const cnLogs = logs.filter(l => l.ClientCountry === 'cn');
  if (cnLogs.length > 0) {
    risks.push({
      id: 'risk-geo-cn-1',
      title: '來自高風險地區的請求',
      severity: 'low',
      description: `偵測到 ${cnLogs.length} 筆來自中國的請求，存取路徑包含：${[...new Set(cnLogs.map(l => l.ClientRequestPath))].join(', ')}。其中已有 ${cnLogs.filter(l => l.SecurityAction === 'log').length} 筆觸發了自定義防火牆規則 (ID: ${cnLogs[0]?.SecurityRuleID || 'N/A'})。`,
      openIssues: cnLogs.length,
      resolvedIssues: cnLogs.filter(l => l.SecurityAction).length,
      affectedAssets: new Set(cnLogs.map(l => l.ClientRequestHost)).size,
      tags: ['Geo-blocking', 'China', 'Custom Rule'],
      cveId: null,
      aiInsight: `這些請求來自中國濟南 (Jinan)，使用 IPv6 地址。雖然目前僅採取 "log" 動作記錄，但建議評估是否需要更嚴格的地理位置封鎖策略，特別是對於敏感資源的存取。`,
      recommendations: [
        {
          title: '評估地理位置封鎖策略',
          description: '根據業務需求評估是否需要對特定地區實施存取限制',
          priority: 'low'
        },
        {
          title: '強化自定義防火牆規則',
          description: '將現有的 log 規則升級為 challenge 或 block 動作',
          priority: 'medium'
        }
      ],
      createdDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0],
      exploitInWild: false,
      internetExposed: true
    });
  }
  
  // 風險 3: RCE 攻擊評分警告
  const rceLogs = logs.filter(l => l.WAFRCEAttackScore < 95);
  if (rceLogs.length > 0) {
    risks.push({
      id: 'risk-rce-1',
      title: 'RCE 遠端代碼執行攻擊偵測',
      severity: 'high',
      description: `偵測到 ${rceLogs.length} 筆請求的 RCE 攻擊評分偏低（最低 ${Math.min(...rceLogs.map(l => l.WAFRCEAttackScore))}）。RCE（Remote Code Execution）攻擊可能導致伺服器被完全控制。涉及的端點：${[...new Set(rceLogs.map(l => l.ClientRequestHost))].join(', ')}`,
      openIssues: rceLogs.length,
      resolvedIssues: 0,
      affectedAssets: new Set(rceLogs.map(l => l.ClientRequestHost)).size,
      tags: ['RCE', 'Remote Code Execution', 'Critical'],
      cveId: null,
      aiInsight: `RCE 攻擊評分低於 95 表示 Cloudflare 的 ML 模型偵測到潛在的遠端代碼執行嘗試。來源 IP 220.228.194.155 (台灣) 的 RCE 評分為 92，2408:8719:40f:10:30:: (中國) 的評分為 87。建議立即檢視這些請求的詳細內容並強化防護。`,
      recommendations: [
        {
          title: '啟用 Cloudflare WAF Managed Rules',
          description: '確保已啟用 OWASP Core Ruleset 和 Cloudflare Managed Ruleset 中的 RCE 防護規則',
          priority: 'high'
        },
        {
          title: '檢查應用程式漏洞',
          description: '審查受影響端點的程式碼，確認是否存在命令注入或其他 RCE 漏洞',
          priority: 'high'
        },
        {
          title: '實施 Rate Limiting',
          description: '對敏感端點實施請求頻率限制，減緩自動化攻擊',
          priority: 'medium'
        }
      ],
      createdDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0],
      exploitInWild: true,
      internetExposed: true
    });
  }
  
  return risks;
}

const analysisResult = {
  risks: analyzeWAFLogs(elkLogs),
  metadata: {
    totalEvents: elkLogs.length,
    timeRange: {
      start: '2025-12-03T02:05:37.000Z',
      end: '2025-12-03T02:08:50.000Z',
      display: {
        start: '2025-12-03T02:05:37.000Z',
        end: '2025-12-03T02:08:50.000Z'
      }
    },
    platform: 'cloudflare',
    analysisTimestamp: new Date().toISOString()
  }
};

console.log('📊 分析結果摘要:');
console.log(`   - 總事件數: ${analysisResult.metadata.totalEvents}`);
console.log(`   - 偵測到風險數: ${analysisResult.risks.length}`);
analysisResult.risks.forEach(risk => {
  console.log(`   - [${risk.severity.toUpperCase()}] ${risk.title}`);
});

// ===== 第二階段：生成報告 =====
console.log('\n📝 ===== 第二階段：生成報告 =====\n');

// 模擬用戶提供的資料
const userProvidedData = {
  organizationName: '群聯電子股份有限公司',
  reviewOrganization: '資訊安全部',
  reporterName: '資安管理員',
  phone: '03-5526888',
  fax: '',
  email: 'security@phison.com',
  investigationVendor: 'Across Security',
  mainSystemVendor: 'Cloudflare',
  systemBuilder: 'IT Department',
  socVendor: 'Across SOC',
  securityPersonName: '資安工程師',
  securityPersonTitle: '資深資安工程師'
};

// 建構簡化報告資料（模擬 buildSimpleReportData 函數）
function buildReportData(analysisData, metadata, userProvidedData) {
  const risks = analysisData.risks || [];
  const timeRange = metadata?.timeRange || {};

  // 計算統計
  const criticalCount = risks.filter(r => r.severity === 'critical').length;
  const highCount = risks.filter(r => r.severity === 'high').length;
  const mediumCount = risks.filter(r => r.severity === 'medium').length;
  const lowCount = risks.filter(r => r.severity === 'low').length;
  const totalAffectedAssets = risks.reduce((sum, r) => sum + (r.affectedAssets || 0), 0);
  const totalOpenIssues = risks.reduce((sum, r) => sum + (r.openIssues || 0), 0);

  // 提取 IP 列表
  const uniqueIPs = ['220.228.194.155', '2408:8719:40f:10:30::'];

  // 判定事件分類
  const hasRCE = risks.some(r => /rce|remote code/i.test(r.title + r.description));
  
  // 判定影響等級
  const maxLevel = criticalCount > 0 ? 4 : highCount > 0 ? 3 : mediumCount > 0 ? 2 : 1;
  const levelDescriptions = {
    4: '4級（嚴重）',
    3: '3級（高）',
    2: '2級（中）',
    1: '1級（低）',
    0: '無需通報'
  };

  // 彙整所有建議
  const allRecommendations = [];
  risks.forEach(risk => {
    if (risk.recommendations) {
      risk.recommendations.forEach(rec => {
        allRecommendations.push(rec.title || rec);
      });
    }
  });

  return {
    reportMetadata: {
      generatedAt: new Date().toISOString(),
      platform: metadata?.platform || 'cloudflare',
      reportType: '網頁攻擊',
      overallRiskLevel: maxLevel,
      summary: `偵測到 ${risks.length} 項風險，其中 ${criticalCount + highCount} 項為高/嚴重等級`
    },
    step1_basicInfo: {
      reportTime: new Date().toLocaleString('zh-TW', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
      }),
      organizationName: userProvidedData.organizationName || '',
      reviewOrganization: userProvidedData.reviewOrganization || '',
      reporterName: userProvidedData.reporterName || '',
      phone: userProvidedData.phone || '',
      fax: userProvidedData.fax || '',
      email: userProvidedData.email || '',
      isProxy: false,
      proxyOrganization: '',
      investigationVendor: userProvidedData.investigationVendor || ''
    },
    step2_eventProcess: {
      eventDiscoveryTime: new Date(timeRange.start).toLocaleString('zh-TW'),
      eventClassification: {
        category: 'webAttack',
        webAttack: {
          webTampering: false,
          maliciousComment: false,
          maliciousPage: false,
          phishingPage: false,
          webTrojan: false,
          dataLeak: false,
          webModified: hasRCE
        },
        intrusion: {
          systemIntrusion: hasRCE,
          malwareImplant: false,
          abnormalConnection: true,
          spamSending: false,
          dataLeak: false,
          abnormalAccountLogin: false,
          externalAttackScan: true,
          unauthorizedAccess: false
        },
        dos: {
          serviceInterruption: false,
          performanceDegradation: false
        }
      },
      eventDescription: risks.map(r => `【${r.title}】\n${r.description}`).join('\n\n'),
      isExercise: false,
      affectsOtherAgencies: false,
      affectedInfrastructure: [],
      reportSource: '自行發現（Cloudflare WAF 監控）'
    },
    step3_impactAssessment: {
      confidentiality: {
        level: hasRCE ? 2 : 1,
        levelDescription: hasRCE ? '2級（中）' : '1級（低）',
        justification: hasRCE ? '偵測到 RCE 攻擊嘗試，可能導致機密資料外洩' : '未偵測到資料外洩跡象'
      },
      integrity: {
        level: hasRCE ? 3 : 1,
        levelDescription: hasRCE ? '3級（高）' : '1級（低）',
        justification: hasRCE ? '偵測到遠端代碼執行嘗試，可能影響系統完整性' : '未偵測到完整性攻擊'
      },
      availability: {
        level: 1,
        levelDescription: '1級（低）',
        justification: '服務運作正常，未偵測到 DoS/DDoS 攻擊'
      },
      overallLevel: maxLevel,
      overallLevelDescription: `整體風險等級：${levelDescriptions[maxLevel]}`
    },
    step4_supportNeeded: {
      needSupport: maxLevel >= 3,
      supportContent: maxLevel >= 3 ? '建議請專業資安團隊協助深入調查 RCE 攻擊嘗試' : ''
    },
    step5_emergencyResponse: {
      recordsRetention: {
        hostEventLog: { retained: true, duration: '1-6個月' },
        firewallLog: { retained: true, duration: '1-6個月' },
        websiteLog: { retained: true, duration: '1-6個月' },
        maliciousSamples: { retained: false, count: 0 },
        otherRecords: 'Cloudflare WAF 日誌已保存於 ELK Stack'
      },
      analysisAndAssessment: {
        abnormalConnections: `偵測到來自以下 IP 的異常連線：\n- 220.228.194.155 (台灣/台中) - WAF Score: 89, RCE Score: 92\n- 2408:8719:40f:10:30:: (中國/濟南) - WAF Score: 83, RCE Score: 87\n\n這些請求的 WAF 攻擊評分低於安全閾值，顯示潛在威脅。`,
        abnormalAccountUsage: '無異常帳號使用跡象',
        unauthorizedFiles: '無',
        databaseTampering: '無',
        dataLeakDetails: '無資料外洩跡象',
        additionalAssessment: `Cloudflare WAF 機器學習模型已偵測並記錄這些可疑請求。其中來自中國的請求已觸發自定義防火牆規則 (ID: afce0103f8b747a896dc36d0a0774c86)。`
      },
      containmentAndRecovery: {
        removedMaliciousFiles: { removed: false, count: 0, details: '無惡意檔案' },
        blockedIPs: {
          blocked: true,
          ipList: uniqueIPs,
          blockingDevice: 'Cloudflare WAF'
        },
        disabledAccounts: { disabled: false, accountList: [] },
        removedLeakedData: false,
        notifiedParties: false,
        disconnectedHost: false,
        requestedSearchEngineRemoval: { requested: false, engines: [] },
        codeReview: { completed: false, completionDate: '' },
        systemRebuild: { completed: false, completionDate: '' },
        additionalMeasures: '已啟用 Cloudflare WAF 監控，持續追蹤可疑活動'
      },
      responseSummary: `Cloudflare WAF 已成功偵測 ${totalOpenIssues} 個可疑請求。目前已採取記錄 (log) 動作，建議評估是否需要升級為阻擋 (block) 動作。`,
      recoveryStatus: '已完成損害控制',
      recoveryTime: ''
    },
    step6_closureReport: {
      affectedDevices: {
        computers: 0,
        servers: totalAffectedAssets,
        otherDeviceType: '',
        otherDeviceCount: 0
      },
      networkInfo: {
        externalIPs: uniqueIPs,
        internalIPs: [],
        affectedURLs: ['sstportal.phison.com', 'www.phison.com']
      },
      systemInfo: {
        osType: 'Linux系列',
        osVersion: '',
        ismsCompliant: true,
        mainSystemVendor: userProvidedData.mainSystemVendor || '',
        systemBuilder: userProvidedData.systemBuilder || ''
      },
      socInfo: {
        hasSOC: true,
        socType: '委外建置',
        socVendor: userProvidedData.socVendor || '',
        inSOCScope: true,
        socAlertReceived: true,
        alertId: 'CF-WAF-2025120301'
      },
      securityDevices: {
        hasDevices: true,
        devices: [
          { type: '應用程式防火牆', deviceId: 'Cloudflare WAF' },
          { type: '威脅情報服務', deviceId: 'Cloudflare Threat Intelligence' }
        ]
      },
      rootCause: {
        category: '外部攻擊嘗試',
        categoryDetail: 'WAF 偵測到來自台灣及中國 IP 的可疑請求，RCE 攻擊評分偏低',
        isVendorFault: false,
        vendorName: '',
        vendorId: '',
        vendorAgreed: false,
        cannotDetermine: false,
        cannotDetermineReason: '',
        investigationDetails: risks.map(r => `${r.title}: ${r.aiInsight}`).join('\n\n')
      },
      remediation: {
        systemSecurity: {
          passwordChangeEvaluated: true,
          hostPasswordChangeEvaluated: true,
          systemUpdated: true,
          updateDetails: allRecommendations.slice(0, 3).join('\n'),
          networkNeighborDisabled: false,
          robotsTxtConfigured: true,
          authenticationEnhanced: false,
          authenticationDetails: '',
          uploadRestricted: true,
          uploadRestrictedTypes: '可執行檔、腳本檔',
          dbAccessRestricted: true,
          dbHostIPRestricted: true,
          webdavDisabled: true
        },
        managementAndTraining: {
          networkArchitectureReviewed: true,
          internalSecurityTest: true,
          securityTraining: false,
          securityPlanRevised: false
        },
        otherMeasures: allRecommendations.slice(3).join('\n')
      },
      securityPersonnel: {
        name: userProvidedData.securityPersonName || '',
        title: userProvidedData.securityPersonTitle || ''
      },
      closureTime: ''
    },
    aiGeneratedInsights: {
      attackPatternAnalysis: `本次分析共偵測到 ${risks.length} 項安全風險：\n\n` +
        risks.map((r, i) => `${i+1}. ${r.title} (${r.severity.toUpperCase()})\n   ${r.aiInsight}`).join('\n\n'),
      threatActorProfile: '根據攻擊模式分析，攻擊者可能使用自動化掃描工具探測網站漏洞。來源地區包含台灣及中國，使用標準瀏覽器 User-Agent 進行偽裝。建議密切關注這些 IP 的後續活動。',
      recommendedPriorities: allRecommendations.slice(0, 3),
      longTermRecommendations: [
        '定期審查 WAF 規則配置，確保防護策略與最新威脅情報同步',
        '實施 Zero Trust 架構，強化邊界防護',
        '建立自動化威脅回應機制，縮短事件回應時間',
        '定期進行滲透測試，主動發現潛在漏洞'
      ]
    }
  };
}

const reportData = buildReportData(analysisResult, analysisResult.metadata, userProvidedData);

// 生成純文字報告
const wordReportService = new WordReportService();
const textReport = wordReportService.generateTextReport(reportData);

// 儲存報告
const reportPath = path.join(__dirname, '..', 'docs', '模擬報告_Cloudflare_WAF_分析_2025-12-03.txt');
fs.writeFileSync(reportPath, textReport, 'utf-8');

console.log('✅ 報告已生成並儲存至：');
console.log(`   ${reportPath}`);
console.log('\n📋 報告內容預覽（前 80 行）：\n');
console.log(textReport.split('\n').slice(0, 80).join('\n'));
console.log('\n... (更多內容請查看完整報告檔案)');

// 同時輸出 JSON 格式
const jsonReportPath = path.join(__dirname, '..', 'docs', '模擬報告_結構化資料_2025-12-03.json');
fs.writeFileSync(jsonReportPath, JSON.stringify(reportData, null, 2), 'utf-8');
console.log(`\n📁 結構化 JSON 資料已儲存至：`);
console.log(`   ${jsonReportPath}`);

