'use client';

import { useMutation } from '@tanstack/react-query';
import { toPng } from 'html-to-image';
import {
  AlertTriangle,
  ChevronDown,
  Database,
  Download,
  // FileText, // TODO: 未來將實作 PPT 匯出功能
  Shield,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { AnalysisState } from '@/components/trends/AnalysisState';
import { HttpAttackView } from '@/components/trends/HttpAttackView';
// import { ZtnaView } from '@/components/trends/ZtnaView'; // TODO: 未來將實作 ZTNA 功能
import {
  fetchCloudflareTrendComparison,
  mapTimeRangeToApi,
  transformToDashboardData,
} from '@/services/cloudflare-trend';
import {
  type DashboardData,
  generateMockData,
  type TimeRange,
} from '@/utils/trend-mockData';

// import { generateZTNAData } from '@/utils/ztnaData'; // TODO: 未來將實作 ZTNA 功能

const TIME_RANGES: Array<{ value: TimeRange; label: string }> = [
  { value: '1h', label: '1小時 vs 前1小時' },
  { value: '6h', label: '6小時 vs 前6小時' },
  { value: '1d', label: '1天 vs 前1天' },
  { value: '1w', label: '1週 vs 前1週' },
  { value: '1m', label: '1個月 vs 前1個月' },
];

type ErrorType = 'insufficient-data' | 'service-timeout' | null;
type AnalysisMode = 'http-attack' | 'ztna';

export default function CloudflareTrendsPage() {
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>('http-attack');
  const [tempRange, setTempRange] = useState<TimeRange>('1d');
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [error, setError] = useState<ErrorType>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // 使用 useMutation 處理手動觸發的分析請求
  const trendMutation = useMutation({
    mutationFn: (timeRange: TimeRange) =>
      fetchCloudflareTrendComparison({
        timeRange: mapTimeRangeToApi(timeRange),
      }),
    onSuccess: (response) => {
      const data = transformToDashboardData(response);
      setDashboardData(data);
      setHasAnalyzed(true);
      setError(null);
    },
    onError: (err) => {
      console.error('趨勢分析 API 錯誤:', err);
      // TODO: 後端 API 串接成功後，移除此 mock data fallback 並改為顯示錯誤訊息
      console.warn('使用 mock data 作為 fallback');
      const mockData = generateMockData(tempRange);
      setDashboardData(mockData);
      setHasAnalyzed(true);
      setError(null);
    },
  });

  const handleAnalyze = () => {
    setError(null);
    trendMutation.mutate(tempRange);
  };

  const handleRetry = () => {
    setError(null);
    handleAnalyze();
  };

  const handleDownloadReport = async () => {
    if (!reportRef.current) return;

    setIsExporting(true);
    try {
      const dataUrl = await toPng(reportRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: '#0f172a', // slate-900 背景色
      });

      const link = document.createElement('a');
      link.download = `cloudflare-trend-report-${new Date().toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('匯出報告失敗:', error);
      alert('匯出報告失敗，請稍後再試');
    } finally {
      setIsExporting(false);
    }
  };

  // TODO: 未來將實作 PPT 匯出功能
  // const handleGeneratePPT = () => {
  //   alert('PPT 生成功能即將推出...');
  // };

  const handleModeChange = (mode: AnalysisMode) => {
    setAnalysisMode(mode);
    setHasAnalyzed(false);
  };

  return (
    <div className="min-h-screen" ref={reportRef}>
      <main className="max-w-7xl mx-auto px-6 py-6 space-y-5">
        {/* Title with Icon */}
        <div className="flex items-center gap-3 mb-6">
          <div>
            <h1 className="text-gradient-blue text-xl text-[rgb(255,255,255)] text-[20px]">
              Cloudflare 攻擊事件趨勢分析
            </h1>
            <p className="text-xs text-slate-400">即時監控與歷史比對分析系統</p>
          </div>
        </div>

        {/* Analysis Mode Tabs and Time Range Selector */}
        <div className="flex justify-between items-center">
          {/* Analysis Mode Tabs */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleModeChange('http-attack')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-300 text-xs ${
                analysisMode === 'http-attack'
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>HTTP 攻擊</span>
            </button>
            {/* TODO: 未來將實作 ZTNA 功能 */}
            {/* <button
              type="button"
              onClick={() => handleModeChange('ztna')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-300 text-xs ${
                analysisMode === 'ztna'
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ZTNA</span>
            </button> */}
          </div>

          {/* Time Range Selector and Export Menu */}
          <div className="flex items-center gap-3">
            <span className="text-slate-400 text-sm">時間範圍</span>
            <div className="relative">
              <select
                value={tempRange}
                onChange={(e) => setTempRange(e.target.value as TimeRange)}
                className="appearance-none bg-slate-800/50 border border-slate-700/50 text-slate-200 text-sm rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all cursor-pointer hover:bg-slate-700/50 min-w-[140px]"
              >
                {TIME_RANGES.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>

            {hasAnalyzed && !error && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  disabled={isExporting}
                  className="flex items-center gap-2 bg-slate-800/50 border border-slate-700/50 text-slate-200 text-sm rounded-lg px-4 py-2 hover:bg-slate-700/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download
                    className={`w-4 h-4 ${isExporting ? 'animate-pulse' : ''}`}
                  />
                  <span>{isExporting ? '匯出中...' : '匯出'}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${showExportMenu ? 'rotate-180' : ''}`}
                  />
                </button>

                {showExportMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700/50 rounded-lg shadow-lg shadow-black/20 z-50 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => {
                        handleDownloadReport();
                        setShowExportMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-slate-200 hover:bg-slate-700/50 transition-colors text-sm"
                    >
                      <Download className="w-4 h-4 text-blue-400" />
                      <span>下載報告 (PNG)</span>
                    </button>
                    {/* TODO: 未來將實作 PPT 匯出功能 */}
                    {/* <div className="h-px bg-slate-700/50" />
                    <button
                      type="button"
                      onClick={() => {
                        handleGeneratePPT();
                        setShowExportMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-slate-200 hover:bg-slate-700/50 transition-colors text-sm"
                    >
                      <FileText className="w-4 h-4 text-purple-400" />
                      <span>生成PPT簡報</span>
                    </button> */}
                  </div>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={handleAnalyze}
              className="gradient-blue-bright text-white text-sm px-6 py-2 rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 glow-blue-subtle"
            >
              {trendMutation.isPending ? '分析中...' : '開始趨勢分析'}
            </button>
          </div>
        </div>

        {/* Error Message Display */}
        {error && (
          <div
            className={`card-dark rounded-xl p-6 border-2 ${
              error === 'insufficient-data'
                ? 'border-yellow-500/30 bg-yellow-500/5'
                : 'border-red-500/30 bg-red-500/5'
            } animate-in fade-in duration-300`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`${
                  error === 'insufficient-data'
                    ? 'bg-gradient-to-br from-yellow-500 to-orange-500'
                    : 'bg-gradient-to-br from-red-500 to-rose-600'
                } p-3 rounded-lg shadow-lg ${
                  error === 'insufficient-data'
                    ? 'shadow-yellow-500/20'
                    : 'shadow-red-500/20'
                }`}
              >
                {error === 'insufficient-data' ? (
                  <Database className="w-6 h-6 text-white" />
                ) : (
                  <XCircle className="w-6 h-6 text-white" />
                )}
              </div>
              <div className="flex-1">
                <h3
                  className={`${
                    error === 'insufficient-data'
                      ? 'text-yellow-400'
                      : 'text-red-400'
                  } text-lg mb-2 font-medium`}
                >
                  {error === 'insufficient-data' ? '數據不足' : '分析服務異常'}
                </h3>
                <p className="text-slate-300 mb-4 leading-relaxed">
                  {error === 'insufficient-data'
                    ? '數據量不足，無法生成趨勢分析，請擴大時間範圍。'
                    : '分析服務暫時忙碌，請稍後再試。系統已保留您的設定，不會影響現有數據。'}
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleRetry}
                    className={`flex items-center gap-2 ${
                      error === 'insufficient-data'
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:shadow-yellow-500/30'
                        : 'bg-gradient-to-r from-red-500 to-rose-600 hover:shadow-red-500/30'
                    } text-white px-6 py-2.5 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm font-medium`}
                  >
                    <span>重新分析</span>
                  </button>
                  {error === 'insufficient-data' && (
                    <button
                      type="button"
                      onClick={() => {
                        setTempRange('1d');
                        setError(null);
                      }}
                      className="flex items-center gap-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-200 px-6 py-2.5 rounded-lg border border-slate-600/50 hover:border-slate-500/50 transition-all duration-300 text-sm"
                    >
                      <span>調整至 1 天</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Initial Empty State */}
        {!hasAnalyzed && !error && !trendMutation.isPending ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
              <div className="relative bg-slate-900/80 backdrop-blur-sm border border-blue-500/30 p-8 rounded-2xl glow-blue-subtle shadow-lg shadow-blue-500/50">
                {analysisMode === 'http-attack' ? (
                  <Shield className="w-16 h-16 text-slate-400" />
                ) : (
                  <ShieldCheck className="w-16 h-16 text-slate-400" />
                )}
              </div>
            </div>
            <div className="text-center space-y-3">
              <h2 className="text-2xl text-gradient-blue text-[rgb(255,255,255)]">
                {analysisMode === 'http-attack'
                  ? '開始分析 HTTP 攻擊趨勢'
                  : '開始分析 Zero Trust 趨勢'}
              </h2>
              <p className="text-slate-400 text-sm max-w-md">
                {analysisMode === 'http-attack'
                  ? '選擇時間範圍後點擊「趨勢分析」按鈕，系統將為您分析 HTTP 攻擊事件的詳細趨勢與統計數據'
                  : '選擇時間範圍後點擊「趨勢分析」按鈕，系統將為您分析 Zero Trust 使用行為、資源消耗與授權使用狀況'}
              </p>
            </div>
            <div className="flex items-center gap-2 text-slate-500 text-xs">
              <AlertTriangle className="w-4 h-4" />
              <span>資安即時監控系統</span>
            </div>
          </div>
        ) : trendMutation.isPending ? (
          <AnalysisState mode={analysisMode} />
        ) : null}

        {/* HTTP Attack Analysis Results */}
        {hasAnalyzed &&
          !error &&
          analysisMode === 'http-attack' &&
          dashboardData && <HttpAttackView data={dashboardData} />}

        {/* ZTNA Analysis Results */}
        {/* TODO: 未來將實作 ZTNA 功能 */}
        {/* {hasAnalyzed && !error && analysisMode === 'ztna' && (
          <ZtnaView data={ztnaData} />
        )} */}
      </main>
    </div>
  );
}
