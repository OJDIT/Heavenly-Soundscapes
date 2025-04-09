import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AudioPlayer from "@/components/audio-player"

export default function PortfolioPage() {
  const audioTracks = [
    {
      title: "Worshipful Presence",
      genre: "Worship",
      description: "A gentle ambient worship track with piano and soft pads.",
      url: "#",
    },
    {
      title: "Glory Anthem",
      genre: "Gospel",
      description: "Upbeat gospel track with powerful choir and organ.",
      url: "#",
    },
    {
      title: "Divine Peace",
      genre: "Ambient",
      description: "Meditative ambient soundscape with scripture inspiration.",
      url: "#",
    },
    {
      title: "Spirit of Praise",
      genre: "Gospel",
      description: "Contemporary gospel beat with energetic percussion.",
      url: "#",
    },
    {
      title: "Heavenly Meditation",
      genre: "Ambient",
      description: "Calming ambient piece for prayer and reflection.",
      url: "#",
    },
    {
      title: "Walk in Faith",
      genre: "Worship",
      description: "Modern worship track with electric guitar and synths.",
      url: "#",
    },
  ]

  const videos = [
    {
      title: "Worship Night Highlights",
      description: "Live recording from our recent worship production.",
      thumbnail: "/placeholder.svg?height=400&width=720",
      url: "#",
    },
    {
      title: "Studio Session - Gospel Choir",
      description: "Behind the scenes of our latest gospel choir recording.",
      thumbnail: "/placeholder.svg?height=400&width=720",
      url: "#",
    },
    {
      title: "Ambient Worship Visuals",
      description: "Visual elements created for ambient worship sets.",
      thumbnail: "/placeholder.svg?height=400&width=720",
      url: "#",
    },
  ]

  return (
    <div className="pt-24 pb-16">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold mb-4">
            Our <span className="gold-text">Portfolio</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Listen to samples of our work and explore our previous projects.
          </p>
        </div>

        <Tabs defaultValue="audio" className="w-full mb-16">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
            <TabsTrigger value="audio">Audio Samples</TabsTrigger>
            <TabsTrigger value="video">Video Work</TabsTrigger>
          </TabsList>

          <TabsContent value="audio">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {audioTracks.map((track, i) => (
                <div
                  key={i}
                  className="border border-gold-500/20 bg-black/40 rounded-lg p-4 hover:border-gold-500/40 transition-all"
                >
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold">{track.title}</h3>
                    <div className="text-xs font-medium text-gold-400 mb-2">{track.genre}</div>
                    <p className="text-sm text-muted-foreground mb-4">{track.description}</p>
                  </div>
                  <AudioPlayer audioUrl={track.url} title={track.title} />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="video">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video, i) => (
                <div
                  key={i}
                  className="border border-gold-500/20 bg-black/40 rounded-lg overflow-hidden hover:border-gold-500/40 transition-all"
                >
                  <div className="aspect-video relative">
                    <img
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                      <div className="h-16 w-16 rounded-full bg-gold-500/80 flex items-center justify-center">
                        <svg className="h-8 w-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-1">{video.title}</h3>
                    <p className="text-sm text-muted-foreground">{video.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="text-center max-w-2xl mx-auto py-6 border-t border-gold-500/20">
          <h2 className="text-xl md:text-2xl font-playfair font-bold mb-4">Looking for a Custom Project?</h2>
          <p className="text-muted-foreground mb-6">
            We'd love to discuss your specific needs and create something uniquely tailored to your vision.
          </p>
          <Button asChild className="bg-gold-500 hover:bg-gold-600 text-primary-foreground">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
