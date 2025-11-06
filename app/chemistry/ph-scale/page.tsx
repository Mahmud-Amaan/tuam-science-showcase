"use client"

export default function PhScalePage() {
  return (
    <div className="h-screen w-full">
      <iframe 
        src="https://phet.colorado.edu/sims/html/ph-scale/latest/ph-scale_en.html"
        title="PhET pH Scale Simulation"
        className="w-full h-full border-none"
        allowFullScreen
        allow="fullscreen"
      />
    </div>
  )
}