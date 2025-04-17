"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Music, AlertCircle, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { uploadFileToSupabase, ensureBucketExists } from "@/lib/supabase"
import { createServerSupabaseClient } from "@/lib/supabase"

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
      const supabase = createServerSupabaseClient()

      if (!supabase) {
        throw new Error("Supabase client could not be initialized")
      }

      const { data: testData, error: testError } = await supabase.rpc('test_authorization_header')
      console.log(`The user role is ${testData.role} and the user UUID is ${testData.sub}. `, testError)
      
      // Ensure the audio-files bucket exists
      const bucketExists = await ensureBucketExists("audio-files")
      if (!bucketExists) {
        throw new Error("Failed to initialize storage bucket")
      }

      // Create a unique file path
      const timestamp = Date.now()
      const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
      const filePath = `${timestamp}-${safeFileName}`

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await uploadFileToSupabase(
        file,
        "audio-files", 
        filePath
      )

      if (uploadError || !uploadData) {
        throw new Error(uploadError?.message || "File upload failed")
      }

      // Save metadata to Supabase database
      const response = await fetch("/api/content/audio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          category,
          description,
          price: Number.parseFloat(price),
          filename: file.name,
          url: uploadData.url,
          path: uploadData.path,
          size: file.size,
          type: file.type,
          duration: "3:45", // In a real app, you'd calculate this
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save audio metadata")
      }

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
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      setIsUploading(false)
      console.error("Upload error:", err)
    }
  }

  return (
    <form ref={formRef} onSubmit={handleUpload} className="space-y-4 max-w-2xl">
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 rounded-md p-3 text-sm">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        </div>
      )}

      {uploadSuccess && (
        <div className="bg-green-500/10 border border-green-500/50 text-green-500 rounded-md p-3 text-sm flex items-start gap-2">
          <Check className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <p>Audio uploaded successfully!</p>
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
