"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DateTimePickerProps {
  selected?: Date
  onSelect: (date: Date | undefined) => void
}

export function DateTimePicker({ selected, onSelect }: DateTimePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(selected || new Date())
  const [hours, setHours] = useState(selected ? selected.getHours() : 0)
  const [minutes, setMinutes] = useState(selected ? selected.getMinutes() : 0)

  // 当 selected 改变时更新小时和分钟
  useEffect(() => {
    if (selected) {
      setHours(selected.getHours())
      setMinutes(selected.getMinutes())
    }
  }, [selected])

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const monthNames = [
    "一月", "二月", "三月", "四月", "五月", "六月",
    "七月", "八月", "九月", "十月", "十一月", "十二月",
  ]

  const weekDays = ["日", "一", "二", "三", "四", "五", "六"]

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const handleDateClick = (day: number) => {
    const newDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
      hours,
      minutes
    )
    onSelect(newDate)
  }

  const handleHoursChange = (newHours: number) => {
    setHours(newHours)
    if (selected) {
      const newDate = new Date(selected)
      newDate.setHours(newHours)
      onSelect(newDate)
    }
  }

  const handleMinutesChange = (newMinutes: number) => {
    setMinutes(newMinutes)
    if (selected) {
      const newDate = new Date(selected)
      newDate.setMinutes(newMinutes)
      onSelect(newDate)
    }
  }

  const handleHoursInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    if (!isNaN(value) && value >= 0 && value <= 23) {
      handleHoursChange(value)
    } else if (e.target.value === '') {
      handleHoursChange(0)
    }
  }

  const handleMinutesInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    if (!isNaN(value) && value >= 0 && value <= 59) {
      handleMinutesChange(value)
    } else if (e.target.value === '') {
      handleMinutesChange(0)
    }
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
    <div className="flex gap-4 p-3 bg-slate-900 text-white rounded-lg">
      {/* 左側：日曆 */}
      <div className="flex-1">
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

      {/* 右側：時間選擇 */}
      <div className="flex flex-col gap-4 border-l border-slate-700 pl-4 min-w-[120px]">
        <div className="flex items-center gap-2 text-slate-300">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-medium">時間</span>
        </div>

        {/* 小時選擇 */}
        <div className="flex flex-col gap-2">
          <label className="text-xs text-slate-400">小時</label>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              min="0"
              max="23"
              value={hours.toString().padStart(2, '0')}
              onChange={handleHoursInput}
              className="w-16 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-center text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
        </div>

        {/* 分鐘選擇 */}
        <div className="flex flex-col gap-2">
          <label className="text-xs text-slate-400">分鐘</label>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              min="0"
              max="59"
              value={minutes.toString().padStart(2, '0')}
              onChange={handleMinutesInput}
              className="w-16 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-center text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
        </div>

      </div>
    </div>
  )
}

