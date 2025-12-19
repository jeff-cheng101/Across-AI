// backend/utils/llm/openaiCompatible.js
// OpenAI-compatible LLM 呼叫工具：支援併發限制 + 重試/退避（含 Retry-After）
//
// 目標：
// - 避免瞬間併發導致 429
// - 針對 429/5xx/408 等暫時性錯誤自動重試
// - 失敗時讓上層決定要 fallback 或回傳錯誤

/**
 * @typedef {Object} LLMCallOptions
 * @property {string} key 用於併發限制的 key（通常用 baseURL）
 * @property {number} [maxConcurrency=2]
 * @property {number} [maxRetries=3] 額外重試次數（不含第一次）
 * @property {number} [baseDelayMs=500]
 * @property {number} [maxDelayMs=8000]
 * @property {AbortSignal} [signal]
 * @property {(msg: string) => void} [log]
 */

const limiters = new Map();

function getLimiter(key, maxConcurrency) {
  const normalizedKey = key || 'default';
  const limit = Number.isFinite(maxConcurrency) && maxConcurrency > 0 ? maxConcurrency : 2;

  const existing = limiters.get(normalizedKey);
  if (existing && existing.limit === limit) return existing;

  const limiter = {
    limit,
    inFlight: 0,
    queue: [],
  };

  limiters.set(normalizedKey, limiter);
  return limiter;
}

async function sleep(ms, signal) {
  if (!ms || ms <= 0) return;
  if (signal?.aborted) {
    const err = new Error('Aborted');
    err.name = 'AbortError';
    throw err;
  }

  await new Promise((resolve, reject) => {
    const t = setTimeout(resolve, ms);
    const onAbort = () => {
      clearTimeout(t);
      const err = new Error('Aborted');
      err.name = 'AbortError';
      reject(err);
    };
    if (signal) signal.addEventListener('abort', onAbort, { once: true });
  });
}

async function withConcurrencyLimit(key, maxConcurrency, fn) {
  const limiter = getLimiter(key, maxConcurrency);

  if (limiter.inFlight < limiter.limit) {
    limiter.inFlight++;
    try {
      return await fn();
    } finally {
      limiter.inFlight--;
      const next = limiter.queue.shift();
      if (next) next();
    }
  }

  await new Promise((resolve) => limiter.queue.push(resolve));
  return withConcurrencyLimit(key, maxConcurrency, fn);
}

function getStatus(err) {
  return err?.status ?? err?.response?.status ?? err?.statusCode;
}

function isRetryableStatus(status) {
  return (
    status === 408 ||
    status === 409 ||
    status === 429 ||
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504
  );
}

function parseRetryAfterToMs(retryAfterValue) {
  if (!retryAfterValue) return null;
  // RFC: seconds or HTTP date
  const asSeconds = Number(retryAfterValue);
  if (Number.isFinite(asSeconds) && asSeconds >= 0) return Math.ceil(asSeconds * 1000);

  const asDate = Date.parse(retryAfterValue);
  if (!Number.isNaN(asDate)) {
    const delta = asDate - Date.now();
    return delta > 0 ? delta : 0;
  }

  return null;
}

function getRetryAfterMs(err) {
  const headers = err?.headers;
  if (headers && typeof headers.get === 'function') {
    return (
      parseRetryAfterToMs(headers.get('retry-after')) ??
      parseRetryAfterToMs(headers.get('Retry-After'))
    );
  }
  return null;
}

function computeBackoffMs(attemptIndex, baseDelayMs, maxDelayMs) {
  const base = Number.isFinite(baseDelayMs) && baseDelayMs > 0 ? baseDelayMs : 500;
  const max = Number.isFinite(maxDelayMs) && maxDelayMs > 0 ? maxDelayMs : 8000;

  // Full jitter exponential backoff: random(0, min(max, base*2^attempt))
  const cap = Math.min(max, base * Math.pow(2, attemptIndex));
  return Math.floor(Math.random() * cap);
}

/**
 * 呼叫 OpenAI-compatible chat completion，帶併發限制與重試。
 *
 * @template T
 * @param {() => Promise<T>} callFn 實際呼叫（例如 openai.chat.completions.create）
 * @param {LLMCallOptions} options
 * @returns {Promise<T>}
 */
async function callWithRetry(callFn, options) {
  const {
    key,
    maxConcurrency = 2,
    maxRetries = 3,
    baseDelayMs = 500,
    maxDelayMs = 8000,
    signal,
    log,
  } = options || {};

  return await withConcurrencyLimit(key, maxConcurrency, async () => {
    let lastErr;
    const totalAttempts = Math.max(1, (Number.isFinite(maxRetries) ? maxRetries : 0) + 1);

    for (let attempt = 0; attempt < totalAttempts; attempt++) {
      try {
        if (attempt > 0 && typeof log === 'function') {
          log(`🔄 LLM 重試中：第 ${attempt + 1}/${totalAttempts} 次`);
        }
        return await callFn();
      } catch (err) {
        lastErr = err;
        const status = getStatus(err);

        // AbortError：直接拋出，交由上層處理 timeout/fallback
        if (err?.name === 'AbortError') throw err;

        // 非可重試狀態：直接拋出
        if (!isRetryableStatus(status)) throw err;

        // 已用盡重試：拋出最後錯誤
        if (attempt >= totalAttempts - 1) throw err;

        // 決定等待時間：優先 Retry-After，否則 exponential backoff + jitter
        const retryAfterMs = getRetryAfterMs(err);
        const waitMs =
          retryAfterMs != null
            ? Math.min(retryAfterMs, maxDelayMs)
            : computeBackoffMs(attempt, baseDelayMs, maxDelayMs);

        if (typeof log === 'function') {
          log(
            `⏳ LLM 暫時性錯誤（status=${status ?? 'unknown'}），等待 ${waitMs}ms 後重試...`,
          );
        }

        await sleep(waitMs, signal);
      }
    }

    // 理論上不會到這裡
    throw lastErr;
  });
}

module.exports = {
  callWithRetry,
  // export for tests/diagnostics if needed
  _internal: {
    getStatus,
    isRetryableStatus,
    parseRetryAfterToMs,
  },
};


