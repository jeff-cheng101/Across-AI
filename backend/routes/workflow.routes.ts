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
  'ip-unblock-quick': z.object({
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

const REQUEST_TIMEOUT_MS = 30000; // 30 秒超時

async function proxyDifyRequest(
  apiKey: string,
  body: z.infer<typeof WorkflowRequestBodySchema>,
  workflowType: string,
): Promise<ProxyResult> {
  const baseUrl = process.env.DIFY_SERVICE_URL;
  if (!baseUrl) {
    console.error('❌ DIFY_SERVICE_URL 環境變數未設定', {
      timestamp: new Date().toISOString(),
      workflowType,
    });
    return null;
  }

  const url = `${baseUrl}/v1/workflows/run`;
  const startTime = Date.now();

  // 建立 AbortController 用於超時控制
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const duration = Date.now() - startTime;

    let data: unknown = {};
    try {
      data = await response.json();
    } catch (parseError) {
      console.error('❌ Dify API 回應非 JSON 格式', {
        timestamp: new Date().toISOString(),
        workflowType,
        url,
        status: response.status,
        statusText: response.statusText,
        duration: `${duration}ms`,
        error:
          parseError instanceof Error
            ? parseError.message
            : parseError?.toString() || 'Unknown error',
      });
    }

    return {
      ok: response.ok,
      status: response.status,
      data,
    };
  } catch (error) {
    clearTimeout(timeoutId);
    const duration = Date.now() - startTime;

    // 判斷是否為超時錯誤
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('❌ Dify API 請求超時', {
        timestamp: new Date().toISOString(),
        workflowType,
        url,
        timeout: `${REQUEST_TIMEOUT_MS}ms`,
        duration: `${duration}ms`,
      });
    } else {
      console.error('❌ Dify API 請求失敗', {
        timestamp: new Date().toISOString(),
        workflowType,
        url,
        duration: `${duration}ms`,
        error:
          error instanceof Error
            ? {
                name: error.name,
                message: error.message,
                stack: error.stack,
              }
            : String(error),
      });
    }
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
  const requestStartTime = Date.now();
  const typeParam = req.params.type;

  try {
    // 1. 驗證 path parameter: type
    const typeResult = WorkflowTypeSchema.safeParse(typeParam);

    if (!typeResult.success) {
      console.warn('⚠️ 無效的 workflow 類型', {
        timestamp: new Date().toISOString(),
        providedType: typeParam,
        allowedTypes: ['ip-block-quick', 'ip-unblock-quick'],
        validationErrors: typeResult.error.issues || [],
      });
      return res.status(400).json({
        success: false,
        error: '無效的請求參數',
      });
    }

    const workflowType = typeResult.data;

    // 2. 取得 API Key
    const apiKey = getWorkflowApiKey(workflowType);
    if (!apiKey) {
      console.error('❌ Workflow API Key 未配置', {
        timestamp: new Date().toISOString(),
        workflowType,
        envVar: `DIFY_WORKFLOW_API_KEY_${workflowType.toUpperCase().replace(/-/g, '_')}`,
      });
      return res.status(500).json({
        success: false,
        error: '服務錯誤',
      });
    }

    // 3. 驗證 request body 基本結構
    const bodyResult = WorkflowRequestBodySchema.safeParse(req.body);
    if (!bodyResult.success) {
      console.warn('⚠️ Request body 驗證失敗', {
        timestamp: new Date().toISOString(),
        workflowType,
        validationErrors: bodyResult.error.issues || [],
        receivedBody: {
          hasInputs: !!req.body?.inputs,
          hasResponseMode: !!req.body?.response_mode,
          hasUser: !!req.body?.user,
        },
      });
      return res.status(400).json({
        success: false,
        error: '無效的請求內容',
      });
    }

    // 4. 驗證 inputs 內容是否符合該 workflow 的規範
    const inputsSchema = getInputsSchema(workflowType);
    const inputsResult = inputsSchema.safeParse(bodyResult.data.inputs);
    if (!inputsResult.success) {
      console.warn('⚠️ Inputs 驗證失敗', {
        timestamp: new Date().toISOString(),
        workflowType,
        validationErrors: inputsResult.error.issues || [],
        receivedInputs: Object.keys(bodyResult.data.inputs || {}),
      });
      return res.status(400).json({
        success: false,
        error: '無效的輸入參數',
      });
    }

    // 5. 發送請求到 Dify
    console.log('🚀 執行 Workflow', {
      timestamp: new Date().toISOString(),
      workflowType,
      user: bodyResult.data.user,
      responseMode: bodyResult.data.response_mode,
    });

    const result = await proxyDifyRequest(
      apiKey,
      {
        inputs: inputsResult.data,
        response_mode: bodyResult.data.response_mode,
        user: bodyResult.data.user,
      },
      workflowType,
    );

    // 6. 檢查請求結果
    if (result === null) {
      const duration = Date.now() - requestStartTime;
      console.error('❌ Workflow 執行失敗（請求結果為 null）', {
        timestamp: new Date().toISOString(),
        workflowType,
        duration: `${duration}ms`,
      });
      return res.status(500).json({
        success: false,
        error: '服務錯誤',
      });
    }

    if (!result.ok) {
      const duration = Date.now() - requestStartTime;
      console.error('❌ Dify API 回應錯誤', {
        timestamp: new Date().toISOString(),
        workflowType,
        status: result.status,
        duration: `${duration}ms`,
        responseData: result.data,
      });
      return res.status(500).json({
        success: false,
        error: '服務錯誤',
      });
    }

    const responseResult = DifySuccessResponseSchema.safeParse(result.data);
    if (!responseResult.success) {
      const duration = Date.now() - requestStartTime;
      console.error('❌ Dify API 回應格式異常', {
        timestamp: new Date().toISOString(),
        workflowType,
        duration: `${duration}ms`,
        validationErrors: responseResult.error.issues || [],
        receivedData: result.data,
      });
      return res.status(500).json({
        success: false,
        error: '服務錯誤',
      });
    }

    // 7. 成功
    const duration = Date.now() - requestStartTime;
    console.log('✅ Workflow 執行成功', {
      timestamp: new Date().toISOString(),
      workflowType,
      duration: `${duration}ms`,
      workflowRunId: responseResult.data.workflow_run_id,
      taskId: responseResult.data.task_id,
    });
    return res.json({
      success: true,
    });
  } catch (error) {
    const duration = Date.now() - requestStartTime;
    console.error('❌ Workflow 未預期錯誤', {
      timestamp: new Date().toISOString(),
      workflowType: typeParam,
      duration: `${duration}ms`,
      error:
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
            }
          : error?.toString() || 'Unknown error',
    });
    return res.status(500).json({
      success: false,
      error: '服務錯誤',
    });
  }
});

// TODO: 未來將整個專案改為TypeScript可以改成export default
// 使用 CommonJS 格式導出，因為 index.js 使用 require() 引入
// 如果改用 ES6 export default，會導致 "argument handler must be a function" 錯誤
module.exports = router;
