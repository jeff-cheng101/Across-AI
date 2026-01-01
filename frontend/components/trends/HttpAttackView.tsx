'use client';

import { ListChecks, Sparkles } from 'lucide-react';
import { AttackTrendChart } from '@/components/trends/AttackTrendChart';
import { KPICard } from '@/components/trends/KPICard';
import { TopAnalysisTable } from '@/components/trends/TopAnalysisTable';
import { TrafficPercentageCard } from '@/components/trends/TrafficPercentageCard';
import type { DashboardData } from '@/utils/trend-mockData';

interface HttpAttackViewProps {
  data: DashboardData;
}

export function HttpAttackView({ data }: HttpAttackViewProps) {
  const requestsChange =
    ((data.totalRequests - data.previousRequests) / data.previousRequests) *
    100;

  const trafficChange =
    ((data.trafficPercentage - data.previousTrafficPercentage) /
      data.previousTrafficPercentage) *
    100;

  const blockRate = (data.blockedRequests / data.totalRequests) * 100;
  const previousBlockRate =
    (data.previousBlockedRequests / data.previousRequests) * 100;
  const blockRateChange =
    ((blockRate - previousBlockRate) / previousBlockRate) * 100;

  return (
    <>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard
          title="攻擊活動量"
          subtitle="Attack Requests"
          value={data.totalRequests}
          change={requestsChange}
        />
        <TrafficPercentageCard
          percentage={data.trafficPercentage}
          change={trafficChange}
        />
        <KPICard
          title="封鎖率"
          subtitle="Block Rate"
          value={`${blockRate.toFixed(1)}%`}
          change={blockRateChange}
        />
      </div>

      {/* Trend Chart */}
      <AttackTrendChart data={data.trendData} />

      {/* HTTP Traffic Analysis Metrics */}
      <div className="card-dark rounded-xl p-5 border border-slate-700/50">
        <h2 className="text-white text-lg mb-4">HTTP 流量分析記錄</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 divide-x divide-slate-700/50">
          {[
            {
              label: '要求',
              metric: data.trafficMetrics.requests,
            },
            {
              label: '資料傳送',
              metric: data.trafficMetrics.dataTransfer,
            },
            {
              label: '點閱率',
              metric: data.trafficMetrics.visitRate,
            },
            {
              label: '造訪次數',
              metric: data.trafficMetrics.visits,
            },
          ].map((item, _index) => (
            <div key={item.label} className="px-4 py-2">
              <div className="text-xs text-slate-400 mb-2">{item.label}</div>
              <div className="flex items-baseline gap-2">
                <div className="text-xl text-white">{item.metric.value}</div>
                <div
                  className={`flex items-center gap-0.5 ${
                    item.metric.change > 0
                      ? 'text-red-400'
                      : item.metric.change < 0
                        ? 'text-green-400'
                        : 'text-slate-400'
                  }`}
                >
                  {item.metric.change > 0
                    ? '↑'
                    : item.metric.change < 0
                      ? '↓'
                      : ''}
                  <span className="text-xs font-medium">
                    {Math.abs(item.metric.change).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top 5 Analysis Tables */}
      <div className="space-y-5">
        <h2 className="text-white flex items-center gap-2 text-lg">
          熱門 HTTP 攻擊活動 Top 5 分析
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TopAnalysisTable title="來源 IP 位址 (Top 5)" data={data.topIPs} />
          <TopAnalysisTable title="觸發規則 (Top 5)" data={data.topRules} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TopAnalysisTable title="主機 (Top 5)" data={data.topHosts} />
          <TopAnalysisTable title="路徑 (Top 5)" data={data.topPaths} />
        </div>

        <TopAnalysisTable
          title="國家 (Top 5)"
          data={data.topCountries}
          showFlag
        />
      </div>

      {/* AI Summary */}
      <div className="card-dark rounded-xl p-6 border border-blue-500/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="gradient-blue-bright p-2 rounded-lg glow-blue-subtle">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-blue-400 text-lg">AI 總結</h2>
        </div>
        <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/30">
          <p className="text-slate-300 leading-relaxed text-[14px] font-normal">
            {data.aiSummary}
          </p>
        </div>
      </div>

      {/* Next Step Recommendations */}
      <div className="card-dark rounded-xl p-6 border border-emerald-500/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-lg shadow-lg shadow-emerald-500/20">
            <ListChecks className="w-5 h-5 text-white" />
          </div>
          <h2 className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent text-lg">
            下一步建議
          </h2>
        </div>
        <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/30">
          <ul className="space-y-3">
            {data.nextStepRecommendations.map((recommendation, index) => (
              <li
                key={`${index}-${recommendation}`}
                className="flex items-start gap-3 text-slate-300"
              >
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs mt-0.5">
                  {index + 1}
                </span>
                <span className="leading-relaxed text-[14px]">
                  {recommendation}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
