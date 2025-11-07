"use client"

export default function VectorPage() {
  return (
    <div className="h-screen w-full">
      <iframe
        src="https://phet.colorado.edu/sims/html/vector-addition/latest/vector-addition_all.html"
        title="PhET Vector Addition Simulation"
        className="w-full h-full border-none"
        allowFullScreen
      />
    </div>
  )
}
