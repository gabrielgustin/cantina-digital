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
      SELECT * FROM payment_methods ORDER BY id ASC
    `
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("[v0] Error fetching payment methods:", error)
    return NextResponse.json({ error: "Error al obtener métodos de pago" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const sql = getSql()
    const { name } = await request.json()

    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "El nombre es requerido" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO payment_methods (name, is_active)
      VALUES (${name.trim()}, TRUE)
      RETURNING *
    `

    return NextResponse.json({ success: true, data: result[0] })
  } catch (error) {
    console.error("[v0] Error creating payment method:", error)
    return NextResponse.json({ error: "Error al crear método de pago" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const sql = getSql()
    const { id, name, is_active } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "ID es requerido" }, { status: 400 })
    }

    const result = await sql`
      UPDATE payment_methods
      SET name = ${name}, is_active = ${is_active}
      WHERE id = ${id}
      RETURNING *
    `

    return NextResponse.json({ success: true, data: result[0] })
  } catch (error) {
    console.error("[v0] Error updating payment method:", error)
    return NextResponse.json({ error: "Error al actualizar método de pago" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const sql = getSql()
    const { id, name } = await request.json()

    // Prevent deletion of "Transferencia"
    if (name === "Transferencia") {
      return NextResponse.json({ error: "No se puede eliminar el método Transferencia" }, { status: 400 })
    }

    await sql`DELETE FROM payment_methods WHERE id = ${id}`

    return NextResponse.json({ success: true, message: "Método eliminado exitosamente" })
  } catch (error) {
    console.error("[v0] Error deleting payment method:", error)
    return NextResponse.json({ error: "Error al eliminar método de pago" }, { status: 500 })
  }
}
