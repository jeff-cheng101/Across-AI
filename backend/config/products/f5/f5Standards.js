// backend/config/products/f5/f5Standards.js
// F5 Advanced WAF 安全標準配置 - 多層次判斷模型
// 基於 F5 BIG-IP ASM/Advanced WAF 安全策略與原廠文件
// 參考文件：backend/docs/f5/v17.1/violations-description.md

/**
 * ═══════════════════════════════════════════════════════════
 * 第一部分：F5 嚴重程度與威脅等級分類
 * ═══════════════════════════════════════════════════════════
 */

/**
 * F5 Severity 嚴重程度對應表
 * 來源：F5 原生日誌 severity 欄位
 */
const F5_SEVERITY_MAPPING = {
  'Critical': { value: 5, label: 'critical', displayName: '嚴重', color: 'red', priority: 1 },
  'Alert': { value: 5, label: 'critical', displayName: '警報', color: 'red', priority: 1 },
  'Error': { value: 4, label: 'high', displayName: '錯誤', color: 'orange', priority: 2 },
  'Warning': { value: 3, label: 'medium', displayName: '警告', color: 'yellow', priority: 3 },
  'Notice': { value: 2, label: 'low', displayName: '通知', color: 'blue', priority: 4 },
  'Informational': { value: 1, label: 'info', displayName: '資訊', color: 'gray', priority: 5 },
  'Debug': { value: 1, label: 'info', displayName: '除錯', color: 'gray', priority: 5 }
};

/**
 * F5 ThreatLevel 威脅等級對應表
 * 來源：F5 原生日誌 ThreatLevel 欄位
 */
const F5_THREAT_LEVEL_MAPPING = {
  'Critical': { score: 95, label: 'critical', displayName: '嚴重威脅', color: 'red' },
  'High': { score: 80, label: 'high', displayName: '高威脅', color: 'orange' },
  'Medium': { score: 60, label: 'medium', displayName: '中威脅', color: 'yellow' },
  'Low': { score: 40, label: 'low', displayName: '低威脅', color: 'blue' },
  'Informational': { score: 10, label: 'info', displayName: '資訊', color: 'gray' }
};

/**
 * F5 request_status 處理狀態對應表
 */
const F5_REQUEST_STATUS_MAPPING = {
  'blocked': { isAttack: true, severity: 'high', displayName: '已阻擋', color: 'red' },
  'alerted': { isAttack: true, severity: 'medium', displayName: '已警示', color: 'orange' },
  'logged': { isAttack: false, severity: 'low', displayName: '已記錄', color: 'blue' },
  'allowed': { isAttack: false, severity: 'info', displayName: '已允許', color: 'green' }
};

/**
 * ═══════════════════════════════════════════════════════════
 * 第二部分：F5 違規類型完整分類（基於官方文件）
 * ═══════════════════════════════════════════════════════════
 */

/**
 * F5 VIOL 違規類型分類與威脅等級對應
 * 來源：F5 BIG-IP v17.1 官方文件
 */
