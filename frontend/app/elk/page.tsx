"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Search, Filter, Download, RefreshCw, AlertTriangle, Shield, Activity, Database } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { MultiKibanaDashboard } from "@/components/multi-kibana-dashboard"

interface LogEntry {
  id: string
  timestamp: string
  source: string
  sourceIcon: string
  level: "info" | "warning" | "critical"
  event: string
  details: string
  ip?: string
  country?: string
}

export default function ELKDashboard() {
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSource, setSelectedSource] = useState<string>("all")
  const [selectedLevel, setSelectedLevel] = useState<string>("all")

  useEffect(() => {
    setMounted(true)
  }, [])

  const logEntries: LogEntry[] = [
    
  ]

  const filteredLogs = logEntries.filter((log) => {
    const matchesSearch =
      searchQuery === "" ||
      log.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.source.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesSource = selectedSource === "all" || log.source === selectedSource

    const matchesLevel = selectedLevel === "all" || log.level === selectedLevel

    return matchesSearch && matchesSource && matchesLevel
  })

  const sources = ["all", "Cloudflare", "Palo Alto", "F5", "CATO Networks", "INTEZER AI", "CyCraftAI", "Custom SIEM"]

  const getLevelColor = (level: string) => {
    switch (level) {
      case "critical":
        return "text-red-400 bg-red-500/10 border-red-500/30"
      case "warning":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/30"
      case "info":
        return "text-cyan-400 bg-cyan-500/10 border-cyan-500/30"
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-500/30"
    }
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "critical":
        return <AlertTriangle className="w-4 h-4" />
      case "warning":
        return <Shield className="w-4 h-4" />
      case "info":
        return <Activity className="w-4 h-4" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-[#08131D] text-white p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={mounted ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        {/* <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <button className="p-2 rounded-lg border border-white/20 hover:border-cyan-400/60 hover:bg-white/5 transition-all duration-300">
                <ArrowLeft className="w-5 h-5" />
              </button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold mb-1">日誌分析系統</h1>
              <p className="text-slate-400 text-sm">即時監控 7 個資安平台的日誌數據</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 rounded-lg border border-white/20 hover:border-cyan-400/60 hover:bg-white/5 transition-all duration-300 flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm">重新整理</span>
            </button>
            <button className="px-4 py-2 rounded-lg border border-white/20 hover:border-cyan-400/60 hover:bg-white/5 transition-all duration-300 flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span className="text-sm">匯出</span>
            </button>
          </div>
        </div> */}

        {/* Statistics Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="backdrop-blur-md bg-slate-900/40 border border-red-500/30 rounded-lg p-4"
          >
            <div className="text-xs text-slate-400 mb-1">嚴重事件</div>
            <div className="text-2xl font-bold text-red-400">0</div>
            <div className="text-xs text-slate-500 mt-1">需立即處理</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="backdrop-blur-md bg-slate-900/40 border border-yellow-500/30 rounded-lg p-4"
          >
            <div className="text-xs text-slate-400 mb-1">警告事件</div>
            <div className="text-2xl font-bold text-yellow-400">0</div>
            <div className="text-xs text-slate-500 mt-1">需要關注</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="backdrop-blur-md bg-slate-900/40 border border-cyan-500/30 rounded-lg p-4"
          >
            <div className="text-xs text-slate-400 mb-1">一般事件</div>
            <div className="text-2xl font-bold text-cyan-400">0</div>
            <div className="text-xs text-slate-500 mt-1">正常運作</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="backdrop-blur-md bg-slate-900/40 border border-white/20 rounded-lg p-4"
          >
            <div className="text-xs text-slate-400 mb-1">資料來源</div>
            <div className="text-2xl font-bold text-white">0</div>
            <div className="text-xs text-slate-500 mt-1">全部活動中</div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="搜尋事件、來源或詳細資訊..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900/40 border border-white/20 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/60 transition-all duration-300"
            />
          </div>

          {/* Source Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="pl-10 pr-8 py-2 bg-slate-900/40 border border-white/20 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-400/60 transition-all duration-300 appearance-none cursor-pointer"
            >
              {sources.map((source) => (
                <option key={source} value={source} className="bg-slate-900">
                  {source === "all" ? "所有來源" : source}
                </option>
              ))}
            </select>
          </div>

          {/* Level Filter */}
          <div className="relative">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-2 bg-slate-900/40 border border-white/20 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-400/60 transition-all duration-300 appearance-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900">
                所有等級
              </option>
              <option value="critical" className="bg-slate-900">
                嚴重
              </option>
              <option value="warning" className="bg-slate-900">
                警告
              </option>
              <option value="info" className="bg-slate-900">
                一般
              </option>
            </select>
          </div>
        </div>
      </motion.div>


      {/* Log Entries */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={mounted ? { opacity: 1 } : {}}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="space-y-3"
      >
        {filteredLogs.map((log, index) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, x: -20 }}
            animate={mounted ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4 + index * 0.05, duration: 0.4 }}
            className="backdrop-blur-md bg-slate-900/40 border border-white/10 rounded-lg p-4 hover:border-cyan-400/30 hover:bg-slate-900/60 transition-all duration-300"
          >
            <div className="flex items-start gap-4">
              {/* Source Icon */}
              <div className="w-10 h-10 rounded-lg bg-slate-800/50 border border-white/10 flex items-center justify-center flex-shrink-0">
                {log.sourceIcon ? (
                  <Image
                    src={log.sourceIcon || "/placeholder.svg"}
                    alt={log.source}
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                ) : (
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm15 0h3v3h-3v-3zm0 5h3v3h-3v-3zm-5-5h3v8h-3v-8z" />
                  </svg>
                )}
              </div>

              {/* Log Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-white">{log.event}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs border flex items-center gap-1 ${getLevelColor(log.level)}`}
                    >
                      {getLevelIcon(log.level)}
                      {log.level === "critical" ? "嚴重" : log.level === "warning" ? "警告" : "一般"}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 whitespace-nowrap">{log.timestamp}</span>
                </div>

                <p className="text-sm text-slate-300 mb-2">{log.details}</p>

                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <span className="text-slate-500">來源:</span>
                    <span className="text-cyan-400">{log.source}</span>
                  </span>
                  {log.ip && (
                    <>
                      <span className="flex items-center gap-1">
                        <span className="text-slate-500">IP:</span>
                        <span className="text-white font-mono">{log.ip}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="text-slate-500">國家:</span>
                        <span className="text-white">{log.country}</span>
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* No Results */}
      {/* {filteredLogs.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={mounted ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center py-12"
        >
          <div className="text-slate-400 mb-2">找不到符合條件的日誌</div>
          <button
            onClick={() => {
              setSearchQuery("")
              setSelectedSource("all")
              setSelectedLevel("all")
            }}
            className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors duration-300"
          >
            清除所有篩選條件
          </button>
        </motion.div>
      )} */}

      {/* Kibana Dashboard - 放在日誌列表下方 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={mounted ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="mt-8"
      >
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
            <Database className="h-5 w-5 text-cyan-400" />
            日誌查詢
          </h2>
        </div>
        
        <MultiKibanaDashboard
          height="600px"
          autoRefresh={true}
          showControls={true}
          domainSettings={[
            { name: "example.com" },
            { name: "test.com" },
            { name: "demo.com" }
          ]}
          logQuery=""
          indexPattern="adasone-*"
          className="shadow-xl"
        />
      </motion.div>
    </div>
  )
}
