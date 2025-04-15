import { NextResponse } from "next/server"

// This would be set in your environment variables
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const reference = searchParams.get("reference")

    if (!reference) {
      return NextResponse.json({ error: "Transaction reference is required" }, { status: 400 })
    }

    // Call Paystack API to verify transaction
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()

    if (!data.status) {
      return NextResponse.json({ error: data.message || "Failed to verify payment" }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error verifying Paystack payment:", error)
    return NextResponse.json({ error: "An error occurred while verifying your payment" }, { status: 500 })
  }
}
