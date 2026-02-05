/**
 * useGuardrailForm - Guardrail 表單狀態管理 Hook
 *
 * 業務背景：管理新增/編輯 Guardrail 的複雜表單狀態，
 * 使用 useReducer 統一管理多個相關狀態，避免組件中出現大量 useState。
 *
 * 支援的 Provider：
 * - presidio: Microsoft Presidio PII 偵測
 * - bedrock: AWS Bedrock Guardrail
 *
 * 使用方式：
 * const { state, actions, isValid, buildCreateInput } = useGuardrailForm();
 */

import { useCallback, useMemo, useReducer } from 'react';
import type {
  BedrockFields,
  CreateGuardrailInput,
  Guardrail,
  PiiEntitiesConfig,
  PresidioFields,
  UpdateGuardrailInput,
} from '@/services/guardrails';
import {
  isValidMode as checkValidMode,
  isValidProvider as checkValidProvider,
  isValidPiiAction,
} from '@/services/guardrails';

// ===== 類型定義 =====

/**
 * 基本設定狀態
 */
type BasicState = {
  name: string;
  provider: string;
  modes: string[];
  defaultOn: boolean;
};

/**
 * Presidio Provider 設定狀態
 * 業務背景：與 PresidioFields schema 對齊，確保類型安全
 * 額外欄位：piiEntities（UI 用）、categoryFilter（UI 篩選用）、piiEntitiesConfig（新格式）
 */
type PresidioState = Required<
  Pick<
    PresidioFields,
    | 'outputParsePrompt'
    | 'presidioAnalyzerApiBase'
    | 'presidioAnonymizerApiBase'
    | 'presidioFilterScope'
    | 'presidioRunOn'
    | 'presidioLanguage'
  >
> & {
  piiEntities: string[]; // UI 用：已選擇的 PII 類型列表
  piiEntitiesConfig: PiiEntitiesConfig; // 新格式：每個 PII 類型的獨立動作設定
  piiAction: 'mask' | 'block'; // 全域 PII 處理動作
  categoryFilter: string; // UI 用：類別篩選
};

/**
 * Bedrock Provider 設定狀態
 * 業務背景：與 BedrockFields schema 對齊，確保類型安全
 */
type BedrockState = {
  [K in keyof BedrockFields]-?: NonNullable<BedrockFields[K]> extends boolean
    ? boolean
    : string;
};

/**
 * 表單 UI 狀態
 */
type UIState = {
  currentStep: number;
  isModeDropdownOpen: boolean;
};

/**
 * 完整表單狀態
 */
export type GuardrailFormState = {
  basic: BasicState;
  presidio: PresidioState;
  bedrock: BedrockState;
  ui: UIState;
};

/**
 * Reducer Action 類型
 */
