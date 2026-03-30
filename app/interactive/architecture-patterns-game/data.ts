export type PatternId =
  | "strangler"
  | "saga"
  | "cqrs"
  | "event-driven"
  | "sidecar"
  | "circuit-breaker"
  | "cache-aside"

export type PatternCard = {
  id: PatternId
  name: string
  label: string
  tagline: string
  metaphor: string
  pressureCategory: string
  bestFor: string[]
  tradeoffs: string[]
  avoidWhen: string
  misuseTrap: string
  accent: string
}

export type ScenarioCard = {
  id: string
  title: string
  situation: string
  pressure: string
  dominantPressure: string
  signals: string[]
  recommendedPattern: PatternId
  temptingWrongPattern: PatternId
  temptingWrongReason: string
  betrayalExplanation: string[]
  punishment: string
  relatedPattern: PatternId
  logicalChoice: string
  tradeoffs: string[]
  wrongGuessGuidance: string
  bonusNote: string
}

export type PressureCategory = {
  id: string
  label: string
}

export const patternCards: PatternCard[] = [
  {
    id: "strangler",
    name: "Strangler Fig",
    label: "Strangler Fig",
    tagline: "Wrap the old system, peel pieces off slowly, and keep the lights on.",
    metaphor: "Put a new facade around the old building, then replace rooms one at a time.",
    pressureCategory: "Migration",
    bestFor: [
      "Incremental legacy modernization",
      "Reducing migration risk without a big-bang cutover",
      "Teams that need rollback options while learning the domain",
    ],
    tradeoffs: [
      "You carry two worlds for a while",
      "Routing and ownership boundaries get messy during the transition",
      "Progress can stall if you never retire the old slices",
    ],
    avoidWhen: "Avoid when the old system is simple enough to replace directly and the migration window is low risk.",
    misuseTrap: "Using Strangler Fig without explicit slice ownership turns migration into a permanent dual-system tax.",
    accent: "#D97706",
  },
  {
    id: "saga",
    name: "Saga",
    label: "Saga",
    tagline: "Break one giant transaction into local steps with compensating actions.",
    metaphor: "A travel itinerary with cancellation rules for each booking leg.",
    pressureCategory: "Rollback",
    bestFor: [
      "Distributed workflows across several services",
      "Business processes with partial success and rollback semantics",
      "Cases where a global database transaction is unrealistic",
    ],
    tradeoffs: [
      "Compensation logic is real product logic, not cleanup glue",
      "Observability gets harder because the workflow spans time and systems",
      "Users can see temporary inconsistency while steps complete",
    ],
    avoidWhen: "Avoid when you need strict immediate consistency across every step and cannot tolerate intermediate states.",
    misuseTrap: "Teams misuse Saga when the real problem is migration or fan-out, not coordinated compensation across business steps.",
    accent: "#B45309",
  },
  {
    id: "cqrs",
    name: "CQRS",
    label: "CQRS",
    tagline: "Separate write intent from read optimization when both workloads want different shapes.",
    metaphor: "One kitchen takes orders, another line plates dishes for speed.",
    pressureCategory: "Read shape",
    bestFor: [
      "Heavy read traffic with richer query needs than the write model supports",
      "Audit-friendly command handling with specialized read views",
      "Systems where scaling reads and writes independently matters",
    ],
    tradeoffs: [
      "More models, more synchronization, more operational surface area",
      "Read models can lag behind writes",
      "Teams sometimes adopt it too early and inherit needless complexity",
    ],
    avoidWhen: "Avoid when CRUD is sufficient and read/write scaling pressure is still modest.",
    misuseTrap: "CQRS is overused when latency pain is really a caching issue or when the domain still wants a simple CRUD model.",
    accent: "#2563EB",
  },
  {
    id: "event-driven",
    name: "Event-Driven",
    label: "Event-Driven",
    tagline: "Publish facts once and let interested systems react asynchronously.",
    metaphor: "A radio broadcast that many listeners can tune into at the same time.",
    pressureCategory: "Fan-out",
    bestFor: [
      "Fan-out workflows with many downstream consumers",
      "Loose temporal coupling between producers and consumers",
      "Systems that benefit from extensibility over tight request chains",
    ],
    tradeoffs: [
      "Tracing cause and effect gets harder",
      "Ordering and idempotency become design problems",
      "Event contracts can become accidental APIs if not governed",
    ],
    avoidWhen: "Avoid when the caller needs a synchronous yes-or-no answer right now.",
    misuseTrap: "Event-driven systems get misapplied when teams still need immediate confirmation or clear transactional rollback semantics.",
    accent: "#0F766E",
  },
  {
    id: "sidecar",
    name: "Sidecar",
    label: "Sidecar",
    tagline: "Attach shared operational behavior beside the app instead of inside it.",
    metaphor: "A support van driving next to the main race car handling fuel, telemetry, and radios.",
    pressureCategory: "Operational placement",
    bestFor: [
      "Cross-cutting operational concerns such as logging, mTLS, or proxying",
      "Keeping application code focused on business logic",
      "Standardizing capabilities across many services",
    ],
    tradeoffs: [
      "Resource overhead grows quickly at scale",
      "A broken sidecar can still hurt a healthy service",
      "Debugging becomes a two-container problem instead of one",
    ],
    avoidWhen: "Avoid when the concern is deeply application-specific or the platform cost outweighs the reuse benefit.",
    misuseTrap: "Sidecars become wasteful when the concern is app-specific or when platform overhead grows faster than the reuse value.",
    accent: "#7C3AED",
  },
  {
    id: "circuit-breaker",
    name: "Circuit Breaker",
    label: "Circuit Breaker",
    tagline: "Fail fast when a dependency is unstable so the rest of the system can breathe.",
    metaphor: "Trip the fuse before the whole house overheats.",
    pressureCategory: "Resilience",
    bestFor: [
      "Protecting against cascading dependency failure",
      "Giving systems time to recover instead of amplifying incidents",
      "Fallback and degradation strategies in synchronous paths",
    ],
    tradeoffs: [
      "Bad thresholds can flap or hide recoveries",
      "You still need useful fallback behavior",
      "It treats symptoms of dependency pain, not root causes",
    ],
    avoidWhen: "Avoid when the dependency is not actually optional and no safe degraded mode exists.",
    misuseTrap: "Circuit breakers are often treated as a cure-all when the system still lacks fallback behavior or timeout discipline.",
    accent: "#DC2626",
  },
  {
    id: "cache-aside",
    name: "Cache-Aside",
    label: "Cache-Aside",
    tagline: "Load from cache first, then fetch and backfill on misses.",
    metaphor: "Keep the most-used books on the desk and fetch from the archive only when needed.",
    pressureCategory: "Hot reads",
    bestFor: [
      "Read-heavy workloads with repeat access patterns",
      "Protecting expensive data stores from repetitive reads",
      "Improving tail latency for hot content",
    ],
    tradeoffs: [
      "Invalidation strategy decides whether the pattern helps or lies",
      "Cold starts and stampedes can shift the pain to the database",
      "Staleness is an explicit product tradeoff",
    ],
    avoidWhen: "Avoid when data freshness requirements are stricter than the cache lifecycle can support.",
    misuseTrap: "Cache-aside fails when teams treat invalidation as optional and end up speeding up stale or misleading data.",
    accent: "#1D4ED8",
  },
]

