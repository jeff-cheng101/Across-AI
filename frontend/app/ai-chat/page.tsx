'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import { Loader2Icon, MessageSquareIcon } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getCurrentUser } from '@/app/util/authenticator';
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import {
  Message,
  MessageContent,
  MessageResponse,
} from '@/components/ai-elements/message';
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
} from '@/components/ai-elements/prompt-input';
import { type DifyMessage, getMessages } from '@/services/chat';
import { Sidebar } from './_components/sidebar';

/**
 * 取得使用者 ID
 * TODO: 未來應移除 fallback，強制要求登入才能使用 AI Chat 功能
 */
function getUserId(): string {
  const user = getCurrentUser();
  return user?.id || 'test-user';
}

/**
 * 從 UIMessage 的 parts 中提取文字內容
 */
function getMessageText(message: UIMessage): string {
  return message.parts
    .filter(
      (part): part is { type: 'text'; text: string } => part.type === 'text',
    )
    .map((part) => part.text)
    .join('');
}

/**
 * 將 Dify 訊息格式轉換為 UIMessage 格式
 */
function convertDifyMessagesToUIMessages(
  difyMessages: DifyMessage[],
): UIMessage[] {
  const uiMessages: UIMessage[] = [];

  // Dify 訊息是倒序的（最新的在前），需要反轉
  const sortedMessages = [...difyMessages].reverse();

  for (const msg of sortedMessages) {
    // 用戶訊息
    uiMessages.push({
      id: `${msg.id}-user`,
      role: 'user',
      parts: [{ type: 'text', text: msg.query }],
    });

    // AI 回覆
    uiMessages.push({
      id: `${msg.id}-assistant`,
      role: 'assistant',
      parts: [{ type: 'text', text: msg.answer }],
    });
  }

  return uiMessages;
}

