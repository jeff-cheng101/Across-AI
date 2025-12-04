// backend/config/products/cloudflare/cloudflareOperationGuides.js
// Cloudflare WAF 操作指引
// 提供詳細的 step-by-step 操作步驟，協助用戶執行 AI 分析後的建議

/**
 * Cloudflare 操作指引資料結構
 * 
 * 每個操作指引包含：
 * - id: 唯一識別碼
 * - title: 操作標題
 * - category: 分類（WAF Rules, Rate Limiting, Managed Rules 等）
 * - severity: 嚴重程度（critical, high, medium, low）
 * - estimatedTime: 預估操作時間
 * - prerequisites: 前置條件（陣列）
 * - steps: 詳細步驟（陣列，每個步驟包含 stepNumber, title, description, actions, notes）
 * - references: 參考文件（陣列，包含 title, url, type）
 * - relatedScores: 相關的 Cloudflare WAF Score
 * - troubleshooting: 疑難排解（陣列，包含 issue 和 solution）
 */

const CLOUDFLARE_OPERATION_GUIDES = {
  // ========================================
  // WAF Custom Rule 設定
  // ========================================
  WAF_CUSTOM_RULE_SETUP: {
    id: 'WAF_CUSTOM_RULE_SETUP',
    title: '設定 WAF Custom Rule 阻擋攻擊',
    category: 'WAF Rules',
    severity: 'high',
    estimatedTime: '5-10 分鐘',
    prerequisites: [
      '需要 Cloudflare 帳號管理員權限',
      '已登入 Cloudflare Dashboard',
      '網站已接入 Cloudflare',
      '方案需為 Pro、Business 或 Enterprise（Custom rules 功能）'
    ],
    steps: [
      {
        stepNumber: 1,
        title: '登入 Cloudflare Dashboard',
        description: '開啟並登入 Cloudflare 管理介面',
        actions: [
          '前往 https://dash.cloudflare.com',
          '輸入您的 Email 地址',
          '輸入密碼',
          '完成兩步驟驗證（2FA）如有啟用',
          '點擊「Log in」按鈕'
        ],
        screenshot: null,
        notes: '建議啟用兩步驟驗證（2FA）以提升帳號安全性'
      },
      {
        stepNumber: 2,
        title: '選擇要保護的網站',
        description: '在 Dashboard 中選擇目標網站域名',
        actions: [
          '在 Dashboard 首頁，查看您的網站列表',
          '點擊要設定 WAF 規則的網站域名',
          '確認進入該網站的管理頁面'
        ],
        screenshot: null,
        notes: '確保選擇正確的網站，設定只會套用到該網站'
      },
      {
        stepNumber: 3,
        title: '進入 WAF Custom Rules 設定頁面',
        description: '導航到 Custom Rules 設定區域',
        actions: [
          '在左側選單中，點選「Security」',
          '選擇「WAF」子選單',
          '點擊頂部的「Custom rules」標籤',
          '查看現有的 Custom rules 列表'
        ],
        screenshot: null,
        notes: 'Custom rules 功能需要 Pro 或以上方案才能使用'
      },
      {
        stepNumber: 4,
        title: '建立新的 Custom Rule',
        description: '設定規則條件以阻擋攻擊流量',
        actions: [
          '點擊「Create rule」按鈕',
          '在「Rule name」欄位輸入有意義的名稱（例如：Block High Risk SQL Injection）',
          '在「If incoming requests match…」區塊設定條件：',
          '  方式一：使用表達式編輯器',
          '    - Field: WAF Attack Score',
          '    - Operator: less than or equal to',
          '    - Value: 20（Cloudflare 官方建議的高風險閾值）',
          '  方式二：使用進階表達式（點擊「Edit expression」）',
          '    - 輸入：(cf.waf.score.sqli le 20) 針對 SQL 注入',
          '    - 或輸入：(cf.waf.score.xss le 20) 針對 XSS 攻擊',
          '    - 或輸入：(cf.waf.score le 20) 針對所有攻擊類型',
          '在「Then take action…」區塊選擇動作：',
          '  - 選擇「Block」（直接阻擋）'
        ],
        screenshot: null,
        notes: 'Attack Score <= 20 為 Cloudflare 官方建議的高風險閾值。分數越低表示越可能是攻擊（1=幾乎確定是攻擊，99=可能正常）'
      },
      {
        stepNumber: 5,
        title: '部署規則',
        description: '儲存並部署 Custom Rule 到生產環境',
        actions: [
          '檢查規則設定是否正確',
          '確認條件表達式無誤',
          '點擊右下角的「Deploy」按鈕',
          '等待系統完成部署（通常數秒內完成）',
          '確認規則出現在列表中，狀態顯示為「Active」'
        ],
        screenshot: null,
        notes: '規則部署後立即生效，無需等待。可以隨時編輯或停用規則'
      },
      {
        stepNumber: 6,
        title: '驗證規則運作',
        description: '測試並確認規則正常運作',
        actions: [
          '前往「Security」→「Events」查看安全事件',
          '等待 5-10 分鐘讓系統收集流量數據',
          '在 Events 頁面，設定篩選條件：',
          '  - Action: Block',
          '  - Rule: 選擇您剛才建立的規則名稱',
          '檢視被阻擋的請求詳細資訊',
          '確認 WAF Attack Score 符合您設定的條件',
          '檢查是否有誤報（正常流量被誤擋）'
        ],
        screenshot: null,
        notes: '建議持續監控 1-2 天，觀察是否有誤報情況。若有誤報，可調整閾值或使用 Log 模式'
      }
    ],
    references: [
      {
        title: 'Cloudflare WAF Custom Rules 官方文件',
        url: 'https://developers.cloudflare.com/waf/custom-rules/',
        type: 'official'
      },
      {
        title: 'WAF Attack Score 官方說明',
        url: 'https://developers.cloudflare.com/waf/about/waf-attack-score/',
        type: 'official'
      },
      {
        title: '內部文件 - WAF 完整說明',
        url: '/backend/docs/cloudflare/stages/stage-4-security-products/waf.md',
        type: 'internal'
      },
      {
        title: '內部文件 - 流量偵測與 Attack Score',
        url: '/backend/docs/cloudflare/stages/stage-4-security-products/traffic-detections.md',
        type: 'internal'
      },
      {
        title: '內部文件 - Custom Rules 詳細說明',
        url: '/backend/docs/cloudflare/stages/stage-4-security-products/custom-rules.md',
        type: 'internal'
      }
    ],
    relatedScores: ['cf.waf.score', 'cf.waf.score.sqli', 'cf.waf.score.xss', 'cf.waf.score.rce'],
    troubleshooting: [
      {
        issue: '規則建立後沒有阻擋任何請求',
        solution: '1. 檢查 Attack Score 閾值是否設定過低（建議從 20 開始）。2. 確認規則狀態為「Active」。3. 檢查是否有其他規則優先執行並允許了這些請求。4. 確認網站流量是否通過 Cloudflare（橘雲圖示）。'
      },
      {
        issue: '正常流量被誤報並阻擋',
        solution: '1. 將動作從「Block」改為「Log」模式，觀察 1-2 天。2. 分析被阻擋的請求，找出誤報來源。3. 調整 Attack Score 閾值（如從 20 調整到 15）。4. 針對特定路徑或 IP 建立例外規則（Skip 規則）。5. 考慮使用「Managed Challenge」代替「Block」，讓用戶完成驗證。'
      },
      {
        issue: '找不到 Custom rules 功能選項',
        solution: 'Custom rules 功能需要 Pro、Business 或 Enterprise 方案。請確認您的 Cloudflare 方案等級。如果是 Free 方案，請升級到 Pro 方案。'
      },
      {
        issue: '表達式語法錯誤，無法部署',
        solution: '1. 檢查表達式語法是否正確（參考官方文件）。2. 確認欄位名稱正確（如 cf.waf.score.sqli）。3. 確認運算符號正確（le = less than or equal）。4. 嘗試使用表達式編輯器而非手動輸入。'
      }
    ]
  },

  // ========================================
  // Rate Limiting Rule
  // ========================================
  RATE_LIMITING_RULE: {
    id: 'RATE_LIMITING_RULE',
    title: '設定速率限制規則',
    category: 'Rate Limiting',
    severity: 'medium',
    estimatedTime: '10-15 分鐘',
    prerequisites: [
      '需要 Cloudflare 帳號管理員權限',
      '已登入 Cloudflare Dashboard',
      '瞭解應用程式的正常流量模式',
      '確認需要保護的端點（如登入頁面、API）'
    ],
    steps: [
      {
        stepNumber: 1,
        title: '進入 Rate Limiting Rules 設定',
        description: '開啟速率限制規則設定頁面',
        actions: [
          '登入 Cloudflare Dashboard',
          '選擇要設定的網站',
          '點選左側選單的「Security」',
          '選擇「WAF」',
          '點擊頂部的「Rate limiting rules」標籤',
          '查看現有的速率限制規則'
        ],
        screenshot: null,
        notes: 'Rate limiting rules 可以保護 API、登入頁面等免受暴力破解和 DDoS 攻擊'
      },
      {
        stepNumber: 2,
        title: '建立新的 Rate Limiting Rule',
        description: '定義觸發速率限制的條件',
        actions: [
          '點擊「Create rule」按鈕',
          '輸入規則名稱（例如：Login API Rate Limit）',
          '在「If incoming requests match…」區塊設定比對條件：',
          '  範例 1：保護登入 API',
          '    - Field: URI Path',
          '    - Operator: equals',
          '    - Value: /api/login',
          '  範例 2：保護整個 API 路徑',
          '    - Field: URI Path',
          '    - Operator: starts with',
          '    - Value: /api/',
          '在「With the same…」區塊選擇追蹤方式：',
          '  - 建議選擇「IP」（追蹤來源 IP 地址）',
          '  - 或選擇「IP with NAT support」（支援 NAT 環境）',
          '在「Requests」欄位設定數量和時間窗口：',
          '  - 例如：10 requests per 10 seconds',
          '  - 或：100 requests per 1 minute'
        ],
        screenshot: null,
        notes: '建議先設定較寬鬆的限制（如 100 req/10s），觀察流量後再逐步調整'
      },
      {
        stepNumber: 3,
        title: '設定處理動作',
        description: '選擇超過限制時的處理方式',
        actions: [
          '在「Then take action…」區塊選擇動作：',
          '  選項 1：Block（直接阻擋）',
          '    - 最嚴格，直接拒絕超過限制的請求',
          '  選項 2：Managed Challenge（託管挑戰）',
          '    - 顯示 Cloudflare 挑戰頁面，讓用戶證明非機器人',
          '  選項 3：JS Challenge（JavaScript 挑戰）',
          '    - 要求瀏覽器執行 JavaScript 驗證',
          '  選項 4：Log（僅記錄）',
          '    - 測試用，不阻擋但記錄事件',
          '設定「Duration」（阻擋持續時間）：',
          '  - 建議：60 seconds 到 600 seconds',
          '  - 過短可能無效，過長影響用戶體驗'
        ],
        screenshot: null,
        notes: '測試階段建議先使用「Log」動作，確認規則正確後再改為「Block」或「Challenge」'
      },
      {
        stepNumber: 4,
        title: '設定例外條件（選用）',
        description: '為特定情況建立例外',
        actions: [
          '如需要為特定 IP 或條件建立例外，點擊「Add exception」',
          '設定例外條件（例如：來自公司 IP 的請求）',
          '例外請求將不受速率限制影響'
        ],
        screenshot: null,
        notes: '可以為 API 合作夥伴、內部測試 IP 等建立例外'
      },
      {
        stepNumber: 5,
        title: '部署並啟用規則',
        description: '儲存並部署速率限制規則',
        actions: [
          '檢查所有設定是否正確',
          '確認條件、追蹤方式、限制數量都已設定',
          '點擊「Deploy」按鈕',
          '等待部署完成（通常數秒內完成）',
          '確認規則狀態為「Active」'
        ],
        screenshot: null,
        notes: '規則立即生效，請確保設定正確以免影響正常用戶'
      },
      {
        stepNumber: 6,
        title: '測試與監控',
        description: '驗證速率限制是否正常運作',
        actions: [
          '測試：連續快速發送請求到設定的端點',
          '  - 可使用工具如 curl、Postman 或 ab（Apache Bench）',
          '  - 例如：for i in {1..20}; do curl https://example.com/api/login; done',
          '確認超過限制後觸發相應動作（Block/Challenge）',
          '前往「Security」→「Events」查看速率限制事件：',
          '  - 篩選 Action: Rate Limit 或 Block',
          '  - 檢查被限制的 IP 地址和請求',
          '觀察 1-2 天，分析是否有誤報',
          '根據實際情況調整參數'
        ],
        screenshot: null,
        notes: '持續監控很重要，確保不會影響正常用戶體驗'
      }
    ],
    references: [
      {
        title: 'Cloudflare Rate Limiting Rules 官方文件',
        url: 'https://developers.cloudflare.com/waf/rate-limiting-rules/',
        type: 'official'
      },
      {
        title: 'Rate Limiting 最佳實踐',
        url: 'https://developers.cloudflare.com/waf/rate-limiting-rules/best-practices/',
        type: 'official'
      },
      {
        title: '內部文件 - Rate Limiting Rules 詳細說明',
        url: '/backend/docs/cloudflare/stages/stage-4-security-products/rate-limiting-rules.md',
        type: 'internal'
      },
      {
        title: '內部文件 - WAF 完整說明',
        url: '/backend/docs/cloudflare/stages/stage-4-security-products/waf.md',
        type: 'internal'
      }
    ],
    relatedScores: [],
    troubleshooting: [
      {
        issue: '速率限制沒有生效',
        solution: '1. 確認規則狀態為「Active」。2. 檢查條件是否正確匹配流量。3. 確認追蹤方式是否適當（如果使用 Cookie，確認網站有設定 Cookie）。4. 測試時確保請求來自同一 IP 地址。'
      },
      {
        issue: '正常用戶被速率限制影響',
        solution: '1. 提高請求限制數量（如從 10 req/10s 提高到 50 req/10s）。2. 延長時間窗口（如從 10 seconds 改為 60 seconds）。3. 改用「Managed Challenge」代替「Block」。4. 為已知的正常用戶 IP 建立例外規則。'
      },
      {
        issue: 'NAT 環境下所有用戶共享同一 IP',
        solution: '使用「IP with NAT support」追蹤方式，或改用「Session」、「Cookie」等其他追蹤方式。Cloudflare 會嘗試區分 NAT 後面的不同用戶。'
      },
      {
        issue: '無法區分正常高流量和攻擊',
        solution: '1. 觀察正常流量的峰值，設定略高於峰值的限制。2. 在高流量時段（如促銷活動）暫時停用或調整規則。3. 使用更精確的條件（如只限制 POST 請求）。'
      }
    ]
  },

  // ========================================
  // Managed Rules 部署
  // ========================================
  MANAGED_RULES_DEPLOYMENT: {
    id: 'MANAGED_RULES_DEPLOYMENT',
    title: '部署 Cloudflare Managed Ruleset',
    category: 'Managed Rules',
    severity: 'high',
    estimatedTime: '5-10 分鐘',
    prerequisites: [
      '需要 Cloudflare 帳號管理員權限',
      '已登入 Cloudflare Dashboard',
      '網站已接入 Cloudflare',
      '建議先瞭解網站架構與常見請求模式'
    ],
    steps: [
      {
        stepNumber: 1,
        title: '進入 Managed Rules 設定頁面',
        description: '開啟託管規則設定區域',
        actions: [
          '登入 Cloudflare Dashboard',
          '選擇要設定的網站',
          '點選左側選單的「Security」',
          '選擇「WAF」',
          '點擊頂部的「Managed rules」標籤'
        ],
        screenshot: null,
        notes: 'Managed rules 是 Cloudflare 維護的規則集，包含針對常見攻擊的防護'
      },
      {
        stepNumber: 2,
        title: '啟用 Cloudflare Managed Ruleset',
        description: '部署 Cloudflare 核心託管規則集',
        actions: [
          '在 Managed rules 頁面，找到「Cloudflare Managed Ruleset」',
          '點擊右側的「Deploy」按鈕（如果尚未部署）',
          '如已部署，確認狀態為「Deployed」',
          '點擊規則集名稱或「Configure」查看設定'
        ],
        screenshot: null,
        notes: '此 Ruleset 包含 Cloudflare 團隊維護的攻擊簽章，會自動更新'
      },
      {
        stepNumber: 3,
        title: '調整敏感度（Sensitivity）',
        description: '根據網站需求調整規則敏感度',
        actions: [
          '在 Ruleset configuration 頁面中',
          '找到「Sensitivity」設定',
          '選擇敏感度等級：',
          '  - Low（低）：較少誤報，但可能漏掉部分攻擊',
          '  - Medium（中）：平衡設定，適合大多數情況（預設）',
          '  - High（高）：更嚴格檢查，可能有較多誤報',
          '  - Off（關閉）：完全停用此規則集',
          '點擊「Save」儲存設定'
        ],
        screenshot: null,
        notes: '建議從 Medium 開始，觀察 1-2 週後視情況調整'
      },
      {
        stepNumber: 4,
        title: '啟用 OWASP Core Ruleset（選用）',
        description: '部署 OWASP 核心規則集提供額外防護',
        actions: [
          '回到 Managed rules 列表',
          '找到「Cloudflare OWASP Core Ruleset」',
          '點擊「Deploy」按鈕',
          '設定「Paranoia Level」（偏執等級）：',
          '  - PL1：基本防護（建議初次使用）',
          '  - PL2：中等防護',
          '  - PL3：高度防護',
          '  - PL4：極度嚴格（可能大量誤報）',
          '設定「Score Threshold」（分數閾值）：',
          '  - Low: 60 分',
          '  - Medium: 40 分（建議）',
          '  - High: 25 分',
          '選擇動作（Block/Log）',
          '點擊「Deploy」完成部署'
        ],
        screenshot: null,
        notes: 'OWASP Ruleset 提供額外的防護層，但可能增加誤報率。建議先使用 PL1 + Medium threshold'
      },
      {
        stepNumber: 5,
        title: '設定規則例外（如需要）',
        description: '為特定路徑或條件建立例外',
        actions: [
          '在 Managed rules 頁面，點擊「Add exception」',
          '輸入例外規則名稱',
          '設定條件（例如：URI Path equals /admin/）',
          '選擇要跳過的規則或規則集',
          '點擊「Deploy」儲存例外'
        ],
        screenshot: null,
        notes: '例外規則可以避免特定路徑（如管理後台）被過度限制'
      },
      {
        stepNumber: 6,
        title: '監控與調整',
        description: '監控規則效果並進行微調',
        actions: [
          '前往「Security」→「Events」查看攻擊事件',
          '篩選「Managed rules」相關事件',
          '檢查被阻擋的請求：',
          '  - 確認是否為真實攻擊',
          '  - 識別誤報情況',
          '如有誤報：',
          '  - 降低敏感度',
          '  - 建立例外規則',
          '  - 停用特定規則',
          '持續觀察 1-2 週，逐步優化設定'
        ],
        screenshot: null,
        notes: '建議定期檢查（每週一次），確保規則適合網站需求'
      }
    ],
    references: [
      {
        title: 'Cloudflare Managed Rules 官方文件',
        url: 'https://developers.cloudflare.com/waf/managed-rules/',
        type: 'official'
      },
      {
        title: 'OWASP Core Ruleset 說明',
        url: 'https://developers.cloudflare.com/waf/managed-rules/reference/owasp-core-ruleset/',
        type: 'official'
      },
      {
        title: '內部文件 - Managed Rules 詳細說明',
        url: '/backend/docs/cloudflare/stages/stage-4-security-products/managed-rules.md',
        type: 'internal'
      },
      {
        title: '內部文件 - WAF 完整說明',
        url: '/backend/docs/cloudflare/stages/stage-4-security-products/waf.md',
        type: 'internal'
      }
    ],
    relatedScores: [],
    troubleshooting: [
      {
        issue: 'Managed rules 阻擋了正常的上傳功能',
        solution: '檔案上傳可能觸發某些規則。建議為上傳路徑建立例外（Skip rule），或調整 Sensitivity 為 Low。'
      },
      {
        issue: 'API 請求被 Managed rules 阻擋',
        solution: '1. 檢查是否為 POST/PUT/DELETE 請求觸發規則。2. 為 API 路徑建立例外規則。3. 確認 API payload 格式正確（JSON, XML 等）。4. 考慮使用 API Shield 產品提供更細緻的 API 保護。'
      },
      {
        issue: 'OWASP Ruleset 誤報率過高',
        solution: '1. 降低 Paranoia Level（從 PL2 降到 PL1）。2. 提高 Score Threshold（從 40 提高到 60）。3. 改用「Log」模式而非「Block」。4. 分析具體被阻擋的規則，停用特定規則。'
      },
      {
        issue: '不確定應該啟用哪些規則集',
        solution: '建議優先順序：1. Cloudflare Managed Ruleset（必須）。2. OWASP Core Ruleset PL1（建議）。3. Cloudflare Exposed Credentials Check（如有登入功能）。先啟用基本規則，觀察效果後再逐步增加。'
      }
    ]
  },

  // ========================================
  // Bot Management（選用，Enterprise 功能）
  // ========================================
  BOT_MANAGEMENT_SETUP: {
    id: 'BOT_MANAGEMENT_SETUP',
    title: '設定 Bot Management 防護',
    category: 'Bot Management',
    severity: 'medium',
    estimatedTime: '15-20 分鐘',
    prerequisites: [
      '需要 Cloudflare Enterprise 方案',
      '已啟用 Bot Management 功能',
      '已登入 Cloudflare Dashboard'
    ],
    steps: [
      {
        stepNumber: 1,
        title: '進入 Bot Management 設定',
        description: '開啟 Bot Management 設定頁面',
        actions: [
          '登入 Cloudflare Dashboard',
          '選擇網站',
          '點選「Security」→「Bots」',
          '確認 Bot Management 已啟用'
        ],
        screenshot: null,
        notes: 'Bot Management 僅適用於 Enterprise 方案'
      },
      {
        stepNumber: 2,
        title: '設定 Bot Fight Mode',
        description: '啟用基本的 bot 防護',
        actions: [
          '在 Bot Management 頁面',
          '啟用「Bot Fight Mode」',
          '選擇處理方式（Challenge/Block）',
          '點擊「Save」'
        ],
        screenshot: null,
        notes: '這是基本的 bot 防護，適合大多數情況'
      },
      {
        stepNumber: 3,
        title: '建立 Bot 規則',
        description: '針對特定 bot 行為建立規則',
        actions: [
          '前往「WAF」→「Custom rules」',
          '建立新規則，條件使用 Bot Score',
          '例如：(cf.bot_management.score lt 30)',
          '選擇動作（Block/Challenge/JS Challenge）',
          '部署規則'
        ],
        screenshot: null,
        notes: 'Bot Score 低於 30 通常表示是 bot'
      }
    ],
    references: [
      {
        title: 'Cloudflare Bot Management 官方文件',
        url: 'https://developers.cloudflare.com/bots/',
        type: 'official'
      },
      {
        title: '內部文件 - Bot Management 說明',
        url: '/backend/docs/cloudflare/stages/stage-4-security-products/bot-management.md',
        type: 'internal'
      }
    ],
    relatedScores: ['cf.bot_management.score'],
    troubleshooting: [
      {
        issue: '正常的搜尋引擎爬蟲被阻擋',
        solution: '在 Bot Management 設定中，將 Verified Bots（已驗證的 bot，如 Googlebot）設為「Allow」。'
      }
    ]
  },

  // ========================================
  // User-Agent 規則管理
  // ========================================
  USER_AGENT_RULES: {
    id: 'USER_AGENT_RULES',
    title: '強化 User-Agent 規則',
    category: 'Custom Rules',
    severity: 'high',
    estimatedTime: '10-15 分鐘',
    prerequisites: [
      '需要 Cloudflare Business 或 Enterprise 方案（Custom Rules 功能）',
      '已登入 Cloudflare Dashboard',
      '了解常見惡意 User-Agent 特徵'
    ],
    steps: [
      {
        stepNumber: 1,
        title: '進入 Custom Rules 設定',
        description: '導航到 WAF Custom Rules 頁面',
        actions: [
          '登入 Cloudflare Dashboard',
          '選擇目標網站',
          '前往 Security → WAF → Custom rules',
          '點擊「Create rule」建立新規則'
        ],
        screenshot: null,
        notes: null
      },
      {
        stepNumber: 2,
        title: '設定規則名稱',
        description: '為 User-Agent 規則命名',
        actions: [
          '在「Rule name」欄位輸入：Block Suspicious User-Agents',
          '或使用更具描述性的名稱：Block Malicious User-Agent Patterns'
        ],
        screenshot: null,
        notes: '規則名稱應該清楚描述其用途，便於日後管理'
      },
      {
        stepNumber: 3,
        title: '設定 User-Agent 過濾條件',
        description: '使用表達式來識別可疑的 User-Agent',
        actions: [
          '點擊「Edit expression」切換到進階模式',
          '輸入以下表達式之一：',
          '',
          '方式 1: 阻擋空白或異常短的 User-Agent',
          '(http.user_agent eq "") or (len(http.user_agent) lt 10)',
          '',
          '方式 2: 阻擋常見的掃描工具 User-Agent',
          '(http.user_agent contains "sqlmap") or (http.user_agent contains "nikto") or (http.user_agent contains "nmap") or (http.user_agent contains "masscan")',
          '',
          '方式 3: 阻擋異常長的 User-Agent（可能是攻擊）',
          '(len(http.user_agent) gt 500)',
          '',
          '方式 4: 組合多個條件（推薦）',
          '(http.user_agent eq "") or (len(http.user_agent) lt 10) or (len(http.user_agent) gt 500) or (http.user_agent contains "sqlmap") or (http.user_agent contains "nikto") or (http.user_agent contains "nmap")'
        ],
        screenshot: null,
        notes: '可以根據實際攻擊情況調整條件，但要注意避免阻擋正常流量'
      },
      {
        stepNumber: 4,
        title: '設定執行動作',
        description: '選擇如何處理匹配的請求',
        actions: [
          '在「Then take action...」區塊選擇動作：',
          '  選項 1: Block - 直接阻擋（建議用於確定的惡意 User-Agent）',
          '  選項 2: Managed Challenge - 顯示挑戰頁面（較溫和的方式）',
          '  選項 3: Log - 僅記錄不阻擋（用於測試階段）',
          '建議先使用「Log」觀察 1-2 天，確認無誤報後改為「Block」'
        ],
        screenshot: null,
        notes: '過於嚴格的規則可能阻擋合法流量，建議逐步調整'
      },
      {
        stepNumber: 5,
        title: '部署並監控',
        description: '套用規則並觀察效果',
        actions: [
          '點擊「Deploy」按鈕部署規則',
          '前往 Security → Events 查看規則觸發記錄',
          '檢查被阻擋的 User-Agent 是否符合預期',
          '如發現誤報，返回編輯規則調整條件',
          '定期更新規則以涵蓋新的惡意 User-Agent 模式'
        ],
        screenshot: null,
        notes: '建議每月檢視規則效果並更新'
      }
    ],
    references: [
      {
        title: 'Cloudflare Custom Rules 官方文件',
        url: 'https://developers.cloudflare.com/waf/custom-rules/',
        type: 'official'
      },
      {
        title: 'Cloudflare Rules Language 語法',
        url: 'https://developers.cloudflare.com/ruleset-engine/rules-language/',
        type: 'official'
      },
      {
        title: '內部文件 - Custom Rules 詳細說明',
        url: '/backend/docs/cloudflare/stages/stage-4-security-products/custom-rules.md',
        type: 'internal'
      }
    ],
    relatedScores: ['http.user_agent'],
    troubleshooting: [
      {
        issue: '規則阻擋了正常的移動裝置或瀏覽器',
        solution: '使用更精確的條件，例如結合其他欄位（如 IP reputation、country）一起判斷。或將已知的正常 User-Agent 加入白名單例外規則。'
      },
      {
        issue: '不確定哪些 User-Agent 是惡意的',
        solution: '先使用「Log」動作記錄所有匹配的請求，觀察 1-2 週後，分析日誌找出真正的惡意模式，再改為「Block」。'
      },
      {
        issue: '攻擊者使用隨機的正常 User-Agent',
        solution: 'User-Agent 規則無法單獨阻擋此類攻擊，建議結合其他規則（如 WAF Attack Score、Rate Limiting、Bot Management）一起使用。'
      }
    ]
  },

  // ========================================
  // User-Agent 灰名單管理
  // ========================================
  USER_AGENT_GREYLIST: {
    id: 'USER_AGENT_GREYLIST',
    title: '使用 User-Agent 灰名單',
    category: 'List Management',
    severity: 'medium',
    estimatedTime: '15-20 分鐘',
    prerequisites: [
      '需要 Cloudflare Business 或 Enterprise 方案',
      '已登入 Cloudflare Dashboard',
      '已收集已知惡意 User-Agent 列表'
    ],
    steps: [
      {
        stepNumber: 1,
        title: '建立 User-Agent 清單',
        description: '在 Cloudflare 中建立自定義清單',
        actions: [
          '登入 Cloudflare Dashboard',
          '在帳號層級（Account Home）點選「Manage Account」',
          '前往「Configurations」→「Lists」',
          '點擊「Create new list」按鈕',
          '選擇清單類型：「Custom list」',
          '輸入清單名稱：malicious_user_agents',
          '描述：Known malicious User-Agent patterns',
          '點擊「Create」'
        ],
        screenshot: null,
        notes: 'Lists 功能在帳號層級，可以跨多個網站使用'
      },
      {
        stepNumber: 2,
        title: '新增惡意 User-Agent 項目',
        description: '將已知的惡意 User-Agent 加入清單',
        actions: [
          '在剛建立的清單頁面，點擊「Add items」',
          '輸入惡意 User-Agent 字串，每行一個：',
          '  sqlmap',
          '  nikto',
          '  nmap',
          '  masscan',
          '  ZmEu',
          '  w3af',
          '  acunetix',
          '  burpsuite',
          '  python-requests (如果您的網站不使用)',
          '  curl (視情況而定)',
          '點擊「Add to list」'
        ],
        screenshot: null,
        notes: '可以新增最多 10,000 個項目（Business 方案）或 50,000 個項目（Enterprise 方案）'
      },
      {
        stepNumber: 3,
        title: '建立使用清單的 Custom Rule',
        description: '建立規則引用清單',
        actions: [
          '返回目標網站的 Dashboard',
          '前往 Security → WAF → Custom rules',
          '點擊「Create rule」',
          '規則名稱：Block User-Agents from Greylist',
          '點擊「Edit expression」',
          '輸入表達式：',
          '  (http.user_agent in $malicious_user_agents)',
          '在「Then take action」選擇「Block」',
          '點擊「Deploy」'
        ],
        screenshot: null,
        notes: '使用 $list_name 語法來引用清單，list_name 是您建立的清單名稱'
      },
      {
        stepNumber: 4,
        title: '定期更新清單',
        description: '維護和更新灰名單',
        actions: [
          '前往 Account Home → Configurations → Lists',
          '選擇 malicious_user_agents 清單',
          '查看「Items」標籤',
          '刪除已經不再需要的項目（點擊垃圾桶圖示）',
          '新增新發現的惡意 User-Agent',
          '建議每週或每月檢視一次'
        ],
        screenshot: null,
        notes: '可以從 Security Events 中找到被其他規則阻擋的 User-Agent，評估是否加入灰名單'
      },
      {
        stepNumber: 5,
        title: '監控和調整',
        description: '追蹤灰名單效果',
        actions: [
          '前往 Security → Events',
          '篩選 Rule: "Block User-Agents from Greylist"',
          '查看被阻擋的請求',
          '確認是否有誤報（正常流量被阻擋）',
          '如有誤報，從清單中移除該項目',
          '記錄阻擋統計數據，評估灰名單效果'
        ],
        screenshot: null,
        notes: '可以設定告警，當灰名單規則觸發次數異常時通知管理員'
      }
    ],
    references: [
      {
        title: 'Cloudflare Lists 官方文件',
        url: 'https://developers.cloudflare.com/waf/tools/lists/',
        type: 'official'
      },
      {
        title: 'Custom Rules with Lists',
        url: 'https://developers.cloudflare.com/waf/custom-rules/use-cases/challenge-bad-bots/',
        type: 'official'
      }
    ],
    relatedScores: ['http.user_agent'],
    troubleshooting: [
      {
        issue: '清單項目數量達到上限',
        solution: 'Business 方案限制 10,000 項目。建議定期清理不再需要的項目，或升級到 Enterprise 方案（50,000 項目上限）。'
      },
      {
        issue: '規則沒有生效',
        solution: '檢查：1. 清單名稱是否正確（使用 $list_name 語法）。2. 規則是否已部署。3. User-Agent 字串是否完全匹配（區分大小寫）。可以使用 contains 運算子進行部分匹配。'
      }
    ]
  },

  // ========================================
  // 限制 User-Agent 使用
  // ========================================
  RESTRICT_USER_AGENT: {
    id: 'RESTRICT_USER_AGENT',
    title: '限制 User-Agent 的使用',
    category: 'Custom Rules',
    severity: 'low',
    estimatedTime: '10-15 分鐘',
    prerequisites: [
      '需要 Cloudflare Business 或 Enterprise 方案',
      '已登入 Cloudflare Dashboard',
      '已確定允許的 User-Agent 白名單'
    ],
    steps: [
      {
        stepNumber: 1,
        title: '建立允許的 User-Agent 清單',
        description: '定義白名單',
        actions: [
          '前往 Account Home → Configurations → Lists',
          '點擊「Create new list」',
          '清單名稱：allowed_user_agents',
          '描述：Whitelisted User-Agent patterns',
          '新增允許的 User-Agent 或模式：',
          '  Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          '  Mozilla/5.0 (Macintosh; Intel Mac OS X)',
          '  Mozilla/5.0 (iPhone; CPU iPhone OS',
          '  Mozilla/5.0 (Linux; Android',
          '  或使用部分匹配模式',
          '點擊「Create」'
        ],
        screenshot: null,
        notes: '白名單方式較為嚴格，確保不會阻擋正常用戶'
      },
      {
        stepNumber: 2,
        title: '建立白名單規則',
        description: '只允許白名單中的 User-Agent',
        actions: [
          '前往目標網站 Dashboard',
          '前往 Security → WAF → Custom rules',
          '點擊「Create rule」',
          '規則名稱：Allow Only Whitelisted User-Agents',
          '點擊「Edit expression」',
          '輸入表達式（阻擋不在白名單中的）：',
          '  not (http.user_agent in $allowed_user_agents)',
          '選擇動作：「Managed Challenge」或「Block」',
          '點擊「Deploy」'
        ],
        screenshot: null,
        notes: '建議先使用 Managed Challenge 測試，確認無誤後再改為 Block'
      },
      {
        stepNumber: 3,
        title: '或使用正規表達式方式（進階）',
        description: '使用 regex 限制 User-Agent 格式',
        actions: [
          '如果不想使用清單，可以直接用正規表達式',
          '建立 Custom Rule',
          '使用表達式：',
          '  not (http.user_agent matches "^Mozilla/5\\.0")',
          '這會阻擋所有不是以 Mozilla/5.0 開頭的 User-Agent',
          '或組合多個模式：',
          '  not (http.user_agent matches "^Mozilla/5\\.0" or http.user_agent matches "^AppleWebKit")'
        ],
        screenshot: null,
        notes: '正規表達式功能需要 Enterprise 方案'
      },
      {
        stepNumber: 4,
        title: '測試和驗證',
        description: '確保規則不會影響正常流量',
        actions: [
          '使用不同的瀏覽器和裝置測試網站',
          '前往 Security → Events 查看規則觸發情況',
          '確認沒有誤報（正常用戶被阻擋）',
          '如有誤報，將該 User-Agent 加入白名單',
          '持續監控 1-2 週'
        ],
        screenshot: null,
        notes: '此方式較為嚴格，建議只用於特定頁面或 API 端點'
      },
      {
        stepNumber: 5,
        title: '設定例外規則（選用）',
        description: '為特定路徑設定例外',
        actions: [
          '如果只想對特定路徑啟用限制：',
          '在規則的條件中加入 URI 過濾：',
          '  (http.request.uri.path matches "/api/.*") and not (http.user_agent in $allowed_user_agents)',
          '這樣只會對 /api/ 路徑下的請求進行 User-Agent 限制',
          '其他路徑則不受影響'
        ],
        screenshot: null,
        notes: '靈活運用路徑過濾可以平衡安全性和使用者體驗'
      }
    ],
    references: [
      {
        title: 'Cloudflare Rules Language',
        url: 'https://developers.cloudflare.com/ruleset-engine/rules-language/',
        type: 'official'
      },
      {
        title: '內部文件 - Custom Rules',
        url: '/backend/docs/cloudflare/stages/stage-4-security-products/custom-rules.md',
        type: 'internal'
      }
    ],
    relatedScores: ['http.user_agent'],
    troubleshooting: [
      {
        issue: '白名單方式導致大量正常用戶被阻擋',
        solution: '白名單方式過於嚴格，建議改用黑名單（阻擋已知惡意）方式，或僅對高風險端點使用白名單。'
      },
      {
        issue: '移動裝置用戶無法訪問',
        solution: '確保白名單包含常見的移動裝置 User-Agent 模式，如 iPhone、Android、iPad 等。可以使用部分匹配而非完整匹配。'
      }
    ]
  },

  // ========================================
  // IP 地址管理
  // ========================================
  RESTRICT_HIGH_RISK_IPS: {
    id: 'RESTRICT_HIGH_RISK_IPS',
    title: '限制高風險 IP 地址的訪問',
    category: 'IP Management',
    severity: 'medium',
    estimatedTime: '10-15 分鐘',
    prerequisites: [
      '需要 Cloudflare Pro 或以上方案',
      '已登入 Cloudflare Dashboard',
      '了解網站的主要訪問地理位置'
    ],
    steps: [
      {
        stepNumber: 1,
        title: '使用 Threat Score 阻擋高風險 IP',
        description: '利用 Cloudflare 的 IP Reputation 功能',
        actions: [
          '登入 Cloudflare Dashboard',
          '選擇目標網站',
          '前往 Security → WAF → Custom rules',
          '點擊「Create rule」',
          '規則名稱：Block High Risk IPs by Threat Score',
          '點擊「Edit expression」',
          '輸入表達式：',
          '  (cf.threat_score gt 50)',
          '這會阻擋 Cloudflare 評分為高風險的 IP（分數越高越危險，0-100）',
          '選擇動作：「Managed Challenge」或「Block」',
          '點擊「Deploy」'
        ],
        screenshot: null,
        notes: 'Threat Score 是 Cloudflare 基於全球流量分析給出的 IP 風險評分'
      },
      {
        stepNumber: 2,
        title: '根據國家地理位置限制訪問',
        description: '阻擋或挑戰特定國家的流量',
        actions: [
          '建立新的 Custom Rule',
          '規則名稱：Challenge Traffic from High-Risk Countries',
          '點擊「Edit expression」',
          '輸入表達式（範例：阻擋特定國家）：',
          '  (ip.geoip.country in {"CN" "RU" "KP"})',
          '或阻擋除了允許國家外的所有流量（白名單）：',
          '  not (ip.geoip.country in {"TW" "US" "JP" "SG"})',
          '選擇動作：',
          '  - Managed Challenge（建議，不完全阻擋）',
          '  - Block（完全阻擋）',
          '點擊「Deploy」'
        ],
        screenshot: null,
        notes: '使用 ISO 3166-1 Alpha-2 國家代碼（TW=台灣，US=美國，CN=中國等）'
      },
      {
        stepNumber: 3,
        title: '建立 IP 黑名單',
        description: '手動封鎖特定的惡意 IP',
        actions: [
          '前往 Account Home → Configurations → Lists',
          '點擊「Create new list」',
          '清單類型選擇：「IP list」',
          '清單名稱：blocked_ips',
          '新增惡意 IP 地址或 IP 段：',
          '  單一 IP：192.168.1.100',
          '  IP 段：192.168.1.0/24',
          '點擊「Create」',
          '返回網站 Custom rules，建立規則：',
          '  表達式：(ip.src in $blocked_ips)',
          '  動作：Block'
        ],
        screenshot: null,
        notes: 'IP Lists 可以包含最多 10,000 個項目（Business）或 50,000 個（Enterprise）'
      },
      {
        stepNumber: 4,
        title: '結合 BOT Management（Enterprise）',
        description: '識別和阻擋自動化攻擊',
        actions: [
          '如果您有 Enterprise 方案，可以使用 Bot Management',
          '前往 Security → Bots',
          '啟用「Bot Fight Mode」或「Super Bot Fight Mode」',
          '在 Custom Rules 中使用 Bot Score：',
          '  表達式：(cf.bot_management.score lt 30)',
          '  動作：Managed Challenge 或 Block',
          'Bot Score < 30 表示很可能是自動化工具'
        ],
        screenshot: null,
        notes: 'Bot Management 是 Enterprise 功能，可以精確識別機器人流量'
      },
      {
        stepNumber: 5,
        title: '監控和調整策略',
        description: '持續優化 IP 限制規則',
        actions: [
          '前往 Security → Events 查看被阻擋的請求',
          '分析攻擊來源的 IP 地理分布',
          '檢查是否有誤報（正常用戶被阻擋）',
          '定期檢視 Threat Score 閾值是否合適',
          '根據攻擊模式調整國家限制策略',
          '每月匯出統計報表，評估防護效果'
        ],
        screenshot: null,
        notes: '建議結合多種方式（Threat Score + 地理位置 + IP 黑名單）以達到最佳效果'
      }
    ],
    references: [
      {
        title: 'Cloudflare Threat Score',
        url: 'https://developers.cloudflare.com/ruleset-engine/rules-language/fields/#cfthreat_score',
        type: 'official'
      },
      {
        title: 'Cloudflare IP Lists',
        url: 'https://developers.cloudflare.com/waf/tools/lists/custom-lists/',
        type: 'official'
      },
      {
        title: 'Bot Management',
        url: 'https://developers.cloudflare.com/bots/',
        type: 'official'
      }
    ],
    relatedScores: ['cf.threat_score', 'ip.geoip.country', 'cf.bot_management.score'],
    troubleshooting: [
      {
        issue: '合法用戶因為使用 VPN 被阻擋',
        solution: 'VPN IP 通常有較高的 Threat Score。建議使用 Managed Challenge 而非直接 Block，或降低 Threat Score 閾值。'
      },
      {
        issue: '阻擋特定國家後業務受影響',
        solution: '如果有該國的合法用戶，建議使用 Managed Challenge 而非 Block，或建立例外規則允許已知的合法 IP。'
      },
      {
        issue: '不確定應該封鎖哪些國家',
        solution: '先不要封鎖，使用 Log 模式記錄 1-2 週，分析哪些國家的流量中攻擊比例最高，再針對性封鎖。'
      }
    ]
  },

  // ========================================
  // 輸入驗證與參數檢查
  // ========================================
  INPUT_VALIDATION_RULES: {
    id: 'INPUT_VALIDATION_RULES',
    title: '強化輸入驗證與參數檢查',
    category: 'Input Validation',
    severity: 'high',
    estimatedTime: '15-25 分鐘',
    prerequisites: [
      '需要 Cloudflare Pro 或以上方案（Custom Rules 功能）',
      '已登入 Cloudflare Dashboard',
      '了解應用程式的 API 端點和參數需求',
      '確認需要保護的敏感路徑（如 /api/, /admin/ 等）'
    ],
    steps: [
      {
        stepNumber: 1,
        title: '進入 Custom Rules 設定頁面',
        description: '開啟 WAF Custom Rules 設定區域',
        actions: [
          '登入 Cloudflare Dashboard',
          '選擇目標網站',
          '前往 Security → WAF → Custom rules',
          '查看現有的 Custom rules 列表'
        ],
        screenshot: null,
        notes: 'Custom rules 功能需要 Pro 或以上方案才能使用'
      },
      {
        stepNumber: 2,
        title: '建立 HTTP Header 驗證規則',
        description: '驗證關鍵的 HTTP Headers（如 CSRF Token、API Key）',
        actions: [
          '點擊「Create rule」按鈕',
          '規則名稱：Validate Required Headers',
          '設定條件（方式一）- 驗證 CSRF Token 存在性：',
          '  點擊「Edit expression」',
          '  輸入：not any(lower(http.request.headers.names[*])[*] eq "x-csrf-token") and (http.request.uri.path eq "/api/submit")',
          '設定條件（方式二）- 驗證 API Key 值：',
          '  輸入：not any(http.request.headers["x-api-key"][*] eq "your-secret-key") and (http.request.uri.path matches "^/api/")',
          '設定條件（方式三）- 驗證多個 Headers：',
          '  輸入：(http.request.method eq "POST") and not (any(http.request.headers["x-csrf-token"][*] ne "") and any(http.request.headers["x-api-key"][*] ne ""))',
          '選擇動作：Block 或 Managed Challenge',
          '（可選）配置自定義回應：',
          '  Response type: application/json',
          '  Response code: 403',
          '  Response body: {"error": "Missing required security headers"}',
          '點擊「Deploy」部署規則'
        ],
        screenshot: null,
        notes: 'Header 名稱在 http.request.headers 欄位中會自動轉為小寫。CSRF Token 驗證對防止跨站請求偽造攻擊非常重要。'
      },
      {
        stepNumber: 3,
        title: '建立 Cookie 驗證規則',
        description: '驗證 Session Cookie 格式和存在性',
        actions: [
          '建立新的 Custom Rule',
          '規則名稱：Validate Session Cookie',
          '點擊「Edit expression」',
          '設定條件（方式一）- 驗證 Cookie 存在且格式正確：',
          '  輸入：not http.cookie matches "session_id=[0-9a-f]{32}" and (http.request.uri.path matches "^/dashboard/")',
          '設定條件（方式二）- 驗證多個 Cookie：',
          '  輸入：(http.request.uri.path eq "/api/protected") and not (http.cookie contains "auth_token=" and http.cookie contains "user_id=")',
          '設定條件（方式三）- 保護特定區域：',
          '  輸入：(http.request.uri.path matches "^/(admin|dashboard)/") and not http.cookie matches "admin_session=[0-9a-zA-Z]{40}"',
          '選擇動作：',
          '  - Block：完全阻擋',
          '  - Managed Challenge：顯示挑戰頁面',
          '  - Redirect：重定向到登入頁面（配置 URL: https://example.com/login）',
          '點擊「Deploy」'
        ],
        screenshot: null,
        notes: 'matches 運算子需要 Business 或 Enterprise 方案。Cookie 驗證可以防止未授權訪問敏感區域。'
      },
      {
        stepNumber: 4,
        title: '建立 HMAC Token 驗證規則（進階）',
        description: '使用 HMAC Token 提供更強的 API 保護',
        actions: [
          '建立新的 Custom Rule',
          '規則名稱：HMAC Token Validation',
          '點擊「Edit expression」',
          '使用 is_timed_hmac_valid_v0() 函數驗證 Token：',
          '  基本格式：',
          '  (http.host eq "api.example.com" and not is_timed_hmac_valid_v0("your-secret-key", http.request.uri, 3600, http.request.timestamp.sec, 8))',
          '  ',
          '  參數說明：',
          '  - "your-secret-key"：用於生成 HMAC 的密鑰（與後端共享）',
          '  - http.request.uri：要驗證的完整 URI（包含 Token）',
          '  - 3600：Token 有效期（秒），例如 3600 = 1 小時',
          '  - http.request.timestamp.sec：當前時間戳',
          '  - 8：分隔符長度（例如 "?verify=" 的長度為 8）',
          '  ',
          '  範例 URI 格式：',
          '  /api/resource?verify=1234567890-base64encodedhmac',
          '選擇動作：Block',
          '配置自定義回應：',
          '  Response type: application/json',
          '  Response code: 401',
          '  Response body: {"error": "Invalid or expired token"}',
          '點擊「Deploy」'
        ],
        screenshot: null,
        notes: 'is_timed_hmac_valid_v0() 函數需要 Pro 或以上方案。HMAC Token 驗證提供時間限制和防篡改保護，適合保護下載連結、API 端點等。後端需要使用相同的密鑰和算法生成 Token。'
      },
      {
        stepNumber: 5,
        title: '限制敏感路徑訪問',
        description: '為管理後台和 API 端點建立額外保護',
        actions: [
          '建立新的 Custom Rule',
          '規則名稱：Protect Sensitive Paths',
          '點擊「Edit expression」',
          '設定條件（方式一）- 限制管理後台訪問（需特定 IP）：',
          '  輸入：(http.request.uri.path matches "^/(admin|wp-admin|phpmyadmin)/") and not (ip.src in {192.168.1.100 10.0.0.0/8})',
          '設定條件（方式二）- 限制 API 訪問（需 Header + Cookie）：',
          '  輸入：(http.request.uri.path matches "^/api/") and not (any(http.request.headers["x-api-key"][*] ne "") and http.cookie contains "session_id=")',
          '設定條件（方式三）- 組合多個保護層：',
          '  輸入：(http.request.uri.path eq "/api/admin/delete") and not (',
          '    (ip.src in {192.168.1.0/24}) and',
          '    (http.request.method eq "DELETE") and',
          '    (any(http.request.headers["x-admin-token"][*] ne "")) and',
          '    (http.cookie matches "admin_session=[0-9a-zA-Z]{40}")',
          '  )',
          '選擇動作：Block',
          '點擊「Deploy」'
        ],
        screenshot: null,
        notes: '建議為不同敏感度的路徑建立不同的規則。管理後台應該限制 IP 訪問，API 端點應該驗證 Token 或 API Key。'
      },
      {
        stepNumber: 6,
        title: '監控和調整',
        description: '驗證規則效果並進行微調',
        actions: [
          '前往 Security → Events 查看安全事件',
          '篩選條件：',
          '  - Action: Block 或 Managed Challenge',
          '  - Rule: 選擇剛才建立的規則名稱',
          '檢查被阻擋的請求：',
          '  - 確認是否為真實的異常請求',
          '  - 識別誤報情況（正常請求被阻擋）',
          '如有誤報：',
          '  - 方式一：調整規則條件（放寬驗證）',
          '  - 方式二：建立例外規則（Skip 特定條件）',
          '  - 方式三：改用「Log」模式觀察幾天後再啟用「Block」',
          '建立監控儀表板：',
          '  - 使用 GraphQL Analytics API 定期查詢規則觸發次數',
          '  - 設定告警（當規則觸發次數異常時通知）',
          '定期檢視（建議每週）：',
          '  - 檢查規則是否仍然有效',
          '  - 根據新的攻擊模式調整規則',
          '  - 更新 API Key、Session Cookie 格式等'
        ],
        screenshot: null,
        notes: '持續監控和調整是維持安全的關鍵。建議先使用「Log」模式測試 1-2 天，確認無誤報後再改為「Block」。'
      }
    ],
    references: [
      {
        title: 'Cloudflare Custom Rules 官方文件',
        url: 'https://developers.cloudflare.com/waf/custom-rules/',
        type: 'official'
      },
      {
        title: 'Require specific HTTP headers 用例',
        url: 'https://developers.cloudflare.com/waf/custom-rules/use-cases/require-specific-headers/',
        type: 'official'
      },
      {
        title: 'Require a specific cookie 用例',
        url: 'https://developers.cloudflare.com/waf/custom-rules/use-cases/require-specific-cookie/',
        type: 'official'
      },
      {
        title: 'Configure token authentication 用例',
        url: 'https://developers.cloudflare.com/waf/custom-rules/use-cases/configure-token-authentication/',
        type: 'official'
      },
      {
        title: 'Cloudflare Rules Language 語法',
        url: 'https://developers.cloudflare.com/ruleset-engine/rules-language/',
        type: 'official'
      },
      {
        title: '內部文件 - Custom Rules 詳細說明',
        url: '/backend/docs/cloudflare/stages/stage-4-security-products/custom-rules.md',
        type: 'internal'
      }
    ],
    relatedScores: ['http.request.headers', 'http.cookie', 'http.request.uri.path'],
    troubleshooting: [
      {
        issue: '正常的 API 請求被阻擋',
        solution: '1. 檢查 Header 或 Cookie 格式是否正確。2. 確認規則的表達式是否過於嚴格。3. 先使用「Log」模式觀察 1-2 天，分析被阻擋的請求。4. 為特定的合法用戶或 IP 建立例外規則（Skip 規則）。5. 如果使用 HMAC Token，檢查後端生成的 Token 格式和密鑰是否正確。'
      },
      {
        issue: 'HMAC Token 驗證總是失敗',
        solution: '1. 確認後端使用的密鑰與規則中的密鑰一致。2. 檢查 Token 的時間戳是否正確（後端和 Cloudflare 時間需同步）。3. 確認分隔符長度參數正確（例如 "?verify=" 長度為 8）。4. 檢查 Token 是否已過期（根據設定的有效期）。5. 使用 curl 測試並查看 Security Events 中的詳細錯誤訊息。'
      },
      {
        issue: '使用 matches 運算子時出現語法錯誤',
        solution: 'matches 運算子需要 Business 或 Enterprise 方案。如果是 Pro 方案，改用 contains、eq、starts_with 等運算子。例如：將 http.cookie matches "session=[0-9a-f]{32}" 改為 http.cookie contains "session=" and len(http.cookie) ge 40。'
      },
      {
        issue: '不確定應該驗證哪些 Headers 或 Cookies',
        solution: '1. 檢查應用程式的前端代碼，找出發送的 Headers 和 Cookies。2. 使用瀏覽器開發者工具（F12）查看 Network 請求。3. 優先驗證安全相關的 Headers（如 X-CSRF-Token、Authorization、X-API-Key）。4. 對於敏感操作（如刪除、修改），建議驗證 Session Cookie 和 CSRF Token。5. 諮詢開發團隊確認應用程式的安全機制。'
      }
    ]
  },

  // ========================================
  // 流量監控
  // ========================================
  MONITOR_TRAFFIC_PATTERNS: {
    id: 'MONITOR_TRAFFIC_PATTERNS',
    title: '監控流量模式',
    category: 'Monitoring',
    severity: 'low',
    estimatedTime: '20-30 分鐘',
    prerequisites: [
      '需要 Cloudflare Pro 或以上方案（完整分析功能）',
      '已登入 Cloudflare Dashboard',
      '了解網站的正常流量模式'
    ],
    steps: [
      {
        stepNumber: 1,
        title: '使用 Cloudflare Analytics Dashboard',
        description: '查看網站流量總覽',
        actions: [
          '登入 Cloudflare Dashboard',
          '選擇目標網站',
          '前往「Analytics & Logs」→「Traffic」',
          '查看關鍵指標：',
          '  - Total Requests（總請求數）',
          '  - Cached Requests（快取請求比例）',
          '  - Bandwidth（頻寬使用）',
          '  - Unique Visitors（獨立訪客）',
          '調整時間範圍（Last 24 hours, Last 7 days 等）'
        ],
        screenshot: null,
        notes: 'Free 方案只能查看最近 24 小時的資料，Pro 以上可查看更長時間'
      },
      {
        stepNumber: 2,
        title: '監控安全事件',
        description: '查看被阻擋和挑戰的請求',
        actions: [
          '前往「Security」→「Events」',
          '查看 Security Events 摘要：',
          '  - Total events（事件總數）',
          '  - Top sources（主要攻擊來源）',
          '  - Top rules（觸發最多的規則）',
          '  - Top countries（攻擊來源國家）',
          '  - Top paths（被攻擊的路徑）',
          '點擊任一事件查看詳細資訊',
          '可以篩選特定規則、動作或時間範圍'
        ],
        screenshot: null,
        notes: '定期檢視 Security Events 可以及早發現攻擊趨勢'
      },
      {
        stepNumber: 3,
        title: '設定流量異常告警',
        description: '當流量異常時接收通知',
        actions: [
          '前往「Notifications」',
          '點擊「Add」建立新的通知',
          '選擇通知類型：',
          '  - Advanced DDoS Attack Alerting（DDoS 攻擊告警）',
          '  - Traffic Anomaly Alerting（流量異常告警）',
          '  - WAF Alerting（WAF 事件告警）',
          '設定觸發條件（如：流量超過正常值 300%）',
          '選擇通知方式：Email、Webhook、PagerDuty 等',
          '點擊「Create」'
        ],
        screenshot: null,
        notes: '告警功能可以在 Pro 方案以上使用'
      },
      {
        stepNumber: 4,
        title: '使用 Cloudflare Logs（Enterprise）',
        description: '匯出詳細日誌進行深度分析',
        actions: [
          '如果有 Enterprise 方案，可以使用 Logpush：',
          '前往「Analytics & Logs」→「Logs」',
          '點擊「Connect a service」',
          '選擇日誌目的地：',
          '  - AWS S3',
          '  - Google Cloud Storage',
          '  - Azure Blob Storage',
          '  - Splunk',
          '  - Elasticsearch',
          '設定要匯出的欄位和篩選條件',
          '啟用 Logpush'
        ],
        screenshot: null,
        notes: 'Logpush 可以將所有請求日誌匯出到您的分析平台'
      },
      {
        stepNumber: 5,
        title: '建立自定義監控儀表板',
        description: '使用 Cloudflare GraphQL API 取得資料',
        actions: [
          '前往「Analytics & Logs」→「GraphQL Analytics」',
          '使用 GraphQL API 查詢自定義資料：',
          '  - 特定路徑的流量',
          '  - 特定國家的請求數',
          '  - WAF 規則觸發統計',
          '  - Bot Score 分布',
          '將資料整合到您的監控系統（如 Grafana）',
          '設定自動化腳本定期抓取資料'
        ],
        screenshot: null,
        notes: 'GraphQL API 功能需要 Pro 或以上方案'
      },
      {
        stepNumber: 6,
        title: '分析流量模式並採取行動',
        description: '根據監控結果調整防護策略',
        actions: [
          '每週檢視一次流量分析報告',
          '識別異常模式：',
          '  - 流量突然暴增（可能是 DDoS）',
          '  - 特定 IP 請求頻率過高（可能是掃描）',
          '  - 異常的 User-Agent 分布',
          '  - 來自新國家的大量流量',
          '根據發現調整 WAF 規則：',
          '  - 新增 Custom Rules',
          '  - 調整 Rate Limiting',
          '  - 更新 IP 黑白名單',
          '記錄調整結果，持續優化'
        ],
        screenshot: null,
        notes: '持續監控和調整是維持安全的關鍵'
      }
    ],
    references: [
      {
        title: 'Cloudflare Analytics',
        url: 'https://developers.cloudflare.com/analytics/',
        type: 'official'
      },
      {
        title: 'Cloudflare Notifications',
        url: 'https://developers.cloudflare.com/fundamentals/notifications/',
        type: 'official'
      },
      {
        title: 'Cloudflare Logs',
        url: 'https://developers.cloudflare.com/logs/',
        type: 'official'
      },
      {
        title: 'GraphQL Analytics API',
        url: 'https://developers.cloudflare.com/analytics/graphql-api/',
        type: 'official'
      }
    ],
    relatedScores: [],
    troubleshooting: [
      {
        issue: '告警太頻繁，產生大量誤報',
        solution: '調整告警閾值，設定更合理的觸發條件。例如將流量異常閾值從 200% 提高到 500%。'
      },
      {
        issue: '無法匯出日誌進行分析',
        solution: 'Logpush 是 Enterprise 功能。如果是 Pro/Business 方案，可以使用 GraphQL API 定期抓取統計資料，或升級到 Enterprise。'
      },
      {
        issue: '不知道如何判斷流量是否異常',
        solution: '先建立正常流量的基準線（baseline）。記錄 2-4 週的正常流量數據，然後將新的流量與基準線比較，超過 300-500% 通常表示異常。'
      }
    ]
  }
};

