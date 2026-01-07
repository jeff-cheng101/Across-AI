// backend/services/trendAnalysisService.js
// Cloudflare 趨勢對比分析服務
// 使用 ES|QL 聚合查詢 + 多工並行查詢策略（含請求限流）

const { elkMCPClient } = require('./elkMCPClient');
const cloudflareELKConfig = require('../config/products/cloudflare/cloudflareELKConfig');
const { ELK_CONFIG } = require('../config/elkConfig');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const OpenAI = require('openai');
const {
  logOpenAICompatibleRequest,
  logOpenAICompatibleResponse,
} = require('../utils/ollamaLogger');

/**
 * 簡易並發限制器
 * 用於控制同時執行的 Promise 數量，避免 Elasticsearch 429 錯誤
 */
class ConcurrencyLimiter {
  /**
   * @param {number} maxConcurrency - 最大並發數量
   * @param {number} delayBetweenBatches - 批次間延遲（毫秒）
   */
  constructor(maxConcurrency = 5, delayBetweenBatches = 100) {
    this.maxConcurrency = maxConcurrency;
    this.delayBetweenBatches = delayBetweenBatches;
  }

  /**
   * 延遲執行
   * @param {number} ms - 延遲毫秒數
   * @returns {Promise<void>}
   */
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * 分批並發執行任務
   * @param {Array<() => Promise<T>>} tasks - 任務函數陣列
   * @returns {Promise<T[]>} 所有任務的結果
   */
  async runAll(tasks) {
    const results = [];

    // 分批執行
    for (let i = 0; i < tasks.length; i += this.maxConcurrency) {
      const batch = tasks.slice(i, i + this.maxConcurrency);
      const batchNumber = Math.floor(i / this.maxConcurrency) + 1;
      const totalBatches = Math.ceil(tasks.length / this.maxConcurrency);

      console.log(
        `   📦 執行批次 ${batchNumber}/${totalBatches}（${batch.length} 個查詢）`,
      );

      // 執行當前批次
      const batchResults = await Promise.all(batch.map((task) => task()));
      results.push(...batchResults);

      // 如果還有下一批，添加延遲
      if (i + this.maxConcurrency < tasks.length) {
        await this.sleep(this.delayBetweenBatches);
      }
    }

    return results;
  }
}

/**
 * Cloudflare 趨勢分析服務類別
 * 提供趨勢對比分析的核心邏輯，包含：
 * - 時間區間計算
 * - ES|QL 查詢建構
 * - 多工並行查詢執行（含限流機制）
 * - 數據格式化與組裝
 */
class TrendAnalysisService {
  constructor() {
    /**
     * 支援的時間範圍配置
     * @type {Object.<string, {ms: number, label: string}>}
     */
    this.TIME_RANGES = {
      '1h': { ms: 60 * 60 * 1000, label: '1小時' },
      '6h': { ms: 6 * 60 * 60 * 1000, label: '6小時' },
      '1d': { ms: 24 * 60 * 60 * 1000, label: '1天' },
      '3d': { ms: 3 * 24 * 60 * 60 * 1000, label: '3天' },
      '7d': { ms: 7 * 24 * 60 * 60 * 1000, label: '7天' },
      '14d': { ms: 14 * 24 * 60 * 60 * 1000, label: '14天' }, // 新增 14d 支援
      '30d': { ms: 30 * 24 * 60 * 60 * 1000, label: '30天' },
    };

    // 取得趨勢分析專用索引模式
    this.indexPattern =
      cloudflareELKConfig.trendIndex || cloudflareELKConfig.index;

    /**
     * 並發限制器配置（從 elkConfig 讀取）
     * - maxConcurrency: 最大同時查詢數（避免 Elasticsearch 429 錯誤）
     * - delayBetweenBatches: 批次間延遲（毫秒）
     */
    const trendConfig = ELK_CONFIG.trend || {};
    this.limiter = new ConcurrencyLimiter(
      trendConfig.maxConcurrency || 5,
      trendConfig.batchDelayMs || 100,
    );

    console.log(
      `📊 趨勢分析並發配置：最大並發 ${this.limiter.maxConcurrency}，批次延遲 ${this.limiter.delayBetweenBatches}ms`,
    );
  }

  // ==================== 工具函數區塊 ====================

  /**
   * 四捨五入到小數第 2 位
   * @param {number} x - 輸入數值
   * @returns {number} 四捨五入後的數值
   */
  round2(x) {
    return Math.round(x * 100) / 100;
  }

  /**
   * 四捨五入到小數第 1 位
   * @param {number} x - 輸入數值
   * @returns {number} 四捨五入後的數值
   */
  round1(x) {
    return Math.round(x * 10) / 10;
  }

  /**
   * 計算百分比（0~100）
   * 若分母為 0，回傳 0 避免除零錯誤
   * @param {number} numerator - 分子
   * @param {number} denominator - 分母
   * @returns {number} 百分比數值（0~100）
   */
  ratioPct(numerator, denominator) {
    if (denominator === 0) return 0;
    return (numerator / denominator) * 100;
  }

  /**
   * 計算百分比變化
   * 規則：
   * - 若 previous = 0 且 current = 0：回傳 0
   * - 若 previous = 0 且 current > 0：回傳 100（避免無限大）
   * - 否則：((current - previous) / previous) * 100
   * @param {number} current - 當期數值
   * @param {number} previous - 上期數值
   * @returns {number} 百分比變化（取到小數第 2 位）
   */
  pctChange(current, previous) {
    if (previous === 0 && current === 0) return 0;
    if (previous === 0 && current > 0) return 100;
    return this.round2(((current - previous) / previous) * 100);
  }

