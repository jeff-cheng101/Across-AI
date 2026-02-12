"use client"

/**
 * 成員管理（移植自 nebula-admin-console Members）
 *
 * 業務背景：管理系統使用者帳號，支援搜尋、新增、編輯、刪除成員，
 * 並可指定部門與角色。
 *
 * 資料流：目前使用本地狀態 mock 數據，後續可串接成員管理 API。
 *
 * 邊界條件：
 * - 姓名與電子郵件為必填
 * - 編輯成員時電子郵件不可變更
 * - 搜尋支援姓名、email、部門模糊比對
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { UserPlus, Search, Edit, Trash2, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

type Member = {
  id: string
  name: string
  email: string
  department: string
  role: string
  status: 'active' | 'inactive'
}

const INITIAL_MEMBERS: Member[] = [
  { id: '1', name: '王小明', email: 'wang@example.com', department: '工程部', role: '超級管理員', status: 'active' },
  { id: '2', name: '李美麗', email: 'li@example.com', department: '設計部', role: '管理員', status: 'active' },
  { id: '3', name: '張大偉', email: 'zhang@example.com', department: '業務部', role: '主管', status: 'active' },
  { id: '4', name: '陳怡君', email: 'chen@example.com', department: '人資部', role: '一般成員', status: 'inactive' },
  { id: '5', name: '林志偉', email: 'lin@example.com', department: '工程部', role: '一般成員', status: 'active' },
  { id: '6', name: '黃雅琪', email: 'huang@example.com', department: '設計部', role: '一般成員', status: 'active' },
]

const DEPARTMENTS = ['工程部', '設計部', '業務部', '人資部']
const ROLES = ['超級管理員', '管理員', '主管', '一般成員']

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS)
  const [searchTerm, setSearchTerm] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Member | null>(null)
  const [form, setForm] = useState({ name: '', email: '', department: '工程部', role: '一般成員' })

  const filteredMembers = members.filter(m =>
    m.name.includes(searchTerm) || m.email.includes(searchTerm) || m.department.includes(searchTerm)
  )

  const openNewMemberDialog = () => {
    setEditing(null)
    setForm({ name: '', email: '', department: '工程部', role: '一般成員' })
    setDialogOpen(true)
  }

  const openEditMemberDialog = (member: Member) => {
    setEditing(member)
    setForm({ name: member.name, email: member.email, department: member.department, role: member.role })
    setDialogOpen(true)
  }

  const handleSaveMember = () => {
    if (!form.name || !form.email) return
    if (editing) {
      setMembers(prev => prev.map(m => m.id === editing.id ? { ...m, ...form } : m))
    } else {
      setMembers(prev => [...prev, { id: Date.now().toString(), ...form, status: 'active' as const }])
    }
    setDialogOpen(false)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">成員管理</h1>
          <p className="text-sm text-muted-foreground mt-1">管理系統使用者帳號</p>
        </div>
        <Button onClick={openNewMemberDialog}>
          <UserPlus className="h-4 w-4 mr-2" />
          新增成員
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="搜尋成員..."
          className="pl-9"
        />
      </div>

      <div className="neon-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 font-medium text-muted-foreground">成員</th>
                <th className="text-left p-3 font-medium text-muted-foreground">部門</th>
                <th className="text-left p-3 font-medium text-muted-foreground">角色</th>
                <th className="text-left p-3 font-medium text-muted-foreground">狀態</th>
                <th className="text-right p-3 font-medium text-muted-foreground">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map(m => (
                <tr key={m.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{m.name}</p>
                        <p className="text-xs text-muted-foreground">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">{m.department}</td>
                  <td className="p-3">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{m.role}</span>
                  </td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      m.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-muted text-muted-foreground'
                    }`}>
                      {m.status === 'active' ? '啟用' : '停用'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEditMemberDialog(m)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setMembers(prev => prev.filter(x => x.id !== m.id))}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? '編輯成員' : '新增成員'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>姓名</Label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>電子郵件</Label>
              <Input
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                disabled={!!editing}
                className={editing ? 'opacity-60 cursor-not-allowed' : ''}
              />
            </div>
            <div className="space-y-2">
              <Label>部門</Label>
              <Select value={form.department} onValueChange={v => setForm({ ...form, department: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map(d => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>角色</Label>
              <Select value={form.role} onValueChange={v => setForm({ ...form, role: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ROLES.map(r => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={handleSaveMember}>儲存</Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
