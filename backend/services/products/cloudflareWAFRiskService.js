// backend/services/products/cloudflareWAFRiskService.js
// Cloudflare WAF 風險分析服務
// 專門分析 Cloudflare WAF 日誌並生成風險評估報告

const { elkMCPClient } = require('../elkMCPClient');
const { CLOUDFLARE_FIELD_MAPPING } = require('../../config/products/cloudflare/cloudflareFieldMapping');
const cloudflareELKConfig = require('../../config/products/cloudflare/cloudflareELKConfig');
const {
  classifyWAFScore,
  isCloudflareInternalEndpoint,
  isValidWAFScore,
  isRealSecurityThreat,
  calculateValidAvgScore,
  RECOMMENDED_THRESHOLDS,
  WAF_SCORE_CLASSIFICATION
} = require('../../config/products/cloudflare/cloudflareStandards');

class CloudflareWAFRiskService {
  constructor() {
    console.log('🔧 初始化 Cloudflare WAF 風險分析服務...');
    this.elkClient = elkMCPClient;
    this.elkConfig = cloudflareELKConfig;
    this.fieldMapping = CLOUDFLARE_FIELD_MAPPING;
  }
  
  // ⭐ 主要方法：分析 Cloudflare WAF 風險
  async analyzeCloudflareWAF(timeRange = '24h') {
    console.log(`\n🔍 ===== 開始 Cloudflare WAF 風險分析 =====`);
    console.log(`📅 時間範圍: ${timeRange}`);
    console.log(`📊 索引: ${this.elkConfig.index}`);
    
    try {
      // ⭐ Step 1: 透過 ELK MCP 查詢 Cloudflare 日誌
      console.log('\n⭐ Step 1: 透過 MCP 查詢 Cloudflare 日誌...');
      const elkData = await this.elkClient.queryElasticsearch(timeRange, {
        indexPattern: this.elkConfig.index,
        fieldMapping: this.fieldMapping
      });
      
      if (!elkData.hits || elkData.hits.length === 0) {
        console.log('⚠️ 未找到日誌資料');
        return this.getEmptyAnalysisResult();
      }
      
      // Step 2: 使用 cloudflare-field-mapping 解析資料
      console.log(`\n⭐ Step 2: 解析 ${elkData.hits.length} 筆日誌...`);
      const logEntries = elkData.hits.map(hit => this.parseCloudflareLog(hit.source));
      console.log(`✅ 成功解析 ${logEntries.length} 筆日誌`);
      
      // Step 3: 分析各種攻擊類型
      console.log('\n⭐ Step 3: 分析攻擊模式...');
      const sqlInjection = this.analyzeSQLInjection(logEntries);
      console.log(`   SQL 注入: ${sqlInjection.count} 次 (高風險: ${sqlInjection.highRisk})`);
      
      const xssAttacks = this.analyzeXSSAttacks(logEntries);
      console.log(`   XSS 攻擊: ${xssAttacks.count} 次 (高風險: ${xssAttacks.highRisk})`);
      
      const rceAttacks = this.analyzeRCEAttacks(logEntries);
      console.log(`   RCE 攻擊: ${rceAttacks.count} 次 (高風險: ${rceAttacks.highRisk})`);
      
      const botTraffic = this.analyzeBotTraffic(logEntries);
      console.log(`   惡意機器人: ${botTraffic.count} 次`);
      
      const pathTraversal = this.analyzePathTraversal(logEntries);
      console.log(`   路徑遍歷: ${pathTraversal.count} 次`);
      
      const abnormalUA = this.analyzeAbnormalUA(logEntries);
      console.log(`   異常 UA: ${abnormalUA.count} 次`);
      
      // Step 4: 生成地理和時間分析
      console.log('\n⭐ Step 4: 生成統計資料...');
      const geoAnalysis = this.analyzeGeoDistribution(logEntries);
      const assetAnalysis = this.analyzeAffectedAssets(logEntries);
      
      // 計算時間範圍
      const timestamps = logEntries
        .map(log => log.timestamp)
        .filter(t => t)
        .map(t => new Date(t).getTime());
      
      const timeRange_result = {
        start: timestamps.length > 0 ? new Date(Math.min(...timestamps)).toISOString() : new Date().toISOString(),
        end: timestamps.length > 0 ? new Date(Math.max(...timestamps)).toISOString() : new Date().toISOString()
      };
      
      console.log('\n✅ ===== Cloudflare WAF 風險分析完成 =====\n');
      
      return {
        sqlInjection,
        xssAttacks,
        rceAttacks,
        botTraffic,
        pathTraversal,
        abnormalUA,
        geoAnalysis,
        assetAnalysis,
        totalEvents: logEntries.length,
        timeRange: timeRange_result
      };
      
    } catch (error) {
      console.error('❌ Cloudflare WAF 風險分析失敗:', error);
      throw error;
    }
  }
  
