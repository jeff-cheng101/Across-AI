'use client';

import { ListChecks, Sparkles } from 'lucide-react';
import { LicenseUsageCard } from '@/components/trends/LicenseUsageCard';
import { ZTNAGenericTable } from '@/components/trends/ZTNAGenericTable';
import { ZTNAUserTable } from '@/components/trends/ZTNAUserTable';
import type { ZTNAData } from '@/utils/ztnaData';

interface ZtnaViewProps {
  data: ZTNAData;
}

export function ZtnaView({ data }: ZtnaViewProps) {
  return (
    <>
      {/* License Usage */}
      <LicenseUsageCard license={data.license} />

      {/* User Ranking */}
      <ZTNAUserTable users={data.topUsers} />

      {/* Bandwidth and Applications in Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ZTNAGenericTable
          title="頻寬使用者排行（Bandwidth by User）"
          columns={{
            nameLabel: '使用者',
            valueLabel: '使用頻寬（MB）',
            previousLabel: '前期頻寬',
            changeLabel: '成長率',
          }}
          data={data.topBandwidthUsers.map((user) => ({
            name: user.name,
            value: user.bandwidth,
            previousValue: user.previousBandwidth,
            change: user.change,
          }))}
          valueFormatter={(v) => `${(v / 1024).toFixed(2)} GB`}
        />

        <ZTNAGenericTable
          title="應用程式使用分析（Application Analysis）"
          columns={{
            nameLabel: '應用程式',
            valueLabel: '存取次數',
            previousLabel: '前期數值',
            changeLabel: '變化',
          }}
          data={data.topApplications.slice(0, 5).map((app) => ({
            name: `${app.name} (${app.type})`,
            value: app.accessCount,
            previousValue: app.previousAccessCount,
            change: app.change,
          }))}
        />
      </div>

      {/* Login Country and Access Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ZTNAGenericTable
          title="登入國家分析（Login Country）"
          columns={{
            nameLabel: '國家',
            valueLabel: '登入次數',
            previousLabel: '前期數值',
            changeLabel: '成長率',
          }}
          data={data.topCountries.map((country) => ({
            name: `${country.country} (${country.code})`,
            value: country.loginCount,
            previousValue: country.previousLoginCount,
            change: country.change,
          }))}
        />

        <ZTNAGenericTable
          title="登入應用程式次數（Access 控制）"
          columns={{
            nameLabel: '應用程式',
            valueLabel: '登入次數',
            previousLabel: '前期數值',
            changeLabel: '變化',
          }}
          data={data.accessApplications.map((app) => ({
            name: app.name,
            value: app.loginCount,
            previousValue: app.previousLoginCount,
            change: app.change,
          }))}
        />
      </div>

      {/* Executive Summary */}
      <div className="card-dark rounded-xl p-6 border border-blue-500/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="gradient-blue-bright p-2 rounded-lg glow-blue-subtle">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-blue-400 text-lg">
            整體趨勢摘要（Executive Summary）
          </h2>
        </div>
        <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/30">
          <p className="text-slate-300 leading-relaxed text-[14px] font-normal">
            {data.executiveSummary}
          </p>
        </div>
      </div>

      {/* Management Recommendations */}
      <div className="card-dark rounded-xl p-6 border border-emerald-500/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-lg shadow-lg shadow-emerald-500/20">
            <ListChecks className="w-5 h-5 text-white" />
          </div>
          <h2 className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent text-lg">
            管理建議（Management Recommendations）
          </h2>
        </div>
        <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/30">
          <ul className="space-y-3">
            {data.recommendations.map((recommendation, index) => (
              <li
                key={`${index}-${recommendation}`}
                className="flex items-start gap-3 text-slate-300"
              >
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs mt-0.5">
                  {index + 1}
                </span>
                <span className="leading-relaxed text-[14px]">
                  {recommendation}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
