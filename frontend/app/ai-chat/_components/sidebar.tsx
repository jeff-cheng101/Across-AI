'use client';

import { formatDistanceToNow } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import {
  Loader2Icon,
  MessageSquareIcon,
  PlusIcon,
  RefreshCwIcon,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { getCurrentUser } from '@/app/util/authenticator';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

/**
 * 取得使用者 ID
 * TODO: 未來應移除 fallback，強制要求登入才能使用 AI Chat 功能
 */
function getUserId(): string {
  const user = getCurrentUser();
  return user?.id || 'test-user';
}

/**
 * 對話項目類型（對應 Dify API 回傳格式）
 */
type ConversationItem = {
  id: string;
  name: string;
  created_at: number;
  updated_at: number;
};

/**
 * Sidebar Props
 */
type SidebarProps = {
  className?: string;
  onNewChat?: () => void;
  onSelectChat?: (chatId: string) => void;
  selectedChatId?: string;
  /** 刷新觸發器，當此值變化時會重新載入對話列表 */
  refreshTrigger?: number;
};

/**
 * 格式化時間顯示
 */
function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000); // Dify 使用秒為單位的 timestamp
  return formatDistanceToNow(date, { addSuffix: true, locale: zhTW });
}

/**
 * 左側歷史紀錄欄組件
 */
export function Sidebar({
  className,
  onNewChat,
  onSelectChat,
  selectedChatId,
  refreshTrigger,
}: SidebarProps) {
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 從 API 取得對話列表
   */
  const fetchConversations = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/chat/conversations?userId=${encodeURIComponent(getUserId())}&limit=50`,
      );

      if (!response.ok) {
        throw new Error('Failed to fetch conversations');
      }

      const result = (await response.json()) as {
        success: boolean;
        data?: { conversations: ConversationItem[]; hasMore: boolean };
        error?: string;
      };

      if (result.success && result.data?.conversations) {
        setConversations(result.data.conversations);
      } else {
        throw new Error(result.error || '取得對話列表失敗');
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError(err instanceof Error ? err.message : '取得對話列表失敗');
      setConversations([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 組件掛載時取得對話列表
  useEffect(() => {
    void fetchConversations();
  }, [fetchConversations]);

  // 監聽 refreshTrigger 變化，觸發刷新（跳過初始值 0）
  useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      void fetchConversations();
    }
  }, [refreshTrigger, fetchConversations]);

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
        {/* 載入中狀態 */}
        {isLoading && (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <Loader2Icon className="mr-2 size-4 animate-spin" />
            <span className="text-sm">載入中...</span>
          </div>
        )}

        {/* 錯誤狀態 */}
        {!isLoading && error && (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-muted-foreground">
            <p className="text-center text-sm">{error}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => void fetchConversations()}
              className="gap-1"
            >
              <RefreshCwIcon className="size-3" />
              重試
            </Button>
          </div>
        )}

        {/* 空狀態 */}
        {!isLoading && !error && conversations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <MessageSquareIcon className="mb-2 size-8" />
            <p className="text-center text-sm">尚無對話紀錄</p>
            <p className="text-center text-xs">開始新對話來建立紀錄</p>
          </div>
        )}

        {/* 對話列表 */}
        {!isLoading &&
          !error &&
          conversations.map((chat) => (
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
                  {chat.name || '新對話'}
                </p>
                <p className="truncate text-muted-foreground text-xs leading-tight">
                  {formatTimestamp(chat.updated_at)}
                </p>
              </div>
            </button>
          ))}
      </div>

      {/* 底部：重新整理按鈕 */}
      {!isLoading && conversations.length > 0 && (
        <div className="p-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center gap-1 text-muted-foreground"
            onClick={() => void fetchConversations()}
          >
            <RefreshCwIcon className="size-3" />
            重新整理
          </Button>
        </div>
      )}
    </div>
  );
}