  // 解析 Cloudflare 日誌（使用 cloudflare-field-mapping）
  parseCloudflareLog(rawLog) {
    return {
      rayId: rawLog[this.fieldMapping.ray_id.elk_field],
      clientIP: rawLog[this.fieldMapping.client_ip.elk_field],
      clientCountry: rawLog[this.fieldMapping.client_country.elk_field],
      clientASN: rawLog[this.fieldMapping.client_asn.elk_field],
      requestURI: rawLog[this.fieldMapping.client_request_uri.elk_field],
      requestMethod: rawLog[this.fieldMapping.client_request_method.elk_field],
      userAgent: rawLog[this.fieldMapping.client_request_user_agent.elk_field],
      wafAttackScore: rawLog[this.fieldMapping.waf_attack_score.elk_field],
      wafSQLiScore: rawLog[this.fieldMapping.waf_sqli_attack_score.elk_field],
      wafXSSScore: rawLog[this.fieldMapping.waf_xss_attack_score.elk_field],
      wafRCEScore: rawLog[this.fieldMapping.waf_rce_attack_score.elk_field],
      securityAction: rawLog[this.fieldMapping.security_action.elk_field],
      securityRule: rawLog[this.fieldMapping.security_rule_id.elk_field],  // 修復：security_rule_description → security_rule_id
      edgeHost: rawLog[this.fieldMapping.client_request_host.elk_field],    // 修復：edge_request_host → client_request_host
      timestamp: rawLog[this.fieldMapping.edge_start_timestamp.elk_field]
    };
  }
  
  // 分析 SQL 注入（使用 Cloudflare 官方標準）
  // 官方定義：分數 1-20 = Attack, 21-50 = Likely Attack
  analyzeSQLInjection(logEntries) {
    // 過濾：排除內部端點 + 有效分數 + 分數 <= 50
    const sqliLogs = logEntries.filter(log => 
      !isCloudflareInternalEndpoint(log.requestURI) &&  // ✅ 排除 Cloudflare 內部服務
      (
        (isValidWAFScore(log.wafSQLiScore) && log.wafSQLiScore <= 50) ||  // ✅ 有效分數 1-50
        (log.securityRule && log.securityRule.toLowerCase().includes('sql'))  // 或觸發 SQL 規則
      )
    );
    
    // 高風險：分數 1-20（官方 Attack 級別）
    const highRiskLogs = sqliLogs.filter(log => 
      isValidWAFScore(log.wafSQLiScore) && 
      log.wafSQLiScore >= 1 && 
      log.wafSQLiScore <= RECOMMENDED_THRESHOLDS.HIGH  // <= 20
    );
    
    return {
      count: sqliLogs.length,
      highRisk: highRiskLogs.length,
      topIPs: this.getTopN(sqliLogs, 'clientIP', 10),
      topTargets: this.getTopN(sqliLogs, 'requestURI', 10),
      topCountries: this.getTopN(sqliLogs, 'clientCountry', 5),
      affectedAssets: new Set(sqliLogs.map(log => log.edgeHost).filter(h => h)).size,
      avgScore: calculateValidAvgScore(sqliLogs, 'wafSQLiScore')  // ✅ 只計算有效分數
    };
  }
  
