import type React from 'react';

interface ZTNAGenericItem<T = unknown> {
  name: string;
  value: number;
  previousValue?: number;
  change?: number;
  extra?: T;
}

interface ZTNAGenericTableProps<T = unknown> {
  title: string;
  data: ZTNAGenericItem<T>[];
  columns: {
    nameLabel: string;
    valueLabel: string;
    previousLabel?: string;
    changeLabel?: string;
    extraLabel?: string;
  };
  valueFormatter?: (value: number) => string;
  extraRenderer?: (
    extra: T | undefined,
    row: ZTNAGenericItem<T>,
  ) => React.ReactNode;
}

export function ZTNAGenericTable<T = unknown>({
  title,
  data = [],
  columns,
  valueFormatter,
  extraRenderer,
}: ZTNAGenericTableProps<T>) {
  return (
    <div className="card-dark rounded-xl p-5 border border-slate-700/50">
      <h3 className="text-white text-base mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700/50">
              <th className="text-left py-3 px-2 text-slate-400 font-medium">
                排名
              </th>
              <th className="text-left py-3 px-2 text-slate-400 font-medium">
                {columns.nameLabel}
              </th>
              <th className="text-left py-3 px-2 text-slate-400 font-medium">
                {columns.valueLabel}
              </th>
              {columns.previousLabel && (
                <th className="text-left py-3 px-2 text-slate-400 font-medium">
                  {columns.previousLabel}
                </th>
              )}
              {columns.changeLabel && (
                <th className="text-left py-3 px-2 text-slate-400 font-medium">
                  {columns.changeLabel}
                </th>
              )}
              {columns.extraLabel && (
                <th className="text-left py-3 px-2 text-slate-400 font-medium">
                  {columns.extraLabel}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              const rank = index + 1;
              return (
                <tr
                  key={rank}
                  className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                >
                  <td className="py-3 px-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                      <span className="text-blue-400 text-xs font-semibold">
                        {rank}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-slate-200">{item.name}</td>
                  <td className="py-3 px-2 text-white font-medium">
                    {valueFormatter
                      ? valueFormatter(item.value ?? 0)
                      : (item.value ?? 0).toLocaleString()}
                  </td>
                  {columns.previousLabel &&
                    item.previousValue !== undefined && (
                      <td className="py-3 px-2 text-slate-400 text-sm">
                        {valueFormatter
                          ? valueFormatter(item.previousValue)
                          : item.previousValue.toLocaleString()}
                      </td>
                    )}
                  {columns.changeLabel && item.change !== undefined && (
                    <td className="py-3 px-2">
                      <div
                        className={`flex items-center gap-1 ${
                          item.change > 0
                            ? 'text-red-400'
                            : item.change < 0
                              ? 'text-green-400'
                              : 'text-slate-400'
                        }`}
                      >
                        {item.change > 0 ? '↑' : item.change < 0 ? '↓' : ''}
                        <span className="text-xs font-medium">
                          {Math.abs(item.change).toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  )}
                  {columns.extraLabel && (
                    <td className="py-3 px-2">
                      {extraRenderer
                        ? extraRenderer(item.extra, item)
                        : item.extra?.toString()}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
