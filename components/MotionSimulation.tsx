"use client"

import { useEffect, useRef, useState } from "react"
import { Play, Pause, RotateCcw } from "lucide-react"
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Line, ResponsiveContainer } from "recharts"

interface MotionSimulationProps {
  language?: "en" | "bn"
}

interface PhysicsState {
  position: number
  velocity: number
  initialVelocity: number
  acceleration: number
  time: number
}

type ObjectType = "car" | "ball" | "cheetah" | "deer" | "student"

export default function MotionSimulation({ language = "en" }: MotionSimulationProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const p5InstanceRef = useRef<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [objectType, setObjectType] = useState<ObjectType>("car")

  const [physics, setPhysics] = useState<PhysicsState>({
    position: 0,
    velocity: 50,
    initialVelocity: 50,
    acceleration: 20,
    time: 0,
  })

  // Generate chart data
  const generateChartData = () => {
    const maxT = Math.max(physics.time, 5)
    const points = 50
    const dt = maxT / (points - 1)
    const data = []

    for (let i = 0; i < points; i++) {
      const t = i * dt
      const s = physics.initialVelocity * t + 0.5 * physics.acceleration * t * t
      const v = physics.initialVelocity + physics.acceleration * t
      const a = physics.acceleration

      data.push({
        time: parseFloat(t.toFixed(2)),
        displacement: parseFloat(s.toFixed(2)),
        velocity: parseFloat(v.toFixed(2)),
        acceleration: parseFloat(a.toFixed(2)),
      })
    }

    return data
  }

  const chartData = generateChartData()

  // P5 sketch setup
  useEffect(() => {
    if (!canvasRef.current) return

    let mounted = true
    let p5Instance: any = null

    import("p5")
      .then((p5Module) => {
        if (!mounted || !canvasRef.current) return

        const p5 = p5Module.default

        const sketch = (p: any) => {
          const canvasWidth = 1200
          const canvasHeight = 600
          const groundY = canvasHeight - 100
          const startX = 50

          let objectX = startX
          let objectY = groundY - 40
          let animationFrame = 0
          let birdX = 100
          let birdY = 80
          let currentObjectType = objectType

          // Internal simulation state
          let simPosition = 0
          let simVelocity = 0
          let simTime = 0
          let simStartTime = 0
          let simAcceleration = 20
          let simInitialVelocity = 50
          let isSimulating = false

          p.setup = () => {
            p.createCanvas(canvasWidth, canvasHeight)
            p.angleMode(p.DEGREES)
          }

          const drawBackground = () => {
            // Sky gradient
            for (let i = 0; i <= canvasHeight; i++) {
              const inter = p.map(i, 0, canvasHeight, 0, 1)
              const c = p.lerpColor(p.color(135, 206, 235), p.color(176, 224, 230), inter)
              p.stroke(c)
              p.line(0, i, canvasWidth, i)
            }

            // Sun
            p.noStroke()
            p.fill(255, 220, 100, 50)
            p.circle(canvasWidth - 100, 80, 100)
            p.fill(255, 220, 100)
            p.circle(canvasWidth - 100, 80, 80)

            // Clouds
            p.fill(255, 255, 255, 200)
            drawCloud(200, 120, 60)
            drawCloud(400, 100, 70)
            drawCloud(800, 140, 55)

            // Ground/Road
            p.fill(60, 60, 60)
            p.noStroke()
            p.rect(0, groundY, canvasWidth, canvasHeight - groundY)

            // Road markings
            p.stroke(255, 255, 0)
            p.strokeWeight(3)
            const dashOffset = (animationFrame * 2) % 40
            for (let i = -dashOffset; i < canvasWidth; i += 40) {
              p.line(i, groundY + 40, i + 20, groundY + 40)
            }
            
            // Grid lines for measurement
            p.stroke(100, 100, 100, 80)
            p.strokeWeight(1)
            for (let i = startX; i < canvasWidth; i += 100) {
              p.line(i, groundY - 100, i, groundY)
              p.noStroke()
              p.fill(80, 80, 80)
              p.textSize(10)
              p.textAlign(p.CENTER)
              p.text(`${((i - startX) / 2).toFixed(0)}`, i, groundY - 5)
              p.stroke(100, 100, 100, 80)
            }
          }

          const drawCloud = (x: number, y: number, size: number) => {
            p.noStroke()
            p.circle(x, y, size)
            p.circle(x + size * 0.6, y, size * 0.8)
            p.circle(x - size * 0.6, y, size * 0.7)
          }

          const drawBird = (x: number, y: number, frame: number) => {
            p.push()
            p.translate(x, y)
            p.stroke(50, 50, 50)
            p.strokeWeight(2)
            p.noFill()
            const wingAngle = p.sin(frame * 0.2) * 20
            p.beginShape()
            p.vertex(0, 0)
            p.vertex(-10, -5 + wingAngle)
            p.vertex(-15, 0)
            p.endShape()
            p.beginShape()
            p.vertex(0, 0)
            p.vertex(10, -5 + wingAngle)
            p.vertex(15, 0)
            p.endShape()
            p.pop()
          }

          const drawCar = (x: number, y: number, frame: number) => {
            p.push()
            p.translate(x, y)
            p.fill(0, 0, 0, 50)
            p.noStroke()
            p.ellipse(0, 15, 60, 15)
            p.fill(255, 100, 100)
            p.rect(-25, -15, 50, 25, 5)
            p.fill(200, 50, 50)
            p.beginShape()
            p.vertex(-15, -15)
            p.vertex(-15, -25)
            p.vertex(15, -25)
            p.vertex(15, -15)
            p.endShape(p.CLOSE)
            p.fill(200, 230, 255, 200)
            p.rect(-12, -22, 8, 8, 2)
            p.rect(4, -22, 8, 8, 2)
            const wheelRot = isSimulating ? frame * 5 : 0
            drawWheel(-15, 5, 12, wheelRot)
            drawWheel(15, 5, 12, wheelRot)
            p.pop()
          }

          const drawWheel = (x: number, y: number, size: number, rotation: number) => {
            p.push()
            p.translate(x, y)
            p.rotate(rotation)
            p.fill(30, 30, 30)
            p.circle(0, 0, size)
            p.fill(150, 150, 150)
            p.circle(0, 0, size * 0.6)
            p.pop()
          }

          const drawBall = (x: number, y: number, frame: number) => {
            p.push()
            p.translate(x, y)
            p.fill(0, 0, 0, 50)
            p.noStroke()
            p.ellipse(0, 15, 40, 10)
            const rotation = isSimulating ? frame * 3 : 0
            p.rotate(rotation)
            p.fill(255, 150, 0)
            p.stroke(200, 100, 0)
            p.strokeWeight(2)
            p.circle(0, 0, 35)
            p.stroke(255, 200, 100)
            p.strokeWeight(3)
            p.line(-15, 0, 15, 0)
            p.line(0, -15, 0, 15)
            p.pop()
          }

          const drawCheetah = (x: number, y: number, frame: number) => {
            p.push()
            p.translate(x, y)
            p.fill(0, 0, 0, 50)
            p.noStroke()
            p.ellipse(0, 15, 50, 12)
            const legMove = isSimulating ? p.sin(frame * 0.3) * 8 : 0
            p.fill(255, 200, 50)
            p.ellipse(0, -10, 45, 25)
            p.circle(20, -15, 18)
            p.fill(255, 180, 30)
            p.triangle(18, -22, 20, -28, 22, -22)
            p.triangle(22, -22, 24, -28, 26, -22)
            p.fill(150, 100, 0)
            p.circle(-5, -12, 4)
            p.circle(5, -8, 4)
            p.stroke(255, 200, 50)
            p.strokeWeight(3)
            p.line(-10, 0, -10, 8 + legMove)
            p.line(10, 0, 10, 8 - legMove)
            p.pop()
          }

          const drawDeer = (x: number, y: number, frame: number) => {
            p.push()
            p.translate(x, y)
            p.fill(0, 0, 0, 50)
            p.noStroke()
            p.ellipse(0, 15, 50, 12)
            const legMove = isSimulating ? p.sin(frame * 0.3) * 10 : 0
            p.fill(160, 82, 45)
            p.ellipse(0, -12, 50, 28)
            p.rect(15, -25, 8, 15)
            p.circle(19, -28, 16)
            p.stroke(101, 67, 33)
            p.strokeWeight(2)
            p.noFill()
            p.beginShape()
            p.vertex(16, -35)
            p.vertex(14, -42)
            p.vertex(12, -38)
            p.endShape()
            p.stroke(160, 82, 45)
            p.strokeWeight(3)
            p.line(-12, 0, -12, 10 + legMove)
            p.line(12, 0, 12, 10 - legMove)
            p.pop()
          }

          const drawStudent = (x: number, y: number, frame: number) => {
            p.push()
            p.translate(x, y)
            p.fill(0, 0, 0, 50)
            p.noStroke()
            p.ellipse(0, 15, 30, 8)
            const limbMove = isSimulating ? p.sin(frame * 0.3) * 15 : 0
            p.fill(100, 150, 255)
            p.rect(-8, -20, 16, 25, 3)
            p.fill(255, 220, 177)
            p.circle(0, -28, 16)
            p.fill(50, 30, 20)
            p.arc(0, -28, 16, 16, p.PI, 0)
            p.fill(0)
            p.circle(-3, -28, 2)
            p.circle(3, -28, 2)
            p.stroke(255, 220, 177)
            p.strokeWeight(4)
            p.line(-8, -15, -12, -8 + limbMove)
            p.line(8, -15, 12, -8 - limbMove)
            p.stroke(50, 50, 150)
            p.strokeWeight(5)
            p.line(-4, 5, -6, 12 + limbMove)
            p.line(4, 5, 6, 12 - limbMove)
            p.pop()
          }

          const drawObject = (x: number, y: number) => {
            switch (currentObjectType) {
              case "car":
                drawCar(x, y, animationFrame)
                break
              case "ball":
                drawBall(x, y, animationFrame)
                break
              case "cheetah":
                drawCheetah(x, y, animationFrame)
                break
              case "deer":
                drawDeer(x, y, animationFrame)
                break
              case "student":
                drawStudent(x, y, animationFrame)
                break
            }
          }

          const drawInfoPanel = () => {
            p.fill(255, 255, 255, 240)
            p.stroke(100, 150, 255)
            p.strokeWeight(3)
            p.rect(20, 20, 420, 180, 10)
            p.fill(0)
            p.noStroke()
            p.textSize(20)
            p.textStyle(p.BOLD)
            p.textAlign(p.LEFT)
            p.text(language === "en" ? "Kinematics Motion" : "কাইনেমেটিক্স মোশন", 30, 48)
            
            p.textSize(15)
            p.textStyle(p.NORMAL)
            p.fill(60)
            
            p.text(`u (Initial Velocity): ${simInitialVelocity.toFixed(1)} px/s`, 30, 80)
            p.text(`a (Acceleration): ${simAcceleration.toFixed(1)} px/s²`, 30, 105)
            p.text(`v (Final Velocity): ${simVelocity.toFixed(1)} px/s`, 30, 130)
            p.text(`s (Displacement): ${simPosition.toFixed(1)} px`, 30, 155)
            p.text(`t (Time): ${simTime.toFixed(2)} s`, 30, 180)
            
            // Status indicator
            if (isSimulating) {
              p.fill(34, 197, 94)
              p.circle(410, 40, 15)
              p.fill(255)
              p.textSize(12)
              p.textAlign(p.RIGHT)
              p.text("RUNNING", 398, 45)
            } else {
              p.fill(239, 68, 68)
              p.circle(410, 40, 15)
              p.fill(255)
              p.textSize(12)
              p.textAlign(p.RIGHT)
              p.text("PAUSED", 398, 45)
            }
          }

          const drawTrail = () => {
            if (!isSimulating) return
            
            p.stroke(255, 200, 0, 100)
            p.strokeWeight(2)
            for (let i = 0; i < 10; i++) {
              const trailX = objectX - i * 15
              if (trailX > startX) p.point(trailX, objectY)
            }
          }

          // Exposed functions
          ;(p as any).updatePhysics = (newPhysics: PhysicsState) => {
            simPosition = newPhysics.position
            simVelocity = newPhysics.velocity
            simTime = newPhysics.time
            simAcceleration = newPhysics.acceleration
            simInitialVelocity = newPhysics.initialVelocity
            objectX = startX + simPosition * 2
            objectY = groundY - 40
          }

          ;(p as any).updateObjectType = (newType: ObjectType) => {
            currentObjectType = newType
          }

          ;(p as any).startSimulation = () => {
            isSimulating = true
            // Continue from current state, don't reset to physics state
            simStartTime = p.millis() / 1000 - simTime
          }

          ;(p as any).stopSimulation = () => {
            isSimulating = false
            // Keep current values when pausing
          }

          ;(p as any).resetPhysics = () => {
            isSimulating = false
            simPosition = 0
            simVelocity = physics.initialVelocity
            simInitialVelocity = physics.initialVelocity
            simAcceleration = physics.acceleration
            simTime = 0
            objectX = startX
            objectY = groundY - 40
            simStartTime = 0
          }

          p.draw = () => {
            animationFrame++

            // Update bird
            birdX += 0.5
            if (birdX > canvasWidth + 50) birdX = -50

            drawBackground()
            drawBird(birdX, birdY, animationFrame)

            if (isSimulating) {
              // Update simulation
              const now = p.millis() / 1000
              simTime = now - simStartTime

              simVelocity = simInitialVelocity + simAcceleration * simTime
              simPosition = simInitialVelocity * simTime + 0.5 * simAcceleration * simTime * simTime

              objectX = startX + simPosition * 2
              objectY = groundY - 40

              // Update React state periodically
              if (p.frameCount % 5 === 0) {
                setPhysics((prev) => ({
                  ...prev,
                  position: simPosition,
                  velocity: simVelocity,
                  time: simTime,
                }))
              }

              // Stop conditions
              if (objectX > canvasWidth + 200 || simTime > 60) {
                isSimulating = false
                setIsPlaying(false)
              }

              drawTrail()
            }

            drawObject(objectX, objectY)
            drawInfoPanel()
          }
        }

        if (canvasRef.current && mounted) {
          p5Instance = new p5(sketch, canvasRef.current)
          p5InstanceRef.current = p5Instance
        }
      })
      .catch((err) => console.error("Failed to load p5:", err))

    return () => {
      mounted = false
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove()
        p5InstanceRef.current = null
      }
    }
  }, [language, objectType])

  // This useEffect is now handled inside recalculatePhysics for immediate updates

  // Sync object type changes
  useEffect(() => {
    if (p5InstanceRef.current && (p5InstanceRef.current as any).updateObjectType) {
      ;(p5InstanceRef.current as any).updateObjectType(objectType)
    }
  }, [objectType])

  // Handle play/pause state changes
  useEffect(() => {
    if (!p5InstanceRef.current) return
    
    if (isPlaying) {
      if ((p5InstanceRef.current as any).startSimulation) {
        ;(p5InstanceRef.current as any).startSimulation()
      }
    } else {
      if ((p5InstanceRef.current as any).stopSimulation) {
        ;(p5InstanceRef.current as any).stopSimulation()
      }
    }
  }, [isPlaying])

  const recalculatePhysics = (key: "u" | "a" | "t" | "v" | "s", value: number) => {
    setPhysics((prev) => {
      const next = { ...prev }
      switch (key) {
        case "u":
          next.initialVelocity = value
          next.velocity = value + prev.acceleration * prev.time
          next.position = value * prev.time + 0.5 * prev.acceleration * prev.time * prev.time
          break
        case "a":
          next.acceleration = value
          next.velocity = prev.initialVelocity + value * prev.time
          next.position = prev.initialVelocity * prev.time + 0.5 * value * prev.time * prev.time
          break
        case "t":
          next.time = value
          next.velocity = prev.initialVelocity + prev.acceleration * value
          next.position = prev.initialVelocity * value + 0.5 * prev.acceleration * value * value
          break
        case "v":
          next.velocity = value
          if (prev.time > 0) {
            next.acceleration = (value - prev.initialVelocity) / prev.time
            next.position = prev.initialVelocity * prev.time + 0.5 * next.acceleration * prev.time * prev.time
          }
          break
        case "s":
          next.position = value
          if (prev.time > 0) {
            next.acceleration = (2 * (value - prev.initialVelocity * prev.time)) / (prev.time * prev.time)
            next.velocity = prev.initialVelocity + next.acceleration * prev.time
          }
          break
      }
      
      // Update p5.js immediately after state change
      if (p5InstanceRef.current && (p5InstanceRef.current as any).updatePhysics) {
        ;(p5InstanceRef.current as any).updatePhysics(next)
      }
      
      return next
    })
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const resetAll = () => {
    setPhysics({
      position: 0,
      velocity: 50,
      initialVelocity: 50,
      acceleration: 20,
      time: 0,
    })
    setIsPlaying(false)
    if (p5InstanceRef.current && (p5InstanceRef.current as any).resetPhysics) {
      ;(p5InstanceRef.current as any).resetPhysics()
    }
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-6 p-4">
      {/* Canvas */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 shadow-xl border-2 border-slate-300">
        <div ref={canvasRef} className="w-full flex justify-center overflow-hidden rounded-xl" />
      </div>

      {/* Controls */}
      <div className="p-8 bg-white rounded-2xl shadow-xl border-2 border-slate-200">
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <button
            onClick={togglePlay}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                togglePlay()
              }
            }}
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 font-semibold focus:outline-none focus:ring-4 focus:ring-blue-300 focus:scale-105"
            tabIndex={0}
            aria-label={isPlaying ? (language === "en" ? "Pause simulation" : "সিমুলেশন বিরতি") : (language === "en" ? "Play simulation" : "সিমুলেশন চালান")}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            <span>{isPlaying ? (language === "en" ? "Pause" : "বিরতি") : (language === "en" ? "Play" : "চালান")}</span>
          </button>

          <button
            onClick={resetAll}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                resetAll()
              }
            }}
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 font-semibold focus:outline-none focus:ring-4 focus:ring-gray-400 focus:scale-105"
            tabIndex={0}
            aria-label={language === "en" ? "Reset simulation" : "সিমুলেশন রিসেট"}
          >
            <RotateCcw size={20} />
            <span>{language === "en" ? "Reset" : "রিসেট"}</span>
          </button>

          <div className="ml-auto flex items-center gap-4 bg-slate-50 px-6 py-3 rounded-xl border-2 border-slate-200">
            <label className="text-sm font-bold text-slate-700">{language === "en" ? "Object:" : "বস্তু:"}</label>
            <select
              value={objectType}
              onChange={(e) => setObjectType(e.target.value as ObjectType)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  // Allow default select behavior
                }
              }}
              className="px-4 py-2 border-2 border-slate-300 rounded-lg bg-white font-medium text-slate-700 hover:border-blue-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-colors cursor-pointer disabled:bg-slate-100 disabled:cursor-not-allowed"
              disabled={isPlaying}
              tabIndex={0}
              aria-label={language === "en" ? "Select object type" : "বস্তু প্রকার নির্বাচন"}
            >
              <option value="car">{language === "en" ? "🚗 Car" : "🚗 গাড়ি"}</option>
              <option value="ball">{language === "en" ? "⚽ Ball" : "⚽ বল"}</option>
              <option value="cheetah">{language === "en" ? "🐆 Cheetah" : "🐆 চিতা"}</option>
              <option value="deer">{language === "en" ? "🦌 Deer" : "🦌 হরিণ"}</option>
              <option value="student">{language === "en" ? "🏃 Student" : "🏃 ছাত্র"}</option>
            </select>
          </div>
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[
            { key: "u", label: language === "en" ? "Initial Velocity (u)" : "প্রাথমিক বেগ (u)", value: physics.initialVelocity, min: -200, max: 200, unit: "px/s", color: "blue" },
            { key: "a", label: language === "en" ? "Acceleration (a)" : "ত্বরণ (a)", value: physics.acceleration, min: -100, max: 100, unit: "px/s²", color: "purple" },
            { key: "t", label: language === "en" ? "Time (t)" : "সময় (t)", value: physics.time, min: 0, max: 20, unit: "s", color: "green" },
            { key: "v", label: language === "en" ? "Final Velocity (v)" : "চূড়ান্ত বেগ (v)", value: physics.velocity, min: -300, max: 300, unit: "px/s", color: "orange" },
            { key: "s", label: language === "en" ? "Displacement (s)" : "সরণ (s)", value: physics.position, min: -2000, max: 2000, unit: "px", color: "red" },
          ].map((item) => (
            <div key={item.key} className="bg-slate-50 p-5 rounded-xl border-2 border-slate-200">
              <label className="block text-base font-bold mb-3 text-slate-800">
                {item.label} <span className="text-slate-500 font-normal text-sm">({item.unit})</span>
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={item.min}
                  max={item.max}
                  step={item.key === "t" ? 0.01 : 0.1}
                  value={item.value}
                  onChange={(e) => recalculatePhysics(item.key as any, Number(e.target.value))}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                      // Allow default range slider behavior
                    }
                  }}
                  disabled={isPlaying}
                  className="flex-1 h-3 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-4 focus:ring-blue-300"
                  style={{
                    background: isPlaying ? '#cbd5e1' : `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((item.value - item.min) / (item.max - item.min)) * 100}%, #e2e8f0 ${((item.value - item.min) / (item.max - item.min)) * 100}%, #e2e8f0 100%)`
                  }}
                  tabIndex={0}
                  aria-label={`${item.label} slider`}
                />
                <input
                  type="number"
                  value={item.value.toFixed(item.key === "t" ? 2 : 1)}
                  onChange={(e) => recalculatePhysics(item.key as any, Number(e.target.value))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      // Allow default input behavior
                    }
                  }}
                  disabled={isPlaying}
                  className="w-28 px-4 py-2 border-2 border-slate-300 rounded-lg text-right font-mono font-bold text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-slate-100 disabled:cursor-not-allowed"
                  tabIndex={0}
                  aria-label={`${item.label} number input`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Formula Verification */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border-2 border-blue-300 shadow-md">
            <div className="text-sm font-bold text-blue-800 mb-2">v = u + at</div>
            <div className="text-xl font-mono font-bold text-blue-900">
              {(physics.initialVelocity + physics.acceleration * physics.time).toFixed(2)} ≈ {physics.velocity.toFixed(2)}
            </div>
            <div className="text-xs text-blue-700 mt-1">First Equation of Motion</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl border-2 border-green-300 shadow-md">
            <div className="text-sm font-bold text-green-800 mb-2">s = ut + ½at²</div>
            <div className="text-xl font-mono font-bold text-green-900">
              {(physics.initialVelocity * physics.time + 0.5 * physics.acceleration * physics.time * physics.time).toFixed(2)} ≈ {physics.position.toFixed(2)}
            </div>
            <div className="text-xs text-green-700 mt-1">Second Equation of Motion</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-xl border-2 border-purple-300 shadow-md">
            <div className="text-sm font-bold text-purple-800 mb-2">v² = u² + 2as</div>
            <div className="text-xl font-mono font-bold text-purple-900">
              {(physics.initialVelocity * physics.initialVelocity + 2 * physics.acceleration * physics.position).toFixed(2)} ≈ {(physics.velocity * physics.velocity).toFixed(2)}
            </div>
            <div className="text-xs text-purple-700 mt-1">Third Equation of Motion</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-slate-200">
          <h3 className="font-bold text-lg mb-4 text-slate-800">{language === "en" ? "📈 Displacement vs Time" : "📈 সরণ বনাম সময়"}</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="time" stroke="#64748b" style={{ fontSize: '12px' }} />
              <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: '2px solid #10b981',
                  borderRadius: '8px',
                  fontSize: '12px'
                }} 
              />
              <Line type="monotone" dataKey="displacement" stroke="#10b981" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-slate-200">
          <h3 className="font-bold text-lg mb-4 text-slate-800">{language === "en" ? "📊 Velocity vs Time" : "📊 বেগ বনাম সময়"}</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="time" stroke="#64748b" style={{ fontSize: '12px' }} />
              <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: '2px solid #3b82f6',
                  borderRadius: '8px',
                  fontSize: '12px'
                }} 
              />
              <Line type="monotone" dataKey="velocity" stroke="#3b82f6" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-slate-200">
          <h3 className="font-bold text-lg mb-4 text-slate-800">{language === "en" ? "📉 Acceleration vs Time" : "📉 ত্বরণ বনাম সময়"}</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="time" stroke="#64748b" style={{ fontSize: '12px' }} />
              <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: '2px solid #ef4444',
                  borderRadius: '8px',
                  fontSize: '12px'
                }} 
              />
              <Line type="monotone" dataKey="acceleration" stroke="#ef4444" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-300 shadow-lg">
        <h3 className="font-bold text-xl text-blue-900 mb-4 flex items-center gap-2">
          <span>💡</span>
          {language === "en" ? "How to Use This Simulator" : "কীভাবে এই সিমুলেটর ব্যবহার করবেন"}
        </h3>
        <ul className="text-base text-blue-900 space-y-3">
          <li className="flex items-start gap-3">
            <span className="text-blue-600 font-bold mt-1">1.</span>
            <span>{language === "en" ? "Adjust any variable (u, a, t, v, s) using the sliders or number inputs" : "স্লাইডার বা নম্বর ইনপুট ব্যবহার করে যেকোনো ভেরিয়েবল (u, a, t, v, s) সামঞ্জস্য করুন"}</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-600 font-bold mt-1">2.</span>
            <span>{language === "en" ? "Other variables automatically recalculate based on kinematic equations" : "কাইনেমেটিক সমীকরণের উপর ভিত্তি করে অন্যান্য ভেরিয়েবল স্বয়ংক্রিয়ভাবে পুনঃগণনা হয়"}</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-600 font-bold mt-1">3.</span>
            <span>{language === "en" ? "Choose an object from the dropdown to visualize different types of motion" : "বিভিন্ন ধরনের গতি দেখতে ড্রপডাউন থেকে একটি বস্তু নির্বাচন করুন"}</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-600 font-bold mt-1">4.</span>
            <span>{language === "en" ? "Click 'Play' to start the animation and watch real-time motion simulation" : "'Play' ক্লিক করুন অ্যানিমেশন শুরু করতে এবং রিয়েল-টাইম গতি সিমুলেশন দেখুন"}</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-600 font-bold mt-1">5.</span>
            <span>{language === "en" ? "View live graphs showing displacement, velocity, and acceleration over time" : "সময়ের সাথে সরণ, বেগ এবং ত্বরণ দেখানো লাইভ গ্রাফ দেখুন"}</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-600 font-bold mt-1">6.</span>
            <span>{language === "en" ? "Verify that all three equations of motion are satisfied during simulation" : "সিমুলেশনের সময় গতির তিনটি সমীকরণ সন্তুষ্ট হয় তা যাচাই করুন"}</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-600 font-bold mt-1">7.</span>
            <span>{language === "en" ? "Use 'Reset' to return to default values and start over" : "ডিফল্ট মানগুলিতে ফিরে যেতে এবং নতুন করে শুরু করতে 'Reset' ব্যবহার করুন"}</span>
          </li>
        </ul>
        
        <div className="mt-6 p-4 bg-white rounded-xl border-2 border-blue-200">
          <p className="text-sm text-slate-700">
            <span className="font-bold text-blue-800">💡 {language === "en" ? "Tip:" : "টিপ:"}</span> {language === "en" ? "You cannot adjust sliders while the simulation is running. Pause the animation first to make changes." : "সিমুলেশন চলার সময় আপনি স্লাইডার সামঞ্জস্য করতে পারবেন না। পরিবর্তন করতে প্রথমে অ্যানিমেশন বিরতি দিন।"}
          </p>
        </div>
      </div>
    </div>
  )
}