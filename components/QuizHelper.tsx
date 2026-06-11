"use client"

import React, { useEffect, useState, useRef } from "react"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "motion/react"
import { Award, BookOpen, CheckCircle, Clock, AlertTriangle, RefreshCw, X, Play, Sliders } from "lucide-react"

type Question = {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export default function QuizHelper() {
  const pathname = usePathname()
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({})
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  
  // Custom config states
  const [inputQuestions, setInputQuestions] = useState(10)
  const [inputTime, setInputTime] = useState(10) // minutes
  const [inputLang, setInputLang] = useState<"en" | "bn">("en")
  const [inputClass, setInputClass] = useState("10")
  const [timeRemaining, setTimeRemaining] = useState(600) // seconds
  
  const [showConfig, setShowConfig] = useState(true)
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [lang, setLang] = useState<"en" | "bn">("en")
  const [errorMsg, setErrorMsg] = useState("")

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const isDark = theme === "dark"

  // Supported simulation paths
  const simulationPaths = [
    "physics/motion",
    "physics/gravity",
    "physics/optics",
    "physics/solar",
    "chemistry/atoms",
    "chemistry/molecules",
    "chemistry/ph-scale",
    "chemistry/states",
    "chemistry/periodic-table",
    "biology/cells",
    "biology/anatomy",
    "biology/ecology",
    "biology/genetics",
    "math/vector",
    "math/trigonometry",
    "ict/logic-gates",
    "ict/circuit-construction",
    "ict/ai",
    "ict/programming"
  ]

  const isSimulationActive = simulationPaths.some((p) => pathname?.includes(p))

  useEffect(() => {
    setMounted(true)
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("ai_helper_lang") as "en" | "bn"
      if (savedLang === "en" || savedLang === "bn") {
        setLang(savedLang)
        setInputLang(savedLang)
      }
    }
  }, [])

  // Timer logic
  useEffect(() => {
    if (quizStarted && !quizSubmitted && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!)
            handleSubmitQuiz()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [quizStarted, quizSubmitted, timeRemaining])

  if (!mounted || !isSimulationActive) return null

  // Fetch quiz from API
  const handleGenerateQuiz = async () => {
    // Validate inputs
    const qsCount = Math.max(1, Math.min(30, inputQuestions))
    const timeLimitMinutes = Math.max(1, Math.min(120, inputTime))

    setLoading(true)
    setErrorMsg("")
    setQuestions([])
    setUserAnswers({})
    setCurrentQuestionIndex(0)
    setTimeRemaining(timeLimitMinutes * 60)
    setQuizStarted(false)
    setQuizSubmitted(false)
    setShowConfig(false)
    setLang(inputLang)

    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contextPath: pathname,
          language: inputLang,
          questionCount: qsCount,
          studentClass: inputClass
        })
      })

      if (!res.ok) {
        throw new Error("Failed to fetch questions")
      }

      const data = await res.json()
      if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
        setQuestions(data.questions)
        setQuizStarted(true)
      } else {
        throw new Error("Invalid questions format received")
      }
    } catch (e) {
      console.error(e)
      setErrorMsg(
        inputLang === "en"
          ? "Failed to generate quiz. Please check your connection or try again."
          : "কুইজ তৈরি করা যায়নি। অনুগ্রহ করে ইন্টারনেট সংযোগ পরীক্ষা করুন অথবা আবার চেষ্টা করুন।"
      )
      setShowConfig(true)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectOption = (questionIdx: number, optionIdx: number) => {
    if (quizSubmitted) return
    setUserAnswers((prev) => ({
      ...prev,
      [questionIdx]: optionIdx
    }))
  }

  const handleSubmitQuiz = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setQuizSubmitted(true)
  }

  const handleResetQuiz = () => {
    setShowConfig(true)
    setQuizStarted(false)
    setQuizSubmitted(false)
    setQuestions([])
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const correctAnswersCount = questions.reduce((acc, q, idx) => {
    return userAnswers[idx] === q.correctIndex ? acc + 1 : acc
  }, 0)

  const scorePercentage = questions.length > 0 ? Math.round((correctAnswersCount / questions.length) * 100) : 0

  return (
    <>
      {/* Floating Quiz Button bottom-left */}
      <div
        style={{
          position: "fixed",
          left: "28px",
          bottom: "28px",
          zIndex: 9999,
          display: "flex",
          alignItems: "center"
        }}
      >
        <motion.button
          onClick={() => {
            setOpen(true)
          }}
          whileHover={{
            scale: 1.15,
            y: -6,
            rotate: [0, 8, -8, 0],
            transition: {
              rotate: { duration: 0.5, ease: "easeInOut" },
              scale: { type: "spring", stiffness: 400, damping: 15 },
              y: { type: "spring", stiffness: 400, damping: 15 }
            }
          }}
          whileTap={{ scale: 0.92 }}
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
            border: "none",
            color: "white",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: isDark
              ? "0 8px 30px rgba(99, 102, 241, 0.4), 0 2px 6px rgba(0, 0, 0, 0.3)"
              : "0 8px 30px rgba(99, 102, 241, 0.25), 0 2px 6px rgba(99, 102, 241, 0.15)",
            outline: "none"
          }}
          title={lang === "en" ? "Take a simulation quiz" : "সিমুলেশন কুইজ দিন"}
        >
          {/* Radial Glow Backing */}
          <div
            style={{
              position: "absolute",
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(168, 85, 247, 0.22) 0%, rgba(168, 85, 247, 0) 70%)",
              filter: "blur(6px)",
              pointerEvents: "none",
              zIndex: -1
            }}
          />
          <Award size={28} />
        </motion.button>
      </div>

      <AnimatePresence>
        {open && (
          <>
            {/* Centered Modal Overlay layout */}
            <div
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 100000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px"
              }}
            >
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(15, 23, 42, 0.65)",
                  backdropFilter: "blur(8px)"
                }}
              />

              {/* Main Quiz Modal Container - VERY LARGE & CENTERED */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 15 }}
                transition={{ type: "spring", duration: 0.4 }}
                style={{
                  width: "100%",
                  maxWidth: "960px",
                  height: "85vh",
                  maxHeight: "900px",
                  background: isDark ? "#0f172a" : "#ffffff",
                  border: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.08)",
                  borderRadius: "24px",
                  boxShadow: "0 25px 60px rgba(0, 0, 0, 0.45)",
                  zIndex: 100001,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  position: "relative"
                }}
              >
                {/* Confetti Effect on High Score */}
                {quizSubmitted && scorePercentage >= 70 && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      pointerEvents: "none",
                      overflow: "hidden",
                      zIndex: 20
                    }}
                  >
                    {[...Array(40)].map((_, i) => {
                      const size = Math.random() * 8 + 4
                      const color = ["#a855f7", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"][i % 5]
                      return (
                        <motion.div
                          key={i}
                          initial={{
                            x: "50%",
                            y: "50%",
                            scale: 0,
                            opacity: 1
                          }}
                          animate={{
                            x: `${Math.random() * 100}%`,
                            y: `${Math.random() * 100}%`,
                            scale: [0, 1.2, 0.8, 0],
                            rotate: Math.random() * 360,
                            opacity: [1, 1, 0]
                          }}
                          transition={{
                            duration: 2.2,
                            ease: "easeOut",
                            repeat: Infinity,
                            repeatDelay: 1.5
                          }}
                          style={{
                            position: "absolute",
                            width: `${size}px`,
                            height: `${size}px`,
                            backgroundColor: color,
                            borderRadius: i % 2 === 0 ? "50%" : "2px"
                          }}
                        />
                      )
                    })}
                  </div>
                )}

                {/* Modal Header */}
                <div
                  style={{
                    padding: "20px 28px",
                    borderBottom: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.08)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: isDark ? "rgba(30, 41, 59, 0.4)" : "rgba(248, 250, 252, 0.8)",
                    backdropFilter: "blur(10px)"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <BookOpen className="text-indigo-500" size={26} />
                    <span
                      style={{
                        fontSize: "20px",
                        fontWeight: 800,
                        color: isDark ? "#ffffff" : "#0f172a"
                      }}
                    >
                      {lang === "en" ? "AI-Powered Practice Exam" : "এআই-চালিত মূল্যায়ন পরীক্ষা"}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    {/* Language switch */}
                    <button
                      onClick={() => {
                        const nextLang = lang === "en" ? "bn" : "en"
                        setLang(nextLang)
                        setInputLang(nextLang)
                        localStorage.setItem("ai_helper_lang", nextLang)
                      }}
                      style={{
                        padding: "6px 14px",
                        borderRadius: "8px",
                        border: isDark ? "1px solid #334155" : "1px solid #e2e8f0",
                        background: isDark ? "#1e293b" : "#ffffff",
                        color: "#6366f1",
                        fontSize: "13px",
                        fontWeight: 700,
                        cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                    >
                      {lang === "en" ? "বাংলা" : "EN"}
                    </button>

                    <button
                      onClick={() => setOpen(false)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: isDark ? "#94a3b8" : "#64748b",
                        padding: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>

                {/* Modal Content Area */}
                <div
                  style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "32px",
                    display: "flex",
                    flexDirection: "column",
                    background: isDark ? "#0f172a" : "#fcfdfd"
                  }}
                >
                  {/* 1. Loading state */}
                  {loading && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "60px 0",
                        gap: "20px"
                      }}
                    >
                      <div
                        style={{
                          width: "56px",
                          height: "56px",
                          border: "4px solid rgba(99, 102, 241, 0.1)",
                          borderTop: "4px solid #6366f1",
                          borderRadius: "50%",
                          animation: "spin 1s linear infinite"
                        }}
                      />
                      <div style={{ textAlign: "center" }}>
                        <p style={{ fontWeight: 700, fontSize: "18px", color: isDark ? "#e2e8f0" : "#1e293b" }}>
                          {lang === "en" ? "Creating Custom Exam Questions..." : "পরীক্ষার প্রশ্নমালা তৈরি হচ্ছে..."}
                        </p>
                        <p style={{ fontSize: "14px", color: isDark ? "#94a3b8" : "#64748b", marginTop: "6px" }}>
                          {lang === "en" ? "Analyzing active simulation & formulas..." : "চলতি সিমুলেশন ও বৈজ্ঞানিক সূত্রসমূহ বিশ্লেষণ করা হচ্ছে..."}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* 2. Error state */}
                  {errorMsg && !loading && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "40px 20px",
                        textAlign: "center",
                        gap: "16px"
                      }}
                    >
                      <AlertTriangle size={52} className="text-red-500" />
                      <p style={{ fontWeight: 600, fontSize: "16px", color: isDark ? "#fca5a5" : "#dc2626" }}>{errorMsg}</p>
                      <button
                        onClick={handleResetQuiz}
                        style={{
                          padding: "10px 20px",
                          borderRadius: "10px",
                          border: "none",
                          background: "#6366f1",
                          color: "white",
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)"
                        }}
                      >
                        <RefreshCw size={16} />
                        {lang === "en" ? "Back to Settings" : "সেটিংসে ফিরে যান"}
                      </button>
                    </div>
                  )}

                  {/* 3. Setup / Config Screen (First view or Reset) */}
                  {showConfig && !loading && !errorMsg && (
                    <div style={{ maxWidth: "540px", margin: "0 auto", width: "100%" }}>
                      <div style={{ textAlign: "center", marginBottom: "32px" }}>
                        <Sliders style={{ color: "#6366f1", margin: "0 auto 12px" }} size={40} />
                        <h3 style={{ fontSize: "22px", fontWeight: 800, color: isDark ? "#ffffff" : "#0f172a" }}>
                          {lang === "en" ? "Configure Your Quiz" : "আপনার কুইজ সাজান"}
                        </h3>
                        <p style={{ fontSize: "14px", color: isDark ? "#94a3b8" : "#64748b", marginTop: "6px" }}>
                          {lang === "en"
                            ? "Customize the question count, difficulty class, language and timer to suit your learning standard."
                            : "আপনার পড়াশোনার মান অনুযায়ী প্রশ্নের সংখ্যা, শ্রেণী/গ্রেড, ভাষা ও সময়সীমা সেট করুন।"}
                        </p>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginBottom: "36px" }}>
                        {/* Questions count Input */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <label
                            style={{
                              fontSize: "14px",
                              fontWeight: 700,
                              color: isDark ? "#cbd5e1" : "#334155"
                            }}
                          >
                            {lang === "en" ? "Number of Questions (1 - 30)" : "মোট প্রশ্ন সংখ্যা (১ - ৩০)"}
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="30"
                            value={inputQuestions}
                            onChange={(e) => setInputQuestions(parseInt(e.target.value) || 10)}
                            style={{
                              width: "100%",
                              padding: "12px 16px",
                              borderRadius: "10px",
                              border: isDark ? "1.5px solid #334155" : "1.5px solid #e2e8f0",
                              background: isDark ? "#1e293b" : "#f8fafc",
                              color: isDark ? "#ffffff" : "#0f172a",
                              fontWeight: 600,
                              fontSize: "15px",
                              outline: "none"
                            }}
                          />
                        </div>

                        {/* Class Level Selection */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <label
                            style={{
                              fontSize: "14px",
                              fontWeight: 700,
                              color: isDark ? "#cbd5e1" : "#334155"
                            }}
                          >
                            {lang === "en" ? "Student Class / Standard" : "শ্রেণী / মানদণ্ড"}
                          </label>
                          <select
                            value={inputClass}
                            onChange={(e) => setInputClass(e.target.value)}
                            style={{
                              width: "100%",
                              padding: "12px 16px",
                              borderRadius: "10px",
                              border: isDark ? "1.5px solid #334155" : "1.5px solid #e2e8f0",
                              background: isDark ? "#1e293b" : "#f8fafc",
                              color: isDark ? "#ffffff" : "#0f172a",
                              fontWeight: 600,
                              fontSize: "15px",
                              outline: "none"
                            }}
                          >
                            <option value="6">{lang === "en" ? "Class 6" : "ষষ্ঠ শ্রেণী (Class 6)"}</option>
                            <option value="7">{lang === "en" ? "Class 7" : "সপ্তম শ্রেণী (Class 7)"}</option>
                            <option value="8">{lang === "en" ? "Class 8" : "অষ্টম শ্রেণী (Class 8)"}</option>
                            <option value="9">{lang === "en" ? "Class 9" : "নবম শ্রেণী (Class 9)"}</option>
                            <option value="10">{lang === "en" ? "Class 10" : "দশম শ্রেণী (Class 10)"}</option>
                            <option value="11">{lang === "en" ? "Class 11 (HSC)" : "একাদশ শ্রেণী (Class 11)"}</option>
                            <option value="12">{lang === "en" ? "Class 12 (HSC)" : "দ্বাদশ শ্রেণী (Class 12)"}</option>
                          </select>
                        </div>

                        {/* Time Limit Input */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <label
                            style={{
                              fontSize: "14px",
                              fontWeight: 700,
                              color: isDark ? "#cbd5e1" : "#334155"
                            }}
                          >
                            {lang === "en" ? "Time Limit (Minutes)" : "সময়সীমা (মিনিট)"}
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="120"
                            value={inputTime}
                            onChange={(e) => setInputTime(parseInt(e.target.value) || 10)}
                            style={{
                              width: "100%",
                              padding: "12px 16px",
                              borderRadius: "10px",
                              border: isDark ? "1.5px solid #334155" : "1.5px solid #e2e8f0",
                              background: isDark ? "#1e293b" : "#f8fafc",
                              color: isDark ? "#ffffff" : "#0f172a",
                              fontWeight: 600,
                              fontSize: "15px",
                              outline: "none"
                            }}
                          />
                        </div>

                        {/* Language Selection */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <label
                            style={{
                              fontSize: "14px",
                              fontWeight: 700,
                              color: isDark ? "#cbd5e1" : "#334155"
                            }}
                          >
                            {lang === "en" ? "Question Language" : "প্রশ্নের ভাষা"}
                          </label>
                          <select
                            value={inputLang}
                            onChange={(e) => setInputLang(e.target.value as "en" | "bn")}
                            style={{
                              width: "100%",
                              padding: "12px 16px",
                              borderRadius: "10px",
                              border: isDark ? "1.5px solid #334155" : "1.5px solid #e2e8f0",
                              background: isDark ? "#1e293b" : "#f8fafc",
                              color: isDark ? "#ffffff" : "#0f172a",
                              fontWeight: 600,
                              fontSize: "15px",
                              outline: "none"
                            }}
                          >
                            <option value="en">{lang === "en" ? "English" : "ইংরেজি (English)"}</option>
                            <option value="bn">{lang === "en" ? "Bangla" : "বাংলা (Bangla)"}</option>
                          </select>
                        </div>
                      </div>

                      <button
                        onClick={handleGenerateQuiz}
                        style={{
                          width: "100%",
                          padding: "14px",
                          borderRadius: "12px",
                          border: "none",
                          background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                          color: "white",
                          fontWeight: 700,
                          fontSize: "16px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                          boxShadow: "0 6px 20px rgba(99, 102, 241, 0.35)",
                          transition: "transform 0.2s"
                        }}
                      >
                        <Play size={18} />
                        {lang === "en" ? "Start Practice Exam" : "মূল্যায়ন পরীক্ষা শুরু করুন"}
                      </button>
                    </div>
                  )}

                  {/* 4. Active Quiz Screen */}
                  {quizStarted && !loading && !errorMsg && !showConfig && (
                    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                      {/* Top Info Bar */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "20px"
                        }}
                      >
                        <span
                          style={{
                            fontSize: "15px",
                            fontWeight: 700,
                            color: isDark ? "#cbd5e1" : "#475569"
                          }}
                        >
                          {lang === "en" ? "Question" : "প্রশ্ন"} {currentQuestionIndex + 1} / {questions.length}
                        </span>

                        {!quizSubmitted && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              padding: "8px 16px",
                              borderRadius: "20px",
                              background: timeRemaining < 60 ? "rgba(239, 68, 68, 0.15)" : isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.04)",
                              color: timeRemaining < 60 ? "#ef4444" : isDark ? "#cbd5e1" : "#475569",
                              fontWeight: 800,
                              fontSize: "15px"
                            }}
                          >
                            <Clock size={18} />
                            <span>{formatTime(timeRemaining)}</span>
                          </div>
                        )}
                      </div>

                      {/* Progress Line */}
                      <div
                        style={{
                          width: "100%",
                          height: "6px",
                          background: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.06)",
                          borderRadius: "3px",
                          marginBottom: "32px",
                          overflow: "hidden"
                        }}
                      >
                        <div
                          style={{
                            width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                            height: "100%",
                            background: "linear-gradient(90deg, #6366f1, #a855f7)",
                            borderRadius: "3px",
                            transition: "width 0.3s ease"
                          }}
                        />
                      </div>

                      {!quizSubmitted ? (
                        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                          {/* Question Text */}
                          <h3
                            style={{
                              fontSize: "19px",
                              fontWeight: 700,
                              lineHeight: 1.5,
                              color: isDark ? "#ffffff" : "#0f172a",
                              marginBottom: "24px"
                            }}
                          >
                            {questions[currentQuestionIndex].question}
                          </h3>

                          {/* Options */}
                          <div style={{ display: "flex", flexDirection: "column", gap: "14px", flex: 1 }}>
                            {questions[currentQuestionIndex].options.map((opt, oIdx) => {
                              const isSelected = userAnswers[currentQuestionIndex] === oIdx
                              return (
                                <button
                                  key={oIdx}
                                  onClick={() => handleSelectOption(currentQuestionIndex, oIdx)}
                                  style={{
                                    textAlign: "left",
                                    padding: "18px 24px",
                                    borderRadius: "14px",
                                    border: isSelected
                                      ? "2px solid #6366f1"
                                      : isDark
                                      ? "1px solid rgba(255, 255, 255, 0.1)"
                                      : "1px solid rgba(0, 0, 0, 0.08)",
                                    background: isSelected
                                      ? isDark
                                        ? "rgba(99, 102, 241, 0.15)"
                                        : "rgba(99, 102, 241, 0.06)"
                                      : isDark
                                      ? "#1e293b"
                                      : "#ffffff",
                                    color: isSelected ? (isDark ? "#ffffff" : "#4f46e5") : isDark ? "#cbd5e1" : "#334155",
                                    fontWeight: isSelected ? 700 : 500,
                                    fontSize: "16px",
                                    cursor: "pointer",
                                    transition: "all 0.2s"
                                  }}
                                >
                                  <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                                    <div
                                      style={{
                                        width: "22px",
                                        height: "22px",
                                        borderRadius: "50%",
                                        border: isSelected ? "6px solid #6366f1" : "2px solid #94a3b8",
                                        boxSizing: "border-box",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        transition: "all 0.2s"
                                      }}
                                    />
                                    <span>{opt}</span>
                                  </div>
                                </button>
                              )
                            })}
                          </div>

                          {/* Navigation buttons */}
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginTop: "40px",
                              paddingTop: "24px",
                              borderTop: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.08)"
                            }}
                          >
                            <button
                              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                              disabled={currentQuestionIndex === 0}
                              style={{
                                padding: "12px 24px",
                                borderRadius: "10px",
                                border: isDark ? "1px solid #334155" : "1px solid #cbd5e1",
                                background: isDark ? "#1e293b" : "#ffffff",
                                color: isDark ? "#cbd5e1" : "#475569",
                                fontWeight: 700,
                                cursor: currentQuestionIndex === 0 ? "not-allowed" : "pointer",
                                opacity: currentQuestionIndex === 0 ? 0.5 : 1,
                                transition: "all 0.2s"
                              }}
                            >
                              {lang === "en" ? "Previous" : "পূর্ববর্তী"}
                            </button>

                            {currentQuestionIndex < questions.length - 1 ? (
                              <button
                                onClick={() => setCurrentQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                                style={{
                                  padding: "12px 24px",
                                  borderRadius: "10px",
                                  border: "none",
                                  background: "#6366f1",
                                  color: "white",
                                  fontWeight: 700,
                                  cursor: "pointer",
                                  transition: "all 0.2s"
                                }}
                              >
                                {lang === "en" ? "Next" : "পরবর্তী"}
                              </button>
                            ) : (
                              <button
                                onClick={handleSubmitQuiz}
                                style={{
                                  padding: "12px 30px",
                                  borderRadius: "10px",
                                  border: "none",
                                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                  color: "white",
                                  fontWeight: 800,
                                  cursor: "pointer",
                                  boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)"
                                }}
                              >
                                {lang === "en" ? "Submit Exam" : "পরীক্ষা জমা দিন"}
                              </button>
                            )}
                          </div>
                        </div>
                      ) : (
                        /* Results & AI Review Panel */
                        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                          <div
                            style={{
                              textAlign: "center",
                              padding: "24px 0",
                              background: isDark ? "rgba(30, 41, 59, 0.4)" : "rgba(99, 102, 241, 0.04)",
                              borderRadius: "18px",
                              border: isDark ? "1px solid rgba(255, 255, 255, 0.05)" : "1px solid rgba(99, 102, 241, 0.1)",
                              marginBottom: "30px"
                            }}
                          >
                            <Award
                              size={60}
                              style={{
                                color: scorePercentage >= 70 ? "#eab308" : "#94a3b8",
                                margin: "0 auto 12px"
                              }}
                            />
                            <h4 style={{ fontSize: "22px", fontWeight: 800, color: isDark ? "#ffffff" : "#0f172a" }}>
                              {lang === "en" ? "Practice Exam Completed!" : "মূল্যায়ন পরীক্ষা সম্পন্ন হয়েছে!"}
                            </h4>
                            <p
                              style={{
                                fontSize: "32px",
                                fontWeight: 950,
                                color: scorePercentage >= 70 ? "#10b981" : "#6366f1",
                                margin: "8px 0"
                              }}
                            >
                              {correctAnswersCount} / {questions.length} ({scorePercentage}%)
                            </p>
                            <p style={{ fontSize: "15px", color: isDark ? "#cbd5e1" : "#4b5563" }}>
                              {scorePercentage >= 70
                                ? lang === "en"
                                  ? "Excellent! You have a solid grasp of this simulation's concepts."
                                  : "অসাধারণ! চলতি সিমুলেশনের ধারণার ওপর আপনার ভালো দখল তৈরি হয়েছে।"
                                : lang === "en"
                                ? "Keep practicing and testing parameters in the simulation to improve!"
                                : "উন্নতির জন্য সিমুলেশনের স্লাইডারগুলো পরিবর্তন করে আবার অনুশীলন করুন!"}
                            </p>
                          </div>

                          <h4
                            style={{
                              fontSize: "16px",
                              fontWeight: 800,
                              color: isDark ? "#ffffff" : "#0f172a",
                              marginBottom: "16px",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px"
                            }}
                          >
                            <CheckCircle size={20} className="text-indigo-500" />
                            {lang === "en" ? "Question Review & AI Explanations" : "প্রশ্ন পর্যালোচনা ও এআই ব্যাখ্যা"}
                          </h4>

                          <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginBottom: "36px" }}>
                            {questions.map((q, qIdx) => {
                              const selected = userAnswers[qIdx]
                              const isCorrect = selected === q.correctIndex
                              return (
                                <div
                                  key={qIdx}
                                  style={{
                                    padding: "20px",
                                    borderRadius: "14px",
                                    border: isCorrect
                                      ? isDark
                                        ? "1px solid rgba(16, 185, 129, 0.2)"
                                        : "1px solid rgba(16, 185, 129, 0.3)"
                                      : isDark
                                      ? "1px solid rgba(239, 68, 68, 0.2)"
                                      : "1px solid rgba(239, 68, 68, 0.3)",
                                    background: isCorrect
                                      ? isDark
                                        ? "rgba(16, 185, 129, 0.05)"
                                        : "rgba(16, 185, 129, 0.02)"
                                      : isDark
                                      ? "rgba(239, 68, 68, 0.05)"
                                      : "rgba(239, 68, 68, 0.02)"
                                  }}
                                >
                                  <p
                                    style={{
                                      fontWeight: 800,
                                      fontSize: "16px",
                                      color: isDark ? "#f8fafc" : "#1e293b",
                                      marginBottom: "12px"
                                    }}
                                  >
                                    {qIdx + 1}. {q.question}
                                  </p>

                                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
                                    {q.options.map((opt, oIdx) => {
                                      const wasSelected = selected === oIdx
                                      const isCorrectOpt = q.correctIndex === oIdx
                                      return (
                                        <div
                                          key={oIdx}
                                          style={{
                                            fontSize: "14px",
                                            padding: "10px 14px",
                                            borderRadius: "8px",
                                            border: isCorrectOpt
                                              ? "1.5px solid #10b981"
                                              : wasSelected
                                              ? "1.5px solid #ef4444"
                                              : "1px dashed transparent",
                                            background: isCorrectOpt
                                              ? "rgba(16, 185, 129, 0.1)"
                                              : wasSelected
                                              ? "rgba(239, 68, 68, 0.1)"
                                              : "transparent",
                                            color: isCorrectOpt
                                              ? (isDark ? "#34d399" : "#065f46")
                                              : wasSelected
                                              ? (isDark ? "#fca5a5" : "#991b1b")
                                              : isDark
                                              ? "#94a3b8"
                                              : "#475569",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center"
                                          }}
                                        >
                                          <span>{opt}</span>
                                          {isCorrectOpt && (
                                            <span style={{ fontSize: "12px", fontWeight: 800 }}>
                                              {lang === "en" ? "✓ Correct" : "✓ সঠিক"}
                                            </span>
                                          )}
                                          {wasSelected && !isCorrectOpt && (
                                            <span style={{ fontSize: "12px", fontWeight: 800 }}>
                                              {lang === "en" ? "✗ Your Choice" : "✗ আপনার উত্তর"}
                                            </span>
                                          )}
                                        </div>
                                      )
                                    })}
                                  </div>

                                  <div
                                    style={{
                                      fontSize: "13.5px",
                                      lineHeight: 1.58,
                                      color: isDark ? "#cbd5e1" : "#4b5563",
                                      background: isDark ? "#1e293b" : "#f1f5f9",
                                      padding: "12px 16px",
                                      borderRadius: "8px",
                                      borderLeft: "4px solid #6366f1"
                                    }}
                                  >
                                    <strong>{lang === "en" ? "AI explanation: " : "এআই ব্যাখ্যা: "}</strong>
                                    {q.explanation}
                                  </div>
                                </div>
                              )
                            })}
                          </div>

                          {/* Control actions */}
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              gap: "20px",
                              borderTop: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.08)",
                              paddingTop: "24px"
                            }}
                          >
                            <button
                              onClick={handleResetQuiz}
                              style={{
                                padding: "12px 30px",
                                borderRadius: "10px",
                                border: "none",
                                background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                                color: "white",
                                fontWeight: 700,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)"
                              }}
                            >
                              <RefreshCw size={16} />
                              {lang === "en" ? "Retake / Configure" : "নতুন পরীক্ষা সাজান"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
