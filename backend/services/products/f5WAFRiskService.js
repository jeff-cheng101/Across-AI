// backend/services/products/f5WAFRiskService.js
// F5 Advanced WAF 風險分析服務

const { elkMCPClient } = require('../elkMCPClient');
const { F5_FIELD_MAPPING } = require('../../config/products/f5/f5FieldMapping');
const {
  F5_SEVERITY_CLASSIFICATION,
  F5_ATTACK_TYPES,
  classifyF5Severity,
  getSeverityByViolationRating,
  isF5InternalPath,
  isRealSecurityThreat
} = require('../../config/products/f5/f5Standards');
const f5ELKConfig = require('../../config/products/f5/f5ELKConfig');

class F5WAFRiskService {
  constructor() {
    console.log('🔧 初始化 F5 WAF 風險分析服務...');
    this.elkClient = elkMCPClient;
    this.fieldMapping = F5_FIELD_MAPPING;
    this.elkConfig = f5ELKConfig;
  }
  
  // ⭐ 主要方法：分析 F5 WAF 風險
  async analyzeF5WAF(timeRange = '24h') {
    console.log(`\n🔍 ===== 開始 F5 WAF 風險分析 =====`);
    console.log(`📅 時間範圍: ${timeRange}`);
    console.log(`📊 索引: ${this.elkConfig.index}`);
    
    try {
      // Step 1: 透過 ELK MCP 查詢 F5 日誌
      console.log('\n⭐ Step 1: 透過 MCP 查詢 F5 日誌...');
      const elkData = await this.elkClient.queryElasticsearch(
        timeRange,
        { indexPattern: this.elkConfig.index }
      );
      
      if (!elkData.hits || elkData.hits.length === 0) {
        console.log('⚠️ 未找到日誌資料');
        return this.getEmptyAnalysisResult();
      }
      
      // Step 2: 解析 F5 日誌
      console.log(`\n⭐ Step 2: 解析 ${elkData.hits.length} 筆日誌...`);
      const logEntries = elkData.hits.map(hit => this.parseF5Log(hit.source));
      console.log(`✅ 成功解析 ${logEntries.length} 筆日誌`);
      
      // Step 3: 分析各種攻擊類型
      console.log('\n⭐ Step 3: 分析攻擊模式...');
      const sqlInjection = this.analyzeSQLInjection(logEntries);
      const xssAttacks = this.analyzeXSSAttacks(logEntries);
      const commandExecution = this.analyzeCommandExecution(logEntries);
      const pathTraversal = this.analyzePathTraversal(logEntries);
      const botTraffic = this.analyzeBotTraffic(logEntries);
      const informationLeakage = this.analyzeInformationLeakage(logEntries);
      
      console.log(`   SQL 注入: ${sqlInjection.count} 次`);
      console.log(`   XSS 攻擊: ${xssAttacks.count} 次`);
      console.log(`   命令執行: ${commandExecution.count} 次`);
      console.log(`   路徑遍歷: ${pathTraversal.count} 次`);
      console.log(`   惡意機器人: ${botTraffic.count} 次`);
      console.log(`   資訊洩漏: ${informationLeakage.count} 次`);
      
      // Step 4: 生成統計資料
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
      
      console.log('\n✅ ===== F5 WAF 風險分析完成 =====\n');
      
      return {
        sqlInjection,
        xssAttacks,
        commandExecution,
        pathTraversal,
        botTraffic,
        informationLeakage,
        geoAnalysis,
        assetAnalysis,
        totalEvents: logEntries.length,
        timeRange: timeRange_result
      };
      
    } catch (error) {
      console.error('❌ F5 WAF 風險分析失敗:', error);
      throw error;
    }
  }
  
