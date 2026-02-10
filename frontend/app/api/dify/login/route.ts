/**
 * Dify 登入代理 API Route
 *
 * 業務背景：前端需要透過 Dify 登入以取得 session cookie，
 * 用於 iframe 內嵌 Dify Workflow 頁面的自動登入。
 * 由後端代理呼叫 Dify API，避免 CORS 問題及前端暴露帳密。
 *
 * 資料流：前端 → Next.js API Route → Dify Console API
 *
 * 依賴：
 * - NEXT_PUBLIC_DIFY_URL：Dify 服務基礎 URL（也用於 iframe）
 * - DIFY_EMAIL：Dify 登入帳號（伺服器端環境變數）
 * - DIFY_PWD：Dify 登入密碼（伺服器端環境變數）
 */

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST() {
  const difyBaseUrl = process.env.NEXT_PUBLIC_DIFY_URL;
  const difyEmail = process.env.DIFY_EMAIL;
  const difyPassword = process.env.DIFY_PWD;

  if (!difyBaseUrl) {
    console.error('❌ NEXT_PUBLIC_DIFY_URL 未設定');
    return NextResponse.json(
      { success: false, error: 'Dify URL 未設定' },
      { status: 500 },
    );
  }

  if (!difyEmail || !difyPassword) {
    console.error('❌ DIFY_EMAIL 或 DIFY_PWD 未設定');
    return NextResponse.json(
      { success: false, error: 'Dify 登入憑證未設定' },
      { status: 500 },
    );
  }

  const loginUrl = `${difyBaseUrl}/console/api/login`;
  console.log('🌐 [Server] 呼叫 Dify 登入 API:', loginUrl);

  try {
    const response = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: difyEmail,
        language: 'zh-Hant',
        password: difyPassword,
        remember_me: true,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ [Server] Dify 登入成功');

      // 轉發 Dify 回傳的 Set-Cookie 標頭，讓瀏覽器儲存 session cookie
      const responseHeaders = new Headers();
      responseHeaders.set('Content-Type', 'application/json');

      const setCookie = response.headers.get('set-cookie');
      if (setCookie) {
        responseHeaders.set('set-cookie', setCookie);
      }

      return new Response(JSON.stringify({ success: true, data }), {
        status: 200,
        headers: responseHeaders,
      });
    }

    console.error('❌ [Server] Dify 登入失敗:', data);
    return NextResponse.json(
      { success: false, error: data.message || 'Dify 登入失敗' },
      { status: response.status },
    );
  } catch (error) {
    console.error('⚠️ [Server] Dify API 調用錯誤:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Dify API 連線失敗',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 502 },
    );
  }
}
