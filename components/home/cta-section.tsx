import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5" />
          <div className="relative px-6 py-12 sm:px-12 sm:py-20 text-center">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-balance px-2">
              Ready to Create Something <span className="gold-text">Extraordinary?</span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed px-4">
              Book your studio session today and experience the difference that professional production makes
            </p>
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm sm:text-base px-6 sm:px-8"
            >
              <Link href="/services">
                <span className="hidden sm:inline">Book Your Studio Session Today</span>
                <span className="sm:hidden">Book Session Today</span>
                <ArrowRight className="ml-2" size={18} />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
