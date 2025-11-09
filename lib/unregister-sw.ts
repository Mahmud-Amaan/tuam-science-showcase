export function unregisterServiceWorkers() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return
  }

  const runCleanup = async () => {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations()
      let hadRegistrations = false
      if (registrations.length > 0) {
        hadRegistrations = true
        await Promise.all(registrations.map((registration) => registration.unregister()))
      }

      if ("caches" in window) {
        const cacheNames = await caches.keys()
        if (cacheNames.length > 0) {
          await Promise.all(cacheNames.map((name) => caches.delete(name)))
        }

        if (hadRegistrations || cacheNames.length > 0) {
          try {
            const reloadFlag = "swCleanupReloaded"
            if (sessionStorage.getItem(reloadFlag) !== "done") {
              sessionStorage.setItem(reloadFlag, "done")
              window.location.reload()
            }
          } catch (reloadError) {
            console.warn("Service worker cleanup reload skipped:", reloadError)
          }
        }
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
