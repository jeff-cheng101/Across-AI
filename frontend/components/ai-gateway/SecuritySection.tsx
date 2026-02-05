'use client';

/**
 * SecuritySection - 安全護欄管理主組件
 *
 * 業務背景：整合 LiteLLM Guardrails 功能，提供 AI 內容安全護欄的列表、新增、刪除和測試功能。
 *
 * 功能：
 * - Tab 切換：安全護欄列表 / 測試區
 * - 表格列表：顯示所有護欄，支援排序
 * - 新增對話框：兩步驟表單（基本資訊 + Provider 設定）
 * - 刪除確認對話框
 * - 測試區（Playground）：選擇單一護欄並測試文字
 *
 * 資料流：組件 → React Query → services/guardrails → Next.js API → LiteLLM
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AlertTriangle,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  FlaskConical,
  HelpCircle,
  Plus,
  Search,
  Trash2,
  X as XIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { useGuardrailForm } from '@/hooks/useGuardrailForm';
import {
  createGuardrail,
  deleteGuardrail,
  fetchGuardrails,
  GUARDRAIL_PROVIDERS,
  type Guardrail,
  guardrailKeys,
  isValidPiiAction,
  MODE_OPTIONS,
  PII_CATEGORIES,
  PII_TYPES,
  PROVIDER_LABELS,
  type TestGuardrailsOutput,
  testGuardrails,
} from '@/services/guardrails';

// ===== 類型定義 =====

type SortField =
  | 'guardrailId'
  | 'guardrailName'
  | 'provider'
  | 'mode'
  | 'defaultOn'
  | 'createdAt';
type SortOrder = 'asc' | 'desc';
type ActiveTab = 'guardrails' | 'playground';

// ===== 組件實作 =====

export function SecuritySection() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // 使用自訂 hook 管理表單狀態
  const {
    state: formState,
    actions: formActions,
    validation,
    buildCreateInput,
  } = useGuardrailForm();

  // Tab 狀態
  const [activeTab, setActiveTab] = useState<ActiveTab>('guardrails');

  // 排序狀態
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // 新增對話框狀態
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // 刪除對話框狀態
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [guardrailToDelete, setGuardrailToDelete] = useState<Guardrail | null>(
    null,
  );

  // 測試區狀態 - 支援複選多個 guardrail
  const [selectedTestGuardrails, setSelectedTestGuardrails] = useState<
    Set<string>
  >(new Set());
  const [playgroundSearchQuery, setPlaygroundSearchQuery] = useState('');
  const [testInputText, setTestInputText] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  // 測試結果：每個 guardrail 獨立的結果
  const [testResults, setTestResults] = useState<
    Array<{ guardrailName: string; result: TestGuardrailsOutput }>
  >([]);

  // ===== API 查詢 =====

  const {
    data: guardrails = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: guardrailKeys.lists(),
    queryFn: fetchGuardrails,
  });

  // ===== Mutations =====

  const createMutation = useMutation({
    mutationFn: createGuardrail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: guardrailKeys.lists() });
      toast({ title: '護欄已新增', description: '安全護欄已成功建立' });
      handleCloseAddDialog();
    },
    onError: (error: Error) => {
      toast({
        title: '新增失敗',
        description: error.message || '建立安全護欄時發生錯誤',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteGuardrail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: guardrailKeys.lists() });
      toast({ title: '護欄已刪除', description: '安全護欄已成功移除' });
      setIsDeleteDialogOpen(false);
      setGuardrailToDelete(null);
    },
    onError: (error: Error) => {
      toast({
        title: '刪除失敗',
        description: error.message || '刪除安全護欄時發生錯誤',
        variant: 'destructive',
      });
    },
  });

  // ===== 排序邏輯 =====

  const sortedGuardrails = useMemo(() => {
    const sorted = [...guardrails].sort((a, b) => {
      let aValue: string | boolean | undefined;
      let bValue: string | boolean | undefined;

      switch (sortField) {
        case 'guardrailId':
          aValue = a.guardrailId;
          bValue = b.guardrailId;
          break;
        case 'guardrailName':
          aValue = a.guardrailName;
          bValue = b.guardrailName;
          break;
        case 'provider':
          aValue = a.provider;
          bValue = b.provider;
          break;
        case 'mode':
          aValue = a.mode;
          bValue = b.mode;
          break;
        case 'defaultOn':
          aValue = a.defaultOn;
          bValue = b.defaultOn;
          break;
        case 'createdAt':
          aValue = a.createdAt;
          bValue = b.createdAt;
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
        return sortOrder === 'asc'
          ? Number(aValue) - Number(bValue)
          : Number(bValue) - Number(aValue);
      }

      const aStr = String(aValue ?? '');
      const bStr = String(bValue ?? '');
      return sortOrder === 'asc'
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });

    return sorted;
  }, [guardrails, sortField, sortOrder]);

  // ===== 事件處理 =====

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  }

  function handleCloseAddDialog() {
    setIsAddDialogOpen(false);
    formActions.resetForm();
  }

  function handleCreateGuardrail() {
    const input = buildCreateInput();
    if (!input) {
      toast({
        title: '請填寫必要欄位',
        description: '護欄名稱、提供者和模式為必填項目',
        variant: 'destructive',
      });
      return;
    }
    createMutation.mutate(input);
  }

  function handleDeleteClick(guardrail: Guardrail) {
    setGuardrailToDelete(guardrail);
    setIsDeleteDialogOpen(true);
  }

  function handleConfirmDelete() {
    if (guardrailToDelete) {
      deleteMutation.mutate(guardrailToDelete.guardrailId);
    }
  }

  async function handleTest() {
    if (selectedTestGuardrails.size === 0) {
      toast({
        title: '請選擇護欄',
        description: '請先從左側選擇要測試的護欄規則',
        variant: 'destructive',
      });
      return;
    }

    if (!testInputText.trim()) {
      toast({
        title: '請輸入測試文字',
        description: '請在測試區輸入要檢測的文字',
        variant: 'destructive',
      });
      return;
    }

    // 清空之前的結果
    setTestResults([]);
    setIsTesting(true);

    // 並行測試所有選中的 guardrail
    const results: Array<{ guardrailName: string; result: TestGuardrailsOutput }> = [];

    await Promise.all(
      Array.from(selectedTestGuardrails).map(async (guardrailId) => {
        const guardrail = guardrails.find((g) => g.guardrailId === guardrailId);
        if (!guardrail) return;

        try {
          const result = await testGuardrails({
            guardrailName: guardrail.guardrailName,
            text: testInputText,
            isUserMessage: true,
          });
          results.push({
            guardrailName: guardrail.guardrailName,
            result,
          });
        } catch (error) {
          // 網路錯誤等
          results.push({
            guardrailName: guardrail.guardrailName,
            result: {
              success: false,
              passed: false,
              error: error instanceof Error ? error.message : '測試時發生錯誤',
            },
          });
        }
      }),
    );

    setTestResults(results);
    setIsTesting(false);
  }

  function handleSelectTestGuardrail(guardrailId: string) {
    setSelectedTestGuardrails((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(guardrailId)) {
        newSet.delete(guardrailId);
      } else {
        newSet.add(guardrailId);
      }
      return newSet;
    });
    setTestResults([]); // 切換護欄時清除結果
  }

  // ===== 子組件 =====

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? (
      <ChevronUp className="inline w-4 h-4" />
    ) : (
      <ChevronDown className="inline w-4 h-4" />
    );
  }

  function LoadingSkeleton() {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-40 bg-slate-700" />
        <div className="border border-slate-700 rounded-lg overflow-hidden">
          <div className="bg-slate-800/50 p-4">
            <Skeleton className="h-6 w-full bg-slate-700" />
          </div>
          {['a', 'b', 'c', 'd', 'e'].map((id) => (
            <div
              key={`skeleton-row-${id}`}
              className="p-4 border-t border-slate-700"
            >
              <Skeleton className="h-6 w-full bg-slate-700" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ===== PII 類型篩選 =====

  const filteredPiiTypes = useMemo(() => {
    if (formState.presidio.categoryFilter === 'all') return PII_TYPES;
    return PII_TYPES.filter(
      (pii) => pii.category === formState.presidio.categoryFilter,
    );
  }, [formState.presidio.categoryFilter]);

  // ===== 測試區護欄篩選 =====

  const filteredTestGuardrails = useMemo(() => {
    if (!playgroundSearchQuery) return guardrails;
    const query = playgroundSearchQuery.toLowerCase();
    return guardrails.filter(
      (g) =>
        g.guardrailName.toLowerCase().includes(query) ||
        g.provider.toLowerCase().includes(query),
    );
  }, [guardrails, playgroundSearchQuery]);

  // ===== 渲染 =====

  if (error) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">載入失敗</h3>
          <p className="text-slate-400">無法載入安全護欄列表，請稍後重試</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-6 border-b border-slate-700">
        <button
          type="button"
          onClick={() => setActiveTab('guardrails')}
          className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
            activeTab === 'guardrails'
              ? 'text-blue-500'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          安全護欄
          {activeTab === 'guardrails' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('playground')}
          className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
            activeTab === 'playground'
              ? 'text-blue-500'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          測試區
          {activeTab === 'playground' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
          )}
        </button>
      </div>

      {/* Content */}
      {activeTab === 'guardrails' ? (
        isLoading ? (
          <LoadingSkeleton />
        ) : (
          <div className="space-y-6">
            {/* Add Button */}
            <div>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setIsAddDialogOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                新增護欄規則
              </Button>
            </div>

            {/* Table */}
            <div className="border border-slate-700 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/50">
                    <TableHead
                      className="cursor-pointer font-medium text-slate-200 whitespace-nowrap"
                      onClick={() => handleSort('guardrailId')}
                    >
                      護欄規則 ID <SortIcon field="guardrailId" />
                    </TableHead>
                    <TableHead
                      className="cursor-pointer font-medium text-slate-200 whitespace-nowrap"
                      onClick={() => handleSort('guardrailName')}
                    >
                      名稱 <SortIcon field="guardrailName" />
                    </TableHead>
                    <TableHead
                      className="cursor-pointer font-medium text-slate-200 whitespace-nowrap"
                      onClick={() => handleSort('provider')}
                    >
                      提供者 <SortIcon field="provider" />
                    </TableHead>
                    <TableHead
                      className="cursor-pointer font-medium text-slate-200 whitespace-nowrap"
                      onClick={() => handleSort('mode')}
                    >
                      模式 <SortIcon field="mode" />
                    </TableHead>
                    <TableHead
                      className="cursor-pointer font-medium text-slate-200 whitespace-nowrap"
                      onClick={() => handleSort('defaultOn')}
                    >
                      預設啟用 <SortIcon field="defaultOn" />
                    </TableHead>
                    <TableHead
                      className="cursor-pointer font-medium text-slate-200 whitespace-nowrap"
                      onClick={() => handleSort('createdAt')}
                    >
                      創建時間 <SortIcon field="createdAt" />
                    </TableHead>
                    <TableHead className="font-medium text-slate-200 whitespace-nowrap">
                      操作
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedGuardrails.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center text-slate-400 py-12"
                      >
                        未找到防護規則
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedGuardrails.map((guardrail) => (
                      <TableRow
                        key={guardrail.guardrailId}
                        className="border-slate-700 hover:bg-slate-800/30"
                      >
                        <TableCell className="text-slate-300">
                          <button
                            type="button"
                            onClick={() =>
                              router.push(
                                `/ai-gateway/guardrails/${guardrail.guardrailId}`,
                              )
                            }
                            className="text-blue-400 hover:text-blue-300 hover:underline font-mono text-sm"
                          >
                            {guardrail.guardrailId}
                          </button>
                        </TableCell>
                        <TableCell className="text-slate-300">
                          {guardrail.guardrailName}
                        </TableCell>
                        <TableCell className="text-slate-300">
                          {PROVIDER_LABELS[guardrail.provider] ||
                            guardrail.provider}
                        </TableCell>
                        <TableCell className="text-slate-300">
                          {guardrail.mode}
                        </TableCell>
                        <TableCell className="text-slate-300">
                          {guardrail.defaultOn ? '是' : '否'}
                        </TableCell>
                        <TableCell className="text-slate-300">
                          {guardrail.createdAt
                            ? new Date(guardrail.createdAt).toLocaleString(
                                'zh-TW',
                              )
                            : '-'}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-slate-400 hover:text-red-400"
                            onClick={() => handleDeleteClick(guardrail)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )
      ) : (
        /* Playground Tab - 改為單選 */
        <div className="flex gap-6 h-[calc(100vh-280px)] min-h-[500px]">
          {/* Left Sidebar - Guardrails List */}
          <div className="w-80 flex-shrink-0 border border-slate-700 rounded-lg bg-slate-800/30 flex flex-col">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-slate-700">
              <h3 className="text-lg font-medium text-white mb-3">護欄規則</h3>
              <p className="text-xs text-slate-400 mb-3">
                選擇一個護欄規則進行測試
              </p>

              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  value={playgroundSearchQuery}
                  onChange={(e) => setPlaygroundSearchQuery(e.target.value)}
                  placeholder="搜尋護欄規則..."
                  className="pl-9 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Guardrails List - 改為單選樣式 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {isLoading ? (
                ['a', 'b', 'c'].map((id) => (
                  <Skeleton
                    key={`skeleton-guardrail-${id}`}
                    className="h-20 w-full bg-slate-700"
                  />
                ))
              ) : filteredTestGuardrails.length === 0 ? (
                <div className="text-center text-slate-400 py-8">
                  未找到護欄規則
                </div>
              ) : (
                filteredTestGuardrails.map((guardrail) => {
                  const isSelected = selectedTestGuardrails.has(
                    guardrail.guardrailId,
                  );
                  return (
                    <button
                      key={guardrail.guardrailId}
                      type="button"
                      className={`w-full flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer text-left ${
                        isSelected
                          ? 'bg-blue-600/20 border border-blue-500/50'
                          : 'hover:bg-slate-700/30 border border-transparent'
                      }`}
                      onClick={() =>
                        handleSelectTestGuardrail(guardrail.guardrailId)
                      }
                    >
                      {/* Checkbox indicator */}
                      <div
                        className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                          isSelected
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-slate-500'
                        }`}
                      >
                        {isSelected && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <FlaskConical className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <span className="font-medium text-white text-sm">
                            {guardrail.guardrailName}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 space-y-0.5">
                          <div>
                            類型：
                            {PROVIDER_LABELS[guardrail.provider] ||
                              guardrail.provider}
                          </div>
                          <div>模式：{guardrail.mode}</div>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-700">
              <div className="text-sm text-slate-400">
                {selectedTestGuardrails.size > 0
                  ? `已選擇 ${selectedTestGuardrails.size} 個護欄`
                  : '請選擇護欄'}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 border border-slate-700 rounded-lg bg-slate-800/30 flex flex-col">
            {/* Content Header */}
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-white">
                  安全護欄測試區
                </h2>
                {selectedTestGuardrails.size > 0 && (
                  <Button
                    onClick={handleTest}
                    disabled={!testInputText.trim() || isTesting}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                  >
                    {isTesting ? (
                      `測試中 (${selectedTestGuardrails.size})...`
                    ) : (
                      <>
                        <FlaskConical className="w-4 h-4 mr-2" />
                        測試 {selectedTestGuardrails.size} 個護欄
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* Test Interface */}
            {selectedTestGuardrails.size === 0 ? (
              <div className="flex-1 flex items-center justify-center p-12">
                <div className="text-center max-w-md">
                  <div className="mb-4 flex justify-center">
                    <FlaskConical
                      className="w-16 h-16 text-slate-600"
                      strokeWidth={1.5}
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    選擇要測試的護欄規則
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    從左側邊欄選擇一個護欄規則以開始測試。
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 p-6 flex flex-col gap-6 overflow-auto">
                {/* Selected Guardrail Display */}
                <div>
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="text-slate-300 font-medium">
                      測試護欄規則：
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(selectedTestGuardrails).map((guardrailId) => {
                        const guardrail = guardrails.find(
                          (g) => g.guardrailId === guardrailId,
                        );
                        return guardrail ? (
                          <span
                            key={guardrailId}
                            className="px-3 py-1 bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded text-sm"
                          >
                            {guardrail.guardrailName}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                  <p className="text-slate-500 text-sm">
                    輸入文字以測試護欄規則的效果
                  </p>
                </div>

                {/* Input Text Area */}
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-slate-300 font-medium">
                      輸入文字
                    </Label>
                    {testInputText && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          navigator.clipboard.writeText(testInputText)
                        }
                        className="text-slate-400 hover:text-white hover:bg-slate-700 h-8 px-3"
                      >
                        <Copy className="w-4 h-4 mr-1.5" />
                        複製
                      </Button>
                    )}
                  </div>

                  <textarea
                    value={testInputText}
                    onChange={(e) => setTestInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (testInputText.trim() && !isTesting) {
                          handleTest();
                        }
                      }
                    }}
                    placeholder="輸入要測試的文字..."
                    className="flex-1 min-h-[200px] p-4 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
                  />

                  <div className="flex items-center justify-between mt-2">
                    <p className="text-slate-500 text-xs">
                      按{' '}
                      <kbd className="px-1.5 py-0.5 bg-slate-700 border border-slate-600 rounded text-xs">
                        Enter
                      </kbd>{' '}
                      送出，{' '}
                      <kbd className="px-1.5 py-0.5 bg-slate-700 border border-slate-600 rounded text-xs">
                        Shift+Enter
                      </kbd>{' '}
                      換行
                    </p>
                    <span className="text-slate-500 text-xs">
                      字元數：{testInputText.length}
                    </span>
                  </div>
                </div>

                {/* Test Results */}
                {testResults.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-slate-300">
                      測試結果
                    </h4>

                    {testResults.map(({ guardrailName, result }) => (
                      <div key={guardrailName}>
                        {/* 成功結果卡片（綠色） */}
                        {result.passed ? (
                          <div className="rounded-lg border border-green-700/50 bg-green-900/20 p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <svg
                                  className="w-5 h-5 text-green-400"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  aria-hidden="true"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span className="text-sm font-medium text-green-300">
                                  {guardrailName} - 通過
                                </span>
                              </div>
                              {result.duration && (
                                <span className="text-xs text-slate-400">
                                  {result.duration}ms
                                </span>
                              )}
                            </div>

                            {/* 處理後文字 */}
                            {result.processedText && (
                              <div className="bg-slate-900/50 border border-green-700/30 rounded p-3">
                                <span className="text-xs font-medium text-slate-400 mb-2 block">
                                  輸出文字
                                  {result.wasModified && (
                                    <span className="ml-2 text-yellow-400">
                                      （已修改）
                                    </span>
                                  )}
                                </span>
                                <div className="font-mono text-sm text-slate-200 whitespace-pre-wrap break-words">
                                  {result.processedText}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          /* 錯誤結果卡片（紅色） */
                          <div className="rounded-lg border border-red-700/50 bg-red-900/20 p-4">
                            <div className="flex items-start gap-3">
                              <svg
                                className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                aria-hidden="true"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium text-red-300">
                                    {guardrailName} - 未通過
                                  </span>
                                  {result.duration && (
                                    <span className="text-xs text-slate-400">
                                      {result.duration}ms
                                    </span>
                                  )}
                                </div>
                                {result.error && (
                                  <p className="text-sm text-red-200/80 break-words">
                                    {result.error}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Guardrail Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="!flex max-w-2xl bg-slate-900 border-slate-700 text-white max-h-[90vh] flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-xl font-medium text-white">
              新增防護規則
            </DialogTitle>
          </DialogHeader>

          {/* Step Indicators */}
          <div className="flex-shrink-0 flex items-center gap-6 pb-4 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  formState.ui.currentStep === 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-400'
                }`}
              >
                1
              </div>
              <span
                className={`font-medium ${
                  formState.ui.currentStep === 1
                    ? 'text-white'
                    : 'text-slate-400'
                }`}
              >
                基本資訊
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  formState.ui.currentStep === 2
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-400'
                }`}
              >
                2
              </div>
              <span
                className={`font-medium ${
                  formState.ui.currentStep === 2
                    ? 'text-white'
                    : 'text-slate-400'
                }`}
              >
                {formState.basic.provider === 'presidio'
                  ? 'PII 設定'
                  : formState.basic.provider === 'bedrock'
                    ? 'Bedrock 設定'
                    : '提供者設定'}
              </span>
            </div>
          </div>

          {formState.ui.currentStep === 1 ? (
            <div className="flex-1 min-h-[400px] overflow-y-auto space-y-6 py-4 pr-4">
              {/* Guardrail Name */}
              <div className="grid grid-cols-[180px_1fr] gap-6 items-start">
                <div className="flex items-center gap-2 pt-2">
                  <Label className="text-slate-300">
                    <span className="text-red-500 mr-1">*</span>
                    防護規則名稱：
                  </Label>
                </div>
                <Input
                  value={formState.basic.name}
                  onChange={(e) => formActions.setName(e.target.value)}
                  placeholder="輸入此防護規則的名稱"
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>

              {/* Provider */}
              <div className="grid grid-cols-[180px_1fr] gap-6 items-start">
                <div className="flex items-center gap-2 pt-2">
                  <Label className="text-slate-300">
                    <span className="text-red-500 mr-1">*</span>
                    防護規則提供者：
                  </Label>
                </div>
                <Select
                  value={formState.basic.provider}
                  onValueChange={formActions.setProvider}
                >
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                    <SelectValue placeholder="選擇防護規則提供者" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {GUARDRAIL_PROVIDERS.map((provider) => (
                      <SelectItem
                        key={provider}
                        value={provider}
                        className="text-slate-200"
                      >
                        {PROVIDER_LABELS[provider] || provider}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Mode */}
              <div className="grid grid-cols-[180px_1fr] gap-6 items-start">
                <div className="flex items-center gap-2 pt-2">
                  <Label className="text-slate-300">
                    <span className="text-red-500 mr-1">*</span>
                    模式：
                  </Label>
                  <TooltipProvider>
                    <Tooltip delayDuration={200}>
                      <TooltipTrigger asChild>
                        <HelpCircle className="w-4 h-4 text-slate-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent
                        className="max-w-sm z-[9999] bg-slate-800 border-slate-700 text-white p-3"
                        side="right"
                        sideOffset={10}
                      >
                        <p className="text-xs leading-relaxed">
                          選擇防護規則的執行模式
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="space-y-2 relative">
                  {/* Selected Modes Display */}
                  <button
                    type="button"
                    onClick={formActions.toggleModeDropdown}
                    className="w-full flex flex-wrap items-center gap-2 p-3 border border-slate-700 rounded-md bg-slate-800/50 min-h-[44px] hover:border-slate-600 transition-colors"
                  >
                    {formState.basic.modes.length === 0 ? (
                      <span className="text-slate-400 text-sm">選擇模式</span>
                    ) : (
                      formState.basic.modes.map((m) => (
                        <span
                          key={m}
                          className="inline-flex items-center gap-1 bg-slate-700 text-white px-2 py-1 rounded text-sm"
                        >
                          {m}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              formActions.toggleMode(m);
                            }}
                            className="hover:text-red-400"
                          >
                            <XIcon className="w-3 h-3" />
                          </button>
                        </span>
                      ))
                    )}
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 ml-auto transition-transform ${
                        formState.ui.isModeDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Mode Options */}
                  {formState.ui.isModeDropdownOpen && (
                    <div className="border border-slate-700 rounded-md bg-slate-800 divide-y divide-slate-700 max-h-80 overflow-y-auto absolute z-50 w-full">
                      {MODE_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => formActions.toggleMode(option.value)}
                          className="w-full text-left p-3 hover:bg-slate-700/30 transition-colors flex items-start justify-between gap-3"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-white text-sm">
                                {option.label}
                              </span>
                              {option.badge && (
                                <span className="text-xs px-2 py-0.5 rounded bg-green-600/20 text-green-400 border border-green-600/30">
                                  {option.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">
                              {option.description}
                            </p>
                          </div>
                          {formState.basic.modes.includes(option.value) && (
                            <Check className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Default On */}
              <div className="grid grid-cols-[180px_1fr] gap-6 items-start">
                <div className="flex items-center gap-2 pt-2">
                  <Label className="text-slate-300">預設啟用：</Label>
                </div>
                <Select
                  value={formState.basic.defaultOn ? 'yes' : 'no'}
                  onValueChange={(v) => formActions.setDefaultOn(v === 'yes')}
                >
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="yes" className="text-slate-200">
                      是
                    </SelectItem>
                    <SelectItem value="no" className="text-slate-200">
                      否
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            /* Step 2: Provider-specific Configuration */
            <div className="flex-1 min-h-[400px] overflow-y-auto space-y-4 py-4 pr-4">
              {/* Presidio PII Configuration */}
              {formState.basic.provider === 'presidio' && (
                <>
                  {/* PII Action */}
                  <div className="grid grid-cols-[180px_1fr] gap-6 items-start">
                    <div className="flex items-center gap-2 pt-2">
                      <Label className="text-slate-300">PII 處理動作：</Label>
                    </div>
                    <Select
                      value={formState.presidio.piiAction}
                      onValueChange={(v) => {
                        if (isValidPiiAction(v)) {
                          formActions.setPiiAction(v);
                        }
                      }}
                    >
                      <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="mask" className="text-slate-200">
                          遮蔽
                        </SelectItem>
                        <SelectItem value="block" className="text-slate-200">
                          阻擋
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Category Filter */}
                  <div className="grid grid-cols-[180px_1fr] gap-6 items-start">
                    <div className="flex items-center gap-2 pt-2">
                      <Label className="text-slate-300">依類別篩選：</Label>
                    </div>
                    <Select
                      value={formState.presidio.categoryFilter}
                      onValueChange={formActions.setCategoryFilter}
                    >
                      <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                        <SelectValue placeholder="選擇類別以進行篩選" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="all" className="text-slate-200">
                          全部
                        </SelectItem>
                        {PII_CATEGORIES.map((category) => (
                          <SelectItem
                            key={category}
                            value={category}
                            className="text-slate-200"
                          >
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* PII Types Selection */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-slate-300">
                        選擇 PII 實體類型：
                      </Label>
                      <span className="text-sm text-slate-400">
                        已選擇 {formState.presidio.piiEntities.length} 個項目
                      </span>
                    </div>
                    <div className="border border-slate-700 rounded-lg max-h-[300px] overflow-y-auto">
                      <div className="grid grid-cols-[40px_1fr_120px] bg-slate-800 text-slate-200 font-medium text-sm border-b border-slate-700 sticky top-0">
                        <div className="p-3">
                          <input
                            type="checkbox"
                            checked={
                              filteredPiiTypes.length > 0 &&
                              filteredPiiTypes.every((pii) =>
                                formState.presidio.piiEntities.includes(pii.id),
                              )
                            }
                            onChange={(e) => {
                              const ids = filteredPiiTypes.map((pii) => pii.id);
                              if (e.target.checked) {
                                formActions.selectAllPiiEntities(ids);
                              } else {
                                formActions.deselectAllPiiEntities(ids);
                              }
                            }}
                            className="w-4 h-4 rounded border-slate-600"
                          />
                        </div>
                        <div className="p-3">PII 類型</div>
                        <div className="p-3">類別</div>
                      </div>
                      <div className="divide-y divide-slate-700">
                        {filteredPiiTypes.map((piiType) => (
                          <div
                            key={piiType.id}
                            className="grid grid-cols-[40px_1fr_120px] items-center hover:bg-slate-800/30"
                          >
                            <div className="p-3">
                              <input
                                type="checkbox"
                                checked={formState.presidio.piiEntities.includes(
                                  piiType.id,
                                )}
                                onChange={() =>
                                  formActions.togglePiiEntity(piiType.id)
                                }
                                className="w-4 h-4 rounded border-slate-600"
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
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 進階設定 */}
                  <div className="border-t border-slate-700 pt-4 mt-4">
                    <div className="text-sm font-medium text-slate-400 mb-4">
                      進階設定（選填）
                    </div>

                    {/* Output Parse Prompt */}
                    <div className="grid grid-cols-[180px_1fr] gap-6 items-start mb-4">
                      <div className="flex items-center gap-2 pt-2">
                        <Label className="text-slate-300">
                          輸出解析提示詞（選填）：
                        </Label>
                      </div>
                      <Input
                        value={formState.presidio.outputParsePrompt}
                        onChange={(e) =>
                          formActions.setOutputParsePrompt(e.target.value)
                        }
                        placeholder="自訂解析提示詞"
                        className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                      />
                    </div>

                    {/* Presidio Analyzer API Base */}
                    <div className="grid grid-cols-[180px_1fr] gap-6 items-start mb-4">
                      <div className="flex items-center gap-2 pt-2">
                        <Label className="text-slate-300">
                          Presidio 分析器 API URL（選填）：
                        </Label>
                      </div>
                      <Input
                        value={formState.presidio.presidioAnalyzerApiBase}
                        onChange={(e) =>
                          formActions.setPresidioAnalyzerApiBase(e.target.value)
                        }
                        placeholder="http://localhost:5001"
                        className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                      />
                    </div>

                    {/* Presidio Anonymizer API Base */}
                    <div className="grid grid-cols-[180px_1fr] gap-6 items-start mb-4">
                      <div className="flex items-center gap-2 pt-2">
                        <Label className="text-slate-300">
                          Presidio 匿名化器 API URL（選填）：
                        </Label>
                      </div>
                      <Input
                        value={formState.presidio.presidioAnonymizerApiBase}
                        onChange={(e) =>
                          formActions.setPresidioAnonymizerApiBase(
                            e.target.value,
                          )
                        }
                        placeholder="http://localhost:5002"
                        className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                      />
                    </div>

                    {/* Filter Scope */}
                    <div className="grid grid-cols-[180px_1fr] gap-6 items-start mb-4">
                      <div className="flex items-center gap-2 pt-2">
                        <Label className="text-slate-300">
                          過濾範圍（選填）：
                        </Label>
                      </div>
                      <Input
                        value={formState.presidio.presidioFilterScope}
                        onChange={(e) =>
                          formActions.setPresidioFilterScope(e.target.value)
                        }
                        placeholder="例如：input、output、all"
                        className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                      />
                    </div>

                    {/* Run On */}
                    <div className="grid grid-cols-[180px_1fr] gap-6 items-start mb-4">
                      <div className="flex items-center gap-2 pt-2">
                        <Label className="text-slate-300">
                          執行位置（選填）：
                        </Label>
                      </div>
                      <Input
                        value={formState.presidio.presidioRunOn}
                        onChange={(e) =>
                          formActions.setPresidioRunOn(e.target.value)
                        }
                        placeholder="例如：input、output、all"
                        className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                      />
                    </div>

                    {/* Language */}
                    <div className="grid grid-cols-[180px_1fr] gap-6 items-start">
                      <div className="flex items-center gap-2 pt-2">
                        <Label className="text-slate-300">
                          語言設定（選填）：
                        </Label>
                      </div>
                      <Input
                        value={formState.presidio.presidioLanguage}
                        onChange={(e) =>
                          formActions.setPresidioLanguage(e.target.value)
                        }
                        placeholder="例如：en、zh"
                        className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Bedrock Configuration */}
              {formState.basic.provider === 'bedrock' && (
                <>
                  <div className="grid grid-cols-[180px_1fr] gap-6 items-start">
                    <div className="flex items-center gap-2 pt-2">
                      <Label className="text-slate-300">護欄識別碼：</Label>
                    </div>
                    <Input
                      value={formState.bedrock.bedrockGuardrailId}
                      onChange={(e) =>
                        formActions.setBedrockGuardrailId(e.target.value)
                      }
                      placeholder="您在 Bedrock 上的護欄 ID"
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-[180px_1fr] gap-6 items-start">
                    <div className="flex items-center gap-2 pt-2">
                      <Label className="text-slate-300">護欄版本：</Label>
                    </div>
                    <Input
                      value={formState.bedrock.bedrockGuardrailVersion}
                      onChange={(e) =>
                        formActions.setBedrockGuardrailVersion(e.target.value)
                      }
                      placeholder="您的 Bedrock 護欄版本"
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-[180px_1fr] gap-6 items-start">
                    <div className="flex items-center gap-2 pt-2">
                      <Label className="text-slate-300">停用阻擋時例外：</Label>
                    </div>
                    <Select
                      value={
                        formState.bedrock.bedrockDisableExceptionOnBlock ? 'yes' : 'no'
                      }
                      onValueChange={(v) =>
                        formActions.setBedrockDisableException(v === 'yes')
                      }
                    >
                      <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="no" className="text-slate-200">
                          否
                        </SelectItem>
                        <SelectItem value="yes" className="text-slate-200">
                          是
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-[180px_1fr] gap-6 items-start">
                    <div className="flex items-center gap-2 pt-2">
                      <Label className="text-slate-300">AWS 區域：</Label>
                    </div>
                    <Input
                      value={formState.bedrock.bedrockAwsRegionName}
                      onChange={(e) =>
                        formActions.setBedrockAwsRegion(e.target.value)
                      }
                      placeholder="例如: us-east-1, ap-northeast-1"
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-[180px_1fr] gap-6 items-start">
                    <div className="flex items-center gap-2 pt-2">
                      <Label className="text-slate-300">
                        AWS 存取金鑰 ID：
                      </Label>
                    </div>
                    <Input
                      value={formState.bedrock.bedrockAwsAccessKeyId}
                      onChange={(e) =>
                        formActions.setBedrockAwsAccessKeyId(e.target.value)
                      }
                      placeholder="AKIAIOSFODNN7EXAMPLE"
                      className="bg-slate-800/50 border-slate-700 text-white font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-[180px_1fr] gap-6 items-start">
                    <div className="flex items-center gap-2 pt-2">
                      <Label className="text-slate-300">
                        AWS 秘密存取金鑰：
                      </Label>
                    </div>
                    <Input
                      type="password"
                      value={formState.bedrock.bedrockAwsSecretAccessKey}
                      onChange={(e) =>
                        formActions.setBedrockAwsSecretAccessKey(e.target.value)
                      }
                      placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                      className="bg-slate-800/50 border-slate-700 text-white font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-[180px_1fr] gap-6 items-start">
                    <div className="flex items-center gap-2 pt-2">
                      <Label className="text-slate-300">
                        AWS 工作階段權杖：
                      </Label>
                    </div>
                    <Input
                      value={formState.bedrock.bedrockAwsSessionToken}
                      onChange={(e) =>
                        formActions.setBedrockAwsSessionToken(e.target.value)
                      }
                      placeholder="臨時憑證的工作階段權杖"
                      className="bg-slate-800/50 border-slate-700 text-white font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-[180px_1fr] gap-6 items-start">
                    <div className="flex items-center gap-2 pt-2">
                      <Label className="text-slate-300">
                        AWS 工作階段名稱：
                      </Label>
                    </div>
                    <Input
                      value={formState.bedrock.bedrockAwsSessionName}
                      onChange={(e) =>
                        formActions.setBedrockAwsSessionName(e.target.value)
                      }
                      placeholder="AWS 工作階段的名稱"
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-[180px_1fr] gap-6 items-start">
                    <div className="flex items-center gap-2 pt-2">
                      <Label className="text-slate-300">
                        AWS 設定檔名稱：
                      </Label>
                    </div>
                    <Input
                      value={formState.bedrock.bedrockAwsProfileName}
                      onChange={(e) =>
                        formActions.setBedrockAwsProfileName(e.target.value)
                      }
                      placeholder="用於憑證檢索的設定檔名稱"
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-[180px_1fr] gap-6 items-start">
                    <div className="flex items-center gap-2 pt-2">
                      <Label className="text-slate-300">AWS 角色名稱：</Label>
                    </div>
                    <Input
                      value={formState.bedrock.bedrockAwsRoleName}
                      onChange={(e) =>
                        formActions.setBedrockAwsRoleName(e.target.value)
                      }
                      placeholder="用於角色切換的角色名稱"
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-[180px_1fr] gap-6 items-start">
                    <div className="flex items-center gap-2 pt-2">
                      <Label className="text-slate-300">
                        AWS Web 身分權杖：
                      </Label>
                    </div>
                    <Input
                      value={formState.bedrock.bedrockAwsWebIdentityToken}
                      onChange={(e) =>
                        formActions.setBedrockAwsWebIdentityToken(e.target.value)
                      }
                      placeholder="用於角色切換的 Web 身分權杖"
                      className="bg-slate-800/50 border-slate-700 text-white font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-[180px_1fr] gap-6 items-start">
                    <div className="flex items-center gap-2 pt-2">
                      <Label className="text-slate-300">AWS STS 端點：</Label>
                    </div>
                    <Input
                      value={formState.bedrock.bedrockAwsStsEndpoint}
                      onChange={(e) =>
                        formActions.setBedrockAwsStsEndpoint(e.target.value)
                      }
                      placeholder="AWS STS 端點 URL"
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-[180px_1fr] gap-6 items-start">
                    <div className="flex items-center gap-2 pt-2">
                      <Label className="text-slate-300">
                        Bedrock 執行階段端點：
                      </Label>
                    </div>
                    <Input
                      value={formState.bedrock.bedrockAwsBedrockRuntimeEndpoint}
                      onChange={(e) =>
                        formActions.setBedrockAwsRuntimeEndpoint(e.target.value)
                      }
                      placeholder="Bedrock 執行階段端點 URL"
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                </>
              )}

            </div>
          )}

          {/* Dialog Footer */}
          <DialogFooter className="flex-shrink-0 gap-3 pt-4 border-t border-slate-700">
            {formState.ui.currentStep === 2 && (
              <Button
                variant="outline"
                onClick={() => formActions.setCurrentStep(1)}
                className="bg-transparent hover:bg-slate-800 text-slate-300 border-slate-600"
              >
                上一步
              </Button>
            )}
            <Button
              variant="outline"
              onClick={handleCloseAddDialog}
              className="bg-transparent hover:bg-slate-800 text-slate-300 border-slate-600"
            >
              取消
            </Button>
            {formState.ui.currentStep === 1 ? (
              <Button
                onClick={() => formActions.setCurrentStep(2)}
                disabled={!validation.isBasicValid}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                下一步
              </Button>
            ) : (
              <Button
                onClick={handleCreateGuardrail}
                disabled={createMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {createMutation.isPending ? '建立中...' : '建立防護規則'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md bg-slate-900 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-medium text-white">
              確認刪除
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-slate-300">
              確定要刪除防護規則「
              <span className="text-white font-medium">
                {guardrailToDelete?.guardrailName}
              </span>
              」嗎？此操作無法復原。
            </p>
          </div>
          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setGuardrailToDelete(null);
              }}
              className="bg-transparent hover:bg-slate-800 text-slate-300 border-slate-600"
            >
              取消
            </Button>
            <Button
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleteMutation.isPending ? '刪除中...' : '確認刪除'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
