// backend/routes/gateway.routes.ts
// Gateway 相關 API 路由 - 訂閱管理 & AI Gateway 儀表板

import fs from 'node:fs';
import path from 'node:path';
import axios from 'axios';
import express, { type Request, type Response, type Router } from 'express';
import { z } from 'zod';

const router: Router = express.Router();
const subscriptionFilePath: string = path.join(
  __dirname,
  '..',
  'data',
  'subscription.json',
);

// ============================================================
// 環境變數與配置
// ============================================================

/**
 * 取得 LiteLLM API URL
 * @returns LiteLLM API URL，未設定時返回 null
 */
function getLiteLLMApiUrl(): string | null {
  return process.env.LITELLM_API_URL || null;
}

/**
 * 取得 LiteLLM API Key
 * @returns LiteLLM API Key，未設定時返回 null
 */
function getLiteLLMApiKey(): string | null {
  return process.env.LITELLM_API_KEY || null;
}

/**
 * 取得匯率（USD 轉 TWD）
 *
 * 目前從環境變數 EXCHANGE_RATE 取得，未設定時使用預設值 32
 *
 * TODO: 未來可能的擴展方式：
 * - 從外部 API 取得即時匯率（如 exchangerate-api.com、frankfurter.app）
 * - 從資料庫取得管理員設定的匯率
 * - 加入快取機制減少 API 呼叫次數
 *
 * @returns 匯率數值
 */
function getExchangeRate(): number {
  const rate = process.env.EXCHANGE_RATE;
  if (rate) {
    const parsed = parseFloat(rate);
    if (!Number.isNaN(parsed) && parsed > 0) {
      return parsed;
    }
  }
  return 32;
}

/**
 * 取得 AI Gateway 預算上限（TWD）
 *
 * 從環境變數 GATEWAY_BUDGET_LIMIT 取得，未設定時返回 null
 * 返回 null 時，calculateBudget() 會使用預設計算方式（訂閱費 x 1.2）
 *
 * @returns 預算上限數值，未設定時返回 null
 */
function getGatewayBudgetLimit(): number | null {
  const limit = process.env.GATEWAY_BUDGET_LIMIT;
  if (limit) {
    const parsed = parseFloat(limit);
    if (!Number.isNaN(parsed) && parsed > 0) {
      return parsed;
    }
  }
  return null;
}

const EXCHANGE_RATE = getExchangeRate();

// ============================================================
// Zod Schema（外部輸入驗證用）
// ============================================================

/**
 * 基礎訂閱資料 Schema（對應 subscription.json 結構）
 * 用於驗證從 JSON 檔案讀取的數據
 */
const BasicSubscriptionSchema = z.object({
  ai_name: z.string(),
  price: z.number(),
  duration: z.number(),
  subscribe_time: z.string(),
  currency_code: z.string(),
  create_time: z.string(),
  update_time: z.string(),
});
type BasicSubscription = z.infer<typeof BasicSubscriptionSchema>;

/**
 * 訂閱清單 Schema
 */
const SubscriptionListSchema = z.array(BasicSubscriptionSchema);

/**
 * LiteLLM /user/daily/activity API 的 metrics Schema
 * 包含每日的 spend、tokens、requests 等指標
 */
const DailyActivityMetricsSchema = z.object({
  spend: z.number(),
  prompt_tokens: z.number(),
  completion_tokens: z.number(),
  total_tokens: z.number(),
  api_requests: z.number(),
  successful_requests: z.number(),
  failed_requests: z.number(),
});

/**
 * LiteLLM /user/daily/activity API 的 breakdown metrics Schema
 *
 * 注意：successful_requests 和 failed_requests 在某些版本的 LiteLLM 中可能不存在，
 * 因此設為 optional，在轉換時使用預設值 0
 */
const BreakdownMetricsSchema = z.object({
  spend: z.number(),
  prompt_tokens: z.number(),
  completion_tokens: z.number(),
  total_tokens: z.number(),
  api_requests: z.number(),
  successful_requests: z.number().optional(),
  failed_requests: z.number().optional(),
  // LiteLLM 可能返回的額外欄位
  cache_read_input_tokens: z.number().optional(),
  cache_creation_input_tokens: z.number().optional(),
});

/**
 * API Key Breakdown 內每個金鑰的 Metrics Schema
 *
 * 業務背景：LiteLLM API 的 api_key_breakdown 內每個金鑰包含 metrics 和 metadata
 */
const ApiKeyBreakdownMetricsSchema = z.object({
  api_requests: z.number(),
  spend: z.number(),
});

/**
 * API Key Breakdown 內每個金鑰的 Metadata Schema
 *
 * 業務背景：metadata 可能包含 key_alias 或 alias 欄位，用於顯示金鑰別名
 * 使用 .passthrough() 允許 LiteLLM 返回的額外欄位通過
 *
 * 注意：LiteLLM API 可能返回 null（而非 undefined），因此使用 .nullish()
 * 來接受 string | null | undefined
 */
const ApiKeyBreakdownMetadataSchema = z
  .object({
    key_alias: z.string().nullish(),
    alias: z.string().nullish(),
  })
  .passthrough();

/**
 * API Key Breakdown 內每個金鑰項目的完整 Schema
 */
const ApiKeyBreakdownItemSchema = z.object({
  metrics: ApiKeyBreakdownMetricsSchema,
  metadata: ApiKeyBreakdownMetadataSchema.optional(),
});

