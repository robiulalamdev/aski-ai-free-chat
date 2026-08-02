import type { Metadata } from "next"
import { Nav } from "@/components/landing/nav"
import { Footer } from "@/components/landing/footer"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "NexaChat Privacy Policy — learn how we collect, use, and protect your personal information.",
}

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-[var(--background)]">
        <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-[#1a1a2e] dark:text-[#e8e4f0] mb-2">Privacy Policy</h1>
          <p className="text-sm text-[#9ca3af] mb-12">Last updated: July 30, 2025</p>

          <div className="prose prose-gray dark:prose-invert max-w-none space-y-10">
            <section>
              <h2 className="text-xl font-semibold text-[#1a1a2e] dark:text-[#e8e4f0] mb-3">1. Introduction</h2>
              <p className="text-[#6b7280] leading-relaxed">
                NexaChat (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered chat assistant and related services (collectively, the &quot;Service&quot;).
              </p>
              <p className="text-[#6b7280] leading-relaxed mt-3">
                By using the Service, you agree to the collection and use of information in accordance with this policy. If you do not agree, please discontinue use of the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#1a1a2e] dark:text-[#e8e4f0] mb-3">2. Information We Collect</h2>
              <h3 className="text-lg font-medium text-[#1a1a2e] dark:text-[#e8e4f0] mb-2">Account Information</h3>
              <p className="text-[#6b7280] leading-relaxed">
                When you create an account, we collect your name, email address, and authentication credentials. This information is necessary to provide and manage your access to the Service.
              </p>
              <h3 className="text-lg font-medium text-[#1a1a2e] dark:text-[#e8e4f0] mb-2 mt-4">Conversation Data</h3>
              <p className="text-[#6b7280] leading-relaxed">
                We store your chat conversations and messages to provide conversation history and continuity. This data is associated with your account and can be deleted at any time by you.
              </p>
              <h3 className="text-lg font-medium text-[#1a1a2e] dark:text-[#e8e4f0] mb-2 mt-4">Usage Data</h3>
              <p className="text-[#6b7280] leading-relaxed">
                We automatically collect certain usage information, including pages visited, features used, interaction patterns, device type, browser information, and IP address. This data helps us improve the Service.
              </p>
              <h3 className="text-lg font-medium text-[#1a1a2e] dark:text-[#e8e4f0] mb-2 mt-4">Payment Information</h3>
              <p className="text-[#6b7280] leading-relaxed">
                For paid subscriptions, payment processing is handled by Stripe. We do not store your credit card or payment details on our servers. Stripe&apos;s privacy policy governs the handling of your payment information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#1a1a2e] dark:text-[#e8e4f0] mb-3">3. How We Use Your Information</h2>
              <ul className="list-disc list-inside text-[#6b7280] leading-relaxed space-y-2">
                <li>To provide, maintain, and improve the Service</li>
                <li>To personalize your experience and deliver relevant AI responses</li>
                <li>To process transactions and manage your subscription</li>
                <li>To send service-related communications and updates</li>
                <li>To detect and prevent fraud, abuse, and security issues</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#1a1a2e] dark:text-[#e8e4f0] mb-3">4. Data Sharing</h2>
              <p className="text-[#6b7280] leading-relaxed">
                We do not sell your personal information. We may share your data with:
              </p>
              <ul className="list-disc list-inside text-[#6b7280] leading-relaxed space-y-2 mt-3">
                <li><strong>Service providers</strong> — trusted third parties that help us operate the Service (hosting, payment processing, analytics)</li>
                <li><strong>Legal requirements</strong> — when required by law, regulation, or valid legal process</li>
                <li><strong>Business transfers</strong> — in connection with a merger, acquisition, or sale of assets, with appropriate notice</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#1a1a2e] dark:text-[#e8e4f0] mb-3">5. Data Security</h2>
              <p className="text-[#6b7280] leading-relaxed">
                We implement industry-standard security measures to protect your data, including encryption in transit (TLS/SSL) and at rest, secure authentication mechanisms, regular security audits, and access controls. However, no method of transmission or storage is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#1a1a2e] dark:text-[#e8e4f0] mb-3">6. Your Rights</h2>
              <p className="text-[#6b7280] leading-relaxed">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-[#6b7280] leading-relaxed space-y-2 mt-3">
                <li><strong>Access</strong> your personal data</li>
                <li><strong>Correct</strong> inaccurate or incomplete data</li>
                <li><strong>Delete</strong> your account and associated data</li>
                <li><strong>Export</strong> your conversation data</li>
                <li><strong>Opt out</strong> of non-essential data collection</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#1a1a2e] dark:text-[#e8e4f0] mb-3">7. Cookies</h2>
              <p className="text-[#6b7280] leading-relaxed">
                We use cookies and similar technologies for authentication, session management, and remembering your preferences. You can control cookie settings through your browser, though some features may not function properly without them.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#1a1a2e] dark:text-[#e8e4f0] mb-3">8. Children&apos;s Privacy</h2>
              <p className="text-[#6b7280] leading-relaxed">
                The Service is not intended for users under the age of 13. We do not knowingly collect personal information from children. If we become aware that a child has provided us with personal data, we will take steps to delete it promptly.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#1a1a2e] dark:text-[#e8e4f0] mb-3">9. Changes to This Policy</h2>
              <p className="text-[#6b7280] leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the updated policy on this page and updating the &quot;Last updated&quot; date. Your continued use of the Service after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#1a1a2e] dark:text-[#e8e4f0] mb-3">10. Contact Us</h2>
              <p className="text-[#6b7280] leading-relaxed">
                If you have questions about this Privacy Policy or our data practices, please contact us through our official channels or email us directly. We are committed to resolving any privacy concerns promptly.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
