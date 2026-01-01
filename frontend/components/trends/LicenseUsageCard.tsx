import { Award, TrendingDown, TrendingUp } from 'lucide-react';

interface LicenseData {
  total: number;
  used: number;
  available: number;
  utilizationRate: number;
  change: number;
}

interface LicenseUsageCardProps {
  license: LicenseData;
}

export function LicenseUsageCard({ license }: LicenseUsageCardProps) {
  const total = license?.total ?? 0;
  const used = license?.used ?? 0;
  const available = license?.available ?? 0;
  const utilizationRate = license?.utilizationRate ?? 0;
  const change = license?.change ?? 0;

  const isIncreasing = change > 0;

  return (
    <div className="card-dark rounded-xl p-5 border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-300 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs text-slate-400 mb-1">全域狀態</div>
            <div className="text-[10px] text-slate-500">使用者名額狀態</div>
          </div>
          <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 p-2 rounded-lg">
            <Award className="w-4 h-4 text-cyan-400" />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-2xl font-bold text-white">
                {used.toLocaleString()}
                <span className="text-sm text-slate-400 ml-1">
                  / {total.toLocaleString()}
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-1">已使用 / 總數</div>
            </div>
            <div
              className={`flex items-center gap-1 ${isIncreasing ? 'text-orange-400' : 'text-green-400'}`}
            >
              {isIncreasing ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="text-sm font-semibold">
                {Math.abs(change).toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">使用率</span>
              <span className="text-white font-medium">
                {utilizationRate.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  utilizationRate > 90
                    ? 'bg-gradient-to-r from-red-500 to-orange-500'
                    : utilizationRate > 70
                      ? 'bg-gradient-to-r from-orange-500 to-yellow-500'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                }`}
                style={{ width: `${utilizationRate}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
            <span className="text-xs text-slate-400">未使用</span>
            <span className="text-sm text-green-400 font-medium">
              {available.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
