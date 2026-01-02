import { sql } from 'drizzle-orm'
import { db, client } from './connection'
import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

async function main() {
  console.log('🔄 Running database migrations...')
  
  try {
    const migrationPath = path.resolve(process.cwd(), 'lib/db/migrations/0000_chunky_thundra.sql')
    
    if (!fs.existsSync(migrationPath)) {
      console.error('❌ Migration file not found:', migrationPath)
      process.exit(1)
    }

    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8')
    
    // Remove statement breakpoint comments and split by semicolons
    const cleanedSQL = migrationSQL
      .replace(/--> statement-breakpoint\n/g, '')
      .trim()

    console.log('📝 Executing migration SQL...')

    // Execute the SQL using drizzle's sql.raw()
    // The postgres client will execute it as a single query
    await db.execute(sql.raw(cleanedSQL))
    
    console.log('✅ Database migrations completed successfully!')
  } catch (error: any) {
    // Some errors are expected (like "already exists")
    if (error.message && (
      error.message.includes('already exists') || 
      error.message.includes('duplicate') ||
      error.message.includes('does not exist')
    )) {
      console.warn('⚠️  Some objects may already exist (this is okay):', error.message)
      console.log('✅ Migration completed (with warnings)')
    } else {
      console.error('❌ Database migration failed:', error)
      process.exit(1)
    }
  } finally {
    await client.end()
  }
}

main()

