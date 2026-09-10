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
      SELECT * FROM coupons ORDER BY created_at DESC
    `
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("[v0] Error fetching coupons:", error)
    return NextResponse.json({ error: "Error al obtener cupones" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const sql = getSql()
    const { code, discount_value, discount_type, start_date, end_date, is_active } = await request.json()

    // Validations
    if (!code || code.trim() === "") {
      return NextResponse.json({ error: "El código es requerido" }, { status: 400 })
    }

    if (!discount_value || discount_value <= 0) {
      return NextResponse.json({ error: "El valor de descuento debe ser mayor a 0" }, { status: 400 })
    }

    if (!discount_type || !["percentage", "fixed"].includes(discount_type)) {
      return NextResponse.json({ error: "Tipo de descuento inválido" }, { status: 400 })
    }

    if (new Date(end_date) < new Date(start_date)) {
      return NextResponse.json({ error: "La fecha de fin debe ser posterior a la fecha de inicio" }, { status: 400 })
    }

    // Check if code already exists
    const existing = await sql`SELECT id FROM coupons WHERE UPPER(code) = UPPER(${code.trim()})`
    if (existing.length > 0) {
      return NextResponse.json({ error: "El código ya existe" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO coupons (code, discount_value, discount_type, start_date, end_date, is_active)
      VALUES (${code.trim().toUpperCase()}, ${discount_value}, ${discount_type}, ${start_date}, ${end_date}, ${is_active})
      RETURNING *
    `

    return NextResponse.json({ success: true, data: result[0] })
  } catch (error) {
    console.error("[v0] Error creating coupon:", error)
    return NextResponse.json({ error: "Error al crear cupón" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const sql = getSql()
    const { id, code, discount_value, discount_type, start_date, end_date, is_active } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "ID es requerido" }, { status: 400 })
    }

    if (new Date(end_date) < new Date(start_date)) {
      return NextResponse.json({ error: "La fecha de fin debe ser posterior a la fecha de inicio" }, { status: 400 })
    }

    // Check if code already exists (excluding current coupon)
    const existing = await sql`SELECT id FROM coupons WHERE UPPER(code) = UPPER(${code.trim()}) AND id != ${id}`
    if (existing.length > 0) {
      return NextResponse.json({ error: "El código ya existe" }, { status: 400 })
    }

    const result = await sql`
      UPDATE coupons
      SET code = ${code.trim().toUpperCase()}, discount_value = ${discount_value}, 
          discount_type = ${discount_type}, start_date = ${start_date}, 
          end_date = ${end_date}, is_active = ${is_active}
      WHERE id = ${id}
      RETURNING *
    `

    return NextResponse.json({ success: true, data: result[0] })
  } catch (error) {
    console.error("[v0] Error updating coupon:", error)
    return NextResponse.json({ error: "Error al actualizar cupón" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const sql = getSql()
    const { id } = await request.json()

    await sql`DELETE FROM coupons WHERE id = ${id}`

    return NextResponse.json({ success: true, message: "Cupón eliminado exitosamente" })
  } catch (error) {
    console.error("[v0] Error deleting coupon:", error)
    return NextResponse.json({ error: "Error al eliminar cupón" }, { status: 500 })
  }
}
