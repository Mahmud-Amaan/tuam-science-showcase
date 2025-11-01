"use client"

import { useState } from "react"
import Header from "@/components/Header"
import AnimatedBackground from "@/components/AnimatedBackground"
import HeroSection from "@/components/HeroSection"
import Stats from "@/components/Stats"
import SubjectCards from "@/components/SubjectCards"
import Features from "@/components/Features"
import Benefits from "@/components/Benefits"
import NCTB from "@/components/NCTB"
import Footer from "@/components/Footer"

export default function Home() {
  const [language, setLanguage] = useState<"en" | "bn">("en")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <AnimatedBackground />

      <Header
        language={language}
        setLanguage={setLanguage}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      <main>
        <HeroSection language={language} />
        <SubjectCards language={language} />
        <Features language={language} />
        <Benefits language={language} />
        <NCTB language={language} />
      </main>
      <Footer language={language} />
    </div>
  )
}
