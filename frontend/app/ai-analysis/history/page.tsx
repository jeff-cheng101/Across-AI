"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AlertCircle, CheckCircle2, ChevronDown, ChevronUp, Download, Search, Trash2, XCircle } from 'lucide-react'
import { getActionRecords, getActionStatistics, deleteActionRecord, clearAllActionRecords, type ActionRecord } from "@/lib/action-records"

export default function HistoryPage() {
  const [records, setRecords] = useState<ActionRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<ActionRecord[]>([])
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [platformFilter, setPlatformFilter] = useState<"all" | "cloudflare" | "f5">("all")
  const [riskFilter, setRiskFilter] = useState<"all" | "high" | "medium" | "low">("all")
  const [statusFilter, setStatusFilter] = useState<"all" | "success" | "failed">("all")
  const [statistics, setStatistics] = useState<ReturnType<typeof getActionStatistics>>()

  // 載入記錄
  useEffect(() => {
    loadRecords()
  }, [])

  // 篩選記錄
  useEffect(() => {
    let filtered = records

    // 平台篩選
    if (platformFilter !== "all") {
      filtered = filtered.filter((r) => r.platform === platformFilter)
    }

    // 風險等級篩選
    if (riskFilter !== "all") {
      filtered = filtered.filter((r) => r.pageSnapshot.riskLevel === riskFilter)
    }

    // 狀態篩選
    if (statusFilter !== "all") {
      filtered = filtered.filter((r) => r.status === statusFilter)
    }

    // 搜尋
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (r) =>
          r.action.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.action.issueType.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.action.protectionMethod.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredRecords(filtered)
  }, [records, platformFilter, riskFilter, statusFilter, searchQuery])

  const loadRecords = () => {
    const allRecords = getActionRecords()
    setRecords(allRecords)
    setFilteredRecords(allRecords)
    setStatistics(getActionStatistics())
  }

  const handleDelete = (recordId: string) => {
    if (confirm("確定要刪除此記錄嗎？")) {
      deleteActionRecord(recordId)
      loadRecords()
    }
  }

  const handleClearAll = () => {
    if (confirm("確定要清除所有記錄嗎？此操作無法復原。")) {
      clearAllActionRecords()
      loadRecords()
    }
  }

  const handleExport = () => {
    const csv = convertToCSV(filteredRecords)
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `action-records-${format(new Date(), "yyyy-MM-dd")}.csv`
    link.click()
  }

  const convertToCSV = (data: ActionRecord[]) => {
    const headers = [
      "時間",
      "平台",
      "操作名稱",
      "風險等級",
      "問題類型",
      "保護方式",
      "已解決",
      "未解決",
      "解決率",
      "狀態",
      "影響描述",
    ]

    const rows = data.map((record) => {
      const resolveRate =
        record.results.resolvedCount + record.results.unresolvedCount > 0
          ? Math.round(
              (record.results.resolvedCount / (record.results.resolvedCount + record.results.unresolvedCount)) * 100
            )
          : 0

      return [
        format(record.timestamp, "yyyy-MM-dd HH:mm:ss"),
        record.platform === "cloudflare" ? "Cloudflare" : "F5",
        record.action.title,
        record.pageSnapshot.riskLevel === "high" ? "高風險" : record.pageSnapshot.riskLevel === "medium" ? "中風險" : "低風險",
        record.action.issueType,
        record.action.protectionMethod,
        record.results.resolvedCount,
        record.results.unresolvedCount,
        `${resolveRate}%`,
        record.status === "success" ? "成功" : "失敗",
        record.impact,
      ]
    })

    return [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")
  }

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "low":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  const getRiskLabel = (level: string) => {
    switch (level) {
      case "high":
        return "高風險"
      case "medium":
        return "中風險"
      case "low":
        return "低風險"
      default:
        return level
    }
  }

  return (
    <div className="min-h-screen bg-[#08131D] p-8">
      <div className="max-w-[1800px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">操作歷史記錄</h1>
            <p className="text-slate-400">查看所有執行操作的詳細記錄和統計資訊</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={filteredRecords.length === 0}
              className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
            >
              <Download className="w-4 h-4 mr-2" />
              匯出 CSV
            </Button>
            <Button
              variant="outline"
              onClick={handleClearAll}
              disabled={records.length === 0}
              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              清除所有記錄
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card className="bg-slate-900/40 border-white/10 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardDescription className="text-slate-400">總操作次數</CardDescription>
                <CardTitle className="text-2xl text-white">{statistics.totalActions}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="bg-slate-900/40 border-white/10 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardDescription className="text-slate-400">已解決事件</CardDescription>
                <CardTitle className="text-2xl text-green-400">{statistics.totalResolved.toLocaleString()}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="bg-slate-900/40 border-white/10 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardDescription className="text-slate-400">未解決事件</CardDescription>
                <CardTitle className="text-2xl text-yellow-400">{statistics.totalUnresolved.toLocaleString()}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="bg-slate-900/40 border-white/10 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardDescription className="text-slate-400">解決率</CardDescription>
                <CardTitle className="text-2xl text-cyan-400">
                  {statistics.totalResolved + statistics.totalUnresolved > 0
                    ? Math.round((statistics.totalResolved / (statistics.totalResolved + statistics.totalUnresolved)) * 100)
                    : 0}
                  %
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="bg-slate-900/40 border-white/10 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardDescription className="text-slate-400">成功率</CardDescription>
                <CardTitle className="text-2xl text-white">
                  {statistics.totalActions > 0
                    ? Math.round((statistics.successfulActions / statistics.totalActions) * 100)
                    : 0}
                  %
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="bg-slate-900/40 border-white/10 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="搜尋操作名稱、問題類型..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-800/50 border-white/10 text-white"
                />
              </div>

              {/* Platform Filter */}
              <Select value={platformFilter} onValueChange={(value: any) => setPlatformFilter(value)}>
                <SelectTrigger className="bg-slate-800/50 border-white/10 text-white">
                  <SelectValue placeholder="所有平台" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有平台</SelectItem>
                  <SelectItem value="cloudflare">Cloudflare</SelectItem>
                  <SelectItem value="f5">F5</SelectItem>
                </SelectContent>
              </Select>

              {/* Risk Filter */}
              <Select value={riskFilter} onValueChange={(value: any) => setRiskFilter(value)}>
                <SelectTrigger className="bg-slate-800/50 border-white/10 text-white">
                  <SelectValue placeholder="所有風險等級" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有風險等級</SelectItem>
                  <SelectItem value="high">高風險</SelectItem>
                  <SelectItem value="medium">中風險</SelectItem>
                  <SelectItem value="low">低風險</SelectItem>
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                <SelectTrigger className="bg-slate-800/50 border-white/10 text-white">
                  <SelectValue placeholder="所有狀態" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有狀態</SelectItem>
                  <SelectItem value="success">成功</SelectItem>
                  <SelectItem value="failed">失敗</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Records Table */}
        <Card className="bg-slate-900/40 border-white/10 backdrop-blur-sm">
          <CardContent className="p-0">
            {filteredRecords.length === 0 ? (
              <div className="p-12 text-center">
                <AlertCircle className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-400 text-lg">沒有找到操作記錄</p>
                <p className="text-slate-500 text-sm mt-2">執行操作後，記錄將顯示在這裡</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-slate-400">時間</TableHead>
                    <TableHead className="text-slate-400">平台</TableHead>
                    <TableHead className="text-slate-400">操作名稱</TableHead>
                    <TableHead className="text-slate-400">風險等級</TableHead>
                    <TableHead className="text-slate-400">保護方式</TableHead>
                    <TableHead className="text-slate-400 text-right">已解決</TableHead>
                    <TableHead className="text-slate-400 text-right">未解決</TableHead>
                    <TableHead className="text-slate-400 text-right">解決率</TableHead>
                    <TableHead className="text-slate-400">狀態</TableHead>
                    <TableHead className="text-slate-400 text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => {
                    const isExpanded = expandedRow === record.id
                    const resolveRate =
                      record.results.resolvedCount + record.results.unresolvedCount > 0
                        ? Math.round(
                            (record.results.resolvedCount /
                              (record.results.resolvedCount + record.results.unresolvedCount)) *
                              100
                          )
                        : 0

                    return (
                      <>
                        <TableRow key={record.id} className="border-white/10 hover:bg-white/5">
                          <TableCell className="text-slate-300 text-sm">
                            {format(record.timestamp, "yyyy-MM-dd HH:mm:ss")}
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                              {record.platform === "cloudflare" ? "Cloudflare" : "F5"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-white font-medium max-w-xs truncate">
                            {record.action.title}
                          </TableCell>
                          <TableCell>
                            <Badge className={getRiskBadgeColor(record.pageSnapshot.riskLevel)}>
                              {getRiskLabel(record.pageSnapshot.riskLevel)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-slate-300 text-sm">{record.action.protectionMethod}</TableCell>
                          <TableCell className="text-green-400 text-right font-medium">
                            {record.results.resolvedCount.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-yellow-400 text-right font-medium">
                            {record.results.unresolvedCount.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-green-500 to-cyan-500"
                                  style={{ width: `${resolveRate}%` }}
                                />
                              </div>
                              <span className="text-slate-300 text-sm w-12">{resolveRate}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {record.status === "success" ? (
                              <div className="flex items-center gap-2 text-green-400">
                                <CheckCircle2 className="w-4 h-4" />
                                <span className="text-sm">成功</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 text-red-400">
                                <XCircle className="w-4 h-4" />
                                <span className="text-sm">失敗</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setExpandedRow(isExpanded ? null : record.id)}
                                className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                              >
                                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(record.id)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>

                        {/* Expanded Details */}
                        {isExpanded && (
                          <TableRow className="border-white/10 bg-slate-800/30">
                            <TableCell colSpan={10} className="p-6">
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Left Column: Resolved Issues */}
                                <div>
                                  <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                                    已解決事件 ({record.results.resolvedCount.toLocaleString()})
                                  </h4>
                                  <div className="space-y-2">
                                    {record.results.resolvedIssues.map((issue, idx) => (
                                      <div
                                        key={idx}
                                        className="bg-slate-900/50 border border-green-500/20 rounded-lg p-3"
                                      >
                                        <div className="flex items-start justify-between mb-1">
                                          <span className="text-white text-sm font-medium">{issue.endpoint}</span>
                                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                                            {issue.count.toLocaleString()}
                                          </Badge>
                                        </div>
                                        <p className="text-slate-400 text-xs">{issue.description}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Right Column: Unresolved Issues */}
                                <div>
                                  <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                                    未解決事件 ({record.results.unresolvedCount.toLocaleString()})
                                  </h4>
                                  <div className="space-y-2">
                                    {record.results.unresolvedIssues.map((issue, idx) => (
                                      <div
                                        key={idx}
                                        className="bg-slate-900/50 border border-yellow-500/20 rounded-lg p-3"
                                      >
                                        <div className="flex items-start justify-between mb-1">
                                          <span className="text-white text-sm font-medium">{issue.endpoint}</span>
                                          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                                            {issue.count.toLocaleString()}
                                          </Badge>
                                        </div>
                                        <p className="text-slate-400 text-xs mb-2">原因：{issue.reason}</p>
                                        <p className="text-cyan-400 text-xs">建議：{issue.recommendation}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Impact Description */}
                              <div className="mt-4 pt-4 border-t border-white/10">
                                <p className="text-slate-400 text-sm">
                                  <span className="text-white font-medium">影響描述：</span>
                                  {record.impact}
                                </p>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}




