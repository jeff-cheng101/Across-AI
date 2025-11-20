/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    return [
      {
        source: '/api/internal/:path*',
        destination: isDevelopment 
          ? 'http://localhost:3001/api/internal/:path*' 
          : 'https://adas-one.twister5.cf/api/internal/:path*',
      },
      {
        source: '/api/cloudflare/:path*',
        destination: 'https://twister5.phison.com:8080/api/cloudflare/:path*',
      },
      {
        source: '/api/f5/:path*',
        destination: 'https://twister5.phison.com:8080/api/f5/:path*',
      },
      {
        source: '/api/:path*',
        destination: isDevelopment 
          ? 'http://localhost:3001/api/:path*' 
          : 'https://adas-one.twister5.cf/api/:path*',
      },
    ]
  },
}

export default nextConfig