const F5_VIOLATION_CLASSIFICATION = {
  // ========== 嚴重攻擊類（Critical Attacks）==========
  CRITICAL_ATTACKS: {
    severity: 'critical',
    displayName: '嚴重攻擊',
    owaspCategory: 'A03:2021 - Injection',
    violations: [
      'VIOL_ATTACK_SIGNATURE',           // 攻擊簽章偵測
      'VIOL_THREAT_CAMPAIGN',            // 威脅活動偵測
      'VIOL_RATING_THREAT',              // 違規評級：威脅
      'VIOL_CONVICTION',                 // 惡意行為者定罪
      'VIOL_MALICIOUS_DEVICE',           // 惡意設備偵測
      'VIOL_MALICIOUS_IP',               // 惡意 IP 存取
      'VIOL_BLACKLISTED_IP',             // 黑名單 IP
      'VIOL_VIRUS',                      // 病毒偵測
      'VIOL_LEAKED_CREDENTIALS',         // 洩漏憑證偵測
      'VIOL_THREAT_ANALYSIS'             // 威脅分析平台決策
    ]
  },

  // ========== 注入攻擊類（Injection Attacks）==========
  INJECTION_ATTACKS: {
    severity: 'high',
    displayName: '注入攻擊',
    owaspCategory: 'A03:2021 - Injection',
    violations: [
      'VIOL_SQL_INJECTION',              // SQL 注入（推測名稱）
      'VIOL_XSS',                        // XSS 攻擊（推測名稱）
      'VIOL_COMMAND_EXECUTION',          // 命令執行（推測名稱）
      'VIOL_XML_MALFORMED',              // 畸形 XML 資料
      'VIOL_XML_FORMAT',                 // XML 格式不符
      'VIOL_XML_SCHEMA',                 // XML 不符 Schema
      'VIOL_JSON_MALFORMED',             // 畸形 JSON 資料
      'VIOL_JSON_FORMAT',                // JSON 格式不符
      'VIOL_JSON_SCHEMA',                // JSON 不符 Schema
      'VIOL_PARAMETER_VALUE_METACHAR',   // 參數值含非法元字符
      'VIOL_URL_METACHAR',               // URL 含非法元字符
      'VIOL_HEADER_METACHAR'             // 標頭含非法元字符
    ]
  },

  // ========== 資訊洩漏與路徑遍歷（Information Disclosure）==========
  INFORMATION_DISCLOSURE: {
    severity: 'high',
    displayName: '資訊洩漏與路徑遍歷',
    owaspCategory: 'A01:2021 - Broken Access Control',
    violations: [
      'VIOL_DATA_GUARD',                 // 資料防護：資訊洩漏偵測
      'VIOL_SERVER_SIDE_HOST',           // 伺服器端存取不允許的主機
      'VIOL_FILETYPE',                   // 非法檔案類型
      'VIOL_URL',                        // 非法 URL
      'VIOL_URL_LENGTH',                 // URL 長度過長
      'VIOL_FILE_UPLOAD',                // 不允許的檔案上傳
      'VIOL_FILE_UPLOAD_IN_BODY'         // Body 中的檔案上傳
    ]
  },

  // ========== 會話與認證攻擊（Session & Authentication）==========
  SESSION_ATTACKS: {
    severity: 'high',
    displayName: '會話與認證攻擊',
    owaspCategory: 'A07:2021 - Authentication Failures',
    violations: [
      'VIOL_ASM_COOKIE_HIJACKING',       // ASM Cookie 劫持
      'VIOL_ASM_COOKIE_MODIFIED',        // ASM Cookie 被修改
      'VIOL_COOKIE_MODIFIED',            // 網域 Cookie 被修改
      'VIOL_COOKIE_EXPIRED',             // 過期時間戳
      'VIOL_SESSION_AWARENESS',          // 會話感知偵測
      'VIOL_DYNAMIC_SESSION',            // URL 中的非法 Session ID
      'VIOL_BRUTE_FORCE',                // 暴力破解：超過最大登入嘗試
      'VIOL_LOGIN_URL_BYPASSED',         // 繞過登入 URL
      'VIOL_LOGIN_URL_EXPIRED',          // 登入 URL 過期
      'VIOL_CSRF',                       // CSRF 攻擊偵測
      'VIOL_CSRF_EXPIRED',               // CSRF 認證過期
      'VIOL_DATA_INTEGRITY'              // DataSafe 資料完整性
    ]
  },

  // ========== Bot 與自動化攻擊（Bot Attacks）==========
  BOT_ATTACKS: {
    severity: 'medium',
    displayName: 'Bot 與自動化攻擊',
    owaspCategory: 'Bot Attack',
    violations: [
      'VIOL_BOT_CLIENT',                 // Bot 用戶端偵測
      'VIOL_BROWSER',                    // 不支援的瀏覽器
      'VIOL_BLOCKING_CONDITION'          // 偵測到阻擋條件
    ]
  },

  // ========== 參數與輸入驗證（Parameter Validation）==========
  PARAMETER_VALIDATION: {
    severity: 'medium',
    displayName: '參數與輸入驗證',
    owaspCategory: 'A03:2021 - Injection',
    violations: [
      'VIOL_PARAMETER',                  // 非法參數
      'VIOL_PARAMETER_VALUE_LENGTH',     // 參數值長度非法
      'VIOL_PARAMETER_DATA_TYPE',        // 參數資料類型非法
      'VIOL_PARAMETER_NUMERIC_VALUE',    // 參數數值非法
      'VIOL_PARAMETER_STATIC_VALUE',     // 靜態參數值非法
      'VIOL_PARAMETER_DYNAMIC_VALUE',    // 動態參數值非法
      'VIOL_PARAMETER_EMPTY_VALUE',      // 參數值為空
      'VIOL_PARAMETER_ARRAY_VALUE',      // 參數陣列值非法
      'VIOL_PARAMETER_VALUE_REGEXP',     // 參數值不符正則表達式
      'VIOL_PARAMETER_NAME_METACHAR',    // 參數名含非法元字符
      'VIOL_PARAMETER_LOCATION',         // 參數位置非法
      'VIOL_PARAMETER_REPEATED',         // 重複的參數名
      'VIOL_PARAMETER_MULTIPART_NULL_VALUE', // Multipart 參數含 NULL
      'VIOL_PARAMETER_VALUE_BASE64',     // Base64 值非法
      'VIOL_MANDATORY_PARAMETER',        // 缺少強制參數
      'VIOL_FLOW_MANDATORY_PARAMS'       // 強制參數數量非法
    ]
  },

  // ========== HTTP 協定合規性（HTTP Protocol Compliance）==========
  HTTP_COMPLIANCE: {
    severity: 'medium',
    displayName: 'HTTP 協定合規性',
    owaspCategory: 'HTTP Protocol Violation',
    violations: [
      'VIOL_HTTP_PROTOCOL',              // HTTP 協定合規性失敗
      'VIOL_METHOD',                     // 非法方法
      'VIOL_HEADER_LENGTH',              // 標頭長度非法
      'VIOL_HEADER_REPEATED',            // 重複的標頭
      'VIOL_MANDATORY_HEADER',           // 缺少強制 HTTP 標頭
      'VIOL_MANDATORY_REQUEST_BODY',     // 缺少強制請求 Body
      'VIOL_POST_DATA_LENGTH',           // POST 資料長度非法
      'VIOL_REQUEST_LENGTH',             // 請求長度非法
      'VIOL_REQUEST_MAX_LENGTH',         // 請求長度超過緩衝區大小
      'VIOL_QUERY_STRING_LENGTH',        // 查詢字串長度非法
      'VIOL_COOKIE_LENGTH',              // Cookie 長度非法
      'VIOL_COOKIE_MALFORMED',           // Cookie 不符 RFC
      'VIOL_URL_CONTENT_TYPE',           // 請求 Content Type 非法
      'VIOL_HTTP_RESPONSE_STATUS',       // 回應中的 HTTP 狀態非法
      'VIOL_HOSTNAME',                   // 非法主機名
      'VIOL_HOSTNAME_MISMATCH',          // 主機名不匹配
      'VIOL_ENCODING',                   // 字元轉換失敗
      'VIOL_REDIRECT'                    // 非法重定向嘗試
    ]
  },

  // ========== WebSocket 攻擊（WebSocket Attacks）==========
  WEBSOCKET_ATTACKS: {
    severity: 'medium',
    displayName: 'WebSocket 攻擊',
    owaspCategory: 'WebSocket Security',
    violations: [
      'VIOL_WEBSOCKET_BAD_REQUEST',      // WebSocket 握手請求錯誤
      'VIOL_WEBSOCKET_FRAMING_PROTOCOL', // WebSocket 框架協定失敗
      'VIOL_WEBSOCKET_FRAME_MASKING',    // 用戶端框架中未找到遮罩
      'VIOL_WEBSOCKET_FRAME_LENGTH',     // WebSocket 框架長度非法
      'VIOL_WEBSOCKET_TEXT_NULL_VALUE',  // WebSocket 文字訊息中的 NULL
      'VIOL_WEBSOCKET_EXTENSION',        // WebSocket 擴展非法
      'VIOL_WEBSOCKET_BINARY_MESSAGE_LENGTH', // WebSocket 二進制訊息長度非法
      'VIOL_WEBSOCKET_FRAMES_PER_MESSAGE_COUNT', // 每訊息框架數非法
      'VIOL_WEBSOCKET_BINARY_MESSAGE_NOT_ALLOWED', // 不允許二進制內容
      'VIOL_WEBSOCKET_TEXT_MESSAGE_NOT_ALLOWED', // 不允許文字內容
      'VIOL_CROSS_ORIGIN_REQUEST'        // 非法跨來源請求
    ]
  },

  // ========== GraphQL 攻擊（GraphQL Attacks）==========
  GRAPHQL_ATTACKS: {
    severity: 'medium',
    displayName: 'GraphQL 攻擊',
    owaspCategory: 'API Security',
    violations: [
      'VIOL_GRAPHQL_MALFORMED',          // 畸形 GraphQL 資料
      'VIOL_GRAPHQL_FORMAT',             // GraphQL 格式不符
      'VIOL_GRAPHQL_INTROSPECTION_QUERY', // GraphQL 內省查詢
      'VIOL_GRAPHQL_ERROR_RESPONSE'      // GraphQL 不允許的回應模式
    ]
  },

  // ========== gRPC 攻擊（gRPC Attacks）==========
  GRPC_ATTACKS: {
    severity: 'medium',
    displayName: 'gRPC 攻擊',
    owaspCategory: 'API Security',
    violations: [
      'VIOL_GRPC_MALFORMED',             // 畸形 gRPC 資料
      'VIOL_GRPC_FORMAT',                // gRPC 格式不符
      'VIOL_GRPC_METHOD'                 // gRPC 方法非法
    ]
  },

  // ========== SOAP/XML Web Services ==========
  SOAP_ATTACKS: {
    severity: 'medium',
    displayName: 'SOAP/XML Web Services 攻擊',
    owaspCategory: 'API Security',
    violations: [
      'VIOL_XML_SOAP_METHOD',            // SOAP 方法不允許
      'VIOL_XML_SOAP_ATTACHMENT',        // SOAP 訊息中的非法附件
      'VIOL_XML_WEB_SERVICES_SECURITY'   // Web Services 安全性失敗
    ]
  },

  // ========== GWT 攻擊（Google Web Toolkit）==========
  GWT_ATTACKS: {
    severity: 'medium',
    displayName: 'GWT 攻擊',
    owaspCategory: 'Framework Security',
    violations: [
      'VIOL_GWT_MALFORMED',              // 畸形 GWT 資料
      'VIOL_GWT_FORMAT'                  // GWT 格式不符
    ]
  },

  // ========== 流程與頁面流控制（Flow Control）==========
  FLOW_CONTROL: {
    severity: 'low',
    displayName: '流程與頁面流控制',
    owaspCategory: 'Business Logic',
    violations: [
      'VIOL_FLOW',                       // 非法流向 URL
      'VIOL_FLOW_ENTRY_POINT',           // 非法入口點
      'VIOL_FLOW_DISALLOWED_INPUT'       // 非法查詢字串或 POST 資料
    ]
  },

  // ========== 規避技術（Evasion Techniques）==========
  EVASION_TECHNIQUES: {
    severity: 'medium',
    displayName: '規避技術',
    owaspCategory: 'Evasion',
    violations: [
      'VIOL_EVASION'                     // 規避技術偵測
    ]
  },

  // ========== 地理位置限制（Geolocation）==========
  GEOLOCATION_VIOLATION: {
    severity: 'low',
    displayName: '地理位置限制',
    owaspCategory: 'Access Control',
    violations: [
      'VIOL_GEOLOCATION'                 // 來自不允許的地理位置
    ]
  },

  // ========== 需進一步檢查（Need Examination）==========
  NEED_EXAMINATION: {
    severity: 'info',
    displayName: '需進一步檢查',
    owaspCategory: 'Unknown',
    violations: [
      'VIOL_RATING_NEED_EXAMINATION',    // 違規評級：需檢查
      'VIOL_PLAINTEXT_FORMAT'            // 純文字格式不符
    ]
  }
};

