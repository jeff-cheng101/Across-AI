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
    const step4 = reportData.step4_supportNeeded || {};
    const step5 = reportData.step5_emergencyResponse || {};
    const step6 = reportData.step6_closureReport || {};

    // 符號常數
    const RADIO_CHECKED = '◉';    // 單選選中符號
    const RADIO_UNCHECKED = '○';  // 單選未選中符號
    const CHECK_CHECKED = '■';    // 複選選中符號 (方框)
    const CHECK_UNCHECKED = '□';  // 複選未選中符號 (空方框)

    // 事件分類資料
    const ec = step2.eventClassification || {};
    const wa = ec.webAttack || {};
    const intrusion = ec.intrusion || {};
    const dos = ec.dos || {};
    const equipment = ec.equipment || {};

    // Step 5 子資料
    const records = step5.recordsRetention || {};
    const analysis = step5.analysisAndAssessment || {};
    const cont = step5.containmentAndRecovery || {};

    // Step 6 子資料
    const devices = step6.affectedDevices || {};
    const net = step6.networkInfo || {};
    const sys = step6.systemInfo || {};
    const soc = step6.socInfo || {};
    const root = step6.rootCause || {};
    const rem = step6.remediation || {};
    const secSys = rem.systemSecurity || {};
    const mgmt = rem.managementAndTraining || {};
    const personnel = step6.securityPersonnel || {};

    return {
      // ========== Step 1 - 基本資料 ==========
      reportTime: step1.reportTime || '',
      organizationName: step1.organizationName || '',
      reviewOrganization: step1.reviewOrganization || '',
      reporterName: step1.reporterName || '',
      phone: step1.phone || '',
      fax: step1.fax || '',
      email: step1.email || '',
      isProxy: step1.isProxy ? '是' : '否',
      isProxyYes: step1.isProxy ? RADIO_CHECKED : RADIO_UNCHECKED,
      isProxyNo: step1.isProxy ? RADIO_UNCHECKED : RADIO_CHECKED,
      proxyOrganization: step1.proxyOrganization || '',
      investigationVendor: step1.investigationVendor || '',

      // ========== Step 2 - 事件發生過程 ==========
      eventDiscoveryTime: step2.eventDiscoveryTime || '',
      eventDescription: step2.eventDescription || '',
      isExercise: step2.isExercise ? '是' : '否',
      isExerciseYes: step2.isExercise ? RADIO_CHECKED : RADIO_UNCHECKED,
      isExerciseNo: step2.isExercise ? RADIO_UNCHECKED : RADIO_CHECKED,
      affectsOtherAgencies: step2.affectsOtherAgencies ? '是' : '否',
      affectsOtherAgenciesYes: step2.affectsOtherAgencies ? RADIO_CHECKED : RADIO_UNCHECKED,
      affectsOtherAgenciesNo: step2.affectsOtherAgencies ? RADIO_UNCHECKED : RADIO_CHECKED,
      affectedInfrastructure: step2.affectedInfrastructure?.join('、') || '',

      // Step 2 - 影響機關(構)/重要民生設施領域（複選）
      infraWater: step2.affectedInfrastructure?.includes('水資源') ? CHECK_CHECKED : CHECK_UNCHECKED,               // 水資源
      infraEnergy: step2.affectedInfrastructure?.includes('能源') ? CHECK_CHECKED : CHECK_UNCHECKED,                 // 能源
      infraTelecom: step2.affectedInfrastructure?.includes('通訊傳播') ? CHECK_CHECKED : CHECK_UNCHECKED,            // 通訊傳播
      infraTransport: step2.affectedInfrastructure?.includes('交通') ? CHECK_CHECKED : CHECK_UNCHECKED,              // 交通
      infraFinance: step2.affectedInfrastructure?.includes('銀行與金融') ? CHECK_CHECKED : CHECK_UNCHECKED,          // 銀行與金融
      infraEmergency: step2.affectedInfrastructure?.includes('緊急救援與醫院') ? CHECK_CHECKED : CHECK_UNCHECKED,    // 緊急救援與醫院
      infraGov: step2.affectedInfrastructure?.includes('重要政府機關') ? CHECK_CHECKED : CHECK_UNCHECKED,            // 重要政府機關
      infraTechPark: step2.affectedInfrastructure?.includes('高科技園區') ? CHECK_CHECKED : CHECK_UNCHECKED,         // 高科技園區

      // Step 2 - 此事件通報來源（單選）
      reportSource: step2.reportSource || '',
      reportSourceSelf: step2.reportSource === '自行發現' ? RADIO_CHECKED : RADIO_UNCHECKED,                         // 自行發現
      reportSourceAlert: step2.reportSource === '警訊通知' ? RADIO_CHECKED : RADIO_UNCHECKED,                        // 警訊通知
      reportSourceAlertId: step2.reportSourceAlertId || '',                                                           // 警訊通知，發布編號
      reportSourceExternal: step2.reportSource === '其他外部情資' ? RADIO_CHECKED : RADIO_UNCHECKED,                 // 其他外部情資
      reportSourceExternalDetail: step2.reportSourceExternalDetail || '',                                             // 其他外部情資詳情
      reportSourceMedia: step2.reportSource === '媒體揭露' ? RADIO_CHECKED : RADIO_UNCHECKED,                        // 媒體揭露（電視、報紙、雜誌及網路等）

      // Step 2 - 事件大類（複選：只要該類別下有任何選項被選中，大類就選中）
      categoryWebAttack: Object.values(wa).some(Boolean) ? RADIO_CHECKED : RADIO_UNCHECKED,         // (駭侵類)網頁攻擊
      categoryIntrusion: Object.values(intrusion).some(Boolean) ? RADIO_CHECKED : RADIO_UNCHECKED,  // (駭侵類)非法入侵
      categoryDos: Object.values(dos).some(Boolean) ? RADIO_CHECKED : RADIO_UNCHECKED,              // (駭侵類)阻斷服務
      categoryEquipment: Object.values(equipment).some(Boolean) ? RADIO_CHECKED : RADIO_UNCHECKED,  // (非駭侵類)設備問題
      categoryOther: ec.category === 'other' ? RADIO_CHECKED : RADIO_UNCHECKED,                     // (非駭侵類)其他

      // Step 2 - 事件分類（駭侵類）網頁攻擊
      webTampering: wa.webTampering ? CHECK_CHECKED : CHECK_UNCHECKED,           // 網頁置換
      maliciousComment: wa.maliciousComment ? CHECK_CHECKED : CHECK_UNCHECKED,   // 惡意留言
      maliciousPage: wa.maliciousPage ? CHECK_CHECKED : CHECK_UNCHECKED,         // 惡意網頁
      phishingPage: wa.phishingPage ? CHECK_CHECKED : CHECK_UNCHECKED,           // 釣魚網頁
      webTrojan: wa.webTrojan ? CHECK_CHECKED : CHECK_UNCHECKED,                 // 網頁木馬
      webDataLeak: wa.dataLeak ? CHECK_CHECKED : CHECK_UNCHECKED,                // 網站資料外洩
      webModified: wa.webModified ? CHECK_CHECKED : CHECK_UNCHECKED,             // 網頁遭竄改

      // Step 2 - 事件分類（駭侵類）非法入侵
      systemIntrusion: intrusion.systemIntrusion ? CHECK_CHECKED : CHECK_UNCHECKED,           // 系統遭入侵
      malwareImplant: intrusion.malwareImplant ? CHECK_CHECKED : CHECK_UNCHECKED,             // 植入惡意程式
      abnormalConnection: intrusion.abnormalConnection ? CHECK_CHECKED : CHECK_UNCHECKED,     // 異常連線
      spamSending: intrusion.spamSending ? CHECK_CHECKED : CHECK_UNCHECKED,                   // 發送垃圾郵件
      intrusionDataLeak: intrusion.dataLeak ? CHECK_CHECKED : CHECK_UNCHECKED,                // 資料外洩
      abnormalAccountLogin: intrusion.abnormalAccountLogin ? CHECK_CHECKED : CHECK_UNCHECKED, // 帳號異常登入/使用/新增
      externalAttackScan: intrusion.externalAttackScan ? CHECK_CHECKED : CHECK_UNCHECKED,     // 資訊設備對外攻擊/掃描探測
      unauthorizedAccess: intrusion.unauthorizedAccess ? CHECK_CHECKED : CHECK_UNCHECKED,     // 未經授權存取

      // Step 2 - 事件分類（駭侵類）阻斷服務 DoS/DDoS
      serviceInterruption: dos.serviceInterruption ? CHECK_CHECKED : CHECK_UNCHECKED,         // 服務中斷
      performanceDegradation: dos.performanceDegradation ? CHECK_CHECKED : CHECK_UNCHECKED,   // 效能降低

      // Step 2 - 事件分類（非駭侵類）設備問題
      equipmentFailure: equipment.failure ? CHECK_CHECKED : CHECK_UNCHECKED,                  // 設備故障/毀損
      powerAnomaly: equipment.powerAnomaly ? CHECK_CHECKED : CHECK_UNCHECKED,                 // 電力異常
      networkInterruption: equipment.networkInterruption ? CHECK_CHECKED : CHECK_UNCHECKED,   // 網路服務中斷
      equipmentLost: equipment.lost ? CHECK_CHECKED : CHECK_UNCHECKED,                        // 設備遺失
      systemServiceAnomaly: equipment.serviceAnomaly ? CHECK_CHECKED : CHECK_UNCHECKED,       // 系統服務異常/執行緩慢

      // ========== Step 3 - 影響等級評估 ==========
      // Step 3 - 機密性衝擊（單選 1-4 級或無資料遭洩漏）
      confidentialityLevel: step3.confidentiality?.levelDescription || '無',
      confidentialityJustification: step3.confidentiality?.justification || '',
      confidentialityLevel4: step3.confidentiality?.level === 4 ? RADIO_CHECKED : RADIO_UNCHECKED,   // (4級)
      confidentialityLevel3: step3.confidentiality?.level === 3 ? RADIO_CHECKED : RADIO_UNCHECKED,   // (3級)
      confidentialityLevel2: step3.confidentiality?.level === 2 ? RADIO_CHECKED : RADIO_UNCHECKED,   // (2級)
      confidentialityLevel1: step3.confidentiality?.level === 1 ? RADIO_CHECKED : RADIO_UNCHECKED,   // (1級)
      confidentialityLevelNone: step3.confidentiality?.level === 0 || !step3.confidentiality?.level ? RADIO_CHECKED : RADIO_UNCHECKED, // 無資料遭洩漏(無需通報)

      // Step 3 - 完整性衝擊（單選 1-4 級或無系統或資料遭竄改）
      integrityLevel: step3.integrity?.levelDescription || '無',
      integrityJustification: step3.integrity?.justification || '',
      integrityLevel4: step3.integrity?.level === 4 ? RADIO_CHECKED : RADIO_UNCHECKED,   // (4級)
      integrityLevel3: step3.integrity?.level === 3 ? RADIO_CHECKED : RADIO_UNCHECKED,   // (3級)
      integrityLevel2: step3.integrity?.level === 2 ? RADIO_CHECKED : RADIO_UNCHECKED,   // (2級)
      integrityLevel1: step3.integrity?.level === 1 ? RADIO_CHECKED : RADIO_UNCHECKED,   // (1級)
      integrityLevelNone: step3.integrity?.level === 0 || !step3.integrity?.level ? RADIO_CHECKED : RADIO_UNCHECKED, // 無系統或資料遭竄改(無需通報)

      // Step 3 - 可用性衝擊（單選 1-4 級或無系統或設備運作受影響）
      availabilityLevel: step3.availability?.levelDescription || '無',
      availabilityJustification: step3.availability?.justification || '',
      availabilityLevel4: step3.availability?.level === 4 ? RADIO_CHECKED : RADIO_UNCHECKED,   // (4級)
      availabilityLevel3: step3.availability?.level === 3 ? RADIO_CHECKED : RADIO_UNCHECKED,   // (3級)
      availabilityLevel2: step3.availability?.level === 2 ? RADIO_CHECKED : RADIO_UNCHECKED,   // (2級)
      availabilityLevel1: step3.availability?.level === 1 ? RADIO_CHECKED : RADIO_UNCHECKED,   // (1級)
      availabilityLevelNone: step3.availability?.level === 0 || !step3.availability?.level ? RADIO_CHECKED : RADIO_UNCHECKED, // 無系統或設備運作受影響

      // Step 3 - 整體影響等級
      overallLevelDescription: step3.overallLevelDescription || '',
      overallLevel: step3.overallLevel || 0,

      // ========== Step 4 - 是否需要外部支援 ==========
      needSupport: step4.needSupport ? '是' : '否',
      needSupportYes: step4.needSupport ? RADIO_CHECKED : RADIO_UNCHECKED,
      needSupportNo: step4.needSupport ? RADIO_UNCHECKED : RADIO_CHECKED,
      supportContent: step4.supportContent || '',

      // ========== Step 5 - 應變處置階段 ==========
      // Step 5 - 保留受害期間之相關設備紀錄資料

      // 已保存遭受害主機事件紀錄檔
      hostEventLogRetained: records.hostEventLog?.retained ? CHECK_CHECKED : CHECK_UNCHECKED,
      hostEventLogDuration: records.hostEventLog?.duration || '',
      hostEventLogDuration1M: records.hostEventLog?.duration === '1個月' ? RADIO_CHECKED : RADIO_UNCHECKED,           // 1個月
      hostEventLogDuration1to6M: records.hostEventLog?.duration === '1-6個月' ? RADIO_CHECKED : RADIO_UNCHECKED,      // 1-6個月
      hostEventLogDuration6MPlus: records.hostEventLog?.duration === '6個月以上' ? RADIO_CHECKED : RADIO_UNCHECKED,   // 6個月以上
      hostEventLogDurationOther: (records.hostEventLog?.duration && !['1個月', '1-6個月', '6個月以上'].includes(records.hostEventLog?.duration)) ? RADIO_CHECKED : RADIO_UNCHECKED, // 其他

      // 已保存防火牆紀錄
      firewallLogRetained: records.firewallLog?.retained ? CHECK_CHECKED : CHECK_UNCHECKED,
      firewallLogDuration: records.firewallLog?.duration || '',
      firewallLogDuration1M: records.firewallLog?.duration === '1個月' ? RADIO_CHECKED : RADIO_UNCHECKED,           // 1個月
      firewallLogDuration1to6M: records.firewallLog?.duration === '1-6個月' ? RADIO_CHECKED : RADIO_UNCHECKED,      // 1-6個月
      firewallLogDuration6MPlus: records.firewallLog?.duration === '6個月以上' ? RADIO_CHECKED : RADIO_UNCHECKED,   // 6個月以上
      firewallLogDurationOther: (records.firewallLog?.duration && !['1個月', '1-6個月', '6個月以上'].includes(records.firewallLog?.duration)) ? RADIO_CHECKED : RADIO_UNCHECKED, // 其他

      // 已保存網站日誌檔
      websiteLogRetained: records.websiteLog?.retained ? CHECK_CHECKED : CHECK_UNCHECKED,
      websiteLogDuration: records.websiteLog?.duration || '',
      websiteLogDuration1M: records.websiteLog?.duration === '1個月' ? RADIO_CHECKED : RADIO_UNCHECKED,           // 1個月
      websiteLogDuration1to6M: records.websiteLog?.duration === '1-6個月' ? RADIO_CHECKED : RADIO_UNCHECKED,      // 1-6個月
      websiteLogDuration6MPlus: records.websiteLog?.duration === '6個月以上' ? RADIO_CHECKED : RADIO_UNCHECKED,   // 6個月以上
      websiteLogDurationOther: (records.websiteLog?.duration && !['1個月', '1-6個月', '6個月以上'].includes(records.websiteLog?.duration)) ? RADIO_CHECKED : RADIO_UNCHECKED, // 其他

      // 已保存未授權存在之惡意網頁/留言/檔案/程式樣本
      maliciousSamplesRetained: records.maliciousSamples?.retained ? CHECK_CHECKED : CHECK_UNCHECKED,
      maliciousSamplesCount: records.maliciousSamples?.count || 0,

      // 其他保留資料或資料處置說明
      otherRecordsChecked: records.otherRecords ? CHECK_CHECKED : CHECK_UNCHECKED,
      otherRecords: records.otherRecords || '',

      // Step 5 - 事件分析與影響評估
      // 異常連線行為為【請列出異常IP與異常連線，如：存取後台管理頁面】
      abnormalConnectionsChecked: analysis.abnormalConnections ? CHECK_CHECKED : CHECK_UNCHECKED,
      abnormalConnections: analysis.abnormalConnections || '',

      // 異常帳號使用【請列出帳號並說帳號權限，與判別準則，如：非上班時間帳號異常登入/登出】
      abnormalAccountUsageChecked: analysis.abnormalAccountUsage ? CHECK_CHECKED : CHECK_UNCHECKED,
      abnormalAccountUsage: analysis.abnormalAccountUsage || '',

      // 清查網頁目錄內容，網站內存在未授權之程式/檔案【請說明程式名稱或路徑、檔名】
      unauthorizedFilesChecked: analysis.unauthorizedFiles ? CHECK_CHECKED : CHECK_UNCHECKED,
      unauthorizedFiles: analysis.unauthorizedFiles || '',

      // 網站資料庫內容遭竄改
      databaseTamperingChecked: analysis.databaseTampering ? CHECK_CHECKED : CHECK_UNCHECKED,
      databaseTampering: analysis.databaseTampering || '',

      // 發現資料外洩情況【如：異常打包資料，請說明外洩資料類型/欄位與筆數，如：個人資料/機密性資料/非機敏性資料】
      dataLeakDetailsChecked: analysis.dataLeakDetails ? CHECK_CHECKED : CHECK_UNCHECKED,
      dataLeakDetails: analysis.dataLeakDetails || '',

      // 影響評估補充說明【請填寫補充說明】
      additionalAssessmentChecked: analysis.additionalAssessment ? CHECK_CHECKED : CHECK_UNCHECKED,
      additionalAssessment: analysis.additionalAssessment || '',

      // Step 5 - 封鎖、根除及復原
      removedMaliciousFiles: cont.removedMaliciousFiles?.removed ? CHECK_CHECKED : CHECK_UNCHECKED,
      removedMaliciousFilesCount: cont.removedMaliciousFiles?.count || 0,
      removedMaliciousFilesDetails: cont.removedMaliciousFiles?.details || '',
      blockedIPsChecked: cont.blockedIPs?.blocked ? CHECK_CHECKED : CHECK_UNCHECKED,
      blockedIPs: cont.blockedIPs?.ipList?.join(', ') || '',
      blockingDevice: cont.blockedIPs?.blockingDevice || '',
      disabledAccountsChecked: cont.disabledAccounts?.disabled ? CHECK_CHECKED : CHECK_UNCHECKED,
      disabledAccounts: cont.disabledAccounts?.accountList?.join(', ') || '',
      removedLeakedData: cont.removedLeakedData ? CHECK_CHECKED : CHECK_UNCHECKED,
      notifiedParties: cont.notifiedParties ? CHECK_CHECKED : CHECK_UNCHECKED,
      disconnectedHost: cont.disconnectedHost ? CHECK_CHECKED : CHECK_UNCHECKED,
      requestedSearchEngineRemoval: cont.requestedSearchEngineRemoval ? CHECK_CHECKED : CHECK_UNCHECKED,
      searchEngineGoogle: cont.searchEngines?.google ? CHECK_CHECKED : CHECK_UNCHECKED,
      searchEngineYahoo: cont.searchEngines?.yahoo ? CHECK_CHECKED : CHECK_UNCHECKED,
      searchEngineYam: cont.searchEngines?.yam ? CHECK_CHECKED : CHECK_UNCHECKED,
      searchEngineBing: cont.searchEngines?.bing ? CHECK_CHECKED : CHECK_UNCHECKED,
      searchEngineHinet: cont.searchEngines?.hinet ? CHECK_CHECKED : CHECK_UNCHECKED,
      searchEngineOther: cont.searchEngines?.other || '',
      codeReviewCompleted: cont.codeReview?.completed ? CHECK_CHECKED : CHECK_UNCHECKED,
      codeReviewCompletionDate: cont.codeReview?.completionDate || '',
      systemRebuildCompleted: cont.systemRebuild?.completed ? CHECK_CHECKED : CHECK_UNCHECKED,
      systemRebuildCompletionDate: cont.systemRebuild?.completionDate || '',
      additionalMeasures: cont.additionalMeasures || '',

      // Step 5 - 應變處置綜整說明【請說明損害控制或復原之執行狀況】
      responseSummary: step5.responseSummary || '',

      // 是否已完成損害控制或復原（單選）
      recoveryStatus: step5.recoveryStatus || '',
      recoveryStatusNo: step5.recoveryStatus === '尚未完成' ? RADIO_CHECKED : RADIO_UNCHECKED,                           // 否，尚未完成損害控制或復原
      recoveryStatusControlOnly: step5.recoveryStatus === '已完成損害控制' ? RADIO_CHECKED : RADIO_UNCHECKED,            // 是，已完成損害控制
      recoveryStatusFullRecovery: step5.recoveryStatus === '已完成損害控制與復原' ? RADIO_CHECKED : RADIO_UNCHECKED,     // 是，已完成損害控制與復原

      // 完成損害控制或復原時間：____年____月____日____時____分
      recoveryTime: step5.recoveryTime || '',
      recoveryTimeYear: step5.recoveryTimeDetails?.year || '',
      recoveryTimeMonth: step5.recoveryTimeDetails?.month || '',
      recoveryTimeDay: step5.recoveryTimeDetails?.day || '',
      recoveryTimeHour: step5.recoveryTimeDetails?.hour || '',
      recoveryTimeMinute: step5.recoveryTimeDetails?.minute || '',

      // ========== Step 6 - 結報階段 ==========
      // Step 6 - 受駭資訊設備數量
      computerCount: devices.computers || 0,
      serverCount: devices.servers || 0,
      otherDeviceType: devices.otherDeviceType || '',
      otherDeviceCount: devices.otherDeviceCount || 0,

      // Step 6 - 網路資訊
      externalIPs: net.externalIPs?.join(', ') || '',
      internalIPs: net.internalIPs?.join(', ') || '',
      affectedURLs: net.affectedURLs?.join(', ') || '',

      // Step 6 - 系統資訊
      osType: sys.osType || '',
      osVersion: sys.osVersion || '',
      ismsCompliant: sys.ismsCompliant ? '是' : '否',
      ismsCompliantYes: sys.ismsCompliant ? RADIO_CHECKED : RADIO_UNCHECKED,
      ismsCompliantNo: sys.ismsCompliant ? RADIO_UNCHECKED : RADIO_CHECKED,
      mainSystemVendor: sys.mainSystemVendor || '',
      systemBuilder: sys.systemBuilder || '',

      // Step 6 - SOC 資訊
      hasSOC: soc.hasSOC ? '有' : '無',
      hasSOCYes: soc.hasSOC ? RADIO_CHECKED : RADIO_UNCHECKED,
      hasSOCNo: soc.hasSOC ? RADIO_UNCHECKED : RADIO_CHECKED,
      socType: soc.socType || '',
      socVendor: soc.socVendor || '',
      inSOCScope: soc.inSOCScope ? '是' : '否',
      inSOCScopeYes: soc.inSOCScope ? RADIO_CHECKED : RADIO_UNCHECKED,
      inSOCScopeNo: soc.inSOCScope ? RADIO_UNCHECKED : RADIO_CHECKED,
      socAlertReceived: soc.socAlertReceived ? '是' : '否',
      socAlertReceivedYes: soc.socAlertReceived ? RADIO_CHECKED : RADIO_UNCHECKED,
      socAlertReceivedNo: soc.socAlertReceived ? RADIO_UNCHECKED : RADIO_CHECKED,
      alertId: soc.alertId || '',

      // Step 6 - 事件發生原因
      rootCause: root.category || '',
      rootCauseDetail: root.categoryDetail || '',
      isVendorFault: root.isVendorFault ? '是' : '否',
      isVendorFaultYes: root.isVendorFault ? RADIO_CHECKED : RADIO_UNCHECKED,
      isVendorFaultNo: root.isVendorFault ? RADIO_UNCHECKED : RADIO_CHECKED,
      vendorName: root.vendorName || '',
      investigationDetails: root.investigationDetails || '',

      // Step 6 - 補強措施（系統/程式安全設定）
      passwordChangeEvaluated: secSys.passwordChangeEvaluated ? CHECK_CHECKED : CHECK_UNCHECKED,
      hostPasswordChangeEvaluated: secSys.hostPasswordChangeEvaluated ? CHECK_CHECKED : CHECK_UNCHECKED,
      systemUpdated: secSys.systemUpdated ? CHECK_CHECKED : CHECK_UNCHECKED,
      updateDetails: secSys.updateDetails || '',

      // Step 6 - 補強措施（資安管理與教育訓練）
      networkArchitectureReviewed: mgmt.networkArchitectureReviewed ? CHECK_CHECKED : CHECK_UNCHECKED,
      internalSecurityTest: mgmt.internalSecurityTest ? CHECK_CHECKED : CHECK_UNCHECKED,
      securityTraining: mgmt.securityTraining ? CHECK_CHECKED : CHECK_UNCHECKED,
      securityPlanRevised: mgmt.securityPlanRevised ? CHECK_CHECKED : CHECK_UNCHECKED,
      otherRemediationMeasures: rem.otherMeasures || '',

      // Step 6 - 資安人員與結報時間
      securityPersonnelName: personnel.name || '',
      securityPersonnelTitle: personnel.title || '',
      closureTime: step6.closureTime || '',

      // 其他
      ...reportData
    };
  }
}

module.exports = WordReportService;

