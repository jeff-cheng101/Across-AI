'use client';

import { useCallback, useEffect, useRef, useState, type ChangeEvent } from 'react';
import {
  LiveLogProductTypeSchema,
  type LiveLogConnectionStatus,
  type LiveLogCursor,
  type LiveLogFilters,
  type LiveLogProductType,
  type LiveLogRecord,
  type LiveLogServerEvent,
  type LiveLogStreamClient,
  createLiveLogStreamClient,
} from '@/services/live-logs';

const DEFAULT_SUBSCRIPTION_ID = 'live-logs-demo';
const DEFAULT_TIME_RANGE = '1h';
const DEFAULT_INTERVAL_MILLISECONDS = 5000;
const MAXIMUM_DISPLAY_RECORDS = 200;

/**
 * 取得連線狀態文字
 *
 * @param status 連線狀態
 * @returns 顯示文字
 */
function getConnectionStatusLabel(status: LiveLogConnectionStatus): string {
  switch (status) {
    case 'connecting':
      return '連線中';
    case 'open':
      return '已連線';
    case 'closed':
      return '已關閉';
    case 'error':
      return '連線錯誤';
    default:
      return '尚未連線';
  }
}

/**
 * 取得狀態徽章樣式
 *
 * @param status 連線狀態
 * @returns Tailwind class
 */
function getConnectionStatusClass(status: LiveLogConnectionStatus): string {
  switch (status) {
    case 'open':
      return 'bg-emerald-500/20 text-emerald-200';
    case 'connecting':
      return 'bg-amber-500/20 text-amber-200';
    case 'error':
      return 'bg-rose-500/20 text-rose-200';
    case 'closed':
      return 'bg-slate-600/30 text-slate-200';
    default:
      return 'bg-slate-700/30 text-slate-200';
  }
}

/**
 * 合併即時記錄並去重
 *
 * @param existingRecords 已有記錄
 * @param incomingRecords 新記錄
 * @returns 合併後記錄
 */
function mergeLiveLogRecords(
  existingRecords: LiveLogRecord[],
  incomingRecords: LiveLogRecord[],
): LiveLogRecord[] {
  const existingRecordIds = new Set(
    existingRecords.map((record) => record.recordId),
  );
  const uniqueIncomingRecords = incomingRecords.filter(
    (record) => !existingRecordIds.has(record.recordId),
  );
  const mergedRecords = [...existingRecords, ...uniqueIncomingRecords];

  if (mergedRecords.length > MAXIMUM_DISPLAY_RECORDS) {
    return mergedRecords.slice(mergedRecords.length - MAXIMUM_DISPLAY_RECORDS);
  }

  return mergedRecords;
}

/**
 * 建立記錄摘要
 *
 * @param record 記錄資料
 * @returns 摘要文字
 */
function buildRecordSummary(record: LiveLogRecord): string {
  const source = record.source;
  const clientIp =
    source.ClientIP ||
    source.client_ip ||
    source.src ||
    source.src_ip ||
    source.srcaddr;
  const requestPath =
    source.ClientRequestURI ||
    source.ClientRequestPath ||
    source.uri ||
    source.http_request_uri;
  const action =
    source.SecurityAction ||
    source.security_action ||
    source.action ||
    source.attack_type;

  const summaryParts = [
    clientIp ? `來源: ${clientIp}` : null,
    requestPath ? `請求: ${requestPath}` : null,
    action ? `動作: ${action}` : null,
  ].filter((item) => item !== null);

  if (summaryParts.length === 0) {
    return '無可用摘要欄位';
  }

  return summaryParts.join(' | ');
}

/**
 * Live Logs 示範頁面
 *
 * 業務背景：展示 WebSocket 即時串流與篩選流程，驗證後端協議與游標續讀。
 * 依賴：NEXT_PUBLIC_BACKEND_WS_URL
 */
