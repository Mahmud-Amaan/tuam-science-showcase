"use client"

interface BenefitsProps {
  language: "en" | "bn"
}

const Benefits = ({ language }: BenefitsProps) => {
  const benefits = [
    {
      titleEn: "For Students",
      titleBn: "শিক্ষার্থীদের জন্য",
      itemsEn: [
        "Learn at your own pace",
        "Visual explanations of complex topics",
        "Practice with unlimited simulations",
        "Boost exam performance",
      ],
      itemsBn: [
        "আপনার নিজের গতিতে শিখুন",
        "জটিল বিষয়ের ভিজ্যুয়াল ব্যাখ্যা",
        "সীমাহীন সিমুলেশনের সাথে অনুশীলন করুন",
        "পরীক্ষার কর্মক্ষমতা বৃদ্ধি করুন",
      ],
      icon: "📚",
    },
    {
      titleEn: "For Teachers",
      titleBn: "শিক্ষকদের জন্য",
      itemsEn: [
        "Enhance classroom engagement",
        "Save preparation time",
        "Track student progress",
        "Make lessons memorable",
      ],
      itemsBn: ["ক্লাসরুম সংযুক্তি বৃদ্ধি করুন", "প্রস্তুতির সময় সাশ্রয় করুন", "শিক্ষার্থীর অগ্রগতি ট্র্যাক করুন", "পাঠগুলো স্মরণীয় করুন"],
      icon: "👨‍🏫",
    },
  ]

  return (
    <section className="py-20 px-4 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-foreground">
          {language === "en" ? "Why NCTB Science Simulator?" : "কেন এনসিটিবি বিজ্ঞান সিমুলেটর?"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="space-y-6">
              <div className="flex items-center gap-4 mb-8">
                <span className="text-5xl">{benefit.icon}</span>
                <h3 className="text-2xl font-bold text-foreground">
                  {language === "en" ? benefit.titleEn : benefit.titleBn}
                </h3>
              </div>

              <div className="space-y-4">
                {(language === "en" ? benefit.itemsEn : benefit.itemsBn).map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    className="flex items-start gap-4 p-4 rounded-lg bg-white border border-border hover:border-primary/50 transition-colors"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mt-0.5">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-foreground font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Benefits