  // 解析 F5 日誌
  parseF5Log(rawLog) {
    return {
      requestId: rawLog[this.fieldMapping.request_id.elk_field],
      clientIP: rawLog[this.fieldMapping.client_ip.elk_field],
      clientCountry: rawLog[this.fieldMapping.client_country.elk_field],
      clientASN: rawLog[this.fieldMapping.client_asn.elk_field],
      uri: rawLog[this.fieldMapping.uri.elk_field],
      method: rawLog[this.fieldMapping.method.elk_field],
      host: rawLog[this.fieldMapping.host.elk_field],
      userAgent: rawLog[this.fieldMapping.user_agent.elk_field],
      responseCode: rawLog[this.fieldMapping.response_code.elk_field],
      attackType: rawLog[this.fieldMapping.attack_type.elk_field],
      severity: rawLog[this.fieldMapping.severity.elk_field],
      violationRating: rawLog[this.fieldMapping.violation_rating.elk_field],
      sigIds: rawLog[this.fieldMapping.sig_ids.elk_field],
      sigNames: rawLog[this.fieldMapping.sig_names.elk_field],
      violations: rawLog[this.fieldMapping.violations.elk_field],
      botCategory: rawLog[this.fieldMapping.bot_category.elk_field],
      policyName: rawLog[this.fieldMapping.policy_name.elk_field],
      timestamp: rawLog[this.fieldMapping.timestamp.elk_field]
    };
  }
  
  // 分析 SQL 注入
  analyzeSQLInjection(logEntries) {
    const sqliLogs = logEntries.filter(log => 
      !isF5InternalPath(log.uri) &&
      (
        (log.attackType && typeof log.attackType === 'string' && log.attackType.toLowerCase().includes('sql')) ||
        (log.violations && typeof log.violations === 'string' && log.violations.includes('VIOL_SQL_INJECTION')) ||
        (log.severity >= 3 && log.uri && typeof log.uri === 'string' && (log.uri.includes('union') || log.uri.includes('select')))
      )
    );
    
    const highRiskLogs = sqliLogs.filter(log => log.severity >= 4);
    
    return {
      count: sqliLogs.length,
      highRisk: highRiskLogs.length,
      topIPs: this.getTopN(sqliLogs, 'clientIP', 10),
      topTargets: this.getTopN(sqliLogs, 'uri', 10),
      topCountries: this.getTopN(sqliLogs, 'clientCountry', 5),
      affectedAssets: new Set(sqliLogs.map(log => log.host).filter(h => h)).size
    };
  }
  
  // 分析 XSS 攻擊
  analyzeXSSAttacks(logEntries) {
    const xssLogs = logEntries.filter(log => 
      !isF5InternalPath(log.uri) &&
      (
        (log.attackType && typeof log.attackType === 'string' && log.attackType.toLowerCase().includes('xss')) ||
        (log.violations && typeof log.violations === 'string' && log.violations.includes('VIOL_XSS')) ||
        (log.uri && typeof log.uri === 'string' && (log.uri.includes('<script') || log.uri.includes('javascript:')))
      )
    );
    
    const highRiskLogs = xssLogs.filter(log => log.severity >= 4);
    
    return {
      count: xssLogs.length,
      highRisk: highRiskLogs.length,
      topIPs: this.getTopN(xssLogs, 'clientIP', 10),
      topTargets: this.getTopN(xssLogs, 'uri', 10),
      topCountries: this.getTopN(xssLogs, 'clientCountry', 5),
      affectedAssets: new Set(xssLogs.map(log => log.host).filter(h => h)).size
    };
  }
  
  // 分析命令執行攻擊
  analyzeCommandExecution(logEntries) {
    const cmdLogs = logEntries.filter(log => 
      !isF5InternalPath(log.uri) &&
      (
        (log.attackType && typeof log.attackType === 'string' && (
          log.attackType.toLowerCase().includes('command') ||
          log.attackType.toLowerCase().includes('rce')
        )) ||
        (log.violations && typeof log.violations === 'string' && log.violations.includes('VIOL_COMMAND_EXECUTION'))
      )
    );
    
    const highRiskLogs = cmdLogs.filter(log => log.severity >= 4);
    
    return {
      count: cmdLogs.length,
      highRisk: highRiskLogs.length,
      topIPs: this.getTopN(cmdLogs, 'clientIP', 10),
      topTargets: this.getTopN(cmdLogs, 'uri', 10),
      topCountries: this.getTopN(cmdLogs, 'clientCountry', 5),
      affectedAssets: new Set(cmdLogs.map(log => log.host).filter(h => h)).size
    };
  }
  
