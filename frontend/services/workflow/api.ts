// frontend/services/workflow/api.ts
// Workflow API Fetcher（純函數，不包含 React Query）

import type { AxiosError } from 'axios';
import { nextClient } from '@/lib/api-clients';
import {
  type CloudflareAnalysisResponse,
  CloudflareAnalysisResponseSchema,
  type ExecuteWorkflowParams,
  type WorkflowResponse,
  WorkflowResponseSchema,
} from './type';

/**
 * 執行 Workflow API 請求
 * 這是一個純函數，可以在任何地方使用（React Query、直接呼叫等）
 *
 * 注意：Workflow API 透過 Next.js Route Handler 直接連接 Dify
 *
 * TODO: 未來不同 workflow 可能會有不同的 input 格式
 * 例如：ip-block-quick 需要 { IPlist: string }
 * 其他 workflow 可能需要不同的 input 結構
 * 未來需要根據 workflow type 動態處理不同的 input 格式
 */
export async function executeWorkflow({
  type,
  body,
}: ExecuteWorkflowParams): Promise<WorkflowResponse> {
  try {
    const response = await nextClient.post(`/workflow/${type}`, body);
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

/**
 * 執行 Cloudflare 攻擊分析 Workflow
 * @param timeRange - 時間範圍，如 "1h", "24h", "7d" 等
 * @param user - 使用者 email
 * @returns Cloudflare 分析回應
 */
export async function executeCloudflareAnalysis(params: {
  timeRange: string;
  user: string;
}): Promise<CloudflareAnalysisResponse> {
  try {
    const response = await nextClient.post(
      '/workflow/cloudflare-attack-analysis',
      {
        inputs: { time_range: params.timeRange },
        response_mode: 'streaming',
        user: params.user,
      },
    );
    return CloudflareAnalysisResponseSchema.parse(response.data);
  } catch (error) {
    const axiosError = error as AxiosError<{
      success: boolean;
      error?: string;
    }>;
    if (axiosError.response?.data?.error) {
      throw new Error(axiosError.response.data.error);
    }
    throw new Error(
      axiosError.message || '執行 Cloudflare 分析 workflow 失敗，請稍後再試',
    );
  }
}
