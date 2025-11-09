"use client"

import { useMemo } from "react"

export default function PeriodicTablePage() {
  const iframeSrc = useMemo(
    () => "https://artsexperiments.withgoogle.com/periodic-table/",
    []
  )

  return (
    <div className="min-h-screen w-full bg-background">
      <iframe
        src={iframeSrc}
        title="Google Arts & Culture Interactive Periodic Table"
        className="w-full h-[calc(100vh-2rem)] md:h-screen border-none"
        allowFullScreen
        allow="fullscreen"
      />
    </div>
  )
}
