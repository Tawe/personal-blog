"use client"

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { authMethods } from "../data/authMethods"
import type { Diagram, FlowVariantId, LaneId } from "../types"

type FlowCanvasProps = {
  methodId: string
  flowId: FlowVariantId
  stepIndex: number
  overlayId: string | null
  scenarioId: string | null
  className?: string
  canvasClassName?: string
  contextEdges?: string[]
  edgeLabelOverrides?: Record<string, string>
  flowSummary?: {
    title: string
    caption: string
    note?: string | null
    callouts?: string[]
  }
}

const laneMeta: Record<LaneId, { title: string; subtitle: string }> = {
  user: { title: "User / Browser", subtitle: "Human interaction" },
  client: { title: "Client App", subtitle: "SPA / Mobile / Server" },
  auth: { title: "Auth Server / IdP", subtitle: "Auth decisions" },
  api: { title: "API / Resource", subtitle: "Protected resources" },
  store: { title: "Store", subtitle: "Session/JWKS/Introspect" },
}

const laneOrder: LaneId[] = ["user", "client", "auth", "api", "store"]
const WIDTH = 1160
const HEIGHT = 620
const HEADER_Y = 24
const LANE_Y1 = 106
const LANE_Y2 = 566

function edgeY(index: number) {
  return 168 + index * 44
}

function dimmedLanesForScenario(scenarioId: string | null, methodId: string) {
  const dimmed = new Set<LaneId>()
  if (scenarioId === "service-to-service") {
    dimmed.add("user")
  }
  if (scenarioId === "spa-public-api" && methodId === "session-cookies") {
    dimmed.add("store")
  }
  return dimmed
}

