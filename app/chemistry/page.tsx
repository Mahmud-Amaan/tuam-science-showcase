"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FlaskConical, ArrowLeft, TestTube, Beaker, Atom } from "lucide-react"
import Header from "@/components/Header"
import AnimatedBackground from "@/components/AnimatedBackground"
import Footer from "@/components/Footer"

export default function ChemistryPage() {
  const [language, setLanguage] = useState<"en" | "bn">("en")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  const topics = [
    {
      titleEn: "Atomic Structure",
      titleBn: "পরমাণুর গঠন",
      descEn: "3D visualization of atomic structure",
      descBn: "পরমাণুর গঠনের ত্রিমাত্রিক দৃশ্য",
      icon: "⚛️",
      href: "/chemistry/atoms",
    },
    {
      titleEn: "States of Matter",
      titleBn: "পদার্থের অবস্থা",
      descEn: "Interactive simulation exploring solids, liquids, and gases",
      descBn: "ঘন, তরল, এবং গ্যাসীয় অবস্থা অন্বেষণ",
      icon: "🧊",
      href: "/chemistry/states",
    },
    {
      titleEn: "Molecules",
      titleBn: "আণু",
      descEn: "Explore molecular shapes and VSEPR geometry",
      descBn: "আণুগত আকৃতি এবং VSEPR জ্যামিতি অন্বেষণ",
      icon: "🔬",
      href: "/chemistry/molecules",
    },
    {
      titleEn: "Organic Chemistry",
      titleBn: "জৈব রসায়ন",
      descEn: "Carbon compounds and organic reactions",
      descBn: "কার্বন যৌগ এবং জৈব বিক্রিয়া",
      icon: "🌿",
    },
    {
      titleEn: "Physical Chemistry",
      titleBn: "ভৌত রসায়ন",
      descEn: "Thermodynamics and kinetics",
      descBn: "তাপগতিবিদ্যা এবং গতিবিদ্যা",
      icon: "⚡",
    },
    {
      titleEn: "Biochemistry",
      titleBn: "জৈব রসায়ন",
      descEn: "Chemistry of living organisms",
      descBn: "জীবন্ত জীবের রসায়ন",
      icon: "🧬",
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
        <section className="relative pt-24 pb-16 px-4 bg-linear-to-br from-green-50 via-emerald-50/50 to-teal-50/30">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center gap-2 mb-8 text-green-700 hover:text-green-900 transition-colors group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">{language === "en" ? "Back to Home" : "হোমে ফিরুন"}</span>
            </button>

            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-green-500 to-emerald-400 flex items-center justify-center shadow-lg">
                <FlaskConical className="w-12 h-12 text-white" strokeWidth={1.5} />
              </div>
              <div>
                <h1 className="text-5xl md:text-6xl font-bold bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                  {language === "en" ? "Chemistry" : "রসায়ন"}
                </h1>
                <p className="text-lg text-slate-600">
                  {language === "en"
                    ? "Explore the building blocks of matter"
                    : "পদার্থের বিল্ডিং ব্লকগুলি অন্বেষণ করুন"}
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
                  className="group relative p-8 rounded-2xl bg-white border-2 border-green-200 hover:border-green-400 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/20 transform hover:-translate-y-2 cursor-pointer"
                >
                  <div className="text-5xl mb-4 text-center">{topic.icon}</div>
                  <h3 className="text-xl font-bold text-foreground mb-2 text-center">
                    {language === "en" ? topic.titleEn : topic.titleBn}
                  </h3>
                  <p className="text-sm text-muted-foreground text-center">
                    {language === "en" ? topic.descEn : topic.descBn}
                  </p>
                  <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-linear-to-b from-white to-green-50/30">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <TestTube className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{language === "en" ? "Safe Experiments" : "নিরাপদ পরীক্ষা"}</h3>
                <p className="text-muted-foreground">
                  {language === "en"
                    ? "Perform experiments safely in virtual lab"
                    : "ভার্চুয়াল ল্যাবে নিরাপদে পরীক্ষা করুন"}
                </p>
              </div>
              <div className="text-center p-6">
                <Beaker className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{language === "en" ? "Molecular Models" : "আণবিক মডেল"}</h3>
                <p className="text-muted-foreground">
                  {language === "en"
                    ? "3D visualization of molecules and compounds"
                    : "অণু এবং যৌগের 3D ভিজ্যুয়ালাইজেশন"}
                </p>
              </div>
              <div className="text-center p-6">
                <Atom className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{language === "en" ? "Reaction Simulator" : "বিক্রিয়া সিমুলেটর"}</h3>
                <p className="text-muted-foreground">
                  {language === "en"
                    ? "See chemical reactions happen in real-time"
                    : "রিয়েল-টাইমে রাসায়নিক বিক্রিয়া দেখুন"}
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

