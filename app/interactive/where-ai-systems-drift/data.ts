export type DriftExample = {
  prompt: string
  badOutput: string
  fix: string
}

export type Concept = {
  id: string
  name: string
  summary: string
  pros: string[]
  cons: string[]
  whenToUse: string
  driftControl: string
  example?: DriftExample
}

export type DriftLayer = {
  id: string
  name: string
  shortName: string
  description: string
  color: string
  accent: string
  icon: "target" | "layout" | "messageSquare" | "database" | "cpu" | "shield" | "clipboardCheck"
  concepts: Concept[]
}

export type FailureStat = {
  label: string
  value: number
  color: string
}

export const driftLayers: DriftLayer[] = [
  {
    id: "user-product",
    name: "User Intent Layer",
    shortName: "User Intent Layer",
    description: "Where raw requests get translated into concrete product behavior and task boundaries.",
    color: "#3A6EA5",
    accent: "#D9E7F5",
    icon: "target",
    concepts: [
      {
        id: "task-decomposition",
        name: "Task decomposition",
        summary: "Break broad asks into smaller subtasks so the system solves the right problem in the right order.",
        pros: ["Reduces ambiguity early", "Makes downstream prompts simpler", "Improves tool sequencing"],
        cons: ["Adds orchestration complexity", "Can over-fragment simple tasks"],
        whenToUse: "Use when a request spans multiple steps, tools, or decision points.",
        driftControl: "Prevents scope drift by turning vague intent into explicit intermediate objectives.",
        example: {
          prompt: "Plan a migration from our monolith to services without downtime.",
          badOutput: "Here is a generic list of microservice best practices.",
          fix: "Decompose into discovery, dependency mapping, sequencing, rollback planning, and cutover controls before generation.",
        },
      },
      {
        id: "intent-classification",
        name: "Intent classification",
        summary: "Identify the task type before selecting the response strategy.",
        pros: ["Routes work correctly", "Improves latency by avoiding unnecessary paths", "Supports policy differences by task type"],
        cons: ["Classifier mistakes can misroute the whole flow", "Needs ongoing taxonomy maintenance"],
        whenToUse: "Use when the same interface handles analysis, drafting, retrieval, and tool-driven actions.",
        driftControl: "Stops the system from answering the wrong question just because two requests sound similar.",
      },
      {
        id: "structured-inputs",
        name: "Structured inputs",
        summary: "Collect key fields explicitly instead of hoping the model infers them from prose.",
        pros: ["Improves determinism", "Simplifies validation", "Makes workflows easier to automate"],
        cons: ["Adds form friction", "Can feel rigid for exploratory tasks"],
        whenToUse: "Use when missing fields would materially change the answer or action.",
        driftControl: "Reduces interpretation drift by constraining the problem before prompts are assembled.",
      },
      {
        id: "guardrails",
        name: "Guardrails",
        summary: "Apply product-level boundaries for unsafe, unsupported, or out-of-scope requests.",
        pros: ["Controls obvious risk early", "Protects downstream systems", "Makes behavior more predictable"],
        cons: ["Can overblock helpful responses", "Needs tuning with real usage"],
        whenToUse: "Use for user-facing systems with safety, compliance, or workflow constraints.",
        driftControl: "Prevents the system from drifting into tasks it should never attempt.",
      },
      {
        id: "tool-routing",
        name: "Tool routing",
        summary: "Choose the right subsystem, tool, or agent mode for the job before generation starts.",
        pros: ["Improves efficiency", "Raises answer quality", "Supports specialized handling"],
        cons: ["Routing logic can become brittle", "Bad routing amplifies downstream failure"],
        whenToUse: "Use when some tasks require retrieval, APIs, calculators, or specialized chains.",
        driftControl: "Keeps the system close to user intent by matching the request to the right execution path.",
      },
    ],
  },
  {
    id: "application",
    name: "Application Layer",
    shortName: "Application Layer",
    description: "Where product rules, workflow state, and orchestration shape what the model is allowed to do.",
    color: "#6D5BD0",
    accent: "#E6E0FB",
    icon: "layout",
    concepts: [
      {
        id: "workflow-state",
        name: "Workflow state",
        summary: "Track what has already happened so the system responds with continuity instead of restarting every turn.",
        pros: ["Improves multi-step consistency", "Supports recoverability", "Avoids duplicated work"],
        cons: ["State bugs create confusing behavior", "Requires explicit lifecycle design"],
        whenToUse: "Use for copilots, agents, and multi-turn workflows with checkpoints.",
        driftControl: "Prevents conversational drift by grounding responses in the system’s actual progress.",
      },
      {
        id: "policy-enforcement",
        name: "Policy enforcement",
        summary: "Apply business rules before and after model calls so product constraints remain enforceable.",
        pros: ["Decouples rules from prompt wording", "Auditable", "Safer than instruction-only approaches"],
        cons: ["More code paths to maintain", "Harder to keep synced with product changes"],
        whenToUse: "Use when the system has real operational, billing, or compliance boundaries.",
        driftControl: "Stops the application from relying on the model to remember hard rules.",
      },
      {
        id: "fallback-design",
        name: "Fallback design",
        summary: "Define graceful degradation paths for low confidence, failed tools, or missing context.",
        pros: ["Preserves trust during failures", "Improves resilience", "Makes failure modes legible"],
        cons: ["Can feel conservative", "Needs product work, not just prompt work"],
        whenToUse: "Use when partial failure is normal and silent failure would be expensive.",
        driftControl: "Prevents compounding drift when upstream assumptions collapse mid-flow.",
      },
    ],
  },
  {
    id: "prompt",
    name: "Prompt Layer",
    shortName: "Prompt Layer",
    description: "How the system frames the task, constraints, and expected output behavior for the model.",
    color: "#8B5CF6",
    accent: "#EEE6FF",
    icon: "messageSquare",
    concepts: [
      {
        id: "system-prompts",
        name: "System prompts",
        summary: "Set stable top-level rules for tone, task boundaries, and priorities.",
        pros: ["Establishes baseline behavior", "Reusable across flows", "Good place for durable instructions"],
        cons: ["Bloats quickly", "Conflicts are hard to debug"],
        whenToUse: "Use for durable instructions that should apply to every call in a workflow.",
        driftControl: "Anchors generation so the model has a consistent operating frame.",
        example: {
          prompt: "Summarize this incident and tell leadership what happened.",
          badOutput: "The model writes a persuasive narrative with speculation and no uncertainty handling.",
          fix: "Use a system prompt that prioritizes evidence, confidence labeling, and explicit unknowns.",
        },
      },
      {
        id: "few-shot-prompting",
        name: "Few-shot prompting",
        summary: "Demonstrate the expected pattern instead of only describing it abstractly.",
        pros: ["Improves format adherence", "Helpful for nuanced style", "Reduces misinterpretation"],
        cons: ["Consumes context", "Examples can overfit behavior"],
        whenToUse: "Use when the target output is subtle or hard to specify cleanly.",
        driftControl: "Reduces behavioral drift by showing the model what good looks like.",
      },
      {
        id: "role-prompting",
        name: "Role prompting",
        summary: "Assign a viewpoint or operating posture to shape prioritization and tone.",
        pros: ["Useful for framing tradeoffs", "Can improve consistency", "Works well with domain-specific tasks"],
        cons: ["Often overrated", "Can add style without substance"],
        whenToUse: "Use when the model needs a consistent perspective, not just a different voice.",
        driftControl: "Helps the model resolve ambiguity in a repeatable direction.",
      },
      {
        id: "output-schemas",
        name: "Output schemas",
        summary: "Constrain outputs into required fields, structures, or typed contracts.",
        pros: ["Improves parseability", "Supports automation", "Easier to validate downstream"],
        cons: ["Can produce schema-valid nonsense", "Reduces expressive range"],
        whenToUse: "Use for integrations, workflows, and any response consumed by code.",
        driftControl: "Narrows output drift by limiting the shape the model can produce.",
      },
      {
        id: "prompt-compression",
        name: "Prompt compression",
        summary: "Strip prompts down to the instructions that materially improve results.",
        pros: ["Lower token cost", "Less instruction collision", "Often improves clarity"],
        cons: ["Easy to cut too far", "Requires empirical testing"],
        whenToUse: "Use when prompts have grown bloated through iterative patching.",
        driftControl: "Removes stale or conflicting instructions that cause the model to wander.",
      },
    ],
  },
  {
    id: "retrieval",
    name: "Retrieval Layer",
    shortName: "Retrieval Layer",
    description: "How outside knowledge is found, filtered, and packed into context before generation.",
    color: "#0F9D94",
    accent: "#DDF7F4",
    icon: "database",
    concepts: [
      {
        id: "vector-search",
        name: "Vector search",
        summary: "Retrieve semantically similar content even when query wording differs from the source text.",
        pros: ["Strong semantic recall", "Useful for natural-language queries", "Good default for fuzzy matching"],
        cons: ["Can surface loosely related content", "Embedding quality matters"],
        whenToUse: "Use when user wording varies widely from source documents.",
        driftControl: "Reduces knowledge drift by grounding answers in relevant external context.",
      },
      {
        id: "hybrid-search",
        name: "Hybrid search",
        summary: "Combine keyword and semantic retrieval to balance precision with semantic coverage.",
        pros: ["Handles exact terms and concepts together", "More robust across query types", "Often better than either method alone"],
        cons: ["More tuning overhead", "Additional infrastructure complexity"],
        whenToUse: "Use when exact names, IDs, or jargon matter alongside semantic meaning.",
        driftControl: "Prevents retrieval drift when semantic similarity alone misses critical exact matches.",
      },
      {
        id: "reranking",
        name: "Re-ranking",
        summary: "Re-score candidate documents so the strongest evidence appears first in context.",
        pros: ["Improves precision", "Useful when recall is high but noisy", "Makes limited context more valuable"],
        cons: ["Adds latency", "Needs labeled judgment or good heuristics"],
        whenToUse: "Use when top-k retrieval includes too much plausible but weak context.",
        driftControl: "Cuts distraction drift by prioritizing the most relevant evidence.",
      },
      {
        id: "query-rewriting",
        name: "Query rewriting",
        summary: "Translate the user’s wording into a retrieval-optimized query before searching.",
        pros: ["Improves retrieval coverage", "Handles shorthand or messy inputs", "Useful for enterprise jargon"],
        cons: ["Rewrites can distort the original question", "Adds another failure point"],
        whenToUse: "Use when users ask in ambiguous or conversational language but the corpus is structured.",
        driftControl: "Aligns retrieval behavior to the real information need instead of the literal wording.",
        example: {
          prompt: "What broke in payments last week after the gateway change?",
          badOutput: "Retrieval surfaces general payment architecture docs and a six-month-old outage report.",
          fix: "Rewrite the query around the gateway migration, timeframe, incident logs, and payment error rates before search.",
        },
      },
      {
        id: "chunking-strategies",
        name: "Chunking strategies",
        summary: "Split source material into retrievable units that preserve enough meaning to be useful.",
        pros: ["Improves evidence quality", "Reduces context waste", "Can improve citation precision"],
        cons: ["Bad chunking destroys coherence", "Needs corpus-specific tuning"],
        whenToUse: "Use for any corpus where documents exceed what should be retrieved whole.",
        driftControl: "Prevents support drift caused by retrieving fragments with missing context or broken meaning.",
      },
      {
        id: "context-window-management",
        name: "Context window management",
        summary: "Budget, deduplicate, and order context so the model sees the right evidence without overload.",
        pros: ["Improves signal-to-noise ratio", "Controls token cost", "Reduces conflicting evidence"],
        cons: ["Hard ranking decisions", "May exclude useful long-tail context"],
        whenToUse: "Use whenever retrieval candidates can exceed practical context size.",
        driftControl: "Prevents attention drift caused by too much noisy or redundant context.",
      },
    ],
  },
  {
    id: "model",
    name: "Model Layer",
    shortName: "Model Layer",
    description: "Where the generation engine, sampling settings, and model capabilities shape the final behavior.",
    color: "#F59E0B",
    accent: "#FFF1D9",
    icon: "cpu",
    concepts: [
      {
        id: "temperature",
        name: "Temperature",
        summary: "Adjust randomness in token selection to trade determinism for variation.",
        pros: ["Simple control", "Useful for style variation", "Can reduce repetitiveness"],
        cons: ["Easy to misuse", "Higher values amplify drift on factual tasks"],
        whenToUse: "Use low values for constrained factual work and higher values for ideation or creative phrasing.",
        driftControl: "Keeps outputs closer to intent when matched to the task’s tolerance for variation.",
      },
      {
        id: "top-p-sampling",
        name: "Top-p sampling",
        summary: "Limit token selection to the most probable cumulative set rather than a fixed randomness rule.",
        pros: ["Finer control than temperature alone", "Can stabilize outputs", "Useful for balancing fluency and diversity"],
        cons: ["Harder to reason about", "Another parameter to tune"],
        whenToUse: "Use when you need tighter generation behavior without making outputs too rigid.",
        driftControl: "Reduces lexical drift by restricting how far the model can wander from likely continuations.",
      },
      {
        id: "model-selection",
        name: "Model selection",
        summary: "Choose the model whose strengths match the task, latency budget, and reliability requirements.",
        pros: ["Big impact on quality", "Lets you tune cost versus capability", "Can isolate risky workloads"],
        cons: ["Needs benchmarking", "Behavior shifts after model upgrades"],
        whenToUse: "Use whenever one model is being stretched across very different jobs.",
        driftControl: "Avoids asking a weak or misfit model to carry behavior it cannot reliably sustain.",
      },
      {
        id: "fine-tuning",
        name: "Fine-tuning",
        summary: "Train a model or adapter toward specialized behavior that prompts alone cannot reliably enforce.",
        pros: ["Useful for repeated domain behavior", "Can reduce prompt size", "Can improve consistency at scale"],
        cons: ["Operational overhead", "Dataset quality is critical", "Can lock in the wrong behavior"],
        whenToUse: "Use after prompt and workflow changes have plateaued but the behavior gap remains clear.",
        driftControl: "Pushes stable specialized behavior into the model itself instead of continually patching prompts.",
      },
      {
        id: "tool-calling",
        name: "Tool calling",
        summary: "Let the model delegate precise subproblems to tools instead of hallucinating them.",
        pros: ["Improves accuracy on bounded tasks", "Enables real actions", "Reduces unsupported guessing"],
        cons: ["Tool misuse can be risky", "Needs strong argument validation"],
        whenToUse: "Use for calculations, lookups, actions, or deterministic subroutines.",
        driftControl: "Prevents reasoning drift by offloading precise work to systems that can do it reliably.",
      },
      {
        id: "structured-decoding",
        name: "Structured decoding",
        summary: "Constrain token generation so the model emits valid structured output by construction.",
        pros: ["Higher schema reliability", "Good for machine-consumed outputs", "Reduces parser complexity"],
        cons: ["Not suitable for every task", "Can hide semantic errors behind valid structure"],
        whenToUse: "Use when malformed output is a hard failure.",
        driftControl: "Prevents output-shape drift at generation time, not only after the fact.",
      },
    ],
  },
  {
    id: "output",
    name: "Output Layer",
    shortName: "Output Layer",
    description: "Where responses are checked, corrected, filtered, or reformatted before the user sees them.",
    color: "#22A06B",
    accent: "#DCF6E7",
    icon: "shield",
    concepts: [
      {
        id: "schema-validation",
        name: "Schema validation",
        summary: "Reject or repair outputs that do not match the expected structure or field constraints.",
        pros: ["Clear pass/fail signal", "Great for automations", "Easy to operationalize"],
        cons: ["Only checks shape, not truth", "Repair loops can mask deeper issues"],
        whenToUse: "Use for any structured output that feeds code or workflows.",
        driftControl: "Stops malformed responses from escaping into downstream systems.",
      },
      {
        id: "self-critique",
        name: "Self critique",
        summary: "Ask the model to review its own answer against explicit checks before finalizing it.",
        pros: ["Cheap extra scrutiny", "Can catch omissions", "Works well with targeted rubrics"],
        cons: ["Same model may repeat the same blind spots", "Adds latency"],
        whenToUse: "Use when answers need a second pass but a full external judge is unnecessary.",
        driftControl: "Reduces final-answer drift by inserting a deliberate verification step before release.",
      },
      {
        id: "llm-as-judge",
        name: "LLM-as-judge",
        summary: "Use a separate model or rubric-guided grader to score output quality or policy adherence.",
        pros: ["Scales review", "Flexible across tasks", "Good for comparative grading"],
        cons: ["Evaluator drift is real", "Can encode rubric bias", "Needs calibration"],
        whenToUse: "Use for triage, ranking, moderation, or automated QA pipelines.",
        driftControl: "Adds an external check so the generation model is not grading itself alone.",
      },
      {
        id: "guardrail-frameworks",
        name: "Guardrail frameworks",
        summary: "Run policy, safety, or formatting checks through reusable enforcement layers.",
        pros: ["Centralized control", "Reusable across products", "Better observability than ad hoc checks"],
        cons: ["Another abstraction to debug", "Can create false confidence"],
        whenToUse: "Use when multiple workflows need consistent post-generation controls.",
        driftControl: "Creates a consistent last-mile filter against policy or format drift.",
      },
      {
        id: "post-processing",
        name: "Post-processing",
        summary: "Clean, normalize, enrich, or redact the final answer after model generation.",
        pros: ["Fast and deterministic", "Good for formatting polish", "Useful for redaction and cleanup"],
        cons: ["Limited semantic correction power", "Can hide deeper prompt or retrieval issues"],
        whenToUse: "Use for deterministic cleanup tasks the model should not own.",
        driftControl: "Removes superficial output drift without another full model call.",
      },
    ],
  },
  {
    id: "evaluation",
    name: "Evaluation Layer",
    shortName: "Evaluation Layer",
    description: "Where teams measure behavior over time, catch regressions, and detect production drift.",
    color: "#DC4C3F",
    accent: "#FBE1DE",
    icon: "clipboardCheck",
    concepts: [
      {
        id: "human-feedback",
        name: "Human feedback",
        summary: "Collect reviewer or user judgment to assess whether the system was actually useful and correct.",
        pros: ["Closest to real user value", "Captures nuance", "Finds issues rigid tests miss"],
        cons: ["Expensive", "Subjective", "Slow to scale"],
        whenToUse: "Use for high-value workflows, ambiguous tasks, and benchmark design.",
        driftControl: "Surfaces real-world drift that automated checks may not understand.",
      },
      {
        id: "golden-prompts",
        name: "Golden prompts",
        summary: "Maintain a fixed suite of representative prompts to compare behavior across changes.",
        pros: ["Simple regression signal", "Easy to communicate", "Useful release gate"],
        cons: ["Can become stale", "Misses new user patterns"],
        whenToUse: "Use for prompt, model, retrieval, or policy changes that need fast comparison.",
        driftControl: "Makes subtle degradation visible before it reaches production.",
      },
      {
        id: "regression-tests",
        name: "Regression tests",
        summary: "Automate critical-path checks so system changes do not silently break known behaviors.",
        pros: ["Fast repeatability", "Supports shipping confidence", "Works well in CI"],
        cons: ["Can overfit known cases", "Maintenance burden grows with product scope"],
        whenToUse: "Use for non-negotiable workflows and high-frequency changes.",
        driftControl: "Prevents recurring failures by enforcing a baseline of expected behavior.",
      },
      {
        id: "eval-datasets",
        name: "Eval datasets",
        summary: "Curate benchmark examples that reflect the behaviors the system must handle well.",
        pros: ["Supports systematic measurement", "Enables comparison over time", "Good for model and prompt selection"],
        cons: ["Hard to keep representative", "Label quality matters"],
        whenToUse: "Use when decisions about prompts, retrieval, or models need evidence at scale.",
        driftControl: "Turns alignment into a measurable system property instead of a gut feel.",
      },
      {
        id: "monitoring",
        name: "Monitoring",
        summary: "Track production behavior, anomalies, and operational signals after launch.",
        pros: ["Catches live issues", "Supports incident response", "Reveals distribution shift"],
        cons: ["Alert fatigue", "Needs instrumentation discipline"],
        whenToUse: "Use for every production AI system with real user traffic.",
        driftControl: "Detects live drift that offline evaluation will always miss.",
      },
      {
        id: "drift-detection",
        name: "Drift detection",
        summary: "Identify when inputs, outputs, retrieval quality, or user outcomes have shifted materially.",
        pros: ["Early warning for silent degradation", "Targets investigation", "Supports rollback decisions"],
        cons: ["Threshold tuning is difficult", "False positives are common"],
        whenToUse: "Use when behavior changes over time due to data, traffic, model, or product updates.",
        driftControl: "Turns drift from a vague worry into an observable operating signal.",
        example: {
          prompt: "Why are answers getting more verbose and less grounded this month?",
          badOutput: "No obvious issue detected because average response length still looks normal.",
          fix: "Track groundedness, citation rate, and answer style by cohort so changes show up before users complain.",
        },
      },
    ],
  },
]

