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
  // Enable static generation for better caching
  output: 'standalone',
  experimental: {
    // Enable static generation for dynamic routes
    staticPageGenerationTimeout: 120,
  },
  // Optimize for Vercel
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
}

export default nextConfig