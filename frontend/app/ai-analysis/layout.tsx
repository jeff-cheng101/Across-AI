'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  History,
  Sparkles,
  SparklesIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';
import { WAFDataProvider } from '@/app/dashboard/waf-data-context';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const brands = [
  {
    name: 'Cloudflare',
    logo: '/logos/Cloudflar.png',
    href: '/ai-analysis/cloudflare',
    value: 'cloudflare',
  },
  {
    name: 'Palo Alto',
    logo: '/logos/palo-alto-networks-1.png',
    href: '/ai-analysis/paloalto',
    value: 'paloalto',
    disabled: true,
  },
  {
    name: 'F5',
    logo: '/logos/f5_b.png',
    href: '/ai-analysis/f5',
    value: 'f5',
    disabled: false,
  },
  {
    name: 'CATO',
    logo: '/logos/cato-networks.png',
    href: '#',
    value: 'cato',
    disabled: true,
  },
  {
    name: 'Checkpoint',
    logo: '/logos/checkpoint.png',
    href: '/ai-analysis/checkpoint',
    value: 'checkpoint',
    disabled: false,
  },
  {
    name: 'Intezer',
    logo: '/logos/INTEZER_logo.png',
    href: '#',
    value: 'intezer',
    disabled: true,
  },
  {
    name: 'CyCraft',
    logo: '/logos/craftai.png',
    href: '#',
    value: 'cycraft',
    disabled: true,
  },
];

const installedModels = [
  { id: 'gpt-oss-20b', name: 'GPT-OSS20b', version: '1.0.0' },
];

const trendBrands = brands.map((brand) =>
  brand.value === 'checkpoint' || brand.value === 'f5'
    ? { ...brand, disabled: true }
    : brand,
);

