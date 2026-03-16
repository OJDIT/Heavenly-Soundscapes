import Image from "next/image"

const portfolioItems = [
  {
    title: "Worship Album ",
    category: "Worship Recording",
    description: "We offer full album production featuring live choir and orchestra arrangements.",
    image: "https://nkfzdkepvicgpvojocrs.supabase.co/storage/v1/object/sign/pictures/studio-1.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iNjk0ZGFlNS1hNTUxLTRiNjYtYjM3My1lMmE0YWQwNTAwYmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwaWN0dXJlcy9zdHVkaW8tMS5qcGciLCJpYXQiOjE3NzM1ODcyODIsImV4cCI6MTkzMTI2NzI4Mn0.N-0fSvahE7yTGPqbk_NUL4ocI_Qmoq2Yr-aMaGV5xPE",
  },
  {
    title: "Podcast Series ",
    category: "Podcast Production",
    description: "Weekly podcast series with professional editing and sound design.",
    image: "https://nkfzdkepvicgpvojocrs.supabase.co/storage/v1/object/sign/pictures/studio-2.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iNjk0ZGFlNS1hNTUxLTRiNjYtYjM3My1lMmE0YWQwNTAwYmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwaWN0dXJlcy9zdHVkaW8tMi5qcGciLCJpYXQiOjE3NzM1ODc0MDEsImV4cCI6MTkzMTI2NzQwMX0.yko2eKlxuxfzBuZmAi_Da7ddjCJhUodrn0XaOdMTG2M",
  },
  {
    title: "Single Release",
    category: "Music Production",
    description: "Contemporary Christian single with full production and mixing.",
    image: "https://nkfzdkepvicgpvojocrs.supabase.co/storage/v1/object/sign/pictures/studio-5.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iNjk0ZGFlNS1hNTUxLTRiNjYtYjM3My1lMmE0YWQwNTAwYmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwaWN0dXJlcy9zdHVkaW8tNS5qcGciLCJpYXQiOjE3NzM1ODc1NDEsImV4cCI6MTkzMTI2NzU0MX0.xV2R8isp7LF0VOtDd1SjnGVKAFbaTZfyvqvX-wCTbl0",
  },
  {
    title: "Live Session Recording",
    category: "Live Recording",
    description: "Multi-track live session capture with professional mixing.",
    image: "https://nkfzdkepvicgpvojocrs.supabase.co/storage/v1/object/sign/pictures/studio-6.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iNjk0ZGFlNS1hNTUxLTRiNjYtYjM3My1lMmE0YWQwNTAwYmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwaWN0dXJlcy9zdHVkaW8tNi5qcGciLCJpYXQiOjE3NzM1ODc1NzgsImV4cCI6MTkzMTI2NzU3OH0.ppW09frmDUzKmEXhPRheEJPUq8z-vsP6Pf4TZlBxJvw",
  },
  {
    title: "EP Production",
    category: "Music Production",
    description: "Complete EP production with mixing and mastering.",
    image: "https://nkfzdkepvicgpvojocrs.supabase.co/storage/v1/object/sign/pictures/studio-7.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iNjk0ZGFlNS1hNTUxLTRiNjYtYjM3My1lMmE0YWQwNTAwYmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwaWN0dXJlcy9zdHVkaW8tNy5qcGciLCJpYXQiOjE3NzM1ODc2MjYsImV4cCI6MTkzMTI2NzYyNn0.kCiFEt7Exc8mngRqlNh97fdFuKlldUN981KDbdt_DiQ",
  },
  {
    title: "Sermon Series Audio",
    category: "Audio Enhancement",
    description: "We offer professional audio cleanup and enhancement for sermon recordings.",
    image: "https://nkfzdkepvicgpvojocrs.supabase.co/storage/v1/object/sign/pictures/studio-3.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iNjk0ZGFlNS1hNTUxLTRiNjYtYjM3My1lMmE0YWQwNTAwYmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwaWN0dXJlcy9zdHVkaW8tMy5qcGciLCJpYXQiOjE3NzM1ODc2NjgsImV4cCI6MTkzMTI2NzY2OH0.MybUm9EU3EQM8gGG7eH_7Wm3BUbPqOe-hEonVoORrCU",
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
                  <span className="inline-block px-3 py-1 bg-gold text-white text-sm font-semibold rounded-full mb-2">
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
