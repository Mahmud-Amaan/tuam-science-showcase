export function disableServiceWorker() {
  if (typeof window !== "undefined" && 'serviceWorker' in navigator) {
    window.addEventListener("load", async () => {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
        console.log("Service worker unregistered:", registration);
      }

      if ('caches' in window) {
        const names = await caches.keys();
        await Promise.all(names.map(name => caches.delete(name)));
        console.log("Caches cleared");
      }
    });
  }
}
