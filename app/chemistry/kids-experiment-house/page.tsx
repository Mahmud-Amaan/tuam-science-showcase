"use client"

import { useMemo } from "react"

export default function KidsExperimentHousePage() {
  const iframeSrc = useMemo(
    () => "https://virtualkidslab.basf.com/",
    []
  )

  return (
    <div className="min-h-screen w-full bg-background">
      <iframe
        src={iframeSrc}
        title="Virtual Kids Lab - Kids Experiment House"
        className="w-full h-[calc(100vh-2rem)] md:h-screen border-none"
        allowFullScreen
        allow="fullscreen"
      />
    </div>
  )
}
