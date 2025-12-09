// backend/routes/report.routes.js
// 報告生成 API 路由

const express = require('express');
const router = express.Router();
const ReportGeneratorService = require('../services/reports/reportGeneratorService');
const WordReportService = require('../services/reports/wordReportService');

// 實例化服務
const reportGeneratorService = new ReportGeneratorService();
const wordReportService = new WordReportService();

/**
 * POST /api/reports/generate
 * 生成完整的資安事件通報單
 * 
 * Request Body:
 * {
 *   analysisData: { risks: [...], ... },      // AI 分析結果
 *   metadata: { totalEvents, timeRange, ... }, // 分析元資料
 *   userProvidedData: { organizationName, ... }, // 用戶提供的基本資料
 *   aiConfig: { provider, apiKey, model },    // AI 配置
 *   outputFormat: 'word' | 'text' | 'json'    // 輸出格式
 * }
 */
router.post('/generate', async (req, res) => {
  try {
    const { 
      analysisData, 
      metadata, 
      userProvidedData = {}, 
      aiConfig = {},
      outputFormat = 'text'
    } = req.body;

    console.log('\n📋 ===== 報告生成 API 請求 =====');
    console.log(`📅 時間：${new Date().toISOString()}`);
    console.log(`📊 輸出格式：${outputFormat}`);
    console.log(`🤖 AI 提供者：${aiConfig.provider || 'gemini'}`);

    // 驗證必要參數
    if (!analysisData) {
      return res.status(400).json({
        success: false,
        error: '缺少必要參數：analysisData'
      });
    }

    // 準備 AI 配置
    const finalAiConfig = {
      provider: aiConfig.provider || 'gemini',
      apiKey: aiConfig.apiKey || process.env.GEMINI_API_KEY,
      model: aiConfig.model || 'gemini-2.0-flash-exp'
    };

    // 如果使用 Gemini 但沒有 API Key
    if (finalAiConfig.provider === 'gemini' && !finalAiConfig.apiKey) {
      return res.status(400).json({
        success: false,
        error: '請提供 Gemini API Key 或切換至 Ollama'
      });
    }

    // 準備 metadata
    const finalMetadata = {
      totalEvents: metadata?.totalEvents || 0,
      timeRange: metadata?.timeRange || {},
      platform: metadata?.platform || 'unknown',
      analysisTimestamp: metadata?.analysisTimestamp || new Date().toISOString()
    };

    // Step 1: 生成報告結構化資料（第二階段 AI）
    console.log('\n🔄 Step 1: 生成報告結構化資料...');
    const reportResult = await reportGeneratorService.generateFullReport(
      analysisData,
      finalMetadata,
      userProvidedData,
      finalAiConfig
    );

    if (!reportResult.success) {
      return res.status(500).json({
        success: false,
        error: '報告資料生成失敗',
        details: reportResult.error
      });
    }

    const reportData = reportResult.reportData;

    // 驗證報告資料
    const validation = reportGeneratorService.validateReportData(reportData);
    if (!validation.valid) {
      console.warn('⚠️ 報告資料不完整，缺少欄位:', validation.missingFields);
    }

    // Step 2: 根據輸出格式生成報告
    console.log(`\n🔄 Step 2: 生成 ${outputFormat} 格式報告...`);

    if (outputFormat === 'json') {
      // 直接返回 JSON 資料
      return res.json({
        success: true,
        format: 'json',
        reportData: reportData,
        metadata: {
          generatedAt: new Date().toISOString(),
          platform: finalMetadata.platform,
          totalEvents: finalMetadata.totalEvents
        }
      });
    }

    if (outputFormat === 'word') {
      // 生成 Word 報告
      const wordResult = await wordReportService.generateWordReport(reportData);

      if (wordResult.format === 'docx' && wordResult.buffer) {
        // 返回 Word 檔案
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(wordResult.filename)}"`);
        return res.send(wordResult.buffer);
      } else {
        // Word 生成失敗，返回純文字
        console.log('⚠️ Word 生成失敗，回退到純文字格式');
        return res.json({
          success: true,
          format: 'text',
          content: wordResult.content,
          message: wordResult.message,
          reportData: reportData
        });
      }
    }

    // 預設：生成純文字報告
    const textReport = wordReportService.generateTextReport(reportData);
    
    return res.json({
      success: true,
      format: 'text',
      content: textReport,
      reportData: reportData,
      metadata: {
        generatedAt: new Date().toISOString(),
        platform: finalMetadata.platform,
        totalEvents: finalMetadata.totalEvents
      }
    });

  } catch (error) {
    console.error('❌ 報告生成失敗:', error);
    res.status(500).json({
      success: false,
      error: '報告生成失敗',
      details: error.message
    });
  }
});

