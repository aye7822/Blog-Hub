import { db } from '@/lib/db'
import { posts, postCategories, categories } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

// Create a server-side tRPC client for use in server components
export const api = {
  posts: {
    getBySlug: async ({ slug }: { slug: string }) => {
      const post = await db
        .select({
          id: posts.id,
          title: posts.title,
          slug: posts.slug,
          content: posts.content,
          excerpt: posts.excerpt,
          published: posts.published,
          authorId: posts.authorId,
          createdAt: posts.createdAt,
          updatedAt: posts.updatedAt,
          categories: categories,
        })
        .from(posts)
        .leftJoin(postCategories, eq(posts.id, postCategories.postId))
        .leftJoin(categories, eq(postCategories.categoryId, categories.id))
        .where(eq(posts.slug, slug))
        .limit(1)

      if (post.length === 0) {
        throw new Error('Post not found')
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
    }
  }
}
