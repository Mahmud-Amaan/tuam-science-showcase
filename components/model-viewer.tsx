"use client"

import { useEffect, useState } from "react"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface ModelViewerProps {
  src: string
  title: string
}

export default function ModelViewer({ src, title }: ModelViewerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        setHasError(true)
      }
    }, 10000) // Show error after 10 seconds of loading

    return () => clearTimeout(timer)
  }, [isLoading])

  if (hasError) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-900 text-white p-8">
        <div className="text-center space-y-4 max-w-lg">
          <h2 className="text-2xl font-bold">Unable to Load Model</h2>
          <p className="text-slate-300">
            Sorry, we couldn't load the 3D model. This might be due to network issues or browser compatibility.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 text-white/70 hover:text-white flex items-center gap-2 mx-auto"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen w-full relative bg-slate-900">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
          <div className="space-y-4 text-center">
            <div className="inline-block p-4 bg-white/5 rounded-full">
              <div className="w-8 h-8 border-4 border-white/20 border-t-white/80 rounded-full animate-spin" />
            </div>
            <p className="text-white/70 animate-pulse">Loading 3D Model...</p>
          </div>
        </div>
      )}
      <iframe 
        src={src}
        title={title}
        className="w-full h-full border-none"
        allowFullScreen
        allow="autoplay; fullscreen; xr-spatial-tracking"
        onLoad={() => setIsLoading(false)}
      />
    </div>
  )
}