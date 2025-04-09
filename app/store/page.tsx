import Link from "next/link"
import { ShoppingBag, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import AudioPlayer from "@/components/audio-player"

export default function StorePage() {
  const categories = ["All Packs", "Scripture Sounds", "Nature Music", "Producer Kits", "Custom Sounds"]

  const soundPacks = [
    {
      id: "scripture-ambient-vol1",
      title: "Scripture Ambient Vol. 1",
      description: "Ambient soundscapes inspired by Psalms with gentle piano and atmospheric textures.",
      price: 29.99,
      category: "Scripture Sounds",
      imageUrl: "/placeholder.svg?height=500&width=500",
      audioUrl: "#",
      features: ["10 ambient tracks", "Scripture readings (optional stems)", "Seamless loops", "WAV & MP3 formats"],
    },
    {
      id: "worship-producer-kit",
      title: "Worship Producer Kit",
      description: "Complete toolkit for worship producers with drums, pads, and instrument loops.",
      price: 49.99,
      category: "Producer Kits",
      imageUrl: "/placeholder.svg?height=500&width=500",
      audioUrl: "#",
      features: ["50+ instrument loops", "20 drum patterns", "15 worship pad progressions", "MIDI files included"],
    },
    {
      id: "nature-worship-collection",
      title: "Nature Worship Collection",
      description: "Beautiful nature sounds combined with subtle worship elements for prayer and meditation.",
      price: 24.99,
      category: "Nature Music",
      imageUrl: "/placeholder.svg?height=500&width=500",
      audioUrl: "#",
      features: [
        "8 nature ambience tracks",
        "Gentle worship elements",
        "30-minute seamless loops",
        "Perfect for prayer rooms",
      ],
    },
    {
      id: "gospel-essentials",
      title: "Gospel Essentials",
      description: "Everything you need to produce authentic gospel tracks with organs, choirs, and drums.",
      price: 39.99,
      category: "Producer Kits",
      imageUrl: "/placeholder.svg?height=500&width=500",
      audioUrl: "#",
      features: [
        "Hammond organ samples",
        "Gospel choir phrases",
        "Traditional drum patterns",
        "Bass lines and piano loops",
      ],
    },
    {
      id: "prophetic-soundscapes",
      title: "Prophetic Soundscapes",
      description: "Unique sounds designed for prophetic worship moments and spontaneous ministry.",
      price: 34.99,
      category: "Custom Sounds",
      imageUrl: "/placeholder.svg?height=500&width=500",
      audioUrl: "#",
      features: [
        "Atmospheric pads",
        "Evolving textures",
        "Key-labeled for easy use",
        "Perfect for spontaneous worship",
      ],
    },
    {
      id: "sermon-background-vol1",
      title: "Sermon Background Vol. 1",
      description: "Subtle background textures that enhance spoken word without distraction.",
      price: 19.99,
      category: "Scripture Sounds",
      imageUrl: "/placeholder.svg?height=500&width=500",
      audioUrl: "#",
      features: [
        "12 background tracks",
        "Minimal musical elements",
        "Loopable sections",
        "Optimized for speech clarity",
      ],
    },
  ]

  return (
    <div className="pt-24 pb-16">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold mb-4">
            Sound <span className="gold-text">Store</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Explore our collection of premium sound packs, samples, and resources for your creative projects.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8">
          {categories.map((category, i) => (
            <Button
              key={i}
              variant={i === 0 ? "default" : "outline"}
              size="sm"
              className={`text-sm md:text-base ${i === 0 ? "bg-gold-500 hover:bg-gold-600 text-primary-foreground" : "border-gold-500/30 hover:border-gold-500/50 hover:bg-gold-500/10"}`}
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {soundPacks.map((pack) => (
            <div
              key={pack.id}
              className="border border-gold-500/20 bg-black/40 rounded-lg overflow-hidden hover:border-gold-500/40 transition-all group"
            >
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={pack.imageUrl || "/placeholder.svg"}
                  alt={pack.title}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold truncate">{pack.title}</h3>
                  <div className="text-lg font-bold text-gold-500 flex-shrink-0 ml-2">${pack.price}</div>
                </div>

                <div className="text-xs font-medium text-gold-400 mb-2">{pack.category}</div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{pack.description}</p>

                <div className="mb-4">
                  <AudioPlayer audioUrl={pack.audioUrl} title="Preview" />
                </div>

                <div className="space-y-1 mb-4 hidden sm:block">
                  {pack.features.slice(0, 2).map((feature, i) => (
                    <div key={i} className="flex items-center text-xs">
                      <div className="h-1 w-1 rounded-full bg-gold-500 mr-2 flex-shrink-0"></div>
                      <span className="truncate">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button asChild className="flex-1 bg-gold-500 hover:bg-gold-600 text-primary-foreground">
                    <Link href={`/store/${pack.id}`}>
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">Buy Now</span>
                      <span className="sm:hidden">Buy</span>
                    </Link>
                  </Button>
                  <Button variant="outline" size="icon" className="flex-shrink-0">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
