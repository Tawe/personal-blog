import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowRight, Scroll, Map, Users, Crown, BookOpen, Building } from "lucide-react"
import type { ArtumiContentMetadata } from "@/lib/artumi-content"

interface ArtumiContentCardProps {
  content: ArtumiContentMetadata
  compact?: boolean
}

const typeConfig = {
  story: { color: "bg-purple-600/20 text-purple-400 border-purple-600/30", icon: Scroll, label: "Story" },
  lore: { color: "bg-blue-600/20 text-blue-400 border-blue-600/30", icon: BookOpen, label: "Lore" },
  character: { color: "bg-green-600/20 text-green-400 border-green-600/30", icon: Users, label: "Character" },
  location: { color: "bg-orange-600/20 text-orange-400 border-orange-600/30", icon: Map, label: "Location" },
  history: { color: "bg-red-600/20 text-red-400 border-red-600/30", icon: Crown, label: "History" },
  organization: { color: "bg-teal-600/20 text-teal-400 border-teal-600/30", icon: Building, label: "Organization" },
}

const statusConfig = {
  complete: { color: "bg-green-600/20 text-green-400 border-green-600/30", label: "Complete" },
  "in-progress": { color: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30", label: "In Progress" },
  planned: { color: "bg-slate-600/20 text-slate-400 border-slate-600/30", label: "Planned" },
}

const regionColors = {
  "Northern Kingdoms": "text-blue-400",
  "Coastal Realms": "text-teal-400",
  "Eastern Dominion": "text-orange-400",
  "All Regions": "text-purple-400",
}

export function ArtumiContentCard({ content, compact = false }: ArtumiContentCardProps) {
  const contentUrl = `/artumin/${content.slug}`
  const typeStyle = typeConfig[content.type]
  const statusStyle = statusConfig[content.status]
  const TypeIcon = typeStyle.icon
  const regionColor = regionColors[content.region as keyof typeof regionColors] || "text-slate-400"

  if (compact) {
    return (
      <Link href={contentUrl} className="block group">
        <Card className="bg-slate-800/30 border-slate-600 hover:border-purple-500/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-purple-500/10">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={`${typeStyle.color} text-xs`}>
                <TypeIcon className="mr-1 h-3 w-3" />
                {typeStyle.label}
              </Badge>
              {content.region && <span className={`text-xs ${regionColor}`}>{content.region}</span>}
            </div>
            <CardTitle className="text-slate-100 text-lg leading-tight group-hover:text-purple-400 transition-colors">
              {content.title}
            </CardTitle>
            <CardDescription className="text-slate-400 text-sm line-clamp-2">{content.excerpt}</CardDescription>
          </CardHeader>
        </Card>
      </Link>
    )
  }

  return (
    <Link href={contentUrl} className="block group">
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/30 border-slate-600 hover:border-purple-500/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-purple-500/10 h-full relative overflow-hidden">
        {/* Status Indicator */}
        <div className="absolute top-3 right-3 z-10">
          <Badge className={`${statusStyle.color} text-xs`}>{statusStyle.label}</Badge>
        </div>

        {content.featured_image && (
          <div className="relative overflow-hidden">
            <Image
              src={content.featured_image || "/placeholder.svg"}
              alt={content.title}
              width={500}
              height={300}
              className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />

            {/* Overlay metadata */}
            <div className="absolute bottom-3 left-3 flex gap-2">
              <Badge className={`${typeStyle.color} text-xs`}>
                <TypeIcon className="mr-1 h-3 w-3" />
                {typeStyle.label}
              </Badge>
              {content.region && (
                <Badge className="bg-slate-900/70 text-slate-300 border-slate-600 text-xs">{content.region}</Badge>
              )}
            </div>
          </div>
        )}

        <CardHeader className="pb-3">
          <div className="flex items-center gap-4 text-sm text-slate-400 mb-2">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(content.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{content.reading_time} min</span>
            </div>
          </div>

          {!content.featured_image && (
            <div className="flex gap-2 mb-3">
              <Badge className={`${typeStyle.color} text-xs`}>
                <TypeIcon className="mr-1 h-3 w-3" />
                {typeStyle.label}
              </Badge>
              {content.region && (
                <Badge className="bg-slate-700/50 text-slate-300 border-slate-600 text-xs">{content.region}</Badge>
              )}
            </div>
          )}

          <CardTitle className="text-slate-100 text-xl leading-tight group-hover:text-purple-400 transition-colors line-clamp-2">
            {content.title}
          </CardTitle>

          <CardDescription className="text-slate-400 leading-relaxed line-clamp-3">{content.excerpt}</CardDescription>
        </CardHeader>

        <CardContent className="pt-0 flex-1 flex flex-col justify-between">
          {/* Categories */}
          {content.categories && content.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {content.categories.slice(0, 3).map((category) => (
                <Badge
                  key={category}
                  variant="secondary"
                  className="bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 text-xs"
                >
                  {category}
                </Badge>
              ))}
              {content.categories.length > 3 && (
                <Badge variant="secondary" className="bg-slate-700/50 text-slate-300 text-xs">
                  +{content.categories.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Connections indicator */}
          {content.connections && content.connections.length > 0 && (
            <div className="text-xs text-slate-500 mb-4">
              Connected to {content.connections.length} other {content.connections.length === 1 ? "entry" : "entries"}
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm text-purple-400 group-hover:text-purple-300 transition-colors font-medium">
              Explore
            </span>
            <ArrowRight className="h-4 w-4 text-purple-400 group-hover:text-purple-300 transition-all duration-300 group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
