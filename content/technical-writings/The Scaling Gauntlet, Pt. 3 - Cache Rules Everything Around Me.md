---
title: "The Scaling Gauntlet, Pt. 3 - Cache Rules Everything Around Me"
subtitle: "Your app is fast now. Time to stop doing the same work 400,000 times a week."
date: "2026-02-05"
excerpt: "Query tuning and connection pools got you stable. Caching gets you efficient. Here’s how to cache with intent, avoid stampedes, and invalidate without regret."
tags: ["WebDev", "Performance", "Backend", "JavaScript", "Scalability"]
series: "The Scaling Gauntlet"
series_slug: "the-scaling-gauntlet"
series_order: 3
series_description: "A practical series on surviving growth bottlenecks in production systems, from query performance to connection management and beyond."
reading_time: 7
featured_image: /cacheruleseverything.png
medium_link: https://medium.com/@johnmunn/the-scaling-gauntlet-pt-3-cache-rules-everything-around-me-b045802f3ee0
devto_link: https://dev.to/tawe/the-scaling-gauntlet-pt-3-cache-rules-everything-around-me-aa8
substack:
code_languages: []
draft: false
---

It starts, like all false dawns, with good news.
Your load tests are green. Your connection count is stable.

Postgres Pete is calm.

The team celebrates. Someone makes a meme.

But something's off.
Not "the app is down" bad. Just... squishy.

Latency spikes for logged-out users. Report generation still eats a chunk of the CPU.

And every time someone lands on the homepage, your servers run the same query for the 400,000th time this week.

You're not slow anymore. You're wasteful.

Welcome to Chapter 3: where your architecture is finally fast enough to reveal just how much duplicated work you're doing.

* * *

## War Story: The Leaderboard That Melted Everything

A few years back, we launched a gamified campaign. Leaderboard. Badges. Daily rewards.

The catch?

We recalculated the leaderboard on every request.

Every. Single. One.

Each hit triggered a massive sort, join, and filter operation across millions of rows. At launch, it didn't matter. Maybe 100 users an hour.

But when it went viral?

90,000 hits in a day.

> Our DB didn't crash.
> It simmered. Slowly. Tragically.

Adding a 60-second Redis cache dropped response times from 912ms to 38ms.

Query load dropped by 99.7%.

Postgres Pete wrote us a thank-you note.

* * *

## Chapter 3: Caching Isn't Cheating

At small scale, caching is optional. At large scale, it's everything.

It's how you survive.

The illusion is that if you make your database fast, and your queries efficient, you're good.

But when 1,000 users hit the same route and you generate 1,000 identical responses, congratulations, you've optimized waste.

Caching is how you stop being a short-order cook

...and start being a chef with a prep station.

* * *

## The Caching Stack

Let's break it down by layer, not tool. You don't need Redis just because someone on your team read a blog post. You need the right kind of cache for the right kind of job.

* * *

### Page and Fragment Caching

> When to use: Full-page responses that don't change per user.
> Where: WordPress, SSR frameworks, marketing pages, logged-out views.

- CDN edge caching (Cloudflare, Fastly) for static assets
- Static HTML snapshots
- Component-level fragment caching (Next.js static rendering or ISR/revalidation patterns)

* * *

### Query Result Caching

> When to use: Expensive queries that return predictable results.
> Where: Reports, leaderboards, stats pages.

- Cache result of a query in Redis for 30-300 seconds
- Bust or update on key data changes
- Use consistent, deterministic cache keys like `leaderboard:daily:2025-07-06`

* * *

### Object Caching

> When to use: Frequently accessed entities that don't change often.
> Where: User settings, pricing tables, content metadata.

- Load object into cache on first access
- TTL plus write-through or read-through patterns
- Namespaced keys help avoid pollution, e.g. `user:42:profile`

* * *

### Edge Caching and CDNs

> When to use: Static assets, APIs with safe GETs, regional latency improvements.
> Where: Next.js, Shopify headless, and global static content.

- `GET /products?category=fitness`? Cache it.
- `POST /checkout`? Don't.
- Use surrogate keys to invalidate sets (`product:updated` -> purge `/products`)

* * *

## Redis Example: Cache-Aside Pattern

