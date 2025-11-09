"use client"

import { useEffect } from "react"

export function CacheReset() {
  useEffect(() => {
    if (typeof window === "undefined") return

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .getRegistrations()
        .then((registrations) => {
          registrations.forEach((registration) => {
            registration.unregister().catch(() => {
              /* ignore */
            })
          })
        })
        .catch(() => {
          /* ignore */
        })
    }

    if ("caches" in window) {
      caches
        .keys()
        .then((keys) => {
          keys.forEach((key) => {
            caches.delete(key).catch(() => {
              /* ignore */
            })
          })
        })
        .catch(() => {
          /* ignore */
        })
    }
  }, [])

  return null
}
