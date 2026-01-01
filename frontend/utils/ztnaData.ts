import type { TimeRange } from './trend-mockData';

export interface ZTNAUser {
  name: string;
  loginCount: number;
  previousLoginCount: number;
  change: number;
  riskScore: number;
}

export interface ZTNABandwidthUser {
  name: string;
  bandwidth: number;
  previousBandwidth: number;
  change: number;
  aboveAverage: boolean;
}

export interface ZTNAApplication {
  name: string;
  type: string;
  accessCount: number;
  previousAccessCount: number;
  change: number;
  hasAnomaly: boolean;
}

export interface ZTNACountry {
  country: string;
  code: string;
  loginCount: number;
  previousLoginCount: number;
  change: number;
  isNew: boolean;
  isRisk: boolean;
}

export interface ZTNAAccessApplication {
  name: string;
  loginCount: number;
  previousLoginCount: number;
  change: number;
  isHighFrequency: boolean;
}

export interface ZTNALicense {
  total: number;
  used: number;
  available: number;
  utilizationRate: number;
  change: number;
}

export interface ZTNATrendDataPoint {
  time: string;
  logins: number;
  bandwidth: number;
}

export interface ZTNAData {
  license: ZTNALicense;
  topUsers: ZTNAUser[];
  topBandwidthUsers: ZTNABandwidthUser[];
  topApplications: ZTNAApplication[];
  topCountries: ZTNACountry[];
  accessApplications: ZTNAAccessApplication[];
  trendData: ZTNATrendDataPoint[];
  executiveSummary: string;
  recommendations: string[];
}

export function generateZTNAData(timeRange: TimeRange): ZTNAData {
  const trendData: ZTNATrendDataPoint[] = [];
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
      logins: Math.floor(Math.random() * 500 + 300),
      bandwidth: Math.floor(Math.random() * 5000 + 2000),
    });
  }

  return {
    license: {
      total: 500,
      used: 387,
      available: 113,
      utilizationRate: 77.4,
      change: 8.5,
    },
    topUsers: [
      {
        name: 'John Chen (john.chen@company.com)',
        loginCount: 245,
        previousLoginCount: 198,
        change: 23.7,
        riskScore: 15,
      },
      {
        name: 'Sarah Wang (sarah.wang@company.com)',
        loginCount: 198,
        previousLoginCount: 175,
        change: 13.1,
        riskScore: 8,
      },
      {
        name: 'Michael Lin (michael.lin@company.com)',
        loginCount: 176,
        previousLoginCount: 165,
        change: 6.7,
        riskScore: 5,
      },
      {
        name: 'Emily Zhang (emily.zhang@company.com)',
        loginCount: 145,
        previousLoginCount: 132,
        change: 9.8,
        riskScore: 22,
      },
      {
        name: 'David Liu (david.liu@company.com)',
        loginCount: 128,
        previousLoginCount: 118,
        change: 8.5,
        riskScore: 12,
      },
    ],
    topBandwidthUsers: [
      {
        name: 'John Chen',
        bandwidth: 125840,
        previousBandwidth: 98520,
        change: 27.7,
        aboveAverage: true,
      },
      {
        name: 'Sarah Wang',
        bandwidth: 98520,
        previousBandwidth: 85230,
        change: 15.6,
        aboveAverage: true,
      },
      {
        name: 'Michael Lin',
        bandwidth: 76320,
        previousBandwidth: 72150,
        change: 5.8,
        aboveAverage: false,
      },
      {
        name: 'Emily Zhang',
        bandwidth: 65480,
        previousBandwidth: 58920,
        change: 11.1,
        aboveAverage: false,
      },
      {
        name: 'David Liu',
        bandwidth: 52340,
        previousBandwidth: 49820,
        change: 5.1,
        aboveAverage: false,
      },
    ],
    topApplications: [
      {
        name: 'Salesforce CRM',
        type: 'SaaS',
        accessCount: 8520,
        previousAccessCount: 7230,
        change: 17.8,
        hasAnomaly: false,
      },
      {
        name: 'Internal ERP',
        type: 'Private',
        accessCount: 6840,
        previousAccessCount: 6320,
        change: 8.2,
        hasAnomaly: false,
      },
      {
        name: 'GitHub Enterprise',
        type: 'SaaS',
        accessCount: 5420,
        previousAccessCount: 4980,
        change: 8.8,
        hasAnomaly: false,
      },
      {
        name: 'AWS Console',
        type: 'Cloud',
        accessCount: 4180,
        previousAccessCount: 3850,
        change: 8.6,
        hasAnomaly: true,
      },
      {
        name: 'Jira Cloud',
        type: 'SaaS',
        accessCount: 3280,
        previousAccessCount: 3120,
        change: 5.1,
        hasAnomaly: false,
      },
    ],
    topCountries: [
      {
        country: '台灣',
        code: 'TW',
        loginCount: 12450,
        previousLoginCount: 10820,
        change: 15.1,
        isNew: false,
        isRisk: false,
      },
      {
        country: '美國',
        code: 'US',
        loginCount: 3280,
        previousLoginCount: 2950,
        change: 11.2,
        isNew: false,
        isRisk: false,
      },
      {
        country: '日本',
        code: 'JP',
        loginCount: 1820,
        previousLoginCount: 1650,
        change: 10.3,
        isNew: false,
        isRisk: false,
      },
      {
        country: '新加坡',
        code: 'SG',
        loginCount: 980,
        previousLoginCount: 850,
        change: 15.3,
        isNew: false,
        isRisk: false,
      },
      {
        country: '中國',
        code: 'CN',
        loginCount: 125,
        previousLoginCount: 0,
        change: 100,
        isNew: true,
        isRisk: true,
      },
    ],
    accessApplications: [
      {
        name: 'HR Portal',
        loginCount: 2850,
        previousLoginCount: 2520,
        change: 13.1,
        isHighFrequency: true,
      },
      {
        name: 'Finance System',
        loginCount: 2120,
        previousLoginCount: 1980,
        change: 7.1,
        isHighFrequency: false,
      },
      {
        name: 'Internal Wiki',
        loginCount: 1680,
        previousLoginCount: 1520,
        change: 10.5,
        isHighFrequency: false,
      },
      {
        name: 'VPN Gateway',
        loginCount: 1420,
        previousLoginCount: 1280,
        change: 10.9,
        isHighFrequency: true,
      },
      {
        name: 'File Server',
        loginCount: 980,
        previousLoginCount: 920,
        change: 6.5,
        isHighFrequency: false,
      },
    ],
    trendData,
    executiveSummary:
      '本期 Zero Trust Network Access 分析顯示，整體使用率穩定增長，License 使用率達到 77.4%，較前期增加 8.5%。使用者登入行為整體正常，但偵測到來自中國的新登入活動需要關注。頻寬使用方面，張三和李四的使用量超出平均值，建議進一步調查是否有異常數據傳輸。應用程式存取模式顯示，AWS Console 出現異常存取行為，需要進行安全審查。',
    recommendations: [
      '審查來自中國的新登入活動，確認是否為合法的業務需求或潛在的安全威脅',
      '調查張三和李四的高頻寬使用情況，檢查是否有大量數據外洩的跡象',
      '針對 AWS Console 的異常存取行為進行深入分析，檢查存取日誌和操作記錄',
      '考慮增加 License 配額以應對持續增長的使用需求，目前使用率已接近 80%',
      '建立更嚴格的地理位置存取控制政策，限制來自高風險國家的存取',
      '對高風險評分使用者（如趙六，風險評分 22）實施額外的多因素認證',
    ],
  };
}
