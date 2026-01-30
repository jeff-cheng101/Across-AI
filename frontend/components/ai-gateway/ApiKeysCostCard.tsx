'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  type ApiKeyUsageStats,
  formatCompactCurrency,
} from '@/services/ai-gateway';

type ApiKeysCostCardProps = {
  /** API 金鑰使用統計 */
  apiKeyStats: ApiKeyUsageStats[];
  /** 選擇的 provider，用於過濾金鑰 */
  selectedProvider: string;
};

/**
 * API 金鑰使用費用排名組件
 *
 * 業務背景：顯示各 API 金鑰的費用排名，支援按 provider 過濾
 * 數據來源：LiteLLM API 的 breakdown.providers[provider].api_key_breakdown
 *
 * UI 行為：
 * - 金鑰 ID 和別名使用 CSS truncate 自動適應寬度
 * - 超過 10 行時顯示垂直滾動條
 * - 當選擇特定 provider 時，只顯示使用該 provider 的金鑰
 */
export function ApiKeysCostCard({
  apiKeyStats,
  selectedProvider,
}: ApiKeysCostCardProps) {
  // 根據選擇的 provider 過濾金鑰
  const filteredStats = useMemo(() => {
    if (selectedProvider === 'all') {
      return apiKeyStats;
    }
    return apiKeyStats.filter((stat) =>
      stat.providers.includes(selectedProvider),
    );
  }, [apiKeyStats, selectedProvider]);

  return (
    <Card className="bg-slate-900/40 border-white/10 rounded">
      <CardHeader>
        <CardTitle className="text-white text-sm">金鑰使用費用排名</CardTitle>
      </CardHeader>
      <CardContent>
        {filteredStats.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm table-fixed">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left text-slate-400 pb-3 pr-4 font-medium w-[30%]">
                    金鑰 ID
                  </th>
                  <th className="text-left text-slate-400 pb-3 px-4 font-medium w-[50%]">
                    金鑰別名
                  </th>
                  <th className="text-right text-slate-400 pb-3 pl-4 font-medium w-[20%]">
                    費用
                  </th>
                </tr>
              </thead>
            </table>
            {/* 獨立的可滾動區域，最大高度約 10 行（每行約 44px） */}
            <div className="max-h-[440px] overflow-y-auto">
              <table className="w-full text-sm table-fixed">
                <tbody>
                  {filteredStats.map((keyStats) => (
                    <tr
                      key={keyStats.keyId}
                      className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="py-3 pr-4 w-[30%]">
                        <div
                          className="text-white text-xs font-mono truncate"
                          title={keyStats.keyId}
                        >
                          {keyStats.keyId}
                        </div>
                      </td>
                      <td className="py-3 px-4 w-[50%]">
                        <div
                          className="text-slate-300 truncate"
                          title={keyStats.keyAlias}
                        >
                          {keyStats.keyAlias}
                        </div>
                      </td>
                      <td className="py-3 pl-4 text-right text-orange-400 font-medium w-[20%]">
                        NT$ {formatCompactCurrency(keyStats.costTwd)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center text-slate-400 py-6">無可用數據</div>
        )}
      </CardContent>
    </Card>
  );
}
