#!/usr/bin/env node
// scripts/collect-training-data.js
// AI 訓練資料收集主程式

const fetch = require('node-fetch');
const config = require('./config/collection-config');
const { logger } = require('./utils/logger');

/**
 * 主要的訓練資料收集類別
 */
class TrainingDataCollector {
  constructor(options = {}) {
    this.product = options.product || 'cloudflare';
    this.count = options.count || config.collection.defaultCount;
    this.timeRange = options.timeRange || config.products[this.product]?.defaultTimeRange || '24h';
    this.apiKey = options.apiKey || process.env.GEMINI_API_KEY;
    this.model = options.model || config.products[this.product]?.defaultModel;
    this.aiProvider = options.aiProvider || config.products[this.product]?.defaultAiProvider || 'gemini';
    
    // 驗證產品
    this.validateProduct();
  }

  /**
   * 驗證產品是否支援
   */
  validateProduct() {
    const productConfig = config.products[this.product];
    
    if (!productConfig) {
      throw new Error(`不支援的產品: ${this.product}\n可用產品: ${Object.keys(config.products).join(', ')}`);
    }
    
    if (productConfig.enabled === false) {
      throw new Error(`產品 ${this.product} 尚未啟用`);
    }
    
    // 檢查 API Key
    if (this.aiProvider === 'gemini' && !this.apiKey) {
      throw new Error('使用 Gemini 時必須提供 API Key（--apiKey 或設定 GEMINI_API_KEY 環境變數）');
    }
  }

  /**
   * 開始收集訓練資料
   */
  async collect() {
    console.log('\n' + '='.repeat(60));
    console.log(`🔄 開始收集 ${config.products[this.product].name} 訓練資料`);
    console.log('='.repeat(60));
    console.log(`📊 收集數量: ${this.count} 筆`);
    console.log(`⏰ 時間範圍: ${this.timeRange}`);
    console.log(`🤖 AI 提供者: ${this.aiProvider}`);
    console.log(`🎯 模型: ${this.model}`);
    console.log(`💾 儲存位置: ai_logs/${this.product}/`);
    console.log('='.repeat(60) + '\n');

    const results = {
      success: 0,
      failed: 0,
      errors: []
    };

    for (let i = 1; i <= this.count; i++) {
      console.log(`\n${'─'.repeat(60)}`);
      console.log(`📝 收集第 ${i}/${this.count} 筆`);
      console.log('─'.repeat(60));

      try {
        // 呼叫 API 並收集資料
        const startTime = Date.now();
        const trainingData = await this.collectOne();
        const endTime = Date.now();
        
        // 加入效能資訊
        trainingData.performance = {
          apiCallTime: endTime - startTime,
          promptLength: trainingData.input?.fullPrompt?.length || 0,
          responseLength: JSON.stringify(trainingData.output).length
        };

        // 儲存到檔案
        const filepath = await logger.save(this.product, trainingData, i);
        
        console.log(`✅ 第 ${i} 筆資料已儲存`);
        console.log(`📁 檔案: ${filepath}`);
        console.log(`⏱️  耗時: ${trainingData.performance.apiCallTime}ms`);
        
        results.success++;

      } catch (error) {
        console.error(`❌ 第 ${i} 筆收集失敗: ${error.message}`);
        results.failed++;
        results.errors.push({
          sequence: i,
          error: error.message
        });

        if (!config.collection.continueOnError) {
          console.log('\n⚠️ 遇到錯誤，停止收集');
          break;
        }
      }

      // 延遲（避免 API 頻率限制）
      if (i < this.count) {
        const delay = config.collection.delayBetweenCalls;
        console.log(`⏳ 等待 ${delay / 1000} 秒...`);
        await this.sleep(delay);
      }
    }

    // 顯示總結
    this.showSummary(results);
  }

  /**
   * 收集單筆訓練資料
   */
  async collectOne() {
    // Step 1: 呼叫 API
    console.log('🔍 步驟 1/3: 呼叫 API...');
    const apiResponse = await this.callAPI();
    
    // Step 2: 提取訓練資料
    console.log('📦 步驟 2/3: 提取資料...');
    const trainingData = this.extractTrainingData(apiResponse);
    
    // Step 3: 驗證資料
    console.log('✓ 步驟 3/3: 驗證資料...');
    this.validateData(trainingData);
    
    return trainingData;
  }