  // 分析 XSS 攻擊（使用 Cloudflare 官方標準）
  analyzeXSSAttacks(logEntries) {
    const xssLogs = logEntries.filter(log => 
      !isCloudflareInternalEndpoint(log.requestURI) &&  // ✅ 排除內部端點
      (
        (isValidWAFScore(log.wafXSSScore) && log.wafXSSScore <= 50) ||  // ✅ 有效分數 1-50
        (log.securityRule && log.securityRule.toLowerCase().includes('xss')) ||
        (log.requestURI && (log.requestURI.includes('<script') || log.requestURI.includes('javascript:')))
      )
    );
    
    // 高風險：分數 1-20（官方 Attack 級別）
    const highRiskLogs = xssLogs.filter(log => 
      isValidWAFScore(log.wafXSSScore) && 
      log.wafXSSScore >= 1 && 
      log.wafXSSScore <= RECOMMENDED_THRESHOLDS.HIGH  // <= 20
    );
    
    return {
      count: xssLogs.length,
      highRisk: highRiskLogs.length,
      topIPs: this.getTopN(xssLogs, 'clientIP', 10),
      topTargets: this.getTopN(xssLogs, 'requestURI', 10),
      topCountries: this.getTopN(xssLogs, 'clientCountry', 5),
      affectedAssets: new Set(xssLogs.map(log => log.edgeHost).filter(h => h)).size,
      avgScore: calculateValidAvgScore(xssLogs, 'wafXSSScore')  // ✅ 只計算有效分數
    };
  }
  
  // 分析 RCE 攻擊（使用 Cloudflare 官方標準）
  analyzeRCEAttacks(logEntries) {
    const rceLogs = logEntries.filter(log => 
      !isCloudflareInternalEndpoint(log.requestURI) &&  // ✅ 排除內部端點
      (
        (isValidWAFScore(log.wafRCEScore) && log.wafRCEScore <= 50) ||  // ✅ 有效分數 1-50
        (log.securityRule && (log.securityRule.toLowerCase().includes('rce') || 
                             log.securityRule.toLowerCase().includes('remote code')))
      )
    );
    
    // 高風險：分數 1-20（官方 Attack 級別）
    const highRiskLogs = rceLogs.filter(log => 
      isValidWAFScore(log.wafRCEScore) && 
      log.wafRCEScore >= 1 && 
      log.wafRCEScore <= RECOMMENDED_THRESHOLDS.HIGH  // <= 20
    );
    
    return {
      count: rceLogs.length,
      highRisk: highRiskLogs.length,
      topIPs: this.getTopN(rceLogs, 'clientIP', 10),
      topTargets: this.getTopN(rceLogs, 'requestURI', 10),
      topCountries: this.getTopN(rceLogs, 'clientCountry', 5),
      affectedAssets: new Set(rceLogs.map(log => log.edgeHost).filter(h => h)).size,
      avgScore: calculateValidAvgScore(rceLogs, 'wafRCEScore')  // ✅ 只計算有效分數
    };
  }
  
  // 分析惡意機器人流量
  analyzeBotTraffic(logEntries) {
    // 檢測機器人特徵：User-Agent、請求模式
    const botLogs = logEntries.filter(log => {
      const ua = (log.userAgent || '').toLowerCase();
      return ua.includes('bot') || 
             ua.includes('crawler') || 
             ua.includes('spider') ||
             ua.includes('python') ||
             ua.includes('curl') ||
             ua.includes('wget');
    });
    
    return {
      count: botLogs.length,
      topIPs: this.getTopN(botLogs, 'clientIP', 10),
      topCountries: this.getTopN(botLogs, 'clientCountry', 5),
      topASNs: this.getTopN(botLogs, 'clientASN', 5),
      affectedAssets: new Set(botLogs.map(log => log.edgeHost).filter(h => h)).size
    };
  }
  
  // 分析路徑遍歷攻擊
  analyzePathTraversal(logEntries) {
    const pathTraversalLogs = logEntries.filter(log => {
      const uri = (log.requestURI || '').toLowerCase();
      return uri.includes('../') || 
             uri.includes('..\\') || 
             uri.includes('%2e%2e') ||
             uri.includes('traversal');
    });
    
    const sensitiveFiles = this.extractSensitiveFiles(pathTraversalLogs);
    
    return {
      count: pathTraversalLogs.length,
      topIPs: this.getTopN(pathTraversalLogs, 'clientIP', 10),
      sensitiveFiles: sensitiveFiles,
      affectedAssets: new Set(pathTraversalLogs.map(log => log.edgeHost).filter(h => h)).size
    };
  }
  
