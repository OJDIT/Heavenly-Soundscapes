import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { PortfolioHero } from "@/components/portfolio/portfolio-hero"
import { PortfolioGrid } from "@/components/portfolio/portfolio-grid"
import { PortfolioVideos } from "@/components/portfolio/portfolio-videos"
import { ClientTestimonials } from "@/components/portfolio/client-testimonials"

export const metadata = {
  title: "Portfolio | Heavenly Soundscapes",
  description: "Explore our portfolio of exceptional recordings, from worship albums to podcasts.",
}

export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-black">
      <Navigation />
      <div className="pt-20">
        <PortfolioHero />
        <PortfolioGrid />
        <PortfolioVideos />
        <ClientTestimonials />
      </div>
      <Footer />
    </main>
  )
}
