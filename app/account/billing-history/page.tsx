"use client"

import { CreditCard, ExternalLink } from "lucide-react"

export default function BillingHistoryPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">Billing History</h1>
        <p className="mt-2 text-[var(--muted)]">View your past invoices and payments</p>
      </div>

      <div className="rounded-2xl border border-[var(--border-custom)] bg-[var(--surface)] p-12">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 dark:bg-violet-900/30 mb-4">
            <CreditCard className="h-8 w-8 text-violet-600 dark:text-violet-400" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--foreground)]">No billing history yet</h3>
          <p className="mt-2 text-sm text-[var(--muted)] max-w-sm">
            Your invoices and payment history will appear here once you make your first purchase.
          </p>
        </div>
      </div>
    </div>
  )
}
