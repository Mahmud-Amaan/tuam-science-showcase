"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  size: number
  vx: number
  vy: number
  opacity: number
  type: "circle" | "molecule" | "wave"
}

const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = Array.from({ length: 50 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        type: (["circle", "molecule", "wave"] as const)[Math.floor(Math.random() * 3)],
      }))
    }

    initParticles()

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener("mousemove", handleMouseMove)

    let animationFrameId: number | null = null
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, "rgba(240, 249, 255, 0.3)")
      gradient.addColorStop(0.5, "rgba(230, 245, 255, 0.2)")
      gradient.addColorStop(1, "rgba(250, 235, 215, 0.15)")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particlesRef.current.forEach((particle) => {
        const dx = mouseRef.current.x - particle.x
        const dy = mouseRef.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Repel particles from mouse
        if (distance < 150) {
          const angle = Math.atan2(dy, dx)
          particle.vx -= Math.cos(angle) * 0.3
          particle.vy -= Math.sin(angle) * 0.3
        }

        // Apply damping
        particle.vx *= 0.98
        particle.vy *= 0.98

        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        particle.x = Math.max(0, Math.min(canvas.width, particle.x))
        particle.y = Math.max(0, Math.min(canvas.height, particle.y))

        // Draw particle
        ctx.fillStyle = `rgba(59, 130, 246, ${particle.opacity})`
        ctx.globalAlpha = particle.opacity
        
        if (particle.type === "molecule") {
          // Draw molecule as circle
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fill()
        } else if (particle.type === "wave") {
          // Draw wave as wavy line
          ctx.beginPath()
          ctx.moveTo(particle.x - particle.size * 2, particle.y)
          for (let i = 0; i < 5; i++) {
            ctx.lineTo(
              particle.x - particle.size * 2 + (i * particle.size),
              particle.y + Math.sin(i) * particle.size
            )
          }
          ctx.strokeStyle = `rgba(59, 130, 246, ${particle.opacity})`
          ctx.lineWidth = 2
          ctx.stroke()
        } else {
          // Draw circle for default type
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fill()
        }
        
        ctx.globalAlpha = 1.0
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    // Start animation
    animationFrameId = requestAnimationFrame(animate)
    window.addEventListener("resize", resizeCanvas)
    
    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
      }
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }} />
}

export default AnimatedBackground