```javascript
// Basic cache-aside pattern
const getCachedUser = async (userId) => {
  const cached = await redis.get(`user:${userId}`)
  if (cached) return JSON.parse(cached)

  const user = await db.users.findById(userId)
  await redis.setex(`user:${userId}`, 300, JSON.stringify(user))
  return user
}
```

* * *

## Concrete Example: Homepage Latency

Before:

- Homepage load time: 680ms
- 90% spent on DB and API calls
- Redis hit rate: 12%

After:

- Homepage load time: 112ms
- DB queries reduced by 87%
- Redis hit rate: 89%

Caching just three components (featured products, blog teasers, and testimonials) made the biggest impact.

* * *

## Cache Busting: The Forgotten Half of Caching

Writing to a cache is easy.
Invalidating it correctly is what separates grown-up systems from hopeful experiments.

```text
               +------------------------+
               |     Does the data      |
               |     change often?      |
               +------------------------+
                          |
         +----------------+----------------+
         |                                 |
       Yes                                No
        |                                  |
 +--------------+                +--------------------+
 | Can you hook |                | Use long TTL with  |
 | into writes? |                | fallback refresh   |
 +------+-------+                +--------------------+
        |Yes
        |
 +--------------+
 | Event-driven |
 | invalidation |
 +--------------+
        |No
        |
 +--------------+
 | Use low TTL  |
 | w/ polling   |
 +--------------+
```

### Cache Busting Methods

#### Time-Based (TTL)

- Easy to reason about
- Accepts a bit of staleness
- Good enough for dashboards, stats, pricing

#### Event-Driven

- Invalidate cache when data updates
- Use hooks in your ORM or pub/sub system
- Harder to manage but more accurate

Example: update a product price, trigger an event that clears `product:123` in Redis and related keys like `category:fitness:featured`.

```javascript
// In your product update handler:
await redis.del(`product:${product.id}`)
await redis.del(`category:${product.category}:featured`)
```

#### Dependency-Tracking (Advanced)

- Track what data powers what cache
- Rebuild only what's affected
- Requires discipline and tooling

* * *

## Signs Your Cache Is (or Isn't) Working

### Healthy Caching

- Cache hit rates >80% for hot paths
- Time to first byte is low even under load
- Redis/Memcached resource usage is predictable

### Caching Gone Wrong

- Users seeing stale data or inconsistency
- Hit rates low, invalidation too aggressive
- Cache entries are massive binary blobs
- Conflicting caches (app and CDN fighting freshness)

* * *

## Cache Debugging: What to Watch

- Redis/Memcached `INFO STATS`: watch `keyspace_hits` vs `keyspace_misses`
- Log slow/missed lookups: tag routes where cache failed silently
- Cache stampedes: detect fan-out misses; add locking or stale-while-revalidate
- TTL expirations: verify they align to real traffic patterns

* * *

## Advanced Patterns (For When You're Ready)

### Stale-While-Revalidate

- Serve stale data immediately
- Revalidate in background and replace cache
- Reduces perceived latency
- Can be implemented with HTTP headers (`stale-while-revalidate`) or app middleware

### Soft TTL + Refresh

- Items have a TTL, but near-expiry reads trigger background refresh
- Prevents cold starts and keeps hot items warm
- Good for frequently accessed, infrequently updated data

### Sharded or Namespaced Caches

- Use key prefixes to separate scopes
- Example: `tenant-42:user:profile`, `locale-en:settings`
- Prevents collisions and simplifies bulk invalidation

* * *

## Caching Anti-Patterns

- Caching user-specific or sensitive data globally
- Hardcoding long TTLs for rapidly changing data
- Caching everything with no purge strategy

* * *

## TL;DR: Cache with Intent

- Don't just optimize slow things. Avoid doing them repeatedly.
- Choose the right cache for the right problem.
- Design your cache busting before you go live.
- Monitor hit rates, not just cache size.
- Caching isn't cheating. It's how systems scale.

* * *

Your app isn't just fast now. It's efficient.
Your team isn't chasing ghosts. They're building confidently.
Postgres Pete? He's finally taking lunch breaks again.

But don't relax too long.
Because in Part 4, you'll find out what happens when caching stops helping...

...and you need to start splitting your read and write workloads.

Stay tuned.

Next up: Scaling Reads Without Sharding Your Soul
