"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Check, Copy, Share2 } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { shareOrCopyUrl } from "@/lib/share-client"
import {
  RAG_PATTERNS,
  type RagPattern,
  type RagNode,
  type RagEdge,
  type PayloadType,
  type NodeType,
  type EdgeSpeed,
} from "./rag-patterns-data"

// ─── Types ────────────────────────────────────────────────────────────────────

interface SimState {
  chunkSize: number
  topK: number
  rerankerOn: boolean
  hybridOn: boolean
  condensationOn: boolean
}

// ─── Constants ────────────────────────────────────────────────────────────────

const NODE_COLORS: Record<NodeType, { fill: string; stroke: string }> = {
  input:   { fill: "#EEF3F7", stroke: "#3A6EA5" },
  process: { fill: "#F6F8FA", stroke: "#445561" },
  store:   { fill: "#EDF6F1", stroke: "#5F8F7A" },
  model:   { fill: "#EDF2F9", stroke: "#3A6EA5" },
  output:  { fill: "#FFFFFF", stroke: "#1A232B" },
  branch:  { fill: "#FBF7EF", stroke: "#B89B7A" },
}

const PARTICLE_COLORS: Record<PayloadType, string> = {
  query:     "#3A6EA5",
  embedding: "#5F8F7A",
  chunk:     "#B89B7A",
  score:     "#7A8A99",
  sql:       "#445561",
}

const EDGE_DUR: Record<EdgeSpeed, string> = {
  fast:   "1.2",
  medium: "2.0",
  slow:   "3.2",
}

const NODE_TYPE_LABEL: Record<NodeType, string> = {
  input: "Input",
  process: "Process",
  store: "Store",
  model: "Model",
  output: "Output",
  branch: "Branch",
}

const PATTERN_ACCENTS: Record<string, string> = {
  "vanilla-rag": "#3A6EA5",
  "hybrid-rag": "#2F7E65",
  "rerank-first-rag": "#1D6FA5",
  "query-expansion": "#B86A2B",
  hyde: "#2E8A8A",
  "conversational-rag": "#596F8A",
  "router-rag": "#8A6F47",
  "iterative-rag": "#A34B3D",
  "graph-rag": "#246C7D",
  "structured-rag": "#3B7A57",
}

// ─── Pure helpers ─────────────────────────────────────────────────────────────

