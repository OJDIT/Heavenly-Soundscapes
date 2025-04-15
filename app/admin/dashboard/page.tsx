"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Home,
  Music,
  Film,
  LayoutDashboard,
  Upload,
  Settings,
  LogOut,
  Plus,
  Search,
  Menu,
  Edit,
  Trash,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import AdminAuthCheck from "@/components/admin-auth-check"
import AudioUploadForm from "@/components/audio-upload-form"
import VideoUploadForm from "@/components/video-upload-form"
import AdminProfileSettings from "@/components/admin-profile-settings"
import SimpleAudioUploadForm from "@/components/simple-audio-upload-form"
import LargeFileUploadForm from "@/components/large-file-upload-form"

// Define types for our content
interface AudioContent {
  id: string
  title: string
  category: string
  duration: string
  dateAdded: string
  price: number
  path?: string
  url: string
  size?: number
  filename?: string
}

interface VideoContent {
  id: string
  title: string
  category: string
  duration: string
  dateAdded: string
  price: number
  path?: string
  thumbnailPath?: string
  url: string
  size?: number
  filename?: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("audio")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [audioContent, setAudioContent] = useState<AudioContent[]>([])
  const [videoContent, setVideoContent] = useState<VideoContent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAudioUploadDialog, setShowAudioUploadDialog] = useState(false)
  const [showVideoUploadDialog, setShowVideoUploadDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isInitializing, setIsInitializing] = useState(true)
  const [initError, setInitError] = useState<string | null>(null)

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

  // Initialize storage buckets first, then fetch content
  useEffect(() => {
    const initialize = async () => {
      setIsInitializing(true)
      setInitError(null)

      try {
        // Initialize storage buckets
        const initResponse = await fetch("/api/init-storage")
        const initData = await initResponse.json()

        if (!initData.success) {
          console.warn("Warning: Failed to initialize storage buckets:", initData.error)
          setInitError("Storage system initialization failed. Some features may not work correctly.")
        }
      } catch (err) {
        console.error("Error initializing storage:", err)
        setInitError("Could not connect to storage system. Some features may not work correctly.")
      } finally {
        setIsInitializing(false)
        // Fetch content after initialization attempt, regardless of success
        fetchContent()
      }
    }

    initialize()
  }, [])

  const fetchContent = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Fetch audio content
      const audioResponse = await fetch("/api/content/audio")
      if (!audioResponse.ok) {
        throw new Error("Failed to fetch audio content")
      }
      const audioData = await audioResponse.json()
      setAudioContent(audioData.data || [])

      // Fetch video content
      const videoResponse = await fetch("/api/content/video")
      if (!videoResponse.ok) {
        throw new Error("Failed to fetch video content")
      }
      const videoData = await videoResponse.json()
      setVideoContent(videoData.data || [])
    } catch (err) {
      console.error("Error fetching content:", err)
      setError("Failed to load content. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const extractPathFromUrl = (url: string): string | null => {
    try {
      // Check if the URL is valid
      if (!url || url === "#" || url.startsWith("/placeholder.svg")) {
        return null
      }

      // If it's a relative URL, just return the path part
      if (url.startsWith("/")) {
        return url.split("/").pop() || null
      }

      // Try to parse as a full URL
      const urlObj = new URL(url)
      // Get the path without the leading slash
      const path = urlObj.pathname.startsWith("/") ? urlObj.pathname.substring(1) : urlObj.pathname

      // Return the last part of the path (the filename)
      return path.split("/").pop() || null
    } catch (error) {
      console.error("Error extracting path from URL:", error, url)
      // If the URL is not valid, try to extract the filename directly
      const parts = url.split("/")
      return parts[parts.length - 1] || null
    }
  }

  // Update the deleteContent function to handle storageType
  const deleteContent = async (item: AudioContent | VideoContent, contentType: "audio" | "video") => {
    if (!confirm(`Are you sure you want to delete "${item.title}"?`)) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Determine the path to delete
      let path = ""

      // First try to use the path property if it exists
      if (item.path) {
        path = item.path
      }
      // Then try to use the filename if it exists
      else if (item.filename) {
        path = item.filename
      }
      // Otherwise use the URL
      else {
        path = item.url
      }

      // For mock data, we need to handle it differently
      const isMockData = !path.includes("/") && !path.includes("://")
      if (isMockData) {
        // For mock data, just use the ID as the path
        path = item.id
      }

      console.log(`Deleting ${contentType} with path: ${path}`)

      const bucket = contentType === "audio" ? "audio-files" : "video-files"

      const response = await fetch("/api/content/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bucket,
          path,
          contentType,
          id: item.id,
          storageType: (item as any).storageType || "supabase", // Add storageType
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete file")
      }

      // Remove the item from the local state immediately for better UX
      if (contentType === "audio") {
        setAudioContent((prev) => prev.filter((audio) => audio.id !== item.id))
      } else {
        setVideoContent((prev) => prev.filter((video) => video.id !== item.id))
      }

      // Also refresh content from the server
      await fetchContent()
    } catch (err) {
      console.error("Error deleting content:", err)
      setError(`Failed to delete ${contentType}. ${err instanceof Error ? err.message : "Please try again."}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAudioUploadSuccess = async () => {
    setShowAudioUploadDialog(false)
    await fetchContent()
  }

  const handleVideoUploadSuccess = async () => {
    setShowVideoUploadDialog(false)
    await fetchContent()
  }

  const handleSignOut = () => {
    localStorage.removeItem("isAuthenticated")
    router.push("/admin")
  }

  // Filter content based on search term
  const filteredAudioContent = audioContent.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredVideoContent = videoContent.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-gold-500 border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Initializing storage system...</p>
        </div>
      </div>
    )
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

            {initError && (
              <div className="bg-amber-500/10 border border-amber-500/50 text-amber-500 rounded-md p-3 mb-6 flex items-start gap-2">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p>{initError}</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={async () => {
                      setIsInitializing(true)
                      try {
                        const response = await fetch("/api/init-storage")
                        const data = await response.json()
                        if (data.success) {
                          setInitError(null)
                          fetchContent()
                        } else {
                          setInitError("Storage system initialization failed. Some features may not work correctly.")
                        }
                      } catch (err) {
                        console.error("Error initializing storage:", err)
                        setInitError("Could not connect to storage system. Some features may not work correctly.")
                      } finally {
                        setIsInitializing(false)
                      }
                    }}
                  >
                    Retry Initialization
                  </Button>
                </div>
              </div>
            )}

            {(filteredAudioContent.some((item) => item.size > 50 * 1024 * 1024) ||
              filteredVideoContent.some((item) => item.size > 50 * 1024 * 1024)) && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 rounded-md p-3 mb-6 flex items-start gap-2">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Large files detected</p>
                  <p className="mt-1">Some files exceed the 50MB limit. Please delete these files to avoid errors.</p>
                </div>
              </div>
            )}

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
                      <Input
                        type="search"
                        placeholder="Search audio..."
                        className="pl-8 w-full sm:w-[250px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button
                      className="bg-gold-500 hover:bg-gold-600 text-primary-foreground w-full sm:w-auto"
                      onClick={() => setShowAudioUploadDialog(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Audio
                    </Button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 text-red-500 rounded-md p-3 text-sm">
                    {error}
                  </div>
                )}

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
                          Price
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Date Added
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Size
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gold-500/10">
                      {isLoading ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-3 text-center">
                            <div className="animate-pulse text-gold-500">Loading...</div>
                          </td>
                        </tr>
                      ) : filteredAudioContent.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-3 text-center text-muted-foreground">
                            {searchTerm ? "No matching audio content found" : "No audio content yet. Add some!"}
                          </td>
                        </tr>
                      ) : (
                        filteredAudioContent.map((item) => (
                          <tr key={item.id} className="hover:bg-gold-500/5">
                            <td className="px-4 py-3 whitespace-nowrap">{item.title}</td>
                            <td className="px-4 py-3 whitespace-nowrap">{item.category}</td>
                            <td className="px-4 py-3 whitespace-nowrap">{item.duration}</td>
                            <td className="px-4 py-3 whitespace-nowrap">£{item.price.toFixed(2)}</td>
                            <td className="px-4 py-3 whitespace-nowrap">{formatDate(item.dateAdded)}</td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {item.size ? `${(item.size / (1024 * 1024)).toFixed(2)} MB` : "N/A"}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right">
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4 mr-1" /> Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500"
                                onClick={() => deleteContent(item, "audio")}
                              >
                                <Trash className="h-4 w-4 mr-1" /> Delete
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="video" className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h2 className="text-xl font-semibold">Manage Video Content</h2>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-auto">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search videos..."
                        className="pl-8 w-full sm:w-[250px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button
                      className="bg-gold-500 hover:bg-gold-600 text-primary-foreground w-full sm:w-auto"
                      onClick={() => setShowVideoUploadDialog(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Video
                    </Button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 text-red-500 rounded-md p-3 text-sm">
                    {error}
                  </div>
                )}

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
                          Price
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Date Added
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Size
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gold-500/10">
                      {isLoading ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-3 text-center">
                            <div className="animate-pulse text-gold-500">Loading...</div>
                          </td>
                        </tr>
                      ) : filteredVideoContent.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-3 text-center text-muted-foreground">
                            {searchTerm ? "No matching video content found" : "No video content yet. Add some!"}
                          </td>
                        </tr>
                      ) : (
                        filteredVideoContent.map((item) => (
                          <tr key={item.id} className="hover:bg-gold-500/5">
                            <td className="px-4 py-3 whitespace-nowrap">{item.title}</td>
                            <td className="px-4 py-3 whitespace-nowrap">{item.category}</td>
                            <td className="px-4 py-3 whitespace-nowrap">{item.duration}</td>
                            <td className="px-4 py-3 whitespace-nowrap">£{item.price.toFixed(2)}</td>
                            <td className="px-4 py-3 whitespace-nowrap">{formatDate(item.dateAdded)}</td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {item.size ? `${(item.size / (1024 * 1024)).toFixed(2)} MB` : "N/A"}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right">
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4 mr-1" /> Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500"
                                onClick={() => deleteContent(item, "video")}
                              >
                                <Trash className="h-4 w-4 mr-1" /> Delete
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
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
                    <TabsTrigger value="large-audio-upload" className="flex-1">
                      Large Files
                    </TabsTrigger>
                    <TabsTrigger value="simple-audio-upload" className="flex-1">
                      Simple Upload
                    </TabsTrigger>
                    <TabsTrigger value="video-upload" className="flex-1">
                      Upload Video
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="audio-upload" className="mt-6">
                    <AudioUploadForm onSuccess={fetchContent} />
                  </TabsContent>

                  <TabsContent value="large-audio-upload" className="mt-6">
                    <LargeFileUploadForm onSuccess={fetchContent} />
                  </TabsContent>

                  <TabsContent value="simple-audio-upload" className="mt-6">
                    <SimpleAudioUploadForm onSuccess={fetchContent} />
                  </TabsContent>

                  <TabsContent value="video-upload" className="mt-6">
                    <VideoUploadForm onSuccess={fetchContent} />
                  </TabsContent>
                </Tabs>
              </TabsContent>

              <TabsContent value="settings">
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Account Settings</h2>
                  <AdminProfileSettings />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Audio Upload Dialog */}
      <Dialog open={showAudioUploadDialog} onOpenChange={setShowAudioUploadDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Upload Audio</DialogTitle>
          </DialogHeader>
          <AudioUploadForm onSuccess={handleAudioUploadSuccess} />
        </DialogContent>
      </Dialog>

      {/* Video Upload Dialog */}
      <Dialog open={showVideoUploadDialog} onOpenChange={setShowVideoUploadDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Upload Video</DialogTitle>
          </DialogHeader>
          <VideoUploadForm onSuccess={handleVideoUploadSuccess} />
        </DialogContent>
      </Dialog>
    </AdminAuthCheck>
  )
}
