import { NextResponse } from "next/server"
import { sql } from "@/lib/backoffice-db"

export async function GET() {
  try {
    console.log("[v0] Fetching business hours from database")

    const hours = await sql`
      SELECT 
        id, day_of_week, is_open, 
        open_time, close_time,
        additional_open_time, additional_close_time,
        created_at, updated_at
      FROM business_hours 
      ORDER BY 
        CASE LOWER(day_of_week)
          WHEN 'monday' THEN 1
          WHEN 'lunes' THEN 1
          WHEN 'tuesday' THEN 2
          WHEN 'martes' THEN 2
          WHEN 'wednesday' THEN 3
          WHEN 'miercoles' THEN 3
          WHEN 'thursday' THEN 4
          WHEN 'jueves' THEN 4
          WHEN 'friday' THEN 5
          WHEN 'viernes' THEN 5
          WHEN 'saturday' THEN 6
          WHEN 'sabado' THEN 6
          WHEN 'sunday' THEN 7
          WHEN 'domingo' THEN 7
        END
    `

    // Also fetch the config
    const config = await sql`
      SELECT allow_orders_when_closed, id, created_at, updated_at
      FROM business_hours_config
      LIMIT 1
    `

    console.log("[v0] Business hours fetched:", hours.length, "days")
    console.log("[v0] Business hours config:", config)

    return NextResponse.json({
      success: true,
      data: {
        hours: hours,
        config: config[0] || { allow_orders_when_closed: false },
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching business hours:", error)
    return NextResponse.json({ error: "Error al obtener horarios" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("[v0] Creating/updating business hours:", body)

    const { hours, allow_orders_when_closed } = body

    await sql`DELETE FROM business_hours`
    console.log("[v0] Cleared existing business hours")

    for (const day of hours) {
      await sql`
        INSERT INTO business_hours (
          day_of_week, is_open, open_time, close_time,
          additional_open_time, additional_close_time
        )
        VALUES (
          ${day.day_of_week}, 
          ${day.is_open}, 
          ${day.open_time}, 
          ${day.close_time},
          ${day.additional_open_time || null}, 
          ${day.additional_close_time || null}
        )
      `

      console.log(
        `[v0] Inserted business hours for ${day.day_of_week}: is_open=${day.is_open}, times=${day.open_time ? "set" : "null"}`,
      )
    }

    console.log("[v0] Inserted", hours.length, "business hours")

    const existingConfig = await sql`
      SELECT id FROM business_hours_config LIMIT 1
    `

    if (existingConfig.length > 0) {
      await sql`
        UPDATE business_hours_config 
        SET 
          allow_orders_when_closed = ${allow_orders_when_closed},
          updated_at = NOW()
        WHERE id = ${existingConfig[0].id}
      `
    } else {
      await sql`
        INSERT INTO business_hours_config (allow_orders_when_closed)
        VALUES (${allow_orders_when_closed})
      `
    }

    console.log("[v0] Business hours updated successfully")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error saving business hours:", error)
    return NextResponse.json({ error: "Error al guardar horarios" }, { status: 500 })
  }
}
