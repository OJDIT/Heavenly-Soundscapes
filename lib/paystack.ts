export type PaystackTransactionData = {
  amount: number // amount in kobo/pesewas (smallest currency unit)
  email: string
  reference?: string // optional, Paystack will generate one if not provided
  metadata?: Record<string, any> // additional information
  callback_url?: string // URL to redirect to after payment
  plan?: string // for subscription payments
  currency?: string // NGN, GHS, USD, etc.
  channels?: string[] // payment channels to display
}

export type PaystackResponse = {
  status: boolean
  message: string
  data?: {
    authorization_url: string
    access_code: string
    reference: string
  }
}

/**
 * Initialize a Paystack transaction
 * @param data Transaction data
 * @returns Promise with Paystack response
 */
export async function initializeTransaction(data: PaystackTransactionData): Promise<PaystackResponse> {
  try {
    const response = await fetch("/api/paystack/initialize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error("Failed to initialize transaction")
    }

    return await response.json()
  } catch (error) {
    console.error("Error initializing Paystack transaction:", error)
    throw error
  }
}

/**
 * Verify a Paystack transaction
 * @param reference Transaction reference
 * @returns Promise with verification result
 */
export async function verifyTransaction(reference: string): Promise<any> {
  try {
    const response = await fetch(`/api/paystack/verify?reference=${reference}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to verify transaction")
    }

    return await response.json()
  } catch (error) {
    console.error("Error verifying Paystack transaction:", error)
    throw error
  }
}
