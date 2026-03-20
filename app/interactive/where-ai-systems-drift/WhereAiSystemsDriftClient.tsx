"use client"

import { useEffect, useMemo, useState } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import Image from "next/image"
import Link from "next/link"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { buildLinkedInShareHref, shareOrCopyUrl } from "@/lib/share-client"
import { actualFailureStats, driftLayers, enterpriseSearchFailure, perceivedFailureStats, type Concept } from "./data"
import { ArrowDown, Calendar, ChevronLeft, ChevronRight, ClipboardCheck, Clock3, Cpu, Database, LayoutTemplate, Linkedin, MessageSquareQuote, Share2, ShieldCheck, Target, Waves, X } from "lucide-react"
import "./where-ai-systems-drift-theme.css"

const PAGE_TITLE = "Where AI Systems Drift"
const PAGE_URL = "https://johnmunn.tech/interactive/where-ai-systems-drift"

const iconMap = {
  target: Target,
  layout: LayoutTemplate,
  messageSquare: MessageSquareQuote,
  database: Database,
  cpu: Cpu,
  shield: ShieldCheck,
  clipboardCheck: ClipboardCheck,
} as const

const compactLabels = ["Intent", "App", "Prompt", "Retrieval", "Model", "Output", "Eval"] as const
const tabs = [
  { id: "controls", label: "Controls" },
  { id: "drift", label: "Drift" },
  { id: "example", label: "Example" },
  { id: "simulator", label: "Simulator" },
] as const

type DetailTab = (typeof tabs)[number]["id"]

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

