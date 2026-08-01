import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Arif Mahmud",
    role: "Developer",
    rating: 5,
    quote: "NexaChat has completely changed the way I work. It's fast, reliable, and the answers are always spot on.",
    initials: "AM",
    color: "#8b6fff",
  },
  {
    name: "Nusrat Jahan",
    role: "Content Creator",
    rating: 5,
    quote: "I use NexaChat every day for writing, research, and brainstorming. It's like having a superpower.",
    initials: "NJ",
    color: "#ec4899",
  },
  {
    name: "Riad Hossain",
    role: "Entrepreneur",
    rating: 5,
    quote: "Finally, an AI chat platform that is secure, easy to use, and actually understands what I need.",
    initials: "RH",
    color: "#22c55e",
  },
]

export function Testimonials() {
  return (
    <section className="py-20 sm:py-28 bg-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--glass-border)] bg-[var(--badge-bg)] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">
            What Users Say
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Loved by thousands of users
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="glass-card group rounded-2xl p-6 hover-glow"
            >
              {/* Quote mark */}
              <div className="mb-4 text-3xl leading-none text-[var(--primary)]/30 font-serif">
                &ldquo;
              </div>

              {/* Stars */}
              <div className="mb-4 flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm leading-relaxed text-muted-foreground">
                {testimonial.quote}
              </p>

              {/* Author */}
              <div className="mt-5 flex items-center gap-3 pt-4 border-t border-[var(--glass-border)]">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: testimonial.color }}
                >
                  {testimonial.initials}
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
