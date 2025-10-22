import { z } from 'zod'

// Post validation schemas
export const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().max(500, 'Excerpt must be less than 500 characters').optional(),
  published: z.boolean().default(false),
  categoryId: z.string().uuid('Invalid category ID').optional(),
  imageUrl: z.string().url('Invalid image URL').optional(),
})

export const updatePostSchema = createPostSchema.partial()

// Category validation schemas
export const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Color must be a valid hex color').optional(),
})

export const updateCategorySchema = createCategorySchema.partial()

// Search and filter schemas
export const searchPostsSchema = z.object({
  query: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  published: z.boolean().optional(),
  limit: z.number().min(1).max(100).default(10),
  offset: z.number().min(0).default(0),
})

// Form validation schemas
export const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

// Generic validation types
export type ValidationSchema<T> = z.ZodSchema<T>
export type ValidationError = z.ZodError
export type ValidationResult<T> = z.SafeParseReturnType<T, T>

// Validation helper functions
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): ValidationResult<T> {
  return schema.safeParse(data)
}

export function getValidationErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {}
  error.errors.forEach((err) => {
    const path = err.path.join('.')
    errors[path] = err.message
  })
  return errors
}
