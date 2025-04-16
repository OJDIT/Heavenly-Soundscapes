// Stripe API integration helper functions

export type StripeCheckoutData = {
  amount: number // amount in cents
  currency?: string // USD, GBP, EUR, etc.
  productName: string
  productId: string
  successUrl?: string
  cancelUrl?: string
}

export type StripeResponse = {
  success: boolean
  message: string
  url?: string
}

/**
 * Create a Stripe checkout session
 * @param data Checkout data
 * @returns Promise with Stripe response
 */
export async function createCheckoutSession(data: StripeCheckoutData): Promise<StripeResponse> {
  try {
    const response = await fetch("/api/stripe/create-checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error("Failed to create checkout session")
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating Stripe checkout session:", error)
    throw error
  }
}

/**
 * Verify a Stripe payment
 * @param sessionId Checkout session ID
 * @returns Promise with verification result
 */
export async function verifyPayment(sessionId: string): Promise<any> {
  try {
    const response = await fetch(`/api/stripe/verify?session_id=${sessionId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to verify payment")
    }

    return await response.json()
  } catch (error) {
    console.error("Error verifying Stripe payment:", error)
    throw error
  }
}
