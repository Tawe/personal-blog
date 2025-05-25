import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import type { ArticleMetadata } from "@/lib/content"

interface ArticlePreviewCardProps {
  article: ArticleMetadata
  section: string
}

export function ArticlePreviewCard({ article, section }: ArticlePreviewCardProps) {
  const articleUrl = `/${section}/${article.slug}`

  return (
    <Link href={articleUrl} className="block group">
      <Card className="bg-slate-800/50 border-slate-600 hover:border-blue-500/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-500/10 h-full">
        {article.featured_image && (
          <div className="relative overflow-hidden rounded-t-lg">
            <Image
              src={article.featured_image || "/placeholder.svg"}
              alt={article.title}
              width={400}
              height={200}
              className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
          </div>
        )}

        <CardHeader className="pb-3">
          <div className="flex items-center gap-4 text-sm text-slate-400 mb-2">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(article.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{article.reading_time} min read</span>
            </div>
          </div>

          <CardTitle className="text-slate-100 text-xl leading-tight group-hover:text-blue-400 transition-colors line-clamp-2">
            {article.title}
          </CardTitle>

          <CardDescription className="text-slate-400 leading-relaxed line-clamp-3">{article.excerpt}</CardDescription>
        </CardHeader>

        <CardContent className="pt-0 flex-1 flex flex-col justify-between">
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {article.tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 text-xs"
                >
                  {tag}
                </Badge>
              ))}
              {article.tags.length > 3 && (
                <Badge variant="secondary" className="bg-slate-700/50 text-slate-300 text-xs">
                  +{article.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-400 group-hover:text-blue-300 transition-colors">Read article</span>
            <ArrowRight className="h-4 w-4 text-blue-400 group-hover:text-blue-300 transition-all duration-300 group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
