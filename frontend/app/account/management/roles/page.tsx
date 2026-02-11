"use client"

/**
 * 權限與角色管理（移植自 nebula-admin-console Roles + permissions data）
 *
 * 業務背景：管理系統角色與其對應的細粒度權限矩陣。
 * 角色可勾選 AIE/AIG/AIS 三大模組下各子模組的唯讀/編輯/刪除權限。
 * 提供「角色管理」（卡片式 CRUD）與「權限設定」（矩陣表格）兩個 Tab。
 *
 * 資料流：目前使用本地狀態 mock 數據與預設角色權限，後續可串接角色管理 API。
 *
 * 邊界條件：
 * - 角色名稱不可為空
 * - 刪除角色需確認（AlertDialog）
 * - 預設角色可編輯但標示「預設」標籤
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Plus, Pencil, Trash2, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

// ===== Permission 資料定義（移植自 nebula-admin-console/src/data/permissions.ts）=====

type PermissionSubModule = {
  name: string
  actions: string[]
}

type PermissionModule = {
  code: string
  name: string
  subModules: PermissionSubModule[]
}

const PERMISSION_ACTIONS = ['唯讀', '編輯', '刪除']

const PERMISSION_MODULES: PermissionModule[] = [
  {
    code: 'AIE',
    name: 'AI 生態系 (AI EcoSystem Module)',
    subModules: [
      { name: '意藍模組', actions: PERMISSION_ACTIONS },
      { name: '達哥模組', actions: PERMISSION_ACTIONS },
    ],
  },
  {
    code: 'AIG',
    name: 'AI 治理模組 (AI Governance Module)',
    subModules: [
      { name: 'AI 模型使用分析儀表板 (Token Dashboard)', actions: PERMISSION_ACTIONS },
      { name: '安全護欄 (Guardrail)', actions: PERMISSION_ACTIONS },
      { name: '模型權限控制 (Teams)', actions: PERMISSION_ACTIONS },
      { name: '虛擬金鑰管理 (Virtual Keys)', actions: PERMISSION_ACTIONS },
      { name: 'Agent Gateway', actions: PERMISSION_ACTIONS },
      { name: 'AI Gateway - 模型路由與設定 (Models + Endpoint)', actions: PERMISSION_ACTIONS },
      { name: 'AI Gateway - 預算管理 (Budgeting)', actions: PERMISSION_ACTIONS },
      { name: 'AI Gateway - 帳單 (Billing)', actions: PERMISSION_ACTIONS },
    ],
  },
  {
    code: 'AIS',
    name: 'AI 資安防禦模組 (AI Security Module)',
    subModules: [
      { name: '資安 Dashboard', actions: PERMISSION_ACTIONS },
      { name: 'Data Lake (資料收容)', actions: PERMISSION_ACTIONS },
      { name: 'AI Cyber Security Analysis', actions: PERMISSION_ACTIONS },
      { name: 'AI 代理 (客製化)', actions: PERMISSION_ACTIONS },
      { name: 'AI Chat (for 資安)', actions: PERMISSION_ACTIONS },
    ],
  },
]

/** 產生扁平化權限鍵，例如 "AIE.意藍模組.唯讀" */
const buildPermissionKey = (code: string, sub: string, action: string) =>
  `${code}.${sub}.${action}`

/** 取得所有權限鍵 */
const getAllPermissionKeys = (): string[] => {
  const keys: string[] = []
  for (const mod of PERMISSION_MODULES) {
    for (const sub of mod.subModules) {
      for (const action of sub.actions) {
        keys.push(buildPermissionKey(mod.code, sub.name, action))
      }
    }
  }
  return keys
}

/** 建立全部為 true/false 的權限 map */
const createPermissionMap = (value: boolean): Record<string, boolean> =>
  Object.fromEntries(getAllPermissionKeys().map(k => [k, value]))

