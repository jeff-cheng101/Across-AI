/**
 * Guardrails 服務 - Schema、類型與 API
 *
 * 業務背景：整合 LiteLLM Guardrails 功能，提供 AI 內容安全護欄管理。
 * 支援 PII 偵測、內容過濾、工具權限控制等多種護欄類型。
 *
 * 資料流：前端 → nextClient → Next.js Route Handlers → LiteLLM API
 *
 * 依賴：nextClient（Next.js API Routes）、後端需配置 LITELLM_API_URL 和 LITELLM_API_KEY
 *
 * LiteLLM API 端點：
 * - GET /v2/guardrails/list - 列表查詢
 * - POST /guardrails - 新增
 * - GET /guardrails/{id}/info - 查詢單一
 * - PUT /guardrails/{id} - 更新
 * - DELETE /guardrails/{id} - 刪除
 * - POST /guardrails/apply_guardrail - 測試
 * - GET /guardrails/ui/add_guardrail_settings - UI 設定
 */

import { z } from 'zod';
import { nextClient } from '@/lib/api-clients';

// ===== 常數定義 =====

/**
 * Guardrail Provider 類型
 * 業務背景：目前支援的護欄供應商
 * - presidio: Microsoft Presidio PII 偵測
 * - bedrock: AWS Bedrock Guardrail
 */
export const GUARDRAIL_PROVIDERS = ['presidio', 'bedrock'] as const;

/**
 * Guardrail 執行模式
 * 業務背景：決定護欄在請求生命週期的哪個階段執行
 * - pre_call: 請求發送前
 * - during_call: 請求處理中
 * - post_call: 請求完成後
 * - logging_only: 僅記錄，不阻擋
 * - pre_mcp_call: MCP 工具呼叫前
 * - during_mcp_call: MCP 工具呼叫中
 */
export const GUARDRAIL_MODES = [
  'pre_call',
  'during_call',
  'post_call',
  'logging_only',
  'pre_mcp_call',
  'during_mcp_call',
] as const;

/**
 * PII 類別分組
 * 業務背景：Microsoft Presidio 支援的 PII 實體類別分組
 */
export const PII_CATEGORIES = [
  'Finance',
  'General',
  'USA',
  'UK',
  'Poland',
  'Singapore',
  'Australia',
  'India',
  'Finland',
  'Spain',
  'Italy',
] as const;

/**
 * PII 處理動作
 * 業務背景：偵測到 PII 時的處理方式
 * - mask: 遮蔽（如 ***）
 * - block: 阻擋請求
 */
export const PII_ACTIONS = ['mask', 'block'] as const;

/**
 * PII 類型清單（Presidio Provider 用）
 * 業務背景：Microsoft Presidio 支援的 PII 實體類型
 * 統一定義，供 SecuritySection 和其他組件使用
 */
