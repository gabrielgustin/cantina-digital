import { NextResponse } from "next/server"
import { getProductById } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { productId: string } }) {
  try {
    const product = await getProductById(params.productId)

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("[v0] Error fetching product:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
