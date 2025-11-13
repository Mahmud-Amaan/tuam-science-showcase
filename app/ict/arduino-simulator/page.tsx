"use client"

import { useMemo } from "react"

export default function ArduinoSimulatorPage() {
  const iframeSrc = useMemo(
    () => "https://wokwi.com/arduino",
    []
  )

  return (
    <div className="min-h-screen w-full bg-background">
      <iframe
        src={iframeSrc}
        title="Wokwi Arduino Simulator"
        className="w-full h-[calc(100vh-2rem)] md:h-screen border-none"
        allowFullScreen
        allow="fullscreen"
      />
    </div>
  )
}
