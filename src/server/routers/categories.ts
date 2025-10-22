import { z } from 'zod'
import { router, publicProcedure } from '@/lib/trpc'
import { db } from '@/lib/db'
import { categories } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { TRPCError } from '@trpc/server'

// Helper function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Schema for creating a category
const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().optional(),
})

// Schema for updating a category
const updateCategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required').max(100).optional(),
  description: z.string().optional(),
})

export const categoriesRouter = router({
  // Get all categories
  getAll: publicProcedure.query(async () => {
    const categoriesList = await db
      .select()
      .from(categories)
      .orderBy(desc(categories.createdAt))

    return categoriesList
  }),

  // Get a single category by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const category = await db
        .select()
        .from(categories)
        .where(eq(categories.id, input.id))
        .limit(1)

      if (category.length === 0) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Category not found',
        })
      }

      return category[0]
    }),

  // Get a single category by slug
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const category = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, input.slug))
        .limit(1)

      if (category.length === 0) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Category not found',
        })
      }

      return category[0]
    }),

  // Create a new category
  create: publicProcedure
    .input(createCategorySchema)
    .mutation(async ({ input }) => {
      const { name, description } = input
      const slug = generateSlug(name)

      // Check if slug already exists
      const existingCategory = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, slug))
        .limit(1)

      if (existingCategory.length > 0) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'A category with this name already exists',
        })
      }

      const newCategory = await db
        .insert(categories)
        .values({
          name,
          slug,
          description,
        })
        .returning()

      return newCategory[0]
    }),

  // Update a category
  update: publicProcedure
    .input(updateCategorySchema)
    .mutation(async ({ input }) => {
      const { id, name, description } = input

      // Check if category exists
      const existingCategory = await db
        .select()
        .from(categories)
        .where(eq(categories.id, id))
        .limit(1)

      if (existingCategory.length === 0) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Category not found',
        })
      }

      // If name is being updated, check for conflicts
      if (name && name !== existingCategory[0].name) {
        const slug = generateSlug(name)
        const conflictingCategory = await db
          .select()
          .from(categories)
          .where(eq(categories.slug, slug))
          .limit(1)

        if (conflictingCategory.length > 0) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'A category with this name already exists',
          })
        }
      }

      const updateData: Partial<{
        name: string
        slug: string
        description: string | null
        updatedAt: Date
      }> = {}
      if (name) {
        updateData.name = name
        updateData.slug = generateSlug(name)
      }
      if (description !== undefined) updateData.description = description
      updateData.updatedAt = new Date()

      const updatedCategory = await db
        .update(categories)
        .set(updateData)
        .where(eq(categories.id, id))
        .returning()

      return updatedCategory[0]
    }),

  // Delete a category
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      // Check if category exists
      const existingCategory = await db
        .select()
        .from(categories)
        .where(eq(categories.id, input.id))
        .limit(1)

      if (existingCategory.length === 0) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Category not found',
        })
      }

      await db.delete(categories).where(eq(categories.id, input.id))
      return { id: input.id }
    }),
})