/**
 * ═══════════════════════════════════════════════════════════
 * 第三部分：F5 攻擊類型對應表
 * ═══════════════════════════════════════════════════════════
 */

/**
 * F5 attack_type 攻擊類型分類與 OWASP 對應
 * 來源：F5 原生日誌 attack_type 欄位與實際觀察
 */
const F5_ATTACK_TYPE_MAPPING = {
  // SQL 注入相關
  'SQL Injection': {
    category: 'INJECTION_ATTACKS',
    severity: 'critical',
    displayName: 'SQL 注入',
    owaspCategory: 'A03:2021 - Injection',
    keywords: ['sql', 'union', 'select', 'insert', 'delete', 'drop', 'database']
  },
  
  // XSS 相關
  'Cross Site Scripting (XSS)': {
    category: 'INJECTION_ATTACKS',
    severity: 'high',
    displayName: '跨站腳本攻擊',
    owaspCategory: 'A03:2021 - Injection',
    keywords: ['xss', 'script', 'javascript', 'onerror', 'onload']
  },
  
  // 命令執行
  'Command Execution': {
    category: 'INJECTION_ATTACKS',
    severity: 'critical',
    displayName: '命令執行',
    owaspCategory: 'A03:2021 - Injection',
    keywords: ['cmd', 'exec', 'shell', 'bash', 'powershell']
  },
  'Remote Command Execution': {
    category: 'INJECTION_ATTACKS',
    severity: 'critical',
    displayName: '遠程命令執行',
    owaspCategory: 'A03:2021 - Injection',
    keywords: ['rce', 'remote', 'execute']
  },
  
  // 路徑遍歷與資訊洩漏
  'Path Traversal': {
    category: 'INFORMATION_DISCLOSURE',
    severity: 'high',
    displayName: '路徑遍歷',
    owaspCategory: 'A01:2021 - Broken Access Control',
    keywords: ['../', '..\\', 'traversal', 'directory']
  },
  'Predictable Resource Location': {
    category: 'INFORMATION_DISCLOSURE',
    severity: 'high',
    displayName: '可預測資源位置',
    owaspCategory: 'A01:2021 - Broken Access Control',
    keywords: ['.git', '.env', 'config', 'backup', '.bak', 'admin']
  },
  'Information Leakage': {
    category: 'INFORMATION_DISCLOSURE',
    severity: 'high',
    displayName: '資訊洩漏',
    owaspCategory: 'A01:2021 - Broken Access Control',
    keywords: ['leak', 'disclosure', 'sensitive']
  },
  'Sensitive Data Exposure': {
    category: 'INFORMATION_DISCLOSURE',
    severity: 'high',
    displayName: '敏感資料暴露',
    owaspCategory: 'A02:2021 - Cryptographic Failures',
    keywords: ['password', 'token', 'key', 'secret']
  },
  
  // 其他注入
  'LDAP Injection': {
    category: 'INJECTION_ATTACKS',
    severity: 'high',
    displayName: 'LDAP 注入',
    owaspCategory: 'A03:2021 - Injection',
    keywords: ['ldap']
  },
  'XML Injection': {
    category: 'INJECTION_ATTACKS',
    severity: 'high',
    displayName: 'XML 注入',
    owaspCategory: 'A03:2021 - Injection',
    keywords: ['xml', 'xxe']
  },
  'XXE (XML External Entity)': {
    category: 'INJECTION_ATTACKS',
    severity: 'critical',
    displayName: 'XML 外部實體注入',
    owaspCategory: 'A03:2021 - Injection',
    keywords: ['xxe', 'entity', 'external']
  },
  
  // DoS 攻擊
  'Denial of Service': {
    category: 'DOS_ATTACKS',
    severity: 'high',
    displayName: '拒絕服務',
    owaspCategory: 'Application DDoS',
    keywords: ['dos', 'ddos', 'flood']
  },
  
  // 其他攻擊
  'Buffer Overflow': {
    category: 'CRITICAL_ATTACKS',
    severity: 'critical',
    displayName: '緩衝區溢位',
    owaspCategory: 'Memory Corruption',
    keywords: ['overflow', 'buffer']
  },
  'Authentication Bypass': {
    category: 'SESSION_ATTACKS',
    severity: 'critical',
    displayName: '認證繞過',
    owaspCategory: 'A07:2021 - Authentication Failures',
    keywords: ['bypass', 'authentication']
  },
  'Session Hijacking': {
    category: 'SESSION_ATTACKS',
    severity: 'high',
    displayName: '會話劫持',
    owaspCategory: 'A07:2021 - Authentication Failures',
    keywords: ['hijack', 'session']
  },
  'Trojan/Backdoor/Spyware': {
    category: 'CRITICAL_ATTACKS',
    severity: 'critical',
    displayName: '木馬/後門/間諜軟體',
    owaspCategory: 'Malware',
    keywords: ['trojan', 'backdoor', 'spyware', 'malware']
  },
  'Malicious File Upload': {
    category: 'CRITICAL_ATTACKS',
    severity: 'critical',
    displayName: '惡意檔案上傳',
    owaspCategory: 'A04:2021 - Insecure Design',
    keywords: ['upload', 'malicious', 'file']
  },
  'Vulnerability Scan': {
    category: 'BOT_ATTACKS',
    severity: 'medium',
    displayName: '漏洞掃描',
    owaspCategory: 'Reconnaissance',
    keywords: ['scan', 'scanner', 'nikto', 'nmap']
  },
  'Brute Force Attack': {
    category: 'SESSION_ATTACKS',
    severity: 'high',
    displayName: '暴力破解攻擊',
    owaspCategory: 'A07:2021 - Authentication Failures',
    keywords: ['brute', 'force', 'password']
  },
  'Server Side Request Forgery': {
    category: 'INJECTION_ATTACKS',
    severity: 'high',
    displayName: '伺服器端請求偽造',
    owaspCategory: 'A10:2021 - SSRF',
    keywords: ['ssrf', 'request', 'forgery']
  },
  'HTTP Protocol Violation': {
    category: 'HTTP_COMPLIANCE',
    severity: 'medium',
    displayName: 'HTTP 協定違規',
    owaspCategory: 'HTTP Protocol Violation',
    keywords: ['http', 'protocol']
  },
  'Other Application Attacks': {
    category: 'CRITICAL_ATTACKS',
    severity: 'medium',
    displayName: '其他應用程式攻擊',
    owaspCategory: 'Others',
    keywords: []
  },
  'Detection Evasion': {
    category: 'EVASION_TECHNIQUES',
    severity: 'medium',
    displayName: '規避偵測',
    owaspCategory: 'Evasion',
    keywords: ['evasion', 'obfuscation', 'encode']
  }
};

