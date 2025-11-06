"use client"

export default function AIPlaygroundPage() {
  return (
    <div className="h-screen w-full">
      <iframe 
        src="https://console.groq.com/playground"
        title="AI Playground - Groq Console"
        className="w-full h-full border-none"
        allowFullScreen
        allow="fullscreen"
      />
    </div>
  )
}