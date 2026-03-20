"use client"

import Image from "next/image"
import Link from "next/link"
import { PointerEvent, useEffect, useMemo, useState } from "react"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { buildLinkedInShareHref, shareOrCopyUrl } from "@/lib/share-client"
import { ArrowDown, Calendar, ChevronRight, Clock3, Linkedin, ScanSearch, Share2 } from "lucide-react"
import "./scalar-vector-matrix-tensor-theme.css"

type Mode = "scalar" | "vector" | "matrix" | "tensor"
type TensorExampleId = "rgb" | "video" | "batch"

type Example = {
  id: TensorExampleId | "scalar" | "vector" | "matrix"
  label: string
  blurb: string
  mode: Mode
}

type TensorScenario = {
  shape: number[]
  label: string
  detail: string
}

const PAGE_TITLE = "Scalar vs Vector vs Matrix vs Tensor"
const PAGE_URL = "https://johnmunn.tech/interactive/scalar-vector-matrix-tensor"

const tabs: Array<{ id: Mode; label: string; dimension: number }> = [
  { id: "scalar", label: "Scalar", dimension: 0 },
  { id: "vector", label: "Vector", dimension: 1 },
  { id: "matrix", label: "Matrix", dimension: 2 },
  { id: "tensor", label: "Tensor", dimension: 3 },
]

const dimensionAnchors = [
  { value: 0, label: "Scalar" },
  { value: 1, label: "Vector" },
  { value: 2, label: "Matrix" },
  { value: 3, label: "Tensor" },
  { value: 4, label: "More axes" },
] as const

const examples: Example[] = [
  { id: "scalar", label: "Temperature", blurb: "One value. Useful, but no internal structure yet.", mode: "scalar" },
  { id: "vector", label: "Velocity", blurb: "Now direction matters, so the value needs multiple coordinated parts.", mode: "vector" },
  { id: "matrix", label: "Image", blurb: "A matrix is a structured field of values laid out across rows and columns.", mode: "matrix" },
  { id: "rgb", label: "RGB Image", blurb: "Stack three image matrices and you get color channels.", mode: "tensor" },
  { id: "video", label: "Video", blurb: "Stack frames over time and you get a tensor with more structure.", mode: "tensor" },
  { id: "batch", label: "Model Batch", blurb: "Stack many examples together so systems can process them in parallel.", mode: "tensor" },
]

const matrixValues = [
  [0.12, 0.28, 0.44, 0.58, 0.74],
  [0.18, 0.35, 0.51, 0.68, 0.82],
  [0.21, 0.4, 0.94, 0.73, 0.67],
  [0.15, 0.29, 0.48, 0.61, 0.77],
  [0.09, 0.2, 0.34, 0.47, 0.59],
]

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function modeFromDimension(dimension: number): Mode {
  if (dimension < 0.75) return "scalar"
  if (dimension < 1.75) return "vector"
  if (dimension < 2.75) return "matrix"
  return "tensor"
}

function tensorScenario(exampleId: TensorExampleId, rank: number): TensorScenario {
  if (exampleId === "rgb") {
    if (rank <= 3) {
      return {
        shape: [3, 5, 5],
        label: "RGB image",
        detail: "Three channels arranged across height and width.",
      }
    }
    if (rank === 4) {
      return {
        shape: [2, 3, 5, 5],
        label: "Batch of RGB images",
        detail: "Add one more axis and now you can process multiple images together.",
      }
    }
    return {
      shape: [4, 2, 3, 5, 5],
      label: "Sequence of RGB batches",
      detail: "Another axis can represent time, windows, or grouped samples.",
    }
  }

  if (exampleId === "video") {
    if (rank <= 3) {
      return {
        shape: [4, 5, 5],
        label: "Grayscale video clip",
        detail: "Time becomes the extra axis when you stack image frames.",
      }
    }
    if (rank === 4) {
      return {
        shape: [4, 3, 5, 5],
        label: "Color video clip",
        detail: "Video often needs time plus channels plus height and width.",
      }
    }
    return {
      shape: [2, 4, 3, 5, 5],
      label: "Batch of video clips",
      detail: "One more axis lets a model process several clips at once.",
    }
  }

  if (rank <= 3) {
    return {
      shape: [8, 5, 5],
      label: "Batch of grayscale images",
      detail: "A batch axis lets systems handle many examples in one pass.",
    }
  }
  if (rank === 4) {
    return {
      shape: [8, 3, 5, 5],
      label: "Batch of RGB images",
      detail: "Batch, channel, height, width is a common model input shape.",
    }
  }
  return {
    shape: [2, 8, 3, 5, 5],
    label: "Grouped batches",
    detail: "Another axis can represent time windows, devices, or grouped batches.",
  }
}

function magnitudeToColor(value: number) {
  const intensity = clamp(value, 0, 1)
  const alpha = 0.18 + intensity * 0.72
  return `rgba(43, 111, 151, ${alpha})`
}

