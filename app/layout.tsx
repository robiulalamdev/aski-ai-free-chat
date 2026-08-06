import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.SITE_URL!;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "NexaChat",
    template: "%s | NexaChat",
  },
  description: "AI-powered chat assistant. Ask anything, get answers.",
  keywords: ["AI chat", "assistant", "free AI", "chatbot"],
  authors: [{ name: "NexaChat" }],
  creator: "NexaChat",
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "NexaChat",
    description: "AI-powered chat assistant. Ask anything, get answers.",
    images: [
      { url: "/logo-sq.png", width: 1200, height: 630, alt: "NexaChat" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NexaChat",
    description: "AI-powered chat assistant. Ask anything, get answers.",
    images: ["/logo-sq.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      style={{ scrollBehavior: "smooth" }}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
