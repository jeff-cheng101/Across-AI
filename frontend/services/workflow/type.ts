// frontend/services/workflow/type.ts
// Workflow 類型定義和 Zod Schemas

import { z } from 'zod';

/**
 * Workflow 功能類型（與後端保持一致）
 */
export const WorkflowTypeSchema = z.enum([
  'ip-block-quick',
  'ip-unblock-quick',
  'cloudflare-attack-analysis',
]);
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

// ============================================================
// ip-block-quick Schemas
// ============================================================

/**
 * IP 封鎖輸入參數
 */
export const IpBlockInputSchema = z.object({
  IPlist: z.string().min(1, 'IP 列表不能為空'),
});
export type IpBlockInput = z.infer<typeof IpBlockInputSchema>;

/**
 * IP 封鎖回應
 */
export const IpBlockOutputSchema = z.object({
  success: z.boolean(),
  error: z.string().optional(),
});
export type IpBlockOutput = z.infer<typeof IpBlockOutputSchema>;

// ============================================================
// ip-unblock-quick Schemas
// ============================================================

/**
 * IP 解封輸入參數
 */
export const IpUnblockInputSchema = z.object({
  IPlist: z.string().min(1, 'IP 列表不能為空'),
});
export type IpUnblockInput = z.infer<typeof IpUnblockInputSchema>;

/**
 * IP 解封回應
 */
export const IpUnblockOutputSchema = z.object({
  success: z.boolean(),
  error: z.string().optional(),
});
export type IpUnblockOutput = z.infer<typeof IpUnblockOutputSchema>;

// ============================================================
// cloudflare-attack-analysis Schemas
// ============================================================

/**
 * Cloudflare 攻擊分析輸入參數
 */
export const CloudflareAnalysisInputSchema = z.object({
  time_range: z.string().min(1, '時間範圍不能為空'),
});

/**
 * 建議操作 Schema
 */
export const RecommendationSchema = z.object({
  title: z.string(),
  description: z.string(),
  priority: z.enum(['high', 'medium', 'low']),
  actionId: z.string().optional(),
});

/**
 * 風險項目 Schema（與 WAFRiskData 相容）
 */
export const RiskSchema = z.object({
  id: z.string(),
  title: z.string(),
  severity: z.enum(['critical', 'high', 'medium', 'low']),
  description: z.string(),
  affectedAssets: z.number(),
  openIssues: z.number(),
  resolvedIssues: z.number(),
  // WAFRiskData 必要屬性
  tags: z.array(z.string()).default([]),
  createdDate: z.string().default(''),
  updatedDate: z.string().default(''),
  exploitInWild: z.boolean().default(false),
  internetExposed: z.boolean().default(false),
  confirmedExploitable: z.boolean().default(false),
  // 選填屬性
  firstSeen: z.string().optional(),
  lastSeen: z.string().optional(),
  status: z.string().optional(),
  cveId: z.string().optional(),
  aiInsight: z.string().optional(),
  affectedUrlList: z.array(z.string()).optional(),
  topAttackers: z
    .array(
      z.object({
        ip: z.string(),
        country: z.string(),
        eventCount: z.number(),
        dropCount: z.number(),
        blockRate: z.string(),
        behavior: z.string(),
        targetPorts: z.array(z.number()).optional(),
      }),
    )
    .optional(),
  recommendations: z.array(RecommendationSchema),
});

/**
 * 分析 Metadata Schema
 */
export const AnalysisMetadataSchema = z.object({
  totalEvents: z.number(),
  timeRange: z.object({
    start: z.string(),
    end: z.string(),
  }),
  aiProvider: z.string().optional(),
  model: z.string().optional(),
  analysisTimestamp: z.string(),
});

/**
 * Cloudflare 分析回應 Schema
 */
export const CloudflareAnalysisResponseSchema = z.object({
  success: z.boolean(),
  product: z.string().optional(),
  risks: z.array(RiskSchema).optional(),
  metadata: AnalysisMetadataSchema.optional(),
  error: z.string().optional(),
});

/**
 * Cloudflare 分析回應類型
 */
export type CloudflareAnalysisResponse = z.infer<
  typeof CloudflareAnalysisResponseSchema
>;

/**
 * 風險項目類型
 */
export type Risk = z.infer<typeof RiskSchema>;

/**
 * 建議操作類型
 */
export type Recommendation = z.infer<typeof RecommendationSchema>;

// ============================================================
// Workflow Schemas Map - 統一結構
// ============================================================

/**
 * 各 Workflow 的 Schema 配置
 * 結構：{ workflowType: { requestSchema, responseSchema } }
 */
export const WorkflowSchemas = {
  'ip-block-quick': {
    requestSchema: IpBlockInputSchema,
    responseSchema: IpBlockOutputSchema,
  },
  'ip-unblock-quick': {
    requestSchema: IpUnblockInputSchema,
    responseSchema: IpUnblockOutputSchema,
  },
  'cloudflare-attack-analysis': {
    requestSchema: CloudflareAnalysisInputSchema,
    responseSchema: CloudflareAnalysisResponseSchema,
  },
} as const;

/**
 * WorkflowSchemas 類型
 */
export type WorkflowSchemasType = typeof WorkflowSchemas;
