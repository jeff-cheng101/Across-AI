"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, Send, CheckCircle2, Clock } from "lucide-react"
import { getTicketsById } from "@/app/routes/ticket"

interface Ticket {
  id: string
  ticketNumber: string
  subject: string
  description: string
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  status: "處理中" | "待回覆" | "已完成" | "已關閉"
  contact_name: string
  incident_date: Date
  last_action_date: Date
}

interface Message {
  id: string
  author: string
  role: "customer" | "team"
  content: string
  timestamp: Date
}

interface TimelineEvent {
  id: string
  status: string
  description: string
  timestamp: Date
}

export default function TicketDetailPage() {
  const router = useRouter()
  const params = useParams()
  const ticketId = params.id as string

  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [timeline, setTimeline] = useState<TimelineEvent[]>([])
  const [replyContent, setReplyContent] = useState("")

  useEffect(() => {
    loadSettings()
  }, [])
  
  const loadSettings = async () => {
    try {
      const ticketResp = await getTicketsById(ticketId)
      const ticket = ticketResp.data || null;
      ticket.status = ticket.status === 'PENDING' ? '待回覆' : ticket.status === 'IN_PROGRESS' ? '處理中' : ticket.status === 'RESOLVED' ? '已完成' : ticket.status === 'CLOSED' ? '已關閉' : '處理中';
      if (ticket.incident_date && typeof ticket.incident_date === 'string') {
        ticket.incident_date = new Date(ticket.incident_date);
      }
      if (ticket.last_action_date && typeof ticket.last_action_date === 'string') {
        ticket.last_action_date = new Date(ticket.last_action_date);
      }
      setTicket(ticket)
    } catch (error) {
      console.error('Error loading tickets:', error)
    }
  }

  useEffect(() => {
    // 載入工單資料
    // const savedTickets = localStorage.getItem("tickets")
    // if (savedTickets) {
    //   const tickets = JSON.parse(savedTickets)
    //   const foundTicket = tickets.find((t: any) => t.id === ticketId)
    //   if (foundTicket) {
    //     setTicket({
    //       ...foundTicket,
    //       createdDate: new Date(foundTicket.createdDate),
    //       updatedDate: new Date(foundTicket.updatedDate),
    //     })
    //   }
    // }

    // const savedMessages = localStorage.getItem(`ticket_messages_${ticketId}`)
    const savedMessages = null;
    if (savedMessages) {
      const parsed = JSON.parse(savedMessages)
      setMessages(parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })))
    } else {
      // 初始化對話記錄，包含客戶訊息和資安團隊回覆
      let initialMessages: Message[] = []

      if (ticketId === "1763707455286") {
        // 為這筆特定工單添加完整的對話記錄
        initialMessages = [
          {
            id: "1",
            author: "客戶",
            role: "customer",
            content: "發現有異常登入嘗試，請協助處理",
            timestamp: new Date("2025-01-15T10:30:00"),
          },
          {
            id: "2",
            author: "資安團隊 - 王工程師",
            role: "team",
            content: "已收到通報，正在進行 IP 來源追蹤與分析",
            timestamp: new Date("2025-01-15T14:20:00"),
          },
          {
            id: "3",
            author: "資安團隊 - 王工程師",
            role: "team",
            content: "已確認為惡意攻擊，已加入黑名單並強化防火牆規則",
            timestamp: new Date("2025-01-16T09:15:00"),
          },
          {
            id: "4",
            author: "資安團隊 - 王工程師",
            role: "team",
            content: "處理完成，建議定期更新密碼並啟用雙因素認證以提升安全性",
            timestamp: new Date("2025-01-18T11:45:00"),
          },
        ]
      } else {
        // 其他工單的預設初始訊息
        initialMessages = [
          {
            id: "1",
            author: "客戶",
            role: "customer",
            content: "發現有異常登入嘗試，請協助處理",
            timestamp: new Date(),
          },
        ]
      }

      setMessages(initialMessages)
      localStorage.setItem(`ticket_messages_${ticketId}`, JSON.stringify(initialMessages))
    }

    const savedTimeline = localStorage.getItem(`ticket_timeline_${ticketId}`)
    if (savedTimeline) {
      const parsed = JSON.parse(savedTimeline)
      setTimeline(parsed.map((t: any) => ({ ...t, timestamp: new Date(t.timestamp) })))
    } else {
      let initialTimeline: TimelineEvent[] = []

      if (ticketId === "1763707455286") {
        // 為這筆特定工單添加完整的時間軸（進行到已完成）
        initialTimeline = [
          {
            id: "1",
            status: "工單已建立",
            description: "",
            timestamp: new Date("2025-01-15T10:30:00"),
          },
          {
            id: "2",
            status: "處理中",
            description: "資安團隊正在處理",
            timestamp: new Date("2025-01-15T14:20:00"),
          },
          {
            id: "3",
            status: "分析完成",
            description: "已完成威脅分析與風險評估",
            timestamp: new Date("2025-01-16T09:15:00"),
          },
          {
            id: "4",
            status: "已完成",
            description: "問題已解決，防護措施已部署",
            timestamp: new Date("2025-01-18T11:45:00"),
          },
        ]
      } else {
        // 其他工單的預設時間軸
        initialTimeline = [
          {
            id: "1",
            status: "工單已建立",
            description: "",
            timestamp: new Date(),
          },
          {
            id: "2",
            status: "處理中",
            description: "資安團隊正在處理",
            timestamp: new Date(),
          },
        ]
      }

      setTimeline(initialTimeline)
      localStorage.setItem(`ticket_timeline_${ticketId}`, JSON.stringify(initialTimeline))
    }
  }, [ticketId])

  const handleSendReply = () => {
    if (!replyContent.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      author: ticket?.contact_name || "客戶",
      role: "customer",
      content: replyContent,
      timestamp: new Date(),
    }

    const updatedMessages = [...messages, newMessage]
    setMessages(updatedMessages)
    localStorage.setItem(`ticket_messages_${ticketId}`, JSON.stringify(updatedMessages))
    setReplyContent("")
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "High":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      case "Medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "Low":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
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

  if (!ticket) {
    return (
      <div className="min-h-screen bg-[#08131D] flex items-center justify-center">
        <div className="text-slate-400">載入中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#08131D] p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Back Button */}
        <Link
          href="/ai-analysis/tickets"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          返回列表
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ticket Header */}
            <div className="bg-slate-900/40 border border-white/10 rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-slate-400 text-sm">{ticket.ticketNumber}</span>
                <Badge className={getSeverityColor(ticket.severity)}>{getSeverityLabel(ticket.severity)}</Badge>
                <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
              </div>

              <h1 className="text-2xl font-bold text-white">{ticket.subject}</h1>

              <div className="bg-slate-800/50 border border-white/10 rounded-lg p-4">
                <p className="text-slate-300 leading-relaxed whitespace-pre-line">{ticket.description}</p>
              </div>
            </div>

            {/* Conversation History */}
            <div className="bg-slate-900/40 border border-white/10 rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-semibold text-white">對話紀錄</h2>

              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex gap-3 ${message.role === "team" ? "ml-12" : ""}`}>
                    {/* Avatar */}
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
                        message.role === "customer" ? "bg-cyan-600" : "bg-slate-600"
                      }`}
                    >
                      {message.role === "customer" ? message.author[0] : "資"}
                    </div>

                    {/* Message Content */}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{message.author}</span>
                        <span className="text-slate-500 text-sm">{format(message.timestamp, "yyyy-MM-dd HH:mm")}</span>
                      </div>
                      <div className="bg-slate-800/50 border border-white/10 rounded-lg p-4">
                        <p className="text-slate-300 leading-relaxed">{message.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reply Section */}
            <div className="bg-slate-900/40 border border-white/10 rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-semibold text-white">新增回覆</h2>

              <Textarea
                placeholder="輸入回覆訊息..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="min-h-[120px] bg-slate-800/50 border-white/10 text-white placeholder:text-slate-500 focus:border-slate-600 hover:border-slate-600"
              />

              <div className="flex justify-end">
                <Button onClick={handleSendReply} className="bg-cyan-600 hover:bg-cyan-700 text-white">
                  <Send className="w-4 h-4 mr-2" />
                  送出回覆
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ticket Info */}
            <div className="bg-slate-900/40 border border-white/10 rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-white">工單資訊</h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-slate-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <div>
                    <div className="text-slate-400 text-sm">聯絡人</div>
                    <div className="text-white font-medium">{ticket.contact_name}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-slate-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <div>
                    <div className="text-slate-400 text-sm">產生日期</div>
                    <div className="text-white font-medium">{format(ticket.incident_date, "yyyy-MM-dd")}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <div className="text-slate-400 text-sm">最後更新</div>
                    <div className="text-white font-medium">{format(ticket.last_action_date, "yyyy-MM-dd")}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="bg-slate-900/40 border border-white/10 rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-white">狀態時間軸</h3>

              <div className="space-y-4">
                {timeline.map((event, index) => (
                  <div key={event.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          event.status === "已完成"
                            ? "bg-green-600"
                            : event.status === "處理中" || event.status === "分析完成"
                              ? "bg-cyan-600"
                              : "bg-slate-600"
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                      {index < timeline.length - 1 && <div className="w-0.5 h-full bg-white/10 flex-1 mt-2" />}
                    </div>

                    <div className="flex-1 pb-6">
                      <div className="text-white font-medium">{event.status}</div>
                      <div className="text-slate-400 text-sm mt-1">{format(event.timestamp, "yyyy-MM-dd")}</div>
                      {event.description && <div className="text-slate-400 text-sm mt-1">{event.description}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
