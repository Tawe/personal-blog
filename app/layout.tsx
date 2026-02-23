import type React from "react"
import type { Metadata, Viewport } from "next"
import "./globals.css"
import { PersonSchema } from "@/components/person-schema"
import { WebsiteSchema } from "@/components/website-schema"
import { ProfilePageSchema } from "@/components/profile-page-schema"
import { GoogleAnalytics } from "@/components/google-analytics"
import { ThemeProvider } from "@/components/theme-provider"
import { DARK_MODE_ENABLED } from "@/lib/feature-flags"
import { PageSchema } from "@/components/page-schema"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  title: {
    default: "John Munn - Engineering leader and writer",
    template: "%s | John Munn",
  },
  description:
    "Engineering leader and writer. Systems, teams, and the work of building things that last. Open to conversation — mentoring, collaboration, and exchanging ideas.",
  keywords: [
    "engineering leadership",
    "technical architecture",
    "AI evaluation",
    "RAG systems",
    "software strategy",
    "technical writing",
  ],
  authors: [{ name: "John Munn" }],
  creator: "John Munn",
  publisher: "John Munn",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://johnmunn.tech",
    siteName: "John Munn",
    title: "John Munn - Engineering leader and writer",
    description:
      "Engineering leader and writer. Systems, teams, and the work of building things that last. Open to conversation — mentoring, collaboration, and exchanging ideas.",
    images: [
      {
        url: "/me.jpeg",
        width: 1200,
        height: 630,
        alt: "John Munn - Engineering leader and writer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "John Munn - Engineering leader and writer",
    description:
      "Engineering leader and writer. Systems, teams, and the work of building things that last. Open to conversation — mentoring, collaboration, and exchanging ideas.",
    images: ["/me.jpeg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/pentagon-growth.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  metadataBase: new URL("https://johnmunn.tech"),
  alternates: {
    canonical: "https://johnmunn.tech",
    types: {
      "application/rss+xml": "https://johnmunn.tech/feed.xml",
    },
  },
  category: "technology",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-61NJPVE52G"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-61NJPVE52G', {
                page_path: window.location.pathname + window.location.search,
                page_title: document.title,
                page_location: window.location.href
              });
            `,
          }}
        />
        {/* Preconnect to external domains for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        {/* Prefetch next likely navigations (low priority; avoids preload warning) */}
        <link rel="prefetch" href="/writing" />
        <link rel="prefetch" href="/projects" />
        <link rel="prefetch" href="/about" />
        <link rel="prefetch" href="/contact" />
        <PersonSchema />
        <WebsiteSchema />
        <ProfilePageSchema />
      </head>
      <body>
        <a
          href="#main-content"
          className="absolute left-4 -top-20 z-[100] rounded bg-white px-4 py-2 text-black shadow-lg transition-all focus:top-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3A6EA5]"
        >
          Skip to main content
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme={DARK_MODE_ENABLED ? "system" : "light"}
          enableSystem={DARK_MODE_ENABLED}
          disableTransitionOnChange
          forceTheme={DARK_MODE_ENABLED ? undefined : "light"}
        >
          <GoogleAnalytics />
          <PageSchema />
          <div id="main-content">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
