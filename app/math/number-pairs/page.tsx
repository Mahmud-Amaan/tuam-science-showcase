"use client"

import { useMemo } from "react"

export default function NumberPairsPage() {
  const iframeSrc = useMemo(
    () => "https://phet.colorado.edu/sims/html/number-pairs/latest/number-pairs_all.html",
    []
  )

  return (
    <div className="min-h-screen w-full bg-background">
      <iframe
        src={iframeSrc}
        title="PhET Number Pairs Simulation"
        className="w-full h-[calc(100vh-2rem)] md:h-screen border-none"
        allowFullScreen
        allow="fullscreen"
      />
    </div>
  )
}
