"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { authMethods } from "../data/authMethods"
import { scenarios } from "../data/scenarios"
import { FlowCanvas } from "./FlowCanvas"
import type { AuthMethod, Step } from "../types"

type StageMode = "happy" | "refresh" | "logout"

const stageMethodIds = [
  "session-cookies",
  "oidc",
  "jwt-refresh",
  "opaque-tokens",
  "oauth2",
  "saml",
  "api-keys",
  "basic-auth",
  "mtls",
  "hmac-signed",
] as const

type NormalizedMethod = {
  id: string
  label: string
  category: string
  description: string
  bestFor: string[]
  avoidWhen: string[]
  pros: string[]
  cons: string[]
  gotcha: string
  flows: { happy: Step[]; refresh?: Step[]; logout?: Step[] }
  supportedModes: StageMode[]
}

function normalizeStepDescription(title?: string, description?: string) {
  const trimmed = (description ?? "").trim()
  if (!trimmed) return "Step details unavailable."
  if (!title) return trimmed
  const baseTitle = title.trim().toLowerCase().replace(/[.:]+$/g, "")
  const baseCaption = trimmed.toLowerCase().replace(/[.:]+$/g, "")
  if (!baseCaption.startsWith(baseTitle)) return trimmed
  const remainder = trimmed.slice(title.length).replace(/^[:\s-]+/, "")
  if (!remainder) return trimmed
  return remainder.charAt(0).toUpperCase() + remainder.slice(1)
}

function compactStepDescription(description: string) {
  const trimmed = description.trim()
  if (!trimmed) return "Step details unavailable."
  const firstSentence = trimmed.split(/(?<=[.!?])\s+/)[0] ?? trimmed
  return firstSentence.length > 140 ? `${firstSentence.slice(0, 137)}...` : firstSentence
}

function normalizeMethod(method: AuthMethod): NormalizedMethod {
  const happy = method.diagram?.flows?.happy ?? []
  const refresh = method.diagram?.flows?.refresh ?? []
  const logout = method.diagram?.flows?.logout ?? []
  const supportedModes: StageMode[] = []
  if (happy.length > 0) supportedModes.push("happy")
  if (refresh.length > 0) supportedModes.push("refresh")
  if (logout.length > 0) supportedModes.push("logout")

  return {
    id: method.id ?? "",
    label: method.name ?? method.id ?? "",
    category: method.category ?? "Token",
    description: method.description ?? method.tagline ?? "",
    bestFor: method.bestFor ?? method.whenToUse?.bestFor ?? [],
    avoidWhen: method.avoidWhen ?? method.avoidFor ?? method.whenToUse?.avoid ?? [],
    pros: method.pros ?? method.prosChips ?? [],
    cons: method.cons ?? method.consChips ?? [],
    gotcha: method.gotcha ?? method.gotchas?.[0] ?? "",
    flows: {
      happy,
      refresh: refresh.length > 0 ? refresh : undefined,
      logout: logout.length > 0 ? logout : undefined,
    },
    supportedModes: supportedModes.length > 0 ? supportedModes : ["happy"],
  }
}

function useDesktopLayout() {
  const [isDesktop, setIsDesktop] = useState(false)
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)")
    setIsDesktop(query.matches)
    const onChange = () => setIsDesktop(query.matches)
    query.addEventListener("change", onChange)
    return () => query.removeEventListener("change", onChange)
  }, [])
  return isDesktop
}

type AuthAtlasStageV2Props = {
  initialMethodId?: string | null
  onMethodChange?: (methodId: string) => void
}

