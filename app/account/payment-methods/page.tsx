"use client"

import { Wallet } from "lucide-react"

export default function PaymentMethodsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">Payment Methods</h1>
        <p className="mt-2 text-[var(--muted)]">Manage your payment methods and billing information</p>
      </div>

      <div className="rounded-2xl border border-[var(--border-custom)] bg-[var(--surface)] p-12">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 dark:bg-violet-900/30 mb-4">
            <Wallet className="h-8 w-8 text-violet-600 dark:text-violet-400" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--foreground)]">No payment methods</h3>
          <p className="mt-2 text-sm text-[var(--muted)] max-w-sm">
            Add a payment method when you upgrade to a paid plan.
          </p>
        </div>
      </div>
    </div>
  )
}