export function FlowCanvas({
  methodId,
  flowId,
  stepIndex,
  overlayId,
  scenarioId,
  className,
  canvasClassName,
  contextEdges = [],
  edgeLabelOverrides,
  flowSummary,
}: FlowCanvasProps) {
  const [reduceMotion, setReduceMotion] = useState(false)
  const markerUid = useId().replace(/:/g, "")

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduceMotion(media.matches)
    const onChange = () => setReduceMotion(media.matches)
    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [])

  const method = authMethods.find((entry) => entry.id === methodId)
  const diagram: Diagram | undefined = method?.diagram
  const flowSteps = diagram?.flows[flowId] ?? []
  const boundedStep = flowSteps[Math.max(0, Math.min(stepIndex, Math.max(flowSteps.length - 1, 0)))]
  const overlay = diagram?.overlays?.find((candidate) => candidate.id === overlayId) ?? null

  const laneX = useMemo(() => {
    const left = 96
    const right = 106
    const spacing = (WIDTH - left - right) / (laneOrder.length - 1)
    return new Map(laneOrder.map((laneId, i) => [laneId, left + spacing * i]))
  }, [])

  if (!method || !diagram || !boundedStep) {
    return <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">Diagram unavailable.</div>
  }

  const activeEdges = new Set(boundedStep.activeEdges)
  const contextualEdges = new Set(contextEdges)
  const activeLanes = new Set(boundedStep.activeLanes ?? [])
  const overlayEdges = new Set(overlay?.affectedEdges ?? [])
  const dimmedLanes = dimmedLanesForScenario(scenarioId, methodId)
  for (const edge of diagram.edges) {
    if (contextualEdges.has(edge.id)) {
      activeLanes.add(edge.fromLane)
      activeLanes.add(edge.toLane)
    }
  }

  const activeMarkerId = `flow-arrow-active-${markerUid}`
  const mutedMarkerId = `flow-arrow-muted-${markerUid}`
  const warnMarkerId = `flow-arrow-warn-${markerUid}`
  const drawingClipId = `flow-drawing-clip-${markerUid}`

  return (
    <section
      className={cn(
        "flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900",
        className
      )}
      aria-label="Flow canvas"
    >
      <style jsx>{`
        @keyframes auth-atlas-edge-draw {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes auth-atlas-lane-pulse {
          0%,
          100% {
            opacity: 0.12;
            transform: scale(1);
          }
          50% {
            opacity: 0.22;
            transform: scale(1.01);
          }
        }
      `}</style>
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Flow canvas</p>
        {overlay ? (
          <p className="rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[11px] font-medium text-rose-700 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-300">
            Overlay: {overlay.label}
          </p>
        ) : null}
      </div>
      {flowSummary ? (
        <article className="mb-0 rounded-lg border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-900/40">
          <p className="text-xs uppercase tracking-wide text-slate-600 dark:text-slate-300">{flowSummary.title}</p>
          <p
            className="mt-0.5 overflow-hidden text-sm text-slate-800 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] dark:text-slate-200"
            aria-live="polite"
          >
            {flowSummary.caption}
          </p>
          {flowSummary.note ? (
            <p className="mt-1.5 rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-[11px] text-blue-800 dark:border-blue-900 dark:bg-blue-950/20 dark:text-blue-200">
              {flowSummary.note}
            </p>
          ) : null}
          {flowSummary.callouts && flowSummary.callouts.length > 0 ? (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {flowSummary.callouts.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] text-amber-900 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </article>
      ) : null}

      <div className="min-h-[400px] flex-1 overflow-hidden md:min-h-[500px] lg:min-h-[600px]">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          preserveAspectRatio="xMidYMin meet"
          className={cn("h-full w-full min-h-[400px] md:min-h-[500px] lg:min-h-[600px]", canvasClassName)}
          role="img"
          aria-label={`${method.name} flow diagram`}
          style={{ overflow: "hidden" }}
        >
          <desc>{`${boundedStep.title}. ${boundedStep.caption}.`}</desc>
          <defs>
            <marker id={activeMarkerId} markerWidth="5" markerHeight="5" refX="4.4" refY="2.5" orient="auto">
              <path d="M0,0 L5,2.5 L0,5 z" fill="#1d4ed8" />
            </marker>
            <marker id={mutedMarkerId} markerWidth="5" markerHeight="5" refX="4.4" refY="2.5" orient="auto">
              <path d="M0,0 L5,2.5 L0,5 z" fill="#94a3b8" />
            </marker>
            <marker id={warnMarkerId} markerWidth="5" markerHeight="5" refX="4.4" refY="2.5" orient="auto">
              <path d="M0,0 L5,2.5 L0,5 z" fill="#dc2626" />
            </marker>
            <clipPath id={drawingClipId}>
              <rect x="12" y="98" width={WIDTH - 24} height={LANE_Y2 - 84} rx="8" />
            </clipPath>
          </defs>

          {laneOrder.map((laneId) => {
            const x = laneX.get(laneId) ?? 0
            const laneUsed = diagram.lanes.includes(laneId)
            const laneIsActive = activeLanes.has(laneId)
            const laneDim = !laneUsed || dimmedLanes.has(laneId)
            const opacity = laneDim ? 0.35 : 1
            return (
              <g key={laneId} opacity={opacity}>
                {laneIsActive ? (
                  <rect
                    x={x - 96}
                    y={HEADER_Y - 6}
                    width={192}
                    height={76}
                    rx={12}
                    fill="#3b82f6"
                    opacity={0.18}
                    style={reduceMotion ? undefined : { animation: "auth-atlas-lane-pulse 1.4s ease-in-out infinite" }}
                  />
                ) : null}
                <g clipPath={`url(#${drawingClipId})`}>
                  <line x1={x} y1={LANE_Y1} x2={x} y2={LANE_Y2} stroke={laneIsActive ? "#2563eb" : "#cbd5e1"} strokeDasharray="6 7" />
                </g>
                <rect
                  x={x - 94}
                  y={HEADER_Y}
                  width={188}
                  height={66}
                  rx={10}
                  fill={laneIsActive ? "#dbeafe" : "#f8fafc"}
                  stroke={laneIsActive ? "#60a5fa" : "#cbd5e1"}
                  strokeWidth={laneIsActive ? 2.2 : 1}
                />
                <text x={x} y={48} textAnchor="middle" fontSize="16" fontWeight={700} fill="#0f172a">
                  {laneMeta[laneId].title}
                </text>
                <text x={x} y={67} textAnchor="middle" fontSize="13" fontWeight={700} fill="#475569">
                  {laneMeta[laneId].subtitle}
                </text>
              </g>
            )
          })}

          <g clipPath={`url(#${drawingClipId})`}>
          {diagram.edges.map((edge, index) => {
            const x1 = laneX.get(edge.fromLane) ?? 0
            const x2 = laneX.get(edge.toLane) ?? 0
            const y = edgeY(index)
            const path = `M ${x1} ${y} L ${x2} ${y}`
            const isActive = activeEdges.has(edge.id)
            const isContext = contextualEdges.has(edge.id)
            const isWarn = overlayEdges.has(edge.id)
            const stroke = isWarn ? "#dc2626" : isActive ? "#1d4ed8" : isContext ? "#2563eb" : "#94a3b8"
            const marker = isWarn ? warnMarkerId : isActive ? activeMarkerId : mutedMarkerId

            return (
              <g key={edge.id}>
                {(isWarn || isActive || isContext) ? (
                  <path
                    d={path}
                    fill="none"
                    stroke={isWarn ? "#ef4444" : "#3b82f6"}
                    strokeWidth={isWarn ? 8 : 7}
                    opacity={isWarn ? 0.18 : isActive ? 0.16 : isContext ? 0.12 : 0}
                  />
                ) : null}
                <path
                  d={path}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={isWarn ? 4.2 : isActive ? 3.6 : isContext ? 2.9 : 2}
                  strokeDasharray={edge.style === "dashed" ? "8 7" : undefined}
                  opacity={isWarn || isActive ? 1 : isContext ? 0.72 : 0.16}
                  markerEnd={`url(#${marker})`}
                  shapeRendering="geometricPrecision"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  style={{ transition: "stroke-width 260ms ease, opacity 260ms ease, stroke 260ms ease" }}
                />
                {!reduceMotion && isActive ? (
                  <AnimatedEdgePath
                    key={`${edge.id}-${stepIndex}-${flowId}-${overlayId ? "overlay" : "normal"}`}
                    d={path}
                    stroke={stroke}
                    strokeWidth={isWarn ? 5.5 : 5}
                    markerId={marker}
                    delayMs={50}
                  />
                ) : null}
                {!reduceMotion && (isWarn || isActive) ? (
                  <g opacity={0.95}>
                    <path d="M -3 -2 L 0 0 L -3 2 z" fill={isWarn ? "#ef4444" : "#1d4ed8"}>
                      <animateMotion path={path} dur={isWarn ? "1.35s" : "1.05s"} repeatCount="indefinite" rotate="auto" />
                    </path>
                  </g>
                ) : null}
                {!reduceMotion && (isWarn || isActive) ? (
                  <circle
                    cx={(x1 + x2) / 2}
                    cy={y}
                    r={2.5}
                    fill={isWarn ? "#ef4444" : "#1d4ed8"}
                    opacity={0.85}
                  />
                ) : null}

                {(isWarn || isActive || isContext) && (edgeLabelOverrides?.[edge.id] ?? edge.label) ? (() => {
                  const labelText = edgeLabelOverrides?.[edge.id] ?? edge.label ?? ""
                  const labelWidth = Math.min(Math.max(labelText.length * 7.4 + 24, 142), 280)
                  return (
                  <g opacity={isWarn || isActive || isContext ? 1 : 0.55}>
                    <rect
                      x={(x1 + x2) / 2 - labelWidth / 2}
                      y={y - 16}
                      width={labelWidth}
                      height={24}
                      rx={10}
                      fill={isWarn ? "#fee2e2" : "#f1f5f9"}
                      stroke={isWarn ? "#fecaca" : "#e2e8f0"}
                    />
                    <text x={(x1 + x2) / 2} y={y + 2} textAnchor="middle" fontSize="14" fontWeight={700} fill={isWarn ? "#991b1b" : "#1f2937"}>
                      {labelText}
                    </text>
                  </g>
                  )
                })() : null}

                {isWarn ? (
                  <g>
                    <rect x={(x1 + x2) / 2 + 78} y={y - 11} width={108} height={17} rx={8} fill="#dc2626" />
                    <text x={(x1 + x2) / 2 + 132} y={y + 1} textAnchor="middle" fontSize="10" fill="#fff" fontWeight={700}>
                      {overlay?.annotation ?? "Warning here"}
                    </text>
                  </g>
                ) : null}
              </g>
            )
          })}
          </g>

          {scenarioId === "spa-public-api" && methodId === "session-cookies" ? (
            <g>
              <rect x={96} y={132} width={256} height={24} rx={8} fill="#f59e0b" opacity={0.9} />
              <text x={224} y={148} textAnchor="middle" fontSize="11" fill="#111827" fontWeight={700}>
                SPA/public API: validate CSRF + CORS assumptions
              </text>
            </g>
          ) : null}
        </svg>
      </div>
    </section>
  )
}

function AnimatedEdgePath({
  d,
  stroke,
  strokeWidth,
  markerId,
  delayMs = 45,
}: {
  d: string
  stroke: string
  strokeWidth: number
  markerId: string
  delayMs?: number
}) {
  const ref = useRef<SVGPathElement | null>(null)
  const [pathLen, setPathLen] = useState<number | null>(null)

  useLayoutEffect(() => {
    const node = ref.current
    if (!node) return
    const length = node.getTotalLength()
    setPathLen(Number.isFinite(length) && length > 0 ? length : 1)
  }, [d, strokeWidth])

  return (
    <path
      ref={ref}
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={pathLen ?? 1}
      strokeDashoffset={pathLen ?? 1}
      markerEnd={`url(#${markerId})`}
      shapeRendering="geometricPrecision"
      vectorEffect="non-scaling-stroke"
      opacity={pathLen == null ? 0 : 1}
      style={pathLen == null ? undefined : { animation: `auth-atlas-edge-draw 520ms cubic-bezier(0.22, 1, 0.36, 1) ${delayMs}ms forwards`, willChange: "stroke-dashoffset" }}
    />
  )
}
