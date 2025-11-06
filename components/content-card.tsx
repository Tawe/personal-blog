import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExclusiveRibbon } from "@/components/exclusive-ribbon"
import {
  Calendar,
  Clock,
  ArrowRight,
  Tag,
  Map,
  Users,
  Crown,
  BookOpen,
  Building,
  Sword,
  Lightbulb,
  Sparkles,
  ExternalLink,
  Download,
  Star,
  Shield,
} from "lucide-react"
import type {
  BaseContentMetadata,
  TechnicalArticleMetadata,
  ArtumiContentMetadata,
  DndContentMetadata,
} from "@/lib/content"

// Type configurations
const artumiTypeConfig = {
  story: { color: "bg-purple-600/20 text-purple-400 border-purple-600/30", icon: Scroll, label: "Story" },
  lore: { color: "bg-blue-600/20 text-blue-400 border-blue-600/30", icon: BookOpen, label: "Lore" },
  character: { color: "bg-green-600/20 text-green-400 border-green-600/30", icon: Users, label: "Character" },
  location: { color: "bg-orange-600/20 text-orange-400 border-orange-600/30", icon: Map, label: "Location" },
  history: { color: "bg-red-600/20 text-red-400 border-red-600/30", icon: Crown, label: "History" },
  organization: { color: "bg-teal-600/20 text-teal-400 border-teal-600/30", icon: Building, label: "Organization" },
}

