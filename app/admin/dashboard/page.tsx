"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Home, Music, Film, LayoutDashboard, Upload, Settings, LogOut, Plus, Search, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AdminAuthCheck from "@/components/admin-auth-check"

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("audio")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if mobile on mount and when window resizes
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setSidebarOpen(false)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleSignOut = () => {
    localStorage.removeItem("isAuthenticated")
    router.push("/admin")
  }

  return (
    <AdminAuthCheck>
      <div className="flex min-h-screen pt-16 relative">
        {/* Mobile sidebar toggle */}
        {isMobile && (
          <Button
            variant="outline"
            size="icon"
            className="fixed top-20 left-4 z-30 md:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-4 w-4" />
          </Button>
        )}

        {/* Sidebar - hidden on mobile unless toggled */}
        <div
          className={`${
            isMobile
              ? `fixed inset-0 z-20 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-200 ease-in-out`
              : "w-64 relative"
          } border-r border-gold-500/20 bg-black/40 md:block`}
        >
          <div className="p-4 h-full flex flex-col">
            <div className="py-2 px-3 bg-gold-500/10 rounded-md text-gold-400 font-medium mb-6">Admin Dashboard</div>
            <nav className="space-y-1 flex-1">
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-3 px-3 py-2 rounded-md bg-gold-500/10 text-gold-400"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/admin/dashboard?tab=audio"
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gold-500/5 text-muted-foreground hover:text-gold-400"
              >
                <Music className="h-4 w-4" />
                <span>Audio Content</span>
              </Link>
              <Link
                href="/admin/dashboard?tab=video"
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gold-500/5 text-muted-foreground hover:text-gold-400"
              >
                <Film className="h-4 w-4" />
                <span>Video Content</span>
              </Link>
              <Link
                href="/admin/dashboard?tab=upload"
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gold-500/5 text-muted-foreground hover:text-gold-400"
              >
                <Upload className="h-4 w-4" />
                <span>Upload Content</span>
              </Link>
              <Link
                href="/admin/dashboard?tab=settings"
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gold-500/5 text-muted-foreground hover:text-gold-400"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </nav>
            <div className="p-4 border-t border-gold-500/20 mt-auto">
              <Button variant="outline" className="w-full justify-start" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <div className="container py-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">View Site</span>
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </div>
            </div>

            <Tabs defaultValue="audio" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
                <TabsTrigger value="audio">Audio</TabsTrigger>
                <TabsTrigger value="video">Video</TabsTrigger>
                <TabsTrigger value="upload" className="hidden md:block">
                  Upload
                </TabsTrigger>
                <TabsTrigger value="settings" className="hidden md:block">
                  Settings
                </TabsTrigger>
              </TabsList>

              {/* Mobile-only tabs for the remaining options */}
              {isMobile && (
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="upload">Upload</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
              )}

              <TabsContent value="audio" className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h2 className="text-xl font-semibold">Manage Audio Content</h2>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-auto">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input type="search" placeholder="Search audio..." className="pl-8 w-full sm:w-[250px]" />
                    </div>
                    <Button className="bg-gold-500 hover:bg-gold-600 text-primary-foreground w-full sm:w-auto">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Audio
                    </Button>
                  </div>
                </div>

                <div className="border border-gold-500/20 rounded-lg overflow-hidden overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead className="bg-black/40">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Duration
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Date Added
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gold-500/10">
                      {[
                        {
                          title: "Worshipful Presence",
                          category: "Worship",
                          duration: "3:45",
                          dateAdded: "2023-10-15",
                        },
                        {
                          title: "Glory Anthem",
                          category: "Gospel",
                          duration: "4:20",
                          dateAdded: "2023-09-28",
                        },
                        {
                          title: "Divine Peace",
                          category: "Ambient",
                          duration: "5:12",
                          dateAdded: "2023-08-17",
                        },
                      ].map((item, i) => (
                        <tr key={i} className="hover:bg-gold-500/5">
                          <td className="px-4 py-3 whitespace-nowrap">{item.title}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{item.category}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{item.duration}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{item.dateAdded}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-right">
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-500">
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              {/* Other tab contents remain the same */}
              <TabsContent value="video" className="space-y-4">
                {/* Video content tab - similar responsive changes as audio tab */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h2 className="text-xl font-semibold">Manage Video Content</h2>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-auto">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input type="search" placeholder="Search videos..." className="pl-8 w-full sm:w-[250px]" />
                    </div>
                    <Button className="bg-gold-500 hover:bg-gold-600 text-primary-foreground w-full sm:w-auto">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Video
                    </Button>
                  </div>
                </div>

                <div className="border border-gold-500/20 rounded-lg overflow-hidden overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead className="bg-black/40">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Duration
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Date Added
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gold-500/10">
                      {[
                        {
                          title: "Worship Night Highlights",
                          category: "Live Event",
                          duration: "12:45",
                          dateAdded: "2023-11-05",
                        },
                        {
                          title: "Studio Session - Gospel Choir",
                          category: "Behind the Scenes",
                          duration: "8:20",
                          dateAdded: "2023-10-18",
                        },
                      ].map((item, i) => (
                        <tr key={i} className="hover:bg-gold-500/5">
                          <td className="px-4 py-3 whitespace-nowrap">{item.title}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{item.category}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{item.duration}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{item.dateAdded}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-right">
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-500">
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="upload" className="space-y-6">
                <h2 className="text-xl font-semibold">Upload New Content</h2>
                <Tabs defaultValue="audio-upload">
                  <TabsList className="w-full">
                    <TabsTrigger value="audio-upload" className="flex-1">
                      Upload Audio
                    </TabsTrigger>
                    <TabsTrigger value="video-upload" className="flex-1">
                      Upload Video
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="audio-upload" className="mt-6">
                    <AudioUploadForm />
                  </TabsContent>

                  <TabsContent value="video-upload" className="mt-6">
                    <VideoUploadForm />
                  </TabsContent>
                </Tabs>
              </TabsContent>

              <TabsContent value="settings">
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Account Settings</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4 border border-gold-500/20 rounded-lg p-4">
                      <h3 className="font-medium">Profile Information</h3>
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">Name</label>
                        <Input defaultValue="Admin User" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">Email</label>
                        <Input defaultValue="admin@heavenlysoundscapes.com" />
                      </div>
                      <Button className="w-full sm:w-auto">Update Profile</Button>
                    </div>

                    <div className="space-y-4 border border-gold-500/20 rounded-lg p-4">
                      <h3 className="font-medium">Change Password</h3>
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">Current Password</label>
                        <Input type="password" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">New Password</label>
                        <Input type="password" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">Confirm New Password</label>
                        <Input type="password" />
                      </div>
                      <Button className="w-full sm:w-auto">Change Password</Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AdminAuthCheck>
  )
}

function AudioUploadForm() {
  // AudioUploadForm component remains the same
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type.startsWith("audio/")) {
      setFile(selectedFile)

      // Create an audio URL for preview
      const objectUrl = URL.createObjectURL(selectedFile)
      setPreview(objectUrl)

      // Clean up the URL when component unmounts
      return () => URL.revokeObjectURL(objectUrl)
    }
  }

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setIsUploading(true)

    // Simulate upload progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 5
      setUploadProgress(progress)

      if (progress >= 100) {
        clearInterval(interval)
        setIsUploading(false)
        // Reset form after "upload"
        setTimeout(() => {
          setFile(null)
          setPreview(null)
          setUploadProgress(0)
          alert("Audio uploaded successfully!")
        }, 500)
      }
    }, 200)
  }

  return (
    <form onSubmit={handleUpload} className="space-y-4 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Title</label>
          <Input placeholder="Enter audio title" required />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <option value="">Select category</option>
            <option value="worship">Worship</option>
            <option value="gospel">Gospel</option>
            <option value="ambient">Ambient</option>
            <option value="scripture">Scripture</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <textarea
          className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          placeholder="Enter audio description"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Audio File</label>
        <div className="border-2 border-dashed border-gold-500/30 rounded-lg p-6 text-center hover:border-gold-500/50 transition-colors">
          <input type="file" accept="audio/*" className="hidden" id="audio-upload" onChange={handleFileChange} />
          <label htmlFor="audio-upload" className="cursor-pointer">
            <Music className="h-10 w-10 mx-auto text-gold-500/70 mb-2" />
            <p className="text-sm text-muted-foreground mb-1">{file ? file.name : "Click to upload audio file"}</p>
            <p className="text-xs text-muted-foreground">Supports MP3, WAV, OGG (max 50MB)</p>
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
            <span>Uploading...</span>
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
          }}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}

