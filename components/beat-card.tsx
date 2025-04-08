import Link from "next/link"
import { Play, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import AudioPlayer from "@/components/audio-player"

interface Beat {
  id: string
  title: string
  price: number
  category: string
  bpm: number
  duration: string
  imageUrl: string
  audioUrl: string
}

interface BeatCardProps {
  beat: Beat
}

export default function BeatCard({ beat }: BeatCardProps) {
  return (
    <Card className="overflow-hidden">
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
        <div className="flex justify-between text-xs md:text-sm text-muted-foreground mb-2 md:mb-4">
          <span>{beat.category}</span>
          <span>{beat.bpm} BPM</span>
          <span>{beat.duration}</span>
        </div>
        <AudioPlayer />
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
  )
}
