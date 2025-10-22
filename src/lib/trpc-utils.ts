import { TRPCError } from '@trpc/server'

// Custom error types
export class ValidationError extends TRPCError {
  constructor(message: string, field?: string) {
    super({
      code: 'BAD_REQUEST',
      message: field ? `${field}: ${message}` : message,
    })
  }
}

export class NotFoundError extends TRPCError {
  constructor(resource: string, id: string) {
    super({
      code: 'NOT_FOUND',
      message: `${resource} with id ${id} not found`,
    })
  }
}

export class ConflictError extends TRPCError {
  constructor(message: string) {
    super({
      code: 'CONFLICT',
      message,
    })
  }
}

export class UnauthorizedError extends TRPCError {
  constructor(message = 'Unauthorized') {
    super({
      code: 'UNAUTHORIZED',
      message,
    })
  }
}

export class ForbiddenError extends TRPCError {
  constructor(message = 'Forbidden') {
    super({
      code: 'FORBIDDEN',
      message,
    })
  }
}

// Error handling utilities
export function handleDatabaseError(error: unknown): never {
  console.error('Database error:', error)
  
  if (error instanceof Error) {
    // Handle specific database errors
    if (error.message.includes('duplicate key')) {
      throw new ConflictError('Resource already exists')
    }
    
    if (error.message.includes('foreign key')) {
      throw new ValidationError('Invalid reference to related resource')
    }
    
    if (error.message.includes('not found')) {
      throw new NotFoundError('Resource', 'unknown')
    }
  }
  
  throw new TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred',
  })
}

// Validation utilities
export function validateSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  return slugRegex.test(slug)
}

export function generateUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
  let slug = baseSlug
  let counter = 1
  
  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`
    counter++
  }
  
  return slug
}

// Database query utilities
export function buildWhereConditions(filters: Record<string, unknown>) {
  const conditions: Record<string, unknown>[] = []
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (typeof value === 'string' && value.trim() !== '') {
        conditions.push({ [key]: { contains: value, mode: 'insensitive' } })
      } else if (typeof value === 'boolean') {
        conditions.push({ [key]: value })
      } else if (Array.isArray(value) && value.length > 0) {
        conditions.push({ [key]: { in: value } })
      }
    }
  })
  
  return conditions
}

// Pagination utilities
export function calculatePagination(page: number, limit: number, total: number) {
  const totalPages = Math.ceil(total / limit)
  const offset = (page - 1) * limit
  
  return {
    page,
    limit,
    offset,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  }
}

// Response formatting utilities
export function formatSuccessResponse<T>(data: T, message?: string) {
  return {
    data,
    success: true,
    message,
  }
}

export function formatErrorResponse(message: string, code?: string) {
  return {
    success: false,
    message,
    code,
  }
}
