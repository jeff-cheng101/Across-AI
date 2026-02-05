import { useMemo } from "react"
import { getCountryCoordinateOrDefault } from "@/lib/country-coordinates"
import { useDashboardData } from "../../dashboard-data-context"
import { useElasticsearchAggregation } from '../../useElasticsearchQuery'

/**
 * 根據傳入的 zones 產生 ES filter
 * 防呆措施：如果 zones 為空，則回傳一個不匹配任何內容的 filter，避免洩露其他客戶的資料
 */
function getZoneFilter(zones?: string[]) {
  if (!zones || zones.length === 0) {
    // 回傳一個永遠為空的過濾條件，確保數據顯示為 0
    return { bool: { must_not: { match_all: {} } } }
  }
  return {
    terms: { 'ZoneName.keyword': zones }
  }
}

const calculateChange = (curr: number, prev: number) => {
  if (prev === 0) return curr > 0 ? 100 : 0    // 如果前期為0，則返回當前值是否大於0，大於0則返回100，否則返回0
  return ((curr - prev) / prev) * 100          // 計算變化率：(當前值 - 前期值) / 前期值 * 100
}

const formatTrafficVolume = (bytes: number) => {
  if (bytes === 0) return { value: 0, unit: 'B' };
  if (bytes >= 1000000000000) return { value: bytes / 1000000000000, unit: 'TB' };
  if (bytes >= 1000000000) return { value: bytes / 1000000000, unit: 'GB' };
  if (bytes >= 1000000) return { value: bytes / 1000000, unit: 'MB' };
  
  const kbValue = bytes / 1000;
  // 如果換算成 KB 後，小數點後兩位仍有值 (不等於 0.00)，就使用 KB
  if (kbValue.toFixed(2) !== "0.00") {
    return { value: kbValue, unit: 'KB' };
  }
  return { value: bytes, unit: 'B' };
};

/** ******************************************************** 總攬 ******************************************************** */
/**
 * WAF 已阻擋威脅 (包含與前期對比)
 * WAF 僅監控 (包含與前期對比)
 * WAF 總安全事件 (包含與前期對比)
 */
export function getWafEventsCount(zones?: string[]) {
  // 抓取當前時間範圍，並計算前期時間範圍 (同等長度的過去時間，比方說選擇前15分鐘，那前期時間範圍就是前30分~前15分之間)
  const { timeRange } = useDashboardData()
  const previousTimeRange = useMemo(() => {
    const from = new Date(timeRange.from).getTime()
    const to = new Date(timeRange.to).getTime()
    const duration = to - from
    return {
      from: new Date(from - duration).toISOString(),
      to: new Date(from).toISOString(),
      mode: 'absolute' as const
    }
  }, [timeRange])

  const zoneFilter = useMemo(() => getZoneFilter(zones), [zones])

  const aggregationConfig = {
    waf_blocked_events: {
      filter: {
        bool: {
          must: [
            { terms: { 'SecurityActions.keyword': ['block', 'jschallenge', 'managedChallenge'] } }
          ],
          ...(zoneFilter ? { filter: [zoneFilter] } : {})
        }
      }
    },
    waf_monitored_events: {
      filter: {
        bool: {
          // monitor為包含log跟skip的請求，並且不包含block，因log有可能SecurityActions.keyword:[log,block]，所以需排除這種情況
          must: [
            { terms: { 'SecurityActions.keyword': ['log', 'skip'] } }
          ],
          must_not: [
            { term: { 'SecurityActions.keyword': 'block' } }
          ],
          ...(zoneFilter ? { filter: [zoneFilter] } : {})
        }
      }
    },
    waf_total_events: {
      filter: {
        bool: {
          must: [
            { exists: { field: 'SecurityActions.keyword' } }
          ],
          ...(zoneFilter ? { filter: [zoneFilter] } : {})
        }
      }
    }
  }

  const { data: currentData } = useElasticsearchAggregation(
    'across-cf-logpush-*',
    aggregationConfig
  )
  // 抓取前期時間區間資料，並傳入自定義的前期時間範圍
  const { data: previousData } = useElasticsearchAggregation(
    'across-cf-logpush-*',
    aggregationConfig,
    { customTimeRange: previousTimeRange }
  )

  return useMemo(() => {
    const current = {
      total: currentData?.waf_total_events?.doc_count || 0,
      blocks: currentData?.waf_blocked_events?.doc_count || 0,
      monitors: currentData?.waf_monitored_events?.doc_count || 0
    }
    const previous = {
      total: previousData?.waf_total_events?.doc_count || 0,
      blocks: previousData?.waf_blocked_events?.doc_count || 0,
      monitors: previousData?.waf_monitored_events?.doc_count || 0
    }
    
    return {
      ...current,
      previous,
      changes: {
        total: calculateChange(current.total, previous.total),
        blocks: calculateChange(current.blocks, previous.blocks),
        monitors: calculateChange(current.monitors, previous.monitors)
      }
    }
  }, [currentData, previousData])
}

/**
 * 獲取 CDN 快取命中率 (包含與前期對比)
 */
export function useCdnCacheStatus(zones?: string[]) {
  const { timeRange } = useDashboardData()
  
  const previousTimeRange = useMemo(() => {
    const from = new Date(timeRange.from).getTime()
    const to = new Date(timeRange.to).getTime()
    const duration = to - from
    return {
      from: new Date(from - duration).toISOString(),
      to: new Date(from).toISOString(),
      mode: 'absolute' as const
    }
  }, [timeRange])

  const zoneFilter = useMemo(() => getZoneFilter(zones), [zones])

  const aggregationConfig = {
    all_requests: { 
      filter: zoneFilter || { match_all: {} } 
    },
    cache_hits: {
      filter: {
        bool: {
          must: [
            { term: { 'CacheCacheStatus.keyword': 'hit' } }
          ],
          ...(zoneFilter ? { filter: [zoneFilter] } : {})
        }
      }
    }
  }

  const { data: currentData } = useElasticsearchAggregation('across-cf-logpush-*', aggregationConfig)
  const { data: previousData } = useElasticsearchAggregation('across-cf-logpush-*', aggregationConfig, { customTimeRange: previousTimeRange })

  return useMemo(() => {
    const current = {
      total: currentData?.all_requests?.doc_count || 0,
      hits: currentData?.cache_hits?.doc_count || 0,
      rate: currentData?.all_requests?.doc_count ? (currentData.cache_hits.doc_count / currentData.all_requests.doc_count) * 100 : 0
    }

    const previous = {
      total: previousData?.all_requests?.doc_count || 0,
      hits: previousData?.cache_hits?.doc_count || 0,
      rate: previousData?.all_requests?.doc_count ? (previousData.cache_hits.doc_count / previousData.all_requests.doc_count) * 100 : 0
    }

    return {
      ...current,
      previous,
      changes: {
        total: calculateChange(current.total, previous.total),
        hits: calculateChange(current.hits, previous.hits),
        rate: current.rate - previous.rate // 百分點變化
      }
    }
  }, [currentData, previousData])
}

/**
 * 源伺服器錯誤率 (5xx) (包含與前期對比)
 */
