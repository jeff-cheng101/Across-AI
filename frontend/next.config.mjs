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
    ];
  },
};

export default nextConfig;