export default function AIAnalysisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedModel, setSelectedModel] = useState(installedModels[0].id);
  const [isBrandsMenuOpen, setIsBrandsMenuOpen] = useState(true); // Default open as per user request implicit context
  const [isReportMenuOpen, setIsReportMenuOpen] = useState(false);
  const [isTrendReportOpen, setIsTrendReportOpen] = useState(false);
  const pathname = usePathname();

  return (
    <WAFDataProvider>
      <div className="flex min-h-screen bg-[#08131D]">
        {/* Brand Sidebar */}
        <motion.aside
          initial={false}
          animate={{ width: isCollapsed ? '80px' : '240px' }}
          transition={{ duration: 0.3 }}
          className="relative bg-slate-900/40 border-r border-white/10 backdrop-blur-sm flex flex-col"
        >
          {/* Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full bg-slate-800 border border-white/10 hover:bg-slate-700"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>

          {/* Header */}
          <div className="p-6 border-b border-white/10">
            {!isCollapsed ? (
              <div>
                <h2 className="text-white font-semibold text-lg">
                  Security Brands
                </h2>
                <p className="text-slate-400 text-xs mt-1">選擇品牌查看分析</p>
              </div>
            ) : (
              <div className="flex justify-center">
                <button
                  type="button"
                  className="outline-none focus:ring-2 focus:ring-cyan-400 rounded-lg"
                  onClick={() => setIsCollapsed(false)}
                >
                  <Sparkles className="w-6 h-6 text-white cursor-pointer hover:text-cyan-400 transition-colors" />
                </button>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <SparklesIcon className="w-4 h-4 text-white" />
                <h3 className="text-white text-sm font-medium">AI 模型</h3>
              </div>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-full bg-slate-800/50 border-white/10 text-white hover:bg-slate-800/70">
                  <SelectValue placeholder="選擇模型" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border border-white/10">
                  {installedModels.map((model) => (
                    <SelectItem
                      key={model.id}
                      value={model.id}
                      className="text-white hover:bg-slate-800 focus:bg-slate-800"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{model.name}</span>
                        <span className="text-xs text-slate-400">
                          v{model.version}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <nav className="flex-1 p-4 overflow-y-auto">
            {!isCollapsed ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => setIsBrandsMenuOpen(!isBrandsMenuOpen)}
                    className="flex items-center justify-between px-3 py-2 hover:bg-slate-800/30 rounded transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-slate-400 w-full"
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-slate-50" />
                      <span className="text-slate-300 text-sm font-medium">
                        AI 分析產品選擇
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${isBrandsMenuOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  <AnimatePresence>
                    {isBrandsMenuOpen && (
                      <motion.ul
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="pl-3 space-y-1 overflow-hidden"
                      >
                        {brands.map((brand) => (
                          <li key={brand.value}>
                            <Link
                              href={brand.disabled ? '#' : brand.href}
                              onClick={(e) => {
                                if (brand.disabled) {
                                  e.preventDefault();
                                }
                              }}
                              className={`flex items-center gap-2 px-3 py-2 rounded hover:bg-slate-800/30 transition-colors ${
                                brand.disabled
                                  ? 'opacity-50 cursor-not-allowed'
                                  : 'cursor-pointer'
                              } ${pathname?.includes(brand.value) ? 'bg-slate-800/20' : ''}`}
                            >
                              <div className="w-5 h-5 rounded bg-white/5 flex items-center justify-center overflow-hidden flex-shrink-0 relative">
                                <Image
                                  src={brand.logo || '/placeholder.svg'}
                                  alt={brand.name}
                                  width={12}
                                  height={12}
                                  className="object-contain"
                                />
                              </div>
                              <span className="text-white text-xs flex-1">
                                {brand.name}
                              </span>
                              {brand.disabled && (
                                <span className="text-xs text-slate-500">
                                  即將推出
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-3">
                  <Link href="/ai-analysis/history" className="block">
                    <div className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:opacity-80 transition-opacity">
                      <History className="w-4 h-4 text-slate-50" />
                      <span className="text-slate-300 text-sm font-medium">
                        AI 分析歷史紀錄
                      </span>
                    </div>
                  </Link>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between px-3 py-2 cursor-pointer hover:opacity-80 transition-opacity">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-50" />
                        <span className="text-slate-300 text-sm font-medium">
                          AI 進階分析報告
                        </span>
                      </div>
                    </div>

                    <div className="pl-6 space-y-1">
                      <button
                        type="button"
                        onClick={() => setIsTrendReportOpen(!isTrendReportOpen)}
                        className="flex items-center justify-between px-3 py-2 hover:bg-slate-800/30 rounded transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-slate-400 w-full"
                      >
                        <span className="text-slate-400 text-sm">
                          趨勢分析報告
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-400 transition-transform ${isTrendReportOpen ? 'rotate-180' : ''}`}
                        />
                      </button>

                      <AnimatePresence>
                        {isTrendReportOpen && (
                          <motion.ul
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="pl-3 space-y-1 overflow-hidden"
                          >
                            {trendBrands.map((brand) => (
                              <li key={`trend-${brand.value}`}>
                                <Link
                                  href={
                                    brand.disabled
                                      ? '#'
                                      : `/ai-analysis/trends/${brand.value}`
                                  }
                                  onClick={(e) => {
                                    if (brand.disabled) {
                                      e.preventDefault();
                                    }
                                  }}
                                  className={`flex items-center gap-2 px-3 py-2 rounded hover:bg-slate-800/30 transition-colors ${
                                    brand.disabled
                                      ? 'opacity-50 cursor-not-allowed'
                                      : 'cursor-pointer'
                                  }`}
                                >
                                  <div className="w-5 h-5 rounded bg-white/5 flex items-center justify-center overflow-hidden flex-shrink-0 relative">
                                    <Image
                                      src={brand.logo || '/placeholder.svg'}
                                      alt={brand.name}
                                      width={12}
                                      height={12}
                                      className="object-contain"
                                    />
                                  </div>
                                  <span className="text-slate-300 text-xs flex-1">
                                    {brand.name}
                                  </span>
                                  {brand.disabled && (
                                    <span className="text-xs text-slate-500">
                                      即將推出
                                    </span>
                                  )}
                                </Link>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>

                      {/* Vector Report */}
                      <div className="flex items-center px-3 py-2 hover:bg-slate-800/30 rounded transition-colors cursor-pointer">
                        <span className="text-slate-400 text-sm">向量報告</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  type="button"
                  className="p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer flex justify-center outline-none focus:ring-2 focus:ring-slate-400 w-full"
                  title="AI 分析產品選擇"
                  onClick={() => setIsCollapsed(false)}
                >
                  <Building2 className="w-5 h-5 text-slate-400" />
                </button>

                <Link href="/ai-analysis/history">
                  <div
                    className="p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer flex justify-center"
                    title="AI 分析歷史紀錄"
                  >
                    <History className="w-5 h-5 text-slate-400" />
                  </div>
                </Link>

                <button
                  type="button"
                  className="p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer flex justify-center outline-none focus:ring-2 focus:ring-slate-400 w-full"
                  title="生成詳細報告"
                  onClick={() => setIsReportMenuOpen(!isReportMenuOpen)}
                >
                  <FileText className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            )}
          </nav>

          {/* Back to Dashboard */}
          {!isCollapsed && (
            <div className="p-4 border-t border-white/10">
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="w-full border-white/10 text-white hover:bg-white/5 bg-transparent"
                >
                  返回 Dashboard
                </Button>
              </Link>
            </div>
          )}
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto pl-6">{children}</main>
      </div>
    </WAFDataProvider>
  );
}