/**
 * ═══════════════════════════════════════════════════════════
 * 第四部分：F5 攻擊簽章資料庫
 * ═══════════════════════════════════════════════════════════
 */

/**
 * F5 常見攻擊簽章資料庫
 * 來源：實際 ELK log 觀察與 F5 簽章庫
 * 注意：這是可擴展的資料庫，可從實際日誌中持續累積
 */
const F5_SIGNATURE_DATABASE = {
  // Git 資訊洩漏
  "200010136": {
    name: "/.git/ access",
    displayName: "Git 配置檔案存取",
    category: "INFORMATION_DISCLOSURE",
    severity: "high",
    attackType: "Predictable Resource Location",
    owaspCategory: "A05:2021 - Security Misconfiguration",
    description: "嘗試存取 .git 目錄或配置檔案",
    keywords: ['.git', 'config']
  },
  
  // 常見的攻擊簽章模式（可根據實際 log 持續擴展）
  "200000001": {
    name: "SQL Injection - UNION Attack",
    displayName: "SQL 注入 - UNION 攻擊",
    category: "INJECTION_ATTACKS",
    severity: "critical",
    attackType: "SQL Injection",
    owaspCategory: "A03:2021 - Injection"
  },
  "200000002": {
    name: "XSS - Script Tag",
    displayName: "XSS - Script 標籤",
    category: "INJECTION_ATTACKS",
    severity: "high",
    attackType: "Cross Site Scripting (XSS)",
    owaspCategory: "A03:2021 - Injection"
  },
  "200000003": {
    name: "Path Traversal - Directory",
    displayName: "路徑遍歷 - 目錄",
    category: "INFORMATION_DISCLOSURE",
    severity: "high",
    attackType: "Path Traversal",
    owaspCategory: "A01:2021 - Broken Access Control"
  }
};

