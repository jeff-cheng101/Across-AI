'use client';

import { useQuery } from '@tanstack/react-query';
import { AlertCircle, DollarSign } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  ApiKeysCostCard,
  BudgetGauge,
  RequestsPerDayChart,
  SubscriptionCostSection,
  TimeRangeFilter,
  TokenUsageChart,
  TopServicesByUsage,
  TotalCostCard,
  UsageErrorsSection,
} from '@/components/ai-gateway';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  type DashboardQueryParams,
  fetchAIGatewayDashboard,
  formatCurrencyTWD,
  formatCurrencyTWDPrecise,
  formatNumber,
} from '@/services/ai-gateway';

/**
 * AI Gateway 儀表板頁面
 *
 * 業務背景：整合 LiteLLM 使用量統計與訂閱費用，提供 AI 服務成本監控。
 *
 * 資料流：前端 useQuery → fetchAIGatewayDashboard → backendClient → Node.js 後端 → LiteLLM API
 *
 * 邊界條件：
 * - 時間範圍預設 30 天
 * - LiteLLM 未配置時顯示空統計，但訂閱數據仍會顯示
 * - 支援按 provider 過濾
 */
export default function AIGatewayPage() {
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<number>(30);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  // 計算查詢參數（不包含 provider，provider 過濾在前端進行）
  const queryParams = useMemo<DashboardQueryParams>(() => {
    if (dateRange.from && dateRange.to) {
      return {
        startDate: dateRange.from.toISOString().split('T')[0],
        endDate: dateRange.to.toISOString().split('T')[0],
      };
    }
    return {
      days: timeRange,
    };
  }, [timeRange, dateRange]);

  // 獲取儀表板數據
  const {
    data: dashboardData,
    isLoading: isLoadingDashboardData,
    error: dashboardError,
    refetch: refetchDashboardData,
  } = useQuery({
    queryKey: [
      'ai-gateway-dashboard',
      queryParams.days,
      queryParams.startDate,
      queryParams.endDate,
    ],
    queryFn: () => fetchAIGatewayDashboard(queryParams),
    staleTime: 0, // 每次參數變更都重新請求
    refetchOnWindowFocus: false,
  });

  // 處理時間範圍變更
  const handleTimeRangeChange = (days: number) => {
    setTimeRange(days);
  };

  // 處理日期範圍變更
  const handleDateRangeChange = (range: {
    from: Date | undefined;
    to: Date | undefined;
  }) => {
    setDateRange(range);
  };

  // 處理 Provider 變更
  const handleProviderChange = (provider: string) => {
    setSelectedProvider(provider);
  };

  // 判斷是否有數據
  const hasData =
    dashboardData &&
    (dashboardData.subscriptions.length > 0 ||
      dashboardData.providerStats.length > 0);

  // 取得 KPI 數據（根據 selectedProvider 重新計算）
  const kpiMetrics = useMemo(() => {
    const defaultKpi = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      totalTokens: 0,
      totalInputTokens: 0,
      totalOutputTokens: 0,
      totalSpendUsd: 0,
      totalSpendTwd: 0,
      avgTokensPerRequest: 0,
      avgCostPerRequest: 0,
    };

    if (!dashboardData) return defaultKpi;

    // 如果沒有選擇特定 provider，使用原始 KPI 數據
    if (selectedProvider === 'all') {
      return dashboardData.kpiMetrics ?? defaultKpi;
    }

    // 根據 providerStats 重新計算 KPI（過濾特定 provider）
    const filteredStats = dashboardData.providerStats.filter(
      (p) => p.provider.toLowerCase() === selectedProvider.toLowerCase(),
    );

    if (filteredStats.length === 0) return defaultKpi;

    // 彙總過濾後的數據
    const aggregated = filteredStats.reduce(
      (acc, stat) => {
        acc.totalRequests += stat.totalRequests;
        acc.successfulRequests += stat.successfulRequests;
        acc.failedRequests += stat.failedRequests;
        acc.totalTokens += stat.totalTokens;
        acc.totalCostUsd += stat.totalCostUsd;
        acc.totalCostTwd += stat.totalCostTwd;

        // 從 models 中計算 input/output tokens
        for (const model of stat.models) {
          acc.totalInputTokens += model.inputTokens;
          acc.totalOutputTokens += model.outputTokens;
        }

        return acc;
      },
      {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        totalTokens: 0,
        totalInputTokens: 0,
        totalOutputTokens: 0,
        totalCostUsd: 0,
        totalCostTwd: 0,
      },
    );

    return {
      totalRequests: aggregated.totalRequests,
      successfulRequests: aggregated.successfulRequests,
      failedRequests: aggregated.failedRequests,
      totalTokens: aggregated.totalTokens,
      totalInputTokens: aggregated.totalInputTokens,
      totalOutputTokens: aggregated.totalOutputTokens,
      totalSpendUsd: aggregated.totalCostUsd,
      totalSpendTwd: aggregated.totalCostTwd,
      avgTokensPerRequest:
        aggregated.successfulRequests > 0
          ? aggregated.totalTokens / aggregated.successfulRequests
          : 0,
      avgCostPerRequest:
        aggregated.successfulRequests > 0
          ? aggregated.totalCostUsd / aggregated.successfulRequests
          : 0,
    };
  }, [dashboardData, selectedProvider]);

  // 取得預算數據
  const budget = dashboardData?.budget ?? {
    total: 0,
    used: 0,
    remaining: 0,
    percentage: 0,
  };

  // 載入中狀態
  if (isLoadingDashboardData) {
    return (
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400 mx-auto mb-4" />
            <p className="text-slate-400">載入儀表板數據中...</p>
          </div>
        </div>
      </div>
    );
  }

  // 錯誤狀態
  if (dashboardError) {
    return (
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center justify-center h-[60vh]">
          <Card className="bg-slate-900/40 border-white/10 p-8 max-w-md">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                載入失敗
              </h3>
              <p className="text-slate-400 mb-4">
                {dashboardError instanceof Error
                  ? dashboardError.message
                  : '無法載入儀表板數據'}
              </p>
              <button
                type="button"
                onClick={() => refetchDashboardData()}
                className="px-4 py-2 bg-teal-500/20 text-teal-400 rounded hover:bg-teal-500/30 transition-colors"
              >
                重試
              </button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-4">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl text-white mb-2">數據分析儀表板</h1>
          <p className="text-slate-400">監控 AI Gateway 效能與使用指標</p>
        </div>

        {/* 時間範圍篩選器 */}
        <TimeRangeFilter
          timeRange={timeRange}
          dateRange={dateRange}
          onTimeRangeChange={handleTimeRangeChange}
          onDateRangeChange={handleDateRangeChange}
        />
      </div>

      {/* 訂閱服務成本 & 預算 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* 訂閱服務成本區塊 - 2/3 寬度 */}
        <div className="lg:col-span-2">
          <SubscriptionCostSection
            providerStats={dashboardData?.providerStats ?? []}
            subscriptions={dashboardData?.subscriptions ?? []}
            selectedProvider={selectedProvider}
            onProviderChange={handleProviderChange}
          />
        </div>

        {/* 預算使用儀表 - 1/3 寬度 */}
        <Card className="bg-slate-900/40 border-white/10 rounded">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between text-sm">
              預算消耗進度
              <div className="p-2 bg-teal-500/10 rounded">
                <DollarSign className="w-5 h-5 text-teal-400" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <BudgetGauge
              budgetUsed={budget.used}
              budgetTotal={budget.total}
              budgetPercentage={budget.percentage}
            />
          </CardContent>
        </Card>
      </div>

      {/* 每日成本統計 */}
      <TotalCostCard
        dailyCostDetailed={dashboardData?.dailyCostDetailed ?? []}
        selectedProvider={selectedProvider}
      />

      {/* 使用量統計標題 */}
      <div className="mt-2">
        <h2 className="text-xl font-regular text-white mb-1">使用量統計</h2>
      </div>

      {/* KPI 卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* 總請求數 */}
        <Card className="bg-slate-900/40 border-white/10 rounded">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-slate-400">總請求數</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-white">
              {formatNumber(kpiMetrics.totalRequests)}
            </div>
            <p className="text-xs text-slate-500 mt-1">Total Requests</p>
          </CardContent>
        </Card>

        {/* 總成功請求數 */}
        <Card className="bg-slate-900/40 border-white/10 rounded">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-slate-400">
              總成功請求數
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-white">
              {formatNumber(kpiMetrics.successfulRequests)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Total Successful Requests
            </p>
          </CardContent>
        </Card>

        {/* 總失敗請求數 */}
        <Card className="bg-slate-900/40 border-white/10 rounded">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-slate-400">
              總失敗請求數
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-red-400">
              {formatNumber(kpiMetrics.failedRequests)}
            </div>
            <p className="text-xs text-slate-500 mt-1">Total Failed Requests</p>
          </CardContent>
        </Card>

        {/* 總 Token 數 */}
        <Card className="bg-slate-900/40 border-white/10 rounded">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-slate-400">
              總 Token 數
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-white">
              {formatNumber(kpiMetrics.totalTokens)}
            </div>
            <p className="text-xs text-slate-500 mt-1">Total Tokens</p>
            <div className="mt-2 pt-2 border-t border-slate-700">
              <p className="text-xs text-slate-400 mb-1">
                Input:{' '}
                <span className="text-cyan-400 font-medium">
                  {formatNumber(kpiMetrics.totalInputTokens)}
                </span>{' '}
                | Output:{' '}
                <span className="text-purple-400 font-medium">
                  {formatNumber(kpiMetrics.totalOutputTokens)}
                </span>
              </p>
              <p className="text-xs text-slate-400">平均每次請求</p>
              <p className="text-sm text-teal-400 font-medium">
                {formatNumber(kpiMetrics.avgTokensPerRequest)} tokens
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 總花費 */}
        <Card className="bg-slate-900/40 border-white/10 rounded">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-slate-400">總花費</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-white">
              {formatCurrencyTWD(kpiMetrics.totalSpendTwd)}
            </div>
            <p className="text-xs text-slate-500 mt-1">Total Spend</p>
            <div className="mt-2 pt-2 border-t border-slate-700">
              <p className="text-xs text-slate-400">平均單次成功請求成本</p>
              <p className="text-sm text-teal-400 font-medium">
                {formatCurrencyTWDPrecise(
                  kpiMetrics.avgCostPerRequest *
                    (dashboardData?.metadata?.exchangeRate ?? 32),
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 服務用量排名 & API 金鑰費用 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopServicesByUsage
          providerStats={dashboardData?.providerStats ?? []}
          selectedProvider={selectedProvider}
        />
        <ApiKeysCostCard
          apiKeyStats={dashboardData?.apiKeyStats ?? []}
          selectedProvider={selectedProvider}
        />
      </div>

      {/* Token 使用趨勢 & 每日請求數 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TokenUsageChart
          tokenUsageTrend={dashboardData?.tokenUsageTrend ?? []}
          dailyUsageStats={dashboardData?.dailyUsageStats ?? []}
          selectedProvider={selectedProvider}
        />
        <RequestsPerDayChart
          dailyUsageStats={dashboardData?.dailyUsageStats ?? []}
          selectedProvider={selectedProvider}
        />
      </div>

      {/* 模型詳細 Token 數據 - 選擇特定 Provider 時顯示 */}
      {selectedProvider !== 'all' &&
        (() => {
          const providerData = dashboardData?.providerStats?.find(
            (p) =>
              p.provider.toLowerCase() === selectedProvider.toLowerCase(),
          );
          const models = providerData?.models ?? [];

          if (models.length === 0) return null;

          return (
            <Card className="bg-slate-900/40 border-white/10 rounded">
              <CardHeader>
                <CardTitle className="text-white text-sm">
                  {selectedProvider} 模型詳細 Token 數據
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left text-slate-400 pb-3 pr-4">
                          模型名稱
                        </th>
                        <th className="text-right text-slate-400 pb-3 px-4">
                          請求數
                        </th>
                        <th className="text-right text-slate-400 pb-3 px-4">
                          Input Tokens
                        </th>
                        <th className="text-right text-slate-400 pb-3 px-4">
                          Output Tokens
                        </th>
                        <th className="text-right text-slate-400 pb-3 px-4">
                          Total Tokens
                        </th>
                        <th className="text-right text-slate-400 pb-3 pl-4">
                          成本 (NT$)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {models.map((model) => (
                        <tr
                          key={model.modelName}
                          className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
                        >
                          <td className="py-3 pr-4 text-white">
                            {model.modelName}
                          </td>
                          <td className="py-3 px-4 text-right text-slate-300">
                            {formatNumber(model.requests)}
                          </td>
                          <td className="py-3 px-4 text-right text-cyan-400">
                            {formatNumber(model.inputTokens)}
                          </td>
                          <td className="py-3 px-4 text-right text-purple-400">
                            {formatNumber(model.outputTokens)}
                          </td>
                          <td className="py-3 px-4 text-right text-teal-400 font-medium">
                            {formatNumber(model.totalTokens)}
                          </td>
                          <td className="py-3 pl-4 text-right text-orange-400 font-medium">
                            {formatCurrencyTWD(model.costTwd)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          );
        })()}

      {/* 空資料狀態 */}
      {!hasData && (
        <Card className="bg-slate-900/40 border-white/10 rounded p-12">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <AlertCircle className="w-16 h-16 text-slate-500" />
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                暫無數據
              </h3>
              <p className="text-slate-400">
                所選擇的提供商目前沒有可用的數據
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* 錯誤統計區塊 */}
      {hasData && (
        <UsageErrorsSection
          kpiMetrics={kpiMetrics}
          providerStats={dashboardData?.providerStats ?? []}
          selectedProvider={selectedProvider}
        />
      )}
    </div>
  );
}
