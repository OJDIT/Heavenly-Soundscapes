import Link from "next/link"
import { Play, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const relatedBeats = [
  {
    id: "gospel-praise-2",
    title: "Glory Anthem",
    price: 32.99,
    category: "Praise",
    bpm: 110,
    duration: "4:10",
    imageUrl: "/placeholder.svg?height=400&width=400",
  },
  {
    id: "gospel-praise-3",
    title: "Hallelujah Rhythm",
    price: 27.99,
    category: "Praise",
    bpm: 118,
    duration: "3:55",
    imageUrl: "/placeholder.svg?height=400&width=400",
  },
  {
    id: "gospel-praise-4",
    title: "Blessed Harmony",
    price: 29.99,
    category: "Praise",
    bpm: 122,
    duration: "4:05",
    imageUrl: "/placeholder.svg?height=400&width=400",
  },
]

export default function RelatedBeats() {
  return (
    <section className="mt-8 md:mt-16">
      <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">You May Also Like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {relatedBeats.map((beat) => (
          <Card key={beat.id} className="overflow-hidden">
            <div className="aspect-square relative">
              <img src={beat.imageUrl || "/placeholder.svg"} alt={beat.title} className="object-cover w-full h-full" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Button size="icon" variant="secondary" className="rounded-full h-10 w-10 md:h-12 md:w-12">
                  <Play className="h-5 w-5 md:h-6 md:w-6" />
                </Button>
              </div>
            </div>
            <CardHeader className="p-3 md:p-4">
              <CardTitle className="text-base md:text-lg">{beat.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-3 md:p-4 pt-0">
              <div className="flex justify-between text-xs md:text-sm text-muted-foreground">
                <span>{beat.category}</span>
                <span>{beat.bpm} BPM</span>
                <span>{beat.duration}</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-3 md:p-4 flex-wrap gap-2">
              <div className="font-bold">${beat.price}</div>
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm" className="text-xs md:text-sm h-8">
                  <Link href={`/catalog/${beat.id}`}>Details</Link>
                </Button>
                <Button size="sm" className="text-xs md:text-sm h-8">
                  <ShoppingCart className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" /> Add to Cart
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}