  /**
   * 格式化次數（用於 httpVolume/pageView/visits 等「次數類」輸出）
   * 基準：1K=1000, 1M=1000^2, 1B=1000^3
   * @param {number} n - 次數
   * @returns {string} 格式化後的字串（如 "129.99K"）
   */
  formatCount(n) {
    if (n >= 1000000000) {
      return `${this.round2(n / 1000000000)}B`;
    } else if (n >= 1000000) {
      return `${this.round2(n / 1000000)}M`;
    } else if (n >= 1000) {
      return `${this.round2(n / 1000)}K`;
    }
    return `${n}`;
  }

  /**
   * 格式化位元組（用於 dataVolume 輸出）
   * 基準：1KB=1024, 1MB=1024^2, 1GB=1024^3
   * @param {number} bytes - 位元組數
   * @returns {string} 格式化後的字串（如 "3.09GB"）
   */
  formatBytes(bytes) {
    if (bytes >= 1024 * 1024 * 1024) {
      return `${this.round2(bytes / (1024 * 1024 * 1024))}GB`;
    } else if (bytes >= 1024 * 1024) {
      return `${this.round2(bytes / (1024 * 1024))}MB`;
    } else if (bytes >= 1024) {
      return `${this.round2(bytes / 1024)}KB`;
    }
    return `${bytes}B`;
  }

  // ==================== 時間區間計算 ====================

  /**
   * 計算當期和上期的時間區間
   * 時間基準：UTC
   * 當期區間：[now - timeRange, now)
   * 上期區間：[now - 2*timeRange, now - timeRange)
   * @param {string} timeRange - 時間範圍（1h, 6h, 1d, 3d, 7d, 14d, 30d）
   * @returns {{current: {start: Date, end: Date}, previous: {start: Date, end: Date}}}
   */
  calculateTimeRanges(timeRange) {
    const config = this.TIME_RANGES[timeRange];
    if (!config) {
      throw new Error(
        `不支援的時間範圍: ${timeRange}。支援: ${Object.keys(this.TIME_RANGES).join(', ')}`,
      );
    }

    const now = new Date();
    const duration = config.ms;

    return {
      current: {
        start: new Date(now.getTime() - duration),
        end: now,
      },
      previous: {
        start: new Date(now.getTime() - duration * 2),
        end: new Date(now.getTime() - duration),
      },
    };
  }

  // ==================== ES|QL 查詢建構器 ====================

  /**
   * 建構攻擊活動量查詢（SecurityAction 為 jschallenge/block/managedChallenge）
   * @param {Date} start - 開始時間
   * @param {Date} end - 結束時間
   * @returns {string} ES|QL 查詢語句
   */
  buildAttackCountQuery(start, end) {
    const startISO = start.toISOString();
    const endISO = end.toISOString();
    return `FROM ${this.indexPattern} | WHERE @timestamp >= "${startISO}" AND @timestamp <= "${endISO}" AND SecurityAction.keyword IN ("jschallenge", "block", "managedChallenge") | STATS count = COUNT(*)`;
  }

  /**
   * 建構 HTTP 活動量查詢（所有請求）
   * @param {Date} start - 開始時間
   * @param {Date} end - 結束時間
   * @returns {string} ES|QL 查詢語句
   */
  buildHttpVolumeQuery(start, end) {
    const startISO = start.toISOString();
    const endISO = end.toISOString();
    return `FROM ${this.indexPattern} | WHERE @timestamp >= "${startISO}" AND @timestamp <= "${endISO}" | STATS count = COUNT(*)`;
  }

  /**
   * 建構封鎖數查詢（SecurityAction 為 block）
   * @param {Date} start - 開始時間
   * @param {Date} end - 結束時間
   * @returns {string} ES|QL 查詢語句
   */
  buildBlockCountQuery(start, end) {
    const startISO = start.toISOString();
    const endISO = end.toISOString();
    return `FROM ${this.indexPattern} | WHERE @timestamp >= "${startISO}" AND @timestamp <= "${endISO}" AND SecurityAction.keyword IN ("block") | STATS count = COUNT(*)`;
  }

