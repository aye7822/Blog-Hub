'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react'
import { Button } from '@/components/button'
import { Card, CardContent } from '@/components/ui/card'

interface ImageUploadProps {
  onImageUpload: (url: string) => void
  maxSize?: number // in MB
  acceptedTypes?: string[]
  className?: string
}

export function ImageUpload({ 
  onImageUpload, 
  maxSize = 5, 
  acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  className = ''
}: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (file: File) => {
    // Validate file type
    if (!acceptedTypes.includes(file.type)) {
      setUploadError(`Invalid file type. Accepted types: ${acceptedTypes.join(', ')}`)
      return
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setUploadError(`File size must be less than ${maxSize}MB`)
      return
    }

    setIsUploading(true)
    setUploadError(null)

    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      onImageUpload(data.url)
    } catch (error) {
      console.error('Upload error:', error)
      setUploadError('Failed to upload image. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={className}>
      <Card 
        className={`border-2 border-dashed transition-colors ${
          isDragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className={`p-4 rounded-full ${isDragOver ? 'bg-blue-100' : 'bg-gray-100'}`}>
              {isUploading ? (
                <div className="h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload className="h-8 w-8 text-gray-600" />
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {isUploading ? 'Uploading...' : 'Upload Image'}
              </h3>
              <p className="text-gray-600 mb-4">
                Drag and drop an image here, or click to select
              </p>
              <p className="text-sm text-gray-500">
                Supports: JPEG, PNG, GIF, WebP (max {maxSize}MB)
              </p>
            </div>

            <Button
              onClick={triggerFileSelect}
              disabled={isUploading}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ImageIcon className="h-4 w-4" />
              Choose File
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              accept={acceptedTypes.join(',')}
              onChange={handleFileSelect}
              className="hidden"
            />

            {uploadError && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{uploadError}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setUploadError(null)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Standalone image upload component for post creation forms
interface PostImageUploadProps {
  onImageSelect: (url: string) => void
  currentImageUrl?: string
  className?: string
}

export function PostImageUpload({ onImageSelect, currentImageUrl, className = '' }: PostImageUploadProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(currentImageUrl || null)

  const handleImageSelect = (url: string) => {
    setSelectedImage(url)
    onImageSelect(url)
  }

  const removeImage = () => {
    setSelectedImage(null)
    onImageSelect('')
  }

  return (
    <div className={className}>
      {selectedImage ? (
        <div className="relative">
          <img
            src={selectedImage}
            alt="Post image"
            className="w-full h-48 object-cover rounded-lg shadow-sm"
          />
          <Button
            variant="destructive"
            size="sm"
            onClick={removeImage}
            className="absolute top-2 right-2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <ImageUpload onImageUpload={handleImageSelect} />
      )}
    </div>
  )
}
