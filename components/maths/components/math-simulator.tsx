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
    <div className="h-screen w-full bg-linear-to-br from-slate-900 via-indigo-950 to-blue-900 flex flex-col overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%234338ca\' fill-opacity=\'0.08\' fill-rule=\'evenodd\'/%3E%3C/svg%3E')] opacity-30"></div>

      {/* Main Content Area */}
      <div className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 backdrop-blur-[2px]"></div>
        <SimulationCanvas simulation={activeSimulation} language={language} />

        {/* Floating Control Panel - Enhanced Glass UI */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40">
          <div className="relative">
            {/* Backdrop blur and glow effects */}
            <div className="absolute -inset-6 bg-linear-to-r from-purple-500/20 to-indigo-500/20 rounded-full blur-xl"></div>
            <div className="relative flex gap-3 sm:gap-4 bg-white/10 backdrop-blur-xl p-2 rounded-full border border-white/20 shadow-2xl">
              <button
                onClick={() => setNavOpen(!navOpen)}
                className="group bg-white/10 hover:bg-white/20 text-white p-3 rounded-full shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 hover:scale-105 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shrink-0 overflow-hidden"
                title={language === "en" ? "Menu" : "মেনু"}
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white/80 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <div className="absolute inset-0 rounded-full bg-linear-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>

              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="group bg-white/10 hover:bg-white/20 text-white p-3 rounded-full shadow-lg hover:shadow-amber-500/25 transition-all duration-300 hover:scale-105 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shrink-0"
                title={language === "en" ? "Guide" : "গাইড"}
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white/80 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="absolute inset-0 rounded-full bg-linear-to-r from-amber-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>

              <button
                onClick={() => setLanguage(language === "en" ? "bn" : "en")}
                className="group bg-white/10 hover:bg-white/20 text-white p-3 rounded-full shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shrink-0"
                title={language === "en" ? "Switch to Bengali" : "Switch to English"}
              >
                <span className="text-sm font-bold text-white/80 group-hover:text-white transition-colors">{language === "en" ? "বাং" : "EN"}</span>
                <div className="absolute inset-0 rounded-full bg-linear-to-r from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Active Simulation Badge - Enhanced Glass UI */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-40">
          <div className="relative group">
            {/* Backdrop blur and glow effects */}
            <div className="absolute -inset-3 bg-linear-to-r from-purple-500/20 to-indigo-500/20 rounded-lg blur-xl transition-all duration-500 group-hover:from-purple-500/30 group-hover:to-indigo-500/30"></div>
            <div className="relative px-4 py-2 bg-white/10 backdrop-blur-xl rounded-lg font-medium text-sm sm:text-base text-white/90 border border-white/20 shadow-2xl flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              {currentLabel}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu - Glass Morphism Modal */}
      {navOpen && (
        <>
          <div 
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setNavOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-full max-w-xs sm:max-w-sm">
            <div className="h-full bg-slate-900/95 backdrop-blur-xl border-r border-white/10 p-6 text-white shadow-2xl animate-in slide-in-from-left duration-300">
              {/* Close button */}
              <button
                onClick={() => setNavOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors group"
              >
                <svg className="w-5 h-5 text-white/70 group-hover:text-white/90 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              {/* Decorative elements */}
              <div className="absolute top-6 right-6 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-8 -left-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>

              {/* Content */}
              <div className="mt-8 space-y-6">
                {/* Profile Section */}
                <div className="text-center mb-8">
                  <div className="inline-block p-2 rounded-xl bg-white/5 backdrop-blur-sm">
                    <div className="w-16 h-16 rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <h2 className="mt-3 text-lg font-semibold text-white/90">Math Simulator</h2>
                  <p className="mt-1 text-sm text-white/60">{language === "en" ? "Interactive Learning" : "ইন্টারেক্টিভ লার্নিং"}</p>
                </div>

                {/* Categories */}
                {["Functions", "Geometry"].map((category) => (
                  <div key={category} className="relative">
                    <h3 className="text-sm font-bold text-indigo-300 mb-3 uppercase tracking-wider flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mr-2"></span>
                      {category}
                    </h3>
                    <div className="space-y-1">
                      {simulations
                        .filter((s) => s.category === category)
                        .map((sim) => (
                          <button
                            key={sim.id}
                            onClick={() => {
                              setActiveSimulation(sim.id)
                              setNavOpen(false)
                            }}
                            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all group relative ${
                              activeSimulation === sim.id
                                ? "bg-white/20 text-white shadow-lg"
                                : "text-white/70 hover:bg-white/10 hover:text-white"
                            }`}
                          >
                            <div className="relative z-10 flex items-center">
                              <span className="mr-3">
                                {category === "Functions" ? (
                                  <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                                  </svg>
                                ) : (
                                  <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                                  </svg>
                                )}
                              </span>
                              {sim.label[language]}
                            </div>
                            {activeSimulation === sim.id && (
                              <div className="absolute inset-0 bg-linear-to-r from-indigo-500/10 to-purple-500/10 rounded-lg"></div>
                            )}
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Guide Sidebar - Glass Morphism Modal */}
      {sidebarOpen && (
        <>
          <div 
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm">
            <div className="h-full bg-slate-900/95 backdrop-blur-xl border-l border-white/10 p-6 text-white shadow-2xl animate-in slide-in-from-right duration-300">
              {/* Close button */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 left-4 p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="mt-8">
                <GuideSidebar simulation={activeSimulation} language={language} onClose={() => setSidebarOpen(false)} />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Footer - Glass Morphism Style */}
      <div className="relative">
        <div className="absolute inset-0 bg-linear-to-r from-slate-900/80 to-indigo-900/80 backdrop-blur-md"></div>
        <div className="relative px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-white/90 text-sm font-medium">NCTB Math Simulator</span>
          </div>
          <div className="text-white/60 text-sm">
            {language === "en" ? "Interactive Learning Platform" : "ইন্টারঅ্যাক্টিভ লার্নিং প্ল্যাটফর্ম"}
          </div>
        </div>
      </div>
    </div>
  )
}
