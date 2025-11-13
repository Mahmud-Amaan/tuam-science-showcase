"use client"

import { useMemo } from "react"

export default function CalculusAppletsPage() {
  const iframeSrc = useMemo(
    () => "https://www.geogebra.org/m/r4A2xSSp",
    []
  )

  return (
    <div className="min-h-screen w-full bg-background">
      <iframe
        src={iframeSrc}
        title="GeoGebra Calculus Applets"
        className="w-full h-[calc(100vh-2rem)] md:h-screen border-none"
        allowFullScreen
        allow="fullscreen"
      />
    </div>
  )
}
