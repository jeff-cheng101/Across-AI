"use client"

// components/report-download-dialog.tsx
// 報告下載對話框 - 收集用戶基本資料並生成報告

import { useState } from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  FileText, 
  Download, 
  Loader2, 
  Building2, 
  User, 
  Phone, 
  Mail,
  Shield,
  CheckCircle,
  AlertTriangle,
  Sparkles
} from "lucide-react"
import { useReportDownload, UserProvidedData } from "@/hooks/use-report-download"

interface ReportDownloadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  analysisData: any
  metadata: {
    totalEvents: number
    timeRange: any
    platform: string
    analysisTimestamp?: string
  }
}

export function ReportDownloadDialog({
  open,
  onOpenChange,
  analysisData,
  metadata
}: ReportDownloadDialogProps) {
  const { generateReport, quickDownloadText, isGenerating, progress } = useReportDownload()
  
  const [activeTab, setActiveTab] = useState<"quick" | "detailed">("quick")
  
  // 用戶資料表單
  const [formData, setFormData] = useState<UserProvidedData>({
    organizationName: '',
    reviewOrganization: '',
    reporterName: '',
    phone: '',
    fax: '',
    email: '',
    investigationVendor: '',
    mainSystemVendor: '',
    systemBuilder: '',
    socVendor: '',
    securityPersonName: '',
    securityPersonTitle: ''
  })

  const handleInputChange = (field: keyof UserProvidedData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // 快速下載（不填寫資料）
  const handleQuickDownload = async () => {
    const success = await quickDownloadText(
      { risks: analysisData },
      metadata
    )
    if (success) {
      onOpenChange(false)
    }
  }

  // 完整報告生成（填寫資料 + AI 轉譯）
  const handleDetailedDownload = async (format: 'text' | 'word') => {
    const success = await generateReport({
      analysisData: { risks: analysisData },
      metadata,
      userProvidedData: formData,
      outputFormat: format,
      useAI: true
    })
    if (success) {
      onOpenChange(false)
    }
  }

  // 計算風險統計
  const risks = analysisData || []
  const criticalCount = risks.filter((r: any) => r.severity === 'critical').length
  const highCount = risks.filter((r: any) => r.severity === 'high').length
  const mediumCount = risks.filter((r: any) => r.severity === 'medium').length
  const lowCount = risks.filter((r: any) => r.severity === 'low').length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            生成資安事件通報單
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            根據 AI 分析結果生成符合政府規範的資安事件通報單
          </DialogDescription>
        </DialogHeader>

        {/* 分析摘要 */}
        <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-semibold text-white">分析摘要</span>
          </div>
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center p-2 bg-red-900/30 rounded border border-red-500/30">
              <div className="text-xl font-bold text-red-400">{criticalCount + highCount}</div>
              <div className="text-xs text-slate-400">高/嚴重</div>
            </div>
            <div className="text-center p-2 bg-yellow-900/30 rounded border border-yellow-500/30">
              <div className="text-xl font-bold text-yellow-400">{mediumCount}</div>
              <div className="text-xs text-slate-400">中風險</div>
            </div>
            <div className="text-center p-2 bg-blue-900/30 rounded border border-blue-500/30">
              <div className="text-xl font-bold text-blue-400">{lowCount}</div>
              <div className="text-xs text-slate-400">低風險</div>
            </div>
            <div className="text-center p-2 bg-slate-800 rounded border border-slate-600">
              <div className="text-xl font-bold text-white">{metadata.totalEvents}</div>
              <div className="text-xs text-slate-400">總事件</div>
            </div>
          </div>
        </div>

        {/* 生成進度 */}
        {isGenerating && (
          <div className="mb-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-cyan-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>正在生成報告...</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="text-xs text-slate-400 text-right">{progress}%</div>
          </div>
        )}

        {/* 標籤頁切換 */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "quick" | "detailed")}>
          <TabsList className="grid grid-cols-2 bg-slate-800">
            <TabsTrigger value="quick" className="data-[state=active]:bg-cyan-600">
              <Download className="w-4 h-4 mr-2" />
              快速下載
            </TabsTrigger>
            <TabsTrigger value="detailed" className="data-[state=active]:bg-cyan-600">
              <Sparkles className="w-4 h-4 mr-2" />
              完整報告
            </TabsTrigger>
          </TabsList>

          {/* 快速下載 */}
          <TabsContent value="quick" className="space-y-4 mt-4">
            <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1">快速下載模式</h4>
                  <p className="text-xs text-slate-300">
                    直接根據 AI 分析結果生成報告，不需要填寫額外資料。
                    適合快速查看或初步審閱。
                  </p>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleQuickDownload}
              disabled={isGenerating || !analysisData || analysisData.length === 0}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  快速下載純文字報告
                </>
              )}
            </Button>
          </TabsContent>

          {/* 完整報告 */}
          <TabsContent value="detailed" className="space-y-4 mt-4">
            <div className="p-4 bg-amber-900/20 border border-amber-500/30 rounded-lg">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-400 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1">完整報告模式（AI 轉譯）</h4>
                  <p className="text-xs text-slate-300">
                    使用 AI 將分析結果轉換為政府標準通報單格式，
                    填寫機關資料後可直接用於正式通報。
                  </p>
                </div>
              </div>
            </div>

            {/* 基本資料表單 */}
            <div className="space-y-4">
              {/* 機關資訊 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Building2 className="w-4 h-4 text-cyan-400" />
                  機關資訊
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="organizationName" className="text-xs text-slate-400">
                      機關(機構)名稱 *
                    </Label>
                    <Input
                      id="organizationName"
                      value={formData.organizationName}
                      onChange={(e) => handleInputChange('organizationName', e.target.value)}
                      placeholder="例：OOO股份有限公司"
                      className="bg-slate-800 border-slate-600 text-white text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="reviewOrganization" className="text-xs text-slate-400">
                      審核機關名稱
                    </Label>
                    <Input
                      id="reviewOrganization"
                      value={formData.reviewOrganization}
                      onChange={(e) => handleInputChange('reviewOrganization', e.target.value)}
                      placeholder="例：資安主管機關"
                      className="bg-slate-800 border-slate-600 text-white text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* 通報人資訊 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <User className="w-4 h-4 text-cyan-400" />
                  通報人資訊
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="reporterName" className="text-xs text-slate-400">
                      通報人姓名 *
                    </Label>
                    <Input
                      id="reporterName"
                      value={formData.reporterName}
                      onChange={(e) => handleInputChange('reporterName', e.target.value)}
                      placeholder="請輸入姓名"
                      className="bg-slate-800 border-slate-600 text-white text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="email" className="text-xs text-slate-400">
                      電子郵件
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="example@company.com"
                      className="bg-slate-800 border-slate-600 text-white text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="phone" className="text-xs text-slate-400">
                      電話
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="02-12345678"
                      className="bg-slate-800 border-slate-600 text-white text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="fax" className="text-xs text-slate-400">
                      傳真
                    </Label>
                    <Input
                      id="fax"
                      value={formData.fax}
                      onChange={(e) => handleInputChange('fax', e.target.value)}
                      placeholder="02-12345679"
                      className="bg-slate-800 border-slate-600 text-white text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* 廠商資訊 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Shield className="w-4 h-4 text-cyan-400" />
                  廠商資訊（選填）
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="investigationVendor" className="text-xs text-slate-400">
                      資安事件調查廠商
                    </Label>
                    <Input
                      id="investigationVendor"
                      value={formData.investigationVendor}
                      onChange={(e) => handleInputChange('investigationVendor', e.target.value)}
                      placeholder="調查廠商名稱"
                      className="bg-slate-800 border-slate-600 text-white text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="socVendor" className="text-xs text-slate-400">
                      SOC 廠商
                    </Label>
                    <Input
                      id="socVendor"
                      value={formData.socVendor}
                      onChange={(e) => handleInputChange('socVendor', e.target.value)}
                      placeholder="SOC 服務廠商"
                      className="bg-slate-800 border-slate-600 text-white text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="mainSystemVendor" className="text-xs text-slate-400">
                      系統維護廠商
                    </Label>
                    <Input
                      id="mainSystemVendor"
                      value={formData.mainSystemVendor}
                      onChange={(e) => handleInputChange('mainSystemVendor', e.target.value)}
                      placeholder="維護廠商名稱"
                      className="bg-slate-800 border-slate-600 text-white text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="systemBuilder" className="text-xs text-slate-400">
                      系統建置廠商
                    </Label>
                    <Input
                      id="systemBuilder"
                      value={formData.systemBuilder}
                      onChange={(e) => handleInputChange('systemBuilder', e.target.value)}
                      placeholder="建置廠商名稱"
                      className="bg-slate-800 border-slate-600 text-white text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* 資安人員 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <User className="w-4 h-4 text-cyan-400" />
                  處理人員（選填）
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="securityPersonName" className="text-xs text-slate-400">
                      資安人員姓名
                    </Label>
                    <Input
                      id="securityPersonName"
                      value={formData.securityPersonName}
                      onChange={(e) => handleInputChange('securityPersonName', e.target.value)}
                      placeholder="處理人員姓名"
                      className="bg-slate-800 border-slate-600 text-white text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="securityPersonTitle" className="text-xs text-slate-400">
                      職稱
                    </Label>
                    <Input
                      id="securityPersonTitle"
                      value={formData.securityPersonTitle}
                      onChange={(e) => handleInputChange('securityPersonTitle', e.target.value)}
                      placeholder="例：資安工程師"
                      className="bg-slate-800 border-slate-600 text-white text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 下載按鈕 */}
            <div className="flex gap-3 pt-4">
              <Button 
                onClick={() => handleDetailedDownload('text')}
                disabled={isGenerating || !analysisData || analysisData.length === 0}
                className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    生成中...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    下載 TXT 報告
                  </>
                )}
              </Button>
              <Button 
                onClick={() => handleDetailedDownload('word')}
                disabled={isGenerating || !analysisData || analysisData.length === 0}
                variant="outline"
                className="flex-1 border-cyan-500 text-cyan-400 hover:bg-cyan-900/20"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    生成中...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    下載 Word 報告
                  </>
                )}
              </Button>
            </div>

            <div className="p-3 bg-slate-800/50 rounded border border-slate-700 text-xs text-slate-400">
              <AlertTriangle className="w-3 h-3 inline mr-1 text-yellow-400" />
              Word 報告功能需要後端安裝 docx-templates 套件，若未安裝將自動回退到純文字格式。
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)}
            className="text-slate-400 hover:text-white"
          >
            關閉
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

