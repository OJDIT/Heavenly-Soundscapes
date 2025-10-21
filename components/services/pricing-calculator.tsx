"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useRouter } from "next/navigation"
import { ShoppingCart, Info } from "lucide-react"

interface ServiceItem {
  id: string
  name: string
  price: number
  unit?: string
  description?: string
  hasQuantity?: boolean
  hasHours?: boolean
}

interface ServiceCategory {
  id: string
  title: string
  items: ServiceItem[]
}

const servicesData: ServiceCategory[] = [
  {
    id: "studio-sessions",
    title: "Studio Session Bookings",
    items: [
      { id: "hourly-day", name: "Hourly Rehearsal (Daytime)", price: 50, unit: "per hour", hasHours: true },
      { id: "hourly-night", name: "Hourly Rehearsal (Nighttime)", price: 90, unit: "per hour", hasHours: true },
      { id: "half-day", name: "Half-Day Session (4 hrs)", price: 200, unit: "per session" },
      { id: "half-day-plus", name: "Half-Day Plus (4 hrs, Multitrack + DP48 Mixes)", price: 320, unit: "per session" },
      { id: "full-day", name: "Full-Day Session (8 hrs)", price: 480, unit: "per session" },
      { id: "full-day-plus", name: "Full-Day Plus (8 hrs, Multitrack + DP48 Mixes)", price: 600, unit: "per session" },
      { id: "extended", name: "Extended Session (10 hrs Basic)", price: 680, unit: "per session" },
      { id: "extended-plus", name: "Extended Session (10 hrs Plus)", price: 800, unit: "per session" },
      { id: "split-rehearsal", name: "Split Rehearsal Add-On", price: 100, unit: "per add-on" },
    ],
  },
  {
    id: "recording",
    title: "Recording & Editing",
    items: [
      { id: "audio-only", name: "Audio-Only Recording", price: 500, unit: "per hour", hasHours: true },
      { id: "audio-video-single", name: "Audio + Single-Camera Video", price: 980, unit: "per hour", hasHours: true },
      { id: "audio-video-multi", name: "Audio + Multi-Camera Video", price: 1520, unit: "per hour", hasHours: true },
      { id: "mix", name: "Full Mix", price: 400, unit: "per song", hasQuantity: true },
      { id: "mix-master", name: "Mix & Master", price: 600, unit: "per song", hasQuantity: true },
      { id: "vocal-tuning", name: "Vocal Tuning / Instrument Edits", price: 30, unit: "per track", hasQuantity: true },
      { id: "stem-export", name: "Stem Exports", price: 50, unit: "per session" },
      { id: "alternate-versions", name: "Alternate Versions", price: 40, unit: "each", hasQuantity: true },
    ],
  },
  {
    id: "podcast",
    title: "Podcast & Post-Production",
    items: [
      { id: "audio-only", name: "Podcast (Audio Only, 1–2 guests)", price: 150, unit: "per hour", hasHours: true },
      { id: "audio-only-3guests", name: "Podcast (Audio Only, 3 guests)", price: 180, unit: "per hour", hasHours: true },
      { id: "audio-only-4guests", name: "Podcast (Audio Only, 4 guests)", price: 210, unit: "per hour", hasHours: true },
      { id: "single-cam", name: "Podcast + Single-Camera Video", price: 220, unit: "per hour", hasHours: true },
      { id: "multi-cam", name: "Podcast + Multi-Camera Video", price: 280, unit: "per hour", hasHours: true },
      { id: "short-podcast", name: "Short Podcast (30 mins)", price: 100, unit: "per session" },
      { id: "short-podcast-video", name: "Short Podcast + Video", price: 150, unit: "per session" },
      { id: "short-podcast-multicam", name: "Short Podcast + Multi-Cam", price: 200, unit: "per session" },
      { id: "post-aux", name: "Post: Aux/Strings (8 mins max)", price: 180, unit: "per track", hasQuantity: true },
      { id: "post-lead", name: "Post: Lead Guitars", price: 80, unit: "per track", hasQuantity: true },
      { id: "post-drums", name: "Post: Drums", price: 150, unit: "per track", hasQuantity: true },
      { id: "post-bass", name: "Post: Bass", price: 80, unit: "per track", hasQuantity: true },
      { id: "post-vocals", name: "Post: Vocals", price: 235, unit: "per track", hasQuantity: true },
    ],
  },
  {
    id: "music-creation",
    title: "Music & Song Creation",
    items: [
      { id: "production-only", name: "Production Only", price: 500, unit: "per project" },
      { id: "basic", name: "Basic Package", price: 1200, unit: "per project" },
      { id: "standard", name: "Standard Package", price: 1700, unit: "per project" },
      { id: "premium", name: "Premium Package", price: 2000, unit: "per project" },
      { id: "session-musician", name: "Session Musician", price: 150, unit: "per session", hasQuantity: true },
      { id: "vocalist", name: "Vocalist", price: 120, unit: "per session", hasQuantity: true },
    ],
  },
  {
    id: "video",
    title: "Video Production",
    items: [
      { id: "live-single", name: "Live Session (Single-Camera)", price: 550, unit: "per video" },
      { id: "live-multi", name: "Live Session (Multi-Camera)", price: 700, unit: "per video" },
      { id: "music-basic", name: "Music Video (Basic, 1 Day)", price: 1000, unit: "per video" },
      { id: "music-cinematic", name: "Music Video (Cinematic, 1 Day)", price: 1800, unit: "per video" },
      { id: "music-storyline", name: "Music Video (Extended / Storyline, 2+ Days)", price: 2500, unit: "from" },
      { id: "cover-single", name: "Short Cover Video (Single-Cam)", price: 250, unit: "per video" },
      { id: "cover-multi", name: "Short Cover Video (Multi-Cam)", price: 350, unit: "per video" },
      { id: "mobile-content", name: "Mobile Phone Content", price: 60, unit: "per hour", hasHours: true },
      { id: "extra-camera", name: "Extra Camera", price: 50, unit: "each", hasQuantity: true },
      { id: "extra-day", name: "Extra Day Shoot", price: 500, unit: "per day" },
    ],
  },
  {
    id: "consultations",
    title: "Consultations & Studio Add-Ons",
    items: [
      { id: "consult-45", name: "Creative Consultation (45 mins)", price: 50, unit: "per session" },
      { id: "consult-90", name: "Creative Consultation (90 mins)", price: 80, unit: "per session" },
      { id: "engineer-day", name: "Engineer (Day Rate)", price: 25, unit: "per hour", hasHours: true },
      { id: "engineer-night", name: "Engineer (Night Rate)", price: 35, unit: "per hour", hasHours: true },
      { id: "overtime", name: "Overtime (Charged Full Hourly)", price: 0, unit: "note" },
      { id: "rush-delivery", name: "Rush Delivery (+30%)", price: 0, unit: "surcharge" },
    ],
  },
]

