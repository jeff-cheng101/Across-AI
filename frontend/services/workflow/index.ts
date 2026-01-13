// frontend/services/workflow/index.ts
// Workflow Service 統一導出

// API 函數
export { executeCloudflareAnalysis, executeWorkflow } from './api';

// 類型定義（先導出，確保類型優先解析）
export type {
  CloudflareAnalysisResponse,
  ExecuteWorkflowParams,
  IpBlockInput,
  IpBlockOutput,
  IpUnblockInput,
  IpUnblockOutput,
  Recommendation,
  Risk,
  WorkflowRequest,
  WorkflowResponse,
  WorkflowSchemasType,
  WorkflowType,
} from './type';

// Zod Schemas（如需要在組件中使用）
export {
  CloudflareAnalysisInputSchema,
  CloudflareAnalysisResponseSchema,
  IpBlockInputSchema,
  IpBlockOutputSchema,
  IpUnblockInputSchema,
  IpUnblockOutputSchema,
  RiskSchema,
  WorkflowSchemas,
  WorkflowTypeSchema,
} from './type';
