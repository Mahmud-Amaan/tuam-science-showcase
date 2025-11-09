"use client"

import { Facebook, Twitter, Linkedin, Youtube } from "lucide-react"

interface FooterProps {
  language: "en" | "bn"
}

const Footer = ({ language }: FooterProps) => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border/60 bg-gradient-to-b from-background to-background/95 text-foreground dark:from-background/95 dark:to-background/85">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg shadow-primary/30">
                🔬
              </div>
              <h3 className="text-2xl font-bold">
                {language === "en" ? "Virtual Lab " : "ভার্চুয়াল ল্যাব"}
              </h3>
            </div>
            <p className="text-muted-foreground">
              {language === "en"
                ? "Making science education interactive, engaging, and effective for students and teachers across Bangladesh."
                : "বাংলাদেশের শিক্ষার্থী এবং শিক্ষকদের জন্য বিজ্ঞান শিক্ষাকে ইন্টারঅ্যাক্টিভ, আকর্ষণীয় এবং কার্যকর করা।"}
            </p>
          </div>

          {/* Social Links */}
          <div className="flex flex-col justify-start gap-6">
            <h4 className="text-lg font-semibold">{language === "en" ? "Follow Us" : "আমাদের অনুসরণ করুন"}</h4>
            <div className="flex items-center gap-4">
              {[
                { icon: Facebook, label: "Facebook", url: "#" },
                { icon: Twitter, label: "Twitter", url: "#" },
                { icon: Linkedin, label: "LinkedIn", url: "#" },
                { icon: Youtube, label: "YouTube", url: "#" },
              ].map((social, idx) => {
                const Icon = social.icon
                return (
                  <a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all duration-300 hover:scale-110 transform"
                    aria-label={social.label}
                  >
                    <Icon size={20} />
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/60 my-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-muted-foreground">
          <p>
            © {currentYear}{" "}
            {language === "en"
              ? "Virtual Lab. Note: Credits to the referenced sources, tools, and partner laboratories featured throughout this experience."
              : "ভার্চুয়াল ল্যাব। সর্বাধিকার সংরক্ষিত। নোট: এই অভিজ্ঞতায় ব্যবহৃত উৎস, সরঞ্জাম এবং অংশীদার ল্যাবগুলোর প্রতি কৃতজ্ঞতা।"}
          </p>
          <div className="flex gap-6">
            <button 
              onClick={() => console.log("Privacy Policy clicked")}
              className="hover:text-foreground transition-colors"
            >
              {language === "en" ? "Privacy Policy" : "গোপনীয়তা নীতি"}
            </button>
            <button 
              onClick={() => console.log("Terms of Service clicked")}
              className="hover:text-foreground transition-colors"
            >
              {language === "en" ? "Terms of Service" : "সেবার শর্তাবলী"}
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