interface SelectedService {
  id: string
  name: string
  price: number
  quantity: number
  hours: number
}

export function PricingCalculator() {
  const router = useRouter()
  const [selectedServices, setSelectedServices] = useState<Record<string, SelectedService>>({})

  const handleServiceToggle = (categoryId: string, item: ServiceItem) => {
    const key = `${categoryId}-${item.id}`
    setSelectedServices((prev) => {
      if (prev[key]) {
        const newState = { ...prev }
        delete newState[key]
        return newState
      } else {
        return {
          ...prev,
          [key]: {
            id: key,
            name: item.name,
            price: item.price,
            quantity: item.hasQuantity ? 1 : 0,
            hours: item.hasHours ? 1 : 0,
          },
        }
      }
    })
  }

  const handleQuantityChange = (key: string, value: number) => {
    setSelectedServices((prev) => ({
      ...prev,
      [key]: { ...prev[key], quantity: Math.max(1, value) },
    }))
  }

  const handleHoursChange = (key: string, value: number) => {
    setSelectedServices((prev) => ({
      ...prev,
      [key]: { ...prev[key], hours: Math.max(1, value) },
    }))
  }

  const total = useMemo(() => {
    return Object.values(selectedServices).reduce((sum, service) => {
      const multiplier = service.quantity > 0 ? service.quantity : service.hours > 0 ? service.hours : 1
      return sum + service.price * multiplier
    }, 0)
  }, [selectedServices])

  const deposit = useMemo(() => (total >= 200 ? total * 0.5 : total), [total])

  const handleBookNow = () => {
    const servicesParam = encodeURIComponent(JSON.stringify(selectedServices))
    router.push(`/book?services=${servicesParam}`)
  }

  return (
    <section className="py-12 bg-background shadow-[0_0_50px_rgba(212,175,55,0.3)]">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-2xl font-serif">Select Your Services</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Choose the services you need and customize quantities or hours
                </p>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="w-full">
                  {servicesData.map((category) => (
                    <AccordionItem key={category.id} value={category.id}>
                      <AccordionTrigger className="text-lg font-semibold hover:text-primary">
                        {category.title}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          {category.items.map((item) => {
                            const key = `${category.id}-${item.id}`
                            const isSelected = !!selectedServices[key]
                            return (
                              <div
                                key={item.id}
                                className={`flex items-start gap-3 p-4 rounded-lg border transition-all ${
                                  isSelected
                                    ? "border-primary bg-primary/5 shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                                    : "border-border"
                                }`}
                              >
                                <Checkbox
                                  id={key}
                                  checked={isSelected}
                                  onCheckedChange={() => handleServiceToggle(category.id, item)}
                                  className="mt-1"
                                />
                                <div className="flex-1">
                                  <Label htmlFor={key} className="cursor-pointer font-medium">
                                    {item.name}
                                  </Label>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    £{item.price} {item.unit}
                                  </p>
                                  {isSelected && (item.hasQuantity || item.hasHours) && (
                                    <div className="mt-3 flex items-center gap-2">
                                      <Label htmlFor={`${key}-input`} className="text-sm">
                                        {item.hasHours ? "Hours:" : "Quantity:"}
                                      </Label>
                                      <div className="flex items-center gap-2">
                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="icon"
                                          onClick={() => {
                                            const currentValue = item.hasHours
                                              ? selectedServices[key].hours
                                              : selectedServices[key].quantity
                                            const newValue = Math.max(1, currentValue - 1)
                                            if (item.hasHours) {
                                              handleHoursChange(key, newValue)
                                            } else {
                                              handleQuantityChange(key, newValue)
                                            }
                                          }}
                                          className="w-8 h-8 p-0"
                                        >
                                          -
                                        </Button>

                                        <Input
                                          id={`${key}-input`}
                                          type="number"
                                          min="1"
                                          value={
                                            item.hasHours
                                              ? selectedServices[key].hours
                                              : selectedServices[key].quantity
                                          }
                                          onChange={(e) => {
                                            const value =
                                              e.target.value === "" ? 1 : parseInt(e.target.value, 10) || 1
                                            if (item.hasHours) {
                                              handleHoursChange(key, value)
                                            } else {
                                              handleQuantityChange(key, value)
                                            }
                                          }}
                                          className="w-16 text-center"
                                        />

                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="icon"
                                          onClick={() => {
                                            const currentValue = item.hasHours
                                              ? selectedServices[key].hours
                                              : selectedServices[key].quantity
                                            const newValue = currentValue + 1
                                            if (item.hasHours) {
                                              handleHoursChange(key, newValue)
                                            } else {
                                              handleQuantityChange(key, newValue)
                                            }
                                          }}
                                          className="w-8 h-8 p-0"
                                        >
                                          +
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <div className="text-right">
                                  {isSelected && (
                                    <p className="text-sm font-semibold text-primary">
                                      £
                                      {item.price *
                                        (selectedServices[key].quantity > 0
                                          ? selectedServices[key].quantity
                                          : selectedServices[key].hours > 0
                                          ? selectedServices[key].hours
                                          : 1)}
                                    </p>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>

          {/* Summary Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="border-primary/50 shadow-lg shadow-primary/10">
                <CardHeader className="bg-primary/5">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <ShoppingCart size={20} />
                    Your Quote
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {Object.keys(selectedServices).length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p className="text-sm">No services selected yet</p>
                      <p className="text-xs mt-2">Select services to see your quote</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                        {Object.values(selectedServices).map((service) => {
                          const multiplier =
                            service.quantity > 0 ? service.quantity : service.hours > 0 ? service.hours : 1
                          return (
                            <div key={service.id} className="flex justify-between text-sm">
                              <div className="flex-1">
                                <p className="font-medium">{service.name}</p>
                                {multiplier > 1 && (
                                  <p className="text-xs text-muted-foreground">
                                    £{service.price} × {multiplier}
                                  </p>
                                )}
                              </div>
                              <p className="font-semibold">£{service.price * multiplier}</p>
                            </div>
                          )
                        })}
                      </div>

                      <div className="border-t border-border pt-4 space-y-2">
                        <div className="flex justify-between text-lg font-semibold">
                          <span>Total</span>
                          <span className="text-primary">£{total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Required Deposit</span>
                          <span>£{deposit.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground space-y-1">
                        <div className="flex items-start gap-2">
                          <Info size={14} className="mt-0.5 flex-shrink-0" />
                          <p>
                            {total >= 200
                              ? "50% deposit required to secure booking"
                              : "Full payment required for bookings under £200"}
                          </p>
                        </div>
                      </div>

                      <Button
                        onClick={handleBookNow}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        Book Now
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Fine Print */}
              <Card className="mt-4 border-border">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Booking Terms</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground space-y-2">
                  <p>• 50% deposit required for bookings £200+</p>
                  <p>• Full payment for bookings under £200</p>
                  <p>• Cancellation 72+ hrs: full refund</p>
                  <p>• Cancellation 24–72 hrs: 50% refund</p>
                  <p>• Cancellation under 24 hrs: deposit forfeited</p>
                  <p>• Late arrival charged from booked start time</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
