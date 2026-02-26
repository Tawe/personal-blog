export type AuthCategory = "Session" | "Token" | "SSO" | "Service"

export type FlowVariantId = "happy" | "refresh" | "logout" | "attack"

export type LaneId = "user" | "client" | "auth" | "api" | "store"

export type EdgeId = string

export type Edge = {
  id: EdgeId
  fromLane: LaneId
  toLane: LaneId
  label?: string
  style?: "solid" | "dashed"
  semantics?: "token" | "cookie" | "code" | "introspection"
}

export type Step = {
  id: string
  title: string
  caption: string
  activeEdges: EdgeId[]
  activeLanes?: LaneId[]
  request?: string
  response?: string
  notes?: string
}

export type AttackOverlay = {
  id: string
  label: string
  affectedEdges: EdgeId[]
  whatBreaks: string
  mitigation: string
  annotation?: string
}

export type Overlay = {
  id: string
  label: string
  affectedEdges: EdgeId[]
  whatBreaks: string
  mitigation: string
  annotation?: string
}

export type DiagramFlow = {
  id: FlowVariantId
  label: string
  steps: Step[]
}

export type Diagram = {
  lanes: LaneId[]
  edges: Edge[]
  flows: Record<FlowVariantId, Step[]>
  overlays?: Overlay[]
}

export type AuthMethod = {
  id: string
  name: string
  category: AuthCategory
  supportedVariants?: FlowVariantId[]
  description?: string
  tagline: string
  bestFor: string[]
  avoidWhen?: string[]
  avoidFor: string[]
  useWhen: string[]
  dontUseWhen: string[]
  pros: string[]
  cons: string[]
  gotchas: string[]
  gotcha?: string
  commonMistakes: string[]
  regretLine: string
  securityChecklist: string[]
  tradeoffMeters: {
    complexity: number
    revocationEase: number
    browserSafety: number
    debuggability: number
  }
  whenToUse: {
    bestFor: string[]
    worksIf: string[]
    avoid: string[]
  }
  prosChips: string[]
  consChips: string[]
  commonMistake: string
  diagram: Diagram
  flowLabels?: Partial<Record<FlowVariantId, string>>
  relatedMethodIds?: string[]
}

export type Scenario = {
  id: string
  name: string
  description: string
  topRecommendations: string[]
}

export type GlossaryTerm = {
  id: string
  term: string
  definition: string
}

export type WizardOption = {
  id: string
  label: string
  description: string
  boost: string[]
  penalize?: string[]
  warning?: string
}

export type WizardQuestion = {
  id: string
  prompt: string
  options: WizardOption[]
}
