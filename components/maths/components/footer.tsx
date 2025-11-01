"use client"

export default function Footer({ language }: { language: "en" | "bn" }) {
  return (
    <footer className="mt-20 border-t border-border bg-card/50 backdrop-blur">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-foreground mb-4">{language === "en" ? "Subjects" : "বিষয়"}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-primary cursor-pointer transition">
                {language === "en" ? "Physics" : "পদার্থবিজ্ঞান"}
              </li>
              <li className="hover:text-primary cursor-pointer transition">
                {language === "en" ? "Chemistry" : "রসায়ন"}
              </li>
              <li className="hover:text-primary cursor-pointer transition">
                {language === "en" ? "Biology" : "জীববিজ্ঞান"}
              </li>
              <li className="hover:text-primary cursor-pointer transition">
                {language === "en" ? "English" : "ইংরেজি"}
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-foreground mb-4">{language === "en" ? "Resources" : "সম্পদ"}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-primary cursor-pointer transition">
                {language === "en" ? "NCTB Syllabus" : "এনসিটিবি পাঠ্যক্রম"}
              </li>
              <li className="hover:text-primary cursor-pointer transition">{language === "en" ? "Formulas" : "সূত্র"}</li>
              <li className="hover:text-primary cursor-pointer transition">
                {language === "en" ? "Practice" : "অনুশীলন"}
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-foreground mb-4">{language === "en" ? "Connect" : "সংযোগ করুন"}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-primary cursor-pointer transition">Twitter</li>
              <li className="hover:text-primary cursor-pointer transition">Facebook</li>
              <li className="hover:text-primary cursor-pointer transition">YouTube</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-foreground mb-4">{language === "en" ? "About" : "সম্পর্কে"}</h3>
            <p className="text-sm text-muted-foreground">
              {language === "en"
                ? "Making STEM education interactive and engaging for students."
                : "শিক্ষার্থীদের জন্য STEM শিক্ষাকে ইন্টারেক্টিভ এবং আকর্ষণীয় করে তোলা।"}
            </p>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>
            {language === "en"
              ? "© 2025 NCTB Science Simulator. Built with passion for learning. Made by students, for students."
              : "© ২০২৫ এনসিটিবি সায়েন্স সিমুলেটর। শেখার প্রতি অনুরাগের সাথে তৈরি। শিক্ষার্থীদের দ্বারা, শিক্ষার্থীদের জন্য।"}
          </p>
        </div>
      </div>
    </footer>
  )
}
