// backend/config/products/checkpoint/checkpointStandards.js
// Check Point 防火牆安全標準配置 - 三層判斷模型
// 基於 Check Point Firewall + Application Control + URL Filtering
// 參考文件: https://sc1.checkpoint.com/documents/R80.40/WebAdminGuides/EN/CP_R80.40_SecurityManagement_AdminGuide/

/**
 * ═══════════════════════════════════════════════════════════
 * 設計理念：Check Point 三層判斷模型
 * ═══════════════════════════════════════════════════════════
 * 
 * Layer 1: 應用程式風險評估 (app_risk 0-5) - 技術風險評估
 * Layer 2: 被封鎖的流量分析 (action) - 確定的安全威脅
 * Layer 3: 違反公司政策的行為 (app_category) - 政策合規性
 * 
 * 威脅判斷優先級：
 * 1. action = Drop/Reject → 確定威脅（最高優先級）
 * 2. app_risk = 4/5 → 高風險應用
 * 3. app_category 違規 → 政策違規
 * 4. 多因素綜合判斷
 */

/**
 * ═══════════════════════════════════════════════════════════
 * 第一部分：應用程式風險等級對應表 (app_risk: 0-5)
 * ═══════════════════════════════════════════════════════════
 */

/**
 * Check Point Application Risk Level 對應表
 * 來源：Check Point Application Control Database
 * 
 * Risk Values:
 * - 5 = Critical (嚴重風險)
 * - 4 = High (高風險)
 * - 3 = Medium (中風險)
 * - 2 = Low (低風險)
 * - 1 = Very Low (極低風險)
 * - 0 = Unknown (未知)
 */
const CHECKPOINT_APP_RISK_MAPPING = {
  5: {
    value: 5,
    label: 'critical',
    displayName: '嚴重風險',
    severity: 'critical',
    color: 'red',
    priority: 1,
    description: '應用程式具有嚴重安全風險，可能導致資料洩漏、系統入侵或規避安全控制',
    aiContext: '此應用程式被 Check Point 評估為最高風險等級，建議立即封鎖或進行嚴格監控',
    action_recommendation: 'Block',
    business_impact: '嚴重影響資訊安全與法規合規',
    examples: [
      'Tor Network（匿名網路，規避監控）',
      'Cryptocurrency Mining（加密貨幣挖礦，消耗資源）',
      'Known Malware Communication（惡意軟體通訊）',
      'Anonymous Proxy（匿名代理）',
      'Hacking Tools（駭客工具）'
    ]
  },
  4: {
    value: 4,
    label: 'high',
    displayName: '高風險',
    severity: 'high',
    color: 'orange',
    priority: 2,
    description: '應用程式具有明顯安全風險，可能被濫用於攻擊或未授權存取',
    aiContext: '此應用程式需要特別關注，可能被用於規避安全控制或資料外洩',
    action_recommendation: 'Monitor or Challenge',
    business_impact: '可能影響資訊安全與業務運作',
    examples: [
      'TeamViewer（遠端控制工具）',
      'Proxy/VPN Applications（代理/VPN 應用）',
      'P2P File Sharing（P2P 檔案分享）',
      'Remote Desktop Tools（遠端桌面工具）',
      'Unauthorized Cloud Storage（未授權雲端儲存）'
    ]
  },
  3: {
    value: 3,
    label: 'medium',
    displayName: '中風險',
    severity: 'medium',
    color: 'yellow',
    priority: 3,
    description: '應用程式具有中等風險，可能影響生產力、頻寬或資料安全',
    aiContext: '建議根據公司政策決定是否允許使用，或限制使用時間與範圍',
    action_recommendation: 'Policy-Based Control',
    business_impact: '可能影響工作效率或頻寬資源',
    examples: [
      'Social Media（社交媒體：Facebook, Instagram, Twitter）',
      'Streaming Media（串流媒體：YouTube, Netflix）',
      'Cloud Storage（雲端儲存：Dropbox, Google Drive）',
      'Online Gaming（線上遊戲）',
      'Instant Messaging（即時通訊）'
    ]
  },
  2: {
    value: 2,
    label: 'low',
    displayName: '低風險',
    severity: 'low',
    color: 'blue',
    priority: 4,
    description: '應用程式風險較低，通常為業務相關應用，但仍需監控使用情況',
    aiContext: '通常為業務相關應用，風險低但建議記錄使用情況以供稽核',
    action_recommendation: 'Allow with Logging',
    business_impact: '對業務運作影響小',
    examples: [
      'Business Applications（業務應用程式）',
      'Email Services（電子郵件服務）',
      'Collaboration Tools（協作工具：Slack, Teams）',
      'Web Conferencing（視訊會議：Zoom, Webex）',
      'Document Management（文件管理系統）'
    ]
  },
  1: {
    value: 1,
    label: 'very_low',
    displayName: '極低風險',
    severity: 'info',
    color: 'green',
    priority: 5,
    description: '應用程式風險極低，通常為企業必要服務或安全更新',
    aiContext: '通常為企業必要服務、作業系統更新或安全應用，可安全使用',
    action_recommendation: 'Allow',
    business_impact: '業務必要，無負面影響',
    examples: [
      'Windows Update（Windows 更新）',
      'Antivirus Updates（防毒軟體更新）',
      'DNS Services（DNS 服務）',
      'NTP Services（時間同步服務）',
      'Certificate Validation（憑證驗證）'
    ]
  },
  0: {
    value: 0,
    label: 'unknown',
    displayName: '未知風險',
    severity: 'info',
    color: 'gray',
    priority: 6,
    description: 'Check Point 無法識別此應用程式的風險等級，需要人工審查',
    aiContext: '此應用未在 Check Point 資料庫中，需要人工審查或更新應用程式簽章資料庫',
    action_recommendation: 'Review Required',
    business_impact: '需要進一步評估',
    examples: [
      'Custom Applications（自訂應用程式）',
      'New/Unknown Applications（新的/未知應用）',
      'Generic Traffic（通用流量）'
    ]
  }
};

