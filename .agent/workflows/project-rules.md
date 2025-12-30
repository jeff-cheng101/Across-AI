---
description: 專案開發規範與指引
---

# Across-AI 專案規則

> **注意**：本文檔主要涵蓋前端開發規範。後端規範請參考 `backend/README.md`。

## 前端技術棧

### 核心框架
- **Next.js 15.5+** (App Router)
- **React 19.2+**
- **TypeScript 5+** (嚴格模式)
- **Tailwind CSS 3.4+**

### UI 組件庫
- **Radix UI** - 無障礙 UI 組件
- **shadcn/ui** - 基於 Radix UI 的組件系統
- **Lucide React** - 圖標庫
- **Framer Motion** - 動畫庫

### 狀態管理與數據獲取
- **TanStack Query (React Query) 5.90+** - 服務器狀態管理
- **RxJS 7.8+** - 響應式編程（用於認證狀態）
- **React Hook Form** - 表單管理
- **Zod 3.24+** - 數據驗證

---

## API 客戶端架構

### 核心原則
- **所有 API 調用必須使用 `lib/api-clients.ts` 中定義的客戶端**
- **統一使用 `authClient` 或 `backendClient`，不直接使用 `fetch`**
- **所有服務 URL 必須通過環境變數配置**

### 兩個 Axios 實例

| 實例 | 用途 | Base URL |
|------|------|----------|
| `authClient` | 認證、用戶管理 | `/api/auth` |
| `backendClient` | AI 分析、報告 | `/api/backend` |

---

## API 實作標準模式

### 三層架構模式
所有新的 API 實作必須遵循以下模式：

1. **Zod Schema 層** (`services/[feature]/type.ts`)
   - 使用 Zod 定義所有請求/回應的 schema
   - 使用 `z.infer` 導出 TypeScript 類型

2. **Fetcher 層** (`services/[feature]/api.ts`)
   - 使用 `authClient` 或 `backendClient` 執行 API 請求
   - 使用 Zod schema 驗證回應

3. **組件中直接使用 React Query**
   - 使用 `useQuery` 處理 GET 請求
   - 使用 `useMutation` 處理 POST/PUT/DELETE 請求

---

## 編碼規範

### TypeScript
- 使用嚴格模式
- 優先使用 `type` 而非 `interface`
- 優先使用 `unknown` 或具體類型，而非 `any`
- 優先使用類型守衛或 Zod 驗證，而非 `as` 類型斷言

### 命名規範
- 組件：PascalCase（如 `UserProfile.tsx`）
- 函數/變數：camelCase（如 `getUserData`）
- 常數：UPPER_SNAKE_CASE（如 `HTTP_STATUS`）

### 註解
- **所有註解使用繁體中文**
- **函數必須有 JSDoc 註解**

---

## AI 助手要求

### 回應語言
- **所有回應使用繁體中文**
- **代碼註解使用繁體中文**

### 代碼生成原則
1. **KISS** - 保持代碼簡單、直接
2. **三次原則** - 第三次重複時才進行抽象
3. 遵循專案的 Biome 配置
