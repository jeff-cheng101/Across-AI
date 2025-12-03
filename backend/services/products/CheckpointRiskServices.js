// backend/services/products/CheckpointRiskServices.js
// Check Point 防火牆風險分析服務（重構版 - 五層判斷模型）
// 整合：Firewall Action + Threat Prevention + App Risk + URI/UA Analysis + URL Filtering

const { elkMCPClient } = require('../elkMCPClient');
const { CHECKPOINT_FIELD_MAPPING } = require('../../config/products/checkpoint/chcekpointFieldMapping');
const {
  CHECKPOINT_APP_RISK_MAPPING,
  CHECKPOINT_ACTION_MAPPING,
  THREAT_PREVENTION_MAPPING,
  URL_CATEGORY_MAPPING,
  OWASP_TOP10_PATTERNS,
  MALICIOUS_USER_AGENT_PATTERNS,
  analyzeThreatLevel,
  classifyAction,
  analyzeURIPattern,
  analyzeUserAgent,
  calculateThreatScore,
  classifyByThreatScore,
  isHighRiskThreat,
  analyzeLogEntry
} = require('../../config/products/checkpoint/checkpointStandards');
const checkpointELKConfig = require('../../config/products/checkpoint/checkpointELKConfig');

class CheckpointRiskServices {
  constructor() {
    console.log('🔧 初始化 Check Point 防火牆風險分析服務（五層判斷模型）...');
    this.elkClient = elkMCPClient;
    this.fieldMapping = CHECKPOINT_FIELD_MAPPING;
    this.elkConfig = checkpointELKConfig;
  }
  
  /**
   * ⭐ 主要方法：分析 Check Point 防火牆風險（五層判斷模型）
   * Layer 1: Firewall Action (Drop/Reject/Accept/Alert/Info)
   * Layer 2: Threat Prevention (threat_severity/threat_name/burst_count)
   * Layer 3: Application Risk (app_risk 0-5)
   * Layer 4: URI/UA Analysis (OWASP TOP 10)
   * Layer 5: URL Filtering (url_category)
   */
  async analyzeCheckPoint(timeRange = '24h') {
    console.log(`\n🔍 ===== 開始 Check Point 防火牆風險分析（五層模型）=====`);
    console.log(`📅 時間範圍: ${timeRange}`);
    console.log(`📊 索引: ${this.elkConfig.index}`);
    
    try {
      // Step 1: 透過 ELK MCP 查詢 Check Point 日誌
      console.log('\n⭐ Step 1: 透過 MCP 查詢 Check Point 日誌...');
      const elkData = await this.elkClient.queryElasticsearch(
        timeRange,
        { indexPattern: this.elkConfig.index }
      );
      
      if (!elkData.hits || elkData.hits.length === 0) {
        console.log('⚠️ 未找到日誌資料');
        return this.getEmptyAnalysisResult();
      }
      
      // Step 2: 解析 Check Point 日誌（包含時間修正）
      console.log(`\n⭐ Step 2: 解析 ${elkData.hits.length} 筆日誌...`);
      const logEntries = elkData.hits.map(hit => this.parseCheckPointLog(hit.source));
      console.log(`✅ 成功解析 ${logEntries.length} 筆日誌`);
      
      // 計算實際日誌時間範圍
      const actualTimeRange = this.calculateActualTimeRange(logEntries);
      console.log(`📅 實際日誌時間範圍（UTC+8）:`);
      console.log(`   開始: ${this.formatTimeTaipei(actualTimeRange.start)}`);
      console.log(`   結束: ${this.formatTimeTaipei(actualTimeRange.end)}`);
      
      // 診斷：顯示前 3 筆日誌的基本資訊
      console.log('\n📊 日誌診斷（前 3 筆）:');
      logEntries.slice(0, 3).forEach((log, index) => {
        console.log(`  ${index + 1}. App: ${log.appi_name} | Risk: ${log.app_risk} | Action: ${log.action} | Threat: ${log.threat_severity || 'N/A'}`);
      });
      
      // 統計動作分佈
      const actionDistribution = {};
      logEntries.forEach(log => {
        const action = log.action || 'Unknown';
        actionDistribution[action] = (actionDistribution[action] || 0) + 1;
      });
      console.log('\n📊 防火牆動作統計:');
      Object.entries(actionDistribution).forEach(([action, count]) => {
        console.log(`  - ${action}: ${count} 筆 (${(count/logEntries.length*100).toFixed(1)}%)`);
      });
      
      // Step 3: 使用五層判斷模型分析威脅
      console.log('\n⭐ Step 3: 使用五層判斷模型分析威脅...');
      const analysisResults = logEntries.map(log => analyzeLogEntry(log));
      
      // 過濾出真實威脅
      const realThreats = analysisResults.filter(result => result.isThreat);
      console.log(`   檢測到 ${realThreats.length} 個真實威脅（共 ${logEntries.length} 筆日誌）`);
      
      // 統計各層判斷結果
      const layerStats = {};
      analysisResults.filter(r => r.isThreat).forEach(result => {
        const layer = result.layer || 'UNKNOWN';
        layerStats[layer] = (layerStats[layer] || 0) + 1;
      });
      console.log('\n📊 判斷層級統計:');
      Object.entries(layerStats).forEach(([layer, count]) => {
        console.log(`  - ${layer}: ${count} 次`);
      });
      
      // Step 4: 分析各類型威脅（基於五層判斷）
      console.log('\n⭐ Step 4: 分析各類型威脅...');
      const blockedTraffic = this.analyzeBlockedTraffic(logEntries, analysisResults);
      const highRiskApps = this.analyzeHighRiskApps(logEntries, analysisResults);
      const threatPrevention = this.analyzeThreatPrevention(logEntries, analysisResults);
      const urlFiltering = this.analyzeURLFiltering(logEntries, analysisResults);
      const owaspAttacks = this.analyzeOWASPAttacks(logEntries, analysisResults);
      
      // Step 5: 地理位置分析（Top 5 來源國家）
      const geoDistribution = this.analyzeGeoDistribution(logEntries);
      
      // Step 6: 資產分析（Top 5 受攻擊資產）
      const assetAnalysis = this.analyzeTopTargetedAssets(logEntries, realThreats);
      
      // 綜合分析結果
      const analysisData = {
        timeRange: actualTimeRange,
        totalEvents: logEntries.length,
        totalThreats: realThreats.length,
        layerStats: layerStats,
        blockedTraffic: blockedTraffic,
        highRiskApps: highRiskApps,
        threatPrevention: threatPrevention,
        urlFiltering: urlFiltering,
        owaspAttacks: owaspAttacks,
        geoDistribution: geoDistribution,
        topAssets: assetAnalysis,
        analysisResults: analysisResults
      };
      
      console.log('\n✅ 分析完成！');
      return analysisData;
      
    } catch (error) {
      console.error('❌ Check Point 分析過程發生錯誤:', error);
      throw error;
    }
  }
  
