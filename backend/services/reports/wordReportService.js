// backend/services/reports/wordReportService.js
// Word 報告填充服務 - 負責將結構化資料填充到 Word 模板

const fs = require('fs');
const path = require('path');

class WordReportService {
  constructor() {
    this.templatePath = path.join(__dirname, '../../templates/網頁攻擊資安報告-template.docx');
    this.originalTemplatePath = path.join(__dirname, '../../docs/網頁攻擊資安報告.docx');
  }

  /**
   * 檢查模板是否存在
   */
  checkTemplateExists() {
    if (fs.existsSync(this.templatePath)) {
      return { exists: true, path: this.templatePath };
    }
    if (fs.existsSync(this.originalTemplatePath)) {
      return { exists: true, path: this.originalTemplatePath, isOriginal: true };
    }
    return { exists: false };
  }

  /**
   * 將報告資料轉換為純文字格式（臨時方案）
   * 在正式整合 docx-templates 套件之前，先生成純文字報告
   * @param {Object} reportData - 結構化報告資料
   */
  generateTextReport(reportData) {
    const step1 = reportData.step1_basicInfo || {};
    const step2 = reportData.step2_eventProcess || {};
    const step3 = reportData.step3_impactAssessment || {};
    const step4 = reportData.step4_supportNeeded || {};
    const step5 = reportData.step5_emergencyResponse || {};
    const step6 = reportData.step6_closureReport || {};
    const meta = reportData.reportMetadata || {};
    const ai = reportData.aiGeneratedInsights || {};

    let report = '';

    // 報告標題
    report += '═'.repeat(60) + '\n';
    report += '          【網頁攻擊】資通安全事件通報單\n';
    report += '═'.repeat(60) + '\n\n';

    // 報告元資料
    report += `📋 報告生成時間：${meta.generatedAt || new Date().toISOString()}\n`;
    report += `📋 分析平台：${meta.platform || '未知'}\n`;
    report += `📋 整體風險等級：${meta.overallRiskLevel || '未評估'}\n`;
    report += `📋 摘要：${meta.summary || '無'}\n`;
    report += '\n' + '─'.repeat(60) + '\n\n';

    // ===== 通報階段-事件通報 =====
    report += '【通報階段-事件通報】\n\n';

    // Step 1
    report += '■ Step 1. 事件相關基本資料\n';
    report += '─'.repeat(40) + '\n';
    report += `◎ 填報時間：${step1.reportTime || '____年____月____日____時____分'}\n`;
    report += `◎ 機關(機構)名稱：${step1.organizationName || ''}\n`;
    report += `◎ 審核機關名稱：${step1.reviewOrganization || ''}\n`;
    report += `◎ 通報人：${step1.reporterName || ''}\n`;
    report += `◎ 電話：${step1.phone || ''}\n`;
    report += `◎ 傳真：${step1.fax || ''}\n`;
    report += `◎ 電子郵件：${step1.email || ''}\n`;
    report += `◎ 是否代其他機關(構)通報：${step1.isProxy ? '是，該單位名稱：' + step1.proxyOrganization : '否'}\n`;
    report += `◎ 資安事件調查廠商：${step1.investigationVendor || ''}\n\n`;

    // Step 2
    report += '■ Step 2. 事件發生過程\n';
    report += '─'.repeat(40) + '\n';
    report += `◎ 知悉資通安全事件時間：${step2.eventDiscoveryTime || ''}\n\n`;

    report += '◎ 事件分類與異常狀況：\n';
    const ec = step2.eventClassification || {};

    // 網頁攻擊
    if (ec.webAttack) {
      const wa = ec.webAttack;
      report += '  (駭侵類)網頁攻擊\n';
      report += `    ${wa.webTampering ? '☑' : '☐'} 網頁置換  `;
      report += `${wa.maliciousComment ? '☑' : '☐'} 惡意留言  `;
      report += `${wa.maliciousPage ? '☑' : '☐'} 惡意網頁  `;
      report += `${wa.phishingPage ? '☑' : '☐'} 釣魚網頁\n`;
      report += `    ${wa.webTrojan ? '☑' : '☐'} 網頁木馬  `;
      report += `${wa.dataLeak ? '☑' : '☐'} 網站資料外洩  `;
      report += `${wa.webModified ? '☑' : '☐'} 網頁遭竄改\n`;
    }

    // 非法入侵
    if (ec.intrusion) {
      const int = ec.intrusion;
      report += '  (駭侵類)非法入侵\n';
      report += `    ${int.systemIntrusion ? '☑' : '☐'} 系統遭入侵  `;
      report += `${int.malwareImplant ? '☑' : '☐'} 植入惡意程式  `;
      report += `${int.abnormalConnection ? '☑' : '☐'} 異常連線\n`;
      report += `    ${int.spamSending ? '☑' : '☐'} 發送垃圾郵件  `;
      report += `${int.dataLeak ? '☑' : '☐'} 資料外洩  `;
      report += `${int.abnormalAccountLogin ? '☑' : '☐'} 帳號異常登入\n`;
      report += `    ${int.externalAttackScan ? '☑' : '☐'} 對外攻擊/掃描探測  `;
      report += `${int.unauthorizedAccess ? '☑' : '☐'} 未經授權存取\n`;
    }

    // 阻斷服務
    if (ec.dos) {
      const dos = ec.dos;
      report += '  (駭侵類)阻斷服務(DoS/DDoS)\n';
      report += `    ${dos.serviceInterruption ? '☑' : '☐'} 服務中斷  `;
      report += `${dos.performanceDegradation ? '☑' : '☐'} 效能降低\n`;
    }

    report += `\n◎ 事件說明及影響範圍：\n${step2.eventDescription || ''}\n\n`;
    report += `◎ 是否為網路攻防實兵演練：${step2.isExercise ? '是' : '否'}\n`;
    report += `◎ 是否影響其他政府機關(構)或重要民生設施：${step2.affectsOtherAgencies ? '是' : '否'}\n`;

    if (step2.affectedInfrastructure && step2.affectedInfrastructure.length > 0) {
      report += `◎ 影響領域：${step2.affectedInfrastructure.join('、')}\n`;
    }

    report += `◎ 通報來源：${step2.reportSource || '自行發現'}\n\n`;

    // Step 3
    report += '■ Step 3. 評估事件影響等級\n';
    report += '─'.repeat(40) + '\n';

    const conf = step3.confidentiality || {};
    const inte = step3.integrity || {};
    const avai = step3.availability || {};

    report += '◎ 機密性衝擊：\n';
    report += `  等級：${conf.levelDescription || '無'}\n`;
    report += `  判定依據：${conf.justification || '無'}\n\n`;

    report += '◎ 完整性衝擊：\n';
    report += `  等級：${inte.levelDescription || '無'}\n`;
    report += `  判定依據：${inte.justification || '無'}\n\n`;

    report += '◎ 可用性衝擊：\n';
    report += `  等級：${avai.levelDescription || '無'}\n`;
    report += `  判定依據：${avai.justification || '無'}\n\n`;

    report += `◎ 整體影響等級：${step3.overallLevelDescription || '無'}\n\n`;

    // Step 4
    report += '■ Step 4. 是否需要外部支援\n';
    report += '─'.repeat(40) + '\n';
    report += `◎ 是否需要支援：${step4.needSupport ? '是' : '否'}\n`;
    if (step4.needSupport) {
      report += `◎ 期望支援內容：${step4.supportContent || ''}\n`;
    }
    report += '\n';

    // ===== 應變處置階段 =====
    report += '\n' + '═'.repeat(60) + '\n';
    report += '【應變處置階段-損害控制或復原】\n\n';

    // Step 5
    report += '■ Step 5. 機關緊急應變措施\n';
    report += '─'.repeat(40) + '\n';

    const records = step5.recordsRetention || {};
    report += '◎ 保留受害期間之相關設備紀錄資料：\n';
    if (records.hostEventLog?.retained) {
      report += `  ☑ 已保存遭受害主機事件紀錄檔 (${records.hostEventLog.duration})\n`;
    }
    if (records.firewallLog?.retained) {
      report += `  ☑ 已保存防火牆紀錄 (${records.firewallLog.duration})\n`;
    }
    if (records.websiteLog?.retained) {
      report += `  ☑ 已保存網站日誌檔 (${records.websiteLog.duration})\n`;
    }
    if (records.maliciousSamples?.retained) {
      report += `  ☑ 已保存惡意樣本，共 ${records.maliciousSamples.count} 個\n`;
    }
    if (records.otherRecords) {
      report += `  其他：${records.otherRecords}\n`;
    }
    report += '\n';

    const analysis = step5.analysisAndAssessment || {};
    report += '◎ 事件分析與影響評估：\n';
    report += `  異常連線行為：${analysis.abnormalConnections || '無'}\n`;
    report += `  異常帳號使用：${analysis.abnormalAccountUsage || '無'}\n`;
    report += `  未授權程式/檔案：${analysis.unauthorizedFiles || '無'}\n`;
    report += `  資料庫竄改：${analysis.databaseTampering || '無'}\n`;
    report += `  資料外洩詳情：${analysis.dataLeakDetails || '無'}\n`;
    report += `  補充說明：${analysis.additionalAssessment || '無'}\n\n`;

    const cont = step5.containmentAndRecovery || {};
    report += '◎ 封鎖、根除及復原：\n';
    if (cont.removedMaliciousFiles?.removed) {
      report += `  ☑ 移除惡意檔案，共 ${cont.removedMaliciousFiles.count} 筆\n`;
      report += `    詳情：${cont.removedMaliciousFiles.details}\n`;
    }
    if (cont.blockedIPs?.blocked && cont.blockedIPs.ipList?.length > 0) {
      report += `  ☑ 阻擋 IP：${cont.blockedIPs.ipList.join(', ')}\n`;
      report += `    阻擋設備：${cont.blockedIPs.blockingDevice}\n`;
    }
    if (cont.disabledAccounts?.disabled && cont.disabledAccounts.accountList?.length > 0) {
      report += `  ☑ 停用帳號：${cont.disabledAccounts.accountList.join(', ')}\n`;
    }
    report += `  ${cont.removedLeakedData ? '☑' : '☐'} 移除網站外洩資料\n`;
    report += `  ${cont.notifiedParties ? '☑' : '☐'} 通知相關當事人\n`;
    report += `  ${cont.disconnectedHost ? '☑' : '☐'} 暫時中斷受害主機網路連線\n`;
    if (cont.codeReview?.completed) {
      report += `  ☑ 修改網站程式碼，完成日期：${cont.codeReview.completionDate}\n`;
    }
    if (cont.systemRebuild?.completed) {
      report += `  ☑ 重新建置作業系統，完成日期：${cont.systemRebuild.completionDate}\n`;
    }
    if (cont.additionalMeasures) {
      report += `  其他措施：${cont.additionalMeasures}\n`;
    }
    report += '\n';

    report += `◎ 應變處置綜整說明：\n${step5.responseSummary || ''}\n\n`;
    report += `◎ 復原狀態：${step5.recoveryStatus || '處理中'}\n`;
    if (step5.recoveryTime) {
      report += `◎ 完成時間：${step5.recoveryTime}\n`;
    }
    report += '\n';

    // ===== 結報階段 =====
    report += '\n' + '═'.repeat(60) + '\n';
    report += '【結報階段-調查、處理及改善報告】\n\n';

    // Step 6
    report += '■ Step 6. 資安事件結案作業\n';
    report += '─'.repeat(40) + '\n';

    const devices = step6.affectedDevices || {};
    report += '◎ 受駭資訊設備數量：\n';
    report += `  電腦：${devices.computers || 0} 臺\n`;
    report += `  伺服器：${devices.servers || 0} 臺\n`;
    if (devices.otherDeviceType) {
      report += `  ${devices.otherDeviceType}：${devices.otherDeviceCount || 0} 臺\n`;
    }
    report += '\n';

    const net = step6.networkInfo || {};
    report += '◎ 網路資訊：\n';
    if (net.externalIPs?.length > 0) {
      report += `  外部 IP：${net.externalIPs.join(', ')}\n`;
    }
    if (net.internalIPs?.length > 0) {
      report += `  內部 IP：${net.internalIPs.join(', ')}\n`;
    }
    if (net.affectedURLs?.length > 0) {
      report += `  受害 URL：${net.affectedURLs.join(', ')}\n`;
    }
    report += '\n';

    const sys = step6.systemInfo || {};
    report += '◎ 系統資訊：\n';
    report += `  作業系統：${sys.osType || ''} ${sys.osVersion || ''}\n`;
    report += `  是否通過 ISMS 驗證：${sys.ismsCompliant ? '是' : '否'}\n`;
    report += `  維護廠商：${sys.mainSystemVendor || ''}\n`;
    report += `  建置廠商：${sys.systemBuilder || ''}\n\n`;

    const soc = step6.socInfo || {};
    report += '◎ SOC 資訊：\n';
    report += `  有無 SOC：${soc.hasSOC ? '有' : '無'}\n`;
    if (soc.hasSOC) {
      report += `  SOC 類型：${soc.socType || ''}\n`;
      report += `  SOC 廠商：${soc.socVendor || ''}\n`;
      report += `  是否納入監控：${soc.inSOCScope ? '是' : '否'}\n`;
      report += `  SOC 是否發送告警：${soc.socAlertReceived ? '是' : '否'}\n`;
      if (soc.alertId) {
        report += `  告警編號：${soc.alertId}\n`;
      }
    }
    report += '\n';

    const root = step6.rootCause || {};
    report += '◎ 事件發生原因：\n';
    report += `  原因類別：${root.category || '無法確認'}\n`;
    if (root.categoryDetail) {
      report += `  詳細說明：${root.categoryDetail}\n`;
    }
    if (root.isVendorFault) {
      report += `  廠商疏失：是，廠商名稱：${root.vendorName}\n`;
    }
    report += `  調查說明：${root.investigationDetails || ''}\n\n`;

    const rem = step6.remediation || {};
    report += '◎ 補強措施：\n';

    const sec = rem.systemSecurity || {};
    report += '  【系統/程式安全設定】\n';
    report += `    ${sec.passwordChangeEvaluated ? '☑' : '☐'} 已評估變更應用系統密碼\n`;
    report += `    ${sec.hostPasswordChangeEvaluated ? '☑' : '☐'} 已評估變更主機帳號密碼\n`;
    report += `    ${sec.systemUpdated ? '☑' : '☐'} 已檢視/更新系統與應用程式\n`;
    if (sec.updateDetails) {
      report += `      更新詳情：${sec.updateDetails}\n`;
    }

    const mgmt = rem.managementAndTraining || {};
    report += '  【資安管理與教育訓練】\n';
    report += `    ${mgmt.networkArchitectureReviewed ? '☑' : '☐'} 重新檢視網路架構\n`;
    report += `    ${mgmt.internalSecurityTest ? '☑' : '☐'} 內部安全檢測\n`;
    report += `    ${mgmt.securityTraining ? '☑' : '☐'} 加強資安教育訓練\n`;
    report += `    ${mgmt.securityPlanRevised ? '☑' : '☐'} 修正資安防護計畫\n`;

    if (rem.otherMeasures) {
      report += `  其他措施：${rem.otherMeasures}\n`;
    }
    report += '\n';

    const personnel = step6.securityPersonnel || {};
    if (personnel.name) {
      report += `◎ 處理本事件之資安人員：${personnel.name} / ${personnel.title || ''}\n`;
    }

    if (step6.closureTime) {
      report += `◎ 結報時間：${step6.closureTime}\n`;
    }

    // ===== AI 分析洞見 =====
    report += '\n' + '═'.repeat(60) + '\n';
    report += '【AI 分析洞見】\n\n';

    if (ai.attackPatternAnalysis) {
      report += `◎ 攻擊模式分析：\n${ai.attackPatternAnalysis}\n\n`;
    }
    if (ai.threatActorProfile) {
      report += `◎ 威脅行為者特徵：\n${ai.threatActorProfile}\n\n`;
    }
    if (ai.recommendedPriorities?.length > 0) {
      report += '◎ 優先處理事項：\n';
      ai.recommendedPriorities.forEach((item, idx) => {
        report += `  ${idx + 1}. ${item}\n`;
      });
      report += '\n';
    }
    if (ai.longTermRecommendations?.length > 0) {
      report += '◎ 長期建議：\n';
      ai.longTermRecommendations.forEach((item, idx) => {
        report += `  ${idx + 1}. ${item}\n`;
      });
    }

    report += '\n' + '═'.repeat(60) + '\n';
    report += '                    【報告結束】\n';
    report += '═'.repeat(60) + '\n';

    return report;
  }

