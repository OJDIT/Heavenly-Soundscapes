import Link from "next/link"
import { ArrowLeft, Download, Music, ShoppingCart } from "lucide-react"
import AudioPlayer from "@/components/audio-player"
import RelatedBeats from "@/components/related-beats"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// This would normally be fetched from a database based on the ID
const beat = {
  id: "gospel-praise-1",
  title: "Joyful Praise",
  price: 29.99,
  category: "Praise",
  bpm: 120,
  key: "C Major",
  duration: "3:45",
  description:
    "A uplifting gospel praise beat with powerful drums, organ, and piano. Perfect for contemporary worship services and praise songs.",
  features: [
    "Professionally mixed and mastered",
    "Includes stems for customization",
    "Royalty-free for commercial use",
    "Instant download after purchase",
    "Compatible with all major DAWs",
  ],
  imageUrl: "/placeholder.svg?height=600&width=600",
  audioUrl: "#",
}

export default function BeatDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container py-6 md:py-12">
      <Button asChild variant="ghost" className="mb-4 md:mb-6">
        <Link href="/catalog">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Catalog
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12">
        <div>
          <div className="aspect-square relative rounded-lg overflow-hidden mb-4 md:mb-6">
            <img src={beat.imageUrl || "/placeholder.svg"} alt={beat.title} className="object-cover w-full h-full" />
          </div>
          <AudioPlayer />
        </div>

        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{beat.title}</h1>
          <div className="text-xl md:text-2xl font-bold text-purple-600 mb-4 md:mb-6">£{beat.price}</div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-6">
            <div className="bg-muted p-2 md:p-3 rounded-lg text-center">
              <div className="text-xs md:text-sm text-muted-foreground">Category</div>
              <div className="font-medium text-sm md:text-base">{beat.category}</div>
            </div>
            <div className="bg-muted p-2 md:p-3 rounded-lg text-center">
              <div className="text-xs md:text-sm text-muted-foreground">BPM</div>
              <div className="font-medium text-sm md:text-base">{beat.bpm}</div>
            </div>
            <div className="bg-muted p-2 md:p-3 rounded-lg text-center">
              <div className="text-xs md:text-sm text-muted-foreground">Key</div>
              <div className="font-medium text-sm md:text-base">{beat.key}</div>
            </div>
            <div className="bg-muted p-2 md:p-3 rounded-lg text-center">
              <div className="text-xs md:text-sm text-muted-foreground">Length</div>
              <div className="font-medium text-sm md:text-base">{beat.duration}</div>
            </div>
          </div>

          <Tabs defaultValue="description" className="mb-6 md:mb-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="license">License</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4 text-sm md:text-base">
              <p>{beat.description}</p>
            </TabsContent>
            <TabsContent value="features" className="mt-4">
              <ul className="space-y-2 text-sm md:text-base">
                {beat.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Music className="h-4 w-4 mr-2 text-purple-600 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="license" className="mt-4 text-sm md:text-base">
              <p>
                This beat includes a standard license for both personal and commercial use. You may use this beat in
                your projects, including songs, videos, and performances. Credit is appreciated but not required.
              </p>
              <p className="mt-2">For extended licensing options or questions, please contact us.</p>
            </TabsContent>
          </Tabs>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <Button size="lg" className="w-full">
              <ShoppingCart className="mr-2 h-4 w-4 md:h-5 md:w-5" /> Add to Cart
            </Button>
            <Button size="lg" variant="secondary" className="w-full">
              <Download className="mr-2 h-4 w-4 md:h-5 md:w-5" /> Buy Now
            </Button>
          </div>
        </div>
      </div>

      <RelatedBeats />
    </div>
  )
}