export const PII_TYPES = [
  { id: 'CREDIT_CARD', name: 'CREDIT CARD', category: 'Finance' },
  { id: 'CRYPTO', name: 'CRYPTO', category: 'Finance' },
  { id: 'IBAN_CODE', name: 'IBAN CODE', category: 'Finance' },
  { id: 'DATE_TIME', name: 'DATE TIME', category: 'General' },
  { id: 'EMAIL_ADDRESS', name: 'EMAIL ADDRESS', category: 'General' },
  { id: 'IP_ADDRESS', name: 'IP ADDRESS', category: 'General' },
  { id: 'NRP', name: 'NRP', category: 'General' },
  { id: 'LOCATION', name: 'LOCATION', category: 'General' },
  { id: 'PERSON', name: 'PERSON', category: 'General' },
  { id: 'PHONE_NUMBER', name: 'PHONE NUMBER', category: 'General' },
  { id: 'MEDICAL_LICENSE', name: 'MEDICAL LICENSE', category: 'General' },
  { id: 'URL', name: 'URL', category: 'General' },
  { id: 'US_BANK_NUMBER', name: 'US BANK NUMBER', category: 'USA' },
  { id: 'US_DRIVER_LICENSE', name: 'US DRIVER LICENSE', category: 'USA' },
  { id: 'US_ITIN', name: 'US ITIN', category: 'USA' },
  { id: 'US_PASSPORT', name: 'US PASSPORT', category: 'USA' },
  { id: 'US_SSN', name: 'US SSN', category: 'USA' },
  { id: 'UK_NHS', name: 'UK NHS', category: 'UK' },
  { id: 'UK_NINO', name: 'UK NINO', category: 'UK' },
  { id: 'PL_PESEL', name: 'PL PESEL', category: 'Poland' },
  { id: 'SG_NRIC_FIN', name: 'SG NRIC FIN', category: 'Singapore' },
  { id: 'SG_UEN', name: 'SG UEN', category: 'Singapore' },
  { id: 'AU_ABN', name: 'AU ABN', category: 'Australia' },
  { id: 'AU_ACN', name: 'AU ACN', category: 'Australia' },
  { id: 'AU_TFN', name: 'AU TFN', category: 'Australia' },
  { id: 'AU_MEDICARE', name: 'AU MEDICARE', category: 'Australia' },
  { id: 'IN_PAN', name: 'IN PAN', category: 'India' },
  { id: 'IN_AADHAAR', name: 'IN AADHAAR', category: 'India' },
  {
    id: 'IN_VEHICLE_REGISTRATION',
    name: 'IN VEHICLE REGISTRATION',
    category: 'India',
  },
  { id: 'IN_VOTER', name: 'IN VOTER', category: 'India' },
  { id: 'IN_PASSPORT', name: 'IN PASSPORT', category: 'India' },
  {
    id: 'FI_PERSONAL_IDENTITY_CODE',
    name: 'FI PERSONAL IDENTITY CODE',
    category: 'Finland',
  },
  { id: 'ES_NIF', name: 'ES NIF', category: 'Spain' },
  { id: 'ES_NIE', name: 'ES NIE', category: 'Spain' },
  { id: 'IT_FISCAL_CODE', name: 'IT FISCAL CODE', category: 'Italy' },
  { id: 'IT_DRIVER_LICENSE', name: 'IT DRIVER LICENSE', category: 'Italy' },
  { id: 'IT_VAT_CODE', name: 'IT VAT CODE', category: 'Italy' },
  { id: 'IT_PASSPORT', name: 'IT PASSPORT', category: 'Italy' },
  { id: 'IT_IDENTITY_CARD', name: 'IT IDENTITY CARD', category: 'Italy' },
] as const;

/**
 * Provider 顯示名稱對應
 * 業務背景：UI 上顯示的友善名稱
 */
export const PROVIDER_LABELS: Record<string, string> = {
  presidio: 'Presidio PII',
  bedrock: 'Bedrock Guardrail',
};

/**
 * Mode 選項定義
 * 業務背景：UI 下拉選單使用的模式選項，包含標籤和說明
 */
export const MODE_OPTIONS = [
  {
    value: 'pre_call',
    label: 'pre_call',
    badge: '推薦',
    description: 'LLM 呼叫前 - 在 LLM 呼叫之前執行並檢查輸入',
  },
  {
    value: 'post_call',
    label: 'post_call',
    badge: null,
    description: 'LLM 呼叫後 - 在 LLM 呼叫之後執行並僅檢查輸出',
  },
  {
    value: 'during_call',
    label: 'during_call',
    badge: null,
    description: 'LLM 呼叫期間 - 與 LLM 呼叫並行執行',
  },
  {
    value: 'logging_only',
    label: 'logging_only',
    badge: null,
    description: '僅記錄 - 僅在記錄回呼上執行，不影響 LLM 呼叫',
  },
  {
    value: 'pre_mcp_call',
    label: 'pre_mcp_call',
    badge: null,
    description: 'MCP 工具呼叫前 - 在 MCP 工具執行之前驗證',
  },
  {
    value: 'during_mcp_call',
    label: 'during_mcp_call',
    badge: null,
    description: 'MCP 工具呼叫中 - 在 MCP 工具執行期間監控',
  },
] as const;

// ===== Type Guards =====

/**
 * 驗證字串是否為有效的 Guardrail Provider
 *
 * @param value 待驗證的字串
 * @returns 如果是有效的 Provider 則返回 true
 */
export function isValidProvider(
  value: string,
): value is (typeof GUARDRAIL_PROVIDERS)[number] {
  return (GUARDRAIL_PROVIDERS as readonly string[]).includes(value);
}

/**
 * 驗證字串是否為有效的 Guardrail Mode
 *
 * @param value 待驗證的字串
 * @returns 如果是有效的 Mode 則返回 true
 */
export function isValidMode(
  value: string,
): value is (typeof GUARDRAIL_MODES)[number] {
  return (GUARDRAIL_MODES as readonly string[]).includes(value);
}