function withAlpha(hex: string, alpha: number) {
  const value = hex.replace("#", "")
  if (value.length !== 6) return hex
  const r = Number.parseInt(value.slice(0, 2), 16)
  const g = Number.parseInt(value.slice(2, 4), 16)
  const b = Number.parseInt(value.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function getEdgePath(edge: RagEdge, nodes: RagNode[]): string {
  if (edge.path) return edge.path
  const from = nodes.find(n => n.id === edge.from)!
  const to   = nodes.find(n => n.id === edge.to)!
  const fx = from.x + from.w / 2
  const fy = from.y
  const tx = to.x - to.w / 2
  const ty = to.y
  if (edge.via) return `M ${fx},${fy} Q ${edge.via.x},${edge.via.y} ${tx},${ty}`
  return `M ${fx},${fy} L ${tx},${ty}`
}

function getLabelMidpoint(d: string): { x: number; y: number } {
  const m = d.match(/M\s*([\d.]+),([\d.]+)/)
  if (!m) return { x: 0, y: 0 }
  const x1 = parseFloat(m[1]), y1 = parseFloat(m[2])
  const q = d.match(/Q\s*([\d.]+),([\d.]+)\s+([\d.]+),([\d.]+)/)
  if (q) {
    const [cx, cy, x2, y2] = q.slice(1).map(parseFloat)
    return { x: 0.25 * x1 + 0.5 * cx + 0.25 * x2, y: 0.25 * y1 + 0.5 * cy + 0.25 * y2 }
  }
  const l = d.match(/L\s*([\d.]+),([\d.]+)/)
  if (l) {
    const x2 = parseFloat(l[1]), y2 = parseFloat(l[2])
    return { x: (x1 + x2) / 2, y: (y1 + y2) / 2 }
  }
  return { x: x1, y: y1 }
}

function computeMetrics(sim: SimState, patternId: string) {
  const bases: Record<string, [number, number, number]> = {
    "vanilla-rag":        [0.20, 0.20, 0.45],
    "hybrid-rag":         [0.35, 0.35, 0.30],
    "rerank-first-rag":   [0.45, 0.40, 0.25],
    "query-expansion":    [0.50, 0.50, 0.30],
    "hyde":               [0.45, 0.40, 0.35],
    "conversational-rag": [0.40, 0.35, 0.35],
    "router-rag":         [0.35, 0.30, 0.30],
    "iterative-rag":      [0.70, 0.65, 0.20],
    "graph-rag":          [0.75, 0.70, 0.20],
    "structured-rag":     [0.55, 0.45, 0.25],
  }
  const [bL, bC, bR] = bases[patternId] ?? [0.35, 0.35, 0.35]
  let lat = bL, cost = bC, risk = bR

  const cs = sim.chunkSize / 512
  if (cs < 1)  risk += 0.15
  if (cs > 1)  { lat += (cs - 1) * 0.05; cost += (cs - 1) * 0.08; risk -= (cs - 1) * 0.05 }
  if (sim.chunkSize > 1024) risk += 0.15

  const tk = sim.topK / 5
  cost += (tk - 1) * 0.10
  lat  += (tk - 1) * 0.05
  risk -= (tk - 1) * 0.05
  if (sim.topK > 12) risk += 0.20

  if (sim.rerankerOn)     { lat += 0.25; cost += 0.20; risk -= 0.20 }
  if (sim.hybridOn)       { lat += 0.15; cost += 0.15; risk -= 0.15 }
  if (sim.condensationOn) { lat += 0.15; cost += 0.12; risk -= 0.10 }

  const clamp = (v: number) => Math.max(0.05, Math.min(1, v))
  return { latency: clamp(lat), cost: clamp(cost), accuracyRisk: clamp(risk) }
}

function getPatternAccent(patternId: string) {
  return PATTERN_ACCENTS[patternId] ?? "#3A6EA5"
}

// ─── SVG particle shapes ──────────────────────────────────────────────────────

function ParticleShape({ type, color }: { type: PayloadType; color: string }) {
  switch (type) {
    case "query":     return <circle r={4} fill={color} opacity={0.9} />
    case "embedding": return <rect x={-5} y={-5} width={10} height={10} fill={color} opacity={0.85} transform="rotate(45)" />
    case "chunk":     return <rect x={-7} y={-3} width={14} height={6} rx={1} fill={color} opacity={0.85} />
    case "score":     return <rect x={-8} y={-2} width={16} height={4} rx={1} fill={color} opacity={0.85} />
    case "sql":       return <rect x={-6} y={-3} width={12} height={6} rx={2} fill={color} opacity={0.9} />
    default:          return <circle r={3} fill={color} opacity={0.9} />
  }
}

function Particles({ edge, d, reduced }: { edge: RagEdge; d: string; reduced: boolean }) {
  const color = PARTICLE_COLORS[edge.payloadType]
  const dur   = EDGE_DUR[edge.speed]
  const durN  = parseFloat(dur)

  if (reduced) return null

  return (
    <>
      {([0, -durN * 0.33, -durN * 0.66] as number[]).map((offset, i) => (
        <g key={i}>
          <animateMotion
            path={d}
            dur={`${dur}s`}
            repeatCount="indefinite"
            begin={`${offset.toFixed(3)}s`}
            rotate="auto"
          />
          <ParticleShape type={edge.payloadType} color={color} />
        </g>
      ))}
    </>
  )
}

// ─── SVG node label (handles multi-line via \n) ───────────────────────────────

function NodeLabel({ label, cx, cy }: { label: string; cx: number; cy: number }) {
  const lines = label.split("\n")
  const lineH = 13
  const startY = lines.length === 1 ? cy : cy - ((lines.length - 1) * lineH) / 2
  return (
    <text
      textAnchor="middle"
      fontSize={10.5}
      fill="#111827"
      stroke="#F8FAFC"
      strokeWidth={1.8}
      paintOrder="stroke"
      fontFamily="ui-sans-serif, system-ui, sans-serif"
      fontWeight={600}
      style={{ pointerEvents: "none", userSelect: "none" }}
    >
      {lines.map((line, i) => (
        <tspan key={i} x={cx} y={startY + i * lineH}>{line}</tspan>
      ))}
    </text>
  )
}

// ─── SVG DiagramNode ──────────────────────────────────────────────────────────

function DiagramNode({
  node, isHovered, isDimmed, onHover, accentColor, reduced, introDelay,
}: {
  node: RagNode
  isHovered: boolean
  isDimmed: boolean
  onHover: (id: string | null) => void
  accentColor: string
  reduced: boolean
  introDelay: number
}) {
  const { fill, stroke } = NODE_COLORS[node.type]
  const rx = node.x - node.w / 2
  const ry = node.y - node.h / 2
  const boxOpacity = isDimmed ? 0.5 : 1
  const labelOpacity = isDimmed ? 0.78 : 1

  return (
    <g
      style={{ cursor: "pointer" }}
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(null)}
    >
      {!reduced && (
        <>
          <animate attributeName="opacity" from="0" to="1" dur="0.3s" begin={`${introDelay}s`} fill="freeze" />
          <animateTransform
            attributeName="transform"
            type="translate"
            from="0 6"
            to="0 0"
            dur="0.3s"
            begin={`${introDelay}s`}
            fill="freeze"
          />
        </>
      )}
      {/* Pulse ring — model nodes only */}
      {node.type === "model" && !isDimmed && (
        <rect
          x={rx - 4} y={ry - 4} width={node.w + 8} height={node.h + 8}
          rx={8} fill="none" stroke={stroke} strokeWidth={1.5} opacity={0}
        >
          <animate attributeName="opacity"       values="0;0.45;0"  dur="2.2s" repeatCount="indefinite" />
          <animate attributeName="stroke-width"  values="1.5;3;1.5" dur="2.2s" repeatCount="indefinite" />
        </rect>
      )}
      {/* Hover glow */}
      {isHovered && (
        <rect
          x={rx - 3} y={ry - 3} width={node.w + 6} height={node.h + 6}
          rx={7} fill="none" stroke={accentColor} strokeWidth={2} opacity={0.5}
        />
      )}
      <rect
        x={rx} y={ry} width={node.w} height={node.h} rx={5}
        fill={fill} stroke={stroke} strokeWidth={isHovered ? 2 : 1.5}
        opacity={boxOpacity}
      />
      <g opacity={labelOpacity}>
        <NodeLabel label={node.label} cx={node.x} cy={node.y} />
      </g>
    </g>
  )
}

// ─── SVG DiagramEdge ──────────────────────────────────────────────────────────

function DiagramEdge({
  edge, d, isHighlighted, isDimmed, reduced, accentColor, introDelay,
}: {
  edge: RagEdge
  d: string
  isHighlighted: boolean
  isDimmed: boolean
  reduced: boolean
  accentColor: string
  introDelay: number
}) {
  const color       = PARTICLE_COLORS[edge.payloadType]
  const edgeColor   = isHighlighted ? color : "#94A3B8"
  const edgeOpacity = isDimmed ? 0.12 : isHighlighted ? 1 : 0.55
  const mid         = edge.label ? getLabelMidpoint(d) : null

  return (
    <g opacity={edgeOpacity}>
      {!reduced && (
        <animate attributeName="opacity" from="0" to={String(edgeOpacity)} dur="0.28s" begin={`${introDelay}s`} fill="freeze" />
      )}
      {isHighlighted && (
        <path
          d={d}
          fill="none"
          stroke={accentColor}
          strokeWidth={5}
          opacity={0.14}
        />
      )}
      <path
        d={d} fill="none"
        stroke={edgeColor} strokeWidth={isHighlighted ? 2 : 1.5}
        markerEnd={`url(#arrow-${edge.payloadType})`}
      />
      {mid && (
        <text
          x={mid.x} y={mid.y - 7}
          textAnchor="middle"
          fontSize={9}
          fill="#334155"
          stroke="#F8FAFC"
          strokeWidth={1.4}
          paintOrder="stroke"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          style={{ pointerEvents: "none", userSelect: "none" }}
        >
          {edge.label}
        </text>
      )}
      <g opacity={isDimmed ? 0 : 1}>
        <Particles edge={edge} d={d} reduced={reduced} />
      </g>
    </g>
  )
}

// ─── PatternSVG ───────────────────────────────────────────────────────────────

function PatternSVG({
  pattern, hoveredNodeId, onNodeHover, reduced, focusMode, accentColor,
}: {
  pattern: RagPattern
  hoveredNodeId: string | null
  onNodeHover: (id: string | null) => void
  reduced: boolean
  focusMode: boolean
  accentColor: string
}) {
  const isFocusActive = focusMode && hoveredNodeId !== null
  const connectedNodeIds = hoveredNodeId
    ? new Set(
        pattern.edges
          .filter(e => e.from === hoveredNodeId || e.to === hoveredNodeId)
          .flatMap(e => [e.from, e.to])
      )
    : new Set<string>()

  const connectedEdgeIds = hoveredNodeId
    ? new Set(pattern.edges.filter(e => e.from === hoveredNodeId || e.to === hoveredNodeId).map(e => e.id))
    : new Set<string>()

  const edgePaths = pattern.edges.map(e => ({ edge: e, d: getEdgePath(e, pattern.nodes) }))

  return (
    <svg
      viewBox={pattern.viewBox}
      className="w-full h-auto"
      aria-label={`${pattern.name} flow diagram`}
      role="img"
      style={{ overflow: "visible" }}
    >
      <defs>
        {(["query", "embedding", "chunk", "score", "sql"] as PayloadType[]).map(type => (
          <marker
            key={type}
            id={`arrow-${type}`}
            markerWidth={8} markerHeight={8}
            refX={6} refY={3}
            orient="auto"
          >
            <path d="M0,0 L0,6 L8,3 z" fill={PARTICLE_COLORS[type]} />
          </marker>
        ))}
      </defs>

      {/* Edges rendered first (behind nodes) */}
      {edgePaths.map(({ edge, d }, edgeIndex) => (
        <DiagramEdge
          key={edge.id}
          edge={edge}
          d={d}
          isHighlighted={hoveredNodeId !== null && connectedEdgeIds.has(edge.id)}
          isDimmed={isFocusActive && !connectedEdgeIds.has(edge.id)}
          reduced={reduced}
          accentColor={accentColor}
          introDelay={0.04 * (edgeIndex + 1)}
        />
      ))}

      {/* Nodes on top */}
      {pattern.nodes.map((node, nodeIndex) => (
        <DiagramNode
          key={node.id}
          node={node}
          isHovered={node.id === hoveredNodeId}
          isDimmed={isFocusActive && !connectedNodeIds.has(node.id)}
          onHover={onNodeHover}
          accentColor={accentColor}
          reduced={reduced}
          introDelay={0.05 * (nodeIndex + 1)}
        />
      ))}
    </svg>
  )
}

function parseViewBox(viewBox: string) {
  const [, , width, height] = viewBox.split(/\s+/).map(Number)
  return {
    width: Number.isFinite(width) && width > 0 ? width : 1,
    height: Number.isFinite(height) && height > 0 ? height : 1,
  }
}

// ─── Legend ───────────────────────────────────────────────────────────────────

function Legend() {
  const items: { type: PayloadType; label: string }[] = [
    { type: "query",     label: "Query tokens" },
    { type: "embedding", label: "Embeddings" },
    { type: "chunk",     label: "Chunks / docs" },
    { type: "score",     label: "Scores" },
    { type: "sql",       label: "SQL / tool call" },
  ]
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2 items-center">
      {items.map(({ type, label }) => (
        <div
          key={type}
          className="flex items-center gap-2 rounded-full border px-2.5 py-1"
          style={{
            borderColor: withAlpha(PARTICLE_COLORS[type], 0.24),
            backgroundColor: withAlpha(PARTICLE_COLORS[type], 0.08),
          }}
        >
          <svg width={22} height={14} viewBox="0 0 22 14" style={{ overflow: "visible" }}>
            <g transform="translate(11,7)">
              <ParticleShape type={type} color={PARTICLE_COLORS[type]} />
            </g>
          </svg>
          <span className="text-xs text-[#445561]">{label}</span>
        </div>
      ))}
    </div>
  )
}

