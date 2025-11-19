# F5/Cloudflare AI 分析手動觸發修改計畫（精簡版）

## 📋 修改目標
將 AI 分析從「自動觸發」改為「手動觸發」，保留現有 UI/UX 設計，只添加必要功能。

---

## 🔍 現況分析

### **現有 UI 元素**（✅ 保留）
1. ✅ **頁面左側**：已有 AI 模型選擇器（不需重複）
2. ✅ **頁面上方**：「重新載入 AI 分析」按鈕（第 787-794 行）
3. ✅ **分析資訊區**：時間範圍卡片、事件總數卡片、分析時間卡片（第 812-883 行）
4. ✅ **時間範圍選擇器**：已有快速選項（1h, 6h, 12h, 24h, 7d, 30d）（第 885-911 行）

### **現有行為**（❌ 需修改）
```typescript
// 目前：進入頁面自動執行
useEffect(() => {
  loadF5WAFRisks()
}, [wafRisks.length, forceReload, selectedTimeRange])  // 時間變更也自動執行
```

---

## 🎯 修改計畫

### **Phase 1: 修改自動觸發邏輯** 🔧

#### **1.1 移除自動觸發**
```typescript
// 修改前：依賴多個變數，自動觸發
useEffect(() => {
  loadF5WAFRisks()
}, [wafRisks.length, forceReload, selectedTimeRange])

// 修改後：只在手動觸發時執行
const [analysisTriggered, setAnalysisTriggered] = useState(false)

useEffect(() => {
  if (analysisTriggered) {
    loadF5WAFRisks()
    setAnalysisTriggered(false)  // 重置觸發標記
  }
}, [analysisTriggered])
```

#### **1.2 修改時間範圍變更邏輯**
```typescript
// 修改前：時間變更自動重新分析
const handleTimeRangeChange = (timeRange: string) => {
  setSelectedTimeRange(timeRange)
  setWafRisks([])  // ❌ 清空資料並觸發重新載入
  setHasAttemptedLoad(false)
}

// 修改後：時間變更只更新選擇，不自動分析
const handleTimeRangeChange = (timeRange: string) => {
  setSelectedTimeRange(timeRange)
  setUseCustomDate(false)  // 切換到快速選項時，取消自定義模式
  // ✅ 不清空資料，不觸發重新載入
}
```

---

### **Phase 2: UI 調整** 🎨

#### **2.1 在時間範圍選擇器下方添加自定義日期選擇**

**現有結構**（第 885-911 行）：
```tsx
{/* 時間範圍選擇器 */}
<Card className="bg-slate-900/40 border-white/10 backdrop-blur-sm">
  <CardContent className="p-4">
    <div className="flex items-center gap-2 mb-3">
      <span className="text-sm font-semibold text-slate-300">時間範圍選擇：</span>
    </div>
    <div className="flex flex-wrap gap-2">
      {['1h', '6h', '12h', '24h', '7d', '30d'].map((range) => (
        <Button ... />
      ))}
    </div>
  </CardContent>
</Card>
```

