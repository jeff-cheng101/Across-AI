# 🔧 API 連接問題修復說明

## 📋 問題描述

**您遇到的錯誤：**
```
POST http://localhost:8080/api/cloudflare/analyze-waf-risks net::ERR_CONNECTION_REFUSED
```

**問題原因：**  
前端代碼中硬編碼了 `http://localhost:8080`，導致在遠端機器部署後無法正確連接到後端 API。

## ✅ 已完成的修復

我已經幫您完成以下修改：

### 1. 前端代碼修改（核心修復）

#### ✅ 修改文件：`frontend/app/ai-analysis/cloudflare/page.tsx`
- 添加環境變數支援
- 將 2 個 API 端點改為使用環境變數

#### ✅ 修改文件：`frontend/app/ai-analysis/f5/page.tsx`
- 添加環境變數支援
- 將 2 個 API 端點改為使用環境變數

**修改內容：**
```typescript
// 添加在文件頂部
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'

// 所有 API 調用從：
fetch('http://localhost:8080/api/...')

// 改為：
fetch(`${API_BASE_URL}/api/...`)
```

### 2. 輔助工具創建

#### ✅ `frontend/setup-env.sh` - 自動配置腳本
快速設置環境變數的互動式腳本

#### ✅ `verify-deployment.sh` - 部署驗證腳本
自動檢查所有配置是否正確

### 3. 文檔創建

| 文件名 | 說明 |
|--------|------|
| `QUICK_FIX_GUIDE.md` | ⚡ 快速修復指南（1分鐘解決） |
| `DEPLOYMENT_QUICK_START.md` | 🚀 完整部署步驟 |
| `API_BASE_URL_CONFIG.md` | 📖 詳細配置說明 |
| `API_CONNECTION_FIX_SUMMARY.md` | 📊 完整修復報告 |
| `修復說明_API連接問題.md` | 本文件（中文說明） |

## 🚀 您需要做的操作

### 方法一：使用自動化腳本（推薦）⭐

```bash
# 1. 進入前端目錄
cd /Users/peter/Across-AI/frontend

# 2. 運行配置腳本
./setup-env.sh
# 選擇選項 2（遠端部署）

# 3. 重新啟動前端
npm run build
npm run start
```

### 方法二：手動配置

```bash
# 1. 創建環境變數文件
cd /Users/peter/Across-AI/frontend
nano .env.local

# 2. 輸入以下內容並保存
NEXT_PUBLIC_API_BASE_URL=https://twister5poc.phison.com:3000

# 3. 重新啟動前端
npm run build
npm run start
```

### 驗證修復

```bash
cd /Users/peter/Across-AI
./verify-deployment.sh
```

## 🎯 驗證修復成功

### 在瀏覽器中檢查

1. 打開瀏覽器開發者工具（按 F12）
2. 切換到 **Network**（網路）標籤
3. 點擊前端的 **AI 分析** 功能
4. 查看請求 URL

**修復前（錯誤）：**
```
❌ http://localhost:8080/api/cloudflare/analyze-waf-risks
   狀態: Failed (ERR_CONNECTION_REFUSED)
```

**修復後（正確）：**
```
✅ https://twister5poc.phison.com:3000/api/cloudflare/analyze-waf-risks
   狀態: 200 OK
```

## 📊 修改統計

- ✅ 修改的前端文件：**2 個**
- ✅ 替換的 API 端點：**4 個**
- ✅ 創建的工具腳本：**2 個**
- ✅ 創建的文檔文件：**5 個**
- ⏱️ 預計您的操作時間：**< 2 分鐘**

## 🔍 技術細節

### 環境變數說明

**變數名稱：** `NEXT_PUBLIC_API_BASE_URL`

**為什麼要加 NEXT_PUBLIC_ 前綴？**  
這是 Next.js 的安全機制，只有以 `NEXT_PUBLIC_` 開頭的環境變數才能在瀏覽器端使用。

**配置位置：** `frontend/.env.local`