  // 分析異常 User-Agent
  analyzeAbnormalUA(logEntries) {
    const abnormalUALogs = logEntries.filter(log => {
      const ua = log.userAgent || '';
      
      // 空 UA
      if (ua.length === 0) return true;
      
      // 異常短
      if (ua.length < 10) return true;
      
      // 異常長
      if (ua.length > 500) return true;
      
      // 明顯的掃描工具
      const lowerUA = ua.toLowerCase();
      const scanTools = ['sqlmap', 'nmap', 'nikto', 'masscan', 'zap', 'burp', 'metasploit'];
      return scanTools.some(tool => lowerUA.includes(tool));
    });
    
    return {
      count: abnormalUALogs.length,
      topIPs: this.getTopN(abnormalUALogs, 'clientIP', 10),
      examples: [...new Set(abnormalUALogs.map(log => log.userAgent))].slice(0, 5),
      affectedAssets: new Set(abnormalUALogs.map(log => log.edgeHost).filter(h => h)).size
    };
  }
  
  // 分析地理分佈
  analyzeGeoDistribution(logEntries) {
    return {
      topCountries: this.getTopN(logEntries, 'clientCountry', 10),
      topIPs: this.getTopN(logEntries, 'clientIP', 20),
      topASNs: this.getTopN(logEntries, 'clientASN', 10)
    };
  }
  
  // 分析受影響資產
  analyzeAffectedAssets(logEntries) {
    const assetCounts = this.getTopN(logEntries, 'edgeHost', 20);
    return {
      totalAssets: new Set(logEntries.map(log => log.edgeHost).filter(h => h)).size,
      topAssets: assetCounts
    };
  }
  
  // 提取敏感檔案
  extractSensitiveFiles(logs) {
    const sensitivePatterns = [
      '.env', 'config', '.git', 'wp-config', 'web.config', 
      'admin', '.htaccess', '.htpasswd', 'id_rsa', 'authorized_keys',
      '.aws', '.ssh', 'database.yml', 'settings.py'
    ];
    const found = new Set();
    
    logs.forEach(log => {
      const uri = log.requestURI || '';
      sensitivePatterns.forEach(pattern => {
        if (uri.toLowerCase().includes(pattern)) {
          found.add(uri);
        }
      });
    });
    
    return Array.from(found).slice(0, 15);
  }
  
