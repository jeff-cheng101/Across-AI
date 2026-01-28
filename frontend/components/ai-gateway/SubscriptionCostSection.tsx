'use client';

import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
} from 'recharts';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  formatCompactCurrency,
  type ProviderUsageStats,
  type SubscriptionWithTWD,
} from '@/services/ai-gateway';
import { MiniServiceCard } from './MiniServiceCard';

type SubscriptionCostSectionProps = {
  /** LiteLLM API 使用費用統計（按 provider 分組） */
  providerStats: ProviderUsageStats[];
  /** 固定訂閱服務費用 */
  subscriptions: SubscriptionWithTWD[];
  selectedProvider: string;
  onProviderChange?: (provider: string) => void;
};

/**
 * 訂閱服務成本區塊
 *
 * 業務背景：整合顯示兩種費用類型：
 * 1. AI API Key：來自 LiteLLM 的 API 使用費用（providerStats）
 * 2. 訂閱制服務：固定月費訂閱（subscriptions）
 *
 * 資料來源：
 * - providerStats: 後端 /api/gateway/dashboard 回應中的 providerStats
 * - subscriptions: 後端 /api/gateway/dashboard 回應中的 subscriptions
 */

const PROVIDER_COLORS: Record<string, string> = {
  GPT: '#10A37F',
  OpenAI: '#10A37F',
  openai: '#10A37F',
  v0: '#a855f7',
  Cursor: '#06b6d4',
  Gemini: '#3b82f6',
  google: '#3b82f6',
  Claude: '#22d3ee',
  anthropic: '#22d3ee',
  Grok: '#2dd4bf',
  xai: '#2dd4bf',
  訂閱制服務: '#ec4899',
};

// Provider 色票（用於 drill-down 子項目）
const PROVIDER_COLOR_SCHEMES: Record<string, string[]> = {
  GPT: ['#10A37F', '#2AD0A2', '#0D5C49'],
  OpenAI: ['#10A37F', '#2AD0A2', '#0D5C49'],
  openai: ['#10A37F', '#2AD0A2', '#0D5C49'],
  v0: ['#a855f7', '#c084fc', '#e9d5ff'],
  Cursor: ['#06b6d4', '#22d3ee', '#67e8f9'],
  Gemini: ['#3b82f6', '#60a5fa', '#93c5fd'],
  google: ['#3b82f6', '#60a5fa', '#93c5fd'],
  Claude: ['#22d3ee', '#67e8f9', '#a5f3fc'],
  anthropic: ['#22d3ee', '#67e8f9', '#a5f3fc'],
  Grok: ['#2dd4bf', '#5eead4', '#99f6e4'],
  xai: ['#2dd4bf', '#5eead4', '#99f6e4'],
  訂閱制服務: ['#ec4899', '#f59e0b', '#f97316'],
};

/**
 * recharts activeShape callback 的 props Schema
 * recharts 的 activeShape callback 參數類型定義不完整，使用 Zod 驗證
 */
const ActiveShapePropsSchema = z.object({
  cx: z.number(),
  cy: z.number(),
  innerRadius: z.number(),
  outerRadius: z.number(),
  startAngle: z.number(),
  endAngle: z.number(),
  fill: z.string(),
});

type ActiveShapeProps = z.infer<typeof ActiveShapePropsSchema>;

function RenderActiveShape(props: ActiveShapeProps) {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } =
    props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={0.95}
      />
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 2}
        outerRadius={innerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={0.3}
      />
    </g>
  );
}