export function useOriginServerErrors(zones?: string[]) {
  const { timeRange } = useDashboardData()
  
  const previousTimeRange = useMemo(() => {
    const from = new Date(timeRange.from).getTime()
    const to = new Date(timeRange.to).getTime()
    const duration = to - from
    return {
      from: new Date(from - duration).toISOString(),
      to: new Date(from).toISOString(),
      mode: 'absolute' as const
    }
  }, [timeRange])

  const zoneFilter = useMemo(() => getZoneFilter(zones), [zones])

  const aggregationConfig = {
    all_requests: { 
      filter: zoneFilter || { match_all: {} } 
    },
    error_5xx: {
      filter: {
        bool: {
          must: [
            { range: { OriginResponseStatus: { gte: 500, lt: 599 } } }
          ],
          ...(zoneFilter ? { filter: [zoneFilter] } : {})
        }
      }
    }
  }

  const { data: currentData } = useElasticsearchAggregation('across-cf-logpush-*', aggregationConfig)
  const { data: previousData } = useElasticsearchAggregation('across-cf-logpush-*', aggregationConfig, { customTimeRange: previousTimeRange })

  return useMemo(() => {
    const current = {
      total: currentData?.all_requests?.doc_count || 0,
      errors: currentData?.error_5xx?.doc_count || 0,
      rate: currentData?.all_requests?.doc_count ? (currentData.error_5xx.doc_count / currentData.all_requests.doc_count) * 100 : 0
    }

    const previous = {
      total: previousData?.all_requests?.doc_count || 0,
      errors: previousData?.error_5xx?.doc_count || 0,
      rate: previousData?.all_requests?.doc_count ? (previousData.error_5xx.doc_count / previousData.all_requests.doc_count) * 100 : 0
    }

    return {
      ...current,
      previous,
      changes: {
        total: calculateChange(current.total, previous.total),
        errors: calculateChange(current.errors, previous.errors),
        rate: current.rate - previous.rate // 百分點變化
      }
    }
  }, [currentData, previousData])
}


/**
 * 獲取攻擊來源國家分布（TOP 10）
 * 統計所有攻擊日誌按國家分組，顯示前10個國家 (包含Intranet & Other)
 */
export function useAttackGeoSources(zones?: string[]) {
  const zoneFilter = useMemo(() => getZoneFilter(zones), [zones])
  
  const { data: attackGeoSourcesData } = useElasticsearchAggregation(
    'across-cf-logpush-*',
    {
      filtered_attacks: {
        filter: zoneFilter || { match_all: {} },
        aggs: {
          by_country: {
            terms: {
              field: 'geoip_client.country_name.keyword',
              size: 10,
              order: { _count: 'desc' }
            },
            aggs: {
              attack_traffic: {
                sum: { field: 'bytes' }
              }
            }
          }
        }
      }
    }
  )
  return useMemo(() => {
    const buckets = attackGeoSourcesData?.filtered_attacks?.by_country.buckets || []
    const totalFromBuckets = buckets.reduce((sum: number, b: any) => sum + b.doc_count, 0)
    const colors = ["#ef4444", "#f97316", "#eab308", "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#6366f1"]
    const topCountries = buckets.map((bucket: any, index: number) => {
      if (bucket.key === 'Intranet') {
        return {
          country: "Intranet",
          countryOriginal: "Intranet",
          count: bucket.doc_count,
          percentage: Math.round((bucket.doc_count / totalFromBuckets) * 10000) / 100,
          color: "#6b7280",
          lng: 0,
          lat: 0,
          x: "0%",
          y: "0%"
        }
      } else if (bucket.key === 'Other') {
        return {
          country: "Other",
          countryOriginal: "Other",
          count: bucket.doc_count,
          percentage: Math.round((bucket.doc_count / totalFromBuckets) * 10000) / 100,
          color: "#6b7280",
          lng: 0,
          lat: 0,
          x: "0%",
          y: "0%"
        }
      } else {
        const countryName = bucket.key
        const coords = getCountryCoordinateOrDefault(countryName)
      
        return {
          country: coords.name || countryName,  // 中文國家名稱
          countryOriginal: countryName,         // 英文國家名稱
          count: bucket.doc_count,
          percentage: Math.round((bucket.doc_count / totalFromBuckets) * 10000) / 100,
          color: colors[index % colors.length],
          lng: coords.lng,
          lat: coords.lat,
          x: coords.x,
          y: coords.y
        }
      }
    })
    
    return topCountries
  }, [attackGeoSourcesData])
}

/**
 * 根據時間範圍計算適當的 interval
 * ≤15m: 每1分鐘，X軸每個點顯示
 * ≤1h: 每5分鐘，X軸每個點顯示
 * ≤1d: 每30分鐘，X軸每2個點顯示
 * ≤7d: 每3小時，X軸每4個點顯示
 * ≤30d: 每12小時，X軸每2個點顯示
 * >30d: 每7天，X軸約每月顯示（每4個點）
 * 
 * @returns interval - ES 查詢的時間間隔
 * @returns seconds - 間隔秒數（用於計算 Gbps）
 * @returns tickInterval - X 軸刻度間隔（每隔多少個數據點顯示一個刻度）
 */
export function getTrafficInterval(from: Date, to: Date): { interval: string; seconds: number; tickInterval: number } {
  const diffMs = to.getTime() - from.getTime()
  const diffMinutes = diffMs / (1000 * 60)
  const diffHours = diffMinutes / 60
  const diffDays = diffHours / 24

  if (diffMinutes <= 15) {
    return { interval: '1m', seconds: 60, tickInterval: 0 }  // 每個點都顯示
  } else if (diffMinutes <= 60) {
    return { interval: '1m', seconds: 300, tickInterval: 0 }  // 每個點都顯示
  } else if (diffHours <= 6) {
    return { interval: '5m', seconds: 1800, tickInterval: 1 }  // 每2個點顯示
  } else if (diffHours <= 24) {
    return { interval: '30m', seconds: 1800, tickInterval: 1 }  // 每2個點顯示
  } else if (diffDays <= 7) {
    return { interval: '1h', seconds: 3600, tickInterval: 5 }   // 每6個點顯示 (每6小時)
  } else if (diffDays <= 30) {
    return { interval: '6h', seconds: 21600, tickInterval: 3 }  // 每4個點顯示 (每24小時)
  } else if (diffDays <= 90) {
    return { interval: '12h', seconds: 43200, tickInterval: 1 } // 每2個點顯示 (每天)
  } else if (diffDays <= 365) {
    return { interval: '1d', seconds: 86400, tickInterval: 6 }  // 每7個點顯示 (每週)
  } else {
    return { interval: '7d', seconds: 604800, tickInterval: 3 } // 每4個點顯示 (每月)
  }
}

/**
 * 獲取流量趨勢數據
 * @param interval - 時間間隔（如 '1m', '5m', '1h'）
 * @param intervalSeconds - 間隔秒數，用於計算 Gbps
 * @param timeRange - 可選的時間範圍，用於 extended_bounds
 * @param zones - 可選的 Cloudflare Zones
 */
