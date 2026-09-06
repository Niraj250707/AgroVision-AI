// Central API client placeholder.
//
// TODAY: every service in this folder resolves with local mock data.
// LATER: point BASE_URL at the FastAPI backend and swap each service's
// body for a `request()` call — the function signatures below are already
// shaped like a real HTTP client so pages/components never need to change.
//
//   UI -> service -> mock data            (current)
//   UI -> service -> FastAPI -> DB/ML/API  (future)

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Simulates network latency so loading states are visible/testable in the prototype.
export function mockDelay(data, ms = 350) {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

// Placeholder for the real fetch wrapper. Not called yet — kept here so the
// shape (auth headers, error handling, JSON parsing) is already agreed on.
export async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API request failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}
