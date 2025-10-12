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
  // Enable static generation for better caching
  output: 'standalone',
  experimental: {
    // Enable static generation for dynamic routes
    // staticPageGenerationTimeout: 120, // Removed - not valid in Next.js 15
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