"use client"

export default function Hero({ language }: { language: "en" | "bn" }) {
  return (
    <section className="relative py-16 px-4 overflow-hidden">
      <div className="container mx-auto">
        <div className="relative z-10 text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-accent/10 rounded-full border border-accent/30">
            <span className="text-sm font-semibold text-accent">
              {language === "en" ? "✨ Interactive Learning Platform" : "✨ ইন্টারেক্টিভ শিক্ষা প্ল্যাটফর্ম"}
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
            {language === "en" ? "NCTB Math Simulator" : "এনসিটিবি গণিত সিমুলেটর"}
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            {language === "en"
              ? "Visualize and explore mathematical concepts interactively. Adjust variables in real-time and see how graphs transform before your eyes."
              : "গাণিতিক ধারণাগুলি ইন্টারেক্টিভভাবে কল্পনা করুন এবং অন্বেষণ করুন। রিয়েল-টাইমে ভেরিয়েবল সামঞ্জস্য করুন এবং দেখুন গ্রাফগুলি কীভাবে রূপান্তরিত হয়।"}
          </p>

          <div className="relative h-48 md:h-64 flex items-center justify-center animate-float">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl"></div>
            <svg className="w-32 h-32 relative z-10" viewBox="0 0 100 100" fill="none">
              <path d="M 20 80 Q 50 30 80 50" stroke="url(#gradient1)" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 20 70 Q 50 40 80 60" stroke="url(#gradient2)" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="20" cy="80" r="2.5" fill="currentColor" className="text-accent" />
              <circle cx="80" cy="50" r="2.5" fill="currentColor" className="text-secondary" />
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--primary)" />
                  <stop offset="100%" stopColor="var(--secondary)" />
                </linearGradient>
                <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--secondary)" />
                  <stop offset="100%" stopColor="var(--accent)" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
