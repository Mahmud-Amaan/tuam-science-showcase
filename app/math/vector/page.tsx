"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Compass } from "lucide-react"
import Header from "@/components/Header"
import AnimatedBackground from "@/components/AnimatedBackground"
import Footer from "@/components/Footer"

export default function VectorPage() {
  const [language, setLanguage] = useState<"en" | "bn">("en")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

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
        <section className="relative pt-24 pb-12 px-4 bg-linear-to-br from-amber-50 via-yellow-50/50 to-orange-50/30">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => router.push("/math")}
              className="inline-flex items-center gap-2 mb-8 text-amber-700 hover:text-amber-900 transition-colors group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">{language === "en" ? "Back to Math" : "গণিতে ফিরুন"}</span>
            </button>

            <div className="flex items-center gap-6 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-amber-500 to-yellow-400 flex items-center justify-center shadow-lg">
                <Compass className="w-10 h-10 text-white" strokeWidth={1.5} />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
                  {language === "en" ? "Vector Addition" : "ভেক্টর সংযোজন"}
                </h1>
                <p className="text-lg text-slate-600">
                  {language === "en"
                    ? "Explore vector addition interactively"
                    : "ইন্টারঅ্যাক্টিভভাবে ভেক্টর সংযোজন অন্বেষণ করুন"}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-16">
          <div className="max-w-7xl mx-auto">
            <div className="w-full aspect-[16/9] bg-white border rounded-xl overflow-hidden shadow">
              <iframe
                title={language === "en" ? "PhET Vector Addition Simulation" : "ফেট ভেক্টর সংযোজন সিমুলেশন"}
                src="https://phet.colorado.edu/sims/html/vector-addition/latest/vector-addition_all.html"
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          </div>
        </section>
      </main>

      <Footer language={language} />
    </div>
  )
}
