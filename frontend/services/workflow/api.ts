// frontend/services/workflow/api.ts
// Workflow API Fetcher（純函數，不包含 React Query）

import {
  type ExecuteWorkflowParams,
  type WorkflowResponse,
  WorkflowResponseSchema,
} from './type';

/**
 * 執行 Workflow API 請求
 * 這是一個純函數，可以在任何地方使用（React Query、直接呼叫等）
 */
export async function executeWorkflow({
  type,
  body,
}: ExecuteWorkflowParams): Promise<WorkflowResponse> {
  const response = await fetch(`/api/workflow/${type}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return WorkflowResponseSchema.parse(data);
}
