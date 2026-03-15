"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useRouter } from "next/navigation"
import { ShoppingCart, Loader2 } from "lucide-react"

interface ServiceItem {
  id: string
  name: string
  price: number
  unit?: string
  description?: string
  hasQuantity?: boolean
  hasHours?: boolean
  guestTiers?: { label: string; price: number }[]  // ✅ new
  extraMinuteRate?: number                          // ✅ new
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
      { id: "hourly", name: "Hourly Rehearsal", price: 50, unit: "per hour", hasHours: true },
      { id: "night", name: "Night Session (After 9PM - Min 2hrs)", price: 90, unit: "per hour", hasHours: true },

      { id: "half-day", name: "Half-Day Session (4hrs)", price: 180, unit: "per session" },
      { id: "half-day-plus", name: "Half-Day Plus (4hrs)", price: 280, unit: "per session" },

      { id: "full-day", name: "Full-Day Session (8hrs)", price: 380, unit: "per session" },
      { id: "full-day-plus", name: "Full-Day Plus (8hrs)", price: 480, unit: "per session" },

      { id: "extended", name: "Extended Session (10hrs)", price: 600, unit: "per session" },
      { id: "extended-plus", name: "Extended Session Plus (10hrs)", price: 700, unit: "per session" },

      { id: "split-rehearsal", name: "Split Rehearsal Add-On", price: 50, unit: "per add-on" },
    ],
  },

  {
    id: "recording",
    title: "Recording & Editing",
    items: [
      { id: "audio", name: "Audio-only Recording", price: 120, unit: "per hour", hasHours: true },
      { id: "audio-single", name: "Audio + Single-Cam Video", price: 200, unit: "per hour", hasHours: true },
      { id: "audio-multi", name: "Audio + Multi-Cam Video", price: 280, unit: "per hour", hasHours: true },

      { id: "mix", name: "Full Mix", price: 200, unit: "per song (up to 8 min)", hasQuantity: true },
      { id: "mix-master", name: "Mix + Master", price: 300, unit: "per song (up to 8 min)", hasQuantity: true },

      { id: "vocal-edit", name: "Vocal Tuning / Instrument Edits", price: 30, unit: "per track", hasQuantity: true },
      { id: "stem-export", name: "Stem Export", price: 50, unit: "per session" },
      { id: "alt-version", name: "Alternate Version", price: 40, unit: "each", hasQuantity: true },
    ],
  },

  {
    id: "podcast",
    title: "Podcast & Post-Production",
    items: [
      {
        id: "pod-audio",
        name: "Podcast Audio Only",
        price: 50,
        unit: "per hour",
        hasHours: true,
        guestTiers: [
          { label: "1-2 guests", price: 50 },
          { label: "3 guests", price: 80 },
          { label: "4 guests", price: 100 },
        ],
      },
      {
        id: "pod-video-single",
        name: "Podcast Video – Single-Cam",
        price: 100,
        unit: "per hour",
        hasHours: true,
        guestTiers: [
          { label: "1-2 guests", price: 100 },
          { label: "3 guests", price: 150 },
          { label: "4 guests", price: 200 },
        ],
      },
      {
        id: "pod-video-multi",
        name: "Podcast Video – Multi-Cam",
        price: 150,
        unit: "per hour",
        hasHours: true,
        guestTiers: [
          { label: "1-2 guests", price: 150 },
          { label: "3 guests", price: 200 },
          { label: "4 guests", price: 250 },
        ],
      },

      { id: "short-pod-audio",  name: "Short Podcast – Audio (30 mins)",      price: 50,  unit: "per session" },
      { id: "short-pod-single", name: "Short Podcast – Single-Cam (30 mins)", price: 80,  unit: "per session" },
      { id: "short-pod-multi",  name: "Short Podcast – Multi-Cam (30 mins)",  price: 120, unit: "per session" },

      { id: "post-aux",    name: "Post-Production – Aux / Strings", price: 180, unit: "per track (8 mins max)", hasQuantity: true, extraMinuteRate: 15 },
      { id: "post-guitar", name: "Post-Production – Lead Guitars",  price: 80,  unit: "per track",              hasQuantity: true, extraMinuteRate: 15 },
      { id: "post-drums",  name: "Post-Production – Drums",         price: 150, unit: "per track",              hasQuantity: true, extraMinuteRate: 15 },
      { id: "post-bass",   name: "Post-Production – Bass",          price: 80,  unit: "per track",              hasQuantity: true, extraMinuteRate: 15 },
      { id: "post-vocals", name: "Post-Production – Vocals",        price: 150, unit: "per track",              hasQuantity: true, extraMinuteRate: 15 },
    ],
  },

  {
    id: "music-creation",
    title: "Music & Song Creation",
    items: [
      { id: "prod", name: "Production Only", price: 300, unit: "per project" },
      { id: "basic", name: "Basic Package", price: 450, unit: "per project" },
      { id: "standard", name: "Standard Package", price: 1000, unit: "per project" },
      { id: "premium", name: "Premium Package", price: 1200, unit: "per project" },

      { id: "session-musician", name: "Session Musician", price: 150, unit: "per session", hasQuantity: true },
      { id: "vocalist", name: "Vocalist", price: 120, unit: "per session", hasQuantity: true },
    ],
  },

  {
    id: "consultations",
    title: "Consultations & Add-Ons",
    items: [
      { id: "consult-45", name: "Creative Consultation – 45 mins", price: 50, unit: "per session" },
      { id: "consult-90", name: "Creative Consultation – 90 mins", price: 80, unit: "per session" },

      { id: "engineer-day", name: "Engineer (Day Rate)", price: 25, unit: "per hour", hasHours: true },
      { id: "engineer-night", name: "Engineer (Night Rate)", price: 35, unit: "per hour", hasHours: true },
    ],
  },
]

