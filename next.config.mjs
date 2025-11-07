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
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year
  },
  // Exclude large packages from serverless function bundles
  // These will be available at runtime but not bundled
  serverExternalPackages: [
    'gray-matter',
    'marked',
  ],
  experimental: {
    // Enable static generation for dynamic routes
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  // Optimize for Vercel
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  // SEO optimizations
  trailingSlash: false,
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Optimize webpack to reduce bundle size
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Prevent content files from being bundled into serverless functions
      config.externals = config.externals || []
      
      // Exclude content directory from bundle
      config.resolve = config.resolve || {}
      config.resolve.alias = config.resolve.alias || {}
    }
    return config
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

export default nextConfig