export function useTrafficTrend(interval: string = '5m', intervalSeconds: number = 300, timeRange?: { from: Date | string, to: Date | string }, zones?: string[]) {
    const zoneFilter = useMemo(() => getZoneFilter(zones), [zones])
    
    const { data } = useElasticsearchAggregation(
        'across-cf-logpush-*',
        {
          traffic_over_time: {
            date_histogram: {
              field: '@timestamp',
              fixed_interval: interval,
              min_doc_count: 0,
              extended_bounds: timeRange ? {
                min: new Date(timeRange.from).toISOString(),
                max: new Date(timeRange.to).toISOString()
              } : undefined
            },
            aggs: {
              filtered_traffic: {
                filter: zoneFilter || { match_all: {} },
                aggs: {
                  log_count: { filter: { term: { 'SecurityActions.keyword': 'log' } } },
                  block_count: { filter: { term: { 'SecurityActions.keyword': 'block' } } },
                  skip_count: { filter: { term: { 'SecurityActions.keyword': 'skip' } } },
                  managed_count: { filter: { term: { 'SecurityActions.keyword': 'managedChallenge' } } },
                  jschallenge_count: { filter: { term: { 'SecurityActions.keyword': 'jschallenge' } } },
                }
              }
            }
          }
        }
      )
    
      return useMemo(() => {
        const buckets = data?.traffic_over_time?.buckets || []
        if (buckets.length === 0) return []

        // 使用與 query 相同的方式解析時間
        const startTime = timeRange ? new Date(timeRange.from).getTime() : 0;
        const endTime = timeRange ? new Date(timeRange.to).getTime() : Infinity;
        
        // 1. 過濾掉完全不在範圍內的 bucket
        // 只要 bucket 的區間 [key, key + interval] 與 [startTime, endTime] 有交集就留下
        const filteredBuckets = buckets.filter((bucket: any) => {
          const bucketStart = bucket.key;
          const bucketEnd = bucket.key + intervalSeconds * 1000;
          return bucketEnd >= startTime && bucketStart <= endTime;
        });

        return filteredBuckets.map((bucket: any, index: number) => {
          const logCount = bucket.filtered_traffic?.log_count?.doc_count || 0
          const blockCount = bucket.filtered_traffic?.block_count?.doc_count || 0
          const skipCount = bucket.filtered_traffic?.skip_count?.doc_count || 0
          const managedCount = bucket.filtered_traffic?.managed_count?.doc_count || 0
          const jschallengeCount = bucket.filtered_traffic?.jschallenge_count?.doc_count || 0
          
          // 2. 對首尾資料點的時間進行裁剪，使其對齊選擇的範圍，避免圖表前後留白或超出
          let bucketTime = bucket.key;
          if (index === 0 && bucketTime < startTime) {
            // 如果第一個 bucket 開始於選擇時間之前，將其顯示點移至選擇的開始時間
            bucketTime = startTime;
          } else if (index === filteredBuckets.length - 1 && bucketTime > endTime) {
            // 如果最後一個 bucket 開始於選擇時間之後，將其顯示點移至選擇的結束時間
            bucketTime = endTime;
          }

          const date = new Date(bucketTime)
          let timeFormat: Intl.DateTimeFormatOptions  
          if (intervalSeconds <= 300) {
            timeFormat = { hour: '2-digit', minute: '2-digit', hour12: false }
          } else {
            timeFormat = { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }
          }
          
          const fullTimeFormat: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }

          return {
            timestamp: bucketTime,
            time: date.toLocaleString('zh-TW', timeFormat),            
            fullTime: date.toLocaleString('zh-TW', fullTimeFormat),    
            log: logCount,
            block: blockCount,
            skip: skipCount,
            managedChallenge: managedCount,
            jschallenge: jschallengeCount,
            // 為了相容舊有的 attack/clean 欄位 (可選，避免立即報錯)
            attack: blockCount,
            clean: logCount + skipCount + managedCount + jschallengeCount
          }
        })
      }, [data, intervalSeconds, timeRange])
}

/**
 * 獲取頻寬流量趨勢數據 (bps)
 */
export function useTrafficTrendBps(interval: string = '5m', intervalSeconds: number = 300, timeRange?: { from: Date | string, to: Date | string }, zones?: string[]) {
    const zoneFilter = useMemo(() => getZoneFilter(zones), [zones])
    
    const { data } = useElasticsearchAggregation(
        'across-cf-logpush-*',
        {
          traffic_over_time: {
            date_histogram: {
              field: '@timestamp',
              fixed_interval: interval,
              min_doc_count: 0,
              extended_bounds: timeRange ? {
                min: new Date(timeRange.from).toISOString(),
                max: new Date(timeRange.to).toISOString()
              } : undefined
            },
            aggs: {
              filtered_traffic: {
                filter: zoneFilter || { match_all: {} },
                aggs: {
                  log_bytes: { 
                    filter: { term: { 'SecurityActions.keyword': 'log' } },
                    aggs: { total: { sum: { field: 'EdgeResponseBytes' } } }
                  },
                  block_bytes: { 
                    filter: { term: { 'SecurityActions.keyword': 'block' } },
                    aggs: { total: { sum: { field: 'EdgeResponseBytes' } } }
                  },
                  skip_bytes: { 
                    filter: { term: { 'SecurityActions.keyword': 'skip' } },
                    aggs: { total: { sum: { field: 'EdgeResponseBytes' } } }
                  },
                  managed_bytes: { 
                    filter: { term: { 'SecurityActions.keyword': 'managedChallenge' } },
                    aggs: { total: { sum: { field: 'EdgeResponseBytes' } } }
                  },
                  jschallenge_bytes: { 
                    filter: { term: { 'SecurityActions.keyword': 'jschallenge' } },
                    aggs: { total: { sum: { field: 'EdgeResponseBytes' } } }
                  },
                }
              }
            }
          }
        }
      )
    
      return useMemo(() => {
        const buckets = data?.traffic_over_time?.buckets || []
        if (buckets.length === 0) return []

        const startTime = timeRange ? new Date(timeRange.from).getTime() : 0;
        const endTime = timeRange ? new Date(timeRange.to).getTime() : Infinity;
        
        const filteredBuckets = buckets.filter((bucket: any) => {
          const bucketStart = bucket.key;
          const bucketEnd = bucket.key + intervalSeconds * 1000;
          return bucketEnd >= startTime && bucketStart <= endTime;
        });

        return filteredBuckets.map((bucket: any, index: number) => {
          const logBytes = bucket.filtered_traffic?.log_bytes?.total?.value || 0
          const blockBytes = bucket.filtered_traffic?.block_bytes?.total?.value || 0
          const skipBytes = bucket.filtered_traffic?.skip_bytes?.total?.value || 0
          const managedBytes = bucket.filtered_traffic?.managed_bytes?.total?.value || 0
          const jschallengeBytes = bucket.filtered_traffic?.jschallenge_bytes?.total?.value || 0

          const logBps = (logBytes * 8) / intervalSeconds
          const blockBps = (blockBytes * 8) / intervalSeconds
          const skipBps = (skipBytes * 8) / intervalSeconds
          const managedBps = (managedBytes * 8) / intervalSeconds
          const jschallengeBps = (jschallengeBytes * 8) / intervalSeconds
          
          let bucketTime = bucket.key;
          if (index === 0 && bucketTime < startTime) bucketTime = startTime;
          else if (index === filteredBuckets.length - 1 && bucketTime > endTime) bucketTime = endTime;

          const date = new Date(bucketTime)
          let timeFormat: Intl.DateTimeFormatOptions = intervalSeconds <= 300 
            ? { hour: '2-digit', minute: '2-digit', hour12: false }
            : { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false };
          
          const fullTimeFormat: Intl.DateTimeFormatOptions = {
            year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false
          }

          return {
            timestamp: bucketTime,
            time: date.toLocaleString('zh-TW', timeFormat),            
            fullTime: date.toLocaleString('zh-TW', fullTimeFormat),    
            attack: blockBps + managedBps + jschallengeBps,
            clean: logBps + skipBps
          }
        })
      }, [data, intervalSeconds, timeRange])
}



