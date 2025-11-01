"use client"

import { useState } from "react"
import SimulationCanvas from "./simulation-canvas"
import GuideSidebar from "./guide-sidebar"

export default function MathSimulator() {
  const [language, setLanguage] = useState<"en" | "bn">("en")
  const [activeSimulation, setActiveSimulation] = useState("linear")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [navOpen, setNavOpen] = useState(false)

  const simulations = [
    { id: "linear", label: { en: "Linear", bn: "রৈখিক" }, category: "Functions" },
    { id: "quadratic", label: { en: "Quadratic", bn: "দ্বিঘাত" }, category: "Functions" },
    { id: "exponential", label: { en: "Exponential", bn: "সূচকীয়" }, category: "Functions" },
    { id: "gradient", label: { en: "Slope", bn: "ঢাল" }, category: "Geometry" },
    { id: "distance", label: { en: "Distance", bn: "দূরত্ব" }, category: "Geometry" },
    { id: "circle", label: { en: "Circle", bn: "বৃত্ত" }, category: "Geometry" },
    { id: "triangle", label: { en: "Triangle", bn: "ত্রিভুজ" }, category: "Geometry" },
    { id: "square", label: { en: "Rectangle", bn: "আয়তক্ষেত্র" }, category: "Geometry" },
  ]

  const currentLabel = simulations.find((s) => s.id === activeSimulation)?.label[language] || "Simulation"

  return (
    <div className="h-screen w-full bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 relative overflow-hidden">
        <SimulationCanvas simulation={activeSimulation} language={language} />

        {/* Floating Control Buttons - Responsive Positioning */}
        <div className="absolute top-3 left-3 sm:top-6 sm:left-6 z-40 flex gap-2 sm:gap-3">
          <button
            onClick={() => setNavOpen(!navOpen)}
            className="bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white p-2.5 sm:p-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0"
            title={language === "en" ? "Menu" : "মেনু"}
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white p-2.5 sm:p-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0"
            title={language === "en" ? "Guide" : "গাইড"}
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>

        {/* Title Badge - Responsive */}
        <div className="absolute top-3 right-3 sm:top-6 sm:right-6 z-40 bg-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-bold text-sm sm:text-base text-indigo-900 shadow-lg border-2 border-indigo-200">
          {currentLabel}
        </div>
      </div>

      {/* Navigation Menu - Responsive Modal */}
      {navOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-start p-3 sm:p-6 pt-20 sm:pt-24 pointer-events-none">
          <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 max-w-xs w-full border-2 border-indigo-200 pointer-events-auto animate-in fade-in slide-in-from-left-5">
            <div className="space-y-3 sm:space-y-4">
              {["Functions", "Geometry"].map((category) => (
                <div key={category}>
                  <h3 className="text-xs font-bold text-slate-900 mb-2 uppercase tracking-wider">{category}</h3>
                  <div className="space-y-1 sm:space-y-2">
                    {simulations
                      .filter((s) => s.category === category)
                      .map((sim) => (
                        <button
                          key={sim.id}
                          onClick={() => {
                            setActiveSimulation(sim.id)
                            setNavOpen(false)
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                            activeSimulation === sim.id
                              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                              : "text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          {sim.label[language]}
                        </button>
                      ))}
                  </div>
                </div>
              ))}
              <button
                onClick={() => setLanguage(language === "en" ? "bn" : "en")}
                className="w-full px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-900 font-bold hover:from-indigo-200 hover:to-blue-200 text-xs sm:text-sm transition-all mt-2 sm:mt-4"
              >
                {language === "en" ? "বাংলা" : "English"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Guide Sidebar - Responsive Modal */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-end p-3 sm:p-6 pt-20 sm:pt-24 pointer-events-none">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full max-h-[calc(100vh-140px)] overflow-auto border-2 border-amber-200 pointer-events-auto animate-in fade-in slide-in-from-right-5">
            <GuideSidebar simulation={activeSimulation} language={language} onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

    
    </div>
  )
}
