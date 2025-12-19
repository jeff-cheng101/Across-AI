"use client"

import { CardContent } from "@/components/ui/card"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CustomDatePicker } from "@/components/custom-date-picker"
import { format } from "date-fns"
import {
  Search,
  Download,
  Trash2,
  ChevronRight,
  ChevronDown,
  ChevronsLeft,
  ChevronLeft,
  ChevronsRight,
  CalendarIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getActionRecords, getActionStatistics, deleteAllRecords, type ActionRecord } from "@/lib/action-records"

export default function HistoryPage() {
  const [records, setRecords] = useState<ActionRecord[]>([])
  const [startDate, setStartDate] = useState<Date | undefined>()
  const [endDate, setEndDate] = useState<Date | undefined>()
  const [platformFilter, setPlatformFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [statistics, setStatistics] = useState<any>()
  const [filteredRecords, setFilteredRecords] = useState<ActionRecord[]>([])
  const [sortBy, setSortBy] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  useEffect(() => {
    loadRecords()
  }, [])

  useEffect(() => {
    const stats = getActionStatistics()
    setStatistics(stats)
  }, [records])

  useEffect(() => {
    setFilteredRecords(filterRecords(records))
  }, [records, platformFilter, statusFilter, startDate, endDate, searchTerm])

  useEffect(() => {
    setCurrentPage(1)
  }, [platformFilter, statusFilter, startDate, endDate, searchTerm])

  const loadRecords = () => {
    const allRecords = getActionRecords()
    setRecords(allRecords)
    setFilteredRecords(allRecords)
  }

  const handleDelete = (recordId: string) => {
    if (confirm("確定要刪除此記錄嗎？")) {
      deleteAllRecords(recordId)
      loadRecords()
    }
  }

  const handleClearAll = () => {
    if (confirm("確定要清除所有記錄嗎？此操作無法復原。")) {
      deleteAllRecords()
      loadRecords()
    }
  }

  const handleExport = () => {
    const csv = exportToCSV()
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `action-records-${format(new Date(), "yyyy-MM-dd")}.csv`
    link.click()
  }

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column as "timestamp")
      setSortOrder("asc")
    }
  }

  const exportToCSV = () => {
    const headers = ["時間", "平台", "分析紀錄", "已解決", "未解決", "解決率", "狀態"]

    const rows = records.map((record) => {
      const resolvedCount = record.results?.resolvedCount || 0
      const unresolvedCount = record.results?.unresolvedCount || 0
      const resolveRate =
        resolvedCount + unresolvedCount > 0 ? Math.round((resolvedCount / (resolvedCount + unresolvedCount)) * 100) : 0

      const platform = record.platform || "unknown"
      const platformLabel =
        platform === "cloudflare"
          ? "Cloudflare"
          : platform === "checkpoint"
            ? "Checkpoint"
            : platform === "f5"
              ? "F5"
              : platform

      return [
        format(record.timestamp, "yyyy-MM-dd HH:mm:ss"),
        platformLabel,
        record.action.title,
        resolvedCount,
        unresolvedCount,
        `${resolveRate}%`,
        record.status === "success" ? "成功" : "失敗",
      ]
    })

    return [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")
  }

  const filterRecords = (records: ActionRecord[]) => {
    let filtered = records

    if (platformFilter !== "all") {
      filtered = filtered.filter((r) => r.platform === platformFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((r) => r.status === statusFilter)
    }

    if (startDate) {
      const start = new Date(startDate)
      start.setHours(0, 0, 0, 0)
      filtered = filtered.filter((r) => {
        const recordDate = new Date(r.timestamp)
        recordDate.setHours(0, 0, 0, 0)
        return recordDate >= start
      })
    }

    if (endDate) {
      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999)
      filtered = filtered.filter((r) => {
        const recordDate = new Date(r.timestamp)
        recordDate.setHours(23, 59, 59, 999)
        return recordDate <= end
      })
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (r) =>
          r.action.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.action.issueType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.action.protectionMethod.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    return filtered
  }

  const sortedRecords = filteredRecords.sort((a, b) => {
    if (sortBy === "timestamp") {
      const comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      return sortOrder === "asc" ? comparison : -comparison
    }
    return 0
  })

  const totalPages = Math.ceil(sortedRecords.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedRecords = sortedRecords.slice(startIndex, endIndex)

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
  }

  const handleFirstPage = () => {
    setCurrentPage(1)
  }

  const handleLastPage = () => {
    setCurrentPage(totalPages)
  }

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1)
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
              disabled={records.length === 0}
              className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 bg-transparent"
            >
              <Download className="w-4 h-4 mr-2" />
              匯出 CSV
            </Button>
            <Button
              variant="outline"
              onClick={handleClearAll}
              disabled={records.length === 0}
              className="border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              清除所有記錄
            </Button>
          </div>
        </div>

        {/* Statistics Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="border-white/10">
            <CardContent className="p-6">
              <p className="text-slate-400 text-sm mb-2">總操作次數</p>
              <p className="text-3xl font-bold text-white">{statistics?.totalOperations || 0}</p>
            </CardContent>
          </Card>
          <Card className="border-white/10">
            <CardContent className="p-6">
              <p className="text-slate-400 text-sm mb-2">已解決事件</p>
              <p className="text-3xl font-bold text-green-400">{statistics?.totalResolved?.toLocaleString() || 0}</p>
            </CardContent>
          </Card>
          <Card className="border-white/10">
            <CardContent className="p-6">
              <p className="text-slate-400 text-sm mb-2">未解決事件</p>
              <p className="text-3xl font-bold text-yellow-400">{statistics?.totalUnresolved?.toLocaleString() || 0}</p>
            </CardContent>
          </Card>
          <Card className="border-white/10">
            <CardContent className="p-6">
              <p className="text-slate-400 text-sm mb-2">解決率</p>
              <p className="text-3xl font-bold text-cyan-400">
                {statistics?.totalResolved && statistics?.totalUnresolved
                  ? Math.round(
                      (statistics.totalResolved / (statistics.totalResolved + statistics.totalUnresolved)) * 100,
                    )
                  : 0}
                %
              </p>
            </CardContent>
          </Card>
          <Card className="border-white/10">
            <CardContent className="p-6">
              <p className="text-slate-400 text-sm mb-2">成功率</p>
              <p className="text-3xl font-bold text-blue-400">
                {records.length > 0
                  ? Math.round((records.filter((r) => r.status === "completed").length / records.length) * 100)
                  : 0}
                %
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter Section */}
        <Card className="border-white/10">
          <CardContent className="p-6 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="text"
                placeholder="搜尋操作名稱、問題類型..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-slate-600 focus:ring-1 focus:ring-slate-600"
              />
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Start Date */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-slate-800/50 border-slate-700 text-white hover:bg-slate-800/60",
                      !startDate && "text-slate-400",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "yyyy年M月d日") : "選擇開始日期"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-slate-900 border-white/10" align="start">
                  <CustomDatePicker selected={startDate} onSelect={setStartDate} />
                </PopoverContent>
              </Popover>

              {/* End Date */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-slate-800/50 border-slate-700 text-white hover:bg-slate-800/60",
                      !endDate && "text-slate-400",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "yyyy年M月d日") : "選擇結束日期"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-slate-900 border-white/10" align="start">
                  <CustomDatePicker selected={endDate} onSelect={setEndDate} />
                </PopoverContent>
              </Popover>

              {/* Platform Filter */}
              <Select value={platformFilter} onValueChange={setPlatformFilter}>
                <SelectTrigger className="bg-slate-800/50 border-white/10 text-white focus:border-slate-600 focus:ring-1 focus:ring-slate-600">
                  <SelectValue placeholder="所有平台" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-white/10">
                  <SelectItem value="all" className="text-white hover:bg-slate-700">
                    所有平台
                  </SelectItem>
                  <SelectItem value="cloudflare" className="text-white hover:bg-slate-700">
                    Cloudflare
                  </SelectItem>
                  <SelectItem value="checkpoint" className="text-white hover:bg-slate-700">
                    Checkpoint
                  </SelectItem>
                  <SelectItem value="f5" className="text-white hover:bg-slate-700">
                    F5
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-slate-800/50 border-white/10 text-white focus:border-slate-600 focus:ring-1 focus:ring-slate-600">
                  <SelectValue placeholder="所有狀態" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-white/10">
                  <SelectItem value="all" className="text-white hover:bg-slate-700">
                    所有狀態
                  </SelectItem>
                  <SelectItem value="completed" className="text-white hover:bg-slate-700">
                    已完成
                  </SelectItem>
                  <SelectItem value="pending" className="text-white hover:bg-slate-700">
                    進行中
                  </SelectItem>
                  <SelectItem value="failed" className="text-white hover:bg-slate-700">
                    失敗
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Records Table */}
        <Card className="bg-slate-900/40 border-0 backdrop-blur-sm">
          <CardContent className="p-0">
            {records.length === 0 ? (
              <div className="p-12 text-center">
                <Trash2 className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-400 text-lg">沒有找到操作記錄</p>
                <p className="text-slate-500 text-sm mt-2">執行操作後，記錄將顯示在這裡</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-slate-400 font-medium">
                      <button
                        onClick={() => handleSort("timestamp")}
                        className="flex items-center gap-2 hover:text-slate-200"
                      >
                        時間
                        {sortBy === "timestamp" &&
                          (sortOrder === "asc" ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4 rotate-180" />
                          ))}
                      </button>
                    </TableHead>
                    <TableHead className="text-slate-400">平台</TableHead>
                    <TableHead className="text-slate-400">詳細</TableHead>
                    <TableHead className="text-slate-400 text-right">已解決</TableHead>
                    <TableHead className="text-slate-400 text-right">未解決</TableHead>
                    <TableHead className="text-slate-400 text-right">解決率</TableHead>
                    <TableHead className="text-slate-400">狀態</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedRecords.map((record) => {
                    const isExpanded = expandedRow === record.id
                    const resolvedCount = record.results?.resolvedCount || 0
                    const unresolvedCount = record.results?.unresolvedCount || 0
                    const resolutionRate =
                      resolvedCount + unresolvedCount > 0
                        ? Math.round((resolvedCount / (resolvedCount + unresolvedCount)) * 100)
                        : 0

                    const platform = record.platform
                    const platformName =
                      platform === "cloudflare"
                        ? "Cloudflare"
                        : platform === "checkpoint"
                          ? "Checkpoint"
                          : platform === "f5"
                            ? "F5"
                            : "未知"

                    return (
                      <>
                        <TableRow key={record.id} className="border-white/10 hover:bg-white/5">
                          <TableCell className="text-slate-300 text-sm">
                            {format(record.timestamp, "yyyy-MM-dd HH:mm:ss")}
                          </TableCell>
                          <TableCell>
                            <span className="bg-[#45A4C0]/10 text-[#45A4C0] border-[#45A4C0]/30 px-2 py-1 rounded">
                              {platformName}
                            </span>
                          </TableCell>
                          <TableCell>
                            <button
                              onClick={() => setExpandedRow(isExpanded ? null : record.id)}
                              className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/10 rounded transition-colors text-slate-300 text-sm"
                              aria-label={isExpanded ? "收起詳細資訊" : "展開詳細資訊"}
                            >
                              {isExpanded ? (
                                <>
                                  <ChevronDown className="w-4 h-4" />
                                  <span>收起</span>
                                </>
                              ) : (
                                <>
                                  <ChevronRight className="w-4 h-4" />
                                  <span>展開</span>
                                </>
                              )}
                            </button>
                          </TableCell>
                          <TableCell className="text-right text-emerald-400">{resolvedCount}</TableCell>
                          <TableCell className="text-right text-red-400">{unresolvedCount}</TableCell>
                          <TableCell className="text-right">
                            <span
                              className={
                                resolutionRate >= 80
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 px-2 py-1 rounded"
                                  : resolutionRate >= 50
                                    ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30 px-2 py-1 rounded"
                                    : "bg-red-500/10 text-red-400 border-red-500/30 px-2 py-1 rounded"
                              }
                            >
                              {resolutionRate}%
                            </span>
                          </TableCell>
                          <TableCell>
                            <span
                              className={
                                record.status === "completed"
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 px-2 py-1 rounded"
                                  : record.status === "in_progress"
                                    ? "bg-blue-500/10 text-blue-400 border-blue-500/30 px-2 py-1 rounded"
                                    : "bg-slate-500/10 text-slate-400 border-slate-500/30 px-2 py-1 rounded"
                              }
                            >
                              {record.status === "completed"
                                ? "已完成"
                                : record.status === "in_progress"
                                  ? "進行中"
                                  : "待處理"}
                            </span>
                          </TableCell>
                        </TableRow>

                        {/* Expanded Details */}
                        {isExpanded && (
                          <TableRow className="border-white/10 bg-slate-800/30">
                            <TableCell colSpan={7} className="p-6">
                              {/* Analysis Screenshot Thumbnail */}
                              <div className="flex flex-col items-center gap-4">
                                <div className="text-slate-400 text-sm mb-2">
                                  分析時間：{new Date(record.timestamp).toLocaleString("zh-TW")}
                                </div>

                                {/* Analysis Screenshot Thumbnail */}
                                <div
                                  className="relative cursor-pointer group border-2 border-white/10 rounded-lg overflow-hidden hover:border-cyan-400/50 transition-all duration-300"
                                  onClick={() =>
                                    setSelectedImage(record.results?.pageSnapshot?.screenshotUrl || "/images/cach1.png")
                                  }
                                >
                                  <img
                                    src={record.results?.pageSnapshot?.screenshotUrl || "/images/cach1.png"}
                                    alt="分析結果截圖"
                                    className="w-full max-w-4xl h-auto object-contain"
                                  />
                                  {/* Overlay hint */}
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                                    <span className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2">
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                                        />
                                      </svg>
                                      點擊查看大圖
                                    </span>
                                  </div>
                                </div>

                                {/* AI Recommendations Results */}
                                <div className="w-full max-w-4xl mt-6 space-y-4">
                                  {/* Platform Badge */}
                                  <div className="flex items-center gap-2 mb-4">
                                    <span className="bg-[#45A4C0]/10 text-[#45A4C0] border-[#45A4C0]/30 px-2 py-1 rounded">
                                      {platformName}
                                    </span>
                                    <span className="text-slate-400 text-sm">執行 AI 建議後的結果</span>
                                  </div>

                                  {/* Resolved Issues */}
                                  {record.results?.resolvedIssues && record.results.resolvedIssues.length > 0 && (
                                    <div className="bg-slate-900/50 border border-green-500/30 rounded-lg p-4">
                                      <h4 className="text-green-400 font-semibold mb-3 flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                          />
                                        </svg>
                                        已解決問題 ({record.results.resolvedIssues.length})
                                      </h4>
                                      <div className="space-y-2">
                                        {record.results.resolvedIssues.map((issue, idx) => (
                                          <div key={idx} className="bg-slate-800/50 rounded p-3 border border-white/5">
                                            <div className="flex items-start justify-between gap-2">
                                              <div className="flex-1">
                                                <div className="text-slate-200 font-medium">{issue.endpoint}</div>
                                                <div className="text-slate-400 text-sm mt-1">{issue.description}</div>
                                              </div>
                                              <span className="bg-green-500/10 text-green-400 border-green-500/30 px-2 py-1 rounded">
                                                {issue.count} 筆
                                              </span>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Unresolved Issues */}
                                  {record.results?.unresolvedIssues && record.results.unresolvedIssues.length > 0 && (
                                    <div className="bg-slate-900/50 border border-yellow-500/30 rounded-lg p-4">
                                      <h4 className="text-yellow-400 font-semibold mb-3 flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                          />
                                        </svg>
                                        未解決問題 ({record.results.unresolvedIssues.length})
                                      </h4>
                                      <div className="space-y-2">
                                        {record.results.unresolvedIssues.map((issue, idx) => (
                                          <div key={idx} className="bg-slate-800/50 rounded p-3 border border-white/5">
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                              <div className="flex-1">
                                                <div className="text-slate-200 font-medium">{issue.endpoint}</div>
                                                <div className="text-slate-400 text-sm mt-1">原因：{issue.reason}</div>
                                              </div>
                                              <span className="bg-yellow-500/10 text-yellow-400 border-yellow-500/30 px-2 py-1 rounded">
                                                {issue.count} 筆
                                              </span>
                                            </div>
                                            <div className="mt-2 p-2 bg-slate-700/30 rounded border-l-2 border-cyan-400">
                                              <div className="text-xs text-slate-400 mb-1">建議方案：</div>
                                              <div className="text-sm text-slate-300">{issue.recommendation}</div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* No results found */}
                                  {(!record.results?.resolvedIssues || record.results.resolvedIssues.length === 0) &&
                                    (!record.results?.unresolvedIssues ||
                                      record.results.unresolvedIssues.length === 0) && (
                                      <div className="text-center text-slate-400 py-8">
                                        <svg
                                          className="w-12 h-12 mx-auto mb-3 opacity-50"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                          />
                                        </svg>
                                        暫無 AI 建議執行結果
                                      </div>
                                    )}
                                </div>
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

        {records.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span>每頁顯示</span>
              <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                <SelectTrigger className="w-20 bg-slate-800/50 border-white/10 text-white focus:border-slate-600 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="15">15</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                </SelectContent>
              </Select>
              <span>筆資料</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-400">
                第 {currentPage} / {totalPages} 頁
              </span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleFirstPage}
                  disabled={currentPage === 1}
                  className="text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLastPage}
                  disabled={currentPage === totalPages}
                  className="text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronsRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Image Modal Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-2">
          <DialogHeader>
            <DialogTitle className="text-white">分析結果詳情</DialogTitle>
          </DialogHeader>
          <div className="relative w-full h-full overflow-auto">
            <img src={selectedImage || ""} alt="分析結果大圖" className="w-full h-auto object-contain" />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