  /**
   * 建構攻擊趨勢查詢（依小時彙總）
   * @param {Date} start - 開始時間
   * @param {Date} end - 結束時間
   * @returns {string} ES|QL 查詢語句
   */
  buildAttackTrendQueryHour(start, end) {
    const startISO = start.toISOString();
    const endISO = end.toISOString();
    return `FROM ${this.indexPattern} | WHERE @timestamp >= "${startISO}" AND @timestamp <= "${endISO}" | WHERE SecurityAction.keyword IN ("jschallenge", "block", "managedChallenge") | EVAL hour = DATE_TRUNC(1 hour, @timestamp) | STATS count = COUNT(*) BY hour | SORT hour ASC | KEEP hour, count`;
  }
  /**
   * 建構攻擊趨勢查詢（依10分彙總）
   * @param {Date} start - 開始時間
   * @param {Date} end - 結束時間
   * @returns {string} ES|QL 查詢語句
   */
  buildAttackTrendQuery10Minute(start, end) {
    const startISO = start.toISOString();
    const endISO = end.toISOString();
    return `FROM ${this.indexPattern} | WHERE @timestamp >= "${startISO}" AND @timestamp <= "${endISO}" | WHERE SecurityAction.keyword IN ("jschallenge", "block", "managedChallenge") | EVAL hour = DATE_TRUNC(10 minute, @timestamp) | STATS count = COUNT(*) BY hour | SORT hour ASC | KEEP hour, count`;
  }
  /**
   * 建構攻擊趨勢查詢（依30分彙總）
   * @param {Date} start - 開始時間
   * @param {Date} end - 結束時間
   * @returns {string} ES|QL 查詢語句
   */
  buildAttackTrendQuery30Minute(start, end) {
    const startISO = start.toISOString();
    const endISO = end.toISOString();
    return `FROM ${this.indexPattern} | WHERE @timestamp >= "${startISO}" AND @timestamp <= "${endISO}" | WHERE SecurityAction.keyword IN ("jschallenge", "block", "managedChallenge") | EVAL hour = DATE_TRUNC(30 minute, @timestamp) | STATS count = COUNT(*) BY hour | SORT hour ASC | KEEP hour, count`;
  }
  /**
   * 建構攻擊趨勢查詢（依天彙總）
   * @param {Date} start - 開始時間
   * @param {Date} end - 結束時間
   * @returns {string} ES|QL 查詢語句
   */
  buildAttackTrendQuery1Day(start, end) {
    const startISO = start.toISOString();
    const endISO = end.toISOString();
    return `FROM ${this.indexPattern} | WHERE @timestamp >= "${startISO}" AND @timestamp <= "${endISO}" | WHERE SecurityAction.keyword IN ("jschallenge", "block", "managedChallenge") | EVAL hour = DATE_TRUNC(1 day, @timestamp) | STATS count = COUNT(*) BY hour | SORT hour ASC | KEEP hour, count`;
  }
  /**
   * 建構攻擊趨勢查詢（依3天彙總）
   * @param {Date} start - 開始時間
   * @param {Date} end - 結束時間
   * @returns {string} ES|QL 查詢語句
   */
  buildAttackTrendQuery3Day(start, end) {
    const startISO = start.toISOString();
    const endISO = end.toISOString();
    return `FROM ${this.indexPattern} | WHERE @timestamp >= "${startISO}" AND @timestamp <= "${endISO}" | WHERE SecurityAction.keyword IN ("jschallenge", "block", "managedChallenge") | EVAL hour = DATE_TRUNC(3 day, @timestamp) | STATS count = COUNT(*) BY hour | SORT hour ASC | KEEP hour, count`;
  }
  /**
   * 建構資料傳送量查詢（SUM EdgeResponseBytes）
   * @param {Date} start - 開始時間
   * @param {Date} end - 結束時間
   * @returns {string} ES|QL 查詢語句
   */
  buildDataVolumeQuery(start, end) {
    const startISO = start.toISOString();
    const endISO = end.toISOString();
    return `FROM ${this.indexPattern} | WHERE @timestamp >= "${startISO}" AND @timestamp <= "${endISO}" | STATS totalBytes = SUM(EdgeResponseBytes)`;
  }

  /**
   * 建構頁面瀏覽次數查詢（ContentType 為 text/html）
   * @param {Date} start - 開始時間
   * @param {Date} end - 結束時間
   * @returns {string} ES|QL 查詢語句
   */
  buildPageViewQuery(start, end) {
    const startISO = start.toISOString();
    const endISO = end.toISOString();
    return `FROM ${this.indexPattern} | WHERE @timestamp >= "${startISO}" AND @timestamp <= "${endISO}" AND EdgeResponseContentType IN ("text/html") | STATS count = COUNT(*)`;
  }

  /**
   * 建構造訪次數查詢（Referer 為 None）
   * @param {Date} start - 開始時間
   * @param {Date} end - 結束時間
   * @returns {string} ES|QL 查詢語句
   */
  buildVisitsQuery(start, end) {
    const startISO = start.toISOString();
    const endISO = end.toISOString();
    return `FROM ${this.indexPattern} | WHERE @timestamp >= "${startISO}" AND @timestamp <= "${endISO}" AND ClientRequestReferer.keyword IN ("None") | STATS count = COUNT(*)`;
  }

  /**
   * 建構當期 Top 5 來源 IP 查詢
   * @param {Date} start - 開始時間
   * @param {Date} end - 結束時間
   * @returns {string} ES|QL 查詢語句
   */
  buildCurrentSourceIPQuery(start, end) {
    const startISO = start.toISOString();
    const endISO = end.toISOString();
    return `FROM ${this.indexPattern} | WHERE @timestamp >= "${startISO}" AND @timestamp <= "${endISO}" | STATS cnt = count(*) BY ClientIP | SORT cnt DESC | LIMIT 5`;
  }

  /**
   * 建構上期 Top 5 來源 IP 查詢（使用當期 IP 列表作為過濾條件）
   * @param {Date} start - 開始時間
   * @param {Date} end - 結束時間
   * @param {string[]} ipList - 當期 Top 5 IP 列表
   * @returns {string} ES|QL 查詢語句
   */
  buildPreviousSourceIPQuery(start, end, ipList) {
    const startISO = start.toISOString();
    const endISO = end.toISOString();
    const ipFilter = ipList.map((ip) => `"${ip}"`).join(',');
    return `FROM ${this.indexPattern} | WHERE @timestamp >= "${startISO}" AND @timestamp <= "${endISO}" | WHERE ClientIP IN (${ipFilter}) | STATS cnt = COUNT(*) BY ClientIP | SORT cnt DESC`;
  }

  /**
   * 建構當期 Top 5 觸發規則查詢
   * @param {Date} start - 開始時間
   * @param {Date} end - 結束時間
   * @returns {string} ES|QL 查詢語句
   */
  buildCurrentTriggerRuleQuery(start, end) {
    const startISO = start.toISOString();
    const endISO = end.toISOString();
    return `FROM ${this.indexPattern} | WHERE @timestamp >= "${startISO}" AND @timestamp <= "${endISO}" | STATS cnt = count(*) BY SecurityRuleDescription | SORT cnt DESC | LIMIT 5`;
  }

  /**
   * 建構上期 Top 5 觸發規則查詢
   * @param {Date} start - 開始時間
   * @param {Date} end - 結束時間
   * @param {string[]} ruleList - 當期 Top 5 規則列表
   * @returns {string} ES|QL 查詢語句
   */
  buildPreviousTriggerRuleQuery(start, end, ruleList) {
    const startISO = start.toISOString();
    const endISO = end.toISOString();
    const ruleFilter = ruleList.map((r) => `"${r}"`).join(',');
    return `FROM ${this.indexPattern} | WHERE @timestamp >= "${startISO}" AND @timestamp <= "${endISO}" | WHERE SecurityRuleDescription IN (${ruleFilter}) | STATS cnt = COUNT(*) BY SecurityRuleDescription | SORT cnt DESC`;
  }

