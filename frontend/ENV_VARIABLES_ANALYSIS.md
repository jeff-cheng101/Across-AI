# 環境變數需求分析報告

## 📊 當前狀態

### ✅ `.env.example` 已有的環境變數

| 環境變數 | 用途 | 使用位置 |
|---------|------|---------|
| `NEXT_PUBLIC_API_URL` | Internal Service API URL | `app/routes/request.ts` |
| `NEXT_PUBLIC_API_BASE_URL` | 其他 API 基礎 URL | `hooks/use-report-download.ts`, `app/ai-analysis/*/page.tsx` |
| `NEXT_PUBLIC_KIBANA_HOST` | Kibana 主機 | `components/multi-kibana-dashboard.tsx` |
| `NEXT_PUBLIC_KIBANA_PROTOCOL` | Kibana 協議 | `components/multi-kibana-dashboard.tsx` |
| `NEXT_PUBLIC_KIBANA_SPACE` | Kibana Space | `components/multi-kibana-dashboard.tsx` |
| `NEXT_PUBLIC_LOADING_TIMEOUT` | 載入超時時間 | `components/multi-kibana-dashboard.tsx` |
| `NEXT_PUBLIC_LOADING_DELAY` | 載入延遲時間 | `components/multi-kibana-dashboard.tsx` |
| `NEXT_PUBLIC_INITIAL_LOADING_DELAY` | 初始載入延遲 | `components/multi-kibana-dashboard.tsx` |

### ❌ `.env.example` 缺少的環境變數

| 環境變數 | 用途 | 使用位置 | 重要性 |
|---------|------|---------|--------|
| `NEXT_PUBLIC_DIFY_WORKFLOW_URL` | Dify Workflow URL | `app/dify/page.tsx:11` | 🔴 高 |
| `NEXT_PUBLIC_DIFY_EMAIL` | Dify 登入 Email | `app/page.tsx:37` | 🔴 高 |
| `NEXT_PUBLIC_DIFY_PWD` | Dify 登入密碼 | `app/page.tsx:38` | 🔴 高 |
| `NEXT_PUBLIC_KB_RAG_URL` | KB/RAG URL | `app/kb-rag/page.tsx:18` | 🟡 中 |
| `NEXT_PUBLIC_DIFY_WORKFLOW_TOKEN` | Dify Workflow Token | `components/embedded-iframe.tsx` (推測) | 🟢 低 |
| `NEXT_PUBLIC_KB_RAG_TOKEN` | KB/RAG Token | `components/embedded-iframe.tsx` (推測) | 🟢 低 |
| `NEXT_PUBLIC_DIFY_CONSOLE_API_URL` | Dify Console API URL | `app/page.tsx:52` (目前 hardcode) | 🟡 中 |

---

## 🔍 詳細分析

### 1. Dify 相關環境變數

#### 缺少的環境變數：

**`NEXT_PUBLIC_DIFY_WORKFLOW_URL`**
- **使用位置：** `app/dify/page.tsx:11`
- **目前狀態：** 有 hardcode fallback
- **建議值：** `https://twister5poc.phison.com/app/4a730717-1563-4359-8036-49ed3d452482/workflow`

**`NEXT_PUBLIC_DIFY_EMAIL`**
- **使用位置：** `app/page.tsx:37`
- **目前狀態：** 必須設定，否則功能無法使用
- **建議值：** `your-dify-email@example.com`

**`NEXT_PUBLIC_DIFY_PWD`**
- **使用位置：** `app/page.tsx:38`
- **目前狀態：** 必須設定，否則功能無法使用
- **建議值：** `your-dify-password`

**`NEXT_PUBLIC_KB_RAG_URL`**
- **使用位置：** `app/kb-rag/page.tsx:18`
- **目前狀態：** 有 hardcode fallback
- **建議值：** `https://twister5poc.phison.com/datasets`

**`NEXT_PUBLIC_DIFY_CONSOLE_API_URL`**
- **使用位置：** `app/page.tsx:52` (目前 hardcode)
- **目前狀態：** ⚠️ Hardcode: `https://twister5poc.phison.com/dify/console/api/login`
- **建議值：** `https://twister5poc.phison.com/dify/console/api`

#### 可選的環境變數：

**`NEXT_PUBLIC_DIFY_WORKFLOW_TOKEN`**
- **使用位置：** `components/embedded-iframe.tsx` (透過 `envPrefix="DIFY_WORKFLOW"`)
- **用途：** Dify Workflow iframe 認證 Token
- **目前狀態：** 可選，用於 URL query parameter