  /**
   * 解析 Check Point 日誌（包含時間處理修正）
   */
  parseCheckPointLog(rawLog) {
    // 安全獲取欄位值的輔助函數（優先使用直接欄位名，再嘗試映射）
    const safeGet = (fieldName, alternativeFields = []) => {
      // 優先使用映射配置的欄位名
      const fieldConfig = this.fieldMapping[fieldName];
      if (fieldConfig && fieldConfig.elk_field && rawLog[fieldConfig.elk_field] !== undefined) {
        return rawLog[fieldConfig.elk_field];
      }
      
      // 嘗試直接使用欄位名
      if (rawLog[fieldName] !== undefined) {
        return rawLog[fieldName];
      }
      
      // 嘗試備用欄位名
      for (const altField of alternativeFields) {
        if (rawLog[altField] !== undefined) {
          return rawLog[altField];
        }
      }
      
      return undefined;
    };
    
    // 處理時間戳記（支援 Unix timestamp 和 ISO 8601）
    const rawTimestamp = safeGet('@timestamp', ['time', 'timestamp']);
    
    let timestamp;
    if (typeof rawTimestamp === 'number') {
      // Unix timestamp (秒或毫秒)
      timestamp = new Date(rawTimestamp > 10000000000 ? rawTimestamp : rawTimestamp * 1000).toISOString();
    } else if (typeof rawTimestamp === 'string') {
      // ISO 8601 格式
      timestamp = new Date(rawTimestamp).toISOString();
    } else {
      // 預設當前時間
      timestamp = new Date().toISOString();
    }
    
    return {
      // 基本欄位
      timestamp: timestamp,
      log_uid: safeGet('loguid', ['log_uid', 'uid']),
      action: safeGet('action'),
      rule_uid: safeGet('rule_uid', ['ruleuid']),
      rule_name: safeGet('rule_name'),
      
      // 來源/目的地
      src_ip: safeGet('src', ['src_ip', 'origin']),
      dst_ip: safeGet('dst', ['dst_ip']),
      src_country: safeGet('src_country', ['origin_sic_name', 's_location']),
      dst_country: safeGet('dst_country', ['xlatedst_country', 'd_location']),
      src_machine_name: safeGet('src_machine_name', ['src_host']),
      dst_machine_name: safeGet('dst_machine_name', ['dst_host', 'dst_domain_name']),
      
      // 應用程式
      appi_name: safeGet('appi_name', ['app_name', 'application']),
      app_category: safeGet('app_category', ['category']),
      app_risk: safeGet('app_risk', ['risk']),
      app_id: safeGet('app_id'),
      
      // Threat Prevention 欄位（新增）
      threat_severity: safeGet('threat_severity', ['severity']),
      threat_name: safeGet('threat_name'),
      threat_category: safeGet('threat_category'),
      burst_count: safeGet('burst_count'),
      count: safeGet('count'),
      
      // HTTP 欄位（新增）
      http_user_agent: safeGet('http_user_agent', ['user_agent']),
      http_url: safeGet('http_url', ['url']),
      http_method: safeGet('http_method', ['method']),
      
      // URL Filtering 欄位（新增）
      url_category: safeGet('url_category'),
      url_reputation: safeGet('url_reputation', ['reputation']),
      
      // 網路層
      protocol: safeGet('protocol', ['proto']),
      service: safeGet('service', ['service_id']),
      dst_port: safeGet('service', ['dst_port', 'port']),
      
      // 原始數據
      rawLog: rawLog
    };
  }
  
