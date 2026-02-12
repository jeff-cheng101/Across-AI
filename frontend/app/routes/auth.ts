/**
 * @deprecated
 * 此檔案已棄用，請使用 services/auth/index.ts 代替
 *
 * 新架構使用 Zustand + TanStack Query + Service 層：
 * - services/auth/index.ts - API 函數和 Schema
 * - lib/auth-store.ts - Zustand 狀態管理
 * - 元件中直接使用 useMutation/useQuery
 *
 * 此檔案保留僅為向後相容，將在後續版本中移除
 */

import authenticator from '@/app/util/authenticator';
import { authClient } from '@/lib/api-clients';

// 為了相容性，將 authClient 作為 request 使用
const request = authClient;

// 使用者角色類型
export type UserRole = 'management' | 'reseller' | 'user';

// 類型定義
export type LoginResponse = {
  success: boolean;
  account: string;
  message: string;
  user?: {
    id: string;
    email: string;
    role: UserRole;
    name: string;
  };
  contract?: unknown;
  token?: string;
};

export type VerifyResponse = {
  loginState: boolean;
  account?: string;
  message?: string;
  user?: {
    id: string;
    email: string;
    role: UserRole;
    name: string;
  };
  contract?: unknown;
};

export type LogoutResponse = {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    role: UserRole;
    name: string;
  };
  contract?: unknown;
};

type AuthApiError = {
  message?: string;
  response?: {
    status?: number;
    data?: {
      message?: string;
      error?: {
        message?: string;
      };
    };
  };
};

function isAuthApiError(error: unknown): error is AuthApiError {
  return typeof error === 'object' && error !== null;
}

const authSubject = authenticator.authSubject;

export const captcha = async (): Promise<unknown> => {
  const resp = await request.get('/auth/captcha');
  return resp.data;
};

export const login = async (user: {
  email: string;
  password: string;
}): Promise<LoginResponse> => {
  try {
    const resp = await request.post<LoginResponse>('/auth/login', {
      email: user.email,
      password: user.password,
    });

    if (verifyStatus(resp.status)) {
      const auth = {
        loginState: true,
        user: resp.data.user,
        contract: resp.data.contract,
        message: resp.data.message,
      };
      console.log(auth);
      authSubject.next(auth);
    }
    return resp.data;
  } catch (error: unknown) {
    console.error('Auth login error:', error);
    if (isAuthApiError(error) && error.response?.status === 400) {
      throw new Error('帳號或密碼錯誤');
    } else if (isAuthApiError(error) && error.response?.status === 401) {
      throw new Error('帳號或密碼錯誤');
    } else if (
      isAuthApiError(error) &&
      typeof error.response?.status === 'number' &&
      error.response.status >= 500
    ) {
      throw new Error('伺服器錯誤，請稍後再試');
    } else {
      throw new Error(
        (isAuthApiError(error) && error.response?.data?.message) ||
          (isAuthApiError(error) && error.message) ||
          '登入失敗',
      );
    }
  }
};

export const checkLoginStatus = async (): Promise<VerifyResponse> => {
  try {
    const resp = await request.get<VerifyResponse>('/auth/verify');
    return resp.data;
  } catch (error: unknown) {
    const errorResp = {
      loginState: false,
      error: isAuthApiError(error) ? error.message : '驗證失敗',
    };
    return errorResp;
  }
};

export const refreshAuth = async (): Promise<unknown> => {
  const resp = await request.post('/auth/refresh');
  return resp;
};

export const logout = async (): Promise<LogoutResponse> => {
  try {
    const resp = await request.delete<LogoutResponse>('/auth/logout');
    if (verifyStatus(resp.status)) {
      authSubject.next({
        loginState: false,
        message: '已登出',
      });
    }

    return resp.data;
  } catch (error: unknown) {
    authSubject.next({
      loginState: false,
      message: '登出失敗',
    });
    throw new Error((isAuthApiError(error) && error.message) || '登出失敗');
  }
};

