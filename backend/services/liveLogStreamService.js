// backend/services/liveLogStreamService.js
// 即時日誌串流服務：WebSocket 訂閱管理 + ELK 增量查詢 + 事件推送

const { z } = require('zod');
const { WebSocket } = require('ws');
const { elkMCPClient } = require('./elkMCPClient');
const cloudflareELKConfig = require('../config/products/cloudflare/cloudflareELKConfig');
const f5ELKConfig = require('../config/products/f5/f5ELKConfig');
const checkpointELKConfig = require('../config/products/checkpoint/checkpointELKConfig');
const {
  CLOUDFLARE_FIELD_MAPPING,
} = require('../config/products/cloudflare/cloudflareFieldMapping');
const { F5_FIELD_MAPPING } = require('../config/products/f5/f5FieldMapping');
const {
  CHECKPOINT_FIELD_MAPPING,
} = require('../config/products/checkpoint/chcekpointFieldMapping');

// ============================================================
// WebSocket 協議定義（Client ↔ Server）
// ============================================================

const LIVE_LOG_PRODUCT_TYPE_SCHEMA = z.enum(['cloudflare', 'f5', 'checkpoint']);

const LIVE_LOG_RELATIVE_TIME_RANGE_SCHEMA = z
  .string()
  .regex(/^\d+[mhd]$/, '時間範圍格式需為 10m / 1h / 7d');

const LIVE_LOG_ABSOLUTE_TIME_RANGE_SCHEMA = z.object({
  start: z.string().datetime(),
  end: z.string().datetime(),
});

const LIVE_LOG_TIME_RANGE_SCHEMA = z.union([
  LIVE_LOG_RELATIVE_TIME_RANGE_SCHEMA,
  LIVE_LOG_ABSOLUTE_TIME_RANGE_SCHEMA,
]);

const LIVE_LOG_FILTERS_SCHEMA = z
  .object({
    clientIp: z.string().min(1).optional(),
    securityAction: z.string().min(1).optional(),
    minWafScore: z.number().int().min(0).optional(),
  })
  .strict();

const LIVE_LOG_CURSOR_SCHEMA = z.object({
  timestamp: z.string().datetime(),
  lastRecordId: z.string().min(1).optional(),
});

const LIVE_LOG_SUBSCRIBE_MESSAGE_SCHEMA = z.object({
  action: z.literal('subscribe'),
  subscriptionId: z.string().min(1),
  productType: LIVE_LOG_PRODUCT_TYPE_SCHEMA,
  timeRange: LIVE_LOG_TIME_RANGE_SCHEMA.optional(),
  filters: LIVE_LOG_FILTERS_SCHEMA.optional(),
  intervalMilliseconds: z.number().int().min(2000).max(60000).optional(),
  cursor: LIVE_LOG_CURSOR_SCHEMA.optional(),
});

const LIVE_LOG_UPDATE_FILTERS_MESSAGE_SCHEMA = z.object({
  action: z.literal('update_filters'),
  subscriptionId: z.string().min(1),
  timeRange: LIVE_LOG_TIME_RANGE_SCHEMA.optional(),
  filters: LIVE_LOG_FILTERS_SCHEMA.optional(),
  intervalMilliseconds: z.number().int().min(2000).max(60000).optional(),
  cursor: LIVE_LOG_CURSOR_SCHEMA.optional(),
});

const LIVE_LOG_UNSUBSCRIBE_MESSAGE_SCHEMA = z.object({
  action: z.literal('unsubscribe'),
  subscriptionId: z.string().min(1),
});

const LIVE_LOG_PING_MESSAGE_SCHEMA = z.object({
  action: z.literal('ping'),
});

const LIVE_LOG_CLIENT_MESSAGE_SCHEMA = z.union([
  LIVE_LOG_SUBSCRIBE_MESSAGE_SCHEMA,
  LIVE_LOG_UPDATE_FILTERS_MESSAGE_SCHEMA,
  LIVE_LOG_UNSUBSCRIBE_MESSAGE_SCHEMA,
  LIVE_LOG_PING_MESSAGE_SCHEMA,
]);

const LIVE_LOG_RECORD_SCHEMA = z.object({
  recordId: z.string().min(1),
  timestamp: z.string().datetime(),
  source: z.record(z.unknown()),
});

