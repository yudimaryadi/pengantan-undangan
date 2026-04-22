'use client'

import { useState, useEffect } from 'react'

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface CountdownResult {
  days: number
  hours: number
  minutes: number
  seconds: number
  isExpired: boolean
}

// ─── Helper ────────────────────────────────────────────────────────────────────

/**
 * Calculates the remaining time from now to targetDate.
 * All values are always >= 0.
 *
 * Requirements: 5.1, 5.3, 5.5
 */
export function calculateCountdown(targetDate: string): CountdownResult {
  const now = Date.now()
  const diff = new Date(targetDate).getTime() - now

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true }
  }

  const days    = Math.floor(diff / 86_400_000)
  const hours   = Math.floor((diff % 86_400_000) / 3_600_000)
  const minutes = Math.floor((diff % 3_600_000) / 60_000)
  const seconds = Math.floor((diff % 60_000) / 1_000)

  return { days, hours, minutes, seconds, isExpired: false }
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

/**
 * Custom hook that provides a real-time countdown to a target date.
 * Updates every 1000ms. Clears interval when expired or unmounted.
 *
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.7, 5.8
 */
export function useCountdown(targetDate: string): CountdownResult {
  const [countdown, setCountdown] = useState<CountdownResult>(() =>
    calculateCountdown(targetDate)
  )

  useEffect(() => {
    // If already expired on mount, no need to start interval
    if (countdown.isExpired) return

    const interval = setInterval(() => {
      const result = calculateCountdown(targetDate)
      setCountdown(result)

      if (result.isExpired) {
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetDate])

  return countdown
}