export default function LiveLogsPage() {
  const liveLogClientRef = useRef<LiveLogStreamClient | null>(null);
  const autoSubscribedRef = useRef(false);

  const [connectionStatus, setConnectionStatus] =
    useState<LiveLogConnectionStatus>('idle');
  const [records, setRecords] = useState<LiveLogRecord[]>([]);
  const [latestSnapshotAt, setLatestSnapshotAt] = useState<string | null>(null);
  const [latestUpdateAt, setLatestUpdateAt] = useState<string | null>(null);
  const [latestHeartbeatAt, setLatestHeartbeatAt] = useState<string | null>(null);
  const [cursor, setCursor] = useState<LiveLogCursor | null>(null);
  const [lastErrorMessage, setLastErrorMessage] = useState<string | null>(null);

  const [selectedProductType, setSelectedProductType] =
    useState<LiveLogProductType>('cloudflare');
  const [timeRangeInput, setTimeRangeInput] =
    useState<string>(DEFAULT_TIME_RANGE);
  const [intervalMillisecondsInput, setIntervalMillisecondsInput] = useState(
    String(DEFAULT_INTERVAL_MILLISECONDS),
  );
  const [clientIpFilterInput, setClientIpFilterInput] = useState('');
  const [securityActionFilterInput, setSecurityActionFilterInput] =
    useState('');
  const [minWafScoreFilterInput, setMinWafScoreFilterInput] = useState('');

  /**
   * 處理 Live Log 事件
   *
   * @param event 事件內容
   */
  const handleLiveLogEvent = useCallback((event: LiveLogServerEvent) => {
    switch (event.event) {
      case 'snapshot':
        setRecords(event.records);
        setLatestSnapshotAt(event.receivedAt);
        setCursor(event.cursor ?? null);
        setLastErrorMessage(null);
        return;
      case 'update':
        setRecords((previousRecords) =>
          mergeLiveLogRecords(previousRecords, event.records),
        );
        setLatestUpdateAt(event.receivedAt);
        setCursor(event.cursor ?? null);
        return;
      case 'heartbeat':
        setLatestHeartbeatAt(event.serverTime);
        return;
      case 'error':
        setLastErrorMessage(event.message);
        return;
      default:
        return;
    }
  }, []);

  /**
   * 更新連線狀態
   *
   * @param status 連線狀態
   */
  const handleConnectionStatusChange = useCallback(
    (status: LiveLogConnectionStatus) => {
      setConnectionStatus(status);
    },
    [],
  );

  /**
   * 初始化 WebSocket Client
   *
   * @returns 清理函式
   */
  const initializeLiveLogClient = useCallback(() => {
    const liveLogClient = createLiveLogStreamClient({
      onEvent: handleLiveLogEvent,
      onConnectionStatusChange: handleConnectionStatusChange,
    });

    liveLogClientRef.current = liveLogClient;
    liveLogClient.connect();

    return () => {
      liveLogClient.close();
      liveLogClientRef.current = null;
    };
  }, [handleConnectionStatusChange, handleLiveLogEvent]);

  useEffect(() => initializeLiveLogClient(), [initializeLiveLogClient]);

  useEffect(() => {
    if (connectionStatus !== 'open') {
      return;
    }

    if (autoSubscribedRef.current) {
      return;
    }

    autoSubscribedRef.current = true;
    sendSubscribeWithCurrentSettings();
  }, [connectionStatus]);

  /**
   * 解析輪詢間隔輸入
   *
   * @param value 使用者輸入
   * @returns 間隔或 undefined
   */
  function parseIntervalMilliseconds(value: string): number | undefined {
    const parsedValue = Number(value);
    if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
      return undefined;
    }

    return Math.trunc(parsedValue);
  }

  /**
   * 建立篩選條件
   *
   * @returns 篩選條件
   */
  function buildFilters(): LiveLogFilters | undefined {
    const filters: LiveLogFilters = {};

    if (clientIpFilterInput.trim()) {
      filters.clientIp = clientIpFilterInput.trim();
    }

    if (securityActionFilterInput.trim()) {
      filters.securityAction = securityActionFilterInput.trim();
    }

    if (minWafScoreFilterInput.trim()) {
      const parsedScore = Number(minWafScoreFilterInput);
      if (Number.isFinite(parsedScore)) {
        filters.minWafScore = Math.trunc(parsedScore);
      }
    }

    return Object.keys(filters).length > 0 ? filters : undefined;
  }

  /**
   * 送出訂閱訊息
   */
  const sendSubscribeWithCurrentSettings = useCallback(() => {
    const liveLogClient = liveLogClientRef.current;
    if (!liveLogClient) {
      setLastErrorMessage('尚未建立 WebSocket 連線');
      return;
    }

    try {
      liveLogClient.subscribe({
        action: 'subscribe',
        subscriptionId: DEFAULT_SUBSCRIPTION_ID,
        productType: selectedProductType,
        timeRange: timeRangeInput.trim() || DEFAULT_TIME_RANGE,
        filters: buildFilters(),
        intervalMilliseconds: parseIntervalMilliseconds(
          intervalMillisecondsInput,
        ),
      });
    } catch (error) {
      setLastErrorMessage('訂閱失敗，請檢查輸入條件');
    }
  }, [
    intervalMillisecondsInput,
    selectedProductType,
    timeRangeInput,
    clientIpFilterInput,
    securityActionFilterInput,
    minWafScoreFilterInput,
  ]);

  /**
   * 送出更新訊息
   */
  const sendUpdateFiltersWithCurrentSettings = useCallback(() => {
    const liveLogClient = liveLogClientRef.current;
    if (!liveLogClient) {
      setLastErrorMessage('尚未建立 WebSocket 連線');
      return;
    }

    try {
      liveLogClient.updateFilters({
        action: 'update_filters',
        subscriptionId: DEFAULT_SUBSCRIPTION_ID,
        timeRange: timeRangeInput.trim() || DEFAULT_TIME_RANGE,
        filters: buildFilters(),
        intervalMilliseconds: parseIntervalMilliseconds(
          intervalMillisecondsInput,
        ),
      });
    } catch (error) {
      setLastErrorMessage('更新失敗，請檢查輸入條件');
    }
  }, [
    intervalMillisecondsInput,
    timeRangeInput,
    clientIpFilterInput,
    securityActionFilterInput,
    minWafScoreFilterInput,
  ]);

  /**
   * 處理產品類型變更
   *
   * @param event ChangeEvent
   */
  function handleProductTypeChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextValue = LiveLogProductTypeSchema.parse(event.target.value);
    setSelectedProductType(nextValue);
  }

  /**
   * 處理時間範圍輸入
   *
   * @param event ChangeEvent
   */
  function handleTimeRangeChange(event: ChangeEvent<HTMLInputElement>) {
    setTimeRangeInput(event.target.value);
  }

  /**
   * 處理輪詢間隔輸入
   *
   * @param event ChangeEvent
   */
  function handleIntervalChange(event: ChangeEvent<HTMLInputElement>) {
    setIntervalMillisecondsInput(event.target.value);
  }

  /**
   * 處理 IP 篩選輸入
   *
   * @param event ChangeEvent
   */
  function handleClientIpFilterChange(event: ChangeEvent<HTMLInputElement>) {
    setClientIpFilterInput(event.target.value);
  }

  /**
   * 處理安全動作輸入
   *
   * @param event ChangeEvent
   */
  function handleSecurityActionFilterChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    setSecurityActionFilterInput(event.target.value);
  }

  /**
   * 處理 WAF 分數輸入
   *
   * @param event ChangeEvent
   */
  function handleMinWafScoreFilterChange(event: ChangeEvent<HTMLInputElement>) {
    setMinWafScoreFilterInput(event.target.value);
  }

  /**
   * 手動建立連線
   */
  function handleConnectClick() {
    liveLogClientRef.current?.connect();
  }

  /**
   * 手動關閉連線
   */
  function handleDisconnectClick() {
    liveLogClientRef.current?.close();
  }

  /**
   * 送出取消訂閱
   */
  function handleUnsubscribeClick() {
    liveLogClientRef.current?.unsubscribe(DEFAULT_SUBSCRIPTION_ID);
  }

  /**
   * 送出 Ping
   */
  function handlePingClick() {
    liveLogClientRef.current?.sendPing();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold">即時日誌串流</h1>
          <p className="text-sm text-slate-300">
            透過 WebSocket 訂閱即時日誌，支援篩選與游標續讀。
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
            <h2 className="text-lg font-semibold">連線狀態</h2>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span
                className={`rounded-full px-3 py-1 text-xs ${getConnectionStatusClass(
                  connectionStatus,
                )}`}
              >
                {getConnectionStatusLabel(connectionStatus)}
              </span>
              <span className="text-xs text-slate-300">
                最近心跳: {latestHeartbeatAt || '尚未收到'}
              </span>
              <span className="text-xs text-slate-300">
                最近快照: {latestSnapshotAt || '尚未取得'}
              </span>
              <span className="text-xs text-slate-300">
                最近更新: {latestUpdateAt || '尚未更新'}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleConnectClick}
                className="rounded-md bg-blue-500/80 px-3 py-2 text-xs font-semibold hover:bg-blue-500"
              >
                建立連線
              </button>
              <button
                type="button"
                onClick={handleDisconnectClick}
                className="rounded-md bg-slate-700 px-3 py-2 text-xs font-semibold hover:bg-slate-600"
              >
                中止連線
              </button>
              <button
                type="button"
                onClick={sendSubscribeWithCurrentSettings}
                className="rounded-md bg-emerald-500/80 px-3 py-2 text-xs font-semibold hover:bg-emerald-500"
              >
                重新訂閱
              </button>
              <button
                type="button"
                onClick={sendUpdateFiltersWithCurrentSettings}
                className="rounded-md bg-amber-500/80 px-3 py-2 text-xs font-semibold hover:bg-amber-500"
              >
                更新條件
              </button>
              <button
                type="button"
                onClick={handleUnsubscribeClick}
                className="rounded-md bg-rose-500/80 px-3 py-2 text-xs font-semibold hover:bg-rose-500"
              >
                取消訂閱
              </button>
              <button
                type="button"
                onClick={handlePingClick}
                className="rounded-md bg-slate-700 px-3 py-2 text-xs font-semibold hover:bg-slate-600"
              >
                送出 Ping
              </button>
            </div>

            {cursor && (
              <div className="mt-4 rounded-lg border border-slate-800 bg-slate-950/40 p-3 text-xs text-slate-300">
                <p>游標時間: {cursor.timestamp}</p>
                <p>最後記錄: {cursor.lastRecordId || '無'}</p>
              </div>
            )}

            {lastErrorMessage && (
              <div className="mt-4 rounded-lg border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-200">
                {lastErrorMessage}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
            <h2 className="text-lg font-semibold">訂閱條件</h2>
            <div className="mt-4 grid gap-4">
              <label className="flex flex-col gap-2 text-xs text-slate-300">
                產品類型
                <select
                  value={selectedProductType}
                  onChange={handleProductTypeChange}
                  className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                >
                  <option value="cloudflare">Cloudflare WAF</option>
                  <option value="f5">F5 Advanced WAF</option>
                  <option value="checkpoint">Check Point Firewall</option>
                </select>
              </label>

              <label className="flex flex-col gap-2 text-xs text-slate-300">
                時間範圍（相對時間，如 10m / 1h / 7d）
                <input
                  value={timeRangeInput}
                  onChange={handleTimeRangeChange}
                  className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                  placeholder="1h"
                />
              </label>

              <label className="flex flex-col gap-2 text-xs text-slate-300">
                輪詢間隔（毫秒）
                <input
                  value={intervalMillisecondsInput}
                  onChange={handleIntervalChange}
                  className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                  placeholder="5000"
                />
              </label>

              <label className="flex flex-col gap-2 text-xs text-slate-300">
                IP 篩選
                <input
                  value={clientIpFilterInput}
                  onChange={handleClientIpFilterChange}
                  className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                  placeholder="203.0.113.10"
                />
              </label>

              <label className="flex flex-col gap-2 text-xs text-slate-300">
                安全動作
                <input
                  value={securityActionFilterInput}
                  onChange={handleSecurityActionFilterChange}
                  className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                  placeholder="block"
                />
              </label>

              <label className="flex flex-col gap-2 text-xs text-slate-300">
                最低 WAF 分數
                <input
                  value={minWafScoreFilterInput}
                  onChange={handleMinWafScoreFilterChange}
                  className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                  placeholder="80"
                />
              </label>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">最新記錄</h2>
            <span className="text-xs text-slate-300">
              顯示 {records.length} 筆（最多 {MAXIMUM_DISPLAY_RECORDS} 筆）
            </span>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {records.length === 0 && (
              <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4 text-sm text-slate-400">
                尚未收到即時記錄
              </div>
            )}

            {records.map((record) => (
              <details
                key={record.recordId}
                className="rounded-lg border border-slate-800 bg-slate-950/40 p-4"
              >
                <summary className="cursor-pointer text-sm font-medium text-slate-200">
                  {record.timestamp} ｜ {buildRecordSummary(record)}
                </summary>
                <div className="mt-3 text-xs text-slate-300">
                  <p>Record ID: {record.recordId}</p>
                  <pre className="mt-2 max-h-64 overflow-auto rounded bg-slate-900 p-3 text-xs text-slate-200">
                    {JSON.stringify(record.source, null, 2)}
                  </pre>
                </div>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