type FormAction =
  | { type: 'SET_NAME'; payload: string }
  | { type: 'SET_PROVIDER'; payload: string }
  | { type: 'SET_MODES'; payload: string[] }
  | { type: 'TOGGLE_MODE'; payload: string }
  | { type: 'SET_DEFAULT_ON'; payload: boolean }
  // Presidio actions
  | { type: 'SET_PII_ENTITIES'; payload: string[] }
  | { type: 'TOGGLE_PII_ENTITY'; payload: string }
  | { type: 'SET_PII_ACTION'; payload: 'mask' | 'block' }
  | { type: 'SET_CATEGORY_FILTER'; payload: string }
  | { type: 'SELECT_ALL_PII_ENTITIES'; payload: string[] }
  | { type: 'DESELECT_ALL_PII_ENTITIES'; payload: string[] }
  | { type: 'SET_OUTPUT_PARSE_PROMPT'; payload: string }
  | { type: 'SET_PRESIDIO_ANALYZER_API_BASE'; payload: string }
  | { type: 'SET_PRESIDIO_ANONYMIZER_API_BASE'; payload: string }
  | { type: 'SET_PRESIDIO_FILTER_SCOPE'; payload: string }
  | { type: 'SET_PRESIDIO_RUN_ON'; payload: string }
  | { type: 'SET_PRESIDIO_LANGUAGE'; payload: string }
  // Bedrock actions
  | { type: 'SET_BEDROCK_GUARDRAIL_ID'; payload: string }
  | { type: 'SET_BEDROCK_GUARDRAIL_VERSION'; payload: string }
  | { type: 'SET_BEDROCK_DISABLE_EXCEPTION'; payload: boolean }
  | { type: 'SET_BEDROCK_AWS_REGION'; payload: string }
  | { type: 'SET_BEDROCK_AWS_ACCESS_KEY_ID'; payload: string }
  | { type: 'SET_BEDROCK_AWS_SECRET_ACCESS_KEY'; payload: string }
  | { type: 'SET_BEDROCK_AWS_SESSION_TOKEN'; payload: string }
  | { type: 'SET_BEDROCK_AWS_SESSION_NAME'; payload: string }
  | { type: 'SET_BEDROCK_AWS_PROFILE_NAME'; payload: string }
  | { type: 'SET_BEDROCK_AWS_ROLE_NAME'; payload: string }
  | { type: 'SET_BEDROCK_AWS_WEB_IDENTITY_TOKEN'; payload: string }
  | { type: 'SET_BEDROCK_AWS_STS_ENDPOINT'; payload: string }
  | { type: 'SET_BEDROCK_AWS_RUNTIME_ENDPOINT'; payload: string }
  // UI actions
  | { type: 'SET_CURRENT_STEP'; payload: number }
  | { type: 'TOGGLE_MODE_DROPDOWN' }
  | { type: 'CLOSE_MODE_DROPDOWN' }
  // Reset
  | { type: 'RESET_FORM' }
  // Initialize from existing guardrail (for edit mode)
  | { type: 'INITIALIZE_FROM_GUARDRAIL'; payload: Guardrail }
  // PII entities config (new format with per-entity actions)
  | { type: 'SET_PII_ENTITIES_CONFIG'; payload: PiiEntitiesConfig };

// ===== 初始狀態 =====

const initialState: GuardrailFormState = {
  basic: {
    name: '',
    provider: '',
    modes: ['pre_call'],
    defaultOn: true,
  },
  presidio: {
    piiEntities: [],
    piiEntitiesConfig: {},
    piiAction: 'mask',
    categoryFilter: 'all',
    outputParsePrompt: '',
    presidioAnalyzerApiBase: '',
    presidioAnonymizerApiBase: '',
    presidioFilterScope: '',
    presidioRunOn: '',
    presidioLanguage: '',
  },
  bedrock: {
    bedrockGuardrailId: '',
    bedrockGuardrailVersion: '',
    bedrockDisableExceptionOnBlock: false,
    bedrockAwsRegionName: '',
    bedrockAwsAccessKeyId: '',
    bedrockAwsSecretAccessKey: '',
    bedrockAwsSessionToken: '',
    bedrockAwsSessionName: '',
    bedrockAwsProfileName: '',
    bedrockAwsRoleName: '',
    bedrockAwsWebIdentityToken: '',
    bedrockAwsStsEndpoint: '',
    bedrockAwsBedrockRuntimeEndpoint: '',
  },
  ui: {
    currentStep: 1,
    isModeDropdownOpen: false,
  },
};

// ===== Reducer =====

