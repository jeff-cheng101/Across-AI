# `.env.example` 更新檢查報告

## ✅ 已添加的環境變數

1. ✅ `NEXT_PUBLIC_DIFY_EMAIL` - Dify 登入 Email
2. ✅ `NEXT_PUBLIC_DIFY_PWD` - Dify 登入密碼
3. ✅ `NEXT_PUBLIC_AUTH_SERVICE_URL` - 認證服務 URL（新增）
4. ✅ `NEXT_PUBLIC_LLM_SERVICE_URL` - LLM 服務 URL（新增）

## ❌ 發現的問題

### 1. 🔴 安全問題：真實憑證不應該在 `.env.example` 中

```bash
# ❌ 不應該有真實憑證
NEXT_PUBLIC_DIFY_EMAIL=twister5@gmail.com
NEXT_PUBLIC_DIFY_PWD=twister%&*4718
```

**建議改為：**
```bash
NEXT_PUBLIC_DIFY_EMAIL=your-dify-email@example.com
NEXT_PUBLIC_DIFY_PWD=your-dify-password
```

### 2. ❌ 缺少必需的環境變數

**`NEXT_PUBLIC_DIFY_WORKFLOW_URL`**
- **使用位置：** `app/dify/page.tsx:11`
- **目前狀態：** 有 hardcode fallback，但應該在 .env.example 中
- **建議值：** `https://twister5poc.phison.com/app/4a730717-1563-4359-8036-49ed3d452482/workflow`

**`NEXT_PUBLIC_KB_RAG_URL`**
- **使用位置：** `app/kb-rag/page.tsx:18`
- **目前狀態：** 有 hardcode fallback，但應該在 .env.example 中
- **建議值：** `https://twister5poc.phison.com/datasets`

### 3. ⚠️ 語法錯誤

**第 11 行：**
```bash
NEXT_PUBLIC_INITIAL_LOADING_DELAY=2000%  # ❌ 多餘的 % 符號
```

**應該改為：**
```bash
NEXT_PUBLIC_INITIAL_LOADING_DELAY=2000
```

### 4. ❓ 新增環境變數未在程式碼中使用

**`NEXT_PUBLIC_AUTH_SERVICE_URL`** 和 **`NEXT_PUBLIC_LLM_SERVICE_URL`**
- 目前沒有在程式碼中找到使用
- 如果未來會使用，建議保留
- 如果不會使用，建議移除

---

## 📋 建議的完整 `.env.example`

```bash
NODE_ENV=production

# ============================================
# API 服務配置
# ============================================
# Internal Service (與資料庫相連的服務)
NEXT_PUBLIC_API_URL=https://twister5poc.phison.com:3001/api/internal

# 其他 API 基礎 URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:8081

# ============================================
# ELK/Kibana 配置
# ============================================
NEXT_PUBLIC_KIBANA_HOST=twister5.phison.com:5601
NEXT_PUBLIC_KIBANA_PROTOCOL=https
NEXT_PUBLIC_KIBANA_SPACE=default

# ============================================
# UI 載入配置（單位：毫秒）
# ============================================
NEXT_PUBLIC_LOADING_TIMEOUT=20000
NEXT_PUBLIC_LOADING_DELAY=1500
NEXT_PUBLIC_INITIAL_LOADING_DELAY=2000

# ============================================
# Dify 配置
# ============================================
# Dify Workflow URL
NEXT_PUBLIC_DIFY_WORKFLOW_URL=https://twister5poc.phison.com/app/4a730717-1563-4359-8036-49ed3d452482/workflow

# Dify KB/RAG URL
NEXT_PUBLIC_DIFY_KB_RAG_URL=https://twister5poc.phison.com/datasets

# Dify 登入憑證（用於自動登入）
NEXT_PUBLIC_DIFY_EMAIL=your-dify-email@example.com
NEXT_PUBLIC_DIFY_PWD=your-dify-password

# ============================================
# 其他服務 URL（如果需要的話）
# ============================================
NEXT_PUBLIC_AUTH_SERVICE_URL=
NEXT_PUBLIC_LLM_SERVICE_URL=http://localhost:8081
```

---

## ✅ 檢查清單

- [ ] 移除真實憑證，改用 placeholder
- [ ] 修正第 11 行的 `%` 符號
- [ ] 添加 `NEXT_PUBLIC_DIFY_WORKFLOW_URL`
- [ ] 添加 `NEXT_PUBLIC_DIFY_KB_RAG_URL`（或 `NEXT_PUBLIC_KB_RAG_URL`）
- [ ] 確認 `NEXT_PUBLIC_AUTH_SERVICE_URL` 和 `NEXT_PUBLIC_LLM_SERVICE_URL` 是否需要
- [ ] 統一命名（建議使用 `NEXT_PUBLIC_DIFY_KB_RAG_URL` 而非 `NEXT_PUBLIC_KB_RAG_URL`）

---

## 📝 總結

**當前狀態：** 已添加 Dify 相關環境變數，但仍有改進空間

**優先修正：**
1. 🔴 **移除真實憑證**（安全問題）
2. 🔴 **修正語法錯誤**（第 11 行）
3. 🟡 **添加缺少的環境變數**（Dify Workflow URL, KB/RAG URL）

