import { TrendingDown, TrendingUp } from 'lucide-react';

interface TopAnalysisItem {
  rank: number;
  name: string;
  cnt: number;
  percentage?: number;
  change: number;
}

interface TopAnalysisTableProps {
  title: string;
  data: TopAnalysisItem[];
}

export function TopAnalysisTable({ title, data }: TopAnalysisTableProps) {
  const items = data || [];

  return (
    <div className="card-dark rounded-xl p-4 border border-slate-700/50">
      <h3 className="text-white text-base font-semibold mb-3">{title}</h3>

      <div className="grid grid-cols-[50px_minmax(0,1fr)_110px_90px_50px] gap-3 pb-2 mb-2 border-b border-slate-700/50 px-2">
        <div className="text-slate-400 text-xs">排名</div>
        <div className="text-slate-400 text-xs">項目</div>
        <div className="text-slate-400 text-xs text-right">Requests</div>
        <div className="text-slate-400 text-xs text-right">變化率</div>
        <div className="text-slate-400 text-xs text-center">趨勢</div>
      </div>

      <div className="space-y-1">
        {items.map((item) => {
          const isPositive = (item.change ?? 0) >= 0;
          const changeColor = isPositive ? 'text-red-400' : 'text-green-400';

          return (
            <div
              key={item.rank}
              className="grid grid-cols-[50px_minmax(0,1fr)_110px_90px_50px] gap-3 items-center py-2 px-2 rounded-lg hover:bg-slate-800/30 transition-colors"
            >
              {/* 排名徽章 */}
              <div className="flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                  <span className="text-blue-400 text-xs font-semibold">
                    {item.rank}
                  </span>
                </div>
              </div>

              <div className="text-white text-sm font-medium truncate">
                {item.name}
              </div>

              {/* Requests */}
              <div className="text-slate-200 text-sm font-medium text-right">
                {item.cnt?.toLocaleString() ?? 0}
              </div>

              {/* 變化率 */}
              <div
                className={`text-sm font-semibold text-right ${changeColor}`}
              >
                {isPositive ? '+' : ''}
                {(item.change ?? 0).toFixed(1)}%
              </div>

              {/* 趨勢圖標 */}
              <div className="flex justify-center">
                {isPositive ? (
                  <TrendingUp className="w-4 h-4 text-red-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-green-400" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