function nearestAnchor(dimension: number) {
  return dimensionAnchors.reduce((closest, anchor) =>
    Math.abs(anchor.value - dimension) < Math.abs(closest.value - dimension) ? anchor : closest
  )
}

function transitionSummary(dimension: number) {
  if (Math.abs(dimension - Math.round(dimension)) < 0.12) {
    return `${nearestAnchor(dimension).label} is in focus.`
  }
  if (dimension < 1) return "You are stretching a single value into a direction."
  if (dimension < 2) return "You are turning direction into layout."
  if (dimension < 3) return "You are adding another axis so the grid can stack."
  return "You are adding more axes to the tensor, not changing the core idea."
}

function matrixCellColor(value: number, exampleId: TensorExampleId | "matrix") {
  const palette =
    exampleId === "rgb"
      ? `rgba(217, 139, 58, ${0.14 + value * 0.76})`
      : exampleId === "video"
        ? `rgba(47, 125, 111, ${0.14 + value * 0.76})`
        : exampleId === "batch"
          ? `rgba(107, 70, 193, ${0.14 + value * 0.76})`
          : `rgba(43, 111, 151, ${0.14 + value * 0.76})`
  return palette
}

function useReducedMotion() {
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReduceMotion(media.matches)
    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [])

  return reduceMotion
}

