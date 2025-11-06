"use client"

import { useEffect, useState } from "react"
import ReactDOM from "react-dom"
import AIHelper from "./AIHelper"

export default function AIHelperPortal() {
  const [mounted, setMounted] = useState(false)
  const [container, setContainer] = useState<HTMLElement | null>(null)

  useEffect(() => {
    setMounted(true)
    const el = document.createElement("div")
    el.id = "aihelper-root"
    document.body.appendChild(el)
    setContainer(el)
    return () => {
      document.body.removeChild(el)
    }
  }, [])

  if (!mounted || !container) return null
  return ReactDOM.createPortal(<AIHelper />, container)
}
