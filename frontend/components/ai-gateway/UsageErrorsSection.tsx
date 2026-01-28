'use client';

import { AlertTriangle } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { KpiMetrics, ProviderUsageStats } from '@/services/ai-gateway';
import { InfoTooltip } from './InfoTooltip';

type UsageErrorsSectionProps = {
  kpiMetrics: KpiMetrics;
  providerStats: ProviderUsageStats[];
  selectedProvider?: string;
};

/**
 * 錯誤統計區塊
 *
 * 業務背景：顯示 API 請求的錯誤統計
 * 包含總錯誤數、錯誤比例和按 Provider 分類的錯誤分佈
 *
 * 資料來源：後端 /api/gateway/dashboard 回應中的 kpiMetrics 和 providerStats
 */

export function UsageErrorsSection({
  kpiMetrics,
  providerStats,
  selectedProvider = 'all',
}: UsageErrorsSectionProps) {
  const totalRequests = kpiMetrics.totalRequests;
  const totalErrors = kpiMetrics.failedRequests;
  const errorPercentage =
    totalRequests > 0
      ? ((totalErrors / totalRequests) * 100).toFixed(2)
      : '0.00';

  // 過濾並處理 Provider 統計數據
  const filteredStats =
    selectedProvider === 'all'
      ? providerStats
      : providerStats.filter(
          (stat) =>
            stat.provider.toLowerCase() === selectedProvider.toLowerCase(),
        );

  // 建立錯誤分佈圖表數據（模擬錯誤類型分佈）
  const errorsByProvider = filteredStats.map((stat) => {
    const totalFailed = stat.failedRequests;
    // 模擬錯誤類型分佈
    return {
      service: stat.provider,
      error400: Math.round(totalFailed * 0.6),
      error500: Math.round(totalFailed * 0.15),
      error429: Math.round(totalFailed * 0.25),
    };
  });

  return (
    <div className="space-y-3">
      <div className="bg-slate-900/40 border border-white/10 rounded p-4 h-[300px] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white mb-1 text-[14px] flex items-center">
              失敗請求的總數與比例
              <span className="ml-2">
                <InfoTooltip text="All Errors Over Time" />
              </span>
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl text-white text-[20px]">
                {totalErrors.toLocaleString()}
              </span>
              <span className="text-sm text-zinc-400 text-[12px]">
                / {errorPercentage}%
              </span>
            </div>
          </div>
          <div className="p-2 bg-red-500/10 rounded">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
        </div>

        <div className="flex-1 min-h-0 w-full">
          {errorsByProvider.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={errorsByProvider}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                barSize={12}
                barCategoryGap="15%"
                barGap={4}
              >
                <defs>
                  <linearGradient id="gradient400" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#dc2626" stopOpacity={0.7} />
                  </linearGradient>
                  <linearGradient id="gradient500" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#ea580c" stopOpacity={0.7} />
                  </linearGradient>
                  <linearGradient id="gradient429" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#27272a"
                  opacity={0.3}
                />
                <XAxis
                  dataKey="service"
                  stroke="#71717a"
                  style={{ fontSize: '11px' }}
                  tickLine={false}
                />
                <YAxis
                  stroke="#71717a"
                  style={{ fontSize: '11px' }}
                  tickLine={false}
                  domain={[0, 'auto']}
                  allowDataOverflow={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    border: '1px solid #27272a',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Bar
                  dataKey="error400"
                  fill="url(#gradient400)"
                  name="Error 400"
                />
                <Bar
                  dataKey="error500"
                  fill="url(#gradient500)"
                  name="Error 500"
                />
                <Bar
                  dataKey="error429"
                  fill="url(#gradient429)"
                  name="Error 429"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400">
              暫無錯誤數據
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
