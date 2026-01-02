import { z } from 'zod';

export const CloudflareTrendRequestSchema = z.object({
  timeRange: z.enum(['1h', '6h', '1d', '3d', '7d', '14d', '30d']),
});

export type CloudflareTrendRequest = z.infer<
  typeof CloudflareTrendRequestSchema
>;

const MetricSchema = z.object({
  quantity: z.number(),
  change: z.number(),
});

const QuantityStringMetricSchema = z.object({
  quantity: z.string(),
  change: z.number(),
});

const TrendItemSchema = z.object({
  count: z.number(),
  hour: z.string().datetime(), // ISO 8601 格式
});

const SourceIPItemSchema = z.object({
  ClientIP: z.string(),
  cnt: z.number(),
  change: z.number(),
});

const TriggerRuleItemSchema = z.object({
  SecurityRuleDescription: z.string(),
  cnt: z.number(),
  change: z.number(),
});

const HostItemSchema = z.object({
  ClientRequestHost: z.string(),
  cnt: z.number(),
  change: z.number(),
});

const PathItemSchema = z.object({
  ClientRequestPath: z.string(),
  cnt: z.number(),
  change: z.number(),
});

const CountryItemSchema = z.object({
  'geoip_client.country_name': z.string(),
  cnt: z.number(),
  change: z.number(),
});

export const CloudflareTrendResponseSchema = z.object({
  success: z.boolean(),
  totalAttack: MetricSchema,
  httpPct: MetricSchema,
  lockdownRate: MetricSchema,
  currentAttackTrend: z.array(TrendItemSchema),
  previousAttackTrend: z.array(TrendItemSchema),
  httpVolume: QuantityStringMetricSchema,
  dataVolume: QuantityStringMetricSchema,
  pageView: QuantityStringMetricSchema,
  visits: QuantityStringMetricSchema,
  sourceIP: z.array(SourceIPItemSchema),
  triggerRule: z.array(TriggerRuleItemSchema),
  hosts: z.array(HostItemSchema),
  path: z.array(PathItemSchema),
  country: z.array(CountryItemSchema),
  other: z.record(z.unknown()), // 物件，未定義內容
});

export type CloudflareTrendResponse = z.infer<
  typeof CloudflareTrendResponseSchema
>;
export type TrendItem = z.infer<typeof TrendItemSchema>;
export type SourceIPItem = z.infer<typeof SourceIPItemSchema>;
export type TriggerRuleItem = z.infer<typeof TriggerRuleItemSchema>;
export type HostItem = z.infer<typeof HostItemSchema>;
export type PathItem = z.infer<typeof PathItemSchema>;
export type CountryItem = z.infer<typeof CountryItemSchema>;
