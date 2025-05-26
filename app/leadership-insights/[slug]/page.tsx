import type { Metadata } from "next"
import ArticleClientPage from "./ArticleClientPage"

async function getArticle(slug: string) {
  // Simulate fetching data from a database or API
  const articles = [
    {
      slug: "example-article",
      title: "Example Article Title",
      content: "This is the content of the example article.",
      date: "2024-01-01",
      author: "John Doe",
      tags: ["leadership", "insights"],
      medium_link: "https://medium.com/example",
      devto_link: "https://dev.to/example",
      substack_link: "https://substack.com/example",
    },
    {
      slug: "another-article",
      title: "Another Article Title",
      content: "This is the content of another article.",
      date: "2024-01-15",
      author: "Jane Smith",
      tags: ["strategy", "innovation"],
      medium_link: null,
      devto_link: null,
      substack_link: null,
    },
  ]

  const article = articles.find((article) => article.slug === slug)

  if (!article) {
    return null
  }

  return article
}

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticle(params.slug)

  if (!article) {
    return {
      title: "Article Not Found",
    }
  }

  return {
    title: article.title,
    description: article.content,
    // You can add more metadata here, such as open graph tags, etc.
  }
}

interface PageProps {
  params: {
    slug: string
  }
}

export default async function ArticlePage({ params }: PageProps) {
  return <ArticleClientPage params={params} />
}
