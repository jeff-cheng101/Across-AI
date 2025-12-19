"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import {
  Plus,
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import authenticator from '@/app/util/authenticator'
import { getTicketsByUser } from "@/app/routes/ticket"
import { checkAuth } from '@/app/util/authenticator'

interface Ticket {
  id: string
  ticket_no: string
  subject: string
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  status: "處理中" | "待回覆" | "已完成" | "已關閉"
  contact_name: string
  incident_date: Date
  last_action_date: Date
}

type SortField = "subject" | "severity" | "status" | "contact_name" | "incident_date" | "last_action_date" | null
type SortOrder = "asc" | "desc" | null

export default function TicketsPage() {
  const [auth, setAuth] = useState<any>({ loginState: false })
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [statusFilter, setStatusFilter] = useState<string>("全部狀態")
  const [severityFilter, setSeverityFilter] = useState<string>("全部層級")
  const [startDate, setStartDate] = useState<Date | undefined>()
  const [endDate, setEndDate] = useState<Date | undefined>()
  const [sortField, setSortField] = useState<SortField>(null)
  const [sortOrder, setSortOrder] = useState<SortOrder>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const router = useRouter()

  useEffect(() => {
    let isMounted = true
    checkAuth()
    const subscription = authenticator.authObservable.subscribe((nextAuth: any) => {
      if (!isMounted) return
      try {
        const authValue = typeof nextAuth === 'string' ? JSON.parse(nextAuth) : nextAuth
        setAuth(authValue || { loginState: false })
        console.log('Auth updated:', authValue)
      } catch (error) {
        console.error('Auth parse error:', error)
        setAuth({ loginState: false })
      }
    })
    
    return () => { 
      isMounted = false
      subscription.unsubscribe() 
    }
  }, [])

  useEffect(() => {
    if (auth?.user?.email) {
      loadSettings()
    }
  }, [auth])

  const loadSettings = async () => {
    try {
      if (auth?.user?.email) {
        const ticketResp = await getTicketsByUser(auth?.user?.email || '')
        const tickets = ticketResp.data || [];
        for (let ticket of tickets) {
          ticket.status = ticket.status === 'PENDING' ? '待回覆' : ticket.status === 'IN_PROGRESS' ? '處理中' : ticket.status === 'RESOLVED' ? '已完成' : ticket.status === 'CLOSED' ? '已關閉' : '處理中';
          if (ticket.incident_date && typeof ticket.incident_date === 'string') {
            ticket.incident_date = new Date(ticket.incident_date);
          }
          if (ticket.last_action_date && typeof ticket.last_action_date === 'string') {
            ticket.last_action_date = new Date(ticket.last_action_date);
          }
        }
        setTickets(tickets)
        console.log(tickets)
      }
    } catch (error) {
      console.error('Error loading tickets:', error)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "bg-red-500/20 text-red-400"
      case "HIGH":
        return "bg-orange-500/20 text-orange-400"
      case "MEDIUM":
        return "bg-yellow-500/20 text-yellow-400"
      case "LOW":
        return "bg-gray-500/20 text-gray-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "處理中":
        return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
      case "待回覆":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
      case "已完成":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case "LOW":
        return "Low - 低"
      case "MEDIUM":
        return "Medium - 中"
      case "HIGH":
        return "High - 高"
      case "CRITICAL":
        return "Critical - 極緊急"
      default:
        return severity
    }
  }

  const filteredTickets = tickets.filter((ticket) => {
    if (statusFilter !== "全部狀態" && ticket.status !== statusFilter) return false
    if (severityFilter !== "全部層級" && ticket.severity !== severityFilter) return false

    if (startDate) {
      const ticketDate = new Date(ticket.incident_date)
      ticketDate.setHours(0, 0, 0, 0)
      const filterStart = new Date(startDate)
      filterStart.setHours(0, 0, 0, 0)
      if (ticketDate < filterStart) return false
    }

    if (endDate) {
      const ticketDate = new Date(ticket.incident_date)
      ticketDate.setHours(0, 0, 0, 0)
      const filterEnd = new Date(endDate)
      filterEnd.setHours(23, 59, 59, 999)
      if (ticketDate > filterEnd) return false
    }

    return true
  })

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortOrder === "asc") {
        setSortOrder("desc")
      } else if (sortOrder === "desc") {
        setSortField(null)
        setSortOrder(null)
      }
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 text-slate-500" />
    }
    if (sortOrder === "asc") {
      return <ArrowUp className="w-4 h-4 text-cyan-400" />
    }
    return <ArrowDown className="w-4 h-4 text-cyan-400" />
  }

  const sortedTickets = [...filteredTickets].sort((a, b) => {
    if (!sortField || !sortOrder) return 0

    let comparison = 0

    switch (sortField) {
      case "subject":
        comparison = a.subject.localeCompare(b.subject, "zh-TW")
        break
      case "severity":
        const severityOrder = { LOW: 1, MEDIUM: 2, HIGH: 3, CRITICAL: 4 }
        comparison = severityOrder[a.severity] - severityOrder[b.severity]
        break
      case "status":
        comparison = a.status.localeCompare(b.status, "zh-TW")
        break
      case "contact_name":
        comparison = a.contact_name.localeCompare(b.contact_name, "zh-TW")
        break
      case "incident_date":
        const aIncidentDate = a.incident_date instanceof Date ? a.incident_date : new Date(a.incident_date)
        const bIncidentDate = b.incident_date instanceof Date ? b.incident_date : new Date(b.incident_date)
        comparison = aIncidentDate.getTime() - bIncidentDate.getTime()
        break
      case "last_action_date":
        const aLastActionDate = a.last_action_date instanceof Date ? a.last_action_date : new Date(a.last_action_date)
        const bLastActionDate = b.last_action_date instanceof Date ? b.last_action_date : new Date(b.last_action_date)
        comparison = aLastActionDate.getTime() - bLastActionDate.getTime()
        break
    }

    return sortOrder === "asc" ? comparison : -comparison
  })

  const totalPages = Math.ceil(sortedTickets.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedTickets = sortedTickets.slice(startIndex, endIndex)

  useEffect(() => {
    setCurrentPage(1)
  }, [statusFilter, severityFilter, startDate, endDate, sortField, sortOrder])

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white mb-2 text-2xl font-semibold">案件紀錄</h1>
            <p className="text-slate-400 text-base">檢視並管理所有資安案件</p>
          </div>
          <Link href="/ai-analysis/create-ticket">
            <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              建立工單
            </Button>
          </Link>
        </div>

        <Card className="bg-slate-900/40 border-white/10 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-800/50">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="flex-1 bg-slate-800/50 border-white/10 text-white focus:border-slate-600 hover:border-slate-600">
                    <SelectValue placeholder="全部狀態" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="全部狀態">全部狀態</SelectItem>
                    <SelectItem value="處理中">處理中</SelectItem>
                    <SelectItem value="待回覆">待回覆</SelectItem>
                    <SelectItem value="已完成">已完成</SelectItem>
                    <SelectItem value="已關閉">已關閉</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-800/50">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger className="flex-1 bg-slate-800/50 border-white/10 text-white focus:border-slate-600 hover:border-slate-600">
                    <SelectValue placeholder="全部層級" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="全部層級">全部層級</SelectItem>
                    <SelectItem value="LOW">Low - 低</SelectItem>
                    <SelectItem value="MEDIUM">Medium - 中</SelectItem>
                    <SelectItem value="HIGH">High - 高</SelectItem>
                    <SelectItem value="CRITICAL">Critical - 極緊急</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 bg-slate-800/50 border-white/10 text-slate-400 hover:text-white hover:bg-slate-800 justify-start"
                  >
                    <CalendarIcon className="w-5 h-5" />
                    <span className="text-sm">{startDate ? format(startDate, "yyyy/MM/dd") : "開始日期"}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-slate-800 border-white/10" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    className="bg-slate-800 text-white"
                  />
                  {startDate && (
                    <div className="p-3 border-t border-white/10">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setStartDate(undefined)}
                        className="w-full text-slate-400 hover:text-white hover:bg-slate-700"
                      >
                        清除日期
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 bg-slate-800/50 border-white/10 text-slate-400 hover:text-white hover:bg-slate-800 justify-start"
                  >
                    <CalendarIcon className="w-5 h-5" />
                    <span className="text-sm">{endDate ? format(endDate, "yyyy/MM/dd") : "結束日期"}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-slate-800 border-white/10" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    className="bg-slate-800 text-white"
                  />
                  {endDate && (
                    <div className="p-3 border-t border-white/10">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEndDate(undefined)}
                        className="w-full text-slate-400 hover:text-white hover:bg-slate-700"
                      >
                        清除日期
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between text-slate-400 text-sm">
          <span>顯示 {sortedTickets.length} 筆紀錄</span>
        </div>

        <div className="rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-white/10 hover:bg-transparent">
                <TableHead className="text-slate-400">
                  <button
                    onClick={() => handleSort("subject")}
                    className="flex items-center gap-1 hover:text-white transition-colors"
                  >
                    主題
                    <SortIcon field="subject" />
                  </button>
                </TableHead>
                <TableHead className="text-slate-400">
                  <button
                    onClick={() => handleSort("severity")}
                    className="flex items-center gap-1 hover:text-white transition-colors"
                  >
                    層級
                    <SortIcon field="severity" />
                  </button>
                </TableHead>
                <TableHead className="text-slate-400">
                  <button
                    onClick={() => handleSort("status")}
                    className="flex items-center gap-1 hover:text-white transition-colors"
                  >
                    狀態
                    <SortIcon field="status" />
                  </button>
                </TableHead>
                <TableHead className="text-slate-400">
                  <button
                    onClick={() => handleSort("contact_name")}
                    className="flex items-center gap-1 hover:text-white transition-colors"
                  >
                    聯絡人
                    <SortIcon field="contact_name" />
                  </button>
                </TableHead>
                <TableHead className="text-slate-400">
                  <button
                    onClick={() => handleSort("incident_date")}
                    className="flex items-center gap-1 hover:text-white transition-colors"
                  >
                    案件日期
                    <SortIcon field="incident_date" />
                  </button>
                </TableHead>
                <TableHead className="text-slate-400">
                  <button
                    onClick={() => handleSort("last_action_date")}
                    className="flex items-center gap-1 hover:text-white transition-colors"
                  >
                    更新日期
                    <SortIcon field="last_action_date" />
                  </button>
                </TableHead>
                <TableHead className="text-slate-400">案件編號</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTickets.length === 0 ? (
                <TableRow className="border-b border-white/10 hover:bg-transparent">
                  <TableCell colSpan={7} className="text-center py-12 text-slate-500">
                    {tickets.length === 0 ? "尚無工單資料，請點擊「建立工單」新增" : "沒有符合篩選條件的工單"}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedTickets.map((ticket) => (
                  <TableRow
                    key={ticket.id}
                    onClick={() => router.push(`/ai-analysis/tickets/${ticket.id}`)}
                    className="border-b border-white/10 hover:bg-white/5 cursor-pointer"
                  >
                    <TableCell className="text-white font-medium">{ticket.subject}</TableCell>
                    <TableCell>
                      <span className="text-slate-400">{getSeverityLabel(ticket.severity)}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                    </TableCell>
                    <TableCell className="text-slate-300">{ticket.contact_name}</TableCell>
                    <TableCell className="text-slate-300">{format(ticket.incident_date, "yyyy/MM/dd")}</TableCell>
                    <TableCell className="text-slate-300">{format(ticket.last_action_date, "yyyy/MM/dd")}</TableCell>
                    <TableCell className="text-slate-300">{ticket.ticket_no}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {sortedTickets.length > 0 && (
          <div className="flex items-center justify-between text-slate-400 text-sm">
            <div className="flex items-center gap-2">
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
              <span>
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
    </div>
  )
}
