"use client"

import type React from "react"

import { useRef, useState } from "react"
import Image from "next/image"

const studioImages = [
  { src: "/images/studio-1.jpg", alt: "Recording session with vocalist" },
  { src: "/images/studio-2.jpg", alt: "Artist at microphone" },
  { src: "/images/studio-3.jpg", alt: "Professional mixing console" },
  { src: "/images/studio-4.jpg", alt: "Studio collaboration" },
  { src: "/images/studio-5.jpg", alt: "Audio engineering session" },
  { src: "/images/studio-6.jpg", alt: "Sound engineer at work" },
  { src: "/images/studio-7.jpg", alt: "Heavenly Soundscapes studio setup" },
  { src: "/images/studio-8.jpg", alt: "Drum set with professional lighting" },
  { src: "/images/studio-9.jpg", alt: "Blue-lit keyboard synthesizer" },
  { src: "/images/studio-10.jpg", alt: "Studio lounge area" },
  { src: "/images/studio-11.jpg", alt: "Professional keyboard and mixing equipment" },
  { src: "/images/studio-12.jpg", alt: "Wide studio view with equipment" },
]

export function StudioGallery() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0))
    setScrollLeft(scrollRef.current?.scrollLeft || 0)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0)
    const walk = (x - startX) * 2
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeft - walk
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  return (
    <section className="py-20 bg-card/50">
      <div className="container mx-auto px-4 lg:px-8 mb-12">
        <h2 className="font-serif text-4xl sm:text-5xl font-bold text-center mb-4">
          Our <span className="gold-text">Studio</span>
        </h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto">
          State-of-the-art equipment and acoustically treated spaces designed for perfection
        </p>
      </div>

      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className="flex gap-6 overflow-x-auto px-4 cursor-grab active:cursor-grabbing scrollbar-hide"
        style={{ scrollBehavior: isDragging ? "auto" : "smooth" }}
      >
        {studioImages.map((image, index) => (
          <div key={index} className="relative flex-shrink-0 w-[400px] h-[300px] rounded-lg overflow-hidden group">
            <Image
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110 pointer-events-none"
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ))}
      </div>
    </section>
  )
}
