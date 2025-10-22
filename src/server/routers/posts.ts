import { z } from 'zod'
import { router, publicProcedure } from '@/lib/trpc'
import { db } from '@/lib/db'
import { posts, postCategories, categories } from '@/lib/db/schema'
import { eq, desc, and, or, like, inArray } from 'drizzle-orm'
import { TRPCError } from '@trpc/server'

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Schema for creating a post
const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  slug: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().optional(),
  published: z.boolean().default(false),
  categoryIds: z.array(z.string()).optional(),
  imageUrl: z.string().optional(),
})

// Schema for updating a post
const updatePostSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required').max(255).optional(),
  slug: z.string().optional(),
  content: z.string().min(1, 'Content is required').optional(),
  excerpt: z.string().optional(),
  published: z.boolean().optional(),
  categoryIds: z.array(z.string()).optional(),
  imageUrl: z.string().optional(),
})

// Schema for post filters
const postFiltersSchema = z.object({
  categoryId: z.string().optional(),
  published: z.boolean().optional(),
  search: z.string().optional(),
  limit: z.number().min(1).max(100).default(10),
  offset: z.number().min(0).default(0),
})

export const postsRouter = router({
  // Get all posts with optional filtering
  getAll: publicProcedure
    .input(postFiltersSchema)
    .query(async ({ input }) => {
      const { categoryId, published, search, limit, offset } = input

      let whereConditions = []
      if (published !== undefined) {
        whereConditions.push(eq(posts.published, published))
      }

      if (search) {
        whereConditions.push(
          or(
            like(posts.title, `%${search}%`),
            like(posts.content, `%${search}%`),
            like(posts.excerpt, `%${search}%`)
          )
        )
      }

      // If category filter is applied, add it to the where conditions
      if (categoryId) {
        const postIdsWithCategory = await db
          .select({ postId: postCategories.postId })
          .from(postCategories)
          .where(eq(postCategories.categoryId, categoryId))

        const postIds = postIdsWithCategory.map(pc => pc.postId)
        if (postIds.length > 0) {
          whereConditions.push(inArray(posts.id, postIds))
        } else {
          // If no posts have this category, return empty array
          return []
        }
      }

      const postsList = await db
        .select({
          id: posts.id,
          title: posts.title,
          slug: posts.slug,
          content: posts.content,
          excerpt: posts.excerpt,
          published: posts.published,
          authorId: posts.authorId,
          imageUrl: posts.imageUrl,
          createdAt: posts.createdAt,
          updatedAt: posts.updatedAt,
          categories: categories,
        })
        .from(posts)
        .leftJoin(postCategories, eq(posts.id, postCategories.postId))
        .leftJoin(categories, eq(postCategories.categoryId, categories.id))
        .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
        .orderBy(desc(posts.createdAt))
        .limit(limit)
        .offset(offset)

      // Group posts with their categories
      const postsMap = new Map()
      postsList.forEach((post) => {
        if (!postsMap.has(post.id)) {
          postsMap.set(post.id, {
            ...post,
            categories: [],
          })
        }
        if (post.categories) {
          postsMap.get(post.id).categories.push({
            id: post.categories.id,
            name: post.categories.name,
            slug: post.categories.slug,
          })
        }
      })

      return Array.from(postsMap.values())
    }),

  // Get a single post by slug
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const post = await db
        .select({
          id: posts.id,
          title: posts.title,
          slug: posts.slug,
          content: posts.content,
          excerpt: posts.excerpt,
          published: posts.published,
          authorId: posts.authorId,
          imageUrl: posts.imageUrl,
          createdAt: posts.createdAt,
          updatedAt: posts.updatedAt,
          categories: categories,
        })
        .from(posts)
        .leftJoin(postCategories, eq(posts.id, postCategories.postId))
        .leftJoin(categories, eq(postCategories.categoryId, categories.id))
        .where(eq(posts.slug, input.slug))
        .limit(1)

      if (post.length === 0) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post not found',
        })
      }

      // Group categories for the post
      const postData = post[0]
      const categoriesList = post
        .filter((p) => p.categories)
        .map((p) => ({
          id: p.categories!.id,
          name: p.categories!.name,
          slug: p.categories!.slug,
        }))

      return {
        ...postData,
        categories: categoriesList,
      }
    }),

  // Create a new post
  create: publicProcedure
    .input(createPostSchema)
    .mutation(async ({ input }) => {
      const { title, slug: providedSlug, content, excerpt, published, categoryIds, imageUrl } = input
      const slug = providedSlug || generateSlug(title)
      const authorId = 'default-author' // For now, using a default author

      // Check if slug already exists
      const existingPost = await db
        .select()
        .from(posts)
        .where(eq(posts.slug, slug))
        .limit(1)

      if (existingPost.length > 0) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'A post with this slug already exists',
        })
      }

      // Create the post
      const newPost = await db
        .insert(posts)
        .values({
          title,
          slug,
          content,
          excerpt,
          published,
          authorId,
          imageUrl,
        })
        .returning()

      const postId = newPost[0].id

      // Add categories if provided
      if (categoryIds && categoryIds.length > 0) {
        const postCategoryData = categoryIds.map((categoryId) => ({
          postId,
          categoryId,
        }))

        await db.insert(postCategories).values(postCategoryData)
      }

      return { id: postId, slug }
    }),

  // Update a post
  update: publicProcedure
    .input(updatePostSchema)
    .mutation(async ({ input }) => {
      const { id, title, slug: providedSlug, content, excerpt, published, categoryIds } = input

      // Check if post exists
      const existingPost = await db
        .select()
        .from(posts)
        .where(eq(posts.id, id))
        .limit(1)

      if (existingPost.length === 0) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post not found',
        })
      }

      // Determine the slug to use
      let slug = existingPost[0].slug
      if (providedSlug) {
        slug = providedSlug
      } else if (title && title !== existingPost[0].title) {
        slug = generateSlug(title)
      }

      // Check for slug conflicts
      if (slug !== existingPost[0].slug) {
        const conflictingPost = await db
          .select()
          .from(posts)
          .where(eq(posts.slug, slug))
          .limit(1)

        if (conflictingPost.length > 0) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'A post with this slug already exists',
          })
        }
      }

      const updateData: Partial<{
        title: string
        slug: string
        content: string
        excerpt: string | null
        published: boolean
        updatedAt: Date
      }> = {}
      if (title) updateData.title = title
      if (providedSlug || (title && title !== existingPost[0].title)) {
        updateData.slug = slug
      }
      if (content) updateData.content = content
      if (excerpt !== undefined) updateData.excerpt = excerpt
      if (published !== undefined) updateData.published = published
      updateData.updatedAt = new Date()

      // Update the post
      await db
        .update(posts)
        .set(updateData)
        .where(eq(posts.id, id))

      // Update categories if provided
      if (categoryIds !== undefined) {
        // Remove existing categories
        await db
          .delete(postCategories)
          .where(eq(postCategories.postId, id))

        // Add new categories
        if (categoryIds.length > 0) {
          const postCategoryData = categoryIds.map((categoryId) => ({
            postId: id,
            categoryId,
          }))

          await db.insert(postCategories).values(postCategoryData)
        }
      }

      return { id }
    }),

  // Delete a post
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      // Check if post exists
      const existingPost = await db
        .select()
        .from(posts)
        .where(eq(posts.id, input.id))
        .limit(1)

      if (existingPost.length === 0) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post not found',
        })
      }

      await db.delete(posts).where(eq(posts.id, input.id))
      return { id: input.id }
    }),
})
