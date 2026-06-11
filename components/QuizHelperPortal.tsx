"use client"

import { useEffect, useState } from "react"
import ReactDOM from "react-dom"
import QuizHelper from "./QuizHelper"

export default function QuizHelperPortal() {
  const [mounted, setMounted] = useState(false)
  const [container, setContainer] = useState<HTMLElement | null>(null)

  useEffect(() => {
    setMounted(true)
    const el = document.createElement("div")
    el.id = "quizhelper-root"
    document.body.appendChild(el)
    setContainer(el)
    return () => {
      document.body.removeChild(el)
    }
  }, [])

  if (!mounted || !container) return null
  return ReactDOM.createPortal(<QuizHelper />, container)
}
