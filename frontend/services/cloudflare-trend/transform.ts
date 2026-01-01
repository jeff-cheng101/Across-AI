import type {
  DashboardData,
  TopItem,
  TimeRange as UITimeRange,
} from '@/utils/trend-mockData';
import type {
  CloudflareTrendRequest,
  CloudflareTrendResponse,
  CountryItem,
  HostItem,
  PathItem,
  SourceIPItem,
  TrendItem,
  TriggerRuleItem,
} from './type';

/**
 * 前端 TimeRange 到服務層 TimeRange 的 mapping
 * 前端使用 '1w' 和 '1m' 這種較直觀的格式
 * 服務層使用 '7d' 和 '30d' 這種精確天數格式
 */
const TIME_RANGE_MAPPING: Record<
  UITimeRange,
  CloudflareTrendRequest['timeRange']
> = {
  '1h': '1h',
  '6h': '6h',
  '1d': '1d',
  '1w': '7d',
  '1m': '30d',
};

/**
 * 將前端 TimeRange 轉換為服務層 TimeRange
 * @param uiTimeRange 前端使用的時間範圍格式
 * @returns 服務層使用的時間範圍格式
 */
export function mapTimeRangeToApi(
  uiTimeRange: UITimeRange,
): CloudflareTrendRequest['timeRange'] {
  return TIME_RANGE_MAPPING[uiTimeRange];
}

/**
 * 計算總數以計算百分比
 */
function calculatePercentage(count: number, total: number): number {
  if (total === 0) return 0;
  return Number(((count / total) * 100).toFixed(1));
}

/**
 * 將 SourceIPItem 陣列轉換為 TopItem 陣列
 */
function transformSourceIPs(items: SourceIPItem[], total: number): TopItem[] {
  return [...items]
    .sort((a, b) => b.cnt - a.cnt)
    .slice(0, 5)
    .map((item, index) => ({
      rank: index + 1,
      name: item.ClientIP,
      cnt: item.cnt,
      percentage: calculatePercentage(item.cnt, total),
      change: item.change,
    }));
}

/**
 * 將 TriggerRuleItem 陣列轉換為 TopItem 陣列
 */
function transformTriggerRules(
  items: TriggerRuleItem[],
  total: number,
): TopItem[] {
  return [...items]
    .sort((a, b) => b.cnt - a.cnt)
    .slice(0, 5)
    .map((item, index) => ({
      rank: index + 1,
      name: item.SecurityRuleDescription,
      cnt: item.cnt,
      percentage: calculatePercentage(item.cnt, total),
      change: item.change,
    }));
}

/**
 * 將 HostItem 陣列轉換為 TopItem 陣列
 */
function transformHosts(items: HostItem[], total: number): TopItem[] {
  return [...items]
    .sort((a, b) => b.cnt - a.cnt)
    .slice(0, 5)
    .map((item, index) => ({
      rank: index + 1,
      name: item.ClientRequestHost,
      cnt: item.cnt,
      percentage: calculatePercentage(item.cnt, total),
      change: item.change,
    }));
}

/**
 * 將 PathItem 陣列轉換為 TopItem 陣列
 */
function transformPaths(items: PathItem[], total: number): TopItem[] {
  return [...items]
    .sort((a, b) => b.cnt - a.cnt)
    .slice(0, 5)
    .map((item, index) => ({
      rank: index + 1,
      name: item.ClientRequestPath,
      cnt: item.cnt,
      percentage: calculatePercentage(item.cnt, total),
      change: item.change,
    }));
}

/**
 * 將 CountryItem 陣列轉換為 TopItem 陣列
 */
function transformCountries(items: CountryItem[], total: number): TopItem[] {
  return [...items]
    .sort((a, b) => b.cnt - a.cnt)
    .slice(0, 5)
    .map((item, index) => ({
      rank: index + 1,
      name: item['geoip.geo.country_name'],
      cnt: item.cnt,
      percentage: calculatePercentage(item.cnt, total),
      change: item.change,
    }));
}

/**
 * 將趨勢數據轉換為圖表格式
 * 合併 currentAttackTrend 和 previousAttackTrend
 */
function transformTrendData(
  currentTrend: TrendItem[],
  previousTrend: TrendItem[],
): DashboardData['trendData'] {
  // 以 current trend 為基準，對應 previous trend
  return currentTrend.map((item, index) => {
    // 從 ISO 8601 時間戳提取可讀時間
    const date = new Date(item.hour);
    const timeLabel = `${date.getHours()}:00`;

    return {
      time: timeLabel,
      current: item.count,
      previous: previousTrend[index]?.count ?? 0,
    };
  });
}

/**
 * 將 CloudflareTrendResponse 轉換為 DashboardData
 * @param response API 回應
 * @returns 頁面組件使用的數據格式
 */
export function transformToDashboardData(
  response: CloudflareTrendResponse,
): DashboardData {
  // 計算 Top 列表的總數（用於百分比計算）
  const totalIPs = response.sourceIP.reduce((sum, item) => sum + item.cnt, 0);
  const totalRules = response.triggerRule.reduce(
    (sum, item) => sum + item.cnt,
    0,
  );
  const totalHosts = response.hosts.reduce((sum, item) => sum + item.cnt, 0);
  const totalPaths = response.path.reduce((sum, item) => sum + item.cnt, 0);
  const totalCountries = response.country.reduce(
    (sum, item) => sum + item.cnt,
    0,
  );

  return {
    // KPI - 直接使用 API 結構
    totalAttack: response.totalAttack,
    httpPct: response.httpPct,
    lockdownRate: response.lockdownRate,
    // 趨勢圖
    trendData: transformTrendData(
      response.currentAttackTrend,
      response.previousAttackTrend,
    ),
    // 流量指標
    trafficMetrics: {
      requests: response.httpVolume,
      dataTransfer: response.dataVolume,
      visitRate: response.pageView,
      visits: response.visits,
    },
    // Top 5 列表
    topIPs: transformSourceIPs(response.sourceIP, totalIPs),
    topRules: transformTriggerRules(response.triggerRule, totalRules),
    topHosts: transformHosts(response.hosts, totalHosts),
    topPaths: transformPaths(response.path, totalPaths),
    topCountries: transformCountries(response.country, totalCountries),
  };
}
