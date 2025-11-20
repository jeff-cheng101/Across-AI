"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Shield, TrendingUp, AlertTriangle, CheckCircle, XCircle, Globe, Clock, Sparkles, Calendar, Activity, RefreshCw, CalendarIcon, Loader2, ChevronDown, ChevronUp, FileText, ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CustomDatePicker } from "@/components/custom-date-picker"
import { format } from "date-fns"
import { useWAFData } from "@/app/dashboard/waf-data-context"
import { useToast } from "@/hooks/use-toast"
import { BACKEND_API_BASE_URL } from "@/app/util/api-config"

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
  
  // 手動分析控制
  const [analysisTriggered, setAnalysisTriggered] = useState(false)
  const [customDateRange, setCustomDateRange] = useState<{
    start: Date | undefined
    end: Date | undefined
  }>({
    start: undefined,
    end: undefined
  })
  const [useCustomDate, setUseCustomDate] = useState(false)
  const [customDateExpanded, setCustomDateExpanded] = useState(false)

  const { wafRisks, setWafRisks } = useWAFData()
  const { toast } = useToast()

  // 操作指引相關狀態
  const [expandedGuides, setExpandedGuides] = useState<Set<string>>(new Set())
  const [operationGuides, setOperationGuides] = useState<{[key: string]: any}>({})
  const [loadingGuides, setLoadingGuides] = useState<Set<string>>(new Set())

  // 載入 Cloudflare WAF 風險分析資料
  const loadCloudflareWAFRisks = async () => {
    console.log('🔄 開始載入 Cloudflare WAF 風險分析...')
    setIsLoading(true)
    setError(null)

    try {
      // 從 localStorage 讀取配置
      const aiProvider = localStorage.getItem('aiProvider') || 'ollama'
      const apiKey = localStorage.getItem('geminiApiKey') || process.env.NEXT_PUBLIC_GEMINI_API_KEY || ''
      const aiModel = aiProvider === 'ollama' 
        ? (localStorage.getItem('ollamaModel') || 'gpt-oss:20b')
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

      // 準備時間範圍參數
      let timeRangeParam
      if (useCustomDate && customDateRange.start && customDateRange.end) {
        timeRangeParam = {
          start: customDateRange.start.toISOString(),
          end: customDateRange.end.toISOString()
        }
        console.log(`📅 使用自定義日期範圍: ${timeRangeParam.start} 至 ${timeRangeParam.end}`)
      } else {
        timeRangeParam = selectedTimeRange
        console.log(`⏰ 使用快速時間選項: ${selectedTimeRange}`)
      }

      // 呼叫後端 API
      const response = await fetch(`${BACKEND_API_BASE_URL}/api/cloudflare/analyze-waf-risks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          aiProvider: aiProvider,
          apiKey: apiKey,
          model: aiModel,
          timeRange: timeRangeParam
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
        
        const totalEvents = data.metadata?.totalEvents || 0
        if (totalEvents > 0) {
          setError('未檢測到任何安全威脅')
        } else {
          setError('ELK 中沒有足夠的日誌數據，請持續觀察並監控')
        }
        
        setWafRisks([])
      }

    } catch (err) {
      console.error('❌ 載入 Cloudflare WAF 風險分析失敗:', err)
      setError(err instanceof Error ? err.message : '未知錯誤')
      setWafRisks([])
    } finally {
      setIsLoading(false)
      setHasAttemptedLoad(true)
    }
  }

  // 手動觸發分析
  useEffect(() => {
    if (analysisTriggered) {
      loadCloudflareWAFRisks()
      setAnalysisTriggered(false)
    }
  }, [analysisTriggered])

  // 開始 AI 分析（首次）
  const handleStartAnalysis = () => {
    console.log('🚀 首次開始 AI 分析')
    
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
    
    // 驗證自定義日期範圍
    if (useCustomDate) {
      if (!customDateRange.start || !customDateRange.end) {
        toast({
          title: "日期範圍錯誤",
          description: "請在下方選擇完整的開始和結束日期",
          variant: "destructive"
        })
        return
      }
      
      if (customDateRange.end <= customDateRange.start) {
        toast({
          title: "日期範圍錯誤",
          description: "結束日期必須大於開始日期",
          variant: "destructive"
        })
        return
      }
      
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
      description: `正在分析 ${timeRangeText} 的 Cloudflare WAF 日誌...`,
    })
  }

  // 重新分析
  const handleReAnalysis = () => {
    console.log('🔄 重新分析')
    
    // 驗證自定義日期範圍（如果使用）
    if (useCustomDate && (!customDateRange.start || !customDateRange.end)) {
      toast({
        title: "日期範圍錯誤",
        description: "請在下方選擇完整的開始和結束日期",
        variant: "destructive"
      })
      return
    }
    
    // 清空資料
    setWafRisks([])
    setHasAttemptedLoad(false)
    setError(null)
    
    // 觸發分析
    setAnalysisTriggered(true)
    
    const timeRangeText = useCustomDate 
      ? `${format(customDateRange.start!, 'yyyy-MM-dd HH:mm')} 至 ${format(customDateRange.end!, 'yyyy-MM-dd HH:mm')}`
      : getTimeRangeLabel(selectedTimeRange)
    
    toast({
      title: "🔄 重新分析",
      description: `正在重新分析 ${timeRangeText} 的 Cloudflare WAF 日誌...`,
    })
  }

  // 時間範圍改變處理（只更新選擇，不自動觸發）
  const handleTimeRangeChange = (timeRange: string) => {
    console.log(`⏰ 時間範圍變更: ${timeRange}`)
    setSelectedTimeRange(timeRange)
    setUseCustomDate(false)
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

  // 點擊「查看操作步驟」按鈕時的處理
  const handleExecuteAction = async (
    actionTitle: string, 
    actionDescription: string, 
    issueId: string,
    actionIndex: number
  ) => {
    const guideKey = `${issueId}-${actionIndex}`;
    
    // 如果已展開，則收起
    if (expandedGuides.has(guideKey)) {
      setExpandedGuides(prev => {
        const newSet = new Set(prev);
        newSet.delete(guideKey);
        return newSet;
      });
      return;
    }
    
    // 如果已有操作指引，直接展開
    if (operationGuides[guideKey]) {
      setExpandedGuides(prev => new Set(prev).add(guideKey));
      return;
    }
    
    // 載入操作指引
    setLoadingGuides(prev => new Set(prev).add(guideKey));
    
    try {
      const response = await fetch(`${BACKEND_API_BASE_URL}/api/cloudflare/get-operation-guide`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recommendationTitle: actionTitle,
          category: null
        })
      });
      
      const data = await response.json();
      
      if (data.success && data.guide) {
        setOperationGuides(prev => ({
          ...prev,
          [guideKey]: data.guide
        }));
        setExpandedGuides(prev => new Set(prev).add(guideKey));
        
        toast({
          title: "✅ 操作指引已載入",
          description: "請依照步驟完成設定"
        });
      } else {
        toast({
          title: "⚠️ 找不到操作指引",
          description: data.message || "暫無此操作的詳細步驟",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('載入操作指引失敗:', error);
      toast({
        title: "❌ 載入失敗",
        description: "無法取得操作指引，請稍後再試",
        variant: "destructive"
      });
    } finally {
      setLoadingGuides(prev => {
        const newSet = new Set(prev);
        newSet.delete(guideKey);
        return newSet;
      });
    }
  };

  // 操作完成處理
  const handleOperationComplete = (guideKey: string) => {
    setExpandedGuides(prev => {
      const newSet = new Set(prev);
      newSet.delete(guideKey);
      return newSet;
    });
    
    toast({
      title: "✅ 操作已完成",
      description: "已標記為完成，建議稍後檢查效果"
    });
  };

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
            onClick={hasAttemptedLoad ? handleReAnalysis : handleStartAnalysis}
            disabled={isLoading}
            className={`ml-auto ${
              hasAttemptedLoad 
                ? 'bg-cyan-600 hover:bg-cyan-700' 
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 shadow-lg'
            } text-white font-semibold px-6 py-2 transition-all`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                分析中...
              </>
            ) : hasAttemptedLoad ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                重新分析
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                開始 AI 分析
              </>
            )}
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
            {/* 快速時間選擇 */}
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-semibold text-slate-300">快速時間選擇</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {['1h', '6h', '12h', '24h', '7d', '30d'].map((range) => (
                <Button
                  key={range}
                  onClick={() => handleTimeRangeChange(range)}
                  disabled={isLoading}
                  size="sm"
                  variant="outline"
                  className={`
                    ${selectedTimeRange === range && !useCustomDate
                      ? 'bg-cyan-600 border-cyan-500 text-white hover:bg-cyan-700 hover:text-white' 
                      : 'bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500'
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

            {/* 自定義日期範圍（可折疊）*/}
            <div className="mt-4 pt-4 border-t border-slate-700">
              {/* 折疊標題 */}
              <div 
                onClick={() => setCustomDateExpanded(!customDateExpanded)}
                className="flex items-center justify-between cursor-pointer hover:bg-slate-800/30 p-2 rounded transition-colors"
              >
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-semibold text-slate-300">或選擇自定義日期範圍</span>
                  {useCustomDate && customDateRange.start && customDateRange.end && (
                    <Badge variant="outline" className="ml-2 bg-cyan-900/20 text-cyan-400 border-cyan-500/30 text-xs">
                      已選擇
                    </Badge>
                  )}
                </div>
                {customDateExpanded ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </div>

              {/* 可折疊內容 */}
              <AnimatePresence>
                {customDateExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 space-y-3">
                      {/* 日期選擇器 */}
                      <div className="flex gap-2 items-center flex-wrap">
                        <div className="flex-1 min-w-[200px]">
                          <CustomDatePicker
                            selected={customDateRange.start}
                            onSelect={(date) => {
                              setCustomDateRange(prev => ({ ...prev, start: date }))
                              setUseCustomDate(true)
                              setCustomDateExpanded(true)
                            }}
                            placeholder="選擇開始日期"
                            disabled={isLoading}
                          />
                        </div>
                        <span className="text-slate-400 text-sm">至</span>
                        <div className="flex-1 min-w-[200px]">
                          <CustomDatePicker
                            selected={customDateRange.end}
                            onSelect={(date) => {
                              setCustomDateRange(prev => ({ ...prev, end: date }))
                              setUseCustomDate(true)
                              setCustomDateExpanded(true)
                            }}
                            placeholder="選擇結束日期"
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                      
                      {/* 自定義日期提示 */}
                      {useCustomDate && customDateRange.start && customDateRange.end && (
                        <div className="p-2 bg-cyan-900/20 border border-cyan-500/30 rounded text-xs text-cyan-400 flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 flex-shrink-0" />
                          <span>
                            已選擇：{format(customDateRange.start, 'yyyy-MM-dd HH:mm')} 至 {format(customDateRange.end, 'yyyy-MM-dd HH:mm')}
                          </span>
                        </div>
                      )}
                      
                      {/* 清除按鈕 */}
                      {useCustomDate && (
                        <Button
                          onClick={() => {
                            setUseCustomDate(false)
                            setCustomDateRange({ start: undefined, end: undefined })
                            setCustomDateExpanded(false)
                          }}
                          disabled={isLoading}
                          variant="ghost"
                          size="sm"
                          className="text-slate-400 hover:text-white text-xs"
                        >
                          清除自定義日期
                        </Button>
                      )}
                      
                      {/* 使用說明（只在展開時顯示簡化版）*/}
                      <div className="p-3 bg-slate-800/50 border border-slate-600/50 rounded text-xs text-slate-400">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-slate-300 mb-1">使用說明</p>
                            <ul className="space-y-1 list-disc list-inside">
                              <li>自定義日期範圍最長 30 天</li>
                              <li>結束日期必須大於開始日期</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 空狀態顯示 */}
      {!isLoading && wafRisks.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <Card className="bg-slate-900/40 border-cyan-500/20 backdrop-blur-sm">
            <CardContent className="py-12 text-center">
              {/* 如果有錯誤，顯示錯誤提示 */}
              {error ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center">
                    <AlertTriangle className="w-10 h-10 text-red-400" />
                  </div>
                  <div className="max-w-2xl">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {error?.includes('ELK 中沒有足夠的日誌數據') 
                        ? '日誌數據不足' 
                        : error?.includes('未檢測到任何安全威脅') 
                          ? '未檢測到安全威脅' 
                          : '分析出現問題'}
                    </h3>
                    <p className="text-slate-400 text-base leading-relaxed">
                      {error?.includes('ELK 中沒有足夠的日誌數據')
                        ? 'ELK 中沒有足夠的 Cloudflare WAF 日誌數據進行分析。請確認日誌來源配置正確，並持續觀察監控。建議檢查 Cloudflare 日誌是否正常推送到 ELK，或調整時間範圍以包含更多數據。'
                        : error?.includes('未檢測到任何安全威脅')
                          ? '在指定時間範圍內，Cloudflare WAF 已成功分析日誌數據，未檢測到任何安全威脅。這表示系統目前運行正常，所有請求均通過安全檢查。請繼續保持監控。'
                          : error}
                    </p>
                  </div>
                  <Button
                    onClick={handleReAnalysis}
                    className="mt-4 bg-cyan-600 hover:bg-cyan-700 text-white"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    重新分析
                  </Button>
                </div>
              ) : (
                /* 未開始分析，顯示引導提示 */
                <div className="flex flex-col items-center gap-4">
                  {/* 圖標 */}
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                    <Activity className="w-10 h-10 text-cyan-400" />
                  </div>
                  
                  {/* 標題與說明 */}
                  <div className="max-w-2xl">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      準備開始 AI 安全分析
                    </h3>
                    <p className="text-slate-400 text-base leading-relaxed">
                      選擇時間範圍後，點擊右上角「開始 AI 分析」按鈕，系統將使用 Cloudflare WAF 日誌進行分析並生成安全報告
                    </p>
                  </div>
                  
                  {/* 步驟指引 */}
                  <div className="flex items-center gap-6 mt-6">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-cyan-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        1
                      </div>
                      <span className="text-sm text-slate-300">選擇時間範圍</span>
                    </div>
                    
                    <div className="text-cyan-500 text-2xl">→</div>
                    
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-cyan-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        2
                      </div>
                      <span className="text-sm text-slate-300">開始 AI 分析</span>
                    </div>
                    
                    <div className="text-cyan-500 text-2xl">→</div>
                    
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-cyan-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        3
                      </div>
                      <span className="text-sm text-slate-300">查看安全報告</span>
                    </div>
                  </div>
                  
                  {/* 快速開始提示 */}
                  <div className="mt-6 p-4 bg-cyan-900/20 border border-cyan-500/30 rounded-lg max-w-lg">
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                      <p className="text-sm text-cyan-300 text-left">
                        <strong>快速開始：</strong>
                        使用預設的「24 小時」範圍，直接點擊右上角「開始 AI 分析」按鈕
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
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

                        {assessment.recommendations.map((rec, idx) => {
                          const guideKey = `${assessment.id}-${idx}`;
                          const isExpanded = expandedGuides.has(guideKey);
                          const guide = operationGuides[guideKey];
                          const isLoading = loadingGuides.has(guideKey);

                          return (
                            <div key={idx} className="space-y-2">
                              {/* 建議卡片 */}
                              <div className="p-4 rounded-lg bg-slate-800/50 border border-cyan-400/30">
                                <div className="flex items-start gap-3 mb-4">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h4 className="text-white font-medium">{rec.title}</h4>
                                      {rec.priority && (
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
                                      )}
                                    </div>
                                    <p className="text-xs text-slate-400">{rec.description}</p>
                                  </div>
                                </div>

                                <Button
                                  onClick={() => handleExecuteAction(rec.title, rec.description, assessment.id, idx)}
                                  disabled={isLoading}
                                  className={`w-full ${
                                    isExpanded
                                      ? "bg-slate-600 hover:bg-slate-700"
                                      : "bg-cyan-600 hover:bg-cyan-700"
                                  } text-white`}
                                >
                                  {isLoading ? (
                                    <>
                                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                      載入中...
                                    </>
                                  ) : isExpanded ? (
                                    <>
                                      <ChevronUp className="w-4 h-4 mr-2" />
                                      收起操作步驟
                                    </>
                                  ) : (
                                    <>
                                      <FileText className="w-4 h-4 mr-2" />
                                      查看操作步驟
                                    </>
                                  )}
                                </Button>
                              </div>
                              
                              {/* 操作指引展開區塊 */}
                              <AnimatePresence>
                                {isExpanded && guide && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                  >
                                    <Card className="bg-slate-800/30 border-cyan-500/30">
                                      <CardContent className="p-6 space-y-6">
                                        {/* 操作指引標題與資訊 */}
                                        <div className="flex items-start justify-between">
                                          <div>
                                            <h3 className="text-lg font-bold text-white mb-2">
                                              📘 {guide.title}
                                            </h3>
                                            <div className="flex items-center gap-4 text-sm text-slate-400">
                                              <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                <span>{guide.estimatedTime}</span>
                                              </div>
                                              <Badge className={
                                                guide.severity === 'high' 
                                                  ? "bg-red-500/20 text-red-400 border-red-500/50" 
                                                  : guide.severity === 'critical'
                                                    ? "bg-red-600/20 text-red-300 border-red-600/50"
                                                    : "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
                                              }>
                                                {guide.severity.toUpperCase()}
                                              </Badge>
                                            </div>
                                          </div>
                                        </div>

                                        {/* 前置條件 */}
                                        {guide.prerequisites && guide.prerequisites.length > 0 && (
                                          <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                              <AlertTriangle className="w-4 h-4 text-blue-400" />
                                              <span className="text-sm font-semibold text-blue-300">
                                                前置條件
                                              </span>
                                            </div>
                                            <ul className="space-y-1 text-sm text-slate-300">
                                              {guide.prerequisites.map((prereq: string, i: number) => (
                                                <li key={i} className="flex items-start gap-2">
                                                  <span className="text-blue-400 mt-1">•</span>
                                                  <span>{prereq}</span>
                                                </li>
                                              ))}
                                            </ul>
                                          </div>
                                        )}

                                        {/* 操作步驟 */}
                                        <div className="space-y-4">
                                          <div className="flex items-center gap-2 text-white font-semibold">
                                            <span className="text-cyan-400">📋</span>
                                            <span>操作步驟</span>
                                          </div>
                                          
                                          {guide.steps.map((step: any, stepIndex: number) => (
                                            <div 
                                              key={stepIndex}
                                              className="p-4 bg-slate-900/50 border border-slate-600/50 rounded-lg space-y-3"
                                            >
                                              {/* 步驟標題 */}
                                              <div className="flex items-start gap-3">
                                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center text-white font-bold text-sm">
                                                  {step.stepNumber}
                                                </div>
                                                <div className="flex-1">
                                                  <h4 className="text-white font-semibold mb-1">
                                                    {step.title}
                                                  </h4>
                                                  <p className="text-sm text-slate-400">
                                                    {step.description}
                                                  </p>
                                                </div>
                                              </div>
                                              
                                              {/* 詳細動作 */}
                                              {step.actions && step.actions.length > 0 && (
                                                <div className="ml-11 space-y-2">
                                                  {step.actions.map((action: string, actionIndex: number) => (
                                                    <div 
                                                      key={actionIndex}
                                                      className="flex items-start gap-2 text-sm text-slate-300"
                                                    >
                                                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                                      <span>{action}</span>
                                                    </div>
                                                  ))}
                                                </div>
                                              )}
                                              
                                              {/* 注意事項 */}
                                              {step.notes && (
                                                <div className="ml-11 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded text-sm text-yellow-200 flex items-start gap-2">
                                                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                                  <span>{step.notes}</span>
                                                </div>
                                              )}
                                            </div>
                                          ))}
                                        </div>

                                        {/* 參考文件 */}
                                        {guide.references && guide.references.length > 0 && (
                                          <div className="p-4 bg-slate-900/50 border border-slate-600/50 rounded-lg">
                                            <div className="flex items-center gap-2 mb-3 text-white font-semibold">
                                              <span>📚</span>
                                              <span>參考文件</span>
                                            </div>
                                            <ul className="space-y-2">
                                              {guide.references.map((ref: any, i: number) => (
                                                <li key={i}>
                                                  <a 
                                                    href={ref.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-2"
                                                  >
                                                    <span>{ref.title}</span>
                                                    <ExternalLink className="w-3 h-3" />
                                                  </a>
                                                </li>
                                              ))}
                                            </ul>
                                          </div>
                                        )}

                                        {/* 疑難排解 */}
                                        {guide.troubleshooting && guide.troubleshooting.length > 0 && (
                                          <div className="p-4 bg-slate-900/50 border border-slate-600/50 rounded-lg">
                                            <div className="flex items-center gap-2 mb-3 text-white font-semibold">
                                              <span>🔧</span>
                                              <span>常見問題與疑難排解</span>
                                            </div>
                                            <div className="space-y-3">
                                              {guide.troubleshooting.map((item: any, i: number) => (
                                                <div key={i} className="space-y-1">
                                                  <div className="text-sm font-semibold text-red-400">
                                                    ❌ {item.issue}
                                                  </div>
                                                  <div className="text-sm text-slate-300 ml-4">
                                                    ✅ {item.solution}
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}

                                        {/* 操作完成按鈕 */}
                                        <div className="flex gap-3 pt-4 border-t border-slate-600">
                                          <Button
                                            onClick={() => handleOperationComplete(guideKey)}
                                            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                          >
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            操作完成
                                          </Button>
                                          <Button
                                            onClick={() => {
                                              setExpandedGuides(prev => {
                                                const newSet = new Set(prev);
                                                newSet.delete(guideKey);
                                                return newSet;
                                              });
                                            }}
                                            variant="outline"
                                            className="bg-slate-700 hover:bg-slate-600 text-white border-slate-500"
                                          >
                                            <ChevronUp className="w-4 h-4 mr-2" />
                                            收起
                                          </Button>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          )
                        })}

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
