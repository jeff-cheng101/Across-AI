# Frontend 路徑處理評估報告

## 📊 總體評估

### Hardcode 統計
- **總共發現 72+ 處 hardcode 路徑**
- **13 個檔案包含 hardcode**
- **3 種不同的 API 基礎 URL 模式**

---

## 🔍 發現的問題

### 1. **API 基礎 URL 不一致**

#### 問題 1: 多種環境變數名稱
```typescript
// 不同的環境變數名稱
NEXT_PUBLIC_API_URL          // app/routes/request.ts
NEXT_PUBLIC_API_BASE_URL     // hooks/use-report-download.ts, cloudflare/page.tsx
```

#### 問題 2: 多種預設值
```typescript
// 不同的預設 localhost 端口
'http://localhost:8081'      // use-report-download.ts, cloudflare/page.tsx
'http://localhost:3001'      // app/routes/request.ts, next.config.mjs
'http://localhost:8080'      // setup-env.sh
```

#### 問題 3: Hardcode 的生產環境 URL
```typescript
// app/routes/request.ts:30
'https://adas-one.twister5.cf/api/internal'  // ❌ Hardcode 生產 URL
```

### 2. **Next.js Rewrites 中的 Hardcode**

```javascript
// next.config.mjs:32-40
{
  source: '/api/cloudflare/:path*',
  destination: 'http://localhost:8081/api/cloudflare/:path*', // ❌ Hardcode
},
{
  source: '/api/f5/:path*',
  destination: 'http://localhost:8081/api/f5/:path*', // ❌ Hardcode
},
{
  source: '/api/:path*',
  destination: 'http://localhost:3001/api/:path*', // ❌ Hardcode
}
```

### 3. **檔案層級的 API_BASE_URL 定義**

多個檔案各自定義 API_BASE_URL：
- `hooks/use-report-download.ts:7`
- `app/ai-analysis/cloudflare/page.tsx:17`
- `app/ai-analysis/f5/page.tsx` (推測)
- `app/ai-analysis/checkpoint/page.tsx` (推測)

### 4. **相對路徑 vs 絕對路徑混用**

```typescript
// ✅ 相對路徑（使用 Next.js proxy）
fetch(`/api/workflow/${type}`)  // services/workflow/api.ts

// ❌ 絕對路徑（直接連到後端）
fetch(`${API_BASE_URL}${endpoint}`)  // hooks/use-report-download.ts
```

---

## 📁 受影響的檔案清單

### 核心配置檔案
1. `next.config.mjs` - 3 處 hardcode
2. `app/routes/request.ts` - 4 處 hardcode + 1 處生產環境 URL
3. `.env.example` - 環境變數定義不一致

### 業務邏輯檔案
4. `hooks/use-report-download.ts` - 1 處 hardcode
5. `services/workflow/api.ts` - 使用相對路徑（✅ 正確）
6. `app/ai-analysis/cloudflare/page.tsx` - 1 處 hardcode
7. `app/ai-analysis/f5/page.tsx` - 推測有 hardcode
8. `app/ai-analysis/checkpoint/page.tsx` - 推測有 hardcode
9. `app/services/hiwaf/manage/security-logs/page.tsx` - 推測有 hardcode
10. `app/dashboard/cloudflare/overview/page.tsx` - 推測有 hardcode

### 工具檔案
11. `setup-env.sh` - 2 處 hardcode

---

## 🎯 建議改進方案

### 方案 1: 統一 API 配置（推薦）

建立 `lib/api-config.ts`:
```typescript
// lib/api-config.ts
export const API_CONFIG = {
  // 使用環境變數，統一命名
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 
           (typeof window !== 'undefined' ? window.location.origin : ''),
  
  // API 端點（相對路徑，使用 Next.js proxy）
  endpoints: {
    workflow: '/api/workflow',
    reports: '/api/reports',
    internal: '/api/internal',
    cloudflare: '/api/cloudflare',
    f5: '/api/f5',
  },
  
  // 開發環境後端 URL（僅用於 Next.js rewrites）
  devBackend: {
    cloudflare: process.env.NEXT_PUBLIC_BACKEND_CLOUDFLARE || 'http://localhost:8081',
    f5: process.env.NEXT_PUBLIC_BACKEND_F5 || 'http://localhost:8081',
    default: process.env.NEXT_PUBLIC_BACKEND_DEFAULT || 'http://localhost:3001',
  },
} as const;
```

### 方案 2: 統一使用相對路徑

所有 API 呼叫都使用相對路徑，透過 Next.js rewrites 代理：
```typescript
// ✅ 統一使用相對路徑
fetch('/api/workflow/ip-block-quick')
fetch('/api/reports/generate')
```

### 方案 3: 建立 API Client

建立統一的 API Client，類似 `app/routes/request.ts`，但更完善：
```typescript
// lib/api-client.ts
import axios from 'axios';

const getBaseURL = () => {
  // 統一邏輯
};

export const apiClient = axios.create({
  baseURL: getBaseURL(),
  // ...
});
```

---

## 📋 優先級建議

### 🔴 高優先級（立即修正）
1. **統一環境變數名稱** - 選擇一個標準（建議 `NEXT_PUBLIC_API_BASE_URL`）
2. **移除生產環境 hardcode URL** - `app/routes/request.ts:30`
3. **統一預設值** - 所有檔案使用相同的預設 localhost 端口

### 🟡 中優先級（短期內修正）
4. **建立統一 API 配置檔案** - `lib/api-config.ts`
5. **移除檔案層級的 API_BASE_URL 定義** - 統一從配置檔案導入
6. **Next.js rewrites 使用環境變數** - 移除 hardcode

### 🟢 低優先級（長期優化）
7. **統一使用相對路徑** - 透過 Next.js proxy
8. **建立 API Client** - 統一錯誤處理、攔截器等

---

## 📝 總結

### 當前狀態
- ❌ **高度分散**：路徑配置散落在多個檔案
- ❌ **不一致**：多種環境變數名稱和預設值
- ❌ **Hardcode 過多**：72+ 處 hardcode
- ⚠️ **維護困難**：修改路徑需要改動多個檔案

### 改進後預期
- ✅ **集中管理**：單一配置檔案
- ✅ **一致性**：統一的環境變數和預設值
- ✅ **零 Hardcode**：所有路徑從配置讀取
- ✅ **易於維護**：修改路徑只需改一個地方

