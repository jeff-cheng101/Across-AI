import {
  convertToModelMessages,
  generateText,
  type LanguageModel,
  streamText,
  type UIMessage,
} from 'ai';
import { createDifyProvider } from 'dify-ai-provider';

// 從環境變數取得配置
const DIFY_BASE_URL = process.env.DIFY_SERVICE_URL;
const DIFY_APP_ID = process.env.DIFY_APP_ID;
const DIFY_API_KEY = process.env.DIFY_API_KEY;

// ============================================================
// Types
// ============================================================

interface DifyModelOptions {
  appId?: string;
  apiKey?: string;
  responseMode?: 'blocking' | 'streaming';
  inputs?: Record<string, unknown>;
}

interface ChatResult {
  text: string;
  conversationId: string | null;
  messageId: string | undefined;
}

interface Message {
  id: string;
  conversation_id: string;
  query: string;
  answer: string;
  created_at: number;
  [key: string]: unknown;
}

interface Conversation {
  id: string;
  name: string;
  created_at: number;
  updated_at: number;
  [key: string]: unknown;
}

interface MessagesResponse {
  messages: Message[];
  hasMore: boolean;
}

interface ConversationsResponse {
  conversations: Conversation[];
  hasMore: boolean;
}

// ============================================================
// Dify Provider
// ============================================================

/**
 * 建立 Dify Provider 實例
 * 支援自架 Dify 實例
 */
function createDifyModel(options: DifyModelOptions = {}) {
  const difyProvider = createDifyProvider({
    baseURL: DIFY_BASE_URL,
  });

  return difyProvider(options.appId || DIFY_APP_ID, {
    responseMode: options.responseMode || 'streaming',
    apiKey: options.apiKey || DIFY_API_KEY,
    inputs: options.inputs || {},
  });
}

// ============================================================
// Chat Functions
// ============================================================

/**
 * 發送對話訊息 (Blocking Mode)
 */
async function chat(
  message: string,
  userId: string,
  conversationId: string | null = null,
  options: DifyModelOptions = {},
): Promise<ChatResult> {
  const model = createDifyModel({
    responseMode: 'blocking',
    ...options,
  });

  const headers: Record<string, string> = {
    'user-id': userId,
  };

  if (conversationId) {
    headers['chat-id'] = conversationId;
  }

  const { text, providerMetadata } = await generateText({
    model: model as LanguageModel,
    messages: [{ role: 'user', content: message }],
    headers,
  });

  const difyData =
    (providerMetadata?.difyWorkflowData as Record<string, string>) || {};

  return {
    text,
    conversationId: difyData.conversationId || conversationId,
    messageId: difyData.messageId,
  };
}

/**
 * 發送對話訊息 (Streaming Mode - 給 assistant-ui 使用)
 * 接收 UIMessage[] 格式，回傳 streamText 結果供 toUIMessageStreamResponse() 使用
 */
async function streamChatForUI(
  messages: UIMessage[],
  userId?: string,
  conversationId?: string,
  options: DifyModelOptions = {},
) {
  const model = createDifyModel({
    responseMode: 'streaming',
    ...options,
  });

  const headers: Record<string, string> = {};

  if (userId) {
    headers['user-id'] = userId;
  }

  if (conversationId) {
    headers['chat-id'] = conversationId;
  }

  const modelMessages = await convertToModelMessages(messages);

  return streamText({
    model: model as LanguageModel,
    messages: modelMessages,
    headers,
  });
}

/**
 * 發送對話訊息 (Streaming Mode - Legacy)
 * @deprecated 請使用 streamChatForUI
 */
async function streamChat(
  message: string,
  userId: string,
  conversationId: string | null = null,
  options: DifyModelOptions = {},
) {
  const model = createDifyModel({
    responseMode: 'streaming',
    ...options,
  });

  const headers: Record<string, string> = {
    'user-id': userId,
  };

  if (conversationId) {
    headers['chat-id'] = conversationId;
  }

  const stream = streamText({
    model: model as LanguageModel,
    messages: [{ role: 'user', content: message }],
    headers,
  });

  return stream;
}

// ============================================================
// History Functions (Direct Dify REST API)
// ============================================================

/**
 * 取得對話歷史訊息
 */
async function getMessages(
  conversationId: string,
  limit: number = 20,
  firstId: string | null = null,
  userId: string = 'default-user',
): Promise<MessagesResponse> {
  const url = new URL(`${DIFY_BASE_URL}/messages`);
  url.searchParams.set('conversation_id', conversationId);
  url.searchParams.set('limit', Math.min(limit, 100).toString());
  url.searchParams.set('user', userId);

  if (firstId) {
    url.searchParams.set('first_id', firstId);
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${DIFY_API_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch messages: ${response.status} - ${error}`);
  }

  const data = (await response.json()) as {
    data?: Message[];
    has_more?: boolean;
  };

  return {
    messages: data.data || [],
    hasMore: data.has_more || false,
  };
}

/**
 * 取得使用者的對話列表
 */
async function getConversations(
  userId: string,
  limit: number = 20,
  lastId: string | null = null,
): Promise<ConversationsResponse> {
  const url = new URL(`${DIFY_BASE_URL}/conversations`);
  url.searchParams.set('user', userId);
  url.searchParams.set('limit', Math.min(limit, 100).toString());
  url.searchParams.set('sort_by', '-updated_at');

  if (lastId) {
    url.searchParams.set('last_id', lastId);
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${DIFY_API_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(
      `Failed to fetch conversations: ${response.status} - ${error}`,
    );
  }

  const data = (await response.json()) as {
    data?: Conversation[];
    has_more?: boolean;
  };

  return {
    conversations: data.data || [],
    hasMore: data.has_more || false,
  };
}

/**
 * 刪除對話
 */
async function deleteConversation(
  conversationId: string,
  userId: string,
): Promise<{ success: boolean }> {
  const response = await fetch(
    `${DIFY_BASE_URL}/conversations/${conversationId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${DIFY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user: userId }),
    },
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(
      `Failed to delete conversation: ${response.status} - ${error}`,
    );
  }

  return { success: true };
}

export {
  chat,
  createDifyModel,
  deleteConversation,
  getConversations,
  getMessages,
  streamChat,
  streamChatForUI,
  type ChatResult,
  type Conversation,
  type ConversationsResponse,
  type Message,
  type MessagesResponse,
};
