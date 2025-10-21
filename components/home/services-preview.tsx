import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mic, Music, Video, Podcast, Users, Headphones } from "lucide-react"

const services = [
  {
    icon: Mic,
    title: "Studio Sessions",
    description: "Professional rehearsal and recording packages with full backline and equipment",
    price: "From £40/hr",
  },
  {
    icon: Music,
    title: "Music Production",
    description: "Complete song creation from concept to final master with expert producers",
    price: "From £650",
  },
  {
    icon: Headphones,
    title: "Mixing & Mastering",
    description: "Industry-standard post-production to make your tracks radio-ready",
    price: "From £120/song",
  },
  {
    icon: Users,
    title: "Worship Recording",
    description: "Specialized services for worship teams and live creative sessions",
    price: "From £500",
  },
  {
    icon: Video,
    title: "Video Production",
    description: "Music videos, live sessions, and multi-camera productions",
    price: "From £500",
  },
  {
    icon: Podcast,
    title: "Podcast Production",
    description: "Audio and video podcast recording with professional editing",
    price: "From £50/hr",
  },
]

export function ServicesPreview() {
  return (
    <section className="py-20 shadow-[0_0_50px_rgba(212,175,55,0.3)]">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl sm:text-5xl font-bold mb-4">
            Our <span className="gold-text">Services</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Comprehensive audio and video production services tailored to your creative vision
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <Link key={index} href="/services" className="block">
                <Card className="group hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon size={24} />
                    </div>
                    <h3 className="font-semibold text-xl mb-2">{service.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{service.description}</p>
                    <p className="text-primary font-semibold">{service.price}</p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        <div className="text-center">
          <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/services">View Full Rate Card</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
