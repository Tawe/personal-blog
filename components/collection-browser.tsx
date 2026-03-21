import Image from "next/image"
import Link from "next/link"
import type { ReactNode } from "react"
import { Calendar, Clock } from "lucide-react"

import { DateText } from "@/components/date-text"
import { EditorialPill, EditorialSurface } from "@/components/design-system"
import { cn } from "@/lib/utils"

interface BrowserPanelProps {
  children: ReactNode
  className?: string
}

export function CollectionBrowserPanel({ children, className }: BrowserPanelProps) {
  return <EditorialSurface className={cn("p-6", className)}>{children}</EditorialSurface>
}

interface TogglePillGroupProps {
  label: string
  items: string[]
  selected: string[]
  onToggle: (value: string) => void
  limit?: number
  showAll?: boolean
  onToggleShowAll?: () => void
  className?: string
  formatLabel?: (value: string) => string
}

export function TogglePillGroup({
  label,
  items,
  selected,
  onToggle,
  limit,
  showAll = false,
  onToggleShowAll,
  className,
  formatLabel,
}: TogglePillGroupProps) {
  const visibleItems = limit && !showAll ? items.slice(0, limit) : items

  return (
    <fieldset className={cn("min-w-0 space-y-2 border-0 p-0", className)}>
      <legend className="mb-2 p-0 text-sm font-medium text-text-body">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {visibleItems.map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={selected.includes(item)}
            onClick={() => onToggle(item)}
            className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <EditorialPill
              tone={selected.includes(item) ? "accent" : "neutral"}
              className="cursor-pointer normal-case tracking-normal"
            >
              {formatLabel ? formatLabel(item) : item}
            </EditorialPill>
          </button>
        ))}
      </div>
      {limit && items.length > limit && onToggleShowAll ? (
        <button
          type="button"
          onClick={onToggleShowAll}
          className="mt-2 text-sm text-text-muted transition-colors hover:text-accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {showAll ? "Show less" : `Show more (${items.length - limit} more)`}
        </button>
      ) : null}
    </fieldset>
  )
}

interface ResultCountProps {
  filteredCount: number
  totalCount: number
  noun: string
}

export function CollectionResultCount({ filteredCount, totalCount, noun }: ResultCountProps) {
  return (
    <div className="mt-4 text-sm text-text-muted" aria-live="polite" aria-atomic="true">
      Showing {filteredCount} of {totalCount} {noun}
    </div>
  )
}

interface CollectionArticleCardProps {
  href?: string
  title: string
  excerpt?: string
  date: string
  readingTime?: number
  image?: string
  featuredImage?: string
  pills?: ReactNode
  overlay?: ReactNode
  metaExtra?: ReactNode
  footer?: ReactNode
  hrefExternal?: boolean
  className?: string
}

export function CollectionArticleCard({
  href,
  title,
  excerpt,
  date,
  readingTime,
  image,
  featuredImage,
  pills,
  overlay,
  metaExtra,
  footer,
  hrefExternal = false,
  className,
}: CollectionArticleCardProps) {
  const mediaSrc = featuredImage || image

  const titleNode = href ? (
    hrefExternal ? (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-sm transition-colors hover:text-accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {title}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    ) : (
      <Link
        href={href}
        className="rounded-sm transition-colors hover:text-accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {title}
      </Link>
    )
  ) : (
    title
  )

  return (
    <EditorialSurface
      className={cn(
        "relative flex h-full flex-col overflow-hidden transition-all duration-300 hover:border-accent-primary/40 hover:shadow-[var(--shadow-lift)] focus-within:border-accent-primary/40 focus-within:shadow-[var(--shadow-lift)]",
        className
      )}
    >
      {overlay}
      {mediaSrc ? (
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={mediaSrc}
            alt=""
            fill
            className="object-cover transition-transform duration-300 hover:scale-105 motion-reduce:transition-none motion-reduce:hover:transform-none"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      ) : null}
      <div className="p-6">
        {pills ? <div className="mb-3 flex flex-wrap gap-2">{pills}</div> : null}
        <h3 className="text-xl font-semibold leading-tight text-text-strong">{titleNode}</h3>
        {excerpt ? <p className="mt-3 text-sm leading-relaxed text-text-body">{excerpt}</p> : null}
      </div>
      <div className="mt-auto px-6 pb-6 pt-0">
        <div className="mb-3 flex items-center justify-between text-sm text-text-muted">
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3" aria-hidden="true" />
            <DateText value={date} />
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3" aria-hidden="true" />
            <span>{readingTime ? `${readingTime} min` : "Short read"}</span>
          </div>
        </div>
        {metaExtra}
        {footer}
      </div>
    </EditorialSurface>
  )
}

interface EmptyStateProps {
  title: string
  body: string
}

export function CollectionEmptyState({ title, body }: EmptyStateProps) {
  return (
    <div className="py-12 text-center">
      <div className="mb-2 text-text-body">{title}</div>
      <p className="text-sm text-text-muted">{body}</p>
    </div>
  )
}
