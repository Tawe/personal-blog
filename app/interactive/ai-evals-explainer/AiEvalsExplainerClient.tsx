"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { shareOrCopyUrl } from "@/lib/share-client"
import { AlertTriangle, ArrowDown, Calendar, Check, CheckCircle2, ChevronRight, Circle, Clock3, Copy, Equal, Eye, Gauge, Linkedin, ShieldAlert, Sparkles, TestTubeDiagonal } from "lucide-react"

type SystemStage = {
  id: string
  name: string
  evaluate: string[]
  why: string
}

type EvalType = {
  id: string
  name: string
  what: string
  how: string[]
  pros: string[]
  cons: string[]
  when: string[]
  failureModes: string[]
}

type StrategyProfile = {
  id: string
  pattern: string
  name: string
  human: "human" | "automated"
  cost: "cheap" | "expensive"
  timing: "pre-release" | "in-production"
  environment: "offline" | "online"
  useWhen: string
  risk: string
}

type MaturityLevel = {
  level: number
  title: string
  teamsDo: string[]
  breaks: string[]
  improves: string[]
}

type EvalId = EvalType["id"]
type StageId = SystemStage["id"]

const systemStages: SystemStage[] = [
  {
    id: "input",
    name: "Input / Prompt",
    evaluate: ["Prompt clarity", "Policy intent coverage", "Prompt injection resilience", "Input schema adherence"],
    why: "Weak prompts produce unstable behavior long before retrieval or model quality become the bottleneck.",
  },
  {
    id: "retrieval",
    name: "Retrieval",
    evaluate: ["Recall@k and precision@k", "Context freshness", "Document chunk quality", "Citation availability"],
    why: "If context quality is low, the model cannot answer correctly even if model reasoning is strong.",
  },
  {
    id: "model",
    name: "Model",
    evaluate: ["Task correctness", "Reasoning consistency", "Latency and token use", "Refusal behavior"],
    why: "Model choice changes cost, quality, and failure patterns. You need evidence, not intuition.",
  },
  {
    id: "tools",
    name: "Tools / Agents",
    evaluate: ["Tool selection accuracy", "Action sequencing", "Side-effect safety", "Recovery from tool failure"],
    why: "Agentic systems fail through bad actions, not only bad text. Evaluate plans and execution paths.",
  },
  {
    id: "output",
    name: "Output",
    evaluate: ["Factuality", "Instruction adherence", "Format correctness", "User-perceived helpfulness"],
    why: "Output quality determines trust, but output-only evaluation can hide upstream root causes.",
  },
  {
    id: "monitoring",
    name: "Monitoring",
    evaluate: ["Drift detection", "SLO breaches", "Escalation rate", "Regression after model/prompt changes"],
    why: "Production behavior shifts over time. Monitoring catches issues that offline tests will miss.",
  },
]

const evalTypes: EvalType[] = [
  {
    id: "correctness",
    name: "Correctness evals",
    what: "Whether outputs are right for the task against expected answers or criteria.",
    how: ["Golden dataset checks", "Reference-answer matching", "Task-specific scoring rubrics"],
    pros: ["Clear signal for bounded tasks", "Good for regression gates", "Easy to communicate"],
    cons: ["Weak on open-ended tasks", "Can overfit benchmarks", "Can ignore usefulness"],
    when: ["Structured Q&A", "Code generation with known outputs", "Extraction and classification"],
    failureModes: ["Dataset leakage", "Benchmark gaming", "False confidence from unrepresentative test sets"],
  },
  {
    id: "grounding",
    name: "Grounding / hallucination evals",
    what: "Whether claims in the output are supported by retrieved sources or known evidence.",
    how: [
      "Claim extraction and attribution checks",
      "Source citation verification",
      "LLM-as-judge comparisons against retrieved context",
    ],
    pros: [
      "Directly reduces hallucinations in RAG systems",
      "Increases user trust in factual domains",
      "Surfaces retrieval failures early",
    ],
    cons: [
      "Hard to automate perfectly",
      "Penalizes valid synthesis across sources",
      "Dependent on retrieval quality",
    ],
    when: ["Search and RAG systems", "Healthcare and legal assistants", "Knowledge-grounded copilots"],
    failureModes: [
      "False positives from paraphrased facts",
      "Over-constraining answers to literal citations",
      "Passing outputs with confidently wrong sources",
    ],
  },
  {
    id: "safety",
    name: "Safety & compliance evals",
    what: "Whether the system avoids harmful, policy-violating, or non-compliant outputs/actions.",
    how: ["Red-team prompts", "Policy classifier checks", "Scenario-based adversarial suites"],
    pros: ["Reduces severe risk", "Supports governance and audits", "Fits release gates"],
    cons: ["Coverage is never complete", "Policies change often", "Can reduce utility"],
    when: ["Healthcare, finance, legal, or regulated contexts", "Agentic workflows with external actions", "Public-facing copilots"],
    failureModes: ["Over-blocking useful responses", "Under-blocking novel attacks", "Policy drift after legal or business changes"],
  },
  {
    id: "instruction",
    name: "Instruction-following evals",
    what: "How reliably the system follows explicit and implicit instructions.",
    how: ["Constraint-check evaluators", "Format/schema validation", "Multi-turn retention tests"],
    pros: ["Improves UX consistency", "Useful for workflow automation", "Maps cleanly to requirements"],
    cons: ["Can reward shallow obedience", "Brittle to prompt convention changes", "Can conflict with safety behavior"],
    when: ["Structured output APIs", "Workflow copilots", "Agent plans with strict contract requirements"],
    failureModes: ["Instruction conflicts causing unstable behavior", "Prompt-injection override", "Schema-valid but semantically wrong output"],
  },
  {
    id: "quality",
    name: "Quality / helpfulness evals",
    what: "Whether responses are useful, clear, and aligned with user intent.",
    how: ["Human rubric scoring", "Pairwise preference tests", "Task-completion studies"],
    pros: ["Closest to user value", "Captures clarity and nuance", "Finds gaps strict tests miss"],
    cons: ["Subjective and expensive", "Rater disagreement", "Hard to standardize"],
    when: ["Assistant products", "Customer support copilots", "Complex writing and planning tasks"],
    failureModes: ["Rater inconsistency", "Tone bias dominating substance", "Evaluator drift as product expectations change"],
  },
  {
    id: "retrieval",
    name: "Retrieval evals",
    what: "How well the retrieval system finds the right context at the right time.",
    how: ["Recall@k, MRR, nDCG", "Hard-negative testing", "Freshness and coverage audits"],
    pros: ["Diagnoses RAG failures early", "Can improve quality without model changes", "Often cheaper than end-to-end relabeling"],
    cons: ["Needs relevance labels", "Metrics can miss semantic fit", "Good retrieval may still yield bad answers"],
    when: ["Any RAG architecture", "Search-heavy copilots", "Enterprise knowledge assistants"],
    failureModes: ["Embedding drift", "Stale index with fresh questions", "High recall but poor precision causing context overload"],
  },
  {
    id: "regression",
    name: "Regression evals",
    what: "Whether recent changes made performance better, worse, or just different.",
    how: ["Pinned benchmark suites", "Diff-based score comparisons", "Critical-path scenario replay"],
    pros: ["Protects against silent degradation", "Supports fast iteration with guardrails", "Works across prompt/model/tool changes"],
    cons: ["Needs disciplined versioning", "Suites become stale", "Naive thresholds block progress"],
    when: ["Every release touching prompts/models/tools", "Model migrations", "Prompt refactors and retrieval tuning"],
    failureModes: ["Green tests that ignore new user behaviors", "Metric movement without root-cause analysis", "Overly broad gates causing release paralysis"],
  },
]

