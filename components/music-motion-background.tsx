"use client"

import { useEffect, useRef } from "react"

interface MusicMotionBackgroundProps {
  className?: string
}

export default function MusicMotionBackground({ className = "" }: MusicMotionBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions to match window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    // Initial resize
    resizeCanvas()

    // Resize on window size change
    window.addEventListener("resize", resizeCanvas)

    // Waveform parameters
    const waveforms = [
      { amplitude: 15, frequency: 0.02, speed: 0.04, color: "rgba(247, 196, 20, 0.2)", phase: 0 },
      { amplitude: 20, frequency: 0.01, speed: 0.02, color: "rgba(247, 196, 20, 0.15)", phase: 2 },
      { amplitude: 10, frequency: 0.03, speed: 0.03, color: "rgba(128, 90, 213, 0.2)", phase: 4 },
      { amplitude: 25, frequency: 0.007, speed: 0.01, color: "rgba(128, 90, 213, 0.1)", phase: 6 },
    ]

    // Particles for musical notes effect
    const particles: {
      x: number
      y: number
      size: number
      speed: number
      opacity: number
      color: string
    }[] = []

    // Create initial particles
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random() * 0.5 + 0.1,
        color: Math.random() > 0.5 ? "rgba(247, 196, 20, 0.6)" : "rgba(128, 90, 213, 0.6)",
      })
    }

    // Animation function
    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, "rgba(0, 0, 0, 1)")
      gradient.addColorStop(0.5, "rgba(20, 10, 40, 1)")
      gradient.addColorStop(1, "rgba(0, 0, 0, 1)")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw waveforms
      waveforms.forEach((wave) => {
        wave.phase += wave.speed

        ctx.beginPath()
        ctx.moveTo(0, canvas.height / 2)

        for (let x = 0; x < canvas.width; x += 5) {
          const y =
            canvas.height / 2 +
            Math.sin(x * wave.frequency + wave.phase) * wave.amplitude * (1 + 0.2 * Math.sin(time / 1000))

          ctx.lineTo(x, y)
        }

        ctx.strokeStyle = wave.color
        ctx.lineWidth = 2
        ctx.stroke()
      })

      // Draw and update particles
      particles.forEach((particle, index) => {
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color.replace("0.6", particle.opacity.toString())
        ctx.fill()

        // Move particles upward
        particle.y -= particle.speed
        particle.opacity -= 0.002

        // Reset particles that go off screen or become too transparent
        if (particle.y < -10 || particle.opacity <= 0) {
          particles[index] = {
            x: Math.random() * canvas.width,
            y: canvas.height + 10,
            size: Math.random() * 3 + 1,
            speed: Math.random() * 0.5 + 0.1,
            opacity: Math.random() * 0.5 + 0.3,
            color: Math.random() > 0.5 ? "rgba(247, 196, 20, 0.6)" : "rgba(128, 90, 213, 0.6)",
          }
        }
      })

      // Continue animation
      animationRef.current = requestAnimationFrame(animate)
    }

    // Start animation
    animationRef.current = requestAnimationFrame(animate)

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationRef.current)
    }
  }, [])

  return <canvas ref={canvasRef} className={`absolute inset-0 z-0 ${className}`} style={{ pointerEvents: "none" }} />
}
