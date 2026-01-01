export type TimeRange = '1h' | '6h' | '1d' | '1w' | '1m';

export interface TrendDataPoint {
  time: string;
  current: number;
  previous: number;
}

export interface TrafficMetric {
  value: string;
  change: number;
}

export interface TopItem {
  rank: number; // 添加 rank 字段來顯示排名
  name: string;
  count: number;
  percentage: number;
  change: number;
}

export interface DashboardData {
  totalRequests: number;
  previousRequests: number;
  blockedRequests: number;
  previousBlockedRequests: number;
  trafficPercentage: number;
  previousTrafficPercentage: number;
  trendData: TrendDataPoint[];
  trafficMetrics: {
    requests: TrafficMetric;
    dataTransfer: TrafficMetric;
    visitRate: TrafficMetric;
    visits: TrafficMetric;
    apiRequests: TrafficMetric;
  };
  topIPs: TopItem[];
  topRules: TopItem[];
  topHosts: TopItem[];
  topPaths: TopItem[];
  topCountries: (TopItem & { flag: string })[];
  aiSummary: string;
  nextStepRecommendations: string[];
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
    totalRequests: baseRequests,
    previousRequests: Math.floor(baseRequests * 0.85),
    blockedRequests: baseBlocked,
    previousBlockedRequests: Math.floor(baseBlocked * 0.82),
    trafficPercentage: 68.5,
    previousTrafficPercentage: 62.3,
    trendData,
    trafficMetrics: {
      requests: { value: '1.2M', change: 15.3 },
      dataTransfer: { value: '450 GB', change: -8.2 },
      visitRate: { value: '85.3%', change: 3.5 },
      visits: { value: '982K', change: 12.8 },
      apiRequests: { value: '325K', change: -5.2 },
    },
    topIPs: [
      {
        rank: 1,
        name: '192.168.1.100',
        count: 8520,
        percentage: 18.5,
        change: 25.3,
      },
      {
        rank: 2,
        name: '10.0.0.45',
        count: 7230,
        percentage: 15.7,
        change: 18.2,
      },
      {
        rank: 3,
        name: '172.16.0.88',
        count: 6840,
        percentage: 14.9,
        change: 12.5,
      },
      {
        rank: 4,
        name: '203.0.113.42',
        count: 5420,
        percentage: 11.8,
        change: -8.3,
      },
      {
        rank: 5,
        name: '198.51.100.23',
        count: 4180,
        percentage: 9.1,
        change: 15.7,
      },
    ],
    topRules: [
      {
        rank: 1,
        name: 'SQL Injection',
        count: 12450,
        percentage: 27.1,
        change: 32.5,
      },
      {
        rank: 2,
        name: 'XSS Attack',
        count: 9820,
        percentage: 21.4,
        change: 18.9,
      },
      {
        rank: 3,
        name: 'Path Traversal',
        count: 7650,
        percentage: 16.6,
        change: 25.3,
      },
      {
        rank: 4,
        name: 'Command Injection',
        count: 6230,
        percentage: 13.5,
        change: -12.8,
      },
      { rank: 5, name: 'CSRF', count: 4890, percentage: 10.6, change: 8.7 },
    ],
    topHosts: [
      {
        rank: 1,
        name: 'api.example.com',
        count: 18520,
        percentage: 32.5,
        change: 28.3,
      },
      {
        rank: 2,
        name: 'www.example.com',
        count: 15230,
        percentage: 26.7,
        change: 15.8,
      },
      {
        rank: 3,
        name: 'admin.example.com',
        count: 8940,
        percentage: 15.7,
        change: 42.5,
      },
      {
        rank: 4,
        name: 'cdn.example.com',
        count: 6720,
        percentage: 11.8,
        change: -5.2,
      },
      {
        rank: 5,
        name: 'app.example.com',
        count: 5180,
        percentage: 9.1,
        change: 18.9,
      },
    ],
    topPaths: [
      {
        rank: 1,
        name: '/api/login',
        count: 22350,
        percentage: 38.2,
        change: 45.7,
      },
      {
        rank: 2,
        name: '/admin/dashboard',
        count: 12840,
        percentage: 21.9,
        change: 32.5,
      },
      {
        rank: 3,
        name: '/api/search',
        count: 9520,
        percentage: 16.3,
        change: 18.2,
      },
      {
        rank: 4,
        name: '/user/profile',
        count: 6230,
        percentage: 10.7,
        change: -8.5,
      },
      {
        rank: 5,
        name: '/public/assets',
        count: 4180,
        percentage: 7.1,
        change: 12.3,
      },
    ],
    topCountries: [
      {
        rank: 1,
        name: '中國',
        count: 28520,
        percentage: 42.5,
        change: 35.8,
        flag: '🇨🇳',
      },
      {
        rank: 2,
        name: '俄羅斯',
        count: 18230,
        percentage: 27.2,
        change: 28.5,
        flag: '🇷🇺',
      },
      {
        rank: 3,
        name: '美國',
        count: 9840,
        percentage: 14.7,
        change: 12.3,
        flag: '🇺🇸',
      },
      {
        rank: 4,
        name: '巴西',
        count: 5420,
        percentage: 8.1,
        change: 18.9,
        flag: '🇧🇷',
      },
      {
        rank: 5,
        name: '印度',
        count: 3280,
        percentage: 4.9,
        change: -5.2,
        flag: '🇮🇳',
      },
    ],
    aiSummary:
      '根據當前時間段的分析，系統偵測到攻擊活動呈現上升趨勢，主要集中在 SQL 注入和 XSS 攻擊。來源 IP 位址顯示大量流量來自中國和俄羅斯地區。建議立即審查 /api/login 和 /admin/dashboard 路徑的安全設定，並考慮加強這些端點的速率限制和身份驗證機制。系統已自動封鎖大部分惡意請求，但仍需要進一步的人工審核以確保沒有遺漏的威脅。',
    nextStepRecommendations: [
      '針對 SQL 注入攻擊加強輸入驗證和參數化查詢，特別是 /api/login 端點',
      '對來自中國和俄羅斯的流量實施更嚴格的速率限制和額外驗證',
      '審查並更新 XSS 防護規則，確保所有用戶輸入都經過適當的清理',
      '考慮實施多因素認證（MFA）來保護 /admin/dashboard 路徑',
      '建立即時告警機制，當偵測到異常流量模式時立即通知安全團隊',
    ],
  };
}
