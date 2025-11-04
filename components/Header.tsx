"use client"
import { Globe } from "lucide-react"

interface HeaderProps {
  language: "en" | "bn"
  setLanguage: (lang: "en" | "bn") => void
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
}

const Header = ({ language, setLanguage, mobileMenuOpen, setMobileMenuOpen }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-b from-white/95 via-white/90 to-white/80 backdrop-blur-xl border-b border-blue-200/30 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl">
              🔬
            </div>
            <div>
              <h1 className="text-lg font-bold text-primary hidden sm:block">
                {language === "en" ? "Virtual Lab" : "ভার্চুয়াল ল্যাব"}
              </h1>
            </div>
          </div>

          {/* Language Toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLanguage(language === "en" ? "bn" : "en")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-foreground text-sm font-medium"
            >
              <Globe size={16} />
              <span>{language === "en" ? "বাংলা" : "English"}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