/**
 * ═══════════════════════════════════════════════════════════
 * 第二部分：防火牆動作與威脅等級對應表
 * ═══════════════════════════════════════════════════════════
 */

/**
 * Check Point Firewall Action 對應表
 * 來源：Check Point Security Policy Actions
 * 
 * Actions:
 * - Drop: 靜默丟棄（不回應來源端）
 * - Reject: 拒絕並回應（回傳 RST/ICMP）
 * - Accept: 允許通過
 * - Encrypt: VPN 加密通道
 */
const CHECKPOINT_ACTION_MAPPING = {
  'Drop': {
    isBlocked: true,
    isThreat: true,
    isAttack: true,
    severity: 'critical',
    displayName: '已封鎖（Drop）',
    color: 'red',
    priority: 1,
    description: '流量被防火牆靜默丟棄，不回應來源端（Silently Drop）',
    aiContext: '此流量已被確認為威脅並封鎖，表示觸發了 IPS、反惡意軟體或安全規則',
    reason_categories: [
      '觸發 IPS 入侵防禦簽章',
      '來自惡意 IP 地址（Threat Intelligence）',
      '違反嚴格安全政策',
      '高風險應用程式（app_risk >= 4）',
      '已知惡意軟體通訊',
      'DDoS 攻擊流量'
    ],
    typical_scenarios: [
      'SQL Injection 攻擊',
      'Malware C&C 通訊',
      '來自黑名單國家的流量',
      '暴力破解嘗試'
    ]
  },
  'Reject': {
    isBlocked: true,
    isThreat: true,
    isAttack: false,
    severity: 'high',
    displayName: '已拒絕（Reject）',
    color: 'orange',
    priority: 2,
    description: '流量被防火牆拒絕，並回應 RST 或 ICMP 拒絕訊息給來源端',
    aiContext: '此流量違反規則但不一定是攻擊，可能是政策限制、未授權應用或時間限制',
    reason_categories: [
      '違反公司應用程式使用政策',
      '未授權的應用程式（如個人 VPN）',
      '時間限制規則（非上班時間）',
      '頻寬限制超標',
      '未通過身份驗證',
      '地理位置限制'
    ],
    typical_scenarios: [
      '員工存取被禁止的社交媒體',
      '使用個人雲端儲存服務',
      '非工作時間存取特定資源'
    ]
  },
  'Accept': {
    isBlocked: false,
    isThreat: false,
    isAttack: false,
    severity: 'info',
    displayName: '已允許（Accept）',
    color: 'green',
    priority: 5,
    description: '流量被允許通過防火牆，符合安全規則',
    aiContext: '此流量符合安全規則並被允許，但仍需根據 app_risk 和 app_category 評估潛在風險',
    reason_categories: [
      '符合安全規則',
      '已授權的應用程式',
      '正常業務流量',
      '信任的來源 IP',
      '已通過身份驗證'
    ],
    typical_scenarios: [
      '正常 HTTPS 網頁瀏覽',
      '企業郵件服務',
      'Windows Update',
      '已授權的雲端服務'
    ]
  },
  'Encrypt': {
    isBlocked: false,
    isThreat: false,
    isAttack: false,
    severity: 'info',
    displayName: '已加密（Encrypt）',
    color: 'blue',
    priority: 4,
    description: '流量通過 VPN 加密通道（Site-to-Site 或 Remote Access VPN）',
    aiContext: 'VPN 流量，需要額外檢查加密通道內的實際流量內容',
    reason_categories: [
      'Site-to-Site VPN',
      'Remote Access VPN',
      'IPsec 隧道',
      'SSL VPN'
    ],
    typical_scenarios: [
      '分支機構與總部的 VPN 連線',
      '遠端員工 VPN 存取',
      '合作夥伴專用 VPN 通道'
    ]
  }
};

