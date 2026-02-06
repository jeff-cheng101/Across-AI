import { z } from 'zod';

// ============================================================
// WebSocket 協議定義（Client ↔ Server）
// ============================================================

export const LiveLogProductTypeSchema = z.enum([
  'cloudflare',
  'f5',
  'checkpoint',
]);

export const LiveLogRelativeTimeRangeSchema = z
  .string()
  .regex(/^\d+[mhd]$/, '時間範圍格式需為 10m / 1h / 7d');

export const LiveLogAbsoluteTimeRangeSchema = z.object({
  start: z.string().datetime(),
  end: z.string().datetime(),
});

export const LiveLogTimeRangeSchema = z.union([
  LiveLogRelativeTimeRangeSchema,
  LiveLogAbsoluteTimeRangeSchema,
]);

export const LiveLogFiltersSchema = z
  .object({
    clientIp: z.string().min(1).optional(),
    securityAction: z.string().min(1).optional(),
    minWafScore: z.number().int().min(0).optional(),
  })
  .strict();

export const LiveLogCursorSchema = z.object({
  timestamp: z.string().datetime(),
  lastRecordId: z.string().min(1).optional(),
});

export const LiveLogSubscribeMessageSchema = z.object({
  action: z.literal('subscribe'),
  subscriptionId: z.string().min(1),
  productType: LiveLogProductTypeSchema,
  timeRange: LiveLogTimeRangeSchema.optional(),
  filters: LiveLogFiltersSchema.optional(),
  intervalMilliseconds: z.number().int().min(2000).max(60000).optional(),
  cursor: LiveLogCursorSchema.optional(),
});

export const LiveLogUpdateFiltersMessageSchema = z.object({
  action: z.literal('update_filters'),
  subscriptionId: z.string().min(1),
  timeRange: LiveLogTimeRangeSchema.optional(),
  filters: LiveLogFiltersSchema.optional(),
  intervalMilliseconds: z.number().int().min(2000).max(60000).optional(),
  cursor: LiveLogCursorSchema.optional(),
});

export const LiveLogUnsubscribeMessageSchema = z.object({
  action: z.literal('unsubscribe'),
  subscriptionId: z.string().min(1),
});

export const LiveLogPingMessageSchema = z.object({
  action: z.literal('ping'),
});

export const LiveLogClientMessageSchema = z.union([
  LiveLogSubscribeMessageSchema,
  LiveLogUpdateFiltersMessageSchema,
  LiveLogUnsubscribeMessageSchema,
  LiveLogPingMessageSchema,
]);

export const LiveLogRecordSchema = z.object({
  recordId: z.string().min(1),
  timestamp: z.string().datetime(),
  source: z.record(z.unknown()),
});

export const LiveLogSnapshotEventSchema = z.object({
  event: z.literal('snapshot'),
  subscriptionId: z.string().min(1),
  productType: LiveLogProductTypeSchema,
  records: z.array(LiveLogRecordSchema),
  cursor: LiveLogCursorSchema.optional(),
  receivedAt: z.string().datetime(),
  stats: z
    .object({
      totalRecords: z.number().int().min(0),
    })
    .optional(),
});

export const LiveLogUpdateEventSchema = z.object({
  event: z.literal('update'),
  subscriptionId: z.string().min(1),
  productType: LiveLogProductTypeSchema,
  records: z.array(LiveLogRecordSchema),
  cursor: LiveLogCursorSchema.optional(),
  receivedAt: z.string().datetime(),
});

export const LiveLogHeartbeatEventSchema = z.object({
  event: z.literal('heartbeat'),
  serverTime: z.string().datetime(),
});

export const LiveLogErrorEventSchema = z.object({
  event: z.literal('error'),
  message: z.string().min(1),
  code: z.string().min(1).optional(),
  subscriptionId: z.string().min(1).optional(),
});

export const LiveLogServerEventSchema = z.union([
  LiveLogSnapshotEventSchema,
  LiveLogUpdateEventSchema,
  LiveLogHeartbeatEventSchema,
  LiveLogErrorEventSchema,
]);

