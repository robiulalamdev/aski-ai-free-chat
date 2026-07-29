"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { Brain, Loader2 } from "lucide-react"
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
    <div className="flex min-h-screen items-center justify-center bg-[#1e1929] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2.5 text-lg font-semibold text-white">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
              <Brain className="h-5 w-5 text-white" />
            </div>
            NexaChat
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-white">Create an account</h1>
          <p className="mt-2 text-sm text-zinc-400">Start chatting with AI for free</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-300">First Name</label>
              <input
                type="text"
                name="firstName"
                required
                className="w-full rounded-xl border border-[#2e2840] bg-[#231e30] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-zinc-500 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30"
                placeholder="First"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-300">Last Name</label>
              <input
                type="text"
                name="lastName"
                required
                className="w-full rounded-xl border border-[#2e2840] bg-[#231e30] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-zinc-500 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30"
                placeholder="Last"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-300">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full rounded-xl border border-[#2e2840] bg-[#231e30] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-zinc-500 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-300">Password</label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              className="w-full rounded-xl border border-[#2e2840] bg-[#231e30] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-zinc-500 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30"
              placeholder="At least 6 characters"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-violet-600/20 transition-all hover:shadow-violet-600/30 hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-violet-400 hover:text-violet-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
