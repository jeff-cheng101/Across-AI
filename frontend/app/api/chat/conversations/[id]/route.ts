// frontend/app/api/chat/conversations/[id]/route.ts
// 刪除對話 - Route Handler

import { type NextRequest, NextResponse } from 'next/server';

const DIFY_SERVICE_URL = process.env.DIFY_SERVICE_URL;
const DIFY_API_KEY = process.env.DIFY_API_KEY;

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

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * DELETE /api/chat/conversations/[id]
 * 刪除對話
 */
export async function DELETE(
  request: NextRequest,
  context: RouteContext,
): Promise<NextResponse<ApiResponse>> {
  try {
    const { id: conversationId } = await context.params;
    const body = (await request.json()) as { userId?: string };
    const { userId } = body;

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

    console.log(`\n🗑️ ===== 刪除對話 =====`);
    console.log(`🔗 Conversation: ${conversationId}`);
    console.log(`👤 User: ${userId}`);

    // 呼叫 Dify API
    const response = await fetch(
      `${DIFY_SERVICE_URL}/conversations/${conversationId}`,
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

    console.log(`✅ 對話已刪除`);
    console.log(`\n✅ ===== 對話刪除完成 =====\n`);

    return NextResponse.json({
      success: true,
      message: '對話已刪除',
    });
  } catch (error) {
    console.error('❌ 刪除對話錯誤:', error);
    return NextResponse.json(
      {
        success: false,
        error: '刪除對話失敗',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
