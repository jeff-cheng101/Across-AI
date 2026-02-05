'use client';

/**
 * GuardrailEditContext - 護欄編輯狀態管理
 *
 * 業務背景：集中管理 GuardrailDetailView 中的編輯表單狀態，
 * 避免透過大量 props 傳遞狀態，提高組件的可維護性。
 *
 * 使用方式：
 * 1. 在 GuardrailDetailView 中使用 EditProvider 包裹子組件
 * 2. 子組件使用 useEditContext 獲取狀態和操作函數
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import type { Guardrail, UpdateGuardrailInput } from '@/services/guardrails';
import { getValidatedMode, getValidatedPiiAction } from '@/services/guardrails';

// ===== 類型定義 =====

/**
 * 編輯表單狀態
 */
export type EditFormState = {
  // 基本設定
  name: string;
  defaultOn: boolean;
  mode: string;
  // Presidio 設定
  piiAction: string;
  outputParsePrompt: string;
  // Bedrock 設定
  bedrockGuardrailId: string;
  bedrockGuardrailVersion: string;
  bedrockDisableExceptionOnBlock: boolean;
  bedrockAwsRegionName: string;
  bedrockAwsAccessKeyId: string;
  bedrockAwsSecretAccessKey: string;
  bedrockAwsSessionToken: string;
  bedrockAwsSessionName: string;
  bedrockAwsProfileName: string;
  bedrockAwsRoleName: string;
  bedrockAwsWebIdentityToken: string;
  bedrockAwsStsEndpoint: string;
  bedrockAwsBedrockRuntimeEndpoint: string;
};

/**
 * Reducer Action 類型
 */
type EditAction =
  | { type: 'SET_FIELD'; field: keyof EditFormState; value: string | boolean }
  | { type: 'INIT_FROM_GUARDRAIL'; guardrail: Guardrail }
  | { type: 'RESET'; guardrail: Guardrail };

/**
 * Context 值類型
 */
type EditContextValue = {
  formState: EditFormState;
  isEditMode: boolean;
  setIsEditMode: (value: boolean) => void;
  setField: <K extends keyof EditFormState>(
    field: K,
    value: EditFormState[K],
  ) => void;
  resetForm: () => void;
  buildUpdateInput: (provider: string) => UpdateGuardrailInput;
};

// ===== 初始狀態 =====

const initialFormState: EditFormState = {
  name: '',
  defaultOn: true,
  mode: 'pre_call',
  piiAction: 'mask',
  outputParsePrompt: '',
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
};

// ===== Reducer =====

function editReducer(state: EditFormState, action: EditAction): EditFormState {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };

    case 'INIT_FROM_GUARDRAIL':
    case 'RESET': {
      const g = action.guardrail;
      return {
        name: g.guardrailName,
        defaultOn: g.defaultOn,
        mode: g.mode,
        piiAction: g.piiAction || 'mask',
        outputParsePrompt: g.outputParsePrompt || '',
        bedrockGuardrailId: g.bedrockGuardrailId || '',
        bedrockGuardrailVersion: g.bedrockGuardrailVersion || '',
        bedrockDisableExceptionOnBlock:
          g.bedrockDisableExceptionOnBlock || false,
        bedrockAwsRegionName: g.bedrockAwsRegionName || '',
        bedrockAwsAccessKeyId: g.bedrockAwsAccessKeyId || '',
        bedrockAwsSecretAccessKey: g.bedrockAwsSecretAccessKey || '',
        bedrockAwsSessionToken: g.bedrockAwsSessionToken || '',
        bedrockAwsSessionName: g.bedrockAwsSessionName || '',
        bedrockAwsProfileName: g.bedrockAwsProfileName || '',
        bedrockAwsRoleName: g.bedrockAwsRoleName || '',
        bedrockAwsWebIdentityToken: g.bedrockAwsWebIdentityToken || '',
        bedrockAwsStsEndpoint: g.bedrockAwsStsEndpoint || '',
        bedrockAwsBedrockRuntimeEndpoint:
          g.bedrockAwsBedrockRuntimeEndpoint || '',
      };
    }

    default:
      return state;
  }
}

// ===== Context =====

const EditContext = createContext<EditContextValue | null>(null);

// ===== Provider =====