/** ****************************************************** WAF 分析 ****************************************************** */
/**
 * 獲取 WAF 事件趨勢（時間序列）
 * 根據時間區間自動調整：
 * - 前15分鐘：每5分鐘
 * - 前24小時：每1小時
 * - 前7天：每3小時
 */
export function useWafEventTrend(interval: string = '1h', timeRange?: { from: Date; to: Date }, zones?: string[]) {
  const zoneFilter = useMemo(() => getZoneFilter(zones), [zones])
  
  // 構建 date_histogram 配置
  const dateHistogramConfig: any = {
    field: '@timestamp',
    fixed_interval: interval,
    min_doc_count: 0  // 显示没有数据的时间桶
  }

  // 如果提供了时间范围，添加 extended_bounds 来确保显示完整的时间范围
  if (timeRange) {
    dateHistogramConfig.extended_bounds = {
      min: timeRange.from.getTime(),
      max: timeRange.to.getTime()
    }
  }

  return useElasticsearchAggregation(
    'across-cf-logpush-*',
    {
      waf_events_over_time: {
        date_histogram: dateHistogramConfig,
        aggs: {
          filtered_events: {
            filter: zoneFilter || { match_all: {} },
            aggs: {
              blocked: {
                filter: {
                  terms: { 'SecurityActions.keyword': ['block', 'jschallenge', 'managedChallenge'] }
                }
              },
              monitored: {
                filter: {
                  terms: { 'SecurityActions.keyword': ['log', 'skip'] }
                }
              }
            }
          }
        }
      }
    }
  )
}

/**
 * TOP 5 被攻擊的網域
 * 統計所有攻擊日誌按網域分組，顯示前5個網域
 */
export function useTopAttackedHosts(zones?: string[]) {
  const zoneFilter = useMemo(() => getZoneFilter(zones), [zones])
  
  const { data: attackedHostsData } = useElasticsearchAggregation(
    'across-cf-logpush-*',
    {
      filtered_attacks: {
        filter: zoneFilter || { match_all: {} },
        aggs: {
          attacked_hosts: {
            terms: {
              field: 'ClientRequestHost.keyword',
              size: 5,
              order: { _count: 'desc' }
            }
          }
        }
      }
    }
  )
  return useMemo(() => {
    const colors = ["#3b82f6", "#f97316", "#eab308", "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#6366f1"]
    const topAttackedHosts = (attackedHostsData?.filtered_attacks?.attacked_hosts?.buckets || []).map((bucket: any, index: number) => {
      return {
        name: bucket.key,
        count: bucket.doc_count,
        color: colors[index]
      }
    })
    return topAttackedHosts
  }, [attackedHostsData])
}

/**
 * TOP 10 攻擊來源城市
 * 統計所有攻擊日誌按城市分組，顯示前5個城市 (包含Intranet & Other)
 */
export function useAttackCitySources(zones?: string[]) {
  const zoneFilter = useMemo(() => getZoneFilter(zones), [zones])
  
  const { data: attackCitySourcesData } = useElasticsearchAggregation(
    'across-cf-logpush-*',
    {
      filtered_attacks: {
        filter: zoneFilter || { match_all: {} },
        aggs: {
          by_city: {
            terms: {
              field: 'geoip_client.city_name.keyword',
              size: 10,
              order: { _count: 'desc' }
            },
          }
        }
      }
    }
  )

  return useMemo(() => {
    const buckets = attackCitySourcesData?.filtered_attacks?.by_city.buckets || []
    const totalFromBuckets = buckets.reduce((sum: number, b: any) => sum + b.doc_count, 0)
    const colors = ["#10b981", "#f59e0b", "#eab308", "#8b5cf6", "#3b82f6", "#8b5cf6", "#f97316", "#ec4899", "#ef4444"]
    const topCities = buckets.map((bucket: any, index: number) => {
      if (bucket.key === 'Intranet') {
        return {
          city: "Intranet",
          count: bucket.doc_count,
          percentage: Math.round((bucket.doc_count / totalFromBuckets) * 10000) / 100,
          color: "#6366f1",
        }
      } else if (bucket.key === 'Other') {
        return {
          city: "Other",
          count: bucket.doc_count,
          percentage: Math.round((bucket.doc_count / totalFromBuckets) * 10000) / 100,
          color: "#6366f1",
        }
      } else {
        return {
          city: bucket.key,
          count: bucket.doc_count,
          percentage: Math.round((bucket.doc_count / totalFromBuckets) * 10000) / 100,
          color: colors[index % colors.length],
        }
      }
    })
    return topCities
  }, [attackCitySourcesData])
}

/**
 * TOP 10 被攻擊的 URL
 * 統計各 被攻擊的 URL 的網域名稱
 */
export function useTopAttackedUrls(zones?: string[]) {
  const zoneFilter = useMemo(() => getZoneFilter(zones), [zones])
  
  const { data: topAttackedUrlsData } =  useElasticsearchAggregation(
    'across-cf-logpush-*',
    {
      filtered_attacks: {
        filter: zoneFilter || { match_all: {} },
        aggs: {
          attacked_urls: {
            terms: {
              field: 'ClientRequestURI.keyword',
              size: 10,
              order: { _count: 'desc' }
            },
            aggs: {
              top_host: {
                terms: {
                  field: 'ClientRequestHost.keyword',  // 針對每個 URI 找出對應的 Host
                  size: 1
                }
              }
            }
          }
        }
      }
    }
  )
  return useMemo(() => {
    const colors = ["#f59e0b", "#10b981", "#ef4444", "#10b981", "#8b5cf6", "#f97316", "#3b82f6", "#06b6d4", "#ec4899", "#84cc16", "#6366f1"]
    const hostColorMap: { [key: string]: string } = {}
    let colorIndex = 0
    return (topAttackedUrlsData?.filtered_attacks?.attacked_urls?.buckets || []).map((bucket: any) => {
      const host = bucket.top_host?.buckets?.[0]?.key || 'Unknown'
            if (!hostColorMap[host]) {
        hostColorMap[host] = colors[colorIndex % colors.length]
        colorIndex++
      }

      return {
        url: bucket.key,
        count: bucket.doc_count,
        host: host,
        color: hostColorMap[host], // 相同的 host 會得到相同的顏色
      }
    })
  }, [topAttackedUrlsData])
}

/**
 * 獲取流量趨勢數據
 * @param interval - 時間間隔（如 '1m', '5m', '1h'）
 * @param intervalSeconds - 間隔秒數，用於計算 Gbps
 * @param timeRange - 可選的時間範圍，用於 extended_bounds
 * @param zones - 可選的 Cloudflare Zones
 */
// export function useAttackTrafficTrend(interval: string = '5m', intervalSeconds: number = 300, timeRange?: { from: Date | string, to: Date | string }, zones?: string[]) {
//   const zoneFilter = useMemo(() => getZoneFilter(zones), [zones])
  
//   const { data } = useElasticsearchAggregation(
//       'across-cf-logpush-*',
//       {
//         traffic_over_time: {
//           date_histogram: {
//             field: '@timestamp',
//             fixed_interval: interval,
//             min_doc_count: 0,
//             extended_bounds: timeRange ? {
//               min: new Date(timeRange.from).toISOString(),
//               max: new Date(timeRange.to).toISOString()
//             } : undefined
//           },
//           aggs: {
//             filtered_traffic: {
//               filter: zoneFilter || { match_all: {} },
//               aggs: {
//                 log_count: { filter: { term: { 'SecurityActions.keyword': 'log' } } },
//                 block_count: { filter: { term: { 'SecurityActions.keyword': 'block' } } },
//                 skip_count: { filter: { term: { 'SecurityActions.keyword': 'skip' } } },
//                 managed_count: { filter: { term: { 'SecurityActions.keyword': 'managedChallenge' } } },
//                 jschallenge_count: { filter: { term: { 'SecurityActions.keyword': 'jschallenge' } } },
//               }
//             }
//           }
//         }
//       }
//     )
  
