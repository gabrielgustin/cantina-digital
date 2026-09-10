import { NextResponse } from "next/server"
import { sql } from "@/lib/backoffice-db"

export async function GET() {
  try {
    console.log("[v0] Fetching coupons from database")

    const coupons = await sql`
      SELECT * FROM coupons 
      ORDER BY created_at DESC
    `

    console.log("[v0] Coupons fetched:", coupons.length, "records")

    return NextResponse.json({ success: true, data: coupons })
  } catch (error) {
    console.error("[v0] Error fetching coupons:", error)
    return NextResponse.json({ error: "Error al obtener cupones" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("[v0] Creating coupon:", body)

    const { code, discount_type, discount_value, start_date, end_date, is_active } = body

    // Verificar que el código sea único
    const existing = await sql`
      SELECT id FROM coupons WHERE code = ${code}
    `

    if (existing.length > 0) {
      return NextResponse.json({ error: "Ya existe un cupón con ese código" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO coupons (code, discount_type, discount_value, start_date, end_date, is_active)
      VALUES (${code}, ${discount_type}, ${discount_value}, ${start_date || null}, ${end_date || null}, ${is_active !== false})
      RETURNING *
    `

    console.log("[v0] Coupon created successfully")

    return NextResponse.json({ success: true, data: result[0] })
  } catch (error) {
    console.error("[v0] Error creating coupon:", error)
    return NextResponse.json({ error: "Error al crear cupón" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    console.log("[v0] Updating coupon:", body)

    const { id, code, discount_type, discount_value, start_date, end_date, is_active } = body

    // Verificar que el código sea único (excepto para el cupón actual)
    const existing = await sql`
      SELECT id FROM coupons WHERE code = ${code} AND id != ${id}
    `

    if (existing.length > 0) {
      return NextResponse.json({ error: "Ya existe un cupón con ese código" }, { status: 400 })
    }

    await sql`
      UPDATE coupons 
      SET code = ${code}, 
          discount_type = ${discount_type}, 
          discount_value = ${discount_value}, 
          start_date = ${start_date || null}, 
          end_date = ${end_date || null}, 
          is_active = ${is_active !== false}
      WHERE id = ${id}
    `

    console.log("[v0] Coupon updated successfully")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error updating coupon:", error)
    return NextResponse.json({ error: "Error al actualizar cupón" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 })
    }

    console.log("[v0] Deleting coupon:", id)

    await sql`
      DELETE FROM coupons 
      WHERE id = ${id}
    `

    console.log("[v0] Coupon deleted successfully")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting coupon:", error)
    return NextResponse.json({ error: "Error al eliminar cupón" }, { status: 500 })
  }
}
