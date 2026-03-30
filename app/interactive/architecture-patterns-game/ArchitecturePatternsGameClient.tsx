"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { EditorialPill, EditorialSurface } from "@/components/design-system"
import { Button } from "@/components/ui/button"
import { buildLinkedInShareHref, shareOrCopyUrl } from "@/lib/share-client"
import { ArrowDown, CheckCircle2, Clock3, Flame, Linkedin, RotateCcw, Share2, ShieldAlert, Sparkles, Trophy, X } from "lucide-react"
import { patternCards, pressureCategories, scenarioCards, type PatternCard, type PatternId, type ScenarioCard } from "./data"
import "./architecture-patterns-game-theme.css"

const PAGE_TITLE = "Architecture Pattern Match Game"
const PAGE_URL = "https://johnmunn.tech/interactive/architecture-patterns-game"
const X_SHARE_HREF = `https://x.com/intent/tweet?url=${encodeURIComponent(PAGE_URL)}&text=${encodeURIComponent(PAGE_TITLE)}`

type Stage = "lobby" | "arena" | "debrief"
type CoachMode = "guided" | "pure"

function coachModeLabel(mode: CoachMode) {
  return mode === "guided" ? "Practice mode" : "Challenge mode"
}

function patternOrderForScenario(roundIndex: number) {
  const offset = (roundIndex * 3 + 2) % patternCards.length
  return patternCards.map((_, index) => patternCards[(index + offset) % patternCards.length])
}

function scoreLabel(score: number) {
  if (score >= 7) return "Pressure master"
  if (score >= 6) return "Tradeoff oracle"
  if (score >= 5) return "Distinguished engineer"
  if (score >= 4) return "Principal architect"
  if (score >= 3) return "Platform strategist"
  if (score >= 2) return "Systems operator"
  if (score >= 1) return "Migration tactician"
  return "Curious builder"
}

function pressureTagLabel(pressure: string) {
  return pressureCategories.find((category) => category.id === pressure.toLowerCase())?.label ?? pressure
}

function useAnimatedNumber(target: number, duration = 240) {
  const [display, setDisplay] = useState(target)

  useEffect(() => {
    if (display === target) return
    const start = window.performance.now()
    const initial = display
    let frame = 0

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - (1 - progress) * (1 - progress)
      setDisplay(Math.round(initial + (target - initial) * eased))
      if (progress < 1) frame = window.requestAnimationFrame(tick)
    }

    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [display, duration, target])

  return display
}

function patternById(patternId: PatternId) {
  return patternCards.find((pattern) => pattern.id === patternId) ?? patternCards[0]
}

function buildPatternContext(pattern: PatternCard, scenario: ScenarioCard) {
  if (pattern.id === scenario.recommendedPattern) {
    return {
      verdict: "Why it fit this round",
      summary: scenario.logicalChoice.replace(`${pattern.label} is the logical choice because `, ""),
      detail: `${pattern.label} matched ${scenario.dominantPressure.toLowerCase()} better than the other options in play.`,
    }
  }

  if (pattern.id === scenario.temptingWrongPattern) {
    return {
      verdict: "Why it was tempting but wrong",
      summary: scenario.temptingWrongReason,
      detail: scenario.betrayalExplanation.join(" "),
    }
  }

  return {
    verdict: "Why it failed this round",
    summary: `${pattern.label} optimizes for ${pattern.pressureCategory.toLowerCase()}, but this round was really about ${scenario.dominantPressure.toLowerCase()}.`,
    detail: `The system would have rewarded ${pressureTagLabel(scenario.dominantPressure)}, not ${pattern.pressureCategory.toLowerCase()}.`,
  }
}

