import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocale } from "../context/LocaleContext";
import { initialCrops } from "../data/cropData";
import { marketPrices } from "../data/marketData";
import { sellingStrategies } from "../data/recommendationData";
import { marketAlerts } from "../data/alertData";
import { farmerPersonas } from "../data/farmerProfiles";
import { institutionalBuyers } from "../data/buyerData";
import {
  saveGradingRecord,
  getGradingRecords
} from "../utils/indexedDb";

const AppContext = createContext();

export const normalizeLanguageCode = (lang) => {
  const value = String(lang || "en").trim().toLowerCase();
  if (["hi", "hindi"].includes(value)) return "hi";
  if (["mr", "marathi"].includes(value)) return "mr";
  if (["gu", "gujarati", "guj"].includes(value)) return "gu";
  return "en";
};

export const getVoiceLanguage = (lang) => {
  const normalized = normalizeLanguageCode(lang);
  if (normalized === "hi") return "hi-IN";
  if (normalized === "mr") return "mr-IN";
  if (normalized === "gu") return "gu-IN";
  return "en-IN";
};

export const getPreferredSpeechVoice = (lang) => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;

  const normalized = normalizeLanguageCode(lang);
  const voices = window.speechSynthesis.getVoices?.() || [];

  const preferredLangs = {
    hi: ["hi-IN", "hi"],
    mr: ["mr-IN", "mr"],
    gu: ["gu-IN", "gu"],
    en: ["en-IN", "en-US", "en-GB", "en"],
  };

  const candidates = preferredLangs[normalized] || preferredLangs.en;

  const exact = voices.find((voice) => {
    const langCode = String(voice.lang || "").toLowerCase();
    return candidates.some((candidate) => langCode === candidate.toLowerCase());
  });

  if (exact) return exact;

  const contains = voices.find((voice) => {
    const langCode = String(voice.lang || "").toLowerCase();
    return candidates.some((candidate) => langCode.startsWith(candidate.toLowerCase().split("-")[0]));
  });

  return contains || voices[0] || null;
};

