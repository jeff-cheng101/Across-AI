// frontend/services/workflow/type.ts
// Workflow 類型定義和 Zod Schemas

import { z } from 'zod';

/**
 * Workflow 功能類型（與後端保持一致）
 */
export const WorkflowTypeSchema = z.enum(['ip-block-quick']);
export type WorkflowType = z.infer<typeof WorkflowTypeSchema>;

/**
 * Workflow 請求 Body Schema
 */
export const WorkflowRequestSchema = z.object({
  inputs: z.record(z.string(), z.unknown()),
  response_mode: z.enum(['blocking', 'streaming']).default('blocking'),
  user: z.string().min(1),
});

/**
 * Workflow 回應 Schema
 */
export const WorkflowResponseSchema = z.object({
  success: z.boolean(),
  error: z.string().optional(),
});

/**
 * Workflow 請求類型
 */
export type WorkflowRequest = z.infer<typeof WorkflowRequestSchema>;

/**
 * Workflow 回應類型
 */
export type WorkflowResponse = z.infer<typeof WorkflowResponseSchema>;

/**
 * 執行 Workflow 的參數
 */
export type ExecuteWorkflowParams = {
  type: WorkflowType;
  body: WorkflowRequest;
};
