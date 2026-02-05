'use client';

/**
 * BedrockSettingsCard - AWS Bedrock 設定卡片組件
 *
 * 業務背景：顯示和編輯 AWS Bedrock Guardrail 的設定，包含護欄 ID、版本、AWS 認證資訊等。
 * 此組件從 GuardrailEditContext 獲取狀態，支援編輯模式和檢視模式的切換。
 *
 * 資料流：useGuardrailEdit → formState.bedrock/formActions → UI 顯示/編輯
 *
 * 依賴：
 * - GuardrailEditContext：提供表單狀態和操作
 * - shadcn/ui 組件：UI 元素
 *
 * 邊界條件：
 * - 敏感資訊（如 secret access key）在檢視模式下以遮罩顯示
 * - 所有 AWS 認證欄位為選填，可根據實際需求選擇認證方式
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useGuardrailEdit } from '@/contexts/GuardrailEditContext';

/**
 * BedrockSettingsCard 組件
 *
 * 顯示 AWS Bedrock Guardrail 的設定，支援編輯和檢視兩種模式
 */
export function BedrockSettingsCard() {
  const { formState, formActions, isEditMode } = useGuardrailEdit();

  // 從表單狀態獲取 Bedrock 設定值
  const bedrockGuardrailId = formState.bedrock.bedrockGuardrailId;
  const bedrockGuardrailVersion = formState.bedrock.bedrockGuardrailVersion;
  const bedrockDisableExceptionOnBlock =
    formState.bedrock.bedrockDisableExceptionOnBlock;
  const bedrockAwsRegionName = formState.bedrock.bedrockAwsRegionName;
  const bedrockAwsAccessKeyId = formState.bedrock.bedrockAwsAccessKeyId;
  const bedrockAwsSecretAccessKey = formState.bedrock.bedrockAwsSecretAccessKey;
  const bedrockAwsSessionToken = formState.bedrock.bedrockAwsSessionToken;
  const bedrockAwsSessionName = formState.bedrock.bedrockAwsSessionName;
  const bedrockAwsProfileName = formState.bedrock.bedrockAwsProfileName;
  const bedrockAwsRoleName = formState.bedrock.bedrockAwsRoleName;
  const bedrockAwsWebIdentityToken =
    formState.bedrock.bedrockAwsWebIdentityToken;
  const bedrockAwsStsEndpoint = formState.bedrock.bedrockAwsStsEndpoint;
  const bedrockAwsBedrockRuntimeEndpoint =
    formState.bedrock.bedrockAwsBedrockRuntimeEndpoint;

  /**
   * 遮罩敏感資訊（用於檢視模式）
   */
  const maskSensitiveValue = (value: string): string => {
    if (!value) return '未設定';
    if (value.length <= 4) return '****';
    return `${value.slice(0, 4)}${'*'.repeat(value.length - 4)}`;
  };

  return (
    <Card className="bg-slate-800/30 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white text-sm">AWS Bedrock 設定</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 護欄 ID */}
        <div className="space-y-2">
          <Label className="text-slate-300">Bedrock Guardrail ID</Label>
          {isEditMode ? (
            <Input
              value={bedrockGuardrailId}
              onChange={(e) =>
                formActions.setBedrockGuardrailId(e.target.value)
              }
              className="bg-slate-900 border-slate-600 text-white"
              placeholder="輸入 Bedrock Guardrail ID"
            />
          ) : (
            <div className="text-white py-2">
              {bedrockGuardrailId || '未設定'}
            </div>
          )}
        </div>

        {/* 護欄版本 */}
        <div className="space-y-2">
          <Label className="text-slate-300">Bedrock Guardrail 版本</Label>
          {isEditMode ? (
            <Input
              value={bedrockGuardrailVersion}
              onChange={(e) =>
                formActions.setBedrockGuardrailVersion(e.target.value)
              }
              className="bg-slate-900 border-slate-600 text-white"
              placeholder="輸入版本號（例如：DRAFT、1）"
            />
          ) : (
            <div className="text-white py-2">
              {bedrockGuardrailVersion || '未設定'}
            </div>
          )}
        </div>

        {/* 停用例外處理 */}
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-slate-300">停用例外處理</Label>
            <p className="text-sm text-slate-500 mt-1">
              當護欄阻擋請求時，是否停用例外處理
            </p>
          </div>
          {isEditMode ? (
            <Switch
              checked={bedrockDisableExceptionOnBlock}
              onCheckedChange={formActions.setBedrockDisableException}
            />
          ) : (
            <span
              className={`px-2 py-1 text-sm rounded ${
                bedrockDisableExceptionOnBlock
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-slate-700 text-slate-300'
              }`}
            >
              {bedrockDisableExceptionOnBlock ? '是' : '否'}
            </span>
          )}
        </div>

        {/* AWS 區域 */}
        <div className="space-y-2">
          <Label className="text-slate-300">AWS 區域</Label>
          {isEditMode ? (
            <Input
              value={bedrockAwsRegionName}
              onChange={(e) => formActions.setBedrockAwsRegion(e.target.value)}
              className="bg-slate-900 border-slate-600 text-white"
              placeholder="例如：us-east-1"
            />
          ) : (
            <div className="text-white py-2">
              {bedrockAwsRegionName || '未設定'}
            </div>
          )}
        </div>

        {/* Access Key ID */}
        <div className="space-y-2">
          <Label className="text-slate-300">AWS Access Key ID</Label>
          {isEditMode ? (
            <Input
              value={bedrockAwsAccessKeyId}
              onChange={(e) =>
                formActions.setBedrockAwsAccessKeyId(e.target.value)
              }
              className="bg-slate-900 border-slate-600 text-white"
              placeholder="輸入 AWS Access Key ID"
            />
          ) : (
            <div className="text-white py-2">
              {bedrockAwsAccessKeyId
                ? maskSensitiveValue(bedrockAwsAccessKeyId)
                : '未設定'}
            </div>
          )}
        </div>

        {/* Secret Access Key */}
        <div className="space-y-2">
          <Label className="text-slate-300">AWS Secret Access Key</Label>
          {isEditMode ? (
            <Input
              type="password"
              value={bedrockAwsSecretAccessKey}
              onChange={(e) =>
                formActions.setBedrockAwsSecretAccessKey(e.target.value)
              }
              className="bg-slate-900 border-slate-600 text-white"
              placeholder="輸入 AWS Secret Access Key"
            />
          ) : (
            <div className="text-white py-2">
              {bedrockAwsSecretAccessKey
                ? maskSensitiveValue(bedrockAwsSecretAccessKey)
                : '未設定'}
            </div>
          )}
        </div>

        {/* Session Token */}
        <div className="space-y-2">
          <Label className="text-slate-300">AWS Session Token</Label>
          {isEditMode ? (
            <Input
              type="password"
              value={bedrockAwsSessionToken}
              onChange={(e) =>
                formActions.setBedrockAwsSessionToken(e.target.value)
              }
              className="bg-slate-900 border-slate-600 text-white"
              placeholder="輸入 AWS Session Token（選填）"
            />
          ) : (
            <div className="text-white py-2">
              {bedrockAwsSessionToken
                ? maskSensitiveValue(bedrockAwsSessionToken)
                : '未設定'}
            </div>
          )}
        </div>

        {/* Session Name */}
        <div className="space-y-2">
          <Label className="text-slate-300">AWS Session Name</Label>
          {isEditMode ? (
            <Input
              value={bedrockAwsSessionName}
              onChange={(e) =>
                formActions.setBedrockAwsSessionName(e.target.value)
              }
              className="bg-slate-900 border-slate-600 text-white"
              placeholder="輸入 Session Name（選填）"
            />
          ) : (
            <div className="text-white py-2">
              {bedrockAwsSessionName || '未設定'}
            </div>
          )}
        </div>

        {/* Profile Name */}
        <div className="space-y-2">
          <Label className="text-slate-300">AWS Profile Name</Label>
          {isEditMode ? (
            <Input
              value={bedrockAwsProfileName}
              onChange={(e) =>
                formActions.setBedrockAwsProfileName(e.target.value)
              }
              className="bg-slate-900 border-slate-600 text-white"
              placeholder="輸入 AWS Profile Name（選填）"
            />
          ) : (
            <div className="text-white py-2">
              {bedrockAwsProfileName || '未設定'}
            </div>
          )}
        </div>

        {/* Role Name */}
        <div className="space-y-2">
          <Label className="text-slate-300">AWS Role Name</Label>
          {isEditMode ? (
            <Input
              value={bedrockAwsRoleName}
              onChange={(e) =>
                formActions.setBedrockAwsRoleName(e.target.value)
              }
              className="bg-slate-900 border-slate-600 text-white"
              placeholder="輸入 AWS Role Name（選填）"
            />
          ) : (
            <div className="text-white py-2">
              {bedrockAwsRoleName || '未設定'}
            </div>
          )}
        </div>

        {/* Web Identity Token */}
        <div className="space-y-2">
          <Label className="text-slate-300">AWS Web Identity Token</Label>
          {isEditMode ? (
            <Input
              type="password"
              value={bedrockAwsWebIdentityToken}
              onChange={(e) =>
                formActions.setBedrockAwsWebIdentityToken(e.target.value)
              }
              className="bg-slate-900 border-slate-600 text-white"
              placeholder="輸入 Web Identity Token（選填）"
            />
          ) : (
            <div className="text-white py-2">
              {bedrockAwsWebIdentityToken
                ? maskSensitiveValue(bedrockAwsWebIdentityToken)
                : '未設定'}
            </div>
          )}
        </div>

        {/* STS Endpoint */}
        <div className="space-y-2">
          <Label className="text-slate-300">AWS STS Endpoint</Label>
          {isEditMode ? (
            <Input
              value={bedrockAwsStsEndpoint}
              onChange={(e) =>
                formActions.setBedrockAwsStsEndpoint(e.target.value)
              }
              className="bg-slate-900 border-slate-600 text-white"
              placeholder="輸入 STS Endpoint URL（選填）"
            />
          ) : (
            <div className="text-white py-2">
              {bedrockAwsStsEndpoint || '未設定'}
            </div>
          )}
        </div>

        {/* Runtime Endpoint */}
        <div className="space-y-2">
          <Label className="text-slate-300">Bedrock Runtime Endpoint</Label>
          {isEditMode ? (
            <Input
              value={bedrockAwsBedrockRuntimeEndpoint}
              onChange={(e) =>
                formActions.setBedrockAwsRuntimeEndpoint(e.target.value)
              }
              className="bg-slate-900 border-slate-600 text-white"
              placeholder="輸入 Bedrock Runtime Endpoint URL（選填）"
            />
          ) : (
            <div className="text-white py-2">
              {bedrockAwsBedrockRuntimeEndpoint || '未設定'}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
