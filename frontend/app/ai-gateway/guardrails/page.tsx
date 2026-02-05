'use client';

/**
 * 安全護欄列表頁
 *
 * 業務背景：顯示所有已設定的 AI Gateway 安全護欄規則。
 * 提供護欄的列表、新增、刪除和測試功能。
 *
 * 資料流：頁面 → SecuritySection → React Query → services/guardrails → LiteLLM
 */
import { SecuritySection } from '@/components/ai-gateway/SecuritySection';

export default function GuardrailsPage() {
  return (
    <div className="max-w-[1600px] mx-auto">
      <SecuritySection />
    </div>
  );
}
