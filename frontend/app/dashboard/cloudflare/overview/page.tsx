"use client"

import { motion } from "framer-motion"
import { AlertTriangle, TrendingUp, TrendingDown, X, Calendar, Minus } from 'lucide-react'
import { useState, useEffect, useRef, useMemo } from "react"
import { useWAFData } from "../../waf-data-context"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, BarChart, Bar, ReferenceLine } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDashboardData } from "@/app/dashboard/dashboard-data-context"
import { TimeRangeControls } from "@/components/date-time-controls"
import { DateTimePicker } from "@/components/date-time-picker"
import { CountUp } from "@/components/CountUp"
import authenticator from "@/app/util/authenticator"
import { getZonesByContractNo } from "@/app/routes/cloudflare"
import {
  useTrafficTrend,
  useTrafficTrendBps,
  getTrafficInterval,
  useAttackGeoSources,
  useAttackCitySources,
  useWafEventTrend,
  useCdnCacheStatus,
  getWafEventsCount,
  useOriginServerErrors,
  useTopAttackedUrls,
  useTopAttackedHosts,
  useAttackPeak,
  useCleanedTrafficCount,
  useTopDDoSHosts,
  useCleanedTrafficTrend,
  useTopAttackIPs,
  useCdnTotalTraffic,
  useCdnTrafficTrend,
  useTopCdnNodes,
  useCdnCacheStatusChart,
  useCdnHttpStatus,
} from "./useCloudflareOverviewData"


