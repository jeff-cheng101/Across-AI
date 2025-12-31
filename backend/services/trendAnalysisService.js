// 攻擊趨勢對比分析服務
// 處理時間區間計算和流量統計

class TrendAnalysisService {
  constructor() {
    this.TIME_RANGES = {
      '1h': { ms: 60 * 60 * 1000, label: '1小時' },
      '6h': { ms: 6 * 60 * 60 * 1000, label: '6小時' },
      '1d': { ms: 24 * 60 * 60 * 1000, label: '1天' },
      '3d': { ms: 3 * 24 * 60 * 60 * 1000, label: '3天' },
      '7d': { ms: 7 * 24 * 60 * 60 * 1000, label: '7天' },
      '30d': { ms: 30 * 24 * 60 * 60 * 1000, label: '30天' }
    };
  }

  /**
   * 計算兩個對比時間區間
   * @param {string} timeRange - 時間範圍（1h, 6h, 1d, 3d, 7d, 30d）
   * @returns {object} 當前時期和上一時期的時間區間
   */
  calculateComparisonPeriods(timeRange) {
    const now = new Date();
    const config = this.TIME_RANGES[timeRange];
    
    if (!config) {
      throw new Error(`不支援的時間範圍: ${timeRange}`);
    }

    const duration = config.ms;
    
    return {
      current: {
        start: new Date(now.getTime() - duration),
        end: now,
        label: `當前${config.label} (${this.formatDateRange(new Date(now.getTime() - duration), now)})`
      },
      previous: {
        start: new Date(now.getTime() - duration * 2),
        end: new Date(now.getTime() - duration),
        label: `上一${config.label} (${this.formatDateRange(new Date(now.getTime() - duration * 2), new Date(now.getTime() - duration))})`
      }
    };
  }

  /**
   * 格式化日期範圍顯示
   * @param {Date} start - 開始時間
   * @param {Date} end - 結束時間
   * @returns {string} 格式化的日期範圍
   */
  formatDateRange(start, end) {
    const formatDate = (date) => {
      return date.toLocaleDateString('zh-TW', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    };
    
    return `${formatDate(start)} - ${formatDate(end)}`;
  }

  /**
   * 判定是否為攻擊 IP
   * @param {object} logEntry - 日誌條目
   * @returns {boolean} 是否為攻擊
   */
  isAttackIP(logEntry) {
    const { SecurityAction, WAFAttackScore, WAFSQLiAttackScore, WAFXSSAttackScore, SecurityRuleDescription } = logEntry;
    
    // 條件1: 被 Cloudflare 明確阻擋的請求
    if (SecurityAction === 'block') return true;
    
    // 條件2: WAF 攻擊分數高於 70 分（高風險）
    if (WAFAttackScore && WAFAttackScore >= 70) return true;
    if (WAFSQLiAttackScore && WAFSQLiAttackScore >= 70) return true;
    if (WAFXSSAttackScore && WAFXSSAttackScore >= 70) return true;
    
    // 條件3: 觸發了特定的安全規則
    if (SecurityRuleDescription && (
      SecurityRuleDescription.includes('attack') ||
      SecurityRuleDescription.includes('malicious') ||
      SecurityRuleDescription.includes('suspicious') ||
      SecurityRuleDescription.includes('exploit')
    )) return true;
    
    return false;
  }

  /**
   * 分析時期流量
   * @param {Array} logEntries - 日誌條目陣列
   * @param {object} period - 時期資訊
   * @returns {object} 流量分析結果
   */
  analyzePeriodTraffic(logEntries, period) {
    const trafficByTime = new Map();
    const ipTrafficMap = new Map();
    const attackIPSet = new Set();
    let totalRequestTraffic = 0;
    const totalRequests = logEntries.length;

    // 如果沒有數據，返回空結果
    if (logEntries.length === 0) {
      return {
        period: period,
        timeSeries: [],
        totalRequestTraffic: 0,
        totalRequests: 0,
        avgTrafficPerRequest: 0,
        topTrafficIPs: [],
        peakTrafficHour: 0,
        uniqueIPs: 0,
        attackIPs: 0,
        groupInterval: 24 * 60 * 60 * 1000
      };
    }

    // 基於實際數據範圍決定分組粒度
    let duration;
    if (period.start && period.end) {
      duration = period.end.getTime() - period.start.getTime();
    } else {
      const timestamps = logEntries.map(entry => new Date(entry.EdgeStartTimestamp || entry['@timestamp'] || entry.timestamp));
      const minTime = Math.min(...timestamps);
      const maxTime = Math.max(...timestamps);
      duration = maxTime - minTime;
    }

    let groupInterval;
    let timeKeyGenerator;

    if (duration <= 6 * 60 * 60 * 1000) { // 6 小時以內，按小時分組
      groupInterval = 60 * 60 * 1000;
      timeKeyGenerator = (timestamp) => {
        const date = new Date(timestamp);
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours()).getTime();
      };
    } else if (duration <= 7 * 24 * 60 * 60 * 1000) { // 7 天以內，按天分組
      groupInterval = 24 * 60 * 60 * 1000;
      timeKeyGenerator = (timestamp) => {
        const date = new Date(timestamp);
        return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
      };
    } else { // 更長時間，按週分組
      groupInterval = 7 * 24 * 60 * 60 * 1000;
      timeKeyGenerator = (timestamp) => {
        const date = new Date(timestamp);
        const dayOfWeek = date.getDay();
        const startOfWeek = new Date(date.getTime() - dayOfWeek * 24 * 60 * 60 * 1000);
        return new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate()).getTime();
      };
    }

