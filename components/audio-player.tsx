"use client"

import { useState, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface AudioPlayerProps {
  audioUrl: string
  title?: string
}

export default function AudioPlayer({ audioUrl, title }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)
  const [loadAttempts, setLoadAttempts] = useState(0)

  // Create audio element on mount
  useEffect(() => {
    if (!audioUrl || audioUrl === "#") {
      setError("No audio source available")
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    // Create a new audio element
    const audio = new Audio()

    // Add crossOrigin attribute to avoid CORS issues on mobile
    audio.crossOrigin = "anonymous"

    // Set preload attribute to help with mobile loading
    audio.preload = "metadata"

    // Set the source after adding event listeners
    audio.src = audioUrl

    setAudioElement(audio)

    // Clean up function
    return () => {
      if (audio) {
        audio.pause()
        audio.src = ""
      }
    }
  }, [audioUrl])

  // Set up event listeners when audio element changes
  useEffect(() => {
    if (!audioElement) return

    const handleCanPlay = () => {
      setIsLoading(false)
      setDuration(audioElement.duration || 0)
    }

    const handleLoadError = (e: ErrorEvent) => {
      console.error("Audio loading error:", e)
      setIsLoading(false)

      // Try to provide more specific error messages
      if (e.message.includes("CORS")) {
        setError("Cross-origin error. Audio may not be accessible.")
      } else if (e.message.includes("network")) {
        setError("Network error. Check your connection.")
      } else {
        setError("Failed to load audio")
      }

      // If we've tried less than 3 times, try again with a different approach
      if (loadAttempts < 3) {
        setLoadAttempts((prev) => prev + 1)

        // Try with a different preload strategy
        audioElement.preload = loadAttempts === 1 ? "auto" : "none"

        // Small timeout before retrying
        setTimeout(() => {
          audioElement.load()
        }, 1000)
      }
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audioElement.currentTime)
      setProgress((audioElement.currentTime / (audioElement.duration || 1)) * 100)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setProgress(0)
      setCurrentTime(0)
    }

    // Add event listeners
    audioElement.addEventListener("canplay", handleCanPlay)
    audioElement.addEventListener("error", handleLoadError as EventListener)
    audioElement.addEventListener("timeupdate", handleTimeUpdate)
    audioElement.addEventListener("ended", handleEnded)

    // Try to load the audio
    audioElement.load()

    // Clean up function
    return () => {
      audioElement.removeEventListener("canplay", handleCanPlay)
      audioElement.removeEventListener("error", handleLoadError as EventListener)
      audioElement.removeEventListener("timeupdate", handleTimeUpdate)
      audioElement.removeEventListener("ended", handleEnded)
    }
  }, [audioElement, loadAttempts])

  const togglePlay = () => {
    if (!audioElement || error) return

    if (isPlaying) {
      audioElement.pause()
    } else {
      // Use a promise with catch for better error handling
      const playPromise = audioElement.play()

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Playback started successfully
          })
          .catch((err) => {
            console.error("Error playing audio:", err)

            // Handle autoplay restrictions
            if (err.name === "NotAllowedError") {
              setError("Playback was blocked. Tap to play manually.")
            } else {
              setError("Failed to play audio")
            }
          })
      }
    }

    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    if (audioElement) {
      audioElement.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleSeek = (value: number[]) => {
    const newTime = (value[0] / 100) * (duration || 0)
    if (audioElement) {
      audioElement.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  // Format time (seconds) to MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  if (error) {
    return (
      <div className="audio-player flex items-center gap-2 bg-red-500/10 p-2 rounded">
        <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
        <div className="flex-1 text-xs text-red-400 px-2">{error}</div>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
          onClick={() => {
            if (audioElement) {
              audioElement.load()
              setError(null)
              setIsLoading(true)
            }
          }}
        >
          Retry
        </Button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="audio-player flex items-center justify-center gap-2 py-3">
        <div className="h-4 w-4 rounded-full border-2 border-gold-500 border-t-transparent animate-spin"></div>
        <span className="text-xs text-muted-foreground">Loading audio...</span>
      </div>
    )
  }

  return (
    <div className="audio-player flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full hover:bg-gold-500/20 text-gold-500 flex-shrink-0"
        onClick={togglePlay}
      >
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>

      <div className="flex-1 flex flex-col min-w-0">
        {title && <span className="text-xs mb-1 text-gold-400 truncate">{title}</span>}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground w-10 flex-shrink-0">{formatTime(currentTime)}</span>
          <div className="audio-player-progress flex-1">
            <Slider value={[progress]} max={100} step={0.1} onValueChange={handleSeek} className="w-full h-1" />
          </div>
          <span className="text-xs text-muted-foreground w-10 flex-shrink-0">{formatTime(duration)}</span>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 hover:bg-gold-500/20 text-gold-500 flex-shrink-0 hidden sm:flex"
        onClick={toggleMute}
      >
        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </Button>
    </div>
  )
}