/**
 * ═══════════════════════════════════════════════════════════
 * 第三部分：違反公司政策的應用程式類別
 * ═══════════════════════════════════════════════════════════
 */

/**
 * 違反公司政策的應用程式類別分類
 * 來源：Check Point Application Categories + URL Filtering Categories
 * 參考：https://sc1.checkpoint.com/documents/R80.40/.../Creating-Application-Control-and-URL-Filtering-Rules.htm
 */
const POLICY_VIOLATION_CATEGORIES = {
  // ========== 嚴重違規類別（Critical Violations）==========
  'Anonymizer': {
    severity: 'critical',
    violation_type: 'SECURITY_BYPASS',
    displayName: '匿名代理工具',
    owaspCategory: 'A05:2021 - Security Misconfiguration',
    description: '使用匿名代理、VPN 或 Tor 工具規避安全監控',
    policy_impact: '破壞安全可見性，無法監控實際流量內容，可能用於資料外洩或存取惡意網站',
    action_recommendation: 'Block',
    recommended_action: 'Drop + Alert + Log',
    legal_risk: '高度法律風險',
    compliance_impact: ['違反資訊安全政策', '影響稽核追蹤', '可能違反法規要求'],
    keywords: ['proxy', 'vpn', 'tor', 'anonymizer', 'tunneling', 'ultrasurf', 'psiphon']
  },

  'Cryptocurrency Mining': {
    severity: 'critical',
    violation_type: 'RESOURCE_ABUSE',
    displayName: '加密貨幣挖礦',
    owaspCategory: 'Resource Abuse',
    description: '使用公司運算資源進行加密貨幣挖礦（Bitcoin, Ethereum 等）',
    policy_impact: '嚴重消耗 CPU/GPU 資源，導致系統效能下降，增加電力成本，影響業務運作',
    action_recommendation: 'Block',
    recommended_action: 'Drop + Alert + Investigate',
    legal_risk: '可能涉及盜用公司資源',
    compliance_impact: ['違反資源使用政策', '影響系統效能', '增加營運成本'],
    keywords: ['mining', 'cryptocurrency', 'bitcoin', 'ethereum', 'monero', 'miner']
  },

  'Malicious Sites': {
    severity: 'critical',
    violation_type: 'SECURITY_THREAT',
    displayName: '惡意網站',
    owaspCategory: 'A03:2021 - Injection',
    description: '存取已知的惡意網站、釣魚網站或惡意軟體散佈站點',
    policy_impact: '可能導致惡意軟體感染、憑證竊取、資料外洩',
    action_recommendation: 'Block',
    recommended_action: 'Drop + Alert + Endpoint Scan',
    legal_risk: '極高安全風險',
    compliance_impact: ['系統感染風險', '資料外洩風險', '影響其他系統安全'],
    keywords: ['malware', 'phishing', 'c2', 'command and control', 'exploit']
  },

  // ========== 高風險違規類別（High Risk Violations）==========
  'Pornography': {
    severity: 'high',
    violation_type: 'CONTENT_VIOLATION',
    displayName: '色情內容',
    owaspCategory: 'Content Policy Violation',
    description: '存取色情網站或成人內容',
    policy_impact: '違反公司行為規範，可能造成性騷擾法律風險，影響工作環境',
    action_recommendation: 'Block + UserCheck',
    recommended_action: 'Block + Notify User + HR Report',
    legal_risk: '可能涉及性騷擾法律責任',
    compliance_impact: ['違反員工行為規範', '職場倫理問題', '法律責任風險'],
    keywords: ['porn', 'adult', 'xxx', 'sex', 'pornography']
  },

  'Gambling': {
    severity: 'high',
    violation_type: 'CONTENT_VIOLATION',
    displayName: '賭博網站',
    owaspCategory: 'Content Policy Violation',
    description: '存取線上賭博、博弈或彩券網站',
    policy_impact: '違反公司政策，可能造成員工財務損失，影響工作專注力',
    action_recommendation: 'Block + UserCheck',
    recommended_action: 'Block + Notify User + Log',
    legal_risk: '可能違反賭博相關法規',
    compliance_impact: ['違反公司使用政策', '影響工作效率', '潛在法律風險'],
    keywords: ['gambling', 'casino', 'betting', 'lottery', 'poker']
  },

  'Remote Administration': {
    severity: 'high',
    violation_type: 'SECURITY_RISK',
    displayName: '遠端管理工具',
    owaspCategory: 'A01:2021 - Broken Access Control',
    description: '使用遠端管理工具（TeamViewer, AnyDesk, Radmin 等）',
    policy_impact: '可能被濫用於未授權存取、資料竊取或規避監控',
    action_recommendation: 'Policy-Based (僅允許 IT 部門)',
    recommended_action: 'Allow for IT + Block for Others + Log',
    allowed_users: ['IT_Department', 'Technical_Support'],
    allowed_groups: ['IT_Admins', 'Help_Desk'],
    legal_risk: '中度安全風險',
    compliance_impact: ['未授權存取風險', '資料外洩風險', '需要嚴格監控'],
    keywords: ['teamviewer', 'anydesk', 'remote desktop', 'vnc', 'radmin', 'remote control']
  },

  'P2P File Sharing': {
    severity: 'high',
    violation_type: 'DATA_LEAKAGE',
    displayName: 'P2P 檔案分享',
    owaspCategory: 'A04:2021 - Insecure Design',
    description: '使用 P2P 檔案分享軟體（BitTorrent, eMule 等）',
    policy_impact: '可能導致機密資料外洩、惡意軟體感染、版權侵權問題',
    action_recommendation: 'Block',
    recommended_action: 'Drop + Alert + Log',
    legal_risk: '版權侵權風險',
    compliance_impact: ['資料外洩風險', '惡意軟體感染', '版權法律問題'],
    keywords: ['bittorrent', 'p2p', 'torrent', 'emule', 'file sharing', 'peer to peer']
  },

  // ========== 中風險違規類別（Medium Risk - 需監控）==========
  'Social Media': {
    severity: 'medium',
    violation_type: 'PRODUCTIVITY_IMPACT',
    displayName: '社交媒體',
    owaspCategory: 'Productivity Policy',
    description: '使用社交媒體平台（Facebook, Instagram, Twitter, LinkedIn）',
    policy_impact: '可能影響工作效率，需根據部門政策管理，部分部門（如行銷）可能需要使用',
    action_recommendation: 'Time-Based Control',
    recommended_action: 'Limit During Work Hours + Allow Break Times',
    time_restriction: '工作時間內限制使用（09:00-17:00）',
    allowed_departments: ['Marketing', 'PR', 'Social_Media_Team'],
    legal_risk: '低風險',
    compliance_impact: ['可能影響工作效率', '資訊洩漏風險（發布機密）'],
    keywords: ['facebook', 'instagram', 'twitter', 'linkedin', 'social', 'tiktok']
  },

  'Streaming Media': {
    severity: 'medium',
    violation_type: 'BANDWIDTH_CONSUMPTION',
    displayName: '串流媒體',
    owaspCategory: 'Bandwidth Policy',
    description: '使用影音串流服務（YouTube, Netflix, Spotify）',
    policy_impact: '消耗大量頻寬，影響業務關鍵流量，降低整體網路效能',
    action_recommendation: 'Bandwidth Limit + Time Control',
    recommended_action: 'Limit Bandwidth (1 Gbps) + Allow After Hours',
    bandwidth_limit: '1 Gbps',
    time_restriction: '非上班時間允許（12:00-13:00, 18:00-09:00）',
    legal_risk: '無',
    compliance_impact: ['頻寬資源消耗', '影響業務流量', '降低網路效能'],
    keywords: ['youtube', 'netflix', 'streaming', 'video', 'spotify', 'music']
  },

  'Cloud Storage': {
    severity: 'medium',
    violation_type: 'DATA_LEAKAGE',
    displayName: '個人雲端儲存',
    owaspCategory: 'A02:2021 - Cryptographic Failures',
    description: '使用個人雲端儲存服務（個人 Dropbox, Google Drive, OneDrive）',
    policy_impact: '可能導致機密資料未經授權上傳至個人帳號，資料外洩風險',
    action_recommendation: 'Monitor + Data Loss Prevention',
    recommended_action: 'Allow Corporate Accounts + Block Personal + DLP Scan',
    allowed_services: ['Corporate OneDrive', 'Corporate Google Workspace'],
    blocked_services: ['Personal Dropbox', 'Personal Google Drive'],
    legal_risk: '資料外洩風險',
    compliance_impact: ['資料外洩風險', '違反資料保護政策', '稽核困難'],
    keywords: ['dropbox', 'google drive', 'onedrive', 'cloud storage', 'box', 'mega']
  },

  'Online Gaming': {
    severity: 'medium',
    violation_type: 'PRODUCTIVITY_IMPACT',
    displayName: '線上遊戲',
    owaspCategory: 'Productivity Policy',
    description: '存取線上遊戲平台或進行遊戲',
    policy_impact: '嚴重影響工作效率，消耗頻寬資源',
    action_recommendation: 'Block',
    recommended_action: 'Block During Work Hours + Allow After Hours',
    time_restriction: '工作時間全面封鎖',
    legal_risk: '無',
    compliance_impact: ['嚴重影響工作效率', '頻寬消耗'],
    keywords: ['gaming', 'game', 'steam', 'xbox', 'playstation', 'online game']
  },

  // ========== 低風險類別（允許但記錄）==========
  'Software Update': {
    severity: 'low',
    violation_type: 'NONE',
    displayName: '軟體更新',
    owaspCategory: 'Legitimate Business',
    description: '系統或軟體更新服務（Windows Update, Adobe Update 等）',
    policy_impact: '業務必要，低風險，有助於系統安全',
    action_recommendation: 'Allow with Logging',
    recommended_action: 'Accept + Log',
    legal_risk: '無',
    compliance_impact: ['業務必要', '提升安全性'],
    keywords: ['update', 'patch', 'windows update', 'adobe update']
  },

  'Business Applications': {
    severity: 'low',
    violation_type: 'NONE',
    displayName: '業務應用程式',
    owaspCategory: 'Legitimate Business',
    description: '正常業務應用程式（ERP, CRM, 協作工具）',
    policy_impact: '業務必要，支援日常運作',
    action_recommendation: 'Allow with Logging',
    recommended_action: 'Accept + Log',
    legal_risk: '無',
    compliance_impact: ['業務必要'],
    keywords: ['business', 'erp', 'crm', 'salesforce', 'sap', 'oracle']
  }
};

