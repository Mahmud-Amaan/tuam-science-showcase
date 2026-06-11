"use client"

import { useMemo } from "react"

export default function ColorVisionPage() {
  const iframeSrc = useMemo(
    () => "https://phet.colorado.edu/sims/html/color-vision/latest/color-vision_all.html",
    []
  )

  return (
    <div className="min-h-screen w-full bg-background">
      <iframe
        src={iframeSrc}
        title="PhET Color Vision Simulation"
        className="w-full h-[calc(100vh-2rem)] md:h-screen border-none"
        allowFullScreen
        allow="fullscreen"
      />
    </div>
  )
}
