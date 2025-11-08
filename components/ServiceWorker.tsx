"use client"

import { useEffect } from 'react'

export default function ServiceWorker() {
  useEffect(() => {
    // Disable service worker in development
    if (typeof window !== "undefined") {
      window.addEventListener("load", async () => {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          registration.unregister();
          console.log("Service worker unregistered:", registration);
        }
        // Also clear all caches
        if ('caches' in window) {
          const names = await caches.keys();
          await Promise.all(names.map(name => caches.delete(name)));
          console.log("Caches cleared");
        }
      });
    }
  }, [])

  return null
}