export function AppProvider({ children }) {
  // Online / Offline network state
  const [isOnline, setIsOnline] = useState(() => {
    return typeof navigator !== "undefined" && typeof navigator.onLine === "boolean"
      ? navigator.onLine
      : true;
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // System permissions state (Camera, Mic, GPS, Storage)
  const [permissions, setPermissions] = useState(() => {
    try {
      const saved = localStorage.getItem("agrovision_permissions");
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      camera: "prompt",
      microphone: "prompt",
      geolocation: "prompt",
      storage: "granted",
    };
  });

  const updatePermission = (key, status) => {
    setPermissions((prev) => {
      const updated = { ...prev, [key]: status };
      try {
        localStorage.setItem("agrovision_permissions", JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  // Centralized Locale Context Integration
  const localeCtx = useLocale();
  const {
    locale: language,
    setLocale: setLanguage,
    t,
    formatCropName,
    formatCurrency,
    formatNumber,
    formatDate,
    supportedLocales,
  } = localeCtx;

  // Live Mandi Prices from data.gov.in / Agmarknet backend API
  const [liveMandiPrices, setLiveMandiPrices] = useState(marketPrices);
  const [mandiDataSource, setMandiDataSource] = useState("Agmarknet Realtime");
  const [isLoadingMandi, setIsLoadingMandi] = useState(false);

  const refreshMandiPrices = async () => {
    setIsLoadingMandi(true);
    try {
      const res = await fetch("/api/data-gov/mandi-prices");
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.records) && data.records.length > 0) {
          setLiveMandiPrices(data.records);
          setMandiDataSource(data.source || "data.gov.in / Agmarknet");
        }
      }
    } catch (err) {
      console.warn("Could not fetch live mandi prices, using local registry cache:", err);
    } finally {
      setIsLoadingMandi(false);
    }
  };

  // Live Weather from Open-Meteo & IMD Agromet backend API
  const [liveWeather, setLiveWeather] = useState({
    location: "Anand, Gujarat",
    temperature: 29,
    humidity: 74,
    rainProbability: 16,
    windSpeed: 13,
    safeHoldingDays: 10,
    harvestDecision: "MONITOR: Moderate humidity. Complete morning harvesting and avoid damp overnight field exposure.",
    weatherCondition: "Partly Cloudy",
    source: "Open-Meteo & IMD Agromet",
  });

  const refreshWeather = async () => {
    try {
      const res = await fetch("/api/weather/live");
      if (res.ok) {
        const data = await res.json();
        if (data && data.success) {
          setLiveWeather(data);
        }
      }
    } catch (err) {
      console.warn("Could not fetch live weather, using local agromet fallback:", err);
    }
  };

  useEffect(() => {
    refreshMandiPrices();
    refreshWeather();
  }, []);

  // ── User Registry Helpers (persistent per-device real accounts) ──────────
  const getUserRegistry = () => {
    try {
      const raw = localStorage.getItem("agrovision_user_registry");
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  };

  const saveUserToRegistry = (farmer) => {
    try {
      const registry = getUserRegistry();
      const idx = registry.findIndex(
        (u) => u.phone?.replace(/\D/g, "") === farmer.phone?.replace(/\D/g, "")
      );
      if (idx >= 0) registry[idx] = { ...registry[idx], ...farmer };
      else registry.push(farmer);
      localStorage.setItem("agrovision_user_registry", JSON.stringify(registry));
    } catch { /* ignore */ }
  };

  const findUserByMobile = (mobile) => {
    const norm = mobile.replace(/\D/g, "");
    const registry = getUserRegistry();
    return registry.find((u) => u.phone?.replace(/\D/g, "") === norm) || null;
  };

  // ── Farmer Authentication & Profile State ────────────────────────────────
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("agrovision_user");
      if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const saved = localStorage.getItem("agrovision_auth");
      return saved !== null ? JSON.parse(saved) : false;
    } catch { return false; }
  });

  // Demo login (persona)
  const loginWithPersona = (personaId) => {
    const persona = farmerPersonas.find((p) => p.id === personaId) || farmerPersonas[0];
    setCurrentUser(persona);
    setActiveCropId(persona.activeCropId || "crop-1");
    setIsAuthenticated(true);
    try {
      localStorage.setItem("agrovision_user", JSON.stringify(persona));
      localStorage.setItem("agrovision_auth", JSON.stringify(true));
    } catch { /* ignore */ }
  };

  // Real login: returns { success, error, user }
  const loginWithOtp = (mobile, password) => {
    const normalizedMobile = mobile.replace(/\D/g, "");

    // 1. Check real user registry first
    const registeredUser = findUserByMobile(normalizedMobile);
    if (registeredUser) {
      if (registeredUser.password && password && registeredUser.password !== password) {
        return { success: false, error: "Wrong password. Please try again." };
      }
      const userCrops = (() => {
        try {
          const raw = localStorage.getItem("agrovision_crops_" + normalizedMobile);
          return raw ? JSON.parse(raw) : null;
        } catch { return null; }
      })();
      setCurrentUser(registeredUser);
      setIsAuthenticated(true);
      if (userCrops) setCrops(userCrops);
      try {
        localStorage.setItem("agrovision_user", JSON.stringify(registeredUser));
        localStorage.setItem("agrovision_auth", JSON.stringify(true));
      } catch { /* ignore */ }
      return { success: true, user: registeredUser };
    }

    // 2. Fallback: demo personas
    const matched = farmerPersonas.find(
      (p) => p.phone.replace(/\D/g, "").includes(normalizedMobile)
    ) || {
      ...farmerPersonas[0],
      phone: mobile,
      name: "Verified Kisan (" + mobile.slice(-4) + ")",
    };
    setCurrentUser(matched);
    setIsAuthenticated(true);
    try {
      localStorage.setItem("agrovision_user", JSON.stringify(matched));
      localStorage.setItem("agrovision_auth", JSON.stringify(true));
    } catch { /* ignore */ }
    return { success: true, user: matched };
  };

  const loginWithKisanId = (kisanId) => {
    // Check registry by enamId
    const registry = getUserRegistry();
    const regMatch = registry.find(
      (u) => u.enamId?.toLowerCase() === kisanId.trim().toLowerCase()
    );
    const matched = regMatch ||
      farmerPersonas.find((p) => p.enamId.toLowerCase() === kisanId.trim().toLowerCase()) || {
        ...farmerPersonas[0],
        enamId: kisanId.toUpperCase(),
        name: "e-NAM Registered Producer",
      };
    setCurrentUser(matched);
    setIsAuthenticated(true);
    try {
      localStorage.setItem("agrovision_user", JSON.stringify(matched));
      localStorage.setItem("agrovision_auth", JSON.stringify(true));
    } catch { /* ignore */ }
    return { success: true, user: matched };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    try {
      localStorage.setItem("agrovision_auth", JSON.stringify(false));
      localStorage.removeItem("agrovision_user");
    } catch { /* ignore */ }
  };

  const switchRole = (role) => {
    const matched = farmerPersonas.find((p) => p.userRole === role) || farmerPersonas[0];
    setCurrentUser(matched);
    setIsAuthenticated(true);
    try {
      localStorage.setItem("agrovision_user", JSON.stringify(matched));
      localStorage.setItem("agrovision_auth", JSON.stringify(true));
    } catch {
      // ignore
    }
  };

  const currentRole = currentUser?.userRole || "farmer";

  // Crops inventory
  const [crops, setCrops] = useState(() => {
    try {
      const saved = localStorage.getItem("agrovision_crops");
      return saved ? JSON.parse(saved) : initialCrops;
    } catch {
      return initialCrops;
    }
  });

  const [activeCropId, setActiveCropId] = useState("crop-1");
  const activeCrop = crops.find((c) => c.id === activeCropId) || crops[0];

  // Buyer Bids state
  const [buyerBids, setBuyerBids] = useState(institutionalBuyers);

  const acceptBuyerBid = (bidId) => {
    setBuyerBids((prev) =>
      prev.map((b) => (b.id === bidId ? { ...b, status: "Accepted & Dispatched" } : b))
    );
  };

  const submitCounterOffer = (bidId, counterPrice) => {
    setBuyerBids((prev) =>
      prev.map((b) =>
        b.id === bidId
          ? {
              ...b,
              counterPrice,
              status: "Counter Sent (₹" + counterPrice + "/Qtl)",
            }
          : b
      )
    );
  };

  // Web Speech API Voice Advisory
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const stopAudioAdvisory = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
  };

  const playAudioAdvisory = (text) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert(t("audioNotSupported"));
      return;
    }

    if (isPlayingAudio) {
      stopAudioAdvisory();
      return;
    }

    const speechLanguage = normalizeLanguageCode(language);
    const preferredVoice = getPreferredSpeechVoice(speechLanguage);

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = getVoiceLanguage(speechLanguage);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Grading modal and scanned history
  const [isGradingModalOpen, setIsGradingModalOpen] = useState(false);
  const [gradingPresetCrop, setGradingPresetCrop] = useState(null);
  const [gradingHistory, setGradingHistory] = useState(() => {
    try {
      const saved = localStorage.getItem("agrovision_grading_history");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Digital Certificate Modal State
  const [activeCertificate, setActiveCertificate] = useState(null);

  // Load IndexedDB history on mount
  useEffect(() => {
    async function loadIndexedDbHistory() {
      try {
        const idbRecords = await getGradingRecords();
        if (idbRecords && idbRecords.length > 0) {
          setGradingHistory((prev) => {
            const combined = [...idbRecords, ...prev];
            const seen = new Set();
            return combined.filter((item) => {
              const key = item.id || item.lotId;
              if (seen.has(key)) return false;
              seen.add(key);
              return true;
            });
          });
        }
      } catch (err) {
        console.warn("Failed to load IndexedDB records:", err);
      }
    }
    loadIndexedDbHistory();
  }, []);

  const openCertificate = (gradingItem) => {
    setActiveCertificate(gradingItem);
  };

  const closeCertificate = () => {
    setActiveCertificate(null);
  };

  const openGradingModal = (cropType = null) => {
    setGradingPresetCrop(cropType);
    setIsGradingModalOpen(true);
  };

  const closeGradingModal = () => {
    setIsGradingModalOpen(false);
    setGradingPresetCrop(null);
  };

  const addGradingResult = (result, imagePreview) => {
    const lotId = `AGM-${(result.detectedCrop || "PROD").slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-5)}`;
    const newRecord = {
      id: "scan-" + Date.now(),
      lotId,
      scannedAt: new Date().toISOString(),
      farmerName: currentUser.name,
      district: currentUser.village || currentUser.district,
      imagePreview,
      ...result,
    };
    const updated = [newRecord, ...gradingHistory];
    setGradingHistory(updated);
    try {
      localStorage.setItem("agrovision_grading_history", JSON.stringify(updated));
    } catch {
      // ignore
    }

    // Store in IndexedDB for rural offline availability
    saveGradingRecord(newRecord).catch((err) =>
      console.warn("IndexedDB async save fallback:", err)
    );

    // Also update matching crop in crops list or add new lot
    setCrops((prev) => {
      const matchedIndex = prev.findIndex(
        (c) => c.cropType.toLowerCase() === (result.detectedCrop || "").toLowerCase()
      );
      if (matchedIndex >= 0) {
        const copy = [...prev];
        copy[matchedIndex] = {
          ...copy[matchedIndex],
          qualityGrade: result.grade,
          qualityScore: result.qualityScore,
          moisture: result.estimatedMoisture,
          status: "Graded by AI Vision",
          lotId,
          lastInspected: new Date().toLocaleDateString(),
        };
        try {
          localStorage.setItem("agrovision_crops", JSON.stringify(copy));
        } catch {
          // ignore
        }
        return copy;
      } else {
        const newLot = {
          id: "crop-" + Date.now(),
          name: `${result.detectedCrop || "Produce"} (Graded Lot)`,
          cropType: result.detectedCrop || "Produce",
          variety: "Standard Commercial",
          quantity: 50,
          lotId,
          harvestDate: new Date().toISOString().split("T")[0],
          storageLocation: "Farm Store",
          qualityGrade: result.grade,
          qualityScore: result.qualityScore,
          moisture: result.estimatedMoisture,
          status: "Graded by AI Vision",
          baseMandiPrice: 3500,
          potentialPrice: 3850,
          estimatedTotal: 192500,
        };
        const updatedCrops = [newLot, ...prev];
        try {
          localStorage.setItem("agrovision_crops", JSON.stringify(updatedCrops));
        } catch {
          // ignore
        }
        return updatedCrops;
      }
    });

    return newRecord;
  };

  const registerNewFarmer = (profileData) => {
    const stateCode = (profileData.state || "IN").slice(0, 2).toUpperCase();
    const generatedEnamId = `ENAM-${stateCode}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const acres = Number(profileData.farmSize) || 6;
    const newFarmer = {
      id: "farmer-" + Date.now(),
      name: profileData.name,
      phone: profileData.phone,
      state: profileData.state,
      district: profileData.district,
      village: profileData.village || profileData.district,
      landholding: `${acres} Acres (${acres <= 2 ? "Marginal Farmer" : acres <= 5 ? "Small Farmer" : "Medium Producer"})`,
      farmSize: acres,
      enamId: generatedEnamId,
      kccLimit: `₹${(acres * 85000).toLocaleString("en-IN")}`,
      bankBranch: `${profileData.bankName || "State Bank of India"} - ${profileData.district} Agri Branch`,
      primaryCrops: profileData.primaryCrops || ["Cotton", "Wheat"],
      password: profileData.password,
      permissions: profileData.permissions,
      registeredAt: new Date().toISOString(),
    };

    setCurrentUser(newFarmer);
    setIsAuthenticated(true);
    try {
      localStorage.setItem("agrovision_user", JSON.stringify(newFarmer));
      localStorage.setItem("agrovision_auth", JSON.stringify(true));
    } catch {
      // ignore
    }

    if (profileData.primaryCrops && profileData.primaryCrops.length > 0) {
      const seededCrops = profileData.primaryCrops.map((cropName, idx) => {
        const qty = Math.round(acres * 12 + idx * 5);
        const baseRate =
          cropName === "Cotton"
            ? 7100
            : cropName === "Soybean"
            ? 4650
            : cropName === "Onion"
            ? 2200
            : cropName === "Wheat"
            ? 2450
            : cropName === "Mustard"
            ? 5400
            : cropName === "Turmeric"
            ? 12500
            : 3200;

        return {
          id: `reg-crop-${idx + 1}`,
          name: `${cropName} (Harvested Lot)`,
          cropType: cropName,
          variety: "Commercial Hybrid",
          quantity: qty,
          lotId: `LOT-${cropName.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
          harvestDate: new Date().toISOString().split("T")[0],
          storageLocation: `${profileData.village || profileData.district} Farm Shed`,
          qualityGrade: "Grade A",
          qualityScore: 88,
          moisture: "9.2%",
          status: "Ready for Mandi / Storage",
          baseMandiPrice: baseRate,
          potentialPrice: Math.round(baseRate * 1.09),
          estimatedTotal: Math.round(qty * baseRate * 1.09),
        };
      });
      setCrops(seededCrops);
      setActiveCropId(seededCrops[0].id);
      try {
        localStorage.setItem("agrovision_crops", JSON.stringify(seededCrops));
      } catch {
        // ignore
      }
    }

    return newFarmer;
  };

  const addCrop = (newCrop) => {
    const item = {
      id: "crop-" + Date.now(),
      lotId: `LOT-${Date.now().toString().slice(-6)}`,
      ...newCrop,
    };
    const updated = [item, ...crops];
    setCrops(updated);
    try {
      localStorage.setItem("agrovision_crops", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  return (
    <AppContext.Provider
      value={{
        language,
        locale: language,
        setLanguage,
        setLocale: setLanguage,
        t,
        formatCurrency,
        formatNumber,
        formatDate,
        supportedLocales,
        isOnline,
        permissions,
        updatePermission,
        registerNewFarmer,
        currentUser,
        isAuthenticated,
        loginWithPersona,
        loginWithOtp,
        loginWithKisanId,
        logout,
        currentRole,
        switchRole,
        crops,
        activeCrop,
        setActiveCropId,
        addCrop,
        marketPrices: liveMandiPrices,
        liveMandiPrices,
        mandiDataSource,
        isLoadingMandi,
        refreshMandiPrices,
        liveWeather,
        refreshWeather,
        formatCropName,
        sellingStrategies,
        marketAlerts,
        buyerBids,
        acceptBuyerBid,
        submitCounterOffer,
        isPlayingAudio,
        playAudioAdvisory,
        stopAudioAdvisory,
        isGradingModalOpen,
        gradingPresetCrop,
        openGradingModal,
        closeGradingModal,
        gradingHistory,
        addGradingResult,
        activeCertificate,
        openCertificate,
        closeCertificate,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
