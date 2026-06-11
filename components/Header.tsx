"use client"
import { useEffect, useState } from "react"
import { Globe, Moon, Sun, Home, Trophy, BookOpen, ChevronDown } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface HeaderProps {
  language: "en" | "bn"
  setLanguage: (lang: "en" | "bn") => void
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
}

const subjects = [
  { label: "Physics", labelBn: "পদার্থবিদ্যা", href: "/physics" },
  { label: "Chemistry", labelBn: "রসায়ন", href: "/chemistry" },
  { label: "Biology", labelBn: "জীববিজ্ঞান", href: "/biology" },
  { label: "Math", labelBn: "গণিত", href: "/math" },
  { label: "ICT", labelBn: "আইসিটি", href: "/ict" },
]

const Header = ({ language, setLanguage, mobileMenuOpen, setMobileMenuOpen }: HeaderProps) => {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [subjectsOpen, setSubjectsOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    if (!mounted) return
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  const isDark = resolvedTheme === "dark"

  const navLinks = [
    { label: "Home", labelBn: "হোম", href: "/", icon: Home },
    { label: "Achievements", labelBn: "অর্জন", href: "/achievements", icon: Trophy },
  ]

  return (
    <header
      id="navigation"
      className="sticky top-0 z-50 w-full bg-gradient-to-b from-background/95 via-background/92 to-background/88 dark:from-background/80 dark:via-background/75 dark:to-background/70 backdrop-blur-xl border-b border-blue-200/30 dark:border-border/70 shadow-lg hover:shadow-xl transition-shadow duration-300"
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl" role="img" aria-label="Science laboratory icon">
              🔬
            </div>
            <div>
              <h1 className="text-lg font-bold text-primary hidden sm:block">
                {language === "en" ? "Virtual Lab" : "ভার্চুয়াল ল্যাব"}
              </h1>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1" aria-label={language === "en" ? "Main navigation" : "প্রধান নেভিগেশন"}>
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-primary/15 text-primary shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  <Icon size={16} aria-hidden="true" />
                  <span>{language === "en" ? link.label : link.labelBn}</span>
                </Link>
              )
            })}

            {/* Subjects Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setSubjectsOpen(true)}
              onMouseLeave={() => setSubjectsOpen(false)}
            >
              <button
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname.startsWith("/physics") || pathname.startsWith("/chemistry") || pathname.startsWith("/biology") || pathname.startsWith("/math") || pathname.startsWith("/ict")
                    ? "bg-primary/15 text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
                aria-expanded={subjectsOpen}
                aria-haspopup="true"
              >
                <BookOpen size={16} aria-hidden="true" />
                <span>{language === "en" ? "Subjects" : "বিষয়"}</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${subjectsOpen ? "rotate-180" : ""}`} aria-hidden="true" />
              </button>

              {subjectsOpen && (
                <div
                  className="absolute top-full right-0 mt-1 w-44 rounded-xl border border-border/60 bg-card shadow-xl backdrop-blur-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
                  role="menu"
                >
                  {subjects.map((sub) => {
                    const isSubActive = pathname === sub.href || pathname.startsWith(sub.href + "/")
                    return (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className={`flex items-center gap-2 px-4 py-2.5 text-sm transition-colors ${
                          isSubActive
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        }`}
                        role="menuitem"
                      >
                        <span>{language === "en" ? sub.label : sub.labelBn}</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Mobile nav */}
          <div className="flex md:hidden items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1 px-2 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                  aria-label={language === "en" ? link.label : link.labelBn}
                >
                  <Icon size={16} aria-hidden="true" />
                </Link>
              )
            })}
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-2">
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
              onClick={() => setLanguage(language === "en" ? "bn" : "en")}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setLanguage(language === "en" ? "bn" : "en")
                }
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-foreground text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-300 focus:bg-muted/90"
              aria-label={language === "en" ? "Switch to Bengali language" : "Switch to English language"}
              aria-pressed={language === "en"}
              tabIndex={0}
            >
              <Globe size={16} aria-hidden="true" />
              <span>{language === "en" ? "বাংলা" : "English"}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
