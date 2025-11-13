"use client"

import { useMemo } from "react"

export default function ArithmeticPracticePage() {
  const iframeSrc = useMemo(
    () => "https://phet.colorado.edu/sims/html/arithmetic/latest/arithmetic_all.html",
    []
  )

  return (
    <div className="min-h-screen w-full bg-background">
      <iframe
        src={iframeSrc}
        title="PhET Interactive Arithmetic Practice"
        className="w-full h-[calc(100vh-2rem)] md:h-screen border-none"
        allowFullScreen
        allow="fullscreen"
      />
    </div>
  )
}
