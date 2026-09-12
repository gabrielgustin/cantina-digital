import { NextResponse } from "next/server"
import { sql } from "@/lib/backoffice-db"
import { requireBackofficeSession } from "@/lib/backoffice-auth"

export async function GET() {
  try {
    if (!(await requireBackofficeSession())) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    console.log("[v0] Fetching site config from database...")

    const result = await sql`
      SELECT config_key, config_value, description
      FROM site_config
    `

    console.log("[v0] Site config fetched:", result.length, "entries")

    // Convert array of key-value pairs to object
    const config: Record<string, string> = {}
    result.forEach((row: any) => {
      config[row.config_key] = row.config_value
    })

    return NextResponse.json(config)
  } catch (error) {
    console.error("[v0] Error fetching site config:", error)
    return NextResponse.json({ error: "Failed to fetch site config" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    if (!(await requireBackofficeSession())) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { key, value, description } = body

    console.log("[v0] Updating site config:", key, "=", value)

    // Check if key exists
    const existing = await sql`
      SELECT id FROM site_config WHERE config_key = ${key}
    `

    if (existing.length > 0) {
      // Update existing
      await sql`
        UPDATE site_config
        SET config_value = ${value}, updated_at = NOW()
        WHERE config_key = ${key}
      `
    } else {
      // Insert new
      await sql`
        INSERT INTO site_config (config_key, config_value, description, updated_at)
        VALUES (${key}, ${value}, ${description || ""}, NOW())
      `
    }

    console.log("[v0] Site config updated successfully")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error updating site config:", error)
    return NextResponse.json({ error: "Failed to update site config" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    if (!(await requireBackofficeSession())) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    console.log("[v0] Saving multiple site config values:", Object.keys(body))

    for (const [key, value] of Object.entries(body)) {
      try {
        console.log(`[v0] Processing config: ${key} = ${value}`)

        const stringValue = typeof value === "string" ? value : String(value)
        const description = `Configuración de ${key}`

        // Check if key exists
        const existing = await sql`
          SELECT id FROM site_config WHERE config_key = ${key}
        `

        if (existing.length > 0) {
          // Update existing
          console.log(`[v0] Updating existing config: ${key}`)
          await sql`
            UPDATE site_config
            SET config_value = ${stringValue}, updated_at = NOW()
            WHERE config_key = ${key}
          `
        } else {
          // Insert new
          console.log(`[v0] Inserting new config: ${key}`)
          await sql`
            INSERT INTO site_config (config_key, config_value, description, updated_at)
            VALUES (${key}, ${stringValue}, ${description}, NOW())
          `
        }

        console.log(`[v0] Successfully saved config: ${key}`)
      } catch (configError) {
        console.error(`[v0] Error saving config ${key}:`, configError)
        throw configError
      }
    }

    console.log("[v0] All site config values saved successfully")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error saving site config:", error)
    return NextResponse.json(
      {
        error: "Failed to save site config",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
