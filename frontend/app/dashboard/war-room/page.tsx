'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { GlobalThreatDashboard } from '@/components/GlobalThreatDashboard';
import { Button } from '@/components/ui/button';

export default function WarRoomPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Cloudflare Data - Signal Intelligence (Purple #994ee5)
  const cloudflareMetrics = {
    inboundTraffic: '6.5 Gbps', // Inbound DDoS 清洗流量
    inboundTrafficLabel: 'Cloudflare Inbound DDoS 清洗流量',
    wafThreats: 1280, // WAF 已阻擋威脅
    wafThreatsLabel: 'Cloudflare WAF 已阻擋威脅 (近1小時)',
    wafThreatIncrease: 150,
    cacheEfficiency: 98.5, // CDN 快取命中率 (Cache Hit)
    cacheEfficiencyLabel: 'Cloudflare CDN 快取命中率 (Cache Hit)',
    errorRate: 0.01, // 源伺服器錯誤率
    errorRateLabel: 'Cloudflare 源伺服器錯誤率 (5xx)',
    ddosAttack: '8.2 Gbps',
    attackType: 'UDP Flood',
    brandColor: '#994ee5', // Cloudflare brand color
  };

  // Mirrored Traffic Data - Attack vs Clean Traffic
  const mirroredTrafficData = [
    { time: '0', attackTraffic: 1.2, cleanTraffic: 3.5 },
    { time: '5', attackTraffic: 1.5, cleanTraffic: 3.8 },
    { time: '10', attackTraffic: 2.1, cleanTraffic: 4.2 },
    { time: '15', attackTraffic: 3.2, cleanTraffic: 4.5 },
    { time: '20', attackTraffic: 4.8, cleanTraffic: 4.8 },
    { time: '25', attackTraffic: 6.5, cleanTraffic: 5.0 },
    { time: '30', attackTraffic: 8.2, cleanTraffic: 5.2 },
    { time: '35', attackTraffic: 7.8, cleanTraffic: 5.4 },
    { time: '40', attackTraffic: 6.2, cleanTraffic: 5.6 },
    { time: '45', attackTraffic: 4.5, cleanTraffic: 5.8 },
    { time: '50', attackTraffic: 3.2, cleanTraffic: 6.0 },
    { time: '55', attackTraffic: 2.1, cleanTraffic: 6.2 },
    { time: '60', attackTraffic: 1.8, cleanTraffic: 6.5 },
  ];

  // DDoS Traffic Data - Bidirectional (Cloudflare Inbound + WAF vs F5 LTM)
  const ddosTrafficData = [
    { time: '00:00', cloudflareInbound: 2.1, cloudflareWaf: 1.2, f5Ltm: 4.5 },
    { time: '10:00', cloudflareInbound: 2.8, cloudflareWaf: 1.5, f5Ltm: 4.3 },
    { time: '20:00', cloudflareInbound: 3.5, cloudflareWaf: 1.8, f5Ltm: 4.2 },
    { time: '30:00', cloudflareInbound: 4.2, cloudflareWaf: 2.1, f5Ltm: 4.0 },
    { time: '40:00', cloudflareInbound: 6.8, cloudflareWaf: 3.2, f5Ltm: 3.8 },
    { time: '50:00', cloudflareInbound: 8.2, cloudflareWaf: 3.8, f5Ltm: 3.5 },
    { time: '60:00', cloudflareInbound: 5.3, cloudflareWaf: 2.5, f5Ltm: 4.1 },
  ];

  // Cloudflare 攻擊來源分布 (Cloudflare Global Attack Source Distribution)
  const cloudflareThreatOrigins = [
    { name: '中國 China', value: 35, color: '#b794f4' },
    { name: '美國 USA', value: 28, color: '#c4a8f7' },
    { name: '印度 India', value: 18, color: '#d3bcfa' },
    { name: '其他 Others', value: 19, color: '#e2d0fd' },
  ];

  // F5 攻擊來源分布 (F5 Global Attack Source Distribution)
  const threatOrigins = [
    { name: '俄羅斯 Russia', value: 45, color: '#44e6ff' },
    { name: '巴西 Brazil', value: 20, color: '#66eeff' },
    { name: '越南 Vietnam', value: 12, color: '#88f0ff' },
    { name: '其他 Others', value: 23, color: '#aaf4ff' },
  ];

  // F5 Data - Operational Defense (Cyan #44e6ff)
  const f5Metrics = {
    wafInterceptions: 134799, // WAF 攻擊總數
    wafInterceptionsLabel: 'F5 WAF 攻擊總數',
    ltmSessions: 616671, // LTM 總請求數
    ltmSessionsLabel: 'F5 LTM 總請求數',
    latency: 246, // 平均響應時間 (ms)
    latencyLabel: 'F5 平均響應時間 (Average Response Time)',
    defenseSuccess: 99.8, // 防護成功率
    defenseSuccessLabel: 'F5 防護成功率 (Defense Success Rate)',
    poolHealth: 85, // Pool 健康狀態
    poolHealthLabel: 'F5 Pool 健康狀態 (Pool Health Status)',
    topServiceRegion: 'Taiwan',
    topServiceCount: 107235,
    systemStatus: 'ACTIVE', // 系統狀態
    systemStatusLabel: 'F5 系統狀態 (System Status)',
    brandColor: '#44e6ff', // F5 brand color
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/20 to-slate-950 relative overflow-hidden font-mono">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'gridPulse 4s ease-in-out infinite',
          }}
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[10, 16, 22, 28, 34, 40, 46, 52, 58, 64, 70, 76, 82, 88, 94].map(
          (leftPos, i) => (
            <div
              key={`particle-left-${leftPos}`}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-30"
              style={{
                left: `${leftPos}%`,
                top: `${5 + ((i * 7) % 90)}%`,
                animation: `float ${5 + (i % 5) * 2}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ),
        )}
      </div>

      {/* Scanline Overlay Effect - Enhanced */}
      <div
        className="absolute inset-0 pointer-events-none z-50 opacity-[0.02]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(99, 102, 241, 0.1) 2px, rgba(99, 102, 241, 0.1) 4px)',
          animation: 'scanline 8s linear infinite',
        }}
      />

      {/* Vignette Effect */}
      <div
        className="absolute inset-0 pointer-events-none z-40"
        style={{
          background:
            'radial-gradient(circle at center, transparent 0%, rgba(15, 23, 42, 0.4) 100%)',
        }}
      />

      {/* Header with Glassmorphism */}
      <header className="relative z-40 border-b border-[#5A7FA5]/20 backdrop-blur-2xl bg-[#0f1729] shadow-lg shadow-cyan-500/5">
        <div className="absolute inset-0 bg-gradient-to-r from-[#5A7FA5]/5 via-[#7BA5D1]/5 to-[#5A7FA5]/5" />
        <div className="max-w-[1920px] mx-auto px-8 py-4 flex items-center justify-between relative">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/dashboard')}
              className="hover:bg-[#7BA5D1]/10 border border-transparent hover:border-[#7BA5D1]/30 transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 tracking-wider animate-pulse">
                ACROSS 戰情室
              </h1>
              <p className="text-xs text-[#7BA5D1]/80 tracking-widest font-semibold">
                INTELLIGENCE SURVEILLANCE HUB
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/40 rounded-lg backdrop-blur-sm shadow-lg shadow-emerald-500/20">
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <span className="text-emerald-400 text-xs font-bold tracking-wide">
                SYSTEM ACTIVE
              </span>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500 tracking-wider">
                THREAT LEVEL
              </div>
              <div className="text-sm font-bold text-orange-400 animate-pulse">
                ELEVATED
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Split Screen */}
      <main className="relative z-10">
        {/* Twin Reactor Threat Countermeasure Gauge */}
        <div className="max-w-[1920px] mx-auto p-8 bg-gradient-to-br from-slate-950 via-slate-900/80 to-slate-950">
          <div className="relative">
            {/* Top Layer: Glowing Radial Progress Circles */}
            <div className="flex items-center justify-center gap-24 mb-16">
              {/* Left Circle - Cloudflare WAF Blocked Threats (Purple) */}
              <div className="relative group cursor-pointer transition-transform duration-400 ease-out hover:scale-[1.08]">
                <svg
                  width="380"
                  height="380"
                  viewBox="0 0 300 300"
                  className="overflow-visible"
                  role="img"
                  aria-label="Cloudflare WAF 已阻擋威脅"
                >
                  <defs>
                    {/* Purple gradient for Cloudflare WAF */}
                    <linearGradient
                      id="purpleNeonGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#c084fc" />
                      <stop offset="50%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#7c3aed" />
                    </linearGradient>

                    {/* Intense outer halo glow */}
                    <filter
                      id="purpleHaloGlow"
                      x="-100%"
                      y="-100%"
                      width="300%"
                      height="300%"
                    >
                      <feGaussianBlur stdDeviation="20" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>

                    {/* Main ring glow */}
                    <filter
                      id="purpleGlow"
                      x="-50%"
                      y="-50%"
                      width="200%"
                      height="200%"
                    >
                      <feGaussianBlur stdDeviation="8" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>

                    {/* Particle glow */}
                    <filter
                      id="purpleParticleGlow"
                      x="-200%"
                      y="-200%"
                      width="500%"
                      height="500%"
                    >
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Outer halo effect - soft atmospheric glow */}
                  <circle
                    cx="150"
                    cy="150"
                    r="125"
                    fill="none"
                    stroke="url(#purpleNeonGradient)"
                    strokeWidth="1"
                    opacity="0.2"
                    filter="url(#purpleHaloGlow)"
                  >
                    <animate
                      attributeName="opacity"
                      values="0.15;0.25;0.15"
                      dur="4s"
                      repeatCount="indefinite"
                    />
                  </circle>

                  {/* Mid-layer glow ring */}
                  <circle
                    cx="150"
                    cy="150"
                    r="112"
                    fill="none"
                    stroke="url(#purpleNeonGradient)"
                    strokeWidth="2"
                    opacity="0.4"
                    filter="url(#purpleGlow)"
                  >
                    <animate
                      attributeName="r"
                      values="112;117;112"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.3;0.5;0.3"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </circle>

                  {/* Main neon ring with enhanced glow */}
                  <circle
                    cx="150"
                    cy="150"
                    r="100"
                    fill="none"
                    stroke="url(#purpleNeonGradient)"
                    strokeWidth="2"
                    filter="url(#purpleGlow)"
                  >
                    <animate
                      attributeName="stroke-width"
                      values="2;4;3"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.9;1;0.9"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>

                  {/* Inner shadow ring */}
                  <circle
                    cx="150"
                    cy="150"
                    r="95"
                    fill="none"
                    stroke="#7c3aed"
                    strokeWidth="1"
                    opacity="0.3"
                  />

                  {/* Bokeh particles scattered around the ring */}
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
                    const distance = 115 + (angle % 30);
                    const size = 2 + (angle % 4);
                    return (
                      <circle
                        key={`cf-bokeh-${angle}`}
                        cx={150 + distance * Math.cos((angle * Math.PI) / 180)}
                        cy={150 + distance * Math.sin((angle * Math.PI) / 180)}
                        r={size}
                        fill="#c084fc"
                        filter="url(#purpleParticleGlow)"
                        opacity="0.6"
                      >
                        <animate
                          attributeName="opacity"
                          values="0.4;0.8;0.4"
                          dur={`${2 + (angle / 100) * 0.3}s`}
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="r"
                          values={`${size};${size + 1};${size}`}
                          dur={`${2 + (angle / 100) * 0.3}s`}
                          repeatCount="indefinite"
                        />
                      </circle>
                    );
                  })}

                  {/* Rotating energy particles on the ring */}
                  {[0, 120, 240].map((angle) => (
                    <circle
                      key={`cf-energy-${angle}`}
                      cx={150 + 100 * Math.cos((angle * Math.PI) / 180)}
                      cy={150 + 100 * Math.sin((angle * Math.PI) / 180)}
                      r="4"
                      fill="#c084fc"
                      filter="url(#purpleParticleGlow)"
                      opacity="0.9"
                    >
                      <animate
                        attributeName="r"
                        values="3;6;3"
                        dur="1.5s"
                        repeatCount="indefinite"
                        begin={`${(angle / 240) * 0.5}s`}
                      />
                      <animate
                        attributeName="opacity"
                        values="0.7;1;0.7"
                        dur="1.5s"
                        repeatCount="indefinite"
                        begin={`${(angle / 240) * 0.5}s`}
                      />
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from={`${angle} 150 150`}
                        to={`${angle + 360} 150 150`}
                        dur="8s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  ))}
                </svg>

                {/* Central Data Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div
                    className="text-purple-400 text-5xl font-bold tracking-tight mb-1"
                    style={{
                      fontFamily: 'monospace',
                      textShadow:
                        '0 0 20px rgba(168, 85, 247, 0.8), 0 0 40px rgba(168, 85, 247, 0.4)',
                    }}
                  >
                    {cloudflareMetrics.wafThreats.toLocaleString()}
                  </div>
                  <div className="text-orange-400 text-base font-500 flex items-center gap-1">
                    <span className="text-base">↑</span>
                    <span>+{cloudflareMetrics.wafThreatIncrease}%</span>
                  </div>
                </div>

                {/* Label */}
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center">
                  <div className="text-purple-400 text-base font-bold tracking-wider mb-1">
                    Cloudflare
                  </div>
                  <div className="text-purple-500/70 text-xs">
                    WAF已阻擋威脅
                  </div>
                </div>
              </div>

              {/* Middle Layer: Energy Conduit & VS Link */}
              <div className="relative flex items-center gap-6">
                {/* Left Conduit Lines */}
                <svg
                  width="120"
                  height="120"
                  viewBox="0 0 120 120"
                  role="img"
                  aria-label="左側能量導管"
                >
                  <defs>
                    <filter
                      id="reactorGlow"
                      x="-50%"
                      y="-50%"
                      width="200%"
                      height="200%"
                    >
                      <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <linearGradient
                      id="leftConduitSolid"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#994ee5" stopOpacity="0.8" />
                      <stop
                        offset="100%"
                        stopColor="#994ee5"
                        stopOpacity="0.4"
                      />
                    </linearGradient>
                    <linearGradient
                      id="leftConduitDashed"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#994ee5" stopOpacity="0.9" />
                      <stop
                        offset="100%"
                        stopColor="#994ee5"
                        stopOpacity="0.7"
                      />
                    </linearGradient>
                  </defs>
                  {/* Top Line - Green Dashed */}
                  <path
                    d="M 10 60 Q 40 40 70 60"
                    fill="none"
                    stroke="url(#leftConduitDashed)"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                    filter="url(#reactorGlow)"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      values="0;-6"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  </path>
                  {/* Bottom Line - Solid */}
                  <path
                    d="M 10 60 Q 40 80 70 60"
                    fill="none"
                    stroke="url(#leftConduitSolid)"
                    strokeWidth="1.5"
                    filter="url(#reactorGlow)"
                  >
                    <animate
                      attributeName="stroke-dasharray"
                      values="0,100;100,0"
                      dur="2s"
                      repeatCount="indefinite"
                      begin="0.3s"
                    />
                  </path>
                  <circle
                    cx="10"
                    cy="60"
                    r="4"
                    fill="#994ee5"
                    filter="url(#reactorGlow)"
                  >
                    <animate
                      attributeName="r"
                      values="4;6;4"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </svg>

                {/* VS Badge */}
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-purple-500/50 border-4 border-slate-900">
                    <div
                      className="text-white text-lg font-400 tracking-widest"
                      style={{ textShadow: '0 0 10px rgba(255,255,255,0.8)' }}
                    >
                      VS
                    </div>
                  </div>
                  <div
                    className="absolute inset-0 w-20 h-20 rounded-full bg-purple-500/30 animate-ping"
                    style={{ animationDuration: '3s' }}
                  />
                </div>

                {/* Right Conduit Lines */}
                <svg
                  width="120"
                  height="120"
                  viewBox="0 0 120 120"
                  role="img"
                  aria-label="右側能量導管"
                >
                  <defs>
                    <filter
                      id="reactorGlow2"
                      x="-50%"
                      y="-50%"
                      width="200%"
                      height="200%"
                    >
                      <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <linearGradient
                      id="rightConduitSolid"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                      <stop
                        offset="100%"
                        stopColor="#44e6ff"
                        stopOpacity="0.8"
                      />
                    </linearGradient>
                    <linearGradient
                      id="rightConduitDashed"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#22c55e" stopOpacity="0.7" />
                      <stop
                        offset="100%"
                        stopColor="#10b981"
                        stopOpacity="0.9"
                      />
                    </linearGradient>
                  </defs>
                  {/* Top Line - Green Dashed */}
                  <path
                    d="M 50 60 Q 80 40 110 60"
                    fill="none"
                    stroke="url(#rightConduitDashed)"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                    filter="url(#reactorGlow2)"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      values="0;-6"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  </path>
                  {/* Bottom Line - Solid */}
                  <path
                    d="M 50 60 Q 80 80 110 60"
                    fill="none"
                    stroke="url(#rightConduitSolid)"
                    strokeWidth="1.5"
                    filter="url(#reactorGlow2)"
                  >
                    <animate
                      attributeName="stroke-dasharray"
                      values="0,100;100,0"
                      dur="2s"
                      repeatCount="indefinite"
                      begin="0.3s"
                    />
                  </path>
                  <circle
                    cx="110"
                    cy="60"
                    r="4"
                    fill="#44e6ff"
                    filter="url(#reactorGlow2)"
                  >
                    <animate
                      attributeName="r"
                      values="4;6;4"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </svg>
              </div>

              {/* Right Circle - F5 WAF Attack Total (Cyan/Green) */}
              <div className="relative group cursor-pointer transition-transform duration-400 ease-out hover:scale-[1.08]">
                <svg
                  width="380"
                  height="380"
                  viewBox="0 0 300 300"
                  className="overflow-visible"
                  role="img"
                  aria-label="F5 WAF 攻擊總數"
                >
                  <defs>
                    {/* Cyan/Green gradient for F5 WAF */}
                    <linearGradient
                      id="cyanNeonGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#22d3ee" />
                      <stop offset="50%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>

                    {/* Intense outer halo glow */}
                    <filter
                      id="cyanHaloGlow"
                      x="-100%"
                      y="-100%"
                      width="300%"
                      height="300%"
                    >
                      <feGaussianBlur stdDeviation="20" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>

                    {/* Main ring glow */}
                    <filter
                      id="cyanGlow"
                      x="-50%"
                      y="-50%"
                      width="200%"
                      height="200%"
                    >
                      <feGaussianBlur stdDeviation="8" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>

                    {/* Particle glow */}
                    <filter
                      id="cyanParticleGlow"
                      x="-200%"
                      y="-200%"
                      width="500%"
                      height="500%"
                    >
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Outer halo effect - soft atmospheric glow */}
                  <circle
                    cx="150"
                    cy="150"
                    r="125"
                    fill="none"
                    stroke="url(#cyanNeonGradient)"
                    strokeWidth="1"
                    opacity="0.2"
                    filter="url(#cyanHaloGlow)"
                  >
                    <animate
                      attributeName="opacity"
                      values="0.15;0.25;0.15"
                      dur="4s"
                      repeatCount="indefinite"
                    />
                  </circle>

                  {/* Mid-layer glow ring */}
                  <circle
                    cx="150"
                    cy="150"
                    r="112"
                    fill="none"
                    stroke="url(#cyanNeonGradient)"
                    strokeWidth="2"
                    opacity="0.4"
                    filter="url(#cyanGlow)"
                  >
                    <animate
                      attributeName="r"
                      values="112;117;112"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.3;0.5;0.3"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </circle>

                  {/* Main neon ring with enhanced glow */}
                  <circle
                    cx="150"
                    cy="150"
                    r="100"
                    fill="none"
                    stroke="url(#cyanNeonGradient)"
                    strokeWidth="2"
                    filter="url(#cyanGlow)"
                  >
                    <animate
                      attributeName="stroke-width"
                      values="2;4;3"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.9;1;0.9"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>

                  {/* Inner shadow ring */}
                  <circle
                    cx="150"
                    cy="150"
                    r="95"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="1"
                    opacity="0.3"
                  />

                  {/* Bokeh particles scattered around the ring */}
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
                    const distance = 115 + (angle % 30);
                    const size = 2 + (angle % 4);
                    return (
                      <circle
                        key={`f5-bokeh-${angle}`}
                        cx={150 + distance * Math.cos((angle * Math.PI) / 180)}
                        cy={150 + distance * Math.sin((angle * Math.PI) / 180)}
                        r={size}
                        fill="#22d3ee"
                        filter="url(#cyanParticleGlow)"
                        opacity="0.6"
                      >
                        <animate
                          attributeName="opacity"
                          values="0.4;0.8;0.4"
                          dur={`${2 + (angle / 100) * 0.3}s`}
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="r"
                          values={`${size};${size + 1};${size}`}
                          dur={`${2 + (angle / 100) * 0.3}s`}
                          repeatCount="indefinite"
                        />
                      </circle>
                    );
                  })}

                  {/* Rotating energy particles on the ring */}
                  {[0, 120, 240].map((angle) => (
                    <circle
                      key={`f5-energy-${angle}`}
                      cx={150 + 100 * Math.cos((angle * Math.PI) / 180)}
                      cy={150 + 100 * Math.sin((angle * Math.PI) / 180)}
                      r="4"
                      fill="#22d3ee"
                      filter="url(#cyanParticleGlow)"
                      opacity="0.9"
                    >
                      <animate
                        attributeName="r"
                        values="3;6;3"
                        dur="1.5s"
                        repeatCount="indefinite"
                        begin={`${(angle / 240) * 0.5}s`}
                      />
                      <animate
                        attributeName="opacity"
                        values="0.7;1;0.7"
                        dur="1.5s"
                        repeatCount="indefinite"
                        begin={`${(angle / 240) * 0.5}s`}
                      />
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from={`${angle} 150 150`}
                        to={`${angle + 360} 150 150`}
                        dur="8s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  ))}
                </svg>

                {/* Central Data Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div
                    className="text-cyan-400 text-5xl font-bold tracking-tight mb-1"
                    style={{
                      fontFamily: 'monospace',
                      textShadow:
                        '0 0 20px rgba(34, 211, 238, 0.8), 0 0 40px rgba(34, 211, 238, 0.4)',
                    }}
                  >
                    {f5Metrics.wafInterceptions.toLocaleString()}
                  </div>
                  <div className="text-emerald-400 text-base font-500 flex items-center gap-1">
                    <span className="text-base">↓</span>
                    <span>-2.1%</span>
                  </div>
                </div>

                {/* Label */}
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center">
                  <div className="text-cyan-400 text-base font-bold tracking-wider mb-1">
                    F5
                  </div>
                  <div className="text-cyan-500/70 text-xs">WAF攻擊總數</div>
                </div>
              </div>
            </div>

            {/* Bottom Layer: Mirrored Stacked Distribution Base */}
            <div className="mt-16 p-6 bg-slate-900/60 rounded-lg border border-indigo-500/30 backdrop-blur-sm">
              <div className="text-center mb-6">
                <div className="text-indigo-300 text-base font-bold tracking-wider">
                  攻擊類型分布對比
                </div>
                <div className="text-indigo-400/60 text-xs tracking-wider">
                  Attack Type Distribution Comparison
                </div>
              </div>

              <div className="space-y-4">
                {/* Attack Type Rows */}
                {[
                  { name: 'SQL Injection', cloudflare: 340, f5: 2805 },
                  { name: 'XSS Attack', cloudflare: 280, f5: 2105 },
                  { name: 'DDoS Bot', cloudflare: 180, f5: 1580 },
                  { name: 'Path Traversal', cloudflare: 220, f5: 980 },
                  { name: 'Cmd Injection', cloudflare: 160, f5: 650 },
                ].map((attack) => (
                  <div key={attack.name} className="flex items-center gap-4">
                    {/* Left Side - Cloudflare (Purple) */}
                    <div className="flex-1 flex justify-end items-center gap-2">
                      <span className="text-purple-300 text-xs font-semibold">
                        {attack.cloudflare}
                      </span>
                      <div
                        className="relative h-4 bg-slate-800/50 rounded-l-lg overflow-hidden"
                        style={{ width: `${(attack.cloudflare / 400) * 100}%` }}
                      >
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-500 opacity-80"
                          style={{
                            boxShadow: 'inset 0 0 10px rgba(153, 78, 229, 0.6)',
                          }}
                        >
                          <div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-300/40 to-transparent animate-pulse"
                            style={{ animationDuration: '3s' }}
                          />
                        </div>
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white text-xs font-bold">
                          {Math.round((attack.cloudflare / 1280) * 100)}%
                        </div>
                      </div>
                    </div>

                    {/* Center - Attack Name */}
                    <div className="w-40 text-center px-4 py-0 bg-slate-800/80 border border-indigo-500/30 rounded">
                      <div className="text-slate-200 text-xs font-base">
                        {attack.name}
                      </div>
                    </div>

                    {/* Right Side - F5 (Cyan) */}
                    <div className="flex-1 flex items-center gap-2">
                      <div
                        className="relative h-4 bg-slate-800/50 rounded-r-lg overflow-hidden"
                        style={{ width: `${(attack.f5 / 3000) * 100}%` }}
                      >
                        <div
                          className="absolute inset-0 bg-gradient-to-l from-cyan-500 to-cyan-400 opacity-80"
                          style={{
                            boxShadow: 'inset 0 0 10px rgba(68, 230, 255, 0.6)',
                          }}
                        >
                          <div
                            className="absolute inset-0 bg-gradient-to-l from-transparent via-cyan-300/40 to-transparent animate-pulse"
                            style={{ animationDuration: '3s' }}
                          />
                        </div>
                        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-900 text-xs font-bold">
                          {Math.round((attack.f5 / 134799) * 100)}%
                        </div>
                      </div>
                      <span className="text-cyan-300 text-xs font-semibold">
                        {attack.f5}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-8 mt-6 pt-4 border-t border-slate-700/50">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-500 rounded shadow-sm shadow-purple-500/50" />
                  <span className="text-purple-300 text-xs font-400">
                    Cloudflare WAF
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-cyan-500 rounded shadow-sm shadow-cyan-500/50" />
                  <span className="text-cyan-300 text-xs font-400">F5 WAF</span>
                </div>
              </div>
            </div>

            {/* Global Threat Dashboard - Full Screen */}
            <div className="mt-8">
              <GlobalThreatDashboard
                cloudflareThreatOrigins={cloudflareThreatOrigins}
                f5ThreatOrigins={threatOrigins}
              />
            </div>

            {/* 流量防禦對比 - Mirror Chart */}
            <div className="p-6 bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/60 border-2 border-purple-500/40 rounded-lg backdrop-blur-md shadow-lg shadow-purple-500/10 mt-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-purple-300 text-base font-bold tracking-wider">
                    流量防禦對比
                  </div>
                  <div className="text-purple-400/60 text-xs tracking-wider">
                    Traffic Defense Comparison
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-2 bg-cyan-400 rounded shadow-sm shadow-cyan-400/50" />
                    <span className="text-xs text-cyan-300 font-400">
                      F5 LTM 總請求數
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-2 bg-purple-500 rounded shadow-sm shadow-purple-500/50" />
                    <span className="text-xs text-purple-300 font-400">
                      Cloudflare DDoS 清洗
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-2 bg-pink-500 rounded shadow-sm shadow-pink-500/50" />
                    <span className="text-xs text-pink-300 font-400">
                      Cloudflare WAF 阻擋
                    </span>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart
                  data={ddosTrafficData}
                  margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
                >
                  <defs>
                    <filter id="chartGlow">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <linearGradient
                      id="f5LtmGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="rgba(68, 230, 255, 0.75)" />
                      <stop offset="50%" stopColor="rgba(68, 230, 255, 0.35)" />
                      <stop
                        offset="100%"
                        stopColor="rgba(68, 230, 255, 0.03)"
                      />
                    </linearGradient>
                    <linearGradient
                      id="cloudflareInboundGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="rgba(153, 78, 229, 0.7)" />
                      <stop offset="50%" stopColor="rgba(153, 78, 229, 0.3)" />
                      <stop
                        offset="100%"
                        stopColor="rgba(153, 78, 229, 0.03)"
                      />
                    </linearGradient>
                    <linearGradient
                      id="cloudflareWafGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="rgba(236, 72, 153, 0.7)" />
                      <stop offset="50%" stopColor="rgba(236, 72, 153, 0.3)" />
                      <stop
                        offset="100%"
                        stopColor="rgba(236, 72, 153, 0.03)"
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#334155"
                    opacity={0.3}
                  />
                  <line
                    x1="0"
                    y1="50%"
                    x2="100%"
                    y2="50%"
                    stroke="#6366f1"
                    strokeWidth="1.5"
                    strokeDasharray="5 5"
                    opacity="0.5"
                  />

                  <XAxis
                    dataKey="time"
                    stroke="#64748b"
                    style={{ fontSize: '11px' }}
                    tick={{ fill: '#94a3b8' }}
                    axisLine={{ stroke: '#475569' }}
                  />
                  <YAxis
                    stroke="#64748b"
                    style={{ fontSize: '11px' }}
                    tick={{ fill: '#94a3b8' }}
                    domain={[-12, 6]}
                    ticks={[-12, -9, -6, -3, 0, 3, 6]}
                    axisLine={{ stroke: '#475569' }}
                    label={{
                      value: 'Gbps',
                      angle: -90,
                      position: 'insideLeft',
                      fill: '#94a3b8',
                      style: { fontSize: '11px', fontWeight: '600' },
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: '2px solid #a855f7',
                      borderRadius: '8px',
                      fontSize: '11px',
                      boxShadow: '0 0 20px rgba(168, 85, 247, 0.3)',
                    }}
                    labelStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
                    formatter={(value: number) => Math.abs(value).toFixed(1)}
                  />

                  <Area
                    type="monotone"
                    dataKey="f5Ltm"
                    stroke="#44e6ff"
                    strokeWidth={3}
                    fill="url(#f5LtmGradient)"
                    name="F5 LTM"
                    filter="url(#chartGlow)"
                  />

                  <Area
                    type="monotone"
                    dataKey={(data) => -data.cloudflareInbound}
                    stroke="#994ee5"
                    strokeWidth={2.5}
                    fill="url(#cloudflareInboundGradient)"
                    name="Cloudflare DDoS"
                    filter="url(#chartGlow)"
                  />

                  <Area
                    type="monotone"
                    dataKey={(data) =>
                      -(data.cloudflareInbound + data.cloudflareWaf)
                    }
                    stroke="#ec4899"
                    strokeWidth={2.5}
                    fill="url(#cloudflareWafGradient)"
                    name="Cloudflare WAF"
                    filter="url(#chartGlow)"
                  />
                </AreaChart>
              </ResponsiveContainer>

              <div className="mt-4 p-3 bg-slate-800/40 rounded flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-4 rounded-full bg-orange-400 animate-pulse"
                    style={{ animationDuration: '1.5s' }}
                  />
                  <span className="text-slate-300 text-xs">
                    攻擊佔比 Attack Ratio
                  </span>
                </div>
                <div className="text-orange-400 font-bold text-sm">
                  {Math.round(
                    (cloudflareThreatOrigins.reduce(
                      (sum, item) => sum + item.value,
                      0,
                    ) /
                      (cloudflareThreatOrigins.reduce(
                        (sum, item) => sum + item.value,
                        0,
                      ) +
                        threatOrigins.reduce(
                          (sum, item) => sum + item.value,
                          0,
                        ))) *
                      100,
                  )}
                  %
                </div>
              </div>
            </div>

            {/* Statistics Panels Section */}
            <div className="grid grid-cols-2 gap-8 mt-8">
              {/* LEFT PANEL: Cloudflare Security Intelligence */}
              <div className="space-y-6">
                {/* Status Cards */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Mitigation Status */}
                  <div className="group p-5 bg-slate-900/70 backdrop-blur-md border border-orange-500/30 rounded-lg hover:border-orange-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20">
                    <div className="mb-2 text-xs font-normal text-slate-300">
                      當前狀態
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <svg
                          className="w-6 h-6 text-orange-400 animate-pulse"
                          style={{ animationDuration: '2s' }}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          role="img"
                          aria-label="防護盾牌圖示"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                        <div className="text-orange-300 font-medium text-base">
                          攻擊緩解中
                        </div>
                      </div>
                      <div className="text-emerald-400 font-bold text-2xl tabular-nums transition-all duration-300 group-hover:scale-110">
                        67%
                      </div>
                    </div>
                  </div>

                  {/* Interception Rate */}
                  <div className="group p-5 bg-slate-900/40 border border-cyan-500/30 rounded-lg backdrop-blur-sm hover:border-cyan-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20">
                    <div className="mb-2 text-xs text-slate-300">攔截率</div>
                    <div className="text-emerald-400 text-3xl font-bold tracking-tight mb-1 transition-all duration-300 group-hover:scale-110">
                      99.8%
                    </div>
                    <div className="text-xs text-emerald-400">狀態: 極佳</div>
                  </div>
                </div>

                {/* CDN Cache Hit Rate Gauge */}
                <div className="p-6 bg-slate-900/40 border border-purple-500/30 rounded-lg backdrop-blur-sm">
                  <div className="text-purple-300 text-sm mb-4 tracking-wider">
                    CDN 快取命中率
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="relative w-48 h-48">
                      <svg
                        className="w-full h-full transform -rotate-90"
                        viewBox="0 0 120 120"
                        role="img"
                        aria-label="CDN 快取命中率圖表"
                      >
                        <defs>
                          <linearGradient
                            id="purpleGaugeGradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                          >
                            <stop offset="0%" stopColor="#c084fc" />
                            <stop offset="50%" stopColor="#a855f7" />
                            <stop offset="100%" stopColor="#9333ea" />
                          </linearGradient>
                          <filter id="purpleGaugeGlow">
                            <feGaussianBlur
                              stdDeviation="3"
                              result="coloredBlur"
                            />
                            <feMerge>
                              <feMergeNode in="coloredBlur" />
                              <feMergeNode in="SourceGraphic" />
                            </feMerge>
                          </filter>
                          <radialGradient id="purplePulseGlow">
                            <stop
                              offset="0%"
                              stopColor="#c084fc"
                              stopOpacity="0.8"
                            />
                            <stop
                              offset="100%"
                              stopColor="#c084fc"
                              stopOpacity="0"
                            />
                          </radialGradient>
                        </defs>
                        <circle
                          cx="60"
                          cy="60"
                          r="52"
                          fill="none"
                          stroke="#2d3748"
                          strokeWidth="10"
                        />
                        <circle
                          cx="60"
                          cy="60"
                          r="52"
                          fill="none"
                          stroke="url(#purpleGaugeGradient)"
                          strokeWidth="10"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 52}`}
                          strokeDashoffset={`${2 * Math.PI * 52 * (1 - cloudflareMetrics.cacheEfficiency / 100)}`}
                          filter="url(#purpleGaugeGlow)"
                          className="transition-all duration-1000 ease-out"
                        />
                        <circle
                          cx="60"
                          cy="60"
                          r="45"
                          fill="url(#purplePulseGlow)"
                          opacity="0.3"
                        >
                          <animate
                            attributeName="r"
                            values="45;50;45"
                            dur="2s"
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="opacity"
                            values="0.3;0.1;0.3"
                            dur="2s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div
                          className="text-purple-200 text-4xl font-bold tracking-tight animate-pulse"
                          style={{ animationDuration: '2s' }}
                        >
                          {cloudflareMetrics.cacheEfficiency}%
                        </div>
                        <div className="text-purple-400 text-xs mt-2 tracking-wider">
                          命中率
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center mt-3">
                    <span className="text-emerald-400 text-xs">狀態: 極佳</span>
                  </div>
                </div>
              </div>

              {/* RIGHT PANEL: F5 Network Intelligence */}
              <div className="space-y-6">
                {/* Status Cards */}
                <div className="grid grid-cols-2 gap-4">
                  {/* WAF Attacks */}
                  <div className="group p-5 bg-slate-900/40 border border-cyan-500/30 rounded-lg backdrop-blur-sm hover:border-red-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20">
                    <div className="mb-2 text-xs text-slate-300">
                      WAF 攻擊總數
                    </div>
                    <div className="text-white text-3xl font-bold tracking-tight mb-1 transition-all duration-300 group-hover:scale-110 tabular-nums">
                      134,799
                    </div>
                    <div className="text-xs text-red-400">已攔截</div>
                  </div>

                  {/* Response Time */}
                  <div className="group p-5 bg-slate-900/40 border border-cyan-500/30 rounded-lg backdrop-blur-sm hover:border-emerald-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20">
                    <div className="mb-2 text-xs text-slate-300">
                      平均響應時間
                    </div>
                    <div className="text-white text-3xl font-bold tracking-tight mb-1 transition-all duration-300 group-hover:scale-110 tabular-nums">
                      246ms
                    </div>
                    <div className="text-xs text-emerald-400">良好</div>
                  </div>
                </div>

                {/* F5 Defense Success Rate Gauge */}
                <div className="p-6 bg-slate-900/40 border border-cyan-500/30 rounded-lg backdrop-blur-sm">
                  <div className="text-cyan-300 text-sm mb-4 tracking-wider">
                    F5 防護成功率
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="relative w-48 h-48">
                      <svg
                        className="w-full h-full transform -rotate-90"
                        viewBox="0 0 120 120"
                        role="img"
                        aria-label="F5 防護成功率圖表"
                      >
                        <defs>
                          <linearGradient
                            id="cyanGaugeGradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                          >
                            <stop offset="0%" stopColor="#22d3ee" />
                            <stop offset="50%" stopColor="#06b6d4" />
                            <stop offset="100%" stopColor="#0891b2" />
                          </linearGradient>
                          <filter id="cyanGaugeGlow">
                            <feGaussianBlur
                              stdDeviation="3"
                              result="coloredBlur"
                            />
                            <feMerge>
                              <feMergeNode in="coloredBlur" />
                              <feMergeNode in="SourceGraphic" />
                            </feMerge>
                          </filter>
                          <radialGradient id="cyanPulseGlow">
                            <stop
                              offset="0%"
                              stopColor="#22d3ee"
                              stopOpacity="0.8"
                            />
                            <stop
                              offset="100%"
                              stopColor="#22d3ee"
                              stopOpacity="0"
                            />
                          </radialGradient>
                        </defs>
                        <circle
                          cx="60"
                          cy="60"
                          r="52"
                          fill="none"
                          stroke="#1e293b"
                          strokeWidth="10"
                        />
                        <circle
                          cx="60"
                          cy="60"
                          r="52"
                          fill="none"
                          stroke="url(#cyanGaugeGradient)"
                          strokeWidth="10"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 52}`}
                          strokeDashoffset={`${2 * Math.PI * 52 * (1 - 0.998)}`}
                          filter="url(#cyanGaugeGlow)"
                          className="transition-all duration-1000 ease-out"
                        />
                        <circle
                          cx="60"
                          cy="60"
                          r="45"
                          fill="url(#cyanPulseGlow)"
                          opacity="0.3"
                        >
                          <animate
                            attributeName="r"
                            values="45;50;45"
                            dur="2s"
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="opacity"
                            values="0.3;0.1;0.3"
                            dur="2s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div
                          className="text-cyan-200 text-4xl font-bold tracking-tight animate-pulse"
                          style={{ animationDuration: '2s' }}
                        >
                          99.8%
                        </div>
                        <div className="text-cyan-400 text-xs mt-2 tracking-wider">
                          成功率
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center mt-3 text-cyan-400 text-xs tracking-wider">
                    Defense Success Rate
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Analytics Section */}
            <div className="grid grid-cols-2 gap-8 mt-8">
              {/* LEFT: Real-time Traffic Analysis */}
              <div className="p-6 bg-slate-900/40 border border-cyan-500/30 rounded-lg backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-cyan-300 text-sm mb-4 tracking-wider">
                      即時流量分析 (近60分鐘)
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-2 bg-emerald-400 rounded" />
                      <span className="text-xs text-emerald-300">正常流量</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-2 bg-red-400 rounded" />
                      <span className="text-xs text-red-300">攻擊流量</span>
                    </div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart
                    data={mirroredTrafficData}
                    margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                  >
                    <defs>
                      <linearGradient
                        id="cleanTrafficGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#10b981"
                          stopOpacity={0.6}
                        />
                        <stop
                          offset="95%"
                          stopColor="#10b981"
                          stopOpacity={0.05}
                        />
                      </linearGradient>
                      <linearGradient
                        id="attackTrafficGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#ef4444"
                          stopOpacity={0.7}
                        />
                        <stop
                          offset="95%"
                          stopColor="#ef4444"
                          stopOpacity={0.05}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#334155"
                      opacity={0.2}
                    />
                    <XAxis
                      dataKey="time"
                      stroke="#64748b"
                      tick={{ fill: '#94a3b8', fontSize: 10 }}
                    />
                    <YAxis
                      stroke="#64748b"
                      tick={{ fill: '#94a3b8', fontSize: 10 }}
                      label={{
                        value: 'Gbps',
                        angle: -90,
                        position: 'insideLeft',
                        fill: '#94a3b8',
                        fontSize: 10,
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        border: '1px solid #06b6d4',
                        borderRadius: '6px',
                        fontSize: '11px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="cleanTraffic"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      fill="url(#cleanTrafficGradient)"
                      name="正常流量"
                    />
                    <Area
                      type="monotone"
                      dataKey="attackTraffic"
                      stroke="#ef4444"
                      strokeWidth={2.5}
                      fill="url(#attackTrafficGradient)"
                      name="攻擊流量"
                    />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="mt-4 bg-cyan-950/30">
                  <div className="text-cyan-400 text-xs leading-relaxed">
                    <span className="font-base">AI 洞察：</span>攻擊流量在 15
                    分鐘前達到峰值，目前已經較平緩。清洗中心已有效過濾 99.8%
                    的惡意流量。
                  </div>
                </div>
              </div>

              {/* RIGHT: Pool Health Status */}
              <div className="p-6 bg-slate-900/40 border border-cyan-500/30 rounded-lg backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-6">
                  <div className="text-cyan-300 text-sm tracking-wider">
                    Pool健康狀態
                  </div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                </div>
                <div className="flex items-center justify-center mb-6">
                  <div className="relative w-48 h-48">
                    <svg
                      className="w-full h-full transform -rotate-90"
                      viewBox="0 0 120 120"
                      role="img"
                      aria-label="Pool 健康狀態圖表"
                    >
                      <defs>
                        <linearGradient
                          id="healthyGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#22d3ee" />
                          <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>
                        <linearGradient
                          id="warningGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#f59e0b" />
                          <stop offset="100%" stopColor="#d97706" />
                        </linearGradient>
                        <linearGradient
                          id="offlineGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#ef4444" />
                          <stop offset="100%" stopColor="#dc2626" />
                        </linearGradient>
                        <filter id="poolGlow">
                          <feGaussianBlur
                            stdDeviation="3"
                            result="coloredBlur"
                          />
                          <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                        <radialGradient id="poolPulseGlow">
                          <stop
                            offset="0%"
                            stopColor="#22d3ee"
                            stopOpacity="0.6"
                          />
                          <stop
                            offset="100%"
                            stopColor="#22d3ee"
                            stopOpacity="0"
                          />
                        </radialGradient>
                      </defs>

                      {/* Background ring */}
                      <circle
                        cx="60"
                        cy="60"
                        r="52"
                        fill="none"
                        stroke="#1e293b"
                        strokeWidth="10"
                      />

                      {/* Healthy segment - 85% */}
                      <circle
                        cx="60"
                        cy="60"
                        r="52"
                        fill="none"
                        stroke="url(#healthyGradient)"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 52 * 0.85} ${2 * Math.PI * 52}`}
                        strokeDashoffset="0"
                        filter="url(#poolGlow)"
                        className="transition-all duration-1000 ease-out"
                      />

                      {/* Warning segment - 10% */}
                      <circle
                        cx="60"
                        cy="60"
                        r="52"
                        fill="none"
                        stroke="url(#warningGradient)"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 52 * 0.1} ${2 * Math.PI * 52}`}
                        strokeDashoffset={`-${2 * Math.PI * 52 * 0.85}`}
                        filter="url(#poolGlow)"
                        className="transition-all duration-1000 ease-out"
                      />

                      {/* Offline segment - 5% */}
                      <circle
                        cx="60"
                        cy="60"
                        r="52"
                        fill="none"
                        stroke="url(#offlineGradient)"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 52 * 0.05} ${2 * Math.PI * 52}`}
                        strokeDashoffset={`-${2 * Math.PI * 52 * 0.95}`}
                        filter="url(#poolGlow)"
                        className="transition-all duration-1000 ease-out"
                      />

                      {/* Pulsing glow */}
                      <circle
                        cx="60"
                        cy="60"
                        r="42"
                        fill="url(#poolPulseGlow)"
                        opacity="0.4"
                      >
                        <animate
                          attributeName="r"
                          values="42;48;42"
                          dur="2.5s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          values="0.4;0.15;0.4"
                          dur="2.5s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div
                        className="text-cyan-100 text-4xl font-bold tracking-tight animate-pulse"
                        style={{ animationDuration: '2s' }}
                      >
                        85%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-6 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-cyan-400 rounded-sm" />
                    <span className="text-slate-300">健康 (85%)</span>
                    <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 rounded text-[10px] font-semibold">
                      ACTIVE
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-amber-500 rounded-sm" />
                    <span className="text-slate-300">警告 (10%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-sm" />
                    <span className="text-slate-300">離線 (5%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer with Enhanced Glassmorphism */}
      <footer className="relative z-10 border-t border-cyan-500/20 backdrop-blur-2xl bg-slate-950/60 mt-8 shadow-lg shadow-cyan-500/5">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-cyan-500/5 to-purple-500/5" />
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="text-slate-400 text-sm">
              © 2024 ADA Technologies. All rights reserved.
            </div>
            <div className="text-slate-500 text-xs">
              War Room Dashboard v2.0
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
