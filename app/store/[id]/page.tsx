"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Download, Music, ShoppingCart } from "lucide-react"
import AudioPlayer from "@/components/audio-player"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PaystackCheckoutButton from "@/components/paystack-checkout-button"

export default function SoundPackDetailPage() {
  const params = useParams()
  const id = params.id as string

  const [pack, setPack] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [showEmailInput, setShowEmailInput] = useState(false)

  useEffect(() => {
    async function fetchSoundPack() {
      try {
        setLoading(true)
        const response = await fetch("/api/content/audio")
        if (!response.ok) {
          throw new Error("Failed to fetch audio content")
        }
        const data = await response.json()

        if (data.success && data.data) {
          // Find the specific sound pack by ID
          const soundPack = data.data.find((item: any) => item.id === id)

          if (soundPack) {
            // Transform to match expected format
            setPack({
              id: soundPack.id,
              title: soundPack.title,
              price: soundPack.price,
              category: soundPack.category || "Sound Pack",
              description: soundPack.description || "Professional sound pack for your productions.",
              features: [
                "High quality audio",
                "Professionally mixed",
                "Royalty-free for your projects",
                "Instant download after purchase",
              ],
              imageUrl: soundPack.thumbnailUrl || "/placeholder.svg?height=500&width=500",
              audioUrl: soundPack.url,
            })
          } else {
            setError("Sound pack not found")
          }
        }
      } catch (err) {
        console.error("Error fetching sound pack:", err)
        setError("Failed to load sound pack. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchSoundPack()
  }, [id])

  const handleBuyNow = () => {
    setShowEmailInput(true)
  }

  const handlePaymentSuccess = (reference: string) => {
    console.log("Payment successful with reference:", reference)
    // Here you would typically redirect to a success page or show a success message
  }

  const handlePaymentError = (error: Error) => {
    console.error("Payment error:", error)
    // Here you would typically show an error message
  }

  if (loading) {
    return (
      <div className="container py-6 md:py-12 pt-24 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-gold-500 border-r-transparent"></div>
        <p className="mt-4 text-muted-foreground">Loading sound pack details...</p>
      </div>
    )
  }

  if (error || !pack) {
    return (
      <div className="container py-6 md:py-12 pt-24">
        <Button asChild variant="ghost" className="mb-4 md:mb-6">
          <Link href="/store">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Store
          </Link>
        </Button>

        <div className="bg-red-500/10 border border-red-500/50 text-red-500 rounded-md p-6 text-center">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error || "Sound pack not found"}</p>
          <Button asChild className="mt-4 bg-gold-500 hover:bg-gold-600 text-primary-foreground">
            <Link href="/store">Return to Store</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-6 md:py-12 pt-24">
      <Button asChild variant="ghost" className="mb-4 md:mb-6">
        <Link href="/store">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Store
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12">
        <div>
          <div className="aspect-square relative rounded-lg overflow-hidden mb-4 md:mb-6">
            <img src={pack.imageUrl || "/placeholder.svg"} alt={pack.title} className="object-cover w-full h-full" />
          </div>
          <AudioPlayer audioUrl={pack.audioUrl} title="Preview" />
        </div>

        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {pack.title.split(" ").map((word: string, i: number) =>
              i === 0 ? (
                <span key={i} className="gold-text">
                  {word}
                </span>
              ) : (
                ` ${word}`
              ),
            )}
          </h1>
          <div className="text-xl md:text-2xl font-bold text-gold-500 mb-4 md:mb-6">£{pack.price.toFixed(2)}</div>

          <div className="grid grid-cols-2 md:grid-cols-2 gap-2 md:gap-4 mb-4 md:mb-6">
            <div className="bg-muted p-2 md:p-3 rounded-lg text-center">
              <div className="text-xs md:text-sm text-muted-foreground">Category</div>
              <div className="font-medium text-sm md:text-base">{pack.category}</div>
            </div>
            <div className="bg-muted p-2 md:p-3 rounded-lg text-center">
              <div className="text-xs md:text-sm text-muted-foreground">Format</div>
              <div className="font-medium text-sm md:text-base">Digital Download</div>
            </div>
          </div>

          <Tabs defaultValue="description" className="mb-6 md:mb-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="license">License</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4 text-sm md:text-base">
              <p>{pack.description}</p>
            </TabsContent>
            <TabsContent value="features" className="mt-4">
              <ul className="space-y-2 text-sm md:text-base">
                {pack.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-center">
                    <Music className="h-4 w-4 mr-2 text-gold-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="license" className="mt-4 text-sm md:text-base">
              <p>
                This sound pack includes a standard license for both personal and commercial use. You may use these
                sounds in your projects, including songs, videos, and performances. Credit is appreciated but not
                required.
              </p>
              <p className="mt-2">For extended licensing options or questions, please contact us.</p>
            </TabsContent>
          </Tabs>

          {showEmailInput ? (
            <div className="space-y-4 mb-6 border border-gold-500/20 p-4 rounded-lg">
              <h3 className="font-medium">Enter your email to complete purchase</h3>
              <p className="text-sm text-muted-foreground">
                We'll send your download link to this email after payment.
              </p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full p-2 rounded-md border border-gold-500/30 bg-black/40"
                required
              />
              <div className="flex flex-col sm:flex-row gap-2">
                <PaystackCheckoutButton
                  amount={pack.price}
                  email={email}
                  productName={pack.title}
                  productId={pack.id}
                  className="flex-1"
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
                <Button variant="outline" onClick={() => setShowEmailInput(false)} className="w-full sm:w-auto">
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <Button
                size="lg"
                className="w-full bg-gold-500 hover:bg-gold-600 text-primary-foreground"
                onClick={handleBuyNow}
              >
                <ShoppingCart className="mr-2 h-4 w-4 md:h-5 md:w-5" /> Buy Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full border-gold-500/70 bg-transparent hover:bg-gold-500/10 text-foreground shadow-[0_0_10px_rgba(247,196,20,0.1)]"
              >
                <Download className="mr-2 h-4 w-4 md:h-5 md:w-5" /> Add to Cart
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
