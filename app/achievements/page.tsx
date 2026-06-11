"use client"

import { useState, useEffect, useRef } from "react"
import { Trophy, Calendar, MapPin, ImageIcon, ChevronRight, Star } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function AchievementsPage() {
  const [language, setLanguage] = useState<"en" | "bn">("en")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [countUp, setCountUp] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCountUp(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  const stats = [
    {
      value: "1st",
      labelEn: "Place",
      labelBn: "স্থান",
      icon: Trophy,
      color: "from-yellow-400 to-amber-600",
      glow: "shadow-yellow-500/50",
    },
    {
      value: "2025",
      labelEn: "Year",
      labelBn: "সাল",
      icon: Calendar,
      color: "from-blue-400 to-cyan-600",
      glow: "shadow-blue-500/50",
    },
    {
      value: "Tanzimul Ummah",
      labelEn: "Inter-Science Fair",
      labelBn: "আন্তঃবিজ্ঞান মেলা",
      icon: MapPin,
      color: "from-green-400 to-emerald-600",
      glow: "shadow-green-500/50",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header
        language={language}
        setLanguage={setLanguage}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      <main id="main-content">
        {/* Hero Section */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-primary/5 to-secondary/10">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 text-center px-4 pt-20 pb-16 max-w-4xl mx-auto">
            <div className="mb-8 animate-bounce-in">
              <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 shadow-2xl animate-pulse-glow">
                <Trophy className="w-14 h-14 text-white" strokeWidth={1.5} />
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">
              <span className="bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 bg-clip-text text-transparent animate-gradient">
                {language === "en" ? "Our Achievement" : "আমাদের অর্জন"}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium animate-slide-up" style={{ animationDelay: "0.2s" }}>
              {language === "en"
                ? "A moment of pride, hard work, and recognition at the biggest science festival in the madrasah community."
                : "মাদ্রাসা শিক্ষার ইতিহাসে সবচেয়ে বড় বিজ্ঞান উৎসবে গর্ব, কঠোর পরিশ্রম এবং স্বীকৃতির একটি মুহূর্ত।"}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-8 animate-slide-up" style={{ animationDelay: "0.4s" }}>
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 text-sm font-semibold border border-yellow-500/20">
                <Star size={14} /> {language === "en" ? "1st Place Winner" : "প্রথম স্থান বিজয়ী"}
              </span>
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-semibold border border-blue-500/20">
                <Calendar size={14} /> 2025
              </span>
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-semibold border border-green-500/20">
                <MapPin size={14} /> {language === "en" ? "Tanzimul Ummah" : "তানজিমুল উম্মাহ"}
              </span>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section
          ref={statsRef}
          className="py-16 px-4 bg-gradient-to-b from-background via-muted/20 to-background"
        >
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((stat, idx) => {
                const Icon = stat.icon
                return (
                  <div
                    key={idx}
                    className={`group relative p-8 rounded-2xl border border-border/60 bg-card shadow-lg ${stat.glow}/10 hover:${stat.glow}/30 transition-all duration-500 hover:-translate-y-2 overflow-hidden`}
                    style={{ animation: `slide-up 0.6s ease-out ${idx * 0.15}s backwards` }}
                  >
                    <div className={`absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br ${stat.color} rounded-full opacity-10 group-hover:opacity-20 transition-opacity blur-2xl`} />
                    <div className="relative z-10 flex flex-col items-center text-center">
                      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <span className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                        {countUp ? (
                          <span className="animate-counter-up">{stat.value}</span>
                        ) : (
                          stat.value
                        )}
                      </span>
                      <span className="text-sm text-muted-foreground font-medium">
                        {language === "en" ? stat.labelEn : stat.labelBn}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {language === "en" ? "The Journey" : "যাত্রাপথ"}
              </span>
            </h2>

            <div className="space-y-6 text-muted-foreground leading-relaxed">
              {language === "en" ? (
                <>
                  <p className="text-lg animate-slide-up" style={{ animationDelay: "0.1s" }}>
                    Tanzimul Ummah Inter-Science Fair was the biggest science festival in the history of the madrasah education system — bringing together the brightest young minds from across the country. Competing here was not just an honor; it was a battlefield of ideas, creativity, and scientific excellence.
                  </p>
                  <p className="text-lg animate-slide-up" style={{ animationDelay: "0.2s" }}>
                    Our project — the <strong>Virtual Lab</strong> — was built from the ground up to solve a real problem: making science education accessible, interactive, and engaging for madrasah students who often lack proper lab facilities. We demonstrated live simulations in physics, chemistry, and biology, showing how technology can bridge the gap between traditional learning and modern science.
                  </p>
                  <p className="text-lg animate-slide-up" style={{ animationDelay: "0.3s" }}>
                    The judges were impressed by the real-time 3D simulations, the bilingual support (English &amp; Bengali), and the practical impact this platform could have on thousands of students. After rounds of evaluation, presentations, and live demonstrations — we were awarded <strong>1st Place</strong>.
                  </p>
                  <p className="text-lg animate-slide-up font-medium text-foreground" style={{ animationDelay: "0.4s" }}>
                    This achievement is dedicated to every madrasah student who dreams of exploring science beyond the textbook. Virtual Lab is proof that innovation knows no boundaries.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-lg animate-slide-up" style={{ animationDelay: "0.1s" }}>
                    তানজিমুল উম্মাহ আন্তঃবিজ্ঞান মেলা ছিল মাদ্রাসা শিক্ষা ব্যবস্থার ইতিহাসে সবচেয়ে বড় বিজ্ঞান উৎসব — যা সারা দেশ থেকে মেধাবী তরুণদের একত্রিত করেছিল। এখানে প্রতিযোগিতা করা শুধু সম্মানের বিষয় ছিল না; এটি ছিল ধারণা, সৃজনশীলতা এবং বৈজ্ঞানিক উৎকর্ষের একটি যুদ্ধক্ষেত্র।
                  </p>
                  <p className="text-lg animate-slide-up" style={{ animationDelay: "0.2s" }}>
                    আমাদের প্রকল্প — <strong>ভার্চুয়াল ল্যাব</strong> — একটি বাস্তব সমস্যা সমাধানের জন্য শুরু থেকে তৈরি করা হয়েছিল: মাদ্রাসার শিক্ষার্থীদের জন্য বিজ্ঞান শিক্ষাকে সহজলভ্য, ইন্টারঅ্যাক্টিভ এবং আকর্ষণীয় করে তোলা, যাদের প্রায়ই পর্যাপ্ত ল্যাব সুবিধার অভাব থাকে। আমরা পদার্থবিদ্যা, রসায়ন এবং জীববিজ্ঞানে লাইভ সিমুলেশন প্রদর্শন করেছি, দেখিয়েছি কীভাবে প্রযুক্তি ঐতিহ্যগত শিক্ষা এবং আধুনিক বিজ্ঞানের মধ্যে ব্যবধান দূর করতে পারে।
                  </p>
                  <p className="text-lg animate-slide-up" style={{ animationDelay: "0.3s" }}>
                    বিচারকরা রিয়েল-টাইম 3D সিমুলেশন, দ্বিভাষিক সমর্থন (ইংরেজি ও বাংলা) এবং এই প্ল্যাটফর্মের ব্যবহারিক প্রভাব দ্বারা মুগ্ধ হয়েছিলেন যা হাজার হাজার শিক্ষার্থীর কাছে পৌঁছাতে পারে। মূল্যায়ন, উপস্থাপনা এবং লাইভ প্রদর্শনের পর — আমরা <strong>প্রথম স্থান</strong> অর্জন করি।
                  </p>
                  <p className="text-lg animate-slide-up font-medium text-foreground" style={{ animationDelay: "0.4s" }}>
                    এই অর্জন প্রতিটি মাদ্রাসা শিক্ষার্থীর জন্য উৎসর্গীকৃত যারা পাঠ্যবইয়ের বাইরে বিজ্ঞান অন্বেষণের স্বপ্ন দেখে। ভার্চুয়াল ল্যাব প্রমাণ যে উদ্ভাবনের কোনো সীমানা নেই।
                  </p>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Proof Image Section */}
        <section className="py-16 px-4 bg-gradient-to-b from-background via-muted/10 to-background">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {language === "en" ? "Proof of Achievement" : "প্রমাণ"}
              </span>
            </h2>
            <p className="text-center text-muted-foreground mb-10 max-w-xl mx-auto">
              {language === "en"
                ? "Our certificate and winning moment at Tanzimul Ummah Inter-Science Fair 2025"
                : "তানজিমুল উম্মাহ আন্তঃবিজ্ঞান মেলা ২০২৫-এ আমাদের সার্টিফিকেট এবং বিজয়ের মুহূর্ত"}
            </p>

            <div className="group relative rounded-3xl overflow-hidden border border-border/60 shadow-xl shadow-primary/10 hover:shadow-primary/20 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
              <ImageIcon className="absolute top-4 right-4 z-20 w-6 h-6 text-white/60" />
              <img
                src="/Science-fair.jpg"
                alt={language === "en" ? "Science Fair Certificate and Award" : "বিজ্ঞান মেলা সার্টিফিকেট এবং পুরস্কার"}
                className="w-full h-auto object-cover rounded-3xl"
              />
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 px-4 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              {language === "en" ? "Whats Next?" : "এরপর কী?"}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              {language === "en"
                ? "This is just the beginning. Virtual Lab is growing — more simulations, more subjects, and more impact."
                : "এটি শুধু শুরু। ভার্চুয়াল ল্যাব বাড়ছে — আরও সিমুলেশন, আরও বিষয় এবং আরও প্রভাব।"}
            </p>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1"
            >
              {language === "en" ? "Explore Virtual Lab" : "ভার্চুয়াল ল্যাব অন্বেষণ করুন"}
              <ChevronRight size={18} />
            </a>
          </div>
        </section>
      </main>
      <Footer language={language} />
    </div>
  )
}
