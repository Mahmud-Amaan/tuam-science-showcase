"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"

interface SimulationProps {
  simulation: string
  language: "en" | "bn"
}

interface Point {
  x: number
  y: number
}

interface DragState {
  isDragging: boolean
  draggedPoint: string | null
  startPos: { x: number; y: number }
}

export default function SimulationCanvas({ simulation, language }: SimulationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [zoom, setZoom] = useState(1)
  const [panX, setPanX] = useState(0)
  const [panY, setPanY] = useState(0)
  const [customPoints, setCustomPoints] = useState<Point[]>([])
  const [pointMode, setPointMode] = useState(false)
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })
  const [data, setData] = useState<Record<string, number | string>>({})
  const [inputValues, setInputValues] = useState<Record<string, string>>({})
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedPoint: null,
    startPos: { x: 0, y: 0 },
  })
  const [parameters, setParameters] = useState({
    linear: { slope: 2, intercept: 1 },
    quadratic: { a: 1, b: 0, c: 0 },
    exponential: { base: 2, scale: 1 },
    gradient: { x1: -5, y1: -3, x2: 5, y2: 4 },
    distance: { x1: -5, y1: 2, x2: 5, y2: -2 },
    circle: { centerX: 0, centerY: 0, radius: 3 },
    triangle: { x1: -4, y1: -3, x2: 4, y2: -3, x3: 0, y3: 4 },
    square: { x1: -2, y1: -2, x2: 2, y2: 2 },
  })
  const [xInput, setXInput] = useState("")
  const [calculatedY, setCalculatedY] = useState<number | null>(null)
  const [tableValues, setTableValues] = useState<Array<{ x: number; y: number | string }>>([])

  useEffect(() => {
    const currentParams = parameters[simulation as keyof typeof parameters]
    const values: Record<string, string> = {}
    Object.entries(currentParams).forEach(([key, val]) => {
      values[key] = val.toString()
    })
    setInputValues(values)
  }, [simulation, parameters])

  useEffect(() => {
    if (xInput && ["linear", "quadratic", "exponential"].includes(simulation)) {
      const x = Number.parseFloat(xInput)
      if (!isNaN(x)) {
        const params = parameters[simulation as keyof typeof parameters]
        let y: number | null = null

        if (simulation === "linear") {
          const p = params as typeof parameters.linear
          y = p.slope * x + p.intercept
        } else if (simulation === "quadratic") {
          const p = params as typeof parameters.quadratic
          y = p.a * x * x + p.b * x + p.c
        } else if (simulation === "exponential") {
          const p = params as typeof parameters.exponential
          y = p.scale * Math.pow(p.base, x)
        }

        if (y !== null && isFinite(y)) {
          setCalculatedY(Math.round(y * 100) / 100)
        } else {
          setCalculatedY(null)
        }
      }
    }
  }, [xInput, simulation, parameters])

  useEffect(() => {
    const newTableValues: Array<{ x: number; y: number | string }> = []
    const params = parameters[simulation as keyof typeof parameters]

    if (["linear", "quadratic", "exponential"].includes(simulation)) {
      for (let i = -5; i <= 5; i++) {
        let y: number | string = "N/A"

        if (simulation === "linear") {
          const p = params as typeof parameters.linear
          y = Math.round((p.slope * i + p.intercept) * 100) / 100
        } else if (simulation === "quadratic") {
          const p = params as typeof parameters.quadratic
          y = Math.round((p.a * i * i + p.b * i + p.c) * 100) / 100
        } else if (simulation === "exponential") {
          const p = params as typeof parameters.exponential
          const result = p.scale * Math.pow(p.base, i)
          if (isFinite(result) && Math.abs(result) < 10000) {
            y = Math.round(result * 100) / 100
          } else {
            y = result > 0 ? "∞" : "-∞"
          }
        }

        newTableValues.push({ x: i, y })
      }
    }

    setTableValues(newTableValues)
  }, [simulation, parameters])

  const handleInputChange = (key: string, value: string) => {
    setInputValues({ ...inputValues, [key]: value })
    const numValue = Number.parseFloat(value)
    if (!isNaN(numValue)) {
      const newParams = { ...parameters }
      ;(newParams[simulation as keyof typeof parameters] as any)[key] = numValue
      setParameters(newParams)
    }
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const newZoom = Math.max(0.5, Math.min(5, zoom + (e.deltaY > 0 ? -0.1 : 0.1)))
    setZoom(newZoom)
  }

  const pixelToCanvasCoords = (pixelX: number, pixelY: number): { x: number; y: number } => {
    if (!canvasRef.current) return { x: 0, y: 0 }
    const canvas = canvasRef.current
    const centerX = canvas.width / 2 + panX
    const centerY = canvas.height / 2 + panY
    const scale = 40 * zoom

    const x = Math.round(((pixelX - centerX) / scale) * 100) / 100
    const y = Math.round(((centerY - pixelY) / scale) * 100) / 100
    return { x, y }
  }

  const getPointAtCoords = (pixelX: number, pixelY: number, threshold = 15): string | null => {
    if (!canvasRef.current) return null
    const canvas = canvasRef.current
    const centerX = canvas.width / 2 + panX
    const centerY = canvas.height / 2 + panY
    const scale = 40 * zoom

    const currentParams = parameters[simulation as keyof typeof parameters]

    // Check all draggable points for the current simulation
    const pointMap: Record<string, { x: number; y: number }> = {}

    if (simulation === "gradient") {
      const p = currentParams as typeof parameters.gradient
      pointMap["x1"] = { x: p.x1, y: p.y1 }
      pointMap["x2"] = { x: p.x2, y: p.y2 }
    } else if (simulation === "distance") {
      const p = currentParams as typeof parameters.distance
      pointMap["x1"] = { x: p.x1, y: p.y1 }
      pointMap["x2"] = { x: p.x2, y: p.y2 }
    } else if (simulation === "circle") {
      const p = currentParams as typeof parameters.circle
      pointMap["centerX"] = { x: p.centerX, y: p.centerY }
    } else if (simulation === "triangle") {
      const p = currentParams as typeof parameters.triangle
      pointMap["x1"] = { x: p.x1, y: p.y1 }
      pointMap["x2"] = { x: p.x2, y: p.y2 }
      pointMap["x3"] = { x: p.x3, y: p.y3 }
    } else if (simulation === "square") {
      const p = currentParams as typeof parameters.square
      pointMap["x1"] = { x: p.x1, y: p.y1 }
      pointMap["x2"] = { x: p.x2, y: p.y2 }
    }

    for (const [key, point] of Object.entries(pointMap)) {
      const pointPixelX = centerX + point.x * scale
      const pointPixelY = centerY - point.y * scale

      const distance = Math.sqrt(Math.pow(pixelX - pointPixelX, 2) + Math.pow(pixelY - pointPixelY, 2))
      if (distance <= threshold) {
        return key
      }
    }

    return null
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const pixelX = e.clientX - rect.left
    const pixelY = e.clientY - rect.top

    // Check for point dragging first
    const pointKey = getPointAtCoords(pixelX, pixelY)
    if (pointKey && !pointMode && e.button === 0) {
      setDragState({
        isDragging: true,
        draggedPoint: pointKey,
        startPos: { x: pixelX, y: pixelY },
      })
      canvasRef.current.style.cursor = "grabbing"
      return
    }

    // Enable panning on any empty space with left click or right click
    if (e.button === 2 || e.button === 0) {
      setIsPanning(true)
      setPanStart({ x: e.clientX - panX, y: e.clientY - panY })
      canvasRef.current.style.cursor = "grabbing"
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const pixelX = e.clientX - rect.left
    const pixelY = e.clientY - rect.top

    // Handle point dragging
    if (dragState.isDragging && dragState.draggedPoint) {
      const coords = pixelToCanvasCoords(pixelX, pixelY)
      const newParams = { ...parameters }
      const simParams = newParams[simulation as keyof typeof parameters] as any

      const pointKey = dragState.draggedPoint
      if (
        pointKey.startsWith("x") ||
        pointKey.startsWith("y") ||
        pointKey === "centerX" ||
        pointKey === "centerY" ||
        pointKey === "radius"
      ) {
        if (pointKey === "radius") {
          // For radius, calculate distance from center
          const p = simParams as typeof parameters.circle
          const dist = Math.sqrt(Math.pow(coords.x - p.centerX, 2) + Math.pow(coords.y - p.centerY, 2))
          simParams.radius = Math.max(0.1, Math.round(dist * 100) / 100)
        } else if (pointKey === "centerX") {
          simParams.centerX = Math.round(coords.x * 100) / 100
        } else if (pointKey === "centerY") {
          simParams.centerY = Math.round(coords.y * 100) / 100
        } else {
          simParams[pointKey] = Math.round(coords.x * 100) / 100 // For x1, x2, x3
          if (pointKey.includes("y")) {
            simParams[pointKey] = Math.round(coords.y * 100) / 100
          }
        }
      }
      setParameters(newParams)
      return
    }

    // Handle panning
    if (isPanning) {
      setPanX(e.clientX - panStart.x)
      setPanY(e.clientY - panStart.y)
      canvasRef.current.style.cursor = "grabbing"
      return
    }

    // Visual feedback for hoverable points
    const pointKey = getPointAtCoords(pixelX, pixelY)
    if (pointKey && !pointMode) {
      canvasRef.current.style.cursor = "grab"
    } else {
      canvasRef.current.style.cursor = pointMode ? "crosshair" : "default"
    }
  }

  const handleMouseUp = () => {
    setDragState({ isDragging: false, draggedPoint: null, startPos: { x: 0, y: 0 } })
    setIsPanning(false)
    if (canvasRef.current) {
      canvasRef.current.style.cursor = "default"
    }
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!pointMode || !canvasRef.current || isPanning) return

    const rect = canvasRef.current.getBoundingClientRect()
    const pixelX = e.clientX - rect.left
    const pixelY = e.clientY - rect.top

    const centerX = canvasRef.current.width / 2
    const centerY = canvasRef.current.height / 2
    const scale = 40 * zoom

    const x = Math.round(((pixelX - centerX - panX) / scale) * 100) / 100
    const y = Math.round(((centerY - panY - pixelY) / scale) * 100) / 100

    setCustomPoints([...customPoints, { x, y }])
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2 + panX
    const centerY = height / 2 + panY
    const scale = 40 * zoom

    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, width, height)

    ctx.strokeStyle = "#e0e7ff"
    ctx.lineWidth = 1
    const gridSpacing = scale
    for (let x = -width; x < width * 2; x += gridSpacing) {
      ctx.beginPath()
      ctx.moveTo(centerX + x, 0)
      ctx.lineTo(centerX + x, height)
      ctx.stroke()
    }
    for (let y = -height; y < height * 2; y += gridSpacing) {
      ctx.beginPath()
      ctx.moveTo(0, centerY + y)
      ctx.lineTo(width, centerY + y)
      ctx.stroke()
    }

    ctx.strokeStyle = "#1e293b"
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(centerX, 0)
    ctx.lineTo(centerX, height)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(0, centerY)
    ctx.lineTo(width, centerY)
    ctx.stroke()

    ctx.fillStyle = "#334155"
    ctx.font = `bold ${12 * zoom}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
    const labelStep = Math.ceil(1 / zoom)
    for (let i = -20; i <= 20; i++) {
      if (i % labelStep === 0 && i !== 0) {
        ctx.textAlign = "center"
        ctx.textBaseline = "top"
        ctx.fillText(i.toString(), centerX + i * scale, centerY + 8)
      }
    }

    ctx.textAlign = "right"
    ctx.textBaseline = "middle"
    for (let i = -20; i <= 20; i++) {
      if (i % labelStep === 0 && i !== 0) {
        ctx.fillText(i.toString(), centerX - 12, centerY - i * scale)
      }
    }

    ctx.fillStyle = "#1e293b"
    ctx.font = `bold ${14 * zoom}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
    ctx.textAlign = "right"
    ctx.textBaseline = "top"
    ctx.fillText("O", centerX - 8, centerY + 5)

    const params = parameters[simulation as keyof typeof parameters]
    const pointsToPlot: Array<{
      x: number
      y: number
      label: string
      color: string
    }> = []

    const newData: Record<string, number | string> = {}

    if (simulation === "linear") {
      const p = params as typeof parameters.linear
      ctx.strokeStyle = "#6366f1"
      ctx.lineWidth = 3
      ctx.beginPath()

      let started = false
      for (let pixelX = -width; pixelX < width * 2; pixelX++) {
        const x = (pixelX - centerX) / scale
        const y = p.slope * x + p.intercept
        const pixelY = centerY - y * scale

        if (isFinite(pixelY)) {
          if (!started) {
            ctx.moveTo(pixelX, pixelY)
            started = true
          } else {
            ctx.lineTo(pixelX, pixelY)
          }
        }
      }
      ctx.stroke()

      if (xInput && calculatedY !== null && isFinite(calculatedY)) {
        const xVal = Number.parseFloat(xInput)
        const pixelXVal = centerX + xVal * scale
        const pixelYVal = centerY - calculatedY * scale

        if (pixelXVal > 0 && pixelXVal < width && pixelYVal > 0 && pixelYVal < height) {
          ctx.fillStyle = "#22c55e"
          ctx.beginPath()
          ctx.arc(pixelXVal, pixelYVal, 8, 0, 2 * Math.PI)
          ctx.fill()

          ctx.strokeStyle = "#ffffff"
          ctx.lineWidth = 3
          ctx.beginPath()
          ctx.arc(pixelXVal, pixelYVal, 8, 0, 2 * Math.PI)
          ctx.stroke()

          ctx.fillStyle = "#15803d"
          ctx.font = `bold ${12 * zoom}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
          ctx.textAlign = "center"
          ctx.fillText(`(${xVal.toFixed(2)}, ${calculatedY.toFixed(2)})`, pixelXVal, pixelYVal - 20)
        }
      }

      for (let x = -10 / zoom; x <= 10 / zoom; x += 0.5) {
        const y = p.slope * x + p.intercept
        pointsToPlot.push({
          x,
          y,
          label: `(${x.toFixed(1)}, ${y.toFixed(2)})`,
          color: "#6366f1",
        })
      }

      newData["Slope (m)"] = p.slope
      newData["Y-Intercept (c)"] = p.intercept
    } else if (simulation === "quadratic") {
      const p = params as typeof parameters.quadratic
      ctx.strokeStyle = "#0ea5e9"
      ctx.lineWidth = 3
      ctx.beginPath()

      let started = false
      for (let pixelX = -width; pixelX < width * 2; pixelX++) {
        const x = (pixelX - centerX) / scale
        const y = p.a * x * x + p.b * x + p.c
        const pixelY = centerY - y * scale

        if (isFinite(pixelY) && Math.abs(y) < 1000) {
          if (!started) {
            ctx.moveTo(pixelX, pixelY)
            started = true
          } else {
            ctx.lineTo(pixelX, pixelY)
          }
        }
      }
      ctx.stroke()

      if (xInput && calculatedY !== null && isFinite(calculatedY)) {
        const xVal = Number.parseFloat(xInput)
        const pixelXVal = centerX + xVal * scale
        const pixelYVal = centerY - calculatedY * scale

        if (pixelXVal > 0 && pixelXVal < width && pixelYVal > 0 && pixelYVal < height) {
          ctx.fillStyle = "#22c55e"
          ctx.beginPath()
          ctx.arc(pixelXVal, pixelYVal, 8, 0, 2 * Math.PI)
          ctx.fill()

          ctx.strokeStyle = "#ffffff"
          ctx.lineWidth = 3
          ctx.beginPath()
          ctx.arc(pixelXVal, pixelYVal, 8, 0, 2 * Math.PI)
          ctx.stroke()

          ctx.fillStyle = "#15803d"
          ctx.font = `bold ${12 * zoom}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
          ctx.textAlign = "center"
          ctx.fillText(`(${xVal.toFixed(2)}, ${calculatedY.toFixed(2)})`, pixelXVal, pixelYVal - 20)
        }
      }

      for (let x = -10 / zoom; x <= 10 / zoom; x += 0.5) {
        const y = p.a * x * x + p.b * x + p.c
        if (Math.abs(y) < 100) {
          pointsToPlot.push({
            x,
            y,
            label: `(${x.toFixed(1)}, ${y.toFixed(2)})`,
            color: "#0ea5e9",
          })
        }
      }

      newData["Coefficient a"] = p.a
      newData["Coefficient b"] = p.b
      newData["Coefficient c"] = p.c
    } else if (simulation === "exponential") {
      const p = params as typeof parameters.exponential
      ctx.strokeStyle = "#ec4899"
      ctx.lineWidth = 3
      ctx.beginPath()

      let started = false
      for (let pixelX = -width; pixelX < width * 2; pixelX++) {
        const x = (pixelX - centerX) / scale
        const y = p.scale * Math.pow(p.base, Math.min(x, 5))

        if (isFinite(y) && Math.abs(y) < 1000) {
          const pixelY = centerY - y * scale
          if (isFinite(pixelY)) {
            if (!started) {
              ctx.moveTo(pixelX, pixelY)
              started = true
            } else {
              ctx.lineTo(pixelX, pixelY)
            }
          }
        }
      }
      ctx.stroke()

      if (xInput && calculatedY !== null && isFinite(calculatedY)) {
        const xVal = Number.parseFloat(xInput)
        const pixelXVal = centerX + xVal * scale
        const pixelYVal = centerY - calculatedY * scale

        if (pixelXVal > 0 && pixelXVal < width && pixelYVal > 0 && pixelYVal < height) {
          ctx.fillStyle = "#22c55e"
          ctx.beginPath()
          ctx.arc(pixelXVal, pixelYVal, 8, 0, 2 * Math.PI)
          ctx.fill()

          ctx.strokeStyle = "#ffffff"
          ctx.lineWidth = 3
          ctx.beginPath()
          ctx.arc(pixelXVal, pixelYVal, 8, 0, 2 * Math.PI)
          ctx.stroke()

          ctx.fillStyle = "#15803d"
          ctx.font = `bold ${12 * zoom}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
          ctx.textAlign = "center"
          ctx.fillText(`(${xVal.toFixed(2)}, ${calculatedY.toFixed(2)})`, pixelXVal, pixelYVal - 20)
        }
      }

      for (let x = -3; x <= 3; x += 0.5) {
        const y = p.scale * Math.pow(p.base, x)
        if (isFinite(y) && Math.abs(y) < 100) {
          pointsToPlot.push({
            x,
            y,
            label: `(${x.toFixed(1)}, ${y.toFixed(2)})`,
            color: "#ec4899",
          })
        }
      }

      newData["Base"] = p.base
      newData["Scale"] = p.scale
    } else if (simulation === "gradient") {
      const p = params as typeof parameters.gradient
      const x1Pixel = centerX + p.x1 * scale
      const y1Pixel = centerY - p.y1 * scale
      const x2Pixel = centerX + p.x2 * scale
      const y2Pixel = centerY - p.y2 * scale

      ctx.strokeStyle = "#10b981"
      ctx.lineWidth = 3
      ctx.beginPath()

      const slope = (p.y2 - p.y1) / (p.x2 - p.x1 + 0.0001)
      const intercept = p.y1 - slope * p.x1

      for (let pixelX = -width; pixelX < width * 2; pixelX++) {
        const x = (pixelX - centerX) / scale
        const y = slope * x + intercept
        const pixelY = centerY - y * scale

        if (pixelX === 0 || isNaN(pixelY)) {
          ctx.moveTo(pixelX, pixelY)
        } else {
          ctx.lineTo(pixelX, pixelY)
        }
      }
      ctx.stroke()

      ctx.strokeStyle = "#059669"
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(x1Pixel, y1Pixel)
      ctx.lineTo(x2Pixel, y1Pixel)
      ctx.lineTo(x2Pixel, y2Pixel)
      ctx.stroke()
      ctx.setLineDash([])

      newData["Slope (m)"] = Number(slope.toFixed(2))
      newData["Rise"] = Number((p.y2 - p.y1).toFixed(2))
      newData["Run"] = Number((p.x2 - p.x1).toFixed(2))
      newData["Equation"] = `y = ${slope.toFixed(2)}x + ${intercept.toFixed(2)}`

      pointsToPlot.push({
        x: p.x1,
        y: p.y1,
        label: `(${p.x1}, ${p.y1})`,
        color: "#10b981",
      })
      pointsToPlot.push({
        x: p.x2,
        y: p.y2,
        label: `(${p.x2}, ${p.y2})`,
        color: "#10b981",
      })
    } else if (simulation === "distance") {
      const p = params as typeof parameters.distance
      const x1Pixel = centerX + p.x1 * scale
      const y1Pixel = centerY - p.y1 * scale
      const x2Pixel = centerX + p.x2 * scale
      const y2Pixel = centerY - p.y2 * scale

      ctx.strokeStyle = "#3b82f6"
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(x1Pixel, y1Pixel)
      ctx.lineTo(x2Pixel, y2Pixel)
      ctx.stroke()

      const distance = Math.sqrt(Math.pow(p.x2 - p.x1, 2) + Math.pow(p.y2 - p.y1, 2))
      const midX = (x1Pixel + x2Pixel) / 2
      const midY = (y1Pixel + y2Pixel) / 2

      ctx.fillStyle = "#1e40af"
      ctx.font = `bold ${14 * zoom}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
      ctx.textAlign = "center"
      ctx.fillText(`d = ${distance.toFixed(2)}`, midX, midY - 20)

      newData["Distance"] = Number(distance.toFixed(2))
      newData["ΔX"] = Number((p.x2 - p.x1).toFixed(2))
      newData["ΔY"] = Number((p.y2 - p.y1).toFixed(2))

      pointsToPlot.push({
        x: p.x1,
        y: p.y1,
        label: `A(${p.x1}, ${p.y1})`,
        color: "#3b82f6",
      })
      pointsToPlot.push({
        x: p.x2,
        y: p.y2,
        label: `B(${p.x2}, ${p.y2})`,
        color: "#3b82f6",
      })
    } else if (simulation === "circle") {
      const p = params as typeof parameters.circle
      const centerPixelX = centerX + p.centerX * scale
      const centerPixelY = centerY - p.centerY * scale
      const radiusPixel = p.radius * scale

      ctx.strokeStyle = "#f97316"
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(centerPixelX, centerPixelY, radiusPixel, 0, 2 * Math.PI)
      ctx.stroke()

      const circumference = 2 * Math.PI * p.radius
      const area = Math.PI * p.radius * p.radius

      ctx.fillStyle = "#9a3412"
      ctx.font = `bold ${13 * zoom}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
      ctx.textAlign = "left"
      ctx.fillText(`r = ${p.radius.toFixed(2)}`, 15, 30)

      newData["Radius"] = p.radius
      newData["Diameter"] = Number((p.radius * 2).toFixed(2))
      newData["Circumference"] = Number(circumference.toFixed(2))
      newData["Area"] = Number(area.toFixed(2))

      pointsToPlot.push({
        x: p.centerX,
        y: p.centerY,
        label: `Center`,
        color: "#f97316",
      })
    } else if (simulation === "triangle") {
      const p = params as typeof parameters.triangle
      const x1Pixel = centerX + p.x1 * scale
      const y1Pixel = centerY - p.y1 * scale
      const x2Pixel = centerX + p.x2 * scale
      const y2Pixel = centerY - p.y2 * scale
      const x3Pixel = centerX + p.x3 * scale
      const y3Pixel = centerY - p.y3 * scale

      ctx.strokeStyle = "#6366f1"
      ctx.fillStyle = "#6366f130"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(x1Pixel, y1Pixel)
      ctx.lineTo(x2Pixel, y2Pixel)
      ctx.lineTo(x3Pixel, y3Pixel)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()

      const area = Math.abs((p.x2 - p.x1) * (p.y3 - p.y1) - (p.x3 - p.x1) * (p.y2 - p.y1)) / 2
      const side1 = Math.sqrt(Math.pow(p.x2 - p.x1, 2) + Math.pow(p.y2 - p.y1, 2))
      const side2 = Math.sqrt(Math.pow(p.x3 - p.x2, 2) + Math.pow(p.y3 - p.y2, 2))
      const side3 = Math.sqrt(Math.pow(p.x1 - p.x3, 2) + Math.pow(p.y1 - p.y3, 2))
      const perimeter = side1 + side2 + side3

      ctx.fillStyle = "#4f46e5"
      ctx.font = `bold ${12 * zoom}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
      ctx.textAlign = "left"
      ctx.fillText(`A: ${area.toFixed(2)} | P: ${perimeter.toFixed(2)}`, 15, 30)

      newData["Area"] = Number(area.toFixed(2))
      newData["Perimeter"] = Number(perimeter.toFixed(2))
      newData["Side 1"] = Number(side1.toFixed(2))
      newData["Side 2"] = Number(side2.toFixed(2))
      newData["Side 3"] = Number(side3.toFixed(2))

      pointsToPlot.push({
        x: p.x1,
        y: p.y1,
        label: `(${p.x1}, ${p.y1})`,
        color: "#6366f1",
      })
      pointsToPlot.push({
        x: p.x2,
        y: p.y2,
        label: `(${p.x2}, ${p.y2})`,
        color: "#6366f1",
      })
      pointsToPlot.push({
        x: p.x3,
        y: p.y3,
        label: `(${p.x3}, ${p.y3})`,
        color: "#6366f1",
      })
    } else if (simulation === "square") {
      const p = params as typeof parameters.square
      const x1Pixel = centerX + p.x1 * scale
      const y1Pixel = centerY - p.y1 * scale
      const x2Pixel = centerX + p.x2 * scale
      const y2Pixel = centerY - p.y2 * scale

      ctx.strokeStyle = "#8b5cf6"
      ctx.fillStyle = "#8b5cf630"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(x1Pixel, y1Pixel)
      ctx.lineTo(x2Pixel, y1Pixel)
      ctx.lineTo(x2Pixel, y2Pixel)
      ctx.lineTo(x1Pixel, y2Pixel)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()

      const width = Math.abs(p.x2 - p.x1)
      const height = Math.abs(p.y2 - p.y1)
      const area = width * height
      const perimeter = 2 * (width + height)

      ctx.fillStyle = "#6b21a8"
      ctx.font = `bold ${12 * zoom}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
      ctx.textAlign = "left"
      ctx.fillText(`A: ${area.toFixed(2)} | P: ${perimeter.toFixed(2)}`, 15, 30)

      newData["Width"] = Number(width.toFixed(2))
      newData["Height"] = Number(height.toFixed(2))
      newData["Area"] = Number(area.toFixed(2))
      newData["Perimeter"] = Number(perimeter.toFixed(2))

      pointsToPlot.push({
        x: p.x1,
        y: p.y1,
        label: `(${p.x1}, ${p.y1})`,
        color: "#8b5cf6",
      })
      pointsToPlot.push({
        x: p.x2,
        y: p.y2,
        label: `(${p.x2}, ${p.y2})`,
        color: "#8b5cf6",
      })
    }

    customPoints.forEach((point) => {
      const pixelX = centerX + point.x * scale
      const pixelY = centerY - point.y * scale

      if (pixelX > 0 && pixelX < width && pixelY > 0 && pixelY < height) {
        ctx.fillStyle = "#ff6b6b"
        ctx.beginPath()
        ctx.arc(pixelX, pixelY, 7, 0, 2 * Math.PI)
        ctx.fill()

        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = 2.5
        ctx.beginPath()
        ctx.arc(pixelX, pixelY, 7, 0, 2 * Math.PI)
        ctx.stroke()

        ctx.fillStyle = "#ff6b6b"
        ctx.font = `bold ${11 * zoom}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
        ctx.textAlign = "left"
        ctx.fillText(`(${point.x.toFixed(2)}, ${point.y.toFixed(2)})`, pixelX + 12, pixelY - 8)
      }
    })

    if (pointsToPlot.length > 0) {
      pointsToPlot.forEach((point) => {
        const pixelX = centerX + point.x * scale
        const pixelY = centerY - point.y * scale

        if (pixelX > 0 && pixelX < width && pixelY > 0 && pixelY < height) {
          ctx.fillStyle = point.color
          ctx.beginPath()
          ctx.arc(pixelX, pixelY, 5, 0, 2 * Math.PI)
          ctx.fill()

          ctx.strokeStyle = "#ffffff"
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(pixelX, pixelY, 5, 0, 2 * Math.PI)
          ctx.stroke()

          ctx.fillStyle = point.color
          ctx.font = `bold ${11 * zoom}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
          ctx.textAlign = "left"
          ctx.fillText(point.label, pixelX + 10, pixelY - 8)
        }
      })
    }

    setData(newData)
  }, [simulation, parameters, zoom, panX, panY, customPoints, xInput, calculatedY])

  const getParameterLabel = (key: string, language: "en" | "bn"): string => {
    const labels: Record<string, { en: string; bn: string }> = {
      slope: { en: "Slope (m)", bn: "ঢাল (m)" },
      intercept: { en: "Y-Intercept (c)", bn: "Y-অন্তঃছেদ (c)" },
      a: { en: "Coefficient a", bn: "সহগ a" },
      b: { en: "Coefficient b", bn: "সহগ b" },
      c: { en: "Coefficient c", bn: "সহগ c" },
      base: { en: "Base (b)", bn: "ভিত্তি (b)" },
      scale: { en: "Scale (k)", bn: "স্কেল (k)" },
      x1: { en: "X₁", bn: "X₁" },
      y1: { en: "Y₁", bn: "Y₁" },
      x2: { en: "X₂", bn: "X₂" },
      y2: { en: "Y₂", bn: "Y₂" },
      x3: { en: "X₃", bn: "X₃" },
      y3: { en: "Y₃", bn: "Y₃" },
      centerX: { en: "Center X", bn: "কেন্দ্র X" },
      centerY: { en: "Center Y", bn: "কেন্দ্র Y" },
      radius: { en: "Radius (r)", bn: "ব্যাসার্ধ (r)" },
    }
    return labels[key]?.[language] || key
  }

  const currentParams = parameters[simulation as keyof typeof parameters]
  // Sidebar resize state and handlers
  const [sidebarWidth, setSidebarWidth] = useState<number>(360)
  const sidebarRef = useRef<HTMLDivElement | null>(null)
  const isResizingRef = useRef(false)

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isResizingRef.current) return
      const container = sidebarRef.current?.parentElement
      if (!container) return
      const rect = container.getBoundingClientRect()
      // Sidebar is on the left: width = cursorX - rect.left
      const newWidth = Math.max(240, Math.min(900, e.clientX - rect.left))
      setSidebarWidth(newWidth)
    }

    const onMouseUp = () => {
      if (isResizingRef.current) {
        isResizingRef.current = false
        document.body.style.cursor = ''
      }
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault()
    isResizingRef.current = true
    document.body.style.cursor = 'col-resize'
  }

  return (
      <div className="flex h-full w-full bg-white">
      {/* Left sidebar (resizable) */}
      <div
        ref={sidebarRef}
        className="h-full bg-white border-r border-slate-200 overflow-auto"
        style={{ width: sidebarWidth }}
      >
        <div className="p-4 space-y-4">
          {/* Data Display (moved into sidebar) */}
          <div className="bg-white/98 backdrop-blur-md rounded-xl shadow p-3 border border-blue-200 max-h-56 overflow-auto">
            <h4 className="font-bold text-slate-900 mb-2 text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              {language === 'en' ? 'Data' : 'ডেটা'}
            </h4>
            <div className="space-y-2 text-sm">
              {Object.keys(data).length === 0 ? (
                <div className="text-sm text-slate-500">{language === 'en' ? 'No data' : 'ডেটা নেই'}</div>
              ) : (
                Object.entries(data).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center gap-2 pb-2 border-b border-slate-100 last:border-0 last:pb-0">
                    <span className="font-medium text-slate-600">{key}</span>
                    <span className="text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded truncate">{value}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Formula */}
          <div className="p-3 bg-white rounded-lg border-2 border-blue-300 shadow-md">
            <h3 className="text-sm font-bold text-blue-900 mb-2">{language === 'en' ? 'Formula' : 'সুত্র'}</h3>
            <p className="text-base font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600 font-mono">{getFormula(simulation)}</p>
            <div className="mt-3 space-y-1 bg-blue-50 rounded p-2 hidden sm:block">
              {Object.entries(inputValues).slice(0, 2).map(([key, value]) => (
                <div key={key} className="text-sm flex justify-between">
                  <span className="text-slate-700 font-medium">{getParameterLabel(key, language)}:</span>
                  <span className="text-blue-700 font-bold">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Variables */}
          <div className="text-sm">
            <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">{language === 'en' ? 'Variables' : 'চলক'}</h3>
            <div className="space-y-2">
              {['linear', 'quadratic', 'exponential'].includes(simulation) && (
                <div>
                  <label className="text-sm font-bold text-slate-700 block">X</label>
                  <input
                    type="number"
                    value={xInput}
                    onChange={(e) => setXInput(e.target.value)}
                    step="0.1"
                    className="w-full px-2 py-1 border border-emerald-300 rounded text-sm font-bold text-emerald-700 bg-emerald-50"
                  />
                  {calculatedY !== null && <div className="text-sm bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded mt-1">Y = {calculatedY}</div>}
                </div>
              )}
            </div>
          </div>

          {/* X/Y Table */}
          <div className="bg-white rounded-lg border-2 border-amber-300 shadow-md p-3 max-h-40 overflow-auto">
            <h3 className="text-sm font-bold text-amber-900 mb-2">X/Y</h3>
            <table className="w-full text-sm">
              <tbody>
                {tableValues.slice(0, 20).map((row, idx) => (
                  <tr key={idx} className="border-b border-amber-100">
                    <td className="text-amber-800 font-mono">{row.x}</td>
                    <td className="text-right text-amber-700 font-bold">{row.y}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Adjust / Sliders */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-2">{language === 'en' ? 'Adjust' : 'সমন্বয়'}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
              {Object.entries(inputValues).slice(0, 8).map(([key]) => (
                <div key={key} className="space-y-1">
                  <span className="text-sm text-slate-600 font-medium block truncate">{getParameterLabel(key, language)}</span>
                  <input
                    type="range"
                    min={key === 'base' ? '1.1' : '-20'}
                    max={key === 'base' ? '10' : '20'}
                    step="0.05"
                    value={inputValues[key]}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    className="w-full h-1.5 sm:h-2 bg-linear-to-r from-purple-300 to-blue-300 rounded"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Resizer */}
      <div
        onMouseDown={startResizing}
        role="separator"
        aria-orientation="vertical"
        className="w-2 cursor-col-resize hover:bg-slate-100"
        style={{ zIndex: 50 }}
      />

      {/* Canvas area (right) */}
      <div className="flex-1 relative bg-white overflow-hidden">
        <canvas
          ref={canvasRef}
          width={1600}
          height={800}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          onClick={handleCanvasClick}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />

        {/* Zoom Info */}
        <div className="absolute bottom-3 left-3 sm:bottom-6 sm:left-6 bg-linear-to-r from-slate-800 to-slate-900 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-xl text-xs font-mono shadow-lg border border-slate-700 backdrop-blur-sm">
          <div className="flex gap-2 flex-wrap">
            <span>🔍 {zoom.toFixed(1)}x</span>
            <span className="hidden sm:inline">Scroll zoom</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function getFormula(simulation: string): string {
  const formulas: Record<string, string> = {
    linear: "f(x) = mx + c",
    quadratic: "f(x) = ax² + bx + c",
    exponential: "f(x) = k · bˣ",
    gradient: "m = (y₂ - y₁)/(x₂ - x₁)",
    distance: "d = √[(x₂-x₁)² + (y₂-y₁)²]",
    circle: "x² + y² = r²",
    triangle: "Area = ½|x₁(y₂-y₃) + x₂(y₃-y₁) + x₃(y₁-y₂)|",
    square: "Area = length × width",
  }
  return formulas[simulation] || "Formula"
}
