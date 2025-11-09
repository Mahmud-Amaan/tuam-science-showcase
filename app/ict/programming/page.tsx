"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Code, ArrowLeft, FileCode, Terminal, Cpu } from "lucide-react"
import Header from "@/components/Header"

import Footer from "@/components/Footer"

export default function ProgrammingPage() {
  const [language, setLanguage] = useState<"en" | "bn">("en")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  const topics = [
    {
      titleEn: "HTML",
      titleBn: "এইচটিএমএল",
      descEn: "Learn HyperText Markup Language for web development",
      descBn: "ওয়েব ডেভেলপমেন্টের জন্য হাইপারটেক্সট মার্কআপ ল্যাঙ্গুয়েজ শিখুন",
      icon: "</>",
      href: "/ict/programming/html",
    },
    {
      titleEn: "Python",
      titleBn: "পাইথন",
      descEn: "Explore Python programming language",
      descBn: "পাইথন প্রোগ্রামিং ভাষা অন্বেষণ করুন",
      icon: "🐍",
      href: "/ict/programming/python",
    },
    {
      titleEn: "C",
      titleBn: "সি",
      descEn: "Master C programming fundamentals",
      descBn: "সি প্রোগ্রামিং এর মৌলিক বিষয় আয়ত্ত করুন",
      icon: "⚙️",
      href: "/ict/programming/c",
    },
    {
      titleEn: "Database",
      titleBn: "ডেটাবেস",
      descEn: "Learn SQL and database management",
      descBn: "এসকিউএল এবং ডেটাবেস ব্যবস্থাপনা শিখুন",
      icon: "🗄️",
      href: "/ict/programming/database",
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
        <section className="relative pt-24 pb-16 px-4 bg-linear-to-br from-green-50 via-emerald-50/50 to-teal-50/30">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => router.push("/ict")}
              className="inline-flex items-center gap-2 mb-8 text-green-700 hover:text-green-900 transition-colors group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">{language === "en" ? "Back to ICT" : "আইসিটিতে ফিরুন"}</span>
            </button>

            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-green-500 to-emerald-400 flex items-center justify-center shadow-lg">
                <Code className="w-12 h-12 text-white" strokeWidth={1.5} />
              </div>
              <div>
                <h1 className="text-5xl md:text-6xl font-bold bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                  {language === "en" ? "Programming" : "প্রোগ্রামিং"}
                </h1>
                <p className="text-lg text-slate-600">
                  {language === "en"
                    ? "Explore programming languages and coding fundamentals"
                    : "প্রোগ্রামিং ভাষা এবং কোডিং এর মৌলিক বিষয় অন্বেষণ করুন"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Topics Grid */}
        <section className="pt-8 pb-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <FileCode className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{language === "en" ? "Web Development" : "ওয়েব ডেভেলপমেন্ট"}</h3>
                <p className="text-muted-foreground">
                  {language === "en"
                    ? "Learn HTML for creating web pages and applications"
                    : "ওয়েব পেজ এবং অ্যাপ্লিকেশন তৈরির জন্য এইচটিএমএল শিখুন"}
                </p>
              </div>
              <div className="text-center p-6">
                <Terminal className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{language === "en" ? "Python Programming" : "পাইথন প্রোগ্রামিং"}</h3>
                <p className="text-muted-foreground">
                  {language === "en"
                    ? "Master Python for data science and automation"
                    : "ডেটা সায়েন্স এবং অটোমেশনের জন্য পাইথন আয়ত্ত করুন"}
                </p>
              </div>
              <div className="text-center p-6">
                <Cpu className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{language === "en" ? "System Programming" : "সিস্টেম প্রোগ্রামিং"}</h3>
                <p className="text-muted-foreground">
                  {language === "en"
                    ? "Understand C for low-level system programming"
                    : "নিম্ন-স্তরের সিস্টেম প্রোগ্রামিংয়ের জন্য সি বুঝুন"}
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