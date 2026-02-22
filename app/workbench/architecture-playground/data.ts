export type ArchitectureId = "api" | "message" | "event"
export type DiagramView = "happy" | "failure"

export type ComparisonMetricKey =
  | "coupling"
  | "latency"
  | "throughput"
  | "complexity"
  | "observability"
  | "consistency"
  | "failureHandling"
  | "evolvability"

export type CompareFilterKey =
  | "lowLatency"
  | "highThroughput"
  | "needAuditTrail"
  | "multipleConsumers"
  | "strictRequestResponse"

export interface DiagramNodeInfo {
  id: string
  label: string
  x: number
  y: number
  w: number
  h: number
  details: {
    happy: {
      whatItDoes: string
      failureModes: string[]
      scaling: string[]
    }
    failure: {
      whatItDoes: string
      failureModes: string[]
      scaling: string[]
    }
  }
}

export interface DiagramEdgeInfo {
  id: string
  from: string
  to: string
  label: string
  happyLabel?: string
  failureLabel?: string
}

export interface StackCategory {
  category: string
  options: string[]
}

export interface ArchitectureContent {
  id: ArchitectureId
  name: string
  tagline: string
  mentalModel: string
  decouplingReality: string
  failureShape: {
    summary: string
    immediate: string
    later: string
    silent: string
  }
  architecturalSmell: string
  coreComponents: Array<{ name: string; definition: string }>
  bestAt: string[]
  pros: string[]
  cons: string[]
  gotchas: string[]
  whenToUse: Array<{ decision: string; example: string }>
  dontUseWhen: string
  scalingStages: Array<{
    stage: "Naive" | "Intermediate" | "Advanced"
    teamContext: string
    steps: string[]
  }>
  typicalStack: StackCategory[]
  observabilityBurden: string
  observabilityReliability: {
    metrics: string[]
    loggingTracing: string[]
    failureHandling: string[]
  }
  diagram: {
    nodes: DiagramNodeInfo[]
    edges: DiagramEdgeInfo[]
  }
  compare: Record<ComparisonMetricKey, { value: string; score: 1 | 2 | 3 | 4 | 5; note: string }>
}

export interface ScenarioRecommendation {
  id: string
  label: string
  recommended: ArchitectureId[]
  reasoning: string
  watchOutFor: string[]
  scalingNotes: string[]
}

export interface CompareFilter {
  id: CompareFilterKey
  label: string
  description: string
  weights: Record<ArchitectureId, number>
  tradeoffNote: string
}

export interface ArchitectureLearningData {
  title: string
  intro: string[]
  metricLabels: Record<ComparisonMetricKey, string>
  architectures: ArchitectureContent[]
  compareFilters: CompareFilter[]
  scenarios: ScenarioRecommendation[]
}

