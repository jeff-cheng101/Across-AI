// backend/services/products/cloudflareWAFRiskService.js
// Cloudflare WAF 風險分析服務
// 專門分析 Cloudflare WAF 日誌並生成風險評估報告

const { elkMCPClient } = require('../elkMCPClient');
const {
  CLOUDFLARE_FIELD_MAPPING,
} = require('../../config/products/cloudflare/cloudflareFieldMapping');
const cloudflareELKConfig = require('../../config/products/cloudflare/cloudflareELKConfig');
const {
  classifyWAFScore,
  isCloudflareInternalEndpoint,
  isValidWAFScore,
  isRealSecurityThreat,
  calculateValidAvgScore,
  RECOMMENDED_THRESHOLDS,
  WAF_SCORE_CLASSIFICATION,
  analyzeThreatLevel,
  classifySecurityAction,
  analyzeURIPattern,
  analyzeUserAgent,
  hasLowWAFScore,
  identifyAttackType,
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
        fieldMapping: this.fieldMapping,
      });

      if (!elkData.hits || elkData.hits.length === 0) {
        console.log('⚠️ 未找到日誌資料');
        return this.getEmptyAnalysisResult();
      }

      // Step 2: 使用 cloudflare-field-mapping 解析資料
      console.log(`\n⭐ Step 2: 解析 ${elkData.hits.length} 筆日誌...`);
      const logEntries = elkData.hits.map((hit) =>
        this.parseCloudflareLog(hit.source),
      );
      console.log(`✅ 成功解析 ${logEntries.length} 筆日誌`);

      // Step 3: 分析各種攻擊類型
      console.log('\n⭐ Step 3: 分析攻擊模式...');
      const sqlInjection = this.analyzeSQLInjection(logEntries);
      console.log(
        `   SQL 注入: ${sqlInjection.count} 次 (高風險: ${sqlInjection.highRisk})`,
      );

      const xssAttacks = this.analyzeXSSAttacks(logEntries);
      console.log(
        `   XSS 攻擊: ${xssAttacks.count} 次 (高風險: ${xssAttacks.highRisk})`,
      );

      const rceAttacks = this.analyzeRCEAttacks(logEntries);
      console.log(
        `   RCE 攻擊: ${rceAttacks.count} 次 (高風險: ${rceAttacks.highRisk})`,
      );

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

      // 計算時間範圍（使用混合方案）
      const timeRange_result = this.calculateTimeRangeWithFallback(
        timeRange,
        logEntries,
      );

      console.log(`📅 時間範圍資訊:`);
      console.log(
        `   預期範圍: ${this.formatTimeTaipei(timeRange_result.display.start)} ~ ${this.formatTimeTaipei(timeRange_result.display.end)}`,
      );
      if (timeRange_result.actual) {
        console.log(
          `   實際日誌: ${this.formatTimeTaipei(timeRange_result.actual.start)} ~ ${this.formatTimeTaipei(timeRange_result.actual.end)}`,
        );
      }
      console.log(`   日誌數量: ${timeRange_result.logCount} 筆`);

      console.log('\n✅ ===== Cloudflare WAF 風險分析完成 =====\n');

      return {
        elkData,
        sqlInjection,
        xssAttacks,
        rceAttacks,
        botTraffic,
        pathTraversal,
        abnormalUA,
        geoAnalysis,
        assetAnalysis,
        totalEvents: logEntries.length,
        timeRange: timeRange_result,
      };
    } catch (error) {
      console.error('❌ Cloudflare WAF 風險分析失敗:', error);
      throw error;
    }
  }

  // 解析 Cloudflare 日誌（使用 cloudflare-field-mapping）
  parseCloudflareLog(rawLog) {
    // 處理時間戳記（支援多種格式）
    const rawTimestamp =
      rawLog[this.fieldMapping.edge_start_timestamp.elk_field];
    let timestamp;

    if (typeof rawTimestamp === 'number') {
      // Unix Timestamp（毫秒）
      timestamp = new Date(rawTimestamp).toISOString();
    } else if (typeof rawTimestamp === 'string') {
      // ISO 8601 格式
      timestamp = new Date(rawTimestamp).toISOString();
    } else {
      // 預設使用當前時間
      timestamp = new Date().toISOString();
    }

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

      // 安全相關欄位（新增）
      securityAction: rawLog[this.fieldMapping.security_action.elk_field],
      securityActions:
        rawLog[this.fieldMapping.security_actions.elk_field] || [],
      securityRule: rawLog[this.fieldMapping.security_rule_id.elk_field],
      securityRuleDescription:
        rawLog[this.fieldMapping.security_rule_description.elk_field],
      securityRuleIDs:
        rawLog[this.fieldMapping.security_rule_ids.elk_field] || [],
      securitySources:
        rawLog[this.fieldMapping.security_sources.elk_field] || [],

      // 資產相關
      zoneName: rawLog[this.fieldMapping.zone_name.elk_field],
      edgeHost: rawLog[this.fieldMapping.client_request_host.elk_field],

      // 時間戳記（已格式化為 ISO 8601）
      timestamp: timestamp,
    };
  }

  /**
   * 計算時間範圍（混合方案：同時返回預期和實際時間範圍）
   * @param {string|object} timeRangeParam - 使用者選擇的時間範圍（如 "24h" 或 {start, end}）
   * @param {array} logEntries - 日誌條目
   * @returns {object} 完整的時間範圍資訊
   */
  calculateTimeRangeWithFallback(timeRangeParam, logEntries) {
    // 1. 計算預期的時間範圍（基於使用者選擇）
    let expectedStart, expectedEnd;

    if (typeof timeRangeParam === 'string') {
      // 預設時間範圍（如 "24h", "7d"）
      expectedEnd = new Date();

      const timeRangeMapping = {
        '1h': 1 * 60 * 60 * 1000,
        '6h': 6 * 60 * 60 * 1000,
        '12h': 12 * 60 * 60 * 1000,
        '24h': 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000,
      };

      const duration = timeRangeMapping[timeRangeParam] || 24 * 60 * 60 * 1000;
      expectedStart = new Date(expectedEnd.getTime() - duration);
    } else if (timeRangeParam && timeRangeParam.start && timeRangeParam.end) {
      // 自定義時間範圍
      expectedStart = new Date(timeRangeParam.start);
      expectedEnd = new Date(timeRangeParam.end);
    } else {
      // Fallback：預設 24 小時
      expectedEnd = new Date();
      expectedStart = new Date(expectedEnd.getTime() - 24 * 60 * 60 * 1000);
    }

    // 2. 計算實際日誌時間範圍
    const timestamps = logEntries
      .map((log) => log.timestamp)
      .filter((t) => t)
      .map((t) => new Date(t).getTime())
      .filter((t) => !isNaN(t));

    let actualStart = null;
    let actualEnd = null;

    if (timestamps.length > 0) {
      actualStart = new Date(Math.min(...timestamps)).toISOString();
      actualEnd = new Date(Math.max(...timestamps)).toISOString();
    }

    // 3. 返回完整的時間範圍資訊
    return {
      // 用於顯示的時間範圍（優先使用預期時間）
      display: {
        start: expectedStart.toISOString(),
        end: expectedEnd.toISOString(),
      },
      // 預期的時間範圍（基於使用者選擇）
      expected: {
        start: expectedStart.toISOString(),
        end: expectedEnd.toISOString(),
      },
      // 實際日誌的時間範圍（如果有日誌）
      actual:
        actualStart && actualEnd
          ? {
              start: actualStart,
              end: actualEnd,
            }
          : null,
      // 是否有日誌
      hasLogs: timestamps.length > 0,
      // 日誌數量
      logCount: logEntries.length,
      // 向後兼容：保留舊的 start/end 欄位
      start: expectedStart.toISOString(),
      end: expectedEnd.toISOString(),
    };
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
   * 通用攻擊類型分析函數（增強版 - 包含細分統計）
   * @param {Array} logEntries - 所有日誌條目
   * @param {Function} filterFn - 攻擊類型過濾函數
   * @param {string} scoreField - WAF 分數欄位名稱（如 'wafSQLiScore'）
   * @returns {Object} 攻擊統計資訊
   */
  analyzeAttacksByType(logEntries, filterFn, scoreField) {
    // 過濾出符合條件的日誌
    const filteredLogs = logEntries.filter((log) => {
      if (isCloudflareInternalEndpoint(log.requestURI)) {
        return false;
      }
      return filterFn(log);
    });

    // 細分不同狀態（使用 analyzeThreatLevel）
    const statusCounts = {
      blocked: 0, // block, connectionClose
      challenged: 0, // challenge, jschallenge, managedChallenge
      rateLimited: 0, // rateLimit, l7ddos
      logged: 0, // log (未採取動作)
      allowed: 0, // allow, bypass
      other: 0, // 其他狀態
    };

    filteredLogs.forEach((log) => {
      const analysis = analyzeThreatLevel(log);

      if (analysis.category === 'BLOCKED_ATTACK') {
        statusCounts.blocked++;
      } else if (analysis.category === 'CHALLENGED') {
        statusCounts.challenged++;
      } else if (analysis.category === 'RATE_LIMITED') {
        statusCounts.rateLimited++;
      } else if (
        analysis.category === 'CONFIRMED_ATTACK' &&
        !analysis.isBlocked
      ) {
        statusCounts.logged++;
      } else if (analysis.category === 'BYPASSED_ATTACK') {
        statusCounts.allowed++;
      } else {
        statusCounts.other++;
      }
    });

    return {
      count: filteredLogs.length,
      // 向後兼容的欄位
      blocked: statusCounts.blocked,
      unblocked: statusCounts.logged + statusCounts.allowed,
      highRisk: statusCounts.logged + statusCounts.allowed,
      // 新增：細分狀態統計
      statusCounts: statusCounts,
      challenged: statusCounts.challenged,
      rateLimited: statusCounts.rateLimited,
      logged: statusCounts.logged,
      allowed: statusCounts.allowed,
      // 其他統計
      topIPs: this.getTopIPsWithCountry(filteredLogs, 5),
      topTargets: this.getTopN(filteredLogs, 'requestURI', 10),
      topCountries: this.getTopN(filteredLogs, 'clientCountry', 5),
      affectedAssets: this.groupByZoneName(filteredLogs),
      avgScore: calculateValidAvgScore(filteredLogs, scoreField),
    };
  }

  // 分析 SQL 注入（使用通用函數）
  analyzeSQLInjection(logEntries) {
    return this.analyzeAttacksByType(
      logEntries,
      (log) => {
        // 使用 analyzeThreatLevel 進行完整的多層判斷
        const analysis = analyzeThreatLevel(log);

        // 不是威脅則跳過
        if (!analysis.isThreat) {
          return false;
        }

        // 檢查是否為 SQL 注入類型
        // 方法 1: analyzeThreatLevel 已識別為 SQL 注入
        if (analysis.attackType && analysis.attackType.includes('SQL')) {
          return true;
        }

        // 方法 2: WAF SQLi Score < 20（確定攻擊）
        if (isValidWAFScore(log.wafSQLiScore) && log.wafSQLiScore < 20) {
          return true;
        }

        // 方法 3: SecurityRule 觸發 SQL 相關規則
        if (
          log.securityRule &&
          log.securityRule.toLowerCase().includes('sql')
        ) {
          return true;
        }

        // 方法 4: SecurityRuleDescription 包含 SQL 相關
        if (
          log.securityRuleDescription &&
          log.securityRuleDescription.toLowerCase().includes('sql')
        ) {
          return true;
        }

        return false;
      },
      'wafSQLiScore',
    );
  }

  // 分析 XSS 攻擊（使用通用函數）
  analyzeXSSAttacks(logEntries) {
    return this.analyzeAttacksByType(
      logEntries,
      (log) => {
        const analysis = analyzeThreatLevel(log);
        if (!analysis.isThreat) return false;

        // 檢查是否為 XSS 類型
        if (analysis.attackType && analysis.attackType.includes('XSS'))
          return true;
        if (isValidWAFScore(log.wafXSSScore) && log.wafXSSScore < 20)
          return true;
        if (log.securityRule && log.securityRule.toLowerCase().includes('xss'))
          return true;
        if (
          log.securityRuleDescription &&
          log.securityRuleDescription.toLowerCase().includes('xss')
        )
          return true;
        if (analysis.uriAnalysis && analysis.uriAnalysis.attackType === 'XSS')
          return true;

        return false;
      },
      'wafXSSScore',
    );
  }

  // 分析 RCE 攻擊（使用通用函數）
  analyzeRCEAttacks(logEntries) {
    return this.analyzeAttacksByType(
      logEntries,
      (log) => {
        const analysis = analyzeThreatLevel(log);
        if (!analysis.isThreat) return false;

        // 檢查是否為 RCE 類型
        if (analysis.attackType && analysis.attackType.includes('RCE'))
          return true;
        if (isValidWAFScore(log.wafRCEScore) && log.wafRCEScore < 20)
          return true;
        if (
          log.securityRule &&
          (log.securityRule.toLowerCase().includes('rce') ||
            log.securityRule.toLowerCase().includes('remote code') ||
            log.securityRule.toLowerCase().includes('command'))
        )
          return true;
        if (
          log.securityRuleDescription &&
          (log.securityRuleDescription.toLowerCase().includes('rce') ||
            log.securityRuleDescription.toLowerCase().includes('remote code') ||
            log.securityRuleDescription
              .toLowerCase()
              .includes('command execution'))
        )
          return true;
        if (
          analysis.uriAnalysis &&
          analysis.uriAnalysis.attackType === 'COMMAND_INJECTION'
        )
          return true;

        return false;
      },
      'wafRCEScore',
    );
  }

  // 分析惡意機器人流量
  analyzeBotTraffic(logEntries) {
    // 檢測機器人特徵：User-Agent、請求模式
    const botLogs = logEntries.filter((log) => {
      const ua = (log.userAgent || '').toLowerCase();
      return (
        ua.includes('bot') ||
        ua.includes('crawler') ||
        ua.includes('spider') ||
        ua.includes('python') ||
        ua.includes('curl') ||
        ua.includes('wget')
      );
    });

    return {
      count: botLogs.length,
      topIPs: this.getTopN(botLogs, 'clientIP', 10),
      topCountries: this.getTopN(botLogs, 'clientCountry', 5),
      topASNs: this.getTopN(botLogs, 'clientASN', 5),
      affectedAssets: new Set(
        botLogs.map((log) => log.edgeHost).filter((h) => h),
      ).size,
    };
  }

  // 分析路徑遍歷攻擊
  analyzePathTraversal(logEntries) {
    const pathTraversalLogs = logEntries.filter((log) => {
      const uri = (log.requestURI || '').toLowerCase();
      return (
        uri.includes('../') ||
        uri.includes('..\\') ||
        uri.includes('%2e%2e') ||
        uri.includes('traversal')
      );
    });

    const sensitiveFiles = this.extractSensitiveFiles(pathTraversalLogs);

    return {
      count: pathTraversalLogs.length,
      topIPs: this.getTopN(pathTraversalLogs, 'clientIP', 10),
      sensitiveFiles: sensitiveFiles,
      affectedAssets: new Set(
        pathTraversalLogs.map((log) => log.edgeHost).filter((h) => h),
      ).size,
    };
  }

  // 分析異常 User-Agent
  analyzeAbnormalUA(logEntries) {
    const abnormalUALogs = logEntries.filter((log) => {
      const ua = log.userAgent || '';

      // 空 UA
      if (ua.length === 0) return true;

      // 異常短
      if (ua.length < 10) return true;

      // 異常長
      if (ua.length > 500) return true;

      // 明顯的掃描工具
      const lowerUA = ua.toLowerCase();
      const scanTools = [
        'sqlmap',
        'nmap',
        'nikto',
        'masscan',
        'zap',
        'burp',
        'metasploit',
      ];
      return scanTools.some((tool) => lowerUA.includes(tool));
    });

    return {
      count: abnormalUALogs.length,
      topIPs: this.getTopN(abnormalUALogs, 'clientIP', 10),
      examples: [...new Set(abnormalUALogs.map((log) => log.userAgent))].slice(
        0,
        5,
      ),
      affectedAssets: new Set(
        abnormalUALogs.map((log) => log.edgeHost).filter((h) => h),
      ).size,
    };
  }

  // 分析地理分佈
  analyzeGeoDistribution(logEntries) {
    return {
      topCountries: this.getTopN(logEntries, 'clientCountry', 10),
      topIPs: this.getTopN(logEntries, 'clientIP', 20),
      topASNs: this.getTopN(logEntries, 'clientASN', 10),
    };
  }

  // 分析受影響資產
  analyzeAffectedAssets(logEntries) {
    const assetCounts = this.getTopN(logEntries, 'edgeHost', 20);
    return {
      totalAssets: new Set(
        logEntries.map((log) => log.edgeHost).filter((h) => h),
      ).size,
      topAssets: assetCounts,
    };
  }

  // 提取敏感檔案
  extractSensitiveFiles(logs) {
    const sensitivePatterns = [
      '.env',
      'config',
      '.git',
      'wp-config',
      'web.config',
      'admin',
      '.htaccess',
      '.htpasswd',
      'id_rsa',
      'authorized_keys',
      '.aws',
      '.ssh',
      'database.yml',
      'settings.py',
    ];
    const found = new Set();

    logs.forEach((log) => {
      const uri = log.requestURI || '';
      sensitivePatterns.forEach((pattern) => {
        if (uri.toLowerCase().includes(pattern)) {
          found.add(uri);
        }
      });
    });

    return Array.from(found).slice(0, 15);
  }

  /**
   * 根據 SecurityAction 和阻擋狀態生成動態建議
   * @param {Object} attackData - 攻擊統計資料
   * @param {string} attackType - 攻擊類型（如 'SQL 注入'）
   * @param {string} wafRuleSet - WAF 規則集名稱
   * @returns {Object} 包含 protectionStatus 和 recommendations 的物件
   */
  generateDynamicRecommendations(attackData, attackType, wafRuleSet = '') {
    const {
      blocked = 0,
      challenged = 0,
      logged = 0,
      unblocked = 0,
      count = 0,
    } = attackData;

    // 計算阻擋率和挑戰率
    const blockedRate = count > 0 ? blocked / count : 0;
    const challengedRate = count > 0 ? challenged / count : 0;
    const unblockedRate = count > 0 ? unblocked / count : 0;

    let protectionStatus = '';
    let recommendations = [];

    // 情境 1: 全部被阻擋（100%）
    if (blockedRate === 1) {
      protectionStatus = `Cloudflare WAF 已成功阻擋所有 ${count} 次 ${attackType} 攻擊`;
      recommendations = [
        {
          title: '防護規則已生效 - 持續監控',
          description: `Cloudflare WAF 已成功阻擋所有 ${count} 次 ${attackType} 攻擊嘗試，防護規則運作正常。建議持續監控攻擊趨勢，觀察阻擋量是否上升，評估是否為組織性攻擊或隨機掃描`,
          priority: 'medium',
        },
        {
          title: '分析攻擊模式',
          description: `檢視被阻擋的 ${attackType} 攻擊手法與來源。前往 Cloudflare Dashboard → Security → Events 查看攻擊詳情，評估是否需要調整 WAF Score 閾值或建立額外的 Custom Rules`,
          priority: 'low',
        },
        {
          title: '評估 WAF Score 閾值設定',
          description: `目前 ${attackType} 防護的 WAF Score 閾值有效，建議保持當前設定。若未來攻擊量上升，可考慮進一步強化閾值`,
          priority: 'low',
        },
      ];
    }
    // 情境 2: 大部分被阻擋（80%-99%）
    else if (blockedRate >= 0.8 && blockedRate < 1) {
      protectionStatus = `Cloudflare WAF 已阻擋 ${blocked} 次 ${attackType} 攻擊，${unblocked} 次未阻擋`;
      recommendations = [
        {
          title: '強化防護規則 - 減少通過率',
          description: `目前仍有 ${unblocked} 次 ${attackType} 攻擊未被阻擋（通過率 ${(unblockedRate * 100).toFixed(1)}%）。建議${wafRuleSet ? `強化 Cloudflare WAF 的 ${wafRuleSet}，` : ''}調整 WAF Attack Score 閾值以提高阻擋率。前往 Security → WAF → Custom rules 建立更嚴格的規則`,
          priority: 'high',
        },
        {
          title: '持續監控已阻擋攻擊',
          description: `Cloudflare WAF 已成功阻擋 ${blocked} 次攻擊（阻擋率 ${(blockedRate * 100).toFixed(1)}%），防護規則基本有效。建議持續觀察阻擋量是否上升，並分析未被阻擋的請求特徵`,
          priority: 'medium',
        },
        {
          title: '封鎖高頻攻擊來源',
          description: `針對重複發起攻擊的 IP 地址，使用 Cloudflare IP Lists 建立黑名單。前往 Account Home → Configurations → Lists 建立 IP list，然後在 Custom rules 中使用 (ip.src in $blocked_ips) 表達式阻擋`,
          priority: 'medium',
        },
      ];
    }
    // 情境 3: 大部分被挑戰（50%-80% challenged）
    else if (challengedRate >= 0.5) {
      protectionStatus = `Cloudflare 已對 ${challenged} 次 ${attackType} 請求發出挑戰，${blocked} 次已阻擋，${unblocked} 次未阻擋`;
      recommendations = [
        {
          title: '評估挑戰有效性',
          description: `目前有 ${challenged} 次請求（${(challengedRate * 100).toFixed(1)}%）處於挑戰狀態。建議檢視挑戰通過率，評估挑戰是否有效阻止攻擊。若挑戰通過率過高，建議調整為直接阻擋（block）以提高防護效果`,
          priority: 'high',
        },
        {
          title: '強化防護規則',
          description: `建議${wafRuleSet ? `啟用或強化 ${wafRuleSet}，` : ''}將 WAF Score 閾值調整為更嚴格的設定。考慮將挑戰（challenge）改為阻擋（block）以提供更強的防護`,
          priority: 'high',
        },
        {
          title: '分析挑戰結果',
          description: `前往 Cloudflare Dashboard → Security → Events 查看挑戰的結果統計，分析哪些請求通過了挑戰，評估是否為合法流量或攻擊繞過`,
          priority: 'medium',
        },
      ];
    }
    // 情境 4: 大部分未被阻擋（< 80% blocked）
    else {
      const totalUnprotected = unblocked + (challenged || 0);
      protectionStatus = `⚠️ 警告：${totalUnprotected} 次 ${attackType} 攻擊未被有效阻擋，僅 ${blocked} 次被阻擋（阻擋率 ${(blockedRate * 100).toFixed(1)}%）`;
      recommendations = [
        {
          title: `立即啟用 ${attackType} 防護規則`,
          description: `⚠️ 緊急：目前有 ${totalUnprotected} 次 ${attackType} 攻擊未被有效阻擋（通過率 ${((totalUnprotected / count) * 100).toFixed(1)}%），防護力度不足。建議${wafRuleSet ? `立即啟用或強化 Cloudflare WAF 的 ${wafRuleSet}，` : ''}並將防護模式設定為阻擋（Block）。前往 Security → WAF → Managed rules 啟用相關規則集`,
          priority: 'high',
        },
        {
          title: '緊急封鎖攻擊來源',
          description: `立即在 Cloudflare WAF 中使用 IP Lists 封鎖主要攻擊來源 IP。前往 Account Home → Configurations → Lists 建立 IP list，然後在 Security → WAF → Custom rules 中配置封鎖規則`,
          priority: 'high',
        },
        {
          title: '配置 WAF Score 阻擋規則',
          description: `建立 Custom Rule 使用 Attack Score 阻擋高風險請求。表達式範例：(cf.waf.score.sqli le 20) or (cf.waf.score.xss le 20) or (cf.waf.score.rce le 20)。將 Action 設定為 Block`,
          priority: 'high',
        },
        {
          title: '檢查應用層防護',
          description: `檢查後端應用程式的輸入驗證和安全防護機制，確保即使攻擊通過 WAF，應用層也能有效防護。實施縱深防禦策略`,
          priority: 'high',
        },
      ];
    }

    return { protectionStatus, recommendations };
  }

  // 生成 AI 分析 Prompt（基於新的判斷流程）
  generateAIPrompt(elkData) {
    // 依照需求：userPrompt 移除上半部「分析描述」，移除 analysisData
    // 改為直接提供 ELK 原始資料（minify JSON stringify），保留下半部「輸出格式要求」
    const promptTemplate = `
### 【ELK 原始日誌資料】

${JSON.stringify(elkData)}

---

### 【輸出格式要求】

請生成 **嚴格的 JSON 格式** 風險報告：

\`\`\`json
{
  "risks": [
    {
      "id": "攻擊類型-唯一識別碼",
      "title": "攻擊標題",
      "severity": "critical | high | medium | low",
      "openIssues": 未阻擋的攻擊次數,
      "resolvedIssues": 已阻擋的攻擊次數,
      "affectedAssets": 受影響資產數量,
      "tags": ["標籤陣列"],
      "description": "詳細描述",
      "aiInsight": "AI 深度分析（必須包含具體數字、時間範圍、WAF 分數、來源、目標）",
      "createdDate": "YYYY-MM-DD",
      "updatedDate": "YYYY-MM-DD",
      "exploitInWild": true | false,
      "internetExposed": true,
      "confirmedExploitable": true | false,
      "cveId": null,
      "recommendations": [
        {
          "title": "建議標題",
          "description": "詳細建議（150-200字）",
          "priority": "high | medium | low"
        }
      ]
    }
  ]
}
\`\`\`

---

### 【輸出規則】

1. ⚠️ **已阻擋 vs 未阻擋**：
   - 已阻擋（block）：severity = "low"，openIssues = 0，resolvedIssues = 已阻擋次數
   - 未阻擋（log）：severity = "critical" 或 "high"，openIssues = 未阻擋次數

2. ⚠️ **時間格式**：
   - createdDate 和 updatedDate 必須使用日誌實際時間範圍（台灣時間 UTC+8）
   - 建議格式：YYYY-MM-DD 或 ISO 8601

3. ⚠️ **AI Insight 必須包含**：
   - 時間範圍（台灣時間）
   - 總攻擊次數
   - 已阻擋 vs 未阻擋次數
   - WAF 分數統計
   - Top 5 來源 IP 和國家
   - 受影響資產

4. ⚠️ **建議（Recommendations）動態生成規則**：
   
   **根據阻擋狀態動態調整建議內容：**
   
   a. **如果攻擊全部被阻擋（blocked = 100%）→**
      - 建議標題：「防護規則已生效 - 持續監控」
      - 建議內容：「Cloudflare WAF 已成功阻擋所有 X 次攻擊嘗試，防護規則運作正常。建議持續監控攻擊趨勢，觀察阻擋量是否上升」
      - 優先級：medium 或 low
   
   b. **如果攻擊大部分被阻擋（blocked >= 80%）→**
      - 建議標題：「強化防護規則 - 減少通過率」
      - 建議內容：「目前仍有 Y 次攻擊未被阻擋（通過率 Z%），建議強化 WAF 規則，調整 WAF Score 閾值以提高阻擋率」
      - 優先級：high 或 medium
   
   c. **如果攻擊大部分被挑戰（challenged >= 50%）→**
      - 建議標題：「評估挑戰有效性」
      - 建議內容：「目前有 X 次請求處於挑戰狀態（Y%），建議檢視挑戰通過率，評估是否需要調整為直接阻擋（block）」
      - 優先級：high
   
   d. **如果攻擊大部分未被阻擋（blocked < 80%）→**
      - 建議標題：「立即啟用防護規則」
      - 建議內容：「⚠️ 緊急：目前有 X 次攻擊未被有效阻擋（通過率 Y%），建議立即啟用或強化 Cloudflare WAF 規則，並將防護模式設定為阻擋（Block）」
      - 優先級：high 或 critical
   
   **⚠️ 重要禁止事項：**
   - **禁止在攻擊已被阻擋的情況下（blocked >= 80%），建議「立即啟用」防護規則，這是邏輯矛盾**
   - **禁止在攻擊全部被阻擋時（blocked = 100%），使用 high 或 critical severity**
   - **禁止編造任何不存在於【攻擊統計】中的數據**：包括 WAF Score、IP 地址、簽章 ID 等
   - **禁止使用模糊語言**：避免「可能」、「或許」、「建議檢查」等不確定性描述

5. ⚠️ **CVE 編號**：一律設為 null

---

請以繁體中文回答，**務必輸出純 JSON 格式**，不要有 markdown 或其他格式符號。
`;

    return promptTemplate.trim();
  }

  // 生成 Fallback 風險資料（AI 解析失敗時使用）
  generateFallbackRisks(analysisData) {
    const risks = [];
    const {
      sqlInjection,
      xssAttacks,
      rceAttacks,
      botTraffic,
      pathTraversal,
      abnormalUA,
      assetAnalysis,
      timeRange,
    } = analysisData;

    // 格式化時間（使用日誌實際時間範圍，台灣時區 UTC+8）
    const formatDate = (isoString) => {
      const date = new Date(isoString);
      return date.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Taipei',
      });
    };

    // 根據實際資料生成基本風險項目
    if (sqlInjection.count > 0) {
      const topCountry = sqlInjection.topCountries[0];
      const topIP = sqlInjection.topIPs[0];

      // 使用動態建議生成器
      const { protectionStatus, recommendations: dynamicRecommendations } =
        this.generateDynamicRecommendations(
          sqlInjection,
          'SQL 注入',
          'SQL 注入防護規則集（Cloudflare Managed Ruleset + OWASP Core Ruleset）',
        );

      // 根據阻擋狀態動態判定 severity
      const blockedRate = sqlInjection.blocked / sqlInjection.count;
      let severity;
      if (blockedRate === 1) {
        severity = 'low'; // 全部阻擋
      } else if (blockedRate >= 0.8) {
        severity = 'medium'; // 大部分阻擋
      } else if (sqlInjection.highRisk > 50) {
        severity = 'critical'; // 高風險且大部分未阻擋
      } else {
        severity = 'high';
      }

      // 構建基本建議（封鎖 IP、輸入驗證、WAF Score 規則）
      const basicRecommendations = [
        {
          title: topIP?.item ? `封鎖來源 IP ${topIP.item}` : '封鎖攻擊來源 IP',
          description: topIP?.item
            ? `在 Cloudflare WAF 中封鎖 ${topIP.item}（來自 ${topIP.country || '未知'}），該 IP 已發起 ${topIP.count} 次 SQL 注入攻擊。使用 IP Lists 功能建立黑名單：Account Home → Configurations → Lists`
            : '在 Cloudflare WAF 中封鎖攻擊來源 IP',
          priority: 'high',
        },
        {
          title: '強化輸入驗證與參數檢查',
          description:
            '對所有輸入參數實施嚴格的白名單檢查，並使用參數化查詢防止 SQL 注入。在 Cloudflare 中使用 Custom Rules 配置 HTTP Headers 驗證和 Cookie 驗證，限制敏感 API 端點的訪問',
          priority: 'medium',
        },
        {
          title: '配置 WAF Score 阻擋規則',
          description: `建立 Custom Rule 使用 Attack Score 阻擋高風險 SQL 注入請求。表達式：(cf.waf.score.sqli le 20)，Action：Block。平均 WAF 分數為 ${sqlInjection.avgScore}`,
          priority: 'medium',
        },
      ];

      risks.push({
        id: `sql-injection-${Date.now()}`,
        title: 'SQL 注入攻擊檢測',
        severity: severity,
        openIssues: sqlInjection.unblocked || 0,
        resolvedIssues: sqlInjection.blocked || 0,
        affectedAssets: sqlInjection.affectedAssets?.length || 0,
        tags:
          sqlInjection.highRisk > 0
            ? ['Internet Exposed', 'Confirmed Exploitable']
            : ['Internet Exposed'],
        description: `檢測到 ${sqlInjection.count} 次 SQL 注入攻擊嘗試，其中 ${sqlInjection.blocked || 0} 次已被阻擋，${sqlInjection.unblocked || 0} 次未被阻擋。主要來源國家：${sqlInjection.topCountries
          .slice(0, 3)
          .map((c) => c.item)
          .join('、')}。`,
        aiInsight: `在時間範圍 ${formatDate(timeRange.start)} ~ ${formatDate(timeRange.end)} 內檢測到 ${sqlInjection.count} 次 SQL 注入嘗試，其中 ${sqlInjection.highRisk} 次屬於高風險級別（WAF 分數 < 20）。${protectionStatus}。主要攻擊來自 ${topCountry?.item || '未知'}（${topCountry?.count || 0} 次），Top 攻擊 IP 為 ${topIP?.item || '未知'}（${topIP?.count || 0} 次，來自 ${topIP?.country || '未知'}）。平均 WAF 分數為 ${sqlInjection.avgScore}。`,
        createdDate: formatDate(timeRange.start),
        updatedDate: formatDate(timeRange.end),
        exploitInWild: sqlInjection.highRisk > 0,
        internetExposed: true,
        confirmedExploitable: sqlInjection.highRisk > 0,
        cveId: null,
        recommendations: [...dynamicRecommendations, ...basicRecommendations],
      });
    }

    if (xssAttacks.count > 0) {
      const topCountry = xssAttacks.topCountries[0];
      const topIP = xssAttacks.topIPs[0];

      // 使用動態建議生成器
      const { protectionStatus, recommendations: dynamicRecommendations } =
        this.generateDynamicRecommendations(
          xssAttacks,
          'XSS 攻擊',
          'XSS 防護規則集（Cloudflare Managed Ruleset + OWASP Core Ruleset）',
        );

      // 根據阻擋狀態動態判定 severity
      const blockedRate = xssAttacks.blocked / xssAttacks.count;
      let severity;
      if (blockedRate === 1) {
        severity = 'low';
      } else if (blockedRate >= 0.8) {
        severity = 'medium';
      } else if (xssAttacks.highRisk > 30) {
        severity = 'high';
      } else {
        severity = 'medium';
      }

      // 構建基本建議
      const basicRecommendations = [
        {
          title: topIP?.item ? `封鎖來源 IP ${topIP.item}` : '封鎖攻擊來源 IP',
          description: topIP?.item
            ? `在 Cloudflare WAF 中封鎖 ${topIP.item}（來自 ${topIP?.country || '未知'}），該 IP 已發起 ${topIP.count} 次 XSS 攻擊`
            : '在 Cloudflare WAF 中封鎖攻擊來源 IP',
          priority: 'high',
        },
        {
          title: '強化輸入驗證與 XSS 防護',
          description:
            '配置 Cloudflare WAF 的 XSS 防護規則，使用 Custom Rules 過濾包含 <script>、javascript: 等危險字符的請求。同時在應用層實施輸入過濾和輸出編碼，啟用 Content Security Policy (CSP) Headers',
          priority: 'high',
        },
        {
          title: '配置 WAF Score 阻擋規則',
          description: `建立 Custom Rule 使用 Attack Score 阻擋高風險 XSS 請求。表達式：(cf.waf.score.xss le 20)，Action：Block。平均 WAF 分數為 ${xssAttacks.avgScore}`,
          priority: 'medium',
        },
      ];

      risks.push({
        id: `xss-attack-${Date.now()}`,
        title: 'XSS 攻擊檢測',
        severity: severity,
        openIssues: xssAttacks.unblocked || 0,
        resolvedIssues: xssAttacks.blocked || 0,
        affectedAssets: xssAttacks.affectedAssets?.length || 0,
        tags: ['Internet Exposed', 'Confirmed Exploitable'],
        description: `檢測到 ${xssAttacks.count} 次跨站腳本攻擊嘗試，其中 ${xssAttacks.blocked || 0} 次已被阻擋，${xssAttacks.unblocked || 0} 次未被阻擋。`,
        aiInsight: `在時間範圍 ${formatDate(timeRange.start)} ~ ${formatDate(timeRange.end)} 內檢測到 ${xssAttacks.count} 次 XSS 攻擊嘗試，其中 ${xssAttacks.highRisk} 次屬於高風險級別（WAF 分數 < 20）。${protectionStatus}。主要攻擊來自 ${topCountry?.item || '未知'}（${topCountry?.count || 0} 次），Top IP 為 ${topIP?.item || '未知'}（來自 ${topIP?.country || '未知'}）。平均 WAF 分數為 ${xssAttacks.avgScore}。`,
        createdDate: formatDate(timeRange.start),
        updatedDate: formatDate(timeRange.end),
        exploitInWild: false,
        internetExposed: true,
        confirmedExploitable: xssAttacks.highRisk > 0,
        cveId: null,
        recommendations: [...dynamicRecommendations, ...basicRecommendations],
      });
    }

    if (rceAttacks && rceAttacks.count > 0) {
      const topCountry = rceAttacks.topCountries?.[0];
      const topIP = rceAttacks.topIPs?.[0];

      // 使用動態建議生成器
      const { protectionStatus, recommendations: dynamicRecommendations } =
        this.generateDynamicRecommendations(
          rceAttacks,
          'RCE 攻擊',
          'RCE 防護規則集（Cloudflare Managed Ruleset + OWASP Core Ruleset）',
        );

      // 根據阻擋狀態動態判定 severity（RCE 是最嚴重的攻擊）
      const blockedRate = rceAttacks.blocked / rceAttacks.count;
      let severity;
      if (blockedRate === 1) {
        severity = 'medium'; // 全部阻擋但仍需警惕
      } else if (blockedRate >= 0.8) {
        severity = 'high'; // 大部分阻擋
      } else {
        severity = 'critical'; // 大部分未阻擋
      }

      // 構建基本建議
      const basicRecommendations = [
        {
          title: topIP?.item
            ? `緊急封鎖來源 IP ${topIP.item}`
            : '緊急封鎖攻擊來源 IP',
          description: topIP?.item
            ? `⚠️ 緊急！立即在 Cloudflare WAF 和防火牆中封鎖 ${topIP.item}（來自 ${topIP?.country || '未知'}），該 IP 已發起 ${topIP.count} 次 RCE 攻擊，阻止進一步的攻擊嘗試`
            : '⚠️ 緊急！立即在 Cloudflare WAF 中封鎖攻擊來源 IP',
          priority: 'high',
        },
        {
          title: '緊急安全檢查',
          description:
            '立即檢查受影響端點的代碼執行邏輯和輸入驗證，確認是否存在未修補的 RCE 漏洞。此類攻擊已被確認在野外利用',
          priority: 'high',
        },
        {
          title: '配置 WAF Score 阻擋規則',
          description: `建立 Custom Rule 使用 Attack Score 阻擋高風險 RCE 請求。表達式：(cf.waf.score.rce le 20)，Action：Block。平均 WAF 分數為 ${rceAttacks.avgScore}`,
          priority: 'high',
        },
      ];

      risks.push({
        id: `rce-attack-${Date.now()}`,
        title: 'RCE 遠程代碼執行攻擊檢測',
        severity: severity,
        openIssues: rceAttacks.unblocked || 0,
        resolvedIssues: rceAttacks.blocked || 0,
        affectedAssets: rceAttacks.affectedAssets?.length || 0,
        tags: ['Critical', 'Internet Exposed', 'Confirmed Exploitable'],
        description: `⚠️ 嚴重警告：檢測到 ${rceAttacks.count} 次遠程代碼執行攻擊嘗試，其中 ${rceAttacks.blocked || 0} 次已被阻擋，${rceAttacks.unblocked || 0} 次未被阻擋。`,
        aiInsight: `⚠️ 嚴重警告：在時間範圍 ${formatDate(timeRange.start)} ~ ${formatDate(timeRange.end)} 內檢測到 ${rceAttacks.count} 次遠程代碼執行（RCE）攻擊嘗試，其中 ${rceAttacks.highRisk} 次屬於極高風險級別（WAF 分數 < 20）。${protectionStatus}。主要攻擊來自 ${topCountry?.item || '未知'}（${topCountry?.count || 0} 次），Top IP 為 ${topIP?.item || '未知'}（來自 ${topIP?.country || '未知'}）。平均 WAF 分數為 ${rceAttacks.avgScore}。此類攻擊已被確認在野外利用。`,
        createdDate: formatDate(timeRange.start),
        updatedDate: formatDate(timeRange.end),
        exploitInWild: true,
        internetExposed: true,
        confirmedExploitable: true,
        cveId: null,
        recommendations: [...dynamicRecommendations, ...basicRecommendations],
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
        aiInsight: `在時間範圍 ${formatDate(timeRange.start)} ~ ${formatDate(timeRange.end)} 內檢測到大量機器人流量，建議啟用 Cloudflare Bot Management 進行防護。`,
        createdDate: formatDate(timeRange.start),
        updatedDate: formatDate(timeRange.end),
        exploitInWild: false,
        internetExposed: true,
        confirmedExploitable: false,
        cveId: null,
        recommendations: [
          {
            title: '啟用 Cloudflare Bot Management',
            description: '配置機器人管理功能以識別和阻擋惡意機器人',
            priority: 'medium',
          },
        ],
      });
    }

    return { risks };
  }

  // 按 ZoneName 分組受影響資產（新增）
  groupByZoneName(logs) {
    const zoneMap = new Map();

    logs.forEach((log) => {
      const zoneName = log.zoneName || log.edgeHost || 'Unknown';
      const uri = log.requestURI || '/';

      if (!zoneMap.has(zoneName)) {
        zoneMap.set(zoneName, {
          zoneName: zoneName,
          attackCount: 0,
          uniqueIPs: new Set(),
          targetURIs: new Set(),
          blockedCount: 0,
          unblockedCount: 0,
        });
      }

      const zone = zoneMap.get(zoneName);
      const analysis = analyzeThreatLevel(log);

      zone.attackCount++;
      zone.uniqueIPs.add(log.clientIP);
      zone.targetURIs.add(uri);

      if (analysis.isBlocked) {
        zone.blockedCount++;
      } else {
        zone.unblockedCount++;
      }
    });

    // 轉換為陣列並排序
    return Array.from(zoneMap.values())
      .map((zone) => ({
        zoneName: zone.zoneName,
        attackCount: zone.attackCount,
        blockedCount: zone.blockedCount,
        unblockedCount: zone.unblockedCount,
        uniqueIPs: zone.uniqueIPs.size,
        targetURIs: Array.from(zone.targetURIs).slice(0, 10),
      }))
      .sort((a, b) => b.attackCount - a.attackCount);
  }

  // 獲取 Top IP 的詳細統計（包含國家）（新增）
  getTopIPsWithCountry(logs, n = 5) {
    const ipMap = new Map();

    logs.forEach((log) => {
      const ip = log.clientIP;
      const country = log.clientCountry || 'Unknown';

      if (!ip) return;

      if (!ipMap.has(ip)) {
        ipMap.set(ip, {
          ip: ip,
          count: 0,
          country: country,
          targetURIs: new Set(),
          attackTypes: new Set(),
        });
      }

      const ipData = ipMap.get(ip);
      ipData.count++;
      ipData.targetURIs.add(log.requestURI);

      // 識別攻擊類型
      const analysis = analyzeThreatLevel(log);
      if (analysis.attackType) {
        ipData.attackTypes.add(analysis.attackType);
      }
    });

    return Array.from(ipMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, n)
      .map((ipData) => ({
        item: ipData.ip, // 保持與 getTopN 格式一致
        count: ipData.count,
        country: ipData.country,
        targetURIs: Array.from(ipData.targetURIs).slice(0, 5),
        attackTypes: Array.from(ipData.attackTypes),
      }));
  }

  // 工具方法：取得 Top N
  getTopN(logs, field, n) {
    const counts = new Map();
    logs.forEach((log) => {
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
      .map((log) => log[field])
      .filter((v) => v !== undefined && v !== null && !isNaN(v));

    if (values.length === 0) return 'N/A';
    return (values.reduce((sum, v) => sum + v, 0) / values.length).toFixed(2);
  }

  // 空結果
  getEmptyAnalysisResult() {
    return {
      elkData: { hits: [] },
      sqlInjection: {
        count: 0,
        highRisk: 0,
        topIPs: [],
        topTargets: [],
        topCountries: [],
        affectedAssets: 0,
        avgScore: 'N/A',
      },
      xssAttacks: {
        count: 0,
        highRisk: 0,
        topIPs: [],
        topTargets: [],
        topCountries: [],
        affectedAssets: 0,
        avgScore: 'N/A',
      },
      rceAttacks: {
        count: 0,
        highRisk: 0,
        topIPs: [],
        topTargets: [],
        topCountries: [],
        affectedAssets: 0,
        avgScore: 'N/A',
      },
      botTraffic: {
        count: 0,
        topIPs: [],
        topCountries: [],
        topASNs: [],
        affectedAssets: 0,
      },
      pathTraversal: {
        count: 0,
        topIPs: [],
        sensitiveFiles: [],
        affectedAssets: 0,
      },
      abnormalUA: { count: 0, topIPs: [], examples: [], affectedAssets: 0 },
      geoAnalysis: { topCountries: [], topIPs: [], topASNs: [] },
      assetAnalysis: { totalAssets: 0, topAssets: [] },
      totalEvents: 0,
      timeRange: {
        start: new Date().toISOString(),
        end: new Date().toISOString(),
      },
    };
  }
}

module.exports = CloudflareWAFRiskService;
