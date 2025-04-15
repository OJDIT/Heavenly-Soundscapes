import { NextResponse } from "next/server"

// This would be set in your environment variables
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY
const PAYSTACK_API_URL = "https://api.paystack.co/transaction/initialize"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.email || !body.amount) {
      return NextResponse.json({ error: "Email and amount are required" }, { status: 400 })
    }

    // Make sure amount is in the smallest currency unit (kobo/pesewas)
    // If amount is provided in main currency (e.g., Naira), convert it
    if (body.amount < 100) {
      body.amount = Math.round(body.amount * 100)
    }

    // Call Paystack API to initialize transaction
    const response = await fetch(PAYSTACK_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!data.status) {
      return NextResponse.json({ error: data.message || "Failed to initialize payment" }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error initializing Paystack payment:", error)
    return NextResponse.json({ error: "An error occurred while processing your payment" }, { status: 500 })
  }
}
