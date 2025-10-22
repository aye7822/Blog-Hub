import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'
import postgres from 'postgres'
import { config } from 'dotenv'
import { categories, posts, postCategories } from './schema'

// Load environment variables
config()

const connectionString = process.env.DATABASE_URL!

// Create the connection
const client = postgres(connectionString, { prepare: false })
const db = drizzle(client)

async function viewData() {
  try {
    console.log('📊 Current Database Contents:\n')

    // Get all categories with post counts
    console.log('📂 Categories:')
    const allCategories = await db.select().from(categories)
    for (const category of allCategories) {
      const postCount = await db.select().from(postCategories).where(eq(postCategories.categoryId, category.id))
      console.log(`  • ${category.name} (${category.slug}) - ${postCount.length} posts`)
    }

    console.log('\n📝 Blog Posts:')
    const allPosts = await db.select().from(posts).orderBy(posts.createdAt)
    for (const post of allPosts) {
      const postCats = await db
        .select({ name: categories.name, slug: categories.slug })
        .from(postCategories)
        .innerJoin(categories, eq(postCategories.categoryId, categories.id))
        .where(eq(postCategories.postId, post.id))

      console.log(`  • "${post.title}" (${post.slug})`)
      console.log(`    Status: ${post.published ? 'Published' : 'Draft'}`)
      console.log(`    Author: ${post.authorId}`)
      console.log(`    Categories: ${postCats.map(cat => cat.name).join(', ') || 'None'}`)
      console.log(`    Created: ${post.createdAt.toISOString().split('T')[0]}`)
      console.log('')
    }

    console.log(`\n📈 Summary:`)
    console.log(`   Total Categories: ${allCategories.length}`)
    console.log(`   Total Posts: ${allPosts.length}`)
    console.log(`   Published Posts: ${allPosts.filter(p => p.published).length}`)
    console.log(`   Draft Posts: ${allPosts.filter(p => !p.published).length}`)

  } catch (error) {
    console.error('❌ Error viewing database data:', error)
  } finally {
    await client.end()
  }
}

viewData()
