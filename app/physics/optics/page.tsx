"use client"

export default function GeometricOpticsPage() {
  return (
    <div className="h-screen w-full">
      <iframe 
        src="https://phet.colorado.edu/sims/html/geometric-optics/latest/geometric-optics_all.html"
        title="PhET Geometric Optics Interactive Simulation"
        className="w-full h-full border-none"
        allowFullScreen
        allow="fullscreen"
      />
    </div>
  )
}