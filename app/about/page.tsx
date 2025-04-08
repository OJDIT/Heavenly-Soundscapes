import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="container py-6 md:py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">About Gospel Beats</h1>

        <div className="aspect-video relative rounded-lg overflow-hidden mb-6 md:mb-8">
          <img src="/placeholder.svg?height=400&width=800" alt="Studio setup" className="object-cover w-full h-full" />
        </div>

        <div className="prose max-w-none text-sm md:text-base">
          <p className="text-base md:text-lg">
            Welcome to Gospel Beats, where passion for music meets devotion to worship. We are dedicated to creating
            high-quality gospel beats and sounds that inspire and elevate worship experiences around the world.
          </p>

          <h2 className="text-xl md:text-2xl font-bold mt-6 md:mt-8 mb-3 md:mb-4">Our Mission</h2>
          <p>
            Our mission is to provide gospel artists, worship leaders, and churches with professional-grade music
            production tools that help them create impactful worship experiences. We believe that quality music enhances
            the worship experience and helps deliver the message of faith more effectively.
          </p>

          <h2 className="text-xl md:text-2xl font-bold mt-6 md:mt-8 mb-3 md:mb-4">Our Story</h2>
          <p>
            Gospel Beats was founded in 2018 by a team of passionate musicians and producers who saw a need for
            high-quality production in gospel music. What started as a small project creating beats for local churches
            has grown into a platform serving worship leaders and gospel artists worldwide.
          </p>
          <p>
            Our team consists of experienced music producers, sound engineers, and worship leaders who understand the
            unique requirements of gospel music. We combine technical expertise with spiritual sensitivity to create
            beats that resonate with both performers and congregations.
          </p>

          <h2 className="text-xl md:text-2xl font-bold mt-6 md:mt-8 mb-3 md:mb-4">Our Process</h2>
          <p>
            Each beat in our catalog is crafted with attention to detail and a commitment to excellence. We use
            industry-standard equipment and software to ensure the highest quality sound. Our production process
            includes:
          </p>
          <ul className="list-disc pl-6 space-y-1 md:space-y-2 mt-3 md:mt-4">
            <li>Careful composition and arrangement</li>
            <li>Selection of authentic gospel instruments and sounds</li>
            <li>Professional mixing and mastering</li>
            <li>Quality testing in worship environments</li>
            <li>Feedback incorporation from worship leaders</li>
          </ul>

          <div className="bg-muted p-4 md:p-6 rounded-lg mt-6 md:mt-8">
            <h3 className="text-lg md:text-xl font-bold mb-2">Join Our Community</h3>
            <p className="mb-3 md:mb-4">
              Connect with other gospel artists and worship leaders using our beats. Share your creations, get feedback,
              and grow together in ministry.
            </p>
            <Button asChild size="sm" className="md:text-base md:h-10">
              <Link href="/contact">Get In Touch</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
