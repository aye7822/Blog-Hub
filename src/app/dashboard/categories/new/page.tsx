'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { trpc } from '@/lib/trpc-client'
import { Button } from '@/components/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Save } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function NewCategoryPage() {
  const router = useRouter()
  const { toast } = useToast()
  const utils = trpc.useUtils()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  // Mutation for creating categories with optimistic updates
  const createCategoryMutation = trpc.categories.create.useMutation({
    onMutate: async (newCategory) => {
      // Cancel any outgoing refetches
      await utils.categories.getAll.cancel()
      
      // Snapshot the previous value
      const previousCategories = utils.categories.getAll.getData()
      
      // Optimistically update to the new value
      utils.categories.getAll.setData(undefined, (old) => {
        if (!old) return old
        const optimisticCategory = {
          id: 'temp-' + Date.now(),
          name: newCategory.name,
          slug: newCategory.name.toLowerCase().replace(/\s+/g, '-'),
          description: newCategory.description || '',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        return [...old, optimisticCategory]
      })
      
      return { previousCategories }
    },
    onError: (error, newCategory, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousCategories) {
        utils.categories.getAll.setData(undefined, context.previousCategories)
      }
      
      console.error('Category creation error:', error)
      
      // Handle specific tRPC error codes
      if (error.data?.code === 'CONFLICT') {
        toast.error('A category with this name already exists. Please choose a different name.')
      } else if (error.data?.code === 'BAD_REQUEST') {
        toast.error('Please check your input and try again.')
      } else {
        toast.error('Failed to create category. Please try again.')
      }
      
      // Reset submitting state on error
      setIsSubmitting(false)
    },
    onSuccess: () => {
      toast.success('Category created successfully!')
      // Invalidate and refetch categories to show the new category immediately
      utils.categories.getAll.invalidate()
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
    createCategoryMutation.mutate({
      name: formData.name,
      description: formData.description || undefined,
    })
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
              <h1 className="text-2xl font-bold text-gray-900">New Category</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Category Information</CardTitle>
              <CardDescription>
                Create a new category for organizing your blog posts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter category name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Brief description of this category"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" asChild>
              <Link href="/dashboard">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Creating...' : 'Create Category'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
