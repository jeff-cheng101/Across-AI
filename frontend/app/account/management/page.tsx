"use client"

/**
 * 管理後台儀表板（移植自 nebula-admin-console Dashboard）
 *
 * 業務背景：管理後台首頁，顯示系統總覽統計（成員數、部門數、角色數、活躍用戶）、
 * 訂閱方案使用率、以及快速入口按鈕。
 *
 * 資料流：目前使用靜態 mock 數據，後續可串接 API。
 *
 * 邊界條件：
 * - 由 layout.tsx 的 RoleGuard 保護，僅 management 角色可見
 * - 統計數值暫為靜態展示，待後端 API 就緒後替換
 */

import { motion } from 'framer-motion'
import { Users, Building2, ShieldCheck, Crown, Plus, UserPlus, TrendingUp, Activity } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

const DASHBOARD_STATS = [
  { label: '總成員數', value: '128', icon: Users, change: '+12%' },
  { label: '部門數', value: '8', icon: Building2, change: '+2' },
  { label: '角色數', value: '5', icon: ShieldCheck, change: '' },
  { label: '活躍用戶', value: '96', icon: Activity, change: '+8%' },
]

const containerAnimation = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
const itemAnimation = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function DashboardPage() {
  const router = useRouter()

  return (
    <motion.div variants={containerAnimation} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={itemAnimation}>
        <h1 className="text-2xl font-bold">儀表板</h1>
        <p className="text-muted-foreground text-sm mt-1">歡迎回來，系統管理員</p>
      </motion.div>

      {/* 訂閱方案 */}
      <motion.div variants={itemAnimation} className="neon-card p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-primary" />
            <span className="font-semibold">訂閱方案</span>
          </div>
          <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded-full">Enterprise</span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">帳號使用率</span>
            <span className="font-mono">128 / 200</span>
          </div>
          <Progress value={64} className="h-2" />
        </div>
      </motion.div>

      {/* 統計卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {DASHBOARD_STATS.map((stat) => (
          <motion.div key={stat.label} variants={itemAnimation} className="neon-card p-4">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <stat.icon className="h-[18px] w-[18px] text-primary" />
              </div>
              {stat.change && (
                <span className="text-xs text-primary flex items-center gap-0.5">
                  <TrendingUp className="h-3 w-3" />
                  {stat.change}
                </span>
              )}
            </div>
            <p className="text-2xl font-bold mt-3 font-mono">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* 快速入口 */}
      <motion.div variants={itemAnimation} className="neon-card p-5">
        <h2 className="font-semibold mb-4">快速入口</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm" onClick={() => router.push('/account/management/members')}>
            <UserPlus className="h-4 w-4 mr-2" />
            新增成員
          </Button>
          <Button variant="outline" size="sm" onClick={() => router.push('/account/management/departments')}>
            <Plus className="h-4 w-4 mr-2" />
            新增部門
          </Button>
          <Button variant="outline" size="sm" onClick={() => router.push('/account/management/roles')}>
            <ShieldCheck className="h-4 w-4 mr-2" />
            管理角色
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}
