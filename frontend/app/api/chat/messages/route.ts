// frontend/app/api/chat/messages/route.ts
// 取得對話歷史訊息 - Route Handler

import { type NextRequest, NextResponse } from 'next/server';

const DIFY_SERVICE_URL = process.env.DIFY_SERVICE_URL;
const DIFY_CHAT_KEY = process.env.DIFY_CHAT_KEY;

interface Message {
  id: string;
  conversation_id: string;
  query: string;
  answer: string;
  created_at: number;
  [key: string]: unknown;
}

interface ApiSuccessResponse<T = unknown> {
  success: true;
  data?: T;
  message?: string;
}

interface ApiErrorResponse {
  success: false;
  error: string;
  details?: string;
}

type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * GET /api/chat/messages
 * 取得對話歷史訊息
 */
export async function GET(
  request: NextRequest,
): Promise<NextResponse<ApiResponse>> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const conversationId = searchParams.get('conversationId');
    const userId = searchParams.get('userId') || 'default-user';
    const limit = searchParams.get('limit') || '20';
    const firstId = searchParams.get('firstId');

    if (!conversationId) {
      return NextResponse.json(
        {
          success: false,
          error: '缺少必要參數: conversationId',
        },
        { status: 400 },
      );
    }

    if (!DIFY_SERVICE_URL || !DIFY_CHAT_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: 'Dify API 配置缺失',
        },
        { status: 500 },
      );
    }

    console.log(`\n📜 ===== 取得對話歷史 =====`);
    console.log(`🔗 Conversation: ${conversationId}`);
    console.log(`👤 User: ${userId}`);

    // 建立 Dify API URL
    const url = new URL(`${DIFY_SERVICE_URL}/messages`);
    url.searchParams.set('conversation_id', conversationId);
    url.searchParams.set(
      'limit',
      Math.min(parseInt(limit, 10), 100).toString(),
    );
    url.searchParams.set('user', userId);

    if (firstId) {
      url.searchParams.set('first_id', firstId);
    }

    // 呼叫 Dify API
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${DIFY_CHAT_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(
        `Failed to fetch messages: ${response.status} - ${error}`,
      );
    }

    const data = (await response.json()) as {
      data?: Message[];
      has_more?: boolean;
    };

    const result = {
      messages: data.data || [],
      hasMore: data.has_more || false,
    };

    console.log(`✅ 取得 ${result.messages.length} 筆訊息`);
    console.log(`\n✅ ===== 歷史訊息取得完成 =====\n`);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('❌ 取得訊息歷史錯誤:', error);
    return NextResponse.json(
      {
        success: false,
        error: '取得對話歷史失敗',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
