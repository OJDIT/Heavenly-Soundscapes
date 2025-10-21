export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black text-gray-200 py-16 px-6 md:px-20">
      <div className="max-w-4xl mx-auto space-y-10">
        <h1 className="text-4xl font-serif text-gold font-bold mb-6">Terms of Service</h1>
        <p className="text-gray-400 text-sm">
          Last updated: {new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <section className="space-y-6">
          <p>
            Welcome to Heavenly Soundscapes. By booking a session or using any of our services, you agree to these
            Terms of Service. Please read them carefully before making a booking.
          </p>

          <h2 className="text-xl text-gold font-semibold">1. Booking & Payments</h2>
          <p>
            Bookings can be made online through our official website. A 50% deposit is required for all bookings above
            £200, while sessions under £200 require full payment upfront. Bookings are confirmed only after payment is
            received.
          </p>

          <h2 className="text-xl text-gold font-semibold">2. Cancellations & Refunds</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>Cancellations made 72+ hours before your session: full refund.</li>
            <li>Cancellations made 24–72 hours before: 50% refund.</li>
            <li>Cancellations made under 24 hours: deposit is forfeited.</li>
          </ul>

          <h2 className="text-xl text-gold font-semibold">3. Studio Conduct</h2>
          <p>
            Clients are expected to respect studio equipment, facilities, and staff. Damages caused by misuse may result
            in repair charges. Smoking and illegal substances are not permitted within the studio premises.
          </p>

          <h2 className="text-xl text-gold font-semibold">4. Session Timing</h2>
          <p>
            Sessions begin at the scheduled start time. Late arrivals are charged from the booked start time. We
            recommend arriving at least 15 minutes early for setup and load-in.
          </p>

          <h2 className="text-xl text-gold font-semibold">5. Audio & Visual Rights</h2>
          <p>
            Heavenly Soundscapes retains the right to use short clips or images from sessions for promotional purposes,
            unless otherwise agreed in writing. All final mixes and masters remain property of the client after full
            payment.
          </p>

          <h2 className="text-xl text-gold font-semibold">6. Liability</h2>
          <p>
            Heavenly Soundscapes is not responsible for loss or damage to personal equipment or files. Clients are
            encouraged to bring backups of their materials.
          </p>

          <h2 className="text-xl text-gold font-semibold">7. Changes to Terms</h2>
          <p>
            We may update these Terms of Service occasionally to reflect changes in our operations or legal
            requirements. Updates will be posted on this page with the revised date.
          </p>

          <p>
                For any questions about these terms, please contact us at{" "}
                <a href="mailto:benamobeda@heavenlysoundscape.com" className="hover:text-gold transition-colors">
                  contact@heavenlysoundscape.com
                </a>
          </p>
        </section>
      </div>
    </main>
  )
}
