import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

function getSql() {
  const databaseUrl =
    process.env.NEON_NEON_DATABASE_URL || process.env.NEON_POSTGRES_URL || process.env.NEON_DATABASE_URL
  if (!databaseUrl) {
    throw new Error("Database connection string not found")
  }
  return neon(databaseUrl)
}

export async function POST(request: Request) {
  try {
    const sql = getSql()
    const { code, orderTotal } = await request.json()

    if (!code) {
      return NextResponse.json({ error: "Código de cupón requerido" }, { status: 400 })
    }

    const coupons = await sql`
      SELECT * FROM coupons
      WHERE UPPER(code) = UPPER(${code})
      AND is_active = true
      AND start_date <= CURRENT_DATE
      AND end_date >= CURRENT_DATE
      LIMIT 1
    `

    if (coupons.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Cupón inválido o expirado",
        },
        { status: 404 },
      )
    }

    const coupon = coupons[0]

    let discountAmount = 0
    if (coupon.discount_type === "percentage") {
      discountAmount = (orderTotal * coupon.discount_value) / 100
    } else if (coupon.discount_type === "fixed") {
      discountAmount = coupon.discount_value
    }

    return NextResponse.json({
      success: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        discount_amount: discountAmount,
      },
    })
  } catch (error) {
    console.error("[v0] Error validating coupon:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error al validar cupón",
      },
      { status: 500 },
    )
  }
}
