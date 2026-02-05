'use client';

import { geoMercator } from 'd3-geo';
import { motion } from 'framer-motion';
import maplibregl from 'maplibre-gl';
import { useEffect, useRef, useState } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';

const attackCities: Array<{
  name: string;
  country: string;
  coords: [number, number];
  system: string;
}> = [
  {
    name: 'New York',
    country: 'USA',
    coords: [-74.006, 40.7128],
    system: 'cloudflare',
  },
  { name: 'London', country: 'UK', coords: [-0.1276, 51.5074], system: 'f5' },
  {
    name: 'Beijing',
    country: 'China',
    coords: [116.4074, 39.9042],
    system: 'cloudflare',
  },
  {
    name: 'Tokyo',
    country: 'Japan',
    coords: [139.6917, 35.6895],
    system: 'f5',
  },
  {
    name: 'Moscow',
    country: 'Russia',
    coords: [37.6173, 55.7558],
    system: 'cloudflare',
  },
  { name: 'Mumbai', country: 'India', coords: [72.8777, 19.076], system: 'f5' },
  {
    name: 'Sydney',
    country: 'Australia',
    coords: [151.2093, -33.8688],
    system: 'cloudflare',
  },
  {
    name: 'São Paulo',
    country: 'Brazil',
    coords: [-46.6333, -23.5505],
    system: 'f5',
  },
  {
    name: 'Berlin',
    country: 'Germany',
    coords: [13.405, 52.52],
    system: 'cloudflare',
  },
  {
    name: 'Singapore',
    country: 'Singapore',
    coords: [103.8198, 1.3521],
    system: 'f5',
  },
];

const taipei: { coords: [number, number]; name: string } = {
  coords: [121.5654, 25.033],
  name: 'Taipei',
};

interface Attack {
  id: string;
  source: { name: string; country: string; coords: [number, number] };
  target: { coords: [number, number]; name: string };
  system: 'cloudflare' | 'f5';
  timestamp: string;
  progress: number;
}

interface AttackLog {
  id: string;
  time: string;
  source: string;
  target: string;
  type: string;
  system: 'cloudflare' | 'f5';
}

interface ThreatData {
  name: string;
  value: number;
  color: string;
}

