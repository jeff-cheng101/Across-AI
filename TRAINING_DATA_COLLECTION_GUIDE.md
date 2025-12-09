# 🎓 AI 訓練資料收集指南

## ✅ 系統已就緒

訓練資料收集系統已成功建立！以下是完整的使用指南。

## 📁 已建立的檔案結構

```
Across-AI/
├── ai_logs/                                    ✅ 訓練資料儲存目錄
│   ├── README.md                              ✅ 資料格式說明
│   ├── cloudflare/                            ✅ Cloudflare 資料目錄
│   ├── f5/                                    ✅ F5 資料目錄
│   └── checkpoint/                            ✅ Checkpoint 資料目錄（未來）
│
├── scripts/                                    ✅ 收集工具目錄
│   ├── collect-training-data.js               ✅ 主要收集程式
│   ├── README.md                              ✅ 使用說明
│   ├── config/
│   │   └── collection-config.js               ✅ 收集配置
│   └── utils/
│       └── logger.js                          ✅ 日誌工具
│
├── .gitignore                                 ✅ 已加入 ai_logs/
└── TRAINING_DATA_COLLECTION_GUIDE.md          ✅ 本指南
```

## 🚀 快速開始（5 分鐘）

### 步驟 1: 啟動後端服務

```bash
cd /Users/peter/Across-AI/backend
node index.js
```

等待看到：
```
🚀 Backend API 已啟動: http://localhost:8080
```

### 步驟 2: 執行收集（在新終端）

```bash
cd /Users/peter/Across-AI

# 方式 A: 使用 Gemini（需要 API Key）
node scripts/collect-training-data.js \
  --product=cloudflare \
  --count=5 \
  --apiKey=YOUR_GEMINI_API_KEY

# 方式 B: 使用 Ollama（本地，無需 API Key）
node scripts/collect-training-data.js \
  --product=cloudflare \
  --count=5 \
  --aiProvider=ollama \
  --model=twister_llama33:latest
```

### 步驟 3: 查看結果

```bash
# 列出收集的檔案
ls -lh ai_logs/cloudflare/

# 查看其中一個檔案
cat ai_logs/cloudflare/2025-11-18-001.json | jq .
```

## 📖 詳細使用方式

### 收集 Cloudflare 訓練資料

```bash
# 基本用法（10 筆資料）
node scripts/collect-training-data.js \
  --product=cloudflare \
  --apiKey=YOUR_API_KEY

# 指定數量和時間範圍
node scripts/collect-training-data.js \
  --product=cloudflare \
  --count=20 \
  --timeRange=24h \
  --apiKey=YOUR_API_KEY

# 收集不同時間範圍的資料（建立多樣化訓練集）
node scripts/collect-training-data.js --timeRange=1h --count=5 --apiKey=YOUR_KEY
node scripts/collect-training-data.js --timeRange=12h --count=5 --apiKey=YOUR_KEY
node scripts/collect-training-data.js --timeRange=7d --count=5 --apiKey=YOUR_KEY
```

### 收集 F5 訓練資料

```bash
node scripts/collect-training-data.js \
  --product=f5 \
  --count=10 \
  --timeRange=24h \
  --apiKey=YOUR_API_KEY
```

### 使用本地 AI（Ollama）

```bash
# 優點：無需 API Key，完全本地，免費
# 前提：需要安裝並運行 Ollama

node scripts/collect-training-data.js \
  --product=cloudflare \
  --aiProvider=ollama \
  --model=twister_llama33:latest \
  --count=10
```

## 🎯 推薦的收集策略

### 策略 1: 多樣化時間範圍

```bash
# 收集短期資料（快速攻擊）
node scripts/collect-training-data.js --timeRange=1h --count=10

# 收集中期資料（一般情況）
node scripts/collect-training-data.js --timeRange=24h --count=10

# 收集長期資料（趨勢分析）
node scripts/collect-training-data.js --timeRange=7d --count=10
```

### 策略 2: 多產品覆蓋

```bash
# Cloudflare
node scripts/collect-training-data.js --product=cloudflare --count=20

# F5
node scripts/collect-training-data.js --product=f5 --count=20
```

### 策略 3: 不同 AI 模型比較

```bash
# Gemini
node scripts/collect-training-data.js --aiProvider=gemini --model=gemini-2.0-flash-exp

# Ollama
node scripts/collect-training-data.js --aiProvider=ollama --model=twister_llama33:latest
```

## 📊 訓練資料格式

每個 JSON 檔案包含完整的訓練配對：

```json
{
  "metadata": {
    "id": "cloudflare-1731913852123",
    "timestamp": "2025-11-18T06:30:52.123Z",
    "product": "cloudflare",
    "aiProvider": "gemini",
    "model": "gemini-2.0-flash-exp",
    "timeRange": "24h"
  },
  
  "input": {
    "systemPrompt": "你是一位資深的網路安全分析專家...",
    "userPrompt": "請分析以下 Cloudflare WAF 日誌數據...",
    "analysisData": {
      "totalEvents": 1234,
      "sqlInjection": { "count": 150, ... },
      ...
    },
    "fullPrompt": "(完整的 Prompt 內容)"
  },
  
  "output": {
    "success": true,
    "risks": [ ... ],
    "metadata": { ... }
  },
  
  "performance": {
    "apiCallTime": 5678,
    "promptLength": 15234,
    "responseLength": 3456
  }
}
```

