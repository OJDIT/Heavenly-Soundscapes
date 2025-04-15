"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Music, AlertCircle, LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Maximum file size for Supabase (50MB)
const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
// Chunk size for uploads (500KB - smaller to avoid issues)
const CHUNK_SIZE = 500 * 1024 // 500KB chunks

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
  const [currentChunk, setCurrentChunk] = useState(0)
  const [totalChunks, setTotalChunks] = useState(0)
  const [uploadStatus, setUploadStatus] = useState("")

  const formRef = useRef<HTMLFormElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Check if it's an audio file
    if (!selectedFile.type.startsWith("audio/")) {
      setError("Please select a valid audio file")
      return
    }

    // Check file size - strict 50MB limit for Supabase
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError(
        `File is too large. Maximum size is 50MB. Your file is ${(selectedFile.size / (1024 * 1024)).toFixed(2)}MB.`,
      )
      return
    }

    setFile(selectedFile)
    setError(null)
    setDetailedError(null)
    setUseUrlUpload(false)

    // Calculate total chunks
    const chunks = Math.ceil(selectedFile.size / CHUNK_SIZE)
    setTotalChunks(chunks)
    setCurrentChunk(0)

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

  // Function to upload a single chunk
  const uploadChunk = async (
    chunk: Blob,
    chunkIndex: number,
    totalChunks: number,
    fileName: string,
    fileType: string,
  ): Promise<any> => {
    const formData = new FormData()
    formData.append("chunk", chunk)
    formData.append("chunkIndex", chunkIndex.toString())
    formData.append("totalChunks", totalChunks.toString())
    formData.append("fileName", fileName)
    formData.append("fileType", fileType)
    formData.append("title", title)
    formData.append("category", category || "")
    formData.append("description", description || "")
    formData.append("price", price)

    try {
      const response = await fetch("/api/upload-chunk", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(
          `Failed to upload chunk ${chunkIndex}: ${response.status} ${response.statusText} - ${errorText}`,
        )
      }

      return await response.json()
    } catch (error) {
      console.error(`Error uploading chunk ${chunkIndex}:`, error)
      throw error
    }
  }

  const handleChunkedUpload = async (e: React.FormEvent) => {
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

    // Double-check file size before uploading
    if (file.size > MAX_FILE_SIZE) {
      setError(`File is too large. Maximum size is 50MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.`)
      return
    }

    setIsUploading(true)
    setError(null)
    setDetailedError(null)
    setUploadProgress(0)
    setUploadStatus("Preparing upload...")

    try {
      // Generate a unique filename
      const uniqueFileName = `audio-${Date.now()}-${file.name.replace(/\s+/g, "-")}`

      // Calculate total chunks
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE)
      setTotalChunks(totalChunks)

      // For very small files, use direct upload
      if (totalChunks === 1) {
        setUploadStatus("File is small, uploading directly...")
        const formData = new FormData()
        formData.append("file", file)
        formData.append("title", title)
        formData.append("category", category || "")
        formData.append("description", description || "")
        formData.append("price", price)

        const response = await fetch("/api/upload-simple", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Upload failed: ${response.status} ${response.statusText} - ${errorText}`)
        }

        const result = await response.json()

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
          setCurrentChunk(0)
          setTotalChunks(0)
          setUploadStatus("")
          if (formRef.current) {
            formRef.current.reset()
          }
          if (onSuccess) {
            onSuccess()
          }
        }, 2000)

        return
      }

      let finalResponse = null

      // Upload each chunk
      for (let i = 0; i < totalChunks; i++) {
        setCurrentChunk(i + 1)
        setUploadStatus(`Uploading chunk ${i + 1} of ${totalChunks}...`)

        // Calculate chunk start and end
        const start = i * CHUNK_SIZE
        const end = Math.min(file.size, start + CHUNK_SIZE)
        const chunk = file.slice(start, end)

        // Update progress
        const chunkProgress = Math.round(((i + 1) / totalChunks) * 100)
        setUploadProgress(chunkProgress)

        try {
          // Upload this chunk
          const response = await uploadChunk(chunk, i, totalChunks, uniqueFileName, file.type)

          // If this is the final response with the complete file
          if (response.file) {
            finalResponse = response
          }
        } catch (chunkError) {
          throw new Error(`Error uploading chunk ${i + 1}: ${chunkError.message}`)
        }
      }

      // If we have a final response with file data
      if (finalResponse && finalResponse.success && finalResponse.file) {
        // Save to localStorage
        try {
          const existingContent = localStorage.getItem("audioContent")
          const audioContent = existingContent ? JSON.parse(existingContent) : []
          audioContent.push(finalResponse.file)
          localStorage.setItem("audioContent", JSON.stringify(audioContent))
        } catch (storageError) {
          console.error("Failed to save to localStorage:", storageError)
        }
      } else {
        // If we don't have a final response, the upload might not have completed properly
        setUploadStatus("Upload completed, but file processing may still be in progress...")
      }

      setUploadProgress(100)
      setUploadSuccess(true)
      setUploadStatus("Upload completed successfully!")

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
        setCurrentChunk(0)
        setTotalChunks(0)
        setUploadStatus("")
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
      setUploadStatus("Upload failed.")
      console.error("Upload error:", err)
    }
  }

  // Fallback to simple upload for small files
  const handleSimpleUpload = async (e: React.FormEvent) => {
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

    // Double-check file size before uploading
    if (file.size > MAX_FILE_SIZE) {
      setError(`File is too large. Maximum size is 50MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.`)
      return
    }

    setIsUploading(true)
    setError(null)
    setDetailedError(null)
    setUploadProgress(10)
    setUploadStatus("Uploading file directly...")

    try {
      // Create a FormData object for the upload
      const formData = new FormData()
      formData.append("file", file)
      formData.append("title", title)
      formData.append("category", category || "")
      formData.append("description", description || "")
      formData.append("price", price)

      // Use fetch with progress tracking
      const xhr = new XMLHttpRequest()
      xhr.open("POST", "/api/upload-simple")

      // Track upload progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentage = Math.round((event.loaded / event.total) * 80) + 10 // 10-90% range
          setUploadProgress(percentage)
        }
      }

      // Handle completion
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText)

            if (response.success) {
              // Save to localStorage if needed
              try {
                const existingContent = localStorage.getItem("audioContent")
                const audioContent = existingContent ? JSON.parse(existingContent) : []
                audioContent.push(response.file)
                localStorage.setItem("audioContent", JSON.stringify(audioContent))
              } catch (storageError) {
                console.error("Failed to save to localStorage:", storageError)
              }

              setUploadProgress(100)
              setUploadSuccess(true)
              setUploadStatus("Upload completed successfully!")

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
                setUploadStatus("")
                if (formRef.current) {
                  formRef.current.reset()
                }
                if (onSuccess) {
                  onSuccess()
                }
              }, 2000)
            } else {
              throw new Error(response.error || "Upload failed")
            }
          } catch (parseError) {
            throw new Error(`Error parsing response: ${parseError.message}`)
          }
        } else {
          throw new Error(`Upload failed with status: ${xhr.status}`)
        }
      }

      // Handle errors
      xhr.onerror = () => {
        throw new Error("Network error during upload")
      }

      // Send the request
      xhr.send(formData)
    } catch (err) {
      setIsUploading(false)
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      setError("Upload failed. Please try again.")
      setDetailedError(errorMessage)
      setUploadStatus("Upload failed.")
      console.error("Upload error:", err)
    }
  }

  return (
    <form ref={formRef} onSubmit={useUrlUpload ? handleUrlUpload : handleSimpleUpload} className="space-y-4 max-w-2xl">
      <div className="bg-green-500/10 border border-green-500/50 text-green-500 rounded-md p-3 text-sm mb-4">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Simplified Upload</p>
            <p className="mt-1">
              {useUrlUpload
                ? "For very large files, please provide a direct URL to your audio file."
                : "Files will be uploaded directly to Supabase. Maximum file size: 50MB."}
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
          <label className="text-sm font-medium">Audio File (Max 50MB)</label>
          <div className="border-2 border-dashed border-gold-500/30 rounded-lg p-6 text-center hover:border-gold-500/50 transition-colors">
            <input type="file" accept="audio/*" className="hidden" id="large-file-upload" onChange={handleFileChange} />
            <label htmlFor="large-file-upload" className="cursor-pointer">
              <Music className="h-10 w-10 mx-auto text-gold-500/70 mb-2" />
              <p className="text-sm text-muted-foreground mb-1">{file ? file.name : "Click to upload audio file"}</p>
              <p className="text-xs text-muted-foreground">
                {file ? `File size: ${(file.size / (1024 * 1024)).toFixed(2)}MB` : "Maximum file size: 50MB"}
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
            <span>{uploadStatus || "Uploading..."}</span>
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
            setCurrentChunk(0)
            setTotalChunks(0)
            setUploadStatus("")
          }}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
