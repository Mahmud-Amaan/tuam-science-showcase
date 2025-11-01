"use client"

export default function MoleculesPage() {
  return (
    <div className="h-screen w-full">
      <iframe
        src="https://phet.colorado.edu/sims/html/molecule-shapes/latest/molecule-shapes_all.html"
        title="PhET Molecule Shapes Simulation"
        className="w-full h-full border-none"
        allowFullScreen
        allow="fullscreen"
      />
    </div>
  )
}