/**
 * 根據建議標題或分類，找到對應的操作指引 ID
 * @param {string} title - 建議標題
 * @param {string} category - 分類
 * @returns {string|null} - 操作指引 ID
 */
function mapRecommendationToGuideId(title, category) {
  // 標題關鍵字對應表
  const titleMappings = {
    'WAF': 'WAF_CUSTOM_RULE_SETUP',
    'Custom Rule': 'WAF_CUSTOM_RULE_SETUP',
    'custom rule': 'WAF_CUSTOM_RULE_SETUP',
    
    // User-Agent 相關
    'User-Agent 規則': 'USER_AGENT_RULES',
    '強化 User-Agent': 'USER_AGENT_RULES',
    'User-Agent 灰名單': 'USER_AGENT_GREYLIST',
    'User-Agent灰名單': 'USER_AGENT_GREYLIST',
    'User-Agent 黑名單': 'USER_AGENT_GREYLIST',
    '限制 User-Agent': 'RESTRICT_USER_AGENT',
    
    // IP 管理相關
    '高風險 IP': 'RESTRICT_HIGH_RISK_IPS',
    '限制 IP': 'RESTRICT_HIGH_RISK_IPS',
    'IP 地址': 'RESTRICT_HIGH_RISK_IPS',
    'IP地址': 'RESTRICT_HIGH_RISK_IPS',
    '封鎖來源 IP': 'RESTRICT_HIGH_RISK_IPS',
    '封鎖 IP': 'RESTRICT_HIGH_RISK_IPS',
    '封鎖IP': 'RESTRICT_HIGH_RISK_IPS',
    '阻擋 IP': 'RESTRICT_HIGH_RISK_IPS',
    '阻擋IP': 'RESTRICT_HIGH_RISK_IPS',
    'Block IP': 'RESTRICT_HIGH_RISK_IPS',
    'block ip': 'RESTRICT_HIGH_RISK_IPS',
    'IP 黑名單': 'RESTRICT_HIGH_RISK_IPS',
    'IP黑名單': 'RESTRICT_HIGH_RISK_IPS',
    'IP Blacklist': 'RESTRICT_HIGH_RISK_IPS',
    'blacklist': 'RESTRICT_HIGH_RISK_IPS',
    '來源 IP': 'RESTRICT_HIGH_RISK_IPS',
    '來源IP': 'RESTRICT_HIGH_RISK_IPS',
    
    // 監控相關
    '監控流量': 'MONITOR_TRAFFIC_PATTERNS',
    '流量模式': 'MONITOR_TRAFFIC_PATTERNS',
    '流量監控': 'MONITOR_TRAFFIC_PATTERNS',
    
    // 輸入驗證相關
    '輸入驗證': 'INPUT_VALIDATION_RULES',
    '強化輸入驗證': 'INPUT_VALIDATION_RULES',
    '參數驗證': 'INPUT_VALIDATION_RULES',
    '參數檢查': 'INPUT_VALIDATION_RULES',
    'Input Validation': 'INPUT_VALIDATION_RULES',
    'Parameter Validation': 'INPUT_VALIDATION_RULES',
    '白名單檢查': 'INPUT_VALIDATION_RULES',
    '參數化查詢': 'INPUT_VALIDATION_RULES',
    'HTTP Header': 'INPUT_VALIDATION_RULES',
    'Cookie 驗證': 'INPUT_VALIDATION_RULES',
    'HMAC Token': 'INPUT_VALIDATION_RULES',
    '阻擋攻擊': 'WAF_CUSTOM_RULE_SETUP',
    '設定 WAF 規則': 'WAF_CUSTOM_RULE_SETUP',
    'Attack Score': 'WAF_CUSTOM_RULE_SETUP',
    'SQL': 'WAF_CUSTOM_RULE_SETUP',
    'XSS': 'WAF_CUSTOM_RULE_SETUP',
    'RCE': 'WAF_CUSTOM_RULE_SETUP',
    
    '速率限制': 'RATE_LIMITING_RULE',
    'Rate Limit': 'RATE_LIMITING_RULE',
    'rate limit': 'RATE_LIMITING_RULE',
    'Rate Limiting': 'RATE_LIMITING_RULE',
    '限制請求': 'RATE_LIMITING_RULE',
    'DDoS': 'RATE_LIMITING_RULE',
    '暴力破解': 'RATE_LIMITING_RULE',
    
    'Managed Rule': 'MANAGED_RULES_DEPLOYMENT',
    'managed rule': 'MANAGED_RULES_DEPLOYMENT',
    '託管規則': 'MANAGED_RULES_DEPLOYMENT',
    'OWASP': 'MANAGED_RULES_DEPLOYMENT',
    '啟用託管規則': 'MANAGED_RULES_DEPLOYMENT',
    'Ruleset': 'MANAGED_RULES_DEPLOYMENT',
    
    'Bot': 'BOT_MANAGEMENT_SETUP',
    'bot': 'BOT_MANAGEMENT_SETUP',
    '機器人': 'BOT_MANAGEMENT_SETUP',
    'Bot Management': 'BOT_MANAGEMENT_SETUP'
  };
  
  // 先用標題比對
  if (title) {
    for (const [keyword, guideId] of Object.entries(titleMappings)) {
      if (title.includes(keyword)) {
        return guideId;
      }
    }
  }
  
  // 再用分類比對
  if (category) {
    const categoryMappings = {
      'WAF_RULES': 'WAF_CUSTOM_RULE_SETUP',
      'CUSTOM_RULES': 'WAF_CUSTOM_RULE_SETUP',
      'ATTACK_SCORE': 'WAF_CUSTOM_RULE_SETUP',
      'RATE_LIMITING': 'RATE_LIMITING_RULE',
      'RATE_LIMIT': 'RATE_LIMITING_RULE',
      'MANAGED_RULES': 'MANAGED_RULES_DEPLOYMENT',
      'BOT_MANAGEMENT': 'BOT_MANAGEMENT_SETUP'
    };
    
    const upperCategory = category.toUpperCase();
    if (categoryMappings[upperCategory]) {
      return categoryMappings[upperCategory];
    }
  }
  
  return null;
}

module.exports = {
  CLOUDFLARE_OPERATION_GUIDES,
  mapRecommendationToGuideId
};

