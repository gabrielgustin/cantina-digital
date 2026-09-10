import { NextResponse } from "next/server"
import { sql } from "@/lib/backoffice-db"

export async function GET() {
  try {
    console.log("[v0] Fetching products from database...")
    const products = await sql`
      SELECT * FROM productos 
      ORDER BY created_at DESC
    `
    console.log("[v0] Successfully fetched products:", products.length)

    const mapped = products.map((prod: any) => ({
      id: prod.id,
      nombre: prod.nombre,
      descripcion: prod.descripcion || "",
      precio: prod.precio?.toString() || "0",
      imagen: prod.imagen,
      categoria: prod.categoria,
      visible: prod.visible !== false,
      subcategoria: prod.subcategoria || "",
      descuento: prod.descuento || 0,
    }))

    console.log("[v0] Mapped products:", mapped)
    return NextResponse.json(mapped)
  } catch (error) {
    console.error("[v0] Error fetching productos - Full error:", error)
    if (error instanceof Error) {
      console.error("[v0] Error message:", error.message)
      console.error("[v0] Error stack:", error.stack)
    }
    return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nombre, descripcion, precio, imagen, categoria, subcategoria, descuento } = body

    if (!nombre || nombre.trim() === "") {
      return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 })
    }

    if (!categoria) {
      return NextResponse.json({ error: "La categoría es obligatoria" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO productos (nombre, descripcion, precio, imagen, categoria, visible, subcategoria, descuento)
      VALUES (
        ${nombre}, 
        ${descripcion || ""}, 
        ${Number.parseInt(precio) || 0}, 
        ${imagen || "/placeholder.svg?height=200&width=200"},
        ${categoria},
        ${true},
        ${subcategoria || ""},
        ${descuento || 0}
      )
      RETURNING *
    `

    const mapped = {
      id: result[0].id,
      nombre: result[0].nombre,
      descripcion: result[0].descripcion || "",
      precio: result[0].precio?.toString() || "0",
      imagen: result[0].imagen,
      categoria: result[0].categoria,
      visible: result[0].visible,
      subcategoria: result[0].subcategoria || "",
      descuento: result[0].descuento || 0,
    }

    return NextResponse.json(mapped, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating producto:", error)
    return NextResponse.json({ error: "Error al crear producto" }, { status: 500 })
  }
}
