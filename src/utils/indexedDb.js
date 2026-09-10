/**
 * IndexedDB Utility for AgroVision AI
 * Provides offline-first persistence for crop quality assessments,
 * camera photos, and market transaction records in rural areas with poor connectivity.
 */

const DB_NAME = "AgroVisionDB";
const DB_VERSION = 1;
const STORE_GRADING = "grading_records";
const STORE_OFFLINE_CACHE = "offline_cache";

/**
 * Open or upgrade the IndexedDB database
 */
export function openDB() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      console.warn("IndexedDB not supported in this browser; falling back to local memory.");
      reject(new Error("IndexedDB not supported"));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error("IndexedDB open failed:", request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Store for Produce Quality Grading inspection records
      if (!db.objectStoreNames.contains(STORE_GRADING)) {
        const gradingStore = db.createObjectStore(STORE_GRADING, {
          keyPath: "id",
        });
        gradingStore.createIndex("crop", "crop", { unique: false });
        gradingStore.createIndex("timestamp", "timestamp", { unique: false });
        gradingStore.createIndex("grade", "grade", { unique: false });
      }

      // Key-value store for offline sync cache
      if (!db.objectStoreNames.contains(STORE_OFFLINE_CACHE)) {
        db.createObjectStore(STORE_OFFLINE_CACHE, {
          keyPath: "key",
        });
      }
    };
  });
}

/**
 * Save a produce grading record to IndexedDB
 */
export async function saveGradingRecord(record) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_GRADING], "readwrite");
      const store = transaction.objectStore(STORE_GRADING);
      const recordWithMeta = {
        ...record,
        id: record.id || `lot-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        savedAt: new Date().toISOString(),
        offlineSynced: true,
      };

      const request = store.put(recordWithMeta);

      request.onsuccess = () => {
        resolve(recordWithMeta);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (err) {
    console.warn("IndexedDB write failed, falling back to localStorage:", err);
    try {
      const existing = JSON.parse(localStorage.getItem("agrovision_grading_history") || "[]");
      const recordWithMeta = {
        ...record,
        id: record.id || `lot-${Date.now()}`,
        savedAt: new Date().toISOString(),
        offlineSynced: true,
      };
      existing.unshift(recordWithMeta);
      localStorage.setItem("agrovision_grading_history", JSON.stringify(existing.slice(0, 30)));
      return recordWithMeta;
    } catch {
      return record;
    }
  }
}

/**
 * Retrieve all grading records sorted by latest timestamp
 */
export async function getGradingRecords() {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_GRADING], "readonly");
      const store = transaction.objectStore(STORE_GRADING);
      const request = store.getAll();

      request.onsuccess = () => {
        const records = request.result || [];
        // Sort descending by timestamp / savedAt
        records.sort((a, b) => new Date(b.savedAt || b.timestamp) - new Date(a.savedAt || a.timestamp));
        resolve(records);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (err) {
    console.warn("IndexedDB read failed, falling back to localStorage:", err);
    try {
      const existing = JSON.parse(localStorage.getItem("agrovision_grading_history") || "[]");
      return existing;
    } catch {
      return [];
    }
  }
}

/**
 * Delete a grading record from IndexedDB by ID
 */
export async function deleteGradingRecord(id) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_GRADING], "readwrite");
      const store = transaction.objectStore(STORE_GRADING);
      const request = store.delete(id);

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn("IndexedDB delete failed:", err);
    return false;
  }
}

/**
 * Clear all grading records from IndexedDB
 */
export async function clearGradingRecords() {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_GRADING], "readwrite");
      const store = transaction.objectStore(STORE_GRADING);
      const request = store.clear();

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn("IndexedDB clear failed:", err);
    return false;
  }
}

/**
 * Save generic offline cache data (e.g. weather cache, price cache)
 */
export async function setOfflineCache(key, data) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_OFFLINE_CACHE], "readwrite");
      const store = transaction.objectStore(STORE_OFFLINE_CACHE);
      const request = store.put({ key, data, cachedAt: Date.now() });

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  } catch {
    try {
      localStorage.setItem(`agrovision_cache_${key}`, JSON.stringify({ data, cachedAt: Date.now() }));
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Get generic offline cache data
 */
export async function getOfflineCache(key) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_OFFLINE_CACHE], "readonly");
      const store = transaction.objectStore(STORE_OFFLINE_CACHE);
      const request = store.get(key);

      request.onsuccess = () => {
        resolve(request.result ? request.result.data : null);
      };
      request.onerror = () => reject(request.error);
    });
  } catch {
    try {
      const item = localStorage.getItem(`agrovision_cache_${key}`);
      return item ? JSON.parse(item).data : null;
    } catch {
      return null;
    }
  }
}
