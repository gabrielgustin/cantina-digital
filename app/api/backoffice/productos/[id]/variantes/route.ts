import { NextResponse } from "next/server"
import { sql } from "@/lib/backoffice-db"
import { requireBackofficeSession } from "@/lib/backoffice-auth"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireBackofficeSession())) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  const { id } = await params
  const variants = await sql`
    SELECT id, nombre as nombre, precio, stock
    FROM producto_variantes
    WHERE producto_id = ${id}
    ORDER BY created_at ASC
  `
  return NextResponse.json(variants)
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireBackofficeSession())) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  const { id } = await params
  const body = await request.json()
  const variantes = Array.isArray(body.variantes) ? body.variantes : []

  await sql`DELETE FROM producto_variantes WHERE producto_id = ${id}`
  for (const variante of variantes) {
    const nombre = String(variante?.nombre || "").trim()
    const precio = Number(variante?.precio)
    const stock = Number(variante?.stock)
    if (!nombre || !Number.isFinite(precio) || precio < 0 || !Number.isInteger(stock) || stock < 0) continue
    await sql`
      INSERT INTO producto_variantes (producto_id, nombre, precio, stock)
      VALUES (${id}, ${nombre}, ${precio}, ${stock})
    `
  }

  const result = await sql`
    SELECT id, nombre, precio, stock FROM producto_variantes
    WHERE producto_id = ${id} ORDER BY created_at ASC
  `
  return NextResponse.json(result)
}
