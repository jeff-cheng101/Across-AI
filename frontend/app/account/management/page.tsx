"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Eye, Plus, Search, Users, Edit, Download, Calendar, ArrowLeft, Home, Globe, LogOut, ChevronDown, Package, Check, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AnimatedCounter } from "@/components/animated-counter"
import { LoadingOverlay } from '@/components/ui/loading-overlay'
import { RingLoader } from 'react-spinners'
import { RoleGuard } from "@/components/role-guard"
import authenticator from "@/app/util/authenticator"
import { notifyError } from "@/app/util/notify"

import { logout } from "@/app/routes/auth"
import { getUsersInfo, createReseller, updateReseller, createUser, updateUser } from "@/app/routes/users"
import { getContractsInfo, getLogs, createContract, getPlans, updatePlan } from "@/app/routes/contracts"
import { switchToUserContract } from "@/app/routes/auth"

// 訂單編號來區分EndUser
interface Contract {
  id: string
  contractNo: string // 訂單編號
  company: string
  zones: string[]
  lastActive: string
  createdAt: string
  resellers: string[]
  users: string[]
  plan: string
  trafficData: any
  totalTrafficByContract: number
  totalRequestByContract: number
}

// 代理商
interface Reseller {
  id: string
  userId: string
  email: string
  company: string
  name: string
  phone: string
  lastActive: string
  createdAt: string
  contracts: string[]
  trafficTotal: number
  requestTotal: number
}

interface EndUser {
  id: string
  userId: string
  email: string
  company: string
  name: string
  phone: string
  lastActive: string
  createdAt: string
  contracts: string[]
}

// 訂單詳細資料頁面的接口
interface ContractDetail {
  contract: Contract
  domains: DomainInfo[]
  endUsers: EndUserInfo[]
}

interface DomainInfo {
  id: string
  domain: string
  trafficTB: string
  requestsMM: string
  status: "active" | "inactive"
  createdAt: string
}

interface EndUserInfo {
  id: string
  userId: string
  email: string
  name: string
  status: "active" | "inactive"
  lastActive: string
  createdAt: string
}

