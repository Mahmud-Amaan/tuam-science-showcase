"use client"

export default function LogicGatesPage() {
  return (
    <div className="h-screen w-full">
      <iframe 
        src="https://academo.org/demos/logic-gate-simulator/"
        title="Logic Gates Interactive Simulation"
        className="w-full h-full border-none"
        allowFullScreen
        allow="fullscreen"
      />
    </div>
  )
}