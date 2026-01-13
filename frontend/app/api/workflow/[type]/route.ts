// frontend/app/api/workflow/[type]/route.ts
// Workflow API Route Handler - 直接連接 Dify

import type { NextRequest } from 'next/server';
import { Agent } from 'undici';
import { z } from 'zod';
import {
  type WorkflowType,
  WorkflowTypeSchema,
} from '@/services/workflow/type';
import { getWorkflowApiKey, getWorkflowConfig } from '../workflowConfigs';

// ============================================================
// 強制動態路由
// ============================================================
export const dynamic = 'force-dynamic';

// ============================================================
// 自訂 HTTP Agent（繞過 Next.js 預設 timeout）
// ============================================================
const fetchAgent = new Agent({
  headersTimeout: 600 * 1000, // 10 分鐘 - 等待收到回應 headers 的時間
  bodyTimeout: 600 * 1000, // 10 分鐘 - 等待收到回應 body 的時間
  connectTimeout: 30 * 1000, // 30 秒 - 連線建立逾時
});

// ============================================================
// Zod Schemas
// ============================================================

/**
 * Request Body Schema（外層結構）
 */
const WorkflowRequestBodySchema = z.object({
  inputs: z.record(z.string(), z.unknown()),
  response_mode: z.enum(['blocking', 'streaming']).default('blocking'),
  user: z.string().min(1),
});

/**
 * Dify Blocking API Response Schema
 */
const DifyBlockingResponseSchema = z.object({
  workflow_run_id: z.string().optional(),
  task_id: z.string().optional(),
  data: z
    .object({
      outputs: z.record(z.string(), z.unknown()).optional(),
    })
    .optional(),
});

/**
 * Dify Streaming workflow_finished 事件的 data 結構
 */
const DifyStreamingFinishedSchema = z.object({
  data: z.object({
    outputs: z.object({
      result: z.string(), // JSON 字串
    }),
  }),
});

// ============================================================
// JSON Response 輔助函數
// ============================================================

function jsonResponse(data: unknown, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function errorResponse(error: string, status: number = 500): Response {
  return jsonResponse({ success: false, error }, status);
}

// ============================================================
// Dify Blocking 請求函數
// ============================================================

type DifyResult =
  | { ok: true; status: number; data: unknown }
  | { ok: false; status: number; data: unknown }
  | null;

async function sendDifyBlockingRequest(
  apiKey: string,
  body: z.infer<typeof WorkflowRequestBodySchema>,
  workflowType: string,
  timeout: number,
): Promise<DifyResult> {
  const baseUrl = process.env.DIFY_SERVICE_URL;
  if (!baseUrl) {
    console.error('❌ DIFY_SERVICE_URL 環境變數未設定', {
      timestamp: new Date().toISOString(),
      workflowType,
    });
    return null;
  }

  const url = `${baseUrl}/workflows/run`;
  const startTime = Date.now();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        ...body,
        response_mode: 'blocking',
      }),
      signal: controller.signal,
      // @ts-expect-error - undici dispatcher 在 Node.js 環境下可用
      dispatcher: fetchAgent,
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
        duration: `${duration}ms`,
        error:
          parseError instanceof Error ? parseError.message : String(parseError),
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

    if (error instanceof Error && error.name === 'AbortError') {
      console.error('❌ Dify API 請求超時', {
        timestamp: new Date().toISOString(),
        workflowType,
        url,
        timeout: `${timeout}ms`,
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
            ? { name: error.name, message: error.message }
            : String(error),
      });
    }
    return null;
  }
}

// ============================================================
// Dify Streaming 請求函數
// ============================================================

type StreamingResult =
  | { ok: true; data: unknown }
  | { ok: false; error: string }
  | null;

