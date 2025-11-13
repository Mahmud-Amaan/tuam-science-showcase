"use client"

import { useMemo } from "react"

export default function OPhysicsSimulatorPage() {
  const iframeSrc = useMemo(
    () => "https://ophysics.com/fs5.html",
    []
  )

  return (
    <div className="min-h-screen w-full bg-background">
      <iframe
        src={iframeSrc}
        title="oPhysics Multiple Simulator"
        className="w-full h-[calc(100vh-2rem)] md:h-screen border-none"
        allowFullScreen
        allow="fullscreen"
      />
    </div>
  )
}
