"use client"

import { useMemo, useState, useEffect, useCallback, useRef, type Dispatch, type ReactNode, type SetStateAction } from "react"
import Link from "next/link"
import Image from "next/image"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { shareOrCopyUrl } from "@/lib/share-client"
import {
  architectureLearningData,
  type ArchitectureContent,
  type ArchitectureId,
  type CompareFilterKey,
  type DiagramNodeInfo,
  type DiagramView,
  type ScenarioRecommendation,
} from "./data"
import { ArrowRightLeft, Gauge, Zap, AlertTriangle, Check, Copy, Share2, Linkedin, Calendar, Clock3, ArrowDown } from "lucide-react"

type TabId = ArchitectureId | "compare"

const tabs: Array<{ id: TabId; label: string }> = [
  { id: "api", label: "API-Driven" },
  { id: "message", label: "Message-Driven" },
  { id: "event", label: "Event-Driven" },
  { id: "compare", label: "Compare" },
]

const iconMap: Record<ArchitectureId, ReactNode> = {
  api: <ArrowRightLeft className="h-4 w-4" aria-hidden="true" />,
  message: <Gauge className="h-4 w-4" aria-hidden="true" />,
  event: <Zap className="h-4 w-4" aria-hidden="true" />,
}

function DiagramPanel({
  architecture,
  view,
}: {
  architecture: ArchitectureContent
  view: DiagramView
}) {
  const [selectedNodeId, setSelectedNodeId] = useState(architecture.diagram.nodes[0]?.id ?? "")

  const nodesById = useMemo(
    () => Object.fromEntries(architecture.diagram.nodes.map((n) => [n.id, n])),
    [architecture.diagram.nodes]
  )

  const selectedNode = nodesById[selectedNodeId] ?? architecture.diagram.nodes[0]

  const resolveEdgePoint = (node: DiagramNodeInfo, position: "left" | "right") => {
    const x = position === "right" ? node.x + node.w : node.x
    const y = node.y + node.h / 2
    return { x, y }
  }

  const edgePath = (from: DiagramNodeInfo, to: DiagramNodeInfo) => {
    const start = resolveEdgePoint(from, "right")
    const end = resolveEdgePoint(to, "left")
    const controlX = (start.x + end.x) / 2
    return `M ${start.x} ${start.y} C ${controlX} ${start.y}, ${controlX} ${end.y}, ${end.x} ${end.y}`
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="overflow-x-auto rounded-xl border border-slate-300/80 bg-white/90 p-3 dark:border-slate-700 dark:bg-slate-900/70">
        <svg
          viewBox="0 0 820 190"
          role="img"
          aria-label={`${architecture.name} ${view} diagram`}
          className="h-[210px] min-w-[780px] w-full"
        >
          <defs>
            <marker id={`arrow-${architecture.id}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" className="fill-slate-500 dark:fill-slate-300" />
            </marker>
          </defs>

          {architecture.diagram.edges.map((edge) => {
            const from = nodesById[edge.from]
            const to = nodesById[edge.to]
            if (!from || !to) return null

            const label = view === "failure" ? edge.failureLabel ?? edge.label : edge.happyLabel ?? edge.label
            return (
              <g key={edge.id}>
                <path
                  d={edgePath(from, to)}
                  fill="none"
                  stroke={view === "failure" ? "#c2410c" : "#334155"}
                  strokeWidth="2"
                  markerEnd={`url(#arrow-${architecture.id})`}
                  strokeDasharray={view === "failure" ? "5 4" : "0"}
                />
                <text
                  x={(from.x + to.x + from.w) / 2}
                  y={from.y - 8}
                  textAnchor="middle"
                  className="fill-slate-700 text-[11px] dark:fill-slate-300"
                >
                  {label}
                </text>
              </g>
            )
          })}

          {architecture.diagram.nodes.map((node) => {
            const isSelected = selectedNode?.id === node.id
            return (
              <g key={node.id}>
                <rect
                  x={node.x}
                  y={node.y}
                  rx="10"
                  ry="10"
                  width={node.w}
                  height={node.h}
                  fill={isSelected ? (view === "failure" ? "#fed7aa" : "#dbeafe") : "#f8fafc"}
                  stroke={isSelected ? (view === "failure" ? "#c2410c" : "#1d4ed8") : "#64748b"}
                  strokeWidth={isSelected ? "2.5" : "1.5"}
                />
                <text
                  x={node.x + node.w / 2}
                  y={node.y + node.h / 2 + 4}
                  textAnchor="middle"
                  className="fill-slate-900 text-[13px] font-medium"
                >
                  {node.label}
                </text>
              </g>
            )
          })}
        </svg>

        <div className="mt-3 flex flex-wrap gap-2" role="list" aria-label="Diagram nodes">
          {architecture.diagram.nodes.map((node) => {
            const isActive = selectedNode?.id === node.id
            return (
              <button
                key={node.id}
                type="button"
                onClick={() => setSelectedNodeId(node.id)}
                className={`rounded-md border px-3 py-1.5 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  isActive
                    ? "border-blue-600 bg-blue-100 text-blue-900 dark:border-blue-400 dark:bg-blue-950/60 dark:text-blue-100"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                }`}
                aria-pressed={isActive}
                aria-label={`Inspect ${node.label}`}
              >
                {node.label}
              </button>
            )
          })}
        </div>
      </div>

      <aside className="rounded-xl border border-slate-300/80 bg-white p-4 dark:border-slate-700 dark:bg-slate-900" aria-live="polite">
        {selectedNode ? (
          <>
            <h4 className="text-base font-semibold text-slate-900 dark:text-slate-50">{selectedNode.label}</h4>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{selectedNode.details[view].whatItDoes}</p>
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Failure modes</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-300">
                {selectedNode.details[view].failureModes.map((item) => (
                  <li key={item} className="flex gap-2">
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Scaling considerations</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
                {selectedNode.details[view].scaling.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <p className="text-sm text-slate-700 dark:text-slate-300">Select a node to inspect details.</p>
        )}
      </aside>
    </div>
  )
}

function ArchitectureSection({ architecture }: { architecture: ArchitectureContent }) {
  const [diagramView, setDiagramView] = useState<DiagramView>("happy")

  return (
    <section aria-labelledby={`${architecture.id}-title`} className="space-y-8">
      <header className="rounded-2xl border border-slate-300/80 bg-gradient-to-r from-white via-slate-50 to-blue-50 p-5 dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
        <div className="flex items-start gap-3">
          <span className="rounded-full border border-slate-300 bg-white p-2 text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200">{iconMap[architecture.id]}</span>
          <div>
            <h2 id={`${architecture.id}-title`} className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
              {architecture.name}
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{architecture.tagline}</p>
          </div>
        </div>
      </header>

      <section className="rounded-xl border border-slate-300/80 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Mental Model</h3>
        <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">{architecture.mentalModel}</p>
        <div className="mt-4 rounded-lg border border-indigo-300/70 bg-indigo-50 p-4 dark:border-indigo-900 dark:bg-indigo-950/20">
          <h4 className="text-sm font-semibold text-indigo-900 dark:text-indigo-100">Decoupling Reality</h4>
          <p className="mt-1 text-sm text-indigo-900 dark:text-indigo-100">{architecture.decouplingReality}</p>
        </div>
      </section>

      <section className="rounded-xl border border-red-300/70 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/20">
        <h3 className="text-lg font-semibold text-red-900 dark:text-red-200">Failure Shape</h3>
        <p className="mt-2 text-sm font-medium text-red-900 dark:text-red-100">{architecture.failureShape.summary}</p>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <article className="rounded-lg border border-red-300/70 bg-white p-3 dark:border-red-900/70 dark:bg-red-950/30">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-red-900 dark:text-red-200">What fails immediately</h4>
            <p className="mt-1 text-sm text-red-900 dark:text-red-100">{architecture.failureShape.immediate}</p>
          </article>
          <article className="rounded-lg border border-red-300/70 bg-white p-3 dark:border-red-900/70 dark:bg-red-950/30">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-red-900 dark:text-red-200">What fails later</h4>
            <p className="mt-1 text-sm text-red-900 dark:text-red-100">{architecture.failureShape.later}</p>
          </article>
          <article className="rounded-lg border border-red-300/70 bg-white p-3 dark:border-red-900/70 dark:bg-red-950/30">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-red-900 dark:text-red-200">What fails silently</h4>
            <p className="mt-1 text-sm text-red-900 dark:text-red-100">{architecture.failureShape.silent}</p>
          </article>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Core Components</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {architecture.coreComponents.map((component) => (
            <article key={component.name} className="rounded-xl border border-slate-300/80 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{component.name}</h4>
              <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">{component.definition}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-green-300/70 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950/20">
          <h3 className="text-lg font-semibold text-green-900 dark:text-green-200">Best At</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-green-900 dark:text-green-100">
            {architecture.bestAt.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-blue-300/70 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/20">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200">Pros</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-blue-900 dark:text-blue-100">
            {architecture.pros.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-rose-300/70 bg-rose-50 p-4 dark:border-rose-900 dark:bg-rose-950/20">
          <h3 className="text-lg font-semibold text-rose-900 dark:text-rose-200">Cons</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-rose-900 dark:text-rose-100">
            {architecture.cons.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-xl border border-amber-300/70 bg-amber-50 p-5 dark:border-amber-900 dark:bg-amber-950/20">
        <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-200">Gotchas</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-900 dark:text-amber-100">
          {architecture.gotchas.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="mt-4 rounded-lg border border-amber-300/70 bg-white p-3 dark:border-amber-900/70 dark:bg-amber-950/30">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-amber-900 dark:text-amber-200">Architectural smell</h4>
          <p className="mt-1 text-sm text-amber-900 dark:text-amber-100">{architecture.architecturalSmell}</p>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">When to Use</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {architecture.whenToUse.map((item) => (
            <article key={item.decision} className="rounded-xl border border-slate-300/80 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.decision}</h4>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Example: {item.example}</p>
            </article>
          ))}
        </div>
        <article
          className="mt-3 rounded-xl border-l-4 border-rose-700 border-y border-r border-rose-300 bg-rose-100 p-4 shadow-sm dark:border-rose-400 dark:border-y-rose-900 dark:border-r-rose-900 dark:bg-rose-950/30"
          role="note"
          aria-label="Important usage warning"
        >
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 text-rose-800 dark:text-rose-300" aria-hidden="true" />
            <div>
              <h4 className="text-sm font-semibold text-rose-900 dark:text-rose-200">Don&apos;t use this when...</h4>
              <p className="mt-2 text-sm text-rose-900 dark:text-rose-100">{architecture.dontUseWhen}</p>
            </div>
          </div>
        </article>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Scaling Playbook</h3>
        <div className="mt-3 grid gap-3 lg:grid-cols-3">
          {architecture.scalingStages.map((stage) => (
            <article key={stage.stage} className="rounded-xl border border-slate-300/80 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{stage.stage}</h4>
              <p className="mt-2 text-xs font-medium text-slate-600 dark:text-slate-400">Team context: {stage.teamContext}</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
                {stage.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Typical Stack</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {architecture.typicalStack.map((stack) => (
            <article key={stack.category} className="rounded-xl border border-slate-300/80 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{stack.category}</h4>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
                {stack.options.map((option) => (
                  <li key={option}>{option}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-slate-300/80 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Interactive Diagram</h3>
          <div className="inline-flex rounded-md border border-slate-300 p-1 dark:border-slate-700" role="group" aria-label="Diagram view toggle">
            <button
              type="button"
              onClick={() => setDiagramView("happy")}
              className={`rounded px-3 py-1.5 text-sm ${
                diagramView === "happy"
                  ? "bg-blue-600 text-white"
                  : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
              aria-pressed={diagramView === "happy"}
            >
              Happy path
            </button>
            <button
              type="button"
              onClick={() => setDiagramView("failure")}
              className={`rounded px-3 py-1.5 text-sm ${
                diagramView === "failure"
                  ? "bg-amber-600 text-white"
                  : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
              aria-pressed={diagramView === "failure"}
            >
              Failure modes
            </button>
          </div>
        </div>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Click a node to inspect behavior, failure modes, and scaling considerations.
        </p>
        <div className="mt-4">
          <DiagramPanel architecture={architecture} view={diagramView} />
        </div>
      </section>

      <section className="rounded-xl border border-slate-300/80 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Observability + Reliability</h3>
        <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          Observability burden: {architecture.observabilityBurden}
        </p>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <article className="rounded-lg border border-slate-300/80 p-4 dark:border-slate-700">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Metrics to Watch</h4>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
              {architecture.observabilityReliability.metrics.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="rounded-lg border border-slate-300/80 p-4 dark:border-slate-700">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Logging / Tracing</h4>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
              {architecture.observabilityReliability.loggingTracing.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="rounded-lg border border-slate-300/80 p-4 dark:border-slate-700">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Failure Handling</h4>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
              {architecture.observabilityReliability.failureHandling.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </section>
  )
}

function CompareView({
  selectedFilters,
  setSelectedFilters,
}: {
  selectedFilters: Record<CompareFilterKey, boolean>
  setSelectedFilters: Dispatch<SetStateAction<Record<CompareFilterKey, boolean>>>
}) {
  const activeFilters = architectureLearningData.compareFilters.filter((f) => selectedFilters[f.id])

  const scores = useMemo(() => {
    const initial = { api: 0, message: 0, event: 0 }
    for (const filter of activeFilters) {
      initial.api += filter.weights.api
      initial.message += filter.weights.message
      initial.event += filter.weights.event
    }

    return initial
  }, [activeFilters])

  const ranked = useMemo(
    () =>
      [...architectureLearningData.architectures]
        .map((arch) => ({ ...arch, score: scores[arch.id] }))
        .sort((a, b) => b.score - a.score),
    [scores]
  )

  const highest = ranked[0]?.score ?? 0
  const bestMatches = ranked.filter((r) => r.score === highest && highest > 0)

  const recommendationText =
    activeFilters.length === 0
      ? "Select constraints to get a recommendation. In practice, most systems are hybrid: synchronous APIs for command/query entry points plus messaging/events behind the boundary."
      : `${bestMatches.map((m) => m.name).join(" + ")} currently fit best for your selected constraints. ${activeFilters
          .map((f) => f.tradeoffNote)
          .join(" ")}`

  return (
    <section className="space-y-6" aria-labelledby="compare-view-title">
      <div className="rounded-xl border border-slate-300/80 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <h2 id="compare-view-title" className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
          Compare Architectures
        </h2>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
          The table is generated from the same underlying typed data used by each architecture tab.
        </p>

        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3" role="group" aria-label="Comparison filters">
          {architectureLearningData.compareFilters.map((filter) => {
            const active = selectedFilters[filter.id]
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() =>
                  setSelectedFilters((prev) => ({
                    ...prev,
                    [filter.id]: !prev[filter.id],
                  }))
                }
                className={`rounded-lg border p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  active
                    ? "border-blue-600 bg-blue-50 text-blue-900 dark:border-blue-400 dark:bg-blue-950/40 dark:text-blue-100"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                }`}
                aria-pressed={active}
                aria-label={`${active ? "Disable" : "Enable"} filter ${filter.label}`}
              >
                <p className="text-sm font-semibold">{filter.label}</p>
                <p className="mt-1 text-xs opacity-80">{filter.description}</p>
              </button>
            )
          })}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-300/80 bg-white dark:border-slate-700 dark:bg-slate-900">
        <table className="min-w-[920px] w-full border-collapse text-sm">
          <caption className="sr-only">Architecture comparison table</caption>
          <thead>
            <tr className="border-b border-slate-300 dark:border-slate-700">
              <th scope="col" className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">Dimension</th>
              {architectureLearningData.architectures.map((arch) => (
                <th key={arch.id} scope="col" className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">
                  {arch.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(Object.keys(architectureLearningData.metricLabels) as Array<keyof typeof architectureLearningData.metricLabels>).map(
              (metricKey) => (
                <tr key={metricKey} className="border-b border-slate-200 dark:border-slate-800">
                  <th scope="row" className="px-4 py-3 text-left align-top font-medium text-slate-900 dark:text-slate-100">
                    {architectureLearningData.metricLabels[metricKey]}
                  </th>
                  {architectureLearningData.architectures.map((arch) => (
                    <td key={`${metricKey}-${arch.id}`} className="px-4 py-3 align-top">
                      <p className="font-medium text-slate-900 dark:text-slate-100">{arch.compare[metricKey].value}</p>
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{arch.compare[metricKey].note}</p>
                    </td>
                  ))}
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      <section className="rounded-xl border border-slate-300/80 bg-white p-5 dark:border-slate-700 dark:bg-slate-900" aria-live="polite">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Recommendation</h3>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{recommendationText}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {ranked.map((item) => (
            <span
              key={item.id}
              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                item.score === highest && highest > 0
                  ? "border-emerald-600 bg-emerald-100 text-emerald-900 dark:border-emerald-400 dark:bg-emerald-950/40 dark:text-emerald-100"
                  : "border-slate-300 bg-slate-100 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              }`}
            >
              {item.name}: {item.score}
            </span>
          ))}
        </div>
      </section>
    </section>
  )
}

function ScenarioPicker({ scenario }: { scenario: ScenarioRecommendation }) {
  const architectureLookup = Object.fromEntries(
    architectureLearningData.architectures.map((a) => [a.id, a.name])
  ) as Record<ArchitectureId, string>

  return (
    <section className="rounded-xl border border-slate-300/80 bg-white p-5 dark:border-slate-700 dark:bg-slate-900" aria-live="polite">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Scenario Guidance</h3>
      <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
        Recommended architecture(s):{" "}
        <span className="font-semibold text-slate-900 dark:text-slate-100">
          {scenario.recommended.map((id) => architectureLookup[id]).join(" + ")}
        </span>
      </p>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <article className="rounded-lg border border-slate-300/80 p-4 dark:border-slate-700">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Reasoning</h4>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{scenario.reasoning}</p>
        </article>
        <article className="rounded-lg border border-slate-300/80 p-4 dark:border-slate-700">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Watch out for</h4>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
            {scenario.watchOutFor.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="rounded-lg border border-slate-300/80 p-4 dark:border-slate-700">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Scaling notes</h4>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
            {scenario.scalingNotes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  )
}

export default function ArchitecturePlaygroundPage() {
  const [activeTab, setActiveTab] = useState<TabId>("api")
  const [selectedScenarioId, setSelectedScenarioId] = useState(architectureLearningData.scenarios[0]?.id ?? "")
  const [shareState, setShareState] = useState<"idle" | "copying" | "copied" | "error">("idle")
  const [shareUrl, setShareUrl] = useState("")
  const firstTabButtonRef = useRef<HTMLButtonElement | null>(null)
  const [selectedFilters, setSelectedFilters] = useState<Record<CompareFilterKey, boolean>>({
    lowLatency: false,
    highThroughput: false,
    needAuditTrail: false,
    multipleConsumers: false,
    strictRequestResponse: false,
  })

  const selectedScenario =
    architectureLearningData.scenarios.find((scenario) => scenario.id === selectedScenarioId) ??
    architectureLearningData.scenarios[0]

  const currentArchitecture =
    activeTab === "compare"
      ? undefined
      : architectureLearningData.architectures.find((architecture) => architecture.id === activeTab)

  useEffect(() => {
    setShareUrl(window.location.href)
  }, [])

  const linkedInShareHref = shareUrl
    ? `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    : ""
  const xShareHref = shareUrl
    ? `https://x.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(architectureLearningData.title)}`
    : ""

  const handleShare = useCallback(async () => {
    const url = window.location.href
    const title = architectureLearningData.title
    setShareState("copying")
    try {
      const result = await shareOrCopyUrl(title, url)
      if (result === "shared") {
        setShareState("idle")
        return
      }
      setShareState("copied")
      setTimeout(() => setShareState("idle"), 2000)
    } catch {
      setShareState("error")
      setTimeout(() => setShareState("idle"), 3000)
    }
  }, [])

  const getShareButtonContent = () => {
    switch (shareState) {
      case "copying":
        return (
          <>
            <Copy className="mr-2 h-4 w-4 animate-pulse" />
            Copying...
          </>
        )
      case "copied":
        return (
          <>
            <Check className="mr-2 h-4 w-4 text-green-400" />
            Copied!
          </>
        )
      case "error":
        return (
          <>
            <Share2 className="mr-2 h-4 w-4 text-red-400" />
            Try again
          </>
        )
      default:
        return (
          <>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </>
        )
    }
  }

  const handleStartExploring = useCallback(() => {
    const exploreSection = document.getElementById("explore")
    if (!exploreSection) return

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    exploreSection.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    })

    const focusFirstTab = () => firstTabButtonRef.current?.focus()
    if (reducedMotion) {
      focusFirstTab()
      return
    }
    window.setTimeout(focusFirstTab, 520)
  }, [])

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <SiteHeader />
      <main className="pb-16">
        <section className="border-b border-[#D6DEE6] bg-white">
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
                        {architectureLearningData.title}
                      </li>
                    </ol>
                  </nav>
                  <h1 className="text-4xl lg:text-5xl font-bold text-text-strong leading-tight">
                    {architectureLearningData.title}
                  </h1>
                  <p className="text-2xl text-text-body font-medium">
                    Decision patterns for synchronous APIs, queues, and event streams
                  </p>
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
                    {getShareButtonContent()}
                  </Button>
                  {linkedInShareHref && (
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
                  )}
                  {xShareHref && (
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
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-6 text-sm text-text-muted">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <time dateTime="2026-02-22">February 22, 2026</time>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4" />
                    <span>10 min read</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="relative overflow-hidden rounded-xl border border-[#D6DEE6] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.18)]">
                  <div className="relative aspect-[16/10] md:aspect-[16/11] w-full">
                    <Image
                      src="/architecture-playground.png"
                      alt="Architecture Playground interface preview"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
              </div>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <button
                  type="button"
                  onClick={handleStartExploring}
                  className="inline-flex items-center gap-2 rounded-full border border-[#D6DEE6] bg-white/92 px-3 py-1.5 text-xs font-medium text-[#445561] shadow-sm transition-colors hover:bg-[#F8FBFD]"
                >
                  Scroll
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <nav id="explore" className="sticky top-0 z-40 border-b border-slate-300 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95" aria-label="Architecture tabs">
          <div className="mx-auto flex w-full max-w-7xl gap-2 overflow-x-auto px-4 py-2 md:px-6">
            {tabs.map((tab, index) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  ref={index === 0 ? firstTabButtonRef : undefined}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap rounded-lg border px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                    isActive
                      ? "border-blue-600 bg-blue-100 text-blue-900 dark:border-blue-400 dark:bg-blue-950/40 dark:text-blue-100"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                  }`}
                  aria-pressed={isActive}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </nav>

        <section className="mx-auto mt-6 w-full max-w-7xl space-y-8 px-4 md:px-6">
          {currentArchitecture ? (
            <ArchitectureSection architecture={currentArchitecture} />
          ) : (
            <CompareView selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters} />
          )}

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Scenario Picker</h2>
            <div className="rounded-xl border border-slate-300/80 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
              <label htmlFor="scenario-select" className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Choose a scenario
              </label>
              <select
                id="scenario-select"
                className="mt-2 w-full max-w-lg rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                value={selectedScenarioId}
                onChange={(event) => setSelectedScenarioId(event.target.value)}
                aria-label="Scenario picker"
              >
                {architectureLearningData.scenarios.map((scenario) => (
                  <option key={scenario.id} value={scenario.id}>
                    {scenario.label}
                  </option>
                ))}
              </select>
            </div>
            {selectedScenario ? <ScenarioPicker scenario={selectedScenario} /> : null}
          </section>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