function guardrailFormReducer(
  state: GuardrailFormState,
  action: FormAction,
): GuardrailFormState {
  switch (action.type) {
    // Basic actions
    case 'SET_NAME':
      return { ...state, basic: { ...state.basic, name: action.payload } };
    case 'SET_PROVIDER':
      return { ...state, basic: { ...state.basic, provider: action.payload } };
    case 'SET_MODES':
      return { ...state, basic: { ...state.basic, modes: action.payload } };
    case 'TOGGLE_MODE': {
      const modes = state.basic.modes.includes(action.payload)
        ? state.basic.modes.filter((m) => m !== action.payload)
        : [...state.basic.modes, action.payload];
      return { ...state, basic: { ...state.basic, modes } };
    }
    case 'SET_DEFAULT_ON':
      return { ...state, basic: { ...state.basic, defaultOn: action.payload } };

    // Presidio actions
    case 'SET_PII_ENTITIES':
      return {
        ...state,
        presidio: { ...state.presidio, piiEntities: action.payload },
      };
    case 'TOGGLE_PII_ENTITY': {
      const piiEntities = state.presidio.piiEntities.includes(action.payload)
        ? state.presidio.piiEntities.filter((e) => e !== action.payload)
        : [...state.presidio.piiEntities, action.payload];
      return { ...state, presidio: { ...state.presidio, piiEntities } };
    }
    case 'SET_PII_ACTION':
      return {
        ...state,
        presidio: { ...state.presidio, piiAction: action.payload },
      };
    case 'SET_CATEGORY_FILTER':
      return {
        ...state,
        presidio: { ...state.presidio, categoryFilter: action.payload },
      };
    case 'SELECT_ALL_PII_ENTITIES': {
      const newEntities = new Set([
        ...state.presidio.piiEntities,
        ...action.payload,
      ]);
      return {
        ...state,
        presidio: { ...state.presidio, piiEntities: Array.from(newEntities) },
      };
    }
    case 'DESELECT_ALL_PII_ENTITIES': {
      const toRemove = new Set(action.payload);
      const piiEntities = state.presidio.piiEntities.filter(
        (e) => !toRemove.has(e),
      );
      return { ...state, presidio: { ...state.presidio, piiEntities } };
    }
    case 'SET_OUTPUT_PARSE_PROMPT':
      return {
        ...state,
        presidio: { ...state.presidio, outputParsePrompt: action.payload },
      };
    case 'SET_PRESIDIO_ANALYZER_API_BASE':
      return {
        ...state,
        presidio: {
          ...state.presidio,
          presidioAnalyzerApiBase: action.payload,
        },
      };
    case 'SET_PRESIDIO_ANONYMIZER_API_BASE':
      return {
        ...state,
        presidio: {
          ...state.presidio,
          presidioAnonymizerApiBase: action.payload,
        },
      };
    case 'SET_PRESIDIO_FILTER_SCOPE':
      return {
        ...state,
        presidio: { ...state.presidio, presidioFilterScope: action.payload },
      };
    case 'SET_PRESIDIO_RUN_ON':
      return {
        ...state,
        presidio: { ...state.presidio, presidioRunOn: action.payload },
      };
    case 'SET_PRESIDIO_LANGUAGE':
      return {
        ...state,
        presidio: { ...state.presidio, presidioLanguage: action.payload },
      };

    // Bedrock actions
    case 'SET_BEDROCK_GUARDRAIL_ID':
      return {
        ...state,
        bedrock: { ...state.bedrock, bedrockGuardrailId: action.payload },
      };
    case 'SET_BEDROCK_GUARDRAIL_VERSION':
      return {
        ...state,
        bedrock: { ...state.bedrock, bedrockGuardrailVersion: action.payload },
      };
    case 'SET_BEDROCK_DISABLE_EXCEPTION':
      return {
        ...state,
        bedrock: {
          ...state.bedrock,
          bedrockDisableExceptionOnBlock: action.payload,
        },
      };
    case 'SET_BEDROCK_AWS_REGION':
      return {
        ...state,
        bedrock: { ...state.bedrock, bedrockAwsRegionName: action.payload },
      };
    case 'SET_BEDROCK_AWS_ACCESS_KEY_ID':
      return {
        ...state,
        bedrock: { ...state.bedrock, bedrockAwsAccessKeyId: action.payload },
      };
    case 'SET_BEDROCK_AWS_SECRET_ACCESS_KEY':
      return {
        ...state,
        bedrock: {
          ...state.bedrock,
          bedrockAwsSecretAccessKey: action.payload,
        },
      };
    case 'SET_BEDROCK_AWS_SESSION_TOKEN':
      return {
        ...state,
        bedrock: { ...state.bedrock, bedrockAwsSessionToken: action.payload },
      };
    case 'SET_BEDROCK_AWS_SESSION_NAME':
      return {
        ...state,
        bedrock: { ...state.bedrock, bedrockAwsSessionName: action.payload },
      };
    case 'SET_BEDROCK_AWS_PROFILE_NAME':
      return {
        ...state,
        bedrock: { ...state.bedrock, bedrockAwsProfileName: action.payload },
      };
    case 'SET_BEDROCK_AWS_ROLE_NAME':
      return {
        ...state,
        bedrock: { ...state.bedrock, bedrockAwsRoleName: action.payload },
      };
    case 'SET_BEDROCK_AWS_WEB_IDENTITY_TOKEN':
      return {
        ...state,
        bedrock: {
          ...state.bedrock,
          bedrockAwsWebIdentityToken: action.payload,
        },
      };
    case 'SET_BEDROCK_AWS_STS_ENDPOINT':
      return {
        ...state,
        bedrock: { ...state.bedrock, bedrockAwsStsEndpoint: action.payload },
      };
    case 'SET_BEDROCK_AWS_RUNTIME_ENDPOINT':
      return {
        ...state,
        bedrock: {
          ...state.bedrock,
          bedrockAwsBedrockRuntimeEndpoint: action.payload,
        },
      };

    // UI actions
    case 'SET_CURRENT_STEP':
      return { ...state, ui: { ...state.ui, currentStep: action.payload } };
    case 'TOGGLE_MODE_DROPDOWN':
      return {
        ...state,
        ui: { ...state.ui, isModeDropdownOpen: !state.ui.isModeDropdownOpen },
      };
    case 'CLOSE_MODE_DROPDOWN':
      return { ...state, ui: { ...state.ui, isModeDropdownOpen: false } };

    // Reset
    case 'RESET_FORM':
      return initialState;

    // Initialize from existing guardrail (for edit mode)
    case 'INITIALIZE_FROM_GUARDRAIL': {
      const g = action.payload;
      return {
        ...state,
        basic: {
          name: g.guardrailName,
          provider: g.provider,
          modes: [g.mode],
          defaultOn: g.defaultOn,
        },
        presidio: {
          ...state.presidio,
          piiEntities: g.piiEntitiesEnabled ?? [],
          piiEntitiesConfig: g.piiEntitiesConfig ?? {},
          piiAction: g.piiAction ?? 'mask',
          outputParsePrompt: g.outputParsePrompt ?? '',
          presidioAnalyzerApiBase: g.presidioAnalyzerApiBase ?? '',
          presidioAnonymizerApiBase: g.presidioAnonymizerApiBase ?? '',
          presidioFilterScope: g.presidioFilterScope ?? '',
          presidioRunOn: g.presidioRunOn ?? '',
          presidioLanguage: g.presidioLanguage ?? '',
        },
        bedrock: {
          ...state.bedrock,
          bedrockGuardrailId: g.bedrockGuardrailId ?? '',
          bedrockGuardrailVersion: g.bedrockGuardrailVersion ?? '',
          bedrockDisableExceptionOnBlock:
            g.bedrockDisableExceptionOnBlock ?? false,
          bedrockAwsRegionName: g.bedrockAwsRegionName ?? '',
          bedrockAwsAccessKeyId: g.bedrockAwsAccessKeyId ?? '',
          bedrockAwsSecretAccessKey: g.bedrockAwsSecretAccessKey ?? '',
          bedrockAwsSessionToken: g.bedrockAwsSessionToken ?? '',
          bedrockAwsSessionName: g.bedrockAwsSessionName ?? '',
          bedrockAwsProfileName: g.bedrockAwsProfileName ?? '',
          bedrockAwsRoleName: g.bedrockAwsRoleName ?? '',
          bedrockAwsWebIdentityToken: g.bedrockAwsWebIdentityToken ?? '',
          bedrockAwsStsEndpoint: g.bedrockAwsStsEndpoint ?? '',
          bedrockAwsBedrockRuntimeEndpoint:
            g.bedrockAwsBedrockRuntimeEndpoint ?? '',
        },
      };
    }

    // PII entities config (new format)
    case 'SET_PII_ENTITIES_CONFIG':
      return {
        ...state,
        presidio: { ...state.presidio, piiEntitiesConfig: action.payload },
      };

    default:
      return state;
  }
}

