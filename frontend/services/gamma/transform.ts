/**
 * Gamma 資料轉換工具
 * 將 DashboardData 轉換為 Gamma API 需要的 Markdown 格式
 */

import type { DashboardData, TopItem } from '@/utils/trend-mockData';
import type { GammaGenerateRequest } from './type';

/**
 * 格式化數字（加入千分位）
 */
function formatNumber(num: number): string {
  return num.toLocaleString('zh-TW');
}

/**
 * 格式化百分比變化
 */
function formatChange(change: number): string {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(1)}%`;
}

/**
 * 將 Top 5 列表轉換為 Markdown 表格
 */
function topItemsToTable(items: TopItem[], nameLabel: string): string {
  const header = `| 排名 | ${nameLabel} | 次數 | 佔比 | 變化 |`;
  const divider = '|:---:|:---|---:|---:|---:|';
  const rows = items.map(
    (item) =>
      `| ${item.rank} | ${item.name} | ${formatNumber(item.cnt)} | ${item.percentage}% | ${formatChange(item.change)} |`,
  );
  return [header, divider, ...rows].join('\n');
}

/**
 * 將 DashboardData 轉換為 Gamma 簡報用的 Markdown
 * 使用 --- 分隔符控制分頁
 */
export function dashboardToMarkdown(
  data: DashboardData,
  timeRangeLabel: string,
  timeRangeValue: string,
): string {
  const sections: string[] = [];
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-').split('Z')[0];

  // 封面頁 - 標題包含時間粒度和時間戳，有助於預設檔名生成
  sections.push(`# Cloudflare 趨勢報告 ${timeRangeValue} ${timestamp}

**分析時間範圍**: ${timeRangeLabel}

**報告生成時間**: ${new Date().toLocaleString('zh-TW')}`);

  // KPI 摘要頁
  sections.push(`## 關鍵績效指標 (KPI)

- **總攻擊次數**: ${formatNumber(data.totalAttack.quantity)} 次 (${formatChange(data.totalAttack.change)})
- **HTTP 攻擊佔比**: ${data.httpPct.quantity.toFixed(1)}% (${formatChange(data.httpPct.change)})
- **封鎖率**: ${data.lockdownRate.quantity.toFixed(1)}% (${formatChange(data.lockdownRate.change)})`);

  // 流量指標頁
  sections.push(`## 流量指標

| 指標 | 當前值 | 變化 |
|:---|---:|---:|
| HTTP 請求量 | ${data.trafficMetrics.requests.quantity} | ${formatChange(data.trafficMetrics.requests.change)} |
| 資料傳輸量 | ${data.trafficMetrics.dataTransfer.quantity} | ${formatChange(data.trafficMetrics.dataTransfer.change)} |
| 頁面瀏覽次數 | ${data.trafficMetrics.visitRate.quantity} | ${formatChange(data.trafficMetrics.visitRate.change)} |
| 訪客數 | ${data.trafficMetrics.visits.quantity} | ${formatChange(data.trafficMetrics.visits.change)} |`);

  // Top 5 攻擊來源 IP
  sections.push(`## Top 5 攻擊來源 IP

${topItemsToTable(data.topIPs, 'IP 位址')}`);

  // Top 5 觸發規則
  sections.push(`## Top 5 觸發安全規則

${topItemsToTable(data.topRules, '規則名稱')}`);

  // Top 5 被攻擊主機
  sections.push(`## Top 5 被攻擊主機

${topItemsToTable(data.topHosts, '主機名稱')}`);

  // Top 5 被攻擊路徑
  sections.push(`## Top 5 被攻擊路徑

${topItemsToTable(data.topPaths, '路徑')}`);

  // Top 5 攻擊來源國家
  sections.push(`## Top 5 攻擊來源國家

${topItemsToTable(data.topCountries, '國家')}`);

  // 使用 --- 分隔符連接各頁
  return sections.join('\n\n---\n\n');
}

/**
 * 建立 Gamma API 請求
 * 配置最佳參數以確保風格一致性
 */
export function createGammaRequest(
  data: DashboardData,
  timeRangeLabel: string,
  timeRangeValue: string,
): GammaGenerateRequest {
  const markdown = dashboardToMarkdown(data, timeRangeLabel, timeRangeValue);

  return {
    inputText: markdown,
    textMode: 'preserve', // 保留原始數據，不做改寫
    cardSplit: 'inputTextBreaks', // 依照 --- 精確分頁
    format: 'presentation',
    textOptions: {
      tone: 'professional, analytical',
      language: 'zh-tw',
    },
    imageOptions: {
      source: 'aiGenerated',
      style: 'minimalist, flat corporate vector, blue palette',
    },
    exportAs: 'pptx',
  };
}
