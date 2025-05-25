import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowRight, Code, Zap, AlertCircle } from "lucide-react"
import type { TechnicalArticleMetadata } from "@/lib/technical-content"

interface TechnicalArticleCardProps {
  article: TechnicalArticleMetadata
}

const difficultyConfig = {
  beginner: { color: "bg-green-600/20 text-green-400 border-green-600/30", icon: "●" },
  intermediate: { color: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30", icon: "●●" },
  advanced: { color: "bg-red-600/20 text-red-400 border-red-600/30", icon: "●●●" },
}

const typeConfig = {
  tutorial: { color: "bg-blue-600/20 text-blue-400 border-blue-600/30", icon: Code },
  guide: { color: "bg-purple-600/20 text-purple-400 border-purple-600/30", icon: Zap },
  analysis: { color: "bg-orange-600/20 text-orange-400 border-orange-600/30", icon: AlertCircle },
  documentation: { color: "bg-slate-600/20 text-slate-400 border-slate-600/30", icon: Code },
}

export function TechnicalArticleCard({ article }: TechnicalArticleCardProps) {
  const articleUrl = `/technical-writing/${article.slug}`
  const difficultyStyle = difficultyConfig[article.difficulty]
  const typeStyle = typeConfig[article.type]
  const TypeIcon = typeStyle.icon

  return (
    <Link href={articleUrl} className="block group">
      <Card className="bg-slate-800/50 border-slate-600 hover:border-blue-500/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-500/10 h-full relative overflow-hidden">
        {/* Recently Updated Indicator */}
        {article.recently_updated && (
          <div className="absolute top-3 right-3 z-10">
            <Badge className="bg-green-600/20 text-green-400 border-green-600/30 text-xs">Recently Updated</Badge>
          </div>
        )}

        {article.featured_image && (
          <div className="relative overflow-hidden">
            <Image
              src={article.featured_image || "/placeholder.svg"}
              alt={article.title}
              width={400}
              height={200}
              className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />

            {/* Overlay metadata */}
            <div className="absolute bottom-3 left-3 flex gap-2">
              <Badge className={`${difficultyStyle.color} text-xs font-mono`}>
                {difficultyStyle.icon} {article.difficulty}
              </Badge>
              <Badge className={`${typeStyle.color} text-xs`}>
                <TypeIcon className="h-3 w-3 mr-1" />
                {article.type}
              </Badge>
            </div>
          </div>
        )}

        <CardHeader className="pb-3">
          <div className="flex items-center gap-4 text-sm text-slate-400 mb-2">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(article.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{article.reading_time} min</span>
            </div>
          </div>

          {!article.featured_image && (
            <div className="flex gap-2 mb-3">
              <Badge className={`${difficultyStyle.color} text-xs font-mono`}>
                {difficultyStyle.icon} {article.difficulty}
              </Badge>
              <Badge className={`${typeStyle.color} text-xs`}>
                <TypeIcon className="h-3 w-3 mr-1" />
                {article.type}
              </Badge>
            </div>
          )}

          <CardTitle className="text-slate-100 text-xl leading-tight group-hover:text-blue-400 transition-colors line-clamp-2">
            {article.title}
          </CardTitle>

          <CardDescription className="text-slate-400 leading-relaxed line-clamp-3">{article.excerpt}</CardDescription>
        </CardHeader>

        <CardContent className="pt-0 flex-1 flex flex-col justify-between">
          {/* Code Languages */}
          {article.code_languages && article.code_languages.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {article.code_languages.slice(0, 4).map((lang) => (
                <Badge
                  key={lang}
                  variant="outline"
                  className="bg-slate-900/50 text-slate-300 border-slate-600 text-xs font-mono"
                >
                  {lang}
                </Badge>
              ))}
              {article.code_languages.length > 4 && (
                <Badge variant="outline" className="bg-slate-900/50 text-slate-300 border-slate-600 text-xs">
                  +{article.code_languages.length - 4}
                </Badge>
              )}
            </div>
          )}

          {/* Tags */}
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
                  +{article.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-400 group-hover:text-blue-300 transition-colors font-medium">
              Read article
            </span>
            <ArrowRight className="h-4 w-4 text-blue-400 group-hover:text-blue-300 transition-all duration-300 group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