/**
 * ═══════════════════════════════════════════════════════════
 * 第四部分：Check Point 配置與閾值
 * ═══════════════════════════════════════════════════════════
 */

/**
 * Check Point 威脅判斷閾值
 */
const CHECKPOINT_THRESHOLDS = {
  APP_RISK: {
    CRITICAL: 5,      // app_risk >= 5 為嚴重威脅
    HIGH: 4,          // app_risk >= 4 為高風險
    MEDIUM: 3,        // app_risk >= 3 為中風險
    LOW: 2            // app_risk >= 2 為低風險
  },
  
  // 威脅評分閾值（0-100，分數越低風險越高）
  THREAT_SCORE: {
    CRITICAL: 30,     // <= 30 為嚴重威脅
    HIGH: 50,         // <= 50 為高風險
    MEDIUM: 70,       // <= 70 為中風險
    LOW: 85           // <= 85 為低風險
  }
};

/**
 * Check Point 威脅評分權重配置
 */
const CHECKPOINT_THREAT_SCORE_WEIGHTS = {
  action: 0.40,           // 40% - 防火牆動作（最重要）
  app_risk: 0.35,         // 35% - 應用程式風險
  app_category: 0.25      // 25% - 政策違規
};

/**
 * Check Point 安全區域風險矩陣
 * 評估不同安全區域之間的流量風險
 */