  // 分析路徑遍歷
  analyzePathTraversal(logEntries) {
    const pathLogs = logEntries.filter(log => {
      const uri = log.uri && typeof log.uri === 'string' ? log.uri.toLowerCase() : '';
      return !isF5InternalPath(log.uri) &&
        (uri.includes('../') || uri.includes('..\\') || uri.includes('%2e%2e') ||
         (log.attackType && typeof log.attackType === 'string' && log.attackType.toLowerCase().includes('traversal')));
    });
    
    return {
      count: pathLogs.length,
      topIPs: this.getTopN(pathLogs, 'clientIP', 10),
      topTargets: this.getTopN(pathLogs, 'uri', 10),
      affectedAssets: new Set(pathLogs.map(log => log.host).filter(h => h)).size
    };
  }
  
  // 分析機器人流量
  analyzeBotTraffic(logEntries) {
    const botLogs = logEntries.filter(log => {
      return (log.botCategory && typeof log.botCategory === 'string' && log.botCategory.toLowerCase().includes('malicious')) ||
             (log.attackType && typeof log.attackType === 'string' && log.attackType.toLowerCase().includes('bot'));
    });
    
    return {
      count: botLogs.length,
      topIPs: this.getTopN(botLogs, 'clientIP', 10),
      topCountries: this.getTopN(botLogs, 'clientCountry', 5),
      affectedAssets: new Set(botLogs.map(log => log.host).filter(h => h)).size
    };
  }
  
