"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Calculator, ArrowLeft, BookOpen, BarChart3, Sparkles } from "lucide-react"
import Header from "@/components/Header"
import AnimatedBackground from "@/components/AnimatedBackground"
import Footer from "@/components/Footer"

export default function MathPage() {
  const [language, setLanguage] = useState<"en" | "bn">("en")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  const topics = [
    {
      titleEn: "Algebra",
      titleBn: "বীজগণিত",
      descEn: "Master equations, inequalities, and polynomial functions",
      descBn: "সমীকরণ, অসমতা এবং বহুপদী ফাংশন আয়ত্ত করুন",
      icon: "x²",
    },
    {
      titleEn: "Geometry",
      titleBn: "জ্যামিতি",
      descEn: "Explore shapes, angles, and spatial relationships",
      descBn: "আকৃতি, কোণ এবং স্থানিক সম্পর্ক অন্বেষণ করুন",
      icon: "△",
    },
    {
      titleEn: "Calculus",
      titleBn: "ক্যালকুলাস",
      descEn: "Understand limits, derivatives, and integrals",
      descBn: "সীমা, ডেরিভেটিভ এবং ইন্টেগ্রাল বুঝুন",
      icon: "∫",
    },
    {
      titleEn: "Statistics",
      titleBn: "পরিসংখ্যান",
      descEn: "Learn data analysis and probability",
      descBn: "ডেটা বিশ্লেষণ এবং সম্ভাব্যতা শিখুন",
      icon: "📊",
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
        <section className="relative pt-24 pb-16 px-4 bg-gradient-to-br from-amber-50 via-yellow-50/50 to-orange-50/30">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center gap-2 mb-8 text-amber-700 hover:text-amber-900 transition-colors group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">{language === "en" ? "Back to Home" : "হোমে ফিরুন"}</span>
            </button>

            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center shadow-lg">
                <Calculator className="w-12 h-12 text-white" strokeWidth={1.5} />
              </div>
              <div>
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
                  {language === "en" ? "Mathematics" : "গণিত"}
                </h1>
                <p className="text-lg text-slate-600">
                  {language === "en"
                    ? "Master the language of numbers and logic"
                    : "সংখ্যা এবং যুক্তির ভাষা আয়ত্ত করুন"}
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
                  onClick={() => router.push('/math/graphs')}
                  className="group relative p-8 rounded-2xl bg-white border-2 border-amber-200 hover:border-amber-400 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/20 transform hover:-translate-y-2 cursor-pointer"
                >
                  <div className="text-5xl mb-4 text-center">{topic.icon}</div>
                  <h3 className="text-xl font-bold text-foreground mb-2 text-center">
                    {language === "en" ? topic.titleEn : topic.titleBn}
                  </h3>
                  <p className="text-sm text-muted-foreground text-center">
                    {language === "en" ? topic.descEn : topic.descBn}
                  </p>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-gradient-to-b from-white to-amber-50/30">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <BookOpen className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{language === "en" ? "Interactive Lessons" : "ইন্টারঅ্যাক্টিভ পাঠ"}</h3>
                <p className="text-muted-foreground">
                  {language === "en"
                    ? "Learn through hands-on practice and visual examples"
                    : "হ্যান্ডস-অন অনুশীলন এবং ভিজ্যুয়াল উদাহরণের মাধ্যমে শিখুন"}
                </p>
              </div>
              <div className="text-center p-6">
                <BarChart3 className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{language === "en" ? "Progress Tracking" : "অগ্রগতি ট্র্যাকিং"}</h3>
                <p className="text-muted-foreground">
                  {language === "en"
                    ? "Monitor your learning journey and achievements"
                    : "আপনার শেখার যাত্রা এবং অর্জনগুলি পর্যবেক্ষণ করুন"}
                </p>
              </div>
              <div className="text-center p-6">
                <Sparkles className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{language === "en" ? "Real Examples" : "বাস্তব উদাহরণ"}</h3>
                <p className="text-muted-foreground">
                  {language === "en"
                    ? "Apply math concepts to real-world problems"
                    : "বাস্তব-বিশ্বের সমস্যার জন্য গণিত ধারণা প্রয়োগ করুন"}
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

