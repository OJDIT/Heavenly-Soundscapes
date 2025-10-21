import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ServicesHero } from "@/components/services/services-hero"
import { PricingCalculator } from "@/components/services/pricing-calculator"
import { ServiceDetails } from "@/components/services/service-details"

export const metadata = {
  title: "Services & Pricing | Heavenly Soundscapes",
  description:
    "Explore our comprehensive music production services with transparent pricing. From studio sessions to full production packages.",
}

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-black">
      <Navigation />
      <div className="pt-20">
        <ServicesHero />
        <PricingCalculator />
        <ServiceDetails />
      </div>
      <Footer />
    </main>
  )
}
