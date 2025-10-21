import Image from "next/image"

const portfolioItems = [
  {
    title: "Worship Album - Grace Church",
    category: "Worship Recording",
    description: "Full album production with 12 tracks, featuring live choir and orchestra arrangements.",
    image: "/images/studio-1.jpg",
  },
  {
    title: "Podcast Series - Faith Talks",
    category: "Podcast Production",
    description: "Weekly podcast series with professional editing and sound design.",
    image: "/images/studio-2.jpg",
  },
  {
    title: "Single Release - John Smith",
    category: "Music Production",
    description: "Contemporary Christian single with full production and mixing.",
    image: "/images/studio-5.jpg",
  },
  {
    title: "Live Session Recording",
    category: "Live Recording",
    description: "Multi-track live session capture with professional mixing.",
    image: "/images/studio-6.jpg",
  },
  {
    title: "EP Production - The Believers",
    category: "Music Production",
    description: "5-track EP with complete production, mixing, and mastering.",
    image: "/images/studio-7.jpg",
  },
  {
    title: "Sermon Series Audio",
    category: "Audio Enhancement",
    description: "Professional audio cleanup and enhancement for sermon recordings.",
    image: "/images/studio-3.jpg",
  },
]

export function PortfolioGrid() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioItems.map((item, index) => (
            <div
              key={index}
              className="group bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-gold transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-block px-3 py-1 bg-gold text-black text-sm font-semibold rounded-full mb-2">
                    {item.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-serif text-xl font-bold text-gold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
