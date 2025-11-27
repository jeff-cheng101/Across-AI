// backend/services/products/CheckpointRiskServices.js
// Check Point 防火牆風險分析服務
// 整合三層判斷模型：應用程式風險評估 + 封鎖流量分析 + 政策違規檢測

const { elkMCPClient } = require('../elkMCPClient');
const { CHECKPOINT_FIELD_MAPPING } = require('../../config/products/checkpoint/chcekpointFieldMapping');
const {
  CHECKPOINT_APP_RISK_MAPPING,
  CHECKPOINT_ACTION_MAPPING,
  POLICY_VIOLATION_CATEGORIES,
  CHECKPOINT_THRESHOLDS,
  SECURITY_ZONE_RISK_MATRIX,
  isRealSecurityThreat,
  calculateThreatScore,
  classifyByThreatScore,
  isHighRiskThreat,
  analyzeLogEntry,
  getPolicyViolationInfo,
  getAppRiskInfo,
  evaluateSecurityZoneRisk
} = require('../../config/products/checkpoint/checkpointStandards');
const checkpointELKConfig = require('../../config/products/checkpoint/checkpointELKConfig');

class CheckpointRiskServices {
  constructor() {
    console.log('🔧 初始化 Check Point 防火牆風險分析服務（三層判斷模型）...');
    this.elkClient = elkMCPClient;
    this.fieldMapping = CHECKPOINT_FIELD_MAPPING;
    this.elkConfig = checkpointELKConfig;
  }
  
