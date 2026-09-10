import { neon } from "@neondatabase/serverless"

const databaseUrl =
  process.env.NEON_DATABASE_URL ||
  process.env.NEON_NEON_DATABASE_URL ||
  process.env.NEON_POSTGRES_URL ||
  process.env.DATABASE_URL

if (!databaseUrl) {
  console.error("[v0] Backoffice: database connection string not found in environment variables")
}

export const sql = neon(databaseUrl!)