**注意事項：**
- `.env.local` 文件不會被 Git 追蹤（這是正常的安全設置）
- 修改後必須重新啟動應用才會生效
- 如果不設置，系統會使用預設值 `http://localhost:8080`

### 不同環境的配置

#### 本地開發環境
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

#### 遠端部署環境（您目前需要的）
```bash
NEXT_PUBLIC_API_BASE_URL=https://twister5poc.phison.com:3000
```

## ⚙️ 後端配置建議

### 選項一：使用反向代理（推薦）✨

後端繼續監聽 8080 端口，使用 nginx 轉發到 3000：

```nginx
server {
    listen 3000 ssl;
    server_name twister5poc.phison.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location /api/ {
        proxy_pass http://localhost:8080/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 選項二：後端直接監聽 3000 端口

修改 `backend/index.js` 第 1559 行：
```javascript
// 從：
const port = 8080;

// 改為：
const port = process.env.PORT || 3000;
```

## 🛡️ 安全建議

### CORS 配置

當前後端允許所有來源訪問。在生產環境建議限制為特定域名：

修改 `backend/index.js`：
```javascript
// 找到這一行：
app.use(cors());

// 改為：
app.use(cors({
  origin: [
    'http://localhost:3000',  // 本地開發
    'https://twister5poc.phison.com',  // 生產環境
    'https://twister5poc.phison.com:3000'
  ],
  credentials: true
}));
```

## ❓ 常見問題

### Q1: 修改 .env.local 後沒有生效？

**解決方案：**
```bash
# 完全停止應用（Ctrl+C）
# 清除構建緩存
cd /Users/peter/Across-AI/frontend
rm -rf .next
# 重新構建和啟動
npm run build
npm run start
```

### Q2: 仍然看到 localhost 錯誤？

**檢查清單：**
- [ ] `.env.local` 是否在 `frontend/` 目錄下？
- [ ] 變數名稱是否正確（`NEXT_PUBLIC_API_BASE_URL`）？
- [ ] 是否已重新啟動前端應用？
- [ ] 瀏覽器緩存是否已清除（Ctrl+Shift+Delete）？

### Q3: 連接超時或無法訪問？

**檢查清單：**
- [ ] 後端服務是否正在運行？ `ps aux | grep node`
- [ ] 防火牆是否開放了 3000 端口？
- [ ] HTTPS 證書是否配置正確？
- [ ] DNS 解析是否正常？ `ping twister5poc.phison.com`

### Q4: 出現 CORS 錯誤？

查看上面的「安全建議 → CORS 配置」章節。

## 📞 獲取幫助

### 快速診斷
```bash
cd /Users/peter/Across-AI
./verify-deployment.sh
```

### 查看詳細文檔
```bash
# 快速修復（英文）
cat QUICK_FIX_GUIDE.md

# 完整配置說明（英文）
cat API_BASE_URL_CONFIG.md

# 部署步驟（英文）
cat DEPLOYMENT_QUICK_START.md
```

## ✨ 總結

### 修復前
```
前端頁面 → http://localhost:8080/api/... 
           ❌ ERR_CONNECTION_REFUSED
```

### 修復後
```
前端頁面 → 環境變數 (NEXT_PUBLIC_API_BASE_URL) 
        → https://twister5poc.phison.com:3000/api/...
        → ✅ 成功連接
```

### 核心改變
將硬編碼的 API URL 改為可配置的環境變數，支援不同環境的靈活部署。

---

**修復完成時間：** 2025-11-20  
**預計您的操作時間：** < 2 分鐘  
**狀態：** ✅ 代碼已修改完成，等待您配置環境變數並重啟應用

## 🎉 下一步

1. ✅ 運行 `frontend/setup-env.sh` 配置環境變數
2. ✅ 重新啟動前端應用
3. ✅ 運行 `verify-deployment.sh` 驗證配置
4. ✅ 在瀏覽器中測試 AI 分析功能

祝您部署順利！如有任何問題，請參考上述文檔或運行驗證腳本。



