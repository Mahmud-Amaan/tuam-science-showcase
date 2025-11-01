"use client"

export default function AtomsPage() {
  return (
    <div className="h-screen w-full">
      <iframe 
        src="https://phet.colorado.edu/sims/html/build-an-atom/latest/build-an-atom_all.html"
        title="PhET Build-an-Atom Interactive Simulation"
        className="w-full h-full border-none"
        allowFullScreen
        allow="fullscreen"
      />
    </div>
  )
}