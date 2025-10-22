'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { trpc } from '@/lib/trpc-client'
import { Button } from '@/components/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MarkdownPreview } from '@/components/markdown-preview'
import { RichTextEditor } from '@/components/rich-text-editor'
import { PostImageUpload } from '@/components/image-upload'
import { LoadingSpinner } from '@/components/loading-spinner'
import { ErrorBoundary, useAsyncError } from '@/components/error-boundary'
import { useToast } from '@/components/toast'
import { ArrowLeft, Save, Edit, Eye } from 'lucide-react'

export default function NewPostPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { error, resetError, handleError } = useAsyncError()
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    published: false,
    categoryIds: [] as string[],
    imageUrl: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch categories for selection
  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = trpc.categories.getAll.useQuery()

  // Mutation for creating posts with optimistic updates
  const utils = trpc.useUtils()
  const createPostMutation = trpc.posts.create.useMutation({
    onMutate: async (newPost) => {
      // Cancel any outgoing refetches
      await utils.posts.getAll.cancel()
      
      // Snapshot the previous value
      const previousPosts = utils.posts.getAll.getData()
      
      // Optimistically update to the new value
      utils.posts.getAll.setData({}, (old) => {
        if (!old) return old
        const optimisticPost = {
          id: 'temp-' + Date.now(),
          title: newPost.title,
          slug: newPost.title.toLowerCase().replace(/\s+/g, '-'),
          content: newPost.content,
          excerpt: newPost.excerpt || '',
          published: newPost.published,
          authorId: 'current-user',
          imageUrl: newPost.imageUrl || '',
          createdAt: new Date(),
          updatedAt: new Date(),
          categories: [],
        }
        return [...old, optimisticPost]
      })
      
      return { previousPosts }
    },
    onError: (err, newPost, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousPosts) {
        utils.posts.getAll.setData({}, context.previousPosts)
      }
      
      // Handle specific tRPC error codes
      if (err.data?.code === 'CONFLICT') {
        toast.error('A post with this title already exists. Please choose a different title.')
      } else if (err.data?.code === 'BAD_REQUEST') {
        toast.error('Please check your input and try again.')
      } else {
        toast.error('Failed to create post. Please try again.')
      }
      
      handleError(new Error(err.message || 'Failed to create post'))
      
      // Reset submitting state on error
      setIsSubmitting(false)
    },
    onSuccess: () => {
      toast.success('Post created successfully!')
      // Invalidate posts cache to show the new post immediately
      utils.posts.getAll.invalidate()
      router.push('/dashboard')
    },
    onSettled: () => {
      // Always refetch after error or success
      utils.posts.getAll.invalidate()
      // Reset submitting state when mutation completes
      setIsSubmitting(false)
    },
  })

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
    
    // Auto-generate slug from title
    if (field === 'title' && typeof value === 'string') {
      const autoSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .trim()
      setFormData(prev => ({
        ...prev,
        slug: autoSlug,
      }))
    }
  }

  const handleCategoryChange = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter(id => id !== categoryId)
        : [...prev.categoryIds, categoryId],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.title.trim()) {
      toast.error('Title is required')
      return
    }
    
    if (!formData.content.trim()) {
      toast.error('Content is required')
      return
    }
    
    setIsSubmitting(true)
    resetError()

    // Use mutate instead of mutateAsync to prevent unhandled errors
    createPostMutation.mutate({
      title: formData.title,
      slug: formData.slug || undefined,
      content: formData.content,
      excerpt: formData.excerpt || undefined,
      published: formData.published,
      categoryIds: formData.categoryIds.length > 0 ? formData.categoryIds : undefined,
      imageUrl: formData.imageUrl || undefined,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Button variant="ghost" asChild className="mr-4">
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">New Post</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorBoundary>
          {error && (
            <div className="mb-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <p className="text-sm text-red-700 mt-1">{error.message}</p>
                    <button
                      onClick={resetError}
                      className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {categoriesError && (
            <div className="mb-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Warning</h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      Failed to load categories. You can still create a post without categories.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Post Information</CardTitle>
              <CardDescription>
                Enter the basic information for your blog post
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter post title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug (Optional)</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  placeholder="url-friendly-slug"
                />
                <p className="text-sm text-gray-500">
                  This will be used in the URL. If left empty, it will be auto-generated from the title.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt (Optional)</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange('excerpt', e.target.value)}
                  placeholder="Brief description of your post"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => handleInputChange('published', !!checked)}
                />
                <Label htmlFor="published">Publish immediately</Label>
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
              <CardDescription>
                Select categories for your post (optional)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {categoriesLoading ? (
                <div className="space-y-3">
                  <LoadingSpinner size="sm" />
                  <p className="text-gray-500">Loading categories...</p>
                </div>
              ) : categories && categories.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={formData.categoryIds.includes(category.id)}
                        onCheckedChange={() => handleCategoryChange(category.id)}
                      />
                      <Label htmlFor={`category-${category.id}`}>
                        {category.name}
                      </Label>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">
                  No categories available.{' '}
                  <Link href="/dashboard/categories/new" className="text-blue-600 hover:underline">
                    Create your first category
                  </Link>
                </p>
              )}
            </CardContent>
          </Card>

          {/* Featured Image */}
          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
              <CardDescription>
                Upload a featured image for your post (optional)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PostImageUpload
                onImageSelect={(url) => handleInputChange('imageUrl', url)}
                currentImageUrl={formData.imageUrl}
              />
            </CardContent>
          </Card>

          {/* Content */}
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
              <CardDescription>
                Write your post content using the rich text editor below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="content">Post Content *</Label>
                <RichTextEditor
                  content={formData.content}
                  onChange={(content) => handleInputChange('content', content)}
                  placeholder="Write your post content here..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" asChild disabled={isSubmitting}>
              <Link href="/dashboard">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Creating...' : 'Create Post'}
            </Button>
          </div>
        </form>
        </ErrorBoundary>
      </main>
    </div>
  )
}
