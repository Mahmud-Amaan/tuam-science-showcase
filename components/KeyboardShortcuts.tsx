"use client"

import { useEffect } from "react"

interface KeyboardShortcutsProps {
  language?: "en" | "bn"
  onShortcut?: (action: string) => void
}

export default function KeyboardShortcuts({ language = "en", onShortcut }: KeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle shortcuts when not typing in input fields
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) {
        return
      }

      // Common shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'h':
            e.preventDefault()
            onShortcut?.('help')
            break
          case 'r':
            e.preventDefault()
            onShortcut?.('reset')
            break
          case 'p':
            e.preventDefault()
            onShortcut?.('play-pause')
            break
          case 'l':
            e.preventDefault()
            onShortcut?.('language-toggle')
            break
        }
      }

      // Arrow keys for navigation
      if (e.key.startsWith('Arrow')) {
        // Let default behavior handle arrow key navigation
        return
      }

      // Tab navigation is handled by browser
      if (e.key === 'Tab') {
        return
      }

      // Escape key for closing modals/menus
      if (e.key === 'Escape') {
        onShortcut?.('escape')
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onShortcut])

  return null // This component doesn't render anything
}