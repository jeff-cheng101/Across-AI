"use client"

import React, { useState, useEffect, useCallback, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useTheme } from "next-themes"
import { 
  Database,
  RefreshCw,
  ExternalLink,
  AlertTriangle,
  Maximize2,
  Clock,
  Shield,
  Activity,
  TrendingUp,
  Palette
} from "lucide-react"

interface KibanaDashboardConfig {
  id: string
  name: string
  description: string
  icon: React.ReactNode
}

interface MultiKibanaDashboardProps {
  height?: string
  className?: string
  autoRefresh?: boolean
  showControls?: boolean
  domainSettings?: any
  logQuery?: string // 自定義日誌查詢
  indexPattern?: string // 索引模式
}

// 三個儀表板配置 - 更新為日誌查詢配置
const dashboardConfigs: KibanaDashboardConfig[] = [
  {
    id: "logs-discover", // 使用 Discover 進行日誌查詢
    name: "日誌查詢分析",
    description: "即時日誌查詢和事件分析",
    icon: <Database className="h-5 w-5" style={{ color: "#0D99FF" }} />
  },
  {
    id: "12e3a168-554f-4d9d-9ff3-d0095a211135",
    name: "安全監控總覽",
    description: "主要安全事件監控和威脅檢測",
    icon: <Shield className="h-5 w-5" style={{ color: "#0D99FF" }} />
  },
  {
    id: "85aeb500-3425-4bbd-a80e-1f5dc7c39383",
    name: "網路流量分析",
    description: "網路流量模式和異常檢測",
    icon: <Activity className="h-5 w-5" style={{ color: "#0D99FF" }} />
  }
]

