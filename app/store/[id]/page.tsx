"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Download, Music, ShoppingCart } from "lucide-react"
import AudioPlayer from "@/components/audio-player"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PaystackCheckoutButton from "@/components/paystack-checkout-button"

// This would normally be fetched from a database based on the ID
const soundPacks = {
  "scripture-ambient-vol1": {
    id: "scripture-ambient-vol1",
    title: "Scripture Ambient Vol. 1",
    price: 29.99,
    category: "Scripture Sounds",
    description: "Ambient soundscapes inspired by Psalms with gentle piano and atmospheric textures.",
    features: ["10 ambient tracks", "Scripture readings (optional stems)", "Seamless loops", "WAV & MP3 formats"],
    imageUrl: "/placeholder.svg?height=500&width=500",
    audioUrl: "#",
  },
  "worship-producer-kit": {
    id: "worship-producer-kit",
    title: "Worship Producer Kit",
    price: 49.99,
    category: "Producer Kits",
    description: "Complete toolkit for worship producers with drums, pads, and instrument loops.",
    features: ["50+ instrument loops", "20 drum patterns", "15 worship pad progressions", "MIDI files included"],
    imageUrl: "/placeholder.svg?height=500&width=500",
    audioUrl: "#",
  },
}

export default function SoundPackDetailPage({ params }: { params: { id: string } }) {
  const [email, setEmail] = useState("")
  const [showEmailInput, setShowEmailInput] = useState(false)

  // Get the sound pack data based on the ID
  const pack = soundPacks[params.id as keyof typeof soundPacks] || {
    id: params.id,
    title: "Sound Pack",
    price: 29.99,
    category: "Sound Pack",
    description: "Professional sound pack for your productions.",
    features: ["High quality sounds", "Royalty-free", "Instant download"],
    imageUrl: "/placeholder.svg?height=500&width=500",
    audioUrl: "#",
  }

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
            {pack.title.split(" ").map((word, i) =>
              i === 0 ? (
                <span key={i} className="gold-text">
                  {word}
                </span>
              ) : (
                ` ${word}`
              ),
            )}
          </h1>
          <div className="text-xl md:text-2xl font-bold text-gold-500 mb-4 md:mb-6">${pack.price}</div>

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
                {pack.features.map((feature, index) => (
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

      <div className="mt-12 md:mt-16">
        <h2 className="text-xl md:text-2xl font-bold mb-6">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {/* Related sound packs would go here */}
        </div>
      </div>
    </div>
  )
}
