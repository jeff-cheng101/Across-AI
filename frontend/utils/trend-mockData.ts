export type TimeRange = '1h' | '6h' | '1d' | '1w' | '1m';

export interface TrendDataPoint {
  time: string;
  current: number;
  previous: number;
}

export interface TrafficMetric {
  quantity: string;
  change: number;
}

export interface TopItem {
  rank: number; // 添加 rank 字段來顯示排名
  name: string;
  cnt: number;
  percentage: number;
  change: number;
}

export interface DashboardData {
  // KPI - 直接使用 API 的結構
  totalAttack: { quantity: number; change: number };
  httpPct: { quantity: number; change: number };
  lockdownRate: { quantity: number; change: number };
  // 趨勢圖
  trendData: TrendDataPoint[];
  // 流量指標
  trafficMetrics: {
    requests: TrafficMetric;
    dataTransfer: TrafficMetric;
    visitRate: TrafficMetric;
    visits: TrafficMetric;
  };
  // Top 5 列表
  topIPs: TopItem[];
  topRules: TopItem[];
  topHosts: TopItem[];
  topPaths: TopItem[];
  topCountries: TopItem[];
}

export function generateMockData(timeRange: TimeRange): DashboardData {
  const multipliers: Record<TimeRange, number> = {
    '1h': 1,
    '6h': 6,
    '1d': 24,
    '1w': 168,
    '1m': 720,
  };

  const multiplier = multipliers[timeRange];
  const baseRequests = 15842 * multiplier;
  const baseBlocked = 15320 * multiplier;

  // Generate trend data
  const trendData: TrendDataPoint[] = [];
  const dataPoints =
    timeRange === '1h'
      ? 12
      : timeRange === '6h'
        ? 12
        : timeRange === '1d'
          ? 24
          : timeRange === '1w'
            ? 7
            : 30;

  for (let i = 0; i < dataPoints; i++) {
    const timeLabel =
      timeRange === '1w'
        ? `Day ${i + 1}`
        : timeRange === '1m'
          ? `Day ${i + 1}`
          : `${i * (24 / dataPoints)}:00`;
    trendData.push({
      time: timeLabel,
      current: Math.floor(Math.random() * 2000 + 1000) * multiplier,
      previous: Math.floor(Math.random() * 1800 + 900) * multiplier,
    });
  }

  return {
    // KPI - 使用新結構
    totalAttack: { quantity: baseRequests, change: 17.6 },
    httpPct: { quantity: 68.5, change: 9.9 },
    lockdownRate: { quantity: 96.7, change: 5.3 },
    trendData,
    trafficMetrics: {
      requests: { quantity: '1.2M', change: 15.3 },
      dataTransfer: { quantity: '450 GB', change: -8.2 },
      visitRate: { quantity: '85.3%', change: 3.5 },
      visits: { quantity: '982K', change: 12.8 },
    },
    topIPs: [
      {
        rank: 1,
        name: '192.168.1.100',
        cnt: 8520,
        percentage: 18.5,
        change: 25.3,
      },
      {
        rank: 2,
        name: '10.0.0.45',
        cnt: 7230,
        percentage: 15.7,
        change: 18.2,
      },
      {
        rank: 3,
        name: '172.16.0.88',
        cnt: 6840,
        percentage: 14.9,
        change: 12.5,
      },
      {
        rank: 4,
        name: '203.0.113.42',
        cnt: 5420,
        percentage: 11.8,
        change: -8.3,
      },
      {
        rank: 5,
        name: '198.51.100.23',
        cnt: 4180,
        percentage: 9.1,
        change: 15.7,
      },
    ],
    topRules: [
      {
        rank: 1,
        name: 'SQL Injection',
        cnt: 12450,
        percentage: 27.1,
        change: 32.5,
      },
      {
        rank: 2,
        name: 'XSS Attack',
        cnt: 9820,
        percentage: 21.4,
        change: 18.9,
      },
      {
        rank: 3,
        name: 'Path Traversal',
        cnt: 7650,
        percentage: 16.6,
        change: 25.3,
      },
      {
        rank: 4,
        name: 'Command Injection',
        cnt: 6230,
        percentage: 13.5,
        change: -12.8,
      },
      { rank: 5, name: 'CSRF', cnt: 4890, percentage: 10.6, change: 8.7 },
    ],
    topHosts: [
      {
        rank: 1,
        name: 'api.example.com',
        cnt: 18520,
        percentage: 32.5,
        change: 28.3,
      },
      {
        rank: 2,
        name: 'www.example.com',
        cnt: 15230,
        percentage: 26.7,
        change: 15.8,
      },
      {
        rank: 3,
        name: 'admin.example.com',
        cnt: 8940,
        percentage: 15.7,
        change: 42.5,
      },
      {
        rank: 4,
        name: 'cdn.example.com',
        cnt: 6720,
        percentage: 11.8,
        change: -5.2,
      },
      {
        rank: 5,
        name: 'app.example.com',
        cnt: 5180,
        percentage: 9.1,
        change: 18.9,
      },
    ],
    topPaths: [
      {
        rank: 1,
        name: '/api/login',
        cnt: 22350,
        percentage: 38.2,
        change: 45.7,
      },
      {
        rank: 2,
        name: '/admin/dashboard',
        cnt: 12840,
        percentage: 21.9,
        change: 32.5,
      },
      {
        rank: 3,
        name: '/api/search',
        cnt: 9520,
        percentage: 16.3,
        change: 18.2,
      },
      {
        rank: 4,
        name: '/user/profile',
        cnt: 6230,
        percentage: 10.7,
        change: -8.5,
      },
      {
        rank: 5,
        name: '/public/assets',
        cnt: 4180,
        percentage: 7.1,
        change: 12.3,
      },
    ],
    topCountries: [
      {
        rank: 1,
        name: '中國',
        cnt: 28520,
        percentage: 42.5,
        change: 35.8,
      },
      {
        rank: 2,
        name: '俄羅斯',
        cnt: 18230,
        percentage: 27.2,
        change: 28.5,
      },
      {
        rank: 3,
        name: '美國',
        cnt: 9840,
        percentage: 14.7,
        change: 12.3,
      },
      {
        rank: 4,
        name: '巴西',
        cnt: 5420,
        percentage: 8.1,
        change: 18.9,
      },
      {
        rank: 5,
        name: '印度',
        cnt: 3280,
        percentage: 4.9,
        change: -5.2,
      },
    ],
  };
}
