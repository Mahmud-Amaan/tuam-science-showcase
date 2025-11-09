"use client"

import { useEffect } from "react"

import { unregisterServiceWorkers } from "@/lib/unregister-sw"

export function ServiceWorkerCleanup() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      unregisterServiceWorkers()
    }
  }, [])

  return null
}
