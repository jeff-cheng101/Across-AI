"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { Globe, Settings, CheckCircle, ChevronDown, ChevronUp, Activity, Plus, X, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { LoadingOverlay } from '@/components/ui/loading-overlay'
import { RoleGuard } from "@/components/role-guard"
import { RingLoader } from 'react-spinners'
import { notifyError, notifySuccess } from "@/app/util/notify"
import {  getZonesByContractNo, getDnsByContractNo, getCdnCacheByContractNo, updateCdnCacheRule, purgeCache } from "@/app/routes/cloudflare"
import authenticator from "@/app/util/authenticator"

interface ZoneSetting {
  name: string
  status: string
  txtRecord: {
    type: string
    name: string
    content: string
  }
  cname_suffix: string
}

function CDNManagePage() {
  const router = useRouter()
  const [auth, setAuth] = useState<any>(null)
  let dnsPermission = "2"
  // if (auth?.role.name === "admin" && auth?.role.type === "management") {
  //   dnsPermission = "2"
  // } else {
  //   dnsPermission = auth?.role?.permissions?.dns_settings || "0"
  // }
  const isReadOnly = dnsPermission === "1"
  const notPermission = dnsPermission === "0"
  // useEffect(() => {
  //   if (auth) {
  //     // 如果為維運帳號登入，並且訂單含此服務，則不限制
  //     if (auth.maintainer && auth?.contract?.module?.includes('cdn')) return
  //     if (notPermission || !auth?.contract?.module?.includes('cdn')) {
  //       router.push('/dashboard')
  //     }
  //   }
  // }, [auth, notPermission, router])

  const [zoneSettings, setZoneSettings] = useState<ZoneSetting[]>([])
  const [domainSettings, setDomainSettings] = useState<[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20
  const [expandedCdnCache, setExpandedCdnCache] = useState<any>({})
  const [editingCdnCacheForms, setEditingCdnCacheForms] = useState<any>({})
  const [totalBytes, setTotalBytes] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // 搜尋與分頁邏輯
  const filteredDomains = domainSettings.filter((domain: any) =>
    domain.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredDomains.length / itemsPerPage)
  const paginatedDomains = filteredDomains.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, domainSettings])

  // 快取清除狀態
  const [selectedPurgeZone, setSelectedPurgeZone] = useState<string | null>(null)
  const [purgeAllDialogOpen, setPurgeAllDialogOpen] = useState(false)
  const [customPurgeDialogOpen, setCustomPurgeDialogOpen] = useState(false)
  const [purgeType, setPurgeType] = useState<'url' | 'hostname'>('url')
  const [purgeValues, setPurgeValues] = useState('')

  const getTtlLabel = (value: number | string, options: any[]) => {
    const option = options.find(opt => opt.value.toString() === value.toString())
    return option ? option.label : value.toString()
  }

  const edgeTtlOptions = [
    { value: 0, label: "0秒鐘" },
    { value: 1, label: "1秒鐘" },
    { value: 3, label: "3秒鐘" },
    { value: 5, label: "5秒鐘" },
    { value: 10, label: "10秒鐘" },
    { value: 30, label: "30秒鐘" },
    { value: 60, label: "1分鐘" },
    { value: 300, label: "5分鐘" },
    { value: 600, label: "10分鐘" },
    { value: 900, label: "20分鐘" },
    { value: 1800, label: "30分鐘" },
    { value: 3600, label: "1小時" },
    { value: 7200, label: "2小時" },
    { value: 10800, label: "3小時" },
    { value: 14400, label: "4小時" },
    { value: 18000, label: "5小時" },
    { value: 28800, label: "8小時" },
    { value: 43200, label: "12小時" },
    { value: 57600, label: "16小時" },
    { value: 72000, label: "20小時" },
    { value: 86400, label: "1天" },
    { value: 172800, label: "2天" },
    { value: 259200, label: "3天" },
    { value: 345600, label: "4天" },
    { value: 432000, label: "5天" },
    { value: 518400, label: "6天" },
    { value: 604800, label: "7天" },
    { value: 1209600, label: "14天" },
    { value: 2678400, label: "1個月" },
    { value: 16070400, label: "6個月" },
    { value: 31536000, label: "1年" }
  ]

  // CDN 條件欄位類型
  const cdnFieldTypes = [
    { value: 'full_uri', label: '完整 URI' },
    { value: 'file_extension', label: '檔案副檔名' },
  ]

  // CDN 條件運算子
  const fullUriOperators = [
    { value: 'wildcard', label: '萬用字元' },
    { value: 'eq', label: '等於' },
    { value: 'ne', label: '不等於' },
    { value: 'contains', label: '包含' },
    { value: 'not_contains', label: '不包含' },
    { value: 'starts_with', label: '開頭為' },
    { value: 'ends_with', label: '結尾為' },
  ]
  const fileExtensionOperators = [
    { value: 'eq', label: '等於' },
    { value: 'ne', label: '不等於' },
    { value: 'in', label: '在其中' },
    { value: 'not_in', label: '不在於' },
  ]

  // 取得值的佔位提示文字
  const getValuePlaceholder = (field: string, operator: string) => {
    switch (field) {
      case 'full_uri':
        if (operator === 'wildcard') {
          return '例如 https://*.example.com/files/*'
        } else {
          return '例如 https://example.com/contact?page=1234'
        }
      case 'file_extension':
        return '例如 media type = mp3'
      default:
        return '請輸入值'
    }
  }

  const browserTtlOptions = [
    { value: 1, label: "1秒鐘" },
    { value: 3, label: "3秒鐘" },
    { value: 5, label: "5秒鐘" },
    { value: 10, label: "10秒鐘" },
    { value: 30, label: "30秒鐘" },
    { value: 60, label: "1分鐘" },
    { value: 300, label: "5分鐘" },
    { value: 600, label: "10分鐘" },
    { value: 900, label: "20分鐘" },
    { value: 1800, label: "30分鐘" },
    { value: 3600, label: "1小時" },
    { value: 7200, label: "2小時" },
    { value: 10800, label: "3小時" },
    { value: 14400, label: "4小時" },
    { value: 18000, label: "5小時" },
    { value: 28800, label: "8小時" },
    { value: 43200, label: "12小時" },
    { value: 57600, label: "16小時" },
    { value: 72000, label: "20小時" },
    { value: 86400, label: "1天" },
    { value: 172800, label: "2天" },
    { value: 259200, label: "3天" },
    { value: 345600, label: "4天" },
    { value: 432000, label: "5天" },
    { value: 518400, label: "6天" },
    { value: 604800, label: "7天" },
    { value: 1209600, label: "14天" },
    { value: 2678400, label: "1個月" },
    { value: 16070400, label: "6個月" },
    { value: 31536000, label: "1年" }
  ]

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
      return { value: bytes, unit: ' Bytes' }
    }
  }
  
  useEffect(() => {
    (async () => {
      const auth = authenticator.authValue;
      setAuth(auth)
      // const permission = auth?.role?.permissions?.dns_settings || "0"
      // if (permission === "0") {
      //   return
      // }
      
      setIsLoading(true)
      await loadSettings()
      setIsLoading(false)
    })()
  }, [auth])

  const loadSettings = async () => {
    try {
      if (!auth) return
      const { contract } = auth as any
      // 取得 Zone 設定
      const zonesResp = await getZonesByContractNo(contract?.contractNo || null)
      const zones = zonesResp.data || []
      let totalBytes = 0
      let zoneSettings = []
      for (let zone of zones) {
        zoneSettings.push({
          name: zone.name,
          status: zone.status,
          txtRecord: {
            type: "TXT",
            name: `cloudflare-verify.${zone.name}`,
            content: zone.verification_key
          },
          cname_suffix: zone.cname_suffix || '-'
        })
        totalBytes += zone.bytes
      }
      setZoneSettings(zoneSettings);
      setTotalBytes(totalBytes)

      // 取得 DNS 設定
      const dnsResp = await getDnsByContractNo(contract?.contractNo || null)
      // 取得 CDN 快取設定
      const domainCacheResp = await getCdnCacheByContractNo(contract?.contractNo || null)
      const domains = domainCacheResp.data || []
      let domainCacheSettings = domains.map((domain: any) => ({ name: domain.name, cdnCache: domain.cdnCache, zone: domain.zone }))
      const dnsRecords = dnsResp.data || []
      let dnsSettings: any = []
      for (let dnsRecord of dnsRecords) {
        const cacheSettings = domainCacheSettings.find((domain: any) => domain.name === dnsRecord.name)
        const existingDns = dnsSettings.find((dns: any) => dns.name === dnsRecord.name)
        if ((dnsRecord.type === 'CNAME' || dnsRecord.type === 'AAAA' || dnsRecord.type === 'A') && !existingDns) {
          dnsSettings.push({
            name: dnsRecord.name,
            type: dnsRecord.type,
            content: dnsRecord.content,
            proxied: dnsRecord.proxied,
            ttl: dnsRecord.ttl,
            zone: dnsRecord.zone,
            cdnCache: cacheSettings?.cdnCache || {}
          })
        }
      }
      setDomainSettings(dnsSettings);

    } catch (error) {
      console.log(error)
      notifyError('設定載入失敗')
    } finally {
      setIsLoading(false)
    }
  }

  ////////////////////////////////
  // CDN 快取設定
  ////////////////////////////////

  const toggleCdnCache = (domain: any) => {
    setExpandedCdnCache((prev: any) => ({ ...prev, [domain.name]: !prev[domain.name] }))
    if (!expandedCdnCache[domain.name]) {
      if (domain) {
        setEditingCdnCacheForms((prev: any) => ({
          ...prev,
          [domain.name]: {
            name: domain.name,
            zone: domain.zone,
            cdnCache: {
                edge_ttl: {
                  mode: domain.cdnCache?.edge_ttl?.mode || 'respect_origin',
                  default: domain.cdnCache?.edge_ttl?.default || 0,
                },
                browser_ttl: {
                    mode: domain.cdnCache?.browser_ttl?.mode || 'respect_origin',
                    default: domain.cdnCache?.browser_ttl?.default || 1,
                },
                cache: domain.cdnCache?.cache || true,
                conditions: domain.cdnCache?.conditions || [],
            }
          }
        }))
      }
    }
  }

  // 新增條件
  // afterIndex: 在哪個條件後面插入新條件，如果不指定則加到最後面
  const addCondition = (domainName: string, logicalOperator?: string, afterIndex?: number) => {
    const currentConditions = editingCdnCacheForms[domainName]?.cdnCache?.conditions || []
    const newCondition = {
      field: 'full_uri',
      operator: 'wildcard',
      value: '',
      logicalOperator: logicalOperator || null
    }
    
    let newConditions: any[]
    if (afterIndex !== undefined && afterIndex >= 0) {
      // 在指定索引後面插入新條件
      newConditions = [
        ...currentConditions.slice(0, afterIndex + 1),
        newCondition,
        ...currentConditions.slice(afterIndex + 1)
      ]
    } else {
      // 加到最後面
      newConditions = [...currentConditions, newCondition]
    }
    
    setEditingCdnCacheForms((prev: any) => ({
      ...prev,
      [domainName]: {
        ...prev[domainName],
        cdnCache: {
          ...prev[domainName].cdnCache,
          conditions: newConditions
        }
      }
    }))
  }

  // 更新條件
  const updateCondition = (domainName: string, conditionIndex: number, field: string, value: string) => {
    setEditingCdnCacheForms((prev: any) => {
      const newConditions = [...prev[domainName].cdnCache.conditions]
      newConditions[conditionIndex] = {
        ...newConditions[conditionIndex],
        [field]: value,
        ...(value === 'file_extension' ? { operator: 'eq' } : {})
      }
      return {
        ...prev,
        [domainName]: {
          ...prev[domainName],
          cdnCache: {
            ...prev[domainName].cdnCache,
            conditions: newConditions
          }
        }
      }
    })
  }

  // 移除條件
  const removeCondition = (domainName: string, conditionIndex: number) => {
    setEditingCdnCacheForms((prev: any) => {
      const newConditions = prev[domainName].cdnCache.conditions.filter((_: any, i: number) => i !== conditionIndex)
      // 如果移除後第一個條件有 logicalOperator，清除它
      if (newConditions.length > 0 && newConditions[0].logicalOperator) {
        newConditions[0].logicalOperator = null
      }
      return {
        ...prev,
        [domainName]: {
          ...prev[domainName],
          cdnCache: {
            ...prev[domainName].cdnCache,
            conditions: newConditions
          }
        }
      }
    })
  }

  const handleCdnCacheClose = (domain: any) => {
    setExpandedCdnCache((prev: any) => ({
      ...prev,
      [domain.name]: false,
    }))
    setEditingCdnCacheForms((prev: any) => ({
      ...prev,
      [domain.name]: {
        name: domain.name,
        zone: domain.zone,
        cdnCache: {
            browser_ttl: {
                mode: 'respect_origin',
                default: 1,
            },
            cache: true,
            edge_ttl: {
                mode: 'respect_origin',
                default: 0,
            },
            conditions: [],
        }
      }
    }))
  }

  const editCdnCacheEnabledOnChange = (value: string, domainName: string) => {
    setEditingCdnCacheForms((prev: any) => ({
      ...prev,
      [domainName]: { ...prev[domainName], cdnCache: { ...prev[domainName].cdnCache, cache: value } }
    }))
  }

  const editCdnCacheRuleOnChange = (value: string, domainName: string, type: string) => {
    if (type === 'edge') {
      const edgeTtl = { mode: value, default: 0 }
      setEditingCdnCacheForms((prev: any) => ({
        ...prev,
        [domainName]: { ...prev[domainName], cdnCache: { ...prev[domainName].cdnCache, edge_ttl: edgeTtl } }
      }))
    } else if (type === 'browser') {
      const browserTtl = { mode: value, default: 1 }
      setEditingCdnCacheForms((prev: any) => ({
        ...prev,
        [domainName]: { ...prev[domainName], cdnCache: { ...prev[domainName].cdnCache, browser_ttl: browserTtl } }
      }))
    }
  }

  const editCdnCacheTimeOnChange = (value: string, domainName: string, type: string) => {
    if (type === 'edge') {
      setEditingCdnCacheForms((prev: any) => ({
        ...prev,
        [domainName]: { ...prev[domainName], cdnCache: { ...prev[domainName].cdnCache, edge_ttl: { ...prev[domainName].cdnCache.edge_ttl, default: value } } }
      }))
    } else if (type === 'browser') {
      setEditingCdnCacheForms((prev: any) => ({
        ...prev,
        [domainName]: { ...prev[domainName], cdnCache: { ...prev[domainName].cdnCache, browser_ttl: { ...prev[domainName].cdnCache.browser_ttl, default: value } } }
      }))
    }
  }

  const handleCdnCacheSubmit = async (domainName: string) => {
    const { contract } = auth as any
    const currentForm = editingCdnCacheForms[domainName]
    setIsLoading(true)
    await updateCdnCacheRule({ contractNo: contract?.contractNo || null, ...currentForm })
    .then(() => {
      loadSettings()
      notifySuccess('CDN快取設定更新成功')
    })
    .catch((err: any) => {
      loadSettings()
      notifyError('CDN快取設定更新失敗')
    })
    .finally(async () => {
      // 關閉編輯表單
      setExpandedCdnCache((prev: any) => ({
        ...prev,
        [domainName]: false,
      }))
      // 清除該域名的編輯表單
      setEditingCdnCacheForms((prev: any) => {
        const newState = { ...prev }
        delete newState[domainName]
        return newState
      })
      await loadSettings()
      setIsLoading(false)
    })
  }

  // 處理全部清除
  const handlePurgeAll = async () => {
    if (!selectedPurgeZone) return
    const { contract } = auth as any
    setIsLoading(true)
    try {
      await purgeCache({
        contractNo: contract?.contractNo || null,
        zone: selectedPurgeZone,
        purge_everything: true
      })
      notifySuccess(`已成功提交 ${selectedPurgeZone} 的全部清除快取請求`)
      setPurgeAllDialogOpen(false)
    } catch (err) {
      notifyError('提交全部清除快取請求失敗')
    } finally {
      setIsLoading(false)
    }
  }

  // 處理自訂清除
  const handleCustomPurge = async () => {
    if (!selectedPurgeZone) return
    const { contract } = auth as any
    const values = purgeValues.split('\n').map(v => v.trim()).filter(v => v)
    
    if (values.length === 0) {
      notifyError('請輸入清除內容')
      return
    }

    setIsLoading(true)
    try {
      const payload: any = {
        contractNo: contract?.contractNo || null,
        zone: selectedPurgeZone,
      }

      if (purgeType === 'url') {
        payload.files = values
      } else {
        payload.hosts = values
      }

      await purgeCache(payload)
      notifySuccess(`已成功提交 ${selectedPurgeZone} 的自訂清除快取請求`)
      setCustomPurgeDialogOpen(false)
      setPurgeValues('')
    } catch (err) {
      notifyError('提交自訂清除快取請求失敗')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/cloudflare">Cloudflare Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-foreground font-medium">CDN 設定</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tighter">
          CDN加速<span className="text-brand-primary">管理</span>
        </h1>
        <p className="mt-2 text-muted-foreground">管理您的全球內容傳遞網路設定，優化網站加載速度和用戶體驗</p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">服務狀態</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {/* <div className="text-2xl font-bold text-green-600">正常運行</div>
            <p className="text-xs text-muted-foreground">99.9% 可用性</p> */}
            <div className="text-2xl text-muted-foreground">
              {(() => {
                const activeCount = zoneSettings.filter(zone => zone.status === 'active').length;
                const pendingCount = zoneSettings.filter(zone => zone.status === 'pending').length;
                return (
                  <div className="flex items-center gap-2">
                    {activeCount > 0 && (
                      <Badge variant="outline" className="text-green-600 border-green-600 flex items-center gap-2 px-3 py-2 text-sm">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        {activeCount}
                      </Badge>
                    )}
                    {pendingCount > 0 && (
                      <Badge variant="outline" className="text-yellow-600 border-yellow-600 flex items-center gap-2 px-3 py-2 text-sm">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        {pendingCount}
                      </Badge>
                    )}
                  </div>
                );
              })()}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {(() => {
                const activeCount = zoneSettings.filter(zone => zone.status === 'active').length;
                const totalCount = zoneSettings.length;
                const percentage = totalCount > 0 ? ((activeCount / totalCount) * 100).toFixed(1) : '0.0';
                return `${percentage}% 運行中`;
              })()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">防護域名</CardTitle>
            <Globe className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{zoneSettings.length}</div>
            <p className="text-xs text-muted-foreground">已配置主域名數量</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">今日總流量</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatTraffic(totalBytes).value}{formatTraffic(totalBytes).unit}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CDN Settings */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-brand-primary" />
              CDN 快取設定
            </CardTitle>
            <CardDescription>配置您的內容傳遞網路設定，包括域名管理和快取策略</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">

            {/* 搜尋匡 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜尋子域名..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* 快取設定 */}
            {
              paginatedDomains.map((domain: any, index: number) => (
                <div key={index} className="space-y-4">
                  <div 
                    className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => toggleCdnCache(domain)}
                  >
                    <div className="flex items-center gap-3">
                      {/* <div className="w-2 h-2 bg-green-500 rounded-full"></div> */}
                      <div>
                        <p className="font-medium">{domain.name}</p>
                        <p className="text-sm text-muted-foreground">子域名</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {expandedCdnCache[domain.name] ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </div>

                  {editingCdnCacheForms[domain.name]?.cdnCache && expandedCdnCache[domain.name] && (
                    <div className="p-4 border rounded-lg ml-4">
                      <div className="mb-4">
                        <h3 className="font-medium text-lg">快取設定</h3>
                        <p className="text-sm text-muted-foreground">選擇CDN快取策略</p>
                      </div>

                      {/* 條件設定 */}
                      <div className="pt-4 mb-4">
                        {
                          isReadOnly ? null : (
                            <div className="mb-3">
                              <h4 className="font-medium text-sm">當傳入要求符合...</h4>
                              <div className="flex items-center gap-2">
                                <p className="text-xs text-muted-foreground">設定快取規則的觸發條件（選用）</p>
                                {(!editingCdnCacheForms[domain.name]?.cdnCache?.conditions || editingCdnCacheForms[domain.name]?.cdnCache?.conditions.length === 0) && (
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => addCondition(domain.name)}
                                    className="gap-1 h-6 px-2 text-xs"
                                  >
                                    <Plus className="h-3 w-3" />
                                    加入欄位
                                  </Button>
                                )}
                              </div>
                            </div>                           
                          )
                        }

                        {/* 條件列表 */}
                        {editingCdnCacheForms[domain.name]?.cdnCache?.conditions && editingCdnCacheForms[domain.name]?.cdnCache?.conditions.length > 0 && (
                          <div className="space-y-4">
                            {/* 條件標題列 */}
                            <div className="grid grid-cols-12 gap-2 text-xs text-muted-foreground pl-4">
                              <div className="col-span-3">欄位</div>
                              <div className="col-span-3">運算子</div>
                              <div className="col-span-4">值</div>
                              <div className="col-span-2"></div>
                            </div>

                            {/* 將條件按 OR 分群 */}
                            {(() => {
                              const conditions = editingCdnCacheForms[domain.name]?.cdnCache?.conditions || []
                              console.log(conditions)
                              const groups: any[][] = []    // group為[[群組1], [群組2], [群組3], ...]的格式，每個小群組為And，大[]為OR
                              let currentGroup: any[] = []
                              
                              conditions.forEach((condition: any, index: number) => {
                                if (index === 0 || condition.logicalOperator === 'and') {
                                  currentGroup.push({ ...condition, originalIndex: index })
                                } else {
                                  // OR 開始新群組
                                  // 把 Current And 群組丟進group中
                                  if (currentGroup.length > 0) {
                                    groups.push(currentGroup)
                                  }
                                  // 清空 Current And 群組，把 Current 群組改成現在的 OR 條件
                                  currentGroup = [{ ...condition, originalIndex: index }]
                                }
                              })
                              // 最後一個條件，把 Current 群組丟進group中
                              if (currentGroup.length > 0) {
                                groups.push(currentGroup)
                              }

                              return groups.map((group, groupIndex) => (
                                <div key={groupIndex}>
                                  {/* OR 分隔標籤 */}
                                  {groupIndex > 0 && (
                                    <div className="flex items-center gap-2 pl-4 py-2">
                                      <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-0.5 rounded">
                                        或
                                      </span>
                                      <div className="flex-1 border-t border-dashed border-muted-foreground/30"></div>
                                    </div>
                                  )}
                                  
                                  {/* AND 群組 - 用左側線條連接 */}
                                  <div className="relative">
                                    {/* 左側連接線 */}
                                    {group.length > 1 && (
                                      <div className="absolute left-0 top-4 bottom-4 w-0.5 bg-blue-300 rounded-full"></div>
                                    )}
                                    
                                    <div className="space-y-0">
                                      {group.map((condition: any, indexInGroup: number) => (
                                        <div key={condition.originalIndex} className="relative">
                                          {/* AND 標籤 */}
                                          {indexInGroup > 0 && (
                                            <div className="flex items-center pl-4 py-1">
                                              <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                                                及
                                              </span>
                                            </div>
                                          )}
                                          
                                          <div className="grid grid-cols-12 gap-2 items-start pl-4 py-1">
                                            {/* 欄位選擇 */}
                                            <div className="col-span-3">
                                              <Select 
                                                value={condition.field} 
                                                onValueChange={(value) => updateCondition(domain.name, condition.originalIndex, 'field', value)}
                                                disabled={isReadOnly}
                                              >
                                                <SelectTrigger className="w-full">
                                                  <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  {cdnFieldTypes.map((type) => (
                                                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                                                  ))}
                                                </SelectContent>
                                              </Select>
                                            </div>

                                            {/* 運算子選擇 */}
                                            <div className="col-span-3">
                                              <Select 
                                                value={condition.operator} 
                                                onValueChange={(value) => updateCondition(domain.name, condition.originalIndex, 'operator', value)}
                                                disabled={isReadOnly}
                                              >
                                                <SelectTrigger className="w-full">
                                                  <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  {
                                                    condition.field === 'full_uri' ? 
                                                      fullUriOperators.map((op) => (
                                                        <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
                                                      )) 
                                                    :
                                                      fileExtensionOperators.map((op) => (
                                                        <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
                                                      ))
                                                  }
                                                </SelectContent>
                                              </Select>
                                            </div>

                                            {/* 值輸入 */}
                                            <div className="col-span-4">
                                              {condition.field === 'file_extension' && (condition.operator === 'in' || condition.operator === 'not_in') ? (
                                                <TagInput
                                                  value={condition.value}
                                                  onChange={(value) => updateCondition(domain.name, condition.originalIndex, 'value', value)}
                                                  placeholder="輸入副檔名後按 Enter"
                                                  disabled={isReadOnly}
                                                />
                                              ) : (
                                                <>
                                                  <Input 
                                                    value={condition.value}
                                                    onChange={(e) => updateCondition(domain.name, condition.originalIndex, 'value', e.target.value)}
                                                    disabled={isReadOnly}
                                                  />
                                                  <p className="text-xs text-muted-foreground mt-1 truncate">
                                                    {getValuePlaceholder(condition.field, condition.operator)}
                                                  </p>
                                                </>
                                              )}
                                            </div>

                                            {/* 及/或按鈕 + 刪除 */}
                                            {
                                              isReadOnly ? null : (
                                                <div className="col-span-2 flex items-center gap-1">
                                                  <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-9 px-2"
                                                    onClick={() => addCondition(domain.name, 'and', condition.originalIndex)}
                                                  >
                                                    及
                                                  </Button>
                                                  <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-9 px-2"
                                                    onClick={() => addCondition(domain.name, 'or', condition.originalIndex)}
                                                  >
                                                    或
                                                  </Button>
                                                  <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-9 px-2 text-red-500 hover:text-red-700 hover:bg-red-100"
                                                    onClick={() => removeCondition(domain.name, condition.originalIndex)}
                                                  >
                                                    <X className="h-4 w-4" />
                                                  </Button>
                                                </div>                                                
                                              )
                                            }
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              ))
                            })()}
                          </div>
                        )}
                      </div>

                      <RadioGroup value={editingCdnCacheForms[domain.name]?.cdnCache?.cache?.toString()} onValueChange={(value) => editCdnCacheEnabledOnChange(value, domain.name)} className="space-y-3 mb-6 mt-8" disabled={isReadOnly}>
                        <div className="flex items-center space-x-2 border-t pt-8">
                          <RadioGroupItem value="true" id={`enable-${domain.name}`} />
                          <Label htmlFor={`enable-${domain.name}`} className="font-medium">
                            開啟快取
                          </Label>
                          <span className="text-sm text-muted-foreground ml-2">(預設) 啟用CDN快取以提升網站載入速度</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="false" id={`skip-${domain.name}`} />
                          <Label htmlFor={`skip-${domain.name}`} className="font-medium">
                            略過快取
                          </Label>
                          <span className="text-sm text-muted-foreground ml-2">直接從源站獲取內容，不使用CDN快取</span>
                        </div>
                      </RadioGroup>
                         
                      {/* 邊緣TTL規則 */}
                      {editingCdnCacheForms[domain.name].cdnCache?.cache === 'true' || editingCdnCacheForms[domain.name].cdnCache?.cache === true ? (
                        <div className="border-t pt-4">
                          <div className="mb-4">
                            <h4 className="font-medium">邊緣TTL規則 （選用）</h4>
                            <p className="text-sm text-muted-foreground">
                              指定 Cloudflare 是否應快取回應以及快取的時間長度，這取決於原始伺服器回應中是否存在快取控制標頭。
                            </p>
                          </div>
                          <RadioGroup value={editingCdnCacheForms[domain.name]?.cdnCache?.edge_ttl?.mode} onValueChange={(value) => editCdnCacheRuleOnChange(value, domain.name, 'edge')} className="space-y-4" disabled={isReadOnly}>
                            <div className="flex items-start space-x-2">
                              <RadioGroupItem value="bypass_by_default" id={`bypass_by_default-edge-${domain.name}`} className="mt-1" />
                              <div className="flex-1">
                                <Label htmlFor={`bypass_by_default-edge-${domain.name}`} className="font-medium">
                                  如果快取控制標頭存在請予以使用；如果沒有，請略過快取
                                </Label>
                                <p className="text-sm text-muted-foreground mt-1">
                                  優先使用源站的Cache-Control標頭，沒有標頭時不進行快取
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start space-x-2">
                              <RadioGroupItem value="respect_origin" id={`respect_origin-edge-${domain.name}`} className="mt-1" />
                              <div className="flex-1">
                                <Label htmlFor={`respect_origin-edge-${domain.name}`} className="font-medium">
                                  使用Cache-Control標頭(如果存在)；如果不存在，則使用快取要求和Cloudflare 的預設 TTL
                                  作為回應狀態
                                </Label>
                                <p className="text-sm text-muted-foreground mt-1">使用源站標頭或系統預設TTL設定</p>
                              </div>
                            </div>
                            <div className="flex items-start space-x-2">
                              <RadioGroupItem value="override_origin" id={`override_origin-edge-${domain.name}`} className="mt-1" />
                              <div className="flex-1">
                                <Label htmlFor={`override_origin-edge-${domain.name}`} className="font-medium">
                                  忽略快取控制標頭並使用此 TTL
                                </Label>
                                <p className="text-sm text-muted-foreground mt-1">忽略所有快取標頭，使用自定義TTL設定</p>
                                {editingCdnCacheForms[domain.name]?.cdnCache?.edge_ttl?.mode === "override_origin" && (
                                  <div className="mt-3">
                                    <Label htmlFor="ttl-select" className="text-sm font-medium">
                                      輸入存留時間(TTL)
                                    </Label>
                                    <Select value={editingCdnCacheForms[domain.name]?.cdnCache?.edge_ttl?.default.toString()} onValueChange={(value) => editCdnCacheTimeOnChange(value, domain.name, 'edge')}>
                                      <SelectTrigger className="w-48 mt-1">
                                        <SelectValue placeholder="選擇TTL時間" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {
                                          edgeTtlOptions.map((item) => (
                                            <SelectItem value={item.value.toString()} key={item.value}>{item.label}</SelectItem>
                                          ))
                                        }
                                      </SelectContent>
                                    </Select>
                                  </div>
                                )}
                              </div>
                            </div>
                          </RadioGroup>
                        </div>
                        ): null
                      }
        
                      {/* 瀏覽器TTL規則 */}
                      {editingCdnCacheForms[domain.name].cdnCache?.cache === 'true' || editingCdnCacheForms[domain.name].cdnCache?.cache === true ? (
                        <div className="border-t pt-4 mt-4">
                          <div className="mb-4">
                            <h4 className="font-medium">瀏覽器TTL規則 （選用）</h4>
                            <p className="text-sm text-muted-foreground">
                              指定用戶端瀏覽器應快取回應的時間長度。Cloudflare 快取清除用戶端瀏覽器上快取的內容，因此高瀏覽器
                              TTL 可能會導致顯示逾期內容。
                            </p>
                          </div>
                          <RadioGroup value={editingCdnCacheForms[domain.name]?.cdnCache?.browser_ttl?.mode} onValueChange={(value) => editCdnCacheRuleOnChange(value, domain.name, 'browser')} className="space-y-4" disabled={isReadOnly}>
                            <div className="flex items-start space-x-2">
                              <RadioGroupItem value="bypass" id={`bypass-browser-${domain.name}`} className="mt-1" />
                                <div className="flex-1">
                                <Label htmlFor={`bypass-browser-${domain.name}`} className="font-medium">
                                  略過快取
                                </Label>
                                <p className="text-sm text-muted-foreground mt-1">不在瀏覽器中快取內容</p>
                              </div>
                            </div>
                             <div className="flex items-start space-x-2">
                               <RadioGroupItem value="respect_origin" id={`respect_origin-browser-${domain.name}`} className="mt-1" />
                               <div className="flex-1">
                                 <Label htmlFor={`respect_origin-browser-${domain.name}`} className="font-medium">
                                   採用原點 TTL
                                 </Label>
                                 <p className="text-sm text-muted-foreground mt-1">使用源站設定的快取時間</p>
                               </div>
                             </div>
                             <div className="flex items-start space-x-2">
                               <RadioGroupItem value="override_origin" id={`override_origin-browser-${domain.name}`} className="mt-1" />
                               <div className="flex-1">
                                 <Label htmlFor={`override_origin-browser-${domain.name}`} className="font-medium">
                                   覆寫原點並使用此 TTL
                                 </Label>
                                 <p className="text-sm text-muted-foreground mt-1">忽略源站設定，使用自定義瀏覽器快取時間</p>
                                {editingCdnCacheForms[domain.name]?.cdnCache?.browser_ttl?.mode === "override_origin" && (
                                  <div className="mt-3">
                                    <Label htmlFor="browser-ttl-select" className="text-sm font-medium">
                                      輸入存留時間(TTL)
                                    </Label>
                                    <Select value={editingCdnCacheForms[domain.name]?.cdnCache?.browser_ttl?.default.toString()} onValueChange={(value) => editCdnCacheTimeOnChange(value, domain.name, 'browser')}>
                                      <SelectTrigger className="w-48 mt-1">
                                        <SelectValue placeholder="選擇TTL時間" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {
                                          browserTtlOptions.map((item) => (
                                            <SelectItem value={item.value.toString()} key={item.value}>{item.label}</SelectItem>
                                          ))
                                        }
                                      </SelectContent>
                                    </Select>
                                  </div>
                                )}
                              </div>
                            </div>
                          </RadioGroup>
                        </div>
                        ) : null
                      }
        
                      <div className="mt-6 pt-4 border-t">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col gap-2">
                            <div className="text-sm font-medium text-foreground">當前設定</div>
                            <div className="flex flex-wrap gap-2">
                              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                {domain.cdnCache.cache === 'false' || domain.cdnCache.cache === false ? "略過快取" : "開啟快取"}
                              </span>
                              {domain.cdnCache.cache === 'false' || domain.cdnCache.cache === false ? null 
                              : (
                                <>
                                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                  {domain.cdnCache?.edge_ttl?.mode === "bypass_by_default" && "使用快取控制標頭"}
                                  {domain.cdnCache?.edge_ttl?.mode === "respect_origin" && "使用預設TTL"}
                                  {domain.cdnCache?.edge_ttl?.mode === "override_origin" && `自定義TTL: ${getTtlLabel(domain.cdnCache?.edge_ttl?.default, edgeTtlOptions)}`}
                                  {!domain.cdnCache?.edge_ttl?.mode && "使用預設TTL"}
                                </span>
                                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                  {domain.cdnCache?.browser_ttl?.mode === "bypass" && "瀏覽器略過快取"}
                                  {domain.cdnCache?.browser_ttl?.mode === "respect_origin" && "瀏覽器採用原點TTL"}
                                  {domain.cdnCache?.browser_ttl?.mode === "override_origin" && `瀏覽器自定義TTL: ${getTtlLabel(domain.cdnCache?.browser_ttl?.default, browserTtlOptions)}`}
                                  {!domain.cdnCache?.browser_ttl?.mode && "瀏覽器採用原點TTL"}
                                </span>
                                </>
                              )
                              }
                            </div>
                          </div>
                          <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleCdnCacheClose(domain)}>
                                取消
                              </Button>
                              {
                                isReadOnly ? null : (
                                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => handleCdnCacheSubmit(domain.name)}>
                                    套用設定
                                  </Button>                               
                                )
                              }
                            </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            }

            {/* 分頁控制 */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  顯示第 {(currentPage - 1) * itemsPerPage + 1} 至 {Math.min(currentPage * itemsPerPage, filteredDomains.length)} 筆，共 {filteredDomains.length} 筆
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    上一頁
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      // 只顯示當前頁面及其前後兩頁，以及第一頁和最後一頁
                      if (
                        page === 1 || 
                        page === totalPages || 
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="w-8 h-8 p-0"
                          >
                            {page}
                          </Button>
                        )
                      } else if (
                        page === currentPage - 2 || 
                        page === currentPage + 2
                      ) {
                        return <span key={page} className="px-1 text-muted-foreground">...</span>
                      }
                      return null
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="gap-1"
                  >
                    下一頁
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* CDN 清除快取 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-brand-primary" />
              CDN 清除快取
            </CardTitle>
            <CardDescription>立即清除快取檔案，使 Cloudflare 向您的網頁伺服器取得這些檔案的最新版本。您可以選擇性清除檔案或一次清除全部。</CardDescription>
            <CardDescription>備註:清除快取可能會暫時降低網站效能，並提高原始伺服器負載。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 域名列表 */}
            {
              zoneSettings.map((zone: ZoneSetting, index: number) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <p className="font-medium text-foreground">{zone.name}</p>
                      <p className="text-sm text-muted-foreground">主域名</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setSelectedPurgeZone(zone.name)
                        setCustomPurgeDialogOpen(true)
                        setPurgeValues('')
                      }}
                    >
                      自訂清除
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => {
                        setSelectedPurgeZone(zone.name)
                        setPurgeAllDialogOpen(true)
                        setPurgeValues('')
                      }}
                    >
                      清除全部
                    </Button>
                  </div>
                </div>
              ))
            }

            {/* 清除全部 Dialog */}
            <Dialog open={purgeAllDialogOpen} onOpenChange={setPurgeAllDialogOpen}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>確認清除全部 - {selectedPurgeZone}</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-sm text-foreground">
                    清除所有快取的檔案。清除快取可能會暫時減緩網站速度。
                  </p>
                </div>
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button variant="outline" onClick={() => setPurgeAllDialogOpen(false)}>
                    取消
                  </Button>
                  <Button variant="destructive" onClick={handlePurgeAll}>
                    清除全部
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* 自訂清除 Dialog */}
            <Dialog open={customPurgeDialogOpen} onOpenChange={setCustomPurgeDialogOpen}>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>自訂清除 - {selectedPurgeZone}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">清除依據:</Label>
                    <RadioGroup 
                      value={purgeType} 
                      onValueChange={(val: any) => setPurgeType(val)}
                      className="space-y-3"
                    >
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="url" id="purge-url" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="purge-url" className="font-medium cursor-pointer">
                            URL
                          </Label>
                          <span className="text-sm text-muted-foreground ml-1">
                            :清除 Cloudflare 快取中與 URL 完全相符的資產，但這些
                          </span>
                          <a 
                            href="https://developers.cloudflare.com/cache/how-to/purge-cache/purge-by-single-file/#:~:text=A%20single%2Dfile,their%20matching%20values" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-sm text-blue-600 hover:underline ml-1"
                          >
                            單一檔案清除例外
                          </a>
                          <span className="text-sm text-muted-foreground ml-1">不在此限</span>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="hostname" id="purge-hostname" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="purge-hostname" className="font-medium cursor-pointer">
                            主機名稱
                          </Label>
                          <span className="text-sm text-muted-foreground ml-1">
                            :任何資產，只要 URL 的主機名稱符合指定的名稱之一，即會從快取中清除。
                          </span>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  {purgeType === 'url' && (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        您必須指定檔案的完整路徑。目前單一 URL 清除並不支援萬用字元。您可以一次清除最多 30 個 URL。
                      </p>
                      <div className="text-sm font-medium space-y-1">
                        <p>請每一行寫一個 URL。</p>
                        <p>例如:</p>
                        <p className="font-bold">https://www.{selectedPurgeZone || 'example.com'}</p>
                        <p className="font-bold">https://www.{selectedPurgeZone || 'example.com'}/cat.jpg</p>
                      </div>
                      <Textarea 
                        placeholder="請輸入 URL..."
                        value={purgeValues}
                        onChange={(e) => setPurgeValues(e.target.value)}
                        className="min-h-[150px]"
                      />
                    </div>
                  )}

                  {purgeType === 'hostname' && (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        您可以一次清除最多 100 個主機名稱。
                      </p>
                      <div className="text-sm font-medium space-y-1">
                        <p>請每一行寫一個 URL。</p>
                        <p>例如:</p>
                        <p className="font-bold">www.{selectedPurgeZone || 'example.com'}</p>
                        <p className="font-bold">blog.{selectedPurgeZone || 'example.com'}</p>
                      </div>
                      <Textarea 
                        placeholder="請輸入主機名稱..."
                        value={purgeValues}
                        onChange={(e) => setPurgeValues(e.target.value)}
                        className="min-h-[150px]"
                      />
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setCustomPurgeDialogOpen(false)}>
                    取消
                  </Button>
                  <Button 
                    disabled={!purgeValues.trim()} 
                    onClick={handleCustomPurge}
                    className={purgeValues.trim() ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}
                  >
                    清除
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>


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
    </div>
  )
}

