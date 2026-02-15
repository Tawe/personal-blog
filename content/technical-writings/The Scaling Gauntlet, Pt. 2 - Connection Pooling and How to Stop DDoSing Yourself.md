---
title: "The Scaling Gauntlet, Pt. 2 - Connection Pooling and How to Stop DDoSing Yourself"
subtitle: "When every request opens a new database connection, your biggest performance threat might be… yourself."
date: "2025-06-28"
excerpt: "Fast queries aren’t enough. Without connection pooling, your app becomes its own DDoS. Learn how to stop flooding your database to death."
tags: ["Backend", "Performance", "Database", "Software Development", "Scalability"]
series: "The Scaling Gauntlet"
series_slug: "the-scaling-gauntlet"
series_order: 2
series_description: "A practical series on surviving growth bottlenecks in production systems, from query performance to connection management and beyond."
reading_time: 6
featured_image: /ConnectionPoolingandHowtoStopDDoSingYourself.webp?height=400&width=800
medium_link: https://medium.com/@johnmunn/the-scaling-gauntlet-pt-2-connection-pooling-and-how-to-stop-ddosing-yourself-4c6f95f233b5
devto_link: https://dev.to/tawe/the-scaling-gauntlet-pt-2-connection-pooling-and-how-to-stop-ddosing-yourself-11gn
substack:
code_languages: []
draft: false
---

It started, as most database revelations do, with a false sense of victory.

You’d just finished your query optimization sprint. Your queries were optimized. Your indexes were pristine. Your EXPLAIN ANALYZE outputs finally made sense.

Postgres Pete was breathing easier. The dashboard was loading faster. You leaned back in your chair, cracked your knuckles, and thought: “Bring on GigaGym.”

Then you decided to run a quick load test.

Just 200 concurrent users. Nothing crazy. A gentle warm-up before the real 100,000-user avalanche next month.

The results came back and your confidence evaporated.

Response times: 30 seconds. Timeouts everywhere. Your beautiful, optimized queries were crawling like they were running through molasses.

You opened your monitoring tab, expecting to see slow queries or missing indexes.

Instead, you saw the real problem:

**Connections: 200/200**

Your queries were fast. Your database was drowning.

Congratulations. You’d optimized the engine but forgotten about the parking lot.

## Chapter 2: The Connection Catastrophe

Every request, every worker, every background job, spawning its own fresh, unpooled connection like it’s giving out party favors.

At low load, this goes unnoticed.

At scale? It’s chaos.

Postgres isn’t designed to juggle hundreds of concurrent connections like a chatty Discord server. It likes reuse. Order. Boundaries.

Without connection pooling, each new request is like hiring a new barista for one coffee. Do that 300 times and your café isn’t scaling. It’s collapsing.

## The Connection Archaeology

You dig into the logs, hoping for clarity but finding only chaos:

```ruby
FATAL: sorry, too many clients already  
FATAL: remaining connection slots are reserved for non-replication superuser connections   
ERROR: could not connect to server: Connection refused  
```

You check the app config. No pooling. You check staging. Also no pooling. You check the background worker. Still no pooling.

Your app isn’t just talking to the database. **It’s screaming.**

And poor Postgres Pete? He’s trying to have 200 individual conversations simultaneously while juggling flaming torches.

## The Connection Pool Decoder Ring

Before you fix it, you need to understand what you’re looking at. Here’s how to read the signs of connection chaos:

**In `pg_stat_activity`:**

```sql  
SELECT state, count(*)   
FROM pg_stat_activity   
GROUP BY state;
```
Good:
```go
 active | 5  
 idle | 10   
 idle in transaction | 2
```
Bad:
```go
 active | 156  
 idle | 89  
 idle in transaction | 47
```
**Key Warning Signs:**

- High ‘idle’ count: Connections sitting around doing nothing
- ’idle in transaction’: Connections holding locks while napping
- Connection churn: New connections constantly appearing/disappearing
- Query queuing: Fast queries taking forever to start

Think of it like a restaurant where every customer demands their own waiter, then sits at the table for 3 hours reading the menu.

## The Pool Fix

Connection pooling is how you tell your app to take a breath.

Instead of opening a fresh connection for every request, you keep a small, reusable set like a rideshare carpool for your queries.

**App-Level Pools**

Most ORMs support basic pooling:
```javascript  
// Prisma  
pool_max = 10  
pool_timeout = 20  
  
// Sequelize   
pool: {   
 max: 10,   
 min: 2,  
 acquire: 30000,  
 idle: 10000  
}  
  
// Rails  
pool: 5  
timeout: 5000  
```
Start small. **5-15 connections per app instance** is usually plenty.

**Infrastructure Pools**

For real control, introduce **PgBouncer**:
```TOML
[databases]  
myapp = host=localhost port=5432 dbname=myapp  
  
[pgbouncer]  
pool_mode = transaction  
listen_port = 6432  
default_pool_size = 25  
max_client_conn = 200  
server_reset_query = DISCARD ALL
```
Run it in **transaction mode** for best efficiency. Use it as the single DB endpoint for all environments.

## Connection Pool Anti-Patterns

Here’s how teams usually mess this up:

**The “More is Better” Fallacy**
```go
# This is not a solution, it’s panic  
pool: 1000  
max_connections: 2000  
```
This is like widening a highway by adding lanes that all merge into the same single-lane bridge. You’re not solving congestion, you’re moving it.

