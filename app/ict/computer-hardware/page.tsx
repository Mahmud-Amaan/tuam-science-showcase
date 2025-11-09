"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Cpu, MemoryStick, CircuitBoard } from "lucide-react"
import Header from "@/components/Header"

import Footer from "@/components/Footer"

export default function ComputerHardwarePage() {
  const [language, setLanguage] = useState<"en" | "bn">("en")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  const topics = [
    {
      titleEn: "Computer Parts",
      titleBn: "কম্পিউটার পার্টস",
      descEn: "Explore different computer components and their functions",
      descBn: "বিভিন্ন কম্পিউটার উপাদান এবং তাদের কার্যকারিতা অন্বেষণ করুন",
      icon: "💻",
      href: "/ict/computer-hardware/computer-parts",
    },
    {
      titleEn: "Motherboard",
      titleBn: "মাদারবোর্ড",
      descEn: "Interactive 3D motherboard and its components",
      descBn: "ইন্টারেক্টিভ ত্রিমাত্রিক মাদারবোর্ড এবং এর উপাদান",
      icon: "🔌",
      href: "/ict/computer-hardware/motherboard",
    },
    {
      titleEn: "Quantum Computer",
      titleBn: "কোয়ান্টাম কম্পিউটার",
      descEn: "Advanced quantum computing technology",
      descBn: "উন্নত কোয়ান্টাম কম্পিউটিং প্রযুক্তি",
      icon: "⚛️",
      href: "/ict/computer-hardware/quantum-computer",
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
              onClick={() => router.push("/ict")}
              className="inline-flex items-center gap-2 mb-8 text-primary hover:text-primary/80 transition-colors group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">{language === "en" ? "Back to ICT" : "ICT-তে ফিরুন"}</span>
            </button>

            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/25">
                <Cpu className="w-12 h-12 text-white" strokeWidth={1.5} />
              </div>
              <div>
                <h1 className="text-5xl md:text-6xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  {language === "en" ? "Computer Hardware" : "কম্পিউটার হার্ডওয়্যার"}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {language === "en"
                    ? "Explore the physical components of computers and their functions"
                    : "কম্পিউটারের শারীরিক উপাদান এবং তাদের কার্যকারিতা অন্বেষণ করুন"}
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
                <MemoryStick className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{language === "en" ? "3D Models" : "3D মডেল"}</h3>
                <p className="text-muted-foreground">
                  {language === "en"
                    ? "Interactive 3D models of computer components"
                    : "কম্পিউটার উপাদানের ইন্টারঅ্যাক্টিভ 3D মডেল"}
                </p>
              </div>
              <div className="text-center p-6">
                <CircuitBoard className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{language === "en" ? "Hardware Explorer" : "হার্ডওয়্যার এক্সপ্লোরার"}</h3>
                <p className="text-muted-foreground">
                  {language === "en"
                    ? "Explore motherboard and circuit designs"
                    : "মাদারবোর্ড এবং সার্কিট ডিজাইন অন্বেষণ করুন"}
                </p>
              </div>
              <div className="text-center p-6">
                <Cpu className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{language === "en" ? "Modern Technology" : "আধুনিক প্রযুক্তি"}</h3>
                <p className="text-muted-foreground">
                  {language === "en"
                    ? "Learn about quantum computing technology"
                    : "কোয়ান্টাম কম্পিউটিং প্রযুক্তি সম্পর্কে জানুন"}
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