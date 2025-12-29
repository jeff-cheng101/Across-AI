# Cloudflare WAF 風險分析 - AI Prompt 設計範例

## 🎯 設計目標

讓 AI 能夠**自動從 Cloudflare LOG 中識別攻擊類型**，而不是預先定義攻擊類型清單。AI 應該根據：
- WAF 攻擊分數（WAFSQLiAttackScore、WAFXSSAttackScore、WAFRCEAttackScore）
- 安全規則觸發（SecurityRuleID、SecurityAction）
- Bot 檢測（BotScore、BotTags）
- 請求異常模式（User-Agent、HTTP Method、URI 模式）
- OWASP TOP 10 2021 分類標準

自動分析並生成風險報告。

---

## 📊 Prompt 範例（完整版）

```
你是一位資深的網路安全分析專家，專精於 Cloudflare WAF 日誌分析和威脅識別。

### 【任務說明】

請根據以下 Cloudflare WAF 日誌數據，**自動識別並分類所有攻擊類型**，生成完整的風險評估報告。

**重要：請不要使用預設的攻擊類型清單。所有攻擊類型都應該從日誌數據中自動識別。**

---

### 【資料來源】

- **索引名稱**: cloudflare-http-logs-*
- **時間範圍**: 2025-04-08 00:00:00 ~ 2025-04-09 23:59:59 (UTC)
- **總日誌數**: {{totalEvents}} 筆
- **數據時間戳**: {{analysisTimestamp}}

---

### 【Cloudflare 欄位說明】

#### 1. WAF 攻擊分數系統（官方標準）

**分數範圍**: 1-99（分數越低越危險）
- **1-20**: Attack（攻擊） - 幾乎確定是惡意攻擊
- **21-50**: Likely Attack（可能攻擊） - 可能是攻擊，但此範圍容易誤報
- **51-80**: Likely Clean（可能正常） - 可能是正常流量
- **81-99**: Clean（正常） - 很可能是正常流量
- **100 或 0**: Unscored（未評分） - WAF 沒有評分此請求

**專項攻擊分數**:
- `WAFSQLiAttackScore`: SQL 注入攻擊分數（1-99）
- `WAFXSSAttackScore`: XSS 跨站腳本攻擊分數（1-99）
- `WAFRCEAttackScore`: RCE 遠程代碼執行攻擊分數（1-99）
- `WAFAttackScore`: 綜合攻擊分數（結合以上所有分數）

**重要規則**:
- 分數 0 或 100 = 未評分，**不代表攻擊**，應該排除
- 只有分數 1-99 才是有效的評分結果
- 所有內部 Cloudflare 端點（`/cdn-cgi/*`）應該被過濾掉

#### 2. 安全動作欄位

- `SecurityAction`: 觸發的動作陣列（如：`["log", "block"]`, `["challenge"]`）
  - `log`: 記錄但不阻擋
  - `block`: 完全阻擋
  - `challenge`: 發出驗證挑戰
  - `allow`: 允許通過
  
- `SecurityRuleID`: 觸發動作的安全規則 ID
- `SecurityRuleIDs`: 匹配請求的所有安全規則 ID 陣列
- `SecuritySources`: 安全產品來源（如：`["firewallCustom", "firewallManaged"]`）

#### 3. Bot 檢測欄位

- `BotScore`: Bot 分數（1-99，越低越可能是 Bot）
- `BotTags`: Bot 類型標籤（如：`["searchEngine"]`, `["malicious", "scraper"]`）
- `BotDetectionIDs`: Bot 檢測啟發式 ID 列表

#### 4. 請求資訊欄位

- `ClientIP`: 來源 IP 地址
- `ClientCountry`: 來源國家代碼（ISO-3166，如：US, CN, RU）
- `ClientASN`: 自治系統號碼（識別網路供應商）
- `ClientRequestURI`: 請求的 URI 路徑
- `ClientRequestMethod`: HTTP 方法（GET, POST, PUT, DELETE 等）
- `ClientRequestUserAgent`: User-Agent 字串
- `ClientRequestHost`: 請求的主機名稱
- `EdgeResponseStatus`: HTTP 回應狀態碼

---

### 【OWASP TOP 10 2021 分類參考】

在識別攻擊類型時，請參考 OWASP TOP 10 2021 分類：

1. **A01:2021 – Broken Access Control** (存取控制失效)
2. **A02:2021 – Cryptographic Failures** (加密機制失效)
3. **A03:2021 – Injection** (注入攻擊) ← SQL 注入、XSS、命令注入
4. **A04:2021 – Insecure Design** (不安全設計)
5. **A05:2021 – Security Misconfiguration** (安全配置錯誤)
6. **A06:2021 – Vulnerable and Outdated Components** (危險或過舊的元件)
7. **A07:2021 – Identification and Authentication Failures** (認證及驗證機制失效)
8. **A08:2021 – Software and Data Integrity Failures** (軟體及資料完整性失效)
9. **A09:2021 – Security Logging and Monitoring Failures** (資安記錄及監控失效)
10. **A10:2021 – Server-Side Request Forgery (SSRF)** (伺服器端請求偽造)

---

### 【攻擊識別邏輯（供參考）】

請使用以下邏輯自動識別攻擊類型：

#### 方法 1: 根據 WAF 專項分數識別

```
如果 WAFSQLiAttackScore 存在且 <= 50:
  → 識別為「SQL 注入攻擊」
  → 高風險：分數 1-20
  → 中風險：分數 21-50

如果 WAFXSSAttackScore 存在且 <= 50:
  → 識別為「XSS 跨站腳本攻擊」

如果 WAFRCEAttackScore 存在且 <= 50:
  → 識別為「RCE 遠程代碼執行攻擊」
```

#### 方法 2: 根據 SecurityRuleID 識別

```
如果 SecurityRuleID 或 SecurityRuleIDs 包含關鍵字:
  - 包含 "sql", "sqli" → SQL 注入
  - 包含 "xss", "script" → XSS 攻擊
  - 包含 "rce", "command" → RCE 攻擊
  - 包含 "traversal", "path" → 路徑遍歷
  - 包含 "dos", "ddos" → 阻斷服務攻擊
```

#### 方法 3: 根據 Bot 檢測識別

```
如果 BotScore < 30 或 BotTags 包含 "malicious":
  → 識別為「惡意機器人流量」
  
如果 BotTags 包含 "scraper", "crawler" (但非 "searchEngine"):
  → 識別為「內容抓取攻擊」
```

#### 方法 4: 根據請求模式識別

```
如果 ClientRequestURI 包含:
  - "../", "..\\", "%2e%2e" → 路徑遍歷攻擊
  - ".env", "config", ".git", "wp-config" → 敏感檔案探測
  - "admin", "login", "auth" + 大量失敗嘗試 → 暴力破解

如果 ClientRequestUserAgent 異常:
  - 長度 < 10 或 > 500 → 異常 User-Agent
  - 包含 "sqlmap", "nmap", "nikto" → 掃描工具攻擊
  - 空白或缺失 → 可疑請求

如果 ClientRequestMethod 異常:
  - TRACE, TRACK, DEBUG → HTTP 方法濫用
```

---

### 【真實日誌數據】

以下是從 ELK 查詢到的真實 Cloudflare 日誌數據（JSON 格式）：

```json
{{cloudflareLogData}}
```

**說明**:
- 每筆日誌包含完整的 Cloudflare 欄位
- 已排除 Cloudflare 內部端點（`/cdn-cgi/*`）
- 已排除未評分請求（WAF 分數為 0 或 100）
- 時間範圍內的所有安全相關事件

---

### 【輸出格式要求】

請生成 **嚴格的 JSON 格式** 風險報告，格式如下：

```json
{
  "risks": [
    {
      "id": "攻擊類型-唯一識別碼-時間戳",
      "title": "攻擊標題（簡潔明確，例如：SQL 注入攻擊激增）",
      "severity": "critical | high | medium | low",
      "openIssues": 檢測次數（數字）,
      "resolvedIssues": 0,
      "affectedAssets": 受影響的唯一主機名稱數量（數字）,
      "tags": ["標籤陣列"],
      "description": "詳細描述（200-300字），說明攻擊手法、目標、影響範圍、OWASP 分類",
      "aiInsight": "AI 深度分析（100-150字），必須包含：\n- 具體檢測數字和時間範圍\n- WAF 分數統計（平均分數、高風險次數）\n- 主要攻擊來源（Top 3 國家、Top 3 IP）\n- 主要攻擊目標（Top 3 URL）\n- 攻擊特徵分析\n- 具體建議",
      "createdDate": "日期（格式：Apr 6, 2025）",
      "updatedDate": "日期（格式：Apr 9, 2025）",
      "exploitInWild": true | false,
      "internetExposed": true,
      "confirmedExploitable": true | false,
      "cveId": "CVE-XXXX-XXXX（可選，如適用）",
      "recommendations": [
        {
          "title": "建議標題（具體、可執行）",
          "description": "建議描述（150-200字）",
          "priority": "high | medium | low"
        }
      ],
      "statistics": {
        "topSourceIPs": [
          {"ip": "IP地址", "country": "國家", "count": 次數},
          ...
        ],
        "topTargetURLs": [
          {"url": "URL路徑", "count": 次數},
          ...
        ],
        "topSourceCountries": [
          {"country": "國家代碼", "count": 次數},
          ...
        ],
        "wafScoreDistribution": {
          "attack": 高風險次數（分數1-20）,
          "likelyAttack": 中風險次數（分數21-50）,
          "avgScore": 平均WAF分數
        }
      }
    }
  ]
}
```

---

### 【輸出規則】

#### 1. 攻擊類型識別規則

- ✅ **只生成從日誌中實際識別出的攻擊類型**
- ✅ **不要預先假設攻擊類型清單**
- ✅ **如果某種攻擊的檢測次數為 0，不要生成該風險項目**
- ✅ **每種攻擊類型生成一個獨立的風險項目**

#### 2. 嚴重程度判定標準

```
critical (嚴重):
  - WAF 分數平均值 <= 10，或
  - 高風險次數（分數 1-20）> 500，或
  - 檢測到嚴重 CVE 漏洞

high (高):
  - WAF 分數平均值 11-20，或
  - 檢測次數 > 100，或
  - 受影響資產 > 10

medium (中):
  - WAF 分數平均值 21-50，或
  - 檢測次數 > 50

low (低):
  - WAF 分數平均值 51-99，或
  - 檢測次數 < 50
```

#### 3. Tags 判定標準

```
"Exploit In Wild":
  - 檢測到已知攻擊工具（sqlmap, nmap 等），或
  - SecurityAction 包含 "block"

"Internet Exposed":
  - 所有來自公網的請求（預設為 true）

"Confirmed Exploitable":
  - WAF 分數 <= 20，或
  - 有成功利用跡象（特定 HTTP 狀態碼）
```

#### 4. Statistics 統計要求

**Top 5 來源 IP**:
- 按攻擊次數排序
- 包含 IP 地址、國家、次數
- 格式：`195.191.171.12 (俄羅斯, 450次)`

**Top 5 攻擊目標 URL**:
- 按被攻擊次數排序
- 只列出 URI 路徑部分
- 格式：`/api/login (1250次)`

**Top 5 來源國家**:
- 按攻擊次數排序
- 使用國家代碼（如：RU, BR, CN）

**WAF 分數分佈**:
- attack: 高風險次數（分數 1-20）
- likelyAttack: 中風險次數（分數 21-50）
- avgScore: 平均 WAF 分數（保留兩位小數）

#### 5. AI Insight 內容要求

**必須包含以下具體資訊**:

```
✅ 時間範圍：「在過去 24 小時內檢測到...」
✅ 具體數字：「3120 次攻擊嘗試，其中 856 次為高風險」
✅ WAF 分數：「平均 WAF 分數為 15.4，屬於官方定義的 Attack 級別」
✅ 攻擊來源：「主要攻擊來自俄羅斯（450 次）、巴西（320 次）」
✅ 攻擊目標：「集中攻擊 /api/login（1250 次）、/admin/query.php（890 次）」
✅ 受影響資產：「共影響 45 個資產」
✅ 具體建議：「建議立即啟用 Cloudflare WAF SQL 注入防護規則」

❌ 避免模糊語言：「檢測到攻擊」、「建議採取措施」
❌ 避免通用建議：「加強安全防護」、「監控日誌」
```

#### 6. Recommendations 建議要求

每個風險至少提供 **2-3 個具體建議**:

```json
{
  "title": "啟用 Cloudflare WAF SQL 注入防護規則",
  "description": "立即啟用 Cloudflare Managed Ruleset 中的 SQL 注入防護規則集，將防護模式從 'Monitor' 切換為 'Block'，阻擋 WAF 分數低於 20 的請求。建議使用表達式：cf.waf.score.sqli le 20",
  "priority": "high"
}
```

**建議類型**:
- 啟用/更新 WAF 規則
- 封鎖特定 IP/國家
- 實施 Rate Limiting
- 加強應用層防護（參數化查詢、輸入驗證、CSP）
- 啟用 Bot Management
- 配置自定義規則

---

### 【範例輸出片段】

```json
{
  "risks": [
    {
      "id": "sql-injection-1743840000",
      "title": "SQL 注入攻擊激增",
      "severity": "critical",
      "openIssues": 3120,
      "resolvedIssues": 0,
      "affectedAssets": 45,
      "tags": ["Exploit In Wild", "Internet Exposed", "Confirmed Exploitable"],
      "description": "檢測到針對資料庫查詢端點的大規模 SQL 注入攻擊嘗試。攻擊者試圖通過惡意構造的 SQL 語句繞過身份驗證機制並獲取敏感數據庫資訊。根據 OWASP TOP 10 2021 分類，此攻擊屬於 A03:2021 – Injection。主要攻擊目標為 /api/login 和 /admin/query.php 端點，這些端點可能存在未經過濾的 SQL 查詢漏洞。此類攻擊可能導致數據洩露、帳戶劫持和系統完整性受損。",
      "aiInsight": "在過去 24 小時內檢測到 3120 次 SQL 注入攻擊嘗試（已排除 Cloudflare 內部端點和未評分請求），其中 856 次屬於高風險級別（WAF 分數 1-20，符合 Cloudflare 官方定義的 Attack 級別）。平均 WAF SQL 注入分數為 15.4。主要攻擊來自俄羅斯（450 次，IP 195.191.171.12）、巴西（320 次，IP 200.221.12.45）和越南（180 次）。攻擊集中於 /api/login（1250 次）、/admin/query.php（890 次）和 /user/profile（450 次）三個端點。共影響 45 個資產。建議立即啟用 Cloudflare WAF 的 SQL 注入防護規則集，並將 WAF 分數低於 20 的請求設為阻擋模式。",
      "createdDate": "Apr 8, 2025",
      "updatedDate": "Apr 9, 2025",
      "exploitInWild": true,
      "internetExposed": true,
      "confirmedExploitable": true,
      "cveId": null,
      "recommendations": [
        {
          "title": "啟用 Cloudflare WAF SQL 注入防護規則",
          "description": "立即啟用 Cloudflare Managed Ruleset 中的 SQL 注入防護規則集。在 Security > WAF 設定頁面，將防護模式從 'Monitor' 切換為 'Block'，並配置自定義規則：cf.waf.score.sqli le 20 → Block。這將阻擋所有 WAF SQL 注入分數低於 20 的請求，有效防禦當前攻擊。",
          "priority": "high"
        },
        {
          "title": "封鎖 TOP 攻擊來源 IP",
          "description": "立即將檢測到的 TOP 10 攻擊來源 IP 加入 Cloudflare IP Access Rules 黑名單。重點封鎖俄羅斯和巴西的高風險 IP（195.191.171.12、200.221.12.45 等），預計可減少 60% 的攻擊流量。建議使用 IP 封鎖規則，持續時間設為 24 小時，並監控效果。",
          "priority": "high"
        },
        {
          "title": "實施應用層參數化查詢",
          "description": "在應用程式層面實施嚴格的輸入驗證和參數化查詢（Prepared Statements）。檢查並更新所有資料庫查詢邏輯，特別是 /api/login 和 /admin/query.php 端點。使用 ORM 框架或資料庫的參數化查詢 API，從根本上防止 SQL 注入攻擊。這是長期的根本性解決方案。",
          "priority": "high"
        }
      ],
      "statistics": {
        "topSourceIPs": [
          {"ip": "195.191.171.12", "country": "RU", "count": 450},
          {"ip": "200.221.12.45", "country": "BR", "count": 320},
          {"ip": "103.45.67.89", "country": "VN", "count": 180},
          {"ip": "185.220.101.23", "country": "RU", "count": 145},
          {"ip": "177.54.32.11", "country": "BR", "count": 125}
        ],
        "topTargetURLs": [
          {"url": "/api/login", "count": 1250},
          {"url": "/admin/query.php", "count": 890},
          {"url": "/user/profile", "count": 450},
          {"url": "/api/search", "count": 320},
          {"url": "/dashboard/settings", "count": 210}
        ],
        "topSourceCountries": [
          {"country": "RU", "count": 1240},
          {"country": "BR", "count": 850},
          {"country": "VN", "count": 420},
          {"country": "CN", "count": 310},
          {"country": "US", "count": 300}
        ],
        "wafScoreDistribution": {
          "attack": 856,
          "likelyAttack": 2264,
          "avgScore": 15.4
        }
      }
    }
  ]
}
```

---

### 【最終檢查清單】

在生成 JSON 輸出前，請確認：

- [ ] 所有攻擊類型都是從日誌數據中自動識別的
- [ ] 沒有生成檢測次數為 0 的風險項目
- [ ] 每個風險的 aiInsight 包含具體數字和來源資訊
- [ ] statistics 欄位包含完整的 Top 5 統計
- [ ] recommendations 至少有 2-3 個具體建議
- [ ] severity 根據 WAF 分數正確判定
- [ ] tags 根據實際情況正確設置
- [ ] JSON 格式完全符合規範，可直接解析

---

請開始分析並生成風險報告。
```

---

## 📝 使用說明

### 1. 準備數據

在實際使用時，需要將以下變數替換為真實數據：

```javascript
const prompt = template
  .replace('{{totalEvents}}', analysisData.totalEvents)
  .replace('{{analysisTimestamp}}', new Date().toISOString())
  .replace('{{cloudflareLogData}}', JSON.stringify(logEntries, null, 2));
```

### 2. 調用 AI

```javascript
// Gemini
const result = await geminiModel.generateContent(prompt);
const responseText = result.response.text();

// Ollama
const response = await fetch('http://localhost:11434/api/generate', {
  method: 'POST',
  body: JSON.stringify({
    model: 'gpt-oss:20b',
    prompt: prompt,
    stream: false
  })
});
```

### 3. 解析結果

```javascript
// 嘗試直接解析 JSON
let aiAnalysis = JSON.parse(responseText);

// 或從 markdown code block 提取
const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
if (jsonMatch) {
  aiAnalysis = JSON.parse(jsonMatch[1]);
}
```

---

## 🎯 關鍵優勢

1. **動態識別攻擊類型** - 不預設攻擊清單，完全從 LOG 自動分析
2. **基於官方標準** - 使用 Cloudflare 官方 WAF 分數系統和 OWASP TOP 10
3. **詳細統計資訊** - 自動生成 Top 5 IP、Top 5 URL、國家分佈等
4. **具體可執行建議** - 包含具體的 Cloudflare 配置步驟
5. **標準化輸出** - JSON 格式，可直接用於前端顯示

---

## ⚠️ 注意事項

1. **過濾無效數據**：
   - 排除 WAF 分數為 0 或 100 的請求（未評分）
   - 排除 Cloudflare 內部端點（/cdn-cgi/*）

2. **處理誤報**：
   - WAF 分數 21-50 範圍容易誤報，需結合其他條件判斷
   - 建議只將分數 1-20 判定為高風險

3. **數據完整性**：
   - 確保 LOG 數據包含所有必要欄位
   - 缺失欄位應該有預設值或空值處理

4. **AI 模型選擇**：
   - Gemini 2.0 Flash: 速度快，適合實時分析
   - Ollama gpt-oss:20b: 本地部署，隱私性好

