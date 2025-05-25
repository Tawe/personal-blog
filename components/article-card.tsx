import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Tag } from "lucide-react"

interface ArticleCardProps {
  title: string
  description: string
  date: string
  readTime: string
  category: string
  slug: string
  tags?: string[]
}

export function ArticleCard({ title, description, date, readTime, category, slug, tags }: ArticleCardProps) {
  return (
    <Card className="bg-slate-800/50 border-slate-600 hover:border-blue-500/50 transition-all duration-300 group h-full">
      <CardHeader>
        <div className="flex items-center gap-4 text-sm text-blue-400 mb-2">
          <span>{category}</span>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{readTime}</span>
          </div>
        </div>
        <CardTitle className="text-slate-100 text-xl leading-tight group-hover:text-blue-400 transition-colors">
          {title}
        </CardTitle>
        <CardDescription className="text-slate-400 leading-relaxed">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-md"
              >
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1 text-sm text-slate-500">
            <Calendar className="h-4 w-4" />
            <span>{date}</span>
          </div>
          <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300" asChild>
            <Link href={slug}>Read More</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
