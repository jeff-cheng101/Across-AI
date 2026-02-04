"use client"

import type React from "react"
import { LayoutDashboard, Shield, Zap, Globe } from "lucide-react"

const sidebarItems = [
  {
    name: "總覽",
    href: "/dashboard/cloudflare/overview",
    icon: LayoutDashboard,
    label: "Overview",
  },
  {
    name: "WAF 設定",
    href: "/dashboard/cloudflare/waf-settings",
    icon: Shield,
  },
  {
    name: "DDoS 設定",
    href: "/dashboard/cloudflare/ddos-settings",
    icon: Zap,
  },
  {
    name: "CDN 設定",
    href: "/dashboard/cloudflare/cdn-settings",
    icon: Globe,
  },
  {
    name: "DNS 設定",
    href: "/dashboard/cloudflare/dns-settings",
    icon: Globe,
  },
]

const otherBrands = [
  {
    name: "Cloudflare",
    href: "/dashboard/cloudflare/overview",
    isImage: true,
    imageSrc: "/logos/Cloudflar.png",
    color: "#F38020", // Cloudflare 橘色
  },
  {
    name: "PaloAlto",
    href: "/dashboard/paloalto",
    isImage: true,
    imageSrc: "/logos/palo-alto-networks-1.png",
    color: "#FA582D", // PaloAlto 紅色
  },
  {
    name: "F5",
    href: "/dashboard/f5",
    isImage: true,
    imageSrc: "/logos/f5_b.png",
    color: "#E40046", // F5 紅色
  },
  {
    name: "CATO",
    href: "/dashboard/cato",
    isImage: true,
    imageSrc: "/logos/cato-networks.png",
    color: "#00A3E0", // CATO 藍色
  },
  {
    name: "Intezer",
    href: "/dashboard/intezer",
    isImage: true,
    imageSrc: "/logos/INTEZER_logo.png",
    color: "#7B68EE", // Intezer 紫色
  },
  {
    name: "CycrafAI",
    href: "/dashboard/cycrafai",
    isImage: true,
    imageSrc: "/logos/craftai.png",
    color: "#00CED1", // CycrafAI 青色
  },
  {
    name: "SIEM",
    href: "/dashboard/siem",
    isImage: true,
    imageSrc: "",
    color: "#32CD32", // SIEM 綠色
  },
]

const MIN_WIDTH = 80
const MAX_WIDTH = 256
const COLLAPSE_THRESHOLD = 150

export default function CloudflareLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
