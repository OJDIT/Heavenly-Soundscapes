import { NextResponse } from "next/server"
import { createCheckoutSession } from "@/app/actions/stripe"

export async function POST(req: Request) {
  const { bookingId } = await req.json()
  const url = await createCheckoutSession(bookingId)
  return NextResponse.json({ url })
}