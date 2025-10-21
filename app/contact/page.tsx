import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ContactHero } from "@/components/contact/contact-hero"
import { ContactForm } from "@/components/contact/contact-form"
import { ContactInfo } from "@/components/contact/contact-info"

export const metadata = {
  title: "Contact Us | Heavenly Soundscapes",
  description: "Get in touch with Heavenly Soundscapes. We're here to help bring your audio vision to life.",
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black">
      <Navigation />
      <div className="pt-20">
        <ContactHero />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <ContactForm />
            <ContactInfo />
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