**修改後**（添加自定義日期 + 分析按鈕）：
```tsx
{/* 時間範圍選擇器 */}
<Card className="bg-slate-900/40 border-white/10 backdrop-blur-sm">
  <CardContent className="p-4">
    {/* 快速時間選擇 */}
    <div className="flex items-center gap-2 mb-3">
      <Clock className="w-4 h-4 text-cyan-400" />
      <span className="text-sm font-semibold text-slate-300">快速時間選擇</span>
    </div>
    <div className="flex flex-wrap gap-2 mb-4">
      {['1h', '6h', '12h', '24h', '7d', '30d'].map((range) => (
        <Button
          key={range}
          onClick={() => handleTimeRangeChange(range)}
          disabled={isLoading}
          size="sm"
          variant="outline"
          className={`
            ${selectedTimeRange === range && !useCustomDate
              ? 'bg-cyan-600 border-cyan-500 text-white hover:bg-cyan-700' 
              : 'bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-slate-700/50'
            }
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {selectedTimeRange === range && !useCustomDate && (
            <CheckCircle className="w-3 h-3 mr-1" />
          )}
          {getTimeRangeLabel(range).replace('過去 ', '')}
        </Button>
      ))}
    </div>

    {/* 自定義日期範圍 */}
    <div className="mb-4 pt-3 border-t border-slate-700">
      <div className="flex items-center gap-2 mb-3">
        <CalendarIcon className="w-4 h-4 text-cyan-400" />
        <span className="text-sm font-semibold text-slate-300">或選擇自定義日期範圍</span>
      </div>
      <div className="flex gap-2 items-center">
        <CustomDatePicker
          selected={customDateRange.start}
          onSelect={(date) => {
            setCustomDateRange(prev => ({ ...prev, start: date }))
            setUseCustomDate(true)
          }}
          placeholder="開始日期"
          disabled={isLoading}
        />
        <span className="text-slate-400 text-sm">至</span>
        <CustomDatePicker
          selected={customDateRange.end}
          onSelect={(date) => {
            setCustomDateRange(prev => ({ ...prev, end: date }))
            setUseCustomDate(true)
          }}
          placeholder="結束日期"
          disabled={isLoading}
        />
      </div>
      {useCustomDate && customDateRange.start && customDateRange.end && (
        <div className="mt-2 text-xs text-cyan-400 flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          已選擇自定義日期範圍
        </div>
      )}
    </div>

    {/* 開始分析按鈕（大而顯眼）*/}
    <Button
      onClick={handleStartAnalysis}
      disabled={isLoading}
      className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold py-6 text-base shadow-lg"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          AI 分析中...
        </>
      ) : (
        <>
          <Sparkles className="w-5 h-5 mr-2" />
          開始 AI 分析
        </>
      )}
    </Button>

    {useCustomDate && customDateRange.start && customDateRange.end && !isLoading && (
      <div className="mt-2 text-xs text-slate-400 text-center">
        將分析 {format(customDateRange.start, 'yyyy-MM-dd HH:mm')} 至 {format(customDateRange.end, 'yyyy-MM-dd HH:mm')} 的日誌
      </div>
    )}
  </CardContent>
</Card>
```

#### **2.2 修改「重新載入 AI 分析」按鈕文字**

```typescript
// 修改前（第 787-794 行）
<Button
  onClick={handleReload}
  disabled={isLoading}
  className="ml-auto bg-cyan-600 hover:bg-cyan-700 text-white"
>
  <Sparkles className="w-4 h-4 mr-2" />
  {isLoading ? '載入中...' : '重新載入 AI 分析'}
</Button>

// 修改後（改為「重新分析」）
<Button
  onClick={handleReload}
  disabled={isLoading}
  className="ml-auto bg-cyan-600 hover:bg-cyan-700 text-white"
>
  <Sparkles className="w-4 h-4 mr-2" />
  {isLoading ? '分析中...' : '重新分析'}
</Button>
```

#### **2.3 添加空狀態提示（未開始分析時）**

在現有的錯誤提示區域下方（約第 920 行之後）添加：

```tsx
{/* 未開始分析的空狀態 */}
{!hasAttemptedLoad && wafRisks.length === 0 && !isLoading && !error && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
  >
    <Card className="bg-slate-900/40 border-white/10 backdrop-blur-sm">
      <CardContent className="py-16 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-cyan-500/10 flex items-center justify-center">
            <Activity className="w-10 h-10 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">準備開始 AI 分析</h3>
            <p className="text-slate-400 max-w-md">
              請在上方選擇時間範圍（快速選項或自定義日期），然後點擊「開始 AI 分析」按鈕
            </p>
          </div>
          <div className="flex items-center gap-6 mt-4 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold">1</div>
              <span>選擇時間範圍</span>
            </div>
            <div className="text-slate-600">→</div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold">2</div>
              <span>開始 AI 分析</span>
            </div>
            <div className="text-slate-600">→</div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold">3</div>
              <span>查看結果</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
)}
```

---

### **Phase 3: 添加狀態管理** 📊

#### **3.1 新增狀態變數**

```typescript
// 在現有的 useState 區域添加（約第 77-91 行）

