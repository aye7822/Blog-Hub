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
}

export default nextConfig
