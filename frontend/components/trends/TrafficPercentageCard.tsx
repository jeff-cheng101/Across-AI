import { Activity, ArrowDown, ArrowUp } from 'lucide-react';

interface TrafficPercentageCardProps {
  percentage: number;
  change: number;
}

export function TrafficPercentageCard({
  percentage,
  change,
}: TrafficPercentageCardProps) {
  const isPositive = change > 0;
  const isNeutral = change === 0;

  return (
    <div className="card-dark rounded-xl p-5 border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-xs text-slate-400 mb-1">攻擊流量佔比</div>
            <div className="text-[10px] text-slate-500">Traffic Percentage</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-2 rounded-lg">
            <Activity className="w-4 h-4 text-purple-400" />
          </div>
        </div>

        <div className="flex items-end gap-2 mb-2">
          <div className="text-3xl font-bold text-white">
            {percentage.toFixed(1)}
            <span className="text-lg text-slate-400 ml-1">%</span>
          </div>
          {!isNeutral && (
            <div
              className={`flex items-center gap-1 px-2 py-0.5 rounded ${
                isPositive
                  ? 'bg-red-500/10 text-red-400'
                  : 'bg-green-500/10 text-green-400'
              }`}
            >
              {isPositive ? (
                <ArrowUp className="w-3 h-3" />
              ) : (
                <ArrowDown className="w-3 h-3" />
              )}
              <span className="text-xs font-semibold">
                {Math.abs(change).toFixed(1)}%
              </span>
            </div>
          )}
        </div>

        <div className="text-[10px] text-slate-500">
          相較於上一期間 {isPositive ? '增加' : isNeutral ? '持平' : '減少'}
        </div>
      </div>
    </div>
  );
}
