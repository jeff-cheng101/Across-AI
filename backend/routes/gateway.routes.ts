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
 * LiteLLM Spend Log Schema
 * 用於驗證第三方 API 回應（基於 LiteLLM 1.80.15 /spend/logs/v2 API）
 *
 * 注意：error_information 存在於 metadata 物件中，不是頂層欄位
 */
const LiteLLMSpendLogSchema = z.object({
  request_id: z.string(),
  call_type: z.string(),
  api_key: z.string(),
  spend: z.number(),
  total_tokens: z.number(),
  prompt_tokens: z.number(),
  completion_tokens: z.number(),
  startTime: z.string(),
  endTime: z.string(),
  model: z.string(),
  user: z.string(),
  metadata: z.record(z.string(), z.unknown()),
  cache_hit: z.string(),
  cache_key: z.string(),
  request_tags: z.array(z.unknown()), // 可能是空陣列或字串陣列
  team_id: z.string(),
  end_user: z.string(),
  api_base: z.string(),
  custom_llm_provider: z.string(),
  // 狀態欄位（LiteLLM 1.63.0+ 支援）
  status: z.enum(['success', 'failure']).optional(),
});
type LiteLLMSpendLog = z.infer<typeof LiteLLMSpendLogSchema>;

/**
 * LiteLLM Spend Log 清單 Schema
 */
const LiteLLMSpendLogListSchema = z.array(LiteLLMSpendLogSchema);

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
      tokens: number;
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
 * 驗證單筆訂閱資料（用於 PUT 請求）
 * @param item 待驗證的資料
 * @param index 資料索引（用於錯誤訊息）
 * @returns 錯誤訊息，若無錯誤則返回 null
 */
