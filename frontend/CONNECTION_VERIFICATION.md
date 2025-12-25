# Frontend 連接驗證報告

## ✅ 驗證結果：您的理解完全正確！

---

## 🔗 連接架構總覽

Frontend 確實連接到以下 4 個不同的服務：

### 1. ✅ Repo 中的 Backend
### 2. ✅ 另一個與資料庫相連的 Service
### 3. ✅ Dify（內嵌）
### 4. ✅ ELK/Kibana（內嵌畫面）

---

## 📋 詳細驗證

### 1. Repo 中的 Backend

**連接方式：** Next.js Rewrites (Proxy)

**配置位置：** `next.config.mjs:28-42`

```javascript
async rewrites() {
  return [
    {
      source: '/api/cloudflare/:path*',
      destination: 'http://localhost:8081/api/cloudflare/:path*',
    },
    {
      source: '/api/f5/:path*',
      destination: 'http://localhost:8081/api/f5/:path*',
    },
    {
      source: '/api/:path*',
      destination: 'http://localhost:3001/api/:path*',  // 主要 backend
    },
  ];
}
```

**使用範例：**
- `services/workflow/api.ts` - 使用相對路徑 `/api/workflow/${type}`
- 透過 Next.js proxy 轉發到 `localhost:3001`

**特點：**
- ✅ 使用相對路徑，透過 Next.js proxy
- ✅ 開發環境：`localhost:3001` 或 `localhost:8081`
- ✅ 生產環境：透過 rewrites 代理

---

### 2. 另一個與資料庫相連的 Service

**連接方式：** 直接 API 呼叫（Axios）

**配置位置：** `app/routes/request.ts:11-31`

```typescript
const getBaseURL = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    
    if (isDevelopment) {
      return 'http://localhost:3001/api/internal';  // 開發環境
    }
    
    return `${origin}/api/internal`;  // 生產環境（透過 Next.js proxy）
  }
  
  // SSR 環境
  if (isDevelopment) {
    return 'http://localhost:3001/api/internal';
  }
  
  return process.env.NEXT_PUBLIC_API_URL || 
         'https://adas-one.twister5.cf/api/internal';  // ⚠️ Hardcode 生產 URL
};
```

**端點：** `/api/internal/*`

**特點：**
- ✅ 獨立的 service（與 repo backend 分開）
- ✅ 使用 `axios` 建立專用的 request instance
- ✅ 有認證攔截器處理 401/403
- ⚠️ 生產環境 URL hardcode：`https://adas-one.twister5.cf/api/internal`

**用途推測：**
- 用戶認證、授權
- 內部 API（與資料庫直接連接）
- 系統設定、用戶管理等

---

### 3. Dify（內嵌）

**連接方式：** Iframe 內嵌 + 直接 API 呼叫

#### 3.1 Iframe 內嵌

**配置位置：** `app/dify/page.tsx:11-12`

```typescript
const iframeUrl = process.env.NEXT_PUBLIC_DIFY_WORKFLOW_URL ||
  "https://twister5poc.phison.com/app/4a730717-1563-4359-8036-49ed3d452482/workflow"
```

**使用組件：** `components/embedded-iframe.tsx`

**特點：**
- ✅ 內嵌 Dify Workflow 頁面
- ✅ 支援 Token 認證（透過 URL query parameter）
- ✅ 環境變數：`NEXT_PUBLIC_DIFY_WORKFLOW_URL`
- ⚠️ 預設 URL hardcode：`https://twister5poc.phison.com/...`

#### 3.2 直接 API 呼叫

**配置位置：** `app/page.tsx:52`

```typescript
const response = await fetch('https://twister5poc.phison.com/dify/console/api/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
  body: JSON.stringify({
    email: difyEmail,
    language: 'zh-Hant',
    password: difyPassword,
    remember_me: true
  })
})
```

**特點：**
- ✅ 直接呼叫 Dify Console API
- ✅ 用於自動登入功能
- ⚠️ URL hardcode：`https://twister5poc.phison.com/dify/console/api/login`
- ⚠️ 使用環境變數：`NEXT_PUBLIC_DIFY_EMAIL`, `NEXT_PUBLIC_DIFY_PWD`