//     return useMemo(() => {
//       const buckets = data?.traffic_over_time?.buckets || []
//       if (buckets.length === 0) return []

//       // 使用與 query 相同的方式解析時間
//       const startTime = timeRange ? new Date(timeRange.from).getTime() : 0;
//       const endTime = timeRange ? new Date(timeRange.to).getTime() : Infinity;
      
//       // 1. 過濾掉完全不在範圍內的 bucket
//       // 只要 bucket 的區間 [key, key + interval] 與 [startTime, endTime] 有交集就留下
//       const filteredBuckets = buckets.filter((bucket: any) => {
//         const bucketStart = bucket.key;
//         const bucketEnd = bucket.key + intervalSeconds * 1000;
//         return bucketEnd >= startTime && bucketStart <= endTime;
//       });

//       return filteredBuckets.map((bucket: any, index: number) => {
//         const logCount = bucket.filtered_traffic?.log_count?.doc_count || 0
//         const blockCount = bucket.filtered_traffic?.block_count?.doc_count || 0
//         const skipCount = bucket.filtered_traffic?.skip_count?.doc_count || 0
//         const managedCount = bucket.filtered_traffic?.managed_count?.doc_count || 0
//         const jschallengeCount = bucket.filtered_traffic?.jschallenge_count?.doc_count || 0
        
//         // 2. 對首尾資料點的時間進行裁剪，使其對齊選擇的範圍，避免圖表前後留白或超出
//         let bucketTime = bucket.key;
//         if (index === 0 && bucketTime < startTime) {
//           // 如果第一個 bucket 開始於選擇時間之前，將其顯示點移至選擇的開始時間
//           bucketTime = startTime;
//         } else if (index === filteredBuckets.length - 1 && bucketTime > endTime) {
//           // 如果最後一個 bucket 開始於選擇時間之後，將其顯示點移至選擇的結束時間
//           bucketTime = endTime;
//         }

//         const date = new Date(bucketTime)
//         let timeFormat: Intl.DateTimeFormatOptions  
//         if (intervalSeconds <= 300) {
//           timeFormat = { hour: '2-digit', minute: '2-digit', hour12: false }
//         } else {
//           timeFormat = { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }
//         }
        
//         const fullTimeFormat: Intl.DateTimeFormatOptions = {
//           year: 'numeric',
//           month: '2-digit',
//           day: '2-digit',
//           hour: '2-digit',
//           minute: '2-digit',
//           hour12: false
//         }

//         return {
//           timestamp: bucketTime,
//           time: date.toLocaleString('zh-TW', timeFormat),            
//           fullTime: date.toLocaleString('zh-TW', fullTimeFormat),    
//           log: logCount,
//           block: blockCount,
//           skip: skipCount,
//           managedChallenge: managedCount,
//           jschallenge: jschallengeCount
//         }
//       })
//     }, [data, intervalSeconds, timeRange])
// }


/** ******************************************************** DDOS 防護 ******************************************************** */

/**
 * 根據時間範圍計算適當的 Peak interval
 * 依據查詢的時間範圍（from → to）動態決定「計算 attack peak 時要用的時間 bucket 間隔（interval）」
 * Ex: 在某段時間內，把流量用固定時間間隔分桶，長出最大的那個桶
 */
export function getPeakInterval(from: Date, to: Date): { interval: string; seconds: number } {
  const diffMs = to.getTime() - from.getTime()
  const diffMinutes = diffMs / (1000 * 60)
  
  // 目標 buckets 數量控制在合理範圍內，確保精確度同時不超過 ES 限制
  if (diffMinutes <= 30) {
    return { interval: '1s', seconds: 1 }
  } else if (diffMinutes <= 180) { // 3小時
    return { interval: '10s', seconds: 10 }
  } else if (diffMinutes <= 1440) { // 24小時
    return { interval: '1m', seconds: 60 }
  } else if (diffMinutes <= 10080) { // 7天
    return { interval: '5m', seconds: 300 }
  } else {
    return { interval: '30m', seconds: 1800 }
  }
}

/**
 * 攻擊峰值 (Attack Peak RPS)
 * 計算方式：在時間範圍內，將日誌按細粒度時間分組，計算每秒請求數 (RPS)，並取最大值。
 * Attack Peak = 所有時間切片中，RPS 的最大值（Max），EX: 這個系統，在最壞的 1 秒 / 5 秒 / 1 分鐘內，承受了多大的瞬間壓力？
 * RPS = Count of events / interval in seconds
 */
export function useAttackPeak(zones?: string[]) {
  const { timeRange } = useDashboardData()
  const zoneFilter = useMemo(() => getZoneFilter(zones), [zones])
  
  // 計算當前與前期的時間範圍
  const { actualTimeRange, previousTimeRange, intervalConfig } = useMemo(() => {
    let from: Date, to: Date
    if (timeRange.mode === 'relative') {
      const now = new Date()
      const duration = new Date(timeRange.to).getTime() - new Date(timeRange.from).getTime()
      to = now
      from = new Date(now.getTime() - duration)
    } else {
      from = new Date(timeRange.from)
      to = new Date(timeRange.to)
    }

    const durationMs = to.getTime() - from.getTime()
    const prevTo = from
    const prevFrom = new Date(from.getTime() - durationMs)

    return { 
      actualTimeRange: { from, to },
      previousTimeRange: { from: prevFrom.toISOString(), to: prevTo.toISOString(), mode: 'absolute' as const },
      intervalConfig: getPeakInterval(from, to) 
    }
  }, [timeRange])

  const aggregationConfig = {
    traffic_over_time: {
      date_histogram: {
        field: 'EdgeStartTimestamp',
        fixed_interval: intervalConfig.interval,
        min_doc_count: 0
      },
      aggs: {
        filtered_stats: {
          filter: {
            bool: {
              must: [
                { term: { 'SecurityActions.keyword': 'block' } },
                { term: { 'SecuritySources.keyword': 'l7ddos' } }
              ],
              ...(zoneFilter ? { filter: [zoneFilter] } : {})
            }
          },
          aggs: {
            total_bytes: { sum: { field: 'EdgeResponseBytes' } }
          }
        }
      }
    },
    peak_bytes_raw: {
      max_bucket: {
        buckets_path: 'traffic_over_time>filtered_stats.total_bytes'
      }
    }
  }

  // 同時抓取當前與前期數據
  const { data: currentData } = useElasticsearchAggregation('across-cf-logpush-*', aggregationConfig)
  const { data: previousData } = useElasticsearchAggregation('across-cf-logpush-*', aggregationConfig, { customTimeRange: previousTimeRange })

  return useMemo(() => {
    const formatPeakRate = (bits: number) => {
      if (bits >= 1099511627776) return { value: bits / 1099511627776, unit: 'Tbps' };
      if (bits >= 1073741824) return { value: bits / 1073741824, unit: 'Gbps' };
      if (bits >= 1048576) return { value: bits / 1048576, unit: 'Mbps' };
      const kbpsValue = bits / 1024;
      if (kbpsValue.toFixed(2) !== "0.00") return { value: kbpsValue, unit: 'Kbps' };
      return { value: bits, unit: 'bps' };
    };

    const currentPeakBytes = currentData?.peak_bytes_raw?.value || 0
    const previousPeakBytes = previousData?.peak_bytes_raw?.value || 0

    const currentBps = (currentPeakBytes * 8) / intervalConfig.seconds
    const previousBps = (previousPeakBytes * 8) / intervalConfig.seconds

    const currentFormatted = formatPeakRate(currentBps);
    const previousFormatted = formatPeakRate(previousBps);

    return { 
      peakRps: currentFormatted.value,
      peakUnit: currentFormatted.unit,
      previous: {
        value: previousFormatted.value,
        unit: previousFormatted.unit
      },
      changes: {
        value: calculateChange(currentBps, previousBps),
      }
    }
  }, [currentData, previousData, intervalConfig])
}

