"use client"

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react'

export interface TimeRange {
  from: string | Date
  to: string | Date
  mode?: 'absolute' | 'relative'
}

export interface Filter {
  field: string
  operator: 'is' | 'is_not' | 'exists' | 'does_not_exist'
  value?: any
}

interface DashboardDataContextType {
  // 時間範圍管理
  timeRange: TimeRange
  setTimeRange: (range: TimeRange) => void
  
  // 過濾器管理
  filters: Filter[]
  addFilter: (filter: Filter) => void
  removeFilter: (index: number) => void
  clearFilters: () => void
  
  // 查詢字符串
  query: string
  setQuery: (query: string) => void
  
  // 自動刷新
  refreshInterval: number // 毫秒
  setRefreshInterval: (interval: number) => void
  isRefreshPaused: boolean
  setRefreshPaused: (paused: boolean) => void
  
  // 手動刷新
  refresh: () => void
  refreshTrigger: number
}

const DashboardDataContext = createContext<DashboardDataContextType | undefined>(undefined)

export function DashboardDataProvider({ children }: { children: ReactNode }) {
  // 預設時間範圍：最近15分鐘
  const [timeRange, setTimeRange] = useState<TimeRange>({
    from: new Date(Date.now() - 15 * 60 * 1000),  // 15 分鐘
    to: new Date(),
    mode: 'relative'
  })
  
  const [filters, setFilters] = useState<Filter[]>([])
  const [query, setQuery] = useState<string>('')
  const [refreshInterval, setRefreshInterval] = useState<number>(0) // 0 表示不自動刷新
  const [isRefreshPaused, setRefreshPaused] = useState<boolean>(false)
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0)

  // 添加過濾器
  const addFilter = useCallback((filter: Filter) => {
    setFilters(prev => [...prev, filter])
  }, [])

  // 移除過濾器
  const removeFilter = useCallback((index: number) => {
    setFilters(prev => prev.filter((_, i) => i !== index))
  }, [])

  // 清空過濾器
  const clearFilters = useCallback(() => {
    setFilters([])
  }, [])

  // 手動刷新
  const refresh = useCallback(() => {
    // 如果是相對時間模式，更新時間範圍到最新
    setTimeRange(prev => {
      if (prev.mode === 'relative') {
        const now = new Date()
        const duration = new Date(prev.to).getTime() - new Date(prev.from).getTime()
        return {
          from: new Date(now.getTime() - duration),
          to: now,
          mode: 'relative'
        }
      }
      return prev
    })
    
    setRefreshTrigger(prev => prev + 1)
  }, [])

  // 自動刷新邏輯（類似 Kibana 的 SearchPoll）
  useEffect(() => {
    console.log('refreshInterval:', refreshInterval)
    console.log('isRefreshPaused:', isRefreshPaused)
    if (refreshInterval === 0 || isRefreshPaused) {
      return
    }

    const intervalId = setInterval(() => {
      // 更新時間範圍（如果是相對時間）
      if (timeRange.mode === 'relative') {
        const now = new Date()
        const duration = new Date(timeRange.to).getTime() - new Date(timeRange.from).getTime()
        setTimeRange({
          from: new Date(now.getTime() - duration),
          to: now,
          mode: 'relative'
        })
      }
      
      // 觸發刷新
      setRefreshTrigger(prev => prev + 1)
    }, refreshInterval)

    return () => clearInterval(intervalId)
  }, [refreshInterval, isRefreshPaused, timeRange])

  const value: DashboardDataContextType = {
    timeRange,
    setTimeRange,
    filters,
    addFilter,
    removeFilter,
    clearFilters,
    query,
    setQuery,
    refreshInterval,
    setRefreshInterval,
    isRefreshPaused,
    setRefreshPaused,
    refresh,
    refreshTrigger
  }

  return (
    <DashboardDataContext.Provider value={value}>
      {children}
    </DashboardDataContext.Provider>
  )
}

export function useDashboardData() {
  const context = useContext(DashboardDataContext)
  if (!context) {
    throw new Error('useDashboardData must be used within DashboardDataProvider')
  }
  return context
}
