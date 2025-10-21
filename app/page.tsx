import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/home/hero-section"
import { StudioGallery } from "@/components/home/studio-gallery"
import { ServicesPreview } from "@/components/home/services-preview"
import { TestimonialsSection } from "@/components/home/testimonials-section"
import { CTASection } from "@/components/home/cta-section"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black">
      <Navigation />
      <div className="pt-24 md:pt-20">
        <HeroSection />
        <StudioGallery />
        <ServicesPreview />
        <TestimonialsSection />
        <CTASection />
      </div>
      <Footer />
    </main>
  )
}
