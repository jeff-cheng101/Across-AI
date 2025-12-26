'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Bot, Workflow } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

export default function AgentSelectPage() {
  const router = useRouter();
  const params = useParams();
  const llm = params.llm as string;

  const handleSelect = (type: 'workflow' | 'ai-agent') => {
    if (type === 'workflow') {
      router.push('/dify');
    } else {
      // 如果有 llm 參數，導航到對應的 AI Agent 頁面
      if (llm) {
        router.push(`/agent/${llm}/ai-agent`);
      } else {
        router.push('/aiagent');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#45A4C0]/10 border border-[#45A4C0]/20 mb-6"
          >
            <div className="w-2 h-2 rounded-full bg-[#45A4C0] animate-pulse"></div>
            <span className="text-sm text-[#45A4C0]">智能運維平台</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
          >
            請選擇服務類型
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            選擇您需要的智能服務模式
          </motion.p>
        </div>

        {/* Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Workflow Card */}
          <motion.button
            onClick={() => handleSelect('workflow')}
            className="relative group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#45A4C0]/20 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Card */}
            <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-12 text-center overflow-hidden group-hover:border-[#45A4C0]/50 transition-all duration-300 h-full">
              {/* Background Gradient */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#45A4C0]/5 rounded-full blur-3xl"></div>

              {/* Content */}
              <div className="relative z-10">
                {/* Icon Container */}
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-[#45A4C0]/10 border border-[#45A4C0]/20 mb-8 text-[#45A4C0] group-hover:bg-[#45A4C0]/20 transition-colors duration-300 mx-auto">
                  <Workflow className="w-12 h-12" />
                </div>

                {/* Title */}
                <h2 className="text-3xl mb-4 text-white">Workflow</h2>

                {/* Description */}
                <p className="text-gray-400 leading-relaxed mb-8">
                  傳統工作流程管理
                  <br />
                  適用於標準化作業流程
                </p>

                {/* Hover Arrow */}
                <div className="flex items-center justify-center gap-2 text-[#45A4C0] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>進入 Workflow</span>
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 1.5,
                    }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.span>
                </div>
              </div>
            </div>
          </motion.button>

          {/* AI Agent Card */}
          <motion.button
            onClick={() => handleSelect('ai-agent')}
            className="relative group"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-l from-[#45A4C0]/20 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Card */}
            <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-12 text-center overflow-hidden group-hover:border-[#45A4C0]/50 transition-all duration-300 h-full">
              {/* Background Gradient */}
              <div className="absolute top-0 left-0 w-48 h-48 bg-[#45A4C0]/5 rounded-full blur-3xl"></div>

              {/* AI Badge */}
              <div className="absolute top-6 right-6">
                <div className="px-3 py-1 rounded-full bg-[#45A4C0]/20 border border-[#45A4C0]/30">
                  <span className="text-xs text-[#45A4C0]">AI Powered</span>
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                {/* Icon Container */}
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-[#45A4C0]/10 border border-[#45A4C0]/20 mb-8 text-[#45A4C0] group-hover:bg-[#45A4C0]/20 transition-colors duration-300 mx-auto">
                  <Bot className="w-12 h-12" />
                </div>

                {/* Title */}
                <h2 className="text-3xl mb-4 text-white">AI Agent</h2>

                {/* Description */}
                <p className="text-gray-400 leading-relaxed mb-8">
                  智能 AI 代理服務
                  <br />
                  自動化決策與執行
                </p>

                {/* Hover Arrow */}
                <div className="flex items-center justify-center gap-2 text-[#45A4C0] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>進入 AI Agent</span>
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 1.5,
                    }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.span>
                </div>
              </div>
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
}

