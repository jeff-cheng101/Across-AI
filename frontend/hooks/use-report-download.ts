// hooks/use-report-download.ts
// 報告下載 Hook

import { useState } from 'react'
import { useToast } from './use-toast'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8081'

export interface UserProvidedData {
  organizationName: string
  reviewOrganization: string
  reporterName: string
  phone: string
  fax: string
  email: string
  investigationVendor: string
  mainSystemVendor: string
  systemBuilder: string
  socVendor: string
  securityPersonName: string
  securityPersonTitle: string
}

export interface ReportGenerationOptions {
  analysisData: any
  metadata: {
    totalEvents: number
    timeRange: any
    platform: string
    analysisTimestamp?: string
  }
  userProvidedData: UserProvidedData
  outputFormat: 'text' | 'word' | 'json'
  useAI?: boolean  // 是否使用第二階段 AI 轉譯
}

export function useReportDownload() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const { toast } = useToast()

  /**
   * 生成並下載報告
   */
  const generateReport = async (options: ReportGenerationOptions) => {
    setIsGenerating(true)
    setProgress(10)

    try {
      // 讀取 AI 配置
      const aiProvider = localStorage.getItem('aiProvider') || 'ollama'
      const apiKey = localStorage.getItem('geminiApiKey') || ''
      const aiModel = aiProvider === 'ollama' 
        ? (localStorage.getItem('ollamaModel') || 'twister_llama33:latest')
        : 'gemini-2.0-flash-exp'

      setProgress(20)

      const endpoint = options.useAI !== false 
        ? '/api/reports/generate'
        : '/api/reports/generate-text'

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          analysisData: options.analysisData,
          metadata: options.metadata,
          userProvidedData: options.userProvidedData,
          aiConfig: {
            provider: aiProvider,
            apiKey: apiKey,
            model: aiModel
          },
          outputFormat: options.outputFormat
        })
      })

      setProgress(70)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `API 請求失敗: ${response.status}`)
      }

      setProgress(90)

      // 處理不同的輸出格式
      const contentType = response.headers.get('Content-Type') || ''

      if (contentType.includes('application/vnd.openxmlformats')) {
        // Word 文件下載
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `資安事件通報單_${new Date().toISOString().split('T')[0]}.docx`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        toast({
          title: '✅ 報告生成完成',
          description: 'Word 報告已開始下載',
        })
      } else {
        // JSON 回應（text 或 json 格式）
        const data = await response.json()

        if (data.format === 'text' && data.content) {
          // 下載純文字報告
          const blob = new Blob([data.content], { type: 'text/plain; charset=utf-8' })
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `資安事件通報單_${new Date().toISOString().split('T')[0]}.txt`
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(url)
          document.body.removeChild(a)

          toast({
            title: '✅ 報告生成完成',
            description: data.message || '純文字報告已開始下載',
          })
        } else if (data.format === 'json') {
          // 返回 JSON 資料（供進一步處理）
          toast({
            title: '✅ 報告資料已生成',
            description: '報告結構化資料已準備完成',
          })
          return data.reportData
        }
      }

      setProgress(100)
      return true

    } catch (error) {
      console.error('報告生成失敗:', error)
      toast({
        title: '❌ 報告生成失敗',
        description: error instanceof Error ? error.message : '未知錯誤',
        variant: 'destructive'
      })
      return false
    } finally {
      setIsGenerating(false)
      setTimeout(() => setProgress(0), 1000)
    }
  }

  /**
   * 快速下載純文字報告（不使用第二階段 AI）
   */
  const quickDownloadText = async (
    analysisData: any,
    metadata: any,
    userProvidedData: Partial<UserProvidedData> = {}
  ) => {
    return generateReport({
      analysisData,
      metadata,
      userProvidedData: {
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
        securityPersonTitle: '',
        ...userProvidedData
      },
      outputFormat: 'text',
      useAI: false
    })
  }

  return {
    generateReport,
    quickDownloadText,
    isGenerating,
    progress
  }
}