const LIVE_LOG_SNAPSHOT_EVENT_SCHEMA = z.object({
  event: z.literal('snapshot'),
  subscriptionId: z.string().min(1),
  productType: LIVE_LOG_PRODUCT_TYPE_SCHEMA,
  records: z.array(LIVE_LOG_RECORD_SCHEMA),
  cursor: LIVE_LOG_CURSOR_SCHEMA.optional(),
  receivedAt: z.string().datetime(),
  stats: z
    .object({
      totalRecords: z.number().int().min(0),
    })
    .optional(),
});

const LIVE_LOG_UPDATE_EVENT_SCHEMA = z.object({
  event: z.literal('update'),
  subscriptionId: z.string().min(1),
  productType: LIVE_LOG_PRODUCT_TYPE_SCHEMA,
  records: z.array(LIVE_LOG_RECORD_SCHEMA),
  cursor: LIVE_LOG_CURSOR_SCHEMA.optional(),
  receivedAt: z.string().datetime(),
});

const LIVE_LOG_HEARTBEAT_EVENT_SCHEMA = z.object({
  event: z.literal('heartbeat'),
  serverTime: z.string().datetime(),
});

const LIVE_LOG_ERROR_EVENT_SCHEMA = z.object({
  event: z.literal('error'),
  message: z.string().min(1),
  code: z.string().min(1).optional(),
  subscriptionId: z.string().min(1).optional(),
});

// ============================================================
// 服務內部設定
// ============================================================

const DEFAULT_TIME_RANGE = '1h';
const DEFAULT_POLLING_INTERVAL_MILLISECONDS = 5000;
const MINIMUM_POLLING_INTERVAL_MILLISECONDS = 2000;
const MAXIMUM_POLLING_INTERVAL_MILLISECONDS = 60000;
const HEARTBEAT_INTERVAL_MILLISECONDS = 15000;
const CONNECTION_IDLE_TIMEOUT_MILLISECONDS = 60000;
const MAXIMUM_SNAPSHOT_RECORDS = 500;

const LIVE_LOG_PRODUCT_CONFIGURATION_BY_TYPE = {
  cloudflare: {
    config: cloudflareELKConfig,
    fieldMapping: CLOUDFLARE_FIELD_MAPPING,
  },
  f5: {
    config: f5ELKConfig,
    fieldMapping: F5_FIELD_MAPPING,
  },
  checkpoint: {
    config: checkpointELKConfig,
    fieldMapping: CHECKPOINT_FIELD_MAPPING,
  },
};

/**
 * @typedef {Object} LiveLogSubscriptionState
 * @property {string} subscriptionId 訂閱識別碼
 * @property {'cloudflare'|'f5'|'checkpoint'} productType 產品類型
 * @property {string|{start: string, end: string}} timeRange 查詢時間範圍
 * @property {object|undefined} filters 查詢篩選條件
 * @property {number} intervalMilliseconds 輪詢間隔
 * @property {{timestamp: string, lastRecordId?: string}|undefined} cursor 續讀游標
 * @property {NodeJS.Timeout|null} pollingTimer 輪詢計時器
 * @property {boolean} isPolling 是否正在查詢
 * @property {number|null} lastDeliveredTimestampInMilliseconds 上次送出時間戳記
 * @property {Set<string>} deliveredRecordIdsForTimestamp 同時間戳記的已送出記錄
 */

/**
 * @typedef {Object} LiveLogConnectionState
 * @property {Map<string, LiveLogSubscriptionState>} subscriptionsById 訂閱集合
 * @property {number} lastClientActivityAtInMilliseconds 最後活動時間
 * @property {NodeJS.Timeout|null} heartbeatTimer 心跳計時器
 */

/**
 * 解析相對時間範圍為毫秒
 *
 * 業務背景：即時串流採用「相對時間 + 游標」策略，確保斷線後可續讀。
 * 邊界條件：時間格式僅支援 m/h/d，格式錯誤會中止訂閱。
 *
 * @param {string} relativeTimeRange 相對時間範圍（如 10m / 1h / 7d）
 * @returns {number} 毫秒數
 */
