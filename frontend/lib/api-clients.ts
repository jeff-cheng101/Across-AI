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
 * 為什麼拆成多個 Client 而非統一成一個：
 * - 隱藏路由前綴：呼叫端寫 authClient.get('/users') 而非 client.get('/auth/users')，不需知道路由分層
 * - 各服務 timeout 不同（auth 5min / backend 20min / next 10min）
 * - 錯誤處理策略不同（authClient 遇 401/403 自動登出，其他不處理）
 */

import axios, { type AxiosError, type AxiosInstance } from 'axios';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useAuthStore } from '@/lib/auth-store';

// HTTP 狀態碼
const HTTP_STATUS = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
} as const;

// 全域路由跳轉處理器（來自 Next.js useRouter）
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
          // 使用 Zustand 清除認證狀態
          useAuthStore.getState().clearUser();

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
 * 用於：登入、使用者管理、票據、系統設定、合約等
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
 * Timeout: 10 分鐘（支援長時間的 Dify Workflow 執行）
 */
export const nextClient: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 600 * 1000, // 10 分鐘
  withCredentials: true,
});

setupResponseInterceptor(nextClient, false);

// 為了向後相容，匯出 authClient 作為預設匯出
export default authClient;