interface SelectedService {
  id: string
  name: string
  price: number
  quantity: number
  hours: number
  tierPrice?: number       // ✅ new
  extraMinutes?: number    // ✅ new
  extraMinuteRate?: number // ✅ new
}

export function PricingCalculator() {
  const router = useRouter()
  const [selectedServices, setSelectedServices] = useState<Record<string, SelectedService>>({})
  const [isLoading, setIsLoading] = useState(false)

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
            tierPrice: item.guestTiers ? item.guestTiers[0].price : undefined, // ✅ default first tier
            extraMinutes: item.extraMinuteRate !== undefined ? 0 : undefined,
            extraMinuteRate: item.extraMinuteRate,
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

  // ✅ new handlers
  const handleTierChange = (key: string, tierPrice: number) => {
    setSelectedServices((prev) => ({
      ...prev,
      [key]: { ...prev[key], tierPrice },
    }))
  }

  const handleExtraMinutesChange = (key: string, value: number) => {
    setSelectedServices((prev) => ({
      ...prev,
      [key]: { ...prev[key], extraMinutes: Math.max(0, value) },
    }))
  }

  // ✅ updated total: accounts for tierPrice and extraMinutes
  const total = useMemo(() => {
    return Object.values(selectedServices).reduce((sum, service) => {
      const activePrice = service.tierPrice ?? service.price
      const multiplier = service.quantity > 0 ? service.quantity : service.hours > 0 ? service.hours : 1
      const extraCost = (service.extraMinutes ?? 0) * (service.extraMinuteRate ?? 0)
      return sum + activePrice * multiplier + extraCost
    }, 0)
  }, [selectedServices])

  const deposit = useMemo(() => (total >= 200 ? total * 0.5 : total), [total])

  const handleBookNow = async () => {
    if (isLoading) return
    setIsLoading(true)
    const servicesParam = encodeURIComponent(JSON.stringify(selectedServices))
    setTimeout(() => {
      router.push(`/book?services=${servicesParam}`)
    }, 1000)
  }

  return (
    <section className="py-12 bg-background shadow-[0_0_50px_rgba(212,175,55,0.3)]">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Left side */}
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

                                  {/* ✅ Guest tier dropdown */}
                                  {isSelected && item.guestTiers && (
                                    <div className="mt-3 flex items-center gap-2">
                                      <Label className="text-sm">Guests:</Label>
                                      <select
                                        value={selectedServices[key].tierPrice}
                                        onChange={(e) => handleTierChange(key, Number(e.target.value))}
                                        className="text-sm border border-border rounded-md px-2 py-1 bg-background"
                                      >
                                        {item.guestTiers.map((tier) => (
                                          <option key={tier.label} value={tier.price}>
                                            {tier.label} — £{tier.price}/hr
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  )}

                                  {/* Hours / Quantity stepper */}
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
                                            item.hasHours
                                              ? handleHoursChange(key, newValue)
                                              : handleQuantityChange(key, newValue)
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
                                            item.hasHours
                                              ? handleHoursChange(key, value)
                                              : handleQuantityChange(key, value)
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
                                            item.hasHours
                                              ? handleHoursChange(key, currentValue + 1)
                                              : handleQuantityChange(key, currentValue + 1)
                                          }}
                                          className="w-8 h-8 p-0"
                                        >
                                          +
                                        </Button>
                                      </div>
                                    </div>
                                  )}

                                  {/* ✅ Extra minutes input */}
                                  {isSelected && item.extraMinuteRate !== undefined && (
                                    <div className="mt-3 flex items-center gap-2">
                                      <Label htmlFor={`${key}-extra`} className="text-sm">
                                        Extra mins{" "}
                                        <span className="text-muted-foreground">(£{item.extraMinuteRate}/min):</span>
                                      </Label>
                                      <div className="flex items-center gap-2">
                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="icon"
                                          onClick={() =>
                                            handleExtraMinutesChange(
                                              key,
                                              (selectedServices[key].extraMinutes ?? 0) - 1
                                            )
                                          }
                                          className="w-8 h-8 p-0"
                                        >
                                          -
                                        </Button>
                                        <Input
                                          id={`${key}-extra`}
                                          type="number"
                                          min="0"
                                          value={selectedServices[key].extraMinutes ?? 0}
                                          onChange={(e) =>
                                            handleExtraMinutesChange(key, parseInt(e.target.value, 10) || 0)
                                          }
                                          className="w-16 text-center"
                                        />
                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="icon"
                                          onClick={() =>
                                            handleExtraMinutesChange(
                                              key,
                                              (selectedServices[key].extraMinutes ?? 0) + 1
                                            )
                                          }
                                          className="w-8 h-8 p-0"
                                        >
                                          +
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* ✅ Updated item card price — uses tierPrice + extraMinutes */}
                                <div className="text-right">
                                  {isSelected && (
                                    <p className="text-sm font-semibold text-primary">
                                      £{(() => {
                                        const activePrice = selectedServices[key].tierPrice ?? item.price
                                        const multiplier =
                                          selectedServices[key].quantity > 0
                                            ? selectedServices[key].quantity
                                            : selectedServices[key].hours > 0
                                            ? selectedServices[key].hours
                                            : 1
                                        const extraCost =
                                          (selectedServices[key].extraMinutes ?? 0) *
                                          (selectedServices[key].extraMinuteRate ?? 0)
                                        return activePrice * multiplier + extraCost
                                      })()}
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
                        {/* ✅ Updated summary rows — uses tierPrice + extraMinutes */}
                        {Object.values(selectedServices).map((service) => {
                          const activePrice = service.tierPrice ?? service.price
                          const multiplier =
                            service.quantity > 0 ? service.quantity : service.hours > 0 ? service.hours : 1
                          const extraCost = (service.extraMinutes ?? 0) * (service.extraMinuteRate ?? 0)
                          const lineTotal = activePrice * multiplier + extraCost
                          return (
                            <div key={service.id} className="flex justify-between text-sm">
                              <div className="flex-1">
                                <p className="font-medium">{service.name}</p>
                                {multiplier > 1 && (
                                  <p className="text-xs text-muted-foreground">
                                    £{activePrice} × {multiplier}
                                  </p>
                                )}
                                {extraCost > 0 && (
                                  <p className="text-xs text-muted-foreground">
                                    +{service.extraMinutes} extra min (£{extraCost})
                                  </p>
                                )}
                              </div>
                              <p className="font-semibold">£{lineTotal}</p>
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
                          <span>Deposit (50%)</span>
                          <span>£{deposit.toFixed(2)}</span>
                        </div>
                      </div>

                      <Button
                        onClick={handleBookNow}
                        disabled={isLoading}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          "Book Now"
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
