import { ContentLayout } from "@/components/content-layout"
import { ArticleCard } from "@/components/article-card"

// This would typically come from a content management system or markdown files
const articles = [
  {
    title: "Building Resilient Microservices Architecture",
    description: "Key principles for designing fault-tolerant distributed systems that scale with your organization.",
    date: "March 15, 2024",
    readTime: "8 min read",
    category: "Architecture",
    slug: "/technical-strategy/resilient-microservices",
    tags: ["Microservices", "Architecture", "Scalability"],
  },
  {
    title: "The Evolution of API Design",
    description: "From REST to GraphQL to gRPC: choosing the right API strategy for your technical stack.",
    date: "March 8, 2024",
    readTime: "12 min read",
    category: "API Design",
    slug: "/technical-strategy/api-evolution",
    tags: ["APIs", "REST", "GraphQL", "gRPC"],
  },
  {
    title: "Database Strategy for Modern Applications",
    description: "Navigating the polyglot persistence landscape and making informed database technology choices.",
    date: "February 28, 2024",
    readTime: "10 min read",
    category: "Data Strategy",
    slug: "/technical-strategy/database-strategy",
    tags: ["Databases", "Architecture", "Data"],
  },
  {
    title: "Cloud-Native Security Patterns",
    description: "Implementing security-first thinking in cloud-native architectures and DevOps pipelines.",
    date: "February 20, 2024",
    readTime: "15 min read",
    category: "Security",
    slug: "/technical-strategy/cloud-security",
    tags: ["Security", "Cloud", "DevOps"],
  },
  {
    title: "Performance Engineering at Scale",
    description:
      "Strategies for maintaining application performance as your system grows from thousands to millions of users.",
    date: "February 12, 2024",
    readTime: "11 min read",
    category: "Performance",
    slug: "/technical-strategy/performance-scale",
    tags: ["Performance", "Scalability", "Optimization"],
  },
  {
    title: "The Future of Frontend Architecture",
    description: "Exploring micro-frontends, edge computing, and the next generation of web application architectures.",
    date: "February 5, 2024",
    readTime: "9 min read",
    category: "Frontend",
    slug: "/technical-strategy/frontend-future",
    tags: ["Frontend", "Architecture", "Web"],
  },
]

export default function TechnicalStrategyPage() {
  return (
    <ContentLayout
      title="Technical Strategy"
      description="Architecture decisions, technology choices, and engineering excellence insights for building scalable, maintainable systems."
    >
      <div className="grid md:grid-cols-2 gap-8 mt-12">
        {articles.map((article, index) => (
          <ArticleCard key={index} {...article} />
        ))}
      </div>
    </ContentLayout>
  )
}
