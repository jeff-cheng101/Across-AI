// backend/config/products/f5/f5FieldMapping.js
// F5 Advanced WAF 日誌欄位對應表
// 根據 F5 BIG-IP ASM/Advanced WAF 日誌格式建立

const F5_FIELD_MAPPING = {
  // === 時間相關欄位 ===
  timestamp: {
    elk_field: "@timestamp",
    data_type: "date",
    description: "事件日誌時間戳（UTC）",
    ai_context: "用於時間序列分析和攻擊時間模式識別",
    example: "2025-11-18T21:20:58.531527701Z"
  },

  date_time: {
    elk_field: "date_time",
    data_type: "keyword",
    description: "事件發生日期/時間",
    ai_context: "本地時間格式的事件時間記錄",
    example: "2025-11-19 05:20:48"
  },

  // === 客戶端資訊 ===
  client_ip: {
    elk_field: "client_ip",
    data_type: "ip",
    description: "用戶端來源 IP 位址",
    ai_context: "來源識別欄位，用於IP聲譽分析和攻擊來源追蹤",
    example: "34.81.120.97"
  },

  client_port: {
    elk_field: "client_port",
    data_type: "integer",
    description: "用戶端來源埠口",
    ai_context: "用於識別用戶端連線埠號",
    example: "37046"
  },

  x_forwarded_for_ip: {
    elk_field: "x_forwarded_for_ip",
    data_type: "ip",
    description: "X-Forwarded-For HTTP標頭（用戶真實IP）",
    ai_context: "識別經過代理後的真實來源IP",
    example: "34.81.120.97"
  },

  user_agent: {
    elk_field: "user_agent",
    data_type: "text",
    description: "用戶端裝置/瀏覽器識別（User-Agent字串）",
    ai_context: "用於識別攻擊工具和爬蟲",
    example: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
  },

  // === 地理位置資訊 ===
  geoip: {
    elk_field: "geoip",
    data_type: "object",
    description: "IP地理位置資訊（國家、城市、經緯度等）",
    ai_context: "用於分析攻擊的地理分佈模式",
    example: "{country_name: 'Taiwan', city_name: 'Taipei', coordinates: [121.5259, 25.053]}"
  },

  geo_location: {
    elk_field: "geo_location",
    data_type: "keyword",
    description: "IP簡易地理屬性（如國家代碼）",
    ai_context: "快速識別攻擊來源國家",
    example: "TW"
  },

  // === 目的端資訊 ===
  dst_ip: {
    elk_field: "dst_ip",
    data_type: "ip",
    description: "目的端伺服器 IP 位址",
    ai_context: "識別被攻擊的目標伺服器",
    example: "202.39.33.192"
  },

  dst_port: {
    elk_field: "dst_port",
    data_type: "integer",
    description: "目的端（伺服器）埠口",
    ai_context: "識別目標服務埠號",
    example: "443"
  },

  port: {
    elk_field: "port",
    data_type: "integer",
    description: "來源或目標端口（上下文依實際用途）",
    ai_context: "通用端口欄位",
    example: "40959"
  },

  // === HTTP 請求資訊 ===
  method: {
    elk_field: "method",
    data_type: "keyword",
    description: "HTTP請求動作（GET, POST等）",
    ai_context: "用於分析攻擊類型，POST常用於注入攻擊",
    example: "GET"
  },

  uri: {
    elk_field: "uri",
    data_type: "keyword",
    description: "HTTP請求的資源路徑（網址）",
    ai_context: "最重要的攻擊模式識別欄位",
    example: "/.git/config"
  },

  query_string: {
    elk_field: "query_string",
    data_type: "text",
    description: "HTTP查詢字串（URL參數）",
    ai_context: "用於檢測URL參數注入攻擊",
    example: "?id=1&action=view"
  },

  fragment: {
    elk_field: "fragment",
    data_type: "keyword",
    description: "URI片段（分段參數）",
    ai_context: "URL片段識別碼",
    example: "#section1"
  },

  protocol: {
    elk_field: "protocol",
    data_type: "keyword",
    description: "協定類型（例: TCP, UDP, HTTP, HTTPS）",
    ai_context: "用於分析協定使用模式",
    example: "HTTPS"
  },

  fqdn: {
    elk_field: "fqdn",
    data_type: "keyword",
    description: "完整網域名稱（FQDN）",
    ai_context: "識別完整的目標域名",
    example: "www.adasone.site"
  },

  host: {
    elk_field: "host",
    data_type: "keyword",
    description: "日誌紀錄的主機名稱/IP",
    ai_context: "識別日誌來源主機",
    example: "10.168.255.253"
  },

  referer: {
    elk_field: "referer",
    data_type: "text",
    description: "HTTP Referer 請求來源頁面",
    ai_context: "追蹤請求來源頁面",
    example: "https://example.com/page"
  },

  connection: {
    elk_field: "connection",
    data_type: "keyword",
    description: "連線狀態（例: close, keep-alive）",
    ai_context: "HTTP連線狀態管理",
    example: "close"
  },

  // === HTTP 標頭資訊 ===
  accept: {
    elk_field: "accept",
    data_type: "text",
    description: "HTTP Accept 標頭（接受格式）",
    ai_context: "用於識別用戶端接受的內容類型",
    example: "text/html,application/json"
  },

  accept_encoding: {
    elk_field: "accept_encoding",
    data_type: "keyword",
    description: "HTTP Accept-Encoding 標頭",
    ai_context: "識別用戶端支援的壓縮格式",
    example: "gzip"
  },

  // === 回應資訊 ===
  response_code: {
    elk_field: "response_code",
    data_type: "integer",
    description: "HTTP回應狀態碼（如200, 404）",
    ai_context: "關鍵的攻擊檢測指標，0表示被阻擋",
    example: "0"
  },

  response: {
    elk_field: "response",
    data_type: "text",
    description: "HTTP回應內容（可能關閉/遮蔽）",
    ai_context: "回應內容記錄",
    example: "Response logging disabled"
  },

  request_status: {
    elk_field: "request_status",
    data_type: "keyword",
    description: "請求狀態（如允許allowed、阻擋blocked）",
    ai_context: "F5 WAF 處理決策的關鍵指標",
    example: "blocked"
  },

  // === F5 安全相關欄位 ===
  attack_type: {
    elk_field: "attack_type",
    data_type: "keyword",
    description: "攻擊型態（例: 資訊洩漏、SQL注入等）",
    ai_context: "F5 WAF 的主要攻擊分類指標",
    example: "Predictable Resource Location"
  },

  violations: {
    elk_field: "violations",
    data_type: "keyword",
    description: "觸發的違規類型（WAF攻擊偵測結果）",
    ai_context: "F5 檢測到的違規行為列表",
    example: "Attack signature detected"
  },

  sub_violations: {
    elk_field: "sub_violations",
    data_type: "keyword",
    description: "子違規詳細類型",
    ai_context: "違規的細分類型",
    example: "VIOL_PARAMETER_VALUE_LENGTH"
  },

  violation_rating: {
    elk_field: "violation_rating",
    data_type: "keyword",
    description: "違規分數（嚴重度評分）",
    ai_context: "F5 違規嚴重程度量化指標",
    example: "2"
  },

  severity: {
    elk_field: "severity",
    data_type: "keyword",
    description: "事件嚴重等級",
    ai_context: "F5 威脅等級評估",
    example: "Error"
  },

  ThreatLevel: {
    elk_field: "ThreatLevel",
    data_type: "keyword",
    description: "威脅等級（Low/Medium/High）",
    ai_context: "綜合威脅等級評估",
    example: "Low"
  },

  // === 簽章與 CVE 資訊 ===
  sig_ids: {
    elk_field: "sig_ids",
    data_type: "keyword",
    description: "觸發攻擊簽章 ID",
    ai_context: "用於識別特定的攻擊簽章",
    example: "200010136"
  },

  sig_names: {
    elk_field: "sig_names",
    data_type: "keyword",
    description: "觸發簽章名稱",
    ai_context: "攻擊簽章的可讀名稱",
    example: "%22/.git/%22 access"
  },

  sig_cves: {
    elk_field: "sig_cves",
    data_type: "keyword",
    description: "觸發簽章關聯 CVE 編號",
    ai_context: "識別相關的CVE漏洞編號",
    example: "CVE-2021-44228"
  },

  staged_sig_ids: {
    elk_field: "staged_sig_ids",
    data_type: "keyword",
    description: "暫存簽章ID（測試用）",
    ai_context: "測試模式下的簽章ID",
    example: "200010137"
  },

  staged_sig_names: {
    elk_field: "staged_sig_names",
    data_type: "keyword",
    description: "暫存簽章名稱（測試用）",
    ai_context: "測試模式下的簽章名稱",
    example: "Test Signature"
  },

  staged_sig_cves: {
    elk_field: "staged_sig_cves",
    data_type: "keyword",
    description: "暫存簽章 CVE 漏洞編號",
    ai_context: "測試模式下的CVE編號",
    example: "CVE-2024-12345"
  },

  // === 威脅活動資訊 ===
  threat_campaign_names: {
    elk_field: "threat_campaign_names",
    data_type: "keyword",
    description: "攻擊活動名稱（群組/組織）",
    ai_context: "識別已知的威脅活動和攻擊組織",
    example: "Log4Shell"
  },

  staged_threat_campaign_names: {
    elk_field: "staged_threat_campaign_names",
    data_type: "keyword",
    description: "暫存攻擊活動名稱（測試模式）",
    ai_context: "測試模式下的威脅活動名稱",
    example: "Test Campaign"
  },

  owasp: {
    elk_field: "owasp",
    data_type: "keyword",
    description: "OWASP 攻擊分類（如SQLi, XSS等）",
    ai_context: "基於OWASP Top 10的攻擊分類",
    example: "Others"
  },

  // === 策略與政策資訊 ===
  policy_name: {
    elk_field: "policy_name",
    data_type: "keyword",
    description: "防護政策名稱",
    ai_context: "觸發的F5安全策略",
    example: "/Common/www.twister5.com.tw"
  },

  policy_apply_date: {
    elk_field: "policy_apply_date",
    data_type: "keyword",
    description: "安全政策套用日期",
    ai_context: "策略生效時間",
    example: "2025-10-18 12:59:58"
  },

  web_application_name: {
    elk_field: "web_application_name",
    data_type: "keyword",
    description: "Web應用名稱/分類",
    ai_context: "識別受保護的Web應用",
    example: "/Common/www.twister5.com.tw"
  },

  http_class_name: {
    elk_field: "http_class_name",
    data_type: "keyword",
    description: "HTTP類型/分類識別名稱",
    ai_context: "HTTP流量分類",
    example: "/Common/www.example.com"
  },

  virtual: {
    elk_field: "virtual",
    data_type: "keyword",
    description: "虛擬伺服器名稱/路徑",
    ai_context: "識別F5虛擬伺服器",
    example: "/Common/vs_1234567890_VS10x.XX.XX.XX_443"
  },

  // === F5 裝置與管理資訊 ===
  unit_hostname: {
    elk_field: "unit_hostname",
    data_type: "keyword",
    description: "F5 裝置主機名稱（或分組識別）",
    ai_context: "識別產生日誌的F5裝置",
    example: "office.example.com"
  },

  management_ip_address: {
    elk_field: "management_ip_address",
    data_type: "ip",
    description: "管理介面 IP 位址",
    ai_context: "F5管理介面IP",
    example: "192.168.1.1"
  },

  management_ip_address_2: {
    elk_field: "management_ip_address_2",
    data_type: "keyword",
    description: "次管理介面 IP 位址（多介面設備）",
    ai_context: "第二個管理介面IP",
    example: "192.168.1.2"
  },

  route_domain: {
    elk_field: "route_domain",
    data_type: "integer",
    description: "路由域編號（F5隔離區）",
    ai_context: "F5路由域隔離識別",
    example: "0"
  },

  // === 會話與連線資訊 ===
  session_id: {
    elk_field: "session_id",
    data_type: "keyword",
    description: "用戶端/伺服器Session ID",
    ai_context: "追蹤用戶會話",
    example: "0"
  },

  // === WebSocket 相關 ===
  websocket_direction: {
    elk_field: "websocket_direction",
    data_type: "keyword",
    description: "WebSocket 訊息方向（in/out）",
    ai_context: "WebSocket通訊方向",
    example: "in"
  },

  websocket_message_type: {
    elk_field: "websocket_message_type",
    data_type: "keyword",
    description: "WebSocket 訊息類型",
    ai_context: "WebSocket訊息格式",
    example: "text"
  },

  // === 微服務與代理資訊 ===
  microservice: {
    elk_field: "microservice",
    data_type: "keyword",
    description: "目標微服務名稱（微服務架構使用）",
    ai_context: "識別目標微服務",
    example: "user-service"
  },

  tap_event_id: {
    elk_field: "tap_event_id",
    data_type: "keyword",
    description: "外部代理事件ID",
    ai_context: "關聯外部監控事件",
    example: "TAP-123456"
  },

  tap_vid: {
    elk_field: "tap_vid",
    data_type: "keyword",
    description: "外部代理 VID",
    ai_context: "外部代理虛擬識別碼",
    example: "VID-789"
  },

  // === 阻擋與例外資訊 ===
  blocking_exception_reason: {
    elk_field: "blocking_exception_reason",
    data_type: "keyword",
    description: "阻擋例外（特殊狀態說明）",
    ai_context: "說明為何不阻擋的原因",
    example: "Trusted IP"
  },

  // === 支援與追蹤資訊 ===
  support_id: {
    elk_field: "support_id",
    data_type: "keyword",
    description: "F5支援事件唯一識別碼",
    ai_context: "用於F5技術支援追蹤",
    example: "15303290310432395636"
  },

  tags: {
    elk_field: "tags",
    data_type: "keyword",
    description: "記錄標籤（多用於分類識別）",
    ai_context: "日誌分類標記",
    example: "f5_waf"
  },

  message: {
    elk_field: "message",
    data_type: "text",
    description: "原始記錄訊息（詳細內容/結構化輸出）",
    ai_context: "完整的原始日誌訊息",
    example: "ASM:unit_hostname=\"office.example.com\"..."
  },

  version: {
    elk_field: "@version",
    data_type: "keyword",
    description: "日誌格式版本號",
    ai_context: "ELK日誌格式版本",
    example: "1"
  }
};