export default function AIChatPage() {
  const [selectedChatId, setSelectedChatId] = useState<string | undefined>(
    undefined,
  );
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // 用於刷新側邊欄的觸發器
  const [sidebarRefreshTrigger, setSidebarRefreshTrigger] = useState(0);

  // 用於自動滾動到對話底部
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 追蹤訊息數量變化，用於判斷是否需要滾動
  const prevMessagesLengthRef = useRef(0);

  // 追蹤是否為新對話（沒有選擇任何對話時發送的第一條訊息）
  const isNewConversationRef = useRef(false);
  
  // 用 ref 存儲當前的 conversationId，確保每次請求都能獲取最新值
  const conversationIdRef = useRef<string | undefined>(selectedChatId);
  
  // 更新 ref 當 selectedChatId 改變時
  useEffect(() => {
    conversationIdRef.current = selectedChatId;
  }, [selectedChatId]);

  // 建立自定義 transport 以連接 API Route Handler
  // body 參數使用函數，每次發送消息時都會調用，確保使用最新的 conversationId
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/chat',
        credentials: 'include',
        // body 參數可以是函數，每次發送消息時都會調用
        body: () => {
          const currentConversationId = conversationIdRef.current;
          console.log(`🔗 準備發送消息 - Conversation ID: ${currentConversationId || '(新對話)'}`);
          return {
            userId: getUserId(),
            conversationId: currentConversationId,
          };
        },
      }),
    [], // 只需要創建一次，因為 body 是函數，會動態獲取最新值
  );

  // 使用 useChat hook（v3 API）
  const { messages, sendMessage, status, setMessages } = useChat({
    transport,
    /**
     * 當 AI 回覆完成時的回調
     * 用於在新對話創建後更新 selectedChatId，確保後續消息發送到同一個對話
     */
    onFinish: async () => {
      // 如果是新對話（沒有選擇任何對話ID），需要獲取剛創建的對話ID
      if (isNewConversationRef.current) {
        try {
          // 等待一下確保後端已建立對話
          await new Promise((resolve) => setTimeout(resolve, 500));
          
          // 重新獲取對話列表
          const userId = getUserId();
          const { conversations } = await import('@/services/chat').then(
            (m) => m.getConversations(userId, 1),
          );
          
          // 如果有對話，將最新的對話設為當前選中
          if (conversations.length > 0) {
            const latestConversationId = conversations[0].id;
            console.log(`🔗 新對話已建立，ID: ${latestConversationId}`);
            setSelectedChatId(latestConversationId);
            isNewConversationRef.current = false;
          }
        } catch (error) {
          console.error('❌ 獲取新對話 ID 失敗:', error);
        }
      }
    },
  });

  /**
   * 載入對話歷史訊息
   */
  const loadChatHistory = useCallback(
    async (conversationId: string) => {
      setIsLoadingHistory(true);
      try {
        const userId = getUserId();
        const result = await getMessages(conversationId, userId, 50);
        const uiMessages = convertDifyMessagesToUIMessages(result.messages);
        setMessages(uiMessages);
      } catch (error) {
        console.error('Error loading chat history:', error);
        setMessages([]);
      } finally {
        setIsLoadingHistory(false);
      }
    },
    [setMessages],
  );

  const handleNewChat = () => {
    setSelectedChatId(undefined);
    setMessages([]);
    isNewConversationRef.current = true; // 標記為新對話
  };

  const handleSelectChat = useCallback(
    (chatId: string) => {
      setSelectedChatId(chatId);
      isNewConversationRef.current = false; // 選擇已有對話，不是新對話
      void loadChatHistory(chatId);
    },
    [loadChatHistory],
  );

  // 處理 PromptInput 的 onSubmit
  const handlePromptSubmit = async (
    message: { text: string; files: unknown[] },
    _event: React.FormEvent<HTMLFormElement>,
  ) => {
    // 如果正在發送或 AI 正在回覆中，禁止送出新訊息
    if (status === 'submitted' || status === 'streaming') {
      return;
    }

    if (message.text.trim()) {
      // 如果沒有選擇對話，標記為新對話
      if (!selectedChatId) {
        isNewConversationRef.current = true;
      }
      // 使用 sendMessage 發送用戶訊息（v3 API）
      await sendMessage({ text: message.text });
    }
  };

  /**
   * 滾動到對話底部（只滾動對話內容區域）
   */
  const scrollToBottom = useCallback(() => {
    // 滾動到錨點元素，使用 block: 'end' 確保只在容器內滾動
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }, []);

  /**
   * 監聽訊息變化：當有新訊息時自動滾動到底部
   */
  useEffect(() => {
    // 只有訊息增加時才滾動（避免載入歷史時滾動）
    if (messages.length > prevMessagesLengthRef.current) {
      scrollToBottom();
    }

    prevMessagesLengthRef.current = messages.length;
  }, [messages, scrollToBottom]);

  /**
   * 監聽 selectedChatId 變化：當新對話 ID 設定後，刷新側邊欄
   */
  useEffect(() => {
    // 如果 selectedChatId 剛被設定（從 undefined 變為有值），刷新側邊欄
    if (selectedChatId) {
      setSidebarRefreshTrigger((prev) => prev + 1);
    }
  }, [selectedChatId]);

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* 左側歷史紀錄欄 */}
      <Sidebar
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        selectedChatId={selectedChatId}
        refreshTrigger={sidebarRefreshTrigger}
      />

      {/* 右側主對話區 */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* 對話容器 */}
        <Conversation className="flex-1">
          <ConversationContent>
            {/* 載入歷史訊息中 */}
            {isLoadingHistory && (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <Loader2Icon className="mr-2 size-5 animate-spin" />
                <span>載入對話歷史...</span>
              </div>
            )}

            {/* 空狀態 */}
            {!isLoadingHistory && messages.length === 0 && (
              <ConversationEmptyState
                title="開始新對話"
                description="輸入訊息開始與 AI 助手對話"
                icon={
                  <MessageSquareIcon className="size-8 text-muted-foreground" />
                }
              />
            )}

            {/* 訊息列表 */}
            {!isLoadingHistory &&
              messages.map((message) => (
                <Message key={message.id} from={message.role}>
                  <MessageContent>
                    <MessageResponse>{getMessageText(message)}</MessageResponse>
                  </MessageContent>
                </Message>
              ))}

            {/* AI 回覆中的 Loading 狀態 */}
            {(status === 'submitted' || status === 'streaming') && (
              <Message from="assistant">
                <MessageContent>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2Icon className="size-4 animate-spin" />
                    <span className="text-sm">
                      {status === 'submitted'
                        ? '發送中...'
                        : 'AI 正在回覆中...'}
                    </span>
                  </div>
                </MessageContent>
              </Message>
            )}

            {/* 滾動錨點 */}
            <div ref={messagesEndRef} />
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        {/* 輸入框區域 */}
        <div className="border-t bg-background p-4">
          <PromptInput
            onSubmit={handlePromptSubmit}
            className="[&_[data-slot=input-group]]:overflow-visible [&_[data-slot=input-group]]:pr-[2px]"
          >
            <PromptInputTextarea
              placeholder="輸入訊息..."
              rows={1}
              style={{
                minHeight: 'unset',
                paddingTop: '8px',
                paddingBottom: '8px',
              }}
              className="max-h-[120px]"
            />
            <PromptInputSubmit status={status} />
          </PromptInput>
        </div>
      </div>
    </div>
  );
}
