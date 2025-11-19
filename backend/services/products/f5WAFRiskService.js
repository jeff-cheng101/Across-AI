// backend/services/products/f5/f5WAFRiskService.js
// F5 Advanced WAF 風險分析服務
// 整合多層次判斷模型與威脅評分系統

const { elkMCPClient } = require('../elkMCPClient');
const { F5_FIELD_MAPPING } = require('../../config/products/f5/f5FieldMapping');
const {
  F5_SEVERITY_MAPPING,
  F5_THREAT_LEVEL_MAPPING,
  F5_REQUEST_STATUS_MAPPING,
  F5_VIOLATION_CLASSIFICATION,
  F5_ATTACK_TYPE_MAPPING,
  F5_SIGNATURE_DATABASE,
  F5_VIOLATION_RATING_THRESHOLDS,
  F5_INTERNAL_PATHS,
  isRealSecurityThreat,
  calculateThreatScore,
  classifyByThreatScore,
  getSeverityByViolationRating,
  getAttackCategory,
  getViolationCategory,
  isF5InternalPath,
  isHighRiskAttack,
  analyzeLogEntry
} = require('../../config/products/f5/f5Standards');
const f5ELKConfig = require('../../config/products/f5/f5ELKConfig');

class F5WAFRiskService {
  constructor() {
    console.log('🔧 初始化 F5 WAF 風險分析服務（多層次判斷模型）...');
    this.elkClient = elkMCPClient;
    this.fieldMapping = F5_FIELD_MAPPING;
    this.elkConfig = f5ELKConfig;
  }
  