  // 分析資訊洩漏
  analyzeInformationLeakage(logEntries) {
    const leakLogs = logEntries.filter(log => {
      return (log.attackType && typeof log.attackType === 'string' && log.attackType.toLowerCase().includes('leakage')) ||
             (log.attackType && typeof log.attackType === 'string' && log.attackType.toLowerCase().includes('disclosure'));
    });
    
    return {
      count: leakLogs.length,
      topIPs: this.getTopN(leakLogs, 'clientIP', 10),
      topTargets: this.getTopN(leakLogs, 'uri', 10),
      affectedAssets: new Set(leakLogs.map(log => log.host).filter(h => h)).size
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
    const assetCounts = this.getTopN(logEntries, 'host', 20);
    return {
      totalAssets: new Set(logEntries.map(log => log.host).filter(h => h)).size,
      topAssets: assetCounts
    };
  }
  
  // 生成 AI Prompt（F5 專用）
  generateAIPrompt(analysisData) {
    const {
      sqlInjection,
      xssAttacks,
      commandExecution,
      pathTraversal,
      botTraffic,
      informationLeakage,
      geoAnalysis,
      assetAnalysis,
      totalEvents,
      timeRange
    } = analysisData;

    const attackSections = [];

    if (sqlInjection.count > 0) {
      attackSections.push({
        type: 'SQL 注入攻擊',
        data: sqlInjection,
        description: 'F5 檢測到的 SQL 注入攻擊'
      });
    }

    if (xssAttacks.count > 0) {
      attackSections.push({
        type: 'XSS 跨站腳本攻擊',
        data: xssAttacks,
        description: 'F5 檢測到的 XSS 攻擊'
      });
    }

    if (commandExecution.count > 0) {
      attackSections.push({
        type: '命令執行攻擊',
        data: commandExecution,
        description: 'F5 檢測到的遠程命令執行攻擊'
      });
    }

    if (pathTraversal.count > 0) {
      attackSections.push({
        type: '路徑遍歷攻擊',
        data: pathTraversal,
        description: 'F5 檢測到的路徑遍歷攻擊'
      });
    }

    if (botTraffic.count > 0) {
      attackSections.push({
        type: '惡意機器人流量',
        data: botTraffic,
        description: 'F5 Bot 防護檢測到的惡意機器人'
      });
    }

    if (informationLeakage.count > 0) {
      attackSections.push({
        type: '資訊洩漏',
        data: informationLeakage,
        description: 'F5 檢測到的資訊洩漏風險'
      });
    }

    let attackStatisticsText = '';
    
    if (attackSections.length === 0) {
      attackStatisticsText = `**未檢測到任何安全威脅**

在指定時間範圍內，經過 F5 Advanced WAF 的完整分析後，未檢測到任何攻擊。所有請求均通過安全檢查。

⚠️ **重要**：由於沒有檢測到任何攻擊，請輸出空的 risks 陣列：
\`\`\`json
{
  "risks": []
}
\`\`\``;
    } else {
      attackStatisticsText = attackSections.map((section, index) => {
        const { type, data, description } = section;
        
        return `
${index + 1}. **${type}**
   - 檢測方式: ${description}
   - 檢測次數: ${data.count}
   ${data.highRisk !== undefined ? `- 高風險 (嚴重程度 4-5): ${data.highRisk}` : ''}
   - 受影響資產: ${data.affectedAssets}
   - Top 5 來源IP: ${data.topIPs ? data.topIPs.slice(0, 5).map(ip => `${ip.item} (${ip.count}次)`).join(', ') : '無'}
   - Top 5 來源國家: ${data.topCountries ? data.topCountries.map(c => `${c.item} (${c.count}次)`).join(', ') : '無'}
   ${data.topTargets ? `- Top 5 攻擊目標: ${data.topTargets.slice(0, 5).map(t => `${t.item} (${t.count}次)`).join(', ')}` : ''}
`.trim();
      }).join('\n\n');
    }

    const promptTemplate = `
你是一位資深的網路安全分析專家，專精於 F5 Advanced WAF 日誌分析和威脅識別。

### 【任務說明】

請根據以下 F5 Advanced WAF 日誌數據，**自動識別並分類所有攻擊類型**，生成完整的風險評估報告。

**重要：請不要使用預設的攻擊類型清單。所有攻擊類型都應該從日誌數據中自動識別。**

---

### 【資料來源】

- **索引名稱**: ${this.elkConfig.index}
- **時間範圍**: ${timeRange.start} ~ ${timeRange.end}
- **總日誌數**: ${totalEvents.toLocaleString()} 筆
- **分析時間**: ${new Date().toISOString()}
- **產品**: F5 Advanced WAF

---

### 【F5 嚴重程度系統】

**嚴重程度分級**: 1-5（數字越高越危險）

- **5**: Critical（嚴重） - 需立即處理
- **4**: High（高） - 高風險攻擊
- **3**: Medium（中） - 中等風險
- **2**: Low（低） - 低風險
- **1**: Informational（資訊） - 資訊性事件

---

### 【攻擊統計（基於真實 F5 日誌）】

${attackStatisticsText}

---

### 【地理與資產分析】

- **Top 10 攻擊來源國家**: ${geoAnalysis.topCountries.slice(0, 10).map(c => `${c.item} (${c.count}次)`).join(', ') || '無'}
- **Top 10 攻擊來源IP**: ${geoAnalysis.topIPs.slice(0, 10).map(ip => `${ip.item} (${ip.count}次)`).join(', ') || '無'}
- **受影響資產總數**: ${assetAnalysis.totalAssets}
- **Top 5 被攻擊資產**: ${assetAnalysis.topAssets.slice(0, 5).map(a => `${a.item} (${a.count}次)`).join(', ') || '無'}

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
      "tags": ["Exploit In Wild", "Internet Exposed", "High Volume"],
      "description": "詳細描述（200-300字）",
      "aiInsight": "AI 深度分析（100-150字），必須包含具體數字、F5簽名、來源、目標、建議",
      "createdDate": "Dec 18, 2024",
      "updatedDate": "Dec 18, 2024",
      "exploitInWild": true | false,
      "internetExposed": true,
      "confirmedExploitable": true | false,
      "cveId": null,
      "recommendations": [
        {
          "title": "建議標題",
          "description": "建議描述（150-200字），針對 F5 WAF 的具體配置建議",
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
3. ⚠️ **F5 專屬**：建議必須針對 F5 Advanced WAF 的配置和功能
4. ⚠️ **CVE 編號規則**：將 cveId 設為 null
5. 每個風險至少提供 2-3 個具體建議
6. aiInsight 必須包含具體數字、F5簽名、Top 來源、Top 目標

---

請以繁體中文回答，**務必輸出純 JSON 格式**，不要有 markdown 或其他格式符號。
`;

    return promptTemplate.trim();
  }
  
  // 生成 Fallback 風險資料（AI 解析失敗時使用）
  generateFallbackRisks(analysisData) {
    const risks = [];
    const { sqlInjection, xssAttacks, commandExecution, botTraffic } = analysisData;
    
    if (sqlInjection.count > 0) {
      risks.push({
        id: `sql-injection-${Date.now()}`,
        title: 'SQL 注入攻擊檢測',
        severity: sqlInjection.highRisk > 50 ? 'critical' : 'high',
        openIssues: sqlInjection.count,
        resolvedIssues: 0,
        affectedAssets: sqlInjection.affectedAssets,
        tags: ['Internet Exposed', 'High Volume'],
        description: `F5 Advanced WAF 檢測到 ${sqlInjection.count} 次 SQL 注入攻擊嘗試。`,
        createdDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        updatedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        exploitInWild: false,
        internetExposed: true,
        confirmedExploitable: false,
        recommendations: [
          {
            title: '啟用 F5 WAF SQL 注入防護',
            description: '配置 F5 Advanced WAF 的 SQL 注入攻擊簽名',
            priority: 'high'
          }
        ]
      });
    }
    
    if (xssAttacks.count > 0) {
      risks.push({
        id: `xss-attack-${Date.now()}`,
        title: 'XSS 攻擊檢測',
        severity: 'high',
        openIssues: xssAttacks.count,
        resolvedIssues: 0,
        affectedAssets: xssAttacks.affectedAssets,
        tags: ['Internet Exposed'],
        description: `F5 Advanced WAF 檢測到 ${xssAttacks.count} 次 XSS 攻擊嘗試。`,
        createdDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        updatedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        exploitInWild: false,
        internetExposed: true,
        confirmedExploitable: false,
        recommendations: [
          {
            title: '啟用 XSS 防護規則',
            description: '配置 F5 WAF 的 XSS 防護規則',
            priority: 'high'
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
  
  // 空結果
  getEmptyAnalysisResult() {
    return {
      sqlInjection: { count: 0, highRisk: 0, topIPs: [], topTargets: [], topCountries: [], affectedAssets: 0 },
      xssAttacks: { count: 0, highRisk: 0, topIPs: [], topTargets: [], topCountries: [], affectedAssets: 0 },
      commandExecution: { count: 0, highRisk: 0, topIPs: [], topTargets: [], topCountries: [], affectedAssets: 0 },
      pathTraversal: { count: 0, topIPs: [], topTargets: [], affectedAssets: 0 },
      botTraffic: { count: 0, topIPs: [], topCountries: [], affectedAssets: 0 },
      informationLeakage: { count: 0, topIPs: [], topTargets: [], affectedAssets: 0 },
      geoAnalysis: { topCountries: [], topIPs: [], topASNs: [] },
      assetAnalysis: { totalAssets: 0, topAssets: [] },
      totalEvents: 0,
      timeRange: { start: new Date().toISOString(), end: new Date().toISOString() }
    };
  }
}

module.exports = F5WAFRiskService;