/**
 * 驗證字串是否為有效的 PII Action
 *
 * @param value 待驗證的字串
 * @returns 如果是有效的 PII Action 則返回 true
 */
export function isValidPiiAction(value: string): value is 'mask' | 'block' {
  return value === 'mask' || value === 'block';
}

/**
 * 取得經過驗證的 Provider，若無效則返回預設值
 *
 * @param value 待驗證的字串
 * @param defaultValue 預設值
 * @returns 有效的 Provider 或預設值
 */
export function getValidatedProvider(
  value: string | undefined,
  defaultValue: (typeof GUARDRAIL_PROVIDERS)[number] = 'presidio',
): (typeof GUARDRAIL_PROVIDERS)[number] {
  return value && isValidProvider(value) ? value : defaultValue;
}

/**
 * 取得經過驗證的 Mode，若無效則返回預設值
 *
 * @param value 待驗證的字串
 * @param defaultValue 預設值
 * @returns 有效的 Mode 或預設值
 */
export function getValidatedMode(
  value: string | undefined,
  defaultValue: (typeof GUARDRAIL_MODES)[number] = 'pre_call',
): (typeof GUARDRAIL_MODES)[number] {
  return value && isValidMode(value) ? value : defaultValue;
}

/**
 * 取得經過驗證的 PII Action，若無效則返回預設值
 *
 * @param value 待驗證的字串
 * @param defaultValue 預設值
 * @returns 有效的 PII Action 或預設值
 */
export function getValidatedPiiAction(
  value: string | undefined,
  defaultValue: 'mask' | 'block' = 'mask',
): 'mask' | 'block' {
  return value && isValidPiiAction(value) ? value : defaultValue;
}

// ===== Schema 定義 =====

/**
 * PII 實體 Schema
 * 對應 Presidio 的實體類型設定
 */
export const PIIEntitySchema = z.object({
  entityType: z.string(),
  category: z.enum(PII_CATEGORIES),
  enabled: z.boolean(),
});
export type PIIEntity = z.infer<typeof PIIEntitySchema>;

/**
 * Presidio Guard 設定 Schema
 */
export const PresidioGuardSchema = z.object({
  piiEntitiesEnabled: z.array(z.string()),
  piiAction: z.enum(PII_ACTIONS),
  outputParsePrompt: z.string().optional(),
});
export type PresidioGuard = z.infer<typeof PresidioGuardSchema>;

/**
 * Bedrock Guard 設定 Schema
 */
export const BedrockGuardSchema = z.object({
  guardrailId: z.string(),
  guardrailVersion: z.string().optional(),
});
export type BedrockGuard = z.infer<typeof BedrockGuardSchema>;

/**
 * LiteLLM Guardrail 參數 Schema（snake_case - 對應 LiteLLM API）
 * 業務背景：LiteLLM API 使用 snake_case 命名
 * 使用 passthrough() 接受 LiteLLM 回傳的額外欄位
 */
export const LiteLLMGuardrailParamsSchema = z
  .object({
    guardrail: z.string(), // 接受任意 provider 字串，避免嚴格驗證失敗
    mode: z.string(), // 接受任意 mode 字串
    default_on: z.boolean().optional().nullable(),
    // Presidio 專用設定
    pii_entities_enabled: z.array(z.string()).optional().nullable(),
    pii_entities_config: z.record(z.string(), z.string()).optional().nullable(),
    pii_action: z.string().optional().nullable(),
    output_parse_pii: z.boolean().optional().nullable(),
    presidio_analyzer_api_base: z.string().optional().nullable(),
    presidio_anonymizer_api_base: z.string().optional().nullable(),
    presidio_language: z.string().optional().nullable(),
    presidio_filter_scope: z.string().optional().nullable(),
    // Bedrock 專用設定
    guardrailIdentifier: z.string().optional().nullable(),
    guardrailVersion: z.string().optional().nullable(),
    disable_exception_on_block: z.boolean().optional().nullable(),
    aws_region_name: z.string().optional().nullable(),
    aws_access_key_id: z.string().optional().nullable(),
    aws_secret_access_key: z.string().optional().nullable(),
    aws_session_token: z.string().optional().nullable(),
    aws_session_name: z.string().optional().nullable(),
    aws_profile_name: z.string().optional().nullable(),
    aws_role_name: z.string().optional().nullable(),
    aws_web_identity_token: z.string().optional().nullable(),
    aws_sts_endpoint: z.string().optional().nullable(),
    aws_bedrock_runtime_endpoint: z.string().optional().nullable(),
    // 其他設定
    api_key: z.string().optional().nullable(),
    api_base: z.string().optional().nullable(),
  })
  .passthrough(); // 接受 LiteLLM 回傳的所有額外欄位
