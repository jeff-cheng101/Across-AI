import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Chat - ACROSS',
  description: '與 AI 助手進行對話',
};

export default function AIChat() {
  return (
    <div className="min-h-screen bg-[#08131D] flex items-center justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">AI Chat</h1>
          <p className="text-lg text-slate-400">AI 對話功能正在開發中...</p>
        </div>
      </div>
    </div>
  );
}