export const scenarioCards: ScenarioCard[] = [
  {
    id: "legacy-checkout",
    title: "Checkout Escape Mission",
    situation:
      "Your checkout flow lives in a ten-year-old monolith. A failed cutover this quarter means missed revenue targets and leadership loses confidence in the migration.",
    pressure: "Low tolerance for downtime. High tolerance for temporary architectural awkwardness.",
    dominantPressure: "Migration risk",
    signals: [
      "Need gradual traffic shifting",
      "Rollback must stay cheap",
      "Old and new code will coexist for a while",
    ],
    recommendedPattern: "strangler",
    temptingWrongPattern: "saga",
    temptingWrongReason: "Saga sounds plausible because there are multiple moving parts and future service boundaries are coming.",
    betrayalExplanation: [
      "Saga helps when distributed rollback across several local transactions is the main pressure.",
      "Here the real pressure is safe coexistence during migration while revenue keeps flowing.",
      "You are not coordinating many local transactions yet. You are moving a boundary without breaking the business.",
    ],
    punishment: "A big-bang rewrite or workflow-first redesign would put the revenue path at risk before the migration boundary is stable.",
    relatedPattern: "sidecar",
    logicalChoice:
      "Strangler Fig is the logical choice because it lets you route one slice at a time to new services while the monolith continues serving everything else.",
    tradeoffs: [
      "You need crisp boundaries for each slice or the migration stalls.",
      "Dual routing and duplicate behavior can create temporary complexity.",
      "If nobody owns retiring old paths, the transition becomes permanent.",
    ],
    wrongGuessGuidance:
      "A direct rewrite sounds cleaner, but the scenario optimizes for controlled migration risk rather than architectural purity.",
    bonusNote: "Strong teams pair this with a gateway or facade so traffic can move safely by capability, not by hope.",
  },
  {
    id: "trip-booking",
    title: "Trip Booking Chaos",
    situation:
      "A travel platform books flights, hotels, and cars through separate services. One booking can fail after another already succeeded, and the user still expects a coherent outcome.",
    pressure: "Consistency matters, but a single cross-service transaction is unrealistic.",
    dominantPressure: "Distributed rollback",
    signals: [
      "Many services own separate data",
      "Partial success is normal",
      "Compensating actions are available",
    ],
    recommendedPattern: "saga",
    temptingWrongPattern: "event-driven",
    temptingWrongReason: "Event-Driven is tempting because many services are reacting asynchronously and loose coupling sounds attractive.",
    betrayalExplanation: [
      "Event-Driven architecture explains how signals move, but not how business rollback stays coherent.",
      "The dominant pressure is compensating for partial success across a user-visible workflow.",
      "Without saga semantics, the system can publish plenty of events and still leave the booking outcome inconsistent.",
    ],
    punishment: "Pure asynchronous fan-out would hide rollback gaps until customers discover half-booked trips and support gets buried.",
    relatedPattern: "event-driven",
    logicalChoice:
      "Saga is the logical choice because the workflow needs ordered local transactions plus compensating actions when later steps fail.",
    tradeoffs: [
      "You must design compensation flows as carefully as the happy path.",
      "Users may briefly see states that are still settling.",
      "Tracing and support workflows need strong correlation IDs and timeline visibility.",
    ],
    wrongGuessGuidance:
      "Event-driven messaging helps with decoupling, but it does not by itself solve coordinated rollback logic across business steps.",
    bonusNote: "If orchestration logic becomes critical to business policy, explicit saga orchestration is usually clearer than pure choreography.",
  },
  {
    id: "analytics-dashboard",
    title: "Dashboard Stampede",
    situation:
      "An operations dashboard receives millions of reads per hour across filters, leaderboards, and summaries. Writes are smaller but must remain authoritative, while product wants custom read views to feel instant.",
    pressure: "Read performance matters more than showing writes everywhere immediately.",
    dominantPressure: "Read/write shape mismatch",
    signals: [
      "Read and write workloads have different shapes",
      "Projections are acceptable",
      "Specialized query models keep appearing",
    ],
    recommendedPattern: "cqrs",
    temptingWrongPattern: "cache-aside",
    temptingWrongReason: "Cache-Aside is tempting because the dashboard is under read pressure and the latency problem is visible.",
    betrayalExplanation: [
      "Cache-Aside helps repeated hot reads, but it does not solve fundamentally different read and write models.",
      "The dominant pressure is that the system wants one write shape and many optimized query shapes.",
      "If you only cache the current model, the awkward read model remains awkward, just slightly faster.",
    ],
    punishment: "Treating this as only a cache problem would preserve the wrong model and keep every new dashboard query expensive to build.",
    relatedPattern: "cache-aside",
    logicalChoice:
      "CQRS is the logical choice because the system wants one model optimized for writes and separate projections optimized for the fast, varied reads the dashboard needs.",
    tradeoffs: [
      "Projection lag must be acceptable to the product and support teams.",
      "You now operate more than one model and need replay or repair strategies.",
      "If the domain is still simple, the architecture can become heavier than the problem.",
    ],
    wrongGuessGuidance:
      "Cache-Aside helps hot reads, but this scenario points to fundamentally different read and write representations, not just repeated reads.",
    bonusNote: "CQRS gets especially compelling when auditability, derived views, and independent read scaling all matter at once.",
  },
  {
    id: "inventory-fanout",
    title: "Inventory Broadcast Storm",
    situation:
      "When inventory changes, pricing, recommendations, search, and warehouse systems all need to react. New downstream consumers keep arriving and the source team is tired of wiring one-off integrations.",
    pressure: "Loose coupling and extensibility matter more than immediate synchronous responses.",
    dominantPressure: "Fan-out",
    signals: [
      "Many consumers want the same domain fact",
      "Consumers evolve independently",
      "Producer should not know every subscriber",
    ],
    recommendedPattern: "event-driven",
    temptingWrongPattern: "cqrs",
    temptingWrongReason: "CQRS sounds plausible because read models and downstream projections are involved.",
    betrayalExplanation: [
      "CQRS helps when read and write responsibilities diverge around one domain model.",
      "The dominant pressure here is that one fact must reach many independent consumers without the producer coordinating every integration.",
      "This is about propagation and extensibility first, not read-model specialization first.",
    ],
    punishment: "If the producer keeps owning every downstream integration, each new subscriber turns into another release dependency and another scaling bottleneck.",
    relatedPattern: "cqrs",
    logicalChoice:
      "Event-Driven architecture is the logical choice because inventory changes are domain facts that multiple consumers can subscribe to without tight request/response coupling.",
    tradeoffs: [
      "You need contract governance so events do not become accidental chaos.",
      "Duplicates and ordering edge cases will show up in production, not in diagrams.",
      "Debugging becomes timeline work across producer, broker, and consumers.",
    ],
    wrongGuessGuidance:
      "An API fan-out would keep the producer tightly coupled to every downstream system and make each new subscriber a coordination project.",
    bonusNote: "Teams often combine this with idempotent consumers and replayable streams so new subscribers can catch up safely.",
  },
  {
    id: "mesh-observability",
    title: "The Telemetry Smuggler",
    situation:
      "Your platform team wants every service to get mTLS, request logs, and traffic telemetry without forcing each application team to rewrite business code for those concerns.",
    pressure: "Operational consistency matters more than pure deployment simplicity.",
    dominantPressure: "Cross-cutting operational behavior",
    signals: [
      "Concern is cross-cutting",
      "Behavior should sit beside the app",
      "Platform wants standardized rollout",
    ],
    recommendedPattern: "sidecar",
    temptingWrongPattern: "circuit-breaker",
    temptingWrongReason: "Circuit Breaker feels related because resilience and traffic behavior are part of the conversation.",
    betrayalExplanation: [
      "Circuit Breaker protects one unstable dependency path.",
      "The dominant pressure here is standardizing reusable operational capabilities across many services without rewriting application logic.",
      "This is a placement problem for shared concerns, not just a resilience policy problem.",
    ],
    punishment: "Embedding every operational concern into each service would create platform drift, inconsistent rollout quality, and endless duplicate plumbing.",
    relatedPattern: "circuit-breaker",
    logicalChoice:
      "Sidecar is the logical choice because the capabilities are operational and reusable across services, so attaching them beside the app avoids repeating the same plumbing everywhere.",
    tradeoffs: [
      "Per-service overhead can become expensive quickly.",
      "A bad sidecar rollout can create a platform-wide incident.",
      "Teams need tooling that makes two-container debugging tolerable.",
    ],
    wrongGuessGuidance:
      "A library integration would work for some teams, but it would push the same operational concern into every codebase and every release cycle.",
    bonusNote: "This pattern works best when the platform team treats sidecars as products with versioning, observability, and safe rollout controls.",
  },
  {
    id: "payment-provider",
    title: "Payment Provider Panic",
    situation:
      "A third-party payment service starts timing out under load. Your checkout API keeps waiting, thread pools are filling, and retries are making the outage feel bigger than it is.",
    pressure: "User experience needs graceful degradation, not perfect success.",
    dominantPressure: "Cascading dependency failure",
    signals: [
      "Dependency instability is cascading upstream",
      "Fast failure is better than waiting forever",
      "Fallback behavior matters",
    ],
    recommendedPattern: "circuit-breaker",
    temptingWrongPattern: "event-driven",
    temptingWrongReason: "Event-Driven can seem attractive because decoupling and buffering feel like a way out of synchronous pain.",
    betrayalExplanation: [
      "Event-Driven patterns change the interaction model, but they do not directly protect the current synchronous checkout path.",
      "The dominant pressure is stopping an unhealthy dependency from consuming the caller's capacity right now.",
      "This incident needs controlled failure on the active request path before any larger redesign conversation matters.",
    ],
    punishment: "If requests keep waiting on a dying provider, retries and thread exhaustion will make the outage spread into your own system.",
    relatedPattern: "event-driven",
    logicalChoice:
      "Circuit Breaker is the logical choice because the system needs to stop hammering an unhealthy dependency and move quickly to a controlled fallback path.",
    tradeoffs: [
      "Threshold tuning is operational work, not a one-time setting.",
      "If the fallback path is weak, users still have a bad day.",
      "This protects the caller, but it does not repair the provider.",
    ],
    wrongGuessGuidance:
      "A queue can absorb some pressure, but the immediate issue is synchronous dependency collapse on the active request path.",
    bonusNote: "Pair it with timeouts, bulkheads, and idempotent retry rules or the breaker alone will not save the request path.",
  },
  {
    id: "catalog-latency",
    title: "Catalog Speed Run",
    situation:
      "A product catalog is read constantly and updated occasionally. The database is healthy but expensive, and page latency spikes whenever hot items miss the fastest path.",
    pressure: "Freshness matters, but sub-second reads matter more for most users.",
    dominantPressure: "Hot-read latency",
    signals: [
      "Read-heavy traffic",
      "Repeated access to hot data",
      "Staleness can be bounded",
    ],
    recommendedPattern: "cache-aside",
    temptingWrongPattern: "cqrs",
    temptingWrongReason: "CQRS is tempting because faster reads and projections sound like the answer to every read problem.",
    betrayalExplanation: [
      "CQRS is useful when read and write models truly need different representations.",
      "The dominant pressure here is repeated hot access with acceptable bounded staleness.",
      "This is a caching problem first. Introducing separate command and query models too early would spend complexity where latency tuning would do.",
    ],
    punishment: "If you over-architect the read path instead of fixing hot-read behavior, you inherit more moving parts while the database still gets hammered on misses.",
    relatedPattern: "cqrs",
    logicalChoice:
      "Cache-Aside is the logical choice because it reduces repeated reads from the primary store while still allowing the application to fetch and backfill on misses.",
    tradeoffs: [
      "You need a plan for invalidation, TTLs, and hot-key behavior.",
      "Cold cache events can still slam the database.",
      "The product team must accept bounded staleness in exchange for speed.",
    ],
    wrongGuessGuidance:
      "CQRS can also optimize reads, but this scenario is mostly about repeated hot access and latency pressure, not a fundamentally different read model.",
    bonusNote: "Request coalescing and stale-while-revalidate can make this pattern feel much better under burst traffic.",
  },
]

export const pressureCategories: PressureCategory[] = [
  { id: "migration risk", label: "Migration risk" },
  { id: "distributed rollback", label: "Distributed rollback" },
  { id: "read/write shape mismatch", label: "Read shape" },
  { id: "fan-out", label: "Fan-out" },
  { id: "cross-cutting operational behavior", label: "Operational placement" },
  { id: "cascading dependency failure", label: "Failure containment" },
  { id: "hot-read latency", label: "Hot-read latency" },
]
