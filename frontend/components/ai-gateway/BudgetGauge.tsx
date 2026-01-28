'use client';

type BudgetGaugeProps = {
  budgetUsed: number;
  budgetTotal: number;
  budgetPercentage: number;
};

/**
 * 預算儀表組件
 *
 * 以半圓形儀表呈現預算使用狀況
 * 顏色會根據使用比例變化：<60% 綠色、60-80% 橙色、>80% 紅色
 */
export function BudgetGauge({
  budgetUsed,
  budgetTotal,
  budgetPercentage,
}: BudgetGaugeProps) {
  const percentage = Math.min(budgetPercentage, 100);
  const angle = (percentage / 100) * 180 - 90;

  const getColor = () => {
    if (percentage < 60) return '#14b8a6';
    if (percentage < 80) return '#f59e0b';
    return '#ef4444';
  };

  const color = getColor();

  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative w-64 h-32">
        <svg viewBox="0 0 200 110" className="w-full h-full" aria-hidden="true">
          <title>預算儀表</title>
          <defs>
            <linearGradient
              id="gaugeGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#14b8a6" />
              <stop offset="60%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>

          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#27272a"
            strokeWidth="12"
            strokeLinecap="butt"
          />

          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="12"
            strokeLinecap="butt"
            strokeDasharray={`${(percentage / 100) * 251.2} 251.2`}
            style={{
              transition: 'stroke-dasharray 1s ease-in-out',
            }}
          />

          <circle cx="100" cy="100" r="4" fill="#71717a" />

          <line
            x1="100"
            y1="100"
            x2="100"
            y2="30"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="butt"
            style={{
              transformOrigin: '100px 100px',
              transform: `rotate(${angle}deg)`,
              transition: 'transform 1s ease-in-out',
            }}
          />

          <circle cx="100" cy="100" r="6" fill={color} />
          <circle cx="100" cy="100" r="3" fill="#18181b" />
        </svg>
      </div>

      <div className="mt-4 text-center">
        <div className="text-3xl font-semibold" style={{ color }}>
          NT$ {Math.round(budgetUsed).toLocaleString()}
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          {percentage.toFixed(1)}% of NT${' '}
          {Math.round(budgetTotal).toLocaleString()} budget
        </div>
      </div>

      <div className="w-full mt-6">
        <div className="h-2 bg-muted rounded-full overflow-hidden relative">
          <div
            className="absolute inset-0 bg-gradient-to-r from-teal-500 via-amber-500 to-red-500"
            style={{ width: '100%' }}
          />
          <div
            className="absolute inset-0 bg-muted"
            style={{
              left: `${percentage}%`,
              transition: 'left 1s ease-in-out',
            }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>
            剩餘: NT$ {Math.round(budgetTotal - budgetUsed).toLocaleString()}
          </span>
          <span>{(100 - percentage).toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
}
