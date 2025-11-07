"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Move, Loader2 } from "lucide-react"
import Header from "@/components/Header"

import Footer from "@/components/Footer"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { createLazyComponent } from "@/components/ui/lazy-wrapper"

const MotionSimulation = createLazyComponent(
  () => import("@/components/MotionSimulation"),
  () => <div className="min-h-[400px] flex items-center justify-center">
    <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
  </div>
)

export default function MotionPage() {
  const [language, setLanguage] = useState<"en" | "bn">("en")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Handle loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000) // Simulate loading time
    return () => clearTimeout(timer)
  }, [])

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
        <section className="relative pt-24 pb-12 px-4 bg-linear-to-br from-blue-50 via-cyan-50/50 to-indigo-50/30">
          <div className="max-w-7xl mx-auto">
            <button
              aria-label={language === "en" ? "Return to Physics page" : "পদার্থবিদ্যায় ফিরে যান"}
              onClick={() => router.push("/physics")}
              className="inline-flex items-center gap-2 mb-8 text-blue-700 hover:text-blue-900 transition-colors group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">{language === "en" ? "Back to Physics" : "পদার্থবিদ্যায় ফিরুন"}</span>
            </button>

            <div className="flex items-center gap-6 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg" aria-hidden="true">
                <Move className="w-10 h-10 text-white" strokeWidth={1.5} />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                  {language === "en" ? "Motion & Kinematics" : "গতি এবং কাইনেমেটিক্স"}
                </h1>
                <p className="text-lg text-slate-600">
                  {language === "en"
                    ? "Interactive simulation of linear motion with kinematics equations"
                    : "কাইনেমেটিক্স সমীকরণ সহ রৈখিক গতির ইন্টারঅ্যাক্টিভ সিমুলেশন"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Simulation Section */}
        <section className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            {isLoading ? (
              <div className="min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
                  <p className="text-slate-600">
                    {language === "en" ? "Loading simulation..." : "সিমুলেশন লোড হচ্ছে..."}
                  </p>
                </div>
              </div>
            ) : (
              <ErrorBoundary>
                <MotionSimulation language={language} />
              </ErrorBoundary>
            )}
          </div>
        </section>

        {/* Theory Section */}
        <section className="py-16 px-4 bg-linear-to-b from-white to-blue-50/30">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-foreground" id="formulas">
              {language === "en" ? "Kinematics Formulas" : "কাইনেমেটিক্স সূত্র"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 bg-white rounded-xl border-2 border-blue-200 shadow-lg">
                <h3 className="text-xl font-bold mb-3 text-blue-600">v = u + a×t</h3>
                <p className="text-sm text-muted-foreground">
                  {language === "en"
                    ? "Final velocity equals initial velocity plus acceleration times time"
                    : "চূড়ান্ত বেগ = প্রাথমিক বেগ + (ত্বরণ × সময়)"}
                </p>
              </div>

              <div className="p-6 bg-white rounded-xl border-2 border-blue-200 shadow-lg">
                <h3 className="text-xl font-bold mb-3 text-blue-600">s = u×t + ½×a×t²</h3>
                <p className="text-sm text-muted-foreground">
                  {language === "en"
                    ? "Displacement equals initial velocity times time plus half acceleration times time squared"
                    : "সরণ = (প্রাথমিক বেগ × সময়) + (½ × ত্বরণ × সময়²)"}
                </p>
              </div>

              <div className="p-6 bg-white rounded-xl border-2 border-blue-200 shadow-lg">
                <h3 className="text-xl font-bold mb-3 text-blue-600">v² = u² + 2×a×s</h3>
                <p className="text-sm text-muted-foreground">
                  {language === "en"
                    ? "Final velocity squared equals initial velocity squared plus two times acceleration times displacement"
                    : "চূড়ান্ত বেগ² = প্রাথমিক বেগ² + (2 × ত্বরণ × সরণ)"}
                </p>
              </div>
            </div>

            <div className="p-6 bg-blue-100 rounded-xl border border-blue-300">
              <h3 className="font-semibold text-blue-900 mb-3">
                {language === "en" ? "Symbols:" : "প্রতীকসমূহ:"}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm text-blue-800">
                <div><strong>u</strong> = {language === "en" ? "Initial velocity" : "প্রাথমিক বেগ"}</div>
                <div><strong>v</strong> = {language === "en" ? "Final velocity" : "চূড়ান্ত বেগ"}</div>
                <div><strong>a</strong> = {language === "en" ? "Acceleration" : "ত্বরণ"}</div>
                <div><strong>s</strong> = {language === "en" ? "Displacement" : "সরণ"}</div>
                <div><strong>t</strong> = {language === "en" ? "Time" : "সময়"}</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer language={language} />
    </div>
  )
}



