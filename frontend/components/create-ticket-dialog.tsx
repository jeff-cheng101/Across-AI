"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Send } from "lucide-react"
import { format } from "date-fns"
import { zhTW } from "date-fns/locale"

interface CreateTicketDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type SeverityLevel = "low" | "medium" | "high" | "critical"

export function CreateTicketDialog({ open, onOpenChange }: CreateTicketDialogProps) {
  const [ticketId, setTicketId] = useState(`SEC-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`)
  const [contact, setContact] = useState("")
  const [date, setDate] = useState<Date>(new Date())
  const [status, setStatus] = useState("processing")
  const [severity, setSeverity] = useState<SeverityLevel>("medium")
  const [issue, setIssue] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = () => {
    // Handle ticket creation logic here
    console.log("[v0] Creating ticket:", {
      ticketId,
      contact,
      date,
      status,
      severity,
      issue,
      description,
    })
    onOpenChange(false)
  }

  const getSeverityButtonClass = (level: SeverityLevel) => {
    const baseClass = "flex-1 py-6 rounded-lg border-2 transition-all duration-200"
    if (severity === level) {
      return `${baseClass} bg-cyan-500/20 border-cyan-500 text-white`
    }
    return `${baseClass} bg-transparent border-white/10 text-gray-400 hover:border-cyan-500/50 hover:text-gray-300`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-black/95 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">解決問題</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* 案件資訊 */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">案件資訊</h3>
              <p className="text-sm text-gray-400">請詳細描述資安事件或問題</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* 案件編號 */}
              <div className="space-y-2">
                <Label htmlFor="ticketId" className="text-sm text-gray-300">
                  案件編號
                </Label>
                <Input
                  id="ticketId"
                  value={ticketId}
                  onChange={(e) => setTicketId(e.target.value)}
                  className="bg-white/5 border-white/10 text-white focus:border-gray-400 focus:ring-gray-400"
                />
                <p className="text-xs text-gray-500">系統自動產生，可手動修改</p>
              </div>

              {/* 聯絡人 */}
              <div className="space-y-2">
                <Label htmlFor="contact" className="text-sm text-gray-300">
                  聯絡人 <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="contact"
                  placeholder="請輸入聯絡人姓名"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-gray-400 focus:ring-gray-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* 產生日期 */}
              <div className="space-y-2">
                <Label className="text-sm text-gray-300">產生日期</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-gray-400 focus:border-gray-400"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(date, "yyyy/MM/dd", { locale: zhTW })}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-gray-900 border-white/10" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(newDate) => newDate && setDate(newDate)}
                      locale={zhTW}
                      className="bg-gray-900 text-white"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* 處理狀態 */}
              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm text-gray-300">
                  處理狀態
                </Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-gray-400 focus:ring-gray-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-white/10 text-white">
                    <SelectItem value="processing">處理中</SelectItem>
                    <SelectItem value="pending">待處理</SelectItem>
                    <SelectItem value="resolved">已解決</SelectItem>
                    <SelectItem value="closed">已關閉</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* 嚴重層級 */}
          <div className="space-y-3">
            <Label className="text-sm text-gray-300">
              嚴重層級 <span className="text-red-400">*</span>
            </Label>
            <div className="grid grid-cols-4 gap-3">
              <button type="button" onClick={() => setSeverity("low")} className={getSeverityButtonClass("low")}>
                <div className="text-center">
                  <div className="text-lg font-semibold">Low</div>
                  <div className="text-xs mt-1">低</div>
                </div>
              </button>
              <button type="button" onClick={() => setSeverity("medium")} className={getSeverityButtonClass("medium")}>
                <div className="text-center">
                  <div className="text-lg font-semibold">Medium</div>
                  <div className="text-xs mt-1">中</div>
                </div>
              </button>
              <button type="button" onClick={() => setSeverity("high")} className={getSeverityButtonClass("high")}>
                <div className="text-center">
                  <div className="text-lg font-semibold">High</div>
                  <div className="text-xs mt-1">高</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setSeverity("critical")}
                className={getSeverityButtonClass("critical")}
              >
                <div className="text-center">
                  <div className="text-lg font-semibold">Critical</div>
                  <div className="text-xs mt-1">極緊急</div>
                </div>
              </button>
            </div>
          </div>

          {/* 你有什麼類型的問題 */}
          <div className="space-y-2">
            <Label htmlFor="issue" className="text-sm text-gray-300">
              你有什麼類型的問題 <span className="text-red-400">*</span>
            </Label>
            <Input
              id="issue"
              placeholder="簡述資安事件或問題"
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-gray-400 focus:ring-gray-400"
            />
          </div>

          {/* 詳細描述 */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm text-gray-300">
              詳細描述 <span className="text-red-400">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="請詳細說明發生的問題、影響範圍、以及相關背景資訊..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-gray-400 focus:ring-gray-400 resize-none"
            />
          </div>

          {/* 操作按鈕 */}
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="px-6 bg-transparent border-white/10 text-white hover:bg-white/5"
            >
              取消
            </Button>
            <Button onClick={handleSubmit} className="px-6 bg-cyan-600 hover:bg-cyan-700 text-white">
              <Send className="w-4 h-4 mr-2" />
              建立資料
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
