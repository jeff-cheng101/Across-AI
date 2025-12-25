# Across-AI 前端專案

## 快速開始

### 安裝依賴
```bash
npm install
```

### 環境變數設定
複製 `.env.example` 並建立 `.env.local`，設定必要的環境變數：

```bash
cp .env.example .env.local
```

**注意**：Next.js 會同時載入多個環境變數文件，優先級從高到低：
1. `.env.local` - 本地開發設定（不會被 git 追蹤，優先級最高）
2. `.env.development` / `.env.production` - 根據 `NODE_ENV` 載入
3. `.env` - 所有環境的共用設定（優先級最低）

開發環境建議使用 `.env.local` 來覆蓋預設值。

### 啟動開發伺服器
```bash
npm run dev
```

開發伺服器將在 `http://localhost:3000` 啟動。

### 其他指令
- `npm run build` - 建置生產版本
- `npm run lint` - 執行 ESLint 檢查
- `npm start` - 啟動生產伺服器（需要先 build）

## 技術棧

- **Next.js 15.5+** (App Router)
- **React 19.2+**
- **TypeScript 5+** (嚴格模式)
- **Tailwind CSS 3.4+**
- **TanStack Query** - 服務器狀態管理
- **Zod** - 數據驗證
- **Axios** - HTTP 請求庫
- **shadcn/ui** - UI 組件庫

完整技術棧請參考 `package.json`。

## 專案結構

```
frontend/
├── app/                    # Next.js App Router
│   ├── routes/            # API 路由封裝（舊代碼，逐步遷移）
│   ├── util/              # 工具函數
│   └── [pages]/           # 頁面組件
├── components/            # React 組件
├── lib/                   # 共享工具和配置
│   └── api-clients.ts     # ⭐ 統一的 API 客戶端
├── hooks/                 # 自定義 React Hooks
├── services/              # 業務邏輯服務（新 API 實作）
│   └── [feature]/        # 功能模組
│       ├── type.ts       # Zod Schema 和類型定義
│       ├── api.ts        # Fetcher 純函數
│       └── index.ts      # 統一導出
├── types/                 # TypeScript 類型定義
└── public/                # 靜態資源
```

## API 客戶端架構

### 核心原則
- **所有 API 調用必須使用 `lib/api-clients.ts` 中定義的客戶端**
- **禁止直接使用 `fetch` 或創建新的 Axios 實例**
- **禁止硬編碼任何服務 URL**

### 兩個 Axios 實例

#### `authClient` - 認證服務
- **用途**：登入、用戶管理、票據、系統設定、合約等
- **Base URL**：`${NEXT_PUBLIC_AUTH_SERVICE_URL}/api/internal`
- **錯誤處理**：自動處理 401/403，觸發登出

#### `backendClient` - 後端 API 服務
- **用途**：AI 分析、報告生成、Workflow 等
- **Base URL**：`${NEXT_PUBLIC_BACKEND_SERVICE_URL}`
- **錯誤處理**：不處理認證錯誤（由後端處理）

### 使用方式
- 認證相關 API：使用 `authClient`
- 後端業務 API：使用 `backendClient`
- 禁止直接使用 `fetch` 或創建新的 Axios 實例

## API 實作標準模式

**所有新的 API 實作必須遵循以下模式**（參考 `services/workflow/`）：

### 架構模式
1. **Zod Schema 層** (`type.ts`) - 定義輸入/輸出的驗證 schema 和 TypeScript 類型
2. **Fetcher 層** (`api.ts`) - 純函數，執行 API 請求並使用 Zod 驗證回應
3. **組件中使用 React Query** - 直接在組件中使用 `useQuery` 或 `useMutation`，不需要額外的 hooks 層

詳細實作範例請參考 `services/workflow/` 目錄。

### 重要規則
- **禁止在 `app/routes/` 新增功能**：所有新 API 必須放在 `services/` 下
- **統一使用模式**：Zod Schema → Fetcher → 組件中直接使用 React Query
- **類型安全優先**：所有 API 回應必須使用 Zod 驗證

## 環境變數

### 核心服務配置

#### Auth Service
- `NEXT_PUBLIC_AUTH_SERVICE_URL` - 認證服務 URL

#### Backend Service
- `NEXT_PUBLIC_BACKEND_SERVICE_URL` - 後端服務 URL

#### Kibana
- `NEXT_PUBLIC_KIBANA_URL` - Kibana 服務 URL
- `NEXT_PUBLIC_KIBANA_SPACE` - Kibana Space（預設：`default`）

#### Dify
- `NEXT_PUBLIC_DIFY_URL` - Dify 基礎 URL
- `NEXT_PUBLIC_DIFY_WORKFLOW_URL` - Dify Workflow iframe URL
- `NEXT_PUBLIC_KB_RAG_URL` - Dify KB/RAG iframe URL
- `NEXT_PUBLIC_DIFY_EMAIL` - Dify 登入郵箱
- `NEXT_PUBLIC_DIFY_PWD` - Dify 登入密碼

### UI 載入配置
- `NEXT_PUBLIC_LOADING_TIMEOUT` - 載入超時時間（毫秒）
- `NEXT_PUBLIC_LOADING_DELAY` - 載入延遲（毫秒）
- `NEXT_PUBLIC_IFRAME_LOADING_DELAY` - iframe 載入延遲（毫秒）

### 重要規則
- 所有環境變數必須有 `NEXT_PUBLIC_` 前綴才能在客戶端使用
- 環境變數未設定時必須拋出明確錯誤，不允許使用預設值
- AI API Key 由後端管理，前端不需要配置

完整環境變數清單請參考 `.env.example`。

## Next.js 配置

- **輸出模式**：靜態匯出（`output: 'export'`）
- **API 調用**：直接使用環境變數配置的服務 URL，不通過 Next.js proxy
- **圖片優化**：`unoptimized: true`

## 開發規範

詳細的編碼規範、命名規範、和最佳實踐請參考專案根目錄的 `.cursorrules` 文件。
