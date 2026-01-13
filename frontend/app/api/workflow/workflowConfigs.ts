// frontend/app/api/workflow/workflowConfigs.ts
// Workflow 執行配置

import { WorkflowSchemas, type WorkflowType } from '@/services/workflow/type';

/**
 * Workflow 執行配置類型
 */
export type WorkflowConfig = {
  /** 執行模式：blocking 或 streaming */
  mode: 'blocking' | 'streaming';
  /** 超時時間（毫秒） */
  timeout: number;
};

/**
 * 各 Workflow 的執行配置
 */
export const WorkflowConfigs: Record<WorkflowType, WorkflowConfig> = {
  'ip-block-quick': {
    mode: 'blocking',
    timeout: 30000, // 30 秒
  },
  'ip-unblock-quick': {
    mode: 'blocking',
    timeout: 30000, // 30 秒
  },
  'cloudflare-attack-analysis': {
    mode: 'streaming',
    timeout: 3000000, // 50 分鐘
  },
};

/**
 * 取得 Workflow 完整配置（包含 schema）
 * @param type - Workflow 類型
 * @returns 完整配置（執行配置 + schema）
 */
export function getWorkflowConfig(type: WorkflowType) {
  const config = WorkflowConfigs[type];
  const schemas = WorkflowSchemas[type];
  return {
    ...config,
    requestSchema: schemas.requestSchema,
    responseSchema: schemas.responseSchema,
  };
}

/**
 * 取得 Workflow API Key
 * @param workflowType - Workflow 類型
 * @returns API Key 或 null
 */
export function getWorkflowApiKey(workflowType: WorkflowType): string | null {
  const apiKeys: Record<WorkflowType, string | undefined> = {
    'ip-block-quick': process.env.DIFY_WORKFLOW_API_KEY_IP_BLOCK_QUICK,
    'ip-unblock-quick': process.env.DIFY_WORKFLOW_API_KEY_IP_UNBLOCK_QUICK,
    'cloudflare-attack-analysis':
      process.env.DIFY_WORKFLOW_API_KEY_CLOUDFLARE_ATTACK_ANALYSIS,
  };

  return apiKeys[workflowType] || null;
}
