export default function PrivacyPolicy() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-16 text-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-gold">Privacy Policy</h1>

      <p className="mb-6 text-sm text-muted-foreground">
        Last updated: {new Date().toLocaleDateString("en-GB")}
      </p>

      <p className="mb-4">
        Heavenly Soundscape Productions (“we,” “our,” “us”) respects your privacy. This Privacy Policy explains how we
        collect, use, and protect your personal information when you interact with our website, make a booking, or use
        our studio services.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">1. Information We Collect</h2>
      <ul className="list-disc list-inside space-y-2 mb-4">
        <li>Personal details such as name, email address, and phone number.</li>
        <li>Booking details including selected services, session times, and payment preferences.</li>
        <li>Payment information processed securely through Stripe or other payment partners.</li>
        <li>Technical information such as browser type, IP address, and device data for website analytics.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3">2. How We Use Your Information</h2>
      <ul className="list-disc list-inside space-y-2 mb-4">
        <li>To process bookings and payments securely.</li>
        <li>To send booking confirmations, updates, and important service emails.</li>
        <li>To improve our website, studio services, and customer experience.</li>
        <li>To comply with legal or regulatory obligations.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3">3. Data Protection</h2>
      <p className="mb-4">
        We implement appropriate technical and organizational measures to protect your information. All payments are
        processed using encrypted, PCI-compliant systems. We never store full payment card details on our servers.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">4. Sharing of Data</h2>
      <p className="mb-4">
        We do not sell or rent personal information. We may share limited data with trusted service providers (e.g.,
        Stripe, email platforms, analytics tools) solely to enable core functionality of our services.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">5. Cookies</h2>
      <p className="mb-4">
        Our website may use cookies to enhance functionality and measure traffic. You can disable cookies through your
        browser settings, but some features may not function properly as a result.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">6. Email Communications</h2>
      <p className="mb-4">
        By making a booking or subscribing, you consent to receive service-related emails (e.g., confirmations,
        reminders). You may opt out of promotional communications anytime by following the unsubscribe link.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">7. Your Rights</h2>
      <p className="mb-4">
        You have the right to access, correct, or request deletion of your personal information. To exercise these
        rights, please contact us directly.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">8. Contact</h2>
      <p>
        For privacy-related questions, please contact us at{" "}
        <a href="mailto:benamobeda@heavenlysoundscape.com" className="text-gold underline">
          benamobeda@heavenlysoundscape.com
        </a>
        .
      </p>
    </section>
  )
}
