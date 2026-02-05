'use client';

/**
 * BasicSettingsCard - 基本設定卡片組件
 *
 * 業務背景：顯示和編輯護欄的基本設定，包含名稱、預設啟用狀態、執行模式和提供者。
 * 此組件從 GuardrailEditContext 獲取狀態，支援編輯模式和檢視模式的切換。
 *
 * 資料流：useGuardrailEdit → formState/formActions → UI 顯示/編輯
 *
 * 依賴：
 * - GuardrailEditContext：提供表單狀態和操作
 * - services/guardrails：提供常數和顯示名稱映射
 * - shadcn/ui 組件：UI 元素
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useGuardrailEdit } from '@/contexts/GuardrailEditContext';
import {
  GUARDRAIL_MODES,
  MODE_DISPLAY_NAMES,
  PROVIDER_DISPLAY_NAMES,
} from '@/services/guardrails';

/**
 * BasicSettingsCard 組件
 *
 * 顯示護欄的基本設定，支援編輯和檢視兩種模式
 */
export function BasicSettingsCard() {
  const { formState, formActions, isEditMode, guardrail } = useGuardrailEdit();

  // 從表單狀態獲取基本設定值
  const name = formState.basic.name;
  const defaultOn = formState.basic.defaultOn;
  const currentMode = formState.basic.modes[0] || 'pre_call';
  const provider = guardrail?.provider || '';

  return (
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
              value={name}
              onChange={(e) => formActions.setName(e.target.value)}
              className="bg-slate-900 border-slate-600 text-white"
              placeholder="輸入護欄名稱"
            />
          ) : (
            <div className="text-white py-2">
              {guardrail?.guardrailName || name}
            </div>
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
              checked={defaultOn}
              onCheckedChange={formActions.setDefaultOn}
            />
          ) : (
            <span
              className={`px-2 py-1 text-sm rounded ${
                defaultOn
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-slate-700 text-slate-300'
              }`}
            >
              {defaultOn ? '是' : '否'}
            </span>
          )}
        </div>

        {/* 執行模式 */}
        <div className="space-y-2">
          <Label className="text-slate-300">執行模式</Label>
          {isEditMode ? (
            <Select
              value={currentMode}
              onValueChange={(value) => formActions.setModes([value])}
            >
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
              {MODE_DISPLAY_NAMES[currentMode] || currentMode}
            </div>
          )}
        </div>

        {/* Provider（只讀） */}
        <div className="space-y-2">
          <Label className="text-slate-300">提供者</Label>
          <div className="text-white py-2 flex items-center gap-2">
            {provider ? PROVIDER_DISPLAY_NAMES[provider] || provider : '未設定'}
            <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">
              不可變更
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