function validateSubscriptionItem(item: unknown, index: number): string | null {
  if (typeof item !== 'object' || item === null) {
    return `第 ${index + 1} 筆資料必須是物件`;
  }

  const data = item as Record<string, unknown>;

  // ai_name: 文字，必填
  if (typeof data.ai_name !== 'string' || data.ai_name.trim() === '') {
    return `第 ${index + 1} 筆: ai_name 必須是非空字串`;
  }

  // price: 數值，小數點2位
  if (
    typeof data.price !== 'number' ||
    Number.isNaN(data.price) ||
    data.price < 0
  ) {
    return `第 ${index + 1} 筆: price 必須是非負數值`;
  }

  // duration: 正整數
  if (
    typeof data.duration !== 'number' ||
    !Number.isInteger(data.duration) ||
    data.duration <= 0
  ) {
    return `第 ${index + 1} 筆: duration 必須是正整數`;
  }

  // subscribe_time: YYYY-MM-DD hh:mm:ss
  if (
    typeof data.subscribe_time !== 'string' ||
    !DATETIME_REGEX.test(data.subscribe_time)
  ) {
    return `第 ${index + 1} 筆: subscribe_time 格式必須為 YYYY-MM-DD hh:mm:ss`;
  }

  // currency_code: USD 或 TWD
  if (
    typeof data.currency_code !== 'string' ||
    !ALLOWED_CURRENCIES.includes(
      data.currency_code as (typeof ALLOWED_CURRENCIES)[number],
    )
  ) {
    return `第 ${index + 1} 筆: currency_code 必須是 ${ALLOWED_CURRENCIES.join(' 或 ')}`;
  }

  // create_time: YYYY-MM-DD hh:mm:ss（可選，若提供需符合格式）
  if (typeof data.create_time !== 'undefined') {
    if (
      typeof data.create_time !== 'string' ||
      (data.create_time !== '' && !DATETIME_REGEX.test(data.create_time))
    ) {
      return `第 ${index + 1} 筆: create_time 格式必須為 YYYY-MM-DD hh:mm:ss`;
    }
  }

  // update_time: YYYY-MM-DD hh:mm:ss（可選，若提供需符合格式）
  if (typeof data.update_time !== 'undefined') {
    if (
      typeof data.update_time !== 'string' ||
      (data.update_time !== '' && !DATETIME_REGEX.test(data.update_time))
    ) {
      return `第 ${index + 1} 筆: update_time 格式必須為 YYYY-MM-DD hh:mm:ss`;
    }
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
 * LiteLLM /spend/logs/v2 分頁回應 Schema
 */
const LiteLLMSpendLogsV2ResponseSchema = z.object({
  data: LiteLLMSpendLogListSchema,
  total: z.number(),
  page: z.number(),
  page_size: z.number(),
  total_pages: z.number(),
});

/**
 * 從 LiteLLM API 獲取花費日誌（使用 v2 分頁 API）
 *
 * 注意：/spend/logs 已棄用，改用 /spend/logs/v2
 *
 * @param startDate 開始日期
 * @param endDate 結束日期
 * @returns 花費日誌列表
 */
async function fetchLiteLLMSpendLogs(
  startDate: string,
  endDate: string,
): Promise<LiteLLMSpendLog[]> {
  const apiUrl = getLiteLLMApiUrl();
  const apiKey = getLiteLLMApiKey();

  if (!apiUrl || !apiKey) {
    console.warn('⚠️ LiteLLM API 未配置，返回空數據');
    return [];
  }

  const allLogs: LiteLLMSpendLog[] = [];
  const pageSize = 100; // 最大值
  let currentPage = 1;
  let totalPages = 1;

  try {
    // 分頁獲取所有數據
    do {
      const response = await axios.get(`${apiUrl}/spend/logs/v2`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        params: {
          start_date: startDate,
          end_date: endDate,
          page: currentPage,
          page_size: pageSize,
        },
        timeout: 30000,
      });

      // 使用 Zod 驗證 API 回應
      const result = LiteLLMSpendLogsV2ResponseSchema.safeParse(response.data);
      if (result.success) {
        allLogs.push(...result.data.data);
        totalPages = result.data.total_pages;
        currentPage++;
      } else {
        console.warn(
          `⚠️ LiteLLM API 回應格式異常 (頁 ${currentPage}):`,
          result.error.message,
        );
        break;
      }
    } while (currentPage <= totalPages);

    console.log(`📊 LiteLLM: 共獲取 ${allLogs.length} 條花費日誌`);
    return allLogs;
  } catch (error) {
    console.error(
      '❌ 獲取 LiteLLM 花費日誌失敗:',
      error instanceof Error ? error.message : String(error),
    );
    return [];
  }
}

/**
 * 取得 Provider 名稱
 * 優先使用 LiteLLM 回傳的 custom_llm_provider，若為空則使用模型名稱
 * @param log LiteLLM 花費日誌
 * @returns Provider 名稱
 */
function getProvider(log: LiteLLMSpendLog): string {
  // 優先使用 LiteLLM 提供的 provider
  if (log.custom_llm_provider) {
    return log.custom_llm_provider;
  }

  // fallback：從模型名稱取第一段作為 provider
  // 例如 "openai/gpt-4" -> "openai"
  const parts = log.model.split('/');
  if (parts.length > 1) {
    return parts[0];
  }

  return log.model || 'Unknown';
}

/**
 * 處理 LiteLLM 花費日誌，生成統計數據
 * @param spendLogs LiteLLM 花費日誌
 * @returns 處理後的統計數據
 */
function processSpendLogs(spendLogs: LiteLLMSpendLog[]): {
  kpiMetrics: KpiMetrics;
  providerStats: ProviderUsageStats[];
  dailyUsageStats: DailyUsageStats[];
  tokenUsageTrend: TokenUsageTrend[];
} {
  // 初始化 KPI 指標
  const kpiMetrics: KpiMetrics = {
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
  };

  // Provider 統計 Map
  const providerMap = new Map<
    string,
    {
      requests: number;
      successfulRequests: number;
      failedRequests: number;
      totalTokens: number;
      totalCostUsd: number;
      models: Map<string, ModelUsageStats>;
    }
  >();

  // 每日統計 Map
  const dailyMap = new Map<
    string,
    {
      totalRequests: number;
      successfulRequests: number;
      failedRequests: number;
      totalTokens: number;
      totalCostUsd: number;
      providerBreakdown: Record<
        string,
        { requests: number; tokens: number; costUsd: number }
      >;
    }
  >();

  // Token 趨勢 Map
  const tokenTrendMap = new Map<
    string,
    { inputTokens: number; outputTokens: number; totalTokens: number }
  >();

  // 處理每條日誌
  for (const log of spendLogs) {
    const provider = getProvider(log);
    const date = log.startTime.split('T')[0];
    // 判斷請求是否成功：
    // - 優先使用 status 欄位（LiteLLM 1.63.0+ 支援）
    // - 若 status 未定義（舊版 LiteLLM），fallback 到 total_tokens > 0
    const isSuccess =
      log.status === 'success' ||
      (log.status === undefined && log.total_tokens > 0);

    // 更新 KPI 指標
    kpiMetrics.totalRequests++;
    if (isSuccess) {
      kpiMetrics.successfulRequests++;
      kpiMetrics.totalTokens += log.total_tokens;
      kpiMetrics.totalInputTokens += log.prompt_tokens;
      kpiMetrics.totalOutputTokens += log.completion_tokens;
    } else {
      kpiMetrics.failedRequests++;
    }
    kpiMetrics.totalSpendUsd += log.spend;

    // 更新 Provider 統計
    if (!providerMap.has(provider)) {
      providerMap.set(provider, {
        requests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        totalTokens: 0,
        totalCostUsd: 0,
        models: new Map(),
      });
    }
    const providerData = providerMap.get(provider);
    if (providerData) {
      providerData.requests++;
      if (isSuccess) {
        providerData.successfulRequests++;
        providerData.totalTokens += log.total_tokens;
      } else {
        providerData.failedRequests++;
      }
      providerData.totalCostUsd += log.spend;

      // 更新模型統計
      if (!providerData.models.has(log.model)) {
        providerData.models.set(log.model, {
          modelName: log.model,
          provider,
          requests: 0,
          successRate: 0,
          inputTokens: 0,
          outputTokens: 0,
          totalTokens: 0,
          costUsd: 0,
          costTwd: 0,
          avgLatency: 0,
        });
      }
      const modelData = providerData.models.get(log.model);
      if (modelData) {
        modelData.requests++;
        if (isSuccess) {
          modelData.inputTokens += log.prompt_tokens;
          modelData.outputTokens += log.completion_tokens;
          modelData.totalTokens += log.total_tokens;
        }
        modelData.costUsd += log.spend;
      }
    }

    // 更新每日統計
    if (!dailyMap.has(date)) {
      dailyMap.set(date, {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        totalTokens: 0,
        totalCostUsd: 0,
        providerBreakdown: {},
      });
    }
    const dailyData = dailyMap.get(date);
    if (dailyData) {
      dailyData.totalRequests++;
      if (isSuccess) {
        dailyData.successfulRequests++;
        dailyData.totalTokens += log.total_tokens;
      } else {
        dailyData.failedRequests++;
      }
      dailyData.totalCostUsd += log.spend;

      if (!dailyData.providerBreakdown[provider]) {
        dailyData.providerBreakdown[provider] = {
          requests: 0,
          tokens: 0,
          costUsd: 0,
        };
      }
      dailyData.providerBreakdown[provider].requests++;
      dailyData.providerBreakdown[provider].tokens += log.total_tokens;
      dailyData.providerBreakdown[provider].costUsd += log.spend;
    }

    // 更新 Token 趨勢
    if (!tokenTrendMap.has(date)) {
      tokenTrendMap.set(date, {
        inputTokens: 0,
        outputTokens: 0,
        totalTokens: 0,
      });
    }
    const tokenData = tokenTrendMap.get(date);
    if (tokenData) {
      tokenData.inputTokens += log.prompt_tokens;
      tokenData.outputTokens += log.completion_tokens;
      tokenData.totalTokens += log.total_tokens;
    }
  }

  // 計算平均值
  if (kpiMetrics.successfulRequests > 0) {
    kpiMetrics.avgTokensPerRequest = Math.round(
      kpiMetrics.totalTokens / kpiMetrics.successfulRequests,
    );
    kpiMetrics.avgCostPerRequest =
      kpiMetrics.totalSpendUsd / kpiMetrics.successfulRequests;
  }
  kpiMetrics.totalSpendTwd = kpiMetrics.totalSpendUsd * EXCHANGE_RATE;

  // 轉換 Provider 統計
  const providerStats: ProviderUsageStats[] = Array.from(
    providerMap.entries(),
  ).map(([provider, data]) => {
    const models = Array.from(data.models.values()).map((model) => ({
      ...model,
      successRate:
        model.requests > 0
          ? ((model.requests -
              (data.failedRequests / data.requests) * model.requests) /
              model.requests) *
            100
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

  // 轉換每日統計並排序
  const dailyUsageStats: DailyUsageStats[] = Array.from(dailyMap.entries())
    .map(([date, data]) => ({
      date,
      totalRequests: data.totalRequests,
      successfulRequests: data.successfulRequests,
      failedRequests: data.failedRequests,
      totalTokens: data.totalTokens,
      totalCostUsd: data.totalCostUsd,
      totalCostTwd: data.totalCostUsd * EXCHANGE_RATE,
      providerBreakdown: data.providerBreakdown,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // 轉換 Token 趨勢並排序
  const tokenUsageTrend: TokenUsageTrend[] = Array.from(tokenTrendMap.entries())
    .map(([date, data]) => ({
      date,
      ...data,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    kpiMetrics,
    providerStats,
    dailyUsageStats,
    tokenUsageTrend,
  };
}

/**
 * 生成每日成本詳細數據
 * @param subscriptions 訂閱服務
 * @param dailyUsageStats 每日使用統計
 * @param days 天數
 * @returns 每日成本詳細數據
 */
function generateDailyCostDetailed(
  subscriptions: SubscriptionWithTWD[],
  dailyUsageStats: DailyUsageStats[],
  days: number,
): DailyCostDetail[] {
  const result: DailyCostDetail[] = [];
  const today = new Date();

  // 生成過去 N 天的日期列表
  const dates: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
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
 * 2. 若未設定，fallback 到訂閱總額 × 1.2
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
    const requestDataByAiName = new Map<string, Record<string, unknown>>();
    const requestAiNameOrder: string[] = [];
    for (const item of requestBody) {
      const data = item as Record<string, unknown>;
      const aiName = data.ai_name as string;
      if (!requestDataByAiName.has(aiName)) {
        requestAiNameOrder.push(aiName);
      }
      requestDataByAiName.set(aiName, data);
    }

    const normalizedRequestData = requestAiNameOrder.map(
      (aiName) => requestDataByAiName.get(aiName) as Record<string, unknown>,
    );

    const now = getNowDatetimeString();
    const hasExistingUpdateTime = existingData.some((item) => {
      return (
        typeof item.update_time === 'string' &&
        DATETIME_REGEX.test(item.update_time)
      );
    });

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
        const aiName = typeof data.ai_name === 'string' ? data.ai_name : '';
        const createTime = !hasExistingUpdateTime
          ? now
          : (createTimeByAiName.get(aiName) ?? now);

        return {
          ai_name: data.ai_name as string,
          price: data.price as number,
          duration: data.duration as number,
          subscribe_time: data.subscribe_time as string,
          currency_code: data.currency_code as string,
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
    const providerFilter =
      typeof req.query.provider === 'string' ? req.query.provider : undefined;

    const queryParams = {
      days: typeof req.query.days === 'string' ? req.query.days : undefined,
      startDate:
        typeof req.query.startDate === 'string'
          ? req.query.startDate
          : undefined,
      endDate:
        typeof req.query.endDate === 'string' ? req.query.endDate : undefined,
    };

    const { startDateStr, endDateStr, actualDays } =
      parseDateRangeParams(queryParams);

    console.log(
      `📊 獲取 AI Gateway 儀表板數據: ${startDateStr} 至 ${endDateStr}`,
    );

    // 1. 讀取訂閱數據
    let subscriptions: SubscriptionWithTWD[] = [];
    if (fs.existsSync(subscriptionFilePath)) {
      const basicSubscriptions = readSubscriptionData();
      subscriptions = convertToSubscriptionsWithTWD(basicSubscriptions);
    }

    // 2. 從 LiteLLM 獲取花費日誌
    const spendLogs = await fetchLiteLLMSpendLogs(startDateStr, endDateStr);

    // 3. 處理花費日誌生成統計數據
    const { kpiMetrics, providerStats, dailyUsageStats, tokenUsageTrend } =
      processSpendLogs(spendLogs);

    // 4. 如果有 provider 過濾，過濾數據
    let filteredProviderStats = providerStats;
    let filteredDailyUsageStats = dailyUsageStats;
    if (providerFilter && providerFilter !== 'all') {
      filteredProviderStats = providerStats.filter(
        (p) => p.provider.toLowerCase() === providerFilter.toLowerCase(),
      );
      filteredDailyUsageStats = dailyUsageStats.map((d) => ({
        ...d,
        providerBreakdown: Object.fromEntries(
          Object.entries(d.providerBreakdown).filter(
            ([provider]) =>
              provider.toLowerCase() === providerFilter.toLowerCase(),
          ),
        ),
      }));
    }

    // 5. 生成每日成本詳細數據
    const dailyCostDetailed = generateDailyCostDetailed(
      subscriptions,
      filteredDailyUsageStats,
      actualDays,
    );

    // 6. 計算預算信息
    const budget = calculateBudget(subscriptions, kpiMetrics);

    // 7. 組裝回應
    const response: DashboardDataResponse = {
      subscriptions,
      budget,
      kpiMetrics,
      providerStats: filteredProviderStats,
      dailyUsageStats: filteredDailyUsageStats,
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
      `✅ 儀表板數據生成完成: ${spendLogs.length} 條日誌, ${filteredProviderStats.length} 個 providers`,
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
