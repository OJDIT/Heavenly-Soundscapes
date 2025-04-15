"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Film, Plus, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { uploadFileToSupabase } from "@/lib/supabase"
import { upload } from "@vercel/blob/client"

// Size thresholds
const SUPABASE_MAX_SIZE = 50 * 1024 * 1024 // 50MB
const BLOB_MAX_SIZE = 500 * 1024 * 1024 // 500MB

export default function VideoUploadForm({ onSuccess }: { onSuccess?: () => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
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
  const [storageMethod, setStorageMethod] = useState<"supabase" | "blob" | null>(null)

  const formRef = useRef<HTMLFormElement>(null)

  // Check if the bucket exists when the component mounts
  useEffect(() => {
    const checkBucket = async () => {
      setIsCheckingBucket(true)
      try {
        // Initialize the storage buckets
        const response = await fetch("/api/init-storage")
        const data = await response.json()

        if (data.success) {
          console.log("Storage buckets initialized:", data.results)
          setBucketReady(true)
        } else {
          console.error("Failed to initialize storage buckets:", data.error)
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

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Check if it's a video file
    if (!selectedFile.type.startsWith("video/")) {
      setError("Please select a valid video file")
      return
    }

    // Determine storage method based on file size
    if (selectedFile.size > BLOB_MAX_SIZE) {
      setError(`File is too large. Maximum size is ${BLOB_MAX_SIZE / (1024 * 1024)}MB`)
      return
    } else if (selectedFile.size > SUPABASE_MAX_SIZE) {
      setStorageMethod("blob")
    } else {
      setStorageMethod("supabase")
    }

    setFile(selectedFile)
    setError(null)
    setDetailedError(null)

    // Create a video URL for preview
    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)

    // Clean up the URL when component unmounts
    return () => URL.revokeObjectURL(objectUrl)
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Check if it's an image file
    if (!selectedFile.type.startsWith("image/")) {
      setError("Please select a valid image file for the thumbnail")
      return
    }

    // Check file size - limit to 5MB
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError(`Thumbnail is too large. Maximum size is 5MB`)
      return
    }

    setThumbnail(selectedFile)
    setError(null)
    setDetailedError(null)

    // Create an image URL for preview
    const objectUrl = URL.createObjectURL(selectedFile)
    setThumbnailPreview(objectUrl)

    // Clean up the URL when component unmounts
    return () => URL.revokeObjectURL(objectUrl)
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError("Please select a video file")
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

      // Create unique filenames
      const videoFilename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`
      let videoUrl = ""
      let videoPath = ""
      let thumbnailUrl = null

      // Upload video based on selected storage method
      if (storageMethod === "blob" || file.size > SUPABASE_MAX_SIZE) {
        // Use Vercel Blob for large files
        setUploadProgress(20)
        console.log("Uploading large video to Vercel Blob...")

        // Prepare metadata
        const metadata = JSON.stringify({
          title,
          category,
          description,
          price,
        })

        // Upload to Vercel Blob
        const blob = await upload(`videos/${videoFilename}`, file, {
          access: "public",
          handleUploadUrl: "/api/upload/get-upload-token",
          clientPayload: metadata,
        })

        videoUrl = blob.url
        videoPath = blob.pathname
        console.log("Video uploaded to Vercel Blob:", videoUrl)
      } else {
        // Use Supabase for smaller files
        setUploadProgress(20)
        console.log("Uploading video to Supabase...")

        videoPath = `videos/${videoFilename}`
        const { data, error } = await uploadFileToSupabase(file, "video-files", videoPath)

        if (error) throw error

        videoUrl = data?.url || ""
        console.log("Video uploaded to Supabase:", videoUrl)
      }

      setUploadProgress(70)

      // Upload thumbnail if provided (always to Supabase since it's small)
      if (thumbnail) {
        const thumbnailFilename = `${Date.now()}-${thumbnail.name.replace(/\s+/g, "-")}`
        const thumbnailPath = `thumbnails/${thumbnailFilename}`

        const { data: thumbnailData, error: thumbnailError } = await uploadFileToSupabase(
          thumbnail,
          "video-files",
          thumbnailPath,
        )

        if (thumbnailError) throw thumbnailError

        thumbnailUrl = thumbnailData?.url || null
      }

      setUploadProgress(90)

      // Create a unique ID for the video
      const videoId = `video-${Date.now()}`

      // Create video metadata
      const newVideo = {
        id: videoId,
        title,
        category,
        description,
        price: Number.parseFloat(price),
        filename: file.name,
        url: videoUrl,
        path: videoPath,
        storageType: storageMethod || "supabase", // Track where it's stored
        thumbnailUrl,
        size: file.size,
        type: file.type,
        duration: "5:30", // In a real app, you'd calculate this
        dateAdded: new Date().toISOString(),
      }

      // Save to localStorage as a fallback
      try {
        const existingContent = localStorage.getItem("videoContent")
        const videoContent = existingContent ? JSON.parse(existingContent) : []
        videoContent.push(newVideo)
        localStorage.setItem("videoContent", JSON.stringify(videoContent))
      } catch (storageError) {
        console.error("Failed to save to localStorage:", storageError)
      }

      setUploadProgress(100)
      setUploadSuccess(true)

      // Reset form after successful upload
      setTimeout(() => {
        setFile(null)
        setPreview(null)
        setThumbnail(null)
        setThumbnailPreview(null)
        setTitle("")
        setCategory("")
        setDescription("")
        setPrice("")
        setUploadProgress(0)
        setUploadSuccess(false)
        setIsUploading(false)
        setStorageMethod(null)
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
                    const response = await fetch("/api/init-storage")
                    const data = await response.json()
                    if (data.success) {
                      setBucketReady(true)
                    }
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
          Video uploaded successfully!
        </div>
      )}

      {file && storageMethod && (
        <div className="bg-blue-500/10 border border-blue-500/50 text-blue-500 rounded-md p-3 text-sm">
          <div className="flex items-start gap-2">
            <Film className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">
                Using {storageMethod === "blob" ? "Vercel Blob" : "Supabase"} for this upload
              </p>
              <p className="mt-1 text-xs">
                {storageMethod === "blob"
                  ? "This file is larger than 50MB and will be stored in Vercel Blob."
                  : "This file is smaller than 50MB and will be stored in Supabase."}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Title</label>
          <Input placeholder="Enter video title" required value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <select
            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select category</option>
            <option value="live-event">Live Event</option>
            <option value="behind-scenes">Behind the Scenes</option>
            <option value="tutorial">Tutorial</option>
            <option value="testimony">Testimony</option>
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
          placeholder="Enter video description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Video File</label>
          <div className="border-2 border-dashed border-gold-500/30 rounded-lg p-6 text-center hover:border-gold-500/50 transition-colors">
            <input type="file" accept="video/*" className="hidden" id="video-upload" onChange={handleVideoChange} />
            <label htmlFor="video-upload" className="cursor-pointer">
              <Film className="h-10 w-10 mx-auto text-gold-500/70 mb-2" />
              <p className="text-sm text-muted-foreground mb-1">{file ? file.name : "Click to upload video file"}</p>
              <p className="text-xs text-muted-foreground">
                Supports MP4, MOV, WebM (up to {BLOB_MAX_SIZE / (1024 * 1024)}MB)
              </p>
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Thumbnail Image (Optional)</label>
          <div className="border-2 border-dashed border-gold-500/30 rounded-lg p-6 text-center hover:border-gold-500/50 transition-colors">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="thumbnail-upload"
              onChange={handleThumbnailChange}
            />
            <label htmlFor="thumbnail-upload" className="cursor-pointer">
              {thumbnailPreview ? (
                <img
                  src={thumbnailPreview || "/placeholder.svg"}
                  alt="Thumbnail preview"
                  className="h-20 mx-auto object-cover mb-2 rounded"
                />
              ) : (
                <div className="h-20 w-20 mx-auto bg-gold-500/10 rounded flex items-center justify-center mb-2">
                  <Plus className="h-8 w-8 text-gold-500/50" />
                </div>
              )}
              <p className="text-sm text-muted-foreground mb-1">
                {thumbnail ? thumbnail.name : "Click to upload thumbnail"}
              </p>
              <p className="text-xs text-muted-foreground">JPG, PNG, WebP (max 5MB)</p>
            </label>
          </div>
        </div>
      </div>

      {preview && (
        <div className="border border-gold-500/20 rounded-lg p-4 bg-black/40">
          <h4 className="text-sm font-medium mb-2">Video Preview</h4>
          <video controls className="w-full max-h-[300px]">
            <source src={preview} type={file?.type} />
            Your browser does not support the video element.
          </video>
        </div>
      )}

      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Uploading to {storageMethod === "blob" ? "Vercel Blob" : "Supabase"}...</span>
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
          {isUploading ? "Uploading..." : "Upload Video"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setFile(null)
            setPreview(null)
            setThumbnail(null)
            setThumbnailPreview(null)
            setError(null)
            setDetailedError(null)
            setStorageMethod(null)
          }}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