function parseRelativeTimeRangeToMilliseconds(relativeTimeRange) {
  const match = relativeTimeRange.match(/^(\d+)([mhd])$/);
  if (!match) {
    throw new Error('時間範圍格式錯誤，請使用 10m / 1h / 7d');
  }

  const value = Number(match[1]);
  const unit = match[2];

  const unitMultipliers = {
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return value * unitMultipliers[unit];
}

/**
 * 將時間字串或 Date 轉換為 ISO 字串
 *
 * 業務背景：WebSocket 協議固定使用 ISO 字串，方便前端顯示與續讀。
 * 邊界條件：無法解析的時間會回傳 null 以避免送出錯誤資料。
 *
 * @param {unknown} value 原始時間值
 * @returns {string|null} ISO 字串
 */
function normalizeTimestampValue(value) {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value.toISOString();
  }

  if (typeof value === 'number') {
    const parsedDate = new Date(value);
    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate.toISOString();
  }

  if (typeof value === 'string') {
    const parsedDate = new Date(value);
    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate.toISOString();
  }

  return null;
}

/**
 * 取得記錄 ID（依各產品常見欄位回退）
 *
 * 業務背景：游標需要穩定的記錄識別，避免重複推送。
 * 邊界條件：若無法取得，就使用 index 序號以維持可用性。
 *
 * @param {object} recordSource 原始記錄內容
 * @param {string|number|undefined} fallbackId 回退 ID
 * @returns {string} 記錄識別碼
 */
function resolveRecordId(recordSource, fallbackId) {
  const candidate =
    recordSource?.RayID ||
    recordSource?.loguid ||
    recordSource?._id ||
    recordSource?.request_id ||
    recordSource?.uuid ||
    fallbackId;

  return String(candidate ?? '');
}

/**
 * 判斷 WebSocket 是否仍可發送
 *
 * 業務背景：避免在斷線後送出訊息造成例外。
 * 依賴：ws 套件的 readyState。
 *
 * @param {WebSocket} webSocketConnection WebSocket 連線
 * @returns {boolean} 是否可發送
 */
function isWebSocketConnectionOpen(webSocketConnection) {
  return webSocketConnection.readyState === WebSocket.OPEN;
}

/**
 * 將 ELK 查詢結果轉為可序列化的 Live Log 記錄
 *
 * 業務背景：前端只需要統一的 recordId + timestamp + source 結構。
 * 邊界條件：缺少時間欄位的記錄會被排除。
 *
 * @param {Array<{id: string, source: object, timestamp?: string}>} hits ELK hits
 * @param {string} timestampField 產品指定時間欄位
 * @returns {Array<{recordId: string, timestamp: string, source: object}>} 記錄陣列
 */
function transformElkHitsToLiveLogRecords(hits, timestampField) {
  return hits
    .map((hit, index) => {
      const recordSource =
        hit && typeof hit === 'object' && 'source' in hit && hit.source
          ? hit.source
          : hit || {};
      const timestampValue =
        recordSource?.[timestampField] ||
        hit?.timestamp ||
        recordSource?.['@timestamp'];
      const normalizedTimestamp = normalizeTimestampValue(timestampValue);
      if (!normalizedTimestamp) {
        return null;
      }

      const recordId = resolveRecordId(recordSource, hit?.id || index);
      if (!recordId) {
        return null;
      }

      return {
        recordId,
        timestamp: normalizedTimestamp,
        source: recordSource,
      };
    })
    .filter((record) => record !== null);
}

/**
 * 依時間排序記錄（由舊到新）
 *
 * @param {Array<{recordId: string, timestamp: string, source: object}>} records 記錄
 * @returns {Array<{recordId: string, timestamp: string, source: object}>} 排序後記錄
 */
function sortLiveLogRecordsByTimestamp(records) {
  return [...records].sort((recordA, recordB) => {
    const timeA = new Date(recordA.timestamp).getTime();
    const timeB = new Date(recordB.timestamp).getTime();
    if (timeA === timeB) {
      return recordA.recordId.localeCompare(recordB.recordId);
    }
    return timeA - timeB;
  });
}

/**
 * 限制 snapshot 回傳筆數，保留最新資料
 *
 * @param {Array<{recordId: string, timestamp: string, source: object}>} records 記錄
 * @param {number} maximumRecords 最大筆數
 * @returns {Array<{recordId: string, timestamp: string, source: object}>} 裁切後記錄
 */
function limitSnapshotRecords(records, maximumRecords) {
  if (records.length <= maximumRecords) {
    return records;
  }
  return records.slice(records.length - maximumRecords);
}

/**
 * 計算訂閱的查詢時間範圍
 *
 * 業務背景：時間範圍決定 snapshot 與 update 的查詢區間，
 * 使用游標時會以 cursor.timestamp 作為起點。
 *
 * @param {string|{start: string, end: string}} timeRange 訂閱時間範圍
 * @param {{timestamp: string}|undefined} cursor 續讀游標
 * @returns {{start: string, end: string}} 查詢時間範圍
 */
