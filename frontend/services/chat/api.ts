// frontend/services/chat/api.ts
import { nextClient } from '@/lib/api-clients';
import {
  type ConversationItem,
  ConversationsResponseSchema,
  type DifyMessage,
  MessagesResponseSchema,
} from './type';

/**
 * 取得使用者的對話列表
 */
export async function getConversations(
  userId: string,
  limit: number = 50,
): Promise<{ conversations: ConversationItem[]; hasMore: boolean }> {
  const response = await nextClient.get('/chat/conversations', {
    params: { userId, limit },
  });

  const result = ConversationsResponseSchema.parse(response.data);

  if (!result.success || !result.data) {
    throw new Error(result.error || '取得對話列表失敗');
  }

  return result.data;
}

/**
 * 取得對話歷史訊息
 */
export async function getMessages(
  conversationId: string,
  userId: string,
  limit: number = 50,
): Promise<{ messages: DifyMessage[]; hasMore: boolean }> {
  const response = await nextClient.get('/chat/messages', {
    params: { conversationId, userId, limit },
  });

  const result = MessagesResponseSchema.parse(response.data);

  if (!result.success || !result.data) {
    throw new Error(result.error || '取得對話歷史失敗');
  }

  return result.data;
}
