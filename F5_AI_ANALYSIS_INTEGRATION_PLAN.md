# F5 AI 分析功能整合計畫

## 📋 專案概述

**目標**：將 F5 前端頁面 (`frontend/app/ai-analysis/f5/page.tsx`) 從寫死的固定資料改造為真實的 AI 分析功能，使其與 Cloudflare 頁面 (`frontend/app/ai-analysis/cloudflare/page.tsx`) 擁有相同的功能體驗。

**分析時間**：2024-12-18  
**計畫版本**：v1.0

---

## 🔍 現況分析

### 1️⃣ F5 前端頁面現況

**檔案位置**：`frontend/app/ai-analysis/f5/page.tsx`

**問題點**：
- ✅ **已確認**：第 133-277 行存在大量寫死的假資料
- ❌ **缺少**：沒有呼叫後端 API 的邏輯
- ❌ **缺少**：沒有載入狀態管理
- ❌ **缺少**：沒有時間範圍選擇器
- ❌ **缺少**：沒有錯誤處理機制
- ❌ **缺少**：沒有重新載入 AI 分析功能
- ❌ **缺少**：沒有分析 metadata 顯示（事件總數、時間範圍、最後分析時間）

**寫死的假資料範圍**：
```javascript
// 第 133-277 行
const [wafRisks, setWafRisks] = useState<WAFRisk[]>([
  {
    id: "xss-attack-massive",
    title: "跨站腳本 (XSS) 攻擊激增",
    // ... 固定的假資料
  },
  // ... 更多假資料
])
```

**「載入AI分析」按鈕問題**：
```javascript
// 第 832 行
onClick={() => {
  console.log("[v0] Loading AI analysis for date range:", { dateFrom, dateTo })
}}
```
- 只有 console.log，沒有實際功能

---

### 2️⃣ Cloudflare 前端頁面參考

**檔案位置**：`frontend/app/ai-analysis/cloudflare/page.tsx`

**成功功能特性**：
- ✅ 使用 `useEffect` 自動載入真實 AI 分析資料
- ✅ 呼叫後端 API：`POST http://localhost:8080/api/cloudflare/analyze-waf-risks`
- ✅ 完整的載入狀態管理（`isLoading`, `error`, `hasAttemptedLoad`）
- ✅ 時間範圍選擇器（1h, 6h, 12h, 24h, 7d, 30d）
- ✅ 分析 metadata 顯示卡片（時間範圍、事件總數、最後分析時間）
- ✅ 手動重新載入功能
- ✅ 錯誤處理和空狀態顯示
- ✅ 使用 `useWAFData()` Context 管理狀態

**API 請求示例**：
```javascript
const response = await fetch('http://localhost:8080/api/cloudflare/analyze-waf-risks', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    aiProvider: aiProvider,
    apiKey: apiKey,
    model: aiModel,
    timeRange: selectedTimeRange  // 使用選擇的時間範圍
  })
})
```

---

### 3️⃣ F5 後端現況

**後端路由**：`backend/routes/f5.routes.js`
- ✅ **已完成**：`POST /api/f5/analyze-waf-risks` 端點
- ✅ **已完成**：完整的 AI 分析流程
- ✅ **已完成**：支援 Gemini 和 Ollama 兩種 AI 提供者

**後端服務**：`backend/services/products/f5WAFRiskService.js`
- ✅ **已完成**：完整的 F5 WAF 風險分析服務
- ✅ **已完成**：支援 SQL 注入、XSS、命令執行、路徑遍歷、機器人、資訊洩漏等攻擊分析
- ✅ **已完成**：生成 AI Prompt
- ✅ **已完成**：Fallback 機制

**後端配置**：`backend/config/products/f5/`
- ✅ **已完成**：`f5FieldMapping.js` - F5 欄位對應表
- ✅ **已完成**：`f5Standards.js` - F5 安全標準
- ✅ **已完成**：`f5ELKConfig.js` - F5 ELK 索引配置

**後端 API 端點**：
```
POST http://localhost:8080/api/f5/analyze-waf-risks
```

