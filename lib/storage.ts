// lib/storage.ts — Safe localStorage wrapper
// Handles all localStorage errors gracefully without throwing exceptions.
// Requirements: 11.1, 11.2, 11.3, 11.4, 11.5

/**
 * Safely retrieves a value from localStorage.
 * Returns the stored string value, or null if the key doesn't exist
 * or if localStorage is unavailable (private mode, storage full, etc.).
 *
 * Never throws an exception.
 */
export function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

/**
 * Safely stores a value in localStorage.
 * Returns true if the value was stored successfully,
 * or false if localStorage is unavailable or storage is full.
 *
 * Never throws an exception.
 */
export function safeSetItem(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value)
    return true
  } catch {
    return false
  }
}

/**
 * Checks if localStorage is available in the current environment.
 * Useful for showing fallback UI when storage is not available.
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__storage_test__'
    localStorage.setItem(testKey, '1')
    localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}
