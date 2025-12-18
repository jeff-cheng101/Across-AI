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
  analyzeLogEntry,
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
      const elkData = await this.elkClient.queryElasticsearch(timeRange, {
        indexPattern: this.elkConfig.index,
      });

      if (!elkData.hits || elkData.hits.length === 0) {
        console.log('⚠️ 未找到日誌資料');
        return this.getEmptyAnalysisResult();
      }

      // Step 2: 解析 F5 日誌（使用更新的欄位對應）
      console.log(`\n⭐ Step 2: 解析 ${elkData.hits.length} 筆日誌...`);
      const logEntries = elkData.hits.map((hit) => this.parseF5Log(hit.source));
      console.log(`✅ 成功解析 ${logEntries.length} 筆日誌`);

      // 診斷：顯示前 3 筆日誌的 IP 和國家資訊
      console.log('\n📊 IP 地理位置診斷（前 3 筆）:');
      logEntries.slice(0, 3).forEach((log, index) => {
        console.log(
          `  ${index + 1}. IP: ${log.clientIP} → 國家: ${log.clientCountry} (來源: ${log.clientCountrySource})`,
        );
      });

      // 統計國家來源分佈
      const countrySources = {};
      logEntries.forEach((log) => {
        const source = log.clientCountrySource || 'unknown';
        countrySources[source] = (countrySources[source] || 0) + 1;
      });
      console.log('\n📊 國家資訊來源統計:');
      Object.entries(countrySources).forEach(([source, count]) => {
        console.log(
          `  - ${source}: ${count} 筆 (${((count / logEntries.length) * 100).toFixed(1)}%)`,
        );
      });

      // Step 3: 使用多層次判斷模型分析攻擊
      console.log('\n⭐ Step 3: 使用多層次判斷模型分析攻擊...');
      const analysisResults = logEntries.map((log) => analyzeLogEntry(log));

      // 過濾出真實攻擊
      const realAttacks = analysisResults.filter((result) => result.isAttack);
      console.log(
        `   檢測到 ${realAttacks.length} 個真實攻擊（共 ${logEntries.length} 筆日誌）`,
      );

      // 統計各類型攻擊
      const sqlInjection = this.analyzeSQLInjectionEnhanced(
        logEntries,
        realAttacks,
      );
      const xssAttacks = this.analyzeXSSAttacksEnhanced(
        logEntries,
        realAttacks,
      );
      const commandExecution = this.analyzeCommandExecutionEnhanced(
        logEntries,
        realAttacks,
      );
      const pathTraversal = this.analyzePathTraversalEnhanced(
        logEntries,
        realAttacks,
      );
      const botTraffic = this.analyzeBotTrafficEnhanced(
        logEntries,
        realAttacks,
      );
      const informationLeakage = this.analyzeInformationLeakageEnhanced(
        logEntries,
        realAttacks,
      );
      const sessionAttacks = this.analyzeSessionAttacksEnhanced(
        logEntries,
        realAttacks,
      );
      const otherAttacks = this.analyzeOtherAttacksEnhanced(
        logEntries,
        realAttacks,
      );

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

      console.log('\n✅ ===== F5 WAF 風險分析完成 =====\n');

      return {
        elkData,
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
        timeRange: timeRange_result,
      };
    } catch (error) {
      console.error('❌ F5 WAF 風險分析失敗:', error);
      throw error;
    }
  }

  // 解析 F5 日誌（更新為使用 f5FieldMapping.js 的欄位）
  parseF5Log(rawLog) {
    // 從 geoip 物件中提取國家資訊（增強版：加入驗證和 fallback）
    let countryName =
      rawLog.geoip?.country_name || rawLog.geoip?.country_code2 || null;

    let countrySource = 'geoip';
    const clientIP = rawLog[this.fieldMapping.client_ip.elk_field];

    // 診斷模式：如果啟用詳細日誌，輸出 geoip 原始結構
    if (process.env.F5_DEBUG_GEOIP === 'true' && rawLog.geoip) {
      console.log(
        `\n🔍 [DEBUG] IP ${clientIP} 的 geoip 原始數據:`,
        JSON.stringify(rawLog.geoip, null, 2),
      );
    }

    // 數據驗證 1：檢查國家名稱是否合理
    if (countryName && (countryName.length > 50 || countryName.length === 0)) {
      console.warn(`⚠️ 異常的國家名稱長度: "${countryName}" (IP: ${clientIP})`);
      if (rawLog.geoip) {
        console.warn(
          `   完整 geoip 數據:`,
          JSON.stringify(rawLog.geoip, null, 2),
        );
      }
      countryName = null;
      countrySource = 'invalid_geoip';
    }

    // 數據驗證 2：檢查是否包含異常字符
    if (countryName && !/^[a-zA-Z\s\-]+$/.test(countryName)) {
      console.warn(
        `⚠️ 國家名稱包含異常字符: "${countryName}" (IP: ${clientIP})`,
      );
      if (rawLog.geoip) {
        console.warn(
          `   完整 geoip 數據:`,
          JSON.stringify(rawLog.geoip, null, 2),
        );
      }
      countryName = null;
      countrySource = 'invalid_geoip';
    }

    // Fallback 1: 嘗試使用 geo_location 欄位
    if (!countryName && rawLog[this.fieldMapping.geo_location?.elk_field]) {
      countryName = rawLog[this.fieldMapping.geo_location?.elk_field];
      countrySource = 'geo_location';
      console.log(
        `ℹ️ 使用 geo_location fallback: ${countryName} (IP: ${clientIP})`,
      );
    }

    // Fallback 2: 嘗試從完整 geoip 物件中尋找其他可用欄位
    if (!countryName && rawLog.geoip) {
      const geoipKeys = Object.keys(rawLog.geoip);
      for (const key of geoipKeys) {
        if (key.toLowerCase().includes('country') && rawLog.geoip[key]) {
          countryName = rawLog.geoip[key];
          countrySource = `geoip.${key}`;
          console.log(
            `ℹ️ 使用 geoip.${key} fallback: ${countryName} (IP: ${clientIP})`,
          );
          break;
        }
      }
    }

    // 最終 fallback：標記為 Unknown
    if (!countryName) {
      countryName = 'Unknown';
      countrySource = 'none';
    }

    // 處理時間戳記（支援 Unix timestamp 和 ISO 8601）
    const rawTimestamp = rawLog[this.fieldMapping.timestamp.elk_field];

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

    return {
      // 基本資訊
      clientIP: clientIP,
      clientPort: rawLog[this.fieldMapping.client_port.elk_field],
      clientCountry: countryName,
      clientCountrySource: countrySource, // 新增：記錄數據來源，方便除錯
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
      webApplicationName:
        rawLog[this.fieldMapping.web_application_name?.elk_field],

      // 時間資訊（使用處理後的 timestamp）
      timestamp: timestamp,
      date_time: rawLog[this.fieldMapping.date_time?.elk_field],

      // 其他資訊
      support_id: rawLog[this.fieldMapping.support_id?.elk_field],
      session_id: rawLog[this.fieldMapping.session_id?.elk_field],
      geoip: rawLog.geoip || rawLog[this.fieldMapping.geoip?.elk_field],
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

  // === 增強版攻擊分析方法（基於 f5Standards.js 的分類）===

  /**
   * 通用攻擊分析函數
   * @param {Array} realAttacks - 已判定的真實攻擊
   * @param {Array} logEntries - 所有日誌條目
   * @param {Function} filterFn - 攻擊類型過濾函數
   * @param {boolean} includeHighRisk - 是否計算高風險數量
   * @returns {Object} 攻擊統計資訊
   */
  analyzeAttacksByType(
    realAttacks,
    logEntries,
    filterFn,
    includeHighRisk = false,
  ) {
    const filteredLogs = realAttacks.filter(filterFn);

    const highRiskLogs = includeHighRisk
      ? filteredLogs.filter(
          (result) =>
            result.severity === 'critical' || result.severity === 'high',
        )
      : [];

    // 從 realAttacks 中獲取原始 log entries
    const filteredLogEntries = filteredLogs
      .map((result) => {
        return logEntries.find(
          (log) =>
            log.clientIP === result.originalData?.client_ip ||
            log.uri === result.originalData?.uri,
        );
      })
      .filter((log) => log);

    // 統計 request_status 分佈
    const requestStatusCounts = {
      blocked: 0,
      passed: 0,
      alerted: 0,
      other: 0,
    };

    filteredLogEntries.forEach((log) => {
      const status = log.request_status?.toLowerCase();
      if (status === 'blocked') {
        requestStatusCounts.blocked++;
      } else if (status === 'passed') {
        requestStatusCounts.passed++;
      } else if (status === 'alerted') {
        requestStatusCounts.alerted++;
      } else {
        requestStatusCounts.other++;
      }
    });

    const result = {
      count: filteredLogs.length,
      topIPs: this.getTopN(filteredLogEntries, 'clientIP', 10),
      topTargets: this.getTopN(filteredLogEntries, 'uri', 10),
      topCountries: this.getTopN(filteredLogEntries, 'clientCountry', 5),
      affectedAssets: new Set(
        filteredLogEntries.map((log) => log.host || log.fqdn).filter((h) => h),
      ).size,
      avgViolationRating: this.calculateAvg(
        filteredLogEntries,
        'violationRating',
      ),
      avgThreatScore: this.calculateAvg(
        filteredLogs.map((l) => ({ threatScore: l.threatScore })),
        'threatScore',
      ),
      topSignatures: this.getTopSignatures(filteredLogEntries, 3),
      requestStatusCounts: requestStatusCounts, // 新增 request_status 統計
      blockedCount: requestStatusCounts.blocked,
      passedCount: requestStatusCounts.passed,
      alertedCount: requestStatusCounts.alerted,
    };

    if (includeHighRisk) {
      result.highRisk = highRiskLogs.length;
    }

    return result;
  }

  // 分析 SQL 注入（使用 F5_ATTACK_TYPE_MAPPING）
  analyzeSQLInjectionEnhanced(logEntries, realAttacks) {
    return this.analyzeAttacksByType(
      realAttacks,
      logEntries,
      (result) => {
        const attackType = result.originalData?.attack_type;
        // 使用 F5_ATTACK_TYPE_MAPPING 判斷
        return (
          attackType &&
          F5_ATTACK_TYPE_MAPPING[attackType]?.name === 'SQL Injection'
        );
      },
      true,
    );
  }

  // 分析 XSS 攻擊（使用 F5_ATTACK_TYPE_MAPPING）
  analyzeXSSAttacksEnhanced(logEntries, realAttacks) {
    return this.analyzeAttacksByType(
      realAttacks,
      logEntries,
      (result) => {
        const attackType = result.originalData?.attack_type;
        return (
          attackType &&
          (F5_ATTACK_TYPE_MAPPING[attackType]?.name ===
            'Cross-Site Scripting' ||
            attackType === 'XSS')
        );
      },
      true,
    );
  }

  // 分析命令執行攻擊（使用 F5_ATTACK_TYPE_MAPPING）
  analyzeCommandExecutionEnhanced(logEntries, realAttacks) {
    return this.analyzeAttacksByType(
      realAttacks,
      logEntries,
      (result) => {
        const attackType = result.originalData?.attack_type;
        return (
          attackType &&
          (F5_ATTACK_TYPE_MAPPING[attackType]?.name === 'Command Execution' ||
            F5_ATTACK_TYPE_MAPPING[attackType]?.name ===
              'Server Side Code Injection')
        );
      },
      true,
    );
  }

  // 分析路徑遍歷（使用 F5_ATTACK_TYPE_MAPPING）
  analyzePathTraversalEnhanced(logEntries, realAttacks) {
    return this.analyzeAttacksByType(
      realAttacks,
      logEntries,
      (result) => {
        const attackType = result.originalData?.attack_type;
        return (
          attackType &&
          (F5_ATTACK_TYPE_MAPPING[attackType]?.name === 'Path Traversal' ||
            attackType === 'Predictable Resource Location')
        );
      },
      false,
    );
  }

  // 分析機器人流量（使用 F5_ATTACK_TYPE_MAPPING）
  analyzeBotTrafficEnhanced(logEntries, realAttacks) {
    return this.analyzeAttacksByType(
      realAttacks,
      logEntries,
      (result) => {
        const attackType = result.originalData?.attack_type;
        return (
          attackType &&
          (F5_ATTACK_TYPE_MAPPING[attackType]?.type === 'BOT' ||
            attackType.toLowerCase().includes('bot'))
        );
      },
      false,
    );
  }

  // 分析資訊洩漏（使用 F5_ATTACK_TYPE_MAPPING）
  analyzeInformationLeakageEnhanced(logEntries, realAttacks) {
    return this.analyzeAttacksByType(
      realAttacks,
      logEntries,
      (result) => {
        const attackType = result.originalData?.attack_type;
        return (
          attackType &&
          (F5_ATTACK_TYPE_MAPPING[attackType]?.name === 'Information Leakage' ||
            F5_ATTACK_TYPE_MAPPING[attackType]?.type === 'MISCONFIGURATION')
        );
      },
      false,
    );
  }

  // 分析會話攻擊（使用 F5_ATTACK_TYPE_MAPPING）
  analyzeSessionAttacksEnhanced(logEntries, realAttacks) {
    return this.analyzeAttacksByType(
      realAttacks,
      logEntries,
      (result) => {
        const attackType = result.originalData?.attack_type;
        return (
          attackType &&
          (F5_ATTACK_TYPE_MAPPING[attackType]?.type === 'AUTHENTICATION' ||
            attackType === 'Brute Force' ||
            attackType === 'Session Hijacking' ||
            attackType === 'Credential Stuffing')
        );
      },
      true,
    );
  }

  // 分析其他攻擊（不在已知分類中的攻擊）
  analyzeOtherAttacksEnhanced(logEntries, realAttacks) {
    const knownAttackTypes = [
      'SQL Injection',
      'XSS',
      'Cross-Site Scripting',
      'Command Execution',
      'Path Traversal',
      'Predictable Resource Location',
      'Information Leakage',
      'Brute Force',
      'Session Hijacking',
      'Credential Stuffing',
      'Server Side Code Injection',
    ];

    return this.analyzeAttacksByType(
      realAttacks,
      logEntries,
      (result) => {
        const attackType = result.originalData?.attack_type;
        if (!attackType) return false;

        // 檢查是否為已知類型
        const isKnownType = knownAttackTypes.some(
          (known) =>
            attackType === known ||
            attackType.toLowerCase().includes(known.toLowerCase()),
        );

        // 檢查是否為 Bot 類型
        const isBotType =
          F5_ATTACK_TYPE_MAPPING[attackType]?.type === 'BOT' ||
          attackType.toLowerCase().includes('bot');

        return !isKnownType && !isBotType;
      },
      false,
    );
  }

  // 分析地理分佈
  analyzeGeoDistribution(logEntries) {
    return {
      topCountries: this.getTopN(logEntries, 'clientCountry', 10),
      topIPs: this.getTopN(logEntries, 'clientIP', 20),
    };
  }

  // 分析受影響資產
  analyzeAffectedAssets(logEntries) {
    const hosts = logEntries
      .map((log) => log.host || log.fqdn)
      .filter((h) => h);
    const assetCounts = this.getTopN(logEntries, 'host', 20);

    return {
      totalAssets: new Set(hosts).size,
      topAssets: assetCounts,
    };
  }

  // 生成 AI Prompt（F5 專用 - 增強版）
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
        2. F5 多層次判斷模型的分析結果（Level 1-4）
        3. F5 特定技術指標（若【攻擊統計】中有 violation_rating 和 sig_ids 數據，則使用；若無則改用多層次判斷模型描述）
        4. 主要攻擊來源（Top 3 國家及其攻擊次數、Top 3 IP 及其攻擊次數）
        5. 主要攻擊目標（Top 3 URL 及其被攻擊次數）
        6. 攻擊特徵分析（使用的攻擊向量、payload 特徵、OWASP 分類）
        7. 具體建議（基於多層次判斷結果的 F5 Advanced WAF 防護措施）
        
        ⚠️ **aiInsight 寫作範例**（使用實際數據填充）：
        
        在 [實際開始時間] 至 [實際結束時間] 期間，F5 Advanced WAF 多層次判斷模型檢測到 [總次數] 次 [攻擊類型] 攻擊嘗試。
        
        【若攻擊統計中有 violation_rating 數據】則寫：
        平均 violation_rating 為 [實際平均值]，其中 [高風險次數] 次為高風險攻擊。
        
        【若攻擊統計中有簽章數據】則寫：
        觸發簽章 [實際簽章ID及次數]。
        
        【若攻擊統計中無上述數據】則改用：
        根據 F5 多層次判斷模型（Level 1: 確定性指標、Level 2: 綜合評分、Level 3: 攻擊類型匹配、Level 4: 行為模式分析）確認為真實攻擊。
        
        Level 3 攻擊類型匹配確認為 [攻擊類型]（OWASP [分類]）。主要攻擊來自 [國家1]（[次數1] 次，IP [實際IP1]）、[國家2]（[次數2] 次，IP [實際IP2]）。攻擊目標集中於 [URL1]（[次數1] 次）、[URL2]（[次數2] 次）。共影響 [資產數] 個資產。建議 [具體的 F5 WAF 防護措施]。
        
        ⚠️ **絕對禁止編造資料**：
        - 所有數字、IP、簽章ID、violation_rating 必須來自上方【攻擊統計】
        - 如果【攻擊統計】中沒有「觸發簽章」資料，請勿編造"觸發簽章 12345、67890"等內容
        - 如果【攻擊統計】中沒有「平均違規評分」，請改用「Level 1-4 判斷模型確認」的描述方式
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
7. ⚠️ **aiInsight 寫作要求**：
   - 具體數字（攻擊總次數、高風險次數、受影響資產數）
   - F5 多層次判斷模型的 Level 1-4 分析結果
   - 若【攻擊統計】中有 violation_rating 或 sig_ids，則使用實際數值；若無則改用「多層次判斷模型確認」描述
   - Top 3 來源國家、Top 3 IP、Top 3 目標 URL（包含次數）
   - **IP 地址必須使用【地理與資產分析】中列出的真實 IP，嚴格禁止使用 1.2.3.4、5.6.7.8、192.168.x.x、10.0.x.x 等測試或私有 IP**
   - 攻擊特徵與 OWASP 分類
   - 基於實際數據的 F5 WAF 具體防護建議
8. 如果沒有攻擊，必須輸出空的 risks 陣列
9. ⚠️ **禁止使用模糊語言**：避免「可能」、「或許」、「建議檢查」等不確定性描述，必須基於實際數據提供明確的分析和建議
10. ⚠️ **禁止編造任何不存在於【攻擊統計】中的數據**：包括簽章ID、violation_rating閾值、IP地址等
11. ⚠️ **根據 request_status 動態調整建議**：
    - 如果攻擊全部被阻擋（blocked）→ 說明防護規則已生效，建議應為「防護規則已生效，持續監控攻擊趨勢，觀察阻擋量是否上升」
    - 如果攻擊大部分被阻擋（80%以上）→ 建議「強化防護規則以減少通過率，持續監控已阻擋攻擊」
    - 如果攻擊大部分未被阻擋 → 建議「立即啟用防護規則，緊急封鎖攻擊來源」
    - **禁止在攻擊已被阻擋的情況下，建議「立即啟用」防護規則，這是邏輯矛盾**

---

請以繁體中文回答，**務必輸出純 JSON 格式**，不要有 markdown 或其他格式符號。
`;

    return promptTemplate.trim();
  }

  /**
   * 根據 request_status 生成動態建議
   * @param {Object} attackData - 攻擊統計資料
   * @param {string} attackType - 攻擊類型
   * @param {string} signatureSet - F5 簽章集編號
   * @returns {Object} 包含 aiInsight 和 recommendations 的物件
   */
  generateDynamicRecommendations(attackData, attackType, signatureSet = '') {
    const { blockedCount, passedCount, alertedCount, count } = attackData;
    const mostlyBlocked = blockedCount / count >= 0.8; // 80% 以上被阻擋
    const allBlocked = blockedCount === count; // 全部被阻擋

    let protectionStatus = '';
    let recommendations = [];

    if (allBlocked) {
      // 全部被阻擋
      protectionStatus = `根據 F5 多層次判斷模型（Level 1: request_status = blocked）確認為已阻擋的攻擊`;
      recommendations = [
        {
          title: '防護規則已生效 - 持續監控',
          description: `F5 Advanced WAF 已成功阻擋所有 ${count} 次 ${attackType} 攻擊嘗試，防護規則運作正常。建議持續監控攻擊趨勢，觀察阻擋量是否上升`,
          priority: 'medium',
        },
        {
          title: '分析攻擊模式',
          description: `檢視被阻擋的 ${attackType} 攻擊手法與來源，評估是否為組織性攻擊或隨機掃描，必要時可調整防護策略`,
          priority: 'low',
        },
      ];
    } else if (mostlyBlocked) {
      // 大部分被阻擋
      protectionStatus = `根據 F5 多層次判斷模型確認為 ${attackType} 攻擊嘗試，其中 ${blockedCount} 次已被阻擋，${passedCount} 次通過，${alertedCount} 次觸發告警`;
      recommendations = [
        {
          title: '強化防護規則 - 減少通過率',
          description: `目前仍有 ${passedCount} 次 ${attackType} 攻擊通過防護，建議${signatureSet ? `啟用或強化 F5 Advanced WAF 的 ${signatureSet}，` : ''}調整閾值設定以提高阻擋率`,
          priority: 'high',
        },
        {
          title: '持續監控已阻擋攻擊',
          description: `F5 Advanced WAF 已成功阻擋 ${blockedCount} 次攻擊，建議持續觀察阻擋量是否上升`,
          priority: 'medium',
        },
      ];
    } else {
      // 大部分未被阻擋
      protectionStatus = `根據 F5 多層次判斷模型確認為 ${attackType} 攻擊嘗試，但僅 ${blockedCount} 次被阻擋，${passedCount} 次通過，${alertedCount} 次觸發告警`;
      recommendations = [
        {
          title: `立即啟用 ${attackType} 防護規則`,
          description: `⚠️ 緊急：目前有 ${passedCount} 次 ${attackType} 攻擊通過防護，建議${signatureSet ? `立即啟用 F5 Advanced WAF 的 ${signatureSet}，` : ''}並將防護模式設定為阻擋（Blocking）`,
          priority: 'high',
        },
        {
          title: '緊急封鎖攻擊來源',
          description: `立即在 F5 WAF 中封鎖主要攻擊來源 IP，防止進一步攻擊`,
          priority: 'high',
        },
      ];
    }

    return { protectionStatus, recommendations };
  }

  // 生成 Fallback 風險資料（AI 解析失敗時使用）
  generateFallbackRisks(analysisData) {
    const risks = [];
    const {
      sqlInjection,
      xssAttacks,
      commandExecution,
      pathTraversal,
      botTraffic,
      informationLeakage,
      sessionAttacks,
      otherAttacks,
      timeRange,
    } = analysisData;

    if (sqlInjection.count > 0) {
      const topCountry = sqlInjection.topCountries?.[0];
      const topIP = sqlInjection.topIPs?.[0];
      const topTarget = sqlInjection.topTargets?.[0];

      // 根據 highRisk 比例動態判定 severity
      const highRiskRatio = sqlInjection.highRisk / sqlInjection.count;
      const severity = highRiskRatio > 0.5 ? 'critical' : 'high';

      // 構建技術指標描述
      let technicalDetails = '';
      if (
        sqlInjection.avgViolationRating &&
        sqlInjection.avgViolationRating !== 'N/A'
      ) {
        technicalDetails = `平均 violation_rating 為 ${sqlInjection.avgViolationRating}。`;
      }
      if (sqlInjection.topSignatures && sqlInjection.topSignatures.length > 0) {
        technicalDetails += `觸發簽章：${sqlInjection.topSignatures.map((s) => `${s.signature} (${s.count}次)`).join('、')}。`;
      }
      if (!technicalDetails) {
        technicalDetails =
          '根據 F5 多層次判斷模型（Level 1-4）確認為真實攻擊。';
      }

      // 使用動態建議生成器
      const { protectionStatus, recommendations: dynamicRecommendations } =
        this.generateDynamicRecommendations(
          sqlInjection,
          'SQL 注入',
          'SQL 注入防護簽章（Signature Set 200010000 系列）',
        );

      // 構建基本建議（封鎖 IP、輸入驗證、閾值調整）
      const basicRecommendations = [
        {
          title: topIP?.item ? `封鎖來源 IP ${topIP.item}` : '封鎖攻擊來源 IP',
          description: topIP?.item
            ? `立即在 F5 WAF 的 IP Address Exceptions 中封鎖 ${topIP.item}，該 IP 已發起 ${topIP.count} 次 SQL 注入攻擊`
            : '立即在 F5 WAF 中封鎖攻擊來源 IP',
          priority: 'high',
        },
        {
          title: '強化輸入驗證與參數檢查',
          description:
            '對所有 SQL 查詢相關的輸入參數實施嚴格的資料類型檢查、長度限制和正則表達式驗證，並使用參數化查詢防止 SQL 注入',
          priority: 'medium',
        },
        {
          title: '調整違規評分閾值',
          description: `根據多層次判斷結果，建議將 violation_rating 閾值設定為 ${F5_VIOLATION_RATING_THRESHOLDS.MEDIUM} 以上進行阻擋，以優化防護策略`,
          priority: 'medium',
        },
      ];

      risks.push({
        id: `sql-injection-${Date.now()}`,
        title: 'SQL 注入攻擊檢測（多層次判斷）',
        severity: severity,
        openIssues: sqlInjection.count,
        resolvedIssues: 0,
        affectedAssets: sqlInjection.affectedAssets,
        tags: ['Internet Exposed', 'High Volume', 'F5 多層次判斷'],
        description: `F5 Advanced WAF 多層次判斷模型檢測到 ${sqlInjection.count} 次 SQL 注入攻擊嘗試，其中 ${sqlInjection.highRisk} 次為高風險攻擊。`,
        aiInsight: `在分析時間範圍內，F5 Advanced WAF 多層次判斷模型檢測到 ${sqlInjection.count} 次 SQL 注入攻擊嘗試，其中 ${sqlInjection.highRisk} 次為高風險攻擊。${technicalDetails} ${protectionStatus}。Level 3 攻擊類型匹配確認為 SQL Injection（OWASP A03:2021），攻擊手法包含 UNION 查詢、時間延遲注入等技術。主要攻擊來自 ${topCountry?.item || '未知地區'}（${topCountry?.count || 0} 次），Top 攻擊 IP 為 ${topIP?.item || '未知'}（${topIP?.count || 0} 次）。攻擊目標集中於 ${topTarget?.item || '多個端點'}（${topTarget?.count || 0} 次）。共影響 ${sqlInjection.affectedAssets} 個資產。`,
        createdDate: timeRange
          ? this.formatDateTaipei(timeRange.start)
          : new Date().toLocaleDateString('zh-TW'),
        updatedDate: timeRange
          ? this.formatDateTaipei(timeRange.end)
          : new Date().toLocaleDateString('zh-TW'),
        exploitInWild: false,
        internetExposed: true,
        confirmedExploitable: false,
        cveId: null,
        recommendations: [...dynamicRecommendations, ...basicRecommendations],
      });
    }

    if (xssAttacks.count > 0) {
      const topCountry = xssAttacks.topCountries?.[0];
      const topIP = xssAttacks.topIPs?.[0];
      const topTarget = xssAttacks.topTargets?.[0];

      // 構建技術指標描述
      let technicalDetails = '';
      if (
        xssAttacks.avgViolationRating &&
        xssAttacks.avgViolationRating !== 'N/A'
      ) {
        technicalDetails = `平均 violation_rating 為 ${xssAttacks.avgViolationRating}。`;
      }
      if (xssAttacks.topSignatures && xssAttacks.topSignatures.length > 0) {
        technicalDetails += `觸發簽章：${xssAttacks.topSignatures.map((s) => `${s.signature} (${s.count}次)`).join('、')}。`;
      }
      if (!technicalDetails) {
        technicalDetails = '根據 F5 多層次判斷模型確認為真實攻擊。';
      }

      risks.push({
        id: `xss-attack-${Date.now()}`,
        title: 'XSS 跨站腳本攻擊檢測',
        severity: 'high',
        openIssues: xssAttacks.count,
        resolvedIssues: 0,
        affectedAssets: xssAttacks.affectedAssets,
        tags: ['Internet Exposed', 'F5 多層次判斷'],
        description: `F5 Advanced WAF 檢測到 ${xssAttacks.count} 次 XSS 攻擊嘗試。`,
        aiInsight: `在分析時間範圍內，F5 Advanced WAF 多層次判斷模型檢測到 ${xssAttacks.count} 次 XSS（跨站腳本）攻擊嘗試，其中 ${xssAttacks.highRisk} 次被判定為高風險攻擊。${technicalDetails} Level 3 攻擊類型匹配確認為 Cross-Site Scripting（OWASP A03:2021），攻擊手法包含 <script> 標籤注入、事件處理器注入（如 onerror、onload）等。主要攻擊來自 ${topCountry?.item || '未知地區'}（${topCountry?.count || 0} 次），Top 攻擊 IP 為 ${topIP?.item || '未知'}（${topIP?.count || 0} 次）。攻擊目標為 ${topTarget?.item || '多個端點'}（${topTarget?.count || 0} 次）。共影響 ${xssAttacks.affectedAssets} 個資產。建議立即啟用 F5 Advanced WAF 的 XSS 防護規則並配置內容安全策略（CSP），同時檢查受影響端點的輸入驗證與輸出編碼機制。`,
        createdDate: timeRange
          ? this.formatDateTaipei(timeRange.start)
          : new Date().toLocaleDateString('zh-TW'),
        updatedDate: timeRange
          ? this.formatDateTaipei(timeRange.end)
          : new Date().toLocaleDateString('zh-TW'),
        exploitInWild: false,
        internetExposed: true,
        confirmedExploitable: false,
        cveId: null,
        recommendations: [
          {
            title: topIP?.item
              ? `封鎖來源 IP ${topIP.item}`
              : '封鎖攻擊來源 IP',
            description: topIP?.item
              ? `立即在 F5 WAF 的 IP Address Exceptions 中封鎖 ${topIP.item}，該 IP 已發起 ${topIP.count} 次 XSS 攻擊`
              : '立即在 F5 WAF 中封鎖攻擊來源 IP',
            priority: 'high',
          },
          {
            title: '啟用 XSS 防護規則',
            description:
              '配置 F5 WAF 的 XSS 防護規則（Signature Set 200003000）並啟用內容編碼檢查',
            priority: 'high',
          },
          {
            title: '強化輸入驗證與參數檢查',
            description:
              '對所有輸出到前端的參數實施嚴格的 HTML 編碼、屬性編碼和 JavaScript 編碼，並配置內容安全策略（CSP）',
            priority: 'medium',
          },
        ],
      });
    }

    if (commandExecution.count > 0) {
      const topCountry = commandExecution.topCountries?.[0];
      const topIP = commandExecution.topIPs?.[0];
      const topTarget = commandExecution.topTargets?.[0];

      // 構建技術指標描述
      let technicalDetails = '';
      if (
        commandExecution.avgViolationRating &&
        commandExecution.avgViolationRating !== 'N/A'
      ) {
        const avgRating = parseFloat(commandExecution.avgViolationRating);
        const ratingLevel =
          avgRating >= F5_VIOLATION_RATING_THRESHOLDS.CRITICAL
            ? 'Critical'
            : avgRating >= F5_VIOLATION_RATING_THRESHOLDS.HIGH
              ? 'High'
              : 'Medium';
        technicalDetails = `平均 violation_rating 為 ${commandExecution.avgViolationRating}（${ratingLevel} 等級）。`;
      }
      if (
        commandExecution.topSignatures &&
        commandExecution.topSignatures.length > 0
      ) {
        technicalDetails += `觸發簽章：${commandExecution.topSignatures.map((s) => `${s.signature} (${s.count}次)`).join('、')}。`;
      }
      if (!technicalDetails) {
        technicalDetails = '根據 F5 多層次判斷模型確認為極高風險攻擊。';
      }

      risks.push({
        id: `rce-attack-${Date.now()}`,
        title: '命令執行攻擊檢測',
        severity: 'critical',
        openIssues: commandExecution.count,
        resolvedIssues: 0,
        affectedAssets: commandExecution.affectedAssets,
        tags: ['Critical', 'Internet Exposed', 'F5 多層次判斷'],
        description: `F5 Advanced WAF 檢測到 ${commandExecution.count} 次命令執行攻擊嘗試。`,
        aiInsight: `⚠️ 嚴重警告：在分析時間範圍內，F5 Advanced WAF 多層次判斷模型檢測到 ${commandExecution.count} 次遠程命令執行（RCE）攻擊嘗試，其中 ${commandExecution.highRisk} 次為極高風險攻擊。${technicalDetails} Level 3 攻擊類型匹配確認為 Remote Command Execution / Code Injection（OWASP A03:2021），攻擊手法包含 Shell 命令注入、系統命令執行等技術。主要攻擊來自 ${topCountry?.item || '未知地區'}（${topCountry?.count || 0} 次），Top 攻擊 IP 為 ${topIP?.item || '未知'}（${topIP?.count || 0} 次），攻擊目標為 ${topTarget?.item || '多個端點'}（${topTarget?.count || 0} 次）。共影響 ${commandExecution.affectedAssets} 個資產。此類攻擊已被確認在野外利用，建議立即阻擋來源 IP、啟用 F5 Advanced WAF 的命令執行防護簽章（Signature Set 200020000 系列），並緊急檢查受影響端點的代碼執行邏輯。`,
        createdDate: timeRange
          ? this.formatDateTaipei(timeRange.start)
          : new Date().toLocaleDateString('zh-TW'),
        updatedDate: timeRange
          ? this.formatDateTaipei(timeRange.end)
          : new Date().toLocaleDateString('zh-TW'),
        exploitInWild: true,
        internetExposed: true,
        confirmedExploitable: true,
        cveId: null,
        recommendations: [
          {
            title: topIP?.item
              ? `立即封鎖來源 IP ${topIP.item}`
              : '立即封鎖攻擊來源 IP',
            description: topIP?.item
              ? `緊急！立即在 F5 WAF 和防火牆中封鎖 ${topIP.item}，該 IP 已發起 ${topIP.count} 次命令執行攻擊，阻止進一步的攻擊嘗試`
              : '緊急！立即在 F5 WAF 和防火牆中封鎖攻擊來源 IP',
            priority: 'high',
          },
          {
            title: '啟用命令執行防護簽章',
            description:
              '配置 F5 WAF 的命令執行防護簽章（Signature Set 200020000）並阻擋可疑請求，同時檢查參數元字符限制',
            priority: 'high',
          },
          {
            title: '強化輸入驗證與參數檢查',
            description:
              '對所有可能執行系統命令的參數實施最嚴格的白名單驗證，禁止危險元字符（;|&$`）並使用安全的 API 替代直接命令執行',
            priority: 'high',
          },
          {
            title: '緊急安全檢查',
            description:
              '立即檢查受影響端點的代碼執行邏輯和輸入驗證，確認是否存在未修補的 RCE 漏洞',
            priority: 'high',
          },
        ],
      });
    }

    // 資訊洩漏攻擊處理
    if (informationLeakage && informationLeakage.count > 0) {
      const topCountry = informationLeakage.topCountries?.[0];
      const topIP = informationLeakage.topIPs?.[0];
      const topTarget = informationLeakage.topTargets?.[0];

      // 構建技術指標描述
      let technicalDetails = '';
      if (
        informationLeakage.avgViolationRating &&
        informationLeakage.avgViolationRating !== 'N/A'
      ) {
        technicalDetails = `平均 violation_rating 為 ${informationLeakage.avgViolationRating}。`;
      }
      if (
        informationLeakage.topSignatures &&
        informationLeakage.topSignatures.length > 0
      ) {
        technicalDetails += `觸發簽章：${informationLeakage.topSignatures.map((s) => `${s.signature} (${s.count}次)`).join('、')}。`;
      }
      if (!technicalDetails) {
        technicalDetails = '根據 F5 多層次判斷模型確認為資訊洩漏風險。';
      }

      // 使用動態建議生成器
      const { protectionStatus, recommendations: dynamicRecommendations } =
        this.generateDynamicRecommendations(
          informationLeakage,
          '資訊洩漏',
          '資訊洩漏防護規則',
        );

      // 構建基本建議
      const basicRecommendations = [
        {
          title: topIP?.item ? `封鎖來源 IP ${topIP.item}` : '封鎖攻擊來源 IP',
          description: topIP?.item
            ? `在 F5 WAF 中封鎖 ${topIP.item}，該 IP 已發起 ${topIP.count} 次資訊洩漏攻擊`
            : '在 F5 WAF 中封鎖攻擊來源 IP',
          priority: 'medium',
        },
        {
          title: '檢查受影響端點的回應處理機制',
          description:
            '檢視受影響端點的錯誤處理、調試資訊、系統配置是否外洩，確保敏感資訊不會暴露於回應中',
          priority: 'high',
        },
        {
          title: '配置自訂錯誤頁面',
          description:
            '在 F5 WAF 中配置自訂錯誤頁面，隱藏服務器版本、技術棧等敏感資訊',
          priority: 'medium',
        },
      ];

      risks.push({
        id: `info-leakage-${Date.now()}`,
        title: '資訊洩漏攻擊檢測',
        severity: 'medium',
        openIssues: informationLeakage.count,
        resolvedIssues: 0,
        affectedAssets: informationLeakage.affectedAssets,
        tags: ['Internet Exposed', 'F5 多層次判斷'],
        description: `F5 Advanced WAF 檢測到 ${informationLeakage.count} 次資訊洩漏攻擊嘗試。`,
        aiInsight: `在分析時間範圍內，F5 Advanced WAF 多層次判斷模型檢測到 ${informationLeakage.count} 次資訊洩漏攻擊嘗試。${technicalDetails} ${protectionStatus}。主要攻擊來自 ${topCountry?.item || '未知地區'}（${topCountry?.count || 0} 次），Top 攻擊 IP 為 ${topIP?.item || '未知'}（${topIP?.count || 0} 次）。攻擊目標集中於 ${topTarget?.item || '多個端點'}（${topTarget?.count || 0} 次）。共影響 ${informationLeakage.affectedAssets} 個資產。`,
        createdDate: timeRange
          ? this.formatDateTaipei(timeRange.start)
          : new Date().toLocaleDateString('zh-TW'),
        updatedDate: timeRange
          ? this.formatDateTaipei(timeRange.end)
          : new Date().toLocaleDateString('zh-TW'),
        exploitInWild: false,
        internetExposed: true,
        confirmedExploitable: false,
        cveId: null,
        recommendations: [...dynamicRecommendations, ...basicRecommendations],
      });
    }

    return { risks };
  }

  // 工具方法：取得 Top N
  getTopN(logs, field, n) {
    const counts = new Map();
    logs.forEach((log) => {
      const value = log[field];
      if (
        value !== undefined &&
        value !== null &&
        value !== '' &&
        value !== 'N/A'
      ) {
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
      .map((log) => {
        const value = log[field];
        // 處理可能的數字字符串
        if (typeof value === 'string') {
          const parsed = parseFloat(value);
          return isNaN(parsed) ? null : parsed;
        }
        return typeof value === 'number' ? value : null;
      })
      .filter((v) => v !== null && v !== undefined && !isNaN(v));

    if (values.length === 0) return 'N/A';
    return (values.reduce((sum, v) => sum + v, 0) / values.length).toFixed(2);
  }

  // 工具方法：提取 Top Signatures（F5 簽章）
  getTopSignatures(logs, n = 3) {
    const signatureCounts = new Map();

    logs.forEach((log) => {
      const sigIds = log.sig_ids || log.signature_ids || log.signatureIds;
      if (sigIds) {
        // sig_ids 可能是陣列或字符串
        const signatures = Array.isArray(sigIds)
          ? sigIds
          : sigIds.split(',').map((s) => s.trim());
        signatures.forEach((sig) => {
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
      elkData: { hits: [] },
      sqlInjection: {
        count: 0,
        highRisk: 0,
        topIPs: [],
        topTargets: [],
        topCountries: [],
        affectedAssets: 0,
      },
      xssAttacks: {
        count: 0,
        highRisk: 0,
        topIPs: [],
        topTargets: [],
        topCountries: [],
        affectedAssets: 0,
      },
      commandExecution: {
        count: 0,
        highRisk: 0,
        topIPs: [],
        topTargets: [],
        topCountries: [],
        affectedAssets: 0,
      },
      pathTraversal: {
        count: 0,
        topIPs: [],
        topTargets: [],
        affectedAssets: 0,
      },
      botTraffic: { count: 0, topIPs: [], topCountries: [], affectedAssets: 0 },
      informationLeakage: {
        count: 0,
        topIPs: [],
        topTargets: [],
        affectedAssets: 0,
      },
      sessionAttacks: {
        count: 0,
        highRisk: 0,
        topIPs: [],
        topCountries: [],
        affectedAssets: 0,
      },
      otherAttacks: {
        count: 0,
        topIPs: [],
        topCountries: [],
        affectedAssets: 0,
      },
      geoAnalysis: { topCountries: [], topIPs: [] },
      assetAnalysis: { totalAssets: 0, topAssets: [] },
      totalEvents: 0,
      realAttacks: 0,
      timeRange: {
        start: new Date().toISOString(),
        end: new Date().toISOString(),
      },
    };
  }
}

module.exports = F5WAFRiskService;
