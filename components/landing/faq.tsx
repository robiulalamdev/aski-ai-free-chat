"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const faqs = [
  {
    question: "How does NexaChat work?",
    answer: "NexaChat uses AI via a server-side API. Your API key is kept secure on the server and never exposed to the browser.",
  },
  {
    question: "Is my data private?",
    answer: "Yes. Your conversations are stored locally in your browser. We don't store any chat data on our servers.",
  },
  {
    question: "What AI model is used?",
    answer: "We use a powerful AI model optimized for fast and accurate responses.",
  },
  {
    question: "Does it work on mobile?",
    answer: "Yes! The app is fully responsive and works great on mobile devices.",
  },
  {
    question: "Do I need an API key?",
    answer: "No, the API key is configured server-side. Just open the app and start chatting.",
  },
  {
    question: "Is it really free?",
    answer: "Yes, the app is free to use with generous daily token limits.",
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="py-20 sm:py-28 bg-[#1e1929]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Frequently Asked Questions</h2>
          <p className="mt-4 text-lg text-zinc-400">
            Got questions? We&apos;ve got answers.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-2xl border border-[#2e2840] bg-[#231e30] transition-all duration-200"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between px-6 py-4 text-left"
              >
                <span className="text-sm font-medium text-white sm:text-base">{faq.question}</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-zinc-500 transition-transform duration-200",
                    openIndex === index && "rotate-180"
                  )}
                />
              </button>
              <div className={cn("overflow-hidden transition-all duration-300", openIndex === index ? "max-h-96" : "max-h-0")}>
                <p className="px-6 pb-4 text-sm leading-relaxed text-zinc-400">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}