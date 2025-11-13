# Deployment Strategy for Large Serverless Functions

## The Problem
Vercel has a 250MB limit for unzipped serverless functions. The build process is bundling `gray-matter` and `marked` even though we've tried to externalize them.

## Solutions

### Option 1: Pre-build and Deploy (Not Recommended for Vercel)
Vercel needs to build serverless functions, so we can't fully skip the build. However, you could:
1. Build locally: `npm run build`
2. Deploy the `.next` folder (but Vercel will still try to build)

### Option 2: Use Vercel Build Output API (Advanced)
Configure Vercel to use a custom build that outputs minimal bundles.

### Option 3: Optimize Images (Recommended First Step)
The `public` folder has 34MB of images. Consider:
- Converting large PNGs to WebP
- Using an image CDN (Cloudinary, Imgix)
- Lazy loading images

### Option 4: Move Content Processing to External Service
- Use a headless CMS
- Pre-process markdown to JSON at build time
- Use a separate API service for content processing

### Option 5: Use ISR (Incremental Static Regeneration)
Pre-render pages at build time and regenerate on-demand, reducing serverless function usage.

## Current Status
We've made all build-time code use lightweight parsing (regex instead of gray-matter/marked), but webpack may still be analyzing runtime code.

## Next Steps
1. Check Vercel build logs to identify which specific function exceeds 250MB
2. Consider moving large images to a CDN
3. If issue persists, consider Option 4 (external content processing)