function resolveTimeRange(timeRange, cursor) {
  const now = new Date();

  if (typeof timeRange === 'string') {
    const durationMilliseconds = parseRelativeTimeRangeToMilliseconds(timeRange);
    const startDate = cursor?.timestamp
      ? new Date(cursor.timestamp)
      : new Date(now.getTime() - durationMilliseconds);
    return {
      start: startDate.toISOString(),
      end: now.toISOString(),
    };
  }

  const startDate = cursor?.timestamp
    ? new Date(cursor.timestamp)
    : new Date(timeRange.start);

  return {
    start: startDate.toISOString(),
    end: new Date(timeRange.end).toISOString(),
  };
}

/**
 * 更新訂閱的游標與去重狀態
 *
 * @param {LiveLogSubscriptionState} subscriptionState 訂閱狀態
 * @param {Array<{recordId: string, timestamp: string, source: object}>} records 記錄
 */
function updateSubscriptionCursorState(subscriptionState, records) {
  if (records.length === 0) {
    return;
  }

  const lastRecord = records[records.length - 1];
  const lastTimestampInMilliseconds = new Date(lastRecord.timestamp).getTime();
  const recordIdsForTimestamp = records
    .filter((record) => record.timestamp === lastRecord.timestamp)
    .map((record) => record.recordId);

  subscriptionState.cursor = {
    timestamp: lastRecord.timestamp,
    lastRecordId: lastRecord.recordId,
  };
  subscriptionState.lastDeliveredTimestampInMilliseconds =
    lastTimestampInMilliseconds;
  subscriptionState.deliveredRecordIdsForTimestamp = new Set(
    recordIdsForTimestamp,
  );
}

/**
 * 根據游標過濾已送出記錄
 *
 * @param {LiveLogSubscriptionState} subscriptionState 訂閱狀態
 * @param {Array<{recordId: string, timestamp: string, source: object}>} records 記錄
 * @returns {Array<{recordId: string, timestamp: string, source: object}>} 可推送記錄
 */
function filterRecordsByCursor(subscriptionState, records) {
  if (!subscriptionState.cursor) {
    return records;
  }

  const cursorTimestamp = new Date(
    subscriptionState.cursor.timestamp,
  ).getTime();

  return records.filter((record) => {
    const recordTimestamp = new Date(record.timestamp).getTime();
    if (Number.isNaN(recordTimestamp)) {
      return false;
    }

    if (recordTimestamp > cursorTimestamp) {
      return true;
    }

    if (recordTimestamp < cursorTimestamp) {
      return false;
    }

    if (
      subscriptionState.lastDeliveredTimestampInMilliseconds ===
      recordTimestamp
    ) {
      return !subscriptionState.deliveredRecordIdsForTimestamp.has(
        record.recordId,
      );
    }

    return record.recordId !== subscriptionState.cursor.lastRecordId;
  });
}

/**
 * Live Log 即時串流服務
 *
 * 業務背景：前端需要即時篩選與切換條件，後端透過 WebSocket 提供
 * snapshot / update / heartbeat / error 事件，並以 cursor 支援續讀。
 *
 * 依賴：
 * - ELK MCP Client（elkMCPClient）
 * - 各產品的 index + fieldMapping + timestampField
 *
 * 邊界條件：
 * - 連線長時間無互動會被清理
 * - ELK 查詢失敗會回傳 error 事件
 */
class LiveLogStreamService {
  constructor() {
    /** @type {Map<WebSocket, LiveLogConnectionState>} */
    this.connectionStateByWebSocket = new Map();
  }

  /**
   * 建立 WebSocket 連線的訂閱管理
   *
   * @param {WebSocket} webSocketConnection WebSocket 連線
   * @param {import('http').IncomingMessage} request 升級請求
   */
  handleWebSocketConnection(webSocketConnection, request) {
    const connectionState = this.initializeConnectionState(webSocketConnection);

    console.log(
      '🔌 Live Log WebSocket 連線建立',
      request?.socket?.remoteAddress || '未知來源',
    );

    webSocketConnection.on('message', (rawMessage) => {
      this.handleIncomingMessage(webSocketConnection, rawMessage);
    });

    webSocketConnection.on('pong', () => {
      connectionState.lastClientActivityAtInMilliseconds = Date.now();
    });

    webSocketConnection.on('close', () => {
      this.cleanupConnection(webSocketConnection, '連線已關閉');
    });

    webSocketConnection.on('error', (error) => {
      console.error('❌ Live Log WebSocket 錯誤:', error.message);
      this.cleanupConnection(webSocketConnection, '連線發生錯誤');
    });

    this.startHeartbeatForConnection(webSocketConnection, connectionState);
  }

