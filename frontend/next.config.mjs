import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

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
  // 注意：Proxy 功能已改用 Route Handlers 實作
  // - /api/backend/* -> app/api/backend/[...path]/route.ts
  // - /api/auth/*    -> app/api/auth/[...path]/route.ts
  // 這樣可以避免 proxy 連線逾時問題，並支援串流回應
};

export default nextConfig;
