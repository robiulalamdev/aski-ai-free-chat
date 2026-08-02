"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2, Shield, Eye, EyeOff, Mail, Lock, ArrowRight, ChevronLeft } from "lucide-react"
import { adminLoginAction } from "@/app/actions/admin"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const result = await adminLoginAction({ email, password })
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f9fc] dark:bg-[#0f0d18] px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#7c5cfc]/5 blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#7c5cfc]/5 blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back to home */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[#6b7280] hover:text-[#7c5cfc] transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>

        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3">
            <img src="/logo.png" alt="NexaChat" className="h-6 w-6 object-contain" />
            <span className="text-2xl font-bold text-[#1a1a2e] dark:text-[#e8e4f0]">NexaChat</span>
          </div>
          <div className="mt-3">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#7c5cfc]/10 px-3 py-1 text-xs font-semibold text-[#7c5cfc]">
              <Shield className="h-3 w-3" />
              Admin Panel
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="glass-card rounded-3xl p-8">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-[#1a1a2e] dark:text-[#e8e4f0]">Welcome back</h1>
            <p className="mt-2 text-[#6b7280]">Sign in to manage NexaChat</p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">{error}</div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#1a1a2e] dark:text-[#e8e4f0]">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9ca3af]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-[#e2e5f1] bg-[#f1f3f9]/50 backdrop-blur-sm pl-12 pr-4 py-3.5 text-sm text-[#1a1a2e] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#7c5cfc]/50 focus:border-[#7c5cfc]/50 transition-all duration-200 dark:border-[#2a2540] dark:bg-[#231f35]/50 dark:text-[#e8e4f0] dark:placeholder:text-[#6b7280]"
                  placeholder="admin@nexachat.com"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#1a1a2e] dark:text-[#e8e4f0]">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9ca3af]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-[#e2e5f1] bg-[#f1f3f9]/50 backdrop-blur-sm pl-12 pr-12 py-3.5 text-sm text-[#1a1a2e] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#7c5cfc]/50 focus:border-[#7c5cfc]/50 transition-all duration-200 dark:border-[#2a2540] dark:bg-[#231f35]/50 dark:text-[#e8e4f0] dark:placeholder:text-[#6b7280]"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#7c5cfc] transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#7c5cfc] to-[#6d4ce6] px-4 py-3.5 text-sm font-medium text-white shadow-lg shadow-[#7c5cfc]/25 transition-all duration-300 hover:shadow-[#7c5cfc]/40 hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
