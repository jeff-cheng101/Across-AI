/**
 * API Clients - 統一的 axios 實體管理
 *
 * 架構說明：
 * - 使用 Next.js rewrites 進行 API 代理，解決 CORS 問題
 * - authClient: 使用相對路徑 /api/auth，由 next.config.mjs 代理到 AUTH_SERVICE_URL
 * - backendClient: 使用相對路徑 /api/backend，由 next.config.mjs 代理到 BACKEND_SERVICE_URL
 *
 * 環境變數配置（服務端，用於 next.config.mjs）：
 * - AUTH_SERVICE_URL: 認證服務 URL
 * - BACKEND_SERVICE_URL: 後端 API 服務 URL
 *
 * TODO: 考慮重構 API Client 架構
 * 目前所有 API 請求（auth, backend, local）都已透過 Next.js Route Handlers (/api/*) 處理。
 * 理論上可以統一使用一個 base URL 為 /api 的 client 即可，不需要區分 authClient 和 backendClient。
 * 未來可以簡化為單一 client，透過不同路徑前綴 (auth/, backend/, chat/) 區分服務。
 */

import axios, { type AxiosError, type AxiosInstance } from 'axios';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { authSubject } from '@/app/util/authenticator';

// HTTP 狀態碼
const HTTP_STATUS = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
} as const;

// 全局路由跳轉處理器（來自 Next.js useRouter）
let globalRouter: AppRouterInstance | null = null;

export const setGlobalRouter = (router: AppRouterInstance) => {
  globalRouter = router;
};

/**
 * 建立通用的錯誤處理攔截器
 */
const setupResponseInterceptor = (
  client: AxiosInstance,
  handleAuth: boolean = true,
): void => {
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      // 處理未授權錯誤（僅 authClient 需要）
      const status = error.response?.status;
      const isAuthError =
        status === HTTP_STATUS.UNAUTHORIZED || status === HTTP_STATUS.FORBIDDEN;

      if (handleAuth && error.response && isAuthError) {
        const url = error.response.config?.url || '';
        if (!url.includes('logout')) {
          console.log('Unauthorized access detected, triggering logout...');
          authSubject.next({
            loginState: false,
            message: '登入已過期，請重新登入',
          });

          // 使用 Next.js 路由跳轉
          if (globalRouter) {
            globalRouter.push('/');
          } else if (typeof window !== 'undefined') {
            window.location.href = '/';
          }
        }
      }

      return Promise.reject(error);
    },
  );
};

/**
 * Auth Client - 認證服務
 * 用於：登入、用戶管理、票據、系統設定、合約等
 *
 * Base URL: /api/auth
 * 實際代理到: ${AUTH_SERVICE_URL}/api/internal (由 next.config.mjs 的 rewrites 處理)
 */
export const authClient: AxiosInstance = axios.create({
  baseURL: '/api/auth',
  timeout: 300000,
  withCredentials: true,
});

setupResponseInterceptor(authClient, true);

/**
 * Backend Client - 後端 API 服務
 * 用於：AI 分析、報告生成、Workflow 等
 *
 * Base URL: /api/backend
 * 實際代理到: ${BACKEND_SERVICE_URL}/api (由 next.config.mjs 的 rewrites 處理)
 */
export const backendClient: AxiosInstance = axios.create({
  baseURL: '/api/backend',
  timeout: 1200 * 1000, // 20 分鐘
  withCredentials: true,
});

setupResponseInterceptor(backendClient, false);

/**
 * Next.js Client - Next.js Route Handlers
 * 用於：呼叫 Next.js 內部的 API Route Handlers (/api/*)
 *
 * 適用於非串流的 API 呼叫，串流 API 應直接使用 fetch
 *
 * Base URL: /api
 */
export const nextClient: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 30000,
  withCredentials: true,
});

setupResponseInterceptor(nextClient, false);

// 為了向後兼容，導出 authClient 作為默認導出
export default authClient;
