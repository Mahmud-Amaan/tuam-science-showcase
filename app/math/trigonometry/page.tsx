"use client"

export default function TrigonometryPage() {
  return (
    <div className="min-h-screen w-full bg-background">
      <iframe
        src="https://phet.colorado.edu/en/simulations/trig-tour"
        title="PhET Interactive Trigonometry Tour"
        className="w-full h-[calc(100vh-2rem)] md:h-screen border-none"
        allowFullScreen
        allow="fullscreen"
      />
    </div>
  )
}
