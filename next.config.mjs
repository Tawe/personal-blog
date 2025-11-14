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
    'highlight.js',
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
  // Exclude public folder from serverless function bundles
  // Images in public/ should be served as static assets, not bundled
  outputFileTracingExcludes: {
    '*': [
      'public/**/*',
    ],
  },
  // Ensure webpack properly externalizes these packages
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Ensure gray-matter and marked are externalized
      // This works alongside serverExternalPackages
      const originalExternals = config.externals || []
      config.externals = [
        ...(Array.isArray(originalExternals) ? originalExternals : [originalExternals].filter(Boolean)),
        // Regex to match gray-matter, marked, and highlight.js packages
        ({ request }, callback) => {
          if (request === 'gray-matter' || request === 'marked' || request === 'highlight.js') {
            return callback(null, `commonjs ${request}`)
          }
          callback()
        },
      ]
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

