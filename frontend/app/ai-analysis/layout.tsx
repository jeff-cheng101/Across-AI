"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, SparklesIcon, Sparkles, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WAFDataProvider } from "@/app/dashboard/waf-data-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const brands = [
  { name: "Cloudflare", logo: "/logos/Cloudflar.png", href: "/ai-analysis/cloudflare" },
  { name: "Palo Alto", logo: "/logos/palo-alto-networks-1.png", href: "/ai-analysis/paloalto", disabled: true },
  { name: "F5", logo: "/logos/f5_b.png", href: "/ai-analysis/f5", disabled: false },
  { name: "CATO", logo: "/logos/cato-networks.png", href: "#", disabled: true },
  { name: "Checkpoint", logo: "/logos/checkpoint.png", href: "/ai-analysis/checkpoint", disabled: false },
  { name: "Intezer", logo: "/logos/INTEZER_logo.png", href: "#", disabled: true },
  { name: "CyCraft", logo: "/logos/craftai.png", href: "#", disabled: true },
]

const installedModels = [{ id: "gpt-oss-20b", name: "GPT-OSS20b", version: "1.0.0" }]

export default function AIAnalysisLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [selectedModel, setSelectedModel] = useState(installedModels[0].id)

  return (
    <WAFDataProvider>
      <div className="flex min-h-screen bg-[#08131D]">
        {/* Brand Sidebar */}
        <motion.aside
          initial={false}
          animate={{ width: isCollapsed ? "80px" : "240px" }}
          transition={{ duration: 0.3 }}
          className="relative bg-slate-900/40 border-r border-white/10 backdrop-blur-sm flex flex-col"
        >
          {/* Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full bg-slate-800 border border-white/10 hover:bg-slate-700"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>

          {/* Header */}
          <div className="p-6 border-b border-white/10">
            {!isCollapsed ? (
              <div>
                <h2 className="text-white font-semibold text-lg">Security Brands</h2>
                <p className="text-slate-400 text-xs mt-1">選擇品牌查看分析</p>
              </div>
            ) : (
              <div className="flex justify-center">
                <Sparkles
                  className="w-6 h-6 text-white cursor-pointer hover:text-cyan-400 transition-colors"
                  onClick={() => setIsCollapsed(false)}
                />
              </div>
            )}
          </div>

          {!isCollapsed && (
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <SparklesIcon className="w-4 h-4 text-white" />
                <h3 className="text-white text-sm font-medium">AI 模型</h3>
              </div>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-full bg-slate-800/50 border-white/10 text-white hover:bg-slate-800/70">
                  <SelectValue placeholder="選擇模型" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10">
                  {installedModels.map((model) => (
                    <SelectItem
                      key={model.id}
                      value={model.id}
                      className="text-white hover:bg-slate-800 focus:bg-slate-800"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{model.name}</span>
                        <span className="text-xs text-slate-400">v{model.version}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Brand List */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {brands.map((brand, index) => (
              <Link
                key={index}
                href={brand.disabled ? "#" : brand.href}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                  brand.disabled
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-white/5 hover:border-cyan-400/30 cursor-pointer"
                } ${isCollapsed ? "justify-center" : ""}`}
                onClick={(e) => brand.disabled && e.preventDefault()}
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img src={brand.logo || "/placeholder.svg"} alt={brand.name} className="w-6 h-6 object-contain" />
                </div>
                {!isCollapsed && <span className="text-white text-sm font-medium">{brand.name}</span>}
              </Link>
            ))}

            {isCollapsed ? (
              <div className="pt-4 border-t border-white/10">
                <div
                  className="flex justify-center p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                  title="其他可用操作"
                  onClick={() => setIsCollapsed(false)}
                >
                  <MoreHorizontal className="w-5 h-5 text-slate-400" />
                </div>
              </div>
            ) : (
              <div className="pt-4 border-t border-white/10 space-y-2">
                <div className="text-xs text-slate-400 mb-2 px-3">其他可用操作</div>
                <Button
                  variant="outline"
                  className="w-full border-white/10 text-white hover:bg-white/5 bg-transparent text-sm"
                >
                  生成詳細報告
                </Button>
                <Link href="/ai-analysis/create-ticket" className="block w-full">
                  <Button
                    variant="outline"
                    className="w-full border-white/10 text-white hover:bg-white/5 bg-transparent text-sm"
                  >
                    創建工單
                  </Button>
                </Link>
                <Link href="/ai-analysis/notifications" className="block w-full">
                  <Button
                    variant="outline"
                    className="w-full border-white/10 text-white hover:bg-white/5 bg-transparent text-sm"
                  >
                    通知相關人員
                  </Button>
                </Link>
                <Link href="/ai-analysis/history" className="block w-full">
                  <Button
                    variant="outline"
                    className="w-full border-white/10 text-white hover:bg-white/5 bg-transparent text-sm"
                  >
                    AI 分析紀錄
                  </Button>
                </Link>
              </div>
            )}
          </nav>

          {/* Back to Dashboard */}
          {!isCollapsed && (
            <div className="p-4 border-t border-white/10">
              <Link href="/dashboard">
                <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/5 bg-transparent">
                  返回 Dashboard
                </Button>
              </Link>
            </div>
          )}
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto pl-6">{children}</main>
      </div>
    </WAFDataProvider>
  )
}
