'use client'

import { useCallback, useState } from 'react'

type ToastRecord = {
  id: string
  title?: string
  description?: string
  action?: any
  [key: string]: any
}

// Minimal toast hook used by the UI. Provides an array of toasts and helpers
// to push/remove them. This is intentionally small and local — it avoids
// introducing a global context if the app doesn't already provide one.
export function useToast() {
  const [toasts, setToasts] = useState<ToastRecord[]>([])

  const push = useCallback((toast: Omit<ToastRecord, 'id'>) => {
    const id = String(Date.now() + Math.random())
    setToasts((s) => [...s, { ...toast, id }])
    return id
  }, [])

  const remove = useCallback((id: string) => {
    setToasts((s) => s.filter((t) => t.id !== id))
  }, [])

  return { toasts, push, remove }
}

export default useToast
