"use client"

import { motion } from "framer-motion"
import { Activity, Calendar } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CustomDatePicker } from "@/components/custom-date-picker"

// ADDED CODE: 添加 MapLibre 地圖組件
function AttackSourceMap() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)

  useEffect(() => {
    if (map.current || !mapContainer.current) return

    // 動態載入 MapLibre GL JS
    const loadMapLibre = async () => {
      // 添加 CSS
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = "https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.css"
      document.head.appendChild(link)

      // 載入 JS
      const script = document.createElement("script")
      script.src = "https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.js"
      script.async = true

      script.onload = () => {
        const maplibregl = (window as any).maplibregl

        map.current = new maplibregl.Map({
          container: mapContainer.current,
          style: "https://demotiles.maplibre.org/style.json",
          center: [121.5, 25.0], // 台灣中心
          zoom: 1.5,
          attributionControl: false,
        })

        // 創建脈衝點動畫
        const size = 100
        const pulsingDot = {
          width: size,
          height: size,
          data: new Uint8Array(size * size * 4),

          onAdd() {
            const canvas = document.createElement("canvas")
            canvas.width = this.width
            canvas.height = this.height
            this.context = canvas.getContext("2d")
          },

          render() {
            const duration = 1000
            const t = (performance.now() % duration) / duration
            const radius = (size / 2) * 0.3
            const outerRadius = (size / 2) * 0.7 * t + radius
            const context = this.context

            context.clearRect(0, 0, this.width, this.height)
            context.beginPath()
            context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2)
            context.fillStyle = `rgba(239, 68, 68, ${1 - t})`
            context.fill()

            context.beginPath()
            context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2)
            context.fillStyle = "rgba(239, 68, 68, 1)"
            context.strokeStyle = "white"
            context.lineWidth = 2 + 4 * (1 - t)
            context.fill()
            context.stroke()

            this.data = context.getImageData(0, 0, this.width, this.height).data
            map.current.triggerRepaint()
            return true
          },
        }

        map.current.on("load", () => {
          map.current.addImage("pulsing-dot", pulsingDot, { pixelRatio: 2 })

          // 添加攻擊來源點
          const attackLocations = [
            { coordinates: [121.5, 25.0], attacks: 107235, name: "台灣" },
            { coordinates: [-95.7, 37.1], attacks: 15645, name: "美國" },
            { coordinates: [-106.3, 56.1], attacks: 5128, name: "加拿大" },
            { coordinates: [5.3, 52.1], attacks: 3041, name: "荷蘭" },
            { coordinates: [-0.1, 51.5], attacks: 861, name: "英國" },
            { coordinates: [2.3, 48.9], attacks: 419, name: "法國" },
            { coordinates: [10.5, 51.2], attacks: 348, name: "德國" },
            { coordinates: [103.8, 1.3], attacks: 215, name: "新加坡" },
            { coordinates: [116.4, 39.9], attacks: 213, name: "中國" },
          ]

          map.current.addSource("attack-points", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: attackLocations.map((loc) => ({
                type: "Feature",
                properties: {
                  attacks: loc.attacks,
                  name: loc.name,
                },
                geometry: {
                  type: "Point",
                  coordinates: loc.coordinates,
                },
              })),
            },
          })

          map.current.addLayer({
            id: "attack-points",
            type: "symbol",
            source: "attack-points",
            layout: {
              "icon-image": "pulsing-dot",
              "icon-allow-overlap": true,
            },
          })

          // 添加標籤
          map.current.addLayer({
            id: "attack-labels",
            type: "symbol",
            source: "attack-points",
            layout: {
              "text-field": ["concat", ["get", "name"], "\n", ["get", "attacks"]],
              "text-size": 11,
              "text-offset": [0, 2],
              "text-anchor": "top",
            },
            paint: {
              "text-color": "#ffffff",
              "text-halo-color": "#000000",
              "text-halo-width": 1,
            },
          })
        })
      }

      document.body.appendChild(script)
    }

    loadMapLibre()

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  return <div ref={mapContainer} className="w-full h-full rounded-lg" />
}