const dndTypeConfig = {
  "thought-piece": { color: "bg-blue-600/20 text-blue-400 border-blue-600/30", icon: Lightbulb, label: "Analysis" },
  mechanic: { color: "bg-purple-600/20 text-purple-400 border-purple-600/30", icon: Sparkles, label: "Mechanic" },
  monster: { color: "bg-red-600/20 text-red-400 border-red-600/30", icon: Sword, label: "Monster" },
  "magic-item": { color: "bg-orange-600/20 text-orange-400 border-orange-600/30", icon: Shield, label: "Magic Item" },
  npc: { color: "bg-green-600/20 text-green-400 border-green-600/30", icon: Users, label: "NPC" },
  adventure: { color: "bg-teal-600/20 text-teal-400 border-teal-600/30", icon: Map, label: "Adventure" },
  product: { color: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30", icon: Scroll, label: "Product" },
}

const statusConfig = {
  complete: { color: "bg-green-600/20 text-green-400 border-green-600/30", label: "Complete" },
  "in-progress": { color: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30", label: "In Progress" },
  planned: { color: "bg-slate-600/20 text-slate-400 border-slate-600/30", label: "Planned" },
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

// Unified content card component
interface ContentCardProps {
  content: BaseContentMetadata
  section: "leadership" | "technical" | "artumin" | "dnd"
  compact?: boolean
  hoverColor?: string
}

export function ContentCard({ content, section, compact = false, hoverColor = "blue" }: ContentCardProps) {
  const getContentUrl = () => {
    if (section === "dnd" && (content as DndContentMetadata).external_url) {
      return (content as DndContentMetadata).external_url!
    }

    const sectionPaths = {
      leadership: "/leadership-insights",
      technical: "/technical-writing",
      artumin: "/artumin",
      dnd: "/strategic-narratives/dnd-ttrpgs",
    }

    return `${sectionPaths[section]}/${content.slug}`
  }

  const isExternal = section === "dnd" && !!(content as DndContentMetadata).external_url
  const contentUrl = getContentUrl()

  const renderTypeInfo = () => {
    switch (section) {
      case "artumin": {
        const artumi = content as ArtumiContentMetadata
        const typeStyle = artumiTypeConfig[artumi.type]
        const statusStyle = statusConfig[artumi.status]
        const TypeIcon = typeStyle.icon

        return (
          <div className="flex gap-2">
            <Badge className={`${typeStyle.color} text-xs`}>
              <TypeIcon className="mr-1 h-3 w-3" />
              {typeStyle.label}
            </Badge>
            <Badge className={`${statusStyle.color} text-xs`}>{statusStyle.label}</Badge>
          </div>
        )
      }

      case "dnd": {
        const dnd = content as DndContentMetadata
        const typeStyle = dndTypeConfig[dnd.type]
        const TypeIcon = typeStyle.icon

        return (
          <div className="flex gap-2">
            <Badge className={`${typeStyle.color} text-xs`}>
              <TypeIcon className="mr-1 h-3 w-3" />
              {typeStyle.label}
            </Badge>
          </div>
        )
      }

      default:
        return null
    }
  }

  const renderAdditionalInfo = () => {
    switch (section) {
      case "technical": {
        const tech = content as TechnicalArticleMetadata
        return (
          <>
            {tech.code_languages && tech.code_languages.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {tech.code_languages.slice(0, 4).map((lang) => (
                  <Badge
                    key={lang}
                    variant="outline"
                    className="bg-slate-900/50 text-slate-300 border-slate-600 text-xs font-mono"
                  >
                    {lang}
                  </Badge>
                ))}
                {tech.code_languages.length > 4 && (
                  <Badge variant="outline" className="bg-slate-900/50 text-slate-300 border-slate-600 text-xs">
                    +{tech.code_languages.length - 4}
                  </Badge>
                )}
              </div>
            )}
          </>
        )
      }

      case "artumin": {
        const artumi = content as ArtumiContentMetadata
        return (
          <>
            {artumi.connections && artumi.connections.length > 0 && (
              <div className="text-xs text-slate-500 mb-4">
                Connected to {artumi.connections.length} other {artumi.connections.length === 1 ? "entry" : "entries"}
              </div>
            )}
          </>
        )
      }

      case "dnd": {
        const dnd = content as DndContentMetadata
        const systemStyle = systemConfig[dnd.system]
        return (
          <>
            <div className="flex items-center gap-4 mb-4 text-sm">
              <span className={`${systemStyle.color} font-medium`}>{systemStyle.label}</span>
              {dnd.level_range && (
                <span className="text-slate-400">Levels {dnd.level_range === "any" ? "Any" : dnd.level_range}</span>
              )}
            </div>
            {dnd.availability !== "free" && (
              <div className="flex items-center justify-between mb-4 text-sm">
                {dnd.price && <span className="text-green-400 font-medium">{dnd.price}</span>}
                {dnd.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-slate-300">{dnd.rating}</span>
                  </div>
                )}
              </div>
            )}
          </>
        )
      }

      default:
        return null
    }
  }

  if (compact) {
    return (
      <Link
        href={contentUrl}
        className="block group"
        {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}
      >
        <Card
          className={`bg-slate-800/30 border-slate-600 hover:border-${hoverColor}-500/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-${hoverColor}-500/10 relative overflow-hidden`}
        >
          {/* Website Exclusive Ribbon for compact cards */}
          {content.website_exclusive && <ExclusiveRibbon label="Exclusive" />}
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 mb-2">
              {renderTypeInfo()}
              {isExternal && <ExternalLink className="h-3 w-3 text-slate-400" />}
            </div>
            <CardTitle
              className={`text-slate-100 text-lg leading-tight group-hover:text-${hoverColor}-400 transition-colors`}
            >
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
      <Card
        className={`bg-gradient-to-br from-slate-800/50 to-slate-900/30 border-slate-600 hover:border-${hoverColor}-500/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-${hoverColor}-500/10 h-full relative overflow-hidden`}
      >
        {/* Website Exclusive Ribbon */}
        {content.website_exclusive && <ExclusiveRibbon />}

        {/* Status indicators */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
          {section === "technical" && (content as TechnicalArticleMetadata).recently_updated && (
            <Badge className="bg-green-600/20 text-green-400 border-green-600/30 text-xs">Recently Updated</Badge>
          )}
          {isExternal && (
            <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30 text-xs">
              <ExternalLink className="mr-1 h-3 w-3" />
              External
            </Badge>
          )}
        </div>

            <div className="relative overflow-hidden">
            <Image
              src={content.featured_image ? content.featured_image : "/placeholder.svg"}
              alt={content.title}
              width={500}
              height={300}
              className="aspect-video w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
            <div className="absolute bottom-3 left-3">{renderTypeInfo()}</div>
          </div>

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
              <span>
                {section === "dnd" && (content as DndContentMetadata).duration
                  ? (content as DndContentMetadata).duration
                  : `${content.reading_time} min`}
              </span>
            </div>
          </div>

          {!content.featured_image && <div className="mb-3">{renderTypeInfo()}</div>}

          <CardTitle
            className={`text-slate-100 text-xl leading-tight group-hover:text-${hoverColor}-400 transition-colors line-clamp-2`}
          >
            {content.title}
          </CardTitle>
          {content.subtitle && (
            <div className="text-slate-400 text-base mb-2 line-clamp-2">{content.subtitle}</div>
          )}

          <CardDescription className="text-slate-400 leading-relaxed line-clamp-3">{content.excerpt}</CardDescription>
        </CardHeader>

        <CardContent className="pt-0 flex-1 flex flex-col justify-between">
          {renderAdditionalInfo()}

          {/* Tags */}
          {content.tags && content.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {content.tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 text-xs"
                >
                  {section === "leadership" && <Tag className="h-3 w-3 mr-1" />}
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

          <div className="flex items-center justify-between">
            <span
              className={`text-sm text-${hoverColor}-400 group-hover:text-${hoverColor}-300 transition-colors font-medium`}
            >
              {isExternal
                ? "View Product"
                : section === "leadership"
                  ? "Read More"
                  : section === "artumin"
                    ? "Explore"
                    : "Read article"}
            </span>
            <ArrowRight
              className={`h-4 w-4 text-${hoverColor}-400 group-hover:text-${hoverColor}-300 transition-all duration-300 group-hover:translate-x-1`}
            />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

// Legacy component exports for backward compatibility
export function ArticleCard(props: {
  title: string
  description: string
  date: string
  readTime: string
  category: string
  slug: string
  tags?: string[]
}) {
  const content: BaseContentMetadata = {
    title: props.title,
    excerpt: props.description,
    date: props.date,
    reading_time: Number.parseInt(props.readTime),
    tags: props.tags || [],
    slug: props.slug,
  }
  return <ContentCard content={content} section="leadership" hoverColor="blue" />
}

export function TechnicalArticleCard({ article }: { article: TechnicalArticleMetadata }) {
  return <ContentCard content={article} section="technical" hoverColor="blue" />
}

export function ArtumiContentCard({ content, compact }: { content: ArtumiContentMetadata; compact?: boolean }) {
  return <ContentCard content={content} section="artumin" compact={compact} hoverColor="purple" />
}

export function DndContentCard({ content, compact }: { content: DndContentMetadata; compact?: boolean }) {
  return <ContentCard content={content} section="dnd" compact={compact} hoverColor="red" />
}
