"use client"

import { useState } from "react"
import { ContentLayout } from "@/components/content-layout"
import { TechnicalArticleCard } from "@/components/technical-article-card"
import { TechnicalContentFilter } from "@/components/technical-content-filter"
import { Card, CardContent } from "@/components/ui/card"
import { Code, Database, Cloud, Shield, Zap, GitBranch } from "lucide-react"
import type { TechnicalArticleMetadata } from "@/lib/technical-content"

// Sample technical articles data - in production, this would come from getAllTechnicalArticles()
const sampleArticles: TechnicalArticleMetadata[] = [
  {
    slug: "microservices-architecture",
    title: "Building Scalable Microservices Architecture",
    date: "2024-01-15",
    updated: "2024-02-01",
    excerpt: "A comprehensive guide to designing and implementing microservices that scale with your business needs",
    tags: ["architecture", "microservices", "scalability", "devops"],
    difficulty: "intermediate",
    type: "guide",
    reading_time: 12,
    featured_image: "/placeholder.svg?height=200&width=400",
    code_languages: ["javascript", "docker", "yaml"],
    recently_updated: true,
  },
  {
    slug: "react-performance-optimization",
    title: "Performance Optimization Techniques for React Applications",
    date: "2024-01-08",
    excerpt:
      "Practical strategies to improve the performance of your React apps, from code splitting to memory optimization",
    tags: ["react", "performance", "javascript", "optimization"],
    difficulty: "advanced",
    type: "tutorial",
    reading_time: 14,
    featured_image: "/placeholder.svg?height=200&width=400",
    code_languages: ["javascript", "typescript", "react"],
  },
  {
    slug: "kubernetes-deployment-strategies",
    title: "Advanced Kubernetes Deployment Strategies",
    date: "2024-01-02",
    excerpt: "Master blue-green deployments, canary releases, and rolling updates in Kubernetes environments",
    tags: ["kubernetes", "devops", "deployment", "containers"],
    difficulty: "advanced",
    type: "guide",
    reading_time: 18,
    featured_image: "/placeholder.svg?height=200&width=400",
    code_languages: ["yaml", "bash", "docker"],
  },
  {
    slug: "database-design-patterns",
    title: "Modern Database Design Patterns",
    date: "2023-12-20",
    updated: "2024-01-10",
    excerpt: "Explore CQRS, Event Sourcing, and other patterns for building scalable data architectures",
    tags: ["database", "architecture", "patterns", "scalability"],
    difficulty: "intermediate",
    type: "analysis",
    reading_time: 16,
    featured_image: "/placeholder.svg?height=200&width=400",
    code_languages: ["sql", "javascript", "python"],
    recently_updated: true,
  },
  {
    slug: "api-security-best-practices",
    title: "API Security Best Practices",
    date: "2023-12-15",
    excerpt: "Comprehensive guide to securing REST and GraphQL APIs with authentication, authorization, and monitoring",
    tags: ["security", "api", "authentication", "best-practices"],
    difficulty: "intermediate",
    type: "guide",
    reading_time: 10,
    featured_image: "/placeholder.svg?height=200&width=400",
    code_languages: ["javascript", "python", "yaml"],
  },
  {
    slug: "typescript-advanced-patterns",
    title: "Advanced TypeScript Patterns for Large Applications",
    date: "2023-12-08",
    excerpt:
      "Leverage TypeScript's type system for better code organization and developer experience in enterprise apps",
    tags: ["typescript", "patterns", "enterprise", "javascript"],
    difficulty: "advanced",
    type: "tutorial",
    reading_time: 13,
    featured_image: "/placeholder.svg?height=200&width=400",
    code_languages: ["typescript", "javascript"],
  },
]

const allTags = Array.from(new Set(sampleArticles.flatMap((article) => article.tags))).sort()
const allDifficulties = ["beginner", "intermediate", "advanced"]
const allTypes = ["tutorial", "guide", "analysis", "documentation"]
const allLanguages = Array.from(new Set(sampleArticles.flatMap((article) => article.code_languages || []))).sort()

export default function TechnicalWritingPage() {
  const [filteredArticles, setFilteredArticles] = useState<TechnicalArticleMetadata[]>(sampleArticles)

  return (
    <ContentLayout
      title="Technical Writing"
      description="Deep dives into architecture, best practices, and technical solutions"
    >
      <div className="max-w-7xl mx-auto">
        {/* Introduction */}
        <div className="mb-12 text-center">
          <p className="text-lg text-slate-300 leading-relaxed max-w-4xl mx-auto mb-8">
            Technical communication is about translating complex concepts into actionable insights. These articles focus
            on practical solutions, architectural patterns, and best practices drawn from real-world experience building
            and scaling software systems.
          </p>
        </div>

        {/* Technical Focus Areas */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="bg-slate-800/30 border-slate-700">
            <CardContent className="p-6 text-center">
              <Code className="h-8 w-8 text-blue-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-slate-100 mb-2">Architecture & Design</h3>
              <p className="text-slate-400 text-sm">
                System design patterns, microservices, and scalable architecture principles.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/30 border-slate-700">
            <CardContent className="p-6 text-center">
              <Zap className="h-8 w-8 text-blue-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-slate-100 mb-2">Performance & Optimization</h3>
              <p className="text-slate-400 text-sm">
                Strategies for building fast, efficient applications that scale under load.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/30 border-slate-700">
            <CardContent className="p-6 text-center">
              <Cloud className="h-8 w-8 text-blue-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-slate-100 mb-2">Cloud & DevOps</h3>
              <p className="text-slate-400 text-sm">
                Modern deployment strategies, containerization, and cloud-native development.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/30 border-slate-700">
            <CardContent className="p-6 text-center">
              <Database className="h-8 w-8 text-blue-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-slate-100 mb-2">Data & Databases</h3>
              <p className="text-slate-400 text-sm">
                Database design, data modeling, and strategies for managing data at scale.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/30 border-slate-700">
            <CardContent className="p-6 text-center">
              <Shield className="h-8 w-8 text-blue-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-slate-100 mb-2">Security & Best Practices</h3>
              <p className="text-slate-400 text-sm">
                Security patterns, code quality, and engineering practices for reliable systems.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/30 border-slate-700">
            <CardContent className="p-6 text-center">
              <GitBranch className="h-8 w-8 text-blue-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-slate-100 mb-2">Languages & Frameworks</h3>
              <p className="text-slate-400 text-sm">
                Deep dives into JavaScript, TypeScript, React, and modern development tools.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Content Filter */}
        <TechnicalContentFilter
          articles={sampleArticles}
          allTags={allTags}
          allDifficulties={allDifficulties}
          allTypes={allTypes}
          allLanguages={allLanguages}
          onFilterChange={setFilteredArticles}
        />

        {/* Articles Grid */}
        {filteredArticles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <TechnicalArticleCard key={article.slug} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Code className="h-12 w-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No articles found</h3>
            <p className="text-slate-400">
              Try adjusting your search terms or clearing the filters to see more articles.
            </p>
          </div>
        )}
      </div>
    </ContentLayout>
  )
}