  /**
   * 呼叫後端 API
   */
  async callAPI() {
    const productConfig = config.products[this.product];
    const url = `${config.api.baseUrl}${productConfig.endpoint}`;
    
    console.log(`   API: ${url}`);

    const requestBody = {
      timeRange: this.timeRange,
      aiProvider: this.aiProvider,
      model: this.model
    };

    // Gemini 需要 API Key
    if (this.aiProvider === 'gemini') {
      requestBody.apiKey = this.apiKey;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody),
      timeout: config.api.timeout
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API 錯誤 ${response.status}: ${errorText}`);
    }

    return await response.json();
  }

  /**
   * 從 API 回應中提取訓練資料
   */
  extractTrainingData(apiResponse) {
    // 注意：這裡假設 API 回應包含我們需要的資料
    // 實際上可能需要再次呼叫內部方法來獲取完整的 Prompt
    
    const trainingData = {
      metadata: {
        id: `${this.product}-${Date.now()}`,
        timestamp: new Date().toISOString(),
        product: this.product,
        aiProvider: this.aiProvider,
        model: this.model,
        timeRange: this.timeRange
      },
      
      input: {
        // 注意：完整的 Prompt 需要從 backend 獲取
        // 目前 API 沒有返回 Prompt，這裡先用 placeholder
        systemPrompt: '(完整的系統提示詞)',
        userPrompt: '(包含統計資料的用戶提示詞)',
        analysisData: apiResponse.metadata || {},
        fullPrompt: '(完整的 Prompt 內容需要從 backend 獲取)'
      },
      
      output: {
        success: apiResponse.success,
        parseStatus: 'success',  // 可以從 API 回應推斷
        risks: apiResponse.risks || [],
        metadata: apiResponse.metadata || {}
      }
    };

    return trainingData;
  }

  /**
   * 驗證訓練資料
   */
  validateData(data) {
    if (!data.metadata || !data.input || !data.output) {
      throw new Error('訓練資料結構不完整');
    }

    if (config.validation.requireRisksArray && !Array.isArray(data.output.risks)) {
      throw new Error('output.risks 必須是陣列');
    }

    if (!config.validation.allowEmptyRisks && data.output.risks.length === 0) {
      throw new Error('output.risks 不能為空（可在配置中允許）');
    }

    console.log(`   ✓ 資料驗證通過（風險數量: ${data.output.risks.length}）`);
  }

  /**
   * 顯示收集總結
   */
  showSummary(results) {
    console.log('\n' + '='.repeat(60));
    console.log('📊 收集總結');
    console.log('='.repeat(60));
    console.log(`✅ 成功: ${results.success} 筆`);
    console.log(`❌ 失敗: ${results.failed} 筆`);
    console.log(`📁 儲存位置: ai_logs/${this.product}/`);
    
    if (results.errors.length > 0) {
      console.log('\n❌ 錯誤詳情:');
      results.errors.forEach(err => {
        console.log(`   - 第 ${err.sequence} 筆: ${err.error}`);
      });
    }
    
    console.log('='.repeat(60) + '\n');
  }

  /**
   * 延遲函數
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * 解析命令列參數
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg.startsWith('--')) {
      const [key, value] = arg.substring(2).split('=');
      
      // 轉換數字型別
      if (key === 'count' && value) {
        options[key] = parseInt(value, 10);
      } else if (value !== undefined) {
        options[key] = value;
      } else if (args[i + 1] && !args[i + 1].startsWith('--')) {
        options[key] = args[i + 1];
        i++;
      } else {
        options[key] = true;
      }
    }
  }

  return options;
}

/**
 * 顯示使用說明
 */
function showUsage() {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║            AI 訓練資料收集工具 v1.0                           ║
╚════════════════════════════════════════════════════════════════╝

使用方式:
  node scripts/collect-training-data.js [選項]

選項:
  --product <name>       產品名稱（cloudflare, f5, checkpoint）
  --count <number>       收集筆數（預設: 10）
  --timeRange <range>    時間範圍（1h, 6h, 12h, 24h, 7d, 30d）
  --apiKey <key>         Gemini API Key（或設定 GEMINI_API_KEY 環境變數）
  --model <name>         AI 模型名稱
  --aiProvider <name>    AI 提供者（gemini 或 ollama）
  --help                 顯示此說明

範例:
  # 收集 10 筆 Cloudflare 訓練資料
  node scripts/collect-training-data.js \\
    --product=cloudflare \\
    --count=10 \\
    --timeRange=24h \\
    --apiKey=YOUR_API_KEY

  # 收集 5 筆 F5 訓練資料（使用 Ollama）
  node scripts/collect-training-data.js \\
    --product=f5 \\
    --count=5 \\
    --aiProvider=ollama \\
    --model=twister_llama33:latest

支援的產品:
  - cloudflare  Cloudflare WAF 分析
  - f5          F5 WAF 分析
  - checkpoint  Checkpoint 安全分析（未來）

更多資訊請參考: ai_logs/README.md
`);
}

/**
 * 主程式入口
 */
async function main() {
  try {
    const options = parseArgs();

    // 顯示說明
    if (options.help) {
      showUsage();
      process.exit(0);
    }

    // 建立收集器並執行
    const collector = new TrainingDataCollector(options);
    await collector.collect();

    process.exit(0);
  } catch (error) {
    console.error('\n❌ 錯誤:', error.message);
    console.log('\n💡 使用 --help 查看使用說明\n');
    process.exit(1);
  }
}

// 執行主程式
if (require.main === module) {
  main();
}

module.exports = { TrainingDataCollector };