const strategyProfiles: StrategyProfile[] = [
  {
    id: "human-offline-prerelease",
    pattern: "Exploration mode",
    name: "Human rubric review",
    human: "human",
    cost: "expensive",
    timing: "pre-release",
    environment: "offline",
    useWhen: "You need nuanced judgment before launch for high-value workflows.",
    risk: "Slow cadence and annotation bottlenecks.",
  },
  {
    id: "automated-offline-prerelease",
    pattern: "Regression gate",
    name: "Automated benchmark suite",
    human: "automated",
    cost: "cheap",
    timing: "pre-release",
    environment: "offline",
    useWhen: "You need repeatable release gates and fast feedback on known tasks.",
    risk: "Can miss real user behavior and emerging failure modes.",
  },
  {
    id: "human-online-production",
    pattern: "Safety review loop",
    name: "In-product expert audits",
    human: "human",
    cost: "expensive",
    timing: "in-production",
    environment: "online",
    useWhen: "You need reality checks for edge cases and policy-sensitive flows.",
    risk: "Limited coverage; may catch issues late.",
  },
  {
    id: "automated-online-production",
    pattern: "Drift monitor",
    name: "Continuous monitor + alerts",
    human: "automated",
    cost: "cheap",
    timing: "in-production",
    environment: "online",
    useWhen: "You need broad production coverage with fast anomaly detection.",
    risk: "High false positives or blind spots without calibration.",
  },
  {
    id: "human-cheap-prerelease",
    pattern: "Sanity check pass",
    name: "Manual spot checks",
    human: "human",
    cost: "cheap",
    timing: "pre-release",
    environment: "offline",
    useWhen: "You are early-stage and need directional signal quickly.",
    risk: "Highly variable quality; weak reproducibility.",
  },
  {
    id: "automated-expensive-production",
    pattern: "Deep trace grading",
    name: "Model-graded deep traces",
    human: "automated",
    cost: "expensive",
    timing: "in-production",
    environment: "online",
    useWhen: "You need richer scoring on complex live interactions at scale.",
    risk: "Evaluator cost and evaluator drift can become significant.",
  },
]

const maturityLevels: MaturityLevel[] = [
  {
    level: 1,
    title: "No evals (demos & vibes)",
    teamsDo: ["Ship from demos", "Decide by intuition"],
    breaks: ["Incidents are surprises", "No quality baseline"],
    improves: ["Prototype speed only"],
  },
  {
    level: 2,
    title: "Manual spot checks",
    teamsDo: ["Run ad hoc prompt tests", "Sample outputs before release"],
    breaks: ["Results are not reproducible", "Reviewer quality varies"],
    improves: ["Obvious failures get caught"],
  },
  {
    level: 3,
    title: "Offline eval suites",
    teamsDo: ["Maintain benchmark datasets", "Track metrics by version"],
    breaks: ["Coverage gaps vs live traffic", "Dataset drift accumulates"],
    improves: ["Repeatable comparisons"],
  },
  {
    level: 4,
    title: "Regression gates",
    teamsDo: ["Block releases on regressions", "Run suites on every core change"],
    breaks: ["Metric gaming appears", "False gates slow shipping"],
    improves: ["Fewer silent quality drops"],
  },
  {
    level: 5,
    title: "Production monitoring",
    teamsDo: ["Track live quality signals", "Alert on drift and incidents", "Triage with traces"],
    breaks: ["Alert noise grows", "Ops burden rises"],
    improves: ["Faster detection and recovery"],
  },
  {
    level: 6,
    title: "Continuous learning loop",
    teamsDo: ["Turn prod failures into new tests", "Refresh rubrics and datasets", "Close the loop with product owners"],
    breaks: ["Ownership drift hurts quality", "Process complexity can sprawl"],
    improves: ["Sustained quality gains"],
  },
]

