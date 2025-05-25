import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Clock,
  ArrowRight,
  Scroll,
  Sword,
  Users,
  Map,
  Lightbulb,
  Sparkles,
  ExternalLink,
  Download,
  Star,
  Shield,
} from "lucide-react"
import type { DndContentMetadata } from "@/lib/dnd-content"

interface DndContentCardProps {
  content: DndContentMetadata
  compact?: boolean
}

const typeConfig = {
  "thought-piece": { color: "bg-blue-600/20 text-blue-400 border-blue-600/30", icon: Lightbulb, label: "Analysis" },
  mechanic: { color: "bg-purple-600/20 text-purple-400 border-purple-600/30", icon: Sparkles, label: "Mechanic" },
  monster: { color: "bg-red-600/20 text-red-400 border-red-600/30", icon: Sword, label: "Monster" },
  "magic-item": { color: "bg-orange-600/20 text-orange-400 border-orange-600/30", icon: Shield, label: "Magic Item" },
  npc: { color: "bg-green-600/20 text-green-400 border-green-600/30", icon: Users, label: "NPC" },
  adventure: { color: "bg-teal-600/20 text-teal-400 border-teal-600/30", icon: Map, label: "Adventure" },
  product: { color: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30", icon: Scroll, label: "Product" },
}

const systemConfig = {
  "5e": { color: "text-red-400", label: "D&D 5e" },
  pathfinder: { color: "text-orange-400", label: "Pathfinder" },
  "system-agnostic": { color: "text-slate-400", label: "System Agnostic" },
}

const availabilityConfig = {
  free: { color: "bg-green-600/20 text-green-400 border-green-600/30", icon: Download, label: "Free" },
  premium: { color: "bg-blue-600/20 text-blue-400 border-blue-600/30", icon: Star, label: "Premium" },
  commercial: {
    color: "bg-purple-600/20 text-purple-400 border-purple-600/30",
    icon: ExternalLink,
    label: "Commercial",
  },
}

export function DndContentCard({ content, compact = false }: DndContentCardProps) {
  const contentUrl = content.external_url || `/dnd-musings/${content.slug}`
  const isExternal = !!content.external_url
  const typeStyle = typeConfig[content.type]
  const systemStyle = systemConfig[content.system]
  const availabilityStyle = availabilityConfig[content.availability]
  const TypeIcon = typeStyle.icon
  const AvailabilityIcon = availabilityStyle.icon

  if (compact) {
    return (
      <Link
        href={contentUrl}
        className="block group"
        {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}
      >
        <Card className="bg-slate-800/30 border-slate-600 hover:border-red-500/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-red-500/10">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={`${typeStyle.color} text-xs`}>
                <TypeIcon className="mr-1 h-3 w-3" />
                {typeStyle.label}
              </Badge>
              <span className={`text-xs ${systemStyle.color}`}>{systemStyle.label}</span>
              {isExternal && <ExternalLink className="h-3 w-3 text-slate-400" />}
            </div>
            <CardTitle className="text-slate-100 text-lg leading-tight group-hover:text-red-400 transition-colors">
              {content.title}
            </CardTitle>
            <CardDescription className="text-slate-400 text-sm line-clamp-2">{content.excerpt}</CardDescription>
          </CardHeader>
        </Card>
      </Link>
    )
  }

  return (
    <Link
      href={contentUrl}
      className="block group"
      {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}
    >
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/30 border-slate-600 hover:border-red-500/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-red-500/10 h-full relative overflow-hidden">
        {/* External Link Indicator */}
        {isExternal && (
          <div className="absolute top-3 right-3 z-10">
            <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30 text-xs">
              <ExternalLink className="mr-1 h-3 w-3" />
              External
            </Badge>
          </div>
        )}

        {/* Playtested Indicator */}
        {content.playtested && !isExternal && (
          <div className="absolute top-3 right-3 z-10">
            <Badge className="bg-green-600/20 text-green-400 border-green-600/30 text-xs">Playtested</Badge>
          </div>
        )}

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
              <Badge className={`${availabilityStyle.color} text-xs`}>
                <AvailabilityIcon className="mr-1 h-3 w-3" />
                {availabilityStyle.label}
              </Badge>
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
            {content.duration && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{content.duration}</span>
              </div>
            )}
          </div>

          {!content.featured_image && (
            <div className="flex gap-2 mb-3">
              <Badge className={`${typeStyle.color} text-xs`}>
                <TypeIcon className="mr-1 h-3 w-3" />
                {typeStyle.label}
              </Badge>
              <Badge className={`${availabilityStyle.color} text-xs`}>
                <AvailabilityIcon className="mr-1 h-3 w-3" />
                {availabilityStyle.label}
              </Badge>
            </div>
          )}

          <CardTitle className="text-slate-100 text-xl leading-tight group-hover:text-red-400 transition-colors line-clamp-2">
            {content.title}
          </CardTitle>

          <CardDescription className="text-slate-400 leading-relaxed line-clamp-3">{content.excerpt}</CardDescription>
        </CardHeader>

        <CardContent className="pt-0 flex-1 flex flex-col justify-between">
          {/* System and Level Range */}
          <div className="flex items-center gap-4 mb-4 text-sm">
            <span className={`${systemStyle.color} font-medium`}>{systemStyle.label}</span>
            {content.level_range && (
              <span className="text-slate-400">
                Levels {content.level_range === "any" ? "Any" : content.level_range}
              </span>
            )}
          </div>

          {/* Tags */}
          {content.tags && content.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {content.tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 text-xs"
                >
                  {tag}
                </Badge>
              ))}
              {content.tags.length > 3 && (
                <Badge variant="secondary" className="bg-slate-700/50 text-slate-300 text-xs">
                  +{content.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Price and Rating for Commercial Content */}
          {content.availability !== "free" && (
            <div className="flex items-center justify-between mb-4 text-sm">
              {content.price && <span className="text-green-400 font-medium">{content.price}</span>}
              {content.rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-slate-300">{content.rating}</span>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm text-red-400 group-hover:text-red-300 transition-colors font-medium">
              {isExternal ? "View Product" : "Read More"}
            </span>
            <ArrowRight className="h-4 w-4 text-red-400 group-hover:text-red-300 transition-all duration-300 group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
