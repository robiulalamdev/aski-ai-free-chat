"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const faqs = [
  {
    question: "How does the AI run in my browser?",
    answer: "We use WebGPU and WebAssembly to run optimized AI models directly in your browser. The model is downloaded once and cached locally.",
  },
  {
    question: "Is my data private?",
    answer: "Yes. Everything runs locally on your device. No chat data is sent to any server. Only tool requests (like web searches) go through our proxy.",
  },
  {
    question: "What models are available?",
    answer: "We support Qwen 0.5B, SmolLM2, TinyLlama, and Gemma 1B. You can switch models anytime.",
  },
  {
    question: "Does it work on mobile?",
    answer: "Yes! The app is fully responsive and works as a PWA on mobile devices with WebGPU support.",
  },
  {
    question: "Do I need internet after setup?",
    answer: "After the initial model download, basic chat works offline. Internet is only needed for web search and website reading tools.",
  },
  {
    question: "Is it really free?",
    answer: "Yes, the Free plan gives you full access to the local AI model. No hidden costs or API usage limits.",
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Frequently Asked Questions</h2>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Got questions? We&apos;ve got answers.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-2xl border border-zinc-200 bg-white transition-all duration-200 dark:border-zinc-800 dark:bg-zinc-950"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between px-6 py-4 text-left"
              >
                <span className="text-sm font-medium sm:text-base">{faq.question}</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-zinc-500 transition-transform duration-200",
                    openIndex === index && "rotate-180"
                  )}
                />
              </button>
              <div className={cn("overflow-hidden transition-all duration-300", openIndex === index ? "max-h-96" : "max-h-0")}>
                <p className="px-6 pb-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.answer,
                },
              })),
            }),
          }}
        />
      </div>
    </section>
  )
}
