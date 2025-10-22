'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { trpc } from '@/lib/trpc-client'
import { Button } from '@/components/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorBoundary } from '@/components/error-boundary'
import { Search, Hash, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react'
import { getWordCount, getReadingTime, formatReadingTime } from '@/lib/utils'
import { formatDate, formatRelativeTime, extractExcerpt, debounce, getErrorMessage } from '@/lib/helpers'
import type { Category } from '@/lib/types'

export default function BlogPageClient() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>()
  const [showPublishedOnly, setShowPublishedOnly] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 9

  // Fetch categories for filter dropdown
  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = trpc.categories.getAll.useQuery()

  // Fetch posts with filtering and pagination
  const { data: allPosts, isLoading: postsLoading, error, refetch } = trpc.posts.getAll.useQuery({
    categoryId: selectedCategory,
    published: showPublishedOnly ? true : undefined,
    search: searchQuery || undefined,
    limit: 100, // Get posts for client-side pagination
  })

  // Calculate pagination
  const totalPosts = allPosts?.length || 0
  const totalPages = Math.ceil(totalPosts / postsPerPage)
  const startIndex = (currentPage - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage
  const posts = allPosts?.slice(startIndex, endIndex) || []

  // Debounced search to avoid too many API calls
  const debouncedSearch = debounce((query: string) => {
    setSearchQuery(query)
  }, 300)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory, showPublishedOnly, searchQuery])

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value === 'all' ? undefined : value)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BlogHub
              </Link>
            </div>
            <nav className="flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium">
                Home
              </Link>
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium">
                Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <div className="mb-8 text-center">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
              Blog Posts
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover articles on technology, travel, food, and more. Explore our curated collection of insights and stories.
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-200/50">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search */}
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Search Posts
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Search by title, content, or excerpt..."
                    defaultValue={searchQuery}
                    onChange={(e) => debouncedSearch(e.target.value)}
                    className="pl-12 h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="w-full lg:w-64">
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Filter by Category
                </label>
                {categoriesLoading ? (
                  <div className="h-12 flex items-center justify-center border border-gray-300 rounded-xl bg-gray-50">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Loading categories...</span>
                  </div>
                ) : categoriesError ? (
                  <div className="text-red-500 text-sm bg-red-50 p-2 rounded-lg">Error loading categories</div>
                ) : (
                  <Select onValueChange={handleCategoryChange} defaultValue="all">
                    <SelectTrigger className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-gray-200">
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Status Filter */}
              <div className="w-full lg:w-48">
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Post Status
                </label>
                <Button
                  variant={showPublishedOnly ? "default" : "outline"}
                  onClick={() => setShowPublishedOnly(!showPublishedOnly)}
                  className="w-full h-12 justify-center rounded-xl font-medium transition-all duration-200 hover:scale-105"
                  size="lg"
                >
                  {showPublishedOnly ? 'Published Only' : 'Show All Posts'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
              <ErrorBoundary>
                {postsLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Card key={i} className="border border-gray-200/50 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
                        <CardHeader className="pb-4 p-6">
                          <Skeleton className="h-6 w-3/4 mb-3" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-2/3" />
                        </CardHeader>
                        <CardContent className="p-6 pt-0">
                          <div className="flex gap-2 mb-4">
                            <Skeleton className="h-6 w-16" />
                            <Skeleton className="h-6 w-20" />
                          </div>
                          <div className="flex items-center gap-6 mb-6">
                            <Skeleton className="h-8 w-24" />
                            <Skeleton className="h-8 w-20" />
                          </div>
                          <Skeleton className="h-12 w-full rounded-xl" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : error ? (
                  <div className="text-center py-20">
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-12 max-w-lg mx-auto">
                      <div className="text-red-600 text-lg font-semibold mb-4">Error loading posts</div>
                      <p className="text-red-500 mb-6">{getErrorMessage(error)}</p>
                      <Button onClick={() => refetch()} className="bg-red-600 hover:bg-red-700 text-white">
                        Try Again
                      </Button>
                    </div>
                  </div>
                ) : posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Card key={post.id} className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-200/50 hover:border-blue-300/50 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
                {/* Featured Image */}
                {post.imageUrl && (
                  <div className="relative w-full h-48 overflow-hidden">
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      quality={85}
                      onError={(e) => {
                        // Hide image container if image fails to load
                        const container = e.currentTarget.closest('div')
                        if (container) {
                          container.style.display = 'none'
                        }
                      }}
                    />
                  </div>
                )}
                
                <CardHeader className="pb-4 p-6">
                  <CardTitle className="line-clamp-2 text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors duration-200">
                    <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="text-gray-600 line-clamp-3 text-base leading-relaxed">
                    {post.excerpt ? (
                      <span>{post.excerpt}</span>
                    ) : (
                      <span>{extractExcerpt(post.content, 150)}</span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-2 flex-wrap">
                      {(post.categories || []).map((category: Category) => (
                        <Badge key={category.id} variant="secondary" className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors">
                          {category.name}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-sm text-gray-500 font-medium">
                      {formatDate(post.createdAt)}
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
                    <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                      <Hash className="h-4 w-4 mr-1" />
                      {getWordCount(post.content)} words
                    </div>
                    <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                      <BookOpen className="h-4 w-4 mr-1" />
                      {formatReadingTime(getReadingTime(post.content))}
                    </div>
                  </div>
                  <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl">
                    <Link href={`/blog/${post.slug}`}>
                      Read More
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-12 max-w-lg mx-auto">
              <div className="mb-6">
                <Search className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No posts found matching your criteria</h3>
                <p className="text-gray-600">Try adjusting your search or filters to find what you're looking for.</p>
              </div>
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl">
                <Link href="/dashboard/posts/new">
                  Create Your First Post
                </Link>
              </Button>
            </div>
          </div>
        )}
        </ErrorBoundary>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-16 pt-8 border-t border-gray-200/50">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
                Showing {startIndex + 1}-{Math.min(endIndex, totalPosts)} of {totalPosts} posts
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="px-6 rounded-xl border-gray-300 hover:border-blue-500 hover:text-blue-600 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNumber = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                    if (pageNumber > totalPages) return null

                    return (
                      <Button
                        key={pageNumber}
                        variant={currentPage === pageNumber ? "default" : "outline"}
                        size="lg"
                        onClick={() => handlePageChange(pageNumber)}
                        className={`w-12 rounded-xl ${
                          currentPage === pageNumber 
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                            : 'border-gray-300 hover:border-blue-500 hover:text-blue-600'
                        } transition-all duration-200`}
                      >
                        {pageNumber}
                      </Button>
                    )
                  })}
                </div>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="px-6 rounded-xl border-gray-300 hover:border-blue-500 hover:text-blue-600 transition-colors"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="mb-4">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BlogHub
              </Link>
            </div>
            <p className="text-gray-600 mb-2">
              &copy; 2025 BlogHub. Built with modern web technologies.
            </p>
            
          </div>
        </div>
      </footer>
    </div>
  )
}
