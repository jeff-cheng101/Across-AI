// backend/config/products/f5/f5FieldMapping.js
// F5 Advanced WAF 日誌欄位對應表
// 根據 F5 BIG-IP ASM/Advanced WAF 日誌格式建立

const F5_FIELD_MAPPING = {
  // === 基本請求識別 ===
  request_id: {
    elk_field: "request_id",
    data_type: "keyword",
    description: "F5 請求唯一識別ID",
    ai_context: "用於追蹤特定請求和關聯分析",
    example: "12345678-1234-1234-1234-123456789abc"
  },

  // === 時間戳記 ===
  timestamp: {
    elk_field: "@timestamp",
    data_type: "date",
    description: "事件時間戳記",
    ai_context: "用於時間序列分析和攻擊時間模式識別",
    example: "2024-12-18T06:19:17Z"
  },

  // === 客戶端資訊 ===
  client_ip: {
    elk_field: "client_ip",
    data_type: "ip",
    description: "來源IP地址",
    ai_context: "來源識別欄位，用於IP聲譽分析和攻擊來源追蹤",
    example: "192.168.1.100"
  },

  client_country: {
    elk_field: "client_country",
    data_type: "keyword",
    description: "來源國家代碼",
    ai_context: "用於分析攻擊的地理分佈模式",
    example: "US, CN, RU"
  },

  client_asn: {
    elk_field: "client_asn",
    data_type: "integer",
    description: "客戶端自治系統號碼",
    ai_context: "用於識別攻擊來源的網路供應商",
    example: "14061"
  },

  // === HTTP 請求資訊 ===
  method: {
    elk_field: "method",
    data_type: "keyword",
    description: "HTTP請求方法",
    ai_context: "用於分析攻擊類型，POST常用於注入攻擊",
    example: "GET, POST, PUT, DELETE"
  },

  uri: {
    elk_field: "uri",
    data_type: "keyword",
    description: "請求URI",
    ai_context: "最重要的攻擊模式識別欄位",
    example: "/api/users, /admin/login"
  },

  host: {
    elk_field: "host",
    data_type: "keyword",
    description: "目標主機",
    ai_context: "用於識別攻擊目標",
    example: "api.example.com"
  },

  protocol: {
    elk_field: "protocol",
    data_type: "keyword",
    description: "HTTP協定版本",
    ai_context: "用於分析協定使用模式",
    example: "HTTP/1.1, HTTP/2"
  },

  user_agent: {
    elk_field: "user_agent",
    data_type: "text",
    description: "User-Agent",
    ai_context: "用於識別攻擊工具和爬蟲",
    example: "Mozilla/5.0, sqlmap/1.0"
  },

  // === 回應資訊 ===
  response_code: {
    elk_field: "response_code",
    data_type: "integer",
    description: "HTTP回應代碼",
    ai_context: "關鍵的攻擊檢測指標，403表示被阻擋",
    example: "200, 403, 404, 500"
  },

  // === F5 安全相關欄位 ===
  attack_type: {
    elk_field: "attack_type",
    data_type: "keyword",
    description: "F5 識別的攻擊類型",
    ai_context: "F5 WAF 的主要攻擊分類指標",
    example: "SQL Injection, XSS, Command Execution"
  },

  severity: {
    elk_field: "severity",
    data_type: "integer",
    description: "嚴重程度 (1-5)",
    ai_context: "F5 威脅等級評估，5為最嚴重",
    example: "1, 2, 3, 4, 5"
  },

  violation_rating: {
    elk_field: "violation_rating",
    data_type: "integer",
    description: "違規評分 (0-100)",
    ai_context: "F5 違規嚴重程度量化指標",
    example: "85, 67, 95"
  },

  sig_ids: {
    elk_field: "sig_ids",
    data_type: "keyword",
    description: "觸發的簽名ID列表",
    ai_context: "用於識別特定的攻擊簽名",
    example: "200001234, 200002345"
  },

  sig_names: {
    elk_field: "sig_names",
    data_type: "keyword",
    description: "觸發的簽名名稱",
    ai_context: "攻擊簽名的可讀名稱",
    example: "SQL-INJ-SELECT, XSS-SCRIPT-TAG"
  },

  threat_campaign_names: {
    elk_field: "threat_campaign_names",
    data_type: "keyword",
    description: "威脅活動名稱",
    ai_context: "識別已知的威脅活動",
    example: "Log4Shell, SpringShell"
  },

  violations: {
    elk_field: "violations",
    data_type: "keyword",
    description: "違規類型列表",
    ai_context: "F5 檢測到的違規行為",
    example: "VIOL_SQL_INJECTION, VIOL_XSS"
  },

  // === Bot 檢測 ===
  bot_category: {
    elk_field: "bot_category",
    data_type: "keyword",
    description: "Bot類別",
    ai_context: "F5 Bot防護識別的Bot類型",
    example: "Malicious Bot, Trusted Bot, Unknown"
  },

  bot_signature_name: {
    elk_field: "bot_signature_name",
    data_type: "keyword",
    description: "Bot簽名名稱",
    ai_context: "識別特定的Bot",
    example: "curl, python-requests"
  },

  // === 策略資訊 ===
  policy_name: {
    elk_field: "policy_name",
    data_type: "keyword",
    description: "F5 WAF 策略名稱",
    ai_context: "觸發的安全策略",
    example: "prod_api_policy"
  },

  policy_apply_date: {
    elk_field: "policy_apply_date",
    data_type: "date",
    description: "策略應用時間",
    ai_context: "策略生效時間",
    example: "2024-12-01T00:00:00Z"
  },

  // === 請求/回應大小 ===
  request_length: {
    elk_field: "request_length",
    data_type: "integer",
    description: "請求大小（bytes）",
    ai_context: "用於識別異常大的請求",
    example: "1024, 2048"
  },

  response_length: {
    elk_field: "response_length",
    data_type: "integer",
    description: "回應大小（bytes）",
    ai_context: "用於分析回應模式",
    example: "512, 1024"
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
        key.includes('bot_') ||
        config.ai_context.includes('攻擊') ||
        config.ai_context.includes('安全')
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
  }
};