  // 生成 AI 分析 Prompt（基於真實資料 - 升級版）
  generateAIPrompt(analysisData) {
    const {
      sqlInjection,
      xssAttacks,
      rceAttacks,
      botTraffic,
      pathTraversal,
      abnormalUA,
      geoAnalysis,
      assetAnalysis,
      totalEvents,
      timeRange
    } = analysisData;

    // ============================
    // 🔥 關鍵改變：動態構建攻擊統計
    // ============================
    
    const attackSections = [];

    // 只添加檢測次數 > 0 的攻擊類型
    if (sqlInjection.count > 0) {
      attackSections.push({
        type: 'SQL 注入攻擊',
        data: sqlInjection,
        description: 'WAFSQLiAttackScore <= 50 或 SecurityRule 包含 "sql"'
      });
    }

    if (xssAttacks.count > 0) {
      attackSections.push({
        type: 'XSS 跨站腳本攻擊',
        data: xssAttacks,
        description: 'WAFXSSAttackScore <= 50 或 SecurityRule 包含 "xss"'
      });
    }

    if (rceAttacks.count > 0) {
      attackSections.push({
        type: 'RCE 遠程代碼執行攻擊',
        data: rceAttacks,
        description: 'WAFRCEAttackScore <= 50 或 SecurityRule 包含 "rce"'
      });
    }

    if (botTraffic.count > 0) {
      attackSections.push({
        type: '惡意機器人流量',
        data: botTraffic,
        description: 'BotScore < 30 或 BotTags 包含 "malicious"'
      });
    }

    if (pathTraversal.count > 0) {
      attackSections.push({
        type: '路徑遍歷攻擊',
        data: pathTraversal,
        description: 'URI 包含 "../", "..\\\\", "%2e%2e" 或敏感檔案路徑'
      });
    }

    if (abnormalUA.count > 0) {
      attackSections.push({
        type: '異常 User-Agent',
        data: abnormalUA,
        description: 'User-Agent 長度異常或包含掃描工具特徵'
      });
    }

    // ============================
    // 構建攻擊統計文字
    // ============================
    
    let attackStatisticsText = '';
    
    if (attackSections.length === 0) {
      attackStatisticsText = `
**未檢測到任何安全威脅**

在指定時間範圍內，經過 Cloudflare WAF 的完整分析後，未檢測到任何 SQL 注入、XSS、RCE、路徑遍歷攻擊或異常機器人流量。所有請求均通過安全檢查。

⚠️ **重要**：由於沒有檢測到任何攻擊，請輸出空的 risks 陣列：
\`\`\`json
{
  "risks": []
}
\`\`\`
`;
    } else {
      attackStatisticsText = attackSections.map((section, index) => {
        const { type, data, description } = section;
        
        return `
${index + 1}. **${type}**
   - 檢測方式: ${description}
   - 檢測次數: ${data.count}
   ${data.highRisk !== undefined ? `- 高風險 (WAF分數 1-20): ${data.highRisk}` : ''}
   ${data.avgScore !== undefined && data.avgScore !== 'N/A' ? `- 平均 WAF 分數: ${data.avgScore}` : ''}
   - 受影響資產: ${data.affectedAssets}
   - Top 5 來源IP: ${data.topIPs ? data.topIPs.slice(0, 5).map(ip => `${ip.item} (${ip.count}次)`).join(', ') : '無'}
   - Top 5 來源國家: ${data.topCountries ? data.topCountries.map(c => `${c.item} (${c.count}次)`).join(', ') : '無'}
   ${data.topTargets ? `- Top 5 攻擊目標: ${data.topTargets.slice(0, 5).map(t => `${t.item} (${t.count}次)`).join(', ')}` : ''}
   ${data.sensitiveFiles ? `- 敏感檔案探測: ${data.sensitiveFiles.slice(0, 5).join(', ')}` : ''}
`.trim();
      }).join('\n\n');
    }

    // ============================
    // 生成完整的 Prompt 模板
    // ============================
    
    const promptTemplate = `
你是一位資深的網路安全分析專家，專精於 Cloudflare WAF 日誌分析和威脅識別。

### 【任務說明】

請根據以下 Cloudflare WAF 日誌數據，**自動識別並分類所有攻擊類型**，生成完整的風險評估報告。

**重要：請不要使用預設的攻擊類型清單。所有攻擊類型都應該從日誌數據中自動識別。**

---

### 【資料來源】

- **索引名稱**: ${this.elkConfig.index}
- **時間範圍**: ${timeRange.start} ~ ${timeRange.end}
- **總日誌數**: ${totalEvents.toLocaleString()} 筆
- **分析時間**: ${new Date().toISOString()}

---

### 【Cloudflare WAF 攻擊分數系統（官方標準）】

**分數範圍**: 1-99（分數越低越危險）

- **1-20**: Attack（攻擊） - 幾乎確定是惡意攻擊
- **21-50**: Likely Attack（可能攻擊） - 可能是攻擊，但此範圍容易誤報
- **51-80**: Likely Clean（可能正常） - 可能是正常流量
- **81-99**: Clean（正常） - 很可能是正常流量
- **100 或 0**: Unscored（未評分） - WAF 沒有評分此請求

**重要規則**:
- 分數 0 或 100 = 未評分，**不代表攻擊**，已自動排除
- 只有分數 1-99 才是有效的評分結果
- 所有內部 Cloudflare 端點（\`/cdn-cgi/*\`）已自動過濾

---

### 【攻擊統計（基於真實 Cloudflare 日誌）】

${attackStatisticsText}

---

### 【地理與資產分析】

- **Top 10 攻擊來源國家**: ${geoAnalysis.topCountries.slice(0, 10).map(c => `${c.item} (${c.count}次)`).join(', ') || '無'}
- **Top 10 攻擊來源IP**: ${geoAnalysis.topIPs.slice(0, 10).map(ip => `${ip.item} (${ip.count}次)`).join(', ') || '無'}
- **受影響資產總數**: ${assetAnalysis.totalAssets}
- **Top 5 被攻擊資產**: ${assetAnalysis.topAssets.slice(0, 5).map(a => `${a.item} (${a.count}次)`).join(', ') || '無'}

---

### 【OWASP TOP 10 2021 分類參考】

在識別攻擊類型時，請參考 OWASP TOP 10 2021 分類：

1. **A01:2021 – Broken Access Control** (存取控制失效)
2. **A02:2021 – Cryptographic Failures** (加密機制失效)
3. **A03:2021 – Injection** (注入攻擊) ← SQL 注入、XSS、命令注入
4. **A04:2021 – Insecure Design** (不安全設計)
5. **A05:2021 – Security Misconfiguration** (安全配置錯誤)
6. **A06:2021 – Vulnerable and Outdated Components** (危險或過舊的元件)
7. **A07:2021 – Identification and Authentication Failures** (認證及驗證機制失效)
8. **A08:2021 – Software and Data Integrity Failures** (軟體及資料完整性失效)
9. **A09:2021 – Security Logging and Monitoring Failures** (資安記錄及監控失效)
10. **A10:2021 – Server-Side Request Forgery (SSRF)** (伺服器端請求偽造)

---

### 【輸出格式要求】

請生成 **嚴格的 JSON 格式** 風險報告：

\`\`\`json
{
  "risks": [
    {
      "id": "攻擊類型-唯一識別碼-時間戳",
      "title": "攻擊標題（簡潔明確）",
      "severity": "critical | high | medium | low",
      "openIssues": 檢測次數（數字）,
      "resolvedIssues": 0,
      "affectedAssets": 受影響的唯一主機名稱數量（數字）,
      "tags": ["Exploit In Wild", "Internet Exposed", "Confirmed Exploitable"],
      "description": "詳細描述（200-300字）",
      "aiInsight": "AI 深度分析（100-150字），必須包含具體數字、WAF分數、來源、目標、建議",
      "createdDate": "Apr 8, 2025",
      "updatedDate": "Apr 9, 2025",
      "exploitInWild": true | false,
      "internetExposed": true,
      "confirmedExploitable": true | false,
      "cveId": null,
      "recommendations": [
        {
          "title": "建議標題",
          "description": "建議描述（150-200字）",
          "priority": "high | medium | low"
        }
      ]
    }
  ]
}
\`\`\`

---

### 【輸出規則】

1. ⚠️ **關鍵規則**：只生成上面「攻擊統計」中明確列出的攻擊類型
2. ⚠️ **絕對禁止**：不要生成任何在「攻擊統計」中未列出的攻擊類型
3. ⚠️ **嚴格要求**：如果某個攻擊類型的檢測次數為 0，該類型不會出現在「攻擊統計」中，也絕對不要在 risks 中生成
4. ⚠️ **CVE 編號規則**：將 cveId 設為 null（系統無法從日誌準確推導 CVE）
5. 每個風險至少提供 2-3 個具體建議
6. aiInsight 必須包含具體數字、WAF 分數、Top 來源、Top 目標
7. 描述要具體提到檢測到的攻擊特徵和 OWASP 分類

---

請以繁體中文回答，**務必輸出純 JSON 格式**，不要有 markdown 或其他格式符號。
`;

    return promptTemplate.trim();
  }
  