export const renewToken = async (
  sid: unknown,
  hnNo: unknown,
  memberSn: unknown,
): Promise<unknown> => {
  const resp = await request.post(`/auth/renew_token`, { sid, hnNo, memberSn });
  return resp;
};

export const getAuthStatus = async (): Promise<unknown> => {
  const resp = await request.get('/auth/status');
  return resp.data;
};

// 健康檢查
export const healthCheck = async (): Promise<unknown> => {
  const resp = await request.get('/health');
  return resp.data;
};

const verifyStatus = (status: number) => {
  return status >= 200 && status < 300;
};

export const getConfig = async (): Promise<unknown> => {
  const resp = await request.get('/config');
  return resp.data;
};

// 忘記密碼 - 發送重設信件
export const forgotPassword = async (
  email: string,
): Promise<{ success: boolean; message: string }> => {
  try {
    const resp = await request.post<{ success: boolean; message: string }>(
      '/auth/forgot-password',
      {
        email,
      },
    );
    return resp.data;
  } catch (error: unknown) {
    const rawErrorMessage = isAuthApiError(error) ? error.message : undefined;
    const errorResponse = isAuthApiError(error)
      ? error.response?.data
      : undefined;
    const errorStatus = isAuthApiError(error)
      ? error.response?.status
      : undefined;
    console.error('Forgot password API error:', {
      message: rawErrorMessage,
      response: errorResponse,
      status: errorStatus,
    });

    // 優先使用回應攔截器設定的 message，否則使用後備訊息
    const errorMessage =
      (isAuthApiError(error) ? error.message : undefined) ||
      (isAuthApiError(error)
        ? error.response?.data?.error?.message
        : undefined) ||
      (isAuthApiError(error) ? error.response?.data?.message : undefined) ||
      '發送重設信件失敗';

    throw new Error(errorMessage);
  }
};

// 重設密碼
export const resetPassword = async (data: {
  token: string;
  email: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<{ success: boolean; message: string }> => {
  try {
    const resp = await request.post<{ success: boolean; message: string }>(
      '/auth/reset-password',
      data,
    );
    return resp.data;
  } catch (error: unknown) {
    const rawErrorMessage = isAuthApiError(error) ? error.message : undefined;
    const errorResponse = isAuthApiError(error)
      ? error.response?.data
      : undefined;
    const errorStatus = isAuthApiError(error)
      ? error.response?.status
      : undefined;
    console.error('Reset password API error:', {
      message: rawErrorMessage,
      response: errorResponse,
      status: errorStatus,
    });

    // 優先使用回應攔截器設定的 message，否則使用後備訊息
    const errorMessage =
      (isAuthApiError(error) ? error.message : undefined) ||
      (isAuthApiError(error)
        ? error.response?.data?.error?.message
        : undefined) ||
      (isAuthApiError(error) ? error.response?.data?.message : undefined) ||
      '密碼重設失敗';

    throw new Error(errorMessage);
  }
};

// 切換使用者身份 (管理員權限)
export const switchToUserContract = async (
  contractNo: string,
): Promise<LoginResponse> => {
  try {
    const resp = await request.post<LoginResponse>('/auth/switch_contract', {
      contractNo: contractNo,
    });

    if (verifyStatus(resp.status)) {
      const auth = {
        loginState: true,
        user: resp.data.user,
        contract: resp.data.contract,
        message: resp.data.message || '已切換到使用者身份',
      };
      authSubject.next(auth);
    }
    return resp.data;
  } catch (error: unknown) {
    throw new Error((isAuthApiError(error) && error.message) || '切換使用者失敗');
  }
};

export const logoutContract = async (): Promise<LogoutResponse> => {
  try {
    const resp = await request.post<LoginResponse>('/auth/switch_management');

    if (verifyStatus(resp.status)) {
      const auth = {
        loginState: true,
        user: resp.data.user,
        contract: resp.data.contract || {},
        message: resp.data.message || '已返回管理員身份',
      };
      authSubject.next(auth);
    }
    return resp.data;
  } catch (error: unknown) {
    throw new Error(
      (isAuthApiError(error) && error.message) || '返回管理員失敗',
    );
  }
};
