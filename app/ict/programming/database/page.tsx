"use client"

export default function DatabasePage() {
  return (
    <div className="h-screen w-full">
      <iframe
        src="https://runsql.com/r"
        title="RunSQL Database Editor"
        className="w-full h-full border-none"
        allowFullScreen
        allow="fullscreen"
      />
    </div>
  )
}