function NodeHoverCard({ node, pattern }: { node: RagNode; pattern: RagPattern }) {
  const { width, height } = parseViewBox(pattern.viewBox)
  const left = Math.min(88, Math.max(12, (node.x / width) * 100))
  const top = (node.y / height) * 100
  const placeBelow = top < 35
  const { stroke } = NODE_COLORS[node.type]
  const rows = [
    { label: "What it does", value: node.what, color: "#3A6EA5" },
    { label: "Why it exists", value: node.why, color: "#5F8F7A" },
    { label: "Failure mode", value: node.fails, color: "#C0392B" },
  ]

  return (
    <div
      className="absolute z-20 w-[min(24rem,92%)] rounded-lg border bg-white shadow-xl pointer-events-none overflow-hidden"
      style={{
        left: `${left}%`,
        top: `${top}%`,
        transform: placeBelow ? "translate(-50%, 14px)" : "translate(-50%, calc(-100% - 14px))",
        borderColor: `${stroke}70`,
        boxShadow: `0 16px 30px ${withAlpha(stroke, 0.12)}`,
      }}
      aria-live="polite"
    >
      <div style={{ height: "3px", background: `linear-gradient(90deg, ${stroke}, ${withAlpha(stroke, 0.35)})` }} />
      <div className="px-3 py-2 border-b flex items-center gap-2"
        style={{ borderColor: `${stroke}30`, backgroundColor: `${stroke}10` }}>
        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: stroke }} />
        <span className="text-xs font-semibold text-[#1A232B] leading-snug">
          {node.label.replace("\n", " ")}
        </span>
        <span
          className="ml-auto text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full border"
          style={{
            color: stroke,
            borderColor: withAlpha(stroke, 0.35),
            backgroundColor: withAlpha(stroke, 0.12),
          }}
        >
          {NODE_TYPE_LABEL[node.type]}
        </span>
      </div>
      <div className="p-3 space-y-2.5">
        {rows.map(({ label, value, color }) => (
          <div key={label}>
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color }}>
              {label}
            </p>
            <p className="text-xs text-[#445561] leading-relaxed">{value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Pattern card ─────────────────────────────────────────────────────────────

function PatternCard({ pattern, accentColor }: { pattern: RagPattern; accentColor: string }) {
  const c = pattern.patternCard
  const primaryUseCase = c.bestFor[0] ?? "General-purpose retrieval workflows."
  const coreTradeoff = `${c.pros[0] ?? "Strong baseline performance"} vs ${c.cons[0] ?? "added complexity"}`
  return (
    <div className="rounded-lg border border-[#D6DEE6] bg-white overflow-hidden shadow-sm">
      <div
        className="px-3 py-2.5 border-b"
        style={{
          borderColor: withAlpha(accentColor, 0.25),
          background: `linear-gradient(180deg, ${withAlpha(accentColor, 0.12)}, #F8FAFC)`,
        }}
      >
        <p className="text-sm font-bold text-[#1A232B]">{pattern.name}</p>
        <p className="text-xs text-[#475569] mt-0.5">{pattern.shortDesc}</p>
      </div>
      <div className="p-3 space-y-3 text-xs">
        <div className="grid grid-cols-1 gap-2">
          <div className="rounded-md border px-2.5 py-2 bg-[#FAFCFE]" style={{ borderColor: withAlpha(accentColor, 0.2) }}>
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: accentColor }}>Best for</p>
            <p className="text-[#334155] leading-relaxed">{primaryUseCase}</p>
          </div>
          <div className="rounded-md border border-[#E5EBF2] px-2.5 py-2 bg-[#FAFCFE]">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#7C5A1D] mb-1">Core tradeoff</p>
            <p className="text-[#334155] leading-relaxed">{coreTradeoff}</p>
          </div>
          <div className="rounded-md border border-[#F3DBD8] px-2.5 py-2 bg-[#FFF9F8]">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9A2F23] mb-1">Failure mode</p>
            <p className="text-[#334155] leading-relaxed">{c.failureModes}</p>
          </div>
        </div>
        <details className="group rounded-md border border-[#E5EBF2] bg-[#F8FBFD]">
          <summary className="cursor-pointer list-none px-2.5 py-2 text-[11px] font-semibold text-[#1A232B] flex items-center justify-between">
            Details
            <span className="text-[10px] text-[#475569] group-open:hidden">expand</span>
            <span className="text-[10px] text-[#475569] hidden group-open:inline">collapse</span>
          </summary>
          <div className="px-2.5 pb-2.5 space-y-2.5 border-t border-[#E5EBF2] text-[#445561]">
            <div className="pt-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider mb-1 text-[#1A232B]">Pros</p>
              <ul className="space-y-0.5">
                {c.pros.map((p, i) => <li key={i}>+ {p}</li>)}
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider mb-1 text-[#1A232B]">Cons</p>
              <ul className="space-y-0.5">
                {c.cons.map((p, i) => <li key={i}>− {p}</li>)}
              </ul>
            </div>
            <div className="space-y-1 text-[#475569]">
              <p><span className="font-medium text-[#445561]">Latency: </span>{c.latencyNotes}</p>
              <p><span className="font-medium text-[#445561]">Cost: </span>{c.costNotes}</p>
            </div>
          </div>
        </details>
      </div>
    </div>
  )
}

