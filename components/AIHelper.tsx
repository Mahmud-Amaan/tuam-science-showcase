"use client"
import ReactMarkdown from "react-markdown";
import type React from "react"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

type ChatMsg = { role: "user" | "bot"; text: string; time?: number }
type Intent = { type: "navigate" | "answer"; target?: string }

export default function AIHelper() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [speechToSpeechMode, setSpeechToSpeechMode] = useState(false)
  const [lang, setLang] = useState<"en" | "bn">("en")
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [sidebarWidth, setSidebarWidth] = useState(420)
  const [isResizing, setIsResizing] = useState(false)
  const [listening, setListening] = useState(false);

  const scrollRef = useRef<HTMLDivElement | null>(null)
  const resizeStartX = useRef(0)
  const resizeStartWidth = useRef(0)
  const didLoadFromStorage = useRef(false)

  const recogRef = useRef<any>(null)

  // Initialize component on client-side only
  useEffect(() => { setMounted(true) }, [])

  // Load messages from localStorage on first mount; if none, seed with greeting
  useEffect(() => {
    if (!mounted || didLoadFromStorage.current) return
    try {
      const saved = localStorage.getItem("ai_helper_messages_v1")
      if (saved) {
        const parsed: ChatMsg[] = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed)
          didLoadFromStorage.current = true
          return
        }
      }
    } catch {}
    setMessages([{
      role: "bot",
      text: lang === "en"
        ? "Hi — ask me about the simulations or say a command (e.g. 'Go to Physics')."
        : "হ্যালো — সিমুলেশন সম্পর্কে প্রশ্ন করুন বা কমান্ড বলুন (যেমন: 'ফিজিক্স খোলা')।",
      time: Date.now(),
    }])
    didLoadFromStorage.current = true
  }, [mounted])

  // Persist messages whenever they change
  useEffect(() => {
    if (!mounted) return
    try { localStorage.setItem("ai_helper_messages_v1", JSON.stringify(messages.slice(-200))) } catch {}
  }, [messages, mounted])

  useEffect(() => {
    if (!scrollRef.current) return
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight + 300
  }, [messages, open])

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsResizing(true)
    resizeStartX.current = e.clientX
    resizeStartWidth.current = sidebarWidth
  }

  useEffect(() => {
    if (!isResizing) return

    const handleMouseMove = (e: MouseEvent) => {
      const diff = resizeStartX.current - e.clientX
      const newWidth = Math.max(320, resizeStartWidth.current + diff)
      if (newWidth < window.innerWidth - 100) {
        setSidebarWidth(newWidth)
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isResizing])

  // ---- MIC CONTROL LOGIC ----

  const startMic = () => {
    if (listening) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported.");
      return;
    }

    const recog = new SpeechRecognition();
    recog.continuous = true;
    recog.interimResults = false;
    recog.lang = lang === "bn" ? "bn-BD" : "en-US";

    // Reset transcript
    (recogRef as any).currentTranscript = "";

    recog.onstart = () => setListening(true);

    recog.onresult = (event: any) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          transcript += event.results[i][0].transcript;
        }
      }

      transcript = transcript.trim();
      if (transcript && transcript !== (recogRef as any).currentTranscript) {
        (recogRef as any).currentTranscript = transcript; // store current to prevent repeats
        handleSubmit(transcript, true);
      }
    };

    recog.onend = () => {
      setListening(false);
      if (speechToSpeechMode) {
        setTimeout(() => {
          try { recog.start(); } catch {}
        }, 200);
      }
    };

    recogRef.current = recog;
    setSpeechToSpeechMode(true);

    try { recog.start(); } catch (err) { console.error(err); }
  };

  const stopMic = () => {
    if (!recogRef.current) return;
    setSpeechToSpeechMode(false);
    setListening(false);
    try { recogRef.current.abort(); } catch {}
    recogRef.current = null;
  };

  const toggleSpeechToSpeech = () => {
    if (speechToSpeechMode) {
      stopMic();
    } else {
      startMic();
    }
  };

  const handleSpeechResult = (text: string) => {
    if (speechToSpeechMode) {
      handleSubmit(text, true)
    }
  }

  // ---- MESSAGE HANDLING ----
  async function fetchReply(text: string) {
    try {
      const res = await fetch("/api/educator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, language: lang }),
      })
      if (!res.ok) throw new Error("API error")
      const data: { reply: string; intent?: Intent } = await res.json()
      return data
    } catch (e) {
      console.error("fetchReply error", e)
      const fallback = lang === "bn"
        ? "দুঃখিত — কিছু সমস্যা হয়েছে। আবার বলুন বা টাইপ করুন।"
        : "Sorry — something went wrong. Please try again or type your question."
      return { reply: fallback, intent: { type: "answer" as const } }
    }
  }

  const handleSubmit = async (text: string, fromMic = false) => {
    if (!text.trim()) return
    const trimmed = text.trim()
    setMessages(m => [...m, { role: "user", text: trimmed, time: Date.now() }])
    setMessages(m => [...m, { role: "bot", text: lang === "en" ? "Thinking..." : "চিন্তা হচ্ছে...", time: Date.now() }])
    const data = await fetchReply(trimmed)
    setMessages(m => {
      const copy = [...m]
      for (let i = copy.length - 1; i >= 0; i--) {
        if (copy[i].role === "bot" && (copy[i].text === "Thinking..." || copy[i].text === "চিন্তা হচ্ছে...")) {
          copy.splice(i, 1)
          break
        }
      }
      copy.push({ role: "bot", text: data.reply, time: Date.now() })
      return copy
    })

    if (data.intent?.type === "navigate" && data.intent.target) {
      setTimeout(() => { try { router.push(data.intent!.target!) } catch {} }, 600)
    }
  }

  const inputRef = useRef<HTMLInputElement | null>(null)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const v = inputRef.current?.value ?? ""
      if (v.trim()) {
        inputRef.current!.value = ""
        handleSubmit(v, false)
      }
    }
  }

  const RobotIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="6" width="16" height="12" rx="2" />
      <circle cx="9" cy="11" r="1.5" />
      <circle cx="15" cy="11" r="1.5" />
      <path d="M6 18v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1" />
      <rect x="8" y="2" width="8" height="3" rx="1" />
    </svg>
  )

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <>
      {!open && (
        <div
          style={{
            position: "fixed",
            right: 24,
            bottom: 24,
            zIndex: 9999,
          }}
        >
          <button
            onClick={(e) => {
              console.log("[v0] Button clicked, open state:", open)
              e.preventDefault()
              e.stopPropagation()
              setOpen(true)
            }}
            aria-label="Open AI helper"
            title="Open AI Educator"
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
              border: "none",
              boxShadow:
                "0 12px 32px rgba(6, 182, 212, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 4px 8px rgba(0, 0, 0, 0.1)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
              transform: "scale(1)",
              position: "relative",
              zIndex: 10000,
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.transform = "scale(1.15) translateY(-8px)"
              ;(e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 20px 40px rgba(6, 182, 212, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 8px 16px rgba(0, 0, 0, 0.15)"
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.transform = "scale(1) translateY(0)"
              ;(e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 12px 32px rgba(6, 182, 212, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 4px 8px rgba(0, 0, 0, 0.1)"
            }}
          >
            <RobotIcon />
          </button>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: "50%",
              border: "2px solid #06b6d4",
              animation: "pulse-ring 2s infinite",
              pointerEvents: "none",
            }}
          >
            <style>{`
              @keyframes pulse-ring {
                0% {
                  transform: scale(1);
                  opacity: 1;
                }
                100% {
                  transform: scale(1.4);
                  opacity: 0;
                }
              }
            `}</style>
          </div>
        </div>
      )}

      {open && (
        <div
          style={{
            position: "fixed",
            right: 0,
            top: 0,
            bottom: 0,
            zIndex: 9998,
            width: sidebarWidth,
            background: "linear-gradient(to bottom, #ffffff 0%, #f8fafc 100%)",
            boxShadow: "-8px 0 32px rgba(0, 0, 0, 0.15), -2px 0 8px rgba(0, 0, 0, 0.08)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            animation: "slideIn 0.35s cubic-bezier(0.4, 0, 0.2, 1) forwards",
          }}
        >
          <style>{`
            @keyframes slideIn {
              from {
                transform: translateX(100%);
                opacity: 0;
              }
              to {
                transform: translateX(0);
                opacity: 1;
              }
            }
            @keyframes fadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }
            @keyframes pulse {
              0%, 100% {
                opacity: 1;
              }
              50% {
                opacity: 0.5;
              }
            }
          `}</style>

          {/* Header */}
          <div
            style={{
              padding: "20px 16px",
              background: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 4px 12px rgba(6, 182, 212, 0.2)",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "12px",
                background: "rgba(255, 255, 255, 0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              <RobotIcon />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: "16px", letterSpacing: "-0.5px" }}>
                {lang === "en" ? "AI Educator" : "AI শিক্ষক"}
              </div>
              <div style={{ fontSize: "13px", opacity: 0.9, fontWeight: 500 }}>
                {lang === "en" ? "Always here to help" : "সর্বদা সাহায্যের জন্য প্রস্তুত"}
              </div>
            </div>
            <button
              onClick={() => {
                setOpen(false)
                setSpeechToSpeechMode(false)
                stopMic()
              }}
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                border: "none",
                color: "white",
                width: 40,
                height: 40,
                borderRadius: "10px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
                backdropFilter: "blur(4px)",
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.background = "rgba(255, 255, 255, 0.3)"
                ;(e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1)"
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.background = "rgba(255, 255, 255, 0.2)"
                ;(e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Controls Bar */}
          <div
            style={{
              padding: "14px 16px",
              borderBottom: "1px solid #e2e8f0",
              display: "flex",
              gap: "10px",
              alignItems: "center",
              background: "rgba(248, 250, 252, 0.5)",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => {
                try { localStorage.setItem("ai_helper_messages_v1", JSON.stringify(messages.slice(-200))) } catch {}
                setLang((l) => (l === "en" ? "bn" : "en"))
              }}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                border: "1.5px solid #e2e8f0",
                background: "#ffffff",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 600,
                transition: "all 0.2s",
                color: "#0ea5e9",
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.background = "#f1f5f9"
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = "#0ea5e9"
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.background = "#ffffff"
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = "#e2e8f0"
              }}
            >
              {lang === "en" ? "বাংলা" : "EN"}
            </button>
            <button
              onClick={() => {
                const seed: ChatMsg = {
                  role: "bot",
                  text:
                    lang === "en"
                      ? "Hi — ask me about the simulations or say a command (e.g. 'Go to Physics')."
                      : "হ্যালো — সিমুলেশন সম্পর্কে প্রশ্ন করুন বা কমান্ড বলুন (যেমন: 'ফিজিক্স খোলা')।",
                  time: Date.now(),
                }
                setMessages([seed])
                try { localStorage.setItem("ai_helper_messages_v1", JSON.stringify([seed])) } catch {}
              }}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                background: "#ffffff",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 600,
                transition: "all 0.2s",
                color: "#06b6d4",
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.background = "#f1f5f9"
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = "#06b6d4"
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.background = "#ffffff"
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = "#e2e8f0"
              }}
            >
              {lang === "en" ? "Clear" : "সাফ করুন"}
            </button>
            <button
              onClick={toggleSpeechToSpeech}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                border: "1.5px solid #e2e8f0",
                background: speechToSpeechMode ? "linear-gradient(135deg, #10b981 0%, #059669 100%)" : "#ffffff",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 600,
                transition: "all 0.2s",
                color: speechToSpeechMode ? "white" : "#10b981",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
              onMouseEnter={(e) => {
                if (!speechToSpeechMode) {
                  ;(e.currentTarget as HTMLButtonElement).style.background = "#f1f5f9"
                  ;(e.currentTarget as HTMLButtonElement).style.borderColor = "#10b981"
                }
              }}
              onMouseLeave={(e) => {
                if (!speechToSpeechMode) {
                  ;(e.currentTarget as HTMLButtonElement).style.background = "#ffffff"
                  ;(e.currentTarget as HTMLButtonElement).style.borderColor = "#e2e8f0"
                }
              }}
            >
              {speechToSpeechMode && (
                <span style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "white",
                  animation: "pulse 1.5s infinite"
                }} />
              )}
              {lang === "en" ? (speechToSpeechMode ? "Voice Mode ON" : "Voice Mode") : (speechToSpeechMode ? "ভয়েস মোড চালু" : "ভয়েস মোড")}
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "18px",
              background: "linear-gradient(to bottom, #f8fafc 0%, #f1f5f9 100%)",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                  animation: "fadeIn 0.3s ease-in forwards",
                }}
              >
                <div
                  style={{
                    maxWidth: "85%",
                    padding: "12px 16px",
                    borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    background: m.role === "user" ? "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)" : "white",
                    color: m.role === "user" ? "white" : "#1e293b",
                    boxShadow: m.role === "bot"
                      ? "0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)"
                      : "0 1px 3px rgba(6, 182, 212, 0.1)",
                    border: m.role === "bot" ? "1px solid #e2e8f0" : "none",
                    fontSize: "14px",
                    lineHeight: "1.6",
                    wordWrap: "break-word",
                    fontWeight: m.role === "user" ? 500 : 400,
                    fontFamily: lang === "bn" ? "'Noto Sans Bengali', 'Hind Siliguri', sans-serif" : "inherit",
                  }}
                >
                  {m.role === "bot" ? (
                    <ReactMarkdown
                      components={{
                        code({ node, inline, className, children, ...props }: any) {
                          const match = /language-(\w+)/.exec(className || '');
                          const { style: _markdownCodeStyle, ...restProps } = props as Record<string, any>;
                          return !inline && match ? (
                            <SyntaxHighlighter
                              style={oneDark}
                              language={match[1]}
                              PreTag="div"
                              {...restProps}
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          ) : (
                            <code className={className} {...props}>{children}</code>
                          );
                        }
                      }}
                    >
                      {m.text}
                    </ReactMarkdown>
                  ) : m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div
            style={{
              padding: "16px",
              borderTop: "1px solid #e2e8f0",
              display: "flex",
              gap: "12px",
              alignItems: "flex-end",
              background: "white",
              boxShadow: "0 -4px 12px rgba(0, 0, 0, 0.04)",
            }}
          >
            <input
              ref={inputRef}
              type="text"
              placeholder={lang === "en" ? "Ask something..." : "কিছু জিজ্ঞাসা করুন..."}
              onKeyDown={handleKeyDown}
              disabled={speechToSpeechMode}
              style={{
                flex: 1,
                padding: "12px 16px",
                borderRadius: "10px",
                border: "1.5px solid #e2e8f0",
                outline: "none",
                fontSize: "14px",
                transition: "all 0.2s",
                background: speechToSpeechMode ? "#f1f5f9" : "#f8fafc",
                fontWeight: 500,
                opacity: speechToSpeechMode ? 0.6 : 1,
                fontFamily: lang === "bn" ? "'Noto Sans Bengali', 'Hind Siliguri', sans-serif" : "inherit",
              }}
              onFocus={(e) => {
                if (!speechToSpeechMode) {
                  ;(e.currentTarget as HTMLInputElement).style.borderColor = "#0ea5e9"
                  ;(e.currentTarget as HTMLInputElement).style.background = "#ffffff"
                  ;(e.currentTarget as HTMLInputElement).style.boxShadow = "0 0 0 3px rgba(14, 165, 233, 0.1)"
                }
              }}
              onBlur={(e) => {
                ;(e.currentTarget as HTMLInputElement).style.borderColor = "#e2e8f0"
                ;(e.currentTarget as HTMLInputElement).style.background = "#f8fafc"
                ;(e.currentTarget as HTMLInputElement).style.boxShadow = "none"
              }}
            />

            <button
              onClick={() => {
                const v = inputRef.current?.value ?? ""
                if (!v.trim()) return
                inputRef.current!.value = ""
                handleSubmit(v, false)
              }}
              disabled={speechToSpeechMode}
              style={{
                padding: "12px 18px",
                borderRadius: "10px",
                border: "none",
                background: speechToSpeechMode ? "#cbd5e1" : "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
                color: "white",
                cursor: speechToSpeechMode ? "not-allowed" : "pointer",
                fontWeight: 600,
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: speechToSpeechMode ? "none" : "0 4px 12px rgba(6, 182, 212, 0.2)",
                opacity: speechToSpeechMode ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (!speechToSpeechMode) {
                  ;(e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)"
                  ;(e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 20px rgba(6, 182, 212, 0.3)"
                }
              }}
              onMouseLeave={(e) => {
                if (!speechToSpeechMode) {
                  ;(e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"
                  ;(e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 12px rgba(6, 182, 212, 0.2)"
                }
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Resize handle */}
          <div
            onMouseDown={handleResizeStart}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: "6px",
              cursor: "col-resize",
              background: isResizing ? "#0ea5e9" : "transparent",
              transition: "background 0.2s",
              zIndex: 10000,
              userSelect: "none",
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLDivElement).style.background = "#0ea5e9"
              ;(e.currentTarget as HTMLDivElement).style.opacity = "0.8"
            }}
            onMouseLeave={(e) => {
              if (!isResizing) {
                ;(e.currentTarget as HTMLDivElement).style.background = "transparent"
                ;(e.currentTarget as HTMLDivElement).style.opacity = "1"
              }
            }}
          />

          {/* Voice Mode Indicator */}
          {speechToSpeechMode && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background: "rgba(16, 185, 129, 0.95)",
                color: "white",
                padding: "16px 24px",
                borderRadius: "12px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "12px",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
                pointerEvents: "none",
                zIndex: 10001,
              }}
            >
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
              </div>
              <div style={{
                fontSize: "16px",
                fontWeight: 600,
                textAlign: "center"
              }}>
                {lang === "en" ? "Listening..." : "শুনছি..."}
              </div>
              <div style={{
                fontSize: "13px",
                opacity: 0.9,
                textAlign: "center"
              }}>
                {lang === "en" ? "Speak your question" : "আপনার প্রশ্ন বলুন"}
              </div>
              <div style={{
                display: "flex",
                gap: "4px",
                marginTop: "4px"
              }}>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: "6px",
                      height: "24px",
                      background: "white",
                      borderRadius: "3px",
                      animation: `pulse 1s infinite ${i * 0.2}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Overlay */}
      {open && (
        <div
          onClick={() => {
            setOpen(false)
            setSpeechToSpeechMode(false)
            stopMic()
          }}
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            right: sidebarWidth,
            bottom: 0,
            zIndex: 9997,
            background: "rgba(0, 0, 0, 0.12)",
            animation: "fadeIn 0.35s ease-in forwards",
            backdropFilter: "blur(2px)",
          }}
        />
      )}
    </>
  )
}