/**
 * LiteLLM /user/daily/activity API 的 breakdown 內每個項目的 Schema
 *
 * 業務背景：LiteLLM API 的 breakdown 數據是巢狀結構，
 * 實際數據在 metrics 物件內，而非直接在頂層
 */
const BreakdownItemSchema = z.object({
  metrics: BreakdownMetricsSchema,
  metadata: z.record(z.string(), z.unknown()).optional(),
  api_key_breakdown: z
    .record(z.string(), ApiKeyBreakdownItemSchema)
    .optional(),
});

/**
 * LiteLLM /user/daily/activity/aggregated API 的每日結果 Schema
 */
const DailyActivityResultSchema = z.object({
  date: z.string(),
  metrics: DailyActivityMetricsSchema,
  breakdown: z.object({
    models: z.record(z.string(), BreakdownItemSchema).optional(),
    api_keys: z.record(z.string(), BreakdownItemSchema).optional(),
    customers: z.record(z.string(), BreakdownItemSchema).optional(),
    teams: z.record(z.string(), BreakdownItemSchema).optional(),
    // LiteLLM aggregated API 額外欄位
    mcp_servers: z.record(z.string(), z.unknown()).optional(),
    model_groups: z.record(z.string(), BreakdownItemSchema).optional(),
    providers: z.record(z.string(), BreakdownItemSchema).optional(),
  }),
});

/**
 * LiteLLM /user/daily/activity API 的完整回應 Schema
 *
 * 業務背景：此 API 直接返回聚合好的每日統計數據，
 * 減少後端手動聚合的計算負擔，由 LiteLLM DB 層完成聚合。
 */
const LiteLLMDailyActivityResponseSchema = z.object({
  results: z.array(DailyActivityResultSchema),
  metadata: z.object({
    total_spend: z.number(),
    total_prompt_tokens: z.number(),
    total_completion_tokens: z.number(),
    total_tokens: z.number(),
    total_api_requests: z.number(),
    total_successful_requests: z.number(),
    total_failed_requests: z.number(),
    // LiteLLM 可能返回的額外欄位
    total_cache_read_input_tokens: z.number().optional(),
    total_cache_creation_input_tokens: z.number().optional(),
    page: z.number().optional(),
    total_pages: z.number().optional(),
    has_more: z.boolean().optional(),
  }),
});
type LiteLLMDailyActivityResponse = z.infer<
  typeof LiteLLMDailyActivityResponseSchema
>;

// ============================================================
// 類型定義（內部使用，不需 runtime 驗證）
// ============================================================

/**
 * 訂閱服務（含 TWD 轉換）
 */
type SubscriptionWithTWD = BasicSubscription & {
  priceTWD: number;
};

/**
 * 每日成本詳細數據
 */
type DailyCostDetail = {
  date: string;
  provider: string;
  model: string;
  cost: number;
};

/**
 * KPI 指標
 */
type KpiMetrics = {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  totalTokens: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalSpendUsd: number;
  totalSpendTwd: number;
  avgTokensPerRequest: number;
  avgCostPerRequest: number;
};

/**
 * 模型使用統計
 */
type ModelUsageStats = {
  modelName: string;
  provider: string;
  requests: number;
  successfulRequests: number;
  failedRequests: number;
  successRate: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  costUsd: number;
  costTwd: number;
  avgLatency: number;
};

/**
 * Provider 使用統計
 */
type ProviderUsageStats = {
  provider: string;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  totalTokens: number;
  totalCostUsd: number;
  totalCostTwd: number;
  models: ModelUsageStats[];
};

/**
 * 每日使用統計
 */
type DailyUsageStats = {
  date: string;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  totalTokens: number;
  totalCostUsd: number;
  totalCostTwd: number;
  providerBreakdown: Record<
    string,
    {
      requests: number;
      successfulRequests: number;
      failedRequests: number;
      tokens: number;
      inputTokens: number;
      outputTokens: number;
      costUsd: number;
    }
  >;
};

/**
 * Token 使用趨勢
 */
type TokenUsageTrend = {
  date: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
};

/**
 * API 金鑰使用統計
 *
 * 業務背景：顯示各 API 金鑰的費用排名
 * 數據來源：LiteLLM API 的 breakdown.providers[provider].api_key_breakdown
 */
type ApiKeyUsageStats = {
  keyId: string;
  keyAlias: string;
  requests: number;
  costUsd: number;
  costTwd: number;
  providers: string[];
};

/**
 * 儀表板完整數據回應
 */
type DashboardDataResponse = {
  subscriptions: SubscriptionWithTWD[];
  budget: {
    total: number;
    used: number;
    remaining: number;
    percentage: number;
  };
  kpiMetrics: KpiMetrics;
  providerStats: ProviderUsageStats[];
  apiKeyStats: ApiKeyUsageStats[];
  dailyUsageStats: DailyUsageStats[];
  tokenUsageTrend: TokenUsageTrend[];
  dailyCostDetailed: DailyCostDetail[];
  metadata: {
    generatedAt: string;
    timeRange: {
      start: string;
      end: string;
    };
    exchangeRate: number;
  };
};

/**
 * 錯誤回應類型
 */
type ErrorResponse = {
  error: string;
  details?: string;
};

/**
 * 更新成功回應類型
 */
type UpdateSubscriptionResponse = {
  success: true;
  data: BasicSubscription[];
};

/**
 * 允許的幣別
 */
const ALLOWED_CURRENCIES = ['USD', 'TWD'] as const;

// ============================================================
// 輔助函數 - 訂閱資料處理
// ============================================================

