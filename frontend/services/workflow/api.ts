// frontend/services/workflow/api.ts
// Workflow API Fetcher（純函數，不包含 React Query）

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
  const response = await backendClient.post(`/api/workflow/${type}`, body);

  return WorkflowResponseSchema.parse(response.data);
}
