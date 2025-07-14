# Caching Strategy for Vercel Deployment

This document outlines the caching strategy implemented for optimal performance on Vercel.

## Overview

The blog has been optimized for caching on Vercel with the following strategies:

1. **Server-Side Rendering (SSR)** - Converted article pages from client-side to server-side rendering
2. **Static Generation** - Added `generateStaticParams` for pre-building all article pages
3. **API Route Caching** - Added comprehensive caching headers to all API routes
4. **Vercel Configuration** - Created `vercel.json` with optimized caching rules
5. **Next.js Optimization** - Updated `next.config.mjs` for better static generation

## Caching Headers

### Article Pages
- **Cache-Control**: `public, s-maxage=3600, stale-while-revalidate=86400`
- **CDN-Cache-Control**: `public, s-maxage=3600`
- **Vercel-CDN-Cache-Control**: `public, s-maxage=3600`

### API Routes
- **Cache-Control**: `public, s-maxage=3600, stale-while-revalidate=86400`
- **CDN-Cache-Control**: `public, s-maxage=3600`
- **Vercel-CDN-Cache-Control**: `public, s-maxage=3600`

### Static Assets
- **Cache-Control**: `public, max-age=31536000, immutable`

## Cache Duration Breakdown

- **s-maxage=3600**: CDN caches for 1 hour
- **stale-while-revalidate=86400**: Serve stale content for up to 24 hours while revalidating
- **max-age=31536000**: Static assets cached for 1 year

## Implementation Details

### Server-Side Rendering
Article pages now use server-side rendering instead of client-side fetching:

```typescript
// Before: Client-side fetching
"use client"
const [article, setArticle] = useState(null)
useEffect(() => {
  fetch(`/api/content/technical/${slug}`)
}, [])

// After: Server-side rendering
export default async function ArticlePage({ params }) {
  const article = await getArticle(params.slug)
  return <ArticleClientPage article={article} />
}
```

### Static Generation
All article pages are pre-generated at build time:

```typescript
export async function generateStaticParams() {
  const files = fs.readdirSync(contentDir)
  return files.map(filename => ({
    slug: filename.replace(".md", "").toLowerCase().replace(/\s+/g, "-")
  }))
}
```

### API Route Caching
All API routes include comprehensive caching headers:

```typescript
const response = NextResponse.json({ article })
response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
response.headers.set('CDN-Cache-Control', 'public, s-maxage=3600')
response.headers.set('Vercel-CDN-Cache-Control', 'public, s-maxage=3600')
return response
```

## Vercel Configuration

The `vercel.json` file includes:

1. **Function Configuration**: Extended timeout for article generation
2. **Header Rules**: Comprehensive caching headers for all routes
3. **Rewrite Rules**: Clean URL structure for article pages

## Performance Benefits

1. **Faster Page Loads**: Server-side rendering eliminates client-side fetching
2. **Better SEO**: Static generation improves search engine indexing
3. **Reduced Server Load**: Caching reduces database/file system access
4. **Global CDN**: Vercel's edge network serves cached content worldwide
5. **Stale-While-Revalidate**: Users get fast responses while content updates in background

## Monitoring

To monitor caching effectiveness:

1. Check Vercel Analytics for cache hit rates
2. Monitor Core Web Vitals in Google PageSpeed Insights
3. Review Vercel Function execution times
4. Check browser Network tab for cache headers

## Cache Invalidation

Content updates will automatically invalidate caches:
- New article deployments trigger cache invalidation
- Stale-while-revalidate ensures users get updated content within 24 hours
- Manual cache invalidation available through Vercel dashboard

## Best Practices

1. **Content Updates**: Deploy to trigger cache invalidation
2. **Image Optimization**: Use Next.js Image component for automatic optimization
3. **Code Splitting**: Leverage Next.js automatic code splitting
4. **Monitoring**: Regularly check cache hit rates and performance metrics 