**請求參數**：
```json
{
  "aiProvider": "gemini" | "ollama",
  "apiKey": "YOUR_GEMINI_API_KEY",
  "model": "gemini-2.0-flash-exp" | "gpt-oss:20b",
  "timeRange": "1h" | "6h" | "12h" | "24h" | "7d" | "30d"
}
```

**回應格式**：
```json
{
  "success": true,
  "product": "F5",
  "risks": [
    {
      "id": "sql-injection-1234567890",
      "title": "SQL 注入攻擊檢測",
      "severity": "high",
      "openIssues": 1234,
      "resolvedIssues": 0,
      "affectedAssets": 10,
      "tags": ["Internet Exposed", "High Volume"],
      "description": "...",
      "aiInsight": "...",
      "recommendations": [...]
    }
  ],
  "metadata": {
    "totalEvents": 12345,
    "timeRange": {
      "start": "2024-12-17T00:00:00Z",
      "end": "2024-12-18T00:00:00Z"
    },
    "aiProvider": "ollama",
    "model": "gpt-oss:20b",
    "analysisTimestamp": "2024-12-18T06:30:00Z"
  }
}
```

---

## 🎯 整合計畫

### 階段一：移除假資料與狀態初始化

**目標**：清除寫死的假資料，準備狀態管理

**檔案**：`frontend/app/ai-analysis/f5/page.tsx`

**需要修改的部分**：

1. **移除假資料（第 133-277 行）**
   ```javascript
   // ❌ 刪除這段
   const [wafRisks, setWafRisks] = useState<WAFRisk[]>([
     {
       id: "xss-attack-massive",
       // ... 所有假資料
     }
   ])
   
   // ✅ 改為空陣列
   const [wafRisks, setWafRisks] = useState<WAFRisk[]>([])
   ```

2. **新增必要的狀態變數**
   ```javascript
   // 新增這些狀態（參考 Cloudflare 頁面第 14-25 行）
   const [isLoading, setIsLoading] = useState(false)
   const [error, setError] = useState<string | null>(null)
   const [forceReload, setForceReload] = useState(0)
   const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false)
   const [selectedTimeRange, setSelectedTimeRange] = useState('24h')
   const [analysisMetadata, setAnalysisMetadata] = useState({
     totalEvents: 0,
     timeRange: { start: '', end: '' },
     analysisTimestamp: ''
   })
   ```

---

### 階段二：實作 API 調用邏輯

**目標**：實作從後端載入真實 AI 分析資料的邏輯

**需要新增的功能**：

1. **新增 API 調用 useEffect**（參考 Cloudflare 第 29-129 行）
   ```javascript
   useEffect(() => {
     const loadF5WAFRisks = async () => {
       // 防止重複載入
       if (hasAttemptedLoad && wafRisks.length > 0) {
         console.log('✅ 已完成載入，跳過')
         return
       }
       
       console.log('🔄 開始載入 F5 WAF 風險分析...')
       setIsLoading(true)
       setError(null)
       
       try {
         // 從 localStorage 讀取配置
         const aiProvider = localStorage.getItem('aiProvider') || 'ollama'
         const apiKey = localStorage.getItem('geminiApiKey') || ''
         const aiModel = aiProvider === 'ollama' 
           ? (localStorage.getItem('ollamaModel') || 'gpt-oss:20b')
           : 'gemini-2.0-flash-exp'
         
         // 檢查 Gemini API Key
         if (aiProvider === 'gemini' && !apiKey) {
           setError('請先設定 Gemini API Key 或切換至 Ollama')
           setIsLoading(false)
           setHasAttemptedLoad(true)
           return
         }
         
         // 呼叫後端 API
         const response = await fetch('http://localhost:8080/api/f5/analyze-waf-risks', {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
           },
           body: JSON.stringify({
             aiProvider: aiProvider,
             apiKey: apiKey,
             model: aiModel,
             timeRange: selectedTimeRange
           })
         })
         
         if (!response.ok) {
           throw new Error(`API 請求失敗: ${response.status}`)
         }
         
         const data = await response.json()
         console.log('✅ 成功載入 F5 WAF 風險資料:', data)
         
         // 保存 metadata
         if (data.metadata) {
           setAnalysisMetadata({
             totalEvents: data.metadata.totalEvents || 0,
             timeRange: data.metadata.timeRange || { start: '', end: '' },
             analysisTimestamp: data.metadata.analysisTimestamp || new Date().toISOString()
           })
         }
         
         // 更新風險資料
         if (data.success && data.risks && data.risks.length > 0) {
           setWafRisks(data.risks)
         } else {
           // 處理空資料情況
           const totalEvents = data.metadata?.totalEvents || 0
           if (totalEvents > 0) {
             setError('未檢測到任何安全威脅')
           } else {
             setError('ELK 中沒有足夠的日誌數據，請持續觀察並監控')
           }
           setWafRisks([])
         }
         
       } catch (err) {
         console.error('❌ 載入 F5 WAF 風險分析失敗:', err)
         setError(err instanceof Error ? err.message : '未知錯誤')
         setWafRisks([])
       } finally {
         setIsLoading(false)
         setHasAttemptedLoad(true)
       }
     }
     
     loadF5WAFRisks()
   }, [wafRisks.length, forceReload, selectedTimeRange])
   ```

