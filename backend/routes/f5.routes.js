// backend/routes/f5.routes.js
// F5 Advanced WAF 產品專屬 API 路由

const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { elkMCPClient } = require('../services/elkMCPClient');
const F5WAFRiskService = require('../services/products/f5WAFRiskService');
const { F5_FIELD_MAPPING } = require('../config/products/f5/f5FieldMapping');
const f5ELKConfig = require('../config/products/f5/f5ELKConfig');

// 測試 F5 ELK 連接
router.get('/test-connection', async (req, res) => {
  try {
    const isConnected = await elkMCPClient.testConnection();
    res.json({ 
      connected: isConnected,
      product: 'F5',
      index: f5ELKConfig.index,
      message: isConnected ? 'F5 ELK 連接正常' : 'F5 ELK 連接失敗'
    });
  } catch (error) {
    res.status(500).json({ 
      connected: false,
      product: 'F5',
      error: error.message 
    });
  }
});

// ✅ 已移除 F5 stats 端點
// 原因: getSecurityStats() 使用了不存在的 elasticsearch_query MCP 工具
// 替代方案: 使用 POST /api/f5/analyze-waf-risks 進行完整的 WAF 風險分析

// F5 WAF 風險分析 API（主要端點）
router.post('/analyze-waf-risks', async (req, res) => {
  try {
    const { apiKey, model = 'gemini-2.0-flash-exp', timeRange = '24h', aiProvider = 'gemini' } = req.body;
    
    // 如果使用 Ollama，不需要 API Key
    if (aiProvider !== 'ollama' && !apiKey) {
      return res.status(400).json({ 
        error: '請先設定 Gemini API Key 或使用 Ollama',
        product: 'F5'
      });
    }

    console.log(`\n🔍 ===== 開始 F5 WAF 風險分析 API =====`);
    console.log(`📅 時間範圍: ${timeRange}`);
    console.log(`🤖 AI 提供者: ${aiProvider}`);
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
          const aiAnalysisFallback = wafService.generateFallbackRisks(analysisData);
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
        aiProvider,
        model,
        analysisTimestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('❌ F5 WAF 風險分析失敗:', error);
    res.status(500).json({ 
      success: false,
      product: 'F5',
      error: 'WAF 風險分析失敗',
      details: error.message
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
    const { F5_OPERATION_GUIDES, mapRecommendationToGuideId } = require('../config/products/f5/f5OperationGuides');
    
    // 根據建議標題或分類，找到對應的操作指引 ID
    const guideId = mapRecommendationToGuideId(recommendationTitle, category);
    
    if (!guideId) {
      console.log(`⚠️ 找不到對應的操作指引`);
      return res.json({
        success: false,
        message: '找不到對應的操作指引',
        product: 'F5'
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
        product: 'F5'
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
      guide: guide
    });
    
  } catch (error) {
    console.error('❌ 取得 F5 操作指引失敗:', error);
    res.status(500).json({
      success: false,
      product: 'F5',
      error: '取得操作指引失敗',
      details: error.message
    });
  }
});

module.exports = router;


