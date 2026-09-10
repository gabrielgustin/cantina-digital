import { NextResponse } from "next/server"
import { isBusinessOpen, canOrderWhenClosed } from "@/lib/db"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  try {
    const businessOpen = await isBusinessOpen()
    const allowOrdersWhenClosed = await canOrderWhenClosed()

    const canOrder = businessOpen || allowOrdersWhenClosed

    return NextResponse.json({
      canOrder,
      businessOpen,
      allowOrdersWhenClosed,
    })
  } catch (error) {
    console.error("[v0] Error in /api/can-order:", error)
    return NextResponse.json(
      { canOrder: false, businessOpen: false, allowOrdersWhenClosed: false, error: "Error checking order status" },
      { status: 500 },
    )
  }
}
