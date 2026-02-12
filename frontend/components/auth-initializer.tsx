/**
 * 認證初始化元件
 *
 * 業務背景：應用啟動時自動檢查使用者登入狀態，
 * 如果有有效 session（透過 cookie），自動恢復登入狀態
 *
 * 資料流：
 * 1. 元件掛載時觸發 useQuery
 * 2. 調用 checkAuth() → authClient.get('/auth/status')
 * 3. 成功 → 更新 Zustand Store
 * 4. 失敗 → 清空 Zustand Store
 *
 * 依賴：
 * - @tanstack/react-query: 管理非同步狀態
 * - services/auth: API 調用
 * - lib/auth-store: 狀態管理
 *
 * 使用方式：
 * 在 app/layout.tsx 中加入此元件：
 * <QueryProvider>
 *   <ThemeProvider>
 *     <AuthInitializer />
 *     {children}
 *   </ThemeProvider>
 * </QueryProvider>
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/auth-store';
import { checkAuth } from '@/services/auth';

export function AuthInitializer() {
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);

  useQuery({
    queryKey: ['auth-status'],
    queryFn: async () => {
      const data = await checkAuth();
      // 根據回應更新 Zustand Store
      if (data.loginState && data.user) {
        setUser(data.user, data.contract);
      } else {
        clearUser();
      }
      return data;
    },
    // 設定選項
    retry: false, // 認證失敗不重試（避免循環請求）
    refetchOnWindowFocus: true, // 視窗取得焦點時重新檢查
    staleTime: 5 * 60 * 1000, // 5分鐘內不重新取得
  });

  // 此元件不渲染任何內容
  return null;
}
