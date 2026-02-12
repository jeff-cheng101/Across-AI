"use client"

/**
 * 組織與部門管理（移植自 nebula-admin-console Departments）
 *
 * 業務背景：管理公司部門結構，每個部門可設定對應的系統模組存取權限
 * （AIS、AIG、AIE）。支援新增、編輯、刪除部門。
 *
 * 資料流：目前使用本地狀態 mock 數據，後續可串接部門管理 API。
 *
 * 邊界條件：
 * - 部門名稱不可為空
 * - 刪除部門為立即生效（無確認對話框，後續可加）
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Building2, Plus, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const SYSTEM_MODULES = ['AIS', 'AIG', 'AIE']

type Department = {
  id: string
  name: string
  memberCount: number
  modules: Record<string, boolean>
}

const INITIAL_DEPARTMENTS: Department[] = [
  { id: '1', name: '工程部', memberCount: 32, modules: Object.fromEntries(SYSTEM_MODULES.map(m => [m, true])) },
  { id: '2', name: '設計部', memberCount: 12, modules: Object.fromEntries(SYSTEM_MODULES.map(m => [m, m !== '企業設定'])) },
  { id: '3', name: '業務部', memberCount: 24, modules: Object.fromEntries(SYSTEM_MODULES.map(m => [m, !['角色管理', '企業設定'].includes(m)])) },
  { id: '4', name: '人資部', memberCount: 8, modules: Object.fromEntries(SYSTEM_MODULES.map(m => [m, true])) },
]

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>(INITIAL_DEPARTMENTS)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Department | null>(null)
  const [formName, setFormName] = useState('')
  const [formModules, setFormModules] = useState<Record<string, boolean>>({})

  const openNewDepartmentDialog = () => {
    setEditing(null)
    setFormName('')
    setFormModules(Object.fromEntries(SYSTEM_MODULES.map(m => [m, true])))
    setDialogOpen(true)
  }

  const openEditDepartmentDialog = (dept: Department) => {
    setEditing(dept)
    setFormName(dept.name)
    setFormModules({ ...dept.modules })
    setDialogOpen(true)
  }

  const handleSaveDepartment = () => {
    if (!formName.trim()) return
    if (editing) {
      setDepartments(prev => prev.map(d => d.id === editing.id ? { ...d, name: formName, modules: formModules } : d))
    } else {
      setDepartments(prev => [...prev, { id: Date.now().toString(), name: formName, memberCount: 0, modules: formModules }])
    }
    setDialogOpen(false)
  }

  const handleDeleteDepartment = (departmentId: string) => {
    setDepartments(prev => prev.filter(d => d.id !== departmentId))
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">組織與部門</h1>
          <p className="text-sm text-muted-foreground mt-1">管理公司部門結構與模組權限</p>
        </div>
        <Button onClick={openNewDepartmentDialog}>
          <Plus className="h-4 w-4 mr-2" />
          新增部門
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {departments.map(dept => (
          <div key={dept.id} className="neon-card p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{dept.name}</h3>
                  <p className="text-xs text-muted-foreground">{dept.memberCount} 位成員</p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => openEditDepartmentDialog(dept)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteDepartment(dept.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {SYSTEM_MODULES.map(m => (
                <span
                  key={m}
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    dept.modules[m]
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted text-muted-foreground line-through'
                  }`}
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? '編輯部門' : '新增部門'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>部門名稱</Label>
              <Input value={formName} onChange={e => setFormName(e.target.value)} placeholder="輸入部門名稱" />
            </div>
            <div className="space-y-3">
              <Label>系統模組權限</Label>
              {SYSTEM_MODULES.map(m => (
                <div key={m} className="flex items-center justify-between py-1">
                  <span className="text-sm">{m}</span>
                  <Switch
                    checked={formModules[m] ?? true}
                    onCheckedChange={v => setFormModules(prev => ({ ...prev, [m]: v }))}
                  />
                </div>
              ))}
            </div>
            <Button className="w-full" onClick={handleSaveDepartment}>儲存</Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
