"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { ComponentProps } from "react"

/**
 * Enhanced Link component that prefetches on hover for instant navigation
 * Use this for all internal links to make navigation feel instant
 */
interface InstantLinkProps extends ComponentProps<typeof Link> {
  prefetchOnHover?: boolean
}

export default function InstantLink({
  prefetchOnHover = true,
  href,
  children,
  ...props
}: InstantLinkProps) {
  const router = useRouter()

  const handleMouseEnter = () => {
    if (prefetchOnHover && typeof href === "string") {
      router.prefetch(href)
    }
  }

  const handleTouchStart = () => {
    // Also prefetch on touch devices
    if (prefetchOnHover && typeof href === "string") {
      router.prefetch(href)
    }
  }

  return (
    <Link
      href={href}
      prefetch={true}
      onMouseEnter={handleMouseEnter}
      onTouchStart={handleTouchStart}
      {...props}
    >
      {children}
    </Link>
  )
}
