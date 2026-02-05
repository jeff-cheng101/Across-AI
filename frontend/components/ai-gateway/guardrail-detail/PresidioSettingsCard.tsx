'use client';

/**
 * PresidioSettingsCard - Presidio 設定卡片組件
 *
 * 業務背景：顯示和編輯 Presidio PII 偵測護欄的設定，包含 PII 實體類型選擇、
 * 分析器/匿名化器 API 設定、過濾範圍、執行位置和語言設定。
 *
 * 資料流：透過 useGuardrailEdit 存取表單狀態，編輯模式時顯示輸入欄位，
 * 檢視模式時顯示設定值。
 *
 * 依賴：
 * - useGuardrailEdit：護欄編輯狀態管理
 * - services/guardrails：PII 類型和常數定義
 * - shadcn/ui 組件：UI 元素
 */

import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
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
import { Textarea } from '@/components/ui/textarea';
import { useGuardrailEdit } from '@/contexts/GuardrailEditContext';
import {
  PII_ACTION_DISPLAY_NAMES,
  PII_CATEGORIES,
  PII_TYPES,
} from '@/services/guardrails';

/**
 * PresidioSettingsCard 組件
 *
 * 顯示 Presidio 相關設定，支援編輯和檢視兩種模式
 */
export function PresidioSettingsCard() {
  const { isEditMode, formState, formActions } = useGuardrailEdit();

  // 根據類別篩選器過濾 PII 類型
  const filteredPiiTypes = useMemo(() => {
    if (formState.presidio.categoryFilter === 'all') {
      return PII_TYPES;
    }
    return PII_TYPES.filter(
      (pii) => pii.category === formState.presidio.categoryFilter,
    );
  }, [formState.presidio.categoryFilter]);

  // 已選擇的 PII 實體 ID 列表（從 piiEntitiesConfig 提取）
  const selectedPiiEntityIds = useMemo(() => {
    return Object.keys(formState.presidio.piiEntitiesConfig);
  }, [formState.presidio.piiEntitiesConfig]);

  // 快速選擇按鈕：全選/取消全選當前篩選的類型
  const handleQuickSelectAll = () => {
    const ids = filteredPiiTypes.map((pii) => pii.id);
    const currentConfig = { ...formState.presidio.piiEntitiesConfig };
    const defaultAction = formState.presidio.piiAction || 'mask';

    // 將所有篩選的類型加入設定
    ids.forEach((id) => {
      if (!currentConfig[id]) {
        currentConfig[id] = defaultAction;
      }
    });

    formActions.setPiiEntitiesConfig(currentConfig);
  };

  const handleQuickDeselectAll = () => {
    const ids = filteredPiiTypes.map((pii) => pii.id);
    const currentConfig = { ...formState.presidio.piiEntitiesConfig };

    // 移除所有篩選的類型
    ids.forEach((id) => {
      delete currentConfig[id];
    });

    formActions.setPiiEntitiesConfig(currentConfig);
  };

  // 切換單一 PII 實體的選擇狀態
  const handleTogglePiiEntity = (entityId: string) => {
    const currentConfig = { ...formState.presidio.piiEntitiesConfig };
    const defaultAction = formState.presidio.piiAction || 'mask';

    if (currentConfig[entityId]) {
      // 取消選擇：移除該實體
      delete currentConfig[entityId];
    } else {
      // 選擇：加入該實體，使用預設動作
      currentConfig[entityId] = defaultAction;
    }

    formActions.setPiiEntitiesConfig(currentConfig);
  };

  // 更新單一 PII 實體的動作
  const handleUpdatePiiEntityAction = (
    entityId: string,
    action: 'mask' | 'block',
  ) => {
    const currentConfig = { ...formState.presidio.piiEntitiesConfig };
    if (currentConfig[entityId]) {
      currentConfig[entityId] = action;
      formActions.setPiiEntitiesConfig(currentConfig);
    }
  };

  return (
    <Card className="bg-slate-800/30 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white text-sm flex items-center gap-2">
          Presidio 設定
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* PII 實體設定 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-slate-300">PII 實體類型設定</Label>
            {isEditMode && (
              <span className="text-sm text-slate-400">
                已選擇 {selectedPiiEntityIds.length} 個類型
              </span>
            )}
          </div>

          {isEditMode ? (
            <>
              {/* 類別篩選器 */}
              <div className="space-y-2">
                <Label className="text-slate-400 text-sm">類別篩選</Label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant={
                      formState.presidio.categoryFilter === 'all'
                        ? 'default'
                        : 'outline'
                    }
                    size="sm"
                    onClick={() => formActions.setCategoryFilter('all')}
                    className={
                      formState.presidio.categoryFilter === 'all'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700/50'
                    }
                  >
                    全部
                  </Button>
                  {PII_CATEGORIES.map((category) => (
                    <Button
                      key={category}
                      type="button"
                      variant={
                        formState.presidio.categoryFilter === category
                          ? 'default'
                          : 'outline'
                      }
                      size="sm"
                      onClick={() => formActions.setCategoryFilter(category)}
                      className={
                        formState.presidio.categoryFilter === category
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700/50'
                      }
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              {/* 快速選擇按鈕 */}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleQuickSelectAll}
                  className="bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700/50"
                >
                  全選當前類別
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleQuickDeselectAll}
                  className="bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700/50"
                >
                  取消全選當前類別
                </Button>
              </div>

              {/* PII 類型選擇列表 */}
              <div className="border border-slate-700 rounded-lg max-h-[300px] overflow-y-auto">
                <div className="grid grid-cols-[40px_1fr_120px_140px] bg-slate-800 text-slate-200 font-medium text-sm border-b border-slate-700 sticky top-0">
                  <div className="p-3">
                    <input
                      type="checkbox"
                      checked={
                        filteredPiiTypes.length > 0 &&
                        filteredPiiTypes.every((pii) =>
                          selectedPiiEntityIds.includes(pii.id),
                        )
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleQuickSelectAll();
                        } else {
                          handleQuickDeselectAll();
                        }
                      }}
                      className="w-4 h-4 rounded border-slate-600"
                    />
                  </div>
                  <div className="p-3">PII 類型</div>
                  <div className="p-3">類別</div>
                  <div className="p-3">動作</div>
                </div>
                <div className="divide-y divide-slate-700">
                  {filteredPiiTypes.map((piiType) => {
                    const isSelected = selectedPiiEntityIds.includes(
                      piiType.id,
                    );
                    const currentAction =
                      formState.presidio.piiEntitiesConfig[piiType.id] ||
                      formState.presidio.piiAction ||
                      'mask';

                    return (
                      <div
                        key={piiType.id}
                        className="grid grid-cols-[40px_1fr_120px_140px] items-center hover:bg-slate-800/30"
                      >
                        <div className="p-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleTogglePiiEntity(piiType.id)}
                            className="w-4 h-4 rounded border-slate-600"
                          />
                        </div>
                        <div className="p-3 text-slate-200">{piiType.name}</div>
                        <div className="p-3">
                          <span className="inline-block px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30">
                            {piiType.category}
                          </span>
                        </div>
                        <div className="p-3">
                          {isSelected ? (
                            <Select
                              value={currentAction}
                              onValueChange={(value: 'mask' | 'block') =>
                                handleUpdatePiiEntityAction(piiType.id, value)
                              }
                            >
                              <SelectTrigger className="h-8 bg-slate-800/50 border-slate-700 text-white text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="mask">
                                  {PII_ACTION_DISPLAY_NAMES.mask}
                                </SelectItem>
                                <SelectItem value="block">
                                  {PII_ACTION_DISPLAY_NAMES.block}
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <span className="text-slate-500 text-xs">-</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            /* 檢視模式：顯示已選擇的 PII 實體 */
            <div>
              {selectedPiiEntityIds.length > 0 ? (
                <div className="border border-slate-700 rounded-lg overflow-hidden">
                  <div className="grid grid-cols-[1fr_100px_140px] bg-slate-800/50 text-slate-200 font-semibold text-sm border-b border-slate-700">
                    <div className="p-3">PII 類型</div>
                    <div className="p-3">類別</div>
                    <div className="p-3">動作</div>
                  </div>
                  <div className="divide-y divide-slate-700 max-h-[300px] overflow-y-auto">
                    {selectedPiiEntityIds.map((entityId) => {
                      const piiType = PII_TYPES.find((t) => t.id === entityId);
                      const action =
                        formState.presidio.piiEntitiesConfig[entityId] ||
                        formState.presidio.piiAction ||
                        'mask';

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
                    })}
                  </div>
                </div>
              ) : (
                <span className="text-slate-400">未設定 PII 防護項目</span>
              )}
            </div>
          )}
        </div>

        {/* 輸出解析提示詞 */}
        <div className="space-y-2">
          <Label className="text-slate-300">輸出解析提示詞</Label>
          {isEditMode ? (
            <Textarea
              value={formState.presidio.outputParsePrompt}
              onChange={(e) => formActions.setOutputParsePrompt(e.target.value)}
              placeholder="自訂解析提示詞（選填）"
              className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 min-h-[80px]"
            />
          ) : (
            <div className="p-3 bg-slate-800/50 border border-slate-700 rounded-md text-slate-200 min-h-[80px]">
              {formState.presidio.outputParsePrompt || (
                <span className="text-slate-500">未設定</span>
              )}
            </div>
          )}
        </div>

        {/* Presidio 分析器 API Base */}
        <div className="space-y-2">
          <Label className="text-slate-300">Presidio 分析器 API URL</Label>
          {isEditMode ? (
            <Input
              value={formState.presidio.presidioAnalyzerApiBase}
              onChange={(e) =>
                formActions.setPresidioAnalyzerApiBase(e.target.value)
              }
              placeholder="http://localhost:5001（選填）"
              className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
            />
          ) : (
            <div className="p-3 bg-slate-800/50 border border-slate-700 rounded-md text-slate-200 font-mono text-sm">
              {formState.presidio.presidioAnalyzerApiBase || (
                <span className="text-slate-500">未設定</span>
              )}
            </div>
          )}
        </div>

        {/* Presidio 匿名化器 API Base */}
        <div className="space-y-2">
          <Label className="text-slate-300">Presidio 匿名化器 API URL</Label>
          {isEditMode ? (
            <Input
              value={formState.presidio.presidioAnonymizerApiBase}
              onChange={(e) =>
                formActions.setPresidioAnonymizerApiBase(e.target.value)
              }
              placeholder="http://localhost:5002（選填）"
              className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
            />
          ) : (
            <div className="p-3 bg-slate-800/50 border border-slate-700 rounded-md text-slate-200 font-mono text-sm">
              {formState.presidio.presidioAnonymizerApiBase || (
                <span className="text-slate-500">未設定</span>
              )}
            </div>
          )}
        </div>

        {/* 過濾範圍 */}
        <div className="space-y-2">
          <Label className="text-slate-300">過濾範圍</Label>
          {isEditMode ? (
            <Input
              value={formState.presidio.presidioFilterScope}
              onChange={(e) =>
                formActions.setPresidioFilterScope(e.target.value)
              }
              placeholder="例如：input、output、both（選填）"
              className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
            />
          ) : (
            <div className="p-3 bg-slate-800/50 border border-slate-700 rounded-md text-slate-200">
              {formState.presidio.presidioFilterScope || (
                <span className="text-slate-500">未設定</span>
              )}
            </div>
          )}
        </div>

        {/* 執行位置 */}
        <div className="space-y-2">
          <Label className="text-slate-300">執行位置</Label>
          {isEditMode ? (
            <Input
              value={formState.presidio.presidioRunOn}
              onChange={(e) => formActions.setPresidioRunOn(e.target.value)}
              placeholder="例如：input、output、both（選填）"
              className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
            />
          ) : (
            <div className="p-3 bg-slate-800/50 border border-slate-700 rounded-md text-slate-200">
              {formState.presidio.presidioRunOn || (
                <span className="text-slate-500">未設定</span>
              )}
            </div>
          )}
        </div>

        {/* 語言設定 */}
        <div className="space-y-2">
          <Label className="text-slate-300">語言</Label>
          {isEditMode ? (
            <Input
              value={formState.presidio.presidioLanguage}
              onChange={(e) => formActions.setPresidioLanguage(e.target.value)}
              placeholder="例如：en、zh、ja（選填，預設：en）"
              className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
            />
          ) : (
            <div className="p-3 bg-slate-800/50 border border-slate-700 rounded-md text-slate-200">
              {formState.presidio.presidioLanguage || (
                <span className="text-slate-500">未設定（預設：en）</span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
