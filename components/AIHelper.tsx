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
  const [currentBubbleTextIndex, setCurrentBubbleTextIndex] = useState(0);

  const scrollRef = useRef<HTMLDivElement | null>(null)
  const resizeStartX = useRef(0)
  const resizeStartWidth = useRef(0)
  const didLoadFromStorage = useRef(false)

  const bubbleTexts = lang === "en" 
    ? [
        "Need help? Ask me!",
        "Stuck on a problem?",
        "Let me assist you!",
        "Questions? I'm here!",
        "Ready to learn?"
      ]
    : [
        "সাহায্য প্রয়োজন? জিজ্ঞাসা করুন!",
        "সমস্যায় আটকে গেছেন?",
        "আমি আপনাকে সাহায্য করতে পারি!",
        "প্রশ্ন আছে? আমি এখানে!",
        "শিখতে প্রস্তুত?"
      ];

  const recogRef = useRef<any>(null)
  const currentTranscriptRef = useRef<string>("")
  const isRestartingRef = useRef(false)
  const speechModeRef = useRef(false)
  const recognitionStartedRef = useRef(false)
  
  // Detect mobile device and iOS specifically
  const isMobile = typeof window !== "undefined" && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  const isIOS = typeof window !== "undefined" && /iPhone|iPad|iPod/i.test(navigator.userAgent)

  // Initialize component on client-side only
  useEffect(() => { setMounted(true) }, [])

  // Cycle through bubble texts
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBubbleTextIndex((prevIndex) => (prevIndex + 1) % bubbleTexts.length);
    }, 3000); // Change text every 3 seconds

    return () => clearInterval(interval);
  }, [bubbleTexts.length]);

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

  const stopMic = () => {
    console.log("[Mic] Stopping microphone...");
    if (recogRef.current) {
      try {
        recogRef.current.onend = null; // Prevent restart
        recogRef.current.onerror = null;
        recogRef.current.onresult = null;
        recogRef.current.onstart = null;
        recogRef.current.stop();
      } catch (err) {
        console.error("[Mic] Error stopping:", err);
      }
      try {
        recogRef.current.abort();
      } catch (err) {
        console.error("[Mic] Error aborting:", err);
      }
      recogRef.current = null;
    }
    speechModeRef.current = false;
    setSpeechToSpeechMode(false);
    setListening(false);
    isRestartingRef.current = false;
    currentTranscriptRef.current = "";
    console.log("[Mic] Stopped");
  };

  const startMic = async () => {
    // Disable microphone on mobile devices
    if (isMobile) {
      console.log("[Mic] Microphone disabled on mobile devices");
      return;
    }
    
    console.log("[Mic] Starting microphone...");
    
    // Store timeout reference for clearing in onstart
    let startTimeoutRef: NodeJS.Timeout | null = null;
    
    // Check if we're on HTTPS or localhost (required for microphone access)
    if (typeof window !== "undefined") {
      const protocol = window.location.protocol;
      const hostname = window.location.hostname;
      const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1";
      
      // Only block if it's HTTP (not secure) and not localhost
      if (protocol === "http:" && !isLocalhost) {
        alert(lang === "en"
          ? "Microphone access requires HTTPS. Please use https:// or localhost."
          : "মাইক্রোফোন অ্যাক্সেসের জন্য HTTPS প্রয়োজন। অনুগ্রহ করে https:// বা localhost ব্যবহার করুন।");
        return;
      }
    }

    // Stop any existing recognition first
    if (recogRef.current) {
      stopMic();
      // Wait a bit for cleanup
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(lang === "en" 
        ? "Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari." 
        : "আপনার ব্রাউজারে স্পিচ রিকগনিশন সমর্থিত নয়। অনুগ্রহ করে Chrome, Edge, বা Safari ব্যবহার করুন।");
      return;
    }

    // Request microphone permission first
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop the stream immediately - we just needed permission
      stream.getTracks().forEach(track => track.stop());
      console.log("[Mic] Microphone permission granted");
    } catch (err: any) {
      console.error("[Mic] Permission error:", err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        alert(lang === "en"
          ? "Microphone permission denied. Please allow microphone access and try again."
          : "মাইক্রোফোন অনুমতি অস্বীকার করা হয়েছে। অনুগ্রহ করে মাইক্রোফোন অ্যাক্সেস অনুমোদন করুন এবং আবার চেষ্টা করুন।");
      } else {
        alert(lang === "en"
          ? "Could not access microphone. Please check your browser settings."
          : "মাইক্রোফোন অ্যাক্সেস করা যায়নি। অনুগ্রহ করে আপনার ব্রাউজার সেটিংস পরীক্ষা করুন।");
      }
      return;
    }

    const recog = new SpeechRecognition();
    recog.continuous = true;
    recog.interimResults = true;
    recog.lang = lang === "bn" ? "bn-BD" : "en-US";
    recog.maxAlternatives = 1;

    // Reset transcript
    currentTranscriptRef.current = "";

    recog.onstart = () => {
      console.log("[Mic] Recognition started");
      recognitionStartedRef.current = true;
      if (startTimeoutRef) {
        clearTimeout(startTimeoutRef);
        startTimeoutRef = null;
      }
      setListening(true);
      isRestartingRef.current = false;
    };

    recog.onresult = (event: any) => {
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        }
      }

      finalTranscript = finalTranscript.trim();
      
      // Process final results
      if (finalTranscript && finalTranscript !== currentTranscriptRef.current) {
        console.log("[Mic] Final transcript:", finalTranscript);
        currentTranscriptRef.current = finalTranscript;
        handleSubmit(finalTranscript, true);
      }
    };

    recog.onerror = (event: any) => {
      console.error("[Mic] Recognition error:", event.error);
      setListening(false);
      
      // Handle different error types
      switch (event.error) {
        case "no-speech":
          // No speech detected - this is normal, just restart
          if (speechModeRef.current && !isRestartingRef.current) {
            console.log("[Mic] No speech detected, restarting...");
            isRestartingRef.current = true;
            setTimeout(() => {
              if (speechModeRef.current && recogRef.current === recog) {
                try {
                  recog.start();
                  isRestartingRef.current = false;
                } catch (err) {
                  console.error("[Mic] Error restarting:", err);
                  isRestartingRef.current = false;
                  stopMic();
                }
              } else {
                isRestartingRef.current = false;
              }
            }, 1000);
          }
          break;
          
        case "audio-capture":
          // No microphone found
          alert(lang === "en"
            ? "No microphone found. Please check your microphone connection."
            : "মাইক্রোফোন পাওয়া যায়নি। অনুগ্রহ করে আপনার মাইক্রোফোন সংযোগ পরীক্ষা করুন।");
          stopMic();
          break;
          
        case "not-allowed":
        case "service-not-allowed":
          alert(lang === "en"
            ? "Microphone permission denied. Please enable microphone access in your browser settings and reload the page."
            : "মাইক্রোফোন অনুমতি অস্বীকার করা হয়েছে। অনুগ্রহ করে আপনার ব্রাউজার সেটিংসে মাইক্রোফোন অ্যাক্সেস সক্ষম করুন এবং পৃষ্ঠাটি পুনরায় লোড করুন।");
          stopMic();
          break;
          
        case "aborted":
          // User or system aborted - don't restart
          console.log("[Mic] Recognition aborted");
          break;
          
        case "network":
          alert(lang === "en"
            ? "Network error. Please check your internet connection."
            : "নেটওয়ার্ক ত্রুটি। অনুগ্রহ করে আপনার ইন্টারনেট সংযোগ পরীক্ষা করুন।");
          stopMic();
          break;
          
        default:
          console.warn("[Mic] Unknown error:", event.error);
          // For unknown errors, try to restart once
          if (speechModeRef.current && !isRestartingRef.current) {
            isRestartingRef.current = true;
            setTimeout(() => {
              if (speechModeRef.current && recogRef.current === recog) {
                try {
                  recog.start();
                  isRestartingRef.current = false;
                } catch (err) {
                  console.error("[Mic] Error restarting after unknown error:", err);
                  isRestartingRef.current = false;
                  stopMic();
                }
              } else {
                isRestartingRef.current = false;
              }
            }, 1000);
          }
      }
    };

    recog.onend = () => {
      console.log("[Mic] Recognition ended");
      setListening(false);
      
      // Auto-restart if still in speech mode
      if (speechModeRef.current && recogRef.current === recog && !isRestartingRef.current) {
        console.log("[Mic] Auto-restarting...");
        isRestartingRef.current = true;
        setTimeout(() => {
          if (speechModeRef.current && recogRef.current === recog) {
            try {
              recog.start();
              isRestartingRef.current = false;
            } catch (err: any) {
              console.error("[Mic] Error restarting recognition:", err);
              isRestartingRef.current = false;
              if (speechModeRef.current) {
                if (err.message?.includes("started") || err.message?.includes("already")) {
                  stopMic();
                  setTimeout(() => startMic(), 500);
                } else {
                  // Try one more time with same instance
                  setTimeout(() => {
                    if (speechModeRef.current && recogRef.current === recog) {
                      try {
                        recog.start();
                      } catch (err2) {
                        stopMic();
                        setTimeout(() => startMic(), 500);
                      }
                    }
                  }, 500);
                }
              }
            }
          } else {
            isRestartingRef.current = false;
          }
        }, 300);
      } else if (!speechModeRef.current) {
        // Clean up if mode was turned off
        console.log("[Mic] Mode turned off, cleaning up");
        recogRef.current = null;
      } else if (isRestartingRef.current) {
        // Already restarting, do nothing
        console.log("[Mic] Already restarting, skipping onend restart");
      }
    };

    recogRef.current = recog;
    speechModeRef.current = true;
    setSpeechToSpeechMode(true);

    // Reset recognition started flag
    recognitionStartedRef.current = false;

    try {
      console.log("[Mic] Starting recognition...");
      recog.start();
    } catch (err: any) {
      console.error("[Mic] Error starting recognition:", err);
      setListening(false);
      setSpeechToSpeechMode(false);
      recogRef.current = null;
      speechModeRef.current = false;
      
      // If it's a "already started" error, try stopping and restarting
      if (err.message?.includes("started") || err.message?.includes("already")) {
        console.log("[Mic] Recognition already started, resetting...");
        setTimeout(() => {
          if (speechModeRef.current) {
            startMic();
          }
        }, 500);
      } else {
        alert(lang === "en"
          ? "Failed to start microphone. Please try again."
          : "মাইক্রোফোন শুরু করতে ব্যর্থ। অনুগ্রহ করে আবার চেষ্টা করুন।");
      }
    }
  };

  const toggleSpeechToSpeech = () => {
    if (speechToSpeechMode) {
      stopMic();
    } else {
      startMic();
    }
  };

  // Cleanup on unmount or when language changes
  useEffect(() => {
    return () => {
      if (recogRef.current) {
        try {
          recogRef.current.stop();
          recogRef.current.abort();
        } catch {}
        recogRef.current = null;
      }
    };
  }, []);

  // Restart recognition when language changes if it's active
  useEffect(() => {
    if (speechModeRef.current && recogRef.current) {
      const wasListening = listening;
      stopMic();
      if (wasListening) {
        setTimeout(() => startMic(), 300);
      }
    }
  }, [lang])

  // Stop microphone on mobile devices
  useEffect(() => {
    if (isMobile && speechModeRef.current) {
      stopMic();
    }
  }, [isMobile])

  // ---- MESSAGE HANDLING ----
  async function fetchReply(text: string) {
    try {
      const res = await fetch("/api/educator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, language: lang }),
      })
      if (!res.ok) throw new Error("API error")
      
      // Check if response is streaming (plain text) or JSON (navigation intent)
      const contentType = res.headers.get("content-type")
      
      if (contentType?.includes("text/plain")) {
        // Handle streaming response
        const reader = res.body?.getReader()
        const decoder = new TextDecoder()
        let fullText = ""
        
        if (reader) {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            fullText += decoder.decode(value, { stream: true })
          }
        }
        
        return { reply: fullText, intent: { type: "answer" as const } }
      } else {
        // Handle JSON response (navigation intent)
        const data = await res.json()
        return { reply: data.reply, intent: data.intent }
      }
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
    
    // Add initial "thinking" message
    const thinkingMsg = { role: "bot" as const, text: "", time: Date.now() }
    setMessages(m => [...m, thinkingMsg])
    
    try {
      const res = await fetch("/api/educator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, language: lang }),
      })
      
      if (!res.ok) throw new Error("API error")
      
      const contentType = res.headers.get("content-type")
      
      if (contentType?.includes("text/plain")) {
        // Handle streaming response with real-time updates
        const reader = res.body?.getReader()
        const decoder = new TextDecoder()
        let accumulatedText = ""
        
        if (reader) {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            
            const chunk = decoder.decode(value, { stream: true })
            accumulatedText += chunk
            
            // Update the message in real-time
            setMessages(m => {
              const copy = [...m]
              const lastMsg = copy[copy.length - 1]
              if (lastMsg && lastMsg.role === "bot") {
                lastMsg.text = accumulatedText
              }
              return copy
            })
            
            // Small delay to make streaming visible
            await new Promise(resolve => setTimeout(resolve, 50))
          }
        }
      } else {
        // Handle JSON response (navigation intent)
        const data = await res.json()
        setMessages(m => {
          const copy = [...m]
          copy[copy.length - 1] = { role: "bot", text: data.reply, time: Date.now() }
          return copy
        })
        
        if (data.intent?.type === "navigate" && data.intent.target) {
          setTimeout(() => { try { router.push(data.intent!.target!) } catch {} }, 600)
        }
      }
    } catch (e) {
      console.error("handleSubmit error", e)
      const fallback = lang === "bn"
        ? "দুঃখিত — কিছু সমস্যা হয়েছে। আবার বলুন বা টাইপ করুন।"
        : "Sorry — something went wrong. Please try again or type your question."
      
      setMessages(m => {
        const copy = [...m]
        copy[copy.length - 1] = { role: "bot", text: fallback, time: Date.now() }
        return copy
      })
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
          {/* Animated Chat Bubble */}
          <div
            style={{
              position: "absolute",
              bottom: 75,
              right: 10,
              background: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
              color: "white",
              padding: "8px 12px",
              borderRadius: "16px",
              fontSize: "12px",
              fontWeight: 600,
              whiteSpace: "nowrap",
              boxShadow: "0 4px 12px rgba(6, 182, 212, 0.3)",
              animation: "bounce 2s infinite, fadeInOut 3s infinite",
              pointerEvents: "none",
            }}
          >
            {bubbleTexts[currentBubbleTextIndex]}
            <div
              style={{
                position: "absolute",
                bottom: -6,
                right: 20,
                width: 12,
                height: 12,
                background: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
                transform: "rotate(45deg)",
                boxShadow: "2px 2px 4px rgba(6, 182, 212, 0.2)",
              }}
            />
          </div>
          
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
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
              border: "3px solid rgba(255, 255, 255, 0.9)",
              boxShadow:
                "0 16px 40px rgba(6, 182, 212, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 6px 12px rgba(0, 0, 0, 0.15)",
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
              ;(e.currentTarget as HTMLButtonElement).style.transform = "scale(1.2) translateY(-10px)"
              ;(e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 24px 48px rgba(6, 182, 212, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 10px 20px rgba(0, 0, 0, 0.2)"
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.transform = "scale(1) translateY(0)"
              ;(e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 16px 40px rgba(6, 182, 212, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 6px 12px rgba(0, 0, 0, 0.15)"
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
              border: "3px solid #06b6d4",
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
                  transform: scale(1.5);
                  opacity: 0;
                }
              }
              @keyframes bounce {
                0%, 20%, 50%, 80%, 100% {
                  transform: translateY(0);
                }
                40% {
                  transform: translateY(-8px);
                }
                60% {
                  transform: translateY(-4px);
                }
              }
              @keyframes fadeInOut {
                0%, 100% {
                  opacity: 0.9;
                }
                50% {
                  opacity: 0.6;
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
            {!isMobile && (
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
            )}
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
                  gap: "8px",
                  animation: "fadeIn 0.3s ease-in forwards",
                }}
              >
                {m.role === "bot" && (
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: "2px",
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <rect x="4" y="6" width="16" height="12" rx="2" />
                      <circle cx="9" cy="11" r="1.5" />
                      <circle cx="15" cy="11" r="1.5" />
                      <path d="M6 18v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1" />
                      <rect x="8" y="2" width="8" height="3" rx="1" />
                    </svg>
                  </div>
                )}
                <div
                  style={{
                    maxWidth: m.role === "user" ? "85%" : "calc(100% - 40px)",
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
          {speechToSpeechMode && !isMobile && (
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