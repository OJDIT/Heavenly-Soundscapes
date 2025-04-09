"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { initializeTransaction } from "@/lib/paystack"

interface PaystackCheckoutButtonProps {
  amount: number
  email: string
  productName: string
  productId: string
  className?: string
  onSuccess?: (reference: string) => void
  onError?: (error: Error) => void
}

export default function PaystackCheckoutButton({
  amount,
  email,
  productName,
  productId,
  className,
  onSuccess,
  onError,
}: PaystackCheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handlePayment = async () => {
    setIsLoading(true)

    try {
      // Generate a unique reference
      const reference = `HSS_${Date.now()}_${Math.floor(Math.random() * 1000)}`

      const response = await initializeTransaction({
        amount,
        email,
        reference,
        metadata: {
          product_id: productId,
          product_name: productName,
        },
        callback_url: `${window.location.origin}/payment/callback?reference=${reference}`,
        currency: "NGN", // Change as needed (NGN, GHS, USD, etc.)
      })

      if (response.status && response.data?.authorization_url) {
        // Redirect to Paystack payment page
        window.location.href = response.data.authorization_url
      } else {
        throw new Error(response.message || "Failed to initialize payment")
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
