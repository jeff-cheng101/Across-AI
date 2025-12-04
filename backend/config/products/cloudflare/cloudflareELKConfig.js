// backend/config/products/cloudflare/cloudflareELKConfig.js
// Cloudflare 專屬的 ELK 索引配置

module.exports = {
  // ELK 索引模式（Cloudflare 日誌）
  index: process.env.ELK_CLOUDFLARE_INDEX || 'across-cf-*',
  
  // 產品識別
  productName: 'Cloudflare',
  productDisplayName: 'Cloudflare WAF',
  
  // 時間戳記欄位（Cloudflare 使用 EdgeStartTimestamp）
  timestampField: 'EdgeStartTimestamp',
  
  // Cloudflare 必要欄位（用於驗證日誌完整性）
  requiredFields: [
    'RayID',
    'ClientIP',
    'ClientRequestURI',
    'EdgeRequestHost',
    'WAFAttackScore',
    'EdgeStartTimestamp'
  ],
  
  // Cloudflare 安全相關欄位
  securityFields: [
    'WAFAttackScore',
    'WAFSQLiAttackScore',
    'WAFXSSAttackScore',
    'WAFRCEAttackScore',
    'SecurityAction',
    'SecurityRuleID',
    'BotScore'
  ],
  
  // 預設查詢參數
  defaultQueryParams: {
    size: 10000,  // 最大結果數
    sort: [{ 'EdgeStartTimestamp': { order: 'desc' } }]
  }
};