/**
 * 已清洗流量 (Cleaned Traffic)
 */
export function useCleanedTrafficCount(zones?: string[]) {
  // 抓取當前時間範圍，並計算前期時間範圍 (同等長度的過去時間，比方說選擇前15分鐘，那前期時間範圍就是前30分~前15分之間)
  const { timeRange } = useDashboardData()
  const previousTimeRange = useMemo(() => {
    const from = new Date(timeRange.from).getTime()
    const to = new Date(timeRange.to).getTime()
    const duration = to - from
    return {
      from: new Date(from - duration).toISOString(),
      to: new Date(from).toISOString(),
      mode: 'absolute' as const
    }
  }, [timeRange])

  const zoneFilter = useMemo(() => getZoneFilter(zones), [zones])

  const aggregationConfig = useMemo(() => ({
    cleaned_events: {
      filter: {
        bool: {
          must: [
            { terms: { 'SecurityActions.keyword': ['block', 'jschallenge', 'managedChallenge'] } },
            { term: { 'SecuritySources.keyword': 'l7ddos' } } // 只計算 DDoS 來源
          ],
          ...(zoneFilter ? { filter: [zoneFilter] } : {})
        }
      }
    },
    cleaned_bytes: {
      filter: {
        bool: {
          must: [
            { terms: { 'SecurityActions.keyword': ['block', 'jschallenge', 'managedChallenge'] } },
            { term: { 'SecuritySources.keyword': 'l7ddos' } } // 只計算 DDoS 來源
          ],
          ...(zoneFilter ? { filter: [zoneFilter] } : {})
        }
      },
      aggs: {
        total: { sum: { field: 'EdgeResponseBytes' } }
      }
    },
    total_events: {
      filter: {
        bool: {
          must: [
            { term: { 'SecuritySources.keyword': 'l7ddos' } } // 只計算 DDoS 來源
          ],
          ...(zoneFilter ? { filter: [zoneFilter] } : {})
        }
      }
    }
  }), [zoneFilter])

  const { data: currentData } = useElasticsearchAggregation('across-cf-logpush-*', aggregationConfig)
  const { data: previousData } = useElasticsearchAggregation('across-cf-logpush-*', aggregationConfig, { customTimeRange: previousTimeRange })

  return useMemo(() => {
    const currentTraffic = formatTrafficVolume(currentData?.cleaned_bytes?.total?.value || 0);
    const previousTraffic = formatTrafficVolume(previousData?.cleaned_bytes?.total?.value || 0);

    const currentRawBytes = currentData?.cleaned_bytes?.total?.value || 0;
    const previousRawBytes = previousData?.cleaned_bytes?.total?.value || 0;

    const current = {
      count: currentData?.cleaned_events?.doc_count || 0,
      bytes: currentTraffic.value,
      unit: currentTraffic.unit,
      total_events: currentData?.total_events?.doc_count || 0,
    }
    const previous = {
      count: previousData?.cleaned_events?.doc_count || 0,
      bytes: previousTraffic.value,
      unit: previousTraffic.unit,
      total_events: previousData?.total_events?.doc_count || 0
    }

    const currentRate = current.total_events > 0 ? (current.count / current.total_events) * 100 : 0
    const previousRate = previous.total_events > 0 ? (previous.count / previous.total_events) * 100 : 0

    return {
      ...current,
      rate: currentRate,
      previous: {
        ...previous,
        rate: previousRate
      },
      changes: {
        count: calculateChange(current.count, previous.count),
        bytes: calculateChange(currentRawBytes, previousRawBytes),
        rate: calculateChange(currentRate, previousRate),
      },
    }
  }, [currentData, previousData])
}

/**
 * 獲取已清洗流量趨勢（時間序列）
 */
export function useCleanedTrafficTrend(interval: string = '5m', intervalSeconds: number = 300, timeRange?: { from: Date | string, to: Date | string }, zones?: string[]) {
  const zoneFilter = useMemo(() => getZoneFilter(zones), [zones])
  
  const { data } = useElasticsearchAggregation(
    'across-cf-logpush-*',
    {
      traffic_over_time: {
        date_histogram: {
          field: '@timestamp',
          fixed_interval: interval,
          min_doc_count: 0,
          extended_bounds: timeRange ? {
            min: new Date(timeRange.from).toISOString(),
            max: new Date(timeRange.to).toISOString()
          } : undefined
        },
        aggs: {
          filtered_traffic: {
            filter: zoneFilter || { match_all: {} },
            aggs: {
              cleaned_bytes: {
                filter: {
                  bool: {
                    must: [
                      { terms: { 'SecurityActions.keyword': ['block', 'jschallenge', 'managedChallenge'] } },
                      { term: { 'SecuritySources.keyword': 'l7ddos' } }
                    ]
                  }
                },
                aggs: {
                  total: { sum: { field: 'EdgeResponseBytes' } }
                }
              }
            }
          }
        }
      }
    }
  )

  return useMemo(() => {
    const buckets = data?.traffic_over_time?.buckets || []
    if (buckets.length === 0) return []

    const startTime = timeRange ? new Date(timeRange.from).getTime() : 0;
    const endTime = timeRange ? new Date(timeRange.to).getTime() : Infinity;
    
    const filteredBuckets = buckets.filter((bucket: any) => {
      const bucketStart = bucket.key;
      const bucketEnd = bucket.key + intervalSeconds * 1000;
      return bucketEnd >= startTime && bucketStart <= endTime;
    });

    return filteredBuckets.map((bucket: any, index: number) => {
      const bytes = bucket.filtered_traffic?.cleaned_bytes?.total?.value || 0
      const bps = (bytes * 8) / intervalSeconds;
      
      let bucketTime = bucket.key;
      if (index === 0 && bucketTime < startTime) bucketTime = startTime;
      else if (index === filteredBuckets.length - 1 && bucketTime > endTime) bucketTime = endTime;

      const date = new Date(bucketTime)
      const timeFormat: Intl.DateTimeFormatOptions = intervalSeconds <= 300 
        ? { hour: '2-digit', minute: '2-digit', hour12: false }
        : { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false };
      
      const fullTimeFormat: Intl.DateTimeFormatOptions = {
        year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
      };

      return {
        timestamp: bucketTime,
        time: date.toLocaleString('zh-TW', timeFormat),            
        fullTime: date.toLocaleString('zh-TW', fullTimeFormat),    
        bytes: bytes,
      }
    })
  }, [data, intervalSeconds, timeRange])
}

/**
 * TOP 5 被DDoS的網域
 * 統計所有攻擊日誌按網域分組，顯示前5個網域
 */
