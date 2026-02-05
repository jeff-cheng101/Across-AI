/**
 * Guardrails API Route - 列表與新增
 *
 * 業務背景：代理 LiteLLM Guardrails API，提供護欄管理功能
 *
 * 資料流：前端 → Next.js Route Handler → LiteLLM API
 *
 * 端點：
 * - GET /api/guardrails - 獲取所有護欄列表
 * - POST /api/guardrails - 新增護欄
 *
 * 依賴：
 * - LITELLM_API_URL: LiteLLM 服務 URL
 * - LITELLM_API_KEY: LiteLLM API 金鑰
 */

import type { NextRequest } from 'next/server';
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
 * GET /api/guardrails
 * 獲取所有護欄列表
 *
 * 業務背景：呼叫 LiteLLM GET /v2/guardrails/list 端點
 *
 * 邊界條件：
 * - LiteLLM 未配置時返回 500 錯誤
 * - API 金鑰無效時返回 401 錯誤
 */
export async function GET() {
  const requestStartTime = Date.now();

  try {
    const litellmClient = createLiteLLMClient();

    console.log('📋 獲取 Guardrails 列表...', {
      timestamp: new Date().toISOString(),
    });

    const response = await litellmClient.get('/v2/guardrails/list');
    const duration = Date.now() - requestStartTime;

    console.log('✅ Guardrails 列表獲取成功', {
      timestamp: new Date().toISOString(),
      count: Array.isArray(response.data) ? response.data.length : 0,
      duration: `${duration}ms`,
    });

    // LiteLLM 回傳格式可能是 { data: [...] } 或直接是陣列
    const guardrails = response.data?.data ?? response.data ?? [];

    return jsonResponse(guardrails);
  } catch (error) {
    const duration = Date.now() - requestStartTime;

    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return errorResponse('Guardrails 端點不存在', 404);
    }

    return handleAxiosError(error, { operation: '獲取護欄列表', duration });
  }
}

/**
 * POST /api/guardrails
 * 新增護欄
 *
 * 業務背景：呼叫 LiteLLM POST /guardrails 端點
 *
 * Request Body 格式：
 * {
 *   "guardrail": {
 *     "guardrail_name": "string",
 *     "litellm_params": { ... }
 *   }
 * }
 *
 * 邊界條件：
 * - 名稱重複時返回 400 錯誤
 * - 必要參數缺失時返回 400 錯誤
 */
export async function POST(request: NextRequest) {
  const requestStartTime = Date.now();

  try {
    const litellmClient = createLiteLLMClient();

    // 解析請求內容
    let requestBody: unknown;
    try {
      requestBody = await request.json();
    } catch {
      return errorResponse('無效的 JSON 格式', 400);
    }

    console.log('➕ 新增 Guardrail...', {
      timestamp: new Date().toISOString(),
      body: requestBody,
    });

    const response = await litellmClient.post('/guardrails', requestBody);
    const duration = Date.now() - requestStartTime;

    console.log('✅ Guardrail 新增成功', {
      timestamp: new Date().toISOString(),
      duration: `${duration}ms`,
      guardrailId: response.data?.guardrail_id,
    });

    return jsonResponse(response.data, 201);
  } catch (error) {
    const duration = Date.now() - requestStartTime;

    if (axios.isAxiosError(error) && error.response?.status === 409) {
      return errorResponse('護欄名稱已存在', 409);
    }

    return handleAxiosError(error, { operation: '新增護欄', duration });
  }
}
