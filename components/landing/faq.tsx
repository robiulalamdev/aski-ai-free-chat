"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const faqs = [
  {
    question: "What AI model does NexaChat use?",
    answer: "NexaChat uses DeepSeek AI via OpenRouter. It's a powerful language model that handles coding, analysis, writing, and general questions with high accuracy.",
  },
  {
    question: "What AI tools are available?",
    answer: "NexaChat includes a Code Generator (create HTML/CSS/JS projects with live preview) and a Resume Builder (build professional resumes, export as PDF/DOC). Both tools are available on Pro and Enterprise plans.",
  },
  {
    question: "Is my data private?",
    answer: "Yes. Your conversations are stored securely in our PostgreSQL database with encrypted authentication. We never share your data with third parties.",
  },
  {
    question: "How does authentication work?",
    answer: "We use server-side JWT authentication with httpOnly cookies. Your session tokens are never exposed to the browser, providing strong security against XSS attacks.",
  },
  {
    question: "What's the difference between Free, Pro, and Enterprise?",
    answer: "Free plan gives you daily token limits. Pro ($9/month) unlocks higher limits, AI tools (Code Generator, Resume Builder), custom prompts, and priority support. Enterprise ($29/month) adds team management, custom integrations, and dedicated support.",
  },
  {
    question: "Can I share my conversations?",
    answer: "Yes! Pro and Enterprise users can generate public share links for any conversation. Anyone with the link can read the shared chat.",
  },
  {
    question: "Does it work on mobile?",
    answer: "Yes! The app is fully responsive and works great on mobile devices and tablets.",
  },
  {
    question: "How do token limits work?",
    answer: "Each plan has a daily token limit. Free users get a limited number of tokens per day. When you exceed the limit, you'll need to wait until the next day or upgrade your plan.",
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="py-20 sm:py-28 bg-[var(--background)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">Frequently Asked Questions</h2>
          <p className="mt-4 text-lg text-[var(--muted)]">
            Got questions? We&apos;ve got answers.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-2xl border border-[var(--border-custom)] bg-[var(--surface)] transition-all duration-200"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between px-6 py-4 text-left"
              >
                <span className="text-sm font-medium text-[var(--foreground)] sm:text-base">{faq.question}</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-zinc-500 transition-transform duration-200",
                    openIndex === index && "rotate-180"
                  )}
                />
              </button>
              <div className={cn("overflow-hidden transition-all duration-300", openIndex === index ? "max-h-96" : "max-h-0")}>
                <p className="px-6 pb-4 text-sm leading-relaxed text-[var(--muted)]">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
