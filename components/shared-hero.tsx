"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SharedHeroProps {
  breadcrumbLabel: string
  breadcrumbUrl: string
  backLabel: string
  backUrl: string
  title: string
  subtitle?: string
  imageSrc?: string
  imageAlt?: string
  imagePriority?: boolean
  metaRow?: ReactNode
  shareRow?: ReactNode
  tertiaryRow?: ReactNode
  mobilePreMediaRow?: ReactNode
  metaItems?: ReactNode
  actionItems?: ReactNode
  tertiaryAction?: ReactNode
  overlayBadge?: ReactNode
  imageBleedRightOnDesktop?: boolean
  showBackLink?: boolean
}

export function SharedHero({
  breadcrumbLabel,
  breadcrumbUrl,
  backLabel,
  backUrl,
  title,
  subtitle,
  imageSrc,
  imageAlt = "",
  imagePriority = false,
  metaRow,
  shareRow,
  tertiaryRow,
  mobilePreMediaRow,
  metaItems,
  actionItems,
  tertiaryAction,
  overlayBadge,
  imageBleedRightOnDesktop = false,
  showBackLink = true,
}: SharedHeroProps) {
  const resolvedMetaRow = metaRow ?? metaItems
  const resolvedShareRow = shareRow ?? actionItems
  const resolvedTertiaryRow = tertiaryRow ?? tertiaryAction
  const hasDetailRows = Boolean(resolvedMetaRow) || Boolean(resolvedShareRow) || Boolean(resolvedTertiaryRow)

  return (
    <>
      <div className="mb-8">
        <nav aria-label="Breadcrumb" className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-sm text-text-muted">
          <Link
            href={breadcrumbUrl}
            className="hover:text-text-strong transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
          >
            {breadcrumbLabel}
          </Link>
          <ChevronRight className="h-4 w-4 shrink-0 text-text-muted" aria-hidden="true" />
          <span className="min-w-0 break-words [overflow-wrap:anywhere] text-text-strong" aria-current="page">
            {title}
          </span>
        </nav>
      </div>

      {showBackLink && (
        <div className="mb-8">
          <Button
            variant="ghost"
            className="text-text-muted hover:text-text-strong !hover:bg-transparent !active:bg-transparent !focus-visible:bg-transparent"
            asChild
          >
            <Link href={backUrl}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {backLabel}
            </Link>
          </Button>
        </div>
      )}

      <header className="mb-8">
        {imageSrc ? (
          <div
            className={`relative mb-8 rounded-xl overflow-hidden ${
              imageBleedRightOnDesktop
                ? "lg:w-[calc(100%+max(0px,50vw-28rem))] lg:mr-[calc(-1*max(0px,50vw-28rem))]"
                : ""
            }`}
          >
            <div className="relative z-10 min-w-0 space-y-3 p-4 sm:p-6 lg:absolute lg:inset-x-0 lg:bottom-0 lg:p-8">
              <h1 className="min-w-0 break-words [overflow-wrap:anywhere] text-3xl sm:text-4xl lg:text-5xl font-bold text-text-strong lg:text-white leading-tight">
                {title}
              </h1>
              {subtitle && (
                <h2 className="min-w-0 break-words [overflow-wrap:anywhere] text-xl sm:text-2xl text-text-body lg:text-slate-100 font-medium">
                  {subtitle}
                </h2>
              )}
              {hasDetailRows && (
                <div className="min-w-0 space-y-2 text-text-muted lg:text-slate-200">
                  {resolvedMetaRow && (
                    <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2 [&>*]:min-w-0">
                      {resolvedMetaRow}
                    </div>
                  )}
                  {resolvedShareRow && (
                    <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-2 [&>*]:min-w-0">
                      {resolvedShareRow}
                    </div>
                  )}
                  {resolvedTertiaryRow && (
                    <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-sm text-text-muted lg:text-slate-300 [&>*]:min-w-0">
                      {resolvedTertiaryRow}
                    </div>
                  )}
                </div>
              )}
              {mobilePreMediaRow && (
                <div className="min-w-0 text-sm text-text-muted lg:hidden">
                  {mobilePreMediaRow}
                </div>
              )}
            </div>

            <div className="relative aspect-video w-full">
              <Image src={imageSrc} alt={imageAlt} fill className="object-cover" priority={imagePriority} />
              <div className="absolute inset-0 hidden lg:block bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent" />
            </div>

            {overlayBadge}
          </div>
        ) : (
          <div className="min-w-0 space-y-4 sm:space-y-6">
            <h1 className="min-w-0 break-words [overflow-wrap:anywhere] text-3xl sm:text-4xl lg:text-5xl font-bold text-text-strong leading-tight">
              {title}
            </h1>
            {subtitle && (
              <h2 className="min-w-0 break-words [overflow-wrap:anywhere] text-xl sm:text-2xl text-text-body font-medium mt-1 sm:mt-2 mb-2 sm:mb-4">
                {subtitle}
              </h2>
            )}

            {hasDetailRows && (
              <div className="min-w-0 space-y-2 text-text-muted">
                {resolvedMetaRow && (
                  <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2 [&>*]:min-w-0">
                    {resolvedMetaRow}
                  </div>
                )}
                {resolvedShareRow && (
                  <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-2 [&>*]:min-w-0">
                    {resolvedShareRow}
                  </div>
                )}
                {resolvedTertiaryRow && (
                  <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-sm [&>*]:min-w-0">
                    {resolvedTertiaryRow}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </header>
    </>
  )
}
