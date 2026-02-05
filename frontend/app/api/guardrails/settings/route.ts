/**
 * Guardrails Settings API Route - UI 設定
 *
 * 業務背景：代理 LiteLLM Guardrails API，提供前端表單所需的設定選項
 *
 * 資料流：前端 → Next.js Route Handler → LiteLLM API
 *
 * 端點：
 * - GET /api/guardrails/settings - 獲取 UI 設定
 *
 * 依賴：
 * - LITELLM_API_URL: LiteLLM 服務 URL
 * - LITELLM_API_KEY: LiteLLM API 金鑰
 */

import { axios, createLiteLLMClient, jsonResponse } from '@/lib/litellm-client';

// ============================================================
// 強制動態路由
// ============================================================
export const dynamic = 'force-dynamic';

// ============================================================
// 預設設定（當 LiteLLM 端點不可用時使用）
// ============================================================

const DEFAULT_UI_SETTINGS = {
  availableProviders: [
    'presidio',
    'bedrock',
    'lakera_v2',
    'tool_permission',
    'custom_guardrail',
    'generic_guardrail_api',
  ],
  availableModes: [
    'pre_call',
    'during_call',
    'post_call',
    'logging_only',
    'pre_mcp_call',
    'during_mcp_call',
  ],
  piiCategories: {
    Finance: [
      'CREDIT_CARD',
      'CRYPTO',
      'IBAN_CODE',
      'US_BANK_NUMBER',
      'US_ITIN',
      'US_SSN',
    ],
    General: [
      'DATE_TIME',
      'EMAIL_ADDRESS',
      'IP_ADDRESS',
      'LOCATION',
      'PERSON',
      'PHONE_NUMBER',
      'URL',
      'NRP',
      'MEDICAL_LICENSE',
    ],
    USA: ['US_DRIVER_LICENSE', 'US_PASSPORT', 'US_SSN', 'US_ITIN'],
    UK: ['UK_NHS', 'UK_NINO', 'UK_PASSPORT'],
    Poland: ['PL_PESEL', 'PL_NIP', 'PL_REGON'],
    Singapore: ['SG_NRIC', 'SG_UEN'],
    Australia: ['AU_ABN', 'AU_ACN', 'AU_TFN', 'AU_MEDICARE'],
    India: ['IN_PAN', 'IN_AADHAAR', 'IN_VEHICLE_REGISTRATION', 'IN_VOTER'],
    Finland: ['FI_PERSONAL_IDENTITY_CODE'],
    Spain: ['ES_NIF', 'ES_NIE'],
    Italy: [
      'IT_FISCAL_CODE',
      'IT_DRIVER_LICENSE',
      'IT_PASSPORT',
      'IT_VAT_CODE',
    ],
  },
  defaultSettings: {
    presidio: {
      piiAction: 'mask',
      piiEntitiesEnabled: ['PERSON', 'EMAIL_ADDRESS', 'PHONE_NUMBER'],
    },
    bedrock: {
      guardrailVersion: 'DRAFT',
    },
    tool_permission: {
      defaultAction: 'deny',
    },
  },
};

// ============================================================
// Route Handlers
// ============================================================

/**
 * GET /api/guardrails/settings
 * 獲取 UI 設定
 *
 * 業務背景：呼叫 LiteLLM GET /guardrails/ui/add_guardrail_settings 端點
 * 用於獲取前端表單的可選項目設定（如 PII 類別、Provider 類型等）
 *
 * 邊界條件：
 * - LiteLLM 端點不可用時返回預設設定
 * - API 錯誤時記錄但仍返回預設設定
 */
export async function GET() {
  const requestStartTime = Date.now();

  try {
    const litellmClient = createLiteLLMClient();

    console.log('⚙️ 獲取 Guardrail UI 設定...', {
      timestamp: new Date().toISOString(),
    });

    const response = await litellmClient.get(
      '/guardrails/ui/add_guardrail_settings',
    );
    const duration = Date.now() - requestStartTime;

    console.log('✅ Guardrail UI 設定獲取成功', {
      timestamp: new Date().toISOString(),
      duration: `${duration}ms`,
    });

    // 轉換 LiteLLM 回應格式為前端格式
    const litellmSettings = response.data;
    const uiSettings = {
      availableProviders:
        litellmSettings?.available_providers ||
        DEFAULT_UI_SETTINGS.availableProviders,
      availableModes:
        litellmSettings?.available_modes || DEFAULT_UI_SETTINGS.availableModes,
      piiCategories:
        litellmSettings?.pii_categories || DEFAULT_UI_SETTINGS.piiCategories,
      defaultSettings:
        litellmSettings?.default_settings ||
        DEFAULT_UI_SETTINGS.defaultSettings,
    };

    return jsonResponse(uiSettings);
  } catch (error) {
    const duration = Date.now() - requestStartTime;

    if (axios.isAxiosError(error)) {
      console.warn('⚠️ LiteLLM UI 設定端點不可用，使用預設設定', {
        timestamp: new Date().toISOString(),
        duration: `${duration}ms`,
        status: error.response?.status,
        message: error.message,
      });

      // LiteLLM 端點不可用時，返回預設設定而非錯誤
      // 這樣前端仍可正常顯示表單
      return jsonResponse(DEFAULT_UI_SETTINGS);
    }

    console.error('❌ 未預期錯誤', {
      timestamp: new Date().toISOString(),
      duration: `${duration}ms`,
      error: error instanceof Error ? error.message : String(error),
    });

    // 即使發生錯誤也返回預設設定，確保前端可用
    return jsonResponse(DEFAULT_UI_SETTINGS);
  }
}
