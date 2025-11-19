# AI 分析系統產品化重構計畫

> **版本**: v1.0  
> **日期**: 2024-12-18  
> **目標**: 將 AI 分析系統從 Cloudflare 單一產品架構重構為支援多產品（Cloudflare、F5、Checkpoint）的擴展性架構

---

## 📋 目錄

1. [當前問題分析](#當前問題分析)
2. [目標架構](#目標架構)
3. [重構方案總覽](#重構方案總覽)
4. [詳細執行步驟](#詳細執行步驟)
5. [API 端點對照表](#api-端點對照表)
6. [測試驗證計畫](#測試驗證計畫)
7. [執行檢查清單](#執行檢查清單)

---

## 🔍 當前問題分析

### 問題 1: 配置層產品綁定

```
❌ 當前結構：
backend/
├── config/
│   ├── cloudflareStandards.js    ← Cloudflare 專屬，無法共用
│   ├── elkConfig.js               ← 硬編碼 Cloudflare 索引
│   └── timeRangeConfig.js
│
根目錄/
└── cloudflare-field-mapping.js   ← Cloudflare 專屬，位置不當
```

**問題**:
- `elkConfig.js` 硬編碼 `across-cf-logpush-*` 索引
- 配置檔案散落在不同位置
- 無法支援 F5、Checkpoint 等其他產品

---

### 問題 2: 服務層產品綁定

```
❌ 當前結構：
backend/services/
├── cloudflareWAFRiskService.js   ← Cloudflare 專屬
└── elkMCPClient.js                ← 硬編碼 Cloudflare field mapping
```

**問題**:
- `elkMCPClient.js` 直接引用 `cloudflare-field-mapping.js`
- 無法動態切換索引和欄位映射
- 缺少 F5、Checkpoint 的服務實作

---

### 問題 3: API 路由產品綁定

```
❌ 當前 API 端點：
POST /api/analyze-waf-risks-cloudflare   ← Cloudflare 專屬
GET  /api/elk/test-connection            ← 綁定 Cloudflare 索引
GET  /api/elk/stats/:timeRange           ← 綁定 Cloudflare 索引
```

**問題**:
- ELK API 綁定 Cloudflare 索引，無法用於其他產品
- 沒有 F5 專屬的 API 端點
- API 命名不清晰，難以擴展

---

### 問題 4: 文檔位置混亂

```
❌ 當前結構：
根目錄/
├── cloudflare-docs/              ← 文檔在根目錄
└── cloudflare-field-mapping.js  ← 配置在根目錄
```

**問題**:
- 產品文檔和配置散落在根目錄
- 不易管理和維護

---

## 🎯 目標架構

### 最終目錄結構

```
backend/
├── index.js                                    ← 主路由檔案（簡化）
│
├── routes/                                     ← 新建：路由模組資料夾
│   ├── common.routes.js                        ← 通用路由（AI、模型）
│   ├── cloudflare.routes.js                    ← Cloudflare 產品路由
│   ├── f5.routes.js                            ← F5 產品路由
│   └── checkpoint.routes.js                    ← Checkpoint 路由（未來）
│
├── services/
│   ├── products/                               ← 產品專屬服務
│   │   ├── cloudflareWAFRiskService.js         ← 從 services/ 遷移
│   │   ├── f5WAFRiskService.js                 ← 新建
│   │   └── checkpointWAFRiskService.js         ← 未來擴展
│   │
│   └── elkMCPClient.js                         ← 重構：移除產品綁定，支援動態配置
│
├── config/
│   ├── products/                               ← 產品專屬配置
│   │   ├── cloudflare/
│   │   │   ├── cloudflareStandards.js          ← 從 config/ 遷移
│   │   │   ├── cloudflareFieldMapping.js       ← 從根目錄遷移
│   │   │   └── cloudflareELKConfig.js          ← 新建
│   │   │
│   │   ├── f5/
│   │   │   ├── f5Standards.js                  ← 新建
│   │   │   ├── f5FieldMapping.js               ← 新建
│   │   │   └── f5ELKConfig.js                  ← 新建（索引: across-f5-awaf-*）
│   │   │
│   │   └── checkpoint/                         ← 未來擴展
│   │       ├── checkpointStandards.js
│   │       ├── checkpointFieldMapping.js
│   │       └── checkpointELKConfig.js
│   │
│   ├── elkConfig.js                            ← 保留：通用 MCP 連接配置
│   └── timeRangeConfig.js                      ← 保留：通用時間範圍配置
│
├── docs/                                       ← 新建：文檔資料夾
│   ├── cloudflare/                             ← 從根目錄 cloudflare-docs/ 遷移
│   ├── f5/                                     ← 新建（未來放置 F5 文檔）
│   └── checkpoint/                             ← 未來擴展
│
└── [其他現有檔案]

根目錄/
├── cloudflare-field-mapping.js                 ← 刪除（已遷移）
└── cloudflare-docs/                            ← 刪除（已遷移）
```

### 架構設計原則

1. **產品隔離**: 每個產品有獨立的配置、服務、路由
2. **通用共享**: ELK 客戶端、時間配置等通用模組保持共享
3. **易於擴展**: 新增產品只需複製模板並調整配置
4. **向後相容**: 保留舊版 API 端點作為轉發

---

## 📝 重構方案總覽

### Phase 1: 目錄結構建立
- 建立 `backend/routes/` 資料夾
- 建立 `backend/config/products/cloudflare/` 資料夾
- 建立 `backend/config/products/f5/` 資料夾
- 建立 `backend/services/products/` 資料夾
- 建立 `backend/docs/` 資料夾

### Phase 2: Cloudflare 檔案遷移與重組
- 遷移配置檔案到產品資料夾
- 新建 Cloudflare ELK 配置
- 遷移服務檔案
- 遷移文檔

### Phase 3: F5 產品檔案建立
- 建立 F5 配置檔案（Standards, FieldMapping, ELKConfig）
- 建立 F5 服務檔案
- 準備 F5 文檔資料夾

### Phase 4: elkMCPClient 重構
- 移除 Cloudflare 專屬綁定
- 支援動態索引和欄位映射
- 更新所有方法簽名

### Phase 5: API 路由重構
- 建立產品專屬路由模組
- 建立通用路由模組
- 更新 index.js 整合路由
- 保留向後相容端點

### Phase 6: 前端整合
- 更新 Cloudflare 前端 API 呼叫
- 更新 F5 前端 API 呼叫

### Phase 7: 測試與驗證
- 測試 Cloudflare 新舊端點
- 測試 F5 新端點
- 驗證向後相容性

---

## 🚀 詳細執行步驟

## Phase 1: 目錄結構建立

### 步驟 1.1: 建立資料夾

```bash
# 在 backend/ 目錄下執行

# 建立路由資料夾
mkdir -p routes

# 建立產品配置資料夾
mkdir -p config/products/cloudflare
mkdir -p config/products/f5
mkdir -p config/products/checkpoint

# 建立產品服務資料夾
mkdir -p services/products

# 建立文檔資料夾
mkdir -p docs/cloudflare
mkdir -p docs/f5
mkdir -p docs/checkpoint
```

**檢查點**: 確認資料夾結構如下：
```
backend/
├── routes/          ✓
├── config/
│   └── products/
│       ├── cloudflare/  ✓
│       ├── f5/          ✓
│       └── checkpoint/  ✓
├── services/
│   └── products/    ✓
└── docs/
    ├── cloudflare/  ✓
    ├── f5/          ✓
    └── checkpoint/  ✓
```

---

## Phase 2: Cloudflare 檔案遷移與重組

### 步驟 2.1: 建立 Cloudflare ELK 配置

**檔案**: `backend/config/products/cloudflare/cloudflareELKConfig.js`

```javascript
// backend/config/products/cloudflare/cloudflareELKConfig.js
// Cloudflare 專屬的 ELK 索引配置

module.exports = {
  // ELK 索引模式（Cloudflare 日誌）
  index: process.env.ELK_CLOUDFLARE_INDEX || 'across-cf-logpush-*',
  
  // 產品識別
  productName: 'Cloudflare',
  productDisplayName: 'Cloudflare WAF',
  
  // 時間戳記欄位（Cloudflare 使用 EdgeStartTimestamp）
  timestampField: 'EdgeStartTimestamp',
  
  // Cloudflare 必要欄位（用於驗證日誌完整性）
  requiredFields: [
    'RayID',
    'ClientIP',
    'ClientRequestURI',
    'EdgeRequestHost',
    'WAFAttackScore',
    'EdgeStartTimestamp'
  ],
  
  // Cloudflare 安全相關欄位
  securityFields: [
    'WAFAttackScore',
    'WAFSQLiAttackScore',
    'WAFXSSAttackScore',
    'WAFRCEAttackScore',
    'SecurityAction',
    'SecurityRuleID',
    'BotScore'
  ],
  
  // 預設查詢參數
  defaultQueryParams: {
    size: 10000,  // 最大結果數
    sort: [{ 'EdgeStartTimestamp': { order: 'desc' } }]
  }
};
```

### 步驟 2.2: 遷移 cloudflare-field-mapping.js

```bash
# 從根目錄複製到產品資料夾
cp cloudflare-field-mapping.js backend/config/products/cloudflare/cloudflareFieldMapping.js
```

**更新檔案頭部註解**:
```javascript
// backend/config/products/cloudflare/cloudflareFieldMapping.js
// Cloudflare 日誌欄位對應表
// 根據 Cloudflare HTTP 日誌欄位建立的 AI 分析用欄位對應表
```

### 步驟 2.3: 遷移 cloudflareStandards.js

```bash
# 移動檔案
mv backend/config/cloudflareStandards.js backend/config/products/cloudflare/cloudflareStandards.js
```

### 步驟 2.4: 遷移 cloudflareWAFRiskService.js

```bash
# 移動服務檔案
mv backend/services/cloudflareWAFRiskService.js backend/services/products/cloudflareWAFRiskService.js
```

**更新 import 路徑**:

開啟 `backend/services/products/cloudflareWAFRiskService.js`，更新以下 require 路徑：

```javascript
// 舊的
const { ELK_CONFIG } = require('../config/elkConfig');
const { CLOUDFLARE_FIELD_MAPPING } = require('../../cloudflare-field-mapping');
const { ... } = require('../config/cloudflareStandards');

// 新的
const { ELK_CONFIG } = require('../../config/elkConfig');
const { CLOUDFLARE_FIELD_MAPPING } = require('../../config/products/cloudflare/cloudflareFieldMapping');
const { ... } = require('../../config/products/cloudflare/cloudflareStandards');
```

### 步驟 2.5: 遷移 Cloudflare 文檔

```bash
# 從根目錄遷移到 backend/docs/
mv cloudflare-docs/* backend/docs/cloudflare/
rmdir cloudflare-docs
```

### 步驟 2.6: 清理根目錄

```bash
# 刪除已遷移的檔案
rm cloudflare-field-mapping.js
```

**檢查點**: 確認以下檔案存在且路徑正確
- ✓ `backend/config/products/cloudflare/cloudflareELKConfig.js`
- ✓ `backend/config/products/cloudflare/cloudflareFieldMapping.js`
- ✓ `backend/config/products/cloudflare/cloudflareStandards.js`
- ✓ `backend/services/products/cloudflareWAFRiskService.js`
- ✓ `backend/docs/cloudflare/` (包含所有文檔)

---

## Phase 3: F5 產品檔案建立

### 步驟 3.1: 建立 F5 ELK 配置

**檔案**: `backend/config/products/f5/f5ELKConfig.js`

```javascript
// backend/config/products/f5/f5ELKConfig.js
// F5 Advanced WAF 專屬的 ELK 索引配置

module.exports = {
  // ELK 索引模式（F5 AWAF 日誌）
  index: process.env.ELK_F5_INDEX || 'across-f5-awaf-*',
  
  // 產品識別
  productName: 'F5',
  productDisplayName: 'F5 Advanced WAF',
  
  // 時間戳記欄位（F5 通常使用標準 @timestamp）
  timestampField: '@timestamp',
  
  // F5 必要欄位（根據實際日誌格式調整）
  requiredFields: [
    'request_id',           // F5 請求 ID
    'client_ip',            // 來源 IP
    'uri',                  // 請求 URI
    'method',               // HTTP 方法
    'attack_type',          // F5 攻擊類型
    'severity',             // 嚴重程度
    '@timestamp'            // 時間戳記
  ],
  
  // F5 安全相關欄位
  securityFields: [
    'attack_type',          // 攻擊類型
    'severity',             // 嚴重程度
    'violation_rating',     // 違規評分
    'sig_ids',              // 簽名 ID
    'sig_names',            // 簽名名稱
    'threat_campaign_names',// 威脅活動名稱
    'bot_category',         // Bot 類別
    'response_code'         // 回應代碼
  ],
  
  // 預設查詢參數
  defaultQueryParams: {
    size: 10000,  // 最大結果數
    sort: [{ '@timestamp': { order: 'desc' } }]
  }
};
```

### 步驟 3.2: 建立 F5 Standards

**檔案**: `backend/config/products/f5/f5Standards.js`

<details>
<summary>點擊展開完整程式碼</summary>

```javascript
// backend/config/products/f5/f5Standards.js
// F5 Advanced WAF 安全標準配置
// 參考 F5 BIG-IP ASM/Advanced WAF 安全策略

/**
 * F5 嚴重程度分類（基於 F5 原生分類）
 * F5 使用不同的嚴重程度評級系統
 */
const F5_SEVERITY_CLASSIFICATION = {
  CRITICAL: {
    value: 5,
    label: 'critical',
    displayName: '嚴重',
    severity: 'critical',
    color: 'red',
    description: 'F5 判定為嚴重威脅，需立即處理'
  },
  HIGH: {
    value: 4,
    label: 'high',
    displayName: '高',
    severity: 'high',
    color: 'orange',
    description: 'F5 判定為高風險攻擊'
  },
  MEDIUM: {
    value: 3,
    label: 'medium',
    displayName: '中',
    severity: 'medium',
    color: 'yellow',
    description: 'F5 判定為中等風險'
  },
  LOW: {
    value: 2,
    label: 'low',
    displayName: '低',
    severity: 'low',
    color: 'blue',
    description: 'F5 判定為低風險'
  },
  INFORMATIONAL: {
    value: 1,
    label: 'info',
    displayName: '資訊',
    severity: 'info',
    color: 'gray',
    description: 'F5 資訊性事件'
  }
};

/**
 * F5 攻擊類型分類（基於 F5 AWAF 攻擊簽名）
 */
const F5_ATTACK_TYPES = {
  SQL_INJECTION: {
    name: 'SQL Injection',
    displayName: 'SQL 注入',
    owaspCategory: 'A03:2021 - Injection',
    description: 'SQL 注入攻擊嘗試'
  },
  XSS: {
    name: 'Cross Site Scripting (XSS)',
    displayName: '跨站腳本攻擊 (XSS)',
    owaspCategory: 'A03:2021 - Injection',
    description: 'XSS 攻擊嘗試'
  },
  COMMAND_EXECUTION: {
    name: 'Command Execution',
    displayName: '命令執行',
    owaspCategory: 'A03:2021 - Injection',
    description: '遠程命令執行攻擊'
  },
  PATH_TRAVERSAL: {
    name: 'Path Traversal',
    displayName: '路徑遍歷',
    owaspCategory: 'A01:2021 - Broken Access Control',
    description: '路徑遍歷攻擊'
  },
  INFORMATION_LEAKAGE: {
    name: 'Information Leakage',
    displayName: '資訊洩漏',
    owaspCategory: 'A01:2021 - Broken Access Control',
    description: '敏感資訊洩漏'
  },
  SESSION_HIJACKING: {
    name: 'Session Hijacking',
    displayName: '會話劫持',
    owaspCategory: 'A07:2021 - Authentication Failures',
    description: '會話劫持攻擊'
  },
  BUFFER_OVERFLOW: {
    name: 'Buffer Overflow',
    displayName: '緩衝區溢位',
    owaspCategory: 'A03:2021 - Injection',
    description: '緩衝區溢位攻擊'
  },
  DENIAL_OF_SERVICE: {
    name: 'Denial of Service',
    displayName: '拒絕服務',
    owaspCategory: 'Application DDoS',
    description: '拒絕服務攻擊'
  },
  MALICIOUS_BOT: {
    name: 'Malicious Bot',
    displayName: '惡意機器人',
    owaspCategory: 'Bot Attack',
    description: '惡意機器人流量'
  }
};

/**
 * F5 內部路徑（不應被視為攻擊）
 */
const F5_INTERNAL_PATHS = [
  '/tmui/',           // F5 管理介面
  '/f5/',             // F5 內部路徑
  '/sam/',            // F5 SAM 模組
  '/xui/',            // F5 新版管理介面
];

/**
 * F5 違規評分閾值
 */
const F5_VIOLATION_THRESHOLDS = {
  CRITICAL: 90,    // >= 90 為嚴重
  HIGH: 70,        // >= 70 為高風險
  MEDIUM: 50,      // >= 50 為中風險
  LOW: 30          // >= 30 為低風險
};

/**
 * 根據 F5 嚴重程度值分類
 */
function classifyF5Severity(severityValue) {
  if (severityValue === 5) return F5_SEVERITY_CLASSIFICATION.CRITICAL;
  if (severityValue === 4) return F5_SEVERITY_CLASSIFICATION.HIGH;
  if (severityValue === 3) return F5_SEVERITY_CLASSIFICATION.MEDIUM;
  if (severityValue === 2) return F5_SEVERITY_CLASSIFICATION.LOW;
  if (severityValue === 1) return F5_SEVERITY_CLASSIFICATION.INFORMATIONAL;
  
  return F5_SEVERITY_CLASSIFICATION.INFORMATIONAL;
}

/**
 * 根據違規評分分類
 */
function getSeverityByViolationRating(violationRating) {
  if (violationRating >= F5_VIOLATION_THRESHOLDS.CRITICAL) return 'critical';
  if (violationRating >= F5_VIOLATION_THRESHOLDS.HIGH) return 'high';
  if (violationRating >= F5_VIOLATION_THRESHOLDS.MEDIUM) return 'medium';
  if (violationRating >= F5_VIOLATION_THRESHOLDS.LOW) return 'low';
  return 'info';
}

/**
 * 檢查 URI 是否為 F5 內部路徑
 */
function isF5InternalPath(uri) {
  if (!uri || typeof uri !== 'string') {
    return false;
  }
  
  return F5_INTERNAL_PATHS.some(path => uri.startsWith(path));
}

/**
 * 檢查是否為真實安全威脅
 */
function isRealSecurityThreat(log) {
  // 條件 1：不是 F5 內部路徑
  if (isF5InternalPath(log.uri)) {
    return false;
  }
  
  // 條件 2：有攻擊類型標記
  if (log.attack_type && log.attack_type !== 'N/A' && log.attack_type !== '') {
    return true;
  }
  
  // 條件 3：嚴重程度達到一定級別
  if (log.severity >= 3) {  // medium 以上
    return true;
  }
  
  // 條件 4：違規評分達到閾值
  if (log.violation_rating >= F5_VIOLATION_THRESHOLDS.MEDIUM) {
    return true;
  }
  
  return false;
}

module.exports = {
  F5_SEVERITY_CLASSIFICATION,
  F5_ATTACK_TYPES,
  F5_INTERNAL_PATHS,
  F5_VIOLATION_THRESHOLDS,
  classifyF5Severity,
  getSeverityByViolationRating,
  isF5InternalPath,
  isRealSecurityThreat
};
```

</details>

### 步驟 3.3: 建立 F5 Field Mapping

**檔案**: `backend/config/products/f5/f5FieldMapping.js`

由於檔案較長（約 300 行），請參考 [附錄 A: F5 Field Mapping 完整程式碼](#附錄-a-f5-field-mapping-完整程式碼)

### 步驟 3.4: 建立 F5 WAF Risk Service

**檔案**: `backend/services/products/f5WAFRiskService.js`

由於檔案較長（約 700 行），請參考 [附錄 B: F5 WAF Risk Service 完整程式碼](#附錄-b-f5-waf-risk-service-完整程式碼)

**檢查點**: 確認以下檔案存在
- ✓ `backend/config/products/f5/f5ELKConfig.js`
- ✓ `backend/config/products/f5/f5Standards.js`
- ✓ `backend/config/products/f5/f5FieldMapping.js`
- ✓ `backend/services/products/f5WAFRiskService.js`

---

## Phase 4: elkMCPClient 重構

### 步驟 4.1: 修改 elkMCPClient.js

**檔案**: `backend/services/elkMCPClient.js`

**修改 1**: 移除 Cloudflare field mapping 的硬編碼

```javascript
// ❌ 刪除這行
// const { CLOUDFLARE_FIELD_MAPPING } = require('../../cloudflare-field-mapping');
```

**修改 2**: 更新 `queryElasticsearch` 方法支援動態索引

找到 `queryElasticsearch` 方法，修改簽名：

```javascript
// 舊的
async queryElasticsearch(timeRange = '1h') {
  // ...
}

// 新的
/**
 * 查詢 Elasticsearch（支援動態索引配置）
 * @param {string} timeRange - 時間範圍
 * @param {object} options - 可選參數
 * @param {string} options.indexPattern - 索引模式（覆蓋預設）
 */
async queryElasticsearch(timeRange = '1h', options = {}) {
  // 使用傳入的索引模式，或使用預設
  const indexPattern = options.indexPattern || ELK_CONFIG.elasticsearch.index;
  
  console.log(`🔍 查詢 ELK 索引: ${indexPattern}`);
  console.log(`⏰ 時間範圍: ${timeRange}`);
  
  // ... 其餘邏輯保持不變，但使用 indexPattern 變數
}
```

**修改 3**: 更新 `getSecurityStats` 方法

找到 `getSecurityStats` 方法，修改簽名：

```javascript
// 舊的
async getSecurityStats(timeRange = '1h') {
  // ...
}

// 新的
/**
 * 獲取安全統計（支援動態索引）
 * @param {string} timeRange - 時間範圍
 * @param {string} indexPattern - 索引模式
 */
async getSecurityStats(timeRange = '1h', indexPattern = null) {
  const index = indexPattern || ELK_CONFIG.elasticsearch.index;
  console.log(`📊 獲取安全統計 - 索引: ${index}`);
  
  // ... 使用 index 變數進行查詢
}
```

**修改 4**: 更新 `testConnection` 方法

```javascript
// 舊的
async testConnection() {
  // ...
}

// 新的
/**
 * 測試連接（支援指定索引）
 * @param {string} indexPattern - 可選的索引模式
 */
async testConnection(indexPattern = null) {
  const index = indexPattern || ELK_CONFIG.elasticsearch.index;
  console.log(`🔌 測試 ELK 連接 - 索引: ${index}`);
  
  // ... 使用 index 變數
}
```

**檢查點**: 確認 elkMCPClient.js 已：
- ✓ 移除 Cloudflare field mapping 引用
- ✓ `queryElasticsearch` 支援 `options.indexPattern` 參數
- ✓ `getSecurityStats` 支援 `indexPattern` 參數
- ✓ `testConnection` 支援 `indexPattern` 參數

---

## Phase 5: API 路由重構

### 步驟 5.1: 建立通用路由

**檔案**: `backend/routes/common.routes.js`

```javascript
// backend/routes/common.routes.js
// 通用 API 路由（不綁定特定產品）

const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// 可用的 AI 模型列表
const AVAILABLE_MODELS = [
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro' },
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
  { id: 'gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash Lite' },
  { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash Experimental' }
];

// 獲取可用模型列表
router.get('/models', (_req, res) => {
  res.json(AVAILABLE_MODELS);
});

// AI 連接測試
router.post('/test-ai', async (req, res) => {
  try {
    const { apiKey, model, aiProvider = 'gemini' } = req.body;
    
    if (aiProvider === 'ollama') {
      // 測試 Ollama
      const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
      const ollamaModel = model || 'gpt-oss:20b';
      
      const testResponse = await fetch(`${ollamaUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: ollamaModel,
          prompt: 'Test connection',
          stream: false
        })
      });
      
      if (!testResponse.ok) {
        throw new Error(`Ollama 連接失敗: ${testResponse.status}`);
      }
      
      res.json({
        success: true,
        message: '✅ Ollama 連接測試成功',
        provider: 'ollama',
        model: ollamaModel
      });
      
    } else {
      // 測試 Gemini
      if (!apiKey) {
        return res.status(400).json({ error: '缺少 Gemini API Key' });
      }
      
      const useModel = model || 'gemini-2.0-flash-exp';
      const genAI = new GoogleGenerativeAI(apiKey);
      const geminiModel = genAI.getGenerativeModel({ model: useModel });
      
      const testPrompt = "請回答：AI 連接測試成功。";
      const result = await geminiModel.generateContent(testPrompt);
      const response = result.response;
      const text = response.text();
      
      res.json({
        success: true,
        message: '✅ Gemini AI 連接測試成功',
        provider: 'gemini',
        model: useModel,
        response: text
      });
    }

  } catch (error) {
    console.error('AI 測試錯誤:', error);
    res.status(500).json({ 
      error: 'AI 測試失敗',
      details: error.message 
    });
  }
});

module.exports = router;
```

### 步驟 5.2: 建立 Cloudflare 路由

**檔案**: `backend/routes/cloudflare.routes.js`

由於檔案較長（約 200 行），請參考 [附錄 C: Cloudflare Routes 完整程式碼](#附錄-c-cloudflare-routes-完整程式碼)

### 步驟 5.3: 建立 F5 路由

**檔案**: `backend/routes/f5.routes.js`

結構與 Cloudflare routes 類似，請參考 [附錄 D: F5 Routes 完整程式碼](#附錄-d-f5-routes-完整程式碼)

### 步驟 5.4: 更新 index.js

**檔案**: `backend/index.js`

**完整替換** 原有的路由定義部分：

```javascript
// backend/index.js
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ===== 導入路由模組 =====
const commonRoutes = require('./routes/common.routes');
const cloudflareRoutes = require('./routes/cloudflare.routes');
const f5Routes = require('./routes/f5.routes');

// ===== 註冊路由 =====

// 通用 API
app.use('/api', commonRoutes);

// 產品專屬 API
app.use('/api/cloudflare', cloudflareRoutes);
app.use('/api/f5', f5Routes);

// ===== 向後相容的舊版端點（逐步廢棄） =====

// 舊版 Cloudflare API（轉發到新端點）
app.post('/api/analyze-waf-risks-cloudflare', (req, res, next) => {
  console.warn('⚠️ 使用舊版 API 端點，建議改用 /api/cloudflare/analyze-waf-risks');
  req.url = '/api/cloudflare/analyze-waf-risks';
  cloudflareRoutes(req, res, next);
});

// 舊版 ELK API（預設使用 Cloudflare）
app.get('/api/elk/test-connection', (req, res, next) => {
  console.warn('⚠️ 使用舊版通用 ELK API，建議使用 /api/cloudflare/test-connection');
  req.url = '/api/cloudflare/test-connection';
  cloudflareRoutes(req, res, next);
});

app.get('/api/elk/stats/:timeRange', (req, res, next) => {
  console.warn('⚠️ 使用舊版通用 ELK API，建議使用 /api/cloudflare/stats/:timeRange');
  req.url = `/api/cloudflare/stats/${req.params.timeRange}`;
  cloudflareRoutes(req, res, next);
});

app.get('/api/elk/stats', (req, res, next) => {
  console.warn('⚠️ 使用舊版通用 ELK API，建議使用 /api/cloudflare/stats');
  req.url = '/api/cloudflare/stats';
  cloudflareRoutes(req, res, next);
});

// ===== 刪除舊的內嵌路由定義 =====
// 刪除原有的 app.get('/api/models', ...)
// 刪除原有的 app.post('/api/test-ai', ...)
// 刪除原有的 app.get('/api/elk/...')
// 刪除原有的 app.post('/api/analyze-waf-risks-cloudflare', ...)

// ===== 啟動服務 =====
const port = 8080;
app.listen(port, () => {
  console.log(`🚀 Backend API 已啟動: http://localhost:${port}`);
  console.log('\n📡 API 端點總覽:');
  console.log('  通用 API:');
  console.log('    GET  /api/models                              - 獲取可用 AI 模型');
  console.log('    POST /api/test-ai                             - 測試 AI 連接');
  console.log('\n  Cloudflare API:');
  console.log('    GET  /api/cloudflare/test-connection          - 測試 Cloudflare ELK 連接');
  console.log('    GET  /api/cloudflare/stats/:timeRange         - 獲取 Cloudflare 統計');
  console.log('    GET  /api/cloudflare/stats                    - 獲取 Cloudflare 統計（預設）');
  console.log('    POST /api/cloudflare/analyze-waf-risks        - Cloudflare WAF 風險分析');
  console.log('\n  F5 API:');
  console.log('    GET  /api/f5/test-connection                  - 測試 F5 ELK 連接');
  console.log('    GET  /api/f5/stats/:timeRange                 - 獲取 F5 統計');
  console.log('    GET  /api/f5/stats                            - 獲取 F5 統計（預設）');
  console.log('    POST /api/f5/analyze-waf-risks                - F5 WAF 風險分析');
  console.log('\n  舊版 API（向後相容，將逐步廢棄）:');
  console.log('    POST /api/analyze-waf-risks-cloudflare        → /api/cloudflare/analyze-waf-risks');
  console.log('    GET  /api/elk/*                               → /api/cloudflare/*');
  console.log('\n');
});
```

**檢查點**: 確認 index.js
- ✓ 引入三個路由模組
- ✓ 註冊新路由
- ✓ 保留向後相容端點
- ✓ 刪除舊的內嵌路由定義

---

## Phase 6: 前端整合

### 步驟 6.1: 更新 Cloudflare 前端

**檔案**: `frontend/app/ai-analysis/cloudflare/page.tsx`

找到 API 呼叫部分（約第 69 行），更新為新端點：

```typescript
// 舊的
const response = await fetch('http://localhost:8080/api/analyze-waf-risks-cloudflare', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    aiProvider: aiProvider,
    apiKey: apiKey,
    model: aiModel,
    timeRange: selectedTimeRange
  })
})