export type LiteLLMGuardrailParams = z.infer<
  typeof LiteLLMGuardrailParamsSchema
>;

/**
 * LiteLLM Guardrail Schema（snake_case - 直接對應 LiteLLM API 回傳格式）
 */
export const LiteLLMGuardrailSchema = z
  .object({
    guardrail_id: z.string(),
    guardrail_name: z.string(),
    litellm_params: LiteLLMGuardrailParamsSchema,
    guardrail_info: z.unknown().nullable().optional(),
    guardrail_definition_location: z.string().optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
    created_by: z.string().optional(),
    updated_by: z.string().optional(),
  })
  .passthrough(); // 接受額外欄位
export type LiteLLMGuardrail = z.infer<typeof LiteLLMGuardrailSchema>;

/**
 * PII 實體設定 Record 類型
 * 業務背景：LiteLLM 使用 pii_entities_config 格式，key 為 PII 類型，value 為動作
 * 範例：{ "CREDIT_CARD": "mask", "EMAIL_ADDRESS": "block" }
 */
export const PiiEntitiesConfigSchema = z.record(
  z.string(),
  z.enum(PII_ACTIONS),
);
export type PiiEntitiesConfig = z.infer<typeof PiiEntitiesConfigSchema>;

// ===== 基礎欄位 Schema（統一定義，避免重複）=====

/**
 * Presidio 設定欄位 Schema
 * 業務背景：Microsoft Presidio PII 偵測和匿名化設定
 * 所有 Presidio 相關欄位統一在此定義，Create/Update/Get 都從這裡繼承
 */
export const PresidioFieldsSchema = z.object({
  piiEntitiesConfig: PiiEntitiesConfigSchema.optional(), // 每個 PII 類型的獨立動作設定
  piiEntitiesEnabled: z.array(z.string()).optional(), // 向下相容：僅啟用類型列表
  piiAction: z.enum(PII_ACTIONS).optional(), // 向下相容：全域預設動作
  outputParsePrompt: z.string().optional(), // 輸出解析提示詞
  presidioAnalyzerApiBase: z.string().optional(), // Presidio 分析器 API URL
  presidioAnonymizerApiBase: z.string().optional(), // Presidio 匿名化器 API URL
  presidioFilterScope: z.string().optional(), // 過濾範圍：input/output/both
  presidioRunOn: z.string().optional(), // 執行位置：input/output/both
  presidioLanguage: z.string().optional(), // 語言設定（預設 en）
});
export type PresidioFields = z.infer<typeof PresidioFieldsSchema>;

/**
 * Bedrock 設定欄位 Schema
 * 業務背景：AWS Bedrock Guardrail 設定
 * 所有 Bedrock 相關欄位統一在此定義，Create/Update/Get 都從這裡繼承
 */
export const BedrockFieldsSchema = z.object({
  bedrockGuardrailId: z.string().optional(),
  bedrockGuardrailVersion: z.string().optional(),
  bedrockDisableExceptionOnBlock: z.boolean().optional(),
  bedrockAwsRegionName: z.string().optional(),
  bedrockAwsAccessKeyId: z.string().optional(),
  bedrockAwsSecretAccessKey: z.string().optional(),
  bedrockAwsSessionToken: z.string().optional(),
  bedrockAwsSessionName: z.string().optional(),
  bedrockAwsProfileName: z.string().optional(),
  bedrockAwsRoleName: z.string().optional(),
  bedrockAwsWebIdentityToken: z.string().optional(),
  bedrockAwsStsEndpoint: z.string().optional(),
  bedrockAwsBedrockRuntimeEndpoint: z.string().optional(),
});
export type BedrockFields = z.infer<typeof BedrockFieldsSchema>;

/**
 * 基礎可編輯欄位 Schema（不含 ID 和 metadata）
 * 業務背景：Create 和 Update 操作共用的欄位定義
 * 修改此 schema 會自動影響 CreateGuardrailInput 和 UpdateGuardrailInput
 */
export const GuardrailEditableFieldsSchema = z
  .object({
    guardrailName: z.string(),
    defaultOn: z.boolean(),
  })
  .merge(PresidioFieldsSchema)
  .merge(BedrockFieldsSchema);
