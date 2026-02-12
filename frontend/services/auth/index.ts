/**
 * Auth 服務 - 認證相關 API
 *
 * 業務背景：統一管理所有認證相關的 API 調用
 * 資料流：前端 → authClient → /api/auth → Auth Service (localhost:3001)
 *
 * 依賴：authClient（lib/api-clients.ts）
 */

import { z } from 'zod';
import { authClient } from '@/lib/api-clients';

// ===== Type Definitions =====

/**
 * 使用者角色類型
 */
export type UserRole = 'management' | 'reseller' | 'user';

function isUserRole(value: string): value is UserRole {
  return value === 'management' || value === 'reseller' || value === 'user';
}

/**
 * 使用者資訊 Schema
 *
 * 業務背景：Auth Service 回傳的 user.id 為 number，userId 為 string
 */
export const UserSchema = z.object({
  id: z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) => (v === undefined ? undefined : String(v))),
  userId: z.string().optional(),
  email: z.string().email(),
  name: z.string().optional(),
  role: z.enum(['management', 'reseller', 'user']),
});
export type User = z.infer<typeof UserSchema>;

/**
 * 登入憑證 Schema
 */
export const LoginCredentialsSchema = z.object({
  email: z.string().email('Email 格式錯誤'),
  password: z.string().min(6, '密碼至少需要 6 個字元'),
});
export type LoginCredentials = z.infer<typeof LoginCredentialsSchema>;

/**
 * 認證回應 Schema
 */
export const AuthResponseSchema = z.object({
  loginState: z.boolean(),
  user: UserSchema.optional().nullable(),
  contract: z.unknown().optional(),
  message: z.string().optional(),
});
export type AuthResponse = z.infer<typeof AuthResponseSchema>;

/**
 * 登入回應 Schema
 */
export const LoginResponseSchema = z.object({
  success: z.boolean().optional(),
  user: UserSchema,
  contract: z.unknown().optional(),
  message: z.string().optional(),
});
export type LoginResponse = z.infer<typeof LoginResponseSchema>;

/**
 * 原始登入回應 Schema（相容 Auth Service 的各種回傳格式）
 *
 * 業務背景：Auth Service 可能回傳 loginState、account 等不同欄位，
 * 此 schema 接受多種格式並正規化為前端所需結構。
 */
const RawLoginResponseSchema = z
  .object({
    loginState: z.boolean().optional(),
    success: z.boolean().optional(),
    user: z
      .object({
        id: z.string().optional(),
        userId: z.string().optional(),
        account: z.string().optional(),
        email: z.string().optional(),
        name: z.string().optional(),
        role: z.string().optional(),
      })
      .passthrough()
      .optional(),
    contract: z.unknown().optional(),
    message: z.string().optional(),
  })
  .passthrough();

/**
 * 從原始回應正規化為 User
 */
function normalizeLoginResponse(raw: z.infer<typeof RawLoginResponseSchema>): {
  user: User;
  contract?: unknown;
} {
  const rawUser = raw.user;
  if (!rawUser) {
    throw new Error('登入回應缺少用戶資訊');
  }

  const email = rawUser.email ?? rawUser.account ?? '';
  if (!email || !email.includes('@')) {
    throw new Error('登入回應缺少有效的 email 或 account');
  }

  const roleLower = (rawUser.role ?? 'user').toString().toLowerCase();
  const role: UserRole = isUserRole(roleLower) ? roleLower : 'user';

  const user: User = {
    id: rawUser.id,
    userId: rawUser.userId ?? rawUser.id,
    email,
    name: rawUser.name,
    role,
  };

  return { user, contract: raw.contract };
}

// ===== API Functions =====

/**
 * 登入
 *
 * 業務背景：使用者登入認證
 *
 * 資料流：前端 → authClient.post('/auth/login') → Auth Service
 *
 * 邊界條件：
 * - 信箱或密碼錯誤時返回 401
 * - 成功返回使用者資訊和 token（透過 cookie）
 * - 相容 Auth Service 的 loginState/account 等不同回傳格式
 *
 * @param credentials 登入憑證
 * @returns 使用者資訊和合約資訊
 */
