"use client"

import { useState } from "react"
import Header from "@/components/Header"
import HeroSection from "@/components/HeroSection"
import SubjectCards from "@/components/SubjectCards"
import Features from "@/components/Features"
import Benefits from "@/components/Benefits"
import NCTB from "@/components/NCTB"
import Footer from "@/components/Footer"
import KeyboardShortcuts from "@/components/KeyboardShortcuts"

export default function Home() {
  const [language, setLanguage] = useState<"en" | "bn">("en")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleShortcut = (action: string) => {
    switch (action) {
      case 'language-toggle':
        setLanguage(language === "en" ? "bn" : "en")
        break
      case 'help':
        // Could show help modal
        break
      case 'escape':
        setMobileMenuOpen(false)
        break
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <KeyboardShortcuts language={language} onShortcut={handleShortcut} />

      <Header
        language={language}
        setLanguage={setLanguage}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      <main id="main-content">
        <HeroSection language={language} />
        <Features language={language} />
        <Benefits language={language} />
        <NCTB language={language} />
      </main>
      <Footer language={language} />
    </div>
  )
}