export type GuardrailEditableFields = z.infer<
  typeof GuardrailEditableFieldsSchema
>;

// ===== API Schema =====

/**
 * Guardrail Schema（camelCase - 前端使用）
 * 業務背景：GET API 回傳的完整資料結構
 * 使用 string 而非 enum，以接受 LiteLLM 回傳的各種 provider/mode
 */
export const GuardrailSchema = GuardrailEditableFieldsSchema.extend({
  guardrailId: z.string(),
  provider: z.string(), // 接受任意 provider（LiteLLM 可能回傳未知的 provider）
  mode: z.string(), // 接受任意 mode
  // 元資料
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
});
export type Guardrail = z.infer<typeof GuardrailSchema>;

/**
 * 建立 Guardrail 輸入 Schema
 * 業務背景：POST API 的請求格式，限制只能選擇已支援的 provider/mode
 */
export const CreateGuardrailInputSchema = GuardrailEditableFieldsSchema.extend({
  guardrailName: z.string().min(1, '護欄名稱不可為空'),
  provider: z.enum(GUARDRAIL_PROVIDERS),
  mode: z.enum(GUARDRAIL_MODES),
  defaultOn: z.boolean().default(true),
});
export type CreateGuardrailInput = z.infer<typeof CreateGuardrailInputSchema>;

/**
 * 更新 Guardrail 輸入 Schema
 * 業務背景：PATCH API 的請求格式，所有欄位都是 optional
 */
export const UpdateGuardrailInputSchema =
  CreateGuardrailInputSchema.partial().extend({
    guardrailName: z.string().min(1, '護欄名稱不可為空').optional(),
  });
export type UpdateGuardrailInput = z.infer<typeof UpdateGuardrailInputSchema>;

/**
 * 測試 Guardrail 輸入 Schema
 */
export const TestGuardrailsInputSchema = z.object({
  guardrailName: z.string().min(1, '護欄名稱不可為空'),
  text: z.string().min(1, '測試文字不可為空'),
  isUserMessage: z.boolean().default(true),
});
export type TestGuardrailsInput = z.infer<typeof TestGuardrailsInputSchema>;

/**
 * 測試 Guardrail 輸出 Schema
 *
 * 業務背景：對應 LiteLLM /guardrails/apply_guardrail 端點的回應
 * 該端點返回 { response_text: string }，我們在後端轉換為更友善的格式
 *
 * 欄位說明：
 * - success: API 請求是否成功（即使護欄阻擋內容，只要 API 正常回應就是 true）
 * - passed: 內容是否通過護欄檢測（true = 通過，沒有被阻擋）
 * - processedText: 經過護欄處理後的文字（如 PII 遮罩後的結果）
 * - wasModified: 文字是否被護欄修改（用於判斷 PII 是否被偵測到並遮罩）
 * - error: 護欄阻擋時的錯誤訊息（當 passed=false 時）
 * - duration: 執行時間（毫秒）
 * - rawResponse: LiteLLM 的原始回應，用於除錯
 */
export const TestGuardrailsOutputSchema = z.object({
  success: z.boolean(),
  passed: z.boolean(),
  processedText: z.string().optional(),
  wasModified: z.boolean().optional(),
  error: z.string().optional(),
  duration: z.number().optional(),
  rawResponse: z.unknown().optional(),
});
export type TestGuardrailsOutput = z.infer<typeof TestGuardrailsOutputSchema>;

/**
 * Guardrail UI 設定 Schema
 * 業務背景：用於前端表單的可選項目設定
 */
export const GuardrailUISettingsSchema = z.object({
  availableProviders: z.array(z.string()),
  availableModes: z.array(z.string()),
  piiCategories: z.record(z.string(), z.array(z.string())),
  defaultSettings: z.record(z.string(), z.unknown()).optional(),
});
export type GuardrailUISettings = z.infer<typeof GuardrailUISettingsSchema>;

// ===== 轉換函數 =====

/**
 * 轉換 LiteLLM Guardrail（snake_case）為前端格式（camelCase）
 *
 * 業務背景：LiteLLM API 使用 snake_case，前端使用 camelCase
 * 此函數負責統一格式轉換，避免在各處重複處理
 */