/**
 * 讀取訂閱清單檔案並使用 Zod 驗證
 * @returns 驗證後的訂閱清單
 * @throws 檔案格式錯誤時拋出錯誤
 */
function readSubscriptionData(): BasicSubscription[] {
  const rawContent = fs.readFileSync(subscriptionFilePath, 'utf-8');
  const data: unknown = JSON.parse(rawContent);

  // 使用 Zod safeParse 進行驗證
  const result = SubscriptionListSchema.safeParse(data);

  if (!result.success) {
    console.error('❌ subscription.json 驗證失敗:', result.error.issues);
    throw new Error(`subscription.json 格式錯誤：${result.error.message}`);
  }

  return result.data;
}

/**
 * 將訂閱清單寫入檔案
 * @param data 訂閱清單資料
 */
function writeSubscriptionData(data: BasicSubscription[]): void {
  const content = JSON.stringify(data, null, 2);
  fs.writeFileSync(subscriptionFilePath, `${content}\n`, 'utf-8');
}

/**
 * 將訂閱數據加上 TWD 轉換
 * @param subscriptions 基礎訂閱數據
 * @returns 含 TWD 價格的訂閱數據
 */
function convertToSubscriptionsWithTWD(
  subscriptions: BasicSubscription[],
): SubscriptionWithTWD[] {
  return subscriptions.map((sub) => ({
    ...sub,
    priceTWD: sub.price * EXCHANGE_RATE,
  }));
}

/**
 * 日期時間格式正則 (YYYY-MM-DD hh:mm:ss)
 */
const DATETIME_REGEX = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

/**
 * 訂閱輸入資料 Schema（不含 create_time/update_time）
 * 用於 PUT /subscription 請求的輸入驗證
 *
 * 業務背景：前端提交訂閱資料時，create_time 和 update_time 由後端自動產生，
 * 因此輸入驗證只需要驗證核心欄位。
 */
const SubscriptionInputSchema = z.object({
  ai_name: z.string().min(1, '不可為空'),
  price: z.number().min(0, '必須是非負數'),
  duration: z.number().int().positive('必須是正整數'),
  subscribe_time: z
    .string()
    .regex(DATETIME_REGEX, '格式必須為 YYYY-MM-DD hh:mm:ss'),
  currency_code: z.enum(ALLOWED_CURRENCIES),
});
type SubscriptionInput = z.infer<typeof SubscriptionInputSchema>;

/**
 * 取得當下時間字串 (YYYY-MM-DD hh:mm:ss)
 * @param now 目前時間
 * @returns 格式化時間字串
 */
function getNowDatetimeString(now: Date = new Date()): string {
  const pad = (value: number): string => String(value).padStart(2, '0');
  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const date = pad(now.getDate());
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());
  return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
}

/**
 * 可選時間欄位 Schema（用於驗證 create_time/update_time）
 * 允許空字串或符合 DATETIME_REGEX 格式的字串
 */
const OptionalDatetimeSchema = z
  .string()
  .refine((val) => val === '' || DATETIME_REGEX.test(val), {
    message: '格式必須為 YYYY-MM-DD hh:mm:ss',
  })
  .optional();

/**
 * 完整的訂閱輸入驗證 Schema（包含可選的時間欄位）
 * 用於 PUT /subscription 請求的完整輸入驗證
 */
const SubscriptionInputWithOptionalTimesSchema = SubscriptionInputSchema.extend(
  {
    create_time: OptionalDatetimeSchema,
    update_time: OptionalDatetimeSchema,
  },
);

/**
 * 驗證單筆訂閱資料（用於 PUT 請求）
 * 使用 Zod Schema 進行驗證，完全移除 as 類型斷言
 *
 * @param item 待驗證的資料
 * @param index 資料索引（用於錯誤訊息）
 * @returns 錯誤訊息，若無錯誤則返回 null
 */
function validateSubscriptionItem(item: unknown, index: number): string | null {
  if (typeof item !== 'object' || item === null) {
    return `第 ${index + 1} 筆資料必須是物件`;
  }

  // 使用 Zod safeParse 驗證所有欄位（包含可選的時間欄位）
  const result = SubscriptionInputWithOptionalTimesSchema.safeParse(item);
  if (!result.success) {
    const firstIssue = result.error.issues[0];
    const fieldName = firstIssue.path.join('.');
    return `第 ${index + 1} 筆: ${fieldName} ${firstIssue.message}`;
  }

  return null;
}

/**
 * 驗證整個訂閱陣列（用於 PUT 請求）
 * @param data 待驗證的陣列
 * @returns 錯誤訊息，若無錯誤則返回 null
 */
function validateSubscriptionData(data: unknown[]): string | null {
  for (let i = 0; i < data.length; i++) {
    const error = validateSubscriptionItem(data[i], i);
    if (error) return error;
  }
  return null;
}

// ============================================================
// 輔助函數 - LiteLLM 整合
// ============================================================

/**
 * 從模型名稱解析 Provider
 * 例如 "gemini/gemini-2.5-pro" -> "gemini"
 * @param modelName 模型名稱
 * @returns Provider 名稱
 */
function getProviderFromModelName(modelName: string): string {
  const parts = modelName.split('/');
  if (parts.length > 1) {
    return parts[0];
  }
  return modelName || 'unknown';
}

/**
 * 從 LiteLLM API 獲取每日活動統計（使用 /user/daily/activity/aggregated API）
 *
 * 業務背景：此 API 直接返回聚合好的每日統計數據，
 * 由 LiteLLM DB 層完成聚合計算，減少後端計算負擔。
 *
 * @param startDate 開始日期 (YYYY-MM-DD)
 * @param endDate 結束日期 (YYYY-MM-DD)
 * @returns LiteLLM 每日活動統計回應
 */
