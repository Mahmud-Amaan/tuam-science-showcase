"use client"

export default function SolarSystemPage() {
  return (
    <div className="h-screen w-full">
      <iframe 
        src="https://eyes.nasa.gov/apps/solar-system/"
        title="NASA Eyes on the Solar System"
        className="w-full h-full border-none"
        allowFullScreen
        allow="fullscreen; xr-spatial-tracking"
      />
    </div>
  )
}