export function transformLiteLLMGuardrail(raw: LiteLLMGuardrail): Guardrail {
  const params = raw.litellm_params;

  // 轉換 pii_entities_config 為前端格式（統一 value 為小寫）
  const piiEntitiesConfig = params.pii_entities_config
    ? Object.fromEntries(
        Object.entries(params.pii_entities_config).map(([key, value]) => [
          key,
          value.toLowerCase() as 'mask' | 'block',
        ]),
      )
    : undefined;

  // 從 pii_entities_config 提取已啟用的 PII 實體（向下相容）
  const piiEntitiesEnabled = params.pii_entities_config
    ? Object.keys(params.pii_entities_config)
    : params.pii_entities_enabled;

  // 從 pii_entities_config 推斷預設 pii_action（向下相容）
  const rawPiiAction = params.pii_entities_config
    ? Object.values(params.pii_entities_config)[0]?.toLowerCase()
    : params.pii_action;
  const piiAction =
    rawPiiAction && isValidPiiAction(rawPiiAction) ? rawPiiAction : undefined;

  return {
    guardrailId: raw.guardrail_id,
    guardrailName: raw.guardrail_name,
    provider: params.guardrail,
    mode: params.mode,
    defaultOn: params.default_on ?? false,
    // Presidio 設定
    piiEntitiesConfig: piiEntitiesConfig,
    piiEntitiesEnabled: piiEntitiesEnabled ?? undefined,
    piiAction: piiAction ?? undefined,
    outputParsePrompt: params.output_parse_pii ? 'true' : undefined,
    presidioAnalyzerApiBase: params.presidio_analyzer_api_base ?? undefined,
    presidioAnonymizerApiBase: params.presidio_anonymizer_api_base ?? undefined,
    presidioFilterScope: params.presidio_filter_scope ?? undefined,
    presidioRunOn: params.presidio_run_on ?? undefined,
    presidioLanguage: params.presidio_language ?? undefined,
    // Bedrock 設定
    bedrockGuardrailId: params.guardrailIdentifier ?? undefined,
    bedrockGuardrailVersion: params.guardrailVersion ?? undefined,
    bedrockDisableExceptionOnBlock:
      params.disable_exception_on_block ?? undefined,
    bedrockAwsRegionName: params.aws_region_name ?? undefined,
    bedrockAwsAccessKeyId: params.aws_access_key_id ?? undefined,
    bedrockAwsSecretAccessKey: params.aws_secret_access_key ?? undefined,
    bedrockAwsSessionToken: params.aws_session_token ?? undefined,
    bedrockAwsSessionName: params.aws_session_name ?? undefined,
    bedrockAwsProfileName: params.aws_profile_name ?? undefined,
    bedrockAwsRoleName: params.aws_role_name ?? undefined,
    bedrockAwsWebIdentityToken: params.aws_web_identity_token ?? undefined,
    bedrockAwsStsEndpoint: params.aws_sts_endpoint ?? undefined,
    bedrockAwsBedrockRuntimeEndpoint:
      params.aws_bedrock_runtime_endpoint ?? undefined,
    // 元資料
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    createdBy: raw.created_by,
    updatedBy: raw.updated_by,
  };
}

/**
 * 轉換前端格式（camelCase）為 LiteLLM API 格式（snake_case）
 *
 * 業務背景：建立或更新 Guardrail 時需要轉換為 LiteLLM 格式
 */
