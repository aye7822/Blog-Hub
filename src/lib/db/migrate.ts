import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'
import { config } from 'dotenv'

// Load environment variables
config()

const connectionString = process.env.DATABASE_URL!

// Create the connection
const client = postgres(connectionString, { prepare: false })
const db = drizzle(client)

// Run migrations
async function runMigrations() {
  try {
    console.log('Running migrations...')
    await migrate(db, { migrationsFolder: './src/lib/db/migrations' })
    console.log('Migrations completed successfully!')
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  } finally {
    await client.end()
  }
}

runMigrations()