  // 生成 Fallback 風險資料（AI 解析失敗時使用）
  generateFallbackRisks(analysisData) {
    const risks = [];
    const { sqlInjection, xssAttacks, rceAttacks, botTraffic, pathTraversal, abnormalUA, assetAnalysis } = analysisData;
    
    // 根據實際資料生成基本風險項目
    if (sqlInjection.count > 0) {
      const topCountry = sqlInjection.topCountries[0];
      const topIP = sqlInjection.topIPs[0];
      
      risks.push({
        id: `sql-injection-${Date.now()}`,
        title: 'SQL 注入攻擊檢測',
        severity: sqlInjection.highRisk > 50 ? 'critical' : sqlInjection.count > 100 ? 'high' : 'medium',
        openIssues: sqlInjection.count,
        resolvedIssues: 0,
        affectedAssets: sqlInjection.affectedAssets,
        tags: sqlInjection.highRisk > 0 ? ['Internet Exposed', 'Confirmed Exploitable'] : ['Internet Exposed'],
        description: `檢測到 ${sqlInjection.count} 次 SQL 注入攻擊嘗試，其中 ${sqlInjection.highRisk} 次為高風險攻擊（WAF分數<10）。主要來源國家：${sqlInjection.topCountries.slice(0, 3).map(c => c.item).join('、')}。`,
        aiInsight: `在過去 24 小時內檢測到 ${sqlInjection.count} 次 SQL 注入嘗試（已排除 Cloudflare 內部端點和未評分請求），其中 ${sqlInjection.highRisk} 次屬於高風險級別（WAF 分數 1-20，符合 Cloudflare 官方定義的 Attack 級別）。主要攻擊來自 ${topCountry?.item || '未知'}（${topCountry?.count || 0} 次），Top 攻擊 IP 為 ${topIP?.item || '未知'}（${topIP?.count || 0} 次）。共影響 ${sqlInjection.affectedAssets} 個資產，平均 WAF 分數為 ${sqlInjection.avgScore}${sqlInjection.avgScore <= 20 ? '（Attack 級別）' : sqlInjection.avgScore <= 50 ? '（Likely Attack 級別，但可能有誤報）' : '（Likely Clean/Clean 級別）'}。建議立即檢查受影響端點的 WAF 規則並加強監控。`,
        createdDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        updatedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        exploitInWild: sqlInjection.highRisk > 0,
        internetExposed: true,
        confirmedExploitable: sqlInjection.highRisk > 0,
        recommendations: [
          {
            title: '封鎖攻擊來源 IP',
            description: `立即在 Cloudflare WAF 中封鎖主要攻擊 IP（如 ${topIP?.item || '檢測到的攻擊 IP'}），使用 IP Lists 功能建立黑名單並配置 Custom Rule 阻擋。前往 Account Home → Configurations → Lists 建立 IP list，然後在 Custom rules 中使用 (ip.src in $blocked_ips) 表達式。`,
            priority: 'high'
          },
          {
            title: '強化輸入驗證與參數檢查',
            description: '對所有輸入參數實施嚴格的白名單檢查，並使用參數化查詢防止 SQL 注入。在 Cloudflare 中使用 Custom Rules 配置 HTTP Headers 驗證（如 X-CSRF-Token）和 Cookie 驗證（如 Session Cookie），限制敏感 API 端點的訪問。也可以使用 HMAC Token 驗證（is_timed_hmac_valid_v0 函數）提供更強的保護。',
            priority: 'high'
          },
          {
            title: '啟用 Cloudflare WAF SQL 注入防護規則',
            description: '立即啟用並強化 Cloudflare WAF 的 SQL 注入防護規則集。前往 Security → WAF → Managed rules，部署 Cloudflare Managed Ruleset 和 OWASP Core Ruleset。同時建立 Custom Rule 使用 Attack Score 阻擋高風險請求：(cf.waf.score.sqli le 20)。',
            priority: 'high'
          }
        ]
      });
    }
    
    if (xssAttacks.count > 0) {
      const topCountry = xssAttacks.topCountries[0];
      const topIP = xssAttacks.topIPs[0];
      
      risks.push({
        id: `xss-attack-${Date.now()}`,
        title: 'XSS 攻擊檢測',
        severity: xssAttacks.highRisk > 30 ? 'high' : 'medium',
        openIssues: xssAttacks.count,
        resolvedIssues: 0,
        affectedAssets: xssAttacks.affectedAssets,
        tags: ['Internet Exposed', 'Confirmed Exploitable'],
        description: `檢測到 ${xssAttacks.count} 次跨站腳本攻擊嘗試。`,
        aiInsight: `在過去 24 小時內檢測到 ${xssAttacks.count} 次 XSS 攻擊嘗試（已排除 Cloudflare 內部端點和未評分請求），其中 ${xssAttacks.highRisk} 次屬於高風險級別（WAF 分數 1-20，符合 Cloudflare 官方定義的 Attack 級別）。主要攻擊來自 ${topCountry?.item || '未知'}（${topCountry?.count || 0} 次），Top IP 為 ${topIP?.item || '未知'}。共影響 ${xssAttacks.affectedAssets} 個資產，平均 WAF 分數為 ${xssAttacks.avgScore}${xssAttacks.avgScore <= 20 ? '（Attack 級別）' : xssAttacks.avgScore <= 50 ? '（Likely Attack 級別）' : '（Likely Clean/Clean 級別）'}。建議立即啟用 CSP 並檢查輸入驗證機制。`,
        createdDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        updatedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        exploitInWild: false,
        internetExposed: true,
        confirmedExploitable: xssAttacks.highRisk > 0,
        recommendations: [
          {
            title: '封鎖攻擊來源 IP',
            description: `立即在 Cloudflare WAF 中封鎖主要攻擊 IP（如 ${topIP?.item || '檢測到的攻擊 IP'}），使用 IP Lists 功能建立黑名單。`,
            priority: 'high'
          },
          {
            title: '強化輸入驗證與 XSS 防護',
            description: '配置 Cloudflare WAF 的 XSS 防護規則，使用 Custom Rules 過濾包含 <script>、javascript: 等危險字符的請求。同時在應用層實施輸入過濾和輸出編碼，啟用 Content Security Policy (CSP) Headers 提供額外防護。',
            priority: 'high'
          },
          {
            title: '啟用 XSS 防護規則',
            description: '配置 Cloudflare WAF 的 XSS 防護規則並啟用 CSP',
            priority: 'high'
          }
        ]
      });
    }
    
    if (botTraffic.count > 100) {
      risks.push({
        id: `bot-traffic-${Date.now()}`,
        title: '惡意機器人流量',
        severity: 'medium',
        openIssues: botTraffic.count,
        resolvedIssues: 0,
        affectedAssets: botTraffic.affectedAssets,
        tags: ['Internet Exposed'],
        description: `檢測到 ${botTraffic.count} 次惡意機器人流量。`,
        createdDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        updatedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        exploitInWild: false,
        internetExposed: true,
        confirmedExploitable: false,
        recommendations: [
          {
            title: '啟用 Cloudflare Bot Management',
            description: '配置機器人管理功能以識別和阻擋惡意機器人',
            priority: 'medium'
          }
        ]
      });
    }
    
    return { risks };
  }
  
