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

/**
 * 更新成功回應類型
 */
type UpdateSubscriptionResponse = {
  success: true;
  data: SubscriptionData;
};

/**
 * 允許的幣別
 */
const ALLOWED_CURRENCIES = ['USD', 'TWD'] as const;

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

/**
 * 將訂閱清單寫入檔案
 * @param data 訂閱清單資料
 */
function writeSubscriptionData(data: SubscriptionData): void {
  const content = JSON.stringify(data, null, 2);
  fs.writeFileSync(subscriptionFilePath, `${content}\n`, 'utf-8');
}

/**
 * 日期時間格式正則 (YYYY-MM-DD hh:mm:ss)
 */
const DATETIME_REGEX = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

/**
 * 取得當下時間字串 (YYYY-MM-DD hh:mm:ss)
 * @param now 目前時間
 * @returns 格式化時間字串
 */
function getNowDatetimeString(now: Date = new Date()): string {
  const pad = (value: number): string => String(value).padStart(2, '0');
  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const date = pad(now.getDate());
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());
  return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
}

/**
 * 驗證單筆訂閱資料
 * @param item 待驗證的資料
 * @param index 資料索引（用於錯誤訊息）
 * @returns 錯誤訊息，若無錯誤則返回 null
 */
function validateSubscriptionItem(item: unknown, index: number): string | null {
  if (typeof item !== 'object' || item === null) {
    return `第 ${index + 1} 筆資料必須是物件`;
  }

  const data = item as Record<string, unknown>;

  // ai_name: 文字，必填
  if (typeof data.ai_name !== 'string' || data.ai_name.trim() === '') {
    return `第 ${index + 1} 筆: ai_name 必須是非空字串`;
  }

  // price: 數值，小數點2位
  if (typeof data.price !== 'number' || Number.isNaN(data.price) || data.price < 0) {
    return `第 ${index + 1} 筆: price 必須是非負數值`;
  }

  // duration: 正整數
  if (typeof data.duration !== 'number' || !Number.isInteger(data.duration) || data.duration <= 0) {
    return `第 ${index + 1} 筆: duration 必須是正整數`;
  }

  // subscribe_time: YYYY-MM-DD hh:mm:ss
  if (typeof data.subscribe_time !== 'string' || !DATETIME_REGEX.test(data.subscribe_time)) {
    return `第 ${index + 1} 筆: subscribe_time 格式必須為 YYYY-MM-DD hh:mm:ss`;
  }

  // currency_code: USD 或 TWD
  if (
    typeof data.currency_code !== 'string' ||
    !ALLOWED_CURRENCIES.includes(data.currency_code as typeof ALLOWED_CURRENCIES[number])
  ) {
    return `第 ${index + 1} 筆: currency_code 必須是 ${ALLOWED_CURRENCIES.join(' 或 ')}`;
  }

  // create_time: YYYY-MM-DD hh:mm:ss（可選，若提供需符合格式）
  if (typeof data.create_time !== 'undefined') {
    if (typeof data.create_time !== 'string' || (data.create_time !== '' && !DATETIME_REGEX.test(data.create_time))) {
      return `第 ${index + 1} 筆: create_time 格式必須為 YYYY-MM-DD hh:mm:ss`;
    }
  }

  // update_time: YYYY-MM-DD hh:mm:ss（可選，若提供需符合格式）
  if (typeof data.update_time !== 'undefined') {
    if (typeof data.update_time !== 'string' || (data.update_time !== '' && !DATETIME_REGEX.test(data.update_time))) {
      return `第 ${index + 1} 筆: update_time 格式必須為 YYYY-MM-DD hh:mm:ss`;
    }
  }

  return null;
}

/**
 * 驗證整個訂閱陣列
 * @param data 待驗證的陣列
 * @returns 錯誤訊息，若無錯誤則返回 null
 */
function validateSubscriptionData(data: unknown[]): string | null {
  for (let i = 0; i < data.length; i++) {
    const error = validateSubscriptionItem(data[i], i);
    if (error) return error;
  }
  return null;
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

/**
 * 更新訂閱清單
 * PUT /api/gateway/subscription
 *
 * Body: SubscriptionData[]
 * Response (成功): { success: true, data: SubscriptionData }
 * Response (失敗): { error: string, details?: string }
 */
function handleUpdateSubscription(
  req: Request,
  res: Response<UpdateSubscriptionResponse | ErrorResponse>,
): void {
  try {
    if (!fs.existsSync(subscriptionFilePath)) {
      res.status(500).json({ error: 'subscription.json 不存在' });
      return;
    }

    const existingData = readSubscriptionData();
    if (!Array.isArray(existingData)) {
      res.status(500).json({ error: 'subscription.json 格式錯誤' });
      return;
    }

    const requestBody: unknown = req.body;

    if (!Array.isArray(requestBody)) {
      res.status(400).json({ error: '請提供陣列格式的訂閱資料' });
      return;
    }

    // 驗證每筆資料格式
    const validationError = validateSubscriptionData(requestBody);
    if (validationError) {
      res.status(400).json({ error: validationError });
      return;
    }

    // ai_name 重複時視為更新，以最後一次出現為準
    const requestDataByAiName = new Map<string, Record<string, unknown>>();
    const requestAiNameOrder: string[] = [];
    for (const item of requestBody) {
      const data = item as Record<string, unknown>;
      const aiName = data.ai_name as string;
      if (!requestDataByAiName.has(aiName)) {
        requestAiNameOrder.push(aiName);
      }
      requestDataByAiName.set(aiName, data);
    }

    const normalizedRequestData = requestAiNameOrder.map(
      (aiName) => requestDataByAiName.get(aiName) as Record<string, unknown>,
    );

    const now = getNowDatetimeString();
    const hasExistingUpdateTime = existingData.some((item) => {
      if (typeof item !== 'object' || item === null) return false;
      const data = item as Record<string, unknown>;
      return typeof data.update_time === 'string' && DATETIME_REGEX.test(data.update_time);
    });

    // 以 ai_name 作為對應鍵，維持舊資料的 create_time
    const createTimeByAiName = new Map<string, string>();
    for (const item of existingData) {
      if (typeof item !== 'object' || item === null) continue;
      const data = item as Record<string, unknown>;
      if (typeof data.ai_name !== 'string') continue;
      if (typeof data.create_time !== 'string' || !DATETIME_REGEX.test(data.create_time)) continue;
      createTimeByAiName.set(data.ai_name, data.create_time);
    }

    const updatedData = normalizedRequestData.map((data) => {
      const aiName = typeof data.ai_name === 'string' ? data.ai_name : '';
      const createTime =
        !hasExistingUpdateTime
          ? now
          : createTimeByAiName.get(aiName) ?? now;

      return {
        ...data,
        create_time: createTime,
        update_time: now,
      };
    });

    writeSubscriptionData(updatedData);

    res.json({ success: true, data: updatedData });
  } catch (error) {
    res.status(500).json({
      error: '更新 subscription.json 失敗',
      details: error instanceof Error ? error.message : String(error),
    });
  }
}

router.put('/subscription', handleUpdateSubscription);

// TODO: 未來將整個專案改為 TypeScript 可以改成 export default
// 使用 CommonJS 格式導出，因為 index.js 使用 require() 引入
// 如果改用 ES6 export default，會導致 "argument handler must be a function" 錯誤
module.exports = router;
