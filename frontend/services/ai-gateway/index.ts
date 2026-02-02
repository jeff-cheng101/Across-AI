/**
 * AI Gateway 服務 - Schema、類型與 API
 *
 * 業務背景：整合 LiteLLM 使用量統計與訂閱費用，提供 AI 服務成本監控。
 * 用於 /ai-gateway 儀表板頁面，顯示 KPI、圖表、預算消耗等資訊。
 *
 * 資料流：前端 → backendClient → Node.js 後端 → LiteLLM API + subscription.json
 *
 * 依賴：backendClient（後端 API 服務）、後端需配置 LITELLM_API_URL
 */

import { z } from 'zod';
import { backendClient } from '@/lib/api-clients';

// ===== Schema 定義 =====

/**
 * 基礎訂閱資料 Schema
 * 對應後端 subscription.json 結構
 */
export const BasicSubscriptionSchema = z.object({
  ai_name: z.string(),
  price: z.number(),
  duration: z.number(),
  subscribe_time: z.string(),
  currency_code: z.string(),
  create_time: z.string(),
  update_time: z.string(),
});
export type BasicSubscription = z.infer<typeof BasicSubscriptionSchema>;

/**
 * 訂閱服務（含 TWD 轉換）Schema
 */
export const SubscriptionWithTWDSchema = BasicSubscriptionSchema.extend({
  priceTWD: z.number(),
});
export type SubscriptionWithTWD = z.infer<typeof SubscriptionWithTWDSchema>;

/**
 * 預算資料 Schema
 */
export const BudgetSchema = z.object({
  total: z.number(),
  used: z.number(),
  remaining: z.number(),
  percentage: z.number(),
});
export type Budget = z.infer<typeof BudgetSchema>;

/**
 * KPI 指標 Schema
 */
export const KpiMetricsSchema = z.object({
  totalRequests: z.number(),
  successfulRequests: z.number(),
  failedRequests: z.number(),
  totalTokens: z.number(),
  totalInputTokens: z.number(),
  totalOutputTokens: z.number(),
  totalSpendUsd: z.number(),
  totalSpendTwd: z.number(),
  avgTokensPerRequest: z.number(),
  avgCostPerRequest: z.number(),
});
export type KpiMetrics = z.infer<typeof KpiMetricsSchema>;

/**
 * 模型使用統計 Schema
 */
export const ModelUsageStatsSchema = z.object({
  modelName: z.string(),
  provider: z.string(),
  requests: z.number(),
  successfulRequests: z.number(),
  failedRequests: z.number(),
  successRate: z.number(),
  inputTokens: z.number(),
  outputTokens: z.number(),
  totalTokens: z.number(),
  costUsd: z.number(),
  costTwd: z.number(),
  avgLatency: z.number(),
});
export type ModelUsageStats = z.infer<typeof ModelUsageStatsSchema>;

/**
 * Provider 使用統計 Schema
 */
export const ProviderUsageStatsSchema = z.object({
  provider: z.string(),
  totalRequests: z.number(),
  successfulRequests: z.number(),
  failedRequests: z.number(),
  totalTokens: z.number(),
  totalCostUsd: z.number(),
  totalCostTwd: z.number(),
  models: z.array(ModelUsageStatsSchema),
});
export type ProviderUsageStats = z.infer<typeof ProviderUsageStatsSchema>;

/**
 * Provider 分解資料 Schema（用於每日統計）
 * 包含每日各 provider 的請求數、Token 數和成本明細
 */
export const ProviderBreakdownSchema = z.record(
  z.string(),
  z.object({
    requests: z.number(),
    successfulRequests: z.number(),
    failedRequests: z.number(),
    tokens: z.number(),
    inputTokens: z.number(),
    outputTokens: z.number(),
    costUsd: z.number(),
  }),
);
export type ProviderBreakdown = z.infer<typeof ProviderBreakdownSchema>;

/**
 * 每日使用統計 Schema
 */
export const DailyUsageStatsSchema = z.object({
  date: z.string(),
  totalRequests: z.number(),
  successfulRequests: z.number(),
  failedRequests: z.number(),
  totalTokens: z.number(),
  totalCostUsd: z.number(),
  totalCostTwd: z.number(),
  providerBreakdown: ProviderBreakdownSchema,
});
export type DailyUsageStats = z.infer<typeof DailyUsageStatsSchema>;

