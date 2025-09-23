import { sql } from 'drizzle-orm'
import { db, client } from './connection'

async function main() {
  console.log('🗑️  Resetting database...')
  
  try {
    // Drop all tables (be careful with this in production!)
    await db.execute(sql`DROP SCHEMA public CASCADE`)
    await db.execute(sql`CREATE SCHEMA public`)
    
    console.log('✅ Database reset completed!')
    console.log('📝 Run "npm run db:migrate" to recreate the schema')
  } catch (error) {
    console.error('❌ Database reset failed:', error)
    process.exit(1)
  } finally {
    await client.end()
  }
}

main() 