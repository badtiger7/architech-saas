import type { Config } from 'drizzle-kit'

export default {
  schema: './lib/db/schema/*',
  out: './lib/db/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
} satisfies Config 