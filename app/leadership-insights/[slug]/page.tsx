import { notFound } from "next/navigation"
import { ContentLayout } from "@/components/content-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, ArrowLeft, Share2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Sample article data - in production, this would come from getArticleBySlug
const sampleArticle = {
  slug: "technical-decision-making",
  title: "The Art of Technical Decision Making",
  date: "2024-03-10",
  excerpt: "How to balance technical debt, innovation, and business objectives in complex engineering decisions.",
  tags: ["Leadership", "Decision Making", "Strategy", "Technical Debt"],
  reading_time: 7,
  featured_image: "/placeholder.svg?height=400&width=800",
  content: `
# The Art of Technical Decision Making

As technical leaders, we face complex decisions daily that can shape the trajectory of our organizations for years to come. The challenge isn't just choosing the right technology—it's balancing competing priorities, managing risk, and ensuring our decisions serve both immediate needs and long-term vision.

## The Framework for Technical Decisions

Every significant technical decision should be evaluated through multiple lenses:

### Business Impact
- How does this choice advance our strategic objectives?
- What's the total cost of ownership over 3-5 years?
- How does it affect our time to market?

### Technical Excellence
- Does this solution scale with our growth projections?
- How does it fit with our existing architecture?
- What are the maintenance and operational implications?

### Team Capability
- Do we have the expertise to implement and maintain this?
- What's the learning curve for our team?
- How does this affect our hiring and retention strategy?

### Risk Management
- What are the potential failure modes?
- How do we mitigate risks during implementation?
- What's our rollback strategy if things go wrong?

## Balancing Innovation with Stability

One of the most challenging aspects of technical leadership is knowing when to embrace new technologies and when to stick with proven solutions. I've learned that the best approach is to create "innovation budgets"—deliberately allocating a portion of our technical capacity to exploring new technologies while maintaining stability in our core systems.

## The Role of Technical Debt

Technical debt isn't inherently bad—it's a tool. Like financial debt, it can accelerate progress when used strategically. The key is being intentional about when we incur it and having a clear plan for paying it down.

## Making Decisions Under Uncertainty

In fast-moving environments, we rarely have perfect information. The goal isn't to eliminate uncertainty but to make good decisions despite it. This requires:

- Clear decision-making frameworks
- Regular review and adjustment cycles
- Strong feedback loops from implementation teams
- Willingness to change course when new information emerges

## Conclusion

Technical decision-making is as much art as science. It requires balancing analytical rigor with intuitive understanding of team dynamics, market forces, and organizational culture. The best technical leaders are those who can navigate this complexity while maintaining clarity of vision and purpose.

The decisions we make today shape the organizations we'll lead tomorrow. By approaching them with intentionality, frameworks, and humility, we can build technical foundations that enable sustained innovation and growth.
  `,
}

interface PageProps {
  params: {
    slug: string
  }
}

export default function ArticlePage({ params }: PageProps) {
  // In production, this would use getArticleBySlug(params.slug)
  const article = sampleArticle

  if (!article) {
    notFound()
  }

  return (
    <ContentLayout title={article.title}>
      <div className="max-w-4xl mx-auto">
        {/* Back Navigation */}
        <div className="mb-8">
          <Button variant="ghost" className="text-slate-400 hover:text-slate-200" asChild>
            <Link href="/leadership-insights">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Leadership Insights
            </Link>
          </Button>
        </div>

        {/* Article Header */}
        <header className="mb-8">
          {article.featured_image && (
            <div className="relative mb-8 rounded-xl overflow-hidden">
              <Image
                src={article.featured_image || "/placeholder.svg"}
                alt={article.title}
                width={800}
                height={400}
                className="aspect-video w-full object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
            </div>
          )}

          <div className="space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-100 leading-tight">{article.title}</h1>

            <div className="flex flex-wrap items-center gap-6 text-slate-400">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(article.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{article.reading_time} min read</span>
              </div>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-200">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>

            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-slate-700/50 text-slate-300">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Article Content */}
        <article className="prose prose-invert prose-blue max-w-none mb-12">
          <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, "<br />") }} />
        </article>

        {/* Related Articles */}
        <Card className="bg-slate-800/30 border-slate-700">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-slate-100 mb-4">Continue Reading</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Link
                href="/leadership-insights/high-performance-teams"
                className="block p-4 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
              >
                <h4 className="font-medium text-slate-200 mb-2">Building High-Performance Engineering Teams</h4>
                <p className="text-sm text-slate-400">
                  Strategies for recruiting, developing, and retaining top engineering talent...
                </p>
              </Link>
              <Link
                href="/leadership-insights/stakeholder-communication"
                className="block p-4 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
              >
                <h4 className="font-medium text-slate-200 mb-2">The CTO's Guide to Stakeholder Communication</h4>
                <p className="text-sm text-slate-400">Translating technical complexity into business value...</p>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  )
}
