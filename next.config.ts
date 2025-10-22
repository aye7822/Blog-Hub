import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // App Router is enabled by default in Next.js 13+
  webpack: (config) => {
    config.externals = config.externals || []
    config.externals.push('drizzle-kit')
    return config
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Image optimization for Vercel Blob storage
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
}

export default nextConfig
