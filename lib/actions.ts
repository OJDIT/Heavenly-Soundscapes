"use server"

import Stripe from "stripe"

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
})

export async function createCheckoutSession(data: {
  amount: number
  productName: string
  productId: string
  successUrl?: string
  cancelUrl?: string
}) {
  try {
    const { amount, productName, productId, successUrl, cancelUrl } = data

    // Get base URL from environment or use a default
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://your-vercel-url.vercel.app"

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "GBP",
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
      success_url: successUrl || `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}&product_id=${productId}`,
      cancel_url: cancelUrl || `${baseUrl}/payment/cancel`,
    })

    return { success: true, url: session.url }
  } catch (error: any) {
    console.error("Error creating Stripe checkout session:", error)
    return {
      success: false,
      error: error.message || "An error occurred while processing your payment",
    }
  }
}