type EditProviderProps = {
  guardrail: Guardrail;
  children: React.ReactNode;
};

export function EditProvider({ guardrail, children }: EditProviderProps) {
  const [formState, dispatch] = useReducer(editReducer, initialFormState);
  const [isEditMode, setIsEditMode] = React.useState(false);

  // 初始化表單狀態
  useEffect(() => {
    dispatch({ type: 'INIT_FROM_GUARDRAIL', guardrail });
  }, [guardrail]);

  const setField = useCallback(
    <K extends keyof EditFormState>(field: K, value: EditFormState[K]) => {
      dispatch({ type: 'SET_FIELD', field, value });
    },
    [],
  );

  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET', guardrail });
    setIsEditMode(false);
  }, [guardrail]);

  /**
   * 建構 UpdateGuardrailInput 物件
   * 根據 Provider 類型組裝不同的更新參數
   */
  const buildUpdateInput = useCallback(
    (provider: string): UpdateGuardrailInput => {
      // 使用 type guard 驗證 mode
      const validatedMode = getValidatedMode(formState.mode);

      const input: UpdateGuardrailInput = {
        guardrailName: formState.name,
        defaultOn: formState.defaultOn,
        mode: validatedMode,
      };

      // 根據 Provider 添加專屬設定
      switch (provider) {
        case 'presidio':
          input.piiAction = getValidatedPiiAction(formState.piiAction);
          if (formState.outputParsePrompt) {
            input.outputParsePrompt = formState.outputParsePrompt;
          }
          break;

        case 'bedrock':
          if (formState.bedrockGuardrailId) {
            input.bedrockGuardrailId = formState.bedrockGuardrailId;
          }
          if (formState.bedrockGuardrailVersion) {
            input.bedrockGuardrailVersion = formState.bedrockGuardrailVersion;
          }
          input.bedrockDisableExceptionOnBlock =
            formState.bedrockDisableExceptionOnBlock;
          if (formState.bedrockAwsRegionName) {
            input.bedrockAwsRegionName = formState.bedrockAwsRegionName;
          }
          if (formState.bedrockAwsAccessKeyId) {
            input.bedrockAwsAccessKeyId = formState.bedrockAwsAccessKeyId;
          }
          if (formState.bedrockAwsSecretAccessKey) {
            input.bedrockAwsSecretAccessKey =
              formState.bedrockAwsSecretAccessKey;
          }
          if (formState.bedrockAwsSessionToken) {
            input.bedrockAwsSessionToken = formState.bedrockAwsSessionToken;
          }
          if (formState.bedrockAwsSessionName) {
            input.bedrockAwsSessionName = formState.bedrockAwsSessionName;
          }
          if (formState.bedrockAwsProfileName) {
            input.bedrockAwsProfileName = formState.bedrockAwsProfileName;
          }
          if (formState.bedrockAwsRoleName) {
            input.bedrockAwsRoleName = formState.bedrockAwsRoleName;
          }
          if (formState.bedrockAwsWebIdentityToken) {
            input.bedrockAwsWebIdentityToken =
              formState.bedrockAwsWebIdentityToken;
          }
          if (formState.bedrockAwsStsEndpoint) {
            input.bedrockAwsStsEndpoint = formState.bedrockAwsStsEndpoint;
          }
          if (formState.bedrockAwsBedrockRuntimeEndpoint) {
            input.bedrockAwsBedrockRuntimeEndpoint =
              formState.bedrockAwsBedrockRuntimeEndpoint;
          }
          break;
      }

      return input;
    },
    [formState],
  );

  const value = useMemo<EditContextValue>(
    () => ({
      formState,
      isEditMode,
      setIsEditMode,
      setField,
      resetForm,
      buildUpdateInput,
    }),
    [formState, isEditMode, setField, resetForm, buildUpdateInput],
  );

  return <EditContext.Provider value={value}>{children}</EditContext.Provider>;
}

// ===== Hook =====

import React from 'react';

/**
 * useEditContext - 獲取編輯狀態
 *
 * @throws Error 當在 EditProvider 外部使用時
 */
export function useEditContext(): EditContextValue {
  const context = useContext(EditContext);
  if (!context) {
    throw new Error('useEditContext must be used within EditProvider');
  }
  return context;
}
