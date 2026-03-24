"use client"

import type React from "react"

import { useRef, useState } from "react"
import Image from "next/image"

const studioImages = [
  { src: "https://nkfzdkepvicgpvojocrs.supabase.co/storage/v1/object/sign/pictures/studio20.jpeg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iNjk0ZGFlNS1hNTUxLTRiNjYtYjM3My1lMmE0YWQwNTAwYmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwaWN0dXJlcy9zdHVkaW8yMC5qcGVnIiwiaWF0IjoxNzc0MzI1MTk2LCJleHAiOjE5MzIwMDUxOTZ9.vxS3JouCsFyETQ8hCMVKqfIdDaAQ98MFrIJX-dsXZoE", alt: "Recording session with vocalist" },
  { src: "https://nkfzdkepvicgpvojocrs.supabase.co/storage/v1/object/sign/pictures/studio-2.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iNjk0ZGFlNS1hNTUxLTRiNjYtYjM3My1lMmE0YWQwNTAwYmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwaWN0dXJlcy9zdHVkaW8tMi5qcGciLCJpYXQiOjE3NzM1ODc0MDEsImV4cCI6MTkzMTI2NzQwMX0.yko2eKlxuxfzBuZmAi_Da7ddjCJhUodrn0XaOdMTG2M", alt: "Artist at microphone" },
  { src: "https://nkfzdkepvicgpvojocrs.supabase.co/storage/v1/object/sign/pictures/studio-3.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iNjk0ZGFlNS1hNTUxLTRiNjYtYjM3My1lMmE0YWQwNTAwYmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwaWN0dXJlcy9zdHVkaW8tMy5qcGciLCJpYXQiOjE3NzM1ODgyNDcsImV4cCI6MTkzMTI2ODI0N30.9ny70TUZe1-pDA8_oazYQLNULg1seeIY3Rhfr8nvY90", alt: "Professional mixing console" },
  { src: "https://nkfzdkepvicgpvojocrs.supabase.co/storage/v1/object/sign/pictures/studio-4.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iNjk0ZGFlNS1hNTUxLTRiNjYtYjM3My1lMmE0YWQwNTAwYmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwaWN0dXJlcy9zdHVkaW8tNC5qcGciLCJpYXQiOjE3NzM1ODgyNzcsImV4cCI6MTkzMTI2ODI3N30.anbd5jpR_V_SkazsyxhRx9xLd2y319RDj5Shm50Bwho", alt: "Studio collaboration" },
  { src: "https://nkfzdkepvicgpvojocrs.supabase.co/storage/v1/object/sign/pictures/studio-5.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iNjk0ZGFlNS1hNTUxLTRiNjYtYjM3My1lMmE0YWQwNTAwYmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwaWN0dXJlcy9zdHVkaW8tNS5qcGciLCJpYXQiOjE3NzM1ODgzMDMsImV4cCI6MTkzMTI2ODMwM30.jftHrE6apOGxJ6z-G4-lp7baptpulf0F01C4qcH8sck", alt: "Audio engineering session" },
  { src: "https://nkfzdkepvicgpvojocrs.supabase.co/storage/v1/object/sign/pictures/studio-6.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iNjk0ZGFlNS1hNTUxLTRiNjYtYjM3My1lMmE0YWQwNTAwYmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwaWN0dXJlcy9zdHVkaW8tNi5qcGciLCJpYXQiOjE3NzM1ODgzMzAsImV4cCI6MTkzMTI2ODMzMH0.92GA3eUPR83e-sRQ1Kz1Ju3ocVPT-9ABIO1Ov5YEj18", alt: "Sound engineer at work" },
  { src: "https://nkfzdkepvicgpvojocrs.supabase.co/storage/v1/object/sign/pictures/studio-7.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iNjk0ZGFlNS1hNTUxLTRiNjYtYjM3My1lMmE0YWQwNTAwYmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwaWN0dXJlcy9zdHVkaW8tNy5qcGciLCJpYXQiOjE3NzM1ODgzNTUsImV4cCI6MTkzMTI2ODM1NX0.EFIO2b4QSPjkdk5mRctniaucstjGkJfiwJn9-l0FjVk", alt: "Heavenly Soundscapes studio setup" },
  { src: "https://nkfzdkepvicgpvojocrs.supabase.co/storage/v1/object/sign/pictures/studio-8.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iNjk0ZGFlNS1hNTUxLTRiNjYtYjM3My1lMmE0YWQwNTAwYmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwaWN0dXJlcy9zdHVkaW8tOC5qcGciLCJpYXQiOjE3NzM1ODgzODIsImV4cCI6MTkzMTI2ODM4Mn0.woheNwdqt-6dbpu9KuhzDObgQpskk4u7d_EYSGf1qsg", alt: "Drum set with professional lighting" },
  { src: "https://nkfzdkepvicgpvojocrs.supabase.co/storage/v1/object/sign/pictures/studio-9.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iNjk0ZGFlNS1hNTUxLTRiNjYtYjM3My1lMmE0YWQwNTAwYmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwaWN0dXJlcy9zdHVkaW8tOS5qcGciLCJpYXQiOjE3NzM1ODg0MjMsImV4cCI6MTkzMTI2ODQyM30.djQex4YYKguMA2ydgpeDX_FOFjwkhTXnwKq-qbgQMNs", alt: "Blue-lit keyboard synthesizer" },
  { src: "https://nkfzdkepvicgpvojocrs.supabase.co/storage/v1/object/sign/pictures/studio-10.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iNjk0ZGFlNS1hNTUxLTRiNjYtYjM3My1lMmE0YWQwNTAwYmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwaWN0dXJlcy9zdHVkaW8tMTAuanBnIiwiaWF0IjoxNzczNTg4NDU1LCJleHAiOjE5MzEyNjg0NTV9.dwRT-HvhAMEZ-yrOzaTZMtA4v5VjNraLKOAFtSTtnlI", alt: "Studio lounge area" },
  { src: "https://nkfzdkepvicgpvojocrs.supabase.co/storage/v1/object/sign/pictures/studio-11.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iNjk0ZGFlNS1hNTUxLTRiNjYtYjM3My1lMmE0YWQwNTAwYmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwaWN0dXJlcy9zdHVkaW8tMTEuanBnIiwiaWF0IjoxNzczNTg4NDgxLCJleHAiOjE5MzEyNjg0ODF9.rwMy2atrdzaBtzcsLkT9e0Ux41nmJD4Q4uY-q3ayNqA", alt: "Professional keyboard and mixing equipment" },
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
