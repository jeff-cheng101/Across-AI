// ELK MCP 客戶端服務
// 處理與 Elasticsearch MCP Server 的通信

const { Client } = require('@modelcontextprotocol/sdk/client/index.js');
const { StdioClientTransport } = require('@modelcontextprotocol/sdk/client/stdio.js');
const { SSEClientTransport } = require('@modelcontextprotocol/sdk/client/sse.js');
const { spawn } = require('child_process');
const { ELK_CONFIG } = require('../config/elkConfig');

// 使用全域 fetch (Node.js 18+ 內建)
const fetch = globalThis.fetch;

class ElkMCPClient {
  constructor() {
    this.client = null;
    this.connected = false;
    this.retryCount = 0;
    this.sessionId = null;
    this.serverCapabilities = {};
  }

  // 取得統一的 MCP 超時 (毫秒)
  getTimeoutMs() {
    const timeout = ELK_CONFIG?.mcp?.timeout;
    return Number.isFinite(timeout) && timeout > 0 ? timeout : 300000;
  }

  // 取得 Elasticsearch 查詢用的超時字串 (如 "60s")
  getTimeoutSecondsString() {
    const seconds = Math.max(1, Math.ceil(this.getTimeoutMs() / 1000));
    return `${seconds}s`;
  }

  // 建立 HTTP 傳輸
  async createHttpTransport() {
    // 先測試 MCP Server 是否可用
    await this.testHttpConnection();
    
    // 建立 MCP 會話
    await this.createHttpSession();
    
    console.log('HTTP MCP 傳輸已準備就緒');
    return null; // 使用自定義的 HTTP 調用邏輯
  }