export const simulatorStates = [
  {
    threshold: 0.25,
    label: "Tight control",
    title: "Low temperature",
    summary: "The model stays close to the most likely answer path.",
    response: "The capital of France is Paris.",
  },
  {
    threshold: 0.65,
    label: "Balanced variation",
    title: "Moderate temperature",
    summary: "The model allows some stylistic range while staying on-task.",
    response: "France’s capital is Paris, the country’s political and administrative center.",
  },
  {
    threshold: 1,
    label: "High drift risk",
    title: "High temperature",
    summary: "The model becomes more expressive and more likely to wander beyond the user’s exact need.",
    response: "Paris, the luminous heart of France, has served as its capital for centuries.",
  },
] as const

export const perceivedFailureStats: FailureStat[] = [
  { label: "Model tuning", value: 88, color: "#F59E0B" },
]

export const actualFailureStats: FailureStat[] = [
  { label: "Prompt layer", value: 54, color: "#8B5CF6" },
  { label: "Retrieval", value: 68, color: "#0F9D94" },
  { label: "Evaluation", value: 36, color: "#DC4C3F" },
  { label: "Model", value: 14, color: "#F59E0B" },
]

export const enterpriseSearchFailure = {
  title: "Enterprise Search",
  prompt: "What broke payments after the gateway migration?",
  steps: [
    {
      layerId: "user-product",
      title: "Ambiguous ask",
      state: "degraded" as const,
      detail: "The question lacks timeframe and whether the user wants root cause, symptoms, or impact.",
    },
    {
      layerId: "retrieval",
      title: "Outdated documents retrieved",
      state: "bad" as const,
      detail: "Search surfaces historical gateway architecture docs and an old outage postmortem.",
    },
    {
      layerId: "model",
      title: "Wrong failure explained confidently",
      state: "bad" as const,
      detail: "The model synthesizes an older incident because the retrieved evidence points there.",
    },
    {
      layerId: "output",
      title: "Confident answer reaches the user",
      state: "bad" as const,
      detail: "Without stronger validation, the system returns a plausible but wrong narrative.",
    },
    {
      layerId: "evaluation",
      title: "Monitoring reveals the pattern later",
      state: "fixed" as const,
      detail: "Golden prompts and drift detection finally show answers are regressing after the migration rollout.",
    },
  ],
  fixes: ["Intent classification", "Query rewrite", "Re-ranking", "Freshness-aware retrieval checks"],
}
