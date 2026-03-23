"use client"

import { useRef, useState } from "react"

const portfolioItems = [
  { src: "https://nkfzdkepvicgpvojocrs.supabase.co/storage/v1/object/public/video-files/videos/Hsp%20V2.mp4" },
  { src: "https://nkfzdkepvicgpvojocrs.supabase.co/storage/v1/object/public/video-files/videos/Ven%20Ven%20Yt.mp4" },
  { src: "https://nkfzdkepvicgpvojocrs.supabase.co/storage/v1/object/public/video-files/videos/C0051.mp4" },
  { src: "https://nkfzdkepvicgpvojocrs.supabase.co/storage/v1/object/public/video-files/videos/C0073.mp4" },
  { src: "https://your-video-link-5-here.com/video.mp4" },
  { src: "https://your-video-link-6-here.com/video.mp4" },
]

export function PortfolioGrid() {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const [activeVideo, setActiveVideo] = useState<number | null>(null)
  const [loadedVideos, setLoadedVideos] = useState<boolean[]>(
    new Array(portfolioItems.length).fill(false)
  )

  const handleCanPlay = (index: number) => {
    const vid = videoRefs.current[index]
    if (vid) {
      vid.play().catch((err) => console.warn("Autoplay blocked:", err))
      setLoadedVideos((prev) => {
        const updated = [...prev]
        updated[index] = true
        return updated
      })
    }
  }

  const openFullscreen = (index: number) => {
    setActiveVideo(index)
    document.body.style.overflow = "hidden"
  }

  const closeFullscreen = () => {
    setActiveVideo(null)
    document.body.style.overflow = ""
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioItems.map((item, index) => (
            <div
              key={index}
              onClick={() => openFullscreen(index)}
              className="group relative bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-gold transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] cursor-pointer h-64"
            >
              {/* Loading spinner */}
              {!loadedVideos[index] && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
                </div>
              )}

              {/* Background muted autoplay video */}
              <video
                ref={(el) => (videoRefs.current[index] = el)}
                src={item.src}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                onCanPlay={() => handleCanPlay(index)}
                className={`w-full h-full object-cover group-hover:scale-110 transition-all duration-500 ${
                  loadedVideos[index] ? "opacity-60 group-hover:opacity-80" : "opacity-0"
                }`}
              />

              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="transform group-hover:scale-110 transition-transform duration-300">
                  <div className="w-12 h-12 rounded-full bg-primary/30 border border-gold/50 flex items-center justify-center backdrop-blur-sm group-hover:bg-primary/50 transition-colors duration-300">
                    <svg className="w-6 h-6 text-gold ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Modal */}
      {activeVideo !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={closeFullscreen}
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeFullscreen}
              className="absolute -top-12 right-0 text-white/70 hover:text-white text-sm flex items-center gap-2 transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Close
            </button>

            <div className="aspect-video rounded-lg overflow-hidden border border-gold/30 shadow-[0_0_40px_rgba(212,175,55,0.3)]">
              <video
                src={portfolioItems[activeVideo].src}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}