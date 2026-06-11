"use client"
import ReactMarkdown from "react-markdown";
import type React from "react"
import { useEffect, useRef, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "next-themes";
import AnimatedKoji, { KojiState } from "./AnimatedKoji";
import { motion, AnimatePresence } from "motion/react";



declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

type ChatMsg = { role: "user" | "bot"; text: string; time?: number }
type Intent = { type: "navigate" | "answer"; target?: string }

function markdownToSpeech(text: string) {
  return text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/_(.*?)_/g, "$1")
    .replace(/!\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/^\s*#+\s+/gm, "")
    .replace(/^\s*[\d]+\.\s+/gm, "")
    .replace(/^[>*+-]\s+/gm, "")
    .replace(/\n{2,}/g, ". ")
    .replace(/\n/g, ", ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function splitIntoShortChunks(text: string): string[] {
  // First, split by punctuation: . , ? ! । ; : \n
  const parts = text.split(/(?<=[.,?!।;:—\-\n])\s+/);
  const result: string[] = [];

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    const words = trimmed.split(/\s+/).filter(w => w.length > 0);
    // If the part has 10 words or fewer, keep it intact
    if (words.length <= 10) {
      result.push(trimmed);
    } else {
      // Otherwise, split it into chunks of 8 words to keep bubble text compact
      for (let i = 0; i < words.length; i += 8) {
        const chunk = words.slice(i, i + 8).join(" ");
        if (chunk.trim()) {
          result.push(chunk.trim());
        }
      }
    }
  }

  return result.filter(s => s.length > 0);
}

export default function AIHelper() {
  const router = useRouter()
  const pathname = usePathname()
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [speechToSpeechMode, setSpeechToSpeechMode] = useState(false)
  const [lang, setLang] = useState<"en" | "bn">("en")
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [sidebarWidth, setSidebarWidth] = useState(420)
  const [isResizing, setIsResizing] = useState(false)
  const [listening, setListening] = useState(false);
  const [speakerEnabled, setSpeakerEnabled] = useState(false)
  const [context, setContext] = useState<string | null>(null);
  const [viewportWidth, setViewportWidth] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 1280);
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [bubbleText, setBubbleText] = useState("");
  const [showBubble, setShowBubble] = useState(false);
  const [sentencesArray, setSentencesArray] = useState<string[]>([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState<number>(-1);

  const clearSpeakingQueue = () => {
    setSentencesArray([]);
    setCurrentSentenceIndex(-1);
    setIsSpeaking(false);
    setShowBubble(false);
    setBubbleText("");
    prefetchedAudioRef.current = {};
    if (currentAudioSourceRef.current) {
      try {
        currentAudioSourceRef.current.stop();
      } catch {}
      currentAudioSourceRef.current = null;
    }
    if (currentAudioContextRef.current) {
      currentAudioContextRef.current.close().catch(console.error);
      currentAudioContextRef.current = null;
    }
  };

  const kojiState: KojiState = listening
    ? "listening"
    : isThinking
      ? "thinking"
      : isSpeaking
        ? "speaking"
        : "idle";


  const scrollRef = useRef<HTMLDivElement | null>(null)
  const resizeStartX = useRef(0)
  const resizeStartWidth = useRef(0)
  const didLoadFromStorage = useRef(false)
  const currentAudioContextRef = useRef<AudioContext | null>(null);
  const currentAudioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const prefetchedAudioRef = useRef<{ [text: string]: AudioBuffer }>({});
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const preferredMimeTypeRef = useRef<string>("");
  const shouldTranscribeOnStopRef = useRef<boolean>(false);

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

  const getContextualSuggestions = (path: string, currentLang: "en" | "bn") => {
    const defaultEn = [
      "Explain this concept 💡",
      "How does this work? ⚙️",
      "Give me an analogy 🍎",
      "Take a quick quiz! 📝"
    ];
    const defaultBn = [
      "এই ধারণাটি ব্যাখ্যা কর 💡",
      "এটি কীভাবে কাজ করে? ⚙️",
      "বাস্তব উদাহরণ দিন 🍎",
      "একটি কুইজ খেলুন! 📝"
    ];

    if (!path) return currentLang === "en" ? defaultEn : defaultBn;

    const normalized = path.split('?')[0].replace(/^\/|\/$/g, "");

    if (normalized.includes("physics/motion")) {
      return currentLang === "en" 
        ? ["Take a motion quiz 📝", "Explain kinematics formulas 📐", "Acceleration analogy 🚀", "How to use this simulation? ℹ️"]
        : ["গতির কুইজ খেলুন 📝", "গতিবিদ্যার সূত্র ব্যাখ্যা কর 📐", "ত্বরণের বাস্তব উদাহরণ 🚀", "সিমুলেশন ব্যবহারের নিয়ম ℹ️"];
    }
    if (normalized.includes("physics/gravity")) {
      return currentLang === "en" 
        ? ["Gravity quiz 📝", "Newton's gravity formula 🍏", "What is G vs g? 🌍", "Double the distance effect? 🛰️"]
        : ["মহাকর্ষ কুইজ খেলুন 📝", "নিউটনের মহাকর্ষ সূত্র 🍏", "G ও g এর পার্থক্য কী? 🌍", "দূরত্ব দ্বিগুণ করার প্রভাব? 🛰️"];
    }
    if (normalized.includes("physics/optics")) {
      return currentLang === "en" 
        ? ["Optics quiz 📝", "Explain lens refraction 🔍", "What is Snell's Law? 🔬", "Convex vs Concave lens 👓"]
        : ["আলোকবিজ্ঞান কুইজ 📝", "লেন্সের প্রতিসরণ ব্যাখ্যা কর 🔍", "স্নেলের সূত্র কী? 🔬", "উত্তল বনাম অবতল লেন্স 👓"];
    }
    if (normalized.includes("physics/solar")) {
      return currentLang === "en" 
        ? ["Solar system quiz 📝", "Explain planet orbits 🪐", "Kepler's Three Laws 🌌", "Orbital speed formula 🚀"]
        : ["সৌরজগৎ কুইজ 📝", "গ্রহের কক্ষপথ ব্যাখ্যা কর 🪐", "কেপলারের ৩টি সূত্র 🌌", "কক্ষপথ বেগের সূত্র 🚀"];
    }
    if (normalized.includes("chemistry/atoms")) {
      return currentLang === "en" 
        ? ["Atoms quiz 📝", "Protons vs Electrons ⚛️", "What is an Isotope? 🧪", "Build a Carbon atom 💎"]
        : ["পরমাণু কুইজ খেলুন 📝", "প্রোটন বনাম ইলেকট্রন ⚛️", "আইসোটোপ কী? 🧪", "কার্বন পরমাণু গঠন 💎"];
    }
    if (normalized.includes("chemistry/molecules")) {
      return currentLang === "en" 
        ? ["Molecules quiz 📝", "What is covalent bonding? 🔗", "Explain VSEPR theory 🌐", "Why is water molecule bent? 💧"]
        : ["অণু কুইজ খেলুন 📝", "সমযোজী বন্ধন কী? 🔗", "VSEPR তত্ত্ব ব্যাখ্যা কর 🌐", "পানির অণু বাঁকা কেন? 💧"];
    }
    if (normalized.includes("chemistry/ph-scale")) {
      return currentLang === "en" 
        ? ["pH Scale quiz 📝", "Explain acids & bases 🍋", "Why is pure water pH 7? 💧", "What does pH stand for? 🧪"]
        : ["pH স্কেল কুইজ খেলুন 📝", "অম্ল ও ক্ষারক ব্যাখ্যা কর 🍋", "বিশুদ্ধ পানির pH ৭ কেন? 💧", "pH এর পূর্ণরূপ কী? 🧪"];
    }
    if (normalized.includes("chemistry/states")) {
      return currentLang === "en" 
        ? ["Matter states quiz 📝", "Melting vs Boiling 🌡️", "Intermolecular forces 🌌", "Water phase changes 💧"]
        : ["পদার্থের অবস্থা কুইজ 📝", "গলনাঙ্ক ও স্ফুটনাঙ্ক 🌡️", "আন্তঃআণবিক আকর্ষণ 🌌", "পানির অবস্থার পরিবর্তন 💧"];
    }
    if (normalized.includes("chemistry/periodic-table")) {
      return currentLang === "en" 
        ? ["Periodic table quiz 📝", "What are chemical groups? 🗓️", "Explain Electronegativity ⚡", "Reactive alkali metals 🔥"]
        : ["পর্যায় সারণি কুইজ 📝", "রাসায়নিক গ্রুপ কী? 🗓️", "তড়িৎঋণাত্মকতা ব্যাখ্যা ⚡", "ক্ষার ধাতুর সক্রিয়তা 🔥"];
    }
    if (normalized.includes("biology/cells")) {
      return currentLang === "en" 
        ? ["Cell biology quiz 📝", "Plant vs Animal cell 🌱", "Mitochondria role 🔋", "What does Nucleus do? 🧠"]
        : ["কোষ জীববিজ্ঞান কুইজ 📝", "উদ্ভিদ বনাম প্রাণী কোষ 🌱", "মাইটোকন্ড্রিয়ার কাজ 🔋", "নিউক্লিয়াস কী করে? 🧠"];
    }
    if (normalized.includes("biology/anatomy")) {
      return currentLang === "en" 
        ? ["Anatomy quiz 📝", "Major human organs 🫁", "Skeletal system role 🦴", "Heart and circulation ❤️"]
        : ["শারীরস্থান কুইজ 📝", "মানুষের প্রধান অঙ্গসমূহ 🫁", "কঙ্কালতন্ত্রের ভূমিকা 🦴", "হৃৎপিণ্ড ও রক্তসংবহন ❤️"];
    }
    if (normalized.includes("biology/ecology")) {
      return currentLang === "en" 
        ? ["Ecosystem quiz 📝", "Explain Food Chains 🌾", "What is carrying capacity? 📈", "Ecosystem balance 🍃"]
        : ["বাস্তুতন্ত্র কুইজ 📝", "খাদ্য শৃঙ্খল ব্যাখ্যা কর 🌾", "ধারণ ক্ষমতা কী? 📈", "পরিবেশের ভারসাম্য 🍃"];
    }
    if (normalized.includes("biology/genetics")) {
      return currentLang === "en" 
        ? ["Genetics quiz 📝", "Explain Punnett Squares 🏁", "Dominant vs Recessive 🧬", "Genotype vs Phenotype 🧪"]
        : ["বংশগতি কুইজ খেলুন 📝", "পানেট স্কয়ারের ব্যাখ্যা 🏁", "প্রকট বনাম প্রচ্ছন্ন 🧬", "জিনোটাইপ ও ফিনোটাইপ 🧪"];
    }
    if (normalized.includes("math/vector")) {
      return currentLang === "en" 
        ? ["Vectors quiz 📝", "Vector magnitude formula 📐", "Component x & y 📈", "Adding two vectors ➕"]
        : ["ভেক্টর কুইজ খেলুন 📝", "ভেক্টরের মান নির্ণয়ের সূত্র 📐", "x ও y উপাংশ 📈", "দুটি ভেক্টর যোগ করা ➕"];
    }
    if (normalized.includes("math/trigonometry")) {
      return currentLang === "en" 
        ? ["Trig quiz 📝", "Explain Unit Circle ⭕", "Sin, Cos, Tan ratios 📐", "Radians vs Degrees 🔄"]
        : ["ত্রিকোণমিতি কুইজ 📝", "একক বৃত্ত ব্যাখ্যা কর ⭕", "Sin, Cos, Tan অনুপাত 📐", "রেডিয়ান বনাম ডিগ্রি 🔄"];
    }
    if (normalized.includes("ict/logic-gates")) {
      return currentLang === "en" 
        ? ["Logic gates quiz 📝", "Explain XOR truth table 🎛️", "AND vs NAND gate 🔌", "How to build circuit? ℹ️"]
        : ["লজিক গেট কুইজ 📝", "XOR গেটের ট্রুথ টেবিল 🎛️", "AND বনাম NAND গেট 🔌", "সার্কিট কীভাবে তৈরি করব? ℹ️"];
    }
    if (normalized.includes("ict/circuit-construction")) {
      return currentLang === "en" 
        ? ["Circuit quiz 📝", "What is Ohm's Law? ⚡", "Series vs Parallel 🔌", "Measure voltage & current 📊"]
        : ["তড়িৎ সার্কিট কুইজ 📝", "ওহমের সূত্রটি কী? ⚡", "শ্রেণী বনাম সমান্তরাল 🔌", "ভোল্টেজ ও কারেন্ট পরিমাপ 📊"];
    }
    if (normalized.includes("ict/ai")) {
      return currentLang === "en" 
        ? ["AI/ML quiz 📝", "What is Neural Network? 🧠", "Supervised learning 🤖", "Explain training model 📊"]
        : ["AI ও ML কুইজ খেলুন 📝", "নিউরাল নেটওয়ার্ক কী? 🧠", "সুপারভাইজড লার্নিং 🤖", "মডেল ট্রেইনিং ব্যাখ্যা 📊"];
    }
    if (normalized.includes("ict/programming")) {
      return currentLang === "en" 
        ? ["Coding quiz 📝", "What is a loop? 🔄", "Variables & Types 📦", "Conditionals (if/else) 🔀"]
        : ["প্রোগ্রামিং কুইজ 📝", "লুপ (Loop) বলতে কী বোঝায়? 🔄", "ভেরিয়েবল ও ডাটা টাইপ 📦", "কন্ডিশনাল স্টেটমেন্ট 🔀"];
    }

    return currentLang === "en" ? defaultEn : defaultBn;
  };

  const quickSuggestions = getContextualSuggestions(pathname || "", lang);

  const recogRef = useRef<any>(null)
  const currentTranscriptRef = useRef<string>("")
  const isRestartingRef = useRef(false)
  const speechModeRef = useRef(false)
  const recognitionStartedRef = useRef(false)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const lastSpokenRef = useRef<string | null>(null)
  const shouldResumeMicRef = useRef(false)
  const lastSubmittedTranscriptRef = useRef<string>("") // Track last submitted text
  const isSubmittingRef = useRef(false) // Prevent simultaneous submissions
  const previousBodyOverflowRef = useRef<string | null>(null)

  // Detect mobile device and iOS specifically
  const isMobile = typeof window !== "undefined" && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  const isIOS = typeof window !== "undefined" && /iPhone|iPad|iPod/i.test(navigator.userAgent)

  // Format the context from the path
  const formatContextFromPath = (path: string) => {
    if (!path) return null;
    const segments = path.split('/').filter(segment => segment.trim() !== '');
    if (segments.length === 0) return null;
    // Capitalize each segment and join with arrow
    const formatted = segments.map(seg => seg.charAt(0).toUpperCase() + seg.slice(1)).join(' → ');
    return formatted;
  };

  // Update context when the route changes
  useEffect(() => {
    if (pathname) {
      const formatted = formatContextFromPath(pathname);
      setContext(formatted);
    }
  }, [pathname]);

  // Track viewport width for responsive layout & motion tweaks
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };
    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sync bubble text and visibility based on thinking, streaming, and sentence playback queue
  useEffect(() => {
    const lastMsg = messages[messages.length - 1];

    // 1. If currently generating response (isThinking is true):
    if (isThinking) {
      if (lastMsg && lastMsg.role === "bot" && lastMsg.text.trim() !== "") {
        const cleanText = markdownToSpeech(lastMsg.text);
        const chunks = splitIntoShortChunks(cleanText);
        const latestChunk = chunks[chunks.length - 1] || "";
        setBubbleText(latestChunk);
      } else {
        setBubbleText(lang === "en" ? "Thinking..." : "চিন্তা করছি...");
      }
      setShowBubble(true);
      return;
    }

    // 2. If currently playing through the sentence queue:
    if (currentSentenceIndex >= 0 && currentSentenceIndex < sentencesArray.length) {
      setBubbleText(sentencesArray[currentSentenceIndex]);
      setShowBubble(true);
      return;
    }

    // 3. Queue finished or inactive: Hide instantly
    setShowBubble(false);
    setBubbleText("");
  }, [isThinking, currentSentenceIndex, sentencesArray, messages, lang]);

  // Sentence-by-sentence playback queue
  useEffect(() => {
    if (sentencesArray.length === 0) return;

    if (currentSentenceIndex < 0 || currentSentenceIndex >= sentencesArray.length) {
      setIsSpeaking(false);
      setSentencesArray([]);
      setCurrentSentenceIndex(-1);
      setShowBubble(false);
      setBubbleText("");
      // Queue finished! Resume microphone if voice mode was active
      if (shouldResumeMicRef.current) {
        shouldResumeMicRef.current = false;
        setTimeout(() => startMic().catch(console.error), 400);
      }
      return;
    }

    let active = true;
    let timer: any;

    const playCurrentSentence = async () => {
      const activeText = sentencesArray[currentSentenceIndex];
      if (!activeText) return;

      const langCode = lang === "bn" ? "bn-BD" : "en-US";

      // Pre-fetch the next sentence immediately in the background
      if (currentSentenceIndex + 1 < sentencesArray.length) {
        prefetchNextSentence(currentSentenceIndex + 1, langCode).catch(console.error);
      }

      if (speakerEnabled) {
        setIsSpeaking(true);
        try {
          await speakWithGroq(activeText, langCode);
          if (active) {
            setCurrentSentenceIndex(prev => prev + 1);
          }
        } catch (error) {
          console.error("Error playing sentence:", error);
          if (active) {
            timer = setTimeout(() => {
              setCurrentSentenceIndex(prev => prev + 1);
            }, 3000);
          }
        }
      } else {
        // Speaker is disabled, cycle visually based on character reading speed
        const readingTime = Math.max(2500, activeText.length * 55 + 1000);
        timer = setTimeout(() => {
          if (active) {
            setCurrentSentenceIndex(prev => prev + 1);
          }
        }, readingTime);
      }
    };

    playCurrentSentence();

    return () => {
      active = false;
      if (timer) clearTimeout(timer);
    };
  }, [currentSentenceIndex, sentencesArray, speakerEnabled, lang]);


  useEffect(() => {
    if (typeof document === "undefined") return;

    const { body } = document;

    if (open && isFullscreen) {
      if (previousBodyOverflowRef.current === null) {
        previousBodyOverflowRef.current = body.style.overflow;
      }
      body.style.overflow = "hidden";
    } else if (previousBodyOverflowRef.current !== null) {
      body.style.overflow = previousBodyOverflowRef.current;
      previousBodyOverflowRef.current = null;
    }

    return () => {
      if (previousBodyOverflowRef.current !== null) {
        body.style.overflow = previousBodyOverflowRef.current;
        previousBodyOverflowRef.current = null;
      }
    };
  }, [open, isFullscreen]);

  useEffect(() => {
    if (!open || !isFullscreen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsFullscreen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, isFullscreen]);

  // Initialize component on client-side only
  useEffect(() => { 
    setMounted(true)
    // Restore mic and speaker state from localStorage
    if (typeof window !== "undefined") {
      const savedMicState = localStorage.getItem("ai_helper_mic_enabled")
      const savedSpeakerState = localStorage.getItem("ai_helper_speaker_enabled")

      if (savedSpeakerState === "true") {
        setSpeakerEnabled(true)
      }
      
      // Auto-start mic if it was previously enabled
      if (savedMicState === "true") {
        setTimeout(() => {
          startMic().catch(console.error)
        }, 500)
      }
    }
  }, [])

  // Cycle through bubble texts
  useEffect(() => {
    const interval = setInterval(() => {
      // Removed
    }, 3000); // Change text every 3 seconds

    return () => clearInterval(interval);
  }, []);

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
    if (viewportWidth < 820 || isFullscreen) return
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

  const handleClose = () => {
    setIsClosing(true)
    setIsFullscreen(false)

    // Don't stop mic or speaker when closing sidebar - they should persist
    // Only cancel current speech utterance if one is playing
    clearSpeakingQueue();
    setTimeout(() => {
      setOpen(false)
      setIsClosing(false)
    }, 350)
  };

  const stopMic = (transcribe: boolean = false) => {
    console.log("[Mic] Stopping recorder... transcribe=", transcribe);
    shouldTranscribeOnStopRef.current = transcribe;
    try {
      const mr = mediaRecorderRef.current;
      if (mr && mr.state !== "inactive") {
        mr.stop();
      }
    } catch (err) {
      console.error("[Mic] Error stopping recorder:", err);
    }
    try {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
        mediaStreamRef.current = null;
      }
    } catch (err) {
      console.error("[Mic] Error closing stream:", err);
    }

    speechModeRef.current = false;
    setSpeechToSpeechMode(false);
    setListening(false);
    isRestartingRef.current = false;
    currentTranscriptRef.current = "";
    console.log("[Mic] Stopped");
  };

  const startMic = async () => {
    // Disable microphone on mobile devices (kept same behavior)
    if (isMobile) {
      console.log("[Mic] Microphone disabled on mobile devices");
      return;
    }

    console.log("[Mic] Starting recorder...");

    // Check secure context
    if (typeof window !== "undefined") {
      const protocol = window.location.protocol;
      const hostname = window.location.hostname;
      const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1";
      if (protocol === "http:" && !isLocalhost) {
        alert(lang === "en"
          ? "Microphone access requires HTTPS. Please use https:// or localhost."
          : "মাইক্রোফোন অ্যাক্সেসের জন্য HTTPS প্রয়োজন। অনুগ্রহ করে https:// বা localhost ব্যবহার করুন।");
        return;
      }
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      // Pick a good mime type the browser supports
      const candidates = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/ogg;codecs=opus",
        "audio/mp4"
      ];
      let chosen = "";
      for (const c of candidates) {
        if ((window as any).MediaRecorder && MediaRecorder.isTypeSupported?.(c)) {
          chosen = c; break;
        }
      }
      preferredMimeTypeRef.current = chosen || "";

      const mr = new MediaRecorder(stream, chosen ? { mimeType: chosen } : undefined);
      mediaRecorderRef.current = mr;
      recordedChunksRef.current = [];

      mr.onstart = () => {
        console.log("[Mic] Recorder started", chosen);
        setListening(true);
        speechModeRef.current = true;
        setSpeechToSpeechMode(true);
      };

      mr.ondataavailable = (e: BlobEvent) => {
        if (e.data && e.data.size > 0) recordedChunksRef.current.push(e.data);
      };

      mr.onstop = async () => {
        try {
          const chunks = recordedChunksRef.current;
          recordedChunksRef.current = [];
          const type = preferredMimeTypeRef.current || "audio/webm";
          const blob = new Blob(chunks, { type });
          console.log("[Mic] Recorder stopped. size=", blob.size);

          if (shouldTranscribeOnStopRef.current && blob.size > 0) {
            shouldTranscribeOnStopRef.current = false;
            const ext = type.includes("mp4") ? "mp4" : type.includes("ogg") ? "ogg" : "webm";
            const file = new File([blob], `mic.${ext}`, { type });

            // Prevent overlapping submissions
            if (isSubmittingRef.current) return;
            isSubmittingRef.current = true;

            try {
              const fd = new FormData();
              fd.set("audio", file);
              fd.set("language", lang === "bn" ? "bn" : "en");
              const resp = await fetch("/api/transcribe", { method: "POST", body: fd });
              if (!resp.ok) {
                console.error("[Mic] Transcribe error status:", resp.status);
              } else {
                const data = await resp.json();
                const transcript: string = (data?.text || "").toString().trim();
                if (transcript) {
                  if (transcript !== lastSubmittedTranscriptRef.current) {
                    lastSubmittedTranscriptRef.current = transcript;
                    handleSubmit(transcript, true);
                  } else {
                    console.log("[Mic] Duplicate transcript ignored");
                  }
                } else {
                  console.log("[Mic] Empty transcription result");
                }
              }
            } catch (e) {
              console.error("[Mic] Transcription request failed", e);
            } finally {
              // Small delay to allow back-to-back recordings
              setTimeout(() => { isSubmittingRef.current = false; }, 200);
            }
          } else {
            shouldTranscribeOnStopRef.current = false;
          }
        } catch (err) {
          console.error("[Mic] onstop error", err);
        }

        // Cleanup
        try {
          if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(t => t.stop());
            mediaStreamRef.current = null;
          }
        } catch {}
        mediaRecorderRef.current = null;
        setListening(false);
        speechModeRef.current = false;
        setSpeechToSpeechMode(false);
      };

      // Start recording; capture data every second
      mr.start(1000);
    } catch (err: any) {
      console.error("[Mic] Error starting recorder:", err);
      if (err?.name === "NotAllowedError" || err?.name === "PermissionDeniedError") {
        alert(lang === "en"
          ? "Microphone permission denied. Please allow microphone access and try again."
          : "মাইক্রোফোন অনুমতি অস্বীকার করা হয়েছে। অনুগ্রহ করে মাইক্রোফোন অ্যাক্সেস অনুমোদন করুন এবং আবার চেষ্টা করুন।");
      } else {
        alert(lang === "en"
          ? "Could not access microphone. Please check your browser settings."
          : "মাইক্রোফোন অ্যাক্সেস করা যায়নি। অনুগ্রহ করে আপনার ব্রাউজার সেটিংস পরীক্ষা করুন।");
      }
      stopMic(false);
    }
  };

  const toggleSpeechToSpeech = () => {
    if (listening) {
      stopMic(true);
      if (typeof window !== "undefined") {
        localStorage.setItem("ai_helper_mic_enabled", "false")
      }
    } else {
      startMic().catch(console.error);
      if (typeof window !== "undefined") {
        localStorage.setItem("ai_helper_mic_enabled", "true")
      }
    }
  };

  const toggleSpeaker = () => {
    if (!mounted) return
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert(lang === "en" 
        ? "Speech synthesis is not supported in this browser."
        : "এই ব্রাউজারে স্পিচ সিন্থেসিস সমর্থিত নয়।")
      return
    }
    setSpeakerEnabled((prev) => {
      const next = !prev
      if (!next) {
        // Cancel any ongoing speech
        clearSpeakingQueue();
        lastSpokenRef.current = null
      }
      // Save state to localStorage
      localStorage.setItem("ai_helper_speaker_enabled", next.toString())
      return next
    })
  }

  const playBotResponse = (rawText: string) => {
    if (typeof window === "undefined") return;

    if (lastSpokenRef.current === rawText) return;
    lastSpokenRef.current = rawText;

    const sanitized = markdownToSpeech(rawText);
    if (!sanitized) {
      clearSpeakingQueue();
      return;
    }

    // Split text into short clause/phrase chunks for quick dynamic sync
    const splitSentences = splitIntoShortChunks(sanitized);

    if (splitSentences.length === 0) {
      clearSpeakingQueue();
      return;
    }

    if (speechModeRef.current) {
      shouldResumeMicRef.current = true;
      stopMic();
    } else {
      shouldResumeMicRef.current = false;
    }

    // Cancel ongoing audio
    if (currentAudioContextRef.current) {
      currentAudioContextRef.current.close().catch(console.error);
      currentAudioContextRef.current = null;
    }
    currentAudioSourceRef.current = null;

    setSentencesArray(splitSentences);
    setCurrentSentenceIndex(0);
  };

  const getAudioContext = (): AudioContext => {
    if (!currentAudioContextRef.current) {
      currentAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return currentAudioContextRef.current;
  };

  const prefetchNextSentence = async (index: number, langCode: string) => {
    if (index < 0 || index >= sentencesArray.length) return;
    const text = sentencesArray[index];
    if (!text || prefetchedAudioRef.current[text]) return;

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language: langCode }),
      });
      if (!response.ok) return;

      const audioData = await response.arrayBuffer();
      const audioContext = getAudioContext();
      const audioBuffer = await audioContext.decodeAudioData(audioData);
      prefetchedAudioRef.current[text] = audioBuffer;
    } catch (e) {
      console.warn("Failed to prefetch sentence audio:", e);
    }
  };

  const speakWithGroq = async (text: string, langCode: string): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      try {
        const audioContext = getAudioContext();
        if (audioContext.state !== 'running') {
          await audioContext.resume();
        }

        let audioBuffer: AudioBuffer;

        if (prefetchedAudioRef.current[text]) {
          audioBuffer = prefetchedAudioRef.current[text];
        } else {
          const response = await fetch('/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, language: langCode }),
          });

          if (!response.ok) {
            throw new Error(`TTS API responded with status ${response.status}`);
          }

          const audioData = await response.arrayBuffer();
          audioBuffer = await audioContext.decodeAudioData(audioData);
        }

        const source = audioContext.createBufferSource();
        currentAudioSourceRef.current = source;
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);

        source.onended = () => {
          currentAudioSourceRef.current = null;
          setIsSpeaking(false);
          resolve();
        };

        source.addEventListener('error', (error) => {
          currentAudioSourceRef.current = null;
          setIsSpeaking(false);
          reject(error);
        });

        setIsSpeaking(true);
        source.start(0);
      } catch (error) {
        currentAudioSourceRef.current = null;
        setIsSpeaking(false);
        reject(error);
      }
    });
  };

  const fetchReply = async (text: string, onChunk?: (chunk: string) => void) => {
    return new Promise<{ reply: string; intent?: Intent }>(async (resolve) => {
      try {
        // Send last 4 messages for context (2 exchanges) - optimized to reduce token usage
        const recentMessages = messages.slice(-4).map(m => ({
          role: m.role === "user" ? "user" : "assistant",
          content: m.text
        }));

        const res = await fetch("/api/educator", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            message: text, 
            language: lang,
            history: recentMessages,
            contextPath: pathname,
            speakerMode: speakerEnabled, // Auto-enable short responses when speaker is on
            max_tokens: speakerEnabled ? 150 : undefined
          }),
        });

        if (!res.ok) throw new Error("API error");

        const contentType = res.headers.get("content-type");

        if (contentType?.includes("text/plain")) {
          const reader = res.body?.getReader();
          const decoder = new TextDecoder();
          let fullText = "";

          if (reader) {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              const chunk = decoder.decode(value, { stream: true });
              fullText += chunk;
              if (onChunk) {
                onChunk(chunk);
              }
            }
          }

          resolve({ reply: fullText });
        } else {
          const data = await res.json();
          resolve({ reply: data.reply, intent: data.intent });
        }
      } catch (e) {
        console.error("fetchReply error", e);
        const fallback = lang === "bn"
          ? "দুঃখিত — কিছু সমস্যা হয়েছে। আবার বলুন বা টাইপ করুন।"
          : "Sorry — something went wrong. Please try again or type your question.";
        resolve({ reply: fallback });
      }
    });
  }

  const handleSubmit = async (text: string, fromMic = false) => {
    if (!text.trim()) return
    const trimmed = text.trim()
    clearSpeakingQueue();
    setMessages(m => [...m, { role: "user", text: trimmed, time: Date.now() }])

    
    // Add initial "thinking" message
    const thinkingMsg = { role: "bot" as const, text: "", time: Date.now() }
    setMessages(m => [...m, thinkingMsg])
    
    setIsThinking(true)
    try {
      let fullReply = "";
      const { reply, intent } = await fetchReply(trimmed, (chunk: string) => {
        fullReply += chunk;
        setMessages(m => {
          const copy = [...m]
          copy[copy.length - 1] = { role: "bot", text: fullReply, time: Date.now() }
          return copy
        })
      });
      
      // If we didn't use streaming, set the full reply at once
      if (!fullReply) {
        setMessages(m => {
          const copy = [...m]
          copy[copy.length - 1] = { role: "bot", text: reply, time: Date.now() }
          return copy
        })
      }
      
      if (intent?.type === "navigate" && intent.target) {
        try { router.push(intent.target!) } catch {}
      }

      let finalReply = fullReply || reply
      if (speakerEnabled) {
        finalReply = finalReply.slice(0, 1000);
        if (finalReply.length === 1000) {
          finalReply += '...';
        }
      }
      playBotResponse(finalReply)
    } catch (e) {
      console.error("handleSubmit error", e)
      const fallback = lang === "bn"
        ? "দুঃখিত — কিছু সমস্যা হয়েছে। আবার বলুন বা টাইপ করুন।"
        : "Sorry — something went wrong. Please try again or type your question.";

      setMessages(m => {
        const copy = [...m]
        copy[copy.length - 1] = { role: "bot", text: fallback, time: Date.now() }
        return copy
      })

      playBotResponse(fallback)
    } finally {
      setIsThinking(false)
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
    <img 
      src="/ai-icon.png" 
      alt="AI Assistant"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover"
      }}
    />
  )

  const handleSuggestionClick = (suggestion: string) => {
    handleSubmit(suggestion, false);
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return null
  }

  const isDark = theme === 'dark'
  const isCompactLayout = viewportWidth < 820
  const panelWidth = isCompactLayout
    ? Math.max(320, Math.min(520, viewportWidth - 24))
    : Math.min(Math.max(sidebarWidth, 380), Math.floor(Math.max(400, viewportWidth * 0.38)))
  const sidebarWidthStyle = `${panelWidth}px`
  const containerAnimation = isFullscreen
    ? (isClosing ? "fadeOut 0.25s cubic-bezier(0.4, 0, 0.2, 1) forwards" : "fadeIn 0.35s cubic-bezier(0.4, 0, 0.2, 1) forwards")
    : (isClosing ? "slideOut 0.35s cubic-bezier(0.4, 0, 0.2, 1) forwards" : "slideIn 0.35s cubic-bezier(0.4, 0, 0.2, 1) forwards")
  const containerStyle: React.CSSProperties = isFullscreen
    ? {
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        width: "100%",
        maxWidth: "100%",
        background: isDark
          ? "linear-gradient(160deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9))"
          : "linear-gradient(160deg, rgba(248, 250, 252, 0.98), rgba(226, 232, 240, 0.94))",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        borderRadius: 0,
        borderLeft: "none",
        boxShadow: "none",
        animation: containerAnimation,
      }
    : {
        position: "fixed",
        right: 0,
        top: 0,
        bottom: 0,
        zIndex: 9998,
        width: sidebarWidthStyle,
        background: isDark ? "rgba(15, 23, 42, 0.72)" : "rgba(248, 250, 252, 0.78)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderLeft: isDark ? "1px solid rgba(148, 163, 184, 0.22)" : "1px solid rgba(148, 163, 184, 0.35)",
        borderTopLeftRadius: isCompactLayout ? "16px" : "18px",
        borderBottomLeftRadius: isCompactLayout ? "16px" : "18px",
        borderTopRightRadius: isCompactLayout ? "16px" : "0",
        borderBottomRightRadius: isCompactLayout ? "16px" : "0",
        boxShadow: isDark
          ? "-14px 0 48px rgba(2, 6, 23, 0.65), -6px 0 18px rgba(15, 23, 42, 0.55)"
          : "-14px 0 48px rgba(15, 23, 42, 0.18), -6px 0 18px rgba(148, 163, 184, 0.28)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        animation: containerAnimation,
      }

  const showSuggestions = open && !inputRef.current?.value

  return (
    <>
      <div
        style={{
          position: "fixed",
          right: open ? `calc(${sidebarWidthStyle} + 20px)` : "28px",
          bottom: 28,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          gap: "10px",
          transition: "right 0.35s cubic-bezier(0.19, 1, 0.22, 1)",
        }}
      >
        {/* Floating Speech Bubble (Only when sidebar is closed and bot is speaking/thinking/typing) */}
        <AnimatePresence>
          {!open && showBubble && bubbleText.trim() !== "" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="speech-bubble-scroll"
              style={{
                position: "absolute",
                bottom: "100%",
                right: "42px",
                marginBottom: "16px",
                width: "270px",
                maxHeight: "160px",
                overflowY: "auto",
                scrollbarWidth: "none",
                background: isDark 
                  ? "linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))" 
                  : "linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.95))",
                border: isDark ? "1.5px solid rgba(148, 163, 184, 0.22)" : "1.5px solid rgba(148, 163, 184, 0.35)",
                borderRadius: "16px 16px 4px 16px",
                padding: "12px 16px",
                boxShadow: isDark 
                  ? "0 10px 25px rgba(2, 6, 23, 0.4), 0 4px 12px rgba(2, 6, 23, 0.3)" 
                  : "0 10px 25px rgba(148, 163, 184, 0.25), 0 4px 12px rgba(148, 163, 184, 0.15)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                color: isDark ? "#f8fafc" : "#0f172a",
                fontSize: "14.2px",
                lineHeight: "1.48",
                fontWeight: 600,
                pointerEvents: "none",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <style>{`
                .speech-bubble-scroll::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              
              {/* Little Speech Bubble Tail */}
              <div
                style={{
                  position: "absolute",
                  bottom: "-10px",
                  right: "24px",
                  width: "16px",
                  height: "10px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    background: isDark ? "#1f2937" : "#ffffff",
                    borderBottom: isDark ? "1.5px solid rgba(148, 163, 184, 0.22)" : "1.5px solid rgba(148, 163, 184, 0.35)",
                    borderRight: isDark ? "1.5px solid rgba(148, 163, 184, 0.22)" : "1.5px solid rgba(148, 163, 184, 0.35)",
                    transform: "rotate(45deg) translate(-3px, -3px)",
                    boxShadow: "2px 2px 4px rgba(0,0,0,0.08)",
                  }}
                />
              </div>

              {isThinking ? (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: isDark ? "#a7f3d0" : "#059669" }}>
                  <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  >
                    ●
                  </motion.span>
                  <span>{lang === "en" ? "Thinking..." : "চিন্তা করছি..."}</span>
                </div>
              ) : (
                <div style={{ wordBreak: "break-word", whiteSpace: "normal" }}>
                  {bubbleText}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Companion Button */}
        <motion.button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            if (open) {
              handleClose();
            } else {
              setIsFullscreen(viewportWidth < 820)
              setOpen(true)
            }
          }}
          whileHover={{
            scale: 1.15,
            y: -6,
            rotate: [0, -8, 8, 0],
            transition: {
              rotate: { duration: 0.5, ease: "easeInOut" },
              scale: { type: "spring", stiffness: 400, damping: 15 },
              y: { type: "spring", stiffness: 400, damping: 15 }
            }
          }}
          whileTap={{ scale: 0.92 }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            outline: "none",
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          {/* Radial Glow Backing */}
          <div
            style={{
              position: "absolute",
              width: open ? "120px" : "150px",
              height: open ? "120px" : "150px",
              borderRadius: "50%",
              background: isDark
                ? "radial-gradient(circle, rgba(34, 197, 94, 0.22) 0%, rgba(34, 197, 94, 0) 70%)"
                : "radial-gradient(circle, rgba(34, 197, 94, 0.14) 0%, rgba(34, 197, 94, 0) 70%)",
              filter: "blur(6px)",
              pointerEvents: "none",
              zIndex: -1,
            }}
          />
          <AnimatedKoji state={kojiState} size={open ? 98 : 124} />
        </motion.button>

        {/* Quick Voice/Mic Toggle Button - POSITIONED RIGHT */}
        {!isMobile && (
          <motion.button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              if (!speakerEnabled) {
                setSpeakerEnabled(true)
                localStorage.setItem("ai_helper_speaker_enabled", "true")
                startMic().catch(console.error)
                localStorage.setItem("ai_helper_mic_enabled", "true")
              } else {
                if (listening) {
                  stopMic(true)
                  localStorage.setItem("ai_helper_mic_enabled", "false")
                } else {
                  startMic().catch(console.error)
                  localStorage.setItem("ai_helper_mic_enabled", "true")
                }
              }
            }}
            whileHover={{ scale: 1.18, x: 2 }}
            whileTap={{ scale: 0.9 }}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              border: "2px solid",
              borderColor: listening ? "#22d3ee" : speakerEnabled ? "#3b82f6" : "#475569",
              background: listening ? "#22d3ee" : isDark ? "#1e293b" : "#ffffff",
              color: listening ? "#0f172a" : isDark ? "#e2e8f0" : "#64748b",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: listening 
                ? "0 0 16px rgba(34, 211, 238, 0.75), 0 4px 10px rgba(0, 0, 0, 0.2)" 
                : speakerEnabled
                  ? "0 0 12px rgba(59, 130, 246, 0.45), 0 2px 6px rgba(0, 0, 0, 0.15)"
                  : "0 2px 6px rgba(0, 0, 0, 0.15)",
              zIndex: 10005,
              transition: "border-color 0.25s, background 0.25s, color 0.25s, box-shadow 0.25s",
            }}
            title={listening 
              ? (lang === "en" ? "Mute Microphone" : "মাইক্রোফোন বন্ধ করুন") 
              : (lang === "en" ? "Activate Voice Mode" : "ভয়েস মোড চালু করুন")
            }
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="23"/>
            </svg>
          </motion.button>
        )}
      </div>

      {open && (
        <div
          style={containerStyle}
        >
          <style>{`
            @keyframes slideOut {
              from {
                transform: translateX(0);
                opacity: 1;
              }
              to {
                transform: translateX(100%);
                opacity: 0;
              }
            }
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
            @keyframes fadeOut {
              from {
                opacity: 1;
                transform: scale(1);
              }
              to {
                opacity: 0;
                transform: scale(0.98);
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
            @keyframes pulse-ring {
              0% {
                transform: scale(1);
                opacity: 1;
              }
              100% {
                transform: scale(1.8);
                opacity: 0;
              }
            }
          `}</style>

          {/* Controls Bar */}
          <div
            style={{
              padding: "14px 16px",
              borderBottom: isDark ? "1px solid #334155" : "1px solid #e2e8f0",
              display: "flex",
              gap: "10px",
              alignItems: "center",
              background: isDark
                ? "linear-gradient(140deg, rgba(15, 23, 42, 0.5), rgba(30, 41, 59, 0.45))"
                : "linear-gradient(140deg, rgba(255, 255, 255, 0.5), rgba(248, 250, 252, 0.45))",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={() => {
                try { localStorage.setItem("ai_helper_messages_v1", JSON.stringify(messages.slice(-200))) } catch {}
                setLang((l) => (l === "en" ? "bn" : "en"))
              }}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                border: isDark ? "1.5px solid #334155" : "1.5px solid #e2e8f0",
                background: isDark ? "#1e293b" : "#ffffff",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 600,
                transition: "all 0.2s",
                color: "#34c759",
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.background = isDark ? "#334155" : "#f1f5f9"
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = "#34c759"
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.background = isDark ? "#1e293b" : "#ffffff"
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = isDark ? "#334155" : "#e2e8f0"
              }}
            >
              {lang === "en" ? "বাংলা" : "EN"}
            </button>
            <button
              onClick={() => {
                clearSpeakingQueue();
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
                border: isDark ? "1px solid #334155" : "1px solid #e2e8f0",
                background: isDark ? "#1e293b" : "#ffffff",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 600,
                transition: "all 0.2s",
                color: "#2ecc71",
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.background = isDark ? "#334155" : "#f1f5f9"
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = "#2ecc71"
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.background = isDark ? "#1e293b" : "#ffffff"
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = isDark ? "#334155" : "#e2e8f0"
              }}
            >
              {lang === "en" ? "Clear" : "সাফ করুন"}
            </button>
            <button
              onClick={toggleSpeaker}
              aria-label={lang === "en"
                ? (speakerEnabled ? "Disable speaker" : "Enable speaker")
                : (speakerEnabled ? "স্পিকার বন্ধ করুন" : "স্পিকার চালু করুন")}
              title={lang === "en"
                ? (speakerEnabled ? "Disable speaker mode" : "Enable speaker mode")
                : (speakerEnabled ? "স্পিকার মোড বন্ধ করুন" : "স্পিকার মোড চালু করুন")}
              style={{
                width: 40,
                height: 40,
                borderRadius: "8px",
                border: speakerEnabled
                  ? (isDark ? "1.5px solid rgba(45, 212, 191, 0.5)" : "1.5px solid rgba(16, 185, 129, 0.45)")
                  : (isDark ? "1.5px solid #334155" : "1.5px solid #e2e8f0"),
                background: speakerEnabled
                  ? (isDark ? "rgba(13, 148, 136, 0.28)" : "rgba(167, 243, 208, 0.65)")
                  : (isDark ? "#1e293b" : "#ffffff"),
                color: speakerEnabled
                  ? (isDark ? "#5eead4" : "#047857")
                  : "#64748b",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                const btn = e.currentTarget as HTMLButtonElement
                btn.style.boxShadow = isDark
                  ? "0 6px 16px rgba(45, 212, 191, 0.32)"
                  : "0 6px 16px rgba(74, 222, 128, 0.22)"
                if (!speakerEnabled) {
                  btn.style.background = isDark ? "#27364d" : "#ecfeff"
                }
              }}
              onMouseLeave={(e) => {
                const btn = e.currentTarget as HTMLButtonElement
                btn.style.boxShadow = "none"
                btn.style.background = speakerEnabled
                  ? (isDark ? "rgba(13, 148, 136, 0.28)" : "rgba(167, 243, 208, 0.65)")
                  : (isDark ? "#1e293b" : "#ffffff")
              }}
            >
              {speakerEnabled ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 5 6 9H3v6h3l5 4z" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 5 6 9H3v6h3l5 4z" />
                  <path d="m2 2 20 20" />
                  <path d="M6.6 18.4c-.8.8-1.8 1.2-2.8 1.2" />
                  <path d="M9 8.6c1.2-.4 2.5-.4 3.8-.1" />
                </svg>
              )}
            </button>
            <button
              onClick={() => setIsFullscreen((prev) => !prev)}
              aria-label={isFullscreen
                ? (lang === "en" ? "Exit fullscreen" : "পূর্ণস্ক্রিন বন্ধ করুন")
                : (lang === "en" ? "Enter fullscreen" : "পূর্ণস্ক্রিন চালু করুন")
              }
              title={isFullscreen
                ? (lang === "en" ? "Exit fullscreen" : "পূর্ণস্ক্রিন বন্ধ করুন")
                : (lang === "en" ? "Go fullscreen" : "পূর্ণস্ক্রিন চালু করুন")
              }
              style={{
                width: 40,
                height: 40,
                borderRadius: "8px",
                border: isFullscreen
                  ? (isDark ? "1.5px solid rgba(59, 130, 246, 0.45)" : "1.5px solid rgba(37, 99, 235, 0.4)")
                  : (isDark ? "1.5px solid #334155" : "1.5px solid #e2e8f0"),
                background: isFullscreen
                  ? (isDark ? "rgba(30, 64, 175, 0.3)" : "rgba(191, 219, 254, 0.65)")
                  : (isDark ? "#1e293b" : "#ffffff"),
                color: isFullscreen
                  ? (isDark ? "#60a5fa" : "#1d4ed8")
                  : "#64748b",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                const btn = e.currentTarget as HTMLButtonElement
                btn.style.boxShadow = isDark
                  ? "0 6px 16px rgba(37, 99, 235, 0.35)"
                  : "0 6px 16px rgba(59, 130, 246, 0.25)"
                if (!isFullscreen) {
                  btn.style.background = isDark ? "#27364d" : "#ecfeff"
                }
              }}
              onMouseLeave={(e) => {
                const btn = e.currentTarget as HTMLButtonElement
                btn.style.boxShadow = "none"
                btn.style.background = isFullscreen
                  ? (isDark ? "rgba(30, 64, 175, 0.3)" : "rgba(191, 219, 254, 0.65)")
                  : (isDark ? "#1e293b" : "#ffffff")
              }}
            >
              {isFullscreen ? (
                <svg
                  aria-hidden="true"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 5 5 5 5 9" />
                  <polyline points="15 19 19 19 19 15" />
                  <line x1="5" y1="5" x2="10" y2="10" />
                  <line x1="19" y1="19" x2="14" y2="14" />
                  <polyline points="19 9 19 5 15 5" />
                  <line x1="19" y1="5" x2="14" y2="10" />
                  <polyline points="5 15 5 19 9 19" />
                  <line x1="5" y1="19" x2="10" y2="14" />
                </svg>
              ) : (
                <svg
                  aria-hidden="true"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 3 3 3 3 9" />
                  <line x1="3" y1="3" x2="10" y2="10" />
                  <polyline points="15 21 21 21 21 15" />
                  <line x1="21" y1="21" x2="14" y2="14" />
                  <polyline points="21 9 21 3 15 3" />
                  <line x1="21" y1="3" x2="14" y2="10" />
                  <polyline points="3 15 3 21 9 21" />
                  <line x1="3" y1="21" x2="10" y2="14" />
                </svg>
              )}
            </button>
            </div>
            <button
              onClick={handleClose}
              aria-label={lang === "en" ? "Close assistant" : "সহকারী বন্ধ করুন"}
              style={{
                background: isDark ? "rgba(239, 68, 68, 0.18)" : "rgba(239, 68, 68, 0.12)",
                border: isDark ? "1px solid #334155" : "1px solid rgba(239, 68, 68, 0.22)",
                color: "#ef4444",
                width: 40,
                height: 40,
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.background = isDark ? "rgba(239, 68, 68, 0.25)" : "rgba(239, 68, 68, 0.18)"
                ;(e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1)"
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.background = isDark ? "rgba(239, 68, 68, 0.18)" : "rgba(239, 68, 68, 0.12)"
                ;(e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"
              }}
            >
              <svg
                aria-hidden="true"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            style={{
              flex: 1,
              overflowY: "auto",
              padding: isCompactLayout ? "18px 14px 16px" : "18px",
              background: isDark
                ? "linear-gradient(170deg, rgba(15, 23, 42, 0.85), rgba(30, 41, 59, 0.75))"
                : "linear-gradient(170deg, rgba(241, 245, 249, 0.88), rgba(226, 232, 240, 0.76))",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            {context && (
              <div
                style={{
                  alignSelf: "center",
                  padding: "8px 16px",
                  borderRadius: "999px",
                  background: isDark
                    ? "linear-gradient(120deg, rgba(96, 165, 250, 0.3), rgba(96, 165, 250, 0.1))"
                    : "linear-gradient(120deg, rgba(59, 130, 246, 0.16), rgba(96, 165, 250, 0.28))",
                  color: isDark ? "#dbeafe" : "#1d4ed8",
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: "0.02em",
                  border: isDark ? "1px solid rgba(96, 165, 250, 0.35)" : "1px solid rgba(59, 130, 246, 0.28)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  animation: "contextGlow 5s ease-in-out infinite",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  marginBottom: "6px",
                  boxShadow: isDark ? "0 10px 30px rgba(14, 116, 144, 0.25)" : "0 10px 24px rgba(59, 130, 246, 0.22)",
                }}
              >
                <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
                  <circle cx={12} cy={12} r={3} />
                  <path d="M19 12a7 7 0 0 1-7 7" />
                  <path d="M5 12a7 7 0 0 1 7-7" />
                </svg>
                <span style={{ opacity: 0.85 }}>{lang === "en" ? "Learning Context" : "বর্তমান প্রসঙ্গ"}:</span>
                <span style={{ fontWeight: 700 }}>{context}</span>
              </div>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                  gap: "8px",
                  animation: "fadeIn 0.25s ease-in forwards",
                }}
              >
                {m.role === "bot" && (
                  <div style={{ flexShrink: 0, marginTop: "2px" }}>
                    <AnimatedKoji state="idle" size={32} />
                  </div>
                )}
                <div
                  style={{
                    maxWidth: m.role === "user" ? "84%" : "calc(100% - 46px)",
                    padding: m.role === "user" ? "13px 18px" : "14px 18px",
                    borderRadius: m.role === "user" ? "18px 18px 8px 18px" : "18px 18px 18px 8px",
                    background: m.role === "user" 
                      ? "linear-gradient(140deg, #34d399, #22d3ee)"
                      : isDark
                        ? "linear-gradient(135deg, rgba(148, 163, 184, 0.12), rgba(100, 116, 139, 0.28))"
                        : "linear-gradient(135deg, rgba(148, 163, 184, 0.12), rgba(148, 163, 184, 0.32))",
                    color: m.role === "user" ? "#0f172a" : isDark ? "#e2e8f0" : "#0f172a",
                    boxShadow: m.role === "bot"
                      ? isDark
                        ? "0 16px 38px rgba(2, 6, 23, 0.55), 0 4px 12px rgba(15, 23, 42, 0.55)"
                        : "0 16px 32px rgba(148, 163, 184, 0.25), 0 4px 12px rgba(148, 163, 184, 0.18)"
                      : "0 12px 24px rgba(45, 212, 191, 0.35)",
                    border: m.role === "bot" ? (isDark ? "1px solid rgba(148, 163, 184, 0.25)" : "1px solid rgba(148, 163, 184, 0.35)") : "1px solid rgba(14, 165, 233, 0.45)",
                    fontSize: "14.2px",
                    lineHeight: "1.7",
                    wordWrap: "break-word",
                    fontWeight: m.role === "user" ? 500 : 400,
                    fontFamily: lang === "bn" ? "'Noto Sans Bengali', 'Hind Siliguri', sans-serif" : "inherit",
                    position: "relative",
                    overflow: "hidden",
                    animation: m.role === "user" ? "bubbleSwing 5s ease-in-out infinite" : "none",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: m.role === "user"
                        ? "linear-gradient(145deg, rgba(255, 255, 255, 0.24), rgba(255, 255, 255, 0.05))"
                        : "linear-gradient(145deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.01))",
                      opacity: 0.85,
                      pointerEvents: "none",
                    }}
                  />
                  {m.role === "bot" ? (
                    <div className="markdown-content">
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
                              <code 
                                style={{
                                  background: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)",
                                  padding: "2px 6px",
                                  borderRadius: "4px",
                                  fontSize: "0.9em",
                                  fontFamily: "monospace"
                                }}
                                {...props}
                              >
                                {children}
                              </code>
                            );
                          },
                          h1: ({children}) => (
                            <h1 style={{
                              fontSize: "1.5em",
                              fontWeight: "bold",
                              marginTop: "0.5em",
                              marginBottom: "0.5em",
                              color: isDark ? "#34c759" : "#2ecc71"
                            }}>{children}</h1>
                          ),
                          h2: ({children}) => (
                            <h2 style={{
                              fontSize: "1.3em",
                              fontWeight: "bold",
                              marginTop: "0.5em",
                              marginBottom: "0.4em",
                              color: isDark ? "#34c759" : "#2ecc71"
                            }}>{children}</h2>
                          ),
                          h3: ({children}) => (
                            <h3 style={{
                              fontSize: "1.15em",
                              fontWeight: 600,
                              marginTop: "0.4em",
                              marginBottom: "0.3em"
                            }}>{children}</h3>
                          ),
                          p: ({children}) => (
                            <p style={{
                              marginTop: "0.5em",
                              marginBottom: "0.5em"
                            }}>{children}</p>
                          ),
                          ul: ({children}) => (
                            <ul style={{
                              marginTop: "0.5em",
                              marginBottom: "0.5em",
                              paddingLeft: "1.5em"
                            }}>{children}</ul>
                          ),
                          ol: ({children}) => (
                            <ol style={{
                              marginTop: "0.5em",
                              marginBottom: "0.5em",
                              paddingLeft: "1.5em"
                            }}>{children}</ol>
                          ),
                          li: ({children}) => (
                            <li style={{
                              marginTop: "0.25em",
                              marginBottom: "0.25em"
                            }}>{children}</li>
                          ),
                          strong: ({children}) => (
                            <strong style={{
                              fontWeight: "700",
                              color: isDark ? "#34c759" : "#2ecc71"
                            }}>{children}</strong>
                          ),
                          blockquote: ({children}) => (
                            <blockquote style={{
                              borderLeft: `3px solid ${isDark ? "#34c759" : "#2ecc71"}`,
                              paddingLeft: "1em",
                              marginLeft: "0",
                              marginTop: "0.5em",
                              marginBottom: "0.5em",
                              fontStyle: "italic",
                              opacity: 0.9
                            }}>{children}</blockquote>
                          )
                        }}
                      >
                        {m.text}
                      </ReactMarkdown>
                    </div>
                    ) : m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div
            style={{
              padding: isCompactLayout ? "14px 14px 18px" : "16px",
              borderTop: isDark ? "1px solid #334155" : "1px solid #e2e8f0",
              display: "flex",
              gap: isCompactLayout ? "10px" : "12px",
              alignItems: "flex-end",
              background: isDark
                ? "linear-gradient(140deg, rgba(15, 23, 42, 0.92), rgba(30, 41, 59, 0.85))"
                : "linear-gradient(140deg, rgba(255, 255, 255, 0.92), rgba(248, 250, 252, 0.88))",
              boxShadow: isDark ? "0 -12px 30px rgba(2, 6, 23, 0.55)" : "0 -12px 24px rgba(148, 163, 184, 0.18)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            {/* Microphone Button */}
            {!isMobile && (
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <button
                  onClick={toggleSpeechToSpeech}
                  title={listening 
                    ? (lang === "en" ? "Stop microphone" : "মাইক্রোফোন বন্ধ করুন")
                    : (lang === "en" ? "Start microphone" : "মাইক্রোফোন চালু করুন")
                  }
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    border: listening ? "2px solid #34c759" : isDark ? "2px solid #334155" : "2px solid #e2e8f0",
                    background: listening ? "#34c759" : isDark ? "#1e293b" : "#ffffff",
                    color: listening ? "white" : "#64748b",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: listening ? "0 0 0 4px rgba(52, 199, 89, 0.2), 0 4px 12px rgba(52, 199, 89, 0.3)" : "0 1px 3px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.2s",
                    position: "relative",
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                    <line x1="12" y1="19" x2="12" y2="23"/>
                    <line x1="8" y1="23" x2="16" y2="23"/>
                  </svg>
                  {listening && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        borderRadius: "50%",
                        border: "2px solid #34c759",
                        animation: "pulse-ring 1.5s infinite",
                        pointerEvents: "none",
                      }}
                    />
                  )}
                </button>
              </div>
            )}
            
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                minWidth: 0,
              }}
            >
              {showSuggestions && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    columnGap: "4px",
                    rowGap: "6px",
                    marginTop: "-6px",
                    marginBottom: "2px",
                    marginLeft: "-4px",
                    marginRight: "-4px",
                    width: "calc(100% + 8px)",
                  }}
                >
                  {quickSuggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="transition-colors"
                      style={{
                        fontSize: "11.5px",
                        padding: "6px 14px",
                        borderRadius: "999px",
                        border: isDark ? "1px solid rgba(148, 163, 184, 0.28)" : "1px solid rgba(148, 163, 184, 0.45)",
                        background: isDark ? "rgba(30, 41, 59, 0.92)" : "rgba(255, 255, 255, 0.97)",
                        color: isDark ? "#e2e8f0" : "#1e293b",
                        lineHeight: 1.15,
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        justifySelf: "stretch",
                        boxShadow: isDark
                          ? "0 4px 12px rgba(15, 23, 42, 0.25)"
                          : "0 4px 14px rgba(148, 163, 184, 0.18)",
                        whiteSpace: "nowrap",
                      }}
                      title={suggestion}
                    >
                      {suggestion.length > 22 ? `${suggestion.substring(0, 22)}...` : suggestion}
                    </button>
                  ))}
                </div>
              )}

              <input
                ref={inputRef}
                type="text"
                placeholder={lang === "en" ? "Ask something..." : "কিছু জিজ্ঞাসা করুন..."}
                onKeyDown={handleKeyDown}
                disabled={speechToSpeechMode}
                style={{
                  width: "100%",
                  padding: isCompactLayout ? "12px 14px" : "12px 16px",
                  borderRadius: "10px",
                  border: isDark ? "1.5px solid #334155" : "1.5px solid #e2e8f0",
                  outline: "none",
                  fontSize: "14px",
                  background: speechToSpeechMode 
                    ? isDark ? "#0f172a" : "#f1f5f9" 
                    : isDark ? "#1e293b" : "#f8fafc",
                  color: isDark ? "#e2e8f0" : "#1e293b",
                  fontWeight: 500,
                  opacity: speechToSpeechMode ? 0.6 : 1,
                  fontFamily: lang === "bn" ? "'Noto Sans Bengali', 'Hind Siliguri', sans-serif" : "inherit",
                }}
                onFocus={(e) => {
                  if (!speechToSpeechMode) {
                    ;(e.currentTarget as HTMLInputElement).style.borderColor = "#34c759"
                    ;(e.currentTarget as HTMLInputElement).style.background = isDark ? "#0f172a" : "#ffffff"
                    ;(e.currentTarget as HTMLInputElement).style.boxShadow = "0 0 0 3px rgba(52, 199, 89, 0.1)"
                  }
                }}
                onBlur={(e) => {
                  ;(e.currentTarget as HTMLInputElement).style.borderColor = isDark ? "#334155" : "#e2e8f0"
                  ;(e.currentTarget as HTMLInputElement).style.background = isDark ? "#1e293b" : "#f8fafc"
                  ;(e.currentTarget as HTMLInputElement).style.boxShadow = "none"
                }}
              />
            </div>

            <button
              onClick={() => {
                const v = inputRef.current?.value ?? ""
                if (!v.trim()) return
                inputRef.current!.value = ""
                handleSubmit(v, false)
              }}
              disabled={speechToSpeechMode}
              style={{
                padding: isCompactLayout ? "12px 14px" : "12px 18px",
                borderRadius: "10px",
                border: "none",
                background: speechToSpeechMode 
                  ? isDark ? "#0f172a" : "#cbd5e1" 
                  : "linear-gradient(135deg, #34c759 0%, #2ecc71 100%)",
                color: "white",
                cursor: speechToSpeechMode ? "not-allowed" : "pointer",
                fontWeight: 600,
                boxShadow: speechToSpeechMode ? "none" : isDark ? "0 4px 12px rgba(0, 0, 0, 0.2)" : "0 4px 12px rgba(52, 199, 89, 0.2)",
                opacity: speechToSpeechMode ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (!speechToSpeechMode) {
                  ;(e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)"
                  ;(e.currentTarget as HTMLButtonElement).style.boxShadow = isDark ? "0 8px 20px rgba(0, 0, 0, 0.3)" : "0 8px 20px rgba(52, 199, 89, 0.3)"
                }
              }}
              onMouseLeave={(e) => {
                if (!speechToSpeechMode) {
                  ;(e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"
                  ;(e.currentTarget as HTMLButtonElement).style.boxShadow = isDark ? "0 4px 12px rgba(0, 0, 0, 0.2)" : "0 4px 12px rgba(52, 199, 89, 0.2)"
                }
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Resize handle */}
          {!isFullscreen && (
            <div
              onMouseDown={handleResizeStart}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: "6px",
                cursor: "col-resize",
                background: isResizing ? "#34c759" : "transparent",
                transition: "background 0.2s",
                zIndex: 10000,
                userSelect: "none",
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLDivElement).style.background = "#34c759"
                ;(e.currentTarget as HTMLDivElement).style.opacity = "0.8"
              }}
              onMouseLeave={(e) => {
                if (!isResizing) {
                  ;(e.currentTarget as HTMLDivElement).style.background = "transparent"
                  ;(e.currentTarget as HTMLDivElement).style.opacity = "1"
                }
              }}
            />
          )}
        </div>
      )}

      {/* Overlay */}
      {open && !isFullscreen && (
        <div
          onClick={handleClose}
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            right: isCompactLayout ? 0 : sidebarWidthStyle,
            bottom: 0,
            zIndex: 9997,
            background: isDark ? "rgba(0, 0, 0, 0.5)" : "rgba(0, 0, 0, 0.12)",
            animation: "fadeIn 0.35s ease-in forwards",
            backdropFilter: "blur(2px)",
          }}
        />
      )}
    </>
  )
}