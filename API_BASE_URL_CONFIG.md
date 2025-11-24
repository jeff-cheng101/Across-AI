# API 基礎 URL 配置說明

## 問題背景
在遠端機器部署時，前端頁面點選 AI 分析出現連接錯誤：
```
POST http://localhost:8080/api/cloudflare/analyze-waf-risks net::ERR_CONNECTION_REFUSED
```

## 解決方案
已將硬編碼的 API URL 改為使用環境變數配置。

## 配置步驟

### 1. 在前端專案根目錄創建 `.env.local` 文件

在 `/Users/peter/Across-AI/frontend/` 目錄下創建 `.env.local` 文件：

```bash
cd /Users/peter/Across-AI/frontend/
touch .env.local
```

### 2. 編輯 `.env.local` 文件，添加以下內容

```bash
# API 基礎 URL 配置
NEXT_PUBLIC_API_BASE_URL=https://twister5poc.phison.com:3000
```

### 3. 重新啟動前端應用

```bash
# 停止當前運行的前端應用（如果有）
# 然後重新啟動

cd /Users/peter/Across-AI/frontend/
npm run dev
# 或者在生產環境
npm run build
npm run start
```

## 修改的文件

### 1. `frontend/app/ai-analysis/cloudflare/page.tsx`
- 添加了 `API_BASE_URL` 常量，從環境變數讀取
- 替換了 2 個 API 端點：
  - `/api/cloudflare/analyze-waf-risks`
  - `/api/cloudflare/get-operation-guide`

### 2. `frontend/app/ai-analysis/f5/page.tsx`
- 添加了 `API_BASE_URL` 常量，從環境變數讀取
- 替換了 2 個 API 端點：
  - `/api/f5/analyze-waf-risks`
  - `/api/f5/get-operation-guide`

## 不同環境配置

### 本地開發環境
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

### 遠端部署環境
```bash
NEXT_PUBLIC_API_BASE_URL=https://twister5poc.phison.com:3000
```

## 注意事項

1. **`.env.local` 文件不會被 Git 追蹤**，這是正常的安全設置
2. **環境變數必須以 `NEXT_PUBLIC_` 開頭** 才能在瀏覽器端使用
3. **修改環境變數後必須重新啟動應用** 才會生效
4. **如果不設置環境變數**，系統會使用預設值 `http://localhost:8080`

## 驗證配置

配置完成後，打開瀏覽器開發者工具的 Network 標籤，查看 API 請求是否正確指向：
```
https://twister5poc.phison.com:3000/api/cloudflare/analyze-waf-risks
```

而不是：
```
http://localhost:8080/api/cloudflare/analyze-waf-risks
```

## 後端配置確認

### 後端端口配置

**重要：** 請確認您的部署架構！

#### 情況 1：後端直接監聽 3000 端口

如果您希望後端直接在 3000 端口運行，需要修改後端配置：

```bash
# 編輯 backend/index.js
# 找到第 1559 行：
const port = 8080;

# 改為：
const port = process.env.PORT || 3000;
```

然後在後端創建 `.env` 文件：
```bash
PORT=3000
```

#### 情況 2：使用反向代理（推薦）

如果使用 nginx 等反向代理，後端可以繼續使用 8080 端口，由反向代理轉發：

**Nginx 配置範例：**
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

### CORS 配置

當前後端使用 `app.use(cors())` 允許所有來源。在生產環境中，建議限制為特定域名：

```javascript
// backend/index.js
app.use(cors({
  origin: [
    'http://localhost:3000',  // 本地開發
    'https://twister5poc.phison.com',  // 生產環境
    'https://twister5poc.phison.com:3000'  // 如果前端使用特定端口
  ],
  credentials: true
}));
```

### 檢查清單

請確保：
1. ✅ HTTPS 證書配置正確
2. ✅ CORS 設置允許前端域名訪問
3. ✅ 防火牆開放了 3000 端口（或反向代理端口）
4. ✅ 後端服務正在運行
5. ✅ 前端 `.env.local` 配置正確

