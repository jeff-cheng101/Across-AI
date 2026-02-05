"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { Shield, Globe, Activity, Settings, CheckCircle, Check, ChevronDown, Plus, Trash2, Ban, CheckCircle2, Flag, Search, Bot, X, Minus, ExternalLink } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { LoadingOverlay } from '@/components/ui/loading-overlay'
import { RoleGuard } from "@/components/role-guard"
import { RingLoader } from 'react-spinners'
import authenticator from "@/app/util/authenticator"
import { notifyError, notifySuccess } from "@/app/util/notify"
import { 
  getZonesByContractNo,
  getDnsByContractNo,
  getWafPolicySettings,
  getGeolocationList,
  updateWafPolicySettings,
  getBotPolicySettings,
  updateBotPolicySettings,
  updateCustomPolicySettings,
  getCustomPolicySettings,
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
  name: string
  type: string
  content: string
  proxied: boolean
  ttl: string | number
  zone: string
}

function WAFManagePage() {
  const router = useRouter()
  const [auth, setAuth] = useState<any>(null)
  let wafPermission = "2"
  // const wafPermission = auth?.role?.permissions?.waf_settings || "0"
  const isReadOnly = wafPermission === "1"
  const notPermission = wafPermission === "0"
  // useEffect(() => {
  //   if (auth) {
  //     // 如果為維運帳號登入，並且訂單含此服務，則不限制
  //     if (auth.maintainer && auth?.contract?.module?.includes('waf')) return
  //     if (notPermission || !auth?.contract?.module?.includes('waf')) {
  //       router.push('/dashboard')
  //     }
  //   }
  // }, [auth, notPermission, router])

  const [zoneSettings, setZoneSettings] = useState<ZoneSetting[]>([])
  const [domainSettings, setDomainSettings] = useState<DnsSetting[]>([])
  // WAF 政策
  const [isWafPolicyDialogOpen, setIsWafPolicyDialogOpen] = useState(false)
  const [wafPolicySettings, setWafPolicySettings] = useState<any>({})
  const [selectedSubdomain, setSelectedSubdomain] = useState<string>('')
  const [currentTab, setCurrentTab] = useState("blacklist")
  const [blacklistInput, setBlacklistInput] = useState("")
  const [blacklist, setBlacklist] = useState<any[]>([])
  const [whitelistInput, setWhitelistInput] = useState("")
  const [whitelist, setWhitelist] = useState<any[]>([])
  const [blockedCountries, setBlockedCountries] = useState<any[]>([])
  const [countryAccessMode, setCountryAccessMode] = useState("block") // 新增：國家訪問控制模式
  const [ipError, setIpError] = useState("")
  const [countries, setCountries] = useState<any[]>([])  // 國家列表

  const [isBotPolicyDialogOpen, setIsBotPolicyDialogOpen] = useState(false)
  const [botPolicySettings, setBotPolicySettings] = useState<any>({})
  const [botTrafficTab, setBotTrafficTab] = useState("known_bot")            //known_bot, verified_bot
  const [showKnownBotForm, setShowKnownBotForm] = useState(false)            // 是否顯示新增/編輯表單
  const [editKnownBotForm, setEditKnownBotForm] = useState<any>(null)
  const botCategories = [
    { value: "Search Engine Crawler", label: "搜尋引擎網路爬蟲" },
    { value: "Search Engine Optimization", label: "搜尋引擎最佳化" },
    { value: "Monitoring & Analytics", label: "監視與分析" },
    { value: "Advertising & Marketing", label: "廣告與行銷" },
    { value: "Page Preview", label: "頁面預覽" },
    { value: "Academic Research", label: "學術研究" },
    { value: "Security", label: "網路安全" },
    { value: "Accessibility", label: "協助工具" },
    { value: "Webhooks", label: "Webhook" },
    { value: "Feed Fetcher", label: "摘要擷取器" },
    { value: "AI Crawler", label: "AI 網路爬蟲" },
    { value: "Aggregator", label: "聚合器" },
    { value: "AI Assistant", label: "AI 輔助程式" },
    { value: "AI Search", label: "AI 搜尋" },
    { value: "Archiver", label: "封存器" },
    { value: "Other", label: "其他" },
  ]
  const [editVerifiedBotForm, setEditVerifiedBotForm] = useState<any>({ type: "eq", value: [], action: "block" })
  const [selectedBotCategories, setSelectedBotCategories] = useState<any[]>([])
  const [showVerifiedBotForm, setShowVerifiedBotForm] = useState(false) // 是否顯示新增/編輯表單
  const [isEditMode, setIsEditMode] = useState(false) // 是否為編輯模式

  const [isCustomPolicyDialogOpen, setIsCustomPolicyDialogOpen] = useState(false)
  const [customPolicySettings, setCustomPolicySettings] = useState<any>({})
  const [customDomainRuleList, setCustomDomainRuleList] = useState<any[]>([])
  const [showCustomRuleForm, setShowCustomRuleForm] = useState(false)
  const [editCustomRuleForm, setEditCustomRuleForm] = useState<any>(null)
  const [expandedRuleIndex, setExpandedRuleIndex] = useState<number | null>(null)
  const types = [{ value: "user_agent", label: "使用者代理程式" },{ value: "header", label: "標頭" },{ value: "full_uri", label: "完整 URI" }]
  const [customRuleFieldTypes, setCustomRuleFieldTypes] = useState<any[]>(types)
  const customRuleOperators = [
    { value: "wildcard", label: "萬用字元" },
    { value: "eq", label: "等於" },
    { value: "ne", label: "不等於" },
    { value: "contains", label: "包含" },
    { value: "not_contains", label: "不包含" },
    { value: "starts_with", label: "開頭為" },
    { value: "ends_with", label: "結尾為" },
  ]
  const customRuleOperators2 = [
    { value: "eq", label: "等於" },
    { value: "ne", label: "不等於" },
    { value: "contains", label: "包含" },
    { value: "not_contains", label: "不包含" }
  ]
  
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
      const [ipPart, subnetMask] = trimmedIp.split('/')
      const mask = parseInt(subnetMask)
      
      // 判斷是IPv4還是IPv6
      if (ipPart.includes(':')) {
        // IPv6 CIDR
        if (!validateIPv6(ipPart)) {
          return { isValid: false, message: "IPv6格式不正確" }
        }
        
        if (mask < 1 || mask > 128) {
          return { isValid: false, message: "IPv6子網掩碼必須在 1-128 之間" }
        }
        
        return { isValid: true, message: "" }
      } else {
        // IPv4 CIDR
        const ipv4Regex = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
        if (!ipv4Regex.test(ipPart)) {
          return { isValid: false, message: "IPv4網段格式不正確，請使用 x.x.x.0/x 格式" }
        }
        
        // 檢查IPv4網段最後一個數字是否為0
        const ipOctets = ipPart.split('.')
        const lastOctet = parseInt(ipOctets[3])
        if (lastOctet !== 0) {
          return { isValid: false, message: "IPv4網段的最後一個數字必須是0，請使用 x.x.x.0/x 格式" }
        }
        
        if (mask < 8 || mask > 30) {
          return { isValid: false, message: "IPv4子網掩碼必須在 8-30 之間" }
        }
        
        return { isValid: true, message: "" }
      }
    } else {
      // 單個IP地址的驗證
      if (trimmedIp.includes(':')) {
        // IPv6
        if (validateIPv6(trimmedIp)) {
          return { isValid: true, message: "" }
        } else {
          return { isValid: false, message: "IPv6格式不正確，請輸入有效的IPv6地址" }
        }
      } else {
        // IPv4
        if (validateIPv4(trimmedIp)) {
          return { isValid: true, message: "" }
        } else {
          return { isValid: false, message: "IPv4格式不正確，請輸入有效的IPv4地址" }
        }
      }
    }
  }

  const validateIpRange = (ipRange: string) => {
    // 重複使用統一的IP驗證邏輯，支援IPv4和IPv6
    return validateIp(ipRange)
  }

  useEffect(() => {
    (async () => {
      const auth = authenticator.authValue;
      setAuth(auth)
      // const permission = auth?.role?.permissions?.waf_settings || "0"
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
      let dnsSettings: any = []
      let type = ['A', 'AAAA', 'CNAME']
      for (let dnsRecord of dnsRecords) {
        if (!dnsSettings.find((dns: any) => dns.name === dnsRecord.name) && type.includes(dnsRecord.type)) {
          dnsSettings.push({
            name: dnsRecord.name,
            type: dnsRecord.type,
            content: dnsRecord.content,
            proxied: dnsRecord.proxied,
            ttl: dnsRecord.ttl,
            zone: dnsRecord.zone
          })
        }
      }
      setDomainSettings(dnsSettings);

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
  // WAF 政策設定
  ////////////////////////////////

  const handleWafPolicyDialogOpen = async (open: boolean) => {
    const { contract } = auth as any
    if (open) {
      setIsLoading(true)
      try {
        const wafPolicyResp = await getWafPolicySettings(contract?.contractNo || null)
        const wafPolicySettings = wafPolicyResp.data || []
        const { blackIpList, whiteIpList, countryList } = wafPolicySettings
        setWafPolicySettings({ blackIpList, whiteIpList, countryList })

        const geolocationResp = await getGeolocationList()
        const geolocationSettings = geolocationResp.data || []
        setCountries(geolocationSettings)
      } catch (error: any) {
        console.log(error)
        if (error.response?.data?.message && (error.response?.data?.message === 'Unauthorized' || error.response?.data?.message === 'jwt expired')) {
          notifyError('Unauthorized')
        } else {
          notifyError('取得WAF政策設定失敗')
        }
      }
      setIsLoading(false)
    } else {
      setSelectedSubdomain('')
      setBlacklist([])
      setWhitelist([])
      setBlockedCountries([])
      setCurrentTab('blacklist')
      setCountryAccessMode('block')
    }
    setIsWafPolicyDialogOpen(open)
  }

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab)
    setSelectedSubdomain('')
    setIpError('')
    setBlacklistInput('')
    setWhitelistInput('')
  }

  const handleSelectedSubdomainChange = (domainName: string, type: string) => {
    setSelectedSubdomain(domainName)
    
    if (domainName) {
      if (type === 'blacklist') {
        const blackLists = wafPolicySettings.blackIpList
        if (blackLists[domainName] && blackLists[domainName].length > 0) {
          setBlacklist(blackLists[domainName] || [])
        } else {
          setBlacklist([])
        }
      } else if (type === 'whitelist') {
        const whiteList = wafPolicySettings.whiteIpList
        if (whiteList[domainName] && whiteList[domainName].length > 0) {
          setWhitelist(whiteList[domainName] || [])
        } else {
          setWhitelist([])
        }
      } else if (type === 'country') {
        const countryList = wafPolicySettings.countryList
        if (countryList[domainName] && countryList[domainName].length > 0) {
          setCountryAccessMode(countryList[domainName][0].accessMode)
          setBlockedCountries(countryList[domainName] || [])
        } else {
          setBlockedCountries([])
          setCountryAccessMode('block')
        }
      }
    } else {
      // 当选择空值时，清空对应的列表
      if (type === 'blacklist') {
        setBlacklist([])
      } else if (type === 'whitelist') {
        setWhitelist([])
      } else if (type === 'country') {
        setBlockedCountries([])
        setCountryAccessMode('block')
      }
    }
  }

  const handleBlacklistInputChange = (value: string) => {
    setBlacklistInput(value)
    if (value.trim()) {
      let validation = { isValid: false, message: "" }
      if (value.includes("/")) {
        validation = validateIpRange(value.trim())
      } else {
        validation = validateIp(value.trim())
      }
      if (validation.isValid) {
        setIpError('')
      } else {
        setIpError(validation.message)
      }
    }
  }

  const addToBlacklist = () => {
    if (ipError === '') {
      let newBlacklist = [...new Set([ ...blacklist, blacklistInput.trim() ])]
      setBlacklist(newBlacklist)
      setBlacklistInput("")
    }
  }

  const handleWhitelistInputChange = (value: string) => {
    setWhitelistInput(value)
    if (value.trim()) {
      let validation = { isValid: false, message: "" }
      if (value.includes("/")) {
        validation = validateIpRange(value.trim())
      } else {
        validation = validateIp(value.trim())
      }
      if (validation.isValid) {
        setIpError('')
      } else {
        setIpError(validation.message)
      }
    }
  }

  const addToWhitelist = () => {
    if (ipError === '') {
      let newWhitelist = [...new Set([ ...whitelist, whitelistInput.trim() ])]
      setWhitelist(newWhitelist)
      setWhitelistInput("")
    }
  }

  const removeFromBlacklist = (index: number) => {
    setBlacklist((prev) => prev.filter((_, i) => i !== index))
  }

  const removeFromWhitelist = (index: number) => {
    setWhitelist((prev) => prev.filter((_, i) => i !== index))
  }

  // 移除 addBlockedCountry 函數，因為現在直接使用 setBlockedCountries

  const removeBlockedCountry = (countryCode: string) => {
    setBlockedCountries((prev) => prev.filter((country) => country.code !== countryCode))
  }

  const handleWafPolicySubmit = async() => {
    const { contract } = auth as any
    if (!selectedSubdomain) {
      notifyError('請選擇要設定的域名')
    } else {
      setIsLoading(true)
      console.log(currentTab)
      const subdomains = domainSettings.filter((domain) => domain.name === selectedSubdomain)
      if (currentTab === 'blacklist') {
        const data = { blackIpList: blacklist, subdomains, contractNo: contract?.contractNo || null }
        await updateWafPolicySettings(data, currentTab)
        .then(() => {
          notifySuccess('黑名單設定成功')
          handleWafPolicyDialogOpen(false)
        })
        .catch((error: any) => {
          console.log(error)
          if (error.response?.data?.message && error.response?.data?.message === 'Unauthorized') {
            notifyError('Unauthorized')
          } else {
            notifyError('黑名單設定失敗')
          }
        })
        .finally(() => {
          setIsLoading(false)
        })
      } else if (currentTab === 'whitelist') {
        const data = { whiteIpList: whitelist, subdomains, contractNo: contract?.contractNo || null }
        await updateWafPolicySettings(data, currentTab)
        .then(() => {
          notifySuccess('白名單設定成功')
          handleWafPolicyDialogOpen(false)
        })
        .catch((error: any) => {
          console.log(error)
          if (error.response?.data?.message && error.response?.data?.message === 'Unauthorized') {
            notifyError('Unauthorized')
          } else {
            notifyError('白名單設定失敗')
          }
        })
        .finally(() => {
          setIsLoading(false)
        })
      } else if (currentTab === 'country') {
        const data = { countryList: blockedCountries, countryAccessMode, subdomains, contractNo: contract?.contractNo || null }
        await updateWafPolicySettings(data, currentTab)
        .then(() => {
          notifySuccess('國家設定成功')
          handleWafPolicyDialogOpen(false)
        })
        .catch((error: any) => {
          console.log(error)
          if (error.response?.data?.message && error.response?.data?.message === 'Unauthorized') {
            notifyError('Unauthorized')
          } else {
            notifyError('國家設定失敗')
          }
        })
        .finally(() => {
          setIsLoading(false)
        })
      }
    }
  }

  ////////////////////////////////
  // BOT Traffic 設定
  ////////////////////////////////

  const handleBotPolicyDialogOpen = async (open: boolean) => {
    const { contract } = auth as any
    if (open) {
      setIsLoading(true)
      try {
        const botPolicyResp = await getBotPolicySettings(contract?.contractNo || null)
        const botPolicySettings = botPolicyResp.data || []
        console.log(botPolicyResp)
        const { knownBotList, verifiedCategoryList } = botPolicySettings
        setBotPolicySettings({ knownBotList, verifiedCategoryList })
      } catch (error: any) {
        console.log(error)
        if (error.response?.data?.message && (error.response?.data?.message === 'Unauthorized' || error.response?.data?.message === 'jwt expired')) {
          notifyError('Unauthorized')
        } else {
          notifyError('取得 Bot 政策設定失敗')
        }
      }
      setIsLoading(false)
    } else {
      setSelectedSubdomain('')
      setShowKnownBotForm(false)
      setEditKnownBotForm(null)
      setShowVerifiedBotForm(false)
      setEditVerifiedBotForm({ type: "eq", value: [], action: "block" })
    }
    setIsBotPolicyDialogOpen(open)
  }

  const handleBotTabChange = (tab: string) => {
    setBotTrafficTab(tab)
    setSelectedSubdomain('')
    setShowKnownBotForm(false)
    setEditKnownBotForm(null)
    setShowVerifiedBotForm(false)
    setEditVerifiedBotForm({ type: "eq", value: [], action: "block" })
    setSelectedBotCategories([])
  }

  const handleBotSelectedSubdomainChange = (domainName: string, type: string) => {
    setSelectedSubdomain(domainName)

    if (domainName) {
      if (type === 'known_bot') {
        const knownBotList = botPolicySettings.knownBotList
        console.log(botPolicySettings)
        if (knownBotList && knownBotList[domainName]) {
          setEditKnownBotForm({ value: knownBotList[domainName].value, action: knownBotList[domainName].action })
          setShowKnownBotForm(true)
        } else {
          setEditKnownBotForm(null)
          setShowKnownBotForm(false)
        }
      } else if (type === 'verified_bot') {
        const verifiedCategoryList = botPolicySettings.verifiedCategoryList
        if (verifiedCategoryList && verifiedCategoryList[domainName]) {
          const existingRule = verifiedCategoryList[domainName]
          const value = Array.isArray(existingRule.value) ? existingRule.value : [existingRule.value]
          const categories = value.map((v: string) => ({
            value: v,
            label: botCategories.find(c => c.value === v)?.label || v
          }))
          setEditVerifiedBotForm({ type: existingRule.type || 'eq', value: categories || [], action: existingRule.action || 'block' })
          setSelectedBotCategories(categories)
          setShowVerifiedBotForm(true)
        } else {
          setEditVerifiedBotForm({ type: "eq", value: [], action: "block" })
          setShowVerifiedBotForm(false)
        }
      }
    } else {
      if (type === 'known_bot') {
        setEditKnownBotForm(null)
        setShowKnownBotForm(false)
      } else if (type === 'verified_bot') {
        setEditVerifiedBotForm(null)
        setShowVerifiedBotForm(false)
      }
    }
  }

  const createKnownBotRule = () => {
    setEditKnownBotForm({ value: true, action: "block" })
    setShowKnownBotForm(true)
  }
  // 移除 Known Bot 規則
  const removeKnownBotRule = () => {
    setEditKnownBotForm(null)
    setShowKnownBotForm(false)
  }

  const createVerifiedBotRule = () => {
    setEditVerifiedBotForm({ type: "eq", value: [], action: "block" })
    setShowVerifiedBotForm(true)
  }
  // 移除 Verified Bot 規則
  const removeVerifiedBotRule = () => {
    setEditVerifiedBotForm(null)
    setShowVerifiedBotForm(false)
    setSelectedBotCategories([])
  }

  const handleBotPolicySubmit = async() => {
    const { contract } = auth as any
    if (!selectedSubdomain) {
      notifyError('請選擇要設定的域名')
    } else {
      setIsLoading(true)
      const subdomains = domainSettings.filter((domain) => domain.name === selectedSubdomain)
      let data = {}
      if (botTrafficTab === 'known_bot') {
        data = { knownBotRule: editKnownBotForm, subdomains, contractNo: contract?.contractNo || null }
      } else {
        data = { verifiedBotRule: { ...editVerifiedBotForm, value: selectedBotCategories.map((category) => category.value) }, subdomains, contractNo: contract?.contractNo || null }
      }
      await updateBotPolicySettings(data, botTrafficTab)
        .then(() => {
          notifySuccess('設定成功')
          handleBotPolicyDialogOpen(false)
        })
        .catch((error: any) => {
          console.log(error)
          if (error.response?.data?.message && error.response?.data?.message === 'Unauthorized') {
            notifyError('Unauthorized')
          } else {
            notifyError('設定失敗')
          }
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }

  ////////////////////////////////
  // 自訂規則
  ////////////////////////////////

  const handleCustomPolicyDialogOpen = async (open: boolean) => {
    const { contract } = auth as any
    if (open) {
      setIsLoading(true)
      try {
        const customPolicyResp = await getCustomPolicySettings(contract?.contractNo || null)
        const customPolicySettings = customPolicyResp.data || []
        const { customPolicyList } = customPolicySettings
        setCustomPolicySettings({ customRuleList: customPolicyList })
      } catch (error: any) {
        console.log(error)
        if (error.response?.data?.message && (error.response?.data?.message === 'Unauthorized' || error.response?.data?.message === 'jwt expired')) {
          notifyError('Unauthorized')
        } else {
          notifyError('取得自訂規則設定失敗')
        }
      }
      setIsLoading(false)
    } else {
      setSelectedSubdomain('')
      setCustomDomainRuleList([])
      setShowCustomRuleForm(false)
      setEditCustomRuleForm(null)
      setCustomRuleFieldTypes(types)
    }
    setIsCustomPolicyDialogOpen(open)
  }

  // const handleCustomTabChange = (tab: string) => {

  // }

  const handleCustomSelectedSubdomainChange = (domainName: string) => {
    setSelectedSubdomain(domainName)

    if (domainName) {
        const customRuleList = customPolicySettings.customRuleList
        if (customRuleList && customRuleList[domainName]) {
          setCustomDomainRuleList(customRuleList[domainName])
          setShowCustomRuleForm(false)
          const existTypes = customRuleList[domainName].map((rule: any) => rule.conditions[0].field)
          const newTypes = types.filter((type) => !existTypes.includes(type.value))
          setCustomRuleFieldTypes(newTypes)
        } else {
          setCustomDomainRuleList([])
          setEditCustomRuleForm(null)
          setShowCustomRuleForm(false)
          setCustomRuleFieldTypes(types)
        }
    } else {
      setCustomDomainRuleList([])
      setEditCustomRuleForm(null)
      setShowCustomRuleForm(false)
      setCustomRuleFieldTypes(types)
    }
  }

  const createCustomRule = () => {
    if (selectedSubdomain) {
      const existTypes = customDomainRuleList.map((rule) => rule.conditions[0].field)
      const newTypes = types.filter((type) => !existTypes.includes(type.value))
      setCustomRuleFieldTypes(newTypes)
      setEditCustomRuleForm({ 
        conditions: [
          { field: newTypes[0].value, operator: newTypes[0].value === 'header' ? "eq" : "wildcard", value: "" }
        ],
        action: "block",
        isNew: true
      })
      setShowCustomRuleForm(true)
      setExpandedRuleIndex(null)
    } else {
      notifyError('請先選擇要設定的子域名')
    }
  }

  const removeCustomRule = () => {
    setEditCustomRuleForm(null)
    setShowCustomRuleForm(false)
  }

  const deleteRuleFromList = (index: number) => {
    const newList = [...customDomainRuleList]
    newList.splice(index, 1)
    setCustomDomainRuleList(newList)
    if (expandedRuleIndex === index) {
      setExpandedRuleIndex(null)
      setEditCustomRuleForm(null)
    }
  }

  const toggleRuleExpand = (index: number) => {
    // 關閉
    if (expandedRuleIndex === index) {
      setExpandedRuleIndex(null)
      setEditCustomRuleForm(null)
      const existTypes = customDomainRuleList.map((rule) => rule.conditions[0].field)
      const newTypes = types.filter((type) => !existTypes.includes(type.value))
      setCustomRuleFieldTypes(newTypes)
    } else {
    // 展開
      setExpandedRuleIndex(index)
      setEditCustomRuleForm({ ...customDomainRuleList[index] })
      const existTypes = customDomainRuleList.map((rule) => rule.conditions[0].field).filter((type) => type !== customDomainRuleList[index].conditions[0].field)
      const newTypes = types.filter((type) => !existTypes.includes(type.value))
      setCustomRuleFieldTypes(newTypes)
    }
  }

  const finishRuleEdit = () => {
    if (expandedRuleIndex !== null && editCustomRuleForm) {
      const newList = [...customDomainRuleList]
      newList[expandedRuleIndex] = { ...editCustomRuleForm }
      delete newList[expandedRuleIndex].isNew
      setCustomDomainRuleList(newList)
    }
    setExpandedRuleIndex(null)
    setEditCustomRuleForm(null)
    setCustomRuleFieldTypes(customRuleFieldTypes.filter((type) => type.value !== editCustomRuleForm.conditions[0].field))
  }

  const addNewRuleToList = () => {
    if (editCustomRuleForm && editCustomRuleForm.isNew) {
      for (let condition of editCustomRuleForm.conditions) {
        if (condition.value === '') {
          notifyError('請輸入值')
          return
        }
        if (condition.field === 'header' && condition.value === '') {
          notifyError('請輸入值')
          return
        }
      }
      const newRule = { ...editCustomRuleForm }
      delete newRule.isNew
      setCustomDomainRuleList([...customDomainRuleList, newRule])
      setShowCustomRuleForm(false)
      setEditCustomRuleForm(null)
      setCustomRuleFieldTypes(customRuleFieldTypes.filter((type) => type.value !== editCustomRuleForm.conditions[0].field))
    }
  }

  const addCondition = (logicalOperator: 'and' | 'or' = 'and') => {
    if (editCustomRuleForm) {
      const newConditions = [...editCustomRuleForm.conditions]
      newConditions.push({ field: editCustomRuleForm.conditions[0].field, operator: editCustomRuleForm.conditions[0].field === 'header' ? "eq" : "wildcard", value: "", logicalOperator })
      setEditCustomRuleForm({ ...editCustomRuleForm, conditions: newConditions })
    }
  }

  const removeCondition = (conditionIndex: number) => {
    if (editCustomRuleForm && editCustomRuleForm.conditions.length > 1) {
      const newConditions = [...editCustomRuleForm.conditions]
      newConditions.splice(conditionIndex, 1)
      if (newConditions.length === 0) {
        newConditions.push({ field: customRuleFieldTypes[0].value, operator: customRuleFieldTypes[0].value === 'header' ? "eq" : "wildcard", value: "" })
      }
      setEditCustomRuleForm({ ...editCustomRuleForm, conditions: newConditions })
    }
  }

  const updateCondition = (conditionIndex: number, field: string, value: any) => {
    if (editCustomRuleForm) {
      let newConditions = [...editCustomRuleForm.conditions]
      newConditions[conditionIndex] = { ...newConditions[conditionIndex], [field]: value }
      if (field === 'field') {
        newConditions = newConditions.map((condition) => ({ ...condition, field: value, operator: value === 'header' ? "eq" : "wildcard" }))
      }
      setEditCustomRuleForm({ ...editCustomRuleForm, conditions: newConditions })
    }
  }

  // 取得欄位類型標籤
  const getFieldTypeLabel = (type: string) => {
    const found = types.find(t => t.value === type)
    return found ? found.label : type
  }

  // 取得運算子標籤
  const getOperatorLabel = (operator: string, field: string) => {
    let found = null;
    if (field === 'header') {
      found = customRuleOperators2.find(o => o.value === operator)
    } else {
      found = customRuleOperators.find(o => o.value === operator)
    }
    return found ? found.label : operator
  }

  // 取得值的 placeholder
  const getValuePlaceholder = (field: string, operator: string) => {
    switch (field) {
      case 'user_agent':
        if (operator === 'wildcard') {
          return '例如 Mozilla/* (Macintosh; Intel Mac OS X 10_12_6)...'
        } else {
          return '例如 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6)...'
        }
      case 'full_uri':
        if (operator === 'wildcard') {
          return '例如 https://*.example.com/files/*'
        } else {
          return '例如 https://example.com/contact?page=1234'
        }
      default:
        return ''
    }
  }

  // 規則摘要顯示
  const getRuleSummary = (rule: any) => {
    if (!rule.conditions || rule.conditions.length === 0) return '(無條件)'
    const firstCondition = rule.conditions[0]
    const conditionCount = rule.conditions.length
    const summary = `${getOperatorLabel(firstCondition.operator, firstCondition.field)} "${firstCondition.value || '...'}"`
    return conditionCount > 1 ? `${summary} (+${conditionCount - 1} 條件)` : summary
  }

  const handleCustomPolicySubmit = async() => {
    const { contract } = auth as any
    if (!selectedSubdomain) {
      notifyError('請選擇要設定的域名')
    } else {
      setIsLoading(true)
      const subdomains = domainSettings.filter((domain) => domain.name === selectedSubdomain)
      await updateCustomPolicySettings({ customRuleList: customDomainRuleList, subdomains, contract: contract?.contractNo || null })
        .then(() => {
          notifySuccess('設定成功')
          handleCustomPolicyDialogOpen(false)
        })
        .catch((error: any) => {
          console.log(error)
          if (error.response?.data?.message && error.response?.data?.message === 'Unauthorized') {
            notifyError('Unauthorized')
          } else {
            notifyError('設定失敗')
          }
        })
        .finally(() => {
          setIsLoading(false)
        })
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
            <BreadcrumbPage>WAF 設定</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tighter">
          WAF防禦<span className="text-brand-primary">管理</span>
        </h1>
        <p className="mt-2 text-muted-foreground">管理您的網站應用防火牆設定，保護您的網站免受各種網路攻擊威脅</p>
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
              <Settings className="h-5 w-5 text-brand-primary" />
              WAF 設定
            </CardTitle>
            <CardDescription>配置您的網站應用防火牆設定和安全政策</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">

            {/* WAF 政策 - 增強版 */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg gap-3 sm:gap-0">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-red-500" />
                <div>
                  <h3 className="font-medium">WAF 政策</h3>
                  <p className="text-sm text-muted-foreground">配置黑白名單和國別阻擋安全規則</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Dialog open={isWafPolicyDialogOpen} onOpenChange={handleWafPolicyDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      設定
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[800px] min-h-[500px] max-h-[80vh] overflow-y-auto flex flex-col gap-4">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-red-500" />
                        WAF 安全政策設定
                      </DialogTitle>
                      <DialogDescription>配置黑名單、白名單和國別阻擋設定來加強您的網站安全防護</DialogDescription>
                    </DialogHeader>

                    <Tabs defaultValue="blacklist" className="w-full" onValueChange={handleTabChange}>
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="blacklist" className="flex items-center gap-2">
                          <Ban className="h-4 w-4" />
                          黑名單
                        </TabsTrigger>
                        <TabsTrigger value="whitelist" className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4" />
                          白名單
                        </TabsTrigger>
                        <TabsTrigger value="country" className="flex items-center gap-2">
                          <Flag className="h-4 w-4" />
                          國別阻擋
                        </TabsTrigger>
                      </TabsList>

                      {/* 黑名單設定 */}
                      <TabsContent value="blacklist" className="space-y-4">
                        <div className="space-y-4">

                          {/* 子域名選擇區域 */}
                          <div className="space-y-2 mt-5">
                            <h4 className="font-medium text-sm">選擇要加入黑名單的子域名</h4>
                            <SubdomainSelect
                              options={domainSettings}
                              selectedValue={selectedSubdomain}
                              onSelectionChange={(value) => handleSelectedSubdomainChange(value, 'blacklist')}
                              placeholder="請選擇子域名"
                              className="w-full"
                            />
                          </div>

                          {
                            isReadOnly ? null : (
                              <div className="space-y-2">
                                <h4 className="font-medium text-sm mt-5">輸入黑名單 IP</h4>
                                <div className="flex items-center gap-2">
                                  <Input
                                    placeholder="輸入 IPv4/IPv6 地址或網段 (例如: 192.168.1.0/24 或 2001:db8::/32)"
                                    value={blacklistInput}
                                    onChange={(e) => handleBlacklistInputChange(e.target.value)}
                                    className="flex-1"
                                  />
                                  <Button onClick={addToBlacklist} disabled={!blacklistInput.trim() || ipError !== ''}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    新增
                                  </Button>
                                </div>
                                <div className="flex items-center gap-2">
                                  {
                                    ipError && (
                                      <p className="text-xs text-red-500">{ipError}</p>
                                    )
                                  }
                                </div>
                              </div>
                            )
                          }

                          <div className="space-y-2">
                            <h4 className="font-medium text-sm">目前黑名單 ({blacklist.length} 項)</h4>
                            <div className="max-h-48 overflow-y-auto space-y-2">
                              {blacklist.map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-red-50 dark:bg-red-950/30">
                                  <div className="flex items-center gap-3">
                                    <Ban className="h-4 w-4 text-red-500" />
                                    <div>
                                      <p className="font-medium text-sm">{item}</p>
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeFromBlacklist(index)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      {/* 白名單設定 */}
                      <TabsContent value="whitelist" className="space-y-4">
                        <div className="space-y-4">

                          {/* 子域名選擇區域 */}
                          <div className="space-y-2 mt-5">
                            <h4 className="font-medium text-sm">選擇要加入白名單的子域名</h4>
                            <SubdomainSelect
                              options={domainSettings}
                              selectedValue={selectedSubdomain}
                              onSelectionChange={(value) => handleSelectedSubdomainChange(value, 'whitelist')}
                              placeholder="請選擇子域名"
                              className="w-full"
                            />
                          </div>

                          {
                            isReadOnly ? null : (
                              <div className="space-y-2">
                                <h4 className="font-medium text-sm mt-5">輸入白名單 IP</h4>
                                <div className="flex items-center gap-2">
                                  <Input
                                    placeholder="輸入 IPv4/IPv6 地址或網段 (例如: 192.168.1.0/24 或 2001:db8::/32)"
                                    value={whitelistInput}
                                    onChange={(e) => handleWhitelistInputChange(e.target.value)}
                                    className="flex-1"
                                  />
                                  <Button onClick={addToWhitelist} disabled={!whitelistInput.trim() || ipError !== ''}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    新增
                                  </Button>
                                </div>
                                <div className="flex items-center gap-2">
                                  {
                                    ipError && (
                                      <p className="text-xs text-red-500">{ipError}</p>
                                    )
                                  }
                                </div>
                              </div>
                            )
                          }

                          <div className="space-y-2">
                            <h4 className="font-medium text-sm">目前白名單 ({whitelist.length} 項)</h4>
                            <div className="max-h-48 overflow-y-auto space-y-2">
                              {whitelist.map((item, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-3 border rounded-lg bg-green-50 dark:bg-green-950/30"
                                >
                                  <div className="flex items-center gap-3">
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    <div>
                                      <p className="font-medium text-sm">{item}</p>
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeFromWhitelist(index)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      {/* 國別阻擋設定 */}
                      <TabsContent value="country" className="space-y-4">
                        <div className="space-y-4">

                          {/* 子域名選擇區域 */}
                          <div className="space-y-2 mt-5">
                            <h4 className="font-medium text-sm">選擇要應用此規則的子域名</h4>
                            <SubdomainSelect
                              options={domainSettings}
                              selectedValue={selectedSubdomain}
                              onSelectionChange={(value) => handleSelectedSubdomainChange(value, 'country')}
                              placeholder="請選擇子域名"
                              className="w-full"
                            />
                          </div>

                          {
                            isReadOnly ? null : (
                              <div className="space-y-3">
                                <h4 className="font-medium text-sm mt-5">訪問控制模式</h4>
                                <RadioGroup
                                  value={countryAccessMode}
                                  onValueChange={setCountryAccessMode}
                                  className="flex gap-6"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="block" id="block" />
                                    <Label htmlFor="block">阻擋</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="allow" id="allow" />
                                    <Label htmlFor="allow">放行</Label>
                                  </div>
                                </RadioGroup>
                              </div>
                            )
                          }

                          {
                            isReadOnly ? null : (
                              <div className="flex items-center gap-2">
                                <MultiSelect
                                  options={countries}
                                  selectedValues={blockedCountries}
                                  onSelectionChange={setBlockedCountries}
                                  placeholder={countryAccessMode === "block" ? "選擇要阻擋的國家" : "選擇要放行的國家"}
                                  className="flex-1"
                                />
                              </div>
                            )
                          }

                          <div className="space-y-2">
                            <h4 className="font-medium text-sm mt-5">
                              {countryAccessMode === "block" ? "目前拒絕訪問的國家" : "目前允許訪問的國家"} (
                              {blockedCountries.length} 個)
                            </h4>
                            <div className="max-h-48 overflow-y-auto space-y-2">
                              {blockedCountries.map((country) => (
                                <div
                                  key={country.code}
                                  className="flex items-center justify-between p-3 border rounded-lg bg-orange-50 dark:bg-orange-950/30"
                                >
                                  <div className="flex items-center gap-3">
                                    <Flag className="h-4 w-4 text-orange-500" />
                                    <div>
                                      <p className="font-medium text-sm">{country.name}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {country.type ? `${country.type} • ` : `國家代碼: ${country.code}`}
                                      </p>
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeBlockedCountry(country.code)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>

                    <DialogFooter className="mt-auto">
                      {
                        isReadOnly ? null : (
                          <Button onClick={() => handleWafPolicySubmit()}>完成設定</Button>
                        )
                      }
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* BOT Traffic 設定 */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg gap-3 sm:gap-0">
              <div className="flex items-center gap-3">
                <Bot className="h-5 w-5 text-blue-500" />
                <div>
                  <h3 className="font-medium">機器人流量</h3>
                  <p className="text-sm text-muted-foreground">配置機器人安全規則</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Dialog open={isBotPolicyDialogOpen} onOpenChange={handleBotPolicyDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      設定
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[800px] min-h-[500px] max-h-[80vh] overflow-y-auto flex flex-col gap-4">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-red-500" />
                        Bot 安全政策設定
                      </DialogTitle>
                      <DialogDescription>配置 Bot 設定來加強您的網站安全防護</DialogDescription>
                    </DialogHeader>

                    <Tabs defaultValue="known_bots" className="w-full" onValueChange={handleBotTabChange}>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="known_bots" className="flex items-center gap-2">
                          <Bot className="h-4 w-4" />
                          已知的機器人
                        </TabsTrigger>
                        <TabsTrigger value="verified_bot" className="flex items-center gap-2">
                          <Bot className="h-4 w-4" />
                          已驗證的機器人類別
                        </TabsTrigger>
                      </TabsList>

                      {/* Known Bot 設定 */}
                      <TabsContent value="known_bots" className="space-y-4">
                        <div className="space-y-4">

                          {/* 子域名選擇區域 */}
                          <div className="space-y-2 mt-5">
                            <h4 className="font-medium text-sm">選擇要套用此規則的子域名</h4>
                            <SubdomainSelect
                              options={domainSettings}
                              selectedValue={selectedSubdomain}
                              onSelectionChange={(value) => handleBotSelectedSubdomainChange(value, 'known_bot')}
                              placeholder="請選擇子域名"
                              className="w-full"
                            />
                          </div>

                          {/* 規則區塊 */}
                          <div className="space-y-3">
                            {/* 已有規則狀態 */}
                            {/* 無規則狀態 - 點擊新增 */}
                            {
                              showKnownBotForm ?
                                <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/30">
                                  <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-medium text-sm">{botPolicySettings.knownBotList && botPolicySettings.knownBotList[selectedSubdomain] ? '編輯規則' : '新增規則'}</h4>
                                    {
                                      isReadOnly ? null : (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={removeKnownBotRule}
                                          className="text-red-500 hover:text-red-700 hover:bg-red-100"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      )
                                    }
                                  </div>

                                  <div className="pt-4 border-t">
                                    <h4 className="font-medium text-sm mb-3">當傳入要求符合...</h4>
                                    <div className="flex items-center gap-3">
                                      <Switch 
                                        checked={editKnownBotForm.value} 
                                        onCheckedChange={() => setEditKnownBotForm({ ...editKnownBotForm, value: !editKnownBotForm.value })}
                                        disabled={isReadOnly}
                                      />
                                      <span className="text-sm font-medium">
                                        {editKnownBotForm.value ? '已知的機器人' : '未知的機器人'}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="pt-4">
                                    <h4 className="font-medium text-sm mb-3">然後採取動作...</h4>
                                    <Label className="text-xs text-muted-foreground">動作</Label>
                                    <div>
                                      <Select value={editKnownBotForm.action} onValueChange={(value) => setEditKnownBotForm({ ...editKnownBotForm, action: value })} disabled={isReadOnly}>
                                        <SelectTrigger className="w-full sm:w-[200px] mt-1">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="block">阻擋</SelectItem>
                                          <SelectItem value="skip">跳過</SelectItem>
                                          <SelectItem value="log">紀錄</SelectItem>
                                          <SelectItem value="managed_challenge">受控的查問</SelectItem>
                                          <SelectItem value="js_challenge">JS查問</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                </div>
                              : isReadOnly ? 
                              <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                                <div className="flex items-center gap-3">
                                  <span className="text-sm text-muted-foreground">無規則設定</span>
                                </div>
                              </div>
                              : (
                                <div 
                                  className="flex items-center justify-between p-4 border rounded-lg bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
                                  onClick={() => createKnownBotRule()}
                                >
                                  <div className="flex items-center gap-3">
                                    <Bot className="h-5 w-5 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">新增規則</span>
                                  </div>
                                  <Button variant="ghost" size="sm">
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              )
                            }
                          </div>

                        </div>
                      </TabsContent>

                      {/* Verified Bot Category 設定 */}
                      <TabsContent value="verified_bot" className="space-y-4">
                        <div className="space-y-4">

                          {/* 子域名選擇區域 */}
                          <div className="space-y-2 mt-5">
                            <h4 className="font-medium text-sm">選擇要套用此規則的子域名</h4>
                            <SubdomainSelect
                              options={domainSettings}
                              selectedValue={selectedSubdomain}
                              onSelectionChange={(value) => handleBotSelectedSubdomainChange(value, 'verified_bot')}
                              placeholder="請選擇子域名"
                              className="w-full"
                            />
                          </div>

                          {/* 規則區塊 */}
                          <div className="space-y-3">

                            {
                              showVerifiedBotForm ?
                                <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-medium text-sm">{botPolicySettings.verifiedCategoryList && botPolicySettings.verifiedCategoryList[selectedSubdomain] ? '編輯規則' : '新增規則'}</h4>
                                    {
                                      isReadOnly ? null : (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => removeVerifiedBotRule()}
                                          className="text-muted-foreground hover:text-foreground text-red-500"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      )
                                    }
                                  </div>

                                  {/* 運算符選擇 */}
                                  <div className="pt-4 border-t">
                                    <Label className="text-xs text-muted-foreground">運算子</Label>
                                    <Select value={editVerifiedBotForm.type} onValueChange={(value) => setEditVerifiedBotForm({ ...editVerifiedBotForm, type: value })} disabled={isReadOnly}>
                                      <SelectTrigger className="w-full sm:w-[200px]">
                                        <SelectValue/>
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="eq">等於</SelectItem>
                                        <SelectItem value="ne">不等於</SelectItem>
                                        <SelectItem value="in">在其中</SelectItem>
                                        <SelectItem value="not in">不在於</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  {/* Bot Category 選擇 */}
                                  <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground">Bot 類別</Label>
                                    {(editVerifiedBotForm.type === 'eq' || editVerifiedBotForm.type === 'ne') && (
                                      <Select value={selectedBotCategories[0]?.value || ''} onValueChange={(value) => setSelectedBotCategories([{ value, label: botCategories.find(c => c.value === value)?.label || '' }])} disabled={isReadOnly}>
                                        <SelectTrigger className="w-full">
                                          <SelectValue placeholder="選擇 Bot 類別" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {botCategories.map((category) => (
                                            <SelectItem key={category.value} value={category.value}>
                                              {category.label}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    )}
                                    {(editVerifiedBotForm.type === 'in' || editVerifiedBotForm.type === 'not in') && (
                                      <BotCategoryMultiSelect
                                        options={botCategories}
                                        selectedValues={selectedBotCategories}
                                        onSelectionChange={setSelectedBotCategories}
                                        placeholder="選擇 Bot 類別"
                                        className="w-full"
                                      />
                                    )}
                                    <div className="flex items-center gap-1 text-sm">
                                      <span>請</span>
                                      <a 
                                        href="https://radar.cloudflare.com/bots#verified-bots" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-red-600 hover:text-red-700 underline flex items-center gap-0.5"
                                      >
                                        在此
                                        <ExternalLink className="h-3 w-3" />
                                      </a>
                                      <span>查看機器人名稱和類別清單</span>
                                    </div>
                                  </div>

                                  {/* 動作選擇 */}
                                  <div className="pt-4">
                                    <h4 className="font-medium text-sm mb-3">然後採取動作...</h4>
                                    <Label className="text-xs text-muted-foreground">動作</Label>
                                    <Select value={editVerifiedBotForm.action} onValueChange={(value) => setEditVerifiedBotForm({ ...editVerifiedBotForm, action: value })} disabled={isReadOnly}>
                                      <SelectTrigger className="w-full sm:w-[200px]">
                                        <SelectValue placeholder="選擇動作" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="block">阻擋</SelectItem>
                                        <SelectItem value="skip">跳過</SelectItem>
                                        <SelectItem value="log">紀錄</SelectItem>
                                        <SelectItem value="managed_challenge">受控的查問</SelectItem>
                                        <SelectItem value="js_challenge">JS查問</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              : isReadOnly ? 
                              <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                                <div className="flex items-center gap-3">
                                  <span className="text-sm text-muted-foreground">無規則設定</span>
                                </div>
                              </div>
                              : (
                                <div 
                                  className="flex items-center justify-between p-4 border rounded-lg bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
                                  onClick={() => createVerifiedBotRule()}
                                >
                                  <div className="flex items-center gap-3">
                                    <Bot className="h-5 w-5 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">新增規則</span>
                                  </div>
                                  <Button variant="ghost" size="sm">
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              )
                            }
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>

                    <DialogFooter className="mt-auto">
                      {
                        isReadOnly ? null : (
                          <Button onClick={() => handleBotPolicySubmit()}>完成設定</Button>
                        )
                      }
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* 自訂規則 */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg gap-3 sm:gap-0">
              <div className="flex items-center gap-3">
                <Bot className="h-5 w-5 text-blue-500" />
                <div>
                  <h3 className="font-medium">自訂規則</h3>
                  <p className="text-sm text-muted-foreground">自訂User Agent、Header、URI等安全規則</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Dialog open={isCustomPolicyDialogOpen} onOpenChange={handleCustomPolicyDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      設定
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[800px] min-h-[500px] max-h-[80vh] overflow-y-auto flex flex-col gap-4">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Flag className="h-5 w-5 text-red-500" />
                        自訂規則設定
                      </DialogTitle>
                      <DialogDescription>配置User Agent、Header、URI等自訂規則來加強您的網站安全防護</DialogDescription>
                    </DialogHeader>

                    <Tabs defaultValue="custom" className="w-full" >
                      {/* <TabsList className="grid w-full grid-cols-1">
                        <TabsTrigger value="custom" className="flex items-center gap-2">
                          <Flag className="h-4 w-4" />
                          自訂規則
                        </TabsTrigger>
                      </TabsList> */}

                      <TabsContent value="custom" className="space-y-4">
                        <div className="space-y-4">

                          {/* 子域名選擇區域 */}
                          <div className="space-y-2 mt-5">
                            <h4 className="font-medium text-sm">選擇要套用此規則的子域名</h4>
                            <SubdomainSelect
                              options={domainSettings}
                              selectedValue={selectedSubdomain}
                              onSelectionChange={(value) => handleCustomSelectedSubdomainChange(value)}
                              placeholder="請選擇子域名"
                              className="w-full"
                            />
                          </div>

                          {/* 規則區塊 */}
                          <div className="space-y-3">
                            {/* 已設定的規則列表 */}
                            {customDomainRuleList.map((rule, index) => (
                              <div key={index} className="border rounded-lg overflow-hidden">
                                {/* 規則摘要 - 可點擊展開 */}
                                <div 
                                  className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${
                                    expandedRuleIndex === index ? 'bg-blue-50 dark:bg-blue-950/30' : 'bg-muted/30 hover:bg-muted/50'
                                  }`}
                                  onClick={() => toggleRuleExpand(index)}
                                >
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <Badge variant='default'>{getFieldTypeLabel(rule.conditions[0].field)}</Badge>
                                    <span className="text-sm text-muted-foreground truncate">{getRuleSummary(rule)}</span>
                                  </div>
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    <Badge variant={rule.action === 'block' ? 'destructive' : rule.action === 'skip' ? 'secondary' : 'default'}>
                                      {
                                        rule.action === 'block' ? '阻擋' : 
                                        rule.action === 'skip' ? '跳過' : 
                                        rule.action === 'log' ? '紀錄' :
                                        rule.action === 'managed_challenge' ? '受控的查問' :
                                        rule.action === 'js_challenge' ? 'JS查問' :
                                        '未知動作'}
                                    </Badge>
                                    {
                                      isReadOnly ? null : (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            deleteRuleFromList(index)
                                          }}
                                          className="text-red-500 hover:text-red-700 hover:bg-red-100"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>                                   
                                      )
                                    }
                                    <ChevronDown className={`h-4 w-4 transition-transform ${expandedRuleIndex === index ? 'rotate-180' : ''}`} />
                                  </div>
                                </div>

                                {/* 展開的編輯表單 */}
                                {expandedRuleIndex === index && editCustomRuleForm && (
                                  <div className="p-4 border-t bg-blue-50 dark:bg-blue-950/30 space-y-4">
                                    {/* 當傳入要求符合... */}
                                    <h4 className="font-medium text-sm">當傳入要求符合...</h4>
                                    
                                    {/* 條件標題列 */}
                                    {
                                      editCustomRuleForm.conditions[0].field === 'header' ?
                                      <div className="grid grid-cols-12 gap-2 text-xs text-muted-foreground pl-4">
                                        <div className="col-span-2">欄位</div>
                                        <div className="col-span-3">名稱</div>
                                        <div className="col-span-2">運算子</div>
                                        <div className="col-span-3">值</div>
                                        <div className="col-span-2"></div>
                                      </div>
                                      :
                                      <div className="grid grid-cols-12 gap-2 text-xs text-muted-foreground pl-4">
                                        <div className="col-span-3">欄位</div>
                                        <div className="col-span-3">運算子</div>
                                        <div className="col-span-4">值</div>
                                        <div className="col-span-2"></div>
                                      </div>
                                    }

                                    {/* 條件列表 - 按 OR 分群 */}
                                    {(() => {
                                      const conditions = editCustomRuleForm.conditions || []
                                      const groups: any[][] = []
                                      let currentGroup: any[] = []
                                      
                                      conditions.forEach((condition: any, index: number) => {
                                        if (index === 0 || condition.logicalOperator === 'and') {
                                          currentGroup.push({ ...condition, originalIndex: index })
                                        } else {
                                          if (currentGroup.length > 0) {
                                            groups.push(currentGroup)
                                          }
                                          currentGroup = [{ ...condition, originalIndex: index }]
                                        }
                                      })
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
                                                  
                                                  {editCustomRuleForm.conditions[0].field === 'header' ? (
                                                    <div className="grid grid-cols-12 gap-2 items-start pl-4 py-1">
                                                      <div className="col-span-2">
                                                        <Select 
                                                          value={condition.field} 
                                                          onValueChange={(value) => updateCondition(condition.originalIndex, 'field', value)}
                                                          disabled={condition.originalIndex > 0 || isReadOnly}
                                                        >
                                                          <SelectTrigger className="w-full">
                                                            <SelectValue />
                                                          </SelectTrigger>
                                                          <SelectContent>
                                                            {customRuleFieldTypes.map((type) => (
                                                              <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                                                            ))}
                                                          </SelectContent>
                                                        </Select>
                                                      </div>
                                                      <div className="col-span-3">
                                                        <Input 
                                                          value={condition.name}
                                                          onChange={(e) => updateCondition(condition.originalIndex, 'name', e.target.value)}
                                                          disabled={isReadOnly}
                                                        />
                                                        <p className="text-xs text-muted-foreground mt-1 truncate">例如 content-type</p>
                                                      </div>
                                                      <div className="col-span-2">
                                                        <Select 
                                                          value={condition.operator} 
                                                          onValueChange={(value) => updateCondition(condition.originalIndex, 'operator', value)}
                                                          disabled={isReadOnly}
                                                        >
                                                          <SelectTrigger className="w-full">
                                                            <SelectValue />
                                                          </SelectTrigger>
                                                          <SelectContent>
                                                            {customRuleOperators2.map((op) => (
                                                              <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
                                                            ))}
                                                          </SelectContent>
                                                        </Select>
                                                      </div>
                                                      <div className="col-span-3">
                                                        <Input 
                                                          value={condition.value}
                                                          onChange={(e) => updateCondition(condition.originalIndex, 'value', e.target.value)}
                                                          disabled={isReadOnly}
                                                        />
                                                        <p className="text-xs text-muted-foreground mt-1 truncate">
                                                          {getValuePlaceholder(condition.field, condition.operator)}
                                                        </p>
                                                      </div>
                                                      {
                                                        isReadOnly ? null : (
                                                          <div className="col-span-2 flex items-center gap-1">
                                                            <Button variant="outline" size="sm" className="h-9 px-2" onClick={() => addCondition('and')}>及</Button>
                                                            <Button variant="outline" size="sm" className="h-9 px-2" onClick={() => addCondition('or')}>或</Button>
                                                            {editCustomRuleForm.conditions.length > 1 && (
                                                              <Button variant="ghost" size="sm" className="h-9 px-2 text-red-500 hover:text-red-700" onClick={() => removeCondition(condition.originalIndex)}>X</Button>
                                                            )}
                                                          </div>                                                      
                                                        )
                                                      }
                                                    </div>
                                                  ) : (
                                                    <div className="grid grid-cols-12 gap-2 items-start pl-4 py-1">
                                                      <div className="col-span-3">
                                                        <Select 
                                                          value={condition.field} 
                                                          onValueChange={(value) => updateCondition(condition.originalIndex, 'field', value)}
                                                          disabled={condition.originalIndex > 0 || isReadOnly}
                                                        >
                                                          <SelectTrigger className="w-full">
                                                            <SelectValue />
                                                          </SelectTrigger>
                                                          <SelectContent>
                                                            {customRuleFieldTypes.map((type) => (
                                                              <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                                                            ))}
                                                          </SelectContent>
                                                        </Select>
                                                      </div>
                                                      <div className="col-span-3">
                                                        <Select 
                                                          value={condition.operator} 
                                                          onValueChange={(value) => updateCondition(condition.originalIndex, 'operator', value)}
                                                          disabled={isReadOnly}
                                                        >
                                                          <SelectTrigger className="w-full">
                                                            <SelectValue />
                                                          </SelectTrigger>
                                                          <SelectContent>
                                                            {customRuleOperators.map((op) => (
                                                              <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
                                                            ))}
                                                          </SelectContent>
                                                        </Select>
                                                      </div>
                                                      <div className="col-span-4">
                                                        <Input 
                                                          value={condition.value}
                                                          onChange={(e) => updateCondition(condition.originalIndex, 'value', e.target.value)}
                                                          placeholder={getValuePlaceholder(condition.field, condition.operator)}
                                                          disabled={isReadOnly}
                                                        />
                                                        <p className="text-xs text-muted-foreground mt-1 truncate">
                                                          {getValuePlaceholder(condition.field, condition.operator)}
                                                        </p>
                                                      </div>
                                                      {
                                                        isReadOnly ? null : (
                                                          <div className="col-span-2 flex items-center gap-1">
                                                            <Button variant="outline" size="sm" className="h-9 px-2" onClick={() => addCondition('and')}>及</Button>
                                                            <Button variant="outline" size="sm" className="h-9 px-2" onClick={() => addCondition('or')}>或</Button>
                                                            {editCustomRuleForm.conditions.length > 1 && (
                                                              <Button variant="ghost" size="sm" className="h-9 px-2 text-red-500 hover:text-red-700" onClick={() => removeCondition(condition.originalIndex)}>X</Button>
                                                            )}
                                                          </div>                                                        
                                                        )
                                                      }
                                                    </div>
                                                  )}
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        </div>
                                      ))
                                    })()}

                                    {/* 然後採取動作... */}
                                    <div className="pt-4 border-t">
                                      <h4 className="font-medium text-sm mb-3">然後採取動作...</h4>
                                      <Select 
                                        value={editCustomRuleForm.action} 
                                        onValueChange={(value) => setEditCustomRuleForm({ ...editCustomRuleForm, action: value })}
                                        disabled={isReadOnly}
                                      >
                                        <SelectTrigger className="w-full sm:w-[200px]">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="block">阻擋</SelectItem>
                                          <SelectItem value="skip">跳過</SelectItem>
                                          <SelectItem value="log">紀錄</SelectItem>
                                          <SelectItem value="managed_challenge">受控的查問</SelectItem>
                                          <SelectItem value="js_challenge">JS查問</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    {
                                      isReadOnly ? null : (
                                        <div className="pt-2 flex justify-end">
                                          <Button size="sm" onClick={finishRuleEdit}>儲存變更</Button>
                                        </div>                                   
                                      )
                                    }
                                  </div>
                                )}
                              </div>
                            ))}

                            {/* 新增規則按鈕 - 只有在還有可用類型時才顯示 */}
                            { 
                              !showCustomRuleForm && customDomainRuleList.length < 3 && !isReadOnly && (
                              <div 
                                className="flex items-center justify-between p-4 border rounded-lg bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
                                onClick={() => createCustomRule()}
                              >
                                <div className="flex items-center gap-3">
                                  <Plus className="h-5 w-5 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground">新增規則</span>
                                </div>
                              </div>
                            )}

                            {/* 新增規則表單 */}
                            {showCustomRuleForm && editCustomRuleForm && (
                              <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/30">
                                <div className="flex items-center justify-between mb-4">
                                  <h4 className="font-medium text-sm">新增規則</h4>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={removeCustomRule}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-100"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>

                                <div className="pt-4 border-t space-y-4">
                                  {/* 當傳入要求符合... */}
                                  <h4 className="font-medium text-sm">當傳入要求符合...</h4>
                                  
                                  {/* 條件標題列 */}
                                  {
                                    editCustomRuleForm.conditions.length > 0 && editCustomRuleForm.conditions[0].field === 'header' ?
                                      <div className="grid grid-cols-12 gap-2 text-xs text-muted-foreground pl-4">
                                        <div className="col-span-2">欄位</div>
                                        <div className="col-span-3">名稱</div>
                                        <div className="col-span-2">運算子</div>
                                        <div className="col-span-3">值</div>
                                        <div className="col-span-2"></div>
                                      </div>
                                    :
                                      <div className="grid grid-cols-12 gap-2 text-xs text-muted-foreground pl-4">
                                        <div className="col-span-3">欄位</div>
                                        <div className="col-span-2">運算子</div>
                                        <div className="col-span-5">值</div>
                                        <div className="col-span-2"></div>
                                      </div>
                                  }

                                  {/* 條件列表 - 按 OR 分群 */}
                                  {(() => {
                                    const conditions = editCustomRuleForm.conditions || []
                                    const groups: any[][] = []
                                    let currentGroup: any[] = []
                                    
                                    conditions.forEach((condition: any, index: number) => {
                                      if (index === 0 || condition.logicalOperator === 'and') {
                                        currentGroup.push({ ...condition, originalIndex: index })
                                      } else {
                                        if (currentGroup.length > 0) {
                                          groups.push(currentGroup)
                                        }
                                        currentGroup = [{ ...condition, originalIndex: index }]
                                      }
                                    })
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
                                                
                                                {editCustomRuleForm.conditions[0].field === 'header' ? (
                                                  <div className="grid grid-cols-12 gap-2 items-start pl-4 py-1">
                                                    <div className="col-span-2">
                                                      <Select 
                                                        value={condition.field} 
                                                        onValueChange={(value) => updateCondition(condition.originalIndex, 'field', value)}
                                                        disabled={condition.originalIndex > 0}
                                                      >
                                                        <SelectTrigger className="w-full">
                                                          <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                          {customRuleFieldTypes.map((type) => (
                                                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                                                          ))}
                                                        </SelectContent>
                                                      </Select>
                                                    </div>
                                                    <div className="col-span-3">
                                                      <Input 
                                                        value={condition.name}
                                                        onChange={(e) => updateCondition(condition.originalIndex, 'name', e.target.value)}
                                                      />
                                                      <p className="text-xs text-muted-foreground mt-1 truncate">例如 content-type</p>
                                                    </div>
                                                    <div className="col-span-2">
                                                      <Select 
                                                        value={condition.operator} 
                                                        onValueChange={(value) => updateCondition(condition.originalIndex, 'operator', value)}
                                                      >
                                                        <SelectTrigger className="w-full">
                                                          <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                          {customRuleOperators2.map((op) => (
                                                            <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
                                                          ))}
                                                        </SelectContent>
                                                      </Select>
                                                    </div>
                                                    <div className="col-span-3">
                                                      <Input 
                                                        value={condition.value}
                                                        onChange={(e) => updateCondition(condition.originalIndex, 'value', e.target.value)}
                                                      />
                                                      <p className="text-xs text-muted-foreground mt-1 truncate">
                                                        {getValuePlaceholder(condition.field, condition.operator)}
                                                      </p>
                                                    </div>
                                                    <div className="col-span-2 flex items-center gap-1">
                                                      <Button variant="outline" size="sm" className="h-8 px-3" onClick={() => addCondition('and')}>及</Button>
                                                      <Button variant="outline" size="sm" className="h-8 px-3" onClick={() => addCondition('or')}>或</Button>
                                                      {editCustomRuleForm.conditions.length > 1 && (
                                                        <Button variant="ghost" size="sm" className="h-9 px-2 text-red-500 hover:text-red-700" onClick={() => removeCondition(condition.originalIndex)}>X</Button>
                                                      )}
                                                    </div>
                                                  </div>
                                                ) : (
                                                  <div className="grid grid-cols-12 gap-2 items-start pl-4 py-1">
                                                    <div className="col-span-3">
                                                      <Select 
                                                        value={condition.field} 
                                                        onValueChange={(value) => updateCondition(condition.originalIndex, 'field', value)}
                                                        disabled={condition.originalIndex > 0}
                                                      >
                                                        <SelectTrigger className="w-full">
                                                          <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                          {customRuleFieldTypes.map((type) => (
                                                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                                                          ))}
                                                        </SelectContent>
                                                      </Select>
                                                    </div>
                                                    <div className="col-span-2">
                                                      <Select 
                                                        value={condition.operator} 
                                                        onValueChange={(value) => updateCondition(condition.originalIndex, 'operator', value)}
                                                      >
                                                        <SelectTrigger className="w-full">
                                                          <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                          {customRuleOperators.map((op) => (
                                                            <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
                                                          ))}
                                                        </SelectContent>
                                                      </Select>
                                                    </div>
                                                    <div className="col-span-5">
                                                      <Input 
                                                        value={condition.value}
                                                        onChange={(e) => updateCondition(condition.originalIndex, 'value', e.target.value)}
                                                      />
                                                      <p className="text-xs text-muted-foreground mt-1 truncate">
                                                        {getValuePlaceholder(condition.field, condition.operator)}
                                                      </p>
                                                    </div>
                                                    <div className="col-span-2 flex items-center gap-1">
                                                      <Button variant="outline" size="sm" className="h-8 px-3" onClick={() => addCondition('and')}>及</Button>
                                                      <Button variant="outline" size="sm" className="h-8 px-3" onClick={() => addCondition('or')}>或</Button>
                                                      {editCustomRuleForm.conditions.length > 1 && (
                                                        <Button variant="ghost" size="sm" className="h-9 px-2 text-red-500 hover:text-red-700" onClick={() => removeCondition(condition.originalIndex)}>X</Button>
                                                      )}
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    ))
                                  })()}

                                  {/* 然後採取動作... */}
                                  <div className="pt-4 border-t">
                                    <h4 className="font-medium text-sm mb-3">然後採取動作...</h4>
                                    <Select 
                                      value={editCustomRuleForm.action} 
                                      onValueChange={(value) => setEditCustomRuleForm({ ...editCustomRuleForm, action: value })}
                                    >
                                      <SelectTrigger className="w-full sm:w-[200px]">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="block">阻擋</SelectItem>
                                        <SelectItem value="skip">跳過</SelectItem>
                                        <SelectItem value="log">紀錄</SelectItem>
                                        <SelectItem value="managed_challenge">受控的查問</SelectItem>
                                        <SelectItem value="js_challenge">JS查問</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>

                                <div className="pt-4 flex justify-end">
                                  <Button size="sm" onClick={addNewRuleToList}>新增</Button>
                                </div>
                              </div>
                            )}
                          </div>

                        </div>
                      </TabsContent>
                    </Tabs>

                    <DialogFooter className="mt-auto">
                      {
                        isReadOnly ? null : (
                          <Button onClick={() => handleCustomPolicySubmit()} disabled={showCustomRuleForm}>完成設定</Button>
                        )
                      }
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
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

// 子域名單選組件
interface SubdomainSelectProps {
  options: DnsSetting[]
  selectedValue: string
  onSelectionChange: (value: string) => void
  placeholder: string
  className?: string
}

const SubdomainSelect = ({ options, selectedValue, onSelectionChange, placeholder, className }: SubdomainSelectProps) => {
  const [isOpen, setIsOpen] = React.useState(false)

  const handleSelectOption = (option: DnsSetting) => {
    onSelectionChange(option.name)
    setIsOpen(false)
  }
  const selectedOption = options.find(opt => opt.name === selectedValue)
  const displayText = selectedOption ? selectedOption.name : placeholder

  const handleOpen = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className={`relative ${className}`}>
      <div
        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        onClick={handleOpen}
      >
        <div className={`flex-1 truncate text-left ${!selectedValue ? 'text-muted-foreground' : ''}`}>
          {displayText}
        </div>
        <ChevronDown className={`h-4 w-4 opacity-50 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-md max-h-80 overflow-hidden">
          <div className="max-h-60 overflow-y-auto">
            {
              options.map((option) => {
                const isSelected = selectedValue === option.name
                return (
                  <div
                    key={option.name}
                    className="flex items-center px-3 py-2 hover:bg-accent cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSelectOption(option)
                    }}
                  >
                    {isSelected && (
                      <Check className="w-4 h-4 mr-2 text-primary" />
                    )}
                    <div className={`flex-1 ${!isSelected ? 'ml-6' : ''}`}>
                      <span className="text-sm">{option.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">({option.type})</span>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
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

const MultiSelect = ({ options, selectedValues, onSelectionChange, placeholder, className }: MultiSelectProps) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [searchText, setSearchText] = React.useState('')

  const handleToggleOption = (option: { code: string; name: string; country: string }) => {
    const isSelected = selectedValues.find((selected) => selected.code === option.code)
    let newSelected: Array<{ code: string; name: string; country: string }>
    
    if (isSelected) {
      // 如果已選中，則移除
      newSelected = selectedValues.filter((item) => item.code !== option.code)
    } else {
      // 如果未選中，則添加
      newSelected = [...selectedValues, option]
    }
    
    onSelectionChange(newSelected)
  }

  // 搜索過濾邏輯 - 支持中文名稱、英文名稱、國家代碼
  const filteredOptions = options.filter((option) => {
    if (!searchText) return true
    
    const searchLower = searchText.toLowerCase()
    return (
      option.name.toLowerCase().includes(searchLower) ||        // 中文名稱
      option.country.toLowerCase().includes(searchLower) ||     // 英文名稱
      option.code.toLowerCase().includes(searchLower)           // 國家代碼
    )
  })

  const displayText = selectedValues.length > 0 
    ? `${selectedValues.length} 個國家已選擇`
    : placeholder

  const handleOpen = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setSearchText('') // 打開時清空搜索
    }
  }

  return (
    <div className={`relative ${className}`}>
      <div
        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        onClick={handleOpen}
      >
        <div className="flex-1 truncate text-left">
          {displayText}
        </div>
        <ChevronDown className={`h-4 w-4 opacity-50 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-md max-h-80 overflow-hidden">
          {/* 搜索輸入框 */}
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="搜索國家 (中文/英文/代碼)..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-10 h-9"
                onClick={(e) => e.stopPropagation()} // 防止點擊輸入框時關閉下拉
              />
            </div>
          </div>

          {/* 選項列表 */}
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = selectedValues.find((selected) => selected.code === option.code)
                return (
                  <div
                    key={option.code}
                    className="flex items-center px-3 py-2 hover:bg-accent cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleToggleOption(option)
                    }}
                  >
                    {isSelected && (
                      <Check className="w-4 h-4 mr-2 text-primary" />
                    )}
                    <div className="flex-1">
                      <span className="text-sm">{option.name} ({option.country})</span>
                      <span className="text-xs text-muted-foreground ml-2">{option.code}</span>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                {searchText ? `沒有找到包含 "${searchText}" 的國家` : '沒有可選的國家'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 點擊外部關閉下拉選單 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

// Bot 類別多選組件
interface BotCategoryMultiSelectProps {
  options: Array<{ value: string; label: string }>
  selectedValues: Array<{ value: string; label: string }>
  onSelectionChange: (selected: Array<{ value: string; label: string }>) => void
  placeholder: string
  className?: string
}

const BotCategoryMultiSelect = ({ options, selectedValues, onSelectionChange, placeholder, className }: BotCategoryMultiSelectProps) => {
  const [isOpen, setIsOpen] = React.useState(false)

  const handleToggleOption = (option: { value: string; label: string }) => {
    const isSelected = selectedValues.find((selected) => selected.value === option.value)
    let newSelected: Array<{ value: string; label: string }>
    
    if (isSelected) {
      newSelected = selectedValues.filter((item) => item.value !== option.value)
    } else {
      newSelected = [...selectedValues, option]
    }
    
    onSelectionChange(newSelected)
  }

  const handleRemoveItem = (e: React.MouseEvent, value: string) => {
    e.stopPropagation()
    onSelectionChange(selectedValues.filter((item) => item.value !== value))
  }

  const handleOpen = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className={`relative ${className}`}>
      <div
        className="flex min-h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        onClick={handleOpen}
      >
        <div className="flex-1 flex flex-wrap gap-1">
          {selectedValues.length === 0 ? (
            <span className="text-muted-foreground">{placeholder}</span>
          ) : (
            selectedValues.map((item) => (
              <Badge 
                key={item.value} 
                variant="secondary"
                className="flex items-center gap-1 px-2 py-0.5 text-xs"
              >
                {item.label}
                <button
                  onClick={(e) => handleRemoveItem(e, item.value)}
                  className="ml-0.5 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))
          )}
        </div>
        <ChevronDown className={`h-4 w-4 opacity-50 transition-transform ml-2 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-md max-h-80 overflow-hidden">
          <div className="max-h-60 overflow-y-auto">
            {
              options.map((option) => {
                const isSelected = selectedValues.find((selected) => selected.value === option.value)
                return (
                  <div
                    key={option.value}
                    className="flex items-center px-3 py-2 hover:bg-accent cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleToggleOption(option)
                    }}
                  >
                    {isSelected && (
                      <Check className="w-4 h-4 mr-2 text-primary" />
                    )}
                    {!isSelected && (
                      <div className="w-4 h-4 mr-2" />
                    )}
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4 text-muted-foreground" />
                      <span>{option.label}</span>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

export default function WAFManagePageWrapper() {
  return (
    // <RoleGuard allowedRoles={['user',]}>
    //   <WAFManagePage />
    // </RoleGuard>
    <WAFManagePage />
  )
}