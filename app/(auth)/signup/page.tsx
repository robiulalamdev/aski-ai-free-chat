"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { Loader2, Mail, Lock, User, ArrowRight } from "lucide-react"
import { registerAction } from "@/app/actions/auth"

export default function SignupPage() {
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await registerAction({
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      })

      if (result?.error) {
        setError(result.error)
      }
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f9fc] dark:bg-[#0f0d18] px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#7c5cfc]/5 blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#7c5cfc]/5 blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-3">
            <img src="/logo.png" alt="NexaChat" className="h-6 w-6 object-contain" />
            <span className="text-2xl font-bold text-[#1a1a2e] dark:text-[#e8e4f0]">NexaChat</span>
          </Link>
        </div>

        {/* Card */}
        <div className="glass-card rounded-3xl p-8">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-[#1a1a2e] dark:text-[#e8e4f0]">Create an account</h1>
            <p className="mt-2 text-[#6b7280]">Start chatting with AI for free</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#1a1a2e] dark:text-[#e8e4f0]">First Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9ca3af]" />
                  <input
                    type="text"
                    name="firstName"
                    required
                    className="w-full rounded-xl border border-[#e2e5f1] bg-[#f1f3f9]/50 backdrop-blur-sm pl-12 pr-4 py-3.5 text-sm text-[#1a1a2e] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#7c5cfc]/50 focus:border-[#7c5cfc]/50 transition-all duration-200 dark:border-[#2a2540] dark:bg-[#231f35]/50 dark:text-[#e8e4f0] dark:placeholder:text-[#6b7280]"
                    placeholder="First"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[#1a1a2e] dark:text-[#e8e4f0]">Last Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9ca3af]" />
                  <input
                    type="text"
                    name="lastName"
                    required
                    className="w-full rounded-xl border border-[#e2e5f1] bg-[#f1f3f9]/50 backdrop-blur-sm pl-12 pr-4 py-3.5 text-sm text-[#1a1a2e] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#7c5cfc]/50 focus:border-[#7c5cfc]/50 transition-all duration-200 dark:border-[#2a2540] dark:bg-[#231f35]/50 dark:text-[#e8e4f0] dark:placeholder:text-[#6b7280]"
                    placeholder="Last"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#1a1a2e] dark:text-[#e8e4f0]">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9ca3af]" />
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full rounded-xl border border-[#e2e5f1] bg-[#f1f3f9]/50 backdrop-blur-sm pl-12 pr-4 py-3.5 text-sm text-[#1a1a2e] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#7c5cfc]/50 focus:border-[#7c5cfc]/50 transition-all duration-200 dark:border-[#2a2540] dark:bg-[#231f35]/50 dark:text-[#e8e4f0] dark:placeholder:text-[#6b7280]"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#1a1a2e] dark:text-[#e8e4f0]">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9ca3af]" />
                <input
                  type="password"
                  name="password"
                  required
                  minLength={6}
                  className="w-full rounded-xl border border-[#e2e5f1] bg-[#f1f3f9]/50 backdrop-blur-sm pl-12 pr-4 py-3.5 text-sm text-[#1a1a2e] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#7c5cfc]/50 focus:border-[#7c5cfc]/50 transition-all duration-200 dark:border-[#2a2540] dark:bg-[#231f35]/50 dark:text-[#e8e4f0] dark:placeholder:text-[#6b7280]"
                  placeholder="At least 6 characters"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#7c5cfc] to-[#6d4ce6] px-4 py-3.5 text-sm font-medium text-white shadow-lg shadow-[#7c5cfc]/25 transition-all duration-300 hover:shadow-[#7c5cfc]/40 hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#6b7280]">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-[#7c5cfc] hover:text-[#6d4ce6] transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
