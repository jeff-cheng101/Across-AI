// backend/services/products/CheckpointRiskServices.js
// Check Point 防火牆風險分析服務（重構版 - 五層判斷模型）
// 整合：Firewall Action + Threat Prevention + App Risk + URI/UA Analysis + URL Filtering

const { elkMCPClient } = require('../elkMCPClient');
const {
  CHECKPOINT_FIELD_MAPPING,
} = require('../../config/products/checkpoint/chcekpointFieldMapping');
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
  analyzeLogEntry,
  // 新增：事件分類系統
  EVENT_CLASSIFICATION,
  PORT_SCAN_DETECTION,
  SPECIAL_RULE_TYPES,
  classifyEvent,
  detectPortScan,
  // 🆕 VPN 用戶識別
  checkVPNUser,
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
      const elkData = await this.elkClient.queryElasticsearch(timeRange, {
        indexPattern: this.elkConfig.index,
      });

      if (!elkData.hits || elkData.hits.length === 0) {
        console.log('⚠️ 未找到日誌資料');
        return this.getEmptyAnalysisResult();
      }

      // Step 2: 解析 Check Point 日誌（包含時間修正）
      console.log(`\n⭐ Step 2: 解析 ${elkData.hits.length} 筆日誌...`);
      const logEntries = elkData.hits.map((hit) =>
        this.parseCheckPointLog(hit.source),
      );
      console.log(`✅ 成功解析 ${logEntries.length} 筆日誌`);

      // 計算實際日誌時間範圍
      const actualTimeRange = this.calculateActualTimeRange(logEntries);
      console.log(`📅 實際日誌時間範圍（UTC+8）:`);
      console.log(`   開始: ${this.formatTimeTaipei(actualTimeRange.start)}`);
      console.log(`   結束: ${this.formatTimeTaipei(actualTimeRange.end)}`);

      // 診斷：顯示前 3 筆日誌的基本資訊
      console.log('\n📊 日誌診斷（前 3 筆）:');
      logEntries.slice(0, 3).forEach((log, index) => {
        console.log(
          `  ${index + 1}. App: ${log.appi_name} | Risk: ${log.app_risk} | Action: ${log.action} | Threat: ${log.threat_severity || 'N/A'}`,
        );
      });

      // 統計動作分佈
      const actionDistribution = {};
      logEntries.forEach((log) => {
        const action = log.action || 'Unknown';
        actionDistribution[action] = (actionDistribution[action] || 0) + 1;
      });
      console.log('\n📊 防火牆動作統計:');
      Object.entries(actionDistribution).forEach(([action, count]) => {
        console.log(
          `  - ${action}: ${count} 筆 (${((count / logEntries.length) * 100).toFixed(1)}%)`,
        );
      });

      // Step 3: 使用五層判斷模型分析威脅
      console.log('\n⭐ Step 3: 使用五層判斷模型分析威脅...');
      const analysisResults = logEntries.map((log) => analyzeLogEntry(log));

      // 過濾出真實威脅
      const realThreats = analysisResults.filter((result) => result.isThreat);
      console.log(
        `   檢測到 ${realThreats.length} 個真實威脅（共 ${logEntries.length} 筆日誌）`,
      );

      // 統計各層判斷結果
      const layerStats = {};
      analysisResults
        .filter((r) => r.isThreat)
        .forEach((result) => {
          const layer = result.layer || 'UNKNOWN';
          layerStats[layer] = (layerStats[layer] || 0) + 1;
        });
      console.log('\n📊 判斷層級統計:');
      Object.entries(layerStats).forEach(([layer, count]) => {
        console.log(`  - ${layer}: ${count} 次`);
      });

      // Step 4: 分析各類型威脅（基於五層判斷）
      console.log('\n⭐ Step 4: 分析各類型威脅...');
      const blockedTraffic = this.analyzeBlockedTraffic(
        logEntries,
        analysisResults,
      );
      const highRiskApps = this.analyzeHighRiskApps(
        logEntries,
        analysisResults,
      );
      const threatPrevention = this.analyzeThreatPrevention(
        logEntries,
        analysisResults,
      );
      const urlFiltering = this.analyzeURLFiltering(
        logEntries,
        analysisResults,
      );
      const owaspAttacks = this.analyzeOWASPAttacks(
        logEntries,
        analysisResults,
      );

      // Step 5: 地理位置分析（Top 5 來源國家）
      const geoDistribution = this.analyzeGeoDistribution(logEntries);

      // Step 6: 資產分析（Top 5 受攻擊資產）
      const assetAnalysis = this.analyzeTopTargetedAssets(
        logEntries,
        realThreats,
      );

      // Step 7: 🆕 過濾正常流量
      console.log('\n⭐ Step 7: 過濾正常流量...');
      const filteredStats = this.filterNormalTraffic(logEntries);
      console.log(`   過濾前: ${filteredStats.totalCount} 筆`);
      console.log(`   需分析（可疑事件）: ${filteredStats.suspiciousCount} 筆`);
      console.log(
        `   🆕 VPN 策略問題: ${filteredStats.vpnPolicyIssueCount} 筆（非攻擊）`,
      );
      console.log(`   正常流量: ${filteredStats.normalCount} 筆（已過濾）`);

      // Step 8: 🆕 按來源 IP 聚合（包含 VPN 策略問題）
      console.log('\n⭐ Step 8: 按來源 IP 聚合統計...');
      // 合併可疑事件和 VPN 策略問題進行聚合
      const allEventsToAggregate = [
        ...filteredStats.suspicious,
        ...filteredStats.vpnPolicyIssues,
      ];
      const ipAggregatedStats = this.aggregateBySourceIP(allEventsToAggregate);
      const uniqueSourceIPs = Object.keys(ipAggregatedStats).length;
      console.log(`   唯一來源 IP: ${uniqueSourceIPs} 個`);

      // 🆕 統計 VPN 用戶
      const vpnUserIPs = Object.values(ipAggregatedStats).filter(
        (stats) => stats.isVPNUser,
      );
      const attackerIPs = Object.values(ipAggregatedStats).filter(
        (stats) => !stats.isVPNUser,
      );
      console.log(`   🆕 VPN 用戶 IP: ${vpnUserIPs.length} 個（非攻擊者）`);
      console.log(`   🆕 攻擊者 IP: ${attackerIPs.length} 個`);

      // 檢測端口掃描（排除 VPN 用戶）
      const portScanIPs = Object.values(ipAggregatedStats).filter(
        (stats) =>
          !stats.isVPNUser &&
          stats.portScanAnalysis &&
          stats.portScanAnalysis.isPortScan,
      );
      console.log(`   端口掃描 IP: ${portScanIPs.length} 個`);

      // Cleanup rule 命中（排除 VPN 用戶）
      const cleanupRuleIPs = Object.values(ipAggregatedStats).filter(
        (stats) =>
          !stats.isVPNUser &&
          stats.ruleNames.some((r) => r.toLowerCase().includes('cleanup')),
      );
      console.log(
        `   Cleanup rule 命中 IP（非 VPN）: ${cleanupRuleIPs.length} 個`,
      );

      // 取得 TOP 攻擊者（排除 VPN 用戶）
      const topAttackers = this.getTopAttackers(ipAggregatedStats, 5);
      console.log(`\n📊 TOP 5 攻擊者 IP（排除 VPN 用戶）:`);
      if (topAttackers.length === 0) {
        console.log('   ✅ 無真實攻擊者（所有被阻擋的流量都來自 VPN 用戶）');
      } else {
        topAttackers.forEach((attacker, i) => {
          console.log(
            `   ${i + 1}. ${attacker.ip} (${attacker.country}) - ${attacker.behavior} - 風險分數: ${attacker.riskScore}`,
          );
        });
      }

      // 🆕 顯示 VPN 策略問題
      const vpnPolicyIssues = this.getVPNPolicyIssues(ipAggregatedStats, 5);
      if (vpnPolicyIssues.length > 0) {
        console.log(`\n📊 VPN 策略問題 TOP 5（非攻擊，需檢視策略）:`);
        vpnPolicyIssues.forEach((issue, i) => {
          console.log(
            `   ${i + 1}. ${issue.ip} (${issue.userName || 'Unknown'}) - ${issue.eventCount} 次被阻擋`,
          );
        });
      }

      // 綜合分析結果
      // 🆕 保留 ELK 原始查詢結果（供 AI 直接分析使用）
      const analysisData = {
        elkData,
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
        analysisResults: analysisResults,
        // 🆕 新增欄位
        filteredStats: filteredStats,
        ipAggregatedStats: ipAggregatedStats,
        topAttackers: topAttackers,
        portScanIPs: portScanIPs.length,
        cleanupRuleIPs: cleanupRuleIPs.length,
        // 🆕 VPN 相關統計
        vpnUserIPs: vpnUserIPs.length,
        vpnPolicyIssues: vpnPolicyIssues,
        attackerIPCount: attackerIPs.length,
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
      if (
        fieldConfig &&
        fieldConfig.elk_field &&
        rawLog[fieldConfig.elk_field] !== undefined
      ) {
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
      timestamp = new Date(
        rawTimestamp > 10000000000 ? rawTimestamp : rawTimestamp * 1000,
      ).toISOString();
    } else if (typeof rawTimestamp === 'string') {
      // ISO 8601 格式
      timestamp = new Date(rawTimestamp).toISOString();
    } else {
      // 預設當前時間
      timestamp = new Date().toISOString();
    }

    // 🆕 提取 GeoIP 資訊（處理嵌套物件）
    const geoipData = rawLog.geoip || {};

    return {
      // 基本欄位
      timestamp: timestamp,
      log_uid: safeGet('loguid', ['log_uid', 'uid']),
      action: safeGet('action'),
      rule_uid: safeGet('rule_uid', ['ruleuid']),
      rule_name: safeGet('rule_name'),
      // 🆕 提取 rule_name_match_table（Check Point 特有的陣列格式）
      rule_name_match_table:
        rawLog['rule_name_._._match_table'] || rawLog.rule_name_match_table,

      // 來源/目的地
      src_ip: safeGet('src', ['src_ip', 'origin']),
      dst_ip: safeGet('dst', ['dst_ip']),
      src_country:
        safeGet('src_country', ['origin_sic_name', 's_location']) ||
        geoipData.country_name,
      dst_country: safeGet('dst_country', ['xlatedst_country', 'd_location']),
      src_machine_name: safeGet('src_machine_name', ['src_host']),
      dst_machine_name: safeGet('dst_machine_name', [
        'dst_host',
        'dst_domain_name',
      ]),

      // 🆕 VPN 用戶身份相關欄位
      src_user_name: safeGet('src_user_name', ['user']),
      src_user_dn: safeGet('src_user_dn'),
      user: safeGet('user'),
      product: safeGet('product'),

      // 🆕 GeoIP 資訊
      geoip: {
        ip: geoipData.ip || null,
        country_name: geoipData.country_name || null,
        city_name: geoipData.city_name || null,
        region_name: geoipData.region_name || null,
      },

      // 🆕 安全區域
      security_inzone: safeGet('security_inzone'),
      inzone: safeGet('inzone'),
      outzone: safeGet('outzone'),

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
      rawLog: rawLog,
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
      .map((log) => new Date(log.timestamp).getTime())
      .filter((t) => !isNaN(t));

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
      hour12: false,
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
      timeZone: 'Asia/Taipei',
    });
  }

  /**
   * 分析被封鎖的流量（Layer 1: Action = Drop/Reject）
   */
  analyzeBlockedTraffic(logEntries, analysisResults) {
    const blocked = analysisResults.filter(
      (result) => result.isBlocked && result.layer === 'FIREWALL_ACTION',
    );

    // 統計被封鎖的應用程式
    const blockedApps = {};
    blocked.forEach((result) => {
      const originalLog = logEntries.find(
        (log) => log.log_uid === result.originalData?.log_uid,
      );
      if (originalLog) {
        const appName = originalLog.appi_name || 'Unknown';
        if (!blockedApps[appName]) {
          blockedApps[appName] = {
            appName: appName,
            count: 0,
            action: originalLog.action,
            app_risk: originalLog.app_risk,
            app_category: originalLog.app_category,
            ips: new Set(),
          };
        }
        blockedApps[appName].count++;
        blockedApps[appName].ips.add(originalLog.src_ip);
      }
    });

    // 轉換為陣列並排序
    const topBlockedApps = Object.values(blockedApps)
      .map((app) => ({
        ...app,
        uniqueIPs: app.ips.size,
        ips: undefined,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalBlocked: blocked.length,
      topBlockedApps: topBlockedApps,
    };
  }

  /**
   * 分析高風險應用程式（Layer 3: app_risk >= 4）
   */
  analyzeHighRiskApps(logEntries, analysisResults) {
    const highRisk = analysisResults.filter(
      (result) => result.layer === 'APP_RISK_ASSESSMENT' && result.isThreat,
    );

    const appStats = {};
    highRisk.forEach((result) => {
      const originalLog = logEntries.find(
        (log) => log.log_uid === result.originalData?.log_uid,
      );
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
            ips: new Set(),
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
      .map((app) => ({
        ...app,
        uniqueIPs: app.ips.size,
        ips: undefined,
      }))
      .sort((a, b) => b.app_risk - a.app_risk || b.count - a.count)
      .slice(0, 10);

    return {
      totalHighRiskEvents: highRisk.length,
      topHighRiskApps: topHighRiskApps,
    };
  }

  /**
   * 分析 Threat Prevention 檢測（Layer 2: threat_severity）
   */
  analyzeThreatPrevention(logEntries, analysisResults) {
    const threats = analysisResults.filter(
      (result) => result.layer === 'THREAT_PREVENTION' && result.isThreat,
    );

    const threatStats = {};
    threats.forEach((result) => {
      const originalLog = logEntries.find(
        (log) => log.log_uid === result.originalData?.log_uid,
      );
      if (originalLog && originalLog.threat_name) {
        const threatName = originalLog.threat_name;
        if (!threatStats[threatName]) {
          threatStats[threatName] = {
            threatName: threatName,
            threat_severity: originalLog.threat_severity,
            threat_category: originalLog.threat_category,
            count: 0,
            ips: new Set(),
            actions: {},
          };
        }
        threatStats[threatName].count++;
        threatStats[threatName].ips.add(originalLog.src_ip);

        const action = originalLog.action || 'Unknown';
        threatStats[threatName].actions[action] =
          (threatStats[threatName].actions[action] || 0) + 1;
      }
    });

    const topThreats = Object.values(threatStats)
      .map((threat) => ({
        ...threat,
        uniqueIPs: threat.ips.size,
        ips: undefined,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalThreatPreventionEvents: threats.length,
      topThreats: topThreats,
    };
  }

  /**
   * 分析 URL Filtering 違規（Layer 5: url_category）
   */
  analyzeURLFiltering(logEntries, analysisResults) {
    const violations = analysisResults.filter(
      (result) => result.layer === 'URL_FILTERING' && result.isThreat,
    );

    const categoryStats = {};
    violations.forEach((result) => {
      const originalLog = logEntries.find(
        (log) => log.log_uid === result.originalData?.log_uid,
      );
      if (originalLog && originalLog.url_category) {
        const category = originalLog.url_category;
        if (!categoryStats[category]) {
          categoryStats[category] = {
            category: category,
            count: 0,
            ips: new Set(),
            actions: {},
          };
        }
        categoryStats[category].count++;
        categoryStats[category].ips.add(originalLog.src_ip);

        const action = originalLog.action || 'Unknown';
        categoryStats[category].actions[action] =
          (categoryStats[category].actions[action] || 0) + 1;
      }
    });

    const topCategories = Object.values(categoryStats)
      .map((cat) => ({
        ...cat,
        uniqueIPs: cat.ips.size,
        ips: undefined,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalURLFilteringViolations: violations.length,
      topCategories: topCategories,
    };
  }

  /**
   * 分析 OWASP 攻擊模式（Layer 4: URI/UA Analysis）
   */
  analyzeOWASPAttacks(logEntries, analysisResults) {
    const owaspAttacks = analysisResults.filter(
      (result) => result.layer === 'URI_UA_ANALYSIS' && result.isThreat,
    );

    const attackTypeStats = {};
    owaspAttacks.forEach((result) => {
      const attackType =
        result.uriAnalysis?.attackType ||
        result.uaAnalysis?.attackType ||
        'UNKNOWN';
      const owaspCategory = result.uriAnalysis?.owaspCategory || 'Unknown';

      if (!attackTypeStats[attackType]) {
        attackTypeStats[attackType] = {
          attackType: attackType,
          owaspCategory: owaspCategory,
          count: 0,
          ips: new Set(),
        };
      }
      attackTypeStats[attackType].count++;

      const originalLog = logEntries.find(
        (log) => log.log_uid === result.originalData?.log_uid,
      );
      if (originalLog) {
        attackTypeStats[attackType].ips.add(originalLog.src_ip);
      }
    });

    const topAttackTypes = Object.values(attackTypeStats)
      .map((attack) => ({
        ...attack,
        uniqueIPs: attack.ips.size,
        ips: undefined,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalOWASPAttacks: owaspAttacks.length,
      topAttackTypes: topAttackTypes,
    };
  }

  /**
   * 地理位置分析（Top 5 來源國家）
   */
  analyzeGeoDistribution(logEntries) {
    const countryStats = {};

    logEntries.forEach((log) => {
      const country = log.src_country || 'Unknown';
      if (!countryStats[country]) {
        countryStats[country] = {
          country: country,
          count: 0,
          ips: new Set(),
        };
      }
      countryStats[country].count++;
      countryStats[country].ips.add(log.src_ip);
    });

    const topCountries = Object.values(countryStats)
      .map((stat) => ({
        ...stat,
        uniqueIPs: stat.ips.size,
        ips: undefined,
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

    threats.forEach((threat) => {
      const originalLog = logEntries.find(
        (log) => log.log_uid === threat.originalData?.log_uid,
      );
      if (originalLog) {
        const asset =
          originalLog.dst_ip || originalLog.dst_machine_name || 'Unknown';
        if (!assetStats[asset]) {
          assetStats[asset] = {
            asset: asset,
            dst_ip: originalLog.dst_ip,
            dst_machine_name: originalLog.dst_machine_name,
            attackCount: 0,
            attackers: new Set(),
            severityDistribution: { critical: 0, high: 0, medium: 0, low: 0 },
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
      .map((asset) => ({
        ...asset,
        uniqueAttackers: asset.attackers.size,
        attackers: undefined,
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

    logEntries.forEach((log) => {
      const ip = log.src_ip;
      if (!ip) return;

      if (!ipStats[ip]) {
        ipStats[ip] = {
          ip: ip,
          country: log.src_country || 'Unknown',
          count: 0,
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
      'action',
      'threat_severity',
      'threat_name',
      'threat_category',
      'app_risk',
      'appi_name',
      'app_category',
      'url_category',
      'url_reputation',
      'http_user_agent',
      'http_url',
      'http_method',
      'burst_count',
      'src',
      'dst',
    ];

    const fieldDescriptions = importantFields
      .map((fieldName) => {
        const config = this.fieldMapping[fieldName];
        if (config) {
          return `- **${fieldName}** (${config.elk_field}): ${config.description}\n  - AI 分析說明: ${config.ai_context}\n  - 範例值: ${config.example || 'N/A'}`;
        }
        return null;
      })
      .filter(Boolean);

    return fieldDescriptions.join('\n\n');
  }

  /**
   * 從 CHECKPOINT_ACTION_MAPPING 提取 Action 判斷規則
   * 資料來源：checkpointStandards.js
   */
  generateActionMappingContext() {
    return Object.entries(CHECKPOINT_ACTION_MAPPING)
      .map(([action, config]) => {
        const reasons = config.reason_categories
          ? config.reason_categories.slice(0, 3).join('、')
          : '';
        return `- **${action}** (${config.displayName}):
  - 是否封鎖: ${config.isBlocked ? '是' : '否'}
  - 是否威脅: ${config.isThreat ? '是' : '否'}
  - 嚴重程度: ${config.severity}
  - 說明: ${config.description}
  - AI 分析建議: ${config.aiContext}
  - 可能原因: ${reasons}`;
      })
      .join('\n\n');
  }

  /**
   * 從 THREAT_PREVENTION_MAPPING 提取威脅等級判斷規則
   * 資料來源：checkpointStandards.js
   */
  generateThreatPreventionContext() {
    // 嚴重程度
    const severitySection = Object.entries(THREAT_PREVENTION_MAPPING.SEVERITY)
      .map(([level, config]) => {
        return `- **${level}** (${config.displayName}): 分數=${config.score}, 嚴重程度=${config.severity}\n  - AI 分析說明: ${config.aiContext}`;
      })
      .join('\n');

    // 威脅類別
    const categorySection = Object.entries(THREAT_PREVENTION_MAPPING.CATEGORY)
      .map(([category, config]) => {
        return `- **${category}**: ${config.description} (${config.owaspCategory}), 類型=${config.type}, 嚴重程度=${config.severity}`;
      })
      .join('\n');

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
      })
      .join('\n');
  }

  /**
   * 從 URL_CATEGORY_MAPPING 提取 URL 分類規則
   * 資料來源：checkpointStandards.js
   */
  generateURLCategoryContext() {
    return Object.entries(URL_CATEGORY_MAPPING)
      .map(([category, config]) => {
        return `- **${category}** (${config.displayName}): 嚴重程度=${config.severity}, 違規類型=${config.violation_type}\n  - 說明: ${config.description}\n  - 建議操作: ${config.action_recommendation}`;
      })
      .join('\n\n');
  }

  /**
   * 從 OWASP_TOP10_PATTERNS 提取攻擊模式
   * 資料來源：checkpointStandards.js
   */
  generateOWASPContext() {
    return Object.entries(OWASP_TOP10_PATTERNS)
      .map(([attackType, config]) => {
        const patterns = config.patterns.slice(0, 5).join(', ');
        return `- **${attackType}** (${config.category} - ${config.name}):\n  - 偵測模式範例: ${patterns}...`;
      })
      .join('\n\n');
  }

  /**
   * 從 MALICIOUS_USER_AGENT_PATTERNS 提取惡意 UA 特徵
   * 資料來源：checkpointStandards.js
   */
  generateMaliciousUAContext() {
    return Object.entries(MALICIOUS_USER_AGENT_PATTERNS)
      .map(([category, config]) => {
        const patterns = config.patterns.slice(0, 5).join(', ');
        return `- **${category}** (嚴重程度: ${config.severity}): ${config.description}\n  - 偵測工具: ${patterns}...`;
      })
      .join('\n\n');
  }

  /**
   * 格式化 TOP 攻擊者資訊（用於 AI Prompt）
   */
  formatTopAttackersForPrompt(topAttackers) {
    if (!topAttackers || topAttackers.length === 0) {
      return '無可疑攻擊來源 IP';
    }

    return topAttackers
      .map((attacker, index) => {
        return `
${index + 1}. **${attacker.ip}** (${attacker.country})
   - 事件數: ${attacker.eventCount}
   - 阻擋數: ${attacker.dropCount}
   - 阻擋率: ${attacker.blockRate}
   - 行為: ${attacker.behavior}
   - 風險分數: ${attacker.riskScore}
   ${attacker.isPortScan ? `- 端口掃描: 是（掃描 ${attacker.scannedPorts} 個端口）` : ''}
   ${attacker.highRiskPortsHit?.length > 0 ? `- 命中高危端口: ${attacker.highRiskPortsHit.join(', ')}` : ''}
   - 目標端口: ${attacker.targetPorts?.slice(0, 5).join(', ')}${attacker.targetPorts?.length > 5 ? '...' : ''}`;
      })
      .join('\n');
  }

  /**
   * 🆕 格式化 VPN 策略問題資訊（用於 AI Prompt）
   */
  formatVPNPolicyIssuesForPrompt(vpnPolicyIssues) {
    if (!vpnPolicyIssues || vpnPolicyIssues.length === 0) {
      return '無 VPN 用戶存取問題';
    }

    const header = `⚠️ **重要提醒**：以下是已認證的 VPN 用戶流量被防火牆阻擋的情況。
這些**不是攻擊行為**，而是**策略配置問題**，需要提醒管理員檢視。

`;

    const userList = vpnPolicyIssues
      .map((user, index) => {
        return `
${index + 1}. **${user.userName}** (IP: ${user.ip})
   - 帳戶 DN: ${user.userDN || 'N/A'}
   - 被阻擋次數: ${user.dropCount} 次
   - 阻擋率: ${user.blockRate}
   - 安全區域 (security_inzone): **${user.securityZone}**
   - 來源區域 (inzone): ${user.inzone}
   - 阻擋規則 (rule_name): **${user.blockedByRules}**
   - 嘗試存取的端口: ${user.targetPorts?.slice(0, 5).join(', ') || 'N/A'}
   - 嘗試存取的目標 IP: ${user.targetIPs?.slice(0, 3).join(', ') || 'N/A'}`;
      })
      .join('\n');

    const footer = `

**分析重點**：
1. 這些用戶已通過 VPN 身份驗證，表示是合法用戶
2. 流量被阻擋通常是因為防火牆規則未正確配置
3. 請在分析報告中**獨立列出這個問題**，並建議管理員檢視 VPN 存取策略
4. **不要將這些 IP 列入攻擊者清單**`;

    return header + userList + footer;
  }

  /**
   * 產生 AI 分析提示詞（動態從配置檔案提取）- 優化版
   */
  generateAIPrompt(elkData) {
    // ⚠️ 依照需求：userPrompt 移除上半部「分析描述」，並移除 analysisData
    // 改為直接提供 ELK 原始資料（minify JSON stringify），保留下半部「輸出格式要求」
    const promptTemplate = `
### 【ELK 原始日誌資料】

${JSON.stringify(elkData)}

---

### 【輸出格式要求】

請使用 JSON 格式輸出，**所有文字內容必須使用繁體中文**，必須包含以下結構：

**⚠️ 重要：以下是格式範例，請根據實際數據填入具體數值，不要直接複製範例中的佔位符！**

\`\`\`json
{
  "risks": [
    {
      "id": "risk_001",
      "title": "威脅標題（繁體中文，從日誌中自動識別）",
      "severity": "critical/high/medium/low（選擇其中一個）",
      "category": "BLOCKED_ATTACK/THREAT_PREVENTION/HIGH_RISK_APP/URI_ATTACK/URL_FILTERING/PORT_SCAN_DETECTED/CLEANUP_RULE_HIT（選擇其中一個）",
      "layer": "FIREWALL_ACTION/THREAT_PREVENTION/APP_RISK_ASSESSMENT/URI_UA_ANALYSIS/URL_FILTERING/BEHAVIOR_ANALYSIS（選擇其中一個）",
      "description": "威脅詳細描述（繁體中文）",
      "affectedAssets": 5,
      "attackCount": 100,
      "openIssues": 100,
      "resolvedIssues": 0,
      "topAttackers": [
        {
          "ip": "實際的攻擊來源 IP",
          "country": "實際的國家名稱",
          "eventCount": 50,
          "dropCount": 50,
          "blockRate": "100%",
          "behavior": "端口掃描/Cleanup rule 命中/IPS 觸發（選擇其中一個）",
          "targetPorts": [443, 80, 22]
        }
      ],
      "aiInsight": "AI 深度洞察分析（繁體中文，必須包含具體數字、攻擊來源 IP 和 Check Point 專業術語）",
      "recommendations": [
        {
          "priority": "high/medium/low（選擇其中一個）",
          "title": "建議標題（繁體中文）",
          "description": "具體的 Check Point 操作建議（繁體中文，例如：在 SmartConsole 中設定...）"
        }
      ],
      "createdDate": "2025-12-08",
      "updatedDate": "2025-12-08"
    }
  ],
  "summary": {
    "totalRisks": 3,
    "criticalCount": 1,
    "highCount": 1,
    "mediumCount": 1,
    "lowCount": 0,
    "uniqueAttackerIPs": 5
  }
}
\`\`\`

**欄位說明：**
- \`affectedAssets\`: **必須是數字**，表示受影響的網址/端點數量
- \`openIssues\`: **必須是數字**，表示檢測到的事件次數
- \`resolvedIssues\`: **必須是數字**，表示已阻擋的事件次數

### 【⚠️ VPN 用戶存取問題處理】

如果上方有列出「VPN 用戶存取問題」，請**務必**在分析報告中：

1. **獨立列出一個風險項目**，類別為 VPN_POLICY_ISSUE，嚴重程度為 medium
2. **明確標示這不是攻擊**，設定 isAttack: false
3. **列出所有受影響的 VPN 用戶**，包含：
    - 用戶名稱 (userName)
    - IP 地址
    - 安全區域 (securityZone)
    - 阻擋規則 (blockedByRules)
    - 被阻擋次數
4. **提供策略檢視建議**，而非安全封鎖建議
5. **不要將 VPN 用戶 IP 列入攻擊者清單**

VPN 策略問題的輸出格式範例：

**⚠️ 重要：請根據實際的 VPN 用戶資料填入，不要使用佔位符！**

\`\`\`json
{
  "id": "risk_006",
  "title": "⚠️ VPN 用戶存取被阻擋（需檢視策略）",
  "severity": "medium",
  "category": "VPN_POLICY_ISSUE",
  "layer": "POLICY_REVIEW",
  "isAttack": false,
  "affectedAssets": 3,
  "openIssues": 20,
  "resolvedIssues": 0,
  "vpnUsers": [
    {
      "userName": "實際的用戶名稱（從 src_user_name 取得）",
      "ip": "實際的 VPN IP",
      "securityZone": "L3_untrust",
      "blockedByRules": "Cleanup rule",
      "dropCount": 20
    }
  ],
  "aiInsight": "⚠️ **VPN 用戶存取問題警示**\n\n檢測到以下已認證的 VPN 用戶流量被防火牆阻擋：\n\n• 實際用戶名稱 (實際IP) - 被 \"Cleanup rule\" 阻擋 20 次，安全區域: L3_untrust\n\n**注意：這不是攻擊行為，而是策略配置問題。**",
  "recommendations": [
    { "priority": "high", "title": "檢視 VPN 存取策略", "description": "確認 VPN 用戶是否應該被允許存取目標資源" }
  ]
}
\`\`\`

請開始分析。
    `.trim();

    return promptTemplate;
  }

  /**
   * 產生備用風險報告（當 AI 無法使用時）- 優化版
   * 維持威脅類型為中心 + 增加 TOP 攻擊者 IP
   */
  generateFallbackRisks(analysisData) {
    const {
      timeRange,
      totalEvents,
      totalThreats,
      blockedTraffic,
      highRiskApps,
      threatPrevention,
      urlFiltering,
      owaspAttacks,
      ipAggregatedStats, // 新增：IP 聚合統計
      topAttackers, // 新增：TOP 攻擊者
    } = analysisData;

    const risks = [];
    let riskId = 1;

    // 獲取 TOP 攻擊者（如果沒有傳入則重新計算）
    const attackersList =
      topAttackers ||
      (ipAggregatedStats ? this.getTopAttackers(ipAggregatedStats, 5) : []);

    // Risk 1: 被封鎖的流量（維持原有結構 + 新增 topAttackers）
    if (blockedTraffic && blockedTraffic.totalBlocked > 0) {
      risks.push({
        id: `risk_${String(riskId++).padStart(3, '0')}`,
        title: '防火牆已封鎖的威脅流量',
        severity: 'critical',
        category: 'BLOCKED_ATTACK',
        layer: 'FIREWALL_ACTION',
        description: `防火牆檢測並封鎖了 ${blockedTraffic.totalBlocked} 筆威脅流量`,
        // 🆕 修正：affectedAssets 改為數字（唯一 IP 數量）
        affectedAssets:
          blockedTraffic.topBlockedApps?.reduce(
            (sum, app) => sum + (app.uniqueIPs || 0),
            0,
          ) || 0,
        // 保留原始的應用程式名稱列表供顯示
        affectedAppNames:
          blockedTraffic.topBlockedApps
            ?.slice(0, 5)
            .map((app) => app.appName) || [],
        attackCount: blockedTraffic.totalBlocked,
        openIssues: blockedTraffic.totalBlocked,
        resolvedIssues: 0,
        uniqueIPs:
          blockedTraffic.topBlockedApps?.reduce(
            (sum, app) => sum + (app.uniqueIPs || 0),
            0,
          ) || 0,
        topApps: blockedTraffic.topBlockedApps?.slice(0, 5) || [],
        // 🆕 新增：TOP 攻擊者 IP
        topAttackers: attackersList.filter((a) => a.dropCount > 0).slice(0, 5),
        aiInsight: `檢測到 ${blockedTraffic.totalBlocked} 筆被封鎖的威脅流量${attackersList.length > 0 ? `，來自 ${attackersList.length} 個可疑來源 IP` : ''}。防火牆已成功阻擋這些威脅，建議持續監控。`,
        recommendations: [
          {
            priority: 'medium',
            title: '檢查封鎖規則',
            description: '確認封鎖規則是否符合業務需求，避免誤封正常流量',
          },
          {
            priority: 'low',
            title: '定期審查封鎖日誌',
            description: '持續優化安全規則，識別攻擊模式',
          },
        ],
        createdDate: this.formatDateTaipei(timeRange.start),
        updatedDate: this.formatDateTaipei(timeRange.end),
      });
    }

    // Risk 2: 高風險應用程式（維持原有結構 + 新增 topAttackers）
    if (highRiskApps && highRiskApps.totalHighRiskEvents > 0) {
      risks.push({
        id: `risk_${String(riskId++).padStart(3, '0')}`,
        title: '高風險應用程式活動',
        severity: 'high',
        category: 'HIGH_RISK_APPLICATION',
        layer: 'APP_RISK_ASSESSMENT',
        description: `檢測到 ${highRiskApps.totalHighRiskEvents} 筆高風險應用程式（app_risk >= 4）活動`,
        // 🆕 修正：affectedAssets 改為數字（唯一 IP 數量）
        affectedAssets:
          highRiskApps.topHighRiskApps?.reduce(
            (sum, app) => sum + (app.uniqueIPs || 0),
            0,
          ) || 0,
        // 保留原始的應用程式名稱列表供顯示
        affectedAppNames:
          highRiskApps.topHighRiskApps?.slice(0, 5).map((app) => app.appName) ||
          [],
        attackCount: highRiskApps.totalHighRiskEvents,
        openIssues: highRiskApps.totalHighRiskEvents,
        resolvedIssues: 0,
        topApps: highRiskApps.topHighRiskApps?.slice(0, 5) || [],
        // 🆕 新增：TOP 攻擊者 IP
        topAttackers: attackersList.slice(0, 5),
        aiInsight: '這些應用程式具有高安全風險，建議限制或監控其使用。',
        recommendations: [
          {
            priority: 'high',
            title: '審查高風險應用程式使用政策',
            description: '降低安全風險，確保符合企業安全規範',
          },
          {
            priority: 'high',
            title: '考慮封鎖或限制高風險應用',
            description: '保護企業資產，防止資料外洩',
          },
        ],
        createdDate: this.formatDateTaipei(timeRange.start),
        updatedDate: this.formatDateTaipei(timeRange.end),
      });
    }

    // Risk 3: Threat Prevention 檢測（維持原有結構 + 新增 topAttackers）
    if (threatPrevention && threatPrevention.totalThreatPreventionEvents > 0) {
      risks.push({
        id: `risk_${String(riskId++).padStart(3, '0')}`,
        title: 'Threat Prevention 檢測到的威脅',
        severity: 'critical',
        category: 'THREAT_PREVENTION_DETECTED',
        layer: 'THREAT_PREVENTION',
        description: `Threat Prevention 檢測到 ${threatPrevention.totalThreatPreventionEvents} 筆威脅`,
        topThreats: threatPrevention.topThreats?.slice(0, 5) || [],
        attackCount: threatPrevention.totalThreatPreventionEvents,
        openIssues: threatPrevention.totalThreatPreventionEvents,
        resolvedIssues: 0,
        // 🆕 受影響的網址數量
        affectedAssets:
          threatPrevention.topThreats?.reduce(
            (sum, t) => sum + (t.uniqueIPs || 0),
            0,
          ) || 0,
        // 🆕 新增：TOP 攻擊者 IP（IPS 觸發的）
        topAttackers: attackersList
          .filter((a) => a.behavior === 'IPS 觸發')
          .slice(0, 5),
        aiInsight:
          'Check Point Threat Prevention 檢測到多種威脅，需要立即調查。',
        recommendations: [
          {
            priority: 'critical',
            title: '立即調查威脅來源',
            description: '防止攻擊擴散，隔離受影響系統',
          },
          {
            priority: 'high',
            title: '更新 IPS 簽章',
            description: '提升檢測能力，防禦最新威脅',
          },
        ],
        createdDate: this.formatDateTaipei(timeRange.start),
        updatedDate: this.formatDateTaipei(timeRange.end),
      });
    }

    // Risk 4: 端口掃描活動（🆕 新增威脅類型）
    if (ipAggregatedStats) {
      const portScanIPs = Object.values(ipAggregatedStats).filter(
        (stats) => stats.portScanAnalysis && stats.portScanAnalysis.isPortScan,
      );

      if (portScanIPs.length > 0) {
        const totalPortScanEvents = portScanIPs.reduce(
          (sum, ip) => sum + ip.totalEvents,
          0,
        );
        risks.push({
          id: `risk_${String(riskId++).padStart(3, '0')}`,
          title: '端口掃描活動檢測',
          severity: 'high',
          category: 'PORT_SCAN_DETECTED',
          layer: 'BEHAVIOR_ANALYSIS',
          description: `檢測到 ${portScanIPs.length} 個來源 IP 進行端口掃描行為`,
          attackCount: totalPortScanEvents,
          openIssues: totalPortScanEvents,
          resolvedIssues: 0,
          // 🆕 受影響的網址數量（被掃描的目標數量）
          affectedAssets:
            [
              ...new Set(
                portScanIPs.flatMap(
                  (ip) => ip.targetUrls || ip.targetIPs || [],
                ),
              ),
            ].length || portScanIPs.length,
          // 🆕 受影響網址清單（優先使用 domain 名稱）
          affectedUrlList: [
            ...new Set(
              portScanIPs.flatMap((ip) => ip.targetUrls || ip.targetIPs || []),
            ),
          ].slice(0, 10),
          // 🆕 TOP 攻擊者 IP
          topAttackers: portScanIPs.slice(0, 5).map((stats) => ({
            ip: stats.ip,
            country: stats.geoInfo?.country || 'Unknown',
            eventCount: stats.totalEvents,
            dropCount: stats.dropCount,
            blockRate: `${stats.blockRate}%`,
            behavior: '端口掃描',
            scannedPorts: stats.portScanAnalysis?.uniquePortCount || 0,
            highRiskPortsHit: stats.portScanAnalysis?.highRiskPortsHit || [],
            targetPorts: stats.targetPorts?.slice(0, 10) || [],
          })),
          aiInsight: `檢測到 ${portScanIPs.length} 個 IP 進行端口掃描，這通常是攻擊的前兆（偵察階段）。所有掃描行為已被防火牆成功阻擋。`,
          recommendations: [
            {
              priority: 'high',
              title: '監控這些 IP 的後續活動',
              description: '確認是否有進一步攻擊行為',
            },
            {
              priority: 'medium',
              title: '確認高危端口服務狀態',
              description: '確保 SSH、RDP、SMB 等服務安全配置',
            },
          ],
          createdDate: this.formatDateTaipei(timeRange.start),
          updatedDate: this.formatDateTaipei(timeRange.end),
        });
      }
    }

    // Risk 5: Cleanup Rule 命中（🆕 排除 VPN 用戶）
    if (ipAggregatedStats) {
      // 🆕 只統計非 VPN 用戶的 Cleanup rule 命中
      const cleanupRuleIPs = Object.values(ipAggregatedStats).filter(
        (stats) =>
          !stats.isVPNUser && // 排除 VPN 用戶
          stats.ruleNames &&
          stats.ruleNames.some((r) => r.toLowerCase().includes('cleanup')),
      );

      if (cleanupRuleIPs.length > 0) {
        const totalCleanupEvents = cleanupRuleIPs.reduce(
          (sum, ip) => sum + ip.totalEvents,
          0,
        );
        risks.push({
          id: `risk_${String(riskId++).padStart(3, '0')}`,
          title: 'Cleanup Rule 未授權存取嘗試',
          severity: 'medium',
          category: 'CLEANUP_RULE_HIT',
          layer: 'FIREWALL_ACTION',
          description: `${cleanupRuleIPs.length} 個來源 IP 的連線被 Cleanup rule 阻擋，表示未匹配任何允許規則`,
          attackCount: totalCleanupEvents,
          openIssues: totalCleanupEvents,
          resolvedIssues: 0,
          // 🆕 受影響的網址數量（被嘗試存取的目標數量）
          affectedAssets:
            [
              ...new Set(
                cleanupRuleIPs.flatMap(
                  (ip) => ip.targetUrls || ip.targetIPs || [],
                ),
              ),
            ].length || cleanupRuleIPs.length,
          // 🆕 受影響網址清單（優先使用 domain 名稱）
          affectedUrlList: [
            ...new Set(
              cleanupRuleIPs.flatMap(
                (ip) => ip.targetUrls || ip.targetIPs || [],
              ),
            ),
          ].slice(0, 10),
          // 🆕 TOP 攻擊者 IP（排除 VPN 用戶）
          topAttackers: cleanupRuleIPs.slice(0, 5).map((stats) => ({
            ip: stats.ip,
            country: stats.geoInfo?.country || 'Unknown',
            eventCount: stats.totalEvents,
            dropCount: stats.dropCount,
            blockRate: `${stats.blockRate}%`,
            behavior: 'Cleanup rule 命中',
            targetPorts: stats.targetPorts?.slice(0, 10) || [],
          })),
          aiInsight:
            'Cleanup rule 是防火牆的最後一道防線，命中此規則表示連線未被任何允許規則匹配。這可能是未授權的存取嘗試、掃描行為或配置問題。',
          recommendations: [
            {
              priority: 'medium',
              title: '檢查是否為合法連線',
              description: '確認是否需要新增允許規則',
            },
            {
              priority: 'low',
              title: '監控來源 IP',
              description: '確認是否為惡意活動或誤報',
            },
          ],
          createdDate: this.formatDateTaipei(timeRange.start),
          updatedDate: this.formatDateTaipei(timeRange.end),
        });
      }
    }

    // 🆕 Risk 6: VPN 策略問題（非攻擊，需要檢視策略）
    if (ipAggregatedStats) {
      const vpnPolicyIssueIPs = Object.values(ipAggregatedStats).filter(
        (stats) =>
          stats.isVPNUser && (stats.dropCount > 0 || stats.rejectCount > 0),
      );

      if (vpnPolicyIssueIPs.length > 0) {
        const totalVPNPolicyEvents = vpnPolicyIssueIPs.reduce(
          (sum, ip) => sum + ip.totalEvents,
          0,
        );

        // 🆕 收集所有被阻擋的 VPN 用戶詳細資訊
        const vpnUsersDetail = vpnPolicyIssueIPs.slice(0, 10).map((stats) => ({
          ip: stats.ip,
          userName: stats.userName || 'Unknown',
          userDN: stats.userDN || null,
          eventCount: stats.totalEvents,
          dropCount: stats.dropCount,
          rejectCount: stats.rejectCount || 0,
          blockRate: `${stats.blockRate}%`,
          // 🆕 新增：安全區域資訊
          securityZone: stats.securityZone || 'Unknown',
          inzone: stats.inzone || 'Unknown',
          // 🆕 新增：阻擋規則
          ruleNames: stats.ruleNames || [],
          blockedByRules: stats.ruleNames?.join(', ') || 'Unknown',
          targetPorts: stats.targetPorts?.slice(0, 10) || [],
          targetIPs: stats.targetIPs?.slice(0, 5) || [],
          // 🆕 新增：目標網址（優先使用 domain 名稱）
          targetUrls:
            stats.targetUrls?.slice(0, 5) || stats.targetIPs?.slice(0, 5) || [],
        }));

        // 🆕 生成用戶清單摘要
        const userSummary = vpnUsersDetail
          .map(
            (u) =>
              `• ${u.userName} (${u.ip}) - 被 "${u.blockedByRules}" 阻擋 ${u.dropCount} 次，安全區域: ${u.securityZone}`,
          )
          .join('\n');

        // 🆕 計算受影響的網址數量（優先使用 domain 名稱）
        const affectedUrlsCount = [
          ...new Set(
            vpnUsersDetail.flatMap((u) => u.targetUrls || u.targetIPs || []),
          ),
        ].length;

        risks.push({
          id: `risk_${String(riskId++).padStart(3, '0')}`,
          title: '⚠️ VPN 用戶存取被阻擋（需檢視策略）',
          severity: 'medium', // 🆕 提升為中等嚴重度，因為需要注意
          category: 'VPN_POLICY_ISSUE',
          layer: 'POLICY_REVIEW',
          description: `檢測到 ${vpnPolicyIssueIPs.length} 個已認證的 VPN 用戶流量被防火牆阻擋，共 ${totalVPNPolicyEvents} 次。這不是攻擊，但可能影響用戶正常存取。`,
          attackCount: totalVPNPolicyEvents,
          openIssues: totalVPNPolicyEvents,
          resolvedIssues: 0,
          // 🆕 受影響的網址數量
          affectedAssets: affectedUrlsCount || vpnPolicyIssueIPs.length,
          // 🆕 受影響網址清單（優先使用 domain 名稱）
          affectedUrlList: [
            ...new Set(
              vpnUsersDetail.flatMap((u) => u.targetUrls || u.targetIPs || []),
            ),
          ].slice(0, 10),
          isAttack: false, // 明確標記非攻擊

          // 🆕 VPN 用戶詳細清單
          vpnUsers: vpnUsersDetail,

          // 🆕 AI 洞察分析（包含用戶名稱、安全區域、阻擋規則）
          aiInsight: `⚠️ **VPN 用戶存取問題警示**

檢測到以下已認證的 VPN 用戶流量被防火牆阻擋：

${userSummary}

**問題分析：**
這些用戶已通過 VPN 身份驗證，但其流量被防火牆阻擋。這通常表示：
1. 防火牆規則未正確配置 VPN 用戶的存取權限
2. VPN 用戶嘗試存取未授權的資源
3. 安全區域 (security_inzone) 配置可能需要調整

**注意：這不是攻擊行為，而是策略配置問題。**`,

          recommendations: [
            {
              priority: 'high',
              title: '檢視 VPN 存取策略',
              description: `確認這些 VPN 用戶是否應該被允許存取目標資源。受影響用戶：${vpnUsersDetail.map((u) => u.userName).join(', ')}`,
            },
            {
              priority: 'high',
              title: '檢查防火牆規則順序',
              description: `被阻擋的規則：${[...new Set(vpnUsersDetail.flatMap((u) => u.ruleNames))].join(', ')}。確認是否需要在這些規則之前新增 VPN 允許規則。`,
            },
            {
              priority: 'medium',
              title: '確認安全區域配置',
              description: `VPN 流量來自安全區域：${[...new Set(vpnUsersDetail.map((u) => u.securityZone))].join(', ')}。確認此區域的存取政策是否正確。`,
            },
            {
              priority: 'low',
              title: '通知相關用戶',
              description:
                '如果確認是策略問題，可能需要通知受影響的用戶目前無法存取某些資源。',
            },
          ],
          createdDate: this.formatDateTaipei(timeRange.start),
          updatedDate: this.formatDateTaipei(timeRange.end),
        });
      }
    }

    // Risk 6: URL Filtering 違規
    if (urlFiltering && urlFiltering.totalURLFilteringViolations > 0) {
      risks.push({
        id: `risk_${String(riskId++).padStart(3, '0')}`,
        title: 'URL Filtering 政策違規',
        severity: 'high',
        category: 'URL_FILTERING_VIOLATION',
        layer: 'URL_FILTERING',
        description: `檢測到 ${urlFiltering.totalURLFilteringViolations} 筆 URL Filtering 違規`,
        topCategories: urlFiltering.topCategories?.slice(0, 5) || [],
        attackCount: urlFiltering.totalURLFilteringViolations,
        openIssues: urlFiltering.totalURLFilteringViolations,
        resolvedIssues: 0,
        // 🆕 受影響的網址數量
        affectedAssets:
          urlFiltering.topCategories?.reduce(
            (sum, cat) => sum + (cat.uniqueIPs || 0),
            0,
          ) || 0,
        topAttackers: attackersList.slice(0, 5),
        aiInsight: '使用者嘗試訪問違反公司政策的網站類別。',
        recommendations: [
          {
            priority: 'medium',
            title: '加強員工安全意識培訓',
            description: '減少政策違規，提高安全意識',
          },
          {
            priority: 'medium',
            title: '審查 URL Filtering 政策',
            description: '確保政策合理性，避免影響正常業務',
          },
        ],
        createdDate: this.formatDateTaipei(timeRange.start),
        updatedDate: this.formatDateTaipei(timeRange.end),
      });
    }

    // Risk 7: OWASP 攻擊模式
    if (owaspAttacks && owaspAttacks.totalOWASPAttacks > 0) {
      risks.push({
        id: `risk_${String(riskId++).padStart(3, '0')}`,
        title: 'OWASP TOP 10 攻擊模式檢測',
        severity: 'critical',
        category: 'URI_ATTACK_PATTERN',
        layer: 'URI_UA_ANALYSIS',
        description: `檢測到 ${owaspAttacks.totalOWASPAttacks} 筆符合 OWASP TOP 10 的攻擊模式`,
        topAttackTypes: owaspAttacks.topAttackTypes?.slice(0, 5) || [],
        attackCount: owaspAttacks.totalOWASPAttacks,
        openIssues: owaspAttacks.totalOWASPAttacks,
        resolvedIssues: 0,
        // 🆕 受影響的網址數量
        affectedAssets:
          owaspAttacks.topAttackTypes?.reduce(
            (sum, type) => sum + (type.uniqueIPs || 0),
            0,
          ) || 0,
        topAttackers: attackersList.slice(0, 5),
        aiInsight:
          '檢測到多種 OWASP TOP 10 攻擊模式，包括 SQL 注入、XSS、命令注入等。',
        recommendations: [
          {
            priority: 'critical',
            title: '立即調查攻擊來源和目標',
            description: '防止資料洩露或系統入侵',
          },
          {
            priority: 'high',
            title: '檢查 Web 應用程式安全性',
            description: '修補已知漏洞，更新依賴套件',
          },
          {
            priority: 'high',
            title: '啟用 WAF 防護',
            description: '攔截 Web 應用攻擊',
          },
        ],
        createdDate: this.formatDateTaipei(timeRange.start),
        updatedDate: this.formatDateTaipei(timeRange.end),
      });
    }

    const summary = {
      totalRisks: risks.length,
      criticalCount: risks.filter((r) => r.severity === 'critical').length,
      highCount: risks.filter((r) => r.severity === 'high').length,
      mediumCount: risks.filter((r) => r.severity === 'medium').length,
      lowCount: risks.filter((r) => r.severity === 'low').length,
      // 🆕 新增統計
      totalAnalyzedEvents:
        analysisData.filteredStats?.suspiciousCount || totalEvents,
      filteredNormalTraffic: analysisData.filteredStats?.normalCount || 0,
      uniqueAttackerIPs: attackersList.length,
    };

    return { risks, summary };
  }

  // ==================== 新增：IP 聚合分析方法 ====================

  /**
   * 按來源 IP 聚合日誌統計
   * @param {array} logEntries - 解析後的日誌陣列
   * @returns {object} 聚合統計結果
   */
  aggregateBySourceIP(logEntries) {
    const stats = {};

    logEntries.forEach((log) => {
      const srcIP = log.src_ip || log.src || 'Unknown';

      if (!stats[srcIP]) {
        // 🆕 檢查是否為 VPN 用戶
        const vpnUserInfo = checkVPNUser(log);

        stats[srcIP] = {
          ip: srcIP,
          totalEvents: 0,
          dropCount: 0,
          rejectCount: 0,
          acceptCount: 0,
          alertCount: 0,
          targetIPs: new Set(),
          targetUrls: new Set(), // 🆕 新增：收集目標網址（domain 名稱）
          targetPorts: new Set(),
          ruleNames: new Set(),
          geoInfo: {
            country: log.src_country || log.geoip?.country_name || 'Unknown',
            city: log.geoip?.city_name || 'Unknown',
            region: log.geoip?.region_name || 'Unknown',
          },
          securityZone: log.security_inzone || 'Unknown',
          inzone: log.inzone || 'Unknown',
          // 🆕 VPN 用戶資訊
          vpnUserInfo: vpnUserInfo,
          isVPNUser: vpnUserInfo.isVPNUser,
          userName: vpnUserInfo.userName || null,
          userDN: vpnUserInfo.userDN || null,
          // 🆕 新增分類：VPN_POLICY_ISSUE
          classifications: {
            KNOWN_ATTACK: 0,
            SCAN_SUSPICIOUS: 0,
            NORMAL_TRAFFIC: 0,
            VPN_POLICY_ISSUE: 0,
          },
          sigIds: new Set(),
          threatSeverities: new Set(),
          services: new Set(),
          timestamps: [],
          logs: [], // 保留原始日誌供後續分析
        };
      }

      const ipStats = stats[srcIP];
      ipStats.totalEvents++;
      ipStats.logs.push(log);

      // 統計 Action
      const action = (log.action || '').toLowerCase();
      if (action === 'drop') ipStats.dropCount++;
      else if (action === 'reject') ipStats.rejectCount++;
      else if (action === 'accept') ipStats.acceptCount++;
      else if (action === 'alert') ipStats.alertCount++;

      // 收集目標資訊
      if (log.dst_ip || log.dst) ipStats.targetIPs.add(log.dst_ip || log.dst);
      // 🆕 收集目標網址（domain 名稱）- 優先使用 dst_machine_name
      if (log.dst_machine_name) {
        ipStats.targetUrls.add(log.dst_machine_name);
      } else if (log.dst_ip || log.dst) {
        ipStats.targetUrls.add(log.dst_ip || log.dst); // 如果沒有 domain，使用 IP
      }
      if (log.service || log.dst_port)
        ipStats.targetPorts.add(log.service || log.dst_port);

      // 收集規則名稱
      const ruleName =
        log.rule_name ||
        (log.rule_name_match_table && log.rule_name_match_table[0]);
      if (ruleName) ipStats.ruleNames.add(ruleName);

      // 收集 IPS 資訊
      if (log.sig_id) ipStats.sigIds.add(log.sig_id);
      if (log.threat_severity)
        ipStats.threatSeverities.add(log.threat_severity);

      // 收集服務資訊
      if (log.service_id) ipStats.services.add(log.service_id);

      // 收集時間戳
      if (log.timestamp)
        ipStats.timestamps.push(new Date(log.timestamp).getTime());

      // 分類統計（包含 VPN_POLICY_ISSUE）
      const classification = classifyEvent(log);
      if (
        ipStats.classifications[classification.classification] !== undefined
      ) {
        ipStats.classifications[classification.classification]++;
      }
    });

    // 轉換 Set 為陣列，並計算衍生指標
    Object.values(stats).forEach((ipStats) => {
      ipStats.targetIPs = Array.from(ipStats.targetIPs);
      ipStats.targetUrls = Array.from(ipStats.targetUrls); // 🆕 新增
      ipStats.targetPorts = Array.from(ipStats.targetPorts);
      ipStats.ruleNames = Array.from(ipStats.ruleNames);
      ipStats.sigIds = Array.from(ipStats.sigIds);
      ipStats.threatSeverities = Array.from(ipStats.threatSeverities);
      ipStats.services = Array.from(ipStats.services);

      // 計算端口掃描偵測
      ipStats.portScanAnalysis = detectPortScan(ipStats.logs);

      // 🆕 判斷主要分類（VPN 用戶優先識別）
      if (ipStats.isVPNUser && ipStats.classifications.VPN_POLICY_ISSUE > 0) {
        ipStats.primaryClassification = 'VPN_POLICY_ISSUE';
      } else if (ipStats.classifications.KNOWN_ATTACK > 0) {
        ipStats.primaryClassification = 'KNOWN_ATTACK';
      } else if (ipStats.classifications.SCAN_SUSPICIOUS > 0) {
        ipStats.primaryClassification = 'SCAN_SUSPICIOUS';
      } else {
        ipStats.primaryClassification = 'NORMAL_TRAFFIC';
      }

      // 計算被阻擋比例
      ipStats.blockRate =
        ipStats.totalEvents > 0
          ? (
              ((ipStats.dropCount + ipStats.rejectCount) /
                ipStats.totalEvents) *
              100
            ).toFixed(1)
          : 0;

      // 🆕 判斷行為類型（VPN 用戶優先識別）
      if (ipStats.isVPNUser) {
        ipStats.behavior = 'VPN 用戶策略問題';
        ipStats.isAttack = false; // 明確標記非攻擊
      } else if (ipStats.sigIds.length > 0) {
        ipStats.behavior = 'IPS 觸發';
        ipStats.isAttack = true;
      } else if (ipStats.portScanAnalysis.isPortScan) {
        ipStats.behavior = '端口掃描';
        ipStats.isAttack = true;
      } else if (
        ipStats.ruleNames.some((r) => r.toLowerCase().includes('cleanup'))
      ) {
        ipStats.behavior = 'Cleanup rule 命中';
        ipStats.isAttack = true;
      } else if (ipStats.dropCount > 0 || ipStats.rejectCount > 0) {
        ipStats.behavior = '連線被阻擋';
        ipStats.isAttack = true;
      } else {
        ipStats.behavior = '正常流量';
        ipStats.isAttack = false;
      }

      // 移除原始日誌以節省記憶體
      delete ipStats.logs;
    });

    return stats;
  }

  /**
   * 取得 TOP N 攻擊者 IP（用於補充威脅類型資訊）
   * 🆕 排除 VPN 用戶，只返回真正的攻擊者
   * @param {object} aggregatedStats - 聚合統計結果
   * @param {number} limit - 返回數量限制
   * @returns {array} TOP 攻擊者清單
   */
  getTopAttackers(aggregatedStats, limit = 5) {
    // 🆕 過濾：排除 VPN 用戶，只保留真正的攻擊者
    let filteredIPs = Object.values(aggregatedStats).filter(
      (stats) =>
        !stats.isVPNUser && // 排除 VPN 用戶
        (stats.classifications.KNOWN_ATTACK > 0 ||
          stats.classifications.SCAN_SUSPICIOUS > 0),
    );

    // 計算風險分數並排序
    return filteredIPs
      .map((stats) => {
        let riskScore = 0;

        // 因素 1：被阻擋次數
        riskScore += (stats.dropCount + stats.rejectCount) * 2;

        // 因素 2：IPS 告警
        riskScore += stats.sigIds.length * 10;
        riskScore += stats.threatSeverities.includes('High') ? 20 : 0;
        riskScore += stats.threatSeverities.includes('Medium') ? 10 : 0;

        // 因素 3：端口掃描
        if (stats.portScanAnalysis && stats.portScanAnalysis.isPortScan) {
          riskScore += 15;
          riskScore +=
            (stats.portScanAnalysis.highRiskPortsHit?.length || 0) * 5;
        }

        // 因素 4：來源區域
        if (
          stats.securityZone === 'L3_untrust' ||
          stats.inzone === 'External'
        ) {
          riskScore += 10;
        }

        // 因素 5：已知攻擊分類
        if (stats.primaryClassification === 'KNOWN_ATTACK') {
          riskScore += 25;
        }

        return { ...stats, riskScore };
      })
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, limit)
      .map((stats) => ({
        ip: stats.ip,
        country: stats.geoInfo.country,
        eventCount: stats.totalEvents,
        dropCount: stats.dropCount,
        blockRate: `${stats.blockRate}%`,
        behavior: stats.behavior,
        targetPorts: stats.targetPorts.slice(0, 10),
        isPortScan: stats.portScanAnalysis?.isPortScan || false,
        scannedPorts: stats.portScanAnalysis?.uniquePortCount || 0,
        highRiskPortsHit: stats.portScanAnalysis?.highRiskPortsHit || [],
        riskScore: stats.riskScore,
      }));
  }

  /**
   * 🆕 取得 VPN 策略問題清單（包含詳細資訊）
   * @param {object} aggregatedStats - 聚合統計結果
   * @param {number} limit - 返回數量限制
   * @returns {array} VPN 策略問題清單
   */
  getVPNPolicyIssues(aggregatedStats, limit = 10) {
    return Object.values(aggregatedStats)
      .filter(
        (stats) =>
          stats.isVPNUser && (stats.dropCount > 0 || stats.rejectCount > 0),
      )
      .sort((a, b) => b.totalEvents - a.totalEvents)
      .slice(0, limit)
      .map((stats) => ({
        ip: stats.ip,
        userName: stats.userName || 'Unknown',
        userDN: stats.userDN || null,
        eventCount: stats.totalEvents,
        dropCount: stats.dropCount,
        rejectCount: stats.rejectCount || 0,
        blockRate: `${stats.blockRate}%`,
        // 🆕 安全區域資訊
        securityZone: stats.securityZone || 'Unknown',
        inzone: stats.inzone || 'Unknown',
        // 🆕 阻擋規則
        ruleNames: stats.ruleNames || [],
        blockedByRules: stats.ruleNames?.join(', ') || 'Unknown',
        targetPorts: stats.targetPorts?.slice(0, 10) || [],
        targetIPs: stats.targetIPs?.slice(0, 5) || [],
        // 🆕 新增：目標網址（優先使用 domain 名稱）
        targetUrls:
          stats.targetUrls?.slice(0, 5) || stats.targetIPs?.slice(0, 5) || [],
        isVPNUser: true,
        isAttack: false,
      }));
  }

  /**
   * 過濾正常流量，只保留需要分析的事件
   * 🆕 區分：真實攻擊 vs VPN 策略問題 vs 正常流量
   * @param {array} logEntries - 解析後的日誌陣列
   * @returns {object} 過濾結果
   */
  filterNormalTraffic(logEntries) {
    const suspicious = []; // 真實可疑事件（需要分析）
    const vpnPolicyIssues = []; // 🆕 VPN 策略問題（不視為攻擊）
    const normal = []; // 正常流量

    logEntries.forEach((log) => {
      const classification = classifyEvent(log);

      if (classification.classification === 'NORMAL_TRAFFIC') {
        normal.push(log);
      } else if (classification.classification === 'VPN_POLICY_ISSUE') {
        // 🆕 VPN 策略問題獨立分類
        vpnPolicyIssues.push({ ...log, classification });
      } else {
        // 真實可疑事件：KNOWN_ATTACK 或 SCAN_SUSPICIOUS
        suspicious.push({ ...log, classification });
      }
    });

    return {
      suspicious,
      vpnPolicyIssues, // 🆕 新增
      normal,
      suspiciousCount: suspicious.length,
      vpnPolicyIssueCount: vpnPolicyIssues.length, // 🆕 新增
      normalCount: normal.length,
      totalCount: logEntries.length,
    };
  }

  /**
   * 空結果
   */
  getEmptyAnalysisResult() {
    return {
      elkData: { hits: [] },
      timeRange: {
        start: new Date().toISOString(),
        end: new Date().toISOString(),
      },
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
      analysisResults: [],
      ipAggregatedStats: {}, // 新增
      filteredStats: { suspiciousCount: 0, normalCount: 0, totalCount: 0 }, // 新增
    };
  }
}

module.exports = CheckpointRiskServices;
