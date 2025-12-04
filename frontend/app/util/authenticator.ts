import { BehaviorSubject } from 'rxjs';
import request from '../routes/request';
import { UserRole } from '../routes/auth';

interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

interface AuthData {
  loginState: boolean;
  user?: AuthUser;
  contract?: any;
  message?: string;
}

const authSubject = new BehaviorSubject<AuthData | null>(null);
let isAuthReady = false;

export const checkAuth = async () => {
    try {
        const resp = await request.get('/auth/status');
        if (resp.status === 200 || resp.status === 304) {
            authSubject.next(resp.data);
        } else {
            authSubject.next(null);
        }
    } catch (error) {
        authSubject.next(null);
    } finally {
        isAuthReady = true;
    }
};

export const getCurrentUser = (): AuthUser | null => {
    const authData = authSubject.value;
    return authData?.user || null;
};

export const getCurrentUserRole = (): UserRole | null => {
    const user = getCurrentUser();
    return user?.role || null;
};

export const isAuthenticated = (): boolean => {
    const authData = authSubject.value;
    return authData?.loginState || false;
};

// 导出 authSubject 供外部访问
export { authSubject };

export default {
    authSubject,
    authObservable: authSubject.asObservable(),
    get authValue() {
        const current = authSubject.value;
        if (!isAuthReady || current == null) {
            // Return a safe default to avoid null dereference during initial hydration/refresh
            return { loginState: false } as AuthData;
        }
        return current;
    },
    getCurrentUser,
    getCurrentUserRole,
    isAuthenticated,
};

checkAuth();
