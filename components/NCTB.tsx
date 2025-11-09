"use client"

interface NCTBProps {
  language: "en" | "bn"
}

const NCTB = ({ language }: NCTBProps) => {
  const curricula = [
    {
      classEn: "Class 9-10 (Science)",
      classBn: "নবম-দশ শ্রেণী (বিজ্ঞান)",
      topicsEn: "Advanced Physics, Chemistry, Biology",
      topicsBn: "উন্নত পদার্থবিদ্যা, রসায়ন, জীববিজ্ঞান",
      icon: "🔬",
    },
  ]

  return (
    <section
      className="py-20 px-4 bg-gradient-to-b from-background via-muted/15 to-muted/5 dark:from-background dark:via-background/80 dark:to-background"
      aria-labelledby="nctb-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 id="nctb-heading" className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            {language === "en" ? "National Curriculum Aligned" : "জাতীয় পাঠ্যক্রম সামঞ্জস্যপূর্ণ"}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === "en"
              ? "Our simulations are carefully designed to align with the National Curriculum standards"
              : "আমাদের সিমুলেশনগুলি জাতীয় পাঠ্যক্রম মানদণ্ডের সাথে সামঞ্জস্যপূর্ণভাবে ডিজাইন করা হয়েছে"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8" role="list" aria-label={language === "en" ? "Curriculum classes" : "পাঠ্যক্রম শ্রেণীসমূহ"}>
          {curricula.map((curr, idx) => (
            <div
              key={idx}
              className="relative p-8 rounded-2xl border border-border/70 bg-card shadow-lg shadow-primary/5 hover:border-primary/40 hover:shadow-primary/20 transition-all duration-300 group overflow-hidden"
              role="listitem"
              aria-labelledby={`curriculum-title-${idx}`}
              aria-describedby={`curriculum-desc-${idx}`}
            >
              <div className="absolute top-4 right-4 text-4xl" role="img" aria-label={`${language === "en" ? curr.classEn : curr.classBn} icon`}>{curr.icon}</div>

              <h3 id={`curriculum-title-${idx}`} className="text-2xl font-bold text-foreground mb-2">
                {language === "en" ? curr.classEn : curr.classBn}
              </h3>
              <p id={`curriculum-desc-${idx}`} className="text-sm text-muted-foreground mb-6">{language === "en" ? curr.topicsEn : curr.topicsBn}</p>

              <button
                onClick={() => {
                  // Placeholder for curriculum exploration functionality
                  console.log(`Exploring ${language === "en" ? curr.classEn : curr.classBn}`)
                }}
                className="w-full py-2 rounded-lg border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold transition-all duration-300"
                aria-label={`${language === "en" ? "Explore topics for" : "বিষয়গুলি অন্বেষণ করুন"} ${language === "en" ? curr.classEn : curr.classBn}`}
              >
                {language === "en" ? "Explore Topics" : "বিষয়গুলি অন্বেষণ করুন"}
              </button>

              <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-primary/15 rounded-full blur-3xl group-hover:bg-primary/25 transition-all duration-300" aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default NCTB
