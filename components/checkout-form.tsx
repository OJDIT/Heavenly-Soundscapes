"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createCheckoutSession } from "@/lib/actions"

interface CheckoutFormProps {
  productId: string
  productName: string
  amount: number
}

export default function CheckoutForm({ productId, productName, amount }: CheckoutFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await createCheckoutSession({
        amount,
        productName,
        productId,
      })

      if (result.success && result.url) {
        // Use router.push for client-side navigation
        window.location.href = result.url
      } else {
        setError(result.error || "Failed to create checkout session")
      }
    } catch (err: any) {
      console.error("Payment error:", err)
      setError(err.message || "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 rounded-md p-3 mb-4">{error}</div>}

      <Button
        type="submit"
        className="w-full bg-gold-500 hover:bg-gold-600 text-primary-foreground"
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Proceed to Checkout"}
      </Button>
    </form>
  )
}
