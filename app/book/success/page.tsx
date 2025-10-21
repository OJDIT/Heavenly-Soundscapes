import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

export default function BookingSuccessPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="bg-white/5 backdrop-blur-sm border border-gold/20 rounded-lg p-12">
          <CheckCircle className="h-20 w-20 text-gold mx-auto mb-6" />

          <h1 className="font-serif text-4xl md:text-5xl font-bold text-gold mb-4">Booking Confirmed!</h1>

          <p className="text-xl text-white/80 mb-6">Thank you for choosing Heavenly Soundscapes</p>

          <div className="bg-black/30 rounded-lg p-6 mb-8 text-left">
            <h2 className="text-lg font-semibold text-gold mb-3">What happens next?</h2>
            <ul className="space-y-2 text-white/70">
              <li className="flex items-start gap-2">
                <span className="text-gold mt-1">•</span>
                <span>You'll receive a confirmation email with all booking details</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold mt-1">•</span>
                <span>Our team will contact you within 24 hours to confirm your session</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold mt-1">•</span>
                <span>The remaining balance is due on the day of your session</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold mt-1">•</span>
                <span>Please arrive 10 minutes early for setup</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button className="bg-gold hover:bg-gold/90 text-black font-semibold">Return Home</Button>
            </Link>
            <Link href="/services">
              <Button variant="outline" className="border-gold/30 text-gold hover:bg-gold/10 bg-transparent">
                View Services
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
