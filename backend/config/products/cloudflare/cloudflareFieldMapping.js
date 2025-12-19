// backend/config/products/cloudflare/cloudflareFieldMapping.js
// Cloudflare 日誌欄位對應表
// 根據 Cloudflare HTTP 日誌欄位建立的 AI 分析用欄位對應表

const CLOUDFLARE_FIELD_MAPPING = {
  // === 基本請求識別 ===
  ray_id: {
    elk_field: "RayID",
    data_type: "keyword",
    description: "請求的唯一識別ID",
    ai_context: "用於追蹤特定請求和關聯分析，識別重複攻擊模式",
    example: "8f3d0a59295f42e8"
  },

  zone_name: {
    elk_field: "ZoneName", 
    data_type: "keyword",
    description: "主域名",
    ai_context: "用於識別攻擊目標網域，分析不同網域的威脅分佈",
    example: "example.com, api.example.com"
  },

  // === 時間戳記 ===
  edge_start_timestamp: {
    elk_field: "EdgeStartTimestamp",
    data_type: "date",
    description: "Edge 收到來自用戶端的要求的時間戳記",
    ai_context: "Edge 收到來自用戶端的要求的時間戳記",
    example: "2024-12-18T06:19:17Z"
  },

  edge_end_timestamp: {
    elk_field: "EdgeEndTimestamp", 
    data_type: "date",
    description: "Edge 完成向用戶端傳送回應的時間戳記",
    ai_context: "Edge 完成向用戶端傳送回應的時間戳記",
    example: "2024-12-18T06:19:17Z"
  },

  // === 用戶端資訊 ===
  client_ip: {
    elk_field: "ClientIP",
    data_type: "ip", 
    description: "來源IP地址",
    ai_context: "來源識別欄位，用於IP聲譽分析、地理分佈和攻擊來源追蹤",
    example: "192.168.1.100, 167.172.158.128"
  },

  client_country: {
    elk_field: "ClientCountry",
    data_type: "keyword",
    description: "用戶端IP位址的2個字母ISO-3166國家/地區代碼", 
    ai_context: "用於分析攻擊的地理分佈模式，識別異常的國家集中度",
    example: "US, CN, RU, NL, DE"
  },

  client_asn: {
    elk_field: "ClientASN",
    data_type: "integer",
    description: "用戶端自治系統號碼",
    ai_context: "用於識別攻擊來源的網路供應商，分析特定ASN的威脅模式",
    example: "14061, 4134, 15169"
  },

  client_region_code: {
    elk_field: "ClientRegionCode", 
    data_type: "keyword",
    description: "用戶端區域代碼",
    ai_context: "提供更精細的地理位置資訊，用於區域性威脅分析",
    example: "NJ, CA, TX"
  },

  client_device_type: {
    elk_field: "ClientDeviceType",
    data_type: "keyword", 
    description: "用戶端裝置類型",
    ai_context: "用於分析攻擊者使用的裝置類型，識別自動化攻擊工具",
    example: "desktop, mobile, tablet"
  },

  client_ip_class: {
    elk_field: "ClientIPClass",
    data_type: "keyword",
    description: "用戶端IP類別",
    ai_context: "用於識別IP的性質（如代理、VPN、匿名網路），評估威脅等級",
    example: "noRecord, anonymousProxy, satelliteProvider"
  },

  // === HTTP 請求資訊 ===
  client_request_method: {
    elk_field: "ClientRequestMethod", 
    data_type: "keyword",
    description: "HTTP請求方法",
    ai_context: "用於分析攻擊類型，GET通常用於探測，POST用於注入攻擊",
    example: "GET, POST, PUT, DELETE"
  },

  client_request_uri: {
    elk_field: "ClientRequestURI",
    data_type: "keyword",
    description: "用戶端要求的URI", 
    ai_context: "最重要的攻擊模式識別欄位，用於檢測敏感檔案存取、注入攻擊等",
    example: "/.env, /.git/config, /wp-admin/login.php, /api/users"
  },

  client_request_path: {
    elk_field: "ClientRequestPath",
    data_type: "keyword",
    description: "用戶端所要求的URI路徑",
    ai_context: "與URI類似，用於路徑層級的攻擊模式分析",
    example: "/.DS_Store, /admin, /config.php"
  },

  client_request_host: {
    elk_field: "ClientRequestHost",
    data_type: "keyword", 
    description: "客戶請求的主機",
    ai_context: "用於識別攻擊目標的具體主機，分析子域名攻擊模式",
    example: "aichat.twister5.cf, api.example.com"
  },

  client_request_scheme: {
    elk_field: "ClientRequestScheme",
    data_type: "keyword",
    description: "訪客要求的URL配置",
    ai_context: "用於分析HTTP/HTTPS使用模式，識別不安全的連接嘗試",
    example: "http, https"
  },

  client_request_protocol: {
    elk_field: "ClientRequestProtocol",
    data_type: "keyword",
    description: "用戶端要求的HTTP通訊協定",
    ai_context: "用於分析協定版本分佈，識別舊協定的安全風險",
    example: "HTTP/1.1, HTTP/2, HTTP/3"
  },

  client_request_user_agent: {
    elk_field: "ClientRequestUserAgent", 
    data_type: "text",
    description: "用戶端回報的用戶代理",
    ai_context: "用於識別攻擊工具、爬蟲和偽造的用戶代理，檢測自動化攻擊",
    example: "Go-http-client/1.1, Mozilla/5.0, sqlmap/1.0"
  },

  client_request_referer: {
    elk_field: "ClientRequestReferer",
    data_type: "keyword",
    description: "HTTP請求反向連結", 
    ai_context: "用於分析請求來源，識別異常的引用模式和可能的釣魚攻擊",
    example: "https://google.com, https://malicious-site.com"
  },

  client_request_bytes: {
    elk_field: "ClientRequestBytes",
    data_type: "integer",
    description: "用戶端要求中的位元組數",
    ai_context: "用於分析請求大小，識別異常大的請求（可能的攻擊載荷）",
    example: "3453, 667, 1024"
  },

  // === 回應資訊 ===
  edge_response_status: {
    elk_field: "EdgeResponseStatus", 
    data_type: "integer",
    description: "Cloudflare傳回給用戶端的HTTP狀態碼",
    ai_context: "關鍵的攻擊檢測指標，403/404表示被阻擋，500表示伺服器錯誤",
    example: "200, 403, 404, 500, 301"
  },

  edge_response_bytes: {
    elk_field: "EdgeResponseBytes",
    data_type: "integer", 
    description: "Edge傳回給用戶端的位元組數",
    ai_context: "用於分析回應大小，識別異常的回應模式和資料外洩",
    example: "2856, 1024, 0"
  },

  edge_response_content_type: {
    elk_field: "EdgeResponseContentType",
    data_type: "keyword",
    description: "Edge回應Content-Type標頭值",
    ai_context: "用於分析回應內容類型，識別異常的內容類型回應",
    example: "text/html; charset=UTF-8, application/json"
  },

  // === 安全相關欄位 ===
  security_action: {
    elk_field: "SecurityAction",
    data_type: "keyword",
    description: "觸發終止動作的安全性規則的動作", 
    ai_context: "最重要的安全事件指標，用於識別被阻擋的攻擊和安全規則觸發",
    example: "block, allow, challenge, log"
  },

  security_actions: {
    elk_field: "SecurityActions",
    data_type: "keyword", 
    description: "Cloudflare安全產品對此請求執行的一系列操作",
    ai_context: "用於分析多重安全動作，識別複雜的攻擊模式和防護效果",
    example: "[\"log\", \"block\"], [\"challenge\", \"allow\"]"
  },

  security_rule_id: {
    elk_field: "SecurityRuleID",
    data_type: "keyword",
    description: "觸發終止動作之安全性規則的規則識別碼", 
    ai_context: "用於識別特定的安全規則觸發，分析攻擊類型和規則效果",
    example: "c2a2f414a67c409f90cccb6c5bba0215"
  },

  security_rule_ids: {
    elk_field: "SecurityRuleIDs", 
    data_type: "keyword",
    description: "匹配請求的安全產品規則ID陣列",
    ai_context: "用於分析多重規則觸發，識別複合型攻擊模式",
    example: "[\"ee448f20e7024cdda29f8ec20aa2ffd0\", \"c2a2f414a67c409f90cccb6c5bba0215\"]"
  },

  security_rule_description: {
    elk_field: "SecurityRuleDescription",
    data_type: "text",
    description: "觸發終止動作之安全性規則的規則描述",
    ai_context: "用於判斷規則是否為 log 模式，檢查是否包含 'log' 字眼，區分偵測規則和阻擋規則",
    example: "Cloudflare-Managed-WAF-SQLi-Block, Custom-WAF-Log-Rule, ALL-HTTP-BlockKeywords"
  },

  security_sources: {
    elk_field: "SecuritySources",
    data_type: "keyword",
    description: "執行動作的安全產品來源",
    ai_context: "用於識別觸發動作的安全產品（waf / firewallManaged / firewallCustom / rateLimit / l7ddos / botManagement / botFight / dlp），區分不同安全產品的防護效果", 
    example: "[\"firewallCustom\", \"firewallManaged\"], [\"waf\", \"botManagement\"]"
  },

  // === WAF 攻擊分數 ===
  waf_attack_score: {
    elk_field: "WAFAttackScore",
    data_type: "integer",
    description: "WAF偵測模組產生的整體請求分數，數字越低越接近是攻擊事件",
    ai_context: "關鍵的威脅量化指標，用於評估攻擊威脅等級和優先處理順序",
    example: "85, 67, 95"
  },

  waf_rce_attack_score: {
    elk_field: "WAFRCEAttackScore", 
    data_type: "integer",
    description: "RCE（遠程代碼執行）攻擊的WAF分數",
    ai_context: "用於識別遠程代碼執行攻擊，這是最危險的攻擊類型之一",
    example: "87, 70, 90"
  },

  waf_sqli_attack_score: {
    elk_field: "WAFSQLiAttackScore",
    data_type: "integer", 
    description: "SQL注入攻擊的WAF分數",
    ai_context: "用於識別SQL注入攻擊，對應OWASP A03注入攻擊分類",
    example: "97, 98, 85"
  },

  waf_xss_attack_score: {
    elk_field: "WAFXSSAttackScore",
    data_type: "integer",
    description: "XSS（跨站腳本）攻擊的WAF分數", 
    ai_context: "用於識別XSS攻擊，對應OWASP A03注入攻擊分類",
    example: "98, 97, 90"
  },

  // === Bot 檢測 ===
  bot_score: {
    elk_field: "BotScore", 
    data_type: "integer",
    description: "Bot分數，用於識別自動化流量",
    ai_context: "用於識別Bot流量和自動化攻擊，分數越低越可能是Bot",
    example: "1, 30, 99"
  },

  bot_detection_ids: {
    elk_field: "BotDetectionIDs",
    data_type: "keyword",
    description: "與Bot管理啟發式檢測相關的ID列表", 
    ai_context: "用於詳細分析Bot檢測結果，識別特定的Bot行為模式",
    example: "[33554452], [12345678, 87654321]"
  },

  bot_tags: {
    elk_field: "BotTags", 
    data_type: "keyword",
    description: "Bot流量類型標籤",
    ai_context: "用於分類不同類型的Bot流量，區分善意和惡意Bot",
    example: "['searchEngine'], ['malicious', 'scraper']"
  },

  // === 效能指標 ===
  edge_time_to_first_byte_ms: {
    elk_field: "EdgeTimeToFirstByteMs",
    data_type: "integer", 
    description: "在Cloudflare邊緣測量的首字節時間",
    ai_context: "用於分析回應時間，識別DDoS攻擊對系統效能的影響",
    example: "16, 37, 23"
  },

  origin_response_duration_ms: {
    elk_field: "OriginResponseDurationMs",
    data_type: "integer",
    description: "上游回應時間，包含路由和快取時間", 
    ai_context: "用於分析後端系統負載，識別攻擊對源伺服器的影響",
    example: "0, 150, 500"
  },

  // === SSL/TLS 資訊 ===
  client_ssl_protocol: {
    elk_field: "ClientSSLProtocol", 
    data_type: "keyword",
    description: "用戶端SSL（TLS）通訊協定",
    ai_context: "用於分析SSL/TLS使用情況，識別不安全的協定版本",
    example: "TLSv1.3, TLSv1.2, none"
  },

  client_ssl_cipher: {
    elk_field: "ClientSSLCipher",
    data_type: "keyword",
    description: "用戶端SSL加密套件", 
    ai_context: "用於分析加密強度，識別弱加密套件的使用",
    example: "AEAD-AES128-GCM-SHA256, NONE"
  },

  // === 快取相關 ===
  cache_cache_status: {
    elk_field: "CacheCacheStatus",
    data_type: "keyword", 
    description: "快取狀態",
    ai_context: "用於分析快取效果，識別快取繞過攻擊",
    example: "hit, miss, unknown"
  },

  // === 路由資訊 ===
  edge_colo_code: {
    elk_field: "EdgeColoCode",
    data_type: "keyword",
    description: "接收請求的資料中心IATA機場代碼", 
    ai_context: "用於分析流量分佈和路由模式，識別異常的地理路由",
    example: "EWR, AMS, NRT"
  },

  edge_colo_id: {
    elk_field: "EdgeColoID", 
    data_type: "integer",
    description: "Cloudflare邊緣資料中心ID",
    ai_context: "用於分析資料中心負載分佈，識別針對特定資料中心的攻擊",
    example: "650, 388, 522"
  },

  // === 進階安全欄位 ===
  leaked_credential_check_result: {
    elk_field: "LeakedCredentialCheckResult", 
    data_type: "keyword",
    description: "洩漏的憑證檢查結果",
    ai_context: "用於識別使用已洩露憑證的登入嘗試，對應OWASP A07認證失效",
    example: "none, found, suspicious"
  },

  // === 網路層資訊 ===
  client_src_port: {
    elk_field: "ClientSrcPort",
    data_type: "integer", 
    description: "用戶端來源連接埠",
    ai_context: "用於網路層分析，識別異常的端口使用模式",
    example: "46266, 33032, 37598"
  },

  client_tcp_rtt_ms: {
    elk_field: "ClientTCPRTTMs", 
    data_type: "integer",
    description: "用戶端TCP來回時間的平滑平均值",
    ai_context: "用於分析網路品質和可能的網路層攻擊",
    example: "2, 1, 5"
  }
};