  /**
   * ⭐ 主要方法：分析 Check Point 防火牆風險（三層判斷模型）
   * Layer 1: 應用程式風險評估 (app_risk)
   * Layer 2: 被封鎖的流量分析 (action)
   * Layer 3: 違反公司政策的行為 (app_category)
   */
  async analyzeCheckPoint(timeRange = '24h') {
    console.log(`\n🔍 ===== 開始 Check Point 防火牆風險分析（三層模型）=====`);
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
      
      // Step 2: 解析 Check Point 日誌
      console.log(`\n⭐ Step 2: 解析 ${elkData.hits.length} 筆日誌...`);
      
      // 過濾掉無效的記錄（source 為 undefined 或 null）
      const validHits = elkData.hits.filter(hit => hit && hit.source);
      console.log(`   有效記錄: ${validHits.length} / ${elkData.hits.length}`);
      
      if (validHits.length === 0) {
        console.log('⚠️ 沒有有效的日誌資料');
        return this.getEmptyAnalysisResult();
      }
      
      const logEntries = validHits
        .map(hit => this.parseCheckPointLog(hit.source))
        .filter(log => log !== null);  // 過濾掉解析失敗的記錄
      console.log(`✅ 成功解析 ${logEntries.length} 筆日誌`);
      
      // 診斷：顯示前 3 筆日誌的基本資訊
      console.log('\n📊 日誌診斷（前 3 筆）:');
      logEntries.slice(0, 3).forEach((log, index) => {
        console.log(`  ${index + 1}. App: ${log.appi_name} | Risk: ${log.app_risk} | Action: ${log.action} | Category: ${log.app_category}`);
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
      
      // Step 3: 使用三層判斷模型分析威脅
      console.log('\n⭐ Step 3: 使用三層判斷模型分析威脅...');
      const analysisResults = logEntries.map(log => analyzeLogEntry(log));
      
      // 過濾出真實威脅
      const realThreats = analysisResults.filter(result => result.isThreat);
      const realAttacks = analysisResults.filter(result => result.isAttack);
      console.log(`   檢測到 ${realThreats.length} 個真實威脅（共 ${logEntries.length} 筆日誌）`);
      console.log(`   其中 ${realAttacks.length} 個為確定攻擊`);
      
      // 統計各層判斷結果
      const layerStats = {};
      analysisResults.filter(r => r.isThreat).forEach(result => {
        const layer = result.judgmentLayer || 'UNKNOWN';
        layerStats[layer] = (layerStats[layer] || 0) + 1;
      });
      console.log('\n📊 判斷層級統計:');
      Object.entries(layerStats).forEach(([layer, count]) => {
        console.log(`  - ${layer}: ${count} 次`);
      });
      
      // Step 4: 分析各類型威脅（基於三層判斷）
      const blockedTraffic = this.analyzeBlockedTraffic(logEntries, analysisResults);
      const highRiskApps = this.analyzeHighRiskApps(logEntries, analysisResults);
      const policyViolations = this.analyzePolicyViolations(logEntries, analysisResults);
      const suspiciousBehavior = this.analyzeSuspiciousBehavior(logEntries, analysisResults);
      const zoneRisks = this.analyzeSecurityZones(logEntries, analysisResults);
      
      console.log(`\n📊 威脅類型統計:`);
      console.log(`   被封鎖的流量: ${blockedTraffic.count} 次`);
      console.log(`   高風險應用: ${highRiskApps.count} 次`);
      console.log(`   政策違規: ${policyViolations.count} 次`);
      console.log(`   可疑行為: ${suspiciousBehavior.count} 次`);
      console.log(`   安全區域風險: ${zoneRisks.count} 次`);
      
      // Step 5: 生成統計資料
      const geoAnalysis = this.analyzeGeoDistribution(logEntries);
      const assetAnalysis = this.analyzeAffectedAssets(logEntries);
      const appAnalysis = this.analyzeApplications(logEntries);
      
      // 計算時間範圍
      const timestamps = logEntries
        .map(log => log.timestamp)
        .filter(t => t)
        .map(t => new Date(t).getTime());
      
      const timeRange_result = {
        start: timestamps.length > 0 ? new Date(Math.min(...timestamps)).toISOString() : new Date().toISOString(),
        end: timestamps.length > 0 ? new Date(Math.max(...timestamps)).toISOString() : new Date().toISOString()
      };
      
      console.log('\n✅ ===== Check Point 防火牆風險分析完成 =====\n');
      
      return {
        blockedTraffic,
        highRiskApps,
        policyViolations,
        suspiciousBehavior,
        zoneRisks,
        geoAnalysis,
        assetAnalysis,
        appAnalysis,
        totalEvents: logEntries.length,
        realThreats: realThreats.length,
        realAttacks: realAttacks.length,
        timeRange: timeRange_result,
        layerStats: layerStats
      };
      
    } catch (error) {
      console.error('❌ Check Point 風險分析失敗:', error);
      throw error;
    }
  }
  
  /**
   * 解析 Check Point 日誌
   * 使用 checkpointFieldMapping.js 的欄位對應
   */
  parseCheckPointLog(rawLog) {
    // 防護檢查：確保 rawLog 不是 undefined 或 null
    if (!rawLog) {
      console.warn('⚠️ 警告: 收到空的日誌記錄，跳過');
      return null;
    }
    
    // 提取基本欄位
    const log = {
      // 時間戳記
      timestamp: rawLog[this.fieldMapping['@timestamp'].elk_field] || rawLog.time,
      
      // 日誌識別
      loguid: rawLog[this.fieldMapping.loguid.elk_field],
      logid: rawLog[this.fieldMapping.logid.elk_field],
      
      // 網路位址
      src: rawLog[this.fieldMapping.src.elk_field],
      dst: rawLog[this.fieldMapping.dst.elk_field],
      origin: rawLog[this.fieldMapping.origin?.elk_field],
      dst_domain_name: rawLog[this.fieldMapping.dst_domain_name?.elk_field],
      
      // 服務與協定
      service: rawLog[this.fieldMapping.service.elk_field],
      service_id: rawLog[this.fieldMapping.service_id?.elk_field],
      protocol: rawLog[this.fieldMapping.protocol?.elk_field],
      proto: rawLog[this.fieldMapping.proto?.elk_field],
      
      // ⭐ 核心欄位：防火牆動作（Layer 1）
      action: rawLog[this.fieldMapping.action.elk_field],
      
      // ⭐ 核心欄位：應用程式風險（Layer 2）
      app_risk: rawLog[this.fieldMapping.app_risk?.elk_field] || 0,
      appi_name: rawLog[this.fieldMapping.appi_name?.elk_field],
      
      // ⭐ 核心欄位：應用程式類別（Layer 3）
      app_category: rawLog[this.fieldMapping.app_category?.elk_field],
      matched_category: rawLog[this.fieldMapping.matched_category?.elk_field],
      
      // 應用程式詳細資訊
      app_id: rawLog[this.fieldMapping.app_id?.elk_field],
      app_sig_id: rawLog[this.fieldMapping.app_sig_id?.elk_field],
      app_desc: rawLog[this.fieldMapping.app_desc?.elk_field],
      app_properties: rawLog[this.fieldMapping.app_properties?.elk_field],
      
      // 連線屬性
      conn_direction: rawLog[this.fieldMapping.conn_direction?.elk_field],
      duration: rawLog[this.fieldMapping.duration?.elk_field],
      bytes: rawLog[this.fieldMapping.bytes?.elk_field],
      
      // 安全區域
      security_inzone: rawLog[this.fieldMapping.security_inzone?.elk_field],
      security_outzone: rawLog[this.fieldMapping.security_outzone?.elk_field],
      inzone: rawLog[this.fieldMapping.inzone?.elk_field],
      outzone: rawLog[this.fieldMapping.outzone?.elk_field],
      
      // 規則與使用者
      rule_name: rawLog[this.fieldMapping.rule_name?.elk_field],
      user: rawLog[this.fieldMapping.user?.elk_field],
      src_user_dn: rawLog[this.fieldMapping.src_user_dn?.elk_field],
      src_machine_name: rawLog[this.fieldMapping.src_machine_name?.elk_field],
      
      // 流量統計
      client_inbound_bytes: rawLog[this.fieldMapping.client_inbound_bytes?.elk_field],
      client_outbound_bytes: rawLog[this.fieldMapping.client_outbound_bytes?.elk_field],
      client_inbound_packets: rawLog[this.fieldMapping.client_inbound_packets?.elk_field],
      client_outbound_packets: rawLog[this.fieldMapping.client_outbound_packets?.elk_field],
      
      // 網路介面
      ifname: rawLog[this.fieldMapping.ifname?.elk_field],
      ifdir: rawLog[this.fieldMapping.ifdir?.elk_field],
      
      // 聚合資訊
      aggregated_log_count: rawLog[this.fieldMapping.aggregated_log_count?.elk_field],
      connection_count: rawLog[this.fieldMapping.connection_count?.elk_field],
      
      // HTTPS 檢查
      https_inspection_action: rawLog[this.fieldMapping.https_inspection_action?.elk_field],
      
      // 原始日誌（供參考）
      _raw: rawLog
    };
    
    // 地理位置資訊（如果有 geoip）
    if (rawLog.geoip) {
      log.country = rawLog.geoip.country_name || rawLog.geoip.country_code2 || 'Unknown';
      log.city = rawLog.geoip.city_name;
      log.location = rawLog.geoip.location;
    } else {
      log.country = 'Unknown';
    }
    
    return log;
  }
  
  /**
   * Layer 1 分析：被封鎖的流量（action = Drop/Reject）
   */
  analyzeBlockedTraffic(logEntries, analysisResults) {
    const blockedLogs = logEntries.filter((log, index) => {
      const result = analysisResults[index];
      return result.judgmentLayer === 'FIREWALL_ACTION' && 
             (log.action === 'Drop' || log.action === 'Reject');
    });
    
    const dropLogs = blockedLogs.filter(log => log.action === 'Drop');
    const rejectLogs = blockedLogs.filter(log => log.action === 'Reject');
    
    return {
      count: blockedLogs.length,
      drop: dropLogs.length,
      reject: rejectLogs.length,
      topApps: this.getTopN(blockedLogs, 'appi_name', 5),
      topIPs: this.getTopN(blockedLogs, 'src', 10),
      topCountries: this.getTopN(blockedLogs, 'country', 10),
      topTargets: this.getTopN(blockedLogs, 'dst', 5),
      topRules: this.getTopN(blockedLogs, 'rule_name', 5),
      affectedAssets: new Set(blockedLogs.map(log => log.dst).filter(Boolean)).size,
      examples: blockedLogs.slice(0, 3).map(log => ({
        timestamp: log.timestamp,
        src: log.src,
        dst: log.dst,
        appi_name: log.appi_name,
        app_category: log.app_category,
        action: log.action,
        rule_name: log.rule_name
      }))
    };
  }
  
  /**
   * Layer 2 分析：高風險應用程式（app_risk >= 4）
   */
  analyzeHighRiskApps(logEntries, analysisResults) {
    const highRiskLogs = logEntries.filter((log, index) => {
      const result = analysisResults[index];
      return result.judgmentLayer === 'APP_RISK_ASSESSMENT' && 
             (parseInt(log.app_risk) >= 4);
    });
    
    const criticalRiskLogs = highRiskLogs.filter(log => parseInt(log.app_risk) === 5);
    const highRiskOnlyLogs = highRiskLogs.filter(log => parseInt(log.app_risk) === 4);
    
    return {
      count: highRiskLogs.length,
      critical: criticalRiskLogs.length,  // app_risk = 5
      high: highRiskOnlyLogs.length,      // app_risk = 4
      topApps: this.getTopN(highRiskLogs, 'appi_name', 10),
      topCategories: this.getTopN(highRiskLogs, 'app_category', 5),
      topIPs: this.getTopN(highRiskLogs, 'src', 10),
      topCountries: this.getTopN(highRiskLogs, 'country', 10),
      affectedAssets: new Set(highRiskLogs.map(log => log.dst).filter(Boolean)).size,
      examples: highRiskLogs.slice(0, 3).map(log => ({
        timestamp: log.timestamp,
        src: log.src,
        appi_name: log.appi_name,
        app_risk: log.app_risk,
        app_category: log.app_category,
        action: log.action
      }))
    };
  }
  
  /**
   * Layer 3 分析：違反公司政策的行為（app_category）
   */
  analyzePolicyViolations(logEntries, analysisResults) {
    const violationLogs = logEntries.filter((log, index) => {
      const result = analysisResults[index];
      return result.judgmentLayer === 'POLICY_VIOLATION';
    });
    
    // 按嚴重程度分類
    const criticalViolations = violationLogs.filter((log, index) => {
      const result = analysisResults.find(r => r.originalData?.appi_name === log.appi_name);
      return result?.severity === 'critical';
    });
    
    const highViolations = violationLogs.filter((log, index) => {
      const result = analysisResults.find(r => r.originalData?.appi_name === log.appi_name);
      return result?.severity === 'high';
    });
    
    const mediumViolations = violationLogs.filter((log, index) => {
      const result = analysisResults.find(r => r.originalData?.appi_name === log.appi_name);
      return result?.severity === 'medium';
    });
    
    // 按違規類型分類
    const violationTypes = {};
    violationLogs.forEach(log => {
      const category = log.app_category || 'Unknown';
      const policyInfo = getPolicyViolationInfo(category);
      const violationType = policyInfo?.violation_type || 'UNKNOWN';
      
      if (!violationTypes[violationType]) {
        violationTypes[violationType] = {
          type: violationType,
          displayName: policyInfo?.displayName || category,
          count: 0,
          logs: []
        };
      }
      violationTypes[violationType].count++;
      if (violationTypes[violationType].logs.length < 3) {
        violationTypes[violationType].logs.push(log);
      }
    });
    
    return {
      count: violationLogs.length,
      critical: criticalViolations.length,
      high: highViolations.length,
      medium: mediumViolations.length,
      byType: Object.values(violationTypes).sort((a, b) => b.count - a.count),
      topCategories: this.getTopN(violationLogs, 'app_category', 10),
      topApps: this.getTopN(violationLogs, 'appi_name', 10),
      topUsers: this.getTopN(violationLogs, 'user', 5),
      topIPs: this.getTopN(violationLogs, 'src', 10),
      topCountries: this.getTopN(violationLogs, 'country', 10),
      affectedAssets: new Set(violationLogs.map(log => log.dst).filter(Boolean)).size,
      examples: violationLogs.slice(0, 5).map(log => ({
        timestamp: log.timestamp,
        src: log.src,
        user: log.user,
        appi_name: log.appi_name,
        app_category: log.app_category,
        action: log.action
      }))
    };
  }
  
  /**
   * Layer 4 分析：可疑行為（多因素組合）
   */
  analyzeSuspiciousBehavior(logEntries, analysisResults) {
    const suspiciousLogs = logEntries.filter((log, index) => {
      const result = analysisResults[index];
      return result.judgmentLayer === 'COMBINED_ANALYSIS';
    });
    
    return {
      count: suspiciousLogs.length,
      topFactors: this.extractRiskFactors(suspiciousLogs, analysisResults),
      topIPs: this.getTopN(suspiciousLogs, 'src', 10),
      topCountries: this.getTopN(suspiciousLogs, 'country', 10),
      topApps: this.getTopN(suspiciousLogs, 'appi_name', 5),
      affectedAssets: new Set(suspiciousLogs.map(log => log.dst).filter(Boolean)).size,
      examples: suspiciousLogs.slice(0, 3).map(log => ({
        timestamp: log.timestamp,
        src: log.src,
        appi_name: log.appi_name,
        app_risk: log.app_risk,
        conn_direction: log.conn_direction,
        security_inzone: log.security_inzone,
        security_outzone: log.security_outzone
      }))
    };
  }
  
  /**
   * 分析安全區域風險
   */
  analyzeSecurityZones(logEntries, analysisResults) {
    const zoneRiskLogs = logEntries.filter(log => {
      if (!log.security_inzone || !log.security_outzone) return false;
      return evaluateSecurityZoneRisk(log.security_inzone, log.security_outzone) !== null;
    });
    
    const zoneRiskTypes = {};
    zoneRiskLogs.forEach(log => {
      const zoneRisk = evaluateSecurityZoneRisk(log.security_inzone, log.security_outzone);
      if (zoneRisk) {
        const key = zoneRisk.riskType;
        if (!zoneRiskTypes[key]) {
          zoneRiskTypes[key] = {
            type: key,
            description: zoneRisk.description,
            riskScore: zoneRisk.riskScore,
            count: 0,
            logs: []
          };
        }
        zoneRiskTypes[key].count++;
        if (zoneRiskTypes[key].logs.length < 3) {
          zoneRiskTypes[key].logs.push(log);
        }
      }
    });
    
    return {
      count: zoneRiskLogs.length,
      byType: Object.values(zoneRiskTypes).sort((a, b) => b.riskScore - a.riskScore),
      topIPs: this.getTopN(zoneRiskLogs, 'src', 10),
      topZonePairs: this.getTopZonePairs(zoneRiskLogs, 5),
      affectedAssets: new Set(zoneRiskLogs.map(log => log.dst).filter(Boolean)).size
    };
  }
  
  /**
   * 地理分佈分析
   */
  analyzeGeoDistribution(logEntries) {
    return {
      topCountries: this.getTopN(logEntries, 'country', 20),
      topIPs: this.getTopN(logEntries, 'src', 20),
      uniqueCountries: new Set(logEntries.map(log => log.country).filter(Boolean)).size,
      uniqueIPs: new Set(logEntries.map(log => log.src).filter(Boolean)).size
    };
  }
  
  /**
   * 受影響資產分析
   */
  analyzeAffectedAssets(logEntries) {
    const assets = logEntries.map(log => log.dst).filter(Boolean);
    const uniqueAssets = new Set(assets);
    
    return {
      totalAssets: uniqueAssets.size,
      topAssets: this.getTopN(logEntries, 'dst', 10),
      topDomains: this.getTopN(logEntries, 'dst_domain_name', 10)
    };
  }
  
  /**
   * 應用程式分析
   */
  analyzeApplications(logEntries) {
    const appRiskDistribution = {};
    logEntries.forEach(log => {
      const risk = parseInt(log.app_risk) || 0;
      appRiskDistribution[risk] = (appRiskDistribution[risk] || 0) + 1;
    });
    
    return {
      topApps: this.getTopN(logEntries, 'appi_name', 20),
      topCategories: this.getTopN(logEntries, 'app_category', 15),
      riskDistribution: appRiskDistribution,
      uniqueApps: new Set(logEntries.map(log => log.appi_name).filter(Boolean)).size
    };
  }
  
  /**
   * 生成 AI Prompt（針對 Check Point 三層判斷模型）
   */
  generateAIPrompt(analysisData) {
    const {
      blockedTraffic,
      highRiskApps,
      policyViolations,
      suspiciousBehavior,
      zoneRisks,
      geoAnalysis,
      assetAnalysis,
      appAnalysis,
      totalEvents,
      realThreats,
      realAttacks,
      timeRange,
      layerStats
    } = analysisData;
    
    // 構建威脅統計文字
    const threatSections = [];
    
    // 1. 被封鎖的流量
    if (blockedTraffic.count > 0) {
      threatSections.push({
        type: '被封鎖的流量（Layer 1: 防火牆動作）',
        data: blockedTraffic,
        description: `防火牆已封鎖的流量（Drop: ${blockedTraffic.drop}, Reject: ${blockedTraffic.reject}）`
      });
    }
    
    // 2. 高風險應用程式
    if (highRiskApps.count > 0) {
      threatSections.push({
        type: '高風險應用程式（Layer 2: 應用風險評估）',
        data: highRiskApps,
        description: `app_risk >= 4 的高風險應用（Critical: ${highRiskApps.critical}, High: ${highRiskApps.high}）`
      });
    }
    
    // 3. 政策違規
    if (policyViolations.count > 0) {
      threatSections.push({
        type: '違反公司政策（Layer 3: 政策合規）',
        data: policyViolations,
        description: `違反公司政策的行為（Critical: ${policyViolations.critical}, High: ${policyViolations.high}, Medium: ${policyViolations.medium}）`
      });
    }
    
    // 4. 可疑行為
    if (suspiciousBehavior.count > 0) {
      threatSections.push({
        type: '可疑行為（Layer 4: 多因素分析）',
        data: suspiciousBehavior,
        description: '多個風險因素組合的可疑行為'
      });
    }
    
    // 5. 安全區域風險
    if (zoneRisks.count > 0) {
      threatSections.push({
        type: '安全區域風險',
        data: zoneRisks,
        description: '可疑的安全區域流向'
      });
    }
    
    // 構建威脅統計文字
    let threatStatisticsText = '';
    if (threatSections.length === 0) {
      threatStatisticsText = '✅ **未檢測到明顯威脅**';
    } else {
      threatStatisticsText = threatSections.map((section, index) => {
        const { type, data, description } = section;
        
        return `
${index + 1}. **${type}**
   - 檢測方式: ${description}
   - 檢測次數: ${data.count}
   ${data.critical !== undefined ? `- 嚴重等級: ${data.critical}` : ''}
   ${data.high !== undefined ? `- 高風險: ${data.high}` : ''}
   ${data.medium !== undefined ? `- 中風險: ${data.medium}` : ''}
   - 受影響資產: ${data.affectedAssets || 0}
   - Top 5 應用程式: ${data.topApps ? data.topApps.slice(0, 5).map(app => `${app.item} (${app.count}次)`).join(', ') : '無'}
   - Top 5 來源IP: ${data.topIPs ? data.topIPs.slice(0, 5).map(ip => `${ip.item} (${ip.count}次)`).join(', ') : '無'}
   - Top 5 來源國家: ${data.topCountries ? data.topCountries.slice(0, 5).map(c => `${c.item} (${c.count}次)`).join(', ') : '無'}
   ${data.topCategories ? `- Top 5 應用類別: ${data.topCategories.slice(0, 5).map(cat => `${cat.item} (${cat.count}次)`).join(', ')}` : ''}
   ${data.topUsers ? `- Top 3 使用者: ${data.topUsers.slice(0, 3).map(u => `${u.item} (${u.count}次)`).join(', ')}` : ''}
`.trim();
      }).join('\n\n');
    }

    const promptTemplate = `
你是一位資深的網路安全分析專家，專精於 Check Point 防火牆日誌分析和威脅識別。

### 【任務說明】

請根據以下 Check Point 防火牆日誌數據，**自動識別並分類所有威脅類型**，生成完整的風險評估報告。

**重要：請基於三層判斷模型（應用風險評估、封鎖流量分析、政策違規檢測）進行分析。**

---

### 【資料來源】

- **索引名稱**: ${this.elkConfig.index}
- **時間範圍**: ${timeRange.start} ~ ${timeRange.end}
- **總日誌數**: ${totalEvents.toLocaleString()} 筆
- **真實威脅數**: ${realThreats.toLocaleString()} 筆（經三層判斷模型驗證）
- **確定攻擊數**: ${realAttacks.toLocaleString()} 筆
- **分析時間**: ${new Date().toISOString()}
- **產品**: Check Point Firewall
- **判斷模型**: 三層判斷系統

---

### 【Check Point 三層判斷模型】

**判斷邏輯分為 3 個主要層次 + 1 個輔助層次**：

**Layer 1 - 被封鎖的流量（最高優先級）**
- action === 'Drop' → 確定威脅（嚴重攻擊）
- action === 'Reject' → 確定威脅（政策限制或攻擊）
- 檢測次數: ${layerStats.FIREWALL_ACTION || 0} 次

**Layer 2 - 應用程式風險評估**
- app_risk === 5 → 嚴重風險應用
- app_risk === 4 → 高風險應用
- app_risk === 3 → 中風險應用（需監控）
- 檢測次數: ${layerStats.APP_RISK_ASSESSMENT || 0} 次

**Layer 3 - 違反公司政策的行為**
- 嚴重違規: Anonymizer（匿名代理）, Cryptocurrency Mining（挖礦）
- 高風險違規: Pornography（色情）, Gambling（賭博）, Remote Administration（遠端管理）
- 中風險違規: Social Media（社交媒體）, Streaming Media（串流）, Cloud Storage（雲端儲存）
- 檢測次數: ${layerStats.POLICY_VIOLATION || 0} 次

**Layer 4 - 綜合分析（多因素組合）**
- 中等風險應用 + 外部進入連線 (Inbound)
- 不信任區域 → 信任區域 (untrust → trust)
- 長時間連線 (> 1小時)
- 大量資料傳輸 (> 100MB)
- 檢測次數: ${layerStats.COMBINED_ANALYSIS || 0} 次

**威脅分數系統**（0-100，分數越低風險越高）：
- 0-30: 嚴重威脅 (Critical)
- 31-50: 高風險 (High)
- 51-70: 中風險 (Medium)
- 71-85: 低風險 (Low)
- 86-100: 正常流量 (Clean)

---

### 【威脅統計（基於真實 Check Point 日誌與三層判斷）】

${threatStatisticsText}

---

### 【地理與資產分析】⭐ 真實數據區塊 ⭐

⚠️ **重要指示**：以下是從 Check Point 日誌中提取的真實威脅數據，在生成 aiInsight 和 description 時，**必須優先使用這些實際數據**。

- **Top 10 攻擊來源國家（真實）**: ${geoAnalysis.topCountries.slice(0, 10).map(c => `${c.item} (${c.count}次)`).join(', ') || '無'}
- **Top 10 攻擊來源IP（真實）**: ${geoAnalysis.topIPs.slice(0, 10).map(ip => `${ip.item} (${ip.count}次)`).join(', ') || '無'}
- **受影響資產總數**: ${assetAnalysis.totalAssets}
- **Top 5 被攻擊資產（真實）**: ${assetAnalysis.topAssets.slice(0, 5).map(a => `${a.item} (${a.count}次)`).join(', ') || '無'}
- **Top 10 應用程式（真實）**: ${appAnalysis.topApps.slice(0, 10).map(app => `${app.item} (${app.count}次)`).join(', ') || '無'}
- **Top 5 應用類別（真實）**: ${appAnalysis.topCategories.slice(0, 5).map(cat => `${cat.item} (${cat.count}次)`).join(', ') || '無'}

---

### 【輸出格式要求】

請生成 **嚴格的 JSON 格式** 風險報告：

\`\`\`json
{
  "risks": [
    {
      "id": "威脅類型-唯一識別碼-時間戳",
      "title": "威脅標題（簡潔明確，例如：高風險應用存取、政策違規行為、被封鎖的惡意流量）",
      "severity": "critical | high | medium | low",
      "openIssues": 檢測次數（數字）,
      "resolvedIssues": 0,
      "affectedAssets": 受影響的唯一主機數量（數字）,
      "tags": ["Check Point", "Policy Violation", "High Risk App", "Blocked Traffic"],
      "description": "詳細描述（200-300字），必須包含三層判斷結果和具體的防火牆動作",
      "aiInsight": "AI 深度分析（150-250字），必須包含以下內容：
        1. 具體檢測數字（威脅總次數、高風險次數、防火牆封鎖次數）和時間範圍
        2. Check Point 三層判斷模型的分析結果（Layer 1: 防火牆動作、Layer 2: app_risk 評估、Layer 3: 政策違規檢測、Layer 4: 多因素分析）
        3. Check Point 特定指標（app_risk 等級、action 動作、app_category 類別、安全區域流向）
        4. 主要威脅來源（Top 3 國家及其次數、Top 3 IP 及其次數）
        5. 主要應用程式（Top 3 應用及其使用次數、app_risk 等級）
        6. 主要目標資產（Top 3 目標及其被存取次數）
        7. 政策影響分析（違反的政策類型、業務影響、法律風險）
        8. 具體建議（基於三層判斷結果的 Check Point 防火牆規則配置建議）
        
        範例格式參考：
        在 [開始時間] 至 [結束時間] 期間，Check Point 防火牆三層判斷模型檢測到 [總次數] 次 [威脅類型]，其中 [高風險次數] 次被 Layer 1 封鎖（action: [Drop/Reject]），[次數] 次被 Layer 2 評估為 app_risk=[等級]，[次數] 次違反 Layer 3 公司政策（[政策類型]）。主要威脅來自 [國家1]（[次數1] 次，IP [實際IP1]）、[國家2]（[次數2] 次，IP [實際IP2]）、[國家3]（[次數3] 次，IP [實際IP3]）。涉及應用程式包含 [應用1]（[次數1] 次，app_risk=[等級]）、[應用2]（[次數2] 次）。攻擊目標為 [目標1]（[次數1] 次）、[目標2]（[次數2] 次）。共影響 [資產數] 個資產。建議 [具體的 Check Point 規則配置措施]。
        
        ⚠️ **關鍵要求**：
        - 必須使用上方【威脅統計】和【地理與資產分析】中的真實數據
        - 禁止使用測試 IP（如 1.2.3.4、5.6.7.8、192.168.x.x、10.0.x.x 等）
        - IP 地址必須與【地理與資產分析】中列出的完全一致
        - 國家、應用程式、次數都必須使用真實統計數據",
      "createdDate": "${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}",
      "updatedDate": "${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}",
      "exploitInWild": true | false,
      "internetExposed": true,
      "confirmedExploitable": true | false,
      "cveId": null,
      "recommendations": [
        {
          "title": "建議標題",
          "description": "建議描述（150-200字），針對 Check Point 防火牆的具體規則配置建議",
          "priority": "high | medium | low"
        }
      ]
    }
  ]
}
\`\`\`

---

### 【輸出規則】

1. ⚠️ **關鍵規則**：只生成上面「威脅統計」中明確列出的威脅類型
2. ⚠️ **絕對禁止**：不要生成任何在「威脅統計」中未列出的威脅類型
3. ⚠️ **Check Point 專屬**：建議必須針對 Check Point 防火牆的規則和功能
4. ⚠️ **CVE 編號規則**：將 cveId 設為 null
5. ⚠️ **三層判斷**：description 中必須說明判斷依據（Layer 1-3）
6. 每個風險至少提供 2-3 個具體建議
7. ⚠️ **aiInsight 必須包含**：
   - 具體數字（威脅總次數、高風險次數、受影響資產數）
   - Check Point 三層判斷模型的 Layer 1-3 分析結果
   - Check Point 技術指標（app_risk、action、app_category、security zones）
   - Top 3 來源國家、Top 3 IP、Top 3 應用程式、Top 3 目標（包含次數）
   - **IP 地址必須使用【地理與資產分析】中列出的真實 IP，嚴格禁止使用測試或私有 IP**
   - 政策影響與法律風險分析
   - 基於實際數據的 Check Point 防火牆具體規則建議
8. 如果沒有威脅，必須輸出空的 risks 陣列
9. ⚠️ **禁止使用模糊語言**：避免「可能」、「或許」、「建議檢查」等不確定性描述，必須基於實際數據提供明確的分析和建議
10. ⚠️ **重點關注**：
    - Layer 1（被封鎖流量）為最高優先級威脅
    - Layer 2（高風險應用）需要特別關注 app_risk >= 4 的應用
    - Layer 3（政策違規）需要明確指出違反的政策類型和業務影響

---

請以繁體中文回答，**務必輸出純 JSON 格式**，不要有 markdown 或其他格式符號。
`;

    return promptTemplate.trim();
  }
  
  /**
   * 生成 Fallback 風險資料（AI 解析失敗時使用）
   */
  generateFallbackRisks(analysisData) {
    const risks = [];
    const { blockedTraffic, highRiskApps, policyViolations } = analysisData;
    
    // 1. 被封鎖的流量
    if (blockedTraffic.count > 0) {
      const topCountry = blockedTraffic.topCountries?.[0];
      const topIP = blockedTraffic.topIPs?.[0];
      const topApp = blockedTraffic.topApps?.[0];
      
      risks.push({
        id: `blocked-traffic-${Date.now()}`,
        title: '被封鎖的惡意流量（防火牆動作）',
        severity: 'critical',
        openIssues: blockedTraffic.count,
        resolvedIssues: 0,
        affectedAssets: blockedTraffic.affectedAssets,
        tags: ['Check Point', 'Blocked Traffic', 'Layer 1'],
        description: `Check Point 防火牆已封鎖 ${blockedTraffic.count} 次惡意流量嘗試（Drop: ${blockedTraffic.drop}, Reject: ${blockedTraffic.reject}），這些流量已被 Layer 1 判定為確定威脅。`,
        aiInsight: `在分析時間範圍內，Check Point 防火牆 Layer 1 判斷檢測到 ${blockedTraffic.count} 次被封鎖的流量，其中 ${blockedTraffic.drop} 次被靜默丟棄（Drop），${blockedTraffic.reject} 次被明確拒絕（Reject）。主要攻擊來自 ${topCountry?.item || '未知地區'}（${topCountry?.count || 0} 次），Top 攻擊 IP 為 ${topIP?.item || '未知'}（${topIP?.count || 0} 次）。涉及應用程式包含 ${topApp?.item || '未知應用'}（${topApp?.count || 0} 次）。共影響 ${blockedTraffic.affectedAssets} 個資產。建議檢查防火牆規則配置，確認是否需要調整封鎖策略。`,
        createdDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        updatedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        exploitInWild: true,
        internetExposed: true,
        confirmedExploitable: false,
        cveId: null,
        recommendations: [
          {
            title: topIP?.item ? `持續封鎖來源 IP ${topIP.item}` : '持續封鎖攻擊來源 IP',
            description: topIP?.item 
              ? `該 IP (${topIP.item}) 已發起 ${topIP.count} 次攻擊，建議在 Check Point 中維持封鎖規則並加入黑名單` 
              : '維持 Check Point 防火牆封鎖規則並定期檢查',
            priority: 'high'
          },
          {
            title: '檢查防火牆規則配置',
            description: '審查 Check Point 防火牆規則，確認封鎖策略是否需要優化',
            priority: 'medium'
          }
        ]
      });
    }
    
    // 2. 高風險應用程式
    if (highRiskApps.count > 0) {
      const topCountry = highRiskApps.topCountries?.[0];
      const topIP = highRiskApps.topIPs?.[0];
      const topApp = highRiskApps.topApps?.[0];
      
      risks.push({
        id: `high-risk-apps-${Date.now()}`,
        title: '高風險應用程式存取',
        severity: highRiskApps.critical > 0 ? 'critical' : 'high',
        openIssues: highRiskApps.count,
        resolvedIssues: 0,
        affectedAssets: highRiskApps.affectedAssets,
        tags: ['Check Point', 'High Risk App', 'Layer 2'],
        description: `Check Point 檢測到 ${highRiskApps.count} 次高風險應用程式存取（app_risk >= 4），其中 ${highRiskApps.critical} 次為嚴重風險應用（app_risk=5）。`,
        aiInsight: `在分析時間範圍內，Check Point Layer 2 應用風險評估檢測到 ${highRiskApps.count} 次高風險應用程式存取，其中 ${highRiskApps.critical} 次為嚴重風險等級（app_risk=5），${highRiskApps.high} 次為高風險等級（app_risk=4）。主要來源為 ${topCountry?.item || '未知地區'}（${topCountry?.count || 0} 次），Top IP 為 ${topIP?.item || '未知'}（${topIP?.count || 0} 次）。涉及應用程式包含 ${topApp?.item || '未知應用'}（${topApp?.count || 0} 次）。共影響 ${highRiskApps.affectedAssets} 個資產。建議檢查這些應用程式是否符合公司使用政策，並考慮在 Check Point 中配置應用控制規則。`,
        createdDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        updatedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        exploitInWild: false,
        internetExposed: true,
        confirmedExploitable: false,
        cveId: null,
        recommendations: [
          {
            title: '配置應用控制規則',
            description: `在 Check Point Application Control 中配置規則，封鎖或限制 app_risk >= 4 的應用程式`,
            priority: 'high'
          },
          {
            title: '審查應用程式使用政策',
            description: '檢查這些高風險應用是否符合公司使用政策，並向使用者宣導風險',
            priority: 'medium'
          }
        ]
      });
    }
    
    // 3. 政策違規
    if (policyViolations.count > 0) {
      const topCategory = policyViolations.topCategories?.[0];
      const topUser = policyViolations.topUsers?.[0];
      const topIP = policyViolations.topIPs?.[0];
      
      risks.push({
        id: `policy-violations-${Date.now()}`,
        title: '違反公司政策行為',
        severity: policyViolations.critical > 0 ? 'critical' : (policyViolations.high > 0 ? 'high' : 'medium'),
        openIssues: policyViolations.count,
        resolvedIssues: 0,
        affectedAssets: policyViolations.affectedAssets,
        tags: ['Check Point', 'Policy Violation', 'Layer 3'],
        description: `Check Point 檢測到 ${policyViolations.count} 次違反公司政策的行為（嚴重: ${policyViolations.critical}, 高風險: ${policyViolations.high}, 中風險: ${policyViolations.medium}）。`,
        aiInsight: `在分析時間範圍內，Check Point Layer 3 政策合規檢測發現 ${policyViolations.count} 次違反公司政策的行為，其中 ${policyViolations.critical} 次為嚴重違規，${policyViolations.high} 次為高風險違規，${policyViolations.medium} 次為中風險違規。主要違規類別為 ${topCategory?.item || '未知類別'}（${topCategory?.count || 0} 次）。主要違規使用者為 ${topUser?.item || '未知使用者'}（${topUser?.count || 0} 次），來源 IP 為 ${topIP?.item || '未知'}（${topIP?.count || 0} 次）。共影響 ${policyViolations.affectedAssets} 個資產。建議立即檢查這些違規行為，並向相關使用者進行安全宣導。`,
        createdDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        updatedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        exploitInWild: false,
        internetExposed: true,
        confirmedExploitable: false,
        cveId: null,
        recommendations: [
          {
            title: '配置 URL Filtering 規則',
            description: '在 Check Point URL Filtering 中配置規則，封鎖違反政策的應用程式類別',
            priority: 'high'
          },
          {
            title: '使用者安全宣導',
            description: topUser?.item 
              ? `向 ${topUser.item}（${topUser.count} 次違規）等使用者進行安全宣導，說明公司政策` 
              : '向違規使用者進行安全宣導，說明公司政策',
            priority: 'high'
          },
          {
            title: '啟用 UserCheck 通知',
            description: '配置 Check Point UserCheck，當使用者違反政策時即時通知',
            priority: 'medium'
          }
        ]
      });
    }
    
    return { risks };
  }
  
  // ========== 輔助工具方法 ==========
  
  /**
   * 取得 Top N
   */
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
  
  /**
   * 提取風險因素
   */
  extractRiskFactors(logs, analysisResults) {
    const factors = new Map();
    
    logs.forEach(log => {
      const result = analysisResults.find(r => 
        r.originalData?.src === log.src && 
        r.originalData?.timestamp === log.timestamp
      );
      
      if (result && result.riskFactors) {
        result.riskFactors.forEach(factor => {
          factors.set(factor, (factors.get(factor) || 0) + 1);
        });
      }
    });
    
    return Array.from(factors.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([factor, count]) => ({ factor, count }));
  }
  
  /**
   * 取得 Top 安全區域配對
   */
  getTopZonePairs(logs, n) {
    const pairs = new Map();
    logs.forEach(log => {
      if (log.security_inzone && log.security_outzone) {
        const pair = `${log.security_inzone} → ${log.security_outzone}`;
        pairs.set(pair, (pairs.get(pair) || 0) + 1);
      }
    });
    
    return Array.from(pairs.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, n)
      .map(([pair, count]) => ({ pair, count }));
  }
  
  /**
   * 空結果
   */
  getEmptyAnalysisResult() {
    return {
      blockedTraffic: { count: 0, drop: 0, reject: 0, topApps: [], topIPs: [], topCountries: [], topTargets: [], affectedAssets: 0 },
      highRiskApps: { count: 0, critical: 0, high: 0, topApps: [], topCategories: [], topIPs: [], topCountries: [], affectedAssets: 0 },
      policyViolations: { count: 0, critical: 0, high: 0, medium: 0, byType: [], topCategories: [], topApps: [], topUsers: [], topIPs: [], topCountries: [], affectedAssets: 0 },
      suspiciousBehavior: { count: 0, topFactors: [], topIPs: [], topCountries: [], topApps: [], affectedAssets: 0 },
      zoneRisks: { count: 0, byType: [], topIPs: [], topZonePairs: [], affectedAssets: 0 },
      geoAnalysis: { topCountries: [], topIPs: [], uniqueCountries: 0, uniqueIPs: 0 },
      assetAnalysis: { totalAssets: 0, topAssets: [], topDomains: [] },
      appAnalysis: { topApps: [], topCategories: [], riskDistribution: {}, uniqueApps: 0 },
      totalEvents: 0,
      realThreats: 0,
      realAttacks: 0,
      timeRange: { start: new Date().toISOString(), end: new Date().toISOString() },
      layerStats: {}
    };
  }
}

module.exports = CheckpointRiskServices;