export default function CloudflareOverviewPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const { timeRange, setTimeRange, refreshTrigger } = useDashboardData() // 用 Context 来管理時間範圍
  const [userZones, setUserZones] = useState<string[]>([])
  const [selectedZone, setSelectedZone] = useState<string>('all')

  useEffect(() => {
    const subscription = authenticator.authObservable.subscribe(async (auth) => {
      if (auth?.contract?.contractNo) {
        try {
          const resp = await getZonesByContractNo(auth.contract?.contractNo || null)
          if (resp && resp.data && Array.isArray(resp.data)) {
            const zoneNames = resp.data.map((z: any) => z.name)
            setUserZones(zoneNames)
          } else {
            setUserZones([])
          }
        } catch (error) {
          console.error("Failed to load user zones:", error)
          setUserZones([])
        }
      } else if (auth && auth.loginState === false) {
        // 只有在明確知道未登錄或 authReady 且無合約時才清空
        setUserZones([])
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const filteredZones = useMemo(() => {
    return selectedZone === 'all' ? userZones : [selectedZone]
  }, [selectedZone, userZones])
  console.log('filteredZones', filteredZones)

  const [aiSuggestion, setAiSuggestion] = useState<{
    show: boolean
    title: string
    content: string
  }>({ show: false, title: "", content: "" })

  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const cdnMapContainerRef = useRef<HTMLDivElement>(null)
  const cdnMapRef = useRef<any>(null)

  const tabs = [
    { id: "overview", label: "總覽" },
    { id: "ddos", label: "DDoS 防護" },
    { id: "waf", label: "WAF 分析" },
    { id: "cdn", label: "CDN 性能" },
  ]

  // ==================== Elasticsearch 数据查询 ====================
  // ====================      tabs = 總覽      ====================

  // WAF 已阻擋威脅
  const wafEventsResp = getWafEventsCount(filteredZones)
  const { total: wafEventsTotal, blocks: wafEventsBlocks, monitors: wafEventsMonitors, changes: wafEventsChanges } = wafEventsResp || { total: 0, blocks: 0, monitors: 0, changes: { total: 0, blocks: 0, monitors: 0 } }
  // console.log('wafEventsResp', wafEventsResp)
  // CDN 快取命中率 (Cache Hit)
  const cacheHitRateResp = useCdnCacheStatus(filteredZones)
  const { rate: cacheHitRate, hits: cacheHitCount, total: cacheHitTotal, changes: cacheHitChanges } = cacheHitRateResp || { rate: 0, hits: 0, total: 0, changes: { total: 0, hits: 0, rate: 0 } }
  // console.log('cacheHitRate', cacheHitRate)
  const formatRate = (val: number) => {
    const absVal = Math.abs(val)
    if (absVal === 0) return "0.00"
    if (absVal < 0.01) return val.toFixed(3) // 如果小於 0.01，顯示 3 位
    return val.toFixed(2) // 否則顯示 2 位
  }

  // 源伺服器錯誤率 (5xx error rate)
  const originErrorRateResp = useOriginServerErrors(filteredZones)
  const { rate: originErrorRate, errors: originErrorCount, total: originErrorTotal, changes: originErrorChanges } = originErrorRateResp || { rate: 0, errors: 0, total: 0, changes: { total: 0, errors: 0, rate: 0 } }
  // console.log('originErrorRate', originErrorRate)

  // 攻擊峰值 (Attack Peak RPS)
  const { peakRps, peakUnit, previous: peakPrevious, changes: peakChanges } = useAttackPeak(filteredZones)
  // console.log('peakRps', peakRps)

  // 已清洗流量
  const cleanedTrafficData = useCleanedTrafficCount(filteredZones)
  const { count: cleanedTrafficCount, bytes: cleanedTrafficBytes, changes: cleanedTrafficChanges } = cleanedTrafficData
  // console.log('cleanedTrafficData', cleanedTrafficData)

  // TOP 5 被DDoS的網域
  const topDDoSHostsData = useTopDDoSHosts(filteredZones)
  // console.log('topDDoSHostsData', topDDoSHostsData)

  // Top 10 攻擊來源 IP
  const topAttackIPsData = useTopAttackIPs(filteredZones)
  // console.log('topAttackIPsData', topAttackIPsData)

  // CDN 總傳輸流量
  const cdnTotalTrafficData = useCdnTotalTraffic(filteredZones)
  const { 
    value: cdnTotalTrafficValue,
    unit: cdnTotalTrafficUnit,
    cached_rate: cdnCacheRate,
    average_response_time: cdnAverageResponseTime,
    previous: cdnTotalTrafficPrevious, 
    changes: cdnTotalTrafficChanges 
  } = cdnTotalTrafficData
  // console.log('cdnTotalTrafficData', cdnTotalTrafficData)

  // TOP 5 CDN 節點
  const topCdnNodesData = useTopCdnNodes(filteredZones)
  // console.log('topCdnNodesData', topCdnNodesData)

  const topCacheStatusData = useCdnCacheStatusChart(filteredZones)
  // console.log('topCacheStatusData', topCacheStatusData)

  // TOP 10 HTTP Status
  const topHttpStatusData = useCdnHttpStatus(filteredZones)
  // console.log('topHttpStatusData', topHttpStatusData)

  // 攻击来源地理分布
  const attackSources = useAttackGeoSources(filteredZones)
  // console.log('attackGeoSourcesData', attackSources)
  const attackCitySources = useAttackCitySources(filteredZones)
  // console.log('attackCitySources', attackCitySources)

  // 即時流量分析 - 根據時間範圍動態調整間隔
  const { trafficIntervalConfig, actualTrafficTimeRange } = useMemo(() => {
    // 如果是相對時間模式，計算實際的時間範圍
    let actualFrom: Date
    let actualTo: Date
    
    if (timeRange.mode === 'relative') {
      const now = new Date()
      const duration = new Date(timeRange.to).getTime() - new Date(timeRange.from).getTime()
      actualTo = now
      actualFrom = new Date(now.getTime() - duration)
    } else {
      actualFrom = new Date(timeRange.from)
      actualTo = new Date(timeRange.to)
    }
    
    return {
      trafficIntervalConfig: getTrafficInterval(actualFrom, actualTo),
      actualTrafficTimeRange: { from: actualFrom, to: actualTo }
    }
  }, [timeRange])
  
  const trafficData = useTrafficTrend(
    trafficIntervalConfig.interval, 
    trafficIntervalConfig.seconds, 
    actualTrafficTimeRange,
    filteredZones
  )
  // console.log('trafficData:', trafficData, 'interval:', trafficIntervalConfig.interval)

  const trafficBpsData = useTrafficTrendBps(
    trafficIntervalConfig.interval,
    trafficIntervalConfig.seconds,
    actualTrafficTimeRange,
    filteredZones
  )
  // console.log('trafficBpsData:', trafficBpsData)

  const cleanedTrafficTrendData = useCleanedTrafficTrend(
    trafficIntervalConfig.interval,
    trafficIntervalConfig.seconds,
    actualTrafficTimeRange,
    filteredZones
  )
  // console.log('cleanedTrafficTrendData:', cleanedTrafficTrendData)

  // 快取狀態趨勢分析
  const cdnTrafficResp = useCdnTrafficTrend(
    trafficIntervalConfig.interval,
    trafficIntervalConfig.seconds,
    actualTrafficTimeRange,
    filteredZones
  )
  const cdnTrafficChartData = cdnTrafficResp.data || []
  const cdnStatuses = cdnTrafficResp.statuses || []

  // 快取狀態顏色與標籤對照
  const CACHE_STATUS_COLORS: Record<string, string> = {
    hit: "#10b981",      // 綠色
    miss: "#ef4444",     // 紅色
    dynamic: "#3b82f6",  // 藍色
    expired: "#f59e0b",  // 橘色
    stale: "#8b5cf6",    // 紫色
    unknown: "#94a3b8",  // 灰色
    revalidated: "#06b6d4", // 青色
    bypass: "#f472b6"    // 粉色
  };

  const CACHE_STATUS_LABELS: Record<string, string> = {
    hit: "命中 (Hit)",
    miss: "遺漏 (Miss)",
    dynamic: "動態 (Dynamic)",
    expired: "已過期 (Expired)",
    stale: "過時 (Stale)",
    unknown: "未知 (Unknown)",
    revalidated: "已重新驗證 (Revalidated)",
    bypass: "略過 (Bypass)"
  };

  // 計算 Y 軸 domain 與 Ticks (快取狀態圖表)
  const { cdnTrafficYDomain, cdnTrafficYTicks } = useMemo(() => {
    if (!cdnTrafficChartData || cdnTrafficChartData.length === 0) {
      return { cdnTrafficYDomain: [0, 10] as [number, number], cdnTrafficYTicks: [0, 2, 4, 6, 8, 10] }
    }
    const maxValue = Math.max(...cdnTrafficChartData.map((d: any) => {
      let max = 0;
      cdnStatuses.forEach((status: string) => { 
        const val = d[status] || 0;
        if (val > max) max = val;
      });
      return max;
    })) || 10;
    
    const magnitude = Math.pow(10, Math.floor(Math.log10(maxValue || 1)))
    const ratio = (maxValue || 0) / magnitude
    const step = ratio < 5 ? 0.5 : 1
    const niceMax = Math.ceil(ratio / step) * step * magnitude || 10
    
    const ticks = []
    const tickStep = niceMax / 5
    for (let i = 0; i <= 5; i++) ticks.push(Math.round(tickStep * i))
    
    return { 
      cdnTrafficYDomain: [0, niceMax] as [number, number], 
      cdnTrafficYTicks: ticks 
    }
  }, [cdnTrafficChartData, cdnStatuses])
  
  // 計算 Y 軸 domain 與 Ticks (原本的請求數圖表)
  const { trafficYDomain, trafficYTicks } = useMemo(() => {
    if (!trafficData || trafficData.length === 0) {
      return { trafficYDomain: [0, 10] as [number, number], trafficYTicks: [0, 2, 4, 6, 8, 10] }
    }
    
    // 改為計算所有類別中的最大值，而非堆疊總和，因為圖表並未堆疊
    const maxValue = Math.max(...trafficData.map((d: any) => Math.max(
      d.block || 0,
      d.log || 0,
      d.skip || 0,
      d.managedChallenge || 0,
      d.jschallenge || 0
    ))) || 10;
    
    // 取得數量級
    const magnitude = Math.pow(10, Math.floor(Math.log10(maxValue || 1)))
    const ratio = (maxValue || 0) / magnitude
    
    // 縮小步長讓圖表更緊湊：如果比例小於 2 使用 0.2，小於 5 使用 0.5，否則使用 1
    let step = ratio < 2 ? 0.2 : (ratio < 5 ? 0.5 : 1)
    const niceMax = Math.ceil(ratio / step) * step * magnitude
    
    const ticks = []
    const tickStep = niceMax / 5
    for (let i = 0; i <= 5; i++) {
      ticks.push(Math.round(tickStep * i))
    }
    
    return { 
      trafficYDomain: [0, niceMax] as [number, number], 
      trafficYTicks: ticks 
    }
  }, [trafficData])

  // 計算 Y 軸 domain 與 Ticks (即時流量分析圖表 - Mbps)
  const { trafficAnalysisYDomain, trafficAnalysisYTicks, trafficAnalysisUnit, trafficAnalysisChartData } = useMemo(() => {
    if (!trafficBpsData || trafficBpsData.length === 0) {
      return { 
        trafficAnalysisYDomain: [0, 10] as [number, number], 
        trafficAnalysisYTicks: [0, 2, 4, 6, 8, 10], 
        trafficAnalysisUnit: 'Mbps',
        trafficAnalysisChartData: [] 
      }
    }

    // 計算最大 bps (取歸類後的 attack 和 clean 中的最大值)
    const maxBps = Math.max(...trafficBpsData.map((d: any) => Math.max(d.attack || 0, d.clean || 0)));
    
    // 固定使用 Mbps 單位
    const unit = 'Mbps'
    const divisor = 1000000
    const maxValue = maxBps / divisor

    // 如果數值都是 0，顯示 [-1, 0, 1] 的區間，讓線在中間
    if (maxBps === 0) {
      const chartData = trafficBpsData.map((d: any) => ({
        ...d,
        attackVal: 0,
        cleanVal: 0,
      }))
      return {
        trafficAnalysisYDomain: [-1, 1] as [number, number],
        trafficAnalysisYTicks: [-1, 0, 1],
        trafficAnalysisUnit: unit,
        trafficAnalysisChartData: chartData
      }
    }

    // 1. 取得數量級 (例如 0.0008 -> 0.0001)
    const magnitude = Math.pow(10, Math.floor(Math.log10(maxValue || 1)));
    const fraction = maxValue / magnitude;
    
    // 2. 找一個漂亮的最高倍數，確保刻度是等比例且漂亮的
    const niceFractions = [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 7.5, 8, 10];
    let selectedFraction = niceFractions.find(f => f >= fraction * 1.1) || 10;
    
    let niceMax = selectedFraction * magnitude;
    if (niceMax === 0) niceMax = 1;

    // 3. 生成 5 個等間距刻度 (6 個點，包含 0)
    const ticks = []
    const tickStep = niceMax / 5
    for (let i = 0; i <= 5; i++) {
      // 解決浮點數精度問題，確保刻度數值準確
      ticks.push(Number((tickStep * i).toFixed(12)))
    }
    
    const chartData = trafficBpsData.map((d: any) => ({
      ...d,
      attackVal: (d.attack || 0) / divisor,
      cleanVal: (d.clean || 0) / divisor,
    }))

    return { 
      trafficAnalysisYDomain: [0, niceMax] as [number, number], 
      trafficAnalysisYTicks: ticks,
      trafficAnalysisUnit: unit,
      trafficAnalysisChartData: chartData
    }
  }, [trafficBpsData])

  // 計算 Y 軸 domain 與 Ticks (已清洗流量圖表)
  const { cleanedTrafficYDomain, cleanedTrafficYTicks, cleanedTrafficUnit, cleanedTrafficChartData } = useMemo(() => {
    if (!cleanedTrafficTrendData || cleanedTrafficTrendData.length === 0) {
      return { cleanedTrafficYDomain: [0, 10] as [number, number], cleanedTrafficYTicks: [0, 2, 4, 6, 8, 10], cleanedTrafficUnit: 'KB', cleanedTrafficChartData: [] }
    }
    const maxBytes = Math.max(...cleanedTrafficTrendData.map((d: any) => d.bytes || 0))
    
    let unit = 'KB'
    let divisor = 1000
    if (maxBytes >= 1000000000000) { unit = 'TB'; divisor = 1000000000000; }
    else if (maxBytes >= 1000000000) { unit = 'GB'; divisor = 1000000000; }
    else if (maxBytes >= 1000000) { unit = 'MB'; divisor = 1000000; }

    const value = maxBytes / divisor
    if (value === 0 && maxBytes === 0) {
      return { 
        cleanedTrafficYDomain: [-1, 1] as [number, number], 
        cleanedTrafficYTicks: [-1, 0, 1], 
        cleanedTrafficUnit: unit, 
        cleanedTrafficChartData: cleanedTrafficTrendData.map((d: any) => ({ ...d, value: 0 })) 
      }
    }

    const magnitude = Math.pow(10, Math.floor(Math.log10(value || 1)))
    const ratio = (value || 0) / magnitude
    const step = ratio < 5 ? 0.5 : 1
    const niceMax = Math.ceil(ratio / step) * step * magnitude || 10
    
    const ticks = []
    const tickStep = niceMax / 5
    for (let i = 0; i <= 5; i++) ticks.push(Number((tickStep * i).toFixed(2)))
    
    const chartData = cleanedTrafficTrendData.map((d: any) => ({
      ...d,
      value: d.bytes / divisor
    }))

    return { 
      cleanedTrafficYDomain: [0, niceMax] as [number, number], 
      cleanedTrafficYTicks: ticks,
      cleanedTrafficUnit: unit,
      cleanedTrafficChartData: chartData
    }
  }, [cleanedTrafficTrendData])

  // WAF 事件趨勢
  // 計算 WAF 事件趨勢的時間間隔和實際時間範圍
  const { wafTrendInterval, actualTimeRange } = useMemo(() => {
    // 如果是相對時間模式，需要計算實際的時間範圍
    let actualFrom: Date
    let actualTo: Date
    
    if (timeRange.mode === 'relative') {
      const now = new Date()
      const duration = new Date(timeRange.to).getTime() - new Date(timeRange.from).getTime()
      actualTo = now
      actualFrom = new Date(now.getTime() - duration)
    } else {
      actualFrom = new Date(timeRange.from)
      actualTo = new Date(timeRange.to)
    }

    const duration = actualTo.getTime() - actualFrom.getTime()
    const minutes = duration / (1000 * 60)
    const hours = duration / (1000 * 60 * 60)
    const days = duration / (1000 * 60 * 60 * 24)
    
    let interval = '12h'
    if (minutes <= 30) interval = '30s'   // 前30分鐘：每30秒
    else if (hours <= 1) interval = '1m'      // 前1小時：每1分鐘
    else if (hours <= 4) interval = '5m'      // 前4小時：每5分鐘
    else if (hours <= 24) interval = '30m'    // 前24小時：每30分鐘
    else if (days <= 7) interval = '3h'       // 前7天：每3小時
    
    return {
      wafTrendInterval: interval,
      actualTimeRange: { from: actualFrom, to: actualTo }
    }
  }, [timeRange, refreshTrigger])
  
  const { data: wafTrendData } = useWafEventTrend(wafTrendInterval, actualTimeRange, filteredZones)
  const wafEventTrendData = useMemo(() => {
    if (!wafTrendData?.waf_events_over_time?.buckets || wafTrendData.waf_events_over_time.buckets.length === 0) {
      return []
    }
    return wafTrendData.waf_events_over_time.buckets.map((bucket: any) => {
      const timestamp = new Date(bucket.key)
      // 根據時間間隔格式化顯示
      let timeLabel = ''
      if (wafTrendInterval === '30s') {
        // 30秒间隔：显示 HH:mm:ss
        timeLabel = timestamp.toLocaleTimeString('zh-TW', { 
          second: '2-digit',
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        })
      } else if (wafTrendInterval === '1m') {
        // 1分钟间隔：显示 HH:mm
        timeLabel = timestamp.toLocaleTimeString('zh-TW', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        })
      } else if (wafTrendInterval === '5m') {
        // 5分钟间隔：显示 HH:00
        timeLabel = timestamp.toLocaleTimeString('zh-TW', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        })
      } else if (wafTrendInterval === '30m') {
        // 30分钟间隔：显示月日 HH:00
        timeLabel = timestamp.toLocaleTimeString('zh-TW', { 
          month: '2-digit', 
          day: '2-digit',
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        })
      } else if (wafTrendInterval === '3h') {
        // 1天间隔：显示月日 HH:00
        timeLabel = timestamp.toLocaleDateString('zh-TW', { 
          month: '2-digit', 
          day: '2-digit',
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false
        })
      } else {
        // 1天间隔：显示月日 HH:00
        timeLabel = timestamp.toLocaleDateString('zh-TW', { 
          month: '2-digit', 
          day: '2-digit',
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false
        })
      }
      
      const filteredBucket = bucket.filtered_events || bucket;

      return {
        hour: timeLabel,
        timestamp: bucket.key,
        blocked: filteredBucket.blocked?.doc_count || 0,
        monitored: filteredBucket.monitored?.doc_count || 0
      }
    })
  }, [wafTrendData, wafTrendInterval])
  // console.log('wafEventTrendData', wafEventTrendData)

  // TOP 10 被攻擊的 URL
  const topAttackedUrlsData: any = useTopAttackedUrls(filteredZones)
  // console.log('topAttackedUrlsData', topAttackedUrlsData)

  const attackTypeData = [
    { name: "UDP Flood", value: 72, color: "#ef4444" },
    { name: "SYN Flood", value: 18, color: "#f97316" },
    { name: "HTTP Flood", value: 8, color: "#3b82f6" },
    { name: "其他", value: 2, color: "#6b7280" },
  ]

  const protocolData = [
    { name: "UDP", value: 75, color: "#ef4444" },
    { name: "TCP", value: 20, color: "#f97316" },
    { name: "ICMP", value: 5, color: "#3b82f6" },
  ]

  const [packetRateData, setPacketRateData] = useState([
    { time: "0", rate: 0.5 },
    { time: "5", rate: 0.8 },
    { time: "10", rate: 1.5 },
    { time: "15", rate: 2.8 },
    { time: "20", rate: 4.2 },
    { time: "25", rate: 5.5 },
    { time: "30", rate: 7.2 },
    { time: "35", rate: 8.5 },
    { time: "40", rate: 6.8 },
    { time: "45", rate: 5.2 },
    { time: "50", rate: 3.8 },
    { time: "55", rate: 2.5 },
    { time: "60", rate: 1.8 },
  ])
  
  const topWafHosts: any = useTopAttackedHosts(filteredZones)
  // console.log('topWafHosts', topWafHosts)

  const topAttackedUrls = [
    { url: "/login.php", attackType: "SQL Injection", count: 2876, color: "#f97316" },
    { url: "/search?query=...", attackType: "XSS", count: 1543, color: "#ef4444" },
    { url: "/admin/config.php", attackType: "Path Traversal", count: 1234, color: "#eab308" },
    { url: "/api/user/delete", attackType: "Command Injection", count: 987, color: "#f97316" },
    { url: "/upload.php", attackType: "File Upload", count: 856, color: "#ef4444" },
    { url: "/wp-admin/", attackType: "Brute Force", count: 745, color: "#eab308" },
    { url: "/api/v1/auth", attackType: "SQL Injection", count: 623, color: "#f97316" },
    { url: "/checkout.php", attackType: "XSS", count: 512, color: "#ef4444" },
  ]

  const httpStatusData = [
    { name: "2xx (成功)", value: 98.9, color: "#06b6d4" },
    { name: "3xx (重定向)", value: 1.0, color: "#3b82f6" },
    { name: "4xx (客戶端錯誤)", value: 0.09, color: "#f97316" },
    { name: "5xx (伺服器錯誤)", value: 0.01, color: "#ef4444" },
  ]

  const trafficTrendData = [
    { hour: "0", traffic: 0.8, requests: 45 },
    { hour: "2", traffic: 0.9, requests: 48 },
    { hour: "4", traffic: 0.7, requests: 42 },
    { hour: "6", traffic: 1.1, requests: 55 },
    { hour: "8", traffic: 1.5, requests: 72 },
    { hour: "10", traffic: 1.8, requests: 85 },
    { hour: "12", traffic: 2.2, requests: 98 },
    { hour: "14", traffic: 2.5, requests: 105 },
    { hour: "16", traffic: 2.1, requests: 92 },
    { hour: "18", traffic: 1.9, requests: 88 },
    { hour: "20", traffic: 1.6, requests: 78 },
    { hour: "22", traffic: 1.3, requests: 65 },
    { hour: "24", traffic: 1.0, requests: 52 },
  ]

  const latencyRegions = [
    { region: "北美", x: "20%", y: "30%", latency: 35, color: "#10b981", lng: -95.7129, lat: 37.0902 },
    { region: "歐洲", x: "50%", y: "25%", latency: 45, color: "#10b981", lng: 10.4515, lat: 51.1657 },
    { region: "亞洲", x: "75%", y: "40%", latency: 120, color: "#f97316", lng: 100.6197, lat: 34.0479 },
    { region: "南美", x: "28%", y: "65%", latency: 180, color: "#ef4444", lng: -58.3816, lat: -14.235 },
    { region: "非洲", x: "52%", y: "55%", latency: 160, color: "#ef4444", lng: 17.8739, lat: -4.0383 },
    { region: "大洋洲", x: "82%", y: "70%", latency: 95, color: "#f97316", lng: 133.7751, lat: -25.2744 },
  ]

  const { setWafRisks, setSelectedBrand } = useWAFData()

  useEffect(() => {
    setSelectedBrand("cloudflare")
    setWafRisks([
      // 高風險 (High Severity)
      {
        id: "waf-1",
        title: "SQL 注入攻擊激增",
        severity: "critical",
        openIssues: 3120,
        resolvedIssues: 0,
        affectedAssets: 45,
        tags: ["SQL Injection", "Internet Exposed", "Exploit In Wild"],
        description:
          "檢測到針對 /login.php 和 /api/v1/auth 端點的大規模 SQL 注入攻擊嘗試，攻擊者試圖繞過身份驗證機制並獲取敏感數據庫資訊。此類攻擊可能導致數據洩露、帳戶劫持和系統完整性受損。",
        createdDate: "Apr 9, 2025",
        updatedDate: "Apr 9, 2025",
        exploitInWild: true,
        internetExposed: true,
        confirmedExploitable: true,
        cveId: "CVE-2025-1234",
        recommendations: [
          {
            title: "啟用 WAF SQL 注入防護規則",
            description: "立即啟用並更新 SQL 注入防護規則至最新版本，阻擋惡意 SQL 查詢",
            priority: "high",
          },
          {
            title: "封鎖惡意 IP 地址",
            description: "將檢測到的攻擊來源 IP 加入黑名單，防止持續攻擊",
            priority: "high",
          },
          {
            title: "加強輸入驗證",
            description: "在應用層實施嚴格的輸入驗證和參數化查詢",
            priority: "high",
          },
        ],
      },
      {
        id: "waf-2",
        title: "跨站腳本 (XSS) 攻擊檢測",
        severity: "high",
        openIssues: 1890,
        resolvedIssues: 456,
        affectedAssets: 23,
        tags: ["XSS", "Internet Exposed", "Confirmed Exploitable"],
        description:
          "在 /search 和 /checkout.php 端點檢測到 XSS 攻擊嘗試，攻擊者試圖注入惡意 JavaScript 腳本以竊取用戶 Cookie、會話令牌或執行未授權操作。",
        createdDate: "Apr 8, 2025",
        updatedDate: "Apr 9, 2025",
        exploitInWild: true,
        internetExposed: true,
        confirmedExploitable: true,
        cveId: "CVE-2025-2345",
        recommendations: [
          {
            title: "更新 XSS 防護規則",
            description: "啟用更嚴格的 XSS 過濾規則，阻擋腳本注入嘗試",
            priority: "high",
          },
          {
            title: "實施內容安全策略 (CSP)",
            description: "配置 Content-Security-Policy 標頭以限制腳本執行",
            priority: "high",
          },
        ],
      },

      // 中風險 (Medium Severity)
      {
        id: "waf-3",
        title: "惡意機器人流量",
        severity: "medium",
        openIssues: 2541,
        resolvedIssues: 1200,
        affectedAssets: 67,
        tags: ["Bot Traffic", "Rate Limiting", "Automated Attacks"],
        description:
          "檢測到大量自動化機器人流量，主要針對 API 端點和登入頁面。這些機器人可能用於撞庫攻擊、內容抓取或 DDoS 攻擊，可能導致服務降級和資源耗盡。",
        createdDate: "Apr 7, 2025",
        updatedDate: "Apr 9, 2025",
        exploitInWild: false,
        internetExposed: true,
        confirmedExploitable: false,
        recommendations: [
          {
            title: "啟用機器人管理",
            description: "配置 Cloudflare Bot Management 以識別和過濾惡意機器人",
            priority: "medium",
          },
          {
            title: "實施 Rate Limiting",
            description: "對 API 端點設置請求速率限制，防止濫用",
            priority: "medium",
          },
        ],
      },
      {
        id: "waf-4",
        title: "路徑遍歷攻擊嘗試",
        severity: "medium",
        openIssues: 1456,
        resolvedIssues: 890,
        affectedAssets: 18,
        tags: ["Path Traversal", "File Access", "Directory Listing"],
        description:
          "檢測到針對 /admin/config.php 和文件上傳端點的路徑遍歷攻擊，攻擊者試圖訪問系統文件或敏感配置文件。",
        createdDate: "Apr 6, 2025",
        updatedDate: "Apr 9, 2025",
        exploitInWild: false,
        internetExposed: true,
        confirmedExploitable: true,
        cveId: "CVE-2025-3456",
        recommendations: [
          {
            title: "啟用路徑遍歷防護",
            description: "配置 WAF 規則以阻擋包含 ../ 或絕對路徑的請求",
            priority: "medium",
          },
          {
            title: "限制文件訪問權限",
            description: "在應用層實施嚴格的文件路徑驗證和訪問控制",
            priority: "medium",
          },
        ],
      },

      // 低風險 (Low Severity)
      {
        id: "waf-5",
        title: "異常 User-Agent 檢測",
        severity: "low",
        openIssues: 982,
        resolvedIssues: 1500,
        affectedAssets: 12,
        tags: ["Suspicious Activity", "Monitoring"],
        description:
          "檢測到使用異常或偽造 User-Agent 標頭的請求，可能是自動化工具或爬蟲程序。雖然風險較低，但建議持續監控以識別潛在威脅。",
        createdDate: "Apr 5, 2025",
        updatedDate: "Apr 9, 2025",
        exploitInWild: false,
        internetExposed: true,
        confirmedExploitable: false,
        recommendations: [
          {
            title: "建立 User-Agent 白名單",
            description: "配置允許的 User-Agent 列表，阻擋可疑請求",
            priority: "low",
          },
          {
            title: "啟用監控模式",
            description: "先以監控模式觀察流量模式，避免誤判",
            priority: "low",
          },
        ],
      },
      {
        id: "waf-6",
        title: "HTTP 方法濫用",
        severity: "low",
        openIssues: 745,
        resolvedIssues: 2100,
        affectedAssets: 8,
        tags: ["HTTP Methods", "Protocol Abuse"],
        description: "檢測到使用非標準 HTTP 方法（如 TRACE、OPTIONS）的請求，可能用於信息收集或繞過安全控制。",
        createdDate: "Apr 4, 2025",
        updatedDate: "Apr 9, 2025",
        exploitInWild: false,
        internetExposed: true,
        confirmedExploitable: false,
        recommendations: [
          {
            title: "限制允許的 HTTP 方法",
            description: "僅允許必要的 HTTP 方法（GET、POST、PUT、DELETE）",
            priority: "low",
          },
        ],
      },
    ])
  }, [setWafRisks, setSelectedBrand])

  // 在「總覽 (Overview)」分頁中建立地圖實例
  useEffect(() => {
    if (activeTab !== "overview" || !mapContainerRef.current) return

    // Load MapLibre CSS and JS
    const loadMapLibre = async () => {
      // Add CSS
      if (!document.getElementById("maplibre-css")) {
        const link = document.createElement("link")
        link.id = "maplibre-css"
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css"
        document.head.appendChild(link)
      }

      // Load MapLibre JS
      if (!(window as any).maplibregl) {
        const script = document.createElement("script")
        script.src = "https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js"
        script.async = true
        document.head.appendChild(script)

        await new Promise((resolve) => {
          script.onload = resolve
        })
      }

      const maplibregl = (window as any).maplibregl

      if (mapRef.current) return

      // Initialize map
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: "https://demotiles.maplibre.org/style.json", // Native MapLibre style
        center: [30, 30],
        zoom: 1.2,
        interactive: true,
      })

      mapRef.current = map

      map.on("load", () => {
        map.addSource("attack-labels", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: attackSources.map((source: { country: string; percentage: number; lng: number; lat: number }) => ({
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [source.lng, source.lat],
              },
              properties: {
                label: `${source.country} ${source.percentage}%`,
              },
            })),
          },
        })

        map.addLayer({
          id: "attack-labels-layer",
          type: "symbol",
          source: "attack-labels",
          layout: {
            "text-field": ["get", "label"],
            "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
            "text-size": 12,
            "text-offset": [0, 1.5],
            "text-anchor": "top",
          },
          paint: {
            "text-color": "#ffffff",
            "text-halo-color": "#000000",
            "text-halo-width": 2,
          },
        })

        // Add pulsing dot for each attack source
        attackSources.forEach((source: { color: string; lng: number; lat: number; country: string; percentage: number }, index: number) => {
          const size = 100

          const pulsingDot: {
            width: number
            height: number
            data: Uint8Array | Uint8ClampedArray
            context: CanvasRenderingContext2D | null
            onAdd: () => void
            render: () => boolean
          } = {
            width: size,
            height: size,
            data: new Uint8Array(size * size * 4),
            context: null,

            onAdd: function () {
              const canvas = document.createElement("canvas")
              canvas.width = this.width
              canvas.height = this.height
              this.context = canvas.getContext("2d")
            },

            render: function () {
              const duration = 2000
              const t = (performance.now() % duration) / duration

              const radius = (size / 2) * 0.3
              const outerRadius = (size / 2) * 0.7 * t + radius
              const context = this.context

              if (!context) return true

              // Clear canvas
              context.clearRect(0, 0, this.width, this.height)

              // Outer pulsing circle
              context.beginPath()
              context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2)
              context.fillStyle = `rgba(239, 68, 68, ${1 - t})`
              context.fill()

              // Inner circle
              context.beginPath()
              context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2)
              context.fillStyle = source.color
              context.strokeStyle = "white"
              context.lineWidth = 2
              context.fill()
              context.stroke()

              // Update this image's data
              this.data = context.getImageData(0, 0, this.width, this.height).data

              // Continuously repaint the map
              map.triggerRepaint()

              return true
            },
          }

          map.addImage(`pulsing-dot-${index}`, pulsingDot as any, { pixelRatio: 2 })

          map.addSource(`attack-source-${index}`, {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: [source.lng, source.lat],
                  },
                  properties: {
                    country: source.country,
                    percentage: source.percentage,
                  },
                },
              ],
            },
          })

          map.addLayer({
            id: `attack-layer-${index}`,
            type: "symbol",
            source: `attack-source-${index}`,
            layout: {
              "icon-image": `pulsing-dot-${index}`,
              "icon-size": 0.5,
              "icon-allow-overlap": true,
            },
          })

          // Add popup on hover
          let popup: any = null
          map.on("mouseenter", `attack-layer-${index}`, (e: any) => {
            map.getCanvas().style.cursor = "pointer"
            const coordinates = e.features[0].geometry.coordinates.slice()
            const { country, percentage } = e.features[0].properties

            if (!popup) {
              popup = new maplibregl.Popup({
                closeButton: false,
                closeOnClick: false,
                offset: 10,
              })
                .setLngLat(coordinates)
                .setHTML(
                  `<div style="color: #000; padding: 4px;"><strong>${country}</strong><br/>攻擊比例: ${percentage}%</div>`,
                )
                .addTo(map)
            }
          })

          map.on("mouseleave", `attack-layer-${index}`, () => {
            map.getCanvas().style.cursor = ""
            if (popup) {
              popup.remove()
              popup = null
            }
          })
        })
      })
    }

    loadMapLibre()

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [activeTab])

  useEffect(() => {
    if (!mapRef.current || activeTab !== "overview" || attackSources.length === 0) return

    const map = mapRef.current
    const maplibregl = (window as any).maplibregl

    // 等待地图加载完成
    if (!map.loaded()) {
      map.once('load', () => updateMapData())
      return
    }

    updateMapData()

    function updateMapData() {
      try {
        // 更新标签数据源
        if (map.getSource('attack-labels')) {
          (map.getSource('attack-labels') as any).setData({
            type: "FeatureCollection",
            features: attackSources.map((source: { country: string; percentage: number; lng: number; lat: number }) => ({
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [source.lng, source.lat],
              },
              properties: {
                label: `${source.country} ${source.percentage}%`,
              },
            })),
          })
        }

        // 移除旧的图层和数据源
        for (let i = 0; i < 20; i++) {
          if (map.getLayer(`attack-layer-${i}`)) {
            map.off('click', `attack-layer-${i}`)
            map.off('mouseenter', `attack-layer-${i}`)
            map.off('mouseleave', `attack-layer-${i}`)
            map.removeLayer(`attack-layer-${i}`)
          }
          if (map.getSource(`attack-source-${i}`)) {
            map.removeSource(`attack-source-${i}`)
          }
          if (map.hasImage(`pulsing-dot-${i}`)) {
            map.removeImage(`pulsing-dot-${i}`)
          }
        }

        // 重新添加每个攻击源
        attackSources.forEach((source: { color: string; lng: number; lat: number; country: string; percentage: number }, index: number) => {
          const size = 100

          const pulsingDot: {
            width: number
            height: number
            data: Uint8Array | Uint8ClampedArray
            context: CanvasRenderingContext2D | null
            onAdd: () => void
            render: () => boolean
          } = {
            width: size,
            height: size,
            data: new Uint8Array(size * size * 4),
            context: null,

            onAdd: function () {
              const canvas = document.createElement("canvas")
              canvas.width = this.width
              canvas.height = this.height
              this.context = canvas.getContext("2d")
            },

            render: function () {
              const duration = 2000
              const t = (performance.now() % duration) / duration

              const radius = (size / 2) * 0.3
              const outerRadius = (size / 2) * 0.7 * t + radius
              const context = this.context

              if (!context) return true

              // Clear canvas
              context.clearRect(0, 0, this.width, this.height)

              // Outer pulsing circle
              context.beginPath()
              context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2)
              context.fillStyle = `rgba(239, 68, 68, ${1 - t})`
              context.fill()

              // Inner circle
              context.beginPath()
              context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2)
              context.fillStyle = source.color
              context.strokeStyle = "white"
              context.lineWidth = 2
              context.fill()
              context.stroke()

              // Update this image's data
              this.data = context.getImageData(0, 0, this.width, this.height).data

              // Continuously repaint the map
              map.triggerRepaint()

              return true
            },
          }

          map.addImage(`pulsing-dot-${index}`, pulsingDot as any, { pixelRatio: 2 })

          map.addSource(`attack-source-${index}`, {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: [source.lng, source.lat],
                  },
                  properties: {
                    country: source.country,
                    percentage: source.percentage,
                  },
                },
              ],
            },
          })

          map.addLayer({
            id: `attack-layer-${index}`,
            type: "symbol",
            source: `attack-source-${index}`,
            layout: {
              "icon-image": `pulsing-dot-${index}`,
              "icon-size": 0.5,
              "icon-allow-overlap": true,
            },
          })

          // Add popup on hover
          let popup: any = null
          map.on("mouseenter", `attack-layer-${index}`, (e: any) => {
            map.getCanvas().style.cursor = "pointer"
            const coordinates = e.features[0].geometry.coordinates.slice()
            const { country, percentage } = e.features[0].properties

            if (!popup) {
              popup = new maplibregl.Popup({
                closeButton: false,
                closeOnClick: false,
                offset: 10,
              })
                .setLngLat(coordinates)
                .setHTML(
                  `<div style="color: #000; padding: 4px;"><strong>${country}</strong><br/>攻擊比例: ${percentage}%</div>`,
                )
                .addTo(map)
            }
          })

          map.on("mouseleave", `attack-layer-${index}`, () => {
            map.getCanvas().style.cursor = ""
            if (popup) {
              popup.remove()
              popup = null
            }
          })
        })

        console.log('✅ Map data updated with', attackSources.length, 'sources')
      } catch (error) {
        console.error('❌ Error updating map data:', error)
      }
    }
  }, [attackSources, activeTab])

  useEffect(() => {
    if (activeTab !== "cdn" || !cdnMapContainerRef.current) return

    const loadMapLibre = async () => {
      // Add CSS
      if (!document.getElementById("maplibre-css")) {
        const link = document.createElement("link")
        link.id = "maplibre-css"
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css"
        document.head.appendChild(link)
      }

      // Load MapLibre JS
      if (!(window as any).maplibregl) {
        const script = document.createElement("script")
        script.src = "https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js"
        script.async = true
        document.head.appendChild(script)

        await new Promise((resolve) => {
          script.onload = resolve
        })
      }

      const maplibregl = (window as any).maplibregl

      if (cdnMapRef.current) return

      // Initialize map
      const map = new maplibregl.Map({
        container: cdnMapContainerRef.current,
        style: "https://demotiles.maplibre.org/style.json",
        center: [30, 30],
        zoom: 1.2,
        interactive: true,
      })

      cdnMapRef.current = map

      map.on("load", () => {
        // Add labels for latency regions
        map.addSource("latency-labels", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: latencyRegions.map((region) => ({
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [region.lng, region.lat],
              },
              properties: {
                label: `${region.region} ${region.latency}ms`,
              },
            })),
          },
        })

        map.addLayer({
          id: "latency-labels-layer",
          type: "symbol",
          source: "latency-labels",
          layout: {
            "text-field": ["get", "label"],
            "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
            "text-size": 12,
            "text-offset": [0, 1.5],
            "text-anchor": "top",
          },
          paint: {
            "text-color": "#ffffff",
            "text-halo-color": "#000000",
            "text-halo-width": 2,
          },
        })

        // Add pulsing dot for each latency region
        latencyRegions.forEach((region: { region: string; x: string; y: string; latency: number; color: string; lng: number; lat: number }, index: number) => {
          const size = 100

          const pulsingDot: {
            width: number
            height: number
            data: Uint8Array | Uint8ClampedArray
            context: CanvasRenderingContext2D | null
            onAdd: () => void
            render: () => boolean
          } = {
            width: size,
            height: size,
            data: new Uint8Array(size * size * 4),
            context: null,

            onAdd: function () {
              const canvas = document.createElement("canvas")
              canvas.width = this.width
              canvas.height = this.height
              this.context = canvas.getContext("2d")
            },

            render: function () {
              const duration = 2000
              const t = (performance.now() % duration) / duration

              const radius = (size / 2) * 0.3
              const outerRadius = (size / 2) * 0.7 * t + radius
              const context = this.context

              if (!context) return true

              // Clear canvas
              context.clearRect(0, 0, this.width, this.height)

              // Outer pulsing circle
              context.beginPath()
              context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2)

              // Color based on latency
              let pulseColor = "16, 185, 129" // green
              if (region.latency > 150) {
                pulseColor = "239, 68, 68" // red
              } else if (region.latency > 50) {
                pulseColor = "249, 115, 22" // orange
              }

              context.fillStyle = `rgba(${pulseColor}, ${1 - t})`
              context.fill()

              // Inner circle
              context.beginPath()
              context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2)
              context.fillStyle = region.color
              context.strokeStyle = "white"
              context.lineWidth = 2
              context.fill()
              context.stroke()

              // Update this image's data
              this.data = context.getImageData(0, 0, this.width, this.height).data

              // Continuously repaint the map
              map.triggerRepaint()

              return true
            },
          }

          map.addImage(`latency-dot-${index}`, pulsingDot as any, { pixelRatio: 2 })

          map.addSource(`latency-source-${index}`, {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: [region.lng, region.lat],
                  },
                  properties: {
                    region: region.region,
                    latency: region.latency,
                  },
                },
              ],
            },
          })

          map.addLayer({
            id: `latency-layer-${index}`,
            type: "symbol",
            source: `latency-source-${index}`,
            layout: {
              "icon-image": `latency-dot-${index}`,
              "icon-size": 0.5,
              "icon-allow-overlap": true,
            },
          })

          // Add popup on hover
          let popup: any = null
          map.on("mouseenter", `latency-layer-${index}`, (e: any) => {
            map.getCanvas().style.cursor = "pointer"
            const coordinates = e.features[0].geometry.coordinates.slice()
            const { region, latency } = e.features[0].properties

            if (!popup) {
              popup = new maplibregl.Popup({
                closeButton: false,
                closeOnClick: false,
                offset: 10,
              })
                .setLngLat(coordinates)
                .setHTML(
                  `<div style="color: #000; padding: 4px;"><strong>${region}</strong><br/>延遲: ${latency}ms</div>`,
                )
                .addTo(map)
            }
          })

          map.on("mouseleave", `latency-layer-${index}`, () => {
            map.getCanvas().style.cursor = ""
            if (popup) {
              popup.remove()
              popup = null
            }
          })
        })
      })
    }

    loadMapLibre()

    return () => {
      if (cdnMapRef.current) {
        cdnMapRef.current.remove()
        cdnMapRef.current = null
      }
    }
  }, [activeTab])


  const renderContent = () => {
    if (activeTab === "waf") {
      return (
        <>
          {/* WAF Stats Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <div className="mb-2 text-xs font-normal text-slate-300">總安全事件</div>              
              <div className="flex items-baseline gap-2 mb-1">
                <div className="text-white font-medium text-2xl">
                  <CountUp end={wafEventsTotal || 0} delay={0.4} duration={1500} />
                </div>
                <div className="flex items-center gap-1 relative">
                  {wafEventsChanges?.total !== 0 ? (
                    <div className={`flex items-center gap-0.5 ${wafEventsChanges?.total > 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {wafEventsChanges?.total > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      <span className="text-sm font-medium">{Math.abs(wafEventsChanges?.total || 0).toFixed(1)}%</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-0.5 text-slate-500">
                      <Minus className="w-3 h-3" />
                      <span className="text-sm font-medium">0.0%</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-[10px] text-slate-400">
                Previous: {(wafEventsResp?.previous?.total || 0).toLocaleString()}
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <div className="mb-2 text-xs text-slate-300">已阻擋 (Blocked)</div>
              <div className="flex items-baseline gap-2 mb-1">
                <div className="text-white font-medium text-2xl">
                  <CountUp end={wafEventsBlocks || 0} delay={0.45} duration={1500} />
                </div>
                {/* <div className="flex items-center gap-1 relative">
                  {wafEventsChanges?.blocks !== 0 ? (
                    <div className={`flex items-center gap-0.5 ${wafEventsChanges?.blocks > 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {wafEventsChanges?.blocks > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      <span className="text-sm font-medium">
                        {wafEventsBlocks - (wafEventsResp?.previous?.blocks || 0) > 0 ? "+" : ""}
                        {(wafEventsBlocks - (wafEventsResp?.previous?.blocks || 0)).toLocaleString()}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-0.5 text-slate-500">
                      <Minus className="w-3 h-3" />
                      <span className="text-sm font-medium">0</span>
                    </div>
                  )}
                </div> */}
              </div>
              <div className="text-[10px] text-slate-400">
                Previous: {(wafEventsResp?.previous?.blocks || 0).toLocaleString()}
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <div className="mb-2 text-xs text-slate-300">僅監控 (Monitored)</div>
              <div className="flex items-baseline gap-2 mb-1">
                <div className="text-green-400 font-medium text-2xl">
                  <CountUp end={wafEventsMonitors || 0} delay={0.5} duration={1500} />
                </div>
                {/* <div className="flex items-center gap-1 relative">
                  {wafEventsChanges?.monitors !== 0 ? (
                    <div className={`flex items-center gap-0.5 ${wafEventsChanges?.monitors > 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {wafEventsChanges?.monitors > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      <span className="text-sm font-medium">
                        {wafEventsMonitors - (wafEventsResp?.previous?.monitors || 0) > 0 ? "+" : ""}
                        {(wafEventsMonitors - (wafEventsResp?.previous?.monitors || 0)).toLocaleString()}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-0.5 text-slate-500">
                      <Minus className="w-3 h-3" />
                      <span className="text-sm font-medium">0</span>
                    </div>
                  )}
                </div> */}
              </div>
              <div className="text-[10px] text-slate-400">
                Previous: {(wafEventsResp?.previous?.monitors || 0).toLocaleString()}
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <div className="mb-2 text-xs text-slate-300">阻擋率</div>
              <div className="text-green-400 font-medium text-2xl">
                <CountUp 
                  end={((wafEventsBlocks || 0) / (wafEventsTotal || 1) * 100)} 
                  decimals={((wafEventsBlocks || 0) / (wafEventsTotal || 1) * 100) === 0 ? 0 : 2} 
                  suffix="%" 
                  delay={0.55} 
                  duration={1500} 
                />
              </div>
              <div className="text-[10px] text-slate-400">
                Previous: {((wafEventsResp?.previous?.blocks || 0) / (wafEventsResp?.previous?.total || 0) * 100).toFixed(2)}%
              </div>
            </motion.div>
          </div>

          {/* Event Trend & Top Rules */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Event Trend Chart */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <h3 className="text-white mb-4 font-normal">事件趨勢</h3>

              <div className="text-xs text-slate-400 mb-4">
                Y軸: 事件數量
                <br />
                X軸: 時間
              </div>

              <div className="h-64">
                {wafEventTrendData.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-slate-400 text-center">
                      <p className="text-lg mb-2">暫無數據</p>
                      <p className="text-sm">請調整時間範圍或檢查數據源</p>
                    </div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={wafEventTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                      <XAxis 
                        dataKey="hour" 
                        stroke="#94a3b8" 
                        tick={{ fill: "#94a3b8", fontSize: 10 }}
                        angle={-45}
                        textAnchor="end"
                        height={70}
                        interval={Math.ceil(wafEventTrendData.length / 10)}
                      />
                      <YAxis stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 10 }} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          border: "1px solid #334155",
                          borderRadius: "8px",
                          color: "#f1f5f9",
                        }}
                      />
                      <Bar dataKey="blocked" stackId="a" fill="#ef4444" name="已阻擋" />
                      <Bar dataKey="monitored" stackId="a" fill="#f97316" name="僅監控" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500" />
                  <span className="text-sm text-slate-300">已阻擋 (Blocked)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500" />
                  <span className="text-sm text-slate-300">僅監控 (Monitored)</span>
                </div>
              </div>
            </motion.div>

            {/* TOP 5 Rules */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <h3 className="text-white mb-6 font-normal">TOP 5 被攻擊的網域</h3>

              <div className="space-y-6" key={topWafHosts.length}>
                {topWafHosts.length === 0 ? (
                  <div className="flex items-center justify-center h-full" style={{ width: "100%", height: "240px" }}>
                    <div className="text-slate-400 text-center">
                      <p className="text-base mb-1">暫無數據</p>
                    </div>
                  </div>
                ) : (
                  topWafHosts.map((item: any, index: number) => {
                    const maxCount = topWafHosts[0]?.count || 1
                    const percentage = ((item.count || 0) / maxCount) * 100

                    return (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-slate-300">{item.name}</span>
                          <div className="text-sm text-white font-semibold">
                            <CountUp 
                              end={item.count} 
                              delay={0.4 + (index * 0.1)} 
                              duration={1000} 
                            />
                          </div>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                          <motion.div
                            key={item.name}
                            initial={{ width: "0%" }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ 
                              delay: 0.1 + (index * 0.1), 
                              duration: 1, 
                              ease: "easeOut" 
                            }}
                            className="h-2 rounded-full"
                            style={{
                              backgroundColor: item.color,
                            }}
                          />
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </motion.div>

            {/* TOP 10 Countries */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <h3 className="text-white mb-6 font-normal">TOP 10 攻擊來源國家</h3>

              <div style={{ width: "100%", height: "240px" }}>
                {attackSources.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-slate-400 text-center">
                      <p className="text-base mb-1">暫無數據</p>
                    </div>
                  </div>
                ) : (
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={attackSources.slice(0, 10)}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="count"
                        nameKey="country"
                        stroke="none"
                      >
                        {attackSources.slice(0, 10).map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          border: "1px solid #334155",
                          borderRadius: "8px",
                          color: "#ffffff",
                        }}
                        itemStyle={{ color: "#ffffff" }}
                        formatter={(value: number, name: string) => [
                          `${value.toLocaleString()} 次攻擊`,
                          name
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                {attackSources.slice(0, 10).map((item: any, index: number) => (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-300 truncate max-w-[80px]">{item.country}</span>
                    <span className="text-white font-medium">{item.count.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* TOP 10 Cities */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <h3 className="text-white mb-6 font-normal">TOP 10 攻擊來源城市</h3>

              <div style={{ width: "100%", height: "240px" }}>
                {
                  attackCitySources.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-slate-400 text-center">
                        <p className="text-base mb-1">暫無數據</p>
                      </div>
                    </div>
                  ) : (
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={attackCitySources.slice(0, 10)}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="count"
                          nameKey="city"
                          stroke="none"
                        >
                          {attackCitySources.slice(0, 10).map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1e293b",
                            border: "1px solid #334155",
                            borderRadius: "8px",
                            color: "#ffffff",
                          }}
                          itemStyle={{ color: "#ffffff" }}
                          formatter={(value: number, name: string) => [
                            `${value.toLocaleString()} 次攻擊`,
                            name
                          ]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )
                }
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                {attackCitySources.slice(0, 10).map((item: any, index: number) => (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-300 truncate max-w-[80px]">{item.city}</span>
                    <span className="text-white font-medium">{item.count.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 gap-12 mb-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <h3 className="text-white mb-4 font-normal">攻擊活動分析</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trafficData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                    <XAxis
                      dataKey="timestamp"
                      stroke="#94a3b8"
                      tick={{ fill: "#94a3b8", fontSize: 10 }}
                      tickFormatter={(val) => {
                        const item = trafficData.find((d: any) => d.timestamp === val);
                        return item ? item.time : "";
                      }}
                      angle={-45}
                      textAnchor="end"
                      height={70}
                      interval="preserveStartEnd"
                      minTickGap={30} // 增加間距，防止標籤重疊
                    />
                    <YAxis
                      stroke="#94a3b8"
                      tick={{ fill: "#94a3b8", fontSize: 10 }}
                      tickFormatter={(value) => value.toLocaleString()}
                      label={{ value: "請求數", angle: -90, position: "insideLeft", fill: "#94a3b8" }}
                      domain={trafficYDomain}
                      ticks={trafficYTicks}
                      allowDataOverflow={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                        color: "#f1f5f9",
                      }}
                      formatter={(value: number, name: string) => {
                        const labels: Record<string, string> = {
                          block: "阻擋 (Block)",
                          log: "記錄 (Log)",
                          skip: "跳過 (Skip)",
                          managedChallenge: "受控的查問",
                          jschallenge: "JS 查問",
                          attack: "攻擊總計",
                          clean: "正常總計"
                        };
                        return [value.toLocaleString(), labels[name] || name];
                      }}
                      labelFormatter={(label, payload) => {
                        const fullTime = payload?.[0]?.payload?.fullTime
                        return `時間: ${fullTime || label}`
                      }}
                    />
                    <Line type="monotone" dataKey="block" stroke="#ef4444" strokeWidth={2} dot={false} animationDuration={1500} animationBegin={100} />
                    <Line type="monotone" dataKey="log" stroke="#3b82f6" strokeWidth={2} dot={false} animationDuration={1500} animationBegin={100} />
                    <Line type="monotone" dataKey="skip" stroke="#10b981" strokeWidth={2} dot={false} animationDuration={1500} animationBegin={100} />
                    <Line type="monotone" dataKey="managedChallenge" stroke="#f59e0b" strokeWidth={2} dot={false} animationDuration={1500} animationBegin={100} />
                    <Line type="monotone" dataKey="jschallenge" stroke="#8b5cf6" strokeWidth={2} dot={false} animationDuration={1500} animationBegin={100} />
                    {/* 將參考線放在最後面，確保在最上層 */}
                    <ReferenceLine y={0} stroke="#475569" strokeWidth={1} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-xs text-slate-300">阻擋 (Block)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-xs text-slate-300">記錄 (Log)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-xs text-slate-300">跳過 (Skip)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-xs text-slate-300">受控的查問</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500" />
                  <span className="text-xs text-slate-300">JS 查問</span>
                </div>
              </div>

            </motion.div>
          </div>

          {/* TOP 10 Attacked URLs */}
          <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <h3 className="text-white mb-4 font-normal">TOP 10 被攻擊的路徑</h3>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">URL 路徑</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">網域</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">事件數</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topAttackedUrlsData.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="py-10 text-center text-slate-400">
                          暫無數據
                        </td>
                      </tr>
                    ) : (
                      topAttackedUrlsData.map((item: any, index: number) => (
                        <tr key={index} className="border-b border-slate-800 hover:bg-slate-800/30">
                          <td className="py-3 px-4 text-sm text-slate-300 font-mono">{item.url}</td>
                          <td className="py-3 px-4">
                            <span
                              className="px-2 py-1 text-xs font-medium rounded"
                              style={{
                                backgroundColor: `${item.color}20`,
                                color: item.color,
                              }}
                            >
                              {item.host}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-300 font-semibold">{item.count.toLocaleString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>

        </>
      )
    }

    if (activeTab === "ddos") {
      return (
        <>
          {/* DDoS Stats Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md group relative"
            >
              <div className="mb-2 text-xs text-slate-300">攻擊峰值</div>
              <div className="flex items-baseline gap-2 mb-1">
                <div className="text-2xl text-white font-medium">
                  <CountUp end={peakRps} decimals={peakRps === 0 ? 0 : 2} delay={0.4} duration={1500} />
                </div>
                <div className="text-lg text-white">{peakUnit}</div>
                {/* <div className="flex items-center gap-1 relative">
                  {peakChanges?.value !== 0 ? (
                    <div className={`flex items-center gap-0.5 ${peakChanges?.value > 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {peakChanges?.value > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      <span className="text-sm font-medium">{Math.abs(peakChanges?.value || 0).toFixed(1)}%</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-0.5 text-slate-500">
                      <Minus className="w-3 h-3" />
                      <span className="text-sm font-medium">0.0%</span>
                    </div>
                  )}
                </div> */}
              </div>
              <div className="text-[10px] text-slate-400">
                Previous: {peakPrevious?.value.toLocaleString(undefined, { maximumFractionDigits: 2 })} {peakPrevious?.unit}
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md group relative"
            >
              <div className="mb-2 text-xs text-slate-300">L7 已清洗流量</div>
              <div className="flex items-baseline gap-2 mb-1">
                <div className="text-2xl text-red-400 font-medium">
                  <CountUp end={cleanedTrafficData.bytes} decimals={cleanedTrafficData.bytes === 0 ? 0 : 2} delay={0.4} duration={1500} />
                </div>
                <div className="text-lg text-red-400">{cleanedTrafficData.unit}</div>
                <div className="flex items-center gap-1 relative">
                  {cleanedTrafficChanges?.bytes !== 0 ? (
                    <div className={`flex items-center gap-0.5 ${cleanedTrafficChanges?.bytes > 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {cleanedTrafficChanges?.bytes > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      <span className="text-sm font-medium">{Math.abs(cleanedTrafficChanges?.bytes || 0).toFixed(1)}%</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-0.5 text-slate-500">
                      <Minus className="w-3 h-3" />
                      <span className="text-sm font-medium">0.0%</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-[10px] text-slate-400">
                Previous: {cleanedTrafficData.previous?.bytes.toLocaleString(undefined, { maximumFractionDigits: 2 })} {cleanedTrafficData.previous?.unit}
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md group relative"
            >
              <div className="mb-2 text-xs text-slate-300">L7 已清洗請求數</div>
              <div className="flex items-baseline gap-2 mb-1">
                <div className="text-2xl text-red-400 font-medium">
                  <CountUp end={cleanedTrafficData.count} delay={0.45} duration={1500} />
                </div>
                {/* <div className="flex items-center gap-1 relative">
                  {cleanedTrafficChanges?.count !== 0 ? (
                    <div className={`flex items-center gap-0.5 ${cleanedTrafficChanges?.count > 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {cleanedTrafficChanges?.count > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      <span className="text-sm font-medium">{Math.abs(cleanedTrafficChanges?.count || 0).toFixed(1)}%</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-0.5 text-slate-500">
                      <Minus className="w-3 h-3" />
                      <span className="text-sm font-medium">0.0%</span>
                    </div>
                  )}
                </div> */}
              </div>
              <div className="text-[10px] text-slate-400">
                Previous: {cleanedTrafficData.previous?.count.toLocaleString()}
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md px-5 py-5"
            >
              <div className="mb-2 text-xs text-slate-300">攔截率</div>
              <div className="flex items-baseline gap-2 mb-2">
                <div className="text-green-400 font-medium text-2xl">
                  <CountUp end={cleanedTrafficData?.rate} decimals={cleanedTrafficData?.rate === 0 ? 0 : 2} suffix="%" delay={0.5} duration={1500} />
                </div>
                <div className="flex items-center gap-1 relative">
                  {cleanedTrafficChanges?.rate !== 0 ? (
                    <div className={`flex items-center gap-0.5 ${cleanedTrafficChanges?.rate > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {cleanedTrafficChanges?.rate > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      <span className="text-sm font-medium">{Math.abs(cleanedTrafficChanges?.rate || 0).toFixed(1)}%</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-0.5 text-slate-500">
                      <Minus className="w-3 h-3" />
                      <span className="text-sm font-medium">0.0%</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-[10px] text-slate-400">
                Previous: {cleanedTrafficData?.previous?.rate.toFixed(2)}%
              </div>
            </motion.div>
          </div>

          {/* Analysis Section */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <h3 className="text-white mb-4 font-normal">L7 清洗流量即時趨勢</h3>

              <div className="text-xs text-slate-400 mb-4">
                Y軸: 流量 ({cleanedTrafficUnit})
                <br />
                X軸: 時間
              </div>

              <div className="h-64">
                {cleanedTrafficChartData.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-slate-400 text-center">
                      <p className="text-lg mb-2">暫無數據</p>
                      <p className="text-sm">請調整時間範圍或檢查數據源</p>
                    </div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={cleanedTrafficChartData}>
                      <defs>
                        <linearGradient id="colorCleaned" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                      <XAxis 
                        dataKey="timestamp" 
                        stroke="#94a3b8" 
                        tick={{ fill: "#94a3b8", fontSize: 10 }}
                        tickFormatter={(val) => {
                          const item = cleanedTrafficChartData.find((d: any) => d.timestamp === val);
                          return item ? item.time : "";
                        }}
                        angle={-45}
                        textAnchor="end"
                        height={70}
                        interval="preserveStartEnd"
                        minTickGap={30}
                      />
                      <YAxis 
                        stroke="#94a3b8" 
                        tick={{ fill: "#94a3b8", fontSize: 10 }} 
                        tickFormatter={(value) => {
                          if (value === 0) return "0";
                          const absValue = Math.abs(value);
                          const prefix = value < 0 ? "-" : "";
                          if (Number.isInteger(value)) return value.toString();
                          if (absValue >= 0.01) return prefix + absValue.toFixed(2);
                          let i = 3;
                          while (i < 6) {
                            if (Math.floor(absValue * Math.pow(10, i) + 0.0000000001) > 0) break;
                            i++;
                          }
                          return prefix + absValue.toFixed(Math.min(i + 1, 6));
                        }}
                        label={{ value: `流量 (${cleanedTrafficUnit})`, angle: -90, position: "insideLeft", fill: "#94a3b8" }}
                        domain={cleanedTrafficYDomain}
                        ticks={cleanedTrafficYTicks}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          border: "1px solid #334155",
                          borderRadius: "8px",
                          color: "#ffffff",
                        }}
                        itemStyle={{ color: "#ffffff" }}
                        formatter={(value: number) => [`${value.toFixed(2)} ${cleanedTrafficUnit}`, "已清洗流量"]}
                        labelFormatter={(label, payload) => {
                          const fullTime = payload?.[0]?.payload?.fullTime
                          return `時間: ${fullTime || label}`
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#10b981"
                        fill="url(#colorCleaned)"
                        strokeWidth={2}
                        dot={false}
                        animationDuration={1500}
                        animationBegin={100}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-sm text-slate-300">已清洗流量 (Cleaned Traffic)</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <h3 className="text-white mb-6 font-normal">TOP 5 攻擊網域</h3>

              <div className="space-y-6" key={topDDoSHostsData.length}>
                {
                  topDDoSHostsData.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-slate-400 text-center">
                        <p className="text-base mb-1">暫無數據</p>
                      </div>
                    </div>
                  ) : (
                    topDDoSHostsData.map((item: any, index: number) => {
                      const maxCount = topDDoSHostsData[0]?.count || 1
                      const percentage = ((item.count || 0) / maxCount) * 100
    
                      return (
                        <div key={index}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-slate-300">{item.name}</span>
                            <div className="text-sm text-white font-semibold">
                              <CountUp 
                                end={item.value} 
                                suffix={` ${item.unit}`} 
                                delay={0.4 + (index * 0.1)} 
                                duration={1000} 
                              />
                            </div>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                            <motion.div
                              key={item.name}
                              initial={{ width: "0%" }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ 
                                delay: 0.1 + (index * 0.1), 
                                duration: 1, 
                                ease: "easeOut" 
                              }}
                              className="h-2 rounded-full"
                              style={{
                                backgroundColor: item.color,
                              }}
                            />
                          </div>
                        </div>
                      )
                    })
                  )
                }
              </div>
            </motion.div>

          </div>

          {/* TOP 10 Attack Source IPs */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0, duration: 0.5 }}
            className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md mb-6"
          >
            <h3 className="text-white mb-4 font-normal">TOP 10 攻擊來源 IP</h3>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">IP 位址</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">地理位置</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">攻擊流量</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">次數</th>
                  </tr>
                </thead>
                <tbody>
                  {topAttackIPsData.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-10 text-center text-slate-400">
                        暫無數據
                      </td>
                    </tr>
                  ) : (
                    topAttackIPsData.map((item: any, index: number) => (
                        <tr key={index} className="border-b border-slate-800 hover:bg-slate-800/30">
                          <td className="py-3 px-4 text-sm text-slate-300">{item.ip}</td>
                          <td className="py-3 px-4 text-sm text-slate-300">
                            <span className="mr-2">{item.flag}</span>
                            {item.country}
                          </td>
                          <td className="py-3 px-4 text-sm text-red-400 font-semibold">{item.total_traffic}</td>
                          <td className="py-3 px-4 text-sm text-white font-semibold">{item.count}</td>
                        </tr>
                      ))
                    )
                  }
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* AI Assistant Actions */}
        </>
      )
    }

    if (activeTab === "cdn") {
      return (
        <>
          {/* CDN Stats Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <div className="mb-2 text-xs font-normal text-slate-300">總傳輸流量</div>
              <div className="flex items-baseline gap-2 mb-2">
                <div className="text-white font-medium text-2xl">
                  <CountUp end={cdnTotalTrafficValue} decimals={cdnTotalTrafficValue === 0 ? 0 : 2} delay={0.4} duration={1500} />
                </div>
                <div className="text-lg text-white">{cdnTotalTrafficUnit}</div>
                <div className="flex items-center gap-1 relative">
                  {cdnTotalTrafficChanges?.value !== 0 ? (
                    <div className={`flex items-center gap-0.5 ${cdnTotalTrafficChanges?.value > 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {cdnTotalTrafficChanges?.value > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      <span className="text-sm font-medium">{Math.abs(cdnTotalTrafficChanges?.value || 0).toFixed(1)}%</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-0.5 text-slate-500">
                      <Minus className="w-3 h-3" />
                      <span className="text-sm font-medium">0.0%</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-[10px] text-slate-400">
                Previous: {cdnTotalTrafficPrevious?.value.toLocaleString(undefined, { maximumFractionDigits: 2 })} {cdnTotalTrafficPrevious?.unit}
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <div className="mb-2 text-xs text-slate-300">快取節省率</div>
              <div className="flex items-baseline gap-2 mb-2">
                <div className="text-white font-medium text-2xl">
                  <CountUp end={cdnCacheRate} decimals={cdnCacheRate === 0 ? 0 : 2} suffix=" %" delay={0.45} duration={1500} />
                </div>
              </div>
              <div className="text-[10px] text-slate-400">
                Previous: {cdnTotalTrafficPrevious?.cached_rate.toLocaleString(undefined, { maximumFractionDigits: 2 })} %
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <div className="mb-2 text-xs text-slate-300">快取命中率 (Cache Hit)</div>
              <div className="flex items-baseline gap-2 mb-2">
                <div className="text-green-400 font-medium text-2xl">
                  <CountUp end={cacheHitRate || 0} decimals={(cacheHitRate || 0) === 0 ? 0 : 2} suffix="%" delay={0.5} duration={1500} />
                </div>
                <div className="flex items-center gap-1 relative">
                  {cacheHitChanges?.rate !== 0 ? (
                    <div className={`flex items-center gap-0.5 ${cacheHitChanges?.rate > 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {cacheHitChanges?.rate > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      <span className="text-sm font-medium">{formatRate(Math.abs(cacheHitChanges?.rate || 0))}%</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-0.5 text-slate-500">
                      <Minus className="w-3 h-3" />
                      <span className="text-sm font-medium">0.00%</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-[10px] text-slate-400 mb-1">
               快取次數: Current: {cacheHitCount.toLocaleString()} / Previous: {cacheHitRateResp?.previous?.hits.toLocaleString()}
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <div className="mb-2 text-xs font-normal text-slate-300">平均原站回應時間 (ms)</div>
              <div className="flex items-baseline gap-2 mb-2">
                <div className="text-white font-medium text-2xl">
                  <CountUp end={cdnAverageResponseTime} decimals={cdnAverageResponseTime === 0 ? 0 : 2} delay={0.55} duration={1500} />
                </div>
              </div>
              <div className="text-[10px] text-slate-400">
                Previous: {cdnTotalTrafficPrevious?.average_response_time.toLocaleString(undefined, { maximumFractionDigits: 0 })} ms
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 gap-12 mb-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <h3 className="text-white mb-4 font-normal">快取狀態分析</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cdnTrafficChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                    <XAxis
                      dataKey="timestamp"
                      stroke="#94a3b8"
                      tick={{ fill: "#94a3b8", fontSize: 10 }}
                      tickFormatter={(val) => {
                        const item = cdnTrafficChartData.find((d: any) => d.timestamp === val);
                        return item ? item.time : "";
                      }}
                      angle={-45}
                      textAnchor="end"
                      height={70}
                      interval="preserveStartEnd"
                      minTickGap={30}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      tick={{ fill: "#94a3b8", fontSize: 10 }}
                      tickFormatter={(value) => value.toLocaleString()}
                      label={{ value: "請求數", angle: -90, position: "insideLeft", fill: "#94a3b8" }}
                      domain={cdnTrafficYDomain}
                      ticks={cdnTrafficYTicks}
                      allowDataOverflow={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                        color: "#f1f5f9",
                      }}
                      formatter={(value: number, name: string) => {
                        return [value.toLocaleString(), CACHE_STATUS_LABELS[name] || name];
                      }}
                      labelFormatter={(label, payload) => {
                        const fullTime = payload?.[0]?.payload?.fullTime
                        return `時間: ${fullTime || label}`
                      }}
                    />
                    {cdnStatuses.map((status: string, idx: number) => (
                      <Line 
                        key={status}
                        type="monotone" 
                        dataKey={status} 
                        stroke={CACHE_STATUS_COLORS[status] || "#" + Math.floor(Math.random()*16777215).toString(16)} 
                        strokeWidth={2} 
                        dot={false} 
                        animationDuration={1500}
                        animationBegin={100}
                      />
                    ))}
                    <ReferenceLine y={0} stroke="#475569" strokeWidth={1} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
                {cdnStatuses.map((status: string) => (
                  <div key={status} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CACHE_STATUS_COLORS[status] || "#ccc" }} />
                    <span className="text-xs text-slate-300">{CACHE_STATUS_LABELS[status] || status}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* CDN 節點 & HTTP Status */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <h3 className="text-white mb-6 font-normal">快取狀態統計</h3>
              <div style={{ width: "100%", height: "240px" }}>
                {topCacheStatusData.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-slate-400 text-center">
                      <p className="text-base mb-1">暫無數據</p>
                    </div>
                  </div>
                ) : (
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={topCacheStatusData.slice(0, 10)}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="count"
                        nameKey="cache_status"
                        stroke="none"
                      >
                        {topCacheStatusData.slice(0, 10).map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          border: "1px solid #334155",
                          borderRadius: "8px",
                          color: "#ffffff",
                        }}
                        itemStyle={{ color: "#ffffff" }}
                        formatter={(value: number, name: string) => [
                          `${value.toLocaleString()} 次`,
                          name
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                {topCacheStatusData.slice(0, 10).map((item: any, index: number) => (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-300 truncate max-w-[80px]">{item.cache_status}</span>
                    <span className="text-white font-medium">{item.percentage.toLocaleString()} %</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* HTTP Status Distribution */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <h3 className="text-white mb-6 font-normal">TOP 10 HTTP 狀態碼</h3>

              <div style={{ width: "100%", height: "240px" }}>
                {topHttpStatusData.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-slate-400 text-center">
                      <p className="text-base mb-1">暫無數據</p>
                    </div>
                  </div>
                ) : (
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={topHttpStatusData.slice(0, 10)}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="count"
                        nameKey="http_status"
                        stroke="none"
                      >
                        {topHttpStatusData.slice(0, 10).map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          border: "1px solid #334155",
                          borderRadius: "8px",
                          color: "#ffffff",
                        }}
                        itemStyle={{ color: "#ffffff" }}
                        formatter={(value: number, name: string) => [
                          `${value.toLocaleString()} 次`,
                          name
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                {topHttpStatusData.slice(0, 10).map((item: any, index: number) => (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-300 truncate max-w-[80px]">{item.http_status}</span>
                    <span className="text-white font-medium">{item.percentage.toLocaleString()} %</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Traffic & Request Trend */}
          <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <h3 className="text-white mb-4 font-normal">TOP 5 CDN 節點</h3>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">節點</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">平均原站回應時間 (ms)</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">次數</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topCdnNodesData.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="py-10 text-center text-slate-400">
                          暫無數據
                        </td>
                      </tr>
                    ) : (
                      topCdnNodesData.map((item: any, index: number) => (
                        <tr key={index} className="border-b border-slate-800 hover:bg-slate-800/30">
                          <td className="py-3 px-4 text-sm text-slate-200 font-mono">{item.name}</td>
                          <td className="py-3 px-4 text-sm text-slate-300 font-semibold">{item.responseTime}</td>
                          <td className="py-3 px-4 text-sm text-slate-300 font-semibold">{item.count.toLocaleString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
        </>
      )
    }

    // Overview tab content
    return (
      <>

        {/* Alert Banner */}
        {/* <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-red-950/30 border border-red-500/50 p-6 mb-6 rounded-md"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-red-400 font-semibold text-lg mb-2 flex items-center gap-2">
                  <span className="text-xs bg-red-500/20 px-2 py-1 rounded">REQUIRES ATTENTION</span>
                </h3>
                <h4 className="text-white font-semibold mb-2">
                  偵測到大規模 DDoS 攻擊 (Large-Scale DDoS Attack Detected)
                </h4>
                <p className="text-slate-300 text-sm">
                  系統已自動啟動緩解機制，當前攻擊峰值 <span className="text-red-400 font-semibold">8.2 Gbps</span>
                  ，主要類型為 UDP Flood，源伺服器仍正常運作。
                </p>
              </div>
            </div>
            <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors duration-200 flex-shrink-0">
              查看即時攻擊詳情
            </button>
          </div>
        </motion.div> */}

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md group relative"
            >
              <div className="mb-2 text-xs text-slate-300">DDoS 清洗流量</div>
              <div className="flex items-baseline gap-2 mb-1">
                <div className="text-2xl text-green-400 font-medium">
                  <CountUp 
                    end={cleanedTrafficData.bytes} 
                    decimals={cleanedTrafficData.bytes === 0 ? 0 : 2} 
                    delay={0.5}
                    duration={1500}
                  />
                </div>
                <div className="text-lg text-green-400">{cleanedTrafficData.unit}</div>
              </div>
              <div className="text-[10px] text-slate-400">
                Previous: {cleanedTrafficData.previous?.bytes.toLocaleString(undefined, { maximumFractionDigits: 2 })} {cleanedTrafficData.previous?.unit}
              </div>
            </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md group relative"
          >
            <div className="mb-2 text-xs text-slate-300">WAF 已阻擋威脅</div>
            <div className="flex items-baseline gap-2 mb-1">
              <div className="text-2xl text-white font-medium">
                <CountUp 
                  end={wafEventsBlocks || 0} 
                  delay={0.6}
                  duration={1500}
                />
              </div>
              {/* <div className="flex items-center gap-1 relative">
                {wafEventsChanges?.blocks !== 0 ? (
                  <div className={`flex items-center gap-0.5 ${wafEventsChanges?.blocks > 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {wafEventsChanges?.blocks > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span className="text-sm font-medium">
                      {wafEventsBlocks - (wafEventsResp?.previous?.blocks || 0) > 0 ? "+" : ""}
                      {(wafEventsBlocks - (wafEventsResp?.previous?.blocks || 0)).toLocaleString()}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-0.5 text-slate-500">
                    <Minus className="w-3 h-3" />
                    <span className="text-sm font-medium">0</span>
                  </div>
                )}
              </div> */}
            </div>
            <div className="text-[10px] text-slate-400">
              Previous: {(wafEventsResp?.previous?.blocks || 0).toLocaleString()}
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md group relative"
          >
            <div className="mb-2 text-xs text-slate-300">CDN 快取命中率 (Cache Hit)</div>
            <div className="flex items-baseline gap-2 mb-1">
              <div className="text-2xl font-medium text-white">
                <CountUp 
                  end={cacheHitRate || 0} 
                  decimals={cacheHitRate === 0 ? 0 : 2}
                  suffix="%"
                  delay={0.7}
                  duration={1500}
                />
              </div>
              <div className="flex items-center gap-1 relative">
                {cacheHitChanges?.rate !== 0 ? (
                  <div className={`flex items-center gap-0.5 ${cacheHitChanges?.rate > 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {cacheHitChanges?.rate > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span className="text-sm font-medium">{formatRate(Math.abs(cacheHitChanges?.rate || 0))}%</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-0.5 text-slate-500">
                    <Minus className="w-3 h-3" />
                    <span className="text-sm font-medium">0.00%</span>
                  </div>
                )}
              </div>
            </div>
            <div className="text-[10px] text-slate-400 mb-1">
              Previous: {formatRate(cacheHitRateResp?.previous?.rate || 0)}%
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md group relative"
          >
            <div className="mb-2 text-xs text-slate-300">源伺服器錯誤率 (5xx)</div>
            <div className="flex items-baseline gap-2 mb-1">
              <div className="text-2xl font-medium text-white">
                <CountUp 
                  end={originErrorRate || 0} 
                  decimals={originErrorRate === 0 ? 0 : 2}
                  suffix="%"
                  delay={0.8}
                  duration={1500}
                />
              </div>
              <div className="flex items-center gap-1 relative">
                {originErrorChanges?.rate !== 0 ? (
                  <div className={`flex items-center gap-0.5 ${originErrorChanges?.rate < 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {originErrorChanges?.rate > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span className="text-sm font-medium">{formatRate(Math.abs(originErrorChanges?.rate || 0))}%</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-0.5 text-slate-500">
                    <Minus className="w-3 h-3" />
                    <span className="text-sm font-medium">0.00%</span>
                  </div>
                )}
              </div>
            </div>
            <div className="text-[10px] text-slate-400 mb-1">
              Previous: {formatRate(originErrorRateResp?.previous?.rate || 0)}%
            </div>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Traffic Analysis Chart */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 }}
            className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
          >
            <h3 className="text-white mb-4 font-normal">即時流量分析</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficAnalysisChartData}>
                  <defs>
                    <linearGradient id="colorBlock" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorLog" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis
                    dataKey="timestamp"
                    stroke="#94a3b8"
                    tick={{ fill: "#94a3b8", fontSize: 10 }}
                    tickFormatter={(val) => {
                      const item = trafficAnalysisChartData.find((d: any) => d.timestamp === val);
                      return item ? item.time : "";
                    }}
                    angle={-45}
                    textAnchor="end"
                    height={70}
                    interval="preserveStartEnd"
                    minTickGap={30}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    tick={{ fill: "#94a3b8", fontSize: 10 }}
                    tickFormatter={(value) => {
                      if (value === 0) return "0";
                      const absValue = Math.abs(value);
                      const prefix = value < 0 ? "-" : "";

                      // 如果是整數，直接顯示 (例如 1, -1)
                      if (Number.isInteger(value)) return value.toString();

                      // 1. 如果大於等於 0.01，正常顯示兩位
                      if (absValue >= 0.01) return prefix + absValue.toFixed(2);
                      
                      // 2. 尋找第一個非零位元的位置 i
                      let i = 3;
                      while (i < 6) {
                        if (Math.floor(absValue * Math.pow(10, i) + 0.0000000001) > 0) break;
                        i++;
                      }
                      // 3. 顯示到第一個非零位元的下一位 (i+1)，最大到 6 位
                      return prefix + absValue.toFixed(Math.min(i + 1, 6));
                    }}
                    label={{ value: `流量 (${trafficAnalysisUnit})`, angle: -90, position: "insideLeft", fill: "#94a3b8" }}
                    domain={trafficAnalysisYDomain}
                    ticks={trafficAnalysisYTicks}
                    allowDataOverflow={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                      color: "#f1f5f9",
                    }}
                    formatter={(value: number, name: string) => {
                      const formatVal = (val: number) => {
                        if (val === 0) return "0";
                        if (val >= 0.01) return val.toFixed(2);
                        
                        let i = 3;
                        while (i < 6) {
                          if (Math.floor(val * Math.pow(10, i) + 0.0000000001) > 0) break;
                          i++;
                        }
                        return val.toFixed(Math.min(i + 1, 6));
                      };
                      const labels: Record<string, string> = {
                        attackVal: "攻擊流量 (Attack Traffic)",
                        cleanVal: "正常流量 (Clean Traffic)",
                      };
                      return [`${formatVal(value)} ${trafficAnalysisUnit}`, labels[name] || name];
                    }}
                    labelFormatter={(label, payload) => {
                      const fullTime = payload?.[0]?.payload?.fullTime
                      return `時間: ${fullTime || label}`
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="attackVal"
                    stroke="#ef4444"
                    fill="url(#colorBlock)"
                    strokeWidth={2}
                    dot={false}
                    animationDuration={1500}
                    animationBegin={100}
                  />
                  <Area
                    type="monotone"
                    dataKey="cleanVal"
                    stroke="#3b82f6"
                    fill="url(#colorLog)"
                    strokeWidth={2}
                    dot={false}
                    animationDuration={1500}
                    animationBegin={100}
                  />
                  {/* 將參考線放在最後面，確保在最上層 */}
                  <ReferenceLine y={0} stroke="#475569" strokeWidth={1} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-sm text-slate-300">攻擊流量 (Attack Traffic)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-sm text-slate-300">正常流量 (Clean Traffic)</span>
              </div>
            </div>

          </motion.div>

          {/* Global Attack Sources with MapLibre */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0, duration: 0 }}
            className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
          >
            <h3 className="text-white mb-4 font-normal">全球攻擊來源</h3>

            <div ref={mapContainerRef} className="h-64 bg-slate-950/50 rounded-lg overflow-hidden mb-4" />

            {/* TOP 3 Sources */}
            <div>
              <div className="text-sm text-slate-400 mb-3">TOP 3 來源:</div>
              <div className="space-y-2">
                {attackSources.slice(0, 3).map((source: { country: string; percentage: number; color: string }, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }} />
                      <span className="text-sm text-slate-300">
                        {index + 1}. {source.country}
                      </span>
                    </div>
                    <span className="text-sm font-semibold" style={{ color: source.color }}>
                      ({source.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </>
    )
  }

  return (
    <div className="min-h-screen bg-[#08131D] p-8">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="mb-6 bg-slate-900/40 backdrop-blur-md border border-white/10 p-4 rounded-md"
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-slate-300">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">資料時間範圍：</span>
            </div>

            {/* 開始日期 */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">開始日期</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="bg-slate-800 border-slate-700 hover:bg-slate-700 text-white">
                    {actualTimeRange.from.toLocaleString("zh-TW", {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false
                    })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-slate-900 border-slate-700">
                  <DateTimePicker 
                    selected={new Date(timeRange.from)} 
                    onSelect={(date) => date && setTimeRange({ 
                      ...timeRange, 
                      from: date,
                      mode: 'absolute'
                    })} 
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* 結束日期 */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">結束日期</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="bg-slate-800 border-slate-700 hover:bg-slate-700 text-white">
                    {actualTimeRange.to.toLocaleString("zh-TW", {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false
                    })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-slate-900 border-slate-700">
                  <DateTimePicker 
                    selected={new Date(timeRange.to)} 
                    onSelect={(date) => date && setTimeRange({ 
                      ...timeRange, 
                      to: date,
                      mode: 'absolute'
                    })} 
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* 快速選擇按鈕 */}
          <TimeRangeControls/>
        </div>
      </motion.div>

      {/* Top Navigation Tabs */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex gap-2 mb-4 rounded-md"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2.5 text-sm font-medium transition-all duration-200 rounded-md ${
              activeTab === tab.id
                ? "bg-white text-black"
                : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </motion.div>

      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex items-center gap-2 mb-6"
      >
        <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-md flex items-center gap-3">
          <span className="text-sm text-slate-400 whitespace-nowrap font-medium">網域篩選：</span>
          <Select value={selectedZone} onValueChange={setSelectedZone}>
            <SelectTrigger className="w-[240px] bg-slate-800/50 border-slate-700 text-white h-9">
              <SelectValue placeholder="選擇網域" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700 text-white">
              <SelectItem value="all">所有網域</SelectItem>
              {userZones.map((zone) => (
                <SelectItem key={zone} value={zone}>{zone}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {renderContent()}
    </div>
  )
}
