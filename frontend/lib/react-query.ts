// frontend/lib/react-query.ts
// React Query 基礎設定

import { QueryClient } from '@tanstack/react-query';

/**
 * 建立 QueryClient 實例
 * 統一管理所有 React Query 的設定
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 預設 stale time：5 分鐘（資料在 5 分鐘內視為新鮮，不會重新 fetch）
      staleTime: 5 * 60 * 1000,
      // 預設 cache time：10 分鐘（未使用的資料在記憶體中保留 10 分鐘）
      gcTime: 10 * 60 * 1000,
      // 預設重試次數：1 次
      retry: 1,
      // 預設在視窗重新聚焦時不自動重新 fetch
      refetchOnWindowFocus: false,
      // 預設在網路重新連線時不自動重新 fetch
      refetchOnReconnect: false,
    },
    mutations: {
      // 預設重試次數：0 次（mutation 通常不應該重試）
      retry: 0,
    },
  },
});