export const architectureLearningData: ArchitectureLearningData = {
  title: "API vs Message vs Event-Driven Architecture",
  intro: [
    "These styles solve different coordination problems: APIs optimize direct interactions, message-driven systems optimize reliable task execution, and event-driven systems optimize fan-out with temporal decoupling.",
    "The differences impact latency, consistency, operability, and scaling cost. Choosing the wrong model can create brittle contracts, hidden queues, or hard-to-debug eventual consistency.",
    "Most mature platforms combine all three. The goal is understanding where each model leads, and where it hurts.",
  ],
  metricLabels: {
    coupling: "Coupling",
    latency: "Latency",
    throughput: "Throughput",
    complexity: "Complexity",
    observability: "Observability",
    consistency: "Consistency model",
    failureHandling: "Failure handling",
    evolvability: "Evolvability",
  },
  architectures: [
    {
      id: "api",
      name: "API-Driven Architecture",
      tagline: "Synchronous contracts for request/response workflows",
      mentalModel:
        "Think of this as a phone call between systems: a client asks for work now and waits for a response now. Contracts are explicit, usually versioned, and behavior is tightly tied to endpoint semantics.",
      decouplingReality:
        "API style has low temporal decoupling because callers wait in-line. It can offer deployment decoupling with stable contracts, but semantic coupling stays high because consumers depend on endpoint meaning and behavior.",
      failureShape: {
        summary:
          "Fast, loud, and potentially cascading. API failures are visible to users immediately; their virtue is clarity, not resilience.",
        immediate: "Timeouts, 5xxs, or throttling errors surface in the active request path.",
        later: "Retry storms, cache stampedes, and exhausted pools appear after initial slowdown.",
        silent: "Latency creep and hidden N+1 fan-out can degrade UX before hard failures trigger alerts.",
      },
      architecturalSmell:
        "Every new feature requires coordinated endpoint changes across many services before you can ship.",
      coreComponents: [
        {
          name: "Client",
          definition: "Web app, mobile app, or backend calling an API endpoint over HTTP/gRPC.",
        },
        {
          name: "API Gateway",
          definition:
            "Entry point that handles routing, auth enforcement, throttling, and often request shaping.",
        },
        {
          name: "Service",
          definition: "Business logic layer that validates input, orchestrates calls, and executes rules.",
        },
        {
          name: "Database",
          definition: "System of record for writes and reads, often split into OLTP + read models.",
        },
        {
          name: "Auth",
          definition: "Identity and authorization checks using tokens, policies, and scopes.",
        },
        {
          name: "Load Balancer",
          definition: "Distributes incoming traffic across service instances for availability.",
        },
        {
          name: "Cache",
          definition: "Reduces repeated reads and protects downstream dependencies.",
        },
      ],
      bestAt: [
        "Low-latency user interactions that need immediate feedback",
        "Clear authority boundaries where one service must say yes or no immediately",
        "Simple business flows with strict request/response semantics",
        "Strong API contracts and straightforward governance",
        "Use cases where clients need explicit error codes and retries",
      ],
      pros: [
        "Clear contracts and discoverable interfaces",
        "Good for synchronous UX flows",
        "Mature tooling for auth, rate limiting, and API lifecycle",
        "Easy to reason about call chains in small to medium systems",
      ],
      cons: [
        "Tight runtime coupling between caller and callee",
        "Cascading failures when dependencies are slow/unavailable",
        "Chatty APIs can explode latency and infrastructure cost",
        "Version sprawl can accumulate long-term maintenance debt",
      ],
      gotchas: [
        "N+1 calls across microservices can quietly dominate latency",
        "Thundering herd on cache misses can overload databases",
        "Unbounded pagination leads to memory and timeout problems",
        "Retries without idempotency can duplicate side effects",
        "Overly granular endpoints create chatty client behavior",
      ],
      whenToUse: [
        {
          decision: "You need strict request/response with immediate user confirmation",
          example: "User profile reads/writes and account settings APIs",
        },
        {
          decision: "Consumers require explicit contracts with auth and validation boundaries",
          example: "Public partner API with versioned endpoints",
        },
        {
          decision: "Workflow complexity is modest and end-to-end latency is key",
          example: "Search suggestions, cart updates, pricing lookups",
        },
      ],
      dontUseWhen:
        "Do not use as the primary workflow model when a business process spans many services with partial success and long-running compensations.",
      scalingStages: [
        {
          stage: "Naive",
          teamContext: "Small team with shared context and direct communication.",
          steps: [
            "Single service instance behind load balancer",
            "Add basic pagination and per-client rate limiting",
            "Introduce cache for read-heavy endpoints",
          ],
        },
        {
          stage: "Intermediate",
          teamContext: "Multiple teams with partial ownership and explicit service boundaries.",
          steps: [
            "Horizontal scale stateless API instances",
            "Use read replicas and cache invalidation strategy",
            "Add API gateway throttling and token bucket policies",
            "Implement circuit breakers and bulkheads for dependency isolation",
          ],
        },
        {
          stage: "Advanced",
          teamContext: "Independent roadmaps, formal SLOs, and dedicated on-call rotation.",
          steps: [
            "Adopt BFF patterns per client experience",
            "Offload long-running steps to async pipelines",
            "Use streaming/pagination contracts to cap payload size",
            "Add adaptive rate limits, workload shedding, and SLO-aware routing",
          ],
        },
      ],
      typicalStack: [
        {
          category: "API layer",
          options: ["REST or gRPC services", "API gateway", "OpenAPI contracts"],
        },
        {
          category: "Caching and data",
          options: ["Redis or in-memory cache", "SQL/NoSQL primary store", "Read replicas"],
        },
        {
          category: "Cloud examples",
          options: [
            "AWS: API Gateway + ALB + ECS/EKS + RDS/ElastiCache",
            "GCP: API Gateway/Apigee + GKE + Cloud SQL + Memorystore",
            "Azure: API Management + AKS/App Service + Azure SQL + Redis",
          ],
        },
      ],
      observabilityBurden:
        "Moderate burden: request traces are linear, but dependency fan-out and retries still require disciplined instrumentation.",
      observabilityReliability: {
        metrics: [
          "P50/P95/P99 latency per endpoint",
          "Error rate by status code and dependency",
          "Rate-limit hits, cache hit ratio, request volume",
          "Saturation indicators: CPU, DB connections, queue depth for async offloads",
        ],
        loggingTracing: [
          "Structured request logs with trace/span IDs",
          "Trace gateway -> service -> datastore hops",
          "Capture route, auth scope, and upstream dependency timings",
        ],
        failureHandling: [
          "Timeout budgets per hop and client retry policies",
          "Circuit breakers, bulkheads, and fallback responses",
          "Idempotency keys for mutating endpoints",
        ],
      },
      diagram: {
        nodes: [
          {
            id: "api-client",
            label: "Client",
            x: 30,
            y: 70,
            w: 120,
            h: 48,
            details: {
              happy: {
                whatItDoes: "Sends synchronous request and waits for response.",
                failureModes: ["Timeout waiting on backend", "User retries cause duplicate calls"],
                scaling: ["Use exponential backoff", "Batch requests and avoid chatty UI"],
              },
              failure: {
                whatItDoes: "Retries or fails fast based on UX and timeout policy.",
                failureModes: ["Aggressive retries amplify downstream incidents"],
                scaling: ["Client-side rate limiting", "Request coalescing for duplicate reads"],
              },
            },
          },
          {
            id: "api-gateway",
            label: "API Gateway",
            x: 210,
            y: 70,
            w: 160,
            h: 48,
            details: {
              happy: {
                whatItDoes: "Routes, authenticates, and applies traffic policy.",
                failureModes: ["Misconfigured routing", "Overly tight rate limits"],
                scaling: ["Horizontal gateway scaling", "Per-route throttling"],
              },
              failure: {
                whatItDoes: "Sheds load and returns controlled errors.",
                failureModes: ["Gateway becomes bottleneck", "Single policy affects all clients"],
                scaling: ["Isolate critical routes", "Use circuit breaking at edge"],
              },
            },
          },
          {
            id: "api-service",
            label: "Service",
            x: 430,
            y: 70,
            w: 130,
            h: 48,
            details: {
              happy: {
                whatItDoes: "Runs business rules and orchestrates data fetch/update.",
                failureModes: ["N+1 downstream calls", "Slow dependency fan-out"],
                scaling: ["Pool connections", "Apply bulkheads by dependency"],
              },
              failure: {
                whatItDoes: "Triggers fallback, partial responses, or fail-fast paths.",
                failureModes: ["Cascading timeouts", "Thread pool exhaustion"],
                scaling: ["Circuit breakers", "Async offload for long jobs"],
              },
            },
          },
          {
            id: "api-db",
            label: "DB + Cache",
            x: 630,
            y: 70,
            w: 140,
            h: 48,
            details: {
              happy: {
                whatItDoes: "Persists records and serves low-latency reads via cache.",
                failureModes: ["Cache stampede", "Hot partitions"],
                scaling: ["Read replicas", "TTL + request coalescing"],
              },
              failure: {
                whatItDoes: "Absorbs retries and backpressure from upstream.",
                failureModes: ["Connection storms", "Replica lag"],
                scaling: ["Protect with gateway throttles", "Serve stale-if-error for reads"],
              },
            },
          },
        ],
        edges: [
          { id: "a1", from: "api-client", to: "api-gateway", label: "HTTPS Request" },
          { id: "a2", from: "api-gateway", to: "api-service", label: "Routed call" },
          { id: "a3", from: "api-service", to: "api-db", label: "Query / Update" },
        ],
      },
      compare: {
        coupling: { value: "Higher", score: 2, note: "Runtime dependency is immediate and explicit." },
        latency: { value: "Low when healthy", score: 5, note: "Best for direct synchronous interactions." },
        throughput: { value: "Moderate", score: 3, note: "Bound by service and database concurrency." },
        complexity: { value: "Moderate", score: 3, note: "Simpler than async systems until scale pain appears." },
        observability: { value: "Good", score: 4, note: "Request traces are usually straightforward." },
        consistency: { value: "Strong per call", score: 5, note: "Typically immediate consistency on response path." },
        failureHandling: { value: "Synchronous retries + fallback", score: 3, note: "Needs careful timeout budgeting." },
        evolvability: { value: "Medium", score: 3, note: "Contract changes require API versioning strategy." },
      },
    },
    {
      id: "message",
      name: "Message-Driven Architecture",
      tagline: "Asynchronous commands and task queues for reliable work execution",
      mentalModel:
        "Think of this as dropping work tickets into an operations inbox: producers enqueue commands/tasks, workers process asynchronously, and completion is decoupled from the caller's immediate timeline.",
      decouplingReality:
        "Message-driven systems provide temporal decoupling and some deployment decoupling between producers and workers. Semantic coupling remains through command contracts, retry semantics, and idempotency expectations.",
      failureShape: {
        summary: "Delayed, buffered, and retry-heavy.",
        immediate: "Publish failures or queue unavailability can fail command submission quickly.",
        later: "Backlogs, retries, and DLQ growth surface minutes or hours later.",
        silent: "Duplicate processing and ordering drift can corrupt outcomes without obvious synchronous errors.",
      },
      architecturalSmell:
        "DLQs are growing faster than teams can triage, and replay has become routine production work.",
      coreComponents: [
        {
          name: "Producer",
          definition: "Service that emits commands/tasks to a queue or broker.",
        },
        {
          name: "Broker / Queue",
          definition: "Durable transport for messages with visibility timeout and delivery semantics.",
        },
        {
          name: "Consumer / Worker",
          definition: "Background process that handles messages and performs task logic.",
        },
        {
          name: "DLQ",
          definition: "Dead-letter queue for messages that repeatedly fail processing.",
        },
        {
          name: "Retry Policy",
          definition: "Controls backoff, max attempts, and poison message behavior.",
        },
        {
          name: "Idempotency Keys",
          definition: "Prevents duplicate side effects when retries or redeliveries occur.",
        },
        {
          name: "Scheduler",
          definition: "Triggers delayed or recurring job dispatch when needed.",
        },
      ],
      bestAt: [
        "Background jobs and long-running tasks",
        "Smoothing burst traffic using queue buffering",
        "Reliable at-least-once task execution",
        "Command workflows where caller does not need immediate result",
      ],
      pros: [
        "Decouples producer and consumer runtime availability",
        "Natural shock absorber for traffic spikes",
        "Scales worker pools independently by queue pressure",
        "Great for retries and durable task processing",
      ],
      cons: [
        "Higher operational complexity than direct APIs",
        "Harder debugging because flow is asynchronous",
        "Ordering guarantees can be expensive or partial",
        "Retries can create duplicates without idempotency",
      ],
      gotchas: [
        "Poison messages can block progress without DLQ policy",
        "Visibility timeout mis-tuning causes duplicate processing",
        "Unbounded retries amplify incidents",
        "Backpressure ignored too long leads to queue explosions",
        "Consumer group behavior can hide skewed partition hotspots",
      ],
      whenToUse: [
        {
          decision: "Tasks can complete asynchronously",
          example: "Image processing, email delivery, report generation",
        },
        {
          decision: "You need controlled retries and failure isolation",
          example: "Payment capture retries with idempotency keys",
        },
        {
          decision: "Traffic bursts exceed immediate processing capacity",
          example: "Flash-sale order validation pipeline",
        },
      ],
      dontUseWhen:
        "Do not use when core business logic needs global ordering guarantees or immediate cross-entity consistency.",
      scalingStages: [
        {
          stage: "Naive",
          teamContext: "Small team can manually reason about queue behavior end-to-end.",
          steps: [
            "Single queue with one worker pool",
            "Basic retry with fixed attempts",
            "Introduce idempotency keys for mutating tasks",
          ],
        },
        {
          stage: "Intermediate",
          teamContext: "Multiple teams own separate producers/consumers and need queue governance.",
          steps: [
            "Partition queues by workload or tenant key",
            "Tune visibility timeout to task runtime percentiles",
            "Add DLQ operations and runbooks",
            "Batch messages and increase consumer concurrency",
          ],
        },
        {
          stage: "Advanced",
          teamContext: "Independent teams with explicit SLOs and staffed on-call for queue operations.",
          steps: [
            "Autoscale workers on lag/depth and processing time",
            "Dynamic backpressure and admission control",
            "Multi-priority queues with SLO-based scheduling",
            "Use exactly-once simulation via idempotency + dedupe store",
          ],
        },
      ],
      typicalStack: [
        {
          category: "Queueing",
          options: ["Managed queue or broker", "Delayed delivery", "DLQ per workload"],
        },
        {
          category: "Workers",
          options: ["Containerized worker services", "Autoscaling policy", "Distributed lock/idempotency store"],
        },
        {
          category: "Cloud examples",
          options: [
            "AWS: SQS + Lambda/ECS + DLQ + CloudWatch",
            "GCP: Pub/Sub pull subscriptions + Cloud Run/GKE + Dead Letter Topics",
            "Azure: Service Bus queues + Functions/AKS + dead-letter subqueues",
          ],
        },
      ],
      observabilityBurden:
        "High burden: queue depth, retries, visibility timeout behavior, and poison-message operations all need active monitoring.",
      observabilityReliability: {
        metrics: [
          "Queue depth, oldest message age, and consumer lag",
          "Processing success/failure rates per message type",
          "Retry count distribution and DLQ ingress/egress",
          "Worker concurrency utilization and task runtime percentiles",
        ],
        loggingTracing: [
          "Structured logs with message ID and idempotency key",
          "Trace producer dispatch through worker processing",
          "Record retry attempt number and terminal failure cause",
        ],
        failureHandling: [
          "Exponential backoff with cap and jitter",
          "Poison message quarantine via DLQ",
          "Idempotent handlers to survive duplicate delivery",
        ],
      },
      diagram: {
        nodes: [
          {
            id: "msg-producer",
            label: "Producer",
            x: 40,
            y: 70,
            w: 130,
            h: 48,
            details: {
              happy: {
                whatItDoes: "Publishes command/task to queue and returns quickly.",
                failureModes: ["Broker unavailable on publish", "Message missing idempotency key"],
                scaling: ["Use bulk publish where possible", "Add producer-side buffering"],
              },
              failure: {
                whatItDoes: "Retries publish or stores command in outbox for later send.",
                failureModes: ["Duplicate enqueues on retry"],
                scaling: ["Outbox pattern to ensure durable dispatch"],
              },
            },
          },
          {
            id: "msg-queue",
            label: "Queue/Broker",
            x: 230,
            y: 70,
            w: 160,
            h: 48,
            details: {
              happy: {
                whatItDoes: "Durably stores and dispatches messages to consumers.",
                failureModes: ["Depth grows faster than drain rate"],
                scaling: ["Partition by key", "Separate high and low priority queues"],
              },
              failure: {
                whatItDoes: "Redelivers timed-out messages and routes poison messages to DLQ.",
                failureModes: ["Visibility timeout too short", "Ordering breaks across partitions"],
                scaling: ["Tune timeout by p95 runtime", "Backpressure producer side"],
              },
            },
          },
          {
            id: "msg-worker",
            label: "Worker",
            x: 460,
            y: 70,
            w: 130,
            h: 48,
            details: {
              happy: {
                whatItDoes: "Consumes tasks and executes business logic.",
                failureModes: ["Slow external dependency", "Thread starvation"],
                scaling: ["Increase concurrency", "Batch fetch and process"],
              },
              failure: {
                whatItDoes: "Nacks or retries failed tasks with backoff.",
                failureModes: ["Retry storm", "Non-idempotent writes"],
                scaling: ["Token bucket retry budget", "Idempotency table"],
              },
            },
          },
          {
            id: "msg-dlq",
            label: "DLQ",
            x: 650,
            y: 70,
            w: 100,
            h: 48,
            details: {
              happy: {
                whatItDoes: "Stores terminally failed messages for analysis and replay.",
                failureModes: ["DLQ never drained", "Manual replay creates duplicates"],
                scaling: ["Automate triage by error class", "Replay with throttle"],
              },
              failure: {
                whatItDoes: "Prevents poison messages from blocking normal flow.",
                failureModes: ["DLQ backlog hides critical failures"],
                scaling: ["Alert on age/depth", "Runbook-driven replay pipelines"],
              },
            },
          },
        ],
        edges: [
          { id: "m1", from: "msg-producer", to: "msg-queue", label: "Enqueue task" },
          { id: "m2", from: "msg-queue", to: "msg-worker", label: "Dispatch" },
          {
            id: "m3",
            from: "msg-worker",
            to: "msg-queue",
            label: "Ack/Retry",
            happyLabel: "Ack success",
            failureLabel: "Retry with backoff",
          },
          {
            id: "m4",
            from: "msg-queue",
            to: "msg-dlq",
            label: "DLQ route",
            failureLabel: "After max retries",
          },
        ],
      },
      compare: {
        coupling: { value: "Medium", score: 4, note: "Time-decoupled, but task contracts still coupled." },
        latency: { value: "Medium", score: 3, note: "Queueing adds delay, optimized for async completion." },
        throughput: { value: "High", score: 5, note: "Buffers bursts and scales worker pools effectively." },
        complexity: { value: "High", score: 2, note: "Requires retry, DLQ, and idempotency operations." },
        observability: { value: "Medium", score: 3, note: "Need queue + worker + retry telemetry correlation." },
        consistency: { value: "Task-level eventual", score: 3, note: "Completion is asynchronous and may be delayed." },
        failureHandling: { value: "Strong", score: 5, note: "DLQ + retries are first-class primitives." },
        evolvability: { value: "High", score: 4, note: "Can evolve worker implementations behind stable message contracts." },
      },
    },
    {
      id: "event",
      name: "Event-Driven Architecture",
      tagline: "Publish/subscribe streams for fan-out and temporal decoupling",
      mentalModel:
        "Think of this as a newsroom wire: producers publish facts about state changes, and many consumers independently react. Producers usually do not know who listens, enabling high evolvability and fan-out.",
      decouplingReality:
        "Event-driven systems remove timing dependencies, not semantic ones. They increase temporal and deployment decoupling, but semantic coupling persists through event meaning, schema evolution, and downstream business assumptions.",
      failureShape: {
        summary: "Partial, inconsistent, and hard to trace.",
        immediate: "Publisher failures and schema rejects can block event emission.",
        later: "Consumer lag and replay storms create delayed degradation across read models.",
        silent: "Divergent state across projections can persist unnoticed until a critical query or audit.",
      },
      architecturalSmell:
        "No one can confidently answer, end-to-end, what downstream systems react when a key event is emitted.",
      coreComponents: [
        {
          name: "Event Producer",
          definition: "Service that emits domain events after state changes.",
        },
        {
          name: "Event Bus / Stream",
          definition: "Durable log/topic system that stores ordered event records.",
        },
        {
          name: "Topics",
          definition: "Logical channels for event categories.",
        },
        {
          name: "Partitions",
          definition: "Parallel lanes within a topic that preserve per-key ordering.",
        },
        {
          name: "Consumers",
          definition: "Independent services that subscribe and process events.",
        },
        {
          name: "Schema Registry (optional)",
          definition: "Governs event compatibility and schema evolution.",
        },
        {
          name: "Outbox Pattern",
          definition: "Ensures state change and event publish stay atomic.",
        },
        {
          name: "Replay",
          definition: "Reprocess historical events to rebuild projections or recover.",
        },
      ],
      bestAt: [
        "Multi-consumer fan-out workflows",
        "Audit-friendly change streams",
        "Near-real-time analytics and projections",
        "Decoupling producers from downstream innovation",
      ],
      pros: [
        "Low producer coupling to downstream consumers",
        "Natural support for many independent consumers",
        "Strong fit for audit trails and stream processing",
        "Enables replay and backfill capabilities",
      ],
      cons: [
        "Eventual consistency can surprise product teams",
        "Schema evolution discipline is mandatory",
        "Consumer lag and reprocessing can be expensive",
        "Exactly-once is often misunderstood and over-claimed",
      ],
      gotchas: [
        "Event spam without governance dilutes signal",
        "Breaking schema changes silently break consumers",
        "Consumer lag hides stale downstream state",
        "Replays can overload downstream services",
        "Exactly-once myths lead to false correctness assumptions",
      ],
      whenToUse: [
        {
          decision: "Multiple systems need to react to the same domain change",
          example: "Order placed triggers billing, inventory, notifications, analytics",
        },
        {
          decision: "You need durable history and replay capability",
          example: "Search indexing and projection rebuilds from event log",
        },
        {
          decision: "You want high evolvability with loosely coupled consumers",
          example: "Platform team exposes domain events to product teams",
        },
      ],
      dontUseWhen:
        "Do not use as the primary pattern when the business cannot tolerate delayed, divergent, or eventually consistent state.",
      scalingStages: [
        {
          stage: "Naive",
          teamContext: "Small team with shared ownership of producer and consumers.",
          steps: [
            "Single topic with few consumer groups",
            "Basic partitioning by aggregate key",
            "Simple retention policy",
          ],
        },
        {
          stage: "Intermediate",
          teamContext: "Several teams consume shared streams and need schema governance.",
          steps: [
            "Increase partitions with key strategy aligned to access patterns",
            "Add consumer groups by domain responsibility",
            "Adopt schema compatibility checks and version policy",
            "Use correlation IDs for end-to-end tracing",
          ],
        },
        {
          stage: "Advanced",
          teamContext: "Independent platform and domain teams with SLOs, lineage ownership, and formal on-call.",
          steps: [
            "Implement outbox/CDC for reliable event publication",
            "Tune replay and retention by business criticality",
            "Add dedupe safeguards in critical consumers",
            "Use lag-aware autoscaling and SLOs per consumer group",
          ],
        },
      ],
      typicalStack: [
        {
          category: "Streaming",
          options: ["Event bus / log broker", "Topic partitioning", "Consumer groups"],
        },
        {
          category: "Data governance",
          options: ["Schema registry", "Compatibility policy", "Outbox or CDC pipeline"],
        },
        {
          category: "Cloud examples",
          options: [
            "AWS: EventBridge/Kinesis/MSK + Lambda/ECS consumers + Glue schema",
            "GCP: Pub/Sub or Dataflow streams + GKE/Cloud Run consumers + schema management",
            "Azure: Event Hubs/Service Bus topics + Functions/AKS consumers + schema registry",
          ],
        },
      ],
      observabilityBurden:
        "Very high burden: correlation IDs, event lineage, consumer lag, and causal graph reasoning become core operational capabilities.",
      observabilityReliability: {
        metrics: [
          "Consumer lag by group and partition",
          "Publish throughput and end-to-end processing latency",
          "Partition skew and rebalance frequency",
          "Replay volume and downstream error rates during reprocessing",
        ],
        loggingTracing: [
          "Correlation IDs propagated in event metadata",
          "Per-event processing logs with consumer offsets",
          "Tracing across producer publish and consumer side effects",
        ],
        failureHandling: [
          "Retry with dedupe for non-idempotent side effects",
          "Parking lot / dead-letter topics for malformed events",
          "Replay strategy with rate controls and blast-radius limits",
        ],
      },
      diagram: {
        nodes: [
          {
            id: "evt-producer",
            label: "Event Producer",
            x: 20,
            y: 70,
            w: 150,
            h: 48,
            details: {
              happy: {
                whatItDoes: "Publishes domain events after state change.",
                failureModes: ["Event not published after DB commit", "Schema mismatch on publish"],
                scaling: ["Use outbox/CDC", "Keep event payload focused and versioned"],
              },
              failure: {
                whatItDoes: "Buffers/persists events until broker accepts.",
                failureModes: ["Lost event due to dual-write race"],
                scaling: ["Transactional outbox", "Producer idempotence"],
              },
            },
          },
          {
            id: "evt-bus",
            label: "Event Bus",
            x: 220,
            y: 70,
            w: 140,
            h: 48,
            details: {
              happy: {
                whatItDoes: "Stores ordered event log for subscribed consumers.",
                failureModes: ["Partition imbalance", "Retention too short for replay use case"],
                scaling: ["Partition strategy by key", "Right-size retention windows"],
              },
              failure: {
                whatItDoes: "Backpressures producers or accumulates lag on consumers.",
                failureModes: ["Consumer groups fall behind", "Hot key creates bottleneck"],
                scaling: ["Increase partitions", "Key redesign and consumer sharding"],
              },
            },
          },
          {
            id: "evt-consumers",
            label: "Consumer Groups",
            x: 410,
            y: 70,
            w: 170,
            h: 48,
            details: {
              happy: {
                whatItDoes: "Independent services consume same events for different outcomes.",
                failureModes: ["Slow consumer causes lag", "Breaking schema update"],
                scaling: ["Group-specific autoscaling", "Schema compatibility checks"],
              },
              failure: {
                whatItDoes: "Retries, parks bad events, and recovers via replay.",
                failureModes: ["Replay overload on downstream APIs"],
                scaling: ["Replay throttling", "Idempotent side effects"],
              },
            },
          },
          {
            id: "evt-replay",
            label: "Replay/Backfill",
            x: 630,
            y: 70,
            w: 150,
            h: 48,
            details: {
              happy: {
                whatItDoes: "Reprocesses historical events to rebuild state/projections.",
                failureModes: ["Replay causes duplicate notifications", "Cost spikes during reprocessing"],
                scaling: ["Use consumer feature flags", "Downsample where feasible"],
              },
              failure: {
                whatItDoes: "Handles recovery and reconciliation after incidents.",
                failureModes: ["Non-idempotent handlers corrupt projections"],
                scaling: ["Dedupe store", "Shadow replay before production replay"],
              },
            },
          },
        ],
        edges: [
          { id: "e1", from: "evt-producer", to: "evt-bus", label: "Publish event" },
          {
            id: "e2",
            from: "evt-bus",
            to: "evt-consumers",
            label: "Fan-out subscribe",
            failureLabel: "Lag + retries",
          },
          {
            id: "e3",
            from: "evt-bus",
            to: "evt-replay",
            label: "Retained log",
            failureLabel: "Reprocess for recovery",
          },
        ],
      },
      compare: {
        coupling: { value: "Low", score: 5, note: "Producers are loosely coupled from consumer lifecycle." },
        latency: { value: "Variable", score: 3, note: "Can be fast, but end-to-end depends on consumer lag." },
        throughput: { value: "Very high", score: 5, note: "Optimized for streaming and fan-out at scale." },
        complexity: { value: "High", score: 2, note: "Schema, lag, replay, and consistency add operational depth." },
        observability: { value: "Challenging", score: 2, note: "Need strong correlation IDs and lag tooling." },
        consistency: { value: "Eventual", score: 2, note: "Read models converge asynchronously." },
        failureHandling: { value: "Strong but nuanced", score: 4, note: "Replay and dedupe are powerful but require discipline." },
        evolvability: { value: "Very high", score: 5, note: "New consumers can be added with minimal producer changes." },
      },
    },
  ],
  compareFilters: [
    {
      id: "lowLatency",
      label: "Low latency required",
      description: "User-facing path must return quickly.",
      weights: { api: 3, message: 1, event: 1 },
      tradeoffNote: "Direct APIs win for immediate responses, but can increase coupling and cascade risk.",
    },
    {
      id: "highThroughput",
      label: "High throughput",
      description: "Sustained or bursty volume is a key concern.",
      weights: { api: 1, message: 3, event: 3 },
      tradeoffNote: "Queues/streams handle bursts better, but add async complexity and delayed visibility.",
    },
    {
      id: "needAuditTrail",
      label: "Need audit trail",
      description: "Historical traceability and replay matter.",
      weights: { api: 1, message: 2, event: 3 },
      tradeoffNote: "Event logs are strongest for replay; API logs alone are often insufficient.",
    },
    {
      id: "multipleConsumers",
      label: "Multiple consumers",
      description: "Many downstream services need the same signal.",
      weights: { api: 1, message: 2, event: 3 },
      tradeoffNote: "Event fan-out decouples teams, but schema governance becomes critical.",
    },
    {
      id: "strictRequestResponse",
      label: "Strict request/response",
      description: "Caller must receive definitive result in-line.",
      weights: { api: 3, message: 1, event: 1 },
      tradeoffNote: "API style aligns naturally, though async offloading may still be needed for heavy steps.",
    },
  ],
  scenarios: [
    {
      id: "user-profile",
      label: "User profile service",
      recommended: ["api"],
      reasoning:
        "Profile reads and writes usually need immediate request/response confirmation and clear auth boundaries.",
      watchOutFor: [
        "N+1 calls when profile aggregates many sub-services",
        "Version sprawl across mobile/web clients",
      ],
      scalingNotes: ["Read-through cache", "Pagination for activity/history endpoints", "BFF for client-specific payloads"],
    },
    {
      id: "payment-processing",
      label: "Payment processing",
      recommended: ["api", "message"],
      reasoning:
        "Initiation is synchronous for UX, but capture/reconciliation/retries are safer in async task workflows.",
      watchOutFor: [
        "Duplicate charges without idempotency keys",
        "Unbounded retries against flaky gateways",
      ],
      scalingNotes: ["Split sync authorization from async settlement", "DLQ with manual operations runbook"],
    },
    {
      id: "order-fulfillment",
      label: "Order fulfillment",
      recommended: ["message", "event"],
      reasoning:
        "Order orchestration spans inventory, shipping, billing, and notifications where async coordination is expected.",
      watchOutFor: ["Ordering guarantees by order ID", "Compensation for partial failures"],
      scalingNotes: ["Partition by order/customer key", "Use saga or workflow engine where needed"],
    },
    {
      id: "analytics-pipeline",
      label: "Analytics pipeline",
      recommended: ["event"],
      reasoning: "Fan-out, replay, and stream processing make event-driven architecture the natural fit.",
      watchOutFor: ["Schema drift", "Consumer lag and reprocessing costs"],
      scalingNotes: ["Retention tuned to backfill windows", "Separate real-time and batch consumers"],
    },
    {
      id: "notifications",
      label: "Notifications system",
      recommended: ["message", "event"],
      reasoning:
        "A produced signal can fan out, but delivery tasks (email/SMS/push) are queue-friendly and retry-heavy.",
      watchOutFor: ["Retry storms from provider outages", "Duplicate sends"],
      scalingNotes: ["Provider-specific queues", "Idempotent send ledger", "Priority-based throttling"],
    },
    {
      id: "fraud-detection",
      label: "Fraud detection",
      recommended: ["event", "api"],
      reasoning:
        "Real-time scoring can be synchronous for authorization, while broader signals stream asynchronously for models.",
      watchOutFor: ["False positives from stale features", "Hot keys on high-risk accounts"],
      scalingNotes: ["Hybrid online API + event feature pipeline", "Backpressure controls for model scoring"],
    },
    {
      id: "search-indexing",
      label: "Search indexing",
      recommended: ["event"],
      reasoning:
        "Index updates are reactive and benefit from replay/backfill when index strategy changes.",
      watchOutFor: ["Out-of-order updates", "Large replay cost"],
      scalingNotes: ["Partition by document/entity key", "Replay throttling with shadow validation"],
    },
    {
      id: "iot-telemetry",
      label: "IoT telemetry ingestion",
      recommended: ["event", "message"],
      reasoning:
        "High-ingest telemetry is stream-friendly; command/control and heavy transformations often need queued workers.",
      watchOutFor: ["Burst spikes", "Schema inconsistencies from device firmware drift"],
      scalingNotes: ["Partition by device/site key", "Tiered storage retention", "Lag-aware autoscaling"],
    },
  ],
}