export type LiveLogProductType = z.infer<typeof LiveLogProductTypeSchema>;
export type LiveLogTimeRange = z.infer<typeof LiveLogTimeRangeSchema>;
export type LiveLogFilters = z.infer<typeof LiveLogFiltersSchema>;
export type LiveLogCursor = z.infer<typeof LiveLogCursorSchema>;
export type LiveLogRecord = z.infer<typeof LiveLogRecordSchema>;
export type LiveLogSubscribeMessage = z.infer<
  typeof LiveLogSubscribeMessageSchema
>;
export type LiveLogUpdateFiltersMessage = z.infer<
  typeof LiveLogUpdateFiltersMessageSchema
>;
export type LiveLogClientMessage = z.infer<typeof LiveLogClientMessageSchema>;
export type LiveLogServerEvent = z.infer<typeof LiveLogServerEventSchema>;

export type LiveLogConnectionStatus =
  | 'idle'
  | 'connecting'
  | 'open'
  | 'closed'
  | 'error';

export type LiveLogStreamClient = {
  connect: () => void;
  close: () => void;
  subscribe: (message: LiveLogSubscribeMessage) => void;
  updateFilters: (message: LiveLogUpdateFiltersMessage) => void;
  unsubscribe: (subscriptionId: string) => void;
  sendPing: () => void;
  getStatus: () => LiveLogConnectionStatus;
};

export type LiveLogStreamClientOptions = {
  webSocketUrl?: string;
  onEvent: (event: LiveLogServerEvent) => void;
  onConnectionStatusChange?: (status: LiveLogConnectionStatus) => void;
};

const LIVE_LOG_WEBSOCKET_PATH = '/api/live/logs';

const BACKEND_WEBSOCKET_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_WS_URL;

/**
 * 取得必要的前端環境變數
 *
 * 業務背景：前端需由環境變數提供後端 WebSocket URL，
 * 未設定時要明確拋錯，避免隱性失敗。
 *
 * @returns 後端 WebSocket Base URL
 */
export function getRequiredBackendWebSocketBaseUrl(): string {
  if (!BACKEND_WEBSOCKET_BASE_URL) {
    throw new Error('環境變數 NEXT_PUBLIC_BACKEND_WS_URL 未設定');
  }
  return BACKEND_WEBSOCKET_BASE_URL;
}

/**
 * 將 HTTP Base URL 轉成 WebSocket URL
 *
 * 業務背景：前端環境變數與後端共用時，常以 http(s) 設定。
 * 這裡統一轉換為 ws(s)，避免 WebSocket 連線錯誤。
 *
 * @param baseUrl 原始 Base URL
 * @returns WebSocket Base URL
 */
function normalizeWebSocketBaseUrl(baseUrl: string): string {
  const parsedUrl = new URL(baseUrl);

  if (parsedUrl.protocol === 'http:') {
    parsedUrl.protocol = 'ws:';
  }

  if (parsedUrl.protocol === 'https:') {
    parsedUrl.protocol = 'wss:';
  }

  return parsedUrl.toString();
}

/**
 * 取得 Live Log WebSocket 完整 URL
 *
 * @returns WebSocket URL
 */
export function getLiveLogWebSocketUrl(): string {
  const baseUrl = getRequiredBackendWebSocketBaseUrl();
  const normalizedBaseUrl = normalizeWebSocketBaseUrl(baseUrl);
  return new URL(LIVE_LOG_WEBSOCKET_PATH, normalizedBaseUrl).toString();
}

/**
 * 將 WebSocket 訊息轉換為字串
 *
 * @param rawData 原始資料
 * @returns 訊息字串
 */
export async function resolveWebSocketMessageText(
  rawData: unknown,
): Promise<string> {
  if (typeof rawData === 'string') {
    return rawData;
  }

  if (typeof Blob !== 'undefined' && rawData instanceof Blob) {
    return rawData.text();
  }

  if (rawData instanceof ArrayBuffer) {
    return new TextDecoder().decode(rawData);
  }

  if (ArrayBuffer.isView(rawData)) {
    return new TextDecoder().decode(rawData.buffer);
  }

  return '';
}

/**
 * 建立 Live Log WebSocket Client
 *
 * 業務背景：前端需要統一封裝連線、訂閱、事件解析與錯誤處理流程。
 * 依賴：NEXT_PUBLIC_BACKEND_WS_URL
 *
 * @param options 連線選項
 * @returns LiveLogStreamClient
 */
