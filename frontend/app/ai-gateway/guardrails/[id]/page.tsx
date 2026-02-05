'use client';

import { useParams } from 'next/navigation';
import { GuardrailDetailView } from '@/components/ai-gateway/GuardrailDetailView';

/**
 * 安全護欄詳情頁
 *
 * 業務背景：顯示單一護欄規則的詳細設定與執行狀態。
 * 整合 GuardrailDetailView 組件，提供完整的護欄管理功能。
 *
 * 資料流：從 URL 參數獲取 guardrailId，傳入 GuardrailDetailView 進行資料獲取和渲染。
 */
export default function GuardrailDetailPage() {
  const params = useParams();
  const guardrailId = params.id as string;

  return (
    <div className="max-w-[1600px] mx-auto">
      <GuardrailDetailView guardrailId={guardrailId} />
    </div>
  );
}
