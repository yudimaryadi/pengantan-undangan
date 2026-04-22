import { describe, it, expect, beforeEach, vi } from 'vitest'
import fc from 'fast-check'
import { safeGetItem, safeSetItem, isLocalStorageAvailable } from '../lib/storage'

// ─── Unit Tests ────────────────────────────────────────────────────────────────

describe('safeGetItem', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns stored value when key exists', () => {
    localStorage.setItem('test-key', 'test-value')
    expect(safeGetItem('test-key')).toBe('test-value')
  })

  it('returns null when key does not exist', () => {
    expect(safeGetItem('nonexistent-key')).toBeNull()
  })

  it('returns null when localStorage throws', () => {
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Storage unavailable')
    })
    expect(safeGetItem('any-key')).toBeNull()
    spy.mockRestore()
  })
})

describe('safeSetItem', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('stores value and returns true on success', () => {
    const result = safeSetItem('test-key', 'test-value')
    expect(result).toBe(true)
    expect(localStorage.getItem('test-key')).toBe('test-value')
  })

  it('returns false when localStorage throws (e.g., storage full)', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('QuotaExceededError')
    })
    expect(safeSetItem('any-key', 'any-value')).toBe(false)
    spy.mockRestore()
  })
})

describe('isLocalStorageAvailable', () => {
  it('returns true when localStorage is available', () => {
    expect(isLocalStorageAvailable()).toBe(true)
  })

  it('returns false when localStorage throws', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Storage unavailable')
    })
    expect(isLocalStorageAvailable()).toBe(false)
    spy.mockRestore()
  })
})

// ─── Property Tests (Property 9) ──────────────────────────────────────────────

describe('Property 9: Safe Storage Never Throws', () => {
  it('safeGetItem never throws for any key (fast-check)', () => {
    fc.assert(
      fc.property(fc.string(), (key) => {
        expect(() => safeGetItem(key)).not.toThrow()
      })
    )
  })

  it('safeSetItem never throws for any key/value (fast-check)', () => {
    fc.assert(
      fc.property(fc.string(), fc.string(), (key, value) => {
        expect(() => safeSetItem(key, value)).not.toThrow()
      })
    )
  })

  it('safeGetItem never throws even when localStorage is broken (fast-check)', () => {
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Storage unavailable')
    })
    fc.assert(
      fc.property(fc.string(), (key) => {
        expect(() => safeGetItem(key)).not.toThrow()
        expect(safeGetItem(key)).toBeNull()
      })
    )
    spy.mockRestore()
  })

  it('safeSetItem never throws even when localStorage is broken (fast-check)', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('QuotaExceededError')
    })
    fc.assert(
      fc.property(fc.string(), fc.string(), (key, value) => {
        expect(() => safeSetItem(key, value)).not.toThrow()
        expect(safeSetItem(key, value)).toBe(false)
      })
    )
    spy.mockRestore()
  })
})
