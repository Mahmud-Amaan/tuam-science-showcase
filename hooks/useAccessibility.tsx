'use client'

import { useEffect, useRef, useCallback } from 'react'

interface UseAccessibilityOptions {
  trapFocus?: boolean
  restoreFocus?: boolean
  announceOnOpen?: string
  announceOnClose?: string
  liveRegion?: boolean
}

interface UseAccessibilityReturn {
  containerRef: React.RefObject<HTMLDivElement | null>
  announce: (message: string, priority?: 'polite' | 'assertive') => void
  liveRegionRef: React.RefObject<HTMLDivElement | null>
}

export function useAccessibility(options: UseAccessibilityOptions = {}): UseAccessibilityReturn {
  const {
    trapFocus = true,
    restoreFocus = true,
    announceOnOpen,
    announceOnClose,
    liveRegion = false,
  } = options

  const containerRef = useRef<HTMLDivElement>(null)
  const liveRegionRef = useRef<HTMLDivElement>(null)
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null)
  const focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]'

  // Focus trapping logic
  const trapFocusInContainer = useCallback((event: KeyboardEvent) => {
    if (!containerRef.current) return

    const focusableElements = containerRef.current.querySelectorAll(focusableElementsString)
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    if (event.key === 'Tab') {
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus()
          event.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus()
          event.preventDefault()
        }
      }
    }

    // Handle Escape key to close modal
    if (event.key === 'Escape') {
      const closeButton = containerRef.current.querySelector('[data-slot="dialog-close"], [data-slot="sheet-close"], [data-slot="drawer-close"]') as HTMLElement
      if (closeButton) {
        closeButton.click()
      }
    }
  }, [focusableElementsString])

  // Screen reader announcement function
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!liveRegionRef.current) return

    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', priority)
    announcement.setAttribute('aria-atomic', 'true')
    announcement.style.position = 'absolute'
    announcement.style.left = '-10000px'
    announcement.style.width = '1px'
    announcement.style.height = '1px'
    announcement.style.overflow = 'hidden'

    announcement.textContent = message
    document.body.appendChild(announcement)

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }, [])

  // Setup focus trapping and announcements
  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current

    // Store previously focused element
    if (restoreFocus) {
      previouslyFocusedElementRef.current = document.activeElement as HTMLElement
    }

    // Announce modal opening
    if (announceOnOpen) {
      setTimeout(() => announce(announceOnOpen, 'assertive'), 100)
    }

    // Setup focus trapping
    if (trapFocus) {
      // Focus first focusable element or container
      const focusableElements = container.querySelectorAll(focusableElementsString)
      const firstFocusable = focusableElements[0] as HTMLElement

      setTimeout(() => {
        if (firstFocusable) {
          firstFocusable.focus()
        } else {
          container.focus()
        }
      }, 100)

      // Add event listeners
      document.addEventListener('keydown', trapFocusInContainer)
    }

    // Cleanup function
    return () => {
      document.removeEventListener('keydown', trapFocusInContainer)

      // Restore focus
      if (restoreFocus && previouslyFocusedElementRef.current instanceof HTMLElement) {
        setTimeout(() => {
          previouslyFocusedElementRef.current?.focus()
        }, 100)
      }

      // Announce modal closing
      if (announceOnClose) {
        announce(announceOnClose, 'assertive')
      }
    }
  }, [trapFocus, restoreFocus, announceOnOpen, announceOnClose, announce, trapFocusInContainer])

  // Create live region if needed
  useEffect(() => {
    if (!liveRegion || liveRegionRef.current) return

    const liveDiv = document.createElement('div')
    liveDiv.setAttribute('aria-live', 'polite')
    liveDiv.setAttribute('aria-atomic', 'true')
    liveDiv.style.position = 'absolute'
    liveDiv.style.left = '-10000px'
    liveDiv.style.width = '1px'
    liveDiv.style.height = '1px'
    liveDiv.style.overflow = 'hidden'

    document.body.appendChild(liveDiv)
    liveRegionRef.current = liveDiv

    return () => {
      if (liveRegionRef.current && document.body.contains(liveRegionRef.current)) {
        document.body.removeChild(liveRegionRef.current)
      }
    }
  }, [liveRegion])

  return {
    containerRef,
    announce,
    liveRegionRef,
  }
}