  /**
   * 建構當期 Top 5 主機查詢
   * @param {Date} start - 開始時間
   * @param {Date} end - 結束時間
   * @returns {string} ES|QL 查詢語句
   */
  buildCurrentHostsQuery(start, end) {
    const startISO = start.toISOString();
    const endISO = end.toISOString();
    return `FROM ${this.indexPattern} | WHERE @timestamp >= "${startISO}" AND @timestamp <= "${endISO}" | STATS cnt = count(*) BY ClientRequestHost | SORT cnt DESC | LIMIT 5`;
  }

  /**
   * 建構上期 Top 5 主機查詢
   * @param {Date} start - 開始時間
   * @param {Date} end - 結束時間
   * @param {string[]} hostList - 當期 Top 5 主機列表
   * @returns {string} ES|QL 查詢語句
   */
  buildPreviousHostsQuery(start, end, hostList) {
    const startISO = start.toISOString();
    const endISO = end.toISOString();
    const hostFilter = hostList.map((h) => `"${h}"`).join(',');
    return `FROM ${this.indexPattern} | WHERE @timestamp >= "${startISO}" AND @timestamp <= "${endISO}" | WHERE ClientRequestHost IN (${hostFilter}) | STATS cnt = COUNT(*) BY ClientRequestHost | SORT cnt DESC`;
  }

  /**
   * 建構當期 Top 5 路徑查詢
   * @param {Date} start - 開始時間
   * @param {Date} end - 結束時間
   * @returns {string} ES|QL 查詢語句
   */
  buildCurrentPathQuery(start, end) {
    const startISO = start.toISOString();
    const endISO = end.toISOString();
    return `FROM ${this.indexPattern} | WHERE @timestamp >= "${startISO}" AND @timestamp <= "${endISO}" | STATS cnt = count(*) BY ClientRequestPath | SORT cnt DESC | LIMIT 5`;
  }

  /**
   * 建構上期 Top 5 路徑查詢
   * @param {Date} start - 開始時間
   * @param {Date} end - 結束時間
   * @param {string[]} pathList - 當期 Top 5 路徑列表
   * @returns {string} ES|QL 查詢語句
   */
  buildPreviousPathQuery(start, end, pathList) {
    const startISO = start.toISOString();
    const endISO = end.toISOString();
    const pathFilter = pathList.map((p) => `"${p}"`).join(',');
    return `FROM ${this.indexPattern} | WHERE @timestamp >= "${startISO}" AND @timestamp <= "${endISO}" | WHERE ClientRequestPath IN (${pathFilter}) | STATS cnt = COUNT(*) BY ClientRequestPath | SORT cnt DESC`;
  }

  /**
   * 建構當期 Top 5 國家查詢
   * @param {Date} start - 開始時間
   * @param {Date} end - 結束時間
   * @returns {string} ES|QL 查詢語句
   */
  buildCurrentCountryQuery(start, end) {
    const startISO = start.toISOString();
    const endISO = end.toISOString();
    return `FROM ${this.indexPattern} | WHERE @timestamp >= "${startISO}" AND @timestamp <= "${endISO}" | STATS cnt = count(*) BY geoip_client.country_name | SORT cnt DESC | LIMIT 5`;
  }

  /**
   * 建構上期 Top 5 國家查詢
   * @param {Date} start - 開始時間
   * @param {Date} end - 結束時間
   * @param {string[]} countryList - 當期 Top 5 國家列表
   * @returns {string} ES|QL 查詢語句
   */
  buildPreviousCountryQuery(start, end, countryList) {
    const startISO = start.toISOString();
    const endISO = end.toISOString();
    const countryFilter = countryList.map((c) => `"${c}"`).join(',');
    return `FROM ${this.indexPattern} | WHERE @timestamp >= "${startISO}" AND @timestamp <= "${endISO}" | WHERE geoip_client.country_name IN (${countryFilter}) | STATS cnt = COUNT(*) BY geoip_client.country_name | SORT cnt DESC`;
  }

  // ==================== ES|QL 查詢執行 ====================

  /**
   * 執行 ES|QL 查詢並解析結果
   * @param {string} query - ES|QL 查詢語句
   * @returns {Promise<Array>} 查詢結果陣列
   */
  async executeESQLQuery(query) {
    try {
      const result = await elkMCPClient.callHttpTool('esql', { query });

      // 解析 ES|QL 回應格式
      if (result.isError) {
        throw new Error(
          `ES|QL 查詢錯誤: ${result.content?.[0]?.text || 'Unknown error'}`,
        );
      }

      const responseText = result.content?.[0]?.text || '';
      const dataText = result.content?.[1]?.text || responseText;

      try {
        const parsed = JSON.parse(dataText);

        // ES|QL 回應格式：{ columns: [...], values: [...] }
        if (parsed.columns && parsed.values) {
          const columns = parsed.columns.map((col) => col.name || col);
          return parsed.values.map((row) => {
            const record = {};
            columns.forEach((col, idx) => {
              record[col] = row[idx];
            });
            return record;
          });
        } else if (Array.isArray(parsed)) {
          return parsed;
        } else {
          return [parsed];
        }
      } catch (parseError) {
        console.error('❌ ES|QL 回應解析失敗:', parseError.message);
        return [];
      }
    } catch (error) {
      console.error('❌ ES|QL 查詢執行失敗:', error.message);
      // 回傳空結果，不中斷整體查詢
      return [];
    }
  }

  /**
   * 從查詢結果中提取單一數值
   * @param {Array} results - 查詢結果陣列
   * @param {string} field - 欄位名稱
   * @param {number} defaultValue - 預設值
   * @returns {number}
   */
  extractSingleValue(results, field, defaultValue = 0) {
    if (!results || results.length === 0) return defaultValue;
    return results[0][field] || defaultValue;
  }