  /**
   * 初始化連線狀態
   *
   * @param {WebSocket} webSocketConnection WebSocket 連線
   * @returns {LiveLogConnectionState} 連線狀態
   */
  initializeConnectionState(webSocketConnection) {
    const connectionState = {
      subscriptionsById: new Map(),
      lastClientActivityAtInMilliseconds: Date.now(),
      heartbeatTimer: null,
    };

    this.connectionStateByWebSocket.set(webSocketConnection, connectionState);
    return connectionState;
  }

  /**
   * 啟動心跳與閒置清理
   *
   * @param {WebSocket} webSocketConnection WebSocket 連線
   * @param {LiveLogConnectionState} connectionState 連線狀態
   */
  startHeartbeatForConnection(webSocketConnection, connectionState) {
    if (connectionState.heartbeatTimer) {
      clearInterval(connectionState.heartbeatTimer);
    }

    connectionState.heartbeatTimer = setInterval(() => {
      const now = Date.now();
      const idleDuration =
        now - connectionState.lastClientActivityAtInMilliseconds;

      if (idleDuration > CONNECTION_IDLE_TIMEOUT_MILLISECONDS) {
        this.sendErrorEvent(webSocketConnection, {
          message: '連線閒置過久，已自動中止',
          code: 'CONNECTION_IDLE_TIMEOUT',
        });
        webSocketConnection.close();
        return;
      }

      this.sendHeartbeatEvent(webSocketConnection);
    }, HEARTBEAT_INTERVAL_MILLISECONDS);
  }

  /**
   * 處理 Client 訊息
   *
   * @param {WebSocket} webSocketConnection WebSocket 連線
   * @param {Buffer|string} rawMessage 原始訊息
   */
  handleIncomingMessage(webSocketConnection, rawMessage) {
    const connectionState =
      this.connectionStateByWebSocket.get(webSocketConnection);
    if (!connectionState) {
      return;
    }

    connectionState.lastClientActivityAtInMilliseconds = Date.now();

    let messageText = '';
    if (Buffer.isBuffer(rawMessage)) {
      messageText = rawMessage.toString('utf8');
    } else if (typeof rawMessage === 'string') {
      messageText = rawMessage;
    } else if (rawMessage instanceof ArrayBuffer) {
      messageText = Buffer.from(rawMessage).toString('utf8');
    } else if (ArrayBuffer.isView(rawMessage)) {
      messageText = Buffer.from(rawMessage.buffer).toString('utf8');
    }

    if (!messageText) {
      this.sendErrorEvent(webSocketConnection, {
        message: '收到空白訊息，無法解析',
        code: 'EMPTY_MESSAGE',
      });
      return;
    }

    let parsedMessage;
    try {
      parsedMessage = JSON.parse(messageText);
    } catch (error) {
      this.sendErrorEvent(webSocketConnection, {
        message: '訊息格式錯誤，無法解析 JSON',
        code: 'INVALID_JSON',
      });
      return;
    }

    let validatedMessage;
    try {
      validatedMessage = LIVE_LOG_CLIENT_MESSAGE_SCHEMA.parse(parsedMessage);
    } catch (error) {
      this.sendErrorEvent(webSocketConnection, {
        message: '訊息結構不符合協議',
        code: 'INVALID_MESSAGE_SCHEMA',
      });
      return;
    }

    switch (validatedMessage.action) {
      case 'subscribe':
        this.registerSubscription(webSocketConnection, validatedMessage);
        break;
      case 'update_filters':
        this.updateSubscription(webSocketConnection, validatedMessage);
        break;
      case 'unsubscribe':
        this.removeSubscription(webSocketConnection, validatedMessage);
        break;
      case 'ping':
        this.sendHeartbeatEvent(webSocketConnection);
        break;
      default:
        this.sendErrorEvent(webSocketConnection, {
          message: '不支援的訊息類型',
          code: 'UNSUPPORTED_ACTION',
        });
    }
  }