const SECURITY_ZONE_RISK_MATRIX = {
  // 從不信任區域到信任區域 = 高風險
  'untrust_to_trust': {
    inzone_pattern: /untrust|external|internet/i,
    outzone_pattern: /trust|internal|dmz/i,
    risk_score: 30,
    description: '外部不信任區域流向內部信任區域，需要嚴格檢查'
  },
  // 從 DMZ 到內部 = 中風險
  'dmz_to_internal': {
    inzone_pattern: /dmz/i,
    outzone_pattern: /trust|internal/i,
    risk_score: 15,
    description: 'DMZ 區域流向內部區域，需要監控'
  },
  // 內部到外部 = 低風險（正常出站流量）
  'internal_to_external': {
    inzone_pattern: /trust|internal/i,
    outzone_pattern: /untrust|external|internet/i,
    risk_score: 5,
    description: '內部流向外部，正常出站流量但需監控'
  }
};

/**
 * ═══════════════════════════════════════════════════════════
 * 第五部分：核心判斷函數 - 三層判斷模型
 * ═══════════════════════════════════════════════════════════
 */

/**
 * 【核心函數】判斷是否為真實安全威脅
 * 
 * 判斷邏輯分為 4 層（優先級由高到低）：
 * Layer 1: 被封鎖的流量（action = Drop/Reject）→ 確定威脅
 * Layer 2: 應用程式風險評估（app_risk = 4/5）→ 高風險應用
 * Layer 3: 違反公司政策（app_category）→ 政策違規
 * Layer 4: 綜合分析（多個風險因素組合）→ 可疑行為
 * 
 * @param {object} log - Check Point 日誌條目
 * @returns {object} { isAttack: boolean, isThreat: boolean, confidence: string, reason: string, layer: string, severity: string }
 */