export function transformToLiteLLMFormat(input: CreateGuardrailInput): {
  guardrail_name: string;
  litellm_params: LiteLLMGuardrailParams;
} {
  const litellmParams: LiteLLMGuardrailParams = {
    guardrail: input.provider,
    mode: input.mode,
    default_on: input.defaultOn,
  };

  // Presidio 設定
  if (input.provider === 'presidio') {
    // 優先使用 piiEntitiesConfig（每個 PII 類型獨立設定動作）
    if (
      input.piiEntitiesConfig &&
      Object.keys(input.piiEntitiesConfig).length > 0
    ) {
      // 轉換為 LiteLLM 格式：value 轉大寫（MASK/BLOCK）
      litellmParams.pii_entities_config = Object.fromEntries(
        Object.entries(input.piiEntitiesConfig).map(([key, value]) => [
          key,
          value.toUpperCase(),
        ]),
      );
    } else if (
      input.piiEntitiesEnabled &&
      input.piiEntitiesEnabled.length > 0
    ) {
      // 向下相容：使用 piiEntitiesEnabled + piiAction
      const action = input.piiAction || 'mask';
      litellmParams.pii_entities_config = Object.fromEntries(
        input.piiEntitiesEnabled.map((entity) => [
          entity,
          action.toUpperCase(),
        ]),
      );
    }
    if (input.outputParsePrompt) {
      litellmParams.output_parse_pii = input.outputParsePrompt === 'true';
    }
    if (input.presidioAnalyzerApiBase) {
      litellmParams.presidio_analyzer_api_base = input.presidioAnalyzerApiBase;
    }
    if (input.presidioAnonymizerApiBase) {
      litellmParams.presidio_anonymizer_api_base =
        input.presidioAnonymizerApiBase;
    }
    if (input.presidioFilterScope) {
      litellmParams.presidio_filter_scope = input.presidioFilterScope;
    }
    if (input.presidioRunOn) {
      litellmParams.presidio_run_on = input.presidioRunOn;
    }
    if (input.presidioLanguage) {
      litellmParams.presidio_language = input.presidioLanguage;
    }
  }

  // Bedrock 設定
  // 欄位名稱對應 LiteLLM API：guardrailIdentifier, guardrailVersion（非 snake_case）
  if (input.provider === 'bedrock') {
    if (input.bedrockGuardrailId) {
      litellmParams.guardrailIdentifier = input.bedrockGuardrailId;
    }
    if (input.bedrockGuardrailVersion) {
      litellmParams.guardrailVersion = input.bedrockGuardrailVersion;
    }
    if (input.bedrockDisableExceptionOnBlock !== undefined) {
      litellmParams.disable_exception_on_block =
        input.bedrockDisableExceptionOnBlock;
    }
    if (input.bedrockAwsRegionName) {
      litellmParams.aws_region_name = input.bedrockAwsRegionName;
    }
    if (input.bedrockAwsAccessKeyId) {
      litellmParams.aws_access_key_id = input.bedrockAwsAccessKeyId;
    }
    if (input.bedrockAwsSecretAccessKey) {
      litellmParams.aws_secret_access_key = input.bedrockAwsSecretAccessKey;
    }
    if (input.bedrockAwsSessionToken) {
      litellmParams.aws_session_token = input.bedrockAwsSessionToken;
    }
    if (input.bedrockAwsSessionName) {
      litellmParams.aws_session_name = input.bedrockAwsSessionName;
    }
    if (input.bedrockAwsProfileName) {
      litellmParams.aws_profile_name = input.bedrockAwsProfileName;
    }
    if (input.bedrockAwsRoleName) {
      litellmParams.aws_role_name = input.bedrockAwsRoleName;
    }
    if (input.bedrockAwsWebIdentityToken) {
      litellmParams.aws_web_identity_token = input.bedrockAwsWebIdentityToken;
    }
    if (input.bedrockAwsStsEndpoint) {
      litellmParams.aws_sts_endpoint = input.bedrockAwsStsEndpoint;
    }
    if (input.bedrockAwsBedrockRuntimeEndpoint) {
      litellmParams.aws_bedrock_runtime_endpoint =
        input.bedrockAwsBedrockRuntimeEndpoint;
    }
  }

  return {
    guardrail_name: input.guardrailName,
    litellm_params: litellmParams,
  };
}

// ===== Query Keys =====

/**
 * Guardrail Query Keys
 * 業務背景：用於 React Query 快取管理
 */
export const guardrailKeys = {
  all: ['guardrails'] as const,
  lists: () => [...guardrailKeys.all, 'list'] as const,
  detail: (id: string) => [...guardrailKeys.all, 'detail', id] as const,
  settings: () => [...guardrailKeys.all, 'settings'] as const,
};

// ===== API 函數 =====

/**
 * 獲取所有 Guardrails 列表
 *
 * 業務背景：獲取 LiteLLM 中已設定的所有護欄
 *
 * 資料流：前端 → nextClient → /api/guardrails → LiteLLM GET /v2/guardrails/list
 *
 * 邊界條件：
 * - LiteLLM 未配置時返回空陣列
 * - API 錯誤時拋出異常，由呼叫端處理
 */
export async function fetchGuardrails(): Promise<Guardrail[]> {
  const response = await nextClient.get('/guardrails');
  // API 回應格式可能是 { guardrails: [...] } 或直接是陣列
  const data = response.data?.guardrails ?? response.data ?? [];
  const rawList = z.array(LiteLLMGuardrailSchema).parse(data);
  return rawList.map(transformLiteLLMGuardrail);
}

/**
 * 獲取單一 Guardrail 詳情
 *
 * 業務背景：獲取特定護欄的完整設定
 *
 * 資料流：前端 → nextClient → /api/guardrails/:id → LiteLLM GET /guardrails/{id}/info
 *
 * 邊界條件：
 * - ID 不存在時返回 404
 */
