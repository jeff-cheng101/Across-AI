'use client';

/**
 * GuardrailEditContext - 護欄編輯狀態管理 Context
 *
 * 業務背景：
 * 將 GuardrailDetailView 中分散的 useState 整合為單一 Context，
 * 消除 prop drilling，讓子組件可以直接存取編輯狀態和操作。
 *
 * 資料流：
 * Provider → useGuardrailForm (狀態管理) → useQuery (資料獲取) → 子組件
 *
 * 依賴：
 * - useGuardrailForm: 表單狀態和驗證
 * - React Query: 資料獲取和 mutation
 * - services/guardrails: API 函數
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useToast } from '@/hooks/use-toast';
import { useGuardrailForm } from '@/hooks/useGuardrailForm';
import {
  deleteGuardrail,
  fetchGuardrailById,
  type Guardrail,
  guardrailKeys,
  type UpdateGuardrailInput,
  updateGuardrail,
} from '@/services/guardrails';

// ===== 類型定義 =====

type GuardrailEditContextValue = {
  // 資料狀態
  guardrail: Guardrail | undefined;
  isLoading: boolean;
  error: Error | null;

  // 編輯模式狀態
  isEditMode: boolean;
  setIsEditMode: (value: boolean) => void;

  // 刪除對話框狀態
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (value: boolean) => void;

  // 分頁狀態
  activeTab: 'overview' | 'settings';
  setActiveTab: (tab: 'overview' | 'settings') => void;

  // 表單狀態（來自 useGuardrailForm）
  formState: ReturnType<typeof useGuardrailForm>['state'];
  formActions: ReturnType<typeof useGuardrailForm>['actions'];
  formValidation: ReturnType<typeof useGuardrailForm>['validation'];

  // 操作
  handleSaveEdit: () => void;
  handleCancelEdit: () => void;
  handleDelete: () => void;
  handleCopyId: () => void;

  // Mutation 狀態
  isSaving: boolean;
  isDeleting: boolean;
};

const GuardrailEditContext = createContext<GuardrailEditContextValue | null>(
  null,
);

// ===== Provider Props =====

type GuardrailEditProviderProps = {
  guardrailId: string;
  children: ReactNode;
};

// ===== Provider 組件 =====

/**
 * GuardrailEditProvider - 護欄編輯狀態提供者
 *
 * 包裝所有編輯相關的狀態管理，讓子組件可以透過 useGuardrailEdit 存取
 */
export function GuardrailEditProvider({
  guardrailId,
  children,
}: GuardrailEditProviderProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // 使用 useGuardrailForm 管理表單狀態
  const {
    state: formState,
    actions: formActions,
    validation: formValidation,
    buildUpdateInput,
  } = useGuardrailForm();

  // 編輯模式狀態
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'settings'>(
    'overview',
  );

  // 獲取護欄詳情
  const {
    data: guardrail,
    isLoading,
    error,
  } = useQuery({
    queryKey: guardrailKeys.detail(guardrailId),
    queryFn: () => fetchGuardrailById(guardrailId),
  });

  // 當護欄資料載入後，初始化表單
  useEffect(() => {
    if (guardrail) {
      formActions.initializeFromGuardrail(guardrail);
    }
  }, [guardrail, formActions]);

  // 更新 mutation
  const updateMutation = useMutation({
    mutationFn: (input: UpdateGuardrailInput) =>
      updateGuardrail(guardrailId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: guardrailKeys.detail(guardrailId),
      });
      queryClient.invalidateQueries({ queryKey: guardrailKeys.lists() });
      toast({ title: '護欄已更新', description: '設定已成功儲存' });
      setIsEditMode(false);
    },
    onError: (err) => {
      toast({
        title: '更新失敗',
        description: err instanceof Error ? err.message : '發生未知錯誤',
        variant: 'destructive',
      });
    },
  });

  // 刪除 mutation
  const deleteMutation = useMutation({
    mutationFn: () => deleteGuardrail(guardrailId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: guardrailKeys.lists() });
      toast({ title: '護欄已刪除', description: '護欄規則已成功移除' });
      router.push('/ai-gateway/guardrails');
    },
    onError: (err) => {
      toast({
        title: '刪除失敗',
        description: err instanceof Error ? err.message : '發生未知錯誤',
        variant: 'destructive',
      });
      setIsDeleteDialogOpen(false);
    },
  });

  // 儲存編輯
  const handleSaveEdit = useCallback(() => {
    const input = buildUpdateInput(guardrailId);
    if (!input) {
      toast({
        title: '驗證失敗',
        description: '請確認所有必填欄位已正確填寫',
        variant: 'destructive',
      });
      return;
    }
    updateMutation.mutate(input);
  }, [buildUpdateInput, guardrailId, updateMutation, toast]);

  // 取消編輯
  const handleCancelEdit = useCallback(() => {
    if (guardrail) {
      formActions.initializeFromGuardrail(guardrail);
    }
    setIsEditMode(false);
  }, [guardrail, formActions]);

  // 刪除護欄
  const handleDelete = useCallback(() => {
    deleteMutation.mutate();
  }, [deleteMutation]);

  // 複製 ID
  const handleCopyId = useCallback(() => {
    navigator.clipboard.writeText(guardrailId);
    toast({ title: '已複製', description: '護欄 ID 已複製到剪貼簿' });
  }, [guardrailId, toast]);

  // Context 值
  const value = useMemo<GuardrailEditContextValue>(
    () => ({
      // 資料狀態
      guardrail,
      isLoading,
      error: error as Error | null,

      // 編輯模式狀態
      isEditMode,
      setIsEditMode,

      // 刪除對話框狀態
      isDeleteDialogOpen,
      setIsDeleteDialogOpen,

      // 分頁狀態
      activeTab,
      setActiveTab,

      // 表單狀態
      formState,
      formActions,
      formValidation,

      // 操作
      handleSaveEdit,
      handleCancelEdit,
      handleDelete,
      handleCopyId,

      // Mutation 狀態
      isSaving: updateMutation.isPending,
      isDeleting: deleteMutation.isPending,
    }),
    [
      guardrail,
      isLoading,
      error,
      isEditMode,
      isDeleteDialogOpen,
      activeTab,
      formState,
      formActions,
      formValidation,
      handleSaveEdit,
      handleCancelEdit,
      handleDelete,
      handleCopyId,
      updateMutation.isPending,
      deleteMutation.isPending,
    ],
  );

  return (
    <GuardrailEditContext.Provider value={value}>
      {children}
    </GuardrailEditContext.Provider>
  );
}

// ===== Hook =====

/**
 * useGuardrailEdit - 存取護欄編輯 Context
 *
 * @throws 如果在 GuardrailEditProvider 外使用會拋出錯誤
 */
export function useGuardrailEdit(): GuardrailEditContextValue {
  const context = useContext(GuardrailEditContext);
  if (!context) {
    throw new Error(
      'useGuardrailEdit must be used within a GuardrailEditProvider',
    );
  }
  return context;
}
