/**
 * Backend API Proxy Route Handler
 *
 * 取代 next.config.mjs 中的 rewrites，提供更好的控制：
 * - 無預設 proxy 逾時限制
 * - 支援串流回應轉發
 * - 可自訂 headers
 */

import type { NextRequest } from 'next/server';
import { Agent } from 'undici';

// 建立自訂 Agent，設定較長的 timeout（20 分鐘）
const fetchAgent = new Agent({
  headersTimeout: 1200 * 1000, // 20 分鐘 - 等待收到回應 headers 的時間
  bodyTimeout: 1200 * 1000, // 20 分鐘 - 等待收到回應 body 的時間
  connectTimeout: 30 * 1000, // 30 秒 - 連線建立逾時
});

// 強制動態路由
export const dynamic = 'force-dynamic';

const BACKEND_SERVICE_URL = process.env.BACKEND_SERVICE_URL;

async function proxyRequest(request: NextRequest, path: string[]) {
  if (!BACKEND_SERVICE_URL) {
    return new Response(
      JSON.stringify({ error: 'BACKEND_SERVICE_URL 未設定' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const targetPath = path.join('/');
  const targetUrl = `${BACKEND_SERVICE_URL}/${targetPath}`;

  console.log(`🔄 Proxy: ${request.method} ${targetPath} -> ${targetUrl}`);

  // 複製原始請求的 headers，排除 host
  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (key.toLowerCase() !== 'host') {
      headers.set(key, value);
    }
  });

  try {
    let body: ArrayBuffer | null = null;

    // 只有非 GET/HEAD 請求才讀取 body
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      body = await request.arrayBuffer();
    }

    // 設定 20 分鐘超時，以支援長時間的後端查詢
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200 * 1000); // 20 分鐘

    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: body,
      signal: controller.signal,
      // @ts-expect-error - undici dispatcher 在 Node.js 環境下可用
      dispatcher: fetchAgent,
    });

    clearTimeout(timeoutId);

    console.log(`✅ Proxy response: ${response.status} ${response.statusText}`);

    // 轉發回應 headers
    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      // 排除某些不應轉發的 headers
      if (
        !['content-encoding', 'transfer-encoding'].includes(key.toLowerCase())
      ) {
        responseHeaders.set(key, value);
      }
    });

    // 直接串流轉發回應
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error(`❌ Backend proxy error [${targetPath}]:`, error);
    return new Response(
      JSON.stringify({
        error: 'Backend 連線失敗',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 502, headers: { 'Content-Type': 'application/json' } },
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return proxyRequest(request, path);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return proxyRequest(request, path);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return proxyRequest(request, path);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return proxyRequest(request, path);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return proxyRequest(request, path);
}
