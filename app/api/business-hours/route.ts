import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getBusinessHours } from "@/lib/db"

function getSql() {
  const databaseUrl =
    process.env.NEON_NEON_DATABASE_URL || process.env.NEON_POSTGRES_URL || process.env.NEON_DATABASE_URL
  if (!databaseUrl) {
    throw new Error("Database connection string not found")
  }
  return neon(databaseUrl)
}

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    console.log('[v0] API: Fetching business hours...')
    const hours = await getBusinessHours()
    console.log('[v0] API: Business hours fetched:', JSON.stringify(hours, null, 2))
    console.log('[v0] API: Number of records:', hours?.length)
    return NextResponse.json(hours)
  } catch (error) {
    console.error("[v0] Error in business-hours API:", error)
    return NextResponse.json({ error: "Failed to fetch business hours" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const sql = getSql()
    const data = await request.json()

    // Check if record exists
    const existing = await sql`SELECT id FROM business_hours LIMIT 1`

    if (existing.length > 0) {
      // Update existing record
      await sql`
        UPDATE business_hours SET
          monday = ${data.monday},
          tuesday = ${data.tuesday},
          wednesday = ${data.wednesday},
          thursday = ${data.thursday},
          friday = ${data.friday},
          saturday = ${data.saturday},
          sunday = ${data.sunday},
          main_start_time = ${data.main_start_time},
          main_end_time = ${data.main_end_time},
          additional_start_time = ${data.additional_start_time},
          additional_end_time = ${data.additional_end_time},
          allow_orders_when_closed = ${data.allow_orders_when_closed},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${existing[0].id}
      `
    } else {
      // Insert new record
      await sql`
        INSERT INTO business_hours (
          monday, tuesday, wednesday, thursday, friday, saturday, sunday,
          main_start_time, main_end_time, additional_start_time, additional_end_time,
          allow_orders_when_closed
        ) VALUES (
          ${data.monday}, ${data.tuesday}, ${data.wednesday}, ${data.thursday},
          ${data.friday}, ${data.saturday}, ${data.sunday},
          ${data.main_start_time}, ${data.main_end_time},
          ${data.additional_start_time}, ${data.additional_end_time},
          ${data.allow_orders_when_closed}
        )
      `
    }

    return NextResponse.json({ success: true, message: "Horarios guardados exitosamente" })
  } catch (error) {
    console.error("[v0] Error saving business hours:", error)
    return NextResponse.json({ error: "Error al guardar horarios" }, { status: 500 })
  }
}
