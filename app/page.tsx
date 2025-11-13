"use client"

import { useState } from "react"
import { useLanguage } from "@/contexts/LanguageContext"
import Header from "@/components/Header"
import HeroSection from "@/components/HeroSection"
import Features from "@/components/Features"
import Benefits from "@/components/Benefits"
import NCTB from "@/components/NCTB"
import Footer from "@/components/Footer"

export default function Home() {
  const { lang } = useLanguage()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Header
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      <main id="main-content">
        <HeroSection language={lang} />
        <Features language={lang} />
        <Benefits language={lang} />
        <NCTB language={lang} />
      </main>
      <Footer language={lang} />
    </div>
  )
}
