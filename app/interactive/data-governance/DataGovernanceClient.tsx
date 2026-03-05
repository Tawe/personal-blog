'use client'

import Image from 'next/image'
import Link from 'next/link'
import { HTMLAttributes, ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { Button } from '@/components/ui/button'
import { buildLinkedInShareHref, shareOrCopyUrl } from '@/lib/share-client'
import {
  ArrowDown,
  ArrowRight,
  Calendar,
  Check,
  Clock3,
  Copy,
  Linkedin,
  Share2,
  Shield,
} from 'lucide-react'

type MotionLikeProps<T> = T & {
  children?: ReactNode
  initial?: unknown
  animate?: unknown
  exit?: unknown
  transition?: unknown
  whileInView?: unknown
  viewport?: unknown
  layout?: unknown
}

function MotionSection(props: MotionLikeProps<HTMLAttributes<HTMLElement>>) {
  const {
    children,
    initial,
    animate,
    exit,
    transition,
    whileInView,
    viewport,
    layout,
    ...rest
  } = props
  void initial
  void animate
  void exit
  void transition
  void whileInView
  void viewport
  void layout
  return <section {...rest}>{children}</section>
}

function MotionArticle(props: MotionLikeProps<HTMLAttributes<HTMLElement>>) {
  const {
    children,
    initial,
    animate,
    exit,
    transition,
    whileInView,
    viewport,
    layout,
    ...rest
  } = props
  void initial
  void animate
  void exit
  void transition
  void whileInView
  void viewport
  void layout
  return <article {...rest}>{children}</article>
}

function AnimatePresence({
  children,
}: {
  children: ReactNode
  mode?: 'sync' | 'wait' | 'popLayout'
}) {
  return <>{children}</>
}

const motion = {
  section: MotionSection,
  article: MotionArticle,
}

type LifecycleStep = {
  id: string
  name: string
  description: string
  whatCanGoWrong: string
  typicalTechniques: string[]
  metrics: string[]
}

type Technique = {
  id: string
  name: string
  definition: string
  whenToUse: string
  failureMode: string
  antiPattern: string
  stages: string[]
}

type GovernanceProfile = {
  id: 'low' | 'balanced' | 'high'
  label: string
  modeName: string
  speed: number
  risk: number
  auditability: number
  devFriction: number
  explanation: string
  controls: string[]
}

type StageOperatingContext = {
  objective: string
  dependency: string
  firstResponse: string
}

type StageId =
  | 'sources'
  | 'ingestion'
  | 'processing'
  | 'storage'
  | 'enrichment'
  | 'serving'
  | 'monitoring'
  | 'governance'

type ScenarioPreset = 'custom' | 'healthcare' | 'ecommerce' | 'fraud'
type AtlasViewTab = 'techniques' | 'architecture' | 'failures' | 'governance'

type SystemContextBarProps = {
  activeStageId: StageId
  stages: LifecycleStep[]
  onStageChange: (stageId: StageId) => void
  scenarioPreset: ScenarioPreset
  onScenarioChange: (preset: ScenarioPreset) => void
  isUpdated: boolean
  notice: string
}

// CHANGE: Sticky global context controls so stage can be changed from any section.
function SystemContextBar({
  activeStageId,
  stages,
  onStageChange,
  scenarioPreset,
  onScenarioChange,
  isUpdated,
  notice,
}: SystemContextBarProps) {
  const activeStageName = stages.find((stage) => stage.id === activeStageId)?.name ?? activeStageId

  return (
    <div
      aria-label="System Context"
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur transition-colors dark:border-slate-800 dark:bg-slate-950/90 ${
        isUpdated ? 'shadow-[0_2px_0_0_rgba(37,99,235,0.45)]' : ''
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 py-3 md:px-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Choose a lifecycle: {activeStageName}</p>
            <p className="max-w-3xl text-xs text-slate-600 dark:text-slate-300">
              This lifecycle anchor sets the system context. Every view below adapts to show expected architecture, likely breakpoints, and recommended controls at this point.
            </p>
            {notice ? (
              <span className="inline-flex rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-900 dark:bg-blue-900/50 dark:text-blue-100">
                {notice}
              </span>
            ) : null}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400" htmlFor="scenario-preset-desktop">
              Scenario
            </label>
            <select
              id="scenario-preset-desktop"
              value={scenarioPreset}
              onChange={(event) => onScenarioChange(event.target.value as ScenarioPreset)}
              className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="custom">Custom</option>
              <option value="healthcare">Healthcare (PHI)</option>
              <option value="ecommerce">E-commerce analytics</option>
              <option value="fraud">Real-time fraud</option>
            </select>
          </div>
        </div>

        <div className="mt-3 hidden md:block">
          <div role="tablist" aria-label="Lifecycle stage selector" className="flex items-center gap-2 overflow-x-auto pb-1">
            {stages.map((stage) => {
              const selected = stage.id === activeStageId
              return (
                <button
                  key={stage.id}
                  role="tab"
                  aria-selected={selected}
                  type="button"
                  onClick={() => onStageChange(stage.id as StageId)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                    selected
                      ? 'border-blue-700 bg-blue-700 text-white dark:border-blue-500 dark:bg-blue-600'
                      : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {stage.name}
                </button>
              )
            })}
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Scenario presets load a realistic operating posture (stage, architecture baseline, likely failures, and governance level). Yellow stages show where risk typically propagates for that scenario. You can still tune every control afterward.
          </p>
        </div>

        <div className="mt-3 space-y-2 md:hidden">
          <div className="flex items-center gap-2">
            <select
              id="scenario-preset-mobile"
              value={scenarioPreset}
              onChange={(event) => onScenarioChange(event.target.value as ScenarioPreset)}
              aria-label="Scenario preset"
              className="ml-auto rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="custom">Custom</option>
              <option value="healthcare">Healthcare (PHI)</option>
              <option value="ecommerce">E-commerce analytics</option>
              <option value="fraud">Real-time fraud</option>
            </select>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Scenario presets set a starting context across the atlas. You can fine-tune everything after applying one.
          </p>
          <select
            id="stage-selector-mobile"
            value={activeStageId}
            onChange={(event) => onStageChange(event.target.value as StageId)}
            aria-label="Lifecycle stage selector"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
          >
            {stages.map((stage) => (
              <option key={stage.id} value={stage.id}>
                {stage.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

const LIFECYCLE_STEPS: LifecycleStep[] = [
  {
    id: 'sources',
    name: 'Sources',
    description: 'Operational systems, SaaS tools, files, and event streams that originate data.',
    whatCanGoWrong: 'Undefined data contracts let breaking source changes ship without notice; ingestion failures spike the next release cycle.',
    typicalTechniques: ['Source contracts', 'Schema registry', 'Data profiling'],
    metrics: ['Source coverage', 'Contract violation rate', 'Schema change frequency', 'Null rate by source'],
  },
  {
    id: 'ingestion',
    name: 'Ingestion',
    description: 'Moves raw records from producers into landing zones with basic validation.',
    whatCanGoWrong: 'Late arrivals and dropped retries silently reduce completeness; downstream teams trust totals that are already wrong.',
    typicalTechniques: ['CDC', 'Idempotent loaders', 'Dead-letter queues'],
    metrics: ['Ingest lag', 'Retry success rate', 'Dropped message count', 'DLQ backlog age'],
  },
  {
    id: 'processing',
    name: 'Processing',
    description: 'Transforms and standardizes data into trustworthy analytical or operational forms.',
    whatCanGoWrong: 'Business logic forks across teams; two pipelines produce different answers for the same KPI.',
    typicalTechniques: ['Reusable transforms', 'Data tests', 'Contract tests'],
    metrics: ['Job success rate', 'Transform test pass rate', 'Transformation latency', 'Breaking change rate'],
  },
  {
    id: 'storage',
    name: 'Storage',
    description: 'Persists curated datasets with partitioning, indexing, and lifecycle policies.',
    whatCanGoWrong: 'Poor partitioning and retention planning drives cost spikes and stale read patterns.',
    typicalTechniques: ['Partition tuning', 'Table optimization', 'Tiered storage'],
    metrics: ['Query latency p95', 'Storage growth rate', 'Cost per TB queried', 'Expired-data deletion rate'],
  },
  {
    id: 'enrichment',
    name: 'Enrichment',
    description: 'Adds business context, reference data, and feature derivations for consumption.',
    whatCanGoWrong: 'Bad join keys create fan-out duplicates; customer and revenue logic diverge by channel.',
    typicalTechniques: ['Reference mastering', 'Entity resolution', 'Feature validation'],
    metrics: ['Match precision/recall', 'Duplicate ratio', 'Feature drift', 'Stewardship queue age'],
  },
  {
    id: 'serving',
    name: 'Serving',
    description: 'Exposes trustworthy data products through APIs, dashboards, search, or vector services.',
    whatCanGoWrong: 'Producer and consumer SLAs drift; clients cache around unstable contracts and incidents become user-visible.',
    typicalTechniques: ['Semantic layer', 'Caching strategy', 'Versioned interfaces'],
    metrics: ['API error rate', 'Read latency p95', 'Consumer SLA breach count', 'Contract deprecation lead time'],
  },
  {
    id: 'monitoring',
    name: 'Monitoring',
    description: 'Observes quality, freshness, reliability, and usage across the pipeline.',
    whatCanGoWrong: 'Alerts without an owner become noise; MTTR rises and the same incident repeats.',
    typicalTechniques: ['Data observability', 'Anomaly detection', 'Runbook escalation'],
    metrics: ['MTTD', 'MTTR', 'Data incident volume', '% alerts with assigned owner'],
  },
  {
    id: 'governance',
    name: 'Governance',
    description: 'Applies policy for security, compliance, lineage, retention, and accountability.',
    whatCanGoWrong: 'Manual controls are bypassed under delivery pressure; audit gaps surface during incidents, not before them.',
    typicalTechniques: ['Policy-as-code', 'Column-level access', 'Lineage + audit trails'],
    metrics: ['Audit completeness', 'Policy violations', 'Access review completion'],
  },
]

const TYPICAL_TECHNIQUE_NOTES: Record<string, string> = {
  'Source contracts': 'Define producer/consumer expectations before schema changes ship.',
  'Schema registry': 'Version and validate schemas so incompatible events are blocked early.',
  'Data profiling': 'Baseline distributions to catch null spikes, type drift, and outliers.',
  CDC: 'Capture source-of-truth changes incrementally with ordering guarantees.',
  'Idempotent loaders': 'Make retries safe so duplicate writes do not corrupt totals.',
  'Dead-letter queues': 'Isolate bad events for triage instead of halting ingestion.',
  'Reusable transforms': 'Standardize business logic once to avoid KPI drift across teams.',
  'Data tests': 'Assert row-level and aggregate expectations in each run.',
  'Contract tests': 'Verify upstream/downstream interfaces before deployments merge.',
  'Partition tuning': 'Align partition keys to query paths for lower scan costs.',
  'Table optimization': 'Compact, sort, and index data for predictable read performance.',
  'Tiered storage': 'Move older data to cheaper tiers while preserving access needs.',
  'Reference mastering': 'Maintain trusted reference entities used across domains.',
  'Entity resolution': 'Match records that refer to the same real-world entity.',
  'Feature validation': 'Check derived fields for drift and leakage before serving.',
  'Semantic layer': 'Expose shared business definitions so users query consistent metrics.',
  'Caching strategy': 'Control freshness and load with explicit cache invalidation rules.',
  'Versioned interfaces': 'Evolve APIs safely without breaking existing consumers.',
  'Data observability': 'Track freshness, volume, schema, and quality regressions continuously.',
  'Anomaly detection': 'Surface unusual shifts before they become customer-facing incidents.',
  'Runbook escalation': 'Route incidents to owners with clear remediation steps.',
  'Policy-as-code': 'Encode governance rules so checks run automatically in delivery flow.',
  'Column-level access': 'Enforce least privilege on sensitive fields and attributes.',
  'Lineage + audit trails': 'Preserve traceability from source to consumer for audits.',
}

const STAGE_OPERATING_CONTEXT: Record<StageId, StageOperatingContext> = {
  sources: {
    objective: 'Keep source contracts stable so downstream ingestion is predictable release to release.',
    dependency: 'Depends on producer ownership and explicit schema/version communication.',
    firstResponse: 'When breakage appears, freeze ingest-on-fail sources and enforce contract validation gates.',
  },
  ingestion: {
    objective: 'Land complete, ordered, replay-safe records before transformation begins.',
    dependency: 'Depends on idempotency, retry policy, and DLQ ownership.',
    firstResponse: 'If lag or drops rise, check retry saturation, queue depth, and poison-message isolation first.',
  },
  processing: {
    objective: 'Produce consistent business logic outputs that teams can trust for shared KPIs.',
    dependency: 'Depends on versioned transforms, test coverage, and release discipline.',
    firstResponse: 'When metrics diverge, compare transform versions and rollback unverified logic forks.',
  },
  storage: {
    objective: 'Maintain query performance and retention compliance without runaway cost growth.',
    dependency: 'Depends on partition strategy, compaction cadence, and deletion automation.',
    firstResponse: 'If latency or cost spikes, inspect partition skew, table bloat, and expired-data backlog.',
  },
  enrichment: {
    objective: 'Add trusted business context without introducing match or join distortion.',
    dependency: 'Depends on reference quality, entity resolution precision, and stewardship throughput.',
    firstResponse: 'When duplicates surge, validate join keys and inspect unresolved stewardship queues.',
  },
  serving: {
    objective: 'Deliver stable contracts with predictable freshness and latency to consumers.',
    dependency: 'Depends on interface versioning, cache policy, and clear consumer SLAs.',
    firstResponse: 'If consumer incidents rise, check contract drift, cache invalidation, and p95 latency regressions.',
  },
  monitoring: {
    objective: 'Detect data incidents early and route them to owners with actionable context.',
    dependency: 'Depends on alert ownership, runbooks, and signal quality.',
    firstResponse: 'When alert noise spikes, prune low-signal checks and enforce owner + runbook requirements.',
  },
  governance: {
    objective: 'Enforce policy consistently so compliance and reliability hold under delivery pressure.',
    dependency: 'Depends on policy automation, audit completeness, and access review cadence.',
    firstResponse: 'If policy violations increase, prioritize high-risk controls and close audit gaps before release.',
  },
}

const TECHNIQUES: Technique[] = [
  {
    id: 'mdm',
    name: 'MDM',
    definition: 'Master Data Management creates authoritative records for core entities such as customer or product.',
    whenToUse: 'Use when many systems must agree on key entities and reference values.',
    failureMode: 'Golden records become stale if stewardship workflows are weak.',
    antiPattern: 'Treating MDM like a one-time cleanup project with no ongoing stewardship.',
    stages: ['sources', 'enrichment', 'governance'],
  },
  {
    id: 'entity-resolution',
    name: 'Entity Resolution',
    definition: 'Matches records that represent the same real-world entity across systems.',
    whenToUse: 'Use during integration when IDs are inconsistent or missing.',
    failureMode: 'Aggressive matching merges distinct entities and corrupts trust.',
    antiPattern: 'Using a single fuzzy-threshold globally without precision/recall tuning by domain.',
    stages: ['ingestion', 'processing', 'enrichment'],
  },
  {
    id: 'deduplication',
    name: 'Deduplication',
    definition: 'Detects and removes repeated records to preserve analytic and operational correctness.',
    whenToUse: 'Use where event replay, retries, or fan-out joins create duplicate rows.',
    failureMode: 'Weak keys hide duplicate clusters and inflate counts.',
    antiPattern: 'Deduping only at ingest and assuming downstream joins cannot reintroduce duplicates.',
    stages: ['ingestion', 'processing', 'monitoring'],
  },
  {
    id: 'canonical-model',
    name: 'Canonical Model',
    definition: 'Defines a stable, shared schema abstraction over heterogeneous source structures.',
    whenToUse: 'Use when multiple teams produce and consume the same domains.',
    failureMode: 'Schema governance lags behind product changes, causing fragmentation.',
    antiPattern: 'Creating a canonical model once and never versioning it with domain evolution.',
    stages: ['sources', 'processing', 'serving'],
  },
  {
    id: 'lineage',
    name: 'Lineage',
    definition: 'Tracks how data moves and transforms from origin to consumption.',
    whenToUse: 'Use for root-cause analysis, impact assessments, and audits.',
    failureMode: 'Lineage gaps around manual steps make incident analysis incomplete.',
    antiPattern: 'Capturing lineage visually in docs but not generating it from runtime metadata.',
    stages: ['processing', 'monitoring', 'governance'],
  },
  {
    id: 'access-control',
    name: 'Access Control',
    definition: 'Restricts who can read or modify data based on role, context, and sensitivity.',
    whenToUse: 'Use whenever data contains regulated, customer, or strategic information.',
    failureMode: 'Overly broad role grants create latent exposure risk.',
    antiPattern: 'Granting broad team roles forever with no scheduled access reviews.',
    stages: ['storage', 'serving', 'governance'],
  },
  {
    id: 'retention',
    name: 'Retention',
    definition: 'Enforces data lifespan policies for legal, financial, and operational constraints.',
    whenToUse: 'Use when regulations or cost controls require explicit data expiry.',
    failureMode: 'Ambiguous ownership causes expired data to persist indefinitely.',
    antiPattern: 'Defining retention policy text without implementing deletion automation.',
    stages: ['storage', 'monitoring', 'governance'],
  },
  {
    id: 'privacy',
    name: 'Privacy Controls',
    definition: 'Implements masking, minimization, and consent-aware processing for personal data.',
    whenToUse: 'Use when handling PII/PHI or cross-border data flows.',
    failureMode: 'Inconsistent masking policies leak sensitive data in downstream tools.',
    antiPattern: 'Masking at dashboard level only while raw exports remain unrestricted.',
    stages: ['ingestion', 'serving', 'governance'],
  },
  {
    id: 'security-controls',
    name: 'Security Controls',
    definition: 'Implements encryption, key management, secret hygiene, and tamper-evident auditing.',
    whenToUse: 'Use for every production pipeline; elevate rigor for regulated and multi-tenant systems.',
    failureMode: 'Weak key rotation and secret sprawl create hard-to-detect breach windows.',
    antiPattern: 'Treating encryption-at-rest as “done” while skipping key lifecycle and audit verification.',
    stages: ['storage', 'serving', 'governance'],
  },
  {
    id: 'stewardship-ownership',
    name: 'Stewardship & Ownership',
    definition: 'Assigns clear ownership for data products, quality SLAs, and incident remediation.',
    whenToUse: 'Use when multiple teams depend on shared data assets and quality must be enforceable.',
    failureMode: 'Unowned datasets accumulate unresolved defects and recurring incident patterns.',
    antiPattern: 'Assuming platform teams own data meaning while domain teams own only application code.',
    stages: ['sources', 'monitoring', 'governance'],
  },
]

const GOVERNANCE_PROFILES: GovernanceProfile[] = [
  {
    id: 'low',
    label: 'Low',
    modeName: 'Startup mode',
    speed: 90,
    risk: 75,
    auditability: 35,
    devFriction: 20,
    explanation: 'Optimized for speed and experimentation, but governance debt accumulates quickly.',
    controls: ['Basic RBAC', 'Ad hoc lineage notes', 'Manual incident tracking'],
  },
  {
    id: 'balanced',
    label: 'Balanced',
    modeName: 'Product mode',
    speed: 72,
    risk: 45,
    auditability: 70,
    devFriction: 45,
    explanation: 'Targets predictable delivery with risk controls embedded into normal engineering flow.',
    controls: ['Policy templates', 'Automated quality checks', 'Lineage for critical assets'],
  },
  {
    id: 'high',
    label: 'High',
    modeName: 'Regulated mode',
    speed: 52,
    risk: 20,
    auditability: 92,
    devFriction: 72,
    explanation: 'Best for regulated domains where provable controls are more important than release velocity.',
    controls: ['Policy-as-code gates', 'Fine-grained access', 'Full audit + retention enforcement'],
  },
]

const PIPELINE_DEFAULTS_BY_STAGE: Record<StageId, { mode: 'batch' | 'streaming'; store: 'lake' | 'warehouse'; serve: 'api' | 'search' | 'vector' }> = {
  sources: { mode: 'batch', store: 'lake', serve: 'api' },
  ingestion: { mode: 'streaming', store: 'lake', serve: 'api' },
  processing: { mode: 'batch', store: 'warehouse', serve: 'api' },
  storage: { mode: 'batch', store: 'warehouse', serve: 'search' },
  enrichment: { mode: 'batch', store: 'lake', serve: 'vector' },
  serving: { mode: 'streaming', store: 'warehouse', serve: 'api' },
  monitoring: { mode: 'streaming', store: 'lake', serve: 'search' },
  governance: { mode: 'batch', store: 'warehouse', serve: 'api' },
}

const STAGE_LIKELY_FAILURES: Record<StageId, IssueKey[]> = {
  sources: ['schemaDrift'],
  ingestion: ['schemaDrift', 'staleness'],
  processing: ['duplicates', 'schemaDrift'],
  storage: ['staleness'],
  enrichment: ['duplicates'],
  serving: ['staleness', 'schemaDrift'],
  monitoring: ['staleness'],
  governance: ['schemaDrift'],
}

const STAGE_GOVERNANCE_CONTROLS: Record<StageId, string[]> = {
  sources: ['Source contract approval gates', 'Data owner assignment per source'],
  ingestion: ['PII classification at ingress', 'Replay-safe ingestion policy'],
  processing: ['Transform contract tests', 'Lineage checkpoint per critical dataset'],
  storage: ['Encryption-at-rest with key rotation', 'Retention + legal hold policy enforcement'],
  enrichment: ['Entity resolution quality thresholds', 'Reference data stewardship workflow'],
  serving: ['Token-scoped API access', 'Consumer contract version governance'],
  monitoring: ['Owned alert routing and escalation SLAs', 'Weekly incident pattern review'],
  governance: ['Policy-as-code approvals', 'Quarterly access review and audit evidence pack'],
}

const STAGE_GOVERNANCE_RECOMMENDATION: Record<StageId, GovernanceProfile['id']> = {
  sources: 'balanced',
  ingestion: 'balanced',
  processing: 'balanced',
  storage: 'high',
  enrichment: 'balanced',
  serving: 'high',
  monitoring: 'balanced',
  governance: 'high',
}

type IssueKey = 'duplicates' | 'schemaDrift' | 'staleness'

const ISSUE_IMPACTS: Record<IssueKey, { stages: StageId[]; consequence: string; penalties: Record<'freshness' | 'completeness' | 'accuracy' | 'consistency', number> }> = {
  duplicates: {
    stages: ['ingestion', 'processing', 'enrichment', 'monitoring'],
    consequence: 'Counts inflate and entity-level decisions become unreliable.',
    penalties: { freshness: 0, completeness: 6, accuracy: 18, consistency: 20 },
  },
  schemaDrift: {
    stages: ['sources', 'ingestion', 'processing', 'serving'],
    consequence: 'Pipelines break silently or produce partial payloads after upstream changes.',
    penalties: { freshness: 10, completeness: 15, accuracy: 14, consistency: 12 },
  },
  staleness: {
    stages: ['ingestion', 'storage', 'serving', 'monitoring'],
    consequence: 'Decisions are made on old data and SLA confidence drops.',
    penalties: { freshness: 30, completeness: 0, accuracy: 10, consistency: 8 },
  },
}

function scoreToTone(value: number) {
  if (value >= 80) return 'text-emerald-600 dark:text-emerald-400'
  if (value >= 60) return 'text-amber-600 dark:text-amber-400'
  return 'text-rose-600 dark:text-rose-400'
}

function stageNameById(id: string) {
  return LIFECYCLE_STEPS.find((step) => step.id === id)?.name ?? id
}

export default function DataGovernancePage() {
  const [activeStageId, setActiveStageId] = useState<StageId>('sources')
  const [techniqueFilterMode, setTechniqueFilterMode] = useState<'stage' | 'all'>('stage')
  const [pipelineMode, setPipelineMode] = useState<'batch' | 'streaming'>('batch')
  const [pipelineStore, setPipelineStore] = useState<'lake' | 'warehouse'>('lake')
  const [pipelineServe, setPipelineServe] = useState<'api' | 'search' | 'vector'>('api')
  const [issues, setIssues] = useState({ duplicates: false, schemaDrift: false, staleness: false })
  const [governanceIndex, setGovernanceIndex] = useState(1)
  const [activeViewTab, setActiveViewTab] = useState<AtlasViewTab>('techniques')
  const [scenarioPreset, setScenarioPreset] = useState<ScenarioPreset>('custom')
  const [currentUrl, setCurrentUrl] = useState('')
  const [shareState, setShareState] = useState<'idle' | 'copying' | 'copied' | 'error'>('idle')
  const [contextPulse, setContextPulse] = useState(false)
  const [contextNotice, setContextNotice] = useState('')
  const hasInitializedStageRef = useRef(false)

  const activeStage = LIFECYCLE_STEPS.find((step) => step.id === activeStageId) ?? LIFECYCLE_STEPS[0]
  const stageOperatingContext = STAGE_OPERATING_CONTEXT[activeStageId]
  const effectiveTechniqueStageFilter = techniqueFilterMode === 'stage' ? activeStageId : 'all'
  const likelyFailuresForStage = STAGE_LIKELY_FAILURES[activeStageId]
  const stageRelevantControls = STAGE_GOVERNANCE_CONTROLS[activeStageId]
  const stageRecommendedGovernance = STAGE_GOVERNANCE_RECOMMENDATION[activeStageId]

  const filteredTechniques = useMemo(() => {
    if (effectiveTechniqueStageFilter === 'all') return TECHNIQUES
    return TECHNIQUES.filter((technique) => technique.stages.includes(effectiveTechniqueStageFilter))
  }, [effectiveTechniqueStageFilter])

  const shareText = 'Data Systems Atlas'
  const linkedInShareHref = currentUrl ? buildLinkedInShareHref(currentUrl, shareText) : ''
  const xShareHref = currentUrl
    ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${shareText} ${currentUrl}`)}`
    : ''

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href)
    }
  }, [])

  useEffect(() => {
    const defaults = PIPELINE_DEFAULTS_BY_STAGE[activeStageId]
    setPipelineMode(defaults.mode)
    setPipelineStore(defaults.store)
    setPipelineServe(defaults.serve)
  }, [activeStageId])

  useEffect(() => {
    if (!hasInitializedStageRef.current) {
      hasInitializedStageRef.current = true
      return
    }
    setContextPulse(true)
    setContextNotice(`Context updated: ${activeStage.name}`)
    const pulseTimer = window.setTimeout(() => setContextPulse(false), 800)
    const noticeTimer = window.setTimeout(() => setContextNotice(''), 1800)
    return () => {
      window.clearTimeout(pulseTimer)
      window.clearTimeout(noticeTimer)
    }
  }, [activeStage.name, activeStageId])

  useEffect(() => {
    // CHANGE: Global keyboard navigation for rapid stage exploration.
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      const target = event.target as HTMLElement | null
      const tag = target?.tagName?.toLowerCase()
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || target?.isContentEditable) return

      const currentIndex = LIFECYCLE_STEPS.findIndex((step) => step.id === activeStageId)
      if (currentIndex < 0) return
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        const prevIndex = currentIndex === 0 ? LIFECYCLE_STEPS.length - 1 : currentIndex - 1
        setActiveStageId(LIFECYCLE_STEPS[prevIndex].id as StageId)
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        const nextIndex = currentIndex === LIFECYCLE_STEPS.length - 1 ? 0 : currentIndex + 1
        setActiveStageId(LIFECYCLE_STEPS[nextIndex].id as StageId)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeStageId])

  const simulator = useMemo(() => {
    const base = { freshness: 100, completeness: 100, accuracy: 100, consistency: 100 }
    const impacts = Object.entries(issues).filter(([, on]) => on)

    impacts.forEach(([issueKey]) => {
      const issue = ISSUE_IMPACTS[issueKey as IssueKey]
      base.freshness = Math.max(0, base.freshness - issue.penalties.freshness)
      base.completeness = Math.max(0, base.completeness - issue.penalties.completeness)
      base.accuracy = Math.max(0, base.accuracy - issue.penalties.accuracy)
      base.consistency = Math.max(0, base.consistency - issue.penalties.consistency)
    })

    const impactedStages = Array.from(
      new Set(
        impacts.flatMap(([issueKey]) => ISSUE_IMPACTS[issueKey as IssueKey].stages),
      ),
    ) as StageId[]

    const consequences = impacts.map(
      ([issueKey]) => ISSUE_IMPACTS[issueKey as IssueKey].consequence,
    )

    return { metrics: base, impactedStages, consequences }
  }, [issues])

  const pipelineSummary = useMemo(() => {
    const modeText = pipelineMode === 'batch' ? 'Batch ingest' : 'Streaming ingest'
    const storeText = pipelineStore === 'lake' ? 'Lake storage' : 'Warehouse storage'
    const serveText =
      pipelineServe === 'api'
        ? 'API serving'
        : pipelineServe === 'search'
          ? 'Search serving'
          : 'Vector serving'

    let bestFor = 'Operational reporting with controlled change windows.'
    let tradeoffs = 'Higher latency but simpler cost management and reproducibility.'
    let recommendedGovernance: GovernanceProfile['id'] = 'balanced'

    if (pipelineMode === 'streaming' && pipelineServe === 'api') {
      bestFor = 'Real-time product telemetry and near-live operational actions.'
      tradeoffs = 'Requires stronger observability and replay strategy to avoid drift.'
      recommendedGovernance = 'balanced'
    }

    if (pipelineMode === 'streaming' && pipelineServe === 'vector') {
      bestFor = 'Low-latency retrieval systems where freshness and semantic relevance matter.'
      tradeoffs = 'Embedding lifecycle complexity and privacy controls are harder to operationalize.'
      recommendedGovernance = 'high'
    }

    if (pipelineStore === 'warehouse' && pipelineServe === 'search') {
      bestFor = 'Curated BI + enterprise search experiences with governed taxonomies.'
      tradeoffs = 'Schema evolution is safer but onboarding new data sources is slower.'
      recommendedGovernance = 'high'
    }

    if (pipelineMode === 'batch' && pipelineStore === 'lake' && pipelineServe === 'api') {
      bestFor = 'Cost-efficient internal analytics APIs with moderate freshness requirements.'
      tradeoffs = 'Simple operations, but stale outputs can impact downstream consumers.'
      recommendedGovernance = 'balanced'
    }

    return {
      nodes: ['Sources', modeText, storeText, serveText],
      bestFor,
      tradeoffs,
      recommendedGovernance,
    }
  }, [pipelineMode, pipelineStore, pipelineServe])

  const governanceProfile = GOVERNANCE_PROFILES[governanceIndex]

  const highlightStages = new Set<StageId>(simulator.impactedStages)

  function scrollToSection(id: string) {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  function applyLikelyFailuresForStage() {
    const nextIssues = { duplicates: false, schemaDrift: false, staleness: false }
    likelyFailuresForStage.forEach((issueKey) => {
      nextIssues[issueKey] = true
    })
    setIssues(nextIssues)
  }

  function applyScenarioPreset(nextPreset: ScenarioPreset) {
    setScenarioPreset(nextPreset)
    if (nextPreset === 'custom') return

    if (nextPreset === 'healthcare') {
      setActiveStageId('governance')
      setTechniqueFilterMode('stage')
      setPipelineMode('batch')
      setPipelineStore('warehouse')
      setPipelineServe('api')
      setGovernanceIndex(2)
      setIssues({ duplicates: false, schemaDrift: true, staleness: false })
      return
    }

    if (nextPreset === 'ecommerce') {
      setActiveStageId('serving')
      setTechniqueFilterMode('stage')
      setPipelineMode('batch')
      setPipelineStore('warehouse')
      setPipelineServe('search')
      setGovernanceIndex(1)
      setIssues({ duplicates: false, schemaDrift: false, staleness: true })
      return
    }

    setActiveStageId('monitoring')
    setTechniqueFilterMode('stage')
    setPipelineMode('streaming')
    setPipelineStore('lake')
    setPipelineServe('api')
    setGovernanceIndex(2)
    setIssues({ duplicates: true, schemaDrift: false, staleness: true })
  }

  async function handleShare() {
    if (!currentUrl) return
    setShareState('copying')
    try {
      const result = await shareOrCopyUrl(shareText, currentUrl)
      setShareState(result === 'shared' || result === 'copied' ? 'copied' : 'error')
    } catch (_error) {
      setShareState('error')
    } finally {
      window.setTimeout(() => setShareState('idle'), 2000)
    }
  }

  function getShareButtonContent() {
    if (shareState === 'copying') {
      return (
        <>
          <Copy className="mr-2 h-4 w-4 animate-pulse" />
          Copying...
        </>
      )
    }
    if (shareState === 'copied') {
      return (
        <>
          <Check className="mr-2 h-4 w-4 text-green-400" />
          Copied!
        </>
      )
    }
    if (shareState === 'error') {
      return (
        <>
          <Share2 className="mr-2 h-4 w-4 text-red-400" />
          Try again
        </>
      )
    }
    return (
      <>
        <Share2 className="mr-2 h-4 w-4" />
        Share
      </>
    )
  }

  const headerPulseClass = contextPulse
    ? 'rounded-lg bg-blue-50/80 px-2 py-1 transition-colors dark:bg-blue-950/30'
    : ''

  return (
    <div className="flex min-h-screen flex-col bg-[#F6F8FA] text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <SiteHeader />
      <main className="flex-1 pb-40 md:pb-44">
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
                          className="rounded-sm transition-colors hover:text-text-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                          Interactive
                        </Link>
                      </li>
                      <li aria-hidden="true">/</li>
                      <li aria-current="page" className="text-text-muted">
                        Data Governance
                      </li>
                    </ol>
                  </nav>
                  <h1 className="text-4xl font-bold leading-tight text-text-strong lg:text-5xl">
                    Data Systems Atlas
                  </h1>
                  <p className="text-2xl font-medium text-text-body">
                    How Data Moves, Breaks, and Gets Governed
                  </p>
                  <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                    Explore the lifecycle of modern data systems — from source ingestion to governance controls. Trace how ingestion, modeling, and serving decisions affect quality, latency, and risk. Compare patterns before they become production incidents.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Button onClick={() => scrollToSection('section-a')}>
                    Start exploring
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-text-muted hover:text-text-strong !hover:bg-transparent !active:bg-transparent !focus-visible:bg-transparent"
                    onClick={handleShare}
                    disabled={shareState === 'copying'}
                  >
                    {getShareButtonContent()}
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
                    <time dateTime="2026-03-04">March 4, 2026</time>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4" />
                    <span>11 min read</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="relative overflow-hidden rounded-xl border border-[#D6DEE6] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.18)]">
                  <div className="relative aspect-[16/10] w-full md:aspect-[16/11]">
                    <Image
                      src="/datasystemsatlas.png"
                      alt="Data Systems Atlas hero preview"
                      fill
                      priority
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <button
                  type="button"
                  onClick={() => scrollToSection('section-a')}
                  className="inline-flex items-center gap-2 rounded-full border border-[#D6DEE6] bg-white/92 px-3 py-1.5 text-xs font-medium text-[#445561] shadow-sm transition-colors hover:bg-[#F8FBFD]"
                >
                  Scroll
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* CHANGE: Guided orientation block that sets exploration expectations before interaction. */}
        <section className="border-b border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="mx-auto max-w-7xl px-4 py-5 md:px-6">
            <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">How to explore this atlas</h2>
              <ol className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-200">
                <li>1. Choose a lifecycle stage.</li>
                <li>2. The atlas recalibrates around that stage: techniques, architecture defaults, likely failures, and controls.</li>
                <li>3. Use the views to decide what to implement, monitor, and own at that operating point.</li>
              </ol>
            </div>
          </div>
        </section>

        <SystemContextBar
          activeStageId={activeStageId}
          stages={LIFECYCLE_STEPS}
          onStageChange={setActiveStageId}
          scenarioPreset={scenarioPreset}
          onScenarioChange={applyScenarioPreset}
          isUpdated={contextPulse}
          notice={contextNotice}
        />

        <div id="explore" className="mx-auto mt-6 max-w-7xl px-4 md:px-6">
          <p className="mb-4 text-sm text-[#445561] dark:text-slate-300">
            Select a lifecycle to inspect the full operating picture at that point in the system: implementation techniques, architecture defaults, leading failure risks, and governance controls.
          </p>
          <div className="min-w-0 space-y-6">
            <motion.section
              id="section-a"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              className="scroll-mt-56 md:scroll-mt-52 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-6"
            >
              <header className={`mb-4 flex items-center gap-2 ${headerPulseClass}`}>
                <h2 className="text-xl font-semibold">Data Lifecycle</h2>
                <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-900 dark:bg-blue-900/50 dark:text-blue-100">
                  {activeStage.name}
                </span>
              </header>
              <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                Why this matters: lifecycle is the backbone of the operating model. The selected point drives recommendations across architecture, quality, and governance views.
              </p>
              <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-700 dark:bg-slate-800/40">
                <p className="font-medium text-slate-800 dark:text-slate-100">How to read this lifecycle map</p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
                  <span className="inline-flex items-center gap-1">
                    <span className="h-3 w-3 rounded-sm bg-blue-600" aria-hidden="true" />
                    Active stage
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="h-3 w-3 rounded-sm bg-amber-200 ring-1 ring-amber-400" aria-hidden="true" />
                    Impacted by current quality/scenario settings
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="h-3 w-3 rounded-sm bg-slate-300 ring-1 ring-slate-400" aria-hidden="true" />
                    Not currently flagged
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Scenario presets can highlight multiple stages because incidents rarely stay local; defects usually propagate downstream across the lifecycle.
                </p>
              </div>
              <div className="pb-2">
                <svg viewBox="0 0 980 84" role="img" aria-label="Lifecycle flow diagram" className="h-auto w-full">
                  {LIFECYCLE_STEPS.map((step, index) => {
                    const x = 20 + index * 120
                    const active = step.id === activeStageId
                    const impacted = highlightStages.has(step.id as StageId)
                    return (
                      <g key={step.id}>
                        {index < LIFECYCLE_STEPS.length - 1 ? (
                          <line x1={x + 96} y1={42} x2={x + 120} y2={42} stroke={active ? '#2563eb' : '#94a3b8'} strokeWidth="2" />
                        ) : null}
                        <rect
                          x={x}
                          y={18}
                          width="96"
                          height="48"
                          rx="12"
                          fill={active ? '#1d4ed8' : impacted ? '#fef3c7' : '#e2e8f0'}
                          stroke={active ? '#1e40af' : impacted ? '#f59e0b' : '#94a3b8'}
                          strokeWidth={active ? 2 : 1}
                        />
                        <text
                          x={x + 48}
                          y={46}
                          textAnchor="middle"
                          fill={active ? '#ffffff' : '#0f172a'}
                          style={{ fontSize: '11px', fontWeight: 600 }}
                        >
                          {step.name}
                        </text>
                      </g>
                    )
                  })}
                </svg>
              </div>

              <div className="mt-4">
                <AnimatePresence mode="wait">
                  <motion.article
                    key={activeStage.id}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.2 }}
                    className="p-4"
                  >
                    <h3 className="text-lg font-semibold">{activeStage.name}</h3>
                    <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{activeStage.description}</p>
                    <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-700 dark:bg-slate-800/40">
                      <p>
                        <span className="font-semibold">Operational objective:</span> {stageOperatingContext.objective}
                      </p>
                      <p className="mt-2">
                        <span className="font-semibold">Key dependency:</span> {stageOperatingContext.dependency}
                      </p>
                      <p className="mt-2">
                        <span className="font-semibold">First response when this stage degrades:</span>{' '}
                        {stageOperatingContext.firstResponse}
                      </p>
                    </div>
                    <div className="mt-3 space-y-3 text-sm">
                      <p>
                        <span className="font-semibold text-rose-700 dark:text-rose-300">What can go wrong:</span>{' '}
                        {activeStage.whatCanGoWrong}
                      </p>
                      <div>
                        <p className="font-semibold">Typical techniques:</p>
                        <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">These controls are commonly used here to reduce repeat incidents and stabilize handoffs to downstream stages.</p>
                        <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                          {activeStage.typicalTechniques.map((item) => (
                            <li key={item} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900">
                              <p className="font-semibold text-slate-900 dark:text-slate-100">{item}</p>
                              <p className="mt-1 text-slate-600 dark:text-slate-300">
                                {TYPICAL_TECHNIQUE_NOTES[item] ?? 'Common control used at this lifecycle point.'}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <p>
                        <span className="font-semibold">Signals to watch:</span> {activeStage.metrics.join(' • ')}
                      </p>
                    </div>
                  </motion.article>
                </AnimatePresence>
              </div>
            </motion.section>

            <section
              id="stage-views"
              className="scroll-mt-56 md:scroll-mt-52 rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-4"
            >
              <div className="flex flex-wrap gap-2" role="tablist" aria-label="Stage exploration views">
                {([
                  ['techniques', 'Techniques'],
                  ['architecture', 'Architecture'],
                  ['failures', 'Failures'],
                  ['governance', 'Governance'],
                ] as const).map(([tabId, label]) => {
                  const selected = activeViewTab === tabId
                  return (
                    <button
                      key={tabId}
                      role="tab"
                      aria-selected={selected}
                      type="button"
                      onClick={() => setActiveViewTab(tabId)}
                      className={`rounded-lg border px-3 py-1.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                        selected
                          ? 'border-blue-700 bg-blue-700 text-white dark:border-blue-500 dark:bg-blue-600'
                          : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
            </section>

            <motion.section
              id="section-b"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              className={`scroll-mt-56 md:scroll-mt-52 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-6 ${
                activeViewTab === 'techniques' ? '' : 'hidden'
              }`}
            >
              <header className={`mb-4 flex items-center gap-2 ${headerPulseClass}`}>
                <h2 className="text-xl font-semibold">Techniques used at this stage</h2>
                <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-900 dark:bg-blue-900/50 dark:text-blue-100">
                  {activeStage.name}
                </span>
              </header>
              <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                Why this matters: stage-aware techniques reduce the specific failure patterns most likely to occur at this point in the lifecycle.
              </p>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <label htmlFor="tech-filter" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Filter by lifecycle stage
                </label>
                <select
                  id="tech-filter"
                  value={techniqueFilterMode}
                  onChange={(event) => setTechniqueFilterMode(event.target.value as 'stage' | 'all')}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                >
                  <option value="stage">Selected stage: {activeStage.name}</option>
                  <option value="all">All stages</option>
                </select>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {filteredTechniques.map((technique) => (
                  <motion.article
                    key={technique.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/40"
                  >
                    <h3 className="text-base font-semibold">{technique.name}</h3>
                    <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{technique.definition}</p>
                    <p className="mt-2 text-sm">
                      <span className="font-semibold">When to use:</span> {technique.whenToUse}
                    </p>
                    <p className="mt-2 text-sm text-rose-800 dark:text-rose-200">
                      <span className="font-semibold">Common failure mode:</span> {technique.failureMode}
                    </p>
                    <p className="mt-2 text-sm text-amber-800 dark:text-amber-200">
                      <span className="font-semibold">Anti-pattern:</span> {technique.antiPattern}
                    </p>
                    <details className="mt-3 rounded-md border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
                      <summary className="cursor-pointer text-sm font-medium">Learn more: linked lifecycle stages</summary>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {technique.stages.map((stageId) => (
                          <button
                            key={`${technique.id}-${stageId}`}
                            type="button"
                            onClick={() => {
                              setActiveStageId(stageId as StageId)
                              scrollToSection('section-a')
                            }}
                            className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-900 hover:bg-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-blue-900/50 dark:text-blue-100 dark:hover:bg-blue-900"
                          >
                            {stageNameById(stageId)}
                          </button>
                        ))}
                      </div>
                    </details>
                  </motion.article>
                ))}
              </div>
            </motion.section>

            <motion.section
              id="section-c"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              className={`scroll-mt-56 md:scroll-mt-52 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-6 ${
                activeViewTab === 'architecture' ? '' : 'hidden'
              }`}
            >
              <header className={`mb-4 flex items-center gap-2 ${headerPulseClass}`}>
                <h2 className="text-xl font-semibold">Typical architecture at this stage</h2>
                <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-900 dark:bg-blue-900/50 dark:text-blue-100">
                  {activeStage.name}
                </span>
              </header>
              <p className="mb-4 text-sm font-medium text-slate-700 dark:text-slate-200">
                Why this matters: architecture choices set the latency, cost, and recoverability envelope for this lifecycle point.
              </p>

              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr),minmax(0,1.2fr)]">
                <form className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/40">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Preselected for stage: {activeStage.name}
                  </p>
                  <label className="text-sm font-medium" htmlFor="mode-select">
                    Ingestion mode
                  </label>
                  <select
                    id="mode-select"
                    value={pipelineMode}
                    onChange={(event) => setPipelineMode(event.target.value as 'batch' | 'streaming')}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                  >
                    <option value="batch">Batch</option>
                    <option value="streaming">Streaming</option>
                  </select>

                  <label className="text-sm font-medium" htmlFor="store-select">
                    Core storage
                  </label>
                  <select
                    id="store-select"
                    value={pipelineStore}
                    onChange={(event) => setPipelineStore(event.target.value as 'lake' | 'warehouse')}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                  >
                    <option value="lake">Lake</option>
                    <option value="warehouse">Warehouse</option>
                  </select>

                  <label className="text-sm font-medium" htmlFor="serve-select">
                    Serving interface
                  </label>
                  <select
                    id="serve-select"
                    value={pipelineServe}
                    onChange={(event) => setPipelineServe(event.target.value as 'api' | 'search' | 'vector')}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                  >
                    <option value="api">API</option>
                    <option value="search">Search Index</option>
                    <option value="vector">Vector Index</option>
                  </select>
                </form>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/40">
                  <svg viewBox="0 0 640 140" className="w-full" role="img" aria-label="Pipeline diagram">
                    {pipelineSummary.nodes.map((node, index) => {
                      const x = 20 + index * 155
                      return (
                        <g key={node}>
                          {index < pipelineSummary.nodes.length - 1 ? (
                            <line x1={x + 130} y1={70} x2={x + 155} y2={70} stroke="#64748b" strokeWidth="2" />
                          ) : null}
                          <rect x={x} y={40} rx={12} width={130} height={60} fill="#dbeafe" stroke="#2563eb" />
                          <text x={x + 65} y={74} textAnchor="middle" fill="#1e3a8a" style={{ fontWeight: 600, fontSize: '12px' }}>
                            {node}
                          </text>
                        </g>
                      )
                    })}
                  </svg>

                  <div className="mt-4 space-y-2 text-sm">
                    <p>
                      <span className="font-semibold">Best for:</span> {pipelineSummary.bestFor}
                    </p>
                    <p>
                      <span className="font-semibold">Tradeoffs:</span> {pipelineSummary.tradeoffs}
                    </p>
                    <p className="inline-flex items-center gap-2 rounded-md bg-blue-100 px-2 py-1 text-blue-900 dark:bg-blue-900/50 dark:text-blue-100">
                      <Shield className="h-4 w-4" aria-hidden="true" />
                      Recommended governance: {GOVERNANCE_PROFILES.find((p) => p.id === pipelineSummary.recommendedGovernance)?.label}
                    </p>
                  </div>
                </div>
              </div>
            </motion.section>

            <motion.section
              id="section-d"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              className={`scroll-mt-56 md:scroll-mt-52 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-6 ${
                activeViewTab === 'failures' ? '' : 'hidden'
              }`}
            >
              <header className={`mb-4 flex items-center gap-2 ${headerPulseClass}`}>
                <h2 className="text-xl font-semibold">Common failures at this stage</h2>
                <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-900 dark:bg-blue-900/50 dark:text-blue-100">
                  {activeStage.name}
                </span>
              </header>
              <p className="mb-4 text-sm font-medium text-slate-700 dark:text-slate-200">
                Why this matters: local defects compound as data moves downstream, so stage-specific leading signals give you earlier intervention windows.
              </p>

              <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr),minmax(0,1.1fr)]">
                <fieldset className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/40">
                  <legend className="text-sm font-semibold">Toggle quality issues</legend>
                  <div className="mt-3 rounded-md border border-blue-200 bg-blue-50 p-3 text-sm dark:border-blue-800 dark:bg-blue-950/20">
                    <p className="font-semibold text-blue-900 dark:text-blue-100">Most likely in {activeStage.name}</p>
                    <p className="mt-1 text-blue-800 dark:text-blue-200">
                      {likelyFailuresForStage.map((issueKey) => issueKey === 'schemaDrift' ? 'schema drift' : issueKey).join(' + ')}
                    </p>
                    <button
                      type="button"
                      onClick={applyLikelyFailuresForStage}
                      className="mt-2 rounded-md bg-blue-600 px-2 py-1 text-xs font-semibold text-white hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                      Apply likely failures
                    </button>
                  </div>
                  <div className="mt-3 space-y-2">
                    {([
                      ['duplicates', 'Duplicates'],
                      ['schemaDrift', 'Schema drift'],
                      ['staleness', 'Staleness'],
                    ] as const).map(([key, label]) => (
                      <label key={key} className="flex cursor-pointer items-center justify-between rounded-md border border-slate-200 bg-white p-3 text-sm dark:border-slate-700 dark:bg-slate-900">
                        <span>{label}</span>
                        <input
                          type="checkbox"
                          checked={issues[key]}
                          onChange={(event) => setIssues((prev) => ({ ...prev, [key]: event.target.checked }))}
                          className="h-4 w-4"
                        />
                      </label>
                    ))}
                  </div>

                  <details className="mt-4 rounded-md border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
                    <summary className="cursor-pointer text-sm font-medium">Learn more: impact notes</summary>
                    <ul className="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-200">
                      <li>Duplicates mainly damage accuracy and consistency.</li>
                      <li>Schema drift affects completeness, then causes downstream serving failures.</li>
                      <li>Staleness erodes freshness and can invalidate operational decisions.</li>
                    </ul>
                  </details>
                </fieldset>

                <div className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {Object.entries(simulator.metrics).map(([metric, value]) => (
                      <div key={metric} className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/40">
                        <p className="text-xs uppercase tracking-wide text-slate-500">{metric}</p>
                        <p className={`text-2xl font-semibold ${scoreToTone(value)}`}>{value}%</p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/40">
                    <h3 className="text-sm font-semibold">Consequences</h3>
                    {simulator.consequences.length ? (
                      <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-200">
                        {simulator.consequences.map((consequence) => (
                          <li key={consequence}>• {consequence}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">No major issues toggled. Baseline quality posture is healthy.</p>
                    )}
                  </div>

                  <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 dark:border-amber-700 dark:bg-amber-950/20">
                    <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                      Impacted lifecycle stages are highlighted in section A to connect quality failures back to operating points.
                    </p>
                  </div>
                </div>
              </div>
            </motion.section>

            <motion.section
              id="section-e"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              className={`scroll-mt-56 md:scroll-mt-52 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-6 ${
                activeViewTab === 'governance' ? '' : 'hidden'
              }`}
            >
              <header className={`mb-4 flex items-center gap-2 ${headerPulseClass}`}>
                <h2 className="text-xl font-semibold">Governance needed at this stage</h2>
                <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-900 dark:bg-blue-900/50 dark:text-blue-100">
                  {activeStage.name}
                </span>
              </header>
              <p className="mb-4 text-sm font-medium text-slate-700 dark:text-slate-200">
                Why this matters: governance turns policy into repeatable controls so delivery speed, reliability, and compliance can scale together.
              </p>

              <div className="grid gap-4 lg:grid-cols-[minmax(0,0.8fr),minmax(0,1.2fr)]">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/40">
                  <label htmlFor="governance-slider" className="text-sm font-medium">
                    Control posture: {governanceProfile.label} ({governanceProfile.modeName})
                  </label>
                  <input
                    id="governance-slider"
                    type="range"
                    min={0}
                    max={2}
                    step={1}
                    value={governanceIndex}
                    onChange={(event) => setGovernanceIndex(Number(event.target.value))}
                    className="mt-3 w-full"
                    aria-valuetext={governanceProfile.label}
                  />
                  <div className="mt-2 flex justify-between text-xs text-slate-500">
                    <span>Low / Startup</span>
                    <span>Balanced / Product</span>
                    <span>High / Regulated</span>
                  </div>
                  <p className="mt-3 text-sm text-slate-700 dark:text-slate-200">{governanceProfile.explanation}</p>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    Stage recommendation for {activeStage.name}: {GOVERNANCE_PROFILES.find((p) => p.id === stageRecommendedGovernance)?.label}
                  </p>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/40">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {[
                      ['Speed', governanceProfile.speed],
                      ['Risk', governanceProfile.risk],
                      ['Auditability', governanceProfile.auditability],
                      ['Developer friction', governanceProfile.devFriction],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-md border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
                        <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
                        <p className={`text-xl font-semibold ${scoreToTone(Number(value))}`}>{value}%</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 rounded-md border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
                    <h3 className="text-sm font-semibold">Recommended controls</h3>
                    <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-200">
                      {governanceProfile.controls.map((control) => (
                        <li key={control}>• {control}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4 rounded-md border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/20">
                    <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100">Most relevant controls for {activeStage.name}</h3>
                    <ul className="mt-2 space-y-1 text-sm text-blue-900 dark:text-blue-100">
                      {stageRelevantControls.map((control) => (
                        <li key={control}>• {control}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.section>
          </div>
        </div>
      </main>
      <SiteFooter />

      {/*
        How to extend:
        1) Move mock data into /lib/data-governance.ts and fetch from a CMS or API route.
        2) Extract each section into composable components for testing and reuse.
        3) Persist simulator/pipeline choices in URL params for shareable state.
        4) Add backend lineage + quality endpoints, then replace static penalties with real metrics.
      */}
    </div>
  )
}