export async function fetchGuardrailById(
  guardrailId: string,
): Promise<Guardrail> {
  const response = await nextClient.get(`/guardrails/${guardrailId}`);
  const raw = LiteLLMGuardrailSchema.parse(response.data);
  return transformLiteLLMGuardrail(raw);
}

/**
 * 建立新的 Guardrail
 *
 * 業務背景：在 LiteLLM 中新增護欄設定
 *
 * 資料流：前端 → nextClient → /api/guardrails → LiteLLM POST /guardrails
 *
 * 邊界條件：
 * - 名稱重複時返回錯誤
 * - Provider 設定不完整時返回驗證錯誤
 */
export async function createGuardrail(
  input: CreateGuardrailInput,
): Promise<Guardrail> {
  const validatedInput = CreateGuardrailInputSchema.parse(input);
  const litellmPayload = transformToLiteLLMFormat(validatedInput);

  const response = await nextClient.post('/guardrails', {
    guardrail: litellmPayload,
  });

  const raw = LiteLLMGuardrailSchema.parse(response.data);
  return transformLiteLLMGuardrail(raw);
}

/**
 * 更新 Guardrail
 *
 * 業務背景：更新現有護欄的設定
 *
 * 資料流：前端 → nextClient → /api/guardrails/:id → LiteLLM PUT /guardrails/{id}
 *
 * 邊界條件：
 * - ID 不存在時返回 404
 * - 部分更新：只傳送需要更新的欄位
 */
export async function updateGuardrail(
  guardrailId: string,
  input: UpdateGuardrailInput,
): Promise<Guardrail> {
  const validatedInput = UpdateGuardrailInputSchema.parse(input);

  // 轉換為 LiteLLM API 格式（snake_case）
  // 注意：UpdateGuardrailInput 是 partial，但 transformToLiteLLMFormat 期望完整輸入
  // 所以我們需要建構一個符合 CreateGuardrailInput 的物件
  const fullInput: CreateGuardrailInput = {
    guardrailName: validatedInput.guardrailName || '',
    provider: validatedInput.provider || 'presidio',
    mode: validatedInput.mode || 'pre_call',
    defaultOn: validatedInput.defaultOn ?? true,
    ...validatedInput,
  };

  const litellmPayload = transformToLiteLLMFormat(fullInput);

  const response = await nextClient.put(`/guardrails/${guardrailId}`, {
    guardrail: litellmPayload,
  });

  const raw = LiteLLMGuardrailSchema.parse(response.data);
  return transformLiteLLMGuardrail(raw);
}

/**
 * 刪除 Guardrail
 *
 * 業務背景：移除 LiteLLM 中的護欄設定
 *
 * 資料流：前端 → nextClient → /api/guardrails/:id → LiteLLM DELETE /guardrails/{id}
 *
 * 邊界條件：
 * - ID 不存在時返回 404
 * - 刪除成功返回 void
 */
export async function deleteGuardrail(guardrailId: string): Promise<void> {
  await nextClient.delete(`/guardrails/${guardrailId}`);
}

/**
 * 測試 Guardrail
 *
 * 業務背景：測試護欄是否正確運作，用於驗證設定
 *
 * 資料流：前端 → nextClient → /api/guardrails/test → LiteLLM POST /guardrails/apply_guardrail
 *
 * 邊界條件：
 * - 護欄名稱不存在時返回錯誤
 * - 回傳測試結果，包含是否通過和偵測到的實體
 */
export async function testGuardrails(
  input: TestGuardrailsInput,
): Promise<TestGuardrailsOutput> {
  const validatedInput = TestGuardrailsInputSchema.parse(input);

  const response = await nextClient.post('/guardrails/test', validatedInput);

  return TestGuardrailsOutputSchema.parse(response.data);
}

/**
 * 獲取 Guardrail UI 設定
 *
 * 業務背景：獲取前端表單所需的可選項目設定
 *
 * 資料流：前端 → nextClient → /api/guardrails/settings → LiteLLM GET /guardrails/ui/add_guardrail_settings
 *
 * 邊界條件：
 * - LiteLLM 未配置時返回預設值
 */
export async function fetchGuardrailSettings(): Promise<GuardrailUISettings> {
  const response = await nextClient.get('/guardrails/settings');
  return GuardrailUISettingsSchema.parse(response.data);
}
