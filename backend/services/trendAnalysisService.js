// backend/services/trendAnalysisService.js
// Cloudflare 趨勢對比分析服務
// 使用 Query DSL 聚合查詢 + 多工並行查詢策略（含請求限流）
// 直接連接 Elasticsearch REST API（不透過 MCP）

const cloudflareELKConfig = require('../config/products/cloudflare/cloudflareELKConfig');
const { ELK_CONFIG } = require('../config/elkConfig');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const OpenAI = require('openai');
let UndiciAgent = null;
try {
  ({ Agent: UndiciAgent } = require('undici'));
} catch (_error) {
  // 保持相容：若 undici 不可用則略過
}
const {
  logOpenAICompatibleRequest,
  logOpenAICompatibleResponse,
} = require('../utils/ollamaLogger');

// 使用 Node.js 內建的 fetch（Node.js 18+）或 node-fetch
const fetch = globalThis.fetch;

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
     * Elasticsearch 直連配置（不透過 MCP）
     * - elkHost: Elasticsearch 主機 URL
     * - elkApiKey: Elasticsearch API Key
     */
    this.elkHost = ELK_CONFIG.elasticsearch?.host;
    this.elkApiKey = ELK_CONFIG.elasticsearch?.apiKey;

    if (!this.elkHost) {
      throw new Error('❌ 未設定 ELK_HOST 環境變數');
    }

    console.log(`🔗 Elasticsearch 直連配置：${this.elkHost}`);
    console.log(`📂 索引模式：${this.indexPattern}`);

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

    /**
     * 欄位映射快取
     * 儲存每個欄位的正確名稱（原始名稱或 .keyword 版本）
     * @type {Map<string, string>}
     */
    this.fieldMappingCache = new Map();

    /**
     * 欄位映射是否已初始化
     * @type {boolean}
     */
    this.fieldMappingInitialized = false;

    /**
     * 需要檢查的欄位列表（用於聚合和精確匹配）
     * @type {string[]}
     */
    this.fieldsToCheck = [
      'ClientIP',
      'SecurityRuleDescription',
      'ClientRequestHost',
      'ClientRequestPath',
      'geoip_client.country_name',
      'SecurityAction',
      'EdgeResponseContentType',
      'ClientRequestReferer',
    ];

    /**
     * 是否允許 Elasticsearch 使用不受信任的 TLS 憑證
     * @type {boolean}
     */
    this.elkAllowInsecureTls =
      process.env.ELK_INSECURE_TLS === 'true' ||
      process.env.NODE_TLS_REJECT_UNAUTHORIZED === '0';

    if (this.elkAllowInsecureTls && !UndiciAgent) {
      console.warn('⚠️ 無法載入 undici，將無法關閉 TLS 驗證');
    }
  }

  /**
   * 組合 Elasticsearch fetch 參數
   * @param {string} method - HTTP 方法
   * @param {Object} headers - HTTP headers
   * @param {Object} body - 請求內容
   * @returns {Object} fetch 參數
   */
  buildElkFetchOptions(method, headers, body) {
    const options = {
      method,
      headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    if (this.elkAllowInsecureTls && UndiciAgent) {
      options.dispatcher = new UndiciAgent({
        connect: { rejectUnauthorized: false },
      });
    }

    return options;
  }

  // ==================== Elasticsearch 直連 API ====================

  /**
   * 直接呼叫 Elasticsearch REST API
   * @param {string} endpoint - API 端點（如 '_search' 或 '_count'）
   * @param {Object} body - 請求內容
   * @returns {Promise<Object>} Elasticsearch 回應
   */
  async callElasticsearchAPI(endpoint, body) {
    const url = `${this.elkHost}/${this.indexPattern}/${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
    };

    // 如果有 API Key，加入 Authorization header
    if (this.elkApiKey) {
      headers['Authorization'] = `ApiKey ${this.elkApiKey}`;
    }

    const response = await fetch(url, this.buildElkFetchOptions('POST', headers, body));

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Elasticsearch API 錯誤 (${response.status}): ${errorText}`);
    }

    return await response.json();
  }

  /**
   * 呼叫 Elasticsearch REST API（GET 方法）
   * @param {string} endpoint - API 端點（如 '_mapping' 或 '_field_caps'）
   * @returns {Promise<Object>} Elasticsearch 回應
   */
  async callElasticsearchAPIGet(endpoint) {
    const url = `${this.elkHost}/${this.indexPattern}/${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.elkApiKey) {
      headers['Authorization'] = `ApiKey ${this.elkApiKey}`;
    }

    const response = await fetch(url, this.buildElkFetchOptions('GET', headers));

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Elasticsearch API 錯誤 (${response.status}): ${errorText}`);
    }

    return await response.json();
  }

  // ==================== 欄位映射動態偵測 ====================

  /**
   * 初始化欄位映射
   * 透過實際執行聚合查詢來驗證哪個欄位版本有數據且可聚合
   * 解決 .keyword 和原始欄位數據不一致的問題
   * 
   * 選擇邏輯：
   * 1. 優先選擇「可聚合且有數據」的欄位
   * 2. 若兩者都可聚合且有數據，選擇數據量較多的
   * 3. 若只有一方可聚合且有數據，選擇該方
   * 4. 若 .keyword 可聚合但沒數據，原始欄位有數據但不可聚合 → 報警告
   */
  async initializeFieldMappings() {
    if (this.fieldMappingInitialized) {
      return;
    }

    console.log('🔍 正在偵測 Elasticsearch 欄位映射（數據存在性 + 可聚合性驗證）...');

    try {
      // 使用 multi-search API 批量驗證所有欄位
      const results = await this.validateFieldsWithData();

      for (const fieldName of this.fieldsToCheck) {
        const keywordField = `${fieldName}.keyword`;
        const keywordResult = results.get(keywordField) || { exists: 0, aggregatable: false };
        const originalResult = results.get(fieldName) || { exists: 0, aggregatable: false };

        let selectedField;
        let reason;
        let icon = '✅';

        // 判斷邏輯
        const keywordUsable = keywordResult.aggregatable && keywordResult.exists > 0;
        const originalUsable = originalResult.aggregatable && originalResult.exists > 0;

        if (keywordUsable && originalUsable) {
          // 兩者都可用，選擇數據量較多的
          if (keywordResult.exists >= originalResult.exists) {
            selectedField = keywordField;
            reason = `兩者皆可用，.keyword(${keywordResult.exists}) >= 原始(${originalResult.exists})`;
          } else {
            selectedField = fieldName;
            reason = `兩者皆可用，原始(${originalResult.exists}) > .keyword(${keywordResult.exists})`;
          }
        } else if (keywordUsable) {
          selectedField = keywordField;
          reason = `.keyword 可用(${keywordResult.exists})`;
        } else if (originalUsable) {
          selectedField = fieldName;
          reason = `原始欄位可用(${originalResult.exists})`;
        } else if (keywordResult.aggregatable && originalResult.exists > 0 && !originalResult.aggregatable) {
          // 特殊情況：.keyword 可聚合但沒數據，原始欄位有數據但不可聚合
          selectedField = keywordField;
          reason = `⚠️ .keyword 可聚合但無數據(0)，原始有數據(${originalResult.exists})但為 text 類型不可聚合`;
          icon = '🚨';
          console.warn(`   🚨 ${fieldName}: 數據可能未被索引到 .keyword 欄位！`);
          console.warn(`      原因可能是: ignore_above 限制、mapping 變更、或數據遷移問題`);
          console.warn(`      建議: 檢查 Elasticsearch mapping 和數據索引狀態`);
        } else if (keywordResult.aggregatable) {
          // .keyword 可聚合但沒數據
          selectedField = keywordField;
          reason = `.keyword 可聚合但無數據，使用作為預設`;
          icon = '⚠️';
        } else {
          // 兩者都不可用
          selectedField = keywordField;
          reason = '兩者皆不可用，使用 .keyword 作為預設';
          icon = '❓';
        }

        this.fieldMappingCache.set(fieldName, selectedField);
        console.log(`   ${icon} ${fieldName} → ${selectedField}`);
        console.log(`      exists: .keyword(${keywordResult.exists}) / 原始(${originalResult.exists})`);
        console.log(`      aggregatable: .keyword(${keywordResult.aggregatable}) / 原始(${originalResult.aggregatable})`);
        console.log(`      決策: ${reason}`);
      }

      this.fieldMappingInitialized = true;
      console.log(`✅ 欄位映射偵測完成，共 ${this.fieldMappingCache.size} 個欄位`);

    } catch (error) {
      console.warn(`⚠️ 欄位映射偵測失敗，使用備用策略: ${error.message}`);
      await this.initializeFallbackFieldMappings();
    }
  }

  /**
   * 使用 _msearch API 批量驗證欄位是否有數據且可聚合
   * 對每個欄位同時測試原始版本和 .keyword 版本
   * 分開測試：exists（數據存在性）和 terms（可聚合性）
   * @returns {Promise<Map<string, {exists: number, aggregatable: boolean}>>} 欄位名稱 -> {文件數量, 是否可聚合}
   */
  async validateFieldsWithData() {
    const results = new Map();
    
    // 建立 _msearch 請求體
    // 每個欄位需要兩個查詢：exists 和 terms
    const msearchLines = [];
    const queryMeta = []; // 記錄每個查詢的元資訊

    for (const fieldName of this.fieldsToCheck) {
      const keywordField = `${fieldName}.keyword`;

      // 測試 .keyword 版本 - exists 查詢（檢查數據存在性）
      queryMeta.push({ field: keywordField, type: 'exists' });
      msearchLines.push(JSON.stringify({}));
      msearchLines.push(JSON.stringify({
        size: 0,
        query: { exists: { field: keywordField } },
      }));

      // 測試 .keyword 版本 - terms 聚合（檢查可聚合性）
      queryMeta.push({ field: keywordField, type: 'terms' });
      msearchLines.push(JSON.stringify({}));
      msearchLines.push(JSON.stringify({
        size: 0,
        aggs: {
          sample: {
            terms: { field: keywordField, size: 1 }
          }
        }
      }));

      // 測試原始欄位版本 - exists 查詢
      queryMeta.push({ field: fieldName, type: 'exists' });
      msearchLines.push(JSON.stringify({}));
      msearchLines.push(JSON.stringify({
        size: 0,
        query: { exists: { field: fieldName } },
      }));

      // 測試原始欄位版本 - terms 聚合
      queryMeta.push({ field: fieldName, type: 'terms' });
      msearchLines.push(JSON.stringify({}));
      msearchLines.push(JSON.stringify({
        size: 0,
        aggs: {
          sample: {
            terms: { field: fieldName, size: 1 }
          }
        }
      }));
    }

    // 執行 _msearch
    const msearchBody = msearchLines.join('\n') + '\n';
    
    const url = `${this.elkHost}/${this.indexPattern}/_msearch`;
    const headers = {
      'Content-Type': 'application/x-ndjson',
    };

    if (this.elkApiKey) {
      headers['Authorization'] = `ApiKey ${this.elkApiKey}`;
    }

    console.log(`🔍 執行欄位驗證 | POST ${this.indexPattern}/_msearch (${queryMeta.length} 個查詢)`);

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: msearchBody,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`_msearch API 錯誤 (${response.status}): ${errorText}`);
    }

    const msearchResult = await response.json();
    const responses = msearchResult.responses || [];

    // 初始化結果 Map
    for (const fieldName of this.fieldsToCheck) {
      const keywordField = `${fieldName}.keyword`;
      results.set(keywordField, { exists: 0, aggregatable: false });
      results.set(fieldName, { exists: 0, aggregatable: false });
    }

    // 解析結果
    for (let i = 0; i < responses.length; i++) {
      const meta = queryMeta[i];
      const resp = responses[i];
      const fieldResult = results.get(meta.field);
      
      if (resp.error) {
        // 查詢失敗
        if (meta.type === 'terms') {
          // terms 失敗表示不可聚合（text 類型）
          fieldResult.aggregatable = false;
          console.log(`   ⚠️ ${meta.field}: terms 聚合失敗 - ${resp.error.type || 'unknown'}`);
        }
      } else {
        if (meta.type === 'exists') {
          // exists 查詢成功，取得文件數量
          fieldResult.exists = resp.hits?.total?.value || 0;
        } else if (meta.type === 'terms') {
          // terms 聚合成功，檢查是否有 buckets
          const buckets = resp.aggregations?.sample?.buckets || [];
          fieldResult.aggregatable = buckets.length > 0;
        }
      }
    }

    return results;
  }

  /**
   * 備用欄位映射初始化
   * 當 _msearch API 失敗時使用
   * 會嘗試逐一測試每個欄位
   */
  async initializeFallbackFieldMappings() {
    console.log('🔄 使用備用欄位映射策略（逐一測試）...');
    
    for (const fieldName of this.fieldsToCheck) {
      const keywordField = `${fieldName}.keyword`;
      
      // 先嘗試 .keyword 版本
      const keywordWorks = await this.testFieldAggregation(keywordField);
      if (keywordWorks) {
        this.fieldMappingCache.set(fieldName, keywordField);
        console.log(`   ✅ ${fieldName} → ${keywordField}`);
        continue;
      }

      // 再嘗試原始欄位
      const originalWorks = await this.testFieldAggregation(fieldName);
      if (originalWorks) {
        this.fieldMappingCache.set(fieldName, fieldName);
        console.log(`   ✅ ${fieldName} → ${fieldName}`);
        continue;
      }

      // 兩者都失敗，使用 .keyword 作為預設
      this.fieldMappingCache.set(fieldName, keywordField);
      console.log(`   ⚠️ ${fieldName} → ${keywordField} (預設)`);
    }

    this.fieldMappingInitialized = true;
    console.log(`✅ 備用欄位映射完成，共 ${this.fieldMappingCache.size} 個欄位`);
  }

  /**
   * 測試單一欄位是否可用於聚合且有數據
   * @param {string} fieldName - 欄位名稱
   * @returns {Promise<boolean>} 是否可用
   */
  async testFieldAggregation(fieldName) {
    try {
      const result = await this.callElasticsearchAPI('_search', {
        size: 0,
        query: { exists: { field: fieldName } },
        aggs: {
          test: {
            terms: { field: fieldName, size: 1 }
          }
        }
      });

      const buckets = result.aggregations?.test?.buckets || [];
      return buckets.length > 0;
    } catch (error) {
      // 查詢失敗表示欄位不可用
      return false;
    }
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
   * 建構攻擊活動量查詢（Query DSL，SecurityAction 為 jschallenge/block/managedChallenge）
   * 注意：Count/Filter 查詢不需要 .keyword 後綴（與 aggregation 不同）
   * @param {Date} start - 開始時間
   * @param {Date} end - 結束時間
   * @returns {Object} Query DSL 查詢物件
   */
  buildAttackCountQuery(start, end) {
    return {
      query: {
        bool: {
          filter: [
            this.buildQueryDSLTimeRange(start, end),
            {
              terms: {
                SecurityAction: ['jschallenge', 'block', 'managedChallenge'],
              },
            },
          ],
        },
      },
    };
  }

  /**
   * 建構 HTTP 活動量查詢（Query DSL，所有請求）
   * @param {Date} start - 開始時間
   * @param {Date} end - 結束時間
   * @returns {Object} Query DSL 查詢物件
   */
  buildHttpVolumeQuery(start, end) {
    return {
      query: {
        bool: {
          filter: [this.buildQueryDSLTimeRange(start, end)],
        },
      },
    };
  }

  /**
   * 建構封鎖數查詢（Query DSL，SecurityAction 為 block）
   * 注意：Count/Filter 查詢不需要 .keyword 後綴
   * @param {Date} start - 開始時間
   * @param {Date} end - 結束時間
   * @returns {Object} Query DSL 查詢物件
   */
  buildBlockCountQuery(start, end) {
    return {
      query: {
        bool: {
          filter: [
            this.buildQueryDSLTimeRange(start, end),
            {
              term: {
                SecurityAction: 'block',
              },
            },
          ],
        },
      },
    };
  }

  /**
   * 建構攻擊趨勢查詢輔助方法（Query DSL，date_histogram）
   * 注意：Filter 查詢不需要 .keyword 後綴
   * @param {Date} start - 開始時間
   * @param {Date} end - 結束時間
   * @param {string} interval - 時間間隔（如 '1h', '10m', '30m', '1d', '3d'）
   * @returns {Object} Query DSL 查詢物件
   */
  buildAttackTrendQuery(start, end, interval) {
    return {
      query: {
        bool: {
          filter: [
            this.buildQueryDSLTimeRange(start, end),
            {
              terms: {
                SecurityAction: ['jschallenge', 'block', 'managedChallenge'],
              },
            },
          ],
        },
      },
      size: 0,
      aggs: {
        trend: {
          date_histogram: {
            field: '@timestamp',
            fixed_interval: interval,
            min_doc_count: 0,
          },
        },
      },
    };
  }

  /**
   * 建構攻擊趨勢查詢（Query DSL，依小時彙總）
   * @param {Date} start - 開始時間
   * @param {Date} end - 結束時間
   * @returns {Object} Query DSL 查詢物件
   */
  buildAttackTrendQueryHour(start, end) {
    return this.buildAttackTrendQuery(start, end, '1h');
  }

  /**
   * 建構攻擊趨勢查詢（Query DSL，依10分彙總）
   * @param {Date} start - 開始時間
   * @param {Date} end - 結束時間
   * @returns {Object} Query DSL 查詢物件
   */
  buildAttackTrendQuery10Minute(start, end) {
    return this.buildAttackTrendQuery(start, end, '10m');
  }

  /**
   * 建構攻擊趨勢查詢（Query DSL，依30分彙總）
   * @param {Date} start - 開始時間
   * @param {Date} end - 結束時間
   * @returns {Object} Query DSL 查詢物件
   */
  buildAttackTrendQuery30Minute(start, end) {
    return this.buildAttackTrendQuery(start, end, '30m');
  }

  /**
   * 建構攻擊趨勢查詢（Query DSL，依天彙總）
   * @param {Date} start - 開始時間
   * @param {Date} end - 結束時間
   * @returns {Object} Query DSL 查詢物件
   */
  buildAttackTrendQuery1Day(start, end) {
    return this.buildAttackTrendQuery(start, end, '1d');
  }

  /**
   * 建構攻擊趨勢查詢（Query DSL，依3天彙總）
   * @param {Date} start - 開始時間
   * @param {Date} end - 結束時間
   * @returns {Object} Query DSL 查詢物件
   */
  buildAttackTrendQuery3Day(start, end) {
    return this.buildAttackTrendQuery(start, end, '3d');
  }

  /**
   * 建構資料傳送量查詢（Query DSL，SUM EdgeResponseBytes）
   * @param {Date} start - 開始時間
   * @param {Date} end - 結束時間
   * @returns {Object} Query DSL 查詢物件
   */
  buildDataVolumeQuery(start, end) {
    return {
      query: {
        bool: {
          filter: [this.buildQueryDSLTimeRange(start, end)],
        },
      },
      size: 0,
      aggs: {
        total_bytes: {
          sum: {
            field: 'EdgeResponseBytes',
          },
        },
      },
    };
  }

  /**
   * 建構頁面瀏覽次數查詢（Query DSL，ContentType 為 text/html）
   * 使用動態偵測的欄位名稱
   * @param {Date} start - 開始時間
   * @param {Date} end - 結束時間
   * @returns {Object} Query DSL 查詢物件
   */
  buildPageViewQuery(start, end) {
    const contentTypeField = this.getKeywordField('EdgeResponseContentType');
    return {
      query: {
        bool: {
          filter: [
            this.buildQueryDSLTimeRange(start, end),
            {
              terms: {
                [contentTypeField]: ['text/html'],
              },
            },
          ],
        },
      },
    };
  }

  /**
   * 建構造訪次數查詢（Query DSL，Referer 為 None）
   * 使用動態偵測的欄位名稱
   * @param {Date} start - 開始時間
   * @param {Date} end - 結束時間
   * @returns {Object} Query DSL 查詢物件
   */
  buildVisitsQuery(start, end) {
    const refererField = this.getKeywordField('ClientRequestReferer');
    return {
      query: {
        bool: {
          filter: [
            this.buildQueryDSLTimeRange(start, end),
            {
              terms: {
                [refererField]: ['None'],
              },
            },
          ],
        },
      },
    };
  }

  // ==================== Query DSL Top 5 查詢（取代 ES|QL）====================

  /**
   * 建構時間範圍 Query DSL 過濾條件
   * @param {Date} start - 開始時間
   * @param {Date} end - 結束時間
   * @returns {Object} Query DSL range 過濾條件
   */
  buildQueryDSLTimeRange(start, end) {
    return {
      range: {
        '@timestamp': {
          gte: start.toISOString(),
          lte: end.toISOString(),
        },
      },
    };
  }

  /**
   * 取得欄位的正確版本（用於 terms aggregation 和 terms filter）
   * 根據動態偵測的結果，決定使用原始欄位或 .keyword 版本
   * @param {string} field - 原始欄位名稱
   * @returns {string} 正確的欄位名稱
   */
  getKeywordField(field) {
    // 如果已經有 .keyword 後綴，直接返回
    if (field.endsWith('.keyword')) {
      return field;
    }

    // 優先使用快取的映射結果
    if (this.fieldMappingCache.has(field)) {
      return this.fieldMappingCache.get(field);
    }

    // 如果快取中沒有，檢查是否在需要處理的欄位列表中
    // 若已初始化但不在快取中，表示不需要轉換
    if (this.fieldMappingInitialized) {
      return field;
    }

    // 尚未初始化時的備用邏輯：使用 .keyword 後綴
    // （這種情況應該很少發生，因為 loadTrendComparison 會先初始化）
    if (this.fieldsToCheck.includes(field)) {
      return `${field}.keyword`;
    }

    return field;
  }

  /**
   * 建構 Top N 聚合查詢 Query DSL
   * @param {Date} start - 開始時間
   * @param {Date} end - 結束時間
   * @param {string} field - 聚合欄位名稱
   * @param {number} size - Top N 數量
   * @param {string[]} filterValues - 過濾值列表（可選，用於上期查詢）
   * @returns {Object} Query DSL 查詢物件
   */
  buildTopNAggregationQuery(start, end, field, size = 5, filterValues = null) {
    const filters = [this.buildQueryDSLTimeRange(start, end)];
    const keywordField = this.getKeywordField(field);

    // 若有過濾值列表，加入 terms 過濾條件
    if (filterValues && filterValues.length > 0) {
      filters.push({
        terms: {
          [keywordField]: filterValues,
        },
      });
    }

    return {
      query: {
        bool: {
          filter: filters,
        },
      },
      size: 0, // 不需要回傳文件，只要聚合結果
      aggs: {
        top_items: {
          terms: {
            field: keywordField,
            size: size,
          },
        },
      },
    };
  }

  /**
   * 執行 Query DSL 聚合查詢並轉換結果格式
   * 注意：MCP 對 size=0 只回傳摘要，需設 size>=1 才能取得 aggregations
   * @param {Object} queryBody - Query DSL 查詢物件
   * @param {string} fieldName - 結果欄位名稱（用於輸出格式轉換）
   * @returns {Promise<Array>} 與原 ES|QL 相同格式的結果陣列
   */
  async executeQueryDSL(queryBody, fieldName) {
    const endpoint = '_search';
    const method = 'POST';
    
    try {
      // 設置 size: 0，只需要 aggregation 結果
      const aggQuery = {
        ...queryBody,
        size: 0,
      };

      console.log(`🔍 [QueryDSL] 執行 Top N 聚合查詢 [${fieldName}] | ${method} ${this.indexPattern}/${endpoint}`);
      console.log(JSON.stringify(aggQuery, null, 2));

      // 直接呼叫 Elasticsearch _search API
      const result = await this.callElasticsearchAPI(endpoint, aggQuery);

      // 從 aggregations.top_items.buckets 提取結果
      const buckets = result.aggregations?.top_items?.buckets || [];
      console.log(`📥 [${fieldName}] Top N 結果: ${buckets.length} 筆`);

      // 轉換為標準格式：[{ fieldName: key, cnt: doc_count }, ...]
      return buckets.map((bucket) => ({
        [fieldName]: bucket.key,
        cnt: bucket.doc_count,
      }));
    } catch (error) {
      console.error(`❌ [${fieldName}] Query DSL 查詢執行失敗 (${method} ${endpoint}):`, error.message);
      // 回傳空結果，不中斷整體查詢
      return [];
    }
  }

  /**
   * 執行計數類 Query DSL（直接呼叫 Elasticsearch _count API）
   * @param {Object} queryBody - Query DSL 查詢物件
   * @param {string} queryName - 查詢名稱（用於日誌識別）
   * @returns {Promise<Array>} 回傳 [{ count: number }] 格式
   */
  async executeCountQueryDSL(queryBody, queryName = '') {
    const endpoint = '_count';
    const method = 'POST';
    
    try {
      console.log(`🔍 [QueryDSL] 執行計數查詢 [${queryName}] | ${method} ${this.indexPattern}/${endpoint}`);
      console.log(JSON.stringify(queryBody, null, 2));

      // 直接呼叫 Elasticsearch _count API
      const result = await this.callElasticsearchAPI(endpoint, queryBody);

      console.log(`📥 [${queryName}] 計數結果: ${result.count}`);

      return [{ count: result.count || 0 }];
    } catch (error) {
      console.error(`❌ [${queryName}] Count Query DSL 查詢執行失敗 (${method} ${endpoint}):`, error.message);
      return [{ count: 0 }];
    }
  }

  /**
   * 執行加總類 Query DSL（透過 MCP search 工具，使用 sum aggregation）
   * 注意：MCP 對 size=0 只回傳摘要，需設 size>=1 才能取得 aggregations
   * @param {Object} queryBody - Query DSL 查詢物件（含 aggs.total_bytes）
   * @param {string} queryName - 查詢名稱（用於日誌識別）
   * @returns {Promise<Array>} 回傳 [{ totalBytes: number }] 格式
   */
  async executeSumQueryDSL(queryBody, queryName = '') {
    const endpoint = '_search';
    const method = 'POST';
    
    try {
      // 設置 size: 0，只需要 aggregation 結果
      const sumQuery = {
        ...queryBody,
        size: 0,
      };

      console.log(`🔍 [QueryDSL] 執行加總查詢 [${queryName}] | ${method} ${this.indexPattern}/${endpoint}`);
      console.log(JSON.stringify(sumQuery, null, 2));

      // 直接呼叫 Elasticsearch _search API
      const result = await this.callElasticsearchAPI(endpoint, sumQuery);

      // 從 aggregations.total_bytes.value 取得加總
      const totalBytes = result.aggregations?.total_bytes?.value || 0;
      console.log(`📥 [${queryName}] 加總結果: ${totalBytes}`);

      return [{ totalBytes }];
    } catch (error) {
      console.error(`❌ [${queryName}] Sum Query DSL 查詢執行失敗 (${method} ${endpoint}):`, error.message);
      return [{ totalBytes: 0 }];
    }
  }

  /**
   * 執行時間分組類 Query DSL（透過 MCP search 工具，使用 date_histogram aggregation）
   * 注意：MCP 對 size=0 只回傳摘要，需設 size>=1 才能取得 aggregations
   * @param {Object} queryBody - Query DSL 查詢物件（含 aggs.trend）
   * @param {string} queryName - 查詢名稱（用於日誌識別）
   * @returns {Promise<Array>} 回傳 [{ hour: string, count: number }, ...] 格式
   */
  async executeHistogramQueryDSL(queryBody, queryName = '') {
    const endpoint = '_search';
    const method = 'POST';
    
    try {
      // 設置 size: 0，只需要 aggregation 結果
      const histogramQuery = {
        ...queryBody,
        size: 0,
      };

      console.log(`🔍 [QueryDSL] 執行時間分組查詢 [${queryName}] | ${method} ${this.indexPattern}/${endpoint}`);
      console.log(JSON.stringify(histogramQuery, null, 2));

      // 直接呼叫 Elasticsearch _search API
      const result = await this.callElasticsearchAPI(endpoint, histogramQuery);

      // 從 aggregations.trend.buckets 提取結果
      const buckets = result.aggregations?.trend?.buckets || [];
      console.log(`📥 [${queryName}] 時間分組結果: ${buckets.length} 筆`);

      // 轉換為標準格式：[{ hour: key_as_string, count: doc_count }, ...]
      return buckets.map((bucket) => ({
        hour: bucket.key_as_string,
        count: bucket.doc_count,
      }));
    } catch (error) {
      console.error(`❌ [${queryName}] Histogram Query DSL 查詢執行失敗 (${method} ${endpoint}):`, error.message);
      return [];
    }
  }

  /**
   * 建構當期 Top 5 來源 IP 查詢（Query DSL）
   * @param {Date} start - 開始時間
   * @param {Date} end - 結束時間
   * @returns {Object} Query DSL 查詢物件
   */
  buildCurrentSourceIPQuery(start, end) {
    return this.buildTopNAggregationQuery(start, end, 'ClientIP', 5);
  }

  /**
   * 建構上期 Top 5 來源 IP 查詢（Query DSL，使用當期 IP 列表作為過濾條件）
   * @param {Date} start - 開始時間
   * @param {Date} end - 結束時間
   * @param {string[]} ipList - 當期 Top 5 IP 列表（來自 buildCurrentSourceIPQuery 輸出）
   * @returns {Object} Query DSL 查詢物件
   */
  buildPreviousSourceIPQuery(start, end, ipList) {
    return this.buildTopNAggregationQuery(start, end, 'ClientIP', ipList.length, ipList);
  }

  /**
   * 建構當期 Top 5 觸發規則查詢（Query DSL）
   * @param {Date} start - 開始時間
   * @param {Date} end - 結束時間
   * @returns {Object} Query DSL 查詢物件
   */
  buildCurrentTriggerRuleQuery(start, end) {
    return this.buildTopNAggregationQuery(start, end, 'SecurityRuleDescription', 5);
  }

  /**
   * 建構上期 Top 5 觸發規則查詢（Query DSL，使用當期規則列表作為過濾條件）
   * @param {Date} start - 開始時間
   * @param {Date} end - 結束時間
   * @param {string[]} ruleList - 當期 Top 5 規則列表（來自 buildCurrentTriggerRuleQuery 輸出）
   * @returns {Object} Query DSL 查詢物件
   */
  buildPreviousTriggerRuleQuery(start, end, ruleList) {
    return this.buildTopNAggregationQuery(start, end, 'SecurityRuleDescription', ruleList.length, ruleList);
  }

  /**
   * 建構當期 Top 5 主機查詢（Query DSL）
   * @param {Date} start - 開始時間
   * @param {Date} end - 結束時間
   * @returns {Object} Query DSL 查詢物件
   */
  buildCurrentHostsQuery(start, end) {
    return this.buildTopNAggregationQuery(start, end, 'ClientRequestHost', 5);
  }

  /**
   * 建構上期 Top 5 主機查詢（Query DSL，使用當期主機列表作為過濾條件）
   * @param {Date} start - 開始時間
   * @param {Date} end - 結束時間
   * @param {string[]} hostList - 當期 Top 5 主機列表（來自 buildCurrentHostsQuery 輸出）
   * @returns {Object} Query DSL 查詢物件
   */
  buildPreviousHostsQuery(start, end, hostList) {
    return this.buildTopNAggregationQuery(start, end, 'ClientRequestHost', hostList.length, hostList);
  }

  /**
   * 建構當期 Top 5 路徑查詢（Query DSL）
   * @param {Date} start - 開始時間
   * @param {Date} end - 結束時間
   * @returns {Object} Query DSL 查詢物件
   */
  buildCurrentPathQuery(start, end) {
    return this.buildTopNAggregationQuery(start, end, 'ClientRequestPath', 5);
  }

  /**
   * 建構上期 Top 5 路徑查詢（Query DSL，使用當期路徑列表作為過濾條件）
   * @param {Date} start - 開始時間
   * @param {Date} end - 結束時間
   * @param {string[]} pathList - 當期 Top 5 路徑列表（來自 buildCurrentPathQuery 輸出）
   * @returns {Object} Query DSL 查詢物件
   */
  buildPreviousPathQuery(start, end, pathList) {
    return this.buildTopNAggregationQuery(start, end, 'ClientRequestPath', pathList.length, pathList);
  }

  /**
   * 建構當期 Top 5 國家查詢（Query DSL）
   * @param {Date} start - 開始時間
   * @param {Date} end - 結束時間
   * @returns {Object} Query DSL 查詢物件
   */
  buildCurrentCountryQuery(start, end) {
    return this.buildTopNAggregationQuery(start, end, 'geoip_client.country_name', 5);
  }

  /**
   * 建構上期 Top 5 國家查詢（Query DSL，使用當期國家列表作為過濾條件）
   * @param {Date} start - 開始時間
   * @param {Date} end - 結束時間
   * @param {string[]} countryList - 當期 Top 5 國家列表（來自 buildCurrentCountryQuery 輸出）
   * @returns {Object} Query DSL 查詢物件
   */
  buildPreviousCountryQuery(start, end, countryList) {
    return this.buildTopNAggregationQuery(start, end, 'geoip_client.country_name', countryList.length, countryList);
  }

  // ==================== 查詢結果處理 ====================

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

    // 初始化欄位映射（首次呼叫時會偵測 Elasticsearch 欄位類型）
    await this.initializeFieldMappings();

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

    // 建立查詢任務陣列（延遲執行）- 全部使用 Query DSL
    const phase1Tasks = [
      // 攻擊活動量（2 個）- 使用 Query DSL
      () =>
        this.executeCountQueryDSL(
          this.buildAttackCountQuery(current.start, current.end),
          'currentAttack',
        ),
      () =>
        this.executeCountQueryDSL(
          this.buildAttackCountQuery(previous.start, previous.end),
          'previousAttack',
        ),
      // HTTP 活動量（2 個）- 使用 Query DSL
      () =>
        this.executeCountQueryDSL(
          this.buildHttpVolumeQuery(current.start, current.end),
          'currentHttp',
        ),
      () =>
        this.executeCountQueryDSL(
          this.buildHttpVolumeQuery(previous.start, previous.end),
          'previousHttp',
        ),
      // 封鎖數（2 個）- 使用 Query DSL
      () =>
        this.executeCountQueryDSL(
          this.buildBlockCountQuery(current.start, current.end),
          'currentBlock',
        ),
      () =>
        this.executeCountQueryDSL(
          this.buildBlockCountQuery(previous.start, previous.end),
          'previousBlock',
        ),
      // 攻擊趨勢（2 個）- 使用 Query DSL date_histogram
      () => {
        if (timeRange === '1h')
          return this.executeHistogramQueryDSL(
            this.buildAttackTrendQuery10Minute(current.start, current.end),
            'currentAttackTrend',
          );
        if (timeRange === '6h')
          return this.executeHistogramQueryDSL(
            this.buildAttackTrendQuery30Minute(current.start, current.end),
            'currentAttackTrend',
          );
        if (timeRange === '14d')
          return this.executeHistogramQueryDSL(
            this.buildAttackTrendQuery1Day(current.start, current.end),
            'currentAttackTrend',
          );
        if (timeRange === '30d')
          return this.executeHistogramQueryDSL(
            this.buildAttackTrendQuery3Day(current.start, current.end),
            'currentAttackTrend',
          );
        return this.executeHistogramQueryDSL(
          this.buildAttackTrendQueryHour(current.start, current.end),
          'currentAttackTrend',
        );
      },
      () => {
        if (timeRange === '1h')
          return this.executeHistogramQueryDSL(
            this.buildAttackTrendQuery10Minute(previous.start, previous.end),
            'previousAttackTrend',
          );
        if (timeRange === '6h')
          return this.executeHistogramQueryDSL(
            this.buildAttackTrendQuery30Minute(previous.start, previous.end),
            'previousAttackTrend',
          );
        if (timeRange === '14d')
          return this.executeHistogramQueryDSL(
            this.buildAttackTrendQuery1Day(previous.start, previous.end),
            'previousAttackTrend',
          );
        if (timeRange === '30d')
          return this.executeHistogramQueryDSL(
            this.buildAttackTrendQuery3Day(previous.start, previous.end),
            'previousAttackTrend',
          );
        return this.executeHistogramQueryDSL(
          this.buildAttackTrendQueryHour(previous.start, previous.end),
          'previousAttackTrend',
        );
      },
      // 資料傳送量（2 個）- 使用 Query DSL sum aggregation
      () =>
        this.executeSumQueryDSL(
          this.buildDataVolumeQuery(current.start, current.end),
          'currentDataVolume',
        ),
      () =>
        this.executeSumQueryDSL(
          this.buildDataVolumeQuery(previous.start, previous.end),
          'previousDataVolume',
        ),
      // 頁面瀏覽次數（2 個）- 使用 Query DSL
      () =>
        this.executeCountQueryDSL(
          this.buildPageViewQuery(current.start, current.end),
          'currentPageView',
        ),
      () =>
        this.executeCountQueryDSL(
          this.buildPageViewQuery(previous.start, previous.end),
          'previousPageView',
        ),
      // 造訪次數（2 個）- 使用 Query DSL
      () =>
        this.executeCountQueryDSL(
          this.buildVisitsQuery(current.start, current.end),
          'currentVisits',
        ),
      () =>
        this.executeCountQueryDSL(
          this.buildVisitsQuery(previous.start, previous.end),
          'previousVisits',
        ),
      // 當期 Top 5（5 個）- 使用 Query DSL
      () =>
        this.executeQueryDSL(
          this.buildCurrentSourceIPQuery(current.start, current.end),
          'ClientIP',
        ),
      () =>
        this.executeQueryDSL(
          this.buildCurrentTriggerRuleQuery(current.start, current.end),
          'SecurityRuleDescription',
        ),
      () =>
        this.executeQueryDSL(
          this.buildCurrentHostsQuery(current.start, current.end),
          'ClientRequestHost',
        ),
      () =>
        this.executeQueryDSL(
          this.buildCurrentPathQuery(current.start, current.end),
          'ClientRequestPath',
        ),
      () =>
        this.executeQueryDSL(
          this.buildCurrentCountryQuery(current.start, current.end),
          'geoip_client.country_name',
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

    // 建立第二階段查詢任務 - 使用 Query DSL
    const phase2Tasks = [
      () =>
        currentIPList.length > 0
          ? this.executeQueryDSL(
            this.buildPreviousSourceIPQuery(
              previous.start,
              previous.end,
              currentIPList,
            ),
            'ClientIP',
          )
          : Promise.resolve([]),
      () =>
        currentRuleList.length > 0
          ? this.executeQueryDSL(
            this.buildPreviousTriggerRuleQuery(
              previous.start,
              previous.end,
              currentRuleList,
            ),
            'SecurityRuleDescription',
          )
          : Promise.resolve([]),
      () =>
        currentHostList.length > 0
          ? this.executeQueryDSL(
            this.buildPreviousHostsQuery(
              previous.start,
              previous.end,
              currentHostList,
            ),
            'ClientRequestHost',
          )
          : Promise.resolve([]),
      () =>
        currentPathList.length > 0
          ? this.executeQueryDSL(
            this.buildPreviousPathQuery(
              previous.start,
              previous.end,
              currentPathList,
            ),
            'ClientRequestPath',
          )
          : Promise.resolve([]),
      () =>
        currentCountryList.length > 0
          ? this.executeQueryDSL(
            this.buildPreviousCountryQuery(
              previous.start,
              previous.end,
              currentCountryList,
            ),
            'geoip_client.country_name',
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