export function createLiveLogStreamClient(
  options: LiveLogStreamClientOptions,
): LiveLogStreamClient {
  let webSocketConnection: WebSocket | null = null;
  let connectionStatus: LiveLogConnectionStatus = 'idle';

  /**
   * 更新連線狀態並通知外部
   *
   * @param status 新狀態
   */
  function updateConnectionStatus(status: LiveLogConnectionStatus) {
    connectionStatus = status;
    options.onConnectionStatusChange?.(status);
  }

  /**
   * 發送錯誤事件到外部
   *
   * @param message 錯誤訊息
   */
  function emitClientError(message: string) {
    const errorEvent = LiveLogErrorEventSchema.parse({
      event: 'error',
      message,
    });
    options.onEvent(errorEvent);
  }

  /**
   * 解析 Server 事件
   *
   * @param rawMessage 原始事件
   */
  async function handleServerMessage(rawMessage: MessageEvent) {
    const messageText = await resolveWebSocketMessageText(rawMessage.data);
    if (!messageText) {
      emitClientError('收到空白訊息，無法解析');
      return;
    }

    let parsedMessage: unknown;
    try {
      parsedMessage = JSON.parse(messageText);
    } catch (error) {
      emitClientError('訊息格式錯誤，無法解析 JSON');
      return;
    }

    try {
      const validatedEvent = LiveLogServerEventSchema.parse(parsedMessage);
      options.onEvent(validatedEvent);
    } catch (error) {
      emitClientError('訊息結構不符合協議');
    }
  }

  /**
   * 建立 WebSocket 連線
   */
  function connect() {
    if (
      webSocketConnection &&
      (webSocketConnection.readyState === WebSocket.OPEN ||
        webSocketConnection.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    const webSocketUrl = options.webSocketUrl || getLiveLogWebSocketUrl();
    webSocketConnection = new WebSocket(webSocketUrl);
    updateConnectionStatus('connecting');

    webSocketConnection.addEventListener('open', () => {
      updateConnectionStatus('open');
    });

    webSocketConnection.addEventListener('close', () => {
      updateConnectionStatus('closed');
      webSocketConnection = null;
    });

    webSocketConnection.addEventListener('error', () => {
      updateConnectionStatus('error');
    });

    webSocketConnection.addEventListener('message', (event) => {
      void handleServerMessage(event);
    });
  }

  /**
   * 關閉連線
   */
  function close() {
    if (webSocketConnection) {
      webSocketConnection.close();
      webSocketConnection = null;
      updateConnectionStatus('closed');
    }
  }

  /**
   * 發送訊息至伺服器
   *
   * @param message WebSocket 訊息
   */
  function sendClientMessage(message: LiveLogClientMessage) {
    if (!webSocketConnection || webSocketConnection.readyState !== WebSocket.OPEN) {
      emitClientError('連線尚未建立，無法送出訊息');
      return;
    }

    const validatedMessage = LiveLogClientMessageSchema.parse(message);
    webSocketConnection.send(JSON.stringify(validatedMessage));
  }

  /**
   * 訂閱 Live Logs
   *
   * @param message 訂閱訊息
   */
  function subscribe(message: LiveLogSubscribeMessage) {
    sendClientMessage(message);
  }

  /**
   * 更新訂閱條件
   *
   * @param message 更新訊息
   */
  function updateFilters(message: LiveLogUpdateFiltersMessage) {
    sendClientMessage(message);
  }

  /**
   * 取消訂閱
   *
   * @param subscriptionId 訂閱識別碼
   */
  function unsubscribe(subscriptionId: string) {
    sendClientMessage({
      action: 'unsubscribe',
      subscriptionId,
    });
  }

  /**
   * 送出 ping
   */
  function sendPing() {
    sendClientMessage({ action: 'ping' });
  }

  /**
   * 取得目前連線狀態
   *
   * @returns 連線狀態
   */
  function getStatus() {
    return connectionStatus;
  }

  return {
    connect,
    close,
    subscribe,
    updateFilters,
    unsubscribe,
    sendPing,
    getStatus,
  };
}
