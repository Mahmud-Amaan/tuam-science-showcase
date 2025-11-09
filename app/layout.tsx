import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import AIHelperPortal from "@/components/AIHelperPortal"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
})
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  preload: true,
})

export const metadata: Metadata = {
  title: "Virtual Lab | Interactive Science Learning Platform",
  description:
    "Explore science like never before! Virtual Lab brings interactive experiments in physics, chemistry, and biology — aligned with the National curriculum. Learn, visualize, and have fun with virtual science labs.",
  openGraph: {
    title: "Virtual Lab | Interactive Science Learning",
    description:
      "Dive into science experiments and simulations made for students in Bangladesh. Learn physics, chemistry, and biology through interactive virtual labs.",
    url: "https://tuam-science.vercel.app/",
    siteName: "Virtual Lab",
    type: "website",
    images: [
      {
        url: "https://tuam-science.vercel.app/banner.jpg",
        width: 1200,
        height: 630,
        alt: "Virtual Lab — Interactive Science Learning",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Virtual Lab | Learn Science Through Interactive Experiments",
    description:
      "Experience science through virtual labs and experiments based on the National curriculum. Fun, engaging, and educational!",
    images: ["https://tuam-science.vercel.app/banner.jpg"],
  },
}



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preload critical resources */}
        <link rel="preload" href="/banner.jpg" as="image" type="image/jpeg" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      </head>
      <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}>
        {/* Skip Links for Accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-blue-600 text-white px-4 py-2 rounded-md font-semibold focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          Skip to main content
        </a>
        <a
          href="#navigation"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-32 focus:z-50 bg-green-600 text-white px-4 py-2 rounded-md font-semibold focus:outline-none focus:ring-4 focus:ring-green-300"
        >
          Skip to navigation
        </a>
        <a
          href="#subject-cards"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-64 focus:z-50 bg-purple-600 text-white px-4 py-2 rounded-md font-semibold focus:outline-none focus:ring-4 focus:ring-purple-300"
        >
          Skip to subjects
        </a>
        {children}
        <AIHelperPortal />
        <Analytics />
      </body>
    </html>
  )
}
