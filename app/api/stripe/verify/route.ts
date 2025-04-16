import { NextResponse } from "next/server"
import Stripe from "stripe"

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("session_id")

    if (!sessionId) {
      return NextResponse.json({ success: false, error: "Session ID is required" }, { status: 400 })
    }

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (!session) {
      return NextResponse.json({ success: false, error: "Session not found" }, { status: 404 })
    }

    // Check if payment was successful
    if (session.payment_status === "paid") {
      return NextResponse.json({
        success: true,
        session: {
          id: session.id,
          payment_status: session.payment_status,
          amount_total: session.amount_total,
          currency: session.currency,
          customer_email: session.customer_details?.email,
        },
      })
    } else {
      return NextResponse.json({
        success: false,
        error: "Payment not completed",
        session: {
          id: session.id,
          payment_status: session.payment_status,
        },
      })
    }
  } catch (error: any) {
    console.error("Error verifying Stripe payment:", error)
    return NextResponse.json(
      { success: false, error: error.message || "An error occurred while verifying your payment" },
      { status: 500 },
    )
  }
}
