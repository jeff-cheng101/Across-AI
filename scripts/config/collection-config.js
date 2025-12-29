// scripts/config/collection-config.js
// 訓練資料收集配置

module.exports = {
  // ==================== 產品配置 ====================
  products: {
    cloudflare: {
      name: 'Cloudflare WAF',
      endpoint: '/api/cloudflare/analyze-waf-risks',
      defaultTimeRange: '24h',
      defaultModel: 'gemini-2.0-flash-exp',
      defaultAiProvider: 'gemini',
      description: 'Cloudflare WAF 日誌分析'
    },
    
    f5: {
      name: 'F5 WAF',
      endpoint: '/api/f5/analyze-waf-risks',
      defaultTimeRange: '24h',
      defaultModel: 'gemini-2.0-flash-exp',
      defaultAiProvider: 'gemini',
      description: 'F5 WAF 日誌分析'
    },
    
    checkpoint: {
      name: 'Checkpoint',
      endpoint: '/api/checkpoint/analyze-risks',
      defaultTimeRange: '24h',
      defaultModel: 'gemini-2.0-flash-exp',
      defaultAiProvider: 'gemini',
      description: 'Checkpoint 安全分析（未來支援）',
      enabled: false  // 尚未實作
    }
  },

  // ==================== 輸出配置 ====================
  output: {
    baseDir: 'ai_logs',              // 輸出根目錄
    format: 'json',                   // 輸出格式：'json'
    prettyPrint: true,                // JSON 是否格式化（縮排）
    includeTimestamp: true,           // 是否在檔案中包含時間戳
    includeMetadata: true,            // 是否包含詳細 metadata
    includePerformance: true          // 是否包含效能資訊
  },

  // ==================== API 配置 ====================
  api: {
    baseUrl: 'http://localhost:8081', // 後端 API 位址
    timeout: 120000,                   // 請求超時時間（毫秒）= 2分鐘
    retryAttempts: 3,                  // 失敗重試次數
    retryDelay: 5000,                  // 重試間隔（毫秒）= 5秒
    validateResponse: true             // 是否驗證回應格式
  },

  // ==================== 收集配置 ====================
  collection: {
    defaultCount: 10,                  // 預設收集筆數
    delayBetweenCalls: 2000,          // 每次 API 呼叫間隔（毫秒）= 2秒
    maxConcurrent: 1,                  // 最大並發請求數（避免負載過高）
    continueOnError: true,             // 遇到錯誤是否繼續收集
    saveOnError: false                 // 錯誤的回應是否也儲存
  },

  // ==================== 檔案命名配置 ====================
  naming: {
    dateFormat: 'YYYY-MM-DD',         // 日期格式
    sequenceDigits: 3,                 // 序號位數（001, 002, ...）
    separator: '-'                     // 分隔符號
  },

  // ==================== 日誌配置 ====================
  logging: {
    verbose: true,                     // 是否顯示詳細日誌
    showProgress: true,                // 是否顯示進度條
    logErrors: true,                   // 是否記錄錯誤
    logApiCalls: true                  // 是否記錄 API 呼叫詳情
  },

  // ==================== 支援的 AI 提供者 ====================
  aiProviders: {
    gemini: {
      name: 'Google Gemini',
      requiresApiKey: true,
      defaultModel: 'gemini-2.0-flash-exp',
      models: [
        'gemini-2.0-flash-exp',
        'gemini-1.5-pro',
        'gemini-1.5-flash'
      ]
    },
    
    ollama: {
      name: 'Ollama (Local)',
      requiresApiKey: false,
      defaultModel: 'gpt-oss:20b',
      models: [
        'gpt-oss:20b',
        'llama3:8b',
        'mistral:7b'
      ]
    }
  },

  // ==================== 時間範圍選項 ====================
  timeRanges: [
    '1h',   // 1 小時
    '6h',   // 6 小時
    '12h',  // 12 小時
    '24h',  // 24 小時
    '7d',   // 7 天
    '30d'   // 30 天
  ],

  // ==================== 驗證規則 ====================
  validation: {
    minPromptLength: 100,              // 最小 Prompt 長度
    minResponseLength: 50,             // 最小回應長度
    requireRisksArray: true,           // 是否必須包含 risks 陣列
    allowEmptyRisks: true              // 是否允許空的 risks 陣列（無攻擊情境）
  }
};


