import type { HTMLAttributes, ReactNode } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const sectionVariants = cva("ds-section", {
  variants: {
    tone: {
      base: "",
      soft: "",
      paper: "",
    },
    spacing: {
      default: "",
      compact: "py-12 md:py-16 lg:py-20",
      roomy: "py-20 md:py-28 lg:py-32",
    },
  },
  defaultVariants: {
    tone: "base",
    spacing: "default",
  },
})

const ruleHeadingVariants = cva("border-b pb-2 w-fit", {
  variants: {
    tone: {
      section: "border-[var(--accent-rule)] text-text-strong text-2xl font-bold tracking-tight",
      page: "border-[var(--accent-rule)] text-text-strong text-3xl font-bold tracking-tight sm:text-4xl xl:text-5xl",
      footer:
        "border-[var(--accent-rule)] text-text-primary text-[0.6875rem] font-semibold uppercase tracking-[0.12em]",
    },
  },
  defaultVariants: {
    tone: "section",
  },
})

interface PageSectionProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  containerClassName?: string
  divider?: boolean
}

export function PageSection({
  className,
  children,
  tone,
  spacing,
  containerClassName,
  divider = false,
  ...props
}: PageSectionProps) {
  return (
    <section
      className={cn(sectionVariants({ tone, spacing }), className)}
      data-divider={divider ? "true" : undefined}
      data-tone={tone ?? "base"}
      {...props}
    >
      <div className={cn("ds-container", containerClassName)}>{children}</div>
    </section>
  )
}

interface SectionIntroProps extends HTMLAttributes<HTMLDivElement> {
  title: string
  description?: ReactNode
  kicker?: string
  actions?: ReactNode
  align?: "left" | "center"
}

export function SectionIntro({
  title,
  description,
  kicker,
  actions,
  align = "left",
  className,
  ...props
}: SectionIntroProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
        align === "center" && "mx-auto max-w-3xl text-center md:flex-col md:items-center",
        className
      )}
      {...props}
    >
      <div className={cn("space-y-3", align === "center" && "flex flex-col items-center")}>
        {kicker ? <p className="ds-kicker">{kicker}</p> : null}
        <RuleHeading>{title}</RuleHeading>
        {description ? <div className="ds-copy max-w-2xl">{description}</div> : null}
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  )
}

interface RuleHeadingProps extends HTMLAttributes<HTMLHeadingElement>, VariantProps<typeof ruleHeadingVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "p"
}

export function RuleHeading({
  as: Comp = "h2",
  className,
  tone,
  ...props
}: RuleHeadingProps) {
  return <Comp className={cn(ruleHeadingVariants({ tone }), className)} {...props} />
}

export function EditorialSurface({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("ds-surface", className)} {...props} />
}
