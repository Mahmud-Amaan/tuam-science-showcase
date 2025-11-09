"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FlaskConical, ArrowLeft, TestTube, Beaker, Atom } from "lucide-react"
import Header from "@/components/Header"

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
      titleBn: "অণু",
      descEn: "Explore molecular shapes and VSEPR geometry",
      descBn: "আণুগত আকৃতি এবং VSEPR জ্যামিতি অন্বেষণ",
      icon: "🔬",
      href: "/chemistry/molecules",
    },
    {
      titleEn: "pH Scale",
      titleBn: "পিএইচ স্কেল",
      descEn: "Explore acidity and basicity with interactive pH measurements",
      descBn: "ইন্টারঅ্যাক্টিভ পিএইচ পরিমাপ সহ অম্লতা এবং ক্ষারত্ব অন্বেষণ করুন",
      icon: "🧪",
      href: "/chemistry/ph-scale",
    },
    {
      titleEn: "Periodic Table",
      titleBn: "পর্যায় সারণি",
      descEn: "Discover elements with Google Arts & Culture's interactive periodic table",
      descBn: "গুগল আর্টস অ্যান্ড কালচারের ইন্টারঅ্যাক্টিভ পর্যায় সারণির মাধ্যমে মৌল আবিষ্কার করুন",
      icon: "🧭",
      href: "/chemistry/periodic-table",
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
      
      <main>
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 px-4 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent dark:from-primary/20 dark:via-primary/10 dark:to-transparent">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center gap-2 mb-8 text-primary hover:text-primary/80 transition-colors group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">{language === "en" ? "Back to Home" : "হোমে ফিরুন"}</span>
            </button>

            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/25">
                <FlaskConical className="w-12 h-12 text-white" strokeWidth={1.5} />
              </div>
              <div>
                <h1 className="text-5xl md:text-6xl font-bold bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                  {language === "en" ? "Chemistry" : "রসায়ন"}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {language === "en"
                    ? "Explore the building blocks of matter"
                    : "পদার্থের বিল্ডিং ব্লকগুলি অন্বেষণ করুন"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Topics Grid */}
        <section className="pt-8 pb-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {topics.map((topic, idx) => (
                <div
                  key={idx}
                  onClick={() => topic.href && router.push(topic.href)}
                  className="group relative p-8 rounded-2xl border border-border/70 bg-card shadow-lg shadow-primary/5 transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-primary/20 cursor-pointer"
                >
                  <div className="text-5xl mb-4 text-center">{topic.icon}</div>
                  <h3 className="text-xl font-bold text-foreground mb-2 text-center">
                    {language === "en" ? topic.titleEn : topic.titleBn}
                  </h3>
                  <p className="text-sm text-muted-foreground text-center">
                    {language === "en" ? topic.descEn : topic.descBn}
                  </p>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-gradient-to-b from-background via-muted/15 to-muted/5 dark:from-background dark:via-background/80 dark:to-background">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <TestTube className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{language === "en" ? "Safe Experiments" : "নিরাপদ পরীক্ষা"}</h3>
                <p className="text-muted-foreground">
                  {language === "en"
                    ? "Perform experiments safely in virtual lab"
                    : "ভার্চুয়াল ল্যাবে নিরাপদে পরীক্ষা করুন"}
                </p>
              </div>
              <div className="text-center p-6">
                <Beaker className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{language === "en" ? "Molecular Models" : "আণবিক মডেল"}</h3>
                <p className="text-muted-foreground">
                  {language === "en"
                    ? "3D visualization of molecules and compounds"
                    : "অণু এবং যৌগের 3D ভিজ্যুয়ালাইজেশন"}
                </p>
              </div>
              <div className="text-center প-6">
                <Atom className="w-12 h-12 text-primary mx-auto mb-4" />
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

