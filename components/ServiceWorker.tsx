"use client"

import { useEffect } from 'react'

export default function ServiceWorker() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
          .then(function(registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
          })
          .catch(function(error) {
            console.log('ServiceWorker registration failed: ', error);
          });
      });
    }
  }, [])

  return null
}