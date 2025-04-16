"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createCheckoutSession } from "@/lib/stripe"

interface StripeCheckoutButtonProps {
  amount: number
  productName: string
  productId: string
  className?: string
  onSuccess?: (url: string) => void
  onError?: (error: Error) => void
  successUrl?: string
  cancelUrl?: string
}

export default function StripeCheckoutButton({
  amount,
  productName,
  productId,
  className,
  onSuccess,
  onError,
  successUrl,
  cancelUrl,
}: StripeCheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handlePayment = async () => {
    setIsLoading(true)

    try {
      const response = await createCheckoutSession({
        amount,
        productName,
        productId,
        currency: "GBP", // British Pounds
        successUrl,
        cancelUrl,
      })

      if (response.success && response.url) {
        if (onSuccess) {
          onSuccess(response.url)
        } else {
          // Redirect to Stripe checkout page
          window.location.href = response.url
        }
      } else {
        throw new Error(response.message || "Failed to create checkout session")
      }
    } catch (error) {
      console.error("Payment initialization error:", error)
      if (onError && error instanceof Error) {
        onError(error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handlePayment}
      disabled={isLoading}
      className={`bg-gold-500 hover:bg-gold-600 text-primary-foreground ${className}`}
    >
      <ShoppingBag className="mr-2 h-4 w-4" />
      {isLoading ? "Processing..." : "Buy Now"}
    </Button>
  )
}
