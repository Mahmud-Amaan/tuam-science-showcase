import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const geist = Geist({ 
  subsets: ["latin"],
  variable: "--font-sans",
})
const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Science Simulator | Explore Physics, Chemistry & Biology in 3D",
  description:
    "Explore science like never before! Science Simulator brings interactive 3D experiments in physics, chemistry, and biology — aligned with the Bangladesh curriculum. Learn, visualize, and have fun with virtual science labs.",
  openGraph: {
    title: "Science Simulator | Interactive 3D Science Learning",
    description:
      "Dive into 3D science experiments and simulations made for students in Bangladesh. Learn physics, chemistry, and biology through interactive virtual labs.",
    url: "https://tuam-science.vercel.app/",
    siteName: "Science Simulator",
    type: "website",
    images: [
      {
        url: "https://tuam-science.vercel.app/banner.jpg",
        width: 1200,
        height: 630,
        alt: "Science Simulator — 3D Interactive Science Learning",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Science Simulator | Learn Science Through Interactive Experiments",
    description:
      "Experience science through 3D virtual labs and experiments based on the Bangladesh curriculum. Fun, engaging, and educational!",
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
      <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
