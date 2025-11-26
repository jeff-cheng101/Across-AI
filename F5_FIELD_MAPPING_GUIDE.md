# F5 Advanced WAF Field Mapping 欄位對應指南

## 📋 完整文件位置

**主要檔案**: `backend/config/products/f5/f5FieldMapping.js`  
**實際使用**: `backend/services/products/F5WAFRiskService.js` (parseF5Log 方法)

---

## 🔑 F5 關鍵欄位映射 (Mapping)

### 核心安全欄位

```
F5 ELK 欄位 → 程式邏輯欄位 → 說明
```

#### 1️⃣ **客戶端識別**
- `client_ip` → `log.clientIP` → 來源 IP 位址
- `x_forwarded_for_ip` → `log.x_forwarded_for_ip` → 真實 IP（經過代理）
- `client_port` → `log.clientPort` → 來源埠口
- `geoip.country_name` → `log.clientCountry` → 來源國家
- `geo_location` → `log.clientCountry` (fallback) → 國家代碼
- `user_agent` → `log.userAgent` → 瀏覽器/設備識別

#### 2️⃣ **威脅評分與狀態**（⭐ 最關鍵）
- `violation_rating` → `log.violationRating` → **違規評分 (0-100)**
- `severity` → `log.severity` → **嚴重等級** (Informational/Warning/Error/Critical)
- `ThreatLevel` → `log.ThreatLevel` → **威脅等級** (Info/Low/Medium/High)
- `request_status` → `log.request_status` → **處理狀態** (passed/blocked/alerted)

#### 3️⃣ **攻擊類型與簽章**
- `attack_type` → `log.attackType` → **攻擊類型** (SQL Injection/XSS/RCE 等)
- `violations` → `log.violations` → **違規類型** (VIOL_ATTACK_SIGNATURE 等)
- `sub_violations` → `log.sub_violations` → 子違規詳細類型
- `sig_ids` → `log.sigIds` → **攻擊簽章 ID** (200010136 等)
- `sig_names` → `log.sigNames` → 簽章名稱
- `sig_cves` → `log.sig_cves` → 關聯 CVE 編號
- `owasp` → `log.owasp` → OWASP 分類

#### 4️⃣ **請求資訊**
- `uri` → `log.uri` → **請求路徑/URL**
- `method` → `log.method` → HTTP 方法 (GET/POST/PUT 等)
- `protocol` → `log.protocol` → 協定 (HTTP/HTTPS)
- `query_string` → `log.queryString` → URL 查詢參數
- `fqdn` → `log.fqdn` → 完整網域名稱
- `host` → `log.host` → 主機名稱

#### 5️⃣ **回應與結果**
- `response_code` → `log.responseCode` → **HTTP 狀態碼** (0=被阻擋)
- `response` → `log.response` → 回應內容
- `request_status` → `log.request_status` → 請求處理結果

#### 6️⃣ **目的端資訊**
- `dst_ip` → `log.dst_ip` → 目標伺服器 IP
- `dst_port` → `log.dst_port` → 目標埠口

#### 7️⃣ **策略與政策**
- `policy_name` → `log.policyName` → **F5 WAF 政策名稱**
- `policy_apply_date` → `log.policyApplyDate` → 政策套用日期
- `web_application_name` → `log.webApplicationName` → Web 應用名稱

#### 8️⃣ **時間資訊**
- `@timestamp` → `log.timestamp` → **事件時間戳 (UTC)**
- `date_time` → `log.date_time` → 本地時間格式

#### 9️⃣ **追蹤與支援**
- `support_id` → `log.support_id` → F5 支援事件唯一識別碼
- `session_id` → `log.session_id` → 會話 ID

---

## 📊 與 Cloudflare 的對應關係

| Cloudflare | F5 Advanced WAF | 說明 |
|------------|-----------------|------|
| `ClientIP` | `client_ip` | 來源 IP |
| `ClientCountry` | `geoip.country_name` / `geo_location` | 來源國家 |
| `ClientRequestURI` | `uri` | 請求路徑 |
| `EdgeRequestHost` | `fqdn` / `host` | 目標主機 |
| `SecurityAction` | `request_status` | 處理動作 (blocked/passed) |
| `WAFAttackScore` | `violation_rating` | **威脅評分** (F5 使用 0-100) |
| `WAFSQLiAttackScore` | `violation_rating` + `attack_type="SQL Injection"` | SQL 注入評分 |
| `WAFXSSAttackScore` | `violation_rating` + `attack_type="XSS"` | XSS 評分 |
| `WAFRCEAttackScore` | `violation_rating` + `attack_type="Command Execution"` | RCE 評分 |
| *(無)* | `sig_ids` / `sig_names` | **F5 專屬：攻擊簽章** |
| *(無)* | `ThreatLevel` | **F5 專屬：威脅等級** |
| *(無)* | `violations` | **F5 專屬：違規類型** |

