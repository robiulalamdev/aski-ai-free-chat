import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "FreeAI Chat - AI That Runs in Your Browser",
    template: "%s | FreeAI Chat",
  },
  description: "Privacy-first AI chat that runs entirely in your browser using WebGPU. No servers, no tracking. Chat with AI offline.",
  keywords: ["AI chat", "browser AI", "local AI", "privacy", "WebGPU", "offline AI", "free AI chat"],
  authors: [{ name: "FreeAI Chat" }],
  creator: "FreeAI Chat",
  metadataBase: new URL("https://freeaichat.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://freeaichat.app",
    siteName: "FreeAI Chat",
    title: "FreeAI Chat - AI That Runs in Your Browser",
    description: "Privacy-first AI chat that runs entirely in your browser using WebGPU. No servers, no tracking.",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "FreeAI Chat - AI That Runs in Your Browser",
    description: "Privacy-first AI chat that runs entirely in your browser using WebGPU.",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/icon-192.svg",
  },
}

export const viewport: Viewport = {
  themeColor: { media: "(prefers-color-scheme: dark)", color: "#1e1929" },
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans">
        {children}
      </body>
    </html>
  )
}
