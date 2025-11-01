"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronRight, Zap, Calculator, Atom, FlaskConical, Leaf } from "lucide-react"

interface HeroProps {
  language: "en" | "bn"
}

const HeroSection = ({ language }: HeroProps) => {
  const [scrollY, setScrollY] = useState(0)
  const router = useRouter()

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
        <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 bg-white/80 backdrop-blur-md border border-blue-200/60 rounded-full shadow-lg hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:scale-105 animate-bounce-in">
          <Zap size={14} className="text-blue-600 animate-pulse" />
          <span className="text-xs font-medium bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            {language === "en" ? "🏆 Award-winning Learning Platform" : "🏆 পুরস্কার বিজয়ী শেখার প্ল্যাটফর্ম"}
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          <span className="block bg-gradient-to-r from-blue-600 via-cyan-600 to-green-600 bg-clip-text text-transparent animate-gradient pb-1">
            {language === "en" ? "Explore Science" : "বিজ্ঞান অন্বেষণ করুন"}
          </span>
          <span className="block bg-gradient-to-r from-green-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent animate-gradient">
            {language === "en" ? "Like Never Before" : "আগের চেয়ে ভিন্নভাবে"}
          </span>
        </h1>

        <p
          className="text-sm md:text-base text-slate-700 mb-16 max-w-2xl mx-auto leading-relaxed font-medium animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          {language === "en"
            ? "Master NCTB curriculum concepts through interactive 3D simulations. Visualize complex phenomena, experiment safely, and transform your learning experience."
            : "ইন্টারঅ্যাক্টিভ 3D সিমুলেশনের মাধ্যমে এনসিটিবি পাঠ্যক্রম ধারণা আয়ত্ত করুন। জটিল ঘটনা দেখুন এবং নিরাপদে পরীক্ষা করুন।"}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            {
              icon: Calculator,
              label: language === "en" ? "Math" : "গণিত",
              desc: "Algebra & Geometry",
              route: "/math",
              gradient: "from-amber-500 via-yellow-400 to-amber-600",
              glow: "shadow-amber-500/50",
              hoverGlow: "group-hover:shadow-amber-500/80",
              borderGlow: "border-amber-400/60 group-hover:border-amber-300",
            },
            {
              icon: Atom,
              label: language === "en" ? "Physics" : "পদার্থবিদ্যা",
              desc: "Motion & Energy",
              route: "/physics",
              gradient: "from-blue-500 via-cyan-400 to-blue-600",
              glow: "shadow-blue-500/50",
              hoverGlow: "group-hover:shadow-blue-500/80",
              borderGlow: "border-blue-400/60 group-hover:border-blue-300",
            },
            {
              icon: FlaskConical,
              label: language === "en" ? "Chemistry" : "রসায়ন",
              desc: "Reactions & Atoms",
              route: "/chemistry",
              gradient: "from-green-500 via-emerald-400 to-green-600",
              glow: "shadow-green-500/50",
              hoverGlow: "group-hover:shadow-green-500/80",
              borderGlow: "border-green-400/60 group-hover:border-green-300",
            },
            {
              icon: Leaf,
              label: language === "en" ? "Biology" : "জীববিজ্ঞান",
              desc: "Life & Cells",
              route: "/biology",
              gradient: "from-orange-500 via-red-400 to-orange-600",
              glow: "shadow-orange-500/50",
              hoverGlow: "group-hover:shadow-orange-500/80",
              borderGlow: "border-orange-400/60 group-hover:border-orange-300",
            },
          ].map((subject, idx) => {
            const IconComponent = subject.icon
            return (
            <button
              key={idx}
              onClick={() => {
                router.push(subject.route)
              }}
              className={`group relative p-10 md:p-12 rounded-2xl bg-gradient-to-br ${subject.gradient} border-2 ${subject.borderGlow} cursor-pointer transform transition-all duration-500 hover:scale-110 hover:-translate-y-2 ${subject.glow} ${subject.hoverGlow} shadow-2xl overflow-hidden`}
              style={{ animation: `bounce-in 0.6s ease-out ${idx * 0.1}s backwards` }}
            >
              {/* Animated background glow */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${subject.gradient} opacity-0 group-hover:opacity-30 blur-2xl transition-opacity duration-500 -z-10 animate-pulse`}
              />

              {/* Shimmer effect */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
                  backgroundSize: "200% 100%",
                  animation: "text-shimmer 3s ease-in-out infinite",
                }}
              />

              {/* Animated border glow */}
              <div className={`absolute inset-0 rounded-2xl border-2 ${subject.borderGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm`} />

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center justify-center">
                <div className="mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 drop-shadow-2xl filter group-hover:drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]">
                  <IconComponent className="w-20 h-20 md:w-24 md:h-24 text-white" strokeWidth={1.5} />
                </div>
                <p className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg mb-2 group-hover:drop-shadow-xl">
                  {subject.label}
                </p>
                <p className="text-sm md:text-base text-white/90 drop-shadow-md font-medium">
                  {subject.desc}
                </p>
              </div>

              {/* Floating particles effect on hover */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className={`absolute w-2 h-2 bg-white/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                    style={{
                      left: `${20 + i * 15}%`,
                      top: `${20 + (i % 3) * 25}%`,
                      animation: `float ${2 + i * 0.3}s ease-in-out infinite`,
                      animationDelay: `${i * 0.1}s`,
                      transition: "all 0.5s ease",
                    }}
                  />
                ))}
              </div>

              {/* Bottom shine effect */}
              <div className="absolute bottom-0 left-0 right-0 h-1/3 rounded-b-2xl bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default HeroSection