---

## 🎯 F5 多層次判斷模型使用的關鍵欄位

F5 的攻擊判定邏輯（定義在 `f5Standards.js` 的 `isRealSecurityThreat` 函數）使用以下欄位：

### Level 1 - 確定性指標（最高優先級）
```javascript
log.request_status === 'blocked'      // ✅ 已阻擋 → 確定攻擊
log.sig_ids !== 'N/A'                 // ✅ 有簽章 → 確定攻擊  
log.ThreatLevel === 'High'            // ✅ 高威脅 → 確定攻擊
log.violations (嚴重違規)              // ✅ 嚴重違規 → 確定攻擊
```

### Level 2 - 綜合評分
```javascript
log.violation_rating >= 70            // ✅ 高風險攻擊
log.violation_rating >= 50            // ⚠️ 中風險攻擊
```

### Level 3 - 攻擊類型匹配
```javascript
log.attack_type                       // ✅ 有明確攻擊類型
  (但排除 OWASP 分類標籤，如 "A05:2025 ...")
log.violations (注入攻擊類)            // ⚠️ 違規類型匹配
```

### Level 4 - 行為模式分析
```javascript
log.severity >= 'Error'               // 嚴重程度
+ log.violations                      // 違規組合
+ log.ThreatLevel === 'Medium'        // 中等威脅
```

---

## 🔍 實際使用範例

### 範例 1: 高風險 SQL 注入攻擊

```json
{
  "client_ip": "34.81.120.97",
  "uri": "/api/users?id=1' OR '1'='1",
  "request_status": "blocked",
  "violation_rating": "85",
  "severity": "Error",
  "ThreatLevel": "High",
  "attack_type": "SQL Injection",
  "sig_ids": "200010001",
  "sig_names": "SQL Injection Detected",
  "violations": "VIOL_ATTACK_SIGNATURE",
  "response_code": "0"
}
```

**判定結果**:
- ✅ Level 1: `request_status = blocked` → 確定攻擊
- ✅ Level 1: `sig_ids = 200010001` → 確定攻擊
- ✅ Level 2: `violation_rating = 85` (≥70) → 高風險
- ✅ Level 3: `attack_type = SQL Injection` → 高信心

### 範例 2: 正常流量（不是攻擊）

```json
{
  "client_ip": "64.98.202.2",
  "uri": "/ews/exchange.asmx",
  "request_status": "passed",
  "violation_rating": "0",
  "severity": "Informational",
  "ThreatLevel": "Info",
  "attack_type": "A05:2025 Security Misconfiguration",
  "sig_ids": "N/A",
  "sig_names": "N/A",
  "violations": "N/A",
  "response_code": "401"
}
```

**判定結果**:
- ❌ Level 1: `request_status = passed` → 不是攻擊
- ❌ Level 2: `violation_rating = 0` (< 30) → 無威脅
- ❌ Level 3: `attack_type` 是 OWASP 標籤（排除）→ 不判定
- ❌ 最終檢查: `passed` + 無強信號 → **正常流量**

---

## 🛠️ 程式碼中的實際使用

### 在 `F5WAFRiskService.js` 的 `parseF5Log` 方法中：