  // 建立 HTTP MCP 會話
  async createHttpSession() {
    try {
      const sessionUrl = `${ELK_CONFIG.mcp.serverUrl}/mcp`;
      console.log('建立 MCP 會話...');
      
      // 發送初始化請求建立會話
      const response = await fetch(sessionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'initialize',
          id: 1,
          params: {
            protocolVersion: '2024-11-05',
            capabilities: {
              tools: {}
            },
            clientInfo: {
              name: 'ddos-analyzer',
              version: '1.0.0'
            }
          }
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('✅ MCP 會話建立成功');
      
      // 儲存會話資訊
      this.sessionId = result.id || 'default';
      this.serverCapabilities = result.result?.capabilities || {};
      
      return true;
    } catch (error) {
      console.error('❌ MCP 會話建立失敗:', error.message);
      throw error;
    }
  }

  // 測試 HTTP 連接
  async testHttpConnection() {
    try {
      const pingUrl = `${ELK_CONFIG.mcp.serverUrl}/ping`;
      console.log(`測試 MCP Server 連接: ${pingUrl}`);
      
      const response = await fetch(pingUrl, {
        method: 'GET',
        timeout: this.getTimeoutMs()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      console.log('✅ MCP Server HTTP 連接測試成功');
      return true;
    } catch (error) {
      console.error('❌ MCP Server HTTP 連接測試失敗:', error.message);
      throw new Error(`無法連接到 MCP Server: ${error.message}`);
    }
  }

  // 直接 HTTP 工具調用
  async callHttpTool(toolName, args = {}) {
    try {
      const mcpUrl = `${ELK_CONFIG.mcp.serverUrl}/mcp`;
      console.log(`調用 MCP 工具: ${toolName}`);
      
      // 使用 MCP JSON-RPC 格式
      const requestId = Date.now();
      const response = await fetch(mcpUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/event-stream'
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'tools/call',
          id: requestId,
          params: {
            name: toolName,
            arguments: args
          }
        }),
        // 增加超時時間到10分鐘，適應大數據量查詢
        signal: AbortSignal.timeout(this.getTimeoutMs())
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      // MCP Server 可能返回 SSE 格式，需要解析 'data: ' 前綴
      const responseText = await response.text();
      
      // 處理 SSE 格式: "data: {JSON}"
      let jsonText = responseText;
      if (responseText.startsWith('data: ')) {
        jsonText = responseText.substring(6); // 移除 "data: " 前綴
      }
      
      // 解析 JSON 響應
      const result = JSON.parse(jsonText);
      
      if (result.error) {
        throw new Error(`MCP Error: ${result.error.message}`);
      }
      
      return result.result;
    } catch (error) {
      console.error(`❌ 工具調用失敗 (${toolName}):`, error.message);
      throw error;
    }
  }

  // 獲取工具列表
  async listTools() {
    if (ELK_CONFIG.mcp.protocol === 'http') {
      try {
        const mcpUrl = `${ELK_CONFIG.mcp.serverUrl}/mcp`;
        console.log('獲取 MCP 工具列表...');
        
        const requestId = Date.now();
        const response = await fetch(mcpUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'tools/list',
            id: requestId
          })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (result.error) {
          throw new Error(`MCP Error: ${result.error.message}`);
        }
        
        return result.result;
      } catch (error) {
        console.error('❌ 工具列表獲取失敗:', error.message);
        // 回退到已知的工具列表
        return {
          tools: [
            { name: 'list_indices', description: '列出所有可用的 Elasticsearch 索引' },
            { name: 'get_mappings', description: '獲取特定索引的欄位映射' },
            { name: 'search', description: '執行 Elasticsearch 查詢 DSL' },
            { name: 'esql', description: '執行 ES|QL 查詢' },
            { name: 'get_shards', description: '獲取索引分片資訊' }
          ]
        };
      }
    } else {
      // stdio 模式：使用 MCP 客戶端
      return await this.client.listTools();
    }
  }

  // 連接到 MCP Server
  async connect() {
    const maxRetries = ELK_CONFIG.mcp.retryAttempts || 3;
    const baseDelay = 1000; // 1秒基礎延遲
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          const delay = baseDelay * Math.pow(2, attempt - 1); // 指數退避
          console.log(`🔄 重試連接 (${attempt}/${maxRetries})，等待 ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
        
        console.log(`正在連接 ELK MCP Server (${ELK_CONFIG.mcp.protocol})...`);
        console.log(`Server URL: ${ELK_CONFIG.mcp.serverUrl}`);
        
        // 清理舊連接
        if (this.client) {
          try {
            await this.client.close();
          } catch (e) {
            // 忽略清理錯誤
          }
          this.client = null;
        }
        
        let transport;
        
        // 根據協議類型建立不同的傳輸方式
        if (ELK_CONFIG.mcp.protocol === 'proxy') {
          // 使用 mcp-proxy 橋接 HTTP 到 stdio
          console.log('使用 mcp-proxy 橋接到 HTTP MCP Server...');
          console.log(`mcp-proxy 路徑: ${ELK_CONFIG.mcp.proxyCommand}`);
          console.log(`mcp-proxy 參數: ${ELK_CONFIG.mcp.proxyArgs.join(' ')}`);
          
          // 檢查 mcp-proxy 是否存在
          const fs = require('fs');
          if (!fs.existsSync(ELK_CONFIG.mcp.proxyCommand)) {
            throw new Error(
              `mcp-proxy 不存在於路徑: ${ELK_CONFIG.mcp.proxyCommand}\n` +
              `請確認：\n` +
              `1. mcp-proxy 已正確安裝\n` +
              `2. 路徑正確（當前 PATH: ${process.env.PATH}）\n` +
              `3. 不使用 sudo/root 身份運行後端\n` +
              `4. 或在 .env 中設定 ELK_MCP_PROTOCOL=http 使用 HTTP 模式`
            );
          }
          
          transport = new StdioClientTransport({
            command: ELK_CONFIG.mcp.proxyCommand,
            args: ELK_CONFIG.mcp.proxyArgs
          });
        } else {
          // 直接 stdio 傳輸
          transport = new StdioClientTransport({
            command: ELK_CONFIG.mcp.serverCommand,
            args: ELK_CONFIG.mcp.serverArgs
          });
        }

        // 建立客戶端
        this.client = new Client({
          name: "ddos-analyzer",
          version: "1.0.0"
        }, {
          capabilities: {
            tools: {}
          },
          timeout: this.getTimeoutMs()  // 依環境變數設定超時
        });

        // 設置連接超時
        const connectPromise = this.client.connect(transport);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Connection timeout')), this.getTimeoutMs())
        );
        
        // 連接到服務器（帶超時）
        await Promise.race([connectPromise, timeoutPromise]);
        
        // 驗證連接是否真的可用
        const testResult = await this.quickConnectionTest();
        if (!testResult) {
          throw new Error('Connection established but not functional');
        }
        
        this.connected = true;
        this.retryCount = 0;
        
        console.log('✅ ELK MCP Server 連接成功並通過驗證');
        return true;
        
      } catch (error) {
        console.error(`❌ ELK MCP Server 連接失敗 (嘗試 ${attempt + 1}/${maxRetries + 1}):`, error.message);
        this.connected = false;
        this.client = null;
        
        // 如果是最後一次嘗試，拋出錯誤
        if (attempt === maxRetries) {
          const finalError = new Error(`ELK MCP Server 連接失敗，已重試 ${maxRetries} 次: ${error.message}`);
          finalError.originalError = error;
          throw finalError;
        }
      }
    }
  }

  // 斷開連接
  async disconnect() {
    if (this.client && this.connected) {
      try {
        await this.client.close();
        this.connected = false;
        console.log('🔌 ELK MCP Server 連接已關閉');
      } catch (error) {
        console.error('關閉 MCP 連接時發生錯誤:', error.message);
      }
    }
  }

  // 確保連接狀態
  async ensureConnection() {
    if (!this.connected || !this.client) {
      console.log('🔄 ELK 連接未建立，開始建立連接...');
      await this.connect();
    } else {
      // 即使連接狀態顯示已連接，也要驗證連接是否真的可用
      try {
        const isWorking = await this.quickConnectionTest();
        if (!isWorking) {
          console.log('⚠️ ELK 連接可能已斷開，重新建立連接...');
          this.connected = false;
          this.client = null;
          await this.connect();
        }
      } catch (error) {
        console.log('⚠️ ELK 連接驗證失敗，重新建立連接...', error.message);
        this.connected = false;
        this.client = null;
        await this.connect();
      }
    }
  }

  // 快速連接測試（不會拋出錯誤）
  async quickConnectionTest() {
    if (!this.client) {
      return false;
    }
    
    try {
      // 執行一個極簡的測試查詢
      const result = await Promise.race([
        this.client.callTool({
          name: 'search',
          arguments: {
            index: ELK_CONFIG.elasticsearch.index,
            query_body: {
              query: { match_all: {} },
              size: 1,
              timeout: this.getTimeoutSecondsString()
            }
          }
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Connection test timeout')), this.getTimeoutMs())
        )
      ]);

      return !result.isError;
    } catch (error) {
      return false;
    }
  }

  // 建構 Elasticsearch 查詢（產品無關）
  buildElasticsearchQuery(timeRange = '1h', filters = {}, fieldMapping = null, maxResults = ELK_CONFIG.elasticsearch.maxResults) {
    // 智能時間範圍查詢策略
    let query;

    //處理 ELK_MAX_RESULTS(maxResults) 不能超過 10000，Elasticsearch 單次查詢限制
    if (maxResults > 10000) {
      console.log('ELK_MAX_RESULTS 超過 Elasticsearch 單次查詢限制 10000 實際env設定為:', maxResults, '=> 調整為 10000');
      maxResults = 10000;      
    }
    
    if (timeRange === 'auto' || timeRange === '1h') {
      // 自動模式：查詢最近的資料，不限特定時間範圍
      console.log('🔍 使用自動時間範圍，查詢最新資料...');
      query = {
        query: {
          match_all: {}
        },
        sort: [
          {
            "@timestamp": {
              order: "desc"
            }
          }
        ],
        size: maxResults  // 增加資料量以確保涵蓋所有攻擊事件
      };
    } else if (typeof timeRange === 'object' && timeRange.start && timeRange.end) {
      // 自定義日期範圍查詢（物件格式）
      console.log('🔍 使用自定義日期範圍:', timeRange.start, 'to', timeRange.end);
      query = {
        query: {
          range: {
            "@timestamp": {
              gte: timeRange.start,
              lte: timeRange.end
            }
          }
        },
        sort: [
          {
            "@timestamp": {
              order: "desc"
            }
          }
        ],
        size: maxResults
      };
    } else {
      // 傳統時間範圍查詢（字串格式，如 "24h", "7d"）
      const now = new Date();
      const timeRangeMs = this.parseTimeRange(timeRange);
      const fromTime = new Date(now.getTime() - timeRangeMs);
      
      console.log('🔍 使用指定時間範圍:', fromTime.toISOString(), 'to', now.toISOString());
      query = {
        query: {
          range: {
            "@timestamp": {
              gte: fromTime.toISOString(),
              lte: now.toISOString()
            }
          }
        },
        sort: [
          {
            "@timestamp": {
              order: "desc"
            }
          }
        ],
        size: maxResults
      };
    }

    // 添加額外的篩選條件（如果需要的話）
    // 注意：現在 filters 需要直接使用 ELK 欄位名稱，而非邏輯名稱
    if (Object.keys(filters).length > 0 && fieldMapping) {
      // 將簡單查詢轉換為 bool 查詢以支援篩選
      if (query.query.match_all) {
        query.query = {
          bool: {
            must: [{ match_all: {} }],
            filter: []
          }
        };
      } else if (query.query.range) {
        const rangeQuery = query.query.range;
        query.query = {
          bool: {
            must: [{ range: rangeQuery }],
            filter: []
          }
        };
      }

      // 根據提供的 fieldMapping 動態處理篩選條件
      if (filters.clientIp && fieldMapping.client_ip) {
        query.query.bool.filter.push({
          term: { [fieldMapping.client_ip.elk_field]: filters.clientIp }
        });
      }

      if (filters.securityAction && fieldMapping.security_action) {
        query.query.bool.filter.push({
          term: { [fieldMapping.security_action.elk_field]: filters.securityAction }
        });
      }
      
      if (filters.minWafScore && fieldMapping.waf_attack_score) {
        query.query.bool.filter.push({
          range: {
            [fieldMapping.waf_attack_score.elk_field]: {
              lte: filters.minWafScore // WAF分數越低越危險
            }
          }
        });
      }
    }

    // 全域限制最大回傳筆數，避免 MCP search 過載
    const configuredLimit = Number.isInteger(ELK_CONFIG.elasticsearch.maxResults) && ELK_CONFIG.elasticsearch.maxResults > 0
      ? ELK_CONFIG.elasticsearch.maxResults
      : 2;
    const limit = Number.isInteger(maxResults) && maxResults > 0
      ? Math.min(maxResults, configuredLimit)
      : configuredLimit;
    query.size = Math.min(query.size || limit, limit);

    return query;
  }

  // 解析時間範圍
  parseTimeRange(timeRange) {
    const unit = timeRange.slice(-1);
    const value = parseInt(timeRange.slice(0, -1));
    
    const multipliers = {
      'm': 60 * 1000,      // 分鐘
      'h': 60 * 60 * 1000, // 小時
      'd': 24 * 60 * 60 * 1000 // 天
    };

    return value * (multipliers[unit] || multipliers['h']);
  }

  // 獲取必要的欄位清單（需要傳入產品特定的 fieldMapping）
  getRequiredFields(fieldMapping) {
    if (!fieldMapping) {
      return [];
    }
    return Object.values(fieldMapping).map(field => field.elk_field);
  }

  // 執行 Elasticsearch 查詢（支援動態索引）
  // options 可以包含: { indexPattern, fieldMapping }
  async queryElasticsearch(timeRange = '1h', options = {}) {
    const { indexPattern, fieldMapping, ...filters } = options;
    
    try {
      await this.ensureConnection();
    } catch (error) {
      console.log('⚠️ 單例連接失敗，嘗試使用新實例...');
      // 如果單例連接失敗，使用新實例
      return await this.queryWithNewInstance(timeRange, options);
    }

    try {
      const query = this.buildElasticsearchQuery(timeRange, filters, fieldMapping, ELK_CONFIG.elasticsearch.maxResults);
      
      // 使用提供的索引模式，或回退到預設
      const targetIndex = indexPattern || ELK_CONFIG.elasticsearch.index;
      
      console.log('📊 執行 Elasticsearch 查詢...');
      console.log('查詢範圍:', timeRange);
      console.log('篩選條件:', filters);
      console.log('索引:', targetIndex);
      console.log('查詢內容:', JSON.stringify(query, null, 2));

      const requestTimeout = this.getTimeoutMs();
      const callStart = Date.now();
      console.log(`🛰️ 開始呼叫 MCP 工具 search，timeout = ${requestTimeout}ms`);

      // 使用 MCP 工具執行查詢
      const result = await this.client.callTool({
        name: 'search',
        arguments: {
          index: targetIndex,
          query_body: query
        }
      }, undefined, {
        timeout: requestTimeout,  // 依環境變數設定超時
        resetTimeoutOnProgress: true,  // 收到進度通知時重置超時
        onprogress: (progress) => {
          try {
            const summary = JSON.stringify(progress);
            console.log('📡 MCP 進度通知:', summary.length > 500 ? `${summary.slice(0, 500)}...` : summary);
          } catch {
            console.log('📡 MCP 進度通知（無法序列化）', progress);
          }
        }
      });
      console.log(`✅ MCP 工具 search 完成，耗時 ${Date.now() - callStart}ms`);

      if (result.isError) {
        throw new Error(`Elasticsearch 查詢錯誤: ${result.content[0]?.text || 'Unknown error'}`);
      }

      // 處理 MCP Server 的文本回應
      const responseText = result.content[0]?.text || '';
      console.log('MCP Server 回應 (摘要):', responseText.substring(0, 200) + '...');
      
      // 檢查是否有第二個 content（實際的資料）
      const dataText = result.content[1]?.text || responseText;
      console.log('實際資料長度:', dataText.length, '前 100 字元:', dataText.substring(0, 100));
      
      // 嘗試解析 JSON 回應
      let responseData;
      try {
        // 首先嘗試解析為記錄陣列（最常見的情況）
        const records = JSON.parse(dataText);
        if (Array.isArray(records)) {
          console.log(`✅ 解析為記錄陣列，找到 ${records.length} 筆記錄`);
          return {
            total: records.length,
            hits: records.map((record, index) => ({
              id: record.RayID || record._id || index.toString(),
              source: record,
              timestamp: record["@timestamp"]
            }))
          };
        } else {
          // 如果不是陣列，可能是標準 Elasticsearch 格式
          responseData = records;
        }
      } catch (e) {
        // 如果都無法解析，嘗試從摘要中提取數字
        console.log('回應不是 JSON 格式，嘗試解析摘要');
        const match = responseText.match(/Total results: (\d+)/);
        if (match) {
          const totalCount = parseInt(match[1]);
          console.log(`從摘要中發現 ${totalCount} 筆記錄，但無法解析詳細資料`);
          // 如果有資料但無法解析，回傳簡化的模擬資料
          if (totalCount > 0) {
            return {
              total: totalCount,
              hits: [],
              summary: `發現 ${totalCount} 筆記錄，但資料格式無法解析`
            };
          }
        }
        return {
          total: 0,
          hits: [],
          summary: responseText
        };
      }
      
      // 處理標準 Elasticsearch 回應格式
      const hits = responseData.hits?.hits || [];

      console.log(`✅ 查詢完成，找到 ${hits.length} 筆記錄`);
      
      return {
        total: responseData.hits?.total?.value || hits.length,
        hits: hits.map(hit => ({
          id: hit._id,
          source: hit._source,
          timestamp: hit._source["@timestamp"]
        }))
      };

    } catch (error) {
      console.error(`❌ Elasticsearch 查詢失敗 (耗時 ${Date.now() - callStart}ms):`, error.message);
      throw error;
    }
  }

  // 獲取攻擊相關的日誌
  async getAttackLogs(timeRange = '1h') {
    return await this.queryElasticsearch(timeRange, {
      minWafScore: 80, // WAF 分數 80 以下視為攻擊
      securityAction: 'block' // 被阻擋的請求
    });
  }

  // 獲取特定 IP 的活動
  async getIPActivity(clientIp, timeRange = '1h') {
    return await this.queryElasticsearch(timeRange, {
      clientIp: clientIp
    });
  }

  // ✅ 已移除 getSecurityStats() 方法
  // 原因: 該方法使用了不存在的 'elasticsearch_query' MCP 工具
  // 
  // 替代方案:
  // 1. 使用 queryElasticsearch() 方法取得原始日誌資料（使用 'search' 工具）
  // 2. 在應用層進行統計分析
  // 3. 或使用產品專屬的 WAF 風險分析服務:
  //    - CloudflareWAFRiskService.analyzeCloudflareWAF()
  //    - F5WAFRiskService.analyzeF5WAF()
  //
  // 範例：
  // const elkData = await elkMCPClient.queryElasticsearch('1h', { 
  //   indexPattern: 'your-index-*',
  //   fieldMapping: YOUR_FIELD_MAPPING 
  // });
  // 然後在應用層進行統計計算

  // 檢查連接狀態
  isConnected() {
    return this.connected && this.client;
  }

  // 重置客戶端狀態（解決狀態污染問題）
  async resetClientState() {
    console.log('🔄 重置 ELK MCP 客戶端狀態...');
    
    // 強制斷開現有連接
    if (this.client) {
      try {
        await this.client.close();
      } catch (error) {
        // 忽略關閉錯誤
      }
    }
    
    // 重置所有狀態
    this.client = null;
    this.connected = false;
    this.retryCount = 0;
    
    console.log('✅ 客戶端狀態已重置');
  }

  // 分批查詢 Elasticsearch（使用 from/size 分頁）
  // options 可以包含: { indexPattern, fieldMapping, batchSize, maxBatches }
  async queryElasticsearchBatched(timeRange = '1h', options = {}) {
    const { 
      indexPattern, 
      fieldMapping, 
      batchSize = ELK_CONFIG.elasticsearch.batchSize,  // 從 .env 的 ELK_BATCH_SIZE 讀取，預設 10
      maxBatches = ELK_CONFIG.elasticsearch.maxBatches,  // 從 .env 的 ELK_MAX_BATCHES 讀取，預設 10
      ...filters 
    } = options;
    
    try {
      await this.ensureConnection();
    } catch (error) {
      console.log('⚠️ 單例連接失敗，嘗試使用新實例...');
      throw new Error(`無法建立連接: ${error.message}`);
    }

    const targetIndex = indexPattern || ELK_CONFIG.elasticsearch.index;
    const allHits = [];
    let totalFound = 0;
    let currentBatch = 0;
    let from = 0;
    let totalQueriedCount = 0;

    console.log(`📦 開始分批查詢 Elasticsearch...`);
    console.log(`批次大小: ${batchSize}, 最大批次數: ${maxBatches}`);

    while (currentBatch < maxBatches) {
      try {
        // 建構單一批次的查詢
        const baseQuery = this.buildElasticsearchQuery(timeRange, filters, fieldMapping, batchSize);
        const batchQuery = {
          ...baseQuery,
          from: from,
          size: batchSize
        };

        console.log(`📊 執行第 ${currentBatch + 1} 批查詢 (from: ${from}, size: ${batchSize})...`);

        const requestTimeout = this.getTimeoutMs();
        const callStart = Date.now();

        // 執行單一批次查詢
        const result = await this.client.callTool({
          name: 'search',
          arguments: {
            index: targetIndex,
            query_body: batchQuery
          }
        }, undefined, {
          timeout: requestTimeout,
          resetTimeoutOnProgress: true,
          onprogress: (progress) => {
            try {
              const summary = JSON.stringify(progress);
              console.log(`📡 批次 ${currentBatch + 1} 進度:`, summary.length > 200 ? `${summary.slice(0, 200)}...` : summary);
            } catch {
              console.log(`📡 批次 ${currentBatch + 1} 進度通知（無法序列化）`);
            }
          }
        });

        console.log(`✅ 批次 ${currentBatch + 1} 完成，耗時 ${Date.now() - callStart}ms`);

        if (result.isError) {
          throw new Error(`Elasticsearch 查詢錯誤: ${result.content[0]?.text || 'Unknown error'}`);
        }

        // 解析回應
        const responseText = result.content[0]?.text || '';
        const dataText = result.content[1]?.text || responseText;
        
        let batchHits = [];
        let batchTotal = 0;

        try {
          const records = JSON.parse(dataText);
          
          if (Array.isArray(records)) {
            // 直接是記錄陣列（無法得知總數，需要繼續查詢直到沒有資料）
            batchHits = records;
            batchTotal = -1; // 標記為未知總數
          } else if (records.hits?.hits) {
            // 標準 Elasticsearch 格式
            batchHits = records.hits.hits;
            batchTotal = records.hits.total?.value || records.hits.total || batchHits.length;
          } else {
            // 其他格式，嘗試提取
            batchHits = [];
            batchTotal = 0;
          }
        } catch (parseError) {
          console.warn(`⚠️ 批次 ${currentBatch + 1} 回應解析失敗:`, parseError.message);
          batchHits = [];
          batchTotal = 0;
        }

        // 如果第一批，記錄總數（如果可取得的話）
        if (currentBatch === 0 && batchTotal >= 0) {
          totalFound = batchTotal;
          console.log(`📊 Elasticsearch 索引總共有 ${totalFound} 筆記錄`);
        } else if (currentBatch === 0 && batchTotal === -1) {
          console.log(`📊 無法取得總筆數，將持續查詢直到沒有資料`);
        }

        // 如果這批沒有資料，停止查詢
        if (batchHits.length === 0) {
          console.log(`✅ 批次 ${currentBatch + 1} 沒有更多資料，停止查詢`);
          break;
        }

        // 將這批資料加入總結果
        const formattedHits = batchHits.map(hit => {
          const source = hit._source || hit;
          return {
            id: hit._id || source.RayID || source.id || `${currentBatch}-${allHits.length}`,
            source: source,
            timestamp: source["@timestamp"]
          };
        });

        allHits.push(...formattedHits);
        totalQueriedCount = allHits.length;
        console.log(`✅ 批次 ${currentBatch + 1} 取得 ${formattedHits.length} 筆記錄，累計 ${allHits.length} 筆`);
        console.log(`🔢 總共查詢筆數（目前）: ${totalQueriedCount}`);

        // 如果這批資料少於批次大小，表示已經是最後一批
        if (batchHits.length < batchSize) {
          console.log(`✅ 已取得所有資料（最後一批）`);
          break;
        }

        // 準備下一批
        from += batchSize;
        currentBatch++;

        // 如果已取得足夠的資料（達到總數），停止查詢
        // 注意：只有在 totalFound > 0 時才檢查（避免在未知總數時誤判）
        if (totalFound > 0 && allHits.length >= totalFound) {
          console.log(`✅ 已取得所有 ${totalFound} 筆記錄`);
          break;
        }

      } catch (error) {
        console.error(`❌ 批次 ${currentBatch + 1} 查詢失敗:`, error.message);
        // 如果已經有資料，返回部分結果；否則拋出錯誤
        if (allHits.length > 0) {
          console.warn(`⚠️ 返回部分結果（${allHits.length} 筆）`);
          break;
        } else {
          throw error;
        }
      }
    }

    console.log(`✅ 分批查詢完成，共取得 ${allHits.length} 筆記錄（${currentBatch + 1} 批次）`);
    console.log(`📈 總共查詢筆數: ${totalQueriedCount}`);

    return {
      total: totalFound,
      hits: allHits,
      batches: currentBatch + 1,
      batchSize: batchSize,
      queriedCount: totalQueriedCount
    };
  }

  // 使用新實例執行查詢（回退機制）
  async queryWithNewInstance(timeRange = '1h', options = {}) {
    console.log('🆕 使用新實例執行 Elasticsearch 查詢...');
    
    const { indexPattern, fieldMapping, ...filters } = options;
    const newClient = new ElkMCPClient();
    
    try {
      await newClient.connect();
      
      const query = newClient.buildElasticsearchQuery(timeRange, filters, fieldMapping, ELK_CONFIG.elasticsearch.maxResults);
      const targetIndex = indexPattern || ELK_CONFIG.elasticsearch.index;
      
      console.log('📊 執行 Elasticsearch 查詢（新實例）...');
      console.log('查詢範圍:', timeRange);
      console.log('篩選條件:', filters);
      console.log('索引:', targetIndex);
      
      // 使用新實例執行查詢
      const result = await newClient.client.callTool({
        name: 'search',
        arguments: {
          index: targetIndex,
          query_body: query
        }
      }, undefined, {
        timeout: this.getTimeoutMs(),  // 依環境變數設定超時
        resetTimeoutOnProgress: true  // 收到進度通知時重置超時
      });

      if (result.isError) {
        throw new Error(`Elasticsearch 查詢錯誤: ${result.content[0]?.text || 'Unknown error'}`);
      }

      // 處理回應（使用與原方法相同的邏輯）
      const responseText = result.content[0]?.text || '';
      const dataText = result.content[1]?.text || responseText;
      
      let responseData;
      try {
        const records = JSON.parse(dataText);
        if (Array.isArray(records)) {
          console.log('✅ 解析為記錄陣列，找到', records.length, '筆記錄');
          responseData = { hits: records };
        } else {
          responseData = records;
        }
      } catch (parseError) {
        throw new Error(`回應解析失敗: ${parseError.message}`);
      }

      console.log('✅ 新實例查詢成功');
      return responseData;
      
    } finally {
      // 清理新實例
      await newClient.disconnect();
    }
  }

  // ========== ES|QL 查詢方法（ Cloudflare 趨勢對比分析用 ）==========

  /**
   * 建構 ES|QL 查詢語句
   * @param {Date} start - 開始時間
   * @param {Date} end - 結束時間
   * @param {number} limit - 限制筆數
   * @param {string} indexPattern - 索引模式
   * @returns {string} ES|QL 查詢語句
   */
  buildESQLQuery(start, end, limit = 10000, indexPattern = null) {
    const index = indexPattern || ELK_CONFIG.elasticsearch.index;
    const startISO = start.toISOString();
    const endISO = end.toISOString();

    // 需要保留的欄位清單（Cloudflare 日誌欄位）
    const keepFields = [
      '@timestamp',
      'ClientIP',
      'ClientASN',
      'ClientCountry',
      'ClientDeviceType',
      'ClientRequestBytes',
      'ClientRequestHost',
      'ClientRequestMethod',
      'ClientRequestPath',
      'ClientRequestProtocol',
      'ClientRequestReferer',
      'ClientRequestScheme',
      'ClientRequestURI',
      'ClientRequestUserAgent',
      'EdgeStartTimestamp',
      'EdgeEndTimestamp',
      'EdgeResponseStatus',
      'EdgeResponseBytes',
      'OriginResponseStatus',
      'SecurityAction',
      'SecurityActions',
      'SecurityRuleID',
      'SecurityRuleIDs',
      'SecurityRuleDescription',
      'WAFAttackScore',
      'WAFSQLiAttackScore',
      'WAFXSSAttackScore',
      'WAFRCEAttackScore',
      'ZoneName',
      'RayID',
      'EdgeColoCode'
    ];

    // ES|QL 查詢語法
    const query = `FROM ${index} | WHERE @timestamp >= "${startISO}" AND @timestamp <= "${endISO}" | KEEP ${keepFields.join(',')} | LIMIT ${limit}`;

    return query;
  }

  /**
   * 建構簡易 ES|QL 查詢語句（ Cloudflare 趨勢對比分析用: 使用 NOW() 相對時間）
   * @param {string} timeExpression - 時間表達式，如 "24 hours", "7 days"
   * @param {number} limit - 限制筆數
   * @param {string} indexPattern - 索引模式
   * @returns {string} ES|QL 查詢語句
   */
  buildESQLQueryRelative(timeExpression, limit = 10000, indexPattern = null) {
    const index = indexPattern || ELK_CONFIG.elasticsearch.index;

    // 需要保留的欄位清單
    const keepFields = [
      '@timestamp',
      'ClientIP',
      'ClientASN',
      'ClientCountry',
      'ClientDeviceType',
      'ClientRequestBytes',
      'ClientRequestHost',
      'ClientRequestMethod',
      'ClientRequestPath',
      'ClientRequestProtocol',
      'ClientRequestReferer',
      'ClientRequestScheme',
      'ClientRequestURI',
      'ClientRequestUserAgent',
      'EdgeStartTimestamp',
      'EdgeEndTimestamp',
      'EdgeResponseStatus',
      'EdgeResponseBytes',
      'OriginResponseStatus',
      'SecurityAction',
      'SecurityActions',
      'SecurityRuleID',
      'SecurityRuleIDs',
      'SecurityRuleDescription',
      'WAFAttackScore',
      'WAFSQLiAttackScore',
      'WAFXSSAttackScore',
      'WAFRCEAttackScore',
      'ZoneName',
      'RayID',
      'EdgeColoCode'
    ];

    // ES|QL 查詢語法（使用 NOW() 相對時間）
    const query = `FROM ${index} | WHERE @timestamp >= NOW() - ${timeExpression} | KEEP ${keepFields.join(',')} | LIMIT ${limit}`;

    return query;
  }

  /**
   * Cloudflare 趨勢對比分析用
   * 呼叫 MCP 的 esql 工具執行查詢
   * @param {string} query - ES|QL 查詢語句
   * @returns {Promise<Array>} 日誌記錄陣列
   */
  async callESQLTool(query) {
    try {
      console.log('🔍 執行 Cloudflare 趨勢對比分析用 ES|QL 查詢...');
      console.log('查詢語句:', query.substring(0, 200) + (query.length > 200 ? '...' : ''));

      const result = await this.callHttpTool('esql', { query });

      if (result.isError) {
        throw new Error(`ES|QL 查詢錯誤: ${result.content?.[0]?.text || 'Unknown error'}`);
      }

      // 解析 ES|QL 回應格式
      const responseText = result.content?.[0]?.text || '';
      const dataText = result.content?.[1]?.text || responseText;

      let records = [];

      try {
        const parsed = JSON.parse(dataText);

        // ES|QL 回應格式通常是 { columns: [...], values: [...] }
        if (parsed.columns && parsed.values) {
          // 將 columns + values 轉換為物件陣列
          const columns = parsed.columns.map(col => col.name || col);
          records = parsed.values.map(row => {
            const record = {};
            columns.forEach((col, idx) => {
              record[col] = row[idx];
            });
            return record;
          });
          console.log(`✅ ES|QL 查詢成功，轉換 ${records.length} 筆記錄`);
        } else if (Array.isArray(parsed)) {
          // 已經是記錄陣列
          records = parsed;
          console.log(`✅ ES|QL 查詢成功，取得 ${records.length} 筆記錄`);
        } else {
          // 嘗試從其他格式提取
          console.warn('⚠️ ES|QL 回應格式不明，嘗試直接使用');
          records = [parsed];
        }
      } catch (parseError) {
        console.error('❌ ES|QL 回應解析失敗:', parseError.message);
        console.log('原始回應:', responseText.substring(0, 500));
        throw new Error(`ES|QL 回應解析失敗: ${parseError.message}`);
      }

      return records;
    } catch (error) {
      console.error('❌ ES|QL 查詢失敗:', error.message);
      throw error;
    }
  }

  /**
   * Cloudflare 趨勢對比分析用
   * 根據時間範圍生成查詢批次
   * @param {string} timeRange - 時間範圍（1h, 6h, 1d, 3d, 7d, 30d）
   * @returns {Array} 批次物件陣列
   */
  generateTimeBatches(timeRange) {
    const now = new Date();

    // 時間範圍配置（毫秒）
    const TIME_RANGES = {
      '1h': { ms: 60 * 60 * 1000, batches: 1 },
      '6h': { ms: 6 * 60 * 60 * 1000, batches: 1 },
      '1d': { ms: 24 * 60 * 60 * 1000, batches: 4 },      // 每批 6 小時
      '3d': { ms: 3 * 24 * 60 * 60 * 1000, batches: 6 },  // 每批 12 小時
      '7d': { ms: 7 * 24 * 60 * 60 * 1000, batches: 7 },  // 每批 1 天
      '30d': { ms: 30 * 24 * 60 * 60 * 1000, batches: 10 } // 每批 3 天
    };

    const config = TIME_RANGES[timeRange];
    if (!config) {
      throw new Error(`不支援的時間範圍: ${timeRange}。支援: ${Object.keys(TIME_RANGES).join(', ')}`);
    }

    const totalDuration = config.ms;
    const batchCount = config.batches;
    const batchDuration = totalDuration / batchCount;

    const batches = [];
    for (let i = 0; i < batchCount; i++) {
      const batchEnd = new Date(now.getTime() - (i * batchDuration));
      const batchStart = new Date(batchEnd.getTime() - batchDuration);

      batches.push({
        start: batchStart,
        end: batchEnd,
        batchIndex: i + 1,
        totalBatches: batchCount,
        description: `批次 ${i + 1}/${batchCount}`
      });
    }

    // 反轉順序，從最早的批次開始查詢
    return batches.reverse();
  }

  /**
   * Cloudflare 趨勢對比分析用
   * 使用 ES|QL 分時間批次查詢
   * @param {string} timeRange - 時間範圍（1h, 6h, 1d, 3d, 7d, 30d）
   * @param {Function} progressCallback - 進度回調函數
   * @param {string} indexPattern - 索引模式（可選）
   * @returns {Promise<Array>} 合併後的日誌記錄陣列
   */
  async queryESQLTimeBatched(timeRange, progressCallback = null, indexPattern = null) {
    console.log(`\n🚀 開始 ES|QL 分批查詢 (時間範圍: ${timeRange})`);

    // 生成批次
    const batches = this.generateTimeBatches(timeRange);
    console.log(`📋 生成 ${batches.length} 個查詢批次`);

    const allRecords = [];
    let successCount = 0;
    const partialFailures = [];

    for (const batch of batches) {
      try {
        // 進度回報：批次開始
        if (progressCallback) {
          progressCallback({
            type: 'batch_start',
            batchIndex: batch.batchIndex,
            totalBatches: batch.totalBatches,
            description: batch.description,
            timeRange: `${batch.start.toISOString()} - ${batch.end.toISOString()}`
          });
        }

        console.log(`\n🔍 執行 ${batch.description}...`);
        console.log(`   時間範圍: ${batch.start.toISOString()} - ${batch.end.toISOString()}`);

        // 建構並執行 ES|QL 查詢
        const query = this.buildESQLQuery(batch.start, batch.end, 10000, indexPattern);
        const records = await this.callESQLTool(query);

        if (records && records.length > 0) {
          allRecords.push(...records);
          successCount++;
          console.log(`✅ ${batch.description} 完成，取得 ${records.length} 筆記錄`);
        } else {
          console.log(`⚠️ ${batch.description} 無資料`);
        }

        // 進度回報：批次完成
        if (progressCallback) {
          progressCallback({
            type: 'batch_complete',
            batchIndex: batch.batchIndex,
            totalBatches: batch.totalBatches,
            recordCount: records ? records.length : 0,
            success: true
          });
        }

      } catch (error) {
        console.error(`❌ ${batch.description} 失敗:`, error.message);
        partialFailures.push({
          batch: batch.description,
          error: error.message,
          timeRange: `${batch.start.toISOString()} - ${batch.end.toISOString()}`
        });

        // 進度回報：批次錯誤
        if (progressCallback) {
          progressCallback({
            type: 'batch_error',
            batchIndex: batch.batchIndex,
            totalBatches: batch.totalBatches,
            error: error.message
          });
        }

        // 繼續執行其他批次
        console.log(`⏭️ 跳過失敗的批次，繼續處理...`);
      }

      // 批次間延遲（避免過載）
      if (batch.batchIndex < batch.totalBatches) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    // 統計結果
    console.log(`\n📊 ES|QL 分批查詢完成:`);
    console.log(`   成功批次: ${successCount}/${batches.length}`);
    console.log(`   總記錄數: ${allRecords.length}`);
    if (partialFailures.length > 0) {
      console.log(`   失敗批次: ${partialFailures.length}`);
      partialFailures.forEach(f => console.log(`     - ${f.batch}: ${f.error}`));
    }

    // 按時間排序
    allRecords.sort((a, b) => {
      const timeA = new Date(a['@timestamp'] || a.EdgeStartTimestamp || a.timestamp || 0);
      const timeB = new Date(b['@timestamp'] || b.EdgeStartTimestamp || b.timestamp || 0);
      return timeA - timeB;
    });

    return allRecords;
  }

  // ========== Cloudflare 趨勢對比分析用 ES|QL 查詢方法結束 ==========

  // 測試連接
  async testConnection() {
    try {
      // 🔧 使用新實例進行測試（避免單例狀態污染）
      console.log('🔬 使用新實例測試 ELK MCP 連接...');
      const testClient = new ElkMCPClient();
      
      await testClient.connect();
      
      // 執行簡單的測試查詢
      const testResult = await testClient.client.callTool({
        name: 'search',
        arguments: {
          index: ELK_CONFIG.elasticsearch.index,
          query_body: {
            query: { match_all: {} },
            size: 1
          }
        }
      });

      const success = !testResult.isError;
      
      // 清理測試實例
      await testClient.disconnect();
      
      if (success) {
        console.log('✅ ELK MCP 連接測試成功');
        // 如果測試成功，重置單例狀態並建立新連接
        await this.resetClientState();
        await this.ensureConnection();
      }
      
      return success;
    } catch (error) {
      console.error('連接測試失敗:', error.message);
      return false;
    }
  }
}

// 建立單例實例
const elkMCPClient = new ElkMCPClient();

// 優雅關閉處理
process.on('SIGINT', async () => {
  console.log('\n正在關閉 ELK MCP 連接...');
  await elkMCPClient.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n正在關閉 ELK MCP 連接...');
  await elkMCPClient.disconnect();
  process.exit(0);
});

module.exports = { ElkMCPClient, elkMCPClient }; 