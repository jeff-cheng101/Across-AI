"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

// WAF 風險數據類型定義
export interface WAFRiskData {
  id: string
  title: string
  severity: "critical" | "high" | "medium" | "low"
  openIssues: number
  resolvedIssues: number
  affectedAssets: number
  affectedUrlList?: string[]  // 🆕 受影響網址清單
  tags: string[]
  description: string
  aiInsight?: string  // AI 深度分析（可選）
  createdDate: string
  updatedDate: string
  exploitInWild: boolean
  internetExposed: boolean
  confirmedExploitable: boolean
  cveId?: string
  // 🆕 TOP 攻擊者清單
  topAttackers?: {
    ip: string
    country: string
    eventCount: number
    dropCount: number
    blockRate: string
    behavior: string
    targetPorts?: number[]
  }[]
  recommendations: {
    title: string
    description: string
    priority: "high" | "medium" | "low"
  }[]
}

interface WAFDataContextType {
  wafRisks: WAFRiskData[]
  setWafRisks: (risks: WAFRiskData[]) => void
  selectedBrand: string
  setSelectedBrand: (brand: string) => void
}

const WAFDataContext = createContext<WAFDataContextType | undefined>(undefined)

export function WAFDataProvider({ children }: { children: ReactNode }) {
  const [wafRisks, setWafRisks] = useState<WAFRiskData[]>([])
  const [selectedBrand, setSelectedBrand] = useState<string>("cloudflare")

  return (
    <WAFDataContext.Provider
      value={{
        wafRisks,
        setWafRisks,
        selectedBrand,
        setSelectedBrand,
      }}
    >
      {children}
    </WAFDataContext.Provider>
  )
}

export function useWAFData() {
  const context = useContext(WAFDataContext)
  if (context === undefined) {
    throw new Error("useWAFData must be used within a WAFDataProvider")
  }
  return context
}
