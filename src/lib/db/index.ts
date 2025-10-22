import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { config } from 'dotenv'

// Load environment variables
config()

const connectionString = process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/blogging_platform'

// Create the connection
const client = postgres(connectionString, { prepare: false })
export const db = drizzle(client)
