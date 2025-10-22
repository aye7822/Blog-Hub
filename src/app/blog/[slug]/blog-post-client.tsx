'use client'

import Link from 'next/link'
import Image from 'next/image'
import { trpc } from '@/lib/trpc-client'
import { Button } from '@/components/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, Calendar, Edit, BookOpen, Hash } from 'lucide-react'
import { getWordCount, formatReadingTime, getReadingTime } from '@/lib/utils'
import { formatDate, formatDateTime, formatRelativeTime } from '@/lib/helpers'
import type { Category } from '@/lib/types'

interface BlogPostClientProps {
  slug: string
}

export default function BlogPostClient({ slug }: BlogPostClientProps) {
  const { data: post, isLoading, error } = trpc.posts.getBySlug.useQuery({ slug })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center py-6">
              <Button variant="ghost" asChild className="mr-4">
                <Link href="/blog">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Blog
                </Link>
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <article className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <Skeleton className="h-12 w-3/4 mb-4" />
            <div className="flex items-center gap-4 mb-6">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="h-64 w-full" />
          </article>
        </main>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center py-6">
              <Button variant="ghost" asChild className="mr-4">
                <Link href="/blog">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Blog
                </Link>
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
            <p className="text-gray-600 mb-6">
              The post you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/blog">Back to Blog</Link>
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <Button variant="ghost" asChild>
              <Link href="/blog">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Link>
            </Button>

            <Button variant="outline" asChild>
              <Link href={`/dashboard/posts/${post.id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Post
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Post Header */}
          <div className="p-8 lg:p-12 pb-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Post Meta */}
            <div className="flex flex-col gap-6 text-gray-600 mb-8">
              <div className="flex flex-wrap items-center gap-6 text-base">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  {formatDate(post.createdAt)}
                </div>

                <div className="flex items-center">
                  <Hash className="h-5 w-5 mr-2" />
                  {getWordCount(post.content)} words
                </div>

                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  {formatReadingTime(getReadingTime(post.content))}
                </div>
              </div>

              {/* Categories */}
              <div className="flex gap-2 flex-wrap">
                {(post.categories || []).map((category) => (
                  <Badge key={category.id} variant="secondary" className="text-sm px-3 py-1">
                    {category.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Featured Image */}
            {post.imageUrl && (
              <div className="mb-8">
                <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            )}

            {/* Excerpt */}
            {post.excerpt && (
              <div className="text-xl lg:text-2xl text-gray-700 font-medium mb-8 italic border-l-4 border-blue-500 pl-6">
                {post.excerpt}
              </div>
            )}
          </div>

          {/* Post Content */}
          <div className="px-8 lg:px-12 pb-12">
            <div className="prose prose-lg lg:prose-xl max-w-none">
              <div className="whitespace-pre-wrap text-gray-800 leading-relaxed text-lg">
                {post.content}
              </div>
            </div>
          </div>
        </article>

        {/* Post Actions */}
        <div className="mt-8 flex justify-between items-center">
          <Button variant="outline" asChild>
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
          </Button>

          <Button asChild>
            <Link href={`/dashboard/posts/${post.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Post
            </Link>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 BlogHub. Built with modern web technologies.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
