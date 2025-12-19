"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, RefreshCw, ExternalLink, Database } from "lucide-react"
import Link from "next/link"
import { EmbeddedIframe } from "@/components/embedded-iframe"

export default function KBRAGPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 從環境變數讀取 URL，如果沒有設定則使用預設值
  // 支援 /apps、/datasets 或其他 Dify 路徑
  const iframeUrl = process.env.NEXT_PUBLIC_KB_RAG_URL || "https://twister5poc.phison.com/datasets"

  return (
    <div className="min-h-screen bg-[#08131D] text-white p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={mounted ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <button className="p-2 rounded-lg border border-white/20 hover:border-cyan-400/60 hover:bg-white/5 transition-all duration-300">
                <ArrowLeft className="w-5 h-5" />
              </button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold mb-1">知識庫與 RAG 系統</h1>
              <p className="text-slate-400 text-sm">Knowledge Base & Retrieval-Augmented Generation</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.open(iframeUrl, "_blank")}
              className="px-4 py-2 rounded-lg border border-white/20 hover:border-cyan-400/60 hover:bg-white/5 transition-all duration-300 flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="text-sm">在新視窗開啟</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Iframe Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={mounted ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mb-8"
      >
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
            <Database className="h-5 w-5 text-cyan-400" />
            {iframeUrl.includes('/apps') ? '應用管理' : iframeUrl.includes('/datasets') ? '資料集管理' : 'KB/RAG 管理'}
          </h2>
          <p className="text-sm text-slate-400 mb-2">
            {iframeUrl.includes('/apps') 
              ? '管理和查看 Dify 應用' 
              : iframeUrl.includes('/datasets') 
              ? '管理和查看知識庫資料集'
              : '管理和查看知識庫與 RAG 系統'}
          </p>
          <p className="text-xs text-yellow-400/80 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-2 inline-block">
            💡 提示：如果看到登入頁面，請直接在 iframe 中登入。登入後即可正常使用。
          </p>
        </div>

        <EmbeddedIframe
          src={iframeUrl}
          height="calc(100vh - 250px)"
          title={iframeUrl.includes('/apps') ? 'Dify 應用管理' : iframeUrl.includes('/datasets') ? 'KB/RAG 資料集管理' : 'KB/RAG 管理'}
          className="shadow-xl"
          envPrefix="KB_RAG"
        />
      </motion.div>
    </div>
  )
}
