"use client"
import { useEffect, useState } from "react"
import { Globe, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useLanguage } from "@/contexts/LanguageContext"

interface HeaderProps {
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
}

const Header = ({ mobileMenuOpen, setMobileMenuOpen }: HeaderProps) => {
  const { resolvedTheme, setTheme } = useTheme()
  const { lang, toggleLanguage } = useLanguage()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    if (!mounted) return
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  const isDark = resolvedTheme === "dark"

  return (
    <header
      id="navigation"
      className="sticky top-0 z-50 w-full bg-gradient-to-b from-background/95 via-background/92 to-background/88 dark:from-background/80 dark:via-background/75 dark:to-background/70 backdrop-blur-xl border-b border-blue-200/30 dark:border-border/70 shadow-lg hover:shadow-xl transition-shadow duration-300"
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl" role="img" aria-label="Science laboratory icon">
              🔬
            </div>
            <div>
              <h1 className="text-lg font-bold text-primary hidden sm:block">
                {lang === "en" ? "Virtual Lab" : "ভার্চুয়াল ল্যাব"}
              </h1>
            </div>
          </div>

          {/* Language Toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              disabled={!mounted}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-foreground text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-300 focus:bg-muted/90 disabled:opacity-60"
              aria-label={mounted ? (isDark ? "Switch to light theme" : "Switch to dark theme") : "Toggle theme"}
              aria-pressed={mounted ? isDark : undefined}
            >
              {mounted ? (
                isDark ? <Moon size={16} aria-hidden="true" /> : <Sun size={16} aria-hidden="true" />
              ) : (
                <Sun size={16} aria-hidden="true" className="opacity-0" />
              )}
              <span className="hidden sm:inline">{mounted ? (isDark ? "Dark" : "Light") : "Theme"}</span>
            </button>

            <button
              onClick={toggleLanguage}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  toggleLanguage()
                }
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-foreground text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-300 focus:bg-muted/90"
              aria-label={lang === "en" ? "Switch to Bengali language" : "Switch to English language"}
              aria-pressed={lang === "en"}
              tabIndex={0}
            >
              <Globe size={16} aria-hidden="true" />
              <span>{lang === "en" ? "বাংলা" : "English"}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