/**
 * ═══════════════════════════════════════════════════════════
 * 第五部分：F5 判斷閾值與配置
 * ═══════════════════════════════════════════════════════════
 */

/**
 * F5 違規評分閾值
 * violation_rating 欄位的判斷標準
 */
const F5_VIOLATION_RATING_THRESHOLDS = {
  CRITICAL: 90,    // >= 90 為嚴重威脅
  HIGH: 70,        // >= 70 為高風險
  MEDIUM: 50,      // >= 50 為中風險
  LOW: 30,         // >= 30 為低風險
  INFO: 0          // < 30 為資訊性
};

/**
 * F5 內部路徑白名單（不應被視為攻擊）
 */
const F5_INTERNAL_PATHS = [
  '/tmui/',           // F5 管理介面
  '/f5/',             // F5 內部路徑
  '/sam/',            // F5 SAM 模組
  '/xui/',            // F5 新版管理介面
  '/f5-icontrol/',    // F5 iControl REST API
  '/mgmt/'            // F5 管理 API
];

/**
 * F5 威脅評分權重配置
 * 用於計算統一威脅分數
 */
const F5_THREAT_SCORE_WEIGHTS = {
  request_status: 0.35,      // 35% - 最重要（blocked = 確定攻擊）
  violation_rating: 0.25,    // 25% - 違規評分
  severity: 0.20,            // 20% - 嚴重程度
  threat_level: 0.15,        // 15% - 威脅等級
  signature_match: 0.05      // 5% - 簽章匹配
};

/**
 * ═══════════════════════════════════════════════════════════
 * 第六部分：核心判斷函數 - 多層次判斷模型
 * ═══════════════════════════════════════════════════════════
 */

/**
 * 【核心函數】多層次判斷是否為真實安全威脅
 * 
 * 判斷邏輯分為 4 個層次（優先級由高到低）：
 * Level 1: 確定性指標（最高優先級）
 * Level 2: 綜合評分
 * Level 3: 攻擊類型匹配
 * Level 4: 行為模式分析
 * 
 * @param {object} log - F5 日誌條目
 * @returns {object} { isAttack: boolean, confidence: string, reason: string, level: number }
 */
