// backend/config/products/checkpoint/checkpointELKConfig.js
// Check Point 防火牆專屬的 ELK 索引配置

module.exports = {
  // ELK 索引模式（Check Point 日誌）
  index: process.env.ELK_CHECKPOINT_INDEX || 'across-checkpoint-tcp-7000-*',
  
  // 產品識別
  productName: 'CheckPoint',
  productDisplayName: 'Check Point Firewall',
  
  // 時間戳記欄位（Check Point 通常使用標準 @timestamp）
  timestampField: '@timestamp',
  
  // Check Point 必要欄位（根據 checkpointFieldMapping.js）
  requiredFields: [
    'loguid',               // 日誌唯一識別符
    'src',                  // 來源 IP
    'dst',                  // 目標 IP
    'service',              // 服務埠
    'action',               // 防火牆動作（Accept/Drop/Reject）
    'appi_name',            // 應用程式名稱
    'app_risk',             // 應用程式風險等級 (0-5)
    '@timestamp'            // 時間戳記
  ],
  
  // Check Point 安全相關欄位
  securityFields: [
    'action',               // 防火牆動作（最重要）
    'app_risk',             // 應用程式風險等級
    'app_category',         // 應用程式類別
    'appi_name',            // 應用程式名稱
    'matched_category',     // 匹配的類別
    'app_desc',             // 應用程式描述
    'app_properties',       // 應用程式屬性
    'conn_direction',       // 連線方向（Inbound/Outgoing）
    'security_inzone',      // 來源安全區域
    'security_outzone',     // 目的安全區域
    'rule_name',            // 觸發的規則名稱
    'user',                 // 使用者
    'src_machine_name'      // 來源主機名稱
  ],
  
  // 流量統計欄位
  trafficFields: [
    'bytes',                // 總傳輸位元組
    'client_inbound_bytes',
    'client_outbound_bytes',
    'client_inbound_packets',
    'client_outbound_packets',
    'duration',             // 連線持續時間
    'aggregated_log_count'  // 聚合日誌筆數
  ],
  
  // 預設查詢參數
  defaultQueryParams: {
    size: 10000,  // 最大結果數
    sort: [{ '@timestamp': { order: 'desc' } }]
  },
  
  // Check Point 特殊配置
  specialConfig: {
    // 只分析特定動作的日誌（可選）
    focusActions: ['Drop', 'Reject', 'Accept'],
    
    // 只分析高風險應用（可選）
    focusHighRisk: true,  // true = 只分析 app_risk >= 3
    
    // 排除內部管理流量
    excludeInternalManagement: true
  }
};