  // ==================== 多工並行查詢 ====================

  /**
   * 載入趨勢對比分析數據（主要進入點）
   * 使用多工並行查詢策略：
   * - 第一階段：19 個無依賴查詢並行執行
   * - 第二階段：5 個依賴查詢並行執行（需要第一階段的 Top 5 結果）
   * @param {string} timeRange - 時間範圍（1h, 6h, 1d, 3d, 7d, 14d, 30d）
   * @returns {Promise<Object>} 完整的趨勢分析回應
   */
  async loadTrendComparison(timeRange) {
    console.log(`\n🚀 開始載入趨勢對比分析（時間範圍: ${timeRange}）`);
    const startTime = Date.now();

    // 計算時間區間
    const timeRanges = this.calculateTimeRanges(timeRange);
    const { current, previous } = timeRanges;

    console.log(
      `📅 當期區間: ${current.start.toISOString()} - ${current.end.toISOString()}`,
    );
    console.log(
      `📅 上期區間: ${previous.start.toISOString()} - ${previous.end.toISOString()}`,
    );

    // ========== 第一階段：19 個查詢（分批並發執行，避免 429 錯誤） ==========
    console.log('\n⚡ 第一階段：執行 19 個查詢（分批並發，每批最多 5 個）...');
    const phase1Start = Date.now();

    // 建立查詢任務陣列（延遲執行）
    const phase1Tasks = [
      // 攻擊活動量（2 個）
      () =>
        this.executeESQLQuery(
          this.buildAttackCountQuery(current.start, current.end),
        ),
      () =>
        this.executeESQLQuery(
          this.buildAttackCountQuery(previous.start, previous.end),
        ),
      // HTTP 活動量（2 個）
      () =>
        this.executeESQLQuery(
          this.buildHttpVolumeQuery(current.start, current.end),
        ),
      () =>
        this.executeESQLQuery(
          this.buildHttpVolumeQuery(previous.start, previous.end),
        ),
      // 封鎖數（2 個）
      () =>
        this.executeESQLQuery(
          this.buildBlockCountQuery(current.start, current.end),
        ),
      () =>
        this.executeESQLQuery(
          this.buildBlockCountQuery(previous.start, previous.end),
        ),
      // 攻擊趨勢（2 個）
      () => {
        if (timeRange === '1h')
          return this.executeESQLQuery(
            this.buildAttackTrendQuery10Minute(current.start, current.end),
          );
        if (timeRange === '6h')
          return this.executeESQLQuery(
            this.buildAttackTrendQuery30Minute(current.start, current.end),
          );
        if (timeRange === '14d')
          return this.executeESQLQuery(
            this.buildAttackTrendQuery1Day(current.start, current.end),
          );
        if (timeRange === '30d')
          return this.executeESQLQuery(
            this.buildAttackTrendQuery3Day(current.start, current.end),
          );
        return this.executeESQLQuery(
          this.buildAttackTrendQueryHour(current.start, current.end),
        );
      },
      () => {
        if (timeRange === '1h')
          return this.executeESQLQuery(
            this.buildAttackTrendQuery10Minute(previous.start, previous.end),
          );
        if (timeRange === '6h')
          return this.executeESQLQuery(
            this.buildAttackTrendQuery30Minute(previous.start, previous.end),
          );
        if (timeRange === '14d')
          return this.executeESQLQuery(
            this.buildAttackTrendQuery1Day(previous.start, previous.end),
          );
        if (timeRange === '30d')
          return this.executeESQLQuery(
            this.buildAttackTrendQuery3Day(previous.start, previous.end),
          );
        return this.executeESQLQuery(
          this.buildAttackTrendQueryHour(previous.start, previous.end),
        );
      },
      // 資料傳送量（2 個）
      () =>
        this.executeESQLQuery(
          this.buildDataVolumeQuery(current.start, current.end),
        ),
      () =>
        this.executeESQLQuery(
          this.buildDataVolumeQuery(previous.start, previous.end),
        ),
      // 頁面瀏覽次數（2 個）
      () =>
        this.executeESQLQuery(
          this.buildPageViewQuery(current.start, current.end),
        ),
      () =>
        this.executeESQLQuery(
          this.buildPageViewQuery(previous.start, previous.end),
        ),
      // 造訪次數（2 個）
      () =>
        this.executeESQLQuery(
          this.buildVisitsQuery(current.start, current.end),
        ),
      () =>
        this.executeESQLQuery(
          this.buildVisitsQuery(previous.start, previous.end),
        ),
      // 當期 Top 5（5 個）
      () =>
        this.executeESQLQuery(
          this.buildCurrentSourceIPQuery(current.start, current.end),
        ),
      () =>
        this.executeESQLQuery(
          this.buildCurrentTriggerRuleQuery(current.start, current.end),
        ),
      () =>
        this.executeESQLQuery(
          this.buildCurrentHostsQuery(current.start, current.end),
        ),
      () =>
        this.executeESQLQuery(
          this.buildCurrentPathQuery(current.start, current.end),
        ),
      () =>
        this.executeESQLQuery(
          this.buildCurrentCountryQuery(current.start, current.end),
        ),
    ];

    // 使用限流器分批執行
    const phase1Results = await this.limiter.runAll(phase1Tasks);

    // 解構結果
    const [
      currentAttackResult,
      previousAttackResult,
      currentHttpResult,
      previousHttpResult,
      currentBlockResult,
      previousBlockResult,
      currentTrendResult,
      previousTrendResult,
      currentDataResult,
      previousDataResult,
      currentPageViewResult,
      previousPageViewResult,
      currentVisitsResult,
      previousVisitsResult,
      currentSourceIPResult,
      currentTriggerRuleResult,
      currentHostsResult,
      currentPathResult,
      currentCountryResult,
    ] = phase1Results;

    console.log(`✅ 第一階段完成，耗時 ${Date.now() - phase1Start}ms`);

    // 提取當期 Top 5 列表（用於第二階段查詢）
    const currentIPList = currentSourceIPResult
      .map((r) => r.ClientIP)
      .filter(Boolean);
    const currentRuleList = currentTriggerRuleResult.map(
      (r) => r.SecurityRuleDescription,
    );
    const currentHostList = currentHostsResult
      .map((r) => r.ClientRequestHost)
      .filter(Boolean);
    const currentPathList = currentPathResult
      .map((r) => r.ClientRequestPath)
      .filter(Boolean);
    const currentCountryList = currentCountryResult
      .map((r) => r['geoip_client.country_name'])
      .filter(Boolean);

    // ========== 第二階段：5 個查詢（分批並發執行） ==========
    console.log('\n⚡ 第二階段：執行 5 個查詢（上期 Top 5，分批並發）...');
    const phase2Start = Date.now();

    // 建立第二階段查詢任務
    const phase2Tasks = [
      () =>
        currentIPList.length > 0
          ? this.executeESQLQuery(
            this.buildPreviousSourceIPQuery(
              previous.start,
              previous.end,
              currentIPList,
            ),
          )
          : Promise.resolve([]),
      () =>
        currentRuleList.length > 0
          ? this.executeESQLQuery(
            this.buildPreviousTriggerRuleQuery(
              previous.start,
              previous.end,
              currentRuleList,
            ),
          )
          : Promise.resolve([]),
      () =>
        currentHostList.length > 0
          ? this.executeESQLQuery(
            this.buildPreviousHostsQuery(
              previous.start,
              previous.end,
              currentHostList,
            ),
          )
          : Promise.resolve([]),
      () =>
        currentPathList.length > 0
          ? this.executeESQLQuery(
            this.buildPreviousPathQuery(
              previous.start,
              previous.end,
              currentPathList,
            ),
          )
          : Promise.resolve([]),
      () =>
        currentCountryList.length > 0
          ? this.executeESQLQuery(
            this.buildPreviousCountryQuery(
              previous.start,
              previous.end,
              currentCountryList,
            ),
          )
          : Promise.resolve([]),
    ];

    // 使用限流器分批執行
    const [
      previousSourceIPResult,
      previousTriggerRuleResult,
      previousHostsResult,
      previousPathResult,
      previousCountryResult,
    ] = await this.limiter.runAll(phase2Tasks);

    console.log(`✅ 第二階段完成，耗時 ${Date.now() - phase2Start}ms`);

    // ========== 組裝回應 ==========
    console.log('\n📦 組裝回應數據...');

    // 提取數值
    const currentAttack = this.extractSingleValue(currentAttackResult, 'count');
    const previousAttack = this.extractSingleValue(
      previousAttackResult,
      'count',
    );
    const currentHttp = this.extractSingleValue(currentHttpResult, 'count');
    const previousHttp = this.extractSingleValue(previousHttpResult, 'count');
    const currentBlock = this.extractSingleValue(currentBlockResult, 'count');
    const previousBlock = this.extractSingleValue(previousBlockResult, 'count');
    const currentData = this.extractSingleValue(
      currentDataResult,
      'totalBytes',
    );
    const previousData = this.extractSingleValue(
      previousDataResult,
      'totalBytes',
    );
    const currentPageView = this.extractSingleValue(
      currentPageViewResult,
      'count',
    );
    const previousPageView = this.extractSingleValue(
      previousPageViewResult,
      'count',
    );
    const currentVisits = this.extractSingleValue(currentVisitsResult, 'count');
    const previousVisits = this.extractSingleValue(
      previousVisitsResult,
      'count',
    );

    // 計算衍生指標
    const currentHttpPct = this.ratioPct(currentAttack, currentHttp);
    const previousHttpPct = this.ratioPct(previousAttack, previousHttp);
    const currentLockdownRate = this.ratioPct(currentBlock, currentAttack);
    const previousLockdownRate = this.ratioPct(previousBlock, previousAttack);

    // 建立上期 Top 5 查找表（用於快速對比）
    const previousIPMap = new Map(
      previousSourceIPResult.map((r) => [r.ClientIP, r.cnt]),
    );
    const previousRuleMap = new Map(
      previousTriggerRuleResult.map((r) => [r.SecurityRuleDescription, r.cnt]),
    );
    const previousHostMap = new Map(
      previousHostsResult.map((r) => [r.ClientRequestHost, r.cnt]),
    );
    const previousPathMap = new Map(
      previousPathResult.map((r) => [r.ClientRequestPath, r.cnt]),
    );
    const previousCountryMap = new Map(
      previousCountryResult.map((r) => [r['geoip_client.country_name'], r.cnt]),
    );

    // 組裝最終回應（符合 trend_GUIDE.md 規格）
    const response = {
      success: true,

      // 攻擊活動量
      totalAttack: {
        quantity: currentAttack,
        change: this.pctChange(currentAttack, previousAttack),
      },

      // HTTP 攻擊佔比（0~100 百分比）
      httpPct: {
        quantity: this.round2(currentHttpPct),
        change: this.pctChange(currentHttpPct, previousHttpPct),
      },

      // 封鎖成功率（0~100 百分比）
      lockdownRate: {
        quantity: this.round2(currentLockdownRate),
        change: this.pctChange(currentLockdownRate, previousLockdownRate),
      },

      // 當期攻擊趨勢（依小時彙總）
      currentAttackTrend: currentTrendResult.map((r) => ({
        hour: r.hour,
        count: r.count || 0,
      })),

      // 上期攻擊趨勢（依小時彙總）
      previousAttackTrend: previousTrendResult.map((r) => ({
        hour: r.hour,
        count: r.count || 0,
      })),

      // HTTP 流量
      httpVolume: {
        quantity: this.formatCount(currentHttp),
        change: this.pctChange(currentHttp, previousHttp),
      },

      // 資料量
      dataVolume: {
        quantity: this.formatBytes(currentData),
        change: this.pctChange(currentData, previousData),
      },

      // 頁面瀏覽次數
      pageView: {
        quantity: this.formatCount(currentPageView),
        change: this.pctChange(currentPageView, previousPageView),
      },

      // 造訪次數
      visits: {
        quantity: this.formatCount(currentVisits),
        change: this.pctChange(currentVisits, previousVisits),
      },

      // 來源 IP Top 5
      sourceIP: currentSourceIPResult.map((r) => ({
        ClientIP: r.ClientIP,
        cnt: r.cnt,
        change: this.pctChange(r.cnt, previousIPMap.get(r.ClientIP) || 0),
      })),

      // 觸發規則 Top 5
      triggerRule: currentTriggerRuleResult.map((r) => ({
        SecurityRuleDescription: r.SecurityRuleDescription,
        cnt: r.cnt,
        change: this.pctChange(
          r.cnt,
          previousRuleMap.get(r.SecurityRuleDescription) || 0,
        ),
      })),

      // 主機 Top 5
      hosts: currentHostsResult.map((r) => ({
        ClientRequestHost: r.ClientRequestHost,
        cnt: r.cnt,
        change: this.pctChange(
          r.cnt,
          previousHostMap.get(r.ClientRequestHost) || 0,
        ),
      })),

      // 路徑 Top 5
      path: currentPathResult.map((r) => ({
        ClientRequestPath: r.ClientRequestPath,
        cnt: r.cnt,
        change: this.pctChange(
          r.cnt,
          previousPathMap.get(r.ClientRequestPath) || 0,
        ),
      })),

      // 國家 Top 5
      country: currentCountryResult.map((r) => ({
        'geoip_client.country_name': r['geoip_client.country_name'],
        cnt: r.cnt,
        change: this.pctChange(
          r.cnt,
          previousCountryMap.get(r['geoip_client.country_name']) || 0,
        ),
      })),

      // 預留擴展欄位
      other: {},
    };

    const totalTime = Date.now() - startTime;
    console.log(`\n✅ 趨勢對比分析完成，總耗時 ${totalTime}ms`);
    console.log(
      `   攻擊活動量: ${currentAttack} (${response.totalAttack.change}%)`,
    );
    console.log(`   HTTP 流量: ${response.httpVolume.quantity}`);
    console.log(`   資料量: ${response.dataVolume.quantity}`);

    return response;
  }