**`NEXT_PUBLIC_KB_RAG_TOKEN`**
- **使用位置：** `components/embedded-iframe.tsx` (透過 `envPrefix="KB_RAG"`)
- **用途：** KB/RAG iframe 認證 Token
- **目前狀態：** 可選，用於 URL query parameter

---

### 2. Next.js Rewrites 配置

**問題：** `next.config.mjs` 中的 rewrites 全部 hardcode

**目前狀態：**
```javascript
destination: 'http://localhost:8081/api/cloudflare/:path*'
destination: 'http://localhost:3001/api/:path*'
```

**建議：** 
- 開發環境：保持 hardcode（因為是本地開發）
- 生產環境：應該不需要 rewrites（直接使用相對路徑）

**結論：** Next.js rewrites 不需要環境變數（僅用於開發環境）

---

### 3. 環境變數命名問題

**發現的不一致：**
- `NEXT_PUBLIC_API_URL` vs `NEXT_PUBLIC_API_BASE_URL` - 兩個不同的用途
- `NEXT_PUBLIC_DIFY_WORKFLOW_URL` vs `NEXT_PUBLIC_KB_RAG_URL` - 應該統一命名

**建議統一命名：**
- `NEXT_PUBLIC_API_INTERNAL_URL` - Internal Service
- `NEXT_PUBLIC_API_BASE_URL` - 其他 API
- `NEXT_PUBLIC_DIFY_BASE_URL` - Dify 基礎 URL
- `NEXT_PUBLIC_DIFY_WORKFLOW_URL` - Dify Workflow
- `NEXT_PUBLIC_DIFY_KB_RAG_URL` - Dify KB/RAG

---

## ✅ 建議的完整 `.env.example`

```bash
# ============================================
# 環境設定
# ============================================
NODE_ENV=production

# ============================================
# API 服務配置
# ============================================
# Internal Service (與資料庫相連的服務)
NEXT_PUBLIC_API_INTERNAL_URL=https://path/to/your/service/api/internal

# 其他 API 基礎 URL
NEXT_PUBLIC_API_BASE_URL=https://path/to/your/service/base

# ============================================
# Dify 配置
# ============================================
# Dify 基礎 URL (用於 Console API)
NEXT_PUBLIC_DIFY_BASE_URL=https://twister5poc.phison.com/dify

# Dify Workflow URL
NEXT_PUBLIC_DIFY_WORKFLOW_URL=https://twister5poc.phison.com/app/4a730717-1563-4359-8036-49ed3d452482/workflow

# Dify KB/RAG URL
NEXT_PUBLIC_DIFY_KB_RAG_URL=https://twister5poc.phison.com/datasets

# Dify 登入憑證（用於自動登入）
NEXT_PUBLIC_DIFY_EMAIL=your-dify-email@example.com
NEXT_PUBLIC_DIFY_PWD=your-dify-password

# Dify Token（可選，用於 iframe 認證）
NEXT_PUBLIC_DIFY_WORKFLOW_TOKEN=
NEXT_PUBLIC_DIFY_KB_RAG_TOKEN=

# ============================================
# ELK/Kibana 配置
# ============================================
NEXT_PUBLIC_KIBANA_HOST=path/to/kibana
NEXT_PUBLIC_KIBANA_PROTOCOL=https
NEXT_PUBLIC_KIBANA_SPACE=default

# ============================================
# UI 載入配置 (單位: 毫秒)
# ============================================
NEXT_PUBLIC_LOADING_TIMEOUT=20000
NEXT_PUBLIC_LOADING_DELAY=1500
NEXT_PUBLIC_INITIAL_LOADING_DELAY=2000
```

---

## 📋 總結

### ❌ 當前 `.env.example` 無法滿足需求

**缺少的關鍵環境變數：**
1. 🔴 **Dify 相關** - 3 個必須的環境變數
2. 🟡 **KB/RAG URL** - 1 個環境變數
3. 🟡 **Dify Console API URL** - 1 個環境變數（目前 hardcode）

**需要修正的問題：**
1. 環境變數命名不一致
2. 缺少 Dify 相關配置
3. 缺少 KB/RAG 配置

### ✅ 建議行動

1. **立即補充** Dify 相關環境變數（高優先級）
2. **統一命名** 環境變數（中優先級）
3. **移除 hardcode** Dify Console API URL（中優先級）
4. **補充可選** Token 環境變數（低優先級）

