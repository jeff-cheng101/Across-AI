"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Shield, TrendingUp, AlertTriangle, CheckCircle, XCircle, Globe, Clock, Sparkles, Calendar, Activity } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useWAFData } from "@/app/dashboard/waf-data-context"

export default function CloudflareAIAnalysisPage() {
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("high")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [forceReload, setForceReload] = useState(0) // 強制重新載入計數器
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false) // 防止無限循環
  
  // 新增：時間範圍和分析資訊
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h')
  const [analysisMetadata, setAnalysisMetadata] = useState({
    totalEvents: 0,
    timeRange: { start: '', end: '' },
    analysisTimestamp: ''
  })

  const { wafRisks, setWafRisks } = useWAFData()

  useEffect(() => {
    // ⭐ 從後端 API 載入 Cloudflare WAF 風險分析資料
    const loadCloudflareWAFRisks = async () => {
      // 如果已經嘗試過載入且有資料，就不再重複
      if (hasAttemptedLoad && wafRisks.length > 0) {
        console.log('✅ 已完成載入，跳過')
        return
      }
      
      // 如果已經有真實資料，跳過
      if (wafRisks.length > 0) {
        console.log('✅ 已有真實 WAF 風險資料，跳過載入')
        return
      }

      console.log('🔄 開始載入 Cloudflare WAF 風險分析...')
      setIsLoading(true)
      setError(null)

      try {
        // 從 localStorage 讀取配置
        const aiProvider = localStorage.getItem('aiProvider') || 'ollama' // 預設使用 Ollama
        const apiKey = localStorage.getItem('geminiApiKey') || process.env.NEXT_PUBLIC_GEMINI_API_KEY || ''
        const aiModel = aiProvider === 'ollama' 
          ? (localStorage.getItem('ollamaModel') || 'gemma3:4b')  // ✅ 改用 gemma3:4b
          : 'gemini-2.0-flash-exp'

        console.log(`🤖 AI 提供者: ${aiProvider}`)
        console.log(`🤖 AI 模型: ${aiModel}`)

        // 如果使用 Gemini 但沒有 API Key
        if (aiProvider === 'gemini' && !apiKey) {
          console.error('❌ 未設定 Gemini API Key')
          setError('請先設定 Gemini API Key 或切換至 Ollama')
          setIsLoading(false)
          setHasAttemptedLoad(true)
          return
        }

        // 呼叫後端 API (使用新的產品專屬端點)
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

        if (!response.ok) {
          throw new Error(`API 請求失敗: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        console.log('✅ 成功載入 Cloudflare WAF 風險資料:', data)

        // 保存分析 metadata
        if (data.metadata) {
          setAnalysisMetadata({
            totalEvents: data.metadata.totalEvents || 0,
            timeRange: data.metadata.timeRange || { start: '', end: '' },
            analysisTimestamp: data.metadata.analysisTimestamp || new Date().toISOString()
          })
        }

        if (data.success && data.risks && data.risks.length > 0) {
          console.log(`📊 載入了 ${data.risks.length} 個風險項目`)
          setWafRisks(data.risks)
        } else {
          console.warn('⚠️ API 回傳空資料')
          
          // 根據 totalEvents 判斷是真的沒有威脅，還是沒有數據
          const totalEvents = data.metadata?.totalEvents || 0
          if (totalEvents > 0) {
            // 有數據但沒有檢測到威脅
            setError('未檢測到任何安全威脅')
          } else {
            // 沒有足夠的日誌數據
            setError('ELK 中沒有足夠的日誌數據，請持續觀察並監控')
          }
          
          setWafRisks([]) // 清空風險列表
        }

      } catch (err) {
        console.error('❌ 載入 Cloudflare WAF 風險分析失敗:', err)
        setError(err instanceof Error ? err.message : '未知錯誤')
        setWafRisks([]) // 清空風險列表，不載入假資料
      } finally {
        setIsLoading(false)
        setHasAttemptedLoad(true) // 標記已嘗試載入
      }
    }

    // 執行載入
    loadCloudflareWAFRisks()
  }, [wafRisks.length, setWafRisks, forceReload, selectedTimeRange]) // 加入 selectedTimeRange 依賴

  // 手動重新載入函數
  const handleReload = () => {
    console.log('🔄 手動觸發重新載入...')
    setWafRisks([]) // 清除現有資料
    setHasAttemptedLoad(false) // 重置載入標記
    setError(null) // 清除錯誤
    setForceReload(prev => prev + 1) // 觸發 useEffect
  }

  // 時間範圍改變處理
  const handleTimeRangeChange = (timeRange: string) => {
    console.log(`⏰ 時間範圍變更: ${timeRange}`)
    setSelectedTimeRange(timeRange)
    setWafRisks([]) // 清除現有資料
    setHasAttemptedLoad(false) // 重設標記，觸發重新載入
  }

  // 格式化數字（添加千分位）
  const formatNumber = (num: number) => {
    return num.toLocaleString('zh-TW')
  }

  // 格式化時間範圍顯示
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

  // 格式化相對時間
  const getRelativeTime = (isoString: string) => {
    if (!isoString) return ''
    const now = new Date().getTime()
    const then = new Date(isoString).getTime()
    const diff = Math.floor((now - then) / 1000) // 秒

    if (diff < 60) return '剛剛'
    if (diff < 3600) return `${Math.floor(diff / 60)} 分鐘前`
    if (diff < 86400) return `${Math.floor(diff / 3600)} 小時前`
    if (diff < 604800) return `${Math.floor(diff / 86400)} 天前`
    return formatDateTime(isoString)
  }

  const risksByCategory = {
    high: wafRisks.filter((r) => r.severity === "critical" || r.severity === "high"),
    medium: wafRisks.filter((r) => r.severity === "medium"),
    low: wafRisks.filter((r) => r.severity === "low"),
  }

  const categoryStats = {
    high: {
      count: risksByCategory.high.length,
      openIssues: risksByCategory.high.reduce((sum, r) => sum + r.openIssues, 0),
      affectedAssets: risksByCategory.high.reduce((sum, r) => sum + r.affectedAssets, 0),
    },
    medium: {
      count: risksByCategory.medium.length,
      openIssues: risksByCategory.medium.reduce((sum, r) => sum + r.openIssues, 0),
      affectedAssets: risksByCategory.medium.reduce((sum, r) => sum + r.affectedAssets, 0),
    },
    low: {
      count: risksByCategory.low.length,
      openIssues: risksByCategory.low.reduce((sum, r) => sum + r.openIssues, 0),
      affectedAssets: risksByCategory.low.reduce((sum, r) => sum + r.affectedAssets, 0),
    },
  }

  useEffect(() => {
    if (risksByCategory[selectedCategory as keyof typeof risksByCategory].length > 0 && !selectedIssue) {
      setSelectedIssue(risksByCategory[selectedCategory as keyof typeof risksByCategory][0].id)
    }
  }, [selectedCategory, selectedIssue])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-900/50 border-red-500/50"
      case "high":
        return "bg-orange-900/50 border-orange-500/50"
      case "medium":
        return "bg-yellow-900/50 border-yellow-500/50"
      case "low":
        return "bg-blue-900/50 border-blue-500/50"
      default:
        return "bg-slate-900/50 border-slate-500/50"
    }
  }

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500/20 text-red-400 border-red-500/50"
      case "high":
        return "bg-orange-500/20 text-orange-400 border-orange-500/50"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
      case "low":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/50"
    }
  }

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case "critical":
        return "嚴重"
      case "high":
        return "高"
      case "medium":
        return "中"
      case "low":
        return "低"
      default:
        return severity
    }
  }

  const totalOpenIssues = wafRisks.reduce((sum, risk) => sum + risk.openIssues, 0)
  const totalAffectedAssets = wafRisks.reduce((sum, risk) => sum + risk.affectedAssets, 0)

  return (
    <div className="min-h-screen bg-[#08131D] p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-white">AI Cyber Security Analysis - Cloudflare</h1>
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
        <p className="text-slate-400">
          基於 Cloudflare 安全數據的智能分析與建議 | 總計 {totalOpenIssues} 個開放問題，影響 {totalAffectedAssets}{" "}
          個資產
        </p>
        {error && (
          <div className="mt-2 p-3 bg-red-900/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
            ⚠️ {error}
          </div>
        )}
      </motion.div>

      {/* 分析資訊區 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* 時間範圍卡片 */}
          <Card className="bg-slate-900/40 border-cyan-500/30 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-semibold text-slate-300">時間範圍</span>
              </div>
              <div className="text-2xl font-bold text-cyan-400 mb-1">
                {getTimeRangeLabel(selectedTimeRange)}
              </div>
              {analysisMetadata.timeRange.start && (
                <div className="text-xs text-slate-400 space-y-0.5">
                  <div>{formatDateTime(analysisMetadata.timeRange.start)}</div>
                  <div className="text-center">至</div>
                  <div>{formatDateTime(analysisMetadata.timeRange.end)}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 事件總數卡片 */}
          <Card className={`bg-slate-900/40 backdrop-blur-sm ${
            analysisMetadata.totalEvents > 0 ? 'border-green-500/30' : 'border-yellow-500/30'
          }`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-green-400" />
                <span className="text-sm font-semibold text-slate-300">事件總數</span>
              </div>
              <div className={`text-2xl font-bold mb-1 ${
                analysisMetadata.totalEvents > 0 ? 'text-green-400' : 'text-yellow-400'
              }`}>
                {formatNumber(analysisMetadata.totalEvents)} 筆
              </div>
              <div className={`text-xs flex items-center gap-1 ${
                analysisMetadata.totalEvents > 0 ? 'text-green-400' : 'text-yellow-400'
              }`}>
                {analysisMetadata.totalEvents > 0 ? (
                  <>
                    <CheckCircle className="w-3 h-3" />
                    <span>已連接 ELK</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3 h-3" />
                    <span>無數據</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 最後分析時間卡片 */}
          <Card className="bg-slate-900/40 border-purple-500/30 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-semibold text-slate-300">最後分析</span>
              </div>
              <div className="text-2xl font-bold text-purple-400 mb-1">
                {getRelativeTime(analysisMetadata.analysisTimestamp)}
              </div>
              {analysisMetadata.analysisTimestamp && (
                <div className="text-xs text-slate-400">
                  {formatDateTime(analysisMetadata.analysisTimestamp)}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 時間範圍選擇器 */}
        <Card className="bg-slate-900/40 border-white/10 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-semibold text-slate-300">時間範圍選擇：</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {['1h', '6h', '12h', '24h', '7d', '30d'].map((range) => (
                <Button
                  key={range}
                  onClick={() => handleTimeRangeChange(range)}
                  disabled={isLoading}
                  variant="outline"
                  className={`
                    ${selectedTimeRange === range 
                      ? 'bg-cyan-600 border-cyan-500 text-white hover:bg-cyan-700 hover:text-white' 
                      : 'bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500'
                    }
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {selectedTimeRange === range && <CheckCircle className="w-3 h-3 mr-1" />}
                  {getTimeRangeLabel(range).replace('過去 ', '')}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 空狀態顯示 */}
      {!isLoading && wafRisks.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center py-20"
        >
          <div className="bg-slate-900/40 border border-white/10 backdrop-blur-sm rounded-lg p-12 max-w-2xl text-center">
            <Shield className="w-24 h-24 text-slate-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">
              {error?.includes('ELK 中沒有足夠的日誌數據') 
                ? '日誌數據不足' 
                : error?.includes('未檢測到任何安全威脅') 
                  ? '未檢測到安全威脅' 
                  : error 
                    ? '無法載入資料' 
                    : '未檢測到安全威脅'}
            </h2>
            <p className="text-slate-400 mb-6">
              {error?.includes('ELK 中沒有足夠的日誌數據')
                ? 'ELK 中沒有足夠的 Cloudflare WAF 日誌數據進行分析。請確認日誌來源配置正確，並持續觀察監控。建議檢查 Cloudflare 日誌是否正常推送到 ELK，或調整時間範圍以包含更多數據。'
                : error?.includes('未檢測到任何安全威脅')
                  ? '在指定時間範圍內，Cloudflare WAF 已成功分析日誌數據，未檢測到任何安全威脅。這表示系統目前運行正常，所有請求均通過安全檢查。請繼續保持監控。'
                  : error 
                    ? error 
                    : '在指定時間範圍內，未從 Cloudflare WAF 日誌中檢測到任何安全威脅。系統運行正常。'}
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={handleReload}
                className="bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                重新載入分析
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Three Column Layout */}
      {wafRisks.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Column 1: 風險評估 (Risk Assessment) - Category Cards */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-3"
        >
          <Card className="bg-slate-900/40 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-cyan-400" />
                風險評估
              </CardTitle>
              <CardDescription className="text-slate-400">依嚴重程度分類</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                onClick={() => {
                  setSelectedCategory("high")
                  if (risksByCategory.high.length > 0) {
                    setSelectedIssue(risksByCategory.high[0].id)
                  }
                }}
                className={`p-5 rounded-lg border cursor-pointer transition-all duration-300 ${
                  selectedCategory === "high"
                    ? "border-red-400/60 bg-red-900/20 shadow-lg shadow-red-500/20"
                    : "border-red-500/30 bg-red-900/10 hover:border-red-400/40"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/50" variant="outline">
                      高風險
                    </Badge>
                    <div className="text-3xl font-bold text-red-400">{categoryStats.high.count}</div>
                  </div>
                  <div className="space-y-2 pt-3 border-t border-red-500/20">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">開放問題</span>
                      <span className="text-white font-semibold">{categoryStats.high.openIssues}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">受影響資產</span>
                      <span className="text-white font-semibold">{categoryStats.high.affectedAssets}</span>
                    </div>
                  </div>
                  <div className="text-xs text-red-400/80 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    需要立即處理
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                onClick={() => {
                  setSelectedCategory("medium")
                  if (risksByCategory.medium.length > 0) {
                    setSelectedIssue(risksByCategory.medium[0].id)
                  }
                }}
                className={`p-5 rounded-lg border cursor-pointer transition-all duration-300 ${
                  selectedCategory === "medium"
                    ? "border-yellow-400/60 bg-yellow-900/20 shadow-lg shadow-yellow-500/20"
                    : "border-yellow-500/30 bg-yellow-900/10 hover:border-yellow-400/40"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50" variant="outline">
                      中風險
                    </Badge>
                    <div className="text-3xl font-bold text-yellow-400">{categoryStats.medium.count}</div>
                  </div>
                  <div className="space-y-2 pt-3 border-t border-yellow-500/20">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">開放問題</span>
                      <span className="text-white font-semibold">{categoryStats.medium.openIssues}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">受影響資產</span>
                      <span className="text-white font-semibold">{categoryStats.medium.affectedAssets}</span>
                    </div>
                  </div>
                  <div className="text-xs text-yellow-400/80 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    建議盡快處理
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                onClick={() => {
                  setSelectedCategory("low")
                  if (risksByCategory.low.length > 0) {
                    setSelectedIssue(risksByCategory.low[0].id)
                  }
                }}
                className={`p-5 rounded-lg border cursor-pointer transition-all duration-300 ${
                  selectedCategory === "low"
                    ? "border-blue-400/60 bg-blue-900/20 shadow-lg shadow-blue-500/20"
                    : "border-blue-500/30 bg-blue-900/10 hover:border-blue-400/40"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50" variant="outline">
                      低風險
                    </Badge>
                    <div className="text-3xl font-bold text-blue-400">{categoryStats.low.count}</div>
                  </div>
                  <div className="space-y-2 pt-3 border-t border-blue-500/20">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">開放問題</span>
                      <span className="text-white font-semibold">{categoryStats.low.openIssues}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">受影響資產</span>
                      <span className="text-white font-semibold">{categoryStats.low.affectedAssets}</span>
                    </div>
                  </div>
                  <div className="text-xs text-blue-400/80 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    可排程處理
                  </div>
                </div>
              </motion.div>

              {risksByCategory[selectedCategory as keyof typeof risksByCategory].length > 0 && (
                <div className="pt-4 border-t border-white/10">
                  <div className="text-xs text-slate-400 mb-3">
                    {selectedCategory === "high" && "高風險項目"}
                    {selectedCategory === "medium" && "中風險項目"}
                    {selectedCategory === "low" && "低風險項目"}
                  </div>
                  <div className="space-y-2">
                    {risksByCategory[selectedCategory as keyof typeof risksByCategory].map((risk) => (
                      <div
                        key={risk.id}
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedIssue(risk.id)
                        }}
                        className={`p-3 rounded-lg border cursor-pointer transition-all text-sm ${
                          selectedIssue === risk.id
                            ? "border-cyan-400/60 bg-cyan-900/20"
                            : "border-white/10 bg-slate-800/30 hover:border-white/20"
                        }`}
                      >
                        <div className="text-white font-medium mb-1 line-clamp-2">{risk.title}</div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span>{risk.openIssues} 問題</span>
                          <span>•</span>
                          <span>{risk.affectedAssets} 資產</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Column 2: 趨勢分析 (Trend Analysis) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-6"
        >
          <Card className="bg-slate-900/40 border-white/10 backdrop-blur-sm h-full">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                趨勢分析
              </CardTitle>
              <CardDescription className="text-slate-400">詳細漏洞資訊與威脅情報</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedIssue && wafRisks.length > 0 ? (
                <motion.div
                  key={selectedIssue}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {wafRisks
                    .filter((a) => a.id === selectedIssue)
                    .map((assessment) => (
                      <div
                        key={assessment.id}
                        className={`p-6 rounded-lg border ${getSeverityColor(assessment.severity)}`}
                      >
                        {/* Header */}
                        <div className="mb-4">
                          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                            <Clock className="w-3 h-3" />
                            <span>Updated on: {assessment.updatedDate}</span>
                            <span>|</span>
                            <span>Created on: {assessment.createdDate}</span>
                          </div>
                          <h3 className="text-xl font-semibold text-white mb-3">{assessment.title}</h3>
                          <div className="flex flex-wrap gap-2">
                            {assessment.tags.map((tag, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="bg-red-500/20 text-red-400 border-red-500/50"
                              >
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-slate-300 leading-relaxed text-sm">{assessment.description}</p>
                        </div>

                        {assessment.cveId && (
                          <div className="mb-4 p-3 bg-slate-800/50 rounded-lg">
                            <div className="text-xs text-slate-400 mb-1">CVE 編號</div>
                            <div className="text-sm font-mono text-cyan-400">{assessment.cveId}</div>
                          </div>
                        )}

                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                          <div>
                            <div className="text-xs text-slate-400 mb-1">Open Issues</div>
                            <div className="text-2xl font-bold text-white">{assessment.openIssues}</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-400 mb-1">Resolved</div>
                            <div className="text-2xl font-bold text-green-400">{assessment.resolvedIssues}</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-400 mb-1">Affected Assets</div>
                            <div className="text-2xl font-bold text-orange-400">{assessment.affectedAssets}</div>
                          </div>
                        </div>

                        <div className="mt-6 p-4 bg-cyan-900/20 border border-cyan-500/30 rounded-lg">
                          <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="w-5 h-5 text-cyan-400" />
                            <h4 className="text-white font-semibold">AI 深度分析</h4>
                          </div>
                          <p className="text-slate-300 leading-relaxed text-sm">
                            {assessment.aiInsight || `根據威脅情報分析，檢測到 ${assessment.openIssues} 次攻擊事件，共影響 ${assessment.affectedAssets} 個資產。建議立即採取防護措施並監控相關日誌。`}
                          </p>
                        </div>
                      </div>
                    ))}
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                  <Globe className="w-16 h-16 mb-4 opacity-50" />
                  <p className="text-lg">請從左側選擇一個風險項目查看詳細分析</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Column 3: 執行建議按鈕 (Action Recommendations) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-3"
        >
          <Card className="bg-slate-900/40 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-cyan-400" />
                執行建議按鈕
              </CardTitle>
              <CardDescription className="text-slate-400">AI 推薦的修復措施</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedIssue && wafRisks.length > 0 ? (
                <motion.div
                  key={`action-${selectedIssue}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {wafRisks
                    .filter((a) => a.id === selectedIssue)
                    .map((assessment) => (
                      <div key={assessment.id} className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-amber-400 mb-3">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="font-semibold">RECOMMENDED ACTIONS</span>
                        </div>

                        {assessment.recommendations.map((rec, idx) => (
                          <div key={idx} className="p-4 rounded-lg bg-slate-800/50 border border-cyan-400/30">
                            <div className="flex items-start gap-3 mb-4">
                              
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="text-white font-medium">{rec.title}</h4>
                                  <Badge
                                    className={
                                      rec.priority === "high"
                                        ? "bg-red-500/20 text-red-400 border-red-500/50"
                                        : "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
                                    }
                                    variant="outline"
                                  >
                                    {rec.priority.toUpperCase()}
                                  </Badge>
                                </div>
                                <p className="text-xs text-slate-400">{rec.description}</p>
                              </div>
                            </div>

                            <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              執行此操作
                            </Button>
                          </div>
                        ))}

                        <div className="space-y-2 mt-6">
                          <div className="text-xs text-slate-400 mb-2">其他可用操作</div>
                          <Button
                            variant="outline"
                            className="w-full border-white/10 text-white hover:bg-white/5 bg-transparent"
                          >
                            生成詳細報告
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full border-white/10 text-white hover:bg-white/5 bg-transparent"
                          >
                            創建工單
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full border-white/10 text-white hover:bg-white/5 bg-transparent"
                          >
                            通知相關人員
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full border-white/10 text-white hover:bg-white/5 bg-transparent"
                          >
                            查看歷史趨勢
                          </Button>
                        </div>

                        <div className="mt-6 p-3 rounded-lg bg-red-900/20 border border-red-500/30">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-slate-400">風險等級</span>
                            <Badge className={getSeverityBadgeColor(assessment.severity)} variant="outline">
                              {getSeverityLabel(assessment.severity)}
                            </Badge>
                          </div>
                          <div className="text-xs text-slate-300">
                            {assessment.exploitInWild && "⚠️ 此漏洞已被確認在野外利用，"}
                            {assessment.internetExposed && "暴露於互聯網，"}
                            建議立即採取行動
                          </div>
                        </div>
                      </div>
                    ))}
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                  <XCircle className="w-16 h-16 mb-4 opacity-50" />
                  <p className="text-center">請先選擇一個風險項目以查看執行建議</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
      )}
    </div>
  )
}
