"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CustomDatePicker } from "@/components/custom-date-picker"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export default function PaloAltoPage() {
  const [activeTab, setActiveTab] = useState("firewall")
  const [dateFrom, setDateFrom] = useState<Date | undefined>(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
  const [dateTo, setDateTo] = useState<Date | undefined>(new Date())

  const tabs = [
    { id: "overview", label: "總覽", sublabel: "Overview" },
    { id: "firewall", label: "NGFW" },
  ]

  const sessionStats = [
    { name: "TCP Sessions", value: 778, color: "#3B82F6" },
    { name: "UDP Sessions", value: 166, color: "#60A5FA" },
    { name: "ICMP Sessions", value: 73, color: "#93C5FD" },
    { name: "SSL Proxy Session(s)", value: 0, color: "#BFDBFE" },
    { name: "vSys Sessions", value: 1055, color: "#2563EB" },
    { name: "Utilization %", value: 0, color: "#1E40AF" },
  ]

  const packetsData = Array.from({ length: 40 }, (_, i) => ({
    time: `${String(Math.floor(i / 2) + 4).padStart(2, "0")}:${i % 2 === 0 ? "00" : "30"}`,
    sent: Math.random() * 2000 + 1000,
    received: Math.random() * 3000 + 1500,
  }))

  const droppedPacketsData = Array.from({ length: 40 }, (_, i) => ({
    time: `${String(Math.floor(i / 2) + 4).padStart(2, "0")}:${i % 2 === 0 ? "00" : "30"}`,
    "arp processing": Math.random() * 15 + 5,
    "flow control processing": Math.random() * 20 + 10,
    "packet forwarding engine": Math.random() * 12 + 8,
    "session processing": Math.random() * 18 + 12,
    netflow: Math.random() * 10 + 5,
  }))

  const sessionsDiscardedData = Array.from({ length: 40 }, (_, i) => ({
    time: `${String(Math.floor(i / 2) + 4).padStart(2, "0")}:${i % 2 === 0 ? "00" : "30"}`,
    "sessions discarded by security policy": i % 8 === 3 || i % 8 === 4 ? Math.random() * 80 + 20 : 0,
  }))

  const globalSessionData = Array.from({ length: 40 }, (_, i) => ({
    time: `${String(Math.floor(i / 2) + 4).padStart(2, "0")}:${i % 2 === 0 ? "00" : "30"}`,
    "active sessions": Math.random() * 8 + 3,
    "TCP sessions": Math.random() * 10 + 5,
    "UDP sessions": Math.random() * 6 + 2,
    "ICMP sessions": Math.random() * 4 + 1,
    "SSL proxy sessions": Math.random() * 3 + 1,
  }))

  const formatYAxis = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}k`
    }
    return value.toString()
  }

  const threatData = [
    {
      severity: "high",
      message: "Ransomware: 20150528 (7.23 message: High - AAAA#1234567890123) THREAT - Vulnerability: SMB - User...",
      time: "2024-11-24 19:23:45",
    },
    {
      severity: "medium",
      message: "Ransomware: 20150528 (7.23 message: High - AAAA#1234567890123) THREAT - Vulnerability: SMB - User...",
      time: "2024-11-24 19:23:45",
    },
    {
      severity: "high",
      message: "Ransomware: 20150528 (7.23 message: High - AAAA#1234567890123) THREAT - Vulnerability: SMB - User...",
      time: "2024-11-24 19:23:45",
    },
    {
      severity: "high",
      message: "Ransomware: 20150528 (7.23 message: High - AAAA#1234567890123) THREAT - Vulnerability: SMB - User...",
      time: "2024-11-24 19:23:45",
    },
    {
      severity: "medium",
      message: "Ransomware: 20150528 (7.23 message: High - AAAA#1234567890123) THREAT - Vulnerability: SMB - User...",
      time: "2024-11-24 19:23:45",
    },
  ]

  const renderContent = () => {
    if (activeTab === "overview") {
      return (
        <div className="p-6">
          <div className="text-center text-muted-foreground py-12">總覽內容建置中...</div>
        </div>
      )
    }

    if (activeTab === "firewall") {
      return (
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {sessionStats.map((stat, index) => (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-slate-900/40 backdrop-blur-md border border-white/10">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{stat.value.toLocaleString()}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Aggregate Packets Handled */}
            <Card className="bg-slate-900/40 backdrop-blur-md border border-white/10">
              <CardHeader>
                <CardTitle className="text-base">Aggregate Packets Handled</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={packetsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis
                      dataKey="time"
                      stroke="#94a3b8"
                      tick={{ fontSize: 10 }}
                      interval={9}
                      label={{ value: "Time", position: "insideBottom", offset: -5, fill: "#94a3b8", fontSize: 12 }}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      tick={{ fontSize: 10 }}
                      tickFormatter={formatYAxis}
                      label={{
                        value: "Packets/sec",
                        angle: -90,
                        position: "insideLeft",
                        fill: "#94a3b8",
                        fontSize: 12,
                      }}
                    />
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
                    <Legend wrapperStyle={{ fontSize: "11px" }} iconType="circle" align="left" />
                    <Area type="monotone" dataKey="sent" stackId="1" stroke="#12B981" fill="#12B981" name="sent" />
                    <Area
                      type="monotone"
                      dataKey="received"
                      stackId="1"
                      stroke="#FA7315"
                      fill="#FA7315"
                      name="received"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Dropped Packets by Aspect */}
            <Card className="bg-slate-900/40 backdrop-blur-md border border-white/10">
              <CardHeader>
                <CardTitle className="text-base">Top Dropped Packets by Aspect</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={droppedPacketsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis
                      dataKey="time"
                      stroke="#94a3b8"
                      tick={{ fontSize: 10 }}
                      interval={9}
                      label={{ value: "Time", position: "insideBottom", offset: -5, fill: "#94a3b8", fontSize: 12 }}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      tick={{ fontSize: 10 }}
                      label={{
                        value: "Dropped/sec",
                        angle: -90,
                        position: "insideLeft",
                        fill: "#94a3b8",
                        fontSize: 12,
                      }}
                    />
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
                    <Legend wrapperStyle={{ fontSize: "10px" }} iconType="circle" align="left" />
                    <Area
                      type="monotone"
                      dataKey="netflow"
                      stackId="1"
                      stroke="#10B981"
                      fill="#10B981"
                      name="Palo Alto firewall router netflow"
                    />
                    <Area
                      type="monotone"
                      dataKey="session processing"
                      stackId="1"
                      stroke="#F59E0B"
                      fill="#F59E0B"
                      name="Palo Alto firewall router netflow - session processing"
                    />
                    <Area
                      type="monotone"
                      dataKey="packet forwarding engine"
                      stackId="1"
                      stroke="#FA7315"
                      fill="#FA7315"
                      name="Palo Alto firewall router netflow - packet forwarding engine"
                    />
                    <Area
                      type="monotone"
                      dataKey="flow control processing"
                      stackId="1"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      name="Palo Alto firewall router netflow - flow control processing"
                    />
                    <Area
                      type="monotone"
                      dataKey="arp processing"
                      stackId="1"
                      stroke="#61A6FB"
                      fill="#61A6FB"
                      name="Palo Alto firewall router netflow - arp processing"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Firewall Status */}
            <Card className="bg-slate-900/40 backdrop-blur-md border border-white/10">
              <CardHeader>
                <CardTitle className="text-base">Firewall Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3">
                    <div className="text-xs text-yellow-400">⚠ Palo Alto firewall router netflow Alert Status</div>
                  </div>
                  <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                    <div className="text-xs text-green-400">✓ Palo Alto firewall router netflow License Status</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Aggregate Sessions Discarded by Security Policy */}
            <Card className="bg-slate-900/40 backdrop-blur-md border border-white/10">
              <CardHeader>
                <CardTitle className="text-base">Aggregate Sessions Discarded by Security Policy</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={sessionsDiscardedData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis
                      dataKey="time"
                      stroke="#94a3b8"
                      tick={{ fontSize: 10 }}
                      interval={9}
                      label={{ value: "Time", position: "insideBottom", offset: -5, fill: "#94a3b8", fontSize: 12 }}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      tick={{ fontSize: 10 }}
                      label={{
                        value: "Sessions/sec",
                        angle: -90,
                        position: "insideLeft",
                        fill: "#94a3b8",
                        fontSize: 12,
                      }}
                    />
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
                    <Legend wrapperStyle={{ fontSize: "10px" }} iconType="circle" align="left" />
                    <Line
                      type="monotone"
                      dataKey="sessions discarded by security policy"
                      stroke="#EF4444"
                      strokeWidth={2}
                      dot={false}
                      name="Palo Alto firewall router netflow - sessions discarded by security policy"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Global Session Statistics */}
            <Card className="bg-slate-900/40 backdrop-blur-md border border-white/10">
              <CardHeader>
                <CardTitle className="text-base">Global Session Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={globalSessionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis
                      dataKey="time"
                      stroke="#94a3b8"
                      tick={{ fontSize: 10 }}
                      interval={9}
                      label={{ value: "Time", position: "insideBottom", offset: -5, fill: "#94a3b8", fontSize: 12 }}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      tick={{ fontSize: 10 }}
                      tickFormatter={formatYAxis}
                      label={{ value: "Sessions", angle: -90, position: "insideLeft", fill: "#94a3b8", fontSize: 12 }}
                    />
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
                    <Legend wrapperStyle={{ fontSize: "10px" }} iconType="circle" align="left" />
                    <Area
                      type="monotone"
                      dataKey="SSL proxy sessions"
                      stackId="1"
                      stroke="#10B981"
                      fill="#10B981"
                      name="Palo Alto firewall router netflow - SSL proxy sessions"
                    />
                    <Area
                      type="monotone"
                      dataKey="ICMP sessions"
                      stackId="1"
                      stroke="#F59E0B"
                      fill="#F59E0B"
                      name="Palo Alto firewall router netflow - ICMP sessions"
                    />
                    <Area
                      type="monotone"
                      dataKey="UDP sessions"
                      stackId="1"
                      stroke="#61A6FB"
                      fill="#61A6FB"
                      name="Palo Alto firewall router netflow - UDP sessions"
                    />
                    <Area
                      type="monotone"
                      dataKey="TCP sessions"
                      stackId="1"
                      stroke="#FA7315"
                      fill="#FA7315"
                      name="Palo Alto firewall router netflow - TCP sessions"
                    />
                    <Area
                      type="monotone"
                      dataKey="active sessions"
                      stackId="1"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      name="Palo Alto firewall router netflow - active sessions"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Firewall Threat Detection */}
            <Card className="bg-slate-900/40 backdrop-blur-md border border-white/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base">Firewall Threat Detection</CardTitle>
                <div className="text-sm text-muted-foreground">150+ Alerts</div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[250px] overflow-y-auto">
                  {threatData.map((threat, index) => (
                    <div key={index} className="flex items-start gap-2 p-2 bg-muted/50 rounded border border-border">
                      <div
                        className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${threat.severity === "high" ? "bg-yellow-400" : "bg-green-400"}`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-foreground truncate">{threat.message}</div>
                        <div className="text-[10px] text-muted-foreground mt-1">{threat.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Time Range Picker Section */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="mb-6 flex items-center gap-4 bg-slate-900/40 backdrop-blur-md border border-white/10 p-4 rounded-md mx-6 mt-6"
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

      {/* Tab Navigation */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex gap-2 mb-6 rounded-md flex-row px-6 pt-6"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              if (tab.id !== "overview") {
                setActiveTab(tab.id)
              }
            }}
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

      {/* Content */}
      {renderContent()}
    </div>
  )
}