/**
 * Token 使用趨勢 Schema
 */
export const TokenUsageTrendSchema = z.object({
  date: z.string(),
  inputTokens: z.number(),
  outputTokens: z.number(),
  totalTokens: z.number(),
});
export type TokenUsageTrend = z.infer<typeof TokenUsageTrendSchema>;

/**
 * 每日成本詳細資料 Schema
 */
export const DailyCostDetailSchema = z.object({
  date: z.string(),
  provider: z.string(),
  model: z.string(),
  cost: z.number(),
});
export type DailyCostDetail = z.infer<typeof DailyCostDetailSchema>;

/**
 * 時間範圍 Schema
 */
export const TimeRangeSchema = z.object({
  start: z.string(),
  end: z.string(),
});
export type TimeRange = z.infer<typeof TimeRangeSchema>;

/**
 * Metadata Schema
 */
export const MetadataSchema = z.object({
  generatedAt: z.string(),
  timeRange: TimeRangeSchema,
  exchangeRate: z.number(),
});
export type Metadata = z.infer<typeof MetadataSchema>;

/**
 * API 金鑰使用統計 Schema
 *
 * 業務背景：顯示各 API 金鑰的費用排名
 * 數據來源：LiteLLM API 的 breakdown.providers[provider].api_key_breakdown
 */
export const ApiKeyUsageStatsSchema = z.object({
  keyId: z.string(),
  keyAlias: z.string(),
  requests: z.number(),
  costUsd: z.number(),
  costTwd: z.number(),
  providers: z.array(z.string()),
});
export type ApiKeyUsageStats = z.infer<typeof ApiKeyUsageStatsSchema>;

/**
 * 儀表板完整數據回應 Schema
 */
export const DashboardResponseSchema = z.object({
  subscriptions: z.array(SubscriptionWithTWDSchema),
  budget: BudgetSchema,
  kpiMetrics: KpiMetricsSchema,
  providerStats: z.array(ProviderUsageStatsSchema),
  apiKeyStats: z.array(ApiKeyUsageStatsSchema),
  dailyUsageStats: z.array(DailyUsageStatsSchema),
  tokenUsageTrend: z.array(TokenUsageTrendSchema),
  dailyCostDetailed: z.array(DailyCostDetailSchema),
  metadata: MetadataSchema,
});
export type DashboardResponse = z.infer<typeof DashboardResponseSchema>;

/**
 * 更新訂閱回應 Schema
 */
export const UpdateSubscriptionResponseSchema = z.object({
  success: z.literal(true),
  data: z.array(BasicSubscriptionSchema),
});
export type UpdateSubscriptionResponse = z.infer<
  typeof UpdateSubscriptionResponseSchema
>;

// ===== 查詢參數類型 =====

/**
 * 儀表板查詢參數
 */
export type DashboardQueryParams = {
  days?: number;
  startDate?: string;
  endDate?: string;
};

// ===== API 函數 =====

/**
 * 獲取 AI Gateway 儀表板完整數據
 *
 * 業務背景：整合 LiteLLM 使用量統計與訂閱費用，提供 AI 服務成本監控。
 * 用於 /ai-gateway 儀表板頁面，顯示 KPI、圖表、預算消耗等資訊。
 *
 * 資料流：前端 → backendClient → Node.js 後端 → LiteLLM API + subscription.json
 *
 * 邊界條件：
 * - 時間範圍預設 30 天，可透過 days 或 startDate/endDate 調整
 * - LiteLLM 未配置時返回空統計數據，但訂閱數據仍會返回
 * - provider 參數可過濾特定供應商數據
 *
 * 依賴：backendClient（後端 API 服務）、後端需配置 LITELLM_API_URL
 */
export async function fetchAIGatewayDashboard(
  params?: DashboardQueryParams,
): Promise<DashboardResponse> {
  const response = await backendClient.get('/api/gateway/dashboard', {
    params,
  });
  return DashboardResponseSchema.parse(response.data);
}

