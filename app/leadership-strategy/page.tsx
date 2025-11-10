import { HubPageTemplate } from "@/components/hub-page-template"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Target, BookOpen, Lightbulb, TrendingUp, Heart } from "lucide-react"
import type { HubConfig } from "@/lib/types"
import type { Metadata } from "next"

const leadershipConfig: HubConfig = {
  title: "Leadership Strategy",
  description: "Insights on building teams, driving innovation, and leading through complexity",
  contentFolder: "leadership",
  baseUrl: "/leadership-strategy",
  breadcrumbPath: "Strategic Narratives > Leadership Strategy",
  theme: {
    primary: "green",
    secondary: "slate",
    accent: "emerald",
  },
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}): Promise<Metadata> {
  const params = await searchParams
  const hasQueryParams = Object.keys(params).length > 0
  const baseUrl = "https://johnmunn.tech/leadership-strategy"
  
  // If there are query parameters (like ?tag=...), set canonical to base URL and noindex
  // This prevents duplicate content issues with filtered views
  if (hasQueryParams) {
    return {
      title: "Leadership Strategy | John Munn",
      description: leadershipConfig.description,
      robots: {
        index: false,
        follow: true,
        googleBot: {
          index: false,
          follow: true,
        },
      },
      alternates: {
        canonical: baseUrl,
      },
    }
  }

  // Base page metadata
  return {
    title: "Leadership Strategy | John Munn",
    description: leadershipConfig.description,
    openGraph: {
      title: "Leadership Strategy | John Munn",
      description: leadershipConfig.description,
      url: baseUrl,
      siteName: "John Munn - Technical Leader",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Leadership Strategy | John Munn",
      description: leadershipConfig.description,
    },
    alternates: {
      canonical: baseUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  }
}

interface LeadershipStrategyPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function LeadershipStrategyPage({ searchParams }: LeadershipStrategyPageProps) {
  return (
    <HubPageTemplate config={leadershipConfig}>
      {/* Introduction */}
      <div className="mb-12 text-center">
        <p className="text-lg text-slate-300 leading-relaxed max-w-4xl mx-auto">
          Technical leadership is about more than just code and architecture - it's about building teams that can tackle
          complex challenges, fostering innovation while maintaining operational excellence, and translating technical
          possibilities into business outcomes. These insights explore the intersection of technology and leadership,
          drawing from real-world experience building and scaling engineering organizations.
        </p>
      </div>

      {/* Leadership Focus Areas */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Card className="bg-slate-800/30 border-slate-700">
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 text-green-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-100 mb-2">Team Building</h3>
            <p className="text-slate-400 text-sm">
              Creating high-performing teams through clear communication, psychological safety, and shared vision.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/30 border-slate-700">
          <CardContent className="p-6 text-center">
            <Target className="h-8 w-8 text-green-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-100 mb-2">Strategic Thinking</h3>
            <p className="text-slate-400 text-sm">
              Aligning technical decisions with business objectives and long-term organizational goals.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/30 border-slate-700">
          <CardContent className="p-6 text-center">
            <BookOpen className="h-8 w-8 text-green-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-100 mb-2">Continuous Learning</h3>
            <p className="text-slate-400 text-sm">
              Fostering growth mindsets and building learning organizations that adapt to change.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/30 border-slate-700">
          <CardContent className="p-6 text-center">
            <Lightbulb className="h-8 w-8 text-green-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-100 mb-2">Innovation Management</h3>
            <p className="text-slate-400 text-sm">
              Balancing innovation with delivery, managing technical debt, and driving technological advancement.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/30 border-slate-700">
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-100 mb-2">Scaling Organizations</h3>
            <p className="text-slate-400 text-sm">
              Growing teams and systems sustainably while maintaining quality and culture.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/30 border-slate-700">
          <CardContent className="p-6 text-center">
            <Heart className="h-8 w-8 text-green-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-100 mb-2">People Development</h3>
            <p className="text-slate-400 text-sm">
              Mentoring, career development, and creating environments where people can do their best work.
            </p>
          </CardContent>
        </Card>
      </div>
    </HubPageTemplate>
  )
}
