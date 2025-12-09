// backend/routes/checkpoint.routes.js
// Check Point 防火牆產品專屬 API 路由

const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { elkMCPClient } = require('../services/elkMCPClient');
const CheckpointRiskServices = require('../services/products/CheckpointRiskServices');
const { CHECKPOINT_FIELD_MAPPING } = require('../config/products/checkpoint/chcekpointFieldMapping');
const checkpointELKConfig = require('../config/products/checkpoint/checkpointELKConfig');

// 測試 Check Point ELK 連接
router.get('/test-connection', async (req, res) => {
  try {
    const isConnected = await elkMCPClient.testConnection();
    res.json({ 
      connected: isConnected,
      product: 'CheckPoint',
      productDisplayName: 'Check Point Firewall',
      index: checkpointELKConfig.index,
      message: isConnected ? 'Check Point ELK 連接正常' : 'Check Point ELK 連接失敗'
    });
  } catch (error) {
    res.status(500).json({ 
      connected: false,
      product: 'CheckPoint',
      productDisplayName: 'Check Point Firewall',
      error: error.message 
    });
  }
});

// Check Point 防火牆風險分析 API（主要端點）
router.post('/analyze-risks', async (req, res) => {
  try {
    const { apiKey, model = 'gemini-2.0-flash-exp', timeRange = '24h', aiProvider = 'gemini' } = req.body;
    
    // 如果使用 Ollama，不需要 API Key
    if (aiProvider !== 'ollama' && !apiKey) {
      return res.status(400).json({ 
        error: '請先設定 Gemini API Key 或使用 Ollama',
        product: 'CheckPoint',
        productDisplayName: 'Check Point Firewall'
      });
    }

    console.log(`\n🔍 ===== 開始 Check Point 防火牆風險分析 API =====`);
    console.log(`📅 時間範圍: ${timeRange}`);
    console.log(`🤖 AI 提供者: ${aiProvider}`);
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
    console.log(`   Layer 1 (被封鎖流量): ${analysisData.layerStats.FIREWALL_ACTION || 0}`);
    console.log(`   Layer 2 (高風險應用): ${analysisData.layerStats.APP_RISK_ASSESSMENT || 0}`);
    console.log(`   Layer 3 (政策違規): ${analysisData.layerStats.POLICY_VIOLATION || 0}`);
    console.log(`   Layer 4 (可疑行為): ${analysisData.layerStats.COMBINED_ANALYSIS || 0}`);
    
    // Step 3: 生成 AI Prompt
    console.log('\n⭐ Step 2: 生成 AI 分析 Prompt...');
    const aiPrompt = checkpointService.generateAIPrompt(analysisData);
    console.log(`✅ Prompt 長度: ${aiPrompt.length} 字元`);
    
    // Step 4: 呼叫 AI 進行分析（支援 Gemini 和 Ollama）
    console.log(`\n⭐ Step 3: 呼叫 ${aiProvider === 'ollama' ? 'Ollama' : 'Gemini'} AI 分析...`);
    
    let responseText;
    
    if (aiProvider === 'ollama') {
      // 使用 Ollama（增強版：支援超時和錯誤處理）
      const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
      const ollamaModel = model || 'twister_llama33:latest';
      
      console.log(`🦙 Ollama URL: ${ollamaUrl}`);
      console.log(`🦙 Ollama 模型: ${ollamaModel}`);
      console.log(`📏 Prompt 長度: ${aiPrompt.length} 字元`);
      
      // 檢查 Prompt 長度（警告但不阻止）
      if (aiPrompt.length > 50000) {
        console.warn(`⚠️ Prompt 非常長 (${aiPrompt.length} 字元)，可能需要較長處理時間`);
      }
      
      // 設定超時控制器（5 分鐘超時）
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        console.error('❌ Ollama 請求超時（5 分鐘）');
      }, 300000); // 5 分鐘
      
      try {
        const startTime = Date.now();
        console.log('⏱️ 開始呼叫 Ollama API...');
        
        const ollamaResponse = await fetch(`${ollamaUrl}/api/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: ollamaModel,
            prompt: aiPrompt,
            stream: false,
            options: {
              temperature: 0.7,
              num_predict: 8192,  // 增加到 8192 tokens
              num_ctx: 8192,      // 增加 context window
              top_k: 40,
              top_p: 0.9,
              repeat_penalty: 1.1
            }
          }),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`⏱️ Ollama API 回應時間: ${elapsedTime} 秒`);
        
        if (!ollamaResponse.ok) {
          // 獲取詳細錯誤訊息
          let errorDetails = '';
          try {
            const errorData = await ollamaResponse.json();
            errorDetails = errorData.error || JSON.stringify(errorData);
          } catch (e) {
            errorDetails = await ollamaResponse.text();
          }
          
          console.error(`❌ Ollama API 錯誤詳情: ${errorDetails}`);
          throw new Error(`Ollama API 錯誤 (${ollamaResponse.status}): ${errorDetails}`);
        }
        
        const ollamaData = await ollamaResponse.json();
        responseText = ollamaData.response;
        console.log(`✅ Ollama 回應長度: ${responseText.length} 字元`);
        
        // 檢查回應是否為空
        if (!responseText || responseText.trim().length === 0) {
          console.warn('⚠️ Ollama 返回空回應，使用 Fallback');
          throw new Error('Ollama 返回空回應');
        }
        
      } catch (fetchError) {
        clearTimeout(timeoutId);
        
        if (fetchError.name === 'AbortError') {
          console.error('❌ Ollama 請求超時（5 分鐘），使用 Fallback 資料');
          // 超時時使用 fallback
          const aiAnalysisFallback = checkpointService.generateFallbackRisks(analysisData);
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
              note: 'AI 分析超時，使用預設風險資料'
            }
          });
        }
        
        throw fetchError;
      }
      
    } else {
      // 使用 Gemini
      const genAI = new GoogleGenerativeAI(apiKey);
      const geminiModel = genAI.getGenerativeModel({ model });
      const result = await geminiModel.generateContent(aiPrompt);
      responseText = result.response.text();
      console.log(`✅ Gemini 回應長度: ${responseText.length} 字元`);
    }
    
    // Step 5: 解析 AI 回應（JSON 格式）
    console.log('\n⭐ Step 4: 解析 AI 回應...');
    let aiAnalysis;
    
    try {
      // 嘗試直接解析 JSON
      aiAnalysis = JSON.parse(responseText);
      console.log(`✅ 成功解析 JSON，風險數量: ${aiAnalysis.risks?.length || 0}`);
    } catch (parseError) {
      console.log('⚠️ JSON 解析失敗，嘗試提取 JSON...');
      
      // 嘗試從 markdown code block 中提取
      const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) || 
                        responseText.match(/```\s*([\s\S]*?)\s*```/);
      
      if (jsonMatch) {
        try {
          aiAnalysis = JSON.parse(jsonMatch[1]);
          console.log(`✅ 從 markdown 中成功解析，風險數量: ${aiAnalysis.risks?.length || 0}`);
        } catch (e) {
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
          layer4: 'COMBINED_ANALYSIS (多因素分析)'
        },
        aiProvider,
        model,
        analysisTimestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('❌ Check Point 防火牆風險分析失敗:', error);
    res.status(500).json({ 
      success: false,
      product: 'CheckPoint',
      productDisplayName: 'Check Point Firewall',
      error: '防火牆風險分析失敗',
      details: error.message
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
      note: '此功能將在未來版本中提供'
    });
    
  } catch (error) {
    console.error('❌ 取得 Check Point 操作指引失敗:', error);
    res.status(500).json({
      success: false,
      product: 'CheckPoint',
      productDisplayName: 'Check Point Firewall',
      error: '取得操作指引失敗',
      details: error.message
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
          reject: analysisData.blockedTraffic.reject
        },
        highRiskApps: {
          total: analysisData.highRiskApps.count,
          critical: analysisData.highRiskApps.critical,
          high: analysisData.highRiskApps.high
        },
        policyViolations: {
          total: analysisData.policyViolations.count,
          critical: analysisData.policyViolations.critical,
          high: analysisData.policyViolations.high,
          medium: analysisData.policyViolations.medium
        },
        suspiciousBehavior: {
          total: analysisData.suspiciousBehavior.count
        },
        zoneRisks: {
          total: analysisData.zoneRisks.count
        },
        topCountries: analysisData.geoAnalysis.topCountries.slice(0, 5),
        topIPs: analysisData.geoAnalysis.topIPs.slice(0, 5),
        topApps: analysisData.appAnalysis.topApps.slice(0, 5),
        timeRange: analysisData.timeRange,
        layerStats: analysisData.layerStats
      }
    });
    
  } catch (error) {
    console.error('❌ 取得 Check Point 統計資訊失敗:', error);
    res.status(500).json({
      success: false,
      product: 'CheckPoint',
      productDisplayName: 'Check Point Firewall',
      error: '取得統計資訊失敗',
      details: error.message
    });
  }
});

module.exports = router;

