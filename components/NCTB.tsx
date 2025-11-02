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
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            {language === "en" ? "NCTB Curriculum Aligned" : "এনসিটিবি পাঠ্যক্রম সামঞ্জস্যপূর্ণ"}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === "en"
              ? "Our simulations are carefully designed to align with the National Curriculum and Textbook Board standards"
              : "আমাদের সিমুলেশনগুলি জাতীয় পাঠ্যক্রম এবং পাঠ্যপুস্তক বোর্ড মানদণ্ডের সাথে সামঞ্জস্যপূর্ণভাবে ডিজাইন করা হয়েছে"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {curricula.map((curr, idx) => (
            <div
              key={idx}
              className="relative p-8 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/20 border border-border hover:border-primary/50 transition-all duration-300 group hover:shadow-lg overflow-hidden"
            >
              <div className="absolute top-4 right-4 text-4xl">{curr.icon}</div>

              <h3 className="text-2xl font-bold text-foreground mb-2">
                {language === "en" ? curr.classEn : curr.classBn}
              </h3>
              <p className="text-sm text-muted-foreground mb-6">{language === "en" ? curr.topicsEn : curr.topicsBn}</p>

              <button 
                onClick={() => {
                  // Placeholder for curriculum exploration functionality
                  console.log(`Exploring ${language === "en" ? curr.classEn : curr.classBn}`)
                }}
                className="w-full py-2 rounded-lg border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold transition-all duration-300"
              >
                {language === "en" ? "Explore Topics" : "বিষয়গুলি অন্বেষণ করুন"}
              </button>

              <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default NCTB
