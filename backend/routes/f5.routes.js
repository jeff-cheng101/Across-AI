// backend/routes/f5.routes.js
// F5 Advanced WAF 產品專屬 API 路由

const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const { elkMCPClient } = require('../services/elkMCPClient');
const F5WAFRiskService = require('../services/products/f5WAFRiskService');
const f5ELKConfig = require('../config/products/f5/f5ELKConfig');
const { logOpenAICompatibleRequest, logOpenAICompatibleResponse } = require('../utils/ollamaLogger');

const { LLM_API_KEY, LLM_PROVIDER, LLM_SERVICE_URL, LLM_MODEL } = process.env;

// 測試 F5 ELK 連接
router.get('/test-connection', async (_, res) => {
  try {
    const isConnected = await elkMCPClient.testConnection();
    res.json({
      connected: isConnected,
      product: 'F5',
      index: f5ELKConfig.index,
      message: isConnected ? 'F5 ELK 連接正常' : 'F5 ELK 連接失敗',
    });
  } catch (error) {
    res.status(500).json({
      connected: false,
      product: 'F5',
      error: error.message,
    });
  }
});

// ✅ 已移除 F5 stats 端點
// 原因: getSecurityStats() 使用了不存在的 elasticsearch_query MCP 工具
// 替代方案: 使用 POST /api/f5/analyze-waf-risks 進行完整的 WAF 風險分析