  // 工具方法：取得 Top N
  getTopN(logs, field, n) {
    const counts = new Map();
    logs.forEach(log => {
      const value = log[field];
      if (value !== undefined && value !== null && value !== '') {
        counts.set(value, (counts.get(value) || 0) + 1);
      }
    });
    
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, n)
      .map(([item, count]) => ({ item, count }));
  }
  
  // 工具方法：計算平均值
  calculateAvg(logs, field) {
    const values = logs
      .map(log => log[field])
      .filter(v => v !== undefined && v !== null && !isNaN(v));
    
    if (values.length === 0) return 'N/A';
    return (values.reduce((sum, v) => sum + v, 0) / values.length).toFixed(2);
  }
  
  // 空結果
  getEmptyAnalysisResult() {
    return {
      sqlInjection: { count: 0, highRisk: 0, topIPs: [], topTargets: [], topCountries: [], affectedAssets: 0, avgScore: 'N/A' },
      xssAttacks: { count: 0, highRisk: 0, topIPs: [], topTargets: [], topCountries: [], affectedAssets: 0, avgScore: 'N/A' },
      rceAttacks: { count: 0, highRisk: 0, topIPs: [], topTargets: [], topCountries: [], affectedAssets: 0, avgScore: 'N/A' },
      botTraffic: { count: 0, topIPs: [], topCountries: [], topASNs: [], affectedAssets: 0 },
      pathTraversal: { count: 0, topIPs: [], sensitiveFiles: [], affectedAssets: 0 },
      abnormalUA: { count: 0, topIPs: [], examples: [], affectedAssets: 0 },
      geoAnalysis: { topCountries: [], topIPs: [], topASNs: [] },
      assetAnalysis: { totalAssets: 0, topAssets: [] },
      totalEvents: 0,
      timeRange: { start: new Date().toISOString(), end: new Date().toISOString() }
    };
  }
}

module.exports = CloudflareWAFRiskService;

