"use client"

import { useState } from 'react'
import { useDashboardData } from '@/app/dashboard/dashboard-data-context'
import { Calendar, RefreshCw, Clock, Pause, Play, ChevronDown } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'

/**
 * 时间范围控制组件
 * 包含：快速选择、自动刷新、暂停/继续、立即刷新
 */
export function TimeRangeControls() {
  const {
    setTimeRange,
    refreshInterval,
    setRefreshInterval,
    isRefreshPaused,
    setRefreshPaused,
    refresh,
  } = useDashboardData()

  const [showQuickRanges, setShowQuickRanges] = useState(false)
  const [showRefreshIntervals, setShowRefreshIntervals] = useState(false)
  const [selectedQuickRange, setSelectedQuickRange] = useState<string | null>(null)

  // 快速时间范围选择配置
  const quickRanges = [
    { label: '最近 15 分钟', value: 15 * 60 * 1000 },
    { label: '最近 30 分钟', value: 30 * 60 * 1000 },
    { label: '最近 1 小时', value: 60 * 60 * 1000 },
    { label: '最近 4 小时', value: 4 * 60 * 60 * 1000 },
    { label: '最近 24 小时', value: 24 * 60 * 60 * 1000 },
    { label: '最近 7 天', value: 7 * 24 * 60 * 60 * 1000 },
  ]

  // 自动刷新间隔配置
  const refreshIntervals = [
    { label: '不自动刷新', value: 0 },
    { label: '每 10 秒', value: 10 * 1000 },
    { label: '每 30 秒', value: 30 * 1000 },
    { label: '每 1 分钟', value: 60 * 1000 },
    { label: '每 5 分钟', value: 5 * 60 * 1000 },
    { label: '每 15 分钟', value: 15 * 60 * 1000 },
  ]

  // 处理快速时间范围选择
  const handleQuickRange = (milliseconds: number) => {
    setTimeRange({
      from: new Date(Date.now() - milliseconds),
      to: new Date(),
      mode: 'relative'
    })
    setShowQuickRanges(false)
  }

  // 获取当前刷新间隔的标签
  const getCurrentRefreshLabel = () => {
    const interval = refreshIntervals.find(i => i.value === refreshInterval)
    return interval?.label || '不自动刷新'
  }

  return (
    <div className="flex items-center gap-3">
      {/* 快速選擇下拉選單 */}
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-slate-400" />
        <Popover open={showQuickRanges} onOpenChange={setShowQuickRanges}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="bg-slate-800 border-slate-700 hover:bg-slate-700 text-white flex items-center gap-2"
            >
              <span>{selectedQuickRange || '快速選擇'}</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2 bg-slate-900 border-slate-700">
            <div className="flex flex-col gap-1">
              {quickRanges.map((range) => (
                <button
                  key={range.label}
                  onClick={() => {
                    handleQuickRange(range.value)
                    setSelectedQuickRange(range.label)
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-white hover:bg-slate-800 rounded transition-colors"
                >
                  {range.label}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* 自動刷新間隔下拉選單 */}
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-slate-400" />
        <Popover open={showRefreshIntervals} onOpenChange={setShowRefreshIntervals}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="bg-slate-800 border-slate-700 hover:bg-slate-700 text-white flex items-center gap-2"
            >
              <span>{getCurrentRefreshLabel()}</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2 bg-slate-900 border-slate-700">
            <div className="flex flex-col gap-1">
              {refreshIntervals.map((interval) => (
                <button
                  key={interval.value}
                  onClick={() => {
                    setRefreshInterval(interval.value)
                    setShowRefreshIntervals(false)
                  }}
                  className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                    refreshInterval === interval.value
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'text-white hover:bg-slate-800'
                  }`}
                >
                  {interval.label}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* 暫停/繼續按鈕（僅在啟用自動刷新時顯示） */}
      {refreshInterval > 0 && (
        <button
          onClick={() => setRefreshPaused(!isRefreshPaused)}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700"
          title={isRefreshPaused ? '繼續自動刷新' : '暫停自動刷新'}
        >
          {isRefreshPaused ? (
            <Play className="w-4 h-4" />
          ) : (
            <Pause className="w-4 h-4" />
          )}
        </button>
      )}

      {/* 立即刷新按鈕 */}
      <button
        onClick={refresh}
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors flex items-center gap-2 border border-blue-600"
      >
        <RefreshCw className="w-4 h-4" />
        立即刷新
      </button>
    </div>
  )
}