async function fetchLiteLLMDailyActivity(
  startDate: string,
  endDate: string,
): Promise<LiteLLMDailyActivityResponse | null> {
  const apiUrl = getLiteLLMApiUrl();
  const apiKey = getLiteLLMApiKey();

  if (!apiUrl || !apiKey) {
    console.warn('⚠️ LiteLLM API 未配置，返回空數據');
    return null;
  }

  try {
    const response = await axios.get(
      `${apiUrl}/user/daily/activity/aggregated`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        params: {
          start_date: startDate,
          end_date: endDate,
        },
        timeout: 30000,
      },
    );

    // 使用 Zod 驗證 API 回應
    const result = LiteLLMDailyActivityResponseSchema.safeParse(response.data);
    if (result.success) {
      console.log(
        `📊 LiteLLM: 獲取 ${result.data.results.length} 天的活動統計`,
      );
      return result.data;
    }

    // 詳細記錄驗證失敗的原因
    console.warn('⚠️ LiteLLM API 回應格式異常:');
    console.warn('  錯誤詳情:', JSON.stringify(result.error.issues, null, 2));
    console.warn(
      '  實際回應:',
      JSON.stringify(response.data, null, 2).slice(0, 1000),
    );
    return null;
  } catch (error) {
    console.error(
      '❌ 獲取 LiteLLM 每日活動統計失敗:',
      error instanceof Error ? error.message : String(error),
    );
    return null;
  }
}

/**
 * 從 LiteLLM API 獲取模型資訊，建立模型名稱到 Provider 的映射表
 *
 * 業務背景：LiteLLM 的 breakdown.models 中，部分模型名稱不包含 provider 前綴
 * （如 "gpt-oss:20b" 是 ollama、"rerank-multilingual-v3.0" 是 cohere），
 * 需要透過 /v1/model/info API 取得 custom_llm_provider 來正確映射。
 *
 * 資料來源：LiteLLM /v1/model/info API
 *
 * @returns 模型名稱到 Provider 的映射表，API 失敗時返回空 Map
 */
async function fetchModelProviderMapping(): Promise<Map<string, string>> {
  const mapping = new Map<string, string>();
  const apiUrl = getLiteLLMApiUrl();
  const apiKey = getLiteLLMApiKey();

  if (!apiUrl || !apiKey) {
    console.warn('⚠️ LiteLLM API 未配置，跳過模型映射');
    return mapping;
  }

  try {
    const response = await axios.get(`${apiUrl}/v1/model/info`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      timeout: 15000,
    });

    // 解析回應數據
    const data = response.data?.data;
    if (!Array.isArray(data)) {
      console.warn('⚠️ /v1/model/info 回應格式異常：data 不是陣列');
      return mapping;
    }

    // 建立映射表
    for (const modelInfo of data) {
      const modelName = modelInfo?.model_name;
      const provider = modelInfo?.litellm_params?.custom_llm_provider;

      if (typeof modelName === 'string' && typeof provider === 'string') {
        mapping.set(modelName, provider);
      }
    }

    console.log(`📊 LiteLLM: 建立 ${mapping.size} 個模型的 Provider 映射`);
    return mapping;
  } catch (error) {
    console.error(
      '❌ 獲取 LiteLLM 模型資訊失敗:',
      error instanceof Error ? error.message : String(error),
    );
    return mapping;
  }
}

/**
 * 將 LiteLLM Daily Activity API 回應轉換為儀表板統計數據格式
 *
 * 業務背景：LiteLLM API 返回的數據結構與前端期望的格式不同，
 * 此函數負責進行格式轉換，保持前端組件的相容性。
 *
 * 資料來源：
 * - Provider 統計：直接從 breakdown.providers 取得（API 已聚合好）
 * - Model 統計：從 breakdown.models 取得，並根據 provider 分組
 * - 每日統計：從 breakdown.providers 取得 provider breakdown
 *
 * @param activityData LiteLLM 每日活動統計回應
 * @param modelProviderMapping 模型名稱到 Provider 的映射表（可選，用於解決模型名稱不含 provider 前綴的問題）
 * @returns 轉換後的統計數據
 */
