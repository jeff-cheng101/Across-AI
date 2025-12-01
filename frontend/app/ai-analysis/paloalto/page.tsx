"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Globe,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
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

interface PaloAltoRisk {
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

export default function PaloAltoAIAnalysisPage() {
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
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

  const [paloAltoRisks] = useState<PaloAltoRisk[]>([
    {
      id: "ransomware-detection",
      title: "勒索軟體威脅檢測",
      severity: "critical",
      openIssues: 2845,
      resolvedIssues: 432,
      affectedAssets: 67,
      tags: ["Exploit In Wild", "Internet Exposed", "High Priority"],
      description:
        "檢測到多個勒索軟體變種嘗試透過 SMB 漏洞入侵網路。威脅分析顯示攻擊者正在利用已知的安全漏洞進行橫向移動，並嘗試加密關鍵業務數據。建議立即啟用進階威脅防護並隔離受影響的端點。",
      createdDate: "Apr 8, 2025",
      updatedDate: "Apr 10, 2025",
      exploitInWild: true,
      internetExposed: true,
      confirmedExploitable: true,
      cveId: "CVE-2025-3456",
      recommendations: [
        {
          title: "啟用進階威脅防護規則",
          description: "立即啟用 Palo Alto 進階威脅防護，阻擋勒索軟體惡意流量",
          priority: "high",
        },
        {
          title: "隔離受感染端點",
          description: "將檢測到的受感染端點進行網路隔離，防止橫向移動",
          priority: "high",
        },
      ],
    },
    {
      id: "vulnerability-exploit",
      title: "SMB 漏洞利用攻擊",
      severity: "high",
      openIssues: 1678,
      resolvedIssues: 289,
      affectedAssets: 42,
      tags: ["Internet Exposed", "Confirmed Exploitable"],
      description:
        "發現攻擊者正在嘗試利用 SMB 協議漏洞進行未授權存取。這些攻擊主要針對未修補的 Windows 系統，可能導致遠端代碼執行和資料洩露。系統日誌顯示多次失敗的登入嘗試和異常的 SMB 流量模式。",
      createdDate: "Apr 7, 2025",
      updatedDate: "Apr 10, 2025",
      exploitInWild: false,
      internetExposed: true,
      confirmedExploitable: true,
      cveId: "CVE-2025-7890",
      recommendations: [
        {
          title: "封鎖 SMB 惡意流量",
          description: "配置防火牆規則阻擋可疑的 SMB 連線請求",
          priority: "high",
        },
        {
          title: "更新系統安全補丁",
          description: "立即為所有 Windows 系統部署最新的安全更新",
          priority: "high",
        },
      ],
    },
    {
      id: "policy-violation",
      title: "安全政策違規事件",
      severity: "medium",
      openIssues: 3124,
      resolvedIssues: 1567,
      affectedAssets: 89,
      tags: ["Policy Violation"],
      description:
        "檢測到大量違反安全政策的會話被丟棄。主要包括未經授權的應用程式存取、非標準端口通訊，以及違反數據外洩防護 (DLP) 政策的行為。需要審查並加強安全政策配置。",
      createdDate: "Apr 5, 2025",
      updatedDate: "Apr 10, 2025",
      exploitInWild: false,
      internetExposed: false,
      confirmedExploitable: false,
      recommendations: [
        {
          title: "強化安全政策規則",
          description: "審查並更新防火牆安全政策，限制未授權應用存取",
          priority: "medium",
        },
        {
          title: "啟用應用程式控制",
          description: "配置應用程式識別和控制功能，防止未授權軟體運行",
          priority: "medium",
        },
      ],
    },
    {
      id: "packet-drop-anomaly",
      title: "異常封包丟棄率",
      severity: "medium",
      openIssues: 2456,
      resolvedIssues: 892,
      affectedAssets: 34,
      tags: ["Performance Impact"],
      description:
        "網路層檢測到異常高的封包丟棄率，主要發生在 ARP 處理和流量控制處理階段。這可能表示潛在的 DDoS 攻擊或網路設備資源不足。需要進一步調查並優化網路配置。",
      createdDate: "Apr 6, 2025",
      updatedDate: "Apr 9, 2025",
      exploitInWild: false,
      internetExposed: false,
      confirmedExploitable: false,
      recommendations: [
        {
          title: "啟用 DDoS 防護機制",
          description: "配置進階 DDoS 防護規則，過濾異常流量",
          priority: "medium",
        },
        {
          title: "優化網路資源配置",
          description: "檢查並調整防火牆資源分配，提升處理能力",
          priority: "medium",
        },
      ],
    },
    {
      id: "session-utilization",
      title: "會話使用率監控警告",
      severity: "low",
      openIssues: 1234,
      resolvedIssues: 678,
      affectedAssets: 23,
      tags: ["Monitoring"],
      description:
        "系統檢測到 TCP/UDP 會話數量接近配置上限。雖然目前利用率仍在正常範圍內，但建議持續監控並考慮擴充容量以應對未來流量增長。",
      createdDate: "Apr 4, 2025",
      updatedDate: "Apr 8, 2025",
      exploitInWild: false,
      internetExposed: false,
      confirmedExploitable: false,
      recommendations: [
        {
          title: "監控會話使用趨勢",
          description: "設置告警機制，持續追蹤會話使用率變化",
          priority: "low",
        },
        {
          title: "評估容量擴充需求",
          description: "分析流量趨勢，規劃未來的容量擴充計畫",
          priority: "low",
        },
      ],
    },
    {
      id: "ssl-proxy-config",
      title: "SSL Proxy 配置檢查",
      severity: "low",
      openIssues: 876,
      resolvedIssues: 445,
      affectedAssets: 18,
      tags: ["Configuration"],
      description:
        "SSL Proxy 會話數量偏低，可能表示 SSL 檢查功能未完全啟用。建議檢查 SSL 檢查配置，確保加密流量也能得到適當的安全掃描。",
      createdDate: "Apr 3, 2025",
      updatedDate: "Apr 7, 2025",
      exploitInWild: false,
      internetExposed: false,
      confirmedExploitable: false,
      recommendations: [
        {
          title: "啟用 SSL 解密檢查",
          description: "配置 SSL Forward Proxy，檢查加密流量中的威脅",
          priority: "low",
        },
        {
          title: "部署 SSL 證書管理",
          description: "實施企業 SSL 證書，確保 SSL 檢查正常運作",
          priority: "low",
        },
      ],
    },
  ])

  const risksByCategory = {
    high: paloAltoRisks.filter((r) => r.severity === "critical" || r.severity === "high"),
    medium: paloAltoRisks.filter((r) => r.severity === "medium"),
    low: paloAltoRisks.filter((r) => r.severity === "low"),
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

  // Removed useEffect for auto-selection as per updates

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

  const totalOpenIssues = paloAltoRisks.reduce((sum, risk) => sum + risk.openIssues, 0)
  const totalResolvedIssues = paloAltoRisks.reduce((sum, risk) => sum + risk.resolvedIssues, 0)
  const totalEvents = totalOpenIssues + totalResolvedIssues
  const totalAffectedAssets = paloAltoRisks.reduce((sum, risk) => sum + risk.affectedAssets, 0)

  const toggleItemsExpanded = (historyId: string, type: "resolved" | "unresolved") => {
    setItemsExpanded((prev) => ({
      ...prev,
      [historyId]: {
        resolved: type === "resolved" ? !prev[historyId]?.resolved : prev[historyId]?.resolved || false,
        unresolved: type === "unresolved" ? !prev[historyId]?.unresolved : prev[historyId]?.unresolved || false,
      },
    }))
  }

  const handleExecuteAction = (actionTitle: string, actionDescription: string, issueId: string) => {
    setSelectedAction({ title: actionTitle, description: actionDescription, issueId })
    setConfirmDialogOpen(true)
  }

  const confirmExecution = async () => {
    if (!selectedAction) return

    setConfirmDialogOpen(false)
    setExecuting(true)

    const affectedRisk = paloAltoRisks.find((r) => r.id === selectedAction.issueId)
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

    const issuesResolvedCount = Math.floor(affectedRisk.openIssues * 0.35)

    const riskLevel: "high" | "medium" | "low" =
      affectedRisk.severity === "critical" || affectedRisk.severity === "high"
        ? "high"
        : affectedRisk.severity === "medium"
          ? "medium"
          : "low"

    const generateProtectionMethod = (actionTitle: string): string => {
      if (actionTitle.includes("威脅防護") || actionTitle.includes("防護規則")) return "進階威脅防護"
      if (actionTitle.includes("封鎖") || actionTitle.includes("隔離")) return "端點隔離與封鎖"
      if (actionTitle.includes("政策") || actionTitle.includes("規則")) return "安全政策強化"
      if (actionTitle.includes("DDoS") || actionTitle.includes("流量")) return "DDoS 防護機制"
      if (actionTitle.includes("SSL") || actionTitle.includes("證書")) return "SSL 解密檢查"
      return "NGFW 防護規則"
    }

    const generateResolvedIssues = (count: number, issueType: string) => {
      const templates = [
        { endpoint: "10.0.1.0/24", ratio: 0.4 },
        { endpoint: "10.0.2.0/24", ratio: 0.35 },
        { endpoint: "192.168.1.0/24", ratio: 0.25 },
      ]
      return templates.map((t) => ({
        endpoint: t.endpoint,
        count: Math.floor(count * t.ratio),
        description: `已成功攔截並解決 ${issueType} 威脅`,
      }))
    }

    const generateUnresolvedIssues = (count: number) => {
      const unresolvedCount = Math.floor(count * 0.15)
      const templates = [
        {
          endpoint: "172.16.0.0/16",
          ratio: 0.6,
          reason: "需要更新安全簽章",
          recommendation: "部署最新的威脅情報更新",
        },
        {
          endpoint: "10.0.5.0/24",
          ratio: 0.4,
          reason: "加密流量未完全檢查",
          recommendation: "啟用 SSL 解密功能",
        },
      ]
      return templates.map((t) => ({
        endpoint: t.endpoint,
        count: Math.floor(unresolvedCount * t.ratio),
        reason: t.reason,
        recommendation: t.recommendation,
      }))
    }

    const openIssuesAfter = openIssuesBefore - issuesResolvedCount
    const resolvedIssuesAfter = resolvedIssuesBefore + issuesResolvedCount

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
      impactDescription: `成功解決 ${issuesResolvedCount} 個事件，已保護 ${Math.floor(affectedRisk.affectedAssets * 0.75)} 個資產`,
    }

    setExecutionHistory((prev) => ({
      ...prev,
      [riskLevel]: [historyEntry, ...prev[riskLevel]],
    }))

    const actionRecord: ActionRecord = {
      id: historyEntry.id,
      timestamp: historyEntry.timestamp,
      platform: "paloalto",
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
        unresolvedCount: Math.floor(issuesResolvedCount * 0.15),
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
          <h1 className="text-3xl font-bold text-white">AI Cyber Security Analysis - Palo Alto Networks</h1>
        </div>
        <p className="text-slate-400 font-medium">基於 Palo Alto NGFW 安全數據的智能分析與建議</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-6 pr-6"
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
              <div className="mt-3 text-xs text-slate-400 font-medium">分析自 Palo Alto NGFW</div>
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
                    {Math.floor((paloAltoRisks.find((r) => r.id === selectedAction?.issueId)?.openIssues || 0) * 0.35)}{" "}
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pr-6 pb-6">
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

              {selectedCategory && risksByCategory[selectedCategory as keyof typeof risksByCategory].length > 0 && (
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
              {selectedCategory && selectedIssue && paloAltoRisks.length > 0 ? (
                <motion.div
                  key={selectedIssue}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {paloAltoRisks
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
                          <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 bg-purple-900/20 border border-purple-500/30 rounded-full">
                            <span className="text-xs text-purple-400 font-mono">{assessment.cveId}</span>
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
                            根據 Palo Alto NGFW 威脅情報分析，此類攻擊在過去 48 小時內呈現上升趨勢。
                            威脅行為者主要針對未修補的系統進行滲透測試，建議立即啟用進階威脅防護並更新安全簽章。
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

              {selectedCategory && renderExecutionHistory(selectedCategory)}
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
              {selectedCategory && selectedIssue && paloAltoRisks.length > 0 ? (
                <motion.div
                  key={`action-${selectedIssue}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {paloAltoRisks
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

                        <div className="mt-6 p-3 rounded-lg bg-red-900/20 border border-red-500/30">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-slate-400">風險等級</span>
                            <Badge className={getSeverityBadgeColor(assessment.severity)} variant="outline">
                              {getSeverityLabel(assessment.severity)}
                            </Badge>
                          </div>
                          <div className="text-xs text-slate-300">
                            {assessment.exploitInWild && "⚠️ 此威脅已被確認在野外利用，"}
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
                  <p className="text-center text-base">請先選擇一個風險項目以查看執行建議</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
