"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Microscope, ArrowLeft } from "lucide-react"
import Header from "@/components/Header"

import Footer from "@/components/Footer"

export default function CellsPage() {
  const [language, setLanguage] = useState<"en" | "bn">("en")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  const topics = [
    {
      titleEn: "Animal Cell",
      titleBn: "প্রাণী কোষ",
      descEn: "Explore organelles in an animal cell",
      descBn: "প্রাণী কোষে অঙ্গাণুসমূহ অন্বেষণ করুন",
      icon: "🧫",
      href: "/biology/cells/animal-cell",
    },
    {
      titleEn: "Plant Cell",
      titleBn: "উদ্ভিদ কোষ",
      descEn: "Study the structure of a plant cell",
      descBn: "উদ্ভিদ কোষের গঠন অধ্যয়ন করুন",
      icon: "🌿",
      href: "/biology/cells/plant-cell",
    },
    {
      titleEn: "Eukaryotic Plant Cell",
      titleBn: "ইউক্যারিয়োটিক উদ্ভিদ কোষ",
      descEn: "Detailed eukaryotic plant cell model",
      descBn: "বিস্তারিত ইউক্যারিয়োটিক উদ্ভিদ কোষ মডেল",
      icon: "🌱",
      href: "/biology/cells/eukaryotic-plant-cell",
    },
    {
      titleEn: "Eukaryotic Cell",
      titleBn: "ইউক্যারিয়োটিক কোষ",
      descEn: "General structure of a eukaryotic cell",
      descBn: "একটি ইউক্যারিয়োটিক কোষের সাধারণ গঠন",
      icon: "🧬",
      href: "/biology/cells/eukaryotic-cell",
    },
    {
      titleEn: "Mitochondria",
      titleBn: "মাইটোকন্ড্রিয়া",
      descEn: "Cross-section of mitochondria",
      descBn: "মাইটোকন্ড্রিয়ার ক্রস-সেকশন",
      icon: "⚡",
      href: "/biology/cells/mitochondria",
    },
    {
      titleEn: "Cell Nucleus",
      titleBn: "কোষকেন্দ্র",
      descEn: "Structure of the cell nucleus",
      descBn: "কোষকেন্দ্রের গঠন",
      icon: "🔵",
      href: "/biology/cells/nucleus",
    },
    {
      titleEn: "Chloroplast",
      titleBn: "ক্লোরোপ্লাস্ট",
      descEn: "Chloroplast structure and function",
      descBn: "ক্লোরোপ্লাস্টের গঠন ও কাজ",
      icon: "🌞",
      href: "/biology/cells/chloroplast",
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
        <section className="relative pt-24 pb-16 px-4 bg-linear-to-br from-orange-50 via-red-50/50 to-amber-50/30">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => router.push("/biology")}
              className="inline-flex items-center gap-2 mb-8 text-orange-700 hover:text-orange-900 transition-colors group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">{language === "en" ? "Back to Biology" : "জীববিজ্ঞানে ফিরুন"}</span>
            </button>

            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-orange-500 to-red-400 flex items-center justify-center shadow-lg">
                <Microscope className="w-12 h-12 text-white" strokeWidth={1.5} />
              </div>
              <div>
                <h1 className="text-5xl md:text-6xl font-bold bg-linear-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                  {language === "en" ? "Cell Biology" : "কোষ জীববিদ্যা"}
                </h1>
                <p className="text-lg text-slate-600">
                  {language === "en"
                    ? "Interactive 3D models of cells and organelles"
                    : "কোষ এবং অঙ্গাণুর ইন্টারঅ্যাক্টিভ 3D মডেল"}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
              {language === "en" ? "Explore Subtopics" : "উপ-বিষয় অন্বেষণ করুন"}
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

      </main>

      <Footer language={language} />
    </div>
  )
}