# F5 AI 分析誤判修復報告

## 問題描述

在遠端伺服器上運行 F5 AI 分析（6小時數據）時，發現以下誤判問題：

### 實際 ELK 原始數據
```json
{
  "request_status": "passed",      // ✓ 請求通過（不是 blocked）
  "violation_rating": "0",         // ✓ 無違規評分
  "severity": "Informational",     // ✓ 資訊等級（不是攻擊）
  "sig_ids": "N/A",                // ✓ 無簽章觸發
  "sig_names": "N/A",              // ✓ 無簽章名稱
  "attack_type": "A05:2025 Security Misconfiguration",  // ⚠️ OWASP 分類標籤
  "ThreatLevel": "Info",           // ✓ 資訊等級
  "response_code": 401             // ✓ HTTP 401 (認證失敗，正常業務邏輯)
}
```

### AI 錯誤報告內容
- ❌ 說 `request_status = 'blocked'` （實際是 `passed`）
- ❌ 說 `violation_rating ≥ 70` （實際是 `0`）
- ❌ 說觸發 sig_ids 5001、5002 （實際是 `N/A`）
- ❌ 對應到 "OWASP A6：安全配置錯誤" （實際是 `A05:2025`）
- ❌ 判定為「其他安全威脅」高風險攻擊

## 根本原因分析

### 問題 1: OWASP 分類標籤被誤判為攻擊類型

**位置**: `backend/config/products/f5/f5Standards.js` 的 `isRealSecurityThreat` 函數 Level 3 (line 707-729)

**原始邏輯**:
```javascript
// 3.1 有明確的攻擊類型
if (log.attack_type && log.attack_type !== 'N/A' && log.attack_type !== '') {
  const attackInfo = F5_ATTACK_TYPE_MAPPING[log.attack_type];
  if (attackInfo) {
    return { isAttack: true, ... };
  }
  // ⚠️ 問題：即使不在對應表中，有 attack_type 也視為攻擊
  return {
    isAttack: true,
    confidence: 'medium',
    reason: `偵測到攻擊類型（未分類）: ${log.attack_type}`,
    ...
  };
}
```

**問題分析**:
- `attack_type: "A05:2025 Security Misconfiguration"` 是 Logstash 自動添加的 OWASP 分類標籤
- 不是 F5 WAF 檢測到的真實攻擊行為
- 但舊邏輯會將任何非空的 `attack_type` 判定為攻擊

### 問題 2: 缺少 request_status 的最終檢查

**原始邏輯**:
- Level 1 檢查 `request_status === 'blocked'` → 確定攻擊 ✓
- 但沒有在最終判定時排除 `request_status === 'passed'` 的情況

**問題分析**:
- 當 `request_status === 'passed'` 時，表示請求通過了 WAF 檢查
- 如果同時 `violation_rating = 0` 且沒有其他強信號，應該判定為正常流量

## 修復方案

### 修復 1: 過濾 OWASP 分類標籤

**檔案**: `backend/config/products/f5/f5Standards.js`

**修改內容**:
```javascript
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
      return { isAttack: true, ... };
    }
    return { isAttack: true, ... };
  }
}
```

**效果**:
- 正則表達式 `/^A\d+:\d{4}\s+/` 匹配格式如 "A05:2025 ", "A06:2021 " 等
- OWASP 分類標籤不再被誤判為攻擊類型
- 只有真實的 F5 WAF 攻擊類型（如 "SQL Injection", "XSS" 等）才會觸發

### 修復 2: 添加最終安全檢查

**檔案**: `backend/config/products/f5/f5Standards.js`

**修改內容**:
```javascript
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
```

**效果**:
- 當 `request_status === 'passed'` 時，檢查是否有足夠的攻擊證據
- `violationRating < 30` (LOW) 且 `weakSignals < 2`，判定為正常流量
- 避免將正常業務請求（如 401 認證失敗）誤判為攻擊

## 測試建議

### 1. 重新啟動後端服務

```bash
cd /Users/peter/Across-AI/backend
node index.js
```

### 2. 測試 6 小時 AI 分析

在前端執行相同的 6 小時查詢，觀察是否還會出現「其他安全威脅」的誤判。

### 3. 預期結果

**修復前**:
- 顯示「其他安全威脅」2 次攻擊
- AI 報告錯誤的 violation_rating、sig_ids、request_status

**修復後**:
- 不應顯示「其他安全威脅」（因為這些是正常流量）
- `realAttacks` 計數應該更準確
- 只有真實的攻擊行為（blocked、有簽章、高 violation_rating）才會被報告

### 4. 驗證日誌

查看後端控制台輸出，應該會看到：

```
⚠️ 跳過 OWASP 分類標籤: A05:2025 Security Misconfiguration
✅ 成功解析 XX 筆日誌
   檢測到 X 個真實攻擊（共 XX 筆日誌）
```

## 影響範圍

### 修改檔案
- ✅ `backend/config/products/f5/f5Standards.js` (2 處修改)

### 不受影響的功能
- ✓ Cloudflare WAF 分析
- ✓ 其他 F5 攻擊類型判斷（SQL 注入、XSS 等）
- ✓ Level 1/2/4 判斷邏輯
- ✓ 前端顯示

### 受益的功能
- ✅ F5 WAF AI 分析準確性提升
- ✅ 減少誤判（false positive）
- ✅ 更準確的攻擊統計數字

## 預防未來類似問題

### 1. 建立日誌欄位白名單

建議在 `f5FieldMapping.js` 中明確標記哪些欄位是「分類標籤」，哪些是「攻擊行為」：

```javascript
attack_type: {
  elk_field: "attack_type",
  data_type: "keyword",
  description: "攻擊型態或 OWASP 分類標籤",
  ai_context: "可能是 F5 檢測的攻擊類型，或 Logstash 添加的 OWASP 標籤",
  // 新增分類
  is_classification_label: true,  // 可能是標籤
  requires_validation: true        // 需要額外驗證
}
```

### 2. 強化多層次判斷模型

確保 Level 1-4 的判斷邏輯遵循以下原則：

- **Level 1 (確定性指標)**: 只依賴最可靠的欄位（blocked, sig_ids, ThreatLevel=High）
- **Level 2 (綜合評分)**: violation_rating >= 50
- **Level 3 (攻擊類型匹配)**: 過濾分類標籤，只識別真實攻擊類型
- **Level 4 (行為模式)**: 至少 2 個弱信號組合

### 3. 定期審查測試數據

建議定期使用實際 ELK 數據測試 AI 分析邏輯，確保沒有誤判。

## 總結

本次修復解決了 F5 AI 分析中的核心誤判問題：

1. ✅ **過濾 OWASP 分類標籤**: 不再將 Logstash 自動添加的標籤誤判為攻擊
2. ✅ **強化最終檢查**: 確保 `request_status === 'passed'` 且無強信號時不誤判
3. ✅ **提升準確性**: 減少 false positive，提高 AI 分析的可信度

修復後，AI 分析將更準確地識別真實攻擊，不會將正常業務流量（如 401 認證失敗）誤判為安全威脅。

---

**修復日期**: 2025-11-24
**修復人員**: AI Assistant
**測試狀態**: ⏳ 待用戶驗證

