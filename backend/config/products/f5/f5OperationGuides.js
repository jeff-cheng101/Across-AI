// backend/config/products/f5/f5OperationGuides.js
// F5 BIG-IP Advanced WAF 操作指引
// 提供詳細的 step-by-step 操作步驟，協助用戶執行 AI 分析後的建議

/**
 * F5 操作指引資料結構
 * 
 * 每個操作指引包含：
 * - id: 唯一識別碼
 * - title: 操作標題
 * - category: 分類（SQL Injection, XSS, Rate Limiting 等）
 * - severity: 嚴重程度（critical, high, medium, low）
 * - estimatedTime: 預估操作時間
 * - prerequisites: 前置條件（陣列）
 * - steps: 詳細步驟（陣列，每個步驟包含 stepNumber, title, description, actions, notes）
 * - references: 參考文件（陣列，包含 title, url, type）
 * - relatedViolations: 相關的 F5 違規類型
 * - troubleshooting: 疑難排解（陣列，包含 issue 和 solution）
 */

const F5_OPERATION_GUIDES = {
  // ========================================
  // SQL 注入防護
  // ========================================
  SQL_INJECTION_PROTECTION: {
    id: 'SQL_INJECTION_PROTECTION',
    title: '啟用 SQL 注入防護簽章',
    category: 'SQL Injection',
    severity: 'high',
    estimatedTime: '10-15 分鐘',
    prerequisites: [
      '需要具備 F5 BIG-IP Advanced WAF 管理員權限',
      '已登入 F5 BIG-IP 管理介面',
      '確認已建立 Security Policy',
      '建議先在測試環境進行驗證'
    ],
    steps: [
      {
        stepNumber: 1,
        title: '登入 F5 BIG-IP 管理介面',
        description: '使用管理員帳號登入 F5 BIG-IP Advanced WAF 管理介面',
        actions: [
          '開啟瀏覽器，輸入 F5 管理介面 URL（例如：https://10.0.0.1:8443）',
          '輸入管理員帳號和密碼',
          '點擊「Log in」按鈕',
          '確認成功登入，看到主控台頁面'
        ],
        screenshot: null,
        notes: '建議使用 Chrome 或 Firefox 瀏覽器，並確保網路可以連接到 F5 設備'
      },
      {
        stepNumber: 2,
        title: '進入 Security Policy 設定頁面',
        description: '導航到 Application Security Policy 設定',
        actions: [
          '在左側選單點選「Security」',
          '選擇「Application Security」→「Security Policies」',
          '在 Security Policies 列表中，選擇要修改的 Policy（例如：/Common/my_waf_policy）',
          '點擊 Policy 名稱進入編輯頁面'
        ],
        screenshot: null,
        notes: '確保選擇正確的 Security Policy，建議先備份現有設定'
      },
      {
        stepNumber: 3,
        title: '啟用 SQL 注入攻擊簽章',
        description: '在 Policy 中啟用 SQL 注入相關的攻擊簽章集',
        actions: [
          '在 Policy 頁面中，點選左側選單的「Attack Signatures」',
          '點擊右上角的「Add Signature Set」按鈕',
          '在搜尋框中輸入「SQL Injection」',
          '勾選 Signature Set「200010000 - SQL Injection Signatures」',
          '在「Enforcement Mode」下拉選單中，選擇「Blocking」',
          '點擊「Add」按鈕將簽章集加入 Policy'
        ],
        screenshot: null,
        notes: '建議先在「Transparent」模式下測試一段時間，確認無誤報後再改為「Blocking」模式'
      },
      {
        stepNumber: 4,
        title: '設定違規處理方式',
        description: '配置 SQL 注入違規的處理動作與學習模式',
        actions: [
          '在 Policy 頁面中，點選左側選單的「Violations」',
          '找到並點選「VIOL_ATTACK_SIGNATURE」違規項目',
          '確認「Block」選項已勾選（阻擋此類違規）',
          '在「Learn」欄位選擇「Enabled」（啟用學習模式）',
          '設定「Alarm」為「Enabled」（啟用告警通知）',
          '點擊「Save」按鈕儲存設定'
        ],
        screenshot: null,
        notes: '啟用學習模式可以讓系統自動調整規則，減少誤報情況'
      },
      {
        stepNumber: 5,
        title: '套用並部署變更',
        description: '將設定變更套用到運行中的 Security Policy',
        actions: [
          '檢查所有設定是否正確',
          '點擊頁面右上角的「Apply Policy」按鈕',
          '在確認對話框中，點擊「Apply」',
          '等待系統套用變更（通常需要 10-30 秒）',
          '確認頁面顯示「Policy applied successfully」訊息'
        ],
        screenshot: null,
        notes: '套用變更不會中斷現有連線，但建議在低流量時段進行'
      },
      {
        stepNumber: 6,
        title: '驗證設定與測試',
        description: '驗證 SQL 注入防護是否正常運作',
        actions: [
          '前往「Security」→「Event Logs」→「Application」→「Requests」',
          '在測試環境中，嘗試發送測試 SQL 注入請求（例如：在 URL 參數中加入 \' OR 1=1--）',
          '確認該請求被阻擋並記錄在日誌中',
          '檢查日誌中的違規類型顯示為「VIOL_ATTACK_SIGNATURE」',
          '確認「Signature ID」顯示為 SQL Injection 相關簽章'
        ],
        screenshot: null,
        notes: '建議在測試環境先進行驗證，確認無誤後再套用到生產環境'
      }
    ],
    references: [
      {
        title: 'F5 BIG-IP ASM Attack Signatures 官方文件',
        url: 'https://support.f5.com/csp/knowledge-center/software/BIG-IP?module=BIG-IP%20ASM',
        type: 'official'
      },
      {
        title: 'SQL Injection 攻擊簽章詳細說明',
        url: '/backend/docs/f5/v17.1/violations-description.md#viol_attack_signature',
        type: 'internal'
      },
      {
        title: 'F5 Schema 欄位說明',
        url: '/backend/docs/f5/v17.1/schema-description.md',
        type: 'internal'
      }
    ],
    relatedViolations: [
      'VIOL_SQL_INJECTION',
      'VIOL_ATTACK_SIGNATURE',
      'VIOL_PARAMETER_VALUE_METACHAR'
    ],
    troubleshooting: [
      {
        issue: '套用 Policy 時發生錯誤「Policy is locked」',
        solution: '檢查是否有其他管理員正在編輯同一個 Policy。請等待對方完成編輯或協調後再套用。可以在 System → Users → Active Sessions 中查看活動會話。'
      },
      {
        issue: '正常流量被誤報為 SQL 注入',
        solution: '1. 將 Enforcement Mode 改為「Transparent」模式，觀察 1-2 天。2. 分析日誌，找出被誤報的簽章 ID。3. 在「Attack Signatures」中停用該特定簽章，或調整參數設定。4. 使用「Policy Builder」功能自動學習正常流量模式。'
      },
      {
        issue: '設定後仍無法阻擋 SQL 注入攻擊',
        solution: '1. 確認 Enforcement Mode 是否設定為「Blocking」。2. 檢查 Virtual Server 是否正確套用該 Security Policy（Local Traffic → Virtual Servers → Security → Policies）。3. 確認簽章更新是否為最新版本（System → Software Management → Live Update）。'
      },
      {
        issue: '找不到 Signature Set 200010000',
        solution: '可能是簽章資料庫尚未更新。前往 System → Software Management → Live Update，點擊「Check for Updates」更新簽章資料庫。'
      }
    ]
  },

  // ========================================
  // XSS 跨站腳本攻擊防護
  // ========================================
  XSS_PROTECTION: {
    id: 'XSS_PROTECTION',
    title: '啟用 XSS 跨站腳本攻擊防護',
    category: 'XSS',
    severity: 'high',
    estimatedTime: '10-15 分鐘',
    prerequisites: [
      '需要具備 F5 BIG-IP Advanced WAF 管理員權限',
      '已登入 F5 BIG-IP 管理介面',
      '確認已建立 Security Policy'
    ],
    steps: [
      {
        stepNumber: 1,
        title: '進入 Security Policy 設定',
        description: '導航到要設定的 Security Policy',
        actions: [
          '登入 F5 BIG-IP 管理介面',
          '選擇「Security」→「Application Security」→「Security Policies」',
          '選擇目標 Security Policy 並進入編輯頁面'
        ],
        screenshot: null,
        notes: '確保選擇正確的 Policy'
      },
      {
        stepNumber: 2,
        title: '啟用 XSS 攻擊簽章集',
        description: '新增 XSS 相關攻擊簽章集到 Policy',
        actions: [
          '點選左側選單的「Attack Signatures」',
          '點擊「Add Signature Set」按鈕',
          '在搜尋框中輸入「Cross-Site Scripting」或「XSS」',
          '勾選 Signature Set「200003000 - Cross-Site Scripting (XSS) Signatures」',
          '將「Enforcement Mode」設定為「Blocking」',
          '點擊「Add」按鈕'
        ],
        screenshot: null,
        notes: '可以同時加入多個 XSS 相關簽章集以提高防護效果'
      },
      {
        stepNumber: 3,
        title: '啟用參數層級的 XSS 檢查',
        description: '在參數層級啟用 XSS 檢查功能',
        actions: [
          '在 Policy 頁面中，前往「Parameters」',
          '選擇全域參數設定（通常是 * 號）',
          '勾選「Check for XSS in parameter value」選項',
          '勾選「Check for XSS in parameter name」選項（如需要）',
          '點擊「Update」按鈕儲存設定'
        ],
        screenshot: null,
        notes: '這會檢查所有參數值和參數名稱中的 XSS 攻擊模式'
      },
      {
        stepNumber: 4,
        title: '設定 XSS 違規處理',
        description: '配置 XSS 違規的處理方式',
        actions: [
          '前往「Violations」設定頁面',
          '找到「VIOL_XSS」和「VIOL_ATTACK_SIGNATURE」',
          '確認兩者的「Block」選項都已啟用',
          '啟用「Learn」和「Alarm」功能',
          '點擊「Save」儲存設定'
        ],
        screenshot: null,
        notes: 'VIOL_XSS 是針對 XSS 的特定檢查，VIOL_ATTACK_SIGNATURE 則包含簽章比對'
      },
      {
        stepNumber: 5,
        title: '套用變更',
        description: '將 Policy 變更套用到系統',
        actions: [
          '點擊頁面右上角的「Apply Policy」按鈕',
          '確認變更內容無誤',
          '點擊「Apply」確認',
          '等待系統套用完成'
        ],
        screenshot: null,
        notes: '套用時間取決於 Policy 複雜度，通常 10-30 秒'
      },
      {
        stepNumber: 6,
        title: '測試與驗證',
        description: '驗證 XSS 防護是否正常運作',
        actions: [
          '前往「Event Logs」查看日誌',
          '測試發送包含 XSS 腳本的請求（例如：<script>alert("XSS")</script>）',
          '確認請求被阻擋',
          '檢查日誌中顯示 VIOL_XSS 或 VIOL_ATTACK_SIGNATURE',
          '驗證正常流量不受影響'
        ],
        screenshot: null,
        notes: '務必在測試環境先驗證，避免影響正常業務'
      }
    ],
    references: [
      {
        title: 'F5 XSS Protection 官方文件',
        url: 'https://support.f5.com/csp/knowledge-center',
        type: 'official'
      },
      {
        title: 'XSS 違規類型說明',
        url: '/backend/docs/f5/v17.1/violations-description.md#viol_xss',
        type: 'internal'
      }
    ],
    relatedViolations: ['VIOL_XSS', 'VIOL_ATTACK_SIGNATURE', 'VIOL_PARAMETER_VALUE_METACHAR'],
    troubleshooting: [
      {
        issue: '正常的 HTML 內容被誤判為 XSS',
        solution: '如果網站需要允許用戶輸入 HTML（例如富文本編輯器），可以針對特定參數停用 XSS 檢查，或使用白名單模式。'
      },
      {
        issue: '某些 XSS 變種無法被偵測',
        solution: '更新攻擊簽章資料庫到最新版本，並考慮啟用多個 XSS 簽章集以提高覆蓋率。'
      }
    ]
  },

  // ========================================
  // 速率限制 (Rate Limiting)
  // ========================================
  RATE_LIMITING: {
    id: 'RATE_LIMITING',
    title: '設定速率限制規則',
    category: 'Rate Limiting',
    severity: 'medium',
    estimatedTime: '15-20 分鐘',
    prerequisites: [
      '需要具備 F5 BIG-IP 管理員權限',
      '已登入 F5 管理介面',
      '瞭解應用程式的正常流量模式'
    ],
    steps: [
      {
        stepNumber: 1,
        title: '建立 DoS Protection Profile',
        description: '建立新的 DoS Protection Profile 用於速率限制',
        actions: [
          '前往「Security」→「DoS Protection」→「DoS Profiles」',
          '點擊右上角的「Create」按鈕',
          '輸入 Profile 名稱（例如：rate_limit_profile）',
          '在「Profile Type」選擇「Application Security」',
          '點擊「Create」建立 Profile'
        ],
        screenshot: null,
        notes: 'DoS Profile 可以套用到多個 Virtual Server'
      },
      {
        stepNumber: 2,
        title: '設定 TPS-based 速率限制',
        description: '配置基於 TPS（Transactions Per Second）的速率限制',
        actions: [
          '在 DoS Profile 編輯頁面中，點選「Application Security」標籤',
          '在「TPS-based Detection」區塊，點擊「Enabled」',
          '設定「Threshold」值（例如：100 requests/second）',
          '選擇「Rate Limit Mode」為「Block」（阻擋超過限制的請求）',
          '設定「Detection Threshold」（偵測閾值，通常設為 Threshold 的 80%）',
          '點擊「Update」按鈕儲存設定'
        ],
        screenshot: null,
        notes: '建議從較高的閾值開始（如 1000 req/s），觀察流量後逐步調整'
      },
      {
        stepNumber: 3,
        title: '設定 URL-based 速率限制（選用）',
        description: '針對特定 URL 設定不同的速率限制',
        actions: [
          '在 DoS Profile 中，點選「URLs」標籤',
          '點擊「Add」新增 URL',
          '輸入要保護的 URL 路徑（例如：/api/login）',
          '設定該 URL 的專屬速率限制（例如：10 req/s）',
          '選擇處理方式（Block 或 Rate Limit）',
          '點擊「Add」完成設定'
        ],
        screenshot: null,
        notes: '可以針對登入頁面、API 端點等設定更嚴格的限制'
      },
      {
        stepNumber: 4,
        title: '設定客戶端追蹤方式',
        description: '選擇如何識別和追蹤客戶端',
        actions: [
          '在「Detection Criteria」區塊，選擇追蹤方式',
          '選項包括：Source IP、Session ID、Cookie 等',
          '建議選擇「Source IP」作為主要追蹤方式',
          '可以啟用「By Geolocation」針對特定地理位置設定',
          '點擊「Update」儲存'
        ],
        screenshot: null,
        notes: '追蹤方式影響如何識別和計算請求速率'
      },
      {
        stepNumber: 5,
        title: '套用 DoS Profile 到 Virtual Server',
        description: '將建立的 DoS Profile 套用到要保護的 Virtual Server',
        actions: [
          '前往「Local Traffic」→「Virtual Servers」→「Virtual Server List」',
          '選擇要保護的 Virtual Server 並點擊進入',
          '點選「Security」標籤',
          '在「DoS Protection Profile」下拉選單中，選擇剛才建立的 Profile',
          '點擊「Update」按鈕套用設定'
        ],
        screenshot: null,
        notes: '一個 Virtual Server 只能套用一個 DoS Profile'
      },
      {
        stepNumber: 6,
        title: '監控與調整',
        description: '監控速率限制效果並進行調整',
        actions: [
          '前往「Security」→「DoS Protection」→「DoS Overview」',
          '選擇剛才設定的 Profile 查看統計資料',
          '觀察「Dropped」和「Rate Limited」請求數量',
          '分析是否有誤殺正常流量',
          '根據實際情況調整閾值'
        ],
        screenshot: null,
        notes: '建議持續監控 1-2 週，根據實際流量模式微調參數'
      }
    ],
    references: [
      {
        title: 'F5 DoS Protection 官方文件',
        url: 'https://support.f5.com/csp/knowledge-center',
        type: 'official'
      },
      {
        title: 'Rate Limiting 最佳實踐',
        url: 'https://support.f5.com/csp/article/K17197',
        type: 'official'
      }
    ],
    relatedViolations: ['VIOL_BRUTE_FORCE'],
    troubleshooting: [
      {
        issue: '速率限制太嚴格，影響正常用戶',
        solution: '1. 提高 Threshold 值。2. 改用「Rate Limit」模式而非「Block」模式，讓超過限制的請求排隊而非直接阻擋。3. 針對已知的合法客戶端（如 API 合作夥伴）設定白名單。'
      },
      {
        issue: '速率限制無效，攻擊流量仍然通過',
        solution: '1. 檢查 Virtual Server 是否正確套用 DoS Profile。2. 確認追蹤方式是否適當（如攻擊者使用多個 IP，需考慮其他追蹤方式）。3. 調低 Threshold 值。'
      },
      {
        issue: '無法區分正常高流量和 DDoS 攻擊',
        solution: '使用「Behavioral DoS」功能，讓系統自動學習正常流量基線，動態調整閾值。前往 DoS Profile → Behavioral DoS 啟用此功能。'
      }
    ]
  },

  // ========================================
  // 調整 Violation Rating 閾值
  // ========================================
  ADJUST_VIOLATION_RATING: {
    id: 'ADJUST_VIOLATION_RATING',
    title: '調整 Violation Rating 閾值',
    category: 'Policy Tuning',
    severity: 'medium',
    estimatedTime: '5-10 分鐘',
    prerequisites: [
      '需要具備 F5 BIG-IP Advanced WAF 管理員權限',
      '已登入 F5 管理介面',
      '了解當前的誤報率和流量特性'
    ],
    steps: [
      {
        stepNumber: 1,
        title: '進入 Security Policy 設定',
        description: '開啟要調整的 Security Policy',
        actions: [
          '登入 F5 BIG-IP 管理介面',
          '前往 Security → Application Security → Security Policies',
          '選擇目標 Security Policy'
        ],
        screenshot: null,
        notes: '建議先備份現有 Policy 設定'
      },
      {
        stepNumber: 2,
        title: '檢視當前違規評分設定',
        description: '查看當前的 violation_rating 閾值設定',
        actions: [
          '在 Policy 頁面中，點選左側選單的「Violations」',
          '檢視各個違規項目的評分設定',
          '記錄當前的閾值配置',
          '查看日誌中的 violation_rating 分布情況'
        ],
        screenshot: null,
        notes: 'violation_rating 是 F5 對請求風險程度的評分（0-100），數值越高表示風險越高'
      },
      {
        stepNumber: 3,
        title: '調整全域違規評分閾值',
        description: '設定全域的違規評分閾值',
        actions: [
          '前往「Policy Building」→「Learning and Blocking Settings」',
          '找到「Violation Rating」區塊',
          '調整「High」閾值（建議值：70-80，預設 70）',
          '調整「Medium」閾值（建議值：50-60，預設 50）',
          '調整「Low」閾值（建議值：30-40，預設 30）',
          '點擊「Save」儲存設定'
        ],
        screenshot: null,
        notes: '降低閾值會增加阻擋敏感度，提高閾值會減少誤報但可能遺漏攻擊'
      },
      {
        stepNumber: 4,
        title: '調整特定違規項目的評分權重',
        description: '針對特定違規類型微調評分',
        actions: [
          '在「Violations」頁面中，選擇要調整的違規項目',
          '點擊違規項目進入詳細設定',
          '調整「Violation Rating」欄位的數值（0-100）',
          '評分越高的違規在觸發時會讓整體 violation_rating 更高',
          '點擊「Update」儲存'
        ],
        screenshot: null,
        notes: '常見高風險違規（如 VIOL_ATTACK_SIGNATURE）建議設定為 80-100'
      },
      {
        stepNumber: 5,
        title: '設定基於評分的阻擋規則',
        description: '配置達到特定評分時的處理動作',
        actions: [
          '前往「Policy Building」→「Advanced」',
          '找到「Violation Rating Threshold」設定',
          '設定「Blocking Threshold」（建議：70，達到此評分時阻擋請求）',
          '啟用「Block requests with violation rating above threshold」',
          '點擊「Save」'
        ],
        screenshot: null,
        notes: '此設定會自動阻擋 violation_rating 超過閾值的請求'
      },
      {
        stepNumber: 6,
        title: '套用並監控效果',
        description: '套用設定並觀察效果',
        actions: [
          '點擊「Apply Policy」套用變更',
          '前往「Security」→「Event Logs」→「Application」→「Requests」',
          '觀察被阻擋的請求的 violation_rating 分布',
          '檢查是否有誤報（正常流量被阻擋）',
          '根據實際情況微調閾值'
        ],
        screenshot: null,
        notes: '建議持續監控 1-2 週，逐步調整至最佳平衡點'
      }
    ],
    references: [
      {
        title: 'F5 Violation Rating 官方說明',
        url: 'https://support.f5.com/csp/article/K13123',
        type: 'official'
      },
      {
        title: 'F5 Schema 與欄位說明',
        url: '/backend/docs/f5/v17.1/schema-description.md',
        type: 'internal'
      },
      {
        title: 'Violation Rating 閾值配置',
        url: '/backend/docs/f5/v17.1/violations-description.md',
        type: 'internal'
      }
    ],
    relatedViolations: ['ALL_VIOLATIONS'],
    troubleshooting: [
      {
        issue: '調整閾值後誤報率仍然很高',
        solution: '1. 檢查是否有特定簽章造成大量誤報，考慮停用該簽章。2. 啟用「Policy Builder」學習模式，讓系統自動學習正常流量。3. 針對誤報的 URL 或參數設定例外規則。'
      },
      {
        issue: '不確定應該設定多少的閾值',
        solution: '建議先從較高的閾值開始（如 80），觀察 1-2 天後，根據日誌中的 violation_rating 分布逐步調低。可以使用「Policy Builder」的建議功能自動推薦閾值。'
      },
      {
        issue: '調整後某些攻擊未被阻擋',
        solution: '檢查這些攻擊的 violation_rating 是否低於閾值。如果是，可以：1. 降低全域閾值。2. 提高特定違規項目的評分權重。3. 啟用更多攻擊簽章。'
      }
    ]
  },

  // ========================================
  // 監控攻擊來源和目標 URL
  // ========================================
  MONITOR_ATTACK_SOURCES: {
    id: 'MONITOR_ATTACK_SOURCES',
    title: '監控攻擊來源和目標 URL',
    category: 'Monitoring',
    severity: 'medium',
    estimatedTime: '15-20 分鐘',
    prerequisites: [
      '需要具備 F5 BIG-IP 管理員權限',
      '已登入 F5 管理介面',
      '了解如何使用 F5 Event Logs 和 Reporting 功能'
    ],
    steps: [
      {
        stepNumber: 1,
        title: '存取 F5 Event Logs',
        description: '進入事件日誌查看介面',
        actions: [
          '登入 F5 BIG-IP 管理介面',
          '前往 Security → Event Logs → Application → Requests',
          '確認可以看到最近的請求日誌'
        ],
        screenshot: null,
        notes: '預設顯示最近 1 小時的日誌'
      },
      {
        stepNumber: 2,
        title: '設定日誌篩選條件',
        description: '篩選出攻擊相關的日誌',
        actions: [
          '在日誌頁面上方，點擊「Filter」按鈕',
          '在「Request Status」下拉選單中選擇「Blocked」（被阻擋的請求）',
          '可選：設定時間範圍（Last Hour, Last 24 Hours, Custom Range）',
          '點擊「Apply Filter」套用篩選'
        ],
        screenshot: null,
        notes: '被阻擋的請求通常代表成功偵測到的攻擊'
      },
      {
        stepNumber: 3,
        title: '分析攻擊來源 IP',
        description: '識別主要攻擊來源',
        actions: [
          '在日誌列表中，觀察「Client IP」欄位',
          '點擊「Client IP」欄位標題進行排序',
          '記錄出現頻率最高的 IP 位址',
          '點擊特定 IP 可以查看該 IP 的所有請求記錄',
          '使用 IP 查詢工具（如 whois）查詢 IP 來源國家和 ISP'
        ],
        screenshot: null,
        notes: '如果發現大量來自同一 IP 的攻擊，可以考慮封鎖該 IP'
      },
      {
        stepNumber: 4,
        title: '分析被攻擊的目標 URL',
        description: '識別最常被攻擊的端點',
        actions: [
          '在日誌列表中，觀察「URI」或「Request」欄位',
          '點擊「URI」欄位標題進行排序或分組',
          '記錄被攻擊次數最多的 URL 路徑',
          '分析這些 URL 的共同特徵（如 /admin/, /api/, /login 等）',
          '評估這些端點是否需要額外的防護措施'
        ],
        screenshot: null,
        notes: '登入頁面、管理後台、API 端點通常是攻擊的主要目標'
      },
      {
        stepNumber: 5,
        title: '使用 Reporting 功能生成報表',
        description: '產生攻擊統計報表',
        actions: [
          '前往 Security → Reporting → Application → Security',
          '選擇報表類型：「Top Attacking IPs」、「Top Attacked URLs」',
          '設定報表時間範圍（Last 24 Hours, Last 7 Days 等）',
          '點擊「Generate Report」生成報表',
          '檢視報表中的 Top 10 攻擊來源和目標'
        ],
        screenshot: null,
        notes: '報表可以匯出為 PDF 或 CSV 格式'
      },
      {
        stepNumber: 6,
        title: '設定告警通知（選用）',
        description: '當偵測到異常攻擊時自動通知',
        actions: [
          '前往 System → Logs → Configuration → Options',
          '設定「Remote Logging」將日誌發送到 SIEM 系統（如 ELK）',
          '或前往 Security → Application Security → Anomaly Detection',
          '啟用「Anomaly Detection」功能',
          '設定通知方式（Email, SNMP, Syslog）',
          '設定觸發條件（如：同一 IP 在 5 分鐘內攻擊超過 100 次）'
        ],
        screenshot: null,
        notes: '整合 SIEM 可以實現更進階的分析和告警'
      },
      {
        stepNumber: 7,
        title: '根據分析結果採取行動',
        description: '基於監控結果實施防護措施',
        actions: [
          '針對高頻攻擊 IP：在「IP Address Lists」中新增黑名單',
          '針對被攻擊的 URL：加強該 URL 的 Security Policy 規則',
          '啟用 Geo-Location 封鎖（如果攻擊主要來自特定國家）',
          '調整 Rate Limiting 規則限制單一 IP 的請求頻率',
          '定期（每週）重複此監控流程，持續優化防護策略'
        ],
        screenshot: null,
        notes: '防護策略應該是持續演進的，不是一次性設定'
      }
    ],
    references: [
      {
        title: 'F5 Event Logs 官方文件',
        url: 'https://support.f5.com/csp/knowledge-center',
        type: 'official'
      },
      {
        title: 'F5 Reporting and Analytics',
        url: 'https://support.f5.com/csp/article/K14510',
        type: 'official'
      },
      {
        title: 'F5 Schema 欄位說明（包含 IP、URI 等）',
        url: '/backend/docs/f5/v17.1/schema-description.md',
        type: 'internal'
      }
    ],
    relatedViolations: ['ALL_VIOLATIONS'],
    troubleshooting: [
      {
        issue: '日誌量太大，難以分析',
        solution: '1. 使用篩選功能縮小範圍（只看 Blocked 請求）。2. 使用 Reporting 功能自動生成 Top N 統計。3. 整合外部 SIEM 系統（如 ELK、Splunk）進行更強大的分析。'
      },
      {
        issue: '無法判斷某個 IP 是攻擊還是正常流量',
        solution: '查看該 IP 的請求歷史：1. 請求頻率（正常用戶通常不會短時間內發送大量請求）。2. 請求內容（是否包含攻擊 payload）。3. User-Agent（攻擊工具通常有特定的 User-Agent）。4. 請求的 URL 分布（正常用戶不會訪問大量不存在的 URL）。'
      },
      {
        issue: '想要更自動化的監控方案',
        solution: '1. 整合 F5 與 ELK Stack，使用 Kibana Dashboard 視覺化攻擊趨勢。2. 使用 F5 iControl REST API 定期抓取統計數據。3. 啟用 F5 的 Behavioral DoS 功能，自動偵測異常流量。4. 考慮使用 F5 Cloud Services 的 Essential App Protect 獲得雲端 AI 防護。'
      }
    ]
  },

  // ========================================
  // 命令注入防護
  // ========================================
  COMMAND_INJECTION_PROTECTION: {
    id: 'COMMAND_INJECTION_PROTECTION',
    title: '啟用命令注入防護',
    category: 'Command Injection',
    severity: 'critical',
    estimatedTime: '10-15 分鐘',
    prerequisites: [
      '需要具備 F5 BIG-IP Advanced WAF 管理員權限',
      '已登入 F5 管理介面',
      '確認應用程式架構與執行命令的端點'
    ],
    steps: [
      {
        stepNumber: 1,
        title: '進入 Security Policy',
        description: '開啟要設定的 Security Policy',
        actions: [
          '登入 F5 管理介面',
          '前往 Security → Application Security → Security Policies',
          '選擇目標 Policy'
        ],
        screenshot: null,
        notes: null
      },
      {
        stepNumber: 2,
        title: '啟用命令執行攻擊簽章',
        description: '新增命令執行相關的攻擊簽章集',
        actions: [
          '點選「Attack Signatures」',
          '搜尋「Command Execution」',
          '勾選相關的 Signature Set',
          '設定為「Blocking」模式',
          '點擊「Add」'
        ],
        screenshot: null,
        notes: '命令注入攻擊可能使用各種 Shell 命令，需要多個簽章集'
      },
      {
        stepNumber: 3,
        title: '設定參數元字符檢查',
        description: '啟用對危險元字符的檢查',
        actions: [
          '前往「Parameters」設定',
          '選擇全域參數（*）',
          '在「Attack Signatures」區塊，勾選「Check」',
          '在「Meta Characters」區塊，確保危險字符（如 ;, |, &, $）被限制',
          '點擊「Update」'
        ],
        screenshot: null,
        notes: '這些元字符常用於 Shell 命令串接'
      },
      {
        stepNumber: 4,
        title: '套用並驗證',
        description: '套用設定並測試',
        actions: [
          '點擊「Apply Policy」',
          '在測試環境測試命令注入（如 ; cat /etc/passwd）',
          '確認被阻擋並記錄',
          '檢查日誌顯示相關違規'
        ],
        screenshot: null,
        notes: '務必先在測試環境驗證'
      }
    ],
    references: [
      {
        title: 'F5 Command Injection Protection',
        url: 'https://support.f5.com/csp/knowledge-center',
        type: 'official'
      },
      {
        title: '違規類型說明文件',
        url: '/backend/docs/f5/v17.1/violations-description.md',
        type: 'internal'
      }
    ],
    relatedViolations: ['VIOL_COMMAND_EXECUTION', 'VIOL_ATTACK_SIGNATURE', 'VIOL_PARAMETER_VALUE_METACHAR'],
    troubleshooting: [
      {
        issue: '合法的系統命令被誤判',
        solution: '分析被阻擋的請求，找出誤報的簽章或參數，針對特定端點停用相關檢查或加入白名單。'
      }
    ]
  },

  // ========================================
  // 封鎖攻擊來源 IP
  // ========================================
  BLOCK_MALICIOUS_IP: {
    id: 'BLOCK_MALICIOUS_IP',
    title: '封鎖攻擊來源 IP',
    category: 'IP Blocking',
    severity: 'critical',
    estimatedTime: '5-10 分鐘',
    prerequisites: [
      '需要具備 F5 BIG-IP Advanced WAF 管理員權限',
      '已登入 F5 BIG-IP 管理介面',
      '已從日誌中確認攻擊來源 IP',
      '確保該 IP 不是內部系統或合作夥伴 IP'
    ],
    steps: [
      {
        stepNumber: 1,
        title: '進入 Security Policy 設定',
        description: '導航到 IP Address Exceptions 頁面',
        actions: [
          '登入 F5 BIG-IP 管理介面',
          '前往 Security → Application Security → Security Policies',
          '選擇目標 Security Policy 並點擊進入'
        ],
        screenshot: null,
        notes: '確保選擇正確的 Policy，該 Policy 必須已套用到 Virtual Server'
      },
      {
        stepNumber: 2,
        title: '新增 IP 位址例外',
        description: '將攻擊來源 IP 加入黑名單',
        actions: [
          '在 Policy 頁面中，點選左側選單的「IP Address Exceptions」',
          '點擊右上角的「Create」按鈕',
          '在「IP Address」欄位輸入要封鎖的 IP（例如：104.28.217.137）',
          '在「IP Mask」欄位輸入子網路遮罩（單一 IP 使用 255.255.255.255）',
          '在「Block Requests」下拉選單中選擇「Always Block」',
          '可選：勾選「Ignore Anomalies」（忽略此 IP 的異常檢測）',
          '點擊「Create」按鈕'
        ],
        screenshot: null,
        notes: '也可以封鎖整個 IP 段（例如：104.28.217.0/24），使用適當的子網路遮罩'
      },
      {
        stepNumber: 3,
        title: '確認違規類型已啟用',
        description: '確保 VIOL_BLACKLISTED_IP 違規已啟用並設定為阻擋',
        actions: [
          '在 Policy 頁面中，點選「Violations」',
          '找到「VIOL_BLACKLISTED_IP」違規項目',
          '確認「Enabled」已勾選',
          '確認「Block」已勾選',
          '確認「Alarm」已勾選（啟用告警通知）',
          '點擊「Save」儲存設定'
        ],
        screenshot: null,
        notes: '如果違規未啟用，即使 IP 在黑名單中，請求也不會被阻擋'
      },
      {
        stepNumber: 4,
        title: '套用 Policy 變更',
        description: '將設定變更套用到運行中的 Policy',
        actions: [
          '點擊頁面右上角的「Apply Policy」按鈕',
          '確認變更內容無誤',
          '點擊「Apply」確認',
          '等待系統套用完成（通常 5-15 秒）',
          '確認頁面顯示「Policy applied successfully」訊息'
        ],
        screenshot: null,
        notes: '套用變更不會中斷現有連線，但建議在低流量時段進行'
      },
      {
        stepNumber: 5,
        title: '驗證封鎖效果',
        description: '測試 IP 是否已被成功封鎖',
        actions: [
          '從被封鎖的 IP（或使用 VPN/Proxy 模擬該 IP）嘗試訪問受保護的網站',
          '確認請求被阻擋並返回 Blocking Page',
          '前往 Security → Event Logs → Application → Requests',
          '篩選 Request Status = Blocked',
          '確認日誌中顯示「VIOL_BLACKLISTED_IP」違規',
          '檢查 Support ID 以追蹤特定請求'
        ],
        screenshot: null,
        notes: '如果測試請求未被阻擋，檢查 Virtual Server 是否正確套用該 Security Policy'
      },
      {
        stepNumber: 6,
        title: '（選用）批量封鎖 IP 清單',
        description: '如果需要封鎖多個 IP，可以使用批量匯入',
        actions: [
          '準備 IP 清單檔案（CSV 或 JSON 格式）',
          '前往 Security → Application Security → IP Address Exceptions',
          '點擊「Import」按鈕',
          '選擇檔案並上傳',
          '確認匯入的 IP 清單',
          '套用 Policy'
        ],
        screenshot: null,
        notes: '批量匯入適合需要封鎖大量 IP 的情況，例如來自特定 ASN 的攻擊'
      }
    ],
    references: [
      {
        title: 'F5 IP Address Exceptions 官方文件',
        url: 'https://support.f5.com/csp/knowledge-center',
        type: 'official'
      },
      {
        title: 'F5 Schema - whitelist-ips 說明',
        url: '/backend/docs/f5/v17.1/schema-description.md#whitelist-ips',
        type: 'internal'
      },
      {
        title: 'VIOL_BLACKLISTED_IP 違規說明',
        url: '/backend/docs/f5/v17.1/violations-description.md#viol_blacklisted_ip',
        type: 'internal'
      }
    ],
    relatedViolations: ['VIOL_BLACKLISTED_IP', 'VIOL_MALICIOUS_IP'],
    troubleshooting: [
      {
        issue: 'IP 已加入黑名單但仍可訪問',
        solution: '1. 檢查 Virtual Server 是否正確套用該 Security Policy。2. 確認 VIOL_BLACKLISTED_IP 違規已啟用並設定為 Block。3. 檢查是否有其他 Never Block 規則覆蓋了黑名單設定。4. 確認 IP 位址和子網路遮罩是否正確。'
      },
      {
        issue: '誤封內部系統 IP',
        solution: '立即前往 IP Address Exceptions，找到該 IP 並將 Block Requests 改為「Never Block」或直接刪除該 IP Exception。套用 Policy 後，內部系統應立即恢復訪問。'
      },
      {
        issue: '封鎖後攻擊者更換 IP 繼續攻擊',
        solution: '考慮使用以下進階防護：1. 封鎖整個 IP 段（/24 或 /16）。2. 啟用 IP Intelligence 功能自動封鎖已知惡意 IP。3. 啟用 Behavioral DoS 功能偵測異常流量模式。4. 啟用 Bot Defense 功能識別自動化攻擊工具。'
      },
      {
        issue: 'IP 黑名單太多影響效能',
        solution: 'F5 Advanced WAF 可以處理大量 IP 黑名單，但建議：1. 定期清理過期的封鎖 IP。2. 使用 IP Intelligence 取代手動黑名單。3. 考慮在上游防火牆層級封鎖（如 Firewall、IPS）。'
      }
    ]
  },

  // ========================================
  // 強化輸入驗證與參數檢查
  // ========================================
  PARAMETER_VALIDATION: {
    id: 'PARAMETER_VALIDATION',
    title: '強化輸入驗證與參數檢查',
    category: 'Input Validation',
    severity: 'high',
    estimatedTime: '15-25 分鐘',
    prerequisites: [
      '需要具備 F5 BIG-IP Advanced WAF 管理員權限',
      '已登入 F5 BIG-IP 管理介面',
      '了解應用程式的參數結構和資料類型',
      '建議先使用 Policy Builder 學習模式了解正常流量'
    ],
    steps: [
      {
        stepNumber: 1,
        title: '進入 Security Policy 設定',
        description: '開啟要設定的 Security Policy',
        actions: [
          '登入 F5 BIG-IP 管理介面',
          '前往 Security → Application Security → Security Policies',
          '選擇目標 Security Policy 並進入編輯頁面'
        ],
        screenshot: null,
        notes: '確保選擇正確的 Policy'
      },
      {
        stepNumber: 2,
        title: '識別需要驗證的參數',
        description: '從日誌或學習建議中識別關鍵參數',
        actions: [
          '前往「Parameters」頁面',
          '查看現有參數列表',
          '識別需要加強驗證的參數（如：id、user_id、email、amount 等）',
          '可從 Event Logs 中查看被攻擊的參數名稱'
        ],
        screenshot: null,
        notes: '優先保護與資料庫查詢、金額計算、檔案存取相關的參數'
      },
      {
        stepNumber: 3,
        title: '設定參數資料類型檢查',
        description: '為參數設定正確的資料類型',
        actions: [
          '在「Parameters」頁面中，選擇要設定的參數（或點擊「Create」新增）',
          '在「Data Type」下拉選單中選擇適當的類型：',
          '  - Integer：整數（如 id、count）',
          '  - Decimal：小數（如 price、amount）',
          '  - Email：電子郵件格式',
          '  - Phone：電話號碼格式',
          '  - Alpha-Numeric：字母數字（如 username）',
          '點擊「Update」或「Create」儲存'
        ],
        screenshot: null,
        notes: '正確的資料類型可以自動阻擋大部分注入攻擊'
      },
      {
        stepNumber: 4,
        title: '設定參數長度限制',
        description: '限制參數值的最大和最小長度',
        actions: [
          '在參數設定頁面中，找到「Value Length」區塊',
          '設定「Minimum Length」（最小長度）',
          '設定「Maximum Length」（最大長度，建議根據實際需求設定）',
          '勾選「Check」啟用長度檢查',
          '點擊「Update」儲存'
        ],
        screenshot: null,
        notes: '例如：username 通常 3-50 字元，email 通常 5-100 字元'
      },
      {
        stepNumber: 5,
        title: '設定參數正則表達式驗證（進階）',
        description: '使用正則表達式定義參數格式',
        actions: [
          '在參數設定頁面中，找到「Regular Expression」區塊',
          '輸入正則表達式（例如：^[a-zA-Z0-9_]+$ 只允許字母數字底線）',
          '勾選「Check」啟用正則表達式檢查',
          '點擊「Update」儲存'
        ],
        screenshot: null,
        notes: '正則表達式提供最精確的驗證，但需要謹慎設定避免誤報'
      },
      {
        stepNumber: 6,
        title: '設定參數數值範圍（適用於數字）',
        description: '限制數字參數的值範圍',
        actions: [
          '對於 Integer 或 Decimal 類型的參數',
          '在「Numeric Value」區塊',
          '設定「Minimum Value」（最小值）',
          '設定「Maximum Value」（最大值）',
          '勾選「Check」啟用數值檢查',
          '點擊「Update」儲存'
        ],
        screenshot: null,
        notes: '例如：年齡 0-150，商品數量 1-9999'
      },
      {
        stepNumber: 7,
        title: '限制參數元字符（Meta Characters）',
        description: '防止危險的特殊字符',
        actions: [
          '在參數設定頁面中，找到「Meta Characters」區塊',
          '勾選「Check Meta Characters」',
          '確保以下危險字符被限制或禁止：',
          '  - 單引號 (\')、雙引號 (")：SQL 注入',
          '  - 分號 (;)、管道 (|)、& 符號：命令注入',
          '  - 尖括號 (<>)：XSS 攻擊',
          '點擊「Update」儲存'
        ],
        screenshot: null,
        notes: '可以選擇「Allow」允許特定字符，或「Deny」拒絕所有未列出的字符'
      },
      {
        stepNumber: 8,
        title: '啟用參數驗證違規並設定阻擋',
        description: '確保違規類型已啟用',
        actions: [
          '前往「Violations」頁面',
          '確認以下違規已啟用且設定為「Block」：',
          '  - VIOL_PARAMETER_DATA_TYPE',
          '  - VIOL_PARAMETER_VALUE_LENGTH',
          '  - VIOL_PARAMETER_VALUE_REGEXP',
          '  - VIOL_PARAMETER_NUMERIC_VALUE',
          '  - VIOL_PARAMETER_VALUE_METACHAR',
          '全部勾選「Enabled」、「Block」和「Alarm」',
          '點擊「Save」儲存'
        ],
        screenshot: null,
        notes: '這些違規對應前面設定的各項驗證規則'
      },
      {
        stepNumber: 9,
        title: '套用 Policy 並驗證',
        description: '套用設定並測試驗證效果',
        actions: [
          '點擊「Apply Policy」按鈕',
          '確認變更無誤後點擊「Apply」',
          '等待系統套用完成',
          '在測試環境測試各種參數輸入：',
          '  - 測試超長字串',
          '  - 測試錯誤的資料類型（如在數字欄位輸入文字）',
          '  - 測試 SQL 注入 payload（如 \' OR 1=1--）',
          '確認這些異常輸入被正確阻擋'
        ],
        screenshot: null,
        notes: '務必先在測試環境驗證，避免影響正常業務'
      },
      {
        stepNumber: 10,
        title: '使用學習模式優化（選用但建議）',
        description: '啟用學習模式自動調整參數設定',
        actions: [
          '前往「Policy Building」→「Learning and Blocking Settings」',
          '啟用「Parameters」學習',
          '設定學習模式為「Automatic」或「Manual」',
          '運行 1-2 週收集正常流量數據',
          '審查學習建議並套用到 Policy',
          '逐步調整參數驗證規則'
        ],
        screenshot: null,
        notes: '學習模式可以大幅減少誤報，建議在正式環境使用'
      }
    ],
    references: [
      {
        title: 'F5 Parameter Protection 官方文件',
        url: 'https://support.f5.com/csp/knowledge-center',
        type: 'official'
      },
      {
        title: 'F5 Schema - Parameters 說明',
        url: '/backend/docs/f5/v17.1/schema-description.md#parameters',
        type: 'internal'
      },
      {
        title: 'F5 參數驗證違規說明',
        url: '/backend/docs/f5/v17.1/violations-description.md',
        type: 'internal'
      }
    ],
    relatedViolations: [
      'VIOL_PARAMETER',
      'VIOL_PARAMETER_DATA_TYPE',
      'VIOL_PARAMETER_VALUE_LENGTH',
      'VIOL_PARAMETER_VALUE_REGEXP',
      'VIOL_PARAMETER_NUMERIC_VALUE',
      'VIOL_PARAMETER_VALUE_METACHAR',
      'VIOL_PARAMETER_STATIC_VALUE',
      'VIOL_PARAMETER_EMPTY_VALUE',
      'VIOL_PARAMETER_NAME_METACHAR'
    ],
    troubleshooting: [
      {
        issue: '正常流量被誤判為違規',
        solution: '1. 檢查參數驗證規則是否過於嚴格。2. 使用學習模式（Learning Mode）收集正常流量數據。3. 調整參數的資料類型、長度限制或正則表達式。4. 針對特定 URL 或參數停用某些檢查。'
      },
      {
        issue: '不確定應該設定什麼樣的驗證規則',
        solution: '1. 先啟用學習模式運行 1-2 週。2. 分析日誌中的參數值分布。3. 參考應用程式的 API 文件或程式碼。4. 從寬鬆的規則開始，逐步加嚴。5. 優先保護敏感參數（如 id、user_id、amount）。'
      },
      {
        issue: '設定後攻擊仍然成功',
        solution: '1. 檢查違規類型是否已啟用且設定為「Block」。2. 確認 Virtual Server 是否正確套用該 Policy。3. 檢查是否有其他 Bypass 規則。4. 考慮同時啟用攻擊簽章（Attack Signatures）。5. 調低 violation_rating 閾值。'
      },
      {
        issue: '參數太多，逐一設定太耗時',
        solution: '1. 先設定全域參數（*）的基本驗證規則。2. 只針對關鍵參數（如 SQL 查詢、檔案路徑）設定嚴格規則。3. 使用學習模式自動生成參數配置。4. 考慮使用 JSON Schema 或 OpenAPI 規範自動匯入參數定義。'
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
    'SQL': 'SQL_INJECTION_PROTECTION',
    'sql': 'SQL_INJECTION_PROTECTION',
    'SQL 注入': 'SQL_INJECTION_PROTECTION',
    'SQL注入': 'SQL_INJECTION_PROTECTION',
    'SQLi': 'SQL_INJECTION_PROTECTION',
    '啟用 SQL 注入防護簽章': 'SQL_INJECTION_PROTECTION',
    'Signature Set 200010000': 'SQL_INJECTION_PROTECTION',
    
    'XSS': 'XSS_PROTECTION',
    'xss': 'XSS_PROTECTION',
    '跨站腳本': 'XSS_PROTECTION',
    '跨站': 'XSS_PROTECTION',
    'Cross-Site Scripting': 'XSS_PROTECTION',
    '啟用 XSS 防護': 'XSS_PROTECTION',
    'Signature Set 200003000': 'XSS_PROTECTION',
    
    '速率限制': 'RATE_LIMITING',
    'Rate Limit': 'RATE_LIMITING',
    'DoS': 'RATE_LIMITING',
    'DDoS': 'RATE_LIMITING',
    'TPS': 'RATE_LIMITING',
    '設定速率限制': 'RATE_LIMITING',
    
    '命令注入': 'COMMAND_INJECTION_PROTECTION',
    'Command Injection': 'COMMAND_INJECTION_PROTECTION',
    '命令執行': 'COMMAND_INJECTION_PROTECTION',
    'Command Execution': 'COMMAND_INJECTION_PROTECTION',
    'RCE': 'COMMAND_INJECTION_PROTECTION',
    
    'violation_rating': 'ADJUST_VIOLATION_RATING',
    'violation rating': 'ADJUST_VIOLATION_RATING',
    '調整 violation_rating': 'ADJUST_VIOLATION_RATING',
    '調整閾值': 'ADJUST_VIOLATION_RATING',
    '閾值': 'ADJUST_VIOLATION_RATING',
    '評分': 'ADJUST_VIOLATION_RATING',
    'threshold': 'ADJUST_VIOLATION_RATING',
    
    '監控': 'MONITOR_ATTACK_SOURCES',
    '攻擊來源': 'MONITOR_ATTACK_SOURCES',
    '目標 URL': 'MONITOR_ATTACK_SOURCES',
    '來源和目標': 'MONITOR_ATTACK_SOURCES',
    '監控攻擊': 'MONITOR_ATTACK_SOURCES',
    'monitor': 'MONITOR_ATTACK_SOURCES',
    'Event Logs': 'MONITOR_ATTACK_SOURCES',
    'Reporting': 'MONITOR_ATTACK_SOURCES',
    
    // 新增：IP 封鎖相關
    '封鎖來源 IP': 'BLOCK_MALICIOUS_IP',
    '封鎖來源': 'BLOCK_MALICIOUS_IP',
    '封鎖 IP': 'BLOCK_MALICIOUS_IP',
    'IP 黑名單': 'BLOCK_MALICIOUS_IP',
    'IP Blacklist': 'BLOCK_MALICIOUS_IP',
    '阻止進一步': 'BLOCK_MALICIOUS_IP',
    '黑名單': 'BLOCK_MALICIOUS_IP',
    'Block IP': 'BLOCK_MALICIOUS_IP',
    '防火牆封鎖': 'BLOCK_MALICIOUS_IP',
    
    // 新增：參數驗證相關
    '強化輸入驗證': 'PARAMETER_VALIDATION',
    '輸入驗證': 'PARAMETER_VALIDATION',
    '參數驗證': 'PARAMETER_VALIDATION',
    '參數檢查': 'PARAMETER_VALIDATION',
    'Input Validation': 'PARAMETER_VALIDATION',
    'Parameter Validation': 'PARAMETER_VALIDATION',
    '參數化查詢': 'PARAMETER_VALIDATION',
    '白名單檢查': 'PARAMETER_VALIDATION',
    '資料類型檢查': 'PARAMETER_VALIDATION',
    '長度限制': 'PARAMETER_VALIDATION',
    '正則表達式': 'PARAMETER_VALIDATION'
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
      'SQL_INJECTION': 'SQL_INJECTION_PROTECTION',
      'INJECTION_ATTACKS': 'SQL_INJECTION_PROTECTION',
      'XSS': 'XSS_PROTECTION',
      'CROSS_SITE_SCRIPTING': 'XSS_PROTECTION',
      'RATE_LIMIT': 'RATE_LIMITING',
      'DOS_PROTECTION': 'RATE_LIMITING',
      'COMMAND_INJECTION': 'COMMAND_INJECTION_PROTECTION',
      'COMMAND_EXECUTION': 'COMMAND_INJECTION_PROTECTION'
    };
    
    const upperCategory = category.toUpperCase();
    if (categoryMappings[upperCategory]) {
      return categoryMappings[upperCategory];
    }
  }
  
  return null;
}

module.exports = {
  F5_OPERATION_GUIDES,
  mapRecommendationToGuideId
};