export function useTopDDoSHosts(zones?: string[]) {
  const { timeRange } = useDashboardData()
  const zoneFilter = useMemo(() => getZoneFilter(zones), [zones])

  const { currentDurationSeconds } = useMemo(() => {
    const from = new Date(timeRange.from).getTime()
    const to = new Date(timeRange.to).getTime()
    return { currentDurationSeconds: (to - from) / 1000 }
  }, [timeRange])

  const { data: attackedHostsData } = useElasticsearchAggregation(
    'across-cf-logpush-*',
    {
      filtered_ddos_hosts: {
        filter: {
          bool: {
            must: [
              { term: { 'SecuritySources.keyword': 'l7ddos' } } // 只計算 DDoS 來源
            ],
            ...(zoneFilter ? { filter: [zoneFilter] } : {})
          }
        },
        aggs: {
          ddos_hosts: {
            terms: {
              field: 'ClientRequestHost.keyword',
              size: 5,
              order: { total_bytes: 'desc' } // 改為按流量排序
            },
            aggs: {
              total_bytes: { sum: { field: 'EdgeResponseBytes' } } // 計算每個 host 的總流量
            }
          }
        }
      }
    }
  )

  return useMemo(() => {
    const colors = ["#3b82f6", "#f97316", "#eab308", "#8b5cf6", "#ec4899"]
    const topDDoSHosts = (attackedHostsData?.filtered_ddos_hosts?.ddos_hosts?.buckets || []).map((bucket: any, index: number) => {
      const traffic = formatTrafficVolume(bucket.total_bytes?.value || 0);
      return {
        name: bucket.key,
        value: traffic.value,
        unit: traffic.unit,
        count: bucket.doc_count,
        color: colors[index % colors.length]
      }
    })
    return topDDoSHosts
  }, [attackedHostsData, currentDurationSeconds])
}

/**
 * TOP 10 攻擊來源 IP
 * 統計各 被攻擊的 URL 的網域名稱
 */
