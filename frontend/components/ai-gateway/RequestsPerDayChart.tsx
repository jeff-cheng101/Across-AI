'use client';

import { CircleDot } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DailyUsageStats } from '@/services/ai-gateway';
import { InfoTooltip } from './InfoTooltip';

type RequestsPerDayChartProps = {
  dailyUsageStats: DailyUsageStats[];
  selectedProvider?: string;
};

/**
 * 每日請求數圖表
 *
 * 業務背景：以堆疊長條圖顯示每日 API 請求數量
 * 區分成功和失敗請求
 *
 * 資料來源：後端 /api/gateway/dashboard 回應中的 dailyUsageStats 陣列
 */

export function RequestsPerDayChart({
  dailyUsageStats,
  selectedProvider = 'all',
}: RequestsPerDayChartProps) {
  // 格式化圖表數據（根據 selectedProvider 過濾）
  const chartData =
    selectedProvider === 'all'
      ? // 顯示全部
        dailyUsageStats.map((item) => {
          const dateObj = new Date(item.date);
          return {
            date: `${dateObj.getMonth() + 1}/${dateObj.getDate()}`,
            successRequests: item.successfulRequests,
            errorRequests: item.failedRequests,
            requests: item.totalRequests,
          };
        })
      : // 過濾特定 provider
        dailyUsageStats
          .map((item) => {
            const dateObj = new Date(item.date);
            const providerData = Object.entries(item.providerBreakdown).find(
              ([provider]) =>
                provider.toLowerCase() === selectedProvider.toLowerCase(),
            );
            if (!providerData) return null;
            const [, data] = providerData;
            return {
              date: `${dateObj.getMonth() + 1}/${dateObj.getDate()}`,
              successRequests: data.successfulRequests,
              errorRequests: data.failedRequests,
              requests: data.requests,
            };
          })
          .filter((item): item is NonNullable<typeof item> => item !== null);

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ dataKey: string; value: number }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      const successRequests =
        payload.find((p) => p.dataKey === 'successRequests')?.value || 0;
      const errorRequests =
        payload.find((p) => p.dataKey === 'errorRequests')?.value || 0;
      const totalRequests = successRequests + errorRequests;
      const successRate =
        totalRequests > 0
          ? ((successRequests / totalRequests) * 100).toFixed(2)
          : '0.00';

      return (
        <div className="bg-zinc-800 border border-zinc-700 rounded p-3 shadow-lg">
          <div className="text-white font-medium text-xs mb-2">{label}</div>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-3 text-[11px]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-teal-400" />
                <span className="text-zinc-300">成功請求</span>
              </div>
              <span className="text-teal-400 font-medium">
                {successRequests.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 text-[11px]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <span className="text-zinc-300">失敗請求</span>
              </div>
              <span className="text-red-400 font-medium">
                {errorRequests.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-zinc-700 text-xs">
              <span className="text-zinc-400">總請求數</span>
              <span className="text-white font-medium">
                {totalRequests.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 text-[11px]">
              <span className="text-zinc-300">成功率</span>
              <span className="text-green-400 font-medium">{successRate}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-slate-900/40 border-white/10 rounded">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-white text-sm">
              每日請求數 (Requests per Day)
            </CardTitle>
            <InfoTooltip content="顯示每日 API 請求總數，包含成功與失敗的請求分佈。" />
          </div>
          <div className="p-2 bg-teal-500/10 rounded">
            <CircleDot className="w-5 h-5 text-teal-400" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="successGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#14b8a6" stopOpacity={1} />
                  <stop offset="100%" stopColor="#0d9488" stopOpacity={0.8} />
                </linearGradient>
                <linearGradient id="errorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f87171" stopOpacity={1} />
                  <stop offset="100%" stopColor="#dc2626" stopOpacity={0.9} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#334155"
                opacity={0.3}
              />
              <XAxis
                dataKey="date"
                stroke="#64748b"
                style={{ fontSize: '10px' }}
                tickLine={false}
              />
              <YAxis
                stroke="#64748b"
                style={{ fontSize: '10px' }}
                tickFormatter={(value: number) => {
                  if (value >= 1000000)
                    return `${(value / 1000000).toFixed(1)}M`;
                  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                  return value.toString();
                }}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '20px', fontSize: '10px' }}
                iconType="circle"
                formatter={(value: string) => {
                  if (value === 'successRequests') return '成功請求';
                  if (value === 'errorRequests') return '失敗請求';
                  return value;
                }}
              />
              <Bar
                dataKey="successRequests"
                stackId="requests"
                fill="url(#successGradient)"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="errorRequests"
                stackId="requests"
                fill="url(#errorGradient)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[350px] flex items-center justify-center text-slate-400">
            暫無請求數據
          </div>
        )}
      </CardContent>
    </Card>
  );
}
