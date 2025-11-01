"use client"

import { useEffect, useState } from "react"
import { ChevronRight, Zap } from "lucide-react"

interface HeroProps {
  language: "en" | "bn"
}

const HeroSection = ({ language }: HeroProps) => {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-blue-50/40 to-cyan-50/30 pt-20 pb-20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-300/15 rounded-full blur-3xl animate-float" />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-green-400/20 to-blue-300/15 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-cyan-300/15 to-transparent rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "4s" }}
        />
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
              animation: `float ${3 + i}s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-20 max-w-5xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-white/80 backdrop-blur-md border border-blue-200/60 rounded-full shadow-xl hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:scale-105 animate-bounce-in">
          <Zap size={16} className="text-blue-600 animate-pulse" />
          <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            {language === "en" ? "🏆 Award-winning Learning Platform" : "🏆 পুরস্কার বিজয়ী শেখার প্ল্যাটফর্ম"}
          </span>
        </div>

        <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
          <span className="block bg-gradient-to-r from-blue-600 via-cyan-600 to-green-600 bg-clip-text text-transparent animate-gradient pb-2">
            {language === "en" ? "Explore Science" : "বিজ্ঞান অন্বেষণ করুন"}
          </span>
          <span className="block bg-gradient-to-r from-green-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent animate-gradient">
            {language === "en" ? "Like Never Before" : "আগের চেয়ে ভিন্নভাবে"}
          </span>
        </h1>

        <p
          className="text-lg md:text-xl text-slate-700 mb-12 max-w-2xl mx-auto leading-relaxed font-medium animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          {language === "en"
            ? "Master NCTB curriculum concepts through interactive 3D simulations. Visualize complex phenomena, experiment safely, and transform your learning experience."
            : "ইন্টারঅ্যাক্টিভ 3D সিমুলেশনের মাধ্যমে এনসিটিবি পাঠ্যক্রম ধারণা আয়ত্ত করুন। জটিল ঘটনা দেখুন এবং নিরাপদে পরীক্ষা করুন।"}
        </p>

        <button 
          onClick={() => {
            // Scroll to subject cards section
            document.getElementById("subject-cards")?.scrollIntoView({ behavior: "smooth" })
          }}
          className="inline-flex items-center gap-2 px-8 py-4 mb-20 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-blue-500/60 transition-all duration-300 transform hover:scale-110 active:scale-95 animate-pulse-glow"
        >
          {language === "en" ? "Start Exploring Now" : "এখনই অন্বেষণ শুরু করুন"}
          <ChevronRight size={20} className="animate-bounce" style={{ animationDuration: "1.5s" }} />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: "🧮",
              label: language === "en" ? "Math" : "গণিত",
              color: "from-amber-400/80",
              desc: "Algebra & Geometry",
            },
            {
              icon: "⚛️",
              label: language === "en" ? "Physics" : "পদার্থবিদ্যা",
              color: "from-blue-400/80",
              desc: "Motion & Energy",
            },
            {
              icon: "🧪",
              label: language === "en" ? "Chemistry" : "রসায়ন",
              color: "from-green-400/80",
              desc: "Reactions & Atoms",
            },
            {
              icon: "🌿",
              label: language === "en" ? "Biology" : "জীববিজ্ঞান",
              color: "from-orange-400/80",
              desc: "Life & Cells",
            },
          ].map((subject, idx) => (
            <button
              key={idx}
              onClick={() => {
                // Scroll to subject cards and highlight the selected subject
                document.getElementById("subject-cards")?.scrollIntoView({ behavior: "smooth" })
              }}
              className={`group relative p-6 rounded-xl bg-gradient-to-br ${subject.color} to-transparent backdrop-blur-md border border-white/40 hover:border-white/80 cursor-pointer transform transition-all duration-300 hover:scale-110 hover:shadow-2xl shadow-lg overflow-hidden`}
              style={{ animation: `bounce-in 0.6s ease-out ${idx * 0.1}s backwards` }}
            >
              <div
                className={`absolute inset-0 rounded-xl bg-gradient-to-br ${subject.color} to-transparent opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-300 -z-10`}
              />

              <div className="text-4xl mb-2 group-hover:scale-150 transition-transform duration-300 inline-block group-hover:rotate-12">
                {subject.icon}
              </div>
              <p className="text-sm font-bold text-white drop-shadow-lg">{subject.label}</p>
              <p className="text-xs text-white/80 drop-shadow-md mt-1">{subject.desc}</p>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HeroSection
