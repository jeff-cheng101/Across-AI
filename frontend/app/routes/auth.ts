import authenticator from '@/app/util/authenticator';
import { authClient } from '@/lib/api-clients';

// 為了兼容性，將 authClient 作為 request 使用
const request = authClient;

// 用戶角色類型（已簡化，僅保留 user 權限）
export type UserRole = 'user';

// 類型定義
export interface LoginResponse {
  success: boolean;
  account: string;
  message: string;
  user?: {
    id: string;
    email: string;
    role: UserRole;
    name: string;
  };
  contract?: any;
  token?: string;
}

export interface VerifyResponse {
  loginState: boolean;
  account?: string;
  message?: string;
  user?: {
    id: string;
    email: string;
    role: UserRole;
    name: string;
  };
  contract?: any;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    role: UserRole;
    name: string;
  };
  contract?: any;
}

const authSubject = authenticator.authSubject;

export const captcha = async (): Promise<any> => {
  const resp = await request.get('/auth/captcha');
  return resp.data;
};

export const login = async (user: any): Promise<LoginResponse> => {
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
  } catch (error: any) {
    console.error('Auth login error:', error);
    if (error.response?.status === 400) {
      throw new Error('帳號或密碼錯誤');
    } else if (error.response?.status === 401) {
      throw new Error('帳號或密碼錯誤');
    } else if (error.response?.status >= 500) {
      throw new Error('伺服器錯誤，請稍後再試');
    } else {
      throw new Error(
        error.response?.data?.message || error.message || '登入失敗',
      );
    }
  }
};

export const checkLoginStatus = async (): Promise<VerifyResponse> => {
  try {
    const resp = await request.get<VerifyResponse>('/auth/verify');
    return resp.data;
  } catch (error: any) {
    const errorResp = { loginState: false, error: error.message };
    return errorResp;
  }
};

export const refreshAuth = async (): Promise<any> => {
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
  } catch (error: any) {
    authSubject.next({
      loginState: false,
      message: '登出失敗',
    });
    throw new Error(error.message || '登出失敗');
  }
};

export const renewToken = async (
  sid: any,
  hnNo: any,
  memberSn: any,
): Promise<any> => {
  const resp = await request.post(`/auth/renew_token`, { sid, hnNo, memberSn });
  return resp;
};

export const getAuthStatus = async (): Promise<any> => {
  const resp = await request.get('/auth/status');
  return resp.data;
};

// 健康檢查
export const healthCheck = async (): Promise<any> => {
  const resp = await request.get('/health');
  return resp.data;
};

const verifyStatus = (status: number) => {
  return status >= 200 && status < 300;
};

export const getConfig = async (): Promise<any> => {
  const resp = await request.get('/config');
  return resp.data;
};

// 忘記密碼 - 發送重設郵件
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
  } catch (error: any) {
    console.error('Forgot password API error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });

    // 優先使用響應攔截器設置的 message，否則使用後備訊息
    const errorMessage =
      error.message ||
      error.response?.data?.error?.message ||
      error.response?.data?.message ||
      '發送重設郵件失敗';

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
  } catch (error: any) {
    console.error('Reset password API error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });

    // 優先使用響應攔截器設置的 message，否則使用後備訊息
    const errorMessage =
      error.message ||
      error.response?.data?.error?.message ||
      error.response?.data?.message ||
      '密碼重設失敗';

    throw new Error(errorMessage);
  }
};