// ─── Simulator ────────────────────────────────────────────────────────────────

function MeterBar({ label, value, note }: { label: string; value: number; note: string }) {
  const pct   = Math.round(value * 100)
  const color = value < 0.4 ? "#5F8F7A" : value < 0.7 ? "#D4974A" : "#C0392B"
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="font-medium text-[#1A232B]">{label}</span>
        <span className="text-[#475569]">{note}</span>
      </div>
      <div className="h-2 bg-[#EEF3F7] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}

function Toggle({ label, checked, onChange, disabled }: {
  label: string; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean
}) {
  return (
    <label className={`flex items-center gap-2.5 select-none ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}>
      <button
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative w-9 h-5 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3A6EA5] ${checked ? "bg-[#3A6EA5]" : "bg-[#D6DEE6]"}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${checked ? "translate-x-4" : "translate-x-0"}`} />
      </button>
      <span className="text-xs text-[#445561]">{label}</span>
    </label>
  )
}

function Simulator({ sim, onSim, patternId }: {
  sim: SimState; onSim: (s: SimState) => void; patternId: string
}) {
  const metrics        = computeMetrics(sim, patternId)
  const isConvo        = patternId === "conversational-rag"
  const builtinRerank  = ["rerank-first-rag", "hybrid-rag"].includes(patternId)
  const builtinHybrid  = patternId === "hybrid-rag"

  const note = (v: number) => v < 0.4 ? "low" : v < 0.7 ? "moderate" : "high"

  return (
    <div className="rounded-xl border border-[#D6DEE6] bg-white overflow-hidden shadow-sm">
      <div className="px-4 py-3 border-b border-[#D6DEE6] bg-[#F6F8FA]">
        <p className="text-sm font-bold text-[#1A232B]">Live Simulator</p>
        <p className="text-xs text-[#475569] mt-0.5">Adjust settings to see trade-off effects</p>
        <p className="text-[11px] text-[#64748B] mt-1">
          Directional model only: this shows relative behavior, not production benchmarks.
        </p>
      </div>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-4">
          {/* Chunk size */}
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <label htmlFor="chunk-size-slider" className="text-xs font-medium text-[#1A232B]">Chunk size</label>
              <span className="text-xs text-[#475569]">{sim.chunkSize} tokens</span>
            </div>
            <input
              id="chunk-size-slider"
              type="range" min={128} max={2048} step={128}
              value={sim.chunkSize}
              onChange={e => onSim({ ...sim, chunkSize: +e.target.value })}
              className="w-full h-1.5 rounded-full accent-[#3A6EA5] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#475569]">
              <span>128</span><span>2 048</span>
            </div>
            <p className="text-[10px] text-[#64748B] leading-relaxed">
              Smaller chunks improve precision but can miss context; larger chunks add context but can add noise and cost.
            </p>
          </div>
          {/* Top-k */}
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <label htmlFor="top-k-slider" className="text-xs font-medium text-[#1A232B]">Top-k</label>
              <span className="text-xs text-[#475569]">{sim.topK} chunks</span>
            </div>
            <input
              id="top-k-slider"
              type="range" min={1} max={20} step={1}
              value={sim.topK}
              onChange={e => onSim({ ...sim, topK: +e.target.value })}
              className="w-full h-1.5 rounded-full accent-[#3A6EA5] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#475569]">
              <span>1</span><span>20</span>
            </div>
            <p className="text-[10px] text-[#64748B] leading-relaxed">
              Higher k increases recall but expands context and latency. Too high can dilute relevance.
            </p>
          </div>
          {/* Toggles */}
          <div className="space-y-2.5 pt-1">
            <Toggle
              label="Reranker"
              checked={sim.rerankerOn || builtinRerank}
              onChange={v => onSim({ ...sim, rerankerOn: v })}
              disabled={builtinRerank}
            />
            <p className="text-[10px] text-[#64748B] -mt-1">
              Reranking usually lowers accuracy risk, but adds extra compute/latency.
            </p>
            <Toggle
              label="Hybrid search"
              checked={sim.hybridOn || builtinHybrid}
              onChange={v => onSim({ ...sim, hybridOn: v })}
              disabled={builtinHybrid}
            />
            <p className="text-[10px] text-[#64748B] -mt-1">
              Hybrid blends lexical + semantic retrieval to improve recall on exact terms.
            </p>
            {isConvo && (
              <>
                <Toggle
                  label="History condensation"
                  checked={sim.condensationOn}
                  onChange={v => onSim({ ...sim, condensationOn: v })}
                />
                <p className="text-[10px] text-[#64748B] -mt-1">
                  Condensation keeps multi-turn context coherent, with an extra model call.
                </p>
              </>
            )}
          </div>
        </div>
        {/* Meters */}
        <div className="flex flex-col justify-center space-y-4">
          <MeterBar label="Latency"       value={metrics.latency}      note={note(metrics.latency)} />
          <MeterBar label="Cost"          value={metrics.cost}         note={note(metrics.cost)} />
          <MeterBar label="Accuracy risk" value={metrics.accuracyRisk} note={note(metrics.accuracyRisk)} />
          <p className="text-[10px] text-[#475569] leading-relaxed pt-1">
            Lower is better for latency and cost. Lower accuracy risk means safer retrieval behavior.
          </p>
          <p className="text-[10px] text-[#64748B] leading-relaxed">
            Meters are relative trade-offs for this pattern, not measured production telemetry.
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function RagAtlasClient() {
  const articleUrl = "/strategic-narratives/technical-architecture/the-rag-atlas-a-visual-guide-to-retrieval-patterns"
  const [activeId, setActiveId] = useState("vanilla-rag")
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [reduced, setReduced] = useState(false)
  const [focusMode, setFocusMode] = useState(true)
  const [shareState, setShareState] = useState<"idle" | "copying" | "copied" | "error">("idle")
  const [sim, setSim] = useState<SimState>({
    chunkSize: 512, topK: 5,
    rerankerOn: false, hybridOn: false, condensationOn: false,
  })

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mq.matches)
    const handler = () => setReduced(mq.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  const handlePatternChange = useCallback((id: string) => {
    setActiveId(id)
    setHoveredId(null)
  }, [])

  const handleShare = useCallback(async () => {
    const url = window.location.href
    const title = "The RAG Atlas: A Visual Guide to Retrieval Patterns"
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

  const pattern     = RAG_PATTERNS.find(p => p.id === activeId)!
  const hoveredNode = pattern.nodes.find(n => n.id === hoveredId) ?? null
  const accentColor = getPatternAccent(activeId)

  return (
    <div className="flex min-h-screen flex-col bg-[#F6F8FA]">
      <SiteHeader />

      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="border-b border-[#D6DEE6] bg-white px-4 py-8 md:py-12">
          <div className="max-w-5xl mx-auto">
            <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-2 text-xs text-[#475569]">
              <Link href="/writing" className="hover:text-[#1A232B] transition-colors">
                Writing
              </Link>
              <span aria-hidden="true">/</span>
              <Link href={articleUrl} className="hover:text-[#1A232B] transition-colors">
                The RAG Atlas (article)
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-[#1A232B]" aria-current="page">Interactive Atlas</span>
            </nav>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#3A6EA5] mb-2">
              Interactive Reference
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-[#1A232B] mb-2">
              The RAG Atlas
            </h1>
            <p className="text-lg text-[#3A6EA5] font-medium mb-4">
              A visual guide to retrieval patterns
            </p>
            <p className="text-[#445561] max-w-2xl leading-relaxed mb-6">
              RAG isn't one thing, it's a family of pipelines. This page maps ten common patterns
              as animated flow diagrams. Hover any node to inspect it. Use the simulator to see how
              tuning choices affect latency, cost, and accuracy risk.
            </p>
            <div className="mb-6 flex items-center gap-3">
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center rounded-md border border-[#D6DEE6] bg-white px-3 py-2 text-xs font-medium text-[#1A232B] hover:bg-[#F8FBFD] transition-colors"
              >
                {shareState === "copying" && <Copy className="mr-2 h-3.5 w-3.5 animate-pulse" />}
                {shareState === "copied" && <Check className="mr-2 h-3.5 w-3.5 text-[#5F8F7A]" />}
                {shareState === "error" && <Share2 className="mr-2 h-3.5 w-3.5 text-[#B45309]" />}
                {shareState === "idle" && <Share2 className="mr-2 h-3.5 w-3.5" />}
                {shareState === "copying" && "Copying..."}
                {shareState === "copied" && "Copied"}
                {shareState === "error" && "Try again"}
                {shareState === "idle" && "Share Atlas"}
              </button>
              <Link
                href={articleUrl}
                className="text-xs font-medium text-[#3A6EA5] hover:text-[#2F5A87] transition-colors"
              >
                View source article
              </Link>
            </div>
            <Legend />
          </div>
        </section>

        {/* ── Body ── */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-5">

            {/* Pattern selector */}
            <aside className="lg:w-52 flex-shrink-0">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#475569] mb-2 hidden lg:block pl-1">
                Patterns
              </p>
              <div className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
                {RAG_PATTERNS.map((p, i) => {
                  const accent = getPatternAccent(p.id)
                  const isActive = p.id === activeId
                  return (
                  <button
                    key={p.id}
                    onClick={() => handlePatternChange(p.id)}
                    className={`relative overflow-hidden flex-shrink-0 lg:flex-shrink text-left rounded-lg px-3 py-2.5 transition-all duration-150 border ${
                      isActive
                        ? "bg-white shadow-sm"
                        : "bg-transparent border-transparent hover:border-[#D6DEE6] hover:bg-white/70"
                    }`}
                    style={isActive ? { borderColor: withAlpha(accent, 0.75), backgroundColor: withAlpha(accent, 0.06) } : undefined}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full" style={{ backgroundColor: accent }} />
                    )}
                    <span className={`text-[10px] font-semibold uppercase tracking-wider block mb-0.5 ${isActive ? "" : "text-[#475569]"}`} style={isActive ? { color: accent } : undefined}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={`text-xs font-medium block leading-snug whitespace-nowrap lg:whitespace-normal ${isActive ? "text-[#1A232B]" : "text-[#445561]"}`}>
                      {p.name}
                    </span>
                    <span className="text-[10px] text-[#475569] hidden lg:block mt-0.5 leading-snug">
                      {p.shortDesc}
                    </span>
                  </button>
                  )
                })}
              </div>
            </aside>

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-4">

              {/* Diagram row */}
              <div className="flex flex-col xl:flex-row gap-4">

                {/* SVG canvas */}
                <div className="flex-1 min-w-0 rounded-xl border border-[#D6DEE6] bg-white p-4 shadow-sm" style={{ borderColor: withAlpha(accentColor, 0.35) }}>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-bold text-[#1A232B]">{pattern.name}</h2>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-[#475569] hidden sm:block">
                        hover nodes to inspect
                      </span>
                      <Toggle
                        label="Focus mode"
                        checked={focusMode}
                        onChange={setFocusMode}
                      />
                    </div>
                  </div>
                  {/* key= forces full SVG remount on pattern switch, resetting animation timings */}
                  <div
                    key={activeId}
                    className="relative overflow-x-auto lg:overflow-x-visible rounded-lg border border-[#E5EBF2] p-2 sm:p-3"
                    style={{ backgroundColor: withAlpha(accentColor, 0.05), borderColor: withAlpha(accentColor, 0.2) }}
                  >
                    <div className="w-[max(100%,760px)] lg:w-full">
                      <PatternSVG
                        pattern={pattern}
                        hoveredNodeId={hoveredId}
                        onNodeHover={setHoveredId}
                        reduced={reduced}
                        focusMode={focusMode}
                        accentColor={accentColor}
                      />
                    </div>
                    {hoveredNode && <NodeHoverCard node={hoveredNode} pattern={pattern} />}
                  </div>
                </div>

                {/* Right panel */}
                <div className="xl:w-72 flex-shrink-0 space-y-3">
                  <PatternCard pattern={pattern} accentColor={accentColor} />
                </div>
              </div>

              {/* Simulator */}
              <Simulator sim={sim} onSim={setSim} patternId={activeId} />
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
