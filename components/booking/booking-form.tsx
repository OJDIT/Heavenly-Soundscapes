"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Loader2, CheckCircle2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { createBooking } from "@/app/actions/booking"

const TIME_SLOTS = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
]

interface SelectedService {
  id: string
  name: string
  price: number
  quantity: number
  hours: number
}

export function BookingForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [date, setDate] = useState<Date>()
  const [selectedServices, setSelectedServices] = useState<Record<string, SelectedService>>({})
  const hasInitialized = useRef(false)

  useEffect(() => {
    if (hasInitialized.current) return

    const servicesParam = searchParams.get("services")
    if (servicesParam) {
      try {
        const decodedServices = JSON.parse(decodeURIComponent(servicesParam))
        setSelectedServices(decodedServices)
        hasInitialized.current = true
      } catch (error) {
        console.error("Error parsing services from URL:", error)
      }
    }
  }, [])

  const calculateTotal = () => {
    return Object.values(selectedServices).reduce((total, service) => {
      const multiplier = service.quantity > 0 ? service.quantity : service.hours > 0 ? service.hours : 1
      return total + service.price * multiplier
    }, 0)
  }

  const total = calculateTotal()
  const deposit = total >= 200 ? total * 0.5 : total

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)

    const selectedServicesArray = Object.values(selectedServices).map((service) => {
      const multiplier = service.quantity > 0 ? service.quantity : service.hours > 0 ? service.hours : 1
      return {
        id: service.id,
        name: service.name,
        price: service.price,
        quantity: multiplier,
        total: service.price * multiplier,
      }
    })

    const bookingData = {
      customerName: formData.get("name") as string,
      customerEmail: formData.get("email") as string,
      customerPhone: formData.get("phone") as string,
      bookingDate: date ? format(date, "yyyy-MM-dd") : "",
      bookingTime: formData.get("time") as string,
      projectType: formData.get("projectType") as string,
      selectedServices: selectedServicesArray,
      subtotal: total,
      depositAmount: deposit,
      totalAmount: total,
      specialRequests: formData.get("specialRequests") as string,
    }

    try {
      const result = await createBooking(bookingData)

      if (result.success) {
        router.push(`/book/checkout?bookingId=${result.bookingId}`)
      } else {
        alert("Failed to create booking. Please try again.")
      }
    } catch (error) {
      console.error("Booking error:", error)
      alert("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const hasSelectedServices = Object.keys(selectedServices).length > 0

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 bg-white/5 backdrop-blur-sm border border-gold/20 rounded-lg p-8"
    >
      {/* Contact Information */}
      <div className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-gold">Contact Information</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">
              Full Name *
            </Label>
            <Input
              id="name"
              name="name"
              required
              className="bg-black/50 border-gold/30 text-white"
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              Email *
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              className="bg-black/50 border-gold/30 text-white"
              placeholder="john@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-white">
              Phone Number *
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              required
              className="bg-black/50 border-gold/30 text-white"
              placeholder="+1 (555) 000-0000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectType" className="text-white">
              Project Type *
            </Label>
            <Select name="projectType" required>
              <SelectTrigger className="bg-black/50 border-gold/30 text-white">
                <SelectValue placeholder="Select project type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="music">Music Recording</SelectItem>
                <SelectItem value="podcast">Podcast</SelectItem>
                <SelectItem value="voiceover">Voiceover</SelectItem>
                <SelectItem value="worship">Worship Recording</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Date and Time */}
      <div className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-gold">Schedule</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-white">Preferred Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-black/50 border-gold/30 text-white hover:bg-black/70",
                    !date && "text-white/50",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-black border-gold/30">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="text-white"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time" className="text-white">
              Preferred Time *
            </Label>
            <Select name="time" required>
              <SelectTrigger className="bg-black/50 border-gold/30 text-white">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {TIME_SLOTS.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Services Summary - Now displays services from pricing calculator */}
      {hasSelectedServices && (
        <div className="space-y-6">
          <h2 className="text-2xl font-serif font-bold text-gold">Your Selected Services</h2>

          <div className="bg-gold/10 border border-gold/30 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 text-white/90">
              <CheckCircle2 className="h-5 w-5 text-gold" />
              <p className="text-sm">Services selected from pricing calculator. Review your selections below.</p>
            </div>
          </div>

          <div className="space-y-3">
            {Object.values(selectedServices).map((service) => {
              const multiplier = service.quantity > 0 ? service.quantity : service.hours > 0 ? service.hours : 1
              const serviceTotal = service.price * multiplier
              return (
                <div
                  key={service.id}
                  className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-gold/10"
                >
                  <div className="flex-1">
                    <p className="text-white font-medium">{service.name}</p>
                    <p className="text-sm text-white/60">
                      £{service.price} × {multiplier} {service.hours > 0 ? "hours" : service.quantity > 0 ? "qty" : ""}
                    </p>
                  </div>
                  <p className="text-gold font-semibold">£{serviceTotal.toFixed(2)}</p>
                </div>
              )
            })}
          </div>

          <div className="text-center pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/services")}
              className="text-gold border-gold/30 hover:bg-gold/10"
            >
              Modify Services
            </Button>
          </div>
        </div>
      )}

      {/* Show message if no services selected */}
      {!hasSelectedServices && (
        <div className="bg-gold/10 border border-gold/30 rounded-lg p-6 text-center">
          <p className="text-white mb-4">No services selected yet.</p>
          <Button
            type="button"
            onClick={() => router.push("/services")}
            className="bg-gold hover:bg-gold/90 text-black"
          >
            Select Services
          </Button>
        </div>
      )}

      {/* Special Requests */}
      <div className="space-y-2">
        <Label htmlFor="specialRequests" className="text-white">
          Special Requests or Notes
        </Label>
        <Textarea
          id="specialRequests"
          name="specialRequests"
          className="bg-black/50 border-gold/30 text-white min-h-[100px]"
          placeholder="Any specific requirements or questions?"
        />
      </div>

      {/* Price Summary */}
      {hasSelectedServices && (
        <div className="bg-gold/10 border border-gold/30 rounded-lg p-6 space-y-3">
          <div className="flex justify-between text-white">
            <span>Subtotal:</span>
            <span className="font-semibold">£{total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gold text-lg font-semibold border-t border-gold/30 pt-3">
            <span>Deposit Required ({total >= 200 ? "50%" : "100%"}):</span>
            <span>£{deposit.toFixed(2)}</span>
          </div>
          <p className="text-sm text-white/60 mt-2">
            {total >= 200
              ? "Pay 50% deposit now, remaining balance due on session day"
              : "Full payment required for bookings under £200"}
          </p>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting || !hasSelectedServices || !date}
        className="w-full bg-black hover:bg-black/90 text-gold font-semibold py-6 text-lg border border-gold/40 transition-colors"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin text-gold" />
            Processing...
          </>
        ) : (
          "Continue to Payment"
        )}
      </Button>

    </form>
  )
}
