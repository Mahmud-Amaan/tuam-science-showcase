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
      accentGlow: "from-amber-500/20 to-amber-400/10",
      iconAccent: "from-amber-400 to-amber-500",
      iconAnimation: "group-hover:scale-125 transition-transform duration-300",
    },
    {
      icon: "⚛️",
      titleEn: "Physics",
      titleBn: "পদার্থবিদ্যা",
      descEn: "Understand motion, forces, energy, and waves with real-time simulations.",
      descBn: "রিয়েল-টাইম সিমুলেশনের সাথে গতি, শক্তি এবং তরঙ্গ বুঝুন।",
      accentGlow: "from-blue-500/25 to-cyan-400/10",
      iconAccent: "from-blue-400 to-cyan-500",
      iconAnimation: "group-hover:animate-spin",
    },
    {
      icon: "🧪",
      titleEn: "Chemistry",
      titleBn: "রসায়ন",
      descEn: "Visualize chemical reactions, molecular structures, and atomic models interactively.",
      descBn: "রাসায়নিক বিক্রিয়া, আণবিক কাঠামো এবং পরমাণু মডেল কল্পনা করুন।",
      accentGlow: "from-emerald-500/20 to-green-400/10",
      iconAccent: "from-emerald-400 to-green-500",
      iconAnimation: "group-hover:scale-125 transition-transform duration-300",
    },
    {
      icon: "🌿",
      titleEn: "Biology",
      titleBn: "জীববিজ্ঞান",
      descEn: "Explore cells, organisms, ecosystems, and life processes through 3D models.",
      descBn: "3D মডেলের মাধ্যমে কোষ, জীব এবং জীবন প্রক্রিয়া অন্বেষণ করুন।",
      accentGlow: "from-orange-500/20 to-rose-400/10",
      iconAccent: "from-orange-400 to-rose-500",
      iconAnimation: "group-hover:scale-125 transition-transform duration-300",
    },
    {
      icon: "💻",
      titleEn: "ICT",
      titleBn: "আইসিটি",
      descEn: "Discover the world of Information and Communication Technology.",
      descBn: "তথ্য ও যোগাযোগ প্রযুক্তির বিশ্ব আবিষ্কার করুন।",
      accentGlow: "from-sky-500/20 to-blue-400/10",
      iconAccent: "from-sky-400 to-blue-500",
      iconAnimation: "group-hover:scale-125 transition-transform duration-300",
    },
  ]

  return (
    <section
      id="subject-cards"
      className="relative py-24 px-4 bg-gradient-to-b from-background via-muted/20 to-muted/10 dark:from-background dark:via-background/80 dark:to-background"
      aria-labelledby="subject-cards-heading"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-100/20 to-transparent dark:from-primary/15 rounded-full blur-3xl" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-green-100/20 to-transparent dark:from-secondary/15 rounded-full blur-3xl" aria-hidden="true" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2
            id="subject-cards-heading"
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
          >
            {language === "en" ? "Choose Your Subject" : "আপনার বিষয় নির্বাচন করুন"}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === "en"
              ? "Each subject comes with interactive lessons and hands-on simulations"
              : "প্রতিটি বিষয়ে ইন্টারঅ্যাক্টিভ পাঠ এবং হ্যান্ডস-অন সিমুলেশন রয়েছে"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" role="list" aria-label={language === "en" ? "Available subjects" : "উপলব্ধ বিষয়সমূহ"}>
          {subjects.map((subject, idx) => (
            <div
              key={idx}
              className={`group relative p-8 rounded-2xl border border-border/60 bg-card/95 shadow-lg shadow-primary/5 transition-all duration-300 cursor-pointer overflow-hidden hover:-translate-y-3 hover:shadow-primary/20 focus:outline-none focus:ring-4 focus:ring-primary/30`}
              role="listitem"
              tabIndex={0}
              aria-label={`${language === "en" ? subject.titleEn : subject.titleBn} subject card`}
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
                  "ICT": "/ict",
                  "আইসিটি": "/ict",
                }
                const route = routes[subject.titleEn] || routes[subject.titleBn] || "/"
                router.push(route)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  const routes: Record<string, string> = {
                    "Mathematics": "/math",
                    "গণিত": "/math",
                    "Physics": "/physics",
                    "পদার্থবিদ্যা": "/physics",
                    "Chemistry": "/chemistry",
                    "রসায়ন": "/chemistry",
                    "Biology": "/biology",
                    "জীববিজ্ঞান": "/biology",
                    "ICT": "/ict",
                    "আইসিটি": "/ict",
                  }
                  const route = routes[subject.titleEn] || routes[subject.titleBn] || "/"
                  router.push(route)
                }
              }}
            >
              {/* Background accent with glow */}
              <div
                className={`absolute -top-16 -right-16 w-40 h-40 bg-gradient-to-br ${subject.accentGlow} rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-500 blur-3xl pointer-events-none`}
                aria-hidden="true"
              />

              {/* Inner shadow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />

              <div className="relative z-10">
                <div
                  className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${subject.iconAccent} text-white shadow-lg shadow-primary/20 ${subject.iconAnimation}`}
                  role="img"
                  aria-label={`${language === "en" ? subject.titleEn : subject.titleBn} icon`}
                >
                  <span className="text-3xl">{subject.icon}</span>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  {language === "en" ? subject.titleEn : subject.titleBn}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
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
                      "ICT": "/ict",
                      "আইসিটি": "/ict",
                    }
                    const route = routes[subject.titleEn] || routes[subject.titleBn] || "/"
                    router.push(route)
                  }}
                  className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 hover:shadow-lg hover:shadow-primary/30"
                  aria-label={`${language === "en" ? "Explore" : "অন্বেষণ করুন"} ${language === "en" ? subject.titleEn : subject.titleBn}`}
                >
                  {language === "en" ? "Explore Now" : "এখনই অন্বেষণ করুন"}
                </button>
              </div>

              {/* Border glow effect */}
              <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-primary/40 transition-all duration-300" aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SubjectCards
