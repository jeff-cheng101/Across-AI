// backend/routes/trend.routes.js
// 趨勢對比分析 API 路由

const express = require('express');
const router = express.Router();
const { elkMCPClient } = require('../services/elkMCPClient');
const TrendAnalysisService = require('../services/trendAnalysisService');
const cloudflareELKConfig = require('../config/products/cloudflare/cloudflareELKConfig');

// 初始化趨勢分析服務
const trendAnalysisService = new TrendAnalysisService();

/**
 * 計算實際時間範圍
 * @param {Array} previousData - 上一時期資料
 * @param {Array} currentData - 當前時期資料
 * @param {string} timeRange - 時間範圍
 * @returns {object} 實際時間範圍
 */
function calculateActualPeriods(previousData, currentData, timeRange) {
  const getTimeRange = (data) => {
    if (data.length === 0) return { start: null, end: null };
    
    const timestamps = data.map(entry => new Date(entry.EdgeStartTimestamp || entry['@timestamp'] || entry.timestamp));
    const validTimestamps = timestamps.filter(t => !isNaN(t.getTime()));
    
    if (validTimestamps.length === 0) return { start: null, end: null };
    
    const start = new Date(Math.min(...validTimestamps));
    const end = new Date(Math.max(...validTimestamps));
    
    return { start, end };
  };
  
  const previousRange = getTimeRange(previousData);
  const currentRange = getTimeRange(currentData);
  
  const formatDateRange = (start, end) => {
    if (!start || !end) return 'N/A';
    
    const formatDate = (date) => {
      return date.toLocaleDateString('zh-TW', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    };
    
    return `${formatDate(start)} - ${formatDate(end)}`;
  };
  
  return {
    current: {
      start: currentRange.start,
      end: currentRange.end,
      label: `當前時期 (${formatDateRange(currentRange.start, currentRange.end)})`
    },
    previous: {
      start: previousRange.start,
      end: previousRange.end,
      label: `上一時期 (${formatDateRange(previousRange.start, previousRange.end)})`
    }
  };
}

/**
 * POST /api/trend/load-comparison
 * 載入趨勢對比資料
 * 
 * 請求體：
 * {
 *   "timeRange": "7d"  // 支援: 1h, 6h, 1d, 3d, 7d, 30d
 * }
 */
router.post('/load-comparison', async (req, res) => {
  const { timeRange = '7d' } = req.body;
  
  // 驗證 timeRange
  const validTimeRanges = ['1h', '6h', '1d', '3d', '7d', '30d'];
  if (!validTimeRanges.includes(timeRange)) {
    return res.status(400).json({
      success: false,
      error: `無效的時間範圍: ${timeRange}`,
      validRanges: validTimeRanges
    });
  }

  // 進度追蹤
  const progressUpdates = [];
  const progressCallback = (update) => {
    progressUpdates.push({
      ...update,
      timestamp: new Date().toISOString()
    });
    console.log(`📋 查詢進度: ${update.description || update.type} - ${update.batchIndex}/${update.totalBatches}`);
  };

  try {
    console.log(`\n🔍 ===== 開始載入趨勢對比資料 =====`);
    console.log(`📅 時間範圍: ${timeRange}`);
    
    // 計算對比時間區間（用於顯示）
    const periods = trendAnalysisService.calculateComparisonPeriods(timeRange);
    console.log(`當前時期: ${periods.current.start.toISOString()} - ${periods.current.end.toISOString()}`);
    console.log(`上一時期: ${periods.previous.start.toISOString()} - ${periods.previous.end.toISOString()}`);

    // 使用 ES|QL 分批查詢 ELK 資料
    // 需要查詢兩個時間範圍（當前 + 上一時期）
    const allLogData = await elkMCPClient.queryESQLTimeBatched(
      timeRange, 
      progressCallback,
      cloudflareELKConfig.index
    );
    
    if (allLogData.length === 0) {
      return res.status(500).json({
        success: false,
        error: '未找到任何日誌資料',
        details: '請檢查 ELK 連接或調整時間範圍',
        timeRange: timeRange,
        queryInfo: {
          totalBatches: progressUpdates.length > 0 ? progressUpdates[progressUpdates.length - 1].totalBatches : 0,
          progressLog: progressUpdates
        }
      });
    }

    console.log(`✅ 查詢完成，共取得 ${allLogData.length} 筆記錄`);

    // 將資料按時間排序並分割為兩個相等時期
    const sortedData = allLogData.sort((a, b) => {
      const timeA = new Date(a.EdgeStartTimestamp || a['@timestamp'] || a.timestamp);
      const timeB = new Date(b.EdgeStartTimestamp || b['@timestamp'] || b.timestamp);
      return timeA - timeB;
    });
    
    const midpoint = Math.floor(sortedData.length / 2);
    const previousData = sortedData.slice(0, midpoint);
    const currentData = sortedData.slice(midpoint);
    
    // 計算實際時間範圍
    const actualPeriods = calculateActualPeriods(previousData, currentData, timeRange);

    console.log(`✅ 數據分割完成:`);
    console.log(`   上一時期: ${previousData.length} 筆記錄`);
    console.log(`   當前時期: ${currentData.length} 筆記錄`);

    // 分析流量統計
    const currentAnalysis = trendAnalysisService.analyzePeriodTraffic(currentData, actualPeriods.current);
    const previousAnalysis = trendAnalysisService.analyzePeriodTraffic(previousData, actualPeriods.previous);
    
    // 生成對比圖表資料
    const comparisonChart = trendAnalysisService.generateTrafficComparisonChart(
      currentAnalysis, 
      previousAnalysis, 
      actualPeriods
    );

    // 計算對比統計
    const statistics = trendAnalysisService.calculateComparisonStats(currentAnalysis, previousAnalysis);

    console.log(`\n✅ ===== 趨勢對比資料載入完成 =====`);
    console.log(`當前時期: ${currentAnalysis.totalRequests} 次請求, ${trendAnalysisService.formatBytes(currentAnalysis.totalRequestTraffic)} 流量`);
    console.log(`上一時期: ${previousAnalysis.totalRequests} 次請求, ${trendAnalysisService.formatBytes(previousAnalysis.totalRequestTraffic)} 流量`);

    res.json({
      success: true,
      periods: actualPeriods,
      currentPeriod: currentAnalysis,
      previousPeriod: previousAnalysis,
      comparisonChart,
      statistics,
      queryInfo: {
        totalBatches: progressUpdates.length > 0 ? progressUpdates[progressUpdates.length - 1].totalBatches : 1,
        successfulBatches: progressUpdates.filter(p => p.type === 'batch_complete' && p.success).length,
        failedBatches: progressUpdates.filter(p => p.type === 'batch_error').length,
        totalRecords: allLogData.length,
        queryMethod: 'esql',
        progressLog: progressUpdates
      }
    });

  } catch (error) {
    console.error('❌ 趨勢資料載入失敗:', error);
    
    const errorResponse = { 
      success: false,
      error: error.message,
      details: '趨勢對比資料載入失敗',
      timeRange: timeRange
    };
    
    // 如果有進度信息，也包含在錯誤響應中
    if (progressUpdates && progressUpdates.length > 0) {
      errorResponse.queryInfo = {
        totalBatches: progressUpdates[progressUpdates.length - 1]?.totalBatches || 0,
        completedBatches: progressUpdates.filter(p => p.type === 'batch_complete').length,
        failedBatches: progressUpdates.filter(p => p.type === 'batch_error').length,
        progressLog: progressUpdates
      };
    }
    
    res.status(500).json(errorResponse);
  }
});

module.exports = router;

