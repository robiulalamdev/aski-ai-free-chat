import type { Metadata } from "next"
import { Nav } from "@/components/landing/nav"
import { Footer } from "@/components/landing/footer"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "NexaChat Terms of Service — the rules and guidelines governing your use of our platform.",
}

export default function TermsPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-[var(--background)]">
        <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-[#1a1a2e] dark:text-[#e8e4f0] mb-2">Terms of Service</h1>
          <p className="text-sm text-[#9ca3af] mb-12">Last updated: July 30, 2025</p>

          <div className="prose prose-gray dark:prose-invert max-w-none space-y-10">
            <section>
              <h2 className="text-xl font-semibold text-[#1a1a2e] dark:text-[#e8e4f0] mb-3">1. Acceptance of Terms</h2>
              <p className="text-[#6b7280] leading-relaxed">
                By accessing or using NexaChat (the &quot;Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, you may not use the Service. These Terms constitute a legally binding agreement between you and NexaChat.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#1a1a2e] dark:text-[#e8e4f0] mb-3">2. Eligibility</h2>
              <p className="text-[#6b7280] leading-relaxed">
                You must be at least 13 years old to use the Service. By using the Service, you represent and warrant that you meet this age requirement and have the legal capacity to enter into these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#1a1a2e] dark:text-[#e8e4f0] mb-3">3. Account Registration</h2>
              <p className="text-[#6b7280] leading-relaxed">
                To access certain features, you must create an account. You are responsible for maintaining the confidentiality of your credentials and for all activity that occurs under your account. You agree to:
              </p>
              <ul className="list-disc list-inside text-[#6b7280] leading-relaxed space-y-2 mt-3">
                <li>Provide accurate and complete registration information</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
                <li>Not share your account credentials with others</li>
                <li>Not create multiple accounts to circumvent usage limits</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#1a1a2e] dark:text-[#e8e4f0] mb-3">4. Acceptable Use</h2>
              <p className="text-[#6b7280] leading-relaxed">
                You agree to use the Service responsibly and in compliance with all applicable laws. You may not:
              </p>
              <ul className="list-disc list-inside text-[#6b7280] leading-relaxed space-y-2 mt-3">
                <li>Use the Service for any unlawful, harmful, or fraudulent purpose</li>
                <li>Attempt to reverse-engineer, decompile, or extract the underlying AI models</li>
                <li>Use automated tools (bots, scrapers) to access or interact with the Service</li>
                <li>Generate content that is illegal, hateful, harassing, or violates third-party rights</li>
                <li>Attempt to gain unauthorized access to any part of the Service or its infrastructure</li>
                <li>Resell or redistribute the Service without written authorization</li>
                <li>Use the Service to build competing products or services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#1a1a2e] dark:text-[#e8e4f0] mb-3">5. Intellectual Property</h2>
              <p className="text-[#6b7280] leading-relaxed">
                The Service, including its design, code, features, and branding, is owned by NexaChat and protected by intellectual property laws. You retain ownership of content you create using the Service. By using the Service, you grant us a limited license to process and store your content as necessary to provide and improve the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#1a1a2e] dark:text-[#e8e4f0] mb-3">6. Subscriptions and Payments</h2>
              <p className="text-[#6b7280] leading-relaxed">
                The Service offers both free and paid subscription tiers. Paid subscriptions are billed in advance on a recurring basis. By subscribing to a paid plan:
              </p>
              <ul className="list-disc list-inside text-[#6b7280] leading-relaxed space-y-2 mt-3">
                <li>You authorize us to charge your payment method at the start of each billing period</li>
                <li>You may cancel your subscription at any time; cancellation takes effect at the end of the current billing period</li>
                <li>Refunds are provided in accordance with applicable law and our refund policy</li>
                <li>We reserve the right to modify pricing with reasonable advance notice</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#1a1a2e] dark:text-[#e8e4f0] mb-3">7. AI-Generated Content</h2>
              <p className="text-[#6b7280] leading-relaxed">
                The Service uses artificial intelligence to generate responses. You acknowledge that:
              </p>
              <ul className="list-disc list-inside text-[#6b7280] leading-relaxed space-y-2 mt-3">
                <li>AI-generated content may contain inaccuracies and should be verified before reliance</li>
                <li>You are solely responsible for evaluating and using AI-generated outputs</li>
                <li>We do not guarantee the accuracy, completeness, or suitability of any AI response</li>
                <li>AI-generated content should not be considered professional advice</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#1a1a2e] dark:text-[#e8e4f0] mb-3">8. Limitation of Liability</h2>
              <p className="text-[#6b7280] leading-relaxed">
                To the maximum extent permitted by law, NexaChat shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service. Our total liability shall not exceed the amount you paid us in the twelve (12) months preceding the claim.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#1a1a2e] dark:text-[#e8e4f0] mb-3">9. Termination</h2>
              <p className="text-[#6b7280] leading-relaxed">
                We may suspend or terminate your access to the Service at any time, with or without cause, including for violations of these Terms. Upon termination, your right to use the Service ceases immediately. We will make your data available for export for a reasonable period following termination.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#1a1a2e] dark:text-[#e8e4f0] mb-3">10. Dispute Resolution</h2>
              <p className="text-[#6b7280] leading-relaxed">
                Any disputes arising from these Terms shall be resolved through good-faith negotiation first. If unresolved, disputes shall be submitted to binding arbitration in accordance with applicable arbitration rules. These Terms are governed by the laws of the jurisdiction in which NexaChat operates.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#1a1a2e] dark:text-[#e8e4f0] mb-3">11. Changes to Terms</h2>
              <p className="text-[#6b7280] leading-relaxed">
                We may revise these Terms from time to time. Material changes will be communicated through the Service or via email. Your continued use after changes take effect constitutes acceptance of the revised Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#1a1a2e] dark:text-[#e8e4f0] mb-3">12. Contact</h2>
              <p className="text-[#6b7280] leading-relaxed">
                For questions about these Terms, please reach out through our official support channels. We are committed to addressing your concerns promptly and fairly.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
