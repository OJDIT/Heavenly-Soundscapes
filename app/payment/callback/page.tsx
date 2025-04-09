"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { verifyTransaction } from "@/lib/paystack"

export default function PaymentCallbackPage() {
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading")
  const [message, setMessage] = useState("")
  const [transactionDetails, setTransactionDetails] = useState<any>(null)
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const reference = searchParams.get("reference")

    if (!reference) {
      setStatus("failed")
      setMessage("Invalid payment reference")
      return
    }

    const verifyPayment = async () => {
      try {
        const response = await verifyTransaction(reference)

        if (response.status && response.data?.status === "success") {
          setStatus("success")
          setMessage("Payment successful! Your order has been processed.")
          setTransactionDetails(response.data)

          // Here you would typically:
          // 1. Update your database to mark the order as paid
          // 2. Send confirmation email
          // 3. Prepare download links or access to purchased content
        } else {
          setStatus("failed")
          setMessage(response.message || "Payment verification failed")
        }
      } catch (error) {
        console.error("Error verifying payment:", error)
        setStatus("failed")
        setMessage("An error occurred while verifying your payment")
      }
    }

    verifyPayment()
  }, [searchParams])

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="container max-w-md">
        <div className="gold-border bg-black/60 rounded-lg p-6 md:p-8 text-center">
          {status === "loading" && (
            <>
              <Loader2 className="h-16 w-16 text-gold-500 mx-auto animate-spin mb-4" />
              <h1 className="text-2xl font-bold mb-2">Verifying Payment</h1>
              <p className="text-muted-foreground">Please wait while we verify your payment...</p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
              <p className="text-muted-foreground mb-6">{message}</p>

              {transactionDetails && (
                <div className="bg-black/40 rounded-lg p-4 mb-6 text-left">
                  <h2 className="font-semibold text-gold-400 mb-2">Transaction Details</h2>
                  <p className="text-sm mb-1">
                    <span className="text-muted-foreground">Reference:</span> {transactionDetails.reference}
                  </p>
                  <p className="text-sm mb-1">
                    <span className="text-muted-foreground">Amount:</span> {transactionDetails.currency}{" "}
                    {(transactionDetails.amount / 100).toFixed(2)}
                  </p>
                  <p className="text-sm mb-1">
                    <span className="text-muted-foreground">Date:</span>{" "}
                    {new Date(transactionDetails.paid_at).toLocaleString()}
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-3">
                <Button asChild className="bg-gold-500 hover:bg-gold-600 text-primary-foreground">
                  <Link href="/store">Continue Shopping</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/account/downloads">View My Downloads</Link>
                </Button>
              </div>
            </>
          )}

          {status === "failed" && (
            <>
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Payment Failed</h1>
              <p className="text-muted-foreground mb-6">{message}</p>

              <div className="flex flex-col gap-3">
                <Button asChild className="bg-gold-500 hover:bg-gold-600 text-primary-foreground">
                  <Link href="/cart">Return to Cart</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/contact">Contact Support</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
