"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { createCheckoutSession } from "@/app/actions/stripe"
import { Loader2 } from "lucide-react"

export function CheckoutForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const bookingId = searchParams.get("bookingId")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!bookingId) {
      setError("No booking ID provided")
      setLoading(false)
      return
    }

    // Call server action to create a Stripe Checkout session
    createCheckoutSession(bookingId)
      .then((url) => {
        if (url) {
          // Redirect user to Stripe Checkout page
          window.location.href = url
        } else {
          setError("Failed to create checkout session")
          setLoading(false)
        }
      })
      .catch((err) => {
        console.error("Checkout error:", err)
        setError("An error occurred while starting payment.")
        setLoading(false)
      })
  }, [bookingId])

  // Loading spinner while session is being created
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    )
  }

  // Error display if something goes wrong
  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-8 text-center">
        <p className="text-red-400">{error}</p>
        <button
          onClick={() => router.push("/book")}
          className="mt-4 text-gold hover:underline"
        >
          Return to booking form
        </button>
      </div>
    )
  }

  // Nothing to render once redirect begins
  return null
}
