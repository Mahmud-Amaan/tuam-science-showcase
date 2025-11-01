"use client"

import { Menu, X, Globe } from "lucide-react"

interface TopNavbarProps {
  activeSimulation: string
  onSimulationChange: (id: string) => void
  simulations: any[]
  language: "en" | "bn"
  onLanguageChange: (lang: "en" | "bn") => void
  onToggleSidebar: () => void
  sidebarOpen: boolean
}

export default function TopNavbar({
  activeSimulation,
  onSimulationChange,
  simulations,
  language,
  onLanguageChange,
  onToggleSidebar,
  sidebarOpen,
}: TopNavbarProps) {
  const functionSims = simulations.filter((s) => s.category === "Functions")
  const geometrySims = simulations.filter((s) => s.category === "Geometry")

  return (
    <nav className="bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 border-b border-border sticky top-0 z-50">
      <div className="px-6 py-4 flex items-center justify-between gap-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-white font-bold text-lg">π</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">
              {language === "en" ? "Math Simulator" : "গণিত সিমুলেটর"}
            </h1>
            <p className="text-xs text-muted-foreground">NCTB Class 9</p>
          </div>
        </div>

        {/* Simulation Tabs */}
        <div className="flex items-center gap-2 flex-1 max-w-2xl">
          <div className="flex gap-1 flex-wrap">
            {functionSims.map((sim) => (
              <button
                key={sim.id}
                onClick={() => onSimulationChange(sim.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeSimulation === sim.id
                    ? "bg-primary text-white shadow-lg"
                    : "bg-muted text-muted-foreground hover:bg-muted/70"
                }`}
              >
                {sim.label[language]}
              </button>
            ))}
          </div>

          <div className="w-px h-6 bg-border" />

          <div className="flex gap-1 flex-wrap">
            {geometrySims.map((sim) => (
              <button
                key={sim.id}
                onClick={() => onSimulationChange(sim.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeSimulation === sim.id
                    ? "bg-accent text-white shadow-lg"
                    : "bg-muted text-muted-foreground hover:bg-muted/70"
                }`}
              >
                {sim.label[language]}
              </button>
            ))}
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <button
            onClick={() => onLanguageChange(language === "en" ? "bn" : "en")}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-secondary/10 transition-all text-sm font-medium"
          >
            <Globe className="w-4 h-4" />
            {language === "en" ? "EN" : "বাঙ্গালি"}
          </button>

          {/* Guide Sidebar Toggle */}
          <button
            onClick={onToggleSidebar}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              sidebarOpen ? "bg-primary text-white shadow-lg" : "bg-accent/10 text-accent hover:bg-accent/20"
            }`}
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            {sidebarOpen ? (language === "en" ? "Close" : "বন্ধ") : language === "en" ? "Guide" : "গাইড"}
          </button>
        </div>
      </div>
    </nav>
  )
}
