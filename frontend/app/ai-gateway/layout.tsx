import { Sidebar } from '@/components/ai-gateway/Sidebar';

/**
 * AI Gateway 共用佈局
 *
 * 業務背景：AI Gateway 所有子頁面共享的佈局，包含側邊導航列。
 * 使用 Next.js App Router 的 Layout 機制，確保 Sidebar 在頁面切換時不會重新渲染。
 */
export default function AIGatewayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#08131D]">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
