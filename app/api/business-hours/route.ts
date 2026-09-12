import { NextResponse } from "next/server"
import { getBusinessHours } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const hours = await getBusinessHours()
    return NextResponse.json(hours)
  } catch (error) {
    console.error("[v0] Error in business-hours API:", error)
    return NextResponse.json({ error: "Failed to fetch business hours" }, { status: 500 })
  }
}
