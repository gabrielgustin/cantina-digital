import { NextResponse } from "next/server"
import { getCategoryById } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { categoryId: string } }) {
  try {
    const category = await getCategoryById(params.categoryId)

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error("[v0] Error fetching category:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
