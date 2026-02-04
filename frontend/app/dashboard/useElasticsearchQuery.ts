import { useEffect, useState, useCallback, useRef } from 'react'
import { useDashboardData } from '@/app/dashboard/dashboard-data-context'
import moment from 'moment'
import axios from 'axios'
import { getElasticsearchResponse } from '@/app/routes/elasticsearch'

interface UseElasticsearchQueryOptions {
  index: string
  query?: any
  aggs?: any
  size?: number
  enabled?: boolean
  customTimeRange?: {
    from: string | Date
    to: string | Date
    mode?: 'absolute' | 'relative'
  }
}

interface QueryState<T> {
  data: T | null
  isLoading: boolean
  isError: boolean
  error: Error | null
  refetch: () => void
}

export function useElasticsearchQuery<T = any>(options: UseElasticsearchQueryOptions): QueryState<T> {
  const { timeRange, refreshTrigger } = useDashboardData()
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)
  
  // 使用 ref 來追蹤當前請求，避免同時有多個請求正在發送
  // 當 timeRange 快速變化或是元件重複渲染時，如果上一個 API 請求還沒回來，會直接**中斷（Abort）**舊的請求，只處理最後一個
  const abortControllerRef = useRef<AbortController | null>(null)
  // 使用 ref 儲存 options，避免因物件引用變化導致無限循環
  const optionsRef = useRef(options)
  optionsRef.current = options

  const fetchData = useCallback(async () => {
    const currentOptions = optionsRef.current
    if (currentOptions.enabled === false) {
      setIsLoading(false)
      return
    }
    // 取消之前的請求，並建立新的 AbortController
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    abortControllerRef.current = new AbortController()
    const { signal } = abortControllerRef.current

    setIsLoading(true)
    setIsError(false)
    setError(null)

    try {
      // 建立時間範圍過濾器
      // 如果有自定義時間範圍，優先使用(ex: 自定義上一個時間區間，用作跟當前時間區間比較)
      let actualFrom: string | Date
      let actualTo: string | Date
      let effectiveTimeRange = currentOptions.customTimeRange || timeRange

      if (effectiveTimeRange.mode === 'relative') {
        const now = new Date()
        const duration = new Date(effectiveTimeRange.to).getTime() - new Date(effectiveTimeRange.from).getTime()  //計算時間範圍
        actualTo = now
        actualFrom = new Date(now.getTime() - duration)  // 起始時間 = 「現在」減去「剛算出的總毫秒數」
      } else {
        actualFrom = effectiveTimeRange.from
        actualTo = effectiveTimeRange.to
      }
      
      const from = moment(actualFrom).toISOString()
      const to = moment(actualTo).toISOString()
      
      const body: any = {
        size: currentOptions.size ?? 0,
        query: {
          bool: {
            filter: [
              {
                range: {
                  '@timestamp': {
                    gte: from,
                    lte: to
                  }
                }
              }
            ]
          }
        }
      }
      
      if (currentOptions.query) {
        body.query.bool.must = currentOptions.query
      }
      if (currentOptions.aggs) {
        body.aggs = currentOptions.aggs
      }

      // 調用後端 API，傳遞 signal 支持請求中止
        const response = await getElasticsearchResponse(
            {
                index: currentOptions.index,
                body
            },
            signal
        );

      const result = response.data
      setData(result as T)
      setIsLoading(false)
    } catch (err: any) {
      // axios 取消请求的检测，如果請求被取消，不設置錯誤
      if (axios.isCancel(err) || err.name === 'CanceledError' || err.code === 'ERR_CANCELED') {
        console.log('Elasticsearch request cancelled')
        return
      }
      
      // 處理 axios 錯誤
      const errorMessage = err.response?.data?.error || err.message || 'Elasticsearch query failed'
      const errorObj = new Error(errorMessage)
      setError(errorObj)
      setIsError(true)
      setIsLoading(false)
      console.error('Elasticsearch query error:', {
        message: errorMessage,
        status: err.response?.status,
        error: err
      })
    }
  }, [timeRange, JSON.stringify(options.query), JSON.stringify(options.aggs), options.index, options.enabled, options.size, JSON.stringify(options.customTimeRange)])

  // 初始加載、timeRange 變化和手動刷新時重新獲取
  useEffect(() => {
    fetchData()
    // 清理函式：元件卸載時取消請求
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [fetchData, refreshTrigger]) // refreshTrigger 改變時觸發刷新

  return {
    data,
    isLoading,
    isError,
    error,
    refetch: fetchData
  }
}

/**
 * useElasticsearchAggregation Hook
 * 聚合查詢
 */
export function useElasticsearchAggregation<T = any>(
  index: string,
  aggs: any,
  options?: Omit<UseElasticsearchQueryOptions, 'index' | 'aggs'>  // 忽略 index 和 aggs 選項 (Omit)
) {
  const result = useElasticsearchQuery<any>({
    ...options,
    index,
    aggs,
    size: 0,
    enabled: options?.enabled ?? true
  })

  return {
    ...result,
    data: result.data?.aggregations as T | null
  }
}