export function WhereAiSystemsDriftClient() {
  const reduceMotion = useReducedMotion()
  const [activeLayerId, setActiveLayerId] = useState(driftLayers[0].id)
  const [activeTab, setActiveTab] = useState<DetailTab>("controls")
  const [activeControlId, setActiveControlId] = useState(driftLayers[0].concepts[0]?.id ?? "")
  const [shareState, setShareState] = useState<"idle" | "copying" | "copied" | "error">("idle")
  const [heroReady, setHeroReady] = useState(false)
  const [traceMode, setTraceMode] = useState(false)
  const [traceStep, setTraceStep] = useState<number | null>(null)
  const [isFailureDialogOpen, setIsFailureDialogOpen] = useState(false)
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false)
  const [failureStepIndex, setFailureStepIndex] = useState(0)
  const [temperature, setTemperature] = useState(0.2)
  const [contextQuality, setContextQuality] = useState(0.88)
  const [promptClarity, setPromptClarity] = useState(0.9)

  const activeLayer = useMemo(
    () => driftLayers.find((layer) => layer.id === activeLayerId) ?? driftLayers[0],
    [activeLayerId]
  )
  const activeLayerIndex = driftLayers.findIndex((layer) => layer.id === activeLayer.id)

  const activeControl = activeLayer.concepts.find((concept) => concept.id === activeControlId) ?? activeLayer.concepts[0]

  useEffect(() => {
    setActiveControlId(activeLayer.concepts[0]?.id ?? "")
  }, [activeLayerId, activeLayer.concepts])

  useEffect(() => {
    if (reduceMotion) {
      setHeroReady(true)
      return
    }
    const frame = window.requestAnimationFrame(() => setHeroReady(true))
    return () => window.cancelAnimationFrame(frame)
  }, [reduceMotion])

  useEffect(() => {
    if (!traceMode) {
      setTraceStep(null)
      return
    }

    if (reduceMotion) {
      setTraceStep(driftLayers.length - 1)
      return
    }

    setTraceStep(0)
    const timers = driftLayers.map((_, index) =>
      window.setTimeout(() => {
        setTraceStep(index)
      }, index * 120)
    )

    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [traceMode, reduceMotion])

  const handleShare = async () => {
    if (shareState === "copying") return
    setShareState("copying")
    const result = await shareOrCopyUrl(PAGE_TITLE, PAGE_URL)
    setShareState(result === "shared" || result === "copied" ? "copied" : "error")
    window.setTimeout(() => setShareState("idle"), 2200)
  }

  const linkedInShareHref = buildLinkedInShareHref(PAGE_URL, PAGE_TITLE)
  const xShareHref = `https://x.com/intent/tweet?url=${encodeURIComponent(PAGE_URL)}&text=${encodeURIComponent(PAGE_TITLE)}`
  const failureStep = enterpriseSearchFailure.steps[failureStepIndex]

  const simulatorRisk = temperature * 0.35 + (1 - contextQuality) * 0.4 + (1 - promptClarity) * 0.45
  const simulatorSeverity = simulatorRisk < 0.28 ? "stable" : simulatorRisk < 0.58 ? "strained" : "drifting"
  const simulatorSummary =
    simulatorSeverity === "stable"
      ? {
          label: "Controlled system",
          color: "#3A6EA5",
          response: "Payments likely degraded after the recent gateway migration because retries rose and authorization timeouts spiked.",
          detail: "The answer stays grounded because the prompt is clear, context quality is high, and decoding stays disciplined.",
          symptoms: ["Evidence stays specific", "Claims stay bounded", "Tone remains operational"],
        }
      : simulatorSeverity === "strained"
        ? {
            label: "Partial drift",
            color: "#F59E0B",
            response: "The migration appears related to payment failures, possibly through timeout handling or routing instability, though the exact trigger is less certain.",
            detail: "One weak layer is forcing the model to hedge or interpolate more than it should.",
            symptoms: [
              promptClarity < 0.6 ? "Prompt ambiguity broadens the answer" : "Retrieval gaps force extrapolation",
              contextQuality < 0.65 ? "Evidence feels thin or stale" : "Tone grows more speculative",
              temperature > 0.6 ? "Language becomes more elastic" : "Confidence weakens unevenly",
            ],
          }
        : {
            label: "High drift risk",
            color: "#DC4C3F",
            response: "The payment disruption likely reflects a cascading weakness in the gateway transition, where architectural fragility and historical instability resurfaced after deployment.",
            detail: "Low prompt clarity or poor context quality now gives the model room to invent causal structure and unsupported evidence.",
            symptoms: [
              promptClarity < 0.55 ? "Prompt clarity drop causes the system to answer the wrong question" : "Prompt still leaves room for narrative invention",
              contextQuality < 0.55 ? "Weak context quality makes the model invent evidence" : "Context is present but misprioritized",
              temperature > 0.7 ? "Higher temperature pushes phrasing into speculation" : "Even low temperature cannot save bad grounding",
            ],
          }

  return (
    <div className="drift-atlas-theme flex min-h-screen flex-col bg-[#F6F8FA]">
      <SiteHeader />

      <main className="flex-1">
        <section className="border-b border-[#D6DEE6] bg-white">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="relative grid min-h-[64vh] grid-cols-1 items-start gap-8 py-8 md:min-h-[calc(88vh-4rem)] md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] md:items-center md:gap-10 md:py-12">
              <div className="space-y-6">
                <div className="space-y-3">
                  <nav aria-label="Breadcrumb">
                    <ol className="flex flex-wrap items-center gap-2 text-sm text-[#475569]">
                      <li>
                        <Link
                          href="/interactive"
                          className="rounded-sm transition-colors hover:text-[#1A232B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3A6EA5] focus-visible:ring-offset-2"
                        >
                          Interactive
                        </Link>
                      </li>
                      <li aria-hidden="true">/</li>
                      <li aria-current="page">Where AI Systems Drift</li>
                    </ol>
                  </nav>
                  <h1 className="text-4xl font-bold leading-tight text-[#1A232B] lg:text-5xl">
                    Where AI Systems Drift, and How We Bring Them Back
                  </h1>
                  <p className="text-2xl font-medium text-[#445561]">
                    AI systems don&apos;t fail in one place. They drift across layers.
                  </p>
                  <p data-page-summary className="max-w-2xl text-base leading-7 text-[#475569]">
                    Explore the stack from user intent to evaluation, inspect the controls used at each layer, and see how reliability comes from system design rather than model tuning alone.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Button asChild>
                    <Link href="#system-inspector">Open inspector</Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#475569] hover:text-[#1A232B] !hover:bg-transparent !active:bg-transparent !focus-visible:bg-transparent"
                    onClick={handleShare}
                    disabled={shareState === "copying"}
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    {shareState === "copied" ? "Link copied" : shareState === "error" ? "Copy failed" : "Share"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#475569] hover:text-[#1A232B] !hover:bg-transparent !active:bg-transparent !focus-visible:bg-transparent"
                    asChild
                  >
                    <Link href={linkedInShareHref} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="mr-2 h-4 w-4" />
                      LinkedIn
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#475569] hover:text-[#1A232B] !hover:bg-transparent !active:bg-transparent !focus-visible:bg-transparent"
                    asChild
                  >
                    <Link href={xShareHref} target="_blank" rel="noopener noreferrer">
                      Share on X
                    </Link>
                  </Button>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-sm text-[#475569]">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <time dateTime="2026-03-14">March 14, 2026</time>
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
                      src="/whereAISystemsDrift.png"
                      alt="Where AI Systems Drift hero artwork"
                      fill
                      priority
                      className={`object-cover transition-all ${
                        heroReady ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                      }`}
                      style={{
                        transitionDuration: reduceMotion ? undefined : "420ms",
                        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <button
                  type="button"
                  onClick={() => document.getElementById("system-inspector")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" })}
                  className="inline-flex items-center gap-2 rounded-full border border-[#D6DEE6] bg-white/92 px-3 py-1.5 text-xs font-medium text-[#445561] shadow-sm transition-colors hover:bg-[#F8FBFD]"
                >
                  Scroll
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section id="system-inspector" className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
          <div className="grid gap-6 lg:grid-cols-[230px_minmax(0,1fr)] lg:items-start">
            <aside className="lg:sticky lg:top-24">
              <CompactStack
                activeLayerId={activeLayerId}
                onSelect={setActiveLayerId}
                traceMode={traceMode}
                traceStep={traceStep}
              />
            </aside>

            <section className="rounded-[28px] border border-[#D6DEE6] bg-white p-5 shadow-[0_16px_42px_rgba(15,23,42,0.08)] md:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-2xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em]" style={{ color: activeLayer.color }}>
                    {String(activeLayerIndex + 1).padStart(2, "0")} {compactLabels[activeLayerIndex]}
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold text-[#1A232B]">{activeLayer.name}</h2>
                  <p className="mt-2 text-base leading-7 text-[#475569]">{activeLayer.description}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className="rounded-full border px-3 py-1.5 text-sm font-medium transition-colors"
                      style={{
                        borderColor: activeTab === tab.id ? activeLayer.color : "#D6DEE6",
                        backgroundColor: activeTab === tab.id ? activeLayer.accent : "#FFFFFF",
                        color: activeTab === tab.id ? "#1A232B" : "#475569",
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                {activeTab === "controls" ? (
                  <ControlsTab
                    layer={activeLayer}
                    activeControl={activeControl}
                    activeControlId={activeControlId}
                    onSelectControl={setActiveControlId}
                  />
                ) : null}

                {activeTab === "drift" ? (
                  <DriftTab
                    traceMode={traceMode}
                    onToggleTrace={() => setTraceMode((current) => !current)}
                    labels={driftLayers.map((_, index) => getTraceStatus(index))}
                  />
                ) : null}

                {activeTab === "example" ? (
                  <div className="rounded-2xl border border-[#E5EBF2] bg-[#FAFCFE] p-5">
                    <p className="text-sm leading-7 text-[#475569]">
                      Open the failure walkthrough as a focused modal instead of rendering it inline.
                    </p>
                    <Button className="mt-4" onClick={() => setIsFailureDialogOpen(true)}>
                      View Failure Example
                    </Button>
                  </div>
                ) : null}

                {activeTab === "simulator" ? (
                  <div className="rounded-2xl border border-[#E5EBF2] bg-[#FAFCFE] p-5">
                    <p className="text-sm leading-7 text-[#475569]">
                      Launch the simulator in a slide-out drawer when you want to inspect parameter sensitivity without adding more page height.
                    </p>
                    <Button className="mt-4" onClick={() => setIsSimulatorOpen(true)}>
                      Open Simulator
                    </Button>
                  </div>
                ) : null}
              </div>
            </section>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            <FailureBarsSection />
            <aside className="rounded-[28px] border border-[#D6DEE6] bg-white p-5 shadow-[0_16px_42px_rgba(15,23,42,0.08)] md:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#64748B]">Takeaway</p>
              <h3 className="mt-2 text-2xl font-semibold text-[#1A232B]">Alignment is not a prompt trick.</h3>
              <p className="mt-2 text-sm font-medium text-[#445561]">It&apos;s a systems discipline.</p>
              <ul className="mt-5 space-y-3 text-sm leading-6 text-[#475569]">
                <li>Strong outputs start with correct task framing, not only prompt polish.</li>
                <li>Retrieval, tools, and validation are often where factual drift is reduced most.</li>
                <li>Evaluation is what tells you whether controls still work after the system changes.</li>
              </ul>
            </aside>
          </div>
        </section>
      </main>

      <FailureExampleDialog
        open={isFailureDialogOpen}
        onOpenChange={setIsFailureDialogOpen}
        currentStep={failureStep}
        currentStepIndex={failureStepIndex}
        setCurrentStepIndex={setFailureStepIndex}
      />

      <SimulatorDrawer
        open={isSimulatorOpen}
        onOpenChange={setIsSimulatorOpen}
        temperature={temperature}
        setTemperature={setTemperature}
        contextQuality={contextQuality}
        setContextQuality={setContextQuality}
        promptClarity={promptClarity}
        setPromptClarity={setPromptClarity}
        simulatorSeverity={simulatorSeverity}
        simulatorSummary={simulatorSummary}
      />

      <SiteFooter />
    </div>
  )
}

function CompactStack({
  activeLayerId,
  onSelect,
  traceMode,
  traceStep,
}: {
  activeLayerId: string
  onSelect: (layerId: string) => void
  traceMode: boolean
  traceStep: number | null
}) {
  return (
    <div className="rounded-[28px] border border-[#D6DEE6] bg-white p-4 shadow-[0_16px_42px_rgba(15,23,42,0.1)] md:p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#64748B]">Stack Nav</p>
      <div className="mt-4 space-y-2">
        {driftLayers.map((layer, index) => {
          const Icon = iconMap[layer.icon]
          const isActive = layer.id === activeLayerId
          const isTraceVisited = traceMode && traceStep != null && index <= traceStep
          const status = getTraceStatus(index)
          return (
            <button
              key={layer.id}
              type="button"
              onClick={() => onSelect(layer.id)}
              className={`block w-full rounded-2xl border px-3 py-3 text-left transition-all ${isTraceVisited ? "drift-cascade-pulse" : ""}`}
              style={{
                borderColor: isActive ? layer.color : isTraceVisited ? "#F3B6AF" : "#D6DEE6",
                backgroundColor: isActive ? layer.accent : isTraceVisited ? "#FFF4F3" : "#FFFFFF",
              }}
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#64748B]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5 text-[#64748B]" aria-hidden="true" />
                    <p className="text-sm font-semibold text-[#1A232B]">{compactLabels[index]}</p>
                  </div>
                  {traceMode ? (
                    <p className="mt-1 text-xs text-[#B9382A]">
                      <span className="mr-1">{status.icon}</span>
                      {status.label}
                    </p>
                  ) : null}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function ControlsTab({
  layer,
  activeControl,
  activeControlId,
  onSelectControl,
}: {
  layer: (typeof driftLayers)[number]
  activeControl: Concept
  activeControlId: string
  onSelectControl: (controlId: string) => void
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="overflow-hidden rounded-2xl border border-[#E5EBF2] bg-[#FAFCFE]">
        <div className="grid grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] border-b border-[#E5EBF2] bg-white px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#64748B]">
          <p>Control name</p>
          <p>Short purpose</p>
        </div>
        <div className="divide-y divide-[#E5EBF2]">
          {layer.concepts.map((concept) => (
            <button
              key={concept.id}
              type="button"
              onClick={() => onSelectControl(concept.id)}
              className="grid w-full grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] gap-4 px-4 py-3 text-left transition-colors hover:bg-white"
              style={{ backgroundColor: activeControlId === concept.id ? layer.accent : "transparent" }}
            >
              <p className="text-sm font-semibold text-[#1A232B]">{concept.name}</p>
              <p className="text-sm text-[#475569]">{concept.summary}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-[#E5EBF2] bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: layer.color }}>
          On-demand detail
        </p>
        <h3 className="mt-2 text-xl font-semibold text-[#1A232B]">{activeControl.name}</h3>
        <p className="mt-3 text-sm leading-6 text-[#475569]">{activeControl.summary}</p>
        <div className="mt-4 rounded-2xl border border-[#E5EBF2] bg-[#FAFCFE] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#64748B]">Explanation</p>
          <p className="mt-2 text-sm leading-6 text-[#445561]">{activeControl.driftControl}</p>
        </div>
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#64748B]">Pros</p>
          <p className="mt-2 text-sm leading-6 text-[#475569]">{activeControl.pros.join(" • ")}</p>
        </div>
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#64748B]">Cons</p>
          <p className="mt-2 text-sm leading-6 text-[#475569]">{activeControl.cons.join(" • ")}</p>
        </div>
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#64748B]">When to use</p>
          <p className="mt-2 text-sm leading-6 text-[#475569]">{activeControl.whenToUse}</p>
        </div>
      </div>
    </div>
  )
}

function DriftTab({
  traceMode,
  onToggleTrace,
  labels,
}: {
  traceMode: boolean
  onToggleTrace: () => void
  labels: Array<{ icon: string; label: string }>
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="rounded-2xl border border-[#E5EBF2] bg-[#FAFCFE] p-5">
        <p className="text-sm leading-7 text-[#475569]">
          Drift propagates through the stack. Use the trace to reveal how ambiguity enters early and compounds through retrieval, synthesis, and delivery.
        </p>
        <Button className="mt-4" onClick={onToggleTrace}>
          <Waves className="mr-2 h-4 w-4" />
          {traceMode ? "Hide Failure Path" : "Trace Failure Path"}
        </Button>
      </div>
      <div className="rounded-2xl border border-[#E5EBF2] bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#64748B]">Trace labels</p>
        <div className="mt-3 space-y-2">
          {labels.map((label, index) => (
            <div key={label.label} className="flex items-center justify-between gap-3 rounded-xl border border-[#E5EBF2] bg-[#FAFCFE] px-3 py-2">
              <span className="text-sm font-medium text-[#1A232B]">{compactLabels[index]}</span>
              <span className="text-xs text-[#B9382A]">
                {label.icon} {label.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function FailureBarsSection() {
  return (
    <section className="rounded-[28px] border border-[#D6DEE6] bg-white p-5 shadow-[0_16px_42px_rgba(15,23,42,0.08)] md:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#64748B]">Failure Statistics</p>
      <h2 className="mt-2 text-3xl font-semibold text-[#1A232B]">Teams over-attribute failure to the model</h2>
      <p className="mt-3 max-w-2xl text-base leading-7 text-[#475569]">
        The memorable mistake is usually the model response, but the upstream causes often live in prompt design, retrieval quality, and evaluation discipline.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <FailureBars
          title="Where teams think AI failures happen"
          subtitle="The visible answer gets blamed first."
          stats={perceivedFailureStats}
        />
        <FailureBars
          title="Where failures actually happen"
          subtitle="Most drift enters before or after generation."
          stats={actualFailureStats}
        />
      </div>
    </section>
  )
}

function FailureExampleDialog({
  open,
  onOpenChange,
  currentStep,
  currentStepIndex,
  setCurrentStepIndex,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentStep: (typeof enterpriseSearchFailure.steps)[number]
  currentStepIndex: number
  setCurrentStepIndex: (index: number) => void
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,760px)] -translate-x-1/2 -translate-y-1/2 rounded-[28px] border border-[#D6DEE6] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.24)]">
          <Dialog.Close className="absolute right-4 top-4 rounded-full border border-[#D6DEE6] p-2 text-[#475569]">
            <X className="h-4 w-4" />
          </Dialog.Close>
          <Dialog.Title className="text-xs font-semibold uppercase tracking-[0.24em] text-[#64748B]">
            End-to-End Failure Example
          </Dialog.Title>
          <h2 className="mt-2 text-3xl font-semibold text-[#1A232B]">{enterpriseSearchFailure.title}</h2>
          <div className="mt-4 rounded-2xl border border-[#E5EBF2] bg-[#F8FBFD] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#64748B]">User asks</p>
            <p className="mt-2 text-base leading-7 text-[#1A232B]">{enterpriseSearchFailure.prompt}</p>
          </div>

          <div className="mt-6 rounded-2xl border border-[#E5EBF2] bg-[#FAFCFE] p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-[#1A232B]">
                Step {currentStepIndex + 1} of {enterpriseSearchFailure.steps.length}
              </p>
              <span className="text-xs uppercase tracking-[0.2em] text-[#64748B]">
                {driftLayers.find((layer) => layer.id === currentStep.layerId)?.name}
              </span>
            </div>
            <h3 className="mt-3 text-2xl font-semibold text-[#1A232B]">{currentStep.title}</h3>
            <p className="mt-3 text-base leading-7 text-[#475569]">{currentStep.detail}</p>
          </div>

          <div className="mt-6 flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              className="border-[#D6DEE6] bg-white text-[#1A232B] hover:bg-[#F8FBFD]"
              onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
              disabled={currentStepIndex === 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            <div className="flex items-center gap-2">
              {enterpriseSearchFailure.steps.map((step, index) => (
                <button
                  key={step.title}
                  type="button"
                  onClick={() => setCurrentStepIndex(index)}
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: index === currentStepIndex ? "#3A6EA5" : "#D6DEE6" }}
                />
              ))}
            </div>
            <Button
              type="button"
              onClick={() => setCurrentStepIndex(Math.min(enterpriseSearchFailure.steps.length - 1, currentStepIndex + 1))}
              disabled={currentStepIndex === enterpriseSearchFailure.steps.length - 1}
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function SimulatorDrawer({
  open,
  onOpenChange,
  temperature,
  setTemperature,
  contextQuality,
  setContextQuality,
  promptClarity,
  setPromptClarity,
  simulatorSeverity,
  simulatorSummary,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  temperature: number
  setTemperature: (value: number) => void
  contextQuality: number
  setContextQuality: (value: number) => void
  promptClarity: number
  setPromptClarity: (value: number) => void
  simulatorSeverity: "stable" | "strained" | "drifting"
  simulatorSummary: {
    label: string
    color: string
    response: string
    detail: string
    symptoms: string[]
  }
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto border-l border-[#D6DEE6] bg-white p-6 sm:max-w-[520px]">
        <SheetHeader>
          <SheetTitle>Drift Simulator</SheetTitle>
          <SheetDescription>
            Adjust prompt clarity, context quality, and temperature without adding height to the page.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-8 space-y-6">
          <SimulatorControl
            label="Temperature"
            value={temperature}
            hint="Higher values increase stylistic variation and speculative phrasing."
            onChange={setTemperature}
          />
          <SimulatorControl
            label="Context quality"
            value={contextQuality}
            hint="Lower values simulate stale, noisy, or weak retrieval evidence."
            onChange={setContextQuality}
          />
          <SimulatorControl
            label="Prompt clarity"
            value={promptClarity}
            hint="Lower values simulate vague intent framing and ambiguous instructions."
            onChange={setPromptClarity}
          />
        </div>

        <div className="mt-8 rounded-2xl border border-[#E5EBF2] bg-[#FAFCFE] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: simulatorSummary.color }}>
                {simulatorSummary.label}
              </p>
              <p className="mt-1 text-lg font-semibold text-[#1A232B]">
                {simulatorSeverity === "stable" ? "Grounded answer path" : simulatorSeverity === "strained" ? "Weak-layer interference" : "Drifted answer path"}
              </p>
            </div>
            <p className="max-w-xs text-sm text-[#64748B]">{simulatorSummary.detail}</p>
          </div>
          <div className="mt-5 rounded-2xl border border-[#D6DEE6] bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#64748B]">Sample response</p>
            <p className="mt-3 text-base leading-7 text-[#1A232B]">{simulatorSummary.response}</p>
          </div>
          <div className="mt-4 grid gap-3">
            {simulatorSummary.symptoms.map((symptom) => (
              <div key={symptom} className="rounded-2xl border border-[#E5EBF2] bg-white p-3">
                <p className="text-sm leading-6 text-[#475569]">{symptom}</p>
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function SimulatorControl({
  label,
  value,
  hint,
  onChange,
}: {
  label: string
  value: number
  hint: string
  onChange: (value: number) => void
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#1A232B]">{label}</p>
          <p className="mt-1 text-sm text-[#64748B]">{hint}</p>
        </div>
        <div className="rounded-full border border-[#D6DEE6] bg-white px-3 py-1 text-sm font-semibold text-[#445561]">
          {value.toFixed(2)}
        </div>
      </div>
      <Slider
        aria-label={label}
        min={0}
        max={1}
        step={0.01}
        value={[value]}
        onValueChange={(next) => onChange(next[0] ?? 0)}
        className="mt-4"
      />
    </div>
  )
}

function FailureBars({
  title,
  subtitle,
  stats,
}: {
  title: string
  subtitle: string
  stats: Array<{ label: string; value: number; color: string }>
}) {
  return (
    <div className="rounded-2xl border border-[#E5EBF2] bg-[#FAFCFE] p-4">
      <p className="text-sm font-semibold text-[#1A232B]">{title}</p>
      <p className="mt-1 text-sm text-[#64748B]">{subtitle}</p>
      <div className="mt-5 space-y-4">
        {stats.map((stat) => (
          <div key={stat.label}>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-[#445561]">{stat.label}</span>
              <span className="font-semibold text-[#1A232B]">{stat.value}%</span>
            </div>
            <div className="mt-2 h-3 rounded-full bg-white">
              <div className="h-3 rounded-full" style={{ width: `${stat.value}%`, backgroundColor: stat.color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function getTraceStatus(index: number) {
  const labels = [
    "ambiguous request",
    "task scope error",
    "weak prompt constraints",
    "stale retrieval evidence",
    "confident synthesis",
    "incorrect answer delivered",
    "evaluation detects drift",
  ] as const

  const icons = ["❌", "⚠", "⚠", "❌", "⚠", "❌", "✓"] as const

  return {
    icon: icons[index] ?? "•",
    label: labels[index] ?? "downstream degradation",
  }
}
