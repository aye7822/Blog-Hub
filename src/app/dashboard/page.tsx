'use client'

import Link from 'next/link'
import { trpc } from '@/lib/trpc-client'
import { Button } from '@/components/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PlusCircle, FileText, Tag, Eye, Edit, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const { toast } = useToast()
  const utils = trpc.useUtils()

  // Fetch data
  const { data: posts, isLoading: postsLoading } = trpc.posts.getAll.useQuery({
    limit: 100,
  })
  const { data: categories, isLoading: categoriesLoading } = trpc.categories.getAll.useQuery()

  const publishedPosts = posts?.filter(post => post.published) || []
  const draftPosts = posts?.filter(post => !post.published) || []

  // Mutations with proper error handling
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
    }
  })

  const deleteCategoryMutation = trpc.categories.delete.useMutation({
    onError: (error) => {
      console.error('Failed to delete category:', error)
      if (error?.data?.code === 'NOT_FOUND') {
        toast.error('Category not found. It may have been deleted already.')
      } else {
        toast.error('Failed to delete category. Please try again.')
      }
    },
    onSuccess: () => {
      toast.success('Category deleted successfully!')
      // Invalidate categories cache to remove the deleted category immediately
      utils.categories.getAll.invalidate()
    }
  })

  const handleDeletePost = (postId: string) => {
    deletePostMutation.mutate({ id: postId })
  }

  const handleDeleteCategory = (categoryId: string) => {
    deleteCategoryMutation.mutate({ id: categoryId })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                BlogHub
              </Link>
            </div>
            <nav className="flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-gray-900">
                Home
              </Link>
              <Link href="/blog" className="text-gray-700 hover:text-gray-900">
                Blog
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Manage your blog posts and categories</p>
          </div>
          <div className="flex gap-3">
            <Button asChild size="lg">
              <Link href="/dashboard/posts/new">
                <PlusCircle className="h-5 w-5 mr-2" />
                New Post
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link href="/dashboard/categories/new">
                <Tag className="h-5 w-5 mr-2" />
                New Category
              </Link>
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-lg font-semibold">Total Posts</CardTitle>
                  <FileText className="h-6 w-6 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-gray-900 mb-2">{posts?.length || 0}</div>
                  <p className="text-sm text-gray-600">
                    {publishedPosts.length} published, {draftPosts.length} drafts
                  </p>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-lg font-semibold">Categories</CardTitle>
                  <Tag className="h-6 w-6 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-gray-900 mb-2">{categories?.length || 0}</div>
                  <p className="text-sm text-gray-600">
                    Active categories
                  </p>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-lg font-semibold">Published Posts</CardTitle>
                  <Eye className="h-6 w-6 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-gray-900 mb-2">{publishedPosts.length}</div>
                  <p className="text-sm text-gray-600">
                    Live on the blog
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Posts */}
            <Card className="p-6">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold">Recent Posts</CardTitle>
                <CardDescription>Your latest blog posts</CardDescription>
              </CardHeader>
              <CardContent>
                {postsLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : posts && posts.length > 0 ? (
                  <div className="space-y-4">
                    {posts.slice(0, 5).map((post) => (
                      <div key={post.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">{post.title}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(post.createdAt).toLocaleDateString()} • {(post.categories || []).length} categories
                          </p>
                        </div>
                        <div className="flex items-center gap-3 ml-4">
                          <Badge variant={post.published ? "default" : "secondary"} className="shrink-0">
                            {post.published ? 'Published' : 'Draft'}
                          </Badge>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/blog/${post.slug}`} title="View post">
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/dashboard/posts/${post.id}/edit`} title="Edit post">
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No posts yet. Create your first post!</p>
                    <Button asChild>
                      <Link href="/dashboard/posts/new">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Create First Post
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Posts Tab */}
          <TabsContent value="posts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Posts</CardTitle>
                <CardDescription>Manage your blog posts</CardDescription>
              </CardHeader>
              <CardContent>
                {postsLoading ? (
                  <p className="text-gray-500">Loading posts...</p>
                ) : posts && posts.length > 0 ? (
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-medium">{post.title}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(post.createdAt).toLocaleDateString()} • {post.categories.length} categories
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={post.published ? "default" : "secondary"}>
                            {post.published ? 'Published' : 'Draft'}
                          </Badge>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/blog/${post.slug}`}>
                                <Eye className="h-3 w-3" />
                              </Link>
                            </Button>
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/dashboard/posts/${post.id}/edit`}>
                                <Edit className="h-3 w-3" />
                              </Link>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeletePost(post.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No posts yet. Create your first post!</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
                <p className="text-gray-600">Manage your blog categories</p>
              </div>
              <Button asChild>
                <Link href="/dashboard/categories/new">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  New Category
                </Link>
              </Button>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>All Categories</CardTitle>
                <CardDescription>Manage your blog categories</CardDescription>
              </CardHeader>
              <CardContent>
                {categoriesLoading ? (
                  <p className="text-gray-500">Loading categories...</p>
                ) : categories && categories.length > 0 ? (
                  <div className="space-y-4">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-medium">{category.name}</h3>
                          {category.description && (
                            <p className="text-sm text-gray-500">{category.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {category.slug}
                          </Badge>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/dashboard/categories/${category.id}/edit`}>
                                <Edit className="h-3 w-3" />
                              </Link>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteCategory(category.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No categories yet. Create your first category!</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 BlogHub. Built with modern web technologies.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