/**
 * 獲取訂閱服務清單
 *
 * 業務背景：讀取後端 subscription.json 中的訂閱服務資料
 *
 * 資料流：前端 → backendClient → Node.js 後端 → subscription.json
 *
 * 邊界條件：
 * - 檔案不存在時返回 500 錯誤
 * - 檔案格式錯誤時返回 500 錯誤
 */
export async function fetchSubscriptionServices(): Promise<
  BasicSubscription[]
> {
  const response = await backendClient.get('/api/gateway/subscription');
  return z.array(BasicSubscriptionSchema).parse(response.data);
}

/**
 * 更新訂閱服務清單
 *
 * 業務背景：更新後端 subscription.json 中的訂閱服務資料
 *
 * 資料流：前端 → backendClient → Node.js 後端 → subscription.json
 *
 * 邊界條件：
 * - 必須提供完整的訂閱陣列（會覆蓋原有資料）
 * - ai_name 作為唯一識別鍵，重複時以最後一筆為準
 * - 自動設定 update_time，首次寫入時設定 create_time
 */
export async function updateSubscriptionServices(
  subscriptions: BasicSubscription[],
): Promise<UpdateSubscriptionResponse> {
  const response = await backendClient.put(
    '/api/gateway/subscription',
    subscriptions,
  );
  return UpdateSubscriptionResponseSchema.parse(response.data);
}

// ===== 輔助函數 =====

/**
 * 格式化貨幣顯示（TWD）
 */
export function formatCurrencyTWD(amount: number): string {
  return `NT$ ${Math.round(amount).toLocaleString()}`;
}

/**
 * 格式化貨幣顯示（TWD，精確到小數點後 4 位）
 * 用於顯示小額費用，避免四捨五入後顯示為 0
 */
export function formatCurrencyTWDPrecise(amount: number): string {
  return `NT$ ${amount.toFixed(4)}`;
}

/**
 * 格式化金額顯示（緊湊格式，數字最多 4 位）
 *
 * 業務背景：空間有限時避免數字過長導致版面重疊
 * - 小於 10,000：完整顯示（如 1,920）
 * - 10,000 ~ 999,999：顯示為 k（如 199.2k）
 * - 1,000,000+：顯示為 M（如 1.2M）
 */
export function formatCompactCurrency(amount: number): string {
  const absAmount = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (absAmount >= 1_000_000) {
    const millions = absAmount / 1_000_000;
    // 保持最多 4 位數字：如 1.2M, 12.3M, 123M, 1234M
    if (millions >= 1000) return `${sign}${Math.round(millions)}M`;
    if (millions >= 100) return `${sign}${Math.round(millions)}M`;
    if (millions >= 10) return `${sign}${millions.toFixed(1)}M`;
    return `${sign}${millions.toFixed(1)}M`;
  }

  if (absAmount >= 10_000) {
    const thousands = absAmount / 1_000;
    // 保持最多 4 位數字：如 10.0k, 100k, 999k
    if (thousands >= 100) return `${sign}${Math.round(thousands)}k`;
    return `${sign}${thousands.toFixed(1)}k`;
  }

  // 小於 10,000：完整顯示
  return `${sign}${Math.round(absAmount).toLocaleString()}`;
}

/**
 * 格式化貨幣顯示（USD）
 */
export function formatCurrencyUSD(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

/**
 * 格式化數字顯示（帶千分位）
 */
export function formatNumber(value: number): string {
  return value.toLocaleString();
}

/**
 * 格式化百分比顯示
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * 計算日期範圍字串
 * 用於傳遞給後端 API 的 startDate/endDate 參數
 */
export function calculateDateRange(days: number): {
  startDate: string;
  endDate: string;
} {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  };
}

/**
 * Provider 顏色映射
 * 用於圖表顯示一致的顏色
 */
export const PROVIDER_COLORS: Record<string, string> = {
  openai: '#10A37F',
  anthropic: '#22d3ee',
  google: '#3b82f6',
  xai: '#2dd4bf',
  GPT: '#10A37F',
  Claude: '#22d3ee',
  Gemini: '#3b82f6',
  Grok: '#2dd4bf',
};

/**
 * 獲取 Provider 顏色
 */
export function getProviderColor(provider: string): string {
  return (
    PROVIDER_COLORS[provider] ||
    PROVIDER_COLORS[provider.toLowerCase()] ||
    '#10b981'
  );
}