  /**
   * 生成 Word 報告（使用 docx-templates 套件）
   * 注意：需要先安裝 docx-templates 套件
   * @param {Object} reportData - 結構化報告資料
   */
  async generateWordReport(reportData) {
    try {
      // 檢查 docx-templates 是否已安裝
      let createReport;
      try {
        createReport = require('docx-templates').default;
      } catch (e) {
        console.log('⚠️ docx-templates 套件未安裝，返回純文字報告');
        const textReport = this.generateTextReport(reportData);
        return {
          success: true,
          format: 'text',
          content: textReport,
          message: '請安裝 docx-templates 套件以啟用 Word 報告生成：npm install docx-templates'
        };
      }

      // 檢查模板
      const templateCheck = this.checkTemplateExists();
      if (!templateCheck.exists) {
        console.log('⚠️ Word 模板不存在，返回純文字報告');
        const textReport = this.generateTextReport(reportData);
        return {
          success: true,
          format: 'text',
          content: textReport,
          message: 'Word 模板不存在，請先準備模板檔案'
        };
      }

      // 讀取模板
      const template = fs.readFileSync(templateCheck.path);

      // 準備模板資料
      const templateData = this.prepareTemplateData(reportData);

      // 填充模板
      const buffer = await createReport({
        template,
        data: templateData,
        cmdDelimiter: ['{{', '}}']
      });

      return {
        success: true,
        format: 'docx',
        buffer: buffer,
        filename: `資安事件通報單_${new Date().toISOString().split('T')[0]}.docx`
      };

    } catch (error) {
      console.error('❌ Word 報告生成失敗:', error.message);

      // 回退到純文字報告
      const textReport = this.generateTextReport(reportData);
      return {
        success: true,
        format: 'text',
        content: textReport,
        error: error.message,
        message: 'Word 報告生成失敗，已回退到純文字格式'
      };
    }
  }

