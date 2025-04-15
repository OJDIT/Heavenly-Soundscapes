"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Music, AlertCircle, UploadIcon, LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Maximum file size for Supabase (50MB - Free tier limit)
const SUPABASE_MAX_SIZE = 50 * 1024 * 1024 // 50MB
// Maximum file size for Vercel Blob
const BLOB_MAX_SIZE = 500 * 1024 * 1024 // 500MB

export default function LargeFileUploadForm({ onSuccess }: { onSuccess?: () => void }) {
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
  const [useUrlUpload, setUseUrlUpload] = useState(false)
  const [audioUrl, setAudioUrl] = useState("")
  const [storageMethod, setStorageMethod] = useState<"supabase" | "blob" | null>(null)

  const formRef = useRef<HTMLFormElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Check if it's an audio file
    if (!selectedFile.type.startsWith("audio/")) {
      setError("Please select a valid audio file")
      return
    }

    // Determine storage method based on file size
    if (selectedFile.size > BLOB_MAX_SIZE) {
      setError(`File is too large. Maximum size is ${BLOB_MAX_SIZE / (1024 * 1024)}MB`)
      return
    } else if (selectedFile.size > SUPABASE_MAX_SIZE) {
      setStorageMethod("blob")
      setUseUrlUpload(false)
    } else {
      setStorageMethod("supabase")
      setUseUrlUpload(false)
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

  const handleUrlUpload = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!audioUrl) {
      setError("Please enter a valid audio URL")
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
    setUploadProgress(50)

    try {
      // Create a unique ID for the audio
      const audioId = `audio-${Date.now()}`

      // Extract filename from URL
      const urlParts = audioUrl.split("/")
      const filename = urlParts[urlParts.length - 1] || `audio-${Date.now()}.mp3`

      // Create audio metadata
      const newAudio = {
        id: audioId,
        title,
        category,
        description,
        price: Number.parseFloat(price),
        filename,
        url: audioUrl,
        storageType: "external", // Mark this as an external URL
        size: 0, // Unknown size for external URLs
        type: "audio/mpeg", // Assume MP3 for external URLs
        duration: "3:45", // In a real app, you'd calculate this
        dateAdded: new Date().toISOString(),
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
        setAudioUrl("")
        setUploadProgress(0)
        setUploadSuccess(false)
        setIsUploading(false)
        setUseUrlUpload(false)
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

  const handleDirectUpload = async (e: React.FormEvent) => {
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
    setUploadProgress(10)

    try {
      // Create a FormData object
      const formData = new FormData()
      formData.append("file", file)
      formData.append("title", title)
      formData.append("category", category)
      formData.append("description", description)
      formData.append("price", price)

      // Add storage method to the form data
      formData.append("storageMethod", storageMethod || "supabase")

      setUploadProgress(20)

      // Determine which API endpoint to use based on file size
      let uploadUrl = "/api/upload"
      if (storageMethod === "blob" || file.size > SUPABASE_MAX_SIZE) {
        uploadUrl = "/api/upload/blob"
      }

      // Use a direct fetch to the appropriate API route
      const uploadResponse = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      })

      setUploadProgress(80)

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text()
        throw new Error(`Upload failed: ${uploadResponse.status} ${uploadResponse.statusText} - ${errorText}`)
      }

      const uploadResult = await uploadResponse.json()

      if (!uploadResult.success) {
        throw new Error(uploadResult.error || "Upload failed")
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

  return (
    <form ref={formRef} onSubmit={useUrlUpload ? handleUrlUpload : handleDirectUpload} className="space-y-4 max-w-2xl">
      <div className="bg-green-500/10 border border-green-500/50 text-green-500 rounded-md p-3 text-sm mb-4">
        <div className="flex items-start gap-2">
          <UploadIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Large File Upload Mode</p>
            <p className="mt-1">
              {useUrlUpload
                ? "For very large files, please provide a direct URL to your audio file."
                : storageMethod === "blob"
                  ? "This file is larger than 50MB and will be stored in Vercel Blob."
                  : "This file is smaller than 50MB and will be stored in Supabase."}
            </p>
          </div>
        </div>
      </div>

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

      {uploadSuccess && (
        <div className="bg-green-500/10 border border-green-500/50 text-green-500 rounded-md p-3 text-sm">
          Audio uploaded successfully!
        </div>
      )}

      {file && storageMethod && (
        <div className="bg-blue-500/10 border border-blue-500/50 text-blue-500 rounded-md p-3 text-sm">
          <div className="flex items-start gap-2">
            <Music className="h-5 w-5 flex-shrink-0 mt-0.5" />
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

      <div className="flex justify-between items-center">
        <label className="text-sm font-medium">Upload Method</label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={useUrlUpload ? "outline" : "default"}
            size="sm"
            onClick={() => setUseUrlUpload(false)}
          >
            <Music className="h-4 w-4 mr-2" />
            File Upload
          </Button>
          <Button
            type="button"
            variant={useUrlUpload ? "default" : "outline"}
            size="sm"
            onClick={() => setUseUrlUpload(true)}
          >
            <LinkIcon className="h-4 w-4 mr-2" />
            URL Upload
          </Button>
        </div>
      </div>

      {useUrlUpload ? (
        <div className="space-y-2">
          <label className="text-sm font-medium">Audio URL</label>
          <Input
            type="url"
            placeholder="https://example.com/your-audio-file.mp3"
            value={audioUrl}
            onChange={(e) => setAudioUrl(e.target.value)}
            className="w-full"
            required
          />
          <p className="text-xs text-muted-foreground">
            Enter a direct URL to your audio file. The URL must be publicly accessible.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <label className="text-sm font-medium">Audio File</label>
          <div className="border-2 border-dashed border-gold-500/30 rounded-lg p-6 text-center hover:border-gold-500/50 transition-colors">
            <input type="file" accept="audio/*" className="hidden" id="large-file-upload" onChange={handleFileChange} />
            <label htmlFor="large-file-upload" className="cursor-pointer">
              <Music className="h-10 w-10 mx-auto text-gold-500/70 mb-2" />
              <p className="text-sm text-muted-foreground mb-1">{file ? file.name : "Click to upload audio file"}</p>
              <p className="text-xs text-muted-foreground">
                Files up to 50MB will use Supabase, 50MB-500MB will use Vercel Blob
              </p>
            </label>
          </div>
        </div>
      )}

      {preview && !useUrlUpload && (
        <div className="border border-gold-500/20 rounded-lg p-4 bg-black/40">
          <h4 className="text-sm font-medium mb-2">Audio Preview</h4>
          <audio controls className="w-full">
            <source src={preview} type={file?.type} />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      {audioUrl && useUrlUpload && (
        <div className="border border-gold-500/20 rounded-lg p-4 bg-black/40">
          <h4 className="text-sm font-medium mb-2">Audio URL Preview</h4>
          <audio controls className="w-full">
            <source src={audioUrl} />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Uploading to {storageMethod === "blob" ? "Vercel Blob" : "Supabase"}...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="h-2 bg-gold-500/20 rounded-full overflow-hidden">
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
          disabled={(!file && !useUrlUpload) || (useUrlUpload && !audioUrl) || isUploading}
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
            setAudioUrl("")
            setError(null)
            setDetailedError(null)
            setUseUrlUpload(false)
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
