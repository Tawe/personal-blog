"use client"

import { useState, useEffect } from "react"
import { WorldOfArtuminClient } from "./client"
import { ContentLayout } from "@/components/content-layout"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Crown, Sword, BookOpen } from "lucide-react"
import { BreadcrumbSchema } from "@/components/breadcrumb-schema"

interface ArtumiContentMetadata {
  slug: string
  title: string
  date: string
  excerpt?: string
  tags: string[]
  reading_time?: number
  type: "story" | "lore" | "character" | "location" | "history" | "organization"
  categories: string[]
  region?: string
  status: "complete" | "in-progress" | "planned"
}

export default function WorldOfArtuminPage() {
  const [articles, setArticles] = useState<ArtumiContentMetadata[]>([])
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/content/artumin")
        const data = await response.json()
        setArticles(data.articles || [])
        setAvailableTags(data.tags || [])
      } catch (error) {
        console.error("Error fetching artumin content:", error)
        setArticles([])
        setAvailableTags([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-text-body">Loading...</div>
      </div>
    )
  }

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": "https://johnmunn.tech/strategic-narratives/world-of-artumin#collection",
    url: "https://johnmunn.tech/strategic-narratives/world-of-artumin",
    name: "World of Artumin",
    description: "Reflective fantasy and leadership fables exploring worth, power, and courage through narrative.",
    isPartOf: { "@id": "https://johnmunn.tech/#website" },
    inLanguage: "en-US",
    about: {
      "@type": "CreativeWorkSeries",
      name: "World of Artumin",
      author: {
        "@type": "Person",
        name: "John Munn",
        url: "https://johnmunn.tech/about",
      },
    },
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "About", url: "/about" },
          { name: "World of Artumin", url: "/strategic-narratives/world-of-artumin" },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionSchema).replace(/</g, "\\u003c"),
        }}
      />
      <div className="absolute inset-0 bg-tech-pattern opacity-[0.08]"></div>
      <div className="absolute inset-0 bg-hero-whisper opacity-60"></div>
      <div className="relative">
        <ContentLayout
          title="World of Artumin"
          description="Reflective fantasy and leadership fables exploring worth, power, and courage"
        >
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <Button
                variant="ghost"
                className="text-text-muted hover:text-text-strong !hover:bg-transparent !active:bg-transparent !focus-visible:bg-transparent p-0"
                asChild
              >
                <Link href="/about">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to About
                </Link>
              </Button>
            </div>

            {/* Description Section */}
            <div className="mb-16">
              <p className="text-xs uppercase tracking-[0.2em] text-accent-secondary text-center mb-4">
                Truth Told Sideways
              </p>
              <p className="text-lg text-text-body text-center max-w-5xl mx-auto leading-relaxed">
                The World of Artumin weaves together fantasy storytelling with profound leadership insights, creating
                fables that explore the complexities of power, responsibility, and moral courage. These tales examine
                how individuals navigate difficult decisions, build meaningful connections, and discover their true
                worth in a world where magic and politics intertwine. Each story serves as both entertainment and
                reflection, offering timeless lessons wrapped in compelling narratives.
              </p>
              <div className="mx-auto mt-8 h-px w-36 bg-accent-secondary/40" />
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <Card className="bg-bg-paper border-border-subtle shadow-sm">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-accent-secondary/20">
                    <Crown className="w-8 h-8 text-accent-secondary" />
                  </div>
                  <h3 className="text-xl font-semibold text-text-strong mb-4">Leadership Fables</h3>
                  <p className="text-text-body">
                    Stories that explore the weight of command, the burden of difficult decisions, and the courage
                    required to lead with integrity.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-bg-paper border-border-subtle shadow-sm">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-accent-secondary/20">
                    <Sword className="w-8 h-8 text-accent-secondary" />
                  </div>
                  <h3 className="text-xl font-semibold text-text-strong mb-4">Character Studies</h3>
                  <p className="text-text-body">
                    Deep explorations of individuals facing moral complexity, personal growth, and the challenge of
                    staying true to their values.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-bg-paper border-border-subtle shadow-sm">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-accent-secondary/20">
                    <BookOpen className="w-8 h-8 text-accent-secondary" />
                  </div>
                  <h3 className="text-xl font-semibold text-text-strong mb-4">World Building</h3>
                  <p className="text-text-body">
                    Rich explorations of Artumin&apos;s cultures, politics, and magical systems that create the backdrop for
                    meaningful storytelling.
                  </p>
                </CardContent>
              </Card>
            </div>

            <WorldOfArtuminClient articles={articles} availableTags={availableTags} />
          </div>
        </ContentLayout>
      </div>
    </div>
  )
}