  /**
   * 取得支援的時間範圍列表
   * @returns {string[]} 時間範圍列表
   */
  getValidTimeRanges() {
    return Object.keys(this.TIME_RANGES);
  }

  // ==================== AI 趨勢分析功能 ====================

  /**
   * 建構趨勢分析提示詞
   * @param {Object} response - 趨勢對比回應
   * @returns {string} 提示詞字串
   */
  buildTrendAnalysisPrompt(response) {
    return `
請基於以下趨勢對比資料進行分析：

**攻擊活動量對比:**
- 當前時期攻擊量: ${response.totalAttack.quantity} (${response.totalAttack.change}% 變化)
- HTTP 攻擊佔比: ${response.httpPct.quantity}% (${response.httpPct.change}% 變化)
- 封鎖成功率: ${response.lockdownRate.quantity}% (${response.lockdownRate.change}% 變化)

**HTTP 流量對比:**
- 當前時期: ${response.httpVolume.quantity} (${response.httpVolume.change}% 變化)
- 資料量: ${response.dataVolume.quantity} (${response.dataVolume.change}% 變化)
- 頁面瀏覽: ${response.pageView.quantity} (${response.pageView.change}% 變化)
- 造訪次數: ${response.visits.quantity} (${response.visits.change}% 變化)

**來源 IP Top 5 對比:**
${response.sourceIP
        .map(
          (ip, idx) =>
            `${idx + 1}. ${ip.ClientIP}: ${ip.cnt} 次 (${ip.change}% 變化)`,
        )
        .join('\n')}

**觸發規則 Top 5 對比:**
${response.triggerRule
        .map(
          (rule, idx) =>
            `${idx + 1}. ${rule.SecurityRuleDescription}: ${rule.cnt} 次 (${rule.change}% 變化)`,
        )
        .join('\n')}

**主機 Top 5 對比:**
${response.hosts
        .map(
          (host, idx) =>
            `${idx + 1}. ${host.ClientRequestHost}: ${host.cnt} 次 (${host.change}% 變化)`,
        )
        .join('\n')}

**路徑 Top 5 對比:**
${response.path
        .map(
          (path, idx) =>
            `${idx + 1}. ${path.ClientRequestPath}: ${path.cnt} 次 (${path.change}% 變化)`,
        )
        .join('\n')}

**國家 Top 5 對比:**
${response.country
        .map(
          (country, idx) =>
            `${idx + 1}. ${country['geoip_client.country_name']}: ${country.cnt} 次 (${country.change}% 變化)`,
        )
        .join('\n')}

**請分析以下面向:**
1. **整體攻擊活動趨勢**：分析攻擊量、HTTP 流量、封鎖率的變化趨勢
2. **流量模式變化**：分析 HTTP 流量、資料量、頁面瀏覽、造訪次數的變化
3. **來源變化分析**：分析 Top 5 IP、觸發規則、主機、路徑、國家的變化
4. **異常模式識別**：識別新增的威脅源、消失的攻擊路徑等異常行為
5. **潛在安全威脅**：基於趨勢評估潛在的安全風險
6. **建議的監控和防護措施**：提供具體的、可執行的防護建議

請以繁體中文回答，並提供具體的數據支撐和可執行的建議。
`;
  }

