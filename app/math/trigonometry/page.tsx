"use client"

export default function TrigonometryPage() {
  return (
    <div className="min-h-screen w-full bg-background">
      <iframe
        src="https://phet.colorado.edu/sims/html/trig-tour/latest/trig-tour_all.html"
        title="PhET Interactive Trigonometry Tour"
        className="w-full h-[calc(100vh-2rem)] md:h-screen border-none"
        allowFullScreen
        allow="fullscreen"
      />
    </div>
  )
}