// 新的（建議）
const response = await fetch('http://localhost:8080/api/cloudflare/analyze-waf-risks', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    aiProvider: aiProvider,
    apiKey: apiKey,
    model: aiModel,
    timeRange: selectedTimeRange
  })
})
```

**注意**: 由於有向後相容，舊端點仍可使用。但建議更新為新端點。

### 步驟 6.2: 更新 F5 前端

**檔案**: `frontend/app/ai-analysis/f5/page.tsx`

找到 `useState` 初始化部分，移除假資料：

```typescript
// 舊的（假資料）
const [wafRisks, setWafRisks] = useState<WAFRisk[]>([
  {
    id: "information-leakage-surge",
    title: "資訊洩漏攻擊大規模檢測",
    // ... 很多假資料
  }
]);

// 新的（空陣列）
const [wafRisks, setWafRisks] = useState<WAFRisk[]>([]);
```

新增狀態和載入邏輯：

```typescript
// 新增狀態
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [forceReload, setForceReload] = useState(0);
const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);
const [selectedTimeRange, setSelectedTimeRange] = useState('24h');

// 新增 useEffect 載入邏輯
useEffect(() => {
  const loadF5WAFRisks = async () => {
    if (hasAttemptedLoad && wafRisks.length > 0) {
      return;
    }
    
    if (wafRisks.length > 0) {
      return;
    }

    console.log('🔄 開始載入 F5 WAF 風險分析...');
    setIsLoading(true);
    setError(null);

    try {
      const aiProvider = localStorage.getItem('aiProvider') || 'ollama';
      const apiKey = localStorage.getItem('geminiApiKey') || '';
      const aiModel = aiProvider === 'ollama' 
        ? (localStorage.getItem('ollamaModel') || 'gpt-oss:20b')
        : 'gemini-2.0-flash-exp';

      console.log(`🤖 AI 提供者: ${aiProvider}`);
      console.log(`🤖 AI 模型: ${aiModel}`);

      if (aiProvider === 'gemini' && !apiKey) {
        setError('請先設定 Gemini API Key 或切換至 Ollama');
        setIsLoading(false);
        setHasAttemptedLoad(true);
        return;
      }

      // 呼叫 F5 API
      const response = await fetch('http://localhost:8080/api/f5/analyze-waf-risks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          aiProvider: aiProvider,
          apiKey: apiKey,
          model: aiModel,
          timeRange: selectedTimeRange
        })
      });

      if (!response.ok) {
        throw new Error(`API 請求失敗: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ 成功載入 F5 WAF 風險資料:', data);

      if (data.success && data.risks && data.risks.length > 0) {
        console.log(`📊 載入了 ${data.risks.length} 個風險項目`);
        setWafRisks(data.risks);
      } else {
        console.warn('⚠️ API 回傳空資料');
        setError('未檢測到任何安全威脅');
        setWafRisks([]);
      }

    } catch (err) {
      console.error('❌ 載入 F5 WAF 風險分析失敗:', err);
      setError(err instanceof Error ? err.message : '未知錯誤');
      setWafRisks([]);
    } finally {
      setIsLoading(false);
      setHasAttemptedLoad(true);
    }
  };

  loadF5WAFRisks();
}, [wafRisks.length, forceReload, selectedTimeRange]);

// 新增重新載入函數
const handleReload = () => {
  console.log('🔄 手動觸發重新載入...');
  setWafRisks([]);
  setHasAttemptedLoad(false);
  setError(null);
  setForceReload(prev => prev + 1);
};
```

在 JSX 中新增載入狀態和重新載入按鈕（參考 Cloudflare 頁面的實作）。

**檢查點**: 確認前端
- ✓ Cloudflare 頁面使用新 API 端點（或保留舊端點）
- ✓ F5 頁面移除假資料
- ✓ F5 頁面實作 API 呼叫邏輯
- ✓ F5 頁面實作載入狀態顯示

---

## Phase 7: 測試與驗證

### 步驟 7.1: 測試 Cloudflare API

```bash
# 1. 測試 Cloudflare 連接
curl http://localhost:8080/api/cloudflare/test-connection

# 預期回應:
# {"connected":true,"product":"Cloudflare","index":"across-cf-logpush-*","message":"Cloudflare ELK 連接正常"}

# 2. 測試 Cloudflare 統計
curl http://localhost:8080/api/cloudflare/stats

# 3. 測試舊版端點（向後相容）
curl http://localhost:8080/api/elk/test-connection

# 應該回傳相同結果，並有警告訊息
```

### 步驟 7.2: 測試 F5 API

```bash
# 1. 測試 F5 連接
curl http://localhost:8080/api/f5/test-connection

# 預期回應:
# {"connected":true,"product":"F5","index":"across-f5-awaf-*","message":"F5 ELK 連接正常"}

# 2. 測試 F5 統計
curl http://localhost:8080/api/f5/stats
```

### 步驟 7.3: 測試前端頁面

1. **啟動後端**:
```bash
cd backend
node index.js
```

2. **啟動前端**:
```bash
cd frontend
npm run dev
```

3. **測試 Cloudflare 頁面**:
- 訪問 `http://localhost:3000/ai-analysis/cloudflare`
- 確認資料正常載入
- 測試時間範圍切換
- 測試重新載入按鈕

4. **測試 F5 頁面**:
- 訪問 `http://localhost:3000/ai-analysis/f5`
- 確認資料正常載入（如果 ELK 有 F5 資料）
- 測試載入狀態顯示
- 測試錯誤處理

### 步驟 7.4: 驗證向後相容性

確認舊版 API 端點仍然可用：
- `POST /api/analyze-waf-risks-cloudflare` 應轉發到新端點
- `GET /api/elk/*` 應轉發到 Cloudflare 端點
- 控制台應顯示警告訊息

---

## 📊 API 端點對照表

### 完整 API 對照表

| 功能 | 舊版端點 | 新版端點 | 產品 | 狀態 |
|------|---------|---------|------|------|
| **通用 API** |
| 模型列表 | `/api/models` | `/api/models` | 通用 | ✅ 保留 |
| AI 測試 | `/api/test-ai` | `/api/test-ai` | 通用 | ✅ 保留 |
| **Cloudflare API** |
| 連接測試 | `/api/elk/test-connection` | `/api/cloudflare/test-connection` | Cloudflare | 🔄 新增 |
| 統計（帶參數） | `/api/elk/stats/:timeRange` | `/api/cloudflare/stats/:timeRange` | Cloudflare | 🔄 新增 |
| 統計（預設） | `/api/elk/stats` | `/api/cloudflare/stats` | Cloudflare | 🔄 新增 |
| WAF 分析 | `/api/analyze-waf-risks-cloudflare` | `/api/cloudflare/analyze-waf-risks` | Cloudflare | 🔄 新增 |
| **F5 API** |
| 連接測試 | ❌ 不存在 | `/api/f5/test-connection` | F5 | ✨ 新建 |
| 統計（帶參數） | ❌ 不存在 | `/api/f5/stats/:timeRange` | F5 | ✨ 新建 |
| 統計（預設） | ❌ 不存在 | `/api/f5/stats` | F5 | ✨ 新建 |
| WAF 分析 | ❌ 不存在 | `/api/f5/analyze-waf-risks` | F5 | ✨ 新建 |

### 索引配置對照表

| 產品 | 環境變數 | 預設索引 | 時間欄位 | 配置檔案 |
|------|---------|---------|----------|---------|
| **Cloudflare** | `ELK_CLOUDFLARE_INDEX` | `across-cf-logpush-*` | `EdgeStartTimestamp` | `cloudflareELKConfig.js` |
| **F5** | `ELK_F5_INDEX` | `across-f5-awaf-*` | `@timestamp` | `f5ELKConfig.js` |
| **Checkpoint** (未來) | `ELK_CHECKPOINT_INDEX` | `across-checkpoint-*` | `@timestamp` | `checkpointELKConfig.js` |

---

## ✅ 執行檢查清單

### Phase 1: 目錄結構建立
- [ ] 建立 `backend/routes/` 資料夾
- [ ] 建立 `backend/config/products/cloudflare/` 資料夾
- [ ] 建立 `backend/config/products/f5/` 資料夾
- [ ] 建立 `backend/services/products/` 資料夾
- [ ] 建立 `backend/docs/` 資料夾

### Phase 2: Cloudflare 檔案遷移
- [ ] 建立 `cloudflareELKConfig.js`
- [ ] 遷移 `cloudflareFieldMapping.js`
- [ ] 遷移 `cloudflareStandards.js`
- [ ] 遷移 `cloudflareWAFRiskService.js`
- [ ] 更新 `cloudflareWAFRiskService.js` 的 import 路徑
- [ ] 遷移 `cloudflare-docs/` 到 `backend/docs/cloudflare/`
- [ ] 刪除根目錄的 `cloudflare-field-mapping.js`

### Phase 3: F5 檔案建立
- [ ] 建立 `f5ELKConfig.js`（索引: `across-f5-awaf-*`）
- [ ] 建立 `f5Standards.js`
- [ ] 建立 `f5FieldMapping.js`
- [ ] 建立 `f5WAFRiskService.js`

### Phase 4: elkMCPClient 重構
- [ ] 移除 Cloudflare field mapping 引用
- [ ] 更新 `queryElasticsearch` 支援動態索引
- [ ] 更新 `getSecurityStats` 支援動態索引
- [ ] 更新 `testConnection` 支援動態索引

### Phase 5: API 路由重構
- [ ] 建立 `common.routes.js`
- [ ] 建立 `cloudflare.routes.js`
- [ ] 建立 `f5.routes.js`
- [ ] 更新 `index.js` 整合路由
- [ ] 保留向後相容端點

### Phase 6: 前端整合
- [ ] 更新 Cloudflare 前端 API 呼叫（可選）
- [ ] 更新 F5 前端移除假資料
- [ ] 實作 F5 前端 API 呼叫邏輯

### Phase 7: 測試驗證
- [ ] 測試 Cloudflare 新 API 端點
- [ ] 測試 Cloudflare 舊 API 端點（向後相容）
- [ ] 測試 F5 新 API 端點
- [ ] 測試前端 Cloudflare 頁面
- [ ] 測試前端 F5 頁面
- [ ] 驗證錯誤處理和載入狀態

---

## 🎯 預期成果

完成所有步驟後，系統應達到以下狀態：

### ✅ 架構改善
1. **產品完全隔離**: Cloudflare、F5 各自有獨立的配置、服務、路由
2. **通用模組共享**: ELK 客戶端、時間配置等保持共用
3. **易於擴展**: 新增 Checkpoint 或其他產品只需複製模板

### ✅ API 清晰化
1. **語義明確**: `/api/cloudflare/*`、`/api/f5/*` 清楚表明產品
2. **向後相容**: 舊版 API 仍可使用，不影響現有功能
3. **統一風格**: 所有產品 API 遵循相同模式

### ✅ 維護性提升
1. **檔案組織**: 配置、服務、文檔分類清晰
2. **可讀性**: 路由模組化，index.js 簡潔明瞭
3. **擴展性**: 新產品只需 3 個配置檔 + 1 個服務檔 + 1 個路由檔

---

## 📎 附錄

### 附錄 A: F5 Field Mapping 完整程式碼

由於篇幅限制，完整程式碼請參考：
- 檔案路徑: `backend/config/products/f5/f5FieldMapping.js`
- 結構參考: Cloudflare 的 `cloudflareFieldMapping.js`
- 主要差異: 欄位名稱根據 F5 日誌格式調整

### 附錄 B: F5 WAF Risk Service 完整程式碼

由於篇幅限制，完整程式碼請參考：
- 檔案路徑: `backend/services/products/f5WAFRiskService.js`
- 結構參考: Cloudflare 的 `cloudflareWAFRiskService.js`
- 主要差異: 使用 F5 專屬的配置和欄位映射

### 附錄 C: Cloudflare Routes 完整程式碼

檔案路徑: `backend/routes/cloudflare.routes.js`

包含以下端點：
- `GET /test-connection` - 測試連接
- `GET /stats/:timeRange` - 獲取統計（帶參數）
- `GET /stats` - 獲取統計（預設）
- `POST /analyze-waf-risks` - WAF 風險分析

### 附錄 D: F5 Routes 完整程式碼

檔案路徑: `backend/routes/f5.routes.js`

結構與 Cloudflare routes 相同，但使用 F5 專屬的配置。

---

## 🔧 故障排除

### 問題 1: import 路徑錯誤

**症狀**: `Cannot find module` 錯誤

**解決方法**:
1. 檢查所有 `require()` 路徑是否正確
2. 確認檔案已遷移到正確位置
3. 使用相對路徑（`../` 或 `../../`）

### 問題 2: API 404 錯誤

**症狀**: 前端呼叫 API 返回 404

**解決方法**:
1. 確認 `index.js` 已正確註冊路由
2. 檢查路由檔案的 `module.exports` 是否正確
3. 確認 Express Router 語法正確

### 問題 3: ELK 連接失敗

**症狀**: 測試連接返回失敗

**解決方法**:
1. 確認 ELK 服務正常運行
2. 檢查索引名稱是否正確
3. 驗證 `elkMCPClient` 已正確傳遞索引參數

### 問題 4: 前端無法載入資料

**症狀**: F5 頁面一直顯示載入中

**解決方法**:
1. 檢查後端 API 是否正常運行
2. 確認前端 API URL 正確
3. 查看瀏覽器控制台和網路請求
4. 確認後端有 F5 日誌資料

---

## 📚 參考資源

- [Express Router 文檔](https://expressjs.com/en/guide/routing.html)
- [Node.js Module 系統](https://nodejs.org/api/modules.html)
- [RESTful API 設計最佳實踐](https://restfulapi.net/)
- [Cloudflare WAF 文檔](https://developers.cloudflare.com/waf/)
- [F5 BIG-IP ASM 文檔](https://techdocs.f5.com/)

---

## 📝 結語

此重構計畫旨在將系統從單一產品架構升級為支援多產品的擴展性架構。完成後，系統將具備：

- ✅ **清晰的產品隔離**
- ✅ **統一的 API 設計**
- ✅ **易於維護和擴展**
- ✅ **向後相容保證**

請按照步驟逐步執行，並在每個 Phase 完成後進行檢查點驗證。

祝重構順利！ 🚀

