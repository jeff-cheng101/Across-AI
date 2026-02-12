/**
 * 認證狀態管理 - Zustand Store
 *
 * 業務背景：統一管理使用者認證狀態，替代原有的 RxJS BehaviorSubject 方案
 *
 * 資料流：
 * - 元件透過 TanStack Query Mutation 調用 services/auth API
 * - Mutation onSuccess 回調更新此 Store
 * - 元件透過 selectors 訂閱狀態變化並自動重新渲染
 *
 * 依賴：
 * - zustand: 狀態管理
 * - zustand/middleware: devtools（偵錯）和 persist（持久化）
 *
 * 特性：
 * - localStorage 持久化（重新整理頁面保持登入）
 * - Redux DevTools 支援（開發時查看狀態變化）
 * - 細粒度 selectors（效能優化，減少不必要的重新渲染）
 */

import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import type { User } from '@/services/auth';

/**
 * 認證狀態類型
 */
type AuthState = {
  // 狀態
  user: User | null;
  contract: unknown;
  isLoggedIn: boolean;

  // Actions（只負責更新狀態，不處理副作用）
  setUser: (user: User | null, contract?: unknown) => void;
  clearUser: () => void;
};

/**
 * Zustand Store
 *
 * 中間件順序：devtools(persist(...))
 * - persist 在內層，先處理持久化
 * - devtools 在外層，記錄所有狀態變化
 */
export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        // 初始狀態
        user: null,
        contract: null,
        isLoggedIn: false,

        // 設定使用者（登入成功後調用）
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

        // 清除使用者（登出或 401 錯誤時調用）
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
        // 只持久化必要的欄位
        partialize: (state) => ({
          user: state.user,
          contract: state.contract,
          isLoggedIn: state.isLoggedIn,
        }),
      },
    ),
    {
      name: 'AuthStore', // Redux DevTools 中顯示的名稱
      enabled: process.env.NODE_ENV === 'development', // 只在開發環境啟用
    },
  ),
);

// ===== Selectors =====
// 細粒度 selectors，只訂閱需要的資料，減少不必要的重新渲染

/**
 * 取得目前使用者
 *
 * 業務背景：用於顯示使用者資訊（如導覽列使用者名稱）
 * 效能優化：只有 user 物件變化時才重新渲染
 */
export const useUser = () => useAuthStore((state) => state.user);

/**
 * 取得登入狀態
 *
 * 業務背景：用於條件渲染（如顯示登入/登出按鈕）
 * 效能優化：只有 isLoggedIn 變化時才重新渲染
 */
export const useIsLoggedIn = () => useAuthStore((state) => state.isLoggedIn);

/**
 * 取得使用者角色
 *
 * 業務背景：用於權限判斷和路由保護
 * 效能優化：只有 user.role 變化時才重新渲染
 */
export const useUserRole = () =>
  useAuthStore((state) => state.user?.role ?? null);

/**
 * 取得合約資訊
 *
 * 業務背景：用於取得使用者的合約資訊（如 contractNo）
 * 效能優化：只有 contract 變化時才重新渲染
 */
export const useContract = () => useAuthStore((state) => state.contract);
