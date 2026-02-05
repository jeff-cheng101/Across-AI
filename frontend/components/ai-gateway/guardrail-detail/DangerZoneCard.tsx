'use client';

/**
 * DangerZoneCard - 危險操作區域卡片組件
 *
 * 業務背景：提供護欄刪除功能，此操作不可復原，需要明確的警告提示。
 * 刪除確認對話框由父組件處理，此組件僅負責觸發刪除操作。
 *
 * 資料流：useGuardrailEdit → handleDelete → deleteMutation → API
 *
 * 依賴：
 * - GuardrailEditContext：提供 handleDelete 和 isDeleting 狀態
 * - 父組件：負責顯示刪除確認對話框
 *
 * 邊界條件：
 * - isDeleting 為 true 時，按鈕應禁用以防止重複提交
 * - 刪除操作會觸發路由跳轉，由 Context 處理
 */

import { Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGuardrailEdit } from '@/contexts/GuardrailEditContext';

/**
 * DangerZoneCard 組件
 *
 * 顯示危險操作區域，包含刪除護欄按鈕和警告文字
 */
export function DangerZoneCard() {
  const { setIsDeleteDialogOpen, isDeleting } = useGuardrailEdit();

  return (
    <Card className="bg-red-500/10 border-red-500/30">
      <CardHeader>
        <CardTitle className="text-red-400 text-sm">危險操作</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-red-400 text-sm">
            刪除護欄後，所有相關設定將永久移除，無法復原。
          </p>
        </div>
        <Button
          variant="destructive"
          onClick={() => setIsDeleteDialogOpen(true)}
          disabled={isDeleting}
          className="w-full sm:w-auto"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          {isDeleting ? '刪除中...' : '刪除護欄'}
        </Button>
      </CardContent>
    </Card>
  );
}