    // 處理每筆日誌
    logEntries.forEach((entry) => {
      const timestamp = new Date(entry.EdgeStartTimestamp || entry['@timestamp'] || entry.timestamp);
      const timeKey = timeKeyGenerator(timestamp.getTime());
      
      const requestBytes = parseInt(entry.ClientRequestBytes) || 0;
      totalRequestTraffic += requestBytes;

      // 判定是否為攻擊 IP
      const clientIP = entry.ClientIP;
      const isAttack = this.isAttackIP(entry);
      if (isAttack && clientIP) {
        attackIPSet.add(clientIP);
      }

      // 時間序列統計
      if (!trafficByTime.has(timeKey)) {
        trafficByTime.set(timeKey, { 
          timestamp: timeKey, 
          traffic: 0, 
          requests: 0,
          uniqueIPs: new Set(),
          attackIPs: new Set()
        });
      }
      const timeData = trafficByTime.get(timeKey);
      timeData.traffic += requestBytes;
      timeData.requests += 1;
      if (clientIP) {
        timeData.uniqueIPs.add(clientIP);
      }
      if (isAttack && clientIP) {
        timeData.attackIPs.add(clientIP);
      }
      
      // IP 流量統計
      if (clientIP) {
        if (!ipTrafficMap.has(clientIP)) {
          ipTrafficMap.set(clientIP, { 
            ip: clientIP, 
            traffic: 0, 
            requests: 0,
            country: entry.ClientCountry || 'N/A',
            asn: entry.ClientASN || 'N/A',
            isAttackIP: false
          });
        }
        const ipData = ipTrafficMap.get(clientIP);
        ipData.traffic += requestBytes;
        ipData.requests += 1;
        if (isAttack) {
          ipData.isAttackIP = true;
        }
      }
    });

    // 轉換時間序列資料
    const timeSeries = this.fillTimeGaps(trafficByTime, period, groupInterval);

