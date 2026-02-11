"use client"

/**
 * 管理後台共用版型（移植自 nebula-admin-console AdminLayout）
 *
 * 業務背景：為 /account/management 下所有子頁面提供統一的側欄導覽、
 * 頁首與頁尾，維持 Nebula 管理後台的設計語彙與資訊架構。
 *
 * 資料流：RoleGuard 驗證 → AdminHeader / AdminSidebar → 子頁內容
 *
 * 邊界條件：
 * - 僅 management 角色可進入此版型
 * - 不包含 login 頁面或登入流程
 * - 既有角色導向機制（management/reseller/user → /account/management）不受影響
 *
 * 依賴：@/components/role-guard、@/app/util/authenticator、@/app/routes/auth
 */

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Building2,
  ShieldCheck,
  Users,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  User,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { RoleGuard } from '@/components/role-guard'
import authenticator from '@/app/util/authenticator'
import { logout } from '@/app/routes/auth'

import './admin-console.css'

// ===== 側欄導覽項目定義 =====
const ADMIN_NAV_ITEMS = [
  { title: '儀表板', icon: LayoutDashboard, path: '/account/management' },
  { title: '組織與部門', icon: Building2, path: '/account/management/departments' },
  { title: '權限與角色', icon: ShieldCheck, path: '/account/management/roles' },
  { title: '成員管理', icon: Users, path: '/account/management/members' },
  { title: '企業設定', icon: Settings, path: '/account/management/settings' },
]

// ===== AdminSidebar =====
function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  return (
    <aside
      className={cn(
        'h-full border-r border-border bg-sidebar flex flex-col transition-all duration-300 relative',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      <div className="flex justify-end px-2 pt-3 pb-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
        >
          {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </Button>
      </div>
      <nav className="flex-1 py-2 px-2 space-y-1">
        {ADMIN_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.path
          const btn = (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 sidebar-nav-glow',
                isActive
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-sidebar-foreground hover:bg-muted/50 hover:text-foreground'
              )}
            >
              <item.icon className={cn('h-[18px] w-[18px] shrink-0', isActive && 'text-primary')} />
              {!collapsed && <span>{item.title}</span>}
            </button>
          )

          if (collapsed) {
            return (
              <Tooltip key={item.path}>
                <TooltipTrigger asChild>{btn}</TooltipTrigger>
                <TooltipContent side="right">{item.title}</TooltipContent>
              </Tooltip>
            )
          }
          return btn
        })}
      </nav>
    </aside>
  )
}

// ===== AdminHeader =====
function AdminHeader() {
  const auth = authenticator.authValue
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  return (
    <header className="h-14 border-b border-border bg-card/80 backdrop-blur-md flex items-center justify-between px-4 z-50 relative">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-primary text-lg">ACROSS</span>
          <span className="font-semibold text-foreground hidden sm:inline">後台管理系統</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/account/management/settings')}
          className="text-muted-foreground hover:text-foreground"
        >
          <Settings className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="text-sm hidden sm:inline">{auth?.user?.name ?? '管理員'}</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-3 py-2">
              <p className="text-sm font-medium">{auth?.user?.name ?? '管理員'}</p>
              <p className="text-xs text-muted-foreground">{auth?.user?.email ?? ''}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="h-4 w-4 mr-2" />
              登出
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

// ===== AdminFooter =====
function AdminFooter() {
  return (
    <footer className="h-10 border-t border-border bg-card/50 flex items-center justify-center">
      <p className="text-xs text-muted-foreground">&copy; 2026 ACROSS. All rights reserved.</p>
    </footer>
  )
}

// ===== Layout =====
export default function ManagementLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={['management']}>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col bg-background">
          <AdminHeader />
          <div className="flex flex-1 overflow-hidden">
            <AdminSidebar />
            <main className="flex-1 overflow-auto p-6 relative">
              <div className="ai-bg-flow" />
              <div className="relative z-10">
                {children}
              </div>
            </main>
          </div>
          <AdminFooter />
        </div>
      </TooltipProvider>
    </RoleGuard>
  )
}
