"use client"

import { useRouter } from "next/navigation"

interface SubjectCardsProps {
  language: "en" | "bn"
}

const SubjectCards = ({ language }: SubjectCardsProps) => {
  const router = useRouter()
  
  const subjects = [
    {
      icon: "🧮",
      titleEn: "Mathematics",
      titleBn: "গণিত",
      descEn: "Explore algebraic equations, geometry, and calculus through interactive visualizations.",
      descBn: "ইন্টারঅ্যাক্টিভ কল্পনার মাধ্যমে বীজগণিত, জ্যামিতি এবং ক্যালকুলাস অন্বেষণ করুন।",
      gradient: "from-amber-50/80 to-yellow-50/40",
      borderColor: "border-amber-200/50",
      accentColor: "bg-amber-500",
      accentLight: "bg-amber-100",
      iconAnimation: "group-hover:scale-125 transition-transform duration-300",
    },
    {
      icon: "⚛️",
      titleEn: "Physics",
      titleBn: "পদার্থবিদ্যা",
      descEn: "Understand motion, forces, energy, and waves with real-time simulations.",
      descBn: "রিয়েল-টাইম সিমুলেশনের সাথে গতি, শক্তি এবং তরঙ্গ বুঝুন।",
      gradient: "from-blue-50/80 to-cyan-50/40",
      borderColor: "border-blue-200/50",
      accentColor: "bg-blue-500",
      accentLight: "bg-blue-100",
      iconAnimation: "group-hover:animate-spin",
    },
    {
      icon: "🧪",
      titleEn: "Chemistry",
      titleBn: "রসায়ন",
      descEn: "Visualize chemical reactions, molecular structures, and atomic models interactively.",
      descBn: "রাসায়নিক বিক্রিয়া, আণবিক কাঠামো এবং পরমাণু মডেল কল্পনা করুন।",
      gradient: "from-green-50/80 to-emerald-50/40",
      borderColor: "border-green-200/50",
      accentColor: "bg-green-500",
      accentLight: "bg-green-100",
      iconAnimation: "group-hover:scale-125 transition-transform duration-300",
    },
    {
      icon: "🌿",
      titleEn: "Biology",
      titleBn: "জীববিজ্ঞান",
      descEn: "Explore cells, organisms, ecosystems, and life processes through 3D models.",
      descBn: "3D মডেলের মাধ্যমে কোষ, জীব এবং জীবন প্রক্রিয়া অন্বেষণ করুন।",
      gradient: "from-orange-50/80 to-red-50/40",
      borderColor: "border-orange-200/50",
      accentColor: "bg-orange-500",
      accentLight: "bg-orange-100",
      iconAnimation: "group-hover:scale-125 transition-transform duration-300",
    },
  ]

  return (
    <section id="subject-cards" className="relative py-24 px-4 bg-gradient-to-b from-white to-slate-50/50">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-100/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-green-100/20 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            {language === "en" ? "Choose Your Subject" : "আপনার বিষয় নির্বাচন করুন"}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {language === "en"
              ? "Each subject comes with interactive lessons and hands-on simulations"
              : "প্রতিটি বিষয়ে ইন্টারঅ্যাক্টিভ পাঠ এবং হ্যান্ডস-অন সিমুলেশন রয়েছে"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {subjects.map((subject, idx) => (
            <div
              key={idx}
              className={`group relative p-8 rounded-2xl bg-gradient-to-br ${subject.gradient} border ${subject.borderColor} hover:border-white/60 transition-all duration-300 cursor-pointer overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transform hover:-translate-y-3`}
            >
              {/* Background accent with glow */}
              <div
                className={`absolute -top-8 -right-8 w-32 h-32 ${subject.accentColor} rounded-full opacity-5 group-hover:opacity-30 transition-opacity duration-300 blur-lg`}
              />

              {/* Inner shadow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10">
                <div className={`text-5xl mb-4 inline-block ${subject.iconAnimation}`}>{subject.icon}</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  {language === "en" ? subject.titleEn : subject.titleBn}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  {language === "en" ? subject.descEn : subject.descBn}
                </p>
                <button
                  onClick={() => {
                    const routes: Record<string, string> = {
                      "Mathematics": "/math",
                      "গণিত": "/math",
                      "Physics": "/physics",
                      "পদার্থবিদ্যা": "/physics",
                      "Chemistry": "/chemistry",
                      "রসায়ন": "/chemistry",
                      "Biology": "/biology",
                      "জীববিজ্ঞান": "/biology",
                    }
                    const route = routes[subject.titleEn] || routes[subject.titleBn] || "/"
                    router.push(route)
                  }}
                  className={`w-full py-3 rounded-lg ${subject.accentColor} text-white font-semibold text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 hover:shadow-lg`}
                >
                  {language === "en" ? "Explore Now" : "এখনই অন্বেষণ করুন"}
                </button>
              </div>

              {/* Border glow effect */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-white/40 transition-all duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SubjectCards
