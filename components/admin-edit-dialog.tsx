"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import AudioPlayer from "@/components/audio-player"

interface ContentItem {
  id: string
  title: string
  category: string
  description?: string
  price: number
  url: string
  duration?: string
  dateAdded: string
  size?: number
  path?: string
  filename?: string
  type?: string
}

interface AdminEditDialogProps {
  item: ContentItem
  contentType: "audio" | "video"
  onSuccess: () => void
}

export default function AdminEditDialog({ item, contentType, onSuccess }: AdminEditDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(item.title)
  const [category, setCategory] = useState(item.category)
  const [description, setDescription] = useState(item.description || "")
  const [price, setPrice] = useState(item.price.toString())
  const [duration, setDuration] = useState(item.duration || "")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Validate price
      const priceValue = Number.parseFloat(price)
      if (isNaN(priceValue) || priceValue <= 0) {
        throw new Error("Please enter a valid price")
      }

      // Create updated item
      const updatedItem = {
        ...item,
        title,
        category,
        description,
        price: priceValue,
        duration,
      }

      // Send update request to API
      const response = await fetch("/api/content/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: item.id,
          contentType,
          updatedItem,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update item")
      }

      setSuccess("Item updated successfully")

      // Close dialog after a short delay
      setTimeout(() => {
        setOpen(false)
        onSuccess()
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while updating the item")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
        Edit
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit {contentType === "audio" ? "Audio" : "Video"}</DialogTitle>
            <DialogDescription>Make changes to the {contentType} item. Click save when you're done.</DialogDescription>
          </DialogHeader>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 rounded-md p-3 flex items-start gap-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/50 text-green-500 rounded-md p-3 flex items-start gap-2">
              <Check className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p>{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter title" required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select category</option>
                {contentType === "audio" ? (
                  <>
                    <option value="worship">Worship</option>
                    <option value="gospel">Gospel</option>
                    <option value="ambient">Ambient</option>
                    <option value="scripture">Scripture</option>
                    <option value="praise">Praise</option>
                    <option value="contemporary">Contemporary</option>
                  </>
                ) : (
                  <>
                    <option value="live-event">Live Event</option>
                    <option value="behind-scenes">Behind the Scenes</option>
                    <option value="tutorial">Tutorial</option>
                    <option value="testimony">Testimony</option>
                  </>
                )}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Price (£)</label>
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="29.99"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Duration</label>
                <Input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="3:45" />
              </div>
            </div>

            {/* Preview section */}
            {item.url && contentType === "audio" && (
              <div className="border border-gold-500/20 rounded-lg p-4 bg-black/40">
                <h4 className="text-sm font-medium mb-2">Audio Preview</h4>
                <AudioPlayer audioUrl={item.url} title={item.title} />
              </div>
            )}

            {item.url && contentType === "video" && (
              <div className="border border-gold-500/20 rounded-lg p-4 bg-black/40">
                <h4 className="text-sm font-medium mb-2">Video Preview</h4>
                <video controls className="w-full max-h-[200px]">
                  <source src={item.url} />
                  Your browser does not support the video element.
                </video>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