**The “Set and Forget” Trap**
```javascript
// Development config that somehow made it to prod  
pool: { max: 1 }

```
One connection for your entire app. That’s not pooling, that’s creating a bottleneck with a fancy name.

**The “Background Job Bomber”**
```python
# Every job opens its own connection  
def process_user_data():  
 db = Database.connect() # New connection every time  
 # … do work  
 db.close()
```
Background jobs are the worst offenders. They spawn, grab a connection, do work, then vanish, leaving connection counts looking like a seismograph during an earthquake.

## War Story: The Crawler That Broke Christmas

True story from the trenches: Three days before Christmas launch, we deployed a new feature to staging. Everything looked perfect. Load tests passed. Performance was solid.

Then someone forgot to add basic auth to the staging environment.

Within 6 hours, every search engine crawler on the internet discovered our unprotected staging site. Google, Bing, and a dozen smaller crawlers started indexing every single page, including dynamically generated preview routes.

Each preview route triggered an expensive background job. Each background job opened a fresh database connection. No pooling. No limits. No mercy.

The staging database went from handling 20 comfortable connections to choking on 800+ simultaneous connections. But here’s the twisted part: the crawlers didn’t care that responses were timing out. They just kept crawling, patiently waiting 30 seconds for each page load.

- What we saw in pg_stat_activity
```sql
SELECT count(*), state FROM pg_stat_activity GROUP BY state;  
  
count | state   
 — — — -+ — — — -  
 47 | active  
 312 | idle   
 441 | idle in transaction
 ```
Over 400 connections stuck “idle in transaction”, each one holding locks, blocking other queries, creating a cascading failure that looked like a DDoS attack.

The fix? Three lines in `robots.txt` and enabling connection pooling. The lesson? Your database can’t tell the difference between real users and robots, it just counts connections.

What looked like a mysterious traffic surge was actually **800 connections playing musical chairs with 20 seats**.

## The Scaling Pool Recipe

Getting pool sizes right is more art than science, but here’s a recipe that works:

**For your PostgreSQL server:**  
```TOML
# postgresql.conf  
max_connections = 200  
shared_buffers = 256MB
```
Start here and monitor. Don’t just crank it to 1000 and hope for the best.

**For PgBouncer:**
```TOML
# pgbouncer.ini  
max_client_conn = 500 # How many clients can connect to bouncer  
default_pool_size = 25 # Actual connections to PostgreSQL  
pool_mode = transaction # Release connections after each transaction
```
Rule of thumb: CPU cores × 2-4 for the pool size.

**For your application:**
```js
// Per app instance, not total  
pool: {  
 max: 10, // Max connections per instance  
 min: 2, // Keep some warm  
 acquire: 30000, // Max wait time  
 idle: 10000 // Close idle connections  
}
```
**Enable connection timeouts everywhere:**
```TOML
# PgBouncer  
server_idle_timeout = 600 # Close idle server connections  
client_idle_timeout = 0 # Let clients decide  
  
# PostgreSQL   
idle_in_transaction_session_timeout = 300000 # 5 minutes
```
**The Math:**

- 3 app instances × 10 connections each = 30 connections
- Background workers: 5 connections
- Admin/monitoring: 5 connections
- **Total: 40 connections** (well under the 200 limit)

Leave room to breathe. Your database will thank you.

## Tuning Your Pool: Advanced Patterns

**Connection Warming**
```js
// Warm up connections on app start  
pool: {  
 min: 5, // Keep 5 connections always ready  
 max: 15,  
 evictionRunIntervalMillis: 30000  
}
```
**Read/Write Splitting**
```js
// Separate pools for different workloads  
const writePool = { max: 5 }; // Heavy, exclusive operations  
const readPool = { max: 20 }; // Light, concurrent reads  

```
**Connection Health Checks**
```toml  
# PgBouncer health checking  
server_check_query = SELECT 1;  
server_check_delay = 30  
```
**Monitoring What Matters**

- Watch these metrics
```sql
SELECT   
 numbackends as active_connections,  
 xact_commit + xact_rollback as transactions_per_second  
FROM pg_stat_database   
WHERE datname = ‘myapp’;

```
## Signs You Fixed It

- Your database no longer sounds like a fax machine under pressure
- Queries execute. Pages load. 500s disappear
- Your connection graph plateaus instead of climbing toward orbit
- Your team stops dreading launch announcements

## TL;DR: Every Request Doesn’t Deserve a Fresh Connection

- **Pool your connections** at both the app and infrastructure level
- **Start conservative** with pool sizes 5–15 connections per app instance
- **Use PgBouncer** for professional-grade connection management
- **Set timeouts** to prevent connections from becoming digital zombies
- **Monitor your connection counts** like you monitor your response times

Next up: Caching strategies and the paradox of making fast things faster.

But for now, take a breath. You’ve moved from query chaos into connection clarity.

Your load test is passing. Your connection count is stable. Postgres Pete is no longer hyperventilating.

But don’t get too comfortable. Because tomorrow, you’re going to run another test with 1,000 concurrent users.

And that’s when you’ll discover that even perfectly pooled connections can’t save you from the next bottleneck in the scaling gauntlet.

Remember: **Your app isn’t special. It still needs to learn to share.**