export function ArchitecturePatternsGameClient() {
  const [stage, setStage] = useState<Stage>("lobby")
  const [coachMode, setCoachMode] = useState<CoachMode>("guided")
  const [roundIndex, setRoundIndex] = useState(0)
  const [selectedPatternId, setSelectedPatternId] = useState<PatternId | null>(null)
  const [revealedRounds, setRevealedRounds] = useState<Record<string, PatternId>>({})
  const [shareState, setShareState] = useState<"idle" | "copying" | "copied" | "error">("idle")
  const [lastRevealId, setLastRevealId] = useState<string | null>(null)
  const [scorePulse, setScorePulse] = useState(false)
  const [streakPulse, setStreakPulse] = useState(false)
  const [titlePulse, setTitlePulse] = useState(false)
  const [modalPatternId, setModalPatternId] = useState<PatternId | null>(null)
  const [modalScenarioId, setModalScenarioId] = useState<string | null>(null)
  const [studyQueueIndex, setStudyQueueIndex] = useState<number | null>(null)
  const previousTitleRef = useRef(scoreLabel(0))

  const currentScenario = scenarioCards[roundIndex]
  const isRevealOpen = Boolean(revealedRounds[currentScenario.id])
  const pickedPatternId = revealedRounds[currentScenario.id] ?? selectedPatternId
  const pickedPattern = pickedPatternId ? patternById(pickedPatternId) : null
  const recommendedPattern = patternById(currentScenario.recommendedPattern)
  const temptingWrongPattern = patternById(currentScenario.temptingWrongPattern)

  const score = useMemo(
    () =>
      scenarioCards.reduce((total, scenario) => {
        return revealedRounds[scenario.id] === scenario.recommendedPattern ? total + 1 : total
      }, 0),
    [revealedRounds]
  )

  const streak = useMemo(() => {
    let total = 0
    for (const scenario of scenarioCards) {
      if (revealedRounds[scenario.id] === scenario.recommendedPattern) {
        total += 1
        continue
      }
      if (revealedRounds[scenario.id]) break
      break
    }
    return total
  }, [revealedRounds])

  const animatedScore = useAnimatedNumber(score)
  const animatedAnsweredCount = useAnimatedNumber(Object.keys(revealedRounds).length)
  const animatedStreak = useAnimatedNumber(streak)
  const currentTitle = scoreLabel(score)
  const visiblePatternCards = useMemo(() => patternOrderForScenario(roundIndex), [roundIndex])
  const linkedInShareHref = buildLinkedInShareHref(PAGE_URL, PAGE_TITLE)
  const progressPercent = ((roundIndex + (isRevealOpen ? 1 : 0)) / scenarioCards.length) * 100
  const modalPattern = modalPatternId ? patternById(modalPatternId) : null
  const modalScenario = scenarioCards.find((scenario) => scenario.id === (modalScenarioId ?? currentScenario.id)) ?? currentScenario

  const pressureMastery = useMemo(
    () =>
      pressureCategories.map((category) => {
        const matchingScenarios = scenarioCards.filter((scenario) => scenario.dominantPressure.toLowerCase() === category.id)
        const passed =
          matchingScenarios.length > 0 &&
          matchingScenarios.every((scenario) => revealedRounds[scenario.id] === scenario.recommendedPattern)
        const missedScenario = matchingScenarios.find((scenario) => {
          const revealed = revealedRounds[scenario.id]
          return revealed && revealed !== scenario.recommendedPattern
        })

        return {
          ...category,
          passed,
          attempted: matchingScenarios.some((scenario) => Boolean(revealedRounds[scenario.id])),
          scenarioIndex: matchingScenarios[0] ? scenarioCards.findIndex((scenario) => scenario.id === matchingScenarios[0].id) + 1 : null,
          missedScenario,
        }
      }),
    [revealedRounds]
  )

  const strongestPressure = pressureMastery.find((category) => category.passed)?.label ?? "None yet"
  const missedPressure = pressureMastery.find((category) => category.attempted && !category.passed) ?? null
  const replayTarget = missedPressure?.label ?? pressureMastery.find((category) => !category.passed)?.label ?? "Pressure mastery"
  const studyScenario = missedPressure?.missedScenario ?? scenarioCards.find((scenario) => revealedRounds[scenario.id] !== scenario.recommendedPattern) ?? null
  const studyPattern = studyScenario ? patternById(studyScenario.recommendedPattern) : recommendedPattern
  const missedStudyItems = useMemo(
    () =>
      scenarioCards
        .filter((scenario) => {
          const revealed = revealedRounds[scenario.id]
          return Boolean(revealed) && revealed !== scenario.recommendedPattern
        })
        .map((scenario) => ({
          scenario,
          pattern: patternById(scenario.recommendedPattern),
        })),
    [revealedRounds]
  )
  const answeredCount = Object.keys(revealedRounds).length

  useEffect(() => {
    if (answeredCount === 0) {
      previousTitleRef.current = currentTitle
      return
    }

    setScorePulse(true)
    const scoreTimer = window.setTimeout(() => setScorePulse(false), 240)

    if (previousTitleRef.current !== currentTitle) {
      setTitlePulse(true)
      previousTitleRef.current = currentTitle
    }

    const titleTimer = window.setTimeout(() => setTitlePulse(false), 260)
    return () => {
      window.clearTimeout(scoreTimer)
      window.clearTimeout(titleTimer)
    }
  }, [answeredCount, currentTitle])

  useEffect(() => {
    if (!modalPattern) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setModalPatternId(null)
        setModalScenarioId(null)
        setStudyQueueIndex(null)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [modalPattern])

  const handleReveal = () => {
    if (!selectedPatternId) return
    const isCorrect = selectedPatternId === currentScenario.recommendedPattern
    setRevealedRounds((current) => ({
      ...current,
      [currentScenario.id]: selectedPatternId,
    }))
    setLastRevealId(currentScenario.id)
    if (isCorrect) {
      setStreakPulse(true)
      window.setTimeout(() => setStreakPulse(false), 260)
    }
  }

  const handleNext = () => {
    if (roundIndex === scenarioCards.length - 1) {
      setStage("debrief")
      return
    }
    const nextScenario = scenarioCards[roundIndex + 1]
    setRoundIndex((current) => current + 1)
    setSelectedPatternId(revealedRounds[nextScenario.id] ?? null)
  }

  const handleRoundJump = (nextIndex: number) => {
    setRoundIndex(nextIndex)
    setSelectedPatternId(revealedRounds[scenarioCards[nextIndex].id] ?? null)
    setStage("arena")
  }

  const handleReset = () => {
    setRoundIndex(0)
    setSelectedPatternId(null)
    setRevealedRounds({})
    setLastRevealId(null)
    setModalPatternId(null)
    setModalScenarioId(null)
    setStudyQueueIndex(null)
    setStage("lobby")
  }

  const handleStartRun = () => {
    setStage("arena")
    setRoundIndex(0)
    setSelectedPatternId(null)
    setModalPatternId(null)
    setModalScenarioId(null)
    setStudyQueueIndex(null)
  }

  const openPatternStudy = (patternId: PatternId, scenarioId: string) => {
    setStudyQueueIndex(null)
    setModalPatternId(patternId)
    setModalScenarioId(scenarioId)
  }

  const openStudyQueueItem = (index: number) => {
    const item = missedStudyItems[index]
    if (!item) return
    setStudyQueueIndex(index)
    setModalPatternId(item.pattern.id)
    setModalScenarioId(item.scenario.id)
  }

  const closeModal = () => {
    setModalPatternId(null)
    setModalScenarioId(null)
    setStudyQueueIndex(null)
  }

  const handleShare = async () => {
    if (shareState === "copying") return
    setShareState("copying")
    const result = await shareOrCopyUrl(PAGE_TITLE, PAGE_URL)
    setShareState(result === "shared" || result === "copied" ? "copied" : "error")
    window.setTimeout(() => setShareState("idle"), 2200)
  }

  const renderHero = ({
    primaryAction,
    heroTargetId,
  }: {
    primaryAction: ReactNode
    heroTargetId?: string
  }) => (
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
                      className="rounded-sm transition-colors hover:text-text-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      Interactive
                    </Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li aria-current="page" className="text-text-muted">
                    Architecture Pattern Match Game
                  </li>
                </ol>
              </nav>
              <h1 className="text-4xl font-bold leading-tight text-text-strong lg:text-5xl">
                Architecture Pattern Match Game
              </h1>
              <p className="text-2xl font-medium text-text-body">Know the cards before entering the arena.</p>
              <p data-page-summary className="max-w-2xl text-base leading-7 text-text-body">
                This trainer is about reading dominant system pressure, not memorizing pattern names. Pick your mode, study the cards, then enter a focused seven-round run.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {primaryAction}
              <Button
                variant="ghost"
                size="sm"
                className="text-text-muted hover:text-text-strong !hover:bg-transparent !active:bg-transparent !focus-visible:bg-transparent"
                onClick={handleShare}
                disabled={shareState === "copying"}
              >
                <Share2 className="mr-2 h-4 w-4" />
                {shareState === "copied" ? "Link copied" : shareState === "error" ? "Copy failed" : "Share"}
              </Button>
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
              <Button
                variant="ghost"
                size="sm"
                className="text-text-muted hover:text-text-strong !hover:bg-transparent !active:bg-transparent !focus-visible:bg-transparent"
                asChild
              >
                <Link href={X_SHARE_HREF} target="_blank" rel="noopener noreferrer">
                  Share on X
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-text-muted">
              <div className="flex items-center gap-2">
                <Clock3 className="h-4 w-4" />
                <span>7 scenario rounds</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span>{coachModeLabel(coachMode)}</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-xl border border-[#D6DEE6] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.18)]">
              <div className="relative aspect-[16/10] w-full md:aspect-[16/11]">
                <Image
                  src="/architecturegame.png"
                  alt="Architecture Pattern Match Game hero artwork"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {heroTargetId ? (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              <button
                type="button"
                onClick={() => {
                  document.getElementById(heroTargetId)?.scrollIntoView({ behavior: "smooth", block: "start" })
                }}
                className="inline-flex items-center gap-2 rounded-full border border-[#D6DEE6] bg-white/92 px-3 py-1.5 text-xs font-medium text-[#445561] shadow-sm transition-colors hover:bg-[#F8FBFD]"
              >
                Scroll
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )

  const renderLobby = () => (
    <>
      <div className="apg-stage apg-stage-enter">
        {renderHero({
          primaryAction: (
            <Button asChild>
              <Link href="#pattern-lobby">See the pattern lobby</Link>
            </Button>
          ),
          heroTargetId: "pattern-lobby",
        })}
      </div>

      <section id="pattern-lobby" className="mx-auto max-w-7xl px-4 pb-12 pt-8 md:px-6 md:pb-14 md:pt-10">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--apg-muted)]">Pattern lobby</p>
              <h2 className="mt-2 text-2xl font-semibold text-[color:var(--apg-ink)]">Pick your mode, then enter the arena.</h2>
            </div>
            <Button onClick={handleStartRun}>
              Enter the Tradeoff Arena
            </Button>
          </div>
          <div className="grid gap-6 lg:grid-cols-[minmax(280px,0.48fr)_minmax(0,1fr)] lg:items-start">
            <EditorialSurface className="apg-card rounded-[1.8rem] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--apg-muted)]">Pick your help level</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <button
                  type="button"
                  onClick={() => setCoachMode("guided")}
                  className={`rounded-[1.3rem] border p-4 text-left transition ${
                    coachMode === "guided" ? "apg-pattern-selected border-black bg-white" : "border-black/10 bg-white/70 hover:-translate-y-0.5"
                  }`}
                >
                  <p className="text-sm font-semibold text-[color:var(--apg-ink)]">Practice mode</p>
                  <p className="mt-1 text-sm leading-6 text-[color:var(--apg-muted)]">Shows the dominant pressure, hinting text, and signal tags during each round.</p>
                </button>
                <button
                  type="button"
                  onClick={() => setCoachMode("pure")}
                  className={`rounded-[1.3rem] border p-4 text-left transition ${
                    coachMode === "pure" ? "apg-pattern-selected border-black bg-white" : "border-black/10 bg-white/70 hover:-translate-y-0.5"
                  }`}
                >
                  <p className="text-sm font-semibold text-[color:var(--apg-ink)]">Challenge mode</p>
                  <p className="mt-1 text-sm leading-6 text-[color:var(--apg-muted)]">Hides the pressure callout and leaves you with just the scenario until reveal.</p>
                </button>
              </div>
            </EditorialSurface>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {patternCards.map((pattern) => (
                <EditorialSurface key={pattern.id} className="apg-card rounded-[1.7rem] p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--apg-muted)]">Pattern card</p>
                      <h2 className="mt-2 text-xl font-semibold text-[color:var(--apg-ink)]">{pattern.label}</h2>
                    </div>
                    <EditorialPill tone="neutral" className="text-[11px]">
                      {pattern.pressureCategory}
                    </EditorialPill>
                  </div>
                  <p className="mt-3 text-sm font-medium text-[color:var(--apg-ink)]">{pattern.metaphor}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <EditorialPill tone="success" className="normal-case tracking-normal">{pattern.bestFor[0]}</EditorialPill>
                    <EditorialPill tone="warm" className="normal-case tracking-normal">{pattern.avoidWhen}</EditorialPill>
                  </div>
                </EditorialSurface>
              ))}
            </div>
          </div>
      </section>
    </>
  )

  const renderArena = () => (
    <>
      <div className="apg-stage apg-stage-enter">
        {renderHero({
          primaryAction: (
            <Button asChild>
              <Link href="#pattern-arena">Jump to current round</Link>
            </Button>
          ),
          heroTargetId: "pattern-arena",
        })}
      </div>

      <section className="apg-stage apg-stage-enter mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
      <div className="grid gap-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <article className="apg-card rounded-3xl p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--apg-muted)]">Score</p>
            <p className={`mt-2 text-3xl font-bold text-[color:var(--apg-ink)] ${scorePulse ? "apg-count-pop" : ""}`}>{animatedScore}</p>
            <p className={`mt-1 text-sm text-[color:var(--apg-muted)] ${titlePulse ? "apg-title-shift" : ""}`}>{currentTitle}</p>
          </article>
          <article className="apg-card rounded-3xl p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--apg-muted)]">Rounds cleared</p>
            <p className={`mt-2 text-3xl font-bold text-[color:var(--apg-ink)] ${scorePulse ? "apg-count-pop" : ""}`}>{animatedAnsweredCount}</p>
            <p className="mt-1 text-sm text-[color:var(--apg-muted)]">Mode: {coachModeLabel(coachMode)}</p>
          </article>
          <article className="apg-card rounded-3xl p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--apg-muted)]">Win streak</p>
            <p className={`mt-2 flex items-center gap-2 text-3xl font-bold text-[color:var(--apg-ink)] ${streakPulse ? "apg-streak-pulse" : ""}`}>
              <Flame className="h-7 w-7 text-[color:var(--apg-rose)]" />
              {animatedStreak}
            </p>
            <p className="mt-1 text-sm text-[color:var(--apg-muted)]">Consecutive correct reveals from the top</p>
          </article>
        </div>

        <div className="apg-card rounded-[2rem] p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--apg-muted)]">Arena progress</p>
              <p className="mt-2 text-lg font-semibold text-[color:var(--apg-ink)]">
                Round {roundIndex + 1} of {scenarioCards.length}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {scenarioCards.map((scenario, index) => {
                const answered = Boolean(revealedRounds[scenario.id])
                const correct = answered && revealedRounds[scenario.id] === scenario.recommendedPattern
                return (
                  <button
                    key={scenario.id}
                    type="button"
                    onClick={() => handleRoundJump(index)}
                    className={`apg-progress-chip rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                      index === roundIndex
                        ? "border-black bg-[color:var(--apg-ink)] text-white"
                        : answered
                          ? correct
                            ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                            : "border-amber-300 bg-amber-50 text-amber-900"
                          : "border-black/10 bg-white/70 text-[color:var(--apg-muted)]"
                    }`}
                  >
                    <span>{index + 1}</span>
                    {answered ? (
                      <span className={`rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] ${scenario.id === lastRevealId ? "apg-chip-reveal" : ""}`}>
                        {correct ? "✓" : "✕"} {pressureTagLabel(scenario.dominantPressure)}
                      </span>
                    ) : null}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-4 h-3 overflow-hidden rounded-full bg-black/5">
            <div className="apg-progress-fill h-full rounded-full bg-[linear-gradient(90deg,#c97a1f,#3347a8,#0f766e)]" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        <div id="pattern-arena" className="grid gap-6 lg:grid-cols-[minmax(0,1.06fr)_minmax(320px,0.94fr)]">
          <article className="apg-card apg-card-strong rounded-[2rem] p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--apg-muted)]">Scenario</p>
                <h2 className="mt-2 text-3xl font-semibold text-[color:var(--apg-ink)]">{currentScenario.title}</h2>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-[color:var(--apg-muted)]">
                <Clock3 className="h-3.5 w-3.5" />
                High pressure
              </span>
            </div>

            <p className="mt-5 text-base leading-7 text-[color:var(--apg-ink)]">{currentScenario.situation}</p>

            {coachMode === "guided" ? (
              <div className="mt-6 rounded-[1.5rem] border border-black/10 bg-white/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--apg-muted)]">Primary pressure</p>
                <p className="mt-2 text-lg font-semibold text-[color:var(--apg-ink)]">{currentScenario.dominantPressure}</p>
              </div>
            ) : (
              <div className="mt-6 rounded-[1.5rem] border border-black/10 bg-white/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--apg-muted)]">Challenge mode</p>
                <p className="mt-2 text-lg font-semibold text-[color:var(--apg-ink)]">Pressure hidden until reveal</p>
                <p className="mt-2 text-sm leading-6 text-[color:var(--apg-muted)]">
                  Read the scenario and make the call without pressure labels or guided signal cues.
                </p>
              </div>
            )}

            {coachMode === "guided" ? (
              <div className="mt-4 rounded-[1.5rem] border border-black/10 bg-white/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--apg-muted)]">Guided hint</p>
                <p className="mt-2 text-sm leading-6 text-[color:var(--apg-muted)]">{currentScenario.pressure}</p>
              </div>
            ) : null}

            {coachMode === "guided" ? (
              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--apg-muted)]">Signals you should notice</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {currentScenario.signals.map((signal) => (
                    <span key={signal} className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-sm text-[color:var(--apg-ink)]">
                      {signal}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--apg-muted)]">Choose the best-fit pattern</p>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {visiblePatternCards.map((pattern) => {
                  const isSelected = selectedPatternId === pattern.id
                  const isCorrect = isRevealOpen && pattern.id === currentScenario.recommendedPattern
                  const isWrongPick = isRevealOpen && revealedRounds[currentScenario.id] === pattern.id && !isCorrect
                  return (
                    <div
                      key={pattern.id}
                      className={`rounded-[1.4rem] border p-4 transition duration-200 ${
                        isCorrect
                          ? "border-emerald-400 bg-emerald-50"
                          : isWrongPick
                            ? "border-amber-400 bg-amber-50"
                            : isSelected
                              ? "apg-pattern-selected border-black bg-white shadow-[0_16px_40px_rgba(31,41,55,0.12)]"
                              : "border-black/10 bg-white/70"
                      }`}
                    >
                      <button
                        type="button"
                        disabled={isRevealOpen}
                        onClick={() => setSelectedPatternId(pattern.id)}
                        className="apg-pattern-button w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-base font-semibold text-[color:var(--apg-ink)]">{pattern.label}</h3>
                            <p className="mt-2 text-sm leading-6 text-[color:var(--apg-muted)]">{pattern.tagline}</p>
                          </div>
                          <span className="mt-1 h-3 w-3 rounded-full" style={{ backgroundColor: pattern.accent }} />
                        </div>
                      </button>
                      <div className="mt-4 border-t border-black/10 pt-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto px-0 text-sm font-medium text-[color:var(--apg-ink)] hover:bg-transparent hover:text-black"
                          onClick={() => {
                            openPatternStudy(pattern.id, currentScenario.id)
                          }}
                        >
                          Learn more
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                onClick={handleReveal}
                disabled={!selectedPatternId || isRevealOpen}
                className="bg-[color:var(--apg-ink)] text-white hover:bg-black"
              >
                Reveal answer
              </Button>
              <Button variant="outline" onClick={handleReset} className="border-black/15 bg-transparent text-[color:var(--apg-ink)]">
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset run
              </Button>
              {isRevealOpen ? (
                <Button onClick={handleNext} variant="secondary" className="bg-[color:var(--apg-gold)] text-white hover:bg-[#b36812]">
                  {roundIndex === scenarioCards.length - 1 ? "Open debrief" : "Next round"}
                </Button>
              ) : null}
            </div>
          </article>

          <aside className="relative overflow-hidden rounded-[2rem] border border-black/10 bg-white/75 p-6 shadow-[0_24px_80px_rgba(39,29,18,0.08)] backdrop-blur">
            {!isRevealOpen ? (
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--apg-muted)]">Arena focus</p>
                <h2 className="text-2xl font-semibold text-[color:var(--apg-ink)]">
                  {coachMode === "guided" ? "Read the pressure before you read the pattern." : "Challenge mode is live."}
                </h2>
                <p className="text-sm leading-6 text-[color:var(--apg-muted)]">
                  {coachMode === "guided"
                    ? "Use the dominant pressure, the scenario wording, and the signal tags to narrow the field before you commit."
                    : "No scaffolding, no hints. Make the call from system pressure alone and use the reveal as your reward loop."}
                </p>
              </div>
            ) : (
              <div key={currentScenario.id} className="apg-reveal-card space-y-5 rounded-[1.75rem] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,249,242,0.94))] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--apg-muted)]">Reveal</p>
                    <h2 className="mt-2 text-2xl font-semibold text-[color:var(--apg-ink)]">
                      {pickedPatternId === currentScenario.recommendedPattern ? `Correct: ${recommendedPattern.label}` : `Best fit: ${recommendedPattern.label}`}
                    </h2>
                  </div>
                  {pickedPatternId === currentScenario.recommendedPattern ? (
                    <CheckCircle2 className="h-7 w-7 text-emerald-600" />
                  ) : (
                    <ShieldAlert className="h-7 w-7 text-amber-600" />
                  )}
                </div>

                <div className="rounded-[1.5rem] border border-emerald-200 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--apg-muted)]">Why it wins</p>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: recommendedPattern.accent }} />
                      <p className="text-lg font-semibold text-[color:var(--apg-ink)]">{recommendedPattern.label}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-black/10 bg-white"
                      onClick={() => {
                        openPatternStudy(recommendedPattern.id, currentScenario.id)
                      }}
                    >
                      Learn more
                    </Button>
                  </div>
                  <p className="mt-3 text-base font-medium leading-7 text-[color:var(--apg-ink)]">
                    {currentScenario.logicalChoice.replace(`${recommendedPattern.label} is the logical choice because `, "")}
                  </p>
                </div>

                <div className="rounded-[1.5rem] border border-black/10 bg-white/75 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--apg-muted)]">What the system would punish</p>
                  <p className="mt-2 text-base font-medium leading-7 text-[color:var(--apg-ink)]">{currentScenario.punishment}</p>
                </div>

                <div className="rounded-[1.5rem] border border-amber-200 bg-white/75 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--apg-muted)]">Tempting but wrong</p>
                      <p className="mt-2 text-base font-semibold leading-7 text-[color:var(--apg-ink)]">{temptingWrongPattern.label}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-black/10 bg-white"
                      onClick={() => {
                        openPatternStudy(temptingWrongPattern.id, currentScenario.id)
                      }}
                    >
                      Learn more
                    </Button>
                  </div>
                  <p className="mt-2 text-base font-medium leading-7 text-[color:var(--apg-ink)]">{currentScenario.temptingWrongReason}</p>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--apg-muted)]">{currentScenario.betrayalExplanation.join(" ")}</p>
                </div>

                <div className="rounded-[1.5rem] border border-black/10 bg-white/75 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--apg-muted)]">Tradeoff introduced</p>
                  <p className="mt-2 text-base font-medium leading-7 text-[color:var(--apg-ink)]">{currentScenario.tradeoffs[0]}</p>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-[color:var(--apg-muted)]">
                    {currentScenario.tradeoffs.slice(1).map((tradeoff) => (
                      <li key={tradeoff} className="flex gap-3">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[color:var(--apg-gold)]" />
                        <span>{tradeoff}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {pickedPattern && pickedPattern.id === currentScenario.recommendedPattern ? (
                  <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50/80 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800">Pressure read locked in</p>
                    <p className="mt-2 text-sm leading-6 text-emerald-900">
                      You chose the right fit before reveal because {currentScenario.dominantPressure.toLowerCase()} was the dominant signal.
                    </p>
                  </div>
                ) : null}
              </div>
            )}
          </aside>
        </div>

      </div>
    </section>
    </>
  )

  const renderDebrief = () => (
    <section className="apg-stage apg-stage-enter mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="apg-card rounded-[2rem] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--apg-muted)]">Run summary</p>
          <h1 className="mt-3 text-4xl font-bold text-[color:var(--apg-ink)]">{currentTitle}</h1>
          <div className="mt-5 space-y-3 text-sm text-[color:var(--apg-muted)]">
            <p>Final score: {score}/{scenarioCards.length}</p>
            <p>Rounds cleared: {answeredCount}</p>
            <p>Strongest pressure category: {strongestPressure}</p>
            <p>Missed pressure category: {missedPressure?.label ?? "None this run"}</p>
            <p>Streak result: {streak === 0 ? "No streak yet" : `${streak} clean read${streak === 1 ? "" : "s"} in a row`}</p>
            <p>Mode used: {coachModeLabel(coachMode)}</p>
            <p>Best next replay target: {replayTarget} recognition</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={handleReset} className="bg-[color:var(--apg-ink)] text-white hover:bg-black">
              <Trophy className="mr-2 h-4 w-4" />
              Run it again
            </Button>
            <Button
              variant="outline"
              className="border-black/15 bg-transparent text-[color:var(--apg-ink)]"
              onClick={() => openStudyQueueItem(0)}
              disabled={missedStudyItems.length === 0}
            >
              {missedStudyItems.length === 1 ? "Study missed pattern" : "Study missed patterns"}
            </Button>
          </div>
          {missedStudyItems.length > 1 ? (
            <p className="mt-4 text-sm text-[color:var(--apg-muted)]">
              Review all {missedStudyItems.length} missed patterns from this run.
            </p>
          ) : studyScenario ? (
            <p className="mt-4 text-sm text-[color:var(--apg-muted)]">
              Review {studyPattern.label} to improve {studyScenario.dominantPressure.toLowerCase()} recognition.
            </p>
          ) : (
            <p className="mt-4 text-sm text-[color:var(--apg-muted)]">No missed patterns to review this run.</p>
          )}
        </div>

        <div className="apg-card rounded-[2rem] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--apg-muted)]">Pressure mastery report</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {pressureMastery.map((category) => (
              <div key={category.id} className="rounded-[1.2rem] border border-black/10 bg-white/70 p-4">
                <p className="text-sm font-semibold text-[color:var(--apg-ink)]">
                  {category.passed ? "Mastered" : category.attempted ? "Improving" : "Missed"}: {category.label}
                </p>
                <p className="mt-2 text-sm text-[color:var(--apg-muted)]">
                  {category.passed
                    ? "You consistently read this pressure correctly."
                    : category.attempted
                      ? `Replay round ${category.scenarioIndex} to tighten this judgment.`
                      : `This category did not get a clean read in this run.`}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )

  return (
    <div className="architecture-patterns-game ds-page flex min-h-screen flex-col overflow-x-hidden">
      <SiteHeader />
      <main className="relative flex-1">
        {stage === "lobby" ? renderLobby() : null}
        {stage === "arena" ? renderArena() : null}
        {stage === "debrief" ? renderDebrief() : null}
      </main>
      <SiteFooter />

      {modalPattern ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8 backdrop-blur-sm">
          <div className="apg-reveal-card relative w-full max-w-2xl rounded-[2rem] border border-black/10 bg-[rgba(255,252,247,0.98)] p-6 shadow-[0_24px_80px_rgba(39,29,18,0.24)]">
            <button
              type="button"
              onClick={closeModal}
              className="absolute right-4 top-4 rounded-full border border-black/10 bg-white p-2 text-[color:var(--apg-muted)] transition hover:text-[color:var(--apg-ink)]"
              aria-label="Close learn more modal"
            >
              <X className="h-4 w-4" />
            </button>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--apg-muted)]">Pattern study</p>
            {studyQueueIndex !== null && missedStudyItems.length > 1 ? (
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-[1rem] border border-black/10 bg-white/70 px-4 py-3">
                <p className="text-sm text-[color:var(--apg-muted)]">
                  Reviewing missed pattern {studyQueueIndex + 1} of {missedStudyItems.length}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-black/10 bg-white"
                    onClick={() => openStudyQueueItem(studyQueueIndex - 1)}
                    disabled={studyQueueIndex === 0}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-black/10 bg-white"
                    onClick={() => openStudyQueueItem(studyQueueIndex + 1)}
                    disabled={studyQueueIndex === missedStudyItems.length - 1}
                  >
                    Next
                  </Button>
                </div>
              </div>
            ) : null}
            <h2 className="mt-3 text-3xl font-semibold text-[color:var(--apg-ink)]">{modalPattern.label}</h2>
            <p className="mt-3 text-base font-medium leading-7 text-[color:var(--apg-ink)]">{modalPattern.metaphor}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--apg-muted)]">
                {modalPattern.pressureCategory}
              </span>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-900">{modalPattern.bestFor[0]}</span>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.2rem] border border-black/10 bg-white/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--apg-muted)]">Best for</p>
                <p className="mt-2 text-sm leading-6 text-[color:var(--apg-muted)]">{modalPattern.bestFor[0]}</p>
              </div>
              <div className="rounded-[1.2rem] border border-black/10 bg-white/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--apg-muted)]">Avoid when</p>
                <p className="mt-2 text-sm leading-6 text-[color:var(--apg-muted)]">{modalPattern.avoidWhen}</p>
              </div>
            </div>
            <div className="mt-4 rounded-[1.2rem] border border-black/10 bg-white/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--apg-muted)]">
                {buildPatternContext(modalPattern, modalScenario).verdict}
              </p>
              <p className="mt-2 text-base font-medium leading-7 text-[color:var(--apg-ink)]">
                {buildPatternContext(modalPattern, modalScenario).summary}
              </p>
              <p className="mt-2 text-sm leading-6 text-[color:var(--apg-muted)]">
                {buildPatternContext(modalPattern, modalScenario).detail}
              </p>
            </div>
            <div className="mt-4 rounded-[1.2rem] border border-black/10 bg-white/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--apg-muted)]">Common misuse trap</p>
              <p className="mt-2 text-sm leading-6 text-[color:var(--apg-muted)]">{modalPattern.misuseTrap}</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
