// Enhanced tRPC type definitions for better type safety

// Basic types for our application
export interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string | null
  published: boolean
  authorId: string
  imageUrl?: string | null
  createdAt: Date
  updatedAt: Date
  categories: Category[]
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string | null
  createdAt: Date
  updatedAt: Date
}

// Input types for mutations
export type CreatePostInput = {
  title: string
  content: string
  excerpt?: string
  published: boolean
  categoryIds?: string[]
  imageUrl?: string
}

export type UpdatePostInput = {
  id: string
  title?: string
  content?: string
  excerpt?: string
  published?: boolean
  categoryIds?: string[]
  imageUrl?: string
}

export type CreateCategoryInput = {
  name: string
  description?: string
}

export type UpdateCategoryInput = {
  id: string
  name?: string
  description?: string
}

// Query input types
export type PostFilters = {
  categoryId?: string
  published?: boolean
  search?: string
  limit?: number
  offset?: number
}

// API response types
export type ApiSuccessResponse<T> = {
  data: T
  success: true
  message?: string
}

export type ApiErrorResponse = {
  success: false
  message: string
  code?: string
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

// Pagination types
export type PaginationMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export type PaginatedResponse<T> = {
  data: T[]
  pagination: PaginationMeta
}

// Form state types
export type FormFieldState = {
  value: string
  error?: string
  touched: boolean
}

export type FormState<T extends Record<string, unknown>> = {
  [K in keyof T]: FormFieldState
} & {
  isSubmitting: boolean
  isValid: boolean
  errors: Record<string, string>
}

// Loading state types
export type LoadingState = {
  isLoading: boolean
  error?: Error | null
  data?: unknown
}

export type AsyncState<T> = {
  data: T | null
  isLoading: boolean
  error: Error | null
}

// Component prop types
export type BaseComponentProps = {
  className?: string
  children?: React.ReactNode
}

export type WithLoadingProps = BaseComponentProps & {
  loading?: boolean
}

export type WithErrorProps = BaseComponentProps & {
  error?: Error | null
  onRetry?: () => void
}

// Event handler types
export type ChangeHandler<T = string> = (value: T) => void
export type SubmitHandler<T = Record<string, unknown>> = (data: T) => void | Promise<void>
export type ClickHandler = (event: React.MouseEvent<HTMLElement>) => void

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>
export type NonNullable<T> = T extends null | undefined ? never : T

// File upload types
export type FileUploadState = {
  file: File | null
  uploading: boolean
  progress: number
  error?: string
  url?: string
}

export type FileUploadResult = {
  url: string
  filename: string
  size: number
  type: string
}

// Search and filter types
export type SearchFilters = {
  query: string
  category?: string
  tags?: string[]
  dateRange?: {
    start: Date
    end: Date
  }
  sortBy?: 'date' | 'title' | 'popularity'
  sortOrder?: 'asc' | 'desc'
}

// Theme and UI types
export type Theme = 'light' | 'dark' | 'system'
export type ToastType = 'success' | 'error' | 'warning' | 'info'

export type ToastConfig = {
  id: string
  type: ToastType
  title: string
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

// Validation types
export type ValidationRule<T> = {
  required?: boolean
  min?: number
  max?: number
  pattern?: RegExp
  custom?: (value: T) => string | null
}

export type ValidationSchema<T> = {
  [K in keyof T]?: ValidationRule<T[K]>
}

// Database types
export type DatabaseError = {
  code: string
  message: string
  details?: unknown
}

export type QueryResult<T> = {
  data: T[]
  count: number
  page: number
  limit: number
}
