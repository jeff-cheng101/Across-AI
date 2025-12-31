'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import { MessageSquareIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
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
import { Sidebar } from './_components/sidebar';

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

export default function AIChatPage() {
  const [selectedChatId, setSelectedChatId] = useState<string | undefined>(
    undefined,
  );

  // 建立自定義 transport 以連接後端 API
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/backend/chat',
        credentials: 'include',
      }),
    [],
  );

  // 使用 useChat hook（v3 API）
  const { messages, sendMessage, status, setMessages } = useChat({
    transport,
  });

  const handleNewChat = () => {
    setSelectedChatId(undefined);
    setMessages([]);
  };

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
    // TODO: 從後端載入對話歷史
    setMessages([]);
  };

  // 處理 PromptInput 的 onSubmit
  const handlePromptSubmit = async (
    message: { text: string; files: unknown[] },
    _event: React.FormEvent<HTMLFormElement>,
  ) => {
    if (message.text.trim()) {
      // 使用 sendMessage 發送用戶訊息（v3 API）
      await sendMessage({ text: message.text });
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* 左側歷史紀錄欄 */}
      <Sidebar
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        selectedChatId={selectedChatId}
      />

      {/* 右側主對話區 */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* 對話容器 */}
        <Conversation className="flex-1">
          <ConversationContent>
            {messages.length === 0 ? (
              <ConversationEmptyState
                title="開始新對話"
                description="輸入訊息開始與 AI 助手對話"
                icon={
                  <MessageSquareIcon className="size-8 text-muted-foreground" />
                }
              />
            ) : (
              messages.map((message) => (
                <Message key={message.id} from={message.role}>
                  <MessageContent>
                    <MessageResponse>{getMessageText(message)}</MessageResponse>
                  </MessageContent>
                </Message>
              ))
            )}
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
