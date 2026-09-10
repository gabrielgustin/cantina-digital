import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.NEON_NEON_NEON_DATABASE_URL!)

export async function GET() {
  try {
    console.log("[v0] Fetching delivery methods from database")

    const methods = await sql`
      SELECT * FROM delivery_methods 
      ORDER BY is_required DESC, id
    `

    console.log("[v0] Delivery methods fetched:", methods.length, "records")

    return NextResponse.json({ success: true, data: methods })
  } catch (error) {
    console.error("[v0] Error fetching delivery methods:", error)
    return NextResponse.json({ error: "Error al obtener formas de entrega" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("[v0] Creating delivery method:", body)

    const { name, is_active } = body

    const result = await sql`
      INSERT INTO delivery_methods (name, is_active)
      VALUES (${name}, ${is_active !== undefined ? is_active : true})
      RETURNING *
    `

    console.log("[v0] Delivery method created successfully")

    return NextResponse.json({ success: true, data: result[0] })
  } catch (error) {
    console.error("[v0] Error creating delivery method:", error)
    return NextResponse.json({ error: "Error al crear forma de entrega" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    console.log("[v0] Updating delivery method:", body)

    const { id, name, is_active } = body

    const existingMethod = await sql`
      SELECT is_required FROM delivery_methods WHERE id = ${id}
    `

    if (existingMethod[0]?.is_required) {
      // Only allow changing is_active for required methods
      await sql`
        UPDATE delivery_methods 
        SET is_active = ${is_active}
        WHERE id = ${id}
      `
    } else {
      await sql`
        UPDATE delivery_methods 
        SET name = ${name}, 
            is_active = ${is_active}
        WHERE id = ${id}
      `
    }

    console.log("[v0] Delivery method updated successfully")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error updating delivery method:", error)
    return NextResponse.json({ error: "Error al actualizar forma de entrega" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 })
    }

    console.log("[v0] Deleting delivery method:", id)

    const method = await sql`
      SELECT is_required FROM delivery_methods WHERE id = ${id}
    `

    if (method[0]?.is_required) {
      return NextResponse.json({ error: "No se puede eliminar una forma de entrega obligatoria" }, { status: 400 })
    }

    await sql`
      DELETE FROM delivery_methods 
      WHERE id = ${id}
    `

    console.log("[v0] Delivery method deleted successfully")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting delivery method:", error)
    return NextResponse.json({ error: "Error al eliminar forma de entrega" }, { status: 500 })
  }
}
