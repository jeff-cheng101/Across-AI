// backend/config/products/checkpoint/checkpointFieldMapping.js
// Check Point 防火牆日誌欄位對應表
// 根據 Check Point Firewall Log 格式建立

const CHECKPOINT_FIELD_MAPPING = {
  // === 日誌識別欄位 ===
  logid: {
    elk_field: "logid",
    data_type: "integer",
    description: "Check Point 日誌 ID (Log Identifier)",
    ai_context: "用來識別每筆日誌的唯一類型或來源",
    example: 320
  },
  
  loguid: {
    elk_field: "loguid",
    data_type: "keyword",
    description: "日誌唯一識別符 (UUID) 組合，用於跨聚合辨識",
    ai_context: "協助追蹤同一個連線或事件的多筆聚合日誌",
    example: "0x2a9b7f47,0x9fba18b8,0x5ac40666,0xb485a06f"
  },

  // === 時間相關欄位 ===
  time: {
    elk_field: "time",
    data_type: "long",
    description: "事件時間 (epoch 格式)",
    ai_context: "表示事件發生的時間戳記",
    example: 1764017018
  },

  "@timestamp": {
    elk_field: "@timestamp",
    data_type: "date",
    description: "事件時間 (ISO8601 格式，用於 Elasticsearch 時間索引)",
    ai_context: "用於時間序列分析與查詢",
    example: "2025-11-24T20:43:38.000Z"
  },

  // === 網路位址欄位 ===
  origin: {
    elk_field: "origin",
    data_type: "ip",
    description: "原始 (Origin) IP 位址",
    ai_context: "事件來源主機 IP 位址",
    example: "10.x.x.x"
  },

  src: {
    elk_field: "src",
    data_type: "ip",
    description: "來源端 IP 位址 (source)",
    ai_context: "實際發起連線的端點 IP",
    example: "123.100.44.55"
  },

  dst: {
    elk_field: "dst",
    data_type: "ip",
    description: "目標 (destination) IP 位址",
    ai_context: "連線目的端 IP",
    example: "100.10.10.10"
  },

  dst_domain_name: {
    elk_field: "dst_domain_name",
    data_type: "keyword",
    description: "目標域名 (destination domain) 名稱",
    ai_context: "DNS 主機名稱或伺服器域名",
    example: "events.data.microsoft.com"
  },

  // === 服務與協定欄位 ===
  service: {
    elk_field: "service",
    data_type: "integer",
    description: "服務埠 (port number)",
    ai_context: "目標通訊埠",
    example: 443
  },

  service_id: {
    elk_field: "service_id",
    data_type: "keyword",
    description: "服務類型 (預定義服務 ID)",
    ai_context: "識別通訊服務 (如 https, http 等)",
    example: "https"
  },

  protocol: {
    elk_field: "protocol",
    data_type: "keyword",
    description: "通訊協定 (protocol)",
    ai_context: "如 TCP, UDP, ICMP 等協定類型",
    example: "HTTPS"
  },

  proto: {
    elk_field: "proto",
    data_type: "integer",
    description: "協定編號 (protocol number)",
    ai_context: "數值形式的協定編碼",
    example: 6
  },

  // === 防火牆動作與方向 ===
  action: {
    elk_field: "action",
    data_type: "keyword",
    description: "防火牆規則動作 (允許／拒絕)",
    ai_context: "security policy 的執行情況",
    example: "Accept"
  },

  conn_direction: {
    elk_field: "conn_direction",
    data_type: "keyword",
    description: "連線方向 (connection direction)",
    ai_context: "判斷流量是進入 (Inbound) 還是出去 (Outgoing)",
    example: "Outgoing"
  },

  // === 網路介面欄位 ===
  ifname: {
    elk_field: "ifname",
    data_type: "keyword",
    description: "介面名稱 (interface name)",
    ai_context: "流量所屬的網路介面",
    example: "bond9"
  },

  ifdir: {
    elk_field: "ifdir",
    data_type: "keyword",
    description: "介面方向 (interface direction) — inbound 或 outbound",
    ai_context: "指示流量是通過該介面的進入或離開",
    example: "inbound"
  },

  // === 流量統計欄位 ===
  bytes: {
    elk_field: "bytes",
    data_type: "long",
    description: "總傳輸位元組 (bytes)",
    ai_context: "流量大小 (上下行總量)",
    example: 18450
  },

  client_inbound_bytes: {
    elk_field: "client_inbound_bytes",
    data_type: "long",
    description: "客戶端 (client) 接收 (inbound) 位元組數",
    ai_context: "用戶端下載/接收資料量",
    example: 5772
  },

  client_outbound_bytes: {
    elk_field: "client_outbound_bytes",
    data_type: "long",
    description: "客戶端 (client) 傳出 (outbound) 位元組數",
    ai_context: "用戶端上傳 / 傳送資料量",
    example: 12678
  },

  client_inbound_packets: {
    elk_field: "client_inbound_packets",
    data_type: "integer",
    description: "客戶端接收的封包數量 (packets)",
    ai_context: "用戶端接收到的封包數",
    example: 24
  },

  client_outbound_packets: {
    elk_field: "client_outbound_packets",
    data_type: "integer",
    description: "客戶端發出的封包數量 (packets)",
    ai_context: "用戶端送出的封包數",
    example: 28
  },

  server_inbound_bytes: {
    elk_field: "server_inbound_bytes",
    data_type: "long",
    description: "伺服器端接收 (inbound) 位元組數",
    ai_context: "伺服器接收來自客戶端的資料量",
    example: 12360
  },

  server_outbound_bytes: {
    elk_field: "server_outbound_bytes",
    data_type: "long",
    description: "伺服器端傳出 (outbound) 位元組數",
    ai_context: "伺服器回傳給客戶端的資料量",
    example: 5812
  },

  server_inbound_packets: {
    elk_field: "server_inbound_packets",
    data_type: "integer",
    description: "伺服器接收的封包數量 (packets)",
    ai_context: "伺服器收到的封包數",
    example: 19
  },

  server_outbound_packets: {
    elk_field: "server_outbound_packets",
    data_type: "integer",
    description: "伺服器發出的封包數量 (packets)",
    ai_context: "伺服器發出的封包數",
    example: 25
  },

  // === 連線屬性 ===
  duration: {
    elk_field: "duration",
    data_type: "integer",
    description: "連線持續時間 (秒)",
    ai_context: "該連線持續多長時間",
    example: 1529
  },

  aggregated_log_count: {
    elk_field: "aggregated_log_count",
    data_type: "integer",
    description: "聚合的日誌筆數 (aggregation count)",
    ai_context: "此 Log 為多少筆實際日誌合併而來",
    example: 4
  },

  // === 應用程式識別 ===
  app_id: {
    elk_field: "app_id",
    data_type: "integer",
    description: "應用程式 ID (Application Control ID)",
    ai_context: "識別是哪個應用 (App-ID)",
    example: 10074906
  },

  app_sig_id: {
    elk_field: "app_sig_id",
    data_type: "keyword",
    description: "應用程式簽名 ID (App-ID Signature)",
    ai_context: "更細分類的應用版本簽名",
    example: "10074906:19"
  },

  appi_name: {
    elk_field: "appi_name",
    data_type: "keyword",
    description: "應用程式名稱 (App-ID 名稱)",
    ai_context: "辨識應用程式 (例如 Windows Update)",
    example: "Windows Update"
  },

  app_category: {
    elk_field: "app_category",
    data_type: "keyword",
    description: "應用程式類別 (Category)",
    ai_context: "應用所屬功能類型 (例如 Software Update)",
    example: "Software Update"
  },

  matched_category: {
    elk_field: "matched_category",
    data_type: "keyword",
    description: "匹配的應用分類 (Matched Category)",
    ai_context: "實際識別出的分類與策略是否對應",
    example: "Software Update"
  },

  app_risk: {
    elk_field: "app_risk",
    data_type: "integer",
    description: "應用程式風險評分 (Risk Level) Possible values: 0 - Unknown, 1 - Very low, 2 - Low, 3 - Medium, 4 - High, 5 - Critical",
    ai_context: "該應用程式被評估為高／中／低風險",
    example: 1
  },

  app_desc: {
    elk_field: "app_desc",
    data_type: "text",
    description: "應用程式描述 (Application Description)",
    ai_context: "對應用程式功能與風險的描述文字",
    example: "Windows Update is a Microsoft service …"
  },

  app_properties: {
    elk_field: "app_properties",
    data_type: "text",
    description: "應用程式屬性 (Properties)",
    ai_context: "如風險等級、協力廠商、服務類型等屬性集合",
    example: "Very Low Risk, Microsoft & Office365 Services, Software Update, Web Services Provider"
  },

  // === 安全區域 ===
  security_inzone: {
    elk_field: "security_inzone",
    data_type: "keyword",
    description: "來源安全區域 (In-Zone)",
    ai_context: "標記來源端屬於哪個安全區 (Internal, L3_trust …)",
    example: "L3_trust"
  },

  security_outzone: {
    elk_field: "security_outzone",
    data_type: "keyword",
    description: "目的安全區域 (Out-Zone)",
    ai_context: "標記目的端所處安全區 (External, L3_untrust …)",
    example: "L3_untrust"
  },

  // === 規則與集群 ===
  rule_name: {
    elk_field: "rule_name",
    data_type: "keyword",
    description: "防火牆 /政策規則名稱 (Rule Name)",
    ai_context: "哪條規則被命中 (允許 / 拒絕 …)",
    example: "Windows update"
  },

  member_id: {
    elk_field: "member_id",
    data_type: "integer",
    description: "集群成員 ID (Cluster member identifier)",
    ai_context: "若是 Cluster 環境，可知道是哪個成員在處理此流量",
    example: 12
  },

  sequencenum: {
    elk_field: "sequencenum",
    data_type: "integer",
    description: "連線序列編號 (Sequence number)",
    ai_context: "該連線 / 事件在 session 的序列位置",
    example: 3
  },

  // === 日誌格式與檢查 ===
  h_version: {
    elk_field: "h_version",
    data_type: "integer",
    description: "日誌格式版本 (Log schema version)",
    ai_context: "辨識使用哪版日誌協定 / 格式",
    example: 5
  },

  https_inspection_action: {
    elk_field: "https_inspection_action",
    data_type: "keyword",
    description: "HTTPS 檢查 (SSL 解密) 的動作",
    ai_context: "是否對該連線進行解密 (bypass, inspect, drop …)",
    example: "Bypass"
  },

  update_count: {
    elk_field: "update_count",
    data_type: "integer",
    description: "聚合更新計數 (How many times this log record was updated / 聚合次數增量)",
    ai_context: "用於知道該日誌是否是聚合後反覆更新",
    example: 4
  },

  // === 使用者與主機識別 ===
  user: {
    elk_field: "user",
    data_type: "text",
    description: "來源使用者名稱 (User)",
    ai_context: "與日誌相關的 AD 使用者 (Username)",
    example: "王小明 (wang_ming)\n"
  },

  src_user_dn: {
    elk_field: "src_user_dn",
    data_type: "text",
    description: "來源使用者的完整 AD DN (Distinguished Name)",
    ai_context: "辨識使用者在 AD 中的完整路徑 / 身分",
    example: "CN=王小明,OU= office_group…"
  },

  src_machine_name: {
    elk_field: "src_machine_name",
    data_type: "keyword",
    description: "來源主機名稱 (Source Machine Name)",
    ai_context: "IP 所對應的機器名稱 / 使用者登入機器",
    example: "wang_ming@example.com"
  },

  // === 網路區域 (Zone) ===
  inzone: {
    elk_field: "inzone",
    data_type: "keyword",
    description: "來源區域 (In-Zone 名稱)",
    ai_context: "代表來源層面的網路安全區 (例如 Internal)",
    example: "Internal"
  },

  outzone: {
    elk_field: "outzone",
    data_type: "keyword",
    description: "目的區域 (Out-Zone 名稱)",
    ai_context: "代表目的端網路安全區 (例如 External)",
    example: "External"
  },

  // === 連線統計 ===
  connection_count: {
    elk_field: "connection_count",
    data_type: "integer",
    description: "此聚合紀錄中的實際連線數量 (connections)",
    ai_context: "被此日誌條目聚合的實際連線總數",
    example: 2
  },

  // === Threat Prevention 欄位（威脅防護）===
  threat_severity: {
    elk_field: "threat_severity",
    data_type: "keyword",
    description: "威脅嚴重程度 (High, Medium, Low)",
    ai_context: "由 Check Point Threat Prevention 評估的威脅嚴重等級，用於判斷攻擊的危險程度",
    example: "High, Medium, Low"
  },

  threat_name: {
    elk_field: "threat_name",
    data_type: "text",
    description: "威脅名稱 (如病毒、木馬名稱)",
    ai_context: "從 Threat Prevention 組件獲取的威脅名稱，用於識別具體的攻擊類型（SQL Injection, XSS, Botnet 等）",
    example: "SQL Injection, XSS Attack, Botnet C&C Communication"
  },

  threat_category: {
    elk_field: "threat_category",
    data_type: "keyword",
    description: "威脅類別 (Exploit, Botnet, DDoS 等)",
    ai_context: "威脅的分類類別，用於將攻擊歸類到特定的威脅類型",
    example: "Exploit, Botnet, DDoS, Malware, SQL Injection"
  },

  burst_count: {
    elk_field: "burst_count",
    data_type: "integer",
    description: "連續攻擊嘗試次數或快速爆發連線次數",
    ai_context: "在短時間內快速連線或攻擊的次數，用於識別 DDoS 攻擊或暴力破解行為",
    example: 100
  },

  count: {
    elk_field: "count",
    data_type: "integer",
    description: "事件計數（通用）",
    ai_context: "事件發生的次數，可用於統計攻擊頻率",
    example: 50
  },

  // === HTTP 相關欄位 ===
  http_user_agent: {
    elk_field: "http_user_agent",
    data_type: "text",
    description: "HTTP User-Agent (來自 HTTP 流量的應用程式訊息)",
    ai_context: "用於識別攻擊工具、爬蟲和偽造的 User-Agent，檢測自動化攻擊（sqlmap, nikto, nmap 等掃描工具）",
    example: "Mozilla/5.0, sqlmap/1.0, curl/7.68.0, Go-http-client/1.1"
  },

  http_url: {
    elk_field: "http_url",
    data_type: "text",
    description: "HTTP URL 完整路徑",
    ai_context: "HTTP 請求的完整 URL，用於匹配 OWASP TOP 10 攻擊模式（SQL Injection, XSS, Path Traversal 等）",
    example: "/admin/login.php?id=1' OR '1'='1, /wp-admin/, /../../../etc/passwd"
  },

  http_method: {
    elk_field: "http_method",
    data_type: "keyword",
    description: "HTTP 請求方法",
    ai_context: "HTTP 方法（GET/POST/PUT/DELETE），用於分析攻擊類型（GET 通常用於探測，POST 用於注入攻擊）",
    example: "GET, POST, PUT, DELETE"
  },

  // === URL Filtering 欄位 ===
  url_category: {
    elk_field: "url_category",
    data_type: "keyword",
    description: "URL 分類 (來自 URL Filtering，用來判斷訪問的網站安全性類別)",
    ai_context: "由 Check Point URL Filtering 判定的網站類別，用於識別可疑或惡意網站瀏覽嘗試（Malicious Sites, Phishing, Pornography, Gambling 等）",
    example: "Malicious Sites, Phishing, Social Media, Pornography, Gambling, Business"
  },

  url_reputation: {
    elk_field: "url_reputation",
    data_type: "keyword",
    description: "URL 聲譽評級",
    ai_context: "URL 的安全聲譽等級，用於判斷網站的可信度",
    example: "Malicious, Suspicious, Trusted"
  }
};

// === 輔助函數 ===
module.exports = {
  CHECKPOINT_FIELD_MAPPING,  // 明確導出 CHECKPOINT_FIELD_MAPPING
  
  // 輔助函數：根據邏輯欄位名稱獲取ELK欄位名稱
  getELKField: (logicalFieldName) => {
    const config = CHECKPOINT_FIELD_MAPPING[logicalFieldName];
    return config ? config.elk_field : null;
  },

  // 輔助函數：獲取欄位的AI上下文說明
  getAIContext: (logicalFieldName) => {
    const config = CHECKPOINT_FIELD_MAPPING[logicalFieldName];
    return config ? config.ai_context : null;
  },

  // 輔助函數：獲取所有邏輯欄位名稱
  getAllFieldNames: () => {
    return Object.keys(CHECKPOINT_FIELD_MAPPING);
  },

  // 輔助函數：獲取所有ELK欄位名稱
  getAllELKFieldNames: () => {
    return Object.values(CHECKPOINT_FIELD_MAPPING).map(config => config.elk_field);
  }
};
