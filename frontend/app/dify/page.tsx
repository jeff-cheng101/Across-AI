"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { EmbeddedIframe } from "@/components/embedded-iframe"

export default function DifyPage() {
  const [mounted, setMounted] = useState(false)
  const iframeUrl = process.env.NEXT_PUBLIC_DIFY_WORKFLOW_URL ||
    "https://twister5.phison.com/app/9dd18b0d-460b-44f3-a6fb-88bb8a76ad22/workflow"

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-[#08131D] text-white p-8">
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
              <h1 className="text-3xl font-bold mb-1">Dify 工作流</h1>
              <p className="text-slate-400 text-sm">Workflow Orchestration</p>
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={mounted ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <EmbeddedIframe
          src={iframeUrl}
          height="calc(100vh - 250px)"
          title="Dify 工作流"
          className="shadow-xl"
          envPrefix="DIFY_WORKFLOW"
        />
      </motion.div>
    </div>
  )
}
