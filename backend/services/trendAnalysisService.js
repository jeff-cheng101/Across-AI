// backend/services/trendAnalysisService.js
// Cloudflare 趨勢對比分析服務
// 使用 ES|QL 聚合查詢 + 多工並行查詢策略

const { elkMCPClient } = require('./elkMCPClient');
const cloudflareELKConfig = require('../config/products/cloudflare/cloudflareELKConfig');

/**
 * Cloudflare 趨勢分析服務類別
 * 提供趨勢對比分析的核心邏輯，包含：
 * - 時間區間計算
 * - ES|QL 查詢建構
 * - 多工並行查詢執行
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
      '14d': { ms: 14 * 24 * 60 * 60 * 1000, label: '14天' },  // 新增 14d 支援
      '30d': { ms: 30 * 24 * 60 * 60 * 1000, label: '30天' }
    };

    // 取得趨勢分析專用索引模式
    this.indexPattern = cloudflareELKConfig.trendIndex || cloudflareELKConfig.index;
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
      throw new Error(`不支援的時間範圍: ${timeRange}。支援: ${Object.keys(this.TIME_RANGES).join(', ')}`);
    }

    const now = new Date();
    const duration = config.ms;

    return {
      current: {
        start: new Date(now.getTime() - duration),
        end: now
      },
      previous: {
        start: new Date(now.getTime() - duration * 2),
        end: new Date(now.getTime() - duration)
      }
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
  buildAttackTrendQuery(start, end) {
    const startISO = start.toISOString();
    const endISO = end.toISOString();
    return `FROM ${this.indexPattern} | WHERE @timestamp >= "${startISO}" AND @timestamp <= "${endISO}" | WHERE SecurityAction.keyword IN ("jschallenge", "block", "managedChallenge") | EVAL hour = DATE_TRUNC(1 hour, @timestamp) | STATS count = COUNT(*) BY hour | SORT hour ASC | KEEP hour, count`;
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
    const ipFilter = ipList.map(ip => `"${ip}"`).join(',');
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
    const ruleFilter = ruleList.map(r => `"${r}"`).join(',');
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
    const hostFilter = hostList.map(h => `"${h}"`).join(',');
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
    const pathFilter = pathList.map(p => `"${p}"`).join(',');
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
    return `FROM ${this.indexPattern} | WHERE @timestamp >= "${startISO}" AND @timestamp <= "${endISO}" | STATS cnt = count(*) BY geoip.geo.country_name | SORT cnt DESC | LIMIT 5`;
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
    const countryFilter = countryList.map(c => `"${c}"`).join(',');
    return `FROM ${this.indexPattern} | WHERE @timestamp >= "${startISO}" AND @timestamp <= "${endISO}" | WHERE geoip.geo.country_name IN (${countryFilter}) | STATS cnt = COUNT(*) BY geoip.geo.country_name | SORT cnt DESC`;
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
        throw new Error(`ES|QL 查詢錯誤: ${result.content?.[0]?.text || 'Unknown error'}`);
      }

      const responseText = result.content?.[0]?.text || '';
      const dataText = result.content?.[1]?.text || responseText;

      try {
        const parsed = JSON.parse(dataText);
        
        // ES|QL 回應格式：{ columns: [...], values: [...] }
        if (parsed.columns && parsed.values) {
          const columns = parsed.columns.map(col => col.name || col);
          return parsed.values.map(row => {
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

    console.log(`📅 當期區間: ${current.start.toISOString()} - ${current.end.toISOString()}`);
    console.log(`📅 上期區間: ${previous.start.toISOString()} - ${previous.end.toISOString()}`);

    // ========== 第一階段：19 個查詢並行執行 ==========
    console.log('\n⚡ 第一階段：執行 19 個並行查詢...');
    const phase1Start = Date.now();

    const [
      // 攻擊活動量（2 個）
      currentAttackResult,
      previousAttackResult,
      // HTTP 活動量（2 個）
      currentHttpResult,
      previousHttpResult,
      // 封鎖數（2 個）
      currentBlockResult,
      previousBlockResult,
      // 攻擊趨勢（2 個）
      currentTrendResult,
      previousTrendResult,
      // 資料傳送量（2 個）
      currentDataResult,
      previousDataResult,
      // 頁面瀏覽次數（2 個）
      currentPageViewResult,
      previousPageViewResult,
      // 造訪次數（2 個）
      currentVisitsResult,
      previousVisitsResult,
      // 當期 Top 5（5 個）
      currentSourceIPResult,
      currentTriggerRuleResult,
      currentHostsResult,
      currentPathResult,
      currentCountryResult
    ] = await Promise.all([
      // 攻擊活動量
      this.executeESQLQuery(this.buildAttackCountQuery(current.start, current.end)),
      this.executeESQLQuery(this.buildAttackCountQuery(previous.start, previous.end)),
      // HTTP 活動量
      this.executeESQLQuery(this.buildHttpVolumeQuery(current.start, current.end)),
      this.executeESQLQuery(this.buildHttpVolumeQuery(previous.start, previous.end)),
      // 封鎖數
      this.executeESQLQuery(this.buildBlockCountQuery(current.start, current.end)),
      this.executeESQLQuery(this.buildBlockCountQuery(previous.start, previous.end)),
      // 攻擊趨勢
      this.executeESQLQuery(this.buildAttackTrendQuery(current.start, current.end)),
      this.executeESQLQuery(this.buildAttackTrendQuery(previous.start, previous.end)),
      // 資料傳送量
      this.executeESQLQuery(this.buildDataVolumeQuery(current.start, current.end)),
      this.executeESQLQuery(this.buildDataVolumeQuery(previous.start, previous.end)),
      // 頁面瀏覽次數
      this.executeESQLQuery(this.buildPageViewQuery(current.start, current.end)),
      this.executeESQLQuery(this.buildPageViewQuery(previous.start, previous.end)),
      // 造訪次數
      this.executeESQLQuery(this.buildVisitsQuery(current.start, current.end)),
      this.executeESQLQuery(this.buildVisitsQuery(previous.start, previous.end)),
      // 當期 Top 5
      this.executeESQLQuery(this.buildCurrentSourceIPQuery(current.start, current.end)),
      this.executeESQLQuery(this.buildCurrentTriggerRuleQuery(current.start, current.end)),
      this.executeESQLQuery(this.buildCurrentHostsQuery(current.start, current.end)),
      this.executeESQLQuery(this.buildCurrentPathQuery(current.start, current.end)),
      this.executeESQLQuery(this.buildCurrentCountryQuery(current.start, current.end))
    ]);

    console.log(`✅ 第一階段完成，耗時 ${Date.now() - phase1Start}ms`);

    // 提取當期 Top 5 列表（用於第二階段查詢）
    const currentIPList = currentSourceIPResult.map(r => r.ClientIP).filter(Boolean);
    const currentRuleList = currentTriggerRuleResult.map(r => r.SecurityRuleDescription);
    const currentHostList = currentHostsResult.map(r => r.ClientRequestHost).filter(Boolean);
    const currentPathList = currentPathResult.map(r => r.ClientRequestPath).filter(Boolean);
    const currentCountryList = currentCountryResult.map(r => r['geoip.geo.country_name']).filter(Boolean);

    // ========== 第二階段：5 個查詢並行執行 ==========
    console.log('\n⚡ 第二階段：執行 5 個並行查詢（上期 Top 5）...');
    const phase2Start = Date.now();

    const [
      previousSourceIPResult,
      previousTriggerRuleResult,
      previousHostsResult,
      previousPathResult,
      previousCountryResult
    ] = await Promise.all([
      currentIPList.length > 0 
        ? this.executeESQLQuery(this.buildPreviousSourceIPQuery(previous.start, previous.end, currentIPList))
        : Promise.resolve([]),
      currentRuleList.length > 0 
        ? this.executeESQLQuery(this.buildPreviousTriggerRuleQuery(previous.start, previous.end, currentRuleList))
        : Promise.resolve([]),
      currentHostList.length > 0 
        ? this.executeESQLQuery(this.buildPreviousHostsQuery(previous.start, previous.end, currentHostList))
        : Promise.resolve([]),
      currentPathList.length > 0 
        ? this.executeESQLQuery(this.buildPreviousPathQuery(previous.start, previous.end, currentPathList))
        : Promise.resolve([]),
      currentCountryList.length > 0 
        ? this.executeESQLQuery(this.buildPreviousCountryQuery(previous.start, previous.end, currentCountryList))
        : Promise.resolve([])
    ]);

    console.log(`✅ 第二階段完成，耗時 ${Date.now() - phase2Start}ms`);

    // ========== 組裝回應 ==========
    console.log('\n📦 組裝回應數據...');

    // 提取數值
    const currentAttack = this.extractSingleValue(currentAttackResult, 'count');
    const previousAttack = this.extractSingleValue(previousAttackResult, 'count');
    const currentHttp = this.extractSingleValue(currentHttpResult, 'count');
    const previousHttp = this.extractSingleValue(previousHttpResult, 'count');
    const currentBlock = this.extractSingleValue(currentBlockResult, 'count');
    const previousBlock = this.extractSingleValue(previousBlockResult, 'count');
    const currentData = this.extractSingleValue(currentDataResult, 'totalBytes');
    const previousData = this.extractSingleValue(previousDataResult, 'totalBytes');
    const currentPageView = this.extractSingleValue(currentPageViewResult, 'count');
    const previousPageView = this.extractSingleValue(previousPageViewResult, 'count');
    const currentVisits = this.extractSingleValue(currentVisitsResult, 'count');
    const previousVisits = this.extractSingleValue(previousVisitsResult, 'count');

    // 計算衍生指標
    const currentHttpPct = this.ratioPct(currentAttack, currentHttp);
    const previousHttpPct = this.ratioPct(previousAttack, previousHttp);
    const currentLockdownRate = this.ratioPct(currentBlock, currentAttack);
    const previousLockdownRate = this.ratioPct(previousBlock, previousAttack);

    // 建立上期 Top 5 查找表（用於快速對比）
    const previousIPMap = new Map(previousSourceIPResult.map(r => [r.ClientIP, r.cnt]));
    const previousRuleMap = new Map(previousTriggerRuleResult.map(r => [r.SecurityRuleDescription, r.cnt]));
    const previousHostMap = new Map(previousHostsResult.map(r => [r.ClientRequestHost, r.cnt]));
    const previousPathMap = new Map(previousPathResult.map(r => [r.ClientRequestPath, r.cnt]));
    const previousCountryMap = new Map(previousCountryResult.map(r => [r['geoip.geo.country_name'], r.cnt]));

    // 組裝最終回應（符合 trend_GUIDE.md 規格）
    const response = {
      success: true,

      // 攻擊活動量
      totalAttack: {
        quantity: currentAttack,
        change: this.pctChange(currentAttack, previousAttack)
      },

      // HTTP 攻擊佔比（0~100 百分比）
      httpPct: {
        quantity: this.round2(currentHttpPct),
        change: this.pctChange(currentHttpPct, previousHttpPct)
      },

      // 封鎖成功率（0~100 百分比）
      lockdownRate: {
        quantity: this.round2(currentLockdownRate),
        change: this.pctChange(currentLockdownRate, previousLockdownRate)
      },

      // 當期攻擊趨勢（依小時彙總）
      currentAttackTrend: currentTrendResult.map(r => ({
        hour: r.hour,
        count: r.count || 0
      })),

      // 上期攻擊趨勢（依小時彙總）
      previousAttackTrend: previousTrendResult.map(r => ({
        hour: r.hour,
        count: r.count || 0
      })),

      // HTTP 流量
      httpVolume: {
        quantity: this.formatCount(currentHttp),
        change: this.pctChange(currentHttp, previousHttp)
      },

      // 資料量
      dataVolume: {
        quantity: this.formatBytes(currentData),
        change: this.pctChange(currentData, previousData)
      },

      // 頁面瀏覽次數
      pageView: {
        quantity: this.formatCount(currentPageView),
        change: this.pctChange(currentPageView, previousPageView)
      },

      // 造訪次數
      visits: {
        quantity: this.formatCount(currentVisits),
        change: this.pctChange(currentVisits, previousVisits)
      },

      // 來源 IP Top 5
      sourceIP: currentSourceIPResult.map(r => ({
        ClientIP: r.ClientIP,
        cnt: r.cnt,
        change: this.pctChange(r.cnt, previousIPMap.get(r.ClientIP) || 0)
      })),

      // 觸發規則 Top 5
      triggerRule: currentTriggerRuleResult.map(r => ({
        SecurityRuleDescription: r.SecurityRuleDescription,
        cnt: r.cnt,
        change: this.pctChange(r.cnt, previousRuleMap.get(r.SecurityRuleDescription) || 0)
      })),

      // 主機 Top 5
      hosts: currentHostsResult.map(r => ({
        ClientRequestHost: r.ClientRequestHost,
        cnt: r.cnt,
        change: this.pctChange(r.cnt, previousHostMap.get(r.ClientRequestHost) || 0)
      })),

      // 路徑 Top 5
      path: currentPathResult.map(r => ({
        ClientRequestPath: r.ClientRequestPath,
        cnt: r.cnt,
        change: this.pctChange(r.cnt, previousPathMap.get(r.ClientRequestPath) || 0)
      })),

      // 國家 Top 5
      country: currentCountryResult.map(r => ({
        'geoip.geo.country_name': r['geoip.geo.country_name'],
        cnt: r.cnt,
        change: this.pctChange(r.cnt, previousCountryMap.get(r['geoip.geo.country_name']) || 0)
      })),

      // 預留擴展欄位
      other: {}
    };

    const totalTime = Date.now() - startTime;
    console.log(`\n✅ 趨勢對比分析完成，總耗時 ${totalTime}ms`);
    console.log(`   攻擊活動量: ${currentAttack} (${response.totalAttack.change}%)`);
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
}

module.exports = TrendAnalysisService;