function VideoUploadForm() {
  // VideoUploadForm component remains the same
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type.startsWith("video/")) {
      setFile(selectedFile)

      // Create a video URL for preview
      const objectUrl = URL.createObjectURL(selectedFile)
      setPreview(objectUrl)

      // Clean up the URL when component unmounts
      return () => URL.revokeObjectURL(objectUrl)
    }
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setThumbnail(selectedFile)

      // Create an image URL for preview
      const objectUrl = URL.createObjectURL(selectedFile)
      setThumbnailPreview(objectUrl)

      // Clean up the URL when component unmounts
      return () => URL.revokeObjectURL(objectUrl)
    }
  }

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setIsUploading(true)

    // Simulate upload progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 3 // Slower for video
      setUploadProgress(progress)

      if (progress >= 100) {
        clearInterval(interval)
        setIsUploading(false)
        // Reset form after "upload"
        setTimeout(() => {
          setFile(null)
          setPreview(null)
          setThumbnail(null)
          setThumbnailPreview(null)
          setUploadProgress(0)
          alert("Video uploaded successfully!")
        }, 500)
      }
    }, 200)
  }

  return (
    <form onSubmit={handleUpload} className="space-y-4 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Title</label>
          <Input placeholder="Enter video title" required />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <option value="">Select category</option>
            <option value="live-event">Live Event</option>
            <option value="behind-scenes">Behind the Scenes</option>
            <option value="tutorial">Tutorial</option>
            <option value="testimony">Testimony</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <textarea
          className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          placeholder="Enter video description"
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
              <p className="text-xs text-muted-foreground">Supports MP4, MOV, WebM (max 500MB)</p>
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
            <span>Uploading video...</span>
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
          disabled={!file || isUploading}
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
          }}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
