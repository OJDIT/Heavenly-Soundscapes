"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Music, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { uploadToSupabase, ensureSupabaseBucket } from "@/lib/supabase-client"
import { upload } from "@vercel/blob/client"

// Size thresholds
const SUPABASE_MAX_SIZE = 50 * 1024 * 1024 // 50MB - Supabase free tier limit
const BLOB_MAX_SIZE = 500 * 1024 * 1024 // 500MB - Vercel Blob limit

export default function AudioUploadForm({ onSuccess }: { onSuccess?: () => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [detailedError, setDetailedError] = useState<string | null>(null)
  const [isBucketReady, setBucketReady] = useState(false)
  const [isCheckingBucket, setIsCheckingBucket] = useState(true)

  const formRef = useRef<HTMLFormElement>(null)

  // Check if the bucket exists when the component mounts
  useEffect(() => {
    const checkBucket = async () => {
      setIsCheckingBucket(true)
      try {
        // Initialize the storage buckets
        const bucketReady = await ensureSupabaseBucket("audio-files")
        setBucketReady(bucketReady)

        if (!bucketReady) {
          setError("Storage system is not ready. Please try again later.")
        }
      } catch (err) {
        console.error("Error checking storage buckets:", err)
        setError("Could not connect to storage system. Please try again later.")
      } finally {
        setIsCheckingBucket(false)
      }
    }

    checkBucket()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Check if it's an audio file
    if (!selectedFile.type.startsWith("audio/")) {
      setError("Please select a valid audio file")
      return
    }

    // Check file size
    if (selectedFile.size > BLOB_MAX_SIZE) {
      setError(`File is too large. Maximum size is ${BLOB_MAX_SIZE / (1024 * 1024)}MB`)
      return
    }

    setFile(selectedFile)
    setError(null)
    setDetailedError(null)

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
    setDetailedError(null)
    setUploadProgress(0)

    try {
      setUploadProgress(10) // Show initial progress

      // Create a unique filename
      const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`
      let fileUrl = ""

      // Choose upload method based on file size
      if (file.size <= SUPABASE_MAX_SIZE) {
        // Use Supabase for files under 50MB
        setUploadProgress(20)
        console.log("Uploading directly to Supabase...")

        const filePath = `audio/${filename}`
        const { url, error } = await uploadToSupabase(file, "audio-files", filePath)

        if (error) throw error

        fileUrl = url
        console.log("File uploaded to Supabase:", fileUrl)
        setUploadProgress(80)
      } else {
        // Use Vercel Blob for larger files
        setUploadProgress(20)
        console.log("File too large for Supabase, using Vercel Blob...")

        // Prepare metadata
        const metadata = JSON.stringify({
          title,
          category,
          description,
          price,
        })

        // Upload directly to Vercel Blob
        const blob = await upload(`audio/${filename}`, file, {
          access: "public",
          handleUploadUrl: "/api/upload/get-upload-token",
          clientPayload: metadata,
        })

        fileUrl = blob.url
        console.log("File uploaded to Vercel Blob:", fileUrl)
        setUploadProgress(80)
      }

      // Create audio metadata
      const audioId = `audio-${Date.now()}`
      const newAudio = {
        id: audioId,
        title,
        category,
        description,
        price: Number.parseFloat(price),
        filename: file.name,
        url: fileUrl,
        size: file.size,
        type: file.type,
        duration: "3:45", // In a real app, you'd calculate this
        dateAdded: new Date().toISOString(),
        storageType: file.size <= SUPABASE_MAX_SIZE ? "supabase" : "blob",
      }

      // Save to localStorage
      try {
        const existingContent = localStorage.getItem("audioContent")
        const audioContent = existingContent ? JSON.parse(existingContent) : []
        audioContent.push(newAudio)
        localStorage.setItem("audioContent", JSON.stringify(audioContent))
      } catch (storageError) {
        console.error("Failed to save to localStorage:", storageError)
      }

      setUploadProgress(100)
      setUploadSuccess(true)

      // Reset form after successful upload
      setTimeout(() => {
        setFile(null)
        setPreview(null)
        setTitle("")
        setCategory("")
        setDescription("")
        setPrice("")
        setUploadProgress(0)
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
      setIsUploading(false)
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      setError("Upload failed. Please try again.")
      setDetailedError(errorMessage)
      console.error("Upload error:", err)
    }
  }

  if (isCheckingBucket) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-gold-500 border-r-transparent"></div>
        <p className="ml-3 text-muted-foreground">Initializing storage system...</p>
      </div>
    )
  }

  return (
    <form ref={formRef} onSubmit={handleUpload} className="space-y-4 max-w-2xl">
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 rounded-md p-3 text-sm">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p>{error}</p>
              {detailedError && (
                <details className="mt-2 text-xs opacity-80">
                  <summary>Technical details</summary>
                  <p className="mt-1">{detailedError}</p>
                </details>
              )}
            </div>
          </div>
        </div>
      )}

      {!isBucketReady && !isCheckingBucket && (
        <div className="bg-amber-500/10 border border-amber-500/50 text-amber-500 rounded-md p-3 text-sm mb-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p>Storage system is not ready. Uploads may fail.</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={async () => {
                  setIsCheckingBucket(true)
                  try {
                    const bucketReady = await ensureSupabaseBucket("audio-files")
                    setBucketReady(bucketReady)
                  } catch (err) {
                    console.error("Error initializing storage:", err)
                  } finally {
                    setIsCheckingBucket(false)
                  }
                }}
              >
                Retry Initialization
              </Button>
            </div>
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
          <input type="file" accept="audio/*" className="hidden" id="audio-upload" onChange={handleFileChange} />
          <label htmlFor="audio-upload" className="cursor-pointer">
            <Music className="h-10 w-10 mx-auto text-gold-500/70 mb-2" />
            <p className="text-sm text-muted-foreground mb-1">{file ? file.name : "Click to upload audio file"}</p>
            <p className="text-xs text-muted-foreground">
              {file && file.size > SUPABASE_MAX_SIZE
                ? "File will be uploaded to Vercel Blob (>50MB)"
                : "File will be uploaded to Supabase (≤50MB)"}
            </p>
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

      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Uploading to {file && file.size > SUPABASE_MAX_SIZE ? "Vercel Blob" : "Supabase"}...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="h-2 bg-gold-500/20 rounded-lg overflow-hidden">
            <div
              className="h-full bg-gold-500 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          type="submit"
          disabled={!file || isUploading || isCheckingBucket}
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
            setDetailedError(null)
          }}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