function isRealSecurityThreat(log) {
  // 前置檢查：排除內部路徑
  if (isF5InternalPath(log.uri)) {
    return {
      isAttack: false,
      confidence: 'certain',
      reason: 'F5 內部路徑（白名單）',
      level: 0
    };
  }

  // ========== Level 1: 確定性指標（最高優先級）==========
  
  // 1.1 請求已被阻擋 → 確定是攻擊
  if (log.request_status && log.request_status.toLowerCase() === 'blocked') {
    return {
      isAttack: true,
      confidence: 'certain',
      reason: 'F5 已阻擋此請求（request_status: blocked）',
      level: 1,
      severity: 'high'
    };
  }

  // 1.2 有攻擊簽章 ID → 確定是攻擊
  if (log.sig_ids && log.sig_ids !== 'N/A' && log.sig_ids !== '' && log.sig_ids !== '0') {
    const sigInfo = F5_SIGNATURE_DATABASE[log.sig_ids];
    return {
      isAttack: true,
      confidence: 'certain',
      reason: `觸發攻擊簽章: ${log.sig_names || log.sig_ids}`,
      level: 1,
      severity: sigInfo?.severity || 'high',
      signatureId: log.sig_ids,
      signatureName: log.sig_names
    };
  }

  // 1.3 威脅等級為 High → 確定是攻擊
  if (log.ThreatLevel && log.ThreatLevel.toLowerCase() === 'high') {
    return {
      isAttack: true,
      confidence: 'certain',
      reason: `F5 威脅等級評估為 High`,
      level: 1,
      severity: 'high'
    };
  }

  // 1.4 嚴重違規類型 → 確定是攻擊
  const criticalViolations = F5_VIOLATION_CLASSIFICATION.CRITICAL_ATTACKS.violations;
  if (log.violations && typeof log.violations === 'string') {
    const hasCriticalViolation = criticalViolations.some(v => 
      log.violations.includes(v) || 
      log.violations.toLowerCase().includes(v.toLowerCase().replace('viol_', ''))
    );
    if (hasCriticalViolation) {
      return {
        isAttack: true,
        confidence: 'certain',
        reason: `觸發嚴重違規: ${log.violations}`,
        level: 1,
        severity: 'critical'
      };
    }
  }

  // ========== Level 2: 綜合評分 ==========
  
  // 2.1 違規評分 >= 70 → 高風險攻擊
  const violationRating = parseFloat(log.violation_rating);
  if (!isNaN(violationRating) && violationRating >= F5_VIOLATION_RATING_THRESHOLDS.HIGH) {
    return {
      isAttack: true,
      confidence: 'high',
      reason: `違規評分達到高風險閾值: ${violationRating}`,
      level: 2,
      severity: violationRating >= 90 ? 'critical' : 'high',
      violationRating: violationRating
    };
  }

  // 2.2 違規評分 >= 50 → 中風險
  if (!isNaN(violationRating) && violationRating >= F5_VIOLATION_RATING_THRESHOLDS.MEDIUM) {
    return {
      isAttack: true,
      confidence: 'medium',
      reason: `違規評分達到中風險閾值: ${violationRating}`,
      level: 2,
      severity: 'medium',
      violationRating: violationRating
    };
  }

  // ========== Level 3: 攻擊類型匹配 ==========
  
  // 3.1 有明確的攻擊類型
  if (log.attack_type && log.attack_type !== 'N/A' && log.attack_type !== '') {
    // ⚠️ 排除 OWASP 分類標籤格式（如 "A05:2025 Security Misconfiguration"）
    // 這些是 Logstash 自動添加的分類標籤，不是攻擊行為
    const isOwaspLabel = /^A\d+:\d{4}\s+/.test(log.attack_type);
    if (isOwaspLabel) {
      // 這只是分類標籤，不是攻擊，跳過此判斷
      console.log(`   ⚠️ 跳過 OWASP 分類標籤: ${log.attack_type}`);
    } else {
      const attackInfo = F5_ATTACK_TYPE_MAPPING[log.attack_type];
      if (attackInfo) {
        return {
          isAttack: true,
          confidence: 'high',
          reason: `偵測到攻擊類型: ${log.attack_type}`,
          level: 3,
          severity: attackInfo.severity,
          attackType: log.attack_type,
          category: attackInfo.category
        };
      }
      // 即使不在對應表中，有 attack_type 也視為攻擊
      return {
        isAttack: true,
        confidence: 'medium',
        reason: `偵測到攻擊類型（未分類）: ${log.attack_type}`,
        level: 3,
        severity: 'medium',
        attackType: log.attack_type
      };
    }
  }

  // 3.2 違規類型匹配（注入攻擊類）
  if (log.violations && typeof log.violations === 'string') {
    const injectionViolations = F5_VIOLATION_CLASSIFICATION.INJECTION_ATTACKS.violations;
    const hasInjectionViolation = injectionViolations.some(v => log.violations.includes(v));
    if (hasInjectionViolation) {
      return {
        isAttack: true,
        confidence: 'high',
        reason: `偵測到注入攻擊違規: ${log.violations}`,
        level: 3,
        severity: 'high'
      };
    }
  }

  // ========== Level 4: 行為模式分析 ==========
  
  // 4.1 嚴重程度 + 違規組合
  const severityMapping = F5_SEVERITY_MAPPING[log.severity];
  if (severityMapping && severityMapping.value >= 4) { // Error 或更嚴重
    if (log.violations && log.violations !== 'N/A' && log.violations !== '') {
      return {
        isAttack: true,
        confidence: 'medium',
        reason: `高嚴重程度 (${log.severity}) + 違規組合`,
        level: 4,
        severity: severityMapping.label
      };
    }
  }

  // 4.2 多個弱信號組合（2個以上）
  let weakSignals = 0;
  let signalReasons = [];

  if (violationRating >= F5_VIOLATION_RATING_THRESHOLDS.LOW) {
    weakSignals++;
    signalReasons.push(`violation_rating=${violationRating}`);
  }
  if (log.ThreatLevel && log.ThreatLevel.toLowerCase() === 'medium') {
    weakSignals++;
    signalReasons.push('ThreatLevel=Medium');
  }
  if (log.violations && log.violations !== 'N/A' && log.violations !== '') {
    weakSignals++;
    signalReasons.push('has_violations');
  }
  if (severityMapping && severityMapping.value >= 3) {
    weakSignals++;
    signalReasons.push(`severity=${log.severity}`);
  }

  if (weakSignals >= 2) {
    return {
      isAttack: true,
      confidence: 'low',
      reason: `多個弱信號組合: ${signalReasons.join(', ')}`,
      level: 4,
      severity: 'low',
      weakSignals: weakSignals
    };
  }

  // ========== 最終安全檢查 ==========
  // 如果 request_status === 'passed'，且沒有任何強信號，則不應判定為攻擊
  if (log.request_status && log.request_status.toLowerCase() === 'passed') {
    if (violationRating < F5_VIOLATION_RATING_THRESHOLDS.LOW && weakSignals < 2) {
      return {
        isAttack: false,
        confidence: 'high',
        reason: 'request_status 為 passed 且無足夠證據（正常流量）',
        level: 0
      };
    }
  }

  // ========== 判定為正常流量 ==========
  return {
    isAttack: false,
    confidence: 'high',
    reason: '未符合任何攻擊判斷條件',
    level: 0
  };
}

