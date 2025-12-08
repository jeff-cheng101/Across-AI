"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface CustomDatePickerProps {
  selected?: Date
  onSelect: (date: Date | undefined) => void
  placeholder?: string  // 🆕 新增
  disabled?: boolean    // 🆕 新增
}

export function CustomDatePicker({ selected, onSelect, placeholder, disabled }: CustomDatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(selected || new Date())

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const monthNames = [
    "一月",
    "二月",
    "三月",
    "四月",
    "五月",
    "六月",
    "七月",
    "八月",
    "九月",
    "十月",
    "十一月",
    "十二月",
  ]

  const weekDays = ["日", "一", "二", "三", "四", "五", "六"]

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    onSelect(newDate)
  }

  const renderDays = () => {
    const days = []
    const totalDays = daysInMonth(currentMonth)
    const firstDay = firstDayOfMonth(currentMonth)

    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-9" />)
    }

    // Add actual days
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      const isSelected =
        selected &&
        date.getDate() === selected.getDate() &&
        date.getMonth() === selected.getMonth() &&
        date.getFullYear() === selected.getFullYear()
      const isToday =
        date.getDate() === new Date().getDate() &&
        date.getMonth() === new Date().getMonth() &&
        date.getFullYear() === new Date().getFullYear()

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className={cn(
            "h-9 w-full rounded-md text-sm font-normal transition-colors",
            "hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400",
            isSelected && "bg-cyan-600 text-white hover:bg-cyan-700",
            isToday && !isSelected && "bg-slate-700 text-white",
            !isSelected && !isToday && "text-slate-200",
          )}
        >
          {day}
        </button>,
      )
    }

    return days
  }

  return (
    <div className="p-3 bg-slate-900 text-white rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={handlePrevMonth} className="h-7 w-7 hover:bg-slate-700">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-sm font-medium">
          {currentMonth.getFullYear()} 年 {monthNames[currentMonth.getMonth()]}
        </div>
        <Button variant="ghost" size="icon" onClick={handleNextMonth} className="h-7 w-7 hover:bg-slate-700">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Week days header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="h-9 flex items-center justify-center text-slate-400 text-xs font-normal">
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">{renderDays()}</div>
    </div>
  )
}




