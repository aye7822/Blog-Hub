const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function runMigration() {
  try {
    await client.connect();
    console.log('Connected to database');
    
    // Add imageUrl column to posts table
    await client.query('ALTER TABLE "posts" ADD COLUMN "image_url" text;');
    console.log('Migration completed successfully! Added image_url column to posts table.');
    
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('Column image_url already exists. Migration skipped.');
    } else {
      console.error('Migration failed:', error.message);
    }
  } finally {
    await client.end();
  }
}

runMigration();