/**
 * POST /api/reports/generate-text
 * 僅生成純文字報告（快速方案，不需要第二階段 AI）
 */
router.post('/generate-text', async (req, res) => {
  try {
    const { analysisData, metadata, userProvidedData = {} } = req.body;

    console.log('\n📋 ===== 純文字報告生成 API =====');

    if (!analysisData) {
      return res.status(400).json({
        success: false,
        error: '缺少必要參數：analysisData'
      });
    }

    // 直接從分析資料建構簡化報告資料
    const simpleReportData = buildSimpleReportData(analysisData, metadata, userProvidedData);

    // 生成純文字報告
    const textReport = wordReportService.generateTextReport(simpleReportData);

    res.json({
      success: true,
      format: 'text',
      content: textReport,
      metadata: {
        generatedAt: new Date().toISOString(),
        method: 'simple',
        note: '此為簡化報告，未經 AI 轉譯'
      }
    });

  } catch (error) {
    console.error('❌ 純文字報告生成失敗:', error);
    res.status(500).json({
      success: false,
      error: '報告生成失敗',
      details: error.message
    });
  }
});

/**
 * POST /api/reports/download-text
 * 下載純文字報告檔案
 */
router.post('/download-text', async (req, res) => {
  try {
    const { analysisData, metadata, userProvidedData = {}, aiConfig = {} } = req.body;

    console.log('\n📥 ===== 下載純文字報告 =====');

    if (!analysisData) {
      return res.status(400).json({
        success: false,
        error: '缺少必要參數：analysisData'
      });
    }

    // 準備 AI 配置
    const finalAiConfig = {
      provider: aiConfig.provider || 'ollama',
      apiKey: aiConfig.apiKey,
      model: aiConfig.model || 'twister_llama33:latest'
    };

    // 準備 metadata
    const finalMetadata = {
      totalEvents: metadata?.totalEvents || 0,
      timeRange: metadata?.timeRange || {},
      platform: metadata?.platform || 'unknown'
    };

    // 生成完整報告資料
    const reportResult = await reportGeneratorService.generateFullReport(
      analysisData,
      finalMetadata,
      userProvidedData,
      finalAiConfig
    );

    let textReport;
    if (reportResult.success) {
      textReport = wordReportService.generateTextReport(reportResult.reportData);
    } else {
      // 回退到簡化報告
      const simpleReportData = buildSimpleReportData(analysisData, metadata, userProvidedData);
      textReport = wordReportService.generateTextReport(simpleReportData);
    }

    // 設定下載標頭
    const filename = `資安事件通報單_${new Date().toISOString().split('T')[0]}.txt`;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
    
    res.send(textReport);

  } catch (error) {
    console.error('❌ 報告下載失敗:', error);
    res.status(500).json({
      success: false,
      error: '報告下載失敗',
      details: error.message
    });
  }
});

/**
 * GET /api/reports/templates
 * 取得可用的報告模板列表
 */
router.get('/templates', (req, res) => {
  const templateCheck = wordReportService.checkTemplateExists();

  res.json({
    success: true,
    templates: [
      {
        id: 'security-incident',
        name: '【網頁攻擊】資通安全事件通報單',
        format: 'docx',
        available: templateCheck.exists,
        path: templateCheck.path || null
      }
    ]
  });
});

/**
 * GET /api/reports/health
 * 報告服務健康檢查
 */
router.get('/health', (req, res) => {
  const templateCheck = wordReportService.checkTemplateExists();

  // 檢查 docx-templates 套件
  let docxTemplatesInstalled = false;
  try {
    require('docx-templates');
    docxTemplatesInstalled = true;
  } catch (e) {
    docxTemplatesInstalled = false;
  }

  res.json({
    success: true,
    status: 'healthy',
    components: {
      reportGeneratorService: true,
      wordReportService: true,
      templateAvailable: templateCheck.exists,
      docxTemplatesInstalled: docxTemplatesInstalled
    },
    recommendations: !docxTemplatesInstalled ? 
      ['請安裝 docx-templates 套件以啟用 Word 報告生成：npm install docx-templates'] : []
  });
});

/**
 * 從分析資料建構簡化報告資料（不使用第二階段 AI）
 */
