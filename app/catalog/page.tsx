import { Filter, Search } from "lucide-react"
import BeatCard from "@/components/beat-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample data - in a real app, this would come from a database
const beats = [
  {
    id: "gospel-praise-1",
    title: "Joyful Praise",
    price: 29.99,
    category: "Praise",
    bpm: 120,
    duration: "3:45",
    imageUrl: "/placeholder.svg?height=400&width=400",
    audioUrl: "#",
  },
  {
    id: "gospel-worship-1",
    title: "Spirit Worship",
    price: 34.99,
    category: "Worship",
    bpm: 75,
    duration: "4:30",
    imageUrl: "/placeholder.svg?height=400&width=400",
    audioUrl: "#",
  },
  {
    id: "gospel-contemporary-1",
    title: "Grace Melody",
    price: 24.99,
    category: "Contemporary",
    bpm: 90,
    duration: "3:15",
    imageUrl: "/placeholder.svg?height=400&width=400",
    audioUrl: "#",
  },
  {
    id: "gospel-praise-2",
    title: "Glory Anthem",
    price: 32.99,
    category: "Praise",
    bpm: 110,
    duration: "4:10",
    imageUrl: "/placeholder.svg?height=400&width=400",
    audioUrl: "#",
  },
  {
    id: "gospel-worship-2",
    title: "Holy Presence",
    price: 29.99,
    category: "Worship",
    bpm: 65,
    duration: "5:20",
    imageUrl: "/placeholder.svg?height=400&width=400",
    audioUrl: "#",
  },
  {
    id: "gospel-contemporary-2",
    title: "Faith Journey",
    price: 27.99,
    category: "Contemporary",
    bpm: 95,
    duration: "3:50",
    imageUrl: "/placeholder.svg?height=400&width=400",
    audioUrl: "#",
  },
]

export default function CatalogPage() {
  return (
    <div className="container py-6 md:py-12">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8">Gospel Beats Catalog</h1>

      <div className="flex flex-col gap-4 mb-6 md:mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search beats..." className="pl-8" />
        </div>

        <div className="flex flex-wrap gap-2 md:gap-4">
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="praise">Praise</SelectItem>
              <SelectItem value="worship">Worship</SelectItem>
              <SelectItem value="contemporary">Contemporary</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="newest">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" className="ml-auto hidden sm:flex">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {beats.map((beat) => (
          <BeatCard key={beat.id} beat={beat} />
        ))}
      </div>
    </div>
  )
}
