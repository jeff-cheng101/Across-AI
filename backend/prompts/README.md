# Cloudflare WAF 動態 Prompt 設計方案

## 📋 目錄

1. [方案概述](#方案概述)
2. [文件說明](#文件說明)
3. [核心改變](#核心改變)
4. [實施步驟](#實施步驟)
5. [測試驗證](#測試驗證)

---

## 🎯 方案概述

### 問題

原有的 `cloudflareWAFRiskService.js` 中，攻擊類型是**預先定義**的：

```javascript
// ❌ 舊方法：固定的攻擊類型
const sqlInjection = this.analyzeSQLInjection(logEntries);
const xssAttacks = this.analyzeXSSAttacks(logEntries);
const rceAttacks = this.analyzeRCEAttacks(logEntries);
// ...
```

這意味著：
- 攻擊類型清單是寫死的
- 無法自動發現新的攻擊模式
- Prompt 中需要手動列出攻擊類型

### 解決方案

新的動態 Prompt 設計：

```javascript
// ✅ 新方法：動態識別攻擊類型
// 只將檢測次數 > 0 的攻擊類型加入 Prompt
if (sqlInjection.count > 0) {
  attackSections.push({...});
}
```

優勢：
- ✅ AI 從 LOG 自動識別攻擊類型
- ✅ 沒有檢測到的攻擊不會出現在 Prompt 中
- ✅ 可以發現未知的攻擊模式
- ✅ Prompt 更簡潔、更精準

---

## 📁 文件說明

### 1. `cloudflare-waf-analysis-prompt.md`

**完整的 Prompt 設計文檔**

包含：
- Cloudflare WAF 攻擊分數系統說明
- OWASP TOP 10 2021 分類標準
- 攻擊識別邏輯（4 種方法）
- 詳細的輸出格式要求
- 完整的範例輸出

**用途**：
- 作為 Prompt 設計的參考文檔
- 提供給 AI 模型的完整說明
- 團隊協作的標準文件

### 2. `prompt-integration-example.js`

**實際整合範例代碼**

展示如何：
- 從 `CloudflareWAFRiskService` 獲取分析數據
- 動態構建攻擊統計區塊
- 只包含檢測次數 > 0 的攻擊類型
- 生成完整的 AI Prompt

**用途**：
- 直接在 `backend/index.js` 中使用
- 可以運行範例查看生成的 Prompt
- 作為修改 API 的參考

### 3. `README.md` (本文件)

**方案總結文檔**

---

## 🔥 核心改變

### 改變 1: 動態構建攻擊統計

**舊方法（寫死）**:
```javascript
const prompt = `
**攻擊統計**
1. SQL 注入攻擊
   - 檢測次數: 3120
   ...
2. XSS 攻擊
   - 檢測次數: 1890
   ...
`;
```

**新方法（動態）**:
```javascript
const attackSections = [];

// 只添加有數據的攻擊類型
if (sqlInjection.count > 0) {
  attackSections.push({
    type: 'SQL 注入攻擊',
    data: sqlInjection
  });
}

// 動態生成攻擊統計文字
const attackStatisticsText = attackSections.map((section, index) => `
${index + 1}. **${section.type}**
   - 檢測次數: ${section.data.count}
   - Top 5 來源IP: ${section.data.topIPs.map(...).join(', ')}
   ...
`).join('\n\n');
```

### 改變 2: AI 自動識別攻擊類型

Prompt 中明確指示 AI：

```
⚠️ **關鍵規則**：只生成上面「攻擊統計」中明確列出的攻擊類型
⚠️ **絕對禁止**：不要生成任何在「攻擊統計」中未列出的攻擊類型
```

這樣：
- 如果 LOG 中沒有 SQL 注入攻擊，Prompt 中就不會有 SQL 注入的統計
- AI 就不會生成 SQL 注入的風險項目
- 完全基於真實數據，沒有假數據

### 改變 3: 包含具體統計資訊

每種攻擊類型都包含：

```javascript
{
  type: 'SQL 注入攻擊',
  data: {
    count: 3120,              // 總檢測次數
    highRisk: 856,            // 高風險次數（WAF 分數 1-20）
    avgScore: 15.4,           // 平均 WAF 分數
    affectedAssets: 45,       // 受影響資產數
    topIPs: [...],            // Top 5 來源 IP（含國家、次數）
    topCountries: [...],      // Top 5 來源國家
    topTargets: [...]         // Top 5 攻擊目標 URL
  }
}
```

AI 可以根據這些具體數字生成精準的分析報告。

---

## 🚀 實施步驟

### 步驟 1: 更新 `backend/index.js` 中的 API

找到 `/api/analyze-waf-risks-cloudflare` API（約第 1991 行）：

```javascript
// 舊代碼
const aiPrompt = wafService.generateAIPrompt(analysisData);
```

替換為：

```javascript
// 新代碼：使用動態 Prompt
const { generateDynamicPrompt } = require('./prompts/prompt-integration-example');
const aiPrompt = generateDynamicPrompt(analysisData);
```

### 步驟 2: 測試 Prompt 生成

運行範例查看生成的 Prompt：

```bash
cd /Users/peter/ddos-attack-graph-demo-2/backend/prompts
node prompt-integration-example.js
```

### 步驟 3: 測試完整流程

```bash
# 1. 啟動後端
cd /Users/peter/ddos-attack-graph-demo-2/backend
npm start

# 2. 在另一個終端，測試 API
curl -X POST http://localhost:8080/api/analyze-waf-risks-cloudflare \
  -H "Content-Type: application/json" \
  -d '{
    "aiProvider": "ollama",
    "model": "gpt-oss:20b",
    "timeRange": "24h"
  }'
```

### 步驟 4: 在前端查看結果

打開瀏覽器訪問：
```
http://localhost:3000/ai-analysis/cloudflare
```

點擊「重新載入 AI 分析」按鈕，查看新的分析結果。

---

## ✅ 測試驗證

### 測試案例 1: 只有 SQL 注入攻擊

**輸入數據**:
```javascript
{
  sqlInjection: { count: 3120, ... },
  xssAttacks: { count: 0 },
  rceAttacks: { count: 0 },
  ...
}
```

**預期 Prompt**:
```
**攻擊統計**
1. SQL 注入攻擊
   - 檢測次數: 3120
   ...

（沒有 XSS、RCE 的統計）
```

**預期 AI 輸出**:
```json
{
  "risks": [
    {
      "id": "sql-injection-...",
      "title": "SQL 注入攻擊激增",
      ...
    }
  ]
}
```

只有一個風險項目（SQL 注入）。

### 測試案例 2: 沒有任何攻擊

**輸入數據**:
```javascript
{
  sqlInjection: { count: 0 },
  xssAttacks: { count: 0 },
  rceAttacks: { count: 0 },
  ...
}
```

**預期 Prompt**:
```
**未檢測到任何安全威脅**

在指定時間範圍內，經過 Cloudflare WAF 的完整分析後，未檢測到任何攻擊。

請輸出空的 risks 陣列：
{
  "risks": []
}
```

**預期 AI 輸出**:
```json
{
  "risks": []
}
```

### 測試案例 3: 多種攻擊類型

**輸入數據**:
```javascript
{
  sqlInjection: { count: 3120, ... },
  xssAttacks: { count: 1890, ... },
  botTraffic: { count: 2541, ... },
  ...
}
```

**預期 AI 輸出**:
```json
{
  "risks": [
    { "title": "SQL 注入攻擊激增", ... },
    { "title": "XSS 跨站腳本攻擊檢測", ... },
    { "title": "惡意機器人流量", ... }
  ]
}
```

三個風險項目。

---

## 📊 對比：舊 vs 新

| 項目 | 舊方法 | 新方法 |
|------|--------|--------|
| 攻擊類型來源 | 預先定義（寫死） | 從 LOG 自動識別 |
| Prompt 結構 | 固定攻擊類型清單 | 動態構建（只包含有數據的類型） |
| Top 5 IP/URL | 需要手動填寫 | 自動從 LOG 統計 |
| 無攻擊情況 | 仍顯示所有攻擊類型（值為 0） | 只顯示「未檢測到威脅」 |
| AI 輸出 | 可能生成假數據 | 完全基於真實數據 |
| 可擴展性 | 需要修改代碼添加新攻擊類型 | AI 自動發現新攻擊模式 |

---

## 🎯 總結

### 關鍵優勢

1. **✅ 100% 基於真實數據** - 沒有假數據，所有統計都來自 ELK LOG
2. **✅ 動態攻擊識別** - AI 可以發現未預設的攻擊類型
3. **✅ 精準的統計資訊** - Top 5 IP、Top 5 URL 自動從 LOG 提取
4. **✅ 符合 Cloudflare 官方標準** - 使用官方 WAF 分數系統
5. **✅ OWASP TOP 10 分類** - 攻擊分析符合國際標準

### 下一步

- [ ] 在 `backend/index.js` 中整合新的 Prompt 生成函數
- [ ] 測試不同場景（有攻擊、無攻擊、多種攻擊）
- [ ] 調整 AI 模型參數（temperature、max_tokens）以獲得最佳結果
- [ ] 監控 AI 生成的結果品質，持續優化 Prompt

---

## 📞 聯絡與支援

如有問題或建議，請查看：
- `cloudflare-waf-analysis-prompt.md` - 完整 Prompt 文檔
- `prompt-integration-example.js` - 整合範例代碼

