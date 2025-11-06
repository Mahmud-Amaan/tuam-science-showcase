"use client"

export default function CircuitConstructionPage() {
  return (
    <div className="h-screen w-full">
      <iframe
        src="https://phet.colorado.edu/sims/html/circuit-construction-kit-dc-virtual-lab/latest/circuit-construction-kit-dc-virtual-lab_all.html"
        title="PhET Circuit Construction Kit - DC Virtual Lab"
        className="w-full h-full border-none"
        allowFullScreen
        allow="fullscreen"
      />
    </div>
  )
}