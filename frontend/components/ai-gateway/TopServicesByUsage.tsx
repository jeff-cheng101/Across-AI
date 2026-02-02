'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ProviderUsageStats } from '@/services/ai-gateway';

type TopServicesByUsageProps = {
  providerStats: ProviderUsageStats[];
  selectedProvider?: string;
};

/**
 * 各服務用量排名組件
 *
 * 業務背景：依照花費排序顯示各 AI 服務的使用量統計
 * 包含請求數和 Token 數
 *
 * 資料來源：後端 /api/gateway/dashboard 回應中的 providerStats 陣列
 */

export function TopServicesByUsage({
  providerStats,
  selectedProvider = 'all',
}: TopServicesByUsageProps) {
  // 過濾並排序數據
  const filteredStats =
    selectedProvider === 'all'
      ? providerStats
      : providerStats.filter(
          (stat) =>
            stat.provider.toLowerCase() === selectedProvider.toLowerCase(),
        );

  // 按花費排序
  const sortedStats = [...filteredStats].sort(
    (a, b) => b.totalCostTwd - a.totalCostTwd,
  );

  return (
    <Card className="bg-slate-900/40 border-white/10 rounded">
      <CardHeader>
        <CardTitle className="text-white text-sm">
          各服務用量排名 (依花費)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sortedStats.length > 0 ? (
          sortedStats.map((stat, index) => (
            <div
              key={stat.provider}
              className="flex items-center justify-between p-3 bg-slate-800/40 rounded hover:bg-slate-800/60 transition-colors"
            >
              {/* 左側 - 服務名稱 */}
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-slate-700/50 rounded text-slate-300 text-sm font-medium">
                  {index + 1}
                </div>
                <div>
                  <div className="text-white font-medium">{stat.provider}</div>
                  <div className="text-xs text-slate-400">
                    Token-based AI Service
                  </div>
                </div>
              </div>

              {/* 右側 - 統計數據 */}
              <div className="flex items-center gap-6 text-sm">
                <div className="text-right">
                  <div className="text-orange-400 font-medium">
                    NT$ {stat.totalCostTwd.toFixed(2)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-slate-300">
                    {stat.totalRequests.toLocaleString()} requests
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-teal-400">
                    {stat.totalTokens.toLocaleString()} tokens
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-slate-400 py-6">無可用數據</div>
        )}
      </CardContent>
    </Card>
  );
}
