'use client';

import { Shield, ShieldCheck } from 'lucide-react';

interface AnalysisStateProps {
  mode: 'http-attack' | 'ztna';
}

export function AnalysisState({ mode }: AnalysisStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-32 space-y-8">
      <div className="relative w-32 h-32">
        <div className="absolute inset-0 rounded-full border-4 border-blue-500/20" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-400 animate-spin-slow" />
        <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-cyan-400 animate-spin-slow" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="gradient-blue-bright p-4 rounded-full glow-blue-subtle animate-pulse">
            {mode === 'http-attack' ? (
              <Shield className="w-10 h-10 text-white" />
            ) : (
              <ShieldCheck className="w-10 h-10 text-white" />
            )}
          </div>
        </div>
        <div className="absolute inset-0 rounded-full bg-blue-500/10 animate-ping" />
      </div>

      <div className="text-center space-y-3">
        <h2 className="text-2xl text-gradient-blue animate-pulse">
          {mode === 'http-attack'
            ? '正在分析攻擊趨勢...'
            : '正在分析 Zero Trust 趨勢...'}
        </h2>
        <p className="text-slate-400 text-sm max-w-md">
          {mode === 'http-attack'
            ? '系統正在處理 HTTP 攻擊事件數據，包括流量分析、IP 追蹤、規則比對等多維度分析'
            : '系統正在處理 Zero Trust 數據，包括使用者行為、應用程式存取、License 使用等多維度分析'}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-slate-400 text-xs">數據收集</span>
        </div>
        <div className="w-8 h-px bg-slate-700" />
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"
            style={{ animationDelay: '0.2s' }}
          />
          <span className="text-slate-400 text-xs">
            {mode === 'http-attack' ? '威脅分析' : '行為分析'}
          </span>
        </div>
        <div className="w-8 h-px bg-slate-700" />
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"
            style={{ animationDelay: '0.4s' }}
          />
          <span className="text-slate-400 text-xs">生成報告</span>
        </div>
      </div>

      <div className="w-full max-w-md">
        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 rounded-full animate-loading-bar" />
        </div>
      </div>
    </div>
  );
}
