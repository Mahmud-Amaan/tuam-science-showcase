"use client"

import { useRouter } from "next/navigation"
import { useRef, useState, useEffect } from "react"
import { Zap, Calculator, Atom, FlaskConical, Leaf, Laptop } from "lucide-react"

interface HeroProps {
  language: "en" | "bn"
}

const HeroSection = ({ language }: HeroProps) => {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [videoError, setVideoError] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadStart = () => {
      setVideoLoaded(false)
    }

    const handleCanPlay = () => {
      setVideoLoaded(true)
      setVideoError(false)
    }

    const handleError = () => {
      setVideoError(true)
      setVideoLoaded(true)
    }

    video.addEventListener("loadstart", handleLoadStart)
    video.addEventListener("canplay", handleCanPlay)
    video.addEventListener("error", handleError)

    return () => {
      video.removeEventListener("loadstart", handleLoadStart)
      video.removeEventListener("canplay", handleCanPlay)
      video.removeEventListener("error", handleError)
    }
  }, [])

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-20 bg-black"
      aria-labelledby="hero-heading"
    >
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <video
          ref={videoRef}
          src="/background.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1920 1080'%3E%3Crect fill='%23000000' width='1920' height='1080'/%3E%3C/svg%3E"
          className="absolute top-1/2 left-1/2 w-full h-full min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover"
          title="Background video"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />
      </div>

      {videoError && <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-black to-black" />}

      <div className="relative z-20 max-w-5xl mx-auto px-4 text-center">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 backdrop-blur-lg  rounded-full shadow-xl hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105 animate-bounce-in"
          role="banner"
          aria-label={language === "en" ? "Award-winning learning platform badge" : "পুরস্কার বিজয়ী শেখার প্ল্যাটফর্ম ব্যাজ"}
        >
          <Zap size={14} className="text-blue-600 animate-pulse" aria-hidden="true" />
          <span className="text-xs font-medium bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            {language === "en" ? "🏆 Award-winning Learning Platform" : "🏆 পুরস্কার বিজয়ী শেখার প্ল্যাটফর্ম"}
          </span>
        </div>

        <h1 id="hero-heading" className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          <span className="block bg-linear-to-r from-blue-600 via-cyan-600 to-green-600 bg-clip-text text-transparent animate-gradient pb-1">
            {language === "en" ? "Explore Science" : "বিজ্ঞান অন্বেষণ করুন"}
          </span>
          <span className="block bg-linear-to-r from-green-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent animate-gradient">
            {language === "en" ? "Like Never Before" : "আগের চেয়ে ভিন্নভাবে"}
          </span>
        </h1>

        <p
          className="text-sm md:text-base text-white/90 mb-16 max-w-2xl mx-auto leading-relaxed font-medium animate-slide-up drop-shadow-lg"
          style={{ animationDelay: "0.2s" }}
        >
          {language === "en"
            ? "Master NCTB curriculum concepts through interactive 3D simulations. Visualize complex phenomena, experiment safely, and transform your learning experience."
            : "ইন্টারঅ্যাক্টিভ 3D সিমুলেশনের মাধ্যমে এনসিটিবি পাঠ্যক্রম ধারণা আয়ত্ত করুন। জটিল ঘটনা দেখুন এবং নিরাপদে পরীক্ষা করুন।"}
        </p>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
          role="navigation"
          aria-label={language === "en" ? "Subject navigation" : "বিষয় নেভিগেশন"}
        >
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
            {
              icon: Laptop,
              label: language === "en" ? "ICT" : "আইসিটি",
              desc: "Info & Comms Tech",
              route: "/ict",
              gradient: "from-sky-500 via-blue-400 to-sky-600",
              glow: "shadow-sky-500/50",
              hoverGlow: "group-hover:shadow-sky-500/80",
              borderGlow: "border-sky-400/60 group-hover:border-sky-300",
            },
          ].map((subject, idx) => {
            const IconComponent = subject.icon
            return (
              <button
                key={idx}
                onClick={() => {
                  router.push(subject.route)
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    router.push(subject.route)
                  }
                }}
                className={`group relative p-10 md:p-12 rounded-2xl bg-gradient-to-br ${subject.gradient} border-2 ${subject.borderGlow} cursor-pointer transform transition-all duration-500 hover:scale-110 hover:-translate-y-2 ${subject.glow} ${subject.hoverGlow} shadow-2xl overflow-hidden focus:outline-none focus:ring-4 focus:ring-white/50 focus:scale-110 focus:-translate-y-2`}
                style={{ animation: `bounce-in 0.6s ease-out ${idx * 0.1}s backwards` }}
                aria-label={`${language === "en" ? "Navigate to" : "যান"} ${subject.label} ${language === "en" ? "page" : "পৃষ্ঠা"} - ${subject.desc}`}
                tabIndex={0}
              >
                {/* Animated border glow */}
                <div
                  className={`absolute inset-0 rounded-2xl border-2 ${subject.borderGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm`}
                  aria-hidden="true"
                />

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center">
                  <div
                    className="mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 drop-shadow-2xl filter group-hover:drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]"
                    role="img"
                    aria-label={`${subject.label} icon`}
                  >
                    <IconComponent
                      className="w-20 h-20 md:w-24 md:h-24 text-white"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </div>
                  <p className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg mb-2 group-hover:drop-shadow-xl">
                    {subject.label}
                  </p>
                  <p className="text-sm md:text-base text-white/90 drop-shadow-md font-medium">{subject.desc}</p>
                </div>

                {/* Floating particles effect on hover */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none" aria-hidden="true">
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
                <div
                  className="absolute bottom-0 left-0 right-0 h-1/3 rounded-b-2xl bg-linear-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  aria-hidden="true"
                />
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default HeroSection