```javascript
return {
  // 客戶端識別
  clientIP: rawLog[this.fieldMapping.client_ip.elk_field],
  clientCountry: rawLog.geoip?.country_name || rawLog.geo_location,
  clientPort: rawLog[this.fieldMapping.client_port.elk_field],
  
  // 威脅評分（最關鍵）
  violationRating: rawLog[this.fieldMapping.violation_rating.elk_field],
  severity: rawLog[this.fieldMapping.severity.elk_field],
  ThreatLevel: rawLog[this.fieldMapping.ThreatLevel.elk_field],
  request_status: rawLog[this.fieldMapping.request_status.elk_field],
  
  // 攻擊識別
  attackType: rawLog[this.fieldMapping.attack_type.elk_field],
  violations: rawLog[this.fieldMapping.violations.elk_field],
  sigIds: rawLog[this.fieldMapping.sig_ids.elk_field],
  sigNames: rawLog[this.fieldMapping.sig_names.elk_field],
  
  // 請求資訊
  uri: rawLog[this.fieldMapping.uri.elk_field],
  method: rawLog[this.fieldMapping.method.elk_field],
  protocol: rawLog[this.fieldMapping.protocol.elk_field],
  
  // 回應資訊
  responseCode: rawLog[this.fieldMapping.response_code.elk_field],
  
  // 時間資訊
  timestamp: rawLog[this.fieldMapping.timestamp.elk_field]
};
```

---

## 📁 相關檔案結構

```
backend/
├── config/
│   └── products/
│       └── f5/
│           ├── f5FieldMapping.js        ← 欄位定義（556 行）
│           ├── f5Standards.js           ← 判斷邏輯（1148 行）
│           ├── f5ELKConfig.js           ← ELK 配置
│           └── f5OperationGuides.js     ← 操作指引
├── services/
│   └── products/
│       └── F5WAFRiskService.js          ← 主要服務（995 行）
└── routes/
    └── f5.routes.js                     ← API 路由
```

---

## ⚠️ 重要注意事項

### 1. **OWASP 分類標籤 vs 真實攻擊類型**

**OWASP 標籤**（不是攻擊行為）:
- `A01:2021 - Broken Access Control`
- `A03:2021 - Injection`
- `A05:2025 Security Misconfiguration` ⚠️ **修復重點**

**真實攻擊類型**（是攻擊行為）:
- `SQL Injection`
- `Cross Site Scripting (XSS)`
- `Command Execution`
- `Path Traversal`
- `Predictable Resource Location`

### 2. **violation_rating 評分系統**

```
F5 violation_rating 閾值:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
0-29    → INFO (資訊性)
30-49   → LOW (低風險)
50-69   → MEDIUM (中風險)
70-89   → HIGH (高風險)
90-100  → CRITICAL (嚴重威脅)
```

### 3. **request_status 處理狀態**

```
blocked  → 已阻擋（確定攻擊）✅
alerted  → 已警示（可能攻擊）⚠️
passed   → 已通過（正常流量）✓
logged   → 僅記錄（低風險）ℹ️
```

### 4. **國家資訊提取邏輯**（多層 fallback）

```
優先順序:
1. geoip.country_name     (最優先)
2. geoip.country_code2    (次要)
3. geo_location           (fallback)
4. geoip.* (任何包含 country 的欄位)
5. 'Unknown'              (最終 fallback)
```

---

## 🔄 與 Cloudflare 的主要差異

| 特性 | Cloudflare | F5 Advanced WAF |
|------|------------|-----------------|
| **威脅評分** | 0-100 (數字越低越危險) | 0-100 (數字越高越危險) |
| **攻擊簽章** | ❌ 無 | ✅ 有 (sig_ids, sig_names) |
| **違規類型** | ❌ 無 | ✅ 有 (violations, sub_violations) |
| **處理狀態** | allow/block/challenge | passed/blocked/alerted/logged |
| **細分評分** | SQLi/XSS/RCE 各自評分 | 統一 violation_rating |
| **威脅等級** | ❌ 無 | ✅ 有 (ThreatLevel: Info/Low/Medium/High) |

---

## 💡 快速參考

### 如果您想要：

1. **找到攻擊來源** → 使用 `client_ip` + `geoip.country_name`
2. **判斷攻擊嚴重性** → 使用 `violation_rating` + `ThreatLevel` + `severity`
3. **識別攻擊類型** → 使用 `attack_type` + `sig_ids` + `violations`
4. **確認是否阻擋** → 使用 `request_status` + `response_code`
5. **追蹤攻擊目標** → 使用 `uri` + `fqdn` + `dst_ip`
6. **關聯漏洞資訊** → 使用 `sig_cves`
7. **聯繫 F5 支援** → 使用 `support_id`

---

**文件版本**: v1.0  
**最後更新**: 2025-11-24  
**適用產品**: F5 Advanced WAF / BIG-IP ASM  
**相關文件**: `F5_AI_ANALYSIS_FALSE_POSITIVE_FIX.md`


