const testimonials = [
  {
    name: "Joba O",
    role: "Independent Artist",
    quote:
      "The sounds on my album were simply mind blowing. The quality of the production is outstanding.",
  },
  {
    name: "Faith O",
    role: "Podcast Host",
    quote:
      "Tracks from Heavenly Soundscapes sound so full and professional.",
  },
  {
    name: "Sam U",
    role: "Independent Artist",
    quote:
      "Everyone I played my songs for really loved them and it's thanks to Heavenly Soundscapes.",
  },
]

export function ClientTestimonials() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-gold mb-4">What Our <span className="gold-text">Clients Say</span></h2>
          <p className="text-gray-400 text-lg">Trusted by artists, churches, and content creators.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-900 border border-gray-800 rounded-lg p-8">
              <div className="text-gold text-4xl mb-4">"</div>
              <p className="text-gray-300 leading-relaxed mb-6">{testimonial.quote}</p>
              <div className="border-t border-gray-800 pt-4">
                <div className="font-semibold text-white">{testimonial.name}</div>
                <div className="text-sm text-gray-400">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