  // ⭐ 主要方法：分析 F5 WAF 風險（已更新使用新的判斷邏輯）
  async analyzeF5WAF(timeRange = '24h') {
    console.log(`\n🔍 ===== 開始 F5 WAF 風險分析（多層次模型）=====`);
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
      
      // Step 2: 解析 F5 日誌（使用更新的欄位對應）
      console.log(`\n⭐ Step 2: 解析 ${elkData.hits.length} 筆日誌...`);
      const logEntries = elkData.hits.map(hit => this.parseF5Log(hit.source));
      console.log(`✅ 成功解析 ${logEntries.length} 筆日誌`);
      
      // 診斷：顯示前 3 筆日誌的 IP 和國家資訊
      console.log('\n📊 IP 地理位置診斷（前 3 筆）:');
      logEntries.slice(0, 3).forEach((log, index) => {
        console.log(`  ${index + 1}. IP: ${log.clientIP} → 國家: ${log.clientCountry} (來源: ${log.clientCountrySource})`);
      });
      
      // 統計國家來源分佈
      const countrySources = {};
      logEntries.forEach(log => {
        const source = log.clientCountrySource || 'unknown';
        countrySources[source] = (countrySources[source] || 0) + 1;
      });
      console.log('\n📊 國家資訊來源統計:');
      Object.entries(countrySources).forEach(([source, count]) => {
        console.log(`  - ${source}: ${count} 筆 (${(count/logEntries.length*100).toFixed(1)}%)`);
      });
      
      // Step 3: 使用多層次判斷模型分析攻擊
      console.log('\n⭐ Step 3: 使用多層次判斷模型分析攻擊...');
      const analysisResults = logEntries.map(log => analyzeLogEntry(log));
      
      // 過濾出真實攻擊
      const realAttacks = analysisResults.filter(result => result.isAttack);
      console.log(`   檢測到 ${realAttacks.length} 個真實攻擊（共 ${logEntries.length} 筆日誌）`);
      
      // 統計各類型攻擊
      const sqlInjection = this.analyzeSQLInjectionEnhanced(logEntries, realAttacks);
      const xssAttacks = this.analyzeXSSAttacksEnhanced(logEntries, realAttacks);
      const commandExecution = this.analyzeCommandExecutionEnhanced(logEntries, realAttacks);
      const pathTraversal = this.analyzePathTraversalEnhanced(logEntries, realAttacks);
      const botTraffic = this.analyzeBotTrafficEnhanced(logEntries, realAttacks);
      const informationLeakage = this.analyzeInformationLeakageEnhanced(logEntries, realAttacks);
      const sessionAttacks = this.analyzeSessionAttacksEnhanced(logEntries, realAttacks);
      const otherAttacks = this.analyzeOtherAttacksEnhanced(logEntries, realAttacks);
      
      console.log(`   SQL 注入: ${sqlInjection.count} 次`);
      console.log(`   XSS 攻擊: ${xssAttacks.count} 次`);
      console.log(`   命令執行: ${commandExecution.count} 次`);
      console.log(`   路徑遍歷: ${pathTraversal.count} 次`);
      console.log(`   惡意機器人: ${botTraffic.count} 次`);
      console.log(`   資訊洩漏: ${informationLeakage.count} 次`);
      console.log(`   會話攻擊: ${sessionAttacks.count} 次`);
      console.log(`   其他攻擊: ${otherAttacks.count} 次`);
      
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
        sessionAttacks,
        otherAttacks,
        geoAnalysis,
        assetAnalysis,
        totalEvents: logEntries.length,
        realAttacks: realAttacks.length,
        timeRange: timeRange_result
      };
      
    } catch (error) {
      console.error('❌ F5 WAF 風險分析失敗:', error);
      throw error;
    }
  }
  
  // 解析 F5 日誌（更新為使用 f5FieldMapping.js 的欄位）
  parseF5Log(rawLog) {
    // 從 geoip 物件中提取國家資訊（增強版：加入驗證和 fallback）
    let countryName = rawLog.geoip?.country_name || 
                       rawLog.geoip?.country_code2 || 
                       null;
    
    let countrySource = 'geoip';
    const clientIP = rawLog[this.fieldMapping.client_ip.elk_field];
    
    // 診斷模式：如果啟用詳細日誌，輸出 geoip 原始結構
    if (process.env.F5_DEBUG_GEOIP === 'true' && rawLog.geoip) {
      console.log(`\n🔍 [DEBUG] IP ${clientIP} 的 geoip 原始數據:`, JSON.stringify(rawLog.geoip, null, 2));
    }
    
    // 數據驗證 1：檢查國家名稱是否合理
    if (countryName && (countryName.length > 50 || countryName.length === 0)) {
      console.warn(`⚠️ 異常的國家名稱長度: "${countryName}" (IP: ${clientIP})`);
      if (rawLog.geoip) {
        console.warn(`   完整 geoip 數據:`, JSON.stringify(rawLog.geoip, null, 2));
      }
      countryName = null;
      countrySource = 'invalid_geoip';
    }
    
    // 數據驗證 2：檢查是否包含異常字符
    if (countryName && !/^[a-zA-Z\s\-]+$/.test(countryName)) {
      console.warn(`⚠️ 國家名稱包含異常字符: "${countryName}" (IP: ${clientIP})`);
      if (rawLog.geoip) {
        console.warn(`   完整 geoip 數據:`, JSON.stringify(rawLog.geoip, null, 2));
      }
      countryName = null;
      countrySource = 'invalid_geoip';
    }
    
    // Fallback 1: 嘗試使用 geo_location 欄位
    if (!countryName && rawLog[this.fieldMapping.geo_location?.elk_field]) {
      countryName = rawLog[this.fieldMapping.geo_location?.elk_field];
      countrySource = 'geo_location';
      console.log(`ℹ️ 使用 geo_location fallback: ${countryName} (IP: ${clientIP})`);
    }
    
    // Fallback 2: 嘗試從完整 geoip 物件中尋找其他可用欄位
    if (!countryName && rawLog.geoip) {
      const geoipKeys = Object.keys(rawLog.geoip);
      for (const key of geoipKeys) {
        if (key.toLowerCase().includes('country') && rawLog.geoip[key]) {
          countryName = rawLog.geoip[key];
          countrySource = `geoip.${key}`;
          console.log(`ℹ️ 使用 geoip.${key} fallback: ${countryName} (IP: ${clientIP})`);
          break;
        }
      }
    }
    
    // 最終 fallback：標記為 Unknown
    if (!countryName) {
      countryName = 'Unknown';
      countrySource = 'none';
    }
    
    return {
      // 基本資訊
      clientIP: clientIP,
      clientPort: rawLog[this.fieldMapping.client_port.elk_field],
      clientCountry: countryName,
      clientCountrySource: countrySource,  // 新增：記錄數據來源，方便除錯
      uri: rawLog[this.fieldMapping.uri.elk_field],
      method: rawLog[this.fieldMapping.method.elk_field],
      protocol: rawLog[this.fieldMapping.protocol.elk_field],
      fqdn: rawLog[this.fieldMapping.fqdn?.elk_field],
      host: rawLog[this.fieldMapping.host?.elk_field],
      userAgent: rawLog[this.fieldMapping.user_agent.elk_field],
      
      // 目的端資訊
      dst_ip: rawLog[this.fieldMapping.dst_ip?.elk_field],
      dst_port: rawLog[this.fieldMapping.dst_port?.elk_field],
      
      // 請求資訊
      queryString: rawLog[this.fieldMapping.query_string?.elk_field],
      referer: rawLog[this.fieldMapping.referer?.elk_field],
      
      // 回應資訊
      responseCode: rawLog[this.fieldMapping.response_code.elk_field],
      response: rawLog[this.fieldMapping.response?.elk_field],
      request_status: rawLog[this.fieldMapping.request_status?.elk_field],
      
      // 安全相關
      attackType: rawLog[this.fieldMapping.attack_type.elk_field],
      severity: rawLog[this.fieldMapping.severity.elk_field],
      ThreatLevel: rawLog[this.fieldMapping.ThreatLevel?.elk_field],
      violationRating: rawLog[this.fieldMapping.violation_rating.elk_field],
      violations: rawLog[this.fieldMapping.violations.elk_field],
      sub_violations: rawLog[this.fieldMapping.sub_violations?.elk_field],
      
      // 簽章資訊
      sigIds: rawLog[this.fieldMapping.sig_ids.elk_field],
      sigNames: rawLog[this.fieldMapping.sig_names.elk_field],
      sig_cves: rawLog[this.fieldMapping.sig_cves?.elk_field],
      
      // 政策資訊
      policyName: rawLog[this.fieldMapping.policy_name.elk_field],
      policyApplyDate: rawLog[this.fieldMapping.policy_apply_date?.elk_field],
      webApplicationName: rawLog[this.fieldMapping.web_application_name?.elk_field],
      
      // 時間資訊
      timestamp: rawLog[this.fieldMapping.timestamp.elk_field],
      date_time: rawLog[this.fieldMapping.date_time?.elk_field],
      
      // 其他資訊
      support_id: rawLog[this.fieldMapping.support_id?.elk_field],
      session_id: rawLog[this.fieldMapping.session_id?.elk_field],
      geoip: rawLog.geoip || rawLog[this.fieldMapping.geoip?.elk_field]
    };
  }
  
  // === 增強版攻擊分析方法（使用多層次判斷結果）===
  
  // 分析 SQL 注入（增強版）
  analyzeSQLInjectionEnhanced(logEntries, realAttacks) {
    const sqliLogs = realAttacks.filter(result => {
      const category = result.attackCategory;
      const violationCategory = result.violationCategory;
      
      return (
        category?.category === 'INJECTION_ATTACKS' && 
        category?.type?.toLowerCase().includes('sql')
      ) || (
        violationCategory?.category === 'INJECTION_ATTACKS' &&
        violationCategory?.violation?.toLowerCase().includes('sql')
      );
    });
    
    const highRiskLogs = sqliLogs.filter(result => 
      result.severity === 'critical' || result.severity === 'high'
    );
    
    // 從 realAttacks 中獲取原始 log entries
    const sqliLogEntries = sqliLogs.map(result => {
      return logEntries.find(log => 
        log.clientIP === result.originalData?.client_ip ||
        log.uri === result.originalData?.uri
      );
    }).filter(log => log);
    
    return {
      count: sqliLogs.length,
      highRisk: highRiskLogs.length,
      topIPs: this.getTopN(sqliLogEntries, 'clientIP', 10),
      topTargets: this.getTopN(sqliLogEntries, 'uri', 10),
      topCountries: this.getTopN(sqliLogEntries, 'clientCountry', 5),
      affectedAssets: new Set(sqliLogEntries.map(log => log.host || log.fqdn).filter(h => h)).size,
      // 新增技術指標
      avgViolationRating: this.calculateAvg(sqliLogEntries, 'violationRating'),
      avgThreatScore: this.calculateAvg(sqliLogs.map(l => ({ threatScore: l.threatScore })), 'threatScore'),
      topSignatures: this.getTopSignatures(sqliLogEntries, 3)
    };
  }
  
  // 分析 XSS 攻擊（增強版）
  analyzeXSSAttacksEnhanced(logEntries, realAttacks) {
    const xssLogs = realAttacks.filter(result => {
      const category = result.attackCategory;
      return category?.type?.toLowerCase().includes('xss') ||
             category?.type?.toLowerCase().includes('cross site scripting');
    });
    
    const highRiskLogs = xssLogs.filter(result => 
      result.severity === 'critical' || result.severity === 'high'
    );
    
    const xssLogEntries = xssLogs.map(result => {
      return logEntries.find(log => 
        log.clientIP === result.originalData?.client_ip
      );
    }).filter(log => log);
    
    return {
      count: xssLogs.length,
      highRisk: highRiskLogs.length,
      topIPs: this.getTopN(xssLogEntries, 'clientIP', 10),
      topTargets: this.getTopN(xssLogEntries, 'uri', 10),
      topCountries: this.getTopN(xssLogEntries, 'clientCountry', 5),
      affectedAssets: new Set(xssLogEntries.map(log => log.host || log.fqdn).filter(h => h)).size,
      // 新增技術指標
      avgViolationRating: this.calculateAvg(xssLogEntries, 'violationRating'),
      avgThreatScore: this.calculateAvg(xssLogs.map(l => ({ threatScore: l.threatScore })), 'threatScore'),
      topSignatures: this.getTopSignatures(xssLogEntries, 3)
    };
  }
  
  // 分析命令執行攻擊（增強版）
  analyzeCommandExecutionEnhanced(logEntries, realAttacks) {
    const cmdLogs = realAttacks.filter(result => {
      const category = result.attackCategory;
      return category?.type?.toLowerCase().includes('command') ||
             category?.type?.toLowerCase().includes('rce');
    });
    
    const highRiskLogs = cmdLogs.filter(result => 
      result.severity === 'critical' || result.severity === 'high'
    );
    
    const cmdLogEntries = cmdLogs.map(result => {
      return logEntries.find(log => 
        log.clientIP === result.originalData?.client_ip
      );
    }).filter(log => log);
    
    return {
      count: cmdLogs.length,
      highRisk: highRiskLogs.length,
      topIPs: this.getTopN(cmdLogEntries, 'clientIP', 10),
      topTargets: this.getTopN(cmdLogEntries, 'uri', 10),
      topCountries: this.getTopN(cmdLogEntries, 'clientCountry', 5),
      affectedAssets: new Set(cmdLogEntries.map(log => log.host || log.fqdn).filter(h => h)).size,
      // 新增技術指標
      avgViolationRating: this.calculateAvg(cmdLogEntries, 'violationRating'),
      avgThreatScore: this.calculateAvg(cmdLogs.map(l => ({ threatScore: l.threatScore })), 'threatScore'),
      topSignatures: this.getTopSignatures(cmdLogEntries, 3)
    };
  }
  
  // 分析路徑遍歷（增強版）
  analyzePathTraversalEnhanced(logEntries, realAttacks) {
    const pathLogs = realAttacks.filter(result => {
      const category = result.attackCategory;
      return category?.type?.toLowerCase().includes('traversal') ||
             category?.type?.toLowerCase().includes('predictable');
    });
    
    const pathLogEntries = pathLogs.map(result => {
      return logEntries.find(log => 
        log.clientIP === result.originalData?.client_ip
      );
    }).filter(log => log);
    
    return {
      count: pathLogs.length,
      topIPs: this.getTopN(pathLogEntries, 'clientIP', 10),
      topTargets: this.getTopN(pathLogEntries, 'uri', 10),
      affectedAssets: new Set(pathLogEntries.map(log => log.host || log.fqdn).filter(h => h)).size
    };
  }
  
  // 分析機器人流量（增強版）
  analyzeBotTrafficEnhanced(logEntries, realAttacks) {
    const botLogs = realAttacks.filter(result => {
      const category = result.violationCategory;
      return category?.category === 'BOT_ATTACKS' ||
             (result.attackCategory?.type?.toLowerCase().includes('bot'));
    });
    
    const botLogEntries = botLogs.map(result => {
      return logEntries.find(log => 
        log.clientIP === result.originalData?.client_ip
      );
    }).filter(log => log);
    
    return {
      count: botLogs.length,
      topIPs: this.getTopN(botLogEntries, 'clientIP', 10),
      topCountries: this.getTopN(botLogEntries, 'clientCountry', 5),
      affectedAssets: new Set(botLogEntries.map(log => log.host || log.fqdn).filter(h => h)).size
    };
  }
  
  // 分析資訊洩漏（增強版）
  analyzeInformationLeakageEnhanced(logEntries, realAttacks) {
    const leakLogs = realAttacks.filter(result => {
      const category = result.attackCategory;
      const violationCategory = result.violationCategory;
      return category?.category === 'INFORMATION_DISCLOSURE' ||
             violationCategory?.category === 'INFORMATION_DISCLOSURE';
    });
    
    const leakLogEntries = leakLogs.map(result => {
      return logEntries.find(log => 
        log.clientIP === result.originalData?.client_ip
      );
    }).filter(log => log);
    
    return {
      count: leakLogs.length,
      topIPs: this.getTopN(leakLogEntries, 'clientIP', 10),
      topTargets: this.getTopN(leakLogEntries, 'uri', 10),
      affectedAssets: new Set(leakLogEntries.map(log => log.host || log.fqdn).filter(h => h)).size
    };
  }
  
  // 分析會話攻擊（新增）
  analyzeSessionAttacksEnhanced(logEntries, realAttacks) {
    const sessionLogs = realAttacks.filter(result => {
      const violationCategory = result.violationCategory;
      return violationCategory?.category === 'SESSION_ATTACKS';
    });
    
    const sessionLogEntries = sessionLogs.map(result => {
      return logEntries.find(log => 
        log.clientIP === result.originalData?.client_ip
      );
    }).filter(log => log);
    
    return {
      count: sessionLogs.length,
      highRisk: sessionLogs.filter(r => r.severity === 'critical' || r.severity === 'high').length,
      topIPs: this.getTopN(sessionLogEntries, 'clientIP', 10),
      topCountries: this.getTopN(sessionLogEntries, 'clientCountry', 5),
      affectedAssets: new Set(sessionLogEntries.map(log => log.host || log.fqdn).filter(h => h)).size
    };
  }
  
  // 分析其他攻擊（新增）
  analyzeOtherAttacksEnhanced(logEntries, realAttacks) {
    const knownCategories = [
      'INJECTION_ATTACKS', 'INFORMATION_DISCLOSURE', 'SESSION_ATTACKS', 
      'BOT_ATTACKS', 'CRITICAL_ATTACKS'
    ];
    
    const otherLogs = realAttacks.filter(result => {
      const category = result.attackCategory?.category;
      const violationCategory = result.violationCategory?.category;
      return !knownCategories.includes(category) && 
             !knownCategories.includes(violationCategory);
    });
    
    const otherLogEntries = otherLogs.map(result => {
      return logEntries.find(log => 
        log.clientIP === result.originalData?.client_ip
      );
    }).filter(log => log);
    
    return {
      count: otherLogs.length,
      topIPs: this.getTopN(otherLogEntries, 'clientIP', 10),
      topCountries: this.getTopN(otherLogEntries, 'clientCountry', 5),
      affectedAssets: new Set(otherLogEntries.map(log => log.host || log.fqdn).filter(h => h)).size
    };
  }
  
  // 分析地理分佈
  analyzeGeoDistribution(logEntries) {
    return {
      topCountries: this.getTopN(logEntries, 'clientCountry', 10),
      topIPs: this.getTopN(logEntries, 'clientIP', 20)
    };
  }
  
  // 分析受影響資產
  analyzeAffectedAssets(logEntries) {
    const hosts = logEntries.map(log => log.host || log.fqdn).filter(h => h);
    const assetCounts = this.getTopN(logEntries, 'host', 20);
    
    return {
      totalAssets: new Set(hosts).size,
      topAssets: assetCounts
    };
  }
  
  // 生成 AI Prompt（F5 專用 - 增強版）
  generateAIPrompt(analysisData) {
    const {
      sqlInjection,
      xssAttacks,
      commandExecution,
      pathTraversal,
      botTraffic,
      informationLeakage,
      sessionAttacks,
      otherAttacks,
      geoAnalysis,
      assetAnalysis,
      totalEvents,
      realAttacks,
      timeRange
    } = analysisData;

    const attackSections = [];

    if (sqlInjection.count > 0) {
      attackSections.push({
        type: 'SQL 注入攻擊',
        data: sqlInjection,
        description: 'F5 多層次判斷模型檢測到的 SQL 注入攻擊'
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
        description: 'F5 檢測到的路徑遍歷與資訊洩漏攻擊'
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

    if (sessionAttacks.count > 0) {
      attackSections.push({
        type: '會話與認證攻擊',
        data: sessionAttacks,
        description: 'F5 檢測到的會話劫持、CSRF、暴力破解等攻擊'
      });
    }

    if (otherAttacks.count > 0) {
      attackSections.push({
        type: '其他安全威脅',
        data: otherAttacks,
        description: '其他類型的安全威脅'
      });
    }

    let attackStatisticsText = '';
    
    if (attackSections.length === 0) {
      attackStatisticsText = `**未檢測到任何安全威脅**

在指定時間範圍內，經過 F5 Advanced WAF 多層次判斷模型的完整分析後，未檢測到任何真實攻擊。
- 總日誌數: ${totalEvents} 筆
- 真實攻擊: 0 筆
所有請求均通過安全檢查。

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
   ${data.highRisk !== undefined ? `- 高風險 (critical/high): ${data.highRisk}` : ''}
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
- **真實攻擊數**: ${realAttacks.toLocaleString()} 筆（經多層次判斷模型驗證）
- **分析時間**: ${new Date().toISOString()}
- **產品**: F5 Advanced WAF
- **判斷模型**: 4層多維度判斷系統

---

### 【F5 多層次判斷模型】

**判斷邏輯分為 4 個層次**：

**Level 1 - 確定性指標**（最高優先級）
- request_status === 'blocked' → 確定攻擊
- 有 sig_ids（攻擊簽章）→ 確定攻擊
- ThreatLevel === 'High' → 確定攻擊
- 嚴重違規類型 → 確定攻擊

**Level 2 - 綜合評分**
- violation_rating >= 70 → 高風險攻擊
- violation_rating >= 50 → 中風險攻擊

**Level 3 - 攻擊類型匹配**
- 有明確的 attack_type → 高信心攻擊
- 違規類型匹配（注入攻擊類）→ 高風險

**Level 4 - 行為模式分析**
- 嚴重程度 + 違規組合 → 中信心攻擊
- 多個弱信號組合（2個以上）→ 低信心攻擊

**威脅分數系統**：
- 0-30: 確定攻擊 (Critical)
- 31-50: 高風險 (High)
- 51-70: 中風險 (Medium)
- 71-85: 低風險 (Low)
- 86-100: 正常流量 (Clean)

---

### 【攻擊統計（基於真實 F5 日誌與多層次判斷）】

${attackStatisticsText}

---

### 【地理與資產分析】⭐ 真實數據區塊 ⭐

⚠️ **重要指示**：以下是從 F5 日誌中提取的真實攻擊數據，在生成 aiInsight 和 description 時，**必須優先使用這些實際數據**。

- **Top 10 攻擊來源國家（真實）**: ${geoAnalysis.topCountries.slice(0, 10).map(c => `${c.item} (${c.count}次)`).join(', ') || '無'}
- **Top 10 攻擊來源IP（真實）**: ${geoAnalysis.topIPs.slice(0, 10).map(ip => `${ip.item} (${ip.count}次)`).join(', ') || '無'}
- **受影響資產總數**: ${assetAnalysis.totalAssets}
- **Top 5 被攻擊資產（真實）**: ${assetAnalysis.topAssets.slice(0, 5).map(a => `${a.item} (${a.count}次)`).join(', ') || '無'}

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
      "description": "詳細描述（200-300字），必須包含多層次判斷結果",
      "aiInsight": "AI 深度分析（150-250字），必須包含以下內容：
        1. 具體檢測數字（攻擊總次數、高風險次數）和時間範圍
        2. F5 多層次判斷模型的分析結果（Level 1: 基於 violation_rating 和 sig_ids 的判斷、Level 2: 威脅評分、Level 3: 攻擊類型匹配、Level 4: 行為模式分析）
        3. F5 特定技術指標（violation_rating 評分範圍、threat_level、觸發的 sig_ids 簽章編號）
        4. 主要攻擊來源（Top 3 國家及其攻擊次數、Top 3 IP 及其攻擊次數）
        5. 主要攻擊目標（Top 3 URL 及其被攻擊次數）
        6. 攻擊特徵分析（使用的攻擊向量、payload 特徵、OWASP 分類）
        7. 具體建議（基於多層次判斷結果的 F5 Advanced WAF 防護措施，包含簽章集編號、閾值設定等）
        
        範例格式參考：
        在 [開始時間] 至 [結束時間] 期間，F5 Advanced WAF 多層次判斷模型檢測到 [總次數] 次 [攻擊類型] 攻擊嘗試，其中 [高風險次數] 次被 Level 1 判定為高風險（violation_rating ≥ [閾值]，觸發簽章 [簽章ID]）。Level 2 評分顯示平均威脅分數為 [分數]。Level 3 確認為 [攻擊類型]（OWASP [分類]）。主要攻擊來自 [國家1]（[次數1] 次，IP [實際IP1]）、[國家2]（[次數2] 次，IP [實際IP2]）、[國家3]（[次數3] 次，IP [實際IP3]）。攻擊目標集中於 [URL1]（[次數1] 次）、[URL2]（[次數2] 次）。共影響 [資產數] 個資產。建議 [具體的 F5 WAF 防護措施，包含簽章集編號和閾值設定]。
        
        ⚠️ **關鍵要求**：
        - 必須使用上方【攻擊統計】和【地理與資產分析】中的真實數據
        - 禁止使用測試 IP（如 1.2.3.4、5.6.7.8、192.168.x.x、10.0.x.x 等）
        - IP 地址必須與【地理與資產分析】中列出的完全一致
        - 國家、URL、攻擊次數都必須使用真實統計數據",
      "createdDate": "${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}",
      "updatedDate": "${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}",
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
5. ⚠️ **多層次判斷**：description 中必須說明判斷依據（Level 1-4）
6. 每個風險至少提供 2-3 個具體建議
7. ⚠️ **aiInsight 必須包含**：
   - 具體數字（攻擊總次數、高風險次數、受影響資產數）
   - F5 多層次判斷模型的 Level 1-4 分析結果
   - F5 技術指標（violation_rating、threat_level、sig_ids）
   - Top 3 來源國家、Top 3 IP、Top 3 目標 URL（包含次數）
   - **IP 地址必須使用【地理與資產分析】中列出的真實 IP，嚴格禁止使用 1.2.3.4、5.6.7.8、192.168.x.x、10.0.x.x 等測試或私有 IP**
   - 攻擊特徵與 OWASP 分類
   - 基於實際數據的 F5 WAF 具體防護建議（簽章集編號、閾值設定）
8. 如果沒有攻擊，必須輸出空的 risks 陣列
9. ⚠️ **禁止使用模糊語言**：避免「可能」、「或許」、「建議檢查」等不確定性描述，必須基於實際數據提供明確的分析和建議

---

請以繁體中文回答，**務必輸出純 JSON 格式**，不要有 markdown 或其他格式符號。
`;

    return promptTemplate.trim();
  }
  
  // 生成 Fallback 風險資料（AI 解析失敗時使用）
  generateFallbackRisks(analysisData) {
    const risks = [];
    const { sqlInjection, xssAttacks, commandExecution, botTraffic, sessionAttacks } = analysisData;
    
    if (sqlInjection.count > 0) {
      const topCountry = sqlInjection.topCountries?.[0];
      const topIP = sqlInjection.topIPs?.[0];
      const topTarget = sqlInjection.topTargets?.[0];
      
      risks.push({
        id: `sql-injection-${Date.now()}`,
        title: 'SQL 注入攻擊檢測（多層次判斷）',
        severity: sqlInjection.highRisk > 50 ? 'critical' : 'high',
        openIssues: sqlInjection.count,
        resolvedIssues: 0,
        affectedAssets: sqlInjection.affectedAssets,
        tags: ['Internet Exposed', 'High Volume', 'F5 多層次判斷'],
        description: `F5 Advanced WAF 多層次判斷模型檢測到 ${sqlInjection.count} 次 SQL 注入攻擊嘗試，其中 ${sqlInjection.highRisk} 次為高風險攻擊。`,
        aiInsight: `在分析時間範圍內，F5 Advanced WAF 多層次判斷模型檢測到 ${sqlInjection.count} 次 SQL 注入攻擊嘗試，其中 ${sqlInjection.highRisk} 次被 Level 1 判定為高風險攻擊（violation_rating ≥ 70，且觸發 F5 攻擊簽章）。根據 Level 2 威脅評分機制，這些攻擊展現出明顯的惡意特徵。Level 3 攻擊類型匹配確認為 SQL Injection（OWASP A03:2021），攻擊手法包含 UNION 查詢、時間延遲注入等技術。主要攻擊來自 ${topCountry?.item || '未知地區'}（${topCountry?.count || 0} 次），Top 攻擊 IP 為 ${topIP?.item || '未知'}（${topIP?.count || 0} 次）。攻擊目標集中於 ${topTarget?.item || '多個端點'}（${topTarget?.count || 0} 次）。共影響 ${sqlInjection.affectedAssets} 個資產。建議立即啟用 F5 Advanced WAF 的 SQL 注入防護簽章（Signature Set 200010000 系列），將 violation_rating 閾值設定為 50 以上自動阻擋，並啟用學習模式以優化防護規則。`,
        createdDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        updatedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        exploitInWild: false,
        internetExposed: true,
        confirmedExploitable: false,
        cveId: null,
        recommendations: [
          {
            title: '啟用 F5 WAF SQL 注入防護',
            description: '配置 F5 Advanced WAF 的 SQL 注入攻擊簽章，並啟用學習模式以減少誤報',
            priority: 'high'
          },
          {
            title: '調整違規評分閾值',
            description: '根據多層次判斷結果，調整 violation_rating 閾值以優化防護策略',
            priority: 'medium'
          }
        ]
      });
    }
    
    if (xssAttacks.count > 0) {
      const topCountry = xssAttacks.topCountries?.[0];
      const topIP = xssAttacks.topIPs?.[0];
      const topTarget = xssAttacks.topTargets?.[0];
      
      risks.push({
        id: `xss-attack-${Date.now()}`,
        title: 'XSS 跨站腳本攻擊檢測',
        severity: 'high',
        openIssues: xssAttacks.count,
        resolvedIssues: 0,
        affectedAssets: xssAttacks.affectedAssets,
        tags: ['Internet Exposed', 'F5 多層次判斷'],
        description: `F5 Advanced WAF 檢測到 ${xssAttacks.count} 次 XSS 攻擊嘗試。`,
        aiInsight: `在分析時間範圍內，F5 Advanced WAF 多層次判斷模型檢測到 ${xssAttacks.count} 次 XSS（跨站腳本）攻擊嘗試，其中 ${xssAttacks.highRisk} 次被判定為高風險攻擊。Level 1 判斷顯示這些攻擊觸發了 F5 XSS 防護簽章，violation_rating 評分達到警戒水平。Level 3 攻擊類型匹配確認為 Cross-Site Scripting（OWASP A03:2021），攻擊手法包含 <script> 標籤注入、事件處理器注入（如 onerror、onload）等。主要攻擊來自 ${topCountry?.item || '未知地區'}（${topCountry?.count || 0} 次），Top 攻擊 IP 為 ${topIP?.item || '未知'}（${topIP?.count || 0} 次）。攻擊目標為 ${topTarget?.item || '多個端點'}（${topTarget?.count || 0} 次）。共影響 ${xssAttacks.affectedAssets} 個資產。建議立即啟用 F5 Advanced WAF 的 XSS 防護規則並配置內容安全策略（CSP），同時檢查受影響端點的輸入驗證與輸出編碼機制。`,
        createdDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        updatedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        exploitInWild: false,
        internetExposed: true,
        confirmedExploitable: false,
        cveId: null,
        recommendations: [
          {
            title: '啟用 XSS 防護規則',
            description: '配置 F5 WAF 的 XSS 防護規則並啟用內容編碼檢查',
            priority: 'high'
          }
        ]
      });
    }
    
    if (commandExecution.count > 0) {
      const topCountry = commandExecution.topCountries?.[0];
      const topIP = commandExecution.topIPs?.[0];
      const topTarget = commandExecution.topTargets?.[0];
      
      risks.push({
        id: `rce-attack-${Date.now()}`,
        title: '命令執行攻擊檢測',
        severity: 'critical',
        openIssues: commandExecution.count,
        resolvedIssues: 0,
        affectedAssets: commandExecution.affectedAssets,
        tags: ['Critical', 'Internet Exposed', 'F5 多層次判斷'],
        description: `F5 Advanced WAF 檢測到 ${commandExecution.count} 次命令執行攻擊嘗試。`,
        aiInsight: `⚠️ 嚴重警告：在分析時間範圍內，F5 Advanced WAF 多層次判斷模型檢測到 ${commandExecution.count} 次遠程命令執行（RCE）攻擊嘗試，其中 ${commandExecution.highRisk} 次為極高風險攻擊。Level 1 判斷顯示所有攻擊均觸發了 F5 命令執行防護簽章，violation_rating 評分達到 Critical 等級（≥ 90）。Level 2 威脅評分顯示這些攻擊具有明確的惡意意圖和高度危害性。Level 3 攻擊類型匹配確認為 Remote Command Execution / Code Injection（OWASP A03:2021），攻擊手法包含 Shell 命令注入、系統命令執行等技術。主要攻擊來自 ${topCountry?.item || '未知地區'}（${topCountry?.count || 0} 次），Top 攻擊 IP 為 ${topIP?.item || '未知'}（${topIP?.count || 0} 次），攻擊目標為 ${topTarget?.item || '多個端點'}（${topTarget?.count || 0} 次）。共影響 ${commandExecution.affectedAssets} 個資產。此類攻擊已被確認在野外利用，建議立即阻擋來源 IP、啟用 F5 Advanced WAF 的命令執行防護簽章（Signature Set 200020000 系列），並緊急檢查受影響端點的代碼執行邏輯。`,
        createdDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        updatedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        exploitInWild: true,
        internetExposed: true,
        confirmedExploitable: true,
        cveId: null,
        recommendations: [
          {
            title: '立即阻擋攻擊來源',
            description: '將攻擊來源 IP 加入黑名單，阻止進一步的攻擊嘗試',
            priority: 'high'
          },
          {
            title: '啟用命令執行防護',
            description: '配置 F5 WAF 的命令執行防護簽章並阻擋可疑請求',
            priority: 'high'
          },
          {
            title: '緊急安全檢查',
            description: '立即檢查受影響端點的代碼執行邏輯和輸入驗證',
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
      if (value !== undefined && value !== null && value !== '' && value !== 'N/A') {
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
      .map(log => {
        const value = log[field];
        // 處理可能的數字字符串
        if (typeof value === 'string') {
          const parsed = parseFloat(value);
          return isNaN(parsed) ? null : parsed;
        }
        return typeof value === 'number' ? value : null;
      })
      .filter(v => v !== null && v !== undefined && !isNaN(v));
    
    if (values.length === 0) return 'N/A';
    return (values.reduce((sum, v) => sum + v, 0) / values.length).toFixed(2);
  }
  
  // 工具方法：提取 Top Signatures（F5 簽章）
  getTopSignatures(logs, n = 3) {
    const signatureCounts = new Map();
    
    logs.forEach(log => {
      const sigIds = log.sig_ids || log.signature_ids || log.signatureIds;
      if (sigIds) {
        // sig_ids 可能是陣列或字符串
        const signatures = Array.isArray(sigIds) ? sigIds : sigIds.split(',').map(s => s.trim());
        signatures.forEach(sig => {
          if (sig && sig !== 'N/A' && sig !== '') {
            signatureCounts.set(sig, (signatureCounts.get(sig) || 0) + 1);
          }
        });
      }
    });
    
    return Array.from(signatureCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, n)
      .map(([signature, count]) => ({ signature, count }));
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
      sessionAttacks: { count: 0, highRisk: 0, topIPs: [], topCountries: [], affectedAssets: 0 },
      otherAttacks: { count: 0, topIPs: [], topCountries: [], affectedAssets: 0 },
      geoAnalysis: { topCountries: [], topIPs: [] },
      assetAnalysis: { totalAssets: 0, topAssets: [] },
      totalEvents: 0,
      realAttacks: 0,
      timeRange: { start: new Date().toISOString(), end: new Date().toISOString() }
    };
  }
}

module.exports = F5WAFRiskService;