  /**
   * 建立或覆蓋訂閱
   *
   * @param {WebSocket} webSocketConnection WebSocket 連線
   * @param {z.infer<typeof LIVE_LOG_SUBSCRIBE_MESSAGE_SCHEMA>} message 訂閱訊息
   */
  registerSubscription(webSocketConnection, message) {
    const connectionState =
      this.connectionStateByWebSocket.get(webSocketConnection);
    if (!connectionState) {
      return;
    }

    if (connectionState.subscriptionsById.has(message.subscriptionId)) {
      this.clearSubscriptionState(
        connectionState.subscriptionsById.get(message.subscriptionId),
      );
    }

    const resolvedIntervalMilliseconds = this.resolvePollingInterval(
      message.intervalMilliseconds,
    );
    const resolvedTimeRange = message.timeRange || DEFAULT_TIME_RANGE;

    const subscriptionState = {
      subscriptionId: message.subscriptionId,
      productType: message.productType,
      timeRange: resolvedTimeRange,
      filters: message.filters,
      intervalMilliseconds: resolvedIntervalMilliseconds,
      cursor: message.cursor,
      pollingTimer: null,
      isPolling: false,
      lastDeliveredTimestampInMilliseconds: null,
      deliveredRecordIdsForTimestamp: new Set(),
    };

    connectionState.subscriptionsById.set(
      message.subscriptionId,
      subscriptionState,
    );

    this.sendSnapshotForSubscription(webSocketConnection, subscriptionState);
    this.startPollingForSubscription(webSocketConnection, subscriptionState);
  }

  /**
   * 更新訂閱條件
   *
   * @param {WebSocket} webSocketConnection WebSocket 連線
   * @param {z.infer<typeof LIVE_LOG_UPDATE_FILTERS_MESSAGE_SCHEMA>} message 更新訊息
   */
  updateSubscription(webSocketConnection, message) {
    const connectionState =
      this.connectionStateByWebSocket.get(webSocketConnection);
    if (!connectionState) {
      return;
    }

    const subscriptionState =
      connectionState.subscriptionsById.get(message.subscriptionId);
    if (!subscriptionState) {
      this.sendErrorEvent(webSocketConnection, {
        message: '找不到訂閱，無法更新',
        code: 'SUBSCRIPTION_NOT_FOUND',
        subscriptionId: message.subscriptionId,
      });
      return;
    }

    if (message.filters !== undefined) {
      subscriptionState.filters = message.filters;
    }

    if (message.timeRange !== undefined) {
      subscriptionState.timeRange = message.timeRange;
      subscriptionState.cursor = message.cursor;
      subscriptionState.lastDeliveredTimestampInMilliseconds = null;
      subscriptionState.deliveredRecordIdsForTimestamp = new Set();
    }

    if (message.intervalMilliseconds !== undefined) {
      subscriptionState.intervalMilliseconds = this.resolvePollingInterval(
        message.intervalMilliseconds,
      );
      this.startPollingForSubscription(webSocketConnection, subscriptionState);
    }

    if (message.cursor !== undefined) {
      subscriptionState.cursor = message.cursor;
      subscriptionState.lastDeliveredTimestampInMilliseconds = null;
      subscriptionState.deliveredRecordIdsForTimestamp = new Set();
    }

    this.sendSnapshotForSubscription(webSocketConnection, subscriptionState);
  }

  /**
   * 取消訂閱
   *
   * @param {WebSocket} webSocketConnection WebSocket 連線
   * @param {z.infer<typeof LIVE_LOG_UNSUBSCRIBE_MESSAGE_SCHEMA>} message 取消訊息
   */
  removeSubscription(webSocketConnection, message) {
    const connectionState =
      this.connectionStateByWebSocket.get(webSocketConnection);
    if (!connectionState) {
      return;
    }

    const subscriptionState =
      connectionState.subscriptionsById.get(message.subscriptionId);

    if (subscriptionState) {
      this.clearSubscriptionState(subscriptionState);
      connectionState.subscriptionsById.delete(message.subscriptionId);
    }
  }

  /**
   * 啟動訂閱輪詢
   *
   * @param {WebSocket} webSocketConnection WebSocket 連線
   * @param {LiveLogSubscriptionState} subscriptionState 訂閱狀態
   */
  startPollingForSubscription(webSocketConnection, subscriptionState) {
    if (subscriptionState.pollingTimer) {
      clearInterval(subscriptionState.pollingTimer);
    }

    subscriptionState.pollingTimer = setInterval(() => {
      this.pollSubscription(webSocketConnection, subscriptionState);
    }, subscriptionState.intervalMilliseconds);
  }

