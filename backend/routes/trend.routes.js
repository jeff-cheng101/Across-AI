// backend/routes/trend.routes.js
// Cloudflare 趨勢對比分析 API 路由
// 使用 ES|QL 聚合查詢 + 多工並行查詢策略

const express = require('express');
const router = express.Router();
const TrendAnalysisService = require('../services/trendAnalysisService');

// 初始化趨勢分析服務
const trendAnalysisService = new TrendAnalysisService();

/**
 * POST /api/cloudflare/trend/load-comparison
 * 載入 Cloudflare 趨勢對比分析數據
 * 
 * 請求體：
 * {
 *   "timeRange": "7d"  // 支援: 1h, 6h, 1d, 3d, 7d, 14d, 30d
 * }
 * 
 * 回應格式符合 trend_GUIDE.md 規格
 */
router.post('/load-comparison', async (req, res) => {
  const { timeRange = '7d' } = req.body;
  
  // 取得有效的時間範圍列表
  const validTimeRanges = trendAnalysisService.getValidTimeRanges();
  
  // 驗證 timeRange 參數
  if (!validTimeRanges.includes(timeRange)) {
    return res.status(400).json({
      success: false,
      error: `無效的時間範圍: ${timeRange}`,
      validRanges: validTimeRanges
    });
  }

  try {
    console.log(`\n🔍 ===== 開始載入趨勢對比資料 =====`);
    console.log(`📅 時間範圍: ${timeRange}`);
    console.log(`📋 使用多工並行查詢策略`);

    // 使用新版服務載入趨勢對比分析數據
    // 內部實作：
    // - 第一階段：19 個無依賴查詢並行執行
    // - 第二階段：5 個依賴查詢並行執行（上期 Top 5）
    const response = await trendAnalysisService.loadTrendComparison(timeRange);

    console.log(`\n✅ ===== 趨勢對比資料載入完成 =====`);
    
    // 回傳符合 trend_GUIDE.md 規格的回應
    res.json(response);

  } catch (error) {
    console.error('❌ 趨勢資料載入失敗:', error);
    
    // 錯誤回應
    res.status(500).json({
      success: false,
      error: error.message,
      details: '趨勢對比資料載入失敗，請檢查 ELK 連接或調整時間範圍',
      timeRange: timeRange
    });
  }
});

module.exports = router;
