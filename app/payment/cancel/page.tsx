import Link from "next/link"
import { XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PaymentCancelPage() {
  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="container max-w-md">
        <div className="gold-border bg-black/60 rounded-lg p-6 md:p-8 text-center">
          <XCircle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Payment Cancelled</h1>
          <p className="text-muted-foreground mb-6">
            Your payment was cancelled. No charges have been made to your account.
          </p>

          <div className="flex flex-col gap-3">
            <Button asChild className="bg-gold-500 hover:bg-gold-600 text-primary-foreground">
              <Link href="/store">Return to Store</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/contact">Need Help?</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
