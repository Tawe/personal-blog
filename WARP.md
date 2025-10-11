# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is John Munn's personal blog built with Next.js 15 and deployed on Vercel. The blog focuses on technical leadership, engineering strategy, and creative problem-solving insights, with a unique perspective combining D&D storytelling with technical expertise.

**Live Site**: [johnmunn.tech](https://www.johnmunn.tech/)  
**Development Environment**: Built and iterated on [v0.dev](https://v0.dev/chat/projects/lGwKuRHUmZ5)

## Architecture Overview

### Core Technologies
- **Framework**: Next.js 15 with App Router
- **Runtime**: React 19
- **Styling**: Tailwind CSS with shadcn/ui components
- **Content**: Markdown files processed via gray-matter and marked
- **Deployment**: Vercel with comprehensive caching strategy
- **Package Manager**: Both npm and pnpm supported (has both lock files)

### Content Architecture
The blog uses a file-based content management system with four distinct content types:

1. **Leadership Articles** (`content/leadership/`) - Management and strategy insights
2. **Technical Articles** (`content/technical-writings/`) - Technical deep-dives
3. **Artumin Content** (`content/artumin/`) - Creative worldbuilding and storytelling
4. **D&D Content** (`content/dnd-musings/`) - Tabletop gaming insights and mechanics

### API Structure
Content is served through Next.js API routes with heavy caching:
- `/api/content/leadership` - Leadership articles
- `/api/content/technical` - Technical articles  
- `/api/content/artumin` - Artumin worldbuilding content
- `/api/content/dnd` - D&D gaming content

Each API route processes markdown files with frontmatter and returns structured JSON with caching headers optimized for Vercel CDN.

### Component Architecture
- **Page Templates**: Reusable article page templates for different content types
- **Content Cards**: Modular components for displaying article previews
- **Filtering Systems**: Category and tag-based content filtering
- **SEO Components**: Structured data and metadata handling
- **UI Components**: shadcn/ui based design system

## Common Development Commands

### Development
```bash
npm run dev          # Start development server on localhost:3000
npm run build        # Build for production
npm run start        # Start production build locally
npm run lint         # Run Next.js linting
```

### Content Management
Content is managed through markdown files in the `content/` directory. Each content type has specific frontmatter schema:

**Leadership Articles**: Include `medium_link`, `devto_link`, `substack_link` fields
**Technical Articles**: Include `difficulty`, `type`, `code_languages` fields
**Artumin Content**: Include `type`, `categories`, `region`, `status` fields  
**D&D Content**: Include `type`, `system`, `availability`, `playtested` fields

### Testing Content Changes
After adding/modifying content files:
1. The API routes automatically pick up changes
2. In development, restart the server to see new content
3. For production, redeploy to trigger cache invalidation

## Performance & Caching

This site implements an aggressive caching strategy optimized for Vercel:

- **CDN Caching**: 1-hour cache with 24-hour stale-while-revalidate
- **Static Generation**: Article pages pre-built at deployment
- **Server-Side Rendering**: No client-side content fetching
- **Image Optimization**: Unoptimized images (configured for static export compatibility)

See `CACHING.md` for detailed caching strategy documentation.

## Key Configuration Files

- `next.config.mjs` - Next.js configuration with Vercel optimizations
- `tailwind.config.js` - Tailwind styling configuration
- `components.json` - shadcn/ui component configuration
- `package.json` - Dependencies and scripts
- `CACHING.md` - Detailed caching strategy documentation

## Content Guidelines

### Adding New Articles
1. Create markdown file in appropriate `content/` subdirectory
2. Include proper frontmatter with required fields for content type
3. Use kebab-case for filenames (gets converted to URL slugs)
4. Frontmatter `date` field controls article ordering

### SEO Optimization
- Each page includes comprehensive OpenGraph and Twitter metadata
- Structured data (JSON-LD) for person/organization schema
- Canonical URLs configured in layout
- Robots.txt configured for search indexing

## Development Notes

### Deployment Workflow
- Changes pushed to main branch automatically deploy via Vercel
- v0.dev integration allows rapid UI iteration
- Content changes require redeployment for cache invalidation

### TypeScript Configuration
- TypeScript errors ignored during builds (`ignoreBuildErrors: true`)
- ESLint errors ignored during builds (`ignoreDuringBuilds: true`)
- This allows for rapid iteration while maintaining type safety in development

### Styling System
- Uses Tailwind with custom dark theme (slate-950 background)
- shadcn/ui components for consistent design system
- Responsive design with mobile-first approach
- Custom animations and transitions for enhanced UX

## Unique Aspects

### Content Strategy
The blog uniquely combines technical leadership insights with D&D storytelling metaphors. When working with content:
- Leadership articles often reference D&D campaign management parallels
- Technical articles focus on scalable architecture and team dynamics
- Artumin content is creative worldbuilding that demonstrates storytelling skills
- D&D content bridges gaming mechanics with leadership principles

### Brand Voice
Content should maintain John's distinctive voice combining:
- Technical precision with creative problem-solving
- Strategic thinking with practical implementation
- Professional expertise with approachable storytelling
- Leadership insights with collaborative team focus