export function SubscriptionCostSection({
  providerStats,
  subscriptions,
  selectedProvider,
  onProviderChange,
}: SubscriptionCostSectionProps) {
  const [drillDownProvider, setDrillDownProvider] = useState<string | null>(
    null,
  );
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // 處理 providerStats 為 API Key 服務數據
  const apiKeyServices = providerStats.map((stat) => ({
    provider: stat.provider,
    totalCostTWD: stat.totalCostTwd,
    models: stat.models,
  }));

  // 計算訂閱服務總費用（合併為一個「訂閱制服務」項目）
  const subscriptionTotalTWD = subscriptions.reduce(
    (sum, sub) => sum + sub.priceTWD,
    0,
  );

  // 建立完整的服務列表（API Key 服務 + 訂閱制服務合併項）
  type ServiceItem = {
    provider: string;
    totalCostTWD: number;
    isSubscriptionMerged?: boolean;
    subscriptionBreakdown?: Array<{
      name: string;
      costTWD: number;
      color: string;
    }>;
    models?: ProviderUsageStats['models'];
  };

  const allServices: ServiceItem[] = [
    ...apiKeyServices,
    ...(subscriptions.length > 0
      ? [
          {
            provider: '訂閱制服務',
            totalCostTWD: subscriptionTotalTWD,
            isSubscriptionMerged: true,
            subscriptionBreakdown: subscriptions.map((sub, index) => ({
              name: sub.ai_name,
              costTWD: sub.priceTWD,
              color: PROVIDER_COLOR_SCHEMES.訂閱制服務[index % 3],
            })),
          },
        ]
      : []),
  ];

  // 過濾選中的 provider
  const filteredServices =
    selectedProvider === 'all'
      ? allServices
      : allServices.filter(
          (service) =>
            service.provider.toLowerCase() === selectedProvider.toLowerCase(),
        );

  // 計算總成本
  const totalCost = filteredServices.reduce(
    (sum, service) => sum + service.totalCostTWD,
    0,
  );

  // 準備圖表數據
  let chartData: Array<{ name: string; value: number; color: string }> = [];

  if (drillDownProvider) {
    // Drill-down 視圖：顯示該 provider 的子項目（models 或 subscriptionBreakdown）
    const currentService = allServices.find(
      (s) => s.provider === drillDownProvider,
    );
    if (currentService) {
      if (
        currentService.isSubscriptionMerged &&
        currentService.subscriptionBreakdown
      ) {
        // 訂閱制服務的子項目
        chartData = currentService.subscriptionBreakdown.map((item) => ({
          name: item.name,
          value: item.costTWD,
          color: item.color,
        }));
      } else if (currentService.models) {
        // API Key 服務的 models
        const colors = PROVIDER_COLOR_SCHEMES[currentService.provider] || [
          '#10b981',
          '#34d399',
          '#6ee7b7',
        ];
        chartData = currentService.models.map((model, index) => {
          // 簡化 model 名稱：移除 provider prefix（如 "gemini/gemini-2.5-pro" → "gemini-2.5-pro"）
          const simplifiedName = model.modelName.includes('/')
            ? model.modelName.split('/').slice(1).join('/')
            : model.modelName;
          return {
            name: simplifiedName,
            value: model.costTwd,
            color: colors[index % colors.length],
          };
        });
      }
    }
  } else {
    // 主視圖：顯示所有服務
    chartData = filteredServices.map((service) => ({
      name: service.provider,
      value: service.totalCostTWD,
      color: PROVIDER_COLORS[service.provider] || '#10b981',
    }));
  }

  const handlePieClick = (data: { name: string }) => {
    if (!drillDownProvider) {
      // 訂閱制服務不可點擊（右側已條列顯示明細）
      const clickedService = allServices.find((s) => s.provider === data.name);
      if (clickedService?.isSubscriptionMerged) {
        return;
      }
      // API Key 服務可以 drill-down 查看 models
      setDrillDownProvider(data.name);
      setActiveIndex(null);
      onProviderChange?.(clickedService?.provider ?? data.name);
    }
  };

  const handleBack = () => {
    setDrillDownProvider(null);
    setActiveIndex(null);
    onProviderChange?.('all');
  };

  // 準備 Mini Card 數據（分為 API Key 和訂閱制服務）
  const apiKeyCosts = apiKeyServices.map((service) => ({
    provider: service.provider,
    cost: service.totalCostTWD,
    percentage: totalCost > 0 ? (service.totalCostTWD / totalCost) * 100 : 0,
    color: PROVIDER_COLORS[service.provider] || '#10b981',
  }));

  const subscriptionServiceItem = allServices.find(
    (s) => s.isSubscriptionMerged,
  );

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{ name: string; value: number }>;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const displayTotal = drillDownProvider
        ? allServices.find((s) => s.provider === drillDownProvider)
            ?.totalCostTWD || totalCost
        : totalCost;
      return (
        <div className="bg-zinc-800 border border-zinc-700 rounded p-3 shadow-lg">
          <div className="text-white font-medium text-xs mb-1">{data.name}</div>
          <div className="text-cyan-400 font-medium text-sm">
            NT$ {formatCompactCurrency(data.value)}
          </div>
          <div className="text-zinc-400 text-xs">
            {displayTotal > 0
              ? ((data.value / displayTotal) * 100).toFixed(1)
              : '0.0'}
            %
          </div>
        </div>
      );
    }
    return null;
  };

  const displayTotalCost = drillDownProvider
    ? allServices.find((s) => s.provider === drillDownProvider)?.totalCostTWD ||
      0
    : totalCost;

  return (
    <Card className="bg-slate-900/40 border-white/10 rounded">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white text-sm">
          訂閱服務成本
          {drillDownProvider && (
            <span className="text-slate-400 ml-2">- {drillDownProvider}</span>
          )}
        </CardTitle>
        {drillDownProvider && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            className="h-7 px-2 bg-slate-800/50 border-slate-700 hover:bg-slate-700"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            返回
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-3 sm:p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {/* 左側：圓餅圖 */}
          <div className="col-span-1 lg:col-span-4 flex flex-col items-center justify-center py-4 lg:py-0">
            <div className="w-full max-w-[200px] sm:max-w-[220px] md:max-w-[240px] relative font-normal h-[200px] sm:h-[220px] md:h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    onMouseEnter={(_, index) => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                    onClick={(data) => handlePieClick(data)}
                    style={{
                      cursor: drillDownProvider ? 'default' : 'pointer',
                    }}
                    stroke="none"
                    // @ts-expect-error recharts Pie 的 activeIndex 類型定義不完整，但功能正常
                    activeIndex={activeIndex ?? undefined}
                    activeShape={(props: unknown) => {
                      const parsed = ActiveShapePropsSchema.safeParse(props);
                      return parsed.success ? (
                        <RenderActiveShape {...parsed.data} />
                      ) : (
                        <g />
                      );
                    }}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${entry.name}-${index}`}
                        fill={entry.color}
                        stroke="none"
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              {/* 中央文字 */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-slate-400 text-xs mb-1">
                  {drillDownProvider
                    ? `${drillDownProvider} 成本`
                    : '本月總成本'}
                </div>
                <div className="text-white font-bold text-lg sm:text-xl">
                  NT$ {formatCompactCurrency(displayTotalCost)}
                </div>
              </div>
            </div>
            {!drillDownProvider && (
              <div className="text-slate-500 text-xs text-center mt-3">
                點擊區塊查看詳情
              </div>
            )}
          </div>

          {/* 右側：服務清單或詳細列表 */}
          <div className="col-span-1 lg:col-span-8">
            {drillDownProvider ? (
              // Drill-down 視圖：顯示子項目列表
              <div className="space-y-2 sm:space-y-3">
                {chartData.map((item, index) => (
                  <div
                    key={`${item.name}-${index}`}
                    className="flex items-center justify-between p-3 sm:p-4 bg-slate-900/40 rounded-lg"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-white text-xs sm:text-sm truncate">
                        {item.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-6 flex-shrink-0">
                      <span className="text-teal-400 font-normal text-sm sm:text-base">
                        NT$ {formatCompactCurrency(item.value)}
                      </span>
                      <span className="text-slate-400 text-xs sm:text-sm w-12 sm:w-16 text-right">
                        {displayTotalCost > 0
                          ? ((item.value / displayTotalCost) * 100).toFixed(1)
                          : '0.0'}
                        %
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // 主視圖：分區顯示 API Key 和訂閱制服務
              <div className="space-y-4">
                {/* AI API Key 區塊 */}
                {apiKeyCosts.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-slate-400 text-xs">AI API Key</div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
                      {apiKeyCosts.map((service) => (
                        <MiniServiceCard
                          key={service.provider}
                          name={service.provider}
                          cost={service.cost}
                          percentage={service.percentage}
                          color={service.color}
                          onClick={() => {
                            setDrillDownProvider(service.provider);
                            setActiveIndex(null);
                            onProviderChange?.(service.provider);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* 分隔線 */}
                {apiKeyCosts.length > 0 && subscriptionServiceItem && (
                  <div className="border-t border-slate-700" />
                )}

                {/* 訂閱制服務區塊 */}
                {subscriptionServiceItem && (
                  <>
                    <div className="text-slate-400 text-xs">訂閱制服務</div>
                    <div className="flex gap-4">
                      {/* 左側：訂閱制服務總覽小卡片（不可點擊） */}
                      <div className="flex-shrink-0">
                        <MiniServiceCard
                          name={subscriptionServiceItem.provider}
                          cost={subscriptionServiceItem.totalCostTWD}
                          percentage={
                            totalCost > 0
                              ? (subscriptionServiceItem.totalCostTWD /
                                  totalCost) *
                                100
                              : 0
                          }
                          color={
                            PROVIDER_COLORS[subscriptionServiceItem.provider] ||
                            '#ec4899'
                          }
                          disabled
                        />
                      </div>

                      {/* 右側：訂閱明細條列 */}
                      {subscriptionServiceItem.subscriptionBreakdown && (
                        <div className="flex-1 space-y-2 bg-slate-800/30 rounded-lg p-3">
                          {subscriptionServiceItem.subscriptionBreakdown.map(
                            (item) => (
                              <div
                                key={`sub-${item.name}`}
                                className="flex items-center justify-between"
                              >
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                  />
                                  <span className="text-slate-300 text-sm">
                                    {item.name}
                                  </span>
                                </div>
                                <span className="text-slate-400 text-sm font-medium">
                                  NT${' '}
                                  {Math.round(item.costTWD).toLocaleString()}
                                </span>
                              </div>
                            ),
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
