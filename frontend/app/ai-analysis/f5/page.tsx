"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Shield, TrendingUp, AlertTriangle, CheckCircle, XCircle, Globe, Clock, Sparkles, CalendarIcon, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CustomDatePicker } from "@/components/custom-date-picker"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { saveActionRecord, type ActionRecord } from "@/lib/action-records"

interface WAFRisk {
  id: string
  title: string
  severity: "critical" | "high" | "medium" | "low"
  openIssues: number
  resolvedIssues: number
  affectedAssets: number
  tags: string[]
  description: string
  createdDate: string
  updatedDate: string
  exploitInWild: boolean
  internetExposed: boolean
  confirmedExploitable: boolean
  cveId?: string
  recommendations: Array<{
    title: string
    description: string
    priority: "high" | "medium" | "low"
  }>
}

interface ExecutionHistory {
  id: string
  timestamp: Date
  actionTitle: string
  actionType: string
  riskLevel: "high" | "medium" | "low"
  protectionMethod: string
  resolvedIssues: Array<{
    endpoint: string
    count: number
    description: string
  }>
  unresolvedIssues: Array<{
    endpoint: string
    count: number
    reason: string
    recommendation: string
  }>
  openIssuesBefore: number
  resolvedIssuesBefore: number
  openIssuesAfter: number
  resolvedIssuesAfter: number
  issuesResolved: number
  status: "success" | "failed"
  impactDescription: string
}

