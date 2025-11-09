"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

/**
 * Aggressively prefetches all important routes in the background
 * Makes subsequent navigation instant
 */
export default function RoutePrefetcher() {
  const router = useRouter()

  useEffect(() => {
    // Wait for initial page load to complete
    if (typeof window === "undefined") return

    const prefetchRoutes = () => {
      // Core subject routes - high priority
      const highPriorityRoutes = [
        "/physics",
        "/chemistry",
        "/biology",
        "/math",
        "/ict",
      ]

      // Topic routes - medium priority
      const mediumPriorityRoutes = [
        "/biology/cells",
        "/biology/genetics",
        "/biology/ecology",
        "/biology/anatomy",
        "/chemistry/atoms",
        "/chemistry/molecules",
        "/chemistry/periodic-table",
        "/physics/mechanics",
        "/math/graphs",
        "/ict/programming",
      ]

      // Prefetch high priority routes immediately
      highPriorityRoutes.forEach((route) => {
        router.prefetch(route)
      })

      // Prefetch medium priority routes after a short delay
      setTimeout(() => {
        mediumPriorityRoutes.forEach((route) => {
          router.prefetch(route)
        })
      }, 2000)
    }

    // Start prefetching after page is fully loaded
    if (document.readyState === "complete") {
      prefetchRoutes()
    } else {
      window.addEventListener("load", prefetchRoutes)
      return () => window.removeEventListener("load", prefetchRoutes)
    }
  }, [router])

  return null
}