// 防抖 Hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// 單個 Kibana 儀表板組件
function KibanaPanel({ 
  dashboardId, 
  name, 
  description,
  height = "600px",
  timeRange = "now-24h",
  refreshInterval = 30000,
  autoRefresh = true,
  isActive = false,
  domainSettings = [],
  logQuery = "",
  indexPattern = "logstash-*"
}: {
  dashboardId: string
  name: string
  description: string
  height?: string
  timeRange?: string
  refreshInterval?: number
  autoRefresh?: boolean
  isActive?: boolean
  domainSettings?: any
  logQuery?: string
  indexPattern?: string
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const [isThemeChanging, setIsThemeChanging] = useState(false)
  const [lastTheme, setLastTheme] = useState<string | undefined>(undefined)
  
  // 主題相關
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  // 減少防抖時間，提高響應速度
  const debouncedTheme = useDebounce(resolvedTheme, 100)

  // 確保客戶端渲染
  useEffect(() => {
    setMounted(true)
  }, [])

  const isDarkMode = mounted ? debouncedTheme === 'dark' : false

  // Kibana 配置 - 從環境變數讀取
  const kibanaConfig = {
    protocol: process.env.NEXT_PUBLIC_KIBANA_PROTOCOL || "https",
    host: process.env.NEXT_PUBLIC_KIBANA_HOST || "adas-bde.twister5.cf",
    space: process.env.NEXT_PUBLIC_KIBANA_SPACE || "adasone"
  }

  // 構建支持主題的 Kibana URL
  const buildKibanaUrl = useCallback((theme: boolean) => {
    const baseUrl = `${kibanaConfig.protocol}://${kibanaConfig.host}`
    
    // 使用 Kibana 的特殊格式，不是JSON
    // 根據您提供的URL格式：filters:!(),refreshInterval:(pause:!t,value:60000),time:(from:now-24h%2Fh,to:now)
    const isPaused = !autoRefresh || refreshInterval === 0 ? 't' : 'f'
    const intervalValue = refreshInterval === 0 ? 60000 : refreshInterval
    
    // 使用正確的時間格式
    let formattedTimeRange = timeRange
    // 移除自動添加 /h 後綴的邏輯，保持原始格式
    
    // 從 domainSettings 中提取主機名
    const domainNames = domainSettings ? domainSettings.map((domain: any) => domain.name).filter((name: any) => name) : []
    
    // 構建filter - 使用簡化的格式
    const filtersSection = '!()'
    
    const kibanaGlobalState = `(filters:${filtersSection},refreshInterval:(pause:!${isPaused},value:${intervalValue}),time:(from:${formattedTimeRange},to:now))`
    
    // 根據dashboardId決定使用哪種URL格式
    let targetUrl: string
    
    if (dashboardId === "logs-discover") {
      // 使用 Discover 進行日誌查詢
      let discoverUrl = `${baseUrl}/s/${kibanaConfig.space}/app/discover#/?_g=${kibanaGlobalState}`
      
      // 添加索引模式和查詢參數
      if (indexPattern) {
        discoverUrl += `&_a=(index:'${indexPattern}'`
        if (logQuery) {
          // 將查詢字符串編碼
          const encodedQuery = encodeURIComponent(logQuery)
          discoverUrl += `,query:(language:kuery,query:'${encodedQuery}')`
        }
        discoverUrl += ')'
      }
      
      targetUrl = discoverUrl
    } else {
      // 使用原有的 dashboard URL
      targetUrl = `${baseUrl}/s/${kibanaConfig.space}/app/dashboards#/view/${dashboardId}?_g=${kibanaGlobalState}`
    }
    
    // 添加embed參數
    const embedParams = new URLSearchParams()
    embedParams.append('embed', 'true')
    embedParams.append('show-top-menu', 'false')
    embedParams.append('hide-filter-bar', 'true')
    
    if (theme) {
      embedParams.append('theme', 'dark')
    }
    
    // 最終URL
    const finalUrl = `${targetUrl}&${embedParams.toString()}`
    
    return finalUrl
  }, [dashboardId, timeRange, refreshInterval, autoRefresh, kibanaConfig, domainSettings])

  // 使用 useMemo 來優化 URL 構建
  const kibanaUrl = useMemo(() => 
    buildKibanaUrl(isDarkMode), 
    [buildKibanaUrl, isDarkMode]
  )

  // 處理 iframe 載入
  const handleIframeLoad = useCallback(() => {
    const loadingDelay = parseInt(process.env.NEXT_PUBLIC_LOADING_DELAY || "1500")
    const initialLoadingDelay = parseInt(process.env.NEXT_PUBLIC_INITIAL_LOADING_DELAY || "2000")
    
    // 延遲隱藏Loading，確保完全覆蓋Kibana的Loading
    setTimeout(() => {
      setIsLoading(false)
      setError(null)
      setLastRefresh(new Date())
      
      // 額外延遲隱藏初始Loading
      setTimeout(() => {
        setIsInitialLoading(false)
      }, initialLoadingDelay)
    }, loadingDelay)
    
    // 強制應用外部樣式到 iframe
    const iframe = document.querySelector(`#kibana-iframe-${dashboardId}`) as HTMLIFrameElement
    if (iframe) {
      // 立即應用外部樣式
      iframe.style.filter = isDarkMode 
        ? 'invert(0.9) hue-rotate(180deg) brightness(0.8) contrast(1.2)' 
        : 'none'
      iframe.style.backgroundColor = isDarkMode ? '#1a1a1a' : '#ffffff'
      
      console.log(`Applied ${isDarkMode ? 'DARK' : 'LIGHT'} filter to iframe:`, iframe.id)
      
      // 嘗試內部樣式注入（如果可能）
      try {
        if (iframe.contentDocument) {
          const iframeDoc = iframe.contentDocument
          const existingStyle = iframeDoc.getElementById('custom-theme-override')
          
          if (existingStyle) {
            existingStyle.remove()
          }
          
          const style = iframeDoc.createElement('style')
          style.id = 'custom-theme-override'
          style.textContent = `
            ${isDarkMode ? `
              body, html, * {
                background-color: #1a1a1a !important;
                color: #ffffff !important;
              }
              .euiPageBody, .euiPage, .euiPageContent {
                background-color: #1a1a1a !important;
              }
              .euiPanel, .euiCard {
                background-color: #2d2d2d !important;
                border-color: #404040 !important;
              }
            ` : `
              body, html, * {
                background-color: #ffffff !important;
                color: #000000 !important;
              }
            `}
          `
          
          iframeDoc.head.appendChild(style)
          console.log('Successfully injected internal styles')
        }
      } catch (error) {
        console.log('Internal style injection blocked by CORS, using external filter only')
      }
    }
  }, [dashboardId, isDarkMode])

  // 處理 iframe 錯誤
  const handleIframeError = useCallback(() => {
    setIsLoading(false)
    setError(`無法連接到 Kibana 服務器 (${kibanaConfig.host})`)
  }, [kibanaConfig.host])

  // 重試載入
  const retryLoad = useCallback(() => {
    setIsLoading(true)
    setIsInitialLoading(true)
    setError(null)
    
    // 重新載入 iframe
    const iframe = document.querySelector(`#kibana-iframe-${dashboardId}`) as HTMLIFrameElement
    if (iframe) {
      iframe.src = kibanaUrl
    }
  }, [kibanaUrl, dashboardId])

  // 載入超時處理
  useEffect(() => {
    if (isActive) {
      const timeout = parseInt(process.env.NEXT_PUBLIC_LOADING_TIMEOUT || "20000")
      const timer = setTimeout(() => {
        if (isLoading) {
          setIsLoading(false)
          setError('載入超時，請檢查服務狀態')
        }
      }, timeout)

      return () => clearTimeout(timer)
    }
  }, [isLoading, isActive])

  // 主題變化處理 - 強制重載確保主題應用
  useEffect(() => {
    // 只在主題真正改變時才處理
    if (mounted && isActive && debouncedTheme && debouncedTheme !== lastTheme) {
      setLastTheme(debouncedTheme)
      setIsThemeChanging(true)
      setIsLoading(true)
      
      console.log(`Theme changing to: ${isDarkMode ? 'dark' : 'light'}`)
      
      // 立即應用樣式並重載 iframe
      const iframe = document.querySelector(`#kibana-iframe-${dashboardId}`) as HTMLIFrameElement
      if (iframe) {
        // 立即應用外部樣式（不等待重載）
        iframe.style.filter = isDarkMode 
          ? 'invert(0.9) hue-rotate(180deg) brightness(0.8) contrast(1.2)' 
          : 'none'
        iframe.style.backgroundColor = isDarkMode ? '#1a1a1a' : '#ffffff'
        
        console.log(`Immediately applied ${isDarkMode ? 'DARK' : 'LIGHT'} filter to iframe`)
        
        // 快速完成主題切換（不重載）
        setIsThemeChanging(false)
        setIsLoading(false)
        setIsInitialLoading(false)
        
        // 可選：如果需要重載來確保完整主題應用
        // const newUrl = kibanaUrl + '&themeReload=' + Date.now()
        // iframe.src = newUrl
      }
    }
  }, [debouncedTheme, lastTheme, mounted, isActive, dashboardId, kibanaUrl, isDarkMode])

  // 重新載入處理（當 URL 變化時）
  useEffect(() => {
    if (isActive && mounted) {
      setIsLoading(true)
      setIsInitialLoading(true)
      setError(null)
      
      // 強制重新載入 iframe 當時間範圍改變
      const iframe = document.querySelector(`#kibana-iframe-${dashboardId}`) as HTMLIFrameElement
      if (iframe) {
        const timestamp = Date.now()
        const newUrl = `${kibanaUrl}&_ts=${timestamp}`
        
        
        iframe.src = newUrl
      }
    }
  }, [kibanaUrl, isActive, mounted, timeRange, dashboardId])

  if (!isActive) {
    return null
  }

  return (
    <div className="relative">
      {/* Kibana iframe */}
      <iframe
        id={`kibana-iframe-${dashboardId}`}
        src={kibanaUrl}
        width="100%"
        height={height}
        className={`rounded-lg border border-border ${isDarkMode ? 'iframe-dark-theme' : 'iframe-light-theme'}`}
        title={`${name} - ADAS ONE Kibana Dashboard`}
        frameBorder="0"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-presentation allow-downloads allow-pointer-lock"
        referrerPolicy="strict-origin-when-cross-origin"
        allow="fullscreen; clipboard-read; clipboard-write"
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        style={{ 
          minHeight: height,
          display: error ? 'none' : 'block',
          backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff'
        }}
      />
      
      {/* 主題覆蓋層 - 強制顯示主題效果 */}
      {isDarkMode && (
        <div 
          className="absolute inset-0 pointer-events-none rounded-lg"
          style={{
            background: 'linear-gradient(rgba(26, 26, 26, 0.1), rgba(26, 26, 26, 0.1))',
            mixBlendMode: 'multiply'
          }}
        />
      )}
      
      {/* 強力品牌覆蓋層 - 完全隱藏Kibana Loading */}
      {(isLoading || isInitialLoading) && (
        <div 
          className="absolute inset-0 rounded-lg flex items-center justify-center transition-all duration-300"
          style={{ 
            height,
            background: isDarkMode ? '#1a1a1a' : '#ffffff',
            zIndex: 999999
          }}
        >
          <div className="text-center">
            <div className="relative mb-6">
              <Activity className="h-16 w-16 animate-spin mx-auto" style={{ color: "#0D99FF" }} />
              {/* <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-blue-500 animate-spin"></div> */}
            </div>
            
            <h3 className="text-xl font-bold text-foreground mb-3">ADAS ONE 監控系統</h3>
            <h4 className="text-lg font-semibold text-foreground mb-2">載入 {name}</h4>
            <p className="text-muted-foreground mb-4">正在初始化安全監控儀表板...</p>
            
            {/* <div className="flex items-center justify-center text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              連接狀態: 正常
            </div> */}
          </div>
        </div>
      )}

      {/* 載入狀態 */}
      {isLoading && (
        <div 
          className="absolute inset-0 bg-muted/90 backdrop-blur-sm rounded-lg flex items-center justify-center transition-all duration-300"
          style={{ height }}
        >
          <div className="text-center">
            {isThemeChanging ? (
              <div className="flex items-center justify-center mb-4">
                <Palette className="h-8 w-8 text-primary animate-pulse mr-2" />
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <RefreshCw className="h-12 w-12 animate-spin text-muted-foreground mx-auto mb-4" />
            )}
            
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {isThemeChanging ? `⚡ 快速切換主題` : `載入 ${name}`}
            </h3>
            
            <p className="text-muted-foreground mb-2">
              {isThemeChanging 
                ? `切換至${isDarkMode ? '🌙 暗色' : '☀️ 亮色'}主題` 
                : '正在連接到 服務器...'
              }
            </p>
            
            {!isThemeChanging && (
              <p className="text-xs text-muted-foreground">
                服務器: {kibanaConfig.host}
              </p>
            )}
          </div>
        </div>
      )}
      
      {/* 錯誤狀態 */}
      {/* {error && (
        <div 
          className="absolute inset-0 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800 flex items-center justify-center"
          style={{ height }}
        >
          <div className="text-center p-8 max-w-lg">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-4">無法載入儀表板</h3>
            <p className="text-red-600 dark:text-red-400 mb-6">
              {error}
            </p>
            
            <div className="space-y-4">
              <Button onClick={retryLoad} disabled={isLoading} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                重新載入
              </Button>
              
              <Button 
                onClick={() => window.open(`${kibanaConfig.protocol}://${kibanaConfig.host}`, '_blank')}
                className="w-full border"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                直接開啟 Kibana
              </Button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  )
}

// 主要的多 Kibana 儀表板組件
// 添加全域樣式來強制 iframe 主題
const addGlobalIframeStyles = (isDark: boolean) => {
  const styleId = 'kibana-iframe-theme-override'
  const existingStyle = document.getElementById(styleId)
  
  if (existingStyle) {
    existingStyle.remove()
  }
  
  const style = document.createElement('style')
  style.id = styleId
  style.textContent = `
    .iframe-dark-theme {
      background-color: #1a1a1a !important;
      ${isDark ? 'filter: invert(0.9) hue-rotate(180deg) brightness(0.8) contrast(1.2) !important;' : ''}
    }
    .iframe-light-theme {
      background-color: #ffffff !important;
      filter: none !important;
    }
    
    /* 更強制的選擇器 */
    iframe#kibana-iframe-12e3a168-554f-4d9d-9ff3-d0095a211135,
    iframe#kibana-iframe-85aeb500-3425-4bbd-a80e-1f5dc7c39383,
    iframe#kibana-iframe-d48ac77a-d5eb-4783-a1d2-4dca5701ca34 {
      ${isDark ? `
        filter: invert(0.9) hue-rotate(180deg) brightness(0.8) contrast(1.2) !important;
        background-color: #1a1a1a !important;
      ` : `
        filter: none !important;
        background-color: #ffffff !important;
      `}
    }
    
    /* 覆蓋所有 Kibana iframe */
    iframe[src*="10.168.10.250:5601"] {
      ${isDark ? `
        filter: invert(0.9) hue-rotate(180deg) brightness(0.8) contrast(1.2) !important;
        background-color: #1a1a1a !important;
      ` : `
        filter: none !important;
        background-color: #ffffff !important;
      `}
    }
    iframe[src*="adas-bde.twister5.cf"] {
      ${isDark ? `
        filter: invert(0.9) hue-rotate(180deg) brightness(0.8) contrast(1.2) !important;
        background-color: #1a1a1a !important;
      ` : `
        filter: none !important;
        background-color: #ffffff !important;
      `}
    }
  `
  document.head.appendChild(style)
  
  console.log(`Applied ${isDark ? 'DARK' : 'LIGHT'} theme styles to Kibana iframes`)
}

export function MultiKibanaDashboard({ 
  height = "600px", 
  className = "",
  autoRefresh = true,
  showControls = true,
  domainSettings = [],
  logQuery = "",
  indexPattern = "logstash-*"
}: MultiKibanaDashboardProps) {
  const [activeTab, setActiveTab] = useState(dashboardConfigs[0].id)
  const [timeRange, setTimeRange] = useState("now-24h")
  const [refreshInterval, setRefreshInterval] = useState(0)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const [isClient, setIsClient] = useState(false)
  const [shouldLoadKibana, setShouldLoadKibana] = useState(false)
  const [customLogQuery, setCustomLogQuery] = useState(logQuery)
  
  // 主題相關
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // 延遲 2 秒後開始加載 Kibana，避免 SSL 證書問題影響頁面載入
    const timer = setTimeout(() => {
      setShouldLoadKibana(true)
    }, 2000)
    
    return () => clearTimeout(timer)
  }, [])

  const isDarkMode = mounted ? resolvedTheme === 'dark' : false
  
  // 當主題變化時添加全域樣式
  useEffect(() => {
    if (mounted) {
      addGlobalIframeStyles(isDarkMode)
    }
  }, [isDarkMode, mounted])

  // 客戶端渲染
  useEffect(() => {
    setIsClient(true)
  }, [])

  // 時間範圍選項
  const timeRangeOptions = [
    { value: "now-15m", label: "過去15分鐘" },
    { value: "now-1h", label: "過去1小時" },
    { value: "now-6h", label: "過去6小時" },
    { value: "now-24h", label: "過去24小時" },
    { value: "now-7d", label: "過去7天" },
    { value: "now-30d", label: "過去30天" }
  ]

  // 刷新間隔選項
  const refreshOptions = [
    { value: 0, label: "關閉" },
    { value: 10000, label: "10秒" },
    { value: 30000, label: "30秒" },
    { value: 60000, label: "1分鐘" },
    { value: 300000, label: "5分鐘" },
    { value: 900000, label: "15分鐘" }
  ]

  // 手動刷新所有儀表板
  const refreshAllDashboards = useCallback(() => {
    dashboardConfigs.forEach(config => {
      const iframe = document.querySelector(`#kibana-iframe-${config.id}`) as HTMLIFrameElement
      if (iframe) {
        const url = new URL(iframe.src)
        url.searchParams.set('_t', Date.now().toString())
        iframe.src = url.toString()
      }
    })
    setLastRefresh(new Date())
  }, [])

  // 獲取當前活動儀表板配置
  const activeConfig = dashboardConfigs.find(config => config.id === activeTab)

  return (
    <Card className={`shadow-lg bg-card border-border ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl text-foreground flex items-center gap-2">
              <Database className="h-6 w-6" style={{ color: "#0D99FF" }} />
              ADAS ONE 多視角監控儀表板
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              切換不同視角的安全監控和分析 • 最後更新: {isClient ? lastRefresh.toLocaleTimeString() : '--:--:--'}
            </CardDescription>
          </div>
          
          {showControls && (
            <div className="flex items-center gap-2">
              <Badge className="text-white border-green-600">
                即時監控
              </Badge>
              
              {/* 主題指示器 */}
              {mounted && (
                <Badge 
                  variant="outline" 
                  className={`flex items-center gap-1 ${
                    isDarkMode 
                      ? 'border-blue-600 text-blue-600' 
                      : 'border-orange-600 text-orange-600'
                  }`}
                >
                  <Palette className="h-3 w-3" />
                  {isDarkMode ? '暗色主題' : '亮色主題'}
                </Badge>
              )}
              
              {/* 時間範圍選擇 */}
              <Select value={timeRange} onValueChange={(value: string) => setTimeRange(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeRangeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* 刷新間隔選擇 */}
              <Select value={refreshInterval.toString()} onValueChange={(value: string) => setRefreshInterval(Number(value))}>
                <SelectTrigger className="w-20">
                  <Clock className="h-4 w-4" />
                </SelectTrigger>
                <SelectContent>
                  {refreshOptions.map(option => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* 手動刷新按鈕 */}
              <Button onClick={refreshAllDashboards} className="px-3 py-1 text-sm border">
                <RefreshCw className="h-4 w-4 mr-1" />
                刷新
              </Button>
              
              {/* 新視窗開啟 */}
              {/* <Button 
                onClick={() => {
                  if (activeConfig) {
                    const url = `https://10.168.10.250:5601/s/adasone/app/dashboards#/view/${activeConfig.id}`
                    window.open(url, '_blank')
                  }
                }}
                className="px-3 py-1 text-sm border"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                新視窗
              </Button> */}

              {/* 全螢幕按鈕 */}
              <Button 
                onClick={() => {
                  const iframe = document.querySelector(`#kibana-iframe-${activeTab}`) as HTMLIFrameElement
                  if (iframe && iframe.requestFullscreen) {
                    iframe.requestFullscreen()
                  }
                }}
                className="px-3 py-1 text-sm border"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            {dashboardConfigs.map((config) => (
              <TabsTrigger 
                key={config.id} 
                value={config.id}
                className="flex items-center gap-2"
              >
                {config.icon}
                {config.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {dashboardConfigs.map((config) => (
            <TabsContent key={config.id} value={config.id} className="mt-0">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-foreground mb-1">{config.name}</h3>
                <p className="text-sm text-muted-foreground">{config.description}</p>
                
                {/* 日誌查詢輸入框 - 只在日誌查詢標籤頁顯示 */}
                {config.id === "logs-discover" && (
                  <div className="mt-4 p-4 bg-muted/30 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <Database className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">自定義日誌查詢</span>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="輸入 KQL 查詢語句，例如: status:404 AND response_time:>1000"
                        value={customLogQuery}
                        onChange={(e) => setCustomLogQuery(e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        onClick={() => setCustomLogQuery("")}
                        variant="outline"
                        size="sm"
                      >
                        清除
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      支援 Kibana Query Language (KQL) 語法，留空則顯示所有日誌
                    </p>
                  </div>
                )}
              </div>
              
              {shouldLoadKibana ? (
                <KibanaPanel
                  dashboardId={config.id}
                  name={config.name}
                  description={config.description}
                  height={height}
                  timeRange={timeRange}
                  refreshInterval={refreshInterval === 0 ? 30000 : refreshInterval}
                  autoRefresh={autoRefresh && refreshInterval !== 0}
                  isActive={activeTab === config.id}
                  domainSettings={domainSettings}
                  logQuery={config.id === "logs-discover" ? customLogQuery : logQuery}
                  indexPattern={indexPattern}
                />
              ) : (
                <div 
                  className="flex items-center justify-center bg-muted/30 rounded-lg border border-dashed border-muted-foreground/25"
                  style={{ height }}
                >
                  <div className="text-center space-y-4">
                    <div className="text-muted-foreground">
                      <Database className="h-12 w-12 mx-auto mb-2 animate-pulse" />
                      <p className="text-lg font-medium">準備載入 Kibana 儀表板</p>
                      <p className="text-sm">正在建立安全連線...</p>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}export default MultiKibanaDashboard

