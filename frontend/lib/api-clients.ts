/**
 * API Clients - 統一的 axios 實體管理
 *
 * authClient - 認證服務 (NEXT_PUBLIC_AUTH_SERVICE_URL)
 * backendClient - 後端 API 服務 (NEXT_PUBLIC_BACKEND_SERVICE_URL)
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
 * 取得 Auth Service 的 base URL
 * @throws 如果環境變數未設定
 */
const getAuthServiceURL = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL;

  if (!envUrl) {
    throw new Error('❌ 環境變數 NEXT_PUBLIC_AUTH_SERVICE_URL 未設定');
  }

  return `${envUrl}/api/internal`;
};

/**
 * 取得 Backend Service 的 base URL
 * @throws 如果環境變數未設定
 */
const getBackendServiceURL = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_BACKEND_SERVICE_URL;

  if (!envUrl) {
    throw new Error('❌ 環境變數 NEXT_PUBLIC_BACKEND_SERVICE_URL 未設定');
  }

  return envUrl;
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
 */
export const authClient: AxiosInstance = axios.create({
  baseURL: getAuthServiceURL(),
  timeout: 300000,
  withCredentials: true,
});

setupResponseInterceptor(authClient, true);

/**
 * Backend Client - 後端 API 服務
 * 用於：AI 分析、報告生成、Workflow 等
 */
export const backendClient: AxiosInstance = axios.create({
  baseURL: getBackendServiceURL(),
  timeout: 300000,
  withCredentials: true,
});

setupResponseInterceptor(backendClient, false);

// 為了向後兼容，導出 authClient 作為默認導出
export default authClient;
