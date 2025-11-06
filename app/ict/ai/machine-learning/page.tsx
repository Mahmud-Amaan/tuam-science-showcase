"use client"

export default function MachineLearningPage() {
  return (
    <div className="h-screen w-full">
      <iframe 
        src="https://simulators.yobee.co.in/"
        title="Machine Learning Simulator"
        className="w-full h-full border-none"
        allowFullScreen
        allow="fullscreen"
      />
    </div>
  )
}