// backend/routes/workflow.routes.ts
// Workflow API 介接路由

import express, { type Request, type Response, type Router } from 'express';
import { z } from 'zod';
import {
  getWorkflowApiKey,
  type WorkflowType,
  WorkflowTypeSchema,
} from '../utils/difyWorkflowMapping';

const router: Router = express.Router();

// ============================================================
// Zod Schemas
// ============================================================

/**
 * Inputs 的基礎類型
 */
type InputsBase = Record<string, unknown>;

/**
 * 各 Workflow 類型的 inputs schema
 */
const InputsSchemaMap: Record<WorkflowType, z.ZodType<InputsBase>> = {
  'ip-block-quick': z.object({
    IPlist: z.string().min(1),
  }),
};

/**
 * 根據 workflow 類型取得對應的 inputs schema
 */
function getInputsSchema(workflowType: WorkflowType): z.ZodType<InputsBase> {
  return InputsSchemaMap[workflowType];
}

/**
 * Request Body Schema
 */
const WorkflowRequestBodySchema = z.object({
  inputs: z.record(z.string(), z.unknown()),
  response_mode: z.enum(['blocking', 'streaming']).default('blocking'),
  user: z.string().min(1),
});

/**
 * Dify API Response Schema（驗證回傳結構）
 */
const DifySuccessResponseSchema = z.object({
  workflow_run_id: z.string().optional(),
  task_id: z.string().optional(),
  data: z.record(z.string(), z.unknown()).optional(),
});

// ============================================================
// API Response 格式
// ============================================================

type ApiSuccessResponse = {
  success: true;
};

type ApiErrorResponse = {
  success: false;
  error: string;
};

type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

// ============================================================
// Proxy 函數
// ============================================================

type ProxyResult =
  | { ok: true; status: number; data: unknown }
  | { ok: false; status: number; data: unknown }
  | null;

async function proxyDifyRequest(
  apiKey: string,
  body: z.infer<typeof WorkflowRequestBodySchema>,
): Promise<ProxyResult> {
  const baseUrl = process.env.DIFY_BASE_URL;
  if (!baseUrl) {
    console.error('❌ DIFY_BASE_URL 環境變數未設定');
    return null;
  }

  const url = `${baseUrl}/v1/workflows/run`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    let data: unknown = {};
    try {
      data = await response.json();
    } catch {
      console.error('❌ Dify API 回應非 JSON 格式');
    }

    return {
      ok: response.ok,
      status: response.status,
      data,
    };
  } catch (error) {
    console.error('❌ Dify API 請求失敗:', error);
    return null;
  }
}

// ============================================================
// API 端點
// ============================================================

/**
 * Workflow 執行端點
 * POST /api/workflow/:type
 *
 * Path Parameters:
 *   - type: WorkflowType (必填，例如: ip-block-quick)
 *
 * Request Body:
 * {
 *   "inputs": { "IPlist": "1.2.3.4 5.6.7.8" },
 *   "response_mode": "blocking",
 *   "user": "user@example.com"
 * }
 *
 * Response (成功):
 * { "success": true }
 *
 * Response (失敗):
 * { "success": false, "error": "錯誤訊息" }
 */
router.post('/:type', async (req: Request, res: Response<ApiResponse>) => {
  try {
    // 1. 驗證 path parameter: type
    const typeParam = req.params.type;
    const typeResult = WorkflowTypeSchema.safeParse(typeParam);

    if (!typeResult.success) {
      return res.status(400).json({
        success: false,
        error: '無效的請求參數',
      });
    }

    const workflowType = typeResult.data;

    // 2. 取得 API Key
    const apiKey = getWorkflowApiKey(workflowType);
    if (!apiKey) {
      console.error(`❌ Workflow "${workflowType}" API Key 未配置`);
      return res.status(500).json({
        success: false,
        error: '服務錯誤',
      });
    }

    // 3. 驗證 request body 基本結構
    const bodyResult = WorkflowRequestBodySchema.safeParse(req.body);
    if (!bodyResult.success) {
      return res.status(400).json({
        success: false,
        error: '無效的請求內容',
      });
    }

    // 4. 驗證 inputs 內容是否符合該 workflow 的規範
    const inputsSchema = getInputsSchema(workflowType);
    const inputsResult = inputsSchema.safeParse(bodyResult.data.inputs);
    if (!inputsResult.success) {
      return res.status(400).json({
        success: false,
        error: '無效的輸入參數',
      });
    }

    // 5. 發送請求到 Dify
    console.log(`🚀 執行 Workflow: ${workflowType}`);

    const result = await proxyDifyRequest(apiKey, {
      inputs: inputsResult.data,
      response_mode: bodyResult.data.response_mode,
      user: bodyResult.data.user,
    });

    // 6. 檢查請求結果
    if (result === null) {
      return res.status(500).json({
        success: false,
        error: '服務錯誤',
      });
    }

    if (!result.ok) {
      console.error(`❌ Dify API 回應錯誤: ${result.status}`);
      return res.status(500).json({
        success: false,
        error: '服務錯誤',
      });
    }

    const responseResult = DifySuccessResponseSchema.safeParse(result.data);
    if (!responseResult.success) {
      console.error('❌ Dify API 回應格式異常');
      return res.status(500).json({
        success: false,
        error: '服務錯誤',
      });
    }

    // 7. 成功
    console.log(`✅ Workflow "${workflowType}" 執行成功`);
    return res.json({
      success: true,
    });
  } catch (error) {
    console.error('❌ Workflow 錯誤:', error);
    return res.status(500).json({
      success: false,
      error: '服務錯誤',
    });
  }
});

module.exports = router;