  /**
   * 將比較回應轉換為提示詞格式
   * @param {Object} comparisonResponse - 趨勢對比回應
   * @returns {Object} 轉換後的格式
   */
  convertToPromptFormat(comparisonResponse) {
    return {
      period: {
        start: new Date(),
        end: new Date(),
        label: '當前時期',
      },
      totalRequestTraffic: this.parseFormattedValue(
        comparisonResponse.dataVolume.quantity,
      ),
      totalRequests: this.parseFormattedValue(
        comparisonResponse.httpVolume.quantity,
      ),
      uniqueIPs: 0,
      attackIPs: 0,
      topTrafficIPs: comparisonResponse.sourceIP.map((item) => ({
        ip: item.ClientIP,
        traffic: this.parseFormattedValue(item.cnt),
        requests: item.cnt,
        country: 'N/A',
        asn: 'N/A',
      })),
    };
  }

  /**
   * 解析格式化數值（如 "129.99K" 轉為整數）
   * @param {string} formattedValue - 格式化的數值字串
   * @returns {number} 數值
   */
  parseFormattedValue(formattedValue) {
    if (!formattedValue || typeof formattedValue !== 'string') {
      return 0;
    }

    const valueStr = formattedValue.toUpperCase();
    const num = parseFloat(valueStr);

    if (valueStr.includes('K')) {
      return Math.round(num * 1000);
    } else if (valueStr.includes('M')) {
      return Math.round(num * 1000 * 1000);
    } else if (valueStr.includes('B')) {
      return Math.round(num * 1024 * 1024 * 1024);
    }

    return Math.round(num);
  }