export function useTopAttackIPs(zones?: string[]) {
  const zoneFilter = useMemo(() => getZoneFilter(zones), [zones])

  const getFlagEmoji = (countryCode: string) => {
    if (!countryCode || countryCode.length !== 2) return '🏳️';
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  const { data: topIpsData } = useElasticsearchAggregation(
    'across-cf-logpush-*',
    {
      filtered_attacks: {
        filter: {
          bool: {
            must: [
              { term: { 'SecuritySources.keyword': 'l7ddos' } } // 只計算 DDoS 來源
            ],
            ...(zoneFilter ? { filter: [zoneFilter] } : {})
          }
        },
        aggs: {
          top_ips: {
            terms: {
              field: 'ClientIP.keyword',
              size: 10,
              order: { total_bytes: 'desc' } // 按總流量排序
            },
            aggs: {
              total_bytes: { sum: { field: 'EdgeResponseBytes' } }, // 計算每個 IP 的攻擊總流量
              country_info: {
                terms: { field: 'geoip_client.country_name.keyword', size: 1 } // 取得國家名稱 (英文)
              },
              country_code: {
                terms: { field: 'ClientCountry.keyword', size: 1 } // 取得國家代碼 (用於國旗)
              }
            }
          }
        }
      }
    }
  )

  return useMemo(() => {
    const formatTraffic = (bytes: number) => {
      if (bytes === 0) return '0 B';
      if (bytes >= 1000000000000) return `${(bytes / 1000000000000).toFixed(2)} TB`;
      if (bytes >= 1000000000) return `${(bytes / 1000000000).toFixed(2)} GB`;
      if (bytes >= 1000000) return `${(bytes / 1000000).toFixed(2)} MB`;
      else return `${(bytes / 1000).toFixed(2)} KB`;
    };

    return (topIpsData?.filtered_attacks?.top_ips?.buckets || []).map((bucket: any) => {
      const countryNameEn = bucket.country_info?.buckets?.[0]?.key || 'Unknown';
      const countryCode = bucket.country_code?.buckets?.[0]?.key || '';
      const flag = getFlagEmoji(countryCode);
      
      // 使用 getCountryCoordinateOrDefault 進行中文化轉換
      const countryData = getCountryCoordinateOrDefault(countryNameEn);
      const countryNameZh = countryData.name;
      
      return {
        ip: bucket.key,
        country: `${flag} ${countryNameZh}`,
        total_traffic: formatTraffic(bucket.total_bytes?.value || 0),
        count: bucket.doc_count
      };
    });
  }, [topIpsData])
}


/** ******************************************************** CDN 性能 ******************************************************** */

/**
 *  CDN 總傳輸流量
 */
export function useCdnTotalTraffic(zones?: string[]) {
  const { timeRange } = useDashboardData()
  const previousTimeRange = useMemo(() => {
    const from = new Date(timeRange.from).getTime()
    const to = new Date(timeRange.to).getTime()
    const duration = to - from
    return {
      from: new Date(from - duration).toISOString(),
      to: new Date(from).toISOString(),
      mode: 'absolute' as const
    }
  }, [timeRange])

  const zoneFilter = useMemo(() => getZoneFilter(zones), [zones])
  const aggregationConfig = {
    filtered_total_traffic: {
      filter: zoneFilter || { match_all: {} },
      aggs: {
        total_traffic: {
          sum: { field: 'EdgeResponseBytes' }
        },
        average_response_time: {
          avg: { field: 'OriginResponseTime' }
        },
        cached_bytes: {
          sum: { field: 'CacheResponseBytes' }
        },
        origin_bytes: {
          filter: { 
            bool: { 
              must_not: { term: { 'CacheCacheStatus.keyword': 'hit' } } 
            }
          },
          aggs: {
            sum_edge: { sum: { field: 'EdgeResponseBytes' } }
          }
        }
      }
    }
  }

  const { data: currentData } = useElasticsearchAggregation('across-cf-logpush-*', aggregationConfig)
  const { data: previousData } = useElasticsearchAggregation('across-cf-logpush-*', aggregationConfig, { customTimeRange: previousTimeRange })

  return useMemo(() => {
    const currentBytes = currentData?.filtered_total_traffic?.total_traffic?.value || 0
    const previousBytes = previousData?.filtered_total_traffic?.total_traffic?.value || 0
    const current = formatTrafficVolume(currentBytes)
    const previous = formatTrafficVolume(previousBytes)

    const currentCached = currentData?.filtered_total_traffic?.cached_bytes?.value || 0;
    const currentOrigin = currentData?.filtered_total_traffic?.origin_bytes?.sum_edge?.value || 0;
    const currentRate = (currentCached + currentOrigin) > 0 
      ? (currentCached / (currentCached + currentOrigin)) * 100 
      : 0;
    const previousCached = previousData?.filtered_total_traffic?.cached_bytes?.value || 0;
    const previousOrigin = previousData?.filtered_total_traffic?.origin_bytes?.sum_edge?.value || 0;
    const previousRate = (previousCached + previousOrigin) > 0 
      ? (previousCached / (previousCached + previousOrigin)) * 100 
      : 0;

    return {
      ...current,
      cached_rate: currentRate || 0,
      average_response_time: currentData?.filtered_total_traffic?.average_response_time?.value || 0,
      previous: {
        ...previous,
        cached_rate: previousRate || 0,
        average_response_time: previousData?.filtered_total_traffic?.average_response_time?.value || 0,
      },
      changes: {
        value: calculateChange(currentBytes, previousBytes),
        average_response_time: calculateChange(currentData?.filtered_total_traffic?.average_response_time?.value || 0, previousData?.filtered_total_traffic?.average_response_time?.value || 0),
      }
    }
  }, [currentData, previousData])
}

export function useCdnTrafficTrend(interval: string = '5m', intervalSeconds: number = 300, timeRange?: { from: Date | string, to: Date | string }, zones?: string[]) {
  const zoneFilter = useMemo(() => getZoneFilter(zones), [zones])
  
  const { data } = useElasticsearchAggregation(
      'across-cf-logpush-*',
      {
        traffic_over_time: {
          date_histogram: {
            field: '@timestamp',
            fixed_interval: interval,
            min_doc_count: 0,
            extended_bounds: timeRange ? {
              min: new Date(timeRange.from).toISOString(),
              max: new Date(timeRange.to).toISOString()
            } : undefined
          },
          aggs: {
            filtered_traffic: {
              filter: zoneFilter || { match_all: {} },
              aggs: {
                statuses: {
                  terms: {
                    field: 'CacheCacheStatus.keyword',
                    size: 10
                  }
                }
              }
            }
          }
        }
      }
    )
  
    return useMemo(() => {
      const buckets = data?.traffic_over_time?.buckets || []
      if (buckets.length === 0) return { data: [], statuses: [] }

      // 1. 先找出這段時間內「所有出現過」的快取狀態，這一步是為了確保每條線在每個時間點都有數值（即使是 0）
      const allStatuses = new Set<string>();
      buckets.forEach((bucket: any) => {
        const statusBuckets = bucket.filtered_traffic?.statuses?.buckets || [];
        statusBuckets.forEach((sb: any) => allStatuses.add(sb.key));
      });
      const statusesArray = Array.from(allStatuses);

      // 使用與 query 相同的方式解析時間
      const startTime = timeRange ? new Date(timeRange.from).getTime() : 0;
      const endTime = timeRange ? new Date(timeRange.to).getTime() : Infinity;
      
      // 2. 過濾掉完全不在範圍內的 bucket
      const filteredBuckets = buckets.filter((bucket: any) => {
        const bucketStart = bucket.key;
        const bucketEnd = bucket.key + intervalSeconds * 1000;
        return bucketEnd >= startTime && bucketStart <= endTime;
      });

      const chartData = filteredBuckets.map((bucket: any, index: number) => {
        const statusBuckets = bucket.filtered_traffic?.statuses?.buckets || [];
        
        // 先初始化所有已知的狀態為 0，防止線條斷掉
        const statusCounts: Record<string, number> = {};
        statusesArray.forEach(status => {
          statusCounts[status] = 0;
        });
        
        // 再填入實際存在的數值
        statusBuckets.forEach((sb: any) => {
          statusCounts[sb.key] = sb.doc_count;
        });

        // 3. 對首尾資料點的時間進行裁剪
        let bucketTime = bucket.key;
        if (index === 0 && bucketTime < startTime) {
          bucketTime = startTime;
        } else if (index === filteredBuckets.length - 1 && bucketTime > endTime) {
          bucketTime = endTime;
        }

        const date = new Date(bucketTime)
        let timeFormat: Intl.DateTimeFormatOptions  
        if (intervalSeconds <= 300) {
          timeFormat = { hour: '2-digit', minute: '2-digit', hour12: false }
        } else {
          timeFormat = { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }
        }
        
        const fullTimeFormat: Intl.DateTimeFormatOptions = {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }

        return {
          timestamp: bucketTime,
          time: date.toLocaleString('zh-TW', timeFormat),            
          fullTime: date.toLocaleString('zh-TW', fullTimeFormat),    
          ...statusCounts
        }
      })

      return {
        data: chartData,
        statuses: statusesArray
      }
    }, [data, intervalSeconds, timeRange])
}

export function useTopCdnNodes(zones?: string[]) {
  const zoneFilter = useMemo(() => getZoneFilter(zones), [zones])
  
  const { data: topCdnNodesData } = useElasticsearchAggregation(
    'across-cf-logpush-*',
    {
      filtered_cdn_nodes: {
        filter: zoneFilter || { match_all: {} },
        aggs: {
          top_cdn_nodes: {
            terms: {
              field: 'EdgeColoCode.keyword',
              size: 5,
              order: { _count: 'desc' }
            },
            aggs: {
              avg_response_time: {
                avg: { field: 'OriginResponseTime' }
              }
            }
          }
        }
      }
    }
  )

  return useMemo(() => {
    return (topCdnNodesData?.filtered_cdn_nodes?.top_cdn_nodes?.buckets || []).map((bucket: any) => {
      const avgTimeMs = bucket.avg_response_time?.value || 0;

      return {
        name: bucket.key,
        count: bucket.doc_count,
        responseTime: avgTimeMs.toFixed(2) // 回傳 ms 並保留兩位小數
      };
    });
  }, [topCdnNodesData])
}

export function useCdnCacheStatusChart(zones?: string[]) {
  const zoneFilter = useMemo(() => getZoneFilter(zones), [zones])
  
  const { data: cdnCacheStatusData } = useElasticsearchAggregation(
    'across-cf-logpush-*',
    {
      filtered_cdn_cache_status: {
        filter: zoneFilter || { match_all: {} },
        aggs: {
          by_cache_status: {
            terms: {
              field: 'CacheCacheStatus.keyword',
              size: 10,
              order: { _count: 'desc' }
            },
          }
        }
      }
    }
  )

  return useMemo(() => {
    const buckets = cdnCacheStatusData?.filtered_cdn_cache_status?.by_cache_status.buckets || []
    const totalFromBuckets = buckets.reduce((sum: number, b: any) => sum + b.doc_count, 0)
    const colors = ["#3b82f6", "#f97316", "#eab308", "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#6366f1"]
    const topCacheStatus = buckets.map((bucket: any, index: number) => {
      return {
        cache_status: bucket.key,
        count: bucket.doc_count,
        percentage: Math.round((bucket.doc_count / totalFromBuckets) * 10000) / 100,
        color: colors[index % colors.length],
      }
    })
    return topCacheStatus
  }, [cdnCacheStatusData])
}

export function useCdnHttpStatus(zones?: string[]) {
  const zoneFilter = useMemo(() => getZoneFilter(zones), [zones])
  
  const { data: cdnHttpStatusData } = useElasticsearchAggregation(
    'across-cf-logpush-*',
    {
      filtered_cdn_http_status: {
        filter: zoneFilter || { match_all: {} },
        aggs: {
          by_http_status: {
            terms: {
              field: 'CacheResponseStatus',
              size: 10,
              order: { _count: 'desc' }
            },
          }
        }
      }
    }
  )

  return useMemo(() => {
    const buckets = cdnHttpStatusData?.filtered_cdn_http_status?.by_http_status.buckets || []
    const totalFromBuckets = buckets.reduce((sum: number, b: any) => sum + b.doc_count, 0)
    const colors = ["#10b981", "#f59e0b", "#eab308", "#8b5cf6", "#3b82f6", "#8b5cf6", "#f97316", "#ec4899", "#ef4444"]
    const topHttpStatus = buckets.map((bucket: any, index: number) => {
      return {
        http_status: bucket.key,
        count: bucket.doc_count,
        percentage: Math.round((bucket.doc_count / totalFromBuckets) * 10000) / 100,
        color: colors[index % colors.length],
      }
    })
    return topHttpStatus
  }, [cdnHttpStatusData])
}