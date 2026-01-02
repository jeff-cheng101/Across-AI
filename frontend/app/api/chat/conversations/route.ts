// frontend/app/api/chat/conversations/route.ts
// 取得使用者的對話列表 - Route Handler

import { type NextRequest, NextResponse } from 'next/server';

const DIFY_SERVICE_URL = process.env.DIFY_SERVICE_URL;
const DIFY_API_KEY = process.env.DIFY_API_KEY;

interface Conversation {
  id: string;
  name: string;
  created_at: number;
  updated_at: number;
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
 * GET /api/chat/conversations
 * 取得使用者的對話列表
 */
export async function GET(
  request: NextRequest,
): Promise<NextResponse<ApiResponse>> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const limit = searchParams.get('limit') || '20';
    const lastId = searchParams.get('lastId');

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: '缺少必要參數: userId',
        },
        { status: 400 },
      );
    }

    if (!DIFY_SERVICE_URL || !DIFY_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: 'Dify API 配置缺失',
        },
        { status: 500 },
      );
    }

    console.log(`\n📋 ===== 取得對話列表 =====`);
    console.log(`👤 User: ${userId}`);

    // 建立 Dify API URL
    const url = new URL(`${DIFY_SERVICE_URL}/conversations`);
    url.searchParams.set('user', userId);
    url.searchParams.set(
      'limit',
      Math.min(parseInt(limit, 10), 100).toString(),
    );
    url.searchParams.set('sort_by', '-updated_at');

    if (lastId) {
      url.searchParams.set('last_id', lastId);
    }

    // 呼叫 Dify API
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

    const result = {
      conversations: data.data || [],
      hasMore: data.has_more || false,
    };

    console.log(`✅ 取得 ${result.conversations.length} 個對話`);
    console.log(`\n✅ ===== 對話列表取得完成 =====\n`);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('❌ 取得對話列表錯誤:', error);
    return NextResponse.json(
      {
        success: false,
        error: '取得對話列表失敗',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
