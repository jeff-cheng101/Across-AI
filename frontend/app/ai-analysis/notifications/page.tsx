"use client"

import { useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import {
  Bell,
  Plus,
  Edit,
  Trash2,
  Power,
  Mail,
  MessageCircle,
  Send,
  ArrowLeft,
  Check,
  X,
  AlertTriangle,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import {
  getNotificationRules,
  saveNotificationRule,
  deleteNotificationRule,
  toggleRuleStatus,
  type NotificationRule,
} from "@/lib/notification-rules"

type ViewMode = "list" | "create" | "edit"

const eventTypes = [
  { value: "sql-injection", label: "SQL 注入攻擊" },
  { value: "xss-attack", label: "跨站腳本 (XSS) 攻擊" },
  { value: "ddos-attack", label: "DDoS 攻擊" },
  { value: "malicious-bot", label: "惡意機器人流量" },
  { value: "path-traversal", label: "路徑遍歷攻擊" },
  { value: "brute-force", label: "暴力破解攻擊" },
  { value: "all", label: "所有事件類型" },
]

export default function NotificationRulesPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [rules, setRules] = useState<NotificationRule[]>([])
  const [editingRule, setEditingRule] = useState<NotificationRule | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [ruleToDelete, setRuleToDelete] = useState<string | null>(null)
  const { toast } = useToast()

  // Form state
  const [formData, setFormData] = useState<Partial<NotificationRule>>({
    name: "",
    eventType: "",
    riskLevels: { high: true, medium: true, low: false },
    channels: {
      line: { enabled: false, botToken: "", recipients: [] },
      telegram: { enabled: false, botToken: "", chatIds: [] },
      email: { enabled: false, recipients: [], ccRecipients: [] },
    },
    status: "active",
  })

  const [newRecipient, setNewRecipient] = useState({ line: "", telegram: "", email: "", emailCc: "" })

  useEffect(() => {
    loadRules()
  }, [])

  const loadRules = () => {
    const loadedRules = getNotificationRules()
    setRules(loadedRules)
  }

  const handleCreateNew = () => {
    setFormData({
      name: "",
      eventType: "",
      riskLevels: { high: true, medium: true, low: false },
      channels: {
        line: { enabled: false, botToken: "", recipients: [] },
        telegram: { enabled: false, botToken: "", chatIds: [] },
        email: { enabled: false, recipients: [], ccRecipients: [] },
      },
      status: "active",
    })
    setEditingRule(null)
    setViewMode("create")
  }

  const handleEdit = (rule: NotificationRule) => {
    setEditingRule(rule)
    setFormData(rule)
    setViewMode("edit")
  }

  const handleSave = () => {
    if (!formData.name || !formData.eventType) {
      toast({
        title: "驗證錯誤",
        description: "請填寫所有必填欄位",
        variant: "destructive",
      })
      return
    }

    const hasChannel =
      formData.channels?.line?.enabled || formData.channels?.telegram?.enabled || formData.channels?.email?.enabled

    if (!hasChannel) {
      toast({
        title: "驗證錯誤",
        description: "請至少選擇一種通知方式",
        variant: "destructive",
      })
      return
    }

    const rule: NotificationRule = {
      id: editingRule?.id || `rule-${Date.now()}`,
      name: formData.name!,
      eventType: formData.eventType!,
      riskLevels: formData.riskLevels!,
      channels: formData.channels!,
      status: formData.status!,
      createdAt: editingRule?.createdAt || new Date(),
      updatedAt: new Date(),
    }

    saveNotificationRule(rule)
    loadRules()
    setViewMode("list")

    toast({
      title: editingRule ? "規則已更新" : "規則已創建",
      description: `通知規則 "${rule.name}" 已${editingRule ? "更新" : "創建"}成功`,
    })
  }

  const handleDelete = (id: string) => {
    setRuleToDelete(id)
    setDeleteConfirmOpen(true)
  }

  const confirmDelete = () => {
    if (ruleToDelete) {
      deleteNotificationRule(ruleToDelete)
      loadRules()
      toast({
        title: "規則已刪除",
        description: "通知規則已成功刪除",
      })
    }
    setDeleteConfirmOpen(false)
    setRuleToDelete(null)
  }

  const handleToggleStatus = (id: string) => {
    toggleRuleStatus(id)
    loadRules()
  }

  const addRecipient = (channel: "line" | "telegram" | "email" | "emailCc") => {
    const value = newRecipient[channel].trim()
    if (!value) return

    setFormData((prev) => {
      const updated = { ...prev }
      if (channel === "line") {
        updated.channels!.line.recipients = [...(updated.channels!.line.recipients || []), value]
      } else if (channel === "telegram") {
        updated.channels!.telegram.chatIds = [...(updated.channels!.telegram.chatIds || []), value]
      } else if (channel === "email") {
        updated.channels!.email.recipients = [...(updated.channels!.email.recipients || []), value]
      } else if (channel === "emailCc") {
        updated.channels!.email.ccRecipients = [...(updated.channels!.email.ccRecipients || []), value]
      }
      return updated
    })

    setNewRecipient((prev) => ({ ...prev, [channel]: "" }))
  }

  const removeRecipient = (channel: "line" | "telegram" | "email" | "emailCc", index: number) => {
    setFormData((prev) => {
      const updated = { ...prev }
      if (channel === "line") {
        updated.channels!.line.recipients = updated.channels!.line.recipients.filter((_, i) => i !== index)
      } else if (channel === "telegram") {
        updated.channels!.telegram.chatIds = updated.channels!.telegram.chatIds.filter((_, i) => i !== index)
      } else if (channel === "email") {
        updated.channels!.email.recipients = updated.channels!.email.recipients.filter((_, i) => i !== index)
      } else if (channel === "emailCc") {
        updated.channels!.email.ccRecipients = updated.channels!.email.ccRecipients?.filter((_, i) => i !== index)
      }
      return updated
    })
  }

  const getChannelBadges = (rule: NotificationRule) => {
    const badges = []
    if (rule.channels.line.enabled)
      badges.push(
        <Badge key="line" className="bg-gray-500/20 text-gray-400">
          Line
        </Badge>,
      )
    if (rule.channels.telegram.enabled)
      badges.push(
        <Badge key="telegram" className="bg-gray-500/20 text-gray-400">
          Telegram
        </Badge>,
      )
    if (rule.channels.email.enabled)
      badges.push(
        <Badge key="email" className="bg-gray-500/20 text-gray-400">
          Email
        </Badge>,
      )
    return badges
  }

  const getRiskLevelBadges = (rule: NotificationRule) => {
    const badges = []
    if (rule.riskLevels.high)
      badges.push(
        <Badge key="high" className="bg-red-500/20 text-red-400">
          高
        </Badge>,
      )
    if (rule.riskLevels.medium)
      badges.push(
        <Badge key="medium" className="bg-yellow-500/20 text-yellow-400">
          中
        </Badge>,
      )
    if (rule.riskLevels.low)
      badges.push(
        <Badge key="low" className="bg-blue-500/20 text-blue-400">
          低
        </Badge>,
      )
    return badges
  }

  const getNotificationRecipients = (rule: NotificationRule) => {
    const recipients: { channel: string; icon: any; color: string; list: string[] }[] = []

    if (rule.channels.line.enabled && rule.channels.line.recipients.length > 0) {
      recipients.push({
        channel: "Line",
        icon: MessageCircle,
        color: "text-green-400",
        list: rule.channels.line.recipients,
      })
    }

    if (rule.channels.telegram.enabled && rule.channels.telegram.chatIds.length > 0) {
      recipients.push({
        channel: "Telegram",
        icon: Send,
        color: "text-blue-400",
        list: rule.channels.telegram.chatIds,
      })
    }

    if (rule.channels.email.enabled && rule.channels.email.recipients.length > 0) {
      const emailList = [...rule.channels.email.recipients]
      if (rule.channels.email.ccRecipients && rule.channels.email.ccRecipients.length > 0) {
        emailList.push(...rule.channels.email.ccRecipients.map((cc) => `${cc} (CC)`))
      }
      recipients.push({
        channel: "Email",
        icon: Mail,
        color: "text-purple-400",
        list: emailList,
      })
    }

    return recipients
  }

  if (viewMode === "create" || viewMode === "edit") {
    return (
      <div className="p-6">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setViewMode("list")}
            className="text-slate-400 hover:bg-gray-500/20 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回列表
          </Button>
          <h1 className="text-3xl font-bold text-white mb-2">
            {viewMode === "create" ? "新增通知規則" : "編輯通知規則"}
          </h1>
          <p className="text-slate-400">設定當發生特定風險事件時的通知規則</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Basic Info */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-900/40 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">基本資訊</CardTitle>
                <CardDescription className="text-slate-400">設定規則名稱和事件類型</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-slate-300">
                    規則名稱 *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="例如：SQL注入高風險通知"
                    className="bg-slate-800/50 border-white/10 text-white mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="eventType" className="text-slate-300">
                    事件類型 *
                  </Label>
                  <Select
                    value={formData.eventType}
                    onValueChange={(value) => setFormData({ ...formData, eventType: value })}
                  >
                    <SelectTrigger className="bg-slate-800/50 border-white/10 text-white mt-2">
                      <SelectValue placeholder="選擇事件類型" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10">
                      {eventTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value} className="text-white">
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-slate-300 mb-3 block">告警風險等級</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <span className="text-red-400 font-medium">高風險</span>
                      </div>
                      <Switch
                        checked={formData.riskLevels?.high}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            riskLevels: { ...formData.riskLevels!, high: checked },
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 font-medium">中風險</span>
                      </div>
                      <Switch
                        checked={formData.riskLevels?.medium}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            riskLevels: { ...formData.riskLevels!, medium: checked },
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-400 font-medium">低風險</span>
                      </div>
                      <Switch
                        checked={formData.riskLevels?.low}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            riskLevels: { ...formData.riskLevels!, low: checked },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Notification Channels */}
          <div className="lg:col-span-2 space-y-6">
            {/* Line */}
            <Card className="bg-slate-900/40 border-white/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-green-400" />
                    <CardTitle className="text-white">Line 通知</CardTitle>
                  </div>
                  <Switch
                    checked={formData.channels?.line?.enabled}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        channels: {
                          ...formData.channels!,
                          line: { ...formData.channels!.line, enabled: checked },
                        },
                      })
                    }
                  />
                </div>
              </CardHeader>
              {formData.channels?.line?.enabled && (
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="lineBotToken" className="text-slate-300">
                      Bot Token
                    </Label>
                    <Input
                      id="lineBotToken"
                      value={formData.channels.line.botToken}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          channels: {
                            ...formData.channels!,
                            line: { ...formData.channels!.line, botToken: e.target.value },
                          },
                        })
                      }
                      placeholder="輸入 Line Bot Token"
                      className="bg-slate-800/50 border-white/10 text-white mt-2"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">收件人 User ID</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={newRecipient.line}
                        onChange={(e) => setNewRecipient({ ...newRecipient, line: e.target.value })}
                        placeholder="輸入 Line User ID"
                        className="bg-slate-800/50 border-white/10 text-white"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addRecipient("line")
                          }
                        }}
                      />
                      <Button
                        onClick={() => addRecipient("line")}
                        className="bg-gray-700 hover:bg-gray-600 h-8 w-8 p-0"
                        size="sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                    {formData.channels?.line?.recipients && formData.channels.line.recipients.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <div className="text-xs text-slate-400">已添加的收件人：</div>
                        <div className="flex flex-wrap gap-2">
                          {formData.channels.line.recipients.map((recipient, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="bg-green-500/20 text-green-300 border border-green-500/30 pr-1"
                            >
                              {recipient}
                              <button
                                onClick={() => removeRecipient("line", idx)}
                                className="ml-2 hover:bg-green-600/30 rounded-full p-0.5"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Telegram */}
            <Card className="bg-slate-900/40 border-white/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Send className="w-5 h-5 text-blue-400" />
                    <CardTitle className="text-white">Telegram 通知</CardTitle>
                  </div>
                  <Switch
                    checked={formData.channels?.telegram?.enabled}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        channels: {
                          ...formData.channels!,
                          telegram: { ...formData.channels!.telegram, enabled: checked },
                        },
                      })
                    }
                  />
                </div>
              </CardHeader>
              {formData.channels?.telegram?.enabled && (
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="telegramBotToken" className="text-slate-300">
                      Bot Token
                    </Label>
                    <Input
                      id="telegramBotToken"
                      value={formData.channels.telegram.botToken}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          channels: {
                            ...formData.channels!,
                            telegram: { ...formData.channels!.telegram, botToken: e.target.value },
                          },
                        })
                      }
                      placeholder="輸入 Telegram Bot Token"
                      className="bg-slate-800/50 border-white/10 text-white mt-2"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Chat ID</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={newRecipient.telegram}
                        onChange={(e) => setNewRecipient({ ...newRecipient, telegram: e.target.value })}
                        placeholder="輸入 Telegram Chat ID"
                        className="bg-slate-800/50 border-white/10 text-white"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addRecipient("telegram")
                          }
                        }}
                      />
                      <Button
                        onClick={() => addRecipient("telegram")}
                        className="bg-gray-700 hover:bg-gray-600 h-8 w-8 p-0"
                        size="sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                    {formData.channels?.telegram?.chatIds && formData.channels.telegram.chatIds.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <div className="text-xs text-slate-400">已添加的 Chat ID：</div>
                        <div className="flex flex-wrap gap-2">
                          {formData.channels.telegram.chatIds.map((chatId, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="bg-blue-500/20 text-blue-300 border border-blue-500/30 pr-1"
                            >
                              {chatId}
                              <button
                                onClick={() => removeRecipient("telegram", idx)}
                                className="ml-2 hover:bg-blue-600/30 rounded-full p-0.5"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Email */}
            <Card className="bg-slate-900/40 border-white/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-purple-400" />
                    <CardTitle className="text-white">Email 通知</CardTitle>
                  </div>
                  <Switch
                    checked={formData.channels?.email?.enabled}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        channels: {
                          ...formData.channels!,
                          email: { ...formData.channels!.email, enabled: checked },
                        },
                      })
                    }
                  />
                </div>
              </CardHeader>
              {formData.channels?.email?.enabled && (
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-slate-300">收件人 Email</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={newRecipient.email}
                        onChange={(e) => setNewRecipient({ ...newRecipient, email: e.target.value })}
                        placeholder="輸入 Email 地址"
                        type="email"
                        className="bg-slate-800/50 border-white/10 text-white"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addRecipient("email")
                          }
                        }}
                      />
                      <Button
                        onClick={() => addRecipient("email")}
                        className="bg-gray-700 hover:bg-gray-600 h-8 w-8 p-0"
                        size="sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                    {formData.channels?.email?.recipients && formData.channels.email.recipients.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <div className="text-xs text-slate-400">已添加的收件人：</div>
                        <div className="flex flex-wrap gap-2">
                          {formData.channels.email.recipients.map((email, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="bg-purple-500/20 text-purple-300 border border-purple-500/30 pr-1"
                            >
                              {email}
                              <button
                                onClick={() => removeRecipient("email", idx)}
                                className="ml-2 hover:bg-purple-600/30 rounded-full p-0.5"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label className="text-slate-300">副本收件人 (CC)</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={newRecipient.emailCc}
                        onChange={(e) => setNewRecipient({ ...newRecipient, emailCc: e.target.value })}
                        placeholder="輸入副本 Email 地址"
                        type="email"
                        className="bg-slate-800/50 border-white/10 text-white"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addRecipient("emailCc")
                          }
                        }}
                      />
                      <Button
                        onClick={() => addRecipient("emailCc")}
                        className="bg-gray-700 hover:bg-gray-600 h-8 w-8 p-0"
                        size="sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                    {formData.channels?.email?.ccRecipients && formData.channels.email.ccRecipients.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <div className="text-xs text-slate-400">已添加的副本收件人：</div>
                        <div className="flex flex-wrap gap-2">
                          {formData.channels.email.ccRecipients.map((ccEmail, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="bg-purple-500/20 text-purple-300 border border-purple-500/30 pr-1"
                            >
                              {ccEmail}
                              <button
                                onClick={() => removeRecipient("emailCc", idx)}
                                className="ml-2 hover:bg-purple-600/30 rounded-full p-0.5"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setViewMode("list")}
                className="border-white/10 text-white hover:bg-white/5"
              >
                取消
              </Button>
              <Button onClick={handleSave} className="bg-cyan-600 hover:bg-cyan-700 text-white">
                <Check className="w-4 h-4 mr-2" />
                {viewMode === "create" ? "創建規則" : "保存變更"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link href="/ai-analysis/cloudflare">
              <Button variant="ghost" className="text-slate-400 hover:bg-gray-500/20 p-2">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-white">通知規則管理</h1>
          </div>
          <p className="text-slate-400 ml-14">設定和管理安全事件的通知規則</p>
        </div>
        <Button onClick={handleCreateNew} className="bg-cyan-600 hover:bg-cyan-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          新增規則
        </Button>
      </div>

      {rules.length === 0 ? (
        <Card className="bg-slate-900/40 border-white/10">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="w-16 h-16 text-slate-600 mb-4" />
            <p className="text-slate-400 text-lg mb-4">尚未設定任何通知規則</p>
            <Button onClick={handleCreateNew} className="bg-cyan-600 hover:bg-cyan-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              創建第一個規則
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-slate-900/40 border border-white/10 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-slate-300 font-semibold">規則名稱</TableHead>
                <TableHead className="text-slate-300 font-semibold">事件類型</TableHead>
                <TableHead className="text-slate-300 font-semibold">風險等級</TableHead>
                <TableHead className="text-slate-300 font-semibold">通知管道</TableHead>
                <TableHead className="text-slate-300 font-semibold">通知人員</TableHead>
                <TableHead className="text-slate-300 font-semibold">狀態</TableHead>
                <TableHead className="text-slate-300 font-semibold text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {rules.map((rule) => (
                  <TableRow key={rule.id} className="border-white/10 hover:bg-white/5 transition-colors">
                    <TableCell className="font-medium text-white">
                      <div className="flex flex-col gap-1">
                        <span>{rule.name}</span>
                        <span className="text-xs text-slate-500">
                          {new Date(rule.updatedAt).toLocaleString("zh-TW")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50">
                        {eventTypes.find((t) => t.value === rule.eventType)?.label || rule.eventType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">{getRiskLevelBadges(rule)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">{getChannelBadges(rule)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2 max-w-md">
                        {getNotificationRecipients(rule).map((recipientGroup, idx) => {
                          const Icon = recipientGroup.icon
                          return (
                            <div key={idx} className="flex items-start gap-2">
                              <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${recipientGroup.color}`} />
                              <div className="flex-1 min-w-0">
                                <div className="text-xs text-slate-400 mb-1">
                                  {recipientGroup.channel} ({recipientGroup.list.length})
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {recipientGroup.list.slice(0, 2).map((recipient, rIdx) => (
                                    <Badge
                                      key={rIdx}
                                      variant="secondary"
                                      className="bg-slate-700/50 text-slate-300 text-xs font-normal"
                                    >
                                      {recipient.length > 20 ? recipient.substring(0, 20) + "..." : recipient}
                                    </Badge>
                                  ))}
                                  {recipientGroup.list.length > 2 && (
                                    <Badge
                                      variant="secondary"
                                      className="bg-slate-700/50 text-slate-400 text-xs font-normal"
                                    >
                                      +{recipientGroup.list.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                        {getNotificationRecipients(rule).length === 0 && (
                          <div className="text-xs text-slate-500 italic">尚未設定</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          rule.status === "active"
                            ? "bg-green-500/20 text-green-400 border-green-500/50"
                            : "bg-slate-500/20 text-slate-400 border-slate-500/50"
                        }
                      >
                        {rule.status === "active" ? "啟用中" : "已停用"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(rule.id)}
                          className={
                            rule.status === "active"
                              ? "text-green-400 hover:bg-green-900/20"
                              : "text-slate-400 hover:bg-slate-800/50"
                          }
                        >
                          <Power className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(rule)}
                          className="text-cyan-400 hover:bg-cyan-900/20"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(rule.id)}
                          className="text-red-400 hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent className="bg-slate-900 border-red-500/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              確認刪除
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-300">
              確定要刪除此通知規則嗎？此操作無法復原。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-800 text-white border-white/10 hover:bg-slate-700">
              取消
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white">
              確認刪除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
