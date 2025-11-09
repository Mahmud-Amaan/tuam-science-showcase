"use client"

import { useEffect } from 'react'
import { disableServiceWorker } from '@/utils/disableSW'

export default function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      disableServiceWorker();
    }
  }, [])

  return null
}