function buildSimpleReportData(analysisData, metadata, userProvidedData) {
  const risks = analysisData.risks || [];
  const timeRange = metadata?.timeRange || {};

  // 計算統計
  const criticalCount = risks.filter(r => r.severity === 'critical').length;
  const highCount = risks.filter(r => r.severity === 'high').length;
  const mediumCount = risks.filter(r => r.severity === 'medium').length;
  const lowCount = risks.filter(r => r.severity === 'low').length;
  const totalAffectedAssets = risks.reduce((sum, r) => sum + (r.affectedAssets || 0), 0);
  const totalOpenIssues = risks.reduce((sum, r) => sum + (r.openIssues || 0), 0);

  // 提取 IP 列表（從風險描述中）
  const ipPattern = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;
  const allIPs = [];
  risks.forEach(risk => {
    const matches = (risk.description || '').match(ipPattern);
    if (matches) allIPs.push(...matches);
  });
  const uniqueIPs = [...new Set(allIPs)];

  // 判定事件分類
  const eventClassification = {
    category: 'webAttack',
    webAttack: {
      webTampering: risks.some(r => /竄改|tampering/i.test(r.title + r.description)),
      maliciousComment: false,
      maliciousPage: risks.some(r => /惡意網頁|malicious page/i.test(r.title + r.description)),
      phishingPage: risks.some(r => /釣魚|phishing/i.test(r.title + r.description)),
      webTrojan: risks.some(r => /木馬|trojan/i.test(r.title + r.description)),
      dataLeak: risks.some(r => /外洩|leak|exposure/i.test(r.title + r.description)),
      webModified: risks.some(r => /injection|xss|sql/i.test(r.title + r.description))
    },
    intrusion: {
      systemIntrusion: risks.some(r => /入侵|intrusion/i.test(r.title + r.description)),
      malwareImplant: risks.some(r => /惡意程式|malware/i.test(r.title + r.description)),
      abnormalConnection: risks.some(r => /異常連線|abnormal connection/i.test(r.title + r.description)),
      spamSending: false,
      dataLeak: risks.some(r => /資料外洩|data leak/i.test(r.title + r.description)),
      abnormalAccountLogin: risks.some(r => /暴力破解|brute force|credential/i.test(r.title + r.description)),
      externalAttackScan: risks.some(r => /掃描|scan|probe/i.test(r.title + r.description)),
      unauthorizedAccess: risks.some(r => /未授權|unauthorized/i.test(r.title + r.description))
    },
    dos: {
      serviceInterruption: risks.some(r => /dos|ddos|阻斷服務/i.test(r.title + r.description)),
      performanceDegradation: risks.some(r => /效能降低|rate limit/i.test(r.title + r.description))
    }
  };

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
      platform: metadata?.platform || 'unknown',
      reportType: '網頁攻擊',
      overallRiskLevel: maxLevel,
      summary: `偵測到 ${risks.length} 項風險，其中 ${criticalCount + highCount} 項為高/嚴重等級`
    },
    step1_basicInfo: {
      reportTime: new Date().toLocaleString('zh-TW'),
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
      eventDiscoveryTime: timeRange.start ? new Date(timeRange.start).toLocaleString('zh-TW') : '',
      eventClassification: eventClassification,
      eventDescription: risks.map(r => `【${r.title}】\n${r.description || ''}\n影響: ${r.affectedAssets || 0} 個資產，${r.openIssues || 0} 個問題`).join('\n\n'),
      isExercise: false,
      affectsOtherAgencies: false,
      affectedInfrastructure: [],
      reportSource: '自行發現（WAF 監控）'
    },
    step3_impactAssessment: {
      confidentiality: {
        level: maxLevel,
        levelDescription: levelDescriptions[maxLevel],
        justification: `基於 ${risks.length} 項風險評估`
      },
      integrity: {
        level: eventClassification.webAttack.webModified ? maxLevel : 0,
        levelDescription: eventClassification.webAttack.webModified ? levelDescriptions[maxLevel] : '無',
        justification: eventClassification.webAttack.webModified ? '偵測到網頁竄改攻擊' : '未偵測到完整性攻擊'
      },
      availability: {
        level: eventClassification.dos.serviceInterruption ? maxLevel : 0,
        levelDescription: eventClassification.dos.serviceInterruption ? levelDescriptions[maxLevel] : '無',
        justification: eventClassification.dos.serviceInterruption ? '偵測到阻斷服務攻擊' : '未偵測到可用性攻擊'
      },
      overallLevel: maxLevel,
      overallLevelDescription: `整體風險等級：${levelDescriptions[maxLevel]}`
    },
    step4_supportNeeded: {
      needSupport: maxLevel >= 3,
      supportContent: maxLevel >= 3 ? '需要專業資安團隊協助事件調查與處理' : ''
    },
    step5_emergencyResponse: {
      recordsRetention: {
        hostEventLog: { retained: true, duration: '1-6個月' },
        firewallLog: { retained: true, duration: '1-6個月' },
        websiteLog: { retained: true, duration: '1-6個月' },
        maliciousSamples: { retained: false, count: 0 },
        otherRecords: 'WAF 日誌已保存於 ELK'
      },
      analysisAndAssessment: {
        abnormalConnections: uniqueIPs.length > 0 ? `偵測到來自以下 IP 的異常連線：${uniqueIPs.slice(0, 10).join(', ')}` : '無',
        abnormalAccountUsage: '無',
        unauthorizedFiles: '無',
        databaseTampering: '無',
        dataLeakDetails: '無',
        additionalAssessment: `總計偵測 ${totalOpenIssues} 個安全事件`
      },
      containmentAndRecovery: {
        removedMaliciousFiles: { removed: false, count: 0, details: '無' },
        blockedIPs: {
          blocked: uniqueIPs.length > 0,
          ipList: uniqueIPs.slice(0, 20),
          blockingDevice: 'WAF/防火牆'
        },
        disabledAccounts: { disabled: false, accountList: [] },
        removedLeakedData: false,
        notifiedParties: false,
        disconnectedHost: false,
        requestedSearchEngineRemoval: { requested: false, engines: [] },
        codeReview: { completed: false, completionDate: '' },
        systemRebuild: { completed: false, completionDate: '' },
        additionalMeasures: ''
      },
      responseSummary: `WAF 已自動攔截 ${totalOpenIssues} 個安全事件，影響 ${totalAffectedAssets} 個資產。建議依照 AI 分析建議進行後續處理。`,
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
        externalIPs: uniqueIPs.slice(0, 10),
        internalIPs: [],
        affectedURLs: []
      },
      systemInfo: {
        osType: 'Linux系列',
        osVersion: '',
        ismsCompliant: false,
        mainSystemVendor: userProvidedData.mainSystemVendor || '',
        systemBuilder: userProvidedData.systemBuilder || ''
      },
      socInfo: {
        hasSOC: true,
        socType: '委外建置',
        socVendor: userProvidedData.socVendor || '',
        inSOCScope: true,
        socAlertReceived: true,
        alertId: ''
      },
      securityDevices: {
        hasDevices: true,
        devices: [{ type: '應用程式防火牆', deviceId: 'WAF-001' }]
      },
      rootCause: {
        category: '應用程式漏洞',
        categoryDetail: '',
        isVendorFault: false,
        vendorName: '',
        vendorId: '',
        vendorAgreed: false,
        cannotDetermine: false,
        cannotDetermineReason: '',
        investigationDetails: risks.map(r => r.title).join('、')
      },
      remediation: {
        systemSecurity: {
          passwordChangeEvaluated: true,
          hostPasswordChangeEvaluated: true,
          systemUpdated: true,
          updateDetails: allRecommendations.slice(0, 5).join('\n'),
          networkNeighborDisabled: false,
          robotsTxtConfigured: false,
          authenticationEnhanced: false,
          authenticationDetails: '',
          uploadRestricted: false,
          uploadRestrictedTypes: '',
          dbAccessRestricted: false,
          dbHostIPRestricted: false,
          webdavDisabled: false
        },
        managementAndTraining: {
          networkArchitectureReviewed: false,
          internalSecurityTest: true,
          securityTraining: false,
          securityPlanRevised: false
        },
        otherMeasures: allRecommendations.slice(5).join('\n')
      },
      securityPersonnel: {
        name: userProvidedData.securityPersonName || '',
        title: userProvidedData.securityPersonTitle || ''
      },
      closureTime: ''
    },
    aiGeneratedInsights: {
      attackPatternAnalysis: `本次分析偵測到 ${risks.length} 項安全風險，主要攻擊類型包含：${risks.map(r => r.title).slice(0, 5).join('、')}`,
      threatActorProfile: '根據攻擊模式分析，攻擊者可能使用自動化工具進行探測',
      recommendedPriorities: allRecommendations.slice(0, 3),
      longTermRecommendations: allRecommendations.slice(3, 6)
    }
  };
}

module.exports = router;

