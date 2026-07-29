"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { aiRuntime } from "@/services/ai-runtime"
import type { AIStatus } from "@/types/ai"

type AIContextType = {
  status: AIStatus
  processMessage: (messages: { role: string; content: string }[], onToken?: (token: string) => void) => Promise<string>
  cancel: () => void
}

const AIContext = createContext<AIContextType | null>(null)

export function AIProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AIStatus>("ready")

  const processMessage = useCallback(
    async (messages: { role: string; content: string }[], onToken?: (token: string) => void) => {
      setStatus("generating")
      try {
        const result = await aiRuntime.processMessage(messages, onToken)
        setStatus("ready")
        return result
      } catch (err) {
        setStatus("ready")
        throw err
      }
    },
    []
  )

  const cancel = useCallback(() => {
    aiRuntime.cancel()
    setStatus("ready")
  }, [])

  return (
    <AIContext.Provider value={{ status, processMessage, cancel }}>
      {children}
    </AIContext.Provider>
  )
}

export function useAI() {
  const ctx = useContext(AIContext)
  if (!ctx) throw new Error("useAI must be used within AIProvider")
  return ctx
}