/** 預設角色權限 */
const DEFAULT_ROLE_PERMISSIONS: Record<string, Record<string, boolean>> = {
  ADMIN: createPermissionMap(true),
  '一般人員': (() => {
    const perms = createPermissionMap(false)
    for (const mod of PERMISSION_MODULES) {
      if (mod.code === 'AIE' || mod.code === 'AIG') {
        for (const sub of mod.subModules) {
          for (const action of sub.actions) {
            perms[buildPermissionKey(mod.code, sub.name, action)] = true
          }
        }
      }
      if (mod.code === 'AIS') {
        for (const sub of mod.subModules) {
          const isOpen = ['AI Cyber Security Analysis', 'AI 代理 (客製化)', 'AI Chat (for 資安)'].includes(sub.name)
          for (const action of sub.actions) {
            perms[buildPermissionKey(mod.code, sub.name, action)] = isOpen
          }
        }
      }
    }
    return perms
  })(),
  '非資安人員': (() => {
    const perms = createPermissionMap(false)
    for (const mod of PERMISSION_MODULES) {
      if (mod.code === 'AIE') {
        for (const sub of mod.subModules) {
          for (const action of sub.actions) {
            perms[buildPermissionKey(mod.code, sub.name, action)] = true
          }
        }
      }
      if (mod.code === 'AIS') {
        for (const sub of mod.subModules) {
          const isOpen = ['AI Cyber Security Analysis', 'AI 代理 (客製化)', 'AI Chat (for 資安)'].includes(sub.name)
          for (const action of sub.actions) {
            perms[buildPermissionKey(mod.code, sub.name, action)] = isOpen
          }
        }
      }
    }
    return perms
  })(),
}

// ===== Role 型別與初始資料 =====

type Role = {
  id: string
  name: string
  isDefault: boolean
  permissions: Record<string, boolean>
}

const INITIAL_ROLES: Role[] = [
  { id: '1', name: 'ADMIN', isDefault: true, permissions: { ...DEFAULT_ROLE_PERMISSIONS['ADMIN'] } },
  { id: '2', name: '一般人員', isDefault: true, permissions: { ...DEFAULT_ROLE_PERMISSIONS['一般人員'] } },
  { id: '3', name: '非資安人員', isDefault: true, permissions: { ...DEFAULT_ROLE_PERMISSIONS['非資安人員'] } },
]

