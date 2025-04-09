import Link from "next/link"
import { Music, Headphones, SpeakerIcon as SpeakerWave, FileMusic, Film, Disc } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ServicesPage() {
  const services = [
    {
      icon: <Music className="h-12 w-12 text-gold-500" />,
      title: "Music Production",
      description:
        "Custom track creation, beat production, and live arrangement tailored to your unique sound and vision. We specialize in faith-inspired music that touches hearts and glorifies God.",
      features: [
        "Custom beat creation",
        "Vocal production",
        "Song arrangement",
        "Instrumentation and composition",
        "Faith-centered approach",
      ],
      cta: "Request Music Production",
    },
    {
      icon: <Headphones className="h-12 w-12 text-gold-500" />,
      title: "Mixing & Mastering",
      description:
        "Professional polish for your tracks with attention to detail that brings out the best in your music. Our mixing and mastering services ensure your sound reaches its full potential.",
      features: [
        "Balanced and clear mixes",
        "Professional mastering",
        "Online delivery",
        "Revisions included",
        "All genres welcome",
      ],
      cta: "Request Mixing & Mastering",
    },
    {
      icon: <SpeakerWave className="h-12 w-12 text-gold-500" />,
      title: "Church Sound Design",
      description:
        "Specialized audio solutions created specifically for worship environments. Enhance your church services with professional sound design that supports your worship experience.",
      features: [
        "Custom worship loops",
        "Transition sounds",
        "Background ambience",
        "Service sound effects",
        "Worship stems and tracks",
      ],
      cta: "Request Church Sound Design",
    },
    {
      icon: <FileMusic className="h-12 w-12 text-gold-500" />,
      title: "Sound Packs",
      description:
        "Curated collections of premium sounds to enhance your productions. Our sound packs include everything from scripture-inspired ambience to producer kits for your creative projects.",
      features: [
        "Scripture-inspired sounds",
        "Ambient/nature collections",
        "Producer kits",
        "Ministry-focused sound effects",
        "Worship instrument samples",
      ],
      cta: "Browse Sound Packs",
    },
    {
      icon: <Disc className="h-12 w-12 text-gold-500" />,
      title: "Instrument Tracking",
      description:
        "Remote recording services for a variety of instruments to complete your productions. Our skilled musicians add the perfect touch to your tracks without you leaving your studio.",
      features: [
        "Bass, drums, keys tracking",
        "Guitar and string instruments",
        "Vocal arrangements",
        "Wind and brass sections",
        "Quick turnaround times",
      ],
      cta: "Request Instrument Tracking",
    },
    {
      icon: <Film className="h-12 w-12 text-gold-500" />,
      title: "Video Services",
      description:
        "Visual content creation that complements your audio with the same level of quality and attention to detail. From lyric videos to full music videos, we've got you covered.",
      features: [
        "Music video editing",
        "Lyric video creation",
        "Worship visuals",
        "Social media content",
        "Live performance recording",
      ],
      cta: "Request Video Services",
    },
  ]

  return (
    <div className="pt-24 pb-16">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold mb-4">
            Our <span className="gold-text">Services</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Professional sound and media production services designed to elevate your ministry and creative projects.
          </p>
        </div>

        <div className="space-y-16 md:space-y-24">
          {services.map((service, i) => (
            <div
              key={i}
              className={`flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-8 md:gap-12`}
            >
              <div className="md:w-2/5 flex justify-center">
                <div className="relative p-6 md:p-10 gold-border rounded-xl bg-black/50">
                  <div className="relative">
                    {service.icon}
                    <div className="absolute inset-0 -m-2 bg-gold-500/20 rounded-full blur-md animate-gold-pulse"></div>
                  </div>
                  <h3 className="text-2xl font-playfair font-bold mt-4">{service.title}</h3>
                </div>
              </div>

              <div className="md:w-3/5">
                <p className="text-lg mb-6">{service.description}</p>
                <h4 className="text-gold-500 font-semibold mb-3">What we offer:</h4>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-gold-500"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button asChild className="bg-gold-500 hover:bg-gold-600 text-primary-foreground">
                  <Link href="/contact">{service.cta}</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