## 🎓 如何使用訓練資料

### 用途 1: 提供給 AI 工程師

將整個 `ai_logs/` 目錄打包給 AI 工程師：

```bash
# 打包所有訓練資料
tar -czf training-data.tar.gz ai_logs/

# 或只打包 Cloudflare 資料
tar -czf cloudflare-training-data.tar.gz ai_logs/cloudflare/
```

### 用途 2: 轉換為 JSONL 格式（用於 Fine-tuning）

```javascript
// 簡易轉換腳本範例
const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('ai_logs/cloudflare/');
const output = [];

files.forEach(file => {
  const data = JSON.parse(fs.readFileSync(`ai_logs/cloudflare/${file}`));
  
  output.push({
    messages: [
      { role: 'system', content: data.input.systemPrompt },
      { role: 'user', content: data.input.userPrompt },
      { role: 'assistant', content: JSON.stringify(data.output.risks) }
    ]
  });
});

// 寫入 JSONL（每行一個 JSON）
const jsonl = output.map(o => JSON.stringify(o)).join('\n');
fs.writeFileSync('training.jsonl', jsonl);
```

### 用途 3: 建立訓練集和測試集

```bash
# 80% 訓練，20% 測試
# 手動分割或使用腳本
```

## ⚙️ 進階配置

編輯 `scripts/config/collection-config.js` 可調整：

```javascript
collection: {
  defaultCount: 10,              // 預設收集數量
  delayBetweenCalls: 2000,      // API 呼叫間隔（毫秒）
  maxConcurrent: 1,              // 最大並發數
  continueOnError: true,         // 遇錯誤是否繼續
  saveOnError: false             // 是否儲存錯誤回應
}
```

## 🔧 常見問題

### Q1: 如何查看已收集的資料數量？

```bash
# Cloudflare
ls ai_logs/cloudflare/ | wc -l

# F5
ls ai_logs/f5/ | wc -l

# 所有產品
find ai_logs -name "*.json" | wc -l
```

### Q2: 如何刪除已收集的資料？

```bash
# 刪除所有 Cloudflare 資料
rm ai_logs/cloudflare/*.json

# 刪除特定日期的資料
rm ai_logs/cloudflare/2025-11-18-*.json
```

### Q3: 收集失敗怎麼辦？

檢查：
1. 後端服務是否運行（`http://localhost:8080`）
2. API Key 是否正確（Gemini）
3. 網路連線是否正常
4. 查看錯誤訊息並根據提示處理

### Q4: 如何暫停和繼續收集？

```bash
# 按 Ctrl+C 暫停
# 下次執行時會從新序號開始，不會覆蓋已有資料
```

## 📝 最佳實踐

1. **定期備份**
   ```bash
   # 每週備份一次
   tar -czf backup-$(date +%Y%m%d).tar.gz ai_logs/
   ```

2. **多樣化資料**
   - 收集不同時間範圍
   - 涵蓋有攻擊和無攻擊情境
   - 測試不同 AI 模型

3. **品質檢查**
   - 隨機檢查幾個檔案
   - 確認格式正確
   - 驗證資料完整性

4. **版本控制**
   - 記錄收集日期和參數
   - 保存配置檔案的版本

## 🎯 收集目標建議

| 產品 | 最少數量 | 推薦數量 | 用途 |
|------|---------|---------|------|
| Cloudflare | 50 | 100-200 | 模型訓練 |
| F5 | 50 | 100-200 | 模型訓練 |
| 測試集 | 10 | 20-30 | 模型評估 |

## 🔐 安全性注意

1. **不要提交到 Git**
   - ✅ `ai_logs/` 已在 `.gitignore` 中

2. **保護 API Key**
   - 使用環境變數
   - 不要硬編碼在腳本中

3. **敏感資料處理**
   - 考慮是否需要遮蔽 IP 位址
   - 檢查是否包含其他敏感資訊

## 📚 相關文件

- [詳細使用說明](scripts/README.md)
- [訓練資料格式](ai_logs/README.md)
- [AI 分析流程](AI_ANALYSIS_FLOW.md)
- [配置說明](scripts/config/collection-config.js)

## 🆘 需要幫助？

1. 查看錯誤訊息
2. 閱讀相關文件
3. 檢查後端日誌
4. 使用 `--help` 查看說明

---

## ✨ 開始收集訓練資料！

```bash
# 馬上開始！
cd /Users/peter/Across-AI

# 啟動後端（終端 1）
cd backend && node index.js

# 收集資料（終端 2）
node scripts/collect-training-data.js --product=cloudflare --count=10 --apiKey=YOUR_KEY
```

**祝您收集順利！** 🎉

---

**建立日期**: 2025-11-18  
**版本**: 1.0  
**狀態**: ✅ 已就緒


