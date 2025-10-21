"use client"

import { useEffect, useRef } from "react"

export function PortfolioVideos() {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  useEffect(() => {
    // Attempt to play each video after mount
    videoRefs.current.forEach((vid) => {
      if (vid) {
        vid
          .play()
          .catch((err) => console.warn("Autoplay blocked:", err))
      }
    })
  }, [])

  const videos = [
    {
      title: "Worship Session Highlight",
      description: "Live worship recording session showcase",
    },
    {
      title: "Studio Tour",
      description: "Behind the scenes at Heavenly Soundscapes",
    },
    {
      title: "Production Process",
      description: "From recording to final master",
    },
    {
      title: "Client Testimonials",
      description: "Hear from our satisfied clients",
    },
  ]

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl sm:text-5xl font-bold mb-4">
            Video <span className="gold-text">Showcase</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Watch our studio in action and see the quality of our productions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {videos.map((video, index) => (
            <div
              key={index}
              className="group bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-gold transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]"
            >
              <div className="relative aspect-video bg-gray-800">
                <video
                  ref={(el) => (videoRefs.current[index] = el)}
                  src="/video1.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-primary"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <p className="text-sm text-muted-foreground">Playing Now</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-serif text-xl font-bold text-gold mb-2">
                  {video.title}
                </h3>
                <p className="text-gray-400 text-sm">{video.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
