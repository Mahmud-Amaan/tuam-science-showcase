'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface LiveRegionProps {
  children: React.ReactNode
  priority?: 'polite' | 'assertive'
  atomic?: boolean
  className?: string
}

export function LiveRegion({
  children,
  priority = 'polite',
  atomic = true,
  className
}: LiveRegionProps) {
  return (
    <div
      aria-live={priority}
      aria-atomic={atomic}
      className={cn(
        'sr-only', // Screen reader only
        className
      )}
    >
      {children}
    </div>
  )
}

// Hook for managing live region announcements
export function useLiveRegion() {
  const [announcements, setAnnouncements] = React.useState<string[]>([])

  const announce = React.useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    setAnnouncements(prev => [...prev, `${priority}:${message}`])
  }, [])

  // Clear announcements after they've been read
  React.useEffect(() => {
    if (announcements.length > 0) {
      const timer = setTimeout(() => {
        setAnnouncements([])
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [announcements])

  return {
    announcements,
    announce,
  }
}