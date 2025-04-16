import { NextResponse } from "next/server"
import Stripe from "stripe"

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
})

// Replace the POST function with this updated version that ensures valid URLs
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { amount, currency = "GBP", productName, productId, successUrl, cancelUrl } = body

    if (!amount || !productName) {
      return NextResponse.json({ success: false, error: "Amount and product name are required" }, { status: 400 })
    }

    // Get the base URL from request headers or use a fallback
    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: productName,
              metadata: {
                product_id: productId,
              },
            },
            unit_amount: Math.round(amount * 100), // Convert to cents/pence
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl || `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${origin}/payment/cancel`,
    })

    return NextResponse.json({
      success: true,
      url: session.url,
    })
  } catch (error: any) {
    console.error("Error creating Stripe checkout session:", error)
    return NextResponse.json(
      { success: false, error: error.message || "An error occurred while processing your payment" },
      { status: 500 },
    )
  }
}
