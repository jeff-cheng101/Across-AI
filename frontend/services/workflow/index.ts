// frontend/services/workflow/index.ts
// Workflow Service 統一導出

// API 函數
export { executeWorkflow } from './api';
// 類型定義（先導出，確保類型優先解析）
export type {
  ExecuteWorkflowParams,
  WorkflowRequest,
  WorkflowResponse,
  WorkflowType,
} from './type';

// 如果需要 Zod Schemas，可以直接從 './type' 導入
// export { WorkflowTypeSchema, WorkflowRequestSchema, WorkflowResponseSchema } from './type';
