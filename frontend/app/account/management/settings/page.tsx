"use client"

/**
 * 企業設定（移植自 nebula-admin-console EnterpriseSettings）
 *
 * 業務背景：顯示企業基本資訊與訂閱方案，為唯讀頁面。
 * 後續可加入編輯功能。
 *
 * 資料流：目前使用靜態 mock 數據，後續可串接企業設定 API。
 */

import { motion } from 'framer-motion'
import { Building, Globe, Mail, Phone, MapPin, CreditCard, Calendar } from 'lucide-react'

export default function EnterpriseSettingsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">企業設定</h1>
        <p className="text-sm text-muted-foreground mt-1">檢視企業基本資訊</p>
      </div>

      {/* 訂閱資訊 */}
      <div className="neon-card p-6 space-y-4">
        <h2 className="text-lg font-semibold">訂閱資訊</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CreditCard className="h-3.5 w-3.5" />
              目前方案
            </div>
            <p className="text-sm font-medium">Pro</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              到期日
            </div>
            <p className="text-sm font-medium">2026-12-31</p>
          </div>
        </div>
      </div>

      {/* 公司資訊 */}
      <div className="neon-card p-6 space-y-4">
        <h2 className="text-lg font-semibold">公司資訊</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building className="h-3.5 w-3.5" />
              公司名稱
            </div>
            <p className="text-sm font-medium">NexusAdmin Corp.</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Globe className="h-3.5 w-3.5" />
              Logo
            </div>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-3.5 w-3.5" />
              聯絡信箱
            </div>
            <p className="text-sm font-medium">admin@nexusadmin.ai</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-3.5 w-3.5" />
              電話
            </div>
            <p className="text-sm font-medium">+886-2-1234-5678</p>
          </div>
          <div className="space-y-1 sm:col-span-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              住址
            </div>
            <p className="text-sm font-medium">台北市信義區信義路五段7號</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