function AdasOneManagement() {
  const auth: any = authenticator.authValue;
  const [reseller, setReseller] = useState<Reseller[]>([])
  const [endUsers, setEndUsers] = useState<EndUser[]>([])
  const [contracts, setContracts] = useState<Contract[]>([])
  const [plans, setPlans] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const [resellerForm, setCreateResellerForm] = useState({ userId: '', email: '', password: '', company: '', name: '', phone: '' })
  const [passwordErrors, setPasswordErrors] = useState({ length: false, complexity: false })
  const [emailErrors, setEmailErrors] = useState({ format: false })
  const [selectedReseller, setSelectedReseller] = useState<Reseller | null>(null)
  const [contractForm, setContractForm] = useState<any>({ })
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [createUserForm, setCreateUserForm] = useState({ userId: '', email: '', password: '', company: '', name: '', phone: '' })

  const [searchTerm, setSearchTerm] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<any>({})
  // 方案編輯相關狀態
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null)
  const [editingPlanData, setEditingPlanData] = useState<any>({})
  // reseller list / 
  const [currentView, setCurrentView] = useState<'reseller' | 'resellerDetail' | 'endusers' | 'contract' | 'userLogs'>("reseller")
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)
  const [logs, setLogs] = useState<any[]>([])
  const [selectedLogs, setSelectedLogs] = useState<any[]>([])
  // 分頁相關狀態 - 用戶日誌
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  // 分頁相關狀態 - 訂單歷史紀錄
  const [contractCurrentPage, setContractCurrentPage] = useState(1)
  const [contractItemsPerPage, setContractItemsPerPage] = useState(10)

  const [waiting, setWaiting] = useState(false)

  // 計算分頁數據 - 用戶日誌
  const totalItems = selectedLogs.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentLogs = selectedLogs.slice(startIndex, endIndex)

  // 計算分頁數據 - 訂單歷史紀錄
  const filteredContractLogs = selectedLogs.filter((item: any) =>
    searchTerm === "" ||
    item.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.action.toLowerCase().includes(searchTerm.toLowerCase())
  )
  const contractTotalItems = filteredContractLogs.length
  const contractTotalPages = Math.ceil(contractTotalItems / contractItemsPerPage)
  const contractStartIndex = (contractCurrentPage - 1) * contractItemsPerPage
  const contractEndIndex = contractStartIndex + contractItemsPerPage
  const currentContractLogs = filteredContractLogs.slice(contractStartIndex, contractEndIndex)

  // 當 selectedLogs 更新時重置頁碼
  useEffect(() => {
    setCurrentPage(1)
    setContractCurrentPage(1)
  }, [selectedLogs])

  useEffect(() => {
    if (auth) {
      (async () => {
        await loadSettings()
      })()
    }
  }, [auth])

  // 判断是否活躍（180天内更新）
  const isActive = (createdAt: string) => {
    if (!createdAt) return false
    const updatedDate = new Date(createdAt)
    const currentDate = new Date()
    const diffTime = currentDate.getTime() - updatedDate.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 180
  }

  const loadSettings = async () => {
    setWaiting(true)
    // 取得訂單列表
    const contractResp = await getContractsInfo()
    const contracts = contractResp.data
    // 取得帳號列表
    const userResp = await getUsersInfo()
    const userList = userResp.data
    const resellerList = userList.reseller
    // 取得紀錄
    const tracklogResp = await getLogs()
    const tracklogs = tracklogResp.data
    setLogs(tracklogs)
    // 取得方案列表
    const planResp = await getPlans()
    const plans = planResp.data
    setPlans(plans)

    let contractTotal: any = []
    for (let reseller of resellerList as any[]) {
      const userContracts: any = contracts[reseller.userId]
      let contractList: any = []
      userContracts.forEach((contract: any) => {
        const contractLogs = tracklogs.filter((log: any) => log.contractNo === contract.contractNo)
        const active = contractLogs.length > 0 ? isActive(contractLogs[0].createdAt) : false
        contractList.push({
          ...contract,
          status: active ? 'active' : 'inactive'
        })
      })
      reseller.contracts = contractList
      contractTotal = [...contractTotal, ...contractList]
      
      const trafficTotal = reseller.contracts.reduce((sum: any, contract: any) => {
        if (!contract.totalTrafficByContract) return sum;
        return sum + contract.totalTrafficByContract;
      }, 0)
      reseller.trafficTotal = trafficTotal
      
      const requestTotal = reseller.contracts.reduce((sum: any, contract: any) => {
        if (!contract.totalRequestByContract) return sum;
        return sum + contract.totalRequestByContract;
      }, 0)
      reseller.requestTotal = requestTotal
    }
    setReseller(resellerList)
    setContracts(contractTotal)

    // 如果當前有選中的 reseller，更新為最新的數據
    if (selectedReseller) {
      const updatedReseller = resellerList.find((r: any) => r.userId === selectedReseller.userId)
      if (updatedReseller) {
        setSelectedReseller(updatedReseller)
        
        if (selectedContract) {
          const updatedContract = updatedReseller.contracts?.find((c: any) => c.contractNo === selectedContract.contractNo)
          if (updatedContract) {
            setSelectedContract(updatedContract)
          }
        }
      }
    }

    if (selectedUser) {
      const updatedUserContract = contractTotal.find((contract: any) => 
        contract.users?.some((user: any) => user.userId === selectedUser.userId)
      )
      if (updatedUserContract) {
        const updatedUser = updatedUserContract.users.find((user: any) => user.userId === selectedUser.userId)
        if (updatedUser) {
          setSelectedUser(updatedUser)
        }
      }
    }

    const endUserList = userList.endUser
    setEndUsers(endUserList)
    setWaiting(false)
  }

  // 流量格式化
  const formatTraffic = (bytes: number) => {
    if (bytes >= 1000000000000) { // >= 1TB
      return { value: (bytes / 1000000000000).toFixed(2), unit: ' TB'}
    } else if (bytes >= 1000000000) { // >= 1GB
      return { value: (bytes / 1000000000).toFixed(2), unit: ' GB'}
    } else if (bytes >= 1000000) { // >= 1MB
      return { value: (bytes / 1000000).toFixed(2), unit: ' MB'}
    } else if (bytes >= 1000) { // >= 1KB
      return { value: (bytes / 1000).toFixed(2), unit: ' KB'}
    } else {
      return { value: bytes, unit: 'Bytes' }
    }
  }
  // 請求次數格式化
  const formatRequests = (requests: number) => {
    if (requests >= 1000000000) {
      return { value: (requests / 1000000000).toFixed(2), unit: 'B'}
    } else if (requests >= 1000000) {
      return { value: (requests / 1000000).toFixed(2), unit: 'M'}
    } else if (requests >= 1000) {
      return { value: (requests / 1000).toFixed(2), unit: 'K'}
    } else {
      return { value: requests, unit: ''}
    }
  }

  // 根據 contract 的 trafficData 生成月度統計數據
  const generateMonthlyUsageData = (resellerList: Reseller[]): any[] => {
    const monthlyData: { [key: string]: { totalBytes: number, totalRequests: number } } = {}
    
    resellerList.forEach(reseller => {
      if (!reseller.contracts) return
      reseller.contracts.forEach((contract: any) => {
        if (!contract.trafficData) return
        Object.values(contract.trafficData).forEach((siteData: any) => {
          // 遍历每个 site 下的所有日期
          Object.entries(siteData).forEach(([dateStr, dayData]: [string, any]) => {
            if (dateStr === 'totalRequest' || dateStr === 'totalTraffic') return
            // 從日期字符串提取年月 (2025/07/01 -> 2025-07)
            const [year, month] = dateStr.split('/')
            const monthKey = `${year}-${month.padStart(2, '0')}`
            
            if (!monthlyData[monthKey]) {
              monthlyData[monthKey] = { totalBytes: 0, totalRequests: 0 }
            }
            
            monthlyData[monthKey].totalBytes += dayData.bytes || 0
            monthlyData[monthKey].totalRequests += dayData.requests || 0
          })
        })
      })
    })
    
    return Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        totalBytes: data.totalBytes,
        totalRequests: data.totalRequests,
        trafficTB: `${formatTraffic(data.totalBytes).value} ${formatTraffic(data.totalBytes).unit}`,
        requestsMM: `${formatRequests(data.totalRequests).value} ${formatRequests(data.totalRequests).unit}`
      }))
      .sort((a, b) => b.month.localeCompare(a.month)) // 改為最新的月份在前
  }

  // 生成月度用量數據
  const monthlyUsageData: any[] = selectedReseller ? generateMonthlyUsageData([selectedReseller]) : []
  
  // 獲取當月數據
  const getCurrentMonthData = () => {
    const currentMonth = new Date().toISOString().slice(0, 7) // 格式: YYYY-MM
    const currentMonthData = monthlyUsageData.find(data => data.month === currentMonth)
    return currentMonthData || { totalBytes: 0, totalRequests: 0 }
  }
  
  // 獲取除當月外的歷史數據
  const getHistoricalMonthlyData = () => {
    const currentMonth = new Date().toISOString().slice(0, 7) // 格式: YYYY-MM
    return monthlyUsageData.filter(data => data.month !== currentMonth)
  }
  
  const currentMonthData = getCurrentMonthData()
  const historicalMonthlyData = getHistoricalMonthlyData()

  // 過濾 reseller 數據
  const filteredResellers = reseller.filter((resellerItem) =>
    resellerItem.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resellerItem.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // 過濾 plan 數據
  const filteredPlans = plans.filter((planItem) =>
    planItem.plan_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    planItem.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // 密碼驗證函數
  const validatePassword = (password: string) => {
    const errors = {
      length: password.length < 8,
      complexity: !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password),
    }
    setPasswordErrors(errors)
    return !errors.length && !errors.complexity
  }

  // 電子郵件格式驗證
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailErrors({ format: !emailRegex.test(email) });
    return emailRegex.test(email);
  };

  ///////////////////////////////////////////////
  // 經銷商管理（經銷商）
  ///////////////////////////////////////////////

  const handleCreateResellerChange = (field: string, value: string) => {
    setCreateResellerForm((prev) => ({
      ...prev,
      [field]: value,
    }))
    
    if (field === "password") validatePassword(value)
    if (field === "email") validateEmail(value)
  }

  const handleCreateResellerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validatePassword(resellerForm.password)) return
    if (!validateEmail(resellerForm.email)) return
    if (resellerForm.userId && resellerForm.email) {
      setIsLoading(true)
      try {
        await createReseller(resellerForm)
        await loadSettings()
      } catch (error: any) {
        console.error(error)
        if (error.response?.data?.message && error.response?.data?.message === 'Unauthorized') {
          notifyError('Unauthorized')
        } else {
          notifyError(error.message)
        }
      } finally {
        setIsLoading(false)
        setCreateResellerForm({ userId: '', email: '', password: '', company: '', name: '', phone: '' })
      }
    }
  }

  // 查看詳細資訊
  const handleViewReseller = (user: any) => {
    setSelectedReseller(user)
    setCurrentView('resellerDetail')
    setIsEditing(false)
  }

  // 返回列表
  const handleBackToList = () => {
    setCurrentView('reseller')
    setSelectedReseller(null)
    setIsEditing(false)
  }

  const handleEditReseller = () => {
    if (selectedReseller) {
      const user = selectedReseller
      setEditData({
        userId: user.userId,
        email: user.email,
        company: user.company,
        name: user.name,
        phone: user.phone,
      })
      setIsEditing(true)
    }
  }

  const handleEditResellerChange = (field: string, value: string) => {
    setEditData((prev: any) => ({ ...prev, [field]: value }))
    
    if (field === "email") validateEmail(value)
  }

  const handleEditResellerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editData.userId) notifyError('請填寫帳號')
    else if (!editData.email) notifyError('請填寫Email')
    else {
      setIsLoading(true)
      try {
        await updateReseller(editData)
      } catch (error: any) {
        console.error(error)
        if (error.response?.data?.message && error.response?.data?.message === 'Unauthorized') {
          notifyError('Unauthorized')
        } else {
          notifyError(error.message)
        }
      } finally {
        setIsLoading(false)
        setEditData({})
        setIsEditing(false)
        await loadSettings()
      }
    }
  }


  ///////////////////////////////////////////////
  // End User 管理（訂單管理）
  ///////////////////////////////////////////////

  const handleViewEndUsers = () => {
    setCurrentView("endusers")
  }

  const handleBackToDetail = () => {
    setCurrentView('resellerDetail')
  }

  // 處理查看訂單詳細資料
  const handleViewContract = (contract: any) => {
    const contractLogs = logs.filter((log: any) => log.contractNo === contract.contractNo)
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    let newUsers: any = []
    for (let user of contract.users) {
      const userLogs = contractLogs.filter((log: any) => log.userId === user.userId)
      const active = userLogs.length > 0 ? isActive(userLogs[0].createdAt) : false
      newUsers.push({
        ...user,
        status: active ? 'active' : 'inactive',
        lastActive: userLogs.length > 0 ? userLogs[0].createdAt : ''
      })
    }
    contract.users = newUsers
    setSelectedContract(contract)
    setSelectedLogs(contractLogs)
    setCurrentView("contract")
  }

  // 返回訂單列表
  const handleBackToEndUserList = () => {
    setCurrentView("endusers")
    setSelectedLogs([])
    setSelectedContract(null)
  }

  const handleCreateContractChange = (field: string, value: string) => {
    setContractForm((prev: any) => ({ ...prev, [field]: value }))
  }

  const handleCreateContractSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (contractForm.contractNo && contractForm.plan) {
      setIsLoading(true)
      try {
        await createContract({ ...contractForm, resellerId: selectedReseller?.userId, email: selectedReseller?.email })
      } catch (error: any) {
        console.error(error)
        if (error.response?.data?.message && error.response?.data?.message === 'Unauthorized') {
          notifyError('Unauthorized')
        } else {
          notifyError(error.message)
        }
      } finally {
        setIsLoading(false)
        setContractForm({ contractNo: '', plan: '', company: '', serviceCount: 0 })
      }

      await loadSettings()
    } else {
      notifyError('請填寫完整資訊')
    }
  }

  const handleSwitchToUserContract = async (contractNo: string) => {
    await switchToUserContract(contractNo)
      .then(() => {
        window.location.href = '/services';
      })
      .catch(() => {
        setIsLoading(false);
      });    
  }


  ///////////////////////////////////////////////
  // End User 管理（User Account管理）
  ///////////////////////////////////////////////

  const handleViewUserLogs = (user: any) => {
    const userLogs = logs.filter((log: any) => log.userId === user.userId)
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    setSelectedUser(user)
    setSelectedLogs(userLogs)
    setCurrentView('userLogs')
    setIsEditing(false)
  }

  // 返回列表
  const handleBackToContract = () => {
    setCurrentView('contract')
    setSelectedUser(null)
    setSelectedLogs([])
    setIsEditing(false)
  }

  const handleCreateUserChange = (field: string, value: string) => {
    setCreateUserForm((prev) => ({ ...prev, [field]: value }))
    if (field === "password") validatePassword(value)
    if (field === "email") validateEmail(value)
  }

  const handleCreateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validatePassword(createUserForm.password)) return
    if (!validateEmail(createUserForm.email)) return
    if (createUserForm.userId && createUserForm.email) {
      setIsLoading(true)
      try {
        await createUser({ ...createUserForm, contractNo: selectedContract?.contractNo })
      } catch (error: any) {
        console.error(error)
        if (error.response?.data?.message && error.response?.data?.message === 'Unauthorized') {
          notifyError('Unauthorized')
        } else {
          notifyError(error.message)
        }
      } finally {
        setIsLoading(false)
        setCreateUserForm({ userId: '', email: '', password: '', company: '', name: '', phone: '' })
      }

      await loadSettings()
    }
  }

  const handleEditUser = () => {
    if (selectedUser) {
      const user = selectedUser
      setEditData({
        userId: user.userId,
        email: user.email,
        company: user.company,
        name: user.name,
        phone: user.phone,
      })
      setIsEditing(true)
    }
  }

  const handleEditUserChange = (field: string, value: string) => {
    setEditData((prev: any) => ({ ...prev, [field]: value }))
    
    if (field === "email") validateEmail(value)
  }

  const handleEditUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editData.userId) notifyError('請填寫帳號')
    else if (!editData.email) notifyError('請填寫Email')
    else {
      setIsLoading(true)
      try {
        await updateUser(editData)
      } catch (error: any) {
        console.error(error)
        if (error.response?.data?.message && error.response?.data?.message === 'Unauthorized') {
          notifyError('Unauthorized')
        } else {
          notifyError(error.message)
        }
      } finally {
        setIsLoading(false)
        setEditData({})
        setIsEditing(false)
        await loadSettings()
      }
    }
  }

  const logoutManagement = async () => {
    await logout()
    .then(() => {
      window.location.href = '/'
    })
    .catch(() => {
      notifyError('登出失敗')
    })
  }


  ///////////////////////////////////////////////
  // 方案管理（Plan管理）
  ///////////////////////////////////////////////

  const handleEditPlan = (plan: any) => {
    setEditingPlanId(plan.id)
    setEditingPlanData({
      name: plan.name,
      plan_code: plan.plan_code,
      module: plan.module,
      count: plan.count,
      price: plan.price,
      description: plan.description
    })
  }

  const handleSavePlan = async () => {
    if (!editingPlanData.name) notifyError('請填寫方案名稱')
    else if (!editingPlanData.plan_code) notifyError('請填寫方案編號')
    else if (!editingPlanData.count) notifyError('請填寫服務數量')
    else if (!editingPlanData.price) notifyError('請填寫價格')
    else if (!editingPlanData.description) notifyError('請填寫方案描述')
    else {
      try {
        await updatePlan(editingPlanData)
        setEditingPlanId(null)
        setEditingPlanData({})
        await loadSettings()
      } catch (error: any) {
        console.error('保存方案失敗:', error)
        notifyError('保存方案失敗')
      }
    }
  }

  const handleCancelEdit = () => {
    setEditingPlanId(null)
    setEditingPlanData({})
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pt-20">
      <div className="container mx-auto p-6 space-y-8">
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/5 backdrop-blur-sm border-b border-blue-300/20">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-white tracking-tight">ADAS ONE</h1>
                <span className="ml-3 text-blue-200 text-sm">經銷商管理系統</span>
              </div>

              <div className="flex items-center space-x-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant={null} size="sm" className="gap-2">
                      <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-blue-400/50">
                        <img
                          src="/placeholder.svg?height=32&width=32"
                          alt="管理員頭像"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-right">
                        <p className="text-white text-sm font-medium">{auth?.user?.userId}</p>
                        <p className="text-blue-200 text-xs">{auth?.user?.email}</p>
                      </div>
                      <ChevronDown className="h-4 w-4 text-white" />
                    </Button>
                  </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="width: 50px">
                      <DropdownMenuItem onClick={() => logoutManagement()} className="text-red-600 focus:text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>登出</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </nav>

        {currentView === 'reseller' ? (
          <>
            {/* Add User Form */}
            <Card className="bg-white/10 backdrop-blur-sm border-blue-300/20 [&>*]:!bg-transparent">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white flex items-center">
                      <Plus className="w-5 h-5" />
                      新增經銷商
                    </CardTitle>
                    <CardDescription className="text-blue-200">填寫以下資訊來新增經銷商</CardDescription>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-600/20 backdrop-blur-sm border border-blue-400/30 rounded-lg px-4 py-3 hover:bg-blue-600/30 transition-colors duration-300">
                      <div className="text-center">
                        <p className="text-blue-200 text-sm">總經銷商數</p>
                        {
                          waiting ? (
                            <span className="text-white text-2xl font-bold">-</span>
                          ) : (
                            <AnimatedCounter value={reseller.length} className="text-white text-2xl font-bold" duration={800} />
                          )
                        }
                      </div>
                    </div>
                    <div className="bg-blue-600/20 backdrop-blur-sm border border-blue-400/30 rounded-lg px-4 py-3 hover:bg-blue-600/30 transition-colors duration-300">
                      <div className="text-center">
                        <p className="text-blue-200 text-sm">總訂單數</p>
                        {
                          waiting ? (
                            <span className="text-white text-2xl font-bold">-</span>
                          ) : (
                            <AnimatedCounter value={contracts.length} className="text-white text-2xl font-bold" duration={800} />
                          )
                        }
                      </div>
                    </div>
                    <div className="bg-blue-600/20 backdrop-blur-sm border border-blue-400/30 rounded-lg px-4 py-3 hover:bg-blue-600/30 transition-colors duration-300">
                      <div className="text-center">
                        <p className="text-blue-200 text-sm">總客戶數</p>
                        {
                          waiting ? (
                            <span className="text-white text-2xl font-bold">-</span>
                          ) : (
                            <AnimatedCounter value={endUsers.length} className="text-white text-2xl font-bold" duration={800} />
                          )
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateResellerSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="userId" className="text-white">
                        帳號
                      </Label>
                      <Input
                        id="userId"
                        value={resellerForm.userId}
                        onChange={(e) => handleCreateResellerChange("userId", e.target.value)}
                        placeholder="輸入經銷商帳號"
                        className="bg-white/10 border-blue-300/30 text-white placeholder:text-blue-200"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="userId" className="text-white">
                        公司名稱
                      </Label>
                      <Input
                        id="company"
                        value={resellerForm.company}
                        onChange={(e) => setCreateResellerForm(prev => ({ ...prev, company: e.target.value }))}
                        placeholder="輸入經銷商名稱"
                        className="bg-white/10 border-blue-300/30 text-white placeholder:text-blue-200"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white">
                        聯絡人
                      </Label>
                      <Input
                        id="name"
                        value={resellerForm.name}
                        onChange={(e) => setCreateResellerForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="輸入聯絡人姓名"
                        className="bg-white/10 border-blue-300/30 text-white placeholder:text-blue-200"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={resellerForm.email}
                        onChange={(e) => handleCreateResellerChange("email", e.target.value)}
                        placeholder="輸入電子郵件"
                        className="bg-white/10 border-blue-300/30 text-white placeholder:text-blue-200"
                        required
                      />
                      {emailErrors.format && (
                        <p className="text-red-400 text-xs">請輸入有效的電子郵件地址</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-white">
                        密碼
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={resellerForm.password}
                        onChange={(e) => handleCreateResellerChange("password", e.target.value)}
                        placeholder="輸入密碼"
                        className="bg-white/10 border-blue-300/30 text-white placeholder:text-blue-200"
                        required
                      />
                      {/* 密碼要求提示 */}
                      {resellerForm.password && (
                        <div className="text-blue-200 text-xs space-y-1">
                          <p>密碼要求：</p>
                          <ul className="list-disc list-inside space-y-0.5">
                            <li className={resellerForm.password.length >= 8 ? "text-green-400" : "text-red-400"}>
                              至少8個字元
                            </li>
                            <li className={/(?=.*[a-z])/.test(resellerForm.password) ? "text-green-400" : "text-red-400"}>
                              包含小寫字母
                            </li>
                            <li className={/(?=.*[A-Z])/.test(resellerForm.password) ? "text-green-400" : "text-red-400"}>
                              包含大寫字母
                            </li>
                            <li className={/(?=.*\d)/.test(resellerForm.password) ? "text-green-400" : "text-red-400"}>
                              包含數字
                            </li>
                            <li className={/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(resellerForm.password) ? "text-green-400" : "text-red-400"}>
                              包含特殊符號
                            </li>
                          </ul>
                        </div>
                      )}
                      {/* 密碼錯誤訊息 */}
                      {(passwordErrors.length || passwordErrors.complexity) && (
                        <div className="space-y-1">
                          {passwordErrors.length && (
                            <p className="text-red-400 text-xs">密碼長度至少需要8個字元</p>
                          )}
                          {passwordErrors.complexity && (
                            <p className="text-red-400 text-xs">密碼必須包含大寫字母、小寫字母、數字和特殊符號</p>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-white">
                        電話
                      </Label>
                      <Input
                        id="phone"
                        value={resellerForm.phone}
                        onChange={(e) => setCreateResellerForm(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="輸入電話號碼"
                        className="bg-white/10 border-blue-300/30 text-white placeholder:text-blue-200"
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    新增經銷商
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Users List */}
            <Card className="bg-white/10 backdrop-blur-sm border-blue-300/20 [&>*]:!bg-transparent">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      經銷商清單
                    </CardTitle>
                    <CardDescription className="text-blue-200">管理所有經銷商資訊</CardDescription>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-4 h-4" />
                    <Input
                      placeholder="搜尋經銷商..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/10 border-blue-300/30 text-white placeholder:text-blue-200 w-full md:w-64"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-blue-300/20 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-blue-300/20 hover:bg-white/5">
                        <TableHead className="text-blue-200">公司名稱</TableHead>
                        <TableHead className="text-blue-200">帳號</TableHead>
                        <TableHead className="text-blue-200">聯絡人</TableHead>
                        <TableHead className="text-blue-200">Email</TableHead>
                        <TableHead className="text-blue-200">電話</TableHead>
                        <TableHead className="text-blue-200">Contract 數量</TableHead>
                        <TableHead className="text-blue-200">總流量</TableHead>
                        <TableHead className="text-blue-200">總請求次數 (MM)</TableHead>
                        {/* <TableHead className="text-blue-200">建立日期</TableHead> */}
                        <TableHead className="text-blue-200">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredResellers.map((resellerItem) => (
                        <TableRow key={resellerItem.id} className="border-blue-300/20 hover:bg-white/5">
                          <TableCell className="text-blue-200">{resellerItem.company}</TableCell>
                          <TableCell className="text-blue-200">{resellerItem.userId}</TableCell>
                          <TableCell className="text-blue-200">{resellerItem.name}</TableCell>
                          <TableCell className="text-blue-200">{resellerItem.email}</TableCell>
                          <TableCell className="text-blue-200">{resellerItem.phone}</TableCell>
                          <TableCell className="text-blue-200">
                            <Badge variant="outline" className="border-blue-300/30 text-blue-200">
                              {resellerItem.contracts.length ? resellerItem.contracts.length : 0}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-blue-200">{formatTraffic(resellerItem.trafficTotal).value || 0} {formatTraffic(resellerItem.trafficTotal).unit}</TableCell>
                          <TableCell className="text-blue-200">{formatRequests(resellerItem.requestTotal).value || 0} {formatRequests(resellerItem.requestTotal).unit}</TableCell>
                          {/* <TableCell className="text-blue-200">{resellerItem.createdAt 
                            ? new Date(resellerItem.createdAt).toLocaleDateString('zh-TW', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit'
                              }).replace(/\//g, '/')
                            : ''
                            }
                          </TableCell> */}
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-blue-300/30 text-blue-200 hover:bg-blue-600/20 bg-transparent"
                              onClick={() => handleViewReseller(resellerItem)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              查看
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {filteredResellers.length === 0 && (
                  <div className="text-center py-8">
                    {
                      waiting ? (
                        <span className="text-blue-200">。。。</span>
                      ) : (
                        <p className="text-blue-200">沒有找到符合條件的經銷商</p>
                      )
                    }
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Plan List */}
            <Card className="bg-white/10 backdrop-blur-sm border-blue-300/20 [&>*]:!bg-transparent">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      方案清單
                    </CardTitle>
                    <CardDescription className="text-blue-200">管理所有方案資訊</CardDescription>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-4 h-4" />
                    <Input
                      placeholder="搜尋方案..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/10 border-blue-300/30 text-white placeholder:text-blue-200 w-full md:w-64"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-blue-300/20 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-blue-300/20 hover:bg-white/5">
                        <TableHead className="text-blue-200">方案名稱</TableHead>
                        <TableHead className="text-blue-200">方案編號</TableHead>
                        <TableHead className="text-blue-200">模組</TableHead>
                        <TableHead className="text-blue-200">服務數量</TableHead>
                        <TableHead className="text-blue-200">價格</TableHead>
                        <TableHead className="text-blue-200">描述</TableHead>
                        <TableHead className="text-blue-200">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPlans.map((planItem) => (
                        <TableRow key={planItem.id} className="border-blue-300/20 hover:bg-white/5">
                          <TableCell className="text-blue-200">
                            {editingPlanId === planItem.id ? (
                              <Input
                                value={editingPlanData.name || ''}
                                onChange={(e) => setEditingPlanData({ ...editingPlanData, name: e.target.value })}
                                className="bg-white/10 border-blue-300/30 text-white"
                              />
                            ) : (
                              planItem.name
                            )}
                          </TableCell>
                          <TableCell className="text-blue-200">{planItem.plan_code}</TableCell>
                          <TableCell className="text-blue-200">
                            {editingPlanId === planItem.id ? (
                              <Input
                                value={editingPlanData.module || ''}
                                onChange={(e) => setEditingPlanData({ ...editingPlanData, module: e.target.value })}
                                className="bg-white/10 border-blue-300/30 text-white"
                              />
                            ) : (
                              planItem.module
                            )}
                          </TableCell>
                          <TableCell className="text-blue-200">
                            {editingPlanId === planItem.id ? (
                              <Input
                                type="number"
                                value={editingPlanData.count || ''}
                                onChange={(e) => setEditingPlanData({ ...editingPlanData, count: e.target.value })}
                                className="bg-white/10 border-blue-300/30 text-white"
                              />
                            ) : (
                              planItem.count
                            )}
                          </TableCell>
                          <TableCell className="text-blue-200">
                            {editingPlanId === planItem.id ? (
                              <Input
                                type="number"
                                value={editingPlanData.price || ''}
                                onChange={(e) => setEditingPlanData({ ...editingPlanData, price: e.target.value })}
                                className="bg-white/10 border-blue-300/30 text-white"
                              />
                            ) : (
                              planItem.price
                            )}
                          </TableCell>
                          <TableCell className="text-blue-200">
                            {editingPlanId === planItem.id ? (
                              <Input
                                value={editingPlanData.description || ''}
                                onChange={(e) => setEditingPlanData({ ...editingPlanData, description: e.target.value })}
                                className="bg-white/10 border-blue-300/30 text-white"
                              />
                            ) : (
                              planItem.description
                            )}
                          </TableCell>
                          <TableCell>
                            {editingPlanId === planItem.id ? (
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-green-300/30 text-green-200 hover:bg-green-600/20 bg-transparent"
                                  onClick={handleSavePlan}
                                >
                                  <Check className="w-4 h-4 mr-1" />
                                  保存
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-red-300/30 text-red-200 hover:bg-red-600/20 bg-transparent"
                                  onClick={handleCancelEdit}
                                >
                                  <X className="w-4 h-4 mr-1" />
                                  取消
                                </Button>
                              </div>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-blue-300/30 text-blue-200 hover:bg-blue-600/20 bg-transparent"
                                onClick={() => handleEditPlan(planItem)}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                編輯
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {filteredPlans.length === 0 && (
                  <div className="text-center py-8">
                    {
                      waiting ? (
                        <span className="text-blue-200">。。。</span>
                      ) : (
                        <p className="text-blue-200">沒有找到符合條件的方案</p>
                      )
                    }
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        ) : currentView === 'resellerDetail' ? (
          /* User Detail Page */
          <div className="space-y-6">
            {/* Back Button */}
            <Button
              onClick={handleBackToList}
              variant="outline"
              className="border-blue-300/30 text-blue-200 hover:bg-blue-600/20 bg-transparent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回經銷商清單
            </Button>

            {/* User Detail Content */}
            {selectedReseller && (
              <>
                {/* 經銷商基本資訊 Section */}
                <Card className="bg-white/10 backdrop-blur-sm border-blue-300/20 [&>*]:!bg-transparent">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-white text-2xl">{selectedReseller.userId} - 詳細資訊</CardTitle>
                        <CardDescription className="text-blue-200">查看和管理經銷商的完整資訊</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleEditReseller} size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Edit className="w-4 h-4 mr-1" />
                          修改
                        </Button>
                        {/* <Button
                          onClick={handleExportData}
                          size="sm"
                          variant="outline"
                          className="border-blue-300/30 text-blue-200 hover:bg-blue-600/20 bg-transparent"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          匯出
                        </Button> */}
                        <Button
                          onClick={handleViewEndUsers}
                          size="sm"
                          variant="outline"
                          className="border-green-300/30 text-green-200 hover:bg-green-600/20 bg-transparent"
                        >
                          <Users className="w-4 h-4 mr-1" />
                          EndUser ({selectedReseller.contracts.length ? selectedReseller.contracts.length : 0})
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <h3 className="text-lg font-semibold text-white">基本資訊</h3>

                    {isEditing ? (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <Label className="text-blue-200">帳號</Label>
                            <p className="text-white font-medium text-lg mt-1">{selectedReseller.userId}</p>
                          </div>
                          <div>
                            <Label className="text-blue-200">Email</Label>
                            <p className="text-white font-medium text-lg mt-1">{selectedReseller.email}</p>
                            {/* <Input
                              value={editData.email}
                              onChange={(e) => handleEditResellerChange("email", e.target.value)}
                              className="bg-white/10 border-blue-300/30 text-white placeholder:text-blue-200"
                            /> */}
                          </div>
                          <div>
                            <Label className="text-blue-200">公司名稱</Label>
                            <Input
                              value={editData.company}
                              onChange={(e) => setEditData((prev: any) => ({ ...prev, company: e.target.value }))}
                              className="bg-white/10 border-blue-300/30 text-white placeholder:text-blue-200"
                            />
                          </div>
                          <div>
                            <Label className="text-blue-200">聯絡人</Label>
                            <Input
                              value={editData.name}
                              onChange={(e) => setEditData((prev: any) => ({ ...prev, name: e.target.value }))}
                              className="bg-white/10 border-blue-300/30 text-white placeholder:text-blue-200"
                            />
                          </div>
                          <div>
                            <Label className="text-blue-200">電話號碼</Label>
                            <Input
                              value={editData.phone}
                              onChange={(e) => setEditData((prev: any) => ({ ...prev, phone: e.target.value }))}
                              className="bg-white/10 border-blue-300/30 text-white placeholder:text-blue-200"
                            />
                          </div>
                          <div>
                            <Label className="text-blue-200">Contract 數量</Label>
                            <p className="text-white font-medium text-lg mt-1">
                              {selectedReseller.contracts.length ? selectedReseller.contracts.length : 0}
                            </p>
                          </div>
                          <div>
                            <Label className="text-blue-200">總流量</Label>
                            <p className="text-white font-medium text-lg mt-1">
                              {formatTraffic(selectedReseller.trafficTotal).value} {formatTraffic(selectedReseller.trafficTotal).unit}
                            </p>
                          </div>
                          <div>
                            <Label className="text-blue-200">總請求次數</Label>
                            <p className="text-white font-medium text-lg mt-1">
                              {formatRequests(selectedReseller.requestTotal).value} {formatRequests(selectedReseller.requestTotal).unit}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleEditResellerSubmit} className="bg-green-600 hover:bg-green-700">
                            儲存
                          </Button>
                          <Button
                            onClick={() => setIsEditing(false)}
                            variant="outline"
                            className="border-blue-300/30 text-blue-200"
                          >
                            取消
                          </Button>
                        </div>
                      </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <Label className="text-blue-200">帳號</Label>
                            <p className="text-white font-medium text-lg mt-1">{selectedReseller.userId}</p>
                          </div>
                          <div>
                            <Label className="text-blue-200">Email</Label>
                            <p className="text-white font-medium text-lg mt-1">{selectedReseller.email}</p>
                          </div>
                          <div>
                            <Label className="text-blue-200">公司名稱</Label>
                            <p className="text-white font-medium text-lg mt-1">{selectedReseller.company}</p>
                          </div>
                          <div>
                            <Label className="text-blue-200">聯絡人</Label>
                            <p className="text-white font-medium text-lg mt-1">{selectedReseller.name}</p>
                          </div>
                          <div>
                            <Label className="text-blue-200">電話號碼</Label>
                            <p className="text-white font-medium text-lg mt-1">{selectedReseller.phone}</p>
                          </div>
                          <div>
                            <Label className="text-blue-200">Contract 數量</Label>
                            <p className="text-white font-medium text-lg mt-1">
                              {selectedReseller.contracts.length ? selectedReseller.contracts.length : 0}
                            </p>
                          </div>
                          <div>
                            <Label className="text-blue-200">總流量</Label>
                            <p className="text-white font-medium text-lg mt-1">
                              {formatTraffic(selectedReseller.trafficTotal).value} {formatTraffic(selectedReseller.trafficTotal).unit}
                            </p>
                          </div>
                          <div>
                            <Label className="text-blue-200">總請求次數</Label>
                            <p className="text-white font-medium text-lg mt-1">
                              {formatRequests(selectedReseller.requestTotal).value} {formatRequests(selectedReseller.requestTotal).unit}
                            </p>
                          </div>
                        </div>
                    )}
                  </CardContent>
                </Card>

                {/* 用量明細 Section */}
                <Card className="bg-white/10 backdrop-blur-sm border-blue-300/20 [&>*]:!bg-transparent">
                  <CardHeader>
                    <CardTitle className="text-white text-xl flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      每月用量明細
                    </CardTitle>
                    <CardDescription className="text-blue-200">查看經銷商的詳細用量統計和費用記錄</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* 用量統計卡片 */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4">當月用量統計</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-white/5 border-blue-300/20 hover:bg-white/10 transition-colors duration-300 [&>*]:!bg-transparent">
                          <CardContent className="p-6">
                            <div className="text-center">
                              <p className="text-blue-200 text-sm">流量</p>
                              <p className="text-white text-3xl font-bold mt-2">
                                {formatTraffic(currentMonthData.totalBytes).value}
                                <span className="text-2xl"> {formatTraffic(currentMonthData.totalBytes).unit}</span>
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="bg-white/5 border-blue-300/20 hover:bg-white/10 transition-colors duration-300 [&>*]:!bg-transparent">
                          <CardContent className="p-6">
                            <div className="text-center">
                            <p className="text-blue-200 text-sm">請求次數</p>
                              <p className="text-white text-3xl font-bold mt-2">
                                {formatRequests(currentMonthData.totalRequests).value}
                                <span className="text-2xl"> {formatRequests(currentMonthData.totalRequests).unit}</span>
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    {/* 用量明細表格 */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4">月份明細</h4>
                      <div className="rounded-md border border-blue-300/20 overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-blue-300/20 hover:bg-white/5">
                              <TableHead className="text-blue-200">月份</TableHead>
                              <TableHead className="text-blue-200">流量</TableHead>
                              <TableHead className="text-blue-200">請求次數</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {historicalMonthlyData.map((usage, index) => (
                              <TableRow key={index} className="border-blue-300/20 hover:bg-white/5">
                                <TableCell className="text-white font-medium">{usage.month}</TableCell>
                                <TableCell className="text-blue-200">{usage.trafficTB}</TableCell>
                                <TableCell className="text-blue-200">{usage.requestsMM}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        ) : currentView === "endusers" ? (
          /* EndUsers Page */
          <div className="space-y-6">
            <Button
              onClick={handleBackToDetail}
              variant="outline"
              className="border-blue-300/30 text-blue-200 hover:bg-blue-600/20 bg-transparent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回經銷商詳細資料
            </Button>

            {/* EndUsers Content */}
            {selectedReseller && (
              <Card className="bg-white/10 backdrop-blur-sm border-blue-300/20 [&>*]:!bg-transparent">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-white text-2xl flex items-center gap-2">
                        <Users className="w-6 h-6" />
                        {selectedReseller.userId} - 訂單管理
                      </CardTitle>
                      <CardDescription className="text-blue-200">查看和管理該經銷商下的所有 EndUser</CardDescription>
                    </div>
                    {/* <div className="bg-green-600/20 backdrop-blur-sm border border-green-400/30 rounded-lg px-4 py-3">
                      <div className="text-center">
                        <p className="text-green-200 text-sm">總 EndUser 數</p>
                        <AnimatedCounter
                          value={selectedReseller.contracts.length || 0}
                          className="text-white text-2xl font-bold"
                          duration={800}
                        />
                      </div>
                    </div> */}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card className="bg-white/5 border-green-300/20 hover:bg-white/10 transition-colors duration-300 [&>*]:!bg-transparent">
                      <CardContent className="p-6">
                        <div className="text-center">
                          <p className="text-green-200 text-sm">活躍訂單</p>
                          <AnimatedCounter
                            value={selectedReseller.contracts?.filter((item: any) => item.status === "active").length || 0}
                            className="text-green-400 text-3xl font-bold mt-2"
                            duration={1000}
                          />
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-white/5 border-red-300/20 hover:bg-white/10 transition-colors duration-300 [&>*]:!bg-transparent">
                      <CardContent className="p-6">
                        <div className="text-center">
                          <p className="text-red-200 text-sm">非活躍訂單</p>
                          <AnimatedCounter
                            value={selectedReseller.contracts?.filter((item: any) => item.status === "inactive").length || 0}
                            className="text-red-400 text-3xl font-bold mt-2"
                            duration={1000}
                          />
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-white/5 border-blue-300/20 hover:bg-white/10 transition-colors duration-300 [&>*]:!bg-transparent">
                      <CardContent className="p-6">
                        <div className="text-center">
                          <p className="text-blue-200 text-sm">總訂單數</p>
                          <AnimatedCounter
                            value={selectedReseller.contracts.length || 0}
                            className="text-blue-400 text-3xl font-bold mt-2"
                            duration={1200}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {
                    true ? (
                      <div className="justify-end items-center mb-4">
                        <form onSubmit={handleCreateContractSubmit} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="contractNo" className="text-white">
                                訂單編號
                              </Label>
                              <Input
                                id="contractNo"
                                value={contractForm.contractNo}
                                onChange={(e) => handleCreateContractChange('contractNo', e.target.value)}
                                placeholder="輸入訂單編號"
                                className="bg-white/10 border-blue-300/30 text-white placeholder:text-blue-200"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="company" className="text-white">
                                公司名稱
                              </Label>
                              <Input
                                id="company"
                                value={contractForm.company}
                                onChange={(e) => setContractForm((prev: any) => ({ ...prev, company: e.target.value }))}
                                placeholder="輸入公司名稱"
                                className="bg-white/10 border-blue-300/30 text-white placeholder:text-blue-200"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="plan" className="text-white">
                                方案
                              </Label>
                              <Select
                                value={contractForm.plan}
                                onValueChange={(value) => handleCreateContractChange('plan', value)}
                              >
                                <SelectTrigger className="bg-white/10 border-blue-300/30 text-white">
                                  <SelectValue placeholder="選擇方案" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800/95 backdrop-blur-sm border-blue-300/20">
                                  {plans.map((plan: any) => (
                                    <SelectItem value={plan.plan_code} className="text-white hover:bg-white/10">
                                      {plan.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="plan" className="text-white">
                                主域名數量
                              </Label>
                              <Select
                                value={contractForm.serviceCount}
                                onValueChange={(value) => handleCreateContractChange('serviceCount', value)}
                              >
                                <SelectTrigger className="bg-white/10 border-blue-300/30 text-white">
                                  <SelectValue placeholder="選擇數量" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800/95 backdrop-blur-sm border-blue-300/20">
                                  {Array.from({ length: 100 }, (_, i) => i + 1).map((num) => (
                                    <SelectItem key={num} value={num.toString()} className="text-white hover:bg-white/10">
                                      {num}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="flex justify-start">
                            <Button type="submit" className="w-auto bg-blue-600 hover:bg-blue-700 text-white" onClick={handleCreateContractSubmit}>
                              <Plus className="w-4 h-4 mr-2" />
                              新增
                            </Button>
                          </div>
                        </form>
                      </div>
                    ) : null
                  }
                  <div className="rounded-md border border-blue-300/20 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-blue-300/20 hover:bg-white/5">
                          <TableHead className="text-blue-200">訂單編號</TableHead>
                          <TableHead className="text-blue-200">公司名稱</TableHead>
                          <TableHead className="text-blue-200">方案</TableHead>
                          <TableHead className="text-blue-200">主域名數量</TableHead>
                          <TableHead className="text-blue-200">狀態</TableHead>
                          <TableHead className="text-blue-200">流量</TableHead>
                          <TableHead className="text-blue-200">請求次數</TableHead>
                          <TableHead className="text-blue-200">起案日期</TableHead>
                          <TableHead className="text-blue-200">操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedReseller && selectedReseller.contracts && Array.isArray(selectedReseller.contracts) ? (
                          selectedReseller.contracts.map((contract: any) => (
                            <TableRow key={contract.id} className="border-blue-300/20 hover:bg-white/5">
                              <TableCell className="text-white font-medium">{contract.contractNo}</TableCell>
                              <TableCell className="text-white font-medium">{contract.company}</TableCell>
                              <TableCell className="text-white font-medium">{plans.find((plan: any) => plan.plan_code === contract.plan)?.name || contract.plan}</TableCell>
                              <TableCell className="text-white font-medium">{contract.serviceCount}</TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={
                                    !contract.end_date
                                      ? "border-green-300/30 text-green-200"
                                      : "border-red-300/30 text-red-200"
                                  }
                                >
                                  {contract.end_date ? "關閉" : "進行中"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-blue-200">{formatTraffic(contract.totalTrafficByContract).value} {formatTraffic(contract.totalTrafficByContract).unit}</TableCell>
                              <TableCell className="text-blue-200">{formatRequests(contract.totalRequestByContract).value} {formatRequests(contract.totalRequestByContract).unit}</TableCell>
                              <TableCell className="text-blue-200">{contract.createdAt
                                ? new Date(contract.createdAt).toLocaleDateString('zh-TW', {
                                  year: 'numeric',
                                  month: '2-digit',
                                  day: '2-digit'
                                  }).replace(/\//g, '/')
                                : ''
                              }</TableCell>
                              <TableCell>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-blue-300/30 text-blue-200 hover:bg-blue-600/20 bg-transparent"
                                  onClick={() => handleViewContract(contract)}
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  詳細
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center text-blue-200 py-8">
                              沒有找到訂單數據
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : currentView === "contract" && selectedContract ? (
          /* EndUsers Page */
          <div className="space-y-6">
            {/* Back Button */}
            <Button
              onClick={handleBackToEndUserList}
              variant="outline"
              className="border-blue-300/30 text-blue-200 hover:bg-blue-600/20 bg-transparent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回EndUser管理
            </Button>

            {/* EndUsers Content */}
            {selectedContract && (
              <div className="space-y-6">
                <Card className="bg-white/10 backdrop-blur-sm border-blue-300/20 [&>*]:!bg-transparent">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-white text-2xl">
                          訂單詳細資料 - {selectedContract.contractNo}
                        </CardTitle>
                        <CardDescription className="text-blue-200">查看訂單的完整資訊，包括域名和 EndUser 帳號</CardDescription>
                      </div>
                    </div>
                    <div className="flex justify-end items-center mb-4">
                      <Button
                          onClick={() => handleSwitchToUserContract(selectedContract.contractNo)}
                          size="sm"
                          variant="outline"
                          className="border-green-300/30 text-green-200 hover:bg-green-600/20 bg-transparent"
                        >
                          <Users className="w-4 h-4 mr-1" />
                          進入設定頁面
                        </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <h3 className="text-lg font-semibold text-white">基本資訊</h3>
                    {isEditing ? (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <Label className="text-blue-200">訂單編號</Label>
                            <p className="text-white font-medium text-lg mt-1">{selectedContract.contractNo}</p>
                          </div>
                          <div>
                            <Label className="text-blue-200">公司名稱</Label>
                            <Input
                              value={editData.company}
                              onChange={(e) => setEditData((prev: any) => ({ ...prev, company: e.target.value }))}
                              className="bg-white/10 border-blue-300/30 text-white placeholder:text-blue-200"
                            />
                          </div>
                          <div>
                            <Label className="text-blue-200">方案</Label>
                            <p className="text-white font-medium text-lg mt-1">{plans.find((plan: any) => plan.plan_code === selectedContract.plan)?.name || selectedContract.plan}</p>
                          </div>
                          <div className="flex gap-2">
                            {/* <Button onClick={handleEditContractSubmit} className="bg-green-600 hover:bg-green-700">
                              儲存
                            </Button> */}
                            <Button
                              onClick={() => setIsEditing(false)}
                              variant="outline"
                              className="border-blue-300/30 text-blue-200"
                            >
                              取消
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <Label className="text-blue-200">訂單編號</Label>
                            <p className="text-white font-medium text-lg mt-1">{selectedContract.contractNo}</p>
                          </div>
                          <div>
                            <Label className="text-blue-200">公司名稱</Label>
                            <p className="text-white font-medium text-lg mt-1">{selectedContract.company}</p>
                          </div>
                          <div>
                            <Label className="text-blue-200">方案</Label>
                            <p className="text-white font-medium text-lg mt-1">{selectedContract.plan}</p>
                          </div>
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <Card className="bg-white/5 border-blue-300/20 hover:bg-white/10 transition-colors duration-300 [&>*]:!bg-transparent">
                        <CardContent className="p-6">
                          <div className="text-center">
                            <p className="text-blue-200 text-sm">總流量</p>
                            <p className="text-white text-3xl font-bold mt-2">
                              {formatTraffic(selectedContract.totalTrafficByContract).value}
                              <span className="text-2xl"> {formatTraffic(selectedContract.totalTrafficByContract).unit}</span>
                            </p>
                            {/* <p className="text-blue-200 text-sm">總流量</p>
                            <p className="text-white text-3xl font-bold mt-2">
                              <AnimatedCounter
                                value={Number(formatTraffic(selectedContract.totalTrafficByContract).value || 0)}
                                className="text-white text-3xl font-bold"
                                duration={1200}
                              />
                              <span className="text-2xl">{formatTraffic(selectedContract.totalTrafficByContract).unit}</span>
                            </p> */}
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-white/5 border-blue-300/20 hover:bg-white/10 transition-colors duration-300 [&>*]:!bg-transparent">
                        <CardContent className="p-6">
                          <div className="text-center">
                            <p className="text-blue-200 text-sm">總請求次數</p>
                            <p className="text-white text-3xl font-bold mt-2">
                              {formatRequests(selectedContract.totalRequestByContract).value}
                              <span className="text-2xl"> {formatRequests(selectedContract.totalRequestByContract).unit}</span>
                            </p>
                            {/* <p className="text-blue-200 text-sm">總請求次數</p>
                            <p className="text-white text-3xl font-bold mt-2">
                              <AnimatedCounter
                                value={Number(formatRequests(selectedContract.totalRequestByContract).value || 0)}
                                className="text-white text-3xl font-bold"
                                duration={1200}
                              />
                              <span className="text-2xl">{formatRequests(selectedContract.totalRequestByContract).unit}</span>
                            </p> */}
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-white/5 border-blue-300/20 hover:bg-white/10 transition-colors duration-300 [&>*]:!bg-transparent">
                        <CardContent className="p-6">
                          <div className="text-center">
                            <p className="text-blue-200 text-sm">主域名數</p>
                            <p className="text-white text-3xl font-bold mt-2">
                              <AnimatedCounter
                                value={selectedContract.zones.length || 0}
                                className="text-blue-400 text-3xl font-bold mt-2"
                                duration={1200}
                              />
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>

                {/* EndUser 帳號列表 */}
                <Card className="bg-white/10 backdrop-blur-sm border-blue-300/20 [&>*]:!bg-transparent">
                  <CardHeader>
                    <CardTitle className="text-white text-xl flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      EndUser 帳號列表
                    </CardTitle>
                    <CardDescription className="text-blue-200">此訂單下的所有 EndUser 帳號資訊</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {
                      true ? (
                        <div className="justify-end items-center mb-4">
                          <form onSubmit={handleCreateUserSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="userId" className="text-white">
                                  帳號
                                </Label>
                                <Input
                                  id="userId"
                                  value={createUserForm.userId}
                                  onChange={(e) => handleCreateUserChange("userId", e.target.value)}
                                  placeholder="輸入帳號ID"
                                  className="bg-white/10 border-blue-300/30 text-white placeholder:text-blue-200"
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="company" className="text-white">
                                  公司名稱
                                </Label>
                                <Input
                                  id="company"
                                  value={createUserForm.company}
                                  onChange={(e) => setCreateUserForm(prev => ({ ...prev, company: e.target.value }))}
                                  placeholder="輸入公司名稱"
                                  className="bg-white/10 border-blue-300/30 text-white placeholder:text-blue-200"
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="name" className="text-white">
                                  聯絡人
                                </Label>
                                <Input
                                  id="name"
                                  value={createUserForm.name}
                                  onChange={(e) => setCreateUserForm(prev => ({ ...prev, name: e.target.value }))}
                                  placeholder="輸入聯絡人姓名"
                                  className="bg-white/10 border-blue-300/30 text-white placeholder:text-blue-200"
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="email" className="text-white">
                                  Email
                                </Label>
                                <Input
                                  id="email"
                                  type="email"
                                  value={createUserForm.email}
                                  onChange={(e) => handleCreateUserChange("email", e.target.value)}
                                  placeholder="輸入電子郵件"
                                  className="bg-white/10 border-blue-300/30 text-white placeholder:text-blue-200"
                                  required
                                />
                                {emailErrors.format && (
                                  <p className="text-red-400 text-xs">請輸入有效的電子郵件地址</p>
                                )}
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="password" className="text-white">
                                  密碼
                                </Label>
                                <Input
                                  id="password"
                                  type="password"
                                  value={createUserForm.password}
                                  onChange={(e) => handleCreateUserChange("password", e.target.value)}
                                  placeholder="輸入密碼"
                                  className="bg-white/10 border-blue-300/30 text-white placeholder:text-blue-200"
                                  required
                                />
                                {/* 密碼要求提示 */}
                                {createUserForm.password && (
                                  <div className="text-blue-200 text-xs space-y-1">
                                    <p>密碼要求：</p>
                                    <ul className="list-disc list-inside space-y-0.5">
                                      <li className={createUserForm.password.length >= 8 ? "text-green-400" : "text-red-400"}>
                                        至少8個字元
                                      </li>
                                      <li className={/(?=.*[a-z])/.test(createUserForm.password) ? "text-green-400" : "text-red-400"}>
                                        包含小寫字母
                                      </li>
                                      <li className={/(?=.*[A-Z])/.test(createUserForm.password) ? "text-green-400" : "text-red-400"}>
                                        包含大寫字母
                                      </li>
                                      <li className={/(?=.*\d)/.test(createUserForm.password) ? "text-green-400" : "text-red-400"}>
                                        包含數字
                                      </li>
                                      <li className={/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(createUserForm.password) ? "text-green-400" : "text-red-400"}>
                                        包含特殊符號
                                      </li>
                                    </ul>
                                  </div>
                                )}
                                {(passwordErrors.length || passwordErrors.complexity) && (
                                  <div className="space-y-1">
                                    {passwordErrors.length && (
                                      <p className="text-red-400 text-xs">密碼長度至少需要8個字元</p>
                                    )}
                                    {passwordErrors.complexity && (
                                      <p className="text-red-400 text-xs">密碼必須包含大寫字母、小寫字母、數字和特殊符號</p>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                            <Button type="submit" className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white" onClick={handleCreateUserSubmit}>
                              <Plus className="w-4 h-4 mr-2" />
                              新增
                            </Button>
                          </form>
                        </div>
                      ) : null
                    }
                    <div className="rounded-md border border-blue-300/20 overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-blue-300/20 hover:bg-white/5">
                            <TableHead className="text-blue-200">帳號</TableHead>
                            <TableHead className="text-blue-200">公司名稱</TableHead>
                            <TableHead className="text-blue-200">聯絡人</TableHead>
                            <TableHead className="text-blue-200">Email</TableHead>
                            <TableHead className="text-blue-200">狀態</TableHead>
                            <TableHead className="text-blue-200">最後活躍</TableHead>
                            <TableHead className="text-blue-200">建立日期</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedContract.users.map((item: any, index: number) => (
                            <TableRow key={index} className="border-blue-300/20 hover:bg-white/5">
                              <TableCell className="text-white font-medium">{item.userId}</TableCell>
                              <TableCell className="text-blue-200">{item.company}</TableCell>
                              <TableCell className="text-blue-200">{item.name}</TableCell>
                              <TableCell className="text-blue-200">{item.email}</TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={
                                    item.status === "active"
                                      ? "border-green-300/30 text-green-200"
                                      : "border-red-300/30 text-red-200"
                                  }
                                >
                                  {item.status === "active" ? "活躍" : "非活躍"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-blue-200">
                                {item.lastActive
                                  ? new Date(item.lastActive).toLocaleDateString('zh-TW', {
                                      year: 'numeric',
                                      month: '2-digit',
                                      day: '2-digit'
                                    }).replace(/\//g, '/')
                                  : ''
                                }
                              </TableCell>
                              <TableCell className="text-blue-200">
                                {item.createdAt
                                  ? new Date(item.createdAt).toLocaleDateString('zh-TW', {
                                      year: 'numeric',
                                      month: '2-digit',
                                      day: '2-digit'
                                    }).replace(/\//g, '/')
                                  : ''
                                }
                              </TableCell>
                              <TableCell>
                                <Button
                                  onClick={() => handleViewUserLogs(item)}
                                  variant="outline"
                                  size="sm"
                                  className="border-blue-300/30 text-blue-200 hover:bg-blue-600/20 bg-transparent"
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  查看
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                {/* 域名列表 */}
                <Card className="bg-white/10 backdrop-blur-sm border-blue-300/20 [&>*]:!bg-transparent">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-white text-xl flex items-center gap-2">
                          <Globe className="w-5 h-5" />
                          域名列表
                        </CardTitle>
                        <CardDescription className="text-blue-200">此訂單下的所有域名及其流量統計</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border border-blue-300/20 overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-blue-300/20 hover:bg-white/5">
                            <TableHead className="text-blue-200">域名</TableHead>
                            <TableHead className="text-blue-200">流量</TableHead>
                            <TableHead className="text-blue-200">請求次數</TableHead>
                            <TableHead className="text-blue-200">建立日期</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedContract.zones.map((item: any, index: number) => (
                            <TableRow key={index} className="border-blue-300/20 hover:bg-white/5">
                              <TableCell className="text-white font-medium">{item.zone}</TableCell>
                              <TableCell className="text-blue-200">{formatTraffic(selectedContract.trafficData[item.zone].totalTraffic).value} {formatTraffic(selectedContract.trafficData[item.zone].totalTraffic).unit}</TableCell>
                              <TableCell className="text-blue-200">{formatRequests(selectedContract.trafficData[item.zone].totalRequest).value} {formatRequests(selectedContract.trafficData[item.zone].totalRequest).unit}</TableCell>
                              <TableCell className="text-blue-200">
                                {item.createdAt
                                  ? new Date(item.createdAt).toLocaleDateString('zh-TW', {
                                      year: 'numeric',
                                      month: '2-digit',
                                      day: '2-digit'
                                    }).replace(/\//g, '/')
                                  : ''
                                }
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                {/* 歷史紀錄 */}
                <Card className="bg-white/10 backdrop-blur-sm border-blue-300/20 [&>*]:!bg-transparent">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-white text-xl flex items-center gap-2">
                          <Globe className="w-5 h-5" />
                          歷史紀錄
                        </CardTitle>
                        <CardDescription className="text-blue-200">此訂單下的所有歷史操作紀錄</CardDescription>
                      </div>
                    </div>
                    <div className="flex justify-end items-center">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-4 h-4" />
                        <Input
                          placeholder="搜尋帳號或動作..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 bg-white/10 border-blue-300/30 text-white placeholder:text-blue-200 w-full md:w-64"
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* 分頁控制：每頁顯示數量選擇 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-200 text-sm">每頁顯示：</span>
                        <Select value={contractItemsPerPage.toString()} onValueChange={(value) => {
                          setContractItemsPerPage(Number(value))
                          setContractCurrentPage(1)
                        }}>
                          <SelectTrigger className="w-20 bg-white/10 border-blue-300/20 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-blue-300/20">
                            <SelectItem value="5" className="text-white hover:bg-white/10">5</SelectItem>
                            <SelectItem value="10" className="text-white hover:bg-white/10">10</SelectItem>
                            <SelectItem value="20" className="text-white hover:bg-white/10">20</SelectItem>
                            <SelectItem value="50" className="text-white hover:bg-white/10">50</SelectItem>
                          </SelectContent>
                        </Select>
                        <span className="text-blue-200 text-sm">筆</span>
                      </div>
                      <div className="text-blue-200 text-sm">
                        顯示 {contractStartIndex + 1}-{Math.min(contractEndIndex, contractTotalItems)} / 共 {contractTotalItems} 筆
                      </div>
                    </div>

                    <div className="rounded-md border border-blue-300/20 overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-blue-300/20 hover:bg-white/5">
                            <TableHead className="text-blue-200">時間</TableHead>
                            <TableHead className="text-blue-200">操作帳號</TableHead>
                            <TableHead className="text-blue-200">動作</TableHead>
                            <TableHead className="text-blue-200">內容</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {currentContractLogs.map((item: any, index: number) => (
                            <TableRow key={contractStartIndex + index} className="border-blue-300/20 hover:bg-white/5">
                              <TableCell className="text-blue-200">
                                {item.createdAt
                                  ? new Date(item.createdAt).toLocaleDateString('zh-TW', {
                                      year: 'numeric',
                                      month: '2-digit',
                                      day: '2-digit',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                      second: '2-digit'
                                    }).replace(/\//g, '/')
                                  : ''
                                }
                              </TableCell>
                              <TableCell className="text-white font-medium">{item.userId}</TableCell>
                              <TableCell className="text-blue-200">{item.action}</TableCell>
                              <TableCell className="text-blue-200">{item.track}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* 分頁導航 */}
                    {contractTotalPages > 1 && (
                      <div className="flex justify-center">
                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious 
                                onClick={() => setContractCurrentPage(Math.max(1, contractCurrentPage - 1))}
                                className={`text-blue-200 hover:bg-white/10 border-blue-300/20 ${
                                  contractCurrentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                }`}
                              />
                            </PaginationItem>
                            
                            {Array.from({ length: contractTotalPages }, (_, i) => i + 1).map((page) => {
                              if (
                                page === 1 || 
                                page === contractTotalPages || 
                                (page >= contractCurrentPage - 2 && page <= contractCurrentPage + 2)
                              ) {
                                return (
                                  <PaginationItem key={page}>
                                    <PaginationLink
                                      onClick={() => setContractCurrentPage(page)}
                                      isActive={contractCurrentPage === page}
                                      className={`cursor-pointer ${
                                        contractCurrentPage === page 
                                          ? 'bg-blue-600 text-white border-blue-600' 
                                          : 'text-blue-200 hover:bg-white/10 border-blue-300/20'
                                      }`}
                                    >
                                      {page}
                                    </PaginationLink>
                                  </PaginationItem>
                                )
                              } else if (
                                page === contractCurrentPage - 3 || 
                                page === contractCurrentPage + 3
                              ) {
                                return (
                                  <PaginationItem key={page}>
                                    <span className="text-blue-200 px-2">...</span>
                                  </PaginationItem>
                                )
                              }
                              return null
                            })}

                            <PaginationItem>
                              <PaginationNext 
                                onClick={() => setContractCurrentPage(Math.min(contractTotalPages, contractCurrentPage + 1))}
                                className={`text-blue-200 hover:bg-white/10 border-blue-300/20 ${
                                  contractCurrentPage === contractTotalPages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                }`}
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        ) : currentView === "userLogs" && selectedUser ? (
          <div className="space-y-6">
            <Button
              onClick={handleBackToContract}
              variant="outline"
              className="border-blue-300/30 text-blue-200 hover:bg-blue-600/20 bg-transparent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回訂單管理
            </Button>

            {/* EndUsers Content */}
            {selectedUser && (
              <>
                <Card className="bg-white/10 backdrop-blur-sm border-blue-300/20 [&>*]:!bg-transparent">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-white text-2xl">{selectedUser.userId} - 詳細資訊</CardTitle>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleEditUser} size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Edit className="w-4 h-4 mr-1" />
                          修改
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <h3 className="text-lg font-semibold text-white">基本資訊</h3>
                    {isEditing ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label className="text-blue-200">帳號</Label>
                          <p className="text-white font-medium text-lg mt-1">{selectedUser.userId}</p>
                        </div>
                        <div>
                          <Label className="text-blue-200">Email</Label>
                          <p className="text-white font-medium text-lg mt-1">{selectedUser.email}</p>
                        </div>
                        <div>
                          <Label className="text-blue-200">公司名稱</Label>
                          <Input
                            value={editData.company}
                            onChange={(e) => setEditData((prev: any) => ({ ...prev, company: e.target.value }))}
                            className="bg-white/10 border-blue-300/30 text-white placeholder:text-blue-200"
                          />
                        </div>
                        <div>
                          <Label className="text-blue-200">聯絡人</Label>
                          <Input
                            value={editData.name}
                            onChange={(e) => setEditData((prev: any) => ({ ...prev, name: e.target.value }))}
                            className="bg-white/10 border-blue-300/30 text-white placeholder:text-blue-200"
                          />
                        </div>
                        <div>
                          <Label className="text-blue-200">電話號碼</Label>
                          <Input
                            value={editData.phone}
                            onChange={(e) => setEditData((prev: any) => ({ ...prev, phone: e.target.value }))}
                            className="bg-white/10 border-blue-300/30 text-white placeholder:text-blue-200"
                          />
                        </div>
                        {/* <div>
                          <Label className="text-blue-200">建立日期</Label>
                          <p className="text-white font-medium text-lg mt-1">{selectedUser.createdAt 
                            ? new Date(selectedUser.createdAt).toLocaleDateString('zh-TW', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit'
                              }).replace(/\//g, '/')
                            : ''
                          }</p>
                        </div> */}
                        <div>
                          <Label className="text-blue-200">最新操作日期</Label>
                          <p className="text-white font-medium text-lg mt-1">{selectedLogs && selectedLogs.length > 0 
                            ? new Date(selectedLogs[0].createdAt).toLocaleDateString('zh-TW', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit'
                              }).replace(/\//g, '/')
                            : ''
                          }</p>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleEditUserSubmit} className="bg-green-600 hover:bg-green-700">
                            儲存
                          </Button>
                          <Button
                            onClick={() => setIsEditing(false)}
                            variant="outline"
                            className="border-blue-300/30 text-blue-200"
                          >
                            取消
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label className="text-blue-200">帳號</Label>
                          <p className="text-white font-medium text-lg mt-1">{selectedUser.userId}</p>
                        </div>
                        <div>
                          <Label className="text-blue-200">Email</Label>
                          <p className="text-white font-medium text-lg mt-1">{selectedUser.email}</p>
                        </div>
                        <div>
                          <Label className="text-blue-200">公司名稱</Label>
                          <p className="text-white font-medium text-lg mt-1">{selectedUser.company}</p>
                        </div>
                        <div>
                          <Label className="text-blue-200">聯絡人</Label>
                          <p className="text-white font-medium text-lg mt-1">{selectedUser.name}</p>
                        </div>
                        <div>
                          <Label className="text-blue-200">電話號碼</Label>
                          <p className="text-white font-medium text-lg mt-1">{selectedUser.phone}</p>
                        </div>
                        {/* <div>
                          <Label className="text-blue-200">建立日期</Label>
                          <p className="text-white font-medium text-lg mt-1">{selectedUser.createdAt 
                            ? new Date(selectedUser.createdAt).toLocaleDateString('zh-TW', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit'
                              }).replace(/\//g, '/')
                            : ''
                          }</p>
                        </div> */}
                        <div>
                          <Label className="text-blue-200">最新操作日期</Label>
                          <p className="text-white font-medium text-lg mt-1">{selectedLogs && selectedLogs.length > 0 
                            ? new Date(selectedLogs[0].createdAt).toLocaleDateString('zh-TW', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit'
                              }).replace(/\//g, '/')
                            : ''
                          }</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                <Card className="bg-white/10 backdrop-blur-sm border-blue-300/20 [&>*]:!bg-transparent">
                  <CardHeader>
                    <CardTitle className="text-white text-xl flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      歷史紀錄
                    </CardTitle>
                    <CardDescription className="text-blue-200">查看EndUser帳號的詳細操作歷史記錄</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* 分頁控制：每頁顯示數量選擇 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-200 text-sm">每頁顯示：</span>
                        <Select value={itemsPerPage.toString()} onValueChange={(value) => {
                          setItemsPerPage(Number(value))
                          setCurrentPage(1)
                        }}>
                          <SelectTrigger className="w-20 bg-white/10 border-blue-300/20 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-blue-300/20">
                            <SelectItem value="5" className="text-white hover:bg-white/10">5</SelectItem>
                            <SelectItem value="10" className="text-white hover:bg-white/10">10</SelectItem>
                            <SelectItem value="20" className="text-white hover:bg-white/10">20</SelectItem>
                            <SelectItem value="50" className="text-white hover:bg-white/10">50</SelectItem>
                          </SelectContent>
                        </Select>
                        <span className="text-blue-200 text-sm">筆</span>
                      </div>
                      <div className="text-blue-200 text-sm">
                        顯示 {startIndex + 1}-{Math.min(endIndex, totalItems)} / 共 {totalItems} 筆
                      </div>
                    </div>

                    <div className="rounded-md border border-blue-300/20 overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-blue-300/20 hover:bg-white/5">
                            <TableHead className="text-blue-200">時間</TableHead>
                            <TableHead className="text-blue-200">操作帳號</TableHead>
                            <TableHead className="text-blue-200">動作</TableHead>
                            <TableHead className="text-blue-200">內容</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {currentLogs.map((item: any, index: number) => (
                            <TableRow key={startIndex + index} className="border-blue-300/20 hover:bg-white/5">
                              <TableCell className="text-blue-200">
                                {item.createdAt
                                  ? new Date(item.createdAt).toLocaleDateString('zh-TW', {
                                      year: 'numeric',
                                      month: '2-digit',
                                      day: '2-digit',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                      second: '2-digit'
                                    }).replace(/\//g, '/')
                                  : ''
                                }
                              </TableCell>
                              <TableCell className="text-white font-medium">{item.userId}</TableCell>
                              <TableCell className="text-blue-200">{item.action}</TableCell>
                              <TableCell className="text-blue-200">{item.track}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* 分頁導航 */}
                    {totalPages > 1 && (
                      <div className="flex justify-center">
                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious 
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                className={`text-blue-200 hover:bg-white/10 border-blue-300/20 ${
                                  currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                }`}
                              />
                            </PaginationItem>
                            
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                              // 只顯示當前頁面附近的頁碼
                              if (
                                page === 1 || 
                                page === totalPages || 
                                (page >= currentPage - 2 && page <= currentPage + 2)
                              ) {
                                return (
                                  <PaginationItem key={page}>
                                    <PaginationLink
                                      onClick={() => setCurrentPage(page)}
                                      isActive={currentPage === page}
                                      className={`cursor-pointer ${
                                        currentPage === page 
                                          ? 'bg-blue-600 text-white border-blue-600' 
                                          : 'text-blue-200 hover:bg-white/10 border-blue-300/20'
                                      }`}
                                    >
                                      {page}
                                    </PaginationLink>
                                  </PaginationItem>
                                )
                              } else if (
                                page === currentPage - 3 || 
                                page === currentPage + 3
                              ) {
                                return (
                                  <PaginationItem key={page}>
                                    <span className="text-blue-200 px-2">...</span>
                                  </PaginationItem>
                                )
                              }
                              return null
                            })}

                            <PaginationItem>
                              <PaginationNext 
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                className={`text-blue-200 hover:bg-white/10 border-blue-300/20 ${
                                  currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                }`}
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        ) : null}
      </div>

      <LoadingOverlay
        active={isLoading}
        spinner={<RingLoader color={'#17a2b8'} size={60} />}
        styles={{
            overlay: base => ({
                ...base,
                position: 'fixed',
                zIndex: 1050,
            }),
            content: base => ({
                ...base,
                fontWeight: 'normal',
                fontSize: 'inherit'
            }),
        }}
        text='請稍候'
      />

    </div>
  )
}

export default function ManagementPage() {
  return (
    <RoleGuard allowedRoles={['management']}>
      <AdasOneManagement />
    </RoleGuard>
  )
}
