import { NextResponse } from "next/server"
import { sql } from "@/lib/backoffice-db"
import { requireBackofficeSession } from "@/lib/backoffice-auth"

export async function GET() {
  try {
    if (!(await requireBackofficeSession())) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    console.log("[v0] Fetching categories from database...")
    const categories = await sql`
      SELECT * FROM categorias 
      ORDER BY created_at DESC
    `
    console.log("[v0] Successfully fetched categories:", categories.length)

    const mapped = categories.map((cat: any) => ({
      id: cat.id,
      nombre: cat.nombre,
      imagen: cat.imagen,
      visible: cat.visible !== false,
    }))

    return NextResponse.json(mapped)
  } catch (error) {
    console.error("[v0] Error fetching categorias:", error)
    return NextResponse.json({ error: "Error al obtener categorías" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    if (!(await requireBackofficeSession())) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    console.log("[v0] Received POST request with body:", body)
    const { nombre, imagen } = body

    if (!nombre || nombre.trim() === "") {
      console.log("[v0] Validation failed: nombre is empty")
      return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 })
    }

    const baseId = nombre
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove accents
      .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with hyphens
      .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens

    // Check if ID already exists and append a number if needed
    let id = baseId
    let counter = 1
    let exists = true

    while (exists) {
      const check = await sql`SELECT id FROM categorias WHERE id = ${id}`
      if (check.length === 0) {
        exists = false
      } else {
        id = `${baseId}-${counter}`
        counter++
      }
    }

    console.log("[v0] Generated unique ID:", id)
    console.log("[v0] Attempting to insert category into database...")
    const result = await sql`
      INSERT INTO categorias (id, nombre, imagen, visible)
      VALUES (
        ${id},
        ${nombre}, 
        ${imagen || "/placeholder.svg?height=400&width=400"},
        ${true}
      )
      RETURNING *
    `
    console.log("[v0] Successfully created category:", result[0])

    const mapped = {
      id: result[0].id,
      nombre: result[0].nombre,
      imagen: result[0].imagen,
      visible: result[0].visible,
    }

    return NextResponse.json(mapped, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating categoria - Full error:", error)
    if (error instanceof Error) {
      console.error("[v0] Error message:", error.message)
      console.error("[v0] Error stack:", error.stack)
    }
    return NextResponse.json(
      {
        error: "Error al crear categoría",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