async function sendDifyStreamingRequest(
  apiKey: string,
  body: z.infer<typeof WorkflowRequestBodySchema>,
  workflowType: string,
  timeout: number,
): Promise<StreamingResult> {
  const baseUrl = process.env.DIFY_SERVICE_URL;
  if (!baseUrl) {
    console.error('❌ DIFY_SERVICE_URL 環境變數未設定', {
      timestamp: new Date().toISOString(),
      workflowType,
    });
    return null;
  }

  const url = `${baseUrl}/workflows/run`;
  const startTime = Date.now();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        ...body,
        response_mode: 'streaming',
      }),
      signal: controller.signal,
      // @ts-expect-error - undici dispatcher 在 Node.js 環境下可用
      dispatcher: fetchAgent,
    });

    if (!response.ok) {
      clearTimeout(timeoutId);
      // 嘗試讀取錯誤內容
      let errorBody = '';
      try {
        errorBody = await response.text();
      } catch {
        errorBody = 'Unable to read error body';
      }
      console.error('❌ Dify Streaming API 回應錯誤', {
        timestamp: new Date().toISOString(),
        workflowType,
        status: response.status,
        statusText: response.statusText,
        errorBody: errorBody.substring(0, 500), // 限制長度
      });
      return { ok: false, error: '服務錯誤' };
    }

    if (!response.body) {
      clearTimeout(timeoutId);
      console.error('❌ Dify Streaming API 無回應 body', {
        timestamp: new Date().toISOString(),
        workflowType,
      });
      return { ok: false, error: '服務錯誤' };
    }

    // 讀取 SSE 事件流
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let finalResult: unknown = null;
    let eventCount = 0;

    console.log('📡 開始讀取 SSE 事件流...', {
      timestamp: new Date().toISOString(),
      workflowType,
    });

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log('📡 SSE 事件流結束 (done=true)', {
            timestamp: new Date().toISOString(),
            workflowType,
            totalEvents: eventCount,
          });
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        // 印出原始 chunk（限制長度）
        console.log('📦 收到 chunk', {
          timestamp: new Date().toISOString(),
          chunkLength: chunk.length,
          chunkPreview: chunk.substring(0, 200).replace(/\n/g, '\\n'),
        });

        // 解析 SSE 事件（以雙換行分隔）
        const events = buffer.split('\n\n');
        buffer = events.pop() || ''; // 保留未完成的事件

        for (const event of events) {
          if (!event.trim()) continue;

          eventCount++;
          const lines = event.split('\n');
          let eventType = '';
          let eventData = '';

          for (const line of lines) {
            if (line.startsWith('event:')) {
              eventType = line.substring(6).trim();
            } else if (line.startsWith('data:')) {
              eventData = line.substring(5).trim();
            }
          }

          // Dify 的 SSE 格式：event type 可能在 JSON data 內部
          // 如果沒有 event: 標籤，嘗試從 JSON 解析
          if (!eventType && eventData) {
            try {
              const parsed = JSON.parse(eventData);
              if (parsed.event) {
                eventType = parsed.event;
              }
            } catch {
              // 解析失敗，保持空值
            }
          }

          console.log(`📨 SSE 事件 #${eventCount}`, {
            timestamp: new Date().toISOString(),
            eventType: eventType || '(無 event 標籤)',
            dataLength: eventData.length,
            dataPreview: eventData.substring(0, 300),
          });

          if (eventType === 'workflow_finished') {
            console.log('🎯 收到 workflow_finished 事件！', {
              timestamp: new Date().toISOString(),
              workflowType,
            });

            try {
              const parsedEventData = JSON.parse(eventData);
              console.log('📋 workflow_finished 結構', {
                hasData: !!parsedEventData.data,
                hasOutputs: !!parsedEventData.data?.outputs,
                hasResult: !!parsedEventData.data?.outputs?.result,
                outputKeys: Object.keys(parsedEventData.data?.outputs || {}),
              });

              const parseResult =
                DifyStreamingFinishedSchema.safeParse(parsedEventData);

              if (parseResult.success) {
                const resultStr = parseResult.data.data.outputs.result;
                console.log('📝 outputs.result 內容（前 500 字）', {
                  resultPreview: resultStr.substring(0, 500),
                });
                finalResult = JSON.parse(resultStr);
                console.log('✅ 成功解析 finalResult', {
                  timestamp: new Date().toISOString(),
                  hasSuccess: 'success' in (finalResult as object),
                });
              } else {
                console.error('❌ DifyStreamingFinishedSchema 驗證失敗', {
                  errors: parseResult.error.issues,
                });
              }
            } catch (parseError) {
              console.error('❌ 解析 workflow_finished 事件失敗', {
                timestamp: new Date().toISOString(),
                workflowType,
                error:
                  parseError instanceof Error
                    ? parseError.message
                    : String(parseError),
                rawData: eventData.substring(0, 500),
              });
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    clearTimeout(timeoutId);
    const duration = Date.now() - startTime;

    if (finalResult === null) {
      console.error('❌ Streaming 未收到 workflow_finished 事件', {
        timestamp: new Date().toISOString(),
        workflowType,
        duration: `${duration}ms`,
      });
      return { ok: false, error: '服務錯誤' };
    }

    console.log('✅ Streaming 完成', {
      timestamp: new Date().toISOString(),
      workflowType,
      duration: `${duration}ms`,
    });

    return { ok: true, data: finalResult };
  } catch (error) {
    clearTimeout(timeoutId);
    const duration = Date.now() - startTime;

    if (error instanceof Error && error.name === 'AbortError') {
      console.error('❌ Dify Streaming 請求超時', {
        timestamp: new Date().toISOString(),
        workflowType,
        timeout: `${timeout}ms`,
        duration: `${duration}ms`,
      });
    } else {
      console.error('❌ Dify Streaming 請求失敗', {
        timestamp: new Date().toISOString(),
        workflowType,
        duration: `${duration}ms`,
        error:
          error instanceof Error
            ? { name: error.name, message: error.message }
            : String(error),
      });
    }
    return null;
  }
}

// ============================================================
// Route Handler
// ============================================================

/**
 * Workflow 執行端點
 * POST /api/workflow/:type
 *
 * 根據 workflow 類型自動選擇 blocking 或 streaming 模式
 * 並回傳對應的 response 結構
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> },
) {
  const requestStartTime = Date.now();
  const { type: typeParam } = await params;

  try {
    // 1. 驗證 path parameter: type
    const typeResult = WorkflowTypeSchema.safeParse(typeParam);

    if (!typeResult.success) {
      console.warn('⚠️ 無效的 workflow 類型', {
        timestamp: new Date().toISOString(),
        providedType: typeParam,
        validationErrors: typeResult.error.issues,
      });
      return errorResponse('無效的請求參數', 400);
    }

    const workflowType: WorkflowType = typeResult.data;

    // 2. 取得 workflow 配置
    const config = getWorkflowConfig(workflowType);

    // 3. 取得 API Key
    const apiKey = getWorkflowApiKey(workflowType);
    const envVarName = `DIFY_WORKFLOW_API_KEY_${workflowType.toUpperCase().replace(/-/g, '_')}`;
    console.log('🔑 API Key 檢查', {
      timestamp: new Date().toISOString(),
      workflowType,
      envVarName,
      hasApiKey: !!apiKey,
      apiKeyPrefix: apiKey ? apiKey.substring(0, 10) + '...' : 'null',
    });
    if (!apiKey) {
      console.error('❌ Workflow API Key 未配置', {
        timestamp: new Date().toISOString(),
        workflowType,
        envVar: envVarName,
      });
      return errorResponse('服務錯誤', 500);
    }

    // 4. 解析 request body
    let requestBody: unknown;
    try {
      requestBody = await request.json();
    } catch {
      return errorResponse('無效的 JSON 格式', 400);
    }

    // 5. 驗證 request body 外層結構
    const bodyResult = WorkflowRequestBodySchema.safeParse(requestBody);
    if (!bodyResult.success) {
      console.warn('⚠️ Request body 驗證失敗', {
        timestamp: new Date().toISOString(),
        workflowType,
        validationErrors: bodyResult.error.issues,
      });
      return errorResponse('無效的請求內容', 400);
    }

    // 6. 驗證 inputs 內容
    const inputsResult = config.requestSchema.safeParse(bodyResult.data.inputs);
    if (!inputsResult.success) {
      console.warn('⚠️ Inputs 驗證失敗', {
        timestamp: new Date().toISOString(),
        workflowType,
        validationErrors: inputsResult.error.issues,
        receivedInputs: Object.keys(bodyResult.data.inputs || {}),
      });
      return errorResponse('無效的輸入參數', 400);
    }

    // 7. 根據模式執行 Dify 請求
    console.log('🚀 執行 Workflow', {
      timestamp: new Date().toISOString(),
      workflowType,
      mode: config.mode,
      user: bodyResult.data.user,
    });

    const difyBody = {
      inputs: inputsResult.data as Record<string, unknown>,
      response_mode: config.mode,
      user: bodyResult.data.user,
    };

    if (config.mode === 'streaming') {
      // Streaming 模式
      const result = await sendDifyStreamingRequest(
        apiKey,
        difyBody,
        workflowType,
        config.timeout,
      );

      if (result === null) {
        return errorResponse('服務錯誤', 500);
      }

      if (!result.ok) {
        return errorResponse(result.error, 500);
      }

      // 驗證 response 結構
      const responseResult = config.responseSchema.safeParse(result.data);
      if (!responseResult.success) {
        console.error('❌ Response 驗證失敗', {
          timestamp: new Date().toISOString(),
          workflowType,
          validationErrors: responseResult.error.issues,
          receivedData: result.data,
        });
        return errorResponse('服務錯誤', 500);
      }

      const duration = Date.now() - requestStartTime;
      console.log('✅ Workflow 執行成功 (streaming)', {
        timestamp: new Date().toISOString(),
        workflowType,
        duration: `${duration}ms`,
      });

      return jsonResponse(responseResult.data);
    } else {
      // Blocking 模式
      const result = await sendDifyBlockingRequest(
        apiKey,
        difyBody,
        workflowType,
        config.timeout,
      );

      if (result === null) {
        return errorResponse('服務錯誤', 500);
      }

      if (!result.ok) {
        const duration = Date.now() - requestStartTime;
        console.error('❌ Dify API 回應錯誤', {
          timestamp: new Date().toISOString(),
          workflowType,
          status: result.status,
          duration: `${duration}ms`,
        });
        return errorResponse('服務錯誤', 500);
      }

      // 解析 Dify blocking response
      const difyResult = DifyBlockingResponseSchema.safeParse(result.data);
      if (!difyResult.success) {
        console.error('❌ Dify API 回應格式異常', {
          timestamp: new Date().toISOString(),
          workflowType,
          validationErrors: difyResult.error.issues,
        });
        return errorResponse('服務錯誤', 500);
      }

      // 從 outputs 取得結果（如果有的話）
      let outputData: unknown = { success: true };
      if (difyResult.data.data?.outputs?.result) {
        try {
          outputData = JSON.parse(
            difyResult.data.data.outputs.result as string,
          );
        } catch {
          // 如果不是 JSON，直接使用原始值
          outputData = { success: true };
        }
      }

      // 驗證 response 結構
      const responseResult = config.responseSchema.safeParse(outputData);
      if (!responseResult.success) {
        // 如果驗證失敗，回傳簡單的成功結構
        console.warn('⚠️ Response 驗證失敗，使用預設值', {
          timestamp: new Date().toISOString(),
          workflowType,
          validationErrors: responseResult.error.issues,
        });
        return jsonResponse({ success: true });
      }

      const duration = Date.now() - requestStartTime;
      console.log('✅ Workflow 執行成功 (blocking)', {
        timestamp: new Date().toISOString(),
        workflowType,
        duration: `${duration}ms`,
      });

      return jsonResponse(responseResult.data);
    }
  } catch (error) {
    const duration = Date.now() - requestStartTime;
    console.error('❌ Workflow 未預期錯誤', {
      timestamp: new Date().toISOString(),
      workflowType: typeParam,
      duration: `${duration}ms`,
      error:
        error instanceof Error
          ? { name: error.name, message: error.message, stack: error.stack }
          : String(error),
    });
    return errorResponse('服務錯誤', 500);
  }
}
