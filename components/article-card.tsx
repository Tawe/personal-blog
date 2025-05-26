"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ExternalLink } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { ArtumiContentMetadata, ViewMode } from "@/lib/types"

interface ArticleCardProps {
  article: ArtumiContentMetadata
  baseUrl: string
  onTagClick: (tag: string) => void
  viewMode: ViewMode
}

export function ArticleCard({ article, baseUrl, onTagClick, viewMode }: ArticleCardProps) {
  const isListView = viewMode === "list"

  return (
    <Card
      className={`bg-slate-800/30 border-slate-700 hover:border-slate-600 transition-colors ${isListView ? "flex" : ""}`}
    >
      {article.featured_image && (
        <div className={`relative ${isListView ? "w-48 flex-shrink-0" : "h-48"} overflow-hidden`}>
          <Image src={article.featured_image || "/placeholder.svg"} alt={article.title} fill className="object-cover" />
        </div>
      )}

      <div className="flex-1">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-semibold text-slate-100 line-clamp-2 leading-tight">{article.title}</h3>
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(article.date).toLocaleDateString()}
            </div>
            {article.reading_time && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {article.reading_time} min
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {article.excerpt && <p className="text-slate-300 text-sm mb-4 line-clamp-3">{article.excerpt}</p>}

          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {article.tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault()
                    onTagClick(tag)
                  }}
                >
                  {tag}
                </Badge>
              ))}
              {article.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs bg-slate-700/50 text-slate-300">
                  +{article.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          <Button asChild variant="ghost" className="text-purple-400 hover:text-purple-300 p-0 h-auto">
            <Link href={`${baseUrl}/${article.slug}`} className="flex items-center gap-1">
              Read more
              <ExternalLink className="h-3 w-3" />
            </Link>
          </Button>
        </CardContent>
      </div>
    </Card>
  )
}
