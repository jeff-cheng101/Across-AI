"use client"

import type React from "react"
import { motion } from "framer-motion"
import { useEffect, useState, useRef } from "react"
import { Sparkles, Database, LineChart, CaptionsIcon, BookOpen, Brain } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import BottomLines from "@/components/bottom-lines"

interface Platform {
  name: string
  icon: string
  color: string
  subtitle?: string
}

interface CurvePoint {
  startX: number
  startY: number
  endX: number
  endY: number
}

interface DataToCenterCurve {
  startX: number
  startY: number
  endX: number
  endY: number
}

interface CenterToAnalysisCurve {
  startX: number
  startY: number
  endX: number
  endY: number
}

interface AnalysisToButtonCurve {
  startX: number
  startY: number
  endX: number
  endY: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [curvePoints, setCurvePoints] = useState<CurvePoint[]>([])
  const [dataToCenterCurve, setDataToCenterCurve] = useState<DataToCenterCurve | null>(null)
  const [centerToAnalysisCurve, setCenterToAnalysisCurve] = useState<CenterToAnalysisCurve | null>(null)
  const [analysisToButtonCurves, setAnalysisToButtonCurves] = useState<AnalysisToButtonCurve[]>([])

  const platformRefs = useRef<(HTMLDivElement | null)[]>([])
  const centerRef = useRef<HTMLDivElement>(null)
  const dataCircleRef = useRef<HTMLDivElement>(null)
  const analysisCircleRef = useRef<HTMLDivElement>(null)
  const actionButtonRefs = useRef<(HTMLDivElement | null)[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const calculateCurvePoints = () => {
      if (!containerRef.current || !centerRef.current || !dataCircleRef.current || !analysisCircleRef.current) return

      const containerRect = containerRef.current.getBoundingClientRect()
      const centerRect = centerRef.current.getBoundingClientRect()
      const dataCircleRect = dataCircleRef.current.getBoundingClientRect()
      const analysisCircleRect = analysisCircleRef.current.getBoundingClientRect()

      const centerX = centerRect.left - containerRect.left
      const centerY = centerRect.top + centerRect.height / 2 - containerRect.top

      const dataCircleX = dataCircleRect.left + dataCircleRect.width / 2 - containerRect.left
      const dataCircleY = dataCircleRect.top + dataCircleRect.height / 2 - containerRect.top

      const analysisCircleX = analysisCircleRect.left + analysisCircleRect.width / 2 - containerRect.left
      const analysisCircleY = analysisCircleRect.top + analysisCircleRect.height / 2 - containerRect.top

      const points: CurvePoint[] = platformRefs.current.map((ref) => {
        if (!ref) return { startX: 0, startY: 0, endX: 0, endY: 0 }

        const rect = ref.getBoundingClientRect()
        const startX = rect.right - containerRect.left
        const startY = rect.top + rect.height / 2 - containerRect.top

        return {
          startX,
          startY,
          endX: dataCircleX,
          endY: dataCircleY,
        }
      })

      setCurvePoints(points)

      setDataToCenterCurve({
        startX: dataCircleX,
        startY: dataCircleY,
        endX: centerX,
        endY: centerY,
      })

      setCenterToAnalysisCurve({
        startX: centerX + 120,
        startY: centerY,
        endX: analysisCircleX,
        endY: analysisCircleY,
      })

      const buttonCurves: AnalysisToButtonCurve[] = actionButtonRefs.current
        .map((ref) => {
          if (!ref) return null

          const rect = ref.getBoundingClientRect()
          const endX = rect.left - containerRect.left
          const endY = rect.top + rect.height / 2 - containerRect.top

          return {
            startX: analysisCircleX,
            startY: analysisCircleY,
            endX,
            endY,
          }
        })
        .filter((curve): curve is AnalysisToButtonCurve => curve !== null)

      setAnalysisToButtonCurves(buttonCurves)
    }

    calculateCurvePoints()

    window.addEventListener("resize", calculateCurvePoints)

    const timer = setTimeout(calculateCurvePoints, 100)

    return () => {
      window.removeEventListener("resize", calculateCurvePoints)
      clearTimeout(timer)
    }
  }, [mounted])

  const platforms: Platform[] = [
    {
      name: "Cloudflare",
      icon: "/logos/Cloudflar.png",
      color: "#F38020",
      subtitle: "WAF DDoS CDN 活動中",
    },
    {
      name: "Palo Alto",
      icon: "/logos/palo-alto-networks-1.png",
      color: "#FFFFFF",
      subtitle: "Cortex 活動中",
    },
    {
      name: "F5",
      icon: "/logos/f5_b.png",
      color: "#E30613",
      subtitle: "LTM 活動中",
    },
    {
      name: "CATO Networks",
      icon: "/logos/cato-networks.png",
      color: "#3FA896",
      subtitle: "SASE 活動中",
    },
    {
      name: "INTEZER AI",
      icon: "/logos/INTEZER_logo.png",
      color: "#2E8FE5",
      subtitle: "活動中",
    },
    {
      name: "CyCraftAI",
      icon: "/logos/craftai.png",
      color: "#00D9FF",
      subtitle: "威脅情資 活動中",
    },
    {
      name: "Custom SIEM",
      icon: "scrolltext",
      color: "#32CD32",
      subtitle: "日誌分析 活動中",
    },
  ]

  const handleDataCircleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    router.push("/elk")
  }

  const handleCloudflareClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    router.push("/dashboard/cloudflare")
  }

  const handleCatoClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    router.push("/dashboard/cato")
  }

  const handleF5Click = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    router.push("/dashboard/f5")
  }

  const handlePaloAltoClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    router.push("/dashboard/paloalto")
  }

  const handleAgentClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    router.push("/dify")
    // window.open("https://twister5.phison.com/app/9dd18b0d-460b-44f3-a6fb-88bb8a76ad22/workflow", "_blank")
  }

  const handleKBRAGClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    router.push("/kb-rag")
    // window.open("https://twister5.phison.com/datasets", "_blank")
  }

  const handleAIAnalysisClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    router.push("/ai-analysis/cloudflare")
  }

  const handlePromptLibraryClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    router.push("/prompt-library/cloudflare")
  }

  const handleAILibraryClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    router.push("/ai-library")
  }

  return (
    <div className="size-full flex items-center justify-center relative overflow-hidden pt-12 pb-12">
      <div className="absolute inset-0 bg-[#08131D]" />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={mounted ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="absolute top-6 right-8 z-30 flex flex-row gap-3"
      >
        <div className="backdrop-blur-md bg-slate-900/40 border border-white/10 rounded-lg px-4 py-2.5">
          <div className="text-[10px] text-slate-400 mb-0.5">7個資安來源</div>
          <div className="flex items-baseline gap-2">
            <div className="text-xs text-slate-300">今日事件</div>
            <div className="text-xl font-bold text-[#45A4C0]">95</div>
            <div className="text-[10px] text-slate-400">件</div>
          </div>
        </div>

        <div className="backdrop-blur-md bg-slate-900/40 border border-cyan-400/30 rounded-lg px-4 py-2.5">
          <div className="text-[10px] text-slate-400 mb-0.5">AI分析總計</div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-bold text-white">1000+</div>
            <div className="text-[10px] text-slate-400">事件</div>
          </div>
        </div>

        <div className="backdrop-blur-md bg-slate-900/40 border border-green-400/30 rounded-lg px-4 py-2.5">
          <div className="text-[10px] text-slate-400 mt-0.5">攻擊事件</div>
          <div className="flex items-baseline gap-2">
            <div className="text-xs text-green-400">已阻擋</div>
            <div className="text-xl font-bold text-green-400">400+</div>
          </div>
        </div>
      </motion.div>

      <div
        ref={containerRef}
        className="relative z-10 w-full max-w-6xl px-8 flex items-center justify-between translate-y-10 py-[px] my-10 h-full mb-16"
      >
        <div className="flex flex-col gap-3 relative">
          {platforms.map((platform, index) => (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, x: -50 }}
              animate={mounted ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="flex items-center gap-2 relative"
              ref={(el) => (platformRefs.current[index] = el)}
            >
              <div
                onClick={
                  platform.name === "Cloudflare"
                    ? handleCloudflareClick
                    : platform.name === "CATO Networks"
                      ? handleCatoClick
                      : platform.name === "F5"
                        ? handleF5Click
                        : platform.name === "Palo Alto"
                          ? handlePaloAltoClick
                          : undefined
                }
                className={`flex items-center gap-2 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-white/20 hover:border-emerald-500/50 hover:bg-white/5 transition-all duration-300 w-[160px] ${platform.name === "Cloudflare" || platform.name === "CATO Networks" || platform.name === "F5" || platform.name === "Palo Alto" ? "cursor-pointer" : ""}`}
                style={{
                  boxShadow: "0 0 15px rgba(255, 255, 255, 0.1)",
                }}
              >
                <div className="w-6 h-6 rounded flex items-center justify-center">
                  {platform.name === "Cloudflare" && (
                    <Image
                      src="/logos/Cloudflar.png"
                      alt="Cloudflare"
                      width={24}
                      height={24}
                      className="object-contain"
                      style={{ mixBlendMode: "multiply" }}
                    />
                  )}
                  {platform.name === "Palo Alto" && (
                    <Image
                      src="/logos/palo-alto-networks-1.png"
                      alt="Palo Alto"
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  )}
                  {platform.name === "F5" && (
                    <Image src="/logos/f5_b.png" alt="F5" width={24} height={24} className="object-contain" />
                  )}
                  {platform.name === "CATO Networks" && (
                    <Image
                      src="/logos/cato-networks.png"
                      alt="CATO Networks"
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  )}
                  {platform.name === "INTEZER AI" && (
                    <Image
                      src="/logos/INTEZER_logo.png"
                      alt="INTEZER AI"
                      width={16}
                      height={16}
                      className="object-contain"
                    />
                  )}
                  {platform.name === "CyCraftAI" && (
                    <Image src="/logos/craftai.png" alt="CyCraftAI" width={24} height={24} className="object-contain" />
                  )}
                  {platform.name === "Custom SIEM" && (
                    <CaptionsIcon className="w-5 h-5 text-[#32CD32] text-foreground" />
                  )}
                </div>

                <div className="flex flex-col">
                  <span className="text-white text-xs">{platform.name}</span>
                  {platform.subtitle && <span className="text-[10px] text-slate-400">{platform.subtitle}</span>}
                </div>
              </div>

              <motion.div
                initial={{ scale: 0 }}
                animate={mounted ? { scale: 1 } : {}}
                transition={{
                  delay: 0.5 + index * 0.1,
                  duration: 0.3,
                }}
                className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]"
              />
            </motion.div>
          ))}
        </div>

        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
          <defs>
            {platforms.map((_, index) => (
              <linearGradient
                key={`gradient-${index}`}
                id={`curve-gradient-${index}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
            ))}

            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {curvePoints.map((point, index) => {
            if (!point || point.startX === 0 || point.endX === 0) return null

            const controlX1 = point.startX + (point.endX - point.startX) * 0.4
            const controlX2 = point.startX + (point.endX - point.startX) * 0.6
            const pathId = `curve-path-${index}`
            const pathD = `M ${point.startX} ${point.startY} C ${controlX1} ${point.startY}, ${controlX2} ${point.endY}, ${point.endX} ${point.endY}`

            return (
              <g key={`curve-group-${index}`}>
                <motion.path
                  id={pathId}
                  d={pathD}
                  stroke={`url(#curve-gradient-${index})`}
                  strokeWidth="2"
                  fill="none"
                  filter="url(#glow)"
                  initial={false}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    delay: mounted ? 0.6 + index * 0.1 : 0,
                    duration: mounted ? 1.2 : 0.3,
                    ease: "easeInOut",
                  }}
                />

                {[0, 1, 2].map((particleIndex) => (
                  <motion.circle
                    key={`particle-${index}-${particleIndex}`}
                    r="3"
                    fill="#ffffff"
                    filter="url(#glow)"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: [0, 1, 1, 0],
                    }}
                    transition={{
                      delay: mounted ? 1 + index * 0.3 + particleIndex * 1.8 : 0,
                      duration: 6,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatDelay: 0,
                      ease: "linear",
                    }}
                  >
                    <animateMotion
                      dur="6s"
                      repeatCount="indefinite"
                      begin={`${1 + index * 0.3 + particleIndex * 1.8}s`}
                    >
                      <mpath href={`#${pathId}`} />
                    </animateMotion>
                  </motion.circle>
                ))}
              </g>
            )
          })}

          {dataToCenterCurve && dataToCenterCurve.startX !== 0 && dataToCenterCurve.endX !== 0 && (
            <g key="data-to-center-curve">
              <linearGradient id="data-to-center-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>

              <motion.path
                id="data-to-center-path"
                d={`M ${dataToCenterCurve.startX} ${dataToCenterCurve.startY} C ${dataToCenterCurve.startX + (dataToCenterCurve.endX - dataToCenterCurve.startX) * 0.4} ${dataToCenterCurve.startY}, ${dataToCenterCurve.startX + (dataToCenterCurve.endX - dataToCenterCurve.startX) * 0.6} ${dataToCenterCurve.endY}, ${dataToCenterCurve.endX} ${dataToCenterCurve.endY}`}
                stroke="url(#data-to-center-gradient)"
                strokeWidth="2"
                fill="none"
                filter="url(#glow)"
                initial={false}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  delay: mounted ? 1.5 : 0,
                  duration: mounted ? 1.2 : 0.3,
                  ease: "easeInOut",
                }}
              />

              {[0, 1, 2].map((particleIndex) => (
                <motion.circle
                  key={`data-center-particle-${particleIndex}`}
                  r="3"
                  fill="#ffffff"
                  filter="url(#glow)"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    delay: mounted ? 2.5 + particleIndex * 2.3 : 0,
                    duration: 6,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatDelay: 0,
                    ease: "linear",
                  }}
                >
                  <animateMotion dur="6s" repeatCount="indefinite" begin={`${2.5 + particleIndex * 2.3}s`}>
                    <mpath href="#data-to-center-path" />
                  </animateMotion>
                </motion.circle>
              ))}
            </g>
          )}

          {centerToAnalysisCurve && centerToAnalysisCurve.startX !== 0 && centerToAnalysisCurve.endX !== 0 && (
            <g key="center-to-analysis-curve">
              <linearGradient id="center-to-analysis-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>

              <motion.path
                id="center-to-analysis-path"
                d={`M ${centerToAnalysisCurve.startX} ${centerToAnalysisCurve.startY} C ${centerToAnalysisCurve.startX + (centerToAnalysisCurve.endX - centerToAnalysisCurve.startX) * 0.4} ${centerToAnalysisCurve.startY}, ${centerToAnalysisCurve.startX + (centerToAnalysisCurve.endX - centerToAnalysisCurve.startX) * 0.6} ${centerToAnalysisCurve.endY}, ${centerToAnalysisCurve.endX} ${centerToAnalysisCurve.endY}`}
                stroke="url(#center-to-analysis-gradient)"
                strokeWidth="2"
                fill="none"
                filter="url(#glow)"
                initial={false}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  delay: mounted ? 1.6 : 0,
                  duration: mounted ? 1.2 : 0.3,
                  ease: "easeInOut",
                }}
              />

              {[0, 1, 2].map((particleIndex) => (
                <motion.circle
                  key={`center-analysis-particle-${particleIndex}`}
                  r="3"
                  fill="#ffffff"
                  filter="url(#glow)"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    delay: mounted ? 3.2 + particleIndex * 1.5 : 0,
                    duration: 6,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatDelay: 0,
                    ease: "linear",
                  }}
                >
                  <animateMotion dur="6s" repeatCount="indefinite" begin={`${3.2 + particleIndex * 1.5}s`}>
                    <mpath href="#center-to-analysis-path" />
                  </animateMotion>
                </motion.circle>
              ))}
            </g>
          )}

          {analysisToButtonCurves.map((curve, index) => {
            if (!curve || curve.startX === 0 || curve.endX === 0) return null

            const controlX1 = curve.startX + (curve.endX - curve.startX) * 0.4
            const controlX2 = curve.startX + (curve.endX - curve.startX) * 0.6
            const pathId = `analysis-button-path-${index}`
            const pathD = `M ${curve.startX} ${curve.startY} C ${controlX1} ${curve.startY}, ${controlX2} ${curve.endY}, ${curve.endX} ${curve.endY}`

            return (
              <g key={`analysis-button-beam-${index}`}>
                <linearGradient id={`analysis-button-beam-gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#ffffff" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
                </linearGradient>

                <motion.path
                  id={pathId}
                  d={pathD}
                  stroke={`url(#analysis-button-beam-gradient-${index})`}
                  strokeWidth="6"
                  fill="none"
                  filter="url(#glow)"
                  initial={false}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    delay: mounted ? 1.7 + index * 0.1 : 0,
                    duration: mounted ? 1.2 : 0.3,
                    ease: "easeInOut",
                  }}
                />
              </g>
            )
          })}
        </svg>

        <div className="relative" style={{ zIndex: 10 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={mounted ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.95, duration: 0.5 }}
            onClick={handleAgentClick}
            className="absolute left-1/3 top-[-20px] w-16 h-16 rounded-full backdrop-blur-sm flex items-center justify-center border-[0.75px] border-muted-foreground cursor-pointer hover:border-cyan-400/60 hover:bg-white/5 transition-all duration-300"
            style={{
              backgroundColor: "#08131D",
              boxShadow: "0 0 12px rgba(255, 255, 255, 0.3), 0 0 24px rgba(255, 255, 255, 0.15)",
            }}
          >
            <span className="text-xs text-white font-medium">Agent</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={mounted ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative flex flex-col items-center py-14 px-[0]"
          >
            <div className="relative w-60 h-60 flex items-center justify-center mb-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={
                  mounted
                    ? {
                        opacity: 1,
                        scale: 1,
                        rotate: 360,
                      }
                    : {}
                }
                transition={{
                  opacity: { delay: 0.5, duration: 0.6 },
                  scale: { delay: 0.5, duration: 0.6 },
                  rotate: {
                    delay: 1,
                    duration: 20,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  },
                }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-400/60"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={mounted ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="absolute inset-3 rounded-full border border-cyan-500/30"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={mounted ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="absolute inset-6 rounded-full border border-cyan-500/20"
              />

              <motion.div
                initial={{ scale: 0 }}
                animate={mounted ? { scale: 1 } : {}}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="relative z-10 text-center"
              >
                <div className="mb-1 text-3xl" style={{ fontWeight: 700, color: "#ffffff" }}>
                  CyberLLM
                </div>

                <motion.div
                  ref={dataCircleRef}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={mounted ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 1.0, duration: 0.5 }}
                  onClick={handleDataCircleClick}
                  className="absolute -left-24 top-[41%] -translate-y-1/2 w-16 h-16 rounded-full backdrop-blur-sm flex items-center justify-center border-[0.75px] border-muted-foreground cursor-pointer hover:border-cyan-400/60 hover:bg-white/5 transition-all duration-300"
                  style={{
                    backgroundColor: "#08131D",
                    boxShadow: "0 0 12px rgba(255, 255, 255, 0.3), 0 0 24px rgba(255, 255, 255, 0.15)",
                  }}
                >
                  <Database className="w-6 h-6 text-white" />
                </motion.div>

                <motion.div
                  ref={analysisCircleRef}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={mounted ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 1.1, duration: 0.5 }}
                  className="absolute -right-24 top-[41%] -translate-y-1/2 translate-x-6 w-16 h-16 rounded-full backdrop-blur-sm flex items-center justify-center border-[0.75px] text-muted-foreground border-muted-foreground"
                  style={{
                    backgroundColor: "#08131D",
                    boxShadow: "0 0 12px rgba(255, 255, 255, 0.3), 0 0 24px rgba(255, 255, 255, 0.15)",
                  }}
                >
                  <LineChart className="w-6 h-6 text-white" />
                </motion.div>

                <motion.div
                  ref={centerRef}
                  initial={{ scale: 0 }}
                  animate={mounted ? { scale: 1 } : {}}
                  transition={{ delay: 1.2, duration: 0.3 }}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]"
                />

                <motion.div
                  initial={{ scale: 0 }}
                  animate={mounted ? { scale: 1 } : {}}
                  transition={{ delay: 1.3, duration: 0.3 }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]"
                />
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={mounted ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 1.05, duration: 0.5 }}
            onClick={handleKBRAGClick}
            className="absolute left-1/3 -translate-x-[calc(50%+20px)] bottom-[-20px] w-16 h-16 rounded-full backdrop-blur-sm flex items-center justify-center border-[0.75px] border-muted-foreground cursor-pointer hover:border-cyan-400/60 hover:bg-white/5 active:scale-95 transition-all duration-300"
            style={{
              backgroundColor: "#08131D",
              boxShadow: "0 0 12px rgba(255, 255, 255, 0.3), 0 0 24px rgba(255, 255, 255, 0.15)",
            }}
          >
            <span className="text-xs text-white font-medium">KB/RAG</span>
          </motion.div>
        </div>

        <div className="flex flex-col gap-3 ml-12 relative">
          <motion.div
            ref={(el) => (actionButtonRefs.current[0] = el)}
            initial={{ opacity: 0, x: 50 }}
            animate={mounted ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="relative"
          >
            <button
              onClick={handleAIAnalysisClick}
              className="group relative backdrop-blur-sm px-4 py-2 border border-white/20 hover:border-cyan-400/60 hover:bg-white/5 active:scale-95 transition-all duration-300 w-52 rounded-3xl"
              style={{
                boxShadow: "0 0 15px rgba(255, 255, 255, 0.1)",
              }}
            >
              <div className="relative flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300" />
                <span className="text-sm text-white/90 group-hover:text-white transition-colors duration-300">
                  AI Analysis
                </span>
              </div>
            </button>
          </motion.div>

          <motion.div
            ref={(el) => (actionButtonRefs.current[1] = el)}
            initial={{ opacity: 0, x: 50 }}
            animate={mounted ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="relative"
          >
            <button
              onClick={handlePromptLibraryClick}
              className="group relative backdrop-blur-sm px-4 py-2 border border-white/20 hover:border-cyan-400/60 hover:bg-white/5 active:scale-95 transition-all duration-300 w-52 rounded-2xl"
              style={{
                boxShadow: "0 0 15px rgba(255, 255, 255, 0.1)",
              }}
            >
              <div className="relative flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300" />
                <span className="text-sm text-white/90 group-hover:text-white transition-colors duration-300">
                  Prompt Library
                </span>
              </div>
            </button>
          </motion.div>

          <motion.div
            ref={(el) => (actionButtonRefs.current[2] = el)}
            initial={{ opacity: 0, x: 50 }}
            animate={mounted ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="relative"
          >
            <button
              onClick={handleAILibraryClick}
              className="group relative backdrop-blur-sm px-4 py-2 border border-white/20 hover:border-cyan-400/60 hover:bg-white/5 active:scale-95 transition-all duration-300 w-52 rounded-2xl"
              style={{
                boxShadow: "0 0 15px rgba(255, 255, 255, 0.1)",
              }}
            >
              <div className="relative flex items-center gap-2.5">
                <Brain className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300" />
                <span className="text-sm text-white/90 group-hover:text-white transition-colors duration-300">
                  AI Library
                </span>
              </div>
            </button>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-6 left-8 z-30 flex flex-row gap-3">
        {/* Label 1 */}

        {/* Label 2 */}
      </div>

      <BottomLines />
    </div>
  )
}
