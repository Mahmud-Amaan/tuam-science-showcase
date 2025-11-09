export function unregisterServiceWorkers() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return
  }

  const runCleanup = async () => {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations()
      await Promise.all(registrations.map((registration) => registration.unregister()))

      if ("caches" in window) {
        const cacheNames = await caches.keys()
        await Promise.all(cacheNames.map((name) => caches.delete(name)))
      }
    } catch (error) {
      console.warn("Failed to unregister service workers:", error)
    }
  }

  if (document.readyState === "complete") {
    void runCleanup()
  } else {
    window.addEventListener(
      "load",
      () => {
        void runCleanup()
      },
      { once: true },
    )
  }
}
