/**
 * Guardrails Test API Route - 測試護欄
 *
 * 業務背景：代理 LiteLLM Guardrails API，提供護欄測試功能
 *
 * 資料流：前端 → Next.js Route Handler → LiteLLM API
 *
 * 端點：
 * - POST /api/guardrails/test - 測試護欄
 *
 * 依賴：
 * - LITELLM_API_URL: LiteLLM 服務 URL
 * - LITELLM_API_KEY: LiteLLM API 金鑰
 */

import type { NextRequest } from 'next/server';
import { z } from 'zod';
import {
  axios,
  createLiteLLMClient,
  errorResponse,
  jsonResponse,
} from '@/lib/litellm-client';

// ============================================================
// 強制動態路由
// ============================================================
export const dynamic = 'force-dynamic';

// ============================================================
// Request Schema
// ============================================================

/**
 * 測試 Guardrail 請求 Schema
 *
 * 邊界條件：
 * - guardrailName 最大長度 100 字元
 * - text 最大長度 10,000 字元，避免過大請求
 */
const TestGuardrailRequestSchema = z.object({
  guardrailName: z.string().min(1, '護欄名稱不可為空').max(100, '護欄名稱過長'),
  text: z
    .string()
    .min(1, '測試文字不可為空')
    .max(10000, '測試文字過長（上限 10,000 字元）'),
  isUserMessage: z.boolean().default(true),
});

// ============================================================
// Helper Functions
// ============================================================

/**
 * 從 LiteLLM 錯誤回應中提取 guardrail 錯誤訊息
 *
 * 業務背景：LiteLLM 在 guardrail 阻擋內容時會返回錯誤，
 * 錯誤格式可能包含多種結構，需要統一提取。
 *
 * 常見格式：
 * - Bedrock: { error: 'Violated guardrail policy', bedrock_guardrail_response: '...' }
 * - Presidio: { detail: '...' } 或 { error: '...' }
 *
 * @param responseData LiteLLM API 錯誤回應資料
 * @returns 格式化的錯誤訊息
 */
function extractGuardrailErrorMessage(responseData: unknown): string {
  if (!responseData || typeof responseData !== 'object') {
    return '護欄檢測未通過';
  }

  const data = responseData as Record<string, unknown>;

  // 嘗試提取各種格式的錯誤訊息
  const parts: string[] = [];

  // Bedrock 格式
  if (data.error && typeof data.error === 'string') {
    parts.push(data.error);
  }
  if (
    data.bedrock_guardrail_response &&
    typeof data.bedrock_guardrail_response === 'string'
  ) {
    parts.push(data.bedrock_guardrail_response);
  }

  // 通用格式
  if (data.detail && typeof data.detail === 'string') {
    parts.push(data.detail);
  }
  if (data.message && typeof data.message === 'string' && !parts.length) {
    parts.push(data.message);
  }

  // 如果有 error 物件，嘗試提取
  if (data.error && typeof data.error === 'object') {
    const errorObj = data.error as Record<string, unknown>;
    if (errorObj.message && typeof errorObj.message === 'string') {
      parts.push(errorObj.message);
    }
  }

  if (parts.length > 0) {
    return parts.join(' - ');
  }

  // 如果無法提取，返回整個物件的 JSON 字串
  try {
    return JSON.stringify(data);
  } catch {
    return '護欄檢測未通過';
  }
}

// ============================================================
// Route Handlers
// ============================================================

/**
 * POST /api/guardrails/test
 * 測試護欄
 *
 * 業務背景：呼叫 LiteLLM POST /guardrails/apply_guardrail 端點
 * 用於驗證護欄設定是否正確運作
 *
 * Request Body 格式：
 * {
 *   "guardrailName": "string",
 *   "text": "string",
 *   "isUserMessage": boolean
 * }
 *
 * 邊界條件：
 * - 護欄名稱不存在時返回 404 錯誤
 * - 測試文字為空時返回 400 錯誤
 */
export async function POST(request: NextRequest) {
  const requestStartTime = Date.now();

  try {
    // 測試可能需要較長時間，設定 60 秒超時
    const litellmClient = createLiteLLMClient(60000);

    // 解析並驗證請求內容
    let requestBody: unknown;
    try {
      requestBody = await request.json();
    } catch {
      return errorResponse('無效的 JSON 格式', 400);
    }

    const parseResult = TestGuardrailRequestSchema.safeParse(requestBody);
    if (!parseResult.success) {
      console.warn('⚠️ 請求驗證失敗', {
        timestamp: new Date().toISOString(),
        errors: parseResult.error.issues,
      });
      return errorResponse(
        parseResult.error.issues.map((i) => i.message).join(', '),
        400,
      );
    }

    const { guardrailName, text } = parseResult.data;

    console.log('🧪 測試 Guardrail...', {
      timestamp: new Date().toISOString(),
      guardrailName,
      textLength: text.length,
    });

    // 呼叫 LiteLLM apply_guardrail 端點
    // API 格式參考：https://docs.litellm.ai/docs/apply_guardrail
    // 必要欄位：guardrail_name, text
    const litellmPayload = {
      guardrail_name: guardrailName,
      text: text,
    };

    const response = await litellmClient.post(
      '/guardrails/apply_guardrail',
      litellmPayload,
    );
    const duration = Date.now() - requestStartTime;

    // LiteLLM apply_guardrail 端點回應格式：{ response_text: string }
    // 如果護欄阻擋內容，會返回錯誤而非正常回應
    const responseText = response.data?.response_text;

    console.log('✅ Guardrail 測試完成', {
      timestamp: new Date().toISOString(),
      guardrailName,
      duration: `${duration}ms`,
      responseText,
    });

    // 轉換回應格式給前端使用
    // 比對原始文字和回應文字來判斷是否有修改（如 PII 遮罩）
    const wasModified = responseText !== text;
    const testResult = {
      success: true,
      passed: true,
      processedText: responseText,
      wasModified,
      duration,
      rawResponse: response.data,
    };

    return jsonResponse(testResult);
  } catch (error) {
    const duration = Date.now() - requestStartTime;

    // 處理 Axios 錯誤，特別是 guardrail 阻擋的情況
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;

      console.log('⚠️ Guardrail 測試錯誤', {
        timestamp: new Date().toISOString(),
        status,
        duration: `${duration}ms`,
        responseData,
      });

      if (status === 404) {
        return errorResponse('護欄不存在', 404);
      }

      // Guardrail 阻擋內容時，LiteLLM 通常返回 400 或 500
      // 我們將這個情況視為「測試成功但未通過」，返回結構化結果
      // 這樣前端可以顯示詳細的錯誤訊息
      const errorMessage = extractGuardrailErrorMessage(responseData);

      const testResult = {
        success: true,
        passed: false,
        error: errorMessage,
        duration,
        rawResponse: responseData,
      };

      return jsonResponse(testResult);
    }

    // 非 Axios 錯誤（如網路錯誤）
    console.error('❌ 測試護欄時發生錯誤', {
      timestamp: new Date().toISOString(),
      duration: `${duration}ms`,
      error: error instanceof Error ? error.message : String(error),
    });

    return errorResponse('測試護欄時發生錯誤', 500);
  }
}
