import { NextResponse } from "next/server"
import { sql } from "@/lib/backoffice-db"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const items = Array.isArray(body.items) ? body.items : []
    if (!items.length) return NextResponse.json({ error: "El pedido no tiene productos" }, { status: 400 })

    for (const item of items) {
      const quantity = Number(item.quantity)
      if (!Number.isInteger(quantity) || quantity <= 0) {
        return NextResponse.json({ error: "Cantidad inválida" }, { status: 400 })
      }

      if (item.variantId) {
        const updated = await sql`
          UPDATE producto_variantes
          SET stock = stock - ${quantity}
          WHERE id = ${item.variantId} AND stock >= ${quantity}
          RETURNING id
        `
        if (!updated.length) return NextResponse.json({ error: `Stock insuficiente para ${item.title}` }, { status: 409 })
      } else {
        const updated = await sql`
          UPDATE productos
          SET stock = stock - ${quantity}
          WHERE id = ${item.productId} AND stock >= ${quantity}
          RETURNING id
        `
        if (!updated.length) return NextResponse.json({ error: `Stock insuficiente para ${item.title}` }, { status: 409 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error descontando stock:", error)
    return NextResponse.json({ error: "No se pudo actualizar el stock" }, { status: 500 })
  }
}
