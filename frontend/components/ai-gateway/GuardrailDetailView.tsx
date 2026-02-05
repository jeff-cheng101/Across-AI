'use client';

/**
 * 安全護欄詳情視圖組件
 *
 * 業務背景：顯示單一護欄規則的詳細設定，包含總覽和設定兩個分頁。
 * 支援編輯模式切換，可修改護欄名稱、預設啟用狀態及各 Provider 專屬設定。
 *
 * 資料流：透過 GuardrailEditContext 管理狀態，子組件透過 useGuardrailEdit 存取。
 *
 * 依賴：
 * - contexts/GuardrailEditContext：狀態管理
 * - guardrail-detail 子組件：各功能區塊
 * - @tanstack/react-query：資料獲取（由 Context 處理）
 * - shadcn/ui 組件：UI 元素
 */

import {
  AlertCircle,
  ArrowLeft,
  Copy,
  Edit,
  Info,
  Settings,
  Shield,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

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
import { Skeleton } from '@/components/ui/skeleton';
import {
  GuardrailEditProvider,
  useGuardrailEdit,
} from '@/contexts/GuardrailEditContext';
import {
  MODE_DISPLAY_NAMES,
  PII_ACTION_DISPLAY_NAMES,
  PII_TYPES,
  PROVIDER_DISPLAY_NAMES,
} from '@/services/guardrails';

import {
  BasicSettingsCard,
  BedrockSettingsCard,
  DangerZoneCard,
  PresidioSettingsCard,
} from './guardrail-detail';

// ===== 類型定義 =====

type GuardrailDetailViewProps = {
  guardrailId: string;
};

// ===== 主組件 =====

export function GuardrailDetailView({ guardrailId }: GuardrailDetailViewProps) {
  return (
    <GuardrailEditProvider guardrailId={guardrailId}>
      <GuardrailDetailContent />
    </GuardrailEditProvider>
  );
}

// ===== 內容組件（使用 Context）=====

function GuardrailDetailContent() {
  const router = useRouter();
  const {
    guardrail,
    isLoading,
    error,
    isEditMode,
    setIsEditMode,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    activeTab,
    setActiveTab,
    handleSaveEdit,
    handleCancelEdit,
    handleDelete,
    handleCopyId,
    isSaving,
    isDeleting,
  } = useGuardrailEdit();

  // 載入狀態
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // 錯誤狀態
  if (error) {
    return (
      <ErrorState
        error={error}
        onBack={() => router.push('/ai-gateway/guardrails')}
      />
    );
  }

  // 無資料狀態
  if (!guardrail) {
    return (
      <ErrorState
        error={new Error('找不到護欄資料')}
        onBack={() => router.push('/ai-gateway/guardrails')}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* 標題列 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/ai-gateway/guardrails')}
            className="text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回列表
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {guardrail.guardrailName}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-slate-400">
                {PROVIDER_DISPLAY_NAMES[guardrail.provider] ||
                  guardrail.provider}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-sm text-slate-400">
                {MODE_DISPLAY_NAMES[guardrail.mode] || guardrail.mode}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyId}
                className="text-slate-500 hover:text-white h-6 px-2"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-sm ${
            guardrail.defaultOn
              ? 'bg-green-500/20 text-green-400'
              : 'bg-slate-700 text-slate-300'
          }`}
        >
          {guardrail.defaultOn ? '已啟用' : '已停用'}
        </div>
      </div>

      {/* 分頁選擇 */}
      <div className="flex gap-2 border-b border-slate-700">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'overview'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
          type="button"
        >
          <Info className="w-4 h-4" />
          總覽
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'settings'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
          type="button"
        >
          <Settings className="w-4 h-4" />
          設定
        </button>
      </div>

      {/* 分頁內容 */}
      {activeTab === 'overview' ? (
        <OverviewTab />
      ) : (
        <SettingsTab
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
          isSaving={isSaving}
        />
      )}

      {/* 刪除確認對話框 */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">確認刪除護欄</DialogTitle>
            <DialogDescription className="text-slate-400">
              確定要刪除「{guardrail.guardrailName}」嗎？此操作無法復原。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? '刪除中...' : '確認刪除'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ===== 總覽分頁 =====

function OverviewTab() {
  const { guardrail } = useGuardrailEdit();

  if (!guardrail) return null;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* 基本資訊卡片 */}
      <Card className="bg-slate-800/30 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white text-sm flex items-center gap-2">
            <Shield className="w-4 h-4" />
            基本資訊
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-slate-700">
            <span className="text-slate-400">護欄 ID</span>
            <span className="text-white font-mono text-sm">
              {guardrail.guardrailId}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-slate-700">
            <span className="text-slate-400">護欄名稱</span>
            <span className="text-white">{guardrail.guardrailName}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-slate-700">
            <span className="text-slate-400">提供者</span>
            <span className="text-white">
              {PROVIDER_DISPLAY_NAMES[guardrail.provider] || guardrail.provider}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-slate-700">
            <span className="text-slate-400">執行模式</span>
            <span className="text-white">
              {MODE_DISPLAY_NAMES[guardrail.mode] || guardrail.mode}
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-slate-400">預設啟用</span>
            <span
              className={`px-2 py-1 text-sm rounded ${
                guardrail.defaultOn
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-slate-700 text-slate-300'
              }`}
            >
              {guardrail.defaultOn ? '是' : '否'}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Presidio 設定 */}
      {guardrail.provider === 'presidio' && (
        <Card className="bg-slate-800/30 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-sm">
              Presidio PII 設定
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

// ===== 設定分頁 =====

type SettingsTabProps = {
  isEditMode: boolean;
  setIsEditMode: (value: boolean) => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
};

function SettingsTab({
  isEditMode,
  setIsEditMode,
  onSave,
  onCancel,
  isSaving,
}: SettingsTabProps) {
  const { guardrail } = useGuardrailEdit();

  if (!guardrail) return null;

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
            <Button variant="outline" onClick={onCancel} disabled={isSaving}>
              取消
            </Button>
            <Button onClick={onSave} disabled={isSaving}>
              {isSaving ? '儲存中...' : '儲存'}
            </Button>
          </div>
        )}
      </div>

      {/* 基本設定卡片 */}
      <BasicSettingsCard />

      {/* Provider 專屬設定 */}
      {guardrail.provider === 'presidio' && <PresidioSettingsCard />}
      {guardrail.provider === 'bedrock' && <BedrockSettingsCard />}

      {/* 危險區域 */}
      <DangerZoneCard />
    </div>
  );
}

// ===== 載入骨架 =====

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-24 bg-slate-700" />
        <div>
          <Skeleton className="h-8 w-64 bg-slate-700" />
          <Skeleton className="h-4 w-48 mt-2 bg-slate-700" />
        </div>
      </div>
      <div className="flex gap-2 border-b border-slate-700 pb-2">
        <Skeleton className="h-10 w-20 bg-slate-700" />
        <Skeleton className="h-10 w-20 bg-slate-700" />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-64 bg-slate-700 rounded-lg" />
        <Skeleton className="h-64 bg-slate-700 rounded-lg" />
      </div>
    </div>
  );
}

// ===== 錯誤狀態 =====

type ErrorStateProps = {
  error: Error;
  onBack: () => void;
};

function ErrorState({ error, onBack }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <AlertCircle className="w-16 h-16 text-red-500" />
      <h2 className="text-xl font-semibold text-white">載入失敗</h2>
      <p className="text-slate-400 text-center max-w-md">
        {error.message || '無法載入護欄資料，請稍後再試。'}
      </p>
      <Button onClick={onBack}>返回護欄列表</Button>
    </div>
  );
}
