import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import dynamic from "next/dynamic"
import "./globals.css"
import { CacheReset } from "@/components/CacheReset"
import { ThemeProvider } from "@/components/theme-provider"
import { WebVitals } from "./web-vitals"
import RoutePrefetcher from "@/components/RoutePrefetcher"

// Dynamically import AIHelperPortal to reduce initial bundle size
// Client component will be lazy loaded - no SSR needed since it's client-only
const AIHelperPortal = dynamic(() => import("@/components/AIHelperPortal"), {
  loading: () => null,
})

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
  title: "Virtual Lab",
  description:
    "Explore science like never before! Virtual Lab brings interactive experiments in physics, chemistry, and biology — aligned with the National curriculum. Learn, visualize, and have fun with virtual science labs.",
  openGraph: {
    title: "Virtual Lab",
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
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Virtual Lab" />
        
        {/* Preconnect to external domains for faster loading */}
        <link rel="preconnect" href="https://api.groq.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//api.groq.com" />
        <link rel="dns-prefetch" href="//vercel-insights.com" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/banner.jpg" as="image" type="image/jpeg" fetchPriority="high" />
        <link rel="preload" href="/background.mp4" as="video" type="video/mp4" />
        
        {/* Structured Data (JSON-LD) for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              "name": "Virtual Lab",
              "description": "Interactive 3D science simulations aligned with the National curriculum for physics, chemistry, biology, math, and ICT",
              "url": "https://tuam-science.vercel.app",
              "logo": "https://tuam-science.vercel.app/banner.jpg",
              "sameAs": [],
              "educationalLevel": "Secondary Education",
              "audience": {
                "@type": "EducationalAudience",
                "educationalRole": "student"
              },
              "provider": {
                "@type": "Organization",
                "name": "Virtual Lab"
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://tuam-science.vercel.app/?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}>
        <ThemeProvider>
          <CacheReset />
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
          <RoutePrefetcher />
          <Analytics />
          <WebVitals />
        </ThemeProvider>
      </body>
    </html>
  )
}
