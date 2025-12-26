// frontend/services/workflow/api.ts
// Workflow API Fetcher（純函數，不包含 React Query）

import type { AxiosError } from 'axios';
import { backendClient } from '@/lib/api-clients';
import {
  type ExecuteWorkflowParams,
  type WorkflowResponse,
  WorkflowResponseSchema,
} from './type';

/**
 * 執行 Workflow API 請求
 * 這是一個純函數，可以在任何地方使用（React Query、直接呼叫等）
 *
 * 注意：Workflow API 是透過後端 proxy（後端使用 DIFY_BASE_URL）
 */
export async function executeWorkflow({
  type,
  body,
}: ExecuteWorkflowParams): Promise<WorkflowResponse> {
  try {
    const response = await backendClient.post(`/api/workflow/${type}`, body);
    return WorkflowResponseSchema.parse(response.data);
  } catch (error) {
    // 處理錯誤回應
    const axiosError = error as AxiosError<WorkflowResponse>;
    if (axiosError.response?.data) {
      // 後端回傳的錯誤格式：{ success: false, error: string }
      const errorData = axiosError.response.data;
      if (errorData.error) {
        throw new Error(errorData.error);
      }
    }
    // 如果無法取得錯誤訊息，使用預設訊息
    throw new Error(axiosError.message || '執行 workflow 失敗，請稍後再試');
  }
}