const stageOrder: StageId[] = ["input", "retrieval", "model", "tools", "output", "monitoring"]

const stageConsequences: Record<StageId, string> = {
  input: "Ambiguous prompts cascade into retrieval, model, and output errors.",
  retrieval: "Most hallucinations start with missing or weak context here.",
  model: "Model behavior amplifies both prompt and retrieval quality.",
  tools: "Bad tool decisions produce incorrect actions, not just incorrect text.",
  output: "User trust drops here, even when upstream causes are hidden.",
  monitoring: "Without monitoring, regressions persist long after release.",
}

const evalCoverage: Record<EvalId, StageId[]> = {
  correctness: ["model", "output"],
  grounding: ["retrieval", "output"],
  safety: ["input", "model", "tools", "output"],
  instruction: ["input", "model", "output"],
  quality: ["output", "monitoring"],
  retrieval: ["retrieval", "monitoring"],
  regression: ["input", "retrieval", "model", "tools", "output", "monitoring"],
}

const evalBlindSpots: Record<EvalId, string[]> = {
  correctness: ["May miss grounding failures", "May miss safety and policy drift"],
  grounding: ["May miss instruction quality issues", "May miss harmful-but-grounded outputs"],
  safety: ["May miss usefulness and task success", "May miss retrieval quality degradation"],
  instruction: ["May miss factual correctness", "May miss latent safety risk"],
  quality: ["May miss hidden hallucinations", "May miss tool-path correctness"],
  retrieval: ["May miss final answer quality", "May miss safety and compliance issues"],
  regression: ["May miss new failure classes", "May miss shifting user expectations"],
}

const constraintLabels = {
  budget: ["Lean", "Flexible"],
  risk: ["Low tolerance", "Higher tolerance"],
  regulatory: ["Low pressure", "High pressure"],
  scale: ["Low scale", "High scale"],
} as const

const failureScenario = {
  correctness: {
    detects: ["wrong target answer", "task-score regression"],
    misses: ["unsupported fluent claims", "unsafe-but-correct outputs"],
  },
  grounding: {
    detects: ["unsupported claims", "missing citations"],
    misses: ["instruction violations", "policy breaches with citations"],
  },
  safety: {
    detects: ["policy-breaking output", "refusal failures"],
    misses: ["subtle factual mistakes", "retrieval relevance loss"],
  },
  retrieval: {
    detects: ["missing key docs", "stale context"],
    misses: ["final answer quality", "policy/tool risks"],
  },
} as const

