"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { Globe, Settings, CheckCircle, Copy, Check, ChevronDown, ChevronUp, Trash2, Upload, Download, Activity, AlertCircle, AlertTriangle, Search, MessageSquare } from 'lucide-react'
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { LoadingOverlay } from '@/components/ui/loading-overlay'
import { RoleGuard } from "@/components/role-guard"
import { RingLoader } from 'react-spinners'
import authenticator from "@/app/util/authenticator"
import { notifyError, notifySuccess } from "@/app/util/notify"
import { 
  getZonesByContractNo,
  getDnsByContractNo,
  createZone,
  deleteZone,
  createDnsRecord,
  updateDnsRecord,
  deleteDnsRecord,
  getCertificateByContractNo,
  deleteCustomCertificate,
  uploadCustomCertificate,
  exportZoneSubdomains,
  importZoneSubdomains,
} from "@/app/routes/cloudflare"

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

interface DnsSetting {
  id: string
  name: string
  type: string
  content: string
  proxied: boolean
  ttl: string | number
  zone: string
  comment?: string
  tags?: string[]
}

function DNSSettingsPage() {
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
  //     if (auth.maintainer && auth?.contract?.module?.includes('dns')) return
  //     if (notPermission || !auth?.contract?.module?.includes('dns')) {
  //       router.push('/dashboard')
  //     }
  //   }
  // }, [auth, notPermission, router])

  const [zoneSettings, setZoneSettings] = useState<ZoneSetting[]>([])
  const [zoneInput, setZoneInput] = useState("")
  const [isZoneCreateOpen, setIsZoneCreateOpen] = useState(false)
  const [expandedTxtRecords, setExpandedTxtRecords] = useState<any>({})
  const [isZoneDeleteConfirmOpen, setIsZoneDeleteConfirmOpen] = useState(false)
  const [deleteZoneName, setDeleteZoneName] = useState("")
  const [zoneError, setZoneError] = useState("")
  const [domainError, setDomainError] = useState("")
  const [dnsSetupMethod, setDnsSetupMethod] = useState<'quick_scan' | 'manual'>('quick_scan')

  const [domainSettings, setDomainSettings] = useState<DnsSetting[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isSearchVisible, setIsSearchVisible] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 50

  const filteredDomains = domainSettings.filter((domain) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      domain.name.toLowerCase().includes(searchLower) ||
      domain.content.toLowerCase().includes(searchLower) ||
      (domain.comment && domain.comment.toLowerCase().includes(searchLower)) ||
      (domain.type && domain.type.toLowerCase().includes(searchLower)) ||
      (domain.tags && domain.tags.some(tag => tag.toLowerCase().includes(searchLower)))
    );
  });

  const totalPages = Math.ceil(filteredDomains.length / itemsPerPage);
  const paginatedDomains = filteredDomains.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);
  const [creatingDomainForm, setCreatingDomainForm] = useState<any>({ name: '', type: "A", content: '', proxied: false, ttl: 1, comment: '', tags: [] })
  const [editingDomainForms, setEditingDomainForms] = useState<any>({})
  const [expandedEditDomainForms, setExpandedEditDomainForms] = useState<any>({})
  const [isSubdomainCreateOpen, setIsSubdomainCreateOpen] = useState(false)
  const [isSubdomainDeleteConfirmOpen, setIsSubdomainDeleteConfirmOpen] = useState(false)
  const [deleteSubdomain, setDeleteSubdomain] = useState('')
  const [isSubdomainInfoOpen, setIsSubdomainInfoOpen] = useState(false)
  const dnsRecordTypes = ["A", "CNAME", "AAAA"]
  const [tagInput, setTagInput] = useState('')

  // 匯入匯出相關狀態
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [importProxyEnabled, setImportProxyEnabled] = useState(false)
  const [importFile, setImportFile] = useState<any>({})
  const [isDragging, setIsDragging] = useState(false)
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [exportSelectedZones, setExportSelectedZones] = useState<string[]>([])
  const [importSelectedZone, setImportSelectedZone] = useState("")
  
  const [copiedField, setCopiedField] = useState("")
  const [contentError, setContentError] = useState("")
  const [selectedZone, setSelectedZone] = useState("")
  
  const [certificateSettings, setCertificateSettings] = useState([])
  const [expandedCertificateDetails, setExpandedCertificateDetails] = useState<any>({})
  const [isUploadCertificateOpen, setIsUploadCertificateOpen] = useState(false)
  const [uploadCertificateForm, setUploadCertificateForm] = useState<any>({})
  const [isDeleteCertificateOpen, setIsDeleteCertificateOpen] = useState(false)
  const [selectedCertificate, setSelectedCertificate] = useState<any>(null)

  const [totalBytes, setTotalBytes] = useState(0)

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

  const [isLoading, setIsLoading] = useState(false)
  

  const ttlToChinese = (ttl: number | string): string => {
    if (ttl === 1 || ttl === '1' || ttl === "Auto") return "自動"
    if (typeof ttl === "string") return ttl
    
    const seconds = ttl
    if (seconds < 60) return `${seconds}秒`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}分鐘`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}小時`
    return `${Math.floor(seconds / 86400)}天`
  }

  const ttlOptions = [
    { value: 1, label: "自動" },
    { value: 30, label: "30秒" },
    { value: 60, label: "1分鐘" },
    { value: 120, label: "2分鐘" },
    { value: 300, label: "5分鐘" },
    { value: 600, label: "10分鐘" },
    { value: 900, label: "15分鐘" },
    { value: 1800, label: "30分鐘" },
    { value: 3600, label: "1小時" },
    { value: 7200, label: "2小時" },
    { value: 18000, label: "5小時" },
    { value: 43200, label: "12小時" },
    { value: 86400, label: "1天" }
  ]

  // 域名格式驗證函數
  const validateDomain = (domain: string) => {
    const trimmedDomain = domain.trim()
    if (!trimmedDomain) return { isValid: false, message: "域名不能為空" }
    if (trimmedDomain.length > 253) return { isValid: false, message: "域名長度不能超過253個字符" }
    if (trimmedDomain.startsWith('http://') || trimmedDomain.startsWith('https://')) return { isValid: false, message: "請勿包含協議前綴（http:// 或 https://）" }
    if (trimmedDomain.includes('/')) return { isValid: false, message: "域名不能包含路徑" }
    if (trimmedDomain.includes(':')) return { isValid: false, message: "域名不能包含端口號" }
    const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/
    if (!domainRegex.test(trimmedDomain)) return { isValid: false, message: "域名格式不正確，請輸入有效的域名" }
    return { isValid: true, message: "" }
  }

  const validateSubDomain = (domain: string) => {
    const trimmedDomain = domain.trim()
    if (!trimmedDomain) return { isValid: false, message: "域名不能為空" }
    if (trimmedDomain.length > 253) return { isValid: false, message: "域名長度不能超過253個字符" }
    if (trimmedDomain.startsWith('http://') || trimmedDomain.startsWith('https://')) return { isValid: false, message: "請勿包含協議前綴（http:// 或 https://）" }
    if (trimmedDomain.includes('/')) return { isValid: false, message: "域名不能包含路徑" }
    if (trimmedDomain.includes(':')) return { isValid: false, message: "域名不能包含端口號" }
    return { isValid: true, message: "" }
  }

  // IPv4 驗證函數
  const validateIPv4 = (ip: string) => {
    const ipv4Regex = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
    return ipv4Regex.test(ip);
  }

  // IPv6 驗證函數
  const validateIPv6 = (ip: string) => {
    // IPv6正則表達式，支持完整格式、壓縮格式和混合格式
    const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
    
    // 簡化的IPv6驗證，支持壓縮表示法
    if (ip === '::') return true; // 全零地址
    if (ip === '::1') return true; // 本地回環地址
    
    // 檢查基本格式
    if (!/^[0-9a-fA-F:]+$/.test(ip)) return false;
    
    // 檢查雙冒號只能出現一次
    const doubleColonCount = (ip.match(/::/g) || []).length;
    if (doubleColonCount > 1) return false;
    
    // 分割地址段
    const parts = ip.split('::');
    if (parts.length === 2) {
      // 包含壓縮表示法
      const leftParts = parts[0] ? parts[0].split(':') : [];
      const rightParts = parts[1] ? parts[1].split(':') : [];
      const totalParts = leftParts.length + rightParts.length;
      
      if (totalParts > 7) return false;
      
      // 驗證每個部分
      return [...leftParts, ...rightParts].every(part => 
        part === '' || (part.length <= 4 && /^[0-9a-fA-F]+$/.test(part))
      );
    } else {
      // 完整格式
      const segments = ip.split(':');
      if (segments.length !== 8) return false;
      
      return segments.every(segment => 
        segment.length <= 4 && /^[0-9a-fA-F]+$/.test(segment)
      );
    }
  }

  const validateIp = (ip: string) => {
    const trimmedIp = ip.trim()
    if (!trimmedIp) return { isValid: false, message: "IP不能為空" }
    
    // 檢查是否包含 CIDR 格式 (包含 /)
    if (trimmedIp.includes('/')) {
      return { isValid: false, message: "IPv4格式不正確，請輸入有效的IPv4地址" }
    } else {
      // 單個IP地址的驗證
      if (validateIPv4(trimmedIp)) {
        return { isValid: true, message: "" }
      } else {
        return { isValid: false, message: "IPv4格式不正確，請輸入有效的IPv4地址" }
      }
    }
  }

  const validateIPv6Ip = (ip: string) => {
    const trimmedIp = ip.trim()
    if (!trimmedIp) return { isValid: false, message: "IP不能為空" }
    
    // 檢查是否包含 CIDR 格式 (包含 /)
    if (trimmedIp.includes('/')) {
      return { isValid: false, message: "IPv6格式不正確，請輸入有效的IPv4地址" }
    } else {
      // 單個IP地址的驗證
      if (validateIPv6(trimmedIp)) {
        return { isValid: true, message: "" }
      } else {
        return { isValid: false, message: "IPv6格式不正確，請輸入有效的IPv6地址" }
      }
    }
  }

  const validateCname = (cname: string) => {
    const trimmedCname = cname.trim()
    if (!trimmedCname) return { isValid: false, message: "CNAME不能為空" }
    const hasEnglishLetters = /[a-zA-Z]/.test(trimmedCname)
    if (!hasEnglishLetters) return { isValid: false, message: "CNAME格式錯誤" }
    return { isValid: true, message: "" }
  }

  const validateIpRange = (ipRange: string) => {
    // 重複使用統一的IP驗證邏輯，支援IPv4和IPv6
    return validateIp(ipRange)
  }


  // 檔案讀取功能
  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        resolve(content)
      }
      reader.onerror = () => reject(new Error('檔案讀取失敗'))
      reader.readAsText(file)
    })
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

      const dnsResp = await getDnsByContractNo(contract?.contractNo || null)
      const dnsRecords = dnsResp.data || []
      let dnsSettings = []
      for (let dnsRecord of dnsRecords) {
        dnsSettings.push({
          id: dnsRecord.id,    // cloudflare上dns record的id
          name: dnsRecord.name,
          type: dnsRecord.type,
          content: dnsRecord.content,
          proxied: dnsRecord.proxied,
          ttl: dnsRecord.ttl,
          zone: dnsRecord.zone,
          comment: dnsRecord.comment || '',
          tags: dnsRecord.tags || []
        })
      }
      setDomainSettings(dnsSettings);

      const certificateResp = await getCertificateByContractNo(contract?.contractNo || null)
      const certificateSettings = certificateResp.data || []
      setCertificateSettings(certificateSettings)

    } catch (error: any) {
      console.log(error)
      if (error.response?.data?.message && error.response?.data?.message === 'Unauthorized') {
        notifyError('Unauthorized')
      } else {
        notifyError('取得設定失敗')
      }
    } 
  }

  ////////////////////////////////
  // 主域名建立
  ////////////////////////////////

  const handleZoneInputChange = (value: string) => {
    setZoneInput(value)
    if (!value.trim()) {
      setZoneError("")
      return
    }
    const validation = validateDomain(value)
    setZoneError(validation.isValid ? "" : validation.message)
  }

  const handleCreateZoneOpen = (open: boolean) => {
    setIsZoneCreateOpen(open)
    if (!open) {
      setZoneInput('')
      setZoneError('')
      setDnsSetupMethod('quick_scan')
    }
  }

  const handleZoneSubmit = async () => {
    const { contract } = auth as any
    if (!zoneInput.trim()) {
      notifyError("請輸入主域名")
    } else {
      const zoneName = zoneInput.trim()
      setIsLoading(true)
      setIsZoneCreateOpen(false)
      await createZone({ contractNo: contract?.contractNo || null, zone: zoneName, dnsSetupMethod: dnsSetupMethod })
      .then(() => {
        loadSettings()
        notifySuccess("主域名設定成功")
      })
      .catch((error: any) => {
        console.log(error)
        if (error.response?.data?.message && error.response?.data?.message === 'Unauthorized') {
          notifyError('Unauthorized')
        } else {
          notifyError('主域名設定失敗')
        }
      })
      .finally(() => {
        setZoneInput('')
        setZoneError('')
        setIsLoading(false)
      })
    }
  }

  const handleDeleteZoneConfirmOpen = (domainName: string) => {
    setDeleteZoneName(domainName)
    setIsZoneDeleteConfirmOpen(true)
  }

  const handleDeleteZoneSubmit = async () => {
    const { contract } = auth as any
    setIsLoading(true)
    setIsZoneDeleteConfirmOpen(false)
    await deleteZone({ contractNo: contract?.contractNo || null, zone: deleteZoneName })
    .then(() => {
      loadSettings()
      notifySuccess("主域名刪除成功")
    })
    .catch((error: any) => {
      console.log(error)
      if (error.response?.data?.message && error.response?.data?.message === 'Unauthorized') {
        notifyError('Unauthorized')
      } else {
        notifyError('主域名刪除失敗')
      }
    })
    .finally(() => {
      setDeleteZoneName('')
      setIsLoading(false)
    })
  }


  ////////////////////////////////
  // 子域名建立
  ////////////////////////////////

  const handleCreateSubdomainOpen = (open: boolean) => {
    setIsSubdomainCreateOpen(open)
    setCreatingDomainForm({ name: '', type: 'A', content: '', proxied: true, ttl: 1, comment: '' })
    setDomainError('')
    setContentError('')
  }

  const createSubdomainDnsOnChange = (value: string) => {
    setCreatingDomainForm((prev: any) => ({ ...prev, name: value }))
    const validation = validateSubDomain(value)
    setDomainError(validation.isValid ? '' : validation.message)
  }

  const createSubdomainContentOnChange = (value: string) => {
    setCreatingDomainForm((prev: any) => ({ ...prev, content: value }))
    if (creatingDomainForm?.type === 'A') {
      const validation = validateIp(value)
      setContentError(validation.isValid ? '' : validation.message)
    } else if (creatingDomainForm?.type === 'CNAME') {
      const validation = validateCname(value)
      setContentError(validation.isValid ? '' : validation.message)
    } else if (creatingDomainForm?.type === 'AAAA') {
      const validation = validateIPv6Ip(value)
      setContentError(validation.isValid ? '' : validation.message)
    } else {
      setContentError('')
    }
  }

  const createSubdomainTypeOnChange = (value: string) => {
    setCreatingDomainForm((prev: any) => ({ ...prev, type: value, content: '' }))
    setContentError('')
  }

  const handleCreateSubdomainSubmit = async () => {
    const { contract } = auth as any
    if (!creatingDomainForm.name?.trim()) {
      notifyError("請輸入子域名")
    } else if (!creatingDomainForm.zone) {
      notifyError("請選擇主域名")
    } else if (!creatingDomainForm.type) {
      notifyError("請選擇子域名類型")
    } else if (!creatingDomainForm.content) {
      notifyError("請輸入子域名內容")
    } else {
      setIsLoading(true)
      setIsSubdomainCreateOpen(false)
      const newDnsRecord = {
        contractNo: contract?.contractNo || null,
        name: `${creatingDomainForm.name.trim()}.${creatingDomainForm.zone}`,
        type: creatingDomainForm.type || 'A',
        content: creatingDomainForm.content || '',
        proxied: creatingDomainForm.proxied !== undefined ? creatingDomainForm.proxied : true,
        comment: creatingDomainForm.comment || '',
        ttl: creatingDomainForm.ttl || 1,
        zone: creatingDomainForm.zone
      }
      await createDnsRecord(newDnsRecord)
      .then(() => {
        loadSettings()
        notifySuccess("子域名設定成功")
      })
      .catch((error: any) => {
        console.log(error)
        if (error.response?.data?.message && error.response?.data?.message === 'Unauthorized') {
          notifyError('Unauthorized')
        } else {
          notifyError('子域名設定失敗')
        }
      })
      .finally(() => {
        handleCreateSubdomainOpen(false)
        setIsLoading(false)
      })
    }
  }

  ////////////////////////////////
  // 子域名編輯
  ////////////////////////////////

  const handleEditSubdomainOpen = (domainId: string) => {
    setExpandedEditDomainForms((prev: any) => ({ ...prev, [domainId]: !prev[domainId] }))
    if (!expandedEditDomainForms[domainId]) {
      const domain = domainSettings.find((d) => d.id === domainId)
      if (domain) {
        setEditingDomainForms((prev: any) => ({
          ...prev,
          [domainId]: {
            id: domain.id,
            name: domain.name.replace(`.${domain.zone}` || '', ''),
            originalName: domain.name,
            type: domain.type || "A",
            content: domain.content || "",
            proxied: domain.proxied !== undefined ? domain.proxied : true,
            ttl: typeof domain.ttl === 'number' ? domain.ttl : 1,
            comment: domain.comment || '',
            tags: domain.tags || [],
            zone: domain.zone,
            contentError: '',
            domainError: '',
          }
        }))
      }
    }
    setTagInput('')
  }

  const editSubdomainDnsOnChange = (value: string, domainId: string) => {
    setEditingDomainForms((prev: any) => ({ 
      ...prev, 
      [domainId]: { ...prev[domainId], name: value }
    }))
    const validation = validateSubDomain(value)
    setEditingDomainForms((prev: any) => ({ 
      ...prev, 
      [domainId]: { ...prev[domainId], domainError: validation.isValid ? '' : validation.message }
    }))
  }

  const editSubdomainContentOnChange = (value: string, domainId: string) => {
    setEditingDomainForms((prev: any) => ({ 
      ...prev, 
      [domainId]: { ...prev[domainId], content: value }
    }))
    if (editingDomainForms[domainId]?.type === 'A') {
      const validation = validateIp(value)
      setEditingDomainForms((prev: any) => ({ 
        ...prev, 
        [domainId]: { ...prev[domainId], contentError: validation.isValid ? '' : validation.message }
      }))
    } else if (editingDomainForms[domainId]?.type === 'CNAME') {
      const validation = validateCname(value)
      setEditingDomainForms((prev: any) => ({ 
        ...prev, 
        [domainId]: { ...prev[domainId], contentError: validation.isValid ? '' : validation.message }
      }))
    } else if (editingDomainForms[domainId]?.type === 'AAAA') {
      const validation = validateIPv6Ip(value)
      setEditingDomainForms((prev: any) => ({ 
        ...prev, 
        [domainId]: { ...prev[domainId], contentError: validation.isValid ? '' : validation.message }
      }))
    } else {
      setEditingDomainForms((prev: any) => ({ 
        ...prev, 
        [domainId]: { ...prev[domainId], contentError: '' }
      }))
    }
  }

  const editSubdomainTypeOnChange = (value: string, domainId: string) => {
    setEditingDomainForms((prev: any) => ({ 
      ...prev, 
      [domainId]: { ...prev[domainId], type: value, contentError: '', content: '' }
    }))
  }

  const handleEditSubdomainSubmit = async (domainId: string) => {
    const { contract } = auth as any
    const currentForm = editingDomainForms[domainId]
    if (currentForm.name?.trim() && currentForm.type && currentForm.content) {
      let trimmedName = currentForm.name.trim()
      while (trimmedName.endsWith('.' + currentForm.zone)) trimmedName = trimmedName.slice(0, -(currentForm.zone.length + 1)) // 移除重複的主域名
      if (trimmedName === currentForm.zone || trimmedName === '@' || trimmedName === '') {
        currentForm.name = currentForm.zone   // 如果結果等於 zone、@ 或空白，就用 zone（代表主域名本身）
      } else {
        currentForm.name = trimmedName + '.' + currentForm.zone
      }
      setIsLoading(true)
      await updateDnsRecord({ contractNo: contract?.contractNo || null, ...currentForm })
      .then(() => {
        loadSettings()
        notifySuccess('子域名更新成功')
      })
      .catch((error: any) => {
        loadSettings()
        console.log(error)
        if (error.response?.data?.message && error.response?.data?.message === 'Unauthorized') {
          notifyError('Unauthorized')
        } else {
          notifyError('子域名更新失敗')
        }
      })
      .finally(() => {
        // 關閉編輯表單
        setExpandedEditDomainForms((prev: any) => ({
          ...prev,
          [domainId]: false,
        }))
        // 清除該域名的編輯表單
        setEditingDomainForms((prev: any) => {
          const newState = { ...prev }
          delete newState[domainId]
          return newState
        })
        setIsLoading(false)
      })
    }
  }

  ////////////////////////////////
  // 子域名刪除
  ////////////////////////////////

  const handleDeleteSubdomainOpen = (domainId: string, zone: string) => {
    setDeleteSubdomain(domainId)
    setSelectedZone(zone)
    setIsSubdomainDeleteConfirmOpen(true)
  }

  const handleDeleteSubdomainSubmit = async () => {
    const { contract } = auth as any
    setIsLoading(true)
    setIsSubdomainDeleteConfirmOpen(false)
    const domain = domainSettings.find((d) => d.id === deleteSubdomain)
    await deleteDnsRecord({ contractNo: contract?.contractNo || null, name: domain?.name, id: deleteSubdomain, zone: selectedZone })
      .then(() => {
        notifySuccess("子域名刪除成功")
      })
      .catch((error: any) => {
        console.log(error)
        if (error.response?.data?.message && error.response?.data?.message === 'Unauthorized') {
          notifyError('Unauthorized')
        } else {
          notifyError('子域名刪除失敗失敗')
        }
      })
      .finally(() => {
        setDeleteSubdomain('')
        setSelectedZone('')
        loadSettings()
        setIsLoading(false)
      })
  }

  ////////////////////////////////
  // 匯入匯出子域名設定
  ////////////////////////////////

  const handleSubdomainFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const content = await readFileContent(file)
      setImportFile({ name: file.name, text: content })
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      const content = await readFileContent(file)
      setImportFile({ name: file.name, text: content })
    }
  }

  const handleImportSubmit = async () => {
    const { contract } = auth as any
    if (importFile && importSelectedZone) {
      if (importFile.text) {
        setIsImportDialogOpen(false)
        setIsLoading(true)
        await importZoneSubdomains({ 
          contractNo: contract?.contractNo || null, 
          zone: importSelectedZone,
          content: importFile.text, 
          proxied: importProxyEnabled 
        })
        .then(() => {
          notifySuccess("DNS 記錄匯入成功")
        })
        .catch((error: any) => {
          console.log(error)
          notifyError("DNS 記錄匯入失敗")
        })
        .finally(() => {
          setIsLoading(false)
          setImportFile(null)
          setImportSelectedZone("")
          setImportProxyEnabled(false)
          loadSettings();
        })
      }
    } else {
      notifyError("請選擇要匯入的 Zone 和檔案")
    }
  }

  const handleExportDialogOpen = (open: boolean) => {
    setIsExportDialogOpen(open)
    if (open) {
      setExportSelectedZones([zoneSettings[0].name])
    } else {
      setExportSelectedZones([])
    }
  }

  const handleExportZoneToggle = (zoneName: string) => {
    setExportSelectedZones((prev) => {
      if (prev.includes(zoneName)) {
        return prev.filter((z) => z !== zoneName)
      } else {
        return [...prev, zoneName]
      }
    })
  }

  const downloadTextFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  const handleExportSubdomain = async () => {
    const { contract } = auth as any
    setIsExportDialogOpen(false)
    setIsLoading(true)
    await exportZoneSubdomains({ contractNo: contract?.contractNo, zones: exportSelectedZones })
    .then((response: any) => {
      const exportData = response.data?.data || []
      if (exportData.length > 0) {
        exportData.forEach((item: { zone: string; content: string }, index: number) => {
          setTimeout(() => {
            downloadTextFile(item.content, `${item.zone}.txt`)
          }, index * 500)
        })
        notifySuccess(`已匯出 ${exportData.length} 個 DNS 記錄檔案`)
      } else {
        notifyError('沒有可匯出的 DNS 記錄')
      }
    })
    .catch((error: any) => {
      console.log(error)
      if (error.response?.data?.message && error.response?.data?.message === 'Unauthorized') {
        notifyError('Unauthorized')
      } else {
        notifyError('DNS 記錄匯出失敗')
      }
    })
    .finally(() => {
      setExportSelectedZones([])
      setIsLoading(false)
    })
  }

  // 新增標籤的處理函數
