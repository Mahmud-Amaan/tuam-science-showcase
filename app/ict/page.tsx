"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Cpu, Network, Shield, Code, ArrowLeft } from "lucide-react"
import Header from "@/components/Header"

import Footer from "@/components/Footer"

export default function IctPage() {
  const [language, setLanguage] = useState<"en" | "bn">("en")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  const topics = [
    {
      titleEn: "Computer Hardware",
      titleBn: "কম্পিউটার হার্ডওয়্যার",
      descEn: "Hardware, software, and operating systems",
      descBn: "হার্ডওয়্যার, সফটওয়্যার এবং অপারেটিং সিস্টেম",
      icon: "💻",
      href: "/ict/computer-hardware",
    },
    {
      titleEn: "Programming",
      titleBn: "প্রোগ্রামিং",
      descEn: "Fundamentals of coding and software development",
      descBn: "কোডিং এবং সফটওয়্যার উন্নয়নের মৌলিক বিষয়",
      icon: "💻",
      href: "/ict/programming",
    },
    {
      titleEn: "Logic Gates",
      titleBn: "লজিক গেট",
      descEn: "Interactive logic gates simulation",
      descBn: "ইন্টারেক্টিভ লজিক গেট সিমুলেশন",
      icon: "🔧",
      href: "/ict/logic-gates",
    },
    {
      titleEn: "Circuit Construction",
      titleBn: "সার্কিট নির্মাণ",
      descEn: "Build and test DC circuits with virtual components",
      descBn: "ভার্চুয়াল উপাদান দিয়ে ডিসি সার্কিট তৈরি এবং পরীক্ষা করুন",
      icon: "⚡",
      href: "/ict/circuit-construction",
    },
    {
      titleEn: "Artificial Intelligence",
      titleBn: "কৃত্রিম বুদ্ধিমত্তা",
      descEn: "Machine learning, neural networks, and AI applications",
      descBn: "মেশিন লার্নিং, নিউরাল নেটওয়ার্ক এবং এআই অ্যাপ্লিকেশন",
      icon: "🤖",
      href: "/ict/ai",
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
        <section className="relative pt-24 pb-16 px-4 bg-gradient-to-br from-sky-100/40 via-blue-50/20 to-transparent dark:from-sky-500/20 dark:via-blue-500/10 dark:to-transparent">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center gap-2 mb-8 text-sky-700 hover:text-sky-800 dark:text-sky-300 dark:hover:text-sky-200 transition-colors group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">{language === "en" ? "Back to Home" : "হোমে ফিরুন"}</span>
            </button>

            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-500 dark:from-sky-500 dark:to-blue-500 flex items-center justify-center shadow-lg shadow-sky-500/25">
                <Cpu className="w-12 h-12 text-white" strokeWidth={1.5} />
              </div>
              <div>
                <h1 className="text-5xl md:text-6xl font-bold bg-linear-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  {language === "en" ? "ICT" : "আইসিটি"}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {language === "en"
                    ? "Exploring the world of Information and Communication Technology"
                    : "তথ্য ও যোগাযোগ প্রযুক্তির বিশ্ব অন্বেষণ"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Topics Grid */}
        <section className="pt-8 pb-16 px-4">
          <div className="max-weg-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {topics.map((topic, idx) => (
                <div
                  key={idx}
                  onClick={() => topic.href && router.push(topic.href)}
                  className="group relative p-8 rounded-2xl border border-sky-200/70 dark:border-sky-400/40 bg-card shadow-lg shadow-sky-500/10 transition-all duration-300 hover:-translate-y-2 hover:border-sky-400/70 dark:hover:border-sky-300/70 hover:shadow-sky-500/20 cursor-pointer"
                >
                  <div className="text-5xl mb-4 text-center">{topic.icon}</div>
                  <h3 className="text-xl font-bold text-foreground mb-2 text-center">
                    {language === "en" ? topic.titleEn : topic.titleBn}
                  </h3>
                  <p className="text-sm text-muted-foreground text-center">
                    {language === "en" ? topic.descEn : topic.descBn}
                  </p>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-sky-500/20 via-transparent to-transparent dark:from-sky-300/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
                <Network className="w-12 h-12 text-sky-600 dark:text-sky-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{language === "en" ? "Interactive Sims" : "ইন্টারেক্টিভ সিম"}</h3>
                <p className="text-muted-foreground">
                  {language === "en"
                    ? "Simulate network configurations and data flow"
                    : "নেটওয়ার্ক কনফিগারেশন এবং ডেটা প্রবাহ সিমুলেট করুন"}
                </p>
              </div>
              <div className="text-center p-6">
                <Code className="w-12 h-12 text-sky-600 dark:text-sky-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{language === "en" ? "Live Coding" : "লাইভ কোডিং"}</h3>
                <p className="text-muted-foreground">
                  {language === "en"
                    ? "Practice coding with real-time feedback"
                    : "রিয়েল-টাইম প্রতিক্রিয়া সহ কোডিং অনুশীলন করুন"}
                </p>
              </div>
              <div className="text-center p-6">
                <Shield className="w-12 h-12 text-sky-600 dark:text-sky-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{language === "en" ? "Security Drills" : "নিরাপত্তা ড্রিল"}</h3>
                <p className="text-muted-foreground">
                  {language === "en"
                    ? "Learn to defend against virtual threats"
                    : "ভার্চুয়াল হুমকির বিরুদ্ধে রক্ষা করতে শিখুন"}
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