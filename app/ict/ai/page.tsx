"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Brain, ArrowLeft, Network, TrendingUp, Sparkles } from "lucide-react"
import Header from "@/components/Header"

import Footer from "@/components/Footer"

export default function AIPage() {
  const [language, setLanguage] = useState<"en" | "bn">("en")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  const topics = [
    {
      titleEn: "Neural Networks",
      titleBn: "নিউরাল নেটওয়ার্ক",
      descEn: "Explore artificial neural networks and deep learning",
      descBn: "কৃত্রিম নিউরাল নেটওয়ার্ক এবং ডিপ লার্নিং অন্বেষণ করুন",
      icon: "🧠",
      href: "/ict/ai/neural-networks",
    },
    {
      titleEn: "Machine Learning",
      titleBn: "মেশিন লার্নিং",
      descEn: "Understand machine learning algorithms and models",
      descBn: "মেশিন লার্নিং অ্যালগরিদম এবং মডেল বুঝুন",
      icon: "🤖",
      href: "/ict/ai/machine-learning",
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
        <section className="relative pt-24 pb-16 px-4 bg-linear-to-br from-blue-50 via-cyan-50/50 to-indigo-50/30">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => router.push("/ict")}
              className="inline-flex items-center gap-2 mb-8 text-blue-700 hover:text-blue-900 transition-colors group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">{language === "en" ? "Back to ICT" : "আইসিটিতে ফিরুন"}</span>
            </button>

            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg">
                <Brain className="w-12 h-12 text-white" strokeWidth={1.5} />
              </div>
              <div>
                <h1 className="text-5xl md:text-6xl font-bold bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                  {language === "en" ? "Artificial Intelligence" : "কৃত্রিম বুদ্ধিমত্তা"}
                </h1>
                <p className="text-lg text-slate-600">
                  {language === "en"
                    ? "Explore the world of AI, machine learning, and neural networks"
                    : "এআই, মেশিন লার্নিং এবং নিউরাল নেটওয়ার্কের জগত অন্বেষণ করুন"}
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topics.map((topic, idx) => (
                <div
                  key={idx}
                  onClick={() => topic.href && router.push(topic.href)}
                  className="group relative p-8 rounded-2xl bg-white border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 transform hover:-translate-y-2 cursor-pointer"
                >
                  <div className="text-5xl mb-4 text-center">{topic.icon}</div>
                  <h3 className="text-xl font-bold text-foreground mb-2 text-center">
                    {language === "en" ? topic.titleEn : topic.titleBn}
                  </h3>
                  <p className="text-sm text-muted-foreground text-center">
                    {language === "en" ? topic.descEn : topic.descBn}
                  </p>
                  <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-linear-to-b from-white to-blue-50/30">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <Network className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{language === "en" ? "Neural Networks" : "নিউরাল নেটওয়ার্ক"}</h3>
                <p className="text-muted-foreground">
                  {language === "en"
                    ? "Visualize how artificial neurons work together"
                    : "কৃত্রিম নিউরন কীভাবে একসাথে কাজ করে তা কল্পনা করুন"}
                </p>
              </div>
              <div className="text-center p-6">
                <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{language === "en" ? "Learning Algorithms" : "লার্নিং অ্যালগরিদম"}</h3>
                <p className="text-muted-foreground">
                  {language === "en"
                    ? "Understand how machines learn from data"
                    : "মেশিন কীভাবে ডেটা থেকে শেখে তা বুঝুন"}
                </p>
              </div>
              <div className="text-center p-6">
                <Sparkles className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{language === "en" ? "Interactive AI" : "ইন্টারেক্টিভ এআই"}</h3>
                <p className="text-muted-foreground">
                  {language === "en"
                    ? "Experiment with AI models in real-time"
                    : "রিয়েল-টাইমে এআই মডেল নিয়ে পরীক্ষা করুন"}
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