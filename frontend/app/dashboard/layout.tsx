"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Settings, ChevronDown, Captions } from "lucide-react"
import { WAFDataProvider } from "./waf-data-context"
import { DashboardDataProvider } from "./dashboard-data-context"

const cloudflareSettings = {
  name: "設定",
  icon: Settings,
  children: [
    {
      name: "DNS 設定",
      href: "/dashboard/cloudflare/dns-settings",
    },
    {
      name: "WAF 設定",
      href: "/dashboard/cloudflare/waf-settings",
    },
    {
      name: "DDoS 設定",
      href: "/dashboard/cloudflare/ddos-settings",
    },
    {
      name: "CDN 設定",
      href: "/dashboard/cloudflare/cdn-settings",
    },
  ],
}

const f5Settings = {
  name: "設定",
  icon: Settings,
  children: [
    {
      name: "WAF 設定",
      href: "/dashboard/f5/waf-settings",
    },
  ],
}

const catoSettings = {
  name: "設定",
  icon: Settings,
  children: [
    {
      name: "SASE 設定",
      href: "/dashboard/cato/sase-settings",
    },
  ],
}

const otherBrands = [
  {
    name: "Cloudflare",
    href: "/dashboard/cloudflare/overview",
    isImage: true,
    imageSrc: "/logos/Cloudflar.png",
    color: "#F38020",
    isClickable: true,
  },
  {
    name: "PaloAlto",
    href: "/dashboard/paloalto",
    isImage: true,
    imageSrc: "/logos/palo-alto-networks-1.png",
    color: "#FA582D",
    isClickable: true,
  },
  {
    name: "F5",
    href: "/dashboard/f5",
    isImage: true,
    imageSrc: "/logos/f5_b.png",
    color: "#E40046",
    isClickable: true,
  },
  {
    name: "CATO",
    href: "/dashboard/cato",
    isImage: true,
    imageSrc: "/logos/cato-networks.png",
    color: "#00A3E0",
    isClickable: true,
  },
  {
    name: "Intezer",
    href: "/dashboard/intezer",
    isImage: true,
    imageSrc: "/logos/INTEZER_logo.png",
    color: "#7B68EE",
    isClickable: false,
  },
  {
    name: "CycrafAI",
    href: "/dashboard/cycrafai",
    isImage: true,
    imageSrc: "/logos/craftai.png",
    color: "#00CED1",
    isClickable: false,
  },
  {
    name: "SIEM",
    href: "/dashboard/siem",
    isImage: false,
    icon: Captions,
    color: "#9CA3AF",
    isClickable: false,
  },
]

const MIN_WIDTH = 80
const MAX_WIDTH = 256
const COLLAPSE_THRESHOLD = 150

