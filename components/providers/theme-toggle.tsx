"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Sun, Moon, Monitor } from "lucide-react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark")
    } else if (theme === "dark") {
      setTheme("system")
    } else {
      setTheme("light")
    }
  }

  const getIcon = () => {
    if (theme === "dark") return <Sun className="h-4 w-4" />
    if (theme === "system") return <Monitor className="h-4 w-4" />
    return <Moon className="h-4 w-4" />
  }

  const getLabel = () => {
    if (theme === "dark") return "Switch to Light"
    if (theme === "system") return "Switch to System"
    return "Switch to Dark"
  }

  return (
    <button
      onClick={cycleTheme}
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e2e5f1] bg-white/80 backdrop-blur-sm text-[#6b7280] transition-all duration-200 hover:bg-[#f1f3f9] hover:text-[#1a1a2e] dark:border-[#2a2540] dark:bg-[#1a1726]/80 dark:hover:bg-[#231f35] dark:hover:text-[#e8e4f0]"
      title={getLabel()}
    >
      {getIcon()}
    </button>
  )
}