  /**
   * 執行 AI 分析（使用 OpenAI 相容 API 格式）
   * @param {Object} params - AI 參數
   * @returns {Promise<Object>} AI 分析結果
   */
  async performAIAnalysis(params) {
    const { aiProvider, apiKey, model, promptData } = params;
    const analysisId = Math.random().toString(36).substr(2, 9);
    const timestamp = new Date().toISOString();
    const useModel = model || (aiProvider === 'gemini' ? 'gemini-2.5-flash' : 'llama3');
    const serviceUrl = process.env.LLM_SERVICE_URL;
    const useApiKey = apiKey || process.env.LLM_API_KEY;

    console.log(`\n🤖 開始 AI 趨勢分析...`);
    console.log(`   AI 提供商: ${aiProvider}`);
    console.log(`   模型: ${useModel}`);
    console.log(`   API URL: ${serviceUrl}`);

    if (!serviceUrl) {
      console.error('❌ 未設定 LLM_SERVICE_URL');
      return {
        success: false,
        error: '請設定 LLM_SERVICE_URL 環境變數',
        metadata: { analysisId, timestamp, model: useModel, aiProvider },
      };
    }

    try {
      let trendAnalysis;
      let responseTime;

      // 使用 OpenAI 相容 API（統一格式）
      console.log(`   使用 OpenAI 相容 API`);

      /** @type {import("openai").default} */
      const openai = new OpenAI({
        baseURL: serviceUrl,
        apiKey: useApiKey,
      });

      // 設定 5 分鐘超時
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        console.error(`❌ ${aiProvider} 請求超時（5 分鐘）`);
      }, 300000);

      const startTime = Date.now();
      console.log(`⏱️ 開始呼叫 ${aiProvider} API...`);

      // 構建請求參數
      const requestParams = {
        model: useModel,
        messages: [
          {
            role: 'system',
            content: '你是個資安專家，專精於分析網路流量趨勢和威脅識別。請根據提供的資料，分析趨勢變化並提供建議。',
          },
          {
            role: 'user',
            content: promptData,
          },
        ],
      };

      // 📤 記錄完整請求訊息
      logOpenAICompatibleRequest(serviceUrl, requestParams);

      const completion = await openai.chat.completions.create(
        requestParams,
        { signal: controller.signal },
      );

      clearTimeout(timeoutId);
      const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(`⏱️ ${aiProvider} API 回應時間: ${elapsedTime} 秒`);

      // 📥 記錄完整回應訊息
      logOpenAICompatibleResponse(completion, elapsedTime);

      trendAnalysis = completion.choices[0]?.message?.content || '';
      responseTime = Math.round(Date.now() - startTime);

      if (!trendAnalysis || trendAnalysis.trim().length === 0) {
        console.warn(`⚠️ ${aiProvider} 返回空回應`);
        throw new Error(`${aiProvider} 返回空回應`);
      }

      console.log(`✅ ${aiProvider} 分析完成，耗時 ${responseTime}ms`);

      return {
        success: true,
        trendAnalysis,
        metadata: {
          analysisId,
          timestamp,
          model: useModel,
          aiProvider,
          isAIGenerated: true,
          analysisType: 'traffic_trend_comparison',
          responseTime,
          promptLength: promptData.length,
        },
      };
    } catch (error) {
      // 處理超時錯誤
      if (error.name === 'AbortError') {
        console.error(`❌ ${aiProvider} 請求超時（5 分鐘）`);
        return {
          success: false,
          error: 'AI 分析請求超時（5 分鐘）',
          metadata: { analysisId, timestamp, model: useModel, aiProvider },
        };
      }

      // 處理 429 Rate Limit 錯誤
      if (error.status === 429) {
        console.error(`❌ ${aiProvider} API 達到速率限制 (429)`);
        return {
          success: false,
          error: 'AI API 達到速率限制，請稍後再試',
          metadata: { analysisId, timestamp, model: useModel, aiProvider },
        };
      }

      console.error('❌ AI 趨勢分析失敗:', error);
      return {
        success: false,
        error: error.message,
        metadata: {
          analysisId,
          timestamp,
          model: useModel,
          aiProvider,
        },
      };
    }
  }
}

module.exports = TrendAnalysisService;
