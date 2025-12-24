// backend/utils/difyWorkflowMapping.ts
// Dify Workflow API Key 映射配置

import { z } from 'zod';

/**
 * Workflow 功能類型
 */
export const WorkflowTypeSchema = z.enum(['ip-block-quick']);
export type WorkflowType = z.infer<typeof WorkflowTypeSchema>;

/**
 * 獲取指定功能的 Workflow API Key
 */
export function getWorkflowApiKey(workflowType: WorkflowType): string | null {
  const apiKeys: Record<WorkflowType, string | undefined> = {
    'ip-block-quick': process.env.DIFY_WORKFLOW_API_KEY_IP_BLOCK_QUICK,
  };

  return apiKeys[workflowType] || null;
}
