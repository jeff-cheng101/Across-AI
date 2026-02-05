'use client';

/**
 * 安全護欄詳情視圖組件
 *
 * 業務背景：顯示單一護欄規則的詳細設定，包含總覽和設定兩個分頁。
 * 支援編輯模式切換，可修改護欄名稱、預設啟用狀態及各 Provider 專屬設定。
 *
 * 資料流：透過 React Query 獲取護欄詳情，更新和刪除操作透過 mutation 處理。
 *
 * 依賴：
 * - services/guardrails：API 函數和類型定義
 * - @tanstack/react-query：資料獲取和快取管理
 * - shadcn/ui 組件：UI 元素
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AlertCircle,
  ArrowLeft,
  Copy,
  Edit,
  Info,
  Settings,
  Shield,
  Trash2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  deleteGuardrail,
  fetchGuardrailById,
  GUARDRAIL_MODES,
  type Guardrail,
  getValidatedMode,
  guardrailKeys,
  PII_CATEGORIES,
  PII_TYPES,
  type PiiEntitiesConfig,
  type UpdateGuardrailInput,
  updateGuardrail,
} from '@/services/guardrails';

// ===== 類型定義 =====

type GuardrailDetailViewProps = {
  guardrailId: string;
};

type TabType = 'overview' | 'settings';

// ===== Provider 顯示名稱映射 =====

const PROVIDER_DISPLAY_NAMES: Record<string, string> = {
  presidio: 'Presidio (Microsoft)',
  bedrock: 'AWS Bedrock',
};

const MODE_DISPLAY_NAMES: Record<string, string> = {
  pre_call: '請求前 (Pre-call)',
  during_call: '請求中 (During-call)',
  post_call: '請求後 (Post-call)',
  logging_only: '僅記錄 (Logging)',
  pre_mcp_call: 'MCP 呼叫前',
  during_mcp_call: 'MCP 呼叫中',
};

const PII_ACTION_DISPLAY_NAMES: Record<string, string> = {
  mask: '遮蔽 (Mask)',
  block: '阻擋 (Block)',
};

// ===== 主組件 =====

export function GuardrailDetailView({ guardrailId }: GuardrailDetailViewProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // 分頁和編輯狀態
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // 編輯表單狀態
  const [editName, setEditName] = useState('');
  const [editDefaultOn, setEditDefaultOn] = useState(true);
  const [editMode, setEditMode] = useState<string>('pre_call');

  // Presidio 設定
  const [editPiiEntitiesConfig, setEditPiiEntitiesConfig] =
    useState<PiiEntitiesConfig>({});
  const [piiCategoryFilter, setPiiCategoryFilter] = useState<string>('all');
  const [editPiiAction, setEditPiiAction] = useState<string>('mask');
  const [editOutputParsePrompt, setEditOutputParsePrompt] = useState('');
  const [editPresidioAnalyzerApiBase, setEditPresidioAnalyzerApiBase] =
    useState('');
  const [editPresidioAnonymizerApiBase, setEditPresidioAnonymizerApiBase] =
    useState('');
  const [editPresidioFilterScope, setEditPresidioFilterScope] = useState('');
  const [editPresidioRunOn, setEditPresidioRunOn] = useState('');
  const [editPresidioLanguage, setEditPresidioLanguage] = useState('');

  // Bedrock 設定
  const [editBedrockGuardrailId, setEditBedrockGuardrailId] = useState('');
  const [editBedrockGuardrailVersion, setEditBedrockGuardrailVersion] =
    useState('');
  const [
    editBedrockDisableExceptionOnBlock,
    setEditBedrockDisableExceptionOnBlock,
  ] = useState(false);
  const [editBedrockAwsRegionName, setEditBedrockAwsRegionName] = useState('');
  const [editBedrockAwsAccessKeyId, setEditBedrockAwsAccessKeyId] =
    useState('');
  const [editBedrockAwsSecretAccessKey, setEditBedrockAwsSecretAccessKey] =
    useState('');
  const [editBedrockAwsSessionToken, setEditBedrockAwsSessionToken] =
    useState('');
  const [editBedrockAwsSessionName, setEditBedrockAwsSessionName] =
    useState('');
  const [editBedrockAwsProfileName, setEditBedrockAwsProfileName] =
    useState('');
  const [editBedrockAwsRoleName, setEditBedrockAwsRoleName] = useState('');
  const [editBedrockAwsWebIdentityToken, setEditBedrockAwsWebIdentityToken] =
    useState('');
  const [editBedrockAwsStsEndpoint, setEditBedrockAwsStsEndpoint] =
    useState('');
  const [
    editBedrockAwsBedrockRuntimeEndpoint,
    setEditBedrockAwsBedrockRuntimeEndpoint,
  ] = useState('');

  // 獲取護欄詳情
  const {
    data: guardrail,
    isLoading,
    error,
  } = useQuery({
    queryKey: guardrailKeys.detail(guardrailId),
    queryFn: () => fetchGuardrailById(guardrailId),
  });

  // 初始化編輯表單值
  useEffect(() => {
    if (guardrail) {
      setEditName(guardrail.guardrailName);
      setEditDefaultOn(guardrail.defaultOn);
      setEditMode(guardrail.mode);

      // Presidio 設定
      setEditPiiEntitiesConfig(guardrail.piiEntitiesConfig || {});
      setEditPiiAction(guardrail.piiAction || 'mask');
      setEditOutputParsePrompt(guardrail.outputParsePrompt || '');
      setEditPresidioAnalyzerApiBase(guardrail.presidioAnalyzerApiBase || '');
      setEditPresidioAnonymizerApiBase(
        guardrail.presidioAnonymizerApiBase || '',
      );
      setEditPresidioFilterScope(guardrail.presidioFilterScope || '');
      setEditPresidioRunOn(guardrail.presidioRunOn || '');
      setEditPresidioLanguage(guardrail.presidioLanguage || '');

      // Bedrock 設定
      setEditBedrockGuardrailId(guardrail.bedrockGuardrailId || '');
      setEditBedrockGuardrailVersion(guardrail.bedrockGuardrailVersion || '');
      setEditBedrockDisableExceptionOnBlock(
        guardrail.bedrockDisableExceptionOnBlock || false,
      );
      setEditBedrockAwsRegionName(guardrail.bedrockAwsRegionName || '');
      setEditBedrockAwsAccessKeyId(guardrail.bedrockAwsAccessKeyId || '');
      setEditBedrockAwsSecretAccessKey(
        guardrail.bedrockAwsSecretAccessKey || '',
      );
      setEditBedrockAwsSessionToken(guardrail.bedrockAwsSessionToken || '');
      setEditBedrockAwsSessionName(guardrail.bedrockAwsSessionName || '');
      setEditBedrockAwsProfileName(guardrail.bedrockAwsProfileName || '');
      setEditBedrockAwsRoleName(guardrail.bedrockAwsRoleName || '');
      setEditBedrockAwsWebIdentityToken(
        guardrail.bedrockAwsWebIdentityToken || '',
      );
      setEditBedrockAwsStsEndpoint(guardrail.bedrockAwsStsEndpoint || '');
      setEditBedrockAwsBedrockRuntimeEndpoint(
        guardrail.bedrockAwsBedrockRuntimeEndpoint || '',
      );
    }
  }, [guardrail]);

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
    onError: (error) => {
      toast({
        title: '更新失敗',
        description: error instanceof Error ? error.message : '發生未知錯誤',
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
    onError: (error) => {
      toast({
        title: '刪除失敗',
        description: error instanceof Error ? error.message : '發生未知錯誤',
        variant: 'destructive',
      });
      setIsDeleteDialogOpen(false);
    },
  });

  /**
   * 處理儲存編輯
   * 根據 Provider 類型組裝不同的更新參數
   */
  function handleSaveEdit() {
    if (!guardrail) return;

    // 使用 type guard 驗證 mode
    const validatedMode = getValidatedMode(editMode);

    const input: UpdateGuardrailInput = {
      guardrailName: editName,
      defaultOn: editDefaultOn,
      mode: validatedMode,
      provider: guardrail.provider as 'presidio' | 'bedrock',
    };

    // 根據 Provider 添加專屬設定
    switch (guardrail.provider) {
      case 'presidio':
        // 使用 piiEntitiesConfig 格式（每個 PII 類型獨立設定動作）
        if (Object.keys(editPiiEntitiesConfig).length > 0) {
          input.piiEntitiesConfig = editPiiEntitiesConfig;
        }
        if (editOutputParsePrompt) {
          input.outputParsePrompt = editOutputParsePrompt;
        }
        if (editPresidioAnalyzerApiBase) {
          input.presidioAnalyzerApiBase = editPresidioAnalyzerApiBase;
        }
        if (editPresidioAnonymizerApiBase) {
          input.presidioAnonymizerApiBase = editPresidioAnonymizerApiBase;
        }
        if (editPresidioFilterScope) {
          input.presidioFilterScope = editPresidioFilterScope;
        }
        if (editPresidioRunOn) {
          input.presidioRunOn = editPresidioRunOn;
        }
        if (editPresidioLanguage) {
          input.presidioLanguage = editPresidioLanguage;
        }
        break;

      case 'bedrock':
        if (editBedrockGuardrailId) {
          input.bedrockGuardrailId = editBedrockGuardrailId;
        }
        if (editBedrockGuardrailVersion) {
          input.bedrockGuardrailVersion = editBedrockGuardrailVersion;
        }
        input.bedrockDisableExceptionOnBlock =
          editBedrockDisableExceptionOnBlock;
        if (editBedrockAwsRegionName) {
          input.bedrockAwsRegionName = editBedrockAwsRegionName;
        }
        if (editBedrockAwsAccessKeyId) {
          input.bedrockAwsAccessKeyId = editBedrockAwsAccessKeyId;
        }
        if (editBedrockAwsSecretAccessKey) {
          input.bedrockAwsSecretAccessKey = editBedrockAwsSecretAccessKey;
        }
        if (editBedrockAwsSessionToken) {
          input.bedrockAwsSessionToken = editBedrockAwsSessionToken;
        }
        if (editBedrockAwsSessionName) {
          input.bedrockAwsSessionName = editBedrockAwsSessionName;
        }
        if (editBedrockAwsProfileName) {
          input.bedrockAwsProfileName = editBedrockAwsProfileName;
        }
        if (editBedrockAwsRoleName) {
          input.bedrockAwsRoleName = editBedrockAwsRoleName;
        }
        if (editBedrockAwsWebIdentityToken) {
          input.bedrockAwsWebIdentityToken = editBedrockAwsWebIdentityToken;
        }
        if (editBedrockAwsStsEndpoint) {
          input.bedrockAwsStsEndpoint = editBedrockAwsStsEndpoint;
        }
        if (editBedrockAwsBedrockRuntimeEndpoint) {
          input.bedrockAwsBedrockRuntimeEndpoint =
            editBedrockAwsBedrockRuntimeEndpoint;
        }
        break;
    }

    updateMutation.mutate(input);
  }

  /**
   * 處理取消編輯
   * 重置所有編輯狀態為原始值
   */
  function handleCancelEdit() {
    if (guardrail) {
      setEditName(guardrail.guardrailName);
      setEditDefaultOn(guardrail.defaultOn);
      setEditMode(guardrail.mode);
      setEditPiiEntitiesConfig(guardrail.piiEntitiesConfig || {});
      setPiiCategoryFilter('all');
      setEditPiiAction(guardrail.piiAction || 'mask');
      setEditOutputParsePrompt(guardrail.outputParsePrompt || '');
      setEditPresidioAnalyzerApiBase(guardrail.presidioAnalyzerApiBase || '');
      setEditPresidioAnonymizerApiBase(
        guardrail.presidioAnonymizerApiBase || '',
      );
      setEditPresidioFilterScope(guardrail.presidioFilterScope || '');
      setEditPresidioRunOn(guardrail.presidioRunOn || '');
      setEditPresidioLanguage(guardrail.presidioLanguage || '');
      setEditBedrockGuardrailId(guardrail.bedrockGuardrailId || '');
      setEditBedrockGuardrailVersion(guardrail.bedrockGuardrailVersion || '');
      setEditBedrockDisableExceptionOnBlock(
        guardrail.bedrockDisableExceptionOnBlock || false,
      );
      setEditBedrockAwsRegionName(guardrail.bedrockAwsRegionName || '');
      setEditBedrockAwsAccessKeyId(guardrail.bedrockAwsAccessKeyId || '');
      setEditBedrockAwsSecretAccessKey(
        guardrail.bedrockAwsSecretAccessKey || '',
      );
      setEditBedrockAwsSessionToken(guardrail.bedrockAwsSessionToken || '');
      setEditBedrockAwsSessionName(guardrail.bedrockAwsSessionName || '');
      setEditBedrockAwsProfileName(guardrail.bedrockAwsProfileName || '');
      setEditBedrockAwsRoleName(guardrail.bedrockAwsRoleName || '');
      setEditBedrockAwsWebIdentityToken(
        guardrail.bedrockAwsWebIdentityToken || '',
      );
      setEditBedrockAwsStsEndpoint(guardrail.bedrockAwsStsEndpoint || '');
      setEditBedrockAwsBedrockRuntimeEndpoint(
        guardrail.bedrockAwsBedrockRuntimeEndpoint || '',
      );
    }
    setIsEditMode(false);
  }

  /**
   * 複製 ID 到剪貼簿
   */
  function handleCopyId() {
    navigator.clipboard.writeText(guardrailId);
    toast({ title: '已複製 ID', description: '護欄 ID 已複製到剪貼簿' });
  }

  // 載入中狀態
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // 錯誤或不存在狀態
  if (error || !guardrail) {
    return (
      <ErrorState
        guardrailId={guardrailId}
        onBack={() => router.push('/ai-gateway/guardrails')}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        {/* 返回按鈕 */}
        <Button
          variant="ghost"
          className="text-blue-400 hover:text-blue-300 hover:bg-slate-800 p-0"
          onClick={() => router.push('/ai-gateway/guardrails')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回護欄規則列表
        </Button>

        {/* 護欄名稱和 ID */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-semibold text-white">
              {guardrail.guardrailName}
            </h2>
            <span
              className={`px-2 py-1 text-xs rounded ${
                guardrail.defaultOn
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-slate-700 text-slate-300'
              }`}
            >
              {guardrail.defaultOn ? '預設啟用' : '預設關閉'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <span className="font-mono text-sm">{guardrail.guardrailId}</span>
            <button
              type="button"
              onClick={handleCopyId}
              className="hover:text-slate-200 transition-colors"
              aria-label="複製護欄 ID"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-slate-700">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-1 font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            <Info className="w-4 h-4" />
            總覽
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('settings');
              setIsEditMode(false);
            }}
            className={`pb-3 px-1 font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            <Settings className="w-4 h-4" />
            設定
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && <OverviewTab guardrail={guardrail} />}
      {activeTab === 'settings' && (
        <SettingsTab
          guardrail={guardrail}
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
          editName={editName}
          setEditName={setEditName}
          editDefaultOn={editDefaultOn}
          setEditDefaultOn={setEditDefaultOn}
          editMode={editMode}
          setEditMode={setEditMode}
          editPiiEntitiesConfig={editPiiEntitiesConfig}
          setEditPiiEntitiesConfig={setEditPiiEntitiesConfig}
          piiCategoryFilter={piiCategoryFilter}
          setPiiCategoryFilter={setPiiCategoryFilter}
          editPiiAction={editPiiAction}
          editOutputParsePrompt={editOutputParsePrompt}
          setEditOutputParsePrompt={setEditOutputParsePrompt}
          editPresidioAnalyzerApiBase={editPresidioAnalyzerApiBase}
          setEditPresidioAnalyzerApiBase={setEditPresidioAnalyzerApiBase}
          editPresidioAnonymizerApiBase={editPresidioAnonymizerApiBase}
          setEditPresidioAnonymizerApiBase={setEditPresidioAnonymizerApiBase}
          editPresidioFilterScope={editPresidioFilterScope}
          setEditPresidioFilterScope={setEditPresidioFilterScope}
          editPresidioRunOn={editPresidioRunOn}
          setEditPresidioRunOn={setEditPresidioRunOn}
          editPresidioLanguage={editPresidioLanguage}
          setEditPresidioLanguage={setEditPresidioLanguage}
          editBedrockGuardrailId={editBedrockGuardrailId}
          setEditBedrockGuardrailId={setEditBedrockGuardrailId}
          editBedrockGuardrailVersion={editBedrockGuardrailVersion}
          setEditBedrockGuardrailVersion={setEditBedrockGuardrailVersion}
          editBedrockDisableExceptionOnBlock={
            editBedrockDisableExceptionOnBlock
          }
          setEditBedrockDisableExceptionOnBlock={
            setEditBedrockDisableExceptionOnBlock
          }
          editBedrockAwsRegionName={editBedrockAwsRegionName}
          setEditBedrockAwsRegionName={setEditBedrockAwsRegionName}
          editBedrockAwsAccessKeyId={editBedrockAwsAccessKeyId}
          setEditBedrockAwsAccessKeyId={setEditBedrockAwsAccessKeyId}
          editBedrockAwsSecretAccessKey={editBedrockAwsSecretAccessKey}
          setEditBedrockAwsSecretAccessKey={setEditBedrockAwsSecretAccessKey}
          editBedrockAwsSessionToken={editBedrockAwsSessionToken}
          setEditBedrockAwsSessionToken={setEditBedrockAwsSessionToken}
          editBedrockAwsSessionName={editBedrockAwsSessionName}
          setEditBedrockAwsSessionName={setEditBedrockAwsSessionName}
          editBedrockAwsProfileName={editBedrockAwsProfileName}
          setEditBedrockAwsProfileName={setEditBedrockAwsProfileName}
          editBedrockAwsRoleName={editBedrockAwsRoleName}
          setEditBedrockAwsRoleName={setEditBedrockAwsRoleName}
          editBedrockAwsWebIdentityToken={editBedrockAwsWebIdentityToken}
          setEditBedrockAwsWebIdentityToken={setEditBedrockAwsWebIdentityToken}
          editBedrockAwsStsEndpoint={editBedrockAwsStsEndpoint}
          setEditBedrockAwsStsEndpoint={setEditBedrockAwsStsEndpoint}
          editBedrockAwsBedrockRuntimeEndpoint={
            editBedrockAwsBedrockRuntimeEndpoint
          }
          setEditBedrockAwsBedrockRuntimeEndpoint={
            setEditBedrockAwsBedrockRuntimeEndpoint
          }
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
          onDelete={() => setIsDeleteDialogOpen(true)}
          isPending={updateMutation.isPending}
        />
      )}

      {/* 刪除確認對話框 */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">確認刪除護欄</DialogTitle>
            <DialogDescription className="text-slate-400">
              您確定要刪除護欄「{guardrail.guardrailName}」嗎？此操作無法復原。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={deleteMutation.isPending}
            >
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? '刪除中...' : '確認刪除'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ===== 子組件 =====

/**
 * 載入中骨架屏
 */
function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Skeleton className="h-6 w-32 bg-slate-800" />
        <Skeleton className="h-8 w-64 bg-slate-800" />
        <Skeleton className="h-4 w-48 bg-slate-800" />
        <Skeleton className="h-10 w-full bg-slate-800" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-28 bg-slate-800" />
        <Skeleton className="h-28 bg-slate-800" />
        <Skeleton className="h-28 bg-slate-800" />
      </div>
      <Skeleton className="h-48 bg-slate-800" />
    </div>
  );
}

/**
 * 錯誤狀態組件
 */
function ErrorState({
  guardrailId,
  onBack,
}: {
  guardrailId: string;
  onBack: () => void;
}) {
  return (
    <div className="text-center py-12">
      <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
      <h3 className="text-xl text-white mb-2">找不到護欄</h3>
      <p className="text-slate-400 mb-4">
        ID: <span className="font-mono">{guardrailId}</span>
      </p>
      <p className="text-slate-500 text-sm mb-6">
        該護欄可能已被刪除或 ID 不正確
      </p>
      <Button onClick={onBack}>返回列表</Button>
    </div>
  );
}

/**
 * 總覽分頁組件
 */
function OverviewTab({ guardrail }: { guardrail: Guardrail }) {
  return (
    <div className="space-y-6">
      {/* 基本資訊卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 提供者卡片 */}
        <Card className="bg-slate-800/30 border-slate-700">
          <CardContent className="p-4">
            <div className="text-sm text-slate-400 mb-2">提供者</div>
            <div className="text-lg font-semibold text-white">
              {PROVIDER_DISPLAY_NAMES[guardrail.provider] || guardrail.provider}
            </div>
            <div className="text-sm text-slate-500 mt-1 font-mono">
              {guardrail.provider}
            </div>
          </CardContent>
        </Card>

        {/* 模式卡片 */}
        <Card className="bg-slate-800/30 border-slate-700">
          <CardContent className="p-4">
            <div className="text-sm text-slate-400 mb-2">執行模式</div>
            <div className="text-lg font-semibold text-white">
              {MODE_DISPLAY_NAMES[guardrail.mode] || guardrail.mode}
            </div>
            <span
              className={`inline-block px-2 py-1 text-xs rounded mt-2 ${
                guardrail.defaultOn
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-slate-700 text-slate-300'
              }`}
            >
              {guardrail.defaultOn ? '預設啟用' : '預設關閉'}
            </span>
          </CardContent>
        </Card>

        {/* 時間卡片 */}
        <Card className="bg-slate-800/30 border-slate-700">
          <CardContent className="p-4">
            <div className="text-sm text-slate-400 mb-2">建立時間</div>
            <div className="text-lg font-semibold text-white">
              {guardrail.createdAt
                ? new Date(guardrail.createdAt).toLocaleDateString('zh-TW', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : '-'}
            </div>
            {guardrail.updatedAt && (
              <div className="text-sm text-slate-400 mt-1">
                上次更新：
                {new Date(guardrail.updatedAt).toLocaleDateString('zh-TW', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Presidio PII 防護列表 */}
      {guardrail.provider === 'presidio' && (
        <Card className="bg-slate-800/30 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-sm flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-400" />
              PII 防護項目
              {guardrail.piiEntitiesConfig &&
                Object.keys(guardrail.piiEntitiesConfig).length > 0 && (
                  <span className="text-xs text-slate-400 font-normal">
                    （{Object.keys(guardrail.piiEntitiesConfig).length} 個類型）
                  </span>
                )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {guardrail.piiEntitiesConfig &&
            Object.keys(guardrail.piiEntitiesConfig).length > 0 ? (
              <div className="border border-slate-700 rounded-lg overflow-hidden">
                <div className="grid grid-cols-[1fr_100px_140px] bg-slate-800/50 text-slate-200 font-semibold text-sm border-b border-slate-700">
                  <div className="p-3">PII 類型</div>
                  <div className="p-3">類別</div>
                  <div className="p-3">動作</div>
                </div>
                <div className="divide-y divide-slate-700 max-h-[300px] overflow-y-auto">
                  {Object.entries(guardrail.piiEntitiesConfig).map(
                    ([entityId, action]) => {
                      const piiType = PII_TYPES.find((t) => t.id === entityId);
                      return (
                        <div
                          key={entityId}
                          className="grid grid-cols-[1fr_100px_140px] text-sm"
                        >
                          <div className="p-3 text-slate-200">
                            {piiType?.name || entityId}
                          </div>
                          <div className="p-3">
                            <span className="px-2 py-1 text-xs rounded bg-slate-700 text-slate-300">
                              {piiType?.category || '-'}
                            </span>
                          </div>
                          <div className="p-3">
                            <span
                              className={`px-2 py-1 text-xs rounded ${
                                action === 'block'
                                  ? 'bg-red-500/20 text-red-400'
                                  : 'bg-yellow-500/20 text-yellow-400'
                              }`}
                            >
                              {PII_ACTION_DISPLAY_NAMES[action] || action}
                            </span>
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>
            ) : guardrail.piiEntitiesEnabled &&
              guardrail.piiEntitiesEnabled.length > 0 ? (
              // 向下相容：舊格式顯示
              <>
                <div className="flex flex-wrap gap-2">
                  {guardrail.piiEntitiesEnabled.map((entity) => (
                    <span
                      key={entity}
                      className="px-3 py-1.5 text-sm bg-blue-500/20 text-blue-400 rounded-md border border-blue-500/30"
                    >
                      {entity}
                    </span>
                  ))}
                </div>
                {guardrail.piiAction && (
                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <span className="text-sm text-slate-400">處理動作：</span>
                    <span className="ml-2 text-white">
                      {PII_ACTION_DISPLAY_NAMES[guardrail.piiAction] ||
                        guardrail.piiAction}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <span className="text-slate-400">未設定 PII 防護項目</span>
            )}

            {/* Presidio 進階設定顯示 */}
            {(guardrail.presidioAnalyzerApiBase ||
              guardrail.presidioAnonymizerApiBase ||
              guardrail.presidioFilterScope ||
              guardrail.presidioRunOn ||
              guardrail.presidioLanguage) && (
              <div className="mt-4 pt-4 border-t border-slate-700 space-y-2">
                <div className="text-sm font-medium text-slate-300 mb-3">
                  進階設定
                </div>
                {guardrail.presidioAnalyzerApiBase && (
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-400 text-sm">分析器 API</span>
                    <span className="text-white font-mono text-sm truncate max-w-[60%]">
                      {guardrail.presidioAnalyzerApiBase}
                    </span>
                  </div>
                )}
                {guardrail.presidioAnonymizerApiBase && (
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-400 text-sm">匿名化器 API</span>
                    <span className="text-white font-mono text-sm truncate max-w-[60%]">
                      {guardrail.presidioAnonymizerApiBase}
                    </span>
                  </div>
                )}
                {guardrail.presidioFilterScope && (
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-400 text-sm">過濾範圍</span>
                    <span className="text-white text-sm">
                      {guardrail.presidioFilterScope}
                    </span>
                  </div>
                )}
                {guardrail.presidioRunOn && (
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-400 text-sm">執行位置</span>
                    <span className="text-white text-sm">
                      {guardrail.presidioRunOn}
                    </span>
                  </div>
                )}
                {guardrail.presidioLanguage && (
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-400 text-sm">語言</span>
                    <span className="text-white text-sm">
                      {guardrail.presidioLanguage}
                    </span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Bedrock 設定 */}
      {guardrail.provider === 'bedrock' && (
        <Card className="bg-slate-800/30 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-sm">
              AWS Bedrock 設定
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-slate-700">
              <span className="text-slate-400">護欄識別碼</span>
              <span className="text-white font-mono text-sm">
                {guardrail.bedrockGuardrailId || '-'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-700">
              <span className="text-slate-400">護欄版本</span>
              <span className="text-white">
                {guardrail.bedrockGuardrailVersion || 'DRAFT'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-700">
              <span className="text-slate-400">停用阻擋時例外</span>
              <span
                className={`px-2 py-1 text-xs rounded ${
                  guardrail.bedrockDisableExceptionOnBlock
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-slate-700 text-slate-300'
                }`}
              >
                {guardrail.bedrockDisableExceptionOnBlock ? '是' : '否'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-700">
              <span className="text-slate-400">AWS 區域</span>
              <span className="text-white font-mono text-sm">
                {guardrail.bedrockAwsRegionName || '-'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-700">
              <span className="text-slate-400">AWS 設定檔名稱</span>
              <span className="text-white font-mono text-sm">
                {guardrail.bedrockAwsProfileName || '-'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-700">
              <span className="text-slate-400">AWS 角色名稱</span>
              <span className="text-white font-mono text-sm">
                {guardrail.bedrockAwsRoleName || '-'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-700">
              <span className="text-slate-400">AWS STS 端點</span>
              <span className="text-white font-mono text-sm truncate max-w-[60%]">
                {guardrail.bedrockAwsStsEndpoint || '-'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-400">Bedrock 執行階段端點</span>
              <span className="text-white font-mono text-sm truncate max-w-[60%]">
                {guardrail.bedrockAwsBedrockRuntimeEndpoint || '-'}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/**
 * 設定分頁組件
 */
function SettingsTab({
  guardrail,
  isEditMode,
  setIsEditMode,
  editName,
  setEditName,
  editDefaultOn,
  setEditDefaultOn,
  editMode,
  setEditMode,
  editPiiEntitiesConfig,
  setEditPiiEntitiesConfig,
  piiCategoryFilter,
  setPiiCategoryFilter,
  editPiiAction,
  editOutputParsePrompt,
  setEditOutputParsePrompt,
  editPresidioAnalyzerApiBase,
  setEditPresidioAnalyzerApiBase,
  editPresidioAnonymizerApiBase,
  setEditPresidioAnonymizerApiBase,
  editPresidioFilterScope,
  setEditPresidioFilterScope,
  editPresidioRunOn,
  setEditPresidioRunOn,
  editPresidioLanguage,
  setEditPresidioLanguage,
  editBedrockGuardrailId,
  setEditBedrockGuardrailId,
  editBedrockGuardrailVersion,
  setEditBedrockGuardrailVersion,
  editBedrockDisableExceptionOnBlock,
  setEditBedrockDisableExceptionOnBlock,
  editBedrockAwsRegionName,
  setEditBedrockAwsRegionName,
  editBedrockAwsAccessKeyId,
  setEditBedrockAwsAccessKeyId,
  editBedrockAwsSecretAccessKey,
  setEditBedrockAwsSecretAccessKey,
  editBedrockAwsSessionToken,
  setEditBedrockAwsSessionToken,
  editBedrockAwsSessionName,
  setEditBedrockAwsSessionName,
  editBedrockAwsProfileName,
  setEditBedrockAwsProfileName,
  editBedrockAwsRoleName,
  setEditBedrockAwsRoleName,
  editBedrockAwsWebIdentityToken,
  setEditBedrockAwsWebIdentityToken,
  editBedrockAwsStsEndpoint,
  setEditBedrockAwsStsEndpoint,
  editBedrockAwsBedrockRuntimeEndpoint,
  setEditBedrockAwsBedrockRuntimeEndpoint,
  onSave,
  onCancel,
  onDelete,
  isPending,
}: {
  guardrail: Guardrail;
  isEditMode: boolean;
  setIsEditMode: (value: boolean) => void;
  editName: string;
  setEditName: (value: string) => void;
  editDefaultOn: boolean;
  setEditDefaultOn: (value: boolean) => void;
  editMode: string;
  setEditMode: (value: string) => void;
  editPiiEntitiesConfig: PiiEntitiesConfig;
  setEditPiiEntitiesConfig: (value: PiiEntitiesConfig) => void;
  piiCategoryFilter: string;
  setPiiCategoryFilter: (value: string) => void;
  editPiiAction: string;
  editOutputParsePrompt: string;
  setEditOutputParsePrompt: (value: string) => void;
  editPresidioAnalyzerApiBase: string;
  setEditPresidioAnalyzerApiBase: (value: string) => void;
  editPresidioAnonymizerApiBase: string;
  setEditPresidioAnonymizerApiBase: (value: string) => void;
  editPresidioFilterScope: string;
  setEditPresidioFilterScope: (value: string) => void;
  editPresidioRunOn: string;
  setEditPresidioRunOn: (value: string) => void;
  editPresidioLanguage: string;
  setEditPresidioLanguage: (value: string) => void;
  editBedrockGuardrailId: string;
  setEditBedrockGuardrailId: (value: string) => void;
  editBedrockGuardrailVersion: string;
  setEditBedrockGuardrailVersion: (value: string) => void;
  editBedrockDisableExceptionOnBlock: boolean;
  setEditBedrockDisableExceptionOnBlock: (value: boolean) => void;
  editBedrockAwsRegionName: string;
  setEditBedrockAwsRegionName: (value: string) => void;
  editBedrockAwsAccessKeyId: string;
  setEditBedrockAwsAccessKeyId: (value: string) => void;
  editBedrockAwsSecretAccessKey: string;
  setEditBedrockAwsSecretAccessKey: (value: string) => void;
  editBedrockAwsSessionToken: string;
  setEditBedrockAwsSessionToken: (value: string) => void;
  editBedrockAwsSessionName: string;
  setEditBedrockAwsSessionName: (value: string) => void;
  editBedrockAwsProfileName: string;
  setEditBedrockAwsProfileName: (value: string) => void;
  editBedrockAwsRoleName: string;
  setEditBedrockAwsRoleName: (value: string) => void;
  editBedrockAwsWebIdentityToken: string;
  setEditBedrockAwsWebIdentityToken: (value: string) => void;
  editBedrockAwsStsEndpoint: string;
  setEditBedrockAwsStsEndpoint: (value: string) => void;
  editBedrockAwsBedrockRuntimeEndpoint: string;
  setEditBedrockAwsBedrockRuntimeEndpoint: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  isPending: boolean;
}) {
  return (
    <div className="space-y-6">
      {/* 編輯按鈕 */}
      <div className="flex justify-end">
        {!isEditMode ? (
          <Button onClick={() => setIsEditMode(true)}>
            <Edit className="w-4 h-4 mr-2" />
            編輯
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel} disabled={isPending}>
              取消
            </Button>
            <Button onClick={onSave} disabled={isPending}>
              {isPending ? '儲存中...' : '儲存'}
            </Button>
          </div>
        )}
      </div>

      {/* 基本設定卡片 */}
      <Card className="bg-slate-800/30 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white text-sm">基本設定</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 護欄名稱 */}
          <div className="space-y-2">
            <Label className="text-slate-300">護欄名稱</Label>
            {isEditMode ? (
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="bg-slate-900 border-slate-600 text-white"
                placeholder="輸入護欄名稱"
              />
            ) : (
              <div className="text-white py-2">{guardrail.guardrailName}</div>
            )}
          </div>

          {/* 預設啟用 */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-slate-300">預設啟用</Label>
              <p className="text-sm text-slate-500 mt-1">
                啟用後，此護欄將自動套用到所有 API 請求
              </p>
            </div>
            {isEditMode ? (
              <Switch
                checked={editDefaultOn}
                onCheckedChange={setEditDefaultOn}
              />
            ) : (
              <span
                className={`px-2 py-1 text-sm rounded ${
                  guardrail.defaultOn
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-slate-700 text-slate-300'
                }`}
              >
                {guardrail.defaultOn ? '是' : '否'}
              </span>
            )}
          </div>

          {/* 執行模式 */}
          <div className="space-y-2">
            <Label className="text-slate-300">執行模式</Label>
            {isEditMode ? (
              <Select value={editMode} onValueChange={setEditMode}>
                <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                  <SelectValue placeholder="選擇執行模式" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700">
                  {GUARDRAIL_MODES.map((mode) => (
                    <SelectItem key={mode} value={mode} className="text-white">
                      {MODE_DISPLAY_NAMES[mode] || mode}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="text-white py-2">
                {MODE_DISPLAY_NAMES[guardrail.mode] || guardrail.mode}
              </div>
            )}
          </div>

          {/* Provider（只讀） */}
          <div className="space-y-2">
            <Label className="text-slate-300">提供者</Label>
            <div className="text-white py-2 flex items-center gap-2">
              {PROVIDER_DISPLAY_NAMES[guardrail.provider] || guardrail.provider}
              <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">
                不可變更
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Provider 專屬設定 */}
      {guardrail.provider === 'presidio' && (
        <Card className="bg-slate-800/30 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-sm">Presidio 設定</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* PII 類型選擇 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-slate-300">PII 類型設定</Label>
                {isEditMode && (
                  <span className="text-sm text-slate-400">
                    已選擇 {Object.keys(editPiiEntitiesConfig).length} 個類型
                  </span>
                )}
              </div>

              {isEditMode ? (
                <>
                  {/* 類別篩選 */}
                  <div className="flex items-center gap-4">
                    <Label className="text-slate-400 text-sm">依類別篩選</Label>
                    <Select
                      value={piiCategoryFilter}
                      onValueChange={setPiiCategoryFilter}
                    >
                      <SelectTrigger className="w-[180px] bg-slate-900 border-slate-600 text-white">
                        <SelectValue placeholder="選擇類別" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-700">
                        <SelectItem value="all" className="text-white">
                          全部類別
                        </SelectItem>
                        {PII_CATEGORIES.map((category) => (
                          <SelectItem
                            key={category}
                            value={category}
                            className="text-white"
                          >
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 快速操作按鈕 */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const filtered =
                          piiCategoryFilter === 'all'
                            ? PII_TYPES
                            : PII_TYPES.filter(
                                (t) => t.category === piiCategoryFilter,
                              );
                        const newConfig = { ...editPiiEntitiesConfig };
                        filtered.forEach((t) => {
                          newConfig[t.id] = 'mask';
                        });
                        setEditPiiEntitiesConfig(newConfig);
                      }}
                      className="border-blue-600 text-blue-400 hover:bg-blue-600/10"
                    >
                      全選並遮蔽
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const filtered =
                          piiCategoryFilter === 'all'
                            ? PII_TYPES
                            : PII_TYPES.filter(
                                (t) => t.category === piiCategoryFilter,
                              );
                        const newConfig = { ...editPiiEntitiesConfig };
                        filtered.forEach((t) => {
                          newConfig[t.id] = 'block';
                        });
                        setEditPiiEntitiesConfig(newConfig);
                      }}
                      className="border-red-600 text-red-400 hover:bg-red-600/10"
                    >
                      全選並阻擋
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const filtered =
                          piiCategoryFilter === 'all'
                            ? PII_TYPES
                            : PII_TYPES.filter(
                                (t) => t.category === piiCategoryFilter,
                              );
                        const newConfig = { ...editPiiEntitiesConfig };
                        filtered.forEach((t) => {
                          delete newConfig[t.id];
                        });
                        setEditPiiEntitiesConfig(newConfig);
                      }}
                      className="border-slate-600 text-slate-400 hover:bg-slate-600/10"
                    >
                      取消全選
                    </Button>
                  </div>

                  {/* PII 類型表格 */}
                  <div className="border border-slate-700 rounded-lg overflow-hidden">
                    <div className="grid grid-cols-[40px_1fr_120px_150px] bg-slate-800/50 text-slate-200 font-semibold text-sm border-b border-slate-700">
                      <div className="p-3" />
                      <div className="p-3">PII 類型</div>
                      <div className="p-3">類別</div>
                      <div className="p-3">動作</div>
                    </div>
                    <div className="divide-y divide-slate-700 max-h-[400px] overflow-y-auto">
                      {PII_TYPES.filter(
                        (t) =>
                          piiCategoryFilter === 'all' ||
                          t.category === piiCategoryFilter,
                      ).map((piiType) => {
                        const isEnabled = piiType.id in editPiiEntitiesConfig;
                        const action =
                          editPiiEntitiesConfig[piiType.id] || 'mask';
                        return (
                          <div
                            key={piiType.id}
                            className={`grid grid-cols-[40px_1fr_120px_150px] items-center hover:bg-slate-800/30 ${
                              isEnabled ? 'bg-slate-800/20' : ''
                            }`}
                          >
                            <div className="p-3">
                              <input
                                type="checkbox"
                                checked={isEnabled}
                                onChange={(e) => {
                                  const newConfig = {
                                    ...editPiiEntitiesConfig,
                                  };
                                  if (e.target.checked) {
                                    newConfig[piiType.id] = editPiiAction as
                                      | 'mask'
                                      | 'block';
                                  } else {
                                    delete newConfig[piiType.id];
                                  }
                                  setEditPiiEntitiesConfig(newConfig);
                                }}
                                className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-600 cursor-pointer"
                              />
                            </div>
                            <div className="p-3 text-slate-200">
                              {piiType.name}
                            </div>
                            <div className="p-3">
                              <span className="inline-block px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                {piiType.category}
                              </span>
                            </div>
                            <div className="p-3">
                              <Select
                                value={action}
                                onValueChange={(value) => {
                                  if (isEnabled) {
                                    setEditPiiEntitiesConfig({
                                      ...editPiiEntitiesConfig,
                                      [piiType.id]: value as 'mask' | 'block',
                                    });
                                  }
                                }}
                                disabled={!isEnabled}
                              >
                                <SelectTrigger
                                  className={`w-full bg-slate-800/50 border-slate-700 text-slate-200 ${
                                    !isEnabled ? 'opacity-50' : ''
                                  }`}
                                >
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-slate-700">
                                  <SelectItem
                                    value="mask"
                                    className="text-slate-200"
                                  >
                                    遮蔽
                                  </SelectItem>
                                  <SelectItem
                                    value="block"
                                    className="text-slate-200"
                                  >
                                    阻擋
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                // 非編輯模式：顯示已設定的 PII 類型
                <div className="space-y-2">
                  {guardrail.piiEntitiesConfig &&
                  Object.keys(guardrail.piiEntitiesConfig).length > 0 ? (
                    <div className="border border-slate-700 rounded-lg overflow-hidden">
                      <div className="grid grid-cols-[1fr_100px_140px] bg-slate-800/50 text-slate-200 font-semibold text-sm border-b border-slate-700">
                        <div className="p-3">PII 類型</div>
                        <div className="p-3">類別</div>
                        <div className="p-3">動作</div>
                      </div>
                      <div className="divide-y divide-slate-700">
                        {Object.entries(guardrail.piiEntitiesConfig).map(
                          ([entityId, action]) => {
                            const piiType = PII_TYPES.find(
                              (t) => t.id === entityId,
                            );
                            return (
                              <div
                                key={entityId}
                                className="grid grid-cols-[1fr_100px_140px] items-center"
                              >
                                <div className="p-3 text-slate-200">
                                  {piiType?.name || entityId}
                                </div>
                                <div className="p-3">
                                  <span className="inline-block px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                    {piiType?.category || '-'}
                                  </span>
                                </div>
                                <div className="p-3">
                                  <span
                                    className={`inline-block px-2 py-1 rounded text-xs ${
                                      action === 'block'
                                        ? 'bg-red-500/20 text-red-400'
                                        : 'bg-blue-500/20 text-blue-400'
                                    }`}
                                  >
                                    {PII_ACTION_DISPLAY_NAMES[action] || action}
                                  </span>
                                </div>
                              </div>
                            );
                          },
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-slate-400 py-2">未設定 PII 類型</div>
                  )}
                </div>
              )}
            </div>

            {/* Output Parse Prompt */}
            <div className="space-y-2">
              <Label className="text-slate-300">輸出解析提示詞（選填）</Label>
              {isEditMode ? (
                <Textarea
                  value={editOutputParsePrompt}
                  onChange={(e) => setEditOutputParsePrompt(e.target.value)}
                  className="bg-slate-900 border-slate-600 text-white min-h-[100px]"
                  placeholder="用於解析模型輸出的提示詞"
                />
              ) : (
                <div className="text-white py-2 whitespace-pre-wrap">
                  {guardrail.outputParsePrompt || '未設定'}
                </div>
              )}
            </div>

            {/* Presidio Analyzer API Base */}
            <div className="space-y-2">
              <Label className="text-slate-300">
                Presidio 分析器 API URL（選填）
              </Label>
              {isEditMode ? (
                <Input
                  value={editPresidioAnalyzerApiBase}
                  onChange={(e) =>
                    setEditPresidioAnalyzerApiBase(e.target.value)
                  }
                  className="bg-slate-900 border-slate-600 text-white font-mono"
                  placeholder="例如: http://localhost:5001"
                />
              ) : (
                <div className="text-white py-2 font-mono">
                  {guardrail.presidioAnalyzerApiBase || '未設定'}
                </div>
              )}
            </div>

            {/* Presidio Anonymizer API Base */}
            <div className="space-y-2">
              <Label className="text-slate-300">
                Presidio 匿名化器 API URL（選填）
              </Label>
              {isEditMode ? (
                <Input
                  value={editPresidioAnonymizerApiBase}
                  onChange={(e) =>
                    setEditPresidioAnonymizerApiBase(e.target.value)
                  }
                  className="bg-slate-900 border-slate-600 text-white font-mono"
                  placeholder="例如: http://localhost:5002"
                />
              ) : (
                <div className="text-white py-2 font-mono">
                  {guardrail.presidioAnonymizerApiBase || '未設定'}
                </div>
              )}
            </div>

            {/* Presidio Filter Scope */}
            <div className="space-y-2">
              <Label className="text-slate-300">過濾範圍（選填）</Label>
              {isEditMode ? (
                <Select
                  value={editPresidioFilterScope || 'both'}
                  onValueChange={setEditPresidioFilterScope}
                >
                  <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                    <SelectValue placeholder="選擇過濾範圍" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-600">
                    <SelectItem value="input" className="text-white">
                      Input（僅輸入）
                    </SelectItem>
                    <SelectItem value="output" className="text-white">
                      Output（僅輸出）
                    </SelectItem>
                    <SelectItem value="both" className="text-white">
                      Both（輸入和輸出）
                    </SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="text-white py-2">
                  {guardrail.presidioFilterScope || 'both'}
                </div>
              )}
            </div>

            {/* Presidio Run On */}
            <div className="space-y-2">
              <Label className="text-slate-300">執行位置（選填）</Label>
              {isEditMode ? (
                <Select
                  value={editPresidioRunOn || 'both'}
                  onValueChange={setEditPresidioRunOn}
                >
                  <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                    <SelectValue placeholder="選擇執行位置" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-600">
                    <SelectItem value="input" className="text-white">
                      Input（僅輸入）
                    </SelectItem>
                    <SelectItem value="output" className="text-white">
                      Output（僅輸出）
                    </SelectItem>
                    <SelectItem value="both" className="text-white">
                      Both（輸入和輸出）
                    </SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="text-white py-2">
                  {guardrail.presidioRunOn || 'both'}
                </div>
              )}
            </div>

            {/* Presidio Language */}
            <div className="space-y-2">
              <Label className="text-slate-300">語言設定（選填）</Label>
              {isEditMode ? (
                <Input
                  value={editPresidioLanguage}
                  onChange={(e) => setEditPresidioLanguage(e.target.value)}
                  className="bg-slate-900 border-slate-600 text-white"
                  placeholder="例如: en, zh, de"
                />
              ) : (
                <div className="text-white py-2">
                  {guardrail.presidioLanguage || 'en'}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {guardrail.provider === 'bedrock' && (
        <Card className="bg-slate-800/30 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-sm">Bedrock 設定</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Guardrail ID */}
            <div className="space-y-2">
              <Label className="text-slate-300">護欄識別碼</Label>
              {isEditMode ? (
                <Input
                  value={editBedrockGuardrailId}
                  onChange={(e) => setEditBedrockGuardrailId(e.target.value)}
                  className="bg-slate-900 border-slate-600 text-white font-mono"
                  placeholder="您在 Bedrock 上的護欄 ID"
                />
              ) : (
                <div className="text-white py-2 font-mono">
                  {guardrail.bedrockGuardrailId || '-'}
                </div>
              )}
            </div>

            {/* Guardrail Version */}
            <div className="space-y-2">
              <Label className="text-slate-300">護欄版本</Label>
              {isEditMode ? (
                <Input
                  value={editBedrockGuardrailVersion}
                  onChange={(e) =>
                    setEditBedrockGuardrailVersion(e.target.value)
                  }
                  className="bg-slate-900 border-slate-600 text-white"
                  placeholder="例如: 1, DRAFT"
                />
              ) : (
                <div className="text-white py-2">
                  {guardrail.bedrockGuardrailVersion || 'DRAFT'}
                </div>
              )}
            </div>

            {/* Disable Exception on Block */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-slate-300">停用阻擋時例外</Label>
                <p className="text-sm text-slate-500 mt-1">
                  啟用後，護欄被阻擋時不會拋出例外（適用於 OpenWebUI 等場景）
                </p>
              </div>
              {isEditMode ? (
                <Switch
                  checked={editBedrockDisableExceptionOnBlock}
                  onCheckedChange={setEditBedrockDisableExceptionOnBlock}
                />
              ) : (
                <span
                  className={`px-2 py-1 text-sm rounded ${
                    guardrail.bedrockDisableExceptionOnBlock
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {guardrail.bedrockDisableExceptionOnBlock ? '是' : '否'}
                </span>
              )}
            </div>

            {/* AWS Region */}
            <div className="space-y-2">
              <Label className="text-slate-300">AWS 區域</Label>
              {isEditMode ? (
                <Input
                  value={editBedrockAwsRegionName}
                  onChange={(e) => setEditBedrockAwsRegionName(e.target.value)}
                  className="bg-slate-900 border-slate-600 text-white"
                  placeholder="例如: us-east-1, ap-northeast-1"
                />
              ) : (
                <div className="text-white py-2">
                  {guardrail.bedrockAwsRegionName || '-'}
                </div>
              )}
            </div>

            {/* AWS Access Key ID */}
            <div className="space-y-2">
              <Label className="text-slate-300">AWS 存取金鑰 ID（選填）</Label>
              {isEditMode ? (
                <Input
                  value={editBedrockAwsAccessKeyId}
                  onChange={(e) => setEditBedrockAwsAccessKeyId(e.target.value)}
                  className="bg-slate-900 border-slate-600 text-white font-mono"
                  placeholder="AKIAIOSFODNN7EXAMPLE"
                />
              ) : (
                <div className="text-white py-2 font-mono">
                  {guardrail.bedrockAwsAccessKeyId ? '••••••••' : '-'}
                </div>
              )}
            </div>

            {/* AWS Secret Access Key */}
            <div className="space-y-2">
              <Label className="text-slate-300">AWS 秘密存取金鑰（選填）</Label>
              {isEditMode ? (
                <Input
                  type="password"
                  value={editBedrockAwsSecretAccessKey}
                  onChange={(e) =>
                    setEditBedrockAwsSecretAccessKey(e.target.value)
                  }
                  className="bg-slate-900 border-slate-600 text-white font-mono"
                  placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                />
              ) : (
                <div className="text-white py-2 font-mono">
                  {guardrail.bedrockAwsSecretAccessKey ? '••••••••' : '-'}
                </div>
              )}
            </div>

            {/* AWS Session Token */}
            <div className="space-y-2">
              <Label className="text-slate-300">AWS 工作階段權杖（選填）</Label>
              {isEditMode ? (
                <Input
                  type="password"
                  value={editBedrockAwsSessionToken}
                  onChange={(e) =>
                    setEditBedrockAwsSessionToken(e.target.value)
                  }
                  className="bg-slate-900 border-slate-600 text-white font-mono"
                  placeholder="臨時憑證的工作階段權杖"
                />
              ) : (
                <div className="text-white py-2 font-mono">
                  {guardrail.bedrockAwsSessionToken ? '••••••••' : '-'}
                </div>
              )}
            </div>

            {/* AWS Session Name */}
            <div className="space-y-2">
              <Label className="text-slate-300">AWS 工作階段名稱（選填）</Label>
              {isEditMode ? (
                <Input
                  value={editBedrockAwsSessionName}
                  onChange={(e) => setEditBedrockAwsSessionName(e.target.value)}
                  className="bg-slate-900 border-slate-600 text-white"
                  placeholder="AWS 工作階段名稱"
                />
              ) : (
                <div className="text-white py-2">
                  {guardrail.bedrockAwsSessionName || '-'}
                </div>
              )}
            </div>

            {/* AWS Profile Name */}
            <div className="space-y-2">
              <Label className="text-slate-300">AWS 設定檔名稱（選填）</Label>
              {isEditMode ? (
                <Input
                  value={editBedrockAwsProfileName}
                  onChange={(e) => setEditBedrockAwsProfileName(e.target.value)}
                  className="bg-slate-900 border-slate-600 text-white"
                  placeholder="例如: default, production"
                />
              ) : (
                <div className="text-white py-2">
                  {guardrail.bedrockAwsProfileName || '-'}
                </div>
              )}
            </div>

            {/* AWS Role Name */}
            <div className="space-y-2">
              <Label className="text-slate-300">AWS 角色名稱（選填）</Label>
              {isEditMode ? (
                <Input
                  value={editBedrockAwsRoleName}
                  onChange={(e) => setEditBedrockAwsRoleName(e.target.value)}
                  className="bg-slate-900 border-slate-600 text-white"
                  placeholder="用於角色假設的 IAM 角色名稱"
                />
              ) : (
                <div className="text-white py-2">
                  {guardrail.bedrockAwsRoleName || '-'}
                </div>
              )}
            </div>

            {/* AWS Web Identity Token */}
            <div className="space-y-2">
              <Label className="text-slate-300">AWS Web 身分權杖（選填）</Label>
              {isEditMode ? (
                <Input
                  type="password"
                  value={editBedrockAwsWebIdentityToken}
                  onChange={(e) =>
                    setEditBedrockAwsWebIdentityToken(e.target.value)
                  }
                  className="bg-slate-900 border-slate-600 text-white font-mono"
                  placeholder="用於 Web 身分角色假設的權杖"
                />
              ) : (
                <div className="text-white py-2 font-mono">
                  {guardrail.bedrockAwsWebIdentityToken ? '••••••••' : '-'}
                </div>
              )}
            </div>

            {/* AWS STS Endpoint */}
            <div className="space-y-2">
              <Label className="text-slate-300">AWS STS 端點（選填）</Label>
              {isEditMode ? (
                <Input
                  value={editBedrockAwsStsEndpoint}
                  onChange={(e) => setEditBedrockAwsStsEndpoint(e.target.value)}
                  className="bg-slate-900 border-slate-600 text-white font-mono"
                  placeholder="https://sts.amazonaws.com"
                />
              ) : (
                <div className="text-white py-2 font-mono">
                  {guardrail.bedrockAwsStsEndpoint || '-'}
                </div>
              )}
            </div>

            {/* AWS Bedrock Runtime Endpoint */}
            <div className="space-y-2">
              <Label className="text-slate-300">
                Bedrock 執行階段端點（選填）
              </Label>
              {isEditMode ? (
                <Input
                  value={editBedrockAwsBedrockRuntimeEndpoint}
                  onChange={(e) =>
                    setEditBedrockAwsBedrockRuntimeEndpoint(e.target.value)
                  }
                  className="bg-slate-900 border-slate-600 text-white font-mono"
                  placeholder="https://bedrock-runtime.us-east-1.amazonaws.com"
                />
              ) : (
                <div className="text-white py-2 font-mono">
                  {guardrail.bedrockAwsBedrockRuntimeEndpoint || '-'}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 危險區域 */}
      <Card className="bg-red-500/10 border-red-500/30">
        <CardHeader>
          <CardTitle className="text-red-400 text-sm">危險區域</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">刪除護欄</p>
              <p className="text-sm text-slate-400 mt-1">
                刪除後將無法復原，所有相關設定將被永久移除
              </p>
            </div>
            <Button variant="destructive" onClick={onDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              刪除
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
