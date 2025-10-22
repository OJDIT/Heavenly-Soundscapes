import Link from "next/link"
import Image from "next/image"
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/images/logo.png"
                alt="Heavenly Soundscapes"
                width={40}
                height={40}
                className="brightness-0 invert"
              />
              <span className="font-serif text-lg font-bold text-gold">Heavenly <span className="gold-text">Soundscape Productions</span></span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Where Sound Meets Perfection. Premium recording, mixing, and mastering services.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-gold"> <span className="gold-text">Quick Links</span></h3>
            <ul className="space-y-2">
              {["Home", "Services", "Portfolio", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                    className="text-sm text-gray-400 hover:text-gold transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4 text-gold"><span className="gold-text">Contact</span></h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <MapPin size={16} className="mt-0.5 text-gold flex-shrink-0" />
                <span>Greybox Self Storage 
                  25-27 Brindley Rd, Bayton industrial estate 
                  CV7 9EP
                </span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Mail size={16} className="text-gold flex-shrink-0" />
                <a href="mailto:benamobeda@heavenlysoundscape.com" className="hover:text-gold transition-colors">
                  contact@heavenlysoundscape.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Phone size={16} className="text-gold flex-shrink-0" />
                <a href="tel:+02477360035" className="hover:text-gold transition-colors">
                  02477360035
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-semibold mb-4 text-gold"> <span className="gold-text">Follow Us</span></h3>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/hsp_gospelstudios?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gold hover:text-black transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gold hover:text-black transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://www.youtube.com/@benamobeda"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gold hover:text-black transition-colors"
                aria-label="YouTube"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Heavenly Soundscape Productions. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-sm text-gray-400 hover:text-gold transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-gray-400 hover:text-gold transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
