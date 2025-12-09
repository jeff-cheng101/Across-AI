// backend/routes/common.routes.js
// 通用 API 路由（不特定於任何產品）

const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// 獲取可用的 AI 模型列表
router.get('/models', (_req, res) => {
  res.json({ 
    models: ['gemini-2.0-flash-exp', 'gemini-1.5-flash', 'gemini-1.5-pro'] 
  });
});

// 測試 AI 連接（Gemini 或 Ollama）
router.post('/test-ai', async (req, res) => {
  try {
    const { apiKey, model = 'gemini-2.0-flash-exp', aiProvider = 'gemini' } = req.body;
    
    console.log(`\n🧪 測試 ${aiProvider === 'ollama' ? 'Ollama' : 'Gemini'} AI 連接...`);
    console.log(`🤖 模型: ${model}`);
    
    const testPrompt = '請用繁體中文簡單回答：你是誰？';
    let responseText;
    
    if (aiProvider === 'ollama') {
      // 測試 Ollama
      if (!model) {
        return res.status(400).json({ 
          error: '請指定 Ollama 模型名稱',
          example: 'twister_llama33:latest'
        });
      }
      
      const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
      console.log(`🦙 Ollama URL: ${ollamaUrl}`);
      
      // 先檢查 Ollama 服務是否可用
      try {
        const healthCheck = await fetch(`${ollamaUrl}/api/tags`);
        if (!healthCheck.ok) {
          throw new Error(`Ollama 服務不可用: ${healthCheck.status}`);
        }
        const modelsData = await healthCheck.json();
        console.log(`✅ Ollama 服務正常，可用模型: ${modelsData.models?.map(m => m.name).join(', ') || '無'}`);
      } catch (healthError) {
        return res.status(503).json({
          error: 'Ollama 服務連接失敗',
          details: healthError.message,
          ollamaUrl,
          suggestion: '請確認 Ollama 已啟動，並且可以在 ' + ollamaUrl + ' 存取'
        });
      }
      
      // 執行測試生成
      const ollamaResponse = await fetch(`${ollamaUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          prompt: testPrompt,
          stream: false,
          options: {
            temperature: 0.7,
            num_predict: 100
          }
        })
      });
      
      if (!ollamaResponse.ok) {
        const errorText = await ollamaResponse.text();
        throw new Error(`Ollama API 錯誤 (${ollamaResponse.status}): ${errorText}`);
      }
      
      const ollamaData = await ollamaResponse.json();
      responseText = ollamaData.response;
      
      console.log(`✅ Ollama 回應: ${responseText.substring(0, 100)}...`);
      
      res.json({ 
        success: true,
        aiProvider: 'ollama',
        model,
        ollamaUrl,
        response: responseText,
        message: 'Ollama AI 連接測試成功'
      });
      
    } else {
      // 測試 Gemini
      if (!apiKey) {
        return res.status(400).json({ 
          error: '請提供 Gemini API Key' 
        });
      }
      
      const genAI = new GoogleGenerativeAI(apiKey);
      const geminiModel = genAI.getGenerativeModel({ model });
      const result = await geminiModel.generateContent(testPrompt);
      responseText = result.response.text();
      
      console.log(`✅ Gemini 回應: ${responseText.substring(0, 100)}...`);
      
      res.json({ 
        success: true,
        aiProvider: 'gemini',
        model,
        response: responseText,
        message: 'Gemini AI 連接測試成功'
      });
    }
    
  } catch (error) {
    console.error('❌ AI 連接測試失敗:', error);
    res.status(500).json({ 
      success: false,
      error: 'AI 連接測試失敗',
      details: error.message
    });
  }
});

module.exports = router;


