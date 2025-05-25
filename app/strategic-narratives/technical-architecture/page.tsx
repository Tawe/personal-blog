"use client"

import type React from "react"

import { useState } from "react"
import { ContentLayout } from "@/components/content-layout"
import { TechnicalArticleCard } from "@/components/technical-article-card"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Code, Database, Cloud, Shield, Zap, GitBranch, ArrowLeft, Search, X, Target, FileText } from "lucide-react"
import Link from "next/link"
import type { TechnicalArticleMetadata } from "@/lib/technical-content"

// Sample technical articles data - in production, this would come from getAllTechnicalArticles('technical-architecture')
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

const allTags = Array.from(new Set(sampleArticles.flatMap((article) => article.tags || []))).sort()
const allDifficulties = ["beginner", "intermediate", "advanced"]
const allTypes = ["tutorial", "guide", "analysis", "documentation"]
const allLanguages = Array.from(new Set(sampleArticles.flatMap((article) => article.code_languages || []))).sort()

export default function TechnicalArchitecturePage() {
  const [filteredArticles, setFilteredArticles] = useState<TechnicalArticleMetadata[]>(sampleArticles || [])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("")
  const [selectedType, setSelectedType] = useState<string>("")

  const applyFilters = () => {
    try {
      let filtered = [...(sampleArticles || [])]

      // Search filter
      if (searchTerm && searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase()
        filtered = filtered.filter((article) => {
          if (!article) return false

          const titleMatch = (article.title || "").toLowerCase().includes(searchLower)
          const excerptMatch = (article.excerpt || "").toLowerCase().includes(searchLower)
          const tagsMatch = (article.tags || []).some((tag) => (tag || "").toLowerCase().includes(searchLower))
          const languagesMatch = (article.code_languages || []).some((lang) =>
            (lang || "").toLowerCase().includes(searchLower),
          )
          const difficultyMatch = (article.difficulty || "").toLowerCase().includes(searchLower)
          const typeMatch = (article.type || "").toLowerCase().includes(searchLower)

          return titleMatch || excerptMatch || tagsMatch || languagesMatch || difficultyMatch || typeMatch
        })
      }

      // Tag filter
      if (selectedTags && selectedTags.length > 0) {
        filtered = filtered.filter(
          (article) => article && article.tags && selectedTags.every((tag) => (article.tags || []).includes(tag)),
        )
      }

      // Difficulty filter
      if (selectedDifficulty) {
        filtered = filtered.filter((article) => article && article.difficulty === selectedDifficulty)
      }

      // Type filter
      if (selectedType) {
        filtered = filtered.filter((article) => article && article.type === selectedType)
      }

      setFilteredArticles(filtered || [])
    } catch (error) {
      console.error("Error filtering articles:", error)
      setFilteredArticles(sampleArticles || [])
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value || ""
    setSearchTerm(value)
    setTimeout(applyFilters, 0)
  }

  const handleTagToggle = (tag: string) => {
    if (!tag) return
    const newTags = selectedTags.includes(tag) ? selectedTags.filter((t) => t !== tag) : [...selectedTags, tag]
    setSelectedTags(newTags)
    setTimeout(applyFilters, 0)
  }

  const handleDifficultyChange = (value: string) => {
    setSelectedDifficulty(value || "")
    setTimeout(applyFilters, 0)
  }

  const handleTypeChange = (value: string) => {
    setSelectedType(value || "")
    setTimeout(applyFilters, 0)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedTags([])
    setSelectedDifficulty("")
    setSelectedType("")
    setFilteredArticles(sampleArticles || [])
  }

  const hasActiveFilters = searchTerm.trim() || selectedTags.length > 0 || selectedDifficulty || selectedType

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="absolute inset-0 bg-tech-pattern opacity-20"></div>
      <div className="relative">
        <ContentLayout
          title="Technical Architecture"
          description="Deep dives into system design, scalability, and technology decisions"
        >
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <div className="mb-8">
              <Button variant="ghost" className="text-slate-400 hover:text-blue-400 p-0" asChild>
                <Link href="/strategic-narratives">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Strategic Narratives
                </Link>
              </Button>
            </div>

            {/* Introduction */}
            <div className="mb-12 text-center">
              <p className="text-lg text-slate-300 leading-relaxed max-w-4xl mx-auto mb-8">
                Technical communication is about translating complex concepts into actionable insights. These articles
                focus on practical solutions, architectural patterns, and best practices drawn from real-world
                experience building and scaling software systems.
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

            {/* Filter Section */}
            <div className="space-y-6 mb-8 p-6 bg-gradient-to-r from-slate-800/30 to-blue-900/20 rounded-xl border border-slate-700">
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-5 w-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-slate-100">Filter Technical Content</h3>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-slate-400 hover:text-slate-200 ml-auto"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear all
                  </Button>
                )}
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search articles, technologies, or concepts..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10 bg-slate-800/50 border-slate-600 text-slate-100 placeholder:text-slate-400 focus:border-blue-500"
                />
              </div>

              {/* Filters */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-slate-400" />
                    <label className="text-sm font-medium text-slate-300">Difficulty Level</label>
                  </div>
                  <Select value={selectedDifficulty} onValueChange={handleDifficultyChange}>
                    <SelectTrigger className="bg-slate-800/50 border-slate-600 text-slate-100">
                      <SelectValue placeholder="All levels" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      {allDifficulties.map((difficulty) => (
                        <SelectItem key={difficulty} value={difficulty} className="text-slate-100">
                          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-slate-400" />
                    <label className="text-sm font-medium text-slate-300">Article Type</label>
                  </div>
                  <Select value={selectedType} onValueChange={handleTypeChange}>
                    <SelectTrigger className="bg-slate-800/50 border-slate-600 text-slate-100">
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      {allTypes.map((type) => (
                        <SelectItem key={type} value={type} className="text-slate-100">
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Tags */}
              {allTags.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-slate-300">Topics & Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? "default" : "secondary"}
                        className={`cursor-pointer transition-colors text-xs ${
                          selectedTags.includes(tag)
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
                        }`}
                        onClick={() => handleTagToggle(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Results counter */}
              <div className="text-sm text-slate-400 pt-2 border-t border-slate-700">
                <span className="font-medium">
                  Showing {filteredArticles?.length || 0} of {sampleArticles?.length || 0} articles
                </span>
                {hasActiveFilters && (
                  <span className="ml-2">
                    • Filters: {searchTerm && `"${searchTerm}"`}
                    {selectedDifficulty && ` • ${selectedDifficulty}`}
                    {selectedType && ` • ${selectedType}`}
                    {selectedTags.length > 0 && ` • ${selectedTags.join(", ")}`}
                  </span>
                )}
              </div>
            </div>

            {/* Articles Grid */}
            {filteredArticles && filteredArticles.length > 0 ? (
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
      </div>
    </div>
  )
}