2. **新增手動重新載入函數**
   ```javascript
   const handleReload = () => {
     console.log('🔄 手動觸發重新載入...')
     setWafRisks([])
     setHasAttemptedLoad(false)
     setError(null)
     setForceReload(prev => prev + 1)
   }
   ```

3. **新增時間範圍改變處理**
   ```javascript
   const handleTimeRangeChange = (timeRange: string) => {
     console.log(`⏰ 時間範圍變更: ${timeRange}`)
     setSelectedTimeRange(timeRange)
     setWafRisks([])
     setHasAttemptedLoad(false)
   }
   ```

---

### 階段三：更新 UI 組件

**目標**：新增時間範圍選擇器、分析資訊卡片、載入狀態顯示

**需要修改的 UI 部分**：

1. **更新頁面標題區域**（參考 Cloudflare 第 276-308 行）
   ```javascript
   <div className="flex items-center gap-3 mb-2">
     <h1 className="text-3xl font-bold text-white">AI Cyber Security Analysis - F5</h1>
     {isLoading && (
       <div className="flex items-center gap-2 text-cyan-400 text-sm">
         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-400"></div>
         <span>載入中...</span>
       </div>
     )}
     <Button
       onClick={handleReload}
       disabled={isLoading}
       className="ml-auto bg-cyan-600 hover:bg-cyan-700 text-white"
     >
       <Sparkles className="w-4 h-4 mr-2" />
       {isLoading ? '載入中...' : '重新載入 AI 分析'}
     </Button>
   </div>
   ```

2. **新增分析資訊卡片區**（參考 Cloudflare 第 310-417 行）
   ```javascript
   {/* 分析資訊區 */}
   <motion.div className="mb-6">
     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
       {/* 時間範圍卡片 */}
       <Card className="bg-slate-900/40 border-cyan-500/30">
         <CardContent className="p-4">
           <div className="flex items-center gap-2 mb-2">
             <Calendar className="w-4 h-4 text-cyan-400" />
             <span className="text-sm font-semibold text-slate-300">時間範圍</span>
           </div>
           <div className="text-2xl font-bold text-cyan-400">
             {getTimeRangeLabel(selectedTimeRange)}
           </div>
         </CardContent>
       </Card>
       
       {/* 事件總數卡片 */}
       <Card className="bg-slate-900/40 border-green-500/30">
         <CardContent className="p-4">
           <div className="flex items-center gap-2 mb-2">
             <Activity className="w-4 h-4 text-green-400" />
             <span className="text-sm font-semibold text-slate-300">事件總數</span>
           </div>
           <div className="text-2xl font-bold text-green-400">
             {formatNumber(analysisMetadata.totalEvents)} 筆
           </div>
         </CardContent>
       </Card>
       
       {/* 最後分析時間卡片 */}
       <Card className="bg-slate-900/40 border-purple-500/30">
         <CardContent className="p-4">
           <div className="flex items-center gap-2 mb-2">
             <Clock className="w-4 h-4 text-purple-400" />
             <span className="text-sm font-semibold text-slate-300">最後分析</span>
           </div>
           <div className="text-2xl font-bold text-purple-400">
             {getRelativeTime(analysisMetadata.analysisTimestamp)}
           </div>
         </CardContent>
       </Card>
     </div>
     
     {/* 時間範圍選擇器 */}
     <Card className="bg-slate-900/40 border-white/10">
       <CardContent className="p-4">
         <div className="flex flex-wrap gap-2">
           {['1h', '6h', '12h', '24h', '7d', '30d'].map((range) => (
             <Button
               key={range}
               onClick={() => handleTimeRangeChange(range)}
               disabled={isLoading}
               variant="outline"
               className={selectedTimeRange === range ? 'bg-cyan-600' : ''}
             >
               {getTimeRangeLabel(range).replace('過去 ', '')}
             </Button>
           ))}
         </div>
       </CardContent>
     </Card>
   </motion.div>
   ```

