"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Shield, TrendingUp, AlertTriangle, CheckCircle, XCircle, Globe, Clock, Sparkles } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useWAFData } from "@/app/dashboard/waf-data-context"
import { useRouter } from "next/navigation"

export default function AIAnalysisPage() {
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    router.replace("/ai-analysis/cloudflare")
  }, [router])

  const { wafRisks, selectedBrand } = useWAFData()

  useEffect(() => {
    if (wafRisks.length > 0 && !selectedIssue) {
      setSelectedIssue(wafRisks[0].id)
    }
  }, [wafRisks, selectedIssue])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-900/50 border-red-500/50"
      case "high":
        return "bg-orange-900/50 border-orange-500/50"
      case "medium":
        return "bg-yellow-900/50 border-yellow-500/50"
      default:
        return "bg-slate-900/50 border-slate-500/50"
    }
  }

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500/20 text-red-400 border-red-500/50"
      case "high":
        return "bg-orange-500/20 text-orange-400 border-orange-500/50"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/50"
    }
  }

  const totalOpenIssues = wafRisks.reduce((sum, risk) => sum + risk.openIssues, 0)
  const totalAffectedAssets = wafRisks.reduce((sum, risk) => sum + risk.affectedAssets, 0)

  return (
    <div className="min-h-screen bg-[#08131D] p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-8 h-8 text-cyan-400" />
          <h1 className="text-3xl font-bold text-white">AI Cyber Security Analysis</h1>
        </div>
        <p className="text-slate-400">
          基於 {selectedBrand.toUpperCase()} WAF 安全數據的智能分析與建議 | 總計 {totalOpenIssues} 個開放問題，影響{" "}
          {totalAffectedAssets} 個資產
        </p>
      </motion.div>

      {/* Three Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Column 1: 風險評估 (Risk Assessment) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-3"
        >
          <Card className="bg-slate-900/40 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-cyan-400" />
                風險評估
              </CardTitle>
              <CardDescription className="text-slate-400">
                來自 {selectedBrand.toUpperCase()} WAF 分析數據
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {wafRisks.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>暫無風險數據</p>
                  <p className="text-xs mt-2">請先訪問 Cloudflare Dashboard 載入數據</p>
                </div>
              ) : (
                wafRisks.map((assessment, index) => (
                  <motion.div
                    key={assessment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                    onClick={() => setSelectedIssue(assessment.id)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                      selectedIssue === assessment.id
                        ? "border-cyan-400/60 bg-cyan-900/20 shadow-lg shadow-cyan-500/20"
                        : "border-white/10 hover:border-white/20 bg-slate-800/30"
                    }`}
                  >
                    <div className="space-y-2">
                      <Badge className={getSeverityBadgeColor(assessment.severity)} variant="outline">
                        {assessment.severity.toUpperCase()}
                      </Badge>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-400">OPEN ISSUES IN CASE</span>
                        </div>
                        <div className="text-2xl font-bold text-white">{assessment.openIssues}</div>
                        <div className="text-xs text-slate-400">
                          {assessment.resolvedIssues} of {assessment.openIssues + assessment.resolvedIssues} Issues
                          resolved
                        </div>
                      </div>
                      <div className="pt-2 border-t border-white/10">
                        <div className="text-xs text-slate-400 mb-1">AFFECTED ASSETS</div>
                        <div className="text-xl font-bold text-white">{assessment.affectedAssets}</div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Column 2: 趨勢分析 (Trend Analysis) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-6"
        >
          <Card className="bg-slate-900/40 border-white/10 backdrop-blur-sm h-full">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                趨勢分析
              </CardTitle>
              <CardDescription className="text-slate-400">詳細漏洞資訊與威脅情報</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedIssue && wafRisks.length > 0 ? (
                <motion.div
                  key={selectedIssue}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {wafRisks
                    .filter((a) => a.id === selectedIssue)
                    .map((assessment) => (
                      <div
                        key={assessment.id}
                        className={`p-6 rounded-lg border ${getSeverityColor(assessment.severity)}`}
                      >
                        {/* Header */}
                        <div className="mb-4">
                          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                            <Clock className="w-3 h-3" />
                            <span>Updated on: {assessment.updatedDate}</span>
                            <span>|</span>
                            <span>Created on: {assessment.createdDate}</span>
                          </div>
                          <h3 className="text-xl font-semibold text-white mb-3">{assessment.title}</h3>
                          <div className="flex flex-wrap gap-2">
                            {assessment.tags.map((tag, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="bg-red-500/20 text-red-400 border-red-500/50"
                              >
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-slate-300 leading-relaxed">{assessment.description}</p>
                        </div>

                        {assessment.cveId && (
                          <div className="mb-4 p-3 bg-slate-800/50 rounded-lg">
                            <div className="text-xs text-slate-400 mb-1">CVE 編號</div>
                            <div className="text-sm font-mono text-cyan-400">{assessment.cveId}</div>
                          </div>
                        )}

                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                          <div>
                            <div className="text-xs text-slate-400 mb-1">Open Issues</div>
                            <div className="text-2xl font-bold text-white">{assessment.openIssues}</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-400 mb-1">Resolved</div>
                            <div className="text-2xl font-bold text-green-400">{assessment.resolvedIssues}</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-400 mb-1">Affected Assets</div>
                            <div className="text-2xl font-bold text-orange-400">{assessment.affectedAssets}</div>
                          </div>
                        </div>

                        <div className="mt-6 p-4 bg-cyan-900/20 border border-cyan-500/30 rounded-lg">
                          <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="w-5 h-5 text-cyan-400" />
                            <h4 className="text-white font-semibold">AI 深度分析</h4>
                          </div>
                          <p className="text-sm text-slate-300 leading-relaxed">
                            根據威脅情報分析，此類攻擊在過去 24 小時內呈現上升趨勢。
                            攻擊者主要針對身份驗證端點，建議立即採取防護措施並監控相關日誌。 系統已自動標記{" "}
                            {assessment.affectedAssets} 個受影響資產，建議優先處理。
                          </p>
                        </div>
                      </div>
                    ))}
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                  <Globe className="w-16 h-16 mb-4 opacity-50" />
                  <p className="text-lg">請從左側選擇一個風險項目查看詳細分析</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Column 3: 執行建議按鈕 (Action Recommendations) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-3"
        >
          <Card className="bg-slate-900/40 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-cyan-400" />
                執行建議按鈕
              </CardTitle>
              <CardDescription className="text-slate-400">AI 推薦的修復措施</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedIssue && wafRisks.length > 0 ? (
                <motion.div
                  key={`action-${selectedIssue}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {wafRisks
                    .filter((a) => a.id === selectedIssue)
                    .map((assessment) => (
                      <div key={assessment.id} className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-amber-400 mb-3">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="font-semibold">RECOMMENDED ACTIONS</span>
                        </div>

                        {assessment.recommendations.map((rec, idx) => (
                          <div key={idx} className="p-4 rounded-lg bg-slate-800/50 border border-cyan-400/30">
                            <div className="flex items-start gap-3 mb-4">
                              <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                                <Shield className="w-5 h-5 text-cyan-400" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="text-white font-medium">{rec.title}</h4>
                                  <Badge
                                    className={
                                      rec.priority === "high"
                                        ? "bg-red-500/20 text-red-400 border-red-500/50"
                                        : "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
                                    }
                                    variant="outline"
                                  >
                                    {rec.priority.toUpperCase()}
                                  </Badge>
                                </div>
                                <p className="text-xs text-slate-400">{rec.description}</p>
                              </div>
                            </div>

                            <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              執行此操作
                            </Button>
                          </div>
                        ))}

                        <div className="mt-6 p-3 rounded-lg bg-red-900/20 border border-red-500/30">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-slate-400">風險等級</span>
                            <Badge className={getSeverityBadgeColor(assessment.severity)} variant="outline">
                              {assessment.severity.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="text-xs text-slate-300">
                            {assessment.exploitInWild && "⚠️ 此漏洞已被確認在野外利用，"}
                            {assessment.internetExposed && "暴露於互聯網，"}
                            建議立即採取行動
                          </div>
                        </div>
                      </div>
                    ))}
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                  <XCircle className="w-16 h-16 mb-4 opacity-50" />
                  <p className="text-center">請先選擇一個風險項目以查看執行建議</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