function Tabs({
  activeMode,
  onSelect,
}: {
  activeMode: Mode
  onSelect: (mode: Mode) => void
}) {
  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Dimension modes">
      {tabs.map((tab) => {
        const active = tab.id === activeMode
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onSelect(tab.id)}
            className={`dimension-hover-lift rounded-full border px-4 py-2 text-sm font-semibold transition ${
              active
                ? "border-transparent bg-[#12202B] text-white shadow-[0_8px_24px_rgba(18,32,43,0.18)]"
                : "border-[#D6E1E8] bg-white text-[#48606F] hover:border-[#2B6F97] hover:text-[#12202B]"
            }`}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

function DimensionSlider({
  dimension,
  onChange,
}: {
  dimension: number
  onChange: (dimension: number) => void
}) {
  const sliderPercent = (dimension / 4) * 100
  const activeAnchor = nearestAnchor(dimension)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-[#12202B]">Dimension slider</p>
        <p className="text-xs uppercase tracking-[0.24em] text-[#6C8190]">{dimension.toFixed(1)}D</p>
      </div>
      <div className="relative">
        <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-2 -translate-y-1/2 overflow-hidden rounded-full bg-secondary">
          <div className="h-full bg-primary transition-[width] duration-75" style={{ width: `${sliderPercent}%` }} />
        </div>
        <input
          type="range"
          min={0}
          max={4}
          step={0.01}
          value={dimension}
          onChange={(event) => onChange(Number(event.target.value))}
          aria-label="Dimensionality"
          className="dimension-range relative z-10 h-5 w-full cursor-pointer appearance-none bg-transparent"
        />
      </div>
      <div className="grid grid-cols-5 gap-2 text-center text-[11px] font-medium uppercase tracking-[0.18em] text-[#6C8190]">
        {dimensionAnchors.map((anchor) => {
          const active = activeAnchor.value === anchor.value
          return (
            <button
              key={anchor.value}
              type="button"
              onClick={() => onChange(anchor.value)}
              className={`dimension-hover-lift rounded-full border px-2 py-1 transition ${
                active ? "border-[#12202B] bg-[#12202B] text-white" : "border-[#D6E1E8] bg-white text-[#6C8190]"
              }`}
            >
              {anchor.value} {anchor.label}
            </button>
          )
        })}
      </div>
      <p className="text-xs leading-5 text-[#48606F]">{transitionSummary(dimension)}</p>
    </div>
  )
}

function ScalarView({
  value,
  setValue,
}: {
  value: number
  setValue: (value: number) => void
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div className="flex min-h-[300px] items-center justify-center rounded-[28px] border border-[#D6E1E8] bg-[radial-gradient(circle_at_center,_rgba(43,111,151,0.08),_rgba(255,255,255,0)_65%)]">
        <div
          className="dimension-pulse-glow relative h-28 w-28 rounded-full transition-all duration-500"
          style={{
            background: magnitudeToColor(value),
            transform: `scale(${0.72 + value * 0.55})`,
            boxShadow: `0 0 ${18 + value * 44}px rgba(43, 111, 151, ${0.12 + value * 0.38})`,
          }}
        >
          <div className="absolute inset-4 rounded-full border border-white/70" />
          <div className="absolute inset-0 flex items-center justify-center text-xl font-semibold text-[#12202B]">
            {value.toFixed(1)}
          </div>
        </div>
      </div>
      <div className="rounded-[24px] border border-[#D6E1E8] bg-white p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6C8190]">Single value</p>
        <p className="mt-2 text-sm leading-6 text-[#48606F]">
          A scalar is one measured amount. Change the slider and the point only changes intensity, not structure.
        </p>
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between text-sm font-medium text-[#12202B]">
            <span>Value</span>
            <span>{value.toFixed(1)}</span>
          </div>
          <Slider min={0} max={1} step={0.01} value={[value]} onValueChange={(next) => setValue(next[0] ?? 0)} aria-label="Scalar value" />
        </div>
      </div>
    </div>
  )
}

function VectorView({
  vector,
  setVector,
}: {
  vector: [number, number]
  setVector: (value: [number, number]) => void
}) {
  const x = 50 + vector[0] * 38
  const y = 50 - vector[1] * 38

  const updateFromPointer = (event: PointerEvent<SVGSVGElement | SVGCircleElement>) => {
    const svg = event.currentTarget instanceof SVGSVGElement ? event.currentTarget : event.currentTarget.ownerSVGElement
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    const relativeX = clamp((event.clientX - rect.left) / rect.width, 0, 1)
    const relativeY = clamp((event.clientY - rect.top) / rect.height, 0, 1)
    const nextX = Number((((relativeX * 100 - 50) / 38)).toFixed(2))
    const nextY = Number((((50 - relativeY * 100) / 38)).toFixed(2))
    setVector([clamp(nextX, -1, 1), clamp(nextY, -1, 1)])
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div className="flex min-h-[300px] items-center justify-center rounded-[28px] border border-[#D6E1E8] bg-white p-4">
        <svg
          viewBox="0 0 100 100"
          className="h-full w-full max-w-[420px]"
          aria-label="Interactive vector view"
          onPointerMove={(event) => {
            if ((event.buttons & 1) === 1) updateFromPointer(event)
          }}
        >
          <defs>
            <marker id="vector-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3.5" orient="auto">
              <polygon points="0 0, 7 3.5, 0 7" fill="#2B6F97" />
            </marker>
          </defs>
          <line x1="50" y1="8" x2="50" y2="92" stroke="#D6E1E8" strokeWidth="0.8" />
          <line x1="8" y1="50" x2="92" y2="50" stroke="#D6E1E8" strokeWidth="0.8" />
          <line
            x1="50"
            y1="50"
            x2={x}
            y2={y}
            stroke="#2B6F97"
            strokeWidth="2.5"
            markerEnd="url(#vector-arrow)"
            style={{ transition: "all 320ms cubic-bezier(0.22, 1, 0.36, 1)" }}
          />
          <circle cx="50" cy="50" r="1.8" fill="#12202B" />
          <circle
            cx={x}
            cy={y}
            r="4"
            fill="#D98B3A"
            className="cursor-grab active:cursor-grabbing"
            onPointerDown={updateFromPointer}
          />
        </svg>
      </div>
      <div className="rounded-[24px] border border-[#D6E1E8] bg-white p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6C8190]">Direction + magnitude</p>
        <p className="mt-2 text-sm leading-6 text-[#48606F]">
          A vector is the first step where order and direction matter. Drag the endpoint or fine-tune x and y.
        </p>
        <div className="mt-6 space-y-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm font-medium text-[#12202B]">
              <span>X</span>
              <span>{vector[0].toFixed(1)}</span>
            </div>
            <Slider min={-1} max={1} step={0.01} value={[vector[0]]} onValueChange={(next) => setVector([next[0] ?? 0, vector[1]])} aria-label="Vector x value" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm font-medium text-[#12202B]">
              <span>Y</span>
              <span>{vector[1].toFixed(1)}</span>
            </div>
            <Slider min={-1} max={1} step={0.01} value={[vector[1]]} onValueChange={(next) => setVector([vector[0], next[0] ?? 0])} aria-label="Vector y value" />
          </div>
        </div>
      </div>
    </div>
  )
}

function DimensionMorphPreview({ dimension }: { dimension: number }) {
  const scalarWeight = clamp(1 - dimension * 0.55, 0.18, 1)
  const vectorWeight = clamp(1 - Math.abs(dimension - 1) * 0.55, 0.2, 1)
  const matrixWeight = clamp(1 - Math.abs(dimension - 2) * 0.55, 0.18, 1)
  const tensorWeight = clamp((dimension - 1.8) / 2.2, 0.18, 1)

  return (
      <div className="dimension-float-in mb-4 rounded-[24px] border border-[#D6E1E8] bg-white/75 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6C8190]">Same idea. More structure.</p>
          <p className="mt-1 text-lg font-semibold text-[#12202B]">Point -&gt; Line -&gt; Grid -&gt; Layers</p>
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#12202B]">{dimension.toFixed(1)}D</p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <div className="flex flex-col items-center justify-center rounded-[20px] bg-[#F4F8FA] p-4">
          <div
            className="h-6 w-6 rounded-full bg-[#2B6F97] transition-all duration-500"
            style={{ opacity: scalarWeight, transform: `scale(${0.7 + scalarWeight * 0.4})` }}
          />
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#48606F]">Point</p>
        </div>
        <div className="flex flex-col items-center justify-center rounded-[20px] bg-[#F4F8FA] p-4">
          <div className="relative h-10 w-16">
            <div
              className="absolute left-1/2 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-[#2B6F97] transition-all duration-500"
              style={{ width: `${16 + vectorWeight * 34}px`, opacity: vectorWeight }}
            />
          </div>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#48606F]">Line</p>
        </div>
        <div className="flex flex-col items-center justify-center rounded-[20px] bg-[#F4F8FA] p-4">
          <div
            className="grid grid-cols-3 gap-1 transition-all duration-500"
            style={{ opacity: matrixWeight, transform: `scale(${0.72 + matrixWeight * 0.3})` }}
          >
            {Array.from({ length: 9 }).map((_, index) => (
              <div key={index} className="h-3 w-3 rounded-[4px] bg-[#2B6F97]" />
            ))}
          </div>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#48606F]">Grid</p>
        </div>
        <div className="flex flex-col items-center justify-center rounded-[20px] bg-[#F4F8FA] p-4">
          <div className="relative h-10 w-16">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="absolute left-1/2 top-1/2 h-8 w-10 rounded-lg border border-white/70 bg-[#2B6F97] transition-all duration-500"
                style={{
                  opacity: tensorWeight - index * 0.16,
                  transform: `translate(calc(-50% + ${index * 8}px), calc(-50% - ${index * 6}px)) scale(${0.85 - index * 0.06})`,
                }}
              />
            ))}
          </div>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#48606F]">Layers</p>
        </div>
      </div>
    </div>
  )
}

function MatrixHeatmap({
  hoveredCell,
  setHoveredCell,
  showNumbers,
  exampleId,
}: {
  hoveredCell: [number, number] | null
  setHoveredCell: (value: [number, number] | null) => void
  showNumbers: boolean
  exampleId: TensorExampleId | "matrix"
}) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {matrixValues.map((row, rowIndex) =>
        row.map((value, colIndex) => {
          const active = hoveredCell?.[0] === rowIndex && hoveredCell?.[1] === colIndex
          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              onMouseEnter={() => setHoveredCell([rowIndex, colIndex])}
              onMouseLeave={() => setHoveredCell(null)}
              onClick={() => setHoveredCell([rowIndex, colIndex])}
              className={`flex aspect-square items-center justify-center rounded-2xl border text-sm font-semibold transition-all duration-300 ${
                active ? "scale-[1.05] border-white shadow-lg" : "border-white/40"
              }`}
              style={{ background: matrixCellColor(value, exampleId) }}
            >
              {showNumbers ? value.toFixed(2) : <div className="h-7 w-7 rounded-full bg-white/35" />}
            </div>
          )
        })
      )}
    </div>
  )
}

