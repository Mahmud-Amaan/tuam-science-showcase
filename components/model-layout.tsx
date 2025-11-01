"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

interface ModelLayoutProps {
  children: React.ReactNode
  title: string
  description: string
}

export default function ModelLayout({ children, title, description }: ModelLayoutProps) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navigation Header */}
      <nav className="fixed top-0 inset-x-0 z-10 bg-white/10 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
            <div>
              <h1 className="text-white/90 font-medium">{title}</h1>
              <p className="text-white/60 text-sm">{description}</p>
            </div>
          </div>
        </div>
      </nav>

      {/* Model Content */}
      <main className="pt-16">{children}</main>
    </div>
  )
}