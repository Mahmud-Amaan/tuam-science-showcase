self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));

        await self.registration.unregister();

        const clients = await self.clients.matchAll({
          type: "window",
          includeUncontrolled: true,
        });

        for (const client of clients) {
          client.navigate(client.url);
        }
      } catch (error) {
        console.warn("Self-cleanup service worker failed:", error);
      }
    })(),
  );
});
