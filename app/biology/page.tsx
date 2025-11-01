"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Leaf, ArrowLeft, Dna, Microscope, Heart } from "lucide-react"
import Header from "@/components/Header"
import AnimatedBackground from "@/components/AnimatedBackground"
import Footer from "@/components/Footer"

export default function BiologyPage() {
  const [language, setLanguage] = useState<"en" | "bn">("en")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  const topics = [
    {
      titleEn: "Cell Biology",
      titleBn: "কোষ জীববিদ্যা",
      descEn: "Study of cells and their functions",
      descBn: "কোষ এবং তাদের কার্যাবলীর অধ্যয়ন",
      icon: "🔬",
      href: "/biology/cells",
    },
    {
      titleEn: "Genetics",
      titleBn: "জিনতত্ত্ব",
      descEn: "Interactive 3D chromosome structure",
      descBn: "ইন্টারেক্টিভ ত্রিমাত্রিক ক্রোমোজোম কাঠামো",
      icon: "🧬",
      href: "/biology/genetics",
    },
    {
      titleEn: "Ecology",
      titleBn: "পরিবেশবিদ্যা",
      descEn: "Ecosystems and environmental interactions",
      descBn: "ইকোসিস্টেম এবং পরিবেশগত মিথস্ক্রিয়া",
      icon: "🌍",
    },
    {
      titleEn: "Human Anatomy",
      titleBn: "মানব অঙ্গসংস্থান",
      descEn: "Interactive 3D human body anatomy",
      descBn: "ইন্টারেক্টিভ ত্রিমাত্রিক মানব শরীরের গঠন",
      icon: "❤️",
      href: "/biology/anatomy",
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
        <section className="relative pt-24 pb-16 px-4 bg-linear-to-br from-orange-50 via-red-50/50 to-amber-50/30">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center gap-2 mb-8 text-orange-700 hover:text-orange-900 transition-colors group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">{language === "en" ? "Back to Home" : "হোমে ফিরুন"}</span>
            </button>

            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-orange-500 to-red-400 flex items-center justify-center shadow-lg">
                <Leaf className="w-12 h-12 text-white" strokeWidth={1.5} />
              </div>
              <div>
                <h1 className="text-5xl md:text-6xl font-bold bg-linear-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                  {language === "en" ? "Biology" : "জীববিজ্ঞান"}
                </h1>
                <p className="text-lg text-slate-600">
                  {language === "en"
                    ? "Discover the wonders of life and living organisms"
                    : "জীবন এবং জীবন্ত জীবের বিস্ময় আবিষ্কার করুন"}
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
                  onClick={() => topic.href && router.push(topic.href)}
                  className="group relative p-8 rounded-2xl bg-white border-2 border-orange-200 hover:border-orange-400 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/20 transform hover:-translate-y-2 cursor-pointer"
                >
                  <div className="text-5xl mb-4 text-center">{topic.icon}</div>
                  <h3 className="text-xl font-bold text-foreground mb-2 text-center">
                    {language === "en" ? topic.titleEn : topic.titleBn}
                  </h3>
                  <p className="text-sm text-muted-foreground text-center">
                    {language === "en" ? topic.descEn : topic.descBn}
                  </p>
                  <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-linear-to-b from-white to-orange-50/30">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <Microscope className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{language === "en" ? "3D Models" : "3D মডেল"}</h3>
                <p className="text-muted-foreground">
                  {language === "en"
                    ? "Interactive 3D models of cells and organisms"
                    : "কোষ এবং জীবের ইন্টারঅ্যাক্টিভ 3D মডেল"}
                </p>
              </div>
              <div className="text-center p-6">
                <Dna className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{language === "en" ? "Genetic Explorer" : "জেনেটিক এক্সপ্লোরার"}</h3>
                <p className="text-muted-foreground">
                  {language === "en"
                    ? "Explore DNA structure and genetic processes"
                    : "ডিএনএ কাঠামো এবং জেনেটিক প্রক্রিয়া অন্বেষণ করুন"}
                </p>
              </div>
              <div className="text-center p-6">
                <Heart className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{language === "en" ? "Life Processes" : "জীবন প্রক্রিয়া"}</h3>
                <p className="text-muted-foreground">
                  {language === "en"
                    ? "Understand how living systems work"
                    : "জীবন্ত সিস্টেম কীভাবে কাজ করে তা বুঝুন"}
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

