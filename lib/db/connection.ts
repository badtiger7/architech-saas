import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  // Allow build to proceed, but runtime will fail - user must set DATABASE_URL in Vercel
  // This is a workaround for Next.js build-time analysis
  if (typeof window === 'undefined' && !process.env.VERCEL_ENV) {
    // Only throw in non-build contexts (runtime)
    // During build, we'll allow it to be undefined
  }
}

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = connectionString 
  ? postgres(connectionString, { prepare: false })
  : postgres('postgresql://placeholder:placeholder@localhost:5432/placeholder', { prepare: false })

export const db = drizzle(client, { schema })

export type Database = typeof db 