// Service Worker Registration and Cache API Management for Agrovision AI

export async function registerServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    console.log("[SW] Service Workers not supported in this environment");
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    });

    console.log("[SW] ServiceWorker registered with scope:", registration.scope);

    // Warm the Cache API with critical agricultural price datasets in the background
    if (navigator.onLine) {
      setTimeout(() => {
        precacheAgriculturalData();
      }, 3000);
    }

    registration.addEventListener("updatefound", () => {
      const installingWorker = registration.installing;
      if (installingWorker) {
        installingWorker.addEventListener("statechange", () => {
          if (installingWorker.state === "installed") {
            if (navigator.serviceWorker.controller) {
              console.log("[SW] New content available; please refresh.");
              window.dispatchEvent(new CustomEvent("agrovision:sw-update"));
            } else {
              console.log("[SW] Content is cached for offline use.");
              window.dispatchEvent(new CustomEvent("agrovision:sw-cached"));
            }
          }
        });
      }
    });

    return registration;
  } catch (error) {
    console.warn("[SW] ServiceWorker registration failed:", error);
    return null;
  }
}

// Warm the Cache API with key agricultural commodities for offline resilience
export async function precacheAgriculturalData() {
  if (typeof window === "undefined" || !("caches" in window)) return;

  const coreCommodities = ["Cotton", "Onion", "Soybean", "Wheat", "Maize"];
  const endpoints = [
    "/api/data-gov/mandi-prices",
    "/api/data-gov/status",
    "/api/weather/live",
    ...coreCommodities.map((c) => `/api/data-gov/historical-trends?commodity=${c}&days=30`),
  ];

  try {
    const cache = await caches.open("agrovision-data-gov-v2");
    await Promise.allSettled(
      endpoints.map(async (url) => {
        try {
          const match = await cache.match(url);
          if (!match) {
            const resp = await fetch(url);
            if (resp.ok) {
              await cache.put(url, resp);
            }
          }
        } catch {
          // Ignore individual fetch errors during background warmup
        }
      })
    );
    console.log("[SW] Agricultural price data warmed in Cache API");
  } catch (err) {
    console.warn("[SW] Failed background Cache API warmup:", err);
  }
}

// Get diagnostic cache statistics
export async function getCacheStatistics() {
  if (typeof window === "undefined" || !("caches" in window)) {
    return { supported: false, entries: 0, caches: [] };
  }

  try {
    const keys = await caches.keys();
    let totalEntries = 0;
    const details = [];

    for (const key of keys) {
      const cache = await caches.open(key);
      const requests = await cache.keys();
      totalEntries += requests.length;
      details.push({
        name: key,
        count: requests.length,
        urls: requests.map((r) => r.url),
      });
    }

    return {
      supported: true,
      totalEntries,
      caches: details,
    };
  } catch (e) {
    console.warn("Could not retrieve cache statistics:", e);
    return { supported: false, totalEntries: 0, caches: [] };
  }
}
