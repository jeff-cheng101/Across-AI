import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  // 注意：rewrites 已移除，API 呼叫直接使用環境變數配置的服務 URL
  // NEXT_PUBLIC_AUTH_SERVICE_URL - 認證服務
  // NEXT_PUBLIC_BACKEND_SERVICE_URL - 後端 API 服務
  async rewrites() {
    return [
      {
        source: '/api/cloudflare/:path*',
        destination: 'http://localhost:8081/api/cloudflare/:path*', // proxy to backend
      },
      {
        source: '/api/f5/:path*',
        destination: 'http://localhost:8081/api/f5/:path*', // proxy to backend
      },
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*', // proxy to backend
      },
    ]
  },
};

export default nextConfig;
