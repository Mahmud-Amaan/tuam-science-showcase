"use client"

interface HeaderProps {
  language: "en" | "bn"
  onLanguageChange: (lang: "en" | "bn") => void
}

export default function Header({ language, onLanguageChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-lg font-bold text-primary-foreground">𝒇</span>
          </div>
          <div>
            <h1 className="font-bold text-foreground">{language === "en" ? "Math Simulator" : "গণিত সিমুলেটর"}</h1>
            <p className="text-xs text-muted-foreground">{language === "en" ? "NCTB Curriculum" : "এনসিটিবি পাঠ্যক্রম"}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <nav className="hidden md:flex gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition">
              {language === "en" ? "Simulations" : "সিমুলেশন"}
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition">
              {language === "en" ? "Resources" : "সম্পদ"}
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition">
              {language === "en" ? "About" : "সম্পর্কে"}
            </a>
          </nav>

          <div className="flex items-center gap-2 pl-4 border-l border-border">
            <button
              onClick={() => onLanguageChange("en")}
              className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-colors ${
                language === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange("bn")}
              className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-colors ${
                language === "bn" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              বাংলা
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
