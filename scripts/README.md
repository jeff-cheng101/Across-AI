# 訓練資料收集工具使用說明

此目錄包含用於收集 AI 分析訓練資料的工具程式。

## 📁 目錄結構

```
scripts/
├── collect-training-data.js      # 主要收集程式
├── config/
│   └── collection-config.js      # 收集配置
├── utils/
│   └── logger.js                 # 日誌工具
└── README.md                      # 本說明文件
```

## 🚀 快速開始

### 前置條件

1. **啟動後端服務**
```bash
cd backend
node index.js
```

2. **準備 API Key**（使用 Gemini 時需要）
```bash
# 方式 1: 設定環境變數
export GEMINI_API_KEY=your_api_key_here

# 方式 2: 在命令列參數中提供
--apiKey=your_api_key_here
```

### 基本使用

#### 1. 收集 Cloudflare 訓練資料

```bash
# 收集 10 筆資料（預設）
node scripts/collect-training-data.js --product=cloudflare --apiKey=YOUR_API_KEY

# 收集 20 筆資料
node scripts/collect-training-data.js \
  --product=cloudflare \
  --count=20 \
  --timeRange=24h \
  --apiKey=YOUR_API_KEY
```

#### 2. 收集 F5 訓練資料

```bash
node scripts/collect-training-data.js \
  --product=f5 \
  --count=10 \
  --timeRange=12h \
  --apiKey=YOUR_API_KEY
```

#### 3. 使用 Ollama（本地 AI）

```bash
# 不需要 API Key
node scripts/collect-training-data.js \
  --product=cloudflare \
  --count=5 \
  --aiProvider=ollama \
  --model=twister_llama33:latest
```

## 📋 命令列參數

| 參數 | 說明 | 預設值 | 必填 |
|------|------|--------|------|
| `--product` | 產品名稱（cloudflare, f5, checkpoint） | cloudflare | ❌ |
| `--count` | 收集筆數 | 10 | ❌ |
| `--timeRange` | 時間範圍（1h, 6h, 12h, 24h, 7d, 30d） | 24h | ❌ |
| `--apiKey` | Gemini API Key | - | ✅（使用 Gemini 時） |
| `--model` | AI 模型名稱 | gemini-2.0-flash-exp | ❌ |
| `--aiProvider` | AI 提供者（gemini, ollama） | gemini | ❌ |
| `--help` | 顯示說明 | - | ❌ |

## 🎯 使用情境

### 情境 1：快速收集少量資料

```bash
# 收集 5 筆 Cloudflare 資料
node scripts/collect-training-data.js --product=cloudflare --count=5 --apiKey=YOUR_KEY
```

### 情境 2：收集不同時間範圍的資料

```bash
# 收集 1 小時的資料
node scripts/collect-training-data.js --timeRange=1h --count=10 --apiKey=YOUR_KEY

# 收集 7 天的資料
node scripts/collect-training-data.js --timeRange=7d --count=10 --apiKey=YOUR_KEY
```

### 情境 3：收集多產品資料

```bash
# Cloudflare
node scripts/collect-training-data.js --product=cloudflare --count=10 --apiKey=YOUR_KEY

# F5
node scripts/collect-training-data.js --product=f5 --count=10 --apiKey=YOUR_KEY
```

### 情境 4：使用本地 AI（Ollama）

```bash
# 不需要 API Key，完全本地運行
node scripts/collect-training-data.js \
  --product=cloudflare \
  --aiProvider=ollama \
  --model=twister_llama33:latest \
  --count=10
```

## 📊 輸出結果

訓練資料會儲存在 `ai_logs/{product}/` 目錄：

```
ai_logs/
├── cloudflare/
│   ├── 2025-11-18-001.json
│   ├── 2025-11-18-002.json
│   └── ...
└── f5/
    ├── 2025-11-18-001.json
    └── ...
```

每個 JSON 檔案包含：
- `metadata`: 基本資訊（時間、產品、AI 模型等）
- `input`: AI 輸入（Prompt + 統計資料）
- `output`: AI 輸出（風險報告）
- `performance`: 效能資訊（執行時間、資料大小）

詳細格式請參考：`ai_logs/README.md`

## ⚙️ 進階配置

編輯 `scripts/config/collection-config.js` 可以調整：

- API 超時時間
- 重試次數
- 每次呼叫的延遲時間
- 檔案命名格式
- 驗證規則
- 等等...

## 🔧 故障排除

### 問題 1: API 連線失敗

```
❌ 錯誤: API 錯誤 500: Internal Server Error
```

**解決方式**:
- 確認後端服務正在運行（`node backend/index.js`）
- 檢查 API 位址是否正確（預設 `http://localhost:8080`）

### 問題 2: API Key 無效

```
❌ 錯誤: 使用 Gemini 時必須提供 API Key
```

**解決方式**:
- 設定環境變數：`export GEMINI_API_KEY=your_key`
- 或在命令列提供：`--apiKey=your_key`

### 問題 3: 權限錯誤

```
❌ 錯誤: 儲存訓練資料失敗: EACCES: permission denied
```

**解決方式**:
- 確認 `ai_logs/` 目錄的寫入權限
- 或手動建立目錄：`mkdir -p ai_logs/cloudflare`

### 問題 4: 收集速度太慢

**解決方式**:
- 減少延遲時間（編輯 `collection-config.js`）
- 使用 Ollama（本地 AI，更快）
- 減少單次收集數量

## 📝 注意事項

1. **不要提交到 Git**
   - `ai_logs/` 已加入 `.gitignore`
   - 訓練資料可能包含敏感資訊

2. **API 頻率限制**
   - 預設每次呼叫間隔 2 秒
   - 避免對後端造成過大負載

3. **儲存空間**
   - 每筆資料約 20-50KB
   - 收集 100 筆約需 2-5MB

4. **資料品質**
   - 建議收集不同時間範圍的資料
   - 確保涵蓋有攻擊和無攻擊的情境

## 🎓 訓練資料使用

收集完成後，這些資料可以：

1. **直接用於模型訓練**
```bash
# 轉換為 JSONL 格式
node scripts/convert-to-jsonl.js --input=ai_logs/cloudflare --output=training.jsonl
```

2. **分析模型效能**
```bash
# 統計分析
node scripts/analyze-training-data.js --product=cloudflare
```

3. **建立測試集**
```bash
# 分割訓練集和測試集
node scripts/split-dataset.js --train=0.8 --test=0.2
```

## 📚 相關文件

- [AI 分析流程文件](../AI_ANALYSIS_FLOW.md)
- [訓練資料格式說明](../ai_logs/README.md)
- [配置檔案說明](./config/collection-config.js)

## 🤝 貢獻

如需新增支援其他產品（如 Checkpoint），請：

1. 在 `config/collection-config.js` 加入產品配置
2. 在後端建立對應的 API 端點
3. 更新本文件的使用說明

---

**版本**: 1.0  
**建立日期**: 2025-11-18  
**維護者**: Across-AI Team


