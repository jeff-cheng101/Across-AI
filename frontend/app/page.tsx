"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Shield,
  Globe,
  Check,
  Monitor,
  BarChart3,
  Settings,
  HeadphonesIcon,
  FileText,
  Network,
  Zap,
  Bell,
  ShieldCheck,
  Layers2,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState, useRef } from "react"
import { PageTitle } from "@/components/page-title"
import { useRouter } from "next/navigation"
import authenticator from "@/app/util/authenticator"

export default function Home() {
  const pricingRef = useRef(null)
  const whyChooseRef = useRef(null)
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const hasDifyLoginTriggered = useRef(false)

  const handleDifyLogin = async () => {
    console.log('🚀 開始呼叫 Dify 登入 API...')
    try {
      const difyEmail = process.env.NEXT_PUBLIC_DIFY_EMAIL
      const difyPassword = process.env.NEXT_PUBLIC_DIFY_PWD

      console.log('🔑 環境變數檢查:', { 
        hasEmail: !!difyEmail, 
        hasPassword: !!difyPassword 
      })

      if (!difyEmail || !difyPassword) {
        console.error('❌ 環境變數未配置')
        return { success: false, error: 'Dify credentials not configured' }
      }

      console.log('🌐 直接呼叫 Dify API:', 'https://twister5.phison.com/dify/console/api/login')
      
      const response = await fetch('https://twister5.phison.com/dify/console/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: difyEmail,
          language: 'zh-Hant',
          password: difyPassword,
          remember_me: true
        })
      })
      
      console.log('📡 收到 Dify API 響應，狀態碼:', response.status)
      const data = await response.json()
      console.log('📄 Dify API 返回數據:', data)
      
      if (response.ok) {
        console.log('✅ Dify 登入成功', data)
        return { success: true, data }
      } else {
        console.error('❌ Dify 登入失敗', data)
        return { success: false, error: data.message || 'Dify login failed' }
      }
    } catch (error) {
      console.error('⚠️ Dify API 調用錯誤', error)
      return { success: false, error: 'API 調用失敗' }
    }
  }

  useEffect(() => {
    console.log('🔄 頁面初始化，開始檢查登入狀態...')
    
    // 檢查登入狀態
    const checkLoginStatus = async () => {
      const auth = authenticator.authValue
      if (auth) {
        if (auth.user?.role === 'management' || auth.user?.role === 'reseller' || auth.user?.role === 'user') {
          setIsLoggedIn(true)
        }
      }

      // 第一次檢查登入狀態後，觸發 Dify 登入
      if (!hasDifyLoginTriggered.current) {
        console.log('🎯 第一次檢查完成，準備觸發 Dify 登入...')
        hasDifyLoginTriggered.current = true
        await handleDifyLogin()
      }
    }
    
    checkLoginStatus()
    
    // 設置一個間隔來檢查登入狀態變化
    const interval = setInterval(checkLoginStatus, 1000)
    
    return () => clearInterval(interval)
  }, [])

  const handleStartClick = () => {
    if (isLoggedIn) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }

  const scrollToPricing = () => {
    pricingRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const scrollToWhyChoose = () => {
    whyChooseRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="container mx-auto container-padding section-padding bg-brand-dark">
      <section className="py-20 md:py-28 lg:py-36 relative overflow-hidden rounded-xl">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/header-background.jpg"
            alt="Digital security network background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-transparent dark:from-gray-950/90 dark:via-gray-900/70"></div>
        </div>

        <div className="container container-padding relative z-10">
          <div className="max-w-2xl text-left">
            <div className="space-y-8">
              <div className="space-y-4">
                <PageTitle>
                  ACROSS <br />
                  <span className="text-brand-primary">Security Operation Center</span>
                </PageTitle>
                <p className="text-muted-foreground body-sm max-w-md">
                  全方位的網路安全解決方案，保護您的應用程式免受各種網路威脅
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                {/* <Link href="/login">
                  <Button className="btn-primary text-base font-light">開始使用</Button>
                </Link> */}
                <Button
                  className="btn-primary text-base font-light"
                  style={{ backgroundColor: "#0D99FF", borderColor: "#0D99FF" }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#0A85E9")}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#0D99FF")}
                  onClick={handleStartClick}
                >
                  開始使用
                </Button>
                <Button
                  variant="outline"
                  className="btn-outline text-base bg-transparent font-light"
                  onClick={scrollToWhyChoose}
                >
                  了解更多
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding rounded-lg shadow-lg border bg-brand-dark">
        <div className="flex flex-col space-y-1.5 p-6 border-0 bg-brand-dark">
          <div className="text-center mb-12 relative">
            <h2 className="heading-lg mb-4 md:mb-0">
              <span className="text-brand-primary">服務</span>總覽
            </h2>
            <div className="flex justify-center md:absolute md:right-0 md:top-0">
              <Button className="btn-primary" onClick={scrollToPricing}>
                優惠組合方案
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <Link href="/services/hiwaf">
              <ServiceCard
                title="WAF防禦"
                description="WAF網站應用防火牆服務"
                icon={<Shield className="text-brand-primary w-9 h-9" />}
                price="$3.5萬"
                priceUnit="/月起"
                priceNote=""
              />
            </Link>
            <Link href="/services/application-defense">
              <ServiceCard
                title="應用層DDoS防禦"
                description="防範任何規模或類型的 DDoS 攻擊"
                icon={<Layers2 className="text-brand-primary w-9 h-9" />} // 將 Shield 圖標改為 Layers2
                price="$3.5萬"
                priceUnit="/月起"
                priceNote="計價單位：(應用程式數量/流量)"
              />
            </Link>
            <Link href="/services/cdn">
              <ServiceCard
                title="全球CDN加速"
                description="通過全球分佈的節點加速內容傳遞，提升用戶體驗。"
                icon={<Globe className="text-brand-primary w-9 h-9" />}
                price="$4萬"
                priceUnit="/月起"
                priceNote="計價單位: (應用程式數量/流量）"
              />
            </Link>
            <Link href="/services/smart-reports">
              <ServiceCard
                title="智慧報表"
                description="自動生成詳細的安全分析報表，協助企業掌握資安態勢。"
                icon={<FileText className="text-brand-primary w-9 h-9" />}
                price="$2萬"
                priceUnit="/月起"
                priceNote="計價單位：(報表數量/客製化程度)"
              />
            </Link>
            <Link href="/services/sase">
              <ServiceCard
                title="SASE網路"
                description="整合網路與安全功能，提供安全存取服務邊緣解決方案。"
                icon={<Network className="h-9 w-9 text-brand-primary" />}
                price="$5萬"
                priceUnit="/月起"
                priceNote="計價單位：(使用者數量/流量)"
              />
            </Link>
            <ServiceCard
              title="SecurityAI一鍵分析"
              description="運用AI技術快速分析安全事件，提供智能化威脅偵測。"
              icon={<Zap className="h-9 w-9 text-brand-primary" />}
              price="$3萬"
              priceUnit="/月起"
              priceNote="計價單位：(分析次數/資料量)"
            />
            <Link href="/services/smart-alerts">
              <ServiceCard
                title="智能告警"
                description="即時監控並智能過濾告警，確保關鍵威脅不被遺漏。"
                icon={<Bell className="h-9 w-9 text-brand-primary" />}
                price="$1.5萬"
                priceUnit="/月起"
                priceNote="計價單位：(告警數量/整合服務)"
              />
            </Link>
            <Link href="/services/ai-edr-xdr">
              <ServiceCard
                title="AI EDR/XDR"
                description="AI驅動端點偵測與回應，提供全方位威脅防護。"
                icon={<ShieldCheck className="h-9 w-9 text-brand-primary" />}
                price="$6萬"
                priceUnit="/月起"
                priceNote="計價單位：(端點數量/授權)"
              />
            </Link>
          </div>
        </div>
      </section>

      <section ref={whyChooseRef} className="section-padding" style={{ backgroundColor: "#0A1628" }}>
        <div className="container container-padding">
          <div className="text-center mb-16">
            <h2 className="heading-xl mb-4 text-white">
              為什麼選擇 <span className="text-white">ADAS ONE</span>
            </h2>
            <p className="text-white/80 body-lg max-w-3xl mx-auto">
              7x24 專業團隊，監控掌握企業資安狀態，即時通知資安威脅
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4 bg-[rgba(9,22,40,1)]">
            <FeatureCard
              icon={<Monitor className="h-8 w-8 text-brand-primary" />}
              title="單一平台集中管理"
              description="透過單一平台管理所有資安方案，包含流量監控、資安事件、策略設定等，簡化IT人員工作。"
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8 text-brand-primary" />}
              title="高規格資安防護"
              description="彈性整合國內外資安品牌，為企業資安打造全方位防護。"
            />
            <FeatureCard
              icon={<BarChart3 className="h-8 w-8 text-brand-primary" />}
              title="可視化報表"
              description="以圖表清楚監控流量與資安狀況，並產出報表，協助分析趨勢、發現異常與制定防禦策略。"
            />
            <FeatureCard
              icon={<Settings className="h-8 w-8 text-brand-primary" />}
              title="彈性部署與訂閱模式"
              description="採SaaS訂閱制，企業可按需求彈性擴充功能，快速導入降低初期成本。"
            />
            <FeatureCard
              icon={<HeadphonesIcon className="h-8 w-8 text-brand-primary" />}
              title="專業技術支援"
              description="提供 5x8、7x8、7×24 多層級技術支援，確保各時段皆能即時獲得協助，滿足穩定與合規需求。"
            />
          </div>
        </div>
      </section>

      <section ref={pricingRef} className="section-padding rounded-lg shadow-lg border bg-brand-dark-secondary">
        <div className="container container-padding">
          <div className="text-center mb-12">
            <h2 className="heading-xl">
              優惠<span className="text-brand-primary">組合方案</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto body-lg">為您提供全方位的網路安全保護</p>
          </div>

          <div className="flex justify-center">
            <div className="max-w-md w-full">
              <Card className="bg-card border-border shadow-lg ring-2 ring-brand-primary shadow-xl">
                <CardHeader className="pb-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="heading-md text-card-foreground">優惠價</CardTitle>
                      <CardDescription className="body-sm text-muted-foreground mt-2">
                        WAF防禦 + 應用層DDoS防禦 + 全球CDN加速
                      </CardDescription>
                    </div>
                    <div className="bg-brand-primary text-white text-xs px-3 py-1 rounded-full font-light whitespace-nowrap flex-shrink-0 self-start">
                      推薦
                    </div>
                  </div>
                  <div className="mt-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-muted-foreground font-light">$</span>
                      <span className="text-3xl font-light text-card-foreground">7萬</span>
                      <span className="text-muted-foreground font-light">/月起</span>
                      <span className="body-sm text-muted-foreground line-through font-light ml-2">原價$11萬</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="px-0 py-4 bg-brand-dark-secondary rounded-lg">
                    <Link href="/contact">
                      <Button className="w-full btn-primary">選擇優惠組合</Button>
                    </Link>
                  </div>

                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <Check className="h-5 w-5 mr-2 flex-shrink-0 text-brand-primary" />
                      <span className="text-muted-foreground body-sm">WAF 網站應用防火牆</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 mr-2 flex-shrink-0 text-brand-primary" />
                      <span className="text-muted-foreground body-sm">應用層 DDoS 防禦</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 mr-2 flex-shrink-0 text-brand-primary" />
                      <span className="text-muted-foreground body-sm">全球 CDN 加速服務</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 mr-2 flex-shrink-0 text-brand-primary" />
                      <span className="text-muted-foreground body-sm">乾淨流量 10TB</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 mr-2 flex-shrink-0 text-brand-primary" />
                      <span className="text-muted-foreground body-sm">應用程式 1個</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 mr-2 flex-shrink-0 text-brand-primary" />
                      <span className="text-muted-foreground body-sm">7x24 專業技術支援</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function ServiceCard({ title, description, icon, price, priceUnit, priceNote }) {
  return (
    <div className="relative h-[280px] rounded-2xl p-[1px] bg-gradient-to-b from-[#45A4C0] via-[#45A4C080] to-transparent">
      <Card className="feature-card relative h-full flex flex-col overflow-hidden border-0 rounded-2xl bg-card">
        <CardHeader className="flex flex-row items-center gap-4 pb-3">
          <div className="transform transition-all duration-500 hover:scale-110">{icon}</div>
          <div className="flex-1">
            <CardTitle className="heading-md">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0 flex flex-col flex-1">
          <CardDescription className="text-muted-foreground body-sm mb-4 line-clamp-3 h-[72px]">
            {description}
          </CardDescription>
          <div className="mt-auto">
            {price && (
              <div className="mt-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-medium text-brand-primary">{price}</span>
                  <span className="body-sm text-muted-foreground">{priceUnit}</span>
                </div>
                {priceNote && <p className="text-xs text-muted-foreground font-light mt-1">{priceNote}</p>}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="card-interactive group">
      <Card className="feature-card h-[200px] bg-card border-border">
        <CardContent className="p-6 h-full flex flex-col justify-center items-center text-center relative">
          <div className="transition-all duration-300 group-hover:opacity-0 group-hover:transform group-hover:-translate-y-4">
            <div className="flex flex-col items-center gap-4">
              <div className="p-3 rounded-lg bg-brand-primary/10 backdrop-blur-sm transition-all duration-300 group-hover:scale-110">
                {React.cloneElement(icon, { className: "h-8 w-8 text-brand-primary" })}
              </div>
              <h3 className="text-lg font-light text-card-foreground">{title}</h3>
            </div>
          </div>

          <div className="absolute inset-0 p-6 flex flex-col justify-center items-center text-center opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
            <div className="flex flex-col items-center gap-3">
              <div className="p-2 rounded-lg bg-brand-primary/10 backdrop-blur-sm">
                {React.cloneElement(icon, { className: "h-6 w-6 text-brand-primary" })}
              </div>
              <h3 className="text-base font-light text-card-foreground mb-2">{title}</h3>
              <p className="body-sm text-muted-foreground leading-relaxed">{description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
