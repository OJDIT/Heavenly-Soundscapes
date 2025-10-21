import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, FileText, Calendar, Headphones } from "lucide-react"

const deliveryTimelines = [
  { icon: FileText, title: "Stereo Mix", time: "48 hours" },
  { icon: FileText, title: "Multitrack Files", time: "3-5 days" },
  { icon: FileText, title: "Mixing/Mastering", time: "7-10 days" },
  { icon: Calendar, title: "Consultation Credits", time: "Valid 14 days" },
]

const studioFeatures = [
  "7-piece professional drum kit",
  "Full keyboard setup",
  "Guitar and bass amplifiers",
  "Professional vocal microphones",
  "PA system and monitors",
  "Comfortable lounge area",
  "Complimentary refreshments",
  "High-speed WiFi",
]

export function ServiceDetails() {
  return (
    <section className="py-16 bg-card/50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Delivery Timelines */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Clock className="text-primary" size={20} />
                Delivery Timelines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deliveryTimelines.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background">
                      <div className="flex items-center gap-3">
                        <Icon size={18} className="text-primary" />
                        <span className="font-medium">{item.title}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{item.time}</span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Studio Features */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Headphones className="text-primary" size={20} />
                Studio Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {studioFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Important Notes */}
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-xl">Important Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              • All prices are subject to VAT. Custom packages available upon consultation - contact us to discuss your
              specific needs.
            </p>
            <p>
              • Clients must bring their own headphones or in-ear monitors. Rentals available upon request for an
              additional fee.
            </p>
            <p>
              • Session times are charged from the booked start time. Late arrivals will not receive additional time
              unless rescheduled in advance.
            </p>
            <p>
              • File delivery timelines begin after final approval of the session. Rush delivery available for an
              additional fee.
            </p>
            <p>• All bookings require a signed agreement and deposit payment to secure your session date and time.</p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
