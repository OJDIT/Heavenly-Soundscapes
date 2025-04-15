import Link from "next/link"
import { Mail, MapPin, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function ContactPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold mb-4">
            Get in <span className="gold-text">Touch</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Ready to bring your vision to life? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          <div>
            <div className="gold-border bg-black/40 rounded-lg p-6 md:p-8 mb-8">
              <h2 className="text-xl md:text-2xl font-playfair mb-6">Contact Information</h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-gold-500" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Email</h3>
                    <a
                      href="mailto:contact@heavenlysoundscape.com"
                      className="text-muted-foreground hover:text-gold-400 transition-colors"
                    >
                      contact@heavenlysoundscape.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-gold-500" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Location</h3>
                    <a
                      href="https://www.google.com/maps/place/Coventry,+UK"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-gold-400 transition-colors"
                    >
                      Coventry, UK
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-5 w-5 text-gold-500" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Book a Call</h3>
                    <div className="mt-2">
                      <Button asChild variant="outline" className="w-full md:w-auto">
                        <Link href="#">Schedule via Calendly</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="aspect-video relative rounded-lg overflow-hidden">
              <img src="/recording-studio-session.png" alt="Studio space" className="object-cover w-full h-full" />
            </div>
          </div>

          <div className="gold-border bg-black/40 rounded-lg p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-playfair mb-6">Send a Message</h2>

            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your name" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Your email" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="service">Service Interested In</Label>
                <select
                  id="service"
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Select a service</option>
                  <option value="music-production">Music Production</option>
                  <option value="mixing-mastering">Mixing & Mastering</option>
                  <option value="church-sound">Church Sound Design</option>
                  <option value="sound-packs">Sound Packs</option>
                  <option value="instrument-tracking">Instrument Tracking</option>
                  <option value="video-services">Video Services</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Tell us about your project or inquiry" className="min-h-[150px]" />
              </div>

              <Button type="submit" className="w-full bg-gold-500 hover:bg-gold-600 text-primary-foreground">
                Send Message
              </Button>

              <p className="text-xs text-center text-muted-foreground mt-4">
                We'll get back to you within 1-2 business days.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
