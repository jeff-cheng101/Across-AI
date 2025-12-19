"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CalendarIcon, Send, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { zhTW } from "date-fns/locale"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { RingLoader } from "react-spinners"
import { LoadingOverlay } from "@/components/ui/loading-overlay"
import authenticator from '@/app/util/authenticator'
import { getAllTicketNos, createTicket } from "@/app/routes/ticket"

type SeverityLevel = "low" | "medium" | "high" | "critical"

export default function CreateTicketPage() {
  const auth: any = authenticator.authValue;
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    ticket_no: `SEC-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
    contact_name: "",
    createdDate: new Date(),
    severity: "medium" as SeverityLevel,
    subject: "",
    description: "",
  })
  const [ticketNoList, setTicketNoList] = useState<string[]>([])

  const [errors, setErrors] = useState({
    contact_name: false,
    subject: false,
    description: false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSeverityChange = (severity: SeverityLevel) => {
    setFormData({ ...formData, severity })
  }

  useEffect(() => {
    (async () => {
      await loadSettings()
    })()
  }, [auth])
  
  const loadSettings = async () => {
    try {
      const ticketNos = await getAllTicketNos()
      const ticketNoList = ticketNos.data;
      setTicketNoList(ticketNoList)
    } catch (error) {
      console.error('Error loading ticket nos:', error)
    }
  }

  const handleSubmit = async () => {
    const newErrors = {
      contact_name: !formData.contact_name.trim(),
      subject: !formData.subject.trim(),
      description: !formData.description.trim(),
    }

    setErrors(newErrors)

    if (newErrors.contact_name || newErrors.subject || newErrors.description) {
      toast({
        title: "表單未完成",
        description: "請填寫所有必填欄位",
        variant: "destructive",
      })
      return
    }
    if (ticketNoList.includes(formData.ticket_no)) {
      toast({
        title: "案件編號已存在",
        description: "請重新輸入",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      setIsLoading(true)
      const formatDate = (date: Date) => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
      }

      const newTicket = {
        ticket_no: formData.ticket_no,
        subject: formData.subject,
        description: formData.description,
        severity: formData.severity.charAt(0).toUpperCase() + formData.severity.slice(1),
        status: "待處理",
        contact_name: formData.contact_name,
        account: auth?.user?.email || '',
        incident_date: formatDate(formData.createdDate),
        last_action_date: formatDate(new Date()),
      }

      await createTicket(newTicket)

      // const existingTickets = localStorage.getItem("tickets")
      // const tickets = existingTickets ? JSON.parse(existingTickets) : []
      // tickets.unshift(newTicket)
      // localStorage.setItem("tickets", JSON.stringify(tickets))
      // await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "工單已建立",
        description: `工單編號：${formData.ticket_no}`,
      })

      router.push("/ai-analysis/tickets")
    } catch (error) {
      toast({
        title: "建立失敗",
        description: "請稍後再試",
        variant: "destructive",
      })
      console.log(error)
    } finally {
      setIsSubmitting(false)
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof typeof errors, value: string) => {
    setFormData({ ...formData, [field]: value })
    if (errors[field] && value.trim()) {
      setErrors({ ...errors, [field]: false })
    }
  }

  return (
    <div className="min-h-screen bg-[#08131D] p-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="text-slate-400 hover:text-white hover:bg-gray-500/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/ai-analysis/tickets")}
              className="border-white/10 text-slate-400 hover:bg-slate-800 hover:text-white hover:border-slate-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-file-text w-4 h-4 mr-2"
              >
                <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                <path d="M10 9H8"></path>
                <path d="M16 13H8"></path>
                <path d="M16 17H8"></path>
              </svg>
              工單案件紀錄
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-white">解決問題</h1>
        </div>

        <div className="bg-slate-900/40 border border-white/10 rounded-lg p-8 backdrop-blur-sm">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-2">案件資訊</h2>
            <p className="text-sm text-slate-400 mb-6">請詳細描述資安事件或問題</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 案件編號 */}
              <div className="space-y-2">
                <Label className="text-slate-300">案件編號</Label>
                <Input
                  value={formData.ticket_no}
                  onChange={(e) => setFormData({ ...formData, ticket_no: e.target.value })}
                  className="bg-slate-800/50 border-white/10 text-white focus:border-gray-400 hover:border-gray-400"
                />
                <p className="text-xs text-slate-500">系統自動產生，可手動修改</p>
              </div>

              {/* 聯絡人 */}
              <div className="space-y-2">
                <Label className="text-slate-300">
                  聯絡人 <span className="text-red-400">*</span>
                </Label>
                <Input
                  placeholder="請輸入聯絡人姓名"
                  value={formData.contact_name}
                  onChange={(e) => handleInputChange("contact_name", e.target.value)}
                  className={`bg-slate-800/50 border-white/10 text-white placeholder:text-slate-500 focus:border-gray-400 hover:border-gray-400 ${
                    errors.contact_name ? "border-red-500" : ""
                  }`}
                />
                {errors.contact_name && <p className="text-xs text-red-400">請輸入聯絡人姓名</p>}
              </div>

              {/* 產生日期 */}
              <div className="space-y-2">
                <Label className="text-slate-300">產生日期</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal bg-slate-800/50 border-white/10 text-white hover:bg-slate-800/70 hover:text-white hover:border-gray-400"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.createdDate ? format(formData.createdDate, "yyyy/MM/dd", { locale: zhTW }) : "選擇日期"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-slate-900 border-white/10">
                    <Calendar
                      mode="single"
                      selected={formData.createdDate}
                      onSelect={(date) => date && setFormData({ ...formData, createdDate: date })}
                      className="text-white"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* 嚴重層級 */}
              <div className="space-y-2">
                <Label className="text-slate-300">
                  嚴重層級 <span className="text-red-400">*</span>
                </Label>
                <Select
                  value={formData.severity}
                  onValueChange={(value: SeverityLevel) => setFormData({ ...formData, severity: value })}
                >
                  <SelectTrigger className="bg-slate-800/50 border-white/10 text-white focus:border-gray-400 hover:border-gray-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10">
                    <SelectItem value="low" className="text-white">
                      Low - 低
                    </SelectItem>
                    <SelectItem value="medium" className="text-white">
                      Medium - 中
                    </SelectItem>
                    <SelectItem value="high" className="text-white">
                      High - 高
                    </SelectItem>
                    <SelectItem value="critical" className="text-white">
                      Critical - 極緊急
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <Label className="text-slate-300 mb-2 block">
              你有什麼類型的問題 <span className="text-red-400">*</span>
            </Label>
            <Input
              placeholder="簡述資安事件或問題"
              value={formData.subject}
              onChange={(e) => handleInputChange("subject", e.target.value)}
              className={`bg-slate-800/50 border-white/10 text-white placeholder:text-slate-500 focus:border-gray-400 hover:border-gray-400 ${
                errors.subject ? "border-red-500" : ""
              }`}
            />
            {errors.subject && <p className="text-xs text-red-400 mt-1">請簡述資安事件或問題</p>}
          </div>

          <div className="mb-8">
            <Label className="text-slate-300 mb-2 block">
              詳細描述 <span className="text-red-400">*</span>
            </Label>
            <Textarea
              placeholder="請詳細說明發生的問題、影響範圍、以及相關背景資訊..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className={`min-h-[200px] bg-slate-800/50 border-white/10 text-white placeholder:text-slate-500 focus:border-gray-400 hover:border-gray-400 ${
                errors.description ? "border-red-500" : ""
              }`}
            />
            {errors.description && <p className="text-xs text-red-400 mt-1">請詳細說明發生的問題</p>}
          </div>

          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="border-white/10 text-white hover:bg-white/5"
            >
              取消
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-cyan-600 hover:bg-cyan-700 text-white">
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="mr-2"
                  >
                    <Send className="w-4 h-4" />
                  </motion.div>
                  處理中...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  建立資料
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>

      <LoadingOverlay
        active={isLoading}
        spinner={<RingLoader color={'#17a2b8'} size={60} />}
        styles={{
            overlay: base => ({
                ...base,
                position: 'fixed',
                zIndex: 1050,
            }),
            content: base => ({
                ...base,
                fontWeight: 'normal',
                fontSize: 'inherit'
            }),
        }}
        text='請稍候'
      />
    </div>
  )
}
