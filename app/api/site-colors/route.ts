import { NextResponse } from "next/server"
import { getSiteConfig } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    console.log("[v0] Fetching site colors from database")
    
    // Import inside the function to ensure it runs on server
    const { neon } = await import("@neondatabase/serverless")
    
    const databaseUrl = 
      process.env.NEON_NEON_DATABASE_URL || 
      process.env.NEON_POSTGRES_URL || 
      process.env.DATABASE_URL

    if (!databaseUrl) {
      console.error("[v0] Database connection string not found")
      return NextResponse.json(
        { error: "Database configuration error" },
        { status: 500 }
      )
    }

    const sql = neon(databaseUrl)
    
    const result = await sql`
      SELECT config_key, config_value
      FROM site_config
      WHERE config_key IN ('color_primario', 'color_secundario', 'color_acento', 'color_fondo', 'color_texto')
    `

    const colors: Record<string, string> = {}
    for (const row of result as any[]) {
      colors[row.config_key] = row.config_value
    }

    console.log("[v0] Site colors fetched:", colors)

    // Return colors with defaults if any are missing
    return NextResponse.json({
      color_primario: colors.color_primario || "#1e4b8e",
      color_secundario: colors.color_secundario || "#2c5aa0",
      color_acento: colors.color_acento || "#ff6b35",
      color_fondo: colors.color_fondo || "#f8f9fa",
      color_texto: colors.color_texto || "#212529",
    })
  } catch (error) {
    console.error("[v0] Error fetching site colors:", error)
    // Return default colors on error
    return NextResponse.json({
      color_primario: "#1e4b8e",
      color_secundario: "#2c5aa0",
      color_acento: "#ff6b35",
      color_fondo: "#f8f9fa",
      color_texto: "#212529",
    })
  }
}
