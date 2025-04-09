import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HeroSection() {
  return (
    <section className="w-full py-8 md:py-16 lg:py-24 xl:py-32 bg-gradient-to-b from-purple-900 to-purple-700 text-white">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl xl:text-6xl/none">
                Anointed Beats for Gospel Music
              </h1>
              <p className="max-w-[600px] text-white/90 text-sm md:text-base xl:text-xl">
                Professional gospel beats and sounds to elevate your worship music. Created with passion and purpose.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg" className="bg-white text-purple-900 hover:bg-white/90 w-full sm:w-auto">
                <Link href="/catalog">Browse Beats</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/20 w-full sm:w-auto"
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center mt-6 lg:mt-0">
            <div className="relative h-[250px] w-[250px] sm:h-[300px] sm:w-[300px] md:h-[350px] md:w-[350px] rounded-full bg-purple-600 flex items-center justify-center shadow-2xl">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500/50 to-transparent"></div>
              <div className="text-center space-y-2 p-4 md:p-6">
                <h3 className="text-xl md:text-2xl font-bold">New Release</h3>
                <p className="text-white/90 text-sm md:text-base">Gospel Praise Collection Vol. 3</p>
                <Button asChild variant="secondary" className="mt-2 md:mt-4 text-sm md:text-base">
                  <Link href="/catalog/gospel-praise-vol-3">Listen Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
