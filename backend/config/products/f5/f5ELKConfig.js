// backend/config/products/f5/f5ELKConfig.js
// F5 Advanced WAF 專屬的 ELK 索引配置

module.exports = {
  // ELK 索引模式（F5 AWAF 日誌）
  index: process.env.ELK_F5_INDEX || 'across-f5-awaf-*',
  
  // 產品識別
  productName: 'F5',
  productDisplayName: 'F5 Advanced WAF',
  
  // 時間戳記欄位（F5 通常使用標準 @timestamp）
  timestampField: '@timestamp',
  
  // F5 必要欄位（根據實際日誌格式調整）
  requiredFields: [
    'request_id',           // F5 請求 ID
    'client_ip',            // 來源 IP
    'uri',                  // 請求 URI
    'method',               // HTTP 方法
    'attack_type',          // F5 攻擊類型
    'severity',             // 嚴重程度
    '@timestamp'            // 時間戳記
  ],
  
  // F5 安全相關欄位
  securityFields: [
    'attack_type',          // 攻擊類型
    'severity',             // 嚴重程度
    'violation_rating',     // 違規評分
    'sig_ids',              // 簽名 ID
    'sig_names',            // 簽名名稱
    'threat_campaign_names',// 威脅活動名稱
    'bot_category',         // Bot 類別
    'response_code'         // 回應代碼
  ],
  
  // 預設查詢參數
  defaultQueryParams: {
    size: 10000,  // 最大結果數
    sort: [{ '@timestamp': { order: 'desc' } }]
  }
};

