'use client';

import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

/**
 * AI Gateway 側邊導航列
 *
 * 業務背景：提供 AI Gateway 各功能頁面的導航。
 * 使用 Next.js Link 組件進行路由導航，支援瀏覽器上一頁/下一頁。
 * 使用 usePathname 判斷當前頁面並高亮對應導航項目。
 *
 * 導航項目：
 * - 儀表板：exactMatch=true，僅完全匹配 /ai-gateway 時高亮
 * - 安全護欄：exactMatch=false，匹配 /ai-gateway/guardrails 及其子路由
 */
export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // 在客戶端設定時間，避免 SSR hydration mismatch
  useEffect(() => {
    setLastUpdated(new Date().toLocaleTimeString());
  }, []);

  const navItems = [
    {
      href: '/ai-gateway',
      label: '儀表板',
      englishLabel: 'Dashboard',
      icon: LayoutDashboard,
      exactMatch: true,
    },
    {
      href: '/ai-gateway/guardrails',
      label: '安全護欄',
      englishLabel: 'Guardrails',
      icon: ShieldCheck,
      exactMatch: false,
    },
  ];

  return (
    <motion.div
      initial={{ width: 240 }}
      animate={{ width: isCollapsed ? 80 : 240 }}
      transition={{ duration: 0.3 }}
      className="relative bg-slate-900/40 border-r border-white/10 backdrop-blur-sm sticky top-0 h-screen flex flex-col flex-shrink-0"
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full bg-slate-800 border border-white/10 hover:bg-slate-700"
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4 text-white" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-white" />
        )}
      </Button>

      <div className="flex-shrink-0 px-8 pt-8 pb-6 border-b border-white/10">
        {!isCollapsed ? (
          <div>
            <h1 className="text-xl text-white leading-tight font-semibold">
              AI Gateway
            </h1>
            <p className="text-xs text-slate-400 mt-1">開發者儀表板</p>
          </div>
        ) : (
          <div className="flex justify-center">
            <Sparkles
              className="w-6 h-6 text-white cursor-pointer hover:text-cyan-400 transition-colors"
              onClick={() => setIsCollapsed(false)}
            />
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exactMatch
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded transition-colors text-sm ${
                  isActive
                    ? 'bg-zinc-800/50 text-white border border-zinc-700/50 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-slate-800/30'
                } ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-5 h-5 flex-shrink-0 ${
                    isActive ? 'text-slate-50' : 'text-zinc-400'
                  }`}
                />
                {!isCollapsed && item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {!isCollapsed && lastUpdated && (
        <div className="flex-shrink-0 p-4 border-t border-white/10">
          <div className="text-xs text-slate-500">
            Last updated: {lastUpdated}
          </div>
        </div>
      )}
    </motion.div>
  );
}