export function AiEvalsExplainerClient() {
  const firstSectionRef = useRef<HTMLElement | null>(null)
  const lastConstraintKeyRef = useRef("")
  const [certaintyMode, setCertaintyMode] = useState<"deterministic" | "probabilistic" | null>(null)
  const [activeStageId, setActiveStageId] = useState(systemStages[0]?.id ?? "input")
  const [selectedEvalId, setSelectedEvalId] = useState<EvalId | null>(null)
  const [budget, setBudget] = useState<"cheap" | "expensive" | null>(null)
  const [riskTolerance, setRiskTolerance] = useState<"low" | "high" | null>(null)
  const [regulatoryPressure, setRegulatoryPressure] = useState<"low" | "high" | null>(null)
  const [scaleLevel, setScaleLevel] = useState<"low" | "high" | null>(null)
  const [failureFocus, setFailureFocus] = useState<"correctness" | "grounding" | "safety" | "retrieval" | null>(null)
  const [maturityLevel, setMaturityLevel] = useState(3)
  const [currentUrl, setCurrentUrl] = useState("")
  const [shareState, setShareState] = useState<"idle" | "copying" | "copied">("idle")
  const [stageCuePulse, setStageCuePulse] = useState(false)
  const [blindSpotPulse, setBlindSpotPulse] = useState(false)
  const [strategyLocked, setStrategyLocked] = useState(false)

  useEffect(() => {
    setCurrentUrl(window.location.href)
  }, [])

  const activeStage = systemStages.find((stage) => stage.id === activeStageId) ?? systemStages[0]
  const activeStageIndex = stageOrder.indexOf(activeStage.id)
  const selectedEval = selectedEvalId ? evalTypes.find((item) => item.id === selectedEvalId) : null
  const chosenCoverage = selectedEvalId ? evalCoverage[selectedEvalId] : []

  const constraintsChosen = budget !== null && riskTolerance !== null && regulatoryPressure !== null && scaleLevel !== null
  const rankedStrategies = useMemo(() => {
    if (!constraintsChosen) return []

    const desiredHuman = regulatoryPressure === "high" || riskTolerance === "low" ? "human" : "automated"
    const desiredCost = budget ?? "cheap"
    const desiredEnvironment = scaleLevel === "high" ? "online" : "offline"
    const desiredTiming = riskTolerance === "low" || regulatoryPressure === "high" ? "in-production" : "pre-release"

    return strategyProfiles
      .map((profile) => {
        let score = 0
        if (profile.human === desiredHuman) score += 1
        if (profile.cost === desiredCost) score += 1
        if (profile.environment === desiredEnvironment) score += 1
        if (profile.timing === desiredTiming) score += 1
        return { profile, score }
      })
      .sort((a, b) => b.score - a.score)
  }, [budget, constraintsChosen, regulatoryPressure, riskTolerance, scaleLevel])

  const topStrategyScore = rankedStrategies[0]?.score ?? 0
  const lockInputs = strategyLocked
  const constraintKey = `${budget ?? "x"}-${riskTolerance ?? "x"}-${regulatoryPressure ?? "x"}-${scaleLevel ?? "x"}`

  const activeMaturity = maturityLevels.find((entry) => entry.level === maturityLevel) ?? maturityLevels[0]
  const shareText = "Interactive AI evals explainer for RAG systems, agents, and copilots."

  useEffect(() => {
    if (constraintsChosen && lastConstraintKeyRef.current !== constraintKey) {
      setStrategyLocked(true)
      const timer = window.setTimeout(() => setStrategyLocked(false), 420)
      lastConstraintKeyRef.current = constraintKey
      return () => window.clearTimeout(timer)
    }
    if (!constraintsChosen) lastConstraintKeyRef.current = ""
  }, [constraintKey, constraintsChosen])

  const linkedInShareHref = currentUrl
    ? `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`
    : ""
  const xShareHref = currentUrl
    ? `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`
    : ""

  const handleShare = async () => {
    if (!currentUrl || shareState === "copying") return
    setShareState("copying")
    await shareOrCopyUrl(currentUrl, shareText)
    setShareState("copied")
    window.setTimeout(() => setShareState("idle"), 1500)
  }

  const handleStartExploring = () => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    firstSectionRef.current?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    })
  }

  const handleStageSelect = (stageId: StageId) => {
    setActiveStageId(stageId)
    setStageCuePulse(true)
    window.setTimeout(() => setStageCuePulse(false), 260)
  }

  const handleEvalSelect = (evalId: EvalId) => {
    setSelectedEvalId(evalId)
    setBlindSpotPulse(true)
    window.setTimeout(() => setBlindSpotPulse(false), 260)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="pb-16">
        <section className="border-b border-[#D6DEE6] bg-white motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-1 motion-safe:duration-500">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="relative grid min-h-[70vh] grid-cols-1 items-start gap-8 py-8 md:min-h-[calc(100vh-4rem)] md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:items-center md:gap-10 md:py-12">
              <div className="space-y-6">
                <div className="space-y-3">
                  <nav aria-label="Breadcrumb">
                    <ol className="flex flex-wrap items-center gap-2 text-sm text-text-muted">
                      <li>
                        <Link
                          href="/interactive"
                          className="hover:text-text-strong transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                        >
                          Interactive
                        </Link>
                      </li>
                      <li aria-hidden="true">/</li>
                      <li aria-current="page" className="text-text-muted">
                        AI Evals Explainer
                      </li>
                    </ol>
                  </nav>
                  <h1 className="text-4xl lg:text-5xl font-bold text-text-strong leading-tight">AI evals for real systems</h1>
                  <p className="text-2xl text-text-body font-medium">Tradeoffs, failure modes, and what each eval method is actually good for</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button onClick={handleStartExploring}>Start exploring</Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-text-muted hover:text-text-strong !hover:bg-transparent !active:bg-transparent !focus-visible:bg-transparent"
                    onClick={handleShare}
                    disabled={shareState === "copying"}
                  >
                    {shareState === "copied" ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Share
                      </>
                    )}
                  </Button>
                  {linkedInShareHref ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-text-muted hover:text-text-strong !hover:bg-transparent !active:bg-transparent !focus-visible:bg-transparent"
                      asChild
                    >
                      <Link href={linkedInShareHref} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="mr-2 h-4 w-4" />
                        LinkedIn
                      </Link>
                    </Button>
                  ) : null}
                  {xShareHref ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-text-muted hover:text-text-strong !hover:bg-transparent !active:bg-transparent !focus-visible:bg-transparent"
                      asChild
                    >
                      <Link href={xShareHref} target="_blank" rel="noopener noreferrer">
                        Share on X
                      </Link>
                    </Button>
                  ) : null}
                </div>
                <div className="flex flex-wrap items-center gap-6 text-sm text-text-muted">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <time dateTime="2026-02-22">February 22, 2026</time>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4" />
                    <span>12 min read</span>
                  </div>
                </div>
                <p className="max-w-3xl text-base leading-7 text-text-body">
                  A practical guide to evaluating RAG systems, agents, and copilots without hype.
                </p>
              </div>

              <div className="relative group">
                <div className="relative overflow-hidden rounded-xl border border-[#D6DEE6] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.18)] transition duration-300 group-hover:shadow-[0_24px_60px_rgba(15,23,42,0.2)]">
                  <div className="relative aspect-[16/10] md:aspect-[16/11] w-full">
                    <Image
                      src="/evalforrealsystems.png"
                      alt="AI evals for real systems interface preview"
                      fill
                      className="object-cover transition duration-500"
                      priority
                    />
                  </div>
                </div>
              </div>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <button
                  type="button"
                  onClick={handleStartExploring}
                  className="inline-flex items-center gap-2 rounded-full border border-[#D6DEE6] bg-white/92 px-3 py-1.5 text-xs font-medium text-[#445561] shadow-sm transition duration-200 hover:bg-[#F8FBFD]"
                >
                  Scroll
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6 md:py-14 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1 motion-safe:duration-500">

        <section ref={firstSectionRef} className="mt-10 rounded-2xl border border-slate-300/80 bg-white p-6 transition duration-300 hover:shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 id="what-are-ai-evals" className="text-2xl font-semibold text-slate-900 dark:text-slate-100">What are AI evals?</h2>
          <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300">Which world are you building for?</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCertaintyMode("deterministic")}
              className={`rounded-md border px-3 py-2 text-sm transition ${
                certaintyMode === "deterministic"
                  ? "border-blue-600 bg-blue-100 text-blue-900 dark:border-blue-400 dark:bg-blue-950/60 dark:text-blue-100"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              }`}
            >
              Deterministic software
            </button>
            <button
              type="button"
              onClick={() => setCertaintyMode("probabilistic")}
              className={`rounded-md border px-3 py-2 text-sm transition ${
                certaintyMode === "probabilistic"
                  ? "border-blue-600 bg-blue-100 text-blue-900 dark:border-blue-400 dark:bg-blue-950/60 dark:text-blue-100"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              }`}
            >
              Probabilistic AI system
            </button>
          </div>

          {certaintyMode ? (
            <div className="mt-5 rounded-xl border border-slate-300/80 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/50">
              <p className="rounded-md border border-blue-300/70 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-900 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-1 motion-safe:duration-200 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
                {certaintyMode === "deterministic" ? "Consequence cue: brittle assumptions break quickly." : "Consequence cue: confidence can look right while being wrong."}
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <article className="rounded-lg border border-green-300/70 bg-green-50 p-4 transition duration-200 hover:shadow-sm dark:border-green-900 dark:bg-green-950/20">
                  <div className="flex items-center gap-2 text-green-900 dark:text-green-200">
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    <h3 className="text-sm font-semibold">Traditional test mindset</h3>
                  </div>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-green-900 dark:text-green-100">
                    <li>Binary pass/fail</li>
                    <li>Known expected output</li>
                  </ul>
                </article>
                <article className="rounded-lg border border-blue-300/70 bg-blue-50 p-4 transition duration-200 hover:shadow-sm dark:border-blue-900 dark:bg-blue-950/20">
                  <div className="flex items-center gap-2 text-blue-900 dark:text-blue-200">
                    <TestTubeDiagonal className="h-4 w-4" aria-hidden="true" />
                    <h3 className="text-sm font-semibold">AI eval mindset</h3>
                  </div>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-blue-900 dark:text-blue-100">
                    <li>Metric distributions, not only binary outcomes</li>
                    <li>Quality judged across representative scenarios</li>
                    <li>Confidence thresholds and acceptable risk windows</li>
                  </ul>
                </article>
              </div>
              <p className="mt-4 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                {certaintyMode === "deterministic"
                  ? "Deterministic systems optimize for correctness certainty. Failure usually means a logic bug."
                  : "AI systems optimize for bounded uncertainty. Failure includes wrong answers, wrong confidence, and wrong actions."}
              </p>
              <p className="mt-3 text-sm font-medium text-slate-900 dark:text-slate-100">Evals replace certainty with measured confidence.</p>
            </div>
          ) : null}
        </section>

        <section className="mt-10 rounded-2xl border border-slate-300/80 bg-white p-6 transition duration-300 hover:shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 id="where-evals-fit" className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Where evals fit in an AI system</h2>
          <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300">Select a stage to see the blast radius.</p>

          <div className="mt-5 overflow-x-auto rounded-xl border border-slate-300/80 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/50">
            <div className="flex min-w-[860px] items-center gap-2" role="tablist" aria-label="AI system stages">
              {systemStages.map((stage, index) => {
                const current = stageOrder.indexOf(stage.id)
                const isActive = stage.id === activeStageId
                const isDownstream = current > activeStageIndex
                const isUpstream = current < activeStageIndex
                return (
                  <div key={stage.id} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleStageSelect(stage.id)}
                      role="tab"
                      aria-selected={isActive}
                      className={`rounded-lg border px-3 py-2 text-sm transition ${
                        isActive
                          ? "border-blue-600 bg-blue-100 text-blue-900 dark:border-blue-400 dark:bg-blue-950/60 dark:text-blue-100"
                          : isDownstream
                            ? "border-indigo-300 bg-indigo-50 text-indigo-900 dark:border-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-200"
                            : isUpstream
                              ? "border-slate-200 bg-white/60 text-slate-500 opacity-60 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500"
                              : "border-slate-300 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                      }`}
                    >
                      {stage.name}
                    </button>
                    {index < systemStages.length - 1 ? (
                      <ChevronRight
                        className={`h-4 w-4 ${index < activeStageIndex ? "text-slate-400" : "text-indigo-500"}`}
                        aria-hidden="true"
                      />
                    ) : null}
                  </div>
                )
              })}
            </div>
          </div>

          <article className="mt-4 rounded-xl border border-slate-300/80 bg-white p-5 transition duration-200 hover:shadow-sm dark:border-slate-700 dark:bg-slate-900/50" role="tabpanel" aria-live="polite">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{activeStage.name}</h3>
            <p className={`mt-2 rounded-md border border-amber-300/70 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-900 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-1 motion-safe:duration-200 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200 ${stageCuePulse ? "ring-1 ring-amber-300/80 dark:ring-amber-700/80" : ""}`}>
              Downstream impact detected.
            </p>
            <p className="mt-2 rounded-md border border-amber-300/70 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-900 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-1 motion-safe:duration-200 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
              {stageConsequences[activeStage.id]}
            </p>
            <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">{activeStage.why}</p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">What can be evaluated here</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
              {activeStage.evaluate.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </section>

        <section className="mt-10 rounded-2xl border border-slate-300/80 bg-white p-6 transition duration-300 hover:shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 id="types-of-ai-evals" className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Types of AI evals</h2>
          <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300">Your system is failing. Where do you look first?</p>

          <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            {evalTypes.map((item) => {
              const active = selectedEvalId === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleEvalSelect(item.id)}
                  className={`rounded-lg border px-3 py-2 text-left text-sm transition ${
                    active
                      ? "border-blue-600 bg-blue-100 text-blue-900 dark:border-blue-400 dark:bg-blue-950/60 dark:text-blue-100"
                      : selectedEvalId
                        ? "border-slate-200 bg-white text-slate-500 opacity-60 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500"
                        : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  }`}
                >
                  {item.name}
                </button>
              )
            })}
          </div>

          {selectedEval && selectedEvalId ? (
            <div className="mt-5 space-y-4">
              <div className="rounded-xl border border-slate-300/80 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/40">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">Stage coverage</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {systemStages.map((stage) => {
                    const covered = chosenCoverage.includes(stage.id)
                    return (
                      <span
                        key={stage.id}
                        className={`rounded-md border px-2 py-1 text-xs ${
                          covered
                            ? "border-blue-500 bg-blue-100 text-blue-900 ring-1 ring-blue-300/70 dark:border-blue-400 dark:bg-blue-950/50 dark:text-blue-100 dark:ring-blue-700/80"
                            : "border-slate-300 bg-white text-slate-500 opacity-55 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-500"
                        }`}
                      >
                        {stage.name}
                      </span>
                    )
                  })}
                </div>
              </div>

              <p className={`rounded-md border border-amber-300/70 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-900 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-1 motion-safe:duration-200 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200 ${blindSpotPulse ? "ring-1 ring-amber-300/80 dark:ring-amber-700/80" : ""}`}>
                Blind spot: {evalBlindSpots[selectedEvalId][0]}
              </p>

              <div className={`rounded-xl border border-rose-300/70 bg-rose-50 p-4 dark:border-rose-900 dark:bg-rose-950/20 ${blindSpotPulse ? "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-1 motion-safe:duration-200" : ""}`}>
                <p className="text-xs font-semibold uppercase tracking-wide text-rose-800 dark:text-rose-300">Blind spots: this eval will miss</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-rose-900 dark:text-rose-100">
                  {evalBlindSpots[selectedEvalId].map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-lg border border-slate-300 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">What it measures</h3>
                  <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{selectedEval.what}</p>
                </div>
                <div className="rounded-lg border border-slate-300 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">How it works</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
                    {selectedEval.how.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-lg border border-green-300/70 bg-green-50 p-3 dark:border-green-900 dark:bg-green-950/20">
                  <h3 className="text-sm font-semibold text-green-900 dark:text-green-200">Pros</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-green-900 dark:text-green-100">
                    {selectedEval.pros.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-lg border border-rose-300/70 bg-rose-50 p-3 dark:border-rose-900 dark:bg-rose-950/20">
                  <h3 className="text-sm font-semibold text-rose-900 dark:text-rose-200">Cons</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-rose-900 dark:text-rose-100">
                    {selectedEval.cons.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-lg border border-blue-300/70 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-950/20">
                  <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-200">When to use it</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-blue-900 dark:text-blue-100">
                    {selectedEval.when.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-lg border border-amber-300/70 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950/20">
                  <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-200">Failure modes</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-900 dark:text-amber-100">
                    {selectedEval.failureModes.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : null}
        </section>

        <section className="mt-10 rounded-2xl border border-slate-300/80 bg-white p-6 transition duration-300 hover:shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 id="failure-check" className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Failure check</h2>
          <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300">You shipped a change. Trust dropped. What do you check?</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {(["correctness", "grounding", "safety", "retrieval"] as const).map((item) => {
              const active = failureFocus === item
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFailureFocus(item)}
                  className={`rounded-lg border px-3 py-2 text-left text-sm capitalize transition ${
                    active
                      ? "border-blue-600 bg-blue-100 text-blue-900 dark:border-blue-400 dark:bg-blue-950/60 dark:text-blue-100"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  }`}
                >
                  {item}
                </button>
              )
            })}
          </div>
          {failureFocus ? (
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <p className="md:col-span-2 rounded-md border border-amber-300/70 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-900 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-1 motion-safe:duration-200 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
                Consequence cue: single-check diagnosis leaves hidden failure classes.
              </p>
              <article className="rounded-lg border border-green-300/70 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950/20">
                <h3 className="text-sm font-semibold text-green-900 dark:text-green-200">Caught</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-green-900 dark:text-green-100">
                  {failureScenario[failureFocus].detects.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
              <article className="rounded-lg border border-rose-300/70 bg-rose-50 p-4 dark:border-rose-900 dark:bg-rose-950/20">
                <h3 className="text-sm font-semibold text-rose-900 dark:text-rose-200">Missed</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-rose-900 dark:text-rose-100">
                  {failureScenario[failureFocus].misses.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
              <p className="md:col-span-2 rounded-lg border border-amber-300/70 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
                One eval type finds one failure shape. You need a portfolio to bound real risk.
              </p>
            </div>
          ) : null}
        </section>

        <section className="mt-10 rounded-2xl border border-slate-300/80 bg-white p-6 transition duration-300 hover:shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 id="evaluating-ai-systems-in-production" className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Evaluating AI systems in production</h2>
          <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300">Pick constraints first. Strategy comes after.</p>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-slate-300 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">Budget</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {(["cheap", "expensive"] as const).map((option, idx) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setBudget(option)}
                    disabled={lockInputs}
                    className={`rounded-md border px-3 py-2 text-sm transition ${
                      budget === option
                        ? "border-blue-600 bg-blue-100 text-blue-900 dark:border-blue-400 dark:bg-blue-950/50 dark:text-blue-100"
                        : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                    }`}
                  >
                    {constraintLabels.budget[idx]}
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-slate-300 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">Risk tolerance</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {(["low", "high"] as const).map((option, idx) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setRiskTolerance(option)}
                    disabled={lockInputs}
                    className={`rounded-md border px-3 py-2 text-sm transition ${
                      riskTolerance === option
                        ? "border-blue-600 bg-blue-100 text-blue-900 dark:border-blue-400 dark:bg-blue-950/50 dark:text-blue-100"
                        : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                    }`}
                  >
                    {constraintLabels.risk[idx]}
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-slate-300 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">Regulatory pressure</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {(["low", "high"] as const).map((option, idx) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setRegulatoryPressure(option)}
                    disabled={lockInputs}
                    className={`rounded-md border px-3 py-2 text-sm transition ${
                      regulatoryPressure === option
                        ? "border-blue-600 bg-blue-100 text-blue-900 dark:border-blue-400 dark:bg-blue-950/50 dark:text-blue-100"
                        : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                    }`}
                  >
                    {constraintLabels.regulatory[idx]}
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-slate-300 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">Scale</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {(["low", "high"] as const).map((option, idx) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setScaleLevel(option)}
                    disabled={lockInputs}
                    className={`rounded-md border px-3 py-2 text-sm transition ${
                      scaleLevel === option
                        ? "border-blue-600 bg-blue-100 text-blue-900 dark:border-blue-400 dark:bg-blue-950/50 dark:text-blue-100"
                        : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                    }`}
                  >
                    {constraintLabels.scale[idx]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-slate-300/80 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/40">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Strategy profiles</h3>
            {constraintsChosen ? (
              <div className="mt-3 space-y-3">
                <p className="rounded-md border border-blue-300/70 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-900 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-1 motion-safe:duration-200 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
                  {strategyLocked ? "Constraint set locked. Resolving tradeoffs..." : "Constraint set applied. Incompatible strategies faded."}
                </p>
                <div className="grid gap-3 md:grid-cols-2">
                {rankedStrategies.map(({ profile, score }) => {
                  const recommended = score === topStrategyScore && topStrategyScore > 0
                  return (
                    <article
                      key={profile.id}
                      className={`rounded-lg border border-slate-300 bg-white p-3 transition duration-200 dark:border-slate-700 dark:bg-slate-900 ${
                        recommended
                          ? `shadow-sm ring-1 ring-blue-400/50 ${strategyLocked ? "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-1 motion-safe:duration-200" : ""}`
                          : "opacity-40"
                      }`}
                    >
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">{profile.pattern}</p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{profile.name}</p>
                      <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{profile.useWhen}</p>
                      <p className="mt-2 text-xs text-rose-700 dark:text-rose-300">Watch out: {profile.risk}</p>
                    </article>
                  )
                })}
                </div>
              </div>
            ) : (
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Select all four constraints to compute a strategy match.</p>
            )}
          </div>

          {constraintsChosen ? (
            <div className="mt-5 overflow-x-auto rounded-xl border border-slate-300/80 dark:border-slate-700">
            <table className="min-w-full divide-y divide-slate-300 text-sm dark:divide-slate-700">
              <thead className="bg-slate-100 dark:bg-slate-900/80">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-slate-900 dark:text-slate-100">Dimension</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-900 dark:text-slate-100">Option A</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-900 dark:text-slate-100">Option B</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-900 dark:text-slate-100">When each is appropriate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-950/40">
                <tr>
                  <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">Named patterns</td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">Exploration mode, Safety review loop</td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">Regression gate, Drift monitor</td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">Name the mode before you debate tools. It reduces ambiguous planning discussions.</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">Evaluator</td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">Human</td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">Automated</td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">Use human for nuanced judgment and policy ambiguity. Use automated for scale and repeatability.</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">Cost</td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">Cheap</td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">Expensive</td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">Cheap for fast iteration and broad checks. Expensive for high-stakes workflows where false negatives are costly.</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">Environment</td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">Offline</td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">Online</td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">Offline for controlled experiments and release decisions. Online for drift detection and live-risk visibility.</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">Lifecycle</td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">Pre-release</td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">In-production</td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">Pre-release to prevent known failures. In-production to catch unknowns and changing user behavior.</td>
                </tr>
              </tbody>
            </table>
            </div>
          ) : null}
        </section>

        <section className="mt-10 rounded-2xl border border-amber-300/70 bg-amber-50 p-6 transition duration-300 hover:shadow-sm dark:border-amber-900 dark:bg-amber-950/20">
          <h2 id="what-most-explanations-miss" className="text-2xl font-semibold text-amber-900 dark:text-amber-200">What most explanations miss</h2>
          <p className="mt-3 text-sm leading-6 text-amber-900 dark:text-amber-100">Most eval suites lie to you in subtle ways.</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <article className="rounded-lg border border-amber-300/70 bg-white p-4 transition duration-200 hover:shadow-sm dark:border-amber-900/70 dark:bg-amber-950/30">
              <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">Evals are socio-technical</p>
              <p className="mt-2 text-sm text-amber-900 dark:text-amber-100">Every rubric encodes values. Make those assumptions explicit.</p>
            </article>
            <article className="rounded-lg border border-amber-300/70 bg-white p-4 transition duration-200 hover:shadow-sm dark:border-amber-900/70 dark:bg-amber-950/30">
              <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">Evals drift over time</p>
              <p className="mt-2 text-sm text-amber-900 dark:text-amber-100">Data, user intent, and model behavior change. Static suites decay.</p>
            </article>
            <article className="rounded-lg border border-amber-300/70 bg-white p-4 transition duration-200 hover:shadow-sm dark:border-amber-900/70 dark:bg-amber-950/30">
              <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">Evals do not prevent failure</p>
              <p className="mt-2 text-sm text-amber-900 dark:text-amber-100">They bound failure. Demos pass long before systems are safe.</p>
            </article>
            <article className="rounded-lg border border-amber-300/70 bg-white p-4 transition duration-200 hover:shadow-sm dark:border-amber-900/70 dark:bg-amber-950/30">
              <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">You cannot eval what you cannot observe</p>
              <p className="mt-2 text-sm text-amber-900 dark:text-amber-100">No logs, traces, and versioning means no credible root-cause analysis.</p>
            </article>
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-slate-300/80 bg-white p-6 transition duration-300 hover:shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 id="evals-maturity-model" className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Evals maturity model</h2>
          <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300">Most teams move through these stages. If your evals never fail, they are not testing reality.</p>
          <div className="mt-5 grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
            <div className="rounded-xl border border-slate-300 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950/40">
              {maturityLevels.map((entry) => {
                const active = entry.level === maturityLevel
                return (
                  <button
                    key={entry.level}
                    type="button"
                    onClick={() => setMaturityLevel(entry.level)}
                    className={`mb-2 flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition duration-200 last:mb-0 ${
                      active
                        ? "border-blue-600 bg-blue-100 text-blue-900 dark:border-blue-400 dark:bg-blue-950/60 dark:text-blue-100"
                        : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                    }`}
                    aria-pressed={active}
                  >
                    {active ? <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> : <Circle className="h-4 w-4" aria-hidden="true" />}
                    <span>
                      {entry.level}. {entry.title}
                    </span>
                  </button>
                )
              })}
            </div>
            <article className="rounded-xl border border-slate-300 bg-white p-5 transition duration-200 hover:shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Level {activeMaturity.level}: {activeMaturity.title}
              </h3>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <div className="rounded-lg border border-slate-300 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950/50">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">What teams do</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
                    {activeMaturity.teamsDo.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-lg border border-rose-300/70 bg-rose-50 p-3 dark:border-rose-900 dark:bg-rose-950/20">
                  <p className="text-xs font-semibold uppercase tracking-wide text-rose-800 dark:text-rose-300">What breaks</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-rose-900 dark:text-rose-100">
                    {activeMaturity.breaks.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-lg border border-green-300/70 bg-green-50 p-3 dark:border-green-900 dark:bg-green-950/20">
                  <p className="text-xs font-semibold uppercase tracking-wide text-green-800 dark:text-green-300">What improves</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-green-900 dark:text-green-100">
                    {activeMaturity.improves.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-slate-300/80 bg-gradient-to-r from-slate-50 to-white p-6 transition duration-300 hover:shadow-sm dark:border-slate-700 dark:from-slate-950/40 dark:to-slate-900">
          <h2 id="closing-takeaway" className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Closing takeaway</h2>
          <blockquote className="mt-4 rounded-xl border-l-4 border-blue-700 bg-white p-4 text-lg font-medium text-slate-900 dark:border-blue-400 dark:bg-slate-950/40 dark:text-slate-100">
            “Evals aren’t about proving your AI is correct. They’re about knowing when it’s wrong and how wrong is acceptable.”
          </blockquote>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <article className="rounded-lg border border-slate-300 bg-white p-3 transition duration-200 hover:shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                <Eye className="h-4 w-4" aria-hidden="true" />
                Observability is a prerequisite
              </div>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Instrument prompts, retrieval, tool calls, and outputs with traceable versions.</p>
            </article>
            <article className="rounded-lg border border-slate-300 bg-white p-3 transition duration-200 hover:shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                <Gauge className="h-4 w-4" aria-hidden="true" />
                Measurement is contextual
              </div>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Use mixed eval strategies to capture quality, safety, grounding, and drift.</p>
            </article>
            <article className="rounded-lg border border-slate-300 bg-white p-3 transition duration-200 hover:shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Adaptation is continuous
              </div>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Treat evals as a product surface that evolves with users, policy, and system design.</p>
            </article>
          </div>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
            Related interactive references:{" "}
            <Link href="/interactive/rag-atlas" className="text-blue-700 underline decoration-blue-300 underline-offset-2 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200">
              The RAG Atlas
            </Link>{" "}
            and{" "}
            <Link href="/interactive/architecture-playground" className="text-blue-700 underline decoration-blue-300 underline-offset-2 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200">
              API vs Message vs Event-Driven Architecture
            </Link>
            .
          </p>
        </section>

        <section className="mt-8 rounded-xl border border-slate-300/80 bg-slate-50 p-4 transition duration-300 hover:shadow-sm dark:border-slate-700 dark:bg-slate-950/50">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
            <span className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-900">
              <Equal className="h-3.5 w-3.5" aria-hidden="true" />
              Tradeoffs over absolutes
            </span>
            <span className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-900">
              <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />
              Risk must be explicit
            </span>
            <span className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-900">
              <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
              Failure is managed, not eliminated
            </span>
          </div>
          <p className="mt-3 text-xs text-slate-600 dark:text-slate-400">
            Reference sources:{" "}
            <Link href="https://platform.openai.com/docs/guides/agent-evals" target="_blank" rel="noopener noreferrer" className="underline decoration-slate-400 underline-offset-2 hover:text-slate-800 dark:hover:text-slate-200">
              OpenAI Agent Evals
            </Link>
            ,{" "}
            <Link href="https://docs.langchain.com/langsmith/evaluate-llm-application" target="_blank" rel="noopener noreferrer" className="underline decoration-slate-400 underline-offset-2 hover:text-slate-800 dark:hover:text-slate-200">
              LangSmith Evaluation
            </Link>
            ,{" "}
            <Link href="https://docs.ragas.io/en/latest/references/evaluate/" target="_blank" rel="noopener noreferrer" className="underline decoration-slate-400 underline-offset-2 hover:text-slate-800 dark:hover:text-slate-200">
              Ragas
            </Link>
            ,{" "}
            <Link href="https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence" target="_blank" rel="noopener noreferrer" className="underline decoration-slate-400 underline-offset-2 hover:text-slate-800 dark:hover:text-slate-200">
              NIST AI RMF (GenAI)
            </Link>
            .
          </p>
        </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