export function GlobalThreatDashboard({
  cloudflareThreatOrigins,
  f5ThreatOrigins,
}: {
  cloudflareThreatOrigins: ThreatData[];
  f5ThreatOrigins: ThreatData[];
}) {
  const [attacks, setAttacks] = useState<Attack[]>([]);
  const [attackLogs, setAttackLogs] = useState<AttackLog[]>([]);
  const [ripples, setRipples] = useState<
    { id: string; system: 'cloudflare' | 'f5' }[]
  >([]);
  const svgRef = useRef<SVGSVGElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  // D3 projection - centered on Taipei for accurate positioning
  const width = 1200;
  const height = 500;
  const projection = geoMercator()
    .center([100, 20])
    .scale(180)
    .translate([width / 2, height / 2]);

  // Convert lat/long to SVG coordinates
  const projectCoords = (coords: [number, number]) => {
    const projected = projection(coords);
    return projected || [0, 0];
  };

  // Generate Bezier curve path
  const generateCurvePath = (
    start: [number, number],
    end: [number, number],
  ) => {
    const [x1, y1] = projectCoords(start);
    const [x2, y2] = projectCoords(end);
    const midX = (x1 + x2) / 2;
    const midY = Math.min(y1, y2) - 100; // Arc upward
    return `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`;
  };

  // Attack simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const randomCity =
        attackCities[Math.floor(Math.random() * attackCities.length)];
      const system = Math.random() > 0.5 ? 'cloudflare' : 'f5';
      const attackId = `attack-${Date.now()}-${Math.random()}`;

      const newAttack: Attack = {
        id: attackId,
        source: randomCity,
        target: taipei,
        system,
        timestamp: new Date().toLocaleTimeString(),
        progress: 0,
      };

      setAttacks((prev) => [...prev, newAttack]);

      // Add to log
      const logEntry: AttackLog = {
        id: attackId,
        time: new Date().toLocaleTimeString('en-US', { hour12: false }),
        source: `${randomCity.name} (${randomCity.country})`,
        target: 'Taipei (Taiwan)',
        type: system === 'cloudflare' ? 'DDoS' : 'SQL Injection',
        system,
      };
      setAttackLogs((prev) => [logEntry, ...prev].slice(0, 20));

      // Animate attack progress
      const duration = 2000;
      const startTime = Date.now();
      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / duration) * 100, 100);

        setAttacks((prev) =>
          prev.map((a) => (a.id === attackId ? { ...a, progress } : a)),
        );

        if (progress >= 100) {
          clearInterval(progressInterval);
          // Trigger ripple effect
          setRipples((prev) => [
            ...prev,
            { id: `ripple-${Date.now()}`, system },
          ]);
          setTimeout(() => {
            setRipples((prev) =>
              prev.filter((r) => r.id !== `ripple-${Date.now()}`),
            );
          }, 1500);
          // Remove attack after completion
          setTimeout(() => {
            setAttacks((prev) => prev.filter((a) => a.id !== attackId));
          }, 500);
        }
      }, 50);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  // Initialize MapLibre GL map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map with demo style (CSS filters applied via container for dark theme)
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [100, 20],
      zoom: 1.5,
      interactive: false,
    });

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full bg-slate-900/40 border-2 border-indigo-500/30 rounded-lg backdrop-blur-md shadow-lg shadow-indigo-500/10 overflow-hidden">
      {/* Title Section */}
      <div className="p-4 border-b border-indigo-500/30 bg-slate-900/60">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-indigo-300 text-lg font-bold tracking-wider">
              全球攻擊來源分布
            </div>
            <div className="text-indigo-400/60 text-xs tracking-wider">
              Global Attack Source Distribution
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
            <span className="text-yellow-300 text-xs font-mono">LIVE</span>
          </div>
        </div>
      </div>

      {/* Top Section - World Map */}
      <div className="h-[500px] relative overflow-hidden bg-[#020617]">
        {/* Subtle dotted grid overlay for tech feel */}
        <svg
          className="absolute inset-0 w-full h-full opacity-10"
          viewBox="0 0 1200 500"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="背景網格"
        >
          {Array.from({ length: 40 }, (_, i) => (
            <line
              key={`grid-v-${i * 30}`}
              x1={i * 30}
              y1="0"
              x2={i * 30}
              y2="500"
              stroke="#475569"
              strokeWidth="0.5"
              strokeDasharray="2,4"
            />
          ))}
          {Array.from({ length: 17 }, (_, i) => (
            <line
              key={`grid-h-${i * 30}`}
              x1="0"
              y1={i * 30}
              x2="1200"
              y2={i * 30}
              stroke="#475569"
              strokeWidth="0.5"
              strokeDasharray="2,4"
            />
          ))}
        </svg>
        {/* World Map Background - Using MapLibre GL */}
        <div
          ref={mapContainerRef}
          className="absolute inset-0 w-full h-full opacity-40"
          style={{
            filter: 'grayscale(100%) brightness(0.45) contrast(2.5)',
            mixBlendMode: 'lighten',
          }}
        />

        {/* Overlay SVG for attack lines, markers, and animations */}
        <svg
          ref={svgRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label="全球威脅地圖"
        >
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient
              id="purpleGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#e879f9" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
            <linearGradient
              id="cyanGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>

          {/* Taipei Target */}
          <g>
            <circle
              cx={projectCoords(taipei.coords)[0]}
              cy={projectCoords(taipei.coords)[1]}
              r="8"
              fill="#fbbf24"
              stroke="#fef3c7"
              strokeWidth="2"
              filter="url(#glow)"
            >
              <animate
                attributeName="r"
                values="8;12;8"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle
              cx={projectCoords(taipei.coords)[0]}
              cy={projectCoords(taipei.coords)[1]}
              r="12"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2"
              opacity="0.6"
            >
              <animate
                attributeName="r"
                values="12;20;12"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.6;0;0.6"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <text
              x={projectCoords(taipei.coords)[0] + 15}
              y={projectCoords(taipei.coords)[1] + 5}
              fill="#fef3c7"
              fontSize="14"
              fontWeight="bold"
              fontFamily="JetBrains Mono, monospace"
              filter="url(#glow)"
            >
              {taipei.name}
            </text>
          </g>

          {/* Ripple Effects */}
          {ripples.map((ripple) => (
            <g key={ripple.id}>
              {[0, 1, 2].map((i) => (
                <circle
                  key={i}
                  cx={projectCoords(taipei.coords)[0]}
                  cy={projectCoords(taipei.coords)[1]}
                  r="0"
                  fill="none"
                  stroke={
                    ripple.system === 'cloudflare' ? '#e879f9' : '#22d3ee'
                  }
                  strokeWidth="2"
                  opacity="0.8"
                >
                  <animate
                    attributeName="r"
                    from="0"
                    to="50"
                    dur="1.5s"
                    begin={`${i * 0.3}s`}
                    repeatCount="1"
                  />
                  <animate
                    attributeName="opacity"
                    from="0.8"
                    to="0"
                    dur="1.5s"
                    begin={`${i * 0.3}s`}
                    repeatCount="1"
                  />
                </circle>
              ))}
            </g>
          ))}

          {/* Active Attacks */}
          {attacks.map((attack) => {
            const path = generateCurvePath(
              attack.source.coords,
              attack.target.coords,
            );
            const color =
              attack.system === 'cloudflare' ? '#e879f9' : '#22d3ee';
            const gradientId =
              attack.system === 'cloudflare'
                ? 'purpleGradient'
                : 'cyanGradient';

            return (
              <g key={attack.id}>
                {/* Attack Arc */}
                <motion.path
                  d={path}
                  fill="none"
                  stroke={`url(#${gradientId})`}
                  strokeWidth="2"
                  strokeLinecap="round"
                  filter="url(#glow)"
                  strokeDasharray="1000"
                  strokeDashoffset={1000 - (attack.progress / 100) * 1000}
                  opacity={0.8}
                />
                {/* Glow trail */}
                <motion.path
                  d={path}
                  fill="none"
                  stroke={color}
                  strokeWidth="4"
                  strokeLinecap="round"
                  filter="url(#glow)"
                  strokeDasharray="1000"
                  strokeDashoffset={1000 - (attack.progress / 100) * 1000}
                  opacity={0.3}
                />
                {/* Source marker */}
                <circle
                  cx={projectCoords(attack.source.coords)[0]}
                  cy={projectCoords(attack.source.coords)[1]}
                  r="4"
                  fill={color}
                  filter="url(#glow)"
                >
                  <animate
                    attributeName="r"
                    values="4;6;4"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Bottom Section - Glassmorphism Panel */}
      <div className="backdrop-blur-md bg-slate-900/60 border-t border-indigo-500/30 p-6">
        <div className="grid grid-cols-3 gap-6 mb-5 h-64">
          {/* Column 1 - Cloudflare */}
          <div className="space-y-3">
            <div className="text-purple-400 text-sm font-base tracking-wider font-mono">
              ● Cloudflare TOP 3
            </div>
            {cloudflareThreatOrigins.slice(0, 3).map((threat, index) => (
              <div
                key={threat.name}
                className="p-3 bg-slate-800/60 rounded-lg border border-purple-500/30 backdrop-blur-sm hover:border-purple-500/60 transition-all"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-bold ${
                        index === 0
                          ? 'bg-yellow-500/20 text-yellow-300'
                          : index === 1
                            ? 'bg-gray-400/20 text-gray-300'
                            : 'bg-orange-600/20 text-orange-300'
                      }`}
                    >
                      {index === 0 ? '1st' : index === 1 ? '2nd' : '3rd'}
                    </span>
                    <span className="text-slate-200 font-base text-sm font-mono">
                      {threat.name}
                    </span>
                  </div>
                  <span className="text-purple-400 font-bold text-lg font-mono">
                    {threat.value}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-900/70 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-sm"
                    style={{
                      backgroundColor: '#e879f9',
                      boxShadow: '0 0 10px #e879f980',
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${threat.value}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Column 2 - F5 */}
          <div className="space-y-3">
            <div className="text-cyan-400 text-sm font-base tracking-wider font-mono">
              ● F5 TOP 3
            </div>
            {f5ThreatOrigins.slice(0, 3).map((threat, index) => (
              <div
                key={threat.name}
                className="p-3 bg-slate-800/60 rounded-lg border border-cyan-500/30 backdrop-blur-sm hover:border-cyan-500/60 transition-all"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-bold ${
                        index === 0
                          ? 'bg-yellow-500/20 text-yellow-300'
                          : index === 1
                            ? 'bg-gray-400/20 text-gray-300'
                            : 'bg-orange-600/20 text-orange-300'
                      }`}
                    >
                      {index === 0 ? '1st' : index === 1 ? '2nd' : '3rd'}
                    </span>
                    <span className="text-slate-200 font-base text-sm font-mono">
                      {threat.name}
                    </span>
                  </div>
                  <span className="text-cyan-400 font-bold text-lg font-mono">
                    {threat.value}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-900/70 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      backgroundColor: '#22d3ee',
                      boxShadow: '0 0 10px #22d3ee80',
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${threat.value}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Column 3 - Live Log */}
          <div className="space-y-2 overflow-hidden">
            <div className="text-yellow-300 text-sm font-base tracking-wider font-mono">
              ● Live Attack Log
            </div>
            <div className="h-[calc(100%-2rem)] overflow-y-auto bg-black/40 rounded-lg p-3 border border-cyan-500/30 scrollbar-thin scrollbar-thumb-cyan-500/50 scrollbar-track-transparent">
              {attackLogs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-xs font-mono mb-2 pb-2 border-b border-slate-700/50"
                >
                  <div className="flex gap-2">
                    <span className="text-slate-500">[{log.time}]</span>
                    <span
                      className={
                        log.system === 'cloudflare'
                          ? 'text-purple-300 font-base'
                          : 'text-cyan-300 font-base'
                      }
                    >
                      {log.source}
                    </span>
                    <span className="text-slate-500">→</span>
                    <span className="text-slate-400">{log.target}</span>
                  </div>
                  <div
                    className={`mt-1 ${log.system === 'cloudflare' ? 'text-purple-400' : 'text-cyan-400'}`}
                  >
                    Type: {log.type}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
