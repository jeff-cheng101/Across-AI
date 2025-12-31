import { Shield, Unlock } from 'lucide-react';
import type React from 'react';
import { getCurrentUser } from '@/app/util/authenticator';
import { executeWorkflow } from '@/services/workflow';
import type { WorkflowType } from '@/services/workflow/type';

export type AgentType =
  | 'block-ip'
  | 'unblock-ip'
  | 'deploy-policy'
  | 'upgrade'
  | null;

export interface WorkflowStep {
  step: number;
  title: string;
  description: string;
}

/**
 * 執行函數類型
 * 接收用戶輸入的內容，返回執行結果
 */
export type ExecuteFunction = (
  content: string,
) => Promise<{ success: boolean; error?: string }>;

export interface AgentConfig {
  id: AgentType;
  title: string;
  description: string;
  icon: React.ReactNode;
  // Workflow 類型（對應後端的 workflow type）
  workflowType: string;
  // 工作流程步驟
  workflowSteps: WorkflowStep[];
  // 執行函數：根據內容構建 inputs 並執行 workflow
  executeFn: ExecuteFunction;
}

/**
 * 創建執行函數的工廠函數
 * 根據不同的 workflow type 和 agent id 構建不同的 inputs 結構
 */
const createExecuteFn = (
  workflowType: string,
  agentId: AgentType,
): ExecuteFunction => {
  return async (content: string) => {
    const currentUser = getCurrentUser();
    if (!currentUser?.email) {
      throw new Error('無法獲取當前用戶資訊，請重新登入');
    }

    // 根據不同的 agent 構建不同的 inputs 結構
    let inputs: Record<string, unknown> = {};

    switch (agentId) {
      case 'block-ip':
      case 'unblock-ip':
        // IP 相關的操作使用 IPlist
        inputs = {
          IPlist: content || '',
        };
        break;
      // TODO: 未來其他 agent 可以有不同的 inputs 結構
      // case 'deploy-policy':
      //   inputs = {
      //     policyConfig: content || '',
      //     targetDevices: [...],
      //   };
      //   break;
      default:
        // 預設使用 content 作為通用輸入
        inputs = {
          content: content || '',
        };
    }

    const response = await executeWorkflow({
      type: workflowType as WorkflowType,
      body: {
        inputs,
        response_mode: 'blocking',
        user: currentUser.email,
      },
    });

    if (!response.success) {
      throw new Error(response.error || '執行 workflow 失敗');
    }

    return response;
  };
};

export const agents: AgentConfig[] = [
  {
    id: 'block-ip',
    title: '一鍵封鎖 IP',
    description: 'AI Agent 自動分析並封鎖異常 IP 地址',
    icon: <Shield className="w-8 h-8" />,
    workflowType: 'ip-block-quick',
    workflowSteps: [
      {
        step: 1,
        title: '驗證封鎖目標',
        description: '確認所有 IP 地址格式正確且在有效範圍內',
      },
      {
        step: 2,
        title: '分析封鎖原因',
        description: '評估威脅等級與安全風險，確認封鎖必要性',
      },
      {
        step: 3,
        title: '檢查現有規則',
        description: '避免重複規則，優化防火牆策略',
      },
      {
        step: 4,
        title: '生成封鎖指令',
        description: '根據不同平台生成對應的防火牆規則',
      },
    ],
    executeFn: createExecuteFn('ip-block-quick', 'block-ip'),
  },
  {
    id: 'unblock-ip',
    title: '一鍵解封 IP',
    description: 'AI Agent 智能解除已封鎖的 IP 地址',
    icon: <Unlock className="w-8 h-8" />,
    workflowType: 'ip-unblock-quick',
    workflowSteps: [
      {
        step: 1,
        title: '驗證解封目標',
        description: '確認所有 IP 地址格式正確且存在於封鎖列表中',
      },
      {
        step: 2,
        title: '分析解封原因',
        description: '評估解封風險與必要性，確認解封安全性',
      },
      {
        step: 3,
        title: '檢查封鎖記錄',
        description: '查看封鎖歷史與原因，避免誤解封',
      },
      {
        step: 4,
        title: '生成解封指令',
        description: '根據不同平台生成對應的解封規則',
      },
    ],
    executeFn: createExecuteFn('ip-unblock-quick', 'unblock-ip'),
  },
  // TODO: 尚未實作
  // {
  //   id: 'deploy-policy',
  //   title: 'F5 一鍵部署 Policy',
  //   description: 'AI Agent 智能部署安全策略至 F5 設備',
  //   icon: <Server className="w-8 h-8" />,
  //   workflowType: 'f5-deploy-policy',
  //   workflowSteps: [
  //     {
  //       step: 1,
  //       title: '驗證策略配置',
  //       description: '檢查策略配置格式與有效性',
  //     },
  //     // ... more steps
  //   ],
  //   executeFn: createExecuteFn('f5-deploy-policy', 'deploy-policy'),
  // },
];