function DashboardLayoutComponent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarWidth, setSidebarWidth] = useState(MIN_WIDTH)
  const [isResizing, setIsResizing] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const [currentBrand, setCurrentBrand] = useState(otherBrands[0])
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false)

  useEffect(() => {
    const savedWidth = localStorage.getItem("dashboard-sidebar-width")
    if (savedWidth) {
      setSidebarWidth(Number(savedWidth))
    }
  }, [])

  useEffect(() => {
    const brand = otherBrands.find((b) => pathname.startsWith(b.href))
    setCurrentBrand(brand || otherBrands[0])
  }, [pathname])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return

      const newWidth = e.clientX
      if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
        setSidebarWidth(newWidth)
        localStorage.setItem("dashboard-sidebar-width", String(newWidth))
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isResizing])

  const isDashboardRoot = pathname === "/dashboard"
  const isCloudflareRoute = pathname.startsWith("/dashboard/cloudflare")
  const isF5Route = pathname.startsWith("/dashboard/f5")
  const isCatoRoute = pathname.startsWith("/dashboard/cato")
  const isCollapsed = sidebarWidth < COLLAPSE_THRESHOLD

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }

  const handleSettingsClick = () => {
    if (isCollapsed) {
      setSidebarWidth(MAX_WIDTH)
      localStorage.setItem("dashboard-sidebar-width", String(MAX_WIDTH))
      setTimeout(() => {
        setIsSettingsExpanded(true)
      }, 100)
    } else {
      setIsSettingsExpanded(!isSettingsExpanded)
    }
  }

  if (isDashboardRoot) {
    return <div className="h-screen bg-[#08131D]">{children}</div>
  }

  const currentSettings = isCloudflareRoute
    ? cloudflareSettings
    : isF5Route
      ? f5Settings
      : isCatoRoute
        ? catoSettings
        : null

  return (
    <div className="flex h-screen bg-[#08131D]">
      {/* Sidebar */}
      <motion.div
        ref={sidebarRef}
        initial={{ x: -300, opacity: 0 }}
        animate={{
          x: 0,
          opacity: 1,
          width: sidebarWidth,
        }}
        transition={{ duration: isResizing ? 0 : 0.3 }}
        className="bg-slate-900/40 backdrop-blur-md border-r border-white/10 flex flex-col relative"
        style={{ width: sidebarWidth }}
      >
        {/* Header - 顯示當前品牌 */}
        <div className="p-6 border-b border-white/10">
          <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}>
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center p-2 flex-shrink-0"
              style={{ backgroundColor: `${currentBrand.color}20` }}
            >
              {currentBrand.isImage ? (
                <img
                  src={currentBrand.imageSrc || "/placeholder.svg"}
                  alt={currentBrand.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  {currentBrand.icon && <currentBrand.icon className="w-5 h-5" style={{ color: currentBrand.color }} />}
                </div>
              )}
            </div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div>
                    <h2 className="text-white font-semibold whitespace-nowrap">{currentBrand.name}</h2>
                    <p className="text-xs text-slate-400 whitespace-nowrap">Dashboard</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {currentSettings && (
            <div className="space-y-1">
              {/* 設定父項目 */}
              <motion.div
                whileHover={{ x: 2 }}
                onClick={handleSettingsClick}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer text-slate-400 hover:text-white hover:bg-white/5 ${
                  isCollapsed ? "justify-center" : ""
                }`}
                title={isCollapsed ? currentSettings.name : undefined}
              >
                <currentSettings.icon className="w-5 h-5 flex-shrink-0" />
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="whitespace-nowrap flex-1"
                    >
                      {currentSettings.name}
                    </motion.span>
                  )}
                </AnimatePresence>
                {!isCollapsed && (
                  <motion.div animate={{ rotate: isSettingsExpanded ? 0 : -90 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                )}
              </motion.div>

              {/* 設定子項目 */}
              <AnimatePresence>
                {isSettingsExpanded && !isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-4 space-y-1"
                  >
                    {currentSettings.children.map((item) => {
                      const isActive = pathname === item.href
                      return (
                        <Link key={item.href} href={item.href}>
                          <motion.div
                            whileHover={{ x: 2 }}
                            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                              isActive
                                ? "bg-slate-800/50 text-white"
                                : "text-slate-400 hover:text-white hover:bg-white/5"
                            }`}
                          >
                            <span className="text-sm whitespace-nowrap">{item.name}</span>
                          </motion.div>
                        </Link>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {currentSettings && (
            <div className="my-4">
              <div className="border-t border-white/10" />
            </div>
          )}

          {!isCollapsed && (
            <div className="px-4 py-2 uppercase tracking-wider text-destructive-foreground font-medium text-base">
              Global dashboard
            </div>
          )}

          {otherBrands.map((brand) => {
            const isActive = pathname.startsWith(brand.href)

            const brandContent = (
              <motion.div
                key={brand.href} // Added key property here
                whileHover={brand.isClickable ? { x: 2 } : {}}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive ? "bg-slate-800/50 text-white" : "text-slate-400 hover:text-white hover:bg-white/5"
                } ${isCollapsed ? "justify-center" : ""} ${!brand.isClickable ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                title={isCollapsed ? brand.name : undefined}
              >
                {brand.isImage ? (
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 p-1.5"
                    style={{ backgroundColor: `${brand.color}20` }}
                  >
                    <img
                      src={brand.imageSrc || "/placeholder.svg"}
                      alt={brand.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${brand.color}20` }}
                  >
                    {brand.icon && <brand.icon className="w-5 h-5 text-foreground" style={{ color: brand.color }} />}
                  </div>
                )}
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="whitespace-nowrap font-light font-sans"
                    >
                      {brand.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            )

            return brand.isClickable ? (
              <Link key={brand.href} href={brand.href}>
                {brandContent}
              </Link>
            ) : (
              <div key={brand.href}>{brandContent}</div>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link href="/dashboard">
            <button
              className={`w-full px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 ${isCollapsed ? "flex justify-center" : ""}`}
              title={isCollapsed ? "返回主控台" : undefined}
            >
              {isCollapsed ? "←" : "← 返回主控台"}
            </button>
          </Link>
        </div>

        {/* Resize Handle */}
        <div
          onMouseDown={handleMouseDown}
          className={`absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-500/50 transition-colors ${
            isResizing ? "bg-blue-500" : "bg-transparent"
          }`}
          style={{ zIndex: 10 }}
        >
          <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-3 h-12 rounded-full bg-slate-700/50 hover:bg-blue-500/50 transition-colors" />
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardDataProvider>
      <WAFDataProvider>
        <DashboardLayoutComponent>{children}</DashboardLayoutComponent>
      </WAFDataProvider>
    </DashboardDataProvider>
  )
}
