"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import {
  Search,
  Download,
  Settings,
  BarChart3,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Activity,
  Wifi,
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
} from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CustomDatePicker } from "@/components/custom-date-picker"

export default function CatoDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [dateFrom, setDateFrom] = useState<Date | undefined>(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
  const [dateTo, setDateTo] = useState<Date | undefined>(new Date())

  // 站點概況數據
  const siteStats = {
    total: 2,
    connected: 2,
    connecting: 0,
    disconnected: 0,
  }

  // 連接類型數據
  const connectionTypes = [{ name: "vSocket ESX", count: 2, percentage: 100.0 }]

  // 平均流量趨勢數據
  const trafficData = [
    { time: "12:00", traffic: 100 },
    { time: "18:00", traffic: 120 },
    { time: "28 Oct", traffic: 300 },
    { time: "06:00", traffic: 1400 },
    { time: "12:00", traffic: 150 },
    { time: "18:00", traffic: 180 },
    { time: "29 Oct", traffic: 650 },
    { time: "06:00", traffic: 100 },
  ]

  // 各站點流量摘要數據
  const siteSummary = [
    {
      name: "office",
      uploadBytes: "172 MB",
      downloadBytes: "11.9 MB",
      uploadLoss: "2.13%",
      downloadLoss: "0%",
      packetLoss: "0%",
    },
    {
      name: "IDC",
      uploadBytes: "181 MB",
      downloadBytes: "175 MB",
      uploadLoss: "0%",
      downloadLoss: "0%",
      packetLoss: "0%",
    },
  ]

  // 站點詳細連線數據
  const siteDetails = [
    {
      name: "office",
      status: "Connected",
      bandwidth: "4.37 Kbps",
      latency: "3 ms",
      packetLoss: "2.04%",
      jitter: "0.01%",
      pop: "Taipei",
      data: [
        { time: "12:00", wan: 2 },
        { time: "18:00", wan: 3 },
        { time: "28 Oct", wan: 4 },
        { time: "06:00", wan: 5 },
        { time: "12:00", wan: 6 },
        { time: "18:00", wan: 6.4 },
        { time: "29 Oct", wan: 5 },
        { time: "06:00", wan: 4 },
      ],
    },
    {
      name: "IDC",
      status: "Connected",
      bandwidth: "8.55 Kbps",
      latency: "5 ms",
      packetLoss: "0.24%",
      jitter: "0.01%",
      pop: "Taipei",
      data: [
        { time: "12:00", wan: 80 },
        { time: "18:00", wan: 100 },
        { time: "28 Oct", wan: 120 },
        { time: "06:00", wan: 240 },
        { time: "12:00", wan: 100 },
        { time: "18:00", wan: 90 },
        { time: "29 Oct", wan: 85 },
        { time: "06:00", wan: 80 },
      ],
    },
  ]

  // 路由表數據
  const routes = [
    {
      name: "IDC",
      subnet: "Taiwan | VSOCKET_VDX_ESX",
      caller: "10.168.61.0/24",
      nextHop: "直接連接",
      source: "STATIC",
      pop: "Taipei",
      type: "2 days",
    },
    {
      name: "IDC",
      subnet: "Taiwan | VSOCKET_VDX_ESX",
      caller: "10.168.61.254",
      nextHop: "直接連接",
      source: "STATIC",
      pop: "Taipei",
      type: "2 days",
    },
    {
      name: "office",
      subnet: "Taiwan | VSOCKET_VDX_ESX",
      caller: "10.100.61.0/24",
      nextHop: "直接連接",
      source: "STATIC",
      pop: "Taipei",
      type: "2 days",
    },
    {
      name: "office",
      subnet: "Taiwan | VSOCKET_VDX_ESX",
      caller: "10.100.61.254",
      nextHop: "直接連接",
      source: "STATIC",
      pop: "Taipei",
      type: "2 days",
    },
  ]

  const tabs = [
    { id: "overview", label: "總覽" },
    { id: "sase", label: "SASE" },
  ]

  const renderContent = () => {
    if (activeTab === "overview") {
      return (
        <>
          <div className="grid grid-cols-4 gap-6 mb-6">
            {/* 站點狀態 */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-slate-400 text-sm">站點狀態</h3>
                <Wifi className="w-5 h-5 text-green-400" />
              </div>
              <p className="font-semibold text-white mb-1 text-2xl">
                {siteStats.connected}/{siteStats.total}
              </p>
              <p className="text-xs text-green-400">全部在線</p>
            </motion.div>

            {/* 總流量 */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-slate-400 text-sm">總流量</h3>
                <Activity className="w-5 h-5 text-blue-400" />
              </div>
              <p className="font-semibold text-white mb-1 text-2xl">357 MB</p>
              <p className="text-xs text-slate-400">近 24 小時</p>
            </motion.div>

            {/* 平均延遲 */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-slate-400 text-sm">平均延遲</h3>
                <Clock className="w-5 h-5 text-cyan-400" />
              </div>
              <p className="font-semibold text-white mb-1 text-2xl">4 ms</p>
              <p className="text-xs text-green-400">極低延遲</p>
            </motion.div>

            {/* 平均資料遺失率 */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-slate-400 text-sm">平均資料遺失率</h3>
                <TrendingUp className="w-5 h-5 text-yellow-400" />
              </div>
              <p className="font-semibold text-white mb-1 text-2xl">1.14%</p>
              <p className="text-xs text-yellow-400">輕微遺失</p>
            </motion.div>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-normal">整體流量趨勢（近 24 小時）</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">匯總所有站點</span>
              </div>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficData}>
                  <defs>
                    <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis dataKey="time" stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                  <YAxis stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                      color: "#f1f5f9",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="traffic"
                    stroke="#3b82f6"
                    fill="url(#colorTraffic)"
                    strokeWidth={2}
                    name="總流量 (Kbps)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-md">
              <p className="text-sm text-yellow-400">
                <AlertTriangle className="w-4 h-4 inline mr-2" />
                流量高峰出現在 28 日早上 6 點左右（1640 Kbps），建議檢查當時的備份或同步活動。
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <h3 className="text-white font-normal mb-4">站點健康狀態</h3>
              <div className="space-y-4">
                {siteDetails.map((site, index) => (
                  <div
                    key={index}
                    className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-slate-600 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <h4 className="text-white font-medium">{site.name}</h4>
                      </div>
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 border border-green-500/30 text-xs rounded">
                        {site.status === "Connected" ? "健康" : "異常"}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-slate-400 text-xs mb-1">延遲</p>
                        <p className="text-white">{site.latency}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs mb-1">資料遺失率</p>
                        <p className="text-white">{site.packetLoss}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs mb-1">頻寬</p>
                        <p className="text-white">{site.bandwidth}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs mb-1">PoP</p>
                        <p className="text-white">{site.pop}</p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-700">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">運行時間</span>
                        <span className="text-xs text-green-400">100%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
            >
              <h3 className="text-white font-normal mb-4">告警和建議</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-lg border bg-yellow-500/10 border-yellow-500/30">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-yellow-400 mb-1">流量高峰檢測</h4>
                      <p className="text-sm text-slate-300 mb-2">
                        28 日早上 6 點左右出現流量高峰，建議檢查當時的備份或同步活動。
                      </p>
                      <p className="text-xs text-slate-500">2 小時前</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border bg-blue-500/10 border-blue-500/30">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-blue-400 mb-1">輕微上傳遺失</h4>
                      <p className="text-sm text-slate-300 mb-2">
                        office 站點有輕微上傳遺失（2.04%），但整體流量穩定，建議持續監控。
                      </p>
                      <p className="text-xs text-slate-500">5 小時前</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-green-400 mb-1">系統狀態良好</h4>
                      <p className="text-sm text-slate-300">
                        所有站點都在線且健康狀態正常，主幹節點為台北 PoP，延遲極低。整體流量穩定。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )
    }

    return (
      <>
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* 站點概況 */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
          >
            <h3 className="text-white mb-4 font-normal">站點連接狀態</h3>
            <p className="text-sm text-slate-400 mb-4">站點連接狀態</p>

            <div className="mb-4">
              <div className="grid grid-cols-3 gap-4">
                {/* 已連接 */}
                <div className="text-center">
                  <p className="text-xs text-slate-400 mb-1">已連接</p>
                  <p className="text-2xl font-medium text-white mb-2">{siteStats.connected}</p>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>

                {/* 連接中 */}
                <div className="text-center">
                  <p className="text-xs text-slate-400 mb-1">連接中</p>
                  <p className="text-2xl font-medium text-slate-500 mb-2">{siteStats.connecting}</p>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div
                      className="bg-slate-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: "0%" }}
                    />
                  </div>
                </div>

                {/* 已離開 */}
                <div className="text-center">
                  <p className="text-xs text-slate-400 mb-1">已離開</p>
                  <p className="text-2xl font-medium text-slate-500 mb-2">{siteStats.disconnected}</p>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div
                      className="bg-slate-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: "0%" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 連接類型 */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
          >
            <h3 className="text-white mb-4 font-normal">連接類型</h3>

            <div className="flex items-center gap-6">
              <div className="flex items-center justify-center w-24 h-24 rounded-full border-4 border-blue-500">
                <span className="text-3xl font-semibold text-white">{siteStats.total}</span>
              </div>
              <div className="flex-1">
                {connectionTypes.map((type, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-sm text-slate-300">{type.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-400">{type.count}</span>
                      <span className="text-sm text-slate-400">{type.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-normal">平均流量趨勢圖</h3>
            <div className="flex items-center gap-4">
              <select className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-md text-sm text-slate-300">
                <option>All Sources</option>
                <option>Office</option>
                <option>IDC</option>
              </select>
              <select className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-md text-sm text-slate-300">
                <option>Total Throughput</option>
                <option>Upload</option>
                <option>Download</option>
              </select>
              <span className="text-sm text-slate-400">分組方式：</span>
              <select className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-md text-sm text-slate-300">
                <option>Source</option>
                <option>Destination</option>
              </select>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="time" stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <YAxis stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    color: "#f1f5f9",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="traffic"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="站點"
                  dot={{ fill: "#3b82f6", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-normal">各站點流量摘要表</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  placeholder="搜尋"
                  className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-sm text-slate-300 focus:outline-none focus:border-slate-600"
                />
              </div>
              <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-sm rounded-md transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                導出
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">站點名稱</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">上傳總字節數</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">下載總字節數</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">上傳資料遺失率</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">下載資料遺失率</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">上傳數據遺失率</th>
                </tr>
              </thead>
              <tbody>
                {siteSummary.map((site, index) => (
                  <tr key={index} className="border-b border-slate-800 hover:bg-slate-800/30">
                    <td className="py-3 px-4 text-sm text-slate-300">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        {site.name}
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-300">{site.uploadBytes}</td>
                    <td className="py-3 px-4 text-sm text-slate-300">{site.downloadBytes}</td>
                    <td className="py-3 px-4 text-sm text-slate-300">{site.uploadLoss}</td>
                    <td className="py-3 px-4 text-sm text-slate-300">{site.downloadLoss}</td>
                    <td className="py-3 px-4 text-sm text-slate-300">{site.packetLoss}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-end gap-2 mt-4">
            <span className="text-sm text-slate-400">每頁行數：</span>
            <select className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-md text-sm text-slate-300">
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </select>
            <span className="text-sm text-slate-400">1-2 共 2</span>
            <button className="p-2 text-slate-500 cursor-not-allowed" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-2 text-slate-500 cursor-not-allowed" disabled>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md mb-6"
        >
          <h3 className="text-white mb-4 font-normal">各站點詳細連線狀況</h3>

          <div className="space-y-6">
            {siteDetails.map((site, index) => (
              <div key={index} className="border border-slate-800 rounded-lg p-4">
                <div className="grid grid-cols-12 gap-4">
                  {/* 左側資訊 */}
                  <div className="col-span-3 space-y-3 border-r border-slate-700 pr-4">
                    <div className="flex items-center gap-2 pb-3 border-b border-slate-700">
                      <h4 className="text-lg font-semibold text-white">{site.name}</h4>
                      <span className="text-xs text-slate-400">狀態：</span>
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 border border-green-500/30 text-xs rounded">
                        {site.status}
                      </span>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between pb-3 border-b border-slate-700">
                        <span className="text-slate-400 text-xs">平均傳輸速率</span>
                        <span className="text-white text-xs">{site.bandwidth}</span>
                      </div>
                      <div className="flex justify-between pb-3 border-b border-slate-700">
                        <span className="text-slate-400 text-xs">平均延遲</span>
                        <span className="text-white text-xs">{site.latency}</span>
                      </div>
                      <div className="flex justify-between pb-3 border-b border-slate-700">
                        <span className="text-slate-400 text-xs">平均資料遺失率</span>
                        <span className="text-white flex items-center gap-2 text-xs">
                          <span className="flex items-center gap-1">
                            <span className="text-slate-300">▲</span>
                            {site.packetLoss}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="text-slate-300">▼</span>
                            {site.jitter}
                          </span>
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 text-xs">PoP</span>
                        <span className="text-white text-xs">{site.pop}</span>
                      </div>
                    </div>
                  </div>

                  {/* 右側圖表 */}
                  <div className="col-span-9 pl-4">
                    <div className="flex items-center justify-end gap-2 mb-2">
                      <select className="px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-md">
                        <option>總傳輸量</option>
                        <option>摘要</option>
                      </select>
                      <button className="p-2 text-slate-400 hover:text-white transition-colors">
                        <BarChart3 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-white transition-colors">
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={site.data}>
                          <defs>
                            <linearGradient id={`colorWan${index}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                          <XAxis dataKey="time" stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                          <YAxis stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1e293b",
                              border: "1px solid #334155",
                              borderRadius: "8px",
                              color: "#f1f5f9",
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="wan"
                            stroke="#3b82f6"
                            fill={`url(#colorWan${index})`}
                            strokeWidth={2}
                            name="WAN 01"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-2 mb-2">
                      <input
                        type="checkbox"
                        id={`wan-${index}`}
                        defaultChecked
                        className="text-blue-500 bg-slate-800 border-slate-600 rounded focus:ring-blue-500 w-[14] h-[14]"
                      />
                      <label htmlFor={`wan-${index}`} className="text-slate-300 text-xs">
                        WAN 01
                      </label>
                    </div>
                    <div className="h-2 bg-green-500 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-md"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-normal">路由表</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  placeholder="名稱、IP地址"
                  className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-sm text-slate-300 focus:outline-none focus:border-slate-600"
                />
              </div>
              <select className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-md text-sm text-slate-300">
                <option>直的PoP</option>
                <option>Taipei</option>
              </select>
              <select className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-md text-sm text-slate-300">
                <option>站點/SDP</option>
                <option>Office</option>
                <option>IDC</option>
              </select>
              <button className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-400 text-sm rounded-md transition-colors">
                導出
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">名稱</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">IP/子網</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">下一步</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">路由來源</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">原始PoP</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">路由最後更新</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">詳情</th>
                </tr>
              </thead>
              <tbody>
                {routes.map((route, index) => (
                  <tr key={index} className="border-b border-slate-800 hover:bg-slate-800/30">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-500/20 rounded flex items-center justify-center">
                          <span className="text-xs text-blue-400">📄</span>
                        </div>
                        <div>
                          <p className="text-sm text-white font-medium">{route.name}</p>
                          <p className="text-xs text-slate-400">{route.subnet}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white">🌐</span>
                        </div>
                        <span className="text-sm text-slate-300">{route.caller}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-300">{route.nextHop}</td>
                    <td className="py-3 px-4 text-sm text-slate-300">{route.source}</td>
                    <td className="py-3 px-4 text-sm text-slate-300">{route.pop}</td>
                    <td className="py-3 px-4 text-sm text-slate-300">{route.type}</td>
                    <td className="py-3 px-4">
                      <button className="text-xs text-slate-400 hover:text-white transition-colors">
                        查看詳情 0.0.0.0
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-end gap-2 mt-4">
            <span className="text-sm text-slate-400">每頁行數：</span>
            <select className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-md text-sm text-slate-300">
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </select>
            <span className="text-sm text-slate-400">1-4 共 4</span>
            <button className="p-2 text-slate-500 cursor-not-allowed" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-2 text-slate-500 cursor-not-allowed" disabled>
              <ChevronRight className="w-4 h-4" />
            </button>
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
            <Search className="w-4 h-4" />
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
        <div className="flex gap-2 mb-6">
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
              {tab.sublabel && <span className="ml-2 text-xs opacity-70">({tab.sublabel})</span>}
            </button>
          ))}
        </div>

        {renderContent()}
      </div>
    </div>
  )
}