// ===== Hook =====

/**
 * useGuardrailForm - Guardrail 表單狀態管理 Hook
 *
 * @returns 表單狀態、操作函數、驗證狀態和建構函數
 */
export function useGuardrailForm() {
  const [state, dispatch] = useReducer(guardrailFormReducer, initialState);

  // ===== 基本操作 =====

  const setName = useCallback((name: string) => {
    dispatch({ type: 'SET_NAME', payload: name });
  }, []);

  const setProvider = useCallback((provider: string) => {
    dispatch({ type: 'SET_PROVIDER', payload: provider });
  }, []);

  const setModes = useCallback((modes: string[]) => {
    dispatch({ type: 'SET_MODES', payload: modes });
  }, []);

  const toggleMode = useCallback((mode: string) => {
    dispatch({ type: 'TOGGLE_MODE', payload: mode });
  }, []);

  const setDefaultOn = useCallback((defaultOn: boolean) => {
    dispatch({ type: 'SET_DEFAULT_ON', payload: defaultOn });
  }, []);

  // ===== Presidio 操作 =====

  const setPiiEntities = useCallback((entities: string[]) => {
    dispatch({ type: 'SET_PII_ENTITIES', payload: entities });
  }, []);

  const togglePiiEntity = useCallback((entity: string) => {
    dispatch({ type: 'TOGGLE_PII_ENTITY', payload: entity });
  }, []);

  const setPiiAction = useCallback((action: 'mask' | 'block') => {
    dispatch({ type: 'SET_PII_ACTION', payload: action });
  }, []);

  const setCategoryFilter = useCallback((filter: string) => {
    dispatch({ type: 'SET_CATEGORY_FILTER', payload: filter });
  }, []);

  const selectAllPiiEntities = useCallback((entities: string[]) => {
    dispatch({ type: 'SELECT_ALL_PII_ENTITIES', payload: entities });
  }, []);

  const deselectAllPiiEntities = useCallback((entities: string[]) => {
    dispatch({ type: 'DESELECT_ALL_PII_ENTITIES', payload: entities });
  }, []);

  const setOutputParsePrompt = useCallback((prompt: string) => {
    dispatch({ type: 'SET_OUTPUT_PARSE_PROMPT', payload: prompt });
  }, []);

  const setPresidioAnalyzerApiBase = useCallback((url: string) => {
    dispatch({ type: 'SET_PRESIDIO_ANALYZER_API_BASE', payload: url });
  }, []);

  const setPresidioAnonymizerApiBase = useCallback((url: string) => {
    dispatch({ type: 'SET_PRESIDIO_ANONYMIZER_API_BASE', payload: url });
  }, []);

  const setPresidioFilterScope = useCallback((scope: string) => {
    dispatch({ type: 'SET_PRESIDIO_FILTER_SCOPE', payload: scope });
  }, []);

  const setPresidioRunOn = useCallback((runOn: string) => {
    dispatch({ type: 'SET_PRESIDIO_RUN_ON', payload: runOn });
  }, []);

  const setPresidioLanguage = useCallback((language: string) => {
    dispatch({ type: 'SET_PRESIDIO_LANGUAGE', payload: language });
  }, []);

  // ===== Bedrock 操作 =====

  const setBedrockGuardrailId = useCallback((id: string) => {
    dispatch({ type: 'SET_BEDROCK_GUARDRAIL_ID', payload: id });
  }, []);

  const setBedrockGuardrailVersion = useCallback((version: string) => {
    dispatch({ type: 'SET_BEDROCK_GUARDRAIL_VERSION', payload: version });
  }, []);

  const setBedrockDisableException = useCallback((disable: boolean) => {
    dispatch({ type: 'SET_BEDROCK_DISABLE_EXCEPTION', payload: disable });
  }, []);

  const setBedrockAwsRegion = useCallback((region: string) => {
    dispatch({ type: 'SET_BEDROCK_AWS_REGION', payload: region });
  }, []);

  const setBedrockAwsAccessKeyId = useCallback((keyId: string) => {
    dispatch({ type: 'SET_BEDROCK_AWS_ACCESS_KEY_ID', payload: keyId });
  }, []);

  const setBedrockAwsSecretAccessKey = useCallback((key: string) => {
    dispatch({ type: 'SET_BEDROCK_AWS_SECRET_ACCESS_KEY', payload: key });
  }, []);

  const setBedrockAwsSessionToken = useCallback((token: string) => {
    dispatch({ type: 'SET_BEDROCK_AWS_SESSION_TOKEN', payload: token });
  }, []);

  const setBedrockAwsSessionName = useCallback((name: string) => {
    dispatch({ type: 'SET_BEDROCK_AWS_SESSION_NAME', payload: name });
  }, []);

  const setBedrockAwsProfileName = useCallback((name: string) => {
    dispatch({ type: 'SET_BEDROCK_AWS_PROFILE_NAME', payload: name });
  }, []);

  const setBedrockAwsRoleName = useCallback((name: string) => {
    dispatch({ type: 'SET_BEDROCK_AWS_ROLE_NAME', payload: name });
  }, []);

  const setBedrockAwsWebIdentityToken = useCallback((token: string) => {
    dispatch({ type: 'SET_BEDROCK_AWS_WEB_IDENTITY_TOKEN', payload: token });
  }, []);

  const setBedrockAwsStsEndpoint = useCallback((endpoint: string) => {
    dispatch({ type: 'SET_BEDROCK_AWS_STS_ENDPOINT', payload: endpoint });
  }, []);

  const setBedrockAwsRuntimeEndpoint = useCallback((endpoint: string) => {
    dispatch({ type: 'SET_BEDROCK_AWS_RUNTIME_ENDPOINT', payload: endpoint });
  }, []);

  // ===== UI 操作 =====

  const setCurrentStep = useCallback((step: number) => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: step });
  }, []);

  const toggleModeDropdown = useCallback(() => {
    dispatch({ type: 'TOGGLE_MODE_DROPDOWN' });
  }, []);

  const closeModeDropdown = useCallback(() => {
    dispatch({ type: 'CLOSE_MODE_DROPDOWN' });
  }, []);

  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET_FORM' });
  }, []);

  /**
   * 從現有 Guardrail 初始化表單狀態（編輯模式）
   *
   * 業務背景：編輯現有 Guardrail 時，需要將後端資料映射回表單狀態
   */
  const initializeFromGuardrail = useCallback((guardrail: Guardrail) => {
    dispatch({ type: 'INITIALIZE_FROM_GUARDRAIL', payload: guardrail });
  }, []);

  /**
   * 設定 PII 實體的個別動作配置
   *
   * 業務背景：新版 Presidio 支援每個 PII 類型有獨立的處理動作（mask/block）
   */
  const setPiiEntitiesConfig = useCallback((config: PiiEntitiesConfig) => {
    dispatch({ type: 'SET_PII_ENTITIES_CONFIG', payload: config });
  }, []);

  // ===== 驗證 =====

  /**
   * 驗證基本設定是否完整
   */
  const isBasicValid = useMemo(() => {
    return (
      state.basic.name.trim().length > 0 &&
      state.basic.provider.length > 0 &&
      state.basic.modes.length > 0
    );
  }, [state.basic]);

  /**
   * 驗證 Provider 是否為有效值
   */
  const isProviderValid = useMemo(() => {
    return checkValidProvider(state.basic.provider);
  }, [state.basic.provider]);

  /**
   * 驗證 Mode 是否為有效值
   */
  const isModeValid = useMemo(() => {
    return (
      state.basic.modes.length > 0 &&
      state.basic.modes.every((m) => checkValidMode(m))
    );
  }, [state.basic.modes]);

  // ===== 建構輸入物件 =====

  /**
   * 建構 CreateGuardrailInput 物件
   *
   * 業務背景：將表單狀態轉換為 API 請求格式
   *
   * @returns CreateGuardrailInput 或 null（驗證失敗時）
   */
  const buildCreateInput = useCallback((): CreateGuardrailInput | null => {
    if (!isBasicValid || !isProviderValid || !isModeValid) {
      return null;
    }

    // 使用 type guard 驗證後取得型別安全的值
    const provider = state.basic.provider;
    const mode = state.basic.modes[0];

    if (!checkValidProvider(provider) || !checkValidMode(mode)) {
      return null;
    }

    const input: CreateGuardrailInput = {
      guardrailName: state.basic.name.trim(),
      provider,
      mode,
      defaultOn: state.basic.defaultOn,
    };

    // 根據 Provider 添加特定設定
    if (provider === 'presidio') {
      input.piiEntitiesEnabled = state.presidio.piiEntities;
      // 使用 type guard 驗證 piiAction
      const piiAction = state.presidio.piiAction;
      if (isValidPiiAction(piiAction)) {
        input.piiAction = piiAction;
      }
      // 進階設定
      if (state.presidio.outputParsePrompt) {
        input.outputParsePrompt = state.presidio.outputParsePrompt;
      }
      if (state.presidio.presidioAnalyzerApiBase) {
        input.presidioAnalyzerApiBase = state.presidio.presidioAnalyzerApiBase;
      }
      if (state.presidio.presidioAnonymizerApiBase) {
        input.presidioAnonymizerApiBase =
          state.presidio.presidioAnonymizerApiBase;
      }
      if (state.presidio.presidioFilterScope) {
        input.presidioFilterScope = state.presidio.presidioFilterScope;
      }
      if (state.presidio.presidioRunOn) {
        input.presidioRunOn = state.presidio.presidioRunOn;
      }
      if (state.presidio.presidioLanguage) {
        input.presidioLanguage = state.presidio.presidioLanguage;
      }
    } else if (provider === 'bedrock') {
      if (state.bedrock.bedrockGuardrailId) {
        input.bedrockGuardrailId = state.bedrock.bedrockGuardrailId;
      }
      if (state.bedrock.bedrockGuardrailVersion) {
        input.bedrockGuardrailVersion = state.bedrock.bedrockGuardrailVersion;
      }
      input.bedrockDisableExceptionOnBlock =
        state.bedrock.bedrockDisableExceptionOnBlock;
      if (state.bedrock.bedrockAwsRegionName) {
        input.bedrockAwsRegionName = state.bedrock.bedrockAwsRegionName;
      }
      if (state.bedrock.bedrockAwsAccessKeyId) {
        input.bedrockAwsAccessKeyId = state.bedrock.bedrockAwsAccessKeyId;
      }
      if (state.bedrock.bedrockAwsSecretAccessKey) {
        input.bedrockAwsSecretAccessKey =
          state.bedrock.bedrockAwsSecretAccessKey;
      }
      if (state.bedrock.bedrockAwsSessionToken) {
        input.bedrockAwsSessionToken = state.bedrock.bedrockAwsSessionToken;
      }
      if (state.bedrock.bedrockAwsSessionName) {
        input.bedrockAwsSessionName = state.bedrock.bedrockAwsSessionName;
      }
      if (state.bedrock.bedrockAwsProfileName) {
        input.bedrockAwsProfileName = state.bedrock.bedrockAwsProfileName;
      }
      if (state.bedrock.bedrockAwsRoleName) {
        input.bedrockAwsRoleName = state.bedrock.bedrockAwsRoleName;
      }
      if (state.bedrock.bedrockAwsWebIdentityToken) {
        input.bedrockAwsWebIdentityToken =
          state.bedrock.bedrockAwsWebIdentityToken;
      }
      if (state.bedrock.bedrockAwsStsEndpoint) {
        input.bedrockAwsStsEndpoint = state.bedrock.bedrockAwsStsEndpoint;
      }
      if (state.bedrock.bedrockAwsBedrockRuntimeEndpoint) {
        input.bedrockAwsBedrockRuntimeEndpoint =
          state.bedrock.bedrockAwsBedrockRuntimeEndpoint;
      }
    }

    return input;
  }, [state, isBasicValid, isProviderValid, isModeValid]);

  /**
   * 建構 UpdateGuardrailInput 物件（編輯模式）
   *
   * 業務背景：將表單狀態轉換為更新 API 請求格式
   * 與 buildCreateInput 不同，這裡需要包含 guardrailId
   *
   * @param guardrailId 要更新的 Guardrail ID
   * @returns UpdateGuardrailInput 或 null（驗證失敗時）
   */
  const buildUpdateInput = useCallback(
    (guardrailId: string): UpdateGuardrailInput | null => {
      if (!isBasicValid || !isProviderValid || !isModeValid) {
        return null;
      }

      const provider = state.basic.provider;
      const mode = state.basic.modes[0];

      if (!checkValidProvider(provider) || !checkValidMode(mode)) {
        return null;
      }

      const input: UpdateGuardrailInput = {
        guardrailId,
        guardrailName: state.basic.name.trim(),
        provider,
        mode,
        defaultOn: state.basic.defaultOn,
      };

      // 根據 Provider 添加特定設定
      if (provider === 'presidio') {
        input.piiEntitiesEnabled = state.presidio.piiEntities;
        // 新增：piiEntitiesConfig（每個 PII 類型的個別動作）
        if (Object.keys(state.presidio.piiEntitiesConfig).length > 0) {
          input.piiEntitiesConfig = state.presidio.piiEntitiesConfig;
        }
        const piiAction = state.presidio.piiAction;
        if (isValidPiiAction(piiAction)) {
          input.piiAction = piiAction;
        }
        if (state.presidio.outputParsePrompt) {
          input.outputParsePrompt = state.presidio.outputParsePrompt;
        }
        if (state.presidio.presidioAnalyzerApiBase) {
          input.presidioAnalyzerApiBase =
            state.presidio.presidioAnalyzerApiBase;
        }
        if (state.presidio.presidioAnonymizerApiBase) {
          input.presidioAnonymizerApiBase =
            state.presidio.presidioAnonymizerApiBase;
        }
        if (state.presidio.presidioFilterScope) {
          input.presidioFilterScope = state.presidio.presidioFilterScope;
        }
        if (state.presidio.presidioRunOn) {
          input.presidioRunOn = state.presidio.presidioRunOn;
        }
        if (state.presidio.presidioLanguage) {
          input.presidioLanguage = state.presidio.presidioLanguage;
        }
      } else if (provider === 'bedrock') {
        if (state.bedrock.bedrockGuardrailId) {
          input.bedrockGuardrailId = state.bedrock.bedrockGuardrailId;
        }
        if (state.bedrock.bedrockGuardrailVersion) {
          input.bedrockGuardrailVersion = state.bedrock.bedrockGuardrailVersion;
        }
        input.bedrockDisableExceptionOnBlock =
          state.bedrock.bedrockDisableExceptionOnBlock;
        if (state.bedrock.bedrockAwsRegionName) {
          input.bedrockAwsRegionName = state.bedrock.bedrockAwsRegionName;
        }
        if (state.bedrock.bedrockAwsAccessKeyId) {
          input.bedrockAwsAccessKeyId = state.bedrock.bedrockAwsAccessKeyId;
        }
        if (state.bedrock.bedrockAwsSecretAccessKey) {
          input.bedrockAwsSecretAccessKey =
            state.bedrock.bedrockAwsSecretAccessKey;
        }
        if (state.bedrock.bedrockAwsSessionToken) {
          input.bedrockAwsSessionToken = state.bedrock.bedrockAwsSessionToken;
        }
        if (state.bedrock.bedrockAwsSessionName) {
          input.bedrockAwsSessionName = state.bedrock.bedrockAwsSessionName;
        }
        if (state.bedrock.bedrockAwsProfileName) {
          input.bedrockAwsProfileName = state.bedrock.bedrockAwsProfileName;
        }
        if (state.bedrock.bedrockAwsRoleName) {
          input.bedrockAwsRoleName = state.bedrock.bedrockAwsRoleName;
        }
        if (state.bedrock.bedrockAwsWebIdentityToken) {
          input.bedrockAwsWebIdentityToken =
            state.bedrock.bedrockAwsWebIdentityToken;
        }
        if (state.bedrock.bedrockAwsStsEndpoint) {
          input.bedrockAwsStsEndpoint = state.bedrock.bedrockAwsStsEndpoint;
        }
        if (state.bedrock.bedrockAwsBedrockRuntimeEndpoint) {
          input.bedrockAwsBedrockRuntimeEndpoint =
            state.bedrock.bedrockAwsBedrockRuntimeEndpoint;
        }
      }

      return input;
    },
    [state, isBasicValid, isProviderValid, isModeValid],
  );

  // ===== 返回值 =====

  return {
    state,
    actions: {
      // Basic
      setName,
      setProvider,
      setModes,
      toggleMode,
      setDefaultOn,
      // Presidio
      setPiiEntities,
      togglePiiEntity,
      setPiiAction,
      setCategoryFilter,
      selectAllPiiEntities,
      deselectAllPiiEntities,
      setOutputParsePrompt,
      setPresidioAnalyzerApiBase,
      setPresidioAnonymizerApiBase,
      setPresidioFilterScope,
      setPresidioRunOn,
      setPresidioLanguage,
      setPiiEntitiesConfig,
      // Bedrock
      setBedrockGuardrailId,
      setBedrockGuardrailVersion,
      setBedrockDisableException,
      setBedrockAwsRegion,
      setBedrockAwsAccessKeyId,
      setBedrockAwsSecretAccessKey,
      setBedrockAwsSessionToken,
      setBedrockAwsSessionName,
      setBedrockAwsProfileName,
      setBedrockAwsRoleName,
      setBedrockAwsWebIdentityToken,
      setBedrockAwsStsEndpoint,
      setBedrockAwsRuntimeEndpoint,
      // UI
      setCurrentStep,
      toggleModeDropdown,
      closeModeDropdown,
      resetForm,
      // Edit mode
      initializeFromGuardrail,
    },
    validation: {
      isBasicValid,
      isProviderValid,
      isModeValid,
    },
    buildCreateInput,
    buildUpdateInput,
  };
}

export type UseGuardrailFormReturn = ReturnType<typeof useGuardrailForm>;