/**
 * 計算 F5 統一威脅分數（0-100）
 * 分數越高表示威脅越低，類似 Cloudflare
 * 0-30: 確定攻擊
 * 31-50: 高風險
 * 51-70: 中風險
 * 71-85: 低風險
 * 86-100: 正常流量
 * 
 * @param {object} log - F5 日誌條目
 * @returns {number} 威脅分數 (0-100)
 */
function calculateThreatScore(log) {
  let score = 100; // 從完美分數開始扣分

  // 1. request_status 影響（35%權重）
  if (log.request_status) {
    const statusLower = log.request_status.toLowerCase();
    if (statusLower === 'blocked') {
      score -= 35; // 直接扣35分
    } else if (statusLower === 'alerted') {
      score -= 25;
    } else if (statusLower === 'logged') {
      score -= 10;
    }
  }

  // 2. violation_rating 影響（25%權重）
  const violationRating = parseFloat(log.violation_rating);
  if (!isNaN(violationRating) && violationRating > 0) {
    // violation_rating 越高，扣分越多
    // 假設 rating 範圍 0-100，反向計算
    score -= (violationRating / 100) * 25;
  }

  // 3. severity 影響（20%權重）
  const severityMapping = F5_SEVERITY_MAPPING[log.severity];
  if (severityMapping) {
    const severityImpact = (severityMapping.value / 5) * 20;
    score -= severityImpact;
  }

  // 4. ThreatLevel 影響（15%權重）
  const threatMapping = F5_THREAT_LEVEL_MAPPING[log.ThreatLevel];
  if (threatMapping) {
    score -= (1 - threatMapping.score / 100) * 15;
  }

  // 5. signature 匹配影響（5%權重）
  if (log.sig_ids && log.sig_ids !== 'N/A' && log.sig_ids !== '' && log.sig_ids !== '0') {
    const sigInfo = F5_SIGNATURE_DATABASE[log.sig_ids];
    if (sigInfo) {
      score -= sigInfo.severity === 'critical' ? 5 : 3;
    } else {
      score -= 4; // 未知簽章
    }
  }

  // 確保分數在 0-100 範圍內
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * 根據威脅分數分類威脅等級
 * @param {number} score - 威脅分數 (0-100)
 * @returns {object} 分類資訊
 */
function classifyByThreatScore(score) {
  if (score <= 30) {
    return {
      label: 'attack',
      displayName: '確定攻擊',
      severity: 'critical',
      color: 'red'
    };
  }
  if (score <= 50) {
    return {
      label: 'high_risk',
      displayName: '高風險',
      severity: 'high',
      color: 'orange'
    };
  }
  if (score <= 70) {
    return {
      label: 'medium_risk',
      displayName: '中風險',
      severity: 'medium',
      color: 'yellow'
    };
  }
  if (score <= 85) {
    return {
      label: 'low_risk',
      displayName: '低風險',
      severity: 'low',
      color: 'blue'
    };
  }
  return {
    label: 'clean',
    displayName: '正常流量',
    severity: 'info',
    color: 'green'
  };
}

/**
 * 根據 violation_rating 分類嚴重程度
 * @param {number|string} violationRating - 違規評分
 * @returns {string} 嚴重程度 (critical/high/medium/low/info)
 */
function getSeverityByViolationRating(violationRating) {
  const rating = parseFloat(violationRating);
  if (isNaN(rating)) return 'info';
  
  if (rating >= F5_VIOLATION_RATING_THRESHOLDS.CRITICAL) return 'critical';
  if (rating >= F5_VIOLATION_RATING_THRESHOLDS.HIGH) return 'high';
  if (rating >= F5_VIOLATION_RATING_THRESHOLDS.MEDIUM) return 'medium';
  if (rating >= F5_VIOLATION_RATING_THRESHOLDS.LOW) return 'low';
  return 'info';
}

/**
 * 根據 attack_type 獲取攻擊分類
 * @param {string} attackType - F5 攻擊類型
 * @returns {object} 攻擊分類資訊
 */
function getAttackCategory(attackType) {
  if (!attackType || attackType === 'N/A' || attackType === '') {
    return null;
  }
  
  const mapping = F5_ATTACK_TYPE_MAPPING[attackType];
  if (mapping) {
    return {
      type: attackType,
      category: mapping.category,
      severity: mapping.severity,
      displayName: mapping.displayName,
      owaspCategory: mapping.owaspCategory
    };
  }
  
  // 如果不在對應表中，嘗試關鍵字匹配
  const attackLower = attackType.toLowerCase();
  for (const [key, value] of Object.entries(F5_ATTACK_TYPE_MAPPING)) {
    if (value.keywords && value.keywords.some(kw => attackLower.includes(kw))) {
      return {
        type: attackType,
        category: value.category,
        severity: value.severity,
        displayName: value.displayName,
        owaspCategory: value.owaspCategory,
        matchedByKeyword: true
      };
    }
  }
  
  return {
    type: attackType,
    category: 'UNKNOWN',
    severity: 'medium',
    displayName: attackType,
    owaspCategory: 'Others'
  };
}

/**
 * 根據 violations 獲取違規分類
 * @param {string} violations - F5 違規類型
 * @returns {object} 違規分類資訊
 */
function getViolationCategory(violations) {
  if (!violations || violations === 'N/A' || violations === '') {
    return null;
  }

  for (const [categoryKey, categoryInfo] of Object.entries(F5_VIOLATION_CLASSIFICATION)) {
    const matchedViolation = categoryInfo.violations.find(v => 
      violations.includes(v) || 
      violations.toLowerCase().includes(v.toLowerCase().replace('viol_', ''))
    );
    
    if (matchedViolation) {
      return {
        violation: violations,
        category: categoryKey,
        severity: categoryInfo.severity,
        displayName: categoryInfo.displayName,
        owaspCategory: categoryInfo.owaspCategory,
        matchedRule: matchedViolation
      };
    }
  }

  return {
    violation: violations,
    category: 'UNKNOWN',
    severity: 'medium',
    displayName: '未分類違規',
    owaspCategory: 'Others'
  };
}

/**
 * 檢查 URI 是否為 F5 內部路徑
 * @param {string} uri - 請求 URI
 * @returns {boolean} 是否為內部路徑
 */
function isF5InternalPath(uri) {
  if (!uri || typeof uri !== 'string') {
    return false;
  }
  
  return F5_INTERNAL_PATHS.some(path => uri.startsWith(path));
}

/**
 * 檢查是否為高風險攻擊
 * @param {object} log - F5 日誌條目
 * @returns {boolean} 是否為高風險
 */
function isHighRiskAttack(log) {
  const threatResult = isRealSecurityThreat(log);
  if (!threatResult.isAttack) {
    return false;
  }
  
  return threatResult.severity === 'critical' || 
         threatResult.severity === 'high' ||
         threatResult.confidence === 'certain';
}

/**
 * 綜合分析單個日誌條目
 * @param {object} log - F5 日誌條目
 * @returns {object} 完整分析結果
 */
function analyzeLogEntry(log) {
  const threatResult = isRealSecurityThreat(log);
  const threatScore = calculateThreatScore(log);
  const scoreClassification = classifyByThreatScore(threatScore);
  const attackCategory = getAttackCategory(log.attack_type);
  const violationCategory = getViolationCategory(log.violations);

  return {
    // 基本判斷結果
    isAttack: threatResult.isAttack,
    confidence: threatResult.confidence,
    reason: threatResult.reason,
    judgmentLevel: threatResult.level,
    
    // 威脅評分
    threatScore: threatScore,
    scoreClassification: scoreClassification,
    
    // 嚴重程度
    severity: threatResult.severity || scoreClassification.severity,
    
    // 分類資訊
    attackCategory: attackCategory,
    violationCategory: violationCategory,
    
    // 原始資料
    originalData: {
      request_status: log.request_status,
      violation_rating: log.violation_rating,
      severity: log.severity,
      ThreatLevel: log.ThreatLevel,
      attack_type: log.attack_type,
      violations: log.violations,
      sig_ids: log.sig_ids,
      sig_names: log.sig_names
    }
  };
}

/**
 * ═══════════════════════════════════════════════════════════
 * 匯出所有配置與函數
 * ═══════════════════════════════════════════════════════════
 */

module.exports = {
  // 配置對應表
  F5_SEVERITY_MAPPING,
  F5_THREAT_LEVEL_MAPPING,
  F5_REQUEST_STATUS_MAPPING,
  F5_VIOLATION_CLASSIFICATION,
  F5_ATTACK_TYPE_MAPPING,
  F5_SIGNATURE_DATABASE,
  
  // 閾值與配置
  F5_VIOLATION_RATING_THRESHOLDS,
  F5_INTERNAL_PATHS,
  F5_THREAT_SCORE_WEIGHTS,
  
  // 核心判斷函數
  isRealSecurityThreat,           // 多層次判斷是否為攻擊
  calculateThreatScore,            // 計算威脅分數
  classifyByThreatScore,           // 根據分數分類
  
  // 分類與分析函數
  getSeverityByViolationRating,   // 根據評分獲取嚴重程度
  getAttackCategory,               // 獲取攻擊分類
  getViolationCategory,            // 獲取違規分類
  
  // 輔助函數
  isF5InternalPath,                // 檢查是否為內部路徑
  isHighRiskAttack,                // 檢查是否為高風險
  analyzeLogEntry,                 // 綜合分析日誌
  
  // 向後兼容的函數（保留舊版介面）
  classifyF5Severity: (severityValue) => {
    // 舊版函數，根據數值分類
    if (severityValue === 5) return { label: 'critical', value: 5 };
    if (severityValue === 4) return { label: 'high', value: 4 };
    if (severityValue === 3) return { label: 'medium', value: 3 };
    if (severityValue === 2) return { label: 'low', value: 2 };
    return { label: 'info', value: 1 };
  }
};
