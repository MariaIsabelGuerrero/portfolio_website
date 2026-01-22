/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3003',
        pathname: '/api/files/**',
      },
      {
        protocol: 'http',
        hostname: 'backend',
        port: '3003',
        pathname: '/api/files/**',
      },
    ],
  },
}

module.exports = nextConfig
