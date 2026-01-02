import type { Config } from 'drizzle-kit'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const databaseUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/architech_db'

if (!process.env.DATABASE_URL) {
  console.warn('⚠️  DATABASE_URL not found in .env.local, using default')
}

console.log('🔌 Database URL:', databaseUrl.replace(/:[^:@]+@/, ':****@')) // Hide password

export default {
  schema: './lib/db/schema/*',
  out: './lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl,
  },
  verbose: true,
  strict: true,
} satisfies Config 