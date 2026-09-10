import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

function getSql() {
  const databaseUrl =
    process.env.NEON_NEON_DATABASE_URL || process.env.NEON_POSTGRES_URL || process.env.NEON_DATABASE_URL
  if (!databaseUrl) {
    throw new Error("Database connection string not found")
  }
  return neon(databaseUrl)
}

export async function GET() {
  try {
    const sql = getSql()
    const result = await sql`
      SELECT * FROM delivery_methods ORDER BY is_default DESC, id ASC
    `
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("[v0] Error fetching delivery methods:", error)
    return NextResponse.json({ error: "Error al obtener formas de entrega" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const sql = getSql()
    const { name, deliveryCost = 0, isDefault = false } = await request.json()

    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "El nombre es requerido" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO delivery_methods (name, is_active, is_default, delivery_cost)
      VALUES (${name.trim()}, TRUE, ${isDefault}, ${deliveryCost})
      RETURNING *
    `

    return NextResponse.json({ success: true, data: result[0] })
  } catch (error) {
    console.error("[v0] Error creating delivery method:", error)
    return NextResponse.json({ error: "Error al crear forma de entrega" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const sql = getSql()
    const { id, name, is_active, is_default, delivery_cost } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "ID es requerido" }, { status: 400 })
    }

    const result = await sql`
      UPDATE delivery_methods
      SET name = ${name}, is_active = ${is_active}, is_default = ${is_default}, delivery_cost = ${delivery_cost}
      WHERE id = ${id}
      RETURNING *
    `

    return NextResponse.json({ success: true, data: result[0] })
  } catch (error) {
    console.error("[v0] Error updating delivery method:", error)
    return NextResponse.json({ error: "Error al actualizar forma de entrega" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const sql = getSql()
    const { id } = await request.json()

    await sql`DELETE FROM delivery_methods WHERE id = ${id}`

    return NextResponse.json({ success: true, message: "Forma de entrega eliminada exitosamente" })
  } catch (error) {
    console.error("[v0] Error deleting delivery method:", error)
    return NextResponse.json({ error: "Error al eliminar forma de entrega" }, { status: 500 })
  }
}