  /**
   * 準備模板資料（將報告資料轉換為模板變數）
   * @param {Object} reportData - 結構化報告資料
   */
  prepareTemplateData(reportData) {
    const step1 = reportData.step1_basicInfo || {};
    const step2 = reportData.step2_eventProcess || {};
    const step3 = reportData.step3_impactAssessment || {};
    const step5 = reportData.step5_emergencyResponse || {};
    const step6 = reportData.step6_closureReport || {};

    return {
      // Step 1
      reportTime: step1.reportTime || '',
      organizationName: step1.organizationName || '',
      reviewOrganization: step1.reviewOrganization || '',
      reporterName: step1.reporterName || '',
      phone: step1.phone || '',
      fax: step1.fax || '',
      email: step1.email || '',
      isProxy: step1.isProxy ? '是' : '否',
      proxyOrganization: step1.proxyOrganization || '',
      investigationVendor: step1.investigationVendor || '',

      // Step 2
      eventDiscoveryTime: step2.eventDiscoveryTime || '',
      eventDescription: step2.eventDescription || '',
      isExercise: step2.isExercise ? '是' : '否',
      affectsOtherAgencies: step2.affectsOtherAgencies ? '是' : '否',

      // Step 3
      confidentialityLevel: step3.confidentiality?.levelDescription || '無',
      confidentialityJustification: step3.confidentiality?.justification || '',
      integrityLevel: step3.integrity?.levelDescription || '無',
      integrityJustification: step3.integrity?.justification || '',
      availabilityLevel: step3.availability?.levelDescription || '無',
      availabilityJustification: step3.availability?.justification || '',

      // Step 5
      abnormalConnections: step5.analysisAndAssessment?.abnormalConnections || '',
      abnormalAccountUsage: step5.analysisAndAssessment?.abnormalAccountUsage || '',
      unauthorizedFiles: step5.analysisAndAssessment?.unauthorizedFiles || '',
      dataLeakDetails: step5.analysisAndAssessment?.dataLeakDetails || '',
      blockedIPs: step5.containmentAndRecovery?.blockedIPs?.ipList?.join(', ') || '',
      responseSummary: step5.responseSummary || '',
      recoveryStatus: step5.recoveryStatus || '',

      // Step 6
      computerCount: step6.affectedDevices?.computers || 0,
      serverCount: step6.affectedDevices?.servers || 0,
      externalIPs: step6.networkInfo?.externalIPs?.join(', ') || '',
      internalIPs: step6.networkInfo?.internalIPs?.join(', ') || '',
      affectedURLs: step6.networkInfo?.affectedURLs?.join(', ') || '',
      osType: step6.systemInfo?.osType || '',
      osVersion: step6.systemInfo?.osVersion || '',
      rootCause: step6.rootCause?.category || '',
      investigationDetails: step6.rootCause?.investigationDetails || '',

      // 其他
      ...reportData
    };
  }
}

module.exports = WordReportService;

