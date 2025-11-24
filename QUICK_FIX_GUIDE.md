# ⚡ 快速修復指南

## 🎯 一分鐘快速修復

如果您看到這個錯誤：
```
POST http://localhost:8080/api/cloudflare/analyze-waf-risks net::ERR_CONNECTION_REFUSED
```

請按照以下 3 個步驟操作：

### 步驟 1：配置環境變數（30秒）

```bash
cd /Users/peter/Across-AI/frontend
./setup-env.sh
# 選擇選項 2（遠端部署）
```

或者手動創建：
```bash
echo "NEXT_PUBLIC_API_BASE_URL=https://twister5poc.phison.com:3000" > .env.local
```

### 步驟 2：重啟前端（20秒）

```bash
# 停止當前運行的前端（Ctrl+C）
npm run build && npm run start
```

### 步驟 3：驗證修復（10秒）

```bash
cd /Users/peter/Across-AI
./verify-deployment.sh
```

## ✅ 驗證成功標誌

在瀏覽器開發者工具（F12）的 Network 標籤中，應該看到：

```
✅ https://twister5poc.phison.com:3000/api/cloudflare/analyze-waf-risks
   Status: 200 OK
```

而不是：

```
❌ http://localhost:8080/api/cloudflare/analyze-waf-risks
   Status: Failed (ERR_CONNECTION_REFUSED)
```

## 🔧 故障排除

### 問題：仍然顯示 localhost
**解決方案：**
```bash
# 清除構建緩存
cd /Users/peter/Across-AI/frontend
rm -rf .next
npm run build
npm run start
```

### 問題：連接超時
**檢查清單：**
- [ ] 後端是否正在運行？ `ps aux | grep "node.*index"`
- [ ] 防火牆是否開放 3000 端口？
- [ ] DNS 是否正確解析？ `ping twister5poc.phison.com`

### 問題：CORS 錯誤
**解決方案：**
修改 `backend/index.js`，添加 CORS 配置：
```javascript
app.use(cors({
  origin: ['https://twister5poc.phison.com:3000'],
  credentials: true
}));
```

## 📚 詳細文檔

- 完整修復報告：`API_CONNECTION_FIX_SUMMARY.md`
- 詳細配置說明：`API_BASE_URL_CONFIG.md`
- 部署指南：`DEPLOYMENT_QUICK_START.md`

## 🆘 需要幫助？

運行驗證腳本查看詳細狀態：
```bash
./verify-deployment.sh
```

---
**最後更新：** 2025-11-20  
**預計修復時間：** < 2 分鐘



