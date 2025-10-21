// /app/api/admin/update-booking-status/route.ts
import { NextResponse } from "next/server"
import { updateBookingStatus } from "@/app/actions/admin"

export async function POST(req: Request) {
  try {
    const { bookingId, newStatus } = await req.json()
    if (!bookingId || !newStatus) return NextResponse.json({ error: "bookingId and newStatus required" }, { status: 400 })

    await updateBookingStatus(bookingId, newStatus)
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error("update-booking-status route error:", err)
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 })
  }
}
