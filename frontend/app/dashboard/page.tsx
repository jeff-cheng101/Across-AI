'use client';

import {
  BookOpen,
  Bot,
  Brain,
  Database,
  FileKey,
  LineChart,
  Network,
  Sparkles,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AnimatedLine } from '@/components/AnimatedLine';
import { CountUp } from '@/components/CountUp';

export default function Dashboard() {
  const router = useRouter();

  const stats = {
    securitySources: 7,
    todayEvents: 95,
    aiAnalysisTotal: 1000,
    attacksBlocked: 400,
  };

  const leftConnections = [
    { startX: 280, startY: 162, endX: 465, endY: 362, delay: 0 }, // Cloudflare - 停在圓左側邊緣
    { startX: 280, startY: 226, endX: 465, endY: 377, delay: 0.2 }, // Palo Alto
    { startX: 280, startY: 290, endX: 465, endY: 390, delay: 0.4 }, // F5
    { startX: 280, startY: 354, endX: 465, endY: 390, delay: 0.6 }, // CATO
    { startX: 280, startY: 418, endX: 465, endY: 390, delay: 0.8 }, // Check Point
    { startX: 280, startY: 482, endX: 465, endY: 403, delay: 1.0 }, // INTEZER AI
    { startX: 280, startY: 546, endX: 465, endY: 410, delay: 1.2 }, // CyCraftAI
    { startX: 280, startY: 610, endX: 465, endY: 418, delay: 1.4 }, // Custom SIEM
  ];

  const rightConnections = [
    { startX: 769, startY: 377, endX: 913, endY: 297, delay: 0 }, // AI Analysis
    { startX: 769, startY: 383, endX: 913, endY: 351, delay: 0.3 }, // Prompt Library
    { startX: 769, startY: 389, endX: 913, endY: 405, delay: 0.6 }, // AI Library (centered)
    { startX: 769, startY: 395, endX: 913, endY: 459, delay: 0.9 }, // AI Gateway
    // TODO: 目前不知道右側的 AI Agent 按鈕要指向哪，所以先註解
    // { startX: 769, startY: 401, endX: 913, endY: 515, delay: 1.2 }, // AI Agent
  ];

  return (
    <div className="min-h-screen bg-[#08131D] relative overflow-x-hidden flex items-center justify-center">
      <div
        className="relative origin-center"
        style={{
          width: '1200px',
          height: '800px',
          transform: 'scale(var(--scale, 1))',
        }}
      >
        <style>{`
          :root {
            --scale: min(calc(100vw / 1200), calc(100vh / 800));
          }
        `}</style>

        <div className="relative w-full h-full">
          <div className="absolute right-[20px] top-[20px] flex gap-[16px]">
            {/* 7個資安來源 */}
            <div className="bg-[#0a1929] rounded-[8px] border border-[#1e3a52] px-[16px] py-[12px] min-w-[140px]">
              <div className="flex flex-col gap-[4px]">
                <p className="text-[#8b95a8] text-[11px] font-normal">
                  {stats.securitySources}個資安來源
                </p>
                <div className="flex items-baseline gap-[6px]">
                  <span className="text-[#ffffff] text-[11px]">今日事件</span>
                  <CountUp
                    end={stats.todayEvents}
                    className="text-[#5dd5dc] text-[22px] font-bold"
                  />
                  <span className="text-[#ffffff] text-[11px]">件</span>
                </div>
              </div>
            </div>

            {/* AI分析總計 */}
            <div className="bg-[#0a1929] rounded-[8px] border border-[#1e3a52] px-[16px] py-[12px] min-w-[140px]">
              <div className="flex flex-col gap-[4px]">
                <p className="text-[#8b95a8] text-[11px] font-normal">
                  AI分析總計
                </p>
                <div className="flex items-baseline gap-[6px]">
                  <CountUp
                    end={stats.aiAnalysisTotal}
                    suffix="+"
                    className="text-[#ffffff] text-[28px] font-bold"
                  />
                  <span className="text-[#ffffff] text-[11px]">事件</span>
                </div>
              </div>
            </div>

            {/* 攻擊事件 */}
            <div className="bg-[#0a1929] rounded-[8px] border border-[#1e3a52] px-[16px] py-[12px] min-w-[140px]">
              <div className="flex flex-col gap-[4px]">
                <p className="text-[#8b95a8] text-[11px] font-normal">
                  攻擊事件
                </p>
                <div className="flex items-baseline gap-[6px]">
                  <span className="text-[#ffffff] text-[11px]">已阻擋</span>
                  <CountUp
                    end={stats.attacksBlocked}
                    suffix="+"
                    className="text-[#7FFF44] text-[22px] font-bold"
                  />
                </div>
              </div>
            </div>
          </div>

          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 5 }}
            role="img"
            aria-label="Animated network connections"
          >
            {leftConnections.map((conn) => (
              <AnimatedLine
                key={`left-${conn.startX}-${conn.startY}-${conn.endX}-${conn.endY}`}
                startX={conn.startX}
                startY={conn.startY}
                endX={conn.endX}
                endY={conn.endY}
                delay={conn.delay}
              />
            ))}

            {rightConnections.map((conn) => (
              <AnimatedLine
                key={`right-${conn.startX}-${conn.startY}-${conn.endX}-${conn.endY}`}
                startX={conn.startX}
                startY={conn.startY}
                endX={conn.endX}
                endY={conn.endY}
                delay={conn.delay}
              />
            ))}
          </svg>

          {/* 上方花瓣 */}
          <div
            className="absolute left-[523px] top-[173px] size-[217px] pointer-events-none"
            style={{ mixBlendMode: 'plus-lighter' }}
          >
            <svg
              className="block size-full"
              fill="none"
              viewBox="0 0 217 217"
              aria-hidden="true"
            >
              <title>上方花瓣裝飾</title>
              <circle
                cx="108.5"
                cy="108.5"
                r="108.5"
                fill="url(#paint0_radial_top)"
              />
              <defs>
                <radialGradient
                  id="paint0_radial_top"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(109 175) scale(108.5)"
                >
                  <stop stopColor="#1a5c4d" />
                  <stop offset="1" stopColor="#0a1f1a" stopOpacity="0.7" />
                </radialGradient>
              </defs>
            </svg>
          </div>

          {/* 下方花瓣 */}
          <div
            className="absolute left-[523px] top-[377px] size-[217px] pointer-events-none"
            style={{ mixBlendMode: 'plus-lighter' }}
          >
            <svg
              className="block size-full"
              fill="none"
              viewBox="0 0 217 217"
              aria-hidden="true"
            >
              <title>下方花瓣裝飾</title>
              <circle
                cx="108.5"
                cy="108.5"
                r="108.5"
                fill="url(#paint0_radial_bottom)"
              />
              <defs>
                <radialGradient
                  id="paint0_radial_bottom"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(211 116) scale(108.5)"
                >
                  <stop stopColor="#1a5c4d" />
                  <stop offset="1" stopColor="#0a1f1a" stopOpacity="0.7" />
                </radialGradient>
              </defs>
            </svg>
          </div>

          {/* 左側花瓣 */}
          <div
            className="absolute left-[422px] top-[275px] size-[217px] pointer-events-none"
            style={{ mixBlendMode: 'plus-lighter' }}
          >
            <svg
              className="block size-full"
              fill="none"
              viewBox="0 0 217 217"
              aria-hidden="true"
            >
              <title>左側花瓣裝飾</title>
              <circle
                cx="108.5"
                cy="108.5"
                r="108.5"
                fill="url(#paint0_radial_left)"
              />
              <defs>
                <radialGradient
                  id="paint0_radial_left"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(25 109) scale(108.5)"
                >
                  <stop stopColor="#1a5c4d" />
                  <stop offset="1" stopColor="#0a1f1a" stopOpacity="0.7" />
                </radialGradient>
              </defs>
            </svg>
          </div>

          {/* 右側花瓣 */}
          <div
            className="absolute left-[625px] top-[275px] size-[217px] pointer-events-none"
            style={{ mixBlendMode: 'plus-lighter' }}
          >
            <svg
              className="block size-full"
              fill="none"
              viewBox="0 0 217 217"
              aria-hidden="true"
            >
              <title>右側花瓣裝飾</title>
              <circle
                cx="108.5"
                cy="108.5"
                r="108.5"
                fill="url(#paint0_radial_right)"
              />
              <defs>
                <radialGradient
                  id="paint0_radial_right"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(25 109) scale(108.5)"
                >
                  <stop stopColor="#1a5c4d" />
                  <stop offset="1" stopColor="#0a1f1a" stopOpacity="0.7" />
                </radialGradient>
              </defs>
            </svg>
          </div>

          {/* 頂部 AI Cloud 按鈕 */}
          <div className="absolute left-[602px] top-[213px] w-[60px] h-[60px] bg-black rounded-full border border-white shadow-[1px_1px_15px_0px_rgba(255,255,255,0.7)] flex flex-col items-center justify-center z-10">
            <Sparkles className="w-5 h-5 text-white mb-1" />
            <span className="text-white text-[10px] font-medium">Cloud</span>
          </div>

          {/* 底部 AI Local 按鈕 */}
          <div className="absolute left-[602px] top-[495px] w-[60px] h-[60px] bg-black rounded-full border border-white shadow-[1px_1px_15px_0px_rgba(255,255,255,0.7)] flex flex-col items-center justify-center z-10">
            <Sparkles className="w-5 h-5 text-white mb-1" />
            <span className="text-white text-[10px] font-medium"> Local </span>
          </div>

          {/* 左側 Database 按鈕 */}
          <button
            type="button"
            className="absolute left-[465px] top-[361px] w-[58px] h-[58px] bg-black rounded-full border border-white shadow-[1px_1px_15px_0px_rgba(255,255,255,0.7)] flex items-center justify-center cursor-pointer hover:shadow-[1px_1px_20px_0px_rgba(255,255,255,0.9)] transition-shadow z-10"
            onClick={() => router.push('/elk')}
            aria-label="前往 ELK 資料庫"
          >
            <Database className="w-6 h-6 text-white" />
          </button>

          {/* 右側 LineChart 按鈕 */}
          <div className="absolute left-[740px] top-[361px] w-[58px] h-[57px] bg-black rounded-full border border-white shadow-[1px_1px_15px_0px_rgba(255,255,255,0.7)] flex items-center justify-center z-10">
            <LineChart className="w-6 h-6 text-white" />
          </div>

          {/* 內圈左上 Agent 按鈕 */}
          <button
            type="button"
            className="absolute left-[545px] top-[295px] w-[48px] h-[48px] bg-teal-600/30 rounded-full border border-teal-400/40 shadow-[0_0_15px_rgba(94,234,212,0.3)] flex flex-col items-center justify-center cursor-pointer hover:bg-teal-600/50 hover:shadow-[0_0_25px_rgba(94,234,212,0.5)] transition-all z-10"
            onClick={() => router.push('/agent/cloud/selection')}
            aria-label="前往 AI Cloud Agent 選擇頁面"
          >
            <Bot className="w-4 h-4 text-teal-300 mb-0.5" />
            <span className="text-white text-[9px] font-medium">Agent</span>
          </button>

          {/* 內圈左下 Agent 按鈕 */}
          <button
            type="button"
            className="absolute left-[545px] top-[423px] w-[48px] h-[48px] bg-teal-600/30 rounded-full border border-teal-400/40 shadow-[0_0_15px_rgba(94,234,212,0.3)] flex flex-col items-center justify-center cursor-pointer hover:bg-teal-600/50 hover:shadow-[0_0_25px_rgba(94,234,212,0.5)] transition-all z-10"
            onClick={() => router.push('/agent/local/selection')}
            aria-label="前往 AI Local Agent 選擇頁面"
          >
            <Bot className="w-4 h-4 text-teal-300 mb-0.5" />
            <span className="text-white text-[9px] font-medium">Agent</span>
          </button>

          {/* 內圈右上 KB/RAG 按鈕 */}
          <button
            type="button"
            className="absolute left-[674px] top-[295px] w-[48px] h-[48px] bg-teal-600/30 rounded-full border border-teal-400/40 shadow-[0_0_15px_rgba(94,234,212,0.3)] flex flex-col items-center justify-center cursor-pointer hover:bg-teal-600/50 hover:shadow-[0_0_25px_rgba(94,234,212,0.5)] transition-all z-10"
            onClick={() => router.push('/kb-rag')}
            aria-label="前往 KB/RAG 頁面"
          >
            <FileKey className="w-4 h-4 text-teal-300 mb-0.5" />
            <span className="text-white text-[9px] font-medium">KB/RAG</span>
          </button>

          {/* 內圈右下 KB/RAG 按鈕 */}
          <button
            type="button"
            className="absolute left-[674px] top-[423px] w-[48px] h-[48px] bg-teal-600/30 rounded-full border border-teal-400/40 shadow-[0_0_15px_rgba(94,234,212,0.3)] flex flex-col items-center justify-center cursor-pointer hover:bg-teal-600/50 hover:shadow-[0_0_25px_rgba(94,234,212,0.5)] transition-all z-10"
            onClick={() => router.push('/kb-rag')}
            aria-label="前往 KB/RAG 頁面"
          >
            <FileKey className="w-4 h-4 text-teal-300 mb-0.5" />
            <span className="text-white text-[9px] font-medium">KB/RAG</span>
          </button>

          {/* 中心 Cyber LLM 圓圈 */}
          <div className="absolute left-[569px] top-[321px] w-[126px] h-[126px] bg-[#08131D] rounded-full border border-white flex items-center justify-center z-10">
            <p className="text-white text-[16px] font-medium">Cyber LLM</p>
          </div>

          <div className="absolute left-[108px] top-[140px] flex flex-col gap-[20px] w-[172px]">
            {/* Cloudflare */}
            <button
              type="button"
              className="bg-[#08131d] h-[44px] rounded-[8px] border-[0.5px] border-[#898d98] shadow-[1px_1px_10px_0px_rgba(137,141,152,0.6)] cursor-pointer hover:border-[#6FF8FF] transition-colors p-0 w-full text-left"
              onClick={() => router.push('/dashboard/cloudflare')}
              aria-label="前往 Cloudflare Dashboard"
            >
              <div className="flex items-center gap-[8px] h-full px-[10px] py-[10px]">
                <Image
                  src="/logos/Cloudflar.png"
                  alt="Cloudflare"
                  width={26}
                  height={12}
                  className="object-contain"
                />
                <div className="flex flex-col gap-[4px]">
                  <p className="text-white text-[13px]">Cloudflare</p>
                  <p className="text-[#898d98] text-[10px]">
                    WAF DDoS CDN 活動中
                  </p>
                </div>
              </div>
            </button>

            {/* Palo Alto */}
            <button
              type="button"
              className="bg-[#08131d] h-[44px] rounded-[8px] border-[0.5px] border-[#898d98] shadow-[1px_1px_10px_0px_rgba(137,141,152,0.6)] cursor-pointer hover:border-[#6FF8FF] transition-colors p-0 w-full text-left"
              onClick={() => router.push('/dashboard/paloalto')}
              aria-label="前往 Palo Alto Dashboard"
            >
              <div className="flex items-center gap-[8px] h-full px-[10px] py-[12px]">
                <Image
                  src="/logos/palo-alto-networks-1.png"
                  alt="Palo Alto"
                  width={24}
                  height={22}
                  className="object-contain"
                />
                <div className="flex flex-col gap-[4px]">
                  <p className="text-white text-[13px]">Palo Alto</p>
                  <p className="text-[#949494] text-[10px]">Cortex 活動中</p>
                </div>
              </div>
            </button>

            {/* F5 */}
            <button
              type="button"
              className="bg-[#08131d] h-[44px] rounded-[8px] border-[0.5px] border-[#898d98] shadow-[1px_1px_10px_0px_rgba(137,141,152,0.6)] cursor-pointer hover:border-[#6FF8FF] transition-colors p-0 w-full text-left"
              onClick={() => router.push('/dashboard/f5')}
              aria-label="前往 F5 Dashboard"
            >
              <div className="flex items-center gap-[8px] h-full px-[10px] py-[8px]">
                <Image
                  src="/logos/f5_b.png"
                  alt="F5"
                  width={22}
                  height={22}
                  className="object-contain"
                />
                <div className="flex flex-col gap-[4px]">
                  <p className="text-white text-[13px]">F5</p>
                  <p className="text-[#898d98] text-[10px]">LTM 活動中</p>
                </div>
              </div>
            </button>

            {/* CATO */}
            <button
              type="button"
              className="bg-[#08131d] h-[44px] rounded-[8px] border-[0.5px] border-[#898d98] shadow-[1px_1px_10px_0px_rgba(137,141,152,0.6)] cursor-pointer hover:border-[#6FF8FF] transition-colors p-0 w-full text-left"
              onClick={() => router.push('/dashboard/cato')}
              aria-label="前往 CATO Dashboard"
            >
              <div className="flex items-center gap-[8px] h-full px-[10px] py-[8px]">
                <Image
                  src="/logos/cato-networks.png"
                  alt="CATO"
                  width={24}
                  height={10}
                  className="object-contain"
                />
                <div className="flex flex-col gap-[6px]">
                  <p className="text-white text-[13px]">CATO</p>
                  <p className="text-[#898d98] text-[10px]">SASE 活動中</p>
                </div>
              </div>
            </button>

            {/* Check Point */}
            <button
              type="button"
              className="bg-[#08131d] h-[44px] rounded-[8px] border-[0.5px] border-[#898d98] shadow-[1px_1px_10px_0px_rgba(137,141,152,0.6)] cursor-pointer hover:border-[#6FF8FF] transition-colors p-0 w-full text-left"
              onClick={() => router.push('/dashboard/checkpoint')}
              aria-label="前往 Check Point Dashboard"
            >
              <div className="flex items-center gap-[8px] h-full px-[10px] py-[8px]">
                <Image
                  src="/logos/checkpoint.png"
                  alt="Check Point"
                  width={20}
                  height={19}
                  className="object-contain"
                />
                <div className="flex flex-col gap-[6px]">
                  <p className="text-white text-[13px]">Check Point</p>
                  <p className="text-[#898d98] text-[10px]">UTM 活動中</p>
                </div>
              </div>
            </button>

            {/* INTEZER AI */}
            <div className="bg-[#08131d] h-[44px] rounded-[8px] border-[0.5px] border-[#898d98] shadow-[1px_1px_10px_0px_rgba(137,141,152,0.6)]">
              <div className="flex items-center gap-[8px] h-full px-[10px] py-[12px]">
                <Image
                  src="/logos/INTEZER_logo.png"
                  alt="INTEZER AI"
                  width={20}
                  height={20}
                  className="object-contain"
                />
                <div className="flex flex-col gap-[4px]">
                  <p className="text-white text-[13px]">INTEZER AI</p>
                  <p className="text-[#898d98] text-[10px]">活動中</p>
                </div>
              </div>
            </div>

            {/* CyCraftAI */}
            <div className="bg-[#08131d] h-[44px] rounded-[8px] border-[0.5px] border-[#898d98] shadow-[1px_1px_10px_0px_rgba(137,141,152,0.6)]">
              <div className="flex items-center gap-[8px] h-full px-[10px] py-[12px]">
                <Image
                  src="/logos/craftai.png"
                  alt="CyCraftAI"
                  width={22}
                  height={22}
                  className="object-contain"
                />
                <div className="flex flex-col gap-[4px]">
                  <p className="text-white text-[13px]">CyCraftAI</p>
                  <p className="text-[#898d98] text-[10px]">威脅情資 活動中</p>
                </div>
              </div>
            </div>

            {/* Custom SIEM */}
            <div className="bg-[#08131d] h-[44px] rounded-[8px] border-[0.5px] border-[#898d98] shadow-[1px_1px_10px_0px_rgba(137,141,152,0.6)]">
              <div className="flex items-center gap-[8px] h-full px-[10px] py-[12px]">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <title>Custom SIEM 圖標</title>
                  <path
                    d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                    stroke="#898D98"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polyline
                    points="14 2 14 8 20 8"
                    stroke="#898D98"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line
                    x1="16"
                    y1="13"
                    x2="8"
                    y2="13"
                    stroke="#898D98"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line
                    x1="16"
                    y1="17"
                    x2="8"
                    y2="17"
                    stroke="#898D98"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polyline
                    points="10 9 9 9 8 9"
                    stroke="#898D98"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex flex-col gap-[6px]">
                  <p className="text-white text-[13px]">Custom SIEM</p>
                  <p className="text-[#898d98] text-[10px]">日誌分析 活動中</p>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute left-[913px] top-[280px] flex flex-col gap-[20px] w-[166px]">
            {/* AI Analysis */}
            <button
              type="button"
              className="bg-[#08131d] rounded-[200px] border border-[#898d98] shadow-[1px_1px_10px_0px_rgba(137,141,152,0.6)] cursor-pointer hover:border-[#6FF8FF] transition-colors p-0 w-full text-left"
              onClick={() => router.push('/ai-analysis/cloudflare')}
              aria-label="前往 AI Analysis"
            >
              <div className="flex items-center gap-[9px] px-[16px] py-[8px]">
                <Sparkles className="w-[18px] h-[18px] text-[#6FF8FF]" />
                <p className="text-white text-[12px]">AI Analysis</p>
              </div>
            </button>

            {/* Prompt Library */}
            <button
              type="button"
              className="bg-[#08131d] rounded-[200px] border border-[#898d98] shadow-[1px_1px_10px_0px_rgba(137,141,152,0.6)] cursor-pointer hover:border-[#6FF8FF] transition-colors p-0 w-full text-left"
              onClick={() => router.push('/prompt-library/cloudflare')}
              aria-label="前往 Prompt Library"
            >
              <div className="flex items-center gap-[9px] px-[16px] py-[8px]">
                <BookOpen className="w-[18px] h-[18px] text-[#6FF8FF]" />
                <p className="text-white text-[12px]">Prompt Library</p>
              </div>
            </button>

            {/* AI Library */}
            <button
              type="button"
              className="bg-[#08131d] rounded-[200px] border border-[#898d98] shadow-[1px_1px_10px_0px_rgba(137,141,152,0.6)] cursor-pointer hover:border-[#6FF8FF] transition-colors p-0 w-full text-left"
              onClick={() => router.push('/ai-library')}
              aria-label="前往 AI Library"
            >
              <div className="flex items-center gap-[9px] px-[16px] py-[8px]">
                <Brain className="w-[18px] h-[18px] text-[#6FF8FF]" />
                <p className="text-white text-[12px]">AI Library</p>
              </div>
            </button>

            {/* TODO: AI Gateway 功能尚未實作，目前為無效按鈕 */}
            <button
              type="button"
              className="bg-[#08131d] rounded-[200px] border border-[#898d98] shadow-[1px_1px_10px_0px_rgba(137,141,152,0.6)] cursor-not-allowed opacity-50 p-0 w-full text-left"
              disabled
              aria-label="AI Gateway（尚未實作）"
            >
              <div className="flex items-center gap-[9px] px-[16px] py-[8px]">
                <Network className="w-[18px] h-[18px] text-[#6FF8FF]" />
                <p className="text-white text-[12px]">AI Gateway</p>
              </div>
            </button>

            {/* TODO: 目前不知道右側的 AI Agent 按鈕要指向哪，所以先註解 */}
            {/* AI Agent */}
            {/* <button
              type="button"
              className="bg-[#08131d] rounded-[200px] border border-[#898d98] shadow-[1px_1px_10px_0px_rgba(137,141,152,0.6)] cursor-pointer hover:border-[#6FF8FF] transition-colors p-0 w-full text-left"
              onClick={() => router.push('/aiagent')}
              aria-label="前往 AI Agent"
            >
              <div className="flex items-center gap-[9px] px-[16px] py-[8px]">
                <Bot className="w-[18px] h-[18px] text-[#6FF8FF]" />
                <p className="text-white text-[12px]">AI Agent</p>
              </div>
            </button> */}
          </div>

          <div className="absolute left-[108px] top-[682px]">
            <div className="absolute left-0 top-0 text-white text-[14px] font-normal whitespace-nowrap">
              Protection Layer
            </div>
            <div className="absolute left-[240px] top-0 text-white text-[14px] font-normal whitespace-nowrap">
              Datalake
            </div>
            <div className="absolute left-[425px] top-0 text-white text-[14px] font-normal whitespace-nowrap">
              Inference Layer
            </div>
            <div className="absolute left-[650px] top-0 text-white text-[14px] font-normal whitespace-nowrap">
              Analysis Layer
            </div>
            <div className="absolute left-[840px] top-0 text-white text-[14px] font-normal whitespace-nowrap">
              Presentation Layer
            </div>

            <div className="absolute left-0 top-[30px] h-[21px] w-[940px]">
              <svg
                className="block size-full"
                fill="none"
                viewBox="0 0 940 21"
                aria-hidden="true"
              >
                <title>架構層級連接線</title>
                <defs>
                  {/* 線條漸層 */}
                  <linearGradient
                    id="bottom_line_gradient"
                    x1="0"
                    y1="0"
                    x2="940"
                    y2="0"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0%" stopColor="#5dd5dc" stopOpacity="0.3" />
                    <stop offset="50%" stopColor="#5dd5dc" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#5dd5dc" stopOpacity="0.3" />
                  </linearGradient>
                  {/* 節點發光效果 */}
                  <filter
                    id="node_glow"
                    x="-50%"
                    y="-50%"
                    width="200%"
                    height="200%"
                  >
                    <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                    <feOffset dx="0" dy="0" result="offsetblur" />
                    <feComponentTransfer>
                      <feFuncA type="linear" slope="1.5" />
                    </feComponentTransfer>
                    <feMerge>
                      <feMergeNode />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* 連接線 */}
                <line
                  x1="0"
                  y1="10.5"
                  x2="940"
                  y2="10.5"
                  stroke="url(#bottom_line_gradient)"
                  strokeWidth="2"
                />

                {/* 五個節點 - 對齊到標籤文字中心下方 */}
                <circle
                  cx="75"
                  cy="10.5"
                  r="8"
                  fill="#5dd5dc"
                  filter="url(#node_glow)"
                />
                <circle cx="75" cy="10.5" r="5" fill="#b0fbff" />

                <circle
                  cx="265"
                  cy="10.5"
                  r="8"
                  fill="#5dd5dc"
                  filter="url(#node_glow)"
                />
                <circle cx="265" cy="10.5" r="5" fill="#b0fbff" />

                <circle
                  cx="495"
                  cy="10.5"
                  r="8"
                  fill="#5dd5dc"
                  filter="url(#node_glow)"
                />
                <circle cx="495" cy="10.5" r="5" fill="#b0fbff" />

                <circle
                  cx="705"
                  cy="10.5"
                  r="8"
                  fill="#5dd5dc"
                  filter="url(#node_glow)"
                />
                <circle cx="705" cy="10.5" r="5" fill="#b0fbff" />

                <circle
                  cx="918"
                  cy="10.5"
                  r="8"
                  fill="#5dd5dc"
                  filter="url(#node_glow)"
                />
                <circle cx="918" cy="10.5" r="5" fill="#b0fbff" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
