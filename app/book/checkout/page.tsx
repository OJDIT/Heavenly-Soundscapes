import { Suspense } from "react"
import { Navigation } from "@/components/navigation"
import { CheckoutForm } from "@/components/booking/checkout-form"
import { Loader2 } from "lucide-react"

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-gold mb-4">Complete Payment</h1>
            <p className="text-lg text-white/70">Secure your booking</p>
          </div>

          <Suspense
            fallback={
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-gold" />
              </div>
            }
          >
            <CheckoutForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
