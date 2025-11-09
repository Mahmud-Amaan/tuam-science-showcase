"use client"

import { useEffect, useState } from "react"

interface StatsProps {
  language: "en" | "bn"
}

const Stats = ({ language }: StatsProps) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
      }
    })
    const element = document.getElementById("stats-section")
    if (element) observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const AnimatedCounter = ({ end, duration = 2 }: { end: number; duration?: number }) => {
    const [count, setCount] = useState(0)

    useEffect(() => {
      if (!isVisible) return
      let current = 0
      const increment = end / (duration * 60)
      const interval = setInterval(() => {
        current += increment
        if (current >= end) {
          setCount(end)
          clearInterval(interval)
        } else {
          setCount(Math.floor(current))
        }
      }, 1000 / 60)
      return () => clearInterval(interval)
    }, [isVisible, end, duration])

    return <span>{count.toLocaleString()}</span>
  }

  const stats = [
    { icon: "👥", labelEn: "Active Users", labelBn: "সক্রিয় ব্যবহারকারী", value: 50000 },
    { icon: "📚", labelEn: "Simulations", labelBn: "সিমুলেশন", value: 500 },
    { icon: "⭐", labelEn: "Avg Rating", labelBn: "গড় রেটিং", value: 49, suffix: "/50" },
    { icon: "🏆", labelEn: "Success Rate", labelBn: "সাফল্যের হার", value: 95, suffix: "%" },
  ]

  return (
    <section id="stats-section" className="py-24 px-4 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 dark:from-primary/10 dark:via-secondary/5 dark:to-accent/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="relative p-6 rounded-xl border border-border/70 bg-card shadow-lg shadow-primary/5 hover:border-primary/40 hover:shadow-primary/20 transition-all duration-300 hover:scale-105 text-center group"
              style={{ animation: `bounce-in 0.6s ease-out ${idx * 0.15}s backwards` }}
            >
              <div className="text-4xl mb-2 group-hover:scale-125 transition-transform duration-300">{stat.icon}</div>
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                {isVisible ? <AnimatedCounter end={stat.value} /> : "0"}
                <span className="text-xl">{stat.suffix || ""}</span>
              </div>
              <p className="text-sm text-muted-foreground">{language === "en" ? stat.labelEn : stat.labelBn}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Stats