  /**
   * 計算實際日誌時間範圍
   */
  calculateActualTimeRange(logEntries) {
    if (!logEntries || logEntries.length === 0) {
      const now = new Date().toISOString();
      return { start: now, end: now };
    }
    
    const timestamps = logEntries
      .map(log => new Date(log.timestamp).getTime())
      .filter(t => !isNaN(t));
    
    if (timestamps.length === 0) {
      const now = new Date().toISOString();
      return { start: now, end: now };
    }
    
    const start = new Date(Math.min(...timestamps)).toISOString();
    const end = new Date(Math.max(...timestamps)).toISOString();
    
    return { start, end };
  }
  
  /**
   * 格式化時間（台灣時區 UTC+8）
   */
  formatTimeTaipei(isoString) {
    return new Date(isoString).toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Taipei',
      hour12: false
    });
  }
  
  /**
   * 格式化日期（台灣時區）
   */
  formatDateTaipei(isoString) {
    return new Date(isoString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'Asia/Taipei'
    });
  }
  
  /**
   * 分析被封鎖的流量（Layer 1: Action = Drop/Reject）
   */
  analyzeBlockedTraffic(logEntries, analysisResults) {
    const blocked = analysisResults.filter(
      result => result.isBlocked && result.layer === 'FIREWALL_ACTION'
    );
    
    // 統計被封鎖的應用程式
    const blockedApps = {};
    blocked.forEach(result => {
      const originalLog = logEntries.find(log => log.log_uid === result.originalData?.log_uid);
      if (originalLog) {
        const appName = originalLog.appi_name || 'Unknown';
        if (!blockedApps[appName]) {
          blockedApps[appName] = {
            appName: appName,
            count: 0,
            action: originalLog.action,
            app_risk: originalLog.app_risk,
            app_category: originalLog.app_category,
            ips: new Set()
          };
        }
        blockedApps[appName].count++;
        blockedApps[appName].ips.add(originalLog.src_ip);
      }
    });
    
    // 轉換為陣列並排序
    const topBlockedApps = Object.values(blockedApps)
      .map(app => ({
        ...app,
        uniqueIPs: app.ips.size,
        ips: undefined
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    return {
      totalBlocked: blocked.length,
      topBlockedApps: topBlockedApps
    };
  }
  
  /**
   * 分析高風險應用程式（Layer 3: app_risk >= 4）
   */
  analyzeHighRiskApps(logEntries, analysisResults) {
    const highRisk = analysisResults.filter(
      result => result.layer === 'APP_RISK_ASSESSMENT' && result.isThreat
    );
    
    const appStats = {};
    highRisk.forEach(result => {
      const originalLog = logEntries.find(log => log.log_uid === result.originalData?.log_uid);
      if (originalLog) {
        const appName = originalLog.appi_name || 'Unknown';
        if (!appStats[appName]) {
          appStats[appName] = {
            appName: appName,
            app_risk: originalLog.app_risk,
            app_category: originalLog.app_category,
            count: 0,
            allowedCount: 0,
            blockedCount: 0,
            ips: new Set()
          };
        }
        appStats[appName].count++;
        appStats[appName].ips.add(originalLog.src_ip);
        
        if (result.isBlocked) {
          appStats[appName].blockedCount++;
        } else {
          appStats[appName].allowedCount++;
        }
      }
    });
    
    const topHighRiskApps = Object.values(appStats)
      .map(app => ({
        ...app,
        uniqueIPs: app.ips.size,
        ips: undefined
      }))
      .sort((a, b) => b.app_risk - a.app_risk || b.count - a.count)
      .slice(0, 10);
    
    return {
      totalHighRiskEvents: highRisk.length,
      topHighRiskApps: topHighRiskApps
    };
  }
  
  /**
   * 分析 Threat Prevention 檢測（Layer 2: threat_severity）
   */
  analyzeThreatPrevention(logEntries, analysisResults) {
    const threats = analysisResults.filter(
      result => result.layer === 'THREAT_PREVENTION' && result.isThreat
    );
    
    const threatStats = {};
    threats.forEach(result => {
      const originalLog = logEntries.find(log => log.log_uid === result.originalData?.log_uid);
      if (originalLog && originalLog.threat_name) {
        const threatName = originalLog.threat_name;
        if (!threatStats[threatName]) {
          threatStats[threatName] = {
            threatName: threatName,
            threat_severity: originalLog.threat_severity,
            threat_category: originalLog.threat_category,
            count: 0,
            ips: new Set(),
            actions: {}
          };
        }
        threatStats[threatName].count++;
        threatStats[threatName].ips.add(originalLog.src_ip);
        
        const action = originalLog.action || 'Unknown';
        threatStats[threatName].actions[action] = (threatStats[threatName].actions[action] || 0) + 1;
      }
    });
    
    const topThreats = Object.values(threatStats)
      .map(threat => ({
        ...threat,
        uniqueIPs: threat.ips.size,
        ips: undefined
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    return {
      totalThreatPreventionEvents: threats.length,
      topThreats: topThreats
    };
  }
  
  /**
   * 分析 URL Filtering 違規（Layer 5: url_category）
   */
  analyzeURLFiltering(logEntries, analysisResults) {
    const violations = analysisResults.filter(
      result => result.layer === 'URL_FILTERING' && result.isThreat
    );
    
    const categoryStats = {};
    violations.forEach(result => {
      const originalLog = logEntries.find(log => log.log_uid === result.originalData?.log_uid);
      if (originalLog && originalLog.url_category) {
        const category = originalLog.url_category;
        if (!categoryStats[category]) {
          categoryStats[category] = {
            category: category,
            count: 0,
            ips: new Set(),
            actions: {}
          };
        }
        categoryStats[category].count++;
        categoryStats[category].ips.add(originalLog.src_ip);
        
        const action = originalLog.action || 'Unknown';
        categoryStats[category].actions[action] = (categoryStats[category].actions[action] || 0) + 1;
      }
    });
    
    const topCategories = Object.values(categoryStats)
      .map(cat => ({
        ...cat,
        uniqueIPs: cat.ips.size,
        ips: undefined
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    return {
      totalURLFilteringViolations: violations.length,
      topCategories: topCategories
    };
  }
  
  /**
   * 分析 OWASP 攻擊模式（Layer 4: URI/UA Analysis）
   */
  analyzeOWASPAttacks(logEntries, analysisResults) {
    const owaspAttacks = analysisResults.filter(
      result => (result.layer === 'URI_UA_ANALYSIS') && result.isThreat
    );
    
    const attackTypeStats = {};
    owaspAttacks.forEach(result => {
      const attackType = result.uriAnalysis?.attackType || result.uaAnalysis?.attackType || 'UNKNOWN';
      const owaspCategory = result.uriAnalysis?.owaspCategory || 'Unknown';
      
      if (!attackTypeStats[attackType]) {
        attackTypeStats[attackType] = {
          attackType: attackType,
          owaspCategory: owaspCategory,
          count: 0,
          ips: new Set()
        };
      }
      attackTypeStats[attackType].count++;
      
      const originalLog = logEntries.find(log => log.log_uid === result.originalData?.log_uid);
      if (originalLog) {
        attackTypeStats[attackType].ips.add(originalLog.src_ip);
      }
    });
    
    const topAttackTypes = Object.values(attackTypeStats)
      .map(attack => ({
        ...attack,
        uniqueIPs: attack.ips.size,
        ips: undefined
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    return {
      totalOWASPAttacks: owaspAttacks.length,
      topAttackTypes: topAttackTypes
    };
  }
  
  /**
   * 地理位置分析（Top 5 來源國家）
   */
  analyzeGeoDistribution(logEntries) {
    const countryStats = {};
    
    logEntries.forEach(log => {
      const country = log.src_country || 'Unknown';
      if (!countryStats[country]) {
        countryStats[country] = {
          country: country,
          count: 0,
          ips: new Set()
        };
      }
      countryStats[country].count++;
      countryStats[country].ips.add(log.src_ip);
    });
    
    const topCountries = Object.values(countryStats)
      .map(stat => ({
        ...stat,
        uniqueIPs: stat.ips.size,
        ips: undefined
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    return topCountries;
  }
  
  /**
   * 資產分析（Top 5 受攻擊資產）
   */
  analyzeTopTargetedAssets(logEntries, threats) {
    const assetStats = {};
    
    threats.forEach(threat => {
      const originalLog = logEntries.find(log => log.log_uid === threat.originalData?.log_uid);
      if (originalLog) {
        const asset = originalLog.dst_ip || originalLog.dst_machine_name || 'Unknown';
        if (!assetStats[asset]) {
          assetStats[asset] = {
            asset: asset,
            dst_ip: originalLog.dst_ip,
            dst_machine_name: originalLog.dst_machine_name,
            attackCount: 0,
            attackers: new Set(),
            severityDistribution: { critical: 0, high: 0, medium: 0, low: 0 }
          };
        }
        assetStats[asset].attackCount++;
        assetStats[asset].attackers.add(originalLog.src_ip);
        
        const severity = threat.severity || 'low';
        assetStats[asset].severityDistribution[severity] = 
          (assetStats[asset].severityDistribution[severity] || 0) + 1;
      }
    });
    
    const topAssets = Object.values(assetStats)
      .map(asset => ({
        ...asset,
        uniqueAttackers: asset.attackers.size,
        attackers: undefined
      }))
      .sort((a, b) => b.attackCount - a.attackCount)
      .slice(0, 5);
    
    return topAssets;
  }
  
  /**
   * Top 5 來源 IP（含國家資訊）
   */
  getTopIPsWithCountry(logEntries, n = 5) {
    const ipStats = {};
    
    logEntries.forEach(log => {
      const ip = log.src_ip;
      if (!ip) return;
      
      if (!ipStats[ip]) {
        ipStats[ip] = {
          ip: ip,
          country: log.src_country || 'Unknown',
          count: 0
        };
      }
      ipStats[ip].count++;
    });
    
    return Object.values(ipStats)
      .sort((a, b) => b.count - a.count)
      .slice(0, n);
  }
  
  // ==================== AI Prompt 輔助函數（動態從配置檔案提取）====================
  
  /**
   * 從 CHECKPOINT_FIELD_MAPPING 提取 AI 需要的欄位說明
   * 資料來源：chcekpointFieldMapping.js
   */
  generateFieldMappingContext() {
    // 選取 AI 分析時最關鍵的欄位
    const importantFields = [
      'action', 'threat_severity', 'threat_name', 'threat_category',
      'app_risk', 'appi_name', 'app_category',
      'url_category', 'url_reputation',
      'http_user_agent', 'http_url', 'http_method',
      'burst_count', 'src', 'dst'
    ];
    
    const fieldDescriptions = importantFields.map(fieldName => {
      const config = this.fieldMapping[fieldName];
      if (config) {
        return `- **${fieldName}** (${config.elk_field}): ${config.description}\n  - AI 分析說明: ${config.ai_context}\n  - 範例值: ${config.example || 'N/A'}`;
      }
      return null;
    }).filter(Boolean);
    
    return fieldDescriptions.join('\n\n');
  }
  
  /**
   * 從 CHECKPOINT_ACTION_MAPPING 提取 Action 判斷規則
   * 資料來源：checkpointStandards.js
   */
  generateActionMappingContext() {
    return Object.entries(CHECKPOINT_ACTION_MAPPING).map(([action, config]) => {
      const reasons = config.reason_categories ? config.reason_categories.slice(0, 3).join('、') : '';
      return `- **${action}** (${config.displayName}):
  - 是否封鎖: ${config.isBlocked ? '是' : '否'}
  - 是否威脅: ${config.isThreat ? '是' : '否'}
  - 嚴重程度: ${config.severity}
  - 說明: ${config.description}
  - AI 分析建議: ${config.aiContext}
  - 可能原因: ${reasons}`;
    }).join('\n\n');
  }
  
  /**
   * 從 THREAT_PREVENTION_MAPPING 提取威脅等級判斷規則
   * 資料來源：checkpointStandards.js
   */
  generateThreatPreventionContext() {
    // 嚴重程度
    const severitySection = Object.entries(THREAT_PREVENTION_MAPPING.SEVERITY).map(([level, config]) => {
      return `- **${level}** (${config.displayName}): 分數=${config.score}, 嚴重程度=${config.severity}\n  - AI 分析說明: ${config.aiContext}`;
    }).join('\n');
    
    // 威脅類別
    const categorySection = Object.entries(THREAT_PREVENTION_MAPPING.CATEGORY).map(([category, config]) => {
      return `- **${category}**: ${config.description} (${config.owaspCategory}), 類型=${config.type}, 嚴重程度=${config.severity}`;
    }).join('\n');
    
    return `**威脅嚴重程度判斷 (threat_severity)**:\n${severitySection}\n\n**威脅類別判斷 (threat_category)**:\n${categorySection}`;
  }
  
  /**
   * 從 CHECKPOINT_APP_RISK_MAPPING 提取應用程式風險等級
   * 資料來源：checkpointStandards.js
   */
  generateAppRiskContext() {
    return Object.entries(CHECKPOINT_APP_RISK_MAPPING)
      .sort((a, b) => parseInt(b[0]) - parseInt(a[0])) // 從高到低排序
      .map(([level, config]) => {
        return `- **app_risk = ${level}** (${config.displayName}): 嚴重程度=${config.severity}, 建議操作=${config.action_recommendation}\n  - 說明: ${config.description}`;
      }).join('\n');
  }
  
  /**
   * 從 URL_CATEGORY_MAPPING 提取 URL 分類規則
   * 資料來源：checkpointStandards.js
   */
  generateURLCategoryContext() {
    return Object.entries(URL_CATEGORY_MAPPING).map(([category, config]) => {
      return `- **${category}** (${config.displayName}): 嚴重程度=${config.severity}, 違規類型=${config.violation_type}\n  - 說明: ${config.description}\n  - 建議操作: ${config.action_recommendation}`;
    }).join('\n\n');
  }
  
  /**
   * 從 OWASP_TOP10_PATTERNS 提取攻擊模式
   * 資料來源：checkpointStandards.js
   */
  generateOWASPContext() {
    return Object.entries(OWASP_TOP10_PATTERNS).map(([attackType, config]) => {
      const patterns = config.patterns.slice(0, 5).join(', ');
      return `- **${attackType}** (${config.category} - ${config.name}):\n  - 偵測模式範例: ${patterns}...`;
    }).join('\n\n');
  }
  
  /**
   * 從 MALICIOUS_USER_AGENT_PATTERNS 提取惡意 UA 特徵
   * 資料來源：checkpointStandards.js
   */
  generateMaliciousUAContext() {
    return Object.entries(MALICIOUS_USER_AGENT_PATTERNS).map(([category, config]) => {
      const patterns = config.patterns.slice(0, 5).join(', ');
      return `- **${category}** (嚴重程度: ${config.severity}): ${config.description}\n  - 偵測工具: ${patterns}...`;
    }).join('\n\n');
  }
  
  /**
   * 產生 AI 分析提示詞（動態從配置檔案提取）
   */
  generateAIPrompt(analysisData) {
    const { timeRange, totalEvents, totalThreats } = analysisData;
    
    // 動態提取配置說明
    const fieldMappingContext = this.generateFieldMappingContext();
    const actionMappingContext = this.generateActionMappingContext();
    const threatPreventionContext = this.generateThreatPreventionContext();
    const appRiskContext = this.generateAppRiskContext();
    const urlCategoryContext = this.generateURLCategoryContext();
    const owaspContext = this.generateOWASPContext();
    const maliciousUAContext = this.generateMaliciousUAContext();
    
    const promptTemplate = `
你是一位資深的網路安全分析專家，專精於 **Check Point 防火牆**日誌分析和威脅識別。

⚠️ **重要要求**：
1. **語言要求**：請務必使用「繁體中文」回應所有內容，包括標題、描述、AI 洞察分析、建議操作等。
2. **產品識別**：這是 **Check Point 防火牆** 的安全分析，請勿混淆成其他產品：
   - ❌ 不是 Palo Alto Networks
   - ❌ 不是 Fortinet / FortiGate
   - ❌ 不是 Cisco ASA
   - ✅ 這是 **Check Point Firewall / Application Control / Threat Prevention / URL Filtering**
3. 所有分析和建議都必須基於 Check Point 產品的功能和術語。

---

### 【任務說明】

請根據以下 Check Point 防火牆日誌數據，**自動識別並分類所有威脅類型**，生成完整的風險評估報告。

**重要：請不要使用預設的威脅類型清單。所有威脅類型都應該從日誌數據中自動識別。**

---

### 【資料來源】

- **產品**: Check Point Firewall
- **索引名稱**: ${this.elkConfig.index}
- **分析時間範圍（台灣時間 UTC+8）**: 
  - 開始: ${this.formatTimeTaipei(timeRange.start)}
  - 結束: ${this.formatTimeTaipei(timeRange.end)}
- **總日誌數**: ${totalEvents.toLocaleString()} 筆
- **檢測到的威脅數**: ${totalThreats.toLocaleString()} 筆
- **分析時間**: ${this.formatTimeTaipei(new Date().toISOString())}

---

### 【ELK 日誌欄位說明】
（來源：chcekpointFieldMapping.js）

以下是 Check Point 日誌中關鍵欄位的定義和 AI 分析說明：

${fieldMappingContext}

---

### 【Check Point 五層判斷模型】

本分析採用 Check Point 五層判斷模型，以下規則來自 checkpointStandards.js：

**Layer 1: Firewall Action (防火牆動作判斷)**
（來源：CHECKPOINT_ACTION_MAPPING）

${actionMappingContext}

---

**Layer 2: Threat Prevention (威脅防護判斷)**
（來源：THREAT_PREVENTION_MAPPING）

${threatPreventionContext}

---

**Layer 3: Application Risk (應用程式風險判斷)**
（來源：CHECKPOINT_APP_RISK_MAPPING）

${appRiskContext}

---

**Layer 4: URI/UA Analysis (OWASP TOP 10 攻擊模式判斷)**
（來源：OWASP_TOP10_PATTERNS + MALICIOUS_USER_AGENT_PATTERNS）

**OWASP TOP 10 2021 攻擊模式**:
${owaspContext}

**惡意 User-Agent 特徵庫**:
${maliciousUAContext}

---

**Layer 5: URL Filtering (URL 分類判斷)**
（來源：URL_CATEGORY_MAPPING）

${urlCategoryContext}

---

### 【分析數據】

${JSON.stringify(analysisData, null, 2)}

---

### 【輸出格式要求】

請使用 JSON 格式輸出，**所有文字內容必須使用繁體中文**，必須包含以下結構：

\`\`\`json
{
  "risks": [
    {
      "id": "risk_001",
      "title": "威脅標題（繁體中文，從日誌中自動識別）",
      "severity": "critical/high/medium/low",
      "category": "BLOCKED_ATTACK/THREAT_PREVENTION/HIGH_RISK_APP/URI_ATTACK/URL_FILTERING",
      "layer": "FIREWALL_ACTION/THREAT_PREVENTION/APP_RISK_ASSESSMENT/URI_UA_ANALYSIS/URL_FILTERING",
      "description": "威脅詳細描述（繁體中文）",
      "affectedAssets": ["資產1", "資產2"],
      "attackCount": 數量,
      "uniqueIPs": 唯一 IP 數量,
      "topCountries": ["國家1", "國家2"],
      "aiInsight": "AI 深度洞察分析（繁體中文，必須包含具體數字和 Check Point 專業術語）",
      "recommendations": [
        {
          "priority": "high/medium/low",
          "title": "建議標題（繁體中文）",
          "description": "具體的 Check Point 操作建議（繁體中文，例如：在 SmartConsole 中設定...）"
        }
      ],
      "openIssues": 未解決問題數,
      "resolvedIssues": 已解決問題數,
      "createdDate": "建立日期",
      "updatedDate": "更新日期"
    }
  ],
  "summary": {
    "totalRisks": 風險總數,
    "criticalCount": 嚴重風險數,
    "highCount": 高風險數,
    "mediumCount": 中風險數,
    "lowCount": 低風險數
  }
}
\`\`\`

### 【分析要點】

1. **自動識別威脅**：從日誌數據中自動識別威脅類型，不要使用預設清單
2. **多層判斷**：根據上述五層判斷模型分類威脅，每個風險必須標明是哪一層判斷出來的
3. **優先級排序**：按照威脅嚴重程度排序（critical > high > medium > low）
4. **可操作建議**：提供具體的 Check Point 緩解措施（使用 SmartConsole、SmartDashboard 等 Check Point 工具術語）
5. **關聯分析**：識別相關聯的攻擊模式
6. **繁體中文**：所有輸出內容必須使用繁體中文

請開始分析。
    `.trim();
    
    return promptTemplate;
  }
  
  /**
   * 產生備用風險報告（當 AI 無法使用時）
   */
  generateFallbackRisks(analysisData) {
    const { timeRange, totalEvents, totalThreats, blockedTraffic, highRiskApps, threatPrevention, urlFiltering, owaspAttacks } = analysisData;
    
    const risks = [];
    let riskId = 1;
    
    // Risk 1: 被封鎖的流量
    if (blockedTraffic.totalBlocked > 0) {
      risks.push({
        id: `risk_${String(riskId++).padStart(3, '0')}`,
        title: '防火牆已封鎖的威脅流量',
        severity: 'critical',
        category: 'BLOCKED_ATTACK',
        layer: 'FIREWALL_ACTION',
        description: `防火牆檢測並封鎖了 ${blockedTraffic.totalBlocked} 筆威脅流量`,
        affectedAssets: blockedTraffic.topBlockedApps.slice(0, 5).map(app => app.appName),
        attackCount: blockedTraffic.totalBlocked,
        uniqueIPs: blockedTraffic.topBlockedApps.reduce((sum, app) => sum + app.uniqueIPs, 0),
        topApps: blockedTraffic.topBlockedApps.slice(0, 5),
        aiInsight: '這些流量已被防火牆成功封鎖，表示安全規則正在發揮作用。',
        recommendations: [
          { priority: 'medium', action: '檢查封鎖規則是否過於嚴格', reason: '避免誤封正常流量' },
          { priority: 'low', action: '定期審查封鎖日誌', reason: '持續優化安全規則' }
        ],
        createdDate: this.formatDateTaipei(timeRange.start),
        updatedDate: this.formatDateTaipei(timeRange.end)
      });
    }
    
    // Risk 2: 高風險應用程式
    if (highRiskApps.totalHighRiskEvents > 0) {
      risks.push({
        id: `risk_${String(riskId++).padStart(3, '0')}`,
        title: '高風險應用程式活動',
        severity: 'high',
        category: 'HIGH_RISK_APPLICATION',
        layer: 'APP_RISK_ASSESSMENT',
        description: `檢測到 ${highRiskApps.totalHighRiskEvents} 筆高風險應用程式（app_risk >= 4）活動`,
        affectedAssets: highRiskApps.topHighRiskApps.slice(0, 5).map(app => app.appName),
        attackCount: highRiskApps.totalHighRiskEvents,
        topApps: highRiskApps.topHighRiskApps.slice(0, 5),
        aiInsight: '這些應用程式具有高安全風險，建議限制或監控其使用。',
        recommendations: [
          { priority: 'high', action: '審查高風險應用程式使用政策', reason: '降低安全風險' },
          { priority: 'high', action: '考慮封鎖或限制高風險應用', reason: '保護企業資產' }
        ],
        createdDate: this.formatDateTaipei(timeRange.start),
        updatedDate: this.formatDateTaipei(timeRange.end)
      });
    }
    
    // Risk 3: Threat Prevention 檢測
    if (threatPrevention.totalThreatPreventionEvents > 0) {
      risks.push({
        id: `risk_${String(riskId++).padStart(3, '0')}`,
        title: 'Threat Prevention 檢測到的威脅',
        severity: 'critical',
        category: 'THREAT_PREVENTION_DETECTED',
        layer: 'THREAT_PREVENTION',
        description: `Threat Prevention 檢測到 ${threatPrevention.totalThreatPreventionEvents} 筆威脅`,
        topThreats: threatPrevention.topThreats.slice(0, 5),
        attackCount: threatPrevention.totalThreatPreventionEvents,
        aiInsight: 'Check Point Threat Prevention 檢測到多種威脅，需要立即調查。',
        recommendations: [
          { priority: 'critical', action: '立即調查威脅來源', reason: '防止攻擊擴散' },
          { priority: 'high', action: '更新 IPS 簽章', reason: '提升檢測能力' }
        ],
        createdDate: this.formatDateTaipei(timeRange.start),
        updatedDate: this.formatDateTaipei(timeRange.end)
      });
    }
    
    // Risk 4: URL Filtering 違規
    if (urlFiltering.totalURLFilteringViolations > 0) {
      risks.push({
        id: `risk_${String(riskId++).padStart(3, '0')}`,
        title: 'URL Filtering 政策違規',
        severity: 'high',
        category: 'URL_FILTERING_VIOLATION',
        layer: 'URL_FILTERING',
        description: `檢測到 ${urlFiltering.totalURLFilteringViolations} 筆 URL Filtering 違規`,
        topCategories: urlFiltering.topCategories.slice(0, 5),
        attackCount: urlFiltering.totalURLFilteringViolations,
        aiInsight: '使用者嘗試訪問違反公司政策的網站類別。',
        recommendations: [
          { priority: 'medium', action: '加強員工安全意識培訓', reason: '減少政策違規' },
          { priority: 'medium', action: '審查 URL Filtering 政策', reason: '確保政策合理性' }
        ],
        createdDate: this.formatDateTaipei(timeRange.start),
        updatedDate: this.formatDateTaipei(timeRange.end)
      });
    }
    
    // Risk 5: OWASP 攻擊模式
    if (owaspAttacks.totalOWASPAttacks > 0) {
      risks.push({
        id: `risk_${String(riskId++).padStart(3, '0')}`,
        title: 'OWASP TOP 10 攻擊模式檢測',
        severity: 'critical',
        category: 'URI_ATTACK_PATTERN',
        layer: 'URI_UA_ANALYSIS',
        description: `檢測到 ${owaspAttacks.totalOWASPAttacks} 筆符合 OWASP TOP 10 的攻擊模式`,
        topAttackTypes: owaspAttacks.topAttackTypes.slice(0, 5),
        attackCount: owaspAttacks.totalOWASPAttacks,
        aiInsight: '檢測到多種 OWASP TOP 10 攻擊模式，包括 SQL 注入、XSS、命令注入等。',
        recommendations: [
          { priority: 'critical', action: '立即調查攻擊來源和目標', reason: '防止資料洩露或系統入侵' },
          { priority: 'high', action: '檢查 Web 應用程式安全性', reason: '修補已知漏洞' },
          { priority: 'high', action: '啟用 WAF 防護', reason: '攔截 Web 應用攻擊' }
        ],
        createdDate: this.formatDateTaipei(timeRange.start),
        updatedDate: this.formatDateTaipei(timeRange.end)
      });
    }
    
    const summary = {
      totalRisks: risks.length,
      criticalCount: risks.filter(r => r.severity === 'critical').length,
      highCount: risks.filter(r => r.severity === 'high').length,
      mediumCount: risks.filter(r => r.severity === 'medium').length,
      lowCount: risks.filter(r => r.severity === 'low').length
    };
    
    return { risks, summary };
  }
  
  /**
   * 空結果
   */
  getEmptyAnalysisResult() {
    return {
      timeRange: { start: new Date().toISOString(), end: new Date().toISOString() },
      totalEvents: 0,
      totalThreats: 0,
      layerStats: {},
      blockedTraffic: { totalBlocked: 0, topBlockedApps: [] },
      highRiskApps: { totalHighRiskEvents: 0, topHighRiskApps: [] },
      threatPrevention: { totalThreatPreventionEvents: 0, topThreats: [] },
      urlFiltering: { totalURLFilteringViolations: 0, topCategories: [] },
      owaspAttacks: { totalOWASPAttacks: 0, topAttackTypes: [] },
      geoDistribution: [],
      topAssets: [],
      analysisResults: []
    };
  }
}

module.exports = CheckpointRiskServices;
