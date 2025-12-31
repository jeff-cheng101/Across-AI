/**
 * Auth Service Proxy Route Handler
 *
 * 取代 next.config.mjs 中的 rewrites，提供更好的控制：
 * - 無預設 proxy 逾時限制
 * - 支援串流回應轉發
 * - 可自訂 headers
 */

import type { NextRequest } from 'next/server';

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;

async function proxyRequest(request: NextRequest, path: string[]) {
  if (!AUTH_SERVICE_URL) {
    return new Response(JSON.stringify({ error: 'AUTH_SERVICE_URL 未設定' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Auth 服務路徑對應：/api/auth/:path* -> /api/internal/:path*
  const targetPath = path.join('/');
  const targetUrl = `${AUTH_SERVICE_URL}/api/internal/${targetPath}`;

  console.log(`🔄 Auth Proxy: ${request.method} ${targetPath} -> ${targetUrl}`);

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

    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: body,
    });

    console.log(
      `✅ Auth Proxy response: ${response.status} ${response.statusText}`,
    );

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
    console.error(`❌ Auth proxy error [${targetPath}]:`, error);
    return new Response(
      JSON.stringify({
        error: 'Auth 服務連線失敗',
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
