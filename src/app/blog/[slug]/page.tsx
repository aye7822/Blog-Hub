import { Metadata } from 'next'
import { generateMetadata as generateSEOMetadata } from '@/lib/metadata'
import BlogPostClient from './blog-post-client'
import { api } from '@/lib/trpc-server'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  
  try {
    const post = await api.posts.getBySlug({ slug })
    
    return generateSEOMetadata({
      title: post.title,
      description: post.excerpt || `${post.content.substring(0, 160)}...`,
      keywords: [
          ...post.categories.map(cat => cat.name.toLowerCase()),
          'blog',
          'article',
          'post'
      ],
      type: 'article',
      article: {
          publishedTime: post.createdAt.toISOString(),
          modifiedTime: post.updatedAt.toISOString(),
          author: post.authorId,
          tags: post.categories.map(cat => cat.name)
      },
    })
  } catch (error) {
    return generateSEOMetadata({
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
    })
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  return <BlogPostClient slug={slug} />
}
