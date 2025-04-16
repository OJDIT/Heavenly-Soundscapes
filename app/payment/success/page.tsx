"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, XCircle, Loader2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PaymentSuccessPage() {
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading")
  const [message, setMessage] = useState("")
  const [sessionDetails, setSessionDetails] = useState<any>(null)
  const [purchasedItem, setPurchasedItem] = useState<any>(null)
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const sessionId = searchParams.get("session_id")
    const productId = searchParams.get("product_id")

    if (!sessionId) {
      setStatus("failed")
      setMessage("Invalid session ID")
      return
    }

    const verifySession = async () => {
      try {
        const response = await fetch(`/api/stripe/verify?session_id=${sessionId}`)
        const data = await response.json()

        if (data.success) {
          setStatus("success")
          setMessage("Payment successful! Your order has been processed.")
          setSessionDetails(data.session)

          // Try to get the purchased item details
          if (productId) {
            try {
              const audioResponse = await fetch("/api/content/audio")
              if (audioResponse.ok) {
                const audioData = await audioResponse.json()
                if (audioData.success && audioData.data) {
                  const item = audioData.data.find((item: any) => item.id === productId)
                  if (item) {
                    setPurchasedItem(item)

                    // Store purchase in localStorage
                    try {
                      const purchases = JSON.parse(localStorage.getItem("purchases") || "[]")
                      if (!purchases.some((p: any) => p.id === item.id)) {
                        purchases.push({
                          id: item.id,
                          title: item.title,
                          purchaseDate: new Date().toISOString(),
                          sessionId,
                        })
                        localStorage.setItem("purchases", JSON.stringify(purchases))
                      }
                    } catch (e) {
                      console.error("Error storing purchase:", e)
                    }
                  }
                }
              }
            } catch (error) {
              console.error("Error fetching purchased item:", error)
            }
          }
        } else {
          setStatus("failed")
          setMessage(data.error || "Payment verification failed")
        }
      } catch (error) {
        console.error("Error verifying payment:", error)
        setStatus("failed")
        setMessage("An error occurred while verifying your payment")
      }
    }

    verifySession()
  }, [searchParams])

  const handleDownload = () => {
    if (purchasedItem && purchasedItem.url) {
      // Create an anchor element and set the href to the audio URL
      const a = document.createElement("a")
      a.href = purchasedItem.url
      a.download = `${purchasedItem.title.replace(/\s+/g, "-").toLowerCase()}.mp3` // Set the download filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

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

              {sessionDetails && (
                <div className="bg-black/40 rounded-lg p-4 mb-6 text-left">
                  <h2 className="font-semibold text-gold-400 mb-2">Transaction Details</h2>
                  <p className="text-sm mb-1">
                    <span className="text-muted-foreground">Session ID:</span> {sessionDetails.id}
                  </p>
                  <p className="text-sm mb-1">
                    <span className="text-muted-foreground">Amount:</span> £
                    {((sessionDetails.amount_total || 0) / 100).toFixed(2)}
                  </p>
                  <p className="text-sm mb-1">
                    <span className="text-muted-foreground">Status:</span> {sessionDetails.payment_status}
                  </p>
                </div>
              )}

              {purchasedItem && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
                  <h2 className="font-semibold text-green-400 mb-2">Your Purchase</h2>
                  <p className="text-sm mb-3">{purchasedItem.title}</p>
                  <Button onClick={handleDownload} className="w-full bg-green-600 hover:bg-green-700">
                    <Download className="mr-2 h-4 w-4" /> Download Now
                  </Button>
                </div>
              )}

              <div className="flex flex-col gap-3">
                <Button asChild className="bg-gold-500 hover:bg-gold-600 text-primary-foreground">
                  <Link href="/store">Continue Shopping</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/contact">Need Support?</Link>
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
                  <Link href="/store">Return to Store</Link>
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
