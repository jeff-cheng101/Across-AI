"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { Globe, Activity, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { LoadingOverlay } from '@/components/ui/loading-overlay'
import { RoleGuard } from "@/components/role-guard"
import { RingLoader } from 'react-spinners'
import { getZonesByContractNo, getDnsByContractNo, getDDoSSensitivityByContractNo, updateDDoSSensitivity } from "@/app/routes/cloudflare"
import { notifyError, notifySuccess } from "@/app/util/notify"
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
  sensitivityLevel: string
}

interface DnsSetting {
  name: string
  type: string
  content: string
  proxied: boolean
  ttl: string | number
  zone: string
}

function ApplicationDefenseManagePage() {
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
  //     if (auth.maintainer && auth?.contract?.module?.includes('l7_ddos')) return
  //     if (notPermission || !auth?.contract?.module?.includes('l7_ddos')) {
  //       router.push('/dashboard')
  //     }
  //   }
  // }, [auth, notPermission, router])

  const [zoneSettings, setZoneSettings] = useState<ZoneSetting[]>([])
  const [domainSettings, setDomainSettings] = useState<DnsSetting[]>([])
  const [totalBytes, setTotalBytes] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

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

      await loadSettings()
    })()
  }, [auth])

  const loadSettings = async () => {
    try {
      if (!auth) return
      const { contract } = auth as any
      setIsLoading(true)

      const zonesResp = await getZonesByContractNo(contract?.contractNo || null)
      const zones = zonesResp.data || []
      const zonesDdosResp = await getDDoSSensitivityByContractNo(contract?.contractNo || null)
      const zonesDdos = zonesDdosResp.data || []
      let zoneSettingsDdos = zonesDdos.map((zone: any) => ({ name: zone.name, sensitivityLevel: zone.sensitivityLevel }))

      let totalBytes = 0
      let zoneSettings = []
      for (let zone of zones) {
        const zoneDdos = zoneSettingsDdos.find((item: any) => item.name === zone.name)
        zoneSettings.push({
          name: zone.name,
          status: zone.status,
          txtRecord: {
            type: "TXT",
            name: `cloudflare-verify.${zone.name}`,
            content: zone.verification_key
          },
          cname_suffix: zone.cname_suffix || '-',
          sensitivityLevel: zoneDdos ? zoneDdos.sensitivityLevel : '3'
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
          name: dnsRecord.name,
          type: dnsRecord.type,
          content: dnsRecord.content,
          proxied: dnsRecord.proxied,
          ttl: dnsRecord.ttl,
          zone: dnsRecord.zone
        })
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
  // DDoS防護敏感度更新
  ////////////////////////////////

  const updateSensitivityLevel = async (value: string, zone: string) => {
    const { contract } = auth as any
    setIsLoading(true)
    await updateDDoSSensitivity({ contractNo: contract?.contractNo || null, zone, sensitivityLevel: value })
    .then(async () => {
      await loadSettings()
      notifySuccess('DDoS防護敏感度更新成功')
    })
    .catch((error) => {
      console.error(error)
      notifyError('DDoS防護敏感度更新失敗')
    })
    .finally(() => {
      setIsLoading(false)
    })
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
            <BreadcrumbPage className="text-foreground font-medium">DDoS 設定</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tighter mb-4">
          應用層<span className="text-brand-primary">DDoS防禦</span>管理
        </h1>
        <p className="text-muted-foreground text-lg">管理您的DDoS防護設定，監控攻擊狀況，確保服務持續可用</p>
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

      {/* Domain List - DDoS 敏感度設定 */}
      <Card className="shadow-lg bg-card border-border">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">DDoS 敏感度設定</CardTitle>
          <CardDescription className="text-muted-foreground">調整各域名的 DDoS 防護敏感度</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {zoneSettings.map((zone: any, index: number) => (
              <React.Fragment key={index}>
                {/* Desktop View */}
                <div className="hidden md:block">
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="font-medium text-foreground">{zone.name}</p>
                        <p className="text-sm text-muted-foreground">主域名</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground mr-2">防護敏感度</span>
                        <span className="text-sm font-medium text-muted-foreground">低</span>
                        <input
                            type="range"
                            min="1"
                            max="3"
                            defaultValue={zone.sensitivityLevel.toString()}
                            className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider-thumb"
                            style={{
                              background: "linear-gradient(to right, #22c55e 0%, #eab308 50%, #ef4444 100%)",
                            }}
                            onInput={(e: any) => {
                              const value = Number.parseInt(e.currentTarget.value)
                              let color
                              if (value === 1) color = "#22c55e"
                              else if (value === 2) color = "#eab308"
                              else color = "#ef4444"
                              const percentage = ((value - 1) / 2) * 100
                              e.target.style.background = `linear-gradient(to right, #22c55e 0%, #22c55e ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`
                              if (value === 2) {
                                e.target.style.background = `linear-gradient(to right, #22c55e 0%, #eab308 50%, #e5e7eb 50%, #e5e7eb 100%)`
                              } else if (value === 3) {
                                e.target.style.background = `linear-gradient(to right, #22c55e 0%, #eab308 50%, #ef4444 100%)`
                              }
                              updateSensitivityLevel(value.toString(), zone.name)
                            }}
                            disabled={isReadOnly}
                          />
                          <style jsx>{`
                            input[type="range"]::-webkit-slider-thumb {
                              appearance: none;
                              width: 20px;
                              height: 20px;
                              border-radius: 50%;
                              background: #ffffff;
                              border: 3px solid #0D99FF;
                              cursor: pointer;
                              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(13, 153, 255, 0.3);
                              transition: all 0.2s ease;
                            }
                            
                            input[type="range"]::-webkit-slider-thumb:hover {
                              transform: scale(1.1);
                              box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3), 0 0 0 2px rgba(13, 153, 255, 0.5);
                            }
    
                            input[type="range"]::-moz-range-thumb {
                              width: 24px;
                              height: 24px;
                              border-radius: 50%;
                              background: #ffffff;
                              border: 3px solid #0D99FF;
                              cursor: pointer;
                              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(13, 153, 255, 0.3);
                              transition: all 0.2s ease;
                            }
                        
                            input[type="range"]::-moz-range-thumb:hover {
                              transform: scale(1.1);
                              box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3), 0 0 0 2px rgba(13, 153, 255, 0.5);
                            }
                            
                            input[type="range"]::-webkit-slider-track {
                              height: 8px;
                              border-radius: 4px;
                            }
                            
                            input[type="range"]::-moz-range-track {
                              height: 8px;
                              border-radius: 4px;
                              border: none;
                            }
                          `}</style>
                          <span className="text-sm font-medium text-muted-foreground">高</span>
                      </div>
                      {/* <Button size="sm" variant="outline">
                        管理
                      </Button> */}
                    </div>
                  </div>
                </div>

                {/* Mobile View */}
                <div className="md:hidden">
                  <div className="p-4 border border-border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="font-medium text-foreground">{zone.name}</p>
                          <p className="text-sm text-muted-foreground">主域名</p>
                        </div>
                      </div>
                      {/* <Button size="sm" variant="outline">
                        管理
                      </Button> */}
                    </div>

                    <div className="space-y-3">
                      <div className="text-sm font-medium text-muted-foreground">防護敏感度</div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground min-w-[24px]">低</span>
                        <input
                          type="range"
                          min="1"
                          max="3"
                          defaultValue={zone.sensitivityLevel.toString()}
                          className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider-thumb"
                          style={{
                            background: "linear-gradient(to right, #22c55e 0%, #eab308 50%, #ef4444 100%)",
                          }}
                          onInput={(e: any) => {
                            const value = Number.parseInt(e.currentTarget.value)
                            let color
                            if (value === 1) color = "#22c55e"
                            else if (value === 2) color = "#eab308"
                            else color = "#ef4444"
                            const percentage = ((value - 1) / 2) * 100
                            e.target.style.background = `linear-gradient(to right, #22c55e 0%, #22c55e ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`
                            if (value === 2) {
                              e.target.style.background = `linear-gradient(to right, #22c55e 0%, #eab308 50%, #e5e7eb 50%, #e5e7eb 100%)`
                            } else if (value === 3) {
                              e.target.style.background = `linear-gradient(to right, #22c55e 0%, #eab308 50%, #ef4444 100%)`
                            }
                            updateSensitivityLevel(value.toString(), zone.name)
                          }}
                        />
                        <style jsx>{`
                          input[type="range"]::-webkit-slider-thumb {
                            appearance: none;
                            width: 20px;
                            height: 20px;
                            border-radius: 50%;
                            background: #ffffff;
                            border: 3px solid #0D99FF;
                            cursor: pointer;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(13, 153, 255, 0.3);
                            transition: all 0.2s ease;
                          }
                              
                          input[type="range"]::-webkit-slider-thumb:hover {
                            transform: scale(1.1);
                            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3), 0 0 0 2px rgba(13, 153, 255, 0.5);
                          }
    
                          input[type="range"]::-moz-range-thumb {
                            width: 24px;
                            height: 24px;
                            border-radius: 50%;
                            background: #ffffff;
                            border: 3px solid #0D99FF;
                            cursor: pointer;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(13, 153, 255, 0.3);
                            transition: all 0.2s ease;
                          }
                          
                          input[type="range"]::-moz-range-thumb:hover {
                            transform: scale(1.1);
                            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3), 0 0 0 2px rgba(13, 153, 255, 0.5);
                          }
                          
                          input[type="range"]::-webkit-slider-track {
                            height: 8px;
                            border-radius: 4px;
                          }
                            
                          input[type="range"]::-moz-range-track {
                            height: 8px;
                            border-radius: 4px;
                            border: none;
                          }
                        `}</style>
                        <span className="text-xs text-muted-foreground min-w-[24px]">高</span>
                      </div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ))}
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
  )
}

export default function ApplicationDefenseManagePageWrapper() {
  return (
    // <RoleGuard allowedRoles={['user']}>
    //   <ApplicationDefenseManagePage />
    // </RoleGuard>
    <ApplicationDefenseManagePage />
  )
}