"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Atom, ArrowLeft, Zap, Gauge, Waves } from "lucide-react"
import Header from "@/components/Header"
import AnimatedBackground from "@/components/AnimatedBackground"
import Footer from "@/components/Footer"

export default function PhysicsPage() {
  const [language, setLanguage] = useState<"en" | "bn">("en")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  const topics = [
    {
      titleEn: "Mechanics",
      titleBn: "যান্ত্রিকতা",
      descEn: "Motion, forces, and energy in action",
      descBn: "ক্রিয়া, বল এবং শক্তি",
      icon: "⚙️",
      route: "/physics/motion",
    },
    {
      titleEn: "Gravity",
      titleBn: "মহাকর্ষ",
      descEn: "Explore gravitational forces and fields",
      descBn: "মহাকর্ষীয় বল এবং ক্ষেত্র অন্বেষণ",
      icon: "🌍",
      route: "/physics/gravity",
    },
    {
      titleEn: "Solar System",
      titleBn: "সৌরজগৎ",
      descEn: "Interactive 3D solar system model",
      descBn: "ইন্টারেক্টিভ ত্রিমাত্রিক সৌরজগৎ মডেল",
      icon: "🌠",
      route: "/physics/solar",
    },
    {
      titleEn: "Geometric Optics",
      titleBn: "জ্যামিতিক আলোকবিজ্ঞান",
      descEn: "Ray diagrams and optical systems",
      descBn: "রশ্মি রেখাচিত্র এবং আলোক ব্যবস্থা",
      icon: "🔭",
      route: "/physics/optics",
    },
  ]

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
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 px-4 bg-linear-to-br from-blue-50 via-cyan-50/50 to-indigo-50/30">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center gap-2 mb-8 text-blue-700 hover:text-blue-900 transition-colors group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">{language === "en" ? "Back to Home" : "হোমে ফিরুন"}</span>
            </button>

            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg">
                <Atom className="w-12 h-12 text-white" strokeWidth={1.5} />
              </div>
              <div>
                <h1 className="text-5xl md:text-6xl font-bold bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                  {language === "en" ? "Physics" : "পদার্থবিদ্যা"}
                </h1>
                <p className="text-lg text-slate-600">
                  {language === "en"
                    ? "Discover the laws that govern the universe"
                    : "মহাবিশ্বকে নিয়ন্ত্রণকারী আইনগুলি আবিষ্কার করুন"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Topics Grid */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
              {language === "en" ? "Explore Topics" : "বিষয়গুলি অন্বেষণ করুন"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {topics.map((topic, idx) => (
                <div
                  key={idx}
                  onClick={() => topic.route && router.push(topic.route)}
                  className={`group relative p-8 rounded-2xl bg-white border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 transform hover:-translate-y-2 ${topic.route ? 'cursor-pointer' : ''}`}
                >
                  <div className="text-5xl mb-4 text-center">{topic.icon}</div>
                  <h3 className="text-xl font-bold text-foreground mb-2 text-center">
                    {language === "en" ? topic.titleEn : topic.titleBn}
                  </h3>
                  <p className="text-sm text-muted-foreground text-center">
                    {language === "en" ? topic.descEn : topic.descBn}
                  </p>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-gradient-to-b from-white to-blue-50/30">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <Zap className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{language === "en" ? "3D Simulations" : "3D সিমুলেশন"}</h3>
                <p className="text-muted-foreground">
                  {language === "en"
                    ? "Visualize complex physical phenomena in 3D"
                    : "3D-এ জটিল শারীরিক ঘটনা কল্পনা করুন"}
                </p>
              </div>
              <div className="text-center p-6">
                <Gauge className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{language === "en" ? "Experiments" : "পরীক্ষা"}</h3>
                <p className="text-muted-foreground">
                  {language === "en"
                    ? "Interactive experiments to understand physics concepts"
                    : "পদার্থবিজ্ঞানের ধারণা বুঝতে ইন্টারঅ্যাক্টিভ পরীক্ষা"}
                </p>
              </div>
              <div className="text-center p-6">
                <Waves className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{language === "en" ? "Real-time Analysis" : "রিয়েল-টাইম বিশ্লেষণ"}</h3>
                <p className="text-muted-foreground">
                  {language === "en"
                    ? "See physics in action with real-time data"
                    : "রিয়েল-টাইম ডেটা দিয়ে পদার্থবিজ্ঞান ক্রিয়ায় দেখুন"}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer language={language} />
    </div>
  )
}

