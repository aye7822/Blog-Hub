import { Metadata } from 'next'
import { generateMetadata as generateSEOMetadata } from '@/lib/metadata'
import BlogPageClient from './blog-page-client'

export const metadata: Metadata = generateSEOMetadata({
  title: "Blog Posts",
  description: "Browse all blog posts with categories, search functionality, and pagination. Discover articles on technology, travel, food, health, and personal development.",
  keywords: ['blog posts', 'articles', 'technology', 'travel', 'food', 'health', 'personal development'],
})

export default function BlogPage() {
  return <BlogPageClient />
}