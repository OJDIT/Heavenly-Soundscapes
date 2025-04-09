import { Quote } from "lucide-react"

const testimonials = [
  {
    quote: "These beats have transformed our worship services. The quality is outstanding!",
    author: "Pastor Michael Johnson",
    church: "Grace Community Church",
  },
  {
    quote: "I've produced three gospel albums using these beats. My congregation loves the sound!",
    author: "Sarah Williams",
    church: "Worship Leader, Faith Chapel",
  },
  {
    quote: "Professional quality beats that truly capture the spirit of gospel music.",
    author: "David Thompson",
    church: "Gospel Recording Artist",
  },
]

export default function TestimonialSection() {
  return (
    <section className="py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">What People Are Saying</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Hear from worship leaders and gospel artists who use our beats
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="flex flex-col items-center text-center p-6 bg-muted rounded-lg">
              <Quote className="h-8 w-8 text-purple-500 mb-4" />
              <p className="mb-4 italic">{testimonial.quote}</p>
              <div>
                <p className="font-semibold">{testimonial.author}</p>
                <p className="text-sm text-muted-foreground">{testimonial.church}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
