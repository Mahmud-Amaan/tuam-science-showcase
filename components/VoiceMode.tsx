"use client"
import React, { useRef, useEffect, useState } from "react"

type ChatMsg = { role: "user" | "bot"; text: string; time?: number }
type Intent = { type: "navigate" | "answer"; target?: string }

interface VoiceModeProps {
  speechToSpeechMode: boolean
  lang: "en" | "bn"
  onSpeechResult: (text: string) => void
  onToggleMode: () => void
  isSpeaking: boolean
  setIsSpeaking: (speaking: boolean) => void
}

export default function VoiceMode({
  speechToSpeechMode,
  lang,
  onSpeechResult,
  onToggleMode,
  isSpeaking,
  setIsSpeaking
}: VoiceModeProps) {
  const [listening, setListening] = useState(false)
  const recogRef = useRef<any>(null)
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const interimTranscriptRef = useRef("")

  // Initialize speech recognition
  useEffect(() => {
    if (!speechToSpeechMode || typeof window === "undefined") return

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser. Use Chrome/Edge.")
      onToggleMode()
      return
    }

    const recog = new SpeechRecognition()
    recog.continuous = false
    recog.interimResults = true
    recog.lang = lang === "bn" ? "bn-BD" : "en-US"
    recog.maxAlternatives = 1

    recog.onresult = (e: any) => {
      let interimTranscript = ""
      let finalTranscript = ""

      for (let i = e.resultIndex; i < e.results.length; i++) {
        const transcript = e.results[i][0].transcript
        if (e.results[i].isFinal) {
          finalTranscript += transcript
        } else {
          interimTranscript += transcript
        }
      }

      interimTranscriptRef.current = interimTranscript

      if (finalTranscript.trim()) {
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current)
        }

        if (speechToSpeechMode && !isSpeaking) {
          try {
            recog.stop()
          } catch {}
          setListening(false)

          onSpeechResult(finalTranscript.trim())
          interimTranscriptRef.current = ""
        }
      }
    }

    recog.onerror = (e: any) => {
      console.warn("SpeechRecognition error:", e)
      if (e.error === "no-speech" && speechToSpeechMode && !isSpeaking) {
        try {
          recog.start()
        } catch {}
      } else if (e.error !== "aborted") {
        setListening(false)
        onToggleMode()
      }
    }

recog.onend = () => {
  if (speechToSpeechMode && !isSpeaking) {
    try {
      recog.start()
      setListening(true)
    } catch (e) {
      console.error("Failed to restart recognition:", e)
    }
  } else {
    setListening(false)
  }
}


    recogRef.current = recog

    return () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current)
      }
      try {
        recog.stop()
      } catch {}
    }
  }, [speechToSpeechMode, lang, isSpeaking, onSpeechResult, onToggleMode])

  // Handle mode toggle
  useEffect(() => {
    const recog = recogRef.current
    if (!recog) return

    if (speechToSpeechMode) {
      try {
        window.speechSynthesis.cancel()
        setIsSpeaking(false)
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current)
        }
        interimTranscriptRef.current = ""
        recog.lang = lang === "bn" ? "bn-BD" : "en-US"
        recog.start()
        setListening(true)
      } catch (e) {
        console.error("recog start failed", e)
      }
    } else {
      try {
        recog.stop()
        window.speechSynthesis.cancel()
      } catch {}
      setListening(false)
      setIsSpeaking(false)
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current)
      }
      interimTranscriptRef.current = ""
    }
  }, [speechToSpeechMode, lang, setIsSpeaking])

  // Speak function
  const speak = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      if (!speechToSpeechMode) {
        resolve()
        return
      }
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        resolve()
        return
      }

      try {
        window.speechSynthesis.cancel()
        setIsSpeaking(true)

        const utter = new SpeechSynthesisUtterance(text)
        utter.lang = lang === "bn" ? "bn-BD" : "en-US"
        utter.rate = 0.95
        utter.pitch = 1

        const voices = window.speechSynthesis.getVoices()
        if (lang === "bn") {
          const banglaVoice = voices.find(v => v.lang.startsWith("bn"))
          if (banglaVoice) utter.voice = banglaVoice
        } else {
          const englishVoice = voices.find(v => v.lang.startsWith("en"))
          if (englishVoice) utter.voice = englishVoice
        }

        utter.onend = () => {
          setIsSpeaking(false)
          resolve()
        }

        utter.onerror = () => {
          setIsSpeaking(false)
          resolve()
        }

        window.speechSynthesis.speak(utter)
      } catch (e) {
        console.error("TTS failed:", e)
        setIsSpeaking(false)
        resolve()
      }
    })
  }

  // Expose speak function for parent component
  useEffect(() => {
    (window as any).voiceModeSpeak = speak
    return () => {
      delete (window as any).voiceModeSpeak
    }
  }, [lang, speechToSpeechMode])

  return null // This component doesn't render anything visible
}