// ===== 頁面元件 =====

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>(INITIAL_ROLES)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [newRoleName, setNewRoleName] = useState('')
  const [newRolePermissions, setNewRolePermissions] = useState<Record<string, boolean>>(createPermissionMap(false))
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null)
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({})

  const toggleModuleExpansion = (code: string) => {
    setExpandedModules(prev => ({ ...prev, [code]: !prev[code] }))
  }

  const openAddRoleDialog = () => {
    setEditingRole(null)
    setNewRoleName('')
    setNewRolePermissions(createPermissionMap(false))
    setDialogOpen(true)
  }

  const openEditRoleDialog = (role: Role) => {
    setEditingRole(role)
    setNewRoleName(role.name)
    setNewRolePermissions({ ...role.permissions })
    setDialogOpen(true)
  }

  const saveRole = () => {
    if (!newRoleName.trim()) return
    if (editingRole) {
      setRoles(prev => prev.map(r =>
        r.id === editingRole.id ? { ...r, name: newRoleName, permissions: newRolePermissions } : r
      ))
    } else {
      setRoles(prev => [...prev, {
        id: Date.now().toString(),
        name: newRoleName,
        isDefault: false,
        permissions: { ...newRolePermissions },
      }])
    }
    setDialogOpen(false)
  }

  const deleteRole = (role: Role) => {
    setRoles(prev => prev.filter(r => r.id !== role.id))
    setDeleteTarget(null)
  }

  const togglePermission = (roleId: string, key: string) => {
    setRoles(prev => prev.map(r =>
      r.id === roleId
        ? { ...r, permissions: { ...r.permissions, [key]: !r.permissions[key] } }
        : r
    ))
  }

  const isModuleAllChecked = (role: Role, code: string) => {
    const mod = PERMISSION_MODULES.find(m => m.code === code)
    if (!mod) return false
    return mod.subModules.every(sub =>
      sub.actions.every(action => role.permissions[buildPermissionKey(code, sub.name, action)])
    )
  }

  const isModuleSomeChecked = (role: Role, code: string) => {
    const mod = PERMISSION_MODULES.find(m => m.code === code)
    if (!mod) return false
    return mod.subModules.some(sub =>
      sub.actions.some(action => role.permissions[buildPermissionKey(code, sub.name, action)])
    )
  }

  const toggleModuleAllPermissions = (roleId: string, code: string) => {
    setRoles(prev => prev.map(r => {
      if (r.id !== roleId) return r
      const allChecked = isModuleAllChecked(r, code)
      const newPerms = { ...r.permissions }
      const mod = PERMISSION_MODULES.find(m => m.code === code)
      if (!mod) return r
      mod.subModules.forEach(sub => {
        sub.actions.forEach(action => {
          newPerms[buildPermissionKey(code, sub.name, action)] = !allChecked
        })
      })
      return { ...r, permissions: newPerms }
    }))
  }

  const isSubModuleAllChecked = (role: Role, code: string, subName: string, actions: string[]) => {
    return actions.every(action => role.permissions[buildPermissionKey(code, subName, action)])
  }

  const isSubModuleSomeChecked = (role: Role, code: string, subName: string, actions: string[]) => {
    return actions.some(action => role.permissions[buildPermissionKey(code, subName, action)])
  }

  const toggleSubModuleAllPermissions = (roleId: string, code: string, subName: string, actions: string[]) => {
    setRoles(prev => prev.map(r => {
      if (r.id !== roleId) return r
      const allChecked = isSubModuleAllChecked(r, code, subName, actions)
      const newPerms = { ...r.permissions }
      actions.forEach(action => {
        newPerms[buildPermissionKey(code, subName, action)] = !allChecked
      })
      return { ...r, permissions: newPerms }
    }))
  }

  const countActivePermissions = (role: Role) => {
    const allKeys = getAllPermissionKeys()
    return allKeys.filter(k => role.permissions[k]).length
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">權限與角色</h1>
        <p className="text-sm text-muted-foreground mt-1">管理角色及其對應的系統權限</p>
      </div>

      <Tabs defaultValue="roles" className="w-full">
        <TabsList>
          <TabsTrigger value="roles">角色管理</TabsTrigger>
          <TabsTrigger value="matrix">權限設定</TabsTrigger>
        </TabsList>

        {/* Tab 1: 角色管理 */}
        <TabsContent value="roles" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={openAddRoleDialog}>
              <Plus className="h-4 w-4 mr-2" />
              新增角色
            </Button>
          </div>
          <div className="grid gap-3">
            {roles.map(role => (
              <div key={role.id} className="neon-card flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <div>
                    <span className="font-medium">{role.name}</span>
                    {role.isDefault && (
                      <span className="ml-2 text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">預設</span>
                    )}
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {countActivePermissions(role)} / {getAllPermissionKeys().length} 項權限
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => openEditRoleDialog(role)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(role)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Tab 2: 權限設定 Matrix */}
        <TabsContent value="matrix">
          <div className="neon-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 font-medium text-muted-foreground sticky left-0 bg-card z-10 min-w-[280px]">
                      功能細項
                    </th>
                    {roles.map(role => (
                      <th key={role.id} className="p-3 text-center font-medium min-w-[100px]">
                        {role.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PERMISSION_MODULES.map(mod => (
                    <>
                      {/* Module header row */}
                      <tr
                        key={mod.code}
                        className="bg-muted/50 cursor-pointer hover:bg-muted/70 transition-colors"
                        onClick={() => toggleModuleExpansion(mod.code)}
                      >
                        <td className="p-3 font-semibold sticky left-0 bg-muted/50 z-10">
                          <div className="flex items-center gap-2">
                            <ChevronRight className={`h-4 w-4 transition-transform ${expandedModules[mod.code] ? 'rotate-90' : ''}`} />
                            <span>{mod.code} - {mod.name}</span>
                          </div>
                        </td>
                        {roles.map(role => {
                          const allChecked = isModuleAllChecked(role, mod.code)
                          const someChecked = isModuleSomeChecked(role, mod.code)
                          return (
                            <td key={role.id} className="p-3 text-center" onClick={e => e.stopPropagation()}>
                              <div className="flex justify-center">
                                <Checkbox
                                  checked={allChecked ? true : someChecked ? 'indeterminate' : false}
                                  onCheckedChange={() => toggleModuleAllPermissions(role.id, mod.code)}
                                />
                              </div>
                            </td>
                          )
                        })}
                      </tr>
                      {/* Sub-modules (expanded) */}
                      {expandedModules[mod.code] && mod.subModules.map(sub => (
                        <>
                          <tr key={`${mod.code}-${sub.name}`} className="border-b border-border/30">
                            <td className="p-3 pl-10 font-medium sticky left-0 bg-card z-10">
                              {sub.name}
                            </td>
                            {roles.map(role => {
                              const allChecked = isSubModuleAllChecked(role, mod.code, sub.name, sub.actions)
                              const someChecked = isSubModuleSomeChecked(role, mod.code, sub.name, sub.actions)
                              return (
                                <td key={role.id} className="p-3 text-center">
                                  <div className="flex justify-center">
                                    <Checkbox
                                      checked={allChecked ? true : someChecked ? 'indeterminate' : false}
                                      onCheckedChange={() => toggleSubModuleAllPermissions(role.id, mod.code, sub.name, sub.actions)}
                                    />
                                  </div>
                                </td>
                              )
                            })}
                          </tr>
                          {sub.actions.map(action => {
                            const key = buildPermissionKey(mod.code, sub.name, action)
                            return (
                              <tr key={key} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                                <td className="p-2 pl-16 text-muted-foreground sticky left-0 bg-card z-10">
                                  {action}
                                </td>
                                {roles.map(role => (
                                  <td key={role.id} className="p-2 text-center">
                                    <div className="flex justify-center">
                                      <Checkbox
                                        checked={role.permissions[key] ?? false}
                                        onCheckedChange={() => togglePermission(role.id, key)}
                                      />
                                    </div>
                                  </td>
                                ))}
                              </tr>
                            )
                          })}
                        </>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* 新增 / 編輯角色 Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingRole ? '編輯角色' : '新增自訂角色'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={newRoleName}
              onChange={e => setNewRoleName(e.target.value)}
              placeholder="角色名稱"
            />
            <div className="space-y-3">
              <p className="text-sm font-medium">權限勾選</p>
              {PERMISSION_MODULES.map(mod => (
                <div key={mod.code} className="space-y-1">
                  <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer py-1">
                    <Checkbox
                      checked={
                        mod.subModules.every(sub =>
                          sub.actions.every(a => newRolePermissions[buildPermissionKey(mod.code, sub.name, a)])
                        )
                          ? true
                          : mod.subModules.some(sub =>
                              sub.actions.some(a => newRolePermissions[buildPermissionKey(mod.code, sub.name, a)])
                            )
                            ? 'indeterminate'
                            : false
                      }
                      onCheckedChange={(v) => {
                        const val = !!v
                        setNewRolePermissions(prev => {
                          const next = { ...prev }
                          mod.subModules.forEach(sub => {
                            sub.actions.forEach(a => {
                              next[buildPermissionKey(mod.code, sub.name, a)] = val
                            })
                          })
                          return next
                        })
                      }}
                    />
                    {mod.code} - {mod.name}
                  </label>
                  {mod.subModules.map(sub => (
                    <div key={sub.name} className="ml-6 space-y-0.5">
                      <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                        <Checkbox
                          checked={
                            sub.actions.every(a => newRolePermissions[buildPermissionKey(mod.code, sub.name, a)])
                              ? true
                              : sub.actions.some(a => newRolePermissions[buildPermissionKey(mod.code, sub.name, a)])
                                ? 'indeterminate'
                                : false
                          }
                          onCheckedChange={(v) => {
                            const val = !!v
                            setNewRolePermissions(prev => {
                              const next = { ...prev }
                              sub.actions.forEach(a => {
                                next[buildPermissionKey(mod.code, sub.name, a)] = val
                              })
                              return next
                            })
                          }}
                        />
                        {sub.name}
                      </label>
                      <div className="ml-6 flex flex-wrap gap-x-4 gap-y-0.5">
                        {sub.actions.map(action => {
                          const key = buildPermissionKey(mod.code, sub.name, action)
                          return (
                            <label key={key} className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
                              <Checkbox
                                checked={newRolePermissions[key] ?? false}
                                onCheckedChange={(v) => setNewRolePermissions(prev => ({ ...prev, [key]: !!v }))}
                              />
                              {action}
                            </label>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <Button className="w-full" onClick={saveRole}>
              {editingRole ? '儲存' : '新增'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 刪除確認 */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>確認刪除</AlertDialogTitle>
            <AlertDialogDescription>
              確定要刪除角色「{deleteTarget?.name}」嗎？此操作無法復原。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteTarget && deleteRole(deleteTarget)}>刪除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  )
}
