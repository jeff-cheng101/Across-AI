// backend/routes/checkpoint.routes.js
// Check Point 防火牆產品專屬 API 路由

const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const { elkMCPClient } = require('../services/elkMCPClient');
const CheckpointRiskServices = require('../services/products/CheckpointRiskServices');
const checkpointELKConfig = require('../config/products/checkpoint/checkpointELKConfig');

const { LLM_API_KEY, LLM_PROVIDER, LLM_SERVICE_URL, LLM_MODEL } = process.env;

// 測試 Check Point ELK 連接
router.get('/test-connection', async (_, res) => {
  try {
    const isConnected = await elkMCPClient.testConnection();
    res.json({
      connected: isConnected,
      product: 'CheckPoint',
      productDisplayName: 'Check Point Firewall',
      index: checkpointELKConfig.index,
      message: isConnected
        ? 'Check Point ELK 連接正常'
        : 'Check Point ELK 連接失敗',
    });
  } catch (error) {
    res.status(500).json({
      connected: false,
      product: 'CheckPoint',
      productDisplayName: 'Check Point Firewall',
      error: error.message,
    });
  }
});

// Check Point 防火牆風險分析 API（主要端點）
router.post('/analyze-risks', async (req, res) => {
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
        product: 'CheckPoint',
        productDisplayName: 'Check Point Firewall',
      });
    }

    console.log(`\n🔍 ===== 開始 Check Point 防火牆風險分析 API =====`);
    console.log(`📅 時間範圍: ${timeRange}`);
    console.log(`🤖 AI 提供者: ${provider}`);
    console.log(`🤖 AI 模型: ${model}`);
    console.log(`📊 索引: ${checkpointELKConfig.index}`);
    console.log(`🔧 判斷模型: 三層判斷系統（應用風險 + 封鎖流量 + 政策違規）`);

    // Step 1: 建立 CheckpointRiskServices 實例
    const checkpointService = new CheckpointRiskServices();

    // Step 2: 透過 ELK MCP 分析 Check Point 日誌
    console.log('\n⭐ Step 1: 透過 ELK MCP 分析 Check Point 日誌...');
    const analysisData = await checkpointService.analyzeCheckPoint(timeRange);

    console.log(`✅ 分析完成，總事件數: ${analysisData.totalEvents}`);
    console.log(`   真實威脅數: ${analysisData.realThreats}`);
    console.log(`   確定攻擊數: ${analysisData.realAttacks}`);
    console.log(
      `   Layer 1 (被封鎖流量): ${analysisData.layerStats.FIREWALL_ACTION || 0}`,
    );
    console.log(
      `   Layer 2 (高風險應用): ${analysisData.layerStats.APP_RISK_ASSESSMENT || 0}`,
    );
    console.log(
      `   Layer 3 (政策違規): ${analysisData.layerStats.POLICY_VIOLATION || 0}`,
    );
    console.log(
      `   Layer 4 (可疑行為): ${analysisData.layerStats.COMBINED_ANALYSIS || 0}`,
    );

    // Step 3: 生成 AI Prompt
    console.log('\n⭐ Step 2: 生成 AI 分析 Prompt...');
    const aiPrompt = checkpointService.generateAIPrompt(analysisData);
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
      console.time(`⏱️ 開始呼叫 ${provider} API...`);

      const completion = await openai.chat.completions.create(
        {
          model: model,
          messages: [
            {
              role: 'system',
              content:
                '你是個資安專家，專精於分析 Check Point 防火牆日誌和威脅識別。請根據提供的日誌資料，分析潛在的安全風險。',
            },
            {
              role: 'user',
              content: aiPrompt,
            },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.7,
          max_tokens: 8192,
        },
        { signal: controller.signal },
      );

      clearTimeout(timeoutId);
      console.timeEnd(`⏱️ ${provider} API 回應時間`);

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
          checkpointService.generateFallbackRisks(analysisData);
        return res.json({
          success: true,
          product: 'CheckPoint',
          productDisplayName: 'Check Point Firewall',
          risks: aiAnalysisFallback.risks || [],
          metadata: {
            totalEvents: analysisData.totalEvents,
            realThreats: analysisData.realThreats,
            realAttacks: analysisData.realAttacks,
            timeRange: analysisData.timeRange,
            layerStats: analysisData.layerStats,
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
          aiAnalysis = checkpointService.generateFallbackRisks(analysisData);
        }
      } else {
        console.log('❌ 無法找到 JSON 格式，使用 Fallback 資料');
        aiAnalysis = checkpointService.generateFallbackRisks(analysisData);
      }
    }

    console.log('\n✅ ===== Check Point 防火牆風險分析完成 =====\n');

    // 返回結果
    res.json({
      success: true,
      product: 'CheckPoint',
      productDisplayName: 'Check Point Firewall',
      risks: aiAnalysis.risks || [],
      metadata: {
        totalEvents: analysisData.totalEvents,
        realThreats: analysisData.realThreats,
        realAttacks: analysisData.realAttacks,
        timeRange: analysisData.timeRange,
        layerStats: analysisData.layerStats,
        judgmentModel: '三層判斷系統',
        layers: {
          layer1: 'FIREWALL_ACTION (被封鎖流量)',
          layer2: 'APP_RISK_ASSESSMENT (應用風險評估)',
          layer3: 'POLICY_VIOLATION (政策違規)',
          layer4: 'COMBINED_ANALYSIS (多因素分析)',
        },
        aiProvider: provider,
        model: model,
        analysisTimestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('❌ Check Point 防火牆風險分析失敗:', error);
    res.status(500).json({
      success: false,
      product: 'CheckPoint',
      productDisplayName: 'Check Point Firewall',
      error: '防火牆風險分析失敗',
      details: error.message,
    });
  }
});

// 取得 Check Point 操作指引（預留端點，待實現）
router.post('/get-operation-guide', async (req, res) => {
  try {
    const { recommendationTitle, category } = req.body;

    console.log(`\n📚 ===== 取得 Check Point 操作指引 =====`);
    console.log(`📝 建議標題: ${recommendationTitle}`);
    console.log(`🏷️ 分類: ${category || '未提供'}`);

    // TODO: 實現 Check Point 操作指引
    // 目前返回提示訊息
    console.log(`⚠️ Check Point 操作指引功能尚未實現`);

    res.json({
      success: false,
      product: 'CheckPoint',
      productDisplayName: 'Check Point Firewall',
      message: 'Check Point 操作指引功能尚未實現',
      note: '此功能將在未來版本中提供',
    });
  } catch (error) {
    console.error('❌ 取得 Check Point 操作指引失敗:', error);
    res.status(500).json({
      success: false,
      product: 'CheckPoint',
      productDisplayName: 'Check Point Firewall',
      error: '取得操作指引失敗',
      details: error.message,
    });
  }
});

// 取得 Check Point 統計資訊（額外端點）
router.get('/stats', async (req, res) => {
  try {
    const { timeRange = '24h' } = req.query;

    console.log(`\n📊 ===== 取得 Check Point 統計資訊 =====`);
    console.log(`📅 時間範圍: ${timeRange}`);

    // 建立服務實例
    const checkpointService = new CheckpointRiskServices();

    // 執行分析（不需要 AI）
    const analysisData = await checkpointService.analyzeCheckPoint(timeRange);

    console.log(`✅ 統計資訊取得完成`);
    console.log(`   總事件數: ${analysisData.totalEvents}`);
    console.log(`   真實威脅數: ${analysisData.realThreats}`);
    console.log(`   被封鎖流量: ${analysisData.blockedTraffic.count}`);
    console.log(`   高風險應用: ${analysisData.highRiskApps.count}`);
    console.log(`   政策違規: ${analysisData.policyViolations.count}`);

    res.json({
      success: true,
      product: 'CheckPoint',
      productDisplayName: 'Check Point Firewall',
      stats: {
        totalEvents: analysisData.totalEvents,
        realThreats: analysisData.realThreats,
        realAttacks: analysisData.realAttacks,
        blockedTraffic: {
          total: analysisData.blockedTraffic.count,
          drop: analysisData.blockedTraffic.drop,
          reject: analysisData.blockedTraffic.reject,
        },
        highRiskApps: {
          total: analysisData.highRiskApps.count,
          critical: analysisData.highRiskApps.critical,
          high: analysisData.highRiskApps.high,
        },
        policyViolations: {
          total: analysisData.policyViolations.count,
          critical: analysisData.policyViolations.critical,
          high: analysisData.policyViolations.high,
          medium: analysisData.policyViolations.medium,
        },
        suspiciousBehavior: {
          total: analysisData.suspiciousBehavior.count,
        },
        zoneRisks: {
          total: analysisData.zoneRisks.count,
        },
        topCountries: analysisData.geoAnalysis.topCountries.slice(0, 5),
        topIPs: analysisData.geoAnalysis.topIPs.slice(0, 5),
        topApps: analysisData.appAnalysis.topApps.slice(0, 5),
        timeRange: analysisData.timeRange,
        layerStats: analysisData.layerStats,
      },
    });
  } catch (error) {
    console.error('❌ 取得 Check Point 統計資訊失敗:', error);
    res.status(500).json({
      success: false,
      product: 'CheckPoint',
      productDisplayName: 'Check Point Firewall',
      error: '取得統計資訊失敗',
      details: error.message,
    });
  }
});

module.exports = router;
