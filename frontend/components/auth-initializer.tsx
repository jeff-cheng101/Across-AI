/**
 * 认证初始化组件
 *
 * 业务背景：应用启动时自动检查用户登录状态，
 * 如果有有效 session（通过 cookie），自动恢复登录状态
 *
 * 数据流：
 * 1. 组件挂载时触发 useQuery
 * 2. 调用 checkAuth() → authClient.get('/auth/status')
 * 3. 成功 → 更新 Zustand Store
 * 4. 失败 → 清空 Zustand Store
 *
 * 依赖：
 * - @tanstack/react-query: 管理异步状态
 * - services/auth: API 调用
 * - lib/auth-store: 状态管理
 *
 * 使用方式：
 * 在 app/layout.tsx 中添加此组件：
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
      // 根据响应更新 Zustand Store
      if (data.loginState && data.user) {
        setUser(data.user, data.contract);
      } else {
        clearUser();
      }
      return data;
    },
    // 配置选项
    retry: false, // 认证失败不重试（避免循环请求）
    refetchOnWindowFocus: true, // 窗口获得焦点时重新检查
    staleTime: 5 * 60 * 1000, // 5分钟内不重新获取
  });

  // 此组件不渲染任何内容
  return null;
}
