"use client"

import { useMemo } from "react"

export default function DesmosCalculatorPage() {
  const iframeSrc = useMemo(
    () => "https://www.desmos.com/calculator",
    []
  )

  return (
    <div className="min-h-screen w-full bg-background">
      <iframe
        src={iframeSrc}
        title="Desmos Calculator"
        className="w-full h-[calc(100vh-2rem)] md:h-screen border-none"
        allowFullScreen
        allow="fullscreen"
      />
    </div>
  )
}
