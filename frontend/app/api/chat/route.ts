// frontend/app/api/chat/route.ts
// Dify Chat API - Route Handler (Streaming Mode)
// 使用 dify-ai-provider 與 Vercel AI SDK 串接 Dify chatbot

import {
  convertToModelMessages,
  type LanguageModel,
  streamText,
  type UIMessage,
} from 'ai';
import { createDifyProvider } from 'dify-ai-provider';
import { type NextRequest, NextResponse } from 'next/server';

const DIFY_SERVICE_URL = process.env.DIFY_SERVICE_URL;
const DIFY_APP_ID = process.env.DIFY_APP_ID;
const DIFY_API_KEY = process.env.DIFY_API_KEY;

interface ChatRequestBody {
  messages: UIMessage[];
  userId?: string;
  conversationId?: string;
}

/**
 * POST /api/chat
 * assistant-ui 聊天端點 (Streaming Mode)
 * 使用 Vercel AI SDK 的 toUIMessageStreamResponse() 回傳標準串流格式
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ChatRequestBody;
    const { messages, userId, conversationId } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: '缺少必要參數: messages',
        },
        { status: 400 },
      );
    }

    if (!DIFY_SERVICE_URL || !DIFY_APP_ID || !DIFY_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Dify API 配置缺失 (DIFY_SERVICE_URL, DIFY_APP_ID, DIFY_API_KEY)',
        },
        { status: 500 },
      );
    }

    console.log(`\n💬 ===== Dify Chat (assistant-ui) =====`);
    console.log(`📝 Messages count: ${messages.length}`);
    console.log(`👤 User: ${userId || '(anonymous)'}`);
    console.log(`🔗 Conversation: ${conversationId || '(新對話)'}`);

    // 建立 Dify Provider 實例（支援 self-hosted）
    const difyProvider = createDifyProvider({
      baseURL: DIFY_SERVICE_URL,
    });

    const model = difyProvider(DIFY_APP_ID, {
      responseMode: 'streaming',
      apiKey: DIFY_API_KEY,
    });

    // 設定 headers 用於對話連續性
    const headers: Record<string, string> = {};

    if (userId) {
      headers['user-id'] = userId;
    }

    if (conversationId) {
      headers['chat-id'] = conversationId;
    }

    // 轉換 UIMessage[] 為 model messages
    // UIMessage 官方格式：{ id, role, parts: UIMessagePart[] }
    const modelMessages = await convertToModelMessages(messages);

    // 建立串流
    const result = streamText({
      model: model as LanguageModel,
      messages: modelMessages,
      headers,
    });

    console.log(`✅ ===== Dify Stream 開始 =====\n`);

    // 使用 AI SDK 的標準串流回應格式
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('❌ Dify chat 錯誤:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Dify 對話失敗',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