function MatrixView({
  hoveredCell,
  setHoveredCell,
  showNumbers,
  setShowNumbers,
}: {
  hoveredCell: [number, number] | null
  setHoveredCell: (value: [number, number] | null) => void
  showNumbers: boolean
  setShowNumbers: (value: boolean) => void
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div className="rounded-[28px] border border-[#D6E1E8] bg-white p-5">
        <MatrixHeatmap hoveredCell={hoveredCell} setHoveredCell={setHoveredCell} showNumbers={showNumbers} exampleId="matrix" />
      </div>
      <div className="rounded-[24px] border border-[#D6E1E8] bg-white p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6C8190]">Rows + columns</p>
            <p className="mt-2 text-sm leading-6 text-[#48606F]">
              A matrix organizes many values in a 2D layout. Hover or tap any cell to inspect a location.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowNumbers(!showNumbers)}
            className="rounded-full border border-[#D6E1E8] px-3 py-1.5 text-xs font-semibold text-[#12202B] transition hover:border-[#2B6F97]"
          >
            {showNumbers ? "Show structure" : "Show values"}
          </button>
        </div>
        <div className="mt-6 rounded-2xl bg-[#F4F8FA] p-4 text-sm text-[#48606F]">
          {hoveredCell ? (
            <p>
              Cell [{hoveredCell[0]}, {hoveredCell[1]}] ={" "}
              <span className="font-semibold text-[#12202B]">{matrixValues[hoveredCell[0]]?.[hoveredCell[1]]?.toFixed(2)}</span>
            </p>
          ) : (
            <p>Hover or tap a square to see how a matrix stores values by position.</p>
          )}
        </div>
      </div>
    </div>
  )
}

