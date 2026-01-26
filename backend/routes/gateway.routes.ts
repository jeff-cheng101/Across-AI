// backend/routes/gateway.routes.ts
// Gateway 相關 API 路由

import express, { type Request, type Response, type Router } from 'express';
import fs from 'fs';
import path from 'path';

const router: Router = express.Router();
const subscriptionFilePath: string = path.join(__dirname, '..', 'data', 'subscription.json');

// ============================================================
// 類型定義
// ============================================================

/**
 * 訂閱資料類型
 */
type SubscriptionData = unknown[];

/**
 * 錯誤回應類型
 */
type ErrorResponse = {
  error: string;
  details?: string;
};

// ============================================================
// 輔助函數
// ============================================================

/**
 * 讀取訂閱清單檔案並解析為 JSON
 * @returns 解析後的 JSON 內容
 */
function readSubscriptionData(): unknown {
  const rawContent = fs.readFileSync(subscriptionFilePath, 'utf-8');
  return JSON.parse(rawContent);
}

// ============================================================
// API 端點
// ============================================================

/**
 * 取得訂閱清單
 * GET /api/gateway/subscription
 *
 * Response (成功): SubscriptionData[]
 * Response (失敗): { error: string, details?: string }
 */
function handleGetSubscription(
  _req: Request,
  res: Response<SubscriptionData | ErrorResponse>,
): void {
  try {
    if (!fs.existsSync(subscriptionFilePath)) {
      res.status(500).json({ error: 'subscription.json 不存在' });
      return;
    }

    const data = readSubscriptionData();

    if (!Array.isArray(data)) {
      res.status(500).json({ error: 'subscription.json 格式錯誤' });
      return;
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: '讀取 subscription.json 失敗',
      details: error instanceof Error ? error.message : String(error),
    });
  }
}

router.get('/subscription', handleGetSubscription);

// TODO: 未來將整個專案改為 TypeScript 可以改成 export default
// 使用 CommonJS 格式導出，因為 index.js 使用 require() 引入
// 如果改用 ES6 export default，會導致 "argument handler must be a function" 錯誤
module.exports = router;
