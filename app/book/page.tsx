import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { BookingForm } from "@/components/booking/booking-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Book a Session | Heavenly Soundscapes",
  description: "Reserve your studio time at Heavenly Soundscapes. Professional recording services available.",
}

export default function BookPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-gold transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Services
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-gold mb-4 text-balance">Book <span className="gold-text">Your Session</span></h1>
            <p className="text-lg text-gray-300 text-pretty">Fill out the form below to reserve your studio time</p>
          </div>

          <BookingForm />
        </div>
      </div>

      <Footer />
    </div>
  )
}
