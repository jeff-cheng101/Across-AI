export interface ActionRecord {
  id: string
  timestamp: Date
  platform: "cloudflare" | "f5" | "checkpoint"
  pageSnapshot: {
    totalEvents: number
    openIssues: number
    resolvedIssues: number
    affectedAssets: number
    riskLevel: "high" | "medium" | "low"
  }
  action: {
    title: string
    description: string
    issueType: string
    protectionMethod: string
  }
  results: {
    resolvedCount: number
    unresolvedCount: number
    resolvedIssues: Array<{
      endpoint: string
      count: number
      description: string
    }>
    unresolvedIssues: Array<{
      endpoint: string
      count: number
      reason: string
      recommendation: string
    }>
  }
  beforeState: {
    openIssues: number
    resolvedIssues: number
  }
  afterState: {
    openIssues: number
    resolvedIssues: number
  }
  impact: string
  status: "success" | "failed"
}

// 儲存操作記錄到 localStorage
export function saveActionRecord(record: ActionRecord): void {
  try {
    const existingRecords = getActionRecords()
    const updatedRecords = [record, ...existingRecords]
    localStorage.setItem("action_records", JSON.stringify(updatedRecords))
  } catch (error) {
    console.error("Error saving action record:", error)
  }
}

// 從 localStorage 讀取所有操作記錄
export function getActionRecords(): ActionRecord[] {
  try {
    const records = localStorage.getItem("action_records")
    if (!records) return []

    const parsed = JSON.parse(records)
    // 將日期字串轉換回 Date 物件
    return parsed.map((record: any) => ({
      ...record,
      timestamp: new Date(record.timestamp),
    }))
  } catch (error) {
    console.error("Error loading action records:", error)
    return []
  }
}

// 根據平台篩選記錄
export function getActionRecordsByPlatform(platform: "cloudflare" | "f5" | "checkpoint"): ActionRecord[] {
  const allRecords = getActionRecords()
  return allRecords.filter((record) => record.platform === platform)
}

// 清除所有記錄
export function clearAllActionRecords(): void {
  try {
    localStorage.removeItem("action_records")
  } catch (error) {
    console.error("Error clearing action records:", error)
  }
}

// 刪除特定記錄
export function deleteActionRecord(recordId: string): void {
  try {
    const existingRecords = getActionRecords()
    const updatedRecords = existingRecords.filter((record) => record.id !== recordId)
    localStorage.setItem("action_records", JSON.stringify(updatedRecords))
  } catch (error) {
    console.error("Error deleting action record:", error)
  }
}

// 刪除所有記錄或特定記錄
export function deleteAllRecords(recordId?: string): void {
  if (recordId) {
    // 刪除特定記錄
    deleteActionRecord(recordId)
  } else {
    // 清除所有記錄
    clearAllActionRecords()
  }
}

// 計算統計資訊
export function getActionStatistics() {
  const records = getActionRecords()

  return {
    totalActions: records.length,
    successfulActions: records.filter((r) => r.status === "success").length,
    failedActions: records.filter((r) => r.status === "failed").length,
    totalResolved: records.reduce((sum, r) => sum + (r.results?.resolvedCount || 0), 0),
    totalUnresolved: records.reduce((sum, r) => sum + (r.results?.unresolvedCount || 0), 0),
    cloudflareActions: records.filter((r) => r.platform === "cloudflare").length,
    f5Actions: records.filter((r) => r.platform === "f5").length,
    checkpointActions: records.filter((r) => r.platform === "checkpoint").length,
    highRiskActions: records.filter((r) => r.pageSnapshot?.riskLevel === "high").length,
    mediumRiskActions: records.filter((r) => r.pageSnapshot?.riskLevel === "medium").length,
    lowRiskActions: records.filter((r) => r.pageSnapshot?.riskLevel === "low").length,
  }
}
