"use client"

import { motion } from "framer-motion"
import { AlertCircleIcon, ArrowDownUpIcon, CheckCircle2, ShieldIcon } from "lucide-react"
import { useState } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { Calendar } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CustomDatePicker } from "@/components/custom-date-picker"

export default function CheckPointDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [dateFrom, setDateFrom] = useState<Date | undefined>(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
  const [dateTo, setDateTo] = useState<Date | undefined>(new Date())

  const tabs = [
    { id: "overview", label: "總覽" },
    { id: "utm", label: "UTM" },
  ]

  // 威脅防護總覽數據
  const threatSummaryData = {
    totalThreats: 15842,
    blockedThreats: 15320,
    allowedThreats: 522,
    blockRate: 96.7,
  }

  // 威脅趨勢數據
  const threatTrendData = [
    { hour: "00", threats: 520, blocked: 502, allowed: 18 },
    { hour: "01", threats: 480, blocked: 465, allowed: 15 },
    { hour: "02", threats: 450, blocked: 438, allowed: 12 },
    { hour: "03", threats: 520, blocked: 505, allowed: 15 },
    { hour: "04", threats: 680, blocked: 659, allowed: 21 },
    { hour: "05", threats: 890, blocked: 862, allowed: 28 },
    { hour: "06", threats: 1120, blocked: 1084, allowed: 36 },
    { hour: "07", threats: 1450, blocked: 1403, allowed: 47 },
    { hour: "08", threats: 1680, blocked: 1625, allowed: 55 },
    { hour: "09", threats: 1520, blocked: 1470, allowed: 50 },
    { hour: "10", threats: 1350, blocked: 1305, allowed: 45 },
    { hour: "11", threats: 1180, blocked: 1141, allowed: 39 },
    { hour: "12", threats: 980, blocked: 948, allowed: 32 },
    { hour: "13", threats: 850, blocked: 823, allowed: 27 },
    { hour: "14", threats: 720, blocked: 697, allowed: 23 },
    { hour: "15", threats: 620, blocked: 600, allowed: 20 },
    { hour: "16", threats: 550, blocked: 533, allowed: 17 },
    { hour: "17", threats: 520, blocked: 504, allowed: 16 },
  ]

  // IPS 入侵防護數據
  const ipsData = {
    totalAttacks: 8452,
    prevented: 8120,
    detected: 332,
    preventionRate: 96.1,
  }

  const ipsTypeData = [
    { name: "SQL Injection", value: 2850, color: "#ef4444" },
    { name: "XSS Attack", value: 2120, color: "#f97316" },
    { name: "Buffer Overflow", value: 1680, color: "#eab308" },
    { name: "Remote Code Execution", value: 1420, color: "#3b82f6" },
    { name: "其他", value: 382, color: "#6b7280" },
  ]

  const ipsTrendData = [
    { hour: "00", attacks: 280, prevented: 270 },
    { hour: "03", attacks: 320, prevented: 308 },
    { hour: "06", attacks: 450, prevented: 433 },
    { hour: "09", attacks: 680, prevented: 654 },
    { hour: "12", attacks: 520, prevented: 500 },
    { hour: "15", attacks: 380, prevented: 365 },
    { hour: "18", attacks: 420, prevented: 404 },
    { hour: "21", attacks: 350, prevented: 337 },
  ]

  // Anti-Virus / Anti-Bot 數據
  const avAbData = {
    virusDetected: 3250,
    virusBlocked: 3180,
    botDetected: 4520,
    botBlocked: 4385,
  }

  const virusTypeData = [
    { name: "Trojan", value: 38, color: "#ef4444" },
    { name: "Ransomware", value: 25, color: "#dc2626" },
    { name: "Worm", value: 18, color: "#f97316" },
    { name: "Spyware", value: 12, color: "#eab308" },
    { name: "其他", value: 7, color: "#6b7280" },
  ]

  const botTypeData = [
    { name: "惡意爬蟲", value: 42, color: "#ef4444" },
    { name: "DDoS Bot", value: 28, color: "#f97316" },
    { name: "垃圾郵件 Bot", value: 18, color: "#eab308" },
    { name: "其他", value: 12, color: "#6b7280" },
  ]

  // Firewall 連線與流量統計
  const firewallData = {
    totalConnections: 2458920,
    allowedConnections: 2441850,
    deniedConnections: 17070,
    totalTraffic: 1250.5, // GB
  }

  const connectionTrendData = [
    { hour: "00", allowed: 85200, denied: 520 },
    { hour: "03", allowed: 72800, denied: 480 },
    { hour: "06", allowed: 95400, denied: 650 },
    { hour: "09", allowed: 142500, denied: 1120 },
    { hour: "12", allowed: 168200, denied: 1450 },
    { hour: "15", allowed: 155800, denied: 1280 },
    { hour: "18", allowed: 138600, denied: 980 },
    { hour: "21", allowed: 102500, denied: 720 },
  ]

  const trafficData = [
    { hour: "00", inbound: 42.5, outbound: 38.2 },
    { hour: "03", inbound: 38.8, outbound: 35.5 },
    { hour: "06", inbound: 52.3, outbound: 48.6 },
    { hour: "09", inbound: 78.5, outbound: 72.3 },
    { hour: "12", inbound: 95.2, outbound: 88.5 },
    { hour: "15", inbound: 85.6, outbound: 79.8 },
    { hour: "18", inbound: 72.4, outbound: 67.2 },
    { hour: "21", inbound: 58.3, outbound: 54.1 },
  ]

  // Top 攻擊來源 / 目的地 / 規則
  const topAttackSources = [
    { ip: "192.168.50.125", country: "俄羅斯", attacks: 2850, severity: "high" },
    { ip: "10.20.30.45", country: "中國", attacks: 2120, severity: "high" },
    { ip: "172.16.88.92", country: "巴西", attacks: 1680, severity: "medium" },
    { ip: "203.45.67.89", country: "越南", attacks: 1420, severity: "medium" },
    { ip: "158.32.45.101", country: "印度", attacks: 980, severity: "low" },
  ]

  const topAttackDestinations = [
    { ip: "192.168.1.100", service: "Web Server", attacks: 3520, port: "80/443" },
    { ip: "192.168.1.50", service: "Database Server", attacks: 2880, port: "3306" },
    { ip: "192.168.1.25", service: "Mail Server", attacks: 1950, port: "25/587" },
    { ip: "192.168.1.75", service: "FTP Server", attacks: 1420, port: "21" },
    { ip: "192.168.1.150", service: "DNS Server", attacks: 850, port: "53" },
  ]

  const topFirewallRules = [
    { ruleName: "Block-Malicious-IPs", hits: 5280, action: "Drop", color: "#ef4444" },
    { ruleName: "Web-Server-Protection", hits: 3850, action: "Accept", color: "#10b981" },
    { ruleName: "Database-Access-Control", hits: 2920, action: "Accept", color: "#10b981" },
    { ruleName: "Outbound-Restriction", hits: 1680, action: "Drop", color: "#ef4444" },
    { ruleName: "VPN-Access-Allow", hits: 1250, action: "Accept", color: "#10b981" },
  ]

  // 威脅防護總覽雷達圖數據
  const threatRadarData = [
    { category: "IPS", value: 96.1 },
    { category: "Anti-Virus", value: 97.8 },
    { category: "Anti-Bot", value: 97.0 },
    { category: "URL Filtering", value: 93.2 },
    { category: "App Control", value: 95.5 },
  ]

  const renderOverviewTab = () => {
    return (
      <>
        {/* 威脅防護總覽統計卡片 */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
          >
            <div className="flex items-center gap-3 mb-3">
              <AlertCircleIcon className="text-pink-400 w-[20] h-[20]" />
              <div className="mb-2 text-xs font-normal text-slate-300">總威脅數</div>
            </div>
            <div className="text-white font-medium text-2xl">{threatSummaryData.totalThreats.toLocaleString()}</div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
          >
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle2 className="text-green-400 w-[20] h-[20]" />
              <div className="mb-2 text-xs text-slate-300">已阻擋</div>
            </div>
            <div className="text-green-400 font-medium text-2xl">
              {threatSummaryData.blockedThreats.toLocaleString()}
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
          >
            <div className="flex items-center gap-3 mb-3">
              <ArrowDownUpIcon className="text-orange-400 w-[20] h-[20]" />
              <div className="mb-2 text-xs text-slate-300">已允許</div>
            </div>
            <div className="text-orange-400 font-medium text-2xl">
              {threatSummaryData.allowedThreats.toLocaleString()}
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
          >
            <div className="flex items-center gap-3 mb-3">
              <ShieldIcon className="text-blue-400 w-[20] h-[20]" />
              <div className="mb-2 text-xs text-slate-300">防護率</div>
            </div>
            <div className="text-blue-400 font-medium text-2xl">{threatSummaryData.blockRate}%</div>
          </motion.div>
        </div>

        {/* 威脅趨勢圖表 & 防護效能雷達圖 */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* 威脅趨勢 */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
          >
            <h3 className="text-white mb-4 font-normal">威脅趨勢 (近24小時)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={threatTrendData}>
                  <defs>
                    <linearGradient id="colorBlocked" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorAllowed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis dataKey="hour" stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                  <YAxis stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                      color: "#ffffff",
                    }}
                    labelStyle={{ color: "#ffffff" }}
                    itemStyle={{ color: "#ffffff" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="blocked"
                    stackId="1"
                    stroke="#10b981"
                    fill="url(#colorBlocked)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="allowed"
                    stackId="1"
                    stroke="#f97316"
                    fill="url(#colorAllowed)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500" />
                <span className="text-sm text-slate-300">已阻擋</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500" />
                <span className="text-sm text-slate-300">已允許</span>
              </div>
            </div>
          </motion.div>

          {/* 防護效能雷達圖 */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
          >
            <h3 className="text-white mb-4 font-normal">UTM 防護效能總覽</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={threatRadarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="category" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 10 }} />
                  <Radar
                    name="防護率"
                    dataKey="value"
                    stroke="#e91e63"
                    fill="#e91e63"
                    fillOpacity={0.6}
                    strokeWidth={2}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                      color: "#ffffff",
                    }}
                    formatter={(value: number) => [`${value}%`, "防護率"]}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </>
    )
  }

  const renderUTMTab = () => {
    return (
      <>
        {/* IPS 入侵防護報表 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md mb-6"
        >
          <h2 className="text-white text-xl mb-6 font-medium flex items-center gap-3">IPS 入侵防護報表</h2>

          {/* IPS 統計卡片 */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-800/40 p-4 rounded-md">
              <div className="text-xs text-slate-400 mb-2">總攻擊次數</div>
              <div className="text-2xl text-white font-semibold">{ipsData.totalAttacks.toLocaleString()}</div>
            </div>
            <div className="bg-slate-800/40 p-4 rounded-md">
              <div className="text-xs text-slate-400 mb-2">已防護</div>
              <div className="text-2xl text-green-400 font-semibold">{ipsData.prevented.toLocaleString()}</div>
            </div>
            <div className="bg-slate-800/40 p-4 rounded-md">
              <div className="text-xs text-slate-400 mb-2">僅偵測</div>
              <div className="text-2xl text-orange-400 font-semibold">{ipsData.detected.toLocaleString()}</div>
            </div>
            <div className="bg-slate-800/40 p-4 rounded-md">
              <div className="text-xs text-slate-400 mb-2">防護率</div>
              <div className="text-2xl text-blue-400 font-semibold">{ipsData.preventionRate}%</div>
            </div>
          </div>

          {/* IPS 圖表 */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-white mb-4 text-sm">攻擊類型分布</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ipsTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {ipsTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                        color: "#ffffff",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-4">
                {ipsTypeData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-300">{item.name}</span>
                    </div>
                    <span className="font-semibold text-slate-300">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white mb-4 text-sm">IPS 攻擊趨勢 (近24小時)</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={ipsTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                    <XAxis dataKey="hour" stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                    <YAxis stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                        color: "#ffffff",
                      }}
                    />
                    <Line type="monotone" dataKey="attacks" stroke="#ef4444" strokeWidth={2} name="攻擊數" />
                    <Line type="monotone" dataKey="prevented" stroke="#10b981" strokeWidth={2} name="已防護" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Anti-Virus / Anti-Bot 報表 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md mb-6"
        >
          <h2 className="text-white text-xl mb-6 font-medium flex items-center gap-3">Anti-Virus / Anti-Bot 報表</h2>

          {/* AV/AB 統計卡片 */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-800/40 p-4 rounded-md">
              <div className="text-xs text-slate-400 mb-2">病毒偵測</div>
              <div className="text-2xl text-white font-semibold">{avAbData.virusDetected.toLocaleString()}</div>
            </div>
            <div className="bg-slate-800/40 p-4 rounded-md">
              <div className="text-xs text-slate-400 mb-2">病毒阻擋</div>
              <div className="text-2xl text-green-400 font-semibold">{avAbData.virusBlocked.toLocaleString()}</div>
            </div>
            <div className="bg-slate-800/40 p-4 rounded-md">
              <div className="text-xs text-slate-400 mb-2">Bot 偵測</div>
              <div className="text-2xl text-white font-semibold">{avAbData.botDetected.toLocaleString()}</div>
            </div>
            <div className="bg-slate-800/40 p-4 rounded-md">
              <div className="text-xs text-slate-400 mb-2">Bot 阻擋</div>
              <div className="text-2xl text-green-400 font-semibold">{avAbData.botBlocked.toLocaleString()}</div>
            </div>
          </div>

          {/* AV/AB 圖表 */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-white mb-4 text-sm">病毒類型分布</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={virusTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {virusTypeData.map((entry, index) => (
                        <Cell key={`virus-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                        color: "#ffffff",
                      }}
                      formatter={(value: number) => `${value}%`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-4">
                {virusTypeData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-300">{item.name}</span>
                    </div>
                    <span className="font-semibold text-slate-300">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white mb-4 text-sm">Bot 類型分布</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={botTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {botTypeData.map((entry, index) => (
                        <Cell key={`bot-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                        color: "#ffffff",
                      }}
                      formatter={(value: number) => `${value}%`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-4">
                {botTypeData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-300">{item.name}</span>
                    </div>
                    <span className="font-semibold text-slate-300">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Firewall 連線與流量統計 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md mb-6"
        >
          <h2 className="text-white text-xl mb-6 font-medium flex items-center gap-3">Firewall 連線與流量統計</h2>

          {/* Firewall 統計卡片 */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-800/40 p-4 rounded-md">
              <div className="text-xs text-slate-400 mb-2">總連線數</div>
              <div className="text-2xl text-white font-semibold">{firewallData.totalConnections.toLocaleString()}</div>
            </div>
            <div className="bg-slate-800/40 p-4 rounded-md">
              <div className="text-xs text-slate-400 mb-2">已允許</div>
              <div className="text-2xl text-green-400 font-semibold">
                {firewallData.allowedConnections.toLocaleString()}
              </div>
            </div>
            <div className="bg-slate-800/40 p-4 rounded-md">
              <div className="text-xs text-slate-400 mb-2">已拒絕</div>
              <div className="text-2xl text-red-400 font-semibold">
                {firewallData.deniedConnections.toLocaleString()}
              </div>
            </div>
            <div className="bg-slate-800/40 p-4 rounded-md">
              <div className="text-xs text-slate-400 mb-2">總流量</div>
              <div className="text-2xl text-blue-400 font-semibold">{firewallData.totalTraffic} GB</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-white mb-4 text-sm">連線趨勢 (近24小時)</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={connectionTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                    <XAxis dataKey="hour" stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                    <YAxis stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                        color: "#ffffff",
                      }}
                    />
                    <Bar dataKey="allowed" fill="#10b981" name="已允許" />
                    <Bar dataKey="denied" fill="#ef4444" name="已拒絕" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h4 className="text-white mb-4 text-sm">流量趨勢 (近24小時)</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trafficData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                    <XAxis dataKey="hour" stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                    <YAxis stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                        color: "#ffffff",
                      }}
                      formatter={(value: number) => `${value} GB`}
                    />
                    <Line type="monotone" dataKey="inbound" stroke="#3b82f6" strokeWidth={2} name="Inbound" />
                    <Line type="monotone" dataKey="outbound" stroke="#10b981" strokeWidth={2} name="Outbound" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Top 攻擊來源 / 目的地 / 規則 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
        >
          <h2 className="text-white text-xl mb-6 font-medium flex items-center gap-3">Top 攻擊來源 / 目的地 / 規則</h2>

          <div className="grid grid-cols-3 gap-6">
            {/* Top 攻擊來源 */}
            <div>
              <h4 className="text-white mb-4 text-sm">TOP 5 攻擊來源 IP</h4>
              <div className="space-y-3">
                {topAttackSources.map((source, index) => (
                  <div key={index} className="bg-slate-800/40 p-3 rounded-md">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono text-slate-300">{source.ip}</span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          source.severity === "high"
                            ? "bg-red-500/20 text-red-400"
                            : source.severity === "medium"
                              ? "bg-orange-500/20 text-orange-400"
                              : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {source.severity.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">{source.country}</span>
                      <span className="text-xs text-white font-semibold">{source.attacks.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top 攻擊目的地 */}
            <div>
              <h4 className="text-white mb-4 text-sm">TOP 5 攻擊目的地</h4>
              <div className="space-y-3">
                {topAttackDestinations.map((dest, index) => (
                  <div key={index} className="bg-slate-800/40 p-3 rounded-md">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono text-slate-300">{dest.ip}</span>
                      <span className="text-xs text-slate-400">{dest.port}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">{dest.service}</span>
                      <span className="text-xs text-white font-semibold">{dest.attacks.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Firewall 規則 */}
            <div>
              <h4 className="text-white mb-4 text-sm">TOP 5 Firewall 規則</h4>
              <div className="space-y-3">
                {topFirewallRules.map((rule, index) => (
                  <div key={index} className="bg-slate-800/40 p-3 rounded-md">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-300">{rule.ruleName}</span>
                      <span
                        className="text-xs px-2 py-1 rounded"
                        style={{
                          backgroundColor: `${rule.color}20`,
                          color: rule.color,
                        }}
                      >
                        {rule.action}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">觸發次數</span>
                      <span className="text-xs text-white font-semibold">{rule.hits.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-8">
      <div className="max-w-[1800px] mx-auto">
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

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2.5 font-medium transition-all duration-200 rounded-md text-sm ${
                activeTab === tab.id
                  ? "bg-white text-slate-900"
                  : "bg-black/20 backdrop-blur-sm text-slate-300 hover:bg-black/30 hover:text-white border border-white/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === "overview" && renderOverviewTab()}
        {activeTab === "utm" && renderUTMTab()}
      </div>
    </div>
  )
}
