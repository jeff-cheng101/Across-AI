/**
 * Auth 服务 - 认证相关 API
 *
 * 业务背景：统一管理所有认证相关的 API 调用
 * 数据流：前端 → authClient → /api/auth → Auth Service (localhost:3001)
 *
 * 依赖：authClient（lib/api-clients.ts）
 */

import { z } from 'zod';
import { authClient } from '@/lib/api-clients';

// ===== Type Definitions =====

/**
 * 用户角色类型
 */
export type UserRole = 'management' | 'reseller' | 'user';

function isUserRole(value: string): value is UserRole {
  return value === 'management' || value === 'reseller' || value === 'user';
}

/**
 * 用户信息 Schema
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
 * 登录凭证 Schema
 */
export const LoginCredentialsSchema = z.object({
  email: z.string().email('Email 格式错误'),
  password: z.string().min(6, '密码至少需要 6 个字符'),
});
export type LoginCredentials = z.infer<typeof LoginCredentialsSchema>;

/**
 * 认证响应 Schema
 */
export const AuthResponseSchema = z.object({
  loginState: z.boolean(),
  user: UserSchema.optional().nullable(),
  contract: z.unknown().optional(),
  message: z.string().optional(),
});
export type AuthResponse = z.infer<typeof AuthResponseSchema>;

/**
 * 登录响应 Schema
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
 * 登录
 *
 * 业务背景：用户登录认证
 *
 * 数据流：前端 → authClient.post('/auth/login') → Auth Service
 *
 * 边界条件：
 * - 邮箱或密码错误时返回 401
 * - 成功返回用户信息和 token（通过 cookie）
 * - 兼容 Auth Service 的 loginState/account 等不同回傳格式
 *
 * @param credentials 登录凭证
 * @returns 用户信息和合约信息
 */
export async function login(
  credentials: LoginCredentials,
): Promise<{ user: User; contract?: unknown }> {
  // 验证输入
  const validatedInput = LoginCredentialsSchema.parse(credentials);

  // 发送请求
  const response = await authClient.post('/auth/login', validatedInput);

  // 開發環境下記錄響應數據
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
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
      // eslint-disable-next-line no-console
      console.error(
        'Login response validation failed:',
        strictResult.error.format(),
      );
      // eslint-disable-next-line no-console
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
 * 业务背景：用户登出，清除服务器端 session
 *
 * 数据流：前端 → authClient.post('/auth/logout') → Auth Service
 *
 * 边界条件：
 * - 即使未登录也返回成功
 */
export async function logout(): Promise<void> {
  await authClient.post('/auth/logout');
}

/**
 * 切换回管理员身份
 *
 * 业务背景：管理员或经销商以合约用户身份登录后，切换回管理员身份
 *
 * 数据流：前端 → authClient.post('/auth/switch_management') → Auth Service
 *
 * 边界条件：
 * - 只有 management 或 reseller 角色才能调用
 * - 成功返回管理员用户信息
 *
 * @returns 管理员用户信息和合约信息
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
 * 检查认证状态
 *
 * 业务背景：应用启动时或页面刷新时验证用户登录状态
 *
 * 数据流：前端 → authClient.get('/auth/status') → Auth Service
 *
 * 边界条件：
 * - 未登录返回 { loginState: false }
 * - 已登录返回用户信息
 *
 * @returns 认证状态和用户信息
 */
export async function checkAuth(): Promise<AuthResponse> {
  const response = await authClient.get('/auth/status');
  return AuthResponseSchema.parse(response.data);
}

/**
 * 更新个人资料
 *
 * 业务背景：用户修改个人信息
 *
 * 数据流：前端 → authClient.put('/auth/profile') → Auth Service
 *
 * 边界条件：
 * - 未登录返回 401
 * - 成功返回更新后的用户信息
 *
 * @param data 要更新的字段
 * @returns 更新后的用户信息
 */
export async function updateProfile(data: Partial<User>): Promise<User> {
  const response = await authClient.put('/auth/profile', data);
  return UserSchema.parse(response.data.user);
}

/**
 * 修改密码
 *
 * 业务背景：用户修改登录密码
 *
 * 数据流：前端 → authClient.post('/auth/change-password') → Auth Service
 *
 * 边界条件：
 * - 当前密码错误返回 400
 * - 新密码格式不符返回 400
 * - 成功返回 success: true
 *
 * @param currentPassword 当前密码
 * @param newPassword 新密码
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
