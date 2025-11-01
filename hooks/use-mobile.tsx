'use client'

import { useEffect, useState } from 'react'

// Minimal, dependency-free hook used by several UI components to detect
// mobile viewport. Kept intentionally small to avoid pulling extra deps.
export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth <= breakpoint : false,
  )

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= breakpoint)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [breakpoint])

  return isMobile
}

export default useIsMobile