**其他 Dify 相關頁面：**
- `app/kb-rag/page.tsx` - KB/RAG 管理（也是 iframe 內嵌）

---

### 4. ELK/Kibana（內嵌畫面）

**連接方式：** Iframe 內嵌

**配置位置：** `components/multi-kibana-dashboard.tsx:128-132`

```typescript
const kibanaConfig = {
  protocol: process.env.NEXT_PUBLIC_KIBANA_PROTOCOL || "https",
  host: process.env.NEXT_PUBLIC_KIBANA_HOST || "adas-bde.twister5.cf",  // ⚠️ Hardcode
  space: process.env.NEXT_PUBLIC_KIBANA_SPACE || "adasone"
}
```

**使用頁面：**
- `app/elk/page.tsx` - ELK 儀表板
- `app/ai-analysis/cloudflare/page.tsx` - 內嵌 Kibana 查詢
- `app/ai-analysis/f5/page.tsx` - 內嵌 Kibana 查詢
- `app/ai-analysis/checkpoint/page.tsx` - 內嵌 Kibana 查詢

**特點：**
- ✅ 內嵌多個 Kibana Dashboard
- ✅ 支援主題切換（Dark/Light）
- ✅ 支援自動刷新、時間範圍設定
- ✅ 支援 Discover 查詢功能
- ⚠️ 預設 host hardcode：`adas-bde.twister5.cf`
- ✅ 環境變數：`NEXT_PUBLIC_KIBANA_HOST`, `NEXT_PUBLIC_KIBANA_PROTOCOL`, `NEXT_PUBLIC_KIBANA_SPACE`

**URL 格式：**
```
${protocol}://${host}/s/${space}/app/dashboards#/view/${dashboardId}
${protocol}://${host}/s/${space}/app/discover#/?_g=...
```

---

## 📊 連接方式統計

| 服務 | 連接方式 | 配置方式 | Hardcode 數量 |
|------|---------|---------|-------------|
| **Repo Backend** | Next.js Proxy | `next.config.mjs` | 3 處（開發環境） |
| **Internal Service** | Axios | `app/routes/request.ts` | 1 處（生產環境） |
| **Dify** | Iframe + Fetch | 環境變數 + Hardcode | 2 處 |
| **ELK/Kibana** | Iframe | 環境變數 + Hardcode | 1 處 |

---

## ⚠️ 發現的問題

### 1. Hardcode 的生產環境 URL

| 位置 | URL | 問題 |
|------|-----|------|
| `app/routes/request.ts:30` | `https://adas-one.twister5.cf/api/internal` | 應該使用環境變數 |
| `app/dify/page.tsx:12` | `https://twister5poc.phison.com/app/...` | 應該使用環境變數 |
| `app/page.tsx:52` | `https://twister5poc.phison.com/dify/console/api/login` | 應該使用環境變數 |
| `components/multi-kibana-dashboard.tsx:130` | `adas-bde.twister5.cf` | 應該使用環境變數 |

### 2. 環境變數命名不一致

- `NEXT_PUBLIC_API_URL` - Internal Service
- `NEXT_PUBLIC_API_BASE_URL` - 其他 API
- `NEXT_PUBLIC_DIFY_WORKFLOW_URL` - Dify
- `NEXT_PUBLIC_KIBANA_HOST` - Kibana

### 3. Next.js Rewrites 全部 Hardcode

所有 rewrites 的 destination 都是 hardcode 的 localhost URL，應該使用環境變數。

---

## ✅ 驗證結論

**您的理解完全正確！**

Frontend 確實連接到：
1. ✅ **Repo 中的 Backend** - 透過 Next.js proxy (`/api/*` → `localhost:3001` 或 `localhost:8081`)
2. ✅ **另一個與資料庫相連的 Service** - 直接 API 呼叫 (`/api/internal` → `adas-one.twister5.cf`)
3. ✅ **Dify** - Iframe 內嵌 + 直接 API 呼叫 (`twister5poc.phison.com`)
4. ✅ **ELK/Kibana** - Iframe 內嵌 (`adas-bde.twister5.cf`)

---

## 🎯 建議改進

1. **統一環境變數命名**
2. **移除所有 hardcode 的生產環境 URL**
3. **Next.js rewrites 使用環境變數**
4. **建立統一的服務配置檔案**

