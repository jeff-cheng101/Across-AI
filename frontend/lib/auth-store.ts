/**
 * 认证状态管理 - Zustand Store
 *
 * 业务背景：统一管理用户认证状态，替代原有的 RxJS BehaviorSubject 方案
 *
 * 数据流：
 * - 组件通过 TanStack Query Mutation 调用 services/auth API
 * - Mutation onSuccess 回调更新此 Store
 * - 组件通过 selectors 订阅状态变化并自动重渲染
 *
 * 依赖：
 * - zustand: 状态管理
 * - zustand/middleware: devtools（调试）和 persist（持久化）
 *
 * 特性：
 * - localStorage 持久化（刷新页面保持登录）
 * - Redux DevTools 支持（开发时查看状态变化）
 * - 细粒度 selectors（性能优化，减少不必要的重渲染）
 */

import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import type { User } from '@/services/auth';

/**
 * 认证状态接口
 */
interface AuthState {
  // 状态
  user: User | null;
  contract: unknown;
  isLoggedIn: boolean;

  // Actions（只负责更新状态，不处理副作用）
  setUser: (user: User | null, contract?: unknown) => void;
  clearUser: () => void;
}

/**
 * Zustand Store
 *
 * 中间件顺序：devtools(persist(...))
 * - persist 在内层，先处理持久化
 * - devtools 在外层，记录所有状态变化
 */
export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        // 初始状态
        user: null,
        contract: null,
        isLoggedIn: false,

        // 设置用户（登录成功后调用）
        setUser: (user, contract = null) =>
          set(
            {
              user,
              contract,
              isLoggedIn: !!user,
            },
            false,
            'setUser',
          ),

        // 清除用户（登出或 401 错误时调用）
        clearUser: () =>
          set(
            {
              user: null,
              contract: null,
              isLoggedIn: false,
            },
            false,
            'clearUser',
          ),
      }),
      {
        name: 'auth-storage', // localStorage key
        storage: createJSONStorage(() => localStorage),
        // 只持久化必要的字段
        partialize: (state) => ({
          user: state.user,
          contract: state.contract,
          isLoggedIn: state.isLoggedIn,
        }),
      },
    ),
    {
      name: 'AuthStore', // Redux DevTools 中显示的名称
      enabled: process.env.NODE_ENV === 'development', // 只在开发环境启用
    },
  ),
);

// ===== Selectors =====
// 细粒度 selectors，只订阅需要的数据，减少不必要的重渲染

/**
 * 获取当前用户
 *
 * 业务背景：用于显示用户信息（如导航栏用户名）
 * 性能优化：只有 user 对象变化时才重渲染
 */
export const useUser = () => useAuthStore((state) => state.user);

/**
 * 获取登录状态
 *
 * 业务背景：用于条件渲染（如显示登录/登出按钮）
 * 性能优化：只有 isLoggedIn 变化时才重渲染
 */
export const useIsLoggedIn = () => useAuthStore((state) => state.isLoggedIn);

/**
 * 获取用户角色
 *
 * 业务背景：用于权限判断和路由保护
 * 性能优化：只有 user.role 变化时才重渲染
 */
export const useUserRole = () =>
  useAuthStore((state) => state.user?.role ?? null);

/**
 * 获取合约信息
 *
 * 业务背景：用于获取用户的合约信息（如 contractNo）
 * 性能优化：只有 contract 变化时才重渲染
 */
export const useContract = () => useAuthStore((state) => state.contract);
