// /app/api/admin/confirm-booking/route.ts
import { NextResponse } from "next/server"
import { updateBookingStatus } from "@/app/actions/admin"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { bookingId } = body
    if (!bookingId) return NextResponse.json({ error: "bookingId required" }, { status: 400 })

    // updateBookingStatus will send emails as coded in app/actions/admin.ts
    await updateBookingStatus(bookingId, "confirmed")
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error("confirm-booking route error:", err)
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 })
  }
}
