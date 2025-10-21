"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("sending")

    // Simulate form submission
    setTimeout(() => {
      setStatus("success")
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
      setTimeout(() => setStatus("idle"), 3000)
    }, 1000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
      <h2 className="font-serif text-3xl font-bold text-gold mb-6">Send Us a Message</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-gray-300">
            Name *
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="bg-black border-gray-800 text-white"
            placeholder="Your name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-300">
            Email *
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="bg-black border-gray-800 text-white"
            placeholder="your@email.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-gray-300">
            Phone
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            className="bg-black border-gray-800 text-white"
            placeholder="(555) 123-4567"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject" className="text-gray-300">
            Subject *
          </Label>
          <Input
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="bg-black border-gray-800 text-white"
            placeholder="What can we help you with?"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message" className="text-gray-300">
            Message *
          </Label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={6}
            className="bg-black border-gray-800 text-white resize-none"
            placeholder="Tell us about your project..."
          />
        </div>

        {status === "success" && (
          <div className="bg-green-950/50 border border-green-900 text-green-400 px-4 py-3 rounded-lg text-sm">
            Message sent successfully! We'll get back to you soon.
          </div>
        )}

        {status === "error" && (
          <div className="bg-red-950/50 border border-red-900 text-red-400 px-4 py-3 rounded-lg text-sm">
            Something went wrong. Please try again.
          </div>
        )}

        <Button
          type="submit"
          disabled={status === "sending"}
          className="w-full bg-gold hover:bg-gold/90 text-black font-semibold"
        >
          {status === "sending" ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </div>
  )
}