// 分析觸發狀態
const [analysisTriggered, setAnalysisTriggered] = useState(false)

// 自定義日期範圍
const [customDateRange, setCustomDateRange] = useState<{
  start: Date | undefined
  end: Date | undefined
}>({
  start: undefined,
  end: undefined
})

// 是否使用自定義日期
const [useCustomDate, setUseCustomDate] = useState(false)
```

#### **3.2 添加手動觸發函數**

```typescript
// 在現有的 handleReload 函數附近添加（約第 257-272 行）

// 開始 AI 分析
const handleStartAnalysis = () => {
  // 驗證設定
  const aiProvider = localStorage.getItem('aiProvider') || 'ollama'
  const apiKey = localStorage.getItem('geminiApiKey') || ''
  
  if (aiProvider === 'gemini' && !apiKey) {
    toast({
      title: "設定錯誤",
      description: "請先在左側設定 Gemini API Key 或切換至 Ollama",
      variant: "destructive"
    })
    return
  }
  
  // 驗證時間範圍
  if (useCustomDate) {
    if (!customDateRange.start || !customDateRange.end) {
      toast({
        title: "日期範圍錯誤",
        description: "請選擇完整的開始和結束日期",
        variant: "destructive"
      })
      return
    }
    
    // 驗證結束日期必須大於開始日期
    if (customDateRange.end <= customDateRange.start) {
      toast({
        title: "日期範圍錯誤",
        description: "結束日期必須大於開始日期",
        variant: "destructive"
      })
      return
    }
    
    // 驗證日期範圍不超過 30 天
    const daysDiff = (customDateRange.end.getTime() - customDateRange.start.getTime()) / (1000 * 60 * 60 * 24)
    if (daysDiff > 30) {
      toast({
        title: "日期範圍過大",
        description: "自定義日期範圍不能超過 30 天",
        variant: "destructive"
      })
      return
    }
  }
  
  // 清空舊資料
  setWafRisks([])
  setError(null)
  setHasAttemptedLoad(false)
  
  // 觸發分析
  setAnalysisTriggered(true)
  
  const timeRangeText = useCustomDate 
    ? `${format(customDateRange.start!, 'yyyy-MM-dd HH:mm')} 至 ${format(customDateRange.end!, 'yyyy-MM-dd HH:mm')}`
    : getTimeRangeLabel(selectedTimeRange)
  
  toast({
    title: "🚀 開始分析",
    description: `正在分析 ${timeRangeText} 的 F5 WAF 日誌...`,
  })
}
```

#### **3.3 更新 API 調用函數**

```typescript
// 修改現有的 loadF5WAFRisks 函數（約第 162-254 行）

const loadF5WAFRisks = async () => {
  console.log('🔄 開始載入 F5 WAF 風險分析...')
  setIsLoading(true)
  setError(null)

  try {
    const aiProvider = localStorage.getItem('aiProvider') || 'ollama'
    const apiKey = localStorage.getItem('geminiApiKey') || ''
    const aiModel = aiProvider === 'ollama' 
      ? (localStorage.getItem('ollamaModel') || 'gpt-oss:20b')
      : 'gemini-2.0-flash-exp'

    console.log(`🤖 AI 提供者: ${aiProvider}`)
    console.log(`🤖 AI 模型: ${aiModel}`)

    // 準備時間範圍參數
    let timeRangeParam
    if (useCustomDate && customDateRange.start && customDateRange.end) {
      // 使用自定義日期範圍
      timeRangeParam = {
        start: customDateRange.start.toISOString(),
        end: customDateRange.end.toISOString()
      }
      console.log(`📅 使用自定義日期範圍: ${timeRangeParam.start} 至 ${timeRangeParam.end}`)
    } else {
      // 使用快速時間選項
      timeRangeParam = selectedTimeRange
      console.log(`⏰ 使用快速時間選項: ${selectedTimeRange}`)
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
        timeRange: timeRangeParam  // 可以是字符串或對象
      })
    })

    // ... 其餘邏輯保持不變
  } catch (err) {
    // ... 錯誤處理保持不變
  } finally {
    setIsLoading(false)
    setHasAttemptedLoad(true)
  }
}
```

---

### **Phase 4: 後端支持（可選但建議）** ⚙️

#### **4.1 修改後端路由以支持自定義日期**

**文件**: `backend/routes/f5.routes.js` 和 `backend/routes/cloudflare.routes.js`

```javascript
// 修改前：只支持字符串時間範圍
const timeRange = req.body.timeRange || '24h'

