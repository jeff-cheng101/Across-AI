// backend/routes/gateway.routes.js
// Gateway 相關 API 路由

const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const subscriptionFilePath = path.join(__dirname, '..', 'data', 'subscription.json');

/**
 * 讀取訂閱清單檔案並解析為 JSON
 * @returns {unknown} 解析後的 JSON 內容
 */
function readSubscriptionData() {
  const rawContent = fs.readFileSync(subscriptionFilePath, 'utf-8');
  return JSON.parse(rawContent);
}

/**
 * 取得訂閱清單
 * @param {import('express').Request} _req
 * @param {import('express').Response} res
 * @returns {void}
 */
function handleGetSubscription(_req, res) {
  try {
    if (!fs.existsSync(subscriptionFilePath)) {
      return res.status(500).json({ error: 'subscription.json 不存在' });
    }

    const data = readSubscriptionData();

    if (!Array.isArray(data)) {
      return res.status(500).json({ error: 'subscription.json 格式錯誤' });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({
      error: '讀取 subscription.json 失敗',
      details: error instanceof Error ? error.message : String(error),
    });
  }
}

router.get('/subscription', handleGetSubscription);

module.exports = router;
