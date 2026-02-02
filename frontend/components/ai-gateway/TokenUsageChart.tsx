'use client';

import { Activity } from 'lucide-react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DailyUsageStats, TokenUsageTrend } from '@/services/ai-gateway';
import { InfoTooltip } from './InfoTooltip';

type TokenUsageChartProps = {
  tokenUsageTrend: TokenUsageTrend[];
  dailyUsageStats?: DailyUsageStats[];
  selectedProvider?: string;
};

/**
 * Token 使用趨勢圖表
 *
 * 業務背景：以折線圖顯示每日 Token 使用量趨勢
 * 包含 Input、Output 和 Total Tokens 三條線
 *
 * 資料來源：後端 /api/gateway/dashboard 回應中的 tokenUsageTrend 陣列
 */

export function TokenUsageChart({
  tokenUsageTrend,
  dailyUsageStats = [],
  selectedProvider = 'all',
}: TokenUsageChartProps) {
  // 格式化圖表數據（根據 selectedProvider 過濾）
  const chartData =
    selectedProvider === 'all'
      ? // 顯示全部：使用 tokenUsageTrend
        tokenUsageTrend.map((item) => {
          const dateObj = new Date(item.date);
          return {
            date: `${dateObj.getMonth() + 1}/${dateObj.getDate()}`,
            promptTokens: item.inputTokens,
            completionTokens: item.outputTokens,
            totalTokens: item.totalTokens,
          };
        })
      : // 過濾特定 provider：從 dailyUsageStats.providerBreakdown 取得
        dailyUsageStats
          .map((day) => {
            const dateObj = new Date(day.date);
            const providerData = Object.entries(day.providerBreakdown).find(
              ([provider]) =>
                provider.toLowerCase() === selectedProvider.toLowerCase(),
            );
            if (!providerData) return null;
            const [, data] = providerData;
            return {
              date: `${dateObj.getMonth() + 1}/${dateObj.getDate()}`,
              promptTokens: data.inputTokens,
              completionTokens: data.outputTokens,
              totalTokens: data.tokens,
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
      const promptData = payload.find((p) => p.dataKey === 'promptTokens');
      const completionData = payload.find(
        (p) => p.dataKey === 'completionTokens',
      );
      const totalData = payload.find((p) => p.dataKey === 'totalTokens');

      return (
        <div className="bg-zinc-800 border border-zinc-700 rounded p-3 shadow-lg">
          <div className="text-white font-medium text-xs mb-2">{label}</div>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-3 text-[11px]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400" />
                <span className="text-zinc-300">輸入 (Prompt)</span>
              </div>
              <span className="text-cyan-400 font-medium">
                {promptData?.value?.toLocaleString() || 0}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 text-[11px]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-400" />
                <span className="text-zinc-300">輸出 (Completion)</span>
              </div>
              <span className="text-purple-400 font-medium">
                {completionData?.value?.toLocaleString() || 0}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-zinc-700 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-teal-400" />
                <span className="text-zinc-400">Total Tokens</span>
              </div>
              <span className="text-white font-medium">
                {totalData?.value?.toLocaleString() || 0}
              </span>
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
            <CardTitle className="text-white text-sm">Token 使用趨勢</CardTitle>
            <InfoTooltip content="顯示每日輸入 (Prompt)、輸出 (Completion) 及總 Token 使用量趨勢。" />
          </div>
          <div className="p-2 bg-purple-500/10 rounded">
            <Activity className="w-5 h-5 text-purple-400" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
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
                tickFormatter={(value: number) =>
                  `${(value / 1000000).toFixed(0)}M`
                }
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '20px', fontSize: '10px' }}
                iconType="line"
                formatter={(value: string) => {
                  if (value === 'promptTokens') return '輸入 (Prompt Tokens)';
                  if (value === 'completionTokens')
                    return '輸出 (Completion Tokens)';
                  if (value === 'totalTokens') return 'Total Tokens';
                  return value;
                }}
              />
              <Line
                type="monotone"
                dataKey="promptTokens"
                stroke="#22d3ee"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="completionTokens"
                stroke="#a78bfa"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="totalTokens"
                stroke="#14b8a6"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 5 }}
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[350px] flex items-center justify-center text-slate-400">
            暫無 Token 使用數據
          </div>
        )}
      </CardContent>
    </Card>
  );
}