function transformDailyActivityToResponse(
  activityData: LiteLLMDailyActivityResponse,
  modelProviderMapping?: Map<string, string>,
): {
  kpiMetrics: KpiMetrics;
  providerStats: ProviderUsageStats[];
  apiKeyStats: ApiKeyUsageStats[];
  dailyUsageStats: DailyUsageStats[];
  tokenUsageTrend: TokenUsageTrend[];
} {
  const { results, metadata } = activityData;

  // 從 metadata 建立 KPI 指標
  const kpiMetrics: KpiMetrics = {
    totalRequests: metadata.total_api_requests,
    successfulRequests: metadata.total_successful_requests,
    failedRequests: metadata.total_failed_requests,
    totalTokens: metadata.total_tokens,
    totalInputTokens: metadata.total_prompt_tokens,
    totalOutputTokens: metadata.total_completion_tokens,
    totalSpendUsd: metadata.total_spend,
    totalSpendTwd: metadata.total_spend * EXCHANGE_RATE,
    avgTokensPerRequest:
      metadata.total_successful_requests > 0
        ? Math.round(metadata.total_tokens / metadata.total_successful_requests)
        : 0,
    avgCostPerRequest:
      metadata.total_successful_requests > 0
        ? metadata.total_spend / metadata.total_successful_requests
        : 0,
  };

  // 從 breakdown.providers 聚合 Provider 統計（API 已提供聚合數據）
  const providerMap = new Map<
    string,
    {
      requests: number;
      successfulRequests: number;
      failedRequests: number;
      inputTokens: number;
      outputTokens: number;
      totalTokens: number;
      totalCostUsd: number;
      models: Map<string, ModelUsageStats>;
    }
  >();

  // 第一輪：從 breakdown.providers 取得 provider 級別統計
  for (const dayResult of results) {
    const providersBreakdown = dayResult.breakdown.providers || {};

    for (const [providerName, providerItem] of Object.entries(
      providersBreakdown,
    )) {
      const providerMetrics = providerItem.metrics;

      if (!providerMap.has(providerName)) {
        providerMap.set(providerName, {
          requests: 0,
          successfulRequests: 0,
          failedRequests: 0,
          inputTokens: 0,
          outputTokens: 0,
          totalTokens: 0,
          totalCostUsd: 0,
          models: new Map(),
        });
      }

      const providerData = providerMap.get(providerName);
      if (providerData) {
        providerData.requests += providerMetrics.api_requests;
        providerData.successfulRequests +=
          providerMetrics.successful_requests ?? 0;
        providerData.failedRequests += providerMetrics.failed_requests ?? 0;
        providerData.inputTokens += providerMetrics.prompt_tokens;
        providerData.outputTokens += providerMetrics.completion_tokens;
        providerData.totalTokens += providerMetrics.total_tokens;
        providerData.totalCostUsd += providerMetrics.spend;
      }
    }
  }

  // 第二輪：從 breakdown.models 取得每個 model 的統計，並分組到對應 provider
  // 注意：只將 model 加入到第一輪已建立的 provider 中，不創建新的 provider
  for (const dayResult of results) {
    const modelsBreakdown = dayResult.breakdown.models || {};

    for (const [modelName, modelItem] of Object.entries(modelsBreakdown)) {
      const modelMetrics = modelItem.metrics;

      // 優先使用 modelProviderMapping 取得 provider，fallback 到原有邏輯
      // 這解決了 "gpt-oss:20b" -> "ollama"、"rerank-multilingual-v3.0" -> "cohere" 等映射問題
      const provider =
        modelProviderMapping?.get(modelName) ||
        getProviderFromModelName(modelName);

      // 只處理已存在於 providerMap 中的 provider（由 breakdown.providers 建立）
      // 跳過無法對應到正確 provider 的 model（避免 "gemini-2.5-pro" 被當作獨立 provider）
      if (!providerMap.has(provider)) {
        continue;
      }

      const providerData = providerMap.get(provider);
      if (providerData) {
        // 更新模型統計
        if (!providerData.models.has(modelName)) {
          providerData.models.set(modelName, {
            modelName,
            provider,
            requests: 0,
            successfulRequests: 0,
            failedRequests: 0,
            successRate: 0,
            inputTokens: 0,
            outputTokens: 0,
            totalTokens: 0,
            costUsd: 0,
            costTwd: 0,
            avgLatency: 0,
          });
        }

        const modelData = providerData.models.get(modelName);
        if (modelData) {
          modelData.requests += modelMetrics.api_requests;
          modelData.successfulRequests += modelMetrics.successful_requests ?? 0;
          modelData.failedRequests += modelMetrics.failed_requests ?? 0;
          modelData.inputTokens += modelMetrics.prompt_tokens;
          modelData.outputTokens += modelMetrics.completion_tokens;
          modelData.totalTokens += modelMetrics.total_tokens;
          modelData.costUsd += modelMetrics.spend;
        }
      }
    }
  }

  // 轉換 Provider 統計
  const providerStats: ProviderUsageStats[] = Array.from(
    providerMap.entries(),
  ).map(([provider, data]) => {
    const models = Array.from(data.models.values()).map((model) => ({
      ...model,
      successRate:
        model.requests > 0
          ? (model.successfulRequests / model.requests) * 100
          : 0,
      costTwd: model.costUsd * EXCHANGE_RATE,
    }));

    return {
      provider,
      totalRequests: data.requests,
      successfulRequests: data.successfulRequests,
      failedRequests: data.failedRequests,
      totalTokens: data.totalTokens,
      totalCostUsd: data.totalCostUsd,
      totalCostTwd: data.totalCostUsd * EXCHANGE_RATE,
      models,
    };
  });

  // 建立每日使用統計（直接從 breakdown.providers 取得）
  const dailyUsageStats: DailyUsageStats[] = results
    .map((dayResult) => {
      // 直接從 breakdown.providers 建立 provider breakdown
      const providerBreakdown: Record<
        string,
        {
          requests: number;
          successfulRequests: number;
          failedRequests: number;
          tokens: number;
          inputTokens: number;
          outputTokens: number;
          costUsd: number;
        }
      > = {};

      const providersBreakdown = dayResult.breakdown.providers || {};
      for (const [providerName, providerItem] of Object.entries(
        providersBreakdown,
      )) {
        const providerMetrics = providerItem.metrics;
        providerBreakdown[providerName] = {
          requests: providerMetrics.api_requests,
          successfulRequests: providerMetrics.successful_requests ?? 0,
          failedRequests: providerMetrics.failed_requests ?? 0,
          tokens: providerMetrics.total_tokens,
          inputTokens: providerMetrics.prompt_tokens,
          outputTokens: providerMetrics.completion_tokens,
          costUsd: providerMetrics.spend,
        };
      }

      return {
        date: dayResult.date,
        totalRequests: dayResult.metrics.api_requests,
        successfulRequests: dayResult.metrics.successful_requests,
        failedRequests: dayResult.metrics.failed_requests,
        totalTokens: dayResult.metrics.total_tokens,
        totalCostUsd: dayResult.metrics.spend,
        totalCostTwd: dayResult.metrics.spend * EXCHANGE_RATE,
        providerBreakdown,
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  // 建立 Token 使用趨勢
  const tokenUsageTrend: TokenUsageTrend[] = results
    .map((dayResult) => ({
      date: dayResult.date,
      inputTokens: dayResult.metrics.prompt_tokens,
      outputTokens: dayResult.metrics.completion_tokens,
      totalTokens: dayResult.metrics.total_tokens,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // 從 breakdown.providers[providerName].api_key_breakdown 聚合 API 金鑰統計
  // 追蹤每個金鑰使用的 providers，以支援按 provider 過濾
  const apiKeyMap = new Map<
    string,
    {
      alias: string;
      requests: number;
      costUsd: number;
      providers: Set<string>;
    }
  >();

  for (const dayResult of results) {
    const providersBreakdown = dayResult.breakdown.providers || {};

    for (const [providerName, providerItem] of Object.entries(
      providersBreakdown,
    )) {
      // 從每個 provider 的 api_key_breakdown 收集金鑰資料
      // Schema 已在源頭定義完整（ApiKeyBreakdownItemSchema），無需額外驗證
      const apiKeyBreakdown = providerItem.api_key_breakdown ?? {};

      for (const [keyIdentifier, keyItem] of Object.entries(apiKeyBreakdown)) {
        const keyMetrics = keyItem.metrics;
        // 從 metadata 中提取 key_alias（如果有的話）
        // metadata 已由 ApiKeyBreakdownMetadataSchema 驗證過
        const keyAlias =
          keyItem.metadata?.key_alias ||
          keyItem.metadata?.alias ||
          keyIdentifier;

        if (!apiKeyMap.has(keyIdentifier)) {
          apiKeyMap.set(keyIdentifier, {
            alias: keyAlias,
            requests: 0,
            costUsd: 0,
            providers: new Set<string>(),
          });
        }

        const keyData = apiKeyMap.get(keyIdentifier);
        if (keyData) {
          keyData.requests += keyMetrics.api_requests;
          keyData.costUsd += keyMetrics.spend;
          keyData.providers.add(providerName);
          // 更新 alias（以最新的為準）
          if (keyAlias !== keyIdentifier) {
            keyData.alias = keyAlias;
          }
        }
      }
    }
  }

  // 轉換 API 金鑰統計並按費用降序排序
  const apiKeyStats: ApiKeyUsageStats[] = Array.from(apiKeyMap.entries())
    .map(([keyIdentifier, data]) => ({
      keyId: keyIdentifier,
      keyAlias: data.alias,
      requests: data.requests,
      costUsd: data.costUsd,
      costTwd: data.costUsd * EXCHANGE_RATE,
      providers: Array.from(data.providers).sort(),
    }))
    .sort((a, b) => b.costTwd - a.costTwd);

  return {
    kpiMetrics,
    providerStats,
    apiKeyStats,
    dailyUsageStats,
    tokenUsageTrend,
  };
}

/**
 * 建立空的統計數據（當 LiteLLM API 未配置或返回錯誤時使用）
 * @returns 空的統計數據
 */
function createEmptyStats(): {
  kpiMetrics: KpiMetrics;
  providerStats: ProviderUsageStats[];
  apiKeyStats: ApiKeyUsageStats[];
  dailyUsageStats: DailyUsageStats[];
  tokenUsageTrend: TokenUsageTrend[];
} {
  return {
    kpiMetrics: {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      totalTokens: 0,
      totalInputTokens: 0,
      totalOutputTokens: 0,
      totalSpendUsd: 0,
      totalSpendTwd: 0,
      avgTokensPerRequest: 0,
      avgCostPerRequest: 0,
    },
    providerStats: [],
    apiKeyStats: [],
    dailyUsageStats: [],
    tokenUsageTrend: [],
  };
}

/**
 * 生成每日成本詳細數據
 *
 * 業務背景：將訂閱費用（平攤每日）與 LiteLLM 使用費用合併，
 * 生成前端圖表需要的每日成本明細。
 *
 * @param subscriptions 訂閱服務
 * @param dailyUsageStats 每日使用統計
 * @param startDateStr 開始日期 (YYYY-MM-DD)
 * @param endDateStr 結束日期 (YYYY-MM-DD)
 * @returns 每日成本詳細數據
 */
function generateDailyCostDetailed(
  subscriptions: SubscriptionWithTWD[],
  dailyUsageStats: DailyUsageStats[],
  startDateStr: string,
  endDateStr: string,
): DailyCostDetail[] {
  const result: DailyCostDetail[] = [];

  // 根據實際日期範圍生成日期列表（而非從今天往回算）
  const dates: string[] = [];
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  for (
    let current = new Date(startDate);
    current <= endDate;
    current.setDate(current.getDate() + 1)
  ) {
    dates.push(current.toISOString().split('T')[0]);
  }

  // 建立每日使用統計的 Map
  const dailyStatsMap = new Map(dailyUsageStats.map((d) => [d.date, d]));

  // 為每天生成數據
  for (const date of dates) {
    // 添加固定訂閱費用（平攤到每日，假設月訂閱）
    for (const sub of subscriptions) {
      result.push({
        date,
        provider: sub.ai_name.split(' ')[0],
        model: sub.ai_name,
        cost: sub.priceTWD / 30,
      });
    }

    // 添加 LiteLLM 使用費用
    const dailyStats = dailyStatsMap.get(date);
    if (dailyStats) {
      for (const [provider, breakdown] of Object.entries(
        dailyStats.providerBreakdown,
      )) {
        result.push({
          date,
          provider,
          model: `${provider} 用量`,
          cost: breakdown.costUsd * EXCHANGE_RATE,
        });
      }
    }
  }

  return result;
}

/**
 * 解析日期範圍參數
 * @param query 查詢參數
 * @returns 日期範圍字串和實際天數
 */
function parseDateRangeParams(query: {
  days?: string;
  startDate?: string;
  endDate?: string;
}): { startDateStr: string; endDateStr: string; actualDays: number } {
  const startDateParam = query.startDate;
  const endDateParam = query.endDate;
  const days = parseInt(query.days || '30', 10) || 30;

  if (startDateParam && endDateParam) {
    const start = new Date(startDateParam);
    const end = new Date(endDateParam);
    const actualDays =
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return {
      startDateStr: startDateParam,
      endDateStr: endDateParam,
      actualDays,
    };
  }

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  return {
    startDateStr: startDate.toISOString().split('T')[0],
    endDateStr: endDate.toISOString().split('T')[0],
    actualDays: days,
  };
}

/**
 * 計算預算信息
 *
 * 預算上限（budgetTotal）的計算方式：
 * 1. 優先使用環境變數 GATEWAY_BUDGET_LIMIT（若有設定）
 * 2. 若未設定，fallback 到訂閱總額 × 1.2（僅供展示用）
 *
 * @param subscriptions 訂閱服務
 * @param kpiMetrics KPI 指標
 * @returns 預算信息
 */
function calculateBudget(
  subscriptions: SubscriptionWithTWD[],
  kpiMetrics: KpiMetrics,
): { total: number; used: number; remaining: number; percentage: number } {
  const subscriptionTotal = subscriptions.reduce(
    (sum, s) => sum + s.priceTWD,
    0,
  );
  const usageCost = kpiMetrics.totalSpendTwd;

  // 預算上限：優先使用環境變數，否則使用訂閱總額 × 1.2
  // TODO: 移除 subscriptionTotal * 1.2 的 fallback 邏輯，改為強制要求設定 GATEWAY_BUDGET_LIMIT 環境變數
  const envBudgetLimit = getGatewayBudgetLimit();
  const budgetTotal =
    envBudgetLimit !== null
      ? Math.round(envBudgetLimit)
      : Math.round(subscriptionTotal * 1.2);

  const budgetUsed = Math.round(subscriptionTotal + usageCost);
  const budgetRemaining = budgetTotal - budgetUsed;
  const budgetPercentage =
    budgetTotal > 0 ? (budgetUsed / budgetTotal) * 100 : 0;

  return {
    total: budgetTotal,
    used: budgetUsed,
    remaining: budgetRemaining,
    percentage: Math.round(budgetPercentage * 10) / 10,
  };
}

// ============================================================
// API 端點 - 訂閱管理
// ============================================================

/**
 * 取得訂閱清單
 * GET /api/gateway/subscription
 *
 * Response (成功): BasicSubscription[]
 * Response (失敗): { error: string, details?: string }
 */
function handleGetSubscription(
  _req: Request,
  res: Response<BasicSubscription[] | ErrorResponse>,
): void {
  try {
    if (!fs.existsSync(subscriptionFilePath)) {
      res.status(500).json({ error: 'subscription.json 不存在' });
      return;
    }

    const data = readSubscriptionData();
    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: '讀取 subscription.json 失敗',
      details: error instanceof Error ? error.message : String(error),
    });
  }
}

router.get('/subscription', handleGetSubscription);

/**
 * 更新訂閱清單
 * PUT /api/gateway/subscription
 *
 * Body: BasicSubscription[]
 * Response (成功): { success: true, data: BasicSubscription[] }
 * Response (失敗): { error: string, details?: string }
 */
function handleUpdateSubscription(
  req: Request,
  res: Response<UpdateSubscriptionResponse | ErrorResponse>,
): void {
  try {
    if (!fs.existsSync(subscriptionFilePath)) {
      res.status(500).json({ error: 'subscription.json 不存在' });
      return;
    }

    const existingData = readSubscriptionData();

    const requestBody: unknown = req.body;

    if (!Array.isArray(requestBody)) {
      res.status(400).json({ error: '請提供陣列格式的訂閱資料' });
      return;
    }

    // 驗證每筆資料格式
    const validationError = validateSubscriptionData(requestBody);
    if (validationError) {
      res.status(400).json({ error: validationError });
      return;
    }

    // ai_name 重複時視為更新，以最後一次出現為準
    // 使用 Zod parse 確保類型安全，避免 as 斷言
    const requestDataByAiName = new Map<string, SubscriptionInput>();
    const requestAiNameOrder: string[] = [];
    for (const item of requestBody) {
      // validateSubscriptionData 已驗證過，這裡可安全使用 parse
      const data = SubscriptionInputSchema.parse(item);
      if (!requestDataByAiName.has(data.ai_name)) {
        requestAiNameOrder.push(data.ai_name);
      }
      requestDataByAiName.set(data.ai_name, data);
    }

    // 使用非空斷言函數取代 as 斷言
    const getValidatedData = (aiName: string): SubscriptionInput => {
      const data = requestDataByAiName.get(aiName);
      if (!data) {
        throw new Error(`內部錯誤：找不到 ai_name=${aiName} 的資料`);
      }
      return data;
    };

    const normalizedRequestData = requestAiNameOrder.map(getValidatedData);

    const now = getNowDatetimeString();

    // 以 ai_name 作為對應鍵，維持舊資料的 create_time
    const createTimeByAiName = new Map<string, string>();
    for (const item of existingData) {
      if (
        typeof item.create_time !== 'string' ||
        !DATETIME_REGEX.test(item.create_time)
      )
        continue;
      createTimeByAiName.set(item.ai_name, item.create_time);
    }

    const updatedData: BasicSubscription[] = normalizedRequestData.map(
      (data) => {
        // 若現有資料中有該 ai_name 的有效 create_time，則保留原值；否則使用 now
        const createTime = createTimeByAiName.get(data.ai_name) ?? now;

        return {
          ai_name: data.ai_name,
          price: data.price,
          duration: data.duration,
          subscribe_time: data.subscribe_time,
          currency_code: data.currency_code,
          create_time: createTime,
          update_time: now,
        };
      },
    );

    writeSubscriptionData(updatedData);

    res.json({ success: true, data: updatedData });
  } catch (error) {
    res.status(500).json({
      error: '更新 subscription.json 失敗',
      details: error instanceof Error ? error.message : String(error),
    });
  }
}

router.put('/subscription', handleUpdateSubscription);

// ============================================================
// API 端點 - Dashboard
// ============================================================

/**
 * 取得儀表板完整數據
 * GET /api/gateway/dashboard
 *
 * Query Parameters:
 *   - days: 查詢天數（預設 30，當 startDate/endDate 未提供時使用）
 *   - startDate: 開始日期（格式：YYYY-MM-DD）
 *   - endDate: 結束日期（格式：YYYY-MM-DD）
 *   - provider: 過濾特定 provider（可選）
 *
 * Response (成功): DashboardDataResponse
 * Response (失敗): { error: string, details?: string }
 */
async function handleGetDashboard(
  req: Request,
  res: Response<DashboardDataResponse | ErrorResponse>,
): Promise<void> {
  try {
    // 解析查詢參數（使用類型守衛確保類型安全）
    const queryParams = {
      days: typeof req.query.days === 'string' ? req.query.days : undefined,
      startDate:
        typeof req.query.startDate === 'string'
          ? req.query.startDate
          : undefined,
      endDate:
        typeof req.query.endDate === 'string' ? req.query.endDate : undefined,
    };

    console.log('📊 收到的查詢參數:', {
      rawDays: req.query.days,
      rawStartDate: req.query.startDate,
      rawEndDate: req.query.endDate,
      parsedParams: queryParams,
    });

    const { startDateStr, endDateStr, actualDays } =
      parseDateRangeParams(queryParams);

    console.log(
      `📊 獲取 AI Gateway 儀表板數據: ${startDateStr} 至 ${endDateStr} (${actualDays} 天)`,
    );

    // 1. 讀取訂閱數據
    let subscriptions: SubscriptionWithTWD[] = [];
    if (fs.existsSync(subscriptionFilePath)) {
      const basicSubscriptions = readSubscriptionData();
      subscriptions = convertToSubscriptionsWithTWD(basicSubscriptions);
    }

    // 2. 並行獲取 LiteLLM 資料：每日活動統計 & 模型 Provider 映射
    const [activityData, modelProviderMapping] = await Promise.all([
      fetchLiteLLMDailyActivity(startDateStr, endDateStr),
      fetchModelProviderMapping(),
    ]);

    // 3. 轉換為儀表板統計數據格式（傳入模型映射表以正確關聯 models 到 providers）
    const {
      kpiMetrics,
      providerStats,
      apiKeyStats,
      dailyUsageStats,
      tokenUsageTrend,
    } = activityData
      ? transformDailyActivityToResponse(activityData, modelProviderMapping)
      : createEmptyStats();

    // 4. 生成每日成本詳細數據（使用實際日期範圍，確保與 LiteLLM API 查詢一致）
    const dailyCostDetailed = generateDailyCostDetailed(
      subscriptions,
      dailyUsageStats,
      startDateStr,
      endDateStr,
    );

    // 5. 計算預算信息
    const budget = calculateBudget(subscriptions, kpiMetrics);

    // 6. 組裝回應
    const response: DashboardDataResponse = {
      subscriptions,
      budget,
      kpiMetrics,
      providerStats,
      apiKeyStats,
      dailyUsageStats,
      tokenUsageTrend,
      dailyCostDetailed,
      metadata: {
        generatedAt: new Date().toISOString(),
        timeRange: {
          start: startDateStr,
          end: endDateStr,
        },
        exchangeRate: EXCHANGE_RATE,
      },
    };

    console.log(
      `✅ 儀表板數據生成完成: ${dailyUsageStats.length} 天數據, ${providerStats.length} 個 providers`,
    );
    res.json(response);
  } catch (error) {
    console.error('❌ 獲取儀表板數據失敗:', error);
    res.status(500).json({
      error: '獲取儀表板數據失敗',
      details: error instanceof Error ? error.message : String(error),
    });
  }
}

router.get('/dashboard', handleGetDashboard);

// TODO: 未來將整個專案改為 TypeScript 可以改成 export default
// 使用 CommonJS 格式導出，因為 index.js 使用 require() 引入
// 如果改用 ES6 export default，會導致 "argument handler must be a function" 錯誤
module.exports = router;
