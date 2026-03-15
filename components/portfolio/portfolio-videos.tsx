"use client"

import { useRef, useState } from "react"

export function PortfolioVideos() {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const [activeVideo, setActiveVideo] = useState<number | null>(null)
  const [loadedVideos, setLoadedVideos] = useState<boolean[]>([false, false, false, false])

  const videos = [
    {
      title: "Worship Session Highlight",
      description: "Live worship recording session showcase",
      src: "https://imh1nydwoiiwnh60.public.blob.vercel-storage.com/Adonai%20Cover.mp4",
    },
    {
      title: "Studio Tour",
      description: "Behind the scenes at Heavenly Soundscapes",
      src: "https://your-video-link-2-here.com/video.mp4",
    },
    {
      title: "Production Process",
      description: "From recording to final master",
      src: "https://your-video-link-3-here.com/video.mp4",
    },
    {
      title: "Client Testimonials",
      description: "Hear from our satisfied clients",
      src: "https://your-video-link-4-here.com/video.mp4",
    },
  ]

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
              className="group bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-gold transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] cursor-pointer"
              onClick={() => openFullscreen(index)}
            >
              <div className="relative aspect-video bg-gray-800">

                {/* Loading spinner shown until video is ready */}
                {!loadedVideos[index] && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="w-10 h-10 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
                  </div>
                )}

                {/* Background muted autoplay video */}
                <video
                  ref={(el) => (videoRefs.current[index] = el)}
                  src={video.src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  onCanPlay={() => handleCanPlay(index)}
                  className={`w-full h-full object-cover transition-opacity duration-500 ${
                    loadedVideos[index]
                      ? "opacity-50 group-hover:opacity-70"
                      : "opacity-0"
                  }`}
                />

                {/* Overlay with play button */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-center justify-center">
                  <div className="text-center transform group-hover:scale-110 transition-transform duration-300">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-primary/30 border border-gold/50 flex items-center justify-center backdrop-blur-sm group-hover:bg-primary/50 transition-colors duration-300">
                      <svg
                        className="w-8 h-8 text-gold ml-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <p className="text-xs text-gold/80 font-medium tracking-widest uppercase">
                      Tap to Watch
                    </p>
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
            {/* Close Button */}
            <button
              onClick={closeFullscreen}
              className="absolute -top-12 right-0 text-white/70 hover:text-white text-sm flex items-center gap-2 transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Close
            </button>

            {/* Full Video Player */}
            <div className="aspect-video rounded-lg overflow-hidden border border-gold/30 shadow-[0_0_40px_rgba(212,175,55,0.3)]">
              <video
                src={videos[activeVideo].src}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            </div>

            {/* Video Info */}
            <div className="mt-4 text-center">
              <h3 className="font-serif text-xl font-bold text-gold">
                {videos[activeVideo].title}
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                {videos[activeVideo].description}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}