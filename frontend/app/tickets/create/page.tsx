"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, ArrowLeft, Send } from "lucide-react"
import { format } from "date-fns"
import { zhTW } from "date-fns/locale"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export default function CreateTicketPage() {
  const router = useRouter()
  const [date, setDate] = useState<Date>(new Date())
  const [severity, setSeverity] = useState<string>("medium")
  const [ticketNumber] = useState(`SEC-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("[v0] Ticket created")
    router.back()
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="hover:bg-gray-500/20">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="heading-xl">解決問題</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 案件資訊 Section */}
          <div className="space-y-6 rounded-lg border border-white/10 bg-card p-6">
            <div>
              <h2 className="heading-md mb-2">案件資訊</h2>
              <p className="text-sm text-muted-foreground">請詳細描述資安事件或問題</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* 案件編號 */}
              <div className="space-y-2">
                <Label htmlFor="ticketNumber">案件編號</Label>
                <Input
                  id="ticketNumber"
                  value={ticketNumber}
                  disabled
                  className="bg-muted/50 focus:border-gray-400 focus:ring-gray-400"
                />
                <p className="text-xs text-muted-foreground">系統自動產生，可手動修改</p>
              </div>

              {/* 聯絡人 */}
              <div className="space-y-2">
                <Label htmlFor="contact">
                  聯絡人 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="contact"
                  placeholder="請輸入聯絡人姓名"
                  required
                  className="focus:border-gray-400 focus:ring-gray-400"
                />
              </div>

              {/* 產生日期 */}
              <div className="space-y-2">
                <Label>產生日期</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-background hover:bg-muted/50 focus:border-gray-400",
                        !date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "yyyy/MM/dd", { locale: zhTW }) : "選擇日期"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-card border-white/10" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(newDate) => newDate && setDate(newDate)}
                      initialFocus
                      className="bg-card"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* 處理狀態 */}
              <div className="space-y-2">
                <Label>處理狀態</Label>
                <Select defaultValue="processing">
                  <SelectTrigger className="focus:border-gray-400 focus:ring-gray-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="processing">處理中</SelectItem>
                    <SelectItem value="pending">待處理</SelectItem>
                    <SelectItem value="resolved">已解決</SelectItem>
                    <SelectItem value="closed">已關閉</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 嚴重層級 */}
            <div className="space-y-2">
              <Label>
                嚴重層級 <span className="text-destructive">*</span>
              </Label>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {[
                  { value: "low", label: "Low", subLabel: "低" },
                  { value: "medium", label: "Medium", subLabel: "中" },
                  { value: "high", label: "High", subLabel: "高" },
                  { value: "critical", label: "Critical", subLabel: "極緊急" },
                ].map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => setSeverity(level.value)}
                    className={cn(
                      "flex flex-col items-center justify-center rounded-lg border-2 p-4 transition-all",
                      severity === level.value
                        ? "border-cyan-500 bg-cyan-500/20 text-cyan-400"
                        : "border-white/10 bg-card hover:border-cyan-500/50 hover:bg-cyan-500/10",
                    )}
                  >
                    <span className="text-lg font-medium">{level.label}</span>
                    <span className="text-sm text-muted-foreground">{level.subLabel}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 你有什麼類型的問題 */}
            <div className="space-y-2">
              <Label htmlFor="issueType">
                你有什麼類型的問題 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="issueType"
                placeholder="簡述資安事件或問題"
                required
                className="focus:border-gray-400 focus:ring-gray-400"
              />
            </div>

            {/* 詳細描述 */}
            <div className="space-y-2">
              <Label htmlFor="description">
                詳細描述 <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="請詳細說明發生的問題、影響範圍、以及相關背景資訊..."
                required
                rows={6}
                className="focus:border-gray-400 focus:ring-gray-400 resize-none"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.back()} className="px-8">
              取消
            </Button>
            <Button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-white px-8">
              <Send className="mr-2 h-4 w-4" />
              建立資料
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
