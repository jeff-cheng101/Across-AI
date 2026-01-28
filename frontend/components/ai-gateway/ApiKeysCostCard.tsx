'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  type ApiKeyUsageStats,
  formatCompactCurrency,
} from '@/services/ai-gateway';

type ApiKeysCostCardProps = {
  /** API 金鑰使用統計 */
  apiKeyStats: ApiKeyUsageStats[];
};

/**
 * 縮短金鑰 ID 顯示
 * 例如：0afb4e7f-1234-5678... → 0afb4e7...
 */
function truncateKeyId(keyId: string): string {
  if (keyId.length <= 10) return keyId;
  return `${keyId.slice(0, 7)}...`;
}

/**
 * 縮短金鑰別名顯示（最多 30 字元）
 */
function truncateAlias(alias: string): string {
  if (alias.length <= 30) return alias;
  return `${alias.slice(0, 30)}...`;
}

/**
 * API 金鑰使用費用排名組件
 *
 * 業務背景：顯示各 API 金鑰的費用排名
 * 數據來源：LiteLLM API 的 breakdown.api_keys
 */
export function ApiKeysCostCard({ apiKeyStats }: ApiKeysCostCardProps) {
  return (
    <Card className="bg-slate-900/40 border-white/10 rounded">
      <CardHeader>
        <CardTitle className="text-white text-sm">金鑰使用費用排名</CardTitle>
      </CardHeader>
      <CardContent>
        {apiKeyStats.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left text-slate-400 pb-3 pr-4 font-medium">
                    金鑰 ID
                  </th>
                  <th className="text-left text-slate-400 pb-3 px-4 font-medium">
                    金鑰別名
                  </th>
                  <th className="text-right text-slate-400 pb-3 pl-4 font-medium">
                    費用
                  </th>
                </tr>
              </thead>
              <tbody>
                {apiKeyStats.slice(0, 10).map((keyStats) => (
                  <tr
                    key={keyStats.keyId}
                    className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-3 pr-4 text-white text-xs font-mono">
                      {truncateKeyId(keyStats.keyId)}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {truncateAlias(keyStats.keyAlias)}
                    </td>
                    <td className="py-3 pl-4 text-right text-orange-400 font-medium">
                      NT$ {formatCompactCurrency(keyStats.costTwd)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-slate-400 py-6">無可用數據</div>
        )}
      </CardContent>
    </Card>
  );
}