    return {
      period: period,
      timeSeries: timeSeries,
      totalRequestTraffic: totalRequestTraffic,
      totalRequests: totalRequests,
      avgTrafficPerRequest: totalRequests > 0 ? totalRequestTraffic / totalRequests : 0,
      topTrafficIPs: Array.from(ipTrafficMap.values())
        .sort((a, b) => b.traffic - a.traffic)
        .slice(0, 10),
      peakTrafficHour: Math.max(...timeSeries.map(t => t.traffic), 0),
      uniqueIPs: ipTrafficMap.size,
      attackIPs: attackIPSet.size,
      groupInterval: groupInterval
    };
  }

  /**
   * 填補時間序列中的空白時間點
   * @param {Map} trafficByTime - 按時間分組的流量資料
   * @param {object} period - 時期資訊
   * @param {number} interval - 時間間隔
   * @returns {Array} 完整的時間序列
   */
  fillTimeGaps(trafficByTime, period, interval) {
    if (trafficByTime.size === 0) {
      return [];
    }

    const actualTimeKeys = Array.from(trafficByTime.keys()).sort((a, b) => a - b);
    const result = [];
    
    actualTimeKeys.forEach(timeKey => {
      const existingData = trafficByTime.get(timeKey);
      result.push({
        timestamp: timeKey,
        traffic: existingData ? existingData.traffic : 0,
        requests: existingData ? existingData.requests : 0,
        uniqueIPs: existingData ? existingData.uniqueIPs.size : 0,
        attackIPs: existingData ? existingData.attackIPs.size : 0
      });
    });

    return result.sort((a, b) => a.timestamp - b.timestamp);
  }

  /**
   * 生成對比圖表資料
   * @param {object} currentAnalysis - 當前時期分析結果
   * @param {object} previousAnalysis - 上一時期分析結果
   * @param {object} periods - 時期資訊
   * @returns {object} 對比圖表資料
   */
  generateTrafficComparisonChart(currentAnalysis, previousAnalysis, periods) {
    // 如果任一時期沒有數據，創建基本的單點圖表
    if (currentAnalysis.timeSeries.length === 0 && previousAnalysis.timeSeries.length === 0) {
      return {
        data: [{
          timeLabel: '第1天',
          currentPeriod: 0,
          previousPeriod: 0,
          currentTimestamp: null,
          previousTimestamp: null,
          currentRequests: 0,
          previousRequests: 0
        }],
        currentLabel: periods.current.label,
        previousLabel: periods.previous.label
      };
    }
    
    const chartData = [];
    const maxDataPoints = Math.max(
      currentAnalysis.timeSeries.length, 
      previousAnalysis.timeSeries.length,
      1
    );
    
    for (let i = 0; i < maxDataPoints; i++) {
      const currentPoint = currentAnalysis.timeSeries[i];
      const previousPoint = previousAnalysis.timeSeries[i];
      
      let currentTraffic = currentPoint ? currentPoint.traffic : 0;
      let previousTraffic = previousPoint ? previousPoint.traffic : 0;
      
      const timeLabel = this.generateTimeLabel(i, currentAnalysis.groupInterval || 24 * 60 * 60 * 1000);
      
      chartData.push({
        timeLabel: timeLabel,
        currentPeriod: currentTraffic,
        previousPeriod: previousTraffic,
        currentTimestamp: currentPoint ? currentPoint.timestamp : null,
        previousTimestamp: previousPoint ? previousPoint.timestamp : null,
        currentRequests: currentPoint ? currentPoint.requests : 0,
        previousRequests: previousPoint ? previousPoint.requests : 0
      });
    }
    
    return {
      data: chartData,
      currentLabel: periods.current.label,
      previousLabel: periods.previous.label
    };
  }

  /**
   * 生成時間標籤
   * @param {number} index - 索引
   * @param {number} interval - 時間間隔
   * @returns {string} 時間標籤
   */
  generateTimeLabel(index, interval) {
    if (interval === 60 * 60 * 1000) {
      return `${index + 1}小時`;
    } else if (interval === 24 * 60 * 60 * 1000) {
      return `第${index + 1}天`;
    } else {
      return `第${index + 1}週`;
    }
  }

  /**
   * 計算對比統計
   * @param {object} currentAnalysis - 當前時期分析結果
   * @param {object} previousAnalysis - 上一時期分析結果
   * @returns {object} 變化率統計
   */
  calculateComparisonStats(currentAnalysis, previousAnalysis) {
    const calculateChangeRate = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous * 100).toFixed(2);
    };

    return {
      trafficChange: {
        current: currentAnalysis.totalRequestTraffic,
        previous: previousAnalysis.totalRequestTraffic,
        changeRate: calculateChangeRate(currentAnalysis.totalRequestTraffic, previousAnalysis.totalRequestTraffic)
      },
      requestsChange: {
        current: currentAnalysis.totalRequests,
        previous: previousAnalysis.totalRequests,
        changeRate: calculateChangeRate(currentAnalysis.totalRequests, previousAnalysis.totalRequests)
      },
      ipsChange: {
        current: currentAnalysis.uniqueIPs,
        previous: previousAnalysis.uniqueIPs,
        changeRate: calculateChangeRate(currentAnalysis.uniqueIPs, previousAnalysis.uniqueIPs)
      },
      attackIPsChange: {
        current: currentAnalysis.attackIPs,
        previous: previousAnalysis.attackIPs,
        changeRate: calculateChangeRate(currentAnalysis.attackIPs, previousAnalysis.attackIPs)
      },
      avgTrafficChange: {
        current: currentAnalysis.avgTrafficPerRequest,
        previous: previousAnalysis.avgTrafficPerRequest,
        changeRate: calculateChangeRate(currentAnalysis.avgTrafficPerRequest, previousAnalysis.avgTrafficPerRequest)
      }
    };
  }

  /**
   * 格式化位元組顯示
   * @param {number} bytes - 位元組數
   * @returns {string} 格式化的字串
   */
  formatBytes(bytes) {
    if (bytes >= 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    } else if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    } else if (bytes >= 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    }
    return `${bytes} B`;
  }
}

module.exports = TrendAnalysisService;