export default function F5DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [dateFrom, setDateFrom] = useState<Date | undefined>(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
  const [dateTo, setDateTo] = useState<Date | undefined>(new Date())

  const tabs = [
    { id: "overview", label: "總覽" },
    { id: "waf", label: "WAF分析" },
    { id: "ltm", label: "LTM" },
  ]

  // Sample data for charts
  const trafficData = [
    { time: "0", traffic: 1.2 },
    { time: "5", traffic: 1.5 },
    { time: "10", traffic: 1.8 },
    { time: "15", traffic: 2.1 },
    { time: "20", traffic: 2.5 },
    { time: "25", traffic: 2.8 },
    { time: "30", traffic: 3.2 },
  ]

  const wafTimelineData = [
    {
      time: "2025/08/23 21:00",
      abuseOfFunctionality: 5000,
      xss: 8000,
      forcefulBrowsing: 3000,
      informationLeakage: 2000,
      sessionHijacking: 1500,
    },
    {
      time: "2025/08/24 09:00",
      abuseOfFunctionality: 12000,
      xss: 18000,
      forcefulBrowsing: 7000,
      informationLeakage: 4500,
      sessionHijacking: 3200,
    },
    {
      time: "2025/08/24 21:00",
      abuseOfFunctionality: 8000,
      xss: 13000,
      forcefulBrowsing: 5000,
      informationLeakage: 3200,
      sessionHijacking: 2400,
    },
    {
      time: "2025/08/25 09:00",
      abuseOfFunctionality: 15000,
      xss: 25000,
      forcefulBrowsing: 10000,
      informationLeakage: 6000,
      sessionHijacking: 4500,
    },
    {
      time: "2025/08/25 21:00",
      abuseOfFunctionality: 22000,
      xss: 45000,
      forcefulBrowsing: 18000,
      informationLeakage: 10000,
      sessionHijacking: 8000,
    },
    {
      time: "2025/08/26 09:00",
      abuseOfFunctionality: 6000,
      xss: 10000,
      forcefulBrowsing: 4000,
      informationLeakage: 2500,
      sessionHijacking: 1800,
    },
  ]

  const attackDistributionData = [
    { name: "Information Leakage", value: 62, color: "#ea580C" }, // 深橙色 - 62%
    { name: "Cross Site Scripting (XSS)", value: 12, color: "#EF7338" }, // 橙色 - 12%
    { name: "Forceful Browsing", value: 6, color: "#fb923C" }, // 亮橙色 - 6%
    { name: "Session Hijacking", value: 5, color: "#FC9F5B" }, // 淺橙色 - 5%
    { name: "Abuse of Functionality", value: 4, color: "#FDBA74" }, // 柔和橙色 - 4%
    { name: "Other Application Activity", value: 3, color: "#FEC89A" }, // 淡橙色 - 3%
    { name: "Path Traversal", value: 2, color: "#FEd7aa" }, // 極淺橙色 - 2%
    { name: "Other", value: 2, color: "#FEE2BF" }, // 奶油橙色 - 2%
    { name: "Predictable Resource Location", value: 1, color: "#FFEDD5" }, // 極淺奶油色 - 1%
    { name: "SQL Injection", value: 1, color: "#FFF7ED" }, // 最淺奶油色 - 1%
    { name: "Denial of Service", value: 1, color: "#FFEDD5" }, // 極淺奶油色 - 1%
    { name: "Detection Evasion", value: 1, color: "#FFF7ED" }, // 最淺奶油色 - 1%
  ]

  const owaspAttackStats = [
    { type: "owasp", name: "A3:2017 Sensitive Data Exposure", count: 80537 },
    { type: "Others", name: "Others", count: 34113 },
    { type: "A7:2017", name: "A7:2017 Cross-Site Scripting (XSS)", count: 14896 },
    { type: "Other", name: "Other", count: 2455 },
    { type: "A1:2017", name: "A1:2017 Injection", count: 1024 },
    { type: "A8:2017", name: "A8:2017 Insecure Deserialization", count: 821 },
    { type: "A01:2021", name: "A01:2021 Broken Access Control", count: 245 },
    { type: "A5:2017", name: "A5:2017 Broken Access Control", count: 138 },
    { type: "Other", name: "Other: Bots detection", count: 119 },
    { type: "A06:2021", name: "A06:2021 Vulnerable and Outdated Components", count: 21 },
  ]

  const topAttackSourceIPs = [
    { ip: "107.173.52.164", count: 4500 },
    { ip: "185.218.84.48", count: 3800 },
    { ip: "204.79.203.208", count: 2800 },
    { ip: "1.34.61.17", count: 2400 },
    { ip: "185.224.85.197", count: 2100 },
    { ip: "172.68.87.29", count: 1800 },
    { ip: "182.158.243.243", count: 1600 },
    { ip: "182.158.243.242", count: 1400 },
    { ip: "172.69.221.159", count: 1200 },
  ]

  // ADDED CODE: 添加攻擊目標IP統計數據
  const topAttackTargetIPs = [
    { ip: "202.39.33.190", count: 132632 },
    { ip: "202.39.33.191", count: 1961 },
    { ip: "202.39.33.192", count: 892 },
    { ip: "202.39.33.193", count: 654 },
    { ip: "202.39.33.194", count: 432 },
    { ip: "202.39.33.195", count: 287 },
    { ip: "202.39.33.196", count: 156 },
    { ip: "202.39.33.197", count: 98 },
    { ip: "202.39.33.198", count: 67 },
    { ip: "202.39.33.199", count: 43 },
  ]

  const ltmSourceCountries = [
    { country: "Intranet", count: 322714 },
    { country: "Taiwan", count: 110975 },
    { country: "Luxembourg", count: 91136 },
    { country: "Australia", count: 63123 },
    { country: "United States", count: 23825 },
    { country: "Germany", count: 2827 },
    { country: "Ukraine", count: 1904 },
    { country: "United Kingdom", count: 205 },
    { country: "Russia", count: 77 },
    { country: "China", count: 75 },
  ]

  const ltmSourceCities = [
    { city: "Intranet", count: 322714 },
    { city: "Taipei", count: 110397 },
    { city: "unknown", count: 99290 },
    { city: "Brisbane", count: 61424 },
    { city: "Los Angeles", count: 14482 },
    { city: "Frankfurt am Main", count: 2920 },
    { city: "San Jose", count: 1184 },
    { city: "San Francisco", count: 562 },
    { city: "Keelung", count: 406 },
    { city: "Richmond", count: 365 },
  ]

  const ltmTopSourceIPs = [
    { ip: "162.158.243.83", count: 2769 },
    { ip: "162.158.243.40", count: 2673 },
    { ip: "172.68.87.214", count: 2670 },
    { ip: "172.68.87.159", count: 2381 },
    { ip: "172.68.87.215", count: 1894 },
    { ip: "172.68.87.198", count: 1882 },
    { ip: "162.158.243.41", count: 1794 },
    { ip: "162.158.243.79", count: 1719 },
    { ip: "185.234.65.197", count: 1285 },
    { ip: "172.68.87.175", count: 1047 },
  ]

  const ltmSourceIPTraffic = [
    { ip: "162.158.243.83", traffic: 9 },
    { ip: "162.158.243.40", traffic: 9 },
    { ip: "172.68.87.214", traffic: 13 },
    { ip: "172.68.87.159", traffic: 8 },
    { ip: "172.68.87.215", traffic: 4 },
    { ip: "172.68.87.198", traffic: 3 },
    { ip: "162.158.243.41", traffic: 3 },
    { ip: "162.158.243.79", traffic: 3 },
    { ip: "185.234.65.197", traffic: 4 },
    { ip: "172.68.87.175", traffic: 26 },
  ]

  const ltmDomainNames = [
    { domain: "www.twister5.com.tw", count: 613929 },
    { domain: "202.39.33.190:443", count: 1293 },
    { domain: "ns1.twister5.com.tw", count: 618 },
    { domain: "sslvpn.twister5.com.tw", count: 534 },
    { domain: "202.39.33.190", count: 63 },
    { domain: "202.39.33.190.hinet-ip.hinet.net", count: 33 },
    { domain: "www.baidu.com:443", count: 13 },
    { domain: "icap-servert.net", count: 12 },
    { domain: "sslvpn.twister5.com.tw:443", count: 3 },
    { domain: "sdkapi.twister5.com.tw:d:443", count: 2 },
  ]

  // ADDED CODE: 添加伺服器負載均衡數據
  const serverLoadBalanceData = [
    { time: "2024/10/31 19:00", dst_ip_10_168_168_99: 0, dst_ip_202_55_247_128: 0 },
    { time: "2024/11/01 19:00", dst_ip_10_168_168_99: 0, dst_ip_202_55_247_128: 0 },
    { time: "2024/11/02 19:00", dst_ip_10_168_168_99: 0, dst_ip_202_55_247_128: 0 },
    { time: "2024/11/03 19:00", dst_ip_10_168_168_99: 0, dst_ip_202_55_247_128: 0 },
    { time: "2024/11/04 19:00", dst_ip_10_168_168_99: 0, dst_ip_202_55_247_128: 0 },
    { time: "2024/11/05 19:00", dst_ip_10_168_168_99: 0, dst_ip_202_55_247_128: 0 },
    { time: "2024/11/06 19:00", dst_ip_10_168_168_99: 0, dst_ip_202_55_247_128: 0 },
    { time: "2024/11/07 19:00", dst_ip_10_168_168_99: 0, dst_ip_202_55_247_128: 0 },
    { time: "2024/11/08 19:00", dst_ip_10_168_168_99: 0, dst_ip_202_55_247_128: 0 },
    { time: "2024/11/09 19:00", dst_ip_10_168_168_99: 0, dst_ip_202_55_247_128: 0 },
    { time: "2024/11/10 19:00", dst_ip_10_168_168_99: 0, dst_ip_202_55_247_128: 0 },
    { time: "2024/11/11 19:00", dst_ip_10_168_168_99: 0, dst_ip_202_55_247_128: 0 },
    { time: "2024/11/12 19:00", dst_ip_10_168_168_99: 0, dst_ip_202_55_247_128: 0 },
    { time: "2024/11/13 19:00", dst_ip_10_168_168_99: 0, dst_ip_202_55_247_128: 0 },
    { time: "2024/11/14 19:00", dst_ip_10_168_168_99: 0, dst_ip_202_55_247_128: 0 },
    { time: "2024/11/15 19:00", dst_ip_10_168_168_99: 0, dst_ip_202_55_247_128: 0 },
    { time: "2024/11/16 19:00", dst_ip_10_168_168_99: 0, dst_ip_202_55_247_128: 0 },
    { time: "2024/11/17 19:00", dst_ip_10_168_168_99: 0, dst_ip_202_55_247_128: 0 },
    { time: "2024/11/18 19:00", dst_ip_10_168_168_99: 0, dst_ip_202_55_247_128: 0 },
    { time: "2024/11/19 19:00", dst_ip_10_168_168_99: 0, dst_ip_202_55_247_128: 0 },
    { time: "2024/11/20 19:00", dst_ip_10_168_168_99: 0, dst_ip_202_55_247_128: 0 },
    { time: "2024/11/21 19:00", dst_ip_10_168_168_99: 0, dst_ip_202_55_247_128: 0 },
    { time: "2024/11/22 19:00", dst_ip_10_168_168_99: 5000, dst_ip_202_55_247_128: 0 },
    { time: "2024/11/23 19:00", dst_ip_10_168_168_99: 58000, dst_ip_202_55_247_128: 2000 },
    { time: "2024/11/24 19:00", dst_ip_10_168_168_99: 160000, dst_ip_202_55_247_128: 2000 },
    { time: "2024/11/25 19:00", dst_ip_10_168_168_99: 12000, dst_ip_202_55_247_128: 1000 },
    { time: "2024/11/26 19:00", dst_ip_10_168_168_99: 15000, dst_ip_202_55_247_128: 1000 },
    { time: "2024/11/27 19:00", dst_ip_10_168_168_99: 14000, dst_ip_202_55_247_128: 1000 },
    { time: "2024/11/28 19:00", dst_ip_10_168_168_99: 16000, dst_ip_202_55_247_128: 1000 },
    { time: "2024/11/29 19:00", dst_ip_10_168_168_99: 15000, dst_ip_202_55_247_128: 1000 },
    { time: "2024/11/30 19:00", dst_ip_10_168_168_99: 17000, dst_ip_202_55_247_128: 1000 },
    { time: "2024/12/01 19:00", dst_ip_10_168_168_99: 16000, dst_ip_202_55_247_128: 1000 },
    { time: "2024/12/02 19:00", dst_ip_10_168_168_99: 15000, dst_ip_202_55_247_128: 1000 },
    { time: "2024/12/03 19:00", dst_ip_10_168_168_99: 14000, dst_ip_202_55_247_128: 1000 },
    { time: "2024/12/04 19:00", dst_ip_10_168_168_99: 16000, dst_ip_202_55_247_128: 1000 },
    { time: "2024/12/05 19:00", dst_ip_10_168_168_99: 15000, dst_ip_202_55_247_128: 1000 },
    { time: "2024/12/06 19:00", dst_ip_10_168_168_99: 14000, dst_ip_202_55_247_128: 1000 },
    { time: "2024/12/07 19:00", dst_ip_10_168_168_99: 13000, dst_ip_202_55_247_128: 1000 },
    { time: "2024/12/08 19:00", dst_ip_10_168_168_99: 12000, dst_ip_202_55_247_128: 1000 },
    { time: "2024/12/09 19:00", dst_ip_10_168_168_99: 11000, dst_ip_202_55_247_128: 1000 },
  ]

  // ADDED CODE: 添加伺服器回應代碼數據
  const serverResponseCodeData = [
    { time: "2024/10/31 19:00:00", status_200: 0, status_206: 0, status_301: 0, status_307: 0, status_400: 0 },
    { time: "2024/11/12 19:00:00", status_200: 0, status_206: 0, status_301: 0, status_307: 0, status_400: 0 },
    {
      time: "2024/11/24 19:00:00",
      status_200: 12000,
      status_206: 2000,
      status_301: 1500,
      status_307: 1000,
      status_400: 500,
    },
    {
      time: "2024/11/24 20:00:00",
      status_200: 65000,
      status_206: 5000,
      status_301: 3000,
      status_307: 2000,
      status_400: 1000,
    },
    {
      time: "2024/11/24 21:00:00",
      status_200: 155000,
      status_206: 10000,
      status_301: 6000,
      status_307: 3000,
      status_400: 1500,
    },
    {
      time: "2024/12/06 19:00:00",
      status_200: 12000,
      status_206: 1500,
      status_301: 1000,
      status_307: 800,
      status_400: 400,
    },
    {
      time: "2024/12/18 19:00:00",
      status_200: 11000,
      status_206: 1400,
      status_301: 900,
      status_307: 700,
      status_400: 350,
    },
    { time: "2024/10/31 19:00", status_200: 0, status_206: 0, status_301: 0, status_307: 0, status_400: 0 },
    { time: "2024/11/01 19:00", status_200: 0, status_206: 0, status_301: 0, status_307: 0, status_400: 0 },
    { time: "2024/11/02 19:00", status_200: 0, status_206: 0, status_301: 0, status_307: 0, status_400: 0 },
    { time: "2024/11/03 19:00", status_200: 0, status_206: 0, status_301: 0, status_307: 0, status_400: 0 },
    { time: "2024/11/04 19:00", status_200: 0, status_206: 0, status_301: 0, status_307: 0, status_400: 0 },
    { time: "2024/11/05 19:00", status_200: 0, status_206: 0, status_301: 0, status_307: 0, status_400: 0 },
    { time: "2024/11/06 19:00", status_200: 0, status_206: 0, status_301: 0, status_307: 0, status_400: 0 },
    { time: "2024/11/07 19:00", status_200: 0, status_206: 0, status_301: 0, status_307: 0, status_400: 0 },
    { time: "2024/11/08 19:00", status_200: 0, status_206: 0, status_301: 0, status_307: 0, status_400: 0 },
    { time: "2024/11/09 19:00", status_200: 0, status_206: 0, status_301: 0, status_307: 0, status_400: 0 },
    { time: "2024/11/10 19:00", status_200: 0, status_206: 0, status_301: 0, status_307: 0, status_400: 0 },
    { time: "2024/11/11 19:00", status_200: 0, status_206: 0, status_301: 0, status_307: 0, status_400: 0 },
    { time: "2024/11/12 19:00", status_200: 0, status_206: 0, status_301: 0, status_307: 0, status_400: 0 },
    { time: "2024/11/13 19:00", status_200: 0, status_206: 0, status_301: 0, status_307: 0, status_400: 0 },
    { time: "2024/11/14 19:00", status_200: 0, status_206: 0, status_301: 0, status_307: 0, status_400: 0 },
    { time: "2024/11/15 19:00", status_200: 0, status_206: 0, status_301: 0, status_307: 0, status_400: 0 },
    { time: "2024/11/16 19:00", status_200: 0, status_206: 0, status_301: 0, status_307: 0, status_400: 0 },
    { time: "2024/11/17 19:00", status_200: 0, status_206: 0, status_301: 0, status_307: 0, status_400: 0 },
    { time: "2024/11/18 19:00", status_200: 0, status_206: 0, status_301: 0, status_307: 0, status_400: 0 },
    { time: "2024/11/19 19:00", status_200: 0, status_206: 0, status_301: 0, status_307: 0, status_400: 0 },
    { time: "2024/11/20 19:00", status_200: 0, status_206: 0, status_301: 0, status_307: 0, status_400: 0 },
    { time: "2024/11/21 19:00", status_200: 0, status_206: 0, status_301: 0, status_307: 0, status_400: 0 },
    { time: "2024/11/22 19:00", status_200: 8000, status_206: 1000, status_301: 500, status_307: 300, status_400: 200 },
    {
      time: "2024/11/23 19:00",
      status_200: 62000,
      status_206: 4000,
      status_301: 2000,
      status_307: 1500,
      status_400: 500,
    },
    {
      time: "2024/11/24 19:00",
      status_200: 165000,
      status_206: 8000,
      status_301: 4000,
      status_307: 2000,
      status_400: 1000,
    },
    {
      time: "2024/11/25 19:00",
      status_200: 13000,
      status_206: 1500,
      status_301: 800,
      status_307: 500,
      status_400: 300,
    },
    {
      time: "2024/11/26 19:00",
      status_200: 15000,
      status_206: 1600,
      status_301: 900,
      status_307: 600,
      status_400: 350,
    },
    {
      time: "2024/11/27 19:00",
      status_200: 14000,
      status_206: 1500,
      status_301: 850,
      status_307: 550,
      status_400: 320,
    },
    {
      time: "2024/11/28 19:00",
      status_200: 16000,
      status_206: 1700,
      status_301: 950,
      status_307: 650,
      status_400: 380,
    },
    {
      time: "2024/11/29 19:00",
      status_200: 15000,
      status_206: 1600,
      status_301: 900,
      status_307: 600,
      status_400: 350,
    },
    {
      time: "2024/11/30 19:00",
      status_200: 17000,
      status_206: 1800,
      status_301: 1000,
      status_307: 700,
      status_400: 400,
    },
    {
      time: "2024/12/01 19:00",
      status_200: 16000,
      status_206: 1700,
      status_301: 950,
      status_307: 650,
      status_400: 380,
    },
    {
      time: "2024/12/02 19:00",
      status_200: 15000,
      status_206: 1600,
      status_301: 900,
      status_307: 600,
      status_400: 350,
    },
    {
      time: "2024/12/03 19:00",
      status_200: 14000,
      status_206: 1500,
      status_301: 850,
      status_307: 550,
      status_400: 320,
    },
    {
      time: "2024/12/04 19:00",
      status_200: 16000,
      status_206: 1700,
      status_301: 950,
      status_307: 650,
      status_400: 380,
    },
    {
      time: "2024/12/05 19:00",
      status_200: 15000,
      status_206: 1600,
      status_301: 900,
      status_307: 600,
      status_400: 350,
    },
    {
      time: "2024/12/06 19:00",
      status_200: 14000,
      status_206: 1500,
      status_301: 850,
      status_307: 550,
      status_400: 320,
    },
    {
      time: "2024/12/07 19:00",
      status_200: 13000,
      status_206: 1400,
      status_301: 800,
      status_307: 500,
      status_400: 300,
    },
    {
      time: "2024/12/08 19:00",
      status_200: 12000,
      status_206: 1300,
      status_301: 750,
      status_307: 450,
      status_400: 280,
    },
    {
      time: "2024/12/09 19:00",
      status_200: 11000,
      status_206: 1200,
      status_301: 700,
      status_307: 400,
      status_400: 250,
    },
  ]

  const domainAccessTimelineData = [
    {
      time: "2024/10/31 19:00:00",
      hostname_202_39_33_190: 0,
      hostname_202_39_33_190_443: 0,
      hostname_ns1: 0,
      hostname_sslvpn: 0,
      hostname_www: 0,
    },
    {
      time: "2024/11/01 19:00",
      hostname_202_39_33_190: 0,
      hostname_202_39_33_190_443: 0,
      hostname_ns1: 0,
      hostname_sslvpn: 0,
      hostname_www: 0,
    },
    {
      time: "2024/11/02 19:00",
      hostname_202_39_33_190: 0,
      hostname_202_39_33_190_443: 0,
      hostname_ns1: 0,
      hostname_sslvpn: 0,
      hostname_www: 0,
    },
    {
      time: "2024/11/03 19:00",
      hostname_202_39_33_190: 0,
      hostname_202_39_33_190_443: 0,
      hostname_ns1: 0,
      hostname_sslvpn: 0,
      hostname_www: 0,
    },
    {
      time: "2024/11/04 19:00",
      hostname_202_39_33_190: 0,
      hostname_202_39_33_190_443: 0,
      hostname_ns1: 0,
      hostname_sslvpn: 0,
      hostname_www: 0,
    },
    {
      time: "2024/11/05 19:00",
      hostname_202_39_33_190: 0,
      hostname_202_39_33_190_443: 0,
      hostname_ns1: 0,
      hostname_sslvpn: 0,
      hostname_www: 0,
    },
    {
      time: "2024/11/06 19:00",
      hostname_202_39_33_190: 0,
      hostname_202_39_33_190_443: 0,
      hostname_ns1: 0,
      hostname_sslvpn: 0,
      hostname_www: 0,
    },
    {
      time: "2024/11/07 19:00",
      hostname_202_39_33_190: 0,
      hostname_202_39_33_190_443: 0,
      hostname_ns1: 0,
      hostname_sslvpn: 0,
      hostname_www: 0,
    },
    {
      time: "2024/11/08 19:00",
      hostname_202_39_33_190: 0,
      hostname_202_39_33_190_443: 0,
      hostname_ns1: 0,
      hostname_sslvpn: 0,
      hostname_www: 0,
    },
    {
      time: "2024/11/09 19:00",
      hostname_202_39_33_190: 0,
      hostname_202_39_33_190_443: 0,
      hostname_ns1: 0,
      hostname_sslvpn: 0,
      hostname_www: 0,
    },
    {
      time: "2024/11/10 19:00",
      hostname_202_39_33_190: 0,
      hostname_202_39_33_190_443: 0,
      hostname_ns1: 0,
      hostname_sslvpn: 0,
      hostname_www: 0,
    },
    {
      time: "2024/11/11 19:00",
      hostname_202_39_33_190: 0,
      hostname_202_39_33_190_443: 0,
      hostname_ns1: 0,
      hostname_sslvpn: 0,
      hostname_www: 0,
    },
    {
      time: "2024/11/12 19:00",
      hostname_202_39_33_190: 0,
      hostname_202_39_33_190_443: 0,
      hostname_ns1: 0,
      hostname_sslvpn: 0,
      hostname_www: 0,
    },
    {
      time: "2024/11/13 19:00",
      hostname_202_39_33_190: 0,
      hostname_202_39_33_190_443: 0,
      hostname_ns1: 0,
      hostname_sslvpn: 0,
      hostname_www: 0,
    },
    {
      time: "2024/11/14 19:00",
      hostname_202_39_33_190: 0,
      hostname_202_39_33_190_443: 0,
      hostname_ns1: 0,
      hostname_sslvpn: 0,
      hostname_www: 0,
    },
    {
      time: "2024/11/15 19:00",
      hostname_202_39_33_190: 0,
      hostname_202_39_33_190_443: 0,
      hostname_ns1: 0,
      hostname_sslvpn: 0,
      hostname_www: 0,
    },
    {
      time: "2024/11/16 19:00",
      hostname_202_39_33_190: 0,
      hostname_202_39_33_190_443: 0,
      hostname_ns1: 0,
      hostname_sslvpn: 0,
      hostname_www: 0,
    },
    {
      time: "2024/11/17 19:00",
      hostname_202_39_33_190: 0,
      hostname_202_39_33_190_443: 0,
      hostname_ns1: 0,
      hostname_sslvpn: 0,
      hostname_www: 0,
    },
    {
      time: "2024/11/18 19:00",
      hostname_202_39_33_190: 0,
      hostname_202_39_33_190_443: 0,
      hostname_ns1: 0,
      hostname_sslvpn: 0,
      hostname_www: 0,
    },
    {
      time: "2024/11/19 19:00",
      hostname_202_39_33_190: 0,
      hostname_202_39_33_190_443: 0,
      hostname_ns1: 0,
      hostname_sslvpn: 0,
      hostname_www: 0,
    },
    {
      time: "2024/11/20 19:00",
      hostname_202_39_33_190: 0,
      hostname_202_39_33_190_443: 0,
      hostname_ns1: 0,
      hostname_sslvpn: 0,
      hostname_www: 0,
    },
    {
      time: "2024/11/21 19:00",
      hostname_202_39_33_190: 0,
      hostname_202_39_33_190_443: 0,
      hostname_ns1: 0,
      hostname_sslvpn: 0,
      hostname_www: 0,
    },
    {
      time: "2024/11/22 19:00",
      hostname_202_39_33_190: 500,
      hostname_202_39_33_190_443: 300,
      hostname_ns1: 200,
      hostname_sslvpn: 100,
      hostname_www: 3000,
    },
    {
      time: "2024/11/23 19:00",
      hostname_202_39_33_190: 2000,
      hostname_202_39_33_190_443: 1500,
      hostname_ns1: 1000,
      hostname_sslvpn: 500,
      hostname_www: 65000,
    },
    {
      time: "2024/11/24 19:00",
      hostname_202_39_33_190: 5000,
      hostname_202_39_33_190_443: 3000,
      hostname_ns1: 2000,
      hostname_sslvpn: 1000,
      hostname_www: 165000,
    },
    {
      time: "2024/11/25 19:00",
      hostname_202_39_33_190: 800,
      hostname_202_39_33_190_443: 500,
      hostname_ns1: 300,
      hostname_sslvpn: 200,
      hostname_www: 12000,
    },
    {
      time: "2024/11/26 19:00",
      hostname_202_39_33_190: 900,
      hostname_202_39_33_190_443: 600,
      hostname_ns1: 400,
      hostname_sslvpn: 250,
      hostname_www: 14000,
    },
    {
      time: "2024/11/27 19:00",
      hostname_202_39_33_190: 850,
      hostname_202_39_33_190_443: 550,
      hostname_ns1: 350,
      hostname_sslvpn: 220,
      hostname_www: 13000,
    },
    {
      time: "2024/11/28 19:00",
      hostname_202_39_33_190: 950,
      hostname_202_39_33_190_443: 650,
      hostname_ns1: 450,
      hostname_sslvpn: 280,
      hostname_www: 15000,
    },
    {
      time: "2024/11/29 19:00",
      hostname_202_39_33_190: 900,
      hostname_202_39_33_190_443: 600,
      hostname_ns1: 400,
      hostname_sslvpn: 250,
      hostname_www: 14000,
    },
    {
      time: "2024/11/30 19:00",
      hostname_202_39_33_190: 1000,
      hostname_202_39_33_190_443: 700,
      hostname_ns1: 500,
      hostname_sslvpn: 300,
      hostname_www: 16000,
    },
    {
      time: "2024/12/01 19:00",
      hostname_202_39_33_190: 950,
      hostname_202_39_33_190_443: 650,
      hostname_ns1: 450,
      hostname_sslvpn: 280,
      hostname_www: 15000,
    },
    {
      time: "2024/12/02 19:00",
      hostname_202_39_33_190: 900,
      hostname_202_39_33_190_443: 600,
      hostname_ns1: 400,
      hostname_sslvpn: 250,
      hostname_www: 14000,
    },
    {
      time: "2024/12/03 19:00",
      hostname_202_39_33_190: 850,
      hostname_202_39_33_190_443: 550,
      hostname_ns1: 350,
      hostname_sslvpn: 220,
      hostname_www: 13000,
    },
    {
      time: "2024/12/04 19:00",
      hostname_202_39_33_190: 950,
      hostname_202_39_33_190_443: 650,
      hostname_ns1: 450,
      hostname_sslvpn: 280,
      hostname_www: 15000,
    },
    {
      time: "2024/12/05 19:00",
      hostname_202_39_33_190: 900,
      hostname_202_39_33_190_443: 600,
      hostname_ns1: 400,
      hostname_sslvpn: 250,
      hostname_www: 14000,
    },
    {
      time: "2024/12/06 19:00",
      hostname_202_39_33_190: 850,
      hostname_202_39_33_190_443: 550,
      hostname_ns1: 350,
      hostname_sslvpn: 220,
      hostname_www: 13000,
    },
    {
      time: "2024/12/07 19:00",
      hostname_202_39_33_190: 800,
      hostname_202_39_33_190_443: 500,
      hostname_ns1: 300,
      hostname_sslvpn: 200,
      hostname_www: 12000,
    },
    {
      time: "2024/12/08 19:00",
      hostname_202_39_33_190: 750,
      hostname_202_39_33_190_443: 450,
      hostname_ns1: 280,
      hostname_sslvpn: 180,
      hostname_www: 11000,
    },
    {
      time: "2024/12/09 19:00",
      hostname_202_39_33_190: 700,
      hostname_202_39_33_190_443: 400,
      hostname_ns1: 250,
      hostname_sslvpn: 150,
      hostname_www: 10000,
    },
  ]

  const attackSourceCountries = [
    { country: "Taiwan", attacks: 107235 },
    { country: "United States", attacks: 15645 },
    { country: "Canada", attacks: 5128 },
    { country: "The Netherlands", attacks: 3041 },
    { country: "United Kingdom", attacks: 861 },
    { country: "France", attacks: 419 },
    { country: "Germany", attacks: 348 },
    { country: "Intranet", attacks: 238 },
    { country: "Singapore", attacks: 215 },
    { country: "China", attacks: 213 },
  ]

  const attackSourceCities = [
    { city: "Taipei", attacks: 106175 },
    { city: "unknown", attacks: 7791 },
    { city: "Los Angeles", attacks: 6359 },
    { city: "Ashburn", attacks: 2956 },
    { city: "Anaheim", attacks: 2494 },
    { city: "Eggebshoven", attacks: 1464 },
    { city: "Meppel", attacks: 874 },
    { city: "Keelong", attacks: 831 },
    { city: "Cedar Knolls", attacks: 738 },
    { city: "London", attacks: 704 },
  ]

  const wafEventsData = [
    { hour: "0", blocked: 45, monitored: 8 },
    { hour: "4", blocked: 62, monitored: 12 },
    { hour: "8", blocked: 89, monitored: 15 },
    { hour: "12", blocked: 125, monitored: 22 },
    { hour: "16", blocked: 98, monitored: 18 },
    { hour: "20", blocked: 72, monitored: 14 },
    { hour: "24", blocked: 56, monitored: 10 },
  ]

  const poolHealthData = [
    { name: "健康", value: 85, color: "#10b981" },
    { name: "警告", value: 10, color: "#f59e0b" },
    { name: "離線", value: 5, color: "#ef4444" },
  ]

  const ltmTopSourceIPsPieData = [
    { name: "162.158.243.40", value: 1, color: "#1E3A8A" }, // 深海軍藍
    { name: "162.158.243.83", value: 1, color: "#1E40AF" }, // 深藍
    { name: "172.68.87.159", value: 1, color: "#1D4ED8" }, // 皇家藍
    { name: "172.68.87.214", value: 1, color: "#2563EB" }, // 寶藍
    { name: "172.68.87.175", value: 1, color: "#3B82F6" }, // 亮藍
    { name: "185.234.65.197", value: 1, color: "#60A5FA" }, // 天藍
    { name: "162.158.243.78", value: 1, color: "#0EA5E9" }, // 藍青
    { name: "162.158.243.41", value: 1, color: "#06B6D4" }, // 青色
    { name: "172.68.87.158", value: 1, color: "#14B8A6" }, // 綠松石
    { name: "172.68.87.215", value: 1, color: "#0D9488" }, // 深青綠
  ]

  const sourceResponseTimeData = [
    { ip: "10.168.168.99", avgResponseTime: 246, accessCount: 587109 },
    { ip: "202.55.247.128", avgResponseTime: 2187, accessCount: 1 },
  ]

  const renderContent = () => {
    if (activeTab === "waf") {
      return (
        <>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.05, duration: 0.5 }}
            className="mb-6 text-center"
          >
            <h2 className="text-white text-2xl font-medium mb-2">應用程式防火牆報表(AWAF)</h2>
            <div className="text-slate-400 text-sm"></div>
          </motion.div>

          <div className="grid grid-cols-4 gap-4 mb-6">
            {/* 第一行 */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <div className="mb-2 text-xs font-normal text-slate-300">WAF攻擊事件總數</div>
              <div className="text-white font-medium text-2xl">134,799</div>
              <div className="text-slate-400 text-sm mt-1">次</div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.12, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <div className="mb-2 text-xs text-slate-300">SQL-Injection 攻擊</div>
              <div className="font-medium text-2xl text-white">1,041</div>
              <div className="text-slate-400 text-sm mt-1">次</div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.14, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <div className="mb-2 text-xs text-slate-300">XSS 攻擊</div>
              <div className="font-medium text-2xl text-white">15,492</div>
              <div className="text-slate-400 text-sm mt-1">次</div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.16, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <div className="mb-2 text-xs text-slate-300">CSRF 攻擊</div>
              <div className="font-medium text-2xl text-white">892</div>
              <div className="text-slate-400 text-sm mt-1">次</div>
            </motion.div>

            {/* 第二行 */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.18, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <div className="mb-2 text-xs text-slate-300">誤擋攻擊</div>
              <div className="font-medium text-2xl text-white">93</div>
              <div className="text-slate-400 text-sm mt-1">次</div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <div className="mb-2 text-xs text-slate-300">自動化攻擊</div>
              <div className="font-medium text-2xl text-white">437</div>
              <div className="text-slate-400 text-sm mt-1">次</div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.22, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <div className="mb-2 text-xs text-slate-300">暴力猜測攻擊</div>
              <div className="font-medium text-2xl text-white">0</div>
              <div className="text-slate-400 text-sm mt-1">次</div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.24, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <div className="mb-2 text-xs text-slate-300">緩衝溢出攻擊</div>
              <div className="font-medium text-2xl text-white">11</div>
              <div className="text-slate-400 text-sm mt-1">次</div>
            </motion.div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.26, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <h3 className="text-white mb-4 font-normal">全球攻擊來源地圖</h3>
              <div className="h-80">
                <AttackSourceMap />
              </div>
            </motion.div>

            {/* 全球攻擊來源國家統計表 */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.28, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <h3 className="text-white mb-4 font-normal">全球攻擊來源國家統計表</h3>

              <div className="overflow-auto max-h-80">
                <table className="w-full text-sm">
                  <thead className="border-b border-slate-700">
                    <tr>
                      <th className="text-left py-2 text-slate-400 font-normal">來源國家</th>
                      <th className="text-right py-2 text-slate-400 font-normal">次數</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attackSourceCountries.map((item, index) => (
                      <tr key={index} className="border-b border-slate-800">
                        <td className="py-2 text-slate-300">{item.country}</td>
                        <td className="py-2 text-right text-white">{item.attacks.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* 全球攻擊來源城市資料表 */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <h3 className="text-white mb-4 font-normal">全球攻擊來源城市資料表</h3>

              <div className="overflow-auto max-h-80">
                <table className="w-full text-sm">
                  <thead className="border-b border-slate-700">
                    <tr>
                      <th className="text-left py-2 text-slate-400 font-normal">來源城市</th>
                      <th className="text-right py-2 text-slate-400 font-normal">次數</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attackSourceCities.map((item, index) => (
                      <tr key={index} className="border-b border-slate-800">
                        <td className="py-2 text-slate-300">{item.city}</td>
                        <td className="py-2 text-right text-white">{item.attacks.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.32, duration: 0.5 }}
            className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md mb-6"
          >
            <h3 className="text-white mb-4 font-normal">攻擊時間軸</h3>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={wafTimelineData} barSize={16} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e3a8a" opacity={0.2} />
                  <XAxis
                    dataKey="time"
                    stroke="#60a5fa"
                    tick={{ fill: "#60a5fa", fontSize: 11 }}
                    angle={-15}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    stroke="#60a5fa"
                    tick={{ fill: "#60a5fa" }}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid #1e3a8a",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => value.toLocaleString()}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: "20px" }}
                    iconType="square"
                    formatter={(value) => <span className="text-slate-400 text-xs">{value}</span>}
                  />
                  <Bar dataKey="abuseOfFunctionality" stackId="a" fill="#1e3a8a" name="Abuse of Functionality" />
                  <Bar dataKey="xss" stackId="a" fill="#1e40af" name="Cross Site Scripting (XSS)" />
                  <Bar dataKey="forcefulBrowsing" stackId="a" fill="#3b82f6" name="Forceful Browsing" />
                  <Bar dataKey="informationLeakage" stackId="a" fill="#60a5fa" name="Information Leakage" />
                  <Bar dataKey="sessionHijacking" stackId="a" fill="#93c5fd" name="Session Hijacking" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.34, duration: 0.5 }}
            className="mb-6 text-center"
          >
            <h2 className="text-white text-2xl font-medium mb-6">十大攻擊統計比圖</h2>
          </motion.div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* 十大攻擊佔比圓餅圖 */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.36, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <h3 className="text-white mb-4 font-normal text-center">十大攻擊佔比圖</h3>

              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={attackDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      stroke="none"
                    >
                      {attackDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "1px solid #1e3a8a",
                        borderRadius: "8px",
                        color: "#ffffff",
                      }}
                      labelStyle={{ color: "#ffffff" }}
                      itemStyle={{ color: "#ffffff" }}
                      formatter={(value: number) => `${value}%`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* 圖例 */}
              <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                {attackDistributionData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-300 truncate" title={item.name}>
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* OWASP 十大攻擊統計表 */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.38, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <h3 className="text-white mb-4 font-normal text-center">OWASP十大攻擊統計表</h3>

              <div className="overflow-auto max-h-[500px]">
                <table className="w-full text-sm">
                  <thead className="border-b border-slate-700 sticky top-0 bg-slate-900/90">
                    <tr>
                      <th className="text-left py-3 text-slate-400 font-normal">owasp</th>
                      <th className="text-right py-3 text-slate-400 font-normal">次數</th>
                    </tr>
                  </thead>
                  <tbody>
                    {owaspAttackStats.map((item, index) => (
                      <tr key={index} className="border-b border-slate-800">
                        <td className="py-3 text-slate-300">{item.name}</td>
                        <td className="py-3 text-right text-white font-medium">{item.count.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* 十大攻擊來源 IP 次數統計表 (橫向長條圖) */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <h3 className="text-white mb-4 font-normal text-center">十大攻擊來源IP次數統計表</h3>

              <div className="h-[380px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topAttackSourceIPs} layout="vertical" margin={{ left: 100, right: 20 }} barSize={20}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e3a8a" opacity={0.2} />
                    <XAxis
                      type="number"
                      stroke="#60a5fa"
                      tick={{ fill: "#60a5fa", fontSize: 10 }}
                      tickFormatter={(value) => value.toLocaleString()}
                    />
                    <YAxis
                      type="category"
                      dataKey="ip"
                      stroke="#60a5fa"
                      tick={{ fill: "#60a5fa", fontSize: 11 }}
                      width={100}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "1px solid #1e3a8a",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => value.toLocaleString()}
                    />
                    <Bar dataKey="count" fill="#22c55e" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* 十大攻擊目標IP統計表 */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.42, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <h3 className="text-white mb-4 font-normal text-center">十大攻擊目標IP統計表</h3>

              <div className="overflow-auto max-h-[500px]">
                <table className="w-full text-sm">
                  <thead className="border-b border-slate-700 sticky top-0 bg-slate-900/90">
                    <tr>
                      <th className="text-left py-3 text-slate-400 font-normal">攻擊目標IP</th>
                      <th className="text-right py-3 text-slate-400 font-normal">次數</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topAttackTargetIPs.map((item, index) => (
                      <tr key={index} className="border-b border-slate-800">
                        <td className="text-slate-300 font-mono text-xs py-[10] tracking-tight leading-3">{item.ip}</td>
                        <td className="py-3 text-right text-white font-medium leading-3 tracking-tight">
                          {item.count.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </>
      )
    }

    if (activeTab === "ltm") {
      return (
        <>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.05, duration: 0.5 }}
            className="mb-6 text-center"
          >
            <h2 className="text-white text-2xl font-medium mb-2">負載平衡效能分析報表(LTM)</h2>
            <div className="text-slate-400 text-sm">
              <div>報表時間開始: 10/29/2025, 1:44:44 PM</div>
              <div>報表時間結束: 11/1/2024, 12:00:00 AM 到 12/31/2024, 12:00:00 AM</div>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* 左側欄位 */}
            <div className="flex flex-col gap-6">
              {/* 總請求次數 */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md text-center"
              >
                <div className="mb-2 text-sm font-normal text-slate-300">總請求次數</div>
                <div className="text-white font-medium text-2xl">616,671</div>
                <div className="text-slate-400 text-lg mt-1">次</div>
              </motion.div>

              {/* 源站回應時間存取次數統計表 */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.12, duration: 0.5 }}
                className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
              >
                <h3 className="text-white mb-4 font-normal text-center">源站回應時間存取次數統計表</h3>

                <div className="overflow-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-slate-700">
                      <tr>
                        <th className="text-left py-3 text-slate-400 font-normal">源站 IP位址</th>
                        <th className="text-right py-3 text-slate-400 font-normal">平均回應時間(ms)</th>
                        <th className="text-right py-3 text-slate-400 font-normal">存取次數</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sourceResponseTimeData.map((item, index) => (
                        <tr key={index} className="border-b border-slate-800">
                          <td className="py-3 text-slate-300 font-mono text-xs">{item.ip}</td>
                          <td className="py-3 text-right text-white font-medium">
                            {item.avgResponseTime.toLocaleString()}
                          </td>
                          <td className="py-3 text-right text-white font-medium">
                            {item.accessCount.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </div>

            {/* 右側欄位 - 十大來源IP位址存取比例圖 */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.14, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <h3 className="text-white mb-4 font-normal text-center">十大來源IP位址存取比例圖</h3>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ltmTopSourceIPsPieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent, cx, cy, midAngle, innerRadius, outerRadius }) => {
                        const RADIAN = Math.PI / 180
                        const radius = outerRadius + 15
                        const x = cx + radius * Math.cos(-midAngle * RADIAN)
                        const y = cy + radius * Math.sin(-midAngle * RADIAN)

                        return (
                          <text
                            x={x}
                            y={y}
                            fill="#e2e8f0"
                            textAnchor={x > cx ? "start" : "end"}
                            dominantBaseline="central"
                            fontSize="9px"
                            fontFamily="monospace"
                          >
                            {`1% ${name}`}
                          </text>
                        )
                      }}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      stroke="none"
                    >
                      {ltmTopSourceIPsPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "0px solid #1e3a8a",
                        borderRadius: "8px",
                        color: "#ffffff",
                      }}
                      labelStyle={{ color: "#ffffff" }}
                      itemStyle={{ color: "#ffffff" }}
                      formatter={(value: number) => `${value}%`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* 圖例 */}
              <div className="grid grid-cols-2 gap-1 mt-4 text-xs">
                {ltmTopSourceIPsPieData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-300 font-mono text-[10px]">{item.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <h3 className="text-white mb-4 font-normal text-center">來源國家存取統計表</h3>
              <div className="overflow-auto max-h-[400px]">
                <table className="w-full text-sm">
                  <thead className="border-b border-slate-700 sticky top-0 bg-slate-900/90">
                    <tr>
                      <th className="text-left py-3 text-slate-400 font-normal">來源國家</th>
                      <th className="text-right py-3 text-slate-400 font-normal">次數</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ltmSourceCountries.map((item, index) => (
                      <tr key={index} className="border-b border-slate-800">
                        <td className="py-3 text-slate-300 leading-3">{item.country}</td>
                        <td className="py-3 text-right text-white font-medium leading-3">
                          {item.count.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <h3 className="text-white mb-4 font-normal text-center">來源城市存取統計表</h3>
              <div className="overflow-auto max-h-[400px]">
                <table className="w-full text-sm">
                  <thead className="border-b border-slate-700 sticky top-0 bg-slate-900/90">
                    <tr>
                      <th className="text-left py-3 text-slate-400 font-normal">來源城市</th>
                      <th className="text-right py-3 text-slate-400 font-normal">次數</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ltmSourceCities.map((item, index) => (
                      <tr key={index} className="border-b border-slate-800">
                        <td className="py-3 text-slate-300 leading-3">{item.city}</td>
                        <td className="py-3 text-right text-white font-medium leading-3">
                          {item.count.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <h3 className="text-white mb-4 font-normal text-center">十大來源IP位址存取統計圖</h3>
              <div className="overflow-auto max-h-[500px]">
                <table className="w-full text-sm">
                  <thead className="border-b border-slate-700 sticky top-0 bg-slate-900/90">
                    <tr>
                      <th className="text-left py-3 text-slate-400 font-normal">來源 IP</th>
                      <th className="text-right py-3 text-slate-400 font-normal">次數</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ltmTopSourceIPs.map((item, index) => (
                      <tr key={index} className="border-b border-slate-800">
                        <td className="py-3 text-slate-300 font-mono text-xs leading-3">{item.ip}</td>
                        <td className="py-3 text-right text-white font-medium leading-3">
                          {item.count.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <h3 className="text-white mb-4 font-normal text-center">來源IP流量存取次數統計表</h3>
              <div className="overflow-auto max-h-[500px]">
                <table className="w-full text-sm">
                  <thead className="border-b border-slate-700 sticky top-0 bg-slate-900/90">
                    <tr>
                      <th className="text-left py-3 text-slate-400 font-normal">連線識別</th>
                      <th className="text-right py-3 text-slate-400 font-normal">存取記錄</th>
                      <th className="text-right py-3 text-slate-400 font-normal">流量(MB)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ltmSourceIPTraffic.map((item, index) => (
                      <tr key={index} className="border-b border-slate-800">
                        <td className="py-3 text-slate-300 font-mono text-xs leading-3">{item.ip}</td>
                        <td className="py-3 text-right text-white font-medium leading-3">
                          {ltmTopSourceIPs[index]?.count.toLocaleString()}
                        </td>
                        <td className="py-3 text-right text-white font-medium leading-3">{item.traffic} MB</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <h3 className="text-white mb-4 font-normal text-center">網域名稱存取統計表</h3>
              <div className="overflow-auto max-h-[500px]">
                <table className="w-full text-sm">
                  <thead className="border-b border-slate-700 sticky top-0 bg-slate-900/90">
                    <tr>
                      <th className="text-left py-3 text-slate-400 font-normal">網域名稱</th>
                      <th className="text-right py-3 text-slate-400 font-normal">次數</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ltmDomainNames.map((item, index) => (
                      <tr key={index} className="border-b border-slate-800">
                        <td className="py-3 text-slate-300 font-mono text-xs leading-3">{item.domain}</td>
                        <td className="py-3 text-right text-white font-medium leading-3">
                          {item.count.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md mb-6"
          >
            <h3 className="text-white mb-4 font-normal text-center">伺服器負載均衡曲線圖</h3>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={serverLoadBalanceData} barSize={12}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e3a8a" opacity={0.2} />
                  <XAxis
                    dataKey="time"
                    stroke="#60a5fa"
                    tick={{ fill: "#60a5fa", fontSize: 9 }}
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    interval="preserveStartEnd"
                    minTickGap={20}
                  />
                  <YAxis
                    stroke="#60a5fa"
                    tick={{ fill: "#60a5fa" }}
                    tickFormatter={(value) => value.toLocaleString()}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid #1e3a8a",
                      borderRadius: "8px",
                      color: "#ffffff",
                    }}
                    labelStyle={{ color: "#ffffff" }}
                    itemStyle={{ color: "#ffffff" }}
                    formatter={(value: number) => value.toLocaleString()}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: "20px" }}
                    iconType="square"
                    formatter={(value) => <span className="text-slate-400 text-xs">{value}</span>}
                  />
                  <Bar dataKey="dst_ip_10_168_168_99" stackId="a" fill="#14B8A6" name="dst_ip_10.168.168.99" />
                  <Bar dataKey="dst_ip_202_55_247_128" stackId="a" fill="#06B6D4" name="dst_ip_202.55.247.128" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md mb-6"
          >
            <h3 className="text-white mb-4 font-normal text-center">伺服器回應代碼曲線圖</h3>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={serverResponseCodeData} barSize={20}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e3a8a" opacity={0.2} />
                  <XAxis
                    dataKey="time"
                    stroke="#60a5fa"
                    tick={{ fill: "#60a5fa", fontSize: 10 }}
                    angle={-15}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    stroke="#60a5fa"
                    tick={{ fill: "#60a5fa" }}
                    tickFormatter={(value) => value.toLocaleString()}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid #1e3a8a",
                      borderRadius: "8px",
                      color: "#ffffff",
                    }}
                    labelStyle={{ color: "#ffffff" }}
                    itemStyle={{ color: "#ffffff" }}
                    formatter={(value: number) => value.toLocaleString()}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: "20px" }}
                    iconType="square"
                    formatter={(value) => <span className="text-slate-400 text-xs">{value}</span>}
                  />
                  <Bar dataKey="status_200" stackId="a" fill="#BEF264" name="status_200" />
                  <Bar dataKey="status_206" stackId="a" fill="#A3E635" name="status_206" />
                  <Bar dataKey="status_301" stackId="a" fill="#84CC16" name="status_301" />
                  <Bar dataKey="status_307" stackId="a" fill="#65A30D" name="status_307" />
                  <Bar dataKey="status_400" stackId="a" fill="#9CA3AF" name="status_400" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md mb-6"
          >
            <h3 className="text-white mb-4 font-normal text-center">網域存取時間軸</h3>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={domainAccessTimelineData} barSize={20}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e3a8a" opacity={0.2} />
                  <XAxis
                    dataKey="time"
                    stroke="#60a5fa"
                    tick={{ fill: "#60a5fa", fontSize: 10 }}
                    angle={-15}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    stroke="#60a5fa"
                    tick={{ fill: "#60a5fa" }}
                    tickFormatter={(value) => value.toLocaleString()}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid #1e3a8a",
                      borderRadius: "8px",
                      color: "#ffffff",
                    }}
                    labelStyle={{ color: "#ffffff" }}
                    itemStyle={{ color: "#ffffff" }}
                    formatter={(value: number) => value.toLocaleString()}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: "20px" }}
                    iconType="square"
                    formatter={(value) => <span className="text-slate-400 text-xs">{value}</span>}
                  />
                  <Bar dataKey="hostname_202_39_33_190" stackId="a" fill="#F59E0B" name="hostname_202.39.33.190" />
                  <Bar
                    dataKey="hostname_202_39_33_190_443"
                    stackId="a"
                    fill="#84CC16"
                    name="hostname_202.39.33.190:443"
                  />
                  <Bar dataKey="hostname_ns1" stackId="a" fill="#3B82F6" name="hostname_ns1.twister5.com.tw" />
                  <Bar dataKey="hostname_sslvpn" stackId="a" fill="#8B5CF6" name="hostname_sslvpn.twister5.com.tw" />
                  <Bar dataKey="hostname_www" stackId="a" fill="#C74A44" name="hostname_www.twister5.com.tw" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </>
      )
    }

    // Overview tab - F5 防護總覽
    return (
      <>
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mb-6 flex items-center gap-4 bg-slate-900/40 backdrop-blur-md border border-white/10 p-4 rounded-md"
        >
          <div className="flex items-center gap-2 text-slate-300">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">資料時間範圍：</span>
          </div>

          {/* 開始日期 */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">開始日期</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="bg-slate-800 border-slate-700 hover:bg-slate-700 text-white">
                  {dateFrom ? dateFrom.toLocaleDateString("zh-TW") : "選擇日期"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-slate-900 border-slate-700">
                <CustomDatePicker selected={dateFrom} onSelect={setDateFrom} />
              </PopoverContent>
            </Popover>
          </div>

          {/* 結束日期 */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">結束日期</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="bg-slate-800 border-slate-700 hover:bg-slate-700 text-white">
                  {dateTo ? dateTo.toLocaleDateString("zh-TW") : "選擇日期"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-slate-900 border-slate-700">
                <CustomDatePicker selected={dateTo} onSelect={setDateTo} />
              </PopoverContent>
            </Popover>
          </div>

          {/* 快速選擇按鈕 */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-slate-400">快速選擇：</span>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:text-white hover:bg-slate-800"
              onClick={() => {
                setDateFrom(new Date(Date.now() - 24 * 60 * 60 * 1000))
                setDateTo(new Date())
              }}
            >
              近24小時
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:text-white hover:bg-slate-800"
              onClick={() => {
                setDateFrom(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
                setDateTo(new Date())
              }}
            >
              近7天
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:text-white hover:bg-slate-800"
              onClick={() => {
                setDateFrom(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
                setDateTo(new Date())
              }}
            >
              近30天
            </Button>
          </div>
        </motion.div>

        {/* 頁面標題 */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6 text-center"
        >
          <h2 className="text-white text-3xl font-medium mb-2">F5 防護總覽</h2>
          <div className="text-slate-400 text-sm">即時監控與安全防護狀態</div>
        </motion.div>

        {/* 第一排：核心防護指標 */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
          >
            <div className="mb-2 text-xs font-normal text-slate-300">系統狀態</div>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-400" />
              <div className="text-green-400 font-medium text-xl">運行中</div>
            </div>
            <div className="text-slate-400 text-xs mt-2">正常運作</div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.12, duration: 0.5 }}
            className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
          >
            <div className="mb-2 text-xs text-slate-300">WAF 攻擊總數</div>
            <div className="text-white font-medium text-2xl">134,799</div>
            <div className="text-red-400 text-xs mt-2">已攔截</div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.14, duration: 0.5 }}
            className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
          >
            <div className="mb-2 text-xs text-slate-300">LTM 總請求數</div>
            <div className="text-white font-medium text-2xl">616,671</div>
            <div className="text-green-400 text-xs mt-2">正常處理</div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.16, duration: 0.5 }}
            className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
          >
            <div className="mb-2 text-xs text-slate-300">防護成功率</div>
            <div className="text-green-400 font-medium text-2xl">99.8%</div>
            <div className="text-slate-400 text-xs mt-2">攔截率</div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.18, duration: 0.5 }}
            className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
          >
            <div className="mb-2 text-xs text-slate-300">平均響應時間</div>
            <div className="text-white font-medium text-2xl">246ms</div>
            <div className="text-green-400 text-xs mt-2">良好</div>
          </motion.div>
        </div>

        {/* 第二排：攻擊類型分布與地理位置 */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* 攻擊類型分布圓餅圖 */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
          >
            <h3 className="text-white mb-4 font-normal text-center">攻擊類型分布</h3>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={attackDistributionData.slice(0, 6)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    stroke="none"
                  >
                    {attackDistributionData.slice(0, 6).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid #1e3a8a",
                      borderRadius: "8px",
                      color: "#ffffff",
                    }}
                    labelStyle={{ color: "#ffffff" }}
                    itemStyle={{ color: "#ffffff" }}
                    formatter={(value: number) => `${value}%`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* 圖例 */}
            <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
              {attackDistributionData.slice(0, 6).map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300 truncate text-[10px]" title={item.name}>
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 全球攻擊來源地圖 */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.22, duration: 0.5 }}
            className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
          >
            <h3 className="text-white mb-4 font-normal text-center">全球攻擊來源分布</h3>
            <div className="h-96">
              <AttackSourceMap />
            </div>
          </motion.div>
        </div>

        {/* 第三排：攻擊時間軸與流量趨勢 */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* WAF 攻擊時間軸 */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.24, duration: 0.5 }}
            className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
          >
            <h3 className="text-white mb-4 font-normal text-center">WAF 攻擊趨勢</h3>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={wafTimelineData}>
                  <defs>
                    <linearGradient id="colorAttacks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e3a8a" opacity={0.2} />
                  <XAxis
                    dataKey="time"
                    stroke="#60a5fa"
                    tick={{ fill: "#60a5fa", fontSize: 10 }}
                    angle={-15}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    stroke="#60a5fa"
                    tick={{ fill: "#60a5fa" }}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid #1e3a8a",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => value.toLocaleString()}
                  />
                  <Area
                    type="monotone"
                    dataKey="informationLeakage"
                    stroke="#ef4444"
                    fill="url(#colorAttacks)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* LTM 流量趨勢 */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.26, duration: 0.5 }}
            className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
          >
            <h3 className="text-white mb-4 font-normal text-center">LTM 流量趨勢</h3>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficData}>
                  <defs>
                    <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e3a8a" opacity={0.2} />
                  <XAxis dataKey="time" stroke="#60a5fa" tick={{ fill: "#60a5fa" }} />
                  <YAxis stroke="#60a5fa" tick={{ fill: "#60a5fa" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid #1e3a8a",
                      borderRadius: "8px",
                    }}
                  />
                  <Area type="monotone" dataKey="traffic" stroke="#3b82f6" fill="url(#colorTraffic)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* 第四排：關鍵統計數據 */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Pool 健康狀態 */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.28, duration: 0.5 }}
            className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
          >
            <h3 className="text-white mb-4 font-normal text-center">Pool 健康狀態</h3>

            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={poolHealthData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    stroke="none"
                  >
                    {poolHealthData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid #1e3a8a",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* 攻擊來源 Top 5 國家 */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
          >
            <h3 className="text-white mb-4 font-normal text-center">攻擊來源 Top 5</h3>

            <div className="space-y-3">
              {attackSourceCountries.slice(0, 5).map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 text-xs font-medium">
                      {index + 1}
                    </div>
                    <span className="text-slate-300 text-sm">{item.country}</span>
                  </div>
                  <span className="text-white font-medium">{item.attacks.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 伺服器響應狀態 */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.32, duration: 0.5 }}
            className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
          >
            <h3 className="text-white mb-4 font-normal text-center">伺服器響應狀態</h3>

            <div className="space-y-4">
              {sourceResponseTimeData.map((item, index) => (
                <div key={index} className="p-3 bg-slate-800/50 rounded-lg">
                  <div className="text-slate-400 text-xs mb-1 font-mono">{item.ip}</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-white font-medium text-lg">{item.avgResponseTime}ms</span>
                    <span className="text-slate-400 text-xs">{item.accessCount.toLocaleString()} 次存取</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* 第五排：系統資訊 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.34, duration: 0.5 }}
          className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
        >
          <h3 className="text-white mb-4 font-normal text-center">系統資訊</h3>

          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 bg-slate-800/50 rounded-lg text-center">
              <div className="text-slate-400 text-sm mb-2">F5 版本</div>
              <div className="text-white font-medium">BIG-IP 17.1.0</div>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg text-center">
              <div className="text-slate-400 text-sm mb-2">Virtual Servers</div>
              <div className="text-white font-medium">24 個</div>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg text-center">
              <div className="text-slate-400 text-sm mb-2">Pools</div>
              <div className="text-white font-medium">18 個</div>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg text-center">
              <div className="text-slate-400 text-sm mb-2">授權狀態</div>
              <div className="text-green-400 font-medium">已啟用</div>
            </div>
          </div>
        </motion.div>
      </>
    )
  }

  return (
    <div className="min-h-screen bg-[#08131D] p-8">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="mb-6 flex items-center gap-4 bg-slate-900/40 backdrop-blur-md border border-white/10 p-4 rounded-md"
      >
        <div className="flex items-center gap-2 text-slate-300">
          <Calendar className="w-4 h-4" />
          <span className="text-sm font-medium">資料時間範圍：</span>
        </div>

        {/* 開始日期 */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">開始日期</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="bg-slate-800 border-slate-700 hover:bg-slate-700 text-white">
                {dateFrom ? dateFrom.toLocaleDateString("zh-TW") : "選擇日期"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-slate-900 border-slate-700">
              <CustomDatePicker selected={dateFrom} onSelect={setDateFrom} />
            </PopoverContent>
          </Popover>
        </div>

        {/* 結束日期 */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">結束日期</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="bg-slate-800 border-slate-700 hover:bg-slate-700 text-white">
                {dateTo ? dateTo.toLocaleDateString("zh-TW") : "選擇日期"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-slate-900 border-slate-700">
              <CustomDatePicker selected={dateTo} onSelect={setDateTo} />
            </PopoverContent>
          </Popover>
        </div>

        {/* 快速選擇按鈕 */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm text-slate-400">快速選擇：</span>
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-300 hover:text-white hover:bg-slate-800"
            onClick={() => {
              setDateFrom(new Date(Date.now() - 24 * 60 * 60 * 1000))
              setDateTo(new Date())
            }}
          >
            近24小時
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-300 hover:text-white hover:bg-slate-800"
            onClick={() => {
              setDateFrom(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
              setDateTo(new Date())
            }}
          >
            近7天
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-300 hover:text-white hover:bg-slate-800"
            onClick={() => {
              setDateFrom(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
              setDateTo(new Date())
            }}
          >
            近30天
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex gap-2 mb-6 rounded-md"
      >
        {/* Top Navigation Tabs */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex gap-2 mb-6 rounded-md flex-row"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2.5 text-sm font-medium transition-all duration-200 rounded-md ${
                activeTab === tab.id
                  ? "bg-white text-black"
                  : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>
      </motion.div>

      {renderContent()}
    </div>
  )
}
