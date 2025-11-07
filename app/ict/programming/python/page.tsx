"use client"

export default function PythonPage() {
  return (
    <div className="h-screen w-full">
      <iframe
        src="https://www.onlineide.pro/playground/python"
        title="Python Playground"
        className="w-full h-full border-none"
        allowFullScreen
        allow="fullscreen"
      />
    </div>
  )
}