export async function login(
  credentials: LoginCredentials,
): Promise<{ user: User; contract?: unknown }> {
  // 驗證輸入
  const validatedInput = LoginCredentialsSchema.parse(credentials);

  // 發送請求
  const response = await authClient.post('/auth/login', validatedInput);

  // 開發環境下記錄回應資料
  if (process.env.NODE_ENV === 'development') {
    console.log('Login API response:', response.data);
  }

  // 優先使用 strict schema，失敗時再嘗試相容格式
  const strictResult = LoginResponseSchema.safeParse(response.data);
  if (strictResult.success) {
    const data = strictResult.data;
    return { user: data.user, contract: data.contract };
  }

  const rawResult = RawLoginResponseSchema.safeParse(response.data);
  if (!rawResult.success) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        'Login response validation failed:',
        strictResult.error.format(),
      );
      console.error('Received data:', response.data);
    }
    throw new Error(
      `數據格式錯誤: ${strictResult.error.errors[0]?.message || '未知錯誤'}`,
    );
  }

  return normalizeLoginResponse(rawResult.data);
}

/**
 * 登出
 *
 * 業務背景：使用者登出，清除伺服器端 session
 *
 * 資料流：前端 → authClient.post('/auth/logout') → Auth Service
 *
 * 邊界條件：
 * - 即使未登入也返回成功
 */
export async function logout(): Promise<void> {
  await authClient.post('/auth/logout');
}

/**
 * 切換回管理員身份
 *
 * 業務背景：管理員或經銷商以合約使用者身份登入後，切換回管理員身份
 *
 * 資料流：前端 → authClient.post('/auth/switch_management') → Auth Service
 *
 * 邊界條件：
 * - 只有 management 或 reseller 角色才能調用
 * - 成功返回管理員使用者資訊
 *
 * @returns 管理員使用者資訊和合約資訊
 */
export async function switchToManagement(): Promise<{
  user: User;
  contract?: unknown;
}> {
  const response = await authClient.post('/auth/switch_management');
  const data = LoginResponseSchema.parse(response.data);
  return { user: data.user, contract: data.contract };
}

/**
 * 檢查認證狀態
 *
 * 業務背景：應用啟動時或頁面重新整理時驗證使用者登入狀態
 *
 * 資料流：前端 → authClient.get('/auth/status') → Auth Service
 *
 * 邊界條件：
 * - 未登入返回 { loginState: false }
 * - 已登入返回使用者資訊
 *
 * @returns 認證狀態和使用者資訊
 */
export async function checkAuth(): Promise<AuthResponse> {
  const response = await authClient.get('/auth/status');
  return AuthResponseSchema.parse(response.data);
}

/**
 * 更新個人資料
 *
 * 業務背景：使用者修改個人資訊
 *
 * 資料流：前端 → authClient.put('/auth/profile') → Auth Service
 *
 * 邊界條件：
 * - 未登入返回 401
 * - 成功返回更新後的使用者資訊
 *
 * @param data 要更新的欄位
 * @returns 更新後的使用者資訊
 */
export async function updateProfile(data: Partial<User>): Promise<User> {
  const response = await authClient.put('/auth/profile', data);
  return UserSchema.parse(response.data.user);
}

/**
 * 修改密碼
 *
 * 業務背景：使用者修改登入密碼
 *
 * 資料流：前端 → authClient.post('/auth/change-password') → Auth Service
 *
 * 邊界條件：
 * - 目前密碼錯誤返回 400
 * - 新密碼格式不符返回 400
 * - 成功返回 success: true
 *
 * @param currentPassword 目前密碼
 * @param newPassword 新密碼
 */
export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  await authClient.post('/auth/change-password', {
    currentPassword,
    newPassword,
  });
}
