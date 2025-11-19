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
      // 使用 Ollama
      const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
      const ollamaModel = model || 'gemma3:4b';
      
      console.log(`🦙 Ollama URL: ${ollamaUrl}`);
      console.log(`🦙 Ollama 模型: ${ollamaModel}`);
      
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
            num_predict: 4096
          }
        })
      });
      
      if (!ollamaResponse.ok) {
        throw new Error(`Ollama API 錯誤: ${ollamaResponse.status}`);
      }
      
      const ollamaData = await ollamaResponse.json();
      responseText = ollamaData.response;
      console.log(`✅ Ollama 回應長度: ${responseText.length} 字元`);
      
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

module.exports = router;


