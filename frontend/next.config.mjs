import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 取得環境變數，未設定時拋出錯誤
 * @param {string} name - 環境變數名稱
 * @returns {string} 環境變數值
 */
const getEnvVar = (name) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`❌ 環境變數 ${name} 未設定`);
  }
  return value;
};

const AUTH_SERVICE_URL = getEnvVar('AUTH_SERVICE_URL');
const BACKEND_SERVICE_URL = getEnvVar('BACKEND_SERVICE_URL');

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: path.join(__dirname, '..'),
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Production 環境移除 console.log（保留 console.error）
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? {
            exclude: ['error'], // 保留 console.error
          }
        : false,
  },
  // TODO: 為了解決CORS暫時使用rewrites，如果將來會靜態匯出需要移除
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: `${AUTH_SERVICE_URL}/api/internal/:path*`, // proxy to auth service
      },
      {
        source: '/api/backend/:path*',
        destination: `${BACKEND_SERVICE_URL}/api/:path*`, // proxy to backend service
      },
    ];
  },
};

export default nextConfig;