function isRealSecurityThreat(log) {
  // ========== Layer 1: 被封鎖的流量 = 確定威脅（最高優先級）==========
  
  // 1.1 流量被 Drop（靜默丟棄）→ 確定是威脅
  if (log.action === 'Drop') {
    return {
      isAttack: true,
      isThreat: true,
      confidence: 'certain',
      reason: `流量已被防火牆封鎖 (Drop)${log.appi_name ? ` - 應用: ${log.appi_name}` : ''}`,
      layer: 'FIREWALL_ACTION',
      level: 1,
      severity: 'critical',
      category: 'BLOCKED_TRAFFIC',
      actionInfo: CHECKPOINT_ACTION_MAPPING['Drop']
    };
  }

  // 1.2 流量被 Reject（拒絕）→ 確定是威脅或政策違規
  if (log.action === 'Reject') {
    return {
      isAttack: false,
      isThreat: true,
      confidence: 'high',
      reason: `流量已被防火牆拒絕 (Reject)${log.appi_name ? ` - 應用: ${log.appi_name}` : ''}`,
      layer: 'FIREWALL_ACTION',
      level: 1,
      severity: 'high',
      category: 'BLOCKED_TRAFFIC',
      actionInfo: CHECKPOINT_ACTION_MAPPING['Reject']
    };
  }

  // ========== Layer 2: 應用程式風險評估 ==========
  
  const appRisk = parseInt(log.app_risk);
  const appInfo = CHECKPOINT_APP_RISK_MAPPING[appRisk];

  // 2.1 嚴重風險應用（app_risk = 5）→ 確定是高風險
  if (appRisk === 5) {
    return {
      isAttack: true,
      isThreat: true,
      confidence: 'high',
      reason: `應用程式風險等級為嚴重 (app_risk=5): ${log.appi_name || '未知應用'}`,
      layer: 'APP_RISK_ASSESSMENT',
      level: 2,
      severity: 'critical',
      category: 'HIGH_RISK_APPLICATION',
      appRiskInfo: appInfo,
      recommendation: appInfo?.action_recommendation
    };
  }

  // 2.2 高風險應用（app_risk = 4）→ 高風險
  if (appRisk === 4) {
    return {
      isAttack: false,
      isThreat: true,
      confidence: 'medium',
      reason: `應用程式風險等級為高 (app_risk=4): ${log.appi_name || '未知應用'}`,
      layer: 'APP_RISK_ASSESSMENT',
      level: 2,
      severity: 'high',
      category: 'HIGH_RISK_APPLICATION',
      appRiskInfo: appInfo,
      recommendation: appInfo?.action_recommendation
    };
  }

  // ========== Layer 3: 違反公司政策的行為 ==========
  
  const policyViolation = POLICY_VIOLATION_CATEGORIES[log.app_category];
  
  if (policyViolation) {
    // 3.1 嚴重違規（Anonymizer, Cryptocurrency Mining, Malicious Sites）
    if (policyViolation.severity === 'critical') {
      return {
        isAttack: true,
        isThreat: true,
        confidence: 'high',
        reason: `違反嚴重政策: ${policyViolation.displayName}${log.appi_name ? ` (${log.appi_name})` : ''}`,
        layer: 'POLICY_VIOLATION',
        level: 3,
        severity: 'critical',
        category: policyViolation.violation_type,
        policyImpact: policyViolation.policy_impact,
        recommendation: policyViolation.action_recommendation,
        complianceImpact: policyViolation.compliance_impact
      };
    }

    // 3.2 高風險違規（Pornography, Gambling, Remote Administration, P2P）
    if (policyViolation.severity === 'high') {
      return {
        isAttack: false,
        isThreat: true,
        confidence: 'medium',
        reason: `違反公司政策: ${policyViolation.displayName}${log.appi_name ? ` (${log.appi_name})` : ''}`,
        layer: 'POLICY_VIOLATION',
        level: 3,
        severity: 'high',
        category: policyViolation.violation_type,
        policyImpact: policyViolation.policy_impact,
        recommendation: policyViolation.action_recommendation,
        complianceImpact: policyViolation.compliance_impact
      };
    }

    // 3.3 中風險違規（Social Media, Streaming Media, Cloud Storage）
    if (policyViolation.severity === 'medium') {
      return {
        isAttack: false,
        isThreat: true,
        confidence: 'low',
        reason: `可能違反政策: ${policyViolation.displayName}${log.appi_name ? ` (${log.appi_name})` : ''}`,
        layer: 'POLICY_VIOLATION',
        level: 3,
        severity: 'medium',
        category: policyViolation.violation_type,
        policyImpact: policyViolation.policy_impact,
        recommendation: policyViolation.action_recommendation
      };
    }
  }

  // ========== Layer 4: 綜合分析（多個風險因素組合）==========
  
  let riskScore = 0;
  const riskFactors = [];

  // 4.1 中等風險應用（app_risk = 3）
  if (appRisk === 3) {
    riskScore += 30;
    riskFactors.push(`app_risk=3 (中風險應用: ${log.appi_name || '未知'})`);
  }

  // 4.2 可疑的連線方向（Inbound + 中高風險應用）
  if (log.conn_direction === 'Inbound' && appRisk >= 3) {
    riskScore += 25;
    riskFactors.push('外部進入連線 (Inbound) + 中高風險應用');
  }

  // 4.3 可疑的安全區域流向
  if (log.security_inzone && log.security_outzone) {
    for (const [key, zoneRule] of Object.entries(SECURITY_ZONE_RISK_MATRIX)) {
      if (zoneRule.inzone_pattern.test(log.security_inzone) && 
          zoneRule.outzone_pattern.test(log.security_outzone)) {
        riskScore += zoneRule.risk_score;
        riskFactors.push(`${zoneRule.description} (${log.security_inzone} → ${log.security_outzone})`);
        break;
      }
    }
  }

  // 4.4 長時間連線（可能是 C&C 或資料外洩）
  if (log.duration && log.duration > 3600) { // 超過 1 小時
    riskScore += 15;
    riskFactors.push(`長時間連線 (${Math.round(log.duration / 60)} 分鐘)`);
  }

  // 4.5 大量資料傳輸（可能是資料外洩）
  if (log.bytes && log.bytes > 100000000) { // 超過 100MB
    riskScore += 15;
    riskFactors.push(`大量資料傳輸 (${Math.round(log.bytes / 1000000)} MB)`);
  }

  // 綜合評估
  if (riskScore >= 50) {
    return {
      isAttack: false,
      isThreat: true,
      confidence: 'low',
      reason: `多個風險因素組合 (總分: ${riskScore})`,
      layer: 'COMBINED_ANALYSIS',
      level: 4,
      severity: 'medium',
      category: 'SUSPICIOUS_BEHAVIOR',
      riskFactors: riskFactors,
      riskScore: riskScore
    };
  }

  // ========== 正常流量 ==========
  return {
    isAttack: false,
    isThreat: false,
    confidence: 'high',
    reason: '未符合任何威脅或政策違規條件 - 正常業務流量',
    layer: 'NORMAL_TRAFFIC',
    level: 0,
    severity: 'info',
    category: 'LEGITIMATE_TRAFFIC'
  };
}

