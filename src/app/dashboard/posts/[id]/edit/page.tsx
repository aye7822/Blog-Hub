'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { trpc } from '@/lib/trpc-client'
import { Button } from '@/components/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MarkdownPreview } from '@/components/markdown-preview'
import { ArrowLeft, Save, Trash2, Edit, Eye } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function EditPostPage() {
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string
  const { toast } = useToast()
  const utils = trpc.useUtils()

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    published: false,
    categoryIds: [] as string[],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch post data
  const { data: post, isLoading: postLoading } = trpc.posts.getAll.useQuery({
    limit: 100,
  })

  // Fetch categories for selection
  const { data: categories, isLoading: categoriesLoading } = trpc.categories.getAll.useQuery()

  // Mutation for updating posts with proper error handling
  const updatePostMutation = trpc.posts.update.useMutation({
    onError: (error) => {
      console.error('Failed to update post:', error)
      
      // Handle specific tRPC error codes
      if (error?.data?.code === 'NOT_FOUND') {
        toast.error('Post not found. It may have been deleted.')
      } else if (error?.data?.code === 'CONFLICT') {
        toast.error('A post with this title already exists. Please choose a different title.')
      } else {
        toast.error('Failed to update post. Please try again.')
      }
      
      // Reset submitting state on error
      setIsSubmitting(false)
    },
    onSuccess: () => {
      toast.success('Post updated successfully!')
      // Invalidate posts cache to show the updated post immediately
      utils.posts.getAll.invalidate()
      router.push('/dashboard')
    },
    onSettled: () => {
      // Reset submitting state when mutation completes
      setIsSubmitting(false)
    }
  })

  useEffect(() => {
    if (post) {
      const currentPost = post.find(p => p.id === postId)
      if (currentPost) {
        setFormData({
          title: currentPost.title,
          slug: currentPost.slug || '',
          content: currentPost.content,
          excerpt: currentPost.excerpt || '',
          published: currentPost.published,
          categoryIds: currentPost.categories.map((cat: { id: string }) => cat.id),
        })
      }
      setIsLoading(false)
    }
  }, [post, postId])

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
    setIsSubmitting(true)

    // Use mutate instead of mutateAsync to prevent unhandled errors
    updatePostMutation.mutate({
      id: postId,
      title: formData.title,
      slug: formData.slug || undefined,
      content: formData.content,
      excerpt: formData.excerpt || undefined,
      published: formData.published,
      categoryIds: formData.categoryIds.length > 0 ? formData.categoryIds : undefined,
    })
  }

  // Mutation for deleting posts with proper error handling
  const deletePostMutation = trpc.posts.delete.useMutation({
    onError: (error) => {
      console.error('Failed to delete post:', error)
      if (error?.data?.code === 'NOT_FOUND') {
        toast.error('Post not found. It may have been deleted already.')
      } else {
        toast.error('Failed to delete post. Please try again.')
      }
    },
    onSuccess: () => {
      toast.success('Post deleted successfully!')
      // Invalidate posts cache to remove the deleted post immediately
      utils.posts.getAll.invalidate()
      router.push('/dashboard')
    }
  })

  const handleDelete = () => {
    deletePostMutation.mutate({ id: postId })
  }

  if (isLoading || postLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-6">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentPost = post?.find(p => p.id === postId)
  if (!currentPost) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
            <p className="text-gray-600 mb-6">The post you're trying to edit doesn't exist.</p>
            <Button asChild>
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Button variant="ghost" asChild className="mr-4">
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Edit Post</h1>
            </div>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Post
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Post Information</CardTitle>
              <CardDescription>
                Update the basic information for your blog post
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
                  onCheckedChange={(checked: boolean) => handleInputChange('published', !!checked)}
                />
                <Label htmlFor="published">Publish post</Label>
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
                <p className="text-gray-500">Loading categories...</p>
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

          {/* Content */}
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
              <CardDescription>
                Update your post content. You can use Markdown formatting and preview it below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="write" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="write" className="flex items-center gap-2">
                    <Edit className="h-4 w-4" />
                    Write
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Preview
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="write" className="mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="content">Post Content *</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => handleInputChange('content', e.target.value)}
                      placeholder="Write your post content here..."
                      rows={20}
                      required
                      className="font-mono"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="preview" className="mt-4">
                  <MarkdownPreview content={formData.content} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" asChild>
              <Link href="/dashboard">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Updating...' : 'Update Post'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
