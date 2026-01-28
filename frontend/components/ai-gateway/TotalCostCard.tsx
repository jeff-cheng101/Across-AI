'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DailyCostDetail } from '@/services/ai-gateway';

type TotalCostCardProps = {
  dailyCostDetailed: DailyCostDetail[];
  selectedProvider: string;
};

/**
 * 每日成本統計圖表
 *
 * 業務背景：以堆疊面積圖顯示每日成本趨勢
 * 支援按 provider 過濾
 *
 * 資料來源：後端 /api/gateway/dashboard 回應中的 dailyCostDetailed 陣列
 */

const PROVIDER_COLORS: Record<string, string> = {
  GPT: '#10A37F',
  openai: '#10A37F',
  Claude: '#22d3ee',
  anthropic: '#22d3ee',
  Gemini: '#3b82f6',
  google: '#3b82f6',
  Grok: '#2dd4bf',
  xai: '#2dd4bf',
  Cursor: '#06b6d4',
  v0: '#a855f7',
  固定訂閱組: '#7C3AED',
  變動消耗組: '#14b8a6',
};

export function TotalCostCard({
  dailyCostDetailed,
  selectedProvider,
}: TotalCostCardProps) {
  // 按日期和類型（訂閱/用量）分組數據
  const processChartData = () => {
    const dateMap = new Map<
      string,
      { date: string; fullDate: string; 固定訂閱組: number; 變動消耗組: number }
    >();

    for (const item of dailyCostDetailed) {
      const dateObj = new Date(item.date);
      const formattedDate = `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;

      // 如果選擇了特定 provider，過濾數據
      if (selectedProvider !== 'all') {
        if (
          !item.provider.toLowerCase().includes(selectedProvider.toLowerCase())
        ) {
          continue;
        }
      }

      if (!dateMap.has(item.date)) {
        dateMap.set(item.date, {
          date: formattedDate,
          fullDate: item.date,
          固定訂閱組: 0,
          變動消耗組: 0,
        });
      }

      const entry = dateMap.get(item.date);
      if (entry) {
        // 判斷是訂閱費還是用量費
        if (item.model.includes('用量')) {
          entry.變動消耗組 += item.cost;
        } else {
          entry.固定訂閱組 += item.cost;
        }
      }
    }

    return Array.from(dateMap.values()).sort(
      (a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime(),
    );
  };

  const chartData = processChartData();
  const dataKeys = ['固定訂閱組', '變動消耗組'];

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{
      name: string;
      value: number;
      color: string;
      payload: { date: string };
    }>;
  }) => {
    if (active && payload && payload.length > 0) {
      const sortedPayload = [...payload]
        .filter((p) => p.value > 0)
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

      const total = payload.reduce((sum, item) => sum + (item.value || 0), 0);

      return (
        <div className="bg-zinc-800 border border-zinc-700 rounded p-3 shadow-lg">
          <div className="text-white font-medium text-xs mb-2">
            {payload[0]?.payload?.date}
          </div>
          <div className="space-y-1">
            {sortedPayload.map((item, idx) => (
              <div
                key={`${item.name}-${idx}`}
                className="flex items-center justify-between gap-3 text-[11px]"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-zinc-300">{item.name}</span>
                </div>
                <span className="text-cyan-400 font-medium">
                  NT$ {Math.round(item.value).toLocaleString()}
                </span>
              </div>
            ))}
            <div className="flex justify-between gap-3 text-xs pt-2 border-t border-zinc-700">
              <span className="text-zinc-400">總計</span>
              <span className="text-white font-medium">
                NT$ {Math.round(total).toLocaleString()}
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
        <CardTitle className="text-white text-sm">每日成本統計</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                {dataKeys.map((key) => {
                  const baseColor = PROVIDER_COLORS[key] || '#10b981';

                  return (
                    <linearGradient
                      key={key}
                      id={`area-gradient-${key}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor={baseColor}
                        stopOpacity={0.6}
                      />
                      <stop
                        offset="100%"
                        stopColor={baseColor}
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  );
                })}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis
                dataKey="date"
                stroke="#71717a"
                style={{ fontSize: '11px' }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                stroke="#71717a"
                style={{ fontSize: '11px' }}
                tickFormatter={(value: number) => `${value}`}
              />
              <Tooltip content={<CustomTooltip />} />

              {dataKeys.map((key) => {
                const baseColor = PROVIDER_COLORS[key] || '#10b981';

                return (
                  <Area
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stackId="1"
                    stroke={baseColor}
                    strokeWidth={2}
                    fill={`url(#area-gradient-${key})`}
                  />
                );
              })}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
