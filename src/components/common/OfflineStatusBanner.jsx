import React, { useState, useEffect } from "react";
import { WifiOff, Database, CheckCircle2, X } from "lucide-react";
import { useApp } from "../../store/AppContext";
import { getCacheStatistics } from "../../registerServiceWorker";

export default function OfflineStatusBanner() {
  const { isOnline } = useApp();
  const [cacheStats, setCacheStats] = useState(null);
  const [warmMessage, setWarmMessage] = useState("");

  useEffect(() => {
    getCacheStatistics().then((stats) => {
      setCacheStats(stats);
    });
  }, [isOnline]);

  if (isOnline && !warmMessage) return null;

  return (
    <aside aria-label="Network status and cache indicator" className="relative z-40">
      {!isOnline ? (
        <div className="bg-amber-600 text-white px-4 py-2.5 text-xs shadow-md border-b border-amber-700 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="p-1 bg-amber-700/80 rounded-md">
              <WifiOff className="w-4 h-4 animate-pulse" />
            </span>
            <div>
              <span className="font-bold">Offline Mode Active:</span>{" "}
              <span>
                Internet connectivity is disconnected. Agricultural market prices, historical Recharts curves, and UI assets are being served securely from the Service Worker Cache API.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] bg-amber-700/60 px-2.5 py-1 rounded-md">
            <Database className="w-3 h-3" />
            <span>
              {cacheStats?.totalEntries ? `${cacheStats.totalEntries} entries cached` : "Cache API Active"}
            </span>
          </div>
        </div>
      ) : warmMessage ? (
        <div className="bg-emerald-700 text-white px-4 py-1.5 text-xs shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
            <span className="font-medium">{warmMessage}</span>
          </div>
          <button
            onClick={() => setWarmMessage("")}
            className="text-white/80 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : null}
    </aside>
  );
}
