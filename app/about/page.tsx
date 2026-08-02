import type { Metadata } from "next"
import Link from "next/link"
import { Nav } from "@/components/landing/nav"
import { Footer } from "@/components/landing/footer"

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about NexaChat — our mission, vision, and the team behind the AI-powered chat assistant.",
}

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-[var(--background)]">
        <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-[#1a1a2e] dark:text-[#e8e4f0] sm:text-5xl">
              About NexaChat
            </h1>
            <p className="mt-4 text-lg text-[#6b7280] max-w-2xl mx-auto">
              Building the future of conversational AI, one interaction at a time.
            </p>
          </div>

          {/* Mission */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-[#1a1a2e] dark:text-[#e8e4f0] mb-4">Our Mission</h2>
            <p className="text-[#6b7280] leading-relaxed mb-4">
              NexaChat was founded with a simple goal: make powerful AI assistance accessible to everyone. We believe that conversational AI should be intuitive, reliable, and available whenever you need it — without complex setups or expensive subscriptions.
            </p>
            <p className="text-[#6b7280] leading-relaxed">
              Whether you&apos;re a developer looking for code assistance, a professional drafting documents, or simply someone with questions, NexaChat is designed to understand your needs and deliver accurate, helpful responses in real time.
            </p>
          </section>

          {/* What We Stand For */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-[#1a1a2e] dark:text-[#e8e4f0] mb-4">What We Stand For</h2>
            <div className="grid gap-8 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#e2e5f1] dark:border-[#2a2540] p-6">
                <h3 className="text-lg font-semibold text-[#1a1a2e] dark:text-[#e8e4f0] mb-2">Privacy First</h3>
                <p className="text-sm text-[#6b7280] leading-relaxed">
                  Your conversations are yours. We don&apos;t sell your data, and we&apos;re committed to transparent data practices. Your privacy isn&apos;t a feature — it&apos;s a fundamental right.
                </p>
              </div>
              <div className="rounded-2xl border border-[#e2e5f1] dark:border-[#2a2540] p-6">
                <h3 className="text-lg font-semibold text-[#1a1a2e] dark:text-[#e8e4f0] mb-2">Innovation</h3>
                <p className="text-sm text-[#6b7280] leading-relaxed">
                  We continuously improve our AI models and features to provide the most accurate and helpful responses. Our team stays at the forefront of AI research to bring you the best experience.
                </p>
              </div>
              <div className="rounded-2xl border border-[#e2e5f1] dark:border-[#2a2540] p-6">
                <h3 className="text-lg font-semibold text-[#1a1a2e] dark:text-[#e8e4f0] mb-2">Accessibility</h3>
                <p className="text-sm text-[#6b7280] leading-relaxed">
                  AI shouldn&apos;t be reserved for the few. NexaChat offers a generous free tier so that anyone can benefit from conversational AI, regardless of their budget.
                </p>
              </div>
              <div className="rounded-2xl border border-[#e2e5f1] dark:border-[#2a2540] p-6">
                <h3 className="text-lg font-semibold text-[#1a1a2e] dark:text-[#e8e4f0] mb-2">Transparency</h3>
                <p className="text-sm text-[#6b7280] leading-relaxed">
                  We believe in honest communication. Our pricing is clear, our capabilities are honestly represented, and our team is accessible to our community.
                </p>
              </div>
            </div>
          </section>

          {/* Story */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-[#1a1a2e] dark:text-[#e8e4f0] mb-4">Our Story</h2>
            <p className="text-[#6b7280] leading-relaxed mb-4">
              NexaChat started as a personal project born out of frustration with existing AI chat tools that were either too limited, too expensive, or didn&apos;t respect user privacy. We wanted to create something different — an AI assistant that&apos;s powerful yet simple, capable yet accessible.
            </p>
            <p className="text-[#6b7280] leading-relaxed">
              Today, NexaChat serves thousands of users worldwide, from students and developers to professionals and businesses. We&apos;re proud of the community we&apos;ve built and remain committed to making NexaChat better every day.
            </p>
          </section>

          {/* CTA */}
          <section className="text-center rounded-2xl border border-[#e2e5f1] dark:border-[#2a2540] p-8">
            <h2 className="text-xl font-bold text-[#1a1a2e] dark:text-[#e8e4f0] mb-3">Ready to get started?</h2>
            <p className="text-sm text-[#6b7280] mb-6">Join thousands of users who trust NexaChat for their daily AI needs.</p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#7c5cfc] to-[#6d4ce6] px-6 py-3 text-sm font-medium text-white shadow-lg shadow-[#7c5cfc]/25 transition-all duration-300 hover:shadow-[#7c5cfc]/40 hover:brightness-110 active:scale-[0.98]"
            >
              Create Free Account
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
