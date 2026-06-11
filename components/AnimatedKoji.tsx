"use client"

import React, { useState, useEffect } from "react"
import { motion } from "motion/react"

export type KojiState = "idle" | "listening" | "thinking" | "speaking"

interface AnimatedKojiProps {
  state: KojiState
  size?: number
  className?: string
}

type IdleSubState = "standard" | "wave" | "yawn" | "scan"

export default function AnimatedKoji({ state, size = 64, className = "" }: AnimatedKojiProps) {
  const [idleSubState, setIdleSubState] = useState<IdleSubState>("standard")

  // Periodic Idle micro-expressions cycle
  useEffect(() => {
    if (state !== "idle") {
      setIdleSubState("standard")
      return
    }

    const interval = setInterval(() => {
      const choices: IdleSubState[] = ["wave", "yawn", "scan"]
      const randomChoice = choices[Math.floor(Math.random() * choices.length)]
      setIdleSubState(randomChoice)

      // Go back to standard after 2.5 seconds
      const timeout = setTimeout(() => {
        setIdleSubState("standard")
      }, 2500)

      return () => clearTimeout(timeout)
    }, 8000)

    return () => clearInterval(interval)
  }, [state])

  // Common bobbing animation configuration
  const bobbingTransition = {
    y: {
      duration: 3,
      repeat: Infinity,
      repeatType: "mirror" as const,
      ease: "easeInOut" as const,
    },
    rotate: {
      duration: 2.5,
      repeat: Infinity,
      repeatType: "mirror" as const,
      ease: "easeInOut" as const,
    }
  }

  // State-specific body physics
  const getBodyMotion = () => {
    if (state === "listening") {
      return { y: [0, -5, 0], scale: [1, 1.03, 1] }
    }
    if (state === "thinking") {
      return { y: [0, -3, 0], rotate: [-2, 2, -2] }
    }
    if (state === "speaking") {
      return { y: [0, -10, 0], scale: [1, 1.05, 1] }
    }
    if (idleSubState === "wave") {
      return { y: [0, -7, 0], rotate: [-5, 5, -5] }
    }
    return { y: [0, -6, 0] }
  }

  return (
    <motion.div
      className={`relative select-none ${className}`}
      style={{ width: size, height: size }}
      animate={getBodyMotion()}
      transition={bobbingTransition}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_12px_28px_rgba(34,197,94,0.32)]"
      >
        <defs>
          {/* Holographic Beam Gradients */}
          <linearGradient id="idleBeam" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#4ade80" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="listeningBeam" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="thinkingBeam" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#ec4899" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="speakingBeam" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>

          <radialGradient id="screenGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </radialGradient>
          <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7889a4" />
            <stop offset="50%" stopColor="#475569" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
          <linearGradient id="thinkingGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          <linearGradient id="scanBeamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0" />
            <stop offset="50%" stopColor="#22c55e" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
          </linearGradient>
          <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Floating shadow below body */}
        <motion.ellipse
          cx="50"
          cy="93"
          rx="20"
          ry="3.5"
          fill="rgba(0, 0, 0, 0.3)"
          animate={{
            rx: state === "idle" ? [20, 16, 20] : [20, 17, 20],
            opacity: [0.7, 0.45, 0.7],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "mirror" as const,
            ease: "easeInOut",
          }}
        />

        {/* Outer Holographic sci-fi base ring (Concentric HUD 1 - clockwise) */}
        <motion.ellipse
          cx="50"
          cy="90"
          rx="25"
          ry="6"
          stroke={
            state === "listening"
              ? "#22d3ee"
              : state === "thinking"
              ? "#ec4899"
              : state === "speaking"
              ? "#3b82f6"
              : "#4ade80"
          }
          strokeWidth="1.2"
          fill="none"
          animate={{
            rx: [23, 27, 23],
            opacity: [0.3, 0.7, 0.3],
            strokeDashoffset: [0, 30]
          }}
          strokeDasharray="6 4"
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
          filter="url(#glow)"
        />

        {/* Inner Holographic base ring (Concentric HUD 2 - counter-clockwise) */}
        <motion.ellipse
          cx="50"
          cy="90"
          rx="19"
          ry="4.5"
          stroke={
            state === "listening"
              ? "#22d3ee"
              : state === "thinking"
              ? "#ec4899"
              : state === "speaking"
              ? "#3b82f6"
              : "#4ade80"
          }
          strokeWidth="1"
          fill="none"
          animate={{
            rx: [18, 20, 18],
            opacity: [0.5, 0.9, 0.5],
            strokeDashoffset: [0, -20]
          }}
          strokeDasharray="4 2"
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
          filter="url(#glow)"
        />

        {/* Conical Holographic Projection Light Beam */}
        <motion.polygon
          points="44,75 56,75 72,89 28,89"
          fill={
            state === "listening"
              ? "url(#listeningBeam)"
              : state === "thinking"
              ? "url(#thinkingBeam)"
              : state === "speaking"
              ? "url(#speakingBeam)"
              : "url(#idleBeam)"
          }
          animate={{
            opacity: state !== "idle" ? [0.3, 0.65, 0.3] : [0.2, 0.45, 0.2],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Floating Data Particles around Koji */}
        <motion.circle
          cx="10"
          cy="50"
          r="1.8"
          fill="#4ade80"
          animate={{ y: [0, -16, 0], opacity: [0.2, 1, 0.2], x: [0, 4, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          filter="url(#glow)"
        />
        <motion.circle
          cx="88"
          cy="30"
          r="1.5"
          fill="#22d3ee"
          animate={{ y: [0, -22, 0], opacity: [0.1, 0.9, 0.1], x: [0, -3, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          filter="url(#glow)"
        />
        <motion.circle
          cx="86"
          cy="70"
          r="1.8"
          fill="#ec4899"
          animate={{ y: [0, -18, 0], opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          filter="url(#glow)"
        />

        {/* Holographic Halo above Head */}
        <motion.ellipse
          cx="50"
          cy="18"
          rx="18"
          ry="3"
          stroke={
            state === "listening"
              ? "rgba(34, 211, 238, 0.45)"
              : state === "thinking"
              ? "rgba(236, 72, 153, 0.45)"
              : "rgba(74, 222, 128, 0.45)"
          }
          strokeWidth="1"
          strokeDasharray="4 2"
          fill="none"
          animate={{ rotate: 360, y: [0, -1, 0] }}
          transition={{
            rotate: { duration: 10, repeat: Infinity, ease: "linear" },
            y: { duration: 2.5, repeat: Infinity, repeatType: "mirror" }
          }}
        />

        {/* Headphones Arch / Band */}
        <path
          d="M17 42 A 34 34 0 0 1 83 42"
          stroke={
            state === "listening"
              ? "#22d3ee"
              : state === "thinking"
              ? "#ec4899"
              : state === "speaking"
              ? "#3b82f6"
              : "#64748b"
          }
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
          filter="url(#glow)"
        />

        {/* Ears/Side Bolts (Inside Headphone Cups) */}
        <rect x="10" y="38" width="8" height="20" rx="3.5" fill="#334155" stroke="#475569" strokeWidth="1" />
        <rect x="82" y="38" width="8" height="20" rx="3.5" fill="#334155" stroke="#475569" strokeWidth="1" />

        {/* Headphone Cap Accents */}
        <circle cx="14" cy="48" r="3" fill="#1e293b" />
        <circle cx="86" cy="48" r="3" fill="#1e293b" />

        {/* Ear glow indicators */}
        <motion.circle
          cx="14"
          cy="48"
          r="1.8"
          fill={state === "listening" ? "#22d3ee" : state === "thinking" ? "#f59e0b" : "#4ade80"}
          animate={
            state !== "idle"
              ? { opacity: [0.4, 1, 0.4] }
              : { opacity: 0.8 }
          }
          transition={{ duration: 1, repeat: Infinity }}
          filter="url(#glow)"
        />
        <motion.circle
          cx="86"
          cy="48"
          r="1.8"
          fill={state === "listening" ? "#22d3ee" : state === "thinking" ? "#f59e0b" : "#4ade80"}
          animate={
            state !== "idle"
              ? { opacity: [0.4, 1, 0.4] }
              : { opacity: 0.8 }
          }
          transition={{ duration: 1, repeat: Infinity }}
          filter="url(#glow)"
        />

        {/* Antenna */}
        <rect x="48.5" y="14" width="3" height="10" fill="#475569" />
        
        {/* Antenna Bulb with State-Specific Glow */}
        <motion.circle
          cx="50"
          cy="12"
          r="5.5"
          fill={
            state === "listening"
              ? "#22d3ee"
              : state === "thinking"
              ? "#ec4899"
              : state === "speaking"
              ? "#3b82f6"
              : "#4ade80"
          }
          animate={{
            scale: state !== "idle" ? [1, 1.3, 1] : [1, 1.1, 1],
          }}
          transition={{
            duration: state === "listening" ? 0.8 : state === "thinking" ? 0.5 : 2,
            repeat: Infinity,
          }}
          filter="url(#glow)"
        />

        {/* Main Head Body */}
        <rect x="18" y="24" width="64" height="52" rx="18" fill="url(#bodyGradient)" stroke="#334155" strokeWidth="2.5" />

        {/* Screen Bezel / Border */}
        <rect x="22" y="28" width="56" height="44" rx="14" fill="#0f172a" stroke="#1e293b" strokeWidth="1.5" />

        {/* Screen Background Glassmorphic Glow */}
        <rect x="24" y="30" width="52" height="40" rx="12" fill="url(#screenGlow)" />

        {/* Diagonal Screen Reflection Glare Highlight */}
        <path d="M26 32 L56 32 L38 68 L26 68 Z" fill="rgba(255, 255, 255, 0.05)" pointerEvents="none" />

        {/* Scanner Effect */}
        {state === "idle" && idleSubState === "scan" && (
          <motion.rect
            x="24"
            y="30"
            width="52"
            height="6"
            fill="url(#scanBeamGrad)"
            animate={{ y: [30, 64, 30] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            pointerEvents="none"
          />
        )}

        {/* Blushing cheeks for speaking, waving, or listening */}
        {(state === "speaking" || state === "listening" || (state === "idle" && idleSubState === "wave")) && (
          <>
            <motion.ellipse
              cx="31"
              cy="54"
              rx="4"
              ry="2"
              fill={state === "listening" ? "rgba(34, 211, 238, 0.35)" : "rgba(236, 72, 153, 0.35)"}
              animate={{ opacity: [0.6, 0.9, 0.6] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              filter="url(#glow)"
            />
            <motion.ellipse
              cx="69"
              cy="54"
              rx="4"
              ry="2"
              fill={state === "listening" ? "rgba(34, 211, 238, 0.35)" : "rgba(236, 72, 153, 0.35)"}
              animate={{ opacity: [0.6, 0.9, 0.6] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              filter="url(#glow)"
            />
          </>
        )}

        {/* State Interactive Graphics */}
        {state === "idle" && (
          <>
            {/* Left Eye */}
            <motion.ellipse
              cx="40"
              cy="48"
              rx="6"
              ry={idleSubState === "yawn" ? 2.5 : 6}
              fill={idleSubState === "scan" ? "#22c55e" : "#4ade80"}
              animate={
                idleSubState === "wave"
                  ? { scaleY: [1, 0.1, 1, 1] }
                  : { scaleY: [1, 1, 0.1, 1, 1] }
              }
              transition={{
                duration: idleSubState === "wave" ? 1 : 4,
                repeat: Infinity,
                repeatDelay: idleSubState === "wave" ? 0.3 : 2.5,
              }}
            />
            {/* Right Eye */}
            <motion.ellipse
              cx="60"
              cy="48"
              rx="6"
              ry={idleSubState === "yawn" ? 2.5 : idleSubState === "wave" ? 1.5 : 6}
              fill={idleSubState === "scan" ? "#22c55e" : "#4ade80"}
              animate={{
                scaleY: [1, 1, 0.1, 1, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatDelay: 2.5,
              }}
            />
            
            {/* Mouth */}
            {idleSubState === "yawn" ? (
              <motion.circle
                cx="50"
                cy="60"
                r="4.5"
                fill="none"
                stroke="#4ade80"
                strokeWidth="2.5"
                animate={{ scale: [0.7, 1.2, 0.7] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
            ) : idleSubState === "wave" ? (
              <path d="M43 58 Q50 64 57 58" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            ) : (
              <path d="M46 60 Q50 63 54 60" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" />
            )}
          </>
        )}

        {state === "thinking" && (
          <>
            {/* Spinning/Processing Eyes */}
            <g transform="translate(40, 48)">
              <motion.circle
                r="7"
                fill="none"
                stroke="url(#thinkingGlow)"
                strokeWidth="2.2"
                strokeDasharray="10 6"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
              <circle r="2" fill="#ec4899" />
            </g>
            <g transform="translate(60, 48)">
              <motion.circle
                r="7"
                fill="none"
                stroke="url(#thinkingGlow)"
                strokeWidth="2.2"
                strokeDasharray="10 6"
                animate={{ rotate: -360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
              <circle r="2" fill="#ec4899" />
            </g>
            {/* Thinking neutral wavy mouth */}
            <motion.path
              d="M44 60 Q47 58 50 60 T56 60"
              stroke="#ec4899"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              animate={{
                d: [
                  "M44 60 Q47 58 50 60 T56 60",
                  "M44 60 Q47 62 50 60 T56 60",
                  "M44 60 Q47 58 50 60 T56 60",
                ],
              }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
          </>
        )}

        {state === "listening" && (
          <>
            {/* Attentive Eyes (Wide and Pulsing) */}
            <motion.ellipse
              cx="40"
              cy="46"
              rx="6.5"
              ry="6.5"
              fill="#22d3ee"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <motion.ellipse
              cx="60"
              cy="46"
              rx="6.5"
              ry="6.5"
              fill="#22d3ee"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            {/* Interactive Sound Wave / Listening Line */}
            <motion.path
              d="M32 58 L38 58 L44 54 L50 64 L56 52 L62 58 L68 58"
              stroke="#22d3ee"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              animate={{
                d: [
                  "M32 58 L38 58 L44 54 L50 64 L56 52 L62 58 L68 58",
                  "M32 58 L38 54 L44 64 L50 46 L56 66 L62 50 L68 58",
                  "M32 58 L38 58 L44 54 L50 64 L56 52 L62 58 L68 58",
                ],
              }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </>
        )}

        {state === "speaking" && (
          <>
            {/* Happy curves for eyes */}
            <path
              d="M34 48 Q40 42 46 48"
              stroke="#3b82f6"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M54 48 Q60 42 66 48"
              stroke="#3b82f6"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Dynamic Mouth Audio Equalizer waves */}
            <g transform="translate(30, 56)">
              <motion.rect
                x="6"
                y="0"
                width="3"
                height="6"
                rx="1.5"
                fill="#3b82f6"
                animate={{ height: [4, 12, 4], y: [4, 0, 4] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
              />
              <motion.rect
                x="14"
                y="0"
                width="3"
                height="6"
                rx="1.5"
                fill="#3b82f6"
                animate={{ height: [6, 18, 6], y: [6, 0, 6] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: 0 }}
              />
              <motion.rect
                x="22"
                y="0"
                width="3"
                height="6"
                rx="1.5"
                fill="#3b82f6"
                animate={{ height: [4, 14, 4], y: [5, 0, 5] }}
                transition={{ duration: 0.7, repeat: Infinity, delay: 0.2 }}
              />
              <motion.rect
                x="30"
                y="0"
                width="3"
                height="6"
                rx="1.5"
                fill="#3b82f6"
                animate={{ height: [2, 10, 2], y: [3, 0, 3] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
              />
            </g>
          </>
        )}
      </svg>
    </motion.div>
  )
}
