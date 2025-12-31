'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AgentCard } from './agent-card';
import { type AgentType, agents } from './agent-config';
import { AgentDialog } from './agent-dialog';

export default function AIAgentPage() {
  const router = useRouter();
  const [activeAgent, setActiveAgent] = useState<AgentType>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleAgentClick = (agentId: AgentType) => {
    setActiveAgent(agentId);
    setIsExecuting(false);
  };

  const handleClose = () => {
    setActiveAgent(null);
    setIsExecuting(false);
  };

  const currentAgent = agents.find((agent) => agent.id === activeAgent);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Content */}
      <div className="relative">
        {/* Header with Back*/}
        <div className="container mx-auto px-6 py-12">
          <div className="flex justify-between items-center mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/dashboard')}
              className="hover:bg-gray-800"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </Button>
          </div>

          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#45A4C0]/10 border border-[#45A4C0]/20 mb-6">
              <div className="w-2 h-2 rounded-full bg-[#45A4C0] animate-pulse" />
              <span className="text-sm text-[#45A4C0]">AI Agent 控制中心</span>
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              智能運維管理平台
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              運用 AI 技術自動化處理網路安全與系統維護任務
            </p>
          </div>

          {/* Agent Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {agents.map((agent) => (
              <AgentCard
                key={agent.id}
                title={agent.title}
                description={agent.description}
                icon={agent.icon}
                onClick={() => handleAgentClick(agent.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Agent Dialog */}
      {currentAgent && (
        <AgentDialog
          agent={currentAgent}
          isOpen={!!activeAgent}
          isExecuting={isExecuting}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