export function AuthAtlasStageV2({ initialMethodId, onMethodChange }: AuthAtlasStageV2Props) {
  const isDesktop = useDesktopLayout()
  const scenarioNameById = useMemo(() => new Map(scenarios.map((entry) => [entry.id, entry.name])), [])

  const methods = useMemo(
    () =>
      stageMethodIds
        .map((id) => authMethods.find((method) => method.id === id))
        .filter((method): method is AuthMethod => Boolean(method))
        .map(normalizeMethod),
    []
  )

  const defaultMethodId = methods.find((method) => method.id === initialMethodId)?.id ?? methods[0]?.id ?? "session-cookies"

  const [activeMethodId, setActiveMethodId] = useState(defaultMethodId)
  const [activeMode, setActiveMode] = useState<StageMode>("happy")
  const [stepIndex, setStepIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [isInfoOpen, setIsInfoOpen] = useState(false)
  const [isInfoMounted, setIsInfoMounted] = useState(false)
  const [isInfoVisible, setIsInfoVisible] = useState(false)
  const infoButtonRef = useRef<HTMLButtonElement | null>(null)
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const timerRef = useRef<number | null>(null)

  const activeMethod = methods.find((method) => method.id === activeMethodId) ?? methods[0]
  const activeSteps = useMemo(() => {
    if (!activeMethod) return []
    if (activeMode === "refresh") return activeMethod.flows.refresh ?? []
    if (activeMode === "logout") return activeMethod.flows.logout ?? []
    return activeMethod.flows.happy ?? []
  }, [activeMethod, activeMode])
  const boundedStepIndex = Math.max(0, Math.min(stepIndex, Math.max(activeSteps.length - 1, 0)))
  const activeStep = activeSteps[boundedStepIndex]
  const stepTitle = activeStep?.title ?? "Flow step"
  const stepDescription = normalizeStepDescription(activeStep?.title, activeStep?.caption)
  const compactDescription = compactStepDescription(stepDescription)
  const previousTitle = boundedStepIndex > 0 ? activeSteps[boundedStepIndex - 1]?.title : null
  const atEnd = activeSteps.length > 0 && boundedStepIndex >= activeSteps.length - 1

  function clearTimer() {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduceMotion(media.matches)
    const onChange = () => setReduceMotion(media.matches)
    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [])

  useEffect(() => {
    if (!initialMethodId) return
    const resolved = methods.find((method) => method.id === initialMethodId)?.id
    if (resolved) {
      setActiveMethodId(resolved)
    }
  }, [initialMethodId, methods])

  useEffect(() => {
    if (!activeMethod) return
    setActiveMode("happy")
    setStepIndex(0)
    setPlaying(!reduceMotion && activeMethod.flows.happy.length > 1)
    setIsInfoOpen(false)
    setIsInfoMounted(false)
    setIsInfoVisible(false)
  }, [activeMethod?.id, reduceMotion])

  useEffect(() => {
    if (isInfoOpen) {
      setIsInfoMounted(true)
      setIsInfoVisible(false)
      const enterId = window.setTimeout(() => setIsInfoVisible(true), 16)
      return () => window.clearTimeout(enterId)
    }
    setIsInfoVisible(false)
    const timeoutId = window.setTimeout(() => setIsInfoMounted(false), 300)
    return () => window.clearTimeout(timeoutId)
  }, [isInfoOpen])

  useEffect(() => {
    if (!activeMethod) return
    if (activeMethod.supportedModes.includes(activeMode)) return
    setActiveMode(activeMethod.supportedModes[0] ?? "happy")
    setStepIndex(0)
    setPlaying(!reduceMotion && activeSteps.length > 1)
  }, [activeMethod, activeMode, reduceMotion, activeSteps.length])

  useEffect(() => {
    setStepIndex(0)
    setPlaying(!reduceMotion && activeSteps.length > 1)
  }, [activeMode, activeMethod?.id, reduceMotion, activeSteps.length])

  function handleMethodSelect(nextMethodId: string) {
    if (nextMethodId === activeMethodId) return
    setActiveMethodId(nextMethodId)
    onMethodChange?.(nextMethodId)
  }

  useEffect(() => {
    if (!isInfoOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        setIsInfoOpen(false)
        return
      }
      if (event.key !== "Tab" || !dialogRef.current) return
      const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      )
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const active = document.activeElement as HTMLElement | null
      if (event.shiftKey && active === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    window.setTimeout(() => {
      dialogRef.current?.querySelector<HTMLElement>("button, [href], [tabindex]:not([tabindex='-1'])")?.focus()
    }, 0)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", onKeyDown)
      infoButtonRef.current?.focus()
    }
  }, [isInfoOpen])

  useEffect(() => {
    clearTimer()
    if (!playing || reduceMotion || activeSteps.length <= 1) return
    if (atEnd) {
      setPlaying(false)
      return
    }
    timerRef.current = window.setTimeout(() => {
      setStepIndex((current) => Math.min(current + 1, activeSteps.length - 1))
    }, 2450)
    return () => clearTimer()
  }, [playing, reduceMotion, boundedStepIndex, activeSteps.length, atEnd])

  useEffect(() => () => clearTimer(), [])

  if (!activeMethod) return null

  const bestFor = activeMethod.bestFor.slice(0, 3)
  const avoidWhen = activeMethod.avoidWhen.slice(0, 3)
  const pros = activeMethod.pros.slice(0, 4)
  const cons = activeMethod.cons.slice(0, 4)
  return (
    <section className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 md:p-5">
      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 shadow-sm dark:border-slate-700 dark:bg-slate-900/40">
        <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Select auth type</p>
        <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-wrap lg:overflow-visible">
          {methods.map((method) => {
            const active = method.id === activeMethod.id
            return (
              <button
                key={method.id}
                type="button"
                onClick={() => handleMethodSelect(method.id)}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "border-blue-500 bg-blue-100/90 text-blue-900 dark:border-blue-400 dark:bg-blue-950/40 dark:text-blue-100"
                    : "border-slate-300 bg-white/90 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:bg-slate-800/80"
                }`}
                aria-label={`Select ${method.label}`}
              >
                {method.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <section
          className={`rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition-opacity duration-200 dark:border-slate-700 dark:bg-slate-900/40 ${
            isInfoOpen ? "opacity-90" : "opacity-100"
          }`}
        >
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Choose flow path</p>
          <div className="mb-2 flex h-10 items-center justify-between gap-2">
            <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
              {activeMethod.supportedModes.map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setActiveMode(mode)}
                  className={`rounded-md border px-3 py-1.5 text-xs font-medium ${
                    activeMode === mode
                      ? "border-slate-800 bg-slate-800 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
                      : "border-slate-300 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200"
                  }`}
                >
                  {mode === "happy" ? "Happy" : mode === "refresh" ? "Refresh" : "Logout"}
                </button>
              ))}
            </div>
            <button
              ref={infoButtonRef}
              type="button"
              onClick={() => setIsInfoOpen((open) => !open)}
              className="shrink-0 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
              aria-label={isInfoOpen ? "Close trade-offs and gotchas panel" : "Open trade-offs and gotchas panel"}
            >
              <span aria-hidden="true" className="mr-1">
                {isInfoOpen ? "✕" : "ⓘ"}
              </span>
              {isInfoOpen ? "Close" : isDesktop ? "Trade-offs & gotchas" : "Trade-offs"}
            </button>
          </div>
          <p className="mb-2 text-xs text-slate-600 dark:text-slate-300">
            Watching the flow? Open Trade-offs & gotchas to see when this breaks down in production.
          </p>

          <div className="mb-2 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/40">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{stepTitle}</p>
            <p className="mt-1 overflow-hidden text-sm text-slate-700 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] dark:text-slate-300">
              {compactDescription}
            </p>
            {previousTitle ? (
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">What changed: moved on from {previousTitle}.</p>
            ) : null}
            {atEnd ? (
              <p className="mt-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                You&apos;ve seen how this works. Open Trade-offs & gotchas to decide if it fits your system.
              </p>
            ) : null}
          </div>

          <div className={`${isDesktop ? "h-[60vh] min-h-[520px] max-h-[760px]" : "h-[45vh] min-h-[320px]"}`}>
            <FlowCanvas
              methodId={activeMethod.id}
              flowId={activeMode}
              stepIndex={boundedStepIndex}
              overlayId={null}
              scenarioId={null}
              className="h-full rounded-2xl border-slate-300 bg-gradient-to-b from-slate-50 to-white p-3 shadow-md dark:border-slate-700 dark:from-slate-900 dark:to-slate-900/80"
              canvasClassName="h-full"
            />
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setPlaying(false)
                setStepIndex((current) => Math.max(0, current - 1))
              }}
              disabled={boundedStepIndex === 0}
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-800 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => {
                if (reduceMotion) return
                if (playing) {
                  setPlaying(false)
                  return
                }
                if (atEnd) setStepIndex(0)
                setPlaying(true)
              }}
              disabled={reduceMotion || activeSteps.length <= 1}
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-800 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
            >
              {playing ? "Pause" : atEnd ? "Play again" : "Play"}
            </button>
            <button
              type="button"
              onClick={() => {
                setPlaying(false)
                setStepIndex((current) => Math.min(current + 1, Math.max(activeSteps.length - 1, 0)))
              }}
              disabled={boundedStepIndex >= Math.max(activeSteps.length - 1, 0)}
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-800 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
            >
              Next
            </button>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Step {Math.min(boundedStepIndex + 1, Math.max(activeSteps.length, 1))}/{Math.max(activeSteps.length, 1)}
            </p>
          </div>

        </section>
      </div>

      {isInfoMounted ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            className={`absolute inset-0 bg-slate-950/45 transition-opacity duration-200 ${isInfoVisible ? "opacity-100" : "opacity-0"}`}
            aria-label="Close more info"
            onClick={() => setIsInfoOpen(false)}
          />
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${activeMethod.label} trade-offs and gotchas`}
            className={`absolute bg-white shadow-[0_24px_64px_rgba(15,23,42,0.35)] transition-all duration-300 ease-out dark:bg-slate-900 ${
              isDesktop
                ? `right-0 top-0 h-full w-[min(420px,92vw)] border-l-2 border-slate-300 dark:border-slate-600 ${
                    isInfoVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
                  }`
                : `bottom-0 left-0 right-0 h-[70vh] rounded-t-2xl border-t-2 border-slate-300 dark:border-slate-600 ${
                    isInfoVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                  }`
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-700">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Trade-offs &amp; gotchas</p>
              <button
                type="button"
                onClick={() => setIsInfoOpen(false)}
                className="rounded-md border border-slate-300 px-2.5 py-1 text-sm text-slate-700 dark:border-slate-600 dark:text-slate-200"
              >
                Close
              </button>
            </div>
            <div className="h-[calc(100%-56px)] overflow-y-auto p-4">
              <InfoPanel
                category={activeMethod.category}
                description={activeMethod.description}
                bestFor={bestFor}
                avoidWhen={avoidWhen}
                pros={pros}
                cons={cons}
                gotcha={activeMethod.gotcha}
                scenarioNameById={scenarioNameById}
              />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}

function InfoPanel({
  category,
  description,
  bestFor,
  avoidWhen,
  pros,
  cons,
  gotcha,
  scenarioNameById,
}: {
  category: string
  description: string
  bestFor: string[]
  avoidWhen: string[]
  pros: string[]
  cons: string[]
  gotcha: string
  scenarioNameById: Map<string, string>
}) {
  return (
    <div className="space-y-3">
      <section>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{category} method</p>
        <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{description || "None noted yet."}</p>
      </section>
      <section>
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Best for</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {bestFor.length > 0 ? (
            bestFor.map((item) => (
              <span key={item} className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200">
                {scenarioNameById.get(item) ?? item}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-500 dark:text-slate-400">None noted yet.</span>
          )}
        </div>
      </section>
      <section>
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Avoid when</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {avoidWhen.length > 0 ? (
            avoidWhen.map((item) => (
              <span key={item} className="rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-xs text-rose-800 dark:border-rose-900 dark:bg-rose-950/20 dark:text-rose-200">
                {scenarioNameById.get(item) ?? item}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-500 dark:text-slate-400">None noted yet.</span>
          )}
        </div>
      </section>
      <section>
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Why teams choose this</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {pros.length > 0 ? (
            pros.map((item) => (
              <span key={item} className="rounded-full bg-slate-200 px-2.5 py-0.5 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {item}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-500 dark:text-slate-400">None noted yet.</span>
          )}
        </div>
      </section>
      <section>
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">What you must get right</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {cons.length > 0 ? (
            cons.map((item) => (
              <span key={item} className="rounded-full border border-rose-200 px-2.5 py-0.5 text-xs text-rose-800 dark:border-rose-900 dark:text-rose-200">
                {item}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-500 dark:text-slate-400">None noted yet.</span>
          )}
        </div>
      </section>
      <section className="rounded-md border border-amber-200 bg-amber-50 p-2.5 dark:border-amber-900 dark:bg-amber-950/20">
        <p className="text-xs font-semibold text-amber-900 dark:text-amber-200">Common gotcha</p>
        <p className="mt-1 text-xs text-amber-800 dark:text-amber-300">{gotcha || "None noted yet."}</p>
      </section>
    </div>
  )
}
