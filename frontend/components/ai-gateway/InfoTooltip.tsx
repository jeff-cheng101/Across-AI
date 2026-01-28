'use client';

import { Info } from 'lucide-react';

type InfoTooltipProps = {
  content?: string;
  text?: string;
};

/**
 * 資訊提示組件
 *
 * 用於在圖表或數據旁顯示說明文字
 * 滑鼠懸停時顯示完整內容
 */
export function InfoTooltip({ content, text }: InfoTooltipProps) {
  const displayText = content || text || '';

  return (
    <div className="group relative inline-block">
      <Info className="w-4 h-4 text-slate-400 cursor-help" />
      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block z-50 pointer-events-none">
        <div className="bg-slate-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap shadow-lg border border-slate-700">
          {displayText}
        </div>
      </div>
    </div>
  );
}
