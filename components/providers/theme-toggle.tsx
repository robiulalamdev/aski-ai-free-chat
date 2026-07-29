"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="rounded-xl border border-[#2e2840] bg-[#231e30] px-4 py-2.5 text-sm text-zinc-300 transition-colors hover:bg-[#2a2438] hover:text-white"
    >
      {theme === "dark" ? "Switch to Light" : "Switch to Dark"}
    </button>
  )
}
