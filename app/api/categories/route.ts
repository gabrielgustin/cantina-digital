import { NextResponse } from "next/server"
import { getCategories } from "@/lib/db"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  try {
    const categories = await getCategories()
    console.log("[v0] API categories returned:", categories.length)
    return NextResponse.json(categories)
  } catch (error) {
    console.error("[v0] Error fetching categories:", error)
    return NextResponse.json({ error: "Error al obtener categorías" }, { status: 500 })
  }
}
