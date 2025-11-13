"use client"

import { useMemo } from "react"

export default function KidsMathGamesPage() {
  const iframeSrc = useMemo(
    () => "https://pbskids.org/games/math",
    []
  )

  return (
    <div className="min-h-screen w-full bg-background">
      <iframe
        src={iframeSrc}
        title="PBS Kids Math Games"
        className="w-full h-[calc(100vh-2rem)] md:h-screen border-none"
        allowFullScreen
        allow="fullscreen"
      />
    </div>
  )
}
