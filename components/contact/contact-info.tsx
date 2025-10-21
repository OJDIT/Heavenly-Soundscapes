import { Mail, Phone, MapPin, Clock } from "lucide-react"

export function ContactInfo() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-3xl font-bold text-gold mb-6">Contact Information</h2>
        <p className="text-gray-400 leading-relaxed mb-8">
          Reach out to us directly through any of the channels below. We're here to answer your questions and help you
          get started with your next project.
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0">
            <Mail className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">Email</h3>
            <a href="mailto:contact@heavenlysoundscape.com" className="text-gray-400 hover:text-gold transition-colors">
              contact@heavenlysoundscape.com
            </a>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0">
            <Phone className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">Phone</h3>
            <a href="tel:+15551234567" className="text-gray-400 hover:text-gold transition-colors">
              (555) 123-4567
            </a>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">Location</h3>
            <p className="text-gray-400">
              123 Studio Lane
              <br />
              Nashville, TN 37201
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">Studio Hours</h3>
            <div className="text-gray-400 space-y-1">
              <p>Monday - Friday: 9:00 AM - 9:00 PM</p>
              <p>Saturday: 10:00 AM - 6:00 PM</p>
              <p>Sunday: By Appointment</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mt-8">
        <h3 className="font-serif text-xl font-bold text-gold mb-3">Ready to Book?</h3>
        <p className="text-gray-400 mb-4 leading-relaxed">
          Skip the contact form and book your session directly through our booking system.
        </p>
        <a 
          href="/services"
          className="inline-block px-6 py-3 bg-black hover:bg-black/80 text-[#D4AF37] font-semibold rounded-lg transition-colors"
        >
          Book Now
        </a>

      </div>
    </div>
  )
}