// 匯出欄位對應表
module.exports = {
  CLOUDFLARE_FIELD_MAPPING,
  
  // 輔助函數：根據邏輯名稱獲取ELK欄位
  getELKField: (logicalName) => {
    return CLOUDFLARE_FIELD_MAPPING[logicalName]?.elk_field;
  },
  
  // 輔助函數：獲取所有安全相關欄位
  getSecurityFields: () => {
    return Object.entries(CLOUDFLARE_FIELD_MAPPING)
      .filter(([key, config]) => 
        key.includes('security') || 
        key.includes('waf') || 
        key.includes('bot') ||
        config.ai_context.includes('攻擊') ||
        config.ai_context.includes('安全')
      )
      .reduce((acc, [key, config]) => {
        acc[key] = config;
        return acc;
      }, {});
  },
  
  // 輔助函數：獲取攻擊模式相關欄位
  getAttackPatternFields: () => {
    return {
      client_request_uri: CLOUDFLARE_FIELD_MAPPING.client_request_uri,
      client_request_path: CLOUDFLARE_FIELD_MAPPING.client_request_path,
      client_request_user_agent: CLOUDFLARE_FIELD_MAPPING.client_request_user_agent,
      waf_attack_score: CLOUDFLARE_FIELD_MAPPING.waf_attack_score,
      waf_sqli_attack_score: CLOUDFLARE_FIELD_MAPPING.waf_sqli_attack_score,
      waf_xss_attack_score: CLOUDFLARE_FIELD_MAPPING.waf_xss_attack_score,
      security_action: CLOUDFLARE_FIELD_MAPPING.security_action
    };
  },
  
  // 輔助函數：生成AI可理解的欄位參考
  generateAIFieldReference: () => {
    return Object.entries(CLOUDFLARE_FIELD_MAPPING)
      .map(([logical_name, config]) => {
        return `${logical_name}:
  - ELK欄位: ${config.elk_field}
  - 資料類型: ${config.data_type}
  - 業務意義: ${config.description}
  - 分析用途: ${config.ai_context}
  - 範例值: ${config.example}`;
      }).join('\n\n');
  }
}; 