  /**
   * 清理訂閱狀態
   *
   * @param {LiveLogSubscriptionState|undefined} subscriptionState 訂閱狀態
   */
  clearSubscriptionState(subscriptionState) {
    if (!subscriptionState) {
      return;
    }

    if (subscriptionState.pollingTimer) {
      clearInterval(subscriptionState.pollingTimer);
    }
  }

  /**
   * 執行訂閱輪詢並推送更新
   *
   * @param {WebSocket} webSocketConnection WebSocket 連線
   * @param {LiveLogSubscriptionState} subscriptionState 訂閱狀態
   */
  async pollSubscription(webSocketConnection, subscriptionState) {
    if (subscriptionState.isPolling) {
      return;
    }

    subscriptionState.isPolling = true;

    try {
      const { records } = await this.fetchLiveLogRecords(subscriptionState);
      if (records.length === 0) {
        return;
      }

      updateSubscriptionCursorState(subscriptionState, records);

      this.sendUpdateEvent(webSocketConnection, {
        subscriptionId: subscriptionState.subscriptionId,
        productType: subscriptionState.productType,
        records,
        cursor: subscriptionState.cursor,
      });
    } catch (error) {
      this.sendErrorEvent(webSocketConnection, {
        message: `查詢即時日誌失敗：${error.message}`,
        code: 'ELK_QUERY_FAILED',
        subscriptionId: subscriptionState.subscriptionId,
      });
    } finally {
      subscriptionState.isPolling = false;
    }
  }

  /**
   * 送出 snapshot 事件
   *
   * @param {WebSocket} webSocketConnection WebSocket 連線
   * @param {LiveLogSubscriptionState} subscriptionState 訂閱狀態
   */
  async sendSnapshotForSubscription(webSocketConnection, subscriptionState) {
    try {
      const { records, totalRecords } =
        await this.fetchLiveLogRecords(subscriptionState, true);

      updateSubscriptionCursorState(subscriptionState, records);

      this.sendSnapshotEvent(webSocketConnection, {
        subscriptionId: subscriptionState.subscriptionId,
        productType: subscriptionState.productType,
        records,
        cursor: subscriptionState.cursor,
        totalRecords,
      });
    } catch (error) {
      this.sendErrorEvent(webSocketConnection, {
        message: `取得快照失敗：${error.message}`,
        code: 'SNAPSHOT_FAILED',
        subscriptionId: subscriptionState.subscriptionId,
      });
    }
  }

  /**
   * 查詢 ELK 並組裝記錄
   *
   * @param {LiveLogSubscriptionState} subscriptionState 訂閱狀態
   * @param {boolean} isSnapshot 是否為 snapshot
   * @returns {Promise<{records: Array<{recordId: string, timestamp: string, source: object}>, totalRecords: number}>}
   */
  async fetchLiveLogRecords(subscriptionState, isSnapshot = false) {
    const productConfiguration =
      LIVE_LOG_PRODUCT_CONFIGURATION_BY_TYPE[subscriptionState.productType];
    if (!productConfiguration) {
      throw new Error('找不到產品配置');
    }

    const timeRange = resolveTimeRange(
      subscriptionState.timeRange,
      subscriptionState.cursor,
    );

    const elkResponse = await elkMCPClient.queryElasticsearch(timeRange, {
      indexPattern: productConfiguration.config.index,
      fieldMapping: productConfiguration.fieldMapping,
      timestampField: productConfiguration.config.timestampField,
      ...(subscriptionState.filters || {}),
    });

    const transformedRecords = transformElkHitsToLiveLogRecords(
      elkResponse.hits || [],
      productConfiguration.config.timestampField,
    );

    const sortedRecords = sortLiveLogRecordsByTimestamp(transformedRecords);

    const filteredRecords = filterRecordsByCursor(
      subscriptionState,
      sortedRecords,
    );

    const records = isSnapshot
      ? limitSnapshotRecords(filteredRecords, MAXIMUM_SNAPSHOT_RECORDS)
      : filteredRecords;

    return {
      records,
      totalRecords: elkResponse.total || records.length,
    };
  }

