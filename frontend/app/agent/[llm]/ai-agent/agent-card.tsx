'use client';

import type React from 'react';
import { Card } from '@/components/ui/card';

interface AgentCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export function AgentCard({
  title,
  description,
  icon,
  onClick,
}: AgentCardProps) {
  return (
    <Card
      className="group relative overflow-hidden border-gray-800 bg-gray-900/50 backdrop-blur-sm hover:border-[#45A4C0]/50 transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#45A4C0]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative p-6">
        <div className="mb-4 text-[#45A4C0]">{icon}</div>

        <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>

        <p className="text-gray-400 text-sm">{description}</p>

        <div className="mt-4 flex items-center text-[#45A4C0] text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span>啟動 Agent</span>
          <svg
            className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <title>右箭頭圖標</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </Card>
  );
}
