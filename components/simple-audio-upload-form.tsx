"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Music, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SimpleAudioUploadForm({ onSuccess }: { onSuccess?: () => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const formRef = useRef<HTMLFormElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Check if it's an audio file
    if (!selectedFile.type.startsWith("audio/")) {
      setError("Please select a valid audio file")
      return
    }

    setFile(selectedFile)
    setError(null)

    // Create an audio URL for preview
    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)

    // Clean up the URL when component unmounts
    return () => URL.revokeObjectURL(objectUrl)
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError("Please select an audio file")
      return
    }

    if (!title.trim()) {
      setError("Please enter a title")
      return
    }

    if (!price.trim() || isNaN(Number(price)) || Number(price) <= 0) {
      setError("Please enter a valid price")
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      // Create a data URL for the file (this will only work well for small files)
      const reader = new FileReader()
      reader.onload = async (event) => {
        try {
          const dataUrl = event.target?.result as string

          // Create a unique ID for the audio
          const audioId = `audio-${Date.now()}`

          // Create audio metadata
          const newAudio = {
            id: audioId,
            title,
            category,
            description,
            price: Number.parseFloat(price),
            filename: file.name,
            url: dataUrl,
            size: file.size,
            type: file.type,
            duration: "3:45", // In a real app, you'd calculate this
            dateAdded: new Date().toISOString(),
          }

          // Store in localStorage
          try {
            // Get existing audio content from localStorage or create empty array
            let audioContent = []
            const existingContent = localStorage.getItem("audioContent")
            if (existingContent) {
              audioContent = JSON.parse(existingContent)
            }

            // Add new audio to the content array
            audioContent.push(newAudio)

            // Save updated content to localStorage
            localStorage.setItem("audioContent", JSON.stringify(audioContent))
            console.log("Saved audio metadata to localStorage")

            setUploadSuccess(true)

            // Reset form after successful upload
            setTimeout(() => {
              setFile(null)
              setPreview(null)
              setTitle("")
              setCategory("")
              setDescription("")
              setPrice("")
              setUploadSuccess(false)
              setIsUploading(false)
              if (formRef.current) {
                formRef.current.reset()
              }
              if (onSuccess) {
                onSuccess()
              }
            }, 2000)
          } catch (storageError) {
            console.error("Failed to save to localStorage:", storageError)
            throw new Error("Failed to save audio data")
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : "An unknown error occurred")
          setIsUploading(false)
        }
      }

      reader.onerror = () => {
        setError("Failed to read file")
        setIsUploading(false)
      }

      reader.readAsDataURL(file)
    } catch (err) {
      setIsUploading(false)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      console.error("Upload error:", err)
    }
  }

  return (
    <form ref={formRef} onSubmit={handleUpload} className="space-y-4 max-w-2xl">
      <div className="bg-amber-500/10 border border-amber-500/50 text-amber-500 rounded-md p-3 text-sm mb-4">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Simple Upload Mode</p>
            <p className="mt-1">
              This form uses browser storage instead of Vercel Blob. Uploads will be stored locally in your browser.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 rounded-md p-3 text-sm">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        </div>
      )}

      {uploadSuccess && (
        <div className="bg-green-500/10 border border-green-500/50 text-green-500 rounded-md p-3 text-sm">
          Audio uploaded successfully!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Title</label>
          <Input placeholder="Enter audio title" required value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <select
            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select category</option>
            <option value="worship">Worship</option>
            <option value="gospel">Gospel</option>
            <option value="ambient">Ambient</option>
            <option value="scripture">Scripture</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Price (£)</label>
        <Input
          type="number"
          step="0.01"
          min="0.01"
          placeholder="29.99"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <textarea
          className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          placeholder="Enter audio description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Audio File</label>
        <div className="border-2 border-dashed border-gold-500/30 rounded-lg p-6 text-center hover:border-gold-500/50 transition-colors">
          <input type="file" accept="audio/*" className="hidden" id="audio-upload-simple" onChange={handleFileChange} />
          <label htmlFor="audio-upload-simple" className="cursor-pointer">
            <Music className="h-10 w-10 mx-auto text-gold-500/70 mb-2" />
            <p className="text-sm text-muted-foreground mb-1">{file ? file.name : "Click to upload audio file"}</p>
            <p className="text-xs text-muted-foreground">Supports MP3, WAV, OGG (small files recommended)</p>
          </label>
        </div>
      </div>

      {preview && (
        <div className="border border-gold-500/20 rounded-lg p-4 bg-black/40">
          <h4 className="text-sm font-medium mb-2">Audio Preview</h4>
          <audio controls className="w-full">
            <source src={preview} type={file?.type} />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          type="submit"
          disabled={!file || isUploading}
          className="bg-gold-500 hover:bg-gold-600 text-primary-foreground w-full sm:w-auto"
        >
          {isUploading ? "Uploading..." : "Upload Audio"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setFile(null)
            setPreview(null)
            setError(null)
          }}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
