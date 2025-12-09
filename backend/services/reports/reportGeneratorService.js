// backend/services/reports/reportGeneratorService.js
// 報告生成核心服務 - 負責協調 AI 分析結果轉譯與報告生成

const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

class ReportGeneratorService {
  constructor() {
    this.promptTemplatePath = path.join(__dirname, '../../prompts/security-report-generation-prompt.md');
  }

  /**
   * 載入報告轉譯 Prompt 模板
   */
  loadPromptTemplate() {
    try {
      const template = fs.readFileSync(this.promptTemplatePath, 'utf-8');
      return template;
    } catch (error) {
      console.error('❌ 無法載入報告 Prompt 模板:', error.message);
      throw new Error('報告 Prompt 模板載入失敗');
    }
  }

  /**
   * 建構完整的報告生成 Prompt
   * @param {Object} analysisData - AI 分析結果
   * @param {Object} metadata - 分析元資料
   */
  buildReportPrompt(analysisData, metadata) {
    let template = this.loadPromptTemplate();

    // 計算風險統計
    const risks = analysisData.risks || [];
    const criticalCount = risks.filter(r => r.severity === 'critical').length;
    const highCount = risks.filter(r => r.severity === 'high').length;
    const mediumCount = risks.filter(r => r.severity === 'medium').length;
    const lowCount = risks.filter(r => r.severity === 'low').length;
    const totalAffectedAssets = risks.reduce((sum, r) => sum + (r.affectedAssets || 0), 0);

    // 時間範圍處理
    const timeRange = metadata.timeRange || {};
    const timeRangeStart = timeRange.start || timeRange.display?.start || '未知';
    const timeRangeEnd = timeRange.end || timeRange.display?.end || '未知';

    // 替換模板變數
    const replacements = {
      '{{analysisData}}': JSON.stringify(analysisData, null, 2),
      '{{timeRangeStart}}': timeRangeStart,
      '{{timeRangeEnd}}': timeRangeEnd,
      '{{totalEvents}}': String(metadata.totalEvents || 0),
      '{{platform}}': metadata.platform || 'unknown',
      '{{criticalCount}}': String(criticalCount),
      '{{highCount}}': String(highCount),
      '{{mediumCount}}': String(mediumCount),
      '{{lowCount}}': String(lowCount),
      '{{totalAffectedAssets}}': String(totalAffectedAssets)
    };

    for (const [placeholder, value] of Object.entries(replacements)) {
      template = template.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), value);
    }

    return template;
  }

  /**
   * 呼叫 AI 生成報告結構化資料（第二階段 AI）
   * @param {string} prompt - 完整的 Prompt
   * @param {Object} aiConfig - AI 配置 { provider, apiKey, model }
   */
  async generateReportData(prompt, aiConfig) {
    const { provider = 'gemini', apiKey, model = 'gemini-2.0-flash-exp' } = aiConfig;

    console.log(`\n📝 ===== 開始報告資料生成（第二階段 AI）=====`);
    console.log(`🤖 AI 提供者: ${provider}`);
    console.log(`🤖 AI 模型: ${model}`);
    console.log(`📏 Prompt 長度: ${prompt.length} 字元`);

    let responseText;

    if (provider === 'ollama') {
      // 使用 Ollama
      const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
      const ollamaModel = model || 'twister_llama33:latest';

      console.log(`🦙 Ollama URL: ${ollamaUrl}`);
      console.log(`🦙 Ollama 模型: ${ollamaModel}`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        console.error('❌ Ollama 請求超時（5 分鐘）');
      }, 300000);

      try {
        const startTime = Date.now();
        console.log('⏱️ 開始呼叫 Ollama API...');

        const ollamaResponse = await fetch(`${ollamaUrl}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: ollamaModel,
            prompt: prompt,
            stream: false,
            options: {
              temperature: 0.3,  // 報告生成使用較低溫度以確保一致性
              num_predict: 16384,
              num_ctx: 16384,
              top_k: 40,
              top_p: 0.9
            }
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);
        const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`⏱️ Ollama API 回應時間: ${elapsedTime} 秒`);

        if (!ollamaResponse.ok) {
          let errorDetails = '';
          try {
            const errorData = await ollamaResponse.json();
            errorDetails = errorData.error || JSON.stringify(errorData);
          } catch (e) {
            errorDetails = await ollamaResponse.text();
          }
          throw new Error(`Ollama API 錯誤 (${ollamaResponse.status}): ${errorDetails}`);
        }

        const ollamaData = await ollamaResponse.json();
        responseText = ollamaData.response;
        console.log(`✅ Ollama 回應長度: ${responseText.length} 字元`);

      } catch (fetchError) {
        clearTimeout(timeoutId);
        if (fetchError.name === 'AbortError') {
          throw new Error('Ollama 請求超時（5 分鐘）');
        }
        throw fetchError;
      }

    } else {
      // 使用 Gemini
      if (!apiKey) {
        throw new Error('請提供 Gemini API Key');
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const geminiModel = genAI.getGenerativeModel({ model });

      console.log('⏱️ 開始呼叫 Gemini API...');
      const startTime = Date.now();

      const result = await geminiModel.generateContent(prompt);
      responseText = result.response.text();

      const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(`⏱️ Gemini API 回應時間: ${elapsedTime} 秒`);
      console.log(`✅ Gemini 回應長度: ${responseText.length} 字元`);
    }

    // 解析 JSON 回應
    console.log('\n⭐ 解析 AI 回應...');
    let reportData;

    try {
      // 嘗試直接解析
      reportData = JSON.parse(responseText);
      console.log('✅ 成功直接解析 JSON');
    } catch (parseError) {
      console.log('⚠️ 直接解析失敗，嘗試提取 JSON...');

      // 嘗試從 markdown code block 中提取
      const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) ||
                        responseText.match(/```\s*([\s\S]*?)\s*```/) ||
                        responseText.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        try {
          reportData = JSON.parse(jsonStr);
          console.log('✅ 從 markdown 中成功解析 JSON');
        } catch (e) {
          console.error('❌ JSON 解析失敗:', e.message);
          throw new Error('AI 回應格式錯誤，無法解析為 JSON');
        }
      } else {
        console.error('❌ 無法找到有效的 JSON 格式');
        throw new Error('AI 回應中未找到有效的 JSON 資料');
      }
    }

    console.log('\n✅ ===== 報告資料生成完成 =====\n');
    return reportData;
  }

  /**
   * 合併 AI 生成的報告資料與用戶提供的資料
   * @param {Object} aiReportData - AI 生成的報告資料
   * @param {Object} userProvidedData - 用戶提供的基本資料
   */
  mergeReportData(aiReportData, userProvidedData) {
    const merged = { ...aiReportData };

    // 合併 Step1 基本資料（用戶提供）
    merged.step1_basicInfo = {
      reportTime: new Date().toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).replace(/\//g, '年').replace(',', '日').replace(':', '時') + '分',
      organizationName: userProvidedData.organizationName || '',
      reviewOrganization: userProvidedData.reviewOrganization || '',
      reporterName: userProvidedData.reporterName || '',
      phone: userProvidedData.phone || '',
      fax: userProvidedData.fax || '',
      email: userProvidedData.email || '',
      isProxy: userProvidedData.isProxy || false,
      proxyOrganization: userProvidedData.proxyOrganization || '',
      investigationVendor: userProvidedData.investigationVendor || ''
    };

    // 合併 Step6 結案資料中的用戶資料
    if (merged.step6_closureReport) {
      merged.step6_closureReport.systemInfo = {
        ...merged.step6_closureReport.systemInfo,
        mainSystemVendor: userProvidedData.mainSystemVendor || merged.step6_closureReport.systemInfo?.mainSystemVendor || '',
        systemBuilder: userProvidedData.systemBuilder || merged.step6_closureReport.systemInfo?.systemBuilder || ''
      };

      merged.step6_closureReport.socInfo = {
        ...merged.step6_closureReport.socInfo,
        socVendor: userProvidedData.socVendor || merged.step6_closureReport.socInfo?.socVendor || ''
      };

      merged.step6_closureReport.securityPersonnel = {
        name: userProvidedData.securityPersonName || '',
        title: userProvidedData.securityPersonTitle || ''
      };
    }

    return merged;
  }

  /**
   * 完整的報告生成流程
   * @param {Object} analysisData - AI 分析結果
   * @param {Object} metadata - 分析元資料
   * @param {Object} userProvidedData - 用戶提供的基本資料
   * @param {Object} aiConfig - AI 配置
   */
  async generateFullReport(analysisData, metadata, userProvidedData, aiConfig) {
    try {
      console.log('\n🚀 ===== 開始完整報告生成流程 =====');

      // Step 1: 建構 Prompt
      console.log('\n📋 Step 1: 建構報告生成 Prompt...');
      const prompt = this.buildReportPrompt(analysisData, metadata);

      // Step 2: 呼叫 AI 生成報告資料
      console.log('\n🤖 Step 2: 呼叫 AI 生成報告結構化資料...');
      const aiReportData = await this.generateReportData(prompt, aiConfig);

      // Step 3: 合併用戶資料
      console.log('\n🔗 Step 3: 合併用戶提供的資料...');
      const completeReportData = this.mergeReportData(aiReportData, userProvidedData);

      console.log('\n✅ ===== 報告生成流程完成 =====\n');

      return {
        success: true,
        reportData: completeReportData
      };

    } catch (error) {
      console.error('\n❌ 報告生成流程失敗:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 驗證報告資料完整性
   * @param {Object} reportData - 報告資料
   */
  validateReportData(reportData) {
    const requiredSections = [
      'reportMetadata',
      'step2_eventProcess',
      'step3_impactAssessment',
      'step5_emergencyResponse',
      'step6_closureReport'
    ];

    const missingFields = [];

    for (const section of requiredSections) {
      if (!reportData[section]) {
        missingFields.push(section);
      }
    }

    if (missingFields.length > 0) {
      return {
        valid: false,
        missingFields
      };
    }

    return { valid: true };
  }
}

module.exports = ReportGeneratorService;