// 標籤輸入組件 - 可手動輸入多個值
interface TagInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean | false
}

const TagInput = ({ value, onChange, placeholder, disabled = false }: TagInputProps) => {
  const [inputValue, setInputValue] = React.useState('')
  const [error, setError] = React.useState('')
  
  // 將逗號分隔的字串轉換為陣列
  const tags = value ? value.split(',').map(v => v.trim()).filter(v => v) : []

  // 驗證副檔名是否有效 - 只允許英文字母和數字
  const isValidExtension = (val: string): boolean => {
    if (!val) return true
    // 只允許 a-z, A-Z, 0-9
    return /^[a-zA-Z0-9]+$/.test(val)
  }

  // 檢查是否包含無效字元
  const hasInvalidChar = (val: string): boolean => {
    if (!val) return false
    // 檢查是否包含：點、特殊符號、中文、注音符號等
    return !isValidExtension(val)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      // 只有在輸入有效時才新增
      if (inputValue.trim() && isValidExtension(inputValue.trim())) {
        addTag()
      }
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      // 如果輸入框為空且按下 Backspace，刪除最後一個標籤
      const newTags = tags.slice(0, -1)
      onChange(newTags.join(','))
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInputValue(val)
    
    // 如果包含無效字元，顯示錯誤訊息
    if (hasInvalidChar(val)) {
      setError('輸入有效的副檔名')
    } else {
      setError('')
    }
  }

  const addTag = () => {
    const trimmedValue = inputValue.trim()
    
    // 驗證是否為有效的副檔名
    if (!isValidExtension(trimmedValue)) {
      setError('輸入有效的副檔名')
      return
    }
    
    setError('')
    
    if (trimmedValue && !tags.includes(trimmedValue)) {
      const newTags = [...tags, trimmedValue]
      onChange(newTags.join(','))
      setInputValue('')
    } else {
      setInputValue('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove)
    onChange(newTags.join(','))
  }

  return (
    <div className="space-y-1">
      <div className="flex min-h-10 w-full flex-wrap items-center gap-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        {tags.map((tag, index) => (
          <Badge 
            key={index} 
            variant="secondary"
            className="flex items-center gap-1 px-2 py-0.5 text-xs"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-0.5 hover:text-red-500"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[80px] bg-transparent outline-none placeholder:text-muted-foreground"
          disabled={disabled}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        例如 media type = mp3
      </p>
      {error && (
        <p className="text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  )
}

export default function CDNManagePageWrapper() {
  return (
    // <RoleGuard allowedRoles={['user']}>
    //   <CDNManagePage />
    // </RoleGuard>
    <CDNManagePage />
  )
}