'use client';

import { MessageSquareIcon, PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

/**
 * 歷史對話項目類型
 */
type ChatHistoryItem = {
  id: string;
  title: string;
  lastMessage?: string;
  timestamp?: Date;
};

/**
 * Sidebar Props
 */
type SidebarProps = {
  className?: string;
  onNewChat?: () => void;
  onSelectChat?: (chatId: string) => void;
  selectedChatId?: string;
};

/**
 * Mock 歷史對話數據（20 筆）
 */
const mockChatHistory: ChatHistoryItem[] = [
  {
    id: '1',
    title: '如何開始使用 React？',
    lastMessage: 'React 是一個用於構建用戶界面的 JavaScript 庫...',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 分鐘前
  },
  {
    id: '2',
    title: 'TypeScript 最佳實踐',
    lastMessage: 'TypeScript 提供了類型安全，可以幫助我們...',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 小時前
  },
  {
    id: '3',
    title: 'Next.js 路由系統',
    lastMessage: 'Next.js 使用文件系統路由，每個頁面都是...',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 天前
  },
  {
    id: '4',
    title: 'Tailwind CSS 配置',
    lastMessage: 'Tailwind CSS 可以通過 tailwind.config.js 進行...',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 天前
  },
  {
    id: '5',
    title: 'AI 模型比較',
    lastMessage: '不同的 AI 模型有不同的特點和適用場景...',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 1 週前
  },
  {
    id: '6',
    title: 'Docker 容器化部署',
    lastMessage: 'Docker 可以幫助你將應用打包成容器...',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8),
  },
  {
    id: '7',
    title: 'GraphQL vs REST API',
    lastMessage: 'GraphQL 提供了更靈活的數據查詢方式...',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9),
  },
  {
    id: '8',
    title: 'Redis 緩存策略',
    lastMessage: 'Redis 是一個高性能的鍵值存儲數據庫...',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
  },
  {
    id: '9',
    title: 'Kubernetes 入門指南',
    lastMessage: 'K8s 是一個容器編排平台，可以自動化部署...',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 11),
  },
  {
    id: '10',
    title: 'PostgreSQL 性能優化',
    lastMessage: '索引優化是提升數據庫性能的關鍵...',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12),
  },
  {
    id: '11',
    title: 'WebSocket 即時通訊',
    lastMessage: 'WebSocket 提供了全雙工的通訊方式...',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 13),
  },
  {
    id: '12',
    title: 'CI/CD 流水線設計',
    lastMessage: '持續集成和持續部署可以提高開發效率...',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
  },
  {
    id: '13',
    title: '微服務架構設計',
    lastMessage: '微服務將應用拆分為獨立的小服務...',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
  },
  {
    id: '14',
    title: 'OAuth 2.0 認證流程',
    lastMessage: 'OAuth 2.0 是一個授權框架，用於安全認證...',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 16),
  },
  {
    id: '15',
    title: 'Elasticsearch 全文搜索',
    lastMessage: 'ES 是一個分佈式搜索和分析引擎...',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 17),
  },
  {
    id: '16',
    title: '前端性能優化技巧',
    lastMessage: '代碼分割和懶加載可以顯著提升性能...',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18),
  },
  {
    id: '17',
    title: '單元測試最佳實踐',
    lastMessage: 'Jest 和 React Testing Library 是常用工具...',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 19),
  },
  {
    id: '18',
    title: 'Git 分支管理策略',
    lastMessage: 'Git Flow 和 GitHub Flow 是常見的分支策略...',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20),
  },
  {
    id: '19',
    title: 'Nginx 反向代理配置',
    lastMessage: 'Nginx 可以作為負載均衡和反向代理...',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21),
  },
  {
    id: '20',
    title: 'MongoDB 數據建模',
    lastMessage: '文檔型數據庫的設計思路與關係型不同...',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 22),
  },
];

/**
 * 格式化時間顯示
 */
function formatTimestamp(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) {
    return `${diffMins} 分鐘前`;
  }
  if (diffHours < 24) {
    return `${diffHours} 小時前`;
  }
  if (diffDays < 7) {
    return `${diffDays} 天前`;
  }
  return date.toLocaleDateString('zh-TW');
}

/**
 * 左側歷史紀錄欄組件
 */
export function Sidebar({
  className,
  onNewChat,
  onSelectChat,
  selectedChatId,
}: SidebarProps) {
  return (
    <div
      className={cn(
        'flex h-full w-[280px] flex-col border-r bg-background',
        className,
      )}
    >
      {/* 頂部：New Chat 按鈕 */}
      <div className="p-4">
        <Button
          className="w-full justify-start gap-2"
          onClick={onNewChat}
          variant="default"
        >
          <PlusIcon className="size-4" />
          新對話
        </Button>
      </div>

      <Separator />

      {/* 歷史對話列表 */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-2">
        {mockChatHistory.map((chat) => (
          <button
            key={chat.id}
            className={cn(
              'group flex w-full min-w-0 items-start gap-2 rounded-lg p-2 text-left transition-colors hover:bg-accent',
              selectedChatId === chat.id && 'bg-accent',
            )}
            onClick={() => onSelectChat?.(chat.id)}
            type="button"
          >
            <MessageSquareIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0 flex-1 space-y-0.5 overflow-hidden">
              <p className="truncate font-medium text-sm leading-tight">
                {chat.title}
              </p>
              {chat.lastMessage && (
                <p className="truncate text-muted-foreground text-xs leading-tight">
                  {chat.lastMessage}
                </p>
              )}
              {chat.timestamp && (
                <p className="truncate text-muted-foreground text-xs leading-tight">
                  {formatTimestamp(chat.timestamp)}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
