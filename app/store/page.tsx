"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ShoppingBag, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import AudioPlayer from "@/components/audio-player"

export default function StorePage() {
  const [categories, setCategories] = useState([
    "All Packs",
    "Scripture Sounds",
    "Nature Music",
    "Producer Kits",
    "Custom Sounds",
  ])
  const [soundPacks, setSoundPacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState("All Packs")

  useEffect(() => {
    async function fetchContent() {
      try {
        setLoading(true)
        const response = await fetch("/api/content/audio")
        if (!response.ok) {
          throw new Error("Failed to fetch audio content")
        }
        const data = await response.json()

        if (data.success && data.data) {
          // Transform the data to match the expected format
          const formattedData = data.data.map((item: any) => ({
            id: item.id,
            title: item.title,
            description: item.description || "Professional gospel sound pack.",
            price: item.price,
            category: item.category || "Custom Sounds",
            imageUrl: item.thumbnailUrl || "/placeholder.svg?height=500&width=500",
            audioUrl: item.url,
            features: [
              "High quality audio",
              "Professionally mixed",
              "Royalty-free for your projects",
              "Instant download after purchase",
            ],
          }))

          setSoundPacks(formattedData)

          // Update categories based on available content
          const contentCategories = [...new Set(formattedData.map((item: any) => item.category))].filter(Boolean)
          if (contentCategories.length > 0) {
            setCategories(["All Packs", ...contentCategories])
          }
        }
      } catch (err) {
        console.error("Error fetching content:", err)
        setError("Failed to load content. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [])

  // Filter sound packs by category
  const filteredSoundPacks =
    activeCategory === "All Packs" ? soundPacks : soundPacks.filter((pack: any) => pack.category === activeCategory)

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

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 rounded-md p-3 text-sm mb-8">{error}</div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-gold-500 border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading sound packs...</p>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8">
              {categories.map((category, i) => (
                <Button
                  key={i}
                  variant={category === activeCategory ? "default" : "outline"}
                  size="sm"
                  className={`text-sm md:text-base ${
                    category === activeCategory
                      ? "bg-gold-500 hover:bg-gold-600 text-primary-foreground"
                      : "border-gold-500/30 hover:border-gold-500/50 hover:bg-gold-500/10"
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>

            {filteredSoundPacks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No sound packs found in this category.</p>
                <Button asChild className="mt-4 bg-gold-500 hover:bg-gold-600 text-primary-foreground">
                  <Link href="/admin/dashboard?tab=upload">Upload Content</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredSoundPacks.map((pack: any) => (
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
                        <div className="text-lg font-bold text-gold-500 flex-shrink-0 ml-2">
                          £{pack.price.toFixed(2)}
                        </div>
                      </div>

                      <div className="text-xs font-medium text-gold-400 mb-2">{pack.category}</div>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{pack.description}</p>

                      <div className="mb-4">
                        <AudioPlayer audioUrl={pack.audioUrl} title="Preview" />
                      </div>

                      <div className="space-y-1 mb-4 hidden sm:block">
                        {pack.features.slice(0, 2).map((feature: string, i: number) => (
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
            )}
          </>
        )}
      </div>
    </div>
  )
}
