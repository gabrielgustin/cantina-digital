import { type NextRequest, NextResponse } from "next/server"
import { getSiteConfig } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { key: string } }) {
  try {
    const { key } = params
    const value = await getSiteConfig(key)

    if (value === null) {
      return NextResponse.json({ error: "Config key not found" }, { status: 404 })
    }

    return NextResponse.json({ key, value })
  } catch (error) {
    console.error("Error fetching site config:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