export default function F5AIAnalysisPage() {
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("high")
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined)
  
  // 新增：載入狀態
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false)
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h')
  const [analysisMetadata, setAnalysisMetadata] = useState({
    totalEvents: 0,
    timeRange: { start: '', end: '' },
    analysisTimestamp: ''
  })

  const { toast } = useToast()

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [selectedAction, setSelectedAction] = useState<{ title: string; description: string; issueId: string } | null>(
    null,
  )
  const [executing, setExecuting] = useState(false)
  const [executionHistory, setExecutionHistory] = useState<{
    high: ExecutionHistory[]
    medium: ExecutionHistory[]
    low: ExecutionHistory[]
  }>({
    high: [],
    medium: [],
    low: [],
  })
  const [executedActions, setExecutedActions] = useState<Set<string>>(new Set())
  const [historyExpanded, setHistoryExpanded] = useState<{
    high: boolean
    medium: boolean
    low: boolean
  }>({
    high: true,
    medium: true,
    low: true,
  })

  const [itemsExpanded, setItemsExpanded] = useState<{
    [key: string]: { resolved: boolean; unresolved: boolean }
  }>({})

  const toggleItemsExpanded = (historyId: string, type: "resolved" | "unresolved") => {
    setItemsExpanded((prev) => ({
      ...prev,
      [historyId]: {
        resolved: type === "resolved" ? !prev[historyId]?.resolved : prev[historyId]?.resolved || false,
        unresolved: type === "unresolved" ? !prev[historyId]?.unresolved : prev[historyId]?.unresolved || false,
      },
    }))
  }

  // 修改：初始為空陣列，從 API 載入真實數據
  const [wafRisks, setWafRisks] = useState<WAFRisk[]>([])
    {
      id: "xss-attack-massive",
      title: "跨站腳本 (XSS) 攻擊激增",
      severity: "high",
      openIssues: 15492,
      resolvedIssues: 3240,
      affectedAssets: 34,
      tags: ["Internet Exposed", "Confirmed Exploitable"],
      description:
        "發現大量 XSS 攻擊嘗試，佔所有攻擊的 12%。攻擊者通過注入惡意腳本試圖竊取用戶憑證和會話資訊。多個前端應用端點已被確認可利用，建議立即採取防護措施。",
      createdDate: "Aug 24, 2025",
      updatedDate: "Aug 26, 2025",
      exploitInWild: false,
      internetExposed: true,
      confirmedExploitable: true,
      cveId: "CVE-2025-8902",
      recommendations: [
        {
          title: "啟用 XSS 攻擊簽名",
          description: "配置 F5 WAF 的 XSS 攻擊簽名規則，自動識別和阻擋惡意腳本",
          priority: "high",
        },
        {
          title: "強化輸入驗證",
          description: "在應用層實施嚴格的輸入驗證和輸出編碼",
          priority: "high",
        },
      ],
    },
    {
      id: "sql-injection-attempts",
      title: "SQL 注入攻擊持續嘗試",
      severity: "high",
      openIssues: 1041,
      resolvedIssues: 234,
      affectedAssets: 12,
      tags: ["Exploit In Wild", "Database Target"],
      description:
        "檢測到針對資料庫查詢端點的 SQL 注入攻擊。雖然事件數量相對較少，但此類攻擊的危害性極高，可能導致資料庫資料洩露或被竄改。",
      createdDate: "Aug 25, 2025",
      updatedDate: "Aug 26, 2025",
      exploitInWild: true,
      internetExposed: true,
      confirmedExploitable: true,
      cveId: "CVE-2025-8903",
      recommendations: [
        {
          title: "啟用 SQL 注入防護",
          description: "啟用 F5 WAF 的 SQL 注入攻擊簽名，阻擋惡意 SQL 語句",
          priority: "high",
        },
        {
          title: "實施參數化查詢",
          description: "檢查並更新所有資料庫查詢，使用參數化查詢防止注入",
          priority: "high",
        },
      ],
    },
    {
      id: "session-hijacking-detection",
      title: "會話劫持攻擊檢測",
      severity: "medium",
      openIssues: 6745,
      resolvedIssues: 1890,
      affectedAssets: 23,
      tags: ["Internet Exposed"],
      description:
        "發現多起會話劫持攻擊嘗試，攻擊者試圖竊取或偽造用戶會話令牌。此類攻擊佔總攻擊量的 5%，可能導致未授權訪問和資料洩露。",
      createdDate: "Aug 24, 2025",
      updatedDate: "Aug 26, 2025",
      exploitInWild: false,
      internetExposed: true,
      confirmedExploitable: false,
      recommendations: [
        {
          title: "強化會話管理",
          description: "配置 F5 WAF 的會話保護功能，防止會話固定和劫持攻擊",
          priority: "medium",
        },
        {
          title: "啟用 HTTPS 和 Secure Cookie",
          description: "確保所有會話 Cookie 使用 Secure 和 HttpOnly 標誌",
          priority: "medium",
        },
      ],
    },
    {
      id: "forceful-browsing",
      title: "強制瀏覽攻擊",
      severity: "medium",
      openIssues: 8092,
      resolvedIssues: 2341,
      affectedAssets: 18,
      tags: ["Internet Exposed"],
      description:
        "檢測到攻擊者嘗試通過猜測 URL 訪問未授權資源。此類攻擊佔總量的 6%，可能導致敏感頁面和功能被未授權訪問。",
      createdDate: "Aug 23, 2025",
      updatedDate: "Aug 26, 2025",
      exploitInWild: false,
      internetExposed: true,
      confirmedExploitable: false,
      recommendations: [
        {
          title: "配置 URL 訪問控制",
          description: "設置 F5 WAF 的 URL 訪問控制規則，限制敏感資源訪問",
          priority: "medium",
        },
        {
          title: "實施強身份驗證",
          description: "對所有敏感端點實施強身份驗證和授權檢查",
          priority: "medium",
        },
      ],
    },
    {
      id: "abuse-of-functionality",
      title: "功能濫用攻擊",
      severity: "low",
      openIssues: 5392,
      resolvedIssues: 1823,
      affectedAssets: 15,
      tags: [],
      description:
        "發現攻擊者濫用應用程式正常功能進行惡意操作，如大量註冊、批量查詢等。此類攻擊佔總量的 4%，可能影響系統性能和資源消耗。",
      createdDate: "Aug 23, 2025",
      updatedDate: "Aug 25, 2025",
      exploitInWild: false,
      internetExposed: false,
      confirmedExploitable: false,
      recommendations: [
        {
          title: "實施速率限制",
          description: "配置 F5 WAF 的速率限制功能，防止功能濫用",
          priority: "low",
        },
        {
          title: "添加 CAPTCHA 驗證",
          description: "在敏感操作端點添加 CAPTCHA 驗證，防止自動化濫用",
          priority: "low",
        },
      ],
    },
  ])

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
  const totalResolvedIssues = wafRisks.reduce((sum, risk) => sum + risk.resolvedIssues, 0)
  const totalEvents = totalOpenIssues + totalResolvedIssues
  const totalAffectedAssets = wafRisks.reduce((sum, risk) => sum + risk.affectedAssets, 0)

  const handleExecuteAction = (actionTitle: string, actionDescription: string, issueId: string) => {
    setSelectedAction({ title: actionTitle, description: actionDescription, issueId })
    setConfirmDialogOpen(true)
  }

  const confirmExecution = async () => {
    if (!selectedAction) return

    setConfirmDialogOpen(false)
    setExecuting(true)

    const affectedRisk = wafRisks.find((r) => r.id === selectedAction.issueId)
    if (!affectedRisk) {
      setExecuting(false)
      return
    }

    const openIssuesBefore = totalOpenIssues
    const resolvedIssuesBefore = totalResolvedIssues

    toast({
      title: "正在執行操作",
      description: selectedAction.title,
    })

    await new Promise((resolve) => setTimeout(resolve, 1500))

    const issuesResolvedCount = Math.floor(affectedRisk.openIssues * 0.3)

    const updatedRisks = wafRisks.map((risk) => {
      if (risk.id === selectedAction.issueId) {
        return {
          ...risk,
          openIssues: Math.max(0, risk.openIssues - issuesResolvedCount),
          resolvedIssues: risk.resolvedIssues + issuesResolvedCount,
        }
      }
      return risk
    })

    setWafRisks(updatedRisks)

    const openIssuesAfter = openIssuesBefore - issuesResolvedCount
    const resolvedIssuesAfter = resolvedIssuesBefore + issuesResolvedCount

    const riskLevel: "high" | "medium" | "low" =
      affectedRisk.severity === "critical" || affectedRisk.severity === "high"
        ? "high"
        : affectedRisk.severity === "medium"
          ? "medium"
          : "low"

    const generateProtectionMethod = (actionTitle: string): string => {
      if (actionTitle.includes("WAF") || actionTitle.includes("防護") || actionTitle.includes("簽名"))
        return "WAF 防護策略"
      if (actionTitle.includes("速率") || actionTitle.includes("限制")) return "速率限制"
      if (actionTitle.includes("會話") || actionTitle.includes("Session")) return "會話保護"
      if (actionTitle.includes("訪問控制") || actionTitle.includes("URL")) return "URL 訪問控制"
      return "F5 安全規則"
    }

    const generateResolvedIssues = (count: number, issueType: string) => {
      const templates = [
        { endpoint: "/api/user/profile", ratio: 0.4 },
        { endpoint: "/api/data/search", ratio: 0.35 },
        { endpoint: "/api/admin/config", ratio: 0.25 },
      ]
      return templates.map((t) => ({
        endpoint: t.endpoint,
        count: Math.floor(count * t.ratio),
        description: `已成功防禦 ${issueType} 攻擊`,
      }))
    }

    const generateUnresolvedIssues = (count: number) => {
      const unresolvedCount = Math.floor(count * 0.2)
      const templates = [
        {
          endpoint: "/api/legacy/system",
          ratio: 0.55,
          reason: "需要應用層修復",
          recommendation: "更新應用程式代碼並實施輸入驗證",
        },
        {
          endpoint: "/api/external/webhook",
          ratio: 0.45,
          reason: "複雜攻擊模式",
          recommendation: "配置進階 F5 WAF 學習模式",
        },
      ]
      return templates.map((t) => ({
        endpoint: t.endpoint,
        count: Math.floor(unresolvedCount * t.ratio),
        reason: t.reason,
        recommendation: t.recommendation,
      }))
    }

    const historyEntry: ExecutionHistory = {
      id: `exec-${Date.now()}`,
      timestamp: new Date(),
      actionTitle: selectedAction.title,
      actionType: affectedRisk.title,
      riskLevel,
      protectionMethod: generateProtectionMethod(selectedAction.title),
      resolvedIssues: generateResolvedIssues(issuesResolvedCount, affectedRisk.title),
      unresolvedIssues: generateUnresolvedIssues(issuesResolvedCount),
      openIssuesBefore,
      resolvedIssuesBefore,
      openIssuesAfter,
      resolvedIssuesAfter,
      issuesResolved: issuesResolvedCount,
      status: "success",
      impactDescription: `成功解決 ${issuesResolvedCount} 個事件，已保護 ${Math.floor(affectedRisk.affectedAssets * 0.7)} 個端點`,
    }

    setExecutionHistory((prev) => ({
      ...prev,
      [riskLevel]: [historyEntry, ...prev[riskLevel]],
    }))

    const actionRecord: ActionRecord = {
      id: historyEntry.id,
      timestamp: historyEntry.timestamp,
      platform: "f5",
      pageSnapshot: {
        totalEvents: openIssuesBefore + resolvedIssuesBefore,
        openIssues: openIssuesBefore,
        resolvedIssues: resolvedIssuesBefore,
        affectedAssets: totalAffectedAssets,
        riskLevel: riskLevel,
      },
      action: {
        title: selectedAction.title,
        description: selectedAction.description,
        issueType: affectedRisk.title,
        protectionMethod: generateProtectionMethod(selectedAction.title),
      },
      results: {
        resolvedCount: issuesResolvedCount,
        unresolvedCount: Math.floor(issuesResolvedCount * 0.2),
        resolvedIssues: historyEntry.resolvedIssues,
        unresolvedIssues: historyEntry.unresolvedIssues,
      },
      beforeState: {
        openIssues: openIssuesBefore,
        resolvedIssues: resolvedIssuesBefore,
      },
      afterState: {
        openIssues: openIssuesAfter,
        resolvedIssues: resolvedIssuesAfter,
      },
      impact: historyEntry.impactDescription,
      status: "success",
    }

    saveActionRecord(actionRecord)


    setExecutedActions((prev) => new Set(prev).add(`${selectedAction.issueId}-${selectedAction.title}`))

    toast({
      title: "✅ 操作執行成功",
      description: `${selectedAction.title} - 已解決 ${issuesResolvedCount} 個事件`,
    })

    setExecuting(false)
    setSelectedAction(null)
  }

  const toggleHistoryExpanded = (level: "high" | "medium" | "low") => {
    setHistoryExpanded((prev) => ({
      ...prev,
      [level]: !prev[level],
    }))
  }

  const renderExecutionHistory = (level: "high" | "medium" | "low") => {
    const history = executionHistory[level]
    if (history.length === 0) return null

    const levelColors = {
      high: { bg: "bg-red-500/20", border: "border-red-500/30", text: "text-red-400" },
      medium: { bg: "bg-yellow-500/20", border: "border-yellow-500/30", text: "text-yellow-400" },
      low: { bg: "bg-blue-500/20", border: "border-blue-500/30", text: "text-blue-400" },
    }

    const colors = levelColors[level]
    const levelLabel = level === "high" ? "高風險" : level === "medium" ? "中風險" : "低風險"

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
        <Card className={`bg-slate-800/50 ${colors.border}`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Clock className={`w-5 h-5 ${colors.text}`} />
                {levelLabel} - 執行操作歷史記錄
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleHistoryExpanded(level)}
                className="text-slate-400 hover:text-white"
              >
                {historyExpanded[level] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </div>
          </CardHeader>
          <AnimatePresence>
            {historyExpanded[level] && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                  {history.map((historyItem) => {
                    const isResolvedExpanded = itemsExpanded[historyItem.id]?.resolved || false
                    const isUnresolvedExpanded = itemsExpanded[historyItem.id]?.unresolved || false
                    const totalResolved = historyItem.resolvedIssues.reduce((sum, item) => sum + item.count, 0)
                    const totalUnresolved = historyItem.unresolvedIssues.reduce((sum, item) => sum + item.count, 0)
                    const resolveRate = Math.round((totalResolved / (totalResolved + totalUnresolved)) * 100)

                    return (
                      <motion.div
                        key={historyItem.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-4 bg-slate-900/50 border border-white/10 rounded-lg"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              <span className="text-white font-medium text-sm">{historyItem.actionTitle}</span>
                              <Badge className="bg-green-500/20 text-green-400 border-green-500/50 text-xs">成功</Badge>
                            </div>
                            <div className="text-xs text-slate-400">
                              {format(historyItem.timestamp, "yyyy年M月d日 HH:mm:ss")}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50 text-xs">
                            {historyItem.protectionMethod}
                          </Badge>
                          <span className="text-xs text-slate-400">解決率: {resolveRate}%</span>
                        </div>

                        <div className="text-xs text-slate-300 mb-2">{historyItem.actionType}</div>

                        <div className="grid grid-cols-2 gap-3 p-3 bg-slate-800/50 rounded">
                          <div>
                            <div className="text-xs text-slate-400 mb-1">未解決事件</div>
                            <div className="flex items-center gap-2">
                              <span className="text-red-400 font-semibold">
                                {historyItem.openIssuesBefore.toLocaleString()}
                              </span>
                              <span className="text-slate-500">→</span>
                              <span className="text-green-400 font-semibold">
                                {historyItem.openIssuesAfter.toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-400 mb-1">已解決事件</div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 font-semibold">
                                {historyItem.resolvedIssuesBefore.toLocaleString()}
                              </span>
                              <span className="text-slate-500">→</span>
                              <span className="text-green-400 font-semibold">
                                {historyItem.resolvedIssuesAfter.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-2 text-xs text-green-400">✓ {historyItem.impactDescription}</div>

                        <div className="mt-4 space-y-2">
                          <div
                            className="flex items-center justify-between p-2 bg-green-900/20 border border-green-500/30 rounded cursor-pointer hover:bg-green-900/30 transition-colors"
                            onClick={() => toggleItemsExpanded(historyItem.id, "resolved")}
                          >
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              <span className="text-sm text-green-400 font-medium">
                                已解決事件 ({totalResolved} 個)
                              </span>
                            </div>
                            {isResolvedExpanded ? (
                              <ChevronUp className="w-4 h-4 text-green-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-green-400" />
                            )}
                          </div>

                          <AnimatePresence>
                            {isResolvedExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-2 pl-4"
                              >
                                {historyItem.resolvedIssues.map((issue, idx) => (
                                  <div
                                    key={idx}
                                    className="p-3 bg-slate-800/50 border border-green-500/20 rounded text-xs"
                                  >
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-cyan-400 font-mono">{issue.endpoint}</span>
                                      <Badge className="bg-green-500/20 text-green-400 border-green-500/50 text-xs">
                                        {issue.count} 個
                                      </Badge>
                                    </div>
                                    <div className="text-slate-400">{issue.description}</div>
                                  </div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>

                          <div
                            className="flex items-center justify-between p-2 bg-red-900/20 border border-red-500/30 rounded cursor-pointer hover:bg-red-900/30 transition-colors"
                            onClick={() => toggleItemsExpanded(historyItem.id, "unresolved")}
                          >
                            <div className="flex items-center gap-2">
                              <XCircle className="w-4 h-4 text-red-400" />
                              <span className="text-sm text-red-400 font-medium">
                                未解決事件 ({totalUnresolved} 個)
                              </span>
                            </div>
                            {isUnresolvedExpanded ? (
                              <ChevronUp className="w-4 h-4 text-red-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-red-400" />
                            )}
                          </div>

                          <AnimatePresence>
                            {isUnresolvedExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-2 pl-4"
                              >
                                {historyItem.unresolvedIssues.map((issue, idx) => (
                                  <div
                                    key={idx}
                                    className="p-3 bg-slate-800/50 border border-red-500/20 rounded text-xs space-y-2"
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-cyan-400 font-mono">{issue.endpoint}</span>
                                      <Badge className="bg-red-500/20 text-red-400 border-red-500/50 text-xs">
                                        {issue.count} 個
                                      </Badge>
                                    </div>
                                    <div className="text-slate-400">
                                      <span className="text-slate-500">原因：</span>
                                      {issue.reason}
                                    </div>
                                    <div className="flex items-start gap-2 p-2 bg-yellow-900/20 border border-yellow-500/30 rounded">
                                      <AlertTriangle className="w-3 h-3 text-yellow-400 mt-0.5 flex-shrink-0" />
                                      <div>
                                        <div className="text-yellow-400 font-medium mb-1">建議行動</div>
                                        <div className="text-slate-300">{issue.recommendation}</div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    )
                  })}
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="font-bold text-white text-2xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-white">AI Cyber Security Analysis - F5</h1>
        </div>
        <p className="text-slate-400 font-medium">基於 F5 WAF 安全數據的智能分析與建議</p>
      </motion.div>

      {/* Date Range Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="mb-6"
      >
        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-400 font-normal">選擇時間範圍：</div>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[200px] justify-start text-left font-normal bg-slate-900/40 border-white/10 text-white hover:bg-slate-800/60",
                  !dateFrom && "text-slate-400",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFrom ? format(dateFrom, "yyyy年M月d日") : "選擇起始日期"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-slate-900 border-white/10" align="start">
              <CustomDatePicker selected={dateFrom} onSelect={setDateFrom} />
            </PopoverContent>
          </Popover>

          <span className="text-slate-400 text-sm font-normal">至</span>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[200px] justify-start text-left font-normal bg-slate-900/40 border-white/10 text-white hover:bg-slate-800/60",
                  !dateTo && "text-slate-400",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateTo ? format(dateTo, "yyyy年M月d日") : "選擇結束日期"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-slate-900 border-white/10" align="start">
              <CustomDatePicker selected={dateTo} onSelect={setDateTo} />
            </PopoverContent>
          </Popover>

          {(dateFrom || dateTo) && (
            <>
              <Button
                variant="ghost"
                onClick={() => {
                  setDateFrom(undefined)
                  setDateTo(undefined)
                }}
                className="text-slate-400 hover:text-white font-normal"
              >
                清除
              </Button>

              <Button
                className="bg-cyan-600 hover:bg-cyan-700 text-white font-normal"
                onClick={() => {
                  console.log("[v0] Loading AI analysis for date range:", { dateFrom, dateTo })
                }}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                載入AI分析
              </Button>
            </>
          )}
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-slate-900/40 border-white/10 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-slate-400 mb-1 text-xs font-normal">總事件數</div>
                  <div className="text-white text-2xl font-semibold">{totalEvents.toLocaleString()}</div>
                </div>
              </div>
              <div className="mt-3 text-xs text-slate-400 font-medium">分析自 F5 WAF Dashboard</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/40 border-white/10 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-slate-400 mb-1 text-xs">未解決事件數</div>
                  <div className="text-white text-2xl font-semibold">{totalOpenIssues.toLocaleString()}</div>
                </div>
              </div>
              <div className="mt-3 text-xs text-red-400 font-normal">需要立即處理</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/40 border-white/10 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-slate-400 mb-1 text-xs font-normal">已解決事件數</div>
                  <div className="text-green-400 text-2xl font-semibold">{totalResolvedIssues.toLocaleString()}</div>
                </div>
              </div>
              <div className="mt-3 text-xs text-green-400 font-normal">已成功緩解</div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Executing Overlay */}
      <AnimatePresence>
        {executing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <div className="bg-slate-900 p-8 rounded-lg border border-cyan-500/30 flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
              <div className="text-white font-semibold">正在執行操作...</div>
              <div className="text-slate-400 text-sm">{selectedAction?.title}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent className="bg-slate-900 border-cyan-500/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              確認執行操作
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-300">
              <div className="space-y-3 mt-4">
                <div>
                  <div className="text-sm font-semibold text-white mb-1">操作名稱</div>
                  <div className="text-sm">{selectedAction?.title}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-white mb-1">操作說明</div>
                  <div className="text-sm">{selectedAction?.description}</div>
                </div>
                <div className="p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                  <div className="text-sm font-semibold text-yellow-400 mb-1">預期影響</div>
                  <div className="text-xs text-slate-300">
                    此操作預計將解決約{" "}
                    {Math.floor((wafRisks.find((r) => r.id === selectedAction?.issueId)?.openIssues || 0) * 0.3)}{" "}
                    個相關事件
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-800 text-white border-white/10 hover:bg-slate-700">
              取消
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmExecution} className="bg-cyan-600 hover:bg-cyan-700 text-white">
              確認執行
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Three Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Column 1: Risk Assessment */}
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
              {/* High Risk */}
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

              {/* Medium Risk */}
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

              {/* Low Risk */}
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

              {/* Risk Items List */}
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

        {/* Column 2: Trend Analysis */}
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
                            <h4 className="text-white font-semibold text-base">AI 深度分析</h4>
                          </div>
                          <p className="text-slate-300 leading-relaxed text-sm">
                            根據 F5 WAF 威脅情報分析，此類攻擊在過去 72 小時內呈現持續上升趨勢。
                            攻擊者主要針對公開暴露的端點，建議立即採取 F5 Advanced WAF 防護措施並啟用學習模式。
                            系統已自動標記 {assessment.affectedAssets} 個受影響資產，建議優先處理高風險端點。
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

              {selectedCategory === "high" && renderExecutionHistory("high")}
              {selectedCategory === "medium" && renderExecutionHistory("medium")}
              {selectedCategory === "low" && renderExecutionHistory("low")}
            </CardContent>
          </Card>
        </motion.div>

        {/* Column 3: Action Recommendations */}
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
                          const actionKey = `${assessment.id}-${rec.title}`
                          const isExecuted = executedActions.has(actionKey)

                          return (
                            <div
                              key={idx}
                              className={`p-4 rounded-lg border ${
                                isExecuted
                                  ? "bg-green-900/20 border-green-500/30"
                                  : "bg-slate-800/50 border-cyan-400/30"
                              }`}
                            >
                              <div className="flex items-start gap-3 mb-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    {isExecuted && <CheckCircle className="w-4 h-4 text-green-400" />}
                                    <h4 className="text-white font-medium text-sm">{rec.title}</h4>
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

                              <Button
                                onClick={() => handleExecuteAction(rec.title, rec.description, assessment.id)}
                                disabled={isExecuted}
                                className={`w-full ${
                                  isExecuted
                                    ? "bg-green-600/50 hover:bg-green-600/50 cursor-not-allowed"
                                    : "bg-cyan-600 hover:bg-cyan-700"
                                } text-white`}
                              >
                                {isExecuted ? (
                                  <>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    已執行
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    執行此操作
                                  </>
                                )}
                              </Button>
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
                            onClick={() => window.location.href = '/ai-analysis/history'}
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
    </div>
  )
}