function TensorView({
  hoveredCell,
  setHoveredCell,
  tensorRank,
  setTensorRank,
  tensorExample,
  setTensorExample,
  showNumbers,
  setShowNumbers,
}: {
  hoveredCell: [number, number] | null
  setHoveredCell: (value: [number, number] | null) => void
  tensorRank: number
  setTensorRank: (value: number) => void
  tensorExample: TensorExampleId
  setTensorExample: (value: TensorExampleId) => void
  showNumbers: boolean
  setShowNumbers: (value: boolean) => void
}) {
  const scenario = tensorScenario(tensorExample, tensorRank)
  const shape = scenario.shape
  const visibleLayers = clamp(shape[0] ?? 3, 3, 5)
  const layerTone = tensorExample === "rgb" ? "#D98B3A" : tensorExample === "video" ? "#2F7D6F" : "#6B46C1"

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="flex min-h-[320px] items-center justify-center rounded-[28px] border border-[#D6E1E8] bg-white px-4 py-8">
        <div className="relative h-[240px] w-full max-w-[420px]">
          {Array.from({ length: visibleLayers }).map((_, index) => {
            const offset = index * 22
            const scale = 1 - index * 0.05
            return (
              <div
                key={index}
                className="absolute left-1/2 top-1/2 w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-[22px] border bg-white p-4 transition-all duration-500 hover:shadow-[0_26px_50px_rgba(18,32,43,0.14)]"
                style={{
                  transform: `translate(calc(-50% + ${offset}px), calc(-50% - ${offset}px)) scale(${scale})`,
                  borderColor: "rgba(214,225,232,0.9)",
                  boxShadow: `0 18px 40px rgba(18,32,43,0.08), 0 0 0 1px rgba(255,255,255,0.7) inset`,
                  opacity: 1 - index * 0.14,
                }}
              >
                <MatrixHeatmap hoveredCell={hoveredCell} setHoveredCell={setHoveredCell} showNumbers={showNumbers} exampleId={tensorExample} />
                <div
                  className="mt-3 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]"
                  style={{ background: `${layerTone}18`, color: layerTone }}
                >
                  Layer {index + 1}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className="rounded-[24px] border border-[#D6E1E8] bg-white p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6C8190]">Stacked structure</p>
        <p className="mt-2 text-sm leading-6 text-[#48606F]">
          A tensor isn't a new thing. It's what happens when a matrix isn't enough anymore, so you add another axis. And then another.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {(["rgb", "video", "batch"] as TensorExampleId[]).map((exampleId) => {
            const active = tensorExample === exampleId
            const label = examples.find((example) => example.id === exampleId)?.label ?? exampleId
            return (
              <button
                key={exampleId}
                type="button"
                onClick={() => setTensorExample(exampleId)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  active ? "border-[#12202B] bg-[#12202B] text-white" : "border-[#D6E1E8] text-[#48606F]"
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between text-sm font-medium text-[#12202B]">
            <span>Axes in view</span>
            <span>{tensorRank} axes</span>
          </div>
          <Slider min={3} max={5} step={1} value={[tensorRank]} onValueChange={(next) => setTensorRank(next[0] ?? 3)} aria-label="Tensor rank" />
        </div>
        <div className="mt-4 rounded-2xl bg-[#F4F8FA] p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-[#6C8190]">{scenario.label}</p>
          <p className="mt-2 text-sm leading-6 text-[#48606F]">{scenario.detail}</p>
        </div>
        <div className="mt-5 flex items-center justify-between rounded-2xl bg-[#F4F8FA] px-4 py-3 text-sm text-[#48606F]">
          <span>View style</span>
          <button type="button" onClick={() => setShowNumbers(!showNumbers)} className="font-semibold text-[#12202B]">
            {showNumbers ? "Show structure" : "Show values"}
          </button>
        </div>
        <div className="mt-4 rounded-2xl border border-dashed border-[#D6E1E8] p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-[#6C8190]">Shape</p>
          <p className="mt-2 text-lg font-semibold text-[#12202B]">({shape.join(", ")})</p>
        </div>
      </div>
    </div>
  )
}

function VisualizationCanvas({
  mode,
  dimension,
  scalarValue,
  setScalarValue,
  vector,
  setVector,
  hoveredCell,
  setHoveredCell,
  showNumbers,
  setShowNumbers,
  tensorRank,
  setTensorRank,
  tensorExample,
  setTensorExample,
  reduceMotion,
}: {
  mode: Mode
  dimension: number
  scalarValue: number
  setScalarValue: (value: number) => void
  vector: [number, number]
  setVector: (value: [number, number]) => void
  hoveredCell: [number, number] | null
  setHoveredCell: (value: [number, number] | null) => void
  showNumbers: boolean
  setShowNumbers: (value: boolean) => void
  tensorRank: number
  setTensorRank: (value: number) => void
  tensorExample: TensorExampleId
  setTensorExample: (value: TensorExampleId) => void
  reduceMotion: boolean
}) {
  return (
    <div className="rounded-[32px] border border-[#D6E1E8] bg-[linear-gradient(180deg,_rgba(255,255,255,0.96),_rgba(244,248,250,0.98))] p-4 shadow-[0_24px_60px_rgba(18,32,43,0.08)] md:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6C8190]">Visualization</p>
          <p className="mt-1 text-sm text-[#48606F]">Each step keeps the old idea and adds one more axis of organization.</p>
        </div>
        <div className="hidden rounded-full border border-[#D6E1E8] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#12202B] md:block">
          {mode}
        </div>
      </div>

      <DimensionMorphPreview dimension={dimension} />
      <div className="mb-4 rounded-[20px] border border-[#D6E1E8] bg-white/80 px-4 py-3 text-sm text-[#48606F]">
        <span className="font-semibold text-[#12202B]">What you are seeing:</span> {transitionSummary(dimension)}
      </div>

      <div className="relative overflow-hidden rounded-[28px] border border-[#D6E1E8] bg-[linear-gradient(135deg,_rgba(247,251,253,0.94),_rgba(238,245,248,0.9)_55%,_rgba(249,245,236,0.85))] p-3 md:p-4">
        <div className="dimension-lab-grid dimension-grid-drift absolute inset-0 opacity-70" />
        <div
          key={mode}
          className="dimension-float-in relative"
          style={{
            transition: reduceMotion ? undefined : "opacity 320ms ease, transform 320ms ease",
            opacity: 1,
            transform: "translateY(0px) scale(1)",
          }}
        >
          {mode === "scalar" ? <ScalarView value={scalarValue} setValue={setScalarValue} /> : null}
          {mode === "vector" ? <VectorView vector={vector} setVector={setVector} /> : null}
          {mode === "matrix" ? (
            <MatrixView
              hoveredCell={hoveredCell}
              setHoveredCell={setHoveredCell}
              showNumbers={showNumbers}
              setShowNumbers={setShowNumbers}
            />
          ) : null}
          {mode === "tensor" ? (
            <TensorView
              hoveredCell={hoveredCell}
              setHoveredCell={setHoveredCell}
              tensorRank={tensorRank}
              setTensorRank={setTensorRank}
              tensorExample={tensorExample}
              setTensorExample={setTensorExample}
              showNumbers={showNumbers}
              setShowNumbers={setShowNumbers}
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}

function ExplanationPanel({
  mode,
  dimension,
  showMath,
  setShowMath,
  tensorExample,
  tensorRank,
  liveShape,
}: {
  mode: Mode
  dimension: number
  showMath: boolean
  setShowMath: (value: boolean) => void
  tensorExample: TensorExampleId
  tensorRank: number
  liveShape: string
}) {
  const copy = {
    scalar: {
      title: "Scalar",
      summary: "A scalar is one value.",
      detail: "It answers how much, how hot, or how fast.",
      structure: "No structure. No relationships. Just a number.",
      math: "()",
    },
    vector: {
      title: "Vector",
      summary: "A vector gives a value direction.",
      detail: "A vector adds one axis, so values now have order, magnitude, and direction.",
      structure: "You can move along the axis and inspect each coordinate.",
      math: "(n,)",
    },
    matrix: {
      title: "Matrix",
      summary: "A grid of values.",
      detail: "A matrix adds another axis, turning a line of values into rows and columns.",
      structure: "Position starts carrying meaning: row + column.",
      math: "(m, n)",
    },
    tensor: {
      title: "Tensor",
      summary: "A stack or collection of matrices across more axes.",
      detail: "A tensor isn't a new thing. It's what happens when a matrix isn't enough anymore, so you add another axis. And then another.",
      structure: `Current example: ${tensorScenario(tensorExample, tensorRank).label}.`,
      math: "(b, c, h, w)",
    },
  }[mode]

  return (
    <section className="dimension-lab-surface dimension-float-in dimension-stagger-1 rounded-[28px] border border-[#D6E1E8] p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6C8190]">Why this matters</p>
          <h2 className="mt-2 text-2xl font-semibold text-[#12202B]">{copy.title}</h2>
        </div>
        <button
          type="button"
          onClick={() => setShowMath(!showMath)}
          className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
            showMath ? "border-[#12202B] bg-[#12202B] text-white" : "border-[#D6E1E8] text-[#12202B]"
          }`}
        >
          {showMath ? "Hide math" : "Show math"}
        </button>
      </div>

      <p className="mt-4 text-lg font-medium text-[#12202B]">{copy.summary}</p>
      <p className="mt-3 text-sm leading-6 text-[#48606F]">{copy.detail}</p>
      <p className="mt-3 text-sm leading-6 text-[#48606F]">{copy.structure}</p>

      <div className="mt-5 rounded-2xl bg-[#F4F8FA] p-4">
        <p className="mt-2 text-sm leading-6 text-[#12202B]">
          Each step doesn&apos;t replace the last.
        </p>
        <p className="mt-2 text-sm leading-6 text-[#12202B]">It builds on it.</p>
        <p className="mt-3 text-sm font-semibold text-[#2B6F97]">
          Live shape: <span className="text-[#12202B]">{liveShape}</span>
        </p>
        {showMath ? (
          <p className="mt-3 text-sm font-semibold text-[#2B6F97]">
            Shape notation: <span className="text-[#12202B]">{copy.math}</span>
          </p>
        ) : null}
      </div>

      <div className="mt-5 rounded-2xl border border-[#D6E1E8] bg-white p-4">
        <p className="text-xs uppercase tracking-[0.18em] text-[#6C8190]">Why this actually matters</p>
        <p className="mt-2 text-sm leading-6 text-[#12202B]">
          Models don&apos;t care about your data. They care about the shape of your data.
        </p>
        <p className="mt-2 text-sm leading-6 text-[#48606F]">
          Wrong shape means broken inputs, broken training runs, or broken systems. Right shape is what lets the rest of the stack work.
        </p>
      </div>
    </section>
  )
}

function RealWorldPanel({
  activeExample,
  onSelect,
}: {
  activeExample: Example["id"]
  onSelect: (id: Example["id"]) => void
}) {
  return (
    <section className="dimension-lab-surface dimension-float-in dimension-stagger-2 rounded-[28px] border border-[#D6E1E8] p-5">
      <div className="flex items-center gap-2 text-[#12202B]">
        <ScanSearch className="h-4 w-4" />
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6C8190]">Real-world mapping</p>
      </div>
      <div className="mt-4 grid gap-3">
        {examples.map((example) => {
          const active = activeExample === example.id
          return (
            <button
              key={example.id}
              type="button"
              onClick={() => onSelect(example.id)}
              className={`dimension-hover-lift rounded-[22px] border p-4 text-left transition ${
                active
                  ? "border-[#12202B] bg-[#12202B] text-white shadow-[0_18px_32px_rgba(18,32,43,0.16)]"
                  : "border-[#D6E1E8] bg-white text-[#12202B] hover:border-[#2B6F97]"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">{example.label}</p>
                  <p className={`mt-2 text-sm leading-6 ${active ? "text-white/82" : "text-[#48606F]"}`}>{example.blurb}</p>
                </div>
                <ChevronRight className={`h-4 w-4 ${active ? "text-white" : "text-[#6C8190]"}`} />
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export function ScalarVectorMatrixTensorClient() {
  const reduceMotion = useReducedMotion()
  const [dimension, setDimension] = useState(0)
  const [scalarValue, setScalarValue] = useState(0.58)
  const [vector, setVector] = useState<[number, number]>([0.68, 0.42])
  const [hoveredCell, setHoveredCell] = useState<[number, number] | null>(null)
  const [showNumbers, setShowNumbers] = useState(true)
  const [showMath, setShowMath] = useState(false)
  const [tensorRank, setTensorRank] = useState(4)
  const [tensorExample, setTensorExample] = useState<TensorExampleId>("rgb")
  const [activeExample, setActiveExample] = useState<Example["id"]>("scalar")
  const [shareState, setShareState] = useState<"idle" | "copying" | "copied" | "error">("idle")
  const mode = modeFromDimension(dimension)

  const linkedInShareHref = useMemo(() => buildLinkedInShareHref(PAGE_URL, PAGE_TITLE), [])
  const xShareHref = useMemo(
    () => `https://x.com/intent/tweet?url=${encodeURIComponent(PAGE_URL)}&text=${encodeURIComponent(PAGE_TITLE)}`,
    []
  )
  const liveShape = useMemo(() => {
    if (mode === "scalar") return "()"
    if (mode === "vector") return "(2,)"
    if (mode === "matrix") return "(5, 5)"
    return `(${tensorScenario(tensorExample, tensorRank).shape.join(", ")})`
  }, [mode, tensorExample, tensorRank])

  const handleTabSelect = (nextMode: Mode) => {
    setDimension(tabs.find((tab) => tab.id === nextMode)?.dimension ?? 0)
    setActiveExample(nextMode === "tensor" ? tensorExample : nextMode)
  }

  const handleDimensionChange = (nextDimension: number) => {
    setDimension(nextDimension)
    const nextMode = modeFromDimension(nextDimension)
    if (nextMode === "tensor") {
      setActiveExample(tensorExample)
      return
    }
    setActiveExample(nextMode)
  }

  const handleExampleSelect = (nextExample: Example["id"]) => {
    setActiveExample(nextExample)

    if (nextExample === "scalar" || nextExample === "vector" || nextExample === "matrix") {
      setDimension(tabs.find((tab) => tab.id === nextExample)?.dimension ?? 0)
      return
    }

    setTensorExample(nextExample)
    setDimension(3)
  }

  const handleShare = async () => {
    if (shareState === "copying") return
    setShareState("copying")
    const result = await shareOrCopyUrl(PAGE_TITLE, PAGE_URL)
    setShareState(result === "shared" || result === "copied" ? "copied" : "error")
    window.setTimeout(() => setShareState("idle"), 2200)
  }

  return (
    <div className="dimension-lab-theme min-h-screen bg-[#F6F8FA] text-[#12202B]">
      <SiteHeader />
      <main className="bg-[radial-gradient(circle_at_top_left,_rgba(43,111,151,0.08),_rgba(246,248,250,0)_30%),linear-gradient(180deg,_#F6F8FA_0%,_#EEF3F7_100%)]">
        <section className="border-b border-[#D6E1E8] bg-white">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="relative grid min-h-[64vh] gap-6 py-8 md:min-h-[calc(86vh-4rem)] md:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.9fr)] md:items-center md:gap-10 md:py-12">
              <div className="space-y-5">
                <nav aria-label="Breadcrumb">
                  <ol className="flex flex-wrap items-center gap-2 text-sm text-[#48606F]">
                    <li>
                      <Link href="/interactive" className="transition hover:text-[#12202B]">
                        Interactive
                      </Link>
                    </li>
                    <li>/</li>
                    <li aria-current="page">Scalar vs Vector vs Matrix vs Tensor</li>
                  </ol>
                </nav>

                <div className="space-y-3">
                  <h1 className="max-w-4xl text-4xl font-bold leading-tight text-[#12202B] md:text-5xl">
                    Scalar, vector, matrix, tensor.
                  </h1>
                  <p className="text-2xl font-medium text-[#445561]">
                    The structure changes. The idea does not.
                  </p>
                  <p data-page-summary className="max-w-2xl text-base leading-7 text-[#48606F]">
                    Move from one value to ordered values, grids, and model-ready tensors. Explore how each step adds axes and structure rather than inventing a new concept.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Button asChild>
                    <Link href="#dimension-lab">Open the interactive</Link>
                  </Button>
                  <Button variant="ghost" size="sm" className="text-[#48606F] hover:text-[#12202B]" onClick={handleShare}>
                    <Share2 className="mr-2 h-4 w-4" />
                    {shareState === "copied" ? "Link copied" : shareState === "error" ? "Copy failed" : "Share"}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-[#48606F] hover:text-[#12202B]" asChild>
                    <Link href={linkedInShareHref} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="mr-2 h-4 w-4" />
                      LinkedIn
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" className="text-[#48606F] hover:text-[#12202B]" asChild>
                    <Link href={xShareHref} target="_blank" rel="noopener noreferrer">
                      Share on X
                    </Link>
                  </Button>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-sm text-[#6C8190]">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <time dateTime="2026-03-19">March 19, 2026</time>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4" />
                    <span>8 min read</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="relative overflow-hidden rounded-xl border border-[#D6E1E8] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.18)]">
                  <div className="relative aspect-[16/10] w-full md:aspect-[16/11]">
                    <Image
                      src="/Scalarvectormatrixtensor.png"
                      alt="Scalar vs vector vs matrix vs tensor hero artwork"
                      fill
                      priority
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

              <div className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 md:block">
                <button
                  type="button"
                  onClick={() => document.getElementById("dimension-lab")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" })}
                  className="inline-flex items-center gap-2 rounded-full border border-[#D6E1E8] bg-white/92 px-3 py-1.5 text-xs font-medium text-[#445561] shadow-sm transition duration-200 hover:bg-[#F8FBFD]"
                >
                  Scroll
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section id="dimension-lab" className="mx-auto max-w-7xl px-4 pb-10 md:px-6 md:pb-14">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.75fr)]">
            <div className="space-y-6">
              <div className="dimension-lab-surface rounded-[30px] border border-[#D6E1E8] p-5 md:p-6">
                <div className="flex flex-col gap-5">
                  <Tabs activeMode={mode} onSelect={handleTabSelect} />
                  <DimensionSlider dimension={dimension} onChange={handleDimensionChange} />
                </div>
              </div>

              <VisualizationCanvas
                mode={mode}
                dimension={dimension}
                scalarValue={scalarValue}
                setScalarValue={setScalarValue}
                vector={vector}
                setVector={setVector}
                hoveredCell={hoveredCell}
                setHoveredCell={setHoveredCell}
                showNumbers={showNumbers}
                setShowNumbers={setShowNumbers}
                tensorRank={tensorRank}
                setTensorRank={setTensorRank}
                tensorExample={tensorExample}
                setTensorExample={setTensorExample}
                reduceMotion={reduceMotion}
              />
            </div>

            <div className="space-y-6">
              <ExplanationPanel
                mode={mode}
                dimension={dimension}
                showMath={showMath}
                setShowMath={setShowMath}
                tensorExample={tensorExample}
                tensorRank={tensorRank}
                liveShape={liveShape}
              />
              <RealWorldPanel activeExample={activeExample} onSelect={handleExampleSelect} />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
