"use client"

import { useDashboardData } from '@/app/dashboard/dashboard-data-context'
import { Calendar, RefreshCw, Pause, Play, Filter } from 'lucide-react'
import { useState } from 'react'

export function DashboardControls() {
  const {
    timeRange,
    setTimeRange,
    refreshInterval,
    setRefreshInterval,
    isRefreshPaused,
    setRefreshPaused,
    refresh,
    filters,
    removeFilter,
    clearFilters
  } = useDashboardData()

  const [showTimeMenu, setShowTimeMenu] = useState(false)

  const quickRanges = [
    { label: '最近 15 分钟', value: 15 * 60 * 1000 },
    { label: '最近 30 分钟', value: 30 * 60 * 1000 },
    { label: '最近 1 小时', value: 60 * 60 * 1000 },
    { label: '最近 4 小时', value: 4 * 60 * 60 * 1000 },
    { label: '最近 24 小时', value: 24 * 60 * 60 * 1000 },
    { label: '最近 7 天', value: 7 * 24 * 60 * 60 * 1000 },
  ]

  const refreshIntervals = [
    { label: '不自动刷新', value: 0 },
    { label: '每 10 秒', value: 10 * 1000 },
    { label: '每 30 秒', value: 30 * 1000 },
    { label: '每 1 分钟', value: 60 * 1000 },
    { label: '每 5 分钟', value: 5 * 60 * 1000 },
    { label: '每 15 分钟', value: 15 * 60 * 1000 },
  ]

  const handleQuickRange = (milliseconds: number) => {
    setTimeRange({
      from: new Date(Date.now() - milliseconds),
      to: new Date(),
      mode: 'relative'
    })
    setShowTimeMenu(false)
  }

  const getCurrentRangeLabel = () => {
    const duration = new Date(timeRange.to).getTime() - new Date(timeRange.from).getTime()
    const range = quickRanges.find(r => Math.abs(r.value - duration) < 1000)
    return range?.label || '自定义时间范围'
  }

  const getCurrentRefreshLabel = () => {
    const interval = refreshIntervals.find(i => i.value === refreshInterval)
    return interval?.label || '不自动刷新'
  }

  return (
    <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-4 rounded-lg mb-6 relative z-40">
      <div className="flex items-center justify-end flex-wrap gap-4">
        {/* 左侧：过滤器显示（如果有） */}
        {filters.length > 0 && (
          <div className="flex items-center gap-3 mr-auto">
            <Filter className="w-5 h-5 text-slate-400" />
            <div className="flex items-center gap-2 flex-wrap">
              {filters.map((filter, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-lg text-sm text-blue-300"
                >
                  <span>{filter.field}</span>
                  <span className="text-blue-400">{filter.operator}</span>
                  {filter.value && <span className="font-semibold">{filter.value}</span>}
                  <button
                    onClick={() => removeFilter(index)}
                    className="ml-1 hover:text-white transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                onClick={clearFilters}
                className="px-3 py-1 text-sm text-red-400 hover:text-red-300 transition-colors"
              >
                清除全部
              </button>
            </div>
          </div>
        )}

        {/* 右侧：时间范围选择 */}
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-slate-400" />
          <div className="relative">
            <button
              onClick={() => setShowTimeMenu(!showTimeMenu)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm rounded-lg transition-colors flex items-center gap-2"
            >
              <span>{getCurrentRangeLabel()}</span>
              <svg
                className={`w-4 h-4 transition-transform ${showTimeMenu ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* 时间范围下拉菜单 */}
            {showTimeMenu && (
              <div className="absolute top-full mt-2 right-0 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-[9999] min-w-[200px]">
                <div className="p-2">
                  <div className="text-xs text-slate-400 px-3 py-2 font-semibold">快速选择</div>
                  {quickRanges.map((range) => (
                    <button
                      key={range.label}
                      onClick={() => handleQuickRange(range.value)}
                      className="w-full text-left px-3 py-2 text-sm text-white hover:bg-slate-700 rounded transition-colors"
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 右侧：刷新控制 */}
        <div className="flex items-center gap-3">
          <RefreshCw className="w-5 h-5 text-slate-400" />
          
          {/* 自动刷新间隔 */}
          <select
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(Number(e.target.value))}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm rounded-lg transition-colors"
          >
            {refreshIntervals.map((interval) => (
              <option key={interval.value} value={interval.value}>
                {interval.label}
              </option>
            ))}
          </select>

          {/* 暂停/继续按钮 */}
          {refreshInterval > 0 && (
            <button
              onClick={() => setRefreshPaused(!isRefreshPaused)}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
              title={isRefreshPaused ? '继续自动刷新' : '暂停自动刷新'}
            >
              {isRefreshPaused ? (
                <Play className="w-4 h-4" />
              ) : (
                <Pause className="w-4 h-4" />
              )}
            </button>
          )}

          {/* 手动刷新按钮 */}
          <button
            onClick={refresh}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            立即刷新
          </button>
        </div>
      </div>
    </div>
  )
}
