import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import fc from 'fast-check'
import { useCountdown, calculateCountdown } from '../hooks/useCountdown'

// ─── Unit Tests ────────────────────────────────────────────────────────────────

describe('calculateCountdown', () => {
  it('returns isExpired=true and all zeros for past date', () => {
    const pastDate = new Date(Date.now() - 10_000).toISOString()
    const result = calculateCountdown(pastDate)
    expect(result.isExpired).toBe(true)
    expect(result.days).toBe(0)
    expect(result.hours).toBe(0)
    expect(result.minutes).toBe(0)
    expect(result.seconds).toBe(0)
  })

  it('returns isExpired=false for future date', () => {
    const futureDate = new Date(Date.now() + 86_400_000).toISOString()
    const result = calculateCountdown(futureDate)
    expect(result.isExpired).toBe(false)
    expect(result.days).toBeGreaterThanOrEqual(0)
  })

  it('returns approximately 1 day for a date 1 day in the future', () => {
    const futureDate = new Date(Date.now() + 86_400_000 + 5000).toISOString()
    const result = calculateCountdown(futureDate)
    expect(result.days).toBe(1)
    expect(result.hours).toBe(0)
    expect(result.minutes).toBe(0)
  })

  it('all values are always >= 0', () => {
    const futureDate = new Date(Date.now() + 3_661_000).toISOString()
    const result = calculateCountdown(futureDate)
    expect(result.days).toBeGreaterThanOrEqual(0)
    expect(result.hours).toBeGreaterThanOrEqual(0)
    expect(result.minutes).toBeGreaterThanOrEqual(0)
    expect(result.seconds).toBeGreaterThanOrEqual(0)
  })
})

describe('useCountdown hook', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('initializes with correct countdown values', () => {
    const futureDate = new Date(Date.now() + 3_661_000).toISOString()
    const { result } = renderHook(() => useCountdown(futureDate))
    expect(result.current.isExpired).toBe(false)
    expect(result.current.hours).toBe(1)
    expect(result.current.minutes).toBe(1)
    expect(result.current.seconds).toBe(1)
  })

  it('updates every second', () => {
    const futureDate = new Date(Date.now() + 5_000).toISOString()
    const { result } = renderHook(() => useCountdown(futureDate))
    expect(result.current.seconds).toBe(5)

    act(() => { vi.advanceTimersByTime(1000) })
    expect(result.current.seconds).toBe(4)
  })

  it('sets isExpired=true when countdown reaches zero', () => {
    const futureDate = new Date(Date.now() + 2_000).toISOString()
    const { result } = renderHook(() => useCountdown(futureDate))
    expect(result.current.isExpired).toBe(false)

    act(() => { vi.advanceTimersByTime(3_000) })
    expect(result.current.isExpired).toBe(true)
    expect(result.current.days).toBe(0)
    expect(result.current.hours).toBe(0)
    expect(result.current.minutes).toBe(0)
    expect(result.current.seconds).toBe(0)
  })
})

// ─── Property Tests (Property 5 & 6) ──────────────────────────────────────────

describe('Property 5: Countdown Non-Negative', () => {
  it('all values are >= 0 for any future date (fast-check)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 365 * 24 * 3600 }).map((seconds) =>
          new Date(Date.now() + seconds * 1000).toISOString()
        ),
        (futureDate) => {
          const result = calculateCountdown(futureDate)
          expect(result.days).toBeGreaterThanOrEqual(0)
          expect(result.hours).toBeGreaterThanOrEqual(0)
          expect(result.minutes).toBeGreaterThanOrEqual(0)
          expect(result.seconds).toBeGreaterThanOrEqual(0)
          expect(result.isExpired).toBe(false)
        }
      )
    )
  })
})

describe('Property 6: Countdown Arithmetic Invariant', () => {
  it('days*86400 + hours*3600 + minutes*60 + seconds equals total seconds remaining (fast-check)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 365 * 24 * 3600 }).map((totalSeconds) => ({
          totalSeconds,
          futureDate: new Date(Date.now() + totalSeconds * 1000).toISOString(),
        })),
        ({ totalSeconds, futureDate }) => {
          const result = calculateCountdown(futureDate)
          const computed =
            result.days * 86400 +
            result.hours * 3600 +
            result.minutes * 60 +
            result.seconds

          // Allow ±1 second tolerance due to execution time
          expect(Math.abs(computed - totalSeconds)).toBeLessThanOrEqual(1)
        }
      )
    )
  })
})
