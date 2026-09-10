import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.NEON_NEON_NEON_DATABASE_URL!)

export async function GET() {
  try {
    console.log("[v0] Fetching payment methods from database")

    const methods = await sql`
      SELECT * FROM payment_methods 
      ORDER BY id
    `

    console.log("[v0] Payment methods fetched:", methods.length, "records")

    return NextResponse.json({ success: true, data: methods })
  } catch (error) {
    console.error("[v0] Error fetching payment methods:", error)
    return NextResponse.json({ error: "Error al obtener métodos de pago" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("[v0] Creating payment method:", body)

    const { name, is_active } = body

    const result = await sql`
      INSERT INTO payment_methods (name, is_active)
      VALUES (${name}, ${is_active !== undefined ? is_active : true})
      RETURNING *
    `

    console.log("[v0] Payment method created successfully")

    return NextResponse.json({ success: true, data: result[0] })
  } catch (error) {
    console.error("[v0] Error creating payment method:", error)
    return NextResponse.json({ error: "Error al crear método de pago" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    console.log("[v0] Updating payment method:", body)

    const { id, name, is_active } = body

    await sql`
      UPDATE payment_methods 
      SET name = ${name}, 
          is_active = ${is_active}
      WHERE id = ${id}
    `

    console.log("[v0] Payment method updated successfully")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error updating payment method:", error)
    return NextResponse.json({ error: "Error al actualizar método de pago" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 })
    }

    console.log("[v0] Deleting payment method:", id)

    await sql`
      DELETE FROM payment_methods 
      WHERE id = ${id}
    `

    console.log("[v0] Payment method deleted successfully")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting payment method:", error)
    return NextResponse.json({ error: "Error al eliminar método de pago" }, { status: 500 })
  }
}