// 修改後：支持字符串或對象
const timeRange = req.body.timeRange || '24h'
let timeRangeConfig

if (typeof timeRange === 'string') {
  // 快速選項：'1h', '6h', '24h' 等
  timeRangeConfig = {
    range: timeRange
  }
} else if (typeof timeRange === 'object' && timeRange.start && timeRange.end) {
  // 自定義日期範圍
  timeRangeConfig = {
    start: new Date(timeRange.start),
    end: new Date(timeRange.end)
  }
  
  // 驗證日期範圍
  const daysDiff = (timeRangeConfig.end - timeRangeConfig.start) / (1000 * 60 * 60 * 24)
  if (daysDiff > 30) {
    return res.status(400).json({
      success: false,
      error: '日期範圍不能超過 30 天'
    })
  }
} else {
  return res.status(400).json({
    success: false,
    error: '無效的時間範圍參數'
  })
}

// 傳遞給分析服務
const result = await f5WAFRiskService.analyzeWAFRisks(timeRangeConfig, ...)
```

#### **4.2 更新 ELK 查詢邏輯**

**文件**: `backend/config/timeRangeConfig.js`（需要檢查是否存在此文件）

```javascript
// 添加對自定義日期範圍的支持
function getTimeRangeQuery(timeRangeConfig) {
  if (timeRangeConfig.range) {
    // 快速選項
    return {
      gte: `now-${timeRangeConfig.range}`,
      lte: 'now'
    }
  } else if (timeRangeConfig.start && timeRangeConfig.end) {
    // 自定義日期範圍
    return {
      gte: timeRangeConfig.start.toISOString(),
      lte: timeRangeConfig.end.toISOString()
    }
  }
}
```

---

## 📁 需要修改的文件清單

| 文件 | 修改內容 | 優先級 | 預估時間 |
|------|---------|--------|---------|
| `frontend/app/ai-analysis/f5/page.tsx` | 1. 移除自動觸發<br>2. 添加手動觸發邏輯<br>3. 添加自定義日期選擇器<br>4. 修改 UI（時間選擇區 + 分析按鈕）<br>5. 添加空狀態提示 | 🔴 必須 | 60 分鐘 |
| `frontend/app/ai-analysis/cloudflare/page.tsx` | 同上（與 F5 相同邏輯） | 🔴 必須 | 60 分鐘 |
| `backend/routes/f5.routes.js` | 支持自定義日期範圍參數 | 🟡 建議 | 15 分鐘 |
| `backend/routes/cloudflare.routes.js` | 支持自定義日期範圍參數 | 🟡 建議 | 15 分鐘 |
| `backend/config/timeRangeConfig.js` | 更新時間範圍查詢邏輯 | 🟡 建議 | 10 分鐘 |

**總計預估時間**: 2.5 - 3 小時

---

## 🎨 修改後的 UI 效果圖

### **1. 初始狀態（未開始分析）**

```
┌─────────────────────────────────────────────────────┐
│ AI Cyber Security Analysis - F5        [重新分析]   │
├─────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │
│ │ ⏰ 時間範圍  │ │ 📊 事件總數 │ │ 🕒 分析時間 │   │
│ │   (未選擇)  │ │   0 筆      │ │   --        │   │
│ └─────────────┘ └─────────────┘ └─────────────┘   │
│                                                      │
│ ┌──────────── 時間範圍選擇器 ──────────────┐       │
│ │ ⏰ 快速時間選擇                           │       │
│ │ [1小時] [6小時] [12小時] [✓24小時] ...    │       │
│ │                                           │       │
│ │ 📅 或選擇自定義日期範圍                   │       │
│ │ [開始日期 ▼] 至 [結束日期 ▼]             │       │
│ │                                           │       │
│ │ [🚀 開始 AI 分析]  ← 大按鈕              │       │
│ └───────────────────────────────────────────┘       │
│                                                      │
│ ┌──────────────────────────────────────────┐       │
│ │          準備開始 AI 分析                 │       │
│ │                                           │       │
│ │  請選擇時間範圍，然後點擊「開始 AI 分析」 │       │
│ │                                           │       │
│ │  ① 選擇時間 → ② 開始分析 → ③ 查看結果    │       │
│ └──────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────┘
```

### **2. 分析中狀態**

```
┌─────────────────────────────────────────────────────┐
│ AI Cyber Security Analysis - F5    [分析中...]      │
├─────────────────────────────────────────────────────┤
│ ┌──────────── 時間範圍選擇器 ──────────────┐       │
│ │ [🔄 AI 分析中...]  ← 按鈕禁用            │       │
│ └───────────────────────────────────────────┘       │
│                                                      │
│ ┌──────────────────────────────────────────┐       │
│ │        ⏳ 正在進行 AI 分析                │       │
│ │                                           │       │
│ │   分析時間範圍: 過去 24 小時              │       │
│ │                                           │       │
│ │   ⏳ 正在從 ELK 查詢 F5 WAF 日誌...       │       │
│ │   🔍 正在使用多層次判斷模型分析攻擊...     │       │
│ │   🤖 正在生成 AI 深度分析報告...          │       │
│ └──────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────┘
```

### **3. 分析完成狀態**

```
┌─────────────────────────────────────────────────────┐
│ AI Cyber Security Analysis - F5        [重新分析]   │
├─────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │
│ │ ⏰ 時間範圍  │ │ 📊 事件總數 │ │ 🕒 分析時間 │   │
│ │ 過去24小時  │ │ 1,234 筆   │ │ 2分鐘前     │   │
│ └─────────────┘ └─────────────┘ └─────────────┘   │
│                                                      │
│ ┌──────────── 時間範圍選擇器 ──────────────┐       │
│ │ [🚀 開始 AI 分析]                        │       │
│ └───────────────────────────────────────────┘       │
│                                                      │
│ ✅ 分析完成 - 檢測到 15 個安全風險                  │
│                                                      │
│ [風險列表顯示...]                                   │
└─────────────────────────────────────────────────────┘
```

---

## ⚠️ 關鍵修改要點

### **1. 不移除「重新載入」按鈕**
- ✅ 保留現有的「重新載入 AI 分析」按鈕（改為「重新分析」）
- ✅ 功能相同：清空資料並重新觸發分析

### **2. 不添加 AI 模型選擇器**
- ✅ 頁面左側已有 AI 模型選擇
- ✅ 不在時間選擇區重複添加

### **3. 保留現有卡片布局**
- ✅ 保留「時間範圍」、「事件總數」、「分析時間」三個卡片
- ✅ 只修改「時間範圍選擇器」卡片的內容

### **4. 自定義日期驗證**
- ✅ 結束日期必須大於開始日期
- ✅ 日期範圍不超過 30 天
- ✅ 清晰的錯誤提示

---

## 🧪 測試檢查清單

### **功能測試**
- [ ] 進入頁面不自動執行分析
- [ ] 顯示空狀態提示（步驟指引）
- [ ] 點擊快速時間選項（1h, 6h, 12h, 24h, 7d, 30d）正常切換
- [ ] 選擇自定義日期範圍正常工作
- [ ] 點擊「開始 AI 分析」正確觸發分析
- [ ] 分析中按鈕顯示為禁用狀態
- [ ] 分析完成後顯示結果
- [ ] 點擊「重新分析」清空並重新載入
- [ ] 更改時間範圍後需要手動點擊「開始分析」

### **驗證測試**
- [ ] 未選擇自定義日期時點擊分析 → 使用快速選項
- [ ] 只選擇開始日期 → 顯示錯誤提示
- [ ] 只選擇結束日期 → 顯示錯誤提示
- [ ] 結束日期 ≤ 開始日期 → 顯示錯誤提示
- [ ] 日期範圍 > 30 天 → 顯示錯誤提示
- [ ] 使用 Gemini 但無 API Key → 顯示錯誤提示

### **UI/UX 測試**
- [ ] 空狀態提示清晰易懂
- [ ] 選中的時間範圍有視覺反饋
- [ ] 分析按鈕足夠顯眼
- [ ] 載入狀態有明確提示
- [ ] Toast 通知正確顯示
- [ ] 響應式布局正常（桌面/平板/手機）

### **兼容性測試**
- [ ] F5 頁面正常工作
- [ ] Cloudflare 頁面正常工作
- [ ] 自定義日期在兩個頁面都正常
- [ ] 後端正確處理兩種時間範圍格式

---

## 📝 實作步驟建議

### **Step 1: 前端基礎修改**（30 分鐘）
1. 添加新的狀態變數
2. 修改 useEffect 移除自動觸發
3. 添加 handleStartAnalysis 函數

### **Step 2: UI 修改**（40 分鐘）
1. 修改時間範圍選擇器卡片
2. 添加自定義日期選擇器
3. 添加「開始 AI 分析」按鈕
4. 添加空狀態提示組件

### **Step 3: API 調用調整**（20 分鐘）
1. 修改 loadF5WAFRisks 函數支持自定義日期
2. 添加日期範圍驗證
3. 更新 Toast 通知

### **Step 4: 測試與調整**（30 分鐘）
1. 測試所有功能點
2. 調整 UI 細節
3. 修復發現的問題

### **Step 5: Cloudflare 頁面同步**（40 分鐘）
1. 將 F5 的修改複製到 Cloudflare
2. 測試 Cloudflare 頁面
3. 確保兩個頁面行為一致

### **Step 6: 後端支持（可選）**（25 分鐘）
1. 修改 routes 支持自定義日期
2. 更新時間範圍查詢邏輯
3. 添加日期範圍驗證

---

## 🎯 預期成果

### **用戶操作流程**
1. **進入頁面** → 看到空狀態提示和步驟指引
2. **選擇時間** → 點擊快速選項或選擇自定義日期
3. **開始分析** → 點擊大按鈕觸發 AI 分析
4. **查看結果** → 分析完成後查看風險列表
5. **重新分析** → 可以更改時間並再次分析

### **優勢**
- ✅ 用戶完全掌控何時開始分析
- ✅ 減少不必要的 API 調用
- ✅ 支持靈活的時間範圍選擇
- ✅ 清晰的視覺反饋和指引
- ✅ 保持現有 UI/UX 設計風格

---

## 🚀 總結

**修改範圍**: 精簡且專注  
**實作難度**: ⭐⭐ 中等  
**預估時間**: 2.5 - 3 小時  
**影響範圍**: 
- 前端：2 個頁面（F5 + Cloudflare）
- 後端：2 個路由（可選）

**核心改動**：
1. ❌ 移除自動觸發
2. ✅ 添加手動觸發按鈕
3. ✅ 添加自定義日期選擇
4. ✅ 保留現有 UI 布局和設計

請確認此計畫是否符合您的需求！

