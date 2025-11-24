# 遠端部署快速啟動指南

## 🚀 快速解決 API 連接問題

### 第一步：配置前端環境變數

在前端目錄創建 `.env.local` 文件：

```bash
cd /Users/peter/Across-AI/frontend/
nano .env.local
```

輸入以下內容：
```bash
NEXT_PUBLIC_API_BASE_URL=https://twister5poc.phison.com:3000
```

保存並退出（Ctrl+X, Y, Enter）。

### 第二步：重新啟動前端應用

```bash
# 停止當前運行的前端（Ctrl+C）
# 重新構建並啟動
npm run build
npm run start
```

### 第三步：確認後端運行

```bash
cd /Users/peter/Across-AI/backend/
node index.js
```

確保看到：
```
📊 DDoS 攻擊圖表分析系統已就緒
🚀 Server running on port 8080
```

### 第四步：測試 API 連接

在瀏覽器中打開開發者工具（F12），前往 Network 標籤，點擊 AI 分析功能。

**修復前的錯誤：**
```
POST http://localhost:8080/api/cloudflare/analyze-waf-risks 
❌ net::ERR_CONNECTION_REFUSED
```

**修復後的正確請求：**
```
POST https://twister5poc.phison.com:3000/api/cloudflare/analyze-waf-risks 
✅ Status: 200 OK
```

## 🔧 可能的問題與解決方案

### 問題 1：仍然顯示 localhost

**原因：** 環境變數未生效

**解決：**
1. 確認 `.env.local` 文件在 `frontend/` 目錄下
2. 完全停止並重新啟動前端應用
3. 清除瀏覽器緩存（Ctrl+Shift+Delete）

### 問題 2：連接超時或 SSL 錯誤

**原因：** HTTPS 證書或後端配置問題

**解決：**
```bash
# 檢查後端是否運行
curl http://localhost:8080/api/health

# 檢查反向代理配置（如果使用）
sudo nginx -t
sudo systemctl restart nginx
```

### 問題 3：CORS 錯誤

**錯誤訊息：**
```
Access to fetch at 'https://...' from origin '...' has been blocked by CORS policy
```

**解決：** 修改 `backend/index.js`

```javascript
// 找到這一行：
app.use(cors());

// 改為：
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://twister5poc.phison.com',
    'https://twister5poc.phison.com:3000'
  ],
  credentials: true
}));
```

## 📋 完整部署架構

```
瀏覽器
  ↓
https://twister5poc.phison.com:3000 (前端 Next.js)
  ↓ API 請求 (NEXT_PUBLIC_API_BASE_URL)
  ↓
https://twister5poc.phison.com:3000/api/ (反向代理 nginx)
  ↓
http://localhost:8080/api/ (後端 Express)
  ↓
Elasticsearch (10.168.10.250:9200)
```

## 🎯 驗證部署成功

運行以下檢查：

```bash
# 1. 檢查前端環境變數
cd /Users/peter/Across-AI/frontend/
cat .env.local
# 應該看到：NEXT_PUBLIC_API_BASE_URL=https://twister5poc.phison.com:3000

# 2. 檢查後端運行
ps aux | grep "node.*index.js"

# 3. 測試 API 端點
curl -X POST https://twister5poc.phison.com:3000/api/cloudflare/analyze-waf-risks \
  -H "Content-Type: application/json" \
  -d '{"aiProvider":"gemini","apiKey":"test","model":"gemini-2.5-flash","timeRange":"1h"}'
```

## 📝 修改的文件清單

✅ `frontend/app/ai-analysis/cloudflare/page.tsx`
- 添加 API_BASE_URL 環境變數支援
- 替換 2 個硬編碼的 API 端點

✅ `frontend/app/ai-analysis/f5/page.tsx`
- 添加 API_BASE_URL 環境變數支援
- 替換 2 個硬編碼的 API 端點

📄 需要手動創建：
- `frontend/.env.local`（包含 NEXT_PUBLIC_API_BASE_URL）

## 💡 提示

- `.env.local` 文件不會被 Git 追蹤（這是正常的安全設置）
- 每次修改 `.env.local` 後都需要重新啟動應用
- 可以在不同環境使用不同的 URL（開發/測試/生產）



