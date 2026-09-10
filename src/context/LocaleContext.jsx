import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { translations } from "../i18n/translations";

/**
 * Centralized Locale Context for Agrovision AI.
 * Ensures all static and dynamic text components throughout the tree
 * re-render immediately upon language selection.
 */

export const SUPPORTED_LOCALES = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇮🇳",
    speechCode: "en-IN",
    greeting: "Namaste",
  },
  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    flag: "🇮🇳",
    speechCode: "hi-IN",
    greeting: "नमस्ते",
  },
  {
    code: "mr",
    name: "Marathi",
    nativeName: "मराठी",
    flag: "🇮🇳",
    speechCode: "mr-IN",
    greeting: "नमस्कार",
  },
  {
    code: "gu",
    name: "Gujarati",
    nativeName: "ગુજરાતી",
    flag: "🇮🇳",
    speechCode: "gu-IN",
    greeting: "નમસ્તે",
  },
];

export const normalizeLocaleCode = (lang) => {
  const value = String(lang || "en").trim().toLowerCase();
  if (["hi", "hindi", "hin"].includes(value)) return "hi";
  if (["mr", "marathi", "mar"].includes(value)) return "mr";
  if (["gu", "gujarati", "guj"].includes(value)) return "gu";
  return "en";
};

const LocaleContext = createContext(null);

export function LocaleProvider({ children }) {
  // Initialize from localStorage or navigator
  const [locale, setLocaleState] = useState(() => {
    try {
      const stored = localStorage.getItem("agrovision_lang");
      if (stored) return normalizeLocaleCode(stored);
      if (typeof navigator !== "undefined" && navigator.language) {
        const navLang = navigator.language.split("-")[0];
        if (["hi", "mr", "gu"].includes(navLang)) return navLang;
      }
    } catch {
      // ignore
    }
    // Default to Marathi if no preference found
    return "mr";
  });

  // Keep document lang, dir, and storage synced immediately
  useEffect(() => {
    try {
      localStorage.setItem("agrovision_lang", locale);
    } catch {
      // ignore
    }

    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
      document.documentElement.setAttribute("data-locale", locale);
      document.documentElement.dir = "ltr";
    }

    // Broadcast event for any external or legacy subscribers
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("agrovision:locale-changed", { detail: { locale } })
      );
    }
  }, [locale]);

  // Set locale with immediate state update
  const setLocale = useCallback((newLocale) => {
    const normalized = normalizeLocaleCode(newLocale);
    setLocaleState((prev) => (prev === normalized ? prev : normalized));
  }, []);

  // Backwards compatibility alias
  const setLanguage = setLocale;

  // Translation function with fallback cascade and string interpolation
  const t = useCallback(
    (key, paramsOrFallback = "") => {
      if (!key) return "";

      const currentDict = translations[locale] || translations.en;
      let rawString = currentDict?.[key];

      // Fallback to English dictionary if missing in current locale
      if (rawString === undefined && translations.en) {
        rawString = translations.en[key];
      }

      // If still missing, check if paramsOrFallback is a fallback string
      if (rawString === undefined) {
        if (typeof paramsOrFallback === "string" && paramsOrFallback.length > 0) {
          rawString = paramsOrFallback;
        } else {
          return key;
        }
      }

      // If paramsOrFallback is an object, perform string interpolation
      if (
        paramsOrFallback &&
        typeof paramsOrFallback === "object" &&
        !Array.isArray(paramsOrFallback)
      ) {
        let interpolated = String(rawString);
        Object.entries(paramsOrFallback).forEach(([k, v]) => {
          const value = v !== undefined && v !== null ? String(v) : "";
          interpolated = interpolated
            .replace(new RegExp(`\\{\\{${k}\\}\\}`, "g"), value)
            .replace(new RegExp(`\\{${k}\\}`, "g"), value);
        });
        return interpolated;
      }

      return rawString;
    },
    [locale]
  );

  // Regional crop name formatter
  const formatCropName = useCallback(
    (cropName) => {
      if (!cropName) return "";
      const lower = String(cropName).toLowerCase();
      if (lower.includes("cotton") || lower.includes("कपास") || lower.includes("કપાસ")) {
        return t("cropCotton", "Cotton");
      }
      if (
        lower.includes("onion") ||
        lower.includes("कांदा") ||
        lower.includes("ડુંગળી") ||
        lower.includes("प्याज")
      ) {
        return t("cropOnion", "Red Onion");
      }
      if (lower.includes("soy") || lower.includes("सोया")) {
        return t("cropSoybean", "Soybean");
      }
      if (lower.includes("wheat") || lower.includes("गेहूं") || lower.includes("ઘઉં")) {
        return t("cropWheat", "Wheat");
      }
      return cropName;
    },
    [t]
  );

  // Localized Currency Formatter (INR with Lakhs / Crores)
  const formatCurrency = useCallback(
    (amount, options = {}) => {
      const num = Number(amount) || 0;
      const localeMap = {
        en: "en-IN",
        hi: "hi-IN",
        mr: "mr-IN",
        gu: "gu-IN",
      };
      const intlLocale = localeMap[locale] || "en-IN";
      try {
        return new Intl.NumberFormat(intlLocale, {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0,
          ...options,
        }).format(num);
      } catch {
        return `₹${num.toLocaleString("en-IN")}`;
      }
    },
    [locale]
  );

  // Localized Number Formatter
  const formatNumber = useCallback(
    (num, options = {}) => {
      const val = Number(num) || 0;
      const localeMap = {
        en: "en-IN",
        hi: "hi-IN",
        mr: "mr-IN",
        gu: "gu-IN",
      };
      const intlLocale = localeMap[locale] || "en-IN";
      try {
        return new Intl.NumberFormat(intlLocale, options).format(val);
      } catch {
        return val.toLocaleString();
      }
    },
    [locale]
  );

  // Localized Date Formatter
  const formatDate = useCallback(
    (dateInput, options = {}) => {
      if (!dateInput) return "";
      const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
      if (isNaN(date.getTime())) return String(dateInput);
      const localeMap = {
        en: "en-IN",
        hi: "hi-IN",
        mr: "mr-IN",
        gu: "gu-IN",
      };
      const intlLocale = localeMap[locale] || "en-IN";
      try {
        return new Intl.DateTimeFormat(intlLocale, {
          day: "numeric",
          month: "short",
          year: "numeric",
          ...options,
        }).format(date);
      } catch {
        return date.toLocaleDateString();
      }
    },
    [locale]
  );

  const activeLocaleMeta = useMemo(() => {
    return (
      SUPPORTED_LOCALES.find((l) => l.code === locale) || SUPPORTED_LOCALES[0]
    );
  }, [locale]);

  const value = useMemo(
    () => ({
      locale,
      language: locale, // backwards compatible alias
      setLocale,
      setLanguage, // backwards compatible alias
      t,
      formatCropName,
      formatCurrency,
      formatNumber,
      formatDate,
      supportedLocales: SUPPORTED_LOCALES,
      activeLocaleMeta,
      isRTL: false,
    }),
    [
      locale,
      setLocale,
      setLanguage,
      t,
      formatCropName,
      formatCurrency,
      formatNumber,
      formatDate,
      activeLocaleMeta,
    ]
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}

export default LocaleContext;
