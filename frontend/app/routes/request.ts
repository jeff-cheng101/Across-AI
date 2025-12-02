import axios from 'axios';
import { authSubject } from '@/app/util/authenticator';

// 全局路由跳转处理器
let globalRouter: any = null;

export const setGlobalRouter = (router: any) => {
    globalRouter = router;
};

const getBaseURL = () => {
    // 檢查是否為開發環境
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (typeof window !== 'undefined') {
        const origin = window.location.origin;

        if (isDevelopment) {
            return 'http://localhost:3001/api/internal';
        }
        
        return `${origin}/api/internal`;
    }
    
    // 伺服器端渲染：使用環境變數或預設值
    if (isDevelopment) {
        return 'http://localhost:3001/api/internal';
    }
    
    return process.env.NEXT_PUBLIC_API_URL || 'https://adas-one.twister5.cf/api/internal';
};

const params = {
    baseURL: getBaseURL(),
    timeout: 300000,
    withCredentials: true,
};

const request = axios.create(params)

request.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // 处理未授权错误
        console.log(error.response)
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            if (error.response.config.url.includes('logout')) {
                return Promise.reject(error);
            } else {
                console.log('Unauthorized access detected, triggering logout...');
                authSubject.next({ loginState: false, message: '登入已過期，請重新登入' });
                
                // 使用 Next.js 路由跳转而不是强制刷新页面
                if (globalRouter) {
                    globalRouter.push('/');
                } else if (typeof window !== 'undefined') {
                    // 后备方案
                    window.location.href = '/';
                }
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);
// 添加響應攔截器來處理錯誤
// request.interceptors.response.use(
//     (response) => {
//         return response;
//     },
//     (error) => {
//         // 如果有響應數據，提取錯誤訊息
//         if (error.response && error.response.data) {
//             const errorData = error.response.data;
            
//             // 處理不同的錯誤格式
//             if (errorData.message) {
//                 // 如果錯誤訊息包含 "Error:" 前綴，移除它
//                 const message = errorData.message.startsWith('Error: ') 
//                     ? errorData.message.substring(7) 
//                     : errorData.message;
//                 error.message = message;
//             } else if (errorData.error && errorData.error.message) {
//                 error.message = errorData.error.message;
//             } else if (typeof errorData === 'string') {
//                 // 如果錯誤數據直接是字符串
//                 error.message = errorData;
//             }
//         }
        
//         console.log('Request interceptor error details:', {
//             status: error.response?.status,
//             data: error.response?.data,
//             message: error.message
//         });
        
//         return Promise.reject(error);
//     }
// );

export default request;
