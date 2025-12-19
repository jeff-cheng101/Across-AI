export interface NotificationRule {
  id: string
  name: string
  eventType: string
  riskLevels: {
    high: boolean
    medium: boolean
    low: boolean
  }
  channels: {
    line: {
      enabled: boolean
      botToken?: string
      recipients: string[]
    }
    telegram: {
      enabled: boolean
      botToken?: string
      chatIds: string[]
    }
    email: {
      enabled: boolean
      recipients: string[]
      ccRecipients?: string[]
    }
  }
  status: "active" | "inactive"
  createdAt: Date
  updatedAt: Date
}

const STORAGE_KEY = "notification-rules"

export const getNotificationRules = (): NotificationRule[] => {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEY)
  if (!data) return []
  const rules = JSON.parse(data)
  return rules.map((rule: NotificationRule) => ({
    ...rule,
    createdAt: new Date(rule.createdAt),
    updatedAt: new Date(rule.updatedAt),
  }))
}

export const saveNotificationRule = (rule: NotificationRule): void => {
  if (typeof window === "undefined") return
  const rules = getNotificationRules()
  const existingIndex = rules.findIndex((r) => r.id === rule.id)

  if (existingIndex >= 0) {
    rules[existingIndex] = { ...rule, updatedAt: new Date() }
  } else {
    rules.push(rule)
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(rules))
}

export const deleteNotificationRule = (id: string): void => {
  if (typeof window === "undefined") return
  const rules = getNotificationRules()
  const filtered = rules.filter((r) => r.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}

export const toggleRuleStatus = (id: string): void => {
  if (typeof window === "undefined") return
  const rules = getNotificationRules()
  const rule = rules.find((r) => r.id === id)
  if (rule) {
    rule.status = rule.status === "active" ? "inactive" : "active"
    rule.updatedAt = new Date()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rules))
  }
}
