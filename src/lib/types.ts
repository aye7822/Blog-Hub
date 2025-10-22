export interface Category {
  id: string
  name: string
  slug: string
  description?: string | null
  createdAt: string
  updatedAt: string
}

export interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string | null
  published: boolean
  authorId: string
  imageUrl?: string | null
  createdAt: string
  updatedAt: string
  categories: Category[]
}

// Form types
export interface CreatePostData {
  title: string
  content: string
  excerpt?: string
  published: boolean
  categoryIds?: string[]
  imageUrl?: string
}

export interface UpdatePostData {
  id: string
  title?: string
  content?: string
  excerpt?: string
  published?: boolean
  categoryIds?: string[]
  imageUrl?: string
}

export interface CreateCategoryData {
  name: string
  description?: string
}

export interface UpdateCategoryData {
  id: string
  name?: string
  description?: string
}

// Filter types
export interface PostFilters {
  categoryId?: string
  published?: boolean
  search?: string
  limit?: number
  offset?: number
}

// API response types
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Component prop types
export interface LoadingState {
  isLoading: boolean
  error?: Error | null
}

export interface FormState {
  isSubmitting: boolean
  errors: Record<string, string>
}

// Toast types
export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  description?: string
  duration?: number
}

// File upload types
export interface FileUploadResult {
  url: string
  filename: string
  size: number
  type: string
}

export interface FileUploadError {
  message: string
  code: string
}