3. **新增空狀態顯示**（參考 Cloudflare 第 419-458 行）
   ```javascript
   {!isLoading && wafRisks.length === 0 && (
     <motion.div className="flex flex-col items-center justify-center py-20">
       <div className="bg-slate-900/40 border border-white/10 rounded-lg p-12 text-center">
         <Shield className="w-24 h-24 text-slate-600 mx-auto mb-6" />
         <h2 className="text-2xl font-bold text-white mb-4">
           {error?.includes('ELK 中沒有足夠的日誌數據') 
             ? '日誌數據不足' 
             : error?.includes('未檢測到任何安全威脅') 
               ? '未檢測到安全威脅' 
               : '無法載入資料'}
         </h2>
         <p className="text-slate-400 mb-6">{error}</p>
         <Button onClick={handleReload}>重新載入分析</Button>
       </div>
     </motion.div>
   )}
   ```

4. **更新「載入AI分析」按鈕**（第 829-838 行）
   ```javascript
   // ❌ 刪除舊的固定日期選擇器和按鈕
   
   // ✅ 已經在上面「分析資訊區」實作了時間範圍選擇器
   ```

5. **移除舊的 Summary Cards**（第 843-887 行）
   ```javascript
   // ❌ 刪除舊的 Summary Cards
   // 因為已經在「分析資訊區」新增了更完整的卡片
   ```

6. **新增輔助函數**
   ```javascript
   // 格式化數字
   const formatNumber = (num: number) => {
     return num.toLocaleString('zh-TW')
   }
   
   // 時間範圍標籤
   const getTimeRangeLabel = (timeRange: string) => {
     const labels: { [key: string]: string } = {
       '1h': '過去 1 小時',
       '6h': '過去 6 小時',
       '12h': '過去 12 小時',
       '24h': '過去 24 小時',
       '7d': '過去 7 天',
       '30d': '過去 30 天'
     }
     return labels[timeRange] || timeRange
   }
   
   // 格式化日期時間
   const formatDateTime = (isoString: string) => {
     if (!isoString) return ''
     const date = new Date(isoString)
     return date.toLocaleString('zh-TW', {
       year: 'numeric',
       month: '2-digit',
       day: '2-digit',
       hour: '2-digit',
       minute: '2-digit',
       second: '2-digit',
       hour12: false
     })
   }
   
   // 相對時間顯示
   const getRelativeTime = (isoString: string) => {
     if (!isoString) return ''
     const now = new Date().getTime()
     const then = new Date(isoString).getTime()
     const diff = Math.floor((now - then) / 1000)
     
     if (diff < 60) return '剛剛'
     if (diff < 3600) return `${Math.floor(diff / 60)} 分鐘前`
     if (diff < 86400) return `${Math.floor(diff / 3600)} 小時前`
     return formatDateTime(isoString)
   }
   ```

---

### 階段四：條件渲染優化

**目標**：只在有資料時才顯示三欄佈局

**需要修改的部分**：

