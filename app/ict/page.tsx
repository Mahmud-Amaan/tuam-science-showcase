"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Cpu, Network, Shield, Code, ArrowLeft } from "lucide-react"
import Header from "@/components/Header"
import AnimatedBackground from "@/components/AnimatedBackground"
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
      titleEn: "Networking",
      titleBn: "নেটওয়ার্কিং",
      descEn: "Internet, protocols, and network security",
      descBn: "ইন্টারনেট, প্রোটোকল এবং নেটওয়ার্ক নিরাপত্তা",
      icon: "🌐",
      href: "/ict/networking",
    },
    {
      titleEn: "Cybersecurity",
      titleBn: "সাইবার নিরাপত্তা",
      descEn: "Protecting systems from cyber attacks",
      descBn: "সাইবার আক্রমণ থেকে সিস্টেম রক্ষা করা",
      icon: "🔒",
      href: "/ict/cybersecurity",
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
        <section className="relative pt-24 pb-16 px-4 bg-linear-to-br from-sky-50 via-blue-50/50 to-indigo-50/30">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center gap-2 mb-8 text-sky-700 hover:text-sky-900 transition-colors group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">{language === "en" ? "Back to Home" : "হোমে ফিরুন"}</span>
            </button>

            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-sky-500 to-blue-400 flex items-center justify-center shadow-lg">
                <Cpu className="w-12 h-12 text-white" strokeWidth={1.5} />
              </div>
              <div>
                <h1 className="text-5xl md:text-6xl font-bold bg-linear-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  {language === "en" ? "ICT" : "আইসিটি"}
                </h1>
                <p className="text-lg text-slate-600">
                  {language === "en"
                    ? "Exploring the world of Information and Communication Technology"
                    : "তথ্য ও যোগাযোগ প্রযুক্তির বিশ্ব অন্বেষণ"}
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
                  className="group relative p-8 rounded-2xl bg-white border-2 border-sky-200 hover:border-sky-400 transition-all duration-300 hover:shadow-xl hover:shadow-sky-500/20 transform hover:-translate-y-2 cursor-pointer"
                >
                  <div className="text-5xl mb-4 text-center">{topic.icon}</div>
                  <h3 className="text-xl font-bold text-foreground mb-2 text-center">
                    {language === "en" ? topic.titleEn : topic.titleBn}
                  </h3>
                  <p className="text-sm text-muted-foreground text-center">
                    {language === "en" ? topic.descEn : topic.descBn}
                  </p>
                  <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-sky-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-linear-to-b from-white to-sky-50/30">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <Network className="w-12 h-12 text-sky-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{language === "en" ? "Interactive Sims" : "ইন্টারেক্টিভ সিম"}</h3>
                <p className="text-muted-foreground">
                  {language === "en"
                    ? "Simulate network configurations and data flow"
                    : "নেটওয়ার্ক কনফিগারেশন এবং ডেটা প্রবাহ সিমুলেট করুন"}
                </p>
              </div>
              <div className="text-center p-6">
                <Code className="w-12 h-12 text-sky-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{language === "en" ? "Live Coding" : "লাইভ কোডিং"}</h3>
                <p className="text-muted-foreground">
                  {language === "en"
                    ? "Practice coding with real-time feedback"
                    : "রিয়েল-টাইম প্রতিক্রিয়া সহ কোডিং অনুশীলন করুন"}
                </p>
              </div>
              <div className="text-center p-6">
                <Shield className="w-12 h-12 text-sky-600 mx-auto mb-4" />
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