  /**
   * 計算輪詢間隔
   *
   * @param {number|undefined} intervalMilliseconds 使用者指定間隔
   * @returns {number} 實際間隔
   */
  resolvePollingInterval(intervalMilliseconds) {
    if (intervalMilliseconds === undefined) {
      return DEFAULT_POLLING_INTERVAL_MILLISECONDS;
    }

    if (intervalMilliseconds < MINIMUM_POLLING_INTERVAL_MILLISECONDS) {
      return MINIMUM_POLLING_INTERVAL_MILLISECONDS;
    }

    if (intervalMilliseconds > MAXIMUM_POLLING_INTERVAL_MILLISECONDS) {
      return MAXIMUM_POLLING_INTERVAL_MILLISECONDS;
    }

    return intervalMilliseconds;
  }

  /**
   * 發送 snapshot 事件
   *
   * @param {WebSocket} webSocketConnection WebSocket 連線
   * @param {{subscriptionId: string, productType: string, records: Array, cursor: object|undefined, totalRecords: number}} payload
   */
  sendSnapshotEvent(webSocketConnection, payload) {
    if (!isWebSocketConnectionOpen(webSocketConnection)) {
      return;
    }

    const eventPayload = LIVE_LOG_SNAPSHOT_EVENT_SCHEMA.parse({
      event: 'snapshot',
      subscriptionId: payload.subscriptionId,
      productType: payload.productType,
      records: payload.records,
      cursor: payload.cursor,
      receivedAt: new Date().toISOString(),
      stats: {
        totalRecords: payload.totalRecords,
      },
    });

    webSocketConnection.send(JSON.stringify(eventPayload));
  }

  /**
   * 發送 update 事件
   *
   * @param {WebSocket} webSocketConnection WebSocket 連線
   * @param {{subscriptionId: string, productType: string, records: Array, cursor: object|undefined}} payload
   */
  sendUpdateEvent(webSocketConnection, payload) {
    if (!isWebSocketConnectionOpen(webSocketConnection)) {
      return;
    }

    const eventPayload = LIVE_LOG_UPDATE_EVENT_SCHEMA.parse({
      event: 'update',
      subscriptionId: payload.subscriptionId,
      productType: payload.productType,
      records: payload.records,
      cursor: payload.cursor,
      receivedAt: new Date().toISOString(),
    });

    webSocketConnection.send(JSON.stringify(eventPayload));
  }

  /**
   * 發送 heartbeat 事件
   *
   * @param {WebSocket} webSocketConnection WebSocket 連線
   */
  sendHeartbeatEvent(webSocketConnection) {
    if (!isWebSocketConnectionOpen(webSocketConnection)) {
      return;
    }

    const eventPayload = LIVE_LOG_HEARTBEAT_EVENT_SCHEMA.parse({
      event: 'heartbeat',
      serverTime: new Date().toISOString(),
    });

    webSocketConnection.send(JSON.stringify(eventPayload));
  }

  /**
   * 發送 error 事件
   *
   * @param {WebSocket} webSocketConnection WebSocket 連線
   * @param {{message: string, code?: string, subscriptionId?: string}} payload
   */
  sendErrorEvent(webSocketConnection, payload) {
    if (!isWebSocketConnectionOpen(webSocketConnection)) {
      return;
    }

    const eventPayload = LIVE_LOG_ERROR_EVENT_SCHEMA.parse({
      event: 'error',
      message: payload.message,
      code: payload.code,
      subscriptionId: payload.subscriptionId,
    });

    webSocketConnection.send(JSON.stringify(eventPayload));
  }

  /**
   * 清理連線資源
   *
   * @param {WebSocket} webSocketConnection WebSocket 連線
   * @param {string} reason 清理原因
   */
  cleanupConnection(webSocketConnection, reason) {
    const connectionState =
      this.connectionStateByWebSocket.get(webSocketConnection);
    if (!connectionState) {
      return;
    }

    console.log('🔌 Live Log WebSocket 清理:', reason);

    connectionState.subscriptionsById.forEach((subscriptionState) => {
      this.clearSubscriptionState(subscriptionState);
    });

    if (connectionState.heartbeatTimer) {
      clearInterval(connectionState.heartbeatTimer);
    }

    this.connectionStateByWebSocket.delete(webSocketConnection);
  }
}

module.exports = {
  LiveLogStreamService,
  LIVE_LOG_CLIENT_MESSAGE_SCHEMA,
  LIVE_LOG_SNAPSHOT_EVENT_SCHEMA,
  LIVE_LOG_UPDATE_EVENT_SCHEMA,
  LIVE_LOG_HEARTBEAT_EVENT_SCHEMA,
  LIVE_LOG_ERROR_EVENT_SCHEMA,
};