/**
 * 計算 Check Point 統一威脅分數（0-100）
 * 分數越低表示威脅越高（類似 Cloudflare 的設計）
 * 
 * 分數範圍：
 * - 0-30: 嚴重威脅
 * - 31-50: 高風險
 * - 51-70: 中風險
 * - 71-85: 低風險
 * - 86-100: 正常流量
 * 
 * @param {object} log - Check Point 日誌條目
 * @returns {number} 威脅分數 (0-100)
 */
function calculateThreatScore(log) {
  let score = 100; // 從完美分數開始扣分

  // 1. action 影響（40%權重）
  if (log.action === 'Drop') {
    score -= 40; // 已封鎖 = 確定威脅
  } else if (log.action === 'Reject') {
    score -= 30; // 已拒絕 = 高風險
  } else if (log.action === 'Accept') {
    score -= 0; // 允許通過 = 無扣分
  }

  // 2. app_risk 影響（35%權重）
  const appRisk = parseInt(log.app_risk) || 0;
  // app_risk 範圍 0-5，轉換為 0-35 分扣分
  const appRiskImpact = (appRisk / 5) * 35;
  score -= appRiskImpact;

  // 3. app_category 政策違規影響（25%權重）
  const policyViolation = POLICY_VIOLATION_CATEGORIES[log.app_category];
  if (policyViolation) {
    if (policyViolation.severity === 'critical') {
      score -= 25;
    } else if (policyViolation.severity === 'high') {
      score -= 20;
    } else if (policyViolation.severity === 'medium') {
      score -= 10;
    } else if (policyViolation.severity === 'low') {
      score -= 0;
    }
  }

  // 4. 額外風險因素（微調）
  
  // 4.1 可疑的連線方向
  if (log.conn_direction === 'Inbound' && appRisk >= 3) {
    score -= 5;
  }

  // 4.2 安全區域風險
  if (log.security_inzone && log.security_outzone) {
    for (const zoneRule of Object.values(SECURITY_ZONE_RISK_MATRIX)) {
      if (zoneRule.inzone_pattern.test(log.security_inzone) && 
          zoneRule.outzone_pattern.test(log.security_outzone)) {
        score -= Math.round(zoneRule.risk_score / 2); // 減半影響
        break;
      }
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
  if (score <= CHECKPOINT_THRESHOLDS.THREAT_SCORE.CRITICAL) {
    return {
      label: 'critical_threat',
      displayName: '嚴重威脅',
      severity: 'critical',
      color: 'red',
      description: '確定的安全威脅，需要立即處理'
    };
  }
  if (score <= CHECKPOINT_THRESHOLDS.THREAT_SCORE.HIGH) {
    return {
      label: 'high_risk',
      displayName: '高風險',
      severity: 'high',
      color: 'orange',
      description: '高風險威脅或嚴重政策違規'
    };
  }
  if (score <= CHECKPOINT_THRESHOLDS.THREAT_SCORE.MEDIUM) {
    return {
      label: 'medium_risk',
      displayName: '中風險',
      severity: 'medium',
      color: 'yellow',
      description: '中等風險或政策違規'
    };
  }
  if (score <= CHECKPOINT_THRESHOLDS.THREAT_SCORE.LOW) {
    return {
      label: 'low_risk',
      displayName: '低風險',
      severity: 'low',
      color: 'blue',
      description: '低風險，需要監控'
    };
  }
  return {
    label: 'clean',
    displayName: '正常流量',
    severity: 'info',
    color: 'green',
    description: '正常業務流量'
  };
}

/**
 * 檢查是否為高風險威脅
 * @param {object} log - Check Point 日誌條目
 * @returns {boolean} 是否為高風險
 */
function isHighRiskThreat(log) {
  const threatResult = isRealSecurityThreat(log);
  
  if (!threatResult.isThreat) {
    return false;
  }
  
  return threatResult.severity === 'critical' || 
         threatResult.severity === 'high' ||
         threatResult.confidence === 'certain';
}

/**
 * 綜合分析單個日誌條目
 * @param {object} log - Check Point 日誌條目
 * @returns {object} 完整分析結果
 */
function analyzeLogEntry(log) {
  const threatResult = isRealSecurityThreat(log);
  const threatScore = calculateThreatScore(log);
  const scoreClassification = classifyByThreatScore(threatScore);

  return {
    // 基本判斷結果
    isAttack: threatResult.isAttack,
    isThreat: threatResult.isThreat,
    confidence: threatResult.confidence,
    reason: threatResult.reason,
    judgmentLayer: threatResult.layer,
    judgmentLevel: threatResult.level,
    
    // 威脅評分
    threatScore: threatScore,
    scoreClassification: scoreClassification,
    
    // 嚴重程度
    severity: threatResult.severity || scoreClassification.severity,
    
    // 分類資訊
    category: threatResult.category,
    policyImpact: threatResult.policyImpact,
    recommendation: threatResult.recommendation,
    
    // 應用程式資訊
    appRiskInfo: threatResult.appRiskInfo,
    actionInfo: threatResult.actionInfo,
    
    // 風險因素
    riskFactors: threatResult.riskFactors,
    riskScore: threatResult.riskScore,
    
    // 原始資料
    originalData: {
      action: log.action,
      app_risk: log.app_risk,
      appi_name: log.appi_name,
      app_category: log.app_category,
      conn_direction: log.conn_direction,
      security_inzone: log.security_inzone,
      security_outzone: log.security_outzone,
      duration: log.duration,
      bytes: log.bytes
    }
  };
}

/**
 * 根據 app_category 獲取政策違規資訊
 * @param {string} appCategory - 應用程式類別
 * @returns {object|null} 政策違規資訊
 */
function getPolicyViolationInfo(appCategory) {
  if (!appCategory || appCategory === 'N/A' || appCategory === '') {
    return null;
  }
  
  return POLICY_VIOLATION_CATEGORIES[appCategory] || null;
}

/**
 * 根據 app_risk 獲取風險等級資訊
 * @param {number|string} appRisk - 應用程式風險等級 (0-5)
 * @returns {object|null} 風險等級資訊
 */
function getAppRiskInfo(appRisk) {
  const risk = parseInt(appRisk);
  
  if (isNaN(risk) || risk < 0 || risk > 5) {
    return null;
  }
  
  return CHECKPOINT_APP_RISK_MAPPING[risk] || null;
}

/**
 * 判斷安全區域風險
 * @param {string} inzone - 來源安全區域
 * @param {string} outzone - 目的安全區域
 * @returns {object|null} 區域風險資訊
 */
function evaluateSecurityZoneRisk(inzone, outzone) {
  if (!inzone || !outzone) {
    return null;
  }
  
  for (const [key, zoneRule] of Object.entries(SECURITY_ZONE_RISK_MATRIX)) {
    if (zoneRule.inzone_pattern.test(inzone) && 
        zoneRule.outzone_pattern.test(outzone)) {
      return {
        riskType: key,
        riskScore: zoneRule.risk_score,
        description: zoneRule.description,
        inzone: inzone,
        outzone: outzone
      };
    }
  }
  
  return null;
}

/**
 * ═══════════════════════════════════════════════════════════
 * 匯出所有配置與函數
 * ═══════════════════════════════════════════════════════════
 */

module.exports = {
  // 配置對應表
  CHECKPOINT_APP_RISK_MAPPING,
  CHECKPOINT_ACTION_MAPPING,
  POLICY_VIOLATION_CATEGORIES,
  
  // 閾值與配置
  CHECKPOINT_THRESHOLDS,
  CHECKPOINT_THREAT_SCORE_WEIGHTS,
  SECURITY_ZONE_RISK_MATRIX,
  
  // 核心判斷函數
  isRealSecurityThreat,           // 判斷是否為真實威脅（三層模型）
  calculateThreatScore,            // 計算威脅分數（0-100）
  classifyByThreatScore,           // 根據分數分類
  isHighRiskThreat,                // 檢查是否為高風險
  analyzeLogEntry,                 // 綜合分析日誌
  
  // 查詢與分析函數
  getPolicyViolationInfo,          // 獲取政策違規資訊
  getAppRiskInfo,                  // 獲取應用風險資訊
  evaluateSecurityZoneRisk,        // 評估安全區域風險
  
  // 向後兼容的函數（如果需要）
  classifyAppRisk: (appRiskValue) => {
    const risk = parseInt(appRiskValue);
    return CHECKPOINT_APP_RISK_MAPPING[risk] || CHECKPOINT_APP_RISK_MAPPING[0];
  },
  
  classifyAction: (action) => {
    return CHECKPOINT_ACTION_MAPPING[action] || null;
  }
};

