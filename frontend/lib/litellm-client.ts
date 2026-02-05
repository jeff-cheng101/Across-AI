/**
 * LiteLLM API 客戶端共用模組
 *
 * 業務背景：提供統一的 LiteLLM API 客戶端，用於 Guardrails 等功能的 API Route。
 * 將重複的環境變數處理、HTTP 客戶端建立、回應格式化等邏輯集中管理。
 *
 * 資料流：Next.js Route Handler → 本模組 → LiteLLM API
 *
 * 依賴：
 * - LITELLM_API_URL: LiteLLM 服務 URL
 * - LITELLM_API_KEY: LiteLLM API 金鑰
 */

import https from 'node:https';
import axios, { type AxiosInstance } from 'axios';
import { NextResponse } from 'next/server';

// ============================================================
// 環境變數處理
// ============================================================

/**
 * 取得必要的環境變數
 *
 * 業務背景：環境變數未設定時必須拋出明確錯誤，避免隱性失敗。
 * 符合專案規範：禁止使用預設值 fallback。
 *
 * @param name 環境變數名稱
 * @returns 環境變數值
 * @throws Error 當環境變數未設定時
 */
export function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`環境變數 ${name} 未設定`);
  }
  return value;
}

// ============================================================
// HTTPS Agent
// ============================================================

/**
 * HTTPS Agent - 開發環境忽略自簽憑證
 *
 * 業務背景：內部服務可能使用自簽憑證，生產環境應使用正式憑證。
 * 開發環境設定 rejectUnauthorized: false 以便連接自簽憑證服務。
 */
const httpsAgent = new https.Agent({
  rejectUnauthorized: process.env.NODE_ENV === 'production',
});

// ============================================================
// LiteLLM API 客戶端
// ============================================================

/**
 * 預設請求超時時間（毫秒）
 */
const DEFAULT_TIMEOUT = 30000;

/**
 * 建立 LiteLLM API 客戶端
 *
 * 業務背景：統一的 axios 實例，包含認證和錯誤處理。
 * 所有 LiteLLM API 呼叫都應使用此函數建立的客戶端。
 *
 * @param timeout 請求超時時間（毫秒），預設 30000ms
 * @returns 配置好的 AxiosInstance
 */
export function createLiteLLMClient(
  timeout: number = DEFAULT_TIMEOUT,
): AxiosInstance {
  const baseURL = getRequiredEnv('LITELLM_API_URL');
  const apiKey = getRequiredEnv('LITELLM_API_KEY');

  return axios.create({
    baseURL,
    timeout,
    httpsAgent,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
  });
}

// ============================================================
// JSON Response 輔助函數
// ============================================================

/**
 * 建立成功的 JSON 回應
 *
 * @param data 回應資料
 * @param status HTTP 狀態碼，預設 200
 * @returns NextResponse
 */
export function jsonResponse(
  data: unknown,
  status: number = 200,
): NextResponse {
  return NextResponse.json(data, { status });
}

/**
 * 建立錯誤的 JSON 回應
 *
 * 業務背景：統一錯誤回應格式，方便前端處理。
 * 格式：{ success: false, error: string }
 *
 * @param error 錯誤訊息
 * @param status HTTP 狀態碼，預設 500
 * @returns NextResponse
 */
export function errorResponse(
  error: string,
  status: number = 500,
): NextResponse {
  return NextResponse.json({ success: false, error }, { status });
}

// ============================================================
// 錯誤處理輔助函數
// ============================================================

/**
 * 處理 Axios 錯誤並返回適當的錯誤回應
 *
 * 業務背景：統一處理 LiteLLM API 的錯誤回應，
 * 將常見錯誤碼轉換為使用者友善的訊息。
 *
 * @param error Axios 錯誤物件
 * @param context 上下文資訊，用於日誌記錄
 * @returns NextResponse
 */
export function handleAxiosError(
  error: unknown,
  context: { operation: string; duration: number },
): NextResponse {
  if (axios.isAxiosError(error)) {
    console.error(`❌ LiteLLM API 錯誤 - ${context.operation}`, {
      timestamp: new Date().toISOString(),
      duration: `${context.duration}ms`,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });

    // 常見錯誤碼處理
    switch (error.response?.status) {
      case 400: {
        const errorMessage =
          error.response?.data?.detail ||
          error.response?.data?.error ||
          '請求參數錯誤';
        return errorResponse(errorMessage, 400);
      }
      case 401:
        return errorResponse('API 金鑰無效', 401);
      case 404:
        return errorResponse('資源不存在', 404);
      case 409:
        return errorResponse('資源已存在', 409);
      case 422: {
        // FastAPI/Pydantic 驗證錯誤，detail 通常是陣列
        const detail = error.response?.data?.detail;
        let errorMessage = '請求內容驗證失敗';

        if (Array.isArray(detail) && detail.length > 0) {
          // 格式：[{loc: ["body", "field"], msg: "error", type: "value_error"}]
          const messages = detail.map((d) => {
            const field = d.loc?.slice(1).join('.') || 'unknown';
            return `${field}: ${d.msg}`;
          });
          errorMessage = messages.join('; ');

          // 記錄詳細錯誤到 console
          console.error('422 驗證錯誤詳情:', JSON.stringify(detail, null, 2));
        }

        return errorResponse(errorMessage, 422);
      }
      default:
        return errorResponse(
          `LiteLLM 服務錯誤: ${error.response?.statusText || error.message}`,
          error.response?.status || 500,
        );
    }
  }

  // 非 Axios 錯誤
  console.error(`❌ 未預期錯誤 - ${context.operation}`, {
    timestamp: new Date().toISOString(),
    duration: `${context.duration}ms`,
    error: error instanceof Error ? error.message : String(error),
  });

  return errorResponse('服務錯誤', 500);
}

// ============================================================
// 重新匯出 axios 工具函數
// ============================================================

export { axios };
