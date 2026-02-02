'use client';

import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { formatCompactCurrency } from '@/services/ai-gateway';

type MiniServiceCardProps = {
  name: string;
  cost: number;
  percentage: number;
  color: string;
  onClick?: () => void;
  /** 禁用點擊（用於訂閱制服務卡片） */
  disabled?: boolean;
};

/**
 * 訂閱服務小卡片組件
 *
 * 用於在訂閱費用區塊顯示各服務的成本佔比
 * 包含迷你圓餅圖視覺化百分比
 *
 * disabled 時不可點擊，用於訂閱制服務（已在右側條列顯示明細）
 */
export function MiniServiceCard({
  name,
  cost,
  percentage,
  color,
  onClick,
  disabled = false,
}: MiniServiceCardProps) {
  const chartData = [
    { name: 'used', value: percentage },
    { name: 'remaining', value: 100 - percentage },
  ];

  const cardContent = (
    <>
      <div className="mb-2 sm:mb-3 w-full text-center">
        <span className="text-xs sm:text-sm truncate block px-2 font-normal text-foreground">
          {name}
        </span>
      </div>

      <div className="w-14 h-14 sm:w-16 sm:h-16 mb-2 border-none">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={16}
              outerRadius={25}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
            >
              <Cell fill={color} stroke="none" />
              <Cell fill="#27272a" stroke="none" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="text-center w-full">
        <div className="text-white mb-0.5 font-medium text-sm sm:text-base truncate px-1">
          NT$ {formatCompactCurrency(cost)}
        </div>
        <div className="text-xs text-slate-400">{percentage.toFixed(1)}%</div>
      </div>
    </>
  );

  // disabled 時使用 div，不可點擊
  if (disabled) {
    return (
      <div className="bg-slate-900/40 border border-white/10 rounded-lg p-3 sm:p-4 flex flex-col items-center justify-center min-h-[140px] sm:min-h-[160px] w-full">
        {cardContent}
      </div>
    );
  }

  // 可點擊時使用 button
  return (
    <button
      type="button"
      className="bg-slate-900/40 border border-white/10 rounded-lg p-3 sm:p-4 flex flex-col items-center justify-center hover:border-white/20 transition-colors cursor-pointer min-h-[140px] sm:min-h-[160px] w-full"
      onClick={onClick}
    >
      {cardContent}
    </button>
  );
}