1. **包裝主要內容區域**（參考 Cloudflare 第 461 行）
   ```javascript
   {/* 只在有風險資料時顯示 */}
   {wafRisks.length > 0 && (
     <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
       {/* Column 1: 風險評估 */}
       {/* Column 2: 趨勢分析 */}
       {/* Column 3: 執行建議按鈕 */}
     </div>
   )}
   ```

---

## 📝 實施檢查清單

### ✅ 階段一：狀態準備
- [ ] 移除假資料（第 133-277 行）
- [ ] 新增 `isLoading` 狀態
- [ ] 新增 `error` 狀態
- [ ] 新增 `forceReload` 狀態
- [ ] 新增 `hasAttemptedLoad` 狀態
- [ ] 新增 `selectedTimeRange` 狀態
- [ ] 新增 `analysisMetadata` 狀態

### ✅ 階段二：API 整合
- [ ] 實作 `loadF5WAFRisks` useEffect
- [ ] 實作 `handleReload` 函數
- [ ] 實作 `handleTimeRangeChange` 函數
- [ ] 測試 API 連接
- [ ] 測試錯誤處理

### ✅ 階段三：UI 更新
- [ ] 更新頁面標題區域（加入載入指示器和重新載入按鈕）
- [ ] 新增分析資訊卡片區（時間範圍、事件總數、最後分析）
- [ ] 新增時間範圍選擇器
- [ ] 新增空狀態顯示
- [ ] 移除舊的「載入AI分析」按鈕
- [ ] 移除舊的 Summary Cards
- [ ] 新增輔助函數（formatNumber, getTimeRangeLabel, formatDateTime, getRelativeTime）

### ✅ 階段四：條件渲染
- [ ] 包裝三欄佈局為條件渲染
- [ ] 測試空資料狀態
- [ ] 測試載入中狀態
- [ ] 測試錯誤狀態

### ✅ 階段五：測試驗證
- [ ] 測試首次載入
- [ ] 測試時間範圍切換
- [ ] 測試手動重新載入
- [ ] 測試 API 錯誤處理
- [ ] 測試空資料情況
- [ ] 測試 Gemini API
- [ ] 測試 Ollama API

---

## 🚀 實施步驟順序

### Step 1：備份原始檔案
```bash
cp frontend/app/ai-analysis/f5/page.tsx frontend/app/ai-analysis/f5/page.tsx.backup
```

### Step 2：執行階段一（狀態準備）
- 修改狀態定義
- 移除假資料

### Step 3：執行階段二（API 整合）
- 新增 API 調用邏輯
- 測試後端連接

### Step 4：執行階段三（UI 更新）
- 更新 UI 組件
- 新增分析資訊區
- 移除舊組件

### Step 5：執行階段四（條件渲染）
- 調整佈局渲染邏輯

### Step 6：完整測試
- 測試所有功能點
- 修復 bug

---

## ⚠️ 注意事項

### 1. 後端 API 確認
- 確保後端服務已啟動：`http://localhost:8080`
- 確認 F5 路由已註冊在 `backend/index.js`：
  ```javascript
  app.use('/api/f5', f5Routes);
  ```

### 2. ELK 連接確認
- 確保 ELK 索引配置正確：`across-f5-awaf-*`
- 確保有 F5 日誌資料
- 測試連接：`GET http://localhost:8080/api/f5/test-connection`

### 3. AI 提供者設定
- **Ollama**：確保 Ollama 服務運行在 `http://localhost:11434`
- **Gemini**：需要在 localStorage 設定 `geminiApiKey`

### 4. 保留現有功能
- ✅ 保留執行建議按鈕功能
- ✅ 保留執行操作歷史記錄功能
- ✅ 保留風險評估卡片功能
- ✅ 保留趨勢分析功能

---

## 🔄 與 Cloudflare 頁面的差異

雖然我們要讓 F5 頁面有跟 Cloudflare 相同的功能，但有以下差異需要注意：

