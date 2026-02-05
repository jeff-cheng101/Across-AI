/**
 * Guardrails API Route - 單一護欄操作
 *
 * 業務背景：代理 LiteLLM Guardrails API，提供單一護欄的 CRUD 操作
 *
 * 資料流：前端 → Next.js Route Handler → LiteLLM API
 *
 * 端點：
 * - GET /api/guardrails/:id - 獲取單一護欄詳情
 * - PUT /api/guardrails/:id - 更新護欄
 * - DELETE /api/guardrails/:id - 刪除護欄
 *
 * 依賴：
 * - LITELLM_API_URL: LiteLLM 服務 URL
 * - LITELLM_API_KEY: LiteLLM API 金鑰
 */

import { type NextRequest, NextResponse } from 'next/server';
import {
  axios,
  createLiteLLMClient,
  errorResponse,
  handleAxiosError,
  jsonResponse,
} from '@/lib/litellm-client';

// ============================================================
// 強制動態路由
// ============================================================
export const dynamic = 'force-dynamic';

// ============================================================
// Route Handlers
// ============================================================

/**
 * GET /api/guardrails/:id
 * 獲取單一護欄詳情
 *
 * 業務背景：呼叫 LiteLLM GET /guardrails/{id}/info 端點
 *
 * 邊界條件：
 * - ID 不存在時返回 404 錯誤
 * - ID 格式無效時返回 400 錯誤
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const requestStartTime = Date.now();
  const { id } = await params;

  if (!id) {
    return errorResponse('缺少護欄 ID', 400);
  }

  try {
    const litellmClient = createLiteLLMClient();

    console.log('📄 獲取 Guardrail 詳情...', {
      timestamp: new Date().toISOString(),
      guardrailId: id,
    });

    const response = await litellmClient.get(`/guardrails/${id}/info`);
    const duration = Date.now() - requestStartTime;

    console.log('✅ Guardrail 詳情獲取成功', {
      timestamp: new Date().toISOString(),
      guardrailId: id,
      duration: `${duration}ms`,
    });

    return jsonResponse(response.data);
  } catch (error) {
    const duration = Date.now() - requestStartTime;

    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return errorResponse('護欄不存在', 404);
    }

    return handleAxiosError(error, {
      operation: `獲取護欄詳情 (${id})`,
      duration,
    });
  }
}

/**
 * PUT /api/guardrails/:id
 * 更新護欄
 *
 * 業務背景：呼叫 LiteLLM PUT /guardrails/{id} 端點
 *
 * Request Body 格式：
 * {
 *   "guardrailName": "string",
 *   "provider": "string",
 *   "mode": "string",
 *   ...其他設定
 * }
 *
 * 邊界條件：
 * - ID 不存在時返回 404 錯誤
 * - 必要參數缺失時返回 400 錯誤
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const requestStartTime = Date.now();
  const { id } = await params;

  if (!id) {
    return errorResponse('缺少護欄 ID', 400);
  }

  try {
    const litellmClient = createLiteLLMClient();

    // 解析請求內容
    let requestBody: unknown;
    try {
      requestBody = await request.json();
    } catch {
      return errorResponse('無效的 JSON 格式', 400);
    }

    console.log('✏️ 更新 Guardrail...', {
      timestamp: new Date().toISOString(),
      guardrailId: id,
      body: requestBody,
    });

    const response = await litellmClient.put(`/guardrails/${id}`, requestBody);
    const duration = Date.now() - requestStartTime;

    console.log('✅ Guardrail 更新成功', {
      timestamp: new Date().toISOString(),
      guardrailId: id,
      duration: `${duration}ms`,
    });

    return jsonResponse(response.data);
  } catch (error) {
    const duration = Date.now() - requestStartTime;

    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return errorResponse('護欄不存在', 404);
    }

    return handleAxiosError(error, { operation: `更新護欄 (${id})`, duration });
  }
}

/**
 * DELETE /api/guardrails/:id
 * 刪除護欄
 *
 * 業務背景：呼叫 LiteLLM DELETE /guardrails/{id} 端點
 *
 * 邊界條件：
 * - ID 不存在時返回 404 錯誤
 * - 刪除成功返回 204 No Content
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const requestStartTime = Date.now();
  const { id } = await params;

  if (!id) {
    return errorResponse('缺少護欄 ID', 400);
  }

  try {
    const litellmClient = createLiteLLMClient();

    console.log('🗑️ 刪除 Guardrail...', {
      timestamp: new Date().toISOString(),
      guardrailId: id,
    });

    await litellmClient.delete(`/guardrails/${id}`);
    const duration = Date.now() - requestStartTime;

    console.log('✅ Guardrail 刪除成功', {
      timestamp: new Date().toISOString(),
      guardrailId: id,
      duration: `${duration}ms`,
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const duration = Date.now() - requestStartTime;

    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return errorResponse('護欄不存在', 404);
    }

    return handleAxiosError(error, { operation: `刪除護欄 (${id})`, duration });
  }
}
