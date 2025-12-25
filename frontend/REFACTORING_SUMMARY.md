# API 客戶端統一重構總結

## ✅ 完成的工作

### 1. 建立統一 API 客戶端

**`lib/api-clients.ts`** - 兩個 Axios 實體
- `authClient` - 認證服務 (NEXT_PUBLIC_AUTH_SERVICE_URL)
- `backendClient` - 後端 API 服務 (NEXT_PUBLIC_BACKEND_SERVICE_URL)
- 統一的錯誤處理攔截器
- 自動附加 Authorization token

### 2. 移除 Next.js Rewrites

**`next.config.mjs`**
- ❌ 移除：`async rewrites()` 配置
- ✅ 改用：Axios 客戶端直接呼叫完整 URL

### 3. 更新 `.env.example`

4 組核心服務環境變數：
```bash
# Auth Service
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:3001

# Backend Service
NEXT_PUBLIC_BACKEND_SERVICE_URL=http://localhost:8081

# Kibana
NEXT_PUBLIC_KIBANA_URL=https://your-kibana-host
NEXT_PUBLIC_KIBANA_SPACE=default

# Dify
NEXT_PUBLIC_DIFY_URL=https://your-dify-host
NEXT_PUBLIC_DIFY_WORKFLOW_URL=...
NEXT_PUBLIC_KB_RAG_URL=...
NEXT_PUBLIC_DIFY_EMAIL=...
NEXT_PUBLIC_DIFY_PWD=...
```

---

## 📁 變更檔案清單

### 新建
| 檔案 | 說明 |
|------|------|
| `lib/api-clients.ts` | 統一的 Axios 客戶端 |

### 刪除
| 檔案 | 說明 |
|------|------|
| `app/routes/request.ts` | 邏輯已遷移至 `lib/api-clients.ts` |

### 更新
| 檔案 | 變更 |
|------|------|
| `.env.example` | 新的環境變數結構 |
| `next.config.mjs` | 移除 rewrites |
| `setup-env.sh` | 支援新環境變數 |
| `app/routes/auth.ts` | 改用 `authClient` |
| `app/routes/users.ts` | 改用 `authClient` |
| `app/routes/ticket.ts` | 改用 `authClient` |
| `app/routes/system_setting.ts` | 改用 `authClient` |
| `app/routes/contracts.ts` | 改用 `authClient` |
| `hooks/use-report-download.ts` | 改用 `backendClient` |
| `services/workflow/api.ts` | 改用 `backendClient` |
| `app/ai-analysis/cloudflare/page.tsx` | 改用 `backendClient` |
| `app/ai-analysis/f5/page.tsx` | 改用 `backendClient` |
| `app/ai-analysis/checkpoint/page.tsx` | 改用 `backendClient` |
| `app/page.tsx` | 使用 `NEXT_PUBLIC_DIFY_URL` |
| `app/dify/page.tsx` | 移除 hardcode fallback |
| `app/kb-rag/page.tsx` | 移除 hardcode fallback |
| `components/multi-kibana-dashboard.tsx` | 使用 `NEXT_PUBLIC_KIBANA_URL` |

---

## 🎯 設計原則

### 1. 直接呼叫，不用 Proxy
- ❌ 不使用 Next.js rewrites
- ✅ Axios 客戶端直接呼叫後端完整 URL
- ✅ 需要正確配置 CORS

### 2. 環境變數驅動
- 所有服務 URL 從環境變數讀取
- 支援不同域名的靈活配置
- 無 hardcode URL（除了 `.env.example` 中的預設值）

### 3. 集中管理
- 所有 API 呼叫使用 `lib/api-clients.ts`
- `authClient` 用於認證相關 API (port 3001)
- `backendClient` 用於後端業務 API (port 8081)

---

## ⚠️ 注意事項

### CORS 配置
由於不再使用 rewrites 代理，後端需要正確配置 CORS：
- 允許前端域名的跨域請求
- 允許 Authorization header

### AI API Key
- ❌ 前端不再傳遞 `apiKey` 給後端
- ✅ 後端使用 `LLM_API_KEY` 環境變數

---

## ✅ 驗證

所有檔案已通過 lint 檢查，無錯誤。
