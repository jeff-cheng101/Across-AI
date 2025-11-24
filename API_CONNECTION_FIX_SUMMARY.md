# API 連接錯誤修復總結

## 📋 問題描述

**錯誤訊息：**
```
POST http://localhost:8080/api/cloudflare/analyze-waf-risks net::ERR_CONNECTION_REFUSED
```

**原因：**
前端代碼中硬編碼了 `http://localhost:8080`，導致在遠端部署時無法正確連接到後端 API。

## ✅ 解決方案

將硬編碼的 API URL 改為使用環境變數配置，支援不同環境的靈活切換。

## 🔧 修改內容

### 1. 前端代碼修改

#### 修改文件 1: `frontend/app/ai-analysis/cloudflare/page.tsx`

**變更位置：**
- 第 14-15 行：添加 API_BASE_URL 常量
- 第 93 行：修改 `/api/cloudflare/analyze-waf-risks` 端點
- 第 415 行：修改 `/api/cloudflare/get-operation-guide` 端點

**修改前：**
```typescript
const response = await fetch('http://localhost:8080/api/cloudflare/analyze-waf-risks', {
```

**修改後：**
```typescript
// 在文件頂部添加
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'

// 在 fetch 調用中使用
const response = await fetch(`${API_BASE_URL}/api/cloudflare/analyze-waf-risks`, {
```

#### 修改文件 2: `frontend/app/ai-analysis/f5/page.tsx`

**變更位置：**
- 第 26-27 行：添加 API_BASE_URL 常量
- 第 220 行：修改 `/api/f5/analyze-waf-risks` 端點
- 第 519 行：修改 `/api/f5/get-operation-guide` 端點

**修改內容：** 同上

### 2. 配置文件創建

#### 創建文件: `frontend/setup-env.sh`

自動化配置腳本，幫助快速設置環境變數。

**使用方法：**
```bash
cd /Users/peter/Across-AI/frontend/
./setup-env.sh
```

### 3. 文檔創建

- ✅ `API_BASE_URL_CONFIG.md` - 詳細配置說明
- ✅ `DEPLOYMENT_QUICK_START.md` - 快速部署指南
- ✅ `API_CONNECTION_FIX_SUMMARY.md` - 本文件

## 🚀 使用步驟

### 快速部署（推薦）

```bash
# 1. 進入前端目錄
cd /Users/peter/Across-AI/frontend/

# 2. 運行配置腳本
./setup-env.sh
# 選擇選項 2（遠端部署）

# 3. 重新啟動前端
npm run build
npm run start
```

### 手動配置

```bash
# 1. 創建環境變數文件
cd /Users/peter/Across-AI/frontend/
nano .env.local

# 2. 輸入以下內容
NEXT_PUBLIC_API_BASE_URL=https://twister5poc.phison.com:3000

# 3. 保存並重新啟動
npm run build
npm run start
```

## 📊 修改統計

| 項目 | 數量 |
|------|------|
| 修改的文件 | 2 個 |
| 替換的 API 端點 | 4 個 |
| 創建的文檔 | 3 個 |
| 創建的腳本 | 1 個 |

## 🔍 影響範圍

### 修改的功能
- ✅ Cloudflare AI 風險分析
- ✅ Cloudflare 操作指引獲取
- ✅ F5 AI 風險分析
- ✅ F5 操作指引獲取

### 未修改的部分
- ✅ 其他 API 端點（如有需要後續可以統一處理）
- ✅ 後端代碼（保持不變）
- ✅ 數據庫配置（保持不變）

## ⚙️ 環境變數配置

### 本地開發環境
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

### 遠端部署環境
```bash
NEXT_PUBLIC_API_BASE_URL=https://twister5poc.phison.com:3000
```

### 自定義環境
```bash
NEXT_PUBLIC_API_BASE_URL=你的自定義URL
```

## 🧪 測試驗證

### 1. 檢查環境變數
```bash
cd /Users/peter/Across-AI/frontend/
cat .env.local
```

預期輸出：
```
NEXT_PUBLIC_API_BASE_URL=https://twister5poc.phison.com:3000
```

### 2. 瀏覽器開發者工具測試

1. 打開瀏覽器開發者工具（F12）
2. 切換到 Network 標籤
3. 點擊前端的 AI 分析功能
4. 檢查請求 URL

**修復前：**
```
❌ http://localhost:8080/api/cloudflare/analyze-waf-risks
   Status: Failed (ERR_CONNECTION_REFUSED)
```

**修復後：**
```
✅ https://twister5poc.phison.com:3000/api/cloudflare/analyze-waf-risks
   Status: 200 OK
```

### 3. API 端點測試
```bash
curl -X POST https://twister5poc.phison.com:3000/api/cloudflare/analyze-waf-risks \
  -H "Content-Type: application/json" \
  -d '{
    "aiProvider": "gemini",
    "apiKey": "YOUR_API_KEY",
    "model": "gemini-2.5-flash",
    "timeRange": "1h"
  }'
```

## 🔐 安全注意事項

1. **`.env.local` 不會被 Git 追蹤**
   - 這是 Next.js 的默認安全設置
   - 每個環境需要單獨配置

2. **環境變數命名規則**
   - 瀏覽器端使用的環境變數必須以 `NEXT_PUBLIC_` 開頭
   - 這是 Next.js 的安全機制

3. **生產環境 CORS 配置**
   - 建議在後端限制允許的來源域名
   - 參考 `API_BASE_URL_CONFIG.md` 中的 CORS 配置

## 📝 後續建議

### 高優先級
1. ✅ 配置 HTTPS 證書（如果還沒有）
2. ✅ 設置反向代理（nginx 或 Apache）
3. ✅ 配置防火牆規則

### 中優先級
4. ⭕ 統一其他 API 端點也使用環境變數
5. ⭕ 添加 API 健康檢查端點
6. ⭕ 設置生產環境的 CORS 白名單

### 低優先級
7. ⭕ 添加 API 請求重試機制
8. ⭕ 實施 API 速率限制
9. ⭕ 添加請求日誌記錄

## 💡 常見問題

### Q1: 修改 .env.local 後沒有生效？
**A:** 需要完全重新啟動應用：
```bash
# 停止當前進程（Ctrl+C）
# 清除構建緩存
rm -rf .next
# 重新構建
npm run build
npm run start
```

### Q2: 仍然看到 localhost 錯誤？
**A:** 檢查以下幾點：
1. `.env.local` 是否在正確的目錄（`frontend/`）
2. 變數名稱是否正確（`NEXT_PUBLIC_API_BASE_URL`）
3. 瀏覽器緩存是否清除（Ctrl+Shift+Delete）
4. 應用是否完全重新啟動

### Q3: 後端應該監聽哪個端口？
**A:** 兩種方案：
- **方案 1：** 後端監聽 8080，使用 nginx 反向代理到 3000（推薦）
- **方案 2：** 後端直接監聽 3000

### Q4: 如何在不同環境切換？
**A:** 使用 `setup-env.sh` 腳本快速切換，或手動編輯 `.env.local`

## 📞 技術支援

如有問題，請參考以下文檔：
- 詳細配置：`API_BASE_URL_CONFIG.md`
- 快速部署：`DEPLOYMENT_QUICK_START.md`
- Next.js 環境變數：https://nextjs.org/docs/basic-features/environment-variables

---

**修復完成日期：** 2025-11-20  
**版本：** 1.0.0  
**狀態：** ✅ 已完成並測試

