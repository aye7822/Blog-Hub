import { Metadata } from 'next'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  ogImage?: string
  url?: string
  type?: 'website' | 'article'
  article?: {
    publishedTime?: string
    modifiedTime?: string
    author?: string
    tags?: string[]
  }
}

export function generateMetadata({
  title = 'BlogHub',
  description = 'A modern full-stack BlogHub built with Next.js 15, PostgreSQL, Drizzle ORM, and tRPC for type-safe API development.',
  keywords = ['blog', 'next.js', 'postgresql', 'drizzle', 'trpc', 'typescript'],
  ogImage = '/og-image.jpg',
  url = 'https://yourblog.com',
  type = 'website',
  article,
}: SEOProps): Metadata {
  const siteName = 'BlogHub'
  const fullTitle = title === siteName ? title : `${title} | ${siteName}`

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: 'BlogHub' }],
    openGraph: {
      title: fullTitle,
      description,
      images: [`${url}${ogImage}`],
      url,
      type,
      siteName,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [`${url}${ogImage}`],
    },
    alternates: {
      canonical: url,
    },
    icons: {
      icon: '/favicon.ico',
    },
  }

  // Add article-specific metadata
  if (article && type === 'article') {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: 'article',
      publishedTime: article.publishedTime,
      modifiedTime: article.modifiedTime,
      authors: article.author ? [article.author] : undefined,
      tags: article.tags,
    }
  }

  return metadata
}