const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>, type: 'create' | 'update', domainId: string) => {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault()
    const newTag = tagInput.trim()
    if (type === 'create') {
      if (newTag && !creatingDomainForm.tags?.includes(newTag)) {
        setCreatingDomainForm((prev: any) => ({
          ...prev,
          tags: [...(prev.tags || []), newTag]
        }))
        setTagInput('')
      }
    } else {
      if (newTag && (!editingDomainForms[domainId]?.tags?.includes(newTag) || editingDomainForms[domainId]?.tags?.length === 0)) {
        setEditingDomainForms((prev: any) => ({
          ...prev,
          [domainId]: { ...prev[domainId], tags: [...(prev[domainId]?.tags || []), newTag] }
        }))
        setTagInput('')
      }
    }
  }
}

// 移除標籤
const handleRemoveTag = (tagToRemove: string, type: 'create' | 'update', domainId: string) => {
  if (type === 'create') {
    setCreatingDomainForm((prev: any) => ({
      ...prev,
      tags: prev.tags.filter((tag: string) => tag !== tagToRemove)
    }))
  } else {
    setEditingDomainForms((prev: any) => ({
      ...prev,
      [domainId]: { ...prev[domainId], tags: prev[domainId]?.tags?.filter((tag: string) => tag !== tagToRemove) }
    }))
  }
}

  ////////////////////////////////
  // 複製功能
  ////////////////////////////////

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field)
      setTimeout(() => setCopiedField(""), 2000)
    })
  }

  const toggleTxtRecord = (domainName: string) => {
    setExpandedTxtRecords((prev: any) => ({
      ...prev,
      [domainName]: !prev[domainName],
    }))
  }

  ////////////////////////////////
  // Certificate 憑證設定
  ////////////////////////////////

  const toggleCertificateDetails = (hostname: string) => {
    setExpandedCertificateDetails((prev: any) => ({
      ...prev,
      [hostname]: !prev[hostname],
    }))
  }

  const handleCreateCertificateOpen = (open: boolean) => {
    setIsUploadCertificateOpen(open)
    setUploadCertificateForm({
      zone: '',
      sslCertificate: '',
      privateKey: '',
      combinationMethod: 'ubiquitous',
      legacyClientSupport: 'custom',
    })
  }

  const handleFileSelect = async (type: 'certificate' | 'privateKey') => {
    const input = document.createElement('input')
    input.type = 'file'
    if (type === 'certificate') {
      input.accept = '.crt,.pem,.cer'
    } else if (type === 'privateKey') {
      input.accept = '.key,.pem'
    }
    input.style.display = 'none'
    
    input.onchange = async (e) => {
      const target = e.target as HTMLInputElement
      const file = target.files?.[0]
      
      if (file) {
        try {
          const content = await readFileContent(file)
          
          if (type === 'certificate') {
            setUploadCertificateForm((prev: any) => ({ ...prev, sslCertificate: content }))
          } else {
            setUploadCertificateForm((prev: any) => ({ ...prev, privateKey: content }))
          }
        } catch (error) {
          notifyError('檔案讀取失敗，請確認檔案格式正確')
        }
      }
      
      // 清理 DOM
      document.body.removeChild(input)
    }
    
    // 添加到 DOM 並觸發點擊
    document.body.appendChild(input)
    input.click()
  }

  const handleUploadCertificate = async () => {
    const { contract } = auth as any
    if (!uploadCertificateForm.sslCertificate?.trim() || !uploadCertificateForm.privateKey?.trim()) {
      notifyError("請輸入 SSL 憑證和私密金鑰")
      return
    }
    if (!uploadCertificateForm.zone) {
      notifyError("請選擇主域名")
      return
    }
    
    setIsLoading(true)
    try {
      await uploadCustomCertificate({
        contractNo: contract?.contractNo || null,
        zone: uploadCertificateForm.zone,
        certificate: uploadCertificateForm.sslCertificate,
        privateKey: uploadCertificateForm.privateKey,
        combinationMethod: uploadCertificateForm.combinationMethod,
        legacyClientSupport: uploadCertificateForm.legacyClientSupport
      })
      
      notifySuccess("自訂憑證上傳成功")
      handleCreateCertificateOpen(false)
      await loadSettings()
    } catch (error: any) {
      console.log(error)
      if (error.response?.data?.message && error.response?.data?.message === 'Unauthorized') {
        notifyError('Unauthorized')
      } else {
        notifyError('憑證上傳失敗')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCertificateOpen = (certificate: any) => {
    setSelectedCertificate(certificate)
    setIsDeleteCertificateOpen(true)
  }

  const handleDeleteCertificateSubmit = async () => {
    const { contract } = auth as any
    if (!selectedCertificate) return

    setIsLoading(true)
    setIsDeleteCertificateOpen(false)
    try {
      await deleteCustomCertificate({
        contractNo: contract?.contractNo || null,
        zone: selectedCertificate.zone,
        certificateId: selectedCertificate.id,
        hosts: selectedCertificate.hosts.join(",")
      })
      notifySuccess("憑證刪除成功")
      await loadSettings()
    } catch (error: any) {
      console.log(error)
      if (error.response?.data?.message && error.response?.data?.message === 'Unauthorized') {
        notifyError('Unauthorized')
      } else {
        notifyError('憑證刪除失敗')
      }
    } finally {
      setSelectedCertificate(null)
      setIsLoading(false)
    }
  }


  return (
    <div className="container mx-auto p-6 space-y-8">
      
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/cloudflare">Cloudflare Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>DNS 設定</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tighter">
          DNS設定<span className="text-brand-primary">管理</span>
        </h1>
        {/* <p className="mt-2 text-muted-foreground">管理您的網站應用防火牆設定，保護您的網站免受各種網路攻擊威脅</p> */}
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

      {/* WAF Settings */}
      <div className="space-y-6">
      <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" style={{ color: "#0D99FF" }} />
              DNS 設定
            </CardTitle>
            <CardDescription>配置您的網站域名管理</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 主域名設定 */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg gap-3 sm:gap-0">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-blue-500" />
                  <div>
                    <h3 className="font-medium">主域名設定</h3>
                    <p className="text-sm text-muted-foreground">配置主要域名的設定</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge
                    variant="outline"
                    className="text-green-600 border-green-600 text-xs sm:text-sm whitespace-nowrap px-2 py-1"
                  >
                    {zoneSettings.length}個已配置
                  </Badge>
                  {
                    isReadOnly ? null : (
                    <Dialog open={isZoneCreateOpen} onOpenChange={handleCreateZoneOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" disabled={isReadOnly || zoneSettings.length >= auth?.contract?.serviceCount}>
                          設定
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>主域名設定</DialogTitle>
                          <DialogDescription>請輸入您要配置WAF防護的主域名</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-2 py-4">
                          <Label htmlFor="domain">域名</Label>
                          <Input
                            id="domain"
                            placeholder="例如: example.com"
                            value={zoneInput}
                            onChange={(e) => handleZoneInputChange(e.target.value)}
                            className="w-full"
                          />
                        </div>

                        {/* DNS 設定方式選擇 */}
                        <div className="space-y-3 py-2">
                          <div>
                            <h4 className="font-semibold text-sm">DNS設定</h4>
                            <p className="text-xs text-muted-foreground">在 Cloudflare 上管理 DNS 記錄。</p>
                          </div>
                          
                          <div className="space-y-2">
                            {/* 快速掃描 DNS 記錄 */}
                            <label 
                              className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                                dnsSetupMethod === 'quick_scan' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                              }`}
                            >
                              <input
                                type="radio"
                                name="dnsSetupMethod"
                                value="quick_scan"
                                checked={dnsSetupMethod === 'quick_scan'}
                                onChange={() => setDnsSetupMethod('quick_scan')}
                                className="mt-1"
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-sm">快速掃描 DNS 記錄</span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  Cloudflare 將掃描常見 DNS 記錄，並為您匯入。
                                </p>
                              </div>
                            </label>

                            {/* 手動輸入 DNS 記錄 */}
                            <label 
                              className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                                dnsSetupMethod === 'manual' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                              }`}
                            >
                              <input
                                type="radio"
                                name="dnsSetupMethod"
                                value="manual"
                                checked={dnsSetupMethod === 'manual'}
                                onChange={() => setDnsSetupMethod('manual')}
                                className="mt-1"
                              />
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">手動輸入 DNS 記錄</span>
                              </div>
                            </label>
                          </div>
                        </div>
                        
                        <DialogFooter>
                          <Button type="submit" onClick={handleZoneSubmit} disabled={!zoneInput.trim()}>
                            送出
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    )
                  }
                </div>
              </div>

              {/* 主域名列表 */}
              {zoneSettings.length > 0 && (
                <div className="ml-8 space-y-4">
                  {zoneSettings.map((domain, index) => (
                    <div key={index} className="space-y-3">
                      {/* 域名信息 */}
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                        <div className="flex items-center gap-3">
                          <div className={domain.status === "pending" ? "w-2 h-2 bg-yellow-500 rounded-full" : "w-2 h-2 bg-green-500 rounded-full"}></div>
                          <div>
                            <p className="font-medium">{domain.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {
                            domain.status === "pending" ? (
                              <Badge variant="outline" className="text-yellow-600 border-yellow-600">待驗證</Badge>
                            ) : null
                          }
                          {/* TXT 記錄展開/收合按鈕 */}
                          {domain.txtRecord && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleTxtRecord(domain.name)}
                              className="h-8 w-8 p-0"
                            >
                              {expandedTxtRecords[domain.name] ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                          {
                            isReadOnly ? null : (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteZoneConfirmOpen(domain.name)}
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                disabled={isReadOnly}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )
                          }
                        </div>
                      </div>

                      {/* TXT 記錄 - 可收合 */}
                      {domain.txtRecord && expandedTxtRecords[domain.name] && (
                        <div className="ml-4 p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/30 animate-in slide-in-from-top-2 duration-200">
                          <h4 className="font-medium text-sm mb-3 text-blue-700 dark:text-blue-300">
                            DNS TXT 記錄設定
                          </h4>
                          <div className="space-y-3">
                            <div className="grid grid-cols-4 items-center gap-2">
                              <Label className="text-sm font-medium">記錄類型:</Label>
                              <div className="col-span-2 flex items-center gap-2">
                                <code className="px-2 py-1 bg-muted rounded text-sm font-mono">
                                  {domain.txtRecord.type}
                                </code>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => copyToClipboard(domain.txtRecord.type, `type-${index}`)}
                                >
                                  {copiedField === `type-${index}` ? (
                                    <Check className="h-3 w-3 text-green-500" />
                                  ) : (
                                    <Copy className="h-3 w-3" />
                                  )}
                                </Button>
                              </div>
                            </div>

                            <div className="grid grid-cols-4 items-center gap-2">
                              <Label className="text-sm font-medium">名稱:</Label>
                              <div className="col-span-2 flex items-center gap-2">
                                <code className="px-2 py-1 bg-muted rounded text-sm font-mono break-all">
                                  {domain.txtRecord.name}
                                </code>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => copyToClipboard(domain.txtRecord.name, `name-${index}`)}
                                >
                                  {copiedField === `name-${index}` ? (
                                    <Check className="h-3 w-3 text-green-500" />
                                  ) : (
                                    <Copy className="h-3 w-3" />
                                  )}
                                </Button>
                              </div>
                            </div>

                            <div className="grid grid-cols-4 items-start gap-2">
                              <Label className="text-sm font-medium">內容:</Label>
                              <div className="col-span-2 flex items-start gap-2">
                                <code className="px-2 py-1 bg-muted rounded text-sm font-mono break-all leading-relaxed">
                                  {domain.txtRecord.content}
                                </code>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 mt-1"
                                  onClick={() => copyToClipboard(domain.txtRecord.content, `content-${index}`)}
                                >
                                  {copiedField === `content-${index}` ? (
                                    <Check className="h-3 w-3 text-green-500" />
                                  ) : (
                                    <Copy className="h-3 w-3" />
                                  )}
                                </Button>
                              </div>
                            </div>

                            {/* <div className="grid grid-cols-4 items-start gap-2">
                              <Label className="text-sm font-medium">CNAME 尾碼:</Label>
                              <div className="col-span-2 flex items-start gap-2">
                                <code className="px-2 py-1 bg-muted rounded text-sm font-mono break-all leading-relaxed">
                                  {domain.cname_suffix}
                                </code>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 mt-1"
                                  onClick={() => copyToClipboard(domain.cname_suffix, `cname-${index}`)}
                                >
                                  {copiedField === `cname-${index}` ? (
                                    <Check className="h-3 w-3 text-green-500" />
                                  ) : (
                                    <Copy className="h-3 w-3" />
                                  )}
                                </Button>
                              </div>
                            </div> */}
                          </div>
                          {
                            domain.status === "pending" ? (
                              <p className="text-xs text-muted-foreground mt-3">
                                請將以上 TXT 記錄添加到您的 DNS 設定中以完成域名驗證
                              </p>
                            ) : (
                              <p className="text-xs text-muted-foreground mt-3">
                                TXT 記錄已添加到您的 DNS 設定中
                              </p>
                            )
                          }
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 子域名設定(建立) */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg gap-3 sm:gap-0">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-purple-500" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">子域名設定</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => setIsSubdomainInfoOpen(true)}
                      >
                        <AlertCircle className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">管理子域名的DNS配置</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    {isSearchVisible && (
                      <div className="relative animate-in fade-in slide-in-from-right-2 duration-300">
                        <Input
                          placeholder="搜尋 DNS 記錄"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="h-8 w-[150px] sm:w-[200px] pr-8 text-xs sm:text-sm"
                          autoFocus
                        />
                        {searchTerm && (
                          <button
                            onClick={() => setSearchTerm("")}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-8 w-8 p-0 ${isSearchVisible ? "bg-muted" : ""}`}
                      onClick={() => {
                        setIsSearchVisible(!isSearchVisible);
                        if (isSearchVisible) setSearchTerm("");
                      }}
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-green-600 border-green-600 text-xs sm:text-sm whitespace-nowrap px-2 py-1"
                  >
                    {domainSettings.length}個已配置
                  </Badge>

                  {/* 匯入按鈕 */}
                  {
                    isReadOnly ? null : (
                      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-1">
                            <Upload className="h-4 w-4" />
                            <span className="hidden sm:inline">匯入</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>匯入 DNS 記錄</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            {/* Proxy 選項 */}
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="proxy-import" 
                                checked={importProxyEnabled}
                                onCheckedChange={(checked) => setImportProxyEnabled(checked as boolean)}
                              />
                              <label htmlFor="proxy-import" className="text-sm cursor-pointer">
                                通過 Proxy 處理匯入的 DNS 記錄
                              </label>
                            </div>

                            {/* 選擇要匯入的 Zone */}
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">選擇主域名</Label>
                              <Select value={importSelectedZone} onValueChange={setImportSelectedZone}>
                                <SelectTrigger>
                                  <SelectValue placeholder="請選擇要匯入 DNS 記錄的主域名" />
                                </SelectTrigger>
                                <SelectContent>
                                  {zoneSettings.map((zone, index) => (
                                    <SelectItem key={index} value={zone.name}>
                                      {zone.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* 檔案上傳區域 */}
                            <div
                              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                                isDragging ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30" : "border-gray-300"
                              }`}
                              onDragOver={handleDragOver}
                              onDragLeave={handleDragLeave}
                              onDrop={handleDrop}
                            >
                              <div className="flex flex-col items-center gap-3">
                                <div className="text-gray-400">
                                  <svg className="w-12 h-12 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </div>
                                <div className="text-sm">
                                  <label className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium">
                                    選取檔案
                                    <input
                                      type="file"
                                      className="hidden"
                                      accept=".csv,.txt,.bind,.zone"
                                      onChange={handleSubdomainFileSelect}
                                    />
                                  </label>
                                  <span className="text-gray-500"> 或將檔案拖曳到此處</span>
                                </div>
                                {importFile && importFile.name && (
                                  <div className="mt-2 text-sm text-green-600">
                                    已選擇: {importFile.name}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => {
                              setIsImportDialogOpen(false)
                              setImportFile(null)
                              setImportSelectedZone("")
                              setImportProxyEnabled(false)
                            }}>
                              取消
                            </Button>
                            <Button onClick={handleImportSubmit} disabled={!importFile || !importSelectedZone}>
                              匯入
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )
                  }

                  {/* 匯出按鈕 */}
                  {
                    isReadOnly ? null : (
                      <Dialog open={isExportDialogOpen} onOpenChange={handleExportDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-1" disabled={zoneSettings.length === 0}>
                            <Download className="h-4 w-4" />
                            <span className="hidden sm:inline">匯出</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>匯出 DNS 記錄</DialogTitle>
                            <DialogDescription>
                              請選擇要匯出的主域名，將會匯出所選主域名下的所有 DNS 記錄
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            {/* 全選/取消全選 */}
                            <div className="flex items-center space-x-2 pb-2 border-b">
                              <Checkbox 
                                id="export-select-all" 
                                checked={exportSelectedZones.length === zoneSettings.length && zoneSettings.length > 0}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setExportSelectedZones(zoneSettings.map((zone) => zone.name))
                                  } else {
                                    setExportSelectedZones([])
                                  }
                                }}
                              />
                              <label htmlFor="export-select-all" className="text-sm font-medium cursor-pointer">
                                全選
                              </label>
                              <span className="text-sm text-muted-foreground">
                                ({exportSelectedZones.length}/{zoneSettings.length} 已選擇)
                              </span>
                            </div>
                            {/* Zone 列表 */}
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                              {zoneSettings.map((zone, index) => (
                                <div key={index} className="flex items-center space-x-3 p-2 border rounded-lg hover:bg-muted/50">
                                  <Checkbox 
                                    id={`export-zone-${index}`}
                                    checked={exportSelectedZones.includes(zone.name)}
                                    onCheckedChange={() => handleExportZoneToggle(zone.name)}
                                  />
                                  <label htmlFor={`export-zone-${index}`} className="flex-1 cursor-pointer">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-medium">{zone.name}</span>
                                    </div>
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => handleExportDialogOpen(false)}>
                              取消
                            </Button>
                            <Button onClick={handleExportSubdomain} disabled={exportSelectedZones.length === 0}>
                              <Download className="h-4 w-4 mr-2" />
                              匯出 ({exportSelectedZones.length})
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )
                  }

                  {
                    isReadOnly ? null : (
                      <Dialog open={isSubdomainCreateOpen} onOpenChange={handleCreateSubdomainOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" disabled={zoneSettings.length === 0 || isReadOnly}>
                            設定
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>子域名設定</DialogTitle>
                            
                            <DialogDescription>請選擇主域名並輸入子域名前綴</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="main-domain" className="text-right">主域名</Label>
                              <Select value={creatingDomainForm.zone} onValueChange={(e) => setCreatingDomainForm((prev: any) => ({ ...prev, zone: e }))}>
                                <SelectTrigger className="col-span-3">
                                  <SelectValue placeholder="選擇主域名" />
                                </SelectTrigger>
                                <SelectContent>
                                  {zoneSettings.map((item, index) => (
                                    <SelectItem key={index} value={item.name}>
                                      {item.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="subdomain" className="text-right">子域名</Label>
                              <div className="col-span-3 flex items-center">
                                <Input
                                  id="name"
                                  placeholder="例如: www"
                                  value={creatingDomainForm.name || ''}
                                  onChange={(e) => createSubdomainDnsOnChange(e.target.value)}
                                  className={domainError ? "border-red-500 focus:border-red-500" : `flex-1`}
                                />
                                <span className="ml-2 text-muted-foreground">.{creatingDomainForm.zone || "選擇主域名"}</span>
                              </div>
                            </div>
                            {domainError && (
                              <div className="grid grid-cols-4 gap-4">
                                <div></div>
                                <div className="col-span-3">
                                  <p className="text-xs text-red-500">{domainError}</p>
                                </div>
                              </div>
                            )}

                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="dnsRecordType" className="text-right">類型</Label>
                              <Select value={creatingDomainForm.type} onValueChange={createSubdomainTypeOnChange}>
                                <SelectTrigger className="col-span-3">
                                  <SelectValue placeholder="選擇類型" />
                                </SelectTrigger>
                                <SelectContent>
                                  {dnsRecordTypes.map((item, index) => (
                                    <SelectItem key={index} value={item}>{item}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="subdomainContent" className="text-right">
                                { creatingDomainForm.type === "A" ? "IPv4 位址" : creatingDomainForm.type === "AAAA" ? "IPv6 位址" : "目標"}</Label>
                              <div className="col-span-3 space-y-2">
                              <Input 
                                id="content"
                                placeholder=""
                                value={creatingDomainForm.content}
                                onChange={(e) => createSubdomainContentOnChange(e.target.value)}
                                className={contentError ? "border-red-500 focus:border-red-500" : `flex-1`}
                              />
                              </div>
                            </div>
                            {contentError && (
                              <div className="grid grid-cols-4 gap-4">
                                <div></div>
                                <div className="col-span-3">
                                  <p className="text-xs text-red-500">{contentError}</p>
                                </div>
                              </div>
                            )}

                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right">Proxy 狀態</Label>
                              <div className="col-span-3 flex items-center gap-3">
                                <Switch 
                                  checked={!creatingDomainForm.proxied ? false : true} 
                                  onCheckedChange={(checked) => setCreatingDomainForm((prev: any) => ({ ...prev, proxied: checked }))} 
                                />
                                <span className="text-sm text-muted-foreground">
                                  {creatingDomainForm.proxied ? "通過Proxy處理" : "僅DNS"}
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right">TTL</Label>
                              {
                                !creatingDomainForm.proxied ?
                                <Select value={creatingDomainForm.ttl?.toString()} onValueChange={(value) => setCreatingDomainForm((prev: any) => ({ ...prev, ttl: parseInt(value) }))}>
                                <SelectTrigger className="col-span-3">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {ttlOptions.map((ttl) => (
                                    <SelectItem key={ttl.value} value={ttl.value.toString()}>
                                      {ttl.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                                : 
                                <p className="text-sm text-muted-foreground">自動</p>
                              }
                            </div>
                            <hr className="my-4" />
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="comment" className="text-right">註解</Label>
                              <div className="col-span-3 flex items-center">
                                <Input
                                  id="comment"
                                  placeholder="選填，在此處輸入您的註解(上限100字)"
                                  value={creatingDomainForm.comment || ''}
                                  onChange={(e) => setCreatingDomainForm((prev: any) => ({ ...prev, comment: e.target.value }))}
                                  className='flex-1'
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-4 items-start gap-4">
                              <Label htmlFor="tags" className="text-right mt-2">標籤</Label>
                              <div className="col-span-3 flex items-center">
                                <div className="flex flex-wrap items-center gap-1 px-3 py-2 border rounded-md bg-background flex-1 min-h-10 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                                  {creatingDomainForm.tags?.map((tag: string, index: number) => (
                                    <Badge key={index} variant="secondary" className="flex items-center gap-1 h-6 text-xs">
                                      {tag}
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveTag(tag, 'create', '')}
                                        className="ml-1 hover:text-red-500"
                                      >
                                        ×
                                      </button>
                                    </Badge>
                                  ))}
                                  <Input
                                    id="tags"
                                    placeholder={creatingDomainForm.tags?.length > 0 ? "" : "輸入標籤後按 Enter 新增"}
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={(e) => handleAddTag(e, 'create', '')}
                                    className="flex-1 border-0 shadow-none focus-visible:ring-0 h-6 min-w-[120px] p-0 text-sm"
                                  />
                                </div>
                              </div>
                            </div>

                          </div>
                          <DialogFooter>
                            <Button
                              type="submit"
                              onClick={handleCreateSubdomainSubmit}
                              disabled={!creatingDomainForm.name?.trim() || !creatingDomainForm.zone || contentError !== ''}
                            >
                              送出
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )
                  }
                </div>
              </div>

              {/* 子域名列表 */}
              {domainSettings.length > 0 && (
                <div className="ml-8 space-y-2">
                  {filteredDomains.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground border rounded-lg bg-muted/10">
                      找不到符合「{searchTerm}」的 DNS 記錄
                    </div>
                  ) : (
                    <>
                      {/* 桌面版表格標題 */}
                      <div className="hidden lg:grid lg:grid-cols-12 gap-4 p-3 border-b font-medium text-sm text-muted-foreground">
                        <div className="col-span-3">名稱</div>
                        <div className={domainSettings.filter((domain) => domain.comment !== '').length > 0 ? "col-span-1" : "col-span-2"}>類型</div>
                        {
                          domainSettings.filter((domain) => domain.comment !== '').length > 0 && (
                            <div className="col-span-1 flex justify-left">
                              <MessageSquare className="h-4 w-4" />
                            </div>
                          )
                        }
                        <div className="col-span-2">內容</div>
                        <div className="col-span-2">Proxy狀態</div>
                        <div className="col-span-1">TTL</div>
                        <div className="col-span-2">操作</div>
                      </div>
                      {
                        paginatedDomains.map((domain, index) => (
                          <React.Fragment key={index}>
                            {/* 桌面版列表 */}
                            <div className="hidden lg:grid lg:grid-cols-12 gap-4 items-center p-3 border rounded-lg bg-muted/30">
                              <div className="col-span-3 flex items-center gap-2">
                                <div>
                                  <p className="font-medium text-sm">{domain.name}</p>
                                </div>
                              </div>

                              <div className={domainSettings.filter((domain) => domain.comment !== '').length > 0 ? "col-span-1" : "col-span-2"}>
                                <Badge variant="secondary" className="text-xs whitespace-nowrap px-2 py-1">
                                  {domain.type || "A"}
                                </Badge>
                              </div>

                              {
                                domainSettings.filter((domain) => domain.comment !== '').length > 0 && (
                                   <div className="col-span-1 flex justify-left">
                                     {domain.comment ? (
                                       <TooltipProvider delayDuration={0}>
                                         <Tooltip>
                                           <TooltipTrigger asChild>
                                             <button type="button" className="cursor-pointer hover:opacity-80 transition-opacity">
                                               <MessageSquare className="h-4 w-4 text-blue-500" />
                                             </button>
                                           </TooltipTrigger>
                                           <TooltipContent side="top">
                                             <p className="max-w-xs">{domain.comment}</p>
                                           </TooltipContent>
                                         </Tooltip>
                                       </TooltipProvider>
                                     ) : (
                                       <span className="text-muted-foreground">-</span>
                                     )}
                                   </div>
                                 )
                               }

                              <div className="col-span-2 min-w-0">
                                <span className="text-sm font-mono break-all">{domain.content || "-"}</span>
                              </div>

                              <div className="col-span-2">
                                <div className="flex items-center gap-2">
                                  <Switch checked={domain.proxied} disabled className="scale-75" />
                                  <span className="text-xs">{domain.proxied ? "通過Proxy處理" : "僅DNS"}</span>
                                </div>
                              </div>

                              <div className="col-span-1">
                                <span className="text-sm text-muted-foreground">{ttlToChinese(domain.ttl)}</span>
                              </div>

                              {
                                isReadOnly ? null : (
                                  <div className="col-span-2 flex items-center gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                      onClick={() => handleEditSubdomainOpen(domain.id)}
                                      disabled={(domain.type !== 'A' && domain.type !== 'AAAA' && domain.type !== 'CNAME') || isReadOnly}
                                    >
                                      <Settings className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                      onClick={() => handleDeleteSubdomainOpen(domain.id, domain.zone)}
                                      disabled={isReadOnly}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )
                              }

                              {/* Tags 顯示區域 */}
                              {domain.tags && domain.tags.length > 0 && (
                                <div className="col-span-12 flex flex-wrap gap-1.5 pt-2 mt-2 border-t border-dashed">
                                  {domain.tags.map((tag, tagIndex) => (
                                    <Badge
                                      key={tagIndex}
                                      variant="outline"
                                      className="text-xs px-2 py-0.5 bg-background border-muted-foreground/30 text-muted-foreground"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>

                          {/* 手機版卡片式佈局 */}
                          <div className="lg:hidden border rounded-lg bg-muted/30 p-4 space-y-3">
                            {/* 域名名稱和狀態 */}
                            {
                              isReadOnly ? null : (
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                      onClick={() => handleEditSubdomainOpen(domain.id)}
                                      disabled={(domain.type !== 'A' && domain.type !== 'AAAA' && domain.type !== 'CNAME') || isReadOnly}
                                    >
                                      <Settings className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                      onClick={() => handleDeleteSubdomainOpen(domain.id, domain.zone)}
                                      disabled={isReadOnly}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              )
                            }

                            {/* 詳細資訊 */}
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div>
                                <span className="text-muted-foreground">類型: </span>
                                <Badge variant="secondary" size="sm">
                                  {domain.type || "A"}
                                </Badge>
                              </div>
                              <div>
                                <span className="text-muted-foreground">TTL: </span>
                                <span>{ttlToChinese(domain.ttl)}</span>
                              </div>
                              <div className="col-span-2">
                                <span className="text-muted-foreground">IP位址: </span>
                                <span className="font-mono">{domain.content || "-"}</span>
                              </div>
                              <div className="col-span-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-muted-foreground">Proxy狀態: </span>
                                  <Switch checked={domain.proxied} disabled className="scale-75" />
                                  <span className="text-xs">{domain.proxied ? "通過Proxy處理" : "僅DNS"}</span>
                                </div>
                              </div>

                              {/* Tags 顯示區域 - 手機版 */}
                              {domain.tags && domain.tags.length > 0 && (
                                <div className="col-span-2 flex flex-wrap gap-1.5 pt-2 mt-1 border-t border-dashed">
                                  {domain.tags.map((tag, tagIndex) => (
                                    <Badge
                                      key={tagIndex}
                                      variant="outline"
                                      className="text-xs px-2 py-0.5 bg-background border-muted-foreground/30 text-muted-foreground"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                            {/* 編輯表單 */}
                            {expandedEditDomainForms[domain.id] && editingDomainForms[domain.id] && (
                              <div className="mt-4 p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/30 animate-in slide-in-from-top-2 duration-200">
                                <h4 className="font-medium text-sm mb-4 text-blue-700 dark:text-blue-300">編輯子域名設定</h4>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* 名稱欄位 */}
                                  <div className="space-y-2">
                                    <Label className="text-sm font-medium">子域名名稱</Label>
                                    <Input
                                      value={editingDomainForms[domain.id]?.name || ''}
                                      onChange={(e) => editSubdomainDnsOnChange(e.target.value, domain.id)}
                                      placeholder="例如: www"
                                      className={editingDomainForms[domain.id]?.domainError ? "border-red-500 focus:border-red-500" : `flex-1`}
                                    />
                                    {editingDomainForms[domain.id]?.domainError && (
                                      <div className="grid">
                                        <div></div>
                                        <div className="col-span-3">
                                          <p className="text-xs text-red-500">{editingDomainForms[domain.id]?.domainError}</p>
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  <div className="space-y-2">
                                    <Label className="text-sm font-medium">類型</Label>
                                    <Select
                                      value={editingDomainForms[domain.id]?.type || 'A'}
                                      onValueChange={(value) => editSubdomainTypeOnChange(value, domain.id)}
                                    >
                                      <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="選擇類型" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {dnsRecordTypes.map((item, index) => (
                                          <SelectItem key={index} value={item}>{item}</SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="space-y-2">
                                    <Label className="text-sm font-medium">
                                      { editingDomainForms[domain.id]?.type === "A" ? "IPv4 位址" : editingDomainForms[domain.id]?.type === "AAAA" ? "IPv6 位址" : "目標"}</Label>
                                    <div className="col-span-3 space-y-2">
                                      <Input 
                                        id="content"
                                        placeholder={editingDomainForms[domain.id]?.type === "A" ? "192.168.1.1" : editingDomainForms[domain.id]?.type === "AAAA" ? "2001:db8::1" : "example"}
                                        value={editingDomainForms[domain.id]?.content}
                                        onChange={(e) => editSubdomainContentOnChange(e.target.value, domain.id)}
                                        className={editingDomainForms[domain.id]?.contentError ? "border-red-500 focus:border-red-500" : `flex-1`}
                                      />
                                    </div>
                                    {editingDomainForms[domain.id]?.contentError && (
                                      <div className="grid">
                                        <div></div>
                                        <div className="col-span-3">
                                        <p className="text-xs text-red-500">{editingDomainForms[domain.id]?.contentError}</p>
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  <div className="space-y-2">
                                    <Label className="text-sm font-medium">Proxy 狀態</Label>
                                    <div className="flex items-center gap-3">
                                      <Switch
                                        checked={editingDomainForms[domain.id]?.proxied || false}
                                        onCheckedChange={(checked) =>
                                          setEditingDomainForms((prev: any) => ({ 
                                            ...prev, 
                                            [domain.id]: { ...prev[domain.id], proxied: checked }
                                          }))
                                        }
                                      />
                                      <span className="text-sm text-muted-foreground">
                                        {editingDomainForms[domain.id]?.proxied ? "通過Proxy處理" : "僅DNS"}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="space-y-2 md:col-span-1">
                                    <Label className="text-sm font-medium">TTL</Label>
                                    {
                                      !editingDomainForms[domain.id]?.proxied ?
                                        <Select
                                          value={editingDomainForms[domain.id]?.ttl?.toString() || '1'}
                                          onValueChange={(value) => setEditingDomainForms((prev: any) => ({ 
                                            ...prev, 
                                            [domain.id]: { ...prev[domain.id], ttl: parseInt(value) }
                                          }))}
                                        >
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {ttlOptions.map((option) => (
                                              <SelectItem key={option.value} value={option.value.toString()}>
                                                {option.label}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      : 
                                        <p className="text-sm text-muted-foreground">自動</p>
                                    }
                                  </div>
                                </div>

                                <hr className="my-4" />
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium">註解</Label>
                                  <div className="col-span-3 space-y-2">
                                    <Input
                                      value={editingDomainForms[domain.id]?.comment || ''}
                                      onChange={(e) => setEditingDomainForms((prev: any) => ({ 
                                        ...prev, 
                                        [domain.id]: { ...prev[domain.id], comment: e.target.value }
                                      }))}
                                      placeholder="選填，在此處輸入您的註解(上限100字)"
                                      className='flex-1'
                                    />
                                  </div>
                                </div>
                                <div className="space-y-2 mt-2">
                                  <Label className="text-sm font-medium">標籤</Label>
                                  <div className="col-span-3 space-y-2">
                                    <div className="flex flex-wrap items-center gap-1 px-3 py-2 border rounded-md bg-background flex-1 min-h-10 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                                      {editingDomainForms[domain.id]?.tags?.map((tag: string, index: number) => (
                                        <Badge key={index} variant="secondary" className="flex items-center gap-1 h-6 text-xs">
                                          {tag}
                                          <button
                                            type="button"
                                            onClick={() => handleRemoveTag(tag, 'update', domain.id)}
                                            className="ml-1 hover:text-red-500"
                                          >
                                            ×
                                          </button>
                                        </Badge>
                                      ))}
                                      <Input
                                        id="tags"
                                        placeholder={editingDomainForms[domain.id]?.tags?.length > 0 ? "" : "輸入標籤後按 Enter 新增"}
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={(e) => handleAddTag(e, 'update', domain.id)}
                                        className="flex-1 border-0 shadow-none focus-visible:ring-0 h-6 min-w-[120px] p-0 text-sm"
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="flex justify-end gap-2 mt-4">
                                  <Button variant="outline" size="sm" onClick={() => handleEditSubdomainOpen(domain.id)}>
                                    取消
                                  </Button>
                                  <Button size="sm" onClick={() => handleEditSubdomainSubmit(domain.id)} disabled={editingDomainForms[domain.id]?.contentError || !editingDomainForms[domain.id]?.name?.trim()}>
                                    儲存變更
                                  </Button>
                                </div>
                              </div>
                            )
                          }
                          </React.Fragment>
                        ))
                      }

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="pt-4 flex justify-center">
                          <Pagination>
                            <PaginationContent>
                              <PaginationItem>
                                <PaginationPrevious 
                                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                              </PaginationItem>
                              
                              {[...Array(totalPages)].map((_, i) => {
                                const page = i + 1;
                                // Show first, last, current, and pages around current
                                if (
                                  page === 1 ||
                                  page === totalPages ||
                                  (page >= currentPage - 1 && page <= currentPage + 1)
                                ) {
                                  return (
                                    <PaginationItem key={page}>
                                      <PaginationLink
                                        onClick={() => setCurrentPage(page)}
                                        isActive={currentPage === page}
                                        className="cursor-pointer"
                                      >
                                        {page}
                                      </PaginationLink>
                                    </PaginationItem>
                                  );
                                }
                                if (
                                  page === currentPage - 2 ||
                                  page === currentPage + 2
                                ) {
                                  return (
                                    <PaginationItem key={page}>
                                      <PaginationEllipsis />
                                    </PaginationItem>
                                  );
                                }
                                return null;
                              })}
                              
                              <PaginationItem>
                                <PaginationNext 
                                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                              </PaginationItem>
                            </PaginationContent>
                          </Pagination>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* 憑證設定 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-blue-500" />
                  <div>
                    <h3 className="font-medium">邊緣憑證</h3>
                    <p className="text-sm text-muted-foreground">配置子域名的邊緣憑證設定</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="text-green-600 border-green-600 text-xs sm:text-sm whitespace-nowrap px-2 py-1"
                  >
                    {certificateSettings.length}個已配置
                  </Badge>
                  
                  {
                    isReadOnly ? null : (
                      <Dialog open={isUploadCertificateOpen} onOpenChange={handleCreateCertificateOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            上傳憑證
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>上傳自訂 SSL 憑證和金鑰</DialogTitle>
                            <DialogDescription>輸入私密金鑰和憑證。</DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-6 py-4">
                            {/* 主域名選擇 */}
                            <div className="space-y-3">
                              <Label className="text-sm font-medium">主域名</Label>
                              <Select value={uploadCertificateForm.zone} onValueChange={(value) => setUploadCertificateForm((prev: any) => ({ ...prev, zone: value }))}>
                                <SelectTrigger>
                                  <SelectValue placeholder="選擇主域名" />
                                </SelectTrigger>
                                <SelectContent>
                                  {zoneSettings.map((zone, index) => (
                                    <SelectItem key={index} value={zone.name}>
                                      {zone.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* SSL 憑證 */}
                            <div className="space-y-3">
                              <Label className="text-sm font-medium">SSL 憑證</Label>
                              <p className="text-sm text-muted-foreground">貼上憑證,如下面字行所示:</p>
                              <div className="relative">
                                <Textarea
                                  placeholder="-----BEGIN CERTIFICATE-----
    QmFzZTY0IGVuY29kZWQgY2VydGlmaWNhdGUgZGF0YSBIeGlzdHMgaGVyZQ==
    -----END CERTIFICATE-----"
                                  value={uploadCertificateForm.sslCertificate}
                                  onChange={(e) => setUploadCertificateForm((prev: any) => ({ ...prev, sslCertificate: e.target.value }))}
                                  className="min-h-[120px] font-mono text-sm"
                                />
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="absolute top-2 right-2 h-6 px-2 text-xs"
                                  onClick={() => handleFileSelect('certificate')}
                                >
                                  從檔案貼上憑證
                                </Button>
                              </div>
                            </div>

                            {/* 組合方法 */}
                            <div className="space-y-3">
                              <Label className="text-sm font-medium">組合方法</Label>
                              <Select value={uploadCertificateForm.combinationMethod} onValueChange={(value) => setUploadCertificateForm((prev: any) => ({ ...prev, combinationMethod: value }))}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="ubiquitous">相容 (建議)</SelectItem>
                                  <SelectItem value="optimal">最新</SelectItem>
                                  <SelectItem value="force">使用者定義</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {/* 私密金鑰 */}
                            <div className="space-y-3">
                              <Label className="text-sm font-medium">私密金鑰</Label>
                              <p className="text-sm text-muted-foreground">貼上金鑰,如下面字行所示:</p>
                              <div className="relative">
                                <Textarea
                                  placeholder="-----BEGIN PRIVATE KEY-----
    QmFzZTY0IGVuY29kZWQgcHJpdmF0ZSBrZXkgZGF0YSBIeGlzdHMgaGVyZQ==
    -----END PRIVATE KEY-----"
                                  value={uploadCertificateForm.privateKey}
                                  onChange={(e) => setUploadCertificateForm((prev: any) => ({ ...prev, privateKey: e.target.value }))}
                                  className="min-h-[120px] font-mono text-sm"
                                />
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="absolute top-2 right-2 h-6 px-2 text-xs"
                                  onClick={() => handleFileSelect('privateKey')}
                                >
                                  從檔案貼上私密金鑰
                                </Button>
                              </div>
                            </div>
                            {/* 舊版用戶端支援 */}
                            <div className="space-y-3">
                              <Label className="text-sm font-medium">舊版用戶端支援</Label>
                              <Select value={uploadCertificateForm.legacyClientSupport} onValueChange={(value) => setUploadCertificateForm((prev: any) => ({ ...prev, legacyClientSupport: value }))}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="custom">最新 (建議)</SelectItem>
                                  <SelectItem value="legacy_custom">舊版</SelectItem>
                                </SelectContent>
                              </Select>
                              <p className="text-xs text-muted-foreground">
                                針對在 TLS 交握中不含 SNI 的舊版用戶端啟用支援。
                              </p>
                            </div>
                          </div>

                          <DialogFooter>
                            <Button variant="outline" onClick={() => handleCreateCertificateOpen(false)}>
                              關閉
                            </Button>
                            <Button onClick={handleUploadCertificate} disabled={!uploadCertificateForm.sslCertificate?.trim() || !uploadCertificateForm.privateKey?.trim() || !uploadCertificateForm.zone}>
                              上傳自訂憑證
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )
                  }
                </div>
              </div>

              {/* 憑證列表 */}
              {certificateSettings.length > 0 && (
                <div className="ml-8 space-y-2">
                  <div className="grid grid-cols-12 gap-4 p-3 border-b font-medium text-sm text-muted-foreground">
                    <div className="col-span-3">主機</div>
                    <div className="col-span-2">類型</div>
                    <div className="col-span-2">狀態</div>
                    <div className="col-span-2">到期日</div>
                    <div className="col-span-3"></div>
                  </div>
                  {
                    certificateSettings.map((certificate: any, index: number) => (
                      <React.Fragment key={index}>
                        <div className="grid grid-cols-12 gap-4 items-center p-3 border rounded-lg bg-muted/30">
                          <div className="col-span-3">
                            <p className="font-medium text-sm">{certificate.hosts.join(", ")}</p>
                          </div>

                          <div className="col-span-2">
                            <p className="font-medium text-sm">{certificate.type === 'universal' ? '通用' : certificate.type === 'total_tls' ? '進階 - Total TLS' : '自訂'}</p>
                          </div>

                          <div className="col-span-2">
                            <Badge 
                              variant='outline'
                              className={`text-xs ${
                                certificate.status === 'active' 
                                  ? 'text-green-600 border-green-600' 
                                  : 'text-orange-600 border-orange-600'
                              }`}
                            >
                              {certificate.status === 'active' ? '使用中' : certificate.status}
                            </Badge>
                          </div>

                          <div className="col-span-2">
                            <p className="font-medium text-sm">
                              {certificate.certificates && certificate.certificates.length > 0 
                                ? new Date(certificate.certificates[0].expires_on).toLocaleDateString('zh-TW', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit'
                                  }).replace(/\//g, '/')
                                : ''
                              }
                            </p>
                          </div>

                          <div className="col-span-3 flex justify-end">
                            {/* 展開/收合按鈕 */}
                            {certificate.certificates && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleCertificateDetails(certificate.hosts[0])}
                                className="h-8 w-8 p-0"
                              >
                                {expandedCertificateDetails[certificate.hosts?.[0]] ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                            )}
                            {
                              certificate.type === 'legacy_custom' && !isReadOnly ? (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                  onClick={() => handleDeleteCertificateOpen(certificate)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              ) : null
                            }
                          </div>
                        </div>

                        {/* 憑證詳細信息 - 可收合 */}
                        {certificate.certificates && expandedCertificateDetails[certificate.hosts[0]] && (
                          <div className="ml-4 p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/30 animate-in slide-in-from-top-2 duration-200">
                            <h4 className="font-medium text-sm mb-4 text-blue-700 dark:text-blue-300">
                              {certificate.hosts.join(", ")} 憑證
                            </h4>
                            {/* <p className="text-sm text-blue-600 dark:text-blue-400 mb-4">
                              下面所列套件中的憑證由 Cloudflare 管理和自動續訂。
                            </p> */}
                            
                            {/* 憑證列表 */}
                            <div className="space-y-3">
                              {certificate.certificates.map((cert: any, certIndex: number) => (
                                <div key={certIndex} className="p-3 border rounded-lg bg-white dark:bg-gray-800">
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="font-medium text-gray-700 dark:text-gray-300">憑證:</span>
                                      <span className="ml-2 text-gray-600 dark:text-gray-400">{cert.signature}</span>
                                    </div>
                                    <div>
                                      <span className="font-medium text-gray-700 dark:text-gray-300">到期:</span>
                                      <span className="ml-2 text-gray-600 dark:text-gray-400">
                                        {new Date(cert.expires_on).toLocaleDateString('zh-TW')} {certificate.type !== 'legacy_custom' ? '(由 Cloudflare 管理)' : ''}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* 額外信息 */}
                            <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                              {certificate.validity_days ? <p>憑證有效時間 {certificate.validity_days} 天</p> : null}
                              {certificate.validation_method ? <p>憑證驗證方法 {certificate.validation_method?.toUpperCase()}</p> : null}
                              <p>憑證授權單位 {certificate.certificate_authority === 'google' ? 'Google Trust Services' : certificate.certificate_authority}</p>
                            </div>
                          </div>
                        )}
                      </React.Fragment>
                    ))
                  }
                </div>
              )}
            </div>
          </CardContent>
        </Card>
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

      {/* 主域名刪除確認對話框 */}
      <Dialog open={isZoneDeleteConfirmOpen} onOpenChange={setIsZoneDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />確認刪除主域名
            </DialogTitle>
            <DialogDescription>
              您確定要刪除域名 <span className="font-medium text-foreground">{deleteZoneName}</span> 嗎？此操作無法撤銷。
              <br/><span className="text-red-500">若有設定子域名將一併做刪除。</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsZoneDeleteConfirmOpen(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleDeleteZoneSubmit}>
              <Trash2 className="h-4 w-4 mr-2" />
              確認刪除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 子域名刪除確認對話框 */}
      <Dialog open={isSubdomainDeleteConfirmOpen} onOpenChange={setIsSubdomainDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              確認刪除子域名
            </DialogTitle>
            <DialogDescription>
              您確定要刪除子域名 <span className="font-medium text-foreground">{domainSettings.find(item => item.id === deleteSubdomain)?.name}</span> 嗎？此操作無法撤銷。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsSubdomainDeleteConfirmOpen(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleDeleteSubdomainSubmit}>
              <Trash2 className="h-4 w-4 mr-2" />
              確認刪除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 子域名信息對話框 */}
      <Dialog open={isSubdomainInfoOpen} onOpenChange={setIsSubdomainInfoOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Label className="text-sm font-medium">CNAME 尾碼:</Label>
                <div className="col-span-2 flex items-start gap-2">
                  <code className="px-2 py-1 bg-muted rounded text-sm font-mono break-all leading-relaxed">
                    cdn.cloudflare.net
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 mt-1"
                    onClick={() => copyToClipboard('cdn.cloudflare.net', `cdn.cloudflare.net`)}
                  >
                  {copiedField === `cdn.cloudflare.net` ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </DialogTitle>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              CNAME尾碼設定說明
            </DialogTitle>
            {/* <DialogDescription>
              關於CNAME尾碼設定的詳細說明和使用範例
            </DialogDescription> */}
          </DialogHeader>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            <div>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                範例: www.subdomain.twister5.cf
              </p>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                複製上方的CNAME 尾碼: cdn.cloudflare.net
              </p>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                在您的DNS伺服器中新增 www.subdomain.twister5.cf 的 CNAME 記錄，並將它指向 subdomain.twister5.cf.cdn.cloudflare.net。
              </p>
            </div>
           {/*             
            <div>
              <h4 className="font-bold text-black mb-3">範例:</h4>
              <p className="font-bold text-black mb-2">www.subdomain.twister5.cf</p>
              <p className="font-bold text-black mb-2">複製DNS TXT 記錄設定內的CNAME 尾碼: cdn.cloudflare.net</p>
              <p className="font-bold text-black">在您的DNS伺服器中新增 www.subdomain.twister5.cf 的 CNAME 記錄，並將它指向 subdomain.twister5.cf.cdn.cloudflare.net。</p>
            </div> */}

            <div>
              <h4 className="font-semibold text-sm mb-3">設定示意圖</h4>
              <div className="border rounded-lg p-2 bg-gray-50">
                <Image
                  src="/images/dns_cname.png"
                  alt="DNS CNAME 設定示意圖"
                  width={800}
                  height={300}
                  className="w-full h-auto rounded"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsSubdomainInfoOpen(false)}>了解</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 憑證刪除確認對話框 */}
      <Dialog open={isDeleteCertificateOpen} onOpenChange={setIsDeleteCertificateOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              確認刪除憑證
            </DialogTitle>
            <DialogDescription>
              您確定要刪除憑證 <span className="font-medium text-foreground">
                {selectedCertificate?.hosts?.join(", ")}
              </span> 嗎？此操作無法撤銷。
              <br/>
              <span className="text-red-500">刪除憑證可能會影響網站的 HTTPS 連線。</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDeleteCertificateOpen(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleDeleteCertificateSubmit}>
              <Trash2 className="h-4 w-4 mr-2" />
              確認刪除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}

// 新增多選組件
interface MultiSelectProps {
  options: Array<{ code: string; name: string; country: string }>
  selectedValues: Array<{ code: string; name: string; country: string }>
  onSelectionChange: (selected: Array<{ code: string; name: string; country: string }>) => void
  placeholder: string
  className?: string
}

export default function DNSSettingsPageWrapper() {
  return (
    // <RoleGuard allowedRoles={['user',]}>
    //   <DNSSettingsPage />
    // </RoleGuard>
    <DNSSettingsPage />
  )
}