// F5 WAF 風險分析 API（主要端點）
router.post('/analyze-waf-risks', async (req, res) => {
  try {
    const { timeRange = '24h' } = req.body;

    // 從環境變數取得 LLM 配置
    const model = LLM_MODEL || 'gemini-2.0-flash-exp';
    const provider = LLM_PROVIDER || 'Gemini';
    const apiKey = LLM_API_KEY;
    const serviceUrl = LLM_SERVICE_URL;

    // 驗證必要配置
    if (!serviceUrl) {
      return res.status(400).json({
        error: '請先設定 LLM Service URL',
        product: 'F5',
      });
    }

    console.log(`\n🔍 ===== 開始 F5 WAF 風險分析 API =====`);
    console.log(`📅 時間範圍: ${timeRange}`);
    console.log(`🤖 AI 提供者: ${provider}`);
    console.log(`🤖 AI 模型: ${model}`);
    console.log(`📊 索引: ${f5ELKConfig.index}`);

    // Step 1: 建立 F5WAFRiskService 實例
    const wafService = new F5WAFRiskService();

    // Step 2: 透過 ELK MCP 分析 F5 WAF 資料
    console.log('\n⭐ Step 1: 透過 ELK MCP 分析 F5 日誌...');
    const analysisData = await wafService.analyzeF5WAF(timeRange);

    console.log(`✅ 分析完成，總事件數: ${analysisData.totalEvents}`);

    // Step 3: 生成 AI Prompt
    console.log('\n⭐ Step 2: 生成 AI 分析 Prompt...');
    const aiPrompt = wafService.generateAIPrompt(analysisData);
    console.log(`✅ Prompt 長度: ${aiPrompt.length} 字元`);

    // Step 4: 使用統一的 OpenAI API 呼叫 AI 進行分析
    console.log(`\n⭐ Step 3: 呼叫 ${provider} AI 分析...`);
    console.log(`🔗 API URL: ${serviceUrl}`);
    console.log(`📏 Prompt 長度: ${aiPrompt.length} 字元`);

    // 檢查 Prompt 長度（警告但不阻止）
    if (aiPrompt.length > 50000) {
      console.warn(
        `⚠️ Prompt 非常長 (${aiPrompt.length} 字元)，可能需要較長處理時間`,
      );
    }

    let responseText = '';

    /** @type {import("openai").default} */
    const openai = new OpenAI({
      baseURL: serviceUrl,
      apiKey: apiKey,
    });

    // 為所有 LLM 服務設定 5 分鐘超時
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      console.error(`❌ ${provider} 請求超時（5 分鐘）`);
    }, 300000); // 5 分鐘

    try {
      const startTime = Date.now();
      console.log(`⏱️ 開始呼叫 ${provider} API...`);

      // 構建請求參數
      const requestParams = {
        model: model,
        messages: [
          {
            role: 'system',
            content:
              '你是個資安專家，專精於分析 F5 WAF 日誌和威脅識別。請根據提供的日誌資料，分析潛在的安全風險。',
          },
          {
            role: 'user',
            content: aiPrompt,
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
        max_tokens: 8192,
      };

      // 📤 記錄完整請求訊息
      logOpenAICompatibleRequest(serviceUrl, requestParams);

      const completion = await openai.chat.completions.create(
        requestParams,
        { signal: controller.signal },
      );

      clearTimeout(timeoutId);
      const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(`⏱️ ${provider} API 回應時間: ${elapsedTime} 秒`);

      // 📥 記錄完整回應訊息
      logOpenAICompatibleResponse(completion, elapsedTime);

      responseText = completion.choices[0]?.message?.content || '';

      if (!responseText || responseText.trim().length === 0) {
        console.warn(`⚠️ ${provider} 返回空回應，使用 Fallback`);
        throw new Error(`${provider} 返回空回應`);
      }

      console.log(`✅ ${provider} 回應長度: ${responseText.length} 字元`);
    } catch (apiError) {
      clearTimeout(timeoutId);

      if (apiError.name === 'AbortError') {
        console.error(`❌ ${provider} 請求超時（5 分鐘），使用 Fallback 資料`);
        const aiAnalysisFallback =
          wafService.generateFallbackRisks(analysisData);
        return res.json({
          success: true,
          product: 'F5',
          risks: aiAnalysisFallback.risks || [],
          metadata: {
            totalEvents: analysisData.totalEvents,
            timeRange: analysisData.timeRange,
            aiProvider: 'fallback',
            model: 'N/A',
            analysisTimestamp: new Date().toISOString(),
            note: 'AI 分析超時，使用預設風險資料',
          },
        });
      }

      console.error(`❌ ${provider} API 呼叫失敗:`, apiError.message);
      throw apiError;
    }

    // Step 5: 解析 AI 回應（JSON 格式）
    console.log('\n⭐ Step 4: 解析 AI 回應...');
    let aiAnalysis;

    try {
      // 嘗試直接解析 JSON
      aiAnalysis = JSON.parse(responseText);
      console.log(
        `✅ 成功解析 JSON，風險數量: ${aiAnalysis.risks?.length || 0}`,
      );
    } catch (_parseError) {
      console.log('⚠️ JSON 解析失敗，嘗試提取 JSON...');

      // 嘗試從 markdown code block 中提取
      const jsonMatch =
        responseText.match(/```json\s*([\s\S]*?)\s*```/) ||
        responseText.match(/```\s*([\s\S]*?)\s*```/);

      if (jsonMatch) {
        try {
          aiAnalysis = JSON.parse(jsonMatch[1]);
          console.log(
            `✅ 從 markdown 中成功解析，風險數量: ${aiAnalysis.risks?.length || 0}`,
          );
        } catch (_e) {
          console.log('❌ 無法解析 AI 回應，使用 Fallback 資料');
          aiAnalysis = wafService.generateFallbackRisks(analysisData);
        }
      } else {
        console.log('❌ 無法找到 JSON 格式，使用 Fallback 資料');
        aiAnalysis = wafService.generateFallbackRisks(analysisData);
      }
    }

    console.log('\n✅ ===== F5 WAF 風險分析完成 =====\n');

    // 返回結果
    res.json({
      success: true,
      product: 'F5',
      risks: aiAnalysis.risks || [],
      metadata: {
        totalEvents: analysisData.totalEvents,
        timeRange: analysisData.timeRange,
        aiProvider: provider,
        model: model,
        analysisTimestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('❌ F5 WAF 風險分析失敗:', error);
    res.status(500).json({
      success: false,
      product: 'F5',
      error: 'WAF 風險分析失敗',
      details: error.message,
    });
  }
});

// 取得 F5 操作指引
router.post('/get-operation-guide', async (req, res) => {
  try {
    const { recommendationTitle, category } = req.body;

    console.log(`\n📚 ===== 取得 F5 操作指引 =====`);
    console.log(`📝 建議標題: ${recommendationTitle}`);
    console.log(`🏷️ 分類: ${category || '未提供'}`);

    // 載入 F5 操作指引模組
    const {
      F5_OPERATION_GUIDES,
      mapRecommendationToGuideId,
    } = require('../config/products/f5/f5OperationGuides');

    // 根據建議標題或分類，找到對應的操作指引 ID
    const guideId = mapRecommendationToGuideId(recommendationTitle, category);

    if (!guideId) {
      console.log(`⚠️ 找不到對應的操作指引`);
      return res.json({
        success: false,
        message: '找不到對應的操作指引',
        product: 'F5',
      });
    }

    console.log(`✅ 找到對應的操作指引 ID: ${guideId}`);

    // 取得操作指引
    const guide = F5_OPERATION_GUIDES[guideId];

    if (!guide) {
      console.log(`❌ 操作指引不存在: ${guideId}`);
      return res.json({
        success: false,
        message: '操作指引不存在',
        product: 'F5',
      });
    }

    console.log(`✅ 操作指引載入成功`);
    console.log(`   標題: ${guide.title}`);
    console.log(`   步驟數量: ${guide.steps.length}`);
    console.log(`   預估時間: ${guide.estimatedTime}`);
    console.log(`\n✅ ===== F5 操作指引取得完成 =====\n`);

    res.json({
      success: true,
      product: 'F5',
      guide: guide,
    });
  } catch (error) {
    console.error('❌ 取得 F5 操作指引失敗:', error);
    res.status(500).json({
      success: false,
      product: 'F5',
      error: '取得操作指引失敗',
      details: error.message,
    });
  }
});

module.exports = router;