// 匯出欄位對應表
module.exports = {
  F5_FIELD_MAPPING,
  
  // 輔助函數：根據邏輯名稱獲取ELK欄位
  getELKField: (logicalName) => {
    return F5_FIELD_MAPPING[logicalName]?.elk_field;
  },
  
  // 輔助函數：獲取所有安全相關欄位
  getSecurityFields: () => {
    return Object.entries(F5_FIELD_MAPPING)
      .filter(([key, config]) => 
        key.includes('attack') || 
        key.includes('severity') || 
        key.includes('violation') ||
        key.includes('sig_') ||
        key.includes('threat') ||
        key.includes('owasp') ||
        config.ai_context.includes('攻擊') ||
        config.ai_context.includes('安全') ||
        config.ai_context.includes('威脅')
      )
      .reduce((acc, [key, config]) => {
        acc[key] = config;
        return acc;
      }, {});
  },
  
  // 輔助函數：生成AI可理解的欄位參考
  generateAIFieldReference: () => {
    return Object.entries(F5_FIELD_MAPPING)
      .map(([logical_name, config]) => {
        return `${logical_name}:
  - ELK欄位: ${config.elk_field}
  - 資料類型: ${config.data_type}
  - 業務意義: ${config.description}
  - 分析用途: ${config.ai_context}
  - 範例值: ${config.example}`;
      }).join('\n\n');
  },

  // 輔助函數：獲取所有欄位名稱列表
  getAllFieldNames: () => {
    return Object.keys(F5_FIELD_MAPPING);
  },

  // 輔助函數：獲取所有ELK欄位名稱
  getAllELKFieldNames: () => {
    return Object.values(F5_FIELD_MAPPING).map(config => config.elk_field);
  }
};
