'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { trpc } from '@/lib/trpc-client'
import { Button } from '@/components/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Save } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function EditCategoryPage() {
  const router = useRouter()
  const params = useParams()
  const categoryId = params.id as string
  const { toast } = useToast()
  const utils = trpc.useUtils()
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch category data
  const { data: category, isLoading: categoryLoading, error: categoryError } = trpc.categories.getById.useQuery(
    { id: categoryId },
    {
      enabled: !!categoryId,
    }
  )

  // Update form data when category is loaded
  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || '',
      })
      setIsLoading(false)
    }
  }, [category])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  // Mutation for updating categories with proper error handling
  const updateCategoryMutation = trpc.categories.update.useMutation({
    onError: (error) => {
      console.error('Category update error:', error)
      
      // Handle specific tRPC error codes
      if (error.data?.code === 'CONFLICT') {
        toast.error('A category with this name already exists. Please choose a different name.')
      } else if (error.data?.code === 'NOT_FOUND') {
        toast.error('Category not found. It may have been deleted.')
      } else if (error.data?.code === 'BAD_REQUEST') {
        toast.error('Please check your input and try again.')
      } else {
        toast.error('Failed to update category. Please try again.')
      }
      
      // Reset submitting state on error
      setIsSubmitting(false)
    },
    onSuccess: () => {
      toast.success('Category updated successfully!')
      // Invalidate and refetch categories to show the updated category immediately
      utils.categories.getAll.invalidate()
      utils.categories.getById.invalidate({ id: categoryId })
      router.push('/dashboard')
    },
    onSettled: () => {
      // Reset submitting state when mutation completes (success or error)
      setIsSubmitting(false)
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Use mutate instead of mutateAsync to prevent unhandled errors
    updateCategoryMutation.mutate({
      id: categoryId,
      name: formData.name,
      description: formData.description || undefined,
    })
  }

  if (isLoading || categoryLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="flex justify-end space-x-3">
                  <div className="h-10 bg-gray-200 rounded w-20"></div>
                  <div className="h-10 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (categoryError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="text-red-600 text-lg font-semibold mb-4">Error loading category</div>
            <p className="text-gray-600 mb-6">The category could not be found or loaded.</p>
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
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Button variant="ghost" asChild className="mr-4">
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Edit Category</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">Category Information</CardTitle>
            <CardDescription>
              Update the category details below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2 block">
                  Name *
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter category name"
                  required
                  className="w-full"
                />
              </div>

              {/* Description Field */}
              <div>
                <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-2 block">
                  Description (Optional)
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Brief description of this category"
                  rows={4}
                  className="w-full resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/dashboard')}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.name.trim()}
                  className="flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Updating...' : 'Update Category'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
