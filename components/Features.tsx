"use client"

import { Eye, Zap, Lightbulb, Users } from "lucide-react"

interface FeaturesProps {
  language: "en" | "bn"
}

const Features = ({ language }: FeaturesProps) => {
  const features = [
    {
      icon: Eye,
      titleEn: "Interactive 3D Models",
      titleBn: "ইন্টারঅ্যাক্টিভ 3D মডেল",
      descEn: "See complex concepts come alive through real-time 3D models with full rotation and zoom",
      descBn: "রিয়েল-টাইম 3D মডেলের মাধ্যমে জটিল ধারণা জীবন্ত হয়ে উঠুক",
      color: "from-blue-500 to-cyan-500",
      stat: "500+",
    },
    {
      icon: Zap,
      titleEn: "Hands-on Experiments",
      titleBn: "হ্যান্ডস-অন পরীক্ষা",
      descEn: "Experiment safely with variables and see instant results - risk-free science learning",
      descBn: "নিরাপদে ভেরিয়েবল নিয়ে পরীক্ষা করুন এবং তাৎক্ষণিক ফলাফল দেখুন",
      color: "from-yellow-500 to-amber-500",
      stat: "1000+",
    },
    {
      icon: Lightbulb,
      titleEn: "Deep Understanding",
      titleBn: "গভীর বোঝাপড়া",
      descEn: "Build deep conceptual knowledge with guided simulations and step-by-step explanations",
      descBn: "গাইডেড সিমুলেশন দিয়ে গভীর ধারণা তৈরি করুন",
      color: "from-green-500 to-emerald-500",
      stat: "95%",
    },
    {
      icon: Users,
      titleEn: "Educator Tools",
      titleBn: "শিক্ষক সরঞ্জাম",
      descEn: "Easy-to-use tools designed specifically for educators to enhance classroom engagement",
      descBn: "শিক্ষকদের জন্য ডিজাইন করা সহজ সরঞ্জাম",
      color: "from-purple-500 to-pink-500",
      stat: "50K+",
    },
  ]

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-slate-50/50 to-white" aria-labelledby="features-heading">
      <h2 id="features-heading" className="sr-only">{language === "en" ? "Features" : "বৈশিষ্ট্যসমূহ"}</h2>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" role="list" aria-label={language === "en" ? "Platform features" : "প্ল্যাটফর্ম বৈশিষ্ট্যসমূহ"}>
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <div
                key={idx}
                className="group relative p-8 rounded-xl bg-white border border-slate-200 hover:border-transparent transition-all duration-300 hover:bg-gradient-to-br hover:from-white hover:to-blue-50/50 hover:shadow-2xl hover:shadow-blue-500/15 transform hover:-translate-y-3 overflow-hidden"
                style={{ animation: `slide-up 0.6s ease-out ${idx * 0.1}s backwards` }}
                role="listitem"
                aria-labelledby={`feature-title-${idx}`}
                aria-describedby={`feature-desc-${idx} feature-stat-${idx}`}
              >
                <div
                  className={`absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-bl ${feature.color} rounded-full opacity-0 group-hover:opacity-25 transition-opacity duration-300 blur-lg`}
                  aria-hidden="true"
                />

                <div
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-lg bg-gradient-to-br ${feature.color} mb-4 transition-all duration-300 group-hover:shadow-lg group-hover:scale-125`}
                  role="img"
                  aria-label={`${language === "en" ? feature.titleEn : feature.titleBn} icon`}
                >
                  <Icon className="text-white w-7 h-7" aria-hidden="true" />
                </div>

                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-300/30" aria-label={`${feature.stat} ${language === "en" ? "statistic" : "পরিসংখ্যান"}`}>
                  <span id={`feature-stat-${idx}`} className="text-xs font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    {feature.stat}
                  </span>
                </div>

                <h3 id={`feature-title-${idx}`} className="text-lg font-semibold text-slate-900 mb-2">
                  {language === "en" ? feature.titleEn : feature.titleBn}
                </h3>
                <p id={`feature-desc-${idx}`} className="text-sm text-slate-600 leading-relaxed">
                  {language === "en" ? feature.descEn : feature.descBn}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Features
