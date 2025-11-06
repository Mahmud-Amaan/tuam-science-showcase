"use client"

export default function HTMLPage() {
  return (
    <div className="h-screen w-full">
      <iframe
        src="https://playcode.io/html"
        title="PlayCode HTML Editor"
        className="w-full h-full border-none"
        allowFullScreen
        allow="fullscreen"
      />
    </div>
  )
}