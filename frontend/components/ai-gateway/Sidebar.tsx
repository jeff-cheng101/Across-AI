'use client';

import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

type SidebarProps = {
  activeItem?: string;
  onNavigate?: (item: string) => void;
};

/**
 * AI Gateway 側邊導航列
 *
 * 提供頁面內導航功能
 * 支援收合/展開狀態
 */
export function Sidebar({
  activeItem = 'dashboard',
  onNavigate,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    {
      id: 'dashboard',
      label: '儀表板',
      englishLabel: 'Dashboard',
      icon: LayoutDashboard,
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
            const isActive = activeItem === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate?.(item.id)}
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
              </button>
            );
          })}
        </div>
      </nav>

      {!isCollapsed && (
        <div className="flex-shrink-0 p-4 border-t border-white/10">
          <div className="text-xs text-slate-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      )}
    </motion.div>
  );
}