| 項目 | Cloudflare | F5 | 說明 |
|------|------------|----|----|
| API 端點 | `/api/cloudflare/analyze-waf-risks` | `/api/f5/analyze-waf-risks` | 不同產品使用不同端點 |
| 產品名稱 | "Cloudflare" | "F5" | 顯示名稱不同 |
| ELK 索引 | `across-cloudflare-*` | `across-f5-awaf-*` | 不同的日誌索引 |
| 欄位對應 | `cloudflareFieldMapping.js` | `f5FieldMapping.js` | 不同的欄位結構 |
| 攻擊簽名 | Cloudflare WAF Rules | F5 Attack Signatures | 不同的攻擊識別方式 |

---

## 📊 預期成果

完成後，F5 AI 分析頁面將具備以下功能：

1. ✅ **自動載入真實 AI 分析**：頁面載入時自動從後端獲取分析結果
2. ✅ **時間範圍選擇**：支援 1h, 6h, 12h, 24h, 7d, 30d
3. ✅ **分析資訊顯示**：顯示時間範圍、事件總數、最後分析時間
4. ✅ **手動重新載入**：可隨時觸發重新分析
5. ✅ **載入狀態顯示**：載入中有動畫提示
6. ✅ **錯誤處理**：API 錯誤或無資料時有友善提示
7. ✅ **空狀態顯示**：無威脅時有明確說明
8. ✅ **風險分類展示**：高/中/低風險分類
9. ✅ **詳細攻擊資訊**：每個攻擊的詳細資訊和 AI 分析
10. ✅ **建議操作**：AI 推薦的修復建議

---

## 🎯 成功指標

完成整合後，需要達到以下指標：

- [ ] 頁面載入時自動呼叫 F5 API
- [ ] 可成功從後端獲取真實的 F5 WAF 資料
- [ ] 時間範圍選擇器正常運作
- [ ] 分析資訊卡片正確顯示
- [ ] 手動重新載入功能正常
- [ ] 錯誤情況有友善提示
- [ ] 無資料時有空狀態顯示
- [ ] 風險卡片正確分類
- [ ] AI 分析內容真實且有意義
- [ ] 執行建議按鈕保持原有功能

---

## 📞 問題排查

### 問題 1：API 請求失敗
**原因**：後端服務未啟動或端點錯誤  
**解決**：
```bash
# 檢查後端服務
curl http://localhost:8080/api/f5/test-connection

# 重啟後端服務
cd backend
npm start
```

### 問題 2：沒有資料回傳
**原因**：ELK 中沒有 F5 日誌資料  
**解決**：
- 檢查 ELK 索引是否存在
- 確認時間範圍是否正確
- 調整時間範圍到更大範圍（例如 7d）

### 問題 3：AI 分析失敗
**原因**：AI 提供者配置錯誤  
**解決**：
- 如果使用 Ollama：確保服務運行在 `http://localhost:11434`
- 如果使用 Gemini：確認 API Key 是否正確設定

### 問題 4：頁面載入慢
**原因**：ELK 查詢資料量過大  
**解決**：
- 調整時間範圍到較小範圍（例如 1h 或 6h）
- 優化 ELK 查詢條件

---

## 📚 參考資料

- Cloudflare 頁面實作：`frontend/app/ai-analysis/cloudflare/page.tsx`
- F5 後端路由：`backend/routes/f5.routes.js`
- F5 服務：`backend/services/products/f5WAFRiskService.js`
- F5 配置：`backend/config/products/f5/`

---

## ✅ 確認事項

在開始實施前，請確認：

- [ ] 我已詳細閱讀此計畫文件
- [ ] 我了解需要修改的檔案和位置
- [ ] 我已備份原始檔案
- [ ] 後端服務已準備就緒
- [ ] ELK 連接正常
- [ ] AI 提供者（Ollama 或 Gemini）已設定
- [ ] 我準備好開始實施

---

## 📝 變更記錄

| 版本 | 日期 | 變更內容 |
|------|------|---------|
| v1.0 | 2024-12-18 | 初版計畫文件建立 |

---

**文件建立時間**：2024-12-18  
**預估實施時間**：2-3 小時  
**難度等級**：⭐⭐⭐ (中等)

---

## 🚀 準備開始實施？

當您確認此計畫無誤後，請告知我開始執行實施步驟。我將按照此計畫逐步完成 F5 前端頁面的 AI 分析功能整合。

