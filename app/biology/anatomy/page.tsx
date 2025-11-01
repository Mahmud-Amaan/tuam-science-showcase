"use client"

export default function AnatomyPage() {
  return (
    <div className="h-screen w-full">
      <iframe 
        src="https://sketchfab.com/models/9b0b079953b840bc9a13f524b60041e4/embed"
        title="Human Body Anatomy on Sketchfab"
        className="w-full h-full border-none"
        allowFullScreen
        allow="autoplay; fullscreen; xr-spatial-tracking